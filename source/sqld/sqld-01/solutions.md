## question: sqld-01-q01
### solution
정답 근거: 3단계 스키마는 사용자가 보는 외부 스키마와 전체 구조인 개념 스키마와 저장 방식인 내부 스키마로 나뉜다. 풀이: 저장 방식이 바뀌어도 개념 구조가 유지되는 성질이 물리적 독립성이고 개념 구조가 바뀌어도 외부 화면이 유지되는 성질이 논리적 독립성이다. 흔한 실수: 두 독립성의 이름을 서로 바꾸어 외우는 것이다.
### choice-explanation: a
저장 방식과 개념 구조 사이의 독립이 물리적 독립성이다.
### choice-explanation: b
개념 구조와 외부 화면 사이의 독립은 논리적 독립성이다.
### choice-explanation: c
저장 방식을 정의하는 것은 외부 스키마가 아니라 내부 스키마이다.
### choice-explanation: d
사용자의 관점을 정의하는 것은 내부 스키마가 아니라 외부 스키마이다.

## question: sqld-01-q02
### solution
정답 근거: 엔터티는 인스턴스가 두 개 이상이어야 하며 한 건뿐인 정보는 엔터티가 아니라 속성이나 상수에 가깝다. 풀이: 도서와 회원과 대출 이력은 여러 인스턴스가 쌓이고 속성을 가지며 관계를 맺는다. 도서관 이름은 시스템 전체에서 하나뿐이라 따로 관리할 인스턴스 집합이 없다. 흔한 실수: 업무에 등장하는 명사는 모두 엔터티로 만들어야 한다고 보는 것이다.
### choice-explanation: a
대출 이력은 사건이 쌓이는 행위 엔터티로 흔히 모델링한다.
### choice-explanation: b
하나뿐인 값은 인스턴스 집합을 이루지 못해 엔터티의 조건을 채우지 못한다.
### choice-explanation: c
도서는 여러 권이 인스턴스로 쌓이는 대표적인 엔터티이다.
### choice-explanation: d
회원은 여러 사람이 인스턴스가 되는 기본 엔터티이다.

## question: sqld-01-q03
### solution
정답 근거: 관계는 차수(몇 대 몇)와 선택성(반드시 있는지)으로 읽는다. 풀이: 한 부서에 여러 직원이므로 1:M이다. 직원은 반드시 부서에 속하므로 직원 쪽의 부서 참여는 필수이고 부서는 직원이 없을 수 있으므로 부서 쪽의 직원 참여는 선택이다. 흔한 실수: 필수와 선택을 반대로 읽는 것이다.
### choice-explanation: a
필수와 선택이 서로 뒤바뀌었다. 직원은 부서 없이 존재할 수 없다.
### choice-explanation: b
직원은 한 부서에만 속하므로 M:N이 아니다.
### choice-explanation: c
부서가 여러 직원을 가지므로 1:1이 아니다.
### choice-explanation: d
차수는 1:M이고 필수는 직원의 부서 참여이며 선택은 부서의 직원 참여이다.

## question: sqld-01-q04
### solution
정답 근거: 주식별자는 유일성과 최소성과 불변성과 존재성을 만족해야 한다. 풀이: 값이 바뀌면 그 값을 참조하던 다른 엔터티의 연결이 끊어지므로 불변성을 어긴 것이다. 휴대폰 번호는 변경될 수 있어 주식별자로 알맞지 않다. 흔한 실수: 유일하기만 하면 주식별자로 충분하다고 보는 것이다.
### choice-explanation: a
문제는 값이 중복된 것이 아니라 값이 바뀐 것이다.
### choice-explanation: b
속성의 개수가 아니라 값의 변경이 문제를 일으켰다.
### choice-explanation: c
값이 바뀌어 연결이 끊어지는 것은 불변성을 어긴 결과이다.
### choice-explanation: d
값이 비어 있는 것이 아니라 값이 바뀐 것이 문제이다.

## question: sqld-01-q05
### solution
정답 근거: 슈퍼타입과 서브타입은 하나의 테이블로 통합하거나 서브타입별로 나누거나 모두 만드는 방식으로 변환한다. 풀이: 서브타입의 차이가 작고 전체를 함께 조회하는 일이 많으면 조인 없이 읽을 수 있는 단일 테이블이 알맞다. 서브타입 구분은 구분 열로 표현한다. 흔한 실수: 서브타입은 반드시 별도 테이블이어야 한다고 보는 것이다.
### choice-explanation: a
1:1 테이블은 전체를 조회할 때마다 조인이 필요해 이 상황에서 비효율적이다.
### choice-explanation: b
차이가 작고 전체 조회가 많으면 하나의 테이블로 합치는 방식이 알맞다.
### choice-explanation: c
서브타입별 테이블은 전체 조회를 합집합으로 처리해야 해 번거롭다.
### choice-explanation: d
서브타입의 고유 속성을 버리면 업무 정보가 사라진다.

## question: sqld-01-q06
### solution
정답 근거: 기본키가 아닌 속성이 다른 비키 속성을 결정하면 이행 종속이며 제3정규형 위반이다. 풀이: 사번이 부서코드를 정하고 부서코드가 부서명을 정하므로 부서명은 키가 아닌 부서코드를 거쳐 종속된다. 부서 테이블을 분리해야 한다. 기본키가 단일 속성이라 부분 종속은 생기지 않는다. 흔한 실수: 이행 종속을 부분 종속과 혼동하는 것이다.
### choice-explanation: a
기본키가 단일 속성이므로 부분 종속은 있을 수 없다.
### choice-explanation: b
키가 아닌 속성을 거쳐 결정되는 종속이 이행 종속이다.
### choice-explanation: c
각 칸은 하나의 값이라 제1정규형은 만족한다.
### choice-explanation: d
부서코드는 후보키가 아닌 결정자이므로 보이스코드 정규형도 만족하지 못한다.

