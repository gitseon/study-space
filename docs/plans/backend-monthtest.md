# 백엔드·DB 월말평가 학습 기능 구현 계획안

> 실행 지침: 후속 구현에서는 `superpowers:executing-plans`를 적용해 아래 체크리스트를 순서대로 진행한다. 이 문서는 설계 제안과 코드 점검 결과이며 기능 구현 완료 보고가 아니다. 커밋·push·PR·배포는 사용자 요청이 있을 때만 한다.

**목표:** 제공된 MVC 템플릿의 구현 대상 부분을 스스로 완성하고, CRD와 JSP를 연결해 정상 동작하는 Web 프로젝트를 작성한다.

**구조:** 기존 정적 사이트에 월말 프로젝트 전용 화면을 추가한다. 세 단계 모두 여러 파일을 편집할 수 있게 하고, 브라우저에 답안과 진행 기록을 저장한다. 실제 Servlet·JSP·MySQL 실행은 내려받은 프로젝트를 로컬에서 확인하며 사이트는 실행 여부를 자동 판정하지 않는다.

**기술:** 기존 JavaScript 모듈, textarea 편집기와 코드 강조, Python 원고 빌드, Node 단위 검사, Playwright를 재사용한다. 실행 환경은 사용자가 지정한 OpenJDK25U-jdk hotspot 25.0.3_9, Apache tomcat-11.0.27, Dynamic web module version 6.0, mysql 8.4.11을 기준으로 한다.

**설계 명세:** 사용자 요청(2026-11-06), 이 문서 1~8절. [기존 백엔드·DB 계획](backend-db.md)의 13절 월말 계획을 구체화하며, 시간·JSP 작성 범위·편집 환경·채점 방식은 이 문서를 우선한다.

작성일: 2026-11-06. 상태: 작업 1 원고 작성과 정적 검증 완료, 실행 검증은 사용자 STS 확인 대기(11절). 모든 단계의 사이트 코드 편집기는 사용자 확정 사항이다. 나머지 세부 UX·파일 계약은 아래에 명시한 제안이다.

## 1. 요구사항과 기존 기능의 경계

| 항목 | 구현할 동작 |
| --- | --- |
| 진입 | 홈에서 `백엔드 · DB`를 선택하면 흐름 요약과 월말평가 연습 카드 표시 |
| 학습 목표 | 주석으로 지시된 구현 부분을 직접 채우고 등록·목록·상세·삭제를 연결 |
| 단계 | 1단계 빈칸 채우기 → 2단계 메서드와 JSP 블록 작성 → 3단계 구현 대상 전체 작성 |
| 작성 환경 | **모든 단계에서 사이트 코드 편집기 제공**. Java·JSP·XML·SQL 파일을 함께 열람 |
| 제한 시간 | 모든 단계에서 `90분`, `120분`, `시간 제한 없음` 선택. 기본값은 120분 제안 |
| 채점 | 자기점검 체크리스트. 점수·합격·정답률 자동 계산 없음 |
| 보조 검사 | 작성 누락과 구조 점검만 선택적으로 제공. Java/JSP 컴파일 또는 실행 성공으로 표시하지 않음 |
| 기록 | 작성 코드, 선택 파일, 체크리스트, 힌트 열람, 시간 기록을 브라우저에 저장 |

기존 backend 과평 3회, 21/9/2 구성, 실전 60분, 9개 주제와 개념 노트 연결은 유지한다. 월말 Web 프로젝트는 `manifest.webProjects`로 분리한다. 알고리즘 월평의 구현 3/서술 1 규칙을 적용하거나 기존 검증을 완화하지 않는다. UPDATE, Spring, ORM, command 패턴, 배포 환경 구축은 필수 범위에 추가하지 않는다.

### 월말평가 선택 시 안내 문구와 위치

백엔드·DB의 `월말평가`를 선택하면 **`오늘의 문제집` 문구 바로 아래, 월말평가 카드 위**에 다음 두 안내를 순서대로 표시한다. 각 안내는 하나의 독립된 줄로 작성한다.

```text
실행 환경: OpenJDK25U-jdk hotspot 25.0.3_9, Apache tomcat-11.0.27, Dynamic web module version 6.0, mysql 8.4.11
자동완성 기능을 제공하지 않으니 Spring Tools for Eclipse 사용을 권장합니다.
```

이 안내는 백엔드·DB 월말평가를 선택한 경우에만 표시한다. 데스크톱에서는 각 문구가 한 줄씩 총 두 줄이 되도록 공간을 확보한다. 모바일·태블릿의 좁은 화면에서는 두 안내의 구분을 유지하면서 자연스럽게 줄바꿈하며, 한 줄 고정으로 인한 가로 넘침이나 잘림을 만들지 않는다. 문구 중간에 임의의 강제 줄바꿈을 넣지 않는다.

### 접근 방식 비교와 제안

| 방식 | 장점 | 비용·제약 | 판단 |
| --- | --- | --- | --- |
| 사이트 다중 파일 편집 + 로컬 실행 | 모든 단계에서 바로 작성, 실제 시험 환경에서도 실행 가능 | ZIP 이동 후 로컬 확인 필요 | 권장안 |
| 사이트 편집 + 서버 실행·DB 자동 채점 | 사이트 안에서 실행 결과 확인 | 실행 격리, DB 초기화, 서버 운영 필요 | 후속 확장 |
| 사이트 단일 코드 입력 | 구현이 작음 | Controller·DAO·JSP 연결 연습이 어려움 | 목표에 부적합 |

실행 버튼 대신 `작성 점검`, `프로젝트 내려받기`, `실행 확인 체크리스트`를 제공한다. 사이트 내부 실행이 필요해지면 별도 범위로 설계한다.

## 2. 기본 템플릿과 작성 코드의 차이

로컬 기본 템플릿에는 빈 Controller 메서드, 일부 미완성 DAO, 반환값만 있는 Service, 연결을 채워야 하는 JSP가 있다. 정확한 문구 하나만 검색해 빈칸을 만드는 방식으로는 학습 범위를 포착할 수 없다.

| 원본에서 확인한 형태 | 학습 대상 |
| --- | --- |
| Controller의 `정상 동작하도록 코드를 작성하세요.` | URL 매핑, GET/POST 처리, action 분기, 요청·응답 흐름 |
| Service의 메서드 완성 안내 | DAO 호출, 반환값, SQLException 전달 |
| DAO의 TODO | 로그인 SQL, ResultSet 순회, INSERT 바인딩·실행 |
| JSP의 `#`, 더미 행, 빠진 조건·반복 | form action/method, hidden action, include, EL, JSTL, 링크 |
| 작성 코드에서 추가한 상세·삭제 | Controller/Service/DAO 인터페이스 확장, 상세 JSP, DELETE |
| 작성 중인 인증 필터 | 허용·보호 경로, 세션 사용자, chain 호출, 로그인 이동 |

기본 템플릿에는 상세·삭제 메서드와 상세 JSP가 없다. 따라서 기존 템플릿의 빈칸만 복제하면 CRD 목표에서 D와 단건 R이 빠진다. 새 연습 템플릿에 상세·삭제 계약을 명시적으로 추가한다.

공개용 프로젝트는 새 도메인과 데이터로 직접 작성한다. 원본 PDF·템플릿 묶음·사용자 작성 전체 프로젝트를 그대로 배포하지 않는다. 학습 대상 표를 만든 뒤 `targetId → 파일 → 영역 → 요구사항 → 체크리스트`를 연결한다. 줄 번호는 편집 후 바뀌므로 런타임 식별자로 쓰지 않는다.

출처는 `BE-MONTH-START-01`(시작 템플릿), `BE-MONTH-WORK-01`(작성 코드)을 **신규 등록할 자료 ID 제안**으로 사용한다. 실제 등록 전에는 검증된 출처처럼 표시하지 않는다. 원본 경로·해시는 비공개 대응표에 두고 [공개 방안](source-publication.md)을 따른다.

## 3. 작성 코드 점검 결과

검토 범위는 로컬 작성 Java 11개, JSP 8개, web.xml, pom.xml, SQL과 기본 템플릿의 차이다. 다음 줄 번호는 검토 시점 기준이다. 원본은 수정하지 않았다.

### 실행을 막거나 결과 확인을 어렵게 하는 부분

