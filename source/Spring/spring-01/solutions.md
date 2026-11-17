## question: spring-01-q01
### solution
정답 근거: 프레임워크는 실행 흐름의 주도권을 쥐고 정해진 지점에서 개발자의 코드를 호출한다. 이것이 제어의 역전(IoC)이다. 풀이: 재사용할 수 있다는 점과 의존성으로 추가한다는 점은 둘의 공통점이라 구분 기준이 되지 못한다. 흔한 실수: 규모가 크면 프레임워크라고 생각하는 것이다. 기준은 크기가 아니라 누가 누구를 호출하느냐이다.
### choice-explanation: a
재사용할 수 있는 코드 묶음이라는 점은 라이브러리와 프레임워크 모두에 해당한다.
### choice-explanation: b
개발자의 코드가 기능을 골라 호출하는 것은 라이브러리의 사용 방식이다.
### choice-explanation: c
배포 형태와 추가 방법은 둘이 같다. Spring도 라이브러리도 의존성으로 추가한다.
### choice-explanation: d
프레임워크가 흐름을 쥐고 개발자의 코드를 호출한다. Spring MVC가 컨트롤러 메서드를 호출하는 것이 예이다.

## question: spring-01-q02
### solution
정답 근거: `@SpringBootApplication`에 포함된 `@ComponentScan`은 메인 클래스의 패키지와 그 하위 패키지만 찾는다. 풀이: `com.study.app.room`은 `com.study.app`의 하위라서 스캔되고 `com.study.batch`는 범위 밖이라 스캔되지 않는다. 흔한 실수: `@Service`만 붙이면 프로젝트 어디에 두어도 등록된다고 생각하는 것이다.
### choice-explanation: a
`com.study.batch`는 메인 클래스의 패키지 밖이라 스캔 대상이 아니다.
### choice-explanation: b
메인 클래스의 하위 패키지는 스캔 범위에 들어간다.
### choice-explanation: c
기준 패키지 `com.study.app`의 하위에 있는 `RoomService`만 등록된다.
### choice-explanation: d
스캔되는 쪽과 스캔되지 않는 쪽을 반대로 본 것이다.

## question: spring-01-q03
### solution
정답 근거: IoC는 객체의 생성과 호출의 주도권이 개발자의 코드에서 컨테이너로 넘어간다는 원칙이다. DI는 필요한 객체를 밖에서 넣어 주어 그 원칙을 구현하는 방법이다. 흔한 실수: 두 용어를 같은 뜻으로 쓰는 것이다.
### choice-explanation: a
원칙(IoC)과 구현 방법(DI)의 관계를 바르게 설명했다.
### choice-explanation: b
원칙과 방법을 뒤바꾼 설명이다.
### choice-explanation: c
두 개념은 설정을 쓰는 위치로 나뉘지 않는다. 설정 클래스와 어노테이션 모두 DI에 쓰인다.
### choice-explanation: d
두 개념은 빈의 scope와 관계가 없다.

## question: spring-01-q04
### solution
정답 근거: `@Bean` 메서드로 등록한 빈의 기본 이름은 메서드 이름이고 `@Component` 계열은 클래스 이름의 첫 글자를 소문자로 바꾼 이름이다. 풀이: 메서드 이름이 `studyClock`이므로 첫 빈은 `studyClock`이고 클래스 `RoomPolicy`는 `roomPolicy`가 된다. 흔한 실수: `@Bean`의 이름을 반환 타입에서 만든다고 생각하는 것이다.
### choice-explanation: a
메서드 이름과 첫 글자를 소문자로 바꾼 클래스 이름이다.
### choice-explanation: b
`@Bean`의 이름은 반환 타입 `Clock`이 아니라 메서드 이름에서 온다.
### choice-explanation: c
`@Component`의 이름은 클래스 이름 그대로가 아니라 첫 글자를 소문자로 바꾼다.
### choice-explanation: d
두 이름 모두 규칙과 다르다.

