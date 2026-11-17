## question: spring-03-q01
```json
{
  "title": "사용자가 정의한 빈과 자동 구성의 관계",
  "topics": [
    "foundation-boot"
  ],
  "tags": [
    "boot-autoconfig"
  ],
  "group": "foundation-boot",
  "type": "mc",
  "id": "spring-03-q01",
  "revision": 1,
  "sourceRefs": [
    "SPR-L03 자동 구성 p.15",
    "SPR-S05 자동 구성 p.10",
    "spring-concepts Part 2"
  ],
  "difficulty": 2,
  "correctChoiceId": "c"
}
```
### stem
자동 구성 클래스가 `@ConditionalOnMissingBean`이 붙은 `ClockInfo` 빈을 등록한다. 개발자가 같은 타입의 `ClockInfo` 빈을 직접 등록한 상태에서 컨테이너를 시작했다. 컨텍스트의 상태는?
```java
@AutoConfiguration
public class ClockAutoConfiguration {
    @Bean
    @ConditionalOnMissingBean
    ClockInfo clockInfo() {
        return new ClockInfo("auto");
    }
}
```
### choice: a
두 빈이 모두 등록되어 같은 타입의 빈이 둘이 된다
### choice: b
자동 구성의 빈이 개발자가 만든 빈을 덮어쓴다
### choice: c
개발자가 만든 빈만 남고 자동 구성의 빈은 등록되지 않는다
### choice: d
같은 타입의 빈이 중복되어 시작에 실패한다

## question: spring-03-q02
```json
{
  "title": "로그 레벨 설정과 출력되는 레벨",
  "topics": [
    "foundation-boot"
  ],
  "tags": [
    "logging-slf4j"
  ],
  "group": "foundation-boot",
  "type": "mc",
  "id": "spring-03-q02",
  "revision": 1,
  "sourceRefs": [
    "SPR-L01 SLF4J 로깅 p.20",
    "SPR-S02 로깅 p.15",
    "spring-concepts Part 12"
  ],
  "difficulty": 2,
  "correctChoiceId": "d"
}
```
### stem
로거의 레벨을 `INFO`로 설정하고 다음 다섯 줄을 실행했다. 출력되는 레벨을 순서대로 나열한 것은?
```java
log.trace("t");
log.debug("d");
log.info("i");
log.warn("w");
log.error("e");
```
### choice: a
다섯 레벨이 모두 출력된다
### choice: b
TRACE, DEBUG, INFO가 출력된다
### choice: c
INFO 한 줄만 출력된다
### choice: d
INFO, WARN, ERROR가 출력된다

## question: spring-03-q03
```json
{
  "title": "@Configuration 안에서 @Bean 메서드를 부를 때",
  "topics": [
    "di-bean"
  ],
  "tags": [
    "bean-registration"
  ],
  "group": "di-bean",
  "type": "mc",
  "id": "spring-03-q03",
  "revision": 1,
  "sourceRefs": [
    "SPR-L02 명시적 DI p.15",
    "SPR-S03 빈 관리 p.25",
    "spring-concepts Part 3"
  ],
  "difficulty": 3,
  "correctChoiceId": "b"
}
```
### stem
두 설정 클래스가 같은 `@Bean` 메서드를 갖는다. 컨테이너에서 `Second`와 `First`를 꺼내 `second.first == first`를 비교한 결과를 `FullConfig`, `LiteConfig` 순서로 나열한 것은?
```java
@Configuration
class FullConfig {
    @Bean First first() { return new First(); }
    @Bean Second second() { return new Second(first()); }
}

@Configuration(proxyBeanMethods = false)
class LiteConfig {
    @Bean First first() { return new First(); }
    @Bean Second second() { return new Second(first()); }
}
```
### choice: a
true, true
### choice: b
true, false
### choice: c
false, true
### choice: d
false, false

