"""Console tests for SWEA 5643 height order against the permutation definition."""

from itertools import permutations
from random import Random
import unittest

from java_runner import JavaProgram


def students_with_known_rank(count, shorter_taller_pairs):
    """A rank is known when every valid line-up puts that student in one place."""
    positions = {student: set() for student in range(1, count + 1)}
    for order in permutations(range(1, count + 1)):
        place = {student: index for index, student in enumerate(order)}
        if all(place[a] < place[b] for a, b in shorter_taller_pairs):
            for student, index in place.items():
                positions[student].add(index)
    return sum(len(found) == 1 for found in positions.values())


class HeightOrderTests(unittest.TestCase):
    """The BFS solution. The Floyd-Warshall solution below runs the same cases."""
    CLASS_NAME = "키순서"

    @classmethod
    def setUpClass(cls):
        cls.program = JavaProgram(cls.CLASS_NAME)
        cls.addClassCleanup(cls.program.close)

    def assert_cases(self, cases):
        lines = [str(len(cases))]
        expected = []
        for index, (count, pairs, answer) in enumerate(cases, start=1):
            lines.extend((str(count), str(len(pairs))))
            lines.extend(f"{a} {b}" for a, b in pairs)
            expected.append(f"#{index} {answer}")
        self.assertEqual(self.program.run("\n".join(lines) + "\n"), "\n".join(expected))

    def test_chain_and_unrelated_students(self):
        self.assert_cases([
            (3, [(1, 2), (2, 3)], 3),
            (3, [(1, 2)], 0),
            (4, [], 0),
        ])

    def test_relations_discovered_late_are_still_followed(self):
        # 1 < 3 < 2 < 4 is one chain. A Floyd-Warshall loop ordered from, via, to
        # misses 1 < 4 here and would lose the answer 4.
        self.assert_cases([(4, [(1, 3), (3, 2), (2, 4)], 4)])

    def test_random_graphs_match_the_permutation_definition(self):
        rng = Random(5643)
        cases = []
        for _ in range(40):
            count = rng.randint(2, 7)
            order = list(range(1, count + 1))
            rng.shuffle(order)
            candidates = [(order[i], order[j]) for i in range(count) for j in range(i + 1, count)]
            pairs = rng.sample(candidates, rng.randint(0, len(candidates)))
            cases.append((count, pairs, students_with_known_rank(count, pairs)))
        self.assert_cases(cases)


class FloydHeightOrderTests(HeightOrderTests):
    CLASS_NAME = "키순서플로이드"


if __name__ == "__main__":
    unittest.main()
