# Spring 개념 요약 노트

Spring 강의(Framework와 Boot, DI, AOP, MVC, MyBatis, 트랜잭션, REST, Security)를 개념 중심으로 다시 정리한 노트이다. 예제 코드와 데이터는 모두 이 노트를 위해 새로 만든 것이다. 각 Part는 핵심 설명, 짧은 예제, 혼동 포인트, 복습 질문 순서로 구성한다. 버전에 따라 달라지는 동작은 연습용 검증 환경(Spring Boot 4.1, Spring Framework 7.0, Spring Security 7.1, MyBatis 3.5, MySQL 8.4)을 기준으로 적었다. 수업 환경이 이 조합과 같은지는 아직 확인하지 못했다.

## Part 1. Framework와 Spring의 구성

### 1. Framework와 Library

| 구분 | 흐름의 주인 | 개발자가 하는 일 |
|---|---|---|
| Library | 내 코드 | 필요할 때 라이브러리의 기능을 호출한다 |
| Framework | 프레임워크 | 정해진 자리에 코드를 채우고 호출은 프레임워크가 한다 |

- Framework는 애플리케이션의 뼈대와 실행 흐름을 제공한다. 개발자는 그 흐름이 부르는 지점에 업무 코드를 둔다.
- 호출의 주도권이 프레임워크에 있다는 점이 **IoC(제어의 역전)** 이다. 객체의 생성과 연결도 컨테이너가 맡는다.

### 2. Spring의 세 축

| 축 | 뜻 | 대표 기능 |
|---|---|---|
| IoC와 DI | 객체 생성과 연결을 컨테이너가 맡는다 | `@Component`, `@Bean`, 생성자 주입 |
| AOP | 여러 곳에 흩어진 부가 기능을 한곳에 모은다 | `@Aspect`, `@Transactional` |
| PSA | 기술이 달라도 같은 방식으로 쓰게 하는 추상화 | `PlatformTransactionManager`, `@RequestMapping` |

- 이 세 가지는 평범한 자바 객체(POJO)로 업무 코드를 쓰게 하려는 장치이다. 업무 클래스가 특정 기술의 클래스를 상속하지 않아도 된다.

### 3. 계층 구조와 학습 지도

```graph
Controller -> Service
Service -> Mapper
Mapper -> DB
```

| 계층 | 책임 | 이 노트의 Part |
|---|---|---|
| Controller | 요청을 받고 응답 형식을 정한다 | 5, 6, 7, 10 |
| Service | 업무 규칙과 트랜잭션 경계 | 9 |
| Mapper | SQL 실행과 결과 매핑 | 8 |
| 공통 기반 | 빈 관리, 프록시, 보안 필터 | 3, 4, 11 |

### 혼동 포인트

- IoC는 원칙이고 DI는 그 원칙을 구현하는 한 가지 방법이다. 둘을 같은 말로 쓰지 않는다.
- Spring Framework와 Spring Boot는 다른 것이다. Boot는 Framework 위에서 설정과 실행을 쉽게 해 주는 도구이다.

### 복습 질문

1. Library와 Framework를 가르는 기준은 무엇인가?
   답: 실행 흐름의 주도권이다. Library는 내 코드가 호출하고 Framework는 프레임워크가 내 코드를 호출한다.
2. PSA의 예를 하나 들어 보라.
   답: `PlatformTransactionManager`이다. JDBC든 다른 데이터 접근 기술이든 같은 `@Transactional`로 트랜잭션을 다룬다.

## Part 2. Spring Boot와 설정

### 1. Boot가 해 주는 일

| 기능 | 내용 |
|---|---|
| starter | 함께 쓰는 라이브러리 묶음과 서로 맞는 버전을 한 번에 가져온다 |
| 자동 구성 | classpath와 이미 등록된 빈을 보고 필요한 빈을 조건부로 등록한다 |
| 내장 서버 | Tomcat을 품고 `main` 메서드로 실행한다 |
| 외부 설정 | `application.properties`와 환경 변수로 값을 바꾼다 |

- `spring-boot-starter-parent`가 의존성 버전을 관리하므로 관리 대상 라이브러리는 `<version>`을 쓰지 않는다. 관리 대상이 아닌 라이브러리(예: MyBatis starter)는 버전을 직접 쓴다.
- Boot 4에서 Spring MVC starter의 이름은 `spring-boot-starter-webmvc`이다.

### 2. @SpringBootApplication

```java
@SpringBootApplication
public class StudyRoomApplication {
    public static void main(String[] args) {
        SpringApplication.run(StudyRoomApplication.class, args);
    }
}
```

| 포함된 어노테이션 | 역할 |
|---|---|
| `@SpringBootConfiguration` | 이 클래스가 설정 클래스임을 알린다 |
| `@EnableAutoConfiguration` | 자동 구성을 켠다 |
| `@ComponentScan` | 이 클래스의 패키지와 그 하위 패키지에서 컴포넌트를 찾는다 |

- 컴포넌트 스캔의 기준은 **메인 클래스의 패키지**이다. 메인 클래스가 `com.study.app`에 있으면 `com.study.other`의 `@Service`는 찾지 못한다.
- 자동 구성은 조건부이다. 예를 들어 개발자가 `DataSource` 빈을 직접 등록하면 자동 구성의 `DataSource`는 등록되지 않는다.

### 3. 설정 값 읽기

```properties
server.port=8081
room.open-hour=9
spring.datasource.password=${DB_PASSWORD}
```

```java
@Component
public class RoomPolicy {
    private final int openHour;

    public RoomPolicy(@Value("${room.open-hour:8}") int openHour) {
        this.openHour = openHour;
    }
}
```

| 방법 | 특징 |
|---|---|
| `@Value("${키:기본값}")` | 값 하나를 주입한다. 키가 없고 기본값도 없으면 시작할 때 실패한다 |
| `@ConfigurationProperties(prefix = "room")` | 같은 접두사의 값을 객체 하나에 묶는다. `open-hour`가 `openHour`에 들어간다 |

- 같은 키가 여러 곳에 있으면 명령행 인자, 환경 변수, 설정 파일 순으로 앞의 것이 이긴다.
- 비밀번호 같은 값은 설정 파일에 직접 쓰지 않고 `${DB_PASSWORD}`처럼 환경 변수를 가리키게 한다.

### 4. JSP와 packaging

- JSP를 쓰려면 `tomcat-embed-jasper`와 JSTL 의존성을 더하고 `spring.mvc.view.prefix`와 `spring.mvc.view.suffix`를 정한다.
- JSP는 실행 가능한 jar에서 지원되지 않는다. JSP 화면이 있는 프로젝트는 packaging을 `war`로 둔다. REST API만 있는 프로젝트는 `jar`로 충분하다.

### 혼동 포인트

- 자동 구성은 개발자의 설정을 덮어쓰지 않는다. 개발자가 등록한 빈이 있으면 물러난다.
- `@Value`의 `${}`는 설정 값을 가리키고 `#{}`는 SpEL 식이다. MyBatis의 `#{}`와는 관계가 없다.

### 복습 질문

1. 메인 클래스의 패키지 밖에 둔 `@Service`가 빈으로 등록되지 않는 이유는?
   답: `@SpringBootApplication`의 컴포넌트 스캔이 메인 클래스의 패키지와 그 하위만 찾기 때문이다.
2. `@Value("${room.open-hour:8}")`에서 `:8`의 뜻은?
   답: `room.open-hour` 키가 없을 때 쓰는 기본값이다.

## Part 3. DI와 빈 관리

### 1. 의존성과 DI

```graph
ReservationController -> ReservationService
ReservationService -> ReservationMapper
ReservationService -> RoomPolicy
```

- A가 B의 기능을 써야 일할 수 있으면 A는 B에 의존한다. A가 `new B()`로 직접 만들면 B를 바꿀 때 A의 코드도 바뀐다.
- DI는 필요한 객체를 밖에서 넣어 주는 방식이다. Spring에서는 컨테이너가 빈을 만들고 넣어 준다.

