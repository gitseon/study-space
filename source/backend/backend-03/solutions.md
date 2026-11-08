## question: backend-03-q01
### solution
정답 근거: `HttpServlet.service()`는 요청 방식에 따라 `doGet()`이나 `doPost()`를 호출하고 재정의하지 않은 메서드의 기본 구현은 405 상태를 보낸다. 풀이: POST 요청은 `doPost()`로 전달되지만 이 Servlet은 `doPost()`를 재정의하지 않았으므로 기본 구현이 `405 Method Not Allowed`로 응답한다. 흔한 실수: 구현한 메서드로 대신 처리된다고 보는 것이다.
### choice-explanation: a
`service()`는 요청 방식에 맞는 메서드만 호출한다. `doGet()`으로 바꿔 부르지 않는다.
### choice-explanation: b
Servlet 객체는 첫 요청에서 이미 만들어지고 `init()`에서 방식을 검사하지 않는다.
### choice-explanation: c
폼의 `method` 값은 그대로 전송된다. 브라우저가 POST를 GET으로 바꾸지 않는다.
### choice-explanation: d
요청 방식과 같은 이름의 메서드가 호출되고 재정의하지 않으면 기본 구현이 405를 보낸다.

## question: backend-03-q02
### solution
정답 근거: `/*`는 경로 패턴이라 확장자 패턴보다 우선하고 `/`는 아무 패턴에도 맞지 않을 때 쓰는 기본 매핑이다. 풀이: `/*`로 매핑하면 `/view/list.jsp` 요청도 `AppServlet`이 먼저 받아 JSP가 실행되지 않는다. `/`는 `*.jsp` 확장자 매핑이 우선이라 JSP 요청은 JSP 처리 Servlet이 받고 나머지 요청만 `AppServlet`이 받는다. 흔한 실수: 두 패턴이 같은 범위를 뜻한다고 보는 것이다.
### choice-explanation: a
순위가 반대로 설명되어 있다. 가로채는 쪽은 `/*`이다.
### choice-explanation: b
두 패턴은 순위가 달라 결과도 다르다. `/*`는 JSP 요청을 가로챈다.
### choice-explanation: c
경로 패턴 `/*`는 확장자 패턴보다 우선하지만 기본 매핑 `/`는 가장 낮은 순위다.
### choice-explanation: d
`/*`는 정확한 일치가 아니라 경로 전체를 포괄하는 패턴이다.

## question: backend-03-q03
### solution
정답 근거: `URLEncoder`는 한글을 UTF-8 바이트로 바꿔 `%XX` 형태의 대문자 16진수로 쓰고 공백은 `+`로 바꾼다. 풀이: `가`는 `%EA%B0%80` `나`는 `%EB%82%98`이고 둘 사이의 공백은 `+`가 되어 `%EA%B0%80+%EB%82%98`이 된다. 흔한 실수: 공백이 `%20`이 된다고 보거나 소문자 16진수를 쓰는 것이다.
### choice-explanation: a
`URLEncoder`는 공백을 `%20`이 아니라 `+`로 바꾼다.
### choice-explanation: b
16진수는 소문자가 아니라 대문자로 출력된다.
### choice-explanation: c
한글은 UTF-8 바이트의 대문자 16진수가 되고 공백은 더하기 기호가 된다.
### choice-explanation: d
공백이 `%2B`가 되면 더하기 기호 자체를 인코딩한 값이라 공백과 다르다.