## question: spring-01-q05
### solution
정답 근거: 주입 지점의 `@Qualifier`는 `@Primary`보다 우선한다. 풀이: `@Primary`는 기준이 없을 때 쓰는 기본 후보이고 `@Qualifier("fixedDiscount")`는 이 주입 지점에서 쓸 빈을 이름으로 지정한다. 더 구체적인 지정이 이긴다. 흔한 실수: `@Primary`가 있으면 항상 그 빈이 주입된다고 생각하는 것이다.
### choice-explanation: a
`@Primary`는 `@Qualifier`가 없을 때의 기본 후보이다.
### choice-explanation: b
`@Qualifier`로 이름을 지정한 빈이 주입된다.
### choice-explanation: c
후보가 둘이어도 `@Qualifier`로 하나가 정해지므로 실패하지 않는다.
### choice-explanation: d
주입은 빈을 만들 때 한 번 일어나며 번갈아 바뀌지 않는다.

## question: spring-01-q06
### solution
정답 근거: 어떤 join point에 부가 기능을 적용할지 고르는 식이 pointcut이다. 풀이: `@Before` 메서드 자체는 실행할 부가 기능인 advice이고 pointcut과 advice를 묶은 모듈이 aspect이다. weaving은 target에 aspect를 엮는 과정이다.
### choice-explanation: a
advice는 끼어들어 실행할 부가 기능과 그 시점이다. `logStart()` 메서드가 advice이다.
### choice-explanation: b
join point는 advice가 끼어들 수 있는 지점이다. 적용할 지점을 고르는 조건이 아니라 그 후보이다.
### choice-explanation: c
적용할 대상을 고르는 식이 pointcut이다.
### choice-explanation: d
weaving은 target에 aspect를 엮는 과정이다.

## question: spring-01-q07
### solution
정답 근거: 같은 aspect 안에서는 Around의 앞부분, Before, target 순으로 들어가고 AfterReturning, After, Around의 뒷부분 순으로 나온다. 풀이: `proceed()`를 부르기 전의 `A1`이 가장 먼저 나오고 `proceed()` 안에서 `B`와 `T`가 실행된다. 반환 뒤에 `R`과 `F`가 차례로 나오고 `finally`의 `A2`가 마지막이다. 주의점: 이 순서는 검증 환경에서 실행해 확인한 결과이며 예외가 나오면 `R` 자리에 AfterThrowing이 실행된다.
### choice-explanation: a
Around는 Before보다 바깥에서 감싸므로 `A1`이 `B`보다 먼저이고 `A2`가 가장 나중이다.
### choice-explanation: b
Around가 가장 바깥에서 감싸고 그 안에서 Before, target, AfterReturning, After 순서로 실행된다.
### choice-explanation: c
AfterReturning이 After보다 먼저 실행된다.
### choice-explanation: d
Around의 앞부분은 Before보다 먼저 실행된다.

## question: spring-01-q08
### solution
정답 근거: 경로가 맞는 핸들러는 있지만 요청한 HTTP 메서드를 처리하는 핸들러가 없으면 405 Method Not Allowed이다. 풀이: `/rooms`에는 GET 핸들러만 있다. DELETE는 경로는 맞고 메서드가 맞지 않는다. 흔한 실수: 맞는 핸들러가 없으면 모두 404라고 생각하는 것이다. 404는 경로 자체가 없을 때이다.
### choice-explanation: a
400은 필수 파라미터가 없거나 값을 변환할 수 없을 때이다. 메서드가 맞지 않으면 바인딩 단계까지 가지 않는다.
### choice-explanation: b
경로는 있고 HTTP 메서드만 맞지 않으므로 405이다.
### choice-explanation: c
404는 `/rooms` 경로를 처리하는 핸들러가 하나도 없을 때이다.
### choice-explanation: d
DELETE를 처리하는 핸들러가 없어 실행되지 않는다.

## question: spring-01-q09
### solution
정답 근거: `@RequestParam`은 기본이 필수이다. 값이 없으면 핸들러를 실행하지 않고 400 Bad Request로 응답한다. 풀이: 경로와 메서드는 맞으므로 핸들러는 찾는다. 그러나 `page`가 없어 바인딩에 실패한다. 선택 값으로 받으려면 `required = false`나 `defaultValue`를 쓴다. 흔한 실수: 기본형이라 0이 들어간다고 생각하는 것이다.
### choice-explanation: a
기본값을 지정하지 않았으므로 0이 대신 들어가지 않는다.
### choice-explanation: b
`int`는 null을 담을 수 없고 필수 파라미터가 없으면 실행 자체가 되지 않는다.
### choice-explanation: c
경로와 HTTP 메서드가 맞으므로 핸들러는 찾는다. 404가 아니다.
### choice-explanation: d
필수 파라미터가 없어 400으로 응답한다.

