# Backend 개념 요약 노트

자바 웹 백엔드 강의(Servlet, Front Controller와 Filter, JSP와 MVC, EL과 JSTL, Cookie와 Session, 관통 프로젝트)를 개념 중심으로 정리한 노트이다. 각 Part는 핵심 표, 짧은 코드, 자주 틀리는 포인트, 복습 질문 순서로 구성한다. 마지막 Part에는 시험 직전에 확인할 비교표와 체크리스트를 모았다.

## Part 1. 웹 프로그램과 WAS

### 1. 웹 프로그램의 구성

| 구분 | 역할 | 기술 |
|---|---|---|
| Frontend | 사용자 인터페이스 | HTML(구조와 내용) CSS(디자인) JavaScript(동작) |
| Backend | 비즈니스 로직 처리 | Java Servlet, DB 연동 |

- 웹 프로그램은 네트워크 너머의 서버에 있으면서 HTTP 요청을 받아 응답하는 프로그램이다.
- 클라이언트가 요청을 보내고 서버가 응답을 돌려주는 요청과 응답 구조로 동작한다.

### 2. 3-Tier Architecture

| 계층 | 담당 | 예 |
|---|---|---|
| presentation tier | 요청 접수, 정적 리소스 응답 | Web Server (HTML, CSS, JS 파일) |
| application tier | 동적 요청 처리 | WAS의 Servlet, 비즈니스 로직, Persistence 로직 |
| data tier | 데이터 저장 | DB Server (JDBC로 연결) |

- 애플리케이션을 논리적이고 물리적인 세 계층으로 나눈다. 계층마다 따로 개발하고 운영한다.
- 한 계층을 업데이트하거나 확장해도 다른 계층에 영향을 주지 않는다.
- 정적 요청은 Web Server가 바로 응답하고 동적 요청만 WAS로 넘긴다. 소규모 애플리케이션은 Web Server를 생략하기도 한다.

### 3. WAS, Container, Context

| 용어 | 의미 |
|---|---|
| WAS | HTTP 기반 웹 서비스를 처리하는 서버 프로그램 (예: Tomcat). 운영은 80 포트, 개발은 주로 8080 포트 |
| Container | WAS 안에서 Servlet과 JSP를 실행하는 엔진. 그래서 WAS를 Servlet Container라고도 부름 |
| Context | WAS에서 동작하는 웹 애플리케이션 하나의 실행 환경과 실행 정보. 애플리케이션과 거의 같은 뜻으로 씀 |

- 하나의 WAS에 여러 웹 애플리케이션(Context)을 동시에 올릴 수 있다.
- `http://localhost:8080` 까지가 **container root**, 그 뒤의 `/BE_01` 이 **context root**이다.

```text
http://localhost:8080/BE_01/hello
protocol://container_root/context_root/url_mapping
```

### 4. Dynamic Web Project 구조

| 위치 | 내용 |
|---|---|
| `src/main/java` | Servlet 등 Java 코드 |
| `src/main/webapp` | HTML, CSS, JS, JSP 같은 웹 리소스 (content directory) |
| `WEB-INF/lib` | 실행 중에 쓰는 라이브러리 |
| `WEB-INF/web.xml` | 배포 서술자 (deployment descriptor) |

- Context root의 기본값은 프로젝트 이름이다.
- `WEB-INF` 아래 파일은 클라이언트가 URL로 직접 요청할 수 없다.
- `web.xml`의 `welcome-file-list`는 경로 없이 context만 요청했을 때 보여 줄 파일 목록이다. 위에서부터 차례로 찾는다. 프로젝트를 만들 때 적히는 목록은 `index.html` `index.jsp` `index.htm` `default.html` `default.jsp` `default.htm`이다.

### 5. Maven

- Java 프로젝트 관리 도구로 **빌드 자동화**와 **의존성 관리**를 맡는다. 라이브러리 버전을 팀원끼리 맞추는 문제를 `pom.xml` 하나로 해결한다.
- 주요 기능은 프로젝트 구조 표준화, 의존성 관리, 빌드 자동화이다.
- Archetype은 특정 유형의 프로젝트를 만드는 템플릿이다. 웹 프로젝트는 packaging을 `war`로 지정한다.

| 항목 | 의미 |
|---|---|
| groupId | 소속 그룹(조직)의 식별자 |
| artifactId | 현재 프로젝트의 식별자 |
| version | 버전. 개발 중이면 `0.0.1-SNAPSHOT` 형태 |
| `<properties>` | 커스텀 태그로 값을 선언하고 `${이름}`으로 참조 |
| `<scope>provided</scope>` | 컴파일에는 쓰지만 실행 환경(WAS)이 제공하므로 배포에 넣지 않음 |

```xml
<properties>
  <jdk.version>21</jdk.version>
  <maven.compiler.release>${jdk.version}</maven.compiler.release>
</properties>
<dependency>
  <groupId>jakarta.servlet</groupId>
  <artifactId>jakarta.servlet-api</artifactId>
  <version>6.1.0</version>
  <scope>provided</scope>
</dependency>
```

- `pom.xml`을 고친 뒤에는 Maven Update Project로 반영한다.

### 자주 틀리는 포인트

1. container root와 context root를 같은 것으로 본다. `/`가 어디를 가리키는지는 사용하는 곳에 따라 다르다(Part 2의 경로 표 참고).
2. `WEB-INF` 안의 JSP를 브라우저 주소로 바로 열 수 있다고 생각한다.
3. `provided` scope 라이브러리가 war 파일에 포함된다고 생각한다.

### 복습 질문

1. `http://localhost:8080/BE_01/hello`에서 context root와 url mapping은 각각 무엇인가?
   답: context root는 `/BE_01`이고 url mapping은 `/hello`이다. `http://localhost:8080`까지는 container root이다.
2. 3-Tier에서 정적 요청과 동적 요청은 각각 어느 계층이 처리하는가?
   답: 정적 요청은 presentation tier의 Web Server가, 동적 요청은 application tier의 WAS(Servlet)가 처리한다. data tier는 DB에 데이터를 저장한다.
3. Maven의 두 가지 핵심 역할은 무엇인가?
   답: 빌드 자동화와 의존성 관리이다. 의존 라이브러리와 버전을 `pom.xml` 하나로 관리한다.

## Part 2. Servlet 기초

### 1. Servlet이란

- WAS에서 실행되는 Java 웹 컴포넌트이다. `jakarta.servlet.http.HttpServlet`을 상속해 만든다.
- 상속 구조는 `Servlet` `ServletConfig` `Serializable` 인터페이스를 `GenericServlet`이 구현하고 이를 `HttpServlet`이 상속한다.

| 구분 | 내용 |
|---|---|
| 장점: OOP 기반 | 유지보수와 재사용이 쉽고 플랫폼에 독립적 |
| 장점: 높은 성능 | 서블릿 객체는 **하나만** 만들고 요청마다 **스레드**로 동시 처리 |
| 장점: 확장성 | Filter로 공통 전후 처리, Listener로 이벤트 처리, Spring 등과 통합 |
| 단점 | 비즈니스 로직과 HTML 출력 코드가 한 클래스에 섞임 → JSP와 MVC로 보완 |

### 2. 요청 처리 흐름

