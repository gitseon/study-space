## question: subject-03-q01
### solution
호출 한 번이 자신보다 1 작은 호출을 두 번 만든다. 깊이 k에는 $2^k$개의 호출이 있고 깊이는 n까지이므로 전체 호출 수는 $2^{n+1} - 1$이다. 호출마다 상수 시간이 들어 $O(2^n)$이다.
### choice-explanation: a
재귀 깊이만 셌다.
### choice-explanation: b
각 단계가 반으로 나뉘는 재귀가 아니다.
### choice-explanation: c
호출 수가 레벨마다 두 배다.
### choice-explanation: d
깊이의 제곱으로 계산할 수 없다.

## question: subject-03-q02
### solution
첫 외부 반복에서 j가 N이 된다. 이후 while은 실행되지 않는다.
### choice-explanation: a
N이 커지면 호출 수가 증가한다.
### choice-explanation: b
j는 배증하지 않는다.
### choice-explanation: c
j가 전체에서 N번 증가한다.
### choice-explanation: d
중첩 모양만 보고 곱했다.

## question: subject-03-q03
### solution
두 포인터가 가리키는 값 중 작은 값을 결과 배열에 하나씩 옮기므로 2N개를 한 번씩 처리해 시간은 $O(N)$이다. 결과 배열 2N칸이 추가로 필요하므로 공간도 $O(N)$이다.
### choice-explanation: a
각 원소를 한 번 복사한다.
### choice-explanation: b
모든 원소 쌍을 비교하지 않는다.
### choice-explanation: c
출력 배열 공간을 누락했다.
### choice-explanation: d
출력 자체가 2N개다.

## question: subject-03-q04
### solution
큐는 먼저 들어간 값이 먼저 나오고 스택은 마지막 값이 먼저 나온다.
### choice-explanation: a
FIFO와 LIFO의 정의다.
### choice-explanation: b
두 자료구조를 뒤집었다.
### choice-explanation: c
둘 다 정의와 다르다.
### choice-explanation: d
넣은 순서와 역순 모두 아니다.

## question: subject-03-q05
### solution
BST의 대소 규칙이 있어야 한다. 일반 이진트리의 중위 순회는 정렬을 보장하지 않는다.
### choice-explanation: a
왼쪽 작은 키 다음 루트 다음 오른쪽 큰 키다.
### choice-explanation: b
오른쪽부터 방문해야 내림차순이다.
### choice-explanation: c
중위는 레벨 순회가 아니다.
### choice-explanation: d
삽입 순서를 보존하지 않는다.

## question: subject-03-q06
### solution
자식 둘 중 더 작은 값과 비교해야 양쪽 자식 조건을 만족시킬 수 있다. 높이는 $O(\log N)$이다.
### choice-explanation: a
더 작은 자식과 교환해 힙 조건을 복구한다.
### choice-explanation: b
루트에는 부모가 없다.
### choice-explanation: c
전체 반전은 힙 조건을 보장하지 않는다.
### choice-explanation: d
저장된 데이터가 바뀐다.

## question: subject-03-q07
### solution
완전이진트리는 힙의 형태 조건이다. 값의 대소 조건은 별도로 만족해야 한다.
### choice-explanation: a
모양에 대한 정의다.
### choice-explanation: b
키 대소 관계로 정의한다.
### choice-explanation: c
가중치 합을 최소화한 연결 구조다.
### choice-explanation: d
일반적인 방향 그래프 조건이다.

## question: subject-03-q08
### solution
모든 순열에서 A와 B를 바꾸면 조건을 만족하는 순서와 위반하는 순서가 짝지어진다. $\frac{4!}{2} = 12$이다.
### choice-explanation: a
전체의 4분의 1이 아니다.
### choice-explanation: b
A와 B 순서 대칭으로 절반이다.
### choice-explanation: c
3분의 4라는 비율 근거가 없다.
### choice-explanation: d
조건 없는 전체 순열 수다.

