# Spring 핵심 요약

시험 직전에 훑어보는 한 장짜리 정리이다. 내용은 `Spring개념 요약노트`의 각 Part에서 시험에 자주 묻는 것만 뽑았다. 자세한 설명과 예제는 해당 Part를 본다. 버전에 따라 달라지는 동작은 연습용 검증 환경(Spring Boot 4.1, Spring Framework 7.0, Spring Security 7.1, MyBatis 3.5, MySQL 8.4)을 기준으로 한다. 수업 환경과 같은지는 아직 확인하지 못했다.

## 1. 구조와 DI (Part 1~3)

| 항목 | 기억할 것 |
|---|---|
| Library와 Framework | 흐름의 주인이 다르다. Framework는 프레임워크가 내 코드를 호출한다 |
| IoC와 DI | IoC는 원칙이고 DI는 그 구현 방법의 하나이다 |
| 컴포넌트 스캔 | 메인 클래스의 패키지와 그 하위만 찾는다 |
| 빈 등록 | 직접 만든 클래스는 `@Component` 계열, 외부 클래스는 `@Configuration`의 `@Bean` |
| 주입 방법 | 생성자 주입을 권장한다. `final`로 불변을 지키고 의존성이 빠지면 객체를 만들 수 없다 |
| 생성자가 하나 | `@Autowired`를 쓰지 않아도 주입된다 |
| 같은 타입의 빈이 둘 | 기준이 없으면 `NoUniqueBeanDefinitionException`. `@Qualifier`가 `@Primary`보다 우선한다 |
| scope | 기본은 singleton. prototype은 컨테이너가 소멸 콜백을 부르지 않는다 |
| 생명주기 | 생성자, 의존성 주입, `@PostConstruct`, 사용, `@PreDestroy` |
| `@Value("${키:기본값}")` | 키가 없고 기본값도 없으면 시작할 때 실패한다 |

## 2. AOP (Part 4)

| 항목 | 기억할 것 |
|---|---|
| 용어 | pointcut은 어디에, advice는 무엇을 언제, aspect는 둘을 묶은 것, weaving은 엮는 과정 |
| 프록시 | 빈 대신 프록시가 등록된다. `final`과 `private` 메서드에는 적용되지 않는다 |
| `@Around` | `proceed()`를 부르지 않으면 target이 실행되지 않는다 |
| `@AfterThrowing` | 예외를 관찰만 하고 삼키지 못한다. 바꾸려면 `@Around`에서 `catch` |
| `@After` | 정상이든 예외든 끝난 뒤. `finally`와 같다 |
| `execution(* a.b..*Service.find*(..))` | 반환 타입 무관, 하위 패키지 포함, Service로 끝나는 타입, find로 시작, 파라미터 무관 |
| 자기 호출 | 같은 클래스 안의 호출은 프록시를 거치지 않아 advice가 적용되지 않는다 |

## 3. Spring MVC (Part 5~7)

| 항목 | 기억할 것 |
|---|---|
| 요청 흐름 | DispatcherServlet, HandlerMapping, HandlerAdapter, Controller, ViewResolver, View |
| 404와 405 | 경로가 없으면 404, 경로는 맞지만 HTTP 메서드가 없으면 405 |
| `@RequestParam` | 기본 필수라서 없으면 400. 변환할 수 없는 값도 400 |
| `@ModelAttribute` | 없는 값은 채우지 않고 넘어간다. 어노테이션이 없는 DTO도 같다 |
| `redirect:`와 `forward:` | redirect는 요청 두 번에 URL 변경, forward는 요청 한 번에 URL 유지 |
| PRG | 등록 뒤 redirect로 새로 고침 중복 전송을 막는다. 값은 `addFlashAttribute`로 넘긴다 |
| `preHandle` | `false`면 핸들러와 뒤의 인터셉터가 실행되지 않는다 |
| `postHandle`과 `afterCompletion` | 예외가 나면 postHandle은 건너뛰고 afterCompletion은 불린다 |
| `@Valid`와 `BindingResult` | `BindingResult`는 검증 대상 바로 뒤에 둔다. 없으면 400 |
| `@NotNull`, `@NotEmpty`, `@NotBlank` | null만, 빈 값까지, 공백뿐인 문자열까지 막는다 |
| 예외 처리 | 컨트롤러 안의 `@ExceptionHandler`가 `@ControllerAdvice`보다 먼저 |
| 파일 업로드 | `multipart/form-data`와 `MultipartFile`. 저장 이름은 서버가 UUID로 만들고 웹 루트 밖에 둔다 |

## 4. MyBatis (Part 8)

| 항목 | 기억할 것 |
|---|---|
| 연결 | XML의 `namespace`는 인터페이스 전체 이름, 구문의 `id`는 메서드 이름과 같아야 한다 |
| `#{}`와 `${}` | `#{}`는 `?` 바인딩으로 안전하고 `${}`는 문자열을 그대로 넣어 SQL Injection이 가능하다 |
| `<association>`과 `<collection>` | 객체 하나(1:1, N:1)와 List(1:N) |
| 이름이 다른 컬럼 | 별칭, `map-underscore-to-camel-case`(기본값 false), `resultMap` 중 하나로 맞춘다. 안 맞으면 오류 없이 `null` |
| 결과가 없을 때 | 객체 하나는 `null`, `List`는 빈 리스트 |
| `useGeneratedKeys` | 생성된 키는 `keyProperty`에 채워진다. insert 반환값은 영향받은 행 수 |
| `<where>` | 조건이 모두 거짓이면 WHERE가 없다. UPDATE와 DELETE에서는 전체 행이 대상이 되니 주의 |
| `<foreach>` | 빈 리스트면 `IN ()`이 되어 문법 오류 |
| `test` 속성 | `&&` 대신 `and`를 쓴다 |