## question: backend-03-q04
### solution
정답 근거: 컨텍스트 경로를 뺀 `/board/write.do`에서 마지막 `/` 다음부터 `.do` 앞까지가 action이다. 풀이: `path`는 `/board/write.do`이다. 마지막 `/`의 위치에 1을 더한 곳이 `write`의 시작이고 `.do`의 시작 위치가 끝이므로 결과는 `write`이다. 흔한 실수: 위치에 1을 더하지 않아 `/write`로 읽거나 `.do`를 포함하는 것이다.
### choice-explanation: a
`board`는 경로의 첫 단계다. 코드는 마지막 슬래시를 기준으로 자른다.
### choice-explanation: b
마지막 슬래시 다음부터 `.do` 앞까지를 자르면 `write`이다.
### choice-explanation: c
끝 위치가 `.do`의 시작이라 확장자는 결과에 포함되지 않는다.
### choice-explanation: d
시작 위치에 1을 더하므로 슬래시도 결과에 포함되지 않는다.

## question: backend-03-q05
### solution
정답 근거: Filter는 자신의 URL 패턴에 맞는 요청에만 실행되고 맞는 Filter는 `web.xml`의 선언 순서로 체인을 이룬다. 풀이: `/index.jsp`는 `/*`에만 맞아 F1 뒤에 Servlet이 실행된다. `/auth/mypage`는 `/*`와 `/auth/*`에 모두 맞아 선언 순서대로 F1 → F2 → S이다. 흔한 실수: 좁은 패턴이 넓은 패턴을 대신한다고 보는 것이다.
### choice-explanation: a
F2는 `/auth/*`에만 매핑되어 있어 `/index.jsp`에서는 실행되지 않는다.
### choice-explanation: b
`/*`로 매핑된 F1이 모든 요청에서 실행되므로 F1이 빠질 수 없다.
### choice-explanation: c
`/auth/*`에 맞는 요청에도 `/*`의 F1이 먼저 실행된다.
### choice-explanation: d
`/*`는 모든 요청에 맞고 `/auth/*`는 보호 경로에만 맞는다. 둘 다 맞으면 선언 순서로 실행된다.

## question: backend-03-q06
### solution
정답 근거: `session="false"`이면 번역된 Servlet 메서드에 `session` 내장 객체가 만들어지지 않는다. 풀이: `session` 변수가 선언되지 않으므로 `session.getId()`를 쓴 줄은 JSP를 Servlet으로 번역해 컴파일할 때 오류가 난다. 필요하면 `request.getSession()`으로 직접 얻는다. 흔한 실수: `session`이 `null`로 존재한다고 보는 것이다.
### choice-explanation: a
지시자가 내장 객체의 선언 자체를 빼므로 컴파일 단계에서 변수를 찾지 못한다.
### choice-explanation: b
`session`이라는 변수가 없으므로 메서드를 호출하는 결과가 문자열로 나올 수 없다.
### choice-explanation: c
변수가 `null`로 선언된 것이 아니라 아예 선언되지 않는다. 오류는 실행이 아니라 번역 때 난다.
### choice-explanation: d
`page` 지시자는 무시되지 않고 번역에 그대로 반영된다.

## question: backend-03-q07
### solution
정답 근거: `varStatus`의 `index`는 0부터 세고 `count`는 1부터 센다. 풀이: 세 번째 반복에서 `index`는 2이고 `count`는 3이므로 `2:3`이 출력된다. 첫 반복은 `0:1`이다. 흔한 실수: 두 값을 같은 시작 번호로 보는 것이다.
### choice-explanation: a
`index`는 0부터 시작하므로 세 번째에서 3이 될 수 없다.
### choice-explanation: b
`count`는 1부터 시작하므로 세 번째에서 2가 될 수 없다.
### choice-explanation: c
색인은 0부터 순번은 1부터이므로 마지막 반복은 2와 3이다.
### choice-explanation: d
두 값이 모두 반대로 계산된 결과다.