## question: spring-01-q10
### solution
정답 근거: `@Controller`가 반환한 문자열은 뷰 이름이다. ViewResolver가 prefix와 suffix를 붙여 JSP 경로를 만들고 그 JSP로 forward한다. 풀이: `/WEB-INF/views/` + `room/detail` + `.jsp`가 된다. 흔한 실수: 반환한 문자열이 그대로 응답 본문이 된다고 생각하는 것이다. 그것은 `@ResponseBody`나 `@RestController`일 때이다.
### choice-explanation: a
prefix와 suffix를 붙인 JSP로 forward한다.
### choice-explanation: b
redirect는 반환값이 `redirect:`로 시작할 때이다.
### choice-explanation: c
본문에 그대로 쓰는 것은 `@ResponseBody`가 있을 때이다.
### choice-explanation: d
뷰 이름에는 prefix가 붙으며 정적 파일을 찾는 것이 아니다.

## question: spring-01-q11
### solution
정답 근거: `preHandle`은 등록한 순서로, `postHandle`과 `afterCompletion`은 등록의 반대 순서로 호출된다. 풀이: 요청이 들어갈 때 1과 2를 차례로 지나고 나올 때는 2와 1의 순서로 되돌아 나온다. `postHandle`이 모두 끝난 뒤 뷰 렌더링을 거쳐 `afterCompletion`이 불린다. 주의점: 핸들러가 예외를 던지면 `postHandle`은 건너뛰고 `afterCompletion`만 불린다.
### choice-explanation: a
`postHandle`과 `afterCompletion`은 등록의 반대 순서이다.
### choice-explanation: b
`afterCompletion`도 `postHandle`처럼 반대 순서로 불린다.
### choice-explanation: c
`preHandle`은 등록한 순서대로 1이 먼저이다.
### choice-explanation: d
들어갈 때는 등록 순서이고 나올 때는 반대 순서이다.

## question: spring-01-q12
### solution
정답 근거: MyBatis는 Mapper 인터페이스의 프록시 구현체를 실행 중에 만들어 스프링 빈으로 등록한다. 풀이: 프록시는 호출된 메서드 이름과 같은 `id`의 SQL을 매퍼 XML에서 찾아 실행한다. 그래서 XML의 `namespace`는 인터페이스의 전체 이름과 같아야 한다. 흔한 실수: XML이 클래스로 바뀐다고 생각하는 것이다.
### choice-explanation: a
Lombok은 접근자와 생성자 같은 코드를 만들 뿐 Mapper의 구현체를 만들지 않는다.
### choice-explanation: b
MyBatis가 만든 프록시 객체가 주입된다.
### choice-explanation: c
인터페이스는 그 자체로 객체를 만들 수 없다. 구현체가 필요하다.
### choice-explanation: d
XML은 클래스로 변환되지 않는다. 실행 중에 읽혀 SQL로 쓰인다.

## question: spring-01-q13
### solution
정답 근거: `${}`는 문자열을 SQL에 그대로 끼워 넣고 `#{}`는 `?` 자리에 값으로 바인딩한다. 풀이: `findA`의 조건은 `member_name = 'x' OR '1'='1'`이 되어 항상 참이므로 3행이 모두 나온다. `findB`는 문자열 전체를 이름 값 하나로 비교하므로 같은 이름이 없어 0행이다. 주의점: 이것이 SQL Injection이며 값에는 `#{}`를 쓴다.
### choice-explanation: a
`${}`는 조건을 바꿔 전체가 조회되고 `#{}`는 값으로만 비교한다.
### choice-explanation: b
두 표기의 동작을 반대로 본 것이다.
### choice-explanation: c
`${}`에 넣은 문자열은 SQL의 일부가 되어 조건을 항상 참으로 만든다.
### choice-explanation: d
`#{}`는 값을 바인딩하므로 조건이 바뀌지 않는다.