## question: sqld-01-q07
### solution
정답 근거: 인조 식별자는 업무 의미가 없는 번호라 단일 속성이고 변하지 않는 장점이 있다. 풀이: 업무 의미가 없으므로 같은 주문이 일련번호만 다르게 중복 입력되어도 기본키가 막지 못한다. 그래서 주문번호 같은 업무 키에 UNIQUE 제약을 함께 둔다. 흔한 실수: 인조 식별자가 업무 데이터의 중복도 막아 준다고 보는 것이다.
### choice-explanation: a
일련번호는 한번 부여되면 바뀌지 않아 참조에 알맞다.
### choice-explanation: b
일련번호는 단일 속성이라 복합 키 문제가 줄어든다.
### choice-explanation: c
일련번호는 업무에서 오는 값이 아니라 만들어 붙인 값이다.
### choice-explanation: d
업무 의미가 없어 중복 입력을 막지 못하므로 업무 키의 UNIQUE 제약이 필요하다.

## question: sqld-01-q08
### solution
정답 근거: 조인은 조건으로 행을 연결하는 연산이고 FK 제약은 값의 무결성을 지키는 규칙이다. 풀이: 두 열의 값이 업무적으로 대응하면 FK가 없어도 조인할 수 있다. FK는 부모에 없는 값이 자식에 들어가는 것을 막을 뿐 조인 결과를 바꾸지 않는다. 흔한 실수: 조인에 FK가 반드시 필요하다고 보는 것이다.
### choice-explanation: a
FK가 없어도 조인은 가능하다. FK는 무결성을 위한 제약이다.
### choice-explanation: b
PK와 FK가 아닌 열끼리도 조인할 수 있다.
### choice-explanation: c
조인 조건은 FK 제약과 별개로 값의 대응에 따라 쓸 수 있다.
### choice-explanation: d
FK 제약은 입력 값을 검증할 뿐 조회 결과를 줄이지 않는다.

## question: sqld-01-q09
### solution
정답 근거: 원자성은 트랜잭션의 작업이 전부 반영되거나 전부 취소되는 성질이다. 풀이: 출금만 반영되고 입금이 빠지면 돈이 사라지므로 두 작업이 한 묶음으로 처리되어야 한다. 일관성과 격리성과 지속성은 각각 규칙 유지와 간섭 방지와 결과 보존을 뜻한다. 흔한 실수: 일관성과 원자성을 같은 뜻으로 보는 것이다.
### choice-explanation: a
전부 성공하거나 전부 취소하는 요구가 원자성이다.
### choice-explanation: b
일관성은 규칙 유지를 뜻하며 작업의 전부 반영 여부와 다르다.
### choice-explanation: c
격리성은 동시에 실행되는 트랜잭션 사이의 간섭을 막는 성질이다.
### choice-explanation: d
지속성은 커밋 이후의 보존을 뜻하며 취소 여부와 무관하다.

## question: sqld-01-q10
### solution
정답 근거: `COUNT(*)`는 모든 행을 세고 `COUNT(열)`과 `AVG(열)`은 NULL을 제외한다. 풀이: 행은 3개이므로 `COUNT(*)`는 3이다. NULL이 아닌 값이 2개이므로 `COUNT(c)`는 2이고 `AVG(c)`는 10과 20의 평균인 15이다. 흔한 실수: NULL을 0으로 보아 평균을 10으로 계산하는 것이다.
### choice-explanation: a
`COUNT(c)`는 NULL을 세지 않으므로 3이 아니다.
### choice-explanation: b
`COUNT(*)`는 NULL이 있는 행도 세므로 2가 아니다.
### choice-explanation: c
`AVG`는 NULL을 0으로 보지 않고 제외하므로 10이 아니다.
### choice-explanation: d
행 수는 3이고 NULL을 뺀 개수는 2이며 평균은 NULL을 뺀 15이다.

## question: sqld-01-q11
### solution
정답 근거: SELECT의 처리 순서는 FROM과 WHERE와 GROUP BY와 HAVING과 SELECT와 ORDER BY 순이다. 풀이: `WHERE`는 `SELECT`보다 먼저 실행되어 별칭 `annual`이 아직 정의되지 않았으므로 오류가 난다. `ORDER BY`는 `SELECT` 뒤에 실행되어 별칭을 쓸 수 있다. 흔한 실수: 별칭을 어느 절에서나 쓸 수 있다고 보는 것이다.
### choice-explanation: a
`ORDER BY`는 별칭을 쓸 수 있다.
### choice-explanation: b
별칭 대신 식을 그대로 쓰면 `WHERE`에서도 오류가 나지 않는다.
### choice-explanation: c
`WHERE`가 `SELECT`보다 먼저 실행되어 별칭을 아직 알지 못한다.
### choice-explanation: d
식을 그대로 쓴 `ORDER BY`도 문제없이 실행된다.

## question: sqld-01-q12
### solution
정답 근거: 논리 연산자는 `NOT`, `AND`, `OR` 순서로 우선한다. 풀이: 조건은 `a = 1 OR (b = 2 AND c = 3)`이다. 1행과 2행과 5행은 `a = 1`이라 참이고 3행은 `b = 2 AND c = 3`이 참이다. 4행은 둘 다 거짓이라 제외되어 모두 4개이다. 흔한 실수: 왼쪽부터 `(a = 1 OR b = 2) AND c = 3`으로 읽어 2개로 세는 것이다.
### choice-explanation: a
왼쪽에서부터 묶은 계산이다. AND가 OR보다 우선한다.
### choice-explanation: b
4행은 어느 쪽 조건도 만족하지 못해 포함되지 않는다.
### choice-explanation: c
4행은 제외되므로 전체 5행이 모두 선택되지는 않는다.
### choice-explanation: d
AND를 먼저 묶으면 4개의 행이 조건을 만족한다.

