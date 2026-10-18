"""Random checks for the three BOJ graph solutions against independent oracles."""

from itertools import combinations
from random import Random
import unittest

from java_runner import JavaProgram


def semesters_by_relaxation(count, pairs):
    """Raise a subject's semester until no prerequisite pair is violated."""
    semester = [1] * (count + 1)
    changed = True
    while changed:
        changed = False
        for before, after in pairs:
            if semester[after] < semester[before] + 1:
                semester[after] = semester[before] + 1
                changed = True
    return semester[1:]


def is_connected(members, neighbors):
    members = set(members)
    if not members:
        return False
    start = next(iter(members))
    seen = {start}
    stack = [start]
    while stack:
        current = stack.pop()
        for other in neighbors[current]:
            if other in members and other not in seen:
                seen.add(other)
                stack.append(other)
    return seen == members


def smallest_population_gap(populations, neighbors):
    count = len(populations)
    everyone = set(range(count))
    best = None
    for size in range(1, count):
        for group in combinations(range(count), size):
            rest = everyone - set(group)
            if is_connected(group, neighbors) and is_connected(rest, neighbors):
                gap = abs(sum(populations[i] for i in group) - sum(populations[i] for i in rest))
                best = gap if best is None else min(best, gap)
    return -1 if best is None else best


def label_islands(grid):
    rows, cols = len(grid), len(grid[0])
    label = [[0] * cols for _ in range(rows)]
    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] and not label[r][c]:
                count += 1
                label[r][c] = count
                stack = [(r, c)]
                while stack:
                    cr, cc = stack.pop()
                    for nr, nc in ((cr + 1, cc), (cr - 1, cc), (cr, cc + 1), (cr, cc - 1)):
                        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] and not label[nr][nc]:
                            label[nr][nc] = count
                            stack.append((nr, nc))
    return label, count


def bridge_candidates(grid, label):
    rows, cols = len(grid), len(grid[0])
    found = set()
    for r in range(rows):
        for c in range(cols):
            if not grid[r][c]:
                continue
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc, length = r + dr, c + dc, 0
                while 0 <= nr < rows and 0 <= nc < cols and not grid[nr][nc]:
                    length += 1
                    nr += dr
                    nc += dc
                if 0 <= nr < rows and 0 <= nc < cols and label[nr][nc] != label[r][c] and length >= 2:
                    a, b = sorted((label[r][c], label[nr][nc]))
                    found.add((a, b, length))
    return sorted(found)


def cheapest_connection_by_subsets(grid):
    """Try every subset of bridge candidates and keep the cheapest connected one."""
    label, islands = label_islands(grid)
    candidates = bridge_candidates(grid, label)
    best = None
    for mask in range(1 << len(candidates)):
        parent = list(range(islands + 1))

        def find(x):
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        total = 0
        for index, (a, b, length) in enumerate(candidates):
            if mask >> index & 1:
                parent[find(a)] = find(b)
                total += length
        if len({find(i) for i in range(1, islands + 1)}) == 1:
            best = total if best is None else min(best, total)
    return -1 if best is None else best


class GraphRandomTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.prerequisite = JavaProgram("선수과목")
        cls.district = JavaProgram("지역구나누기")
        cls.bridge = JavaProgram("다리건설")
        cls.addClassCleanup(cls.prerequisite.close)
        cls.addClassCleanup(cls.district.close)
        cls.addClassCleanup(cls.bridge.close)

    def test_prerequisite_matches_relaxation(self):
        rng = Random(14567)
        for _ in range(60):
            count = rng.randint(2, 8)
            options = list(combinations(range(1, count + 1), 2))
            pairs = rng.sample(options, rng.randint(0, min(len(options), 12)))
            text = f"{count} {len(pairs)}\n" + "".join(f"{a} {b}\n" for a, b in pairs)
            expected = " ".join(map(str, semesters_by_relaxation(count, pairs)))
            self.assertEqual(self.prerequisite.run(text), expected, text)

    def test_district_split_matches_every_subset(self):
        rng = Random(17471)
        for _ in range(60):
            count = rng.randint(2, 7)
            populations = [rng.randint(1, 9) for _ in range(count)]
            neighbors = {i: set() for i in range(count)}
            for a, b in combinations(range(count), 2):
                if rng.random() < 0.4:
                    neighbors[a].add(b)
                    neighbors[b].add(a)
            lines = [str(count), " ".join(map(str, populations))]
            for i in range(count):
                adjacent = sorted(neighbors[i])
                lines.append(" ".join(map(str, [len(adjacent)] + [x + 1 for x in adjacent])))
            expected = str(smallest_population_gap(populations, neighbors))
            self.assertEqual(self.district.run("\n".join(lines) + "\n"), expected, lines)

    def test_island_bridges_match_every_bridge_subset(self):
        rng = Random(17472)
        checked = 0
        while checked < 60:
            rows, cols = rng.randint(3, 6), rng.randint(3, 6)
            grid = [[1 if rng.random() < 0.35 else 0 for _ in range(cols)] for _ in range(rows)]
            label, islands = label_islands(grid)
            if islands < 2 or len(bridge_candidates(grid, label)) > 12:
                continue
            text = f"{rows} {cols}\n" + "".join(" ".join(map(str, row)) + "\n" for row in grid)
            self.assertEqual(self.bridge.run(text), str(cheapest_connection_by_subsets(grid)), text)
            checked += 1


if __name__ == "__main__":
    unittest.main()
