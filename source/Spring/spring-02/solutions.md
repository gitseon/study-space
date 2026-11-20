## question: spring-02-q01
### solution
`@ConfigurationProperties(prefix = "room")`의 접두사 아래에서 `open-hour`는 완화된 바인딩 규칙에 따라 자바의 `openHour` 프로퍼티에 연결된다. `10`은 `int`로 변환되어 세터로 전달된다. 같은 키의 명령행 인자가 설정 파일의 값보다 우선한다. 검증 코드에서는 인자 없이 실행했을 때 9를, 인자와 함께 실행했을 때 10을 확인한다. 프로퍼티 이름을 연결하는 규칙과 설정 소스의 값을 고르는 우선순위를 구분해야 한다.
### choice-explanation: a
바인딩 대상은 맞다. 덮어쓰는 실행 인자가 없을 때 설정 파일의 9가 사용된다.
### choice-explanation: b
설정 키는 `openHour`와 연결되고 우선순위가 높은 실행 인자의 10이 사용된다.
### choice-explanation: c
서로 다른 설정 소스에 같은 키가 있을 수 있다. Boot가 우선순위에 따라 사용할 값을 정한다.
### choice-explanation: d
완화된 바인딩은 설정의 케밥 표기 `open-hour`와 자바의 카멜 표기 `openHour`를 연결한다.

## question: spring-02-q02
### solution
정답 근거: `assertEquals`의 첫 인자가 기대값이고 둘째 인자가 실제값이다. 풀이: 기대값 2와 실제값 3이므로 메시지의 `expected`에 2가 들어간다. 인자 순서를 바꾸면 메시지가 거꾸로 나와 원인을 잘못 짚게 된다. 검증 환경에서 실제 메시지를 확인했다.
### choice-explanation: a
기대값 2와 실제값 3을 순서대로 보여 준다.
### choice-explanation: b
두 값을 반대로 쓴 메시지이다. 기대값은 첫 인자이다.
### choice-explanation: c
두 값이 다르다는 사실과 맞지 않는 형식이다.
### choice-explanation: d
실제값 3은 맞지만 기대값이 3이라는 점이 틀렸다.

## question: spring-02-q03
### solution
정답 근거: 생성자가 먼저 실행되고 그 뒤에 필드 주입이 일어난다. `@PostConstruct`는 주입이 끝난 다음에 호출된다. 풀이: 생성자 안에서는 `helper`가 아직 null이고 초기화 콜백에서는 값이 있다. prototype 빈은 컨테이너가 만들어 건넨 뒤 관리하지 않으므로 닫을 때 `@PreDestroy`가 불리지 않는다. 검증 환경에서 이 순서를 확인했다.
### choice-explanation: a
생성자 시점에는 null이고 초기화 콜백에서는 주입된 상태이며 prototype의 소멸 콜백은 없다.
### choice-explanation: b
필드 주입은 생성자가 끝난 뒤라서 생성자 안에서 값이 있다는 설명이 틀렸다.
### choice-explanation: c
prototype 빈의 `@PreDestroy`는 컨테이너를 닫을 때 호출되지 않는다.
### choice-explanation: d
초기화 콜백은 생성자보다 늦게 호출된다.

## question: spring-02-q04
### solution
정답 근거: 기본 scope는 singleton이라 같은 빈을 여러 번 꺼내도 같은 인스턴스이다. prototype 빈은 꺼낼 때마다 새로 만든다. 풀이: singleton인 `Desk`의 생성자에는 주입이 한 번만 일어나므로 `injected`는 계속 같은 `Ticket`이다. `ObjectProvider`로 꺼낼 때마다 새 `Ticket`이 만들어진다. 검증 환경에서 네 값을 실행해 확인했다.
### choice-explanation: a
두 번째 비교는 서로 다른 prototype 인스턴스라 false이고 세 번째는 주입이 한 번뿐이라 true이다.
### choice-explanation: b
첫 비교의 기본 scope는 singleton이라 같은 인스턴스이다.
### choice-explanation: c
같은 singleton, 서로 다른 prototype, 한 번만 주입된 같은 인스턴스, 매번 다른 인스턴스 순서이다.
### choice-explanation: d
주입된 `injected`는 singleton 안에 고정되므로 세 번째가 false라는 설명이 틀렸다.