1. 클라이언트가 HTTP 요청을 보낸다.
2. Container가 `HttpServletRequest`와 `HttpServletResponse` 객체를 만든다.
3. Context path와 url-mapping을 확인해 담당 Servlet을 찾는다.
4. Servlet 객체 상태를 확인하고(없으면 생성과 `init`) 요청을 처리할 스레드를 만든다.
5. 스레드가 `service()`를 호출하고 결과를 응답한다.

```java
@WebServlet("/hello")
public class HelloServlet
    extends HttpServlet {
  protected void doGet(
      HttpServletRequest req,
      HttpServletResponse resp)
      throws ServletException,
             IOException {
    resp.getWriter()
        .append("Served at: ")
        .append(req.getContextPath());
  }
  protected void doPost(
      HttpServletRequest req,
      HttpServletResponse resp)
      throws ServletException,
             IOException {
    doGet(req, resp);
  }
}
```

### 3. Life Cycle

| 메서드 | 호출 시점 | 용도 |
|---|---|---|
| `init()` | 첫 요청 때 객체 생성 직후 한 번 | 필요한 자원 초기화. `init`이 끝나기 전에는 어떤 요청도 처리하지 않음 |
| `service()` | 요청마다 | 요청 방식에 따라 `doGet()` 또는 `doPost()` 호출 |
| `destroy()` | WAS 종료, 재배포 때 한 번 | `init`에서 준비한 자원 정리. 처리 중인 요청이 있으면 동작하지 않음 |

- 개발자는 Servlet 클래스를 만들지만 객체 생성과 메서드 호출은 **Container가** 한다.
- 두 번째 요청부터는 객체를 새로 만들지 않고 기존 객체의 `service()`만 호출한다.

### 4. URL Mapping

| 방법 | 형태 | 비고 |
|---|---|---|
| 경로 지정 | `/hello` `/hello/hi` | 반드시 `/`로 시작 |
| 확장자 매칭 | `*.do` | `/`로 시작하는 경로 지정과 섞어 쓸 수 없음 (`/main/*.do` 불가) |
| `web.xml` | `servlet`과 `servlet-mapping`을 `servlet-name`으로 연결 | 클래스 수정 없이 매핑 변경 |
| 애너테이션 | `@WebServlet("/hello")` | `value`와 `urlPatterns`는 같은 의미 |

```xml
<servlet>
  <servlet-name>hiServlet</servlet-name>
  <servlet-class>
    com.ssafy.live.HelloServlet
  </servlet-class>
</servlet>
<servlet-mapping>
  <servlet-name>hiServlet</servlet-name>
  <url-pattern>/hi</url-pattern>
</servlet-mapping>
```

- `web.xml`과 `@WebServlet`의 매핑은 하나로 합쳐 관리된다. 같은 경로를 두 Servlet에 매핑하면 서버가 시작되지 않는다.
- `@WebServlet`의 `loadOnStartup` 기본값은 `-1`이다. 0 이상이면 첫 요청을 기다리지 않고 서버 시작 때 객체를 만든다.

### 5. 경로의 종류

| 구분 | 기준 | 사용하는 곳 |
|---|---|---|
| 상대 경로 | 현재 파일의 위치 | `/`로 시작하지 않는 경로 |
| 절대 경로: container root | `/` = `http://서버:포트` | HTML의 `a` `link` `form` `script`, `sendRedirect` |
| 절대 경로: context root | `/` = 현재 웹 애플리케이션 | url mapping, `web.xml`, `forward`, include 지시자 |

- 브라우저가 해석하는 경로는 container root 기준이므로 `request.getContextPath()`를 앞에 붙여야 한다.
- 서버 안에서 해석하는 경로는 context root 기준이므로 context 이름을 붙이지 않는다.

### 6. HTTP 메시지와 메서드

- HTTP 메시지는 Start Line, Headers, 빈 줄, Body 순서로 구성된다.
- 요청의 Start Line은 `POST /api/data HTTP/1.1`, 응답의 Start Line은 `HTTP/1.1 200 OK` 형태이다.

| 메서드 | 요청 Body | 안전 | 멱등 | 캐시 |
|---|---|---|---|---|
| GET | 선택 | 예 | 예 | 예 |
| POST | 예 | 아니오 | **아니오** | 예 |
| PUT | 예 | 아니오 | 예 | 아니오 |
| DELETE | 선택 | 아니오 | 예 | 아니오 |
| PATCH | 예 | 아니오 | 아니오 | 아니오 |
| HEAD | 선택 | 예 | 예 | 예 |

- **멱등**: 같은 요청을 여러 번 보내도 결과가 같다. POST는 멱등하지 않아 새로고침으로 중복 처리될 수 있다(Part 5의 PRG 참고).
- **안전**: 서버의 상태를 바꾸지 않는다.
- HEAD는 응답에 Body가 없다.

### 7. HttpServletRequest

| 메서드 | 반환 | 설명 |
|---|---|---|
| `getMethod()` | `String` | HTTP 메서드 이름 |
| `getParameter(name)` | `String` | 파라미터 값 하나. 없으면 `null` |
| `getParameterValues(name)` | `String[]` | 같은 이름의 값 전체 (체크박스) |
| `getParameterNames()` | `Enumeration<String>` | 파라미터 이름 목록 |
| `getParameterMap()` | `Map<String, String[]>` | 이름과 값 배열의 맵 |
| `getHeader(name)` | `String` | 요청 헤더 값 |
| `setAttribute` `getAttribute` | `void` `Object` | 요청 범위 속성 저장과 조회 |
| `getSession()` | `HttpSession` | 현재 요청과 연결된 세션 |

- 요청 파라미터는 `form`이나 쿼리스트링으로 전달된다. 값은 **언제나 문자열**이고 클라이언트가 보낸 뒤 서버에서 바꿀 수 없다.
- 그래서 Servlet이 가장 먼저 하는 일은 파라미터 추출과 검증이다. 숫자는 `Integer.parseInt`로 변환하고 `NumberFormatException`을 대비한다.

### 8. HttpServletResponse

| 메서드 | 설명 |
|---|---|
| `setStatus()` | 응답 상태 코드 설정 |
| `setHeader()` | 응답 헤더 설정 |
| `setContentType()` | 콘텐츠 타입과 인코딩 설정 |
| `getWriter()` | 문자 응답 스트림(`PrintWriter`) |
| `addCookie()` | 응답에 쿠키 추가 |
| `sendRedirect()` | 지정한 URL로 다시 요청하게 함 |
| `sendError()` | 에러 응답 전송 |

| 코드 | 이름 | 의미 |
|---|---|---|
| 200 | OK | 정상 처리 |
| 201 | Created | 새 리소스 생성 성공 |
| 302 | Found | 리소스가 임시로 다른 위치에 있음 (redirect) |
| 400 | Bad Request | 잘못된 요청 문법 |
| 401 | Unauthorized | 인증 실패. 누구인지 모름 |
| 403 | Forbidden | 누구인지는 알지만 권한 없음 |
| 404 | Not Found | 리소스를 찾을 수 없음 |
| 405 | Method Not Allowed | 허용하지 않는 HTTP 메서드 |
| 500 | Internal Server Error | 서버 내부 오류 |

| Content-Type | 용도 |
|---|---|
| `text/html` | 브라우저가 렌더링할 HTML |
| `application/json` | JSON 데이터 (AJAX 통신) |
| `image/jpeg` | 이미지 바이너리 |
| `multipart/form-data` | 텍스트와 파일을 함께 보내는 파일 업로드 |

- 응답의 기본 인코딩은 ISO-8859-1이라 한글이 깨진다. **출력하기 전에** 타입과 인코딩을 함께 설정한다.

