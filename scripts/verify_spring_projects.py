"""Runs the required automatic checks of the Spring month-end projects against their reference solutions.

For every project under source/Spring/projects the reference folder is copied to a temporary Maven project together with the
check sources of tests/spring-projects (`_common` and `<project id>`). Maven then compiles it and runs the tests, which use the
real MySQL, MyBatis, MockMvc and an embedded Tomcat that renders the JSP pages. The outcome is written to the project's
review.json (compile, unit, dbIntegration, httpIntegration, jspRender) with the reference and environment it ran against,
so changed code or a changed environment makes the record expire. The manual STS step is never touched.

The database is required: without SPRING_VERIFY_DB_URL, SPRING_VERIFY_DB_USER and SPRING_VERIFY_DB_PASSWORD the run fails.
Exit code 1 means a required step failed or could not run.
"""
from __future__ import annotations

import argparse
import copy
import datetime
import json
import os
import shutil
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ET
from pathlib import Path

from validate_projects import ROOT, environment_hash, load_environment, project_folders, reference_hash
from verify_spring_answers import COMPARED, compare_environment, find_maven, read_observations, require_database_env

CHECKS = ROOT / "tests" / "spring-projects"
CATEGORIES = {"unit": "UnitTests", "dbIntegration": "DbTests", "httpIntegration": "HttpTests", "jspRender": "JspTests"}
NOT_RUN = {"status": "unverified", "note": "이전 단계가 실패해 실행하지 않았습니다"}


def parse_surefire(folder: Path) -> dict:
    """Test counts per simple class name from Maven Surefire's XML reports."""
    summary: dict[str, dict] = {}
    for path in sorted(Path(folder).glob("TEST-*.xml")):
        suite = ET.parse(path).getroot()
        name = suite.get("name", path.stem[len("TEST-"):]).rsplit(".", 1)[-1]
        item = summary.setdefault(name, {"tests": 0, "failed": 0, "skipped": 0})
        item["tests"] += int(suite.get("tests", 0))
        item["failed"] += int(suite.get("failures", 0)) + int(suite.get("errors", 0))
        item["skipped"] += int(suite.get("skipped", 0))
    return summary


def step_results(compiled: bool, summary: dict, has_jsp: bool) -> dict:
    steps = {"compile": {"status": "passed" if compiled else "failed", "note": "main과 test 소스를 컴파일했습니다" if compiled else "컴파일에 실패했습니다"}}
    for step, cls in CATEGORIES.items():
        if step == "jspRender" and not has_jsp:
            steps[step] = {"status": "not-applicable", "note": "JSP 파일이 없습니다"}
        elif not compiled:
            steps[step] = dict(NOT_RUN)
        elif cls not in summary or not summary[cls]["tests"]:
            steps[step] = {"status": "unverified", "note": f"{cls}가 실행되지 않았습니다"}
        else:
            item = summary[cls]
            ok = item["failed"] == 0 and item["skipped"] == 0
            note = f"테스트 {item['tests']}건 통과" if ok else f"테스트 {item['tests']}건 중 실패 {item['failed']}건, 건너뜀 {item['skipped']}건"
            steps[step] = {"status": "passed" if ok else "failed", "note": note}
    return steps


def apply_results(review: dict, steps: dict, reference: str, environment: str, today: str) -> dict:
    updated = copy.deepcopy(review)
    verification = updated["verification"]
    for name, result in steps.items():
        verification["steps"][name] = result
    verification.update(verifiedReferenceHash=reference, environmentHash=environment, verifiedAt=today, reviewer="verify_spring_projects.py")
    return updated


def runtime_env(source=None) -> dict:
    source = dict(os.environ if source is None else source)
    require_database_env(source)
    return {**source, "DB_URL": source["SPRING_VERIFY_DB_URL"], "DB_USER": source["SPRING_VERIFY_DB_USER"], "DB_PASSWORD": source["SPRING_VERIFY_DB_PASSWORD"]}


def prepare_workspace(pid: str, work: Path) -> None:
    """Reference files plus the check sources, laid out as one Maven project."""
    project = ROOT / "source" / "Spring" / "projects" / pid
    shutil.copytree(project / "reference", work)
    for source in (CHECKS / "_common", CHECKS / pid):
        if (source / "java").is_dir():
            shutil.copytree(source / "java", work / "src" / "test" / "java", dirs_exist_ok=True)
        if (source / "resources").is_dir():
            shutil.copytree(source / "resources", work / "src" / "test" / "resources", dirs_exist_ok=True)