## question: subject-03-q09
### solution
선택 여부만 달라지고 다음 처리할 원소는 두 분기 모두 같다.
### choice-explanation: a
두 분기 모두 다음 원소로 이동한다.
### choice-explanation: b
입력 값을 바꿀 필요가 없다.
### choice-explanation: c
상태 공간을 잘못 변경한다.
### choice-explanation: d
종료 조건으로 진행하지 못한다.

## question: subject-03-q10
### solution
오른쪽에서 a[i-1] < a[i]인 지점을 찾을 수 없으면 마지막 순열이다. 초기화 동작은 구현 규약에 따라 별도다.
### choice-explanation: a
완전 내림차순이 최댓값이다.
### choice-explanation: b
더 큰 첫 차이 값을 만들 수 없다.
### choice-explanation: c
상승 지점이 없다.
### choice-explanation: d
원소 수와 다음 상태 수는 다르다.

## question: subject-03-q11
### solution
행렬은 각 정점의 V개 칸을 검사한다. 리스트는 정점과 저장된 간선만 확인한다.
### choice-explanation: a
행 전체와 실제 간선 목록의 차이다.
### choice-explanation: b
두 표현의 비용을 바꿨다.
### choice-explanation: c
행렬의 이웃 조회 비용을 누락했다.
### choice-explanation: d
모든 정점을 처리하는 비용도 필요하다.

## question: subject-03-q12
### solution
진입 차수만 합하면 E이고 진출 차수만 합해도 E다.
### choice-explanation: a
간선마다 들어옴과 나감에 한 번 기여한다.
### choice-explanation: b
무방향 차수 합과 혼동했다.
### choice-explanation: c
간선을 세 번 셀 근거가 없다.
### choice-explanation: d
간선 수로 정확히 계산할 수 있다.

## question: subject-03-q13
### solution
일반적인 서로 다른 가중치에는 BFS의 방문 순서만으로 최단 비용을 보장할 수 없다.
### choice-explanation: a
간선 수 최소가 비용 최소와 일치한다.
### choice-explanation: b
차수와 최단 비용은 관계없다.
### choice-explanation: c
정점 이름은 관계없다.
### choice-explanation: d
가중치 조건을 대신하지 못한다.

## question: subject-03-q14
### solution
바깥에서 모든 정점을 확인하고 미방문 정점마다 DFS를 한 번 시작한다.
### choice-explanation: a
아직 방문하지 않은 요소를 찾는다.
### choice-explanation: b
기존 요소를 다시 방문하게 된다.
### choice-explanation: c
연결 요소 탐색의 필수 단계가 아니다.
### choice-explanation: d
다른 요소에 도달하지 못한다.

## question: subject-03-q15
### solution
비트마다 선택지가 2개이므로 2⁶=64다.
### choice-explanation: a
비트 수를 두 배로 계산했다.
### choice-explanation: b
5비트의 상태 수다.
### choice-explanation: c
각 비트의 두 상태를 곱한다.
### choice-explanation: d
순열 수 $6!$과 혼동했다.

## question: subject-03-q16
### solution
OR (1<<1)로 0111을 만들고 AND ~(1<<2)로 0011을 만든다.
### choice-explanation: a
1번 비트 추가를 누락했다.
### choice-explanation: b
0111에서 2번을 지웠다.
### choice-explanation: c
2번 비트 제거를 누락했다.
### choice-explanation: d
다른 비트를 잘못 지웠다.

## question: subject-03-q17
### solution
대표로 가는 경로를 줄여 다음 find의 작업량을 줄인다. 집합을 합치는 연산과 구별한다.
### choice-explanation: a
트리만 납작하게 만든다.
### choice-explanation: b
소속은 바뀌지 않는다.
### choice-explanation: c
원소의 식별 번호는 바뀌지 않는다.
### choice-explanation: d
union을 실행하는 것이 아니다.

## question: subject-03-q18
### solution
위상정렬 결과는 유일하지 않을 수 있다. 동시에 진입 차수 0인 정점의 선택 순서에 따라 달라진다.
### choice-explanation: a
A와 B의 순서는 둘 다 가능하다.
### choice-explanation: b
A B C와 B A C다.
### choice-explanation: c
C가 마지막이어야 한다.
### choice-explanation: d
제약 없는 전체 순열 수다.