## question: sqld-01-q13
### solution
정답 근거: `_`는 정확히 한 글자를 `%`는 0글자 이상을 뜻한다. 풀이: 패턴은 4글자이고 둘째와 넷째 글자가 A이다. DATA와 MAMA와 BARA가 맞고 DAD는 3글자이고 BANANA는 6글자이며 NAAN은 넷째 글자가 N이라 제외된다. 흔한 실수: `_`를 0글자 이상으로 읽는 것이다.
### choice-explanation: a
DATA와 MAMA와 BARA 세 행이 맞으므로 2개가 아니다.
### choice-explanation: b
NAAN은 넷째 글자가 N이라 맞지 않는다.
### choice-explanation: c
DAD와 BANANA는 글자 수가 달라 맞지 않는다.
### choice-explanation: d
글자 수와 둘째 넷째 글자가 모두 맞는 세 행이 조회된다.

## question: sqld-01-q14
### solution
정답 근거: Oracle의 `SUBSTR`은 시작 위치가 음수이면 문자열 끝에서부터 센다. 풀이: `DATABASE`는 8글자이고 끝에서 네 번째 글자는 다섯 번째 글자 B이다. 거기서 2글자를 가져오면 BA이다. 흔한 실수: 음수를 무시하고 앞에서부터 세는 것이다.
### choice-explanation: a
AS는 끝에서 세 번째 글자부터 가져온 값과 다르다.
### choice-explanation: b
끝에서 네 번째인 B부터 두 글자를 가져온다.
### choice-explanation: c
TA는 앞에서 세 번째 글자부터 가져온 값이다.
### choice-explanation: d
AB는 앞에서 네 번째 글자부터 가져온 값이다.

## question: sqld-01-q15
### solution
정답 근거: SQL Server에서 `+` 연산은 피연산자가 NULL이면 결과가 NULL이고 `CONCAT` 함수는 NULL을 빈 문자열처럼 다룬다. 풀이: 첫째 식은 NULL이 끼어 있어 전체가 NULL이다. 둘째 식은 NULL을 건너뛰고 `A`와 `B`를 이어 `AB`가 된다. 흔한 실수: 두 방식이 NULL을 같게 다룬다고 보는 것이다.
### choice-explanation: a
두 방식의 결과가 서로 바뀌어 있다.
### choice-explanation: b
`+`가 NULL을 건너뛰지는 않는다. 첫째 결과는 NULL이다.
### choice-explanation: c
`CONCAT`은 NULL을 만나도 결과 전체가 NULL이 되지 않는다.
### choice-explanation: d
`+`는 NULL 전파이고 `CONCAT`은 NULL을 빈 문자열로 다룬다.

## question: sqld-01-q16
### solution
정답 근거: `COALESCE`는 처음으로 NULL이 아닌 값을 반환하고 `NULLIF(a, b)`는 두 값이 같으면 NULL을 아니면 a를 반환한다. 풀이: 처음 두 인자가 NULL이므로 `COALESCE`는 세 번째 인자 3을 반환한다. `NULLIF(5, 5)`는 두 값이 같아 NULL이다. 흔한 실수: `NULLIF`가 같을 때 첫 값을 돌려준다고 보는 것이다.
### choice-explanation: a
`NULLIF(5, 5)`는 두 값이 같으므로 5가 아니라 NULL이다.
### choice-explanation: b
`COALESCE`는 NULL이 아닌 값 3을 찾으므로 NULL이 아니다.
### choice-explanation: c
처음 NULL이 아닌 3과 같을 때 NULL이 되는 결과의 조합이다.
### choice-explanation: d
`COALESCE`는 마지막 인자가 아니라 처음 NULL이 아닌 값을 반환한다.

## question: sqld-01-q17
### solution
정답 근거: `WHERE`가 행을 먼저 거른 뒤 그룹을 만들고 `HAVING`이 그룹을 거른다. 풀이: `amount >= 60`으로 W의 50과 N의 NULL이 빠진다. 남은 합계는 E가 300 W가 60 N이 400이다. `HAVING SUM(amount) > 100`으로 W가 빠져 E와 N의 2행이 남는다. 흔한 실수: `WHERE` 없이 계산해 W의 합계 110이 포함되어 3행이라고 보는 것이다.
### choice-explanation: a
`WHERE`로 W의 50이 빠지면 W의 합계가 60이 되어 `HAVING`에서 제외된다.
### choice-explanation: b
`WHERE`를 적용하지 않은 합계로 계산한 결과이다. W가 110으로 포함된다.
### choice-explanation: c
E와 N 두 그룹이 모두 100을 넘으므로 1행에서 그치지 않는다.
### choice-explanation: d
그룹은 세 개뿐이라 4행이 나올 수 없다.

## question: sqld-01-q18
### solution
정답 근거: Oracle은 NULL을 가장 큰 값으로 보고 SQL Server는 가장 작은 값으로 본다. 풀이: 그래서 오름차순에서 Oracle은 NULL이 마지막이고 SQL Server는 처음이다. Oracle은 `NULLS FIRST`나 `NULLS LAST`로 위치를 바꿀 수 있다. 흔한 실수: 두 DBMS의 동작을 같거나 반대로 외우는 것이다.
### choice-explanation: a
Oracle은 NULL을 가장 큰 값으로 SQL Server는 가장 작은 값으로 본다.
### choice-explanation: b
두 DBMS의 위치가 서로 바뀌어 있다.
### choice-explanation: c
SQL Server에서 오름차순의 NULL은 처음에 놓인다.
### choice-explanation: d
NULL 행은 정렬 대상에서 빠지지 않고 결과에 포함된다.

## question: sqld-01-q19
### solution
정답 근거: 내부 조인은 조건이 모두 맞는 행의 조합만 남긴다. 풀이: 주문 10은 고객 1과 짝이 되고 항목이 2개라 2행이다. 주문 11은 고객 1이고 항목이 1개라 1행이다. 주문 12는 항목이 없어 빠지고 주문 13은 고객이 NULL이라 `=` 조건이 맞지 않아 빠진다. 합계는 3행이다. 흔한 실수: NULL 키도 조인된다고 보는 것이다.
### choice-explanation: a
고객이 NULL인 주문 13은 조인 조건이 맞지 않아 포함되지 않는다.
### choice-explanation: b
주문 10의 두 항목과 주문 11의 한 항목으로 3행이다.
### choice-explanation: c
주문 10의 항목이 2개라 2행에서 그치지 않는다.
### choice-explanation: d
항목이 없는 주문 12는 내부 조인에서 제외되어 5행이 될 수 없다.

