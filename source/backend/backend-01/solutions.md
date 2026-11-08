## question: backend-01-q01
### solution
정답 근거: Servlet 객체는 첫 요청 때 한 번 만들어지고 `init()`도 그때 한 번만 실행된다. 풀이: 첫 요청에서 생성자 `C`와 `init()` `I`가 차례로 실행되고 요청마다 `doGet()` `S`가 실행된다. 정상 종료 때 `destroy()` `D`가 한 번 호출된다. 흔한 실수: 요청마다 객체가 새로 만들어지거나 `init()`이 다시 호출된다고 생각하는 것이다.
### choice-explanation: a
요청마다 새 객체를 만든다는 오해다. 컨테이너는 Servlet 객체 하나로 모든 요청을 처리한다.
### choice-explanation: b
`init()`을 요청마다 호출한다는 오해다. 초기화는 객체당 한 번만 한다.
### choice-explanation: c
객체 생성과 `init()`은 첫 요청 때 한 번이고 `S`는 요청 수만큼 반복된다.
### choice-explanation: d
`destroy()`를 요청마다 호출한다는 오해다. 종료 처리는 WAS가 내려갈 때 한 번만 한다.

## question: backend-01-q02
### solution
정답 근거: 정확히 일치하는 패턴이 없으면 가장 긴 경로 패턴이 확장자 패턴보다 먼저 적용된다. 풀이: 컨테이너는 정확한 일치, 가장 긴 경로 패턴, 확장자 패턴, 기본 서블릿 순서로 찾는다. `/board/list`는 요청 경로 `/board/list.do`와 문자열이 달라 정확한 일치가 아니고 `/board/*`가 경로 패턴으로 맞는다. 흔한 실수: 확장자 패턴이 더 구체적이라고 보는 것이다.
### choice-explanation: a
확장자 패턴은 경로 패턴이 맞지 않을 때 쓰인다. 경로 패턴이 먼저 선택되므로 호출되지 않는다.
### choice-explanation: b
`/board/list`는 `.do`가 붙은 경로와 같지 않아 정확한 일치가 아니다.
### choice-explanation: c
경로 패턴 `/board/*`가 요청 경로 앞부분과 맞고 확장자 패턴보다 우선한다.
### choice-explanation: d
서로 다른 형태의 패턴은 우선순위가 정해져 있어 충돌하지 않고 시작도 정상이다.

## question: backend-01-q03
### solution
정답 근거: 본문 파라미터는 처음 읽을 때 해석되므로 인코딩은 그 전에 정해야 한다. 풀이: `getParameter()`를 한 번 호출하면 컨테이너가 본문을 해석해 두고 이후의 `setCharacterEncoding()`은 이미 해석된 값에 영향을 주지 않는다. 그래서 Filter나 Servlet의 맨 앞에서 호출한다. 흔한 실수: 읽은 뒤에 지정해도 다시 해석된다고 생각하는 것이다.
### choice-explanation: a
파라미터를 읽기 전에 정해 두어야 컨테이너가 그 인코딩으로 본문을 해석한다.
### choice-explanation: b
응답 인코딩과 혼동한 선택이다. 요청 본문은 응답 전에 이미 해석되어 있다.
### choice-explanation: c
읽은 뒤에는 이미 기본 인코딩으로 해석된 상태라 지정해도 값이 바뀌지 않는다.
### choice-explanation: d
메서드 안이라도 첫 읽기 뒤의 호출은 효과가 없으므로 위치가 중요하다.

## question: backend-01-q04
### solution
정답 근거: Servlet 객체는 하나이고 요청은 스레드마다 처리되므로 인스턴스 필드는 모든 요청이 공유한다. 풀이: A가 필드에 값을 쓴 뒤 출력하기 전에 B가 같은 필드를 덮어쓰면 A의 응답에 B의 이름이 나온다. 요청 값은 `doGet` 안의 지역 변수에 담는다. 흔한 실수: 요청마다 객체가 따로 있거나 세션별로 필드가 분리된다고 생각하는 것이다.
### choice-explanation: a
객체는 하나만 만들어지므로 필드도 하나다. 요청마다 객체가 생기지 않는다.
### choice-explanation: b
`synchronized`는 컴파일 조건이 아니다. 코드는 컴파일되며 동시 실행에서 문제가 생긴다.
### choice-explanation: c
필드는 세션과 무관하게 객체에 속한다. 세션 값은 `HttpSession`에 따로 저장한다.
### choice-explanation: d
스레드 사이에 공유되는 필드를 덮어쓰는 경합이다. 지역 변수로 옮기면 해결된다.