## question: spring-02-q05
### solution
정답 근거: 같은 타입의 후보가 여럿이고 다른 기준이 없으면 스프링은 주입 지점의 파라미터 이름과 같은 이름의 빈을 고른다. 풀이: 파라미터 이름 `smsNotifier`가 빈 이름과 같아 그 빈이 선택된다. 파라미터 이름을 `notifier`로 바꾸면 후보를 정하지 못해 `NoUniqueBeanDefinitionException`이 난다. 검증 환경에서 두 경우를 확인했다.
### choice-explanation: a
이름이 `mailNotifier`가 아니라 `smsNotifier`인 파라미터이므로 sms 쪽이다.
### choice-explanation: b
이름이 같은 빈이 선택된다.
### choice-explanation: c
이름이 일치하는 빈이 있으므로 후보를 정할 수 있어 실패하지 않는다.
### choice-explanation: d
필수 의존성은 null로 주입되지 않는다.

## question: spring-02-q06
### solution
정답 근거: advice는 프록시가 호출을 가로챌 때 실행된다. `daily()` 안에서 `summarize()`를 부르면 `this.summarize()`이므로 프록시를 거치지 않는다. 풀이: 밖에서 `daily()`를 부를 때 프록시는 `daily()`에 걸린 advice가 없어 그대로 넘긴다. 그 안의 호출은 advice 없이 실행되므로 `daily`, `summarize`만 남는다. 검증 환경에서 직접 호출과 비교해 확인했다.
### choice-explanation: a
`daily()`에는 advice가 없으므로 맨 앞에 advice가 나올 수 없다.
### choice-explanation: b
내부 호출은 프록시를 거치지 않아 `summarize` 앞의 advice도 실행되지 않는다.
### choice-explanation: c
advice가 실행되지 않는 데다 순서도 호출 흐름과 맞지 않는다.
### choice-explanation: d
내부 호출에는 advice가 적용되지 않는다.

## question: spring-02-q07
### solution
정답 근거: `@Around` advice에서 `proceed()`를 부르지 않으면 target 메서드가 실행되지 않는다. 풀이: advice가 `null`을 직접 반환하므로 호출자는 `null`을 받는다. `T`는 기록되지 않는다. 검증 환경에서 이 결과를 확인했다. 주의점: 이 성질을 이용하면 호출을 막을 수 있지만 의도하지 않은 경우에는 반환값 누락 오류가 된다.
### choice-explanation: a
target이 실행되지 않으므로 T도 5000도 나오지 않는다.
### choice-explanation: b
advice가 먼저 실행되므로 A가 기록되고 target은 실행되지 않는다.
### choice-explanation: c
target이 실행되지 않으므로 T가 기록된다는 설명이 틀렸다.
### choice-explanation: d
advice만 실행되고 반환값은 advice가 준 null이다.

## question: spring-02-q08
### solution
정답 근거: 경로 패턴은 맞지만 `abc`를 `int`로 바꿀 수 없으면 타입 변환 오류가 나고 400 Bad Request로 응답한다. 풀이: 핸들러는 찾았으므로 404가 아니고 핸들러 본문도 실행되지 않는다. 검증 환경에서 이 상태 코드를 확인했다. 흔한 실수: 경로가 달라서 404라고 생각하는 것이다. 404는 경로를 처리하는 핸들러가 없을 때이다.
### choice-explanation: a
핸들러를 찾았으므로 404가 아니다.
### choice-explanation: b
타입 변환 실패는 400이다.
### choice-explanation: c
변환에 실패해 핸들러가 실행되지 않으므로 200이 아니다.
### choice-explanation: d
서버 오류가 아니라 잘못된 요청으로 처리한다.

## question: spring-02-q09
### solution
정답 근거: 어노테이션 없이 객체를 파라미터로 받으면 `@ModelAttribute`가 붙은 것처럼 동작하고 모델에도 담긴다. 이름은 파라미터 이름이 아니라 타입 이름의 첫 글자를 소문자로 바꾼 것이다. 풀이: 타입이 `RoomForm`이므로 `roomForm`이다. 이름을 바꾸려면 `@ModelAttribute("form")`을 쓴다. 검증 환경에서 모델의 키를 확인했다.
### choice-explanation: a
파라미터 이름 `form`이 모델 이름이 되지 않는다.
### choice-explanation: b
`room`은 뷰 이름의 일부이고 모델 이름과 관계없다.
### choice-explanation: c
타입 이름의 첫 글자를 소문자로 바꾼 이름이다.
### choice-explanation: d
첫 글자는 대문자가 아니라 소문자이다.

