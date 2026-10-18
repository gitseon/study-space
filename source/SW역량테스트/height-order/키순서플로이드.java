import java.io.*;
import java.util.*;

public class 키순서플로이드 {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringBuilder sb = new StringBuilder();

        int T = Integer.parseInt(br.readLine().trim());
        for (int tc = 1; tc <= T; tc++) {
            int N = Integer.parseInt(br.readLine().trim());
            int M = Integer.parseInt(br.readLine().trim());

            // reachable[a][b] : a가 b보다 작다는 관계를 직접 또는 간접적으로 안다
            boolean[][] reachable = new boolean[N + 1][N + 1];
            for (int i = 0; i < M; i++) {
                StringTokenizer st = new StringTokenizer(br.readLine());
                int shorter = Integer.parseInt(st.nextToken());
                int taller = Integer.parseInt(st.nextToken());
                reachable[shorter][taller] = true;
            }

            // 경유 학생 via를 가장 바깥에 둬야 via 단계마다 관계가 빠짐없이 확정된다
            for (int via = 1; via <= N; via++) {
                for (int from = 1; from <= N; from++) {
                    // from이 via보다 작다는 사실을 모르면 via를 거쳐 갈 수 없다
                    if (!reachable[from][via]) {
                        continue;
                    }
                    for (int to = 1; to <= N; to++) {
                        if (reachable[via][to]) {
                            reachable[from][to] = true;
                        }
                    }
                }
            }

            int answer = 0;
            for (int student = 1; student <= N; student++) {
                int knownCount = 0;
                for (int other = 1; other <= N; other++) {
                    if (student == other) {
                        continue;
                    }
                    if (reachable[student][other] || reachable[other][student]) {
                        knownCount++;
                    }
                }
                // 자신을 제외한 N-1명 모두와의 관계를 알면 순서가 정해진다
                if (knownCount == N - 1) {
                    answer++;
                }
            }

            sb.append('#').append(tc).append(' ').append(answer).append('\n');
        } // tc end
        System.out.print(sb);
    } // main end
}
