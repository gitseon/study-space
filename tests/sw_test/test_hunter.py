"""Console tests for the hunter problem against every valid visiting order."""

from itertools import permutations
from random import Random
import unittest

from java_runner import JavaProgram


def shortest_route_by_permutation(grid):
    """Visit each monster, then its customer, from (0, 0) by Manhattan distance."""
    place = {}
    for r, row in enumerate(grid):
        for c, value in enumerate(row):
            if value:
                place[value] = (r, c)
    count = max(value for value in place if value > 0)
    events = [("m", i) for i in range(1, count + 1)] + [("c", i) for i in range(1, count + 1)]
    best = None
    for order in permutations(events):
        hunted = set()
        valid = True
        for kind, number in order:
            if kind == "m":
                hunted.add(number)
            elif number not in hunted:
                valid = False
                break
        if not valid:
            continue
        x = y = total = 0
        for kind, number in order:
            tx, ty = place[number if kind == "m" else -number]
            total += abs(x - tx) + abs(y - ty)
            x, y = tx, ty
        best = total if best is None else min(best, total)
    return best


def random_grid(rng, size, monsters):
    cells = rng.sample([(r, c) for r in range(size) for c in range(size)], monsters * 2)
    grid = [[0] * size for _ in range(size)]
    for number in range(1, monsters + 1):
        r, c = cells[number - 1]
        grid[r][c] = number
        r, c = cells[monsters + number - 1]
        grid[r][c] = -number
    return grid


class HunterTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.program = JavaProgram("헌터")
        cls.addClassCleanup(cls.program.close)

    def assert_cases(self, cases):
        lines = [str(len(cases))]
        expected = []
        for index, (grid, answer) in enumerate(cases, start=1):
            lines.append(str(len(grid)))
            lines.extend(" ".join(map(str, row)) for row in grid)
            expected.append(f"#{index} {answer}")
        self.assertEqual(self.program.run("\n".join(lines) + "\n"), "\n".join(expected))

    def test_one_monster_and_its_customer(self):
        # (0,0) -> (1,1) costs 2, then (1,1) -> (2,2) costs 2. Without counting
        # the monsters the search would stop at once and print 0.
        self.assert_cases([([[0, 0, 0], [0, 1, 0], [0, 0, -1]], 4)])

    def test_customer_must_wait_for_its_monster(self):
        # Customer 1 is closer, but monster 1 comes first: 4 steps out, 3 back.
        grid = [[0, -1, 0, 0, 1]] + [[0] * 5 for _ in range(4)]
        self.assert_cases([(grid, 7)])

    def test_each_case_resets_the_monster_count(self):
        one = [[0, 0, 0], [0, 1, 0], [0, 0, -1]]
        two = [[0, 1, 0], [-1, 0, 2], [0, -2, 0]]
        self.assert_cases([(one, 4), (two, shortest_route_by_permutation(two)), (one, 4)])

    def test_random_boards_match_every_valid_order(self):
        rng = Random(2026)
        cases = []
        for _ in range(40):
            monsters = rng.randint(1, 4)
            grid = random_grid(rng, rng.randint(3, 6), monsters)
            cases.append((grid, shortest_route_by_permutation(grid)))
        self.assert_cases(cases)


if __name__ == "__main__":
    unittest.main()
