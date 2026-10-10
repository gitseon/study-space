import json
import shutil
import tempfile
from pathlib import Path
from build_data import ROOT, build_data

PAGES=["index.html","quiz.html","review.html","concepts.html"]

def build_site(output_dir: Path) -> None:
    with tempfile.TemporaryDirectory() as tmp:
        fresh=Path(tmp); build_data(ROOT/"source",fresh)
        for generated in sorted(fresh.glob("*.json"))+sorted(fresh.glob("*.md")):
            current=ROOT/"data"/generated.name
            read=(lambda p:json.loads(p.read_text(encoding="utf-8"))) if generated.suffix==".json" else (lambda p:p.read_text(encoding="utf-8"))
            if not current.exists() or read(current)!=read(generated):
                raise SystemExit(f"data/{generated.name} is stale. Run python scripts/build_data.py first.")
    if output_dir.exists(): shutil.rmtree(output_dir)
    output_dir.mkdir(parents=True)
    for page in PAGES: shutil.copy2(ROOT/page,output_dir/page)
    shutil.copytree(ROOT/"assets",output_dir/"assets")
    shutil.copytree(ROOT/"data",output_dir/"data")
    (output_dir/".nojekyll").write_text("",encoding="utf-8")

if __name__=="__main__":
    target=ROOT/"dist"; build_site(target)
    print(f"Site built: {sum(1 for p in target.rglob('*') if p.is_file())} files in dist/")
