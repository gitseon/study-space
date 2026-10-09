import importlib.util
import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

class PipelineTests(unittest.TestCase):
    def load(self, name):
        self.assertTrue((ROOT / "scripts" / f"{name}.py").exists(), f"{name} not implemented")
        return __import__(name)

    def fixture(self, path):
        (path / "exam.json").write_text(json.dumps({"id":"demo","title":"테스트","kind":"subject","revision":1}), encoding="utf-8")
        blocks, answers = [], []
        for kind in ["mc","short","essay","code"]:
            meta = {"type":kind,"title":kind,"revision":1,"topics":["queue"],"group":"structures","difficulty":1,"sourceRefs":["scope"]}
            if kind == "mc":
                meta["correctChoiceId"] = "b"
            if kind == "short":
                meta.update(acceptedAnswers=["peek"],normalization="trim")
            if kind in ("essay","code"):
                meta.update(rubric=[{"id":"r","criterion":"근거","points":1}], modelAnswer="모범답안")
            if kind == "code":
                meta.update(language="java",constraints="1 ≤ N ≤ 10",examples=[{"input":"1","output":"1"}],reviewCases=[{"input":"2","output":"2"}],complexity="O(N)")
            choices = "\n".join(f"### choice: {c}\n선택 {c}" for c in "abcd") if kind == "mc" else ""
            blocks.append(f'## question: {kind}\n\x60\x60\x60json\n{json.dumps(meta)}\n\x60\x60\x60\n### stem\n문제\n\x60\x60\x60java\n## question: in-code\n\x60\x60\x60\n{choices}')
            extra = "\n".join(f"### choice-explanation: {c}\n이유 {c}" for c in "abcd") if kind == "mc" else ""
            answers.append(f"## question: {kind}\n### solution\n근거\n{extra}")
        (path/"questions.md").write_text("\n".join(blocks),encoding="utf-8")
        (path/"solutions.md").write_text("\n".join(answers),encoding="utf-8")

    def test_parse_four_types_and_fenced_heading(self):
        m=self.load("build_data")
        with tempfile.TemporaryDirectory() as tmp:
            p=Path(tmp); self.fixture(p); exam=m.parse_exam(p)
            self.assertEqual({q["type"] for q in exam["questions"]},{"mc","short","essay","code"})
            self.assertIn("## question: in-code",exam["questions"][0]["stem"])
            self.assertEqual(exam["questions"][0]["correctChoiceId"],"b")

    def test_duplicate_and_missing_solution_are_rejected(self):
        m=self.load("build_data")
        with tempfile.TemporaryDirectory() as tmp:
            p=Path(tmp); self.fixture(p)
            with (p/"questions.md").open("a",encoding="utf-8") as f: f.write("\n## question: mc\n")
            with self.assertRaises(m.ContentError): m.parse_exam(p)
            self.fixture(p); (p/"solutions.md").write_text("",encoding="utf-8")
            with self.assertRaises(m.ContentError): m.parse_exam(p)

    def test_pattern_and_distribution_failures(self):
        m=self.load("audit_bias")
        for values in [[0,0,0],[0,1,0,1,0,1],[0,1,2,0,1,2],[0,1,2,3,0,1,2,3]]:
            self.assertFalse(m.valid_sequence(values))
        self.assertTrue(m.valid_sequence([0,0,1,2,3,1]))
        self.assertFalse(m.valid_sequence([0]*8+[1]*5+[2]*4+[3]*4))

    def test_ties_and_small_samples(self):
        m=self.load("audit_bias")
        q={"id":"q","revision":1,"choices":[{"id":c,"text":"같은 길이"} for c in "abcd"],"correctChoiceId":"a"}
        self.assertEqual(m.length_metrics(q)["longestWeight"],0.25)
        q["choices"][0]["text"]="훨씬 더 길어진 선택지"
        self.assertEqual(m.length_metrics(q)["longestWeight"],1)
        self.assertEqual(m.aggregate_metrics([q]*19)["sampleStatus"],"small")

    def test_text_quality_preserves_code_and_flags_broken_prose(self):
        m=self.load("validate_questions")
        self.assertTrue(m.text_issues("글자\ufffd 손상"))
        self.assertTrue(m.text_issues("큐 · 스택 · 힙 · 트리"))
        self.assertFalse(m.text_issues("\x60\x60\x60java\nint[] a = {1,2,3,4,5};\n\x60\x60\x60"))

    def test_frontend_snippets_need_two_space_indent_and_short_lines(self):
        m=self.load("validate_questions")
        fence="\x60\x60\x60"
        def block(lang,body): return f"{fence}{lang}\n{body}\n{fence}"
        self.assertEqual(m.frontend_code_issues(block("js","if (a) {\n  run();\n}")),[])
        self.assertIn("indent",m.frontend_code_issues(block("js","if (a) {\n   run();\n}")))
        self.assertIn("indent",m.frontend_code_issues(block("js","if (a) {\n\trun();\n}")))
        self.assertIn("line-length",m.frontend_code_issues(block("css","a"*(m.MAX_FRONTEND_LINE+1))))
        self.assertEqual(m.frontend_code_issues(block("java","a"*80)),[])

    def audit_exam(self,exam_id,position,track=None,topic="same"):
        q={"id":exam_id+"-q1","revision":1,"type":"mc","topics":[topic],"correctChoiceId":"abcd"[position],
           "choices":[{"id":c,"text":"선택지 "+c} for c in "abcd"]}
        exam={"id":exam_id,"kind":"subject","questions":[q]}
        if track: exam["track"]=track
        return exam

    def test_topic_practice_sequence_is_audited(self):
        m=self.load("audit_bias")
        report=m.audit_bias([self.audit_exam(f"e{i}",1) for i in (1,2,3)],[])
        self.assertIn("topic-sequence",[i["code"] for i in report["issues"] if i["severity"]=="error"])
        report=m.audit_bias([self.audit_exam("e1",1),self.audit_exam("e2",2),self.audit_exam("e3",1)],[])
        self.assertNotIn("topic-sequence",[i["code"] for i in report["issues"]])

    def test_tracks_are_audited_separately(self):
        m=self.load("audit_bias")
        report=m.audit_bias([self.audit_exam("a",0),self.audit_exam("f",1,"frontend")],[])
        self.assertIn("bank",report["metrics"])
        self.assertIn("bank:frontend",report["metrics"])
        self.assertEqual(report["metrics"]["bank"]["n"],1)
        self.assertEqual(report["metrics"]["bank:frontend"]["n"],1)

if __name__ == "__main__":
    unittest.main()
