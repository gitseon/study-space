import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

import build_data
import validate_questions as vq


class DisabledTrackTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        cls.out = Path(cls.tmp.name)
        cls.published = build_data.build_data(ROOT / "source", cls.out)
        cls.manifest = json.loads((cls.out / "manifest.json").read_text(encoding="utf-8"))

    @classmethod
    def tearDownClass(cls):
        cls.tmp.cleanup()

    def test_only_sqld_is_switched_off(self):
        off = [track for track, info in build_data.TRACKS.items() if info.get("enabled") is False]
        self.assertEqual(off, ["sqld"])
        self.assertEqual(build_data.enabled_tracks(), [t for t in build_data.TRACKS if t != "sqld"])

    def test_a_disabled_track_publishes_nothing(self):
        self.assertFalse([e for e in self.published if build_data.track_of(e) == "sqld"])
        self.assertNotIn("sqld", self.manifest["tracks"])
        self.assertFalse([e for e in self.manifest["exams"] if e.get("track") == "sqld"])
        self.assertFalse([n for n in self.manifest["notes"] if n["track"] == "sqld"])
        names = sorted(p.name for p in self.out.iterdir())
        self.assertFalse([n for n in names if "sqld" in n.lower()], names)
        self.assertNotIn("sqld", json.dumps(self.manifest, ensure_ascii=False).lower())

    def test_the_manuscripts_are_still_built_and_checked_when_asked(self):
        with tempfile.TemporaryDirectory() as tmp:
            everything = build_data.build_data(ROOT / "source", Path(tmp), include_disabled=True)
            self.assertTrue(any(build_data.track_of(e) == "sqld" for e in everything))
            self.assertFalse([p for p in Path(tmp).iterdir() if "sqld" in p.name.lower()])
        issues = vq.validate_bank(everything, build_data.load_scope(ROOT / "source", "algorithm"),
                                  {t: build_data.load_scope(ROOT / "source", t) for t in build_data.TRACKS if any(build_data.track_of(e) == t for e in everything)})
        self.assertEqual([i for i in issues if "sqld" in i["questionId"] or i["code"] in ("dialect", "tag-coverage")], [])

    def test_the_sw_test_page_is_hidden_but_its_manuscripts_are_still_checked(self):
        self.assertFalse(build_data.SW_TEST_PUBLISHED)
        self.assertNotIn("swTest", self.manifest)
        self.assertFalse((self.out / "sw-test.json").exists())
        self.assertTrue((ROOT / "source" / build_data.SW_TEST_DIR / "problems.json").is_file())
        self.assertEqual(vq.validate_sw_test(ROOT / "source"), [])
        self.assertTrue(build_data.build_sw_test(ROOT / "source")["problems"])

    def test_the_other_tracks_are_unchanged(self):
        self.assertEqual(set(self.manifest["tracks"]), {"algorithm", "frontend", "ai", "adsp", "backend", "spring"})
        self.assertEqual(len(self.published), 20)
        notes = {n["id"] for n in self.manifest["notes"] if n["file"]}
        self.assertEqual(notes, {"web-concepts", "ai-concepts", "backend-concepts", "db-concepts", "spring-concepts"})

    def test_the_committed_data_has_no_sqld_files(self):
        self.assertFalse([p.name for p in (ROOT / "data").iterdir() if "sqld" in p.name.lower()])


if __name__ == "__main__":
    unittest.main()