## question: backend-03-q08
### solution
정답 근거: `HttpOnly`는 쿠키를 JavaScript가 읽지 못하게 하는 속성이다. 풀이: 브라우저는 `document.cookie`에 이 쿠키를 보여 주지 않으므로 XSS로 삽입된 스크립트가 쿠키 값을 가져가기 어렵다. 서버로 보내는 요청에는 평소처럼 쿠키가 실린다. 다른 사이트에서 온 요청을 제한하는 속성은 `SameSite`이고 HTTPS 전용은 `Secure`이다. 흔한 실수: 세 속성의 역할을 섞는 것이다.
### choice-explanation: a
`HttpOnly`가 막는 것은 전송이 아니라 스크립트의 읽기이다.
### choice-explanation: b
HTTPS 전용은 `Secure`이다. `HttpOnly`는 스크립트의 읽기를 막는다.
### choice-explanation: c
다른 사이트의 요청을 제한하는 속성은 `SameSite`이다.
### choice-explanation: d
스크립트의 읽기만 막고 요청에는 쿠키가 그대로 실린다.

## question: backend-03-q09
### solution
정답 근거: `changeSessionId()`는 세션의 속성은 유지한 채 세션 ID만 새 값으로 바꾼다. 풀이: 공격자가 로그인 전에 알아낸 세션 ID를 피해자에게 심으면 로그인 뒤에도 같은 ID가 인증된 세션이 되는 세션 고정 공격이 가능하다. 로그인 성공 때 ID를 바꾸면 미리 알려진 ID가 쓸모없어진다. 흔한 실수: 세션 속성이 지워진다고 보는 것이다.
### choice-explanation: a
속성은 그대로 유지된다. 속성을 지우는 것은 `invalidate()`이다.
### choice-explanation: b
유지 시간은 `setMaxInactiveInterval()`이 다룬다. ID 교체와 무관하다.
### choice-explanation: c
ID만 새로 발급해 로그인 전에 알려진 ID를 무효로 만든다.
### choice-explanation: d
세션 데이터는 서버에 남고 브라우저에는 새 ID만 전달된다.

## question: backend-03-q10
### solution
정답 근거: `WHERE`가 먼저 행을 거르고 그 행들로 그룹과 평균을 만든 뒤 `HAVING`이 그룹을 거른다. 풀이: `sal >= 200`으로 개발의 100이 빠져 개발은 300과 500의 평균 400이 되고 운영은 200과 250의 평균 225 품질은 400이다. `HAVING AVG(sal) >= 300`으로 운영이 빠져 개발 400과 품질 400이 남는다. 흔한 실수: `WHERE`가 평균 계산에 영향을 주지 않는다고 보는 것이다.
### choice-explanation: a
`WHERE`를 적용하기 전의 행으로 개발의 평균을 계산한 결과다. 개발은 400이다.
### choice-explanation: b
`HAVING`이 평균 225인 운영을 걸러내므로 운영은 결과에 없다.
### choice-explanation: c
`WHERE`와 `HAVING`을 모두 적용하지 않은 결과다.
### choice-explanation: d
개발의 100이 먼저 걸러진 뒤 평균을 내므로 400이고 평균 225인 운영은 `HAVING`에서 빠진다.

## question: backend-03-q11
### solution
정답 근거: `LENGTH`는 바이트 수를 `CHAR_LENGTH`는 글자 수를 센다. 풀이: `가나`는 두 글자이고 utf8mb4에서 한글은 글자당 3바이트이므로 `LENGTH`는 6 `CHAR_LENGTH`는 2이다. 흔한 실수: `LENGTH`도 글자 수를 센다고 보는 것이다.
### choice-explanation: a
`LENGTH`는 글자 수가 아니라 바이트 수라서 2가 아니라 6이다.
### choice-explanation: b
`LENGTH`는 바이트 수 6이고 `CHAR_LENGTH`는 글자 수 2이다.
### choice-explanation: c
두 함수의 반환 값이 반대로 설명되어 있다.
### choice-explanation: d
`CHAR_LENGTH`는 바이트 수가 아니라 글자 수를 세므로 6이 아니라 2이다.

