
import java.util.*;
import java.io.*;

public class 프로세서연결하기 {

    static class Core {
        int r;
        int c;

        Core(int r, int c) {
            this.r = r;
            this.c = c;
        }
    }

    static final int[] dr = { 0, 1, 0, -1 };
    static final int[] dc = { 1, 0, -1, 0 };

    static List<Core> cores;
    static int[][] map;
    static int maxConnected;
    static int minLength;
    static int N;

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringBuilder sb = new StringBuilder();
        StringTokenizer st;

        int T = Integer.parseInt(br.readLine().trim());
        for (int tc = 1; tc <= T; tc++) {
            sb.append('#').append(tc).append(' ');
            N = Integer.parseInt(br.readLine().trim());

            maxConnected = 0;
            minLength = 145;
            cores = new ArrayList<>();
            map = new int[N][N];
            for (int i = 0; i < N; i++) {
                st = new StringTokenizer(br.readLine());
                for (int j = 0; j < N; j++) {
                    map[i][j] = Integer.parseInt(st.nextToken());
                    if (map[i][j] == 1) {
                        if (i != 0 && i != N - 1 && j != 0 && j != N - 1) {
                            cores.add(new Core(i, j));
                        }
                    } // if end
                } // for j end
            } // for i end

            dfs(0, 0, 0);
            sb.append(minLength).append('\n');
        } // tc end
        System.out.print(sb);
    } // main end

    static void dfs(int depth, int cntConn, int lengthSum) {
        if (cntConn + cores.size() - depth < maxConnected) {
            return;
        }

        if (depth == cores.size()) {
            if (maxConnected < cntConn) {
                maxConnected = cntConn;
                minLength = lengthSum;
            } else if (maxConnected == cntConn) {
                if (minLength > lengthSum)
                    minLength = lengthSum;
            }

            return;
        }

        Core cur = cores.get(depth);

        for (int dir = 0; dir < 4; dir++) {
            if (canConnect(cur, dir)) {
                int len = setWire(cur, dir, 1);
                dfs(depth + 1, cntConn + 1, lengthSum + len);
                setWire(cur, dir, 0);
            }
        }

        dfs(depth + 1, cntConn, lengthSum);

    } // dfs end

    static boolean canConnect(Core core, int dir) {
        int nr = core.r + dr[dir];
        int nc = core.c + dc[dir];

        while (inRange(nr, nc)) {
            if (map[nr][nc] != 0) {
                return false;
            }
            nr += dr[dir];
            nc += dc[dir];
        }

        return true;
    }

    static int setWire(Core core, int dir, int value) {
        int length = 0;
        int nr = core.r + dr[dir];
        int nc = core.c + dc[dir];

        while (inRange(nr, nc)) {
            map[nr][nc] = value;
            length++;

            nr += dr[dir];
            nc += dc[dir];
        }
        return length;
    } // setWire

    static boolean inRange(int nr, int nc) {
        return 0 <= nr && nr < N && 0 <= nc && nc < N;
    }
}
