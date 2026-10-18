import java.io.*;
import java.util.*;

public class 선수과목 {

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringBuilder sb = new StringBuilder();

        StringTokenizer st = new StringTokenizer(br.readLine());
        int N = Integer.parseInt(st.nextToken()); // 과목 수 <= 1000
        int M = Integer.parseInt(st.nextToken()); // 선수 조건 수 <= 500000(입력 반복 수)

        int[] inDegree = new int[N + 1]; // 진입차수 관리 1번부터 사용
        int[] semester = new int[N + 1]; // 각 과목별 학기 관리: 진입차수에 따라 학기를 나눔

        List<Integer>[] graph = new ArrayList[N + 1];
        for (int i = 1; i <= N; i++) {
            graph[i] = new ArrayList<>();
        }

        for (int i = 1; i <= M; i++) {
            st = new StringTokenizer(br.readLine());
            int A = Integer.parseInt(st.nextToken());
            int B = Integer.parseInt(st.nextToken());

            // A -> B 방향이므로 진입차수 증가, 인접리스트에 연결 정보 추가
            graph[A].add(B);
            inDegree[B]++;
        }

        // 현재 처리해도 되는 노드를 넣는다.(노드 번호: 과목 번호)
        Queue<Integer> q = new ArrayDeque<>();

        // 모든 과목의 진입차수에 따른 학기 확인
        for (int i = 1; i <= N; i++) {
            // 진입 차수가 0이면 먼저 들을 수 있는 과목이므로 1학기로 지정하고 q에 넣는다.
            if (inDegree[i] == 0) {
                semester[i] = 1;
                q.offer(i);
            }
        }

        // 학기 갱신하기
        while (!q.isEmpty()) {
            int subject = q.poll();

            // 현재 과목 이후 들을 수 있는 과목들 탐색
            for (int next : graph[subject]) {
                // 선수과목이 있는 과목이므로 학기 갱신: 이전 과목의 다음 학기에 듣는 것이 가장 빠른 시기라면 갱신
                // 간략하게 semester[next] = Math.max(semester[next], semester[subject] + 1) 가능
                if (semester[next] < semester[subject] + 1) {
                    semester[next] = semester[subject] + 1;
                }

                // 선수과목을 수강했으므로 이 과목을 수강하기 위해서 들어야하는 과목 수 감소
                inDegree[next]--;

                // 만약 진입차수가 0이 된다면 수강할 수 있으므로 q에 넣고 이후 과목 탐색
                if (inDegree[next] == 0) {
                    q.offer(next);
                }
            } // for end

        } // while end

        // 1번부터 N번까지 최소 몇 학기 수강인지 확인
        for (int i = 1; i <= N; i++) {
            sb.append(semester[i]).append(" ");
        }
        System.out.print(sb);

    } // main end
} // class end
