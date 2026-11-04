## question: backend-01-q01
```json
{
  "title": "요청 두 번과 종료 뒤의 호출 순서",
  "topics": [
    "web-servlet"
  ],
  "tags": [
    "servlet-lifecycle"
  ],
  "group": "web-servlet",
  "type": "mc",
  "id": "backend-01-q01",
  "revision": 1,
  "sourceRefs": [
    "BE-LAB-01 Servlet 생명주기와 URL 매핑",
    "backend-concepts Part 2"
  ],
  "difficulty": 1,
  "correctChoiceId": "c"
}
```
### stem
다음 Servlet은 각 단계에서 한 글자를 출력한다. `loadOnStartup`은 지정하지 않았다. WAS를 켠 뒤 `/hello`에 요청이 두 번 도착했고 이어서 WAS를 정상 종료했다. 출력 순서로 알맞은 것은?
```java
@WebServlet("/hello")
public class HelloServlet extends HttpServlet {
    public HelloServlet() { System.out.print("C"); }
    public void init() { System.out.print("I"); }
    protected void doGet(HttpServletRequest req, HttpServletResponse res) {
        System.out.print("S");
    }
    public void destroy() { System.out.print("D"); }
}
```
### choice: a
C → I → S → C → I → S → D
### choice: b
C → I → S → I → S → D
### choice: c
C → I → S → S → D
### choice: d
C → I → S → D → S → D

## question: backend-01-q02
```json
{
  "title": "겹치는 URL 패턴의 선택",
  "topics": [
    "web-servlet"
  ],
  "tags": [
    "url-mapping"
  ],
  "group": "web-servlet",
  "type": "mc",
  "id": "backend-01-q02",
  "revision": 1,
  "sourceRefs": [
    "BE-LAB-01 Servlet 생명주기와 URL 매핑",
    "backend-concepts Part 2"
  ],
  "difficulty": 2,
  "correctChoiceId": "c"
}
```
### stem
컨텍스트 경로가 `/app`인 웹 애플리케이션에 아래 세 Servlet이 매핑되어 있다. 브라우저가 `/app/board/list.do`를 요청할 때 처리하는 Servlet은?
```text
BoardServlet   /board/*
ActionServlet  *.do
ListServlet    /board/list
```
### choice: a
ActionServlet이 처리한다
### choice: b
ListServlet이 처리한다
### choice: c
BoardServlet이 처리한다
### choice: d
매핑이 모호해 서버가 시작되지 않는다

## question: backend-01-q03
```json
{
  "title": "요청 인코딩을 지정하는 위치",
  "topics": [
    "web-servlet"
  ],
  "tags": [
    "request-encoding"
  ],
  "group": "web-servlet",
  "type": "mc",
  "id": "backend-01-q03",
  "revision": 1,
  "sourceRefs": [
    "BE-LAB-01 Servlet 생명주기와 URL 매핑",
    "backend-concepts Part 2"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
UTF-8로 전송된 POST 폼 본문의 한글 파라미터를 `request.setCharacterEncoding("UTF-8")`으로 올바르게 해석하려면 이 호출은 언제까지 실행되어야 하는가?
### choice: a
요청 파라미터를 처음 읽기 전까지
### choice: b
응답을 브라우저로 보내기 직전까지
### choice: c
요청 파라미터를 읽은 직후에 한 번
### choice: d
`doPost()`가 끝나기 전 어디서나

## question: backend-01-q04
```json
{
  "title": "필드에 담은 요청 값의 공유",
  "topics": [
    "mvc-filter"
  ],
  "tags": [
    "shared-field-thread"
  ],
  "group": "mvc-filter",
  "type": "mc",
  "id": "backend-01-q04",
  "revision": 1,
  "sourceRefs": [
    "BE-LAB-01 Front Controller와 Filter",
    "backend-concepts Part 3"
  ],
  "difficulty": 2,
  "correctChoiceId": "d"
}
```
### stem
다음 Servlet은 요청 값을 인스턴스 필드에 저장한 뒤 응답한다. 사용자 A와 B가 거의 동시에 요청을 보낼 때 일어날 수 있는 일은?
```java
public class GreetServlet extends HttpServlet {
    private String user;

    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws IOException {
        user = req.getParameter("user");
        res.getWriter().print("안녕하세요 " + user);
    }
}
```
### choice: a
요청마다 새 객체가 만들어지므로 두 요청의 필드는 서로 영향을 주지 않는다
### choice: b
`doGet`이 `synchronized`가 아니면 컴파일 오류가 발생한다
### choice: c
필드는 사용자의 세션마다 따로 보관되므로 A와 B의 값이 섞이지 않는다
### choice: d
하나뿐인 객체의 필드를 두 스레드가 함께 써서 A의 응답에 B의 이름이 나올 수 있다

## question: backend-01-q05
```json
{
  "title": "forward와 Filter의 실행 횟수",
  "topics": [
    "mvc-filter"
  ],
  "tags": [
    "filter-chain"
  ],
  "group": "mvc-filter",
  "type": "mc",
  "id": "backend-01-q05",
  "revision": 1,
  "sourceRefs": [
    "BE-LAB-01 Front Controller와 Filter",
    "backend-concepts Part 3"
  ],
  "difficulty": 3,
  "correctChoiceId": "b"
}
```
### stem
아래 Filter는 모든 경로에 적용된다. 브라우저가 `/order`를 요청하고 `OrderServlet`이 `/result.jsp`로 forward할 때 Filter가 실행되는 횟수는?
```java
@WebFilter(urlPatterns = "/*",
        dispatcherTypes = {DispatcherType.REQUEST, DispatcherType.FORWARD})