### 2. 빈 등록 방법

| 방식 | 코드 | 쓰는 경우 |
|---|---|---|
| 묵시적 등록 | 클래스에 `@Component`, `@Service`, `@Repository`, `@Controller` | 직접 작성한 클래스 |
| 명시적 등록 | `@Configuration` 클래스의 `@Bean` 메서드 | 외부 라이브러리의 클래스, 생성 과정을 직접 정할 때 |

```java
@Configuration
public class ClockConfig {
    @Bean
    public Clock clock() {
        return Clock.systemDefaultZone();
    }
}
```

- `@Bean` 메서드의 빈 이름은 기본으로 메서드 이름이다. `@Component` 계열은 클래스 이름의 첫 글자를 소문자로 바꾼 이름이다.

### 3. 주입 방법

```java
@Service
public class ReservationService {
    private final ReservationMapper mapper;
    private final RoomPolicy policy;

    public ReservationService(ReservationMapper mapper, RoomPolicy policy) {
        this.mapper = mapper;
        this.policy = policy;
    }
}
```

| 방법 | 장점 | 한계 |
|---|---|---|
| 생성자 주입 | `final`로 불변을 지키고 의존성이 빠지면 객체를 만들 수 없다 | 순환 의존이 있으면 시작할 때 실패한다 |
| setter 주입 | 선택적 의존성을 나중에 넣을 수 있다 | 주입 전의 불완전한 객체가 생길 수 있다 |
| 필드 주입 | 코드가 짧다 | 컨테이너 없이는 값을 넣기 어려워 테스트하기 불편하다 |

- 생성자가 하나뿐이면 `@Autowired`를 쓰지 않아도 그 생성자로 주입한다.
- 순환 의존이 시작 시점에 드러나는 것은 생성자 주입의 장점이기도 하다.

### 4. 같은 타입의 빈이 둘일 때

```java
public interface DiscountPolicy {
    int discount(int price);
}

@Component
@Primary
public class RateDiscount implements DiscountPolicy {
    public int discount(int price) {
        return price / 10;
    }
}

@Component
public class FixedDiscount implements DiscountPolicy {
    public int discount(int price) {
        return 1000;
    }
}
```

| 상황 | 결과 |
|---|---|
| 후보가 둘이고 기준이 없다 | `NoUniqueBeanDefinitionException`으로 시작에 실패한다 |
| 한쪽에 `@Primary` | 그 빈이 선택된다 |
| 주입 지점에 `@Qualifier("fixedDiscount")` | 지정한 빈이 선택된다. `@Primary`보다 우선한다 |
| 파라미터 이름이 빈 이름과 같다 | 이름이 같은 빈이 선택된다 |
| `List<DiscountPolicy>`로 받는다 | 해당 타입의 빈이 모두 들어온다 |

### 5. scope와 생명주기

| scope | 인스턴스 | 비고 |
|---|---|---|
| singleton | 컨테이너에 하나 | 기본값이다. 상태를 필드에 두면 모든 요청이 공유한다 |
| prototype | 요청할 때마다 새로 만든다 | 컨테이너가 소멸 콜백을 부르지 않는다 |
| request, session | 웹 요청이나 세션마다 하나 | 웹 환경에서만 쓴다 |

```text
생성자 호출 → 의존성 주입 → @PostConstruct → 사용 → @PreDestroy
```

- `@PostConstruct`는 의존성 주입이 끝난 뒤에 불린다. 생성자 안에서는 필드 주입 대상이 아직 `null`일 수 있다.
- singleton 빈에 prototype 빈을 주입하면 주입은 한 번뿐이므로 같은 인스턴스를 계속 쓴다. 매번 새 객체가 필요하면 `ObjectProvider`로 꺼낸다.

### 혼동 포인트

- singleton scope는 컨테이너 안에서 빈 정의 하나당 인스턴스가 하나라는 뜻이다. 디자인 패턴의 Singleton처럼 클래스가 스스로 하나를 보장하는 것이 아니다.
- `@Qualifier`와 `@Primary`가 함께 있으면 더 구체적인 `@Qualifier`가 이긴다.

### 복습 질문

1. 생성자 주입을 권장하는 이유 두 가지는?
   답: 필드를 `final`로 두어 불변을 지킬 수 있고 의존성 없이는 객체를 만들 수 없어 누락이 바로 드러난다.
2. 같은 타입의 빈이 둘인데 `@Primary`와 `@Qualifier`가 없고 이름도 다르면?
   답: 후보를 하나로 정할 수 없어 `NoUniqueBeanDefinitionException`이 나고 애플리케이션이 시작되지 않는다.
3. prototype 빈의 `@PreDestroy`는 컨테이너를 닫을 때 불리는가?
   답: 불리지 않는다. 컨테이너는 prototype 빈을 만들어 건넨 뒤에는 관리하지 않는다.

## Part 4. AOP와 프록시

### 1. 용어

| 용어 | 뜻 |
|---|---|
| target | 부가 기능을 적용할 원래 객체 |
| join point | advice가 끼어들 수 있는 지점. Spring AOP에서는 메서드 실행이다 |
| pointcut | 어떤 join point에 적용할지 고르는 식 |
| advice | 끼어들어 실행할 부가 기능과 그 시점 |
| aspect | pointcut과 advice를 묶은 모듈 |
| weaving | target에 aspect를 엮는 과정. Spring AOP는 실행 중에 프록시를 만들어 엮는다 |

### 2. 프록시 동작

```graph
호출자 -> 프록시
프록시 -> advice
프록시 -> target
```

- 컨테이너는 pointcut에 걸리는 빈 대신 **프록시 객체**를 빈으로 등록한다. 호출자는 프록시를 주입받고 프록시가 advice를 실행한 뒤 target을 부른다.
- Boot의 기본은 클래스를 상속해 만드는 CGLIB 프록시이다. 그래서 `final` 클래스와 `final` 메서드, `private` 메서드에는 적용되지 않는다.

### 3. pointcut 식

```java
@Aspect
@Component
public class TimingAspect {
    @Pointcut("execution(* com.study.room.service..*Service.find*(..))")
    public void finders() {
    }

    @Around("finders()")
    public Object time(ProceedingJoinPoint pjp) throws Throwable {
        long start = System.nanoTime();
        try {
            return pjp.proceed();
        } finally {
            log.debug("{} {}ns", pjp.getSignature().getName(), System.nanoTime() - start);
        }
    }
}
```

| 식의 부분 | 뜻 |
|---|---|
| 첫 `*` | 반환 타입이 무엇이든 |
| `service..` | `service` 패키지와 그 하위 패키지 |
| `*Service` | 이름이 Service로 끝나는 타입 |
| `find*(..)` | 이름이 find로 시작하고 파라미터는 무엇이든 |

- `(*)`는 파라미터가 정확히 하나, `(..)`는 0개 이상이다.
- `@annotation(패키지.어노테이션)`은 해당 어노테이션이 붙은 메서드를 고른다. `within(타입 패턴)`은 타입 안의 모든 메서드를 고른다.

### 4. advice 종류

| advice | 실행 시점 | 특징 |
|---|---|---|
| `@Before` | target 실행 전 | 예외를 던지면 target이 실행되지 않는다 |
| `@AfterReturning` | 정상 반환 뒤 | `returning`으로 반환값을 받는다 |
| `@AfterThrowing` | 예외가 던져진 뒤 | 예외를 삼키지 못한다. 예외는 계속 전파된다 |
| `@After` | 정상이든 예외든 끝난 뒤 | `finally`와 같다 |
| `@Around` | 실행 전후를 모두 감싼다 | `proceed()`를 부르지 않으면 target이 실행되지 않는다 |

- 같은 aspect 안에서 한 메서드에 여러 advice가 걸리면 정상 흐름의 순서는 Around 앞부분, Before, target, AfterReturning, After, Around 뒷부분이다.
- `@Around`에서 `proceed()`의 반환값을 돌려주지 않으면 호출자는 `null`을 받는다.