def prepare_template_workspace(pid: str, stage: int, work: Path) -> None:
    """What a learner starts from: the provided files plus the template of one stage, with the same check sources."""
    project = ROOT / "source" / "Spring" / "projects" / pid
    shutil.copytree(project / "starter", work)
    shutil.copytree(project / "stages" / str(stage), work, dirs_exist_ok=True)
    for source in (CHECKS / "_common", CHECKS / pid):
        if (source / "java").is_dir():
            shutil.copytree(source / "java", work / "src" / "test" / "java", dirs_exist_ok=True)
        if (source / "resources").is_dir():
            shutil.copytree(source / "resources", work / "src" / "test" / "resources", dirs_exist_ok=True)


def template_passes(pid: str, stage: int, env: dict) -> bool:
    """True when an unfinished template wrongly passes every check, which would make the checks worthless."""
    with tempfile.TemporaryDirectory(prefix="spring-template-check-") as tmp:
        work = Path(tmp) / "project"
        prepare_template_workspace(pid, stage, work)
        if maven(work, env, "test-compile") != 0:
            return False
        maven(work, env, "test")
        reports = work / "target" / "surefire-reports"
        summary = parse_surefire(reports) if reports.is_dir() else {}
        steps = step_results(True, summary, has_jsp=True)
        return all(step["status"] == "passed" for name, step in steps.items() if name != "compile")


def maven(work: Path, env: dict, *goals: str) -> int:
    done = subprocess.run([find_maven(), "-B", "-q", "-f", str(work / "pom.xml"), *goals], env=env, capture_output=True, text=True, encoding="utf-8", errors="replace")
    if done.returncode:
        sys.stderr.write((done.stdout + done.stderr)[-3000:])
    return done.returncode


def verify_project(pid: str, env: dict, keep: bool = False) -> dict:
    project_dir = ROOT / "source" / "Spring" / "projects" / pid
    project = json.loads((project_dir / "project.json").read_text(encoding="utf-8"))
    has_jsp = any(entry["path"].endswith(".jsp") for entry in project["files"])
    with tempfile.TemporaryDirectory(prefix="spring-project-check-") as tmp:
        work = Path(tmp) / "project"
        prepare_workspace(pid, work)
        compiled = maven(work, env, "test-compile") == 0
        summary, observed = {}, {}
        if compiled:
            maven(work, env, "test")
            reports = work / "target" / "surefire-reports"
            summary = parse_surefire(reports) if reports.is_dir() else {}
            observations = work / "target" / "observations"
            observed = read_observations(observations)[1] if observations.is_dir() else {}
        steps = step_results(compiled, summary, has_jsp)
    return {"project": pid, "steps": steps, "observedEnvironment": observed, "hasJsp": has_jsp}


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--project", help="verify only this project")
    parser.add_argument("--report", default="reports/spring-project-verification.json")
    parser.add_argument("--templates", action="store_true", help="also run the unfinished stage templates, which must not pass")
    args = parser.parse_args(argv)
    source = ROOT / "source"
    folders = project_folders(source, "spring")
    if args.project:
        folders = [f for f in folders if f.name == args.project]
        if not folders:
            raise SystemExit(f"unknown project: {args.project}")
    if not folders:
        print("Spring project checks: no projects")
        return 1
    env = runtime_env()
    environment = load_environment(source, "spring")
    results, failed = [], 0
    for folder in folders:
        outcome = verify_project(folder.name, env)
        # A project without Spring Security does not report its version, so only the libraries it really uses are compared.
        used = dict(environment["versions"])
        if "spring-boot-starter-security" not in (folder / "reference" / "pom.xml").read_text(encoding="utf-8"):
            used.pop("springSecurity", None)
        observed = {k: v for k, v in outcome["observedEnvironment"].items() if k in used}
        problems = compare_environment(used, observed) if outcome["steps"]["compile"]["status"] == "passed" else []
        review_path = folder / "review.json"
        review = json.loads(review_path.read_text(encoding="utf-8"))
        updated = apply_results(review, outcome["steps"], reference_hash(folder), environment_hash(environment), datetime.date.today().isoformat())
        review_path.write_text(json.dumps(updated, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
        bad = [name for name, step in outcome["steps"].items() if step["status"] not in ("passed", "not-applicable")]
        failed += bool(bad or problems)
        for problem in problems:
            print(f"{folder.name}: {problem}")
        print(f"{folder.name}: " + ", ".join(f"{name} {step['status']}" for name, step in outcome["steps"].items()))
        results.append({"project": folder.name, "steps": outcome["steps"], "environmentProblems": problems})
        if args.templates:
            for stage in (1, 2, 3):
                passed = template_passes(folder.name, stage, env)
                print(f"{folder.name}: stage {stage} template " + ("passes the checks (wrong)" if passed else "fails the checks"))
                failed += passed
                results[-1].setdefault("templates", {})[str(stage)] = "wrongly-passes" if passed else "fails"
    target = Path(args.report)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps({"projects": results, "failed": failed, "compared": list(COMPARED)}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    print(f"Spring projects: {len(results) - failed} verified / {len(results)}")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
