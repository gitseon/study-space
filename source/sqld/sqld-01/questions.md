## question: sqld-01-q01
```json
{
  "title": "3단계 스키마의 독립성",
  "topics": [
    "model-basics"
  ],
  "tags": [
    "model-levels"
  ],
  "group": "model-basics",
  "type": "mc",
  "id": "sqld-01-q01",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 1"
  ],
  "difficulty": 2,
  "sqlDialect": "common",
  "correctChoiceId": "a"
}
```
### stem
ANSI 3단계 스키마에 대한 설명으로 옳은 것은?
### choice: a
내부 스키마가 바뀌어도 개념 스키마가 영향을 받지 않는 것이 물리적 독립성이다
### choice: b
개념 스키마가 바뀌어도 외부 스키마가 영향을 받지 않는 것이 물리적 독립성이다
### choice: c
외부 스키마는 저장 장치에서 데이터가 놓이는 방식을 정의한다
### choice: d
내부 스키마는 개별 사용자나 응용 프로그램이 보는 관점을 정의한다

## question: sqld-01-q02
```json
{
  "title": "엔터티로 부적절한 대상",
  "topics": [
    "model-basics"
  ],
  "tags": [
    "entity-attribute"
  ],
  "group": "model-basics",
  "type": "mc",
  "id": "sqld-01-q02",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 1"
  ],
  "difficulty": 2,
  "sqlDialect": "common",
  "correctChoiceId": "b"
}
```
### stem
도서 대출 시스템을 모델링한다. 다음 중 엔터티로 삼기에 가장 부적절한 것은?
### choice: a
여러 건이 쌓이는 대출 이력
### choice: b
시스템에서 하나뿐인 도서관 이름
### choice: c
서가에 꽂힌 여러 권의 도서
### choice: d
도서관에 가입하는 여러 회원

## question: sqld-01-q03
```json
{
  "title": "관계 차수와 선택성 읽기",
  "topics": [
    "model-basics"
  ],
  "tags": [
    "relationship-cardinality"
  ],
  "group": "model-basics",
  "type": "mc",
  "id": "sqld-01-q03",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 1"
  ],
  "difficulty": 2,
  "sqlDialect": "common",
  "correctChoiceId": "d"
}
```
### stem
한 부서에는 직원이 여러 명 있고 직원은 반드시 하나의 부서에 속한다. 새로 만든 부서에는 직원이 아직 없을 수 있다. 부서와 직원의 관계로 알맞은 것은?
### choice: a
1:M 관계이고 직원 쪽에서는 부서가 선택이며 부서 쪽에서는 직원이 필수이다
### choice: b
직원과 부서가 서로 여러 개씩 연결되는 M:N 관계이다
### choice: c
1:1 관계이고 부서와 직원의 참여가 양쪽 모두 필수이다
### choice: d
1:M 관계이고 직원 쪽에서는 부서가 필수이며 부서 쪽에서는 직원이 선택이다

## question: sqld-01-q04
```json
{
  "title": "주식별자의 조건 위반",
  "topics": [
    "model-basics"
  ],
  "tags": [
    "identifier-key"
  ],
  "group": "model-basics",
  "type": "mc",
  "id": "sqld-01-q04",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 1"
  ],
  "difficulty": 2,
  "sqlDialect": "common",
  "correctChoiceId": "c"
}
```
### stem
회원 엔터티의 주식별자로 휴대폰 번호를 썼더니 번호를 바꾼 회원의 주문 이력이 연결되지 않는 문제가 생겼다. 위반한 주식별자의 특징은?
### choice: a
유일성: 인스턴스마다 값이 달라야 한다
### choice: b
최소성: 꼭 필요한 최소한의 속성으로 구성해야 한다
### choice: c
불변성: 한 번 정해지면 값이 바뀌지 않아야 한다
### choice: d
존재성: 값이 반드시 있어야 한다

## question: sqld-01-q05
```json
{
  "title": "서브타입의 테이블 변환",
  "topics": [
    "model-basics"
  ],
  "tags": [
    "supertype-subtype"
  ],
  "group": "model-basics",
  "type": "mc",
  "id": "sqld-01-q05",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 1"
  ],
  "difficulty": 3,
  "sqlDialect": "common",
  "correctChoiceId": "b"
}
```
### stem
주문 엔터티를 온라인 주문과 매장 주문의 서브타입으로 나누었다. 두 서브타입의 속성 차이는 작고 업무가 대부분 전체 주문을 한꺼번에 조회한다. 물리 모델로 가장 알맞은 방식은?
### choice: a
주문 테이블과 두 서브타입 테이블을 1:1 관계로 모두 만든다
### choice: b
모든 속성을 하나의 주문 테이블에 두고 구분 열을 추가한다
### choice: c
서브타입별로 테이블을 따로 만들고 공통 속성을 각각 복사한다
### choice: d
공통 속성만 주문 테이블에 두고 서브타입 속성은 버린다

