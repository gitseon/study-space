"""Registry of the tracks that publish month-end projects. Paths come from this table only, never from user input."""
from __future__ import annotations

from pathlib import Path

# release: verification steps that must have passed before the track's projects may be published.
PROJECT_TRACKS = {
    "backend": {"dir": "backend", "scope": "scope-backend.json", "index": "backend-projects.json", "output": "backend-projects",
                "release": None},
    "spring": {"dir": "Spring", "scope": "scope-spring.json", "index": "spring-projects.json", "output": "spring-projects",
               "release": ("compile", "unit", "dbIntegration", "httpIntegration"), "environment": "environment-spring.json"},
}


def project_track(track) -> dict:
    if not isinstance(track, str) or track not in PROJECT_TRACKS:
        raise ValueError(f"unknown project track: {track!r}")
    return PROJECT_TRACKS[track]


def projects_root(source_root: Path, track: str) -> Path:
    return Path(source_root) / project_track(track)["dir"] / "projects"


def scope_path(source_root: Path, track: str) -> Path:
    info = project_track(track)
    return Path(source_root) / info["dir"] / info["scope"]
