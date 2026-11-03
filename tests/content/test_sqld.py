import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

import build_data

class SqldScopeTests(unittest.TestCase):
    def setUp(self):
        self.scope = build_data.load_scope(ROOT / "source", "sqld")

    def test_fifty_choice_questions_split_ten_and_forty_by_subject(self):
        s = self.scope
        self.assertEqual(s["composition"]["subject"], {"mc": 50, "short": 0, "essay": 0, "code": 0})
        self.assertEqual(sum(g["mc"] for g in s["groups"].values()), 50)
        self.assertEqual(set(s["groups"]), set(s["topics"]))
        self.assertEqual(set(s["tags"]), set(s["topics"]))
        by_subject = {name: sum(s["groups"][t]["mc"] for t in topics) for name, topics in s["subjects"].items()}
        self.assertEqual(by_subject, {"1과목": 10, "2과목": 40})
        self.assertEqual({k: v["mc"] for k, v in s["subjectComposition"].items()}, by_subject)
        self.assertEqual(sorted(t for ts in s["subjects"].values() for t in ts), sorted(s["topics"]))

    def test_group_sizes_follow_the_plan(self):
        sizes = {g: v["mc"] for g, v in self.scope["groups"].items()}
        self.assertEqual(sizes, {"model-basics": 5, "model-sql": 5, "sql-basics": 8, "join": 5, "subquery-set": 6,
                                 "group-window": 7, "top-hierarchy": 5, "pivot-regex": 3, "management": 6})

    def test_every_group_links_to_the_sqld_note_first_and_the_ownership_is_kept(self):
        links = self.scope["studyLinks"]
        self.assertEqual(set(links), set(self.scope["topics"]))
        for group, entries in links.items():
            self.assertEqual(entries[0]["noteId"], "sqld-concepts", group)
        owners = {n[0]: n[3] for n in build_data.NOTES}
        self.assertEqual(owners["sqld-concepts"], "sqld")
        self.assertEqual(owners["db-concepts"], "backend")

    def test_the_note_has_the_ten_parts_and_keeps_the_dialects_apart(self):
        text = (ROOT / "source" / "sqld" / "SQLD개념 요약노트.md").read_text(encoding="utf-8")
        parts = re.findall(r"(?m)^## (Part \d+)\.", text)
        self.assertEqual(parts, [f"Part {i}" for i in range(1, 11)])
        for needle in ("Oracle", "SQL Server", "ROWNUM", "CONNECT BY", "PIVOT", "REGEXP_LIKE", "ROLLUP", "RANK"):
            self.assertIn(needle, text)
        self.assertNotIn("MySQL 8", text)

    def test_the_published_manifest_leaves_a_track_without_exams_out_of_the_tracks(self):
        import tempfile, json
        with tempfile.TemporaryDirectory() as tmp:
            build_data.build_data(ROOT / "source", Path(tmp))
            manifest = json.loads((Path(tmp) / "manifest.json").read_text(encoding="utf-8"))
        self.assertNotIn("sqld", manifest["tracks"])
        sqld_note = next(n for n in manifest["notes"] if n["id"] == "sqld-concepts")
        self.assertEqual((sqld_note["track"], sqld_note["file"]), ("sqld", "sqld-concepts.md"))

if __name__ == "__main__":
    unittest.main()
