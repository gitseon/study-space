"""Spring 월말평가 프로젝트 원고 생성기.

`source/Spring/projects/_master/<프로젝트 ID>/`의 마스터 한 벌에서 `starter/`, `stages/1~3/`, `reference/`와
`project.json`, `stages.json`, `checklist.json`, `requirements.md`, `flow.md`, `review.json`을 결정적으로 만든다.
생성 결과는 저장소에 커밋하며 `--check`로 최신인지 확인한다. 생성된 폴더는 직접 고치지 않는다.
프로젝트별 JUnit 원본은 `tests/spring-projects/<프로젝트 ID>/`에서 제공 파일로 넣는다.

마스터 폴더의 구성:
    meta.json        제목, DB 이름, 출처, 안내 문구
    targets.json     작성 대상 목록(제목, 주제, 요구사항, 점검 항목, 힌트)
    structure.json   구조 도식
    docs/            requirements.md, flow.md, checklist.json
    files/           프로젝트 파일. 작성 대상 영역은 한 줄 주석 안의 표식으로 쓴다
                     @@target <id>   영역 시작. 이어지는 줄이 모범답안(reference) 텍스트
                     @@stage <1|2|3> 이 줄부터 해당 단계의 시작 텍스트
                     @@end           영역 끝
영역 표식의 해석은 backend 생성기의 `expand_file`을 그대로 쓴다. 나머지 생성 규칙은 이 파일이 따로 가진다.
"""
from __future__ import annotations

import argparse
import json
import shutil
import sys
from pathlib import Path

from author_backend_projects import STAGES, AuthoringError, _sha256, expand_file
from validate_projects import VERIFY_STEPS, is_build_output

ROOT = Path(__file__).resolve().parents[1]
SPRING = ROOT / "source" / "Spring"
MASTER_ROOT = SPRING / "projects" / "_master"
OUT = SPRING / "projects"
PROJECT_TESTS = ROOT / "tests" / "spring-projects"
STAGE_LABELS = {"1": "빈칸 채우기", "2": "메서드와 JSP 블록 작성", "3": "구현 대상 전체 작성"}
LANGUAGES = {".java": "java", ".jsp": "jsp", ".xml": "xml", ".sql": "sql"}
GENERATED_DIRS = ("starter", "stages", "reference")


def project_ids() -> list[str]:
    return sorted(p.name for p in MASTER_ROOT.iterdir() if p.is_dir() and (p / "meta.json").is_file()) if MASTER_ROOT.is_dir() else []


def read_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def environment() -> dict:
    env = read_json(SPRING / "environment-spring.json")
    return {**env["versions"], "packaging": env["packaging"], "classMatch": env["classMatch"]}


def env_notice(env: dict) -> str:
    return (f"실행 환경(연습용): JDK {env['javaRelease']} 이상, Spring Boot {env['springBoot']}, MyBatis {env['mybatis']}"
            f"(starter {env['mybatisStarter']}), MySQL {env['mysqlServer']}. 수업 환경과 같은지는 확인하지 못했습니다.")


def _checklist_sections(checklist: list[dict]) -> str:
    parts = []
    for item in checklist:
        steps = "\n".join(f"{i}. {s}" for i, s in enumerate(item["steps"], 1))
        parts.append(f"### {item['id']}. {item['title']}\n\n{steps}\n\n기대 결과: {item['expected']}\n")
    return "\n".join(parts)


def master_files(base: Path) -> list[Path]:
    return sorted((p for p in base.rglob("*") if p.is_file()), key=lambda p: p.relative_to(base).as_posix())


def project_sources(base: Path, pid: str) -> dict[str, Path]:
    files = base / "files"
    sources = {path.relative_to(files).as_posix(): path for path in master_files(files)}
    for section in ("java", "resources"):
        tests = PROJECT_TESTS / pid / section
        for path in master_files(tests):
            relative = (Path("src/test") / section / path.relative_to(tests)).as_posix()
            if relative in sources:
                raise AuthoringError(f"{pid}: 제공 테스트 경로가 중복되었습니다: {relative}")
            sources[relative] = path
    return sources


