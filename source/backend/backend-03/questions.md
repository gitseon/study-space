## question: backend-03-q01
```json
{
  "title": "doGet만 있는 Servlet에 POST가 올 때",
  "topics": [
    "web-servlet"
  ],
  "tags": [
    "servlet-lifecycle"
  ],
  "group": "web-servlet",
  "type": "mc",
  "id": "backend-03-q01",
  "revision": 1,
  "sourceRefs": [
    "BE-LAB-01 Servlet 생명주기와 URL 매핑",
    "backend-concepts Part 2"
  ],
  "difficulty": 2,
  "correctChoiceId": "d"
}
```
### stem
`doGet`만 구현한 아래 Servlet의 주소로 HTML 폼이 `method="post"`로 값을 전송했다. 응답으로 알맞은 것은?
```java
@WebServlet("/greet")
public class GreetServlet extends HttpServlet {
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws IOException {
        res.getWriter().print("안녕하세요");
    }
}
```
### choice: a
`service()`가 구현된 `doGet()`으로 대신 넘겨 정상 응답을 보낸다
### choice: b
POST 요청은 `init()` 단계에서 거부되어 Servlet이 만들어지지 않는다
### choice: c
폼 전송은 항상 GET으로 바뀌어 `doGet()`이 그대로 실행된다
### choice: d
`service()`가 POST를 `doPost()`로 넘기는데 기본 구현이 405 오류로 응답한다

## question: backend-03-q02
```json
{
  "title": "슬래시와 슬래시별표 매핑의 차이",
  "topics": [
    "web-servlet"
  ],
  "tags": [
    "url-mapping"
  ],
  "group": "web-servlet",
  "type": "mc",
  "id": "backend-03-q02",
  "revision": 1,
  "sourceRefs": [
    "BE-LAB-01 Servlet 생명주기와 URL 매핑",
    "backend-concepts Part 2"
  ],
  "difficulty": 3,
  "correctChoiceId": "c"
}
```
### stem
Servlet `AppServlet`을 `/*`로 매핑할 때와 `/`로 매핑할 때를 비교한다. 컨테이너의 JSP 처리 Servlet은 `*.jsp`로 매핑되어 있다. 두 매핑의 차이로 알맞은 것은?
### choice: a
`/`는 `.jsp` 요청까지 가로채고 `/*`는 다른 매핑에 맞지 않는 요청만 받는다
### choice: b
두 패턴은 의미가 같아서 어느 쪽으로 매핑해도 `.jsp` 요청을 가로채지 못한다
### choice: c
`/*`는 `.jsp` 요청까지 가로채고 `/`는 `*.jsp` 같은 확장자 매핑에 맞지 않는 요청만 받는다
### choice: d
`/*`는 정확히 일치하는 경로만 받고 `/`는 모든 경로를 받는다

## question: backend-03-q03
```json
{
  "title": "쿼리 문자열의 URL 인코딩",
  "topics": [
    "web-servlet"
  ],
  "tags": [
    "request-encoding"
  ],
  "group": "web-servlet",
  "type": "mc",
  "id": "backend-03-q03",
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
검색어 `가 나`를 쿼리 문자열에 넣으려고 `URLEncoder.encode(kw, "UTF-8")`을 호출했다. 반환되는 문자열은?
### choice: a
%EA%B0%80%20%EB%82%98
### choice: b
%ea%b0%80+%eb%82%98
### choice: c
%EA%B0%80+%EB%82%98
### choice: d
%EA%B0%80%2B%EB%82%98

## question: backend-03-q04
```json
{
  "title": "요청 주소에서 action 뽑기",
  "topics": [
    "mvc-filter"
  ],
  "tags": [
    "front-controller"
  ],
  "group": "mvc-filter",
  "type": "mc",
  "id": "backend-03-q04",
  "revision": 1,
  "sourceRefs": [
    "BE-LAB-01 Front Controller와 Filter",
    "backend-concepts Part 3"
  ],
  "difficulty": 2,
  "correctChoiceId": "b"
}
```
### stem
Front Controller가 요청 주소에서 action 이름을 뽑는다. 요청이 `/app/board/write.do`일 때 `action` 값은?
```java
String uri = "/app/board/write.do";   // req.getRequestURI()
String ctx = "/app";                  // req.getContextPath()
String path = uri.substring(ctx.length());
String action = path.substring(path.lastIndexOf('/') + 1,
        path.lastIndexOf(".do"));