## 5. 트랜잭션 (Part 9)

| 항목 | 기억할 것 |
|---|---|
| 위치 | 업무 단위를 아는 Service 메서드에 붙인다 |
| 기본 rollback | RuntimeException과 Error는 rollback, checked 예외는 commit |
| 예외를 `catch`로 잡았다 | 프록시가 알 수 없어 commit. 다시 던져야 한다 |
| `rollbackFor` | checked 예외에도 rollback하려면 지정한다 |
| `readOnly` | 쓰기를 막는 장치가 아니라 힌트이다 |
| `REQUIRED` | 바깥 트랜잭션에 참여한다. 안쪽 런타임 예외는 바깥에서 잡아도 `UnexpectedRollbackException` |
| `REQUIRES_NEW` | 따로 commit된다. 바깥이 rollback되어도 남는다 |
| 적용되지 않는 경우 | 자기 호출, `private` 메서드 |

## 6. REST API (Part 10)

| 항목 | 기억할 것 |
|---|---|
| 멱등 | GET, PUT, DELETE는 멱등이고 POST는 아니다. PATCH는 보장하지 않는다 |
| PUT과 PATCH | 전체 교체와 일부 수정 |
| 상태 코드 | 200 성공, 201 생성(`Location` 헤더), 204 본문 없음(삭제), 400 형식 오류, 401 인증 안 됨, 403 권한 없음, 404 없음, 409 충돌 |
| `@RestController` | `@Controller`에 클래스 수준의 `@ResponseBody`를 더한 것 |
| `@RequestBody` | Content-Type이 JSON이 아니면 415, JSON 문법이 틀리면 400 |
| 오류 응답 | 상태 코드로 종류를 알리고 본문에 코드와 메시지를 담는다. 오류에 200을 쓰지 않는다 |
| CORS | 막는 주체는 브라우저. 서버가 `Access-Control-Allow-Origin`으로 허용한다. JSON POST 전에는 `OPTIONS` 예비 요청 |

## 7. Spring Security (Part 11)

| 항목 | 기억할 것 |
|---|---|
| 위치 | 서블릿 필터라서 DispatcherServlet과 컨트롤러보다 앞이다 |
| 인증과 인가 | 누구인가와 해도 되는가. 실패하면 각각 401(또는 로그인 화면)과 403 |
| 로그인 흐름 | AuthenticationManager, DaoAuthenticationProvider, `loadUserByUsername`, `PasswordEncoder.matches` |
| `UserDetailsService` | 사용자 조회만 한다. 정해진 메서드는 `loadUserByUsername`이고 없는 사용자는 `UsernameNotFoundException` |
| 비밀번호 | BCrypt 같은 단방향 해시. 매번 달라서 `matches(원문, 해시)`로 비교한다 |
| 규칙 순서 | 위에서부터 처음 맞는 규칙 하나만 적용한다. `anyRequest()`는 맨 마지막 |
| `hasRole("ADMIN")` | 권한 `ROLE_ADMIN`을 찾는다 |
| 로그인과 로그아웃 | `POST /login`(`username`, `password`)과 `POST /logout` |
| CSRF | 기본으로 켜져 있다. 토큰 없는 POST, PUT, DELETE는 403 |
| 소유권 검사 | URL 규칙으로는 못 한다. Service에서 로그인한 사용자와 자원의 주인을 비교한다 |

## 8. 테스트와 로깅과 Lombok (Part 12)

| 항목 | 기억할 것 |
|---|---|
| `assertEquals` | 기대값이 먼저이고 실제값이 나중이다 |
| `@WebMvcTest`와 `@SpringBootTest` | MVC 계층만 띄운다와 전체 컨테이너를 띄운다 |
| 로그 레벨 | TRACE, DEBUG, INFO, WARN, ERROR 순. 기본은 INFO이고 설정한 레벨과 그보다 높은 레벨만 출력된다 |
| SLF4J | 인터페이스이고 Boot의 기본 구현체는 Logback |
| `@RequiredArgsConstructor` | `final` 필드와 `@NonNull` 필드만 받는 생성자 |

## 9. 헷갈리는 쌍

| 헷갈리는 쌍 | 구분 기준 |
|---|---|
| `@Component`와 `@Bean` | 클래스에 붙여 스캔으로 등록 / 설정 클래스의 메서드로 등록 |
| `@Primary`와 `@Qualifier` | 기본 후보 지정 / 주입 지점에서 이름 지정(우선) |
| singleton과 prototype | 컨테이너에 하나 / 요청할 때마다 새로 생성 |
| `postHandle`과 `afterCompletion` | 예외가 나면 생략 / 예외가 나도 호출 |
| unchecked와 checked 예외 | 기본 rollback / 기본 commit |
| `REQUIRED`와 `REQUIRES_NEW` | 바깥에 참여 / 따로 commit |
| 401과 403 | 인증 안 됨 / 권한 없음 |

## 10. 오류가 났을 때 먼저 볼 것

| 증상 | 먼저 확인할 것 |
|---|---|
| 시작할 때 빈을 찾지 못한다 | 컴포넌트 스캔 범위, 어노테이션 누락, 같은 타입의 빈이 둘인지 |
| 404와 405 | 매핑 경로와 context path, HTTP 메서드 |
| 400 | 필수 파라미터, 타입 변환, 검증, JSON 형식 |
| 403 | CSRF 토큰, 권한 규칙의 순서 |
| `Invalid bound statement` | 매퍼 XML 위치, `namespace`, `id` |
| 값이 `null`로 들어온다 | 컬럼과 프로퍼티의 이름, form 필드의 `name` |
| 예외가 났는데 DB에 반영됐다 | checked 예외인지, 예외를 잡았는지, 자기 호출인지 |
