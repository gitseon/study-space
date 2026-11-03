import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

import validate_questions as vq

NOTES = {"db-concepts": "# DB\n\n## Part 1. 기본\n\n## Part 2. 조회\n\n## Part 2. 조회\n",
         "sqld-concepts": "# SQLD\n\n## Part 1. 모델\n"}
TOPICS = {"model": "모델", "sql": "SQL"}

def issues(links):
    return [i["code"] for i in vq.validate_study_links(links, TOPICS, NOTES)]

class StudyLinkTests(unittest.TestCase):
    def test_valid_links_pass_and_may_point_at_another_tracks_note(self):
        self.assertEqual(issues({"model": [{"noteId": "sqld-concepts", "section": "Part 1. 모델"}],
                                 "sql": [{"noteId": "db-concepts", "section": "Part 1. 기본"}]}), [])

    def test_unknown_group_note_or_section_fails(self):
        self.assertIn("study-group", issues({"nope": [{"noteId": "db-concepts", "section": "Part 1. 기본"}]}))
        self.assertIn("study-note", issues({"sql": [{"noteId": "ghost", "section": "Part 1. 기본"}]}))
        self.assertIn("study-section", issues({"sql": [{"noteId": "db-concepts", "section": "Part 9. 없음"}]}))

    def test_a_duplicated_heading_is_ambiguous_and_fails(self):
        self.assertIn("study-section", issues({"sql": [{"noteId": "db-concepts", "section": "Part 2. 조회"}]}))

    def test_a_malformed_entry_fails(self):
        self.assertIn("study-entry", issues({"sql": [{"noteId": "db-concepts"}]}))
        self.assertIn("study-entry", issues({"sql": "Part 1"}))

    def test_published_links_are_valid(self):
        import build_data
        notes = vq.all_note_texts(ROOT / "source")
        for track in build_data.TRACKS:
            scope = build_data.load_scope(ROOT / "source", track)
            self.assertEqual(vq.validate_study_links(scope.get("studyLinks", {}), scope["topics"], notes), [], track)

    def test_backend_links_cover_every_group_with_a_note_section(self):
        import build_data
        scope = build_data.load_scope(ROOT / "source", "backend")
        self.assertEqual(set(scope["studyLinks"]), set(scope["topics"]))
        self.assertTrue(all(scope["studyLinks"][g] for g in scope["topics"]))

if __name__ == "__main__":
    unittest.main()
