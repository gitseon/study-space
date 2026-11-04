## question: backend-02-q01
```json
{
  "title": "서버 시작 때 초기화되는 순서",
  "topics": [
    "web-servlet"
  ],
  "tags": [
    "servlet-lifecycle"
  ],
  "group": "web-servlet",
  "type": "mc",
  "id": "backend-02-q01",
  "revision": 1,
  "sourceRefs": [
    "BE-LAB-01 Servlet 생명주기와 URL 매핑",
    "backend-concepts Part 2"
  ],
  "difficulty": 2,
  "correctChoiceId": "b"
}
```
### stem
아래 세 Servlet은 `init()`에서 자기 클래스 이름을 한 글자 출력한다. WAS를 시작해 시작 과정이 모두 끝난 뒤에 `/c` 요청이 처음 도착했다. 출력 순서로 알맞은 것은?
```java
@WebServlet(urlPatterns = "/a", loadOnStartup = 3)   // 클래스 A
@WebServlet(urlPatterns = "/b", loadOnStartup = 1)   // 클래스 B
@WebServlet("/c")                                    // 클래스 C
```
### choice: a
A → B → C
### choice: b
B → A → C
### choice: c
C → B → A
### choice: d
B → C → A

## question: backend-02-q02
```json
{
  "title": "확장자 패턴과 서블릿 경로",
  "topics": [
    "web-servlet"
  ],
  "tags": [
    "url-mapping"
  ],
  "group": "web-servlet",
  "type": "mc",
  "id": "backend-02-q02",
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
컨텍스트 경로가 `/app`이고 Servlet이 `*.do`로 매핑되어 있다. 브라우저가 아래 주소를 요청할 때 `request.getServletPath()`의 값은?
```text
http://localhost:8080/app/board/list.do?page=2
```
### choice: a
/app/board/list.do
### choice: b
/board/list
### choice: c
/board/list.do
### choice: d
/list.do?page=2

## question: backend-02-q03
```json
{
  "title": "Writer를 얻은 뒤의 응답 인코딩",
  "topics": [
    "web-servlet"
  ],
  "tags": [
    "request-encoding"
  ],
  "group": "web-servlet",
  "type": "mc",
  "id": "backend-02-q03",
  "revision": 1,
  "sourceRefs": [
    "BE-LAB-01 Servlet 생명주기와 URL 매핑",
    "backend-concepts Part 2"
  ],
  "difficulty": 3,
  "correctChoiceId": "d"
}
```
### stem
응답을 UTF-8로 보내려고 아래 코드를 작성했다. 인코딩 지정에 대한 설명으로 알맞은 것은?
```java
PrintWriter out = res.getWriter();
res.setCharacterEncoding("UTF-8");
out.print("안녕");
```
### choice: a
`setCharacterEncoding`은 요청 본문에만 쓸 수 있고 응답 Writer에는 효과가 전혀 없다
### choice: b
`PrintWriter`는 글자를 바꾸지 않고 바이트 값을 그대로 응답에 내보낸다
### choice: c
응답 인코딩은 본문을 모두 쓴 다음에 지정해야 헤더에 반영된다
### choice: d
`getWriter()` 호출로 Writer가 만들어진 뒤에는 인코딩 지정이 적용되지 않는다

## question: backend-02-q04
```json
{
  "title": "공유 필드의 증가 연산",
  "topics": [
    "mvc-filter"
  ],
  "tags": [
    "shared-field-thread"
  ],
  "group": "mvc-filter",
  "type": "mc",
  "id": "backend-02-q04",
  "revision": 1,
  "sourceRefs": [
    "BE-LAB-01 Front Controller와 Filter",
    "backend-concepts Part 3"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
다음 Servlet을 서버를 시작한 직후 두 요청이 동시에 호출했고 각 요청은 반복문을 끝까지 실행했다. 두 요청이 모두 끝난 뒤 `hits` 필드에 대한 설명으로 알맞은 것은?
```java
public class CounterServlet extends HttpServlet {
    private int hits = 0;

    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws IOException {
        for (int i = 0; i < 1000; i++) {
            hits++;
        }
        res.getWriter().print(hits);
    }
}
```
### choice: a
`hits++`는 한 번에 끝나지 않아 증가가 겹치면 2000보다 작아질 수 있다
### choice: b
객체 하나를 번갈아 쓰더라도 두 요청이 끝난 최종 값은 항상 정확히 2000이다
### choice: c
요청마다 `hits` 필드가 따로 만들어져서 두 요청 모두 1000이 된다
### choice: d
두 스레드의 증가가 서로 더해지므로 최종 값이 2000보다 커질 수도 있다

## question: backend-02-q05
```json
{
  "title": "다음 단계를 부르지 않는 Filter",
  "topics": [
    "mvc-filter"
  ],
  "tags": [
    "filter-chain"
  ],
  "group": "mvc-filter",
  "type": "mc",
  "id": "backend-02-q05",
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
Filter F1과 F2가 `web.xml`에 이 순서로 등록되어 있고 Servlet은 `S`를 출력한다. `token` 파라미터 없이 요청했을 때 출력 순서로 알맞은 것은?
```java
// F1.doFilter
System.out.println("F1 in");
chain.doFilter(req, res);
System.out.println("F1 out");

// F2.doFilter
System.out.println("F2 in");
if (req.getParameter("token") == null) {
    ((HttpServletResponse) res).sendError(403);
    return;
}
chain.doFilter(req, res);
System.out.println("F2 out");
```
### choice: a
F1 in → F2 in → F2 out → F1 out
### choice: b
F1 in → F2 in → F1 out
### choice: c
F1 in → F2 in → S → F2 out → F1 out
### choice: d
F1 in → F2 in → S → F1 out

## question: backend-02-q06
```json
{
  "title": "선언과 스크립틀릿의 변수",
  "topics": [
    "jsp-el"
  ],
  "tags": [
    "jsp-translation"
  ],
  "group": "jsp-el",
  "type": "mc",
  "id": "backend-02-q06",
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
다음 JSP를 서버를 시작한 뒤 세 번째로 요청했을 때 화면에 출력되는 내용은? (요청은 한 번에 하나씩 순서대로 들어온다)
```jsp
<%! int total = 0; %>
<% int visit = 0; %>
<%
    total++;
    visit++;
%>
total=<%= total %> visit=<%= visit %>
```
### choice: a
total=1 visit=1
### choice: b
total=3 visit=1
### choice: c
total=3 visit=3
### choice: d
total=1 visit=3

## question: backend-02-q07
```json
{
  "title": "c:set의 기본 scope",
  "topics": [
    "jsp-el"
  ],
  "tags": [
    "scope-lookup",
    "jstl-tags"
  ],
  "group": "jsp-el",
  "type": "mc",
  "id": "backend-02-q07",
  "revision": 1,
  "sourceRefs": [
    "BE-LAB-02 JSP와 forward",
    "BE-LAB-04 EL과 JSTL",
    "backend-concepts Part 4와 Part 5"
  ],
  "difficulty": 3,
  "correctChoiceId": "d"
}
```
### stem
컨트롤러가 request에 `user`를 `A`로 저장하고 아래 JSP로 forward했다. 화면에 출력되는 내용으로 알맞은 것은?
```jsp
<c:set var="user" value="B" />
${user} ${requestScope.user}
```
### choice: a
A B
### choice: b
A A
### choice: c
B B
### choice: d
B A

## question: backend-02-q08
```json
{
  "title": "경로를 지정하지 않은 쿠키",
  "topics": [
    "state-session"
  ],
  "tags": [
    "cookie-remember-id"
  ],
  "group": "state-session",
  "type": "mc",
  "id": "backend-02-q08",
  "revision": 1,
  "sourceRefs": [
    "BE-LAB-03 로그인과 세션",
    "backend-concepts Part 6"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
로그인 Servlet(`/app/auth/login`)이 아래처럼 쿠키를 응답에 추가했다. 쿠키에 경로 속성을 지정하지 않았다. 이후 같은 브라우저가 `/app/index.jsp`를 요청할 때 이 쿠키는 어떻게 되는가?
```java
Cookie c = new Cookie("savedId", id);
c.setMaxAge(60 * 60 * 24 * 7);
res.addCookie(c);
```
### choice: a
경로가 없으면 받은 요청 경로인 `/app/auth` 아래 요청에만 전송된다
### choice: b
같은 컨텍스트 `/app` 아래의 모든 요청에 브라우저가 자동으로 전송한다
### choice: c
`maxAge`를 지정했더라도 응답을 받은 그 요청 안에서만 쿠키가 유효하다
### choice: d
도메인이 같은 요청이라면 경로와 관계없이 이 쿠키가 모두 함께 전송된다

## question: backend-02-q09
```json
{
  "title": "로그인 검사 Filter의 getSession",
  "topics": [
    "state-session"
  ],
  "tags": [
    "session-auth"
  ],
  "group": "state-session",
  "type": "mc",
  "id": "backend-02-q09",
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
로그인하지 않은 사용자가 세션이 없는 채로 보호 경로를 처음 요청했다. 이 Filter에서 `req.getSession()`에 대한 설명으로 알맞은 것은?
```java
HttpSession session = req.getSession();
if (session.getAttribute("loginUser") == null) {
    res.sendRedirect(req.getContextPath() + "/login");
    return;
}
chain.doFilter(request, response);
```
### choice: a
세션이 없으면 `null`을 반환하므로 곧바로 다음 줄에서 NullPointerException이 발생한다
### choice: b
기존 세션만 돌려주고 새 세션은 만들지 않으므로 `JSESSIONID`가 응답에 발급되지 않는다
### choice: c
세션이 없으면 새로 만들고 `JSESSIONID`를 발급하며 확인만 하려면 `getSession(false)`를 쓴다
### choice: d
세션이 없는 요청을 로그인 폼으로 보내는 것이 `getSession()`의 기본 동작이다

## question: backend-02-q10
```json
{
  "title": "NULL이 섞인 문자열 결합",
  "topics": [
    "sql-select"
  ],
  "tags": [
    "order-limit-concat",
    "null-three-valued"
  ],
  "group": "sql-select",
  "type": "mc",
  "id": "backend-02-q10",
  "revision": 1,
  "sourceRefs": [
    "DB-L02 조회와 NULL",
    "DB-L03 집계와 그룹화",
    "db-concepts Part 2와 Part 3"
  ],
  "difficulty": 3,
  "correctChoiceId": "c"
}
```
### stem
`member` 테이블의 `id`가 2인 행에 두 쿼리를 실행했다. 결과로 알맞은 것은? (MySQL 8.4)
```text
member
id | name | nick
1  | 가람 | 별
2  | 나무 | NULL
3  | 다솜 | 달
```
```sql
-- 쿼리 A
SELECT CONCAT(name, '/', nick) FROM member WHERE id = 2;

-- 쿼리 B
SELECT CONCAT_WS('/', name, nick) FROM member WHERE id = 2;
```
### choice: a
A는 나무/이고 B는 나무이다
### choice: b
A는 나무이고 B는 NULL이다
### choice: c
A는 NULL이고 B는 나무이다
### choice: d
A와 B 모두 NULL이다

## question: backend-02-q11
```json
{
  "title": "WHERE에 쓴 집계 함수",
  "topics": [
    "sql-select"
  ],
  "tags": [
    "where-vs-having"
  ],
  "group": "sql-select",
  "type": "mc",
  "id": "backend-02-q11",
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
`emp(id, dept)` 테이블에서 사원이 2명 이상인 부서를 구하려고 다음 쿼리를 실행했더니 오류가 났다. 원인과 해결 방법으로 알맞은 것은?
```sql
SELECT dept, COUNT(*) AS cnt
FROM emp
WHERE COUNT(*) >= 2
GROUP BY dept;
```
### choice: a
`COUNT(*)`는 `GROUP BY` 뒤에 써야 하므로 `SELECT` 절의 위치를 `GROUP BY` 뒤로 바꾼다
### choice: b
`WHERE`는 그룹 전에 실행되어 집계 함수를 쓸 수 없으므로 `HAVING`으로 옮긴다
### choice: c
`dept`는 집계되지 않은 열이므로 `SELECT`에서 빼고 `COUNT`만 남긴다
### choice: d
`WHERE`에서는 `>=` 연산자를 쓸 수 없으므로 `>`로 바꿔서 실행한다

## question: backend-02-q12
```json
{
  "title": "NULL을 찾는 세 가지 조건",
  "topics": [
    "sql-select"
  ],
  "tags": [
    "null-three-valued"
  ],
  "group": "sql-select",
  "type": "mc",
  "id": "backend-02-q12",
  "revision": 1,
  "sourceRefs": [
    "DB-L02 조회와 NULL",
    "DB-L03 집계와 그룹화",
    "db-concepts Part 2와 Part 3"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
`gift` 테이블에서 `memo`가 NULL인 행은 2개다. 세 쿼리가 반환하는 숫자로 알맞은 것은? (MySQL 8.4)
```text
gift
id | memo
1  | 안녕
2  | NULL
3  | 감사
4  | NULL
5  | 축하
```
```sql
-- 쿼리 A
SELECT COUNT(*) FROM gift WHERE memo = NULL;
-- 쿼리 B
SELECT COUNT(*) FROM gift WHERE memo <=> NULL;
-- 쿼리 C
SELECT COUNT(*) FROM gift WHERE memo IS NULL;
```
### choice: a
A는 0이고 B와 C는 2이다
### choice: b
A와 B와 C 모두 2이다
### choice: c
A와 B는 0이고 C는 2이다
### choice: d
A는 2이고 B와 C는 0이다

## question: backend-02-q13
```json
{
  "title": "중복 키가 있는 조인의 행 수",
  "topics": [
    "sql-join-subquery"
  ],
  "tags": [
    "join-types"
  ],
  "group": "sql-join-subquery",
  "type": "mc",
  "id": "backend-02-q13",
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
두 테이블 `a`와 `b`의 `k` 열 값이 아래와 같다. 두 쿼리가 반환하는 행 수로 알맞은 것은?
```text
a.k: 1, 1, 2
b.k: 1, 1, 3
```
```sql
-- 쿼리 A
SELECT COUNT(*) FROM a INNER JOIN b ON a.k = b.k;

-- 쿼리 B
SELECT COUNT(*) FROM a LEFT JOIN b ON a.k = b.k;
```
### choice: a
A는 2이고 B는 3이다
### choice: b
A는 4이고 B는 4이다
### choice: c
A는 4이고 B는 5이다
### choice: d
A는 2이고 B는 4이다

## question: backend-02-q14
```json
{
  "title": "EXCEPT와 INTERSECT의 결과",
  "topics": [
    "sql-join-subquery"
  ],
  "tags": [
    "set-operations"
  ],
  "group": "sql-join-subquery",
  "type": "mc",
  "id": "backend-02-q14",
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
두 테이블에 다음 쿼리를 실행했다. 결과 행 수로 알맞은 것은? (MySQL 8.4)
```text
shop_a: 펜, 펜, 노트, 자
shop_b: 펜, 자, 가위
```
```sql
-- 쿼리 A
SELECT item FROM shop_a EXCEPT SELECT item FROM shop_b;

-- 쿼리 B
SELECT item FROM shop_a INTERSECT SELECT item FROM shop_b;
```
### choice: a
A는 1행이고 B는 2행이다
### choice: b
A는 2행이고 B는 3행이다
### choice: c
A는 1행이고 B는 3행이다
### choice: d
A는 3행이고 B는 2행이다

## question: backend-02-q15
```json
{
  "title": "빈 서브쿼리와 ALL과 ANY",
  "topics": [
    "sql-join-subquery"
  ],
  "tags": [
    "subquery-forms"
  ],
  "group": "sql-join-subquery",
  "type": "mc",
  "id": "backend-02-q15",
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
`prod` 테이블에는 4행이 있고 `cat`이 `X`인 행은 없다. 두 쿼리가 반환하는 숫자로 알맞은 것은? (MySQL 8.4)
```text
prod
id | price | cat
1  | 100   | A
2  | 200   | A
3  | 300   | B
4  | 400   | B
```
```sql
-- 쿼리 A
SELECT COUNT(*) FROM prod
WHERE price > ALL (SELECT price FROM prod WHERE cat = 'X');

-- 쿼리 B
SELECT COUNT(*) FROM prod
WHERE price > ANY (SELECT price FROM prod WHERE cat = 'X');
```
### choice: a
A는 0이고 B는 4이다
### choice: b
A와 B 모두 0이다
### choice: c
A는 4이고 B는 0이다
### choice: d
A와 B 모두 4이다

## question: backend-02-q16
```json
{
  "title": "ON DELETE SET NULL의 결과",
  "topics": [
    "db-schema"
  ],
  "tags": [
    "constraints"
  ],
  "group": "db-schema",
  "type": "mc",
  "id": "backend-02-q16",
  "revision": 1,
  "sourceRefs": [
    "DB-L06 제약조건",
    "DB-L08 모델링과 정규화",
    "db-concepts Part 6과 Part 9"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
`emp.dept_id`는 `dept.id`를 참조하는 외래키이고 `ON DELETE SET NULL`로 정의되어 있다. 아래 상태에서 `DELETE FROM dept WHERE id = 1;`을 실행한 결과로 알맞은 것은?
```text
dept: id = 1, 2
emp:  (id 10, dept_id 1)
      (id 11, dept_id 1)
      (id 12, dept_id 2)
```
### choice: a
emp 3행이 그대로 남고 그중 2행의 `dept_id`가 NULL이 된다
### choice: b
emp에서 `dept_id`가 1인 2행이 함께 삭제되어 1행만 남는다
### choice: c
참조하는 행이 있어 삭제가 거부되고 emp는 바뀌지 않는다
### choice: d
emp 3행이 남고 `dept_id`가 1인 2행은 그대로 유지된다

## question: backend-02-q17
```json
{
  "title": "AUTO_INCREMENT와 DELETE, TRUNCATE",
  "topics": [
    "db-schema"
  ],
  "tags": [
    "delete-truncate-drop"
  ],
  "group": "db-schema",
  "type": "mc",
  "id": "backend-02-q17",
  "revision": 1,
  "sourceRefs": [
    "DB-L06 제약조건",
    "DB-L08 모델링과 정규화",
    "db-concepts Part 6과 Part 9"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
InnoDB 테이블 `note`를 만들고 다음 문장을 차례로 실행했다. (가)와 (나)에서 삽입된 행의 `id`로 알맞은 것은? (MySQL 8.4)
```sql
CREATE TABLE note (id INT AUTO_INCREMENT PRIMARY KEY, v CHAR(1));
INSERT INTO note (v) VALUES ('a'), ('b'), ('c');
DELETE FROM note;
INSERT INTO note (v) VALUES ('d');   -- (가)
TRUNCATE TABLE note;
INSERT INTO note (v) VALUES ('e');   -- (나)
```
### choice: a
(가) 4 (나) 1
### choice: b
(가) 1 (나) 1
### choice: c
(가) 4 (나) 5
### choice: d
(가) 1 (나) 5

## question: backend-02-q18
```json
{
  "title": "저장점이 둘일 때의 롤백",
  "topics": [
    "db-tx-index"
  ],
  "tags": [
    "transaction-savepoint"
  ],
  "group": "db-tx-index",
  "type": "mc",
  "id": "backend-02-q18",
  "revision": 1,
  "sourceRefs": [
    "DB-L07 트랜잭션",
    "DB-D05 격리 수준",
    "DB-D06 인덱스",
    "db-concepts Part 7과 Part 8"
  ],
  "difficulty": 3,
  "correctChoiceId": "d"
}
```
### stem
InnoDB 테이블 `t(n INT)`가 비어 있고 autocommit이 켜져 있다. 아래 문장을 차례로 실행한 뒤 `SELECT n FROM t`의 결과로 알맞은 것은?
```sql
START TRANSACTION;
INSERT INTO t VALUES (1);
SAVEPOINT s1;
INSERT INTO t VALUES (2);
SAVEPOINT s2;
INSERT INTO t VALUES (3);
ROLLBACK TO s1;
INSERT INTO t VALUES (4);
COMMIT;
```
### choice: a
행 1과 행 2와 행 4가 남는다
### choice: b
행 1부터 행 4까지 모두 남는다
### choice: c
행 4만 남고 나머지는 취소된다
### choice: d
행 1과 행 4가 남는다

## question: backend-02-q19
```json
{
  "title": "복합 인덱스의 열 순서",
  "topics": [
    "db-tx-index"
  ],
  "tags": [
    "index-structure"
  ],
  "group": "db-tx-index",
  "type": "mc",
  "id": "backend-02-q19",
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
`member(city, age)`에 복합 인덱스 `(city, age)`가 있다. 이 인덱스의 정렬 순서와 관련한 설명으로 알맞은 것은?
### choice: a
`age`만 조건으로 써도 인덱스의 두 번째 열이므로 항상 범위 탐색이 가능하다
### choice: b
인덱스는 열 순서와 무관하므로 `(age, city)`로 만들어도 접근 경로가 같다
### choice: c
`city` 없이 `age = 30`만 쓰면 연속 구간을 찾지 못해 전체를 훑게 된다
### choice: d
복합 인덱스는 조건에 쓰인 열이 하나라도 있으면 전체 스캔을 피할 수 있다

## question: backend-02-q20
```json
{
  "title": "닫힌 뒤에 ResultSet을 반환할 때",
  "topics": [
    "jdbc"
  ],
  "tags": [
    "resultset-resource"
  ],
  "group": "jdbc",
  "type": "mc",
  "id": "backend-02-q20",
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
다음 DAO 메서드의 결과를 호출한 쪽에서 `rs.next()`로 읽으려 한다. 어떻게 되는가?
```java
public ResultSet findAll() throws SQLException {
    try (Connection con = DBUtil.getConnection();
            PreparedStatement ps = con.prepareStatement("SELECT * FROM book");
            ResultSet rs = ps.executeQuery()) {
        return rs;
    }
}
```
### choice: a
연결이 닫혀도 `ResultSet`은 남아 모든 행을 정상 조회할 수 있다
### choice: b
첫 행만 읽히고 `next()`가 두 번째 호출에서 false를 반환한다
### choice: c
`return` 문이 컴파일되지 않아서 메서드를 정의할 수 없다
### choice: d
블록을 벗어날 때 자원이 닫혀 `rs.next()`에서 SQLException이 발생한다

## question: backend-02-q21
```json
{
  "title": "문자열 결합과 바인딩의 차이",
  "topics": [
    "jdbc"
  ],
  "tags": [
    "prepared-statement"
  ],
  "group": "jdbc",
  "type": "mc",
  "id": "backend-02-q21",
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
`member` 테이블에는 이름이 `가`, `나`, `다`인 3행이 있다. 아래 변수 `name`으로 두 방식의 쿼리를 실행했을 때 각 쿼리가 세는 행 수로 알맞은 것은?
```java
String name = "x' OR '1'='1";

// (가)
String sql = "SELECT COUNT(*) FROM member WHERE name = '" + name + "'";

// (나)
PreparedStatement ps =
        con.prepareStatement("SELECT COUNT(*) FROM member WHERE name = ?");
ps.setString(1, name);
```
### choice: a
(가) 3 (나) 0
### choice: b
(가) 0 (나) 3
### choice: c
(가) 3 (나) 3
### choice: d
(가) 0 (나) 0

## question: backend-02-q22
```json
{
  "title": "쿼리 문자열 읽기",
  "topics": [
    "web-servlet"
  ],
  "tags": [
    "url-mapping"
  ],
  "group": "web-servlet",
  "type": "short",
  "id": "backend-02-q22",
  "revision": 1,
  "sourceRefs": [
    "BE-LAB-01 Servlet 생명주기와 URL 매핑",
    "backend-concepts Part 2"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "page=2&sort=new"
  ],
  "normalization": "trim"
}
```
### stem
요청 주소가 `/app/board/list.do?page=2&sort=new`일 때 `request.getQueryString()`이 반환하는 문자열을 쓰시오.

## question: backend-02-q23
```json
{
  "title": "Servlet에서 오류 상태 보내기",
  "topics": [
    "mvc-filter"
  ],
  "tags": [
    "error-page-mapping"
  ],
  "group": "mvc-filter",
  "type": "short",
  "id": "backend-02-q23",
  "revision": 1,
  "sourceRefs": [
    "BE-LAB-01 Front Controller와 Filter",
    "backend-concepts Part 3"
  ],
  "difficulty": 2,
  "acceptedAnswers": [
    "sendError",
    "sendError()",
    "response.sendError"
  ],
  "normalization": "caseFold"
}
```
### stem
Front Controller가 정의되지 않은 action을 받았을 때 404 같은 오류 상태 코드와 오류 페이지로 응답하려고 `response`에서 호출하는 메서드 이름을 쓰시오.

## question: backend-02-q24
```json
{
  "title": "컬렉션을 반복하는 JSTL 태그",
  "topics": [
    "jsp-el"
  ],
  "tags": [
    "jstl-tags"
  ],
  "group": "jsp-el",
  "type": "short",
  "id": "backend-02-q24",
  "revision": 1,
  "sourceRefs": [
    "BE-LAB-02 JSP와 forward",
    "BE-LAB-04 EL과 JSTL",
    "backend-concepts Part 4와 Part 5"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "c:forEach",
    "<c:forEach>",
    "forEach"
  ],
  "normalization": "caseFold"
}
```
### stem
컬렉션의 원소를 하나씩 꺼내 반복하는 JSTL core 태그를 접두사 `c`를 포함해 쓰시오.

## question: backend-02-q25
```json
{
  "title": "무효화된 세션의 접근",
  "topics": [
    "state-session"
  ],
  "tags": [
    "session-lifetime"
  ],
  "group": "state-session",
  "type": "short",
  "id": "backend-02-q25",
  "revision": 1,
  "sourceRefs": [
    "BE-LAB-03 로그인과 세션",
    "backend-concepts Part 6"
  ],
  "difficulty": 2,
  "acceptedAnswers": [
    "IllegalStateException",
    "java.lang.IllegalStateException"
  ],
  "normalization": "caseFold"
}
```
### stem
`session.invalidate()`로 무효화된 세션 객체에서 `getAttribute()`를 호출하면 던져지는 예외의 이름을 패키지 이름 없이 쓰시오.

## question: backend-02-q26
```json
{
  "title": "모두 NULL인 열의 합계",
  "topics": [
    "sql-select"
  ],
  "tags": [
    "null-three-valued"
  ],
  "group": "sql-select",
  "type": "short",
  "id": "backend-02-q26",
  "revision": 1,
  "sourceRefs": [
    "DB-L02 조회와 NULL",
    "DB-L03 집계와 그룹화",
    "db-concepts Part 2와 Part 3"
  ],
  "difficulty": 2,
  "acceptedAnswers": [
    "NULL"
  ],
  "normalization": "caseFold"
}
```
### stem
아래 쿼리가 반환하는 값을 쓰시오. 값이 아니라 NULL이면 NULL이라고 쓰시오.
```text
score_log
id | score
1  | NULL
2  | NULL
```
```sql
SELECT SUM(score) FROM score_log;
```

## question: backend-02-q27
```json
{
  "title": "있는 뷰를 바꿔 다시 만들기",
  "topics": [
    "sql-join-subquery"
  ],
  "tags": [
    "view-dml"
  ],
  "group": "sql-join-subquery",
  "type": "short",
  "id": "backend-02-q27",
  "revision": 1,
  "sourceRefs": [
    "DB-L04 조인과 집합 연산",
    "DB-L05 서브쿼리",
    "db-concepts Part 4와 Part 5"
  ],
  "difficulty": 2,
  "acceptedAnswers": [
    "OR REPLACE"
  ],
  "normalization": "caseFold"
}
```
### stem
이미 있는 뷰 `v_sales`의 정의를 지우지 않고 바꿔서 다시 만들려고 `CREATE`와 `VIEW` 사이에 쓰는 키워드 두 단어를 영문으로 쓰시오.

## question: backend-02-q28
```json
{
  "title": "속성이 다른 속성을 결정하는 관계",
  "topics": [
    "db-schema"
  ],
  "tags": [
    "normalization"
  ],
  "group": "db-schema",
  "type": "short",
  "id": "backend-02-q28",
  "revision": 1,
  "sourceRefs": [
    "DB-L06 제약조건",
    "DB-L08 모델링과 정규화",
    "db-concepts Part 6과 Part 9"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "함수 종속",
    "함수적 종속",
    "함수종속",
    "functional dependency"
  ],
  "normalization": "caseFold"
}
```
### stem
속성 A의 값이 정해지면 속성 B의 값이 하나로 정해지는 관계를 무엇이라 하는지 쓰시오.

## question: backend-02-q29
```json
{
  "title": "같은 행을 두 번 읽어 값이 달라지는 현상",
  "topics": [
    "db-tx-index"
  ],
  "tags": [
    "isolation-level"
  ],
  "group": "db-tx-index",
  "type": "short",
  "id": "backend-02-q29",
  "revision": 1,
  "sourceRefs": [
    "DB-L07 트랜잭션",
    "DB-D05 격리 수준",
    "DB-D06 인덱스",
    "db-concepts Part 7과 Part 8"
  ],
  "difficulty": 2,
  "acceptedAnswers": [
    "반복 불가능한 읽기",
    "반복 불가능 읽기",
    "non-repeatable read",
    "nonrepeatable read",
    "unrepeatable read"
  ],
  "normalization": "caseFold"
}
```
### stem
한 트랜잭션 안에서 같은 행을 두 번 읽었는데 그 사이 다른 트랜잭션이 값을 바꾸고 커밋해 두 번째 읽은 값이 달라지는 현상을 무엇이라 하는지 쓰시오.

## question: backend-02-q30
```json
{
  "title": "영향받은 행 수를 돌려주는 메서드",
  "topics": [
    "jdbc"
  ],
  "tags": [
    "prepared-statement"
  ],
  "group": "jdbc",
  "type": "short",
  "id": "backend-02-q30",
  "revision": 1,
  "sourceRefs": [
    "DB-L09 JDBC",
    "BE-LAB-10 DAO와 MVC",
    "db-concepts Part 10"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "executeUpdate",
    "executeUpdate()"
  ],
  "normalization": "caseFold"
}
```
### stem
`PreparedStatement`로 INSERT를 실행하고 영향받은 행 수를 `int`로 돌려받는 메서드 이름을 쓰시오.

## question: backend-02-q31
```json
{
  "title": "등록 뒤 이동에 redirect를 쓰는 이유",
  "topics": [
    "jsp-el"
  ],
  "tags": [
    "forward-redirect-prg"
  ],
  "group": "jsp-el",
  "type": "essay",
  "id": "backend-02-q31",
  "revision": 1,
  "sourceRefs": [
    "BE-LAB-02 JSP와 forward",
    "BE-LAB-04 EL과 JSTL",
    "backend-concepts Part 4와 Part 5"
  ],
  "difficulty": 3,
  "rubric": [
    {
      "id": "r0",
      "criterion": "forward는 요청이 1번이고 redirect는 브라우저가 새 요청을 보내 2번이라고 설명한다",
      "points": 1
    },
    {
      "id": "r1",
      "criterion": "forward는 주소창이 처리 주소로 남고 redirect는 이동한 주소로 바뀐다고 설명한다",
      "points": 1
    },
    {
      "id": "r2",
      "criterion": "forward는 request 속성이 공유되고 redirect는 새 request라서 공유되지 않는다고 설명한다",
      "points": 1
    },
    {
      "id": "r3",
      "criterion": "forward 뒤에 새로고침하면 마지막 POST가 다시 전송되어 등록이 중복되고 redirect는 목록 조회만 다시 실행된다고 설명한다",
      "points": 1
    }
  ],
  "modelAnswer": "forward는 서버 안에서 다른 자원으로 이동하므로 브라우저가 보낸 요청은 1번이고 주소창에는 처음의 등록 주소가 남으며 request 속성도 그대로 공유된다. redirect는 서버가 이동할 주소를 응답으로 알려 주고 브라우저가 새 요청을 보내 2번의 요청이 되며 주소창이 목록 주소로 바뀌고 새 request가 만들어져 속성이 공유되지 않는다. 등록 뒤 forward로 화면을 보여 주면 주소창에 POST 주소가 남아 새로고침이 마지막 POST를 다시 보내 같은 글이 또 등록된다. redirect를 쓰면 마지막 요청이 목록 조회 GET이어서 새로고침해도 목록만 다시 불러온다."
}
```
### stem
게시글을 등록하는 POST 요청을 처리한 뒤 목록 화면으로 이동할 때 `forward`가 아니라 `redirect`를 쓰는 이유를 서술하시오. 요청 횟수와 주소창과 request 속성 공유의 세 관점에서 forward와 비교하고 새로고침했을 때 일어나는 일과 연결하시오.

## question: backend-02-q32
```json
{
  "title": "동시에 재고를 차감할 때의 트랜잭션",
  "topics": [
    "db-tx-index"
  ],
  "tags": [
    "isolation-level"
  ],
  "group": "db-tx-index",
  "type": "essay",
  "id": "backend-02-q32",
  "revision": 1,
  "sourceRefs": [
    "DB-L07 트랜잭션",
    "DB-D05 격리 수준",
    "DB-D06 인덱스",
    "db-concepts Part 7과 Part 8"
  ],
  "difficulty": 3,
  "rubric": [
    {
      "id": "r0",
      "criterion": "재고를 읽은 뒤 계산한 값을 저장하면 두 사용자가 같은 값을 읽어 한쪽 차감이 덮어써지는 갱신 손실이 생긴다고 설명한다",
      "points": 1
    },
    {
      "id": "r1",
      "criterion": "재고 확인과 차감과 주문 기록을 하나의 트랜잭션으로 묶어 모두 성공하거나 모두 취소되게 한다고 설명한다",
      "points": 1
    },
    {
      "id": "r2",
      "criterion": "`SELECT ... FOR UPDATE`로 행을 잠가 다른 트랜잭션이 기다리게 하거나 `UPDATE ... SET stock = stock - 1`처럼 한 문장으로 차감한다고 설명한다",
      "points": 1
    },
    {
      "id": "r3",
      "criterion": "성공하면 `COMMIT` 오류가 나면 `ROLLBACK`으로 마무리하고 잠금이 오래 유지되지 않게 트랜잭션을 짧게 둔다고 설명한다",
      "points": 1
    }
  ],
  "modelAnswer": "두 사용자가 모두 재고 10을 읽고 각자 9로 계산해 저장하면 한 차감이 덮어써져 재고가 8이 아니라 9가 되는 갱신 손실이 생긴다. 이를 막으려면 재고 확인과 차감과 주문 기록을 하나의 트랜잭션으로 묶어 전부 성공하거나 전부 취소되게 한다. 행을 읽을 때 `SELECT ... FOR UPDATE`로 잠그면 다른 트랜잭션은 커밋될 때까지 기다린 뒤 최신 재고를 읽고 차감하며 `UPDATE ... SET stock = stock - 1`처럼 한 문장으로 차감해도 같은 효과가 있다. 모든 작업이 성공하면 `COMMIT`으로 확정하고 오류가 나면 `ROLLBACK`으로 되돌리며 잠금이 오래 걸리지 않도록 트랜잭션은 짧게 유지한다."
}
```
### stem
재고가 10개인 상품을 두 사용자가 동시에 하나씩 주문해 재고를 차감한다. (1) 동시 갱신이 보호되지 않을 때 생길 수 있는 문제 (2) 트랜잭션과 잠금을 이용해 이 문제를 막는 방법 (3) 오류가 났을 때 트랜잭션을 마무리하는 방법을 서술하시오.
