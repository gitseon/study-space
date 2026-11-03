## question: backend-02-q01
### solution
정답 근거: `loadOnStartup`이 0 이상이면 서버 시작 때 작은 값부터 초기화하고 지정하지 않은 Servlet은 첫 요청 때 초기화한다. 풀이: 시작할 때 값이 1인 B가 먼저 3인 A가 다음 순서로 `init()`이 실행된다. C는 지정이 없어 `/c` 요청이 처음 왔을 때 초기화된다. 흔한 실수: 선언한 순서나 클래스 이름 순서로 초기화된다고 보는 것이다.
### choice-explanation: a
선언 순서나 이름 순서가 기준이 아니다. 기준은 `loadOnStartup`의 값이다.
### choice-explanation: b
값이 작은 B와 A가 시작 때 순서대로 초기화되고 C는 첫 요청 때 초기화된다.
### choice-explanation: c
지정이 없는 C가 가장 먼저 초기화되는 것이 아니다. C는 첫 요청 때까지 기다린다.
### choice-explanation: d
C는 시작 때 초기화되지 않으므로 A와 B 사이에 끼어들 수 없다.

## question: backend-02-q02
### solution
정답 근거: `getServletPath()`는 컨텍스트 경로를 뺀 요청 경로 중 Servlet 매핑에 맞은 부분이다. 풀이: 확장자 패턴 `*.do`는 경로 전체가 매핑에 맞으므로 `/board/list.do`가 되고 `getContextPath()`는 `/app`이다. `getRequestURI()`는 `/app/board/list.do`이고 쿼리 문자열 `page=2`는 별도의 `getQueryString()`이 돌려준다. 흔한 실수: 컨텍스트 경로나 쿼리 문자열을 함께 읽는 것이다.
### choice-explanation: a
컨텍스트 경로까지 포함한 값은 `getRequestURI()`가 돌려준다.
### choice-explanation: b
확장자 `.do`가 빠진 경로는 어떤 메서드의 값과도 일치하지 않는다.
### choice-explanation: c
컨텍스트 경로 `/app`을 뺀 나머지가 확장자 매핑에 맞아 `/board/list.do` 전체가 된다.
### choice-explanation: d
쿼리 문자열은 경로에 포함되지 않으며 `getQueryString()`으로 따로 읽는다.

## question: backend-02-q03
### solution
정답 근거: `getWriter()`를 호출한 뒤의 `setCharacterEncoding()`은 효과가 없다. 풀이: Writer는 만들어질 때의 문자 인코딩으로 글자를 바이트로 바꾼다. 따라서 `setCharacterEncoding("UTF-8")`이나 `setContentType`의 charset은 `getWriter()`보다 먼저 호출해야 한다. 흔한 실수: Writer를 얻은 뒤에 지정해도 바뀐다고 보는 것이다.
### choice-explanation: a
응답에도 `setCharacterEncoding()`을 쓸 수 있다. 문제는 호출하는 순서다.
### choice-explanation: b
`PrintWriter`는 설정된 문자 인코딩으로 글자를 바이트로 바꾼다.
### choice-explanation: c
응답을 보낸 뒤에는 헤더를 바꿀 수 없다. 지정은 본문을 쓰기 전에 해야 한다.
### choice-explanation: d
Writer가 만들어진 뒤에는 인코딩이 고정되므로 지정을 `getWriter()` 앞으로 옮겨야 한다.

## question: backend-02-q04
### solution
정답 근거: `hits++`는 읽기와 더하기와 쓰기로 이루어져 두 스레드가 겹치면 한쪽 증가가 덮어써진다. 풀이: Servlet 객체와 `hits` 필드는 모든 요청이 공유하므로 두 요청이 각각 1000번씩 총 2000번 증가시키는 중에 일부가 사라질 수 있다. 최종 값은 2000을 넘지 않으며 2000이 보장되지도 않는다. 해결은 지역 변수 사용이나 동기화다. 흔한 실수: 필드 증가가 한 번에 끝나는 동작이라고 보는 것이다.
### choice-explanation: a
읽기와 쓰기가 분리된 증가 연산이라 겹침이 생기면 일부 증가가 사라진다.
### choice-explanation: b
동시 실행에서는 증가가 겹칠 수 있어 최종 값이 정확히 2000이라는 보장이 없다.
### choice-explanation: c
필드는 요청이 아니라 객체에 속한다. 두 요청이 같은 `hits`를 쓴다.
### choice-explanation: d
증가는 총 2000번뿐이다. 겹침으로 일부가 사라질 수는 있어도 늘어나지는 않는다.

