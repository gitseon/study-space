import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

/**
 * SWEA 1949 등산로 조성
 * https://swexpertacademy.com/main/code/problem/problemDetail.do?contestProbId=AV5PoOKKAPIDFAUq
 *
 * 입력: T, 각 테스트의 N K, 이어서 N행의 높이 지도.
 * N은 3~8, K는 1~5이고 원래 높이는 1~20이다.
 * 출력: 테스트마다 "#t 길이" 형식으로 가장 긴 등산로의 칸 수를 출력한다.
 *
 * 풀이: 공사 전 최고점 모두에서 시작해 상하좌우의 엄격한 내리막을 DFS로 탐색한다.
 * 공사는 선택 사항이며 한 경로에서 최대 한 칸을 K 이하의 정수 깊이로 깎는다.
 * 다음 칸이 높거나 같을 때만 공사를 고려하고, 현재 높이보다 1만큼 낮게 만든다.
 * 더 깊게 깎으면 이후 이동할 수 있는 칸만 줄어드므로 이 최소 공사로 충분하다.
 * 이미 낮은 칸은 그대로 이동하는 편이 높이와 공사 기회를 모두 보존한다.
 *
 * 원상복구: 공사 분기를 마치면 원래 높이로, DFS를 마치면 미방문 상태로 되돌린다.
 * 현재 경로의 방문 칸을 다시 깎아서 재방문하는 경우도 반드시 제외한다.
 * 높이를 1보다 작게 만드는 공사도 허용하므로 0을 제한하지 않는다.
 *
 * 복잡도: 최고점 수 P, 경로 길이 상한 L에 대해 시간 O(N^2 + P * 4^L).
 * 경로를 완전 탐색하므로 지수 시간의 보수적인 상한이며 L <= N^2이다.
 * 지도, 방문 배열, 재귀 스택을 합한 공간은 O(N^2)이다.
 */
public class 등산로조성 {
    private static final int[] DR = {-1, 1, 0, 0};
    private static final int[] DC = {0, 0, -1, 1};
    private static int size;
    private static int maximumCut;
    private static int[][] height;
    private static boolean[][] visited;
    private static int longest;

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st;
        StringBuilder output = new StringBuilder();
        int testCases = Integer.parseInt(br.readLine().trim());

        for (int test = 1; test <= testCases; test++) {
            st = new StringTokenizer(br.readLine());
            size = Integer.parseInt(st.nextToken());
            maximumCut = Integer.parseInt(st.nextToken());
            height = new int[size][size];
            visited = new boolean[size][size];
            longest = 0;
            int originalHighest = 0;

            for (int row = 0; row < size; row++) {
                st = new StringTokenizer(br.readLine());
                for (int col = 0; col < size; col++) {
                    height[row][col] = Integer.parseInt(st.nextToken());
                    originalHighest = Math.max(originalHighest, height[row][col]);
                }
            }

            // 높이는 탐색마다 복구되므로 공사 전의 모든 최고점을 정확히 고른다.
            for (int row = 0; row < size; row++) {
                for (int col = 0; col < size; col++) {
                    if (height[row][col] == originalHighest) {
                        search(row, col, 1, false);
                    }
                }
            }
            output.append('#').append(test).append(' ').append(longest).append('\n');
        }
        System.out.print(output);
    }

    private static void search(int row, int col, int length, boolean constructionUsed) {
        visited[row][col] = true;
        longest = Math.max(longest, length);

        for (int direction = 0; direction < 4; direction++) {
            int nextRow = row + DR[direction];
            int nextCol = col + DC[direction];
            if (nextRow < 0 || nextRow >= size || nextCol < 0 || nextCol >= size
                    || visited[nextRow][nextCol]) {
                continue;
            }

            if (height[nextRow][nextCol] < height[row][col]) {
                search(nextRow, nextCol, length + 1, constructionUsed);
            } else if (!constructionUsed
                    && height[nextRow][nextCol] - maximumCut < height[row][col]) {
                int originalHeight = height[nextRow][nextCol];
                height[nextRow][nextCol] = height[row][col] - 1;
                search(nextRow, nextCol, length + 1, true);
                height[nextRow][nextCol] = originalHeight;
            }
        }

        visited[row][col] = false;
    }
}
