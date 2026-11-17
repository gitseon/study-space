import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

import validate_projects as vp
import verify_spring_projects as vsp

XML = '<testsuite name="{name}" tests="{tests}" failures="{failures}" errors="{errors}" skipped="{skipped}"></testsuite>'


def write_report(folder, name, tests=3, failures=0, errors=0, skipped=0):
    (Path(folder) / f"TEST-{name}.xml").write_text(XML.format(name=name, tests=tests, failures=failures, errors=errors, skipped=skipped), encoding="utf-8")


class SurefireTests(unittest.TestCase):
    def test_reports_are_grouped_by_the_simple_class_name(self):
        with tempfile.TemporaryDirectory() as tmp:
            write_report(tmp, "com.study.room.UnitTests", tests=7)
            write_report(tmp, "com.study.room.DbTests", tests=8, failures=1)
            summary = vsp.parse_surefire(Path(tmp))
        self.assertEqual(summary["UnitTests"], {"tests": 7, "failed": 0, "skipped": 0})
        self.assertEqual(summary["DbTests"], {"tests": 8, "failed": 1, "skipped": 0})

    def test_errors_and_skips_both_count_against_a_step(self):
        with tempfile.TemporaryDirectory() as tmp:
            write_report(tmp, "a.HttpTests", tests=4, errors=1)
            write_report(tmp, "a.JspTests", tests=4, skipped=1)
            summary = vsp.parse_surefire(Path(tmp))
        steps = vsp.step_results(True, summary, has_jsp=True)
        self.assertEqual(steps["httpIntegration"]["status"], "failed")
        self.assertEqual(steps["jspRender"]["status"], "failed")


class StepTests(unittest.TestCase):
    ALL = {"UnitTests": {"tests": 7, "failed": 0, "skipped": 0}, "DbTests": {"tests": 8, "failed": 0, "skipped": 0},
           "HttpTests": {"tests": 9, "failed": 0, "skipped": 0}, "JspTests": {"tests": 9, "failed": 0, "skipped": 0}}

    def test_every_category_passes_when_all_its_tests_pass(self):
        steps = vsp.step_results(True, self.ALL, has_jsp=True)
        self.assertEqual({k: v["status"] for k, v in steps.items()}, {"compile": "passed", "unit": "passed", "dbIntegration": "passed", "httpIntegration": "passed", "jspRender": "passed"})
        self.assertIn("8", steps["dbIntegration"]["note"])

    def test_a_failed_compile_fails_the_compile_step_and_leaves_the_rest_unverified(self):
        steps = vsp.step_results(False, {}, has_jsp=True)
        self.assertEqual(steps["compile"]["status"], "failed")
        self.assertTrue(all(steps[k]["status"] == "unverified" for k in ("unit", "dbIntegration", "httpIntegration", "jspRender")))

    def test_a_category_without_any_test_is_not_a_pass(self):
        partial = {k: v for k, v in self.ALL.items() if k != "DbTests"}
        steps = vsp.step_results(True, partial, has_jsp=True)
        self.assertEqual(steps["dbIntegration"]["status"], "unverified")

    def test_a_project_without_jsp_files_is_not_applicable_for_the_jsp_step(self):
        steps = vsp.step_results(True, {k: v for k, v in self.ALL.items() if k != "JspTests"}, has_jsp=False)
        self.assertEqual(steps["jspRender"]["status"], "not-applicable")


