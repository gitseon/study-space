"""월말평가 프로젝트 원고(source/<트랙 폴더>/projects/)를 트랙 공통 규칙으로 검증한다."""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path, PurePosixPath

from project_catalog import PROJECT_TRACKS, project_track, projects_root, scope_path

ROOT = Path(__file__).resolve().parents[1]
ALLOWED_DURATIONS = (90, 120, 0)
ALLOWED_SUFFIXES = {".java": "java", ".jsp": "jsp", ".xml": "xml", ".sql": "sql", ".txt": "text", ".properties": "text"}
STAGE_NUMBERS = (1, 2, 3)
MARKER = re.compile(r"study-target:([\w-]+):(start|end)")
LOCAL_PATH = re.compile(r"(?<![A-Za-z0-9])[A-Za-z]:[\\/]|/Users/|\\Users\\|private/")
HASH_EXCLUDED = ("review.json", "verification.md")
GENERATED_DIRS = ("starter", "stages", "reference")
# An IDE that imports the Maven projects under source/ leaves these beside pom.xml. They are never part of a manuscript.
BUILD_OUTPUT = ("target", "bin", ".classpath", ".project", ".settings", ".factorypath", ".idea", ".vscode")
MAVEN_ROOTS = ("reference", "starter", "stages/1", "stages/2", "stages/3")
VERIFY_STEPS = ("compile", "unit", "dbIntegration", "httpIntegration", "jspRender", "stsManual")
VERIFY_STATUSES = ("passed", "failed", "unverified", "not-applicable")


class ProjectError(ValueError):
    pass


def safe_relative_path(path) -> bool:
    if not isinstance(path, str) or not path or path != path.strip():
        return False
    if "\\" in path or path.startswith("/") or ":" in path or "//" in path:
        return False
    parts = PurePosixPath(path).parts
    if not parts or any(part in ("", ".", "..") for part in parts) or parts[0] in BUILD_OUTPUT:
        return False
    return Path(path).suffix in ALLOWED_SUFFIXES


def read_text(path: Path, issues: list[str], label: str) -> str | None:
    try:
        return path.read_text(encoding="utf-8")
    except FileNotFoundError:
        issues.append(f"{label}: 누락")
    except UnicodeDecodeError:
        issues.append(f"{label}: UTF-8이 아닙니다")
    return None


def read_json(path: Path, issues: list[str], label: str):
    text = read_text(path, issues, label)
    if text is None:
        return None
    try:
        return json.loads(text)
    except json.JSONDecodeError as error:
        issues.append(f"{label}: JSON 오류 {error.msg}")
        return None


def list_files(folder: Path) -> list[str]:
    """Files of one Maven project folder, without what a build or an IDE left at its top level."""
    if not folder.is_dir():
        return []
    return sorted(rel for rel in (p.relative_to(folder).as_posix() for p in folder.rglob("*") if p.is_file()) if rel.split("/")[0] not in BUILD_OUTPUT)


def is_build_output(rel: str) -> bool:
    """True for a project-relative path that sits in the build output of one of the generated Maven folders."""
    for root in MAVEN_ROOTS:
        if rel.startswith(root + "/") and rel[len(root) + 1:].split("/")[0] in BUILD_OUTPUT:
            return True
    return False


def manuscript_files(project_dir: Path) -> list[Path]:
    return sorted((p for p in project_dir.rglob("*") if p.is_file() and not is_build_output(p.relative_to(project_dir).as_posix())),
                  key=lambda p: p.relative_to(project_dir).as_posix())


def content_hash(project_dir: Path) -> str:
    digest = hashlib.sha256()
    for path in manuscript_files(project_dir):
        rel = path.relative_to(project_dir).as_posix()
        if rel in HASH_EXCLUDED:
            continue
        digest.update(rel.encode("utf-8") + b"\0" + path.read_bytes() + b"\0")
    return digest.hexdigest()[:16]


