# 백엔드 · DB 모의고사 및 기능 구현 계획안

> 실행 지침: 이 계획을 실제로 구현할 때는 `superpowers:executing-plans`를 적용해 단계별로 진행한다. 이번 요청의 산출물은 DB 요약노트와 계획안이다. 제품 코드, 시험 문항, 배포는 후속 작업이다. 커밋은 사용자 요청이 있을 때만 한다.

**목표:** 백엔드와 DB를 함께 보는 과목평가를 연습하고, 필요한 주제와 개념 노트로 복습하며, 객관식에서 지우개로 후보를 표시한다.

**구조:** 기존 정적 사이트와 브라우저 저장 구조를 유지한다. SQLD는 별도 `sqld` 트랙으로 구성하며 [SQLD 계획](sqld.md)을 따른다. `backend` 트랙 하나를 `백엔드 · DB`로 표시하고 통합 시험과 주제별 연습, 백엔드·DB 노트 두 개를 연결하는 방식을 권장한다.

**기술:** 현재의 Python 원고 빌드, JavaScript 모듈, CSS, Node 단위 검사, Playwright를 사용한다. SQL 정답 검증은 별도의 MySQL 환경에서 수행한다.

**설계 명세:** 이 문서의 1~7절과 추가 범위를 정리한 12~13절. 실행 순서는 8절이며 SQLD는 별도 계획을 따른다.

작성일: 2026-11-03. 상태: 모의고사 구성은 사용자 확정. 미확인 컨테이너와 공식 월말 세부 조건은 별도 표시한다.

## 1. 평가 안내와 기존 계획의 적합성

평가 안내 `BE-ASSESS-01`을 직접 확인했다. 아래 시간과 유형은 Java전공 기준이다. 21/9/2는 안내 이미지에 적힌 수치가 아니라 사용자가 확인한 과목평가 구성이다.

| 요구사항 | 근거와 판단 | 계획에 반영할 동작 |
| --- | --- | --- |
| 백엔드·DB 통합 과평 | 안내와 일치 | `backend` 트랙의 통합 32문항 유지 |
| 객관식·주관식·서술형 | 안내 및 사용자 확인과 일치 | 객관식 21, 단답 9, 서술 2 |
| 과평 60분 | 2026-11-09 09:00~10:00으로 확인 | 실전 모드 60분 고정, 학습 모드만 시간 선택 |
| 월말 Web 파일 제출형 | 2026-11-09 10:00~12:00, 120분 | 제공 MVC 프로젝트의 빈칸을 완성하는 별도 프로젝트 연습 |
| 과평 제출 후 재제출 불가 | 안내 확인 | 최종 제출 뒤 답안 잠금, 새 연습 응시는 별도 기록 |
| 코드 편집 도구 | 과평 사용 불가, 월말 지정 도구 사용 가능 | 과평에 실행기 제공 안 함. 월말은 로컬 IDE에서 작성 |
| 제공 자료 외 열람 불가 | 안내 확인 | 실전 응시 화면에서 노트·해설 진입 숨김. 학습·복습에서는 링크 제공 |
| 파일 미제출 또는 오제출 | 안내상 0점 처리 | 월말 연습에서 산출물과 경로를 확인하고 압축 해제 결과와 제출 누락 상태 표시 |
| 재평가 | 이번 과평 가능, 월말 불가 | 실제 평가 운영 정보로만 안내. 학습용 재응시를 제한하지 않음 |

기존 계획의 통합 과평 구성은 요구와 맞는다. 다만 시간 미확정, 월말 자료 대기, 월말 구현 3·서술 1을 그대로 적용하려던 부분은 수정한다. 기존 알고리즘 월평의 3/1 규칙은 유지하고, 백엔드 Web 프로젝트는 별도 형식으로 설계한다. 실제 월말의 과제 수와 세부 배점은 자료에 없으므로 **통합 프로젝트 1개와 아래 rubric은 연습용 제안**이다.

사이트는 학습 도구다. 실전 모드의 링크 숨김은 다른 탭·직접 URL·외부 프로그램을 차단하는 감독 기능이 아니다. 실제 DRM 설치, 지정 PC와 좌석, Quest 제출은 기관 안내를 따른다. 실전 중 제공할 수 있는 자료는 모의 과제의 기본 코드와 명시된 설명으로 한정한다.

과목 비중과 3회 제작은 사용자가 현재 계획대로 진행하도록 확정했다. 이는 학습용 배분이며 공식 출제 비율을 뜻하지 않는다. 지우개는 ON/OFF 가능한 공통 기능으로 유지한다. 월말 원고 제작은 자료 검토가 끝난 상태에서 사용자의 후속 구현 지시에 따라 진행한다.

## 2. 자료와 현재 구현 확인

### 2-1. 확인한 자료와 비공개 출처 관리

`source/DB/`의 PDF 16개, 총 618쪽을 검토 대상으로 삼았다. 00~08 교재 9권은 기본 SQL과 JDBC의 범위를 제공한다. Day01~Day07 자료 7권은 같은 내용을 보충하며 트랜잭션과 인덱스를 별도로 다룬다. 두 묶음에서 같은 개념이 나온다고 시험 비중을 중복 가산하지 않는다.

| 자료 ID | 쪽수 | 노트에서 다룰 범위 |
| --- | ---: | --- |
| `DB-L01` | 45 | DBMS와 관계형 모델, MySQL 환경 |
| `DB-L02` | 39 | 조회, 조건, NULL, 정렬과 제한 |
| `DB-L03` | 43 | 단일 행 함수, 집계, 그룹화 |
| `DB-L04` | 37 | 내부·외부 조인, 자기 조인, 집합 연산 |
| `DB-L05` | 43 | 스칼라·다중 행·상관 서브쿼리 |
| `DB-L06` | 44 | 자료형, 테이블, 제약조건 |
| `DB-L07` | 33 | 데이터 변경, 트랜잭션 제어 |
| `DB-L08` | 50 | 모델링, 키, 관계, 정규화 |
| `DB-L09` | 45 | JDBC, 자원 관리, DAO와 트랜잭션 |
| `DB-D01` | 40 | 조회와 기본 함수 |
| `DB-D02` | 22 | 함수, 집계, 데이터 변경 |
| `DB-D03` | 46 | DDL과 조인 |
| `DB-D04` | 36 | 서브쿼리와 관련 객체 |
| `DB-D05` | 24 | ACID, 격리 수준, 동시성 |
| `DB-D06` | 22 | 인덱스 구조와 설계 |
| `DB-D07` | 49 | ERD, 정규화, 설계 과정 |

위 16권 618쪽에 더해 SQLD 자료 `SQLD-A`, `SQLD-B`와 연결 그림 16개를 확인했다. 그림에는 식별 관계와 스키마 독립성뿐 아니라 관계 차수와 선택성도 있다. 계층 질의와 절차형 SQL, 접근 경로 비교 그림도 검토했다. 구판 내용을 모두 현재 SQLD 범위로 취급하지 않는다. 세부 채택 기준은 [SQLD 계획](sqld.md)에 둔다.

백엔드 자료는 기존 개념 노트와 `BE-CLASS-01`, 추가 범위 `BE-SCOPE-01`, 평가 안내 `BE-ASSESS-01`을 대조했다. 실습 묶음 `BE-LAB`은 10차수의 실습 80개와 과제 20개다. 요구사항 이미지 100개를 OCR로 검토하고 관련 Java 및 JSP 코드와 SQL 및 설정 파일을 대조했다. OCR이 불명확한 문구를 출제 근거로 확정하지 않으며 실제 문항 작성 시 해당 원본을 다시 확인한다. 모든 프로젝트를 실행하거나 정답 검수한 것은 아니다.