## question: spring-01-q14
### solution
정답 근거: `resultType`은 컬럼 이름과 같은 이름의 프로퍼티에만 값을 넣는다. 풀이: `people`은 이름이 같아 값이 들어간다. `reservation_id`와 `member_name`은 `reservationId`, `memberName`과 이름이 달라 버려지고 두 프로퍼티는 null로 남는다. 해결 방법은 별칭을 쓰거나 `map-underscore-to-camel-case`를 켜거나 `resultMap`을 쓰는 것이다. 흔한 실수: 이름이 맞지 않으면 예외가 난다고 생각하는 것이다.
### choice-explanation: a
밑줄 표기 컬럼은 설정 없이 camelCase 프로퍼티에 들어가지 않는다.
### choice-explanation: b
이름이 같은 `people`만 매핑된다.
### choice-explanation: c
이름이 같은 컬럼은 매핑되므로 `people`에는 값이 있다.
### choice-explanation: d
맞는 프로퍼티가 없는 컬럼은 오류 없이 버려진다.

## question: spring-01-q15
### solution
정답 근거: 함께 성공하거나 함께 취소되어야 하는 업무 단위를 아는 곳이 Service이다. 풀이: 예약 저장과 자리 감소는 SQL이 둘이다. Mapper 메서드마다 트랜잭션을 걸면 SQL 하나씩만 보호되어 하나만 반영되는 상태가 생길 수 있다. Service 메서드에 걸면 두 SQL이 한 트랜잭션에 들어간다.
### choice-explanation: a
인터페이스에도 어노테이션을 붙일 수 있다. 이유는 업무 단위에 있다.
### choice-explanation: b
요청은 Controller가 먼저 받는다. 실행 순서나 연결 시점이 이유가 아니다.
### choice-explanation: c
업무 단위의 경계가 Service 메서드에 있다.
### choice-explanation: d
프록시는 Service가 아닌 빈에도 만들 수 있다.

## question: spring-01-q16
### solution
정답 근거: `@Transactional`은 기본으로 `RuntimeException`과 `Error`에만 rollback하고 checked 예외에는 commit한다. 풀이: `IllegalStateException`은 런타임 예외라서 `runtime()`의 insert는 취소된다. `IOException`은 checked 예외라서 `checked()`의 insert는 commit되어 4행이 된다. checked 예외에도 rollback하려면 `rollbackFor = Exception.class`를 쓴다. 흔한 실수: 예외가 나오면 종류와 관계없이 rollback된다고 생각하는 것이다.
### choice-explanation: a
checked 예외는 기본 설정에서 rollback을 일으키지 않는다.
### choice-explanation: b
런타임 예외만 rollback되고 checked 예외의 변경은 남는다.
### choice-explanation: c
rollback되는 쪽과 commit되는 쪽을 반대로 본 것이다.
### choice-explanation: d
런타임 예외가 나온 트랜잭션은 rollback된다.

## question: spring-01-q17
### solution
정답 근거: POST는 멱등하지 않다. 보낼 때마다 새 자원이 만들어질 수 있다. 풀이: PUT은 보낸 내용으로 전체를 교체하므로 여러 번 보내도 결과가 같다. DELETE는 이미 지워진 자원을 다시 지워도 서버 상태가 같다. GET은 상태를 바꾸지 않는다. 주의점: 멱등은 응답 코드가 같다는 뜻이 아니라 서버 상태가 같다는 뜻이다.
### choice-explanation: a
POST를 두 번 보내면 대여가 두 건 등록될 수 있다.
### choice-explanation: b
PUT은 같은 내용으로 다시 교체해도 상태가 같다.
### choice-explanation: c
DELETE는 두 번째 요청 뒤에도 자원이 없는 상태로 같다.
### choice-explanation: d
GET은 서버 상태를 바꾸지 않는 안전한 메서드이다.

## question: spring-01-q18
### solution
정답 근거: `ResponseEntity.created(uri)`는 상태 코드를 201 Created로 정하고 넘긴 URI를 `Location` 헤더에 넣는다. 풀이: 자원을 만든 POST 응답은 201과 새 자원의 주소를 함께 알린다. `body(created)`는 본문을 더할 뿐 상태 코드를 바꾸지 않는다. 흔한 실수: 객체를 본문에 담으면 200이라고 생각하는 것이다. 200은 `ResponseEntity`를 쓰지 않고 객체만 반환할 때의 기본값이다.
### choice-explanation: a
`created()`는 200이 아니라 201을 정하고 `Location`도 넣는다.
### choice-explanation: b
`Location` 헤더는 있지만 상태 코드는 201이다.
### choice-explanation: c
넘긴 URI가 `Location` 헤더에 들어간다.
### choice-explanation: d
201 Created와 새 자원의 주소를 담은 `Location` 헤더가 함께 간다.