## question: backend-02-q05
### solution
정답 근거: `chain.doFilter()`를 부르지 않으면 다음 Filter와 Servlet이 실행되지 않고 호출은 거꾸로 돌아온다. 풀이: F1이 `F1 in`을 출력하고 F2를 호출한다. F2는 `token`이 없어 `sendError(403)` 뒤 `return`하므로 `F2 out`과 `S`가 없다. 제어가 F1로 돌아와 `F1 out`이 출력된다. 흔한 실수: `return`한 뒤에도 뒤의 출력이 실행되거나 Servlet이 실행된다고 보는 것이다.
### choice-explanation: a
`return` 뒤의 `F2 out`은 실행되지 않는다. 반환이 그 줄 앞에서 일어난다.
### choice-explanation: b
F2가 중간에서 반환하므로 F2의 뒤쪽 출력과 Servlet 없이 F1로 돌아와 끝난다.
### choice-explanation: c
`chain.doFilter()`가 호출되지 않았으므로 Servlet의 `S`는 출력되지 않는다.
### choice-explanation: d
Servlet이 실행되지 않으므로 `S`는 없다. F2는 반환했으므로 `F2 out`도 빠진다.

## question: backend-02-q06
### solution
정답 근거: 선언 `<%! %>`은 Servlet 클래스의 필드가 되고 스크립틀릿 `<% %>`은 요청마다 실행되는 메서드의 지역 변수가 된다. 풀이: JSP는 번역된 Servlet 객체 하나가 요청을 처리하므로 필드 `total`은 요청마다 1씩 쌓여 세 번째에 3이다. 지역 변수 `visit`은 요청마다 0에서 시작해 1이 된다. 흔한 실수: 두 변수가 같은 방식으로 값이 유지된다고 보는 것이다.
### choice-explanation: a
`total`은 필드라서 요청 사이에 값이 이어져 1로 되돌아가지 않는다.
### choice-explanation: b
선언의 `total`은 필드라 누적되고 스크립틀릿의 `visit`은 요청마다 새로 시작한다.
### choice-explanation: c
`visit`은 지역 변수라서 요청마다 0에서 시작해 누적되지 않는다.
### choice-explanation: d
누적되는 쪽은 선언한 변수이고 지역 변수는 누적되지 않아 값이 반대다.

## question: backend-02-q07
### solution
정답 근거: `c:set`의 `scope`를 쓰지 않으면 page scope에 저장되고 범위 없는 EL은 page부터 찾는다. 풀이: `c:set`이 page scope에 `user`를 `B`로 저장한다. `${user}`는 page scope의 `B`를 먼저 찾고 `${requestScope.user}`는 request scope의 `A`를 읽는다. 흔한 실수: `c:set`이 request의 값을 바꾼다고 보는 것이다.
### choice-explanation: a
범위 없는 EL은 page를 먼저 찾으므로 첫 값은 `A`가 아니라 `B`이다.
### choice-explanation: b
`${user}`가 request의 값을 읽는다고 본 결과다. page에 `B`가 저장되어 첫 값은 `B`이다.
### choice-explanation: c
`requestScope.user`는 `c:set`이 건드리지 않은 request의 `A`를 읽는다.
### choice-explanation: d
`${user}`는 page의 B이고 `requestScope.user`는 request의 A이다.

