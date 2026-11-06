import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))

import author_backend_projects as ab  # noqa: E402

JAVA = """class A {
    //@@target t-one
    int a() { return 1; }
    //@@stage 1
    int a() { return ____; }
    //@@stage 2
    int a() { return 0; }
    //@@stage 3
    // write a
    //@@end
}
"""

JSP = """<p>
    <%--@@target jsp-one--%>
    <c:out value="x" />
    <%--@@stage 1--%>
    <c:out value="____" />
    <%--@@stage 2--%>
    <%-- TODO --%>
    <%--@@stage 3--%>
    <%-- write --%>
    <%--@@end--%>
</p>
"""


class ExpandTests(unittest.TestCase):
    def test_reference_has_no_markers_or_directives(self):
        out, targets = ab.expand_file("A.java", JAVA, "reference")
        self.assertIn("return 1;", out)
        self.assertNotIn("@@", out)
        self.assertNotIn("study-target", out)
        self.assertEqual(targets, ["t-one"])

    def test_stage_wraps_region_with_language_comment_markers(self):
        out, _ = ab.expand_file("A.java", JAVA, "1")
        self.assertIn("    // study-target:t-one:start\n    int a() { return ____; }\n    // study-target:t-one:end\n", out)
        self.assertNotIn("return 1;", out)

    def test_jsp_markers_use_jsp_comment(self):
        out, _ = ab.expand_file("x.jsp", JSP, "3")
        self.assertIn("    <%-- study-target:jsp-one:start --%>\n    <%-- write --%>\n    <%-- study-target:jsp-one:end --%>\n", out)

    def test_unclosed_region_is_rejected(self):
        with self.assertRaises(ab.AuthoringError):
            ab.expand_file("A.java", "//@@target t\nint a;\n", "1")

    def test_missing_stage_is_rejected(self):
        bad = "//@@target t\nx\n//@@stage 1\ny\n//@@end\n"
        with self.assertRaises(ab.AuthoringError):
            ab.expand_file("A.java", bad, "2")

    def test_duplicate_target_in_file_is_rejected(self):
        bad = JAVA + JAVA
        with self.assertRaises(ab.AuthoringError):
            ab.expand_file("A.java", bad, "1")


class DomainTests(unittest.TestCase):
    def test_particles_follow_the_replaced_word(self):
        dom = ab.DOMAINS["web-02"]
        self.assertEqual(ab.apply_domain("등록된 용품이 없습니다. 색상을 고릅니다.", dom), "등록된 도서가 없습니다. 분류를 고릅니다.")

    def test_identifiers_are_renamed(self):
        dom = ab.DOMAINS["web-02"]
        text = ab.apply_domain("GearController gear.getBrand() ssafy_gear color", dom)
        self.assertEqual(text, "BookController book.getAuthor() ssafy_book category")

    def test_file_paths_are_renamed(self):
        dom = ab.DOMAINS["web-02"]
        self.assertEqual(ab.apply_domain("src/main/webapp/gear/list.jsp", dom), "src/main/webapp/book/list.jsp")


class GeneratedTreeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.trees = ab.generate_all()

    def test_both_projects_are_generated(self):
        self.assertEqual(sorted(self.trees), ["web-01", "web-02"])

    def test_reference_is_clean_and_complete(self):
        for pid, tree in self.trees.items():
            ref = {p: t for p, t in tree.items() if p.startswith("reference/")}
            self.assertTrue(ref, pid)
            for path, text in ref.items():
                self.assertNotIn("study-target", text, f"{pid}:{path}")
                self.assertNotIn("@@", text, f"{pid}:{path}")

    def test_every_target_is_present_in_every_stage(self):
        for pid, tree in self.trees.items():
            ids = [t["id"] for t in ab.load_targets()]
            for stage in ("1", "2", "3"):
                joined = "\n".join(t for p, t in tree.items() if p.startswith(f"stages/{stage}/"))
                for target_id in ids:
                    self.assertIn(f"study-target:{target_id}:start", joined, f"{pid} stage {stage} {target_id}")
                    self.assertIn(f"study-target:{target_id}:end", joined, f"{pid} stage {stage} {target_id}")

    def test_starter_has_only_provided_files(self):
        for pid, tree in self.trees.items():
            for path, text in tree.items():
                if path.startswith("starter/"):
                    self.assertNotIn("study-target", text, f"{pid}:{path}")
                    self.assertNotIn(f"stages/{path[8:]}", tree)

    def test_book_project_has_no_gear_words(self):
        for path, text in self.trees["web-02"].items():
            if path == "review.json":
                continue
            self.assertNotRegex(text, r"(?i)gear|brand|용품|캠핑", path)

    def test_stage_one_has_blanks_stage_two_and_three_do_not_leak_reference(self):
        tree = self.trees["web-01"]
        self.assertIn("____", tree["stages/1/src/main/java/com/ssafy/sample/controller/GearController.java"])
        for stage in ("2", "3"):
            text = tree[f"stages/{stage}/src/main/java/com/ssafy/sample/model/dao/GearDaoImpl.java"]
            self.assertNotIn("executeUpdate", text)

    def test_generated_files_on_disk_are_up_to_date(self):
        self.assertEqual(ab.check_all(self.trees), [])

    def test_project_json_targets_match_regions(self):
        import json
        for pid, tree in self.trees.items():
            project = json.loads(tree["project.json"])
            self.assertEqual(len(project["targets"]), len(ab.load_targets()))
            for target in project["targets"]:
                self.assertIn(target["path"], [f["path"] for f in project["files"]])


if __name__ == "__main__":
    unittest.main()