| 자료 묶음 | 확인한 요구 | 학습·출제에 반영 |
| --- | --- | --- |
| `BE-LAB-01` | Servlet 요청 인자와 DTO, URL 매핑과 생명주기, Front Controller | 인코딩과 요청 처리 순서, 공유 필드의 동시성 |
| `BE-LAB-02` | JSP 결과 출력, request 전달, forward/redirect, 선언과 지시자 | 두 이동 방식의 요청 수·URL·속성 비교 |
| `BE-LAB-03` | 로그인, 세션, 쿠키, 사용자별 상태, 로그아웃 | 세션 인증과 아이디 저장 쿠키의 역할 분리 |
| `BE-LAB-04` | EL/JSTL로 화면 변환, scope와 조건·반복, 공통 화면 분리 | scope 탐색과 JSTL 조건/반복 태그, include |
| `BE-LAB-05` | 조건 조회와 문자열, 정렬과 중복 제거, 상위 행 | NULL과 LIMIT, CONCAT과 정렬의 경계 사례 |
| `BE-LAB-06` | 집계, 그룹별 건수·평균, 날짜·수치 함수 | WHERE/HAVING, COUNT와 NULL, 그룹화 단위 |
| `BE-LAB-07` | 스키마 변경과 제약 위반, DML 및 ROLLBACK | PK/FK와 제약 삭제, DDL 커밋과 저장점 |
| `BE-LAB-08` | 다중 테이블 조회, 상관/다중 행 서브쿼리, 집계 결합 | JOIN 결과 건수, EXISTS, 스칼라 서브쿼리 |
| `BE-LAB-09` | 요구에서 엔터티·관계 도출, 반복 데이터 분리, 정규화 | 함수 종속으로 1~3정규형 판별, 키·관계 근거 서술 |
| `BE-LAB-10` | DBUtil과 DAO, MVC와 오류 페이지, 사용자별 데이터 | JDBC 빈칸과 자원 관리, 404/500 및 통합 Web 연습 |

위 ID의 HW/WS와 세부 번호별 파일 대응은 `private/backend-db/source-index.json`에만 둔다. 원본과 OCR을 재배포하지 않는다. 수업의 문구와 화면뿐 아니라 데이터와 정답 코드도 그대로 옮기지 않는다. 공개 문서는 [출처 공개 방안](source-publication.md)을 따른다. 외부 실습 폴더는 읽기만 했으며 프로젝트 원본을 저장소로 옮기지 않는다.

실습 POM의 대표 구성은 Java 25와 Jakarta Servlet 6.1, JSTL API 3.0.2 및 구현 3.0.1, MySQL Connector/J 8.4.0이었다. 이는 수업 프로젝트 관찰값이다. Connector 버전으로 DB 서버 버전을 단정하지 않는다. 신규 실습의 JDK와 컨테이너 및 DB 서버 실제 버전은 실행 단계에서 기록한다. Spring과 JPA, command 패턴 신규 작성은 이번 월말 필수 범위에 넣지 않는다.

### 실행 환경 확인 상태

| 항목 | 기준과 확인 상태 |
| --- | --- |
| MySQL 서버 | 사용자 확정 8.4.0. 실행 검증 시 `SELECT VERSION();` 결과 기록 |
| JDK | 사용자 제공 OpenJDK HotSpot 25.0.3+9 Windows x64. 실제 실행 JDK 일치 여부 확인 예정 |
| Servlet API | 대표 실습 POM에서 Jakarta Servlet API 6.1.0, provided 확인 |
| 실행 컨테이너 | 제품명과 패치 버전 미확인. Tomcat이면 11.0.x가 Servlet 6.1 대응 계열 |

