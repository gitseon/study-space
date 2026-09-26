## question: subject-03-q01
```json
{
  "title": "재귀 호출 수",
  "topics": [
    "complexity",
    "recursion"
  ],
  "correctChoiceId": "c",
  "type": "mc",
  "id": "subject-03-q01",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 1,
  "group": "cost"
}
```
### stem
$f(n)$은 $n = 0$에서 끝나고 그 외에는 $f(n-1)$을 두 번 호출한다. 호출당 추가 작업은 $O(1)$이다. 총 실행 시간을 $\Theta$ 표기로 나타내면?
### choice: d
$\Theta(n^2)$
### choice: b
$\Theta(n \log n)$
### choice: c
$\Theta(2^n)$
### choice: a
$\Theta(n)$

## question: subject-03-q02
```json
{
  "title": "부분 구간의 합",
  "topics": [
    "complexity"
  ],
  "correctChoiceId": "c",
  "type": "mc",
  "id": "subject-03-q02",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 1,
  "group": "cost"
}
```
### stem
아래 코드에서 j는 외부 반복마다 초기화되지 않는다. 전체 work() 횟수의 차수는?
```java
int j = 0;
for (int i = 0; i < N; i++) {
    while (j < N) {
        work();
        j++;
    }
}
```
### choice: b
$\Theta(\log N)$
### choice: d
$\Theta(N^2)$
### choice: a
$\Theta(1)$
### choice: c
$\Theta(N)$

## question: subject-03-q03
```json
{
  "title": "병합 단계 추론",
  "topics": [
    "divide",
    "complexity"
  ],
  "correctChoiceId": "a",
  "type": "mc",
  "id": "subject-03-q03",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 1,
  "group": "cost"
}
```
### stem
길이 N인 두 정렬 배열을 포인터 두 개로 병합한다. 결과 길이는 2N이다. 시간과 추가 결과 공간은?
### choice: a
시간 $\Theta(N)$ 공간 $\Theta(N)$
### choice: c
시간 $\Theta(N)$ 공간 $\Theta(1)$
### choice: b
시간 $\Theta(N^2)$ 공간 $\Theta(N)$
### choice: d
시간 $\Theta(\log N)$ 공간 $\Theta(N)$

## question: subject-03-q04
```json
{
  "title": "큐와 스택의 차이",
  "topics": [
    "queue"
  ],
  "correctChoiceId": "a",
  "type": "mc",
  "id": "subject-03-q04",
  "revision": 1,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 1,
  "group": "structures"
}
```
### stem
1, 2, 3을 차례로 넣은 뒤 모두 꺼낸다. 큐와 스택의 출력 순서는?
### choice: b
큐 3 2 1 / 스택 1 2 3
### choice: c
큐 1 3 2 / 스택 3 1 2
### choice: d
큐 2 1 3 / 스택 2 3 1
### choice: a
큐 1 2 3 / 스택 3 2 1

## question: subject-03-q05
```json
{
  "title": "BST의 순회",
  "topics": [
    "tree"
  ],
  "correctChoiceId": "a",
  "type": "mc",
  "id": "subject-03-q05",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 1,
  "group": "structures"
}
```
### stem
중복 키가 없는 이진 탐색 트리를 중위 순회하면 얻는 순서는?
### choice: a
키의 오름차순
### choice: c
깊이의 오름차순
### choice: b
키의 내림차순
### choice: d
삽입된 순서

## question: subject-03-q06
```json
{
  "title": "힙의 최솟값 삭제",
  "topics": [
    "tree"
  ],
  "correctChoiceId": "a",
  "type": "mc",
  "id": "subject-03-q06",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 1,
  "group": "structures"
}
```
### stem
배열 기반 최소 힙에서 루트를 삭제하고 마지막 원소를 루트로 옮겼다. 이어서 하는 표준 작업은?
### choice: b
큰 자식과 비교하며 올라간다
### choice: c
배열 전체를 매번 뒤집는다
### choice: a
작은 자식과 비교하며 내려간다
### choice: d
부모 값만 0으로 덮어쓴다