```java
resp.setContentType(
    "text/html;charset=UTF-8");
resp.getWriter().append("<h1>한글</h1>");
```

### 9. Servlet에서 할 일의 순서

1. 요청 파라미터 조회 (로깅과 검증 포함)
2. 비즈니스 로직 처리
3. 필요하면 Persistence 로직(DB) 연동
4. 응답 준비 (Content-Type과 인코딩 설정)
5. 응답을 위한 Presentation 로직 (HTML 생성)

### 자주 틀리는 포인트

1. 요청마다 Servlet 객체가 새로 만들어진다고 생각한다. 객체는 하나이고 스레드가 요청마다 생긴다.
2. `init()`이 요청마다 호출된다고 생각한다.
3. `getParameter`가 숫자를 돌려준다고 생각한다. 언제나 `String`이고 없으면 `null`이다.
4. `setContentType`을 `getWriter()`로 출력한 뒤에 호출해도 된다고 생각한다.
5. 401과 403을 바꿔 말한다. 401은 인증, 403은 권한 문제이다.
6. `form action`의 `/`를 context root로 착각한다.

### 복습 질문

1. 서버를 켠 뒤 같은 Servlet에 요청이 세 번 오면 `init`과 `service`는 각각 몇 번 호출되는가?
   답: `init`은 첫 요청 때 한 번, `service`는 요청마다 세 번 호출된다. 객체는 하나만 만들어지고 두 번째 요청부터는 `service`만 호출한다.
2. `*.do`와 `/main/*`의 차이는 무엇이며 둘을 합친 `/main/*.do`는 왜 쓸 수 없는가?
   답: `*.do`는 확장자로 매칭하고 `/main/*`는 경로로 매칭한다. 확장자 매칭은 `/`로 시작하는 경로 지정과 함께 쓸 수 없어서 `/main/*.do`는 불가능하다.
3. GET, PUT, DELETE는 멱등한데 POST는 왜 멱등하지 않은가?
   답: POST는 같은 요청을 보낼 때마다 새 데이터가 만들어지는 식으로 서버 상태가 계속 달라진다. GET은 조회만 하고 PUT은 같은 내용으로 덮어쓰며 DELETE는 이미 지워진 것을 다시 지워도 결과가 같다.
4. 체크박스로 여러 값이 넘어올 때 쓰는 메서드는 무엇인가?
   답: `getParameterValues(name)`이다. 같은 이름의 값을 `String[]`로 돌려준다.

## Part 3. Front Controller, Filter, Listener, Multi-Thread

### 1. Front Controller 패턴

- 기존 방식은 요청과 Servlet이 1:1이라 요청이 늘 때마다 Servlet을 새로 만들고 로깅, 예외 처리, 응답 설정 코드가 Servlet마다 중복된다.
- Front Controller는 **모든 요청을 맨 앞에서 받는 Servlet 하나**이다. 공통 전후 처리를 한 뒤 요청에 맞는 처리 메서드(또는 별도 클래스)로 분기한다.

| 장점 | 내용 |
|---|---|
| 단일 진입점 | 모든 요청을 한 곳에서 접수해 처리가 일관됨 |
| 공통 처리 | 인증, 권한 검사, 로깅을 한 번에 처리 |
| 유연한 확장 | 새 요청은 분기 하나만 추가 |
| 코드 간결성 | Servlet을 여러 개 만드는 번거로움이 줄고 가독성이 좋아짐 |

### 2. 요청을 구분하는 방법

| 방법 | 예 | 경로 파악 | 주의 |
|---|---|---|---|
| action 파라미터 | `/main?action=gugu&dan=3` | `getParameter("action")` | form에서는 `hidden` input으로 action 전달 |
| `/main/*` | `/main/hello` | `getPathInfo()` | `/*`로 쓰면 정적 리소스까지 모두 빨아들임 |
| `*.do` | `/gugu.do?dan=3` | `getServletPath()` | 경로로 범위를 한정할 수 없음 |
| `/` | 매핑되지 않은 모든 요청 | | 기본(default) Servlet을 재정의하므로 정적 요청 처리가 따로 필요. Spring MVC의 기본 방식 |

```java
@WebServlet("/main")
public class MainController
    extends HttpServlet
    implements ControllerHelper {
  protected void doGet(
      HttpServletRequest req,
      HttpServletResponse resp)
      throws ServletException,
             IOException {
    String action =
        getActionParameter(req, resp);
    switch (action) {
      case "gugu" -> gugu(req, resp);
    }
  }
}
```

- 여러 Front Controller(`/main`, `/member`)가 공통으로 쓰는 기능은 인터페이스 `ControllerHelper`의 `default` 메서드로 모은다.
- `getActionParameter`는 파라미터를 로깅하고 action이 `null`이거나 비어 있으면 `"index"`를 돌려준다.

### 3. Filter

- 웹 컴포넌트(Servlet, JSP) 실행 **전과 후에** 요청과 응답을 가로채 부가 기능을 수행하는 웹 컴포넌트이다.
- 여러 Filter를 이어 **Filter Chain**을 만들 수 있다.
- 여러 컨트롤러 중 일부에만 필요한 공통 기능처럼 상속으로 묶기 어려운 기능을 URL 규칙으로 적용할 때 쓴다.

| 용도 | 예 |
|---|---|
| 인증과 권한 | 로그인하지 않았거나 권한이 없으면 로그인 페이지로 redirect |
| 로깅 | 요청과 응답 기록, 문제 분석 |
| 보안 | XSS 방지를 위한 입력 값 변환 (`<`를 `&lt;`, `>`를 `&gt;`) |

```java
@WebFilter(urlPatterns = "/*",
    dispatcherTypes =
        DispatcherType.REQUEST)
public class LogFilter
    extends HttpFilter {
  public void doFilter(
      HttpServletRequest req,
      HttpServletResponse resp,
      FilterChain chain)
      throws IOException,
             ServletException {
    // 요청 단계 처리
    chain.doFilter(req, resp);
    // 응답 단계 처리
  }
}
```

- 수명 주기: 생성자 → `init()` → 요청마다 `doFilter()` → `destroy()`. Servlet과 비슷하다.
- `chain.doFilter()`는 다음 Filter를 호출하고 다음 Filter가 없으면 Servlet을 호출한다. 이 호출을 빼면 요청이 Servlet까지 가지 않는다.
- `chain.doFilter()` 이후의 응답 단계에서는 응답이 이미 커밋됐을 수 있으므로 forward와 redirect를 할 수 없다.
- `jakarta.servlet.http.HttpFilter`를 상속하고 `@WebFilter` 또는 `web.xml`의 `filter`와 `filter-mapping`으로 등록한다.

| dispatcher | 적용 시점 |
|---|---|
| `REQUEST` | 클라이언트의 직접 요청 (기본값). forward된 요청에는 동작하지 않음 |
| `FORWARD` | `forward()`로 이동할 때 |
| `INCLUDE` | `include()`로 포함할 때 |
| `ERROR` | 에러 페이지로 전달할 때 (`web.xml`에 `error-page` 설정 필요) |

- 요청 파라미터는 직접 바꿀 수 없으므로 XSS Filter는 `HttpServletRequestWrapper`를 상속한 Wrapper로 요청을 감싸 `getParameter`를 재정의한다.

### 4. Listener

- 웹 애플리케이션에서 발생하는 이벤트를 감시하는 객체이다.