public class TraceFilter implements Filter {
    // doFilter는 chain.doFilter()로 다음 단계를 호출한다
}
```
### choice: a
한 번만 실행된다. 처음 요청 때뿐이다
### choice: b
두 번 실행된다. 처음 요청 때와 forward 때이다
### choice: c
한 번만 실행된다. forward 때뿐이다
### choice: d
세 번 실행된다. JSP 실행 때도 한 번 더 실행된다

## question: backend-01-q06
```json
{
  "title": "scope 탐색과 JSTL 조건",
  "topics": [
    "jsp-el"
  ],
  "tags": [
    "scope-lookup",
    "jstl-tags"
  ],
  "group": "jsp-el",
  "type": "mc",
  "id": "backend-01-q06",
  "revision": 1,
  "sourceRefs": [
    "BE-LAB-02 JSP와 forward",
    "BE-LAB-04 EL과 JSTL",
    "backend-concepts Part 4와 Part 5"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
컨트롤러가 request에 `rank`를 `gold`로 session에 `rank`를 `silver`로 저장하고 아래 JSP로 forward했다. application에는 `rank`가 없다. 화면에 출력되는 내용으로 알맞은 것은?
```jsp
<c:if test="${rank eq 'gold'}">A</c:if>
<c:if test="${sessionScope.rank eq 'gold'}">B</c:if>
<c:out value="${rank}"/>
```
### choice: a
A와 gold가 출력된다
### choice: b
A와 silver가 출력된다
### choice: c
B와 silver가 출력된다
### choice: d
A와 B와 gold가 출력된다

## question: backend-01-q07
```json
{
  "title": "include 지시자와 변수 공유",
  "topics": [
    "jsp-el"
  ],
  "tags": [
    "jsp-translation"
  ],
  "group": "jsp-el",
  "type": "mc",
  "id": "backend-01-q07",
  "revision": 1,
  "sourceRefs": [
    "BE-LAB-02 JSP와 forward",
    "BE-LAB-04 EL과 JSTL",
    "backend-concepts Part 4와 Part 5"
  ],
  "difficulty": 3,
  "correctChoiceId": "b"
}
```
### stem
`top.jsp`에서 선언한 변수를 `main.jsp`가 사용한다. 두 포함 방식 가와 나 중에서 `main.jsp`가 오류 없이 `4`를 출력하는 것은?
```jsp
<%-- top.jsp --%>
<% int count = 3; %>

<%-- main.jsp 방식 가 --%>
<%@ include file="top.jsp" %>
<%= count + 1 %>

<%-- main.jsp 방식 나 --%>
<jsp:include page="top.jsp" />
<%= count + 1 %>
```
### choice: a
나만 가능하다. 요청 때 실행 결과를 합치면서 변수도 전달되기 때문이다
### choice: b
가만 가능하다. 번역 시점에 하나의 Servlet 소스로 합쳐지기 때문이다
### choice: c
둘 다 가능하다. 두 방식은 같은 위치에 내용을 포함하기 때문이다
### choice: d
둘 다 불가능하다. 포함된 파일의 변수는 어떤 방식으로도 공유되지 않기 때문이다

## question: backend-01-q08
```json
{
  "title": "아이디 저장 쿠키 삭제",
  "topics": [
    "state-session"
  ],
  "tags": [
    "cookie-remember-id"
  ],
  "group": "state-session",
  "type": "mc",
  "id": "backend-01-q08",
  "revision": 1,
  "sourceRefs": [
    "BE-LAB-03 로그인과 세션",
    "backend-concepts Part 6"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
로그인 폼에서 `아이디 저장`을 해제한 사용자가 로그인했다. 이전에 저장된 `savedId` 쿠키(경로 `/`)를 브라우저에서 지우는 방법으로 알맞은 것은?
### choice: a
같은 이름과 경로의 쿠키를 `maxAge` 0으로 만들어 응답에 추가한다
### choice: b
`request.getCookies()`로 받은 배열에서 해당 쿠키를 `null`로 바꾼다
### choice: c
`maxAge`를 -1로 만든 `savedId` 쿠키를 응답에 추가한다
### choice: d
`session.invalidate()`를 호출해 세션과 쿠키를 함께 삭제한다

## question: backend-01-q09
```json
{
  "title": "로그아웃 뒤 마이페이지 요청",
  "topics": [
    "state-session"
  ],
  "tags": [
    "session-auth"
  ],
  "group": "state-session",
  "type": "mc",
  "id": "backend-01-q09",
  "revision": 1,
  "sourceRefs": [
    "BE-LAB-03 로그인과 세션",
    "backend-concepts Part 6"
  ],
  "difficulty": 3,
  "correctChoiceId": "c"
}
```
### stem
로그인한 사용자는 `session.setAttribute("loginUser", m)`로 상태를 저장했고 `아이디 저장`으로 `savedId` 쿠키도 받았다. 로그아웃 Servlet이 `session.invalidate()`만 호출한 뒤 같은 브라우저가 `/auth/mypage`를 요청한다. 이 경로는 Filter가 세션의 `loginUser`를 확인한다. 결과는?
### choice: a
`savedId` 쿠키가 남아 있으므로 로그인한 상태로 보고 마이페이지를 연다
### choice: b
로그인 폼으로 보내지지만 `invalidate()`가 쿠키도 지워 아이디 입력란이 비어 있다
### choice: c
`loginUser`가 없어 로그인 폼으로 보내지고 `savedId` 쿠키는 남아 있다
### choice: d
예전 `JSESSIONID`로 기존 세션이 복구되어 `loginUser`가 그대로 남는다

## question: backend-01-q10
```json
{
  "title": "NULL이 있는 두 조건의 합",
  "topics": [
    "sql-select"
  ],
  "tags": [
    "null-three-valued"
  ],
  "group": "sql-select",
  "type": "mc",
  "id": "backend-01-q10",
  "revision": 1,
  "sourceRefs": [
    "DB-L02 조회와 NULL",
    "DB-L03 집계와 그룹화",
    "db-concepts Part 2와 Part 3"
  ],
  "difficulty": 2,
  "correctChoiceId": "d"
}
```
### stem
`exam_score` 테이블에서 `WHERE score = 80`은 2행 `WHERE score <> 80`도 2행을 반환한다. 전체는 5행인데 두 결과를 합쳐도 4행인 이유로 알맞은 것은?
```text
exam_score
id | name | score
1  | 하늘 | 80
2  | 바다 | 90
3  | 구름 | NULL
4  | 별   | 70
5  | 달   | 80
```
### choice: a
`<>` 비교는 NULL을 항상 참으로 계산하지만 결과에서 중복으로 제거된다
### choice: b
`<>`는 값이 다른 행만 세므로 점수가 같은 행 하나가 빠진다
### choice: c
NULL은 80보다 작은 값으로 취급되어 두 조건이 모두 거짓이 된다
### choice: d
`score`가 NULL인 행은 두 비교가 모두 UNKNOWN이라 어느 결과에도 들어가지 않는다

## question: backend-01-q11
```json
{
  "title": "그룹 조건과 집계의 NULL",
  "topics": [
    "sql-select"
  ],
  "tags": [
    "where-vs-having",
    "null-three-valued"
  ],
  "group": "sql-select",
  "type": "mc",
  "id": "backend-01-q11",
  "revision": 1,
  "sourceRefs": [
    "DB-L02 조회와 NULL",
    "DB-L03 집계와 그룹화",
    "db-concepts Part 2와 Part 3"
  ],
  "difficulty": 3,
  "correctChoiceId": "b"
}
```
### stem
`staff` 테이블에 다음 쿼리를 실행했다. 결과로 알맞은 것은? (`AVG` 값의 소수 자릿수는 무시한다)
```text
staff
id | dept   | bonus
1  | 개발   | 100
2  | 개발   | NULL
3  | 개발   | 200
4  | 운영   | 300
5  | 운영   | NULL
6  | 디자인 | NULL
```
```sql
SELECT dept, COUNT(*) AS cnt, COUNT(bonus) AS paid, AVG(bonus) AS avg_bonus
FROM staff
GROUP BY dept
HAVING COUNT(*) >= 2
ORDER BY dept;
```
### choice: a
개발 3 3 150 / 운영 2 2 300
### choice: b
개발 3 2 150 / 운영 2 1 300
### choice: c
개발 3 2 100 / 운영 2 1 150
### choice: d
개발 3 2 150 / 디자인 1 0 NULL / 운영 2 1 300

## question: backend-01-q12
```json
{
  "title": "NULL과 동점이 있는 정렬과 OFFSET",
  "topics": [
    "sql-select"
  ],
  "tags": [
    "order-limit-concat"
  ],
  "group": "sql-select",
  "type": "mc",
  "id": "backend-01-q12",
  "revision": 1,
  "sourceRefs": [
    "DB-L02 조회와 NULL",
    "DB-L03 집계와 그룹화",
    "db-concepts Part 2와 Part 3"
  ],
  "difficulty": 3,
  "correctChoiceId": "d"
}
```
### stem
`race` 테이블에서 다음 쿼리의 결과는? (MySQL 8.4이며 한글은 가나다순으로 정렬된다)
```text
race
runner | secs
가온   | 52
나래   | 48
다솜   | NULL
라온   | 48
마루   | 55
```
```sql
SELECT runner FROM race
ORDER BY secs ASC, runner DESC
LIMIT 2 OFFSET 1;
```
### choice: a
나래 가온
### choice: b
나래 라온
### choice: c
다솜 라온
### choice: d
라온 나래

## question: backend-01-q13
```json
{
  "title": "ON 조건과 WHERE 조건의 위치",
  "topics": [
    "sql-join-subquery"
  ],
  "tags": [
    "join-types"
  ],
  "group": "sql-join-subquery",
  "type": "mc",
  "id": "backend-01-q13",
  "revision": 1,
  "sourceRefs": [
    "DB-L04 조인과 집합 연산",
    "DB-L05 서브쿼리",
    "db-concepts Part 4와 Part 5"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
`customer`와 `orders`에 두 쿼리를 실행했다. 각 쿼리가 반환하는 행 수로 알맞은 것은?
```text
customer           orders
id | name          id | customer_id | status
1  | 모아          1  | 1           | PAID
2  | 보라          2  | 1           | CANCEL
3  | 소라          3  | 2           | CANCEL
```
```sql
-- 쿼리 A
SELECT c.name, o.status
FROM customer c LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.status = 'PAID';

-- 쿼리 B
SELECT c.name, o.status
FROM customer c LEFT JOIN orders o
  ON o.customer_id = c.id AND o.status = 'PAID';
```
### choice: a
A는 1행 B는 3행
### choice: b
A는 4행 B는 3행
### choice: c
A는 1행 B는 1행
### choice: d
A는 3행 B는 4행

## question: backend-01-q14
```json
{
  "title": "UNION과 UNION ALL이 섞인 결과",
  "topics": [
    "sql-join-subquery"
  ],
  "tags": [
    "set-operations"
  ],
  "group": "sql-join-subquery",
  "type": "mc",
  "id": "backend-01-q14",
  "revision": 1,
  "sourceRefs": [
    "DB-L04 조인과 집합 연산",
    "DB-L05 서브쿼리",
    "db-concepts Part 4와 Part 5"
  ],
  "difficulty": 3,
  "correctChoiceId": "b"
}
```
### stem
세 테이블에 다음 쿼리를 실행했다. 결과로 알맞은 것은?
```text
club_a: 서울 부산 서울
club_b: 부산 대구
club_c: 서울
```
```sql
SELECT city FROM club_a
UNION
SELECT city FROM club_b
UNION ALL
SELECT city FROM club_c;
```
### choice: a
3행이며 중복이 모두 제거된다
### choice: b
4행이며 `서울`이 두 번 나온다
### choice: c
6행이며 중복이 모두 유지된다
### choice: d
5행이며 앞의 두 결과는 중복이 유지된다

## question: backend-01-q15
```json
{
  "title": "NOT IN과 NOT EXISTS의 차이",
  "topics": [
    "sql-join-subquery"
  ],
  "tags": [
    "subquery-forms"
  ],
  "group": "sql-join-subquery",
  "type": "mc",
  "id": "backend-01-q15",
  "revision": 1,
  "sourceRefs": [
    "DB-L04 조인과 집합 연산",
    "DB-L05 서브쿼리",
    "db-concepts Part 4와 Part 5"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
`person` 테이블에서 부하가 없는 사람의 `id`를 구하려고 두 쿼리를 실행했다. 결과 행 수로 알맞은 것은?
```text
person
id | boss_id
1  | NULL
2  | 1
3  | 1
4  | 2
```
```sql
-- 쿼리 A
SELECT id FROM person
WHERE id NOT IN (SELECT boss_id FROM person);

-- 쿼리 B
SELECT p.id FROM person p
WHERE NOT EXISTS (SELECT 1 FROM person c WHERE c.boss_id = p.id);
```
### choice: a
A는 0행이고 B는 2행이다
### choice: b
A와 B 모두 2행이다
### choice: c
A는 2행이고 B는 0행이다
### choice: d
A는 1행이고 B는 3행이다

## question: backend-01-q16
```json
{
  "title": "외래키가 걸린 삭제와 TRUNCATE",
  "topics": [
    "db-schema"
  ],
  "tags": [
    "constraints",
    "delete-truncate-drop"
  ],
  "group": "db-schema",
  "type": "mc",
  "id": "backend-01-q16",
  "revision": 1,
  "sourceRefs": [
    "DB-L06 제약조건",
    "DB-L08 모델링과 정규화",
    "db-concepts Part 6과 Part 9"
  ],
  "difficulty": 3,
  "correctChoiceId": "b"
}
```
### stem
`emp.dept_id`는 `dept.id`를 참조하는 외래키이고 삭제 규칙은 기본값이다. `dept`에는 id 1과 2가 있고 `emp`에는 `dept_id`가 1인 행만 있다. 아래 세 문장을 차례로 실행할 때 결과로 알맞은 것은?
```sql
DELETE FROM dept WHERE id = 1;  -- 1번
DELETE FROM dept WHERE id = 2;  -- 2번
TRUNCATE TABLE dept;            -- 3번
```
### choice: a
1번 오류 2번 성공 3번 성공
### choice: b
1번 오류 2번 성공 3번 오류
### choice: c
1번 성공 2번 성공 3번 오류
### choice: d
세 문장 모두 오류가 난다

## question: backend-01-q17
```json
{
  "title": "기본키 일부에 종속된 속성",
  "topics": [
    "db-schema"
  ],
  "tags": [
    "normalization"
  ],
  "group": "db-schema",
  "type": "mc",
  "id": "backend-01-q17",
  "revision": 1,
  "sourceRefs": [
    "DB-L06 제약조건",
    "DB-L08 모델링과 정규화",
    "db-concepts Part 6과 Part 9"
  ],
  "difficulty": 2,
  "correctChoiceId": "d"
}
```
### stem
`order_item` 테이블은 `order_no`와 `product_no`와 `product_name`과 `qty` 열로 이루어지고 기본키는 (`order_no`, `product_no`)이다. `product_no`가 정해지면 `product_name`이 정해진다. 이 테이블에 대한 설명으로 알맞은 것은?
### choice: a
다른 일반 속성을 거치는 종속이 있어 3정규형을 위반하므로 수량 테이블로 분리한다
### choice: b
한 칸에 여러 값이 들어 있어 1정규형을 위반하므로 행을 늘려야 한다
### choice: c
모든 속성이 기본키에 종속되어 있으므로 모든 정규형을 만족한다
### choice: d
기본키 일부에 종속된 속성이 있어 2정규형을 위반하므로 상품 테이블로 분리한다

## question: backend-01-q18
```json
{
  "title": "DDL이 끼어든 트랜잭션의 롤백",
  "topics": [
    "db-tx-index"
  ],
  "tags": [
    "transaction-savepoint"
  ],
  "group": "db-tx-index",
  "type": "mc",
  "id": "backend-01-q18",
  "revision": 1,
  "sourceRefs": [
    "DB-L07 트랜잭션",
    "DB-D05 격리 수준",
    "DB-D06 인덱스",
    "db-concepts Part 7과 Part 8"
  ],
  "difficulty": 3,
  "correctChoiceId": "c"
}
```
### stem
InnoDB 테이블 `log_t(n INT)`가 비어 있고 autocommit이 켜져 있다. 아래 문장을 차례로 실행한 뒤 `SELECT n FROM log_t`의 결과로 알맞은 것은?
```sql
START TRANSACTION;
INSERT INTO log_t VALUES (1);
SAVEPOINT s1;
INSERT INTO log_t VALUES (2);
ALTER TABLE log_t ADD note VARCHAR(10);
ROLLBACK;
```
### choice: a
행 1만 남고 행 2는 취소된다
### choice: b
두 행이 모두 취소되어 비어 있다
### choice: c
행 1과 행 2가 모두 남는다
### choice: d
행 2만 남고 행 1은 취소된다

## question: backend-01-q19
```json
{
  "title": "REPEATABLE READ의 두 가지 읽기",
  "topics": [
    "db-tx-index"
  ],
  "tags": [
    "isolation-level"
  ],
  "group": "db-tx-index",
  "type": "mc",
  "id": "backend-01-q19",
  "revision": 1,
  "sourceRefs": [
    "DB-L07 트랜잭션",
    "DB-D05 격리 수준",
    "DB-D06 인덱스",
    "db-concepts Part 7과 Part 8"
  ],
  "difficulty": 3,
  "correctChoiceId": "b"
}
```
### stem
`account`의 `id = 1` 잔액은 100이다. InnoDB 기본 격리 수준에서 T1이 트랜잭션을 시작해 잔액을 조회한 뒤 T2가 같은 행을 150으로 바꾸고 커밋했다. T1이 같은 트랜잭션 안에서 다시 조회할 때 일반 `SELECT`와 `SELECT ... FOR UPDATE`의 결과로 알맞은 것은?
### choice: a
일반 조회 100 / 잠금 조회 100
### choice: b
일반 조회 100 / 잠금 조회 150
### choice: c
일반 조회 150 / 잠금 조회 150
### choice: d
일반 조회 150 / 잠금 조회 100

## question: backend-01-q20
```json
{
  "title": "따옴표 안의 물음표",
  "topics": [
    "jdbc"
  ],
  "tags": [
    "prepared-statement"
  ],
  "group": "jdbc",
  "type": "mc",
  "id": "backend-01-q20",
  "revision": 1,
  "sourceRefs": [
    "DB-L09 JDBC",
    "BE-LAB-10 DAO와 MVC",
    "db-concepts Part 10"
  ],
  "difficulty": 3,
  "correctChoiceId": "d"
}
```
### stem
다음 코드에서 `keyword`로 `java`를 넘겼을 때 일어나는 일로 알맞은 것은?
```java
String sql = "SELECT title FROM book WHERE title LIKE '%?%'";
try (PreparedStatement ps = con.prepareStatement(sql)) {
    ps.setString(1, keyword);
    try (ResultSet rs = ps.executeQuery()) {
        // 결과 처리
    }
}
```
### choice: a
`?`가 `java`로 바뀌어 제목에 `java`가 들어간 행이 조회된다
### choice: b
`setString`의 인덱스는 0부터 시작하므로 1에서 예외가 발생한다
### choice: c
`LIKE`에는 `?`를 쓸 수 없어 `prepareStatement`에서 예외가 발생한다
### choice: d
따옴표 안의 `?`는 자리표시자가 아니라서 `setString`에서 SQLException이 발생한다

## question: backend-01-q21
```json
{
  "title": "DAO 메서드마다 연결을 얻을 때의 트랜잭션",
  "topics": [
    "jdbc"
  ],
  "tags": [
    "tx-boundary"
  ],
  "group": "jdbc",
  "type": "mc",
  "id": "backend-01-q21",
  "revision": 1,
  "sourceRefs": [
    "DB-L09 JDBC",
    "BE-LAB-10 DAO와 MVC",
    "db-concepts Part 10"
  ],
  "difficulty": 3,
  "correctChoiceId": "b"
}
```
### stem
`AccountDao`의 `withdraw`와 `deposit`은 각각 `DBUtil.getConnection()`으로 새 연결을 얻어 실행하고 닫으며 autocommit은 기본값이다. 서비스가 `withdraw(1, 500)`에 이어 `deposit(2, 500)`을 호출하는데 두 번째 호출에서 예외가 발생했다. 계정 1의 잔액은 어떻게 되는가?
### choice: a
예외가 나면 JDBC가 자동으로 되돌려 원래 잔액으로 돌아간다
### choice: b
500이 줄어든 채 남는다. 두 작업을 한 연결의 트랜잭션으로 묶어야 한다
### choice: c
두 메서드가 하나의 트랜잭션이라서 예외 때 함께 롤백된다
### choice: d
연결을 닫을 때 커밋되지 않은 변경이 취소되어 잔액이 유지된다

## question: backend-01-q22
```json
{
  "title": "같은 이름의 여러 파라미터 읽기",
  "topics": [
    "web-servlet"
  ],
  "tags": [
    "request-encoding"
  ],
  "group": "web-servlet",
  "type": "short",
  "id": "backend-01-q22",
  "revision": 1,
  "sourceRefs": [
    "BE-LAB-01 Servlet 생명주기와 URL 매핑",
    "backend-concepts Part 2"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "getParameterValues",
    "getParameterValues()"
  ],
  "normalization": "caseFold"
}
```
### stem
체크박스처럼 같은 이름으로 여러 값이 전송될 때 모든 값을 `String[]`로 읽는 `HttpServletRequest`의 메서드 이름을 쓰시오.

## question: backend-01-q23
```json
{
  "title": "예외 클래스로 오류 페이지 연결",
  "topics": [
    "mvc-filter"
  ],
  "tags": [
    "error-page-mapping"
  ],
  "group": "mvc-filter",
  "type": "short",
  "id": "backend-01-q23",
  "revision": 1,
  "sourceRefs": [
    "BE-LAB-01 Front Controller와 Filter",
    "backend-concepts Part 3"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "exception-type",
    "<exception-type>"
  ],
  "normalization": "caseFold"
}
```
### stem
`web.xml`의 `<error-page>`에서 HTTP 상태 코드 대신 예외 클래스를 기준으로 오류 페이지를 연결할 때 `<error-code>` 자리에 쓰는 태그 이름을 쓰시오.

## question: backend-01-q24
```json
{
  "title": "redirect 응답 뒤의 요청 횟수",
  "topics": [
    "jsp-el"
  ],
  "tags": [
    "forward-redirect-prg"
  ],
  "group": "jsp-el",
  "type": "short",
  "id": "backend-01-q24",
  "revision": 1,
  "sourceRefs": [
    "BE-LAB-02 JSP와 forward",
    "BE-LAB-04 EL과 JSTL",
    "backend-concepts Part 4와 Part 5"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "2",
    "2번",
    "2회",
    "두 번"
  ],
  "normalization": "trim"
}
```
### stem
게시글 등록 `POST`를 처리한 Servlet이 `response.sendRedirect("/app/list.do")`로 응답했다. 등록 요청을 포함해 브라우저가 서버로 보낸 요청은 모두 몇 번인가? 숫자만 쓰시오.

## question: backend-01-q25
```json
{
  "title": "세션 타임아웃의 단위",
  "topics": [
    "state-session"
  ],
  "tags": [
    "session-lifetime"
  ],
  "group": "state-session",
  "type": "short",
  "id": "backend-01-q25",
  "revision": 1,
  "sourceRefs": [
    "BE-LAB-03 로그인과 세션",
    "backend-concepts Part 6"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "분",
    "minute",
    "minutes",
    "min"
  ],
  "normalization": "caseFold"
}
```
### stem
`web.xml`의 `<session-timeout>`에 `30`을 쓰면 세션이 만료되기까지의 비활성 시간이 설정된다. 이 값 30의 단위를 한 단어로 쓰시오.

## question: backend-01-q26
```json
{
  "title": "DISTINCT가 다루는 NULL",
  "topics": [
    "sql-select"
  ],
  "tags": [
    "null-three-valued"
  ],
  "group": "sql-select",
  "type": "short",
  "id": "backend-01-q26",
  "revision": 1,
  "sourceRefs": [
    "DB-L02 조회와 NULL",
    "DB-L03 집계와 그룹화",
    "db-concepts Part 2와 Part 3"
  ],
  "difficulty": 2,
  "acceptedAnswers": [
    "3"
  ],
  "normalization": "trim"
}
```
### stem
`ticket` 테이블에 대해 아래 쿼리가 반환하는 값을 숫자로 쓰시오.
```text
ticket
id | grade
1  | A
2  | B
3  | NULL
4  | NULL
5  | A
```
```sql
SELECT COUNT(*)
FROM (SELECT DISTINCT grade FROM ticket) t;
```

## question: backend-01-q27
```json
{
  "title": "뷰의 조건을 지키는 옵션",
  "topics": [
    "sql-join-subquery"
  ],
  "tags": [
    "view-dml"
  ],
  "group": "sql-join-subquery",
  "type": "short",
  "id": "backend-01-q27",
  "revision": 1,
  "sourceRefs": [
    "DB-L04 조인과 집합 연산",
    "DB-L05 서브쿼리",
    "db-concepts Part 4와 Part 5"
  ],
  "difficulty": 2,
  "acceptedAnswers": [
    "WITH CHECK OPTION",
    "CHECK OPTION"
  ],
  "normalization": "caseFold"
}
```
### stem
`WHERE age >= 20` 조건으로 만든 뷰에 `age`가 15인 행을 INSERT하면 오류가 나도록 뷰를 정의할 때 `SELECT` 문 뒤에 붙이는 옵션을 영문 키워드로 쓰시오.

## question: backend-01-q28
```json
{
  "title": "기본키가 되지 못한 후보키",
  "topics": [
    "db-schema"
  ],
  "tags": [
    "modeling-keys"
  ],
  "group": "db-schema",
  "type": "short",
  "id": "backend-01-q28",
  "revision": 1,
  "sourceRefs": [
    "DB-L06 제약조건",
    "DB-L08 모델링과 정규화",
    "db-concepts Part 6과 Part 9"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "대체키",
    "대체 키",
    "alternate key"
  ],
  "normalization": "caseFold"
}
```
### stem
후보키 중에서 기본키로 선택되지 않고 남은 키를 무엇이라 하는지 쓰시오.

## question: backend-01-q29
```json
{
  "title": "행 데이터를 담은 InnoDB 인덱스",
  "topics": [
    "db-tx-index"
  ],
  "tags": [
    "index-structure"
  ],
  "group": "db-tx-index",
  "type": "short",
  "id": "backend-01-q29",
  "revision": 1,
  "sourceRefs": [
    "DB-L07 트랜잭션",
    "DB-D05 격리 수준",
    "DB-D06 인덱스",
    "db-concepts Part 7과 Part 8"
  ],
  "difficulty": 2,
  "acceptedAnswers": [
    "클러스터드 인덱스",
    "클러스터 인덱스",
    "clustered index"
  ],
  "normalization": "caseFold"
}
```
### stem
InnoDB에서 기본키 순서로 행 데이터 자체를 리프 노드에 저장하는 인덱스를 무엇이라 하는지 쓰시오.

## question: backend-01-q30
```json
{
  "title": "첫 행을 건너뛰는 next 호출",
  "topics": [
    "jdbc"
  ],
  "tags": [
    "resultset-resource"
  ],
  "group": "jdbc",
  "type": "short",
  "id": "backend-01-q30",
  "revision": 1,
  "sourceRefs": [
    "DB-L09 JDBC",
    "BE-LAB-10 DAO와 MVC",
    "db-concepts Part 10"
  ],
  "difficulty": 2,
  "acceptedAnswers": [
    "2"
  ],
  "normalization": "trim"
}
```
### stem
조회 결과가 3행일 때 아래 코드가 끝난 뒤 `n`의 값을 숫자로 쓰시오.
```java
ResultSet rs = ps.executeQuery();
rs.next();
int n = 0;
while (rs.next()) {
    n++;
}
```

## question: backend-01-q31
```json
{
  "title": "Front Controller 구조의 요청 처리",
  "topics": [
    "mvc-filter"
  ],
  "tags": [
    "front-controller"
  ],
  "group": "mvc-filter",
  "type": "essay",
  "id": "backend-01-q31",
  "revision": 1,
  "sourceRefs": [
    "BE-LAB-01 Front Controller와 Filter",
    "backend-concepts Part 3"
  ],
  "difficulty": 3,
  "rubric": [
    {
      "id": "r0",
      "criterion": "Servlet마다 반복되던 인코딩 지정과 로깅 같은 공통 코드를 한곳에서 처리해 중복을 줄인다고 설명한다",
      "points": 1
    },
    {
      "id": "r1",
      "criterion": "요청 경로에서 action(`list`)을 뽑아 해당 처리 로직으로 분기한다고 설명한다",
      "points": 1
    },
    {
      "id": "r2",
      "criterion": "처리 결과를 request나 session에 담고 View를 골라 forward 또는 redirect한다고 설명한다",
      "points": 1
    },
    {
      "id": "r3",
      "criterion": "정의되지 않은 action은 404 응답이나 오류 페이지로 처리하고 예외 정보를 사용자에게 그대로 보이지 않는다고 설명한다",
      "points": 1
    }
  ],
  "modelAnswer": "Front Controller는 모든 요청을 하나의 Servlet이 먼저 받는 구조다. 기능마다 Servlet을 만들면 인코딩 지정과 로깅과 예외 처리 같은 공통 코드가 Servlet마다 반복되는데 한곳에서 처리하면 이 중복이 사라진다. `/board/list.do` 요청은 Front Controller가 받아 경로에서 action인 `list`를 뽑고 알맞은 처리 로직을 호출한다. 처리 결과는 request에 담고 보여 줄 JSP를 골라 forward한다. 등록처럼 데이터를 바꾸는 요청은 redirect로 이동한다. 정의되지 않은 action이면 `response.sendError(404)`로 404 응답을 보내거나 오류 페이지로 이동하고 예외 내용은 로그에만 남긴다."
}
```
### stem
게시판의 기능(목록, 상세, 등록)마다 Servlet을 따로 만들던 프로젝트를 `*.do` 요청을 모두 받는 Front Controller 하나로 바꾸려 한다. (1) 이 구조가 해결하려는 문제 (2) `/board/list.do` 요청이 처리되는 흐름 (3) 정의되지 않은 action이 들어왔을 때의 처리 방법을 서술하시오.

## question: backend-01-q32
```json
{
  "title": "다대다 관계의 테이블 설계",
  "topics": [
    "db-schema"
  ],
  "tags": [
    "modeling-keys"
  ],
  "group": "db-schema",
  "type": "essay",
  "id": "backend-01-q32",
  "revision": 1,
  "sourceRefs": [
    "DB-L06 제약조건",
    "DB-L08 모델링과 정규화",
    "db-concepts Part 6과 Part 9"
  ],
  "difficulty": 3,
  "rubric": [
    {
      "id": "r0",
      "criterion": "다대다 관계는 열 하나로 표현할 수 없어 연결 테이블을 따로 둔다고 설명한다",
      "points": 1
    },
    {
      "id": "r1",
      "criterion": "연결 테이블이 학생의 기본키와 동아리의 기본키를 각각 외래키로 가진다고 설명한다",
      "points": 1
    },
    {
      "id": "r2",
      "criterion": "두 외래키를 묶은 복합 기본키로 같은 학생의 중복 가입을 막는다고 설명한다(대리키를 쓰면 두 값의 UNIQUE 제약도 인정한다)",
      "points": 1
    },
    {
      "id": "r3",
      "criterion": "가입 날짜는 학생이나 동아리가 아니라 둘의 조합에 종속되므로 연결 테이블에 둔다고 설명한다",
      "points": 1
    }
  ],
  "modelAnswer": "학생과 동아리는 다대다 관계라서 한쪽 테이블에 열을 넣어 표현할 수 없다. 두 테이블 사이에 가입 테이블을 따로 만든다. 가입 테이블은 학생의 기본키와 동아리의 기본키를 각각 외래키로 가지며 두 열을 묶어 복합 기본키로 삼아 같은 학생이 같은 동아리에 두 번 가입하지 못하게 한다. 대리키를 쓴다면 두 열에 UNIQUE 제약을 둔다. 가입 날짜는 학생 한 명이나 동아리 하나가 아니라 학생과 동아리의 조합이 정하는 값이므로 가입 테이블의 열로 둔다. 외래키는 존재하지 않는 학생이나 동아리를 가리키는 가입 행도 막는다."
}
```
### stem
학생과 동아리 사이에 “한 학생은 여러 동아리에 가입하고 한 동아리에는 여러 학생이 가입한다”는 관계가 있고 가입 날짜도 저장해야 한다. 이 요구를 관계형 테이블로 설계하는 방법을 (1) 필요한 테이블 구성 (2) 기본키와 외래키 (3) 가입 날짜의 위치와 이유를 포함해 서술하시오.