## question: subject-03-q07
```json
{
  "title": "완전 이진 트리 판단",
  "topics": [
    "tree"
  ],
  "correctChoiceId": "a",
  "type": "mc",
  "id": "subject-03-q07",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 1,
  "group": "structures"
}
```
### stem
모든 레벨이 꽉 찼고 마지막 레벨만 왼쪽부터 빈칸 없이 채운 트리의 이름은?
### choice: a
완전 이진 트리
### choice: d
방향 비순환 그래프
### choice: b
이진 탐색 트리
### choice: c
최소 신장 트리

## question: subject-03-q08
```json
{
  "title": "선택 순서의 수",
  "topics": [
    "enumeration"
  ],
  "correctChoiceId": "b",
  "type": "mc",
  "id": "subject-03-q08",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 1,
  "group": "enumeration"
}
```
### stem
4개 작업을 모두 나열하되 A가 B보다 앞에 오도록 한다. 작업은 서로 다르다. 유효한 순서 수는?
### choice: a
6가지
### choice: c
18가지
### choice: b
12가지
### choice: d
24가지

## question: subject-03-q09
```json
{
  "title": "재귀의 인수 변화",
  "topics": [
    "recursion",
    "enumeration"
  ],
  "correctChoiceId": "a",
  "type": "mc",
  "id": "subject-03-q09",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 1,
  "group": "enumeration"
}
```
### stem
N개 원소의 부분집합을 생성할 때 다음 깊이로 가는 선택과 미선택 호출에 공통으로 필요한 변화는?
### choice: d
처리 인덱스를 0으로 돌린다
### choice: a
처리 인덱스를 1 증가시킨다
### choice: b
원소 값을 모두 1 증가시킨다
### choice: c
배열 길이를 매번 2배 한다

## question: subject-03-q10
```json
{
  "title": "마지막 순열",
  "topics": [
    "enumeration"
  ],
  "correctChoiceId": "a",
  "type": "mc",
  "id": "subject-03-q10",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 1,
  "group": "enumeration"
}
```
### stem
[4, 3, 2, 1]에 next_permutation을 적용한다. 사전순으로 더 큰 순열의 존재 여부는?
### choice: d
정확히 네 개 있다
### choice: b
정확히 하나 있다
### choice: a
더 큰 순열은 없다
### choice: c
정확히 두 개 있다

## question: subject-03-q11
```json
{
  "title": "전체 탐색의 비용",
  "topics": [
    "graph",
    "traversal"
  ],
  "correctChoiceId": "a",
  "type": "mc",
  "id": "subject-03-q11",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2,
  "group": "graph"
}
```
### stem
모든 정점을 방문하는 표준 BFS에서 인접 행렬과 인접 리스트의 최악 시간 차수는?
### choice: a
$O(V^2)$와 $O(V+E)$
### choice: c
$O(V)$와 $O(E^2)$
### choice: d
$O(E)$와 $O(\log V)$
### choice: b
$O(V+E)$와 $O(V^2)$

## question: subject-03-q12
```json
{
  "title": "방향 그래프의 차수",
  "topics": [
    "graph"
  ],
  "correctChoiceId": "a",
  "type": "mc",
  "id": "subject-03-q12",
  "revision": 1,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2,
  "group": "graph"
}
```
### stem
방향 간선 7개가 있는 그래프에서 모든 정점의 진입 차수 합과 진출 차수 합은?
### choice: d
합을 알 수 없다
### choice: a
각각 7이다
### choice: b
각각 14이다
### choice: c
각각 21이다

