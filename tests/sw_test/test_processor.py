"""Console tests for SWEA 1767 against enumeration of every wire choice."""

from itertools import product
from random import Random
import unittest

from java_runner import JavaProgram

DIRECTIONS = ((0, 1), (1, 0), (0, -1), (-1, 0))


def shortest_wire_by_enumeration(grid):
    """Pick skip or one of four directions for each inner core, then validate.

    More connected cores always wins. Ties are broken by the shorter total wire.
    """
    size = len(grid)
    cores = [(r, c) for r in range(1, size - 1) for c in range(1, size - 1) if grid[r][c] == 1]
    best = None
    for choice in product(range(5), repeat=len(cores)):
        used = set()
        length = 0
        connected = 0
        valid = True
        for (row, col), direction in zip(cores, choice):
            if direction == 0:
                continue
            step_r, step_c = DIRECTIONS[direction - 1]
            r, c = row + step_r, col + step_c
            cells = []
            while 0 <= r < size and 0 <= c < size:
                if grid[r][c] != 0 or (r, c) in used:
                    valid = False
                    break
                cells.append((r, c))
                r += step_r
                c += step_c
            if not valid:
                break
            used.update(cells)
            length += len(cells)
            connected += 1
        if valid and (best is None or (connected, -length) > best):
            best = (connected, -length)
    return -best[1]


def random_grid(rng, size):
    cells = [(r, c) for r in range(size) for c in range(size)]
    inner = [(r, c) for r, c in cells if 0 < r < size - 1 and 0 < c < size - 1]
    edge = [cell for cell in cells if cell not in inner]
    chosen = rng.sample(inner, rng.randint(1, 5)) + rng.sample(edge, rng.randint(0, 3))
    grid = [[0] * size for _ in range(size)]
    for r, c in chosen:
        grid[r][c] = 1
    return grid


class ProcessorTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.program = JavaProgram("프로세서연결하기")
        cls.addClassCleanup(cls.program.close)

    def assert_cases(self, cases):
        lines = [str(len(cases))]
        expected = []
        for index, (grid, answer) in enumerate(cases, start=1):
            lines.append(str(len(grid)))
            lines.extend(" ".join(map(str, row)) for row in grid)
            expected.append(f"#{index} {answer}")
        self.assertEqual(self.program.run("\n".join(lines) + "\n"), "\n".join(expected))

    def test_single_inner_core_uses_its_shortest_side(self):
        grid = [[0] * 5 for _ in range(5)]
        grid[1][2] = 1
        # Row 1 is one step from the top edge, so the wire has length 1.
        self.assert_cases([(grid, 1)])

    def test_no_inner_core_needs_no_wire(self):
        grid = [[0] * 5 for _ in range(5)]
        grid[0][0] = 1
        self.assert_cases([(grid, 0)])

    def test_two_cores_in_one_row(self):
        grid = [[0] * 5 for _ in range(5)]
        grid[2][1] = 1
        grid[2][3] = 1
        self.assert_cases([(grid, shortest_wire_by_enumeration(grid))])

    def test_random_boards_match_the_enumeration(self):
        rng = Random(1767)
        cases = []
        for _ in range(40):
            grid = random_grid(rng, rng.randint(5, 7))
            cases.append((grid, shortest_wire_by_enumeration(grid)))
        self.assert_cases(cases)


if __name__ == "__main__":
    unittest.main()
