import java.io.*;
import java.util.*;

public class 키순서 {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringBuilder sb = new StringBuilder();
        StringTokenizer st;

        int T = Integer.parseInt(br.readLine().trim());
        for (int tc = 1; tc <= T; tc++) {
            sb.append("#").append(tc).append(" ");

            int N = Integer.parseInt(br.readLine().trim());
            int M = Integer.parseInt(br.readLine().trim());

            // 각 인덱스별 자신보다 크거나 작은 학생의 수(얼마나 알고 있는지) -> 이 수가 N - 1 이면 자신의 순서를 안다
            int[] known = new int[N + 1];
            // 각 인덱스마다 인접한 자신보다 작은 학생들을 원소로 가짐
            List<Integer>[] smallerThan = new ArrayList[N + 1];
            // 각 인덱스마다 인접한 자신보다 큰 학생들을 원소로 가짐
            List<Integer>[] tallerThan = new ArrayList[N + 1];

            for (int i = 1; i <= N; i++) {
                smallerThan[i] = new ArrayList<>();
                tallerThan[i] = new ArrayList<>();
            }

            // 인접 리스트에 원소 삽입
            for (int i = 0; i < M; i++) {
                st = new StringTokenizer(br.readLine());
                int a = Integer.parseInt(st.nextToken());
                int b = Integer.parseInt(st.nextToken());
                tallerThan[a].add(b);
                smallerThan[b].add(a);
            }

            Queue<Integer> smallQ = new ArrayDeque<>();
            Queue<Integer> tallQ = new ArrayDeque<>();

            // 각 학생을 시작점으로 두 방향 BFS를 돌리며 만나는 학생마다 known[시작점]++
            for (int i = 1; i <= N; i++) {
                boolean[] smallVisited = new boolean[N + 1];
                smallQ.offer(i);
                smallVisited[i] = true;

                // smaller bfs
                while (!smallQ.isEmpty()) {
                    int node = smallQ.poll();

                    // 인접 리스트가 비어 있으면 반복문이 0번 실행되므로 따로 분기하지 않는다
                    for (int next : smallerThan[node]) {
                        // 방문하지 않은 노드만 탐색
                        if (!smallVisited[next]) {
                            smallVisited[next] = true;
                            known[i]++;
                            smallQ.offer(next);
                        }
                    } // for next end
                } // smaller bfs end

                boolean[] tallVisited = new boolean[N + 1];
                tallQ.offer(i);
                tallVisited[i] = true;

                // taller bfs
                while (!tallQ.isEmpty()) {
                    int node = tallQ.poll();

                    for (int next : tallerThan[node]) {
                        // 방문하지 않은 노드만 탐색
                        if (!tallVisited[next]) {
                            tallVisited[next] = true;
                            known[i]++;
                            tallQ.offer(next);
                        }
                    } // for next end
                } // taller bfs end
            } // for i end

            // known이 N-1인 학생 수를 센다
            int count = 0;
            for (int i = 1; i <= N; i++) {
                if (known[i] == N - 1) {
                    count++;
                }
            }
            sb.append(count).append("\n");
        } // tc end
        System.out.print(sb);
    } // main end
}
