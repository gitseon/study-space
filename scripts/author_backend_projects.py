"""월말평가 Web 프로젝트 원고 생성기.

`source/backend/projects/_master/`의 마스터 한 벌에서 도메인(web-01, web-02)과
단계(1, 2, 3)별 파일을 만든다. 생성 결과는 저장소에 커밋하며 `--check`로 최신인지 확인한다.

마스터 파일의 작성 대상 영역 표기(한 줄 주석 안에 둔다):
    @@target <id>   영역 시작. 이어지는 줄이 모범답안(reference) 텍스트
    @@stage <1|2|3> 이 줄부터 해당 단계의 시작 텍스트
    @@end           영역 끝
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MASTER = ROOT / "source" / "backend" / "projects" / "_master"
OUT = ROOT / "source" / "backend" / "projects"
STAGES = ("1", "2", "3")
STAGE_LABELS = {"1": "빈칸 채우기", "2": "메서드와 JSP 블록 작성", "3": "구현 대상 전체 작성"}
SOURCE_REFS = ["BE-MONTH-START-01", "BE-MONTH-WORK-01", "BE-MONTH-WEBTEST-01"]
REVISION = 3
ENVIRONMENT = {
    "jdk": "OpenJDK25U-jdk hotspot 25.0.3_9",
    "tomcat": "Apache tomcat-11.0.27",
    "dynamicWebModule": "6.0",
    "mysql": "8.4.11",
    "compileRelease": 21,
}
LANGUAGES = {".java": "java", ".jsp": "jsp", ".xml": "xml", ".sql": "sql"}


class AuthoringError(ValueError):
    pass


def _korean_pairs(src: str, dst: str, src_final: bool, dst_final: bool) -> list[tuple[str, str]]:
    """받침 유무가 다른 단어로 바꿀 때 뒤따르는 조사를 함께 바꾼다."""
    if src_final == dst_final:
        return [(src, dst)]
    to_open = {"이": "가", "은": "는", "을": "를", "과": "와", "으로": "로"}
    to_final = {value: key for key, value in to_open.items()}
    table = to_open if src_final else to_final
    pairs = [(src + k, dst + v) for k, v in table.items()]
    pairs.append((src, dst))
    return pairs


DOMAINS = {
    "web-01": {
        "title": "캠핑 용품 관리",
        "db": "ssafy_gear",
        "sqlFile": "ssafy_gear.sql",
        "replacements": [],
    },
    "web-02": {
        "title": "도서 관리",
        "db": "ssafy_book",
        "sqlFile": "ssafy_book.sql",
        "replacements": (
            _korean_pairs("용품", "도서", True, False)
            + _korean_pairs("색상", "분류", True, False)
            + [("브랜드", "저자"), ("블랙", "소설"), ("아이보리", "IT"), ("카키", "경제"),
               ("Gear", "Book"), ("gear", "book"), ("Brand", "Author"), ("brand", "author"),
               ("Color", "Category"), ("color", "category")]
        ),
    },
}


def apply_domain(text: str, domain: dict) -> str:
    for src, dst in domain["replacements"]:
        text = text.replace(src, dst)
    return text


def load_targets() -> list[dict]:
    return json.loads((MASTER / "targets.json").read_text(encoding="utf-8"))


# ---------------------------------------------------------------- 영역 확장

_DIRECTIVE = re.compile(r"^@@(target|stage|end)\b\s*(\S*)$")


def _parse_directive(line: str):
    body = line.strip()
    for prefix in ("<%--", "<!--", "//", "--"):
        if body.startswith(prefix):
            body = body[len(prefix):].strip()
            break
    else:
        return None
    for suffix in ("--%>", "-->"):
        if body.endswith(suffix):
            body = body[: -len(suffix)].strip()
    match = _DIRECTIVE.match(body)
    if not match:
        return None
    return match.group(1), match.group(2)


def _marker(path: str, text: str, indent: str) -> str:
    ext = Path(path).suffix
    if ext == ".java":
        return f"{indent}// {text}\n"
    if ext == ".jsp":
        return f"{indent}<%-- {text} --%>\n"
    if ext == ".xml":
        return f"{indent}<!-- {text} -->\n"
    if ext == ".sql":
        return f"{indent}-- {text}\n"
    raise AuthoringError(f"{path}: 표식을 지원하지 않는 확장자")


def expand_file(path: str, text: str, mode: str) -> tuple[str, list[str]]:
    """mode가 'reference'이면 모범답안, '1'~'3'이면 해당 단계 시작 텍스트를 만든다."""
    if mode not in ("reference",) + STAGES:
        raise AuthoringError(f"알 수 없는 모드: {mode}")
    out: list[str] = []
    targets: list[str] = []
    region = None  # {id, indent, sections, current}
    for number, line in enumerate(text.replace("\r\n", "\n").splitlines(keepends=True), 1):
        directive = _parse_directive(line)
        if directive is None:
            if region is None:
                out.append(line)
            else:
                region["sections"][region["current"]].append(line)
            continue
        kind, arg = directive
        where = f"{path}:{number}"
        if kind == "target":
            if region is not None:
                raise AuthoringError(f"{where}: 영역이 중첩되었습니다")
            if not arg:
                raise AuthoringError(f"{where}: target id가 없습니다")
            if arg in targets:
                raise AuthoringError(f"{where}: 같은 파일에 target {arg}가 두 번 있습니다")
            indent = line[: len(line) - len(line.lstrip())]
            region = {"id": arg, "indent": indent, "current": "reference",
                      "sections": {"reference": [], "1": [], "2": [], "3": []}, "seen": []}
            targets.append(arg)
        elif kind == "stage":
            if region is None:
                raise AuthoringError(f"{where}: target 밖의 stage")
            if arg not in STAGES:
                raise AuthoringError(f"{where}: 알 수 없는 stage {arg}")
            if arg in region["seen"]:
                raise AuthoringError(f"{where}: stage {arg}가 중복되었습니다")
            region["seen"].append(arg)
            region["current"] = arg
        else:  # end
            if region is None:
                raise AuthoringError(f"{where}: target 없이 end")
            missing = [s for s in STAGES if s not in region["seen"]]
            if missing:
                raise AuthoringError(f"{where}: target {region['id']}에 stage {','.join(missing)}가 없습니다")
            if mode == "reference":
                out.extend(region["sections"]["reference"])
            else:
                out.append(_marker(path, f"study-target:{region['id']}:start", region["indent"]))
                out.extend(region["sections"][mode])
                out.append(_marker(path, f"study-target:{region['id']}:end", region["indent"]))
            region = None
    if region is not None:
        raise AuthoringError(f"{path}: target {region['id']}가 닫히지 않았습니다")
    result = "".join(out)
    if result and not result.endswith("\n"):
        result += "\n"
    return result, targets


# ---------------------------------------------------------------- 생성

def _sha256(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def _checklist_sections(checklist: list[dict]) -> str:
    parts = []
    for item in checklist:
        steps = "\n".join(f"{i}. {s}" for i, s in enumerate(item["steps"], 1))
        parts.append(f"### {item['id']}. {item['title']}\n\n{steps}\n\n기대 결과: {item['expected']}\n")
    return "\n".join(parts)


def _result_rows(checklist: list[dict]) -> str:
    return "\n".join(f"| {item['id']} |  |  |" for item in checklist)


def _master_files() -> list[Path]:
    base = MASTER / "files"
    return sorted((p for p in base.rglob("*") if p.is_file()), key=lambda p: p.relative_to(base).as_posix())


def generate_project(pid: str, existing_review: dict | None = None) -> dict[str, str]:
    domain = DOMAINS[pid]
    base = MASTER / "files"
    overrides_dir = MASTER / "domains" / pid / "files"
    target_defs = load_targets()
    tree: dict[str, str] = {}
    file_entries: list[dict] = []
    target_paths: dict[str, str] = {}
    editable_paths: list[str] = []

    for src in _master_files():
        rel_master = src.relative_to(base).as_posix()
        rel = apply_domain(rel_master, domain)
        override = overrides_dir / rel
        if override.is_file():
            text = override.read_text(encoding="utf-8")
        else:
            text = apply_domain(src.read_text(encoding="utf-8"), domain)
        reference, found = expand_file(rel, text, "reference")
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
        file_entries.append({"path": rel, "language": LANGUAGES.get(Path(rel).suffix, "text"),
                             "editable": editable, "requiredInExport": True})

    defined = [t["id"] for t in target_defs]
    if sorted(defined) != sorted(target_paths):
        missing = sorted(set(defined) ^ set(target_paths))
        raise AuthoringError(f"targets.json과 마스터 영역이 다릅니다: {missing}")

    checklist = json.loads(apply_domain((MASTER / "docs" / "checklist.json").read_text(encoding="utf-8"), domain))
    checklist_ids = {item["id"] for item in checklist}
    for target in target_defs:
        for cid in target["checklistIds"]:
            if cid not in checklist_ids:
                raise AuthoringError(f"target {target['id']}의 checklist {cid}가 없습니다")
    for item in checklist:
        for tid in item["targetIds"]:
            if tid not in target_paths:
                raise AuthoringError(f"checklist {item['id']}의 target {tid}가 없습니다")

    project = {
        "id": pid,
        "revision": REVISION,
        "track": "backend",
        "title": domain["title"],
        "durationOptions": [90, 120, 0],
        "defaultMinutes": 120,
        "sourceRefs": SOURCE_REFS,
        "environment": ENVIRONMENT,
        "database": domain["db"],
        "files": file_entries,
        "targets": [
            {"id": t["id"], "title": apply_domain(t["title"], domain), "path": target_paths[t["id"]],
             "topicIds": t["topicIds"], "requirementId": t["requirementId"], "checklistIds": t["checklistIds"]}
            for t in target_defs
        ],
    }
    structure = json.loads(apply_domain((MASTER / "structure.json").read_text(encoding="utf-8"), domain))
    project["structure"] = structure
    tree["project.json"] = json.dumps(project, ensure_ascii=False, indent=2) + "\n"
    tree["checklist.json"] = json.dumps(checklist, ensure_ascii=False, indent=2) + "\n"

    hints = {t["id"]: [apply_domain(h, domain) for h in t["hints"]] for t in target_defs}
    stages = {"stages": [
        {"id": int(stage), "label": STAGE_LABELS[stage],
         "files": sorted(p for p in editable_paths), "hints": hints}
        for stage in STAGES
    ]}
    tree["stages.json"] = json.dumps(stages, ensure_ascii=False, indent=2) + "\n"

    for name in ("requirements.md", "flow.md"):
        tree[name] = apply_domain((MASTER / "docs" / name).read_text(encoding="utf-8"), domain)
    verification = apply_domain((MASTER / "docs" / "verification.md").read_text(encoding="utf-8"), domain)
    for key, value in {"{{title}}": domain["title"], "{{db}}": domain["db"], "{{sqlFile}}": domain["sqlFile"],
                       "{{checklistSections}}": _checklist_sections(checklist),
                       "{{resultRows}}": _result_rows(checklist)}.items():
        verification = verification.replace(key, value)
    tree["verification.md"] = verification

    reference_hashes = {p[len("reference/"):]: _sha256(t) for p, t in sorted(tree.items()) if p.startswith("reference/")}
    combined = _sha256("\n".join(f"{p}:{h}" for p, h in reference_hashes.items()))
    review = {
        "projectId": pid,
        "revision": REVISION,
        "environmentTarget": ENVIRONMENT,
        "referenceHash": combined,
        "referenceFiles": reference_hashes,
        "verification": {
            "javacCompile": {"status": "미검증", "note": ""},
            "jspTranslate": {"status": "미검증", "note": ""},
            "runtime": {cid: {"status": "미검증", "note": ""} for cid in sorted(checklist_ids - {"project-export"})},
            "verifiedReferenceHash": None,
            "reviewer": None,
        },
    }
    if existing_review and "verification" in existing_review:
        review["verification"] = existing_review["verification"]
    tree["review.json"] = json.dumps(review, ensure_ascii=False, indent=2) + "\n"
    return tree


def _existing_review(pid: str) -> dict | None:
    path = OUT / pid / "review.json"
    if path.is_file():
        return json.loads(path.read_text(encoding="utf-8"))
    return None


def generate_all() -> dict[str, dict[str, str]]:
    return {pid: generate_project(pid, _existing_review(pid)) for pid in DOMAINS}


GENERATED_DIRS = ("starter", "stages", "reference")


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
                    if file.is_file() and file.relative_to(base).as_posix() not in tree:
                        problems.append(f"{pid}/{file.relative_to(base).as_posix()}: 마스터에 없는 생성 파일")
    return problems


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
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
        print("Backend project authoring: " + ("최신" if not problems else f"{len(problems)}건 다름"))
        return 1 if problems else 0
    write_all(trees)
    count = sum(len(t) for t in trees.values())
    print(f"Wrote {len(trees)} projects / {count} files")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