## question: sqld-01-q20
### solution
정답 근거: 완전 외부 조인은 내부 조인 결과에 양쪽의 짝 없는 행을 더한다. 풀이: 짝이 있는 k는 2와 3으로 2행이다. `x`의 1은 짝이 없어 1행이고 `y`의 4 두 개는 짝이 없어 2행이다. 합계는 2 + 1 + 2 = 5행이다. 흔한 실수: 중복된 짝 없는 행을 하나로 세는 것이다.
### choice-explanation: a
`y`의 4가 두 행이라 짝 없는 행을 하나로 세면 4행이 된다.
### choice-explanation: b
내부 조인 결과를 두 번 세면 5행보다 늘어난다.
### choice-explanation: c
짝 없는 행은 3개뿐이라 7행이 될 수 없다.
### choice-explanation: d
짝이 있는 2행에 `x`의 짝 없는 1행과 `y`의 짝 없는 2행을 더한다.

## question: sqld-01-q21
### solution
정답 근거: `USING` 절에 쓴 열은 두 테이블의 같은 이름 열을 하나로 합쳐 보여 주며 테이블 별칭을 붙일 수 없다. 풀이: `d.deptno`처럼 별칭을 붙이면 Oracle이 오류를 낸다. 별칭 없이 `deptno`로 쓰면 합쳐진 열 하나를 읽는다. `ON` 조인에서는 별칭을 붙여도 된다. 흔한 실수: `USING` 열에도 별칭을 붙일 수 있다고 보는 것이다.
### choice-explanation: a
별칭 없이 `USING` 열을 쓰는 것은 올바른 문법이다.
### choice-explanation: b
`USING` 열이 아닌 열에는 별칭을 붙여도 된다.
### choice-explanation: c
`USING` 열에 테이블 별칭을 붙이면 Oracle에서 오류가 난다.
### choice-explanation: d
`ON` 절에서는 별칭을 붙인 열을 쓸 수 있다.

## question: sqld-01-q22
### solution
정답 근거: 조인은 일치하는 행의 모든 조합을 만들고 외부 조인은 기준 쪽의 짝 없는 행을 더한다. 풀이: k=1은 2 × 1 = 2행이고 k=2는 1 × 2 = 2행이라 내부 조인은 4행이다. `b`의 3은 `a`에 짝이 없어 오른쪽 외부 조인은 1행을 더한 5행이다. 흔한 실수: 중복 키를 합쳐 행 수를 세는 것이다.
### choice-explanation: a
중복 키는 합쳐지지 않고 모든 조합이 만들어진다.
### choice-explanation: b
조합 수는 2 + 2 = 4이고 오른쪽 짝 없는 `b`의 3이 하나 더해진다.
### choice-explanation: c
오른쪽 외부 조인은 짝 없는 `b`의 행을 더하므로 내부 조인과 같지 않다.
### choice-explanation: d
내부 조인의 행 수가 5가 되려면 조합이 하나 더 있어야 한다.

## question: sqld-01-q23
### solution
정답 근거: Oracle의 `(+)`는 짝이 없을 수 있는 쪽에 붙이며 반대쪽 행이 모두 남는다. 풀이: `b.k(+)`이므로 `b`가 NULL로 채워질 수 있는 쪽이고 `a`가 기준이라 `a`의 모든 행이 남는다. 이 문법은 완전 외부 조인을 표현하지 못한다. 흔한 실수: `(+)`가 붙은 쪽의 행이 모두 남는다고 보는 것이다.
### choice-explanation: a
`(+)`가 붙은 쪽이 남는 쪽이라는 반대 해석이다.
### choice-explanation: b
`(+)` 문법만으로는 양쪽을 모두 남기는 완전 외부 조인을 표현할 수 없다.
### choice-explanation: c
`(+)`가 붙은 `b`가 NULL로 채워지고 기준인 `a`의 행이 모두 남는다.
### choice-explanation: d
`(+)`가 있으면 짝이 없는 행도 남으므로 내부 조인이 아니다.

## question: sqld-01-q24
### solution
정답 근거: `=` 같은 단일 행 연산자는 서브쿼리가 한 행만 반환해야 한다. 풀이: `dept = 'A'`인 행이 여러 개이면 서브쿼리가 여러 행을 반환해 `=` 비교에서 오류가 난다. `IN`과 `ALL`은 다중 행을 받을 수 있고 `MAX`는 한 행으로 줄인다. 흔한 실수: 서브쿼리가 항상 한 행이라고 가정하는 것이다.
### choice-explanation: a
`IN`은 여러 행을 받을 수 있는 다중 행 연산자이다.
### choice-explanation: b
`=`로 여러 행을 비교하면 오류가 난다.
### choice-explanation: c
`MAX`로 한 행을 만들면 `=`와 함께 써도 된다.
### choice-explanation: d
`ALL`은 여러 행을 받는 다중 행 연산자이다.

## question: sqld-01-q25
### solution
정답 근거: `> ALL`은 서브쿼리의 최댓값보다 크고 `> ANY`는 최솟값보다 크다. 풀이: 서브쿼리 값은 2와 4이다. `> ALL`은 4보다 큰 5 하나이고 `> ANY`는 2보다 큰 3과 4와 5 세 행이다. 흔한 실수: ALL과 ANY의 기준 값을 반대로 잡는 것이다.
### choice-explanation: a
ALL과 ANY의 기준이 서로 바뀐 결과이다.
### choice-explanation: b
`> ANY`는 2보다 큰 모든 값을 포함해 1행에 그치지 않는다.
### choice-explanation: c
`> ALL`은 4보다 큰 값만 포함해 3행이 될 수 없다.
### choice-explanation: d
4보다 큰 값은 하나이고 2보다 큰 값은 셋이다.

