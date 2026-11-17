## question: spring-03-q01
### solution
정답 근거: 자동 구성은 조건부이다. `@ConditionalOnMissingBean`은 같은 타입의 빈이 이미 있으면 등록하지 않는다. 풀이: 개발자가 만든 `ClockInfo`가 있으므로 자동 구성의 빈은 물러나 컨텍스트에는 하나만 남는다. 개발자가 아무것도 만들지 않으면 자동 구성의 빈이 쓰인다. 검증 환경에서 두 경우를 실행해 확인했다.
### choice-explanation: a
조건 때문에 자동 구성의 빈은 등록되지 않아 둘이 되지 않는다.
### choice-explanation: b
자동 구성은 개발자가 만든 빈을 덮어쓰지 않고 물러난다.
### choice-explanation: c
개발자의 빈이 우선하고 자동 구성은 조용히 물러난다.
### choice-explanation: d
빈이 하나만 남으므로 중복으로 실패하지 않는다.

## question: spring-03-q02
### solution
정답 근거: 로거는 설정한 레벨과 그보다 심각한 레벨만 출력한다. 심각도는 TRACE, DEBUG, INFO, WARN, ERROR 순서로 높아진다. 풀이: `INFO`로 설정하면 `INFO`와 `WARN`과 `ERROR`가 출력되고 `TRACE`와 `DEBUG`는 출력되지 않는다. 검증 환경에서 Logback의 출력 이벤트를 확인했다. 흔한 실수: 설정한 레벨 하나만 출력된다고 생각하는 것이다.
### choice-explanation: a
낮은 레벨은 설정한 레벨보다 낮아서 출력되지 않는다.
### choice-explanation: b
설정한 레벨보다 낮은 쪽을 출력한다는 방향이 거꾸로이다.
### choice-explanation: c
설정한 레벨보다 높은 레벨도 함께 출력된다.
### choice-explanation: d
설정한 레벨과 그보다 심각한 레벨이 출력된다.

## question: spring-03-q03
### solution
정답 근거: 기본 `@Configuration`은 CGLIB 프록시로 감싸져 `@Bean` 메서드를 부르면 컨테이너의 singleton을 돌려준다. `proxyBeanMethods = false`이면 일반 메서드 호출이라 새 객체가 만들어진다. 풀이: `FullConfig`에서는 `first()`가 같은 빈이라 true이고 `LiteConfig`에서는 `new First()`가 새로 만들어져 false이다. 검증 환경에서 두 설정을 실행해 확인했다.
### choice-explanation: a
`LiteConfig`에서는 메서드 호출이 새 객체를 만들어 같지 않다.
### choice-explanation: b
기본 설정은 같은 빈을 돌려주고 프록시를 끈 설정은 새로 만든다.
### choice-explanation: c
기본 설정에서도 같은 빈을 돌려주므로 첫 값이 false가 아니다.
### choice-explanation: d
기본 설정이 같은 빈을 돌려주므로 둘 다 false가 아니다.

## question: spring-03-q04
### solution
정답 근거: 생성자 주입에서 서로를 만들려면 상대가 먼저 있어야 해서 어느 쪽도 만들 수 없다. 풀이: 컨테이너가 순환을 발견하면 빈 생성 오류로 시작이 실패한다. 이 문제가 요청을 처리하는 중이 아니라 시작 시점에 드러나는 것이 생성자 주입의 장점이다. 검증 환경에서 실패를 확인했다. 해결 방법은 책임을 나누어 한쪽의 의존을 없애는 것이다.
### choice-explanation: a
생성자 주입은 null을 넣고 넘어가지 않는다.
### choice-explanation: b
문제는 요청이 아니라 시작 시점에 드러난다.
### choice-explanation: c
순환을 발견하면 빈 생성 오류로 시작이 실패한다.
### choice-explanation: d
생성자 주입은 자동으로 지연 생성하지 않는다.