## question: sqld-01-q06
```json
{
  "title": "이행 종속의 판별",
  "topics": [
    "model-sql"
  ],
  "tags": [
    "normalization"
  ],
  "group": "model-sql",
  "type": "mc",
  "id": "sqld-01-q06",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 2"
  ],
  "difficulty": 2,
  "sqlDialect": "common",
  "correctChoiceId": "b"
}
```
### stem
사원(사번, 이름, 부서코드, 부서명)의 기본키는 사번이고 부서코드가 정해지면 부서명이 정해진다. 이 테이블에 대한 설명으로 알맞은 것은?
### choice: a
기본키 일부에 종속된 속성이 있어 제2정규형을 위반한다
### choice: b
부서코드를 거쳐 부서명이 정해지는 이행 종속이므로 제3정규형 위반이다
### choice: c
한 칸에 여러 값이 들어 있어 제1정규형을 위반한다
### choice: d
결정자가 모두 후보키이므로 보이스코드 정규형까지 만족한다

## question: sqld-01-q07
```json
{
  "title": "인조 식별자의 단점",
  "topics": [
    "model-sql"
  ],
  "tags": [
    "surrogate-key"
  ],
  "group": "model-sql",
  "type": "mc",
  "id": "sqld-01-q07",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 2"
  ],
  "difficulty": 2,
  "sqlDialect": "common",
  "correctChoiceId": "d"
}
```
### stem
주문 테이블의 기본키를 업무 의미가 없는 일련번호로 두었다. 이 설계에서 주의할 점으로 알맞은 것은?
### choice: a
일련번호는 값이 바뀔 수 있어 다른 테이블에서 참조하기 어렵다
### choice: b
일련번호를 쓰면 복합 키가 되어 조인 조건이 길어진다
### choice: c
일련번호는 업무에서 쓰는 값이므로 외부에 노출해도 의미가 해석되지 않는다
### choice: d
같은 업무 데이터의 중복 입력을 막지 못해 업무 키에 UNIQUE 제약을 함께 둔다

## question: sqld-01-q08
```json
{
  "title": "FK와 조인의 관계",
  "topics": [
    "model-sql"
  ],
  "tags": [
    "relationship-join"
  ],
  "group": "model-sql",
  "type": "mc",
  "id": "sqld-01-q08",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 2"
  ],
  "difficulty": 2,
  "sqlDialect": "common",
  "correctChoiceId": "c"
}
```
### stem
FK 제약이 없는 두 테이블이 있다. 조인에 대한 설명으로 알맞은 것은?
### choice: a
FK 제약이 없으면 두 테이블을 조인할 수 없다
### choice: b
조인은 PK와 FK 사이에서만 사용할 수 있다
### choice: c
FK가 없어도 값이 대응하면 조인 조건으로 연결할 수 있다
### choice: d
FK 제약은 조인 결과의 행 수를 줄이는 역할을 한다

## question: sqld-01-q09
```json
{
  "title": "송금 업무의 트랜잭션 성질",
  "topics": [
    "model-sql"
  ],
  "tags": [
    "transaction-model"
  ],
  "group": "model-sql",
  "type": "mc",
  "id": "sqld-01-q09",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 2"
  ],
  "difficulty": 1,
  "sqlDialect": "common",
  "correctChoiceId": "a"
}
```
### stem
송금 업무가 출금과 입금 두 작업으로 이루어져 있다. 입금이 실패하면 출금도 취소되어야 한다. 이 요구에 해당하는 트랜잭션의 성질은?
### choice: a
원자성: 모든 작업이 전부 성공하거나 전부 취소되어야 한다
### choice: b
일관성: 트랜잭션 전후에 데이터 규칙이 유지되어야 한다
### choice: c
격리성: 실행 중인 트랜잭션이 서로 영향을 주지 않아야 한다
### choice: d
지속성: 커밋된 결과는 장애가 나도 유지되어야 한다

## question: sqld-01-q10
```json
{
  "title": "NULL이 있는 열의 집계",
  "topics": [
    "model-sql"
  ],
  "tags": [
    "null-property"
  ],
  "group": "model-sql",
  "type": "mc",
  "id": "sqld-01-q10",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 2"
  ],
  "difficulty": 2,
  "sqlDialect": "common",
  "correctChoiceId": "d"
}
```
### stem
열 `c`에 세 행의 값이 10, 20, NULL이다. `SELECT COUNT(*), COUNT(c), AVG(c) FROM t`의 결과로 알맞은 것은?
### choice: a
3, 3, 10
### choice: b
2, 2, 15
### choice: c
3, 2, 10
### choice: d
3, 2, 15

## question: sqld-01-q11
```json
{
  "title": "별칭을 쓸 수 있는 위치",
  "topics": [
    "sql-basics"
  ],
  "tags": [
    "select-order"
  ],
  "group": "sql-basics",
  "type": "mc",
  "id": "sqld-01-q11",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 3"
  ],
  "difficulty": 2,
  "sqlDialect": "common",
  "correctChoiceId": "c"
}
```
### stem
다음 쿼리 중 실행하면 오류가 나는 것은? (Oracle과 SQL Server 모두 같다)
### choice: a
SELECT sal * 12 AS annual FROM emp ORDER BY annual
### choice: b
SELECT sal * 12 AS annual FROM emp WHERE sal * 12 > 1000
### choice: c
SELECT sal * 12 AS annual FROM emp WHERE annual > 1000
### choice: d
SELECT sal * 12 AS annual FROM emp ORDER BY sal * 12