def reference_hash(project_dir: Path) -> str:
    entries = []
    for rel in list_files(project_dir / "reference"):
        text = (project_dir / "reference" / rel).read_bytes()
        entries.append(f"{rel}:{hashlib.sha256(text).hexdigest()}")
    return hashlib.sha256("\n".join(entries).encode("utf-8")).hexdigest()


def load_topics(source_root: Path, track: str = "backend") -> set[str] | None:
    scope = scope_path(source_root, track)
    if not scope.is_file():
        return None
    return set(json.loads(scope.read_text(encoding="utf-8"))["topics"])


def load_backend_topics(source_root: Path) -> set[str] | None:
    return load_topics(source_root, "backend")


def environment_hash(environment: dict) -> str:
    """Identity of a verification environment: its recorded versions and nothing else."""
    return hashlib.sha256(json.dumps(environment["versions"], ensure_ascii=False, sort_keys=True).encode("utf-8")).hexdigest()[:16]


def load_environment(source_root: Path, track: str) -> dict | None:
    info = project_track(track)
    if "environment" not in info:
        return None
    return json.loads((Path(source_root) / info["dir"] / info["environment"]).read_text(encoding="utf-8"))


def step_status(review: dict, name: str):
    step = review.get("verification", {}).get("steps", {}).get(name)
    return step.get("status") if isinstance(step, dict) else None


def release_issues(pid: str, review: dict, reference: str, environment: str, has_jsp: bool, required=None) -> list[str]:
    """Why a project may not be published yet. STS is a separate manual check and never blocks."""
    required = list(required or PROJECT_TRACKS["spring"]["release"])
    issues = []
    verification = review.get("verification", {}) if isinstance(review, dict) else {}
    for name in required + (["jspRender"] if has_jsp else []):
        status = step_status(review, name)
        if status != "passed":
            issues.append(f"{pid}: 필수 검증 {name}이 {status or '누락'} 상태입니다")
    if not has_jsp and step_status(review, "jspRender") != "not-applicable":
        issues.append(f"{pid}: JSP 파일이 없는 프로젝트의 jspRender는 not-applicable이어야 합니다")
    if verification.get("verifiedReferenceHash") != reference:
        issues.append(f"{pid}: 검증 기록이 현재 reference와 다릅니다(만료). 다시 검증하세요")
    if verification.get("environmentHash") != environment:
        issues.append(f"{pid}: 검증 기록의 환경이 현재 환경 파일과 다릅니다(만료). 다시 검증하세요")
    return issues


def verification_summary(review: dict) -> dict:
    """What the site may show about verification: step states and a label that never claims an STS run that did not happen."""
    steps = {name: step_status(review, name) or "unverified" for name in VERIFY_STEPS}
    automatic = [steps[name] for name in VERIFY_STEPS if name != "stsManual" and steps[name] != "not-applicable"]
    if automatic and all(status == "passed" for status in automatic):
        label = "자동 검증 완료 · STS 확인" if steps["stsManual"] == "passed" else "자동 검증 완료 · STS 미검증"
    elif any(status == "failed" for status in automatic):
        label = "자동 검증 실패"
    else:
        label = "자동 검증 전"
    return {"label": label, "steps": steps}


def check_markers(text: str, expected: list[str], where: str, issues: list[str]) -> None:
    """text 안의 표식이 expected 목록의 id마다 start, end 한 쌍이며 겹치지 않는지 검사한다."""
    found = MARKER.findall(text)
    open_id = None
    seen: dict[str, int] = {}
    for target_id, kind in found:
        if target_id not in expected:
            issues.append(f"{where}: 알 수 없는 표식 {target_id}")
            continue
        if kind == "start":
            if open_id is not None:
                issues.append(f"{where}: 표식 {open_id}가 닫히기 전에 {target_id}가 시작됩니다")
            open_id = target_id
            seen[target_id] = seen.get(target_id, 0) + 1
        else:
            if open_id != target_id:
                issues.append(f"{where}: 표식 {target_id}의 end가 짝이 맞지 않습니다")
            open_id = None
    if open_id is not None:
        issues.append(f"{where}: 표식 {open_id}의 end가 없습니다")
    for target_id in expected:
        starts = sum(1 for tid, kind in found if tid == target_id and kind == "start")
        ends = sum(1 for tid, kind in found if tid == target_id and kind == "end")
        if starts != 1 or ends != 1:
            issues.append(f"{where}: 표식 {target_id}가 start {starts}개, end {ends}개입니다")


