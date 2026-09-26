## question: subject-01-q01
### solution
두 작업은 차례로 실행되므로 횟수를 더해 $N + \log_2 N$번이다. 빅오 표기에서는 가장 크게 증가하는 항만 남기고 계수와 로그의 밑은 버리므로 $O(N)$이다.
### choice-explanation: a
첫 작업을 누락했다.
### choice-explanation: b
$N + \log N$에서 가장 크게 증가하는 항은 N이다.
### choice-explanation: c
중첩이 아닌 순차 실행이므로 곱하지 않는다.
### choice-explanation: d
반복 횟수를 제곱할 근거가 없다.

## question: subject-01-q02
### solution
내부 반복은 차례로 1번부터 5번 실행된다. 일반 N에서는 $\frac{N(N+1)}{2}$번으로 $O(N^2)$이다.
### choice-explanation: a
1부터 4까지만 합친 값이다.
### choice-explanation: b
1+2+3+4+5의 합이다.
### choice-explanation: c
내부 반복 길이를 4로 고정했다.
### choice-explanation: d
내부 반복 길이를 5로 고정했다.

## question: subject-01-q03
### solution
solve는 구간을 절반으로 나눠 두 번 호출한 뒤 현재 구간 길이만큼 `work()`를 호출한다. 재귀 깊이는 $\log_2 N$이고 같은 깊이의 구간 길이를 모두 더하면 N이다. 따라서 `work()`는 $N \log_2 N$번 호출되어 $O(N \log N)$이다.
### choice-explanation: a
재귀 깊이만 셌다.
### choice-explanation: b
깊이마다 생기는 N번의 반복을 한 번만 셌다.
### choice-explanation: c
깊이마다 N번씩 $\log N$개의 깊이를 더한다.
### choice-explanation: d
구간이 절반씩 줄어 반복이 제곱으로 늘지 않는다.

## question: subject-01-q04
### solution
peek는 조회이고 poll은 제거 후 반환이다. element와 remove의 빈 큐 처리도 구별한다.
### choice-explanation: a
조회이며 빈 큐에서 null이다.
### choice-explanation: b
원소가 있으면 제거한다.
### choice-explanation: c
제거 메서드이며 빈 큐에서 예외다.
### choice-explanation: d
조회하지만 빈 큐에서 예외다.

## question: subject-01-q05
### solution
중위는 왼쪽 부분트리 다음 현재 노드 다음 오른쪽 부분트리다. B의 부분트리는 D B가 된다.
### choice-explanation: a
전위 순회다.
### choice-explanation: b
왼쪽 부분트리부터 방문한다.
### choice-explanation: c
후위 순회다.
### choice-explanation: d
B보다 D를 먼저 방문해야 한다.

## question: subject-01-q06
### solution
힙은 부모와 자식 사이의 대소 관계를 보장한다. 형제끼리 오름차순일 필요는 없다.
### choice-explanation: a
모든 부모가 자식 이하이다.
### choice-explanation: b
루트 2가 자식 1보다 크다.
### choice-explanation: c
부모 5가 자식 1보다 크다.
### choice-explanation: d
부모 5가 자식 4보다 크다.

## question: subject-01-q07
### solution
배열에서 B는 인덱스 2이고 자식은 인덱스 4의 D와 인덱스 5의 E다. D의 왼쪽 자식은 인덱스 8의 F다. 루트 깊이는 0이므로 B의 깊이는 1이다. B에서 가장 먼 리프 F까지 B에서 D를 거쳐 간선 2개를 지나므로 높이는 2다.
### choice-explanation: a
루트까지 간선 1개이고 가장 먼 리프 F까지 간선 2개다.
### choice-explanation: b
깊이와 높이를 바꿨다.
### choice-explanation: c
높이를 B와 D와 F의 노드 수 3으로 셌다.
### choice-explanation: d
깊이를 노드 수로 셌다.