## question: sqld-01-q26
### solution
정답 근거: `= ANY`는 결과 중 하나와 같다는 뜻이라 `IN`과 같고 `<> ALL`은 모두와 다르다는 뜻이라 `NOT IN`과 같다. 풀이: `> ANY`는 최솟값보다 크고 `< ALL`은 최솟값보다 작은 값을 고른다. 흔한 실수: `ANY`와 `ALL`의 기준을 최댓값과 최솟값으로 섞는 것이다.
### choice-explanation: a
`<> ALL`은 `IN`이 아니라 `NOT IN`과 같다.
### choice-explanation: b
`> ANY`는 최댓값이 아니라 최솟값보다 큰 값을 선택한다.
### choice-explanation: c
`< ALL`은 최댓값이 아니라 최솟값보다 작은 값을 선택한다.
### choice-explanation: d
`= ANY`와 `IN`은 같은 조건이다.

## question: sqld-01-q27
### solution
정답 근거: `NOT IN`의 목록에 NULL이 있으면 비교가 UNKNOWN이 되어 결과가 비고 `NOT EXISTS`는 NULL의 영향이 없다. 풀이: `NOT EXISTS`는 직원이 없는 부서 2 하나를 반환한다. `NOT IN (1, 1, 3, NULL)`은 어떤 id에서도 참이 되지 못해 0행이다. 흔한 실수: 두 쿼리가 항상 같은 결과를 낸다고 보는 것이다.
### choice-explanation: a
`NOT IN`의 목록에 NULL이 있어 부서 2도 조건을 통과하지 못한다.
### choice-explanation: b
`NOT EXISTS`가 0행이려면 모든 부서에 직원이 있어야 한다.
### choice-explanation: c
`NOT EXISTS`는 부서 2를 찾고 `NOT IN`은 NULL 때문에 비어 버린다.
### choice-explanation: d
직원이 없는 부서는 2 하나뿐이라 2행이 될 수 없다.

## question: sqld-01-q28
### solution
정답 근거: `MINUS`는 앞 결과에서 뒤 결과에 있는 값을 빼고 중복을 제거하는 차집합이다. 풀이: 앞 결과의 고유 값은 1과 2와 3이고 뒤 결과의 2를 빼면 1과 3 두 행이 남는다. 중복된 2는 중복 제거 대상이라 개수를 따로 세지 않는다. 흔한 실수: 중복을 유지해 2를 한 번만 빼고 행 수를 세는 것이다.
### choice-explanation: a
`MINUS`는 같은 값을 모두 제거하므로 2가 한 개 남지 않는다.
### choice-explanation: b
1과 3 두 행이 남으므로 1행에 그치지 않는다.
### choice-explanation: c
고유 값에서 2를 빼면 1과 3 두 행이 남는다.
### choice-explanation: d
중복이 제거되므로 4행이 될 수 없다.

## question: sqld-01-q29
### solution
정답 근거: 집합 연산의 각 SELECT는 열 개수가 같고 같은 위치의 자료형이 호환되어야 하며 `ORDER BY`는 맨 끝에만 쓴다. 풀이: 열 이름이 달라도 위치로 합쳐지고 결과 열 이름은 첫 번째 SELECT를 따른다. `UNION`은 중복을 제거하고 `UNION ALL`이 중복을 유지한다. 흔한 실수: `UNION`이 중복을 유지한다고 보는 것이다.
### choice-explanation: a
열 개수가 같아야 하고 정렬은 전체 결과 끝에 한 번 쓴다.
### choice-explanation: b
중복을 유지하는 것은 `UNION ALL`이다.
### choice-explanation: c
열 이름이 달라도 위치가 같고 자료형이 호환되면 합칠 수 있다.
### choice-explanation: d
정렬은 각 SELECT가 아니라 전체 결과의 맨 끝에 쓴다.

## question: sqld-01-q30
### solution
정답 근거: `ROLLUP`은 오른쪽 열부터 하나씩 줄이며 소계를 만들고 `CUBE`는 모든 조합의 소계를 만든다. 풀이: 상세 4행에 `ROLLUP`은 지역별 소계 2행과 총계 1행을 더해 7행이다. `CUBE`는 여기에 상품별 소계 2행을 더해 9행이다. 흔한 실수: 소계 단위의 개수를 열 개수 + 1과 2의 거듭제곱으로 구분하지 못하는 것이다.
### choice-explanation: a
총계 행을 빼먹고 센 값이다. 총계도 한 행으로 나온다.
### choice-explanation: b
ROLLUP은 상품별 소계를 만들지 않아 8행이 될 수 없다.
### choice-explanation: c
ROLLUP은 상품별 소계를 만들지 않아 CUBE보다 행이 적다.
### choice-explanation: d
상세 4행에 ROLLUP은 소계 3행 CUBE는 소계 5행을 더한다.

## question: sqld-01-q31
### solution
정답 근거: `GROUPING(열)`은 그 열이 소계 때문에 집계에서 빠져 NULL이 되었으면 1을 아니면 0을 반환한다. 풀이: 지역 E의 소계는 지역은 E로 그대로이고 상품만 집계에서 빠졌다. 그래서 `GROUPING(region)`은 0이고 `GROUPING(item)`은 1이다. 흔한 실수: 원래 NULL인 값에도 1이 나온다고 보는 것이다.
### choice-explanation: a
두 값의 판단이 서로 바뀌었다.
### choice-explanation: b
상품 열은 소계 때문에 비었으므로 0이 될 수 없다.
### choice-explanation: c
지역은 남아 있어 0이고 상품은 소계로 빠져 1이다.
### choice-explanation: d
지역 열은 값이 남아 있으므로 1이 될 수 없다. 둘 다 1인 행은 총계이다.