EDGE_KINDS = {"request", "call", "sql", "forward", "redirect", "include", "error"}


def check_structure(project, texts, file_paths, editable_paths, target_ids, label, issues):
    """프로젝트 구조 도식 데이터를 검사한다. 뼈대에는 작성 대상의 모범답안 줄이 들어 있으면 안 된다."""
    structure = project.get("structure")
    if not isinstance(structure, dict):
        issues.append(f"{label}: structure가 없습니다")
        return
    layers = [l.get("id") for l in structure.get("layers", [])]
    nodes = structure.get("nodes", [])
    node_ids = [n.get("id") for n in nodes]
    if len(set(node_ids)) != len(node_ids) or not node_ids:
        issues.append(f"{label}: structure node id가 비었거나 중복되었습니다")
    for node in nodes:
        nid = node.get("id")
        if node.get("layer") not in layers:
            issues.append(f"{label}: node {nid}의 layer가 없습니다")
        path = node.get("path")
        if path is not None and path not in file_paths:
            issues.append(f"{label}: node {nid}의 path {path}가 프로젝트 파일에 없습니다")
        for tid in node.get("targets", []):
            if tid not in target_ids:
                issues.append(f"{label}: node {nid}가 없는 target {tid}를 가리킵니다")
        reference = texts["reference"].get(path, "") if path else ""
        for method in node.get("methods", []):
            if not re.search(r"(?<![A-Za-z0-9_])" + re.escape(method) + r"\s*\(", reference):
                issues.append(f"{label}: node {nid}의 메서드 {method}가 {path}에 없습니다")
        skeleton = node.get("skeleton")
        if not isinstance(skeleton, list) or not skeleton or not all(isinstance(s, str) for s in skeleton):
            issues.append(f"{label}: node {nid}의 skeleton은 문자열 목록이어야 합니다")
            continue
        if path in editable_paths:
            provided = {line.strip() for line in texts["3"].get(path, "").splitlines()}
            answers = {line.strip() for line in reference.splitlines() if len(line.strip()) >= 20} - provided
            for line in skeleton:
                if line.strip() in answers:
                    issues.append(f"{label}: node {nid}의 skeleton에 모범답안 줄이 들어 있습니다: {line.strip()[:40]}")
    edge_ids = [e.get("id") for e in structure.get("edges", [])]
    if len(set(edge_ids)) != len(edge_ids):
        issues.append(f"{label}: structure edge id가 중복되었습니다")
    for edge in structure.get("edges", []):
        if edge.get("from") not in node_ids or edge.get("to") not in node_ids:
            issues.append(f"{label}: edge {edge.get('id')}의 끝점이 없습니다")
        if edge.get("kind") not in EDGE_KINDS:
            issues.append(f"{label}: edge {edge.get('id')}의 kind가 올바르지 않습니다")
    flows = structure.get("flows", {})
    if "overview" not in flows:
        issues.append(f"{label}: flows에 overview가 없습니다")
    for fid, flow in flows.items():
        if not flow.get("edges"):
            issues.append(f"{label}: flow {fid}가 비어 있습니다")
        for eid in flow.get("edges", []):
            if eid not in edge_ids:
                issues.append(f"{label}: flow {fid}가 없는 edge {eid}를 가리킵니다")
    for tab, fid in structure.get("flowTabs", {}).items():
        if fid not in flows:
            issues.append(f"{label}: flowTabs {tab}가 없는 flow {fid}를 가리킵니다")


