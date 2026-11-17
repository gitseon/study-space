import copy
import hashlib
import json
import shutil
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

import build_backend_projects
import build_data
import build_projects
import project_catalog
import validate_backend_projects
import validate_projects

BASELINE = {
    "backend-projects.json": "sha256",
}


def tree_hashes(base):
    return {p.relative_to(base).as_posix(): hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(base.rglob("*")) if p.is_file()}


class CatalogTests(unittest.TestCase):
    def test_registry_names_roots_scope_index_and_output_for_both_tracks(self):
        backend = project_catalog.project_track("backend")
        self.assertEqual((backend["dir"], backend["scope"], backend["index"], backend["output"]), ("backend", "scope-backend.json", "backend-projects.json", "backend-projects"))
        spring = project_catalog.project_track("spring")
        self.assertEqual((spring["dir"], spring["scope"], spring["index"], spring["output"]), ("Spring", "scope-spring.json", "spring-projects.json", "spring-projects"))
        self.assertEqual(project_catalog.projects_root(ROOT / "source", "spring"), ROOT / "source" / "Spring" / "projects")

    def test_unknown_or_path_like_track_is_rejected(self):
        for bad in ("frontend", "../backend", "backend/..", "", None):
            with self.assertRaises(ValueError):
                project_catalog.project_track(bad)


class BackendCompatibilityTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        cls.out = Path(cls.tmp.name)
        build_data.build_data(ROOT / "source", cls.out)

    @classmethod
    def tearDownClass(cls):
        cls.tmp.cleanup()

    def test_wrappers_keep_their_functions_and_results(self):
        self.assertEqual(validate_backend_projects.validate_projects(ROOT / "source"), [])
        self.assertEqual([p["id"] for p in validate_backend_projects.collect(ROOT / "source")[0]],
                         [p["id"] for p in validate_projects.collect(ROOT / "source", "backend")[0]])
        self.assertIs(build_backend_projects.ProjectError, validate_projects.ProjectError)
        self.assertEqual(build_backend_projects.INDEX_FILE, "backend-projects.json")

    def test_backend_output_paths_and_bytes_match_the_committed_data(self):
        committed = tree_hashes(ROOT / "data" / "backend-projects")
        self.assertTrue(committed)
        self.assertEqual(tree_hashes(self.out / "backend-projects"), committed)
        self.assertEqual(json.loads((self.out / "backend-projects.json").read_text(encoding="utf-8")),
                         json.loads((ROOT / "data" / "backend-projects.json").read_text(encoding="utf-8")))

    def test_manifest_lists_project_tracks_and_keeps_the_old_alias(self):
        manifest = json.loads((self.out / "manifest.json").read_text(encoding="utf-8"))
        self.assertEqual(manifest["webProjects"], {"file": "backend-projects.json", "count": 2, "track": "backend"})
        self.assertEqual(manifest["projectTracks"]["backend"], manifest["webProjects"])
        for track, entry in manifest["projectTracks"].items():
            self.assertEqual(entry["track"], track)
            self.assertTrue((self.out / entry["file"]).is_file())


class BuildOutputTests(unittest.TestCase):
    def test_ide_build_output_is_not_part_of_a_project(self):
        with tempfile.TemporaryDirectory() as tmp:
            source = Path(tmp) / "source"
            shutil.copytree(ROOT / "source" / "backend", source / "backend", ignore=shutil.ignore_patterns("target", ".classpath", ".project", ".settings"))
            project = source / "backend" / "projects" / "web-01"
            before = (validate_projects.content_hash(project), validate_projects.reference_hash(project))
            for rel in ("reference/target/classes/A.class", "reference/.classpath", "reference/.settings/x.prefs", "starter/target/m2e.txt", "stages/1/.project"):
                extra = project / rel
                extra.parent.mkdir(parents=True, exist_ok=True)
                extra.write_text("C:\\Users\\someone\\workspace", encoding="utf-8")
            self.assertEqual(validate_projects.validate_projects(source, "backend"), [])
            self.assertEqual((validate_projects.content_hash(project), validate_projects.reference_hash(project)), before)

    def test_a_listed_path_may_not_live_in_a_build_output_folder(self):
        self.assertFalse(validate_projects.safe_relative_path("target/classes/A.java"))
        self.assertFalse(validate_projects.safe_relative_path(".settings/a.xml"))
        self.assertTrue(validate_projects.safe_relative_path("src/main/java/a/target/A.java"))


