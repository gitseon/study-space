import java.io.*;
import java.util.*;

/**
 * 산악 구조 로봇: 높이별 이동 비용을 갖는 격자 최단경로 연습.
 *
 * 전제와 입출력(이 파일에서 채택한 학습용 모델):
 * - 입력은 T, 각 테스트의 N, 공백으로 구분한 N x N 높이 정수다.
 * - 좌상단 (0, 0)에서 우하단 (N-1, N-1)까지 상하좌우로 이동한다.
 * - 내리막은 0, 평지는 1, 오르막은 높이 차이의 2배가 든다.
 * - 출발 자체에는 비용이 없으며 출력은 "#테스트번호 최소비용"이다.
 * 산악 구조 로봇은 보급로와 비슷한 최단경로 유형이라는 정보만 확인했다.
 * 이동 비용과 입출력 원문은 확인하지 못했으므로 위 형식을 가정한다.
 * 실제 문제 조건을 받으면 입력부와 movementCost를 먼저 확인한다.
 *
 * 핵심 풀이:
 * 각 칸을 정점으로, 인접 칸으로 이동할 때의 에너지를 방향 간선 비용으로 본다.
 * 비용이 모두 0 이상이므로 우선순위 큐를 사용하는 다익스트라로 해결한다.
 * 칸 수가 많은 우회 경로도 에너지가 더 작을 수 있어 일반 BFS로는 부족하다.
 * 큐에 들어간 뒤 더 좋은 경로가 생긴 항목은 꺼낼 때 거리 배열과 비교해 건너뛴다.
 * 도착 칸을 최소 비용 상태로 꺼냈을 때 그 비용이 정답이다.
 *
 * 복잡도: 정점 N^2개, 간선 최대 4N^2개이므로 시간 O(N^2 log N), 공간 O(N^2).
 */
public class 산악구조로봇 {
    private static final int[] DR = {-1, 1, 0, 0};
    private static final int[] DC = {0, 0, -1, 1};

    private static class State implements Comparable<State> {
        final int row;
        final int col;
        final long cost;

        State(int row, int col, long cost) {
            this.row = row;
            this.col = col;
            this.cost = cost;
        }

        @Override
        public int compareTo(State other) {
            return Long.compare(cost, other.cost);
        }
    }

    // 다른 비용 규칙의 문제를 풀 때 이 함수에서 이동 비용을 바꾼다.
    private static long movementCost(int fromHeight, int toHeight) {
        long difference = (long) toHeight - fromHeight;
        if (difference < 0) {
            return 0;
        }
        if (difference == 0) {
            return 1;
        }
        return difference * 2;
    }

    private static long minimumEnergy(int[][] heights) {
        int n = heights.length;
        long[][] distance = new long[n][n];
        for (long[] row : distance) {
            Arrays.fill(row, Long.MAX_VALUE);
        }

        PriorityQueue<State> queue = new PriorityQueue<>();
        distance[0][0] = 0;
        queue.offer(new State(0, 0, 0));

        while (!queue.isEmpty()) {
            State current = queue.poll();
            if (current.cost != distance[current.row][current.col]) {
                continue;
            }
            if (current.row == n - 1 && current.col == n - 1) {
                return current.cost;
            }

            for (int direction = 0; direction < 4; direction++) {
                int nextRow = current.row + DR[direction];
                int nextCol = current.col + DC[direction];
                if (nextRow < 0 || nextRow >= n || nextCol < 0 || nextCol >= n) {
                    continue;
                }

                long nextCost = current.cost + movementCost(
                        heights[current.row][current.col], heights[nextRow][nextCol]);
                if (nextCost < distance[nextRow][nextCol]) {
                    distance[nextRow][nextCol] = nextCost;
                    queue.offer(new State(nextRow, nextCol, nextCost));
                }
            }
        }
        return distance[n - 1][n - 1];
    }

    public static void main(String[] args) throws IOException {
        FastScanner scanner = new FastScanner(System.in);
        int testCases = scanner.nextInt();
        StringBuilder output = new StringBuilder();
        for (int test = 1; test <= testCases; test++) {
            int n = scanner.nextInt();
            int[][] heights = new int[n][n];
            for (int row = 0; row < n; row++) {
                for (int col = 0; col < n; col++) {
                    heights[row][col] = scanner.nextInt();
                }
            }
            output.append('#').append(test).append(' ')
                    .append(minimumEnergy(heights)).append('\n');
        }
        System.out.print(output);
    }

    private static class FastScanner {
        private final InputStream input;
        private final byte[] buffer = new byte[1 << 16];
        private int position;
        private int length;

        FastScanner(InputStream input) {
            this.input = input;
        }

        private int read() throws IOException {
            if (position >= length) {
                length = input.read(buffer);
                position = 0;
                if (length < 0) {
                    return -1;
                }
            }
            return buffer[position++];
        }

        int nextInt() throws IOException {
            int character;
            do {
                character = read();
                if (character == -1) {
                    throw new EOFException("입력 정수가 부족합니다.");
                }
            } while (character <= ' ');

            int sign = 1;
            if (character == '-') {
                sign = -1;
                character = read();
            }
            int value = 0;
            while (character > ' ') {
                value = value * 10 + character - '0';
                character = read();
            }
            return value * sign;
        }
    }
}