## question: spring-03-q05
### solution
정답 근거: `List<타입>`으로 주입받으면 그 타입의 빈이 모두 들어온다. `@Primary`는 하나만 받는 주입 지점의 후보를 정하는 기준이라 목록 주입에는 영향이 없다. 풀이: 빈이 둘이므로 목록의 크기는 2이다. 검증 환경에서 목록 크기와 `@Primary` 주입 결과를 확인했다.
### choice-explanation: a
같은 타입의 빈이 모두 들어와 크기가 2이다.
### choice-explanation: b
`@Primary`가 붙은 빈 하나만 들어온다고 본 것이다.
### choice-explanation: c
후보가 있으므로 목록이 비지 않는다.
### choice-explanation: d
목록으로 받으면 후보가 여럿이어도 실패하지 않는다.

## question: spring-03-q06
### solution
정답 근거: 파라미터 자리의 `*`는 파라미터가 정확히 하나일 때만 맞고 `..`는 개수와 관계없이 맞는다. 풀이: `*Service`로 끝나는 타입에서 이름이 `find`로 시작하는 메서드는 `findSeat`, `findAll`, `findByNameAndFloor`이다. 그중 파라미터가 하나인 것은 `findSeat` 하나이다. `save`는 이름이 맞지 않고 `SeatHelper`는 타입이 맞지 않는다. 검증 환경에서 두 pointcut의 호출 수를 확인했다.
### choice-explanation: a
파라미터 개수와 관계없는 쪽은 `findSeat`, `findAll`, `findByNameAndFloor` 세 개이다.
### choice-explanation: b
`*`는 하나일 때만 맞아 1회이고 `..`는 이름이 맞는 세 개에 걸려 3회이다.
### choice-explanation: c
`*`가 하나의 파라미터만 맞춘다는 점을 놓친 계산이다.
### choice-explanation: d
`..`가 파라미터 개수와 관계없다는 점을 놓친 계산이다.

## question: spring-03-q07
### solution
정답 근거: 예외가 나면 AfterReturning 대신 AfterThrowing이 실행되고 After는 정상이든 예외든 끝난 뒤 실행된다. 풀이: Around의 앞부분과 Before가 target 앞에서 실행된다. target이 던진 뒤에는 AfterThrowing과 After가 이 순서로 실행되고 마지막에 Around의 `finally`가 실행된다. 예외는 호출자에게 그대로 전파된다. 검증 환경에서 순서와 전파를 확인했다.
### choice-explanation: a
예외가 나면 AfterReturning은 실행되지 않는다.
### choice-explanation: b
AfterThrowing이 After보다 먼저 실행된다.
### choice-explanation: c
예외 흐름에서는 AfterThrowing과 After가 이 순서로 실행된다.
### choice-explanation: d
Around의 앞부분이 Before보다 먼저 실행된다.

## question: spring-03-q08
### solution
정답 근거: 클래스의 `@RequestMapping` 경로와 메서드의 경로가 이어 붙는다. 풀이: 이 핸들러는 `GET /rooms/{roomId}`를 처리하므로 `GET /rooms/7`에 맞는다. `{roomId}`는 7로 바인딩되어 모델에 담기고 반환한 뷰 이름은 `room/detail`이다. 검증 환경에서 뷰 이름과 모델 값을 확인했다.
### choice-explanation: a
두 경로가 이어 붙어 `/rooms/7`이 맞으므로 404가 아니다.
### choice-explanation: b
GET 요청이고 GET 핸들러이므로 405가 아니다.
### choice-explanation: c
뷰 이름은 반환한 문자열 전체이고 `roomId`는 경로의 값 7이다.
### choice-explanation: d
반환한 뷰 이름과 경로 변수의 값이 그대로 쓰인다.

## question: spring-03-q09
### solution
정답 근거: `required = false`이면 값이 없을 때 null이 들어가고 `defaultValue`가 있으면 값이 없을 때 그 값이 쓰인다. 풀이: `keyword`는 null이고 `page`는 기본값 1이다. 둘 다 필수가 아니므로 400이 아니다. 검증 환경에서 모델의 두 값을 확인했다. 주의점: `defaultValue`가 있으면 `required`는 자동으로 `false`처럼 동작한다.
### choice-explanation: a
값이 없을 때 빈 문자열이 들어가지 않고 null이다.
### choice-explanation: b
값이 없으면 null과 기본값 1이 쓰인다.
### choice-explanation: c
둘 다 필수가 아니므로 400이 아니다.
### choice-explanation: d
`page`에는 지정한 기본값 1이 들어가므로 0이 아니다.