| 이벤트 범위 | 리스너 |
|---|---|
| Servlet Context | `ServletContextListener` (생성과 소멸), `ServletContextAttributeListener` |
| HTTP Session | `HttpSessionListener`, `HttpSessionAttributeListener`, `HttpSessionActivationListener`, `HttpSessionBindingListener` |
| Servlet Request | `ServletRequestListener`, `ServletRequestAttributeListener` |

- `ServletContextListener`는 애플리케이션 시작(`contextInitialized`)과 종료(`contextDestroyed`)를 감시한다. 개별 Servlet보다 먼저, 비용이 큰 공유 자원을 초기화할 때 쓴다.
- `@WebListener` 또는 `web.xml`의 `listener`로 등록한다.

### 5. Servlet과 Multi-Thread

- Servlet 객체는 하나이고 여러 요청 스레드가 **공유**한다. 그래서 Servlet은 Thread Safe하지 않다.
- 멤버 변수에 상태를 두면 동시 요청에서 데이터가 훼손될 수 있다.

```java
private long stock = 1;

void buy(/* 생략 */) {
  if (stock > 0) {
    sleep(10_000); // 판매 처리 중
    stock--;
  }
}
```

- 위 코드에 두 요청이 동시에 들어오면 둘 다 `stock > 0`을 통과해 재고가 `-1`이 된다.
- `synchronized`로 한 번에 하나씩 처리하면 데이터는 지켜지지만 성능이 떨어진다.
- 결론: **Servlet에는 멤버 변수로 상태를 관리하지 않는다.** 지역 변수와 Web scope를 쓴다.

| 동기화 도구 | 통로 수 | 예 |
|---|---|---|
| 뮤텍스(Mutex) | 하나 | `synchronized` 블록 (열쇠 하나인 화장실) |
| 세마포어(Semaphore) | 여러 개 | Connection Pool (자리가 정해진 주차장) |

### 자주 틀리는 포인트

1. Filter에서 `chain.doFilter()`를 호출하지 않아도 Servlet이 실행된다고 생각한다.
2. `REQUEST` dispatcher Filter가 forward된 요청에도 다시 적용된다고 생각한다.
3. `/*` 매핑이 JSP와 정적 파일 요청은 건드리지 않는다고 생각한다.
4. Servlet 멤버 변수가 요청마다 따로 만들어진다고 생각한다.
5. Listener와 Filter의 역할을 섞는다. Filter는 요청을 가로채고 Listener는 이벤트를 감시한다.

### 복습 질문

1. Front Controller의 장점 네 가지는 무엇인가?
   답: 단일 진입점, 공통 처리, 유연한 확장성, 코드 간결성이다.
2. Filter의 응답 단계에서 redirect를 할 수 없는 이유는 무엇인가?
   답: `chain.doFilter()` 이후에는 응답이 이미 커밋됐을 수 있어서 forward와 redirect로 응답을 바꿀 수 없다.
3. XSS Filter가 요청 객체를 직접 고치지 않고 Wrapper를 쓰는 이유는 무엇인가?
   답: 요청 파라미터는 직접 바꿀 수 없다. 그래서 `HttpServletRequestWrapper`로 요청을 감싸 `getParameter`가 변환된 값을 돌려주게 재정의한다.
4. Servlet의 멤버 변수 `count`를 여러 요청이 증가시키면 어떤 문제가 생기는가?
   답: Servlet 객체는 하나이고 스레드가 공유하므로 동시 요청이 같은 변수를 건드려 값이 훼손된다. `synchronized`로 막으면 성능이 떨어지므로 멤버 변수로 상태를 두지 않는다.

## Part 4. JSP와 MVC 패턴

### 1. JSP

- Jakarta Server Pages. Servlet이 Java 코드 안에 HTML을 쓴다면 JSP는 **HTML 안에 Java 코드**를 쓴다.
- JSP는 중간 단계이고 최종 실행은 Servlet이다. `xxx.jsp`가 `xxx_jsp.java`(Servlet)로 변환되고 `xxx_jsp.class`로 컴파일된다.
- 최초 요청 때만 변환과 컴파일을 하고 이후 요청은 컴파일된 Servlet을 실행한다.

| 메서드 | 시점 |
|---|---|
| `jspInit()` | 객체 생성 직후 |
| `_jspService()` | 요청마다 |
| `jspDestroy()` | WAS 종료, 재배포 때 |

| 구분 | Servlet | JSP |
|---|---|---|
| 실행 과정 | 컴파일된 `.class`를 컨테이너가 바로 실행 | 최초 요청 때 Servlet으로 변환하고 컴파일한 뒤 실행 |
| 형태 | Java 코드 안에 HTML | HTML 안에 Java 코드 |
| 개발 생산성 | 화면 작업이 복잡하고 번거로움 | 화면 구성이 직관적 |

### 2. JSP 구성 요소

| 요소 | 형태 | 변환 결과 |
|---|---|---|
| directive | `<%@ %>` | 페이지 속성을 컨테이너에 알림 |
| scriptlet | `<% %>` | `_jspService()` 내부 코드 (지역 영역) |
| expression | `<%= %>` | `_jspService()` 안의 `out.print()` |
| declaration | `<%! %>` | 클래스 영역의 멤버 변수와 메서드 |
| comment | `<%-- --%>` | 변환된 Servlet에 전달되지 않음 |
| EL | `${expr}` | 속성 출력을 쉽게 |
| JSTL | `<c:if>` 등 | 표준 커스텀 태그 |

- scriptlet은 지역 영역이라 내장 객체(`request`, `response`, `out` 등)를 바로 쓸 수 있고 같은 이름의 지역 변수를 선언할 수 없다.
- declaration은 위치와 관계없이 멤버로 선언된다. Servlet처럼 공유되므로 상태를 두면 안 된다.
- expression 안에는 세미콜론을 쓰지 않는다. 값을 돌려주는 식만 쓴다.
- HTML 주석 `<!-- -->`은 브라우저까지 전달되므로 민감한 내용은 JSP 주석으로 숨긴다.

### 3. directive

| directive | 용도 |
|---|---|
| `page` | 페이지 기본 정보 (모든 JSP에 필요) |
| `taglib` | 사용할 태그 라이브러리 지정 (JSTL) |
| `include` | 다른 문서를 특정 위치에 포함 (모듈화와 재사용) |

| page 속성 | 기본값 | 설명 |
|---|---|---|
| `contentType` | `text/html;charset=ISO-8859-1` | MIME 타입과 인코딩 |
| `pageEncoding` | `UTF-8` (강의 환경) | JSP 파일 자체의 인코딩 |
| `import` | | 사용할 클래스 패키지 (여러 번 가능) |
| `session` | `true` | 세션 사용 여부 |
| `buffer` | `8kb` | 출력 버퍼 크기 |
| `autoFlush` | `true` | 버퍼가 차면 자동 전송 |
| `errorPage` | | 오류 때 이동할 페이지 |
| `isErrorPage` | `false` | `true`일 때만 `exception` 내장 객체 사용 |

### 4. 내장 객체(Built-in Object)

| 이름 | 타입 | 용도 |
|---|---|---|
| `request` | `HttpServletRequest` | 요청 정보 |
| `response` | `HttpServletResponse` | 응답 정보 |
| `out` | `JspWriter` | 응답 출력 스트림 |
| `pageContext` | `PageContext` | 현재 JSP 페이지 정보 |
| `session` | `HttpSession` | 세션 정보 |
| `application` | `ServletContext` | 웹 애플리케이션 정보 |
| `exception` | `Throwable` | `isErrorPage="true"`인 페이지의 예외 |
| `config` | `ServletConfig` | JSP 설정 정보 |

