## question: subject-01-q01
```json
{
  "title": "순차 실행의 시간 복잡도",
  "topics": [
    "complexity"
  ],
  "correctChoiceId": "b",
  "type": "mc",
  "id": "subject-01-q01",
  "revision": 3,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 1,
  "group": "cost"
}
```
### stem
상수 시간 작업을 N번 수행한 뒤 이어서 상수 시간 작업을 $\log_2 N$번 더 수행한다. 전체 실행 시간을 $\Theta$ 표기로 나타내면?
### choice: a
$\Theta(\log N)$
### choice: b
$\Theta(N)$
### choice: c
$\Theta(N \log N)$
### choice: d
$\Theta(N^2)$

## question: subject-01-q02
```json
{
  "title": "중첩 반복문의 실행 횟수",
  "topics": [
    "complexity"
  ],
  "correctChoiceId": "b",
  "type": "mc",
  "id": "subject-01-q02",
  "revision": 3,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 1,
  "group": "cost"
}
```
### stem
아래 코드에서 work() 호출 횟수는?
```java
for (int i = 1; i <= 5; i++) {
    for (int j = 0; j < i; j++) {
        work();
    }
}
```
### choice: d
25회
### choice: c
20회
### choice: b
15회
### choice: a
10회

## question: subject-01-q03
```json
{
  "title": "분할 정복 점화식",
  "topics": [
    "divide",
    "complexity"
  ],
  "correctChoiceId": "c",
  "type": "mc",
  "id": "subject-01-q03",
  "revision": 3,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 1,
  "group": "cost"
}
```
### stem
$T(N) = 2T(N/2) + \Theta(N)$이고 $T(1) = \Theta(1)$이다. N이 2의 거듭제곱일 때 $T(N)$을 $\Theta$ 표기로 나타내면?
### choice: c
$\Theta(N \log N)$
### choice: b
$\Theta(N)$
### choice: d
$\Theta(N^2)$
### choice: a
$\Theta(\log N)$

## question: subject-01-q04
```json
{
  "title": "Java Queue의 조회 메서드",
  "topics": [
    "queue"
  ],
  "correctChoiceId": "a",
  "type": "mc",
  "id": "subject-01-q04",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 1,
  "group": "structures"
}
```
### stem
비어 있는 Java Queue에서 원소를 제거하지 않고 조회하며 null을 반환하는 메서드는?
### choice: b
poll()
### choice: c
remove()
### choice: a
peek()
### choice: d
element()

## question: subject-01-q05
```json
{
  "title": "이진 트리의 중위 순회",
  "topics": [
    "tree"
  ],
  "correctChoiceId": "b",
  "type": "mc",
  "id": "subject-01-q05",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 1,
  "group": "structures"
}
```
### stem
다음 이진 트리를 중위 순회한 방문 순서는?

```tree
A B C D
```
### choice: d
B D A C
### choice: a
A B D C
### choice: b
D B A C
### choice: c
D B C A

## question: subject-01-q06
```json
{
  "title": "배열로 저장한 최소 힙의 조건",
  "topics": [
    "tree"
  ],
  "correctChoiceId": "a",
  "type": "mc",
  "id": "subject-01-q06",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 1,
  "group": "structures"
}
```
### stem
1번 인덱스부터 빈칸 없이 저장한 배열 중 최소 힙은?
### choice: a
[2, 5, 3, 7, 8]
### choice: b
[2, 5, 1, 7, 8]
### choice: c
[2, 5, 3, 1, 8]
### choice: d
[2, 5, 3, 7, 4]

## question: subject-01-q07
```json
{
  "title": "트리 노드의 깊이와 높이",
  "topics": [
    "tree"
  ],
  "correctChoiceId": "a",
  "type": "mc",
  "id": "subject-01-q07",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 1,
  "group": "structures"
}
```
### stem
이진 트리를 1번 인덱스부터 레벨 순서로 배열 `[A, B, C, D, E, -, -, F]`에 저장했다. `-`는 빈 자리이고 인덱스 $i$의 자식은 $2i$와 $2i+1$이다. B의 깊이와 높이는? 둘 다 간선 수로 센다.

