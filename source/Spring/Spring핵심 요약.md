# Spring 핵심 요약

시험 직전에 훑어보는 한 장짜리 정리이다. 시험 범위 키워드 8개에 맞춰 `Spring개념 요약노트`와 `Spring` 과목평가 해설에서 시험에 자주 묻는 것만 뽑았다. 자세한 설명과 예제는 개념 노트의 해당 Part를 본다. 버전에 따라 달라지는 동작은 연습용 검증 환경(Spring Boot 4.1, Spring Framework 7.0, Spring Security 7.1, MyBatis 3.5, MySQL 8.4)을 기준으로 한다. 수업 환경과 같은지는 아직 확인하지 못했다.

## 1. Spring 핵심 원리와 IoC/DI 컨테이너

| 키워드 | 기억할 것 |
|---|---|
| 프레임워크와 라이브러리 | 흐름의 주인이 다르다. 라이브러리는 내 코드가 호출하고 프레임워크는 프레임워크가 내 코드를 호출한다 |
| Spring 3대 특징 | IoC/DI는 객체 생성과 연결을 컨테이너가 맡는다. AOP는 흩어진 부가 기능을 한곳에 모은다. PSA는 기술이 달라도 같은 방식으로 쓰게 한다(예: `PlatformTransactionManager`) |
| IoC와 DI | IoC는 원칙이고 DI는 그 원칙을 구현하는 방법의 하나이다 |
| POJO | 특정 프레임워크의 클래스를 상속하거나 구현하지 않는 평범한 자바 객체. 3대 특징은 업무 코드를 POJO로 쓰게 하려는 장치이다 |
| 명시적 빈 등록 | `@Configuration` 클래스의 `@Bean` 메서드. 외부 라이브러리 클래스에 쓴다. 빈 이름은 메서드 이름이고 `@Component` 계열은 클래스 이름의 첫 글자를 소문자로 바꾼 것이다 |
| 싱글톤 보장 | 기본 `@Configuration`은 CGLIB 프록시라서 `@Bean` 메서드를 서로 불러도 컨테이너의 같은 빈이 나온다. `proxyBeanMethods = false`이면 일반 호출이라 새 객체가 만들어진다 |
| 빈 생명주기 | 생성자 호출, 의존성 주입, `@PostConstruct`, 사용, `@PreDestroy` 순서 |
| 의존성 주입 시점 | 주입은 생성자 다음이다. 생성자 안에서 필드 주입 대상은 아직 `null`일 수 있다 |
| 빈 스코프 | singleton은 컨테이너에 하나(기본값)이고 prototype은 요청할 때마다 새로 만든다. prototype은 컨테이너가 소멸 콜백을 부르지 않는다 |
| 주입 충돌 해결 | 같은 타입의 빈이 둘이고 기준이 없으면 `NoUniqueBeanDefinitionException`. `@Primary`는 기본 후보를 정하고 `@Qualifier`는 주입 지점에서 이름을 정하며 더 우선한다 |
| 주입 방법 | 생성자 주입을 권장한다. `final`로 불변을 지키고 생성자가 하나면 `@Autowired`가 없어도 된다 |

## 2. Spring Boot와 로깅과 테스트

| 키워드 | 기억할 것 |
|---|---|
| `@SpringBootApplication` | `@SpringBootConfiguration`, `@EnableAutoConfiguration`, `@ComponentScan` 세 가지를 합친 것 |
| 컴포넌트 스캔 범위 | 메인 클래스의 패키지와 그 하위만 찾는다. 밖에 둔 `@Service`는 빈이 되지 않는다 |
| 자동 구성 | 조건부이다. 개발자가 같은 빈을 등록하면 물러난다 |
| `@Value("${키:기본값}")` | 값 하나를 주입한다. 키도 기본값도 없으면 시작할 때 실패한다 |
| `@ConfigurationProperties(prefix = "room")` | 같은 접두사의 값을 객체 하나에 묶는다. `open-hour`가 `openHour`에 들어간다 |
| 설정 값 우선순위 | 명령행 인자, 환경 변수, 설정 파일 순으로 앞의 것이 이긴다 |
| SLF4J와 Logback | SLF4J는 로깅 인터페이스이고 Boot의 기본 구현체는 Logback이다 |
| 로그 레벨 | TRACE, DEBUG, INFO, WARN, ERROR 순. 기본은 INFO이고 설정한 레벨과 그보다 높은 레벨만 출력된다 |
| 로그 작성 | `log.debug("id={}", id)`처럼 `{}`를 쓴다. 비밀번호와 토큰은 남기지 않는다 |
| JUnit 5 라이프사이클 | `@BeforeEach`와 `@AfterEach`는 각 테스트의 앞과 뒤에 실행하고 `@BeforeAll`과 `@AfterAll`은 클래스 전체의 앞과 뒤에 한 번 실행한다 |
| 단언 | `assertEquals(기대값, 실제값)` 순서이고 `assertThrows(예외.class, 실행문)`은 그 예외가 던져져야 통과한다 |

