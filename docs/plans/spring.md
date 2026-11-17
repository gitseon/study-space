# Spring 과목평가·월말평가와 개념 노트 구현 계획안

> 실행 지침: 사용자 선택 후 `superpowers:executing-plans`로 체크리스트를 순서대로 진행한다. 이번 산출물은 계획안이며 문제·노트·제품 코드는 후속 구현 대상이다. 커밋·push·PR은 사용자 요청이 있을 때만 한다.

**목표:** `source/Spring/` 자료의 개념을 새 예제로 설명하는 노트, 과목평가 모의고사, 직접 작성하는 월말 프로젝트 연습을 하나의 `spring` 트랙으로 연결한다.

**구조:** 기존 정적 사이트, Python 원고 빌드, JavaScript 화면, 브라우저 저장을 유지한다. 과평은 기존 문제은행을 확장하고 월말은 backend 프로젝트 기능의 공통 부분을 재사용한다. 선행 변경과 선택지는 [리팩토링 검토안](spring-refactoring.md)을 따른다.

**기술:** 기존 Python·Node·Playwright 도구를 사용한다. Spring 코드의 검증 환경은 Maven 프로젝트로 분리하고 수업과 맞는 JDK·Boot·Framework·Security·MyBatis·MySQL 조합을 먼저 고정한다. `requirements-dev.txt`는 복원하거나 설치 명령에서 참조하지 않는다.

**설계 명세:** 사용자 요청(2026-11-17), 이 문서 1~8절과 연결된 리팩토링 검토안. 기존 [백엔드·DB](backend-db.md), [월말평가](backend-monthtest.md), [프론트엔드](frontend.md), [출처 공개 방안](source-publication.md)을 참고하되 현재 코드를 기준으로 재검토했다.

작성일: 2026-11-17. 상태: **구현됨**(2026-11-17 기준: R1~R4, S0~S3와 과목평가 3회, 프로젝트 2개의 자동 검증까지). 선택 사항은 사용자의 구현 지시에 따라 권장안으로 진행했다. 남은 것은 STS에서의 수동 실행 확인(`stsManual`), 수업 POM 확보 뒤의 환경 대조, Spring 검증을 CI에서 실행하는 일(S4의 DB 서비스 job)이다. 회차 수, 시간, 프로젝트 구성은 학습용 제안이며 공식 평가 규정이나 사용자가 확정한 사항이 아니다.

## 1. 자료 확인 결과와 한계

PDF 22개, 총 1,078쪽을 확인했다. 기본 강의 묶음 11개 467쪽과 보충 묶음 11개 611쪽이다. 이미지형 PDF와 텍스트 추출 시 글자가 깨지는 PDF가 있어 목차·본문 표본 254쪽을 OCR로 확인하고 버전·트랜잭션·보안 경로 설명 등 주요 페이지는 이미지와 대조했다. 모든 페이지의 코드 실행이나 정답 검수를 완료한 것은 아니다.

공개 문서에서는 아래 자료 ID를 사용한다. 원본명·경로·SHA-256 대응표와 추출물은 Git 제외 위치인 `private/spring/`에만 보관한다. 이번 조사에서 만든 `source-index.json`은 파일 단위 대응표이며 문항 제작 시 실제 인용 절과 PDF 페이지를 추가한다. 쪽수는 인쇄된 슬라이드 번호가 아니라 **PDF 파일의 1부터 시작하는 페이지**다.

| 자료 ID | 쪽수 | 확인한 학습 범위 |
| --- | ---: | --- |
| SPR-L01 | 42 | Framework, SLF4J, JUnit, Lombok |
| SPR-L02 | 35 | 의존성, 명시적·묵시적 DI, 빈 생명주기 |
| SPR-L03 | 40 | Boot, 자동 구성, 설정, 기존 Servlet 프로젝트 전환 |
| SPR-L04 | 35 | AOP, 프록시, pointcut, advice |
| SPR-L05 | 32 | AOP 한계, MVC 흐름, Controller와 응답 |
| SPR-L06 | 30 | MVC 테스트, 인자 바인딩, 예외, 파일 업로드 |
| SPR-L07 | 38 | Model 계층, Spring과 MyBatis, 매퍼 |
| SPR-L08 | 45 | 동적 SQL, Service 트랜잭션, 전파, resilience |
| SPR-L09 | 84 | REST, API versioning, Swagger, RestClient, HTTP Interface |
| SPR-L10 | 46 | SecurityFilterChain, 인증·인가, 사용자와 권한 설정 |
| SPR-L11 | 40 | 사용자 정의 인증, 로그인·로그아웃, 인증 정보, Remember-Me |
| SPR-S01 | 50 | Framework와 프로젝트 환경 |
| SPR-S02 | 36 | 로깅과 JUnit 보충 |
| SPR-S03 | 73 | IoC, DI, 빈 관리 |
| SPR-S04 | 35 | Lombok 어노테이션 |
| SPR-S05 | 56 | Boot 자동 구성, 설정, 빈 생명주기·scope |
| SPR-S06 | 46 | AOP 동작, pointcut, advice, 활용 |
| SPR-S07 | 88 | MVC, 바인딩, Model/View, 예외, Validation |
| SPR-S08 | 40 | Interceptor, Filter·AOP 비교, 요청별 문맥 |
| SPR-S09 | 47 | MyBatis 설정, XML, 동적 SQL, resultMap |
| SPR-S10 | 26 | multipart와 파일 업로드·다운로드 |
| SPR-S11 | 114 | HTTP·REST, ResponseEntity, CORS, 오류 응답, OpenAPI |

