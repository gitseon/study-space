"""Console checks for the explicitly documented mountain-robot practice model."""

import unittest

from java_runner import JavaProgram


class MountainRobotTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.program = JavaProgram("산악구조로봇")

    @classmethod
    def tearDownClass(cls):
        cls.program.close()

    def test_equal_heights_cost_one_per_move(self):
        self.assertEqual(self.program.run("1\n3\n7 7 7\n7 7 7\n7 7 7\n"), "#1 4")

    def test_uphill_cost_is_twice_the_height_difference(self):
        # Every route must gain a total height of eight: 8 * 2 = 16.
        self.assertEqual(self.program.run("1\n3\n0 2 4\n2 4 6\n4 6 8\n"), "#1 16")

    def test_downhill_moves_are_free(self):
        self.assertEqual(self.program.run("1\n3\n5 4 3\n4 3 2\n3 2 1\n"), "#1 0")

    def test_minimum_energy_path_can_take_more_steps(self):
        # The all-one corridor takes 12 moves and includes two left moves.
        # Any shortcut leaves it and must climb from 1 to 100, costing 198.
        input_text = (
            "1\n5\n"
            "1 1 1 100 100\n"
            "100 100 1 100 100\n"
            "1 1 1 100 100\n"
            "1 100 100 100 100\n"
            "1 1 1 1 1\n"
        )
        self.assertEqual(self.program.run(input_text), "#1 12")

    def test_start_has_no_entry_cost_and_cases_reset(self):
        # The second case goes down 4 -> 3 for free, then up 3 -> 5 for four.
        input_text = "2\n1\n99\n2\n4 10\n3 5\n"
        self.assertEqual(self.program.run(input_text), "#1 0\n#2 4")


if __name__ == "__main__":
    unittest.main()