## question: sqld-01-q12
```json
{
  "title": "AND와 OR의 우선순위",
  "topics": [
    "sql-basics"
  ],
  "tags": [
    "where-conditions"
  ],
  "group": "sql-basics",
  "type": "mc",
  "id": "sqld-01-q12",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 3"
  ],
  "difficulty": 3,
  "sqlDialect": "common",
  "correctChoiceId": "d"
}
```
### stem
다음 표에서 `WHERE a = 1 OR b = 2 AND c = 3`을 만족하는 행은 몇 개인가?
```text
a | b | c
1 | 1 | 1
1 | 2 | 0
0 | 2 | 3
0 | 2 | 0
1 | 0 | 3
```
### choice: a
2개
### choice: b
3개
### choice: c
5개
### choice: d
4개

## question: sqld-01-q13
```json
{
  "title": "LIKE의 와일드카드",
  "topics": [
    "sql-basics"
  ],
  "tags": [
    "where-conditions"
  ],
  "group": "sql-basics",
  "type": "mc",
  "id": "sqld-01-q13",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 3"
  ],
  "difficulty": 2,
  "sqlDialect": "common",
  "correctChoiceId": "d"
}
```
### stem
열 `w`에 아래 값이 들어 있다. `WHERE w LIKE '_A_A'`로 조회되는 행은 몇 개인가? (대소문자 구분은 무시해도 된다)
```text
w: DATA  DAD  BANANA  NAAN  MAMA  BARA
```
### choice: a
2개
### choice: b
4개
### choice: c
5개
### choice: d
3개

## question: sqld-01-q14
```json
{
  "title": "SUBSTR의 음수 시작 위치",
  "topics": [
    "sql-basics"
  ],
  "tags": [
    "string-functions"
  ],
  "group": "sql-basics",
  "type": "mc",
  "id": "sqld-01-q14",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 3"
  ],
  "difficulty": 3,
  "sqlDialect": "oracle",
  "correctChoiceId": "b"
}
```
### stem
Oracle에서 `SUBSTR('DATABASE', -4, 2)`의 결과는?
### choice: a
AS
### choice: b
BA
### choice: c
TA
### choice: d
AB

## question: sqld-01-q15
```json
{
  "title": "SQL Server의 문자열 연결과 NULL",
  "topics": [
    "sql-basics"
  ],
  "tags": [
    "string-functions"
  ],
  "group": "sql-basics",
  "type": "mc",
  "id": "sqld-01-q15",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 3"
  ],
  "difficulty": 3,
  "sqlDialect": "sqlserver",
  "correctChoiceId": "d"
}
```
### stem
SQL Server에서 기본 설정으로 `SELECT 'A' + NULL + 'B'`와 `SELECT CONCAT('A', NULL, 'B')`를 실행했다. 결과로 알맞은 것은?
### choice: a
첫째는 AB이고 둘째는 NULL이다
### choice: b
둘 다 AB가 되어 결과가 같다
### choice: c
둘 다 NULL이 되어 결과가 같다
### choice: d
첫째는 NULL이고 둘째는 AB이다

## question: sqld-01-q16
```json
{
  "title": "NULL 함수의 결과",
  "topics": [
    "sql-basics"
  ],
  "tags": [
    "null-functions"
  ],
  "group": "sql-basics",
  "type": "mc",
  "id": "sqld-01-q16",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 3"
  ],
  "difficulty": 2,
  "sqlDialect": "common",
  "correctChoiceId": "c"
}
```
### stem
`COALESCE(NULL, NULL, 3)`과 `NULLIF(5, 5)`의 결과를 차례로 나열한 것은?
### choice: a
COALESCE는 3이고 NULLIF는 5
### choice: b
COALESCE는 NULL이고 NULLIF는 NULL
### choice: c
COALESCE는 3이고 NULLIF는 NULL
### choice: d
COALESCE는 5이고 NULLIF는 3

## question: sqld-01-q17
```json
{
  "title": "WHERE와 HAVING이 함께 있는 집계",
  "topics": [
    "sql-basics"
  ],
  "tags": [
    "group-having"
  ],
  "group": "sql-basics",
  "type": "mc",
  "id": "sqld-01-q17",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 3"
  ],
  "difficulty": 3,
  "sqlDialect": "common",
  "correctChoiceId": "a"
}
```
### stem
다음 `sales` 데이터에 대해 아래 쿼리가 반환하는 행 수는?
```text
region | amount
E      | 100
E      | 200
W      | 50
W      | 60
N      | 400
N      | NULL
```
```sql
SELECT region, SUM(amount)
FROM sales
WHERE amount >= 60
GROUP BY region
HAVING SUM(amount) > 100;
```
### choice: a
2행
### choice: b
3행
### choice: c
1행
### choice: d
4행

## question: sqld-01-q18
```json
{
  "title": "정렬에서 NULL의 위치",
  "topics": [
    "sql-basics"
  ],
  "tags": [
    "order-by-null"
  ],
  "group": "sql-basics",
  "type": "mc",
  "id": "sqld-01-q18",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 3"
  ],
  "difficulty": 2,
  "sqlDialect": "common",
  "correctChoiceId": "a"
}
```
### stem
`ORDER BY col ASC`에서 NULL의 위치에 대한 설명으로 옳은 것은?
### choice: a
Oracle은 NULL이 마지막에 오고 SQL Server는 NULL이 처음에 온다
### choice: b
Oracle은 NULL이 처음에 오고 SQL Server는 NULL이 마지막에 온다
### choice: c
두 DBMS 모두 NULL이 항상 마지막에 온다
### choice: d
두 DBMS 모두 NULL은 정렬 대상에서 제외된다