## question: backend-01-q05
### solution
정답 근거: `dispatcherTypes`에 지정한 호출 방식마다 Filter가 적용된다. 풀이: 브라우저의 직접 요청은 `REQUEST`이고 `OrderServlet`의 `forward()`는 `FORWARD`다. 두 종류를 모두 지정했으므로 `/order` 요청 때와 `/result.jsp` forward 때 각각 한 번씩 실행된다. 흔한 실수: 기본값이 `REQUEST`뿐이라는 점을 잊고 forward에도 항상 적용된다고 보는 것이다.
### choice-explanation: a
`FORWARD`를 지정해 두었으므로 forward에도 Filter가 실행된다. 처음 요청에서만 실행되는 것은 기본값 설정이다.
### choice-explanation: b
`REQUEST`와 `FORWARD`를 모두 지정했으므로 직접 요청과 forward에 각각 한 번씩 적용된다.
### choice-explanation: c
직접 요청에도 `REQUEST`가 지정되어 있어 첫 요청에서도 실행된다.
### choice-explanation: d
JSP 실행은 별도의 호출 방식이 아니므로 `/result.jsp`로 forward될 때의 한 번이 전부다.

## question: backend-01-q06
### solution
정답 근거: 범위를 쓰지 않은 EL `${rank}`는 page, request, session, application 순서로 찾아 처음 찾은 값을 쓴다. 풀이: `${rank}`는 request의 `gold`이므로 첫 `c:if`가 참이어서 A가 출력된다. `${sessionScope.rank}`는 `silver`라서 둘째 `c:if`는 거짓이다. `c:out`은 `${rank}`인 `gold`를 출력한다. 흔한 실수: 범위가 넓은 session 값이 우선한다고 생각하는 것이다.
### choice-explanation: a
request의 `gold`가 먼저 찾히므로 A와 `gold`가 출력된다.
### choice-explanation: b
`${rank}`는 request가 먼저라서 `silver`가 아니라 `gold`로 평가된다.
### choice-explanation: c
`sessionScope.rank`는 `silver`이므로 B가 출력되지 않고 `${rank}`도 `gold`다.
### choice-explanation: d
B의 조건이 거짓이므로 B는 출력되지 않는다.

## question: backend-01-q07
### solution
정답 근거: include 지시자는 번역 시점에 파일 내용을 그대로 붙여 하나의 Servlet을 만든다. 풀이: 방식 가에서는 `count` 선언이 `main.jsp`의 같은 메서드 안에 들어오므로 `count + 1`이 `4`가 된다. 방식 나인 `jsp:include`는 `top.jsp`를 별도의 Servlet으로 실행한 결과만 가져오므로 `main.jsp`에서 `count`를 찾을 수 없어 컴파일 오류가 난다. 흔한 실수: 두 방식이 같은 효과라고 보는 것이다.
### choice-explanation: a
`jsp:include`는 실행 결과 문자열만 합치며 변수를 넘기지 않는다.
### choice-explanation: b
지시자는 번역 시점에 합쳐져 변수를 공유한다.
### choice-explanation: c
두 방식은 포함 시점이 달라 변수 공유 여부도 다르다.
### choice-explanation: d
지시자 방식은 한 Servlet 안에서 코드가 합쳐지므로 변수가 공유된다.

## question: backend-01-q08
### solution
정답 근거: 서버는 쿠키를 직접 지울 수 없고 같은 이름과 경로로 수명이 0인 쿠키를 응답에 실어 브라우저가 삭제하게 한다. 풀이: `new Cookie("savedId", "")`에 `setPath("/")`와 `setMaxAge(0)`을 지정하고 `addCookie()`로 보낸다. 흔한 실수: -1이 즉시 삭제라고 생각하거나 `invalidate()`가 쿠키까지 지운다고 생각하는 것이다.
### choice-explanation: a
수명 0인 쿠키를 같은 이름과 경로로 응답에 추가하면 브라우저가 즉시 삭제한다.
### choice-explanation: b
요청에서 받은 배열은 서버 쪽 복사본이라 바꿔도 브라우저의 쿠키에는 영향이 없다.
### choice-explanation: c
-1은 브라우저를 닫을 때 사라지는 세션 쿠키이며 즉시 삭제가 아니다.
### choice-explanation: d
`invalidate()`는 서버의 세션을 없앨 뿐 `savedId` 같은 일반 쿠키는 그대로 남는다.

