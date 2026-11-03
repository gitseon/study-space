import copy
import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

import build_data
import validate_questions as vq

NOTES = {"backend-concepts": "# 백엔드\n\n## Part 2. Servlet 기초\n\n## Part 3. Filter\n",
         "db-concepts": "# DB\n\n## Part 2. SELECT\n"}

def exam(track, *ids):
    return {"id": track + "-01", "track": track, "kind": "subject", "questions": [{"id": i} for i in ids]}

def coverage(profile="pilot", questions=("b-q1",)):
    return {"coverageProfile": profile, "requirements": [{
        "requirementId": "B01", "noteId": "backend-concepts", "section": "Part 2. Servlet 기초",
        "alsoSee": [{"noteId": "db-concepts", "section": "Part 2. SELECT"}],
        "keywords": [{"id": "init", "questionIds": list(questions)}, {"id": "thread", "questionIds": []}],
        "questionIds": list(questions)}]}

def codes(cov, exams):
    return [i["code"] for i in vq.validate_coverage(cov, exams, NOTES)]

class BackendCoverageTests(unittest.TestCase):
    def test_pilot_needs_one_question_per_requirement_not_per_keyword(self):
        self.assertEqual(codes(coverage("pilot"), [exam("backend", "b-q1")]), [])

    def test_full_needs_a_question_for_every_keyword(self):
        self.assertIn("coverage-keyword", codes(coverage("full"), [exam("backend", "b-q1")]))

    def test_requirement_without_a_question_fails_once_exams_exist(self):
        self.assertIn("coverage-question", codes(coverage("pilot", ()), [exam("backend", "b-q1")]))

    def test_links_are_optional_while_the_track_has_no_exam(self):
        self.assertEqual(codes(coverage("pilot", ()), []), [])

    def test_unknown_question_is_rejected(self):
        self.assertIn("coverage-unknown", codes(coverage("pilot", ("nope",)), [exam("backend", "b-q1")]))

    def test_question_of_another_track_is_rejected(self):
        found = codes(coverage("pilot", ("f-q1",)), [exam("backend", "b-q1"), exam("frontend", "f-q1")])
        self.assertIn("coverage-track", found)

    def test_missing_note_or_section_is_rejected(self):
        bad = coverage(); bad["requirements"][0]["section"] = "Part 9. 없는 절"
        self.assertIn("coverage-section", codes(bad, [exam("backend", "b-q1")]))
        bad = coverage(); bad["requirements"][0]["noteId"] = "web-concepts"
        self.assertIn("coverage-note", codes(bad, [exam("backend", "b-q1")]))
        bad = coverage(); bad["requirements"][0]["alsoSee"][0]["section"] = "Part 9. 없는 절"
        self.assertIn("coverage-section", codes(bad, [exam("backend", "b-q1")]))

    def test_profile_and_duplicate_ids_are_checked(self):
        bad = coverage(); bad["coverageProfile"] = "draft"
        self.assertIn("coverage-profile", codes(bad, []))
        bad = coverage(); bad["requirements"].append(copy.deepcopy(bad["requirements"][0]))
        self.assertIn("coverage-duplicate", codes(bad, []))

    def test_keyword_question_must_also_be_listed_on_the_requirement(self):
        bad = coverage(); bad["requirements"][0]["keywords"][1]["questionIds"] = ["b-q2"]
        self.assertIn("coverage-listed", codes(bad, [exam("backend", "b-q1", "b-q2")]))

    def test_published_coverage_file_is_valid(self):
        path = ROOT / "source" / "backend" / "coverage-backend.json"
        self.assertTrue(path.exists())
        data = json.loads(path.read_text(encoding="utf-8"))
        ids = [r["requirementId"] for r in data["requirements"]]
        self.assertEqual(ids, ["B01", "B02", "B03", "B04", "B05", "B06", "D01", "D02", "D03", "D04", "I01"])
        texts = vq.backend_note_texts(ROOT / "source")
        with tempfile.TemporaryDirectory() as tmp:
            exams = build_data.build_data(ROOT / "source", Path(tmp))
        self.assertEqual(vq.validate_coverage(data, exams, texts), [])
        self.assertEqual(data["coverageProfile"], "full")
        self.assertTrue(all(k["questionIds"] for r in data["requirements"] for k in r["keywords"]))
        self.assertTrue(all(r["questionIds"] for r in data["requirements"]))

if __name__ == "__main__":
    unittest.main()