def validate_project(project_dir: Path, topics: set[str] | None, track: str = "backend") -> tuple[dict | None, list[str]]:
    issues: list[str] = []
    pid = project_dir.name
    label = pid
    project = read_json(project_dir / "project.json", issues, f"{label}/project.json")
    if not isinstance(project, dict):
        return None, issues
    if project.get("id") != pid:
        issues.append(f"{label}: project.json의 id({project.get('id')})가 폴더 이름과 다릅니다")
    if project.get("track") != track:
        issues.append(f"{label}: track은 {track}여야 합니다")
    if not isinstance(project.get("revision"), int) or project["revision"] < 1:
        issues.append(f"{label}: revision은 1 이상의 정수여야 합니다")
    options = project.get("durationOptions")
    if options != list(ALLOWED_DURATIONS):
        issues.append(f"{label}: durationOptions는 {list(ALLOWED_DURATIONS)}이어야 합니다")
    if project.get("defaultMinutes") not in (options if isinstance(options, list) else []):
        issues.append(f"{label}: defaultMinutes({project.get('defaultMinutes')})가 durationOptions에 없습니다")
    if not project.get("sourceRefs"):
        issues.append(f"{label}: sourceRefs가 비어 있습니다")

    files = project.get("files")
    file_paths: list[str] = []
    editable_paths: list[str] = []
    if not isinstance(files, list) or not files:
        issues.append(f"{label}: files가 비어 있습니다")
        files = []
    for entry in files:
        path = entry.get("path") if isinstance(entry, dict) else None
        if not safe_relative_path(path):
            issues.append(f"{label}: 허용하지 않는 경로 {path!r}")
            continue
        if path in file_paths:
            issues.append(f"{label}: 경로 {path}가 중복되었습니다")
        file_paths.append(path)
        if entry.get("language") != ALLOWED_SUFFIXES[Path(path).suffix] and not (Path(path).suffix in (".txt", ".properties") and entry.get("language") == "text"):
            issues.append(f"{label}: {path}의 language가 확장자와 맞지 않습니다")
        if not isinstance(entry.get("editable"), bool) or not isinstance(entry.get("requiredInExport"), bool):
            issues.append(f"{label}: {path}의 editable, requiredInExport는 true 또는 false여야 합니다")
        if entry.get("editable") is True:
            editable_paths.append(path)

    # 파일 존재와 짝 맞춤
    texts: dict[str, dict[str, str]] = {"reference": {}, "starter": {}, "1": {}, "2": {}, "3": {}}
    for path in file_paths:
        is_editable = path in editable_paths
        places = ["reference"] + (["1", "2", "3"] if is_editable else ["starter"])
        for place in places:
            folder = project_dir / (("stages" / Path(place)) if place in ("1", "2", "3") else Path(place))
            text = read_text(folder / path, issues, f"{label}/{folder.relative_to(project_dir).as_posix()}/{path}")
            if text is not None:
                texts[place][path] = text
    expected_by_folder = {
        "reference": set(file_paths), "starter": set(file_paths) - set(editable_paths),
        "stages/1": set(editable_paths), "stages/2": set(editable_paths), "stages/3": set(editable_paths),
    }
    for folder, expected in expected_by_folder.items():
        for extra in sorted(set(list_files(project_dir / folder)) - expected):
            issues.append(f"{label}/{folder}/{extra}: project.json에 없는 파일")

    # 대상
    targets = project.get("targets") if isinstance(project.get("targets"), list) else []
    target_ids = [t.get("id") for t in targets if isinstance(t, dict)]
    if len(set(target_ids)) != len(target_ids) or not target_ids:
        issues.append(f"{label}: target id가 비었거나 중복되었습니다")
    requirements = read_text(project_dir / "requirements.md", issues, f"{label}/requirements.md") or ""
    checklist = read_json(project_dir / "checklist.json", issues, f"{label}/checklist.json")
    checklist_ids = set()
    if isinstance(checklist, list):
        for item in checklist:
            cid = item.get("id") if isinstance(item, dict) else None
            if cid in checklist_ids:
                issues.append(f"{label}: checklist id {cid}가 중복되었습니다")
            checklist_ids.add(cid)
            if "points" in item or "score" in item:
                issues.append(f"{label}: checklist {cid}에 배점 필드가 있습니다")
            for tid in item.get("targetIds", []):
                if tid not in target_ids:
                    issues.append(f"{label}: checklist {cid}가 없는 target {tid}를 가리킵니다")
    else:
        issues.append(f"{label}: checklist.json은 목록이어야 합니다")
    for target in targets:
        tid = target.get("id")
        if target.get("path") not in editable_paths:
            issues.append(f"{label}: target {tid}의 path가 작성 대상 파일이 아닙니다")
        for cid in target.get("checklistIds", []):
            if cid not in checklist_ids:
                issues.append(f"{label}: target {tid}가 없는 checklist {cid}를 가리킵니다")
        if target.get("requirementId") and target["requirementId"] not in requirements:
            issues.append(f"{label}: target {tid}의 {target['requirementId']}가 requirements.md에 없습니다")
        if topics is not None:
            for topic in target.get("topicIds", []):
                if topic not in topics:
                    issues.append(f"{label}: target {tid}의 topic {topic}이 {track} scope에 없습니다")

    check_structure(project, texts, file_paths, editable_paths, target_ids, label, issues)

    # 표식
    for path in editable_paths:
        expected = [t["id"] for t in targets if t.get("path") == path]
        for stage in ("1", "2", "3"):
            if path in texts[stage]:
                check_markers(texts[stage][path], expected, f"{label}/stages/{stage}/{path}", issues)
    for path, text in texts["starter"].items():
        if MARKER.search(text):
            issues.append(f"{label}/starter/{path}: 작성 표식이 있으면 안 됩니다")
    for path, text in texts["reference"].items():
        if "study-target" in text:
            issues.append(f"{label}/reference/{path}: reference에 연습 표식이 남아 있습니다")

    # stages.json
    stages = read_json(project_dir / "stages.json", issues, f"{label}/stages.json")
    if isinstance(stages, dict) and isinstance(stages.get("stages"), list):
        if [s.get("id") for s in stages["stages"]] != list(STAGE_NUMBERS):
            issues.append(f"{label}: stages.json의 단계는 1, 2, 3이어야 합니다")
        for stage in stages["stages"]:
            if sorted(stage.get("files", [])) != sorted(editable_paths):
                issues.append(f"{label}: stages.json {stage.get('id')}단계 files가 작성 대상 파일과 다릅니다")
            hints = stage.get("hints", {})
            for tid in hints:
                if tid not in target_ids:
                    issues.append(f"{label}: 힌트가 없는 target {tid}를 가리킵니다")
            for tid in target_ids:
                if not hints.get(tid):
                    issues.append(f"{label}: target {tid}의 힌트가 없습니다")
    elif stages is not None:
        issues.append(f"{label}: stages.json 형식 오류")

    # 개인 경로
    for path in manuscript_files(project_dir):
        rel = path.relative_to(project_dir).as_posix()
        if path.suffix in ALLOWED_SUFFIXES or path.suffix in (".md", ".json"):
            try:
                if LOCAL_PATH.search(path.read_text(encoding="utf-8")):
                    issues.append(f"{label}/{rel}: 로컬 경로 또는 개인 경로가 들어 있습니다")
            except UnicodeDecodeError:
                pass

    # review.json
    review = read_json(project_dir / "review.json", issues, f"{label}/review.json")
    if isinstance(review, dict):
        if review.get("projectId") != pid:
            issues.append(f"{label}: review.json의 projectId가 다릅니다")
        actual = reference_hash(project_dir)
        if review.get("referenceHash") != actual:
            issues.append(f"{label}: review.json의 referenceHash가 reference와 다릅니다. 생성기를 다시 실행하세요")
        verification = review.get("verification", {})
        if PROJECT_TRACKS[track]["release"] is None:
            checked = [v for v in [verification.get("javacCompile"), verification.get("jspTranslate"), *verification.get("runtime", {}).values()] if isinstance(v, dict)]
            if any(v.get("status") != "미검증" for v in checked) and verification.get("verifiedReferenceHash") != actual:
                issues.append(f"{label}: 검증 기록이 현재 reference와 다릅니다. 다시 검증하세요")
        else:
            # Step records must be well formed. Whether they are complete and current is the release gate's question.
            steps = verification.get("steps")
            if not isinstance(steps, dict) or set(steps) != set(VERIFY_STEPS):
                issues.append(f"{label}: review.json의 verification.steps는 {list(VERIFY_STEPS)}를 모두 가져야 합니다")
            elif any(not isinstance(s, dict) or s.get("status") not in VERIFY_STATUSES for s in steps.values()):
                issues.append(f"{label}: review.json의 검증 상태는 {list(VERIFY_STATUSES)} 중 하나여야 합니다")
            presentation = project.get("presentation")
            if not isinstance(presentation, dict) or not all(isinstance(presentation.get(k), str) and presentation[k].strip() for k in ("lead", "envNotice", "editorNotice")) \
                    or set((presentation.get("stageInfo") or {})) != {"1", "2", "3"}:
                issues.append(f"{label}: presentation에 lead, envNotice, editorNotice와 stageInfo 1~3이 필요합니다")
    project["_dir"] = str(project_dir)
    return project, issues