## question: backend-01-q09
### solution
정답 근거: 로그인 여부는 세션의 `loginUser`로 판단하고 `savedId` 쿠키는 입력란을 채우는 용도다. 풀이: `invalidate()`가 세션을 없앴으므로 이전 `JSESSIONID`로는 기존 세션을 찾지 못한다. 요청은 새 세션에서 처리되어 `loginUser`가 없으므로 Filter가 로그인 폼으로 보낸다. `savedId`는 세션과 별개라 브라우저에 남는다. 흔한 실수: 쿠키가 인증 상태를 대신한다고 보거나 `invalidate()`가 모든 쿠키를 지운다고 보는 것이다.
### choice-explanation: a
`savedId`는 아이디 문자열일 뿐 인증에 쓰이지 않는다. 로그인 상태는 세션의 `loginUser`가 정한다.
### choice-explanation: b
`invalidate()`는 일반 쿠키를 지우지 않는다. 쿠키가 남아 입력란이 채워진다.
### choice-explanation: c
인증 상태는 세션이 정하고 쿠키는 별개라 로그인 폼이 열리며 아이디만 채워진다.
### choice-explanation: d
무효화된 세션은 복구되지 않는다. 예전 세션 ID로 요청해도 새 세션이 만들어진다.

## question: backend-01-q10
### solution
정답 근거: NULL과의 `=`와 `<>` 비교 결과는 모두 UNKNOWN이고 `WHERE`는 TRUE인 행만 남긴다. 풀이: `구름` 행은 `score = 80`도 `score <> 80`도 TRUE가 아니므로 두 결과 모두에서 빠진다. 2행과 2행을 합치면 4행이고 NULL 행을 찾으려면 `IS NULL`을 써야 한다. 흔한 실수: NULL을 0이나 가장 작은 값처럼 다루거나 `<>`가 NULL도 포함한다고 보는 것이다.
### choice-explanation: a
NULL 비교는 TRUE가 되지 않는다. 결과에서 중복을 제거하는 동작도 일어나지 않는다.
### choice-explanation: b
`<>`는 80이 아닌 행을 찾고 80인 행은 `=` 결과에 들어간다. 빠진 행은 NULL 행이다.
### choice-explanation: c
NULL은 크기를 비교할 수 있는 값이 아니다. 비교 결과가 거짓이 아니라 UNKNOWN이다.
### choice-explanation: d
NULL과의 비교는 UNKNOWN이고 UNKNOWN인 행은 어느 조건에서도 선택되지 않는다.

## question: backend-01-q11
### solution
정답 근거: `COUNT(*)`는 모든 행을 세고 `COUNT(bonus)`와 `AVG(bonus)`는 NULL을 제외한다. 풀이: `HAVING COUNT(*) >= 2`로 행이 1개뿐인 디자인 그룹은 제외된다. 개발은 3행 중 bonus가 있는 2행의 평균 150이고 운영은 2행 중 1행의 평균 300이다. 흔한 실수: `COUNT(bonus)`가 NULL도 센다고 보거나 AVG가 NULL을 0으로 계산한다고 보는 것이다.
### choice-explanation: a
`COUNT(bonus)`는 NULL을 세지 않는다. 개발의 값은 3이 아니라 2다.
### choice-explanation: b
`COUNT(bonus)`는 NULL을 빼고 AVG도 NULL을 제외한 값으로 계산한다.
### choice-explanation: c
AVG는 NULL을 0으로 보지 않고 제외한다. 개발의 평균은 150이다.
### choice-explanation: d
`HAVING`이 행이 1개인 그룹을 걸러내므로 디자인 행은 결과에 없다.