## question: subject-01-q08
### solution
한 분기의 선택이 다른 분기로 새지 않도록 선택 전 상태를 복구한다.
### choice-explanation: a
다른 분기에서 i를 사용할 수 있게 한다.
### choice-explanation: b
나머지 후보까지 막는다.
### choice-explanation: c
완성되지 않은 순열을 완성으로 취급한다.
### choice-explanation: d
뒤 후보로 시작하는 순열을 놓친다.

## question: subject-01-q09
### solution
인덱스를 증가시키면 같은 집합의 선택 순서가 한 가지로 고정된다.
### choice-explanation: a
선택 순서만 다른 중복이 생긴다.
### choice-explanation: b
같은 원소를 다시 선택할 수 있다.
### choice-explanation: c
증가하는 인덱스만 선택한다.
### choice-explanation: d
이미 지난 원소를 다시 선택한다.

## question: subject-01-q10
### solution
상승 지점의 1을 뒤의 최소 큰 값 2와 바꾸고 뒤 구간을 오름차순으로 만든다.
### choice-explanation: a
현재 배열보다 작다.
### choice-explanation: b
바로 다음 배열이다.
### choice-explanation: c
한 상태를 건너뛴다.
### choice-explanation: d
첫 값 2인 상태들을 건너뛴다.

## question: subject-01-q11
### solution
무방향 간선 하나는 양쪽 정점의 리스트에 한 번씩 기록되어 기록은 모두 2E개다. 정점 V개의 리스트를 모두 열어 보므로 $O(V + E)$이고 상수 2는 차수에 영향을 주지 않는다.
### choice-explanation: a
간선 기록을 누락했다.
### choice-explanation: b
간선이 없는 정점의 빈 리스트도 확인해야 한다.
### choice-explanation: c
정점 V개의 리스트와 간선 기록 2E개를 한 번씩 확인한다.
### choice-explanation: d
리스트 길이의 합을 제곱으로 셌다.

## question: subject-01-q12
### solution
무방향 그래프의 각 간선은 두 정점 차수에 기여하므로 차수 합은 2E다.
### choice-explanation: a
차수 합의 절반과 다르다.
### choice-explanation: b
차수 합 8을 2로 나눈다.
### choice-explanation: c
각 간선의 중복을 제대로 제거하지 않았다.
### choice-explanation: d
간선을 양 끝점에서 센 값이다.

## question: subject-01-q13
### solution
B가 D를 넣더라도 C는 이미 큐에 들어 있으므로 먼저 처리된다.
### choice-explanation: a
같은 깊이 C보다 D가 앞설 수 없다.
### choice-explanation: b
A의 이웃 순서를 어겼다.
### choice-explanation: c
큐의 선입선출 순서다.
### choice-explanation: d
시작 정점이 다르다.

## question: subject-01-q14
### solution
한 갈래를 끝까지 방문한 뒤 복귀하므로 B와 D 다음에 C와 E를 방문한다.
### choice-explanation: a
너비 우선 순서다.
### choice-explanation: b
B에서 D까지 갔다가 돌아온다.
### choice-explanation: c
B보다 C를 먼저 갈 수 없다.
### choice-explanation: d
A와 D는 직접 연결되지 않았다.

## question: subject-01-q15
### solution
결과를 1과 비교하면 i가 0이 아닐 때 틀릴 수 있다. 0과 다른지를 확인한다.
### choice-explanation: a
AND로 남긴 비트가 0이 아니면 포함이다.
### choice-explanation: b
꺼진 비트인지 검사한다.
### choice-explanation: c
대상 비트를 반전시킨다.
### choice-explanation: d
상위 비트까지 함께 남는다.

## question: subject-01-q16
### solution
AND는 Java의 & 연산이다. 제거는 원래 꺼져 있던 비트에도 안전해야 하므로 XOR 토글과 구별한다.
### choice-explanation: a
대상 비트를 켠다.
### choice-explanation: b
대상만 0인 마스크와 AND한다.
### choice-explanation: c
없던 원소라면 오히려 켠다.
### choice-explanation: d
다른 비트를 모두 지운다.