## question: backend-03-q12
### solution
정답 근거: `=`로 NULL을 비교하면 UNKNOWN이라 조인 조건이 맞지 않고 `<=>`는 NULL끼리도 같다고 본다. 풀이: 쿼리 A는 1끼리만 짝이 되어 1이다. 쿼리 B는 1끼리와 NULL끼리가 짝이 되어 2이다. 흔한 실수: NULL 키도 서로 같다고 보고 조인되는 것이다.
### choice-explanation: a
`=` 조건은 NULL 키를 짝지을 수 없어 1이고 `<=>` 조건은 NULL끼리도 짝지어 2이다.
### choice-explanation: b
`=` 조건에서는 NULL끼리 짝이 되지 않는다. 쿼리 A가 2가 될 수 없다.
### choice-explanation: c
`<=>`는 NULL끼리 같다고 보므로 쿼리 B는 1이 아니라 2이다.
### choice-explanation: d
1끼리는 `=`에서도 짝이 된다. 쿼리 A가 0이 될 수 없다.

## question: backend-03-q13
### solution
정답 근거: 자기 조인은 같은 테이블을 별칭으로 둘로 보고 `e.mgr`이 `m.id`와 같은 행을 짝짓는다. 풀이: 가온은 `mgr`이 NULL이라 짝이 없지만 LEFT JOIN이라 `m.name`이 NULL로 남는다. 나래와 다솜의 상사는 가온이고 라온의 상사는 나래이다. 흔한 실수: 짝 없는 최상위 행이 사라진다고 보거나 사원 이름을 상사 이름으로 읽는 것이다.
### choice-explanation: a
`m.name`은 상사의 이름이다. 사원 자신의 이름이 나오지 않는다.
### choice-explanation: b
최상위 가온은 NULL이고 나래와 다솜의 상사는 가온이며 라온의 상사는 나래이다.
### choice-explanation: c
LEFT JOIN은 짝이 없는 가온 행을 NULL과 함께 남기므로 3행이 아니라 4행이다.
### choice-explanation: d
라온의 상사는 `mgr`이 2인 나래다. 가온이 아니다.

## question: backend-03-q14
### solution
정답 근거: 상관 서브쿼리는 바깥 행의 부서(`e.dept`)가 바뀔 때마다 그 부서의 평균을 다시 계산한다. 풀이: 개발의 평균은 300이라 500인 다솜만 높다. 운영의 평균은 225라 250인 마루만 높다. 품질은 한 명이라 평균과 같아 제외되므로 다솜과 마루의 2행이다. 흔한 실수: 전체 평균 한 값과 비교하거나 같은 값도 포함하는 것이다.
### choice-explanation: a
전체 평균 약 291.7과 비교한 3행이다. 서브쿼리는 부서마다 평균을 구한다.
### choice-explanation: b
평균과 같은 값까지 포함하면 4행이다. 조건은 `>`라서 같은 값은 제외된다.
### choice-explanation: c
운영에서도 평균보다 높은 사원이 있어 1행으로 끝나지 않는다.
### choice-explanation: d
부서별 평균과 비교해 다솜과 마루만 높아 2행이다.

## question: backend-03-q15
### solution
정답 근거: `GROUP BY`나 집계 함수가 들어간 뷰는 갱신할 수 없다. 풀이: 뷰의 한 행은 여러 원본 행의 계산 결과라서 어느 원본 행을 어떻게 바꿔야 평균이 300이 되는지 정할 수 없다. 그래서 MySQL은 갱신할 수 없는 뷰라는 오류를 낸다. 값을 바꾸려면 원본 `pay` 테이블을 갱신한다. 흔한 실수: 뷰를 거쳐 원본이 자동으로 조정된다고 보는 것이다.
### choice-explanation: a
원본의 어느 행도 자동으로 조정되지 않는다. 오류가 발생한다.
### choice-explanation: b
뷰는 계산 결과를 따로 저장하지 않는다. 갱신 자체가 허용되지 않는다.
### choice-explanation: c
집계 뷰의 행은 원본 행과 일대일이 아니므로 갱신이 거부된다.
### choice-explanation: d
`WITH CHECK OPTION`은 조건을 점검하는 옵션이며 갱신 가능 여부와 무관하다.

