"""Console checks for the 산악 구조 로봇(보급로) solution: digit grid, cost of the entered cell."""

import unittest

from java_runner import JavaProgram


class MountainRobotTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.program = JavaProgram("보급로")

    @classmethod
    def tearDownClass(cls):
        cls.program.close()

    def test_single_cell_costs_nothing(self):
        self.assertEqual(self.program.run("1\n1\n9\n"), "#1 0")

    def test_start_is_free_and_goal_is_charged(self):
        # Each route enters a 1 and then the goal 9: 1 + 9 = 10, and the start 9 is never added.
        self.assertEqual(self.program.run("1\n2\n91\n19\n"), "#1 10")

    def test_all_zero_grid(self):
        self.assertEqual(self.program.run("1\n3\n000\n000\n000\n"), "#1 0")

    def test_cheapest_path_can_take_more_steps(self):
        # The detour through zeros avoids every 9 on the short routes.
        input_text = "1\n5\n00999\n90999\n90000\n99990\n99990\n"
        self.assertEqual(self.program.run(input_text), "#1 0")

    def test_costs_add_along_the_cheapest_route(self):
        input_text = "1\n3\n011\n111\n111\n"
        self.assertEqual(self.program.run(input_text), "#1 4")

    def test_cases_reset_between_tests(self):
        input_text = "2\n2\n09\n90\n2\n01\n10\n"
        self.assertEqual(self.program.run(input_text), "#1 9\n#2 1")


if __name__ == "__main__":
    unittest.main()