## question: spring-02-q10
### solution
정답 근거: `addAttribute`의 값은 redirect 주소의 쿼리 스트링에 붙고 `addFlashAttribute`의 값은 쿼리에 붙지 않고 세션에 잠시 보관되었다가 다음 요청에서 모델로 옮겨진다. 풀이: 응답은 302이고 주소는 `/rooms/done?floor=3`이다. `message`는 flash 속성이다. 검증 환경에서 응답과 flash 맵을 확인했다.
### choice-explanation: a
`floor`는 `addAttribute`이므로 쿼리 스트링에 붙는다.
### choice-explanation: b
쿼리에 붙는 값과 flash로 가는 값을 구분한 설명이다.
### choice-explanation: c
flash 속성은 쿼리 스트링에 붙지 않는다.
### choice-explanation: d
redirect는 상태 코드 200이 아니라 302 응답이다.

## question: spring-02-q11
### solution
정답 근거: 같은 `@ControllerAdvice` 안에서 예외가 여러 핸들러에 맞으면 더 구체적인 타입의 핸들러가 선택된다. 풀이: `RoomNotFound`는 첫 핸들러의 타입과 정확히 같고 둘째 핸들러의 하위 타입이다. 구체적인 첫 핸들러가 선택되어 404와 `advice-specific`이 응답된다. 이 컨트롤러에는 자체 핸들러가 없으므로 advice가 처리한다. 검증 환경에서 결과를 확인했다.
### choice-explanation: a
상위 타입 핸들러는 더 구체적인 핸들러가 없을 때 쓰인다.
### choice-explanation: b
이 컨트롤러에는 자체 핸들러가 없어 `local` 응답이 나올 수 없다.
### choice-explanation: c
구체적인 타입의 핸들러가 선택된다.
### choice-explanation: d
예외에 맞는 핸들러가 있으므로 처리되지 않은 채 끝나지 않는다.

## question: spring-02-q12
### solution
정답 근거: 이 설정을 켜면 밑줄 표기 컬럼 이름이 camelCase 프로퍼티 이름에 매핑된다. 풀이: `reservation_id`는 `reservationId`에, `member_name`은 `memberName`에 들어가고 `people`은 이름이 같아 그대로 들어간다. 설정이 꺼져 있으면 `people`에만 값이 들어간다. 검증 환경에서 두 경우를 모두 확인했다.
### choice-explanation: a
설정이 꺼져 있을 때의 결과를 설명한 것이다.
### choice-explanation: b
이름이 같은 `people`은 설정과 관계없이 매핑된다.
### choice-explanation: c
설정이 켜져 있어 세 컬럼 모두 매핑된다.
### choice-explanation: d
맞는 프로퍼티가 없는 컬럼이 있어도 예외 없이 처리된다.

## question: spring-02-q13
### solution
정답 근거: `<id>`가 같은 행은 같은 부모 객체로 묶이고 자식 행은 `<collection>`의 목록에 모인다. 풀이: 1번 방의 두 행은 `room_id`가 같아 `Room` 하나로 묶이고 예약이 2개 담긴다. `LEFT JOIN`으로 자식이 없는 3번 방도 행이 하나 나오며 자식 값이 모두 null이면 목록은 비어 있다. 검증 환경에서 두 방과 `<collection>`을 쓰지 않은 매핑의 행 수를 확인했다.
### choice-explanation: a
컬렉션 매핑의 목록은 null이 아니라 비어 있는 목록이다.
### choice-explanation: b
같은 부모의 행은 하나로 묶이고 자식이 없으면 빈 목록이다.
### choice-explanation: c
`<id>`가 같은 부모 행은 방 객체 하나로 묶인다.
### choice-explanation: d
두 행이 모두 예약으로 담기고 자식이 없어도 예외가 나지 않는다.

