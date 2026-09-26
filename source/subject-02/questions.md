## question: subject-02-q01
```json
{
  "title": "독립된 두 입력 크기의 시간 복잡도",
  "topics": [
    "complexity"
  ],
  "correctChoiceId": "a",
  "type": "mc",
  "id": "subject-02-q01",
  "revision": 4,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 1,
  "group": "cost"
}
```
### stem
N과 M은 서로 독립인 입력 크기다. 아래 코드의 시간 복잡도를 빅오 표기법으로 나타내면? 가능한 가장 작은 차수로 답한다.

```java
for (int i = 0; i < N; i++) {
    work();
}
for (int i = 0; i < M; i++) {
    for (int j = 0; j < M; j++) {
        work();
    }
}
```
### choice: c
$O(M^2)$
### choice: a
$O(N + M^2)$
### choice: d
$O(N + M)$
### choice: b
$O(N \times M^2)$

## question: subject-02-q02
```json
{
  "title": "로그 반복이 중첩된 시간 복잡도",
  "topics": [
    "complexity"
  ],
  "correctChoiceId": "c",
  "type": "mc",
  "id": "subject-02-q02",
  "revision": 4,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 1,
  "group": "cost"
}
```
### stem
아래 코드의 시간 복잡도를 빅오 표기법으로 나타내면? 가능한 가장 작은 차수로 답한다.

```java
for (int i = 0; i < N; i++) {
    for (int j = 1; j < N; j *= 2) {
        work();
    }
}
```
### choice: c
$O(N \log N)$
### choice: d
$O(N^2)$
### choice: a
$O(N)$
### choice: b
$O(\log N)$

## question: subject-02-q03
```json
{
  "title": "분할 재귀의 기저 조건",
  "topics": [
    "divide",
    "recursion"
  ],
  "correctChoiceId": "a",
  "type": "mc",
  "id": "subject-02-q03",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 1,
  "group": "cost"
}
```
### stem
[lo, hi)를 절반씩 나누는 재귀에서 빈 구간과 원소 하나의 구간을 종료하는 조건은?
### choice: c
lo == 0
### choice: a
hi - lo <= 1
### choice: b
hi - lo == 2
### choice: d
hi == N

## question: subject-02-q04
```json
{
  "title": "큐 연산 추적",
  "topics": [
    "queue"
  ],
  "correctChoiceId": "c",
  "type": "mc",
  "id": "subject-02-q04",
  "revision": 1,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 1,
  "group": "structures"
}
```
### stem
빈 큐에서 offer(4), offer(7), poll(), offer(2)를 실행했다. 다음 peek()의 반환값은?
### choice: b
4
### choice: d
null
### choice: a
2
### choice: c
7

## question: subject-02-q05
```json
{
  "title": "이진 트리의 후위 순회",
  "topics": [
    "tree"
  ],
  "correctChoiceId": "c",
  "type": "mc",
  "id": "subject-02-q05",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 1,
  "group": "structures"
}
```
### stem
다음 이진 트리를 후위 순회한 방문 순서는?

```tree
R L M
```
### choice: b
L R M
### choice: d
M R L
### choice: c
L M R
### choice: a
R L M

## question: subject-02-q06
```json
{
  "title": "최소 힙의 부모와 자식 조건",
  "topics": [
    "tree"
  ],
  "correctChoiceId": "a",
  "type": "mc",
  "id": "subject-02-q06",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 1,
  "group": "structures"
}
```
### stem
다음은 최소 힙의 일부인 부모와 두 자식이다. 이 세 노드의 힙 대소 조건에 대한 판단은?

```tree
3 8 5
```
### choice: b
왼쪽이 더 크므로 조건 위반이다
### choice: c
자식의 차가 1이 아니라 위반이다
### choice: a
부모가 두 자식 이하라 유효하다
### choice: d
자식 두 값이 달라 조건 위반이다