같은 개념이 두 묶음에 반복되어도 출제 비중을 두 번 계산하지 않는다. 기본 강의의 REST 파일 안에도 개념이 반복되므로 페이지 수를 그대로 문제 수로 환산하지 않는다. 원본 슬라이드, 예제 도메인, 이미지, 정답 코드를 복제하지 않는다.

현재 `source/Spring/`에서 공식 과평·월말 안내, 제출용 starter 프로젝트, 실제 수업 POM은 발견하지 못했다. 과평은 저장소의 21/9/2 규칙을 적용하고, 월말 형식·시간·필수 구현 범위는 아래 제안으로 구분한다. 기존 백엔드 평가의 날짜·시간·외부 Tomcat 버전을 Spring 평가의 확정값으로 가져오지 않는다.

## 2. 전역 제약과 출제 전 보정

- 원고는 `source/`에서 수정하고 `data/`는 빌드로만 만든다. 기존 시험 ID·문항 ID·revision·choiceId와 저장된 응시를 보존한다.
- `docs/QUESTION_AUTHORING.md`의 정확성, 편향, 한국어 표시 기준을 그대로 적용한다. Spring 규칙과 프로젝트 예외를 AGENTS.md 및 출제 지침에 명시한 후 생성한다.
- 실행 결과를 묻는 문항은 실제 고정 환경에서 확인한다. 작성자의 재검토를 독립 검수나 실행 성공으로 표시하지 않는다.
- 원본 및 개인 설정은 공개하지 않는다. 자료 ID와 절·쪽, 직접 작성한 노트의 절, 공식 문서 URL로 출처를 남긴다.
- 정적 사이트는 Java·Spring·DB 코드를 실행하지 않는다. 브라우저 체크리스트와 실제 프로젝트 검증 기록을 구분한다.
- `requirements-dev.txt` 삭제를 유지한다. 일반 빌드·콘텐츠 검사는 Python 표준 라이브러리, AI 검증은 기존 `requirements-ai.txt`, 프론트 도구는 `package-lock.json`, Spring 검증은 별도 POM으로 의존성을 관리한다.

### 2-1. 버전과 설명 보정 목록

| 확인 지점 | 출제 전 조치 |
| --- | --- |
| SPR-L03 PDF p.5의 Boot 4.x·JDK 21 안내와 p.15의 3.5.x 의존성 화면이 공존 | 어느 화면도 전체 실행 환경의 확정값으로 삼지 않는다. 실제 수업 POM 또는 실행 가능한 새 검증 POM에서 버전 조합 확정 |
| SPR-L08 PDF p.25의 `readOnly` 설명 | 모든 환경에서 쓰기를 강제 금지한다고 단정하지 않는다. 트랜잭션 관리자·드라이버 조건을 명시하고 실제 동작 확인 |
| SPR-L08 PDF p.35의 내부 호출 | 프록시 방식이라는 전제와 외부 호출·자기 호출을 구분하여 검증 |
| SPR-L10 PDF p.40의 경로 패턴 예시 | PathPattern과 Ant·정규식 문법을 섞지 않는다. 선택한 matcher에서 허용 문법과 일치 결과를 실행 확인 |
| SPR-L08의 resilience, SPR-L09의 API versioning·HTTP Interface | 오래된 Boot 환경으로 검증하지 않는다. 강의 포함 항목으로 노트에 정리하되 버전 확정 전 출력 문항은 보류 |
| MVC·REST·Security의 401/403/redirect 및 예외 응답 | 인증 방식, CSRF, 매처 순서, 핸들러 설정을 지문에 제공. 하나의 기본 응답으로 일반화하지 않음 |
| 업로드·로그·인증 예제 | 원본의 로컬 경로·계정·키를 옮기지 않고 새 데이터 사용. 파일명·로그에 민감정보가 남는 예제를 정상 구현으로 제시하지 않음 |