### 5. Web Scope

| scope | 유효 범위 | Servlet에서 얻기 | JSP 객체 |
|---|---|---|---|
| page | 현재 페이지 안 | 없음 | `pageContext` |
| request | 요청부터 응답 완료까지 | `doGet`의 `request` 파라미터 | `request` |
| session | 세션 종료(로그아웃, 만료)까지 | `request.getSession()` | `session` |
| application | 웹 애플리케이션 종료까지 | `getServletContext()` | `application` |

- 범위가 작은 순서는 page < request < session < application이다.
- 네 scope 모두 `setAttribute` `getAttribute` `removeAttribute` `getAttributeNames`를 쓴다. 같은 키로 저장하면 덮어쓰고 없는 키를 읽으면 `null`이다.

| 구분 | Parameter | Attribute |
|---|---|---|
| 출처 | 클라이언트가 전송 (form, URL, AJAX) | 서버가 저장 (`setAttribute`) |
| 타입 | `String` | `Object` |
| 수정 | 불가 (읽기 전용) | `setAttribute` `removeAttribute`로 가능 |
| 쓰임 | 사용자 입력값, 검색어 | 처리 결과, DB 조회 결과 |

### 6. MVC 패턴

| 구성 | 역할 | Java Web |
|---|---|---|
| Model | 비즈니스 로직(Service)과 DB 연동(DAO) | Java 클래스 |
| View | 응답 화면 작성 | JSP |
| Controller | 요청 검증, Model 호출, 결과를 scope에 저장, View 선택 | Servlet |

| 구분 | Model 1 | Model 2 |
|---|---|---|
| 구조 | JSP가 Controller와 View를 함께 담당 | Servlet이 Controller, JSP는 View만 |
| 장점 | 구조가 단순하고 개발이 빠름 | 역할 분리로 유지보수, 재사용, 확장이 쉬움 |
| 단점 | 로직과 화면이 섞여 유지보수가 어려움 | 초기 설정이 복잡하고 학습 곡선이 가파름 |

- MVC 작성 순서: Model(비즈니스 로직과 화면에 줄 데이터) → View(데이터 활용) → Controller(둘을 잇는 접착제). 유즈케이스 단위로 작성한다.

### 7. forward와 redirect

- 서블릿과 JSP는 메서드처럼 직접 호출하지 않는다. 컨테이너에게 `forward` 또는 `redirect`로 이동을 요청한다.

```java
// forward: 서버 안에서 이동
request.getRequestDispatcher(
    "/gugu-result.jsp")
    .forward(request, response);

// redirect: 브라우저에게 재요청 지시
response.sendRedirect(
    request.getContextPath() + "/");
```

| 구분 | forward | redirect |
|---|---|---|
| 동작 | 서버 안에서 다른 자원으로 이동 | 302 응답으로 브라우저가 새 URL을 요청 |
| 클라이언트 요청 수 | 1번 | 2번 |
| 브라우저 URL | 바뀌지 않음 | 바뀜 |
| request 객체 | 같은 객체 공유 (parameter, attribute 유지) | 새 객체 (attribute 사라짐) |
| 데이터 전달 | request attribute로 객체 전달 | 쿼리스트링 문자열 또는 session attribute |
| 이동 범위 | 같은 웹 애플리케이션 안 | 다른 애플리케이션, 외부 사이트 가능 |
| `/`의 기준 | context root | container root |
| 속도 | 빠름 | 왕복 통신으로 느림 |

| 언제 쓰나 | 예 |
|---|---|
| forward | 조회 결과를 화면에 표시, 입력 오류 후 입력값을 살려 폼으로 되돌림 |
| redirect | 로그인 성공 후 메인으로, 등록과 삭제 후 목록으로, 오류 후 초기 상태로 |

### 8. MVC 흐름 예시 (구구단)

1. `index.jsp`의 링크가 `GET /main?action=gugu-form`을 요청한다.
2. `MainController`가 `gugu-form.jsp`로 forward한다.
3. 폼이 `GET /main?action=gugu&dan=4`를 보낸다.
4. Controller가 `dan`을 검증하고 Service의 `getGugu(4)`를 호출해 결과를 request attribute `result`에 저장한다.
5. `gugu-result.jsp`로 forward해서 결과를 출력한다.

- `dan`이 비어 있으면 `alertMsg`를 attribute로 담아 다시 폼으로 forward한다.
- Service가 범위를 벗어난 값에 예외를 던지면 Controller가 잡아서 다른 곳으로 redirect한다.

### 자주 틀리는 포인트

1. JSP가 Servlet 없이 해석되어 실행된다고 생각한다. JSP는 Servlet으로 변환된다.
2. declaration 변수를 요청마다 새로 만들어지는 지역 변수로 착각한다.
3. redirect 뒤의 페이지에서 이전 request attribute를 읽을 수 있다고 생각한다.
4. forward 후 브라우저 주소창이 JSP 경로로 바뀐다고 생각한다.
5. forward 경로에 context path를 붙인다. forward의 `/`는 이미 context root이다.
6. Parameter를 `setParameter`로 바꿀 수 있다고 생각한다. 그런 메서드는 없다.

### 복습 질문

1. `<%! int count = 0; %>`와 `<% int count = 0; %>`는 변환 후 어디에 놓이는가?
   답: `<%! %>`는 클래스 영역의 멤버 변수가 되어 요청 사이에 공유되고, `<% %>`는 `_jspService()` 안의 지역 변수가 되어 요청마다 새로 만들어진다.
2. 등록 처리 후 목록 화면으로 갈 때 forward 대신 redirect를 쓰는 이유는 무엇인가?
   답: forward로 응답하면 새로고침이 마지막 POST를 다시 보내 등록이 중복된다. redirect로 GET 요청이 되게 하면 새로고침해도 목록 조회만 다시 실행된다.
3. Model 2에서 Controller가 하는 일 네 가지는 무엇인가?
   답: 요청 검증, Model(Service) 호출, 결과를 scope에 저장, View 선택(forward 또는 redirect)이다.
4. 로그인 정보를 저장할 scope와 검색 결과를 저장할 scope는 각각 무엇인가?
   답: 로그인 정보는 로그아웃이나 만료까지 유지해야 하므로 session, 검색 결과는 한 요청의 응답에만 쓰이므로 request이다.

## Part 5. EL, JSTL, PRG

### 1. PRG (Post Redirect Get)

- 새로고침은 직전 요청을 다시 보낸다. POST 처리 후 forward로 화면을 보여 주면 새로고침할 때 등록이 중복된다.
- POST를 처리한 뒤에는 **redirect로 GET 요청을 하게 만든다.** 새로고침해도 마지막 GET만 다시 실행된다.
- 반대로 가입 실패(중복 이메일)처럼 입력값을 살려 폼으로 돌아가야 하면 forward로 오류 정보를 request attribute에 담는다.

### 2. EL (Expression Language)

- JSP에서 Java 코드를 없애고 태그 중심으로 쓰기 위한 표현 언어이다. expression `<%= %>`를 대신한다.
- `${이름}`은 page → request → session → application 순서로 **작은 범위부터** 찾아 처음 찾은 값을 쓴다.
- 특정 범위를 지정하려면 `${sessionScope.sum}`처럼 쓴다.
- 값이 없으면 `null`을 출력하지 않고 **빈 문자열**을 출력한다.