## question: subject-02-q07
```json
{
  "title": "0번 인덱스 기반 힙의 자식 인덱스",
  "topics": [
    "tree"
  ],
  "correctChoiceId": "b",
  "type": "mc",
  "id": "subject-02-q07",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 1,
  "group": "structures"
}
```
### stem
0번 인덱스 기반 이진 힙에서 인덱스 4의 왼쪽 자식 인덱스는? 자식은 존재한다.
### choice: a
8
### choice: c
10
### choice: d
2
### choice: b
9

## question: subject-02-q08
```json
{
  "title": "부분집합 재귀의 완성 시점",
  "topics": [
    "recursion",
    "enumeration"
  ],
  "correctChoiceId": "a",
  "type": "mc",
  "id": "subject-02-q08",
  "revision": 3,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 1,
  "group": "enumeration"
}
```
### stem
원소마다 선택/미선택을 결정한다. 재귀 깊이 d는 결정한 원소 수다. 완성된 부분집합을 처리하는 시점은?
### choice: a
d가 N에 도달했을 때
### choice: b
첫 원소를 선택했을 때
### choice: c
현재 합이 양수가 될 때
### choice: d
미선택 분기를 시작할 때

## question: subject-02-q09
```json
{
  "title": "중복 값이 있는 사전순 다음 순열",
  "topics": [
    "enumeration"
  ],
  "correctChoiceId": "b",
  "type": "mc",
  "id": "subject-02-q09",
  "revision": 4,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 1,
  "group": "enumeration"
}
```
### stem
[1, 1, 2]에서 시작해 사전순 다음 순열(Next Permutation)을 더 없을 때까지 반복해 구한다. 시작 배열을 포함한 서로 다른 배열 상태 수는?
### choice: b
3개
### choice: a
2개
### choice: d
8개
### choice: c
6개

## question: subject-02-q10
```json
{
  "title": "순서가 있는 선택의 수",
  "topics": [
    "enumeration"
  ],
  "correctChoiceId": "b",
  "type": "mc",
  "id": "subject-02-q10",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 1,
  "group": "enumeration"
}
```
### stem
서로 다른 5명 중 회장과 부회장을 한 명씩 정한다. 겸임할 수 없을 때 경우의 수는?
### choice: a
10가지
### choice: c
25가지
### choice: b
20가지
### choice: d
32가지

## question: subject-02-q11
```json
{
  "title": "인접 행렬의 간선 조회 시간",
  "topics": [
    "graph"
  ],
  "correctChoiceId": "a",
  "type": "mc",
  "id": "subject-02-q11",
  "revision": 4,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2,
  "group": "graph"
}
```
### stem
인접 행렬에서 정점 u와 v 사이 간선 존재 여부 한 번을 확인하는 시간은? 가능한 가장 작은 차수로 답한다.
### choice: d
$O(V^2)$
### choice: c
$O(V)$
### choice: a
$O(1)$
### choice: b
$O(\log V)$

## question: subject-02-q12
```json
{
  "title": "Kahn 위상정렬의 진입 차수 갱신",
  "topics": [
    "graph",
    "topology"
  ],
  "correctChoiceId": "b",
  "type": "mc",
  "id": "subject-02-q12",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2,
  "group": "graph"
}
```
### stem
다음 방향 그래프에 Kahn 위상정렬을 적용한다. A만 제거한 직후 C의 진입 차수는?

```graph
A -> C
B -> C
C -> D
```
### choice: a
0
### choice: b
1
### choice: d
3
### choice: c
2

## question: subject-02-q13
```json
{
  "title": "BFS의 방문 표시 시점",
  "topics": [
    "traversal"
  ],
  "correctChoiceId": "a",
  "type": "mc",
  "id": "subject-02-q13",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2,
  "group": "graph"
}
```
### stem
같은 정점이 큐에 중복 삽입되는 일을 막는 표준 BFS 방문 표시 시점은?
### choice: d
간선을 입력할 때 표시한다
### choice: a
큐에 넣을 때 표시한다
### choice: c
탐색이 끝난 뒤 표시한다
### choice: b
큐에서 꺼낸 뒤 표시한다