## question: sqld-01-q32
### solution
정답 근거: `GROUPING SETS`는 지정한 집계 단위만 만든다. 풀이: 지역별 집계가 2행이고 상품별 집계가 2행이다. 지정하지 않은 총계나 상세 행은 만들어지지 않으므로 합계는 4행이다. 흔한 실수: 총계 행이 자동으로 포함된다고 보는 것이다.
### choice-explanation: a
지정한 두 집계 단위의 행이 2 + 2 = 4행이다.
### choice-explanation: b
총계는 지정하지 않으면 만들어지지 않아 5행이 아니다.
### choice-explanation: c
상세 행과 소계를 모두 만드는 것은 `CUBE`이다.
### choice-explanation: d
집계 단위 두 개가 각각 2행씩 만들어져 2행에 그치지 않는다.

## question: sqld-01-q33
### solution
정답 근거: `RANK`는 동률 뒤 순위를 건너뛰고 `DENSE_RANK`는 건너뛰지 않으며 `ROW_NUMBER`는 동률에도 다른 번호를 준다. 풀이: 90 두 행이 1위라 `RANK`는 80을 3위로 `DENSE_RANK`는 2위로 매긴다. `ROW_NUMBER`는 앞에 두 행이 있어 3이다. 흔한 실수: `RANK`가 동률 뒤 순위를 건너뛰지 않는다고 보는 것이다.
### choice-explanation: a
RANK는 동률 뒤 순위를 건너뛰므로 2가 아니라 3이다.
### choice-explanation: b
DENSE_RANK는 건너뛰지 않으므로 3이 아니라 2이다.
### choice-explanation: c
동률 두 행 뒤라 RANK는 3 DENSE_RANK는 2 ROW_NUMBER는 3이다.
### choice-explanation: d
ROW_NUMBER는 동률에도 번호를 계속 증가시키므로 2가 아니라 3이다.

## question: sqld-01-q34
### solution
정답 근거: `ORDER BY`만 있는 윈도우의 기본 프레임은 처음부터 현재 행까지이며 RANGE 방식이라 정렬 값이 같은 행을 함께 포함한다. 풀이: `k`가 2인 두 행은 같은 정렬 값이라 모두 현재 행에 포함된다. 그래서 두 행 모두 10 + 20 + 30 = 60이다. 흔한 실수: 행 단위 누적으로 보아 20 다음 50으로 계산하는 것이다.
### choice-explanation: a
정렬 값이 같은 행은 함께 포함되어 두 행의 누적 합이 모두 60이다.
### choice-explanation: b
행 단위로 누적하면 20과 50이지만 기본 프레임은 값 범위 기준이다.
### choice-explanation: c
한 행만 따로 계산하지 않으며 같은 값의 행은 같은 누적 합이 된다.
### choice-explanation: d
두 행 모두 10을 포함하므로 50에서 그치지 않는다.

## question: sqld-01-q35
### solution
정답 근거: `ROWS BETWEEN 1 PRECEDING AND CURRENT ROW`는 현재 행과 바로 앞 한 행만 대상으로 한다. 풀이: 세 번째 행은 앞 행의 20과 자신의 40을 평균해 30이다. 처음부터 현재 행까지의 평균은 약 23.33으로 이 프레임과 다르다. 흔한 실수: 프레임을 처음부터 현재 행까지로 보는 것이다.
### choice-explanation: a
처음부터 현재 행까지의 평균이며 지정한 프레임과 다르다.
### choice-explanation: b
직전 행 20과 현재 행 40의 평균이 30이다.
### choice-explanation: c
현재 행만 대상으로 하면 40이지만 프레임은 앞 한 행을 포함한다.
### choice-explanation: d
직전 행만 대상으로 한 값이며 현재 행도 포함해야 한다.

## question: sqld-01-q36
### solution
정답 근거: `LAG(열, n, 기본값)`은 n행 앞의 값을 `LEAD`는 n행 뒤의 값을 반환하고 범위를 벗어나면 기본값이나 NULL이다. 풀이: 두 번째 행의 한 행 앞은 100이다. `LEAD(sal)`은 기본값이 없어 마지막 행에서 뒤 행이 없으므로 NULL이다. 흔한 실수: 범위를 벗어난 값이 항상 0이라고 보는 것이다.
### choice-explanation: a
두 번째 행의 앞 행은 100이고 기본값 없는 LEAD의 마지막 행은 NULL이다.
### choice-explanation: b
기본값을 지정하지 않은 `LEAD`의 범위 밖 값은 0이 아니라 NULL이다.
### choice-explanation: c
두 번째 행의 `LAG`는 첫 행의 값 100이다. 기본값 0은 첫 행에 쓰인다.
### choice-explanation: d
`LAG`는 앞 행의 값이고 `LEAD`는 뒤 행의 값이라 둘 다 200이나 300이 아니다.

## question: sqld-01-q37
### solution
정답 근거: `ROWNUM`은 정렬하기 전에 읽힌 순서대로 번호가 붙는다. 풀이: `WHERE ROWNUM <= 3`이 먼저 적용되어 앞의 3행만 남고 그 결과를 정렬한다. 급여 상위 3명을 구하려면 정렬을 인라인 뷰 안에서 끝낸 뒤 바깥에서 `ROWNUM`을 걸어야 한다. 흔한 실수: 정렬한 뒤 번호가 붙는다고 보는 것이다.
### choice-explanation: a
정렬 후 상위 3개를 구하려면 인라인 뷰가 필요하다.
### choice-explanation: b
둘을 함께 써도 오류는 나지 않으며 결과가 기대와 다를 뿐이다.
### choice-explanation: c
번호가 정렬 전에 붙어 앞의 3행만 고른 뒤 그 행들만 정렬한다.
### choice-explanation: d
`ROWNUM`은 3행을 넘지 않게 제한하므로 동률 행이 더 포함되지 않는다.

