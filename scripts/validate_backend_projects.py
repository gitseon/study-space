"""백엔드 · DB 월말평가 Web 프로젝트 원고(source/backend/projects/) 검증. 공통 검사기(validate_projects.py)의 backend 창구다."""
from __future__ import annotations

from pathlib import Path

import validate_projects as _common
from validate_projects import (ALLOWED_DURATIONS, ALLOWED_SUFFIXES, EDGE_KINDS, GENERATED_DIRS, HASH_EXCLUDED, LOCAL_PATH,  # noqa: F401
                               MARKER, ROOT, STAGE_NUMBERS, ProjectError, check_markers, check_structure, content_hash,
                               list_files, load_backend_topics, read_json, read_text, reference_hash, safe_relative_path)


def validate_project(project_dir: Path, topics: set[str] | None) -> tuple[dict | None, list[str]]:
    return _common.validate_project(project_dir, topics, "backend")


def collect(source_root: Path) -> tuple[list[dict], list[str]]:
    return _common.collect(source_root, "backend")


def validate_projects(source_root: Path = ROOT / "source") -> list[str]:
    return _common.validate_projects(source_root, "backend")


def main(argv=None) -> int:
    issues = validate_projects()
    for issue in issues:
        print(issue)
    count = len(_common.project_folders(ROOT / "source", "backend"))
    print(f"Backend project validation: {count} projects, {len(issues)} issues")
    return 1 if issues else 0


if __name__ == "__main__":
    raise SystemExit(main())