## question: spring-03-q10
### solution
정답 근거: forward는 서버 안에서 같은 요청을 다른 경로로 넘기므로 브라우저의 주소는 바뀌지 않고 상태는 200이다. redirect는 302 응답과 새 주소를 보내 브라우저가 새 요청을 보내게 한다. 풀이: redirect는 요청이 두 번이라 첫 요청의 request 값을 쓸 수 없다. 검증 환경에서 forward의 이동 경로와 redirect의 상태 코드를 확인했다.
### choice-explanation: a
forward는 302 응답을 보내지 않는다.
### choice-explanation: b
두 방식의 설명이 서로 바뀌었다.
### choice-explanation: c
forward는 서버 안의 이동이고 redirect는 302와 새 요청이다.
### choice-explanation: d
redirect는 서버 안의 이동이 아니라 브라우저가 새 요청을 보낸다.

## question: spring-03-q11
### solution
정답 근거: `preHandle`이 `false`를 반환하면 핸들러와 뒤의 인터셉터는 실행되지 않는다. `afterCompletion`은 `preHandle`이 `true`를 반환한 인터셉터에 대해서만 호출된다. 풀이: 1은 통과했으므로 `after1`이 호출되고 `false`를 반환한 2는 완료 콜백이 호출되지 않는다. `postHandle`은 핸들러가 정상 종료할 때만 불린다. 검증 환경에서 순서를 확인했다.
### choice-explanation: a
통과한 1의 완료 콜백만 호출된다.
### choice-explanation: b
`false`를 반환한 2의 완료 콜백은 호출되지 않는다.
### choice-explanation: c
핸들러가 실행되지 않았으므로 `postHandle`은 호출되지 않는다.
### choice-explanation: d
`false`이면 핸들러가 실행되지 않는다.

## question: spring-03-q12
### solution
정답 근거: `<if>`가 참인 조건만 `AND`로 이어 붙고 `<where>`가 맨 앞의 `AND`를 지운다. 풀이: `search(1, "kim")`은 방 1이고 이름에 `kim`이 들어가는 1번만 맞는다. `kimchi`는 방이 2라서 제외된다. `search(null, "")`는 두 조건이 모두 거짓이라 `WHERE`가 없어 전체 3행이 나온다. 검증 환경에서 이 결과를 확인했다.
### choice-explanation: a
두 조건이 함께 적용되므로 방 1의 두 행이 모두 나오지 않는다.
### choice-explanation: b
두 조건이 모두 맞는 1번과 조건이 없을 때의 전체 행이다.
### choice-explanation: c
방 조건이 있으므로 다른 방의 `kimchi`는 포함되지 않는다.
### choice-explanation: d
조건이 모두 비면 빈 결과가 아니라 전체가 조회된다.

## question: spring-03-q13
### solution
정답 근거: `#{keyword}`는 값으로 바인딩되고 앞뒤에 `%`를 붙인 패턴이 만들어진다. 이름에 `kim`이 들어 있으면 맞는다. 풀이: `kim`과 `kimchi`가 맞고 `lee`는 맞지 않아 1번과 3번이 나온다. 방 조건은 null이라 적용되지 않는다. 검증 환경에서 결과를 확인했다. 주의점: 값은 `#{}`로 바인딩하고 `${}`로 이어 붙이지 않는다.
### choice-explanation: a
`kimchi`도 `kim`을 포함하므로 3번이 빠지지 않는다.
### choice-explanation: b
맞는 이름이 있으므로 빈 결과가 아니다.
### choice-explanation: c
`lee`는 `kim`을 포함하지 않아 제외된다.
### choice-explanation: d
이름에 `kim`이 들어간 두 행이다.