## question: subject-03-q13
```json
{
  "title": "BFS 최단 거리 조건",
  "topics": [
    "traversal"
  ],
  "correctChoiceId": "a",
  "type": "mc",
  "id": "subject-03-q13",
  "revision": 1,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2,
  "group": "graph"
}
```
### stem
BFS가 최초 발견 거리로 최단 경로의 비용을 보장하는 대표적인 조건은?
### choice: b
모든 정점 차수가 같다
### choice: a
모든 간선 비용이 같다
### choice: d
모든 경로 길이가 다르다
### choice: c
모든 정점 번호가 연속이다

## question: subject-03-q14
```json
{
  "title": "비연결 그래프 탐색",
  "topics": [
    "traversal",
    "graph"
  ],
  "correctChoiceId": "a",
  "type": "mc",
  "id": "subject-03-q14",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2,
  "group": "graph"
}
```
### stem
그래프 전체의 연결 요소를 DFS로 찾는다. 한 시작점 DFS가 끝난 후 해야 할 작업은?
### choice: a
미방문 정점에서 다시 시작한다
### choice: d
처음 시작점에서 다시 시작한다
### choice: c
모든 간선 방향을 반대로 바꾼다
### choice: b
방문 배열 전체를 즉시 지운다

## question: subject-03-q15
```json
{
  "title": "부분집합 상태 수",
  "topics": [
    "bitmask"
  ],
  "correctChoiceId": "c",
  "type": "mc",
  "id": "subject-03-q15",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2,
  "group": "state"
}
```
### stem
6개의 독립적인 포함 여부를 비트로 나타낸다. 공집합을 포함한 상태 수는?
### choice: c
64개
### choice: a
12개
### choice: d
720개
### choice: b
32개

## question: subject-03-q16
```json
{
  "title": "비트 연산 추적",
  "topics": [
    "bitmask"
  ],
  "correctChoiceId": "b",
  "type": "mc",
  "id": "subject-03-q16",
  "revision": 1,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2,
  "group": "state"
}
```
### stem
mask의 이진 표현은 0101이다. 1번 비트를 추가한 뒤 2번 비트를 제거하면? 0번은 맨 오른쪽이다.
### choice: d
0100
### choice: a
0001
### choice: b
0011
### choice: c
0111

## question: subject-03-q17
```json
{
  "title": "압축 후 집합 의미",
  "topics": [
    "unionfind"
  ],
  "correctChoiceId": "a",
  "type": "mc",
  "id": "subject-03-q17",
  "revision": 1,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2,
  "group": "state"
}
```
### stem
Union-Find의 경로 압축으로 바뀌는 것과 유지되는 것을 올바르게 고르면?
### choice: b
집합 소속 변경 / 부모 연결 유지
### choice: a
부모 연결 변경 / 집합 소속 유지
### choice: c
원소 번호 변경 / 집합 소속 유지
### choice: d
모든 집합 병합 / 원소 개수 유지

## question: subject-03-q18
```json
{
  "title": "여러 위상정렬",
  "topics": [
    "topology"
  ],
  "correctChoiceId": "b",
  "type": "mc",
  "id": "subject-03-q18",
  "revision": 1,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2,
  "group": "strategy"
}
```
### stem
간선이 A→C, B→C뿐이다. 가능한 위상정렬 순서의 수는?
### choice: c
3가지
### choice: a
1가지
### choice: d
6가지
### choice: b
2가지

## question: subject-03-q19
```json
{
  "title": "탐욕의 반례",
  "topics": [
    "greedy",
    "backtracking"
  ],
  "correctChoiceId": "a",
  "type": "mc",
  "id": "subject-03-q19",
  "revision": 1,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2,
  "group": "strategy"
}
```
### stem
동전 1, 4, 6으로 8을 만든다. 큰 동전부터 고르는 결과와 최소 동전 수는?
### choice: d
탐욕 2개 / 최소 2개
### choice: a
탐욕 3개 / 최소 2개
### choice: c
탐욕 3개 / 최소 3개
### choice: b
탐욕 2개 / 최소 3개