## question: subject-01-q17
### solution
find는 1→2→3을 따라 대표를 찾고 돌아오며 방문 노드의 부모를 갱신한다.
### choice-explanation: a
1의 경로 압축을 하지 않았다.
### choice-explanation: b
둘 다 대표 3을 직접 가리킨다.
### choice-explanation: c
대표 연결을 뒤집는 연산이 아니다.
### choice-explanation: d
2의 부모는 대표 3이어야 한다.

## question: subject-01-q18
### solution
u→v는 u가 먼저 와야 함을 뜻한다. 사이클이 있으면 시작 순서를 정할 수 없다.
### choice-explanation: a
방향성과 비순환성이 필요하다.
### choice-explanation: b
사이클의 조건은 서로 모순된다.
### choice-explanation: c
선후 관계에 방향이 필요하다.
### choice-explanation: d
두 조건 모두 충족하지 않는다.

## question: subject-01-q19
### solution
탐욕의 최적성과 백트래킹의 가지치기에는 각각 정답을 보존한다는 근거가 필요하다.
### choice-explanation: a
두 방식의 정의에 맞는다.
### choice-explanation: b
특징을 뒤집었다.
### choice-explanation: c
부분문제로 나누는 설명이 아니다.
### choice-explanation: d
되돌아가는 것은 백트래킹이다.

## question: subject-01-q20
### solution
lower_bound는 목표 이상인 첫 위치다. 값이 없으면 삽입될 위치나 배열 길이를 반환할 수 있다.
### choice-explanation: a
값 1은 목표보다 작다.
### choice-explanation: b
처음으로 3 이상인 위치다.
### choice-explanation: c
첫 번째 3의 위치가 아니다.
### choice-explanation: d
처음으로 3보다 큰 위치다.

## question: subject-01-q21
### solution
다음 쌍은 4+6이다. 정렬에 따른 합의 단조성이 포인터 이동의 근거다.
### choice-explanation: a
작은 쪽 값을 높여 합을 키운다.
### choice-explanation: b
범위를 벗어나고 값도 작아진다.
### choice-explanation: c
합을 더 작게 만든다.
### choice-explanation: d
아직 가능한 쌍이 남았다.

## question: subject-01-q22
### solution
i는 1, 2, 4, 8, 16에서 반복한다. 32가 되면 종료하므로 5번이다.


## question: subject-01-q23
### solution
모범답안은 0이다. 첫 번째 원소는 $(3 + 1) \bmod 5 = 4$에, 두 번째 원소는 $(4 + 1) \bmod 5 = 0$에 저장된다. 원형 큐는 배열 끝 다음에 다시 0번으로 돌아가 앞쪽의 빈 칸을 재사용한다. 5라고 답하면 나머지 연산을 빠뜨린 것이다.


## question: subject-01-q24
### solution
1번 기반은 왼쪽 2i와 오른쪽 2i+1이다.


## question: subject-01-q25
### solution
$_6C_2 = \frac{6 \times 5}{2} = 15$다. 두 원소의 선택 순서 중복을 나눈다.


## question: subject-01-q26
### solution
각 원소마다 선택/미선택이 있으므로 2⁴=16이다.


## question: subject-01-q27
### solution
큐는 먼저 발견한 정점을 먼저 처리해 같은 거리의 정점을 먼저 확장한다.


## question: subject-01-q28
### solution
0번부터 세는 5번 비트는 2⁵=32다.


## question: subject-01-q29
### solution
Directed Acyclic Graph의 약어다.


## question: subject-01-q30
### solution
처음 3 이상인 값은 4이고 인덱스는 2다.


## question: subject-01-q31
### solution
i 방문 검사는 (mask & (1 << i)) != 0이다. 추가는 mask |= (1 << i)다. 정수 하나를 대입해 상태를 복사할 수 있다. 다만 가능한 상태 수 2¹⁰개가 줄어드는 것은 아니다.


## question: subject-01-q32
### solution
대표는 4다. `find(1)`은 1에서 4까지 올라간 뒤 돌아오며 방문한 1, 2, 3의 부모를 모두 4로 바꾼다. 이후 이 노드의 find는 짧은 경로를 따라간다. 집합 소속은 변하지 않는다. 경로 압축만으로 모든 단일 연산이 $O(1)$이라고 단정하지 않는다.