| 내장 객체 | 타입 | 내용 |
|---|---|---|
| `pageContext` | `PageContext` | 현재 페이지 정보 (`pageContext.request.contextPath`) |
| `pageScope` `requestScope` `sessionScope` `applicationScope` | `Map` | 각 범위의 속성 |
| `param` | `Map` | 파라미터 값 하나 |
| `paramValues` | `Map` | 파라미터 값 배열 |
| `header` `headerValues` | `Map` | 요청 헤더 |
| `cookie` | `Map` | 쿠키 이름과 `Cookie` 객체 |

- 객체의 값은 필드가 아니라 **getter**로 읽는다. `${member.name}`은 `getName()`을 호출한다. record는 필드 이름 메서드를 호출한다.
- Map은 key로 읽는다. 이름에 `-`가 있으면 점 표기를 못 쓰고 `${header["User-Agent"]}`처럼 대괄호를 쓴다.
- 메서드 호출도 된다. `${list.size()}`, `${list.contains("hong")}`

| 연산 | 기호 | 문자 |
|---|---|---|
| 나눗셈, 나머지 | `/` `%` | `div` `mod` |
| 비교 | `<` `>` `<=` `>=` `==` `!=` | `lt` `gt` `le` `ge` `eq` `ne` |
| 논리 | `&&` `!` | `and` `or` `not` |
| 빈 값 검사 | | `empty` |

| 식 | 결과 | 이유 |
|---|---|---|
| `${"1" + "2"}` | `3` | `+`는 문자열 결합이 아니라 숫자 덧셈. 자동 형변환 |
| `${"1" + "b"}` | 오류 | `"b"`를 숫자로 바꿀 수 없음 |
| `${5 / 2}` | `2.5` | 정수끼리도 실수 나눗셈 |
| `${"CAT" > "DOG"}` | `false` | 문자열은 사전 순 비교 |
| `${empty list}` | `true` | `null`, 빈 문자열, 길이 0 배열, 빈 컬렉션이면 참 |

- JSP 안의 JavaScript 템플릿 문자열 `${}`는 서버의 EL이 먼저 해석해 버린다. JavaScript 쪽은 `\${}`로 이스케이프한다.

### 3. JSTL

- JSP Standard Tag Library. 자주 쓰는 커스텀 태그를 표준화한 라이브러리이다. 별도 라이브러리(API와 구현체)를 추가해야 한다.
- MVC2에서는 주로 core(`c`)와 formatting(`fmt`)을 쓴다. 이 밖에 functions(`fn`), xml(`x`), sql이 있다.

```jsp
<%@ taglib prefix="c"
    uri="jakarta.tags.core" %>
<c:set var="root"
    value="${pageContext.request.contextPath}" />
```

| 태그 | 역할 | 주의 |
|---|---|---|
| `<c:set>` | 속성 저장 | `scope` 기본값은 page |
| `<c:remove>` | 속성 삭제 | |
| `<c:if test="">` | 조건문 | **else가 없음**. `var`에 결과 저장 가능 |
| `<c:choose>` | 다중 조건 | `<c:when>`과 `<c:otherwise>`로 if-else 구현 |
| `<c:forEach>` | 반복 | `items` `var` `begin` `end` `step` `varStatus` |

```jsp
<c:forEach items="${members}"
    var="m" varStatus="vs">
  ${vs.count}. ${m.name}
</c:forEach>
```

- `varStatus`의 `index`는 0부터, `count`는 1부터 센다.
- Map을 순회하면 항목이 entry이므로 `${entry.key}` `${entry.value}`로 읽는다.
- `test`에는 `true`나 `false` 값, EL을 쓴다. 그 밖의 값은 `false`로 처리된다.

### 4. include directive

- `<%@ include file="/common.jsp" %>`는 다른 JSP의 내용을 현재 페이지에 **그대로 붙여** 하나의 Servlet으로 만든다. 그래서 변수를 공유한다.
- 포함되는 파일에는 전체 HTML 구조가 필요 없지만 page 지시자는 필요하다.
- 공통 EL 변수(`root`), 공통 CSS와 JS를 모아 둘 때 쓴다. 경로의 `/`는 context root이다.

### 5. 공유 데이터와 동기화

- 여러 요청이 같은 목록을 쓰는 DAO는 수정 메서드를 `synchronized`로 감싼다.
- 조회 결과는 `Collections.unmodifiableList(new ArrayList<>(members))`처럼 **복사본을 읽기 전용으로** 넘겨 원본을 보호한다.

### 자주 틀리는 포인트

1. EL이 값이 없을 때 `null`을 출력한다고 생각한다.
2. `${"1" + "2"}`가 `"12"`라고 생각한다.
3. `<c:if>`에 else가 있다고 생각한다.
4. `${member.name}`이 `name` 필드에 직접 접근한다고 생각한다.
5. 같은 이름의 속성이 request와 session에 모두 있을 때 session 값이 먼저 나온다고 생각한다.
6. PRG에서 가입 실패도 redirect로 처리한다. 입력값을 살려야 하면 forward이다.

### 복습 질문

1. `${sum}`을 찾는 scope 순서는 무엇인가?
   답: page, request, session, application 순서로 작은 범위부터 찾고 처음 찾은 값을 쓴다.
2. `${empty ""}`, `${empty null}`, `${10 div 4}`의 결과는 각각 무엇인가?
   답: `true`, `true`, `2.5`이다. 빈 문자열과 `null`은 empty이고 `div`는 정수끼리도 실수 나눗셈이다.
3. POST 등록 후 forward로 응답하면 새로고침할 때 어떤 문제가 생기는가?
   답: 브라우저가 마지막 POST 요청을 다시 보내 같은 데이터가 중복 등록된다. 그래서 POST 뒤에는 redirect로 GET을 하게 만든다(PRG).
4. `varStatus`의 `index`와 `count`는 어떻게 다른가?
   답: `index`는 0부터, `count`는 1부터 센다.

## Part 6. Cookie와 Session

### 1. HTTP의 무상태성

- HTTP는 요청이 끝나면 상태를 기억하지 않는다(stateless). 덕분에 단순하고 확장(분산)이 쉽고 자원을 아낀다.
- 로그인처럼 상태를 이어야 할 때는 Cookie(클라이언트 저장)와 Session(서버 저장)을 쓴다.

### 2. Cookie

- 서버가 만들어 응답으로 보내고 **브라우저가 저장**한다. 이후 요청마다 브라우저가 자동으로 서버에 보낸다.
- `jakarta.servlet.http.Cookie`로 만들고 `response.addCookie()`로 응답에 실어야 저장된다.

| 속성 | 설명 |
|---|---|
| name | 이름. getter만 있음. 같은 이름이면 덮어씀 |
| value | 값. 공백이나 한글은 `URLEncoder.encode`로 인코딩해 저장 |
| path | 이 경로와 하위 경로 요청에만 전송. `/`로 두면 같은 도메인의 다른 애플리케이션에도 전송되어 보안에 주의 |
| maxAge | 양수: 초 단위 유효 시간 |
| | 음수 또는 미지정: 세션 쿠키 (브라우저 종료 때 삭제) |
| | 0: 즉시 삭제 (삭제 메서드가 따로 없음) |
| secure | HTTPS 연결에서만 전송 |
| httpOnly | JavaScript로 접근 불가 → XSS로 쿠키 탈취 방지 |
| SameSite | 다른 사이트에서 온 요청에 쿠키를 보낼지 결정 → CSRF 방지 |