| 우선순위 | 위치 | 조건과 확인된 코드 경로 | 후속 보완·재현 방법 |
| --- | --- | --- | --- |
| 높음, 알려진 미완성 | `SessionFilter.java:19–32` | 필터가 `/gear`에 활성화되어 로그인 요청도 가로챈다. 비로그인 요청은 매핑이 없는 `/user?action=login`으로 이동한다 | MemberController를 `/user`에 만들고 로그인 form·헤더를 함께 변경하거나, 단일 Controller를 유지하며 로그인 action만 예외 처리. 현재 코드는 무한 재귀보다 미등록 경로 404가 먼저 문제 |
| 높음 | `GearController.java:136`, `regist.jsp` | 빈 가격·정수 범위 밖 값·직접 요청한 비숫자 값을 `Integer.parseInt`로 바로 변환. 검증/예외 분기 없이 500으로 전파 | 필수 입력·길이·정수·음수 정책을 먼저 검사하고 오류 안내. HTML number 입력만으로 서버 검증을 대신하지 않음 |
| 중간 | `GearDaoImpl.java:99–111`, `GearServiceImpl.java` | 중복 code는 PK 오류, 길이 초과 등도 DB 오류가 될 수 있다. Service는 원인을 보존하지 않는 RuntimeException으로 변환 | 중복 키와 입력 오류를 사용자가 수정할 수 있게 안내. 시스템 오류는 원인을 보존해 전달하고 실제 장애와 구분 |
| 중간 | `GearController.java:121–125` | 없는 code 조회는 null을 request에 넣은 뒤 상세 JSP로 forward | 없는 상세는 404 또는 명시적 안내. 빈 상세 화면을 성공으로 보이지 않게 함 |
| 중간 | `GearDaoImpl.java:157–170` | DELETE 영향 행 수를 버려 없는 code도 정상 삭제와 같은 흐름 | 새 연습 계약은 삭제 행 수를 반환. 1건 삭제와 이미 없는 항목을 구분 |
| 중간 | `ControllerHelper.java:15–20`, `GearController.java:40–47` | action이 없으면 `index`인데 switch에 index가 없어 `/gear`는 404 | 요구사항에서 기본 요청을 목록으로 보낼지 명시. 현재 홈 `/`와 `index.jsp`까지 실패하는 것은 아님 |

### 환경 의존 위험과 학습 코드에서 고칠 설명

| 위치 | 판단 | 후속 확인 |
| --- | --- | --- |
| `LoggingFilter.java:24`, web.xml | 요청 인코딩이 명시되지 않았고 필터가 먼저 파라미터를 읽는다. 컨테이너 기본값에 따라 한글 POST가 깨질 수 있음 | web.xml의 요청 UTF-8 설정 또는 파라미터 읽기보다 먼저 실행되는 인코딩 처리. Controller에서 나중에 설정하는 것만으로 해결했다고 하지 않음 |
| `GearController.java:78–89` | 저장 쿠키에는 Path를 주지만 삭제에는 다시 지정하지 않는다. 현재 `/gear` URL의 기본 경로가 같으면 삭제될 수 있으므로 항상 실패하는 버그로 단정하지 않음 | 저장/삭제 모두 동일 Path 사용, 루트 context는 `/`. Controller 분리 후에도 아이디 기억 켜기→끄기 확인 |
| `header.jsp:25–28` 및 EL 출력 | 요청 메시지를 JavaScript 문자열에 직접 넣고 사용자 입력을 HTML에 그대로 출력한다. 특수문자로 표시가 깨지거나 스크립트가 실행될 수 있음 | 메시지는 안전한 텍스트 영역에 출력하고 데이터 출력은 c:out 등 사용. URL은 c:url/c:param, 속성·스크립트는 해당 문맥에 맞게 처리 |
| `detail.jsp:24`, `GearController.java:106` | 링크 GET으로 삭제할 수 있음. 인증 미완성 문제와 별개로 조회 요청과 데이터 변경이 섞임 | 새 연습은 POST 삭제 후 redirect. GET 삭제는 405 및 DB 불변. CSRF 방어는 확장 항목으로 구분 |
| `LoggingFilter.java:24–25` | 비밀번호 파라미터도 콘솔에 출력 | 새 연습용 로깅에서는 pass/password를 제외 또는 마스킹 |
| `GearDaoImpl.java:47–51` | Member의 mno가 매핑되지 않아 0으로 남음. 현재 이름 표시에는 지장 없지만 사용자 식별에 쓰면 오동작 | 필요한 필드를 매핑하고 비밀번호를 세션에 계속 보관할 필요를 제거 |
| `GearController.java:86` | `for-each는 불변`이라는 주석은 잘못됨. 순회 변수로 참조 객체의 setMaxAge 호출 가능 | 배열 원소 교체와 객체 속성 변경을 구분해 설명 |
| `SessionFilter.java:34` | HTTP redirect 반복은 그 자체로 Java stack overflow와 같지 않음 | 잘못된 URL로 인한 404와 브라우저 redirect 반복 오류를 구분 |
| `GearDaoImpl.java:74,137` | Gear 코드에 Mobile을 언급하는 복사된 TODO가 남음 | 공개 학습 설명을 실제 DTO와 메서드 목적에 맞춰 새로 작성 |
| pom.xml 및 IDE 설정 | 기존 템플릿은 Java 21, Servlet 6.0, JSP API 4.0을 선언하고 작성 프로젝트의 IDE runtime은 Tomcat 11.0 | 사용자 지정 실행 환경은 JDK 25.0.3_9·Tomcat 11.0.27이며 Dynamic web module은 6.0을 유지한다. Tomcat이 지원하는 Servlet 사양과 프로젝트 facet을 구분하고 이 조합에서 빌드·JSP 실행을 검증 |

필터와 Controller 분리는 사용자가 이미 알고 있는 미완성으로 구분한다. 분리 자체가 인증의 필수 조건은 아니지만 이 계획의 새 연습 프로젝트는 `/user`와 `/gear`를 분리해 보호 범위를 이해하기 쉽게 한다. 로그인 성공 시 세션 ID 갱신, 로그아웃에서 `getSession(false)`와 null 확인도 보완 학습 항목으로 둔다.

**확인된 긍정적인 부분:** SQL은 PreparedStatement로 바인딩하고, 조회는 `rs.next()`, INSERT/DELETE는 `executeUpdate()`를 사용한다. finally에서 JDBC 자원을 닫고, 목록·상세는 request+forward, 등록 후에는 redirect를 사용한다. 이 구조는 학습 기준으로 살릴 수 있다.

**검증 한계:** JDK 25의 javac에 `--release 21`, Servlet API 6.0.0을 주어 Java 11개 컴파일 성공. JSP 번역·렌더링, WAR 패키징, DB 접속과 SQL 실행은 확인하지 않았다. PATH에서 Maven/MySQL CLI를 찾지 못했으며 이것이 머신 전체에 해당 도구나 DB가 없다는 뜻은 아니다. 기존 target/build의 class 파일을 실행 성공 증거로 사용하지 않았다.