## question: spring-03-q14
### solution
정답 근거: insert 메서드의 반환값은 영향받은 행 수이다. `useGeneratedKeys`와 `keyProperty`가 있으면 생성된 키가 파라미터 객체의 프로퍼티에 채워진다. 풀이: 한 행을 넣었으므로 `n`은 1이고 생성된 키 4가 `r`에 들어간다. 검증 환경에서 두 값을 확인했다. 흔한 실수: 반환값이 생성된 키라고 생각하는 것이다.
### choice-explanation: a
반환값은 키가 아니라 행 수이므로 4가 아니다.
### choice-explanation: b
한 행이 들어갔으므로 반환값은 0이 아니다.
### choice-explanation: c
영향받은 행 수 1과 채워진 키 4이다.
### choice-explanation: d
키는 속성을 지정했으므로 null이 아니라 채워진다.

## question: spring-03-q15
### solution
정답 근거: 트랜잭션 프록시는 메서드 밖으로 나온 예외를 보고 rollback을 정한다. 메서드 안에서 잡아 삼킨 예외는 프록시가 알 수 없다. 풀이: 정상 종료로 보아 commit하므로 insert가 반영되어 4행이 된다. 예외를 잡았다면 다시 던지거나 rollback 표시를 직접 남겨야 한다. 검증 환경에서 이 결과를 확인했다.
### choice-explanation: a
정상 종료로 commit되어 한 행이 늘어난다.
### choice-explanation: b
rollback되지 않으므로 3행으로 돌아가지 않는다.
### choice-explanation: c
한 행만 추가되므로 5행이 아니다.
### choice-explanation: d
예외를 잡았으므로 호출자에게 전파되지 않는다.

## question: spring-03-q16
### solution
정답 근거: `MANDATORY`는 이미 진행 중인 트랜잭션에 반드시 참여해야 한다. 없으면 예외를 던진다. 풀이: 트랜잭션 없이 호출하면 `IllegalTransactionStateException`이 발생하고 로그 insert는 실행되지 않는다. 새로 시작하는 것은 `REQUIRED`이고 없어도 실행하는 것은 `SUPPORTS`이다. 검증 환경에서 예외와 로그 0행을 확인했다.
### choice-explanation: a
새 트랜잭션을 시작하는 것은 `REQUIRED`의 동작이다.
### choice-explanation: b
트랜잭션 없이 실행하는 것은 `SUPPORTS`의 동작이다.
### choice-explanation: c
반환값이 아니라 예외로 알린다.
### choice-explanation: d
트랜잭션이 없으면 예외가 발생하고 insert는 실행되지 않는다.

## question: spring-03-q17
### solution
정답 근거: 본문 형식을 지원하지 않으면 415 Unsupported Media Type이고 형식은 맞지만 내용을 읽을 수 없으면 400 Bad Request이다. 풀이: form 형식은 JSON으로 변환할 수 없는 형식이라 415이다. JSON이지만 문법이 틀리면 변환 중 오류가 나 400이다. 검증 환경에서 두 요청을 보내 확인했다.
### choice-explanation: a
form 형식은 400이 아니라 형식 미지원인 415이다.
### choice-explanation: b
형식 미지원은 415이고 문법 오류는 400이다.
### choice-explanation: c
문법이 틀린 JSON은 415가 아니라 400이다.
### choice-explanation: d
두 코드가 서로 바뀌었다.

## question: spring-03-q18
### solution
정답 근거: `ResponseEntity.noContent()`는 204 No Content를 만든다. 본문은 없다. 풀이: 삭제가 성공하면 돌려줄 내용이 없으므로 204와 빈 본문으로 응답한다. 검증 환경에서 상태와 본문 길이 0을 확인했다. 주의점: 200과 비어 있는 본문의 조합이나 204와 본문의 조합은 의미가 모순된다.
### choice-explanation: a
204와 빈 본문이다.
### choice-explanation: b
본문이 없다는 뜻의 상태는 200이 아니라 204이다.
### choice-explanation: c
204 응답에는 본문을 담지 않는다.
### choice-explanation: d
삭제에 성공했으므로 404가 아니다.