## question: spring-03-q04
```json
{
  "title": "생성자 순환 의존의 결과",
  "topics": [
    "di-bean"
  ],
  "tags": [
    "constructor-injection"
  ],
  "group": "di-bean",
  "type": "mc",
  "id": "spring-03-q04",
  "revision": 1,
  "sourceRefs": [
    "SPR-L02 묵시적 DI p.25",
    "SPR-S03 DI p.40",
    "spring-concepts Part 3"
  ],
  "difficulty": 2,
  "correctChoiceId": "c"
}
```
### stem
두 `@Component`가 서로를 생성자로 주입받는다. 애플리케이션을 시작했을 때 일어나는 일은?
```java
@Component
class A {
    A(B b) { }
}

@Component
class B {
    B(A a) { }
}
```
### choice: a
`A`가 먼저 만들어지고 `B`에는 null이 들어간 채 정상 시작한다
### choice: b
정상 시작하고 첫 요청에서 `StackOverflowError`가 난다
### choice: c
시작할 때 빈을 만들지 못해 실패한다
### choice: d
둘 중 하나가 지연 생성되어 정상 시작한다

## question: spring-03-q05
```json
{
  "title": "List로 받는 같은 타입의 빈",
  "topics": [
    "di-bean"
  ],
  "tags": [
    "bean-selection"
  ],
  "group": "di-bean",
  "type": "mc",
  "id": "spring-03-q05",
  "revision": 1,
  "sourceRefs": [
    "SPR-S03 DI p.45",
    "spring-concepts Part 3"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
`Discount` 타입의 빈이 둘이고 그중 하나에 `@Primary`가 붙어 있다. 다음 생성자에 주입되는 목록의 크기는?
```java
@Component
class ByList {
    final List<Discount> all;

    ByList(List<Discount> all) {
        this.all = all;
    }
}
```
### choice: a
목록의 크기는 2이다
### choice: b
목록의 크기는 1이다
### choice: c
목록의 크기는 0이다
### choice: d
시작할 때 주입에 실패한다

## question: spring-03-q06
```json
{
  "title": "파라미터 표기에 따른 적용 범위",
  "topics": [
    "aop-proxy"
  ],
  "tags": [
    "pointcut-expression"
  ],
  "group": "aop-proxy",
  "type": "mc",
  "id": "spring-03-q06",
  "revision": 1,
  "sourceRefs": [
    "SPR-L04 pointcut p.20",
    "SPR-S06 pointcut p.20",
    "spring-concepts Part 4"
  ],
  "difficulty": 3,
  "correctChoiceId": "b"
}
```
### stem
두 advice의 pointcut이 다음과 같다. `SeatService`의 메서드 `findSeat(int)`, `findAll()`, `save(String)`, `findByNameAndFloor(String, int)`를 모두 한 번씩 호출했을 때 `find*(*)`에 걸린 호출 수와 `find*(..)`에 걸린 호출 수는? `SeatHelper.findSeat(int)`도 호출하지만 이름이 `*Service`로 끝나지 않는다.
```java
@Before("execution(* study..*Service.find*(*))")
public void one() { }

