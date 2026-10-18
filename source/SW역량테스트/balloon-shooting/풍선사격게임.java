import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

/**
 * 복기본의 본문과 그림으로 확인한 규칙을 구간 DP로 푼다.
 * 입력: T, 각 테스트의 N, 이어서 한 줄에 N개의 int 값.
 * 출력: 복기본의 예시처럼 각 테스트의 최대 점수만 한 줄에 출력한다. #번호는 붙이지 않는다.
 *
 * 현재 남은 풍선의 양쪽 이웃이 있으면 두 이웃 값의 곱을 얻는다.
 * 한쪽 이웃만 있으면 그 이웃 값, 마지막 풍선이면 자기 값을 얻는다.
 * 터뜨리는 풍선 자신의 값은 양쪽 이웃의 곱에 포함하지 않는다.
 *
 * dp[left][right]는 양 경계를 남긴 채 열린 구간 (left, right)를 모두 제거하는 최대 점수다.
 * last를 이 구간에서 마지막에 제거하면 그 전까지 last가 양쪽 부분 구간을 분리한다.
 * 따라서 두 부분 구간의 최댓값과 last를 제거하는 점수를 더해 최댓값을 구할 수 있다.
 *
 * N 상한과 값 범위는 제공되지 않았다. 시간 O(N^3), 공간 O(N^2)이므로 실제 제한 확인이 필요하다.
 * 곱, 각 부분 구간의 DP 값과 후보 합을 포함한 모든 중간 점수 계산이 long 범위에 들어온다고 가정한다.
 */
public class 풍선사격게임 {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st;
        StringBuilder output = new StringBuilder();
        int testCases = Integer.parseInt(br.readLine().trim());

        for (int testCase = 1; testCase <= testCases; testCase++) {
            int size = Integer.parseInt(br.readLine().trim());
            int[] values = new int[size + 2];
            st = new StringTokenizer(br.readLine());
            for (int index = 1; index <= size; index++) {
                values[index] = Integer.parseInt(st.nextToken());
            }
            output.append(maximumScore(values, size)).append('\n');
        }

        System.out.print(output);
    }

    private static long maximumScore(int[] values, int size) {
        // 실제 풍선은 1..size, 0과 size+1은 이웃의 부재를 나타내는 경계다.
        // 경계 배열 칸의 값은 사용하지 않으며, 값 1인 가상 풍선을 추가하지 않는다.
        long[][] dp = new long[size + 2][size + 2];

        // 빈 구간 dp[left][left+1]은 0. 작은 구간부터 채운다.
        for (int width = 2; width <= size + 1; width++) {
            for (int left = 0; left + width <= size + 1; left++) {
                int right = left + width;
                // 값 범위가 미제공이므로 비어 있지 않은 구간을 0점으로 초기화하지 않는다.
                long best = Long.MIN_VALUE;
                for (int last = left + 1; last < right; last++) {
                    long score;
                    if (left == 0 && right == size + 1) {
                        score = values[last];
                    } else if (left == 0) {
                        score = values[right];
                    } else if (right == size + 1) {
                        score = values[left];
                    } else {
                        score = (long) values[left] * values[right];
                    }
                    long candidate = dp[left][last] + dp[last][right] + score;
                    best = Math.max(best, candidate);
                }
                dp[left][right] = best;
            }
        }
        return dp[0][size + 1];
    }
}