## question: spring-03-q19
### solution
정답 근거: form 로그인의 기본 실패 처리는 `/login?error`로의 redirect이다. 풀이: 인증에 실패하면 인증 정보가 저장되지 않고 로그인 화면으로 돌려보낸다. 사용자 이름이 없는 경우도 같은 곳으로 간다. 검증 환경에서 비밀번호가 틀린 경우와 없는 사용자의 응답을 확인했다.
### choice-explanation: a
실패하면 `/login?error`로 redirect한다.
### choice-explanation: b
성공했을 때의 이동 경로이다.
### choice-explanation: c
기본 form 로그인은 JSON 본문 없이 redirect로 알린다.
### choice-explanation: d
실패 응답은 200이 아니라 302이다.

## question: spring-03-q20
### solution
정답 근거: 규칙은 위에서부터 처음 맞는 것 하나가 적용된다. 인증이 필요한 경로를 로그인 없이 요청하면 form 로그인에서는 로그인 화면으로 redirect하고 인증은 되었지만 권한이 없으면 403이다. 풀이: `/me`는 `anyRequest().authenticated()`에 맞아 익명 사용자가 `/login`으로 이동한다. `/admin/reports/daily`는 `/admin/**` 규칙에 맞아 `USER` 사용자는 403이다. 검증 환경에서 두 요청의 결과를 확인했다.
### choice-explanation: a
`/me`와 `/admin` 모두 허용되는 경로가 아니다.
### choice-explanation: b
인증되지 않은 사용자는 403이 아니라 로그인 화면으로 간다.
### choice-explanation: c
두 결과의 순서가 서로 바뀌었다.
### choice-explanation: d
익명의 보호된 경로는 로그인 화면으로 가고 권한 없는 사용자는 403이다.

## question: spring-03-q21
### solution
정답 근거: BCrypt는 해시를 만들 때마다 무작위 salt를 섞어 같은 비밀번호도 다른 해시가 나온다. 해시 안에 salt가 들어 있어 `matches`로 원문과 해시를 비교하면 같은 비밀번호임을 확인할 수 있다. 풀이: 해시 문자열끼리 비교하면 실패하므로 `matches(원문, 해시)`를 쓴다. 검증 환경에서 두 해시가 다르고 둘 다 `matches`가 true임을 확인했다.
### choice-explanation: a
해시마다 salt가 달라 문자열이 같지 않다.
### choice-explanation: b
해시는 서로 다르지만 둘 다 원문과 맞는다.
### choice-explanation: c
둘 다 같은 원문에서 만들어졌으므로 한쪽만 맞는 일은 없다.
### choice-explanation: d
같은 비밀번호도 인코딩할 때마다 다른 해시가 나온다.

## question: spring-03-q22
### solution
정답: @BeforeEach. 허용 표기: `@`를 뺀 `BeforeEach`도 정답이며 대소문자는 구분하지 않는다. 근거: 이 어노테이션이 붙은 메서드는 각 `@Test` 앞에서 실행되고 `@AfterEach`는 각 테스트 뒤에 실행된다. 검증 환경에서 테스트 두 개의 실행 순서가 `before a after before b after`임을 확인했다.

## question: spring-03-q23
### solution
정답: @Configuration. 허용 표기: `@`를 뺀 `Configuration`도 정답이며 대소문자는 구분하지 않는다. 근거: 이 어노테이션이 붙은 클래스는 프록시로 감싸져 `@Bean` 메서드 호출이 컨테이너의 빈을 돌려준다. `proxyBeanMethods = false`이면 일반 호출이 된다. 검증 환경에서 두 설정을 비교해 확인했다.

## question: spring-03-q24
### solution
정답: aspect. 허용 표기: 한글 `애스펙트`와 `어스펙트`도 정답이며 대소문자는 구분하지 않는다. 근거: aspect는 pointcut과 advice를 묶은 모듈이고 Spring에서는 `@Aspect` 클래스로 쓴다. target에 aspect를 엮는 과정은 weaving이다. 이 문항은 개념 정의에 대한 것이며 실행해 확인하지 않았다.

## question: spring-03-q25
### solution
정답: @PathVariable. 허용 표기: `@`를 뺀 `PathVariable`도 정답이며 대소문자는 구분하지 않는다. 근거: 이 어노테이션이 URL 경로의 `{이름}` 값을 파라미터로 바인딩한다. 쿼리 스트링 값은 `@RequestParam`으로 받는다. 검증 환경에서 `/rooms/7`의 `roomId`가 7로 바인딩됨을 확인했다.