## question: sqld-01-q38
### solution
정답 근거: `TOP n WITH TIES`는 n번째 행과 정렬 값이 같은 행을 모두 포함한다. 풀이: 정렬하면 90, 90, 85, 85, 80이고 세 번째 행의 값은 85이다. 85와 같은 네 번째 행도 포함되어 4행이다. `WITH TIES`는 `ORDER BY`가 있어야 한다. 흔한 실수: 항상 n행만 반환한다고 보는 것이다.
### choice-explanation: a
`WITH TIES` 없이 `TOP 3`이면 3행이다. 동률은 더 포함된다.
### choice-explanation: b
상위 두 행만으로는 3행째의 동률을 판단하지 못한다.
### choice-explanation: c
세 번째 값 85와 같은 네 번째 행이 함께 포함된다.
### choice-explanation: d
마지막 80은 85와 같지 않아 포함되지 않는다.

## question: sqld-01-q39
### solution
정답 근거: 계층 질의에서 루트가 `LEVEL` 1이고 한 단계 내려갈 때마다 1씩 커진다. 풀이: 루트 1이 레벨 1이고 2와 3이 레벨 2이다. 2의 자식 4와 5와 3의 자식 6이 레벨 3이라 모두 3개이다. 흔한 실수: 레벨 2의 개수를 세는 것이다.
### choice-explanation: a
루트에서 두 단계 내려간 4와 5와 6이 레벨 3이다.
### choice-explanation: b
2개는 레벨 2에 해당하는 2와 3의 개수이다.
### choice-explanation: c
레벨 3의 노드는 4와 5와 6 세 개이다.
### choice-explanation: d
계층의 전체 행은 6개이며 레벨 3은 그중 3개이다.

## question: sqld-01-q40
### solution
정답 근거: `PRIOR mgr = id`는 부모 행의 `mgr` 값이 자식 행의 `id`와 같다는 뜻이라 자식에서 부모로 올라가는 역방향이다. 풀이: id 5에서 시작해 그의 mgr인 2를 거쳐 2의 mgr인 1에 도달한다. 5와 2와 1의 3행이 반환되고 마지막 행 1의 `LEVEL`은 3이다. 흔한 실수: 항상 위에서 아래로 내려간다고 보는 것이다.
### choice-explanation: a
시작 행 하나만 반환하는 것이 아니라 조상까지 올라간다.
### choice-explanation: b
5에서 위로 2와 1까지 올라가 3행이고 마지막 행의 레벨은 3이다.
### choice-explanation: c
올라가면서 레벨이 1씩 커지므로 마지막 행의 레벨은 1이 아니다.
### choice-explanation: d
아래로 내려가는 방향이 아니므로 전체 6행이 나오지 않는다.

## question: sqld-01-q41
### solution
정답 근거: 셀프 조인은 같은 테이블을 별칭 둘로 보고 직원의 `mgr`을 상사의 `id`에 연결한다. 풀이: 직원 3의 급여 600은 상사 1의 500보다 많고 직원 5의 급여 350은 상사 2의 300보다 많다. 나머지는 상사보다 적거나 상사가 없어 제외되므로 2행이다. 흔한 실수: 상사가 없는 루트를 포함하거나 한 직원만 비교하는 것이다.
### choice-explanation: a
직원 3과 5가 자기 상사보다 급여가 많다.
### choice-explanation: b
직원 3 하나만 센 값이다. 직원 5도 상사 2보다 급여가 많다.
### choice-explanation: c
상사보다 급여가 적은 직원 2와 4와 6은 포함되지 않는다.
### choice-explanation: d
상사가 없는 루트는 조인 조건에 맞지 않아 포함되지 않는다.

## question: sqld-01-q42
### solution
정답 근거: `PIVOT`은 지정한 열의 값을 열로 돌리고 집계 함수로 같은 조합의 값을 합친다. 풀이: E의 Q1은 10과 5를 합해 15이다. W는 Q2 행이 없으므로 집계할 값이 없어 NULL이다. 흔한 실수: 비어 있는 조합을 0으로 보는 것이다.
### choice-explanation: a
값이 없는 조합은 0이 아니라 NULL로 나온다.
### choice-explanation: b
E의 Q1은 두 행이 `SUM`으로 합쳐져 10이 아니라 15이다.
### choice-explanation: c
집계 결과이므로 단일 행의 값이 그대로 나오지 않는다.
### choice-explanation: d
같은 조합은 합산되어 15이고 값이 없는 조합은 NULL이다.

## question: sqld-01-q43
### solution
정답 근거: `UNPIVOT`은 열을 행으로 돌리며 기본 옵션은 값이 NULL인 행을 결과에서 뺀다. 풀이: E는 NULL이 아닌 q1과 q3 2행이고 W는 q3 1행이다. NULL인 칸은 모두 빠져 3행이다. NULL을 남기려면 `INCLUDE NULLS`를 쓴다. 흔한 실수: 열 개수만큼 행이 항상 생긴다고 보는 것이다.
### choice-explanation: a
NULL이 아닌 칸 3개만 행이 된다.
### choice-explanation: b
열 3개 × 행 2개를 모두 행으로 만들면 6행이지만 기본은 NULL을 뺀다.
### choice-explanation: c
NULL이 아닌 값이 3개이므로 4행이 될 수 없다.
### choice-explanation: d
E에서 2행 W에서 1행이 나오므로 2행에서 그치지 않는다.

## question: sqld-01-q44
### solution
정답 근거: 패턴은 시작과 끝 사이에 A에서 C 중 한 글자와 숫자 정확히 두 개가 있는 문자열이다. 풀이: A12만 맞는다. B7은 숫자가 하나이고 C123은 숫자가 셋이며 D45는 첫 글자가 범위 밖이고 AB1은 둘째 글자가 숫자가 아니다. Oracle의 기본 일치는 대소문자를 구분하므로 소문자 a99도 맞지 않는다. 흔한 실수: 대소문자를 무시하고 a99를 포함하는 것이다.
### choice-explanation: a
a99는 대소문자를 구분하는 기본 설정에서 맞지 않는다.
### choice-explanation: b
`^`와 `$` 사이에 문자 하나와 숫자 정확히 둘만 있는 A12 하나가 맞다.
### choice-explanation: c
B7과 C123은 숫자 개수가 달라 맞지 않는다.
### choice-explanation: d
D45의 첫 글자는 범위 `[A-C]`에 없다.