참고 근거: 인코딩은 [ServletRequest API](https://jakarta.ee/specifications/platform/10/apidocs/jakarta/servlet/ServletRequest.html), 쿠키 삭제 경로는 [RFC 6265](https://www.rfc-editor.org/rfc/rfc6265.html), runtime 대응은 [Tomcat 버전별 사양](https://tomcat.apache.org/whichversion.html)을 확인했다. 실제 코드 동작 판단은 위 파일 검토에 근거한다.

## 4. 학습 흐름과 단계별 요구사항

### 흐름 요약

백엔드·DB 선택 직후 `월말평가 구현 흐름`을 제공한다. 전체 흐름과 기능별 흐름을 짧게 전환하며 파일 역할, 입력 이름, 전달 속성, 이동 방식이 함께 보이게 한다.

1. JSP form/link가 URL과 action, 입력 값을 보낸다.
2. Filter가 로그인 필요 여부를 판단하고 허용 요청만 넘긴다.
3. Controller가 입력을 읽고 검증한 뒤 Service를 호출한다.
4. Service가 작업을 연결하고 DAO가 Connection·PreparedStatement·ResultSet으로 DB를 처리한다.
5. 조회 결과는 request attribute로 JSP에 forward한다.
6. 등록·삭제 성공은 redirect 후 새 GET 요청으로 목록을 읽는다.
7. JSP는 EL과 JSTL로 결과와 로그인 상태를 표시한다.

기능 탭은 `목록`, `등록`, `상세`, `삭제`, `로그인·로그아웃`, `필터·오류 처리`로 구성한다. 각 탭에 “어떤 파일에 무엇을 작성하는가”, 핵심 문법, 빈번한 실수, 관련 개념 노트 링크를 둔다. 흐름만 암기하지 않도록 form name ↔ getParameter, setAttribute ↔ EL, SQL 열 ↔ DTO 필드를 대응한다.

### 3단계 구성

| 단계 | 제공되는 것 | 직접 작성할 것 | 완료 판단 |
| --- | --- | --- | --- |
| 1. 빈칸 채우기 | 전체 파일과 흐름, 핵심 위치의 식별 가능한 빈칸, 선택형 힌트 | SQL 조건·바인딩, rs.next, DAO 호출, request/session, 이동 경로, JSP 속성·태그·EL | 빈칸을 채운 뒤 왜 그 코드인지 확인하고 기능 체크리스트 수행 |
| 2. 메서드·블록 작성 | 클래스·인터페이스·메서드 시그니처와 요구사항, JSP의 정적 배치 | Controller/Service/DAO 메서드 본문 전체, form·반복행·조건분기·링크 등 JSP 블록 | 기능 하나를 UI부터 DB까지 연결해 실행 확인 |
| 3. 구현 대상 전체 작성 | 실제 시험처럼 pom, SQL, DTO, DBUtil, Helper, 로깅, 패키지와 정적 화면 틀 | Controller 분기와 처리, Service/DAO 구현, SessionFilter, JSP 동적 영역, 오류 매핑 대상 | 새 프로젝트 응시에서 제공물만으로 CRD·인증·JSP 연결을 완성하고 실행 확인 |

3단계의 “전부 없는 상태”는 **시험에서 직접 채울 구현 코드가 없는 상태**를 권장한다. 설정·DTO·DBUtil까지 백지로 만드는 것은 별도 확장 연습이다. web.xml은 파일을 제공하되 학습 대상인 error-page 매핑 등을 작성하게 한다. SQL은 읽기 전용으로 제공하고 SELECT/INSERT/DELETE 작성은 DAO 안에서 연습한다.

세 단계에서 같은 기능 ID와 체크리스트 ID를 사용한다. 단계마다 별도 응시를 생성하며 이전 답안을 자동 복사하지 않는다. 1단계는 짧은 토큰만이 아니라 한두 문장의 의미 있는 코드도 비워 구문 암기에 치우치지 않게 한다. JSP는 Java 메서드가 없으므로 2단계에서도 **동적 블록 작성**을 명확하게 요구한다.

### 더 효과적인 학습 순서 제안

각 단계 안에서 목록 → 등록 → 상세 → 삭제 순으로 작은 완성 경험을 만든다. 인증과 필터를 붙인 뒤 오류 처리를 확인한다. 첫 프로젝트에서 세 단계가 연결되게 하고, 익숙해진 뒤 새 도메인 프로젝트를 추가해 변수명·정답 위치 암기만으로 통과하지 못하도록 한다. 첫 출시 범위는 도메인 2개(web-01 캠핑 용품, web-02 도서) × 3단계다. 도메인은 11절에서 확정했다.

단계 승급을 정답률로 강제하지 않는다. “힌트 없이 작성”, “실행 확인”, “다시 연습 필요”를 보여주고 자유롭게 단계를 선택한다. 힌트와 모범답안 열람은 기록하지만 체크리스트를 자동으로 완료시키지 않는다.

JSP 필수 문법은 page/taglib/include 지시자, EL의 requestScope/sessionScope/cookie, empty/not empty, c:if/c:choose/c:forEach/c:out, c:url/c:param, form action/method/name, hidden action이다. 스크립틀릿 암기나 디자인 CSS를 필수 과제로 늘리지 않는다.

## 5. 사이트 편집기와 시간 동작

### 편집 화면

- 왼쪽: 폴더를 펼치고 접을 수 있는 파일 디렉터리 트리와 `제공 파일/작성 파일`, 작성 대상 수 표시. 선택 파일과 전체 경로를 표시하고 트리에서 파일을 누르면 옆 편집기 탭으로 연다.
- 가운데: 파일 탭, 경로·언어, 줄 번호와 코드 편집기. 전체 파일을 편집하되 제공 파일은 읽기 전용.
- 오른쪽: 현재 기능 요구사항, 흐름 요약, 작성 대상 이동, 자기점검.
- 360px 화면: 파일·코드·요구사항 탭으로 전환. 긴 코드는 편집기 안에서 가로 스크롤.
- 1단계는 빈칸 위치로 이동하고 주변 문맥을 함께 표시한다. 글자 수·선택지로 정답을 추측하게 하지 않는다.
- 2·3단계도 같은 다중 파일 편집기를 사용한다. 완성 코드 비교는 사용자가 명시적으로 열었을 때 제공한다.

기존 `assets/code-editor.js`의 들여쓰기·한글 IME 처리를 재사용한다. Java의 중괄호 자동 입력을 JSP/SQL/XML에 무조건 적용하지 않도록 언어 옵션을 추가한다. 코드 강조는 `assets/highlight.js`가 이미 Java/JSP/XML/SQL을 지원하므로 읽기·비교 화면에 재사용한다. 직접 입력은 textarea를 기준으로 하며, 입력 코드를 HTML로 실행하거나 JSP 결과처럼 iframe에 삽입하지 않는다. 초기 버전에서 IDE 수준 자동완성·컴파일 진단은 제공하지 않는다.

파일 생성은 미리 정의한 작성 대상 경로로 제한한다. 새 파일이 필요한 과제는 manifest에 빈 파일 항목을 미리 넣는다. `현재 파일 초기화`는 해당 파일만 되돌리고 실행 전 확인한다. 단계 전환·새 응시는 기존 코드가 삭제되지 않게 별도 기록으로 생성한다.

### 모바일·태블릿 열람과 작성

2026-11-06 사용자 보완 요청: 데스크톱은 IDE처럼 디렉터리 트리와 코드 편집기를 나란히 제공한다. 모바일은 코드를 편하게 읽는 경험을 우선하며 세 단계의 작성 기능도 유지한다.

| 사용 가능한 화면 폭 | 기본 배치와 조작 |
| --- | --- |
| 1200px 이상 | 파일 트리 + 코드 + 요구사항 3열. 양쪽 패널 접기 지원 |
| 768~1199px | 파일 트리 + 코드 2열. 요구사항은 버튼으로 여는 별도 패널. 트리를 접어 코드 영역 확장 가능 |
| 768px 미만 | 코드 열람 중심의 1열. `파일` 버튼으로 트리를 열어 선택하면 닫고 코드 표시. 요구사항·흐름·체크리스트는 탭으로 전환 |

폭은 기기 이름이 아닌 현재 브라우저의 사용 가능한 CSS 픽셀 기준으로 판단한다. 태블릿 분할 화면·세로/가로 회전 때 같은 규칙을 적용한다. 패널 배치만 바꾸며 열린 파일·스크롤·작성 내용은 보존한다.

모바일의 최초 진입은 `코드 보기`로 한다. 읽기 전용 코드를 눌러도 가상 키보드가 열리지 않으며 파일 이동, 검색, 복사, 글자 크기, 긴 줄 자동 줄바꿈 켜기/끄기를 제공한다. 기본 줄바꿈은 켜되 실제 파일의 개행을 바꾸지 않는다. `코드 작성`을 선택하면 같은 파일을 textarea에서 편집하고 화면 키보드 사용자는 들여쓰기·내어쓰기를 화면 버튼으로 실행할 수 있다. 물리 키보드에서도 같은 작성 기능을 사용한다.

시작 전 `템플릿 둘러보기`는 응시와 타이머를 만들지 않는다. 시작 후 코드 보기로 전환해도 진행 중 타이머는 계속되며 이를 표시한다. 읽기/작성 모드 전환은 저장 flush 후 같은 답안에 적용하고 초기 코드로 되돌리지 않는다. 진행 중 화면 회전·키보드 열림도 같은 원칙을 따른다.

실제 브라우저에서는 화면 키보드가 보이는 영역을 줄이거나 가릴 수 있고 한글 조합·자동 대문자·자동 교정이 코드 입력과 충돌할 수 있다. 가상 키보드가 나타나면 편집 위치가 보이도록 화면 높이와 스크롤을 조정한다. 입력에는 자동 대문자·자동 교정·맞춤법 검사를 끄는 속성을 적용하고 조합 중에는 단축키·괄호 자동 입력을 개입시키지 않는다. 속성만으로 모든 키보드 동작이 같아진다고 보장하지 않는다. 참고: [VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport), [HTML 입력 보조 속성](https://html.spec.whatwg.org/multipage/interaction.html).

PC·태블릿 물리 키보드는 본격 작성, 휴대폰은 코드 열람·짧은 수정에 맞춘다. 구현 전이므로 현재 모든 기기에서 표시·입력 문제가 없다고 확정하지 않는다. Playwright의 화면 크기 검사는 실제 화면 키보드와 IME 검증을 대체하지 않는다.

### 시간과 저장

| 상황 | 동작 |
| --- | --- |
| 시작 전 | 단계·90/120/무제한 선택, 환경과 제공 파일 확인. 타이머 미시작 |
| 시작 | 시작 버튼을 누르면 코드 편집 활성화와 함께 startedAt/deadlineAt 저장 |
| 무제한 | minutes=0, deadlineAt=null. 경과 시간만 표시 |
| 새로고침·백그라운드 | 남은 초를 감소시켜 저장하지 않고 deadlineAt 기준으로 재계산 |
| 만료 | 0초에서 `시간 종료`. 코드 보존, 사이트 편집 잠금, 다운로드·체크리스트 이용 가능 |
| 계속 연습 | 종료 시점의 코드 snapshot을 보존하고 새 무제한 응시로 복제. 시간 내 완성과 구분 |
| 조기 종료 | `작성 마치기`로 코드를 잠그고 점검 화면으로 이동. 자동 정답 처리는 없음 |
| 힌트·모범답안 | 사용자 조작으로 열람, 기록에 도움 사용 표시. 제한 시간 선택과 열람 여부는 별개 |

타이머는 실제 시험 감독 기능이 아니다. 만료 후 로컬에서 수정하는 행위를 감지했다고 표시하지 않는다. URL의 임의 시간은 허용 목록 90/120/0 검증을 거치며 잘못된 값은 시작 전에 120분으로 안내한다. 진행 중 응시의 시간은 주소 변경으로 바뀌지 않는다.

코드는 입력 후 500ms 이내 저장을 예약하고 파일 전환·종료·다운로드 전에 즉시 반영한다. 모든 편집 이벤트에서도 deadline을 검사해 이미 만료한 입력은 반영하지 않는다. 저장 실패 시 메모리의 코드는 유지하고 `저장되지 않음`과 백업 버튼을 표시한다. 정상 저장 전까지 `저장됨`으로 표시하지 않는다. 여러 탭의 충돌은 저장 시각이 아니라 단조 증가 `saveVersion`으로 판정한다. IndexedDB의 같은 readwrite 트랜잭션에서 기존 버전 확인과 새 버전 쓰기를 수행하고, 불일치하면 덮어쓰지 않고 복제/최신본 열기를 제공한다.

## 6. 자기점검과 가벼운 보조 검사

체크리스트 상태는 `미확인`, `확인함`, `수정 필요` 세 가지다. `확인함 7/12`처럼 점검 진행도만 표시한다. 점수·등급·합격 판정과 연결하지 않는다. 각 항목에 실행 순서, 기대 결과, 관련 파일, 메모 칸을 둔다.

| ID | 학습자가 직접 확인할 항목 | 기대 결과 |
| --- | --- | --- |
| run-build | 로컬 프로젝트 빌드 및 기동 | Java 컴파일, 서버 기동, JSP 최초 요청 성공 |
| crd-list | 준비 데이터로 목록 조회, 빈 데이터에서도 조회 | 각 행의 값·개수 일치, 빈 결과 안내 |
| crd-create | 고유 code로 한글 이름과 가격 등록 | DB 1행 추가, 목록·상세 표시 일치 |
| crd-prg | 등록 완료 후 새로고침 | 같은 항목이 다시 등록되지 않음 |
| crd-detail | 정상 code와 없는 code 조회 | 정상 항목만 표시, 없는 항목은 명시적 안내/404 |
| crd-delete | 항목 삭제 후 목록·상세 재조회 | DB에서 제거, 없는 항목 삭제도 일관된 안내 |
| crd-invalid | 빈 가격, 비숫자·범위 초과 값, 중복 code | 입력 오류 안내, 잘못된 행은 DB에 추가되지 않음 |
| auth-login | 올바른/틀린 로그인 | 성공 시 세션 사용자, 실패 시 로그인 화면과 안내 |
| auth-cookie | 아이디 기억 켜기→끄기→다시 열기 | 기억 상태와 입력값·쿠키가 일치 |
| auth-logout | 로그아웃 후 보호 URL 직접 요청 | 세션 종료, 보호 기능 진입 차단 |
| auth-filter | 미로그인·로그인 상태, JSP 직접 접근 | 로그인은 가능하고 보호 기능은 정책대로 제한 |
| jsp-render | 조건·반복·특수문자·form 입력 연결 | 표시와 요청 값 일치, 코드가 화면 데이터로 실행되지 않음 |
| error-pages | 미등록 URL 및 통제된 서버 오류 | 404/500 안내, 민감한 내부 정보 미표시 |
| project-export | ZIP을 새 폴더에 풀어 구성 확인 | pom/src/SQL 포함, 불필요한 class/target/정답 미포함 |

실제 초기 데이터 수에 따라 crd-list의 기대 행 수를 프로젝트 요구사항에 고정한다. 비숫자는 직접 HTTP 요청 등 재현 방법을 함께 적는다. 인증 정책은 새 연습에서 `/user` 로그인과 공용 페이지 허용, `/gear` 기능 보호로 명시한다. JSP는 가능하면 WEB-INF 아래에 두고 Controller를 통해 접근하게 한다.

### 보조 검사 제안

1. **초기 제공 권장:** 응시 파일 존재, 빈 구현 영역, 남은 전용 빈칸 표식, 시작 코드와 달라진 영역, form action/method의 미완성 표식 검사. 결과는 `누락 가능성`이다. 일반 TODO 주석이 남았다는 이유만으로 미완성 판정하지 않는다.
2. **복습 지원:** 모범답안과 파일별 비교. 문자열이 다르다고 오답 판정하지 않고 다른 올바른 구현을 허용한다.
3. **선택 확장:** 사용자가 실행 중인 로컬 서버에 대해 표준 라이브러리 기반 HTTP 점검 스크립트 제공. 로그인 쿠키 유지 → 테스트 전용 code 등록 → 조회 → 삭제 → 재조회 결과를 JSON으로 출력한다. 전용 테스트 DB에서만 실행하고 생성한 테스트 행만 정리한다. 스크립트 보고서는 체크리스트 참고 자료이며 점수를 만들거나 `확인함`을 자동으로 설정하지 않는다.

브라우저에서 로컬 서버를 직접 호출하는 방식은 CORS·쿠키·혼합 콘텐츠 제약이 있어 초기 범위에 넣지 않는다. 단순 키워드 존재 검사나 괄호 수 세기를 Java/JSP 문법 검사로 표현하지 않는다.

## 7. 데이터와 파일 설계

### 원고·빌드 계약

새 경로 `source/backend/projects/web-01/` 아래에 `project.json`, `requirements.md`, `flow.md`, `checklist.json`, `starter/`, `reference/`, `stages.json`을 둔다. reference는 새로 작성한 검증용 완성 코드다. 원본 폴더를 재귀 복사해 생성하지 않는다.

- `project.json`: `id`, `revision`, `track: "backend"`, `title`, `durationOptions: [90,120,0]`, `defaultMinutes: 120`, `sourceRefs`, `files`, `targets`.
- `files[]`: `{path, language, editable, requiredInExport}`. path는 프로젝트 루트 기준 상대 경로. Java/JSP/XML/SQL/텍스트만 허용한다.
- `targets[]`: `{id, path, topicIds, requirementId, checklistIds}`. topicIds는 기존 backend scope에 있는 ID를 참조한다.
- 단계별 시작 파일에는 target마다 `study-target:<id>:start`와 `study-target:<id>:end` 표식을 해당 언어의 주석(Java/SQL/XML/JSP 주석)으로 넣는다. 파일 안에서 각 표식 쌍은 고유하고 중첩되지 않는다. 편집기 대상 이동과 영역별 변경 확인은 현재 텍스트의 표식 쌍을 기준으로 한다. 사용자가 지우거나 중복시켰으면 해당 파일을 열고 `위치를 찾을 수 없어 직접 확인이 필요합니다`로 안내한다. 이를 오답·미완성 판정으로 바꾸지 않는다. 단계별 target 포함 검증은 편집 전 원고에만 강제한다.
- `stages.json`: stages 1/2/3 각각 `{id, label, files, hints}`. files는 원본 코드 또는 생성 지시가 아닌 **검증된 단계별 시작 텍스트**를 가리킨다. 구현 방식은 `stages/{1,2,3}/`의 해당 대상 파일을 starter 위에 덮어 합성한다. 이 디렉터리도 신규 생성 대상이다.
- `checklist.json`: `{id, title, steps, expected, targetIds}` 배열. 배점 필드 없음.
- 생성 결과: `data/backend-projects.json`, `data/backend-projects/web-01/stage-{1,2,3}.json`, 단계별 starter ZIP, 별도 reference JSON. manifest에는 파일 경로·revision·해시를 포함한다.
- 빌드 함수 `build_projects(source_root: Path, output_root: Path) -> dict`는 `manifest.webProjects = {file, count, track}`의 값을 반환한다.

원고 검증은 중복 ID, 끊긴 target/checklist 연결, 허용 시간, 누락 파일, 경로 이탈, 개인 자료 포함을 검사한다. 완성 reference에 연습용 빈칸 표식이 남으면 실패한다. 초기 빈 템플릿은 의도적으로 기능이 미완성일 수 있으므로 reference의 실행 기준과 구분한다.

### 응시·저장 계약

`ProjectAttempt`는 다음을 가진다.

- 식별: `attemptId`, `projectId`, `revision`, `stageId`, `schemaVersion: 1`.
- 시간: `minutes`, `startedAt`, `deadlineAt`, `endedAt`, `status: in-progress|time-ended|review`.
- 원고 보존: `projectSnapshot`(선택 단계의 시작 파일·요구사항·체크리스트·해시), 현재 `files: Record<path,string>`.
- UI·점검: `activePath`, `checks: Record<criterionId, unchecked|confirmed|needs-work>`, `notes`, `viewedHints`, `viewedReference`.
- 저장·재연습: `updatedAt`, `saveVersion`, `continuedFrom`, 종료 시 `endedFiles`.

`projectSnapshot`에는 다른 단계의 정답이나 reference를 포함하지 않는다. revision 변경 후에도 기존 응시는 snapshot으로 복원하고 새 버전 시작은 새 attemptId를 사용한다. 종료 전 마지막 작성본은 endedFiles로 고정한다. 시간 종료 후 체크리스트만 수정해도 시간 내 답안은 바뀌지 않는다.

브라우저 저장은 기존 `algorithm-notes:v1`과 분리한 `study-space:project-attempts:v1` IndexedDB에 둔다. 다중 파일 코드 때문에 localStorage에 매 입력마다 전체 응시를 쓰지 않는다. `assets/project-store.js`가 저장과 import 검증을 담당한다. 기존 백업 UI는 프로젝트 저장소도 읽어 `projectAttempts` 선택 필드에 합쳐 내보낸다. 구버전 백업에서 필드가 없으면 빈 배열로 취급하고 기존 프로젝트 기록을 삭제하지 않는다.

백업 가져오기는 모든 레코드를 먼저 검사한다. 같은 attemptId의 서로 다른 코드가 들어오면 덮어쓰기 선택 전에 차이를 알린다. 잘못된 백업은 두 저장소 모두 변경하지 않는다. localStorage와 IndexedDB를 함께 수정할 때는 이전 값을 보관해 실패 시 복구하고 성공 후에만 UI를 갱신한다. 초기 제한 제안은 파일당 UTF-8 256KiB, **snapshot·endedFiles까지 포함한 직렬화 응시 전체 2MiB**, 프로젝트 응시 최대 20개다. 한도를 넘긴 입력은 메모리에 유지하면서 저장 실패와 파일 내려받기를 안내하고 조용히 자르지 않는다.

통합 백업은 기존 가져오기 제한인 UTF-8 20MiB를 유지한다. 모든 응시를 합친 내보내기 결과가 한도를 넘으면 응시 단위로 여러 유효한 백업 JSON을 만들어 개별 다운로드 버튼을 제공한다. 각 파일은 기존 app/version/attempts/marks와 선택 필드 projectAttempts를 가지며 각각 20MiB 이하이고, 하나의 응시는 여러 파일에 쪼개지 않는다. 원본 개수와 분할 파일별 개수를 안내하며 누락 없이 순차 가져오기가 가능해야 한다. 대용량 기존 기록까지 포함한 실제 JSON 바이트 길이로 분할하고 분할 백업 왕복 검사를 추가한다.

정적 사이트의 정답 파일은 UI에서 숨겨도 접근 통제되는 비밀이 아니다. 학습용 열람 제어로만 다룬다.

### ZIP 내보내기

브라우저에서 현재 파일과 제공 파일을 합쳐 ZIP으로 내려받는다. 순수 JavaScript ZIP 라이브러리 하나를 버전 고정·로컬 번들로 추가하는 방안을 권장한다. 구현 시작 시 호환성과 라이선스를 확인하고 버전·lockfile을 기록한다. 자체 ZIP 포맷 구현은 하지 않는다.

정해진 루트 폴더 아래 `pom.xml`, `src/` 등 requiredInExport 파일을 넣는다. `target`, `build`, `.git`, 개인 IDE 경로, 실제 자격정보, 모범답안, 다른 단계 코드, 진행 JSON은 프로젝트 ZIP에서 제외한다. 학습 기록 백업 JSON과 실행용 ZIP은 서로 다른 버튼과 파일명으로 구분한다. 입력 경로의 절대 경로·드라이브·역슬래시 우회·`..`·중복 정규화 경로를 거부한다.

## 8. 전역 제약과 검토 초점

- 기존 과평의 시간·문항 수·성적 기록은 바꾸지 않는다.
- 학습 코드가 수정되면 revision과 reference 검증 기록을 함께 갱신한다.
- 완성 코드 확인을 자기점검 완료로 처리하지 않는다.
- 서버에 작성 코드나 DB 자격정보를 전송하지 않는다.
- 원본·개인 자료와 target/build 산출물을 공개 ZIP·배포에 포함하지 않는다.
- 새 화면은 UTF-8, 한국어 자연스러운 줄바꿈, 360px와 데스크톱, 키보드 이동을 확인한다.

| 검토 초점 | 기대 동작 | 담당 작업 |
| --- | --- | --- |
| 입력 직후 파일 전환·새로고침·한글 조합 | 마지막 입력과 파일 선택 보존 | 작업 3, 4 |
| 저장 용량 초과·여러 탭·잘못된 백업 | 기존 코드 보존, 거짓 저장 성공 표시 금지 | 작업 3 |
| 만료 중 편집·새로고침·무제한 전환 | 종료 snapshot 보존, 새 응시와 분리 | 작업 3, 4 |
| JSP/HTML/JS 문자열과 ZIP 경로 | 입력 코드 실행 금지, 경로 이탈 차단 | 작업 2, 4, 5 |
| 원고 revision 변경·하위 배포 경로 | 기존 snapshot 복원, 파일·노트·ZIP 경로 유효 | 작업 2, 3, 6 |

## 9. 구현 작업 순서

### 작업 1. 검증된 학습 기준 프로젝트와 3단계 원고

**파일:** 신규 `source/backend/projects/web-01/`의 7절 파일, `source/backend/projects/web-01/stages/{1,2,3}/`, `source/backend/projects/web-01/review.json`; 수정 `.gitignore`, `AGENTS.md`, `docs/QUESTION_AUTHORING.md`, `docs/plans/source-publication.md`와 공개 출처 목록. 기존 `scope-backend.json`의 과평 composition은 변경하지 않는다.

**입출력:** 입력은 사용자 요구와 로컬 참고 자료. 출력은 고유 target/checklist ID를 가진 프로젝트와 검증된 reference. 기존 프로젝트 원본은 수정하지 않는다.

- [x] 로컬 원본을 공개 제외하고 제안 자료 ID와 비공개 경로·해시 대응을 등록한다. 지침에는 별도 Web 프로젝트 방식과 체크리스트 평가를 추가한다. (구현 기록: `.gitignore`, 자료 ID 등록, 비공개 대응표 갱신, AGENTS.md와 QUESTION_AUTHORING.md에 안내 추가)
- [x] CRD·인증·JSP 목표별 요구사항과 기대 DB 결과를 작성한다. 정상 흐름과 3절의 오류 사례를 포함한다.
- [x] 새로운 reference를 작성한다. `/gear`와 `/user` 역할, form 파라미터, request/session 속성명, POST 삭제, 입력 검증을 먼저 고정한다.
- [ ] 사용자 지정 OpenJDK25U-jdk hotspot 25.0.3_9, Apache tomcat-11.0.27, Dynamic web module version 6.0, mysql 8.4.11에서 검증하고 실제 실행 버전을 review.json에 기록한다. 템플릿의 Java 21 컴파일 설정과 지정 JDK 25 실행 환경을 구분해 기록한다. (구현 기록: JDK 25.0.3, Tomcat 11.0.27 Jasper까지 확인함. MySQL 8.4.11 실행 검증은 대기)
- [ ] reference를 실제 Java/Tomcat/MySQL에서 빌드·실행한다. JSP 최초 접근, 한글 POST, 쿠키 켜기/끄기, 중복 키, 빈 목록, 없는 상세, 삭제와 로그아웃을 확인한다. 모범답안이 통과하기 전 공개 완료로 표시하지 않는다. (구현 기록: `javac`와 Jasper JspC까지 확인함. Tomcat과 MySQL 실행은 사용자 STS 검증 대기)
- [x] reference와 같은 계약으로 1단계 빈칸, 2단계 본문/블록, 3단계 전체 구현 대상 파일을 작성한다. 각 target이 세 단계 모두에서 연습되는지 검사한다.

**완료 증거:** `review.json`에 파일 해시, revision, 실행 환경, 시나리오별 결과, 검토 주체. 실제 실행을 못 한 항목은 명시적으로 미검증.

### 작업 2. 프로젝트 원고 검증과 빌드

**파일:** 신규 `scripts/build_backend_projects.py`, `scripts/validate_backend_projects.py`, `tests/content/test_backend_projects.py`; 수정 `scripts/build_data.py`, `scripts/build_site.py`; 생성 `data/backend-projects*`와 manifest.

**입출력:** 7절 원고를 받아 `build_projects(source_root, output_root) -> dict`와 검증된 단계 JSON·starter ZIP·reference 자산을 만든다.

- [x] `test_three_stages_cover_targets`, `test_duration_options`, `test_missing_file`, `test_path_escape`, `test_no_reference_in_starter_zip`, `test_revision_hash`를 먼저 작성하고 신규 기능 부재로 실패하는지 확인한다.
- [x] 경로와 ID, 단계·checklist 연결을 검증한 뒤 허용 파일만 생성한다. ZIP의 정렬·timestamp를 고정해 반복 빌드 결과가 같게 한다.
- [x] build_data에 webProjects 등록을 추가한다. 월말 프로젝트 수가 기존 문항 수에 합산되지 않게 한다.
- [x] build_site의 현재 최상위 JSON/MD 신선도 검사에 프로젝트 하위 산출물의 경로·해시 검사도 추가한다. 원본 전체 복사로 해결하지 않는다.
- [x] `python -m unittest discover -s tests/content -p test_backend_projects.py`, `python scripts/build_data.py`, `python scripts/validate_backend_projects.py` 통과 확인.

### 작업 3. 응시 상태와 코드 저장·백업

**파일:** 신규 `assets/project-attempt.js`, `assets/project-store.js`, `tests/unit/project-attempt.test.js`, `tests/unit/project-backup.test.js`; 수정 `assets/storage.js`, `assets/app.js`; IndexedDB 브라우저 검증은 작업 6의 E2E에 포함.

**인터페이스:**

- `createProjectAttempt(project, stageId, minutes, now) -> ProjectAttempt`
- `finishProjectAttempt(attempt, now, reason: 'manual'|'timeout') -> ProjectAttempt`
- `continueProjectAttempt(attempt, now) -> ProjectAttempt`
- `setProjectCheck(attempt, criterionId, state) -> ProjectAttempt`
- `createProjectStore(indexedDB) -> {list, load, save, importValidated, exportAll}`. I/O 메서드는 Promise 반환. `save(attempt, {expectedVersion})`는 `{saved, saveVersion?, reason?, conflict?}` 반환. 초기 버전은 0, 저장 성공마다 1 증가하며 같은 트랜잭션에서 비교 후 저장한다.

- [x] 90/120분 deadline 차이 5,400,000/7,200,000ms, 무제한 null, 허용하지 않은 시간 거부, 만료의 멱등성, 종료 코드 불변을 단위 검사한다.
- [x] 시간 상태와 종료 snapshot을 구현한다. `continueProjectAttempt`는 새 ID와 무제한을 사용하고 이전 응시를 변경하지 않는다.
- [x] 파일 전환 전 flush, 저장 실패, 두 탭 동시 저장 중 하나의 충돌 처리, revision snapshot 복원, 구버전 백업, 잘못된 백업 전체 거부, 가져오기 실패 rollback, 20MiB 초과 분할 백업 왕복을 검사·구현한다.
- [x] `node --test tests/unit/project-attempt.test.js tests/unit/project-backup.test.js` 통과 확인.

### 작업 4. 모든 단계의 다중 파일 편집 화면

**파일:** 신규 `pages/project.html`, `assets/project.js`, `assets/project-editor.js`, `assets/project.css`, `tests/unit/project-editor.test.js`; 수정 `assets/code-editor.js`, `tests/unit/code-editor.test.js`.

**인터페이스:** `mountProjectEditor(container, {files, activePath, readOnly, onChange, onSelect}) -> {flush, setReadOnly, destroy}`. onChange는 `{path, text}`를 전달. 기존 attachEditor 호출은 계속 동작하고 언어 옵션은 선택 인수로 추가한다.

- [x] 파일별 독립 답안, 제공 파일 잠금, 마지막 입력 flush, IME 입력, JSP의 EL 입력, 입력 문자열 비실행, 키보드로 편집기 탈출, target 표식 삭제·중복 시 수동 확인 안내를 검사한다.
- [x] 5절 레이아웃과 단계별 초기 코드, target 이동, 파일 초기화, 힌트·모범답안 명시적 열람을 구현한다. 텍스트 저장 성공과 실패 상태를 표시한다.
- [x] 3단계에서도 파일 목록과 편집기를 제공한다. `로컬에서만 작성하세요`로 대체하지 않는다.
- [x] 코드 보기/작성 전환, 파일 트리 열기/접기, 모바일 검색·복사·글자 크기·표시 줄바꿈, 화면 들여쓰기 버튼을 구현한다. 표시 줄바꿈·회전·패널 전환 전후 파일 텍스트가 같음을 확인한다.
- [x] 종료·만료 시 편집 잠금과 계속 연습 분기를 연결하고 코드·체크리스트를 별도로 다룬다.
- [x] `node --test tests/unit/code-editor.test.js tests/unit/project-editor.test.js` 통과 확인. 기존 SW역량테스트 편집기도 회귀 확인.

### 작업 5. 자기점검·작성 누락 검사·ZIP

**파일:** 신규 `assets/project-checks.js`, `assets/project-export.js`, `tests/unit/project-checks.test.js`, `tests/unit/project-export.test.js`; 수정 `assets/project.js`, `package.json`, 잠금 파일; ZIP 라이브러리 배포용 로컬 번들 및 라이선스.

**인터페이스:** `checkProjectDraft(project, stageId, files) -> Finding[]`(targetId/path/message, 정답 boolean 없음), `buildProjectZip(project, files) -> Promise<Blob>`.

- [x] 누락 target, 다른 올바른 코드, 일반 TODO 주석, 체크리스트 독립성, UTF-8 ZIP 왕복, 경로 이탈, 정답·target 제외를 검사한다.
- [x] 검사 결과는 `누락 가능성`으로 표시하고 모범답안 비교가 자기점검 상태를 바꾸지 않게 한다.
- [x] 현재 파일+제공 파일로 실행용 ZIP을 만들고 실제 압축 해제로 내용과 경로를 검증한다. 전체 기록은 JSON 백업으로 별도 제공한다.
- [x] `node --test tests/unit/project-checks.test.js tests/unit/project-export.test.js` 통과 확인. 선택 확장인 로컬 HTTP 점검 스크립트는 이 작업의 필수 완료 조건에서 제외한다.

### 작업 6. 홈 진입·흐름 요약·통합 검증

**파일:** 수정 `assets/app.js`, `scripts/build_site.py`, `README.md`, `docs/plans/backend-db.md`; 신규 `tests/e2e/backend-project.spec.js`. 필요 스타일은 project.css와 기존 홈 스타일에 나눠 적용.

**입출력:** manifest.webProjects와 프로젝트 응시 목록을 받아 backend 홈에 흐름 요약·3단계 카드·이어하기를 표시한다. 기존 과평 카드/9개 주제별 연습 링크의 동작을 유지한다.

- [x] backend 선택 시에만 흐름 요약·월말 카드가 보이고 각 단계가 사이트 편집기로 연결되는 E2E를 작성한다.
- [x] 백엔드·DB의 월말평가 선택 시 `오늘의 문제집` 바로 아래, 카드 위에 1절의 실행 환경과 Spring Tools for Eclipse 권장 안내가 정확한 문구로 각각 한 줄씩 표시되는지 검사한다. 과평·다른 트랙에서는 숨기고 좁은 화면에서는 안내별 자연스러운 줄바꿈과 잘림 없음을 확인한다.
- [x] 모든 단계에서 90/120/무제한 선택, 자동 저장·복원, 실제 IndexedDB 실패/충돌, ZIP 다운로드, 체크리스트 3상태를 확인한다.
- [x] 시간을 진행시켜 만료·새로고침·이어 연습을 검사하고 만료 시점 코드가 남는지 확인한다.
- [x] `/study-space/` 하위 경로, 360px/데스크톱, 라이트/다크, 키보드·IME, 편집기 내부 가로 스크롤을 확인한다.
- [x] 360/390/768/1024/1440px에서 파일 트리와 코드·요구사항 배치를 확인한다. 모바일 최초 열람에서 입력 포커스가 생기지 않고 모든 단계에서 작성으로 전환되는지 검사한다.
- [ ] 실제 Android Chrome과 iOS/iPadOS Safari에서 한글 조합·붙여넣기·선택·스크롤·키보드 열기/닫기와 회전을 확인한다. 태블릿은 화면 키보드와 물리 키보드를 각각 확인하고 실제로 검증한 OS·브라우저 버전을 기록한다. 확보하지 못한 기기는 미검증으로 보고한다. (구현 기록: 실기기를 확보하지 못해 미검증. Playwright 화면 크기 검사만 수행)
- [x] 기존 과평 3회·60분과 다른 트랙 및 SW 편집기의 회귀 검사를 수행한다.
- [x] 아래 검증 결과와 변경 파일을 보고한다. 커밋 요청 전 자동 커밋하지 않는다.

```text
python scripts/build_data.py
python scripts/validate_questions.py
python scripts/validate_backend_projects.py
python scripts/audit_bias.py --strict --report reports/bias.json
python -m unittest discover -s tests/content
npm test
npx playwright test tests/e2e/backend-project.spec.js tests/e2e/backend.spec.js tests/e2e/sw-test.spec.js tests/e2e/base-path.spec.js
python scripts/build_site.py
git diff --check
```

새 검증 명령·테스트 파일은 앞으로 구현할 대상이다. reference의 Maven 빌드와 Tomcat/MySQL 실행은 사이트 테스트와 별도로 기록한다. 이 계획에는 객관식 문항 추가가 없으므로 새 프로젝트의 정답 번호 분포·길이 편향 지표는 해당 없음이며, 기존 객관식 검사는 계속 통과해야 한다.

## 10. 이번 계획안 작성의 검증 기록

- 원격 fetch 성공. 작업 시작 당시 origin/main보다 뒤처짐 0, 로컬 전용 커밋 1. 최신 origin/main에서 `docs/backend-monthtest-plan` 생성.
- 기존 미추적 계획안·참고 자료는 보존. 작성 Java/JSP/SQL 원본 수정 없음.
- `javac --release 21 -encoding UTF-8 -cp <로컬 Servlet API 6.0.0 jar> -d reports/backend-monthtest-plan/classes <작성 Java 11개>`: 종료 코드 0.
- Java/JSP/SQL·설정과 기본 템플릿 차이 정적 검토 완료. 코드 점검을 전체 실행 통과로 표현하지 않음.
- `python reports/backend-monthtest-plan/verify_plan.py`: 문서 2개와 로컬 링크 8개, 필수 요구사항·UTF-8 검사. 기존 문서의 변경 전부터 있던 후행 공백 1개는 별도 분류하고 이번 수정의 오류와 구분한다.
- `git diff --check`: 이번 추적 파일 변경의 공백 오류 없음. 신규 계획안은 위 Python 검사에서 직접 검사한다.
- 독립 설계 검토에서 백업 용량의 왕복 가능성, target 위치 식별, 동시 저장 충돌을 보완했다. 독립 검토는 계획안 대상이며 Java/JSP 실행 검수가 아니다.
- 제품 코드·문항·data 변경 없음. 기능 테스트·원고 재생성은 이번 문서 작성에서 실행하지 않으며 후속 구현 완료 조건으로 명시했다.

## 11. 구현 중 확정한 사항 (2026-11-06)

사용자 답변과 구현 과정에서 계획안과 달라지거나 구체화된 내용이다.

| 항목 | 확정 내용 |
| --- | --- |
| 도메인 | 시험 템플릿 흐름과 같은 캠핑 용품(`web-01`, Gear)과 도서(`web-02`, Book) 두 가지를 만든다. 사이트에서 사용자가 도메인을 선택해 연습한다. 열 구성은 문자열 PK + 이름·가격·브랜드(저자)·색상(분류)로 같다 |
| 원고 구조 | `source/backend/projects/_master/`의 마스터 한 벌에서 `scripts/author_backend_projects.py`가 도메인과 단계별 파일을 만든다. 생성물은 7절 구조(`starter/`, `stages/{1,2,3}/`, `reference/`)로 커밋하고 `--check`로 최신 여부를 검사한다 |
| 실행 검증 | 사용자가 Spring Tools for Eclipse에서 직접 검증한다. 구현 코드는 `reference/`, 검증 절차는 프로젝트별 `verification.md`로 분리해 둔다. 에이전트는 MySQL·Tomcat을 기동하지 않고 `javac`와 Jasper JspC 번역·컴파일까지만 확인한다 |
| 인증 범위 | JSP는 원본 템플릿처럼 `webapp` 아래에 둔다. `SessionFilter`는 `/gear`(도서는 `/book`) 컨트롤러 요청만 보호하고 JSP 직접 접근 차단은 확장 과제로 체크리스트에 명시한다 |
| 참고 자료 | 원본 프로젝트(`backend-monthtest`)와 수업 제공 ZIP은 `.gitignore`로 제외한다. 공개 자료 ID는 `BE-MONTH-START-01`, `BE-MONTH-WORK-01` |
| 커밋 | 저장소 지침에 따라 사용자 요청 전에는 커밋하지 않는다 |

## 12. 프로젝트 구조 도식 (2026-11-06 사용자 요청)

| 항목 | 확정 내용 |
| --- | --- |
| 목적 | 브라우저 → 필터 → 컨트롤러 → 서비스 → DAO → DB와 JSP로 돌아오는 길(forward, redirect, 오류)을 도식으로 보여주고, 상자와 화살표를 누르면 역할과 뼈대 코드를 보여준다 |
| 코드 공개 범위 | 뼈대만. 클래스·어노테이션·메서드 시그니처와 주고받는 이름만 보이고 작성 대상의 본문은 '작성 대상'으로만 표시한다. 검증기가 뼈대에 모범답안 줄이 있으면 실패시킨다 |
| 위치 | 홈 월말평가 탭의 흐름 요약(흐름 탭을 고르면 해당 기능 경로만 강조)과 프로젝트 화면 오른쪽 패널의 '구조' 탭. 프로젝트 화면에서는 '이 파일 열기'로 실제 편집기 파일을 연다 |
| 데이터 | `_master/structure.json`이 단일 원본이고 생성기가 도메인 이름을 바꿔 `project.json`의 `structure`로 넣는다. 응시를 시작할 때 snapshot에 복사해 원고가 바뀌어도 시작 당시 도식을 복원한다 |
| 구현 | `assets/project-structure.js`. 계층별 줄에 상자 버튼을 놓고 줄 아래에 아래 방향 화살표, 도식 아래에 돌아가는 길을 모은 HTML 도식이라 360px에서도 가로로 넘치지 않고 키보드와 스크린 리더로 쓸 수 있다 |

구현 기록: `tests/unit/project-structure.test.js`, 검증기 `check_structure`, `tests/e2e/backend-project.spec.js`의 도식 시나리오로 확인했다.

## 13. 갱신된 월말평가 프로젝트 반영 (2026-11-08 사용자 요청)

사용자가 제공한 갱신본(`BE-MONTH-WEBTEST-01`)의 구성에 연습 프로젝트를 맞췄다. 11절의 인증 범위 확정 내용은 아래 표로 대체한다.

| 항목 | 내용 |
| --- | --- |
| 구성 | 컨트롤러 하나(`GearController`, `/gear`)가 목록, 등록, 상세, 로그인, 로그아웃을 처리한다. 서비스와 DAO의 메서드는 `login`, `selectAll`, `insert`, `detail` 네 개다 |
| 제거 | 삭제 기능(`ctrl-delete`, `dao-delete`), `SessionFilter`와 로그인 필요 요청 차단, `MemberController`(`/user`), `DuplicateCodeException`, 입력 검증 보조 메서드, 오류 매핑 작성 대상(`web-errorpage`). `web.xml`은 제공 파일로 남긴다 |
| 이름 변경 | `user-login`, `user-logout`은 `ctrl-login`, `ctrl-logout`으로 바꿔 `GearController`에 둔다 |
| 계약 변경 | `GearService.insert`는 코드 중복을 예외 대신 반환값 0으로 알린다. 컨트롤러는 0이면 `alertMsg`와 함께 등록 화면으로 되돌린다 |
| 수치 | 작성 대상 20개에서 16개, 체크리스트 14개에서 10개, 흐름 탭 8개에서 6개, 모범답안 Java 13개에서 10개. 목록 표는 코드, 용품명, 가격, 색상 네 열이다 |
| 버전 | 프로젝트 `revision`을 2로 올렸다. 이전에 시작한 응시는 시작 당시의 스냅샷으로 열린다 |
| 검증 | `javac --release 21`(Servlet API 6.0.0)과 Jasper JspC(Tomcat 11.0.27, JSTL 3.0.1)로 두 도메인의 모범답안과 2단계 시작 코드를 확인했다. Tomcat 기동과 MySQL 실행은 확인하지 않았고 `review.json`의 실행 항목은 미검증이다 |
| 원본 취급 | 갱신본의 코드와 문구를 옮기지 않고 구성, 기능, 작성 위치만 반영해 직접 작성했다. 원본은 저장소에 두지 않고 비공개로 보관한다 |

## 14. 로그인 아이디 기억하기 쿠키 반영 (2026-11-09 사용자 요청)

13절에서 이메일 기억 쿠키를 뺐지만 갱신본(`BE-MONTH-WEBTEST-01`)의 로그인 화면에는 `아이디 기억하기` 체크박스(`remember-me`)가 있고 사용자가 작성한 풀이는 이를 쿠키로 처리한다. 쿠키가 없는 연습 프로젝트는 그 풀이와 달라 쿠키 처리까지 반영했다.

| 항목 | 내용 |
| --- | --- |
| 반영 위치 | 새 작성 대상을 만들지 않고 기존 `ctrl-login`(로그인과 아이디 기억하기 쿠키)과 `jsp-login`(로그인 form과 이메일 쿠키)에 포함했다. 작성 대상은 16개 그대로다 |
| 컨트롤러 | 로그인에 성공하면 세션 속성 `user`를 저장하고, `remember-me`가 `on`이면 `email` 쿠키에 이메일을 1년 동안 저장하고(`maxAge`의 단위는 초라서 `60 * 60 * 24 * 365`로 쓰고 코드 주석으로 단위와 계산을 밝힌다) 아니면 같은 이름과 path로 지운다. 저장과 삭제의 path는 같게 쓰고 루트 컨텍스트(`getContextPath()`가 빈 문자열)는 `/`로 바꾼다(7절 위험 항목의 후속 확인). 저장과 삭제는 제공 파일의 `setupCookie`를 쓴다 |
| 로그인 화면 | `email` 쿠키가 있으면 이메일 칸을 그 값으로 채우고 체크박스를 `checked`로 그린다. 쿠키 값은 사용자가 바꿀 수 있으므로 `c:out`으로 출력한다 |
| 체크리스트 | `auth-cookie`(아이디 기억하기 켜기, 끄기, 다시 열기)를 더해 10개에서 11개가 됐다. `auth-login`의 확인 항목은 그대로다 |
| 문서와 도식 | 요구사항에 쿠키 약속과 로그인 항목, 흐름 문서의 로그인 흐름과 짝, 검증 절차의 쿠키 속성 확인, 도식의 `GearController`와 `login-form.jsp` 설명을 고쳤다 |
| 되살리지 않은 것 | `SessionFilter`, `MemberController`, 삭제 기능, 오류 매핑 작성 대상은 13절 그대로 제외한다 |
| 버전 | 프로젝트 `revision`을 3으로 올렸고, 쿠키 유효 기간을 1년으로 하고 단위 설명을 더하면서 4로 올렸다. 이전에 시작한 응시는 시작 당시의 스냅샷으로 열린다 |
| 검증 | `javac --release 21`과 Jasper JspC로 두 도메인의 모범답안과 2단계 시작 코드를 다시 확인했다. Tomcat 11.0.27의 쿠키 처리기로 `email` 쿠키 헤더(저장은 컨텍스트 경로 Path와 1년, 삭제는 같은 Path, `@` 허용)를 확인했다. Tomcat 기동과 MySQL 실행은 확인하지 않았고 `review.json`의 실행 항목(`auth-cookie` 포함)은 미검증이다 |
| 원본 취급 | 사용자 풀이의 코드와 문구를 옮기지 않고 동작(쿠키 이름 `email`, 체크박스 이름 `remember-me`, 저장과 삭제)만 반영해 직접 작성했다 |

## 15. 시험 화면 배치와 편집기 색 (2026-11-09 사용자 요청)

| 항목 | 내용 |
| --- | --- |
| 파일 접기 버튼 | 상단 막대 맨 왼쪽(제목 앞)으로 옮겼다. 요구사항 접기 버튼은 오른쪽에 그대로 둔다 |
| 접기 오류 수정 | 파일 패널을 접으면 코드 패널이 0px 칸으로 밀려 너비가 2px가 되던 오류를 고쳤다. 패널을 자기 칸에 직접 놓고, 접은 칸은 코드 패널이 이어서 차지한다 |
| 요구사항·구조 패널 크기 | 코드 패널과 요구사항 패널 사이의 손잡이(`role="separator"`)를 끌어 너비를 바꾼다. 방향키(Shift는 3배), Home, End, Enter(처음 크기), 더블클릭(처음 크기)도 쓴다. 최소 280px이고 코드 패널이 320px 아래로 줄지 않게 최대를 제한한다. 바꾼 너비는 브라우저(`study-space:project-side-width`)에 저장하고 창 크기가 바뀌면 범위에 다시 맞춘다. 태블릿과 모바일에는 손잡이가 없다 |
| 기본 크기 | 340px 고정에서 `clamp(360px, 36vw, 600px)`로 키웠다(1280px에서 461px, 1440px에서 518px, 1920px에서 600px). 모범답안 코드 상자의 최대 높이도 320px에서 `min(560px, 65vh)`로 키웠다 |
| 편집기 색 | 작성 모드의 `textarea`는 글자를 투명하게 두고 같은 글꼴과 여백의 색 입힌 층(`.pe-hl`)을 바로 아래에 겹쳐 그린다. 입력, 스크롤, 크기 변화에 맞춰 층을 갱신한다. 색은 Eclipse 편집기를 따른다: Java와 SQL은 키워드 자주색 굵게, 문자열 파랑, 주석 초록, Javadoc 청회색, 애노테이션 회색이고 JSP, XML, HTML은 태그 청록, 속성 이름 자주, 속성 값 파랑 기울임, 주석 청회색, JSP 구분자 노란 바탕이다. 읽기 모드와 어두운 테마(Eclipse 어두운 색)에도 같게 적용한다 |
| 확인 | `tests/e2e/backend-project.spec.js`의 배치, 기본 너비, 끌기·키보드·저장, 태블릿·모바일, 편집기 색 시나리오와 `tests/unit/project-editor.test.js`의 `clampPanelWidth`로 확인한다 |
| 모범답안 파일 | 시험 화면의 모범답안 탭은 직접 작성하는 파일(작성 대상이 있는 파일 8개)만 고르게 한다. 제공 파일은 그대로 쓰면 되므로 비교할 것이 없다. 홈 구현 흐름의 모범답안은 처음부터 구현 필요 상자에만 있다 |
| 파일별 스크롤 | 편집기가 파일마다 스크롤 위치(세로, 가로)를 기억한다. 다른 파일로 가거나 읽기와 작성 모드를 바꾸면 다시 그리기 직전에 화면의 위치를 저장하고 그린 뒤 새로 보이는 파일의 위치를 되살린다. 처음 여는 파일은 맨 위에서 시작한다. 같은 화면을 다시 열면 처음 위치로 돌아간다(저장하지 않는다) |