## question: subject-03-q19
### solution
선택을 확정하기 전에 최적성을 증명해야 한다. 백트래킹으로 대안을 비교하면 반례를 찾을 수 있다.
### choice-explanation: a
6+1+1보다 4+4가 적다.
### choice-explanation: b
탐욕과 최적을 뒤집었다.
### choice-explanation: c
4+4를 고려하지 않았다.
### choice-explanation: d
탐욕은 처음 6을 고른다.

## question: subject-03-q20
### solution
반환값이 배열 길이일 수 있으므로 접근 전에 범위를 확인해야 한다.
### choice-explanation: a
모든 값보다 목표가 크다.
### choice-explanation: b
중간 위치가 답은 아니다.
### choice-explanation: c
마지막 원소도 목표보다 작다.
### choice-explanation: d
배열 끝의 삽입 위치다.

## question: subject-03-q21
### solution
두 포인터가 각각 최대 N칸 전진하므로 합해도 2N을 넘지 않는다.
### choice-explanation: a
배열 길이에 비례해 증가한다.
### choice-explanation: b
포인터가 배증하는 것이 아니다.
### choice-explanation: c
각각 최대 N번 이동한다.
### choice-explanation: d
중첩된 코드 모양만 보고 곱했다.

## question: subject-03-q22
### solution
모범답안은 2다. `work()`는 중첩 반복에서 $N^2$번, 뒤의 반복에서 N번 호출되어 모두 $N^2 + N$번이다. 가장 크게 증가하는 항 $N^2$만 남기므로 $O(N^2)$이고 k는 2다.


## question: subject-03-q23
### solution
FIFO로 8과 3이 제거된다.


## question: subject-03-q24
### solution
트리는 연결되고 사이클이 없으므로 간선 수가 노드 수보다 하나 적다.


## question: subject-03-q25
### solution
$5! = 5 \times 4 \times 3 \times 2 \times 1 = 120$이다.


## question: subject-03-q26
### solution
켜질 두 위치를 고르는 4C2=6이다.


## question: subject-03-q27
### solution
모범답안은 12다. 무방향 간선 u와 v는 `adj[u][v]`와 `adj[v][u]` 두 칸에 기록되므로 $2 \times 6 = 12$칸이다. 자기 루프가 없어 대각선은 모두 0이다.


## question: subject-03-q28
### solution
1110 AND 1101은 1100이다. 십진수는 12다.


## question: subject-03-q29
### solution
모범답안은 3이다. 끝 시각 순으로 `(1, 4)`를 고르고 4 이전에 시작하는 `(3, 5)`와 `(0, 6)`은 건너뛴다. 다음으로 `(5, 7)`을 고르고 `(8, 9)`를 고른다. 마지막 `(5, 9)`는 9 이전에 시작해 겹친다. 이 문제에서 끝 시각 기준 탐욕은 최대 회의 수를 보장하며 모든 조합과 비교해도 3개가 최대다.


## question: subject-03-q30
### solution
큰 쪽 값을 줄여야 하므로 right를 왼쪽으로 한 칸 이동한다.


## question: subject-03-q31
### solution
고정 폭 정수 범위에서 원소 검사와 상태 복사는 간단해진다. 그러나 각 원소의 포함 여부가 독립적이므로 상태 수는 $2^N$개다. 모든 상태를 열거하면 상태마다 한 번씩 $2^N$번 이상 처리해야 하므로 $O(N)$이 될 수 없다. N이 정수 비트 폭보다 크면 추가 표현도 필요하다.


## question: subject-03-q32
### solution
경로 압축은 find로 방문한 경로를 대표에 직접 연결한다. 크기 기준 union은 작은 트리를 큰 트리 밑에 붙여 불필요한 높이 증가를 줄인다. 연결 여부는 두 find의 대표를 비교한다. 두 최적화를 함께 쓰면 연산열의 상환 비용이 매우 작지만 모든 단일 호출이 엄밀한 상수 시간인 것은 아니다.