class ReviewTests(unittest.TestCase):
    def review(self):
        return {"projectId": "spring-web-01", "referenceHash": "r" * 64,
                "verification": {"steps": {name: {"status": "unverified", "note": ""} for name in vp.VERIFY_STEPS}, "verifiedReferenceHash": None,
                                 "environmentHash": None, "verifiedAt": None, "reviewer": None}}

    def test_results_are_recorded_with_the_current_reference_and_environment(self):
        steps = vsp.step_results(True, StepTests.ALL, has_jsp=True)
        updated = vsp.apply_results(self.review(), steps, "r" * 64, "e" * 16, "2026-11-17")
        verification = updated["verification"]
        self.assertEqual((verification["verifiedReferenceHash"], verification["environmentHash"], verification["verifiedAt"]), ("r" * 64, "e" * 16, "2026-11-17"))
        self.assertEqual(verification["steps"]["unit"]["status"], "passed")
        self.assertEqual(vp.release_issues("spring-web-01", updated, "r" * 64, "e" * 16, True), [])

    def test_the_manual_sts_step_is_never_touched(self):
        review = self.review()
        review["verification"]["steps"]["stsManual"] = {"status": "passed", "note": "사용자가 확인"}
        updated = vsp.apply_results(review, vsp.step_results(True, StepTests.ALL, has_jsp=True), "r" * 64, "e" * 16, "2026-11-17")
        self.assertEqual(updated["verification"]["steps"]["stsManual"], {"status": "passed", "note": "사용자가 확인"})

    def test_the_input_review_is_not_modified(self):
        review = self.review()
        before = json.dumps(review, sort_keys=True)
        vsp.apply_results(review, vsp.step_results(True, StepTests.ALL, has_jsp=True), "r" * 64, "e" * 16, "2026-11-17")
        self.assertEqual(json.dumps(review, sort_keys=True), before)

    def test_a_failed_run_never_satisfies_the_release_gate(self):
        steps = vsp.step_results(True, {**StepTests.ALL, "DbTests": {"tests": 8, "failed": 2, "skipped": 0}}, has_jsp=True)
        updated = vsp.apply_results(self.review(), steps, "r" * 64, "e" * 16, "2026-11-17")
        self.assertTrue(vp.release_issues("spring-web-01", updated, "r" * 64, "e" * 16, True))


class WorkspaceTests(unittest.TestCase):
    def test_the_reference_and_the_check_sources_are_combined_in_a_temp_project(self):
        with tempfile.TemporaryDirectory() as tmp:
            work = Path(tmp) / "work"
            vsp.prepare_workspace("spring-web-01", work)
            self.assertTrue((work / "pom.xml").is_file())
            self.assertTrue((work / "src/main/java/com/study/room/web/ReservationController.java").is_file())
            self.assertTrue((work / "src/test/java/study/projectcheck/Observations.java").is_file())
            self.assertTrue((work / "src/test/java/com/study/room/JspTests.java").is_file())
            self.assertNotIn("study-target", (work / "src/main/java/com/study/room/web/ReservationController.java").read_text(encoding="utf-8"))

    def test_a_template_workspace_has_the_starter_files_and_the_stage_template_but_no_reference_code(self):
        with tempfile.TemporaryDirectory() as tmp:
            work = Path(tmp) / "work"
            vsp.prepare_template_workspace("spring-web-01", 3, work)
            controller = (work / "src/main/java/com/study/room/web/ReservationController.java").read_text(encoding="utf-8")
            self.assertIn("study-target:ctrl-list:start", controller)
            self.assertNotIn("model.addAttribute(\"reservations\"", controller)
            self.assertTrue((work / "src/main/resources/application.properties").is_file())
            self.assertTrue((work / "src/test/java/com/study/room/UnitTests.java").is_file())

    def test_the_database_settings_are_required_and_passed_on_under_the_project_names(self):
        with self.assertRaises(SystemExit):
            vsp.runtime_env({})
        env = vsp.runtime_env({"SPRING_VERIFY_DB_URL": "u", "SPRING_VERIFY_DB_USER": "n", "SPRING_VERIFY_DB_PASSWORD": "p", "PATH": "x"})
        self.assertEqual((env["DB_URL"], env["DB_USER"], env["DB_PASSWORD"]), ("u", "n", "p"))

    def test_unknown_projects_are_rejected(self):
        with self.assertRaises(SystemExit):
            vsp.main(["--project", "no-such-project"])


if __name__ == "__main__":
    unittest.main()