## question: spring-01-q19
### solution
정답 근거: Spring Security는 서블릿 필터로 동작하고 필터는 DispatcherServlet보다 앞에 있다. 풀이: 요청은 `SecurityFilterChain`의 필터를 먼저 지난다. 인증되지 않은 요청은 여기서 로그인 화면으로 보내지거나 401로 끝나므로 컨트롤러와 인터셉터에 닿지 않는다. 흔한 실수: 인증 검사가 컨트롤러 안이나 인터셉터에서 이루어진다고 생각하는 것이다.
### choice-explanation: a
인증 검사는 컨트롤러 실행 전에 필터에서 끝난다.
### choice-explanation: b
URL 규칙의 인증 검사는 인터셉터가 아니라 보안 필터가 한다.
### choice-explanation: c
필터 단계에서 막혀 컨트롤러 메서드는 호출되지 않는다.
### choice-explanation: d
실행되지 않는 것은 맞지만 막는 주체는 AOP 프록시가 아니라 서블릿 필터이다.

## question: spring-01-q20
### solution
정답 근거: 누구인지 확인되지 않은 요청은 인증 실패로 401이고 누구인지는 알지만 권한이 모자란 요청은 인가 실패로 403이다. 풀이: 로그인하지 않은 요청은 설정한 `authenticationEntryPoint`가 401로 답한다. `USER` 권한 사용자는 인증은 되었지만 `ADMIN` 역할이 없어 403이다. 흔한 실수: 접근이 거부되면 모두 403이라고 생각하는 것이다.
### choice-explanation: a
로그인하지 않은 요청은 인증 실패이므로 401이다.
### choice-explanation: b
로그인한 사용자의 권한 부족은 인가 실패이므로 403이다.
### choice-explanation: c
인증 실패는 401이고 인가 실패는 403이다.
### choice-explanation: d
두 코드의 뜻을 반대로 본 것이다.

## question: spring-01-q21
### solution
정답 근거: 인가 규칙은 위에서부터 처음 맞는 것 하나만 적용된다. 풀이: `/admin/reports/daily`는 첫 규칙 `/**`에 먼저 맞아 `permitAll()`이 적용된다. 아래의 `hasRole("ADMIN")` 규칙은 검사되지 않으므로 컨트롤러가 실행되어 200으로 응답한다. 올바른 순서는 좁은 규칙을 위에 두고 넓은 규칙을 마지막에 두는 것이다. 흔한 실수: 더 구체적인 규칙이 순서와 관계없이 우선한다고 생각하는 것이다.
### choice-explanation: a
첫 규칙이 모두 허용하므로 인증을 요구하지 않는다.
### choice-explanation: b
인증을 요구하는 규칙에 닿지 않으므로 401이 아니다.
### choice-explanation: c
`hasRole("ADMIN")` 규칙은 앞의 규칙에 가려 적용되지 않는다.
### choice-explanation: d
먼저 맞은 `permitAll()`이 적용되어 요청이 그대로 처리된다.

## question: spring-01-q22
### solution
정답: Logback. 허용 표기: 대소문자는 구분하지 않으며 한글 `로그백`도 정답이다. 근거: Boot의 기본 로깅 starter가 SLF4J의 구현체로 Logback을 가져온다. 코드에서는 SLF4J의 `Logger`만 쓰므로 구현체를 바꿔도 코드를 고치지 않는다.

## question: spring-01-q23
### solution
정답: singleton. 허용 표기: 대소문자는 구분하지 않으며 한글 `싱글톤`과 `싱글턴`도 정답이다. 근거: scope의 기본값은 singleton이며 같은 빈을 여러 번 주입받아도 같은 인스턴스이다. 주의점: 그래서 요청마다 달라지는 값을 빈의 필드에 두면 모든 요청이 그 값을 공유한다.

## question: spring-01-q24
### solution
정답: `..` 허용 표기: 괄호를 붙인 `(..)`도 정답이다. 근거: 파라미터 자리의 `..`는 0개 이상의 모든 파라미터를 뜻한다. `*`는 파라미터가 정확히 하나일 때만 맞는다. 검증 환경에서 `find*(*)`는 파라미터가 하나인 메서드에만, `find*(..)`는 개수와 관계없이 적용되는 것을 확인했다.