| SameSite | 다른 사이트 링크 클릭 | 다른 사이트 POST 폼 | 다른 사이트 AJAX, img |
|---|---|---|---|
| Strict | 차단 | 차단 | 차단 |
| Lax (기본) | 전송 | 차단 | 차단 |
| None | 전송 | 전송 | 전송 (`Secure` 필수) |

```java
Cookie c = new Cookie("recent",
    URLEncoder.encode(value, UTF_8));
c.setMaxAge(60 * 10);
c.setHttpOnly(true);
response.addCookie(c);
```

- 서버는 `request.getCookies()`로 읽는다. 쿠키가 없으면 `null`이므로 확인 후 순회한다.
- 클라이언트는 서버로 **name과 value만** 보낸다. maxAge나 path는 읽을 수 없다.
- 이번 응답에서 만든 쿠키는 **다음 요청부터** 서버에 도착한다. 같은 요청에서 forward한 JSP는 새 쿠키를 읽지 못한다.
- EL에서는 `${cookie.이름.value}` 또는 `${cookie["just-10-min"].value}`로 읽는다.

### 3. Session

- 클라이언트 상태를 **서버에** 저장한다. 브라우저마다 하나씩 만들어진다.
- 세션 식별자는 `JSESSIONID` 쿠키로 주고받는다. 서버는 이 값을 키로 자기 쪽 세션 공간을 찾는다.

| 메서드 | 설명 |
|---|---|
| `request.getSession()` | 현재 세션 반환. 없으면 새로 생성 |
| `setAttribute` `getAttribute` `removeAttribute` | 속성 관리 |
| `invalidate()` | 세션 전체 무효화 (로그아웃) |
| `getId()` | 세션 ID |
| `getMaxInactiveInterval()` `setMaxInactiveInterval(초)` | 비활성 유지 시간 |
| `getCreationTime()` `getLastAccessedTime()` | 생성 시각, 마지막 접근 시각 |

- 세션은 마지막 접근 시각부터 비활성 유지 시간이 지나면 만료된다.
- `web.xml`의 `session-timeout`은 **분** 단위, `setMaxInactiveInterval`은 **초** 단위이다.

```xml
<session-config>
  <session-timeout>30</session-timeout>
</session-config>
```

| 구분 | Cookie | Session |
|---|---|---|
| 저장 위치 | 브라우저 | 서버 |
| 값 타입 | 문자열 | 객체 |
| 수명 | maxAge로 지정. 브라우저를 닫아도 유지 가능 | 만료 시간, `invalidate`, 브라우저 종료 |
| 보안 | 사용자가 보고 바꿀 수 있음 | 상대적으로 안전 |

### 4. 로그인과 로그아웃

```java
Member m = service.login(email, pw);
if (m != null) {
  request.getSession()
      .setAttribute("loginUser", m);
  redirect(request, response, "/");
} else {
  request.setAttribute("alertMsg",
      "로그인 실패");
  forward(request, response,
      "/member/login-form.jsp");
}
```

- 로그아웃은 `session.invalidate()`로 세션 전체를 없앤다. `removeAttribute("loginUser")`는 로그인 정보만 지우고 장바구니 같은 다른 속성은 남긴다.
- 화면에서는 `<c:if test="${empty loginUser}">`로 로그인 링크와 사용자 이름을 나눠 보여 준다.
- 로그인이 필요한 경로(`/auth/*`)는 Filter에서 `loginUser`를 확인하고 없으면 로그인 폼으로 redirect한다.

### 5. 예외 처리

- 예외 정보를 클라이언트에 그대로 보여 주지 않는다. 사용자용 페이지를 보여 주고 로그를 남긴다.

| 상황 | 처리 |
|---|---|
| Front Controller까지 왔지만 action이 없음 | `response.sendError(SC_NOT_FOUND)` 또는 404 페이지로 forward |
| Front Controller 매핑에도 없는 경로 | Servlet에 도달하지 않으므로 코드로 처리 불가. WAS의 기본 404 |
| 예상한 예외 | Controller의 try-catch로 처리 후 적절한 페이지로 이동 |
| 예상하지 못한 예외 | `web.xml`의 `error-page`로 WAS 오류 처리를 사용자 정의 |

```xml
<error-page>
  <error-code>404</error-code>
  <location>/error/404.jsp</location>
</error-page>
```

### 자주 틀리는 포인트

1. 쿠키를 `new Cookie()`만 하고 `addCookie()`를 빠뜨린다.
2. `maxAge`가 음수면 즉시 삭제된다고 생각한다. 즉시 삭제는 0, 음수는 세션 쿠키이다.
3. `session-timeout`과 `setMaxInactiveInterval`의 단위를 같게 본다.
4. 세션이 쿠키와 무관하다고 생각한다. `JSESSIONID` 쿠키가 필요하다.
5. `invalidate()`와 `removeAttribute()`의 차이를 구분하지 못한다.
6. 서버가 `request.getCookies()`로 쿠키의 maxAge를 확인할 수 있다고 생각한다.

### 복습 질문

1. maxAge를 60, -1, 0으로 준 세 쿠키는 각각 언제 사라지는가?
   답: 60은 60초 뒤, -1은 브라우저를 종료할 때(세션 쿠키), 0은 응답을 받는 즉시 삭제된다.
2. httpOnly와 SameSite는 각각 어떤 공격을 막는가?
   답: httpOnly는 JavaScript가 쿠키를 읽지 못하게 해 XSS로 인한 쿠키 탈취를 막고, SameSite는 다른 사이트에서 온 요청에 쿠키를 보내지 않게 해 CSRF를 막는다.
3. 세션 만료 시간을 web.xml에 30으로 적으면 몇 초인가?
   답: `session-timeout`은 분 단위이므로 30분, 즉 1800초이다. `setMaxInactiveInterval`은 초 단위이다.
4. Filter로 로그인 여부를 검사할 때 로그인하지 않은 사용자는 어떻게 처리하는가?
   답: 세션에 `loginUser`가 없으면 안내 메시지를 담고 context path를 붙여 로그인 폼으로 redirect한다. 있으면 `chain.doFilter()`로 통과시킨다.

## Part 7. 관통 프로젝트 (AJAX, Paging, 회원 관리)

### 1. 프로젝트 구조

- MVC 기반 Enterprise Web Application을 만든다. Controller(Servlet)가 Model(Service, DTO, DAO)을 호출하고 DAO가 DB와 연동한다.
- View는 MPA 방식의 Web Client로 HTML 대신 JSP를 쓴다.

### 2. AJAX로 이메일 중복 확인

- 서버는 객체를 JSON으로 바꿔 응답한다. Jackson의 `ObjectMapper`를 쓴다.

```java
String json = new ObjectMapper()
    .writeValueAsString(target);
response.setContentType(
    "application/json;charset=utf-8");
response.getWriter().write(json);
```

```js
const res = await fetch(
  `${root}/member?` +
  `email=${input.value}`);
const json = await res.json();
input.classList.toggle(
  "is-valid", json.canUse);
```

