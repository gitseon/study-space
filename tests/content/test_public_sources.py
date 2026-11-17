import hashlib
import io
import json
import sys
import tempfile
import unittest
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

import check_public_sources as cps

PROVENANCE = {"version": 1, "idPrefixes": ["SPR-"], "checkedDirs": ["Spring"], "sources": [
    {"id": "SPR-L02", "description": "의존성 주입", "pages": 35, "allowedSections": ["의존성 주입", "빈 생명주기"]}]}
NOTE_IDS = {"spring-concepts"}


def codes(findings):
    return sorted({f["code"] for f in findings})


class SourceRefTests(unittest.TestCase):
    def check(self, ref):
        return cps.source_ref_issue(ref, PROVENANCE, NOTE_IDS)

    def test_registered_id_with_allowed_section_and_page_passes(self):
        self.assertIsNone(self.check("SPR-L02 의존성 주입 p.12"))
        self.assertIsNone(self.check("SPR-L02 빈 생명주기 p.30-33"))

    def test_public_note_and_official_url_pass(self):
        self.assertIsNone(self.check("spring-concepts Part 3"))
        self.assertIsNone(self.check("https://docs.spring.io/spring-framework/reference/core/beans.html"))

    def test_unregistered_id_fails(self):
        self.assertEqual(self.check("SPR-L99 의존성 주입 p.3"), "source-unregistered")

    def test_section_outside_the_allowed_list_fails(self):
        self.assertEqual(self.check("SPR-L02 트랜잭션 p.3"), "source-section")

    def test_missing_or_out_of_range_page_fails(self):
        self.assertEqual(self.check("SPR-L02 의존성 주입"), "source-format")
        self.assertEqual(self.check("SPR-L02 의존성 주입 p.36"), "source-page")
        self.assertEqual(self.check("SPR-L02 의존성 주입 p.9-4"), "source-page")

    def test_file_names_and_unknown_notes_fail(self):
        self.assertEqual(self.check("강의자료_02.pdf 3쪽"), "source-format")
        self.assertEqual(self.check("other-concepts Part 1"), "source-format")
        self.assertEqual(self.check("http://example.com/a"), "source-format")


class TextScanTests(unittest.TestCase):
    def test_absolute_local_paths_fail(self):
        for text in ("see C:\\Users\\someone\\notes.md", "at C:/Users/someone/x", "/home/someone/x.md", "/Users/someone/x"):
            self.assertEqual(codes(cps.scan_text("a.md", text)), ["absolute-path"], text)

    def test_links_into_private_or_original_images_fail(self):
        self.assertEqual(codes(cps.scan_text("a.md", "[표](../private/spring/SPR-L01.json)")), ["private-link"])
        self.assertEqual(codes(cps.scan_text("a.md", "![슬라이드](private/spring/samples/p1.png)")), ["private-link"])
        self.assertEqual(codes(cps.scan_text("a.json", json.dumps({"sourceRefs": ["private/spring/x.json"]}))), ["private-link"])

    def test_prose_that_only_mentions_the_private_folder_passes(self):
        self.assertEqual(cps.scan_text("a.md", "대응표는 `private/spring/`에만 둔다. private/ 폴더는 Git 제외다."), [])
        self.assertEqual(cps.scan_text("a.md", "[공식 문서](https://docs.spring.io/x) 와 [노트](../source/Spring/note.md)"), [])

    def test_findings_never_repeat_the_matched_value(self):
        finding = cps.scan_text("a.md", "C:\\Users\\someone\\secret-name.md")[0]
        self.assertNotIn("someone", json.dumps(finding, ensure_ascii=False))
        self.assertEqual(finding["file"], "a.md")
        self.assertEqual(finding["line"], 1)


class SettingsScanTests(unittest.TestCase):
    def test_placeholder_credentials_pass(self):
        text = "spring.datasource.password=${DB_PASSWORD}\nspring.datasource.username=${DB_USER:study}\njwt.secret=\n"
        self.assertEqual(cps.scan_settings("application.properties", text), [])

    def test_literal_credentials_fail_without_echoing_the_value(self):
        findings = cps.scan_settings("application.properties", "spring.datasource.password=hunter22\n")
        self.assertEqual(codes(findings), ["literal-secret"])
        self.assertNotIn("hunter22", json.dumps(findings))