def project_folders(source_root: Path, track: str) -> list[Path]:
    base = projects_root(source_root, track)
    return sorted(p for p in base.iterdir() if p.is_dir() and not p.name.startswith("_")) if base.is_dir() else []


def collect(source_root: Path, track: str = "backend") -> tuple[list[dict], list[str]]:
    projects: list[dict] = []
    issues: list[str] = []
    topics = load_topics(source_root, track)
    folders = project_folders(source_root, track)
    if not folders:
        return projects, issues
    # A project ID is unique across every track, so an old link without a track still names one project.
    elsewhere = {p.name for other in PROJECT_TRACKS if other != track for p in project_folders(source_root, other)}
    seen: set[str] = set()
    for folder in folders:
        if folder.name in elsewhere:
            issues.append(f"{folder.name}: 다른 트랙에 같은 프로젝트 id가 있습니다")
        project, found = validate_project(folder, topics, track)
        issues.extend(found)
        if project is not None:
            if project.get("id") in seen:
                issues.append(f"{folder.name}: id {project.get('id')}가 중복되었습니다")
            seen.add(project.get("id"))
            projects.append(project)
    return projects, issues


def validate_projects(source_root: Path = ROOT / "source", track: str = "backend") -> list[str]:
    return collect(source_root, track)[1]