```tree
indexed
A B C D E - - F
```
### choice: d
깊이 2 높이 2
### choice: a
깊이 1 높이 2
### choice: c
깊이 1 높이 3
### choice: b
깊이 2 높이 1

## question: subject-01-q08
```json
{
  "title": "순열 재귀의 방문 상태 복원",
  "topics": [
    "recursion",
    "enumeration"
  ],
  "correctChoiceId": "a",
  "type": "mc",
  "id": "subject-01-q08",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 1,
  "group": "enumeration"
}
```
### stem
visited로 중복 사용을 막는 순열 재귀에서 후보 i의 재귀 호출이 끝난 후 필요한 작업은?
### choice: a
visited[i]를 false로 복원
### choice: b
visited 전체를 true로 변경
### choice: d
후보 반복문을 바로 종료
### choice: c
재귀 깊이를 N으로 변경

## question: subject-01-q09
```json
{
  "title": "조합 재귀의 다음 시작 인덱스",
  "topics": [
    "enumeration"
  ],
  "correctChoiceId": "c",
  "type": "mc",
  "id": "subject-01-q09",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 1,
  "group": "enumeration"
}
```
### stem
인덱스 0부터 4에서 3개를 고른다. 순서를 구분하지 않는 조합에서 i를 선택한 다음 후보 시작점은?
### choice: b
i
### choice: d
i - 1
### choice: a
0
### choice: c
i + 1

## question: subject-01-q10
```json
{
  "title": "사전순 다음 순열(Next Permutation)",
  "topics": [
    "enumeration"
  ],
  "correctChoiceId": "b",
  "type": "mc",
  "id": "subject-01-q10",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 1,
  "group": "enumeration"
}
```
### stem
서로 다른 값 [1, 3, 2]의 사전순 다음 순열(Next Permutation)은?
### choice: c
[2, 3, 1]
### choice: a
[1, 2, 3]
### choice: b
[2, 1, 3]
### choice: d
[3, 1, 2]

## question: subject-01-q11
```json
{
  "title": "인접 리스트 순회의 시간 복잡도",
  "topics": [
    "graph"
  ],
  "correctChoiceId": "c",
  "type": "mc",
  "id": "subject-01-q11",
  "revision": 3,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2,
  "group": "graph"
}
```
### stem
정점 V개와 간선 E개인 무방향 그래프를 인접 리스트로 저장했다. 모든 정점의 인접 리스트를 처음부터 끝까지 한 번씩 훑는 데 걸리는 시간 복잡도는? 간선이 없는 정점의 빈 리스트도 확인한다.
### choice: c
$O(V + E)$
### choice: a
$O(V)$
### choice: d
$O(V^2 + E^2)$
### choice: b
$O(E)$

## question: subject-01-q12
```json
{
  "title": "무방향 그래프 차수의 합",
  "topics": [
    "graph"
  ],
  "correctChoiceId": "b",
  "type": "mc",
  "id": "subject-01-q12",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2,
  "group": "graph"
}
```
### stem
자기 루프가 없는 무방향 그래프에서 차수가 1, 2, 2, 3이다. 간선 수는?
### choice: c
6개
### choice: a
3개
### choice: d
8개
### choice: b
4개

## question: subject-01-q13
```json
{
  "title": "너비 우선 탐색(BFS)의 방문 순서",
  "topics": [
    "traversal"
  ],
  "correctChoiceId": "c",
  "type": "mc",
  "id": "subject-01-q13",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2,
  "group": "graph"
}
```
### stem
다음 무방향 그래프에서 A부터 BFS를 시작한다. 이웃은 알파벳순으로 큐에 넣고 넣을 때 방문 표시한다. 방문 순서는?