## question: sqld-01-q45
### solution
정답 근거: `MERGE`는 조건에 맞는 행은 갱신하고 맞지 않는 원본 행은 삽입한다. 풀이: id 2는 일치해 `qty`가 20 + 5 = 25가 된다. id 3은 대상에 없어 새 행으로 삽입된다. id 1은 그대로 남아 전체는 3행이다. 흔한 실수: 갱신이 덧셈이 아니라 대입이라고 보거나 삽입을 빼먹는 것이다.
### choice-explanation: a
갱신은 기존 값에 더하는 식이라 5로 대체되지 않는다.
### choice-explanation: b
일치하지 않는 id 3은 삽입되어 전체가 2행에서 그치지 않는다.
### choice-explanation: c
일치한 id 2는 더한 값 25이고 id 3이 삽입되어 3행이다.
### choice-explanation: d
일치한 id 2의 값은 갱신되어 20이 그대로 남지 않는다.

## question: sqld-01-q46
### solution
정답 근거: Oracle은 DDL을 실행하기 전과 후에 진행 중인 트랜잭션을 자동으로 커밋한다. 풀이: `CREATE TABLE`이 실행되면서 앞의 두 `INSERT`가 커밋된다. 이후의 `ROLLBACK`은 되돌릴 변경이 없어 아무 효과가 없으므로 행 수는 2이다. 흔한 실수: `ROLLBACK`으로 두 행이 취소된다고 보는 것이다.
### choice-explanation: a
`ROLLBACK`이 앞의 삽입을 취소한다고 본 결과이지만 이미 커밋되었다.
### choice-explanation: b
DDL의 자동 커밋으로 두 행이 확정되어 이후 롤백이 효과가 없다.
### choice-explanation: c
두 행이 모두 커밋되었으므로 한 행만 남지 않는다.
### choice-explanation: d
삽입은 두 번뿐이므로 행 수가 3이 될 수 없다.

## question: sqld-01-q47
### solution
정답 근거: SQL Server의 DDL과 `TRUNCATE`는 트랜잭션 안에서 실행하면 롤백할 수 있다. 풀이: `TRUNCATE`가 모든 행을 지웠어도 `ROLLBACK TRANSACTION`으로 되돌려 원래의 3행이 복구된다. Oracle은 `TRUNCATE`가 자동 커밋되어 되돌릴 수 없는 점이 다르다. 흔한 실수: `TRUNCATE`가 어느 DBMS에서나 롤백되지 않는다고 외우는 것이다.
### choice-explanation: a
롤백이 불가능한 경우의 결과이며 SQL Server에서는 롤백된다.
### choice-explanation: b
트랜잭션 안의 TRUNCATE는 롤백되어 3행이 복구된다.
### choice-explanation: c
일부 행만 복구되는 일은 없다. 롤백은 전체를 되돌린다.
### choice-explanation: d
일부 행만 복구되는 일은 없다. 전부 복구되거나 전부 지워진다.

## question: sqld-01-q48
### solution
정답 근거: `ON DELETE CASCADE`는 부모 행이 삭제되면 그 행을 참조하는 자식 행도 함께 삭제한다. 풀이: 부모 id 1을 삭제하면 pid가 1인 자식 두 행도 삭제된다. pid가 2인 한 행만 남아 1행이다. 흔한 실수: 자식의 FK 값만 NULL로 바뀐다고 보는 것이다.
### choice-explanation: a
삭제가 거부되거나 자식이 유지되는 규칙에서의 결과이다.
### choice-explanation: b
자식의 FK만 바뀌는 `SET NULL` 규칙에서의 결과이다.
### choice-explanation: c
id 2를 참조하는 행은 삭제되지 않으므로 0행이 될 수 없다.
### choice-explanation: d
부모 id 1을 참조하던 두 행이 함께 삭제되어 한 행이 남는다.

## question: sqld-01-q49
### solution
정답 근거: Oracle의 `UNIQUE` 제약은 NULL을 중복으로 보지 않아 여러 개의 NULL을 허용한다. 풀이: 'a'와 NULL과 NULL은 모두 들어간다. 마지막 'a'는 값이 중복이라 오류가 나므로 3행이 남는다. SQL Server의 `UNIQUE`는 NULL을 하나만 허용해 결과가 다르다. 흔한 실수: NULL도 중복으로 막힌다고 보는 것이다.
### choice-explanation: a
NULL을 중복으로 막는 것은 Oracle의 `UNIQUE`가 아니다.
### choice-explanation: b
NULL은 중복으로 보지 않아 두 번 들어가고 중복된 'a'만 거부된다.
### choice-explanation: c
오류가 난 문장은 반영되지 않으므로 4행이 될 수 없다.
### choice-explanation: d
마지막 'a'는 값이 중복이라 오류 없이 들어갈 수 없다.

## question: sqld-01-q50
### solution
정답 근거: DCL은 권한을 부여하고 회수하는 문장으로 `GRANT`와 `REVOKE`가 있다. 풀이: `ROLLBACK TO SAVEPOINT`는 트랜잭션을 제어하는 TCL이고 `UPDATE`는 데이터를 조작하는 DML이며 `TRUNCATE`는 구조를 유지하며 데이터를 지우는 DDL이다. 흔한 실수: 트랜잭션 문장이나 삭제 문장을 DCL로 분류하는 것이다.
### choice-explanation: a
`ROLLBACK TO SAVEPOINT`는 트랜잭션 제어 문장인 TCL이다.
### choice-explanation: b
`UPDATE`는 데이터 조작 문장인 DML이다.
### choice-explanation: c
`TRUNCATE`는 데이터 정의 문장인 DDL이다.
### choice-explanation: d
권한을 부여하는 `GRANT`가 DCL이다.