## 3. Spring AOP와 트랜잭션 관리

| 키워드 | 기억할 것 |
|---|---|
| AOP 용어 | target은 원래 객체, join point는 끼어들 수 있는 지점(Spring AOP는 메서드 실행), pointcut은 적용 대상을 고르는 식, advice는 부가 기능과 시점, aspect는 pointcut과 advice를 묶은 것 |
| 프록시 | 컨테이너가 pointcut에 걸리는 빈 대신 프록시를 등록한다. `final`과 `private` 메서드에는 적용되지 않는다 |
| `execution(* a.b..*Service.find*(..))` | 첫 `*`는 반환 타입 무관, `..`은 하위 패키지 포함, `*Service`는 Service로 끝나는 타입, `find*`는 find로 시작하는 메서드 |
| 파라미터 표기 | `(*)`는 정확히 하나이고 `(..)`는 0개 이상 |
| advice 종류 | `@Before`, `@AfterReturning`(정상 반환 뒤), `@AfterThrowing`(예외 뒤), `@After`(항상, `finally`와 같음), `@Around`(전후를 모두 감쌈) |
| 실행 제어 | `@Around`에서 `proceed()`를 부르지 않으면 target이 실행되지 않는다. `@Before`가 예외를 던져도 target이 실행되지 않는다 |
| `@AfterThrowing` | 예외를 관찰만 하고 삼키지 못한다. 예외를 바꾸려면 `@Around`에서 `catch`한다 |
| `@Transactional` 위치 | 업무 단위를 아는 Service 메서드에 붙인다. 정상 종료는 commit, 예외가 나오면 rollback |
| 예외 롤백 규칙 | RuntimeException과 Error는 rollback, checked 예외는 commit. `catch`로 잡아 밖으로 안 나온 예외도 commit |
| `rollbackFor` | checked 예외에도 rollback하려면 지정한다 |
| 적용되지 않는 경우 | 같은 클래스 안의 자기 호출과 `private` 메서드는 프록시를 거치지 않는다 |

## 4. Spring MVC와 웹 계층

| 키워드 | 기억할 것 |
|---|---|
| DispatcherServlet 흐름 | DispatcherServlet이 요청을 받고, HandlerMapping이 핸들러를 찾고, HandlerAdapter가 실행하고, Controller가 뷰 이름을 반환하고, ViewResolver가 View를 찾는다 |
| `@RequestParam` | 쿼리 스트링과 form 필드. 기본 필수라서 없으면 400 |
| `@PathVariable` | URL 경로의 `{이름}` 값 |
| `@RequestBody` | 요청 본문의 JSON을 객체로 바꾼다. 본문이 없거나 JSON 문법이 틀리면 400이고 Content-Type이 JSON이 아니면 415 |
| `@ModelAttribute` | 같은 이름의 프로퍼티에 값을 채운 객체. 없는 값은 넘어간다 |
| `redirect:` 동작 원리 | 302 응답으로 브라우저가 새 요청을 보낸다. 요청이 두 번이라 URL이 바뀌고 Model과 request scope 값은 사라진다 |
| PRG | 등록 뒤 redirect로 조회 화면을 다시 요청해 새로 고침 중복 전송을 막는다. 값은 `addFlashAttribute`로 넘긴다 |
| `preHandle` | 핸들러 실행 전. `false`면 핸들러와 뒤의 인터셉터가 실행되지 않는다 |
| `postHandle` | 핸들러가 정상 종료한 뒤 뷰 렌더링 전. 예외가 나면 불리지 않는다 |
| `afterCompletion` | 뷰 렌더링까지 끝난 뒤. `preHandle`이 `true`였다면 예외가 나도 불린다 |
| 인터셉터 순서 | `preHandle`은 등록한 순서이고 `postHandle`과 `afterCompletion`은 반대 순서 |

## 5. MyBatis 연동과 동적 SQL

