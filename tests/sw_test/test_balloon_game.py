"""Check the recalled balloon examples and independent physical-removal scores."""

from itertools import permutations
from random import Random
import unittest

from java_runner import JavaProgram


def maximum_score_by_removal_orders(values):
    """Try every order and physically delete balloons from the remaining list.

    Original indices identify equal-valued balloons. This oracle never uses
    intervals or chooses a last balloon, so it independently checks Java's DP.
    """
    best = None
    for order in permutations(range(len(values))):
        remaining = list(enumerate(values))
        score = 0
        for original_index in order:
            position = next(index for index, (identity, _) in enumerate(remaining)
                            if identity == original_index)
            if len(remaining) == 1:
                score += remaining[position][1]
            elif position == 0:
                score += remaining[1][1]
            elif position == len(remaining) - 1:
                score += remaining[position - 1][1]
            else:
                score += remaining[position - 1][1] * remaining[position + 1][1]
            remaining.pop(position)
        best = score if best is None else max(best, score)
    return best


class BalloonGameTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.program = JavaProgram("풍선사격게임")

    @classmethod
    def tearDownClass(cls):
        cls.program.close()

    def assert_cases(self, cases):
        lines = [str(len(cases))]
        expected = []
        for values, answer in cases:
            lines.extend((str(len(values)), " ".join(map(str, values))))
            expected.append(str(answer))
        self.assertEqual(self.program.run("\n".join(lines) + "\n"),
                         "\n".join(expected))

    def test_recalled_examples_use_plain_score_lines(self):
        # The recalled statement lists five inputs but only the first output (20).
        # The other outputs were independently checked by memoized physical
        # removal of every possible next balloon, without interval DP.
        input_text = (
            "5\n4\n1 2 3 4\n"
            "5\n3 10 1 2 5\n"
            "7\n12 48 28 21 67 75 85\n"
            "8\n245 108 162 400 274 358 366 166\n"
            "10\n866 919 840 944 761 895 701 912 848 799\n"
        )
        self.assertEqual(self.program.run(input_text),
                         "20\n100\n16057\n561630\n6455522")

    def test_last_balloon_scores_its_own_value(self):
        # A fictitious value-1 balloon at each end would incorrectly score 1.
        self.assert_cases([([7], 7), ([1], 1), ([2_147_483_647], 2_147_483_647)])

    def test_only_neighbor_is_scored_at_either_end(self):
        self.assert_cases([([1, 2], 4), ([2, 1], 4)])

    def test_middle_removal_multiplies_neighbors_without_the_target(self):
        # Remove 1, then 3, then 5: 3*5 + 5 + 5 = 25.
        self.assert_cases([([3, 1, 5], 25)])

    def test_removing_an_end_can_be_better_than_the_middle(self):
        # Remove both 2s before 100: 100 + 100 + 100 = 300.
        self.assert_cases([([2, 100, 2], 300)])

    def test_product_and_total_use_long_arithmetic(self):
        self.assert_cases([
            ([50_000, 1, 50_000], 2_500_100_000),
            ([50_000, 1, 50_000, 1, 50_000], 7_500_100_000),
            ([2_147_483_647, 0, 2_147_483_647], 4_611_686_018_427_387_903),
        ])

    def test_each_case_reinitializes_intervals_and_preserves_output_order(self):
        self.assert_cases([
            ([3, 1, 5], 25), ([7], 7), ([2, 100, 2], 300),
            ([1, 2], 4), ([1], 1),
        ])

    def test_fixed_arrays_match_every_physical_removal_order(self):
        arrays = [
            [1, 1, 1, 1], [9, 1, 8, 2], [2, 7, 1, 9, 3],
            [4, 4, 2, 4, 4, 1], [0], [0, 5, 0], [-5], [-2, -3],
            [-3, 2, -1, 4],
        ]
        self.assert_cases([(values, maximum_score_by_removal_orders(values))
                           for values in arrays])

    def test_small_random_arrays_match_every_physical_removal_order(self):
        rng = Random(641037)
        arrays = [[rng.randint(1, 12) for _ in range(size)]
                  for size in range(1, 8) for _ in range(8)]
        self.assert_cases([(values, maximum_score_by_removal_orders(values))
                           for values in arrays])


if __name__ == "__main__":
    unittest.main()