## question: subject-03-q20
```json
{
  "title": "목표가 없는 이진 탐색",
  "topics": [
    "binary"
  ],
  "correctChoiceId": "d",
  "type": "mc",
  "id": "subject-03-q20",
  "revision": 1,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2,
  "group": "search"
}
```
### stem
[2, 4, 7]에서 target=9의 lower_bound를 구한다. 탐색 구간은 [0, 3)이고 반환값은 인덱스다. 결과는?
### choice: a
0
### choice: b
1
### choice: c
2
### choice: d
3

## question: subject-03-q21
```json
{
  "title": "포인터의 총 이동",
  "topics": [
    "twopointer"
  ],
  "correctChoiceId": "c",
  "type": "mc",
  "id": "subject-03-q21",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2,
  "group": "search"
}
```
### stem
N개 양수 배열에서 left와 right가 각각 오른쪽으로만 이동하고 되돌아가지 않는다. 두 포인터의 총 이동 횟수 차수는?
### choice: c
$O(N)$
### choice: d
$O(N^2)$
### choice: b
$O(\log N)$
### choice: a
$O(1)$

## question: subject-03-q22
```json
{
  "title": "순차 비용의 지배항",
  "topics": [
    "complexity"
  ],
  "group": "cost",
  "acceptedAnswers": [
    "2"
  ],
  "normalization": "trim",
  "type": "short",
  "id": "subject-03-q22",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2
}
```
### stem
$O(N^2)$ 작업 뒤에 $O(N)$ 작업을 실행한다. 전체의 상한을 $O(N^k)$로 정리할 때 가장 작은 양의 정수 k는? 첫 작업은 실제로 $\Theta(N^2)$이다.


## question: subject-03-q23
```json
{
  "title": "큐의 추적 결과",
  "topics": [
    "queue"
  ],
  "group": "structures",
  "acceptedAnswers": [
    "5"
  ],
  "normalization": "trim",
  "type": "short",
  "id": "subject-03-q23",
  "revision": 1,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2
}
```
### stem
빈 큐에 8, 3, 5를 순서대로 넣고 두 번 꺼냈다. 맨 앞 값은?


## question: subject-03-q24
```json
{
  "title": "트리 간선 수",
  "topics": [
    "tree"
  ],
  "group": "structures",
  "acceptedAnswers": [
    "8"
  ],
  "normalization": "trim",
  "type": "short",
  "id": "subject-03-q24",
  "revision": 1,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2
}
```
### stem
노드 9개인 트리의 간선 수는?


## question: subject-03-q25
```json
{
  "title": "순열 수",
  "topics": [
    "enumeration"
  ],
  "group": "enumeration",
  "acceptedAnswers": [
    "120"
  ],
  "normalization": "trim",
  "type": "short",
  "id": "subject-03-q25",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2
}
```
### stem
서로 다른 원소 5개를 모두 나열하는 순열 수는?


## question: subject-03-q26
```json
{
  "title": "정확히 두 비트",
  "topics": [
    "enumeration",
    "bitmask"
  ],
  "group": "enumeration",
  "acceptedAnswers": [
    "6"
  ],
  "normalization": "trim",
  "type": "short",
  "id": "subject-03-q26",
  "revision": 1,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 2
}
```
### stem
4비트 상태 중 정확히 두 비트만 1인 상태 수는?


## question: subject-03-q27
```json
{
  "title": "방향 차수 합",
  "topics": [
    "graph"
  ],
  "group": "graph",
  "acceptedAnswers": [
    "11"
  ],
  "normalization": "trim",
  "type": "short",
  "id": "subject-03-q27",
  "revision": 1,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 3
}
```
### stem
방향 간선이 11개다. 모든 정점의 진출 차수 합은?


## question: subject-03-q28
```json
{
  "title": "비트 제거 결과",
  "topics": [
    "bitmask"
  ],
  "group": "state",
  "acceptedAnswers": [
    "12"
  ],
  "normalization": "trim",
  "type": "short",
  "id": "subject-03-q28",
  "revision": 1,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 3
}
```
### stem
이진수 1110에서 1번 비트를 제거한 결과를 십진수로 쓰시오. 맨 오른쪽이 0번이다.


