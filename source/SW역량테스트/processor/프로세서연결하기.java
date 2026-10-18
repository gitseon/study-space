import java.util.*;
import java.io.*;

public class 프로세서연결하기 {

    static class Core {
        int r; // 행 좌표
        int c; // 열 좌표

        Core(int r, int c) {
            this.r = r;
            this.c = c;
        }
    }

    static final int[] dr = { 0, 1, 0, -1 };
    static final int[] dc = { 1, 0, -1, 0 };

    static int maxConnected; // 연결한 core 수
    static int minLength; // 전선 길이의 합(연결 코어 수 같다면 최소가 되어야함)
    static int N; // map 크기
    static int[][] map;
    static List<Core> cores; // 코어들을 담을 리스트

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringBuilder sb = new StringBuilder();
        StringTokenizer st;

        int T = Integer.parseInt(br.readLine());

        for (int tc = 1; tc <= T; tc++) {
            N = Integer.parseInt(br.readLine());

            maxConnected = 0;
            minLength = 145; // 최대 map 크기인 12x12 = 144 고려하여 초기값 설정
            map = new int[N][N];
            cores = new ArrayList<>();
            for (int i = 0; i < N; i++) {
                st = new StringTokenizer(br.readLine());
                for (int j = 0; j < N; j++) {
                    map[i][j] = Integer.parseInt(st.nextToken());

                    // 가장자리 코어는 이미 연결된 상태이므로 count하고 탐색은 하지 않는다.
                    if (map[i][j] == 1) {
                        // 가장자리 아닌 노드들만 저장
                        if (i != 0 && j != 0 && i != N - 1 && j != N - 1) {
                            cores.add(new Core(i, j));
                        }
                    } // if end

                } // for j end
            } // for i end

            dfs(0, 0, 0);
            sb.append('#').append(tc).append(' ').append(minLength).append('\n');
        } // tc end
        System.out.print(sb);
    } // main end

    // 탐색한 코어 수, 연결한 코어 수, 전선 길이 합
    static void dfs(int depth, int cntConnected, int lengthSum) {

        // 가지치기: 남은 코어 수만큼 연결 여부 결정해도 이전에 했던 결정의 코어 연결 수를 넘지 못하면 더이상 볼필요 없음
        // 남은 코어 수: cores.size() - depth
        if (cntConnected + cores.size() - depth < maxConnected) {
            return;
        }

        // 모든 코어 전선 연결 여부 확인했다면 갱신
        if (depth == cores.size()) { // 최대한 많은 코어 연결해야 하므로 maxConnected
            if (maxConnected < cntConnected) { // 코어 연결 수가 더 많다면 그걸로 갱신
                maxConnected = cntConnected;
                minLength = lengthSum;
            } else if (maxConnected == cntConnected) {
                if (minLength > lengthSum)
                    minLength = lengthSum;
            }

            return;
        }

        // cores에서 하나씩 빼면서 확인하기
        Core cur = cores.get(depth);

        // 각 방향마다 범위가 다르므로 모듈화하여 관리
        // 전선 연결 => 범위 저장해서 해당 범위 내에 들어오는 행 or 열이면 교차므로 return;

        for (int dir = 0; dir < 4; dir++) {
            // 좌, 우, 상, 하 방향 전선 연결 가능한지 확인
            if (canConnect(cur, dir)) {
                // 연결 가능하면 전선 길이 구하기
                int len = setWire(cur, dir, 1);
                dfs(depth + 1, cntConnected + 1, lengthSum + len);
                setWire(cur, dir, 0); // 경우의 수 상태 원복
            }
        }

        // 아무것도 연결x
        dfs(depth + 1, cntConnected, lengthSum);

    } // dfs end

    // 전선 연결 가능여부 확인
    static boolean canConnect(Core core, int dir) {
        int nr = core.r + dr[dir];
        int nc = core.c + dc[dir];

        while (inRange(nr, nc)) {
            if (map[nr][nc] != 0) { // 가는 경로에 이미 전선이 깔려있다면 깔지 못하므로 가지치기
                return false;
            }
            nr += dr[dir];
            nc += dc[dir];
        }

        return true;
    }

    // 전선 상태 변경
    static int setWire(Core core, int dir, int value) {

        int length = 0;
        int nr = core.r + dr[dir];
        int nc = core.c + dc[dir];

        // dr, dc 정의했으므로 방향별 순차 탐색
        while (inRange(nr, nc)) {
            map[nr][nc] = value;
            length++;

            nr += dr[dir];
            nc += dc[dir];
        }

        return length;
    } // setWire end

    // 가능한 범위인지 반환
    static boolean inRange(int nr, int nc) {
        return (0 <= nr && nr < N && 0 <= nc && nc < N);
    }

} // class end