## question: backend-02-q08
### solution
정답 근거: 쿠키에 `Path`가 없으면 브라우저는 쿠키를 받은 요청 경로의 디렉터리를 기본 경로로 쓴다. 풀이: `/app/auth/login`에서 받은 쿠키의 기본 경로는 `/app/auth`라서 `/app/index.jsp` 요청에는 붙지 않는다. 컨텍스트 전체에서 쓰려면 `setPath("/app")`나 `setPath("/")`로 경로를 지정한다. 흔한 실수: 쿠키가 도메인 안의 모든 요청에 전송된다고 보는 것이다.
### choice-explanation: a
경로가 없으면 받은 요청 경로의 디렉터리로 제한되어 `/app/index.jsp`에는 붙지 않는다.
### choice-explanation: b
컨텍스트 전체에서 쓰려면 `setPath`로 경로를 지정해야 한다. 자동으로 `/app`이 되지 않는다.
### choice-explanation: c
`maxAge`는 쿠키가 보관되는 기간이며 같은 요청 안으로 제한하지 않는다.
### choice-explanation: d
쿠키는 도메인과 함께 경로로도 전송 범위가 정해진다.

## question: backend-02-q09
### solution
정답 근거: 인자 없는 `getSession()`은 현재 세션이 없으면 새로 만든다. 풀이: 비로그인 요청에서도 세션이 만들어져 응답에 `JSESSIONID`가 실린다. 로그인 여부만 볼 때는 `getSession(false)`로 세션이 없으면 `null`을 받아 로그인 폼으로 보낸다. 흔한 실수: `getSession()`이 세션이 없을 때 `null`을 준다고 보는 것이다.
### choice-explanation: a
`null`을 돌려주는 것은 `getSession(false)`이다. 인자 없는 호출은 세션을 만든다.
### choice-explanation: b
인자 없는 호출은 새 세션을 만들며 그 응답에 `JSESSIONID`가 실린다.
### choice-explanation: c
`getSession()`은 세션이 없으면 만들어 돌려주므로 비로그인 요청에도 세션이 생긴다.
### choice-explanation: d
`getSession()`은 리다이렉트를 하지 않는다. 이동은 코드가 직접 지시한다.

## question: backend-02-q10
### solution
정답 근거: `CONCAT`은 인자 중 하나라도 NULL이면 NULL을 반환하고 `CONCAT_WS`는 NULL 인자를 건너뛴다. 풀이: 쿼리 A는 `nick`이 NULL이라 전체가 NULL이다. 쿼리 B는 NULL인 `nick`을 빼고 남은 값 `나무`만 구분자 없이 돌려준다. 흔한 실수: NULL을 빈 문자열처럼 다루어 `나무/`가 된다고 보는 것이다.
### choice-explanation: a
NULL은 빈 문자열이 아니다. `CONCAT`의 결과에 구분자만 남지 않는다.
### choice-explanation: b
두 함수의 NULL 처리가 반대로 설명되어 있다.
### choice-explanation: c
`CONCAT`은 NULL이 하나만 있어도 NULL이고 `CONCAT_WS`는 NULL을 건너뛰어 나무만 남는다.
### choice-explanation: d
`CONCAT_WS`는 NULL 인자를 건너뛰므로 쿼리 B가 NULL이 되지 않는다.

## question: backend-02-q11
### solution
정답 근거: 집계 결과를 조건으로 거르려면 그룹이 만들어진 뒤에 실행되는 `HAVING`을 쓴다. 풀이: `WHERE`는 행을 묶기 전에 개별 행을 거르므로 `COUNT(*)` 같은 집계 함수를 쓰면 오류가 난다. `GROUP BY dept HAVING COUNT(*) >= 2`로 고친다. 흔한 실수: `WHERE`와 `HAVING`이 실행되는 시점을 구분하지 못하는 것이다.
### choice-explanation: a
절의 작성 순서는 `GROUP BY`가 `SELECT` 뒤에 오는 형태가 맞다. 오류의 원인이 아니다.
### choice-explanation: b
`WHERE`는 그룹 전에 `HAVING`은 그룹 뒤에 실행되므로 집계 조건은 `HAVING`에 쓴다.
### choice-explanation: c
`GROUP BY dept`가 있으므로 `dept`를 `SELECT`에 쓸 수 있다.
### choice-explanation: d
`>=`는 `WHERE`에서 쓸 수 있는 연산자다. 오류의 원인은 집계 함수다.