## question: backend-01-q12
### solution
정답 근거: MySQL은 오름차순에서 NULL을 가장 앞에 둔다. 풀이: 정렬하면 `다솜`(NULL) → `라온`과 `나래`(48이며 이름 내림차순) → `가온` → `마루` 순이다. `OFFSET 1`로 첫 행 `다솜`을 건너뛰고 2행을 가져오면 `라온 나래`다. 흔한 실수: NULL이 가장 뒤라고 보거나 동점의 두 번째 기준을 오름차순으로 읽는 것이다.
### choice-explanation: a
NULL이 맨 뒤라고 본 결과다. MySQL의 오름차순에서는 NULL이 맨 앞에 온다.
### choice-explanation: b
동점의 두 번째 기준을 오름차순으로 읽은 결과다. 지정한 것은 `runner DESC`다.
### choice-explanation: c
`OFFSET`을 적용하지 않은 결과다. 첫 행 `다솜`을 건너뛰어야 한다.
### choice-explanation: d
NULL이 맨 앞이라 `다솜`을 건너뛰고 동점은 이름 내림차순이라 라온이 먼저다.

## question: backend-01-q13
### solution
정답 근거: `ON` 조건은 조인할 짝을 정하고 `WHERE`는 조인이 끝난 결과를 거른다. 풀이: 쿼리 B는 `PAID` 주문만 짝이 되고 짝이 없는 보라와 소라도 NULL과 함께 남아 3행이다. 쿼리 A는 조인 결과에서 `status = 'PAID'`로 거르므로 NULL 행이 사라져 1행이다. 흔한 실수: 외부 조인에서도 `WHERE`가 `ON`과 같다고 보는 것이다.
### choice-explanation: a
B는 짝 없는 고객이 NULL로 남고 A는 WHERE가 NULL 행을 걸러 1행이다.
### choice-explanation: b
`WHERE`가 거르는 것을 무시한 계산이다. 조인 결과 4행에서 `PAID`만 남으면 1행이다.
### choice-explanation: c
`ON`의 조건은 왼쪽 행을 없애지 않는다. B는 모든 고객이 남아 1행이 아니다.
### choice-explanation: d
A는 WHERE에서 NULL 행이 걸러진다. 쿼리의 조건이 B와 같지 않으므로 행 수도 다르다.

## question: backend-01-q14
### solution
정답 근거: MySQL에서 `UNION`은 중복을 제거하고 `UNION ALL`은 유지하며 앞에서부터 차례로 결합된다. 풀이: 앞의 두 결과는 `UNION`으로 합쳐져 서울과 부산과 대구 3행이 된다. 여기에 `UNION ALL`로 `club_c`의 서울이 그대로 붙어 4행이고 서울이 두 번 나온다. 흔한 실수: 연산자 하나가 전체 결과의 중복 처리를 정한다고 보는 것이다.
### choice-explanation: a
마지막 `UNION ALL`은 중복을 제거하지 않는다. 서울이 한 번 더 붙는다.
### choice-explanation: b
앞의 두 결과가 중복 제거된 3행에 `UNION ALL`의 서울이 붙어 4행이다.
### choice-explanation: c
앞의 `UNION`이 `club_a`와 `club_b`의 중복을 제거한다. 6행이 될 수 없다.
### choice-explanation: d
앞의 `UNION`이 중복을 제거하므로 두 결과의 중복이 유지되지 않는다.

## question: backend-01-q15
### solution
정답 근거: `NOT IN`의 목록에 NULL이 있으면 비교가 UNKNOWN이 되어 결과가 비어 버린다. 풀이: 쿼리 A의 서브쿼리 결과는 NULL과 1과 1과 2이므로 어떤 `id`도 TRUE가 되지 못해 0행이다. 쿼리 B는 부하 행이 있는지만 확인하므로 NULL의 영향이 없고 부하가 없는 3과 4의 2행이다. 흔한 실수: 두 쿼리가 항상 같은 결과를 낸다고 보는 것이다.
### choice-explanation: a
NOT IN은 목록의 NULL 때문에 0행이 되고 NOT EXISTS는 NULL과 무관하게 3과 4를 반환한다.
### choice-explanation: b
NOT IN은 NULL 때문에 3과 4를 반환하지 못한다. 두 쿼리의 결과가 같지 않다.
### choice-explanation: c
NOT EXISTS가 0행이 되려면 모든 사람에게 부하가 있어야 한다. 3과 4는 부하가 없다.
### choice-explanation: d
NOT EXISTS는 3과 4의 2행이고 NOT IN은 0행이다. 3행이나 1행이 나오지 않는다.