## question: spring-02-q14
### solution
정답 근거: 빈 리스트이면 `<foreach>`가 아무것도 만들지 않지만 `open`과 `close`는 붙어 `IN ()`이 된다. 풀이: 이는 SQL 문법 오류이므로 예외가 발생한다. 호출하기 전에 빈 리스트를 걸러 내거나 `<if test="ids != null and !ids.isEmpty()">`로 감싼다. 검증 환경에서 `BadSqlGrammarException`을 확인했다.
### choice-explanation: a
조건이 맞지 않아 빈 결과가 되는 것이 아니라 SQL 자체가 만들어지지 않는다.
### choice-explanation: b
예외가 아니라 null이 반환된다는 설명이 틀렸다.
### choice-explanation: c
조건이 비어도 모든 행으로 바뀌지 않는다.
### choice-explanation: d
`IN ()`은 문법 오류이다.

## question: spring-02-q15
### solution
정답 근거: `outerSelf()` 안에서 부른 `innerTx()`는 `this.innerTx()`이므로 프록시를 거치지 않아 트랜잭션이 시작되지 않는다. 풀이: 그 호출의 insert는 자동 commit되어 남는다. 이어서 `innerTx()`를 직접 부르면 프록시를 거쳐 트랜잭션이 열리고 예외로 rollback되어 늘지 않는다. 결과는 3행에서 4행이 된다. 검증 환경에서 이 값을 확인했다.
### choice-explanation: a
자기 호출의 insert만 남아 4행이다.
### choice-explanation: b
자기 호출은 트랜잭션이 없어 insert가 취소되지 않는다.
### choice-explanation: c
직접 호출은 rollback되므로 한 행도 더해지지 않는다.
### choice-explanation: d
두 호출이 모두 남는다고 본 것이다.

## question: spring-02-q16
### solution
정답 근거: `REQUIRES_NEW`는 바깥 트랜잭션을 잠시 멈추고 새 트랜잭션을 시작해 따로 commit한다. 바깥은 런타임 예외로 rollback된다. 풀이: 예약 insert는 바깥 트랜잭션에 속해 취소되어 3행이다. 로그 insert는 안쪽 트랜잭션에서 이미 commit되어 1행이 남는다. 검증 환경에서 이 값을 확인했다.
### choice-explanation: a
로그가 함께 취소된다고 본 것이다. 안쪽은 따로 commit된다.
### choice-explanation: b
바깥은 취소되고 안쪽 로그는 남는다.
### choice-explanation: c
바깥의 예약이 취소되지 않았다고 본 것이다.
### choice-explanation: d
바깥도 안쪽도 반영된다고 본 것이다.

## question: spring-02-q17
### solution
정답 근거: `ResponseEntity`가 상태와 본문을 함께 정하고 `@RestControllerAdvice`의 반환값은 JSON 본문으로 쓰인다. 풀이: 상태는 404이고 본문은 `{"code":"RENTAL_NOT_FOUND","message":...}` 형태이다. 클라이언트는 상태 코드로 분기하고 본문의 코드로 원인을 구분한다. 검증 환경에서 상태, 콘텐츠 타입, 본문의 `code`를 확인했다.
### choice-explanation: a
오류인데 200으로 응답하면 상태 코드로 실패를 알 수 없다.
### choice-explanation: b
핸들러가 처리했으므로 기본 HTML 오류 화면으로 가지 않는다.
### choice-explanation: c
정한 상태와 JSON 본문이 그대로 응답된다.
### choice-explanation: d
예외를 핸들러가 처리했으므로 500이 아니다.

## question: spring-02-q18
### solution
정답 근거: CORS 검사는 요청의 `Origin`이 허용 목록에 있는지 본다. 목록에 있으면 `Access-Control-Allow-Origin`을 담아 응답하고 없으면 요청을 거부한다. 풀이: preflight가 허용되는 출처는 200과 허용 헤더를 받고 허용되지 않은 출처는 403이다. 차단하는 주체는 이 응답을 받은 브라우저이다. 검증 환경에서 두 출처와 출처 없는 요청의 응답을 확인했다.
### choice-explanation: a
허용된 출처만 헤더와 함께 통과하고 나머지는 거부된다.
### choice-explanation: b
허용 목록에 없는 출처에는 허용 헤더를 주지 않는다.
### choice-explanation: c
허용되지 않은 출처의 preflight는 거부되며 200이 아니다.
### choice-explanation: d
preflight의 `OPTIONS`는 CORS 설정이 처리하므로 405가 아니다.