```graph
A - B
A - C
B - D
C - E
```
### choice: b
A C E B D
### choice: a
A B D C E
### choice: d
D B A C E
### choice: c
A B C D E

## question: subject-01-q14
```json
{
  "title": "깊이 우선 탐색(DFS)의 방문 순서",
  "topics": [
    "traversal"
  ],
  "correctChoiceId": "b",
  "type": "mc",
  "id": "subject-01-q14",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2,
  "group": "graph"
}
```
### stem
다음 무방향 그래프에서 A부터 재귀 DFS를 시작한다. 이웃은 알파벳순으로 방문한다. 처음 방문하는 순서는?

```graph
A - B
A - C
B - D
C - E
```
### choice: d
A D B C E
### choice: b
A B D C E
### choice: c
A C E B D
### choice: a
A B C D E

## question: subject-01-q15
```json
{
  "title": "비트마스크의 원소 포함 검사",
  "topics": [
    "bitmask"
  ],
  "correctChoiceId": "a",
  "type": "mc",
  "id": "subject-01-q15",
  "revision": 3,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2,
  "group": "state"
}
```
### stem
i는 0 이상 30 이하이다. mask의 i번째 비트가 켜져 있는지 검사하는 식은?
### choice: b
(mask & (1 << i)) == 0
### choice: a
(mask & (1 << i)) != 0
### choice: d
(mask >> i) == 0
### choice: c
`(mask ^ (1 << i)) == 0`

## question: subject-01-q16
```json
{
  "title": "비트마스크의 원소 제거",
  "topics": [
    "bitmask"
  ],
  "correctChoiceId": "b",
  "type": "mc",
  "id": "subject-01-q16",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2,
  "group": "state"
}
```
### stem
mask에서 i번째 원소만 제거하고 나머지 비트는 유지하는 식은?
### choice: a
mask OR (1 << i)
### choice: c
mask XOR (1 << i)
### choice: d
mask AND (1 << i)
### choice: b
mask AND ~(1 << i)

## question: subject-01-q17
```json
{
  "title": "서로소 집합의 경로 압축",
  "topics": [
    "unionfind"
  ],
  "correctChoiceId": "b",
  "type": "mc",
  "id": "subject-01-q17",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2,
  "group": "state"
}
```
### stem
서로소 집합(Union-Find)의 부모 배열이 `parent[1] = 2`, `parent[2] = 3`, `parent[3] = 3`이다. 화살표는 부모를 가리킨다. 경로 압축을 적용한 `find(1)` 후 `parent[1]`과 `parent[2]`는?

```graph
direction: up
1 -> 2
2 -> 3
```
### choice: b
3과 3
### choice: c
1과 2
### choice: d
3과 2
### choice: a
2와 3

## question: subject-01-q18
```json
{
  "title": "위상정렬이 가능한 그래프",
  "topics": [
    "topology"
  ],
  "correctChoiceId": "a",
  "type": "mc",
  "id": "subject-01-q18",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2,
  "group": "strategy"
}
```
### stem
일반적인 위상정렬로 모든 선후 관계를 만족하는 순서를 구할 수 있는 그래프는?
### choice: c
사이클 없는 무방향 그래프
### choice: a
사이클 없는 방향 그래프
### choice: d
사이클 있는 무방향 그래프
### choice: b
사이클 있는 방향 그래프

## question: subject-01-q19
```json
{
  "title": "탐욕과 백트래킹의 구분",
  "topics": [
    "greedy",
    "backtracking"
  ],
  "correctChoiceId": "a",
  "type": "mc",
  "id": "subject-01-q19",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2,
  "group": "strategy"
}
```
### stem
현재 최선의 선택을 확정하는 방식과 유망하지 않은 분기를 중단하고 되돌아가는 방식을 순서대로 고르면?
### choice: d
탐욕과 분할 정복
### choice: c
분할 정복과 탐욕
### choice: a
탐욕과 백트래킹
### choice: b
백트래킹과 탐욕

