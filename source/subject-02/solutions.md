## question: subject-02-q01
### solution
타이트한 차수는 Θ(N)이지만 O(N²)도 올바른 상한이다.
### choice-explanation: a
느슨한 상한도 빅오에 해당한다.
### choice-explanation: b
실제 차수는 선형이다.
### choice-explanation: c
제곱은 선형 함수의 하한이 아니다.
### choice-explanation: d
선형은 로그보다 빠르게 증가한다.

## question: subject-02-q02
### solution
내부 상태를 매번 초기화하므로 반복 횟수를 곱한다.
### choice-explanation: a
내부 비용을 누락했다.
### choice-explanation: b
외부 비용을 누락했다.
### choice-explanation: c
N번마다 로그 작업을 수행한다.
### choice-explanation: d
내부는 선형이 아닌 로그 횟수다.

## question: subject-02-q03
### solution
재귀가 더 작아지며 끝나려면 길이로 기저 조건을 판단해야 한다.
### choice-explanation: a
길이 0과 1을 모두 포함한다.
### choice-explanation: b
빈 구간을 종료하지 못한다.
### choice-explanation: c
구간 크기와 관계없는 조건이다.
### choice-explanation: d
구간 크기를 알 수 없는 조건이다.

## question: subject-02-q04
### solution
FIFO에 따라 4가 먼저 빠지고 큐는 [7,2]가 된다.
### choice-explanation: a
맨 뒤에 추가된 값이다.
### choice-explanation: b
poll에서 제거됐다.
### choice-explanation: c
현재 맨 앞에 남은 값이다.
### choice-explanation: d
큐에는 두 값이 남아 있다.

## question: subject-02-q05
### solution
후위는 왼쪽과 오른쪽 부분트리를 마친 다음 현재 노드를 기록한다.
### choice-explanation: a
전위 순회다.
### choice-explanation: b
중위 순회다.
### choice-explanation: c
두 자식 다음 루트를 방문한다.
### choice-explanation: d
오른쪽을 먼저 방문했다.

## question: subject-02-q06
### solution
전체 트리의 완전이진트리 형태는 별도로 확인해야 한다.
### choice-explanation: a
부모 자식 관계를 모두 만족한다.
### choice-explanation: b
형제끼리의 정렬은 요구하지 않는다.
### choice-explanation: c
값의 차이에 대한 규칙은 없다.
### choice-explanation: d
형제 값이 같을 필요는 없다.

## question: subject-02-q07
### solution
0번 기반은 왼쪽 2i+1과 오른쪽 2i+2를 사용한다.
### choice-explanation: a
1번 기반 공식을 적용했다.
### choice-explanation: b
왼쪽은 2i+1이다.
### choice-explanation: c
오른쪽 자식의 위치다.
### choice-explanation: d
부모 인덱스와 혼동했다.

## question: subject-02-q08
### solution
공집합까지 포함해 모든 깊이 N의 리프를 처리하면 2^N개가 된다.
### choice-explanation: a
모든 포함 여부가 결정됐다.
### choice-explanation: b
나머지 원소가 아직 미정이다.
### choice-explanation: c
원소의 부호는 종료 조건이 아니다.
### choice-explanation: d
분기 시작은 완성 상태가 아니다.

## question: subject-02-q09
### solution
상태는 `[1,1,2]`에서 `[1,2,1]`을 거쳐 `[2,1,1]`까지 세 가지다. 같은 값끼리의 교환은 새 배열을 만들지 않는다.
### choice-explanation: a
세 상태 중 하나를 놓쳤다.
### choice-explanation: b
3!/2!개이다.
### choice-explanation: c
같은 1의 교환도 새 상태로 셌다.
### choice-explanation: d
부분집합 수와 혼동했다.

## question: subject-02-q10
### solution
역할의 순서가 중요하므로 5P2=20이다.
### choice-explanation: a
역할을 구분하지 않은 조합이다.
### choice-explanation: b
5명 선택 후 나머지 4명이다.
### choice-explanation: c
같은 사람이 두 역할을 맡는다.
### choice-explanation: d
부분집합 개수다.

## question: subject-02-q11
### solution
단일 연결 조회와 한 정점의 모든 이웃 탐색은 다른 작업이다.
### choice-explanation: a
행렬 한 칸을 조회한다.
### choice-explanation: b
이진 탐색이 필요하지 않다.
### choice-explanation: c
이웃 전체를 나열할 때의 비용이다.
### choice-explanation: d
행렬 전체를 검사하는 비용이다.

## question: subject-02-q12
### solution
C→D는 C의 진입 차수가 아니다. C의 차수가 0이 되려면 B도 먼저 처리해야 한다.
### choice-explanation: a
B에서 들어오는 간선이 남는다.
### choice-explanation: b
처음 2에서 1개가 줄었다.
### choice-explanation: c
A의 간선을 빼지 않았다.
### choice-explanation: d
진출 간선까지 더했다.

## question: subject-02-q13
### solution
같은 레벨의 여러 정점이 하나의 정점을 가리킬 때 삽입 시 방문 표시가 중복을 막는다.
### choice-explanation: a
발견과 동시에 표시한다.
### choice-explanation: b
꺼내기 전에 중복 삽입될 수 있다.
### choice-explanation: c
탐색 중 중복을 막지 못한다.
### choice-explanation: d
탐색의 발견 여부와 다르다.

