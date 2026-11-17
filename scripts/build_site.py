import json
import shutil
import tempfile
from pathlib import Path
from build_data import ROOT, SW_TEST_PUBLISHED, build_data
from check_public_sources import FORBIDDEN_SUFFIXES, finding, scan_file
from project_catalog import PROJECT_TRACKS
from validate_projects import release_issues_for_track

PAGES=["index.html","pages/quiz.html","pages/review.html","pages/concepts.html","pages/sw-test.html","pages/project.html"]
SW_TEST_FILES=("pages/sw-test.html","assets/sw-test.js")

def published_pages():
    return [page for page in PAGES if SW_TEST_PUBLISHED or page not in SW_TEST_FILES]

def relative_files(base):
    return {f.relative_to(base).as_posix():f for f in base.rglob("*") if f.is_file()} if base.is_dir() else {}

def same_content(rel,fresh,current):
    """JSON is compared as data and Markdown as text so line endings alone never make a file stale. Everything else by bytes."""
    if rel.endswith(".json"): return json.loads(fresh.read_text(encoding="utf-8"))==json.loads(current.read_text(encoding="utf-8"))
    if rel.endswith(".md"): return fresh.read_text(encoding="utf-8")==current.read_text(encoding="utf-8")
    return fresh.read_bytes()==current.read_bytes()

def stale_data(fresh_dir,data_dir):
    """Relative paths that are missing from, changed in or only present in data/, measured against a fresh build."""
    fresh,current=relative_files(fresh_dir),relative_files(data_dir)
    return sorted(rel for rel in set(fresh)|set(current) if rel not in fresh or rel not in current or not same_content(rel,fresh[rel],current[rel]))

def public_findings(contents):
    """Private values and original-material file types among the files about to be published, keyed by site path."""
    findings=[]
    for rel,data in sorted(contents.items()):
        if Path(rel).suffix.lower() in FORBIDDEN_SUFFIXES: findings.append(finding("forbidden-file",rel))
        else: findings+=scan_file(rel,data)
    return findings

def removable(output_dir,root):
    """Only the repository's dist folder or a folder a previous build left behind may be replaced."""
    return not output_dir.exists() or output_dir.resolve()==(root/"dist").resolve() or (output_dir/".nojekyll").is_file() or not any(output_dir.iterdir())

def build_site(output_dir: Path, data_dir: Path=None, root: Path=ROOT) -> None:
    data_dir=data_dir or root/"data"
    # Projects whose required runtime verification is missing, failed or expired are never published.
    unreleased=[issue for track in PROJECT_TRACKS for issue in release_issues_for_track(root/"source",track)]
    if unreleased:
        raise SystemExit("Refusing to publish unverified projects:\n"+"\n".join(unreleased))
    with tempfile.TemporaryDirectory() as tmp:
        fresh=Path(tmp); build_data(root/"source",fresh)
        stale=stale_data(fresh,data_dir)
        if stale:
            raise SystemExit(f"data/{stale[0]} is stale or not part of a fresh build ({len(stale)} file(s)). Run python scripts/build_data.py first and remove files it did not create.")
        contents={f"data/{rel}":path.read_bytes() for rel,path in relative_files(fresh).items()}
        contents.update({page:(root/page).read_bytes() for page in published_pages()})
        contents.update({f"assets/{rel}":path.read_bytes() for rel,path in relative_files(root/"assets").items() if SW_TEST_PUBLISHED or f"assets/{rel}" not in SW_TEST_FILES})
        findings=public_findings(contents)
        if findings:
            raise SystemExit("Refusing to publish: "+"; ".join(f"{f['code']} {f['file']}"+(f":{f['line']}" if "line" in f else "") for f in findings[:10]))
        if not removable(output_dir,root):
            raise SystemExit(f"{output_dir} is not a previous site build. Choose an empty folder or dist/.")
        if output_dir.exists(): shutil.rmtree(output_dir)
        output_dir.mkdir(parents=True)
        # Only the files of the fresh build are published, never whatever happens to sit in data/.
        for rel,data in contents.items():
            target=output_dir/rel; target.parent.mkdir(parents=True,exist_ok=True); target.write_bytes(data)
    (output_dir/".nojekyll").write_text("",encoding="utf-8")

if __name__=="__main__":
    target=ROOT/"dist"; build_site(target)
    print(f"Site built: {sum(1 for p in target.rglob('*') if p.is_file())} files in dist/")
