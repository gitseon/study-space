"""검증된 월말평가 Web 프로젝트 원고를 사이트용 데이터(data/backend-projects*)로 만든다."""
from __future__ import annotations

import json
import shutil
import zipfile
from pathlib import Path

from validate_backend_projects import (ProjectError, STAGE_NUMBERS, collect, content_hash,  # noqa: F401
                                       list_files)

ZIP_DATE = (2026, 1, 1, 0, 0, 0)
# 압축하지 않아 운영체제와 zlib 버전에 상관없이 같은 바이트가 나온다(CI의 data/ 변경 검사용).
INDEX_FILE = "backend-projects.json"
SCHEMA_VERSION = 1


def _write_json(path: Path, data) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")


def _read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def _merged_files(project_dir: Path, project: dict, stage: int) -> list[dict]:
    merged = []
    for entry in sorted(project["files"], key=lambda f: f["path"]):
        path = entry["path"]
        if entry["editable"]:
            text = _read(project_dir / "stages" / str(stage) / path)
        else:
            text = _read(project_dir / "starter" / path)
        merged.append({"path": path, "language": entry["language"], "editable": entry["editable"], "text": text})
    return merged


def _write_zip(path: Path, root: str, files: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(path, "w", zipfile.ZIP_STORED) as archive:
        for entry in sorted(files, key=lambda f: f["path"]):
            info = zipfile.ZipInfo(f"{root}/{entry['path']}", ZIP_DATE)
            info.compress_type = zipfile.ZIP_STORED
            info.create_system = 3
            info.external_attr = 0o644 << 16
            archive.writestr(info, entry["text"].encode("utf-8"))


def build_projects(source_root: Path, output_root: Path) -> dict:
    projects, issues = collect(source_root)
    if issues:
        raise ProjectError("월말평가 프로젝트 검증 오류:\n" + "\n".join(issues))
    if not projects:
        raise ProjectError("월말평가 프로젝트 원고가 없습니다")
    data_dir = output_root / "backend-projects"
    if data_dir.exists():
        shutil.rmtree(data_dir)
    index = {"schemaVersion": SCHEMA_VERSION, "track": "backend", "projects": []}
    for project in projects:
        pid = project["id"]
        project_dir = Path(project["_dir"])
        digest = content_hash(project_dir)
        checklist = json.loads(_read(project_dir / "checklist.json"))
        stages_meta = json.loads(_read(project_dir / "stages.json"))["stages"]
        base = data_dir / pid
        _write_json(base / "project.json", {
            "schemaVersion": SCHEMA_VERSION, "id": pid, "title": project["title"], "revision": project["revision"],
            "track": "backend", "hash": digest, "database": project.get("database"),
            "environment": project["environment"], "durationOptions": project["durationOptions"],
            "defaultMinutes": project["defaultMinutes"], "sourceRefs": project["sourceRefs"],
            "files": project["files"], "targets": project["targets"], "structure": project["structure"],
            "requirements": _read(project_dir / "requirements.md"), "flow": _read(project_dir / "flow.md"),
            "checklist": checklist,
        })
        stage_entries = []
        for meta in stages_meta:
            number = meta["id"]
            files = _merged_files(project_dir, project, number)
            _write_json(base / f"stage-{number}.json", {
                "schemaVersion": SCHEMA_VERSION, "projectId": pid, "revision": project["revision"], "hash": digest,
                "stage": {"id": number, "label": meta["label"]}, "files": files,
                "targets": project["targets"], "hints": meta["hints"],
            })
            _write_zip(base / f"stage-{number}.zip", f"{pid}-stage-{number}", files)
            stage_entries.append({"id": number, "label": meta["label"],
                                  "file": f"backend-projects/{pid}/stage-{number}.json",
                                  "zip": f"backend-projects/{pid}/stage-{number}.zip"})
        reference_files = [{"path": e["path"], "language": e["language"], "text": _read(project_dir / "reference" / e["path"])}
                           for e in sorted(project["files"], key=lambda f: f["path"])]
        _write_json(base / "reference.json", {"schemaVersion": SCHEMA_VERSION, "projectId": pid,
                                              "revision": project["revision"], "hash": digest, "files": reference_files})
        index["projects"].append({
            "id": pid, "title": project["title"], "revision": project["revision"], "hash": digest,
            "durationOptions": project["durationOptions"], "defaultMinutes": project["defaultMinutes"],
            "environment": project["environment"], "targetCount": len(project["targets"]),
            "project": f"backend-projects/{pid}/project.json",
            "referenceFile": f"backend-projects/{pid}/reference.json", "stages": stage_entries,
        })
    _write_json(output_root / INDEX_FILE, index)
    return {"file": INDEX_FILE, "count": len(projects), "track": "backend"}
