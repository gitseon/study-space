"""Check the three graph solutions through their actual console input/output."""

import unittest

from java_runner import JavaProgram


class PrerequisiteTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.program = JavaProgram("선수과목")
        cls.addClassCleanup(cls.program.close)

    def test_chain_is_processed_regardless_of_input_order(self):
        self.assertEqual(self.program.run("3 2\n2 3\n1 2\n"), "1 2 3")

    def test_independent_subjects_and_multiple_prerequisites(self):
        input_text = "6 4\n1 2\n1 3\n2 5\n4 5\n"
        self.assertEqual(self.program.run(input_text), "1 2 2 1 3 1")

    def test_longest_prerequisite_path_determines_the_semester(self):
        # Subject 6 needs both paths 1 -> 2 -> 4 -> 6 and 3 -> 6.
        input_text = "7 6\n1 2\n2 4\n4 6\n3 6\n1 5\n5 6\n"
        self.assertEqual(self.program.run(input_text), "1 2 1 3 2 4 1")

    def test_no_prerequisites_can_all_be_taken_in_first_semester(self):
        self.assertEqual(self.program.run("4 0\n"), "1 1 1 1")

    def test_single_subject(self):
        self.assertEqual(self.program.run("1 0\n"), "1")


class DistrictPartitionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.program = JavaProgram("지역구나누기")
        cls.addClassCleanup(cls.program.close)

    def test_six_district_example(self):
        input_text = (
            "6\n5 2 3 4 1 2\n2 2 4\n4 1 3 6 5\n"
            "2 4 2\n2 1 3\n1 2\n1 2\n"
        )
        self.assertEqual(self.program.run(input_text), "1")

    def test_both_groups_must_be_connected(self):
        # The 5:5 split {1, 4}/{2, 3} disconnects the second group.
        input_text = "4\n1 2 3 4\n3 2 3 4\n1 1\n1 1\n1 1\n"
        self.assertEqual(self.program.run(input_text), "2")

    def test_three_disconnected_components_cannot_form_two_groups(self):
        self.assertEqual(self.program.run("3\n1 2 3\n0\n0\n0\n"), "-1")

    def test_two_isolated_districts_are_valid_singleton_groups(self):
        self.assertEqual(self.program.run("2\n7 2\n0\n0\n"), "5")

    def test_two_disconnected_components_can_each_form_a_group(self):
        input_text = "4\n1 2 3 4\n1 2\n1 1\n1 4\n1 3\n"
        self.assertEqual(self.program.run(input_text), "4")


class BridgeConstructionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.program = JavaProgram("다리건설")
        cls.addClassCleanup(cls.program.close)

    def test_four_island_example(self):
        input_text = (
            "7 8\n0 0 0 0 0 0 1 1\n1 1 0 0 0 0 1 1\n"
            "1 1 0 0 0 0 0 0\n1 1 0 0 0 1 1 0\n"
            "0 0 0 0 0 1 1 0\n0 0 0 0 0 0 0 0\n"
            "1 1 1 1 1 1 1 1\n"
        )
        self.assertEqual(self.program.run(input_text), "9")

    def test_length_one_is_rejected(self):
        self.assertEqual(self.program.run("1 3\n1 0 1\n"), "-1")

    def test_length_two_is_allowed(self):
        self.assertEqual(self.program.run("1 4\n1 0 0 1\n"), "2")

    def test_bridges_cannot_turn_to_connect_diagonal_islands(self):
        input_text = "3 3\n1 0 0\n0 0 0\n0 0 1\n"
        self.assertEqual(self.program.run(input_text), "-1")

    def test_minimum_spanning_tree_skips_the_longest_cycle_edge(self):
        # Four corner islands: horizontal edges cost 3, vertical edges 2.
        input_text = (
            "4 5\n1 0 0 0 1\n0 0 0 0 0\n"
            "0 0 0 0 0\n1 0 0 0 1\n"
        )
        self.assertEqual(self.program.run(input_text), "7")

    def test_an_isolated_island_makes_the_whole_map_impossible(self):
        input_text = (
            "4 5\n1 0 0 0 1\n0 0 0 0 0\n"
            "0 0 1 0 0\n0 0 0 0 0\n"
        )
        self.assertEqual(self.program.run(input_text), "-1")


if __name__ == "__main__":
    unittest.main()
