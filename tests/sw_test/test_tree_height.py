"""Console tests for SWEA 14510 tree height against a day-by-day search."""

from random import Random
import unittest

from java_runner import JavaProgram


def minimum_days_by_search(heights):
    """Try every watering choice day by day without the one/two split.

    Odd days grow one tree by 1 and even days by 2, or nothing is watered.
    The target is free, so heights may rise above the tallest tree.
    """
    ceiling = max(heights) + 4
    layer = {tuple(heights)}
    day = 0
    while True:
        if any(len(set(state)) == 1 for state in layer):
            return day
        day += 1
        grow = 1 if day % 2 else 2
        following = set()
        for state in layer:
            following.add(state)
            for index, height in enumerate(state):
                if height + grow <= ceiling:
                    following.add(state[:index] + (height + grow,) + state[index + 1:])
        layer = following


class TreeHeightTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.program = JavaProgram("나무높이")
        cls.addClassCleanup(cls.program.close)

    def assert_cases(self, cases):
        lines = [str(len(cases))]
        expected = []
        for index, (heights, answer) in enumerate(cases, start=1):
            lines.extend((str(len(heights)), " ".join(map(str, heights))))
            expected.append(f"#{index} {answer}")
        self.assertEqual(self.program.run("\n".join(lines) + "\n"), "\n".join(expected))

    def test_equal_heights_need_no_days(self):
        self.assert_cases([([5, 5, 5], 0), ([1, 1], 0)])

    def test_small_gaps_by_hand(self):
        # Short by 1 is day 1. Short by 2 is day 2. Short by 3 is day 1 then day 2.
        self.assert_cases([([1, 2], 1), ([1, 3], 2), ([1, 4], 2)])

    def test_random_small_cases_match_the_day_by_day_search(self):
        rng = Random(14510)
        cases = []
        for _ in range(60):
            count = rng.randint(2, 4)
            heights = [rng.randint(1, 6) for _ in range(count)]
            cases.append((heights, minimum_days_by_search(heights)))
        self.assert_cases(cases)


if __name__ == "__main__":
    unittest.main()
