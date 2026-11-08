import json
import shutil
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))
import build_data  # noqa: E402

CHECKS = ROOT / "source" / "backend" / "backend-checks.json"

def shown_steps(checks):
    return [(c, s) for c in checks if c.get("kind") == "sql" for s in c["steps"] if "show" in s]

class ResultTableTests(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self._tmp.cleanup)
        self.root = Path(self._tmp.name) / "backend"
        shutil.copytree(ROOT / "source" / "backend" / "backend-01", self.root / "backend-01")
        self.checks = json.loads(CHECKS.read_text(encoding="utf-8"))

    def build(self):
        (self.root / "backend-checks.json").write_text(json.dumps(self.checks, ensure_ascii=False), encoding="utf-8")
        return {q["id"]: q for q in build_data.parse_exam(self.root / "backend-01")["questions"]}

    def step(self, question_id, number):
        check = next(c for c in self.checks if c["questionId"] == question_id)
        return check, check["steps"][number]

    def test_every_shown_step_of_the_real_checks_becomes_a_table_of_its_question(self):
        built = {}
        for n in ("01", "02", "03"):
            exam = build_data.parse_exam(ROOT / "source" / "backend" / f"backend-{n}")
            built.update({q["id"]: q for q in exam["questions"]})
        expected = {}
        for check, step in shown_steps(self.checks):
            expected.setdefault(check["questionId"], []).append(step["show"]["title"])
        self.assertGreaterEqual(len(expected), 20)
        for qid, titles in expected.items():
            self.assertEqual([t["title"] for t in built[qid]["resultTables"]], titles, qid)
        self.assertEqual({qid for qid, q in built.items() if "resultTables" in q}, set(expected))

    def test_rows_and_columns_come_from_the_check_and_unordered_results_get_a_note(self):
        tables = self.build()["backend-01-q13"]["resultTables"]
        self.assertEqual(tables[0]["columns"], ["name", "status"])
        self.assertEqual(tables[0]["rows"], [["모아", "PAID"]])
        self.assertNotIn("note", tables[0])
        self.assertEqual(tables[1]["rows"], [["모아", "PAID"], ["보라", "NULL"], ["소라", "NULL"]])
        self.assertIn("ORDER BY", tables[1]["note"])
        ordered = self.build()["backend-01-q11"]["resultTables"]
        self.assertTrue(all("note" not in t for t in ordered))

    def test_an_empty_result_is_a_table_without_rows(self):
        table = self.build()["backend-01-q15"]["resultTables"][0]
        self.assertEqual((table["rows"], table["columns"]), ([], ["id"]))

    def test_a_row_with_the_wrong_number_of_cells_is_refused(self):
        _, step = self.step("backend-01-q13", 1)
        step["expect"]["rows"][0] = ["모아"]
        with self.assertRaises(build_data.ContentError):
            self.build()

    def test_a_table_needs_a_title_and_column_names(self):
        _, step = self.step("backend-01-q13", 1)
        step["show"]["title"] = " "
        with self.assertRaises(build_data.ContentError):
            self.build()
        step["show"]["title"] = "쿼리 B"
        step["show"]["columns"] = []
        with self.assertRaises(build_data.ContentError):
            self.build()

    def test_a_table_for_a_step_without_rows_is_refused(self):
        check, step = self.step("backend-01-q16", 0)
        step["show"] = {"title": "오류", "columns": ["a"]}
        with self.assertRaises(build_data.ContentError):
            self.build()

    def test_a_check_for_another_revision_is_refused(self):
        check, _ = self.step("backend-01-q13", 1)
        check["revision"] = 2
        with self.assertRaises(build_data.ContentError):
            self.build()

    def test_questions_without_show_steps_have_no_result_tables(self):
        built = self.build()
        self.assertNotIn("resultTables", built["backend-01-q10"])
        self.assertNotIn("resultTables", built["backend-01-q01"])

if __name__ == "__main__":
    unittest.main()
