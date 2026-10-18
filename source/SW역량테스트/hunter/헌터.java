import java.util.*;
import java.io.*;

public class 헌터 {

    static final int INF = 1000000000;
    static int[][] monsters;
    static int[][] customers;
    static int mobCount;
    static boolean[] hunted;
    static boolean[] visited;
    static StringBuilder sb;
    static int answer;

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st;
        sb = new StringBuilder();

        int T = Integer.parseInt(br.readLine().trim());
        for (int tc = 1; tc <= T; tc++) {
            sb.append('#').append(tc).append(' ');
            int N = Integer.parseInt(br.readLine().trim());

            monsters = new int[5][2];
            customers = new int[5][2];
            answer = INF;
            mobCount = 0;

            for (int i = 0; i < N; i++) {
                st = new StringTokenizer(br.readLine());
                for (int j = 0; j < N; j++) {
                    int point = Integer.parseInt(st.nextToken());
                    if (point > 0) {
                        monsters[point][0] = i;
                        monsters[point][1] = j;
                        mobCount++;
                    } else if (point < 0) {
                        customers[-point][0] = i;
                        customers[-point][1] = j;
                    } else
                        continue;
                }

            } // for i end

            hunted = new boolean[5];
            visited = new boolean[5];

            dfs(0, 0, 0, 0);

            sb.append(answer).append('\n');
        } // tc end
        System.out.print(sb);
    } // main end

    static void dfs(int x, int y, int depth, int dist) {
        if (dist >= answer) {
            return;
        }

        if (depth == mobCount * 2) {
            if (answer > dist)
                answer = dist;
            return;
        }

        int move = 0;
        for (int i = 1; i <= mobCount; i++) {
            if (!hunted[i]) {
                move = Math.abs(x - monsters[i][0]) + Math.abs(y - monsters[i][1]);
                hunted[i] = true;
                dfs(monsters[i][0], monsters[i][1], depth + 1, dist + move);
                hunted[i] = false;
            }
            if (hunted[i] && !visited[i]) {
                move = Math.abs(x - customers[i][0]) + Math.abs(y - customers[i][1]);
                visited[i] = true;
                dfs(customers[i][0], customers[i][1], depth + 1, dist + move);
                visited[i] = false;
            }
        } // for i end
    } // dfs end
} // class end
