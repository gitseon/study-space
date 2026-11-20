import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

import build_data
import validate_questions as vq

NOTES = {"spring-concepts": "# Spring\n\n## Part 3. DI와 빈\n\n## Part 13. 심화\n"}


def exam(track, *ids):
    return {"id": track + "-01", "track": track, "kind": "subject", "questions": [{"id": i} for i in ids]}


def coverage(questions=("s-q1",), **extra):
    return {"coverageProfile": "pilot", "requirements": [{
        "requirementId": "S01", "noteId": "spring-concepts", "section": "Part 3. DI와 빈",
        "keywords": [{"id": "constructor", "questionIds": list(questions)}], "questionIds": list(questions), **extra}]}


def codes(cov, exams, track="spring"):
    return [i["code"] for i in vq.validate_coverage(cov, exams, NOTES, track=track)]


class TrackCoverageTests(unittest.TestCase):
    def test_spring_requirement_with_a_spring_question_passes(self):
        self.assertEqual(codes(coverage(), [exam("spring", "s-q1")]), [])

    def test_backend_question_in_spring_coverage_is_rejected(self):
        self.assertIn("coverage-track", codes(coverage(("b-q1",)), [exam("spring", "s-q1"), exam("backend", "b-q1")]))

    def test_exams_of_other_tracks_do_not_make_spring_links_mandatory(self):
        self.assertEqual(codes(coverage(()), [exam("backend", "b-q1")]), [])

    def test_note_only_requirement_needs_no_question_and_may_not_list_one(self):
        cov = coverage((), noteOnly=True)
        cov["requirements"][0]["section"] = "Part 13. 심화"
        self.assertEqual(codes(cov, [exam("spring", "s-q1")]), [])
        self.assertIn("coverage-note-only", codes(coverage(("s-q1",), noteOnly=True), [exam("spring", "s-q1")]))

    def test_project_targets_are_kept_apart_from_question_ids(self):
        cov = coverage(("spring-web-01",))
        self.assertIn("coverage-unknown", codes(cov, [exam("spring", "s-q1")]))
        self.assertEqual(codes(coverage(projectTargets=["spring-web-01/controller-list"]), [exam("spring", "s-q1")]), [])

    def test_note_texts_follow_the_track(self):
        self.assertEqual(vq.note_texts_for_track(ROOT / "source", "backend"), vq.backend_note_texts(ROOT / "source"))
        self.assertEqual(set(vq.note_texts_for_track(ROOT / "source", "backend")), {"backend-concepts", "db-concepts"})
        self.assertEqual(set(vq.note_texts_for_track(ROOT / "source", "sqld")), {"sqld-concepts"})


if __name__ == "__main__":
    unittest.main()


GROUPS = {"foundation-boot": (2, 1), "di-bean": (3, 1), "aop-proxy": (2, 1), "mvc-binding": (3, 1), "web-crosscut": (1, 1),
          "mybatis": (3, 1), "service-tx": (2, 1), "rest-api": (2, 1), "security": (3, 1)}


class SpringTrackTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.scope = build_data.load_scope(ROOT / "source", "spring")
        cls.note = (ROOT / "source" / "Spring" / "Spring개념 요약노트.md").read_text(encoding="utf-8")

    def test_track_is_registered_with_the_existing_folder_name(self):
        info = build_data.TRACKS["spring"]
        self.assertEqual((info["label"], info["dir"], info["scope"], info["coverage"]), ("Spring", "Spring", "scope-spring.json", "coverage-spring.json"))
        names = [p.name for p in (ROOT / "source").iterdir() if p.name.lower() == "spring"]
        self.assertEqual(names, ["Spring"])
        self.assertIn(("spring-concepts", "Spring 개념", "Spring/Spring개념 요약노트.md", "spring"), build_data.NOTES)

    def test_subject_exam_is_21_9_2_with_the_planned_group_split(self):
        s = self.scope
        self.assertEqual(s["composition"]["subject"], {"mc": 21, "short": 9, "essay": 2, "code": 0})
        self.assertEqual({g: (c["mc"], c["short"]) for g, c in s["groups"].items()}, GROUPS)
        self.assertEqual(sum(c["mc"] for c in s["groups"].values()), 21)
        self.assertEqual(sum(c["short"] for c in s["groups"].values()), 9)
        self.assertEqual(set(s["topics"]), set(GROUPS))
        self.assertEqual(set(s["tags"]), set(GROUPS))
        tags = [t for group in s["tags"].values() for t in group]
        self.assertEqual(len(tags), len(set(tags)))
        self.assertEqual(s["practiceMinutes"], 60)

    def test_every_tag_can_be_asked_within_three_exams(self):
        for group, (mc, short) in GROUPS.items():
            self.assertLessEqual(len(self.scope["tags"][group]), (mc + short) * 3, group)

    def test_study_links_point_at_real_note_sections(self):
        links = self.scope["studyLinks"]
        self.assertEqual(set(links), set(GROUPS))
        self.assertEqual(vq.validate_study_links(links, self.scope["topics"], {"spring-concepts": self.note}), [])

    def test_note_has_fourteen_parts_and_passes_the_note_checks(self):
        parts = [int(n) for n in __import__("re").findall(r"(?m)^## Part (\d+)\. ", self.note)]
        self.assertEqual(parts, list(range(1, 15)))
        self.assertEqual([i for i in vq.validate_notes(ROOT / "source") if i["questionId"] == "spring-concepts"], [])

    def test_coverage_links_every_tag_to_a_note_section_and_marks_advanced_rows(self):
        coverage = json.loads((ROOT / "source" / "Spring" / "coverage-spring.json").read_text(encoding="utf-8"))
        with tempfile.TemporaryDirectory() as tmp:
            exams = build_data.build_data(ROOT / "source", Path(tmp))
        self.assertEqual(vq.validate_coverage(coverage, exams, vq.note_texts_for_track(ROOT / "source", "spring"), track="spring"), [])
        rows = coverage["requirements"]
        examined = [r for r in rows if not r.get("noteOnly")]
        self.assertEqual({k["id"] for r in examined for k in r["keywords"]}, {t for group in self.scope["tags"].values() for t in group})
        note_only = [r for r in rows if r.get("noteOnly")]
        self.assertTrue(note_only)
        self.assertTrue(all(r["section"].startswith("Part 13.") for r in note_only))
        self.assertFalse({k["id"] for r in note_only for k in r["keywords"]} & {t for group in self.scope["tags"].values() for t in group})

    def test_environment_file_records_versions_without_private_values(self):
        env = json.loads((ROOT / "source" / "Spring" / "environment-spring.json").read_text(encoding="utf-8"))
        for key in ("javaRuntime", "javaRelease", "springBoot", "springFramework", "springSecurity", "mybatis", "mybatisStarter", "mysqlServer", "mysqlDriver"):
            self.assertRegex(env["versions"][key], r"^\d+(\.\d+)*$", key)
        self.assertEqual(env["classMatch"], "unconfirmed")
        text = json.dumps(env, ensure_ascii=False)
        for forbidden in ("password", "C:\\", "/Users/", "localhost:"):
            self.assertNotIn(forbidden, text)


class SpringPublishedContentTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        cls.out = Path(cls.tmp.name)
        cls.exams = [e for e in build_data.build_data(ROOT / "source", cls.out) if build_data.track_of(e) == "spring"]
        cls.manifest = json.loads((cls.out / "manifest.json").read_text(encoding="utf-8"))

    @classmethod
    def tearDownClass(cls):
        cls.tmp.cleanup()

    def test_three_exams_follow_the_21_9_2_composition(self):
        self.assertEqual([e["id"] for e in self.exams], ["spring-01", "spring-02", "spring-03"])
        for exam in self.exams:
            self.assertEqual(exam["counts"], {"mc": 21, "short": 9, "essay": 2, "code": 0}, exam["id"])
            self.assertEqual(exam["practiceMinutes"], 60)
            self.assertFalse(exam.get("draft"))

    def test_every_question_names_only_registered_public_sources(self):
        import check_public_sources as cps
        provenance = cps.load_provenance(ROOT / "source" / "provenance.json")
        notes = {n[0] for n in build_data.NOTES if n[2]}
        for exam in self.exams:
            for q in exam["questions"]:
                for ref in q["sourceRefs"]:
                    self.assertIsNone(cps.source_ref_issue(ref, provenance, notes), (q["id"], ref))

    def test_question_ids_are_unique_and_revisions_are_positive(self):
        ids = [q["id"] for e in self.exams for q in e["questions"]]
        self.assertEqual(len(ids), 96)
        self.assertEqual(len(set(ids)), 96)
        for exam in self.exams:
            for q in exam["questions"]:
                self.assertIs(type(q["revision"]), int, q["id"])
                self.assertGreaterEqual(q["revision"], 1, q["id"])

    def test_every_question_has_a_check_or_a_resolve_record_for_its_revision(self):
        spring = ROOT / "source" / "Spring"
        checks = {c["questionId"]: c for c in json.loads((spring / "spring-checks.json").read_text(encoding="utf-8"))}
        reviews = {r["questionId"]: r for r in json.loads((spring / "spring-reviews.json").read_text(encoding="utf-8"))}
        self.assertFalse(set(checks) & set(reviews))
        for exam in self.exams:
            for q in exam["questions"]:
                record = checks.get(q["id"]) or reviews.get(q["id"])
                self.assertIsNotNone(record, q["id"])
                self.assertEqual(record["revision"], q["revision"], q["id"])
        self.assertTrue(all(r["independent"] is False for r in reviews.values()))

    def test_coverage_is_full_and_links_the_notes_to_questions_and_project_targets(self):
        coverage = json.loads((ROOT / "source" / "Spring" / "coverage-spring.json").read_text(encoding="utf-8"))
        self.assertEqual(coverage["coverageProfile"], "full")
        targets = set()
        for pid in ("spring-web-01", "spring-web-02"):
            project = json.loads((ROOT / "source" / "Spring" / "projects" / pid / "project.json").read_text(encoding="utf-8"))
            targets |= {f"{pid}/{t['id']}" for t in project["targets"]}
        linked = set()
        for row in coverage["requirements"]:
            if row.get("noteOnly"):
                self.assertNotIn("projectTargets", row)
                continue
            self.assertTrue(row["questionIds"], row["requirementId"])
            self.assertFalse(set(row["projectTargets"]) - targets, row["requirementId"])
            linked |= set(row["projectTargets"])
        self.assertEqual(linked, targets)

    def test_the_manifest_lists_the_two_projects_with_their_verification_state(self):
        entry = self.manifest["projectTracks"]["spring"]
        self.assertEqual((entry["file"], entry["count"], entry["track"]), ("spring-projects.json", 2, "spring"))
        index = json.loads((self.out / "spring-projects.json").read_text(encoding="utf-8"))
        self.assertEqual([p["id"] for p in index["projects"]], ["spring-web-01", "spring-web-02"])
        for project in index["projects"]:
            self.assertEqual(project["verification"]["label"], "자동 검증 완료 · STS 미검증")
            self.assertEqual(project["verification"]["steps"]["stsManual"], "unverified")
            self.assertNotIn("tomcat", json.dumps(project["presentation"], ensure_ascii=False).lower())
        zips = sorted(p.relative_to(self.out).as_posix() for p in (self.out / "spring-projects").rglob("*.zip"))
        self.assertEqual(len(zips), 6)