## question: sqld-01-q19
```json
{
  "title": "세 테이블 내부 조인의 행 수",
  "topics": [
    "join"
  ],
  "tags": [
    "inner-join"
  ],
  "group": "join",
  "type": "mc",
  "id": "sqld-01-q19",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 4"
  ],
  "difficulty": 3,
  "sqlDialect": "common",
  "correctChoiceId": "b"
}
```
### stem
아래 세 테이블을 내부 조인한 결과 행 수는?
```text
customer.id        : 1, 2, 3
orders (id, cust)  : (10, 1) (11, 1) (12, 2) (13, NULL)
order_item.order_id: 10, 10, 11, 13
```
```sql
SELECT COUNT(*)
FROM customer c
JOIN orders o ON o.cust = c.id
JOIN order_item i ON i.order_id = o.id;
```
### choice: a
4행
### choice: b
3행
### choice: c
2행
### choice: d
5행

## question: sqld-01-q20
```json
{
  "title": "FULL OUTER JOIN의 행 수",
  "topics": [
    "join"
  ],
  "tags": [
    "outer-join"
  ],
  "group": "join",
  "type": "mc",
  "id": "sqld-01-q20",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 4"
  ],
  "difficulty": 3,
  "sqlDialect": "common",
  "correctChoiceId": "d"
}
```
### stem
아래 두 테이블에 대해 `x FULL OUTER JOIN y ON x.k = y.k`의 결과 행 수는?
```text
x.k: 1  2  3
y.k: 2  3  4  4
```
### choice: a
4행
### choice: b
6행
### choice: c
7행
### choice: d
5행

## question: sqld-01-q21
```json
{
  "title": "USING 절의 열 한정자",
  "topics": [
    "join"
  ],
  "tags": [
    "standard-join-syntax"
  ],
  "group": "join",
  "type": "mc",
  "id": "sqld-01-q21",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 4"
  ],
  "difficulty": 3,
  "sqlDialect": "oracle",
  "correctChoiceId": "c"
}
```
### stem
Oracle에서 `emp`와 `dept`가 모두 `deptno` 열을 가진다. 다음 중 오류가 나는 쿼리는?
### choice: a
SELECT deptno FROM emp e JOIN dept d USING (deptno)
### choice: b
SELECT e.ename FROM emp e JOIN dept d USING (deptno)
### choice: c
SELECT d.deptno FROM emp e JOIN dept d USING (deptno)
### choice: d
SELECT e.ename FROM emp e JOIN dept d ON e.deptno = d.deptno

## question: sqld-01-q22
```json
{
  "title": "중복 키가 있는 조인의 행 수",
  "topics": [
    "join"
  ],
  "tags": [
    "join-row-count"
  ],
  "group": "join",
  "type": "mc",
  "id": "sqld-01-q22",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 4"
  ],
  "difficulty": 3,
  "sqlDialect": "common",
  "correctChoiceId": "b"
}
```
### stem
아래 두 테이블에 대해 `a INNER JOIN b`와 `a RIGHT OUTER JOIN b`의 행 수를 차례로 나열한 것은? (조건은 `a.k = b.k`)
```text
a.k: 1  1  2
b.k: 1  2  2  3
```
### choice: a
3행과 4행
### choice: b
4행과 5행
### choice: c
4행과 4행
### choice: d
5행과 5행

## question: sqld-01-q23
```json
{
  "title": "(+) 표기의 방향",
  "topics": [
    "join"
  ],
  "tags": [
    "outer-join"
  ],
  "group": "join",
  "type": "mc",
  "id": "sqld-01-q23",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 4"
  ],
  "difficulty": 3,
  "sqlDialect": "oracle",
  "correctChoiceId": "c"
}
```
### stem
Oracle의 `SELECT ... FROM a, b WHERE a.k = b.k(+)`에 대한 설명으로 알맞은 것은?
### choice: a
`b`의 모든 행이 남고 짝이 없으면 `a`의 열이 NULL로 채워진다
### choice: b
`a`와 `b`의 모든 행이 남는 완전 외부 조인이다
### choice: c
`a`의 모든 행이 남고 짝이 없으면 `b`의 열이 NULL로 채워진다
### choice: d
짝이 있는 행만 남는 내부 조인과 같다

## question: sqld-01-q24
```json
{
  "title": "단일 행 서브쿼리의 오류",
  "topics": [
    "subquery-set"
  ],
  "tags": [
    "subquery-kinds"
  ],
  "group": "subquery-set",
  "type": "mc",
  "id": "sqld-01-q24",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 5"
  ],
  "difficulty": 2,
  "sqlDialect": "common",
  "correctChoiceId": "b"
}
```
### stem
`staff`에서 `dept = 'A'`인 행이 두 개 이상일 때 오류가 나는 쿼리는?
### choice: a
SELECT name FROM staff WHERE sal IN (SELECT sal FROM staff WHERE dept = 'A')
### choice: b
SELECT name FROM staff WHERE sal = (SELECT sal FROM staff WHERE dept = 'A')
### choice: c
SELECT name FROM staff WHERE sal = (SELECT MAX(sal) FROM staff WHERE dept = 'A')
### choice: d
SELECT name FROM staff WHERE sal > ALL (SELECT sal FROM staff WHERE dept = 'A')

