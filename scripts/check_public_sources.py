"""Read-only checks of the public boundary: source IDs in sourceRefs and private values in public files.

--public-only runs without any private file, so CI can use it. --private-index additionally compares the local
originals with the private index and looks for their real names in public files. Findings carry a code, a public file
position and a public source ID only. The matched value is never printed, so a log cannot leak it again.
String scanning does not find every possible leak; it guards the known shapes listed in docs/plans/source-publication.md.
"""
import argparse
import hashlib
import io
import json
import re
import subprocess
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIRS = ("data", "dist", "reports")
AUTHORED_DIRS = ("docs",)
TEXT_SUFFIXES = {".md", ".json", ".java", ".xml", ".properties", ".sql", ".jsp", ".html", ".js", ".mjs", ".css", ".txt", ".yml", ".yaml", ".py", ".env"}
SETTINGS_SUFFIXES = {".properties", ".yml", ".yaml", ".env"}
FORBIDDEN_SUFFIXES = {".pdf", ".ppt", ".pptx", ".doc", ".docx", ".hwp", ".hwpx", ".env"}
ABSOLUTE_PATH = re.compile(r"[A-Za-z]:[\\/]+Users[\\/]+[^\\/\s\"'<>]+|(?<![\w.:/])/(?:home|Users)/[\w.-]+")
PRIVATE_LINK = re.compile(r"\]\(\s*<?(?:\.{1,2}/)*(?:[\w.-]+/)*private/|\"(?:\.{1,2}/)*private/[^\"]*\"|(?:src|href)\s*=\s*[\"'](?:\.{1,2}/)*(?:[\w.-]+/)*private/")
SECRET_KEY = re.compile(r"(?i)^\s*([\w.\-]*(?:password|passwd|secret|api[-_.]?key|token)[\w.\-]*)\s*[=:]\s*(.*?)\s*$")
PLACEHOLDER = re.compile(r"\$\{[^}]*\}|<[^>]*>|['\"]{2}|")
SOURCE_REF = re.compile(r"(\S+) (.+) p\.(\d+)(?:-(\d+))?")


def finding(code, file, line=None, item=None):
    return {key: value for key, value in (("code", code), ("file", file), ("line", line), ("item", item)) if value is not None}


def load_provenance(path):
    provenance = json.loads(Path(path).read_text(encoding="utf-8-sig"))
    ids = [source["id"] for source in provenance["sources"]]
    if len(set(ids)) != len(ids):
        raise ValueError("provenance: duplicate source id")
    for source in provenance["sources"]:
        if not source.get("description") or not source.get("allowedSections") or not isinstance(source.get("pages"), int):
            raise ValueError(f"provenance: {source['id']} needs description, pages and allowedSections")
    return provenance


def source_ref_issue(ref, provenance, note_ids):
    """None when the reference is a registered ID with section and PDF page, a public note part or an official https URL."""
    if not isinstance(ref, str):
        return "source-format"
    if re.fullmatch(r"https://[\w.-]+/\S*", ref):
        return None
    note = re.fullmatch(r"([\w-]+) Part \d+", ref)
    if note:
        return None if note[1] in note_ids else "source-format"
    sources = {source["id"]: source for source in provenance["sources"]}
    looks_registered = any(ref.startswith(prefix) for prefix in provenance.get("idPrefixes", []))
    match = SOURCE_REF.fullmatch(ref)
    if not match:
        if looks_registered and ref.split(" ")[0] not in sources:
            return "source-unregistered"
        return "source-format"
    source_id, section, first, last = match[1], match[2], int(match[3]), int(match[4] or match[3])
    if source_id not in sources:
        return "source-unregistered" if looks_registered else "source-format"
    if section not in sources[source_id]["allowedSections"]:
        return "source-section"
    if not 1 <= first <= last <= sources[source_id]["pages"]:
        return "source-page"
    return None


def scan_text(rel, text):
    """Absolute local paths anywhere, and links or data values that point into private/. Prose mentions pass."""
    findings = []
    for number, line in enumerate(text.splitlines(), start=1):
        if ABSOLUTE_PATH.search(line):
            findings.append(finding("absolute-path", rel, number))
        if PRIVATE_LINK.search(line):
            findings.append(finding("private-link", rel, number))
    return findings


def scan_settings(rel, text):
    """Settings files may carry placeholders and environment references only, never a literal credential."""
    findings = []
    for number, line in enumerate(text.splitlines(), start=1):
        match = SECRET_KEY.match(line)
        if match and not line.lstrip().startswith(("#", "!")) and not PLACEHOLDER.fullmatch(match[2]):
            findings.append(finding("literal-secret", rel, number))
    return findings


def scan_file(rel, data):
    suffix = Path(rel.split("!")[-1]).suffix.lower()
    if suffix == ".zip":
        findings = []
        with zipfile.ZipFile(io.BytesIO(data)) as archive:
            for name in sorted(archive.namelist()):
                if not name.endswith("/"):
                    findings += scan_file(f"{rel}!{name}", archive.read(name))
        return findings
    if suffix not in TEXT_SUFFIXES:
        return []
    text = data.decode("utf-8", errors="replace")
    return scan_text(rel, text) + (scan_settings(rel, text) if suffix in SETTINGS_SUFFIXES else [])