## question: subject-01-q20
```json
{
  "title": "이진 탐색 lower bound",
  "topics": [
    "binary"
  ],
  "correctChoiceId": "b",
  "type": "mc",
  "id": "subject-01-q20",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2,
  "group": "search"
}
```
### stem
정렬 배열 [1, 3, 3, 5]에서 3의 lower_bound 인덱스는? 인덱스는 0부터 시작한다.
### choice: d
3
### choice: c
2
### choice: a
0
### choice: b
1

## question: subject-01-q21
```json
{
  "title": "투 포인터의 이동 규칙",
  "topics": [
    "twopointer"
  ],
  "correctChoiceId": "a",
  "type": "mc",
  "id": "subject-01-q21",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2,
  "group": "search"
}
```
### stem
정렬 배열 [1, 4, 6, 9]에서 합 10을 찾는다. 현재 left=0, right=2여서 합 7이다. 다음 이동은?
### choice: c
right를 1 감소
### choice: d
두 포인터 종료
### choice: a
left를 1 증가
### choice: b
left를 1 감소

## question: subject-01-q22
```json
{
  "title": "배로 증가하는 반복의 횟수",
  "topics": [
    "complexity"
  ],
  "group": "cost",
  "acceptedAnswers": [
    "5"
  ],
  "normalization": "trim",
  "type": "short",
  "id": "subject-01-q22",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2
}
```
### stem
i=1에서 시작해 i<32 동안 i*=2를 한다. 반복 횟수를 숫자로 쓰시오.


## question: subject-01-q23
```json
{
  "title": "Java Queue의 빈 큐 조회",
  "topics": [
    "queue"
  ],
  "group": "structures",
  "acceptedAnswers": [
    "peek",
    "peek()"
  ],
  "normalization": "trim",
  "type": "short",
  "id": "subject-01-q23",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2
}
```
### stem
Java Queue에서 제거 없이 조회하고 빈 큐면 null을 반환하는 메서드 이름은?


## question: subject-01-q24
```json
{
  "title": "배열 힙의 자식 인덱스",
  "topics": [
    "tree"
  ],
  "group": "structures",
  "acceptedAnswers": [
    "14"
  ],
  "normalization": "trim",
  "type": "short",
  "id": "subject-01-q24",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2
}
```
### stem
1번 기반 배열의 이진 힙에서 7번 노드의 왼쪽 자식 인덱스는?


## question: subject-01-q25
```json
{
  "title": "조합의 수",
  "topics": [
    "enumeration"
  ],
  "group": "enumeration",
  "acceptedAnswers": [
    "15"
  ],
  "normalization": "trim",
  "type": "short",
  "id": "subject-01-q25",
  "revision": 3,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2
}
```
### stem
서로 다른 6개 중 순서 없이 2개를 선택한다. 경우의 수는?


## question: subject-01-q26
```json
{
  "title": "부분집합의 개수",
  "topics": [
    "enumeration",
    "recursion"
  ],
  "group": "enumeration",
  "acceptedAnswers": [
    "16"
  ],
  "normalization": "trim",
  "type": "short",
  "id": "subject-01-q26",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2
}
```
### stem
서로 다른 원소 4개의 공집합을 포함한 부분집합 개수는?


## question: subject-01-q27
```json
{
  "title": "BFS에 쓰는 자료구조",
  "topics": [
    "traversal"
  ],
  "group": "graph",
  "acceptedAnswers": [
    "큐",
    "Queue",
    "queue"
  ],
  "normalization": "trim",
  "type": "short",
  "id": "subject-01-q27",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 3
}
```
### stem
BFS에서 발견한 정점을 선입선출로 처리하기 위해 사용하는 자료구조는?


## question: subject-01-q28
```json
{
  "title": "왼쪽 시프트 연산 결과",
  "topics": [
    "bitmask"
  ],
  "group": "state",
  "acceptedAnswers": [
    "32"
  ],
  "normalization": "trim",
  "type": "short",
  "id": "subject-01-q28",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 3
}
```
### stem
Java의 1 << 5 결과를 십진수로 쓰시오.