## question: backend-01-q16
### solution
정답 근거: 참조하는 자식 행이 있는 부모 행의 삭제는 기본 규칙에서 거부되고 `TRUNCATE`는 외래키가 참조하는 테이블에 쓸 수 없다. 풀이: 1번은 `emp`가 id 1을 참조하므로 오류다. 2번은 id 2를 참조하는 행이 없어 성공한다. 3번은 `dept`가 외래키의 부모라서 자식 행 유무와 관계없이 오류다. 흔한 실수: `TRUNCATE`가 제약을 무시하고 전체 삭제를 한다고 보는 것이다.
### choice-explanation: a
`TRUNCATE`는 외래키가 참조하는 부모 테이블에 실행할 수 없다. 제약을 무시하지 않는다.
### choice-explanation: b
참조되는 행의 삭제와 `TRUNCATE`는 막히고 참조되지 않는 id 2의 삭제만 성공한다.
### choice-explanation: c
1번은 `emp`가 id 1을 참조하고 있어 거부된다. 참조 행이 있는 부모는 지워지지 않는다.
### choice-explanation: d
2번의 id 2는 참조하는 행이 없어 지워진다. 모든 문장이 오류는 아니다.

## question: backend-01-q17
### solution
정답 근거: 기본키 전체가 아니라 일부(`product_no`)만으로 속성(`product_name`)이 정해지면 부분 함수 종속이며 2정규형 위반이다. 풀이: 상품명은 주문번호와 무관하게 상품번호로 정해지므로 `product(product_no, product_name)`을 분리하고 `order_item`에는 상품번호만 남긴다. 흔한 실수: 부분 종속과 이행 종속을 구분하지 못하는 것이다.
### choice-explanation: a
이행 종속은 일반 속성을 거쳐 결정되는 경우다. 여기서는 키의 일부가 직접 결정한다.
### choice-explanation: b
각 칸은 하나의 값이라 1정규형을 만족한다. 문제는 값의 개수가 아니다.
### choice-explanation: c
`product_name`은 키 전체가 아니라 일부에만 종속되어 있어 2정규형을 만족하지 못한다.
### choice-explanation: d
`product_name`이 복합키의 일부인 `product_no`에만 종속되므로 부분 종속이며 상품 테이블로 분리한다.

## question: backend-01-q18
### solution
정답 근거: `ALTER TABLE` 같은 DDL은 실행 전에 진행 중인 트랜잭션을 암묵적으로 커밋한다. 풀이: `ALTER TABLE`이 실행되면서 앞의 두 INSERT가 커밋된다. 그 뒤의 `ROLLBACK`은 되돌릴 진행 중인 트랜잭션이 없으므로 아무 것도 취소하지 못한다. 흔한 실수: 저장점이 있으니 `ROLLBACK`으로 INSERT가 취소된다고 보는 것이다.
### choice-explanation: a
`ROLLBACK TO s1`이 아니므로 저장점 이후만 취소되지 않는다. 또 DDL에서 이미 커밋된 상태다.
### choice-explanation: b
전체 되돌리기가 되려면 DDL이 없어야 한다. 이 트랜잭션은 DDL에서 이미 커밋되었다.
### choice-explanation: c
DDL의 암묵적 커밋으로 두 INSERT가 확정되어 이후의 `ROLLBACK`이 효과가 없다.
### choice-explanation: d
행 2만 남기려면 행 1만 되돌려야 하고 그런 동작은 없다. 두 행 모두 확정되었다.