Eclipse 사용 시 Servers 뷰의 실제 연결 서버와 설정된 Runtime Environment에서 제품과 버전을 확인한다. 서버 시작 로그의 `Server version` 또는 Tomcat 설치 폴더의 `bin/version.bat` 출력으로 정확한 버전을 기록한다. 프로젝트의 Dynamic Web Module 설정만으로 실행 서버 버전을 확정하지 않는다. [Tomcat 공식 버전 대응표](https://tomcat.apache.org/whichversion.html)를 참고한다.

### 2-2. 재사용할 코드

| 파일 | 확인한 현재 동작 | 구현 시 조치 |
| --- | --- | --- |
| `scripts/build_data.py` | `TRACKS`에는 backend가 없고 `NOTES`에는 backend 노트가 있음 | backend 범위를 등록하고 DB 노트를 추가 |
| `assets/app.js` | 시험이 없는 노트는 홈 카드, 시험이 있는 트랙 노트는 `noteButtons()`로 표시 | 기존 전환 동작 재사용. 두 노트 모두 같은 트랙에 연결 |
| `assets/quiz.js` | `topicExam()`은 같은 트랙의 객관식 중심 회차에서 주제를 모음 | 통합 문항의 대주제별 연습에 재사용 |
| `assets/attempt.js` | 응시 스냅샷과 `choiceOrders`를 보관 | 지우개 상태를 응시별로 추가 |
| `assets/storage.js` | 브라우저에 응시 저장, 내보내기와 가져오기 지원 | 신규 필드의 검사와 구버전 기본값 추가 |
| `assets/quiz.js`의 `renderAnswer()` | 한 `label` 안에 라디오와 선택지 텍스트가 있음 | 지우개 버튼은 label 바깥의 형제 요소로 배치 |
| `assets/note.js`, `assets/note-render.js` | `note` ID로 노트를 열고 Part 목차와 `답 보기`를 렌더링 | 기존 형식 유지. DB 노트도 같은 렌더러 사용 |

현재 backend 노트 URL인 `pages/concepts.html?note=backend-concepts`는 유지한다. DB 노트는 등록 후 `pages/concepts.html?note=db-concepts`로 연다. 현재 AI의 노트 버튼은 트랙 단위 연결이며, 세부 주제마다 자동으로 절에 연결되는 구조는 아니다.

## 3. 시험을 합칠지 나눌지

| 방식 | 장점 | 비용·제약 | 판단 |
| --- | --- | --- | --- |
| 백엔드와 DB를 독립 트랙·시험으로 분리 | 과목별 진도와 노트가 명확 | 실제 통합 시험 연습과 JDBC 연결 문항 처리가 따로 필요 | 대안 |
| 통합 트랙·시험 + 주제별 연습 + 노트 2개 | 실제 응시와 맞고 기존 필터·노트 구조 재사용 | 과목별 개별 시험 성적은 만들지 않음 | 권장 |
| 독립 트랙 2개 + 통합 시험 트랙 | 분리 연습과 실전 모두 가능 | 문항 중복, 회차·진도 관리, 혼합 출제 검증이 복잡 | 초기 범위에서 제외 |

권장안의 내부 ID는 기존 노트와 맞춰 `backend`를 유지하고 화면 이름만 `백엔드 · DB`로 한다. `source/backend/scope-backend.json`을 통합 출제 범위의 단일 원본으로 둔다. DB 원자료와 요약노트는 `source/DB/`에 유지한다. 폴더 위치와 UI 트랙은 같을 필요가 없다.

화면 흐름은 홈의 `백엔드 · DB` 선택 → `Backend 개념`·`DB 개념` 버튼 → 통합 과평 회차 → 주제별 연습이다. 두 노트는 AI와 같은 위치에 함께 표시한다. 문항에는 대주제 하나만 지정하고 JDBC를 두 과목에 복제하지 않는다.

사용자가 분리안을 선택하면 `backend`와 `db`를 각각 등록하고 노트의 `track`도 각각 맞춘다. backend 노트는 이미 준비된 전환 로직을 그대로 쓰며 DB에도 같은 방식을 적용한다. 이때 통합 응시를 제공할지 먼저 정하고, 시험 두 개를 단순히 연결해 64문항으로 만드는 것을 기본값으로 삼지 않는다. 이 대안은 현재 권장안과 동시에 구현하지 않는다.

## 4. 과목평가 출제안

### 4-1. 회차 구성

1회차를 먼저 완성하고 검증한 뒤 2·3회차를 만든다. 모든 회차는 `kind: subject`, `track: backend`, 총 32문항이다. 아래는 사용자가 확정한 학습용 배분이며 실제 출제 비율이 아니다.

| 영역 | 객관식 | 단답 | 서술 | 합계 |
| --- | ---: | ---: | ---: | ---: |
| 백엔드 | 9 | 4 | 1 | 14 |
| DB | 10 | 4 | 1 | 15 |
| JDBC 연결 영역 | 2 | 1 | 0 | 3 |
| 합계 | 21 | 9 | 2 | 32 |

| 대주제 ID | 학습 범위 | 객관식 | 단답 | 서술 |
| --- | --- | ---: | ---: | ---: |
| `web-servlet` | WAS, 요청·응답, 생명주기, 경로와 인코딩 | 3 | 1 | 0 |
| `mvc-filter` | Front Controller, Filter, 요청 공유와 동시성 | 2 | 1 | 1 |
| `jsp-el` | JSP, scope, EL·JSTL, forward와 redirect, PRG | 2 | 1 | 0 |
| `state-session` | Cookie, Session, 로그인과 로그아웃 | 2 | 1 | 0 |
| `sql-select` | 관계형 기초, 조건, NULL, 함수와 집계 | 3 | 1 | 0 |
| `sql-join-subquery` | 조인, 집합 연산, 서브쿼리와 뷰 | 3 | 1 | 0 |
| `db-schema` | DDL·DML, 제약조건, 모델링과 정규화 | 2 | 1 | 1 |
| `db-tx-index` | 트랜잭션, 격리 수준, 인덱스 | 2 | 1 | 0 |
| `jdbc` | JDBC, DAO, 바인딩, 연결과 트랜잭션 경계 | 2 | 1 | 0 |

같은 대주제여도 한 회차 안에서 같은 사실을 객관식과 단답으로 반복하지 않는다. 서술 주제는 회차별로 이동할 수 있지만 영역 합계와 21/9/2는 유지한다. 기존 검증기는 `groups`에 지정한 모든 문항 유형을 검사한다. 이 계획에서는 `groups`에 mc·short만 고정하고, 서술은 대주제를 옮길 수 있도록 영역별 합계로 별도 검사한다. 

scope의 `topicAreas`는 앞의 4개 주제를 backend, 다음 4개를 db, jdbc를 integration에 대응한다. `areaComposition.subject`는 4-1절 영역별 배분을 mc/short/essay/code 키로 저장한다. backend는 9/4/1/0, db는 10/4/1/0, integration은 2/1/0/0이다. 검증기는 각 회차에서 이 매핑으로 실제 합계를 계산해 비교한다. 표의 서술 대주제는 확정한 1회차 기준이며 2·3회차에는 영역 합계를 유지하며 이동할 수 있다.

- 1회차: 요청 흐름과 SQL 기본 해석. 단순 암기보다 조건을 보고 결과를 설명한다.
- 2회차: NULL, 외부 조인, scope, 세션, 트랜잭션 경계 등 오류 원인을 찾는다.
- 3회차: 회원·게시글 같은 새 상황에서 백엔드와 DB를 연결한다. 숫자만 바꾼 재출제는 하지 않는다.

JDBC 문항은 DB 노트 Part 10을 기본 근거로 두고 백엔드 MVC 문맥을 연결한다. SQL 전체 문장을 문자열 일치로 자동 채점하지 않는다. 단답은 용어·결과값·명확한 빈칸에 사용하고, 여러 동치 쿼리가 가능한 답은 서술형의 기준별 자기채점으로 처리한다.

### 4-2. 정답 검수와 범위 관리

- 범위 JSON은 주제용 `topics`와 `tags`, 배분용 `groups`와 `composition.subject`를 갖는다. 영역별 배분은 `topicAreas`와 `areaComposition.subject`에, 출처는 `sources`에 둔다. 문항의 `topics`는 `[group]` 하나이고 세부 개념은 `tags`에 둔다.
- 문항 ID는 `backend-01-q01`처럼 회차와 연동한다. 수정 시 revision을 올리고 `choiceId`로 정답·오답 해설을 연결한다.
- `sourceRefs`는 공개 자료 ID와 절 및 PDF 기준 쪽을 기록하는 정책으로 전환한다. 원본 파일명과 경로 및 해시는 비공개 대응표에 둔다. 신규 문항 작성 전에 AGENTS.md와 출제 지침을 함께 갱신한다. [출처 공개 방안](source-publication.md)을 따른다.
- MySQL 서버는 사용자 확인값 8.4.0으로 고정한다. InnoDB와 utf8mb4를 사용하며 시간대와 collation을 기록한다. `sql_mode`와 격리 수준 및 autocommit 값도 검증 기록에 저장한다. 구현 착수 시 `SELECT VERSION();`으로 실행 환경이 기준과 같은지 확인하고 검증 실행 파일 또는 이미지의 해시를 기록한다.
- SQL 출력은 같은 조건의 MySQL에서 실행한다. SQLite 통과로 MySQL 정답 검증을 대체하지 않는다. `ORDER BY`가 없으면 행 순서가 아닌 행의 중복까지 포함한 집합으로 비교한다.
- NULL, 중복값, 빈 결과, 외부 조인의 미매칭 행을 포함한다. 동시성 문항은 두 연결의 실행 순서와 관측 시점을 명시하고 임의 sleep 대신 명시적 동기화를 쓴다.
- 인덱스는 항상 빨라진다고 출제하지 않는다. 성능 수치와 실행 계획은 데이터·통계·버전의 영향을 받으므로 구조와 적용 조건을 중심으로 묻는다.
- JDK는 사용자 제공값 `OpenJDK25U-jdk_x64_windows_hotspot_25.0.3_9`를 기준으로 한다. `java -version`과 `mvn -version`으로 실제 실행 JDK가 25.0.3+9인지 확인한다. Servlet API는 실습 POM의 Jakarta Servlet 6.1.0을 기준으로 하고 실제 컨테이너 제품과 패치 버전은 추가 확인한다. JDBC 출력은 이 Java와 DB 연결 환경에서 검증한다.
- 실행 문항은 `backend-checks.json`, 개념 재풀이 기록은 `backend-reviews.json`, 길이 편향 검토는 `authoring-reviews.json`으로 나눈다. ID와 revision을 연결하고 검증 방법과 기대값을 남긴다. 검토일과 실제 검토 주체도 적는다.
- 객관식 21개는 번호별 4~7개, 3회 63개는 14~18개를 지킨다. 같은 번호 3연속, ABABAB, 길이 3~4 블록 반복은 금지한다. 주제별 연습도 일반 N 규칙으로 검사한다.
- 길이 비율과 최장·최단 편향은 `QUESTION_AUTHORING.md`를 그대로 따른다. 미검토 경고를 허용하거나 번호만 섞어 해결했다고 처리하지 않는다.

## 5. DB 요약노트

원고는 `source/DB/DB개념 요약노트.md`이다. 기초부터 조회와 집계, 조인과 서브쿼리를 읽는다. DDL과 DML 이후에는 트랜잭션, 인덱스, 모델링을 정리하고 JDBC와 시험 직전 점검으로 마무리한다.

각 Part에는 핵심 설명과 비교표, 필요한 짧은 예제, 혼동 포인트, 복습 질문과 접을 수 있는 `답:`을 둔다. 강의의 문장을 옮기는 대신 개념을 다시 설명하고 예제 이름과 수치는 새로 만든다. SQL 방언 차이와 일반 격리 수준 설명의 전제는 분리한다.

구현할 때 `NOTES`에 `("db-concepts", "DB 개념", "DB/DB개념 요약노트.md", "backend")`를 추가한다. `build_data.py`가 `data/db-concepts.md`를 생성한다. 노트만 먼저 공개하면 기존 backend 노트처럼 독립 카드가 되며, backend 시험 추가 후 두 카드가 통합 트랙 내부 노트 버튼으로 전환된다. 이번에는 원고만 작성하며 사이트 등록은 후속 단계다.

## 6. 선택지 지우개 동작 명세

### 6-1. 기본 동작

전 트랙의 객관식에 공통 적용한다. 시험 모드, 한 문제씩 확인하는 학습 모드, 주제별 연습에 적용하고 단답·서술·구현에는 표시하지 않는다. 첫 사용 기본값은 사용자 지시에 따라 ON으로 확정한다. 선지별 우측 지우개 아이콘 버튼을 누를 때마다 지움과 복원을 토글한다.

| 행동·상태 | 동작 |
| --- | --- |
| ON | 풀이 도구의 `선택지 지우개`가 켜지고 각 선지 우측에 토글용 지우개 아이콘 버튼 표시 |
| 미선택 선지 지우기 | 선지 텍스트에 취소선과 회색 표시. 실제 라디오 선택은 바꾸지 않음 |
| 같은 버튼 다시 누르기 | 지움 표시 해제 |
| 이미 답으로 선택한 선지 | 지우개를 누르면 그 선지를 지우고 답 선택도 함께 해제. 선택한 선지를 다시 누르거나 선택 상태에서 Space를 눌러도 선택만 해제 |
| 지운 선지를 답으로 선택 | 지움 상태를 먼저 해제하고 해당 choiceId를 답으로 저장 |
| OFF | 버튼과 지움 스타일을 숨김. 저장된 지움 목록은 유지하고 다시 ON이면 복원 |
| 해설 공개 또는 제출·시간 종료 | 해당 문항 지우개 편집 잠금. 정답과 오답 색 및 해설을 우선하고 취소선과 회색은 숨김 |
| 새로고침·이어서 풀기 | 같은 응시에서 ON/OFF와 지운 choiceId 복원 |
| 새 응시·선지를 섞어 다시 풀기 | 지운 목록은 빈 값. ON/OFF는 브라우저의 최근 설정으로 초기화 |
| 전체 선지 지우기 | 미선택 선지 4개를 모두 표시할 수 있음. 답안 제출이나 자동 채점으로 해석하지 않음 |

시각적 표시만 제공하며 선지를 제거하거나 텍스트를 흐려 읽을 수 없게 하지 않는다. 버튼은 라디오의 `label` 바깥에 두어 버튼 클릭이 답 선택으로 전달되지 않게 한다. 번호와 본문은 기존처럼 클릭해 답을 고를 수 있다.

### 6-2. 상태 계약

응시 객체에 선택적 필드를 추가한다. 화면 번호나 배열 위치를 저장 키로 사용하지 않는다.

```json
{
  "eraserEnabled": true,
  "eliminatedChoices": {
    "backend-01-q01": ["choice-b", "choice-d"]
  }
}
```

- `eraserEnabled`: 현재 응시의 도구 상태. 구버전 응시에 필드가 없으면 최근 브라우저 설정을 적용하고 저장된 설정도 없으면 true. 명시적으로 저장된 false는 유지한다.
- `eliminatedChoices`: `questionId -> choiceId[]`. 구버전은 빈 객체. 응시 스냅샷의 객관식과 선택지에 속하는 ID만 허용한다.
- 최근 ON/OFF는 `study-space:choice-eraser`에 저장한다. 이어서 풀기는 응시 자체 값을 우선한다. 저장이 막혀도 현재 화면의 조작은 가능하고 기존 저장 실패 안내를 따른다.
- `createAttempt()`는 새 응시용 빈 목록을 만든다. 기존 `choiceOrders`와 지움 상태는 독립이므로 선지 순서가 바뀌어도 choiceId에 붙는다.
- 채점 함수는 이 상태를 읽지 않는다. 정답 수, 미응답 수, 자기채점, 타이머에 영향이 없어야 한다.
- 가져오기에서 필드가 있으면 타입을 검사한다. 배열 중복은 정규화하고 스냅샷에 없는 문항·선지와 이미 선택된 답에 붙은 지움 표시는 제거한다. 비정상 필드 타입은 가져오기 전에 전체 검증 오류로 반환하고 현재 저장 데이터는 유지한다.
- `__proto__`, `constructor`, `prototype` 같은 객체 키를 가져오기로 주입할 수 없도록 차단한다. 크기는 스냅샷 문항 수와 문항당 4개 ID 이내로 제한한다.
- 기존 저장 포맷 version 1의 선택적 확장으로 처리하고 구버전 백업을 계속 읽는다. 신규 상태는 기존 전체 응시 내보내기에 포함한다. 이전 사이트 버전에서 신규 상태 보존까지 보장하지는 않는다.
- 콘텐츠가 바뀌면 현재처럼 당시 스냅샷을 이용해 복습한다. 다른 응시나 최신 revision에 예전 지움 목록을 전파하지 않는다.

### 6-3. 접근성과 표시

- 전체 토글은 `aria-pressed`와 ON/OFF 상태를 제공한다. 선지 버튼의 이름은 `2번 선택지 지우기` 또는 `2번 선택지 복원`이며 표시 순서에 맞게 갱신한다.
- 각 버튼은 Tab으로 이동하고 Enter·Space로 조작한다. 라디오의 키보드 이동을 방해하지 않는다.
- 토글 후 전체 재렌더링을 하더라도 조작한 버튼으로 포커스를 복원한다. 지움 상태는 보조기술에서도 알 수 있도록 `aria-pressed` 또는 설명 텍스트로 제공한다.
- 취소선과 회색 외에 `지움` 상태 설명을 제공한다. 라이트·다크에서 본문을 읽을 수 있는 대비를 유지한다.
- 우측 버튼은 최소 44×44px 영역을 확보한다. 긴 SQL·수식·여러 줄 선지에서 줄바꿈과 버튼이 겹치지 않도록 본문과 버튼을 별도 열로 배치한다.
- 360px과 데스크톱에서 선택지, 번호, 포커스 테두리, 코드가 화면 밖으로 잘리지 않는지 확인한다.

## 7. 공통 제약과 검토 중점

**공통 제약**

- 새 과평은 21/9/2, 실전 60분. 월말은 Web 파일 제출형 120분이며 구현 시작은 후속 요청 이후다.
- 문제와 해설은 `docs/QUESTION_AUTHORING.md`를 따른다. 원본 PDF와 실습 원본은 커밋하지 않는다.
- `data/`는 직접 수정하지 않고 원고로 재생성한다. 기존 ID와 저장된 답안의 의미를 보존한다.
- 한국어 UTF-8, 불필요한 강제 줄바꿈 금지. Java는 4칸 들여쓰기와 중괄호를 사용한다.
- 계정, 서버 저장, 사이트용 실제 DB 도입은 이 계획의 범위가 아니다. SQL 검증용 DB는 개발 도구다.
- 커밋·push·PR은 요청 없이 하지 않는다. 문서의 체크박스는 실제 증거가 있을 때만 완료 표시한다.

**검토 중점**

1. 오래된 백업과 손상된 신규 상태: 기존 응시 복원은 유지하고 잘못된 가져오기는 현재 기록을 바꾸지 않는다. 단계 4에서 검사한다.
2. 선택한 답·지운 답 충돌: 선택한 선지를 지우면 답도 함께 해제하고 다른 선지를 지워도 답은 그대로이며 지운 답 선택 시 표시를 해제한다. 단계 4·5에서 검사한다.
3. 선지 재배치·revision 변경: choiceId와 스냅샷 기준으로 표시하고 새 응시에 복사하지 않는다. 단계 4에서 검사한다.
4. 긴 SQL과 키보드 사용: 우측 버튼이 본문·포커스·라디오 키 이동을 방해하지 않는다. 단계 5에서 검사한다.
5. DB 환경 차이: NULL, 격리 수준, DDL 커밋, 결과 순서를 고정된 MySQL에서 검증한다. 단계 3에서 검사한다.

## 8. 실행 순서와 완료 조건

### 단계 1. 공개 범위 확정과 노트 연결

파일: `source/backend/scope-backend.json` 신규. `scripts/build_data.py`의 `TRACKS`와 `NOTES`를 수정하고 `scripts/validate_questions.py`에 영역 합계 검증을 추가한다. `docs/QUESTION_AUTHORING.md`와 `AGENTS.md`, `README.md`도 갱신한다. 노트 원고는 이번 작성본을 사용한다.

입력: 이 문서 4절의 주제·배분, DB 노트, 기존 backend 노트. 출력: `backend` 범위, 두 노트의 manifest 항목, 생성된 `data/db-concepts.md`.

- [x] 통합 트랙과 학습용 배분 및 총 3회 제작을 사용자 지시로 확정했다. 원고 제작은 별도 구현 작업이다.
- [x] `tests/content/test_pipeline.py`에 통합 트랙 탐색, 21/9/2, 주제·태그 범위 검사 사례를 추가하고 실패를 확인한다.
- [x] scope와 레지스트리, 출제 지침을 연결하고 빌드한다. 태그 coverage는 시범 1회가 담을 현실적인 범위로 정한다.
- [x] 새 노트 등록 전후의 기존 데이터가 뜻하지 않게 변하지 않았는지 diff를 확인한다.
- [x] `python -m unittest discover -s tests/content`와 원고 검증이 통과해야 한다.

### 단계 2. 시범 과목평가와 홈 화면 연결

파일: `source/backend/backend-01/{exam.json,questions.md,solutions.md}` 신규. `assets/app.js`는 필요한 문구만 조정한다. `tests/unit/features.test.js`, `tests/e2e/backend.spec.js`에 검사 추가.

입력: 단계 1의 scope와 노트. 출력: `backend-01`, 통합 트랙 버튼, 같은 트랙의 노트 2개, 9개 주제별 연습 진입점.

- [x] 32문항과 각 오답 근거, 단답 허용 표기, 서술 rubric을 작성한다.
- [x] 홈에서 backend 선택 시 두 노트가 보이고 다른 트랙에서는 보이지 않는 검사, 기존 노트 URL 유지 검사부터 추가한다.
- [ ] 시험이 생기기 전의 노트 카드와 생성 후의 노트 버튼 전환을 확인한다. 빈 시험 카드를 만들지 않는다.
- [x] 각 주제 연습이 backend의 해당 group만 모으고 다른 트랙의 같은 이름 주제를 섞지 않는지 검사한다.
- [x] `practiceMinutes: 60`을 지정한다. 실전 시작에서 URL의 minutes 조작과 카드 시간 변경을 무시하고 60분을 적용하는 검사를 추가한다. `assets/quiz.js`의 모드 전환으로 학습 모드에 들어가면 실전 기록으로 집계하지 않는다. 기존 다른 트랙의 시간 선택은 유지한다.
- [x] `python scripts/build_data.py`, `python scripts/validate_questions.py`, `npm test`, `npx playwright test tests/e2e/backend.spec.js`가 통과해야 한다.

### 단계 3. DB·백엔드 정답 검증과 회차 확장

파일: `scripts/verify_backend_answers.py`, `source/backend/backend-checks.json`, `source/backend/backend-reviews.json`, `source/backend/authoring-reviews.json` 신규. 2·3회 원고는 시범 검증 이후 추가. 실제 CI 파일은 `.github/workflows/`의 기존 검증 흐름을 확인해 수정한다.

입력: 문항 ID·revision, SQL fixture와 기대 결과, Java 실행 사례. 출력: 누락·불일치 시 종료 코드 1, 성공 시 0 및 `reports/backend-verification.json`.

- [x] 검증 스크립트는 환경 정보와 문항별 실행 결과를 기록한다. revision이 바뀌었거나 실행/재풀이 기록이 빠진 문항을 실패 처리한다.
- [x] 전용 테스트 스키마에서만 fixture를 만들고 실행 후 정리한다. 운영 DB 주소·자격정보는 코드나 공개 JSON에 넣지 않는다.
- [x] 정상 기대값 통과와 의도적으로 틀린 기대값 실패를 확인한다. SQL 순서 비보장, 중복 행, NULL, 두 연결의 Tx 순서를 검사한다.
- [ ] 모든 문항을 답을 가리고 재풀이하고 검수 기록을 남긴다. 작성자 검토를 다른 사람의 독립 검토로 기록하지 않는다.
- [ ] `python scripts/verify_backend_answers.py`와 `python scripts/audit_bias.py --strict --report reports/bias.json`이 통과한 뒤 2·3회를 확장한다.
- [ ] 최종 96문항, 전체 객관식 63개의 분포·반복 패턴, 9개 주제 연습 세트까지 다시 검사한다.

### 단계 4. 지우개 상태와 저장

파일: `assets/choice-eraser.js` 신규, `assets/attempt.js`, `assets/storage.js` 수정, `tests/unit/choice-eraser.test.js` 신규.

인터페이스: `normalizeEliminations(attempt) -> Record<string, string[]>`, `toggleElimination(attempt, questionId, choiceId) -> boolean`, `clearElimination(attempt, questionId, choiceId) -> void`. toggle은 편집 가능한 객관식의 미선택 선지만 변경하고 변경 여부를 반환한다. 제출했거나 reveal된 문항은 변경하지 않는다.

- [x] 구버전 필드 누락, 잘못된 타입, 알 수 없는 ID, 중복 ID, 선택된 답과의 충돌에 대한 실패 검사를 먼저 작성한다.
- [x] 6절의 기본값과 정규화를 구현하고 `createAttempt()`에 빈 상태를 추가한다.
- [x] `saveAttempt`, `loadAttempt`, `validateImport`, `importProgress`에서 정규화·검증 경계를 일관되게 적용한다. 정규화로 snapshot이나 answers를 바꾸지 않는다.
- [ ] 내보내기 후 가져오기 복원과 손상 백업의 무변경, 저장 실패를 검사한다. 선지 순서 변경과 새 응시 초기화, 이전 snapshot 유지도 검사한다.
- [x] 지움 전후 `resultFor`와 `summarize`의 결과가 같은지 검사한다.
- [x] `node --test tests/unit/choice-eraser.test.js`와 `npm test`가 통과해야 한다.

### 단계 5. 지우개 화면과 접근성

파일: `assets/quiz.js`, `assets/style.css` 수정, `tests/e2e/choice-eraser.spec.js` 신규. 단계 4 인터페이스를 사용한다.

출력: 객관식 도구 토글, 선지 우측 버튼, 취소선·회색 스타일, 잠금과 포커스 동작.

- [x] 첫 사용 ON과 우측 아이콘의 지우기→복원 토글을 검사하는 E2E를 먼저 추가한다. OFF에서 스타일 숨김과 ON 복원도 검사한다. 명시적으로 저장한 OFF 유지와 답 선택의 독립을 확인한다.
- [x] label과 button을 분리해 렌더링한다. 선택 이벤트는 `clearElimination()` 후 답 저장 순서를 따른다.
- [ ] 학습 모드 해설 공개, 시험 제출, 타이머 종료 시 스타일·버튼 잠금을 검사한다.
- [ ] 새로고침, 이어서 풀기, 선지 섞기, 비객관식 미표시를 검사한다. 기존 AI와 ADsP, 프론트엔드와 알고리즘 객관식에도 적용을 확인한다.
- [ ] Tab·Enter·Space, 라디오 화살표 이동, 토글 후 포커스 유지, 버튼 이름과 상태를 검사한다.
- [ ] 360px 및 데스크톱, 라이트·다크에서 긴 SQL과 여러 줄 선지를 직접 확인한다.
- [x] `npx playwright test tests/e2e/choice-eraser.spec.js` 후 전체 `npm run test:e2e`가 통과해야 한다.

### 단계 6. 전체 검증과 인계

- [ ] README의 기존 검증 전체와 신규 backend 검증을 실행한다. 빌드, 스키마, 편향, 답안 검수, 단위·E2E 결과를 기록한다.
- [ ] `python scripts/build_site.py`로 배포 산출물을 만들고 `/study-space/` 하위 경로에서 링크를 확인한다.
- [ ] PDF, OCR, 과제 원본이 추적되거나 `dist/`에 들어가지 않았는지 확인한다.
- [ ] 변경 파일과 명령별 결과를 사용자에게 보고한다. 커밋과 push, PR과 배포는 별도 요청 전까지 하지 않는다.
- [ ] 월말 자료 검토와 기능 구현 상태를 구분한다. 아래 12절의 Web 프로젝트 연습을 실제 구현하기 전에는 시험 카드로 노출하지 않는다.

## 9. 이번 산출물과 미구현 항목

이번에는 DB 개념 요약노트, 이 계획안, DB PDF 제외 규칙을 작성한다. 모의고사 문항, 트랙·노트의 사이트 등록, 지우개 기능은 구현하지 않는다. 계획의 완료와 제품 기능의 완료를 구분한다.

추가 자료 검토를 반영한 수정본이다. 이번 변경은 계획·출처 표기와 원본 제외 규칙이다. 아래 노트 보강, SQLD 노트·모의고사, 월말 프로젝트, 지우개를 구현 완료한 것으로 보고하지 않는다.

## 10. 보완 근거와 공식 참고 자료

강의의 간략한 설명을 그대로 단정하지 않도록 아래 자료로 조건을 확인했다. 범위를 늘리기 위한 자료가 아니라 오해를 줄이기 위한 검증 근거다.

- 비집계 열이 GROUP BY에 없더라도 함수적 종속 등으로 허용되는 경우가 있다: [MySQL의 GROUP BY 처리](https://dev.mysql.com/doc/refman/8.0/en/group-by-handling.html).
- MySQL 8.4의 UNION·INTERSECT·EXCEPT 지원과 결과 결합 조건: [집합 연산](https://dev.mysql.com/doc/refman/8.4/en/set-operations.html).
- 일반 DDL과 TRUNCATE의 암묵적 커밋 및 예외: [암묵적 커밋을 일으키는 명령](https://dev.mysql.com/doc/refman/8.4/en/implicit-commit.html).
- InnoDB에서 격리 수준별 비잠금 읽기와 잠금 읽기의 차이: [트랜잭션 격리 수준](https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html), [일관된 비잠금 읽기](https://dev.mysql.com/doc/refman/8.4/en/innodb-consistent-read.html).
- 복합 인덱스의 선행 열과 활용 조건: [복합 인덱스](https://dev.mysql.com/doc/refman/8.4/en/multiple-column-indexes.html).
- ANY와 IN의 비교 의미와 NULL: [ANY, IN, SOME 서브쿼리](https://dev.mysql.com/doc/refman/8.4/en/any-in-some-subqueries.html).
- JDBC 바인딩 인덱스와 실행 메서드의 반환 의미: [Java SE 21 PreparedStatement](https://docs.oracle.com/en/java/javase/21/docs/api/java.sql/java/sql/PreparedStatement.html).

## 11. 최초 노트·계획 작성 당시의 검증 기록

검증일: 2026-11-03. 아래는 최초 작성 시점의 결과다. 추가 자료 반영 검증은 14절에 별도로 기록한다. 문서와 기존 원고에 대한 검사이며 backend 시험이나 지우개 기능의 구현 완료를 의미하지 않는다.

| 명령 또는 확인 | 결과 |
| --- | --- |
| `python reports/db-source-review/verify_documents.py` | 기존 원고 14회차 462문항을 별도 폴더에 빌드. 기존 스키마와 새 노트 검사 오류 0, 편향 미검토 0 |
| `python -m unittest discover -s tests/content` | 13개 통과 |
| `npm test` | 29개 통과 |
| `node reports/db-source-review/preview.mjs` | 기존 노트 렌더러로 11개 Part와 답 토글 20개 확인. 360px·1440px 본문 가로 넘침 없음 |
| 미리보기 이미지 확인 | 360px·데스크톱의 제목, 본문, 비교표 확인. 넓은 표는 기존 가로 스크롤 사용 |
| `git diff --check` | 공백 오류 없음 |
| DB 강의 원본의 ignore 적용 검사 | DB PDF 제외 규칙 적용 확인 |
| 독립 설계 검토 | 기존 groups 검증이 essay도 지원함을 확인해 영역별 서술 배분 계약 보완 |

검증 스크립트와 OCR, 미리보기는 공개 제외된 `reports/db-source-review/`에 있다. 제품 코드와 자동 배포 검사에는 등록하지 않았다. 기존 `data/`를 덮어쓰지 않기 위해 `build_data`의 출력 폴더를 지정하고 동일한 스키마·편향 검사 함수를 호출했다. 새 DB 노트는 검사 프로세스에서만 임시 등록해 검사했다.

SQL의 행 추적과 집계 결과를 독립 풀이하고, 공통 SQL 6개 결과 검사를 SQLite로 교차 확인했다. 이는 MySQL 엔진 검증을 대체하지 않는다. 로컬 MySQL 실행 파일이 없고 Docker 엔진도 실행 중이 아니므로 MySQL 고유 동작은 공식 문서와 대조했으며 실제 실행은 하지 않았다. 후속 문항 제작에서는 4-2절의 MySQL·Java 실행 검증을 반드시 수행한다.

기존 미추적 계획 문서와 백엔드 수업 정리, PDF 원본은 작업 전후 해시가 같다. 기존 생성 데이터는 쓰지 않았고 커밋과 push, PR과 배포는 하지 않았다.

## 12. 범위표 → 요약노트 → 문항 연결

노트 보강은 아래 위치에 넣는다. 굵은 강조 문장, 비교표, 새 데이터로 만든 추적 예제, 오개념 확인 질문 순서로 작성한다. 기존 노트에 내용이 있으면 중복 Part를 만들지 않고 해당 절을 보완한다.

| 범위 ID | 백엔드·DB 노트의 보강 위치 | 반드시 강조할 판단 | 모의고사 반영 방식 |
| --- | --- | --- | --- |
| B01 | Backend Part 2~3 | 생성과 init, 요청별 service와 종료 시 destroy, 인스턴스의 동시 요청과 공유 필드 위험 | 호출 순서와 멀티스레드 오개념 객관식 |
| B02 | Backend Part 2~3 | 정확/경로/확장자/기본 URL 매핑, Filter DispatcherType, chain 호출과 조기 종료 | 설정에 따른 실행 경로 추적 |
| B03 | Backend Part 3·6 | Front Controller 분기, web.xml 예외와 상태 코드 매핑 | 404/500 처리 설정 객관식과 빈칸 |
| B04 | Backend Part 4~5 | JSP 스크립트 요소가 변환되는 위치, include 지시자의 번역 시점, scope 탐색, JSTL 조건 | 같은 이름의 속성과 출력 결과 판단 |
| B05 | Backend Part 6 | 세션 식별 쿠키와 아이디 기억 쿠키는 역할이 다름, 인증 상태는 세션, invalidate | 로그인·로그아웃 상태 추적 |
| B06 | Backend Part 4~5 | forward는 서버 내부 이동, redirect는 후속 요청으로 URL과 request 공유 여부가 달라짐 | 단순 이동에서 요청 1회 대 2회, URL·속성 3축 비교 서술 |
| D01 | DB Part 2~3 | NULL은 3값 논리, WHERE는 TRUE만 채택, 집계 전후 필터와 NULL 제외 | WHERE/HAVING·COUNT/AVG 결과 추적 |
| D02 | DB Part 2·6 | PK 무결성과 FK 삭제, DELETE/TRUNCATE/DROP 비교, ORDER BY와 LIMIT 및 문자열 결합 | MySQL 방언을 명시한 문법과 결과 판별 |
| D03 | DB Part 5·7 | 저장점과 스칼라 결과 행수, IN/ANY/ALL과 상관 EXISTS, 차집합과 뷰 DML 조건 | 부분 롤백의 상태 및 서브쿼리 결과 추적 |
| D04 | DB Part 8~9 | 부분/이행 종속과 정규화, Full Table Scan, InnoDB 클러스터/보조 인덱스의 리프 차이 | 종속성 근거 서술, 접근 경로 구조 비교 |
| I01 | DB Part 10 + Backend Part 3·6 | PreparedStatement 바인딩, ResultSet 순회, executeQuery/executeUpdate, 자원 해제, 예외 전달 | DAO 빈칸·MVC 연결 객관식 및 월말 실습 |

기존 노트의 Part 11(DB), Part 8(Backend) 시험 직전 점검에도 위 범위 ID를 대응한다. 본질/인조 식별자, 관계·조인과 트랜잭션 모델링 등 SQLD 공통 개념은 SQLD 노트에서 보완하되, 수업 노트의 MySQL 문장을 Oracle 규칙으로 바꾸지 않는다.

**출제 커버리지 계약:** `source/backend/coverage-backend.json`은 `{coverageProfile, requirements}` 객체다. requirements는 `{requirementId, keywords, noteId, section, questionIds}` 배열이다. keywords는 범위표의 세부 키워드별 `{id, questionIds}` 배열이다. coverageProfile은 pilot 또는 full이다. pilot은 B01~I01의 각 행에 1문항 이상 연결하고 full은 모든 키워드에 실제 문항 1개 이상을 요구한다. 없는 문항이나 절, 다른 트랙 ID는 오류다. 여러 요구를 다루는 문항은 여러 행에 연결할 수 있지만 문항 수는 중복 계산하지 않는다. SQLD 전용 윈도우 함수와 PIVOT 및 정규식 문제를 과평 필수 범위에 섞지 않는다.

4절의 21/9/2 배분은 유지한다. 1회는 기본 흐름을 다루고 2회는 NULL과 scope 및 제약 오류를 다룬다. 3회는 웹과 SQL 연결에 무게를 둔다. B06과 D01은 반드시 비교 축을 모두 담은 해설을 갖춘다. 실습의 도메인과 숫자만 바꿔 복제하지 않고 새로운 요구와 데이터를 작성한다. 실습에 UPDATE나 장바구니 전체 구현이 있어도 최신 월말 범위인 CRD보다 우선하지 않는다.

**추가 구현 작업:** 단계 1에서 두 노트를 위 표대로 보강하고 coverage 파일을 만든다. `scripts/validate_questions.py`에서 coverage를 검사하고 `tests/content/test_backend_coverage.py`에 없는 문항·누락 키워드·잘못된 노트 절 실패 사례를 추가한다. 단계 3에서 범위별 정답 근거와 실제 실행 기록을 연결한다. 시범 상태를 3회 전체 범위 충족으로 표시하지 않는다.

**주제별 노트 진입:** 공통 링크 계약은 [SQLD 계획 4절](sqld.md#4-트랙과-노트-연결)의 `studyLinks`를 사용한다. Backend 연결은 web-servlet→Part 2와 mvc-filter→Part 3이다. jsp-el→Part 4·5와 state-session→Part 6도 연결한다. DB 연결은 sql-select→Part 2와 Part 3, sql-join-subquery→Part 4와 Part 5이다. db-schema는 Part 6과 Part 9로 이동한다. db-tx-index는 Part 7과 Part 8, jdbc는 Part 10으로 연결한다. 실전 응시 중에는 숨기고 주제 선택과 학습 및 복습에서 제공한다.

## 13. 월말 Web 실습 계획

### 제공물과 작성 범위

`BE-SCOPE-01`을 우선 기준으로 한다. pom.xml과 MVC 구조, DBUtil과 logging을 제공하며 JSP 화면과 DAO의 기본 코드도 제공한다. 학습자는 DAO의 SQL과 바인딩·매핑, Servlet의 요청 처리, 로그인·로그아웃과 Filter 및 web.xml 오류 처리를 완성한다. command 패턴과 빈 프로젝트 전체 구축 또는 UPDATE는 필수 과제로 요구하지 않는다. 전체 CRUD는 확장 학습으로만 분리한다.

새로 작성한 기본 코드와 데이터로 통합 프로젝트 1개를 먼저 제작한다. 실습 원본과 정답 프로젝트를 복사하지 않는다. 120분 안에 시작 코드 확인부터 구현과 실행 및 압축 확인까지 연습한다. 파일의 최종 이름과 폴더 구조는 실제 안내가 추가되면 맞추며 현재 프로젝트의 규칙을 공식 제출 규칙으로 표현하지 않는다.

| 연습 영역 | 제안 배점 | 확인할 결과 |
| --- | ---: | --- |
| CRD와 DAO | 40 | 등록과 목록/단건 조회 및 삭제, 바인딩과 ResultSet, 없는 ID와 중복 키 및 빈 목록 |
| 로그인·로그아웃 | 20 | 실패/성공 분기, 세션 인증, invalidate, 아이디 기억 설정/해제 |
| Filter | 15 | 보호 경로 판별, 비로그인 차단, 허용 요청의 chain, forward/error 재호출 조건 |
| 오류 처리 | 10 | web.xml 404/500 연결과 예외 전달, 내부 정보가 화면에 그대로 나오지 않음 |
| MVC 흐름·제출 점검 | 15 | DTO와 request 전달, forward/redirect, 빌드·실행, 필요한 파일 포함 |
| 합계 | 100 | 학습용 자기채점 기준이며 공식 배점 아님 |

제공 완료된 DBUtil과 logging 및 JSP를 새로 만드는 능력은 채점하지 않는다. 다만 제공 인터페이스를 올바르게 사용해야 한다. 모범답안 열람은 정답이나 완료로 처리하지 않으며 각 항목을 확인한 뒤 자기채점한다. 파일을 고르지 않았거나 제출 점검이 남으면 `제출 준비 미완료`로 표시한다. 사이트는 Quest에 업로드하지 않는다.

### 구현 단위와 데이터 계약

기존 quiz의 구현형은 단일 텍스트 답안에 맞춰져 있다. Web 프로젝트는 별도 `manifest.webProjects`로 등록한다. `kind: monthly`에 억지로 3/1 문항을 넣거나 기존 모든 트랙의 월평 검증을 완화하지 않는다.

- 신규 원고: `source/backend/projects/web-01/{project.json,requirements.md,rubric.md}`. 새로 작성한 기본 코드는 같은 폴더의 `starter/`, 검증용 완성 코드는 `reference/`에 둔다. 빌드 결과 ZIP은 생성물로 관리한다.
- `project.json`의 식별 필드는 `id`, `revision`, `track: backend`다. 시간은 `durationMinutes: 120`으로 고정한다. 제공 파일은 `providedFiles`에 두며 수정 가능 파일과 필수 제출 경로는 `editableFiles` 및 `requiredSubmissionPaths`로 지정한다. `rubric`은 ID와 배점 및 검사 항목을 갖고 `sourceRefs`는 출처다. 경로는 프로젝트 루트 기준 상대 경로이며 절대 경로와 상위 이동을 금지한다.
- 신규 `scripts/build_backend_projects.py`: `build_projects(source_root, output_root) -> dict`. 검증된 manifest와 기본 코드 ZIP을 생성하고 모범답안은 별도 복습 자산으로 구분한다. `scripts/build_data.py`에서 호출해 `data/backend-projects.json` 및 `manifest.webProjects = {file, count, track}`를 만든다. 전용 검증은 `scripts/validate_backend_projects.py`에 둔다.
- 신규 `pages/project.html`, `assets/project.js`: 과제와 제공물 확인 → 시작과 타이머 → 로컬 IDE 구현 → 제출 점검 → 자기채점 흐름. ZIP 업로드와 내용 자동 채점은 초기 범위에서 제외한다. 기본 코드 내려받기 및 로컬 파일명과 크기 표시, 체크리스트를 제공한다. 파일 내용을 서버로 보내지 않는다.
- 신규 `assets/project-attempt.js`: `createProjectAttempt(project, now)`, `finalizeProjectAttempt(attempt, now)`, `setProjectRubric(attempt, criterionId, earnedPoints)`. 식별 필드는 `projectId`와 `revision`이다. 시간은 `startedAt`과 `deadlineAt`으로 관리한다. 상태는 `status`로 구분하고 제출 확인과 점수는 `submissionChecks` 및 `rubricScores`에 저장한다. 파일명 등 메타데이터만 저장하며 파일 바이트는 저장하지 않는다.
- 프로젝트 상태는 `in-progress`, `time-ended`, `review`로 구분한다. 시작 시 요구사항과 rubric을 `projectSnapshot`에 저장하고 같은 응시는 해당 snapshot으로 복원한다. 새 revision은 새 응시로 시작한다. 시간 종료 시 `time-ended`로 바꾸고 최종 점검 후 `review`로 이동한다. 미완료 제출 점검은 review에서도 누락 상태로 남기며 모범답안 열람으로 지우지 않는다.
- `assets/storage.js`와 백업에 선택 필드 `projectAttempts` 추가. 구버전은 빈 배열, ID/revision과 rubric 범위 검사, 잘못된 백업은 현재 기록 유지. 문제 응시 기록과 별도 key `study-space:project-attempts` 사용. 타이머 만료는 구현 시간 종료만 뜻하고 파일 제출·정답 처리를 자동 수행하지 않는다.
- `assets/app.js`의 backend 화면에 프로젝트 카드 제공. 프로젝트 수를 기존 객관식 문항 수와 합산하지 않는다.

### 단계 M. 후속 구현 시 완료 조건

- [ ] `tests/content/test_backend_projects.py`에 필수 파일 누락·경로 이탈·rubric 합계 오류를 먼저 작성한다.
- [ ] 새 기본 코드와 요구사항, rubric을 작성하고 시작 코드에서 제공된 JSP·DBUtil·pom이 실제 사용 가능한지 확인한다.
- [ ] 검증용 완성 코드를 고정 Java와 Servlet 컨테이너 및 MySQL 환경에서 빌드하고 실행한다. 정상 CRD와 인증 실패를 확인한다. 세션 무효화와 쿠키 해제, 필터 차단과 404/500도 검증한다.
- [ ] 공개 ZIP에 정답 코드·원본 자료·실제 자격정보가 섞이지 않도록 구성과 해시를 검사한다.
- [ ] `tests/unit/project-attempt.test.js`에서 시간 종료와 제출 구분, 재시작과 백업 및 revision 차이를 검사한다. `tests/e2e/backend-project.spec.js`에서 120분 기본값과 제공물 다운로드를 확인한다. 파일 미선택과 자기채점 보류, 모바일도 검사한다.
- [ ] `python scripts/validate_backend_projects.py`, `python -m unittest discover -s tests/content`, `npm test`, `npx playwright test tests/e2e/backend-project.spec.js`를 통과한다. 완성 코드의 `mvn test package` 및 컨테이너 실행 결과도 기록한다.

## 14. 추가 자료 반영의 검증 기록

이번 수정의 검증 결과는 작업 종료 보고와 `reports/backend-db-followup/verification.json`에 기록했다. 평가 안내 직접 확인, SQLD 공식 안내와의 대조, SQLD 그림 16개 확인, 실습·과제 요구사항 100개 분류를 수행했다. 원본의 해시와 비공개 제외 상태를 검사한다. 새로운 문항이나 Web 프로젝트를 실행 검증한 것으로 표현하지 않는다.


| 실행 명령 또는 검사 | 결과 |
| --- | --- |
| `python reports/backend-db-followup/verify_followup.py` | 계획 3개 링크·문장·배분 오류 0. 원본 해시 137개 유지, 원본 파일 41개 Git 제외 확인 |
| `python reports/db-source-review/verify_documents.py` | 기존 14회차 462문항의 별도 출력 빌드 통과. 스키마 오류 0, 편향 미검토 0 |
| `python -m unittest discover -s tests/content` | 13개 통과 |
| `npm test` | 29개 통과 |
| `node reports/db-source-review/preview.mjs` | DB 노트 11개 Part와 답 토글 20개 유지. 360px/1440px 가로 넘침 없음 |
| `git diff --check` | 공백 오류 없음 |

새 SQLD 문항과 월말 프로젝트는 아직 없으므로 위 결과에 해당 기능의 검증을 포함하지 않는다. DB 노트 수정은 근거의 자료 ID 표기뿐이며 설명과 예제는 보존했다. 원본 자료를 수정하거나 기존 data를 덮어쓰지 않았다.