### 5. 프록시 방식의 한계

```java
@Service
public class ReportService {
    public void daily() {
        summarize();
    }

    @Timed
    public void summarize() {
    }
}
```

- 밖에서 `reportService.daily()`를 부르면 프록시를 거치지만 그 안의 `summarize()` 호출은 `this.summarize()`이므로 프록시를 거치지 않는다. 이를 **자기 호출**이라 하며 advice가 실행되지 않는다.
- 해결 방법은 대상 메서드를 다른 빈으로 옮기는 것이다. `@Transactional`도 같은 프록시 방식이므로 같은 한계가 있다(Part 9).

### 혼동 포인트

- Spring AOP의 join point는 빈의 메서드 실행뿐이다. 필드 접근이나 생성자 호출에는 끼어들지 못한다.
- `@AfterThrowing`은 예외를 보고 기록할 뿐이다. 예외를 바꾸거나 없애려면 `@Around`에서 `try`와 `catch`를 쓴다.

### 복습 질문

1. `execution(* *..*Service.*(..))`에서 `(..)`의 뜻은?
   답: 파라미터의 개수와 타입을 가리지 않는다는 뜻이다.
2. 같은 클래스 안에서 부른 메서드에 advice가 적용되지 않는 이유는?
   답: 내부 호출은 프록시가 아닌 target 자신(`this`)의 메서드를 직접 부르기 때문이다.
3. `@Around` advice에서 `proceed()`를 부르지 않으면?
   답: target 메서드가 실행되지 않는다.

## Part 5. Spring MVC 요청 처리

### 1. 요청 흐름

```graph
브라우저 -> DispatcherServlet
DispatcherServlet -> HandlerMapping
DispatcherServlet -> HandlerAdapter
HandlerAdapter -> Controller
DispatcherServlet -> ViewResolver
DispatcherServlet -> View
```

| 순서 | 구성 요소 | 하는 일 |
|---|---|---|
| 1 | DispatcherServlet | 모든 요청을 가장 먼저 받는 Front Controller |
| 2 | HandlerMapping | 요청 URL과 메서드에 맞는 핸들러(컨트롤러 메서드)를 찾는다 |
| 3 | HandlerAdapter | 파라미터를 바인딩하고 핸들러를 실행한다 |
| 4 | Controller | Service를 부르고 Model에 값을 담은 뒤 뷰 이름을 반환한다 |
| 5 | ViewResolver | 뷰 이름을 실제 View(JSP 경로)로 바꾼다 |
| 6 | View | Model의 값으로 응답 화면을 만든다 |

### 2. 매핑

```java
@Controller
@RequestMapping("/rooms")
public class RoomController {
    @GetMapping("/{roomId}")
    public String detail(@PathVariable int roomId, Model model) {
        model.addAttribute("room", service.find(roomId));
        return "room/detail";
    }
}
```

- 클래스의 `@RequestMapping` 경로와 메서드의 경로를 이어 붙인다. 위 메서드는 `GET /rooms/3`을 처리한다.
- 경로는 맞지만 HTTP 메서드가 맞는 핸들러가 없으면 **405**, 경로 자체가 없으면 **404**이다.
- `prefix`가 `/WEB-INF/views/`이고 `suffix`가 `.jsp`이면 `room/detail`은 `/WEB-INF/views/room/detail.jsp`가 된다.

### 3. 파라미터 바인딩

| 어노테이션 | 값의 출처 | 값이 없을 때 |
|---|---|---|
| `@RequestParam` | 쿼리 스트링과 form 필드 | 기본은 필수이므로 **400**. `required = false`나 `defaultValue`로 바꾼다 |
| `@PathVariable` | URL 경로의 `{이름}` | 경로가 맞지 않으므로 매핑되지 않는다 |
| `@ModelAttribute` | 파라미터 이름과 같은 프로퍼티에 값을 채운 객체 | 없는 값은 채우지 않고 넘어간다 |
| `@RequestBody` | 요청 본문(JSON) | 본문이 없으면 400 |

- 숫자 파라미터에 `abc`처럼 변환할 수 없는 값이 오면 400이다.
- `int`처럼 기본형으로 받는 선택 파라미터는 `null`을 담을 수 없으므로 `Integer`나 `defaultValue`를 쓴다.
- 어노테이션 없이 DTO를 파라미터로 두면 `@ModelAttribute`가 붙은 것처럼 동작하고 Model에도 자동으로 담긴다.

### 4. Model과 View, redirect

| 반환값 | 동작 |
|---|---|
| `"room/list"` | ViewResolver가 JSP로 forward한다. Model의 값은 request scope에서 읽는다 |
| `"redirect:/rooms"` | 302 응답으로 브라우저가 새 요청을 보낸다. Model의 값은 사라진다 |
| `"forward:/rooms"` | 서버 안에서 다른 핸들러로 넘긴다. URL은 바뀌지 않는다 |

```java
@PostMapping
public String create(ReservationForm form, RedirectAttributes attrs) {
    int id = service.reserve(form);
    attrs.addFlashAttribute("message", "예약했습니다");
    return "redirect:/reservations/" + id;
}
```

- 등록, 수정, 삭제 뒤에는 redirect로 조회 화면을 다시 요청하게 한다. 이것이 **PRG(Post-Redirect-Get)** 이며 새로 고침으로 같은 POST가 다시 전송되는 일을 막는다.
- `addFlashAttribute`의 값은 세션에 잠시 보관되었다가 redirect 뒤의 첫 요청에서 Model로 옮겨지고 지워진다. `addAttribute`의 값은 URL의 쿼리 스트링에 붙는다.

### 혼동 포인트

- `@RequestParam`은 기본이 필수이고 `@ModelAttribute`의 프로퍼티는 없어도 오류가 아니다.
- redirect는 요청이 두 번이므로 첫 요청의 request scope 값을 두 번째 요청에서 쓸 수 없다.

### 복습 질문

1. 요청 URL에 맞는 컨트롤러 메서드를 찾는 구성 요소는?
   답: HandlerMapping이다. 실행은 HandlerAdapter가 한다.
2. `@RequestParam int page`인 핸들러에 `page` 없이 요청하면?
   답: 필수 파라미터가 없으므로 400 Bad Request이다.
3. 등록 처리 뒤에 forward가 아니라 redirect를 쓰는 이유는?
   답: 새로 고침할 때 같은 POST가 다시 전송되어 중복 등록되는 것을 막기 위해서이다.

## Part 6. Interceptor, Validation, 예외 처리

### 1. HandlerInterceptor

| 콜백 | 시점 | 비고 |
|---|---|---|
| `preHandle` | 핸들러 실행 전 | `false`를 반환하면 핸들러와 뒤의 인터셉터를 실행하지 않는다 |
| `postHandle` | 핸들러가 정상 종료한 뒤, 뷰 렌더링 전 | 핸들러가 예외를 던지면 불리지 않는다 |
| `afterCompletion` | 뷰 렌더링까지 끝난 뒤 | `preHandle`이 `true`였던 인터셉터는 예외가 나도 불린다 |

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LoginCheckInterceptor())
                .addPathPatterns("/reservations/**")
                .excludePathPatterns("/reservations/guide");
    }
}
```

- 인터셉터가 둘이면 `preHandle`은 등록한 순서로, `postHandle`과 `afterCompletion`은 그 반대 순서로 불린다.

### 2. Filter, Interceptor, AOP

| 구분 | 위치 | 다루는 대상 |
|---|---|---|
| Filter | 서블릿 필터 체인에서 `chain.doFilter` 호출 전후 | 매핑된 요청의 인코딩 설정이나 요청 래핑 |
| HandlerInterceptor | Spring MVC에서 핸들러가 선택된 뒤 | 컨트롤러 메서드별 처리 시간 기록 |
| Spring AOP | 프록시를 거치는 빈의 메서드 실행 | 서비스 메서드의 트랜잭션 관리 |

### 3. Validation

```java
public class ReservationForm {
    @NotBlank
    private String memberName;