## question: backend-01-q19
### solution
정답 근거: REPEATABLE READ의 일반 조회는 첫 조회 때 만든 스냅샷을 계속 읽고 잠금 읽기는 최신 커밋된 값을 읽는다. 풀이: T1의 일반 `SELECT`는 스냅샷의 100을 반복해서 돌려준다. `FOR UPDATE`는 최신 커밋 값에 잠금을 걸어 읽으므로 T2가 커밋한 150이 보인다. 흔한 실수: 한 트랜잭션 안의 모든 읽기가 같은 스냅샷을 쓴다고 보는 것이다.
### choice-explanation: a
잠금 읽기는 스냅샷이 아니라 최신 커밋 값을 읽는다. 150이 보여야 한다.
### choice-explanation: b
스냅샷을 읽는 일반 조회는 100이고 최신 값을 읽는 잠금 조회는 150이다.
### choice-explanation: c
일반 조회는 첫 조회의 스냅샷을 유지하므로 150으로 바뀌지 않는다.
### choice-explanation: d
두 읽기의 값이 반대다. 일반 조회가 스냅샷의 100이고 잠금 조회가 150이다.

## question: backend-01-q20
### solution
정답 근거: 문자열 리터럴 안의 `?`는 바인딩 자리표시자가 아니다. 풀이: 이 SQL에는 자리표시자가 하나도 없으므로 `setString(1, ...)`이 존재하지 않는 1번 매개변수를 설정하려다 SQLException이 발생한다. 올바른 코드는 `LIKE ?`로 쓰고 `ps.setString(1, "%" + keyword + "%")`로 와일드카드를 값에 붙인다. 흔한 실수: 따옴표 안에 `?`를 넣어도 값이 끼워진다고 보는 것이다.
### choice-explanation: a
리터럴 안의 `?`는 치환되지 않는다. 값이 끼워져 조회되는 일은 없다.
### choice-explanation: b
JDBC의 매개변수 인덱스는 1부터 시작한다. 예외의 원인은 인덱스가 아니라 자리표시자가 없다는 점이다.
### choice-explanation: c
`LIKE ?`처럼 `LIKE`에도 바인딩을 쓸 수 있다. 예외는 `setString`에서 발생한다.
### choice-explanation: d
리터럴 안의 `?`는 자리표시자가 아니므로 1번 매개변수를 설정할 수 없다.

## question: backend-01-q21
### solution
정답 근거: 연결마다 트랜잭션이 따로이고 autocommit이 켜져 있으면 문장 하나가 실행 즉시 커밋된다. 풀이: `withdraw`는 자기 연결에서 이미 커밋을 마쳤다. 다른 연결에서 일어난 `deposit`의 예외는 그 결과를 되돌리지 못한다. 한 `Connection`에서 `setAutoCommit(false)`로 두 작업을 묶고 성공하면 `commit()` 실패하면 `rollback()`한다. 흔한 실수: 서비스 메서드 하나가 저절로 트랜잭션 단위가 된다고 보는 것이다.
### choice-explanation: a
JDBC는 자동으로 롤백하지 않는다. 개발자가 롤백이 필요한 경계를 직접 정한다.
### choice-explanation: b
이미 커밋된 출금은 다른 연결의 예외로 취소되지 않는다. 한 연결로 묶어야 한다.
### choice-explanation: c
서로 다른 연결은 서로 다른 트랜잭션이다. 함께 롤백되지 않는다.
### choice-explanation: d
autocommit 상태에서는 닫기 전에 이미 커밋되었다. 취소할 변경이 남아 있지 않다.

## question: backend-01-q22
### solution
정답: getParameterValues. 허용 표기: 괄호가 붙은 `getParameterValues()`도 정답이며 대소문자는 구분하지 않는다. 근거: `getParameter()`는 같은 이름의 값 중 첫 번째 하나만 돌려주고 `getParameterValues()`는 모든 값을 배열로 돌려준다.

## question: backend-01-q23
### solution
정답: exception-type. 허용 표기: 꺾쇠가 붙은 `<exception-type>`도 정답이며 대소문자는 구분하지 않는다. 근거: `<error-page>`는 `<error-code>`로 상태 코드를 지정하거나 `<exception-type>`으로 예외 클래스를 지정하고 `<location>`에 보여 줄 경로를 쓴다.

## question: backend-01-q24
### solution
정답: 2. 근거: redirect는 서버가 이동할 주소를 응답으로 알려 주고 브라우저가 그 주소로 새 요청을 보낸다. 비교: forward는 서버 안에서 이동하므로 요청 1번이고 주소창이 유지되며 request 속성이 공유된다. redirect는 요청 2번이고 주소창이 바뀌며 새 request가 만들어진다. 그래서 등록 뒤 새로고침해도 마지막 GET만 다시 실행되어 등록이 중복되지 않는다.