## question: backend-02-q12
### solution
정답 근거: `= NULL`은 항상 UNKNOWN이라 행을 선택하지 못하고 `IS NULL`과 MySQL의 NULL 안전 비교 `<=>`는 NULL을 찾는다. 풀이: 쿼리 A는 모든 행이 UNKNOWN이어서 0이다. 쿼리 B의 `<=>`는 양쪽이 모두 NULL이면 참이므로 2이고 쿼리 C의 `IS NULL`도 2이다. 흔한 실수: `= NULL`로 NULL 행을 찾을 수 있다고 보는 것이다.
### choice-explanation: a
`= NULL`은 UNKNOWN이라 0행이고 `<=>`와 `IS NULL`은 NULL 행 2개를 찾는다.
### choice-explanation: b
`= NULL`로는 NULL 행을 찾을 수 없다. 쿼리 A가 2가 될 수 없다.
### choice-explanation: c
`<=>`는 NULL끼리 같다고 보므로 쿼리 B는 0이 아니라 2이다.
### choice-explanation: d
`IS NULL`이 NULL 행을 찾으므로 쿼리 C는 0이 아니다.

## question: backend-02-q13
### solution
정답 근거: 조인은 조건이 맞는 행의 모든 조합을 만든다. 풀이: `a`의 1 두 행과 `b`의 1 두 행이 만나 2 × 2 = 4행이 되어 쿼리 A는 4이다. 쿼리 B는 여기에 짝이 없는 `a`의 2가 NULL과 함께 남아 5이다. 흔한 실수: 같은 키 값을 하나로 합쳐 짝지은 행 수를 세는 것이다.
### choice-explanation: a
중복 키는 합쳐지지 않고 모든 조합이 만들어진다. 조합 수는 2가 아니라 4이다.
### choice-explanation: b
LEFT JOIN은 짝이 없는 왼쪽 행을 NULL과 함께 남기므로 쿼리 B가 4에서 그치지 않는다.
### choice-explanation: c
같은 키 2행과 2행이 4가지 조합을 만들고 LEFT JOIN은 짝 없는 2를 하나 더한다.
### choice-explanation: d
INNER JOIN의 결과가 2행이 될 수 없다. 4개의 조합이 모두 나온다.

## question: backend-02-q14
### solution
정답 근거: 기본 `EXCEPT`와 `INTERSECT`는 중복을 제거한 집합으로 계산한다. 풀이: 쿼리 A는 `shop_a`에만 있는 값이라 `노트` 1행이다. 쿼리 B는 두 테이블에 모두 있는 `펜`과 `자`가 중복 없이 2행이다. 흔한 실수: 중복을 유지하는 `ALL` 방식으로 세는 것이다.
### choice-explanation: a
EXCEPT는 노트 하나이고 INTERSECT는 중복 없이 펜과 자로 2행이다.
### choice-explanation: b
기본 동작은 중복 제거라서 펜이 두 번 나오지 않는다. 쿼리 B는 3행이 아니다.
### choice-explanation: c
INTERSECT 결과에 펜이 두 번 들어가지 않는다. 쿼리 B는 2행이다.
### choice-explanation: d
EXCEPT의 결과는 `shop_b`에 없는 값뿐이다. 3행이 나올 수 없다.

## question: backend-02-q15
### solution
정답 근거: 서브쿼리가 비어 있으면 `ALL` 비교는 참이고 `ANY` 비교는 거짓이다. 풀이: `ALL`은 모든 값보다 크다는 조건이라 비교할 값이 없으면 어긋나는 값도 없어 참이다. 쿼리 A는 4행 모두 통과해 4이다. `ANY`는 하나라도 작은 값이 있어야 하므로 값이 없으면 거짓이라 쿼리 B는 0이다. 흔한 실수: 빈 서브쿼리를 만나면 두 비교가 모두 거짓이라고 보는 것이다.
### choice-explanation: a
ALL과 ANY의 결과가 뒤바뀌었다. 빈 집합에서 ALL은 참이다.
### choice-explanation: b
ALL은 빈 서브쿼리에서 참이므로 쿼리 A가 0이 될 수 없다.
### choice-explanation: c
비교 대상이 없으면 ALL은 참이고 ANY는 거짓이다.
### choice-explanation: d
ANY는 빈 서브쿼리에서 거짓이므로 쿼리 B가 4가 될 수 없다.