보정의 공식 근거: `readOnly`는 최적화를 위한 힌트이며 반드시 쓰기 실패를 보장하지 않는다는 [Transactional API](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/annotation/Transactional.html), 프록시 자기 호출을 설명한 [트랜잭션 문서](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html), `**`의 위치 등을 명시한 [PathPattern API](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/util/pattern/PathPattern.html)를 참고한다. 이는 개념 보정 근거이며 문항 실행 버전은 별도로 기록한다.

Spring 7의 resilience는 [공식 설명](https://docs.spring.io/spring-framework/reference/core/resilience.html)에 따라 별도 패키지의 Spring Retry와 구별한다. 보안은 [Security의 Servlet 구조](https://docs.spring.io/spring-security/reference/servlet/architecture.html)를 기준으로 필터 체인과 MVC의 위치를 정리한다. Boot와 MyBatis 버전은 [공식 호환 표](https://mybatis.org/spring-boot-starter/mybatis-spring-boot-autoconfigure/index.html)로 대조한다. 최신 공식 문서의 버전을 수업 버전으로 자동 채택하지 않는다.

### 2-2. 실행 환경 확정 절차

1. `java -version`, `mvn -version`, `mvn dependency:tree`, MySQL `SELECT VERSION()` 결과와 POM을 확인한다.
2. `source/Spring/environment-spring.json`에 JDK, Boot, Framework, Security, MyBatis starter, DB 및 테스트 도구의 정확한 버전과 packaging을 기록한다. 실제 계정·비밀번호·로컬 설치 경로는 제외한다.
3. 수업 POM을 확보하지 못하면 검증 가능한 조합을 **연습용 환경**으로 고정하고 수업 일치 여부는 미확인으로 표시한다. 버전 의존 문항은 그 환경을 지문에 명시한다.
4. JSP 프로젝트는 packaging과 실제 렌더링까지 검증한다. 기존 backend의 WAR·외부 Tomcat 설정을 그대로 복사하거나 모든 Boot 프로젝트를 동일한 실행 방식으로 취급하지 않는다.
5. 새 Spring 검사 job은 이 환경을 사용한다. 기존 알고리즘 Java 17 job의 버전을 무조건 바꾸지 않는다. 테스트하지 못한 항목은 미검증으로 남기고 공개 완료 조건을 충족한 것으로 취급하지 않는다.

## 3. 트랙·폴더·사이트 구성

트랙 ID는 `spring`, 표시명은 `Spring`으로 제안한다. Servlet·JSP·JDBC의 기존 `backend` 트랙에 합치지 않아 기존 성적과 범위를 유지한다. 기초 내용은 기존 Backend·DB 노트에 연결하고 Spring 흐름을 별도로 설명한다.

Windows에서 대소문자만 다른 `source/Spring`과 `source/spring`을 함께 만들지 않는다. 이번 확장에서는 실제 디렉터리명 `Spring`을 유지한다. 전체 폴더 이동은 선행 조건이 아니다.

```text
source/Spring/
  scope-spring.json                 # 주제·태그·21/9/2·studyLinks
  coverage-spring.json              # 개념 ↔ 노트 절 ↔ 문항·프로젝트 대상
  environment-spring.json           # 공개 가능한 검증 환경
  Spring개념 요약노트.md
  spring-checks.json                # 실행 케이스와 문항 ID/revision
  spring-reviews.json               # 개념 재풀이·보정 근거
  authoring-reviews.json            # 편향 경고 검토
  spring-01/                       # exam.json, questions.md, solutions.md
  spring-02/
  spring-03/
  projects/
    spring-web-01/                 # MVC·MyBatis 프로젝트
    spring-web-02/                 # REST·Security 프로젝트
private/spring/                    # 원본 대응표, OCR, 이미지, 개인 환경
data/                             # 빌드 산출물만 배치
```

기존 PDF는 위치를 유지하고 계속 Git에서 제외한다. 새 추출물은 `private/spring/`에만 만든다. 이후 원본을 모두 옮길 경우 대응표·백업·참조 검사까지 별도 작업으로 진행한다.

화면 흐름은 `홈 → Spring → 과목평가 / 월말평가 / 주제별 연습`, 노트 진입은 `Spring 개념` 버튼이다. 노트 URL은 `pages/concepts.html?note=spring-concepts`, 홈은 `index.html?track=spring`으로 한다. 기존 `studyLinks`로 오답 주제에서 해당 노트 절에 연결하고 실전 중에는 현재의 해설·노트 노출 규칙을 유지한다.

월말은 `pages/project.html?track=spring&project=spring-web-01`처럼 트랙을 지정한다. backend의 기존 URL과 저장 기록은 그대로 열린다. 과평 점수와 프로젝트 자기점검을 합쳐 하나의 정답률로 만들지 않는다. 홈은 기존 과목 선택과 종류 필터를 재사용하며 메뉴 전체를 재설계하지 않는다.

## 4. 과목평가 출제안

### 4-1. 회차와 배분

**3회, 회차당 객관식 21·단답 9·서술 2, 총 96문항**을 제안한다. `track: spring`, `kind: subject`, `practiceMinutes: 60`을 제안하되 60분은 연습 기본값이다. 실제 평가 시간은 안내 확보 후 대조한다.

| 대주제 ID | 범위 | 객관식 | 단답 |
| --- | --- | ---: | ---: |
| foundation-boot | Framework, Boot 구성·설정, 로깅·테스트·Lombok 기초 | 2 | 1 |
| di-bean | IoC, DI, 빈 등록·선택·scope·생명주기 | 3 | 1 |
| aop-proxy | AOP 용어, pointcut, advice, 프록시 한계 | 2 | 1 |
| mvc-binding | 요청 흐름, 매핑, 바인딩, Model/View, redirect | 3 | 1 |
| web-crosscut | Interceptor, Validation, 예외, multipart | 1 | 1 |
| mybatis | 매퍼, 바인딩, resultMap, 동적 SQL | 3 | 1 |
| service-tx | Service 경계, rollback, 전파, 자기 호출 | 2 | 1 |
| rest-api | HTTP·REST, JSON, ResponseEntity, CORS, API 문서 | 2 | 1 |
| security | 인증·인가, 필터 체인, 사용자 정보, 로그인·로그아웃 | 3 | 1 |
| 합계 | 서술 2문항은 아래 회차별로 별도 배정 | 21 | 9 |

`groups`에는 위 mc/short 수만 고정하고 `composition.subject`에 `mc:21, short:9, essay:2, code:0`을 둔다. 서술 대주제는 회차별로 아래처럼 정한다. 객관식·단답과 같은 사실을 중복해서 묻지 않는다.

| 회차 | 중점 | 서술 제안 |
| --- | --- | --- |
| spring-01 | 구성 요소의 책임과 기본 요청 흐름 | DI 선택 근거, MVC 요청·응답 흐름 |
| spring-02 | 설정·바인딩·트랜잭션 오류 분석 | 프록시 자기 호출과 트랜잭션, 동적 SQL의 경계 입력 |
| spring-03 | 계층을 연결한 상황 판단 | REST 오류 계약, 인증·인가 흐름과 접근 실패 |

로깅·JUnit·Lombok은 역할과 기본 사용을 묻고 어노테이션 목록 암기에 치우치지 않는다. 각 대주제의 필수 태그는 3회 전체에서 빠짐없이 다루고, 한 문항에 관련 없는 태그를 붙여 coverage를 채우지 않는다. resilience, API versioning, RestClient/HTTP Interface, Remember-Me 심화는 **노트에 포함하되 버전·범위 확인 전에는 심화로 구분**한다. JWT·OAuth 전체 구현, JPA·WebFlux는 이번 자료 기반 필수 과제로 추가하지 않는다.

### 4-2. 정답·해설과 품질 기준

- 문항 ID는 `spring-01-q01` 형식이며 객관식 정답·오답 해설은 choiceId에 연결한다. 기존 문항의 번호를 인용하는 해설을 만들지 않는다.
- 단답은 문항별 허용 표기와 정규화를 지정한다. 임의의 전체 Java 메서드·SQL·Security 설정을 문자열 일치로 채점하지 않는다. 동치 구현이 가능한 답은 서술이나 프로젝트 자기점검으로 다룬다.
- 해설에 전제, 처리 과정, 정답 근거, 오답별 반례, 자주 혼동하는 조건을 넣는다. 서술형에는 부분점수 기준과 핵심 누락 사례를 둔다.
- 객관식 1회는 번호별 4~7개, 3회 63개는 14~18개다. 동일 번호 3연속과 ABABAB 및 길이 3~4 블록 반복을 금지한다. 주제별 세트에도 일반 N 기준을 적용한다.
- 정답 길이/중앙값 0.65~1.35, 최대/최소 2.0, N≥20의 가중 최장·최단 0.15~0.35와 평균 정답/오답 길이 0.85~1.15를 경고 기준으로 검사한다. 예외는 문항 revision 또는 집계 hash에 연결하여 의미 검토한다.
- Spring 컨테이너·MockMvc·MyBatis/MySQL·Security 필터를 실제로 사용하는 검증과 개념 재풀이를 구별한다. Mock으로 DB와 Security를 모두 제거한 테스트를 통합 검증이라고 기록하지 않는다.

1회차는 `private/spring/drafts/spring-01/`에서 비공개 시범으로 작성·검토하고 이어서 2·3회차를 만든다. 등록된 트랙 아래 `*/exam.json`은 자동 수집되므로 공개 전에는 `source/Spring/spring-01/`에 두지 않는다. 시범 검사는 임시 source root에 기존 공개 원고와 시범 원고를 조합하여 수행하고 산출물·보고서는 private 또는 임시 폴더에만 둔다. 현 검증기는 활성 scope의 태그가 문제은행에 모두 존재하는지 검사하므로 1회차만으로 충족하지 못하면 아직 배포할 수 없다. 시범 통과를 위해 태그 검사를 끄거나 기준을 낮추지 않는다. 처음부터 공개하려면 1회차가 활성 필수 태그를 실제로 모두 다루어야 한다. 공개 기준을 충족한 원고만 위 최종 폴더로 옮겨 재빌드한다.

## 5. 개념 요약 노트

원고는 `source/Spring/Spring개념 요약노트.md`, 공개 노트 ID는 `spring-concepts`다. 기존 `assets/note-render.js`의 Part 목차, 코드 블록, 비교표, 복습 질문과 접힌 `답:` 형식을 따른다.

| Part | 내용 | 연결 자료 |
| --- | --- | --- |
| 1 | Framework, IoC, Spring의 구성과 학습 지도 | L01, S01 |
| 2 | Boot, 의존성, 자동 구성, 설정과 실행 환경 | L03, S05 |
| 3 | DI, 빈 등록·선택, 생명주기와 scope | L02, S03 |
| 4 | AOP, 프록시, advice와 적용 한계 | L04~05, S06 |
| 5 | DispatcherServlet, 매핑·바인딩, Model/View·PRG | L05~06, S07 |
| 6 | Interceptor, Validation, 예외 처리 | L06, S07~08 |
| 7 | multipart, 파일 저장·다운로드 경계 | L06, S10 |
| 8 | MyBatis 설정, 매퍼, 바인딩, resultMap, 동적 SQL | L07~08, S09 |
| 9 | Service 트랜잭션, 전파·rollback, 자기 호출 | L08 |
| 10 | REST·HTTP, JSON·오류 응답, CORS, Swagger/OpenAPI | L09, S11 |
| 11 | Security 구조, 인증·인가, 로그인·로그아웃, 사용자 정보 | L10~11 |
| 12 | JUnit·MockMvc, 로깅, Lombok, 검증과 디버깅 | L01·L03·L06, S02·S04 |
| 13 | 심화: resilience, API versioning, RestClient/HTTP Interface, Remember-Me | L08~09·L11 |
| 14 | 시험 직전 비교표와 프로젝트 구현 순서 | 전체 범위 재구성 |

위 표의 L/S ID에는 모두 `SPR-` 접두사를 붙인다. 각 Part는 핵심 설명 → 직접 만든 짧은 예제 → 비교·혼동 포인트 → 복습 질문 → 답과 근거 순서로 작성한다. DI 의존 관계, MVC 요청, 트랜잭션 프록시, Security 필터 체인은 직접 만든 도식으로 설명한다. 강의 이미지를 잘라 넣지 않는다.

`coverage-spring.json`은 개념별 자료 ID·절·PDF 쪽, 실제 `## Part ...` 제목, 문항 ID와 프로젝트 target ID를 연결한다. 문항용 coverage와 프로젝트용 coverage를 분리하여 `questionIds`에 프로젝트 ID를 넣지 않는다. 노트 전용 심화 항목은 `note-only`로 명시하고 필수 출제 태그에 섞지 않는다. 360px에서 코드와 표를 확인하며 화면을 맞추려고 한국어에 강제 줄바꿈을 넣지 않는다.

## 6. 월말평가 연습안

### 6-1. 형식 선택

| 방식 | 장점 | 한계 | 제안 |
| --- | --- | --- | --- |
| 기존 알고리즘처럼 구현 3·서술 1 | 기존 회차 구조 재사용 | 여러 파일과 설정·DB 연결을 제대로 연습하기 어려움 | 실제 안내가 이 형식이면 채택 |
| 통합 Spring 프로젝트와 3단계 작성 | Controller·Service·Mapper·설정을 연결하고 기존 편집기 재사용 | 로컬 실행 환경과 프로젝트 공통화 필요 | 권장 |
| 사이트에서 서버·DB 실행 및 자동 채점 | 즉시 피드백 | 서버 운영·실행 격리·인증 등 별도 서비스 설계 필요 | 이번 범위 제외 |

권장안을 선택하면 **Spring 월말 프로젝트는 문항이 아닌 구현 연습**으로 지침에 명시한다. 알고리즘 월평의 구현 3/서술 1과 backend 프로젝트 기준은 변경하지 않는다. Spring 공식 형식을 확인하기 전에는 실제 평가 재현이라고 표시하지 않는다.

### 6-2. 프로젝트 구성

1개를 먼저 끝까지 검증한 뒤 2개로 확장한다. 기본 120분, 90분·시간 제한 없음 선택은 기존 기능을 재사용하는 학습용 제안이다. 사이트에서는 점수·합격을 자동 판정하지 않는다.

| 프로젝트 | 새 예제와 작성 범위 | 검증할 핵심 동작 |
| --- | --- | --- |
| spring-web-01 | 스터디실 예약 관리. Boot MVC, JSP, 생성자 DI, Service, MyBatis 매퍼, 기본 CRUD·검증·예외 처리 | 요청 → Controller → Service → Mapper → DB → View 연결, 잘못된 입력·없는 ID·트랜잭션 실패 |
| spring-web-02 | 장비 대여 API. REST, JSON, MyBatis, SecurityFilterChain, 사용자별 권한과 오류 응답 | 익명·일반 사용자·관리자 접근, 소유권, 성공/오류 응답, 변경 도중 rollback |

기본 CRUD는 새 연습의 제안이지 기존 backend 과제의 UPDATE 제외 규칙을 변경한 것이 아니다. 과제 시간을 넘길 수 있는 파일 업로드, 외부 API 호출, Remember-Me는 별도 확장 체크리스트로 두고 기본 완료 조건에 섞지 않는다. 인증은 자료에 있는 세션·폼 로그인 구조를 먼저 사용하고 JWT 인증으로 임의 전환하지 않는다. REST 요청의 미인증·권한 부족 응답은 제공 설정으로 명확히 고정한다.

| 단계 | 제공 | 학습자가 작성 |
| --- | --- | --- |
| 1 | 실행 가능한 전체 구조와 주변 코드 | 빈칸과 짧은 구현 블록 |
| 2 | 메서드 시그니처, DTO, 설정, 화면 틀 | Controller·Service 본문, 매퍼 구문, JSP 동적 블록 |
| 3 | POM, 실행 설정, 스키마·데이터, DTO, 정적 화면과 대상 경로 | 지정한 구현 대상 파일 전체 |

단계마다 별도 응시를 만들고 이전 답안을 자동 복사하지 않는다. 두 프로젝트의 모든 단계를 동일한 작성 대상 계약으로 관리하되, Security 설정을 학습자가 작성하는 단계에서는 해당 블록을 제공 코드로 남기지 않는다. DB 비밀번호는 개인 환경 변수로 전달하고 제공 파일에는 자리표시자와 설정 방법만 넣는다.

원고는 프로젝트별 `_master/`를 단일 원본으로 하고 `scripts/author_spring_projects.py`가 `starter/`, `stages/1~3/`, `reference/`를 결정적으로 생성하도록 제안한다. `project.json`, `stages.json`, `checklist.json`, `requirements.md`, `flow.md`, `review.json` 계약은 기존 프로젝트 형식을 재사용한다. **공통화는 빌드·검사·화면부터 하고, Spring 생성기를 backend 생성기의 전면 재작성과 묶지 않는다.**

프로젝트별 검수는 컴파일·단위 테스트·DB 통합·JSP/HTTP·STS 수동 실행을 분리한다. 환경, reference hash, 검증 시점, 수행 주체, 실패 사례를 기록하고 코드가 바뀌면 실행 기록을 만료한다. STS 항목은 사용자가 직접 확인할 때까지 미검증이다. 자동 테스트 성공이나 모범답안 열람으로 이 항목을 완료시키지 않는다.

**공개 조건 제안:** Spring 프로젝트는 `compile`, `unit`, `dbIntegration`, `httpIntegration`이 모두 현재 reference hash·환경 hash에 대해 성공해야 한다. JSP가 있는 프로젝트는 `jspRender`도 필수이며 REST 전용 프로젝트만 JSP 파일이 없음을 확인한 후 `not-applicable`로 기록한다. `stsManual`은 별도 사용 환경 확인 항목이므로 자동 필수 검증을 모두 마치면 공개할 수 있지만 화면과 검수 기록에 `자동 검증 완료 · STS 미검증`을 표시한다. 이를 STS 실행 확인이나 모든 환경 검증 완료로 표현하지 않는다. 이 구분은 선택 전 제안이며 backend의 기존 검수 상태를 바꾸지 않는다.

`build_data.py`는 검수 중 원고를 로컬에서 만들 수 있지만, `validate_projects.py --track spring --release`와 `build_site.py`는 위 필수 검증이 누락·실패·만료된 Spring 프로젝트를 거부한다. CI에서도 배포 산출물 생성 전에 이 검사를 실행한다. 런타임 검증기는 실제 실행 결과를 보고서로 남기고 그 결과에 근거해 `review.json`을 갱신한다. 테스트하지 않고 성공 값을 채우지 않는다.

## 7. 구현 순서와 산출물

아래는 권장안 A를 선택했을 때의 순서다. 선행 리팩토링 R1~R4의 파일·호환성·검사는 [별도 문서](spring-refactoring.md)에 있다.

### S0. 공개 경계와 검증 환경 확정

파일: `.gitignore`, `AGENTS.md`, `docs/QUESTION_AUTHORING.md`, `docs/plans/source-publication.md`, 신규 `source/provenance.json`, `source/Spring/environment-spring.json`.

- [ ] R1 공개 출처 검사와 R2 배포·로컬 서버 경계를 먼저 완료한다.
- [ ] 2절의 버전 및 설명 보정 목록을 실제 환경과 대조한다. 출제 범위의 확정·심화·미검증을 구분한다.
- [ ] 과평 구성과 월말 프로젝트 예외를 지침에 명시한다. 공식 평가 시간은 확인되지 않으면 연습값이라고 표시한다.
- [ ] `git ls-files`, `git check-ignore`, 공개 출처 검사로 원본·개인 설정·OCR이 추적 또는 배포되지 않음을 확인한다.

### S1. 범위와 개념 노트 연결

신규: `source/Spring/scope-spring.json`, `coverage-spring.json`, `Spring개념 요약노트.md`, `tests/content/test_spring.py`. 변경: `scripts/build_data.py`, `scripts/validate_questions.py`, `tests/content/test_pipeline.py`.

- [ ] `TRACKS`에 `dir: Spring`을 등록하고 `NOTES`에 `spring-concepts`를 연결한다. 시험이 없을 때는 기존 노트 단독 진입을 활용한다. 모든 등록 트랙에 시험을 요구하는 기존 테스트는 명시적인 노트 단독 상태도 허용하도록 바꾸되, 기존 6개 시험 트랙의 원고 존재 검사는 유지한다.
- [ ] scope의 주제·배분·studyLinks와 노트 실제 제목을 맞춘다. R3의 트랙별 coverage 검사를 사용한다.
- [ ] 과평 32문항 합계, 다른 트랙 문항 오연결, 누락된 노트 절, 대소문자 다른 경로를 검사한다.
- [ ] `python -m unittest discover -s tests/content`와 `node --test tests/unit/study-links.test.js`로 기존 트랙 연결까지 확인한다. 트랙 수를 6개로 고정한 기존 테스트는 Spring 등록 시 함께 갱신한다.

### S2. 과평 1회 시범과 정답 검증

시범 위치: `private/spring/drafts/spring-01/`와 같은 폴더의 검수 기록. 공개 기준 충족 후 최종 위치: `source/Spring/spring-01/`, `spring-checks.json`, `spring-reviews.json`, `authoring-reviews.json`. 신규 도구: `scripts/verify_spring_answers.py`, `tests/spring-runtime/pom.xml` 및 실행 케이스.

- [ ] 32문항과 해설을 작성하고 정답을 가린 재풀이를 수행한다. 실행 케이스는 문항 ID·revision·환경 hash와 연결한다.
- [ ] DI/AOP 컨테이너, MockMvc 바인딩, MyBatis 결과, 트랜잭션 rollback, Security 접근을 각각 검사한다. 실행하지 못한 결과를 추정으로 통과시키지 않는다.
- [ ] `python scripts/verify_spring_answers.py --report reports/spring-verification.json`은 누락 케이스·오래된 revision·환경 불일치·실행 실패 시 종료 코드 1을 반환하도록 구현한다. 시범은 `--source-root <임시 원고 루트> --report private/spring/pilot-verification.json`을 지원하여 공개 data를 쓰지 않는다.
- [ ] 원고 빌드·스키마·편향 검사와 `mvn -f tests/spring-runtime/pom.xml verify`를 실행한다. 시범의 미충족 태그가 있으면 공개 등록을 보류하고 3회 완성 단계에서 해결한다.

### S3. 월말 공통화와 첫 프로젝트

선행: R4. 신규: `scripts/author_spring_projects.py`, `scripts/verify_spring_projects.py`, `source/Spring/projects/spring-web-01/`, `tests/content/test_spring_projects.py`, `tests/e2e/spring-project.spec.js`.

- [ ] 한 프로젝트에서 3단계, 파일 트리, 작성 대상, 힌트, 자기점검, ZIP 내려받기를 연결한다.
- [ ] `python scripts/author_spring_projects.py --check`로 생성물 일치를 검사하고 공통 프로젝트 검사기로 원고와 ZIP 경로·내용을 검증한다.
- [ ] 내려받은 모범답안을 실제 Spring·MySQL 환경에서 검증한다. `python scripts/verify_spring_projects.py --report reports/spring-project-verification.json`이 프로젝트별 필수 검증을 실행하며 환경 누락·실패는 종료 코드 1이다. 빈 템플릿은 완료 검사에 실패하고 정상 답안은 성공해야 한다.
- [ ] `python scripts/validate_projects.py --track spring --release`와 사이트 빌드에서 필수 검증 누락·실패·hash 만료를 차단한다. STS만 미검증인 경우의 공개 안내와 REST 전용 JSP 비해당 판정을 검사한다.
- [ ] backend 기존 URL·응시·백업을 열고 Spring과 번갈아 사용하여 섞이지 않음을 확인한다. Spring 프로젝트에 backend 실행 안내나 Servlet 전용 구조가 표시되지 않게 한다.

### S4. 나머지 콘텐츠와 사이트 검증

신규: `source/Spring/spring-02/`, `spring-03/`, `projects/spring-web-02/`, `tests/e2e/spring.spec.js`. 변경: Spring scope·coverage·검수 기록, `.github/workflows/check.yml`, `scripts/pr_body.py`, `README.md`.

- [ ] 과평 96문항과 프로젝트 2개 × 3단계를 완성하고 필수 태그 coverage를 확인한다.
- [ ] 360px·태블릿·데스크톱에서 노트 목차·오답 연결·코드·월말 파일 트리를 확인한다. 실제 STS와 모바일 입력 확인 여부를 별도로 기록한다.
- [ ] Spring runtime 전용 CI job에 DB 서비스와 고정 JDK를 추가한다. 실제 사용자 입력 코드를 CI에서 수집·실행하지 않고 작성한 검증 fixture와 모범답안만 사용한다.
- [ ] R5의 화면 파일 분리는 시범 결과에서 필요성이 확인된 부분만 수행한다. Spring을 추가했다는 이유만으로 모든 트랙 폴더를 이동하지 않는다.

## 8. 검토 중점과 완료 증거

| 위험 조건 | 담당 단계와 확인 기준 |
| --- | --- |
| 원본명·OCR·개인 환경이 공개 산출물에 섞임 | S0/R1/R2: 문서·원고·data·dist·ZIP과 CI 보고서 공개 검사 |
| 자료 버전 차이로 정답이 달라짐 | S0/S2: 실제 의존성 기록, 버전 의존 케이스 실행, 미검증 문항 차단 |
| backend 저장 기록이나 URL이 Spring으로 잘못 열림 | S3/R4: 옛 응시·백업 fixture, 직접 링크, 삭제된 프로젝트 snapshot 복구 |
| 모범답안이나 흐름 설명이 작성 전에 정답을 보여줌 | S3: 제공 파일·도식·힌트의 답안 누출 검사, 정답 열람 기록과 자기점검 분리 |
| 시범 1회만으로 전체 범위를 다뤘다고 표시 | S2/S4: 공개 scope 태그와 실제 문항·노트 연결 대조, 3회 합계 검사 |

실제 구현 완료 시 README·기존 CI의 전체 검증에 Spring 검사를 추가해 실행한다. 필수 명령은 `build_data.py`, `validate_questions.py`, `audit_bias.py --strict --report reports/bias.json`, 기존 트랙별 정답 검사, `verify_spring_answers.py`, `verify_spring_projects.py`, 기존 및 Spring 프로젝트 생성 `--check`, 공통 프로젝트 검사와 Spring `--release` 검사, Python 콘텐츠 검사, `npm test`, `build_site.py`, dist 대상 E2E, 공개 출처 검사다. 신규 명령은 현재 존재하거나 실행한 것으로 오해하지 않도록 해당 단계에서 구현한다.

PowerShell의 E2E는 `$env:SITE_DIR='dist'` 설정 후 `npm.cmd run test:e2e`로 실행한다. 프로젝트 변경 시에는 모범답안 POM의 `verify`와 실제 HTTP·DB·JSP 검증도 완료 증거에 포함한다. 검사 실패나 미검토 경고가 있으면 배포하지 않는다.

보고 항목은 변경 파일, 실행 명령과 결과, 96문항/21·9·2 구성, 정답 분포·최대 연속·길이 검토, 실행/재풀이 구분, 자료 보정, 프로젝트 검증 단계, 기존 기록 호환성이다. 이번 계획서 작성만으로 이러한 구현 검증을 완료했다고 표시하지 않는다.

## 9. 선택이 필요한 사항

1. **작업 순서:** 필수 선행 리팩토링 후 시범 제작하는 A안 권장. B·C안과 비용은 [리팩토링 선택지](spring-refactoring.md)에 있다.
2. **월말 형식:** 통합 프로젝트 2개 × 3단계를 제안한다. 실제 안내가 구현 3·서술 1이면 월말 부분을 그 형식으로 다시 설계한다.
3. **환경:** 수업 POM이 확인되면 그 조합을 우선한다. 확보 전에는 노트·버전 비의존 개념 정리를 진행할 수 있지만 실행 의존 문항의 정답 확정은 보류한다.

초안을 검토한 뒤 선택한 범위에 맞춰 후속 구현을 시작한다. 현재는 위 선택을 사용자 확정 사항으로 기록하지 않는다.