## question: subject-02-q14
```json
{
  "title": "DFS 후위 기록의 의미",
  "topics": [
    "traversal",
    "recursion"
  ],
  "correctChoiceId": "b",
  "type": "mc",
  "id": "subject-02-q14",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2,
  "group": "graph"
}
```
### stem
재귀 DFS에서 자식을 모두 방문한 다음 현재 정점을 기록한다. 이 기록은 무엇을 나타내는가?
### choice: d
시작점 거리 오름차순
### choice: a
너비별 발견 순서
### choice: c
정점 번호 오름차순
### choice: b
재귀 호출 종료 순서

## question: subject-02-q15
```json
{
  "title": "비트 XOR 연산",
  "topics": [
    "bitmask"
  ],
  "correctChoiceId": "a",
  "type": "mc",
  "id": "subject-02-q15",
  "revision": 3,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2,
  "group": "state"
}
```
### stem
mask=0에서 mask XOR (1 << 2)를 계산했다. 결과는?
### choice: b
2번 비트가 꺼진다
### choice: c
모든 비트가 켜진다
### choice: a
2번 비트가 켜진다
### choice: d
1번 비트가 켜진다

## question: subject-02-q16
```json
{
  "title": "비트마스크 상태 압축의 장점",
  "topics": [
    "bitmask"
  ],
  "correctChoiceId": "a",
  "type": "mc",
  "id": "subject-02-q16",
  "revision": 3,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2,
  "group": "state"
}
```
### stem
원소 20개의 포함 여부를 int 비트로 저장한다. 실제 장점은?
### choice: c
탐색 순서가 자동 정렬된다
### choice: a
대입으로 상태 복사가 가능하다
### choice: d
전체 탐색이 선형으로 끝난다
### choice: b
부분집합이 20개로 줄어든다

## question: subject-02-q17
```json
{
  "title": "서로소 집합의 같은 집합 판정",
  "topics": [
    "unionfind"
  ],
  "correctChoiceId": "a",
  "type": "mc",
  "id": "subject-02-q17",
  "revision": 3,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2,
  "group": "state"
}
```
### stem
a와 b가 같은 집합인지 판단하는 올바른 검사는?
### choice: d
두 노드의 트리 깊이 비교
### choice: b
a와 b의 노드 번호 비교
### choice: c
parent[a]와 parent[b] 비교
### choice: a
find(a)와 find(b) 비교

## question: subject-02-q18
```json
{
  "title": "위상정렬 실패의 의미",
  "topics": [
    "topology"
  ],
  "correctChoiceId": "a",
  "type": "mc",
  "id": "subject-02-q18",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2,
  "group": "strategy"
}
```
### stem
6개 정점을 모두 초기화한 Kahn 알고리즘이 4개만 꺼낸 뒤 멈췄다. 확실한 사실은?
### choice: a
방향 사이클이 존재한다
### choice: b
모든 정점의 차수가 0이다
### choice: c
위상정렬이 정상 완료됐다
### choice: d
그래프에 간선이 전혀 없다

## question: subject-02-q19
```json
{
  "title": "음수가 있을 때의 가지치기",
  "topics": [
    "backtracking",
    "greedy"
  ],
  "correctChoiceId": "a",
  "type": "mc",
  "id": "subject-02-q19",
  "revision": 3,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2,
  "group": "strategy"
}
```
### stem
목표 합 5를 찾는다. 현재 합은 7이고 남은 원소에 -2가 있다. 현재 합이 목표를 넘으면 분기를 버리는 가지치기에 대한 판단으로 옳은 것은?
### choice: b
이 입력에서도 안전한 판단이다
### choice: a
유효한 답을 버릴 수 있다
### choice: d
중복된 해를 만들어 낸다
### choice: c
탐색 순서만 달라진다