## question: spring-02-q19
### solution
정답 근거: 기본 설정에서 로그아웃은 POST이고 변경 요청이므로 CSRF 토큰이 없으면 필터가 403으로 거부한다. 거부된 요청은 로그아웃 처리까지 가지 않는다. 풀이: 같은 세션으로 이어서 보호된 화면을 요청하면 계속 200이다. 토큰을 함께 보내면 `/`로 redirect되며 로그아웃된다. 검증 환경에서 토큰 없는 요청과 있는 요청을 모두 확인했다.
### choice-explanation: a
토큰이 없으면 로그아웃 처리가 실행되지 않는다.
### choice-explanation: b
거부된 요청은 로그아웃 처리까지 가지 않는다.
### choice-explanation: c
경로는 존재하므로 404가 아니다.
### choice-explanation: d
요청이 거부되어 로그인 상태가 그대로 남는다.

## question: spring-02-q20
### solution
정답 근거: `@AuthenticationPrincipal`은 인증된 사용자의 `UserDetails`를 파라미터로 넣어 준다. `roles("ADMIN")`은 권한 문자열 `ROLE_ADMIN`을 만든다. 풀이: 사용자 이름은 `root`이고 권한 목록은 `[ROLE_ADMIN]`이다. 검증 환경에서 로그인한 세션으로 요청해 응답을 확인했다.
### choice-explanation: a
이름과 접두사가 붙은 권한이 그대로 나온다.
### choice-explanation: b
`roles()`는 `ROLE_` 접두사를 붙이고 `USER`는 만들지도 않았다.
### choice-explanation: c
만든 역할은 `ADMIN` 하나이므로 `ROLE_USER`가 함께 붙지 않는다.
### choice-explanation: d
로그인한 사용자이므로 익명 사용자가 아니다.

## question: spring-02-q21
### solution
정답 근거: `hasRole("ADMIN")`은 권한 문자열 `ROLE_ADMIN`을 찾는다. 접두사 없는 `ADMIN`은 `hasAuthority("ADMIN")`이어야 맞는다. 풀이: 사용자는 인증되었지만 요구하는 권한을 갖지 않아 인가에 실패하고 403이 응답된다. 로그인 화면으로 가지 않는다. 검증 환경에서 이 결과를 확인했다.
### choice-explanation: a
접두사가 맞지 않아 접근이 허용되지 않는다.
### choice-explanation: b
이미 인증되었으므로 로그인 화면으로 이동하지 않는다.
### choice-explanation: c
401은 인증되지 않았을 때의 응답이다.
### choice-explanation: d
인증은 되었지만 권한이 맞지 않아 403이다.

## question: spring-02-q22
### solution
정답: RequiredArgsConstructor. 허용 표기: `@`를 붙인 `@RequiredArgsConstructor`도 정답이며 대소문자는 구분하지 않는다. 근거: 이 어노테이션은 초기화되지 않은 `final` 필드와 `@NonNull` 필드를 받는 생성자를 만든다. 그래서 생성자 주입 코드를 줄일 때 쓴다. 검증 환경에서 생성된 생성자의 파라미터 수를 확인했다.

## question: spring-02-q23
### solution
정답: @Autowired. 허용 표기: `@`를 뺀 `Autowired`도 정답이며 대소문자는 구분하지 않는다. 근거: 생성자가 하나이면 스프링이 그 생성자를 주입에 쓴다. 생성자가 둘 이상이면 어느 것을 쓸지 정해야 한다. 검증 환경에서 생성자가 하나인 경우와 기본 생성자가 함께 있는 경우를 확인했다.

## question: spring-02-q24
### solution
정답은 `프록시` 또는 `proxy`다. 대소문자는 구분하지 않는다. Target은 원래 업무 로직을 가진 객체다. Proxy는 호출자에게 노출되는 대리 객체로, 포인트컷에 해당하는 메서드 호출에서 advice를 적용하고 필요에 따라 target에 호출을 위임한다. 예를 들어 `@Around`가 `proceed()`를 호출하지 않으면 target 메서드는 실행되지 않는다. 검증 케이스에서는 주입받은 객체가 CGLIB 프록시임을 확인한다.

## question: spring-02-q25
### solution
정답은 `DispatcherServlet`이다. 대소문자는 구분하지 않는다. Spring MVC에 매핑된 요청은 서블릿 필터 체인을 거쳐 `DispatcherServlet`에 도달한다. 이 서블릿은 `HandlerMapping`에 핸들러 선택을 맡기고 `HandlerAdapter`를 통해 선택된 핸들러를 실행한다. 요청을 받는 서블릿과 실제 작업을 수행하는 컨트롤러의 역할을 구분해야 한다.