## question: backend-02-q16
### solution
정답 근거: `ON DELETE SET NULL`은 부모 행이 삭제되면 참조하던 자식의 외래키 열을 NULL로 바꾼다. 풀이: `dept`의 id 1이 삭제되면 `emp`의 10번과 11번 행이 남은 채 `dept_id`만 NULL이 된다. 12번 행은 id 2를 참조하므로 그대로다. 행이 함께 지워지는 규칙은 `ON DELETE CASCADE`이고 기본 규칙은 삭제 거부다. 흔한 실수: `SET NULL`을 `CASCADE`와 혼동하는 것이다.
### choice-explanation: a
자식 행은 지우지 않고 외래키 열만 NULL로 바꾸는 규칙이다.
### choice-explanation: b
자식 행까지 함께 삭제하는 규칙은 `CASCADE`이다. `SET NULL`은 행을 지우지 않는다.
### choice-explanation: c
삭제를 거부하는 것은 기본 규칙이다. 지정한 규칙은 삭제를 허용한다.
### choice-explanation: d
부모가 사라졌는데 자식이 존재하지 않는 id 1을 계속 가리킬 수는 없다.

## question: backend-02-q17
### solution
정답 근거: `DELETE`는 행만 지우고 `AUTO_INCREMENT` 카운터를 되돌리지 않지만 `TRUNCATE`는 테이블을 비우면서 카운터도 처음으로 되돌린다. 풀이: 세 행을 넣어 카운터가 4가 되고 `DELETE` 뒤에도 유지되므로 (가)는 4이다. `TRUNCATE`가 카운터를 초기화하므로 (나)는 1이다. 흔한 실수: `DELETE`로 전체를 지우면 번호가 1부터 다시 시작한다고 보는 것이다.
### choice-explanation: a
`DELETE`는 카운터를 유지해 4이고 `TRUNCATE`는 카운터를 초기화해 1이다.
### choice-explanation: b
`DELETE`는 카운터를 되돌리지 않으므로 (가)는 1이 아니라 4이다.
### choice-explanation: c
`TRUNCATE`는 카운터를 초기화하므로 (나)는 5가 아니라 1이다.
### choice-explanation: d
두 문장의 카운터 처리가 모두 반대로 설명되어 있다.

## question: backend-02-q18
### solution
정답 근거: `ROLLBACK TO` 저장점은 그 저장점 이후의 변경만 취소하고 트랜잭션은 계속된다. 풀이: `s1`은 행 1을 넣은 뒤 만들었으므로 행 2와 행 3이 모두 취소된다. 이어서 행 4가 삽입되고 `COMMIT`으로 행 1과 행 4가 확정된다. 흔한 실수: 가장 최근의 저장점까지만 되돌린다고 보거나 트랜잭션 전체가 취소된다고 보는 것이다.
### choice-explanation: a
`s1`로 되돌리면 `s2`가 가리키는 지점까지가 아니라 `s1` 이후가 모두 취소되어 행 2도 사라진다.
### choice-explanation: b
`ROLLBACK TO s1`이 실행되었으므로 행 2와 행 3은 남지 않는다.
### choice-explanation: c
`ROLLBACK TO`는 트랜잭션 전체를 취소하지 않는다. 행 1은 남는다.
### choice-explanation: d
`s1` 뒤의 행 2와 행 3이 취소되고 행 1과 새로 삽입한 행 4가 남는다.

## question: backend-02-q19
### solution
정답 근거: 복합 인덱스는 첫 열로 정렬한 뒤 같은 값 안에서 둘째 열로 정렬한다. 풀이: `city = '서울' AND age >= 30`은 `서울` 구간 안에서 `age`가 정렬되어 있어 연속 구간을 찾을 수 있다. `age = 30`만 있으면 30인 항목이 `city`별로 흩어져 있어 한 구간으로 모이지 않는다. 흔한 실수: 인덱스의 열 순서가 접근 경로와 무관하다고 보는 것이다.
### choice-explanation: a
둘째 열의 값은 첫 열이 다른 구간마다 흩어져 있어 `age`만으로는 한 구간을 찾을 수 없다.
### choice-explanation: b
열 순서가 바뀌면 정렬 기준이 달라져 `age` 단독 조건에 맞는 접근 경로도 달라진다.
### choice-explanation: c
첫 열 `city`의 값이 정해져야 둘째 열 `age`가 연속 구간으로 정렬되어 있다.
### choice-explanation: d
조건에 쓰인 열이 인덱스의 앞 열이 아니면 전체를 훑는 접근이 될 수 있다.