    @Min(1)
    @Max(8)
    private int people;
}

@PostMapping
public String create(@Valid @ModelAttribute("form") ReservationForm form,
        BindingResult result) {
    if (result.hasErrors()) {
        return "reservation/form";
    }
    service.reserve(form);
    return "redirect:/reservations";
}
```

- `@Valid`가 붙은 객체 **바로 다음**에 `BindingResult`를 두면 검증 오류가 있어도 핸들러가 실행된다. 오류 처리 방법을 핸들러가 정한다.
- `BindingResult`가 없으면 검증 실패가 예외가 되어 핸들러 본문이 실행되지 않고 400으로 응답한다.
- `@NotNull`은 null만, `@NotEmpty`는 null과 빈 값까지, `@NotBlank`는 공백뿐인 문자열까지 막는다.

### 4. 예외 처리

```java
@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ReservationNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String notFound(ReservationNotFoundException e, Model model) {
        model.addAttribute("message", e.getMessage());
        return "error/not-found";
    }
}
```

| 위치 | 적용 범위 |
|---|---|
| 컨트롤러 안의 `@ExceptionHandler` | 그 컨트롤러에서 난 예외 |
| `@ControllerAdvice` 안의 `@ExceptionHandler` | 모든 컨트롤러에서 난 예외 |

- 같은 예외를 둘 다 처리할 수 있으면 컨트롤러 안의 핸들러가 먼저다. 예외 타입은 더 구체적인 쪽이 선택된다.
- `@RestControllerAdvice`는 `@ControllerAdvice`에 `@ResponseBody`를 더한 것으로 반환값을 JSON 본문으로 쓴다.

### 혼동 포인트

- `postHandle`은 예외가 나면 건너뛰지만 `afterCompletion`은 불린다. 자원 정리는 `afterCompletion`에 둔다.
- `BindingResult`의 위치가 검증 대상 바로 뒤가 아니면 그 객체의 오류를 받지 못한다.

### 복습 질문

1. `preHandle`이 `false`를 반환하면 무엇이 실행되지 않는가?
   답: 컨트롤러의 핸들러와 뒤에 등록된 인터셉터가 실행되지 않는다.
2. `@Valid` 대상 뒤에 `BindingResult`가 없을 때 검증에 실패하면?
   답: 예외가 발생해 핸들러 본문이 실행되지 않고 400으로 응답한다.

## Part 7. 파일 업로드와 다운로드

### 1. multipart 요청

- 파일을 보내는 form은 `method="post"`와 `enctype="multipart/form-data"`가 필요하다. 본문이 경계 문자열로 나뉜 여러 부분으로 전송된다.
- 컨트롤러는 `MultipartFile`로 받는다. 파일을 고르지 않아도 객체는 들어오므로 `isEmpty()`로 확인한다.

```java
@PostMapping("/notices/{id}/files")
public String upload(@PathVariable int id,
        @RequestParam("file") MultipartFile file) throws IOException {
    if (!file.isEmpty()) {
        String saved = UUID.randomUUID() + extensionOf(file.getOriginalFilename());
        file.transferTo(uploadDir.resolve(saved));
        service.attach(id, file.getOriginalFilename(), saved);
    }
    return "redirect:/notices/" + id;
}
```

### 2. 저장할 때 지킬 것

| 항목 | 이유 |
|---|---|
| 저장 이름은 서버가 만든다(UUID 등) | 원본 이름은 사용자가 보낸 값이라 겹치거나 `../`를 담을 수 있다 |
| 원본 이름은 DB에 따로 둔다 | 내려받을 때 보여 줄 이름으로만 쓴다 |
| 저장 위치는 웹 루트 밖 | 올린 파일이 URL로 바로 실행되거나 노출되지 않게 한다 |
| 크기 제한을 설정한다 | `spring.servlet.multipart.max-file-size`의 기본값은 1MB, `max-request-size`는 10MB이다 |

### 3. 다운로드

- 응답의 `Content-Disposition: attachment; filename="..."` 헤더가 브라우저에 저장하라고 알린다. 한글 이름은 인코딩해서 넣는다.
- 요청으로 받은 파일 식별자는 DB에서 조회한 저장 이름으로 바꿔 쓴다. 요청의 문자열을 경로에 그대로 붙이지 않는다.

### 복습 질문

1. 원본 파일 이름을 저장 경로에 그대로 쓰면 안 되는 이유는?
   답: 사용자가 보낸 값이어서 다른 파일과 겹치거나 상위 폴더를 가리키는 경로가 들어 있을 수 있기 때문이다.
2. 파일을 선택하지 않고 전송했는지는 어떻게 확인하는가?
   답: `MultipartFile`의 `isEmpty()`로 확인한다.

## Part 8. MyBatis

### 1. Spring과 MyBatis의 연결

```graph
Service -> Mapper인터페이스
Mapper인터페이스 -> 매퍼XML
매퍼XML -> DB
```

```java
@Mapper
public interface ReservationMapper {
    Reservation findById(int reservationId);

    List<Reservation> search(@Param("roomId") Integer roomId,
            @Param("keyword") String keyword);

