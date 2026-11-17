import shutil
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

import build_data
import build_site


def files(base):
    return sorted(p.relative_to(base).as_posix() for p in base.rglob("*") if p.is_file())


class PublicBuildTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        cls.fresh = Path(cls.tmp.name) / "fresh"
        build_data.build_data(ROOT / "source", cls.fresh)

    @classmethod
    def tearDownClass(cls):
        cls.tmp.cleanup()

    def setUp(self):
        self.work = tempfile.TemporaryDirectory()
        self.data = Path(self.work.name) / "data"
        shutil.copytree(self.fresh, self.data)
        self.dist = Path(self.work.name) / "dist"

    def tearDown(self):
        self.work.cleanup()

    def test_fresh_data_builds_and_dist_carries_exactly_the_fresh_files(self):
        build_site.build_site(self.dist, data_dir=self.data)
        self.assertEqual(files(self.dist / "data"), files(self.fresh))
        self.assertTrue((self.dist / "index.html").is_file())
        self.assertTrue((self.dist / ".nojekyll").is_file())
        # Switched-off pieces never reach the published site.
        self.assertFalse((self.dist / "pages" / "sw-test.html").exists())
        self.assertFalse((self.dist / "assets" / "sw-test.js").exists())
        self.assertFalse([p for p in (self.dist / "data").iterdir() if "sqld" in p.name.lower() or p.name == "sw-test.json"])

    def test_leftover_files_in_data_fail_instead_of_being_published(self):
        for rel in ("old-exam.json", "memo.txt", "backend-projects/web-01/notes.md", "lecture.pdf"):
            with self.subTest(rel=rel):
                extra = self.data / rel
                extra.write_text("{}", encoding="utf-8")
                with self.assertRaises(SystemExit) as raised:
                    build_site.build_site(self.dist, data_dir=self.data)
                self.assertIn(rel, str(raised.exception))
                self.assertFalse(self.dist.exists())
                extra.unlink()

    def test_missing_and_changed_files_fail(self):
        zips = sorted(self.data.rglob("*.zip"))
        self.assertTrue(zips)
        zips[0].write_bytes(zips[0].read_bytes() + b"x")
        with self.assertRaises(SystemExit) as raised:
            build_site.build_site(self.dist, data_dir=self.data)
        self.assertIn(zips[0].relative_to(self.data).as_posix(), str(raised.exception))
        shutil.copy2(self.fresh / zips[0].relative_to(self.data), zips[0])
        (self.data / "manifest.json").unlink()
        with self.assertRaises(SystemExit) as raised:
            build_site.build_site(self.dist, data_dir=self.data)
        self.assertIn("manifest.json", str(raised.exception))

    def test_an_unrelated_folder_is_never_deleted(self):
        self.dist.mkdir()
        (self.dist / "keep.txt").write_text("mine", encoding="utf-8")
        with self.assertRaises(SystemExit):
            build_site.build_site(self.dist, data_dir=self.data)
        self.assertEqual((self.dist / "keep.txt").read_text(encoding="utf-8"), "mine")

    def test_a_previous_build_is_replaced(self):
        build_site.build_site(self.dist, data_dir=self.data)
        (self.dist / "data" / "stale.json").write_text("{}", encoding="utf-8")
        build_site.build_site(self.dist, data_dir=self.data)
        self.assertFalse((self.dist / "data" / "stale.json").exists())

    def test_unreleased_projects_block_the_build(self):
        original = build_site.release_issues_for_track
        build_site.release_issues_for_track = lambda source_root, track: ["spring-web-01: 필수 검증 unit이 unverified 상태입니다"] if track == "spring" else []
        try:
            with self.assertRaises(SystemExit) as raised:
                build_site.build_site(self.dist, data_dir=self.data)
        finally:
            build_site.release_issues_for_track = original
        self.assertIn("spring-web-01", str(raised.exception))
        self.assertFalse(self.dist.exists())

    def test_private_values_in_assets_block_the_build(self):
        findings = build_site.public_findings({"assets/x.js": b"const p='C:\\Users\\someone\\a';", "data/a.pdf": b"%PDF"})
        self.assertEqual(sorted(f["code"] for f in findings), ["absolute-path", "forbidden-file"])


if __name__ == "__main__":
    unittest.main()
