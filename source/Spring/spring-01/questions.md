## question: spring-01-q01
```json
{
  "title": "프레임워크와 라이브러리의 구분",
  "topics": [
    "foundation-boot"
  ],
  "tags": [
    "framework-role"
  ],
  "group": "foundation-boot",
  "type": "mc",
  "id": "spring-01-q01",
  "revision": 1,
  "sourceRefs": [
    "SPR-L01 Framework 개요 p.5",
    "SPR-S01 Framework 개요 p.15",
    "spring-concepts Part 1"
  ],
  "difficulty": 1,
  "correctChoiceId": "d"
}
```
### stem
프레임워크를 라이브러리와 구분해 주는 특징으로 알맞은 것은?
### choice: a
여러 프로젝트에서 다시 쓸 수 있는 코드를 묶어서 제공한다
### choice: b
개발자가 필요한 기능을 골라서 원하는 시점에 직접 호출한다
### choice: c
컴파일된 형태로 배포되어 프로젝트에 의존성으로 추가한다
### choice: d
정해진 실행 흐름 안에서 개발자가 쓴 코드를 대신 호출한다

## question: spring-01-q02
```json
{
  "title": "컴포넌트 스캔의 기준 패키지",
  "topics": [
    "foundation-boot"
  ],
  "tags": [
    "boot-autoconfig"
  ],
  "group": "foundation-boot",
  "type": "mc",
  "id": "spring-01-q02",
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
메인 클래스가 `com.study.app` 패키지에 있고 스캔 범위를 따로 지정하지 않았다. 다음 두 클래스 중 빈으로 등록되는 것은?
```java
package com.study.app;

@SpringBootApplication
public class StudyApplication {
}
```
```java
package com.study.app.room;

@Service
public class RoomService {
}
```
```java
package com.study.batch;