- JSP 안의 JavaScript 템플릿 문자열은 EL과 겹치므로 실제 코드에서는 `\${input.value}`처럼 이스케이프한다.
- 입력 이벤트마다 요청하고 응답의 `canUse`에 따라 Bootstrap의 `is-valid`와 `is-invalid` 클래스를 바꾼다.

### 3. Paging

| 클래스 | 필드 | 의미 |
|---|---|---|
| `SearchCondition` | `key` `word` | 검색 항목(name, email)과 검색어 |
| | `currentPage` `itemsPerPage` | 현재 페이지와 페이지당 항목 수 |
| `Page<T>` | `totalItems` `totalPages` | 전체 항목 수와 전체 페이지 수 |
| | `list` | 현재 페이지에 보여 줄 데이터 |
| | `navSize` | 한 번에 보여 줄 페이지 번호 개수 |
| | `startPage` `endPage` | 페이지 번호 링크의 시작과 끝 |
| | `hasPre` `hasNext` | 이전, 다음 버튼 표시 여부 |

```java
list.stream()
    .filter(m -> matches(m, cond))
    .skip((long) cond.getItemsPerPage()
        * (cond.getCurrentPage() - 1))
    .limit(cond.getItemsPerPage())
    .toList();
```

- 건너뛸 개수는 `itemsPerPage × (currentPage − 1)`이다. 예: 페이지당 5개, 3페이지면 10개를 건너뛰고 5개를 가져온다.
- 검색어가 없으면(`key`나 `word`가 `null`이거나 비어 있으면) 모든 항목이 조건을 통과한다.

| 호출 방법 | 검색 조건 | currentPage |
|---|---|---|
| 메뉴 링크 | 없음 | 1 |
| 검색 폼 제출 | 새 조건으로 초기화 | 1 |
| 페이지 번호 클릭 | 기존 조건 유지 | 클릭한 번호 |

- 세 경우를 하나의 `form`으로 처리한다. 페이지 링크를 누르면 JavaScript가 `preventDefault()`로 링크 이동을 막고 hidden input `currentPage`에 `data-page` 값을 넣은 뒤 폼을 submit한다.

### 4. 회원 정보 관리

- 상세 화면의 수정과 삭제 버튼은 ADMIN이거나 로그인한 본인일 때만 보여 준다.
- 본인 정보를 수정하면 session의 `loginUser`도 새 객체로 바꿔 헤더의 이름이 갱신되게 한다.
- 본인 계정을 삭제하면 `session.invalidate()`로 로그아웃시키고 메인으로 redirect한다.
- 다른 회원을 삭제하면 안내 메시지를 session에 담고 목록 1페이지로 redirect한다. redirect하면 request attribute가 사라지므로 session을 쓴다.

### 자주 틀리는 포인트

1. JSON 응답의 Content-Type을 `text/html`로 둔다.
2. 페이지 번호를 누를 때 검색 조건이 사라지게 만든다.
3. redirect 뒤에 보여 줄 메시지를 request attribute에 넣는다.
4. 본인 정보를 수정하고 session의 로그인 정보를 갱신하지 않는다.

### 복습 질문

1. 페이지당 10개씩 보여 줄 때 4페이지의 첫 항목은 전체에서 몇 번째인가?
   답: 31번째이다. `10 × (4 − 1)`로 30개를 건너뛴다.
2. 검색 폼을 새로 제출할 때 `currentPage`를 1로 되돌리는 이유는 무엇인가?
   답: 새 조건이면 결과 수가 달라져서 이전 페이지 번호가 범위를 벗어나거나 의미가 없을 수 있기 때문이다. 항상 첫 페이지부터 보여 준다.
3. 회원 삭제 후 안내 메시지를 session에 담는 이유는 무엇인가?
   답: redirect하면 request가 새로 만들어져 request attribute가 사라지기 때문이다. session에 담으면 다음 요청에서 읽을 수 있다.

## Part 8. 시험 직전 정리

### 1. 헷갈리는 쌍 비교

| 비교 | 핵심 차이 |
|---|---|
| forward 와 redirect | 요청 1번, URL 유지, request 공유 / 요청 2번, URL 변경, request 새로 생성 |
| Parameter 와 Attribute | 클라이언트가 보낸 읽기 전용 `String` / 서버가 저장한 `Object` |
| Cookie 와 Session | 브라우저에 문자열 저장 / 서버에 객체 저장 (`JSESSIONID`로 연결) |
| Filter 와 Listener | 요청과 응답을 가로챔 / 애플리케이션 이벤트를 감시 |
| scriptlet 과 declaration | `_jspService` 지역 코드 / 클래스 멤버 |
| Model 1 과 Model 2 | JSP가 모두 처리 / Servlet은 Controller, JSP는 View |
| 401 과 403 | 인증 실패 / 권한 없음 |
| container root 와 context root | 브라우저가 해석하는 `/` / 서버 안에서 해석하는 `/` |
| `invalidate` 와 `removeAttribute` | 세션 전체 삭제 / 속성 하나 삭제 |

### 2. 숫자와 기본값

| 항목 | 값 |
|---|---|
| 응답 기본 인코딩 | ISO-8859-1 |
| WAS 개발용 포트 | 8080 |
| `loadOnStartup` 기본값 | -1 (첫 요청 때 생성) |
| page `buffer` 기본값 | 8kb |
| page `session` 기본값 | true |
| `c:set` scope 기본값 | page |
| Filter dispatcher 기본값 | REQUEST |
| SameSite 기본값 | Lax |
| 쿠키 maxAge 0 | 즉시 삭제 |
| `session-timeout` 단위 | 분 |
| `setMaxInactiveInterval` 단위 | 초 |
| redirect 상태 코드 | 302 |

### 3. 시험 직전 체크

- [ ] Servlet 요청 처리 흐름과 Life Cycle 호출 횟수를 설명할 수 있는가
- [ ] url-mapping의 경로 지정, 확장자 매칭 규칙을 구분하는가
- [ ] container root와 context root가 쓰이는 곳을 구분하는가
- [ ] HTTP 메서드의 멱등성과 안전성을 표로 말할 수 있는가
- [ ] 주요 상태 코드와 Content-Type을 구분하는가
- [ ] Front Controller의 장점과 요청 구분 방법을 설명할 수 있는가
- [ ] Filter의 수명 주기와 `chain.doFilter()` 전후의 의미를 설명할 수 있는가
- [ ] dispatcher 종류와 기본값을 알고 있는가
- [ ] Servlet이 Thread Safe하지 않은 이유와 대책을 설명할 수 있는가
- [ ] JSP가 Servlet으로 변환되는 과정과 구성 요소의 변환 위치를 설명할 수 있는가
- [ ] 네 가지 Web scope의 범위와 Servlet에서 얻는 방법을 말할 수 있는가
- [ ] forward와 redirect의 차이와 사용 시점을 설명할 수 있는가
- [ ] PRG 패턴이 필요한 이유를 설명할 수 있는가
- [ ] EL의 scope 탐색 순서, 연산 결과, `empty` 규칙을 알고 있는가
- [ ] JSTL `c:if` `c:choose` `c:forEach`를 쓸 수 있는가
- [ ] Cookie의 maxAge, path, 보안 속성을 설명할 수 있는가
- [ ] Session의 생성, 만료, 무효화 방법을 설명할 수 있는가
- [ ] 로그인 Filter와 로그아웃 처리 흐름을 설명할 수 있는가
- [ ] 페이징의 skip 계산과 검색 조건 유지 방법을 설명할 수 있는가
