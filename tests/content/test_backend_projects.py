import json
import shutil
import sys
import tempfile
import unittest
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

import build_backend_projects as bp  # noqa: E402
import build_data  # noqa: E402
import validate_backend_projects as vp  # noqa: E402

PROJECTS = ROOT / "source" / "backend" / "projects"
MAIN_JAVA = "src/main/java/com/ssafy/sample"


def copy_source(tmp: Path) -> Path:
    source = tmp / "source"
    target = source / "backend" / "projects"
    target.parent.mkdir(parents=True)
    shutil.copytree(PROJECTS, target, ignore=shutil.ignore_patterns("_master", "README.md"))
    shutil.copy2(ROOT / "source" / "backend" / "scope-backend.json", source / "backend" / "scope-backend.json")
    return source


class BuildCase(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.tmp = Path(self._tmp.name)
        self.source = copy_source(self.tmp)
        self.out = self.tmp / "data"

    def tearDown(self):
        self._tmp.cleanup()

    def build(self):
        return bp.build_projects(self.source, self.out)

    def project_dir(self, pid="web-01"):
        return self.source / "backend" / "projects" / pid

class ProjectBuildTests(BuildCase):
    def test_build_returns_manifest_entry_and_writes_files(self):
        result = self.build()
        self.assertEqual(result, {"file": "backend-projects.json", "count": 2, "track": "backend"})
        index = json.loads((self.out / "backend-projects.json").read_text(encoding="utf-8"))
        self.assertEqual([p["id"] for p in index["projects"]], ["web-01", "web-02"])
        for project in index["projects"]:
            self.assertEqual([s["id"] for s in project["stages"]], [1, 2, 3])
            for rel in [project["project"], project["referenceFile"]] + [s[k] for s in project["stages"] for k in ("file", "zip")]:
                self.assertTrue((self.out / rel).is_file(), rel)

    def test_three_stages_cover_targets(self):
        self.build()
        for pid in ("web-01", "web-02"):
            project = json.loads((self.out / "backend-projects" / pid / "project.json").read_text(encoding="utf-8"))
            ids = [t["id"] for t in project["targets"]]
            self.assertEqual(len(ids), 16)
            for number in (1, 2, 3):
                stage = json.loads((self.out / "backend-projects" / pid / f"stage-{number}.json").read_text(encoding="utf-8"))
                text_by_path = {f["path"]: f["text"] for f in stage["files"]}
                for target in project["targets"]:
                    text = text_by_path[target["path"]]
                    self.assertEqual(text.count(f"study-target:{target['id']}:start"), 1, (pid, number, target["id"]))
                    self.assertEqual(text.count(f"study-target:{target['id']}:end"), 1, (pid, number, target["id"]))
                self.assertEqual(sorted(t["id"] for t in stage["targets"]), sorted(ids))

    def test_duration_options(self):
        path = self.project_dir() / "project.json"
        data = json.loads(path.read_text(encoding="utf-8"))
        self.assertEqual(data["durationOptions"], [90, 120, 0])
        self.assertEqual(data["defaultMinutes"], 120)
        data["durationOptions"] = [90, 120, 45]
        path.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
        with self.assertRaisesRegex(bp.ProjectError, "durationOptions"):
            self.build()
        data["durationOptions"] = [90, 120, 0]
        data["defaultMinutes"] = 60
        path.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
        with self.assertRaisesRegex(bp.ProjectError, "defaultMinutes"):
            self.build()

    def test_missing_file(self):
        (self.project_dir() / "stages" / "2" / MAIN_JAVA / "controller" / "GearController.java").unlink()
        with self.assertRaisesRegex(bp.ProjectError, "GearController.java"):
            self.build()

    def test_path_escape(self):
        path = self.project_dir() / "project.json"
        data = json.loads(path.read_text(encoding="utf-8"))
        data["files"][0]["path"] = "../outside.txt"
        path.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
        with self.assertRaisesRegex(bp.ProjectError, "경로"):
            self.build()
        for bad in ("/abs.txt", "C:/abs.txt", "a\\b.txt", "a/../b.txt", "a//b.txt"):
            data["files"][0]["path"] = bad
            path.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
            with self.assertRaisesRegex(bp.ProjectError, "경로"):
                self.build()

    def test_no_reference_in_starter_zip(self):
        self.build()
        for pid in ("web-01", "web-02"):
            reference = json.loads((self.out / "backend-projects" / pid / "reference.json").read_text(encoding="utf-8"))
            ref_text = {f["path"]: f["text"] for f in reference["files"]}
            for number in (1, 2, 3):
                with zipfile.ZipFile(self.out / "backend-projects" / pid / f"stage-{number}.zip") as archive:
                    names = archive.namelist()
                    self.assertEqual(names, sorted(names))
                    root = f"{pid}-stage-{number}/"
                    self.assertTrue(all(n.startswith(root) for n in names))
                    self.assertFalse([n for n in names if "reference" in n or n.endswith(("review.json", "verification.md"))])
                    self.assertFalse([n for n in names if "/target/" in n or "/build/" in n or n.endswith(".class")])
                    for name in names:
                        path = name[len(root):]
                        text = archive.read(name).decode("utf-8")
                        if "study-target:" in text:
                            self.assertNotEqual(text, ref_text[path], name)
                    self.assertEqual({n[len(root):] for n in names}, set(ref_text))

    def test_revision_hash(self):
        self.build()
        first = (self.out / "backend-projects.json").read_bytes()
        zip_first = (self.out / "backend-projects" / "web-01" / "stage-1.zip").read_bytes()
        self.build()
        self.assertEqual((self.out / "backend-projects.json").read_bytes(), first)
        self.assertEqual((self.out / "backend-projects" / "web-01" / "stage-1.zip").read_bytes(), zip_first)
        before = {p["id"]: p["hash"] for p in json.loads(first)["projects"]}
        edited = self.project_dir() / "stages" / "1" / "src/main/webapp/header.jsp"
        edited.write_text(edited.read_text(encoding="utf-8") + "<!-- edit -->\n", encoding="utf-8")
        self.build()
        after = {p["id"]: p["hash"] for p in json.loads((self.out / "backend-projects.json").read_text(encoding="utf-8"))["projects"]}
        self.assertNotEqual(before["web-01"], after["web-01"])
        self.assertEqual(before["web-02"], after["web-02"])

    def test_reference_with_practice_marker_fails(self):
        path = self.project_dir() / "reference" / "src/main/webapp/index.jsp"
        path.write_text(path.read_text(encoding="utf-8") + "<%-- study-target:x:start --%>\n", encoding="utf-8")
        with self.assertRaisesRegex(bp.ProjectError, "reference"):
            self.build()

    def test_missing_end_marker_fails(self):
        path = self.project_dir() / "stages" / "3" / MAIN_JAVA / "controller/GearController.java"
        text = path.read_text(encoding="utf-8").replace("study-target:ctrl-logout:end", "removed")
        path.write_text(text, encoding="utf-8")
        with self.assertRaisesRegex(bp.ProjectError, "ctrl-logout"):
            self.build()

    def test_local_absolute_path_is_rejected(self):
        path = self.project_dir() / "requirements.md"
        path.write_text(path.read_text(encoding="utf-8") + "\nC:\\Users\\someone\\project\n", encoding="utf-8")
        with self.assertRaisesRegex(bp.ProjectError, "로컬 경로"):
            self.build()

    def test_duplicate_project_id_fails(self):
        shutil.copytree(self.project_dir(), self.source / "backend" / "projects" / "web-03")
        with self.assertRaisesRegex(bp.ProjectError, "id"):
            self.build()

    def test_hint_and_checklist_links_are_checked(self):
        path = self.project_dir() / "checklist.json"
        data = json.loads(path.read_text(encoding="utf-8"))
        data[0]["targetIds"].append("ghost-target")
        path.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
        with self.assertRaisesRegex(bp.ProjectError, "ghost-target"):
            self.build()


class StructureTests(BuildCase):
    def edit_project(self, change):
        path = self.project_dir() / "project.json"
        data = json.loads(path.read_text(encoding="utf-8"))
        change(data["structure"])
        path.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")

    def test_structure_reaches_the_built_project_data(self):
        self.build()
        data = json.loads((self.out / "backend-projects" / "web-01" / "project.json").read_text(encoding="utf-8"))
        self.assertGreaterEqual(len(data["structure"]["nodes"]), 15)
        self.assertIn("overview", data["structure"]["flows"])

    def test_skeleton_must_not_contain_answer_lines(self):
        def leak(structure):
            node = next(n for n in structure["nodes"] if n["id"] == "gearctl")
            node["skeleton"].append("        request.setAttribute(\"list\", list);")
        self.edit_project(leak)
        with self.assertRaisesRegex(bp.ProjectError, "모범답안 줄"):
            self.build()

    def test_method_must_exist_in_the_file(self):
        self.edit_project(lambda s: next(n for n in s["nodes"] if n["id"] == "dao")["methods"].append("noSuchMethod"))
        with self.assertRaisesRegex(bp.ProjectError, "noSuchMethod"):
            self.build()

    def test_edges_flows_and_paths_must_resolve(self):
        self.edit_project(lambda s: s["edges"][0].update(to="ghost"))
        with self.assertRaisesRegex(bp.ProjectError, "끝점"):
            self.build()
        self.edit_project(lambda s: s["edges"][0].update(to="logging"))
        self.edit_project(lambda s: s["flows"]["list"]["edges"].append("e-ghost"))
        with self.assertRaisesRegex(bp.ProjectError, "e-ghost"):
            self.build()
        self.edit_project(lambda s: s["flows"]["list"]["edges"].remove("e-ghost"))
        self.edit_project(lambda s: s["nodes"][1].update(path="src/nothing.jsp"))
        with self.assertRaisesRegex(bp.ProjectError, "nothing.jsp"):
            self.build()


class RealSourceTests(unittest.TestCase):
    def test_real_projects_have_no_issues(self):
        self.assertEqual(vp.validate_projects(ROOT / "source"), [])

    def test_build_data_registers_projects_without_changing_question_counts(self):
        with tempfile.TemporaryDirectory() as tmp:
            exams = build_data.build_data(ROOT / "source", Path(tmp))
            manifest = json.loads((Path(tmp) / "manifest.json").read_text(encoding="utf-8"))
            self.assertEqual(manifest["webProjects"], {"file": "backend-projects.json", "count": 2, "track": "backend"})
            self.assertEqual(len(manifest["exams"]), len(exams))
            self.assertTrue((Path(tmp) / "backend-projects" / "web-01" / "stage-1.zip").is_file())


if __name__ == "__main__":
    unittest.main()
