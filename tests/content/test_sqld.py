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

    def test_the_draft_exam_follows_the_blueprint_and_keeps_the_dialects_explicit(self):
        import tempfile, json
        from collections import Counter
        with tempfile.TemporaryDirectory() as tmp:
            exams = [e for e in build_data.build_data(ROOT / "source", Path(tmp)) if build_data.track_of(e) == "sqld"]
        self.assertEqual([e["id"] for e in exams], ["sqld-01"])
        exam = exams[0]
        self.assertEqual((exam["kind"], exam["practiceMinutes"], exam.get("draft"), exam.get("fixedPracticeMinutes")), ("subject", 90, True, None))
        self.assertEqual(exam["counts"], {"mc": 50, "short": 0, "essay": 0, "code": 0})
        groups = Counter(q["group"] for q in exam["questions"])
        self.assertEqual(dict(groups), {g: v["mc"] for g, v in self.scope["groups"].items()})
        subject_of = {t: n for n, ts in self.scope["subjects"].items() for t in ts}
        self.assertEqual(Counter(subject_of[q["group"]] for q in exam["questions"]), Counter({"1과목": 10, "2과목": 40}))
        self.assertTrue(all(q["sqlDialect"] in ("common", "oracle", "sqlserver") for q in exam["questions"]))
        self.assertTrue({"oracle", "sqlserver", "common"} <= {q["sqlDialect"] for q in exam["questions"]})
        self.assertTrue(all(len(q["choices"]) == 4 and set(q["choiceExplanations"]) == {c["id"] for c in q["choices"]} for q in exam["questions"]))
        self.assertTrue(all(q["sourceRefs"] and "mysql" not in json.dumps(q["sourceRefs"]).lower() for q in exam["questions"]))

    def test_every_draft_question_has_a_review_record_that_claims_no_engine_run_or_independence(self):
        import json, tempfile
        with tempfile.TemporaryDirectory() as tmp:
            exam = next(e for e in build_data.build_data(ROOT / "source", Path(tmp)) if e["id"] == "sqld-01")
        records = json.loads((ROOT / "source/sqld/sqld-reviews.json").read_text(encoding="utf-8"))
        self.assertEqual({r["questionId"]: r["revision"] for r in records}, {q["id"]: q["revision"] for q in exam["questions"]})
        for r in records:
            self.assertEqual(r["status"], "draft-unverified")
            self.assertFalse(r["engineRun"])
            self.assertFalse(r["independent"])

    def test_the_manifest_lists_the_track_with_its_subjects_and_marks_the_exam_as_a_draft(self):
        import tempfile, json
        with tempfile.TemporaryDirectory() as tmp:
            build_data.build_data(ROOT / "source", Path(tmp))
            manifest = json.loads((Path(tmp) / "manifest.json").read_text(encoding="utf-8"))
        self.assertEqual(manifest["tracks"]["sqld"]["subjects"], self.scope["subjects"])
        self.assertTrue(next(e for e in manifest["exams"] if e["id"] == "sqld-01")["draft"])

    def test_a_question_without_a_valid_dialect_fails_validation(self):
        import validate_questions as vq
        scope = {"topics": {"g": "x"}, "tags": {"g": ["t"]}, "groups": {}, "composition": {"subject": {"mc": 1, "short": 0, "essay": 0, "code": 0}}}
        q = {"id": "s-q1", "title": "t", "stem": "s", "solution": "s", "revision": 1, "difficulty": 1, "sourceRefs": ["r"], "topics": ["g"], "group": "g",
             "tags": ["t"], "type": "mc", "choices": [{"id": c, "text": c} for c in "abcd"], "choiceExplanations": {}}
        exam = lambda extra: {"id": "s", "kind": "subject", "track": "sqld", "counts": {"mc": 1, "short": 0, "essay": 0, "code": 0}, "questions": [{**q, **extra}]}
        codes = lambda e: [i["code"] for i in vq.validate_bank([e], scope, {"sqld": scope})]
        self.assertIn("dialect", codes(exam({})))
        self.assertIn("dialect", codes(exam({"sqlDialect": "mysql"})))
        self.assertNotIn("dialect", codes(exam({"sqlDialect": "oracle"})))

if __name__ == "__main__":
    unittest.main()