## question: subject-02-q14
### solution
발견 시점과 종료 시점의 기록을 구별해야 한다.
### choice-explanation: a
레벨 순서가 아니다.
### choice-explanation: b
자식 호출이 끝난 후 기록한다.
### choice-explanation: c
번호 정렬을 보장하지 않는다.
### choice-explanation: d
DFS는 거리순을 보장하지 않는다.

## question: subject-02-q15
### solution
XOR는 Java의 ^ 연산이다. 켜진 비트에 적용하면 꺼지는 토글이다.
### choice-explanation: a
0이던 대상 비트를 1로 바꾼다.
### choice-explanation: b
XOR는 무조건 제거가 아니다.
### choice-explanation: c
대상 비트만 바꾼다.
### choice-explanation: d
시프트 수는 2다.

## question: subject-02-q16
### solution
메모리 표현과 복사 연산이 간단해지는 것과 경우의 수가 줄어드는 것은 다르다.
### choice-explanation: a
고정 크기 값 하나를 복사한다.
### choice-explanation: b
가능한 상태는 여전히 2²⁰개다.
### choice-explanation: c
표현 방식은 방문 순서를 정하지 않는다.
### choice-explanation: d
상태 수가 지수적으로 남는다.

## question: subject-02-q17
### solution
경로 압축 여부와 관계없이 find로 대표까지 찾아 비교한다.
### choice-explanation: a
최종 대표가 같은지 확인한다.
### choice-explanation: b
번호가 달라도 같은 집합일 수 있다.
### choice-explanation: c
직접 부모가 대표라는 보장이 없다. 압축 전에는 부모가 달라도 대표가 같을 수 있다.
### choice-explanation: d
깊이는 집합 소속을 말해주지 않는다.

## question: subject-02-q18
### solution
비연결 DAG도 전체 정점을 초기화하면 모두 처리된다. 남은 정점은 사이클의 존재를 뜻한다.
### choice-explanation: a
남은 정점들의 진입 차수를 줄일 수 없다.
### choice-explanation: b
차수 0이면 큐에 들어갔어야 한다.
### choice-explanation: c
두 정점을 아직 처리하지 못했다.
### choice-explanation: d
간선이 없으면 모두 처리된다.

## question: subject-02-q19
### solution
남은 값이 음수라면 합이 감소한다. 현재 합만 보고 탐욕적으로 중단하면 안전하지 않다.
### choice-explanation: a
7에 -2를 더하면 목표 5에 도달한다. 초과 시 중단하면 이 해를 놓친다.
### choice-explanation: b
음수가 남아 있으면 합이 다시 줄어들 수 있어 안전하지 않다.
### choice-explanation: c
분기를 버리면 방문하는 해의 집합 자체가 달라진다.
### choice-explanation: d
분기를 버리는 것만으로 새로운 해가 생기지 않는다.

## question: subject-02-q20
### solution
mid 이하의 값은 모두 target보다 작으므로 lo를 mid 다음으로 옮긴다.
### choice-explanation: a
mid를 후보에서 제외한다.
### choice-explanation: b
같은 구간이 반복될 수 있다.
### choice-explanation: c
답이 있는 오른쪽을 버린다.
### choice-explanation: d
작은 값이 있는 쪽으로 이동한다.

## question: subject-02-q21
### solution
오른쪽 확장 시 합이 증가한다는 단조성이 깨진다. 다른 알고리즘의 전제가 필요하다.
### choice-explanation: a
음수를 추가하면 합이 작아진다.
### choice-explanation: b
인덱스 체계는 유지된다.
### choice-explanation: c
정수 비교 자체는 가능하다.
### choice-explanation: d
포인터 이동은 배열 길이를 바꾸지 않는다.

## question: subject-02-q22
### solution
64부터 1까지 7개의 값에서 실행하고 1/2=0에서 끝난다.


## question: subject-02-q23
### solution
poll은 제거이고 peek는 조회다. remove는 빈 큐에서 예외다.


## question: subject-02-q24
### solution
루트에서 루트까지 지나가는 간선은 없다.


## question: subject-02-q25
### solution
회장 4명과 남은 부회장 3명을 곱하면 12다.


## question: subject-02-q26
### solution
1<4가 유일한 상승 지점이다. 뒤의 4,3,2는 내림차순이다.


## question: subject-02-q27
### solution
차수 합=2E이므로 E=7이다.


## question: subject-02-q28
### solution
두 원소의 대표가 같으므로 같은 집합이다.


## question: subject-02-q29
### solution
A와 B에서 각각 하나씩 들어온다.


## question: subject-02-q30
### solution
목표 이상인 원소가 없어 배열 길이를 반환한다.


## question: subject-02-q31
### solution
XOR는 비트를 반전하므로 꺼진 비트를 오히려 켠다. 제거에는 mask &= ~(1 << i)를 쓴다. 대상 비트만 0이고 다른 비트는 1인 값과 AND하므로 다른 방문 상태를 보존하며 두 번 제거해도 결과가 같다.


## question: subject-02-q32
### solution
직접 부모가 달라도 최종 대표는 같을 수 있다. a→x→r이고 b→r이면 parent는 다르지만 같은 집합이다. find(a)와 find(b)의 결과를 비교해야 한다. 경로 압축은 방문 노드를 대표에 연결해 이후 조회를 줄인다.