## question: subject-02-q20
```json
{
  "title": "반열린 구간 lower bound의 갱신",
  "topics": [
    "binary"
  ],
  "correctChoiceId": "a",
  "type": "mc",
  "id": "subject-02-q20",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2,
  "group": "search"
}
```
### stem
lower_bound의 구간은 [lo, hi)다. a[mid] < target이면 어떤 갱신을 하는가?
### choice: d
hi = mid
### choice: b
lo = mid
### choice: c
hi = mid + 1
### choice: a
lo = mid + 1

## question: subject-02-q21
```json
{
  "title": "음수가 있는 배열과 슬라이딩 윈도우",
  "topics": [
    "twopointer"
  ],
  "correctChoiceId": "a",
  "type": "mc",
  "id": "subject-02-q21",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2,
  "group": "search"
}
```
### stem
양수 배열의 합을 위한 슬라이딩 윈도우를 음수 배열에 그대로 쓸 수 없는 이유는?
### choice: c
원소 크기 비교가 불가능하다
### choice: a
확장하면 합이 줄 수 있다
### choice: d
배열 길이가 자동으로 늘어난다
### choice: b
인덱스가 자동으로 사라진다

## question: subject-02-q22
```json
{
  "title": "절반으로 줄어드는 반복의 횟수",
  "topics": [
    "complexity"
  ],
  "group": "cost",
  "acceptedAnswers": [
    "7"
  ],
  "normalization": "trim",
  "type": "short",
  "id": "subject-02-q22",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2
}
```
### stem
i=64에서 i>0 동안 i/=2를 하는 정수 루프의 실행 횟수는?


## question: subject-02-q23
```json
{
  "title": "Java Queue의 제거 메서드",
  "topics": [
    "queue"
  ],
  "group": "structures",
  "acceptedAnswers": [
    "poll",
    "poll()"
  ],
  "normalization": "trim",
  "type": "short",
  "id": "subject-02-q23",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2
}
```
### stem
Java Queue에서 원소를 제거해 반환하며 빈 큐일 때 null인 메서드는?


## question: subject-02-q24
```json
{
  "title": "트리 루트의 깊이",
  "topics": [
    "tree"
  ],
  "group": "structures",
  "acceptedAnswers": [
    "0"
  ],
  "normalization": "trim",
  "type": "short",
  "id": "subject-02-q24",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2
}
```
### stem
깊이를 루트에서부터의 간선 수로 정의할 때 루트 깊이는?


## question: subject-02-q25
```json
{
  "title": "중복 순열의 수",
  "topics": [
    "enumeration"
  ],
  "group": "enumeration",
  "acceptedAnswers": [
    "9"
  ],
  "normalization": "trim",
  "type": "short",
  "id": "subject-02-q25",
  "revision": 3,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2
}
```
### stem
서로 다른 숫자 3개로 길이 2인 수열을 만든다. 같은 숫자를 여러 번 써도 되고 순서가 다르면 다른 수열이다. 만들 수 있는 수열의 수는?


## question: subject-02-q26
```json
{
  "title": "사전순 다음 순열의 피벗",
  "topics": [
    "enumeration"
  ],
  "group": "enumeration",
  "acceptedAnswers": [
    "1"
  ],
  "normalization": "trim",
  "type": "short",
  "id": "subject-02-q26",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2
}
```
### stem
[1, 4, 3, 2]의 사전순 다음 순열(Next Permutation)을 구할 때 오른쪽에서 찾는 상승 지점의 왼쪽 값은?


## question: subject-02-q27
```json
{
  "title": "무방향 그래프 차수 합과 간선 수",
  "topics": [
    "graph"
  ],
  "group": "graph",
  "acceptedAnswers": [
    "7"
  ],
  "normalization": "trim",
  "type": "short",
  "id": "subject-02-q27",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 3
}
```
### stem
자기 루프 없는 무방향 그래프의 차수 합이 14다. 간선 수는?