## question: backend-02-q20
### solution
정답 근거: try-with-resources는 블록을 빠져나올 때 자원을 닫고 닫힌 `ResultSet`은 읽을 수 없다. 풀이: `return rs`가 실행되어도 블록이 끝나면서 `ResultSet`과 `PreparedStatement`와 `Connection`이 닫힌다. 호출한 쪽의 `rs.next()`는 닫힌 `ResultSet`에 대한 호출이라 SQLException이 발생한다. DAO 안에서 행을 DTO 목록으로 옮겨 반환한다. 흔한 실수: `ResultSet`을 반환하면 연결이 닫힌 뒤에도 읽을 수 있다고 보는 것이다.
### choice-explanation: a
연결과 함께 닫힌 `ResultSet`은 읽을 수 없다. 남아 있지 않다.
### choice-explanation: b
닫힌 `ResultSet`은 한 행도 읽을 수 없다. 첫 행이 읽히는 일은 없다.
### choice-explanation: c
`return rs`는 문법상 문제가 없다. 오류는 컴파일이 아니라 실행 때 발생한다.
### choice-explanation: d
블록을 벗어날 때 자원이 닫혀 호출한 쪽에서 읽으면 예외가 발생한다. DTO 목록으로 옮겨 반환한다.

## question: backend-02-q21
### solution
정답 근거: 문자열로 이어 붙인 SQL은 입력이 SQL 문법으로 해석되고 바인딩한 값은 값으로만 쓰인다. 풀이: (가)는 조건이 `name = 'x' OR '1'='1'`이 되어 모든 행에서 참이므로 3이다. (나)는 `x' OR '1'='1` 전체가 하나의 이름 값으로 비교되어 같은 이름이 없으므로 0이다. 흔한 실수: 따옴표가 있어도 두 방식이 같은 조건이 된다고 보는 것이다.
### choice-explanation: a
이어 붙인 쿼리는 조건이 바뀌어 전체 행을 세고 바인딩한 쿼리는 값 비교라 0이다.
### choice-explanation: b
두 방식의 결과가 뒤바뀌었다. 바인딩한 쪽이 입력을 SQL로 해석하지 않는다.
### choice-explanation: c
바인딩한 값은 SQL 문법으로 해석되지 않는다. (나)가 3이 될 수 없다.
### choice-explanation: d
이어 붙인 쪽은 `OR '1'='1'`이 항상 참이라 0이 될 수 없다.

## question: backend-02-q22
### solution
정답: page=2&sort=new. 근거: `getQueryString()`은 요청 주소에서 물음표 뒤의 문자열을 해석하지 않고 그대로 돌려준다. 경로 부분은 `getRequestURI()`가 돌려준다. 개별 값은 `getParameter("page")`로 읽는다.

## question: backend-02-q23
### solution
정답: sendError. 허용 표기: 괄호가 붙은 `sendError()`와 `response.sendError`도 정답이며 대소문자는 구분하지 않는다. 근거: `response.sendError(404)`는 상태 코드를 보내고 `web.xml`의 `error-page`가 있으면 그 페이지를 보여 준다. `sendRedirect`는 이동 주소를 알려 주는 메서드로 목적이 다르다.

## question: backend-02-q24
### solution
정답: c:forEach. 허용 표기: 꺾쇠가 붙은 `<c:forEach>`와 접두사를 뺀 `forEach`도 정답이며 대소문자는 구분하지 않는다. 근거: `c:forEach`는 `items`로 컬렉션을 받아 `var`에 원소를 하나씩 담는다. 조건 분기는 `c:if`와 `c:choose`가 맡는다.

