import java.io.*;
import java.util.*;

/**
 * BOJ 17472 다리 만들기 2 (풀이 참고: https://velog.io/@protoss1025/%EB%B0%B1%EC%A4%80-17472-%EB%8B%A4%EB%A6%AC-%EB%A7%8C%EB%93%A4%EA%B8%B0-2)
 *
 * 입력: N M 다음에 0(바다), 1(땅)로 이루어진 지도가 N줄 주어진다.
 * 테스트 케이스 수 T는 없다. 섬은 상하좌우로 연결된 땅의 묶음이다.
 * 출력: 모든 섬을 연결하는 다리 길이 합의 최솟값. 불가능하면 -1이다.
 * 다리는 가로 또는 세로 직선이어야 하고 바다를 최소 2칸 지나야 한다.
 * 다리끼리 교차할 수 있지만 교차점에서 다른 다리로 갈아탈 수는 없다.
 *
 * 핵심 풀이: BFS로 섬 번호를 붙인 뒤 모든 땅에서 네 방향으로 직진한다.
 * 처음 만나는 다른 섬까지의 바다 길이가 2 이상일 때만 다리 후보로 삼는다.
 * 섬 쌍마다 가장 짧은 다리만 남기고 Kruskal로 최소 신장 트리를 구한다.
 * 선택한 다리가 섬 개수 - 1개보다 적으면 연결할 수 없는 섬이 있다.
 * 섬 수를 K라 할 때 시간 O(NM * max(N, M) + K^2 log K), 공간 O(NM + K^2).
 * BOJ 제출 시 public class 이름을 Main으로 바꾼다.
 */
public class 다리건설 {
    private static final int[] DR = {-1, 1, 0, 0};
    private static final int[] DC = {0, 0, -1, 1};
    private static int n;
    private static int m;
    private static int[][] land;
    private static int[][] island;
    private static int[] parent;

    private static boolean inBounds(int row, int col) {
        return row >= 0 && row < n && col >= 0 && col < m;
    }

    private static int labelIslands() {
        int count = 0;
        Queue<Integer> queue = new ArrayDeque<>();
        for (int row = 0; row < n; row++) {
            for (int col = 0; col < m; col++) {
                if (land[row][col] == 0 || island[row][col] != 0) {
                    continue;
                }
                island[row][col] = ++count;
                queue.offer(row * m + col);
                while (!queue.isEmpty()) {
                    int current = queue.poll();
                    int currentRow = current / m;
                    int currentCol = current % m;
                    for (int direction = 0; direction < 4; direction++) {
                        int nextRow = currentRow + DR[direction];
                        int nextCol = currentCol + DC[direction];
                        if (inBounds(nextRow, nextCol) && land[nextRow][nextCol] == 1
                                && island[nextRow][nextCol] == 0) {
                            island[nextRow][nextCol] = count;
                            queue.offer(nextRow * m + nextCol);
                        }
                    }
                }
            }
        }
        return count;
    }

    private static List<Edge> findBridges(int islandCount) {
        int[][] shortest = new int[islandCount + 1][islandCount + 1];
        for (int[] distances : shortest) {
            Arrays.fill(distances, Integer.MAX_VALUE);
        }
        for (int row = 0; row < n; row++) {
            for (int col = 0; col < m; col++) {
                int from = island[row][col];
                if (from == 0) {
                    continue;
                }
                for (int direction = 0; direction < 4; direction++) {
                    int nextRow = row + DR[direction];
                    int nextCol = col + DC[direction];
                    int length = 0;
                    while (inBounds(nextRow, nextCol) && island[nextRow][nextCol] == 0) {
                        length++;
                        nextRow += DR[direction];
                        nextCol += DC[direction];
                    }
                    if (!inBounds(nextRow, nextCol)) {
                        continue;
                    }
                    int to = island[nextRow][nextCol];
                    // 중간에 땅을 만났다면 그 뒤의 섬까지 다리를 연장할 수 없다.
                    if (to != from && length >= 2) {
                        shortest[from][to] = Math.min(shortest[from][to], length);
                        shortest[to][from] = Math.min(shortest[to][from], length);
                    }
                }
            }
        }

        List<Edge> edges = new ArrayList<>();
        for (int from = 1; from <= islandCount; from++) {
            for (int to = from + 1; to <= islandCount; to++) {
                if (shortest[from][to] != Integer.MAX_VALUE) {
                    edges.add(new Edge(from, to, shortest[from][to]));
                }
            }
        }
        return edges;
    }

    private static int find(int islandNumber) {
        if (parent[islandNumber] != islandNumber) {
            parent[islandNumber] = find(parent[islandNumber]);
        }
        return parent[islandNumber];
    }

    private static class Edge implements Comparable<Edge> {
        final int from;
        final int to;
        final int length;

        Edge(int from, int to, int length) {
            this.from = from;
            this.to = to;
            this.length = length;
        }

        @Override
        public int compareTo(Edge other) {
            return Integer.compare(length, other.length);
        }
    }

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        n = Integer.parseInt(st.nextToken());
        m = Integer.parseInt(st.nextToken());
        land = new int[n][m];
        island = new int[n][m];
        for (int row = 0; row < n; row++) {
            st = new StringTokenizer(br.readLine());
            for (int col = 0; col < m; col++) {
                land[row][col] = Integer.parseInt(st.nextToken());
            }
        }

        int islandCount = labelIslands();
        List<Edge> edges = findBridges(islandCount);
        Collections.sort(edges);
        parent = new int[islandCount + 1];
        for (int i = 1; i <= islandCount; i++) {
            parent[i] = i;
        }

        int selected = 0;
        int totalLength = 0;
        for (Edge edge : edges) {
            int fromRoot = find(edge.from);
            int toRoot = find(edge.to);
            if (fromRoot == toRoot) {
                continue;
            }
            parent[toRoot] = fromRoot;
            totalLength += edge.length;
            if (++selected == islandCount - 1) {
                break;
            }
        }
        System.out.println(selected == islandCount - 1 ? totalLength : -1);
    }
}
