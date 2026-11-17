import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

import verify_spring_answers as vs

CHOICES = [{"id": "a", "text": "`RoomService`만 등록된다"}, {"id": "b", "text": "둘 다 등록된다"}, {"id": "c", "text": "둘 다 등록되지 않는다"}, {"id": "d", "text": "예외가 난다"}]


def exam(*questions):
    return {"id": "spring-01", "questions": list(questions)}


def mc(qid="spring-01-q01", revision=1, correct="a"):
    return {"id": qid, "type": "mc", "revision": revision, "correctChoiceId": correct, "choices": CHOICES}


def short(qid="spring-01-q02", revision=1, accepted=("singleton",)):
    return {"id": qid, "type": "short", "revision": revision, "acceptedAnswers": list(accepted)}


def check(qid="spring-01-q01", revision=1, cases=None, **extra):
    return {"questionId": qid, "revision": revision, "cases": cases or {"scan": "true false"}, **extra}


def review(qid, revision=1):
    return {"questionId": qid, "revision": revision, "method": "resolved", "independent": False, "reviewer": "author", "reviewedAt": "2026-11-17", "note": "다시 풀어 확인"}


OBS = {"scan": "true false"}


def run(exam_, checks=(), reviews=(), obs=OBS):
    return vs.verify_exam(exam_, list(checks), list(reviews), obs)


class VerifyExamTests(unittest.TestCase):
    def test_observed_value_and_correct_choice_text_pass(self):
        results = run(exam(mc()), [check(correctChoiceContains=["RoomService"])])
        self.assertEqual([(r["questionId"], r["method"], r["passed"]) for r in results], [("spring-01-q01", "run", True)])

    def test_a_different_observation_fails(self):
        results = run(exam(mc()), [check(cases={"scan": "true true"})])
        self.assertFalse(results[0]["passed"])
        self.assertIn("scan", results[0]["detail"])

    def test_a_missing_observation_fails_instead_of_passing(self):
        results = run(exam(mc()), [check(cases={"never-ran": "x"})])
        self.assertFalse(results[0]["passed"])
        self.assertIn("never-ran", results[0]["detail"])

    def test_the_correct_choice_must_carry_the_observed_fact(self):
        self.assertFalse(run(exam(mc(correct="b")), [check(correctChoiceContains=["RoomService"])])[0]["passed"])

    def test_a_short_answer_check_needs_an_accepted_answer(self):
        ok = run(exam(short()), [check("spring-01-q02", cases={"scope": "singleton"}, acceptedContains=["singleton"])], obs={"scope": "singleton"})
        self.assertTrue(ok[0]["passed"])
        bad = run(exam(short()), [check("spring-01-q02", cases={"scope": "singleton"}, acceptedContains=["prototype"])], obs={"scope": "singleton"})
        self.assertFalse(bad[0]["passed"])

    def test_a_check_for_an_old_revision_fails(self):
        results = run(exam(mc(revision=2)), [check(revision=1, correctChoiceContains=["RoomService"])])
        self.assertFalse(results[0]["passed"])
        self.assertIn("revision", results[0]["detail"])

    def test_a_question_without_check_or_review_fails(self):
        results = run(exam(mc()))
        self.assertEqual((results[0]["method"], results[0]["passed"]), ("review", False))

    def test_a_review_for_the_current_revision_passes_and_is_not_independent(self):
        results = run(exam(mc()), reviews=[review("spring-01-q01")])
        self.assertEqual((results[0]["method"], results[0]["passed"], results[0]["independent"]), ("review", True, False))

    def test_a_review_of_an_old_revision_does_not_count(self):
        self.assertFalse(run(exam(mc(revision=2)), reviews=[review("spring-01-q01", 1)])[0]["passed"])

    def test_checks_for_unknown_questions_are_reported(self):
        results = run(exam(mc()), [check(correctChoiceContains=["RoomService"]), check("spring-01-q99")])
        self.assertTrue(any(r["questionId"] == "spring-01-q99" and not r["passed"] for r in results))

    def test_a_review_may_not_claim_independence_for_the_author(self):
        bad = {**review("spring-01-q01"), "independent": True}
        self.assertFalse(run(exam(mc()), reviews=[bad])[0]["passed"])