## question: backend-03-q16
### solution
정답 근거: `UNIQUE` 제약은 같은 값의 중복을 막지만 NULL은 서로 같은 값이 아니라서 여러 개를 허용한다. 풀이: 2번은 `a@x`가 이미 있어 중복 오류다. 3번과 4번의 NULL은 서로 다른 것으로 취급되어 둘 다 들어간다. 그래서 1번과 3번과 4번의 3행이 남는다. 흔한 실수: NULL도 중복으로 막힌다고 보는 것이다.
### choice-explanation: a
4번의 NULL은 3번의 NULL과 중복으로 보지 않아 오류가 나지 않는다.
### choice-explanation: b
같은 문자열은 막히고 NULL은 서로 다른 값이라 여러 개 들어가 3행이 남는다.
### choice-explanation: c
3번과 4번은 NULL이라 오류가 나지 않는다. 이 선택지는 NULL을 중복으로 본 계산이다.
### choice-explanation: d
2번은 같은 문자열이라 중복 오류가 난다. 4행이 남을 수 없다.

## question: backend-03-q17
### solution
정답 근거: `DELETE`는 트랜잭션 안에서 되돌릴 수 있지만 `TRUNCATE`는 DDL처럼 암묵적으로 커밋되어 되돌릴 수 없다. 풀이: (가)는 `DELETE` 뒤에 `ROLLBACK`으로 3행이 복구된다. (나)는 `TRUNCATE`가 실행되면서 커밋되어 이후의 `ROLLBACK`이 효과가 없으므로 0행이다. 흔한 실수: `TRUNCATE`도 `DELETE`처럼 롤백된다고 보는 것이다.
### choice-explanation: a
`DELETE`는 트랜잭션 안에서 실행되어 `ROLLBACK`으로 되돌려진다. (가)는 0이 아니다.
### choice-explanation: b
`TRUNCATE`는 롤백되지 않으므로 (나)는 3이 될 수 없다.
### choice-explanation: c
`DELETE`는 롤백으로 복구되고 `TRUNCATE`는 암묵적 커밋이라 복구되지 않는다.
### choice-explanation: d
두 문장의 롤백 가능 여부가 반대로 설명되어 있다.

## question: backend-03-q18
### solution
정답 근거: `READ UNCOMMITTED`는 커밋되지 않은 변경도 읽고 `READ COMMITTED`는 커밋된 값만 읽는다. 풀이: T2의 150은 커밋 전이다. 더티 리드를 허용하는 `READ UNCOMMITTED`는 150을 읽고 `READ COMMITTED`는 커밋된 마지막 값인 100을 읽는다. 흔한 실수: 낮은 격리 수준이면 모두 새 값을 읽는다고 보는 것이다.
### choice-explanation: a
`READ COMMITTED`는 커밋되지 않은 값을 읽지 않는다. 100이 읽힌다.
### choice-explanation: b
커밋 전의 값은 가장 낮은 격리 수준만 읽고 `READ COMMITTED`는 커밋된 100을 읽는다.
### choice-explanation: c
`READ UNCOMMITTED`는 커밋되지 않은 값을 읽을 수 있다. 150이 읽힌다.
### choice-explanation: d
두 수준의 결과가 뒤바뀌었다. 커밋 전 값을 읽는 쪽이 `READ UNCOMMITTED`이다.