def generate_project(pid: str, existing_review: dict | None = None) -> dict[str, str]:
    base = MASTER_ROOT / pid
    meta = read_json(base / "meta.json")
    env = environment()
    tree: dict[str, str] = {}
    file_entries: list[dict] = []
    target_paths: dict[str, str] = {}
    editable_paths: list[str] = []

    for rel, src in sorted(project_sources(base, pid).items()):
        text = src.read_text(encoding="utf-8")
        reference, found = expand_file(rel, text, "reference")
        if rel.startswith("src/test/") and found:
            raise AuthoringError(f"{pid}: 제공 테스트에 작성 대상 표식이 있습니다: {rel}")
        tree[f"reference/{rel}"] = reference
        editable = bool(found)
        if editable:
            editable_paths.append(rel)
            for stage in STAGES:
                tree[f"stages/{stage}/{rel}"] = expand_file(rel, text, stage)[0]
            for target_id in found:
                if target_id in target_paths:
                    raise AuthoringError(f"target {target_id}가 여러 파일에 있습니다")
                target_paths[target_id] = rel
        else:
            tree[f"starter/{rel}"] = reference
        file_entries.append({"path": rel, "language": LANGUAGES.get(Path(rel).suffix, "text"), "editable": editable, "requiredInExport": True})

    targets = read_json(base / "targets.json")
    defined = [t["id"] for t in targets]
    if sorted(defined) != sorted(target_paths):
        raise AuthoringError(f"{pid}: targets.json과 마스터 영역이 다릅니다: {sorted(set(defined) ^ set(target_paths))}")
    checklist = read_json(base / "docs" / "checklist.json")
    checklist_ids = {item["id"] for item in checklist}
    for target in targets:
        for cid in target["checklistIds"]:
            if cid not in checklist_ids:
                raise AuthoringError(f"{pid}: target {target['id']}의 checklist {cid}가 없습니다")
    for item in checklist:
        for tid in item["targetIds"]:
            if tid not in target_paths:
                raise AuthoringError(f"{pid}: checklist {item['id']}의 target {tid}가 없습니다")

    presentation = {"lead": meta["presentation"]["lead"], "envNotice": env_notice(env), "editorNotice": meta["presentation"]["editorNotice"],
                    "stageInfo": meta["presentation"]["stageInfo"]}
    project = {
        "id": pid, "revision": meta["revision"], "track": "spring", "title": meta["title"],
        "durationOptions": [90, 120, 0], "defaultMinutes": 120, "sourceRefs": meta["sourceRefs"],
        "environment": env, "database": meta["database"], "presentation": presentation,
        "files": file_entries,
        "targets": [{"id": t["id"], "title": t["title"], "path": target_paths[t["id"]], "topicIds": t["topicIds"],
                     "requirementId": t["requirementId"], "checklistIds": t["checklistIds"]} for t in targets],
        "structure": read_json(base / "structure.json"),
    }
    tree["project.json"] = json.dumps(project, ensure_ascii=False, indent=2) + "\n"
    tree["checklist.json"] = json.dumps(checklist, ensure_ascii=False, indent=2) + "\n"
    hints = {t["id"]: t["hints"] for t in targets}
    tree["stages.json"] = json.dumps({"stages": [{"id": int(stage), "label": STAGE_LABELS[stage], "files": sorted(editable_paths), "hints": hints}
                                                 for stage in STAGES]}, ensure_ascii=False, indent=2) + "\n"
    for name in ("requirements.md", "flow.md"):
        tree[name] = (base / "docs" / name).read_text(encoding="utf-8")
    verification = (base / "docs" / "verification.md").read_text(encoding="utf-8")
    for key, value in {"{{title}}": meta["title"], "{{checklistSections}}": _checklist_sections(checklist)}.items():
        verification = verification.replace(key, value)
    tree["verification.md"] = verification

    reference_hashes = {p[len("reference/"):]: _sha256(t) for p, t in sorted(tree.items()) if p.startswith("reference/")}
    combined = _sha256("\n".join(f"{p}:{h}" for p, h in reference_hashes.items()))
    review = {
        "projectId": pid, "revision": meta["revision"], "referenceHash": combined, "referenceFiles": reference_hashes,
        "verification": {
            "steps": {name: {"status": "unverified", "note": ""} for name in VERIFY_STEPS},
            "verifiedReferenceHash": None, "environmentHash": None, "verifiedAt": None, "reviewer": None,
        },
    }
    if existing_review and "verification" in existing_review:
        review["verification"] = existing_review["verification"]
    tree["review.json"] = json.dumps(review, ensure_ascii=False, indent=2) + "\n"
    return tree


def _existing_review(pid: str) -> dict | None:
    path = OUT / pid / "review.json"
    return json.loads(path.read_text(encoding="utf-8")) if path.is_file() else None


def generate_all() -> dict[str, dict[str, str]]:
    return {pid: generate_project(pid, _existing_review(pid)) for pid in project_ids()}


# Files the generator owns inside a project folder. A verification record in review.json is kept, but only while its
# reference hash still matches, so changed code never keeps an old success.
GENERATED_FILES = ("project.json", "stages.json", "checklist.json", "requirements.md", "flow.md", "verification.md")


def write_all(trees: dict[str, dict[str, str]]) -> None:
    for pid, tree in trees.items():
        base = OUT / pid
        for name in GENERATED_DIRS:
            if (base / name).exists():
                shutil.rmtree(base / name)
        for rel, text in tree.items():
            target = base / rel
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(text.encode("utf-8"))


def check_all(trees: dict[str, dict[str, str]]) -> list[str]:
    problems = []
    for pid, tree in trees.items():
        base = OUT / pid
        for rel, text in tree.items():
            path = base / rel
            if not path.is_file():
                problems.append(f"{pid}/{rel}: 없음")
            elif path.read_bytes() != text.encode("utf-8"):
                problems.append(f"{pid}/{rel}: 마스터와 다름")
        for name in GENERATED_DIRS:
            folder = base / name
            if folder.is_dir():
                for file in folder.rglob("*"):
                    rel = file.relative_to(base).as_posix()
                    if file.is_file() and rel not in tree and not is_build_output(rel):
                        problems.append(f"{pid}/{rel}: 마스터에 없는 생성 파일")
    return problems


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--check", action="store_true", help="디스크의 생성 결과가 마스터와 같은지만 확인")
    args = parser.parse_args(argv)
    try:
        trees = generate_all()
    except AuthoringError as error:
        print(f"오류: {error}", file=sys.stderr)
        return 1
    if args.check:
        problems = check_all(trees)
        for problem in problems:
            print(problem)
        print("Spring project authoring: " + ("최신" if not problems else f"{len(problems)}건 다름"))
        return 1 if problems else 0
    write_all(trees)
    print(f"Wrote {len(trees)} projects / {sum(len(t) for t in trees.values())} files")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