class PublicCheckTests(unittest.TestCase):
    def make(self, tmp, ref="SPR-L02 의존성 주입 p.12", extra=None):
        root = Path(tmp)
        (root / "source" / "Spring" / "spring-01").mkdir(parents=True)
        (root / "source" / "provenance.json").write_text(json.dumps(PROVENANCE, ensure_ascii=False), encoding="utf-8")
        (root / "source" / "Spring" / "spring-01" / "exam.json").write_text(json.dumps({"id": "spring-01", "track": "spring"}), encoding="utf-8")
        meta = json.dumps({"sourceRefs": [ref]}, ensure_ascii=False, indent=2)
        (root / "source" / "Spring" / "spring-01" / "questions.md").write_text(f"## question: spring-01-q01\n```json\n{meta}\n```\n### stem\n질문\n", encoding="utf-8")
        for rel, content in (extra or {}).items():
            path = root / rel
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(content if isinstance(content, bytes) else content.encode("utf-8"))
        return root

    def test_clean_tree_passes(self):
        with tempfile.TemporaryDirectory() as tmp:
            self.assertEqual(cps.check_public(self.make(tmp), NOTE_IDS), [])

    def test_unregistered_question_source_fails_with_the_question_id(self):
        with tempfile.TemporaryDirectory() as tmp:
            findings = cps.check_public(self.make(tmp, ref="SPR-X01 뭔가 p.1"), NOTE_IDS)
            self.assertEqual(codes(findings), ["source-unregistered"])
            self.assertEqual(findings[0]["item"], "spring-01-q01")

    def test_generated_data_reports_and_zip_entries_are_scanned(self):
        buffer = io.BytesIO()
        with zipfile.ZipFile(buffer, "w") as archive:
            archive.writestr("app/src/main/resources/application.properties", "spring.datasource.password=realpass1\n")
        extra = {"data/x.json": json.dumps({"note": "C:\\Users\\someone\\a"}), "reports/r.json": json.dumps({"path": "/home/someone/a"}),
                 "data/spring-projects/p/stage-1.zip": buffer.getvalue()}
        with tempfile.TemporaryDirectory() as tmp:
            findings = cps.check_public(self.make(tmp, extra=extra), NOTE_IDS)
            self.assertEqual(codes(findings), ["absolute-path", "literal-secret"])
            self.assertIn("data/spring-projects/p/stage-1.zip!app/src/main/resources/application.properties", {f["file"] for f in findings})

    def test_forbidden_original_files_in_public_output_fail(self):
        with tempfile.TemporaryDirectory() as tmp:
            findings = cps.check_public(self.make(tmp, extra={"data/lecture.pdf": b"%PDF"}), NOTE_IDS)
            self.assertEqual(codes(findings), ["forbidden-file"])

    def test_cli_returns_zero_or_one(self):
        with tempfile.TemporaryDirectory() as tmp:
            self.assertEqual(cps.main(["--public-only", "--root", str(self.make(tmp))], note_ids=NOTE_IDS, out=io.StringIO()), 0)
        with tempfile.TemporaryDirectory() as tmp:
            self.assertEqual(cps.main(["--public-only", "--root", str(self.make(tmp, ref="x.pdf"))], note_ids=NOTE_IDS, out=io.StringIO()), 1)


class PrivateIndexTests(unittest.TestCase):
    def make(self, tmp, public_text="직접 쓴 설명", digest=None, index_id="SPR-L02"):
        root = Path(tmp)
        (root / "source").mkdir()
        (root / "source" / "provenance.json").write_text(json.dumps(PROVENANCE, ensure_ascii=False), encoding="utf-8")
        original = root / "originals" / "비밀강의 둘째날.pdf"
        original.parent.mkdir()
        original.write_bytes(b"original")
        (root / "docs").mkdir()
        (root / "docs" / "plan.md").write_text(public_text, encoding="utf-8")
        index = root / "private" / "index.json"
        index.parent.mkdir()
        index.write_text(json.dumps({"sources": [{"id": index_id, "path": "originals/비밀강의 둘째날.pdf",
                                                  "sha256": digest or hashlib.sha256(b"original").hexdigest(), "pages": 35}]}, ensure_ascii=False), encoding="utf-8")
        return root, index

    def test_matching_index_passes(self):
        with tempfile.TemporaryDirectory() as tmp:
            root, index = self.make(tmp)
            self.assertEqual(cps.check_private_index(root, index, ["docs/plan.md"]), [])

    def test_hash_mismatch_and_unregistered_index_id_fail(self):
        with tempfile.TemporaryDirectory() as tmp:
            root, index = self.make(tmp, digest="0" * 64)
            self.assertEqual(codes(cps.check_private_index(root, index, ["docs/plan.md"])), ["index-hash"])
        with tempfile.TemporaryDirectory() as tmp:
            root, index = self.make(tmp, index_id="SPR-L77")
            self.assertEqual(codes(cps.check_private_index(root, index, ["docs/plan.md"])), ["index-unregistered"])

    def test_original_name_leak_is_reported_without_the_name(self):
        with tempfile.TemporaryDirectory() as tmp:
            root, index = self.make(tmp, public_text="출처: 비밀강의 둘째날 3쪽")
            findings = cps.check_private_index(root, index, ["docs/plan.md"])
            self.assertEqual(codes(findings), ["original-name"])
            self.assertEqual(findings[0]["item"], "SPR-L02")
            self.assertNotIn("비밀강의", json.dumps(findings, ensure_ascii=False))


class RepositoryTests(unittest.TestCase):
    def test_repository_provenance_registers_the_22_spring_sources(self):
        provenance = cps.load_provenance(ROOT / "source" / "provenance.json")
        ids = [s["id"] for s in provenance["sources"]]
        self.assertEqual(ids, [f"SPR-L{n:02d}" for n in range(1, 12)] + [f"SPR-S{n:02d}" for n in range(1, 12)])
        self.assertEqual(sum(s["pages"] for s in provenance["sources"]), 1078)
        for source in provenance["sources"]:
            self.assertEqual(set(source), {"id", "description", "pages", "allowedSections"})
            self.assertTrue(source["allowedSections"])

    def test_repository_passes_the_public_check(self):
        # reports/ is local scratch whose content depends on the last run (a failed verifier writes tracebacks with local paths).
        # The CLI scans it after the verifiers ran; this test checks what the repository itself publishes.
        self.assertEqual(cps.check_public(ROOT, output_dirs=("data", "dist")), [])


if __name__ == "__main__":
    unittest.main()
