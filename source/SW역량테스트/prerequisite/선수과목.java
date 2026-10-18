import java.io.*;
import java.util.*;

/**
 * BOJ 14567 선수과목 (풀이 참고: https://velog.io/@heyoni/14567)
 *
 * 입력: N M 다음에 선수 조건 A B가 M줄 주어진다. 테스트 케이스 수 T는 없다.
 * 출력: 1번부터 N번 과목까지 이수 가능한 최소 학기를 공백으로 구분한다.
 * 모든 과목은 매 학기 개설되고 수강 개수 제한이 없다. A < B이므로 순환은 없다.
 *
 * 핵심 풀이: 진입 차수가 0인 과목부터 위상 정렬한다. 선수과목이 없는 과목은
 * 1학기이고, 나머지는 모든 선수과목의 최소 학기 중 최댓값에 1을 더한다.
 * 진입 차수가 0이 되는 순간에는 모든 선수과목의 학기가 반영되어 있다.
 * 시간 복잡도 O(N + M), 공간 복잡도 O(N + M).
 * BOJ 제출 시 public class 이름을 Main으로 바꾼다.
 */
public class 선수과목 {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        int n = Integer.parseInt(st.nextToken());
        int m = Integer.parseInt(st.nextToken());

        List<List<Integer>> nextSubjects = new ArrayList<>();
        for (int subject = 0; subject <= n; subject++) {
            nextSubjects.add(new ArrayList<Integer>());
        }
        int[] indegree = new int[n + 1];
        for (int i = 0; i < m; i++) {
            st = new StringTokenizer(br.readLine());
            int prerequisite = Integer.parseInt(st.nextToken());
            int next = Integer.parseInt(st.nextToken());
            nextSubjects.get(prerequisite).add(next);
            indegree[next]++;
        }

        int[] semester = new int[n + 1];
        Arrays.fill(semester, 1);
        Queue<Integer> queue = new ArrayDeque<>();
        for (int subject = 1; subject <= n; subject++) {
            if (indegree[subject] == 0) {
                queue.offer(subject);
            }
        }

        while (!queue.isEmpty()) {
            int current = queue.poll();
            for (int next : nextSubjects.get(current)) {
                semester[next] = Math.max(semester[next], semester[current] + 1);
                if (--indegree[next] == 0) {
                    queue.offer(next);
                }
            }
        }

        StringBuilder answer = new StringBuilder();
        for (int subject = 1; subject <= n; subject++) {
            if (subject > 1) {
                answer.append(' ');
            }
            answer.append(semester[subject]);
        }
        System.out.println(answer);
    }
}
