"""Runs the Spring track answers against a real Spring, MyBatis and MySQL environment.

tests/spring-runtime is a Maven project whose tests write what they observed, one file per case, to
target/observations. A question listed in source/Spring/spring-checks.json passes only when every observation it names
matches and the correct choice (or an accepted answer) carries the observed fact. The other questions need a re-solve record
in spring-reviews.json for the current revision; the author's own re-solve is recorded as independent: false.
The database is required: without SPRING_VERIFY_DB_URL, SPRING_VERIFY_DB_USER and SPRING_VERIFY_DB_PASSWORD the run fails.
--source-root takes a folder that contains Spring/, so a private pilot never touches the public data.
"""
import argparse
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

from build_data import ROOT, parse_exam

RUNTIME = ROOT / "tests" / "spring-runtime"
DB_VARS = ("SPRING_VERIFY_DB_URL", "SPRING_VERIFY_DB_USER", "SPRING_VERIFY_DB_PASSWORD")
COMPARED = ("javaRuntime", "springBoot", "springFramework", "springSecurity", "mybatis", "mysqlServer", "mysqlDriver")


def load_exams(source_root):
    return [parse_exam(path.parent) for path in sorted((Path(source_root) / "Spring").glob("*/exam.json"))]


def read_json(path, default):
    path = Path(path)
    return json.loads(path.read_text(encoding="utf-8-sig")) if path.is_file() else default


def read_observations(folder):
    observations, environment = {}, {}
    for path in sorted(Path(folder).glob("*.txt")):
        text = path.read_text(encoding="utf-8").strip()
        if path.stem == "environment":
            environment = json.loads(text)
        else:
            observations[path.stem] = text
    return observations, environment


def compare_environment(recorded, observed):
    problems = []
    for key in COMPARED:
        if key not in observed:
            problems.append(f"environment: {key} was not reported by the run")
        elif key not in recorded:
            problems.append(f"environment: {key} is not recorded in environment-spring.json")
        elif str(recorded[key]) != str(observed[key]):
            problems.append(f"environment: {key} recorded {recorded[key]} but the run used {observed[key]}")
    return problems


def require_database_env(env):
    missing = [name for name in DB_VARS if not env.get(name)]
    if missing:
        raise SystemExit("Spring answer checks need a database and never skip it. Missing: " + ", ".join(missing))


def find_maven():
    found = shutil.which("mvn") or shutil.which("mvn.cmd")
    if found:
        return found
    name = "mvn.cmd" if os.name == "nt" else "mvn"
    for candidate in sorted((ROOT / "private" / "spring" / "tools").glob("apache-maven-*/bin/" + name)):
        if candidate.is_file():
            return str(candidate)
    raise SystemExit("Maven was not found. Install Maven 3.9 or put it under private/spring/tools.")


def run_runtime():
    require_database_env(os.environ)
    folder = RUNTIME / "target" / "observations"
    if folder.exists():
        shutil.rmtree(folder)
    done = subprocess.run([find_maven(), "-B", "-q", "-f", str(RUNTIME / "pom.xml"), "verify"], capture_output=True, text=True, encoding="utf-8", errors="replace")
    if done.returncode:
        sys.stderr.write((done.stdout + done.stderr)[-4000:])
    return folder, done.returncode


def verify_exam(exam, checks, reviews, observations):
    results = []
    by_id = {q["id"]: q for q in exam["questions"]}
    done = set()
    for check in checks:
        q = by_id.get(check["questionId"])
        record = {"questionId": check["questionId"], "revision": check.get("revision"), "method": "run"}
        if q is None:
            record.update(passed=False, detail="the check names a question that is not in this exam")
            results.append(record)
            continue
        if q["revision"] != check["revision"]:
            record.update(passed=False, detail=f"revision {q['revision']} of the question does not match the check for revision {check['revision']}")
        else:
            problems = []
            for case, expected in check["cases"].items():
                if case not in observations:
                    problems.append(f"case {case} did not run")
                elif observations[case] != expected:
                    problems.append(f"case {case} observed '{observations[case]}' but the check expects '{expected}'")
            if q["type"] == "mc":
                right = next(c["text"] for c in q["choices"] if c["id"] == q["correctChoiceId"])
                problems += [f"the correct choice does not contain '{part}'" for part in check.get("correctChoiceContains", []) if part not in right]
            elif q["type"] == "short":
                problems += [f"accepted answers do not contain '{part}'" for part in check.get("acceptedContains", []) if part not in q["acceptedAnswers"]]
            record.update(passed=not problems, detail="; ".join(problems), cases=sorted(check["cases"]))
        results.append(record)
        done.add(q["id"])
    for q in exam["questions"]:
        if q["id"] in done:
            continue
        review = next((r for r in reviews if r["questionId"] == q["id"] and r["revision"] == q["revision"]), None)
        valid = bool(review) and review.get("independent") is False and review.get("reviewer") and review.get("note")
        results.append({"questionId": q["id"], "revision": q["revision"], "method": "review", "passed": bool(valid), "independent": False,
                        "detail": review["note"] if valid else "no valid re-solve record for this revision"})
    return results


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--source-root", default=str(ROOT / "source"))
    parser.add_argument("--report", default="reports/spring-verification.json")
    parser.add_argument("--observations", help="read observations from this folder instead of running Maven")
    args = parser.parse_args(argv)
    spring = Path(args.source_root) / "Spring"
    recorded = read_json(spring / "environment-spring.json", {}).get("versions", {})
    checks = read_json(spring / "spring-checks.json", [])
    reviews = read_json(spring / "spring-reviews.json", [])
    if args.observations:
        folder, code = Path(args.observations), 0
    else:
        folder, code = run_runtime()
    if code or not folder.is_dir() or not any(folder.glob("*.txt")):
        print("Spring answer checks: the runtime produced no observations")
        return 1
    observations, observed_env = read_observations(folder)
    problems = compare_environment(recorded, observed_env)
    results = []
    for exam in load_exams(args.source_root):
        results += verify_exam(exam, [c for c in checks if c["questionId"].startswith(exam["id"] + "-")],
                               [r for r in reviews if r["questionId"].startswith(exam["id"] + "-")], observations)
    failed = [r for r in results if not r["passed"]]
    target = Path(args.report)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps({"environment": observed_env, "environmentProblems": problems, "questions": len(results), "failed": len(failed),
                                  "results": results}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    for problem in problems:
        print(problem)
    for r in failed:
        print(f"{r['questionId']}: {r['detail']}")
    executed = sum(r["method"] == "run" for r in results)
    print(f"Spring answers: {len(results) - len(failed)} passed / {len(results)} ({executed} executed, {len(results) - executed} re-solved)")
    return 1 if failed or problems else 0


if __name__ == "__main__":
    raise SystemExit(main())
