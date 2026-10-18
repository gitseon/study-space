import java.io.IOException;
import java.io.InputStream;

/**
 * 사과 먹기 게임 복기본을 기준으로 한 풀이.
 *
 * 전제: N은 5 이상인 홀수이고, (0, 0)에서 동쪽을 보고 시작한다.
 * 직진과 제자리 우회전만 가능하며 회전 횟수의 합을 최소화한다.
 * 사과는 1번부터 차례로 나타나고 최대 10개이며 장애물은 없다.
 * 사과는 가장자리에 없고 연속한 사과는 서로 다른 행과 열에 있다.
 * 복기에서 N의 상한은 확인되지 않으므로 격자 전체는 저장하지 않는다.
 *
 * 입력: T, 각 사례의 N, N행의 격자. 사과 개수는 격자의 최대 번호이다.
 * 복기본 예제처럼 00000으로 붙인 행과 0 0 0 0 0 형태의 정수 행을 받는다.
 * 10번 사과의 붙여 쓰기 규칙은 복기에 없으므로 10이 있으면 공백으로 구분한다.
 * 출력: 사례마다 최소 회전 횟수만 한 줄에 출력한다. 사례 번호는 붙이지 않는다.
 *
 * 현재 방향을 기준으로 목표의 앞쪽 거리와 오른쪽 거리를 구한다.
 * 오른쪽 앞은 1회, 오른쪽 뒤는 2회, 왼쪽의 두 사분면은 3회가 필요하다.
 * 그보다 적게 회전하면 필요한 방향의 이동을 할 수 없으므로 하한이다.
 * 목표가 내부에 있어 빈 가장자리까지 우회할 공간이 있으므로 이 하한을 달성한다.
 * 도착 방향은 회전 횟수로 결정된다. 한 구간에서 더 회전하려는 경우에는
 * 그 회전을 사과 도착 직후로 미룰 수 있다. 이후의 최적 경로는 같은 상태에서
 * 계속할 수 있으므로 구간마다 최소 횟수만 선택하는 그리디가 성립한다.
 *
 * 사례당 시간 복잡도: O(N^2 + A), 추가 공간: O(A). 출력 버퍼는 별도이다.
 * A는 사과 개수이며 최대 10이다.
 */
public class 사과먹기게임 {
    // 방향을 시계 방향으로 나열하면 우회전 후 방향은 (방향 + 횟수) % 4이다.
    private static final int[] DR = {0, 1, 0, -1};
    private static final int[] DC = {1, 0, -1, 0};
    private static final int MAX_APPLES = 10;

    public static void main(String[] args) throws IOException {
        FastScanner in = new FastScanner(System.in);
        int testCases = in.nextInt();
        if (testCases == -1) {
            return;
        }

        StringBuilder answer = new StringBuilder();
        for (int testCase = 0; testCase < testCases; testCase++) {
            int size = in.nextInt();
            int[] appleRow = new int[MAX_APPLES + 1];
            int[] appleCol = new int[MAX_APPLES + 1];
            int count = 0;
            for (int row = 0; row < size; row++) {
                count = Math.max(count, in.readBoardRow(size, row, appleRow, appleCol));
            }
            answer.append(minimumTurns(appleRow, appleCol, count)).append('\n');
        }
        System.out.print(answer);
    }

    private static int minimumTurns(int[] appleRow, int[] appleCol, int count) {
        int row = 0;
        int col = 0;
        int direction = 0;
        int total = 0;
        for (int number = 1; number <= count; number++) {
            int deltaRow = appleRow[number] - row;
            int deltaCol = appleCol[number] - col;
            int forward = deltaRow * DR[direction] + deltaCol * DC[direction];
            int rightDirection = (direction + 1) % 4;
            int right = deltaRow * DR[rightDirection] + deltaCol * DC[rightDirection];

            // 같은 행 또는 열인 연속 사과가 없으므로 두 상대 거리는 0이 아니다.
            int turns = right > 0 ? (forward > 0 ? 1 : 2) : 3;
            total += turns;
            direction = (direction + turns) % 4;
            row = appleRow[number];
            col = appleCol[number];
        }
        return total;
    }

    private static class FastScanner {
        private final InputStream input;
        private final byte[] buffer = new byte[1 << 16];
        private int position;
        private int length;

        FastScanner(InputStream input) {
            this.input = input;
        }

        private int read() throws IOException {
            if (position >= length) {
                length = input.read(buffer);
                position = 0;
                if (length == -1) {
                    return -1;
                }
            }
            return buffer[position++];
        }

        private int nextNonWhitespace() throws IOException {
            int ch;
            do {
                ch = read();
            } while (ch != -1 && ch <= ' ');
            return ch;
        }

        int nextInt() throws IOException {
            int ch = nextNonWhitespace();
            int value = 0;
            if (ch == -1) {
                return -1;
            }
            while (ch > ' ') {
                value = value * 10 + ch - '0';
                ch = read();
            }
            return value;
        }

        int readBoardRow(int size, int row, int[] appleRow, int[] appleCol)
                throws IOException {
            int first = nextNonWhitespace();
            int second = read();
            int third = second > ' ' ? read() : -1;
            // 한 칸은 최대 두 자리이고 붙인 행은 다섯 자리 이상이다.
            // 처음 세 글자로 형식을 판별해 긴 행 문자열도 저장하지 않는다.
            boolean compact = third > ' ';
            int maximum = 0;
            for (int col = 0; col < size; col++) {
                int number;
                if (compact) {
                    int ch = col == 0 ? first : col == 1 ? second : col == 2 ? third : read();
                    number = ch - '0';
                } else if (col == 0) {
                    number = first - '0';
                    if (second > ' ') {
                        number = number * 10 + second - '0';
                    }
                } else {
                    number = nextInt();
                }
                if (number > 0) {
                    appleRow[number] = row;
                    appleCol[number] = col;
                    maximum = Math.max(maximum, number);
                }
            }
            return maximum;
        }
    }
}