@Service
public class CleanupService {
}
```
### choice: a
`RoomService`와 `CleanupService`가 모두 등록된다
### choice: b
두 클래스 모두 스캔 범위에 들어가지 않아 등록되지 않는다
### choice: c
`RoomService`만 스캔되어 빈으로 등록된다
### choice: d
`CleanupService`만 스캔되어 빈으로 등록된다

## question: spring-01-q03
```json
{
  "title": "IoC와 DI의 관계",
  "topics": [
    "di-bean"
  ],
  "tags": [
    "ioc-container"
  ],
  "group": "di-bean",
  "type": "mc",
  "id": "spring-01-q03",
  "revision": 1,
  "sourceRefs": [
    "SPR-L02 의존성과 IoC p.10",
    "SPR-S03 IoC p.15",
    "spring-concepts Part 3"
  ],
  "difficulty": 1,
  "correctChoiceId": "a"
}
```
### stem
IoC와 DI의 관계를 바르게 설명한 것은?
### choice: a
IoC는 제어의 주체가 바뀐다는 원칙이고 DI는 그 원칙을 구현하는 방법이다
### choice: b
IoC는 객체를 주입하는 구체적인 방법이고 DI는 그것을 포함하는 원칙이다
### choice: c
IoC는 설정 클래스에 쓰는 방식이고 DI는 어노테이션에 쓰는 방식이다
### choice: d
IoC는 singleton 빈에 적용하는 원칙이고 DI는 prototype 빈에 적용한다

## question: spring-01-q04
```json
{
  "title": "등록 방식에 따른 빈의 기본 이름",
  "topics": [
    "di-bean"
  ],
  "tags": [
    "bean-registration"
  ],
  "group": "di-bean",
  "type": "mc",
  "id": "spring-01-q04",
  "revision": 1,
  "sourceRefs": [
    "SPR-L02 명시적 DI p.15",
    "SPR-S03 빈 관리 p.25",
    "spring-concepts Part 3"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
이름을 따로 지정하지 않았을 때 다음 두 빈의 이름을 순서대로 나열한 것은?
```java
@Configuration
public class AppConfig {
    @Bean
    public Clock studyClock() {
        return Clock.systemUTC();
    }
}
```
```java
@Component
public class RoomPolicy {
}
```
### choice: a
`studyClock`, `roomPolicy`
### choice: b
`clock`, `roomPolicy`
### choice: c
`studyClock`, `RoomPolicy`
### choice: d
`clock`, `RoomPolicy`

## question: spring-01-q05
```json
{
  "title": "@Primary와 @Qualifier가 함께 있을 때의 선택",
  "topics": [
    "di-bean"
  ],
  "tags": [
    "bean-selection"
  ],
  "group": "di-bean",
  "type": "mc",
  "id": "spring-01-q05",
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
`DiscountPolicy` 타입의 빈이 둘이다. `OrderService`에 주입되는 빈은?
```java
@Component
@Primary
public class RateDiscount implements DiscountPolicy {
}
```
```java
@Component
public class FixedDiscount implements DiscountPolicy {
}
```
```java
@Service
public class OrderService {
    private final DiscountPolicy policy;

    public OrderService(@Qualifier("fixedDiscount") DiscountPolicy policy) {
        this.policy = policy;
    }
}
```
### choice: a
`@Primary`가 붙은 `RateDiscount`가 주입된다
### choice: b
이름을 지정한 `FixedDiscount`가 주입된다
### choice: c
후보를 정하지 못해 시작할 때 실패한다
### choice: d
두 빈이 번갈아 가며 주입된다

## question: spring-01-q06
```json
{
  "title": "pointcut 식이 가리키는 AOP 용어",
  "topics": [
    "aop-proxy"
  ],
  "tags": [
    "aop-terms"
  ],
  "group": "aop-proxy",
  "type": "mc",
  "id": "spring-01-q06",
  "revision": 1,
  "sourceRefs": [
    "SPR-L05 AOP 한계 p.5",
    "SPR-S06 AOP 동작 p.10",
    "spring-concepts Part 4"
  ],
  "difficulty": 1,
  "correctChoiceId": "c"
}
```
### stem
다음 코드에서 `execution(..)`으로 쓴 식처럼 부가 기능을 적용할 메서드를 고르는 조건을 가리키는 용어는?
```java
@Before("execution(* com.study.room..*Service.*(..))")
public void logStart() {
}
```
### choice: a
advice
### choice: b
join point
### choice: c
pointcut
### choice: d
weaving

## question: spring-01-q07
```json
{
  "title": "한 aspect 안의 advice 실행 순서",
  "topics": [
    "aop-proxy"
  ],
  "tags": [
    "advice-types"
  ],
  "group": "aop-proxy",
  "type": "mc",
  "id": "spring-01-q07",
  "revision": 1,
  "sourceRefs": [
    "SPR-L04 advice p.25",
    "SPR-S06 advice p.35",
    "spring-concepts Part 4"
  ],
  "difficulty": 3,
  "correctChoiceId": "b"
}
```
### stem
Spring Framework 7에서 한 aspect의 advice 네 개가 `RoomService.findRoom()`에 모두 적용된다. `findRoom()`이 `T`를 출력하고 정상 반환할 때 출력 순서는?
```java
@Around("target()")
public Object around(ProceedingJoinPoint pjp) throws Throwable {
    System.out.print("A1 ");
    try {
        return pjp.proceed();
    } finally {
        System.out.print("A2 ");
    }
}

@Before("target()")
public void before() {
    System.out.print("B ");
}

@AfterReturning("target()")
public void afterReturning() {
    System.out.print("R ");
}

@After("target()")
public void after() {
    System.out.print("F ");
}
```
### choice: a
B A1 T A2 R F
### choice: b
A1 B T R F A2
### choice: c
A1 B T F R A2
### choice: d
B A1 T R F A2

## question: spring-01-q08
```json
{
  "title": "경로는 맞고 HTTP 메서드가 다른 요청의 응답",
  "topics": [
    "mvc-binding"
  ],
  "tags": [
    "request-mapping"
  ],
  "group": "mvc-binding",
  "type": "mc",
  "id": "spring-01-q08",
  "revision": 1,
  "sourceRefs": [
    "SPR-L05 Controller와 응답 p.25",
    "SPR-S07 MVC 요청 흐름 p.30",
    "spring-concepts Part 5"
  ],
  "difficulty": 2,
  "correctChoiceId": "b"
}
```
### stem
다음 컨트롤러만 있는 애플리케이션에 `DELETE /rooms` 요청을 보냈다. 응답 상태 코드는?
```java
@Controller
@RequestMapping("/rooms")
public class RoomController {
    @GetMapping
    public String list(@RequestParam int page, Model model) {
        model.addAttribute("page", page);
        return "room/list";
    }
}
```
### choice: a
400
### choice: b
405
### choice: c
404
### choice: d
200

## question: spring-01-q09
```json
{
  "title": "필수 @RequestParam이 없는 요청",
  "topics": [
    "mvc-binding"
  ],
  "tags": [
    "argument-binding"
  ],
  "group": "mvc-binding",
  "type": "mc",
  "id": "spring-01-q09",
  "revision": 1,
  "sourceRefs": [
    "SPR-L06 인자 바인딩 p.10",
    "SPR-S07 인자 바인딩 p.35",
    "spring-concepts Part 5"
  ],
  "difficulty": 2,
  "correctChoiceId": "d"
}
```
### stem
다음 핸들러에 쿼리 스트링 없이 `GET /rooms` 요청을 보냈다. 결과는?
```java
@GetMapping("/rooms")
public String list(@RequestParam int page, Model model) {
    model.addAttribute("page", page);
    return "room/list";
}
```
### choice: a
`page`에 0이 들어간 채로 핸들러가 실행된다
### choice: b
`page`에 null이 들어간 채로 핸들러가 실행된다
### choice: c
맞는 핸들러를 찾지 못해 404로 응답한다
### choice: d
핸들러가 실행되지 않고 400으로 응답한다

## question: spring-01-q10
```json
{
  "title": "뷰 이름이 JSP 경로로 바뀌는 과정",
  "topics": [
    "mvc-binding"
  ],
  "tags": [
    "model-view"
  ],
  "group": "mvc-binding",
  "type": "mc",
  "id": "spring-01-q10",
  "revision": 1,
  "sourceRefs": [
    "SPR-L05 Controller와 응답 p.30",
    "SPR-S07 Model과 View p.50",
    "spring-concepts Part 5"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
설정이 다음과 같을 때 `@Controller`의 핸들러가 문자열 `room/detail`을 반환했다. 이어지는 동작은?
```properties
spring.mvc.view.prefix=/WEB-INF/views/
spring.mvc.view.suffix=.jsp
```
### choice: a
`/WEB-INF/views/room/detail.jsp`로 forward한다
### choice: b
브라우저에 `/room/detail` 주소로 redirect 응답을 보내 다시 요청하게 한다
### choice: c
뷰 이름 문자열 `room/detail`을 HTTP 응답 본문에 그대로 쓴다
### choice: d
`/room/detail.jsp`를 정적 리소스 경로에서 찾아 그대로 응답한다

## question: spring-01-q11
```json
{
  "title": "인터셉터 두 개의 콜백 호출 순서",
  "topics": [
    "web-crosscut"
  ],
  "tags": [
    "interceptor"
  ],
  "group": "web-crosscut",
  "type": "mc",
  "id": "spring-01-q11",
  "revision": 1,
  "sourceRefs": [
    "SPR-S08 Interceptor p.10",
    "SPR-S08 Interceptor p.20",
    "spring-concepts Part 6"
  ],
  "difficulty": 3,
  "correctChoiceId": "d"
}
```
### stem
인터셉터 `1`과 `2`를 이 순서로 등록했다. 두 인터셉터의 `preHandle`이 모두 `true`를 반환하고 핸들러가 정상 종료할 때 호출 순서는? `pre1`은 인터셉터 1의 `preHandle`, `post1`은 `postHandle`, `after1`은 `afterCompletion`을 뜻한다.
### choice: a
pre1 pre2 handler post1 post2 after1 after2
### choice: b
pre1 pre2 handler post2 post1 after1 after2
### choice: c
pre2 pre1 handler post1 post2 after2 after1
### choice: d
pre1 pre2 handler post2 post1 after2 after1

## question: spring-01-q12
```json
{
  "title": "구현 클래스 없는 Mapper 인터페이스가 주입되는 이유",
  "topics": [
    "mybatis"
  ],
  "tags": [
    "mapper-interface"
  ],
  "group": "mybatis",
  "type": "mc",
  "id": "spring-01-q12",
  "revision": 1,
  "sourceRefs": [
    "SPR-L07 MyBatis 연동 p.20",
    "SPR-S09 MyBatis 설정 p.15",
    "spring-concepts Part 8"
  ],
  "difficulty": 1,
  "correctChoiceId": "b"
}
```
### stem
`@Mapper`를 붙인 인터페이스만 작성하고 구현 클래스는 만들지 않았는데 Service에 주입되어 동작한다. 그 이유는?
### choice: a
컴파일할 때 Lombok이 구현 클래스의 소스 코드를 만들어 주기 때문이다
### choice: b
실행 중에 MyBatis가 프록시 구현체를 만들어 빈으로 등록하기 때문이다
### choice: c
스프링이 인터페이스 자체를 객체로 만들어서 주입해 주기 때문이다
### choice: d
매퍼 XML 파일이 빌드 과정에서 자바 클래스로 변환되기 때문이다

## question: spring-01-q13
```json
{
  "title": "바인딩 표기에 조작된 문자열을 넣었을 때의 조회 결과",
  "topics": [
    "mybatis"
  ],
  "tags": [
    "param-binding"
  ],
  "group": "mybatis",
  "type": "mc",
  "id": "spring-01-q13",
  "revision": 1,
  "sourceRefs": [
    "SPR-L08 동적 SQL p.5",
    "SPR-S09 매퍼 XML p.25",
    "spring-concepts Part 8"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
`reservation` 테이블에 3행이 있고 `member_name`이 아래 문자열과 같은 행은 없다. 두 구문에 같은 값 `x' OR '1'='1`을 `name`으로 넘겼을 때 조회되는 행 수는?
```xml
<select id="findA" resultType="Reservation">
    SELECT * FROM reservation
    WHERE member_name = '${name}'
</select>
<select id="findB" resultType="Reservation">
    SELECT * FROM reservation
    WHERE member_name = #{name}
</select>
```
### choice: a
`findA`는 3행이고 `findB`는 0행이다
### choice: b
`findA`는 0행이고 `findB`는 3행이다
### choice: c
`findA`와 `findB` 모두 0행이다
### choice: d
`findA`와 `findB` 모두 3행이다

## question: spring-01-q14
```json
{
  "title": "컬럼 이름과 프로퍼티 이름이 다를 때의 resultType 매핑",
  "topics": [
    "mybatis"
  ],
  "tags": [
    "result-map"
  ],
  "group": "mybatis",
  "type": "mc",
  "id": "spring-01-q14",
  "revision": 1,
  "sourceRefs": [
    "SPR-L07 매퍼 p.30",
    "SPR-S09 resultMap p.45",
    "spring-concepts Part 8"
  ],
  "difficulty": 2,
  "correctChoiceId": "b"
}
```
### stem
`map-underscore-to-camel-case`는 기본값(`false`)이다. 조회된 행이 하나일 때 반환된 `Reservation` 객체의 상태는?
```xml
<select id="findById" resultType="Reservation">
    SELECT reservation_id, member_name, people
    FROM reservation
    WHERE reservation_id = #{id}
</select>
```
```java
public class Reservation {
    private Integer reservationId;
    private String memberName;
    private Integer people;
    // getter와 setter
}
```
### choice: a
세 프로퍼티에 모두 값이 들어 있다
### choice: b
`people`만 값이 있고 나머지는 null이다
### choice: c
세 프로퍼티가 모두 null인 빈 객체가 반환된다
### choice: d
매핑에 실패해 예외가 발생한다

## question: spring-01-q15
```json
{
  "title": "@Transactional을 Service에 두는 이유",
  "topics": [
    "service-tx"
  ],
  "tags": [
    "tx-boundary"
  ],
  "group": "service-tx",
  "type": "mc",
  "id": "spring-01-q15",
  "revision": 1,
  "sourceRefs": [
    "SPR-L08 Service 트랜잭션 p.15",
    "SPR-L08 Service 트랜잭션 p.20",
    "spring-concepts Part 9"
  ],
  "difficulty": 1,
  "correctChoiceId": "c"
}
```
### stem
예약을 저장하면서 스터디실의 남은 자리를 줄이는 기능에서 `@Transactional`을 Mapper가 아닌 Service 메서드에 붙이는 이유로 알맞은 것은?
### choice: a
Mapper는 인터페이스여서 어노테이션을 붙일 수 없기 때문이다
### choice: b
Service가 가장 먼저 실행되어 DB 연결을 일찍 얻기 때문이다
### choice: c
여러 SQL을 하나의 업무 단위로 묶는 곳이 Service이기 때문이다
### choice: d
Service의 메서드만 프록시로 감싸서 실행할 수 있기 때문이다

## question: spring-01-q16
```json
{
  "title": "예외 종류에 따른 기본 rollback 동작",
  "topics": [
    "service-tx"
  ],
  "tags": [
    "rollback-rules"
  ],
  "group": "service-tx",
  "type": "mc",
  "id": "spring-01-q16",
  "revision": 1,
  "sourceRefs": [
    "SPR-L08 Service 트랜잭션 p.25",
    "spring-concepts Part 9"
  ],
  "difficulty": 3,
  "correctChoiceId": "b"
}
```
### stem
`reservation` 테이블에 3행이 있다. `runtime()`을 호출한 뒤 `checked()`를 호출했고 두 호출은 모두 예외로 끝났다. `insert`는 한 행을 추가한다. 최종 행 수는?
```java
@Transactional
public void runtime() {
    mapper.insert(newReservation());
    throw new IllegalStateException();
}

@Transactional
public void checked() throws IOException {
    mapper.insert(newReservation());
    throw new IOException();
}
```
### choice: a
두 insert가 모두 취소되어 3행이다
### choice: b
`checked()`의 insert만 남아 4행이다
### choice: c
`runtime()`의 insert만 남아 4행이다
### choice: d
두 insert가 모두 반영되어 5행이다

## question: spring-01-q17
```json
{
  "title": "멱등하지 않은 HTTP 메서드",
  "topics": [
    "rest-api"
  ],
  "tags": [
    "rest-http-method"
  ],
  "group": "rest-api",
  "type": "mc",
  "id": "spring-01-q17",
  "revision": 1,
  "sourceRefs": [
    "SPR-L09 REST p.50",
    "SPR-S11 HTTP와 REST p.30",
    "spring-concepts Part 10"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
같은 요청을 두 번 보냈을 때 서버의 상태가 한 번 보낸 경우와 달라질 수 있는 것은?
### choice: a
`POST /api/rentals`로 대여를 등록한다
### choice: b
`PUT /api/rentals/3`으로 대여 정보를 교체한다
### choice: c
`DELETE /api/rentals/3`으로 대여를 삭제한다
### choice: d
`GET /api/rentals/3`으로 대여를 조회한다

## question: spring-01-q18
```json
{
  "title": "ResponseEntity.created의 상태 코드와 헤더",
  "topics": [
    "rest-api"
  ],
  "tags": [
    "response-entity"
  ],
  "group": "rest-api",
  "type": "mc",
  "id": "spring-01-q18",
  "revision": 1,
  "sourceRefs": [
    "SPR-S11 ResponseEntity p.60",
    "spring-concepts Part 10"
  ],
  "difficulty": 2,
  "correctChoiceId": "d"
}
```
### stem
다음 핸들러가 정상 실행되었을 때 응답의 상태 코드와 `Location` 헤더에 대한 설명으로 옳은 것은?
```java
@PostMapping("/api/rentals")
public ResponseEntity<RentalResponse> rent(@RequestBody RentalRequest request) {
    RentalResponse created = service.rent(request);
    URI location = URI.create("/api/rentals/" + created.rentalId());
    return ResponseEntity.created(location).body(created);
}
```
### choice: a
200 OK이고 `Location` 헤더는 없다
### choice: b
200 OK이고 `Location` 헤더가 있다
### choice: c
201 Created이고 `Location` 헤더는 없다
### choice: d
201 Created이고 `Location` 헤더가 있다

## question: spring-01-q19
```json
{
  "title": "보안 필터와 컨트롤러의 실행 순서",
  "topics": [
    "security"
  ],
  "tags": [
    "filter-chain"
  ],
  "group": "security",
  "type": "mc",
  "id": "spring-01-q19",
  "revision": 1,
  "sourceRefs": [
    "SPR-L10 SecurityFilterChain p.10",
    "spring-concepts Part 11"
  ],
  "difficulty": 2,
  "correctChoiceId": "c"
}
```
### stem
`anyRequest().authenticated()`로 보호된 `/me`를 로그인하지 않은 사용자가 요청했다. `/me`를 처리하는 컨트롤러 메서드에 대한 설명으로 옳은 것은?
### choice: a
실행된다. 인증 검사는 컨트롤러가 반환한 뒤에 이루어진다
### choice: b
실행된다. 인증 검사는 인터셉터의 `postHandle`에서 이루어진다
### choice: c
실행되지 않는다. 보안 필터가 먼저 요청을 막는다
### choice: d
실행되지 않는다. 컨트롤러의 AOP 프록시가 호출을 막는다

## question: spring-01-q20
```json
{
  "title": "인증 실패와 권한 부족의 응답 코드",
  "topics": [
    "security"
  ],
  "tags": [
    "authn-authz"
  ],
  "group": "security",
  "type": "mc",
  "id": "spring-01-q20",
  "revision": 1,
  "sourceRefs": [
    "SPR-L10 인증과 인가 p.5",
    "SPR-L10 인증과 인가 p.20",
    "spring-concepts Part 11"
  ],
  "difficulty": 2,
  "correctChoiceId": "c"
}
```
### stem
REST API의 보안 설정이 다음과 같다. `/admin` 요청을 로그인하지 않고 보낸 경우와 `USER` 권한만 가진 사용자가 로그인해서 보낸 경우의 응답 코드를 순서대로 나열한 것은?
```java
http.authorizeHttpRequests(auth -> auth
        .requestMatchers("/admin/**").hasRole("ADMIN")
        .anyRequest().authenticated())
    .exceptionHandling(e -> e.authenticationEntryPoint(
        new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)));
```
### choice: a
403, 403
### choice: b
401, 401
### choice: c
401, 403
### choice: d
403, 401

## question: spring-01-q21
```json
{
  "title": "넓은 규칙을 먼저 둔 인가 설정",
  "topics": [
    "security"
  ],
  "tags": [
    "authorize-rules"
  ],
  "group": "security",
  "type": "mc",
  "id": "spring-01-q21",
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
다음 설정에서 로그인하지 않은 사용자가 `GET /admin/reports/daily`를 요청했다. 이 경로를 처리하는 컨트롤러가 있을 때 응답은?
```java
http.authorizeHttpRequests(auth -> auth
        .requestMatchers("/**").permitAll()
        .requestMatchers("/admin/**").hasRole("ADMIN"));
```
### choice: a
로그인 화면으로 이동한다
### choice: b
401로 응답한다
### choice: c
403으로 응답한다
### choice: d
200으로 응답한다

## question: spring-01-q22
```json
{
  "title": "Boot의 기본 로깅 구현체",
  "topics": [
    "foundation-boot"
  ],
  "tags": [
    "logging-slf4j"
  ],
  "group": "foundation-boot",
  "type": "short",
  "id": "spring-01-q22",
  "revision": 1,
  "sourceRefs": [
    "SPR-L01 SLF4J 로깅 p.20",
    "SPR-S02 로깅 p.15",
    "spring-concepts Part 12"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "Logback",
    "로그백"
  ],
  "normalization": "caseFold"
}
```
### stem
SLF4J는 로깅 인터페이스이고 실제 출력은 구현체가 한다. Spring Boot가 기본으로 쓰는 구현체의 이름을 쓰시오.

## question: spring-01-q23
```json
{
  "title": "빈의 기본 scope",
  "topics": [
    "di-bean"
  ],
  "tags": [
    "bean-scope"
  ],
  "group": "di-bean",
  "type": "short",
  "id": "spring-01-q23",
  "revision": 1,
  "sourceRefs": [
    "SPR-S05 빈 scope p.45",
    "spring-concepts Part 3"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "singleton",
    "싱글톤",
    "싱글턴"
  ],
  "normalization": "caseFold"
}
```
### stem
scope를 지정하지 않은 빈은 컨테이너에 인스턴스가 하나만 만들어진다. 이 기본 scope의 이름을 쓰시오.

## question: spring-01-q24
```json
{
  "title": "execution 식에서 파라미터를 가리지 않는 표기",
  "topics": [
    "aop-proxy"
  ],
  "tags": [
    "pointcut-expression"
  ],
  "group": "aop-proxy",
  "type": "short",
  "id": "spring-01-q24",
  "revision": 1,
  "sourceRefs": [
    "SPR-L04 pointcut p.20",
    "SPR-S06 pointcut p.20",
    "spring-concepts Part 4"
  ],
  "difficulty": 2,
  "acceptedAnswers": [
    "(..)",
    ".."
  ],
  "normalization": "trim"
}
```
### stem
`execution(* com.study..*Service.find*(▢))`에서 파라미터의 개수와 타입을 가리지 않도록 ▢ 자리에 들어갈 표기를 쓰시오.

## question: spring-01-q25
```json
{
  "title": "등록 뒤 redirect로 조회하게 하는 패턴",
  "topics": [
    "mvc-binding"
  ],
  "tags": [
    "redirect-prg"
  ],
  "group": "mvc-binding",
  "type": "short",
  "id": "spring-01-q25",
  "revision": 1,
  "sourceRefs": [
    "SPR-L06 인자 바인딩 p.15",
    "SPR-S07 Model과 View p.55",
    "spring-concepts Part 5"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "PRG",
    "Post-Redirect-Get",
    "Post Redirect Get",
    "PRG 패턴"
  ],
  "normalization": "caseFold"
}
```
### stem
등록 요청(POST)을 처리한 뒤 화면을 바로 그리지 않고 redirect로 조회 요청(GET)을 다시 보내게 하면 새로 고침으로 같은 등록이 반복되지 않는다. 이 패턴의 이름을 쓰시오.

## question: spring-01-q26
```json
{
  "title": "검증 오류를 핸들러가 직접 처리하게 하는 파라미터",
  "topics": [
    "web-crosscut"
  ],
  "tags": [
    "validation"
  ],
  "group": "web-crosscut",
  "type": "short",
  "id": "spring-01-q26",
  "revision": 1,
  "sourceRefs": [
    "SPR-S07 Validation p.70",
    "spring-concepts Part 6"
  ],
  "difficulty": 2,
  "acceptedAnswers": [
    "BindingResult"
  ],
  "normalization": "caseFold"
}
```
### stem
`@Valid`를 붙인 파라미터 바로 다음에 두면 검증 오류가 있어도 핸들러가 실행되어 오류를 직접 처리할 수 있다. 이 파라미터의 타입 이름을 쓰시오.

## question: spring-01-q27
```json
{
  "title": "조건이 있을 때만 WHERE를 붙이는 동적 SQL 태그",
  "topics": [
    "mybatis"
  ],
  "tags": [
    "dynamic-sql"
  ],
  "group": "mybatis",
  "type": "short",
  "id": "spring-01-q27",
  "revision": 1,
  "sourceRefs": [
    "SPR-L08 동적 SQL p.10",
    "SPR-S09 동적 SQL p.35",
    "spring-concepts Part 8"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "where",
    "<where>"
  ],
  "normalization": "caseFold"
}
```
### stem
안의 내용이 있을 때만 `WHERE`를 붙이고 맨 앞에 남은 `AND`나 `OR`를 지워 주는 MyBatis 동적 SQL 태그의 이름을 쓰시오.

## question: spring-01-q28
```json
{
  "title": "@Transactional의 propagation 기본값",
  "topics": [
    "service-tx"
  ],
  "tags": [
    "propagation"
  ],
  "group": "service-tx",
  "type": "short",
  "id": "spring-01-q28",
  "revision": 1,
  "sourceRefs": [
    "SPR-L08 트랜잭션 전파 p.30",
    "spring-concepts Part 9"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "REQUIRED",
    "Propagation.REQUIRED"
  ],
  "normalization": "caseFold"
}
```
### stem
`@Transactional`에 `propagation`을 지정하지 않으면 진행 중인 트랜잭션이 있을 때 참여하고 없을 때 새로 시작한다. 이 기본 전파 속성의 이름을 쓰시오.

## question: spring-01-q29
```json
{
  "title": "JSON 본문을 객체로 받는 어노테이션",
  "topics": [
    "rest-api"
  ],
  "tags": [
    "json-body"
  ],
  "group": "rest-api",
  "type": "short",
  "id": "spring-01-q29",
  "revision": 1,
  "sourceRefs": [
    "SPR-L09 REST p.55",
    "SPR-S11 HTTP와 REST p.55",
    "spring-concepts Part 10"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "@RequestBody",
    "RequestBody"
  ],
  "normalization": "caseFold"
}
```
### stem
요청 본문의 JSON을 객체로 바꿔 핸들러의 파라미터로 받으려고 한다. 그 파라미터에 붙이는 어노테이션을 쓰시오.

## question: spring-01-q30
```json
{
  "title": "UserDetailsService의 사용자 조회 메서드",
  "topics": [
    "security"
  ],
  "tags": [
    "user-details"
  ],
  "group": "security",
  "type": "short",
  "id": "spring-01-q30",
  "revision": 1,
  "sourceRefs": [
    "SPR-L10 사용자와 권한 설정 p.35",
    "SPR-L11 사용자 정의 인증 p.10",
    "spring-concepts Part 11"
  ],
  "difficulty": 2,
  "acceptedAnswers": [
    "loadUserByUsername",
    "loadUserByUsername()"
  ],
  "normalization": "caseFold"
}
```
### stem
로그인할 때 사용자 이름으로 사용자 정보를 조회하기 위해 `UserDetailsService`에 구현하는 메서드의 이름을 쓰시오.

## question: spring-01-q31
```json
{
  "title": "생성자 주입을 선택하는 근거",
  "topics": [
    "di-bean"
  ],
  "tags": [
    "constructor-injection"
  ],
  "group": "di-bean",
  "type": "essay",
  "id": "spring-01-q31",
  "revision": 1,
  "sourceRefs": [
    "SPR-L02 묵시적 DI p.25",
    "SPR-S03 DI p.40",
    "spring-concepts Part 3"
  ],
  "difficulty": 3,
  "rubric": [
    {
      "id": "r0",
      "criterion": "`final` 필드로 의존성을 고정해 불변을 지킬 수 있다고 서술한다",
      "points": 1
    },
    {
      "id": "r1",
      "criterion": "의존성 없이는 객체를 만들 수 없어 누락이 드러나거나 컨테이너 없이 테스트하기 쉽다고 서술한다",
      "points": 1
    },
    {
      "id": "r2",
      "criterion": "생성자가 하나이면 `@Autowired` 없이 주입된다고 서술한다",
      "points": 1
    },
    {
      "id": "r3",
      "criterion": "순환 의존으로 빈을 만들 수 없고 애플리케이션 시작 시점에 실패한다고 서술한다",
      "points": 1
    }
  ],
  "modelAnswer": "**(1)** 의존성을 `final` 필드에 담을 수 있어 객체가 만들어진 뒤 바뀌지 않는다. 또 의존성 없이는 생성자를 호출할 수 없으므로 누락이 바로 드러나고 컨테이너 없이 테스트할 때도 생성자로 가짜 객체를 넣을 수 있다.\n\n**(2)** 쓰지 않아도 된다. 생성자가 하나뿐이면 스프링이 그 생성자로 의존성을 주입한다.\n\n**(3)** 서로를 만들려면 상대가 먼저 있어야 하므로 어느 쪽도 만들 수 없다. 이 순환 의존은 애플리케이션이 시작할 때 빈 생성 오류로 드러나며 요청을 처리하는 중에 뒤늦게 나타나지 않는다. 한쪽의 의존을 없애도록 책임을 나누어 해결한다."
}
```
### stem
`ReservationService`는 `ReservationMapper`와 `RoomPolicy`에 의존한다. 필드에 `@Autowired`를 붙인 코드를 생성자 주입으로 바꾸려고 한다. 다음을 서술하시오.

(1) 필드 주입과 비교한 생성자 주입의 장점 두 가지

(2) 생성자가 하나뿐일 때 `@Autowired`를 써야 하는지 여부

(3) 두 빈이 서로를 생성자로 주입받도록 작성되었을 때 일어나는 일과 그것이 드러나는 시점

## question: spring-01-q32
```json
{
  "title": "Spring MVC의 요청 처리 흐름",
  "topics": [
    "mvc-binding"
  ],
  "tags": [
    "dispatcher-flow"
  ],
  "group": "mvc-binding",
  "type": "essay",
  "id": "spring-01-q32",
  "revision": 1,
  "sourceRefs": [
    "SPR-S07 MVC 요청 흐름 p.10",
    "spring-concepts Part 5"
  ],
  "difficulty": 3,
  "rubric": [
    {
      "id": "r0",
      "criterion": "DispatcherServlet이 모든 요청을 먼저 받는다고 서술한다",
      "points": 1
    },
    {
      "id": "r1",
      "criterion": "HandlerMapping이 핸들러를 찾고 HandlerAdapter가 실행한다고 구분해 서술한다",
      "points": 1
    },
    {
      "id": "r2",
      "criterion": "핸들러가 Service를 호출하고 Model에 값을 담아 뷰 이름을 반환한다고 서술한다",
      "points": 1
    },
    {
      "id": "r3",
      "criterion": "ViewResolver가 뷰 이름을 JSP로 바꾸고 View가 Model로 응답 화면을 만든다고 서술한다",
      "points": 1
    }
  ],
  "modelAnswer": "**(1)** 모든 요청은 Front Controller인 DispatcherServlet이 먼저 받는다. DispatcherServlet은 HandlerMapping에 물어 요청 URL과 HTTP 메서드에 맞는 핸들러를 찾고 HandlerAdapter를 통해 그 핸들러를 실행한다. HandlerAdapter는 `@PathVariable` 같은 파라미터를 바인딩해 넘긴다.\n\n**(2)** 핸들러는 Service를 호출해 스터디실 정보를 얻고 화면에 필요한 값을 Model에 담은 뒤 뷰 이름을 반환한다.\n\n**(3)** ViewResolver가 뷰 이름에 prefix와 suffix를 붙여 실제 JSP를 정한다. View가 Model의 값으로 화면을 만들어 응답한다."
}
```
### stem
브라우저가 보낸 `GET /rooms/3` 요청이 JSP 화면으로 응답되기까지의 과정을 Spring MVC의 구성 요소를 들어 서술하시오.

(1) 요청을 가장 먼저 받는 구성 요소와 핸들러를 찾는 구성 요소, 핸들러를 실행하는 구성 요소

(2) 컨트롤러의 핸들러가 하는 일과 반환하는 값

(3) 반환값이 실제 화면으로 바뀌어 응답되는 과정