| 키워드 | 기억할 것 |
|---|---|
| 매퍼 인터페이스 등록 | 인터페이스에 `@Mapper`를 붙이면 Starter가 스캔한다. 설정 클래스의 `@MapperScan`으로 패키지를 지정해도 된다 |
| 인터페이스와 XML 연결 | XML의 `namespace`는 인터페이스 전체 이름, 구문의 `id`는 메서드 이름과 같아야 한다. 위치는 `mybatis.mapper-locations` |
| `#{}`와 `${}` | `#{}`는 `?`로 바인딩해 안전하고 `${}`는 문자열을 그대로 끼워 SQL Injection이 가능하다 |
| `<if>` | 조건이 참일 때만 SQL 조각을 넣는다. `test` 안에서는 `&&` 대신 `and` |
| `<where>` | 내용이 있을 때만 `WHERE`를 붙이고 맨 앞의 `AND`나 `OR`를 지운다. 조건이 모두 거짓이면 아무것도 만들지 않아 전체를 조회한다 |
| `<set>` | 맨 끝의 쉼표를 지운다. 조건이 모두 거짓이면 `SET`이 없는 UPDATE가 되어 문법 오류 |
| `<choose>`, `<when>`, `<otherwise>` | 여러 조건 중 처음 참인 하나만 넣는다 |
| `<foreach>` | 컬렉션을 돌며 `IN (..)`을 만든다. 빈 리스트면 `IN ()`이 되어 문법 오류 |
| 1:N 컬렉션 매핑 | `<collection>`이 `List`를 받는다. `<association>`은 객체 하나(1:1, N:1) |
| `<id>` | 같은 객체인지 가리는 기준이다. 1:N 조인에서 부모 행이 여러 번 나와도 `<id>`가 같으면 부모 하나로 묶는다 |
| 이름이 다른 컬럼 | 별칭, `map-underscore-to-camel-case`(기본값 false), `resultMap` 중 하나로 맞춘다. 안 맞으면 오류 없이 `null` |

## 6. Spring Security 기초

| 키워드 | 기억할 것 |
|---|---|
| 인증과 인가 | 인증은 누구인가이고 인가는 이 일을 해도 되는가. 실패하면 각각 401(또는 로그인 화면)과 403 |
| 보안 프레임워크 구조 | 서블릿 필터로 동작해 DispatcherServlet보다 앞이다. `DelegatingFilterProxy`가 빈인 `FilterChainProxy`에 넘기고 `FilterChainProxy`가 맞는 `SecurityFilterChain` 하나를 골라 실행한다 |
| 로그인 흐름 | AuthenticationManager, DaoAuthenticationProvider, `UserDetailsService.loadUserByUsername`, `PasswordEncoder.matches`, 성공하면 SecurityContext에 저장 |
| URL 접근 권한 | `SecurityFilterChain` 빈에서 `authorizeHttpRequests`로 정한다. `permitAll`, `hasRole`, `authenticated`를 쓴다 |
| 규칙 적용 순서 | 위에서부터 처음 맞는 규칙 하나만 적용한다. 넓은 규칙을 위에 두면 아래 규칙은 쓰이지 않고 `anyRequest()`는 맨 마지막 |
| 역할 기반 인가 | `hasRole("ADMIN")`은 권한 `ROLE_ADMIN`을 찾는다. `roles("ADMIN")`도 `ROLE_ADMIN`을 만든다 |
| 비밀번호 단방향 암호화 | 표준 인터페이스는 `PasswordEncoder`이고 구현은 `BCryptPasswordEncoder`. 매번 다른 해시가 나오므로 `matches(원문, 해시)`로 비교한다 |
| `UserDetailsService` | 사용자 조회만 하고 비밀번호는 비교하지 않는다. 없으면 `UsernameNotFoundException` |
| CSRF | 기본으로 켜져 있다. 토큰 없는 POST, PUT, DELETE는 403 |

## 7. Filter와 HandlerInterceptor 비교

| 비교 항목 | Filter | HandlerInterceptor |
|---|---|---|
| ① 실행 위치(동작 계층) | 서블릿 계층. 서블릿 필터 체인에서 `chain.doFilter` 호출 전후에 동작한다 | Spring MVC 계층. 핸들러가 선택된 뒤 매핑된 핸들러를 기준으로 `preHandle`, `postHandle`, `afterCompletion`에서 동작한다 |
| ② 대표적인 역할 예시 | 파라미터를 읽기 전에 요청의 문자 인코딩 설정, 요청 래핑 | `preHandle`에서 시작 시각을 남기고 `afterCompletion`에서 핸들러별 처리 시간 기록 |

참고로 Spring AOP는 프록시를 거치는 빈의 메서드 실행에 끼어들며 대표적인 쓰임은 서비스 메서드의 트랜잭션 관리이다.

## 8. @Controller와 @RestController 비교

| 비교 항목 | `@Controller` | `@RestController` |
|---|---|---|
| ① 주된 반환 대상(목적) | 화면용이다. `@ResponseBody`가 없는 일반 `String` 반환값은 뷰 이름이다 | API용이다. 반환값은 응답 본문이다. 형식은 메시지 컨버터와 콘텐츠 협상으로 정해진다 |
| ② `@ResponseBody` 적용 방식 | 필요한 메서드에 개별로 붙인다 | `@Controller`와 클래스 수준의 `@ResponseBody`를 결합한 것이라 모든 핸들러에 적용된다 |
