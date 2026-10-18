"""Console tests for SWEA 1949, including an independent pre-cut oracle."""

from functools import lru_cache
from random import Random
import unittest

from java_runner import JavaProgram


def longest_after_enumerating_construction(terrain, maximum_cut):
    """Enumerate static maps, then find longest paths in each descending DAG.

    This deliberately differs from Java's path search with an unused-cut flag:
    every possible construction site and integer depth is fixed before a path
    is considered. Original highest peaks remain the permitted starting cells.
    """
    size = len(terrain)
    highest = max(map(max, terrain))
    starts = [(r, c) for r in range(size) for c in range(size)
              if terrain[r][c] == highest]
    constructions = [None] + [
        (r, c, depth)
        for r in range(size) for c in range(size)
        for depth in range(1, maximum_cut + 1)
    ]
    answer = 0
    for construction in constructions:
        fixed = [row[:] for row in terrain]
        if construction is not None:
            row, col, depth = construction
            fixed[row][col] -= depth

        @lru_cache(maxsize=None)
        def descending_length(row, col):
            best = 1
            for next_row, next_col in ((row - 1, col), (row + 1, col),
                                       (row, col - 1), (row, col + 1)):
                if (0 <= next_row < size and 0 <= next_col < size
                        and fixed[next_row][next_col] < fixed[row][col]):
                    best = max(best, 1 + descending_length(next_row, next_col))
            return best

        answer = max(answer, *(descending_length(r, c) for r, c in starts))
    return answer


class HikingTrailTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.program = JavaProgram("등산로조성")

    @classmethod
    def tearDownClass(cls):
        cls.program.close()

    def assert_cases(self, cases):
        lines = [str(len(cases))]
        expected = []
        for index, (terrain, maximum_cut, answer) in enumerate(cases, start=1):
            lines.append(f"{len(terrain)} {maximum_cut}")
            lines.extend(" ".join(map(str, row)) for row in terrain)
            expected.append(f"#{index} {answer}")
        self.assertEqual(self.program.run("\n".join(lines) + "\n"),
                         "\n".join(expected))

    def test_example_maps_and_case_numbering(self):
        self.assert_cases([
            ([[9, 3, 2, 3, 2],
              [6, 3, 1, 7, 5],
              [3, 4, 8, 9, 9],
              [2, 3, 7, 7, 7],
              [7, 6, 5, 5, 8]], 1, 6),
            ([[1, 2, 1], [2, 1, 2], [1, 2, 1]], 2, 3),
        ])

    def test_considers_every_original_highest_peak(self):
        # The first height-6 peak only permits length 4; another permits 5.
        self.assert_cases([([[5, 6, 1], [5, 3, 6], [6, 3, 1]], 3, 5)])

    def test_can_finish_without_using_construction(self):
        # The snake 9 -> 8 -> ... -> 1 already visits all nine cells.
        self.assert_cases([([[9, 8, 7], [2, 3, 6], [1, 4, 5]], 1, 9)])

    def test_can_use_exactly_the_limit_and_go_below_height_one(self):
        terrain = [[1, 2, 1], [2, 1, 2], [1, 2, 1]]
        # Reaching 0 from 2 -> 1 needs the entire depth-2 allowance.
        self.assert_cases([(terrain, 1, 2), (terrain, 2, 3)])

    def test_restores_height_and_visits_between_search_branches(self):
        # A height leak gives 7; permanently marked visits give only 5.
        self.assert_cases([([[7, 5, 4], [1, 5, 3], [1, 2, 2]], 2, 6)])

    def test_cannot_cut_and_revisit_an_earlier_cell(self):
        # Ignoring the current route's visited cells spuriously gives 4.
        self.assert_cases([([[2, 3, 6], [5, 3, 2], [1, 4, 2]], 2, 3)])

    def test_largest_map_and_maximum_height_and_cut(self):
        terrain = [[20 - row - col for col in range(8)] for row in range(8)]
        # Fourteen descending moves, then one last cut into an unused cell.
        self.assert_cases([(terrain, 5, 16)])

    def test_small_maps_match_independent_pre_cut_enumeration(self):
        rng = Random(1949)
        cases = []
        while len(cases) < 80:
            size = 3 if len(cases) < 60 else 4
            terrain = [[rng.randint(1, 8) for _ in range(size)]
                       for _ in range(size)]
            highest = max(map(max, terrain))
            if sum(value == highest for row in terrain for value in row) > 5:
                continue
            maximum_cut = rng.randint(1, 5)
            answer = longest_after_enumerating_construction(terrain, maximum_cut)
            cases.append((terrain, maximum_cut, answer))
        # Keep each process within the statement's 50-test-case limit.
        self.assert_cases(cases[:40])
        self.assert_cases(cases[40:])


if __name__ == "__main__":
    unittest.main()
