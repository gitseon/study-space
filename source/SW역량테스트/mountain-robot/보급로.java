import java.util.*;
import java.io.*;

public class 보급로 {
    static final int INF = 1000000000; // 다익스트라 로직 구현을 위한 INF 값 설정
    // 상하좌우 탐색이 필요하므로 dy dx 선언
    static final int[] dy = { -1, 1, 0, 0 };
    static final int[] dx = { 0, 0, -1, 1 };

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringBuilder sb = new StringBuilder();

        // 테케 수 입력
        StringTokenizer st = new StringTokenizer(br.readLine());
        int T = Integer.parseInt(st.nextToken());

        // 로직 구현
        for (int tc = 1; tc <= T; tc++) {

            // sb 출력형식 append
            sb.append("#").append(tc).append(" ");

            // 배열의 크기 N 입력
            st = new StringTokenizer(br.readLine());
            int N = Integer.parseInt(st.nextToken());

            // 배열 선언
            int[][] map = new int[N][N];
            // 우선 순위 큐 설정
            // type: {현재까지의 비용, 행 위치, 열 위치}
            PriorityQueue<int[]> q = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));

            // 각 노드별 시작점으로부터 거리 저장하는 dist 배열 선언
            int[][] dist = new int[N][N];

            // 각 지역별 dist INF로 설정
            for (int i = 0; i < N; i++) {
                Arrays.fill(dist[i], INF);
            }
            // 시작점은 0으로 설정
            dist[0][0] = 0;
            // 큐에 시작점 넣기
            q.offer(new int[] { 0, 0, 0 });

            // 각 지역의 깊이(가중치) 배열 입력
            for (int i = 0; i < N; i++) {
                String line = br.readLine();
                for (int j = 0; j < N; j++) {
                    map[i][j] = line.charAt(j) - '0';
                }
            }

            // 큐가 빌때까지 다익스트라 반복
            while (!q.isEmpty()) {
                // 우선순위 큐에서 가장 작은 값을 꺼낸다.
                int[] node = q.poll();
                int cost = node[0];
                int r = node[1];
                int c = node[2];

                // visited 처리 대신 현재 꺼낸 노드의 비용보다 더 적은 비용으로 처리됐다면 굳이 안봐도 됨
                if (cost > dist[r][c]) {
                    continue;
                }

                for (int i = 0; i < 4; i++) {
                    int nr = r + dy[i];
                    int nc = c + dx[i];
                    if (0 <= nr && nr < N && 0 <= nc && nc < N) { // 배열 범위 내에 있다면
                        // 다음 노드까지의 가중치 합
                        int newCost = cost + map[nr][nc];
                        // 더 적은 가중치가 되는 값을 해당 노드 위치의 dist에 저장
                        if (newCost < dist[nr][nc]) {
                            dist[nr][nc] = newCost;
                            q.offer(new int[] { newCost, nr, nc });
                        }
                    }
                }
            }
            sb.append(dist[N - 1][N - 1]).append("\n");
        }

        // sb에 모아서 한꺼번에 출력하기
        System.out.print(sb);
    }
}