## question: sqld-01-q25
```json
{
  "title": "ALL과 ANY의 비교 결과",
  "topics": [
    "subquery-set"
  ],
  "tags": [
    "multi-row-operators"
  ],
  "group": "subquery-set",
  "type": "mc",
  "id": "sqld-01-q25",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 5"
  ],
  "difficulty": 3,
  "sqlDialect": "common",
  "correctChoiceId": "d"
}
```
### stem
아래 두 테이블이 있다. `t`에서 `v > ALL (SELECT v FROM s)`로 조회되는 행 수와 `v > ANY (SELECT v FROM s)`로 조회되는 행 수를 차례로 나열한 것은?
```text
t.v: 1  2  3  4  5
s.v: 2  4
```
### choice: a
3과 1
### choice: b
1과 1
### choice: c
3과 3
### choice: d
1과 3

## question: sqld-01-q26
```json
{
  "title": "ANY와 ALL의 동치 표현",
  "topics": [
    "subquery-set"
  ],
  "tags": [
    "multi-row-operators"
  ],
  "group": "subquery-set",
  "type": "mc",
  "id": "sqld-01-q26",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 5"
  ],
  "difficulty": 3,
  "sqlDialect": "common",
  "correctChoiceId": "d"
}
```
### stem
다음 설명 중 옳은 것은?
### choice: a
`x <> ALL (서브쿼리)`는 `x IN (서브쿼리)`와 같은 결과를 낸다
### choice: b
`x > ANY (서브쿼리)`는 서브쿼리의 최댓값보다 큰 값만 선택한다
### choice: c
`x < ALL (서브쿼리)`는 서브쿼리의 최댓값보다 작은 값을 선택한다
### choice: d
`x = ANY (서브쿼리)`는 `x IN (서브쿼리)`와 같은 결과를 낸다

## question: sqld-01-q27
```json
{
  "title": "EXISTS와 NOT IN의 차이",
  "topics": [
    "subquery-set"
  ],
  "tags": [
    "correlated-exists"
  ],
  "group": "subquery-set",
  "type": "mc",
  "id": "sqld-01-q27",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 5"
  ],
  "difficulty": 3,
  "sqlDialect": "common",
  "correctChoiceId": "c"
}
```
### stem
아래 두 테이블에서 직원이 없는 부서를 구하는 두 쿼리 `NOT EXISTS`와 `NOT IN`의 결과 행 수를 차례로 나열한 것은?
```text
dept.id     : 1  2  3
emp.dept_id : 1  1  3  NULL
```
### choice: a
1행과 1행
### choice: b
0행과 1행
### choice: c
1행과 0행
### choice: d
2행과 0행

## question: sqld-01-q28
```json
{
  "title": "MINUS의 결과",
  "topics": [
    "subquery-set"
  ],
  "tags": [
    "set-operators"
  ],
  "group": "subquery-set",
  "type": "mc",
  "id": "sqld-01-q28",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 5"
  ],
  "difficulty": 3,
  "sqlDialect": "oracle",
  "correctChoiceId": "c"
}
```
### stem
Oracle에서 `ma`의 `v`가 1, 2, 2, 3이고 `mb`의 `v`가 2, 4일 때 `SELECT v FROM ma MINUS SELECT v FROM mb`의 결과 행 수는?
### choice: a
3행
### choice: b
1행
### choice: c
2행
### choice: d
4행

## question: sqld-01-q29
```json
{
  "title": "집합 연산자에 대한 설명",
  "topics": [
    "subquery-set"
  ],
  "tags": [
    "set-operators"
  ],
  "group": "subquery-set",
  "type": "mc",
  "id": "sqld-01-q29",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 5"
  ],
  "difficulty": 2,
  "sqlDialect": "common",
  "correctChoiceId": "a"
}
```
### stem
집합 연산자에 대한 설명으로 옳은 것은?
### choice: a
SELECT의 열 개수가 같아야 하고 `ORDER BY`는 맨 끝에 한 번만 쓴다
### choice: b
`UNION`은 중복을 제거하지 않고 모든 행을 그대로 합친다
### choice: c
각 SELECT의 열 이름이 같아야만 결과를 합칠 수 있다
### choice: d
각 SELECT 뒤에 `ORDER BY`를 따로 쓸 수 있다

## question: sqld-01-q30
```json
{
  "title": "ROLLUP과 CUBE의 행 수",
  "topics": [
    "group-window"
  ],
  "tags": [
    "rollup-cube"
  ],
  "group": "group-window",
  "type": "mc",
  "id": "sqld-01-q30",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 6"
  ],
  "difficulty": 3,
  "sqlDialect": "oracle",
  "correctChoiceId": "d"
}
```
### stem
`sales2`에 지역 E와 W 각각에 상품 pen과 note의 행이 하나씩 있다. `GROUP BY ROLLUP (region, item)`과 `GROUP BY CUBE (region, item)`의 결과 행 수를 차례로 나열한 것은?
### choice: a
5행과 7행
### choice: b
7행과 8행
### choice: c
9행과 9행
### choice: d
7행과 9행

## question: sqld-01-q31
```json
{
  "title": "GROUPING 함수의 값",
  "topics": [
    "group-window"
  ],
  "tags": [
    "rollup-cube"
  ],
  "group": "group-window",
  "type": "mc",
  "id": "sqld-01-q31",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 6"
  ],
  "difficulty": 3,
  "sqlDialect": "oracle",
  "correctChoiceId": "c"
}
```
### stem
`GROUP BY ROLLUP (region, item)` 결과에서 지역 E의 소계 행(상품 열이 NULL로 나온 행)의 `GROUPING(region)`과 `GROUPING(item)` 값을 차례로 나열한 것은?
### choice: a
1과 0
### choice: b
0과 0
### choice: c
0과 1
### choice: d
1과 1