## question: backend-03-q19
### solution
정답 근거: 트랜잭션이 진행 중일 때 `START TRANSACTION`을 다시 실행하면 진행 중인 트랜잭션이 암묵적으로 커밋된다. 풀이: 두 번째 `START TRANSACTION`이 첫 트랜잭션의 `INSERT 1`을 커밋하고 새 트랜잭션을 시작한다. 그 안의 `INSERT 2`만 `ROLLBACK`으로 취소된다. 흔한 실수: 트랜잭션이 중첩되어 `ROLLBACK`이 전체를 되돌린다고 보는 것이다.
### choice-explanation: a
첫 트랜잭션은 두 번째 시작에서 커밋되고 새 트랜잭션의 행 2만 취소된다.
### choice-explanation: b
취소되는 것은 나중의 트랜잭션이므로 행 2이다. 행 1은 이미 커밋되었다.
### choice-explanation: c
행 1은 암묵적 커밋으로 확정되었으므로 남는다. 비어 있지 않다.
### choice-explanation: d
행 2는 마지막 `ROLLBACK`으로 취소된다. 모두 남지는 않는다.

## question: backend-03-q20
### solution
정답 근거: `setAutoCommit(false)`이면 `commit()`을 호출해야 변경이 확정된다. 풀이: `executeUpdate()`는 이 연결의 트랜잭션 안에서만 변경을 적용한다. `commit()` 없이 연결을 닫으면 커밋되지 않은 변경은 취소되어 새 연결에서는 처음의 1000이 읽힌다. 흔한 실수: 연결을 닫을 때 자동으로 커밋된다고 보는 것이다.
### choice-explanation: a
autocommit을 끈 상태에서는 문장을 실행해도 바로 확정되지 않는다.
### choice-explanation: b
커밋이 없으면 변경은 확정되지 않고 새 연결은 처음 값을 읽는다.
### choice-explanation: c
`close()`는 커밋을 하지 않는다. 커밋되지 않은 변경은 취소된다.
### choice-explanation: d
InnoDB의 일반 조회는 잠긴 행도 읽을 수 있어 새 연결은 커밋된 값을 읽는다.

## question: backend-03-q21
### solution
정답 근거: `getInt`는 SQL NULL을 0으로 바꾸어 돌려주고 `wasNull()`로 직전에 읽은 값이 NULL이었는지 알 수 있다. 풀이: `int`는 null을 담을 수 없어 `bonus`는 0이 되고 `wasNull()`이 true를 돌려준다. 0이 실제 값인지 NULL인지는 `wasNull()`로 구분한다. 흔한 실수: NULL이면 예외가 난다고 보거나 0과 NULL을 구분하지 못하는 것이다.
### choice-explanation: a
NULL은 0으로 읽히고 `wasNull()`이 NULL이었음을 알려 준다.
### choice-explanation: b
NULL이었다면 `wasNull()`이 true를 돌려준다. false가 아니다.
### choice-explanation: c
`getInt`는 NULL에서 예외를 던지지 않고 0을 반환한다.
### choice-explanation: d
`int` 변수에는 null이 담기지 않으므로 NullPointerException은 일어나지 않는다.

## question: backend-03-q22
### solution
정답: url-pattern. 허용 표기: 꺾쇠가 붙은 `<url-pattern>`도 정답이며 대소문자는 구분하지 않는다. 근거: `<servlet-mapping>`은 `<servlet-name>`으로 Servlet을 가리키고 `<url-pattern>`으로 그 Servlet이 받을 경로를 정한다.

## question: backend-03-q23
### solution
정답: 지역 변수. 허용 표기: 띄어 쓰지 않은 `지역변수`와 영문 `local variable`도 정답이며 대소문자는 구분하지 않는다. 근거: 지역 변수는 메서드를 호출한 스레드의 스택에 만들어져 스레드마다 따로 있다. 인스턴스 필드와 static 필드는 모든 스레드가 공유한다.

## question: backend-03-q24
### solution
정답: application. 허용 표기: EL에서 쓰는 `applicationScope`도 정답이며 대소문자는 구분하지 않는다. 근거: application scope는 `ServletContext`에 저장되어 애플리케이션이 실행되는 동안 모든 요청과 사용자가 같은 값을 본다. session은 사용자마다 따로 있다.

