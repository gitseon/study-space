"""Console tests for the recalled apple game, with a full-state oracle."""

import heapq
from itertools import permutations
from random import Random
import unittest

from java_runner import JavaProgram


def minimum_turns_by_state_search(size, apples):
    """Search (row, column, direction, next apple), without quadrant rules.

    Moving one cell forward costs zero; turning right in place costs one.
    Only the next apple exists, so walking over a later location does not eat it.
    The grid boundary is enforced on each move, including detours.
    """
    steps = ((0, 1), (1, 0), (0, -1), (-1, 0))
    start = (0, 0, 0, 0)
    distance = {start: 0}
    queue = [(0, *start)]
    while queue:
        turns, row, col, direction, next_apple = heapq.heappop(queue)
        state = (row, col, direction, next_apple)
        if turns != distance[state]:
            continue
        if next_apple == len(apples):
            return turns

        candidates = [(turns + 1, row, col, (direction + 1) % 4, next_apple)]
        delta_row, delta_col = steps[direction]
        new_row, new_col = row + delta_row, col + delta_col
        if 0 <= new_row < size and 0 <= new_col < size:
            new_next = next_apple + ((new_row, new_col) == apples[next_apple])
            candidates.append((turns, new_row, new_col, direction, new_next))
        for cost, new_row, new_col, new_direction, new_next in candidates:
            new_state = (new_row, new_col, new_direction, new_next)
            if cost < distance.get(new_state, float("inf")):
                distance[new_state] = cost
                heapq.heappush(queue, (cost, *new_state))
    raise AssertionError("Every interior apple is reachable on an empty grid")


def board_for(size, apples):
    board = [[0] * size for _ in range(size)]
    for number, (row, col) in enumerate(apples, start=1):
        board[row][col] = number
    return board


class AppleGameTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.program = JavaProgram("사과먹기게임")

    @classmethod
    def tearDownClass(cls):
        cls.program.close()

    def assert_cases(self, cases):
        lines = [str(len(cases))]
        answers = []
        for board, answer, compact in cases:
            lines.append(str(len(board)))
            separator = "" if compact else " "
            lines.extend(separator.join(map(str, row)) for row in board)
            answers.append(str(answer))
        self.assertEqual(self.program.run("\n".join(lines) + "\n"),
                         "\n".join(answers))

    def test_recalled_examples_use_plain_answers_and_compact_rows(self):
        self.assert_cases([
            ([[0, 0, 0, 0, 0],
              [0, 0, 0, 3, 0],
              [0, 1, 0, 0, 0],
              [0, 0, 2, 0, 0],
              [0, 0, 0, 0, 0]], 7, True),
            ([[0, 0, 0, 0, 0],
              [0, 3, 0, 0, 0],
              [0, 0, 2, 0, 0],
              [0, 0, 4, 1, 0],
              [0, 0, 0, 0, 0]], 9, True),
        ])

    def test_first_apple_starts_facing_east_at_the_upper_left(self):
        self.assert_cases([
            (board_for(5, [(1, 1)]), 1, True),
            (board_for(5, [(3, 3)]), 1, False),
        ])

    def test_future_apple_positions_are_not_obstacles_or_eaten_early(self):
        # The route to apple 1 passes apple 3's location before it appears.
        apples = [(3, 3), (1, 1), (2, 3), (1, 2)]
        self.assert_cases([(board_for(5, apples),
                            minimum_turns_by_state_search(5, apples), True)])

    def test_all_short_valid_sequences_match_full_grid_search(self):
        cells = [(row, col) for row in range(1, 4) for col in range(1, 4)]
        cases = []
        for count in (2, 3):
            for apples in permutations(cells, count):
                if any(a[0] == b[0] or a[1] == b[1]
                       for a, b in zip(apples, apples[1:])):
                    continue
                cases.append((board_for(5, apples),
                              minimum_turns_by_state_search(5, apples), True))
        self.assert_cases(cases)

    def test_random_valid_sequences_and_ten_apple_integer_rows(self):
        rng = Random(141002)
        cases = []
        for index in range(100):
            size = 7 if index < 60 else 9
            count = 10 if index < 25 else rng.randint(1, 10)
            available = [(row, col) for row in range(1, size - 1)
                         for col in range(1, size - 1)]
            apples = []
            while len(apples) < count:
                candidates = [cell for cell in available
                              if not apples or (cell[0] != apples[-1][0]
                                                and cell[1] != apples[-1][1])]
                cell = rng.choice(candidates)
                apples.append(cell)
                available.remove(cell)
            cases.append((board_for(size, apples),
                          minimum_turns_by_state_search(size, apples),
                          count < 10 and index % 2 == 0))
        self.assert_cases(cases)


if __name__ == "__main__":
    unittest.main()
