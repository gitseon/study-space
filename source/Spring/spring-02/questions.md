## question: spring-02-q01
```json
{
  "title": "같은 키가 설정 파일과 실행 인자에 모두 있을 때",
  "topics": [
    "foundation-boot"
  ],
  "tags": [
    "config-properties"
  ],
  "group": "foundation-boot",
  "type": "mc",
  "id": "spring-02-q01",
  "revision": 1,
  "sourceRefs": [
    "SPR-L03 설정 파일 p.10",
    "SPR-S05 설정 파일 p.40",
    "spring-concepts Part 2"
  ],
  "difficulty": 2,
  "correctChoiceId": "b"
}
```
### stem
`application.properties`에 `room.open-hour=9`가 있고 애플리케이션을 `--room.open-hour=10` 인자와 함께 실행했다. `open-hour` 값을 `RoomProps`에 바인딩했을 때 `openHour`의 값은?
### choice: a
설정 파일의 9가 쓰인다
### choice: b
실행 인자의 10이 쓰인다
### choice: c
두 값이 충돌해 시작에 실패한다
### choice: d
두 값을 더한 19가 쓰인다

## question: spring-02-q02
```json
{
  "title": "assertEquals의 인자 순서와 실패 메시지",
  "topics": [
    "foundation-boot"
  ],
  "tags": [
    "junit-test"
  ],
  "group": "foundation-boot",
  "type": "mc",
  "id": "spring-02-q02",
  "revision": 1,
  "sourceRefs": [
    "SPR-L01 JUnit 테스트 p.30",
    "SPR-S02 JUnit 테스트 p.25",
    "spring-concepts Part 12"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
다음 JUnit 5 테스트에서 `calc()`가 3을 반환해 단언이 실패했다. 실패 메시지는?
```java
@Test
void countIsTwo() {
    assertEquals(2, calc());
}
```
### choice: a
`expected: <2> but was: <3>`
### choice: b
`expected: <3> but was: <2>`
### choice: c
`expected: <2> and was: <2>`
### choice: d
`expected: <3> but was: <3>`

## question: spring-02-q03
```json
{
  "title": "필드 주입 빈의 생성자와 초기화 콜백 시점",
  "topics": [
    "di-bean"
  ],
  "tags": [
    "bean-lifecycle"
  ],
  "group": "di-bean",
  "type": "mc",
  "id": "spring-02-q03",
  "revision": 1,
  "sourceRefs": [
    "SPR-S03 빈 관리 p.55",
    "spring-concepts Part 3"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
다음 코드를 컨테이너로 실행하고 닫았다. 출력된 이벤트의 순서는? `Helper`는 `@Component`이고 `ProtoLifecycle`은 prototype 빈으로 한 번 꺼냈다.
```java
@Component
class Lifecycle {
    @Autowired Helper helper;

    Lifecycle() {
        log("constructor:" + (helper == null ? "null" : "set"));
    }

    @PostConstruct
    void init() {
        log("postConstruct:" + (helper == null ? "null" : "set"));
    }

    @PreDestroy
    void close() {
        log("preDestroy");
    }
}
```
### choice: a
constructor:null → postConstruct:set → proto-postConstruct → use → preDestroy
### choice: b
constructor:set → postConstruct:set → proto-postConstruct → use → preDestroy
### choice: c
constructor:null → postConstruct:set → proto-postConstruct → use → preDestroy → proto-preDestroy
### choice: d
postConstruct:set → constructor:null → proto-postConstruct → use → preDestroy

## question: spring-02-q04
```json
{
  "title": "singleton 빈에 prototype 빈을 주입했을 때",
  "topics": [
    "di-bean"
  ],
  "tags": [
    "bean-scope"
  ],
  "group": "di-bean",
  "type": "mc",
  "id": "spring-02-q04",
  "revision": 1,
  "sourceRefs": [
    "SPR-S05 빈 scope p.45",
    "spring-concepts Part 3"
  ],
  "difficulty": 2,
  "correctChoiceId": "c"
}
```
### stem
`Ticket`은 prototype 빈이고 `Desk`는 singleton 빈이다. 다음 네 비교의 결과를 순서대로 나열한 것은?
```java
Desk desk = ctx.getBean(Desk.class);
// Desk(Ticket injected, ObjectProvider<Ticket> provider)
log(ctx.getBean(Counter.class) == ctx.getBean(Counter.class)); // Counter는 기본 scope
log(ctx.getBean(Ticket.class) == ctx.getBean(Ticket.class));
log(ctx.getBean(Desk.class).injected == desk.injected);
log(desk.provider.getObject() == desk.provider.getObject());
```
### choice: a
true, true, false, true
### choice: b
false, false, true, false
### choice: c
true, false, true, false
### choice: d
true, false, false, true

## question: spring-02-q05
```json
{
  "title": "파라미터 이름과 같은 이름의 빈 선택",
  "topics": [
    "di-bean"
  ],
  "tags": [
    "bean-selection"
  ],
  "group": "di-bean",
  "type": "mc",
  "id": "spring-02-q05",
  "revision": 1,
  "sourceRefs": [
    "SPR-S03 DI p.45",
    "spring-concepts Part 3"
  ],
  "difficulty": 2,
  "correctChoiceId": "b"
}
```
### stem
`Notifier` 타입의 빈이 둘이고 이름은 `mailNotifier`와 `smsNotifier`이다. 둘 다 `@Primary`나 `@Qualifier`는 없다. 다음 생성자 파라미터에 주입되는 빈은?
```java
@Component
class ByName {
    final Notifier notifier;

    ByName(Notifier smsNotifier) {
        this.notifier = smsNotifier;
    }
}
```
### choice: a
`mailNotifier`가 주입된다
### choice: b
`smsNotifier`가 주입된다
### choice: c
후보가 둘이라 시작할 때 실패한다
### choice: d
null이 주입된 채로 시작한다

## question: spring-02-q06
```json
{
  "title": "같은 클래스 안에서 부른 메서드의 advice",
  "topics": [
    "aop-proxy"
  ],
  "tags": [
    "proxy-limits"
  ],
  "group": "aop-proxy",
  "type": "mc",
  "id": "spring-02-q06",
  "revision": 1,
  "sourceRefs": [
    "SPR-L04 프록시 p.15",
    "SPR-S06 AOP 동작 p.15",
    "spring-concepts Part 4"
  ],
  "difficulty": 3,
  "correctChoiceId": "d"
}
```
### stem
`summarize()`에만 `@Before` advice가 걸려 있다. 밖에서 `reportService.daily()`를 호출했을 때 이벤트 순서는?
```java
@Component
public class ReportService {
    public void daily() {
        log("daily");
        summarize();
    }

    public void summarize() {
        log("summarize");
    }
}
```
### choice: a
advice, daily, summarize
### choice: b
daily, advice, summarize
### choice: c
advice, summarize, daily
### choice: d
daily, summarize

## question: spring-02-q07
```json
{
  "title": "proceed를 부르지 않는 Around",
  "topics": [
    "aop-proxy"
  ],
  "tags": [
    "advice-types"
  ],
  "group": "aop-proxy",
  "type": "mc",
  "id": "spring-02-q07",
  "revision": 1,
  "sourceRefs": [
    "SPR-L04 advice p.25",
    "SPR-S06 advice p.35",
    "spring-concepts Part 4"
  ],
  "difficulty": 2,
  "correctChoiceId": "d"
}
```
### stem
`price()`는 `T`를 기록하고 5000을 반환한다. 다음 aspect가 적용된 상태에서 호출했을 때 기록된 이벤트와 반환값은?
```java
@Around("execution(* PriceService.price(..))")
public Object around(ProceedingJoinPoint pjp) {
    log("A");
    return null;
}
```
### choice: a
A와 T가 기록되고 5000이 반환된다
### choice: b
T만 기록되고 5000이 반환된다
### choice: c
A와 T가 기록되고 null이 반환된다
### choice: d
A만 기록되고 null이 반환된다

## question: spring-02-q08
```json
{
  "title": "변환할 수 없는 경로 변수",
  "topics": [
    "mvc-binding"
  ],
  "tags": [
    "argument-binding"
  ],
  "group": "mvc-binding",
  "type": "mc",
  "id": "spring-02-q08",
  "revision": 1,
  "sourceRefs": [
    "SPR-L06 인자 바인딩 p.10",
    "SPR-S07 인자 바인딩 p.35",
    "spring-concepts Part 5"
  ],
  "difficulty": 2,
  "correctChoiceId": "b"
}
```
### stem
핸들러는 `@GetMapping("/rooms/{roomId}")`에 `@PathVariable int roomId`를 받는다. `GET /rooms/abc` 요청의 응답 상태 코드는?
### choice: a
404
### choice: b
400
### choice: c
200
### choice: d
500

## question: spring-02-q09
```json
{
  "title": "어노테이션 없는 DTO 파라미터의 모델 이름",
  "topics": [
    "mvc-binding"
  ],
  "tags": [
    "model-view"
  ],
  "group": "mvc-binding",
  "type": "mc",
  "id": "spring-02-q09",
  "revision": 1,
  "sourceRefs": [
    "SPR-L05 Controller와 응답 p.30",
    "SPR-S07 Model과 View p.50",
    "spring-concepts Part 5"
  ],
  "difficulty": 2,
  "correctChoiceId": "c"
}
```
### stem
다음 핸들러가 `room/form`을 반환한다. JSP에서 `RoomForm` 객체를 읽을 때 쓰는 이름은?
```java
@GetMapping("/rooms/form")
public String form(RoomForm form) {
    return "room/form";
}
```
### choice: a
`form`
### choice: b
`room`
### choice: c
`roomForm`
### choice: d
`RoomForm`

## question: spring-02-q10
```json
{
  "title": "리다이렉트에 실리는 값",
  "topics": [
    "mvc-binding"
  ],
  "tags": [
    "redirect-prg"
  ],
  "group": "mvc-binding",
  "type": "mc",
  "id": "spring-02-q10",
  "revision": 1,
  "sourceRefs": [
    "SPR-L06 인자 바인딩 p.15",
    "SPR-S07 Model과 View p.55",
    "spring-concepts Part 5"
  ],
  "difficulty": 2,
  "correctChoiceId": "b"
}
```
### stem
다음 핸들러가 호출된 직후의 응답으로 옳은 것은?
```java
@PostMapping("/rooms")
public String create(RoomForm form, RedirectAttributes attrs) {
    attrs.addFlashAttribute("message", "saved");
    attrs.addAttribute("floor", 3);
    return "redirect:/rooms/done";
}
```
### choice: a
302이고 주소는 `/rooms/done`이며 두 값 모두 쿼리 스트링에 없다
### choice: b
302이고 `/rooms/done?floor=3`로 가며 `message`는 flash이다
### choice: c
302이고 주소는 `/rooms/done?message=saved&floor=3`이다
### choice: d
200이고 `/rooms/done` 화면을 그 요청에서 바로 보여 준다

## question: spring-02-q11
```json
{
  "title": "예외 핸들러의 선택",
  "topics": [
    "web-crosscut"
  ],
  "tags": [
    "exception-handling"
  ],
  "group": "web-crosscut",
  "type": "mc",
  "id": "spring-02-q11",
  "revision": 1,
  "sourceRefs": [
    "SPR-L06 예외 처리 p.20",
    "SPR-S07 예외 처리 p.60",
    "spring-concepts Part 6"
  ],
  "difficulty": 3,
  "correctChoiceId": "c"
}
```
### stem
`/global`을 처리하는 컨트롤러는 `RoomNotFound` 예외를 던지고 그 컨트롤러 안에는 `@ExceptionHandler`가 없다. `@ControllerAdvice`에 두 핸들러가 있을 때 응답은? `RoomNotFound`는 `RuntimeException`의 하위 클래스이다.
```java
@ExceptionHandler(RoomNotFound.class)
@ResponseStatus(HttpStatus.NOT_FOUND)
@ResponseBody
public String notFound() { return "advice-specific"; }

@ExceptionHandler(RuntimeException.class)
@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
@ResponseBody
public String runtime() { return "advice-general"; }
```
### choice: a
500과 `advice-general`
### choice: b
409와 `local`
### choice: c
404와 `advice-specific`
### choice: d
처리되지 않고 200

## question: spring-02-q12
```json
{
  "title": "밑줄 컬럼을 camelCase로 바꾸는 설정",
  "topics": [
    "mybatis"
  ],
  "tags": [
    "mybatis-config"
  ],
  "group": "mybatis",
  "type": "mc",
  "id": "spring-02-q12",
  "revision": 1,
  "sourceRefs": [
    "SPR-L07 MyBatis 연동 p.10",
    "SPR-S09 MyBatis 설정 p.20",
    "spring-concepts Part 8"
  ],
  "difficulty": 2,
  "correctChoiceId": "c"
}
```
### stem
`reservation_id`, `member_name`, `people` 컬럼을 조회하는 `resultType="Reservation"` 구문이 있다. `mybatis.configuration.map-underscore-to-camel-case=true`로 설정했을 때 한 행을 조회한 `Reservation`의 상태는?
```java
public class Reservation {
    private Integer reservationId;
    private String memberName;
    private Integer people;
}
```
### choice: a
`people`에만 값이 들어간다
### choice: b
세 프로퍼티가 전부 null인 객체가 만들어진다
### choice: c
세 프로퍼티에 모두 값이 들어간다
### choice: d
매핑에 실패해 예외가 발생한다

## question: spring-02-q13
```json
{
  "title": "일대다 resultMap의 빈 컬렉션",
  "topics": [
    "mybatis"
  ],
  "tags": [
    "result-map"
  ],
  "group": "mybatis",
  "type": "mc",
  "id": "spring-02-q13",
  "revision": 1,
  "sourceRefs": [
    "SPR-L07 매퍼 p.30",
    "SPR-S09 resultMap p.45",
    "spring-concepts Part 8"
  ],
  "difficulty": 3,
  "correctChoiceId": "b"
}
```
### stem
`room`과 `reservation`을 `LEFT JOIN`해 `Room` 객체의 `reservations` 목록에 담는 `<collection>` 매핑이 있다. 예약이 둘인 1번 방과 예약이 없는 3번 방을 각각 조회했을 때 결과는?
### choice: a
1번 방은 예약 2개이고 3번 방의 `reservations`는 null이다
### choice: b
1번 방은 예약 2개이고 3번 방의 `reservations`는 빈 목록이다
### choice: c
1번 방은 방 객체가 둘이고 3번 방은 빈 목록이다
### choice: d
1번 방은 예약 1개이고 3번 방은 예외가 발생한다

## question: spring-02-q14
```json
{
  "title": "빈 리스트를 foreach에 넘겼을 때",
  "topics": [
    "mybatis"
  ],
  "tags": [
    "dynamic-sql"
  ],
  "group": "mybatis",
  "type": "mc",
  "id": "spring-02-q14",
  "revision": 1,
  "sourceRefs": [
    "SPR-L08 동적 SQL p.10",
    "SPR-S09 동적 SQL p.35",
    "spring-concepts Part 8"
  ],
  "difficulty": 3,
  "correctChoiceId": "d"
}
```
### stem
다음 구문에 `ids`로 빈 리스트를 넘겼다. 결과는?
```xml
<select id="findByIds" resultType="Reservation">
    SELECT * FROM reservation WHERE reservation_id IN
    <foreach collection="ids" item="id" open="(" separator="," close=")">
        #{id}
    </foreach>
</select>
```
### choice: a
조건에 맞는 행이 없어 빈 리스트가 반환된다
### choice: b
결과가 없다는 뜻으로 null이 반환된다
### choice: c
조건이 비어 모든 행이 그대로 반환된다
### choice: d
SQL 문법 오류로 예외가 발생한다

## question: spring-02-q15
```json
{
  "title": "자기 호출의 트랜잭션",
  "topics": [
    "service-tx"
  ],
  "tags": [
    "self-invocation"
  ],
  "group": "service-tx",
  "type": "mc",
  "id": "spring-02-q15",
  "revision": 1,
  "sourceRefs": [
    "SPR-L08 Service 트랜잭션 p.35",
    "spring-concepts Part 9"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
`reservation` 테이블에 3행이 있다. `outerSelf()`를 호출하고 이어서 `innerTx()`를 직접 호출했다. 두 호출 모두 예외로 끝났을 때 최종 행 수는? `add()`는 한 행을 추가한다.
```java
public void outerSelf() {
    innerTx();
}

@Transactional
public void innerTx() {
    add("self");
    throw new IllegalStateException("self");
}
```
### choice: a
4행
### choice: b
3행
### choice: c
5행
### choice: d
6행

## question: spring-02-q16
```json
{
  "title": "REQUIRES_NEW 로그의 생존",
  "topics": [
    "service-tx"
  ],
  "tags": [
    "propagation"
  ],
  "group": "service-tx",
  "type": "mc",
  "id": "spring-02-q16",
  "revision": 1,
  "sourceRefs": [
    "SPR-L08 트랜잭션 전파 p.30",
    "spring-concepts Part 9"
  ],
  "difficulty": 3,
  "correctChoiceId": "b"
}
```
### stem
`outerWithLog()`는 `@Transactional`이고 예약을 한 행 추가한 뒤 `logs.logRequiresNew("attempt")`를 호출하고 런타임 예외를 던진다. `logRequiresNew`는 `REQUIRES_NEW`이다. 시작할 때 예약은 3행이고 로그는 0행일 때 예외 뒤의 예약 행 수와 로그 행 수는?
### choice: a
예약 3행, 로그 0행
### choice: b
예약 3행, 로그 1행
### choice: c
예약 4행, 로그 1행
### choice: d
예약 4행, 로그 0행

## question: spring-02-q17
```json
{
  "title": "예외 핸들러의 JSON 응답",
  "topics": [
    "rest-api"
  ],
  "tags": [
    "rest-error"
  ],
  "group": "rest-api",
  "type": "mc",
  "id": "spring-02-q17",
  "revision": 1,
  "sourceRefs": [
    "SPR-L09 REST p.20",
    "SPR-S11 오류 응답 p.75",
    "spring-concepts Part 10"
  ],
  "difficulty": 2,
  "correctChoiceId": "c"
}
```
### stem
핸들러가 `RentalNotFound`를 던지고 `@RestControllerAdvice`가 다음처럼 처리한다. 클라이언트가 받는 응답은?
```java
@ExceptionHandler(RentalNotFound.class)
public ResponseEntity<ErrorResponse> notFound(RentalNotFound e) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse("RENTAL_NOT_FOUND", e.getMessage()));
}
```
### choice: a
상태 200이고 본문에 오류 코드가 있다
### choice: b
상태 404이고 서버의 기본 HTML 오류 화면이다
### choice: c
상태 404이고 `code` 필드가 있는 JSON 본문이다
### choice: d
상태 500이고 본문이 비어 있다

## question: spring-02-q18
```json
{
  "title": "허용 출처에 따른 preflight 응답",
  "topics": [
    "rest-api"
  ],
  "tags": [
    "cors"
  ],
  "group": "rest-api",
  "type": "mc",
  "id": "spring-02-q18",
  "revision": 1,
  "sourceRefs": [
    "SPR-L09 REST p.75",
    "SPR-S11 CORS p.65",
    "spring-concepts Part 10"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
MVC 설정이 `/api/**`에 `allowedOrigins("http://localhost:5173")`와 `allowedMethods("GET", "POST")`를 둔다. 브라우저가 보낸 preflight(`OPTIONS`) 요청의 결과로 옳은 것은?
### choice: a
5173 출처만 허용 헤더와 함께 200이고 나머지는 403이다
### choice: b
두 출처 모두 허용 헤더가 있는 200이다
### choice: c
5173 출처는 200이고 다른 출처는 허용 헤더 없이 200이다
### choice: d
두 출처 모두 허용되지 않아 405이다

## question: spring-02-q19
```json
{
  "title": "CSRF 토큰 없는 로그아웃 요청",
  "topics": [
    "security"
  ],
  "tags": [
    "login-logout"
  ],
  "group": "security",
  "type": "mc",
  "id": "spring-02-q19",
  "revision": 1,
  "sourceRefs": [
    "SPR-L11 로그인과 로그아웃 p.20",
    "spring-concepts Part 11"
  ],
  "difficulty": 3,
  "correctChoiceId": "d"
}
```
### stem
form 로그인으로 로그인한 사용자가 CSRF 토큰 없이 `POST /logout`을 보냈다. 기본 CSRF 보호가 켜져 있을 때 결과는?
### choice: a
로그아웃되고 `/`로 redirect된다
### choice: b
로그아웃은 되지만 응답은 403이다
### choice: c
404로 응답하고 경로를 찾지 못한다
### choice: d
403으로 응답하고 로그인은 유지된다

## question: spring-02-q20
```json
{
  "title": "컨트롤러에서 로그인 사용자 꺼내기",
  "topics": [
    "security"
  ],
  "tags": [
    "auth-info"
  ],
  "group": "security",
  "type": "mc",
  "id": "spring-02-q20",
  "revision": 1,
  "sourceRefs": [
    "SPR-L11 인증 정보 p.35",
    "spring-concepts Part 11"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
`root` 사용자는 `roles("ADMIN")`으로 만들었고 로그인한 상태이다. `GET /whoami`의 응답은?
```java
@GetMapping("/whoami")
public String whoami(@AuthenticationPrincipal UserDetails user) {
    return user.getUsername() + " " + user.getAuthorities();
}
```
### choice: a
`root [ROLE_ADMIN]`
### choice: b
`root [ADMIN, USER]`
### choice: c
`root [ROLE_ADMIN, ROLE_USER]`
### choice: d
`anonymousUser []`

## question: spring-02-q21
```json
{
  "title": "접두사 없는 권한과 hasRole",
  "topics": [
    "security"
  ],
  "tags": [
    "authorize-rules"
  ],
  "group": "security",
  "type": "mc",
  "id": "spring-02-q21",
  "revision": 1,
  "sourceRefs": [
    "SPR-L10 SecurityFilterChain p.40",
    "SPR-L11 사용자 정의 인증 p.15",
    "spring-concepts Part 11"
  ],
  "difficulty": 3,
  "correctChoiceId": "d"
}
```
### stem
`/admin/**`는 `hasRole("ADMIN")`으로 보호된다. 권한을 `new SimpleGrantedAuthority("ADMIN")`로 가진 사용자가 로그인한 채 `/admin`을 요청했다. 응답은?
### choice: a
200 상태로 응답한다
### choice: b
로그인 화면으로 이동한다
### choice: c
401 상태로 응답한다
### choice: d
403 상태로 응답한다

## question: spring-02-q22
```json
{
  "title": "final 필드 생성자를 만드는 Lombok 어노테이션",
  "topics": [
    "foundation-boot"
  ],
  "tags": [
    "lombok"
  ],
  "group": "foundation-boot",
  "type": "short",
  "id": "spring-02-q22",
  "revision": 1,
  "sourceRefs": [
    "SPR-L01 Lombok p.40",
    "SPR-S04 Lombok p.25",
    "spring-concepts Part 12"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "RequiredArgsConstructor",
    "@RequiredArgsConstructor"
  ],
  "normalization": "caseFold"
}
```
### stem
`final` 필드와 `@NonNull` 필드만 파라미터로 받는 생성자를 컴파일할 때 만들어 주는 Lombok 어노테이션의 이름을 쓰시오.

## question: spring-02-q23
```json
{
  "title": "생성자가 하나일 때 생략할 수 있는 어노테이션",
  "topics": [
    "di-bean"
  ],
  "tags": [
    "constructor-injection"
  ],
  "group": "di-bean",
  "type": "short",
  "id": "spring-02-q23",
  "revision": 1,
  "sourceRefs": [
    "SPR-L02 묵시적 DI p.25",
    "SPR-S03 DI p.40",
    "spring-concepts Part 3"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "@Autowired",
    "Autowired"
  ],
  "normalization": "caseFold"
}
```
### stem
빈 클래스의 생성자가 하나뿐이면 생성자에 붙이지 않아도 그 생성자로 의존성이 주입된다. 생략할 수 있는 어노테이션의 이름을 쓰시오.

## question: spring-02-q24
```json
{
  "title": "AOP가 적용된 빈 대신 주입되는 객체",
  "topics": [
    "aop-proxy"
  ],
  "tags": [
    "aop-terms"
  ],
  "group": "aop-proxy",
  "type": "short",
  "id": "spring-02-q24",
  "revision": 1,
  "sourceRefs": [
    "SPR-L05 AOP 한계 p.5",
    "SPR-S06 AOP 동작 p.10",
    "spring-concepts Part 4"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "프록시",
    "proxy"
  ],
  "normalization": "caseFold"
}
```
### stem
AOP가 적용되는 빈을 주입받으면 호출자가 받는 것은 원래 객체가 아니라 호출을 가로채는 대리 객체이다. 이 객체를 가리키는 용어를 쓰시오.

## question: spring-02-q25
```json
{
  "title": "모든 요청을 가장 먼저 받는 서블릿",
  "topics": [
    "mvc-binding"
  ],
  "tags": [
    "dispatcher-flow"
  ],
  "group": "mvc-binding",
  "type": "short",
  "id": "spring-02-q25",
  "revision": 1,
  "sourceRefs": [
    "SPR-S07 MVC 요청 흐름 p.10",
    "spring-concepts Part 5"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "DispatcherServlet"
  ],
  "normalization": "caseFold"
}
```
### stem
Spring MVC에서 모든 요청을 가장 먼저 받아 핸들러 매핑과 어댑터에 일을 나누는 Front Controller 서블릿의 이름을 쓰시오.

## question: spring-02-q26
```json
{
  "title": "파일을 고르지 않았는지 확인하는 메서드",
  "topics": [
    "web-crosscut"
  ],
  "tags": [
    "multipart"
  ],
  "group": "web-crosscut",
  "type": "short",
  "id": "spring-02-q26",
  "revision": 1,
  "sourceRefs": [
    "SPR-L06 파일 업로드 p.25",
    "SPR-S10 파일 업로드 p.15",
    "spring-concepts Part 7"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "isEmpty",
    "isEmpty()"
  ],
  "normalization": "caseFold"
}
```
### stem
`MultipartFile`로 받은 파일이 비어 있는지 확인하는 메서드의 이름을 쓰시오. 파일을 고르지 않고 전송해도 객체는 들어온다.

## question: spring-02-q27
```json
{
  "title": "insert가 만든 키를 받는 XML 속성",
  "topics": [
    "mybatis"
  ],
  "tags": [
    "mapper-interface"
  ],
  "group": "mybatis",
  "type": "short",
  "id": "spring-02-q27",
  "revision": 1,
  "sourceRefs": [
    "SPR-L07 MyBatis 연동 p.20",
    "SPR-S09 MyBatis 설정 p.15",
    "spring-concepts Part 8"
  ],
  "difficulty": 2,
  "acceptedAnswers": [
    "useGeneratedKeys"
  ],
  "normalization": "caseFold"
}
```
### stem
`<insert>`에 `keyProperty="reservationId"`와 함께 쓰면 AUTO_INCREMENT로 만들어진 키를 파라미터 객체에 채워 주는 속성의 이름을 쓰시오. 값은 `true`이다.

## question: spring-02-q28
```json
{
  "title": "checked 예외에도 rollback하게 하는 속성",
  "topics": [
    "service-tx"
  ],
  "tags": [
    "rollback-rules"
  ],
  "group": "service-tx",
  "type": "short",
  "id": "spring-02-q28",
  "revision": 1,
  "sourceRefs": [
    "SPR-L08 Service 트랜잭션 p.25",
    "spring-concepts Part 9"
  ],
  "difficulty": 2,
  "acceptedAnswers": [
    "rollbackFor",
    "rollbackFor=Exception.class"
  ],
  "normalization": "caseFold"
}
```
### stem
`@Transactional`은 기본으로 checked 예외에서 commit한다. `Exception.class`를 값으로 주어 checked 예외에서도 rollback하게 하는 속성의 이름을 쓰시오.

## question: spring-02-q29
```json
{
  "title": "springdoc이 만드는 OpenAPI 문서 경로",
  "topics": [
    "rest-api"
  ],
  "tags": [
    "api-docs"
  ],
  "group": "rest-api",
  "type": "short",
  "id": "spring-02-q29",
  "revision": 1,
  "sourceRefs": [
    "SPR-L09 Swagger p.30",
    "SPR-S11 OpenAPI p.95",
    "spring-concepts Part 10"
  ],
  "difficulty": 2,
  "acceptedAnswers": [
    "/v3/api-docs",
    "v3/api-docs"
  ],
  "normalization": "trim"
}
```
### stem
springdoc-openapi를 의존성에 더하면 기본으로 OpenAPI 명세를 JSON으로 내려 주는 경로를 쓰시오. 앞의 슬래시를 포함한다.

## question: spring-02-q30
```json
{
  "title": "비밀번호와 해시를 비교하는 PasswordEncoder 메서드",
  "topics": [
    "security"
  ],
  "tags": [
    "user-details"
  ],
  "group": "security",
  "type": "short",
  "id": "spring-02-q30",
  "revision": 1,
  "sourceRefs": [
    "SPR-L10 사용자와 권한 설정 p.35",
    "SPR-L11 사용자 정의 인증 p.10",
    "spring-concepts Part 11"
  ],
  "difficulty": 2,
  "acceptedAnswers": [
    "matches",
    "matches()"
  ],
  "normalization": "caseFold"
}
```
### stem
`PasswordEncoder`에서 입력한 원문 비밀번호가 저장된 해시와 맞는지 확인하는 메서드의 이름을 쓰시오.

## question: spring-02-q31
```json
{
  "title": "업무 단위와 트랜잭션 전파",
  "topics": [
    "service-tx"
  ],
  "tags": [
    "tx-boundary"
  ],
  "group": "service-tx",
  "type": "essay",
  "id": "spring-02-q31",
  "revision": 1,
  "sourceRefs": [
    "SPR-L08 Service 트랜잭션 p.15",
    "SPR-L08 Service 트랜잭션 p.20",
    "spring-concepts Part 9"
  ],
  "difficulty": 3,
  "rubric": [
    {
      "id": "r0",
      "criterion": "트랜잭션을 Service 메서드에 두고 여러 SQL을 한 업무 단위로 묶는다고 서술한다",
      "points": 1
    },
    {
      "id": "r1",
      "criterion": "안쪽 REQUIRED의 런타임 예외로 전체가 rollback-only가 된다고 서술한다",
      "points": 1
    },
    {
      "id": "r2",
      "criterion": "바깥이 예외를 잡아도 마지막에 `UnexpectedRollbackException`과 함께 모두 취소된다고 서술한다",
      "points": 1
    },
    {
      "id": "r3",
      "criterion": "`REQUIRES_NEW`가 따로 commit되어 바깥이 rollback되어도 기록이 남는다고 서술한다",
      "points": 1
    }
  ],
  "modelAnswer": "**(1)** Service 메서드에 둔다. 예약 저장과 자리 감소는 함께 성공하거나 함께 취소되어야 하는 한 업무 단위이고 그 단위를 아는 곳이 Service이기 때문이다. Mapper마다 걸면 SQL 하나씩만 보호된다.\n\n**(2)** 안쪽 메서드가 같은 트랜잭션에 참여하므로 런타임 예외가 나온 시점에 트랜잭션은 rollback-only로 표시된다. 바깥이 예외를 잡아 정상 종료해도 마지막에 `UnexpectedRollbackException`이 나고 바깥의 변경까지 모두 취소된다.\n\n**(3)** `REQUIRES_NEW`를 쓴다. 바깥 트랜잭션을 멈추고 새 트랜잭션으로 따로 commit하므로 바깥이 예외로 rollback되어도 실패 기록은 남는다. 실행해 보면 예약은 취소되고 로그는 1행이 남는다."
}
```
### stem
스터디실 예약 서비스는 예약을 저장하고 남은 자리를 줄이며 실패 기록을 남긴다. 다음을 서술하시오.

(1) 예약 저장과 자리 감소를 한 트랜잭션으로 묶을 때 `@Transactional`을 두는 계층과 이유

(2) `REQUIRED`로 참여한 안쪽 서비스에서 런타임 예외가 나왔는데 바깥 서비스가 그것을 `catch`로 잡았을 때의 결과

(3) 바깥 트랜잭션이 rollback되어도 남아야 하는 실패 기록의 전파 속성과 그 결과

## question: spring-02-q32
```json
{
  "title": "동적 SQL의 경계 입력",
  "topics": [
    "mybatis"
  ],
  "tags": [
    "dynamic-sql"
  ],
  "group": "mybatis",
  "type": "essay",
  "id": "spring-02-q32",
  "revision": 1,
  "sourceRefs": [
    "SPR-L08 동적 SQL p.10",
    "SPR-S09 동적 SQL p.35",
    "spring-concepts Part 8"
  ],
  "difficulty": 3,
  "rubric": [
    {
      "id": "r0",
      "criterion": "조건이 비면 `WHERE`가 없어 전체 행이 대상이 된다고 서술한다",
      "points": 1
    },
    {
      "id": "r1",
      "criterion": "UPDATE나 DELETE에서 전체 행 변경 위험을 서비스에서 막아야 한다고 서술한다",
      "points": 1
    },
    {
      "id": "r2",
      "criterion": "`<foreach>`에 빈 리스트를 넘기면 `IN ()` 문법 오류가 난다고 서술하고 대책을 쓴다",
      "points": 1
    },
    {
      "id": "r3",
      "criterion": "`<set>`이 비면 문법 오류가 나므로 바꿀 값이 없을 때 쿼리를 보내지 않는다고 서술한다",
      "points": 1
    }
  ],
  "modelAnswer": "**(1)** 내용이 모두 비면 `<where>`는 `WHERE` 자체를 만들지 않아 전체 행을 조회한다. 조회에서는 의도일 수 있지만 UPDATE나 DELETE에서 같은 일이 생기면 모든 행이 대상이 되므로 서비스에서 먼저 막아야 한다.\n\n**(2)** `IN ()`이 되어 SQL 문법 오류로 예외가 발생한다. 호출하기 전에 빈 리스트를 걸러 내거나 `<if>`로 감싸서 쿼리를 만들지 않는다.\n\n**(3)** `SET` 절이 비어 `UPDATE reservation WHERE ...` 같은 문법 오류가 난다. 바꿀 값이 없으면 쿼리를 보내지 않도록 서비스에서 확인한다."
}
```
### stem
예약 검색은 `<where>`와 `<if>`로, 목록 조회는 `<foreach>`로, 수정은 `<set>`과 `<if>`로 SQL을 만든다. 다음을 서술하시오.

(1) 검색 조건이 모두 비었을 때 `<where>`가 만드는 SQL과 그 위험

(2) `<foreach>`에 빈 리스트를 넘겼을 때의 결과와 대책

(3) `<set>` 안의 모든 `<if>`가 거짓일 때의 결과