## question: sqld-01-q32
```json
{
  "title": "GROUPING SETS의 결과 행 수",
  "topics": [
    "group-window"
  ],
  "tags": [
    "grouping-sets"
  ],
  "group": "group-window",
  "type": "mc",
  "id": "sqld-01-q32",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 6"
  ],
  "difficulty": 3,
  "sqlDialect": "oracle",
  "correctChoiceId": "a"
}
```
### stem
`sales2`에 지역이 E와 W 두 가지이고 상품이 pen과 note 두 가지이다. `GROUP BY GROUPING SETS ((region), (item))`의 결과 행 수는?
### choice: a
4행
### choice: b
5행
### choice: c
7행
### choice: d
2행

## question: sqld-01-q33
```json
{
  "title": "순위 함수의 값",
  "topics": [
    "group-window"
  ],
  "tags": [
    "window-rank"
  ],
  "group": "group-window",
  "type": "mc",
  "id": "sqld-01-q33",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 6"
  ],
  "difficulty": 3,
  "sqlDialect": "common",
  "correctChoiceId": "c"
}
```
### stem
점수가 90, 90, 80, 70인 네 행을 점수 내림차순으로 순위를 매긴다. 점수 80인 행의 `RANK`와 `DENSE_RANK`와 `ROW_NUMBER` 값을 차례로 나열한 것은?
### choice: a
2, 2, 3
### choice: b
3, 3, 2
### choice: c
3, 2, 3
### choice: d
2, 3, 3

## question: sqld-01-q34
```json
{
  "title": "ORDER BY만 있는 누적 합",
  "topics": [
    "group-window"
  ],
  "tags": [
    "window-frame"
  ],
  "group": "group-window",
  "type": "mc",
  "id": "sqld-01-q34",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 6"
  ],
  "difficulty": 3,
  "sqlDialect": "common",
  "correctChoiceId": "a"
}
```
### stem
`SUM(v) OVER (ORDER BY k)`를 아래 `w` 테이블에 적용했다. `k`가 2인 두 행의 값은?
```text
w(k, v)
1 | 10
2 | 20
2 | 30
3 | 40
```
### choice: a
둘 다 60
### choice: b
20과 50
### choice: c
20과 60
### choice: d
둘 다 50

## question: sqld-01-q35
```json
{
  "title": "이동 평균의 프레임",
  "topics": [
    "group-window"
  ],
  "tags": [
    "window-frame"
  ],
  "group": "group-window",
  "type": "mc",
  "id": "sqld-01-q35",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 6"
  ],
  "difficulty": 3,
  "sqlDialect": "common",
  "correctChoiceId": "b"
}
```
### stem
아래 `w2` 테이블에 다음 쿼리를 적용했다. `id`가 3인 행의 값은?
```text
w2(id, v)
1 | 10
2 | 20
3 | 40
```
```sql
AVG(v) OVER (ORDER BY id
             ROWS BETWEEN 1 PRECEDING AND CURRENT ROW)
```
### choice: a
23.33
### choice: b
30.00
### choice: c
40.00
### choice: d
20.00

## question: sqld-01-q36
```json
{
  "title": "LAG와 LEAD의 경계 값",
  "topics": [
    "group-window"
  ],
  "tags": [
    "window-lag-lead"
  ],
  "group": "group-window",
  "type": "mc",
  "id": "sqld-01-q36",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 6"
  ],
  "difficulty": 3,
  "sqlDialect": "common",
  "correctChoiceId": "a"
}
```
### stem
아래 `w3` 테이블을 `id` 순서로 읽는다. `LAG(sal, 1, 0)`의 두 번째 행 값과 `LEAD(sal)`의 마지막 행 값을 차례로 나열한 것은?
```text
w3(id, sal)
1 | 100
2 | 200
3 | 300
```
### choice: a
100과 NULL
### choice: b
100과 0
### choice: c
0과 NULL
### choice: d
200과 300

## question: sqld-01-q37
```json
{
  "title": "ROWNUM과 ORDER BY",
  "topics": [
    "top-hierarchy"
  ],
  "tags": [
    "top-n"
  ],
  "group": "top-hierarchy",
  "type": "mc",
  "id": "sqld-01-q37",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 7"
  ],
  "difficulty": 3,
  "sqlDialect": "oracle",
  "correctChoiceId": "c"
}
```
### stem
Oracle에서 `SELECT * FROM emp WHERE ROWNUM <= 3 ORDER BY sal DESC`를 실행했다. 이 쿼리의 결과로 알맞은 것은?
### choice: a
급여가 가장 높은 3명을 내림차순으로 반환한다
### choice: b
`ROWNUM`과 `ORDER BY`를 함께 쓸 수 없어 오류가 난다
### choice: c
앞의 3행을 먼저 고른 뒤 그 3행을 급여 내림차순으로 정렬한다
### choice: d
급여가 같은 행을 모두 포함해 3행보다 많이 반환한다