## question: spring-01-q25
### solution
정답: PRG. 허용 표기: `Post-Redirect-Get`과 `Post Redirect Get`, `PRG 패턴`도 정답이며 대소문자는 구분하지 않는다. 근거: POST 처리 뒤 redirect 응답을 보내면 브라우저의 마지막 요청이 GET이 된다. 새로 고침은 마지막 요청을 다시 보내므로 등록이 반복되지 않는다.

## question: spring-01-q26
### solution
정답: BindingResult. 허용 표기: 대소문자는 구분하지 않는다. 근거: 검증 대상 바로 뒤에 `BindingResult`가 있으면 오류가 그 객체에 담기고 핸들러가 실행된다. 없으면 검증 실패가 예외가 되어 핸들러가 실행되지 않고 400으로 응답한다. 검증 환경에서 두 경우를 실행해 확인했다.

## question: spring-01-q27
### solution
정답: where. 허용 표기: 꺾쇠를 붙인 `<where>`도 정답이며 대소문자는 구분하지 않는다. 근거: `<where>` 안의 `<if>`가 모두 거짓이면 `WHERE` 자체를 만들지 않는다. 일부만 참이면 맨 앞의 `AND`를 지워 문법에 맞는 SQL이 된다.

## question: spring-01-q28
### solution
정답: REQUIRED. 허용 표기: `Propagation.REQUIRED`도 정답이며 대소문자는 구분하지 않는다. 근거: `propagation`의 기본값은 `REQUIRED`이다. 그래서 `@Transactional` 메서드가 다른 `@Transactional` 메서드를 다른 빈을 통해 부르면 두 메서드는 한 트랜잭션에서 실행된다.

## question: spring-01-q29
### solution
정답: @RequestBody. 허용 표기: `@`를 뺀 `RequestBody`도 정답이며 대소문자는 구분하지 않는다. 근거: `@RequestBody`가 붙은 파라미터는 요청 본문을 메시지 컨버터로 변환해 받는다. 검증 환경에서 `Content-Type`이 `application/json`이 아니면 415, JSON 문법이 틀리거나 본문이 없으면 400으로 응답하는 것을 확인했다.

## question: spring-01-q30
### solution
정답: loadUserByUsername. 허용 표기: 괄호를 붙인 `loadUserByUsername()`도 정답이며 대소문자는 구분하지 않는다. 근거: 이 메서드는 사용자 이름으로 `UserDetails`를 조회해 돌려주고 사용자가 없으면 `UsernameNotFoundException`을 던진다. 비밀번호 비교는 이 메서드가 아니라 Provider가 `PasswordEncoder`로 한다.

## question: spring-01-q31
### solution
**(1)** 의존성을 `final` 필드에 담을 수 있어 객체가 만들어진 뒤 바뀌지 않는다. 또 의존성 없이는 생성자를 호출할 수 없으므로 누락이 바로 드러나고 컨테이너 없이 테스트할 때도 생성자로 가짜 객체를 넣을 수 있다.

**(2)** 쓰지 않아도 된다. 생성자가 하나뿐이면 스프링이 그 생성자로 의존성을 주입한다.

**(3)** 서로를 만들려면 상대가 먼저 있어야 하므로 어느 쪽도 만들 수 없다. 이 순환 의존은 애플리케이션이 시작할 때 빈 생성 오류로 드러나며 요청을 처리하는 중에 뒤늦게 나타나지 않는다. 한쪽의 의존을 없애도록 책임을 나누어 해결한다.

## question: spring-01-q32
### solution
**(1)** 모든 요청은 Front Controller인 DispatcherServlet이 먼저 받는다. DispatcherServlet은 HandlerMapping에 물어 요청 URL과 HTTP 메서드에 맞는 핸들러를 찾고 HandlerAdapter를 통해 그 핸들러를 실행한다. HandlerAdapter는 `@PathVariable` 같은 파라미터를 바인딩해 넘긴다.

**(2)** 핸들러는 Service를 호출해 스터디실 정보를 얻고 화면에 필요한 값을 Model에 담은 뒤 뷰 이름을 반환한다.

**(3)** ViewResolver가 뷰 이름에 prefix와 suffix를 붙여 실제 JSP를 정한다. View가 Model의 값으로 화면을 만들어 응답한다.