## question: subject-01-q29
```json
{
  "title": "방향 비순환 그래프의 약어",
  "topics": [
    "topology"
  ],
  "group": "strategy",
  "acceptedAnswers": [
    "DAG",
    "dag"
  ],
  "normalization": "trim",
  "type": "short",
  "id": "subject-01-q29",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 3
}
```
### stem
방향이 있고 사이클이 없는 그래프를 나타내는 영문 약어는?


## question: subject-01-q30
```json
{
  "title": "찾는 값이 없을 때의 lower bound",
  "topics": [
    "binary"
  ],
  "group": "search",
  "acceptedAnswers": [
    "2"
  ],
  "normalization": "trim",
  "type": "short",
  "id": "subject-01-q30",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 3
}
```
### stem
배열 [2, 2, 4, 6]에서 3의 lower_bound 인덱스는? 인덱스는 0부터 시작한다.


## question: subject-01-q31
```json
{
  "title": "비트마스크로 방문 상태 표현",
  "topics": [
    "bitmask"
  ],
  "group": "essay",
  "modelAnswer": "i 방문 검사는 (mask & (1 << i)) != 0이다. 추가는 mask |= (1 << i)다. 정수 하나를 대입해 상태를 복사할 수 있다. 다만 가능한 상태 수 2¹⁰개가 줄어드는 것은 아니다.",
  "rubric": [
    {
      "id": "r0",
      "criterion": "AND와 시프트로 방문 여부를 검사한다",
      "points": 1
    },
    {
      "id": "r1",
      "criterion": "OR로 방문 비트를 추가한다",
      "points": 1
    },
    {
      "id": "r2",
      "criterion": "정수 대입으로 상태를 복사할 수 있음을 설명한다",
      "points": 1
    },
    {
      "id": "r3",
      "criterion": "상태 개수 자체는 줄지 않음을 구분한다",
      "points": 1
    }
  ],
  "type": "essay",
  "id": "subject-01-q31",
  "revision": 1,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 3
}
```
### stem
정점 0부터 9까지의 방문 상태를 int로 저장하려 한다. 방문 검사와 추가 방법을 쓰고 배열에 비해 상태 복사에 유리한 이유를 설명하시오.


## question: subject-01-q32
```json
{
  "title": "서로소 집합 경로 압축의 효과",
  "topics": [
    "unionfind"
  ],
  "group": "essay",
  "modelAnswer": "대표는 4다. `find(1)`은 1에서 4까지 올라간 뒤 돌아오며 방문한 1, 2, 3의 부모를 모두 4로 바꾼다. 이후 이 노드의 find는 짧은 경로를 따라간다. 집합 소속은 변하지 않는다. 경로 압축만으로 모든 단일 연산이 $O(1)$이라고 단정하지 않는다.",
  "rubric": [
    {
      "id": "r0",
      "criterion": "대표 4를 찾는 과정을 설명한다",
      "points": 1
    },
    {
      "id": "r1",
      "criterion": "방문 노드의 부모를 4로 갱신한다",
      "points": 1
    },
    {
      "id": "r2",
      "criterion": "이후 탐색 경로가 짧아짐을 설명한다",
      "points": 1
    },
    {
      "id": "r3",
      "criterion": "소속 보존과 복잡도의 조건을 구분한다",
      "points": 1
    }
  ],
  "type": "essay",
  "id": "subject-01-q32",
  "revision": 3,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 3
}
```
### stem
서로소 집합(Union-Find)의 부모 배열이 `parent[1] = 2`, `parent[2] = 3`, `parent[3] = 4`, `parent[4] = 4`인 긴 경로를 이룬다. 화살표는 부모를 가리킨다. 경로 압축을 적용한 `find(1)` 이후의 연결 상태와 이후 find 연산에 미치는 효과를 설명하시오.

```graph
direction: up
1 -> 2
2 -> 3
3 -> 4
```