## question: subject-03-q29
```json
{
  "title": "동전 반례",
  "topics": [
    "greedy"
  ],
  "group": "strategy",
  "acceptedAnswers": [
    "2"
  ],
  "normalization": "trim",
  "type": "short",
  "id": "subject-03-q29",
  "revision": 1,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 3
}
```
### stem
동전 1, 4, 6으로 금액 8을 만들 때 필요한 최소 동전 개수는?


## question: subject-03-q30
```json
{
  "title": "합이 클 때 이동",
  "topics": [
    "twopointer"
  ],
  "group": "search",
  "acceptedAnswers": [
    "right"
  ],
  "normalization": "trim",
  "type": "short",
  "id": "subject-03-q30",
  "revision": 1,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 3
}
```
### stem
오름차순 배열의 양 끝 투 포인터에서 현재 합이 목표보다 크다. 줄여야 하는 포인터 이름을 left 또는 right로 쓰시오.


## question: subject-03-q31
```json
{
  "title": "집합 상태 압축의 한계",
  "topics": [
    "bitmask"
  ],
  "group": "essay",
  "modelAnswer": "고정 폭 정수 범위에서 원소 검사와 상태 복사는 간단해진다. 그러나 각 원소의 포함 여부가 독립적이므로 상태 수는 $2^N$개다. 모든 상태를 열거하면 적어도 $\\Omega(2^N)$의 작업이 필요하다. N이 정수 비트 폭보다 크면 추가 표현도 필요하다.",
  "rubric": [
    {
      "id": "r0",
      "criterion": "상태 복사와 비트 검사의 장점을 설명한다",
      "points": 1
    },
    {
      "id": "r1",
      "criterion": "상태 개수 $2^N$을 제시한다",
      "points": 1
    },
    {
      "id": "r2",
      "criterion": "전체 열거 비용이 선형이 아님을 설명한다",
      "points": 1
    },
    {
      "id": "r3",
      "criterion": "자료형의 비트 폭 한계를 언급한다",
      "points": 1
    }
  ],
  "type": "essay",
  "id": "subject-03-q31",
  "revision": 2,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 3
}
```
### stem
원소 N개의 부분집합을 비트마스크로 표현하면 전체 부분집합 탐색도 $O(N)$이 된다는 주장을 평가하시오. 표현의 장점과 한계를 함께 쓰시오.


## question: subject-03-q32
```json
{
  "title": "경로 압축과 합치기 기준",
  "topics": [
    "unionfind"
  ],
  "group": "essay",
  "modelAnswer": "경로 압축은 find로 방문한 경로를 대표에 직접 연결한다. 크기 기준 union은 작은 트리를 큰 트리 밑에 붙여 불필요한 높이 증가를 줄인다. 연결 여부는 두 find의 대표를 비교한다. 두 최적화를 함께 쓰면 연산열의 상환 비용이 매우 작지만 모든 단일 호출이 엄밀한 상수 시간인 것은 아니다.",
  "rubric": [
    {
      "id": "r0",
      "criterion": "find 중 부모 연결을 압축함을 설명한다",
      "points": 1
    },
    {
      "id": "r1",
      "criterion": "작은 집합을 큰 집합 아래로 합친다",
      "points": 1
    },
    {
      "id": "r2",
      "criterion": "대표를 비교해 연결 여부를 판단한다",
      "points": 1
    },
    {
      "id": "r3",
      "criterion": "상환 복잡도와 개별 최악 비용을 구분한다",
      "points": 1
    }
  ],
  "type": "essay",
  "id": "subject-03-q32",
  "revision": 1,
  "sourceRefs": [
    "https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2"
  ],
  "difficulty": 3
}
```
### stem
경로 압축과 크기 기준 union을 함께 사용할 때 각각 무엇을 개선하는지 설명하시오. 두 원소의 연결 여부는 어떻게 검사하는가?