    int insert(Reservation reservation);
}
```

- Starter의 기본 스캔은 범위 안에서 `@Mapper`가 붙은 인터페이스를 찾는다. 설정 클래스의 `@MapperScan`으로 매퍼 패키지를 지정할 수도 있다. MyBatis가 매퍼 프록시를 만들어 스프링 빈으로 주입할 수 있게 한다.
- XML의 `namespace`는 인터페이스의 패키지를 포함한 전체 이름과 같아야 하고 각 구문의 `id`는 메서드 이름과 같아야 한다.

| 설정 | 뜻 |
|---|---|
| `mybatis.mapper-locations` | 매퍼 XML의 위치. 예: `classpath:mapper/*.xml` |
| `mybatis.type-aliases-package` | 이 패키지의 클래스를 짧은 이름으로 쓴다 |
| `mybatis.configuration.map-underscore-to-camel-case` | `room_id` 컬럼을 `roomId` 프로퍼티에 넣는다. 기본값은 `false` |

### 2. 파라미터 바인딩

| 표기 | 처리 | 쓰는 곳 |
|---|---|---|
| `#{name}` | `?` 자리 표시자로 바꾸고 값을 바인딩한다 | 값. SQL Injection에 안전하다 |
| `${name}` | 문자열을 SQL에 그대로 끼워 넣는다 | 컬럼 이름처럼 바인딩할 수 없는 자리. 허용 목록으로 검사한 값만 쓴다 |

- 파라미터가 DTO 하나면 `#{프로퍼티}`로 쓴다. 파라미터가 둘 이상이면 `@Param`으로 이름을 붙여 둔다. Boot의 기본 빌드처럼 파라미터 이름을 남기는 컴파일 옵션이 켜져 있으면 `@Param` 없이도 이름으로 찾지만 옵션에 기대지 않도록 명시한다.

### 3. 결과 매핑

```xml
<resultMap id="reservationWithRoom" type="Reservation">
    <id property="reservationId" column="reservation_id"/>
    <result property="memberName" column="member_name"/>
    <association property="room" javaType="Room">
        <id property="roomId" column="room_id"/>
        <result property="roomName" column="room_name"/>
    </association>
</resultMap>
```

| 요소 | 관계 | 받는 타입 |
|---|---|---|
| `<association>` | 1:1, N:1 | 객체 하나 |
| `<collection>` | 1:N | `List` |

- `resultType`은 컬럼 이름과 프로퍼티 이름이 같을 때 쓴다. 이름이 다르면 별칭, `map-underscore-to-camel-case`, `resultMap` 중 하나로 맞춘다. 맞는 프로퍼티가 없는 컬럼은 오류 없이 버려지고 그 프로퍼티는 `null`로 남는다.
- 조회 결과가 없을 때 객체 하나를 반환하는 메서드는 `null`, `List`를 반환하는 메서드는 빈 리스트를 돌려준다.
- `<id>`는 같은 객체인지 가리는 기준이다. 1:N 조인에서 부모 행이 여러 번 나와도 `<id>`가 같으면 부모 객체 하나로 묶인다.
- `useGeneratedKeys="true" keyProperty="reservationId"`를 쓰면 AUTO_INCREMENT로 생성된 키가 파라미터 객체에 채워진다. insert의 반환값은 키가 아니라 영향받은 행 수이다.

### 4. 동적 SQL

```xml
<select id="search" resultMap="reservationWithRoom">
    SELECT r.reservation_id, r.member_name, m.room_id, m.room_name
    FROM reservation r JOIN room m ON r.room_id = m.room_id
    <where>
        <if test="roomId != null">
            AND r.room_id = #{roomId}
        </if>
        <if test="keyword != null and keyword != ''">
            AND r.member_name LIKE CONCAT('%', #{keyword}, '%')
        </if>
    </where>
    ORDER BY r.reservation_id
</select>
```

| 태그 | 역할 |
|---|---|
| `<if>` | 조건이 참일 때만 SQL 조각을 넣는다 |
| `<choose>`, `<when>`, `<otherwise>` | 여러 조건 중 처음 참인 하나만 넣는다 |
| `<where>` | 내용이 있을 때만 `WHERE`를 붙이고 맨 앞의 `AND`나 `OR`를 지운다 |
| `<set>` | 내용이 있을 때 `SET`을 붙이고 맨 끝의 쉼표를 지운다 |
| `<foreach>` | 컬렉션을 돌며 `IN (..)` 목록 등을 만든다 |

- 조건이 모두 거짓이면 `<where>`는 아무것도 만들지 않는다. 위 예제는 전체를 조회한다. UPDATE나 DELETE에서 같은 일이 생기면 모든 행이 대상이 되므로 Service에서 먼저 막는다.
- `<foreach>`에 빈 리스트가 오면 `IN ()`이 되어 SQL 문법 오류가 난다. 빈 리스트는 호출 전에 걸러 낸다.
- `<set>` 안의 조건이 모두 거짓이면 `SET`이 없는 UPDATE가 되어 문법 오류가 난다.

### 혼동 포인트

- `#{}`는 값을 따옴표로 감싼 문자열로 넣는 것이 아니라 PreparedStatement의 `?`로 바인딩한다.
- `test` 속성 안에서는 `&&` 대신 `and`를 쓴다. XML에서 `&`와 `<`는 그대로 쓸 수 없다.

### 복습 질문

1. 매퍼 XML과 인터페이스는 무엇으로 연결되는가?
   답: XML의 `namespace`가 인터페이스의 전체 이름과 같고 구문의 `id`가 메서드 이름과 같아야 한다.
2. `ORDER BY ${column}`에 사용자가 보낸 값을 그대로 넣으면 왜 위험한가?
   답: `${}`는 문자열을 SQL에 그대로 끼워 넣으므로 SQL Injection이 가능하다.
3. `<foreach>`로 `IN` 목록을 만들 때 빈 리스트가 오면?
   답: `IN ()`이 되어 SQL 문법 오류가 난다.

## Part 9. Service와 트랜잭션

### 1. 트랜잭션 경계는 Service에 둔다

- 예약 한 건을 저장하면서 스터디실의 남은 자리도 줄여야 한다면 두 SQL은 함께 성공하거나 함께 취소되어야 한다. 이 업무 단위를 아는 곳이 Service이므로 `@Transactional`을 Service 메서드에 붙인다.
- Mapper 메서드마다 트랜잭션을 걸면 SQL 하나씩만 보호되고 업무 단위는 보호되지 않는다.

```graph
Controller -> 트랜잭션프록시
트랜잭션프록시 -> 트랜잭션매니저
트랜잭션프록시 -> ReservationService
ReservationService -> ReservationMapper
```

```java
@Service
public class ReservationService {
    @Transactional
    public int reserve(ReservationForm form) {
        int changed = roomMapper.decreaseSeats(form.getRoomId(), form.getPeople());
        if (changed == 0) {
            throw new SeatShortageException(form.getRoomId());
        }
        reservationMapper.insert(form.toReservation());
        return form.getReservationId();
    }
}
```

- 프록시가 메서드 시작 전에 트랜잭션을 열고 정상 종료하면 commit, 예외가 나오면 rollback한다.

### 2. rollback 규칙

| 메서드 밖으로 나온 예외 | 기본 동작 |
|---|---|
| `RuntimeException`과 그 하위, `Error` | rollback |
| checked 예외(`Exception`, `IOException` 등) | commit |
| 메서드 안에서 `catch`로 잡아 밖으로 나오지 않은 예외 | 프록시가 알 수 없으므로 commit |

- checked 예외에도 rollback하려면 `@Transactional(rollbackFor = Exception.class)`를 쓴다.
- 반대로 특정 예외에 rollback하지 않으려면 `noRollbackFor`를 쓴다.

### 3. 주요 속성

| 속성 | 뜻 |
|---|---|
| `propagation` | 이미 진행 중인 트랜잭션이 있을 때의 동작. 기본값은 `REQUIRED` |
| `isolation` | 격리 수준. 기본값은 DB의 기본 설정을 따른다 |
| `readOnly` | 읽기 전용이라는 **힌트**이다. 쓰기를 반드시 막는다고 보장하지 않으며 실제 동작은 트랜잭션 매니저와 드라이버, DB에 따라 다르다 |
| `timeout` | 지정한 시간을 넘기면 rollback한다 |

### 4. 전파

| 전파 | 바깥 트랜잭션이 있을 때 | 없을 때 |
|---|---|---|
| `REQUIRED` | 참여한다 | 새로 시작한다 |
| `REQUIRES_NEW` | 바깥을 잠시 멈추고 새 트랜잭션을 시작한다 | 새로 시작한다 |
| `SUPPORTS` | 참여한다 | 트랜잭션 없이 실행한다 |
| `MANDATORY` | 참여한다 | 예외를 던진다 |

- `REQUIRED`끼리 묶인 안쪽 메서드에서 런타임 예외가 나오면 전체 트랜잭션에 rollback 표시가 남는다. 바깥에서 그 예외를 잡아도 마지막에 `UnexpectedRollbackException`이 나고 전체가 취소된다.
- `REQUIRES_NEW`로 실행한 안쪽 작업은 따로 commit된다. 바깥이 나중에 rollback되어도 안쪽 결과는 남는다. 실패 기록을 남기는 로그 저장에 쓴다.

### 5. 자기 호출

```java
@Service
public class SettlementService {
    public void closeDay() {
        settle();
    }

    @Transactional
    public void settle() {
        paymentMapper.markSettled();
        throw new IllegalStateException("정산 실패");
    }
}
```

- 밖에서 `closeDay()`를 부르면 그 안의 `settle()`은 `this.settle()`이므로 프록시를 거치지 않는다. 트랜잭션이 시작되지 않아 `markSettled()`의 변경이 자동 commit으로 남는다.
- 해결 방법은 `settle()`을 다른 빈으로 옮기거나 `closeDay()`에 `@Transactional`을 붙여 바깥에서 트랜잭션을 시작하는 것이다.
- 프록시 방식에서는 `private` 메서드의 `@Transactional`도 적용되지 않는다.

### 혼동 포인트

- 예외를 `catch`하고 다시 던지지 않으면 rollback되지 않는다. 잡았다면 다시 던지거나 rollback 표시를 직접 남겨야 한다.
- `readOnly = true`를 쓰기 금지 장치로 설명하지 않는다. 조회 메서드의 의도를 알리고 최적화 여지를 주는 힌트이다.

### 복습 질문

1. `@Transactional` 메서드에서 `IOException`이 밖으로 나오면 기본 동작은?
   답: checked 예외이므로 rollback하지 않고 commit한다. rollback하려면 `rollbackFor`를 지정한다.
2. 같은 클래스의 메서드가 `@Transactional` 메서드를 부르면 트랜잭션이 적용되지 않는 이유는?
   답: 내부 호출은 프록시를 거치지 않고 target의 메서드를 직접 부르기 때문이다.
3. 바깥 트랜잭션이 rollback되어도 남아야 하는 기록에는 어떤 전파를 쓰는가?
   답: `REQUIRES_NEW`이다. 바깥과 별개의 트랜잭션으로 commit된다.

## Part 10. REST API

### 1. 자원과 HTTP 메서드

| 메서드 | 용도 | 안전 | 멱등 |
|---|---|---|---|
| GET | 조회 | O | O |
| POST | 생성, 처리 요청 | X | X |
| PUT | 전체 교체 | X | O |
| PATCH | 일부 수정 | X | 보장하지 않음 |
| DELETE | 삭제 | X | O |

- URL은 자원을 명사로 나타내고 행위는 HTTP 메서드로 나타낸다. 예: `GET /api/equipments/3`, `DELETE /api/rentals/12`.
- 안전은 서버 상태를 바꾸지 않는다는 뜻이고 멱등은 같은 요청을 여러 번 보내도 서버 상태가 한 번 보낸 것과 같다는 뜻이다.

### 2. 상태 코드

| 코드 | 뜻 | 쓰는 경우 |
|---|---|---|
| 200 OK | 성공 | 조회, 수정 결과 반환 |
| 201 Created | 생성됨 | POST로 자원을 만들었을 때. `Location` 헤더에 새 자원의 URL |
| 204 No Content | 본문 없음 | 삭제 성공 |
| 400 Bad Request | 요청 형식이나 값이 잘못됨 | 검증 실패, 변환 실패 |
| 401 Unauthorized | 인증되지 않음 | 로그인이 필요함 |
| 403 Forbidden | 권한 없음 | 인증은 됐지만 허용되지 않음 |
| 404 Not Found | 자원 없음 | 없는 ID |
| 409 Conflict | 현재 상태와 충돌 | 이미 대여 중인 장비를 다시 대여 |

### 3. 컨트롤러

```java
@RestController
@RequestMapping("/api/rentals")
public class RentalApiController {
    @PostMapping
    public ResponseEntity<RentalResponse> rent(@Valid @RequestBody RentalRequest request) {
        RentalResponse created = service.rent(request);
        URI location = URI.create("/api/rentals/" + created.rentalId());
        return ResponseEntity.created(location).body(created);
    }

    @DeleteMapping("/{rentalId}")
    public ResponseEntity<Void> giveBack(@PathVariable int rentalId) {
        service.giveBack(rentalId);
        return ResponseEntity.noContent().build();
    }
}
```

- 화면용 `@Controller`의 일반적인 `String` 반환값은 뷰 이름으로 처리한다. 특정 메서드에 `@ResponseBody`를 붙이면 반환값을 응답 본문에 쓴다.
- `@RestController`는 `@Controller`와 클래스 수준의 `@ResponseBody`를 결합한다. API 핸들러의 반환값은 응답 본문으로 처리되며, 형식은 메시지 컨버터와 콘텐츠 협상에 따라 결정된다.
- `@RequestBody`는 JSON 본문을 객체로 바꾼다. `Content-Type`이 `application/json`이 아니면 **415**, JSON 문법이 틀리면 **400**이다.
- `ResponseEntity`는 상태 코드와 헤더와 본문을 함께 정한다. 객체만 반환하면 상태는 200이다.

### 4. 오류 응답

```java
@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(RentalNotFoundException.class)
    public ResponseEntity<ErrorResponse> notFound(RentalNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse("RENTAL_NOT_FOUND", e.getMessage()));
    }
}
```

- 오류도 약속된 JSON 형식으로 돌려준다. 상태 코드로 종류를 알리고 본문의 코드와 메시지로 원인을 알린다.
- 오류인데 200과 함께 본문에만 실패를 적으면 클라이언트가 상태 코드로 분기할 수 없다.
- 스택 트레이스나 SQL 같은 내부 정보를 응답 본문에 넣지 않는다.

### 5. CORS

- 브라우저는 스크립트가 다른 출처(프로토콜, 호스트, 포트 중 하나라도 다름)로 보낸 요청의 응답을 기본으로 읽지 못하게 한다. 이것이 동일 출처 정책(SOP)이다.
- CORS는 서버가 `Access-Control-Allow-Origin` 같은 헤더로 허용할 출처를 알리는 방법이다. **차단하는 주체는 브라우저**이므로 서버 간 호출이나 API 테스트 도구에는 해당하지 않는다.
- JSON 본문의 POST처럼 단순 요청이 아닌 경우 브라우저가 먼저 `OPTIONS` 예비 요청(preflight)을 보낸다.

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "DELETE");
    }
}
```

- 컨트롤러나 메서드 하나에만 허용할 때는 `@CrossOrigin`을 쓴다.

### 6. API 문서

- springdoc-openapi를 더하면 컨트롤러를 읽어 OpenAPI 문서(`/v3/api-docs`)와 Swagger UI 화면(`/swagger-ui.html`)을 만든다.
- `@Tag`는 컨트롤러 묶음의 이름, `@Operation`은 API 하나의 설명, `@Schema`는 DTO 필드의 설명이다.

### 혼동 포인트

- 401은 누구인지 모른다는 뜻이고 403은 누구인지 알지만 허용하지 않는다는 뜻이다.
- PUT은 보낸 내용으로 전체를 교체하므로 여러 번 보내도 결과가 같다. POST는 보낼 때마다 새 자원이 생길 수 있다.

### 복습 질문

1. POST로 자원을 만든 뒤 알맞은 상태 코드와 헤더는?
   답: 201 Created와 새 자원의 URL을 담은 `Location` 헤더이다.
2. CORS 오류가 났을 때 요청을 막은 주체는?
   답: 브라우저이다. 서버가 허용 헤더를 보내지 않아 브라우저가 응답을 스크립트에 넘기지 않은 것이다.
3. `@Controller`와 `@RestController`의 반환값 처리 차이는?
   답: 화면용 `@Controller`의 일반 `String` 반환값은 뷰 이름이다. 본문이 필요한 메서드에 `@ResponseBody`를 붙일 수 있다. `@RestController`는 `@ResponseBody`를 클래스 수준에서 적용해 API 응답 본문을 처리한다.

## Part 11. Spring Security

### 1. 필터 체인의 위치

```graph
요청 -> DelegatingFilterProxy
DelegatingFilterProxy -> FilterChainProxy
FilterChainProxy -> SecurityFilterChain
SecurityFilterChain -> DispatcherServlet
DispatcherServlet -> Controller
```

- Security는 서블릿 **필터**로 동작한다. 요청이 DispatcherServlet과 컨트롤러에 닿기 전에 인증과 인가를 검사한다.
- `DelegatingFilterProxy`는 서블릿 컨테이너의 필터이고 실제 일은 스프링 빈인 `FilterChainProxy`에 넘긴다. `FilterChainProxy`는 요청에 맞는 `SecurityFilterChain` 하나를 골라 그 안의 필터들을 차례로 실행한다.

### 2. 인증과 인가

| 구분 | 질문 | 실패했을 때 |
|---|---|---|
| 인증(Authentication) | 누구인가 | 401 또는 로그인 화면으로 이동 |
| 인가(Authorization) | 이 일을 해도 되는가 | 403 |

```text
로그인 요청 → AuthenticationManager(ProviderManager)
  → DaoAuthenticationProvider
  → UserDetailsService.loadUserByUsername()으로 사용자 조회
  → PasswordEncoder.matches()로 비밀번호 비교
  → 성공하면 Authentication을 SecurityContext에 저장
```

- `Authentication`은 principal(사용자 정보), credentials(비밀번호), authorities(권한 목록)를 담는다.
- 인증 결과는 `SecurityContextHolder`의 `SecurityContext`에 들어가고 세션 방식에서는 세션에 보관되어 다음 요청에서 복원된다.

### 3. SecurityFilterChain 설정

```java
@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/login", "/css/**").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated())
            .formLogin(form -> form.loginPage("/login").defaultSuccessUrl("/"))
            .logout(logout -> logout.logoutSuccessUrl("/"));
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

- 규칙은 **위에서부터 처음 맞는 것 하나**만 적용한다. 넓은 규칙을 위에 두면 아래의 좁은 규칙은 쓰이지 않는다. `anyRequest()`는 맨 마지막에 둔다.
- `hasRole("ADMIN")`은 권한 문자열 `ROLE_ADMIN`을 찾는다. `hasAuthority("ROLE_ADMIN")`과 같다.
- 경로 패턴에서 `**`는 여러 경로 구간을 뜻하며 패턴의 끝에만 쓴다. `/admin/**`는 `/admin`과 그 아래 모든 경로에 맞는다. `*`는 한 구간 안에서만 맞는다.

### 4. 사용자 정보와 비밀번호

```java
@Service
public class MemberUserDetailsService implements UserDetailsService {
    @Override
    public UserDetails loadUserByUsername(String username) {
        Member member = mapper.findByLoginId(username);
        if (member == null) {
            throw new UsernameNotFoundException(username);
        }
        return User.withUsername(member.getLoginId())
                .password(member.getPasswordHash())
                .roles(member.getRole())
                .build();
    }
}
```

- `UserDetailsService`는 사용자 정보를 **조회**만 한다. 비밀번호 비교는 Provider가 `PasswordEncoder`로 한다.
- 비밀번호는 BCrypt 같은 단방향 해시로 저장한다. BCrypt는 같은 비밀번호도 매번 다른 해시가 나오므로 문자열 비교가 아니라 `matches(원문, 해시)`로 확인한다.
- `roles("ADMIN")`은 권한 `ROLE_ADMIN`을 만든다.

### 5. 로그인, 로그아웃, CSRF

| 항목 | 기본 동작 |
|---|---|
| form 로그인 처리 | `POST /login`, 파라미터 이름은 `username`과 `password` |
| 로그인하지 않고 보호된 화면 요청 | 로그인 화면으로 redirect하고 로그인 뒤 원래 요청으로 돌아간다 |
| 로그아웃 | `POST /logout`. 세션을 무효화하고 SecurityContext를 지운다 |
| CSRF 보호 | 켜져 있다. POST, PUT, DELETE 같은 변경 요청에 토큰이 없으면 403 |

- CSRF 보호가 켜져 있으면 form에 `_csrf` 토큰을 넣어야 한다. 로그아웃도 POST이므로 토큰이 필요하다.
- 세션 쿠키로 인증하는 REST API에서 CSRF를 끄면 위조 요청에 취약해진다. 무엇으로 인증하는지에 따라 정한다.
- REST API는 인증되지 않은 요청을 로그인 화면으로 보내지 않고 401로 답하도록 `authenticationEntryPoint`를 설정한다. 권한 부족은 `accessDeniedHandler`가 403으로 답한다.

### 6. 인증 정보 꺼내기

```java
@GetMapping("/me/rentals")
public List<RentalResponse> mine(@AuthenticationPrincipal UserDetails user) {
    return service.findByLoginId(user.getUsername());
}
```

- 컨트롤러에서는 `@AuthenticationPrincipal`이나 `Authentication` 파라미터로 받는다. 다른 계층에서는 `SecurityContextHolder.getContext().getAuthentication()`으로 꺼낸다.
- URL 규칙만으로는 "자기 것만" 같은 **소유권**을 검사하지 못한다. 로그인한 사용자와 자원의 주인을 Service에서 비교한다.

### 혼동 포인트

- Security 필터는 컨트롤러보다 앞에 있다. 인증에 실패한 요청은 컨트롤러와 인터셉터에 닿지 않는다.
- 401과 403을 뒤바꾸지 않는다. 로그인하지 않았으면 401(또는 로그인 화면), 로그인했지만 권한이 없으면 403이다.

### 복습 질문

1. `requestMatchers("/**").permitAll()`을 맨 위에 두면 그 아래의 `hasRole` 규칙은 어떻게 되는가?
   답: 모든 요청이 첫 규칙에 먼저 맞으므로 아래 규칙은 적용되지 않는다.
2. `UserDetailsService`가 하는 일과 하지 않는 일은?
   답: 사용자 이름으로 사용자 정보를 조회한다. 비밀번호 비교는 하지 않으며 Provider가 `PasswordEncoder`로 한다.
3. CSRF 보호가 켜진 상태에서 토큰 없이 POST를 보내면?
   답: 403 Forbidden이다.

## Part 12. 테스트, 로깅, Lombok

### 1. JUnit

```java
class RoomPolicyTest {
    @Test
    void 정원을_넘으면_예약할_수_없다() {
        // given
        RoomPolicy policy = new RoomPolicy(4);

        // when
        boolean allowed = policy.canReserve(5);

        // then
        assertFalse(allowed);
    }
}
```

| 구분 | 뜻 |
|---|---|
| `@Test` | 테스트 메서드 |
| `@BeforeEach`, `@AfterEach` | 각 테스트의 앞과 뒤에 실행 |
| `assertEquals(기대값, 실제값)` | 순서는 기대값이 먼저다 |
| `assertThrows(예외.class, 실행문)` | 지정한 예외가 던져져야 통과한다 |

- given에서 상황을 준비하고 when에서 한 가지 동작을 실행하고 then에서 결과를 확인한다.

### 2. Spring 테스트

| 어노테이션 | 띄우는 범위 | 용도 |
|---|---|---|
| `@SpringBootTest` | 전체 컨테이너 | 계층을 이은 통합 테스트 |
| `@WebMvcTest(컨트롤러.class)` | MVC 계층만 | 컨트롤러의 매핑, 바인딩, 응답 확인. Service는 가짜 빈으로 채운다 |

```java
mockMvc.perform(get("/rooms/3"))
        .andExpect(status().isOk())
        .andExpect(view().name("room/detail"))
        .andExpect(model().attributeExists("room"));
```

- MockMvc는 서버를 띄우지 않고 DispatcherServlet에 요청을 넣어 상태 코드와 뷰 이름과 Model을 확인한다.
- Service와 DB를 가짜로 바꾼 테스트는 컨트롤러 단위 테스트이다. 통합 검증으로 부르지 않는다.

### 3. 로깅

| 레벨 | 쓰는 경우 |
|---|---|
| ERROR | 처리에 실패했다 |
| WARN | 실패는 아니지만 주의가 필요하다 |
| INFO | 주요 흐름을 알린다. Boot의 기본 레벨 |
| DEBUG | 개발 중 확인용 상세 정보 |
| TRACE | 가장 자세한 흐름 |

- SLF4J는 로깅 **인터페이스**이고 실제 출력은 구현체가 한다. Boot의 기본 구현체는 Logback이다.
- 설정한 레벨과 그보다 높은 레벨만 출력된다. `logging.level.com.study.room=debug`이면 DEBUG부터 ERROR까지 나오고 TRACE는 나오지 않는다.
- `log.debug("id={}", id)`처럼 `{}` 자리 표시자를 쓴다. 레벨이 꺼져 있으면 문자열을 만들지 않는다.
- 비밀번호와 토큰 같은 민감한 값은 로그에 남기지 않는다.

### 4. Lombok

| 어노테이션 | 만들어 주는 것 |
|---|---|
| `@Getter`, `@Setter` | 접근자 |
| `@NoArgsConstructor`, `@AllArgsConstructor` | 기본 생성자, 모든 필드 생성자 |
| `@RequiredArgsConstructor` | `final` 필드와 `@NonNull` 필드만 받는 생성자 |
| `@ToString`, `@EqualsAndHashCode` | 해당 메서드 |
| `@Data` | Getter, Setter, ToString, EqualsAndHashCode, RequiredArgsConstructor를 한 번에 |
| `@Builder` | 빌더 패턴 |
| `@Slf4j` | `log` 필드 |

- `@RequiredArgsConstructor`와 `final` 필드를 함께 쓰면 생성자 주입 코드를 줄일 수 있다.
- Lombok은 컴파일할 때 코드를 만든다. 실행 중에 동작하는 것이 아니다.
- MyBatis가 결과를 객체에 담으려면 기본 생성자와 setter(또는 맞는 생성자)가 필요하다.

### 복습 질문

1. `@WebMvcTest`와 `@SpringBootTest`의 차이는?
   답: `@WebMvcTest`는 MVC 계층의 빈만 띄우고 `@SpringBootTest`는 전체 컨테이너를 띄운다.
2. 로그 레벨을 `info`로 두면 출력되는 레벨은?
   답: INFO, WARN, ERROR이다. DEBUG와 TRACE는 출력되지 않는다.
3. `@RequiredArgsConstructor`가 생성자에 넣는 필드는?
   답: `final` 필드와 `@NonNull`이 붙은 필드이다.

## Part 13. 심화 주제

이 Part는 강의에 포함되었지만 버전에 따라 제공 여부와 사용법이 달라지는 내용이다. 과목평가 연습 문항의 필수 범위에 넣지 않았고 개념만 정리한다. 여기의 설명은 Spring Framework 7 기준이다.

### 1. Resilience

| 어노테이션 | 뜻 |
|---|---|
| `@Retryable` | 실패한 메서드 호출을 정해진 횟수와 간격으로 다시 시도한다 |
| `@ConcurrencyLimit` | 한 메서드를 동시에 실행할 수 있는 수를 제한한다 |

- Spring Framework 7에 들어온 기능이며 설정 클래스에 `@EnableResilientMethods`가 있어야 동작한다. 별도 프로젝트인 Spring Retry의 같은 이름 어노테이션과는 패키지가 다르다.
- 이 기능도 프록시로 동작하므로 자기 호출에는 적용되지 않는다.
- 재시도는 멱등한 작업에만 쓴다. 결제처럼 두 번 실행되면 안 되는 작업에 걸지 않는다.

### 2. API Versioning

- API를 바꾸면서 기존 클라이언트를 유지하려면 버전을 구분한다. 구분 위치는 URL 경로(`/api/v1/..`), 요청 헤더, 쿼리 파라미터 중에서 정한다.
- Spring Framework 7은 매핑 어노테이션의 `version` 속성과 버전을 어디서 읽을지 정하는 설정을 제공한다. 이전 버전에서는 경로에 버전을 직접 쓴다.

### 3. RestClient와 HTTP Interface

| 방식 | 특징 |
|---|---|
| `RestClient` | 동기 방식의 HTTP 클라이언트. 메서드를 이어 쓰는 방식으로 요청을 만든다 |
| HTTP Interface | 인터페이스에 `@GetExchange` 같은 어노테이션만 쓰면 구현체를 프록시로 만들어 준다 |

- 다른 서버의 API를 부를 때 쓴다. 외부 호출은 실패와 지연이 있을 수 있으므로 시간 제한과 오류 처리를 함께 정한다.

### 4. Remember-Me

- 세션이 끝난 뒤에도 쿠키로 로그인 상태를 복원하는 기능이다. 쿠키에 사용자 식별 정보와 서명이 들어간다.
- 쿠키를 훔치면 로그인할 수 있으므로 중요한 작업은 다시 인증하게 한다. 쿠키에 비밀번호 원문을 넣지 않는다.

### 복습 질문

1. `@Retryable`을 결제 요청에 붙이면 안 되는 이유는?
   답: 멱등하지 않은 작업이어서 재시도하면 같은 결제가 두 번 실행될 수 있기 때문이다.
2. HTTP Interface에서 구현 클래스는 누가 만드는가?
   답: 스프링이 프록시로 만든다. 개발자는 인터페이스와 어노테이션만 쓴다.

## Part 14. 시험 직전 비교표와 구현 순서

### 1. 한눈에 보는 비교

| 헷갈리는 쌍 | 구분 기준 |
|---|---|
| `@Component`와 `@Bean` | 클래스에 붙여 스캔으로 등록 / 설정 클래스의 메서드로 등록 |
| `@Primary`와 `@Qualifier` | 기본 후보 지정 / 주입 지점에서 이름 지정(우선) |
| singleton과 prototype | 컨테이너에 하나 / 요청할 때마다 새로 생성 |
| `@AfterThrowing`과 `@Around` | 예외를 관찰만 함 / 예외를 잡아 바꿀 수 있음 |
| forward와 redirect | 요청 한 번, URL 유지 / 요청 두 번, URL 변경 |
| `@RequestParam`과 `@ModelAttribute` | 값 하나, 기본 필수 / 객체에 묶음, 없는 값은 넘어감 |
| `postHandle`과 `afterCompletion` | 예외가 나면 생략 / 예외가 나도 호출 |
| `#{}`와 `${}` | `?` 바인딩 / 문자열 치환 |
| `<association>`과 `<collection>` | 객체 하나 / 리스트 |
| unchecked와 checked 예외 | 기본 rollback / 기본 commit |
| `REQUIRED`와 `REQUIRES_NEW` | 바깥에 참여 / 따로 commit |
| PUT과 PATCH | 전체 교체, 멱등 / 일부 수정 |
| 401과 403 | 인증 안 됨 / 권한 없음 |
| `@Controller`와 `@RestController` | 화면용 뷰 이름 / API 응답 본문(`@ResponseBody` 포함) |

### 2. 프로젝트 구현 순서

1. **설정**: `pom.xml`의 의존성, `application.properties`의 DB 접속 정보와 MyBatis 위치, 뷰 prefix와 suffix를 확인한다.
2. **DTO와 스키마**: 테이블의 컬럼과 DTO 프로퍼티 이름을 맞춘다. 이름 규칙이 다르면 매핑 방법을 정한다.
3. **Mapper**: 인터페이스 메서드와 XML 구문을 짝지어 쓴다. `namespace`와 `id`를 먼저 맞춘다.
4. **Service**: 업무 규칙을 넣고 변경 메서드에 `@Transactional`을 붙인다. 없는 ID와 규칙 위반은 예외로 알린다.
5. **Controller**: 매핑, 파라미터 바인딩, 검증, Model, 반환값을 쓴다. 변경 뒤에는 redirect한다.
6. **View 또는 JSON**: JSP에서 Model의 값을 출력하거나 응답 DTO와 상태 코드를 정한다.
7. **예외와 보안**: `@ControllerAdvice`로 오류 응답을 모으고 Security 규칙과 소유권 검사를 확인한다.

### 3. 오류가 났을 때 보는 순서

| 증상 | 먼저 확인할 것 |
|---|---|
| 시작할 때 빈을 찾지 못한다 | 컴포넌트 스캔 범위, 어노테이션 누락, 같은 타입의 빈이 둘인지 |
| 404 | 클래스와 메서드의 매핑 경로, context path |
| 405 | HTTP 메서드와 매핑 어노테이션 |
| 400 | 필수 파라미터, 타입 변환, 검증, JSON 형식 |
| 403 | CSRF 토큰, 권한 규칙의 순서 |
| `Invalid bound statement` | 매퍼 XML의 위치 설정, `namespace`, `id` |
| 값이 `null`로 들어온다 | 컬럼과 프로퍼티의 이름, form 필드의 `name` |
| 예외가 났는데 DB에 반영됐다 | 예외 종류(checked), 예외를 잡았는지, 자기 호출인지 |

### 복습 질문

1. 예외가 났는데 DB 변경이 남아 있다면 확인할 세 가지는?
   답: 예외가 checked 예외인지, 메서드 안에서 예외를 잡아 버렸는지, 프록시를 거치지 않는 자기 호출인지 확인한다.
2. `Invalid bound statement (not found)` 오류의 대표 원인은?
   답: 매퍼 XML을 찾지 못했거나 `namespace`나 구문 `id`가 인터페이스와 다르기 때문이다.
