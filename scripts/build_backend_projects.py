"""백엔드 · DB 월말평가 프로젝트 빌드. 공통 빌드(build_projects.py)의 backend 창구다."""
from __future__ import annotations

from pathlib import Path

import build_projects as _common
from build_projects import SCHEMA_VERSION, ZIP_DATE  # noqa: F401
from validate_backend_projects import (ProjectError, STAGE_NUMBERS, collect, content_hash,  # noqa: F401
                                       list_files)

INDEX_FILE = "backend-projects.json"


def build_projects(source_root: Path, output_root: Path) -> dict:
    return _common.build_projects(source_root, output_root, "backend")