def review(steps, reference="r" * 64, environment="e" * 16):
    return {"projectId": "spring-web-01", "referenceHash": reference,
            "verification": {"verifiedReferenceHash": reference, "environmentHash": environment,
                             "steps": {name: {"status": status} for name, status in steps.items()}}}


PASSED = {"compile": "passed", "unit": "passed", "dbIntegration": "passed", "httpIntegration": "passed", "jspRender": "passed", "stsManual": "unverified"}


class ReleaseGateTests(unittest.TestCase):
    def issues(self, data, has_jsp=True, reference="r" * 64, environment="e" * 16):
        return validate_projects.release_issues("spring-web-01", data, reference, environment, has_jsp)

    def test_all_required_steps_passed_releases_with_sts_unverified(self):
        self.assertEqual(self.issues(review(PASSED)), [])
        self.assertEqual(validate_projects.verification_summary(review(PASSED))["label"], "자동 검증 완료 · STS 미검증")

    def test_sts_confirmed_changes_the_label_only(self):
        data = review({**PASSED, "stsManual": "passed"})
        self.assertEqual(self.issues(data), [])
        self.assertEqual(validate_projects.verification_summary(data)["label"], "자동 검증 완료 · STS 확인")

    def test_missing_failed_or_unverified_required_step_blocks(self):
        for name in ("compile", "unit", "dbIntegration", "httpIntegration", "jspRender"):
            for status in ("failed", "unverified", None):
                steps = dict(PASSED)
                if status is None:
                    del steps[name]
                else:
                    steps[name] = status
                self.assertTrue(self.issues(review(steps)), (name, status))

    def test_expired_reference_or_environment_blocks(self):
        self.assertTrue(self.issues(review(PASSED), reference="n" * 64))
        self.assertTrue(self.issues(review(PASSED), environment="n" * 16))

    def test_jsp_step_is_required_with_jsp_files_and_not_applicable_without(self):
        self.assertTrue(self.issues(review({**PASSED, "jspRender": "not-applicable"}), has_jsp=True))
        self.assertEqual(self.issues(review({**PASSED, "jspRender": "not-applicable"}), has_jsp=False), [])
        self.assertTrue(self.issues(review(PASSED), has_jsp=False))

    def test_unverified_review_is_labelled_as_such(self):
        data = review({name: "unverified" for name in PASSED})
        self.assertEqual(validate_projects.verification_summary(data)["label"], "자동 검증 전")

    def test_release_gate_does_not_apply_to_backend(self):
        self.assertEqual(validate_projects.release_issues_for_track(ROOT / "source", "backend"), [])

    def test_environment_hash_follows_the_recorded_versions(self):
        first = validate_projects.environment_hash({"versions": {"springBoot": "4.1.2"}})
        self.assertEqual(first, validate_projects.environment_hash({"versions": {"springBoot": "4.1.2"}, "note": "x"}))
        self.assertNotEqual(first, validate_projects.environment_hash({"versions": {"springBoot": "4.1.3"}}))


class CliTests(unittest.TestCase):
    def test_cli_validates_one_track_and_rejects_unknown_tracks(self):
        self.assertEqual(validate_projects.main(["--track", "backend"]), 0)
        with self.assertRaises(SystemExit):
            validate_projects.main(["--track", "nope"])


if __name__ == "__main__":
    unittest.main()