## question: backend-03-q25
### solution
정답: setMaxInactiveInterval. 허용 표기: 괄호가 붙은 `setMaxInactiveInterval()`도 정답이며 대소문자는 구분하지 않는다. 근거: 이 메서드는 초 단위로 값을 받고 `web.xml`의 `session-timeout`은 분 단위이다. 읽기는 `getMaxInactiveInterval()`이 한다.

## question: backend-03-q26
### solution
정답: NULL. 허용 표기: 한글 `널`도 정답이며 영문은 대소문자를 구분하지 않는다. 근거: `COUNT(*)`는 행 전체를 세고 `COUNT(컬럼)`은 그 열이 NULL이 아닌 행만 센다. 중복을 빼고 세려면 `COUNT(DISTINCT 컬럼)`을 쓴다.

## question: backend-03-q27
### solution
정답: ALL. 허용 표기: `UNION ALL`로 쓴 답도 정답이며 대소문자는 구분하지 않는다. 근거: `UNION`은 기본적으로 중복을 제거하고 `UNION ALL`은 모든 행을 그대로 합친다. 중복 제거 비용이 없어 중복이 없다고 알 때는 `UNION ALL`을 쓴다.

## question: backend-03-q28
### solution
정답: 인조키. 허용 표기: `대리키`와 `인조 식별자`와 영문 `surrogate key`도 정답이며 대소문자는 구분하지 않는다. 근거: 주민번호나 이메일처럼 업무에서 오는 본질 식별자 대신 업무 의미가 없는 번호를 기본키로 쓰는 방식이다. 복합키를 줄이고 값이 바뀌지 않는다는 장점이 있다.

## question: backend-03-q29
### solution
정답: B+Tree. 허용 표기: `B+ Tree`와 한글 `B+트리`와 `B+ 트리`도 정답이며 대소문자는 구분하지 않는다. 근거: B+Tree는 내부 노드로 탐색 범위를 좁히고 정렬된 리프를 연결 리스트처럼 이어 범위 조회에 유리하다. 데이터는 리프 노드에 모인다.

## question: backend-03-q30
### solution
정답: executeQuery. 허용 표기: 괄호가 붙은 `executeQuery()`도 정답이며 대소문자는 구분하지 않는다. 근거: SELECT는 `executeQuery()`로 실행해 `ResultSet`을 받고 INSERT와 UPDATE와 DELETE는 `executeUpdate()`로 실행해 행 수를 받는다.

## question: backend-03-q31
### solution
**(1)** Filter를 `/auth/*` 패턴에 매핑하면 이 경로로 오는 모든 요청이 Servlet에 닿기 전에 Filter를 먼저 거친다.

**(2)** Filter는 `getSession(false)`로 세션을 얻어 `loginUser` 속성이 있는지 확인한다. 세션이나 속성이 없으면 로그인 폼으로 redirect하고 `chain.doFilter()`를 호출하지 않아 요청이 Servlet까지 가지 못한다. 속성이 있으면 `chain.doFilter()`를 호출해 다음 단계로 넘긴다.

**(3)** 각 Servlet에 검사를 넣으면 같은 코드가 반복되고 새 Servlet에서 검사를 빠뜨릴 수 있지만 Filter 하나에 모으면 보호 경로 전체가 같은 규칙을 따른다.

## question: backend-03-q32
### solution
**(1)** `post_id`가 `writer_id`를 정하고 `writer_id`가 `writer_name`과 `writer_email`을 정하므로 기본키가 아닌 `writer_id`를 거쳐 다른 속성이 결정되는 이행 종속이 있다. 기본키가 아닌 속성이 다른 비키 속성을 결정하는 구조이므로 3정규형을 위반한다.

**(2)** 작성자 정보를 `member` 테이블로 분리하고 `post`에는 `writer_id`를 외래키로 남기면 해결된다.

**(3)** 분리하기 전에는 같은 작성자의 이름과 이메일이 게시글마다 반복 저장되어 이름을 바꾸면 여러 행을 모두 고쳐야 했지만 분리한 뒤에는 한 행만 고치면 된다.
