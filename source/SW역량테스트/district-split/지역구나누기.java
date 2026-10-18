import java.io.*;
import java.util.*;

/**
 * BOJ 17471 게리맨더링: https://www.acmicpc.net/problem/17471
 *
 * 입력: 구역 수 N(2~10), 각 구역의 인구, 각 구역의 인접 구역 목록이다.
 * 테스트 케이스 수 T는 없다. 인접 관계는 양방향이다.
 * 출력: 두 선거구의 인구 차이 최솟값. 가능한 분할이 없으면 -1을 출력한다.
 * 두 선거구는 모두 비어 있지 않아야 하고, 각 선거구 안에서 서로 연결되어야 한다.
 *
 * 핵심 풀이: 비트마스크로 첫 선거구를 고르면 나머지는 두 번째 선거구다.
 * 1번 구역을 첫 선거구에 고정해 같은 분할을 두 번 검사하지 않는다.
 * 두 선거구 각각의 연결성을 확인한 뒤에만 인구 차이를 비교한다.
 * 인접 목록도 비트마스크이므로 연결성 검사는 O(N)이다.
 * 시간 복잡도 O(2^N * N), 공간 복잡도 O(N).
 * BOJ 제출 시 public class 이름을 Main으로 바꾼다.
 */
public class 지역구나누기 {
    private static int[] adjacent;

    private static boolean isConnected(int group) {
        int frontier = Integer.lowestOneBit(group);
        int visited = frontier;
        while (frontier != 0) {
            int currentBit = Integer.lowestOneBit(frontier);
            frontier ^= currentBit;
            int current = Integer.numberOfTrailingZeros(currentBit);
            int unvisitedNeighbors = adjacent[current] & group & ~visited;
            visited |= unvisitedNeighbors;
            frontier |= unvisitedNeighbors;
        }
        return visited == group;
    }

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(br.readLine().trim());
        int[] population = new int[n];
        int totalPopulation = 0;
        StringTokenizer st = new StringTokenizer(br.readLine());
        for (int district = 0; district < n; district++) {
            population[district] = Integer.parseInt(st.nextToken());
            totalPopulation += population[district];
        }

        adjacent = new int[n];
        for (int district = 0; district < n; district++) {
            st = new StringTokenizer(br.readLine());
            int count = Integer.parseInt(st.nextToken());
            for (int i = 0; i < count; i++) {
                int neighbor = Integer.parseInt(st.nextToken()) - 1;
                adjacent[district] |= 1 << neighbor;
            }
        }

        int allDistricts = (1 << n) - 1;
        int answer = Integer.MAX_VALUE;
        // 홀수 마스크에는 항상 1번 구역이 들어 있다. 전체 집합은 제외한다.
        for (int group = 1; group < allDistricts; group += 2) {
            int otherGroup = allDistricts ^ group;
            if (!isConnected(group) || !isConnected(otherGroup)) {
                continue;
            }

            int groupPopulation = 0;
            for (int district = 0; district < n; district++) {
                if ((group & (1 << district)) != 0) {
                    groupPopulation += population[district];
                }
            }
            answer = Math.min(answer, Math.abs(2 * groupPopulation - totalPopulation));
            if (answer == 0) {
                break;
            }
        }

        System.out.println(answer == Integer.MAX_VALUE ? -1 : answer);
    }
}