```
### choice: a
board
### choice: b
write
### choice: c
write.do
### choice: d
/write

## question: backend-03-q05
```json
{
  "title": "URL 패턴이 다른 두 Filter",
  "topics": [
    "mvc-filter"
  ],
  "tags": [
    "filter-chain"
  ],
  "group": "mvc-filter",
  "type": "mc",
  "id": "backend-03-q05",
  "revision": 1,
  "sourceRefs": [
    "BE-LAB-01 Front Controller와 Filter",
    "backend-concepts Part 3"
  ],
  "difficulty": 3,
  "correctChoiceId": "d"
}
```
### stem
`web.xml`에 Filter F1이 `/*`로 F2가 `/auth/*`로 이 순서로 매핑되어 있고 요청이 Servlet까지 도달하면 `S`를 출력한다. `/index.jsp` 요청과 `/auth/mypage` 요청에서 실행되는 순서로 알맞은 것은? (모든 Filter는 `chain.doFilter()`를 호출한다)
### choice: a
/index.jsp는 F1 → F2 → S이고 /auth/mypage는 F1 → F2 → S이다
### choice: b
/index.jsp는 S이고 /auth/mypage는 F2 → S이다
### choice: c
/index.jsp는 F1 → S이고 /auth/mypage는 F2 → S이다
### choice: d
/index.jsp는 F1 → S이고 /auth/mypage는 F1 → F2 → S이다

## question: backend-03-q06
```json
{
  "title": "session을 끈 JSP의 내장 객체",
  "topics": [
    "jsp-el"
  ],
  "tags": [
    "jsp-translation"
  ],
  "group": "jsp-el",
  "type": "mc",
  "id": "backend-03-q06",
  "revision": 1,
  "sourceRefs": [
    "BE-LAB-02 JSP와 forward",
    "BE-LAB-04 EL과 JSTL",
    "backend-concepts Part 4와 Part 5"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
다음 JSP를 요청하면 어떻게 되는가?
```jsp
<%@ page session="false" %>
<%= session.getId() %>
```
### choice: a
`session` 내장 객체가 선언되지 않아 번역 단계에서 오류가 난다
### choice: b
세션이 없으므로 `session.getId()`가 빈 문자열을 출력한다
### choice: c
요청 때 `session`이 `null`이라 NullPointerException이 발생한다
### choice: d
`page` 지시자가 무시되어 세션이 만들어지고 ID가 출력된다

## question: backend-03-q07
```json
{
  "title": "forEach의 index와 count",
  "topics": [
    "jsp-el"
  ],
  "tags": [
    "jstl-tags"
  ],
  "group": "jsp-el",
  "type": "mc",
  "id": "backend-03-q07",
  "revision": 1,
  "sourceRefs": [
    "BE-LAB-02 JSP와 forward",
    "BE-LAB-04 EL과 JSTL",
    "backend-concepts Part 4와 Part 5"
  ],
  "difficulty": 2,
  "correctChoiceId": "c"
}
```
### stem
`names`에 원소가 3개 들어 있을 때 마지막 반복에서 출력되는 내용은?
```jsp
<c:forEach items="${names}" var="n" varStatus="st">
    ${st.index}:${st.count}
</c:forEach>
```
### choice: a
3:3
### choice: b
2:2
### choice: c
2:3
### choice: d
3:2

## question: backend-03-q08
```json
{
  "title": "HttpOnly 쿠키의 접근",
  "topics": [
    "state-session"
  ],
  "tags": [
    "cookie-remember-id"
  ],
  "group": "state-session",
  "type": "mc",
  "id": "backend-03-q08",
  "revision": 1,
  "sourceRefs": [
    "BE-LAB-03 로그인과 세션",
    "backend-concepts Part 6"
  ],
  "difficulty": 2,
  "correctChoiceId": "d"
}
```
### stem
서버가 `Set-Cookie: sid=abc; HttpOnly`로 쿠키를 보냈다. 이 쿠키에 대한 설명으로 알맞은 것은?
### choice: a
서버로 전송되지 않고 브라우저의 JavaScript에서만 읽을 수 있다
### choice: b
HTTPS 연결에서만 서버로 전송되고 JavaScript는 읽을 수 있다
### choice: c
다른 사이트에서 시작된 요청에는 쿠키를 싣지 않도록 막는다
### choice: d
`document.cookie`로 읽을 수 없지만 요청에는 자동으로 실린다

## question: backend-03-q09
```json
{
  "title": "로그인 직후의 changeSessionId",
  "topics": [
    "state-session"
  ],
  "tags": [
    "session-auth"
  ],
  "group": "state-session",
  "type": "mc",
  "id": "backend-03-q09",
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
로그인에 성공한 직후 `request.changeSessionId()`를 호출하는 코드가 있다. 이 호출의 목적으로 알맞은 것은?
### choice: a
세션의 속성을 모두 지워 로그인 정보를 처음부터 다시 만든다
### choice: b
세션의 비활성 유지 시간을 초기화해 만료 시각을 뒤로 미룬다
### choice: c
로그인 전에 알려진 세션 ID를 쓰는 세션 고정 공격을 막는다
### choice: d
세션을 서버가 아닌 브라우저의 쿠키로 옮겨 저장한다

## question: backend-03-q10
```json
{
  "title": "WHERE와 HAVING이 함께 있는 집계",
  "topics": [
    "sql-select"
  ],
  "tags": [
    "where-vs-having"
  ],
  "group": "sql-select",
  "type": "mc",
  "id": "backend-03-q10",
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
`pay` 테이블에 다음 쿼리를 실행했다. 결과로 알맞은 것은? (`AVG` 값의 소수 자릿수는 무시한다)
```text
pay
dept   | sal
개발   | 100
개발   | 300
개발   | 500
운영   | 200
운영   | 250
품질   | 400
```
```sql
SELECT dept, AVG(sal)
FROM pay
WHERE sal >= 200
GROUP BY dept
HAVING AVG(sal) >= 300
ORDER BY dept;
```
### choice: a
개발 300 / 품질 400
### choice: b
개발 400 / 운영 225 / 품질 400
### choice: c
개발 300 / 운영 225 / 품질 400
### choice: d
개발 400 / 품질 400

## question: backend-03-q11
```json
{
  "title": "바이트 수와 글자 수",
  "topics": [
    "sql-select"
  ],
  "tags": [
    "order-limit-concat"
  ],
  "group": "sql-select",
  "type": "mc",
  "id": "backend-03-q11",
  "revision": 1,
  "sourceRefs": [
    "DB-L02 조회와 NULL",
    "DB-L03 집계와 그룹화",
    "db-concepts Part 2와 Part 3"
  ],
  "difficulty": 2,
  "correctChoiceId": "b"
}
```
### stem
문자 집합이 utf8mb4인 MySQL 8.4에서 다음 쿼리의 첫째 값과 둘째 값으로 알맞은 것은? (한글 한 글자는 3바이트이다)
```sql
SELECT LENGTH('가나'), CHAR_LENGTH('가나');
```
### choice: a
2와 2
### choice: b
6과 2
### choice: c
2와 6
### choice: d
6과 6

## question: backend-03-q12
```json
{
  "title": "NULL 키의 조인",
  "topics": [
    "sql-select"
  ],
  "tags": [
    "null-three-valued"
  ],
  "group": "sql-select",
  "type": "mc",
  "id": "backend-03-q12",
  "revision": 1,
  "sourceRefs": [
    "DB-L02 조회와 NULL",
    "DB-L03 집계와 그룹화",
    "db-concepts Part 2와 Part 3"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
두 테이블 `p`와 `q`의 `k` 열에는 각각 1과 NULL이 들어 있다. 두 쿼리가 반환하는 숫자로 알맞은 것은? (MySQL 8.4)
```sql
-- 쿼리 A
SELECT COUNT(*) FROM p JOIN q ON p.k = q.k;

-- 쿼리 B
SELECT COUNT(*) FROM p JOIN q ON p.k <=> q.k;
```
### choice: a
A는 1이고 B는 2이다
### choice: b
A는 2이고 B는 2이다
### choice: c
A는 1이고 B는 1이다
### choice: d
A는 0이고 B는 2이다

## question: backend-03-q13
```json
{
  "title": "자기 조인으로 상사 찾기",
  "topics": [
    "sql-join-subquery"
  ],
  "tags": [
    "join-types"
  ],
  "group": "sql-join-subquery",
  "type": "mc",
  "id": "backend-03-q13",
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
`emp` 테이블에서 각 사원의 상사를 찾으려고 자기 조인을 했다. 결과의 `m.name` 열을 위에서부터 읽을 때로 알맞은 것은?
```text
emp
id | name | mgr
1  | 가온 | NULL
2  | 나래 | 1
3  | 다솜 | 1
4  | 라온 | 2
```
```sql
SELECT e.name, m.name
FROM emp e LEFT JOIN emp m ON e.mgr = m.id
ORDER BY e.id;
```
### choice: a
NULL 가온 나래 다솜
### choice: b
NULL 가온 가온 나래
### choice: c
가온 가온 나래
### choice: d
NULL 가온 가온 가온

## question: backend-03-q14
```json
{
  "title": "부서 평균보다 높은 급여",
  "topics": [
    "sql-join-subquery"
  ],
  "tags": [
    "subquery-forms"
  ],
  "group": "sql-join-subquery",
  "type": "mc",
  "id": "backend-03-q14",
  "revision": 1,
  "sourceRefs": [
    "DB-L04 조인과 집합 연산",
    "DB-L05 서브쿼리",
    "db-concepts Part 4와 Part 5"
  ],
  "difficulty": 3,
  "correctChoiceId": "d"
}
```
### stem
`pay` 테이블에서 자기 부서의 평균 급여보다 급여가 높은 사원을 상관 서브쿼리로 구하려고 한다. 조회되는 행 수로 알맞은 것은?
```text
pay
name | dept | sal
가온 | 개발 | 100
나래 | 개발 | 300
다솜 | 개발 | 500
라온 | 운영 | 200
마루 | 운영 | 250
바다 | 품질 | 400
```
```sql
SELECT name
FROM pay e
WHERE sal > (SELECT AVG(sal) FROM pay x WHERE x.dept = e.dept);
```
### choice: a
3행
### choice: b
4행
### choice: c
1행
### choice: d
2행

## question: backend-03-q15
```json
{
  "title": "집계 뷰의 UPDATE",
  "topics": [
    "sql-join-subquery"
  ],
  "tags": [
    "view-dml"
  ],
  "group": "sql-join-subquery",
  "type": "mc",
  "id": "backend-03-q15",
  "revision": 1,
  "sourceRefs": [
    "DB-L04 조인과 집합 연산",
    "DB-L05 서브쿼리",
    "db-concepts Part 4와 Part 5"
  ],
  "difficulty": 3,
  "correctChoiceId": "c"
}
```
### stem
`pay` 테이블로 다음 뷰를 만든 뒤 `UPDATE`를 실행했다. 결과로 알맞은 것은? (MySQL 8.4)
```sql
CREATE VIEW v_dept_avg AS
SELECT dept, AVG(sal) AS avg_sal FROM pay GROUP BY dept;

UPDATE v_dept_avg SET avg_sal = 300 WHERE dept = '개발';
```
### choice: a
개발 부서 사원의 급여가 모두 300으로 바뀐다
### choice: b
뷰의 계산 결과만 300으로 바뀌고 원본 테이블은 그대로 유지된다
### choice: c
오류가 난다. 집계가 들어간 뷰는 원본 행과 일대일로 대응하지 않아 갱신할 수 없다
### choice: d
`WITH CHECK OPTION`이 없어 갱신은 되고 경고만 나온다

## question: backend-03-q16
```json
{
  "title": "UNIQUE 열과 NULL",
  "topics": [
    "db-schema"
  ],
  "tags": [
    "constraints"
  ],
  "group": "db-schema",
  "type": "mc",
  "id": "backend-03-q16",
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
MySQL 8.4에서 `acct(email VARCHAR(20) UNIQUE)` 테이블이 비어 있다. 아래 네 문장을 차례로 실행했을 때 결과로 알맞은 것은?
```sql
INSERT INTO acct VALUES ('a@x');    -- 1번
INSERT INTO acct VALUES ('a@x');    -- 2번
INSERT INTO acct VALUES (NULL);     -- 3번
INSERT INTO acct VALUES (NULL);     -- 4번
```
### choice: a
2번과 4번에서 오류가 나고 2행이 남는다
### choice: b
2번에서만 오류가 나고 3행이 남는다
### choice: c
2번과 3번과 4번에서 오류가 나고 1행이 남는다
### choice: d
모든 문장이 성공해서 4행이 남는다

## question: backend-03-q17
```json
{
  "title": "DELETE와 TRUNCATE의 롤백",
  "topics": [
    "db-schema"
  ],
  "tags": [
    "delete-truncate-drop"
  ],
  "group": "db-schema",
  "type": "mc",
  "id": "backend-03-q17",
  "revision": 1,
  "sourceRefs": [
    "DB-L06 제약조건",
    "DB-L08 모델링과 정규화",
    "db-concepts Part 6과 Part 9"
  ],
  "difficulty": 3,
  "correctChoiceId": "c"
}
```
### stem
InnoDB 테이블 `t`에 3행이 있고 autocommit이 켜져 있다. 아래 문장을 차례로 실행했을 때 (가)와 (나)의 결과로 알맞은 것은? (MySQL 8.4)
```sql
START TRANSACTION;
DELETE FROM t;
ROLLBACK;
SELECT COUNT(*) FROM t;   -- (가)

START TRANSACTION;
TRUNCATE TABLE t;
ROLLBACK;
SELECT COUNT(*) FROM t;   -- (나)
```
### choice: a
(가) 0 (나) 0
### choice: b
(가) 3 (나) 3
### choice: c
(가) 3 (나) 0
### choice: d
(가) 0 (나) 3

## question: backend-03-q18
```json
{
  "title": "커밋되지 않은 값의 읽기",
  "topics": [
    "db-tx-index"
  ],
  "tags": [
    "isolation-level"
  ],
  "group": "db-tx-index",
  "type": "mc",
  "id": "backend-03-q18",
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
`account`의 `id = 1` 잔액은 100이다. T2가 `UPDATE`로 150으로 바꾸고 아직 커밋하지 않았다. T1이 트랜잭션 안에서 `SELECT`로 잔액을 읽을 때 격리 수준이 `READ UNCOMMITTED`인 경우와 `READ COMMITTED`인 경우의 결과로 알맞은 것은?
### choice: a
READ UNCOMMITTED 150 / READ COMMITTED 150
### choice: b
READ UNCOMMITTED 150 / READ COMMITTED 100
### choice: c
READ UNCOMMITTED 100 / READ COMMITTED 100
### choice: d
READ UNCOMMITTED 100 / READ COMMITTED 150

## question: backend-03-q19
```json
{
  "title": "트랜잭션 안에서 다시 시작한 트랜잭션",
  "topics": [
    "db-tx-index"
  ],
  "tags": [
    "transaction-savepoint"
  ],
  "group": "db-tx-index",
  "type": "mc",
  "id": "backend-03-q19",
  "revision": 1,
  "sourceRefs": [
    "DB-L07 트랜잭션",
    "DB-D05 격리 수준",
    "DB-D06 인덱스",
    "db-concepts Part 7과 Part 8"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
InnoDB 테이블 `t(n INT)`가 비어 있고 autocommit이 켜져 있다. 아래 문장을 차례로 실행한 뒤 `t`에 남는 행으로 알맞은 것은?
```sql
START TRANSACTION;
INSERT INTO t VALUES (1);
START TRANSACTION;
INSERT INTO t VALUES (2);
ROLLBACK;
```
### choice: a
행 1만 남고 행 2는 취소된다
### choice: b
행 2만 남고 행 1은 취소된다
### choice: c
두 행이 모두 취소되어 비어 있다
### choice: d
행 1과 행 2가 모두 남는다

## question: backend-03-q20
```json
{
  "title": "commit이 없는 트랜잭션",
  "topics": [
    "jdbc"
  ],
  "tags": [
    "tx-boundary"
  ],
  "group": "jdbc",
  "type": "mc",
  "id": "backend-03-q20",
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
계정 1의 처음 잔액은 1000이다. 아래 코드를 실행한 뒤 새 연결에서 계정 1의 잔액을 조회하면? (MySQL InnoDB와 Connector/J 8.4 기준)
```java
con.setAutoCommit(false);
try (PreparedStatement ps = con.prepareStatement(
        "UPDATE account SET balance = balance - ? WHERE id = ?")) {
    ps.setInt(1, 500);
    ps.setInt(2, 1);
    ps.executeUpdate();
}
con.close();
```
### choice: a
500이다. `executeUpdate()`를 실행하면 바로 확정된다
### choice: b
1000 그대로이다. `commit()`이 없어 변경이 확정되지 않았다
### choice: c
500이다. `close()`가 연결을 닫으면서 자동으로 커밋한다
### choice: d
조회할 수 없다. 변경 중인 행은 다른 연결에서 읽을 수 없다

## question: backend-03-q21
```json
{
  "title": "NULL 열을 getInt로 읽을 때",
  "topics": [
    "jdbc"
  ],
  "tags": [
    "resultset-resource"
  ],
  "group": "jdbc",
  "type": "mc",
  "id": "backend-03-q21",
  "revision": 1,
  "sourceRefs": [
    "DB-L09 JDBC",
    "BE-LAB-10 DAO와 MVC",
    "db-concepts Part 10"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
`member` 테이블의 `bonus` 열은 정수이고 조회한 행의 값이 SQL NULL이다. 다음 코드를 실행한 결과로 알맞은 것은?
```java
int bonus = rs.getInt("bonus");
boolean none = rs.wasNull();
```
### choice: a
`bonus`는 0이고 `none`은 true이다
### choice: b
`bonus`는 0이고 `none`은 false이다
### choice: c
`getInt`가 SQLException을 던진다
### choice: d
`bonus`가 null이 되어 NullPointerException이 발생한다

## question: backend-03-q22
```json
{
  "title": "서블릿에 경로를 연결하는 태그",
  "topics": [
    "web-servlet"
  ],
  "tags": [
    "url-mapping"
  ],
  "group": "web-servlet",
  "type": "short",
  "id": "backend-03-q22",
  "revision": 1,
  "sourceRefs": [
    "BE-LAB-01 Servlet 생명주기와 URL 매핑",
    "backend-concepts Part 2"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "url-pattern",
    "<url-pattern>"
  ],
  "normalization": "caseFold"
}
```
### stem
`web.xml`에서 요청 경로 패턴을 `<servlet-mapping>` 안에 쓰는 태그 이름을 쓰시오.

## question: backend-03-q23
```json
{
  "title": "스레드마다 따로 갖는 변수",
  "topics": [
    "mvc-filter"
  ],
  "tags": [
    "shared-field-thread"
  ],
  "group": "mvc-filter",
  "type": "short",
  "id": "backend-03-q23",
  "revision": 1,
  "sourceRefs": [
    "BE-LAB-01 Front Controller와 Filter",
    "backend-concepts Part 3"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "지역 변수",
    "지역변수",
    "local variable"
  ],
  "normalization": "caseFold"
}
```
### stem
여러 요청 스레드가 같은 Servlet 객체를 함께 쓸 때 요청 값을 담아도 다른 요청과 섞이지 않는 변수의 종류를 쓰시오.

## question: backend-03-q24
```json
{
  "title": "가장 넓은 scope",
  "topics": [
    "jsp-el"
  ],
  "tags": [
    "scope-lookup"
  ],
  "group": "jsp-el",
  "type": "short",
  "id": "backend-03-q24",
  "revision": 1,
  "sourceRefs": [
    "BE-LAB-02 JSP와 forward",
    "BE-LAB-04 EL과 JSTL",
    "backend-concepts Part 4와 Part 5"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "application",
    "applicationScope"
  ],
  "normalization": "caseFold"
}
```
### stem
JSP의 네 scope(page, request, session, application) 중 웹 애플리케이션 전체에서 모든 사용자가 공유하는 범위의 이름을 영문으로 쓰시오.

## question: backend-03-q25
```json
{
  "title": "코드로 세션 유지 시간 지정",
  "topics": [
    "state-session"
  ],
  "tags": [
    "session-lifetime"
  ],
  "group": "state-session",
  "type": "short",
  "id": "backend-03-q25",
  "revision": 1,
  "sourceRefs": [
    "BE-LAB-03 로그인과 세션",
    "backend-concepts Part 6"
  ],
  "difficulty": 2,
  "acceptedAnswers": [
    "setMaxInactiveInterval",
    "setMaxInactiveInterval()"
  ],
  "normalization": "caseFold"
}
```
### stem
`web.xml` 대신 코드에서 세션의 비활성 유지 시간을 초 단위로 지정하는 `HttpSession`의 메서드 이름을 쓰시오.

## question: backend-03-q26
```json
{
  "title": "COUNT가 세지 않는 값",
  "topics": [
    "sql-select"
  ],
  "tags": [
    "null-three-valued"
  ],
  "group": "sql-select",
  "type": "short",
  "id": "backend-03-q26",
  "revision": 1,
  "sourceRefs": [
    "DB-L02 조회와 NULL",
    "DB-L03 집계와 그룹화",
    "db-concepts Part 2와 Part 3"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "NULL",
    "널"
  ],
  "normalization": "caseFold"
}
```
### stem
`COUNT(*)`와 달리 `COUNT(컬럼)`이 세지 않는 값을 쓰시오.

## question: backend-03-q27
```json
{
  "title": "중복을 유지하는 합집합",
  "topics": [
    "sql-join-subquery"
  ],
  "tags": [
    "set-operations"
  ],
  "group": "sql-join-subquery",
  "type": "short",
  "id": "backend-03-q27",
  "revision": 1,
  "sourceRefs": [
    "DB-L04 조인과 집합 연산",
    "DB-L05 서브쿼리",
    "db-concepts Part 4와 Part 5"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "ALL",
    "UNION ALL"
  ],
  "normalization": "caseFold"
}
```
### stem
`UNION`이 결과의 중복 행을 제거하지 않고 모두 합치도록 `UNION` 뒤에 붙이는 키워드를 영문으로 쓰시오.

## question: backend-03-q28
```json
{
  "title": "업무와 무관하게 붙인 식별자",
  "topics": [
    "db-schema"
  ],
  "tags": [
    "modeling-keys"
  ],
  "group": "db-schema",
  "type": "short",
  "id": "backend-03-q28",
  "revision": 1,
  "sourceRefs": [
    "DB-L06 제약조건",
    "DB-L08 모델링과 정규화",
    "db-concepts Part 6과 Part 9"
  ],
  "difficulty": 2,
  "acceptedAnswers": [
    "인조키",
    "대리키",
    "인조 식별자",
    "surrogate key"
  ],
  "normalization": "caseFold"
}
```
### stem
업무 의미와 무관하게 DBMS나 응용이 만들어 붙이는 `AUTO_INCREMENT` 번호 같은 식별자를 무엇이라 하는지 쓰시오.

## question: backend-03-q29
```json
{
  "title": "InnoDB 인덱스의 트리",
  "topics": [
    "db-tx-index"
  ],
  "tags": [
    "index-structure"
  ],
  "group": "db-tx-index",
  "type": "short",
  "id": "backend-03-q29",
  "revision": 1,
  "sourceRefs": [
    "DB-L07 트랜잭션",
    "DB-D05 격리 수준",
    "DB-D06 인덱스",
    "db-concepts Part 7과 Part 8"
  ],
  "difficulty": 2,
  "acceptedAnswers": [
    "B+Tree",
    "B+ Tree",
    "B+트리",
    "B+ 트리"
  ],
  "normalization": "caseFold"
}
```
### stem
InnoDB 인덱스가 사용하는 균형 트리 구조의 이름을 영문으로 쓰시오.

## question: backend-03-q30
```json
{
  "title": "SELECT를 실행하는 메서드",
  "topics": [
    "jdbc"
  ],
  "tags": [
    "prepared-statement"
  ],
  "group": "jdbc",
  "type": "short",
  "id": "backend-03-q30",
  "revision": 1,
  "sourceRefs": [
    "DB-L09 JDBC",
    "BE-LAB-10 DAO와 MVC",
    "db-concepts Part 10"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "executeQuery",
    "executeQuery()"
  ],
  "normalization": "caseFold"
}
```
### stem
`PreparedStatement`로 SELECT를 실행해 `ResultSet`을 돌려받는 메서드 이름을 쓰시오.

## question: backend-03-q31
```json
{
  "title": "Filter로 보호 경로 만들기",
  "topics": [
    "mvc-filter"
  ],
  "tags": [
    "filter-chain"
  ],
  "group": "mvc-filter",
  "type": "essay",
  "id": "backend-03-q31",
  "revision": 2,
  "sourceRefs": [
    "BE-LAB-01 Front Controller와 Filter",
    "backend-concepts Part 3"
  ],
  "difficulty": 3,
  "rubric": [
    {
      "id": "r0",
      "criterion": "Filter를 `/auth/*`에 매핑해 해당 경로의 요청이 Servlet보다 먼저 이 Filter를 거친다고 설명한다",
      "points": 1
    },
    {
      "id": "r1",
      "criterion": "세션(`getSession(false)`)에서 `loginUser` 속성이 있는지 확인해 로그인 여부를 판단한다고 설명한다",
      "points": 1
    },
    {
      "id": "r2",
      "criterion": "로그인하지 않았으면 로그인 폼으로 redirect하고 `chain.doFilter()`를 호출하지 않으며 로그인했으면 `chain.doFilter()`로 통과시킨다고 설명한다",
      "points": 1
    },
    {
      "id": "r3",
      "criterion": "검사 코드를 한곳에 모아 Servlet마다 반복되는 중복과 누락을 줄인다고 설명한다",
      "points": 1
    }
  ],
  "modelAnswer": "**(1)** Filter를 `/auth/*` 패턴에 매핑하면 이 경로로 오는 모든 요청이 Servlet에 닿기 전에 Filter를 먼저 거친다.\n\n**(2)** Filter는 `getSession(false)`로 세션을 얻어 `loginUser` 속성이 있는지 확인한다. 세션이나 속성이 없으면 로그인 폼으로 redirect하고 `chain.doFilter()`를 호출하지 않아 요청이 Servlet까지 가지 못한다. 속성이 있으면 `chain.doFilter()`를 호출해 다음 단계로 넘긴다.\n\n**(3)** 각 Servlet에 검사를 넣으면 같은 코드가 반복되고 새 Servlet에서 검사를 빠뜨릴 수 있지만 Filter 하나에 모으면 보호 경로 전체가 같은 규칙을 따른다."
}
```
### stem
게시판에서 `/auth/*` 경로는 로그인한 사용자만 쓸 수 있어야 한다. 이 검사를 Filter로 구현하는 방법을 다음 순서로 서술하시오.

(1) Filter의 매핑과 적용 범위

(2) 로그인하지 않은 요청과 로그인한 요청의 처리

(3) 각 Servlet에 검사 코드를 넣는 방식과 비교한 장점

## question: backend-03-q32
```json
{
  "title": "게시글 테이블의 정규화",
  "topics": [
    "db-schema"
  ],
  "tags": [
    "normalization"
  ],
  "group": "db-schema",
  "type": "essay",
  "id": "backend-03-q32",
  "revision": 2,
  "sourceRefs": [
    "DB-L06 제약조건",
    "DB-L08 모델링과 정규화",
    "db-concepts Part 6과 Part 9"
  ],
  "difficulty": 3,
  "rubric": [
    {
      "id": "r0",
      "criterion": "`post_id`가 `writer_id`를 결정하고 `writer_id`가 `writer_name`과 `writer_email`을 결정하는 이행 종속이 있다고 설명한다",
      "points": 1
    },
    {
      "id": "r1",
      "criterion": "기본키가 아닌 속성이 다른 비키 속성을 결정하므로 3정규형을 위반한다고 설명한다",
      "points": 1
    },
    {
      "id": "r2",
      "criterion": "`member` 테이블에 작성자 이름과 이메일을 분리하고 `post`에는 `writer_id`를 외래키로 남긴다고 설명한다",
      "points": 1
    },
    {
      "id": "r3",
      "criterion": "작성자 정보가 게시글마다 반복되어 이름 변경 때 여러 행을 고쳐야 하는 수정 이상과 중복 저장이 줄어든다고 설명한다",
      "points": 1
    }
  ],
  "modelAnswer": "**(1)** `post_id`가 `writer_id`를 정하고 `writer_id`가 `writer_name`과 `writer_email`을 정하므로 기본키가 아닌 `writer_id`를 거쳐 다른 속성이 결정되는 이행 종속이 있다. 기본키가 아닌 속성이 다른 비키 속성을 결정하는 구조이므로 3정규형을 위반한다.\n\n**(2)** 작성자 정보를 `member` 테이블로 분리하고 `post`에는 `writer_id`를 외래키로 남기면 해결된다.\n\n**(3)** 분리하기 전에는 같은 작성자의 이름과 이메일이 게시글마다 반복 저장되어 이름을 바꾸면 여러 행을 모두 고쳐야 했지만 분리한 뒤에는 한 행만 고치면 된다."
}
```
### stem
게시글 테이블 `post`의 열은 아래와 같고 기본키는 `post_id`이다. `writer_id`가 정해지면 `writer_name`과 `writer_email`이 정해진다.

```text
post(post_id, title, writer_id, writer_name, writer_email)
```

다음을 서술하시오.

(1) 이 테이블이 가진 종속 관계와 위반하는 정규형

(2) 개선한 테이블 구성

(3) 분리했을 때 줄어드는 문제
