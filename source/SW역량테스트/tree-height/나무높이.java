import java.util.*;
import java.io.*;

public class 나무높이 {
    static int answer;

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringBuilder sb = new StringBuilder();

        int T = Integer.parseInt(br.readLine());
        for (int tc = 1; tc <= T; tc++) {
            sb.append("#").append(tc).append(" ");
            int N = Integer.parseInt(br.readLine());

            int[] trees = new int[N];
            int pivot = -1;
            StringTokenizer st = new StringTokenizer(br.readLine());
            for (int i = 0; i < N; i++) {
                trees[i] = Integer.parseInt(st.nextToken());
                pivot = Math.max(pivot, trees[i]);
            }

            int one = 0;
            int two = 0;
            int diff;
            for (int i = 0; i < N; i++) {
                diff = pivot - trees[i];
                one += diff % 2;
                two += diff / 2;
            }

            while (two - one >= 2) {
                one += 2;
                two--;
            }

            answer = Math.max(2 * one - 1, 2 * two);
            sb.append(answer).append("\n");
        } // tc end
        System.out.print(sb);
    } // main end

}