## question: backend-02-q25
### solution
정답: IllegalStateException. 허용 표기: 패키지를 붙인 `java.lang.IllegalStateException`도 정답이며 대소문자는 구분하지 않는다. 근거: 무효화된 세션의 메서드는 대부분 `IllegalStateException`을 던진다. 새 세션이 필요하면 `request.getSession()`을 다시 호출한다.

## question: backend-02-q26
### solution
정답: NULL. 허용 표기: 대소문자는 구분하지 않는다. 근거: 집계 함수는 NULL을 무시하고 계산하는데 계산할 값이 하나도 없으면 `SUM`은 0이 아니라 NULL을 반환한다. 0으로 바꾸려면 `COALESCE(SUM(score), 0)`을 쓴다.

## question: backend-02-q27
### solution
정답: OR REPLACE. 허용 표기: 대소문자는 구분하지 않는다. 근거: `CREATE OR REPLACE VIEW`는 뷰가 없으면 새로 만들고 있으면 정의를 바꾼다. `DROP VIEW` 뒤에 다시 만드는 방법과 달리 뷰에 준 권한이 유지된다.

## question: backend-02-q28
### solution
정답: 함수 종속. 허용 표기: `함수적 종속`, 띄어쓰기 없는 `함수종속`, 영문 `functional dependency`도 정답이며 대소문자는 구분하지 않는다. 근거: A가 B를 결정할 때 B가 A에 함수 종속이라고 하고 정규화는 부분 종속과 이행 종속 같은 불필요한 함수 종속을 분리하는 과정이다.

## question: backend-02-q29
### solution
정답: 반복 불가능한 읽기. 허용 표기: `반복 불가능 읽기`와 영문 `non-repeatable read`, `nonrepeatable read`, `unrepeatable read`도 정답이며 대소문자는 구분하지 않는다. 근거: 같은 조회가 다른 값을 돌려주는 현상이다. 새 행이 나타나는 경우는 팬텀 읽기이고 커밋되지 않은 값을 읽는 경우는 더티 리드다.

## question: backend-02-q30
### solution
정답: executeUpdate. 허용 표기: 괄호가 붙은 `executeUpdate()`도 정답이며 대소문자는 구분하지 않는다. 근거: INSERT와 UPDATE와 DELETE는 `executeUpdate()`로 실행하고 영향받은 행 수를 돌려받는다. SELECT는 `executeQuery()`로 실행해 `ResultSet`을 받는다.

## question: backend-02-q31
### solution
forward는 서버 안에서 다른 자원으로 이동하므로 브라우저가 보낸 요청은 1번이고 주소창에는 처음의 등록 주소가 남으며 request 속성도 그대로 공유된다. redirect는 서버가 이동할 주소를 응답으로 알려 주고 브라우저가 새 요청을 보내 2번의 요청이 되며 주소창이 목록 주소로 바뀌고 새 request가 만들어져 속성이 공유되지 않는다. 등록 뒤 forward로 화면을 보여 주면 주소창에 POST 주소가 남아 새로고침이 마지막 POST를 다시 보내 같은 글이 또 등록된다. redirect를 쓰면 마지막 요청이 목록 조회 GET이어서 새로고침해도 목록만 다시 불러온다.

## question: backend-02-q32
### solution
두 사용자가 모두 재고 10을 읽고 각자 9로 계산해 저장하면 한 차감이 덮어써져 재고가 8이 아니라 9가 되는 갱신 손실이 생긴다. 이를 막으려면 재고 확인과 차감과 주문 기록을 하나의 트랜잭션으로 묶어 전부 성공하거나 전부 취소되게 한다. 행을 읽을 때 `SELECT ... FOR UPDATE`로 잠그면 다른 트랜잭션은 커밋될 때까지 기다린 뒤 최신 재고를 읽고 차감하며 `UPDATE ... SET stock = stock - 1`처럼 한 문장으로 차감해도 같은 효과가 있다. 모든 작업이 성공하면 `COMMIT`으로 확정하고 오류가 나면 `ROLLBACK`으로 되돌리며 잠금이 오래 걸리지 않도록 트랜잭션은 짧게 유지한다.