class EnvironmentTests(unittest.TestCase):
    RECORDED = {"javaRuntime": "25", "springBoot": "4.1.2", "springFramework": "7.0.10", "springSecurity": "7.1.2", "mybatis": "3.5.19", "mysqlServer": "8.4", "mysqlDriver": "9.7.0"}

    def test_matching_versions_pass(self):
        self.assertEqual(vs.compare_environment(self.RECORDED, dict(self.RECORDED)), [])

    def test_a_different_version_is_reported_by_name(self):
        problems = vs.compare_environment(self.RECORDED, {**self.RECORDED, "springBoot": "4.1.3"})
        self.assertEqual(len(problems), 1)
        self.assertIn("springBoot", problems[0])

    def test_a_missing_observed_version_is_reported(self):
        observed = dict(self.RECORDED)
        del observed["mybatis"]
        self.assertTrue(vs.compare_environment(self.RECORDED, observed))

    def test_the_repository_environment_file_names_every_compared_version(self):
        recorded = json.loads((ROOT / "source" / "Spring" / "environment-spring.json").read_text(encoding="utf-8"))["versions"]
        self.assertTrue(set(self.RECORDED) <= set(recorded))


class RunTests(unittest.TestCase):
    def test_reading_observations_separates_the_environment_file(self):
        with tempfile.TemporaryDirectory() as tmp:
            base = Path(tmp)
            (base / "scan.txt").write_text("true false\n", encoding="utf-8")
            (base / "environment.txt").write_text('{"springBoot": "4.1.2"}', encoding="utf-8")
            observations, environment = vs.read_observations(base)
        self.assertEqual(observations, {"scan": "true false"})
        self.assertEqual(environment, {"springBoot": "4.1.2"})

    def test_missing_database_settings_fail_instead_of_skipping(self):
        with self.assertRaises(SystemExit) as raised:
            vs.require_database_env({})
        self.assertIn("SPRING_VERIFY_DB_URL", str(raised.exception))

    def test_main_exits_one_when_there_are_no_observations(self):
        with tempfile.TemporaryDirectory() as tmp:
            self.assertEqual(vs.main(["--source-root", tmp, "--report", str(Path(tmp) / "r.json"), "--observations", str(Path(tmp) / "none")]), 1)

    def test_main_passes_with_matching_observations_and_writes_a_report(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            spring = root / "Spring"
            spring.mkdir()
            (spring / "environment-spring.json").write_text(json.dumps({"versions": EnvironmentTests.RECORDED}), encoding="utf-8")
            (spring / "spring-checks.json").write_text(json.dumps([check(correctChoiceContains=["RoomService"])]), encoding="utf-8")
            (spring / "spring-reviews.json").write_text("[]", encoding="utf-8")
            obs = root / "obs"
            obs.mkdir()
            (obs / "scan.txt").write_text("true false", encoding="utf-8")
            (obs / "environment.txt").write_text(json.dumps(EnvironmentTests.RECORDED), encoding="utf-8")
            original = vs.load_exams
            vs.load_exams = lambda source_root: [exam(mc())]
            try:
                code = vs.main(["--source-root", str(root), "--report", str(root / "report.json"), "--observations", str(obs)])
            finally:
                vs.load_exams = original
            self.assertEqual(code, 0)
            report = json.loads((root / "report.json").read_text(encoding="utf-8"))
            self.assertEqual(report["failed"], 0)
            self.assertEqual(report["environment"]["springBoot"], "4.1.2")


if __name__ == "__main__":
    unittest.main()