def listed_files(root, folder):
    """Files git would publish under a folder. Outside a git work tree every file under the folder counts."""
    base = root / folder
    if not base.is_dir():
        return []
    try:
        done = subprocess.run(["git", "-C", str(root), "ls-files", "-co", "--exclude-standard", "-z", "--", folder],
                              capture_output=True, check=True)
        inside = subprocess.run(["git", "-C", str(root), "rev-parse", "--show-toplevel"], capture_output=True, check=True)
        if Path(inside.stdout.decode().strip()).resolve() == root.resolve():
            return sorted(name for name in done.stdout.decode("utf-8").split("\0") if name and (root / name).is_file())
    except (OSError, subprocess.CalledProcessError):
        pass
    return sorted(path.relative_to(root).as_posix() for path in base.rglob("*") if path.is_file())


def question_refs(path):
    """(question id, sourceRefs) for every metadata block of a questions.md manuscript."""
    text = path.read_text(encoding="utf-8-sig")
    for match in re.finditer(r"(?m)^## question: (\S+)\s*\n```json\s*\n([\s\S]*?)\n```", text):
        try:
            yield match[1], json.loads(match[2]).get("sourceRefs", [])
        except json.JSONDecodeError:
            yield match[1], [None]


def public_files(root, provenance, output_dirs=OUTPUT_DIRS):
    files = []
    for folder in AUTHORED_DIRS + tuple(f"source/{name}" for name in provenance.get("checkedDirs", [])):
        files += listed_files(root, folder)
    for folder in output_dirs:
        files += sorted(path.relative_to(root).as_posix() for path in (root / folder).rglob("*") if path.is_file()) if (root / folder).is_dir() else []
    return files


def default_note_ids():
    from build_data import NOTES
    return {note[0] for note in NOTES if note[2]}


def check_public(root, note_ids=None, output_dirs=OUTPUT_DIRS):
    root = Path(root)
    note_ids = default_note_ids() if note_ids is None else note_ids
    provenance = load_provenance(root / "source" / "provenance.json")
    findings = []
    for name in provenance.get("checkedDirs", []):
        base = root / "source" / name
        for path in sorted(base.glob("*/questions.md")) if base.is_dir() else []:
            rel = path.relative_to(root).as_posix()
            for qid, refs in question_refs(path):
                for ref in refs or [None]:
                    issue = source_ref_issue(ref, provenance, note_ids)
                    if issue:
                        findings.append(finding(issue, rel, item=qid))
        for path in sorted(base.glob("projects/*/project.json")) if base.is_dir() else []:
            for ref in json.loads(path.read_text(encoding="utf-8-sig")).get("sourceRefs", []):
                issue = source_ref_issue(ref, provenance, note_ids)
                if issue:
                    findings.append(finding(issue, path.relative_to(root).as_posix(), item=path.parent.name))
    for rel in public_files(root, provenance, output_dirs):
        if rel.split("/")[0] in OUTPUT_DIRS and Path(rel).suffix.lower() in FORBIDDEN_SUFFIXES:
            findings.append(finding("forbidden-file", rel))
            continue
        findings += scan_file(rel, (root / rel).read_bytes())
    return findings


def check_private_index(root, index_path, files=None):
    """Originals exist with the recorded hash, every index ID is registered and no original name appears in public files."""
    root = Path(root)
    provenance = load_provenance(root / "source" / "provenance.json")
    registered = {source["id"] for source in provenance["sources"]}
    files = public_files(root, provenance) if files is None else files
    texts = {rel: (root / rel).read_bytes().decode("utf-8", errors="replace") for rel in files if Path(rel).suffix.lower() in TEXT_SUFFIXES}
    findings = []
    for source in json.loads(Path(index_path).read_text(encoding="utf-8-sig"))["sources"]:
        source_id = source["id"]
        if source_id not in registered:
            findings.append(finding("index-unregistered", "private-index", item=source_id if re.fullmatch(r"[A-Z]+-[A-Z]\d+", source_id) else None))
            continue
        original = Path(source["path"])
        original = original if original.is_absolute() else root / original
        if not original.is_file():
            findings.append(finding("index-missing", "private-index", item=source_id))
        elif hashlib.sha256(original.read_bytes()).hexdigest() != source["sha256"]:
            findings.append(finding("index-hash", "private-index", item=source_id))
        names = {original.name, original.stem}
        for rel, text in texts.items():
            if any(len(name) >= 4 and name in text for name in names):
                findings.append(finding("original-name", rel, item=source_id))
    return findings


def main(argv=None, note_ids=None, out=sys.stdout):
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--public-only", action="store_true")
    parser.add_argument("--private-index")
    parser.add_argument("--root", default=str(ROOT))
    args = parser.parse_args(argv)
    if not args.public_only and not args.private_index:
        parser.error("choose --public-only or --private-index <path>")
    findings = check_public(args.root, note_ids)
    if args.private_index:
        findings += check_private_index(args.root, args.private_index)
    for item in findings:
        print(json.dumps(item, ensure_ascii=True), file=out)
    print(f"Public source check: {len(findings)} findings", file=out)
    return int(bool(findings))


if __name__ == "__main__":
    raise SystemExit(main())