## question: subject-02-q28
```json
{
  "title": "서로소 집합의 대표 비교",
  "topics": [
    "unionfind"
  ],
  "group": "state",
  "acceptedAnswers": [
    "예"
  ],
  "normalization": "trim",
  "type": "short",
  "id": "subject-02-q28",
  "revision": 3,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 3
}
```
### stem
`find(a)`와 `find(b)`가 모두 5를 반환한다. a와 b는 같은 집합인가? 예 또는 아니오로 쓰시오.


## question: subject-02-q29
```json
{
  "title": "위상정렬의 초기 진입 차수",
  "topics": [
    "topology"
  ],
  "group": "strategy",
  "acceptedAnswers": [
    "2"
  ],
  "normalization": "trim",
  "type": "short",
  "id": "subject-02-q29",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 3
}
```
### stem
다음 방향 그래프에서 C의 초기 진입 차수는?

```graph
A -> B
A -> C
B -> C
```


## question: subject-02-q30
```json
{
  "title": "모든 값보다 큰 목표의 lower bound",
  "topics": [
    "binary"
  ],
  "group": "search",
  "acceptedAnswers": [
    "3"
  ],
  "normalization": "trim",
  "type": "short",
  "id": "subject-02-q30",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 3
}
```
### stem
[1, 2, 3]에서 target=4의 lower_bound 반환 인덱스는?


## question: subject-02-q31
```json
{
  "title": "비트 토글을 제거로 쓸 때의 문제",
  "topics": [
    "bitmask"
  ],
  "group": "essay",
  "modelAnswer": "XOR는 비트를 반전하므로 꺼진 비트를 오히려 켠다. 제거에는 mask &= ~(1 << i)를 쓴다. 대상 비트만 0이고 다른 비트는 1인 값과 AND하므로 다른 방문 상태를 보존하며 두 번 제거해도 결과가 같다.",
  "rubric": [
    {
      "id": "r0",
      "criterion": "XOR가 반전임을 설명한다",
      "points": 1
    },
    {
      "id": "r1",
      "criterion": "미방문 비트가 켜지는 반례를 든다",
      "points": 1
    },
    {
      "id": "r2",
      "criterion": "AND와 NOT를 사용한 제거식을 제시한다",
      "points": 1
    },
    {
      "id": "r3",
      "criterion": "다른 비트 보존 또는 반복 제거의 안전성을 설명한다",
      "points": 1
    }
  ],
  "type": "essay",
  "id": "subject-02-q31",
  "revision": 3,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 3
}
```
### stem
방문 해제를 `mask ^= (1 << i)`로 구현했다. i가 방문되지 않았을 때의 문제를 설명하고 안전한 제거식을 제시하시오.


## question: subject-02-q32
```json
{
  "title": "서로소 집합의 대표 비교와 부모 비교",
  "topics": [
    "unionfind"
  ],
  "group": "essay",
  "modelAnswer": "직접 부모가 달라도 최종 대표는 같을 수 있다. a→x→r이고 b→r이면 parent는 다르지만 같은 집합이다. find(a)와 find(b)의 결과를 비교해야 한다. 경로 압축은 방문 노드를 대표에 연결해 이후 조회를 줄인다.",
  "rubric": [
    {
      "id": "r0",
      "criterion": "직접 부모와 대표가 다름을 구분한다",
      "points": 1
    },
    {
      "id": "r1",
      "criterion": "같은 대표로 이어지는 반례를 제시한다",
      "points": 1
    },
    {
      "id": "r2",
      "criterion": "find 결과를 비교한다",
      "points": 1
    },
    {
      "id": "r3",
      "criterion": "경로 압축이 향후 탐색에 주는 효과를 설명한다",
      "points": 1
    }
  ],
  "type": "essay",
  "id": "subject-02-q32",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 3
}
```
### stem
parent[a]와 parent[b]가 다르다는 이유만으로 서로 다른 집합이라고 판단했다. 왜 틀릴 수 있는지와 find의 역할을 설명하시오.