def release_issues_for_track(source_root: Path, track: str) -> list[str]:
    """Release gate of one track. A track without required steps (backend) keeps its existing static policy."""
    info = project_track(track)
    if info["release"] is None:
        return []
    environment = environment_hash(load_environment(source_root, track))
    issues = []
    for folder in project_folders(source_root, track):
        project = json.loads((folder / "project.json").read_text(encoding="utf-8"))
        review = json.loads((folder / "review.json").read_text(encoding="utf-8"))
        has_jsp = any(entry["path"].endswith(".jsp") for entry in project["files"])
        issues += release_issues(folder.name, review, reference_hash(folder), environment, has_jsp, info["release"])
    return issues


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description="월말평가 프로젝트 원고 검증")
    parser.add_argument("--track", default="backend", choices=sorted(PROJECT_TRACKS))
    parser.add_argument("--release", action="store_true", help="공개 전 필수 실행 검증의 완료와 최신 여부까지 검사한다")
    args = parser.parse_args(argv)
    issues = validate_projects(ROOT / "source", args.track)
    if args.release and not issues:
        issues = release_issues_for_track(ROOT / "source", args.track)
    for issue in issues:
        print(issue)
    count = len(project_folders(ROOT / "source", args.track))
    print(f"Project validation ({args.track}{', release' if args.release else ''}): {count} projects, {len(issues)} issues")
    return 1 if issues else 0


if __name__ == "__main__":
    raise SystemExit(main())