## question: spring-03-q26
### solution
정답: @NotBlank. 허용 표기: `@`를 뺀 `NotBlank`도 정답이며 대소문자는 구분하지 않는다. 근거: `@NotNull`은 null만, `@NotEmpty`는 null과 빈 값을 막고 `@NotBlank`는 공백뿐인 문자열까지 막는다. 검증 환경에서 공백 한 칸의 이름과 0명의 인원이 모두 검증 오류가 되어 오류가 2건임을 확인했다.

## question: spring-03-q27
### solution
정답: collection. 허용 표기: 꺾쇠를 붙인 `<collection>`도 정답이며 대소문자는 구분하지 않는다. 근거: 1:N 관계의 N쪽은 `<collection>`으로 목록에 담고 1:1이나 N:1은 `<association>`으로 객체 하나에 담는다. 검증 환경에서 예약이 둘인 방과 없는 방의 결과를 확인했다.

## question: spring-03-q28
### solution
정답: 자기 호출. 허용 표기: `내부 호출`과 `self-invocation`도 정답이다. 근거: 프록시는 외부에서 들어오는 호출만 가로챈다. 같은 객체 안의 호출은 target의 메서드를 직접 부르므로 advice와 트랜잭션이 적용되지 않는다. 대상 메서드를 다른 빈으로 옮기면 해결된다. 검증 환경에서 AOP와 트랜잭션 모두 이 현상을 확인했다.

## question: spring-03-q29
### solution
정답: PATCH. 허용 표기: 대소문자는 구분하지 않는다. 근거: PUT은 보낸 내용으로 전체를 교체하고 PATCH는 일부만 수정한다. PUT은 여러 번 보내도 결과가 같은 멱등한 메서드이지만 PATCH는 멱등하다고 보장하지 않는다. 이 문항은 HTTP 명세의 정의에 대한 것이며 실행해 확인하지 않았다.

## question: spring-03-q30
### solution
정답: SecurityContextHolder. 허용 표기: 대소문자는 구분하지 않는다. 근거: 인증 결과는 `SecurityContext`에 담기고 `SecurityContextHolder`로 꺼낸다. 컨트롤러에서는 `@AuthenticationPrincipal` 파라미터가 더 간단하다. 검증 환경에서 로그인한 사용자의 이름과 권한이 `@AuthenticationPrincipal`로 전달됨을 확인했다.

## question: spring-03-q31
### solution
**(1)** 없는 대여 조회는 404 Not Found이고 JSON 문법이 틀리거나 읽을 수 없는 요청은 400 Bad Request이다. 이미 대여 중인 장비를 다시 대여하는 것은 현재 상태와 충돌하므로 409 Conflict이다. 형식이 지원되지 않는 본문은 415이다.

**(2)** `code`와 `message`처럼 클라이언트가 원인을 구분할 수 있는 약속된 항목을 JSON으로 둔다. 스택 트레이스, SQL, 서버 내부 경로 같은 내부 정보는 두지 않는다.

**(3)** 클라이언트가 상태 코드로 성공과 실패를 구분할 수 없고 캐시와 모니터링 도구도 실패를 놓친다. 오류는 의미에 맞는 상태 코드와 JSON 본문을 함께 보낸다. 검증 환경에서 404와 JSON 본문, 415와 400 응답을 확인했다.

## question: spring-03-q32
### solution
**(1)** form 로그인 설정에서는 로그인 화면으로 redirect하는 302 응답이고 API용으로 `authenticationEntryPoint`를 401로 설정하면 401로 응답한다.

**(2)** 인증은 되었지만 권한이 없으므로 403 Forbidden이다. 인증 실패(누구인지 모름)는 401이거나 로그인 화면이고 인가 실패(누구인지 알지만 허용되지 않음)는 403이다.

**(3)** 변경 요청에 CSRF 토큰이 없으면 필터가 403으로 거부한다. 보안 필터는 DispatcherServlet보다 앞에 있으므로 거부된 요청의 컨트롤러 메서드는 실행되지 않는다. 검증 환경에서 컨트롤러 호출이 0회임을 확인했다.