## question: backend-01-q25
### solution
정답: 분. 허용 표기: 영문 `minute`, `minutes`, `min`도 정답이다. 근거: `web.xml`의 `<session-timeout>`은 분 단위이고 `HttpSession.setMaxInactiveInterval()`은 초 단위다. 30이면 30분이며 마지막 접근 시각부터 계산한다.

## question: backend-01-q26
### solution
정답: 3. 근거: `DISTINCT`는 NULL끼리 같은 값으로 보고 하나로 합친다. 서로 다른 값은 `A`, `B`, NULL의 3개이고 바깥 `COUNT(*)`가 이 3행을 센다. 비교 연산자 `=`는 NULL끼리도 UNKNOWN이지만 `DISTINCT`와 `GROUP BY`는 NULL을 한 묶음으로 본다.

## question: backend-01-q27
### solution
정답: WITH CHECK OPTION. 허용 표기: 앞의 `WITH`를 뺀 `CHECK OPTION`도 정답이며 대소문자는 구분하지 않는다. 근거: 이 옵션이 있으면 뷰를 통한 INSERT와 UPDATE 결과가 뷰의 WHERE 조건을 만족해야 하고 아니면 오류가 난다.

## question: backend-01-q28
### solution
정답: 대체키. 허용 표기: 띄어 쓴 `대체 키`와 영문 `alternate key`도 정답이며 대소문자는 구분하지 않는다. 근거: 후보키는 행을 유일하게 식별하는 최소 속성 집합이고 그중 하나가 기본키가 되며 나머지가 대체키다.

## question: backend-01-q29
### solution
정답: 클러스터드 인덱스. 허용 표기: `클러스터 인덱스`와 영문 `clustered index`도 정답이며 대소문자는 구분하지 않는다. 근거: InnoDB는 기본키 인덱스의 리프에 행 전체를 저장한다. 보조 인덱스의 리프에는 인덱스 키와 기본키 값이 있어 나머지 열이 필요하면 클러스터드 인덱스를 다시 찾는다.

## question: backend-01-q30
### solution
정답: 2. 근거: `ResultSet`의 커서는 처음에 첫 행 앞에 있고 `next()`를 호출할 때마다 한 행씩 이동한다. 첫 `rs.next()`가 1행으로 이동하고 `while`의 `next()`가 2행과 3행에서 true를 반환해 `n`은 2가 된 뒤 더 이상 행이 없어 false로 끝난다. 첫 행을 처리하려면 그 행을 읽거나 `next()` 호출을 `while` 조건 하나로 합친다.

## question: backend-01-q31
### solution
**(1)** Front Controller는 모든 요청을 하나의 Servlet이 먼저 받는 구조다. 기능마다 Servlet을 만들면 인코딩 지정과 로깅과 예외 처리 같은 공통 코드가 Servlet마다 반복되는데 한곳에서 처리하면 이 중복이 사라진다.

**(2)** `/board/list.do` 요청은 Front Controller가 받아 경로에서 action인 `list`를 뽑고 알맞은 처리 로직을 호출한다. 처리 결과는 request에 담고 보여 줄 JSP를 골라 forward한다. 등록처럼 데이터를 바꾸는 요청은 redirect로 이동한다.

**(3)** 정의되지 않은 action이면 `response.sendError(404)`로 404 응답을 보내거나 오류 페이지로 이동하고 예외 내용은 로그에만 남긴다.

## question: backend-01-q32
### solution
**(1)** 학생과 동아리는 다대다 관계라서 한쪽 테이블에 열을 넣어 표현할 수 없다. 두 테이블 사이에 가입 테이블을 따로 만든다.

**(2)** 가입 테이블은 학생의 기본키와 동아리의 기본키를 각각 외래키로 가지며 두 열을 묶어 복합 기본키로 삼아 같은 학생이 같은 동아리에 두 번 가입하지 못하게 한다. 대리키를 쓴다면 두 열에 UNIQUE 제약을 둔다. 외래키는 존재하지 않는 학생이나 동아리를 가리키는 가입 행도 막는다.

**(3)** 가입 날짜는 학생 한 명이나 동아리 하나가 아니라 학생과 동아리의 조합이 정하는 값이므로 가입 테이블의 열로 둔다.