## question: spring-02-q26
### solution
정답: isEmpty. 허용 표기: 괄호를 붙인 `isEmpty()`도 정답이며 대소문자는 구분하지 않는다. 근거: 파일을 선택하지 않고 전송해도 `MultipartFile` 객체는 null이 아니다. 그래서 저장하기 전에 `isEmpty()`로 확인한다. 검증 환경에서 빈 파일과 파일이 있는 경우의 결과를 확인했다.

## question: spring-02-q27
### solution
정답: useGeneratedKeys. 허용 표기: 대소문자는 구분하지 않는다. 근거: 이 속성을 `true`로 두면 생성된 키가 `keyProperty`가 가리키는 프로퍼티에 채워진다. insert 메서드의 반환값은 키가 아니라 영향받은 행 수이다. 검증 환경에서 반환값 1과 채워진 키 4를 확인했다.

## question: spring-02-q28
### solution
정답: rollbackFor. 허용 표기: `rollbackFor=Exception.class`도 정답이며 대소문자는 구분하지 않는다. 근거: 기본은 `RuntimeException`과 `Error`만 rollback한다. 이 속성에 예외 타입을 주면 그 타입에도 rollback한다. 검증 환경에서 기본값과 이 속성을 준 경우의 행 수 차이를 확인했다.

## question: spring-02-q29
### solution
정답: /v3/api-docs. 허용 표기: 앞의 슬래시를 뺀 `v3/api-docs`도 정답이다. 근거: springdoc은 컨트롤러를 읽어 OpenAPI 명세를 이 경로에 JSON으로 제공하고 Swagger UI 화면이 이 명세를 읽는다. 이 문항은 공식 문서의 기본값을 근거로 하며 실행해 확인하지 않았다.

## question: spring-02-q30
### solution
정답은 `PasswordEncoder`다. 패키지명을 포함한 `org.springframework.security.crypto.password.PasswordEncoder`도 허용하며 대소문자는 구분하지 않는다. 비밀번호를 저장할 때 `encode`를 호출하고 로그인할 때 `matches`에 입력 비밀번호와 저장된 인코딩 값을 전달한다. `BCryptPasswordEncoder`는 이 인터페이스의 구현체다. BCrypt는 솔트를 사용하기 때문에 같은 비밀번호를 다시 인코딩한 문자열과 저장된 해시의 일치 여부로 검증하면 오류가 생길 수 있다.

## question: spring-02-q31
### solution
**(1)** Service 메서드에 둔다. 예약 저장과 자리 감소는 함께 성공하거나 함께 취소되어야 하는 한 업무 단위이고 그 단위를 아는 곳이 Service이기 때문이다. Mapper마다 걸면 SQL 하나씩만 보호된다.

**(2)** 안쪽 메서드가 같은 트랜잭션에 참여하므로 런타임 예외가 나온 시점에 트랜잭션은 rollback-only로 표시된다. 바깥이 예외를 잡아 정상 종료해도 마지막에 `UnexpectedRollbackException`이 나고 바깥의 변경까지 모두 취소된다.

**(3)** `REQUIRES_NEW`를 쓴다. 바깥 트랜잭션을 멈추고 새 트랜잭션으로 따로 commit하므로 바깥이 예외로 rollback되어도 실패 기록은 남는다. 실행해 보면 예약은 취소되고 로그는 1행이 남는다.

## question: spring-02-q32
### solution
**(1)** 내용이 모두 비면 `<where>`는 `WHERE` 자체를 만들지 않아 전체 행을 조회한다. 조회에서는 의도일 수 있지만 UPDATE나 DELETE에서 같은 일이 생기면 모든 행이 대상이 되므로 서비스에서 먼저 막아야 한다.

**(2)** `IN ()`이 되어 SQL 문법 오류로 예외가 발생한다. 호출하기 전에 빈 리스트를 걸러 내거나 `<if>`로 감싸서 쿼리를 만들지 않는다.

**(3)** `SET` 절이 비어 `UPDATE reservation WHERE ...` 같은 문법 오류가 난다. 바꿀 값이 없으면 쿼리를 보내지 않도록 서비스에서 확인한다.