## question: sqld-01-q38
```json
{
  "title": "TOP WITH TIES의 행 수",
  "topics": [
    "top-hierarchy"
  ],
  "tags": [
    "top-n"
  ],
  "group": "top-hierarchy",
  "type": "mc",
  "id": "sqld-01-q38",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 7"
  ],
  "difficulty": 3,
  "sqlDialect": "sqlserver",
  "correctChoiceId": "c"
}
```
### stem
SQL Server에서 점수가 90, 90, 85, 85, 80인 다섯 행에 `SELECT TOP 3 WITH TIES score FROM t ORDER BY score DESC`를 실행했다. 반환되는 행 수는?
### choice: a
3행
### choice: b
2행
### choice: c
4행
### choice: d
5행

## question: sqld-01-q39
```json
{
  "title": "LEVEL의 값",
  "topics": [
    "top-hierarchy"
  ],
  "tags": [
    "hierarchical-query"
  ],
  "group": "top-hierarchy",
  "type": "mc",
  "id": "sqld-01-q39",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 7"
  ],
  "difficulty": 3,
  "sqlDialect": "oracle",
  "correctChoiceId": "a"
}
```
### stem
아래 `staff` 테이블에서 `START WITH mgr IS NULL CONNECT BY PRIOR id = mgr`로 조회할 때 `LEVEL`이 3인 행은 몇 개인가?
```text
staff(id, mgr)
1 | NULL
2 | 1
3 | 1
4 | 2
5 | 2
6 | 3
```
### choice: a
3개
### choice: b
2개
### choice: c
1개
### choice: d
4개

## question: sqld-01-q40
```json
{
  "title": "계층 질의의 방향",
  "topics": [
    "top-hierarchy"
  ],
  "tags": [
    "hierarchical-query"
  ],
  "group": "top-hierarchy",
  "type": "mc",
  "id": "sqld-01-q40",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 7"
  ],
  "difficulty": 3,
  "sqlDialect": "oracle",
  "correctChoiceId": "b"
}
```
### stem
같은 `staff` 테이블에서 `START WITH id = 5 CONNECT BY PRIOR mgr = id`로 조회했다. 반환되는 행 수와 마지막 행의 `LEVEL`을 차례로 나열한 것은?
### choice: a
1행과 1
### choice: b
3행과 3
### choice: c
3행과 1
### choice: d
6행과 3

## question: sqld-01-q41
```json
{
  "title": "셀프 조인의 행 수",
  "topics": [
    "top-hierarchy"
  ],
  "tags": [
    "self-join"
  ],
  "group": "top-hierarchy",
  "type": "mc",
  "id": "sqld-01-q41",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 7"
  ],
  "difficulty": 3,
  "sqlDialect": "common",
  "correctChoiceId": "a"
}
```
### stem
아래 `staff` 테이블에서 자기 상사보다 급여가 많은 직원을 셀프 조인으로 구할 때 행 수는?
```text
staff(id, mgr, sal)
1 | NULL | 500
2 | 1    | 300
3 | 1    | 600
4 | 2    | 200
5 | 2    | 350
6 | 3    | 100
```
### choice: a
2행
### choice: b
1행
### choice: c
3행
### choice: d
6행

## question: sqld-01-q42
```json
{
  "title": "PIVOT의 결과 값",
  "topics": [
    "pivot-regex"
  ],
  "tags": [
    "pivot-unpivot"
  ],
  "group": "pivot-regex",
  "type": "mc",
  "id": "sqld-01-q42",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 8"
  ],
  "difficulty": 3,
  "sqlDialect": "oracle",
  "correctChoiceId": "d"
}
```
### stem
아래 `sales3` 테이블에 Oracle에서 `PIVOT (SUM(amount) FOR quarter IN ('Q1' AS q1, 'Q2' AS q2))`을 적용했을 때 E의 q1 값과 W의 q2 값을 차례로 나열한 것은?
```text
sales3(region, quarter, amount)
E | Q1 | 10
E | Q1 | 5
E | Q2 | 7
W | Q1 | 3
```
### choice: a
15와 0
### choice: b
10과 NULL
### choice: c
5와 3
### choice: d
15와 NULL

## question: sqld-01-q43
```json
{
  "title": "UNPIVOT과 NULL",
  "topics": [
    "pivot-regex"
  ],
  "tags": [
    "pivot-unpivot"
  ],
  "group": "pivot-regex",
  "type": "mc",
  "id": "sqld-01-q43",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 8"
  ],
  "difficulty": 3,
  "sqlDialect": "oracle",
  "correctChoiceId": "a"
}
```
### stem
아래 `wide` 테이블에 Oracle에서 `UNPIVOT (amount FOR quarter IN (q1, q2, q3))`를 기본 옵션으로 적용했을 때 결과 행 수는?
```text
wide(region, q1, q2, q3)
E | 10   | NULL | 5
W | NULL | NULL | 7
```
### choice: a
3행
### choice: b
6행
### choice: c
4행
### choice: d
2행

## question: sqld-01-q44
```json
{
  "title": "REGEXP_LIKE의 일치 개수",
  "topics": [
    "pivot-regex"
  ],
  "tags": [
    "regexp"
  ],
  "group": "pivot-regex",
  "type": "mc",
  "id": "sqld-01-q44",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 8"
  ],
  "difficulty": 3,
  "sqlDialect": "oracle",
  "correctChoiceId": "b"
}
```
### stem
아래 값이 들어 있는 열에 Oracle에서 `WHERE REGEXP_LIKE(col, '^[A-C][0-9]{2}$')`를 적용했다. 기본 대소문자 구분 옵션일 때 조회되는 행 수는?
```text
col: A12  B7  C123  D45  a99  AB1
```
### choice: a
2행
### choice: b
1행
### choice: c
3행
### choice: d
4행

