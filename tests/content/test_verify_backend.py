import copy
import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

import verify_backend_answers as vb

def question(qid="b-q1", revision=1):
    return {"id": qid, "revision": revision}

def review(qid="b-q1", revision=1, **extra):
    return {"questionId": qid, "revision": revision, "reviewer": "작성자", "reviewedAt": "2026-11-03", "note": "n", "independent": False, **extra}

class CoverageTests(unittest.TestCase):
    def test_a_check_or_a_review_at_the_current_revision_covers_a_question(self):
        self.assertEqual(vb.coverage_issues([question()], [{"questionId": "b-q1", "revision": 1}], []), [])
        self.assertEqual(vb.coverage_issues([question()], [], [review()]), [])

    def test_a_question_without_any_record_fails(self):
        self.assertTrue(vb.coverage_issues([question()], [], []))

    def test_a_record_for_an_older_revision_fails_and_the_question_stays_uncovered(self):
        issues = vb.coverage_issues([question(revision=2)], [{"questionId": "b-q1", "revision": 1}], [])
        self.assertEqual(len(issues), 2)

    def test_a_record_for_an_unknown_question_fails(self):
        self.assertTrue(vb.coverage_issues([question()], [{"questionId": "nope", "revision": 1}], [review()]))

    def test_a_review_must_say_who_wrote_it_and_whether_it_was_independent(self):
        for broken in ({"reviewer": ""}, {"note": ""}, {"reviewedAt": ""}):
            self.assertTrue(vb.coverage_issues([question()], [], [review(**broken)]), broken)
        no_flag = review(); del no_flag["independent"]
        self.assertTrue(vb.coverage_issues([question()], [], [no_flag]))

    def test_published_records_cover_every_backend_question(self):
        import build_data
        with tempfile.TemporaryDirectory() as tmp:
            exams = build_data.build_data(ROOT / "source", Path(tmp))
        questions = [q for e in exams if build_data.track_of(e) == "backend" for q in e["questions"]]
        checks = json.loads((ROOT / "source/backend/backend-checks.json").read_text(encoding="utf-8"))
        reviews = json.loads((ROOT / "source/backend/backend-reviews.json").read_text(encoding="utf-8"))
        self.assertEqual(vb.coverage_issues(questions, checks, reviews), [])
        self.assertTrue(all(not r["independent"] for r in reviews))

class ComparisonTests(unittest.TestCase):
    def test_unordered_rows_ignore_order_but_keep_duplicates(self):
        self.assertTrue(vb.rows_match([["b"], ["a"]], [["a"], ["b"]], False))
        self.assertFalse(vb.rows_match([["a"], ["a"]], [["a"]], False))

    def test_ordered_rows_must_match_in_order(self):
        self.assertFalse(vb.rows_match([["b"], ["a"]], [["a"], ["b"]], True))
        self.assertTrue(vb.rows_match([["1"], ["2"]], [[1], [2]], True))

    def test_error_codes_are_read_from_client_output(self):
        self.assertEqual(vb.error_code(["ERROR 1451 (23000) at line 1: Cannot delete"]), 1451)
        self.assertIsNone(vb.error_code(["1", "2"]))

    def test_a_step_fails_on_the_wrong_error_an_unexpected_error_or_other_rows(self):
        self.assertIsNone(vb.check_step({"expect": {"error": 1451}}, ["ERROR 1451 (23000)"]))
        self.assertTrue(vb.check_step({"expect": {"error": 1451}}, ["ERROR 1701 (42000)"]))
        self.assertTrue(vb.check_step({"expect": {"error": 1451}}, []))
        self.assertTrue(vb.check_step({"expect": {}}, ["ERROR 1064 (42000)"]))
        self.assertIsNone(vb.check_step({"expect": {"rows": [["2"]]}}, ["2"]))
        self.assertTrue(vb.check_step({"expect": {"rows": [["2"]]}}, ["3"]))

    def test_java_output_must_contain_every_expected_value(self):
        outputs = {"f.java": {"a": "1", "b": "2"}}
        self.assertEqual(vb.java_failures({"file": "f.java", "expect": {"a": "1"}}, outputs), [])
        self.assertTrue(vb.java_failures({"file": "f.java", "expect": {"a": "9"}}, outputs))
        self.assertTrue(vb.java_failures({"file": "f.java", "expect": {"c": "1"}}, outputs))

class ConnectionSettingsTests(unittest.TestCase):
    def test_settings_come_from_the_environment_then_the_file(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "x.env"
            path.write_text("MYSQL_HOST=h\nMYSQL_USER=u\nMYSQL_PASSWORD='p w'\nMYSQL_DATABASE=d\n", encoding="utf-8")
            self.assertEqual(vb.load_env(path, {})["MYSQL_PASSWORD"], "p w")
            self.assertEqual(vb.load_env(path, {"MYSQL_HOST": "other"})["MYSQL_HOST"], "other")

    def test_missing_settings_fail_instead_of_skipping(self):
        with self.assertRaises(vb.VerifyError):
            vb.load_env(None, {"MYSQL_HOST": "h"})
        with tempfile.TemporaryDirectory() as tmp:
            with self.assertRaises(vb.VerifyError):
                vb.load_env(Path(tmp) / "none.env", {})

def database_available():
    try:
        env = vb.load_env(vb.DEFAULT_ENV)
        vb.Session(env).close()
        return env
    except (vb.VerifyError, OSError):
        return None

ENV = database_available()

@unittest.skipUnless(ENV, "no MySQL connection settings on this machine")
class LiveDatabaseTests(unittest.TestCase):
    def checks(self):
        return {c["id"]: c for c in json.loads((ROOT / "source/backend/backend-checks.json").read_text(encoding="utf-8"))}

    def test_a_correct_expectation_passes_and_a_wrong_one_fails(self):
        check = self.checks()["sql-q15"]
        self.assertEqual(vb.run_sql_check(check, ENV), [])
        wrong = copy.deepcopy(check)
        wrong["steps"][1]["expect"]["rows"] = [["3"]]
        self.assertTrue(vb.run_sql_check(wrong, ENV))

    def test_a_wrong_error_code_fails(self):
        wrong = copy.deepcopy(self.checks()["sql-q16"])
        wrong["steps"][0]["expect"] = {"error": 1701}
        self.assertTrue(vb.run_sql_check(wrong, ENV))

    def test_two_sessions_see_different_snapshots(self):
        check = copy.deepcopy(self.checks()["sql-q19"])
        self.assertEqual(vb.run_sql_check(check, ENV), [])
        check["steps"][4]["expect"]["rows"] = [["150"]]
        self.assertTrue(vb.run_sql_check(check, ENV))

if __name__ == "__main__":
    unittest.main()