@Before("execution(* study..*Service.find*(..))")
public void any() { }
```
### choice: a
1회, 4회
### choice: b
1회, 3회
### choice: c
2회, 3회
### choice: d
1회, 2회

## question: spring-03-q07
```json
{
  "title": "target이 예외를 던질 때의 advice",
  "topics": [
    "aop-proxy"
  ],
  "tags": [
    "advice-types"
  ],
  "group": "aop-proxy",
  "type": "mc",
  "id": "spring-03-q07",
  "revision": 1,
  "sourceRefs": [
    "SPR-L04 advice p.25",
    "SPR-S06 advice p.35",
    "spring-concepts Part 4"
  ],
  "difficulty": 3,
  "correctChoiceId": "c"
}
```
### stem
한 aspect에 Around, Before, AfterReturning, AfterThrowing, After가 모두 있고 target이 `IllegalStateException`을 던졌다. 이벤트 순서는? Around는 `proceed()`를 `try`로 부르고 `finally`에서 `around-after`를 기록한다.
### choice: a
around-before → before → target → afterReturning → after → around-after
### choice: b
around-before → before → target → after → afterThrowing → around-after
### choice: c
around-before → before → target → afterThrowing → after → around-after
### choice: d
before → around-before → target → afterThrowing → after → around-after

## question: spring-03-q08
```json
{
  "title": "클래스와 메서드 경로의 결합",
  "topics": [
    "mvc-binding"
  ],
  "tags": [
    "request-mapping"
  ],
  "group": "mvc-binding",
  "type": "mc",
  "id": "spring-03-q08",
  "revision": 1,
  "sourceRefs": [
    "SPR-L05 Controller와 응답 p.25",
    "SPR-S07 MVC 요청 흐름 p.30",
    "spring-concepts Part 5"
  ],
  "difficulty": 2,
  "correctChoiceId": "d"
}
```
### stem
컨트롤러가 다음과 같을 때 `GET /rooms/7` 요청의 처리 결과는?
```java
@Controller
@RequestMapping("/rooms")
public class RoomController {
    @GetMapping("/{roomId}")
    public String detail(@PathVariable int roomId, Model model) {
        model.addAttribute("roomId", roomId);
        return "room/detail";
    }
}
```
### choice: a
경로가 맞지 않아 404로 응답한다
### choice: b
HTTP 메서드가 맞지 않아 405로 응답한다
### choice: c
뷰 이름 `detail`과 `roomId`가 0인 모델로 처리한다
### choice: d
뷰 이름 `room/detail`과 `roomId`가 7인 모델로 처리한다

## question: spring-03-q09
```json
{
  "title": "선택 파라미터의 기본값",
  "topics": [
    "mvc-binding"
  ],
  "tags": [
    "argument-binding"
  ],
  "group": "mvc-binding",
  "type": "mc",
  "id": "spring-03-q09",
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
다음 핸들러에 쿼리 스트링 없이 `GET /rooms/search` 요청을 보냈을 때 모델에 담기는 값은?
```java
@GetMapping("/rooms/search")
public String search(@RequestParam(required = false) String keyword,
        @RequestParam(defaultValue = "1") int page, Model model) {
    model.addAttribute("keyword", keyword);
    model.addAttribute("page", page);
    return "room/list";
}
```
### choice: a
`keyword`는 빈 문자열이고 `page`는 0이다
### choice: b
`keyword`는 null이고 `page`는 1이다
### choice: c
필수 파라미터가 없어 400으로 응답한다
### choice: d
`keyword`는 null이고 `page`는 0이다

## question: spring-03-q10
```json
{
  "title": "forward와 redirect의 차이",
  "topics": [
    "mvc-binding"
  ],
  "tags": [
    "model-view"
  ],
  "group": "mvc-binding",
  "type": "mc",
  "id": "spring-03-q10",
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
두 핸들러가 각각 `forward:/rooms/list`와 `redirect:/rooms/list`를 반환했다. 응답 상태와 이동 방식에 대한 설명으로 옳은 것은?
### choice: a
둘 다 302 응답으로 브라우저가 새 요청을 보낸다
### choice: b
forward는 302 응답이고 redirect는 서버 안의 이동이다
### choice: c
forward는 서버 안의 이동이고 redirect는 302로 새 요청이다
### choice: d
둘 다 서버 안에서 이어지고 주소 표시줄만 바뀐다

## question: spring-03-q11
```json
{
  "title": "preHandle이 false일 때의 호출",
  "topics": [
    "web-crosscut"
  ],
  "tags": [
    "interceptor"
  ],
  "group": "web-crosscut",
  "type": "mc",
  "id": "spring-03-q11",
  "revision": 1,
  "sourceRefs": [
    "SPR-S08 Interceptor p.10",
    "SPR-S08 Interceptor p.20",
    "spring-concepts Part 6"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
인터셉터 1, 2, 3을 이 순서로 등록했고 2의 `preHandle`만 `false`를 반환한다. 이벤트 순서는? `pre1`은 인터셉터 1의 `preHandle`, `after1`은 `afterCompletion`을 뜻하고 핸들러가 실행되면 `handler`를 기록한다.
### choice: a
pre1, pre2, after1
### choice: b
pre1, pre2, after2, after1
### choice: c
pre1, pre2, post1, after1
### choice: d
pre1, pre2, handler

## question: spring-03-q12
```json
{
  "title": "조건 조합에 따른 where 결과",
  "topics": [
    "mybatis"
  ],
  "tags": [
    "dynamic-sql"
  ],
  "group": "mybatis",
  "type": "mc",
  "id": "spring-03-q12",
  "revision": 1,
  "sourceRefs": [
    "SPR-L08 동적 SQL p.10",
    "SPR-S09 동적 SQL p.35",
    "spring-concepts Part 8"
  ],
  "difficulty": 3,
  "correctChoiceId": "b"
}
```
### stem
`reservation`에는 번호 1은 방 1의 kim, 2는 방 1의 lee, 3은 방 2의 kimchi가 있다. 다음 구문에 `search(1, "kim")`과 `search(null, "")`를 차례로 호출했을 때 번호 목록은?
```xml
<select id="search" resultType="Reservation">
    SELECT reservation_id AS reservationId FROM reservation
    <where>
        <if test="roomId != null">AND room_id = #{roomId}</if>
        <if test="keyword != null and keyword != ''">
            AND member_name LIKE CONCAT('%', #{keyword}, '%')
        </if>
    </where>
    ORDER BY reservation_id
</select>
```
### choice: a
[1, 2]와 빈 목록 []
### choice: b
[1]과 [1, 2, 3]
### choice: c
[1, 3]과 [1, 2, 3]
### choice: d
[1]과 빈 목록 []

## question: spring-03-q13
```json
{
  "title": "LIKE 검색에 바인딩한 값",
  "topics": [
    "mybatis"
  ],
  "tags": [
    "param-binding"
  ],
  "group": "mybatis",
  "type": "mc",
  "id": "spring-03-q13",
  "revision": 1,
  "sourceRefs": [
    "SPR-L08 동적 SQL p.5",
    "SPR-S09 매퍼 XML p.25",
    "spring-concepts Part 8"
  ],
  "difficulty": 3,
  "correctChoiceId": "d"
}
```
### stem
위와 같은 테이블에서 `search(null, "kim")`을 호출했다. 조건 `member_name LIKE CONCAT('%', #{keyword}, '%')`로 조회되는 번호 목록은?
### choice: a
1번 하나만 조회된다
### choice: b
조회되는 행이 없다
### choice: c
세 행이 모두 그대로 조회된다
### choice: d
1번과 3번이 조회된다

## question: spring-03-q14
```json
{
  "title": "insert의 반환값과 채워진 키",
  "topics": [
    "mybatis"
  ],
  "tags": [
    "mapper-interface"
  ],
  "group": "mybatis",
  "type": "mc",
  "id": "spring-03-q14",
  "revision": 1,
  "sourceRefs": [
    "SPR-L07 MyBatis 연동 p.20",
    "SPR-S09 MyBatis 설정 p.15",
    "spring-concepts Part 8"
  ],
  "difficulty": 2,
  "correctChoiceId": "c"
}
```
### stem
`reservation`에 3행이 있고 AUTO_INCREMENT로 다음 번호는 4이다. `useGeneratedKeys="true" keyProperty="reservationId"`인 insert를 호출했다. `n`과 `r.getReservationId()`는?
```java
Reservation r = new Reservation();
r.setRoomId(3);
r.setMemberName("park");
r.setPeople(1);
int n = mapper.insert(r);
```
### choice: a
4와 4
### choice: b
0과 4
### choice: c
1과 4
### choice: d
1과 null

## question: spring-03-q15
```json
{
  "title": "잡아서 삼킨 예외",
  "topics": [
    "service-tx"
  ],
  "tags": [
    "rollback-rules"
  ],
  "group": "service-tx",
  "type": "mc",
  "id": "spring-03-q15",
  "revision": 1,
  "sourceRefs": [
    "SPR-L08 Service 트랜잭션 p.25",
    "spring-concepts Part 9"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
`reservation`에 3행이 있다. `caught()`를 호출하면 몇 행이 되는가?
```java
@Transactional
public void caught() {
    add("caught");
    try {
        throw new IllegalStateException("caught");
    } catch (IllegalStateException ignored) {
    }
}
```
### choice: a
커밋되어 4행이 된다
### choice: b
롤백되어 3행이 된다
### choice: c
두 행이 추가되어 5행이 된다
### choice: d
예외가 호출자에게 전파된다

## question: spring-03-q16
```json
{
  "title": "MANDATORY의 트랜잭션 요구",
  "topics": [
    "service-tx"
  ],
  "tags": [
    "propagation"
  ],
  "group": "service-tx",
  "type": "mc",
  "id": "spring-03-q16",
  "revision": 1,
  "sourceRefs": [
    "SPR-L08 트랜잭션 전파 p.30",
    "spring-concepts Part 9"
  ],
  "difficulty": 3,
  "correctChoiceId": "d"
}
```
### stem
`logs.mandatory()`는 `@Transactional(propagation = Propagation.MANDATORY)`이고 로그를 한 행 추가한다. 진행 중인 트랜잭션이 없는 상태에서 호출했을 때 결과는?
### choice: a
새 트랜잭션을 시작해 로그가 1행 추가된다
### choice: b
트랜잭션 없이 실행되어 로그가 1행 추가된다
### choice: c
`null`을 반환하고 로그는 추가되지 않는다
### choice: d
예외가 발생하고 로그는 추가되지 않는다

## question: spring-03-q17
```json
{
  "title": "요청 본문 형식에 따른 상태 코드",
  "topics": [
    "rest-api"
  ],
  "tags": [
    "json-body"
  ],
  "group": "rest-api",
  "type": "mc",
  "id": "spring-03-q17",
  "revision": 1,
  "sourceRefs": [
    "SPR-L09 REST p.55",
    "SPR-S11 HTTP와 REST p.55",
    "spring-concepts Part 10"
  ],
  "difficulty": 2,
  "correctChoiceId": "b"
}
```
### stem
`@PostMapping`이 `@RequestBody RentalRequest`를 받는다. 같은 주소로 보낸 두 요청의 상태 코드를 순서대로 나열한 것은? 첫째는 `Content-Type: application/x-www-form-urlencoded`로 본문을 보냈고 둘째는 `application/json`이지만 JSON 문법이 틀렸다.
### choice: a
400, 400
### choice: b
415, 400
### choice: c
415, 415
### choice: d
400, 415

## question: spring-03-q18
```json
{
  "title": "본문 없는 삭제 응답",
  "topics": [
    "rest-api"
  ],
  "tags": [
    "response-entity"
  ],
  "group": "rest-api",
  "type": "mc",
  "id": "spring-03-q18",
  "revision": 1,
  "sourceRefs": [
    "SPR-S11 ResponseEntity p.60",
    "spring-concepts Part 10"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
다음 핸들러가 정상 실행되었을 때 응답은?
```java
@DeleteMapping("/api/rentals/{id}")
public ResponseEntity<Void> giveBack(@PathVariable int id) {
    service.giveBack(id);
    return ResponseEntity.noContent().build();
}
```
### choice: a
상태 204이고 본문이 비어 있다
### choice: b
상태 200이고 본문이 비어 있다
### choice: c
상태 204이고 본문에 삭제한 대여가 담긴다
### choice: d
상태 404이고 본문이 비어 있다

## question: spring-03-q19
```json
{
  "title": "비밀번호가 틀린 form 로그인",
  "topics": [
    "security"
  ],
  "tags": [
    "login-logout"
  ],
  "group": "security",
  "type": "mc",
  "id": "spring-03-q19",
  "revision": 1,
  "sourceRefs": [
    "SPR-L11 로그인과 로그아웃 p.20",
    "spring-concepts Part 11"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
form 로그인이 켜져 있고 `/login`으로 사용자 이름은 맞고 비밀번호가 틀린 요청을 보냈다. 응답은?
### choice: a
302 응답으로 `/login?error`로 이동한다
### choice: b
302 응답으로 `/`로 이동하고 로그인된다
### choice: c
401 응답과 JSON 오류 본문이다
### choice: d
200 응답과 오류 안내 화면이다

## question: spring-03-q20
```json
{
  "title": "규칙에 따른 접근 결과",
  "topics": [
    "security"
  ],
  "tags": [
    "authorize-rules"
  ],
  "group": "security",
  "type": "mc",
  "id": "spring-03-q20",
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
설정이 다음과 같다. 로그인하지 않은 사용자의 `GET /me`와 `USER` 역할 사용자의 `GET /admin/reports/daily`의 결과를 순서대로 나열한 것은?
```java
http.authorizeHttpRequests(auth -> auth
        .requestMatchers("/", "/open/**").permitAll()
        .requestMatchers("/admin/**").hasRole("ADMIN")
        .anyRequest().authenticated())
    .formLogin(form -> form.defaultSuccessUrl("/"));
```
### choice: a
200, 200
### choice: b
403, 403
### choice: c
403, 302 `/login`
### choice: d
302 `/login`, 403

## question: spring-03-q21
```json
{
  "title": "BCrypt 해시의 비교",
  "topics": [
    "security"
  ],
  "tags": [
    "user-details"
  ],
  "group": "security",
  "type": "mc",
  "id": "spring-03-q21",
  "revision": 1,
  "sourceRefs": [
    "SPR-L10 사용자와 권한 설정 p.35",
    "SPR-L11 사용자 정의 인증 p.10",
    "spring-concepts Part 11"
  ],
  "difficulty": 3,
  "correctChoiceId": "b"
}
```
### stem
같은 비밀번호 `study1234`를 `BCryptPasswordEncoder.encode`로 두 번 인코딩해 `h1`과 `h2`를 얻었다. 옳은 설명은?
### choice: a
`h1.equals(h2)`가 true이므로 문자열 비교로 확인한다
### choice: b
`h1`과 `h2`는 서로 다르지만 둘 다 `matches`가 true이다
### choice: c
`h1`과 `h2`는 다르고 둘 중 하나만 `matches`가 true이다
### choice: d
매번 같은 해시가 나오므로 DB에 해시를 한 번만 저장한다

## question: spring-03-q22
```json
{
  "title": "각 테스트 앞에서 실행되는 JUnit 5 어노테이션",
  "topics": [
    "foundation-boot"
  ],
  "tags": [
    "junit-test"
  ],
  "group": "foundation-boot",
  "type": "short",
  "id": "spring-03-q22",
  "revision": 1,
  "sourceRefs": [
    "SPR-L01 JUnit 테스트 p.30",
    "SPR-S02 JUnit 테스트 p.25",
    "spring-concepts Part 12"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "@BeforeEach",
    "BeforeEach"
  ],
  "normalization": "caseFold"
}
```
### stem
JUnit 5에서 테스트 메서드가 실행되기 전에 매번 먼저 실행되는 준비 메서드에 붙이는 어노테이션의 이름을 쓰시오.

## question: spring-03-q23
```json
{
  "title": "@Bean 메서드를 두는 설정 클래스의 어노테이션",
  "topics": [
    "di-bean"
  ],
  "tags": [
    "bean-registration"
  ],
  "group": "di-bean",
  "type": "short",
  "id": "spring-03-q23",
  "revision": 1,
  "sourceRefs": [
    "SPR-L02 명시적 DI p.15",
    "SPR-S03 빈 관리 p.25",
    "spring-concepts Part 3"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "@Configuration",
    "Configuration"
  ],
  "normalization": "caseFold"
}
```
### stem
`@Bean` 메서드를 모아 빈을 직접 등록하는 클래스에 붙이는 어노테이션의 이름을 쓰시오. 이 클래스 안에서 `@Bean` 메서드를 부르면 같은 singleton을 돌려준다.

## question: spring-03-q24
```json
{
  "title": "pointcut과 advice를 묶은 모듈",
  "topics": [
    "aop-proxy"
  ],
  "tags": [
    "aop-terms"
  ],
  "group": "aop-proxy",
  "type": "short",
  "id": "spring-03-q24",
  "revision": 1,
  "sourceRefs": [
    "SPR-L05 AOP 한계 p.5",
    "SPR-S06 AOP 동작 p.10",
    "spring-concepts Part 4"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "aspect",
    "애스펙트",
    "어스펙트"
  ],
  "normalization": "caseFold"
}
```
### stem
적용할 대상을 고르는 pointcut과 실행할 부가 기능인 advice를 하나로 묶은 AOP의 모듈을 가리키는 용어를 쓰시오.

## question: spring-03-q25
```json
{
  "title": "경로의 중괄호 값을 받는 어노테이션",
  "topics": [
    "mvc-binding"
  ],
  "tags": [
    "argument-binding"
  ],
  "group": "mvc-binding",
  "type": "short",
  "id": "spring-03-q25",
  "revision": 1,
  "sourceRefs": [
    "SPR-L06 인자 바인딩 p.10",
    "SPR-S07 인자 바인딩 p.35",
    "spring-concepts Part 5"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "@PathVariable",
    "PathVariable"
  ],
  "normalization": "caseFold"
}
```
### stem
`/rooms/{roomId}`의 `{roomId}` 값을 핸들러의 파라미터로 받을 때 파라미터에 붙이는 어노테이션의 이름을 쓰시오.

## question: spring-03-q26
```json
{
  "title": "공백뿐인 문자열도 막는 검증 어노테이션",
  "topics": [
    "web-crosscut"
  ],
  "tags": [
    "validation"
  ],
  "group": "web-crosscut",
  "type": "short",
  "id": "spring-03-q26",
  "revision": 1,
  "sourceRefs": [
    "SPR-S07 Validation p.70",
    "spring-concepts Part 6"
  ],
  "difficulty": 2,
  "acceptedAnswers": [
    "@NotBlank",
    "NotBlank"
  ],
  "normalization": "caseFold"
}
```
### stem
null과 빈 문자열은 물론 공백만 있는 문자열도 허용하지 않는 Bean Validation 어노테이션의 이름을 쓰시오.

## question: spring-03-q27
```json
{
  "title": "일대다 관계의 목록을 매핑하는 태그",
  "topics": [
    "mybatis"
  ],
  "tags": [
    "result-map"
  ],
  "group": "mybatis",
  "type": "short",
  "id": "spring-03-q27",
  "revision": 1,
  "sourceRefs": [
    "SPR-L07 매퍼 p.30",
    "SPR-S09 resultMap p.45",
    "spring-concepts Part 8"
  ],
  "difficulty": 2,
  "acceptedAnswers": [
    "collection",
    "<collection>"
  ],
  "normalization": "caseFold"
}
```
### stem
`resultMap` 안에서 부모 객체의 `List` 프로퍼티에 자식 행들을 모아 담을 때 쓰는 태그의 이름을 쓰시오.

## question: spring-03-q28
```json
{
  "title": "같은 객체 안의 호출이 프록시를 거치지 않는 현상",
  "topics": [
    "service-tx"
  ],
  "tags": [
    "self-invocation"
  ],
  "group": "service-tx",
  "type": "short",
  "id": "spring-03-q28",
  "revision": 1,
  "sourceRefs": [
    "SPR-L08 Service 트랜잭션 p.35",
    "spring-concepts Part 9"
  ],
  "difficulty": 2,
  "acceptedAnswers": [
    "자기 호출",
    "내부 호출",
    "self-invocation",
    "self invocation"
  ],
  "normalization": "none"
}
```
### stem
같은 클래스 안의 메서드가 `@Transactional` 메서드를 `this`로 직접 부르면 프록시를 거치지 않아 트랜잭션이 적용되지 않는다. 이 호출 방식을 가리키는 용어를 쓰시오.

## question: spring-03-q29
```json
{
  "title": "자원의 일부만 수정하는 HTTP 메서드",
  "topics": [
    "rest-api"
  ],
  "tags": [
    "rest-http-method"
  ],
  "group": "rest-api",
  "type": "short",
  "id": "spring-03-q29",
  "revision": 1,
  "sourceRefs": [
    "SPR-L09 REST p.50",
    "SPR-S11 HTTP와 REST p.30",
    "spring-concepts Part 10"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "PATCH"
  ],
  "normalization": "caseFold"
}
```
### stem
자원 전체를 교체하는 PUT과 달리 자원의 일부 필드만 바꿀 때 쓰는 HTTP 메서드의 이름을 쓰시오.

## question: spring-03-q30
```json
{
  "title": "현재 사용자의 인증 정보를 꺼내는 홀더 클래스",
  "topics": [
    "security"
  ],
  "tags": [
    "auth-info"
  ],
  "group": "security",
  "type": "short",
  "id": "spring-03-q30",
  "revision": 1,
  "sourceRefs": [
    "SPR-L11 인증 정보 p.35",
    "spring-concepts Part 11"
  ],
  "difficulty": 2,
  "acceptedAnswers": [
    "SecurityContextHolder"
  ],
  "normalization": "caseFold"
}
```
### stem
컨트롤러가 아닌 계층에서 현재 요청의 인증 정보를 꺼낼 때 `getContext().getAuthentication()`을 부르는 클래스의 이름을 쓰시오.

## question: spring-03-q31
```json
{
  "title": "REST 오류 응답의 계약",
  "topics": [
    "rest-api"
  ],
  "tags": [
    "rest-error"
  ],
  "group": "rest-api",
  "type": "essay",
  "id": "spring-03-q31",
  "revision": 1,
  "sourceRefs": [
    "SPR-L09 REST p.20",
    "SPR-S11 오류 응답 p.75",
    "spring-concepts Part 10"
  ],
  "difficulty": 3,
  "rubric": [
    {
      "id": "r0",
      "criterion": "없는 자원은 404이고 형식이 틀린 요청은 400이라고 서술한다",
      "points": 1
    },
    {
      "id": "r1",
      "criterion": "상태와 충돌하는 요청에는 409를 쓴다고 서술한다",
      "points": 1
    },
    {
      "id": "r2",
      "criterion": "오류 본문에 `code`와 `message`를 두고 내부 정보는 노출하지 않는다고 서술한다",
      "points": 1
    },
    {
      "id": "r3",
      "criterion": "오류를 200으로 알리면 클라이언트가 상태 코드로 실패를 구분할 수 없다고 서술한다",
      "points": 1
    }
  ],
  "modelAnswer": "**(1)** 없는 대여 조회는 404 Not Found이고 JSON 문법이 틀리거나 읽을 수 없는 요청은 400 Bad Request이다. 이미 대여 중인 장비를 다시 대여하는 것은 현재 상태와 충돌하므로 409 Conflict이다. 형식이 지원되지 않는 본문은 415이다.\n\n**(2)** `code`와 `message`처럼 클라이언트가 원인을 구분할 수 있는 약속된 항목을 JSON으로 둔다. 스택 트레이스, SQL, 서버 내부 경로 같은 내부 정보는 두지 않는다.\n\n**(3)** 클라이언트가 상태 코드로 성공과 실패를 구분할 수 없고 캐시와 모니터링 도구도 실패를 놓친다. 오류는 의미에 맞는 상태 코드와 JSON 본문을 함께 보낸다. 검증 환경에서 404와 JSON 본문, 415와 400 응답을 확인했다."
}
```
### stem
장비 대여 API가 없는 대여 조회, 잘못된 JSON 요청, 이미 대여 중인 장비 대여를 각각 처리한다. 다음을 서술하시오.

(1) 세 경우에 알맞은 상태 코드와 그 이유

(2) 오류 응답 본문에 둘 항목과 두지 말아야 할 항목

(3) 오류를 200과 본문의 실패 표시로 알릴 때의 문제

## question: spring-03-q32
```json
{
  "title": "인증과 인가 실패의 처리",
  "topics": [
    "security"
  ],
  "tags": [
    "authn-authz"
  ],
  "group": "security",
  "type": "essay",
  "id": "spring-03-q32",
  "revision": 1,
  "sourceRefs": [
    "SPR-L10 인증과 인가 p.5",
    "SPR-L10 인증과 인가 p.20",
    "spring-concepts Part 11"
  ],
  "difficulty": 3,
  "rubric": [
    {
      "id": "r0",
      "criterion": "웹 페이지 설정은 로그인 화면으로 redirect하고 API 설정은 401이라고 서술한다",
      "points": 1
    },
    {
      "id": "r1",
      "criterion": "권한이 없는 인증된 사용자는 403이라고 서술한다",
      "points": 1
    },
    {
      "id": "r2",
      "criterion": "인증 실패와 인가 실패의 구분 기준을 서술한다",
      "points": 1
    },
    {
      "id": "r3",
      "criterion": "CSRF 토큰이 없으면 403이고 보안 필터가 컨트롤러보다 앞이라 메서드가 실행되지 않는다고 서술한다",
      "points": 1
    }
  ],
  "modelAnswer": "**(1)** form 로그인 설정에서는 로그인 화면으로 redirect하는 302 응답이고 API용으로 `authenticationEntryPoint`를 401로 설정하면 401로 응답한다.\n\n**(2)** 인증은 되었지만 권한이 없으므로 403 Forbidden이다. 인증 실패(누구인지 모름)는 401이거나 로그인 화면이고 인가 실패(누구인지 알지만 허용되지 않음)는 403이다.\n\n**(3)** 변경 요청에 CSRF 토큰이 없으면 필터가 403으로 거부한다. 보안 필터는 DispatcherServlet보다 앞에 있으므로 거부된 요청의 컨트롤러 메서드는 실행되지 않는다. 검증 환경에서 컨트롤러 호출이 0회임을 확인했다."
}
```
### stem
form 로그인 화면이 있는 웹 페이지와 API가 같은 애플리케이션에 있다. `/me`는 로그인이 필요하고 `/admin/**`는 `ADMIN` 역할이 필요하며 CSRF 보호가 켜져 있다. 다음을 서술하시오.

(1) 로그인하지 않은 사용자가 `/me`를 요청했을 때 웹 페이지와 API 설정의 응답 차이

(2) `USER` 역할 사용자가 `/admin`을 요청했을 때의 응답과 그 구분 기준

(3) 로그인한 사용자가 CSRF 토큰 없이 `POST`를 보냈을 때의 결과와 이때 컨트롤러 메서드가 실행되는지 여부