## question: sqld-01-q45
```json
{
  "title": "MERGE 이후의 값",
  "topics": [
    "management"
  ],
  "tags": [
    "dml-merge"
  ],
  "group": "management",
  "type": "mc",
  "id": "sqld-01-q45",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 9"
  ],
  "difficulty": 3,
  "sqlDialect": "oracle",
  "correctChoiceId": "c"
}
```
### stem
아래 두 테이블에 문장을 실행한 뒤 `tg`에서 id가 2인 행의 `qty`와 전체 행 수를 차례로 나열한 것은?
```text
tg(id, qty): (1, 10)  (2, 20)
sr(id, qty): (2, 5)  (3, 7)
```
```sql
MERGE INTO tg t
USING sr s ON (t.id = s.id)
WHEN MATCHED THEN UPDATE SET t.qty = t.qty + s.qty
WHEN NOT MATCHED THEN INSERT (id, qty) VALUES (s.id, s.qty);
```
### choice: a
5와 3행
### choice: b
25와 2행
### choice: c
25와 3행
### choice: d
20과 3행

## question: sqld-01-q46
```json
{
  "title": "DDL의 암묵적 커밋",
  "topics": [
    "management"
  ],
  "tags": [
    "tcl"
  ],
  "group": "management",
  "type": "mc",
  "id": "sqld-01-q46",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 9"
  ],
  "difficulty": 3,
  "sqlDialect": "oracle",
  "correctChoiceId": "b"
}
```
### stem
Oracle에서 테이블 `t`가 비어 있다. 아래 문장을 차례로 실행한 뒤 `t`의 행 수는?
```sql
INSERT INTO t VALUES (1);
INSERT INTO t VALUES (2);
CREATE TABLE tmp (c NUMBER);
ROLLBACK;
SELECT COUNT(*) FROM t;
```
### choice: a
0
### choice: b
2
### choice: c
1
### choice: d
3

## question: sqld-01-q47
```json
{
  "title": "SQL Server의 TRUNCATE 롤백",
  "topics": [
    "management"
  ],
  "tags": [
    "ddl-truncate"
  ],
  "group": "management",
  "type": "mc",
  "id": "sqld-01-q47",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 9"
  ],
  "difficulty": 3,
  "sqlDialect": "sqlserver",
  "correctChoiceId": "b"
}
```
### stem
SQL Server에서 `t`에 3행이 있다. 아래 문장을 실행한 뒤 `t`의 행 수는?
```sql
BEGIN TRANSACTION;
TRUNCATE TABLE t;
ROLLBACK TRANSACTION;
SELECT COUNT(*) FROM t;
```
### choice: a
0
### choice: b
3
### choice: c
1
### choice: d
2

## question: sqld-01-q48
```json
{
  "title": "ON DELETE CASCADE의 효과",
  "topics": [
    "management"
  ],
  "tags": [
    "constraints"
  ],
  "group": "management",
  "type": "mc",
  "id": "sqld-01-q48",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 9"
  ],
  "difficulty": 3,
  "sqlDialect": "common",
  "correctChoiceId": "d"
}
```
### stem
`child.pid`는 `parent.id`를 참조하는 FK이고 `ON DELETE CASCADE`로 정의되어 있다. `parent`에 id 1과 2가 있고 `child`에 pid가 1인 행 두 개와 pid가 2인 행 한 개가 있다. `DELETE FROM parent WHERE id = 1` 뒤에 `child`에 남는 행 수는?
### choice: a
3행
### choice: b
2행
### choice: c
0행
### choice: d
1행

## question: sqld-01-q49
```json
{
  "title": "UNIQUE 제약과 NULL",
  "topics": [
    "management"
  ],
  "tags": [
    "constraints"
  ],
  "group": "management",
  "type": "mc",
  "id": "sqld-01-q49",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 9"
  ],
  "difficulty": 3,
  "sqlDialect": "oracle",
  "correctChoiceId": "b"
}
```
### stem
Oracle에서 `UNIQUE`가 걸린 단일 열 `code`에 'a', NULL, NULL, 'a'를 차례로 INSERT했다. 결과로 알맞은 것은?
### choice: a
두 번째 문장에서 오류가 나고 2행이 남는다
### choice: b
마지막 문장만 오류가 나고 3행이 남는다
### choice: c
마지막 문장만 오류가 나고 4행이 남는다
### choice: d
모든 문장이 성공해서 4행이 남는다

## question: sqld-01-q50
```json
{
  "title": "DCL에 해당하는 문장",
  "topics": [
    "management"
  ],
  "tags": [
    "dcl"
  ],
  "group": "management",
  "type": "mc",
  "id": "sqld-01-q50",
  "revision": 1,
  "sourceRefs": [
    "SQLD-A 개정 목차",
    "sqld-concepts Part 9"
  ],
  "difficulty": 1,
  "sqlDialect": "common",
  "correctChoiceId": "d"
}
```
### stem
다음 중 DCL에 해당하는 문장은?
### choice: a
ROLLBACK TO SAVEPOINT sp1
### choice: b
UPDATE emp SET sal = sal + 100
### choice: c
TRUNCATE TABLE emp
### choice: d
GRANT SELECT ON emp TO scott
