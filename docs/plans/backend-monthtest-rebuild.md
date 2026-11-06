# 월말평가 문제 재작성 계획 (새 완성본 반영)

작성일: 2026-11-06. 상태: **계획만 작성, 구현 보류.** 현재 사이트의 월말평가 프로젝트(`web-01` 캠핑 용품, `web-02` 도서)는 이 계획 때문에 바뀌지 않았다. 기준 문서는 [백엔드·DB 월말평가 학습 기능](backend-monthtest.md)이다.

## 1. 배경

사용자가 로컬 폴더 `source/backend/backend-monthtest/`(저장소에 올리지 않는 비공개 폴더)에 새 완성본을 올리고, 이를 토대로 월말평가 문제를 다시 만들어 달라고 요청했다. 분석 뒤 사용자가 다음과 같이 방향을 정했다.

- 새 완성본의 소스를 그대로 쓰지 않고 같은 구조로 새로 작성한다.
- 실제 시험은 Command 패턴을 쓰지 않으며 `SessionFilter`는 작성 대상이 아니다.
- 이후 "기존 것으로 가고 `backend-monthtest` 안에 있는 구조를 따른다. 시간이 부족하니 구현은 보류하고 계획안만 원격 저장소에 올린다"로 정리했다.

## 2. 새 폴더에서 확인한 내용

`backend-monthtest/`의 소스는 Java 28개, JSP 11개이며 다음 특징이 있다. 이 절은 구조와 기능을 파악한 기록이며 코드나 문구를 옮기지 않았다.

| 영역 | 내용 |
| --- | --- |
| 구조 | `FrontController`(`*.do`)가 `Command` 구현체 11개를 맵으로 찾아 실행한다. 맵은 `AppInitListener`가 시작할 때 채운다 |
| 기능 | 회원 가입, 아이디 중복 확인(JSON), 로그인, 로그아웃, 프로필 수정, 탈퇴. 글 목록(검색 종류 3개와 페이지), 상세(조회수), 작성, 수정, 삭제 |
| 보호 | `AuthenticationFilter`가 허용 주소를 뺀 모든 `*.do` 요청을 로그인으로 보낸다 |
| 데이터 | `roles`, `users`, `boards` 세 테이블. 글은 작성자 번호 외래키를 가진다 |
| 환경 | HikariCP 커넥션 풀, Gradle, Servlet 6.1, MySQL Connector 9.3. 폴더 안 `pom.xml`은 `com.ssafy` `sample`로 Servlet 6.0과 Connector 8.4.0이다 |
| 표시 | 소스마다 "Copyright (c) 2026 hissam. All rights reserved." 문구가 있다 |

시험 환경 문구(OpenJDK 25.0.3_9, Tomcat 11.0.27, Dynamic web module 6.0, MySQL 8.4.11)와 맞지 않는 부분은 Command 패턴과 Listener 초기화, HikariCP, Gradle, Servlet 6.1, Connector 9.3이다.

## 3. 결정 사항과 아직 확인이 필요한 사항

| 항목 | 상태 | 내용 |
| --- | --- | --- |
| 소스 사용 방식 | 확정 | 완성본의 코드를 복사하지 않고 구조와 기능 범위만 참고해 새로 쓴다. 저작권 표시가 있어 공개 저장소에 옮기지 않는다 |
| 실행 환경 | 확정 | 지금 사이트에 안내된 환경을 유지한다. 라이브러리를 추가하지 않고 `DBUtil`의 `DriverManager`를 쓴다 |
| 구조 | 확정 | Command 패턴, FrontController, Listener, HikariCP는 넣지 않는다. 컨트롤러는 `ControllerHelper`를 쓰는 서블릿이며 `action` 파라미터로 분기한다 |
| `SessionFilter` | 확정 | 작성 대상과 체크리스트 항목에서 뺀다. 제공 파일로 두고 흐름 설명에는 로그인 확인 단계로만 남긴다 |
| 이번 작업의 범위 | 확정 | 계획만 작성한다. 현재 `web-01`, `web-02` 원고와 생성 데이터는 바꾸지 않는다 |
| "`backend-monthtest` 안의 구조"의 뜻 | **확인 필요** | 폴더 안에 `com.mmcafe` 소스(게시판)와 `com.ssafy` `sample` 형태의 `pom.xml`이 섞여 있다. 이전에 원본으로 쓰던 시험 템플릿 구조(`com.ssafy.sample`, 서블릿이 `action`으로 분기, 현재 `web-01` 구조)를 가리키는지, 게시판 기능 범위를 가리키는지 알려 주면 4절의 A와 B 중에서 정한다 |
| 소재 | **확인 필요** | 현재 캠핑 용품과 도서 두 소재를 유지할지, 게시판 소재로 바꿀지 |
| 새 자료 ID | 미등록 | 공개 자료 ID `BE-MONTH-WORK-02`를 제안만 한다. 등록 전에는 검증된 출처처럼 쓰지 않고 [source-publication.md](source-publication.md)에 사용자 승인 뒤 추가한다 |

## 4. 재작성 후보

| 후보 | 내용 | 작업량 | 위험 |
| --- | --- | --- | --- |
| A. 현재 구조 유지, 기능 확장 | `web-01`, `web-02`의 `com.ssafy.sample` 구조를 그대로 두고 새 완성본에서 시험 범위에 들어가는 기능만 추가한다. 후보는 목록 검색과 페이지, 수정, 작성자 확인이다 | 중간 | 기존 응시 기록과 문항 개수가 바뀌므로 `revision`을 올려야 한다 |
| B. 게시판 소재로 교체 | 같은 구조(서블릿, Service, DAO, JSP) 위에 회원과 게시글 두 테이블로 소재를 바꾼다. 아래 5절의 초안을 쓴다 | 큼 | 마스터, 도식, 테스트 이름을 모두 바꾼다. 저장된 연습 기록의 파일 경로가 달라진다 |
| C. 소재 추가 | 기존 두 소재를 남기고 게시판을 세 번째로 추가한다 | 가장 큼 | 마스터가 두 벌이 되어 검증과 유지 비용이 커진다 |

권장은 시험 범위가 확인된 뒤 A이다. 게시판 전체 기능을 다 넣으면 90분과 120분에 풀기에는 작성 대상이 많다.

## 5. 후보 B의 설계 초안

구현하다 중단하며 만든 초안이다. 로컬 임시 폴더에 있고 저장소에는 올리지 않았다. 결정되면 다시 만든다.

- 소재: `캠핑 이야기 게시판`(`web-01`)과 `독서 모임 게시판`(`web-02`). 클래스 이름은 `Board`, `User`로 같고 DB 이름과 시작 데이터, 화면 문구만 다르다.
- 테이블: `users(user_id PK, password, name, email, join_date)`, `boards(no AUTO_INCREMENT PK, title, content, writer_id FK, reg_date, hit)`. 시작 데이터는 회원 2명, 글 12건(5건씩 3쪽).
- 컨트롤러 둘: `BoardController`(`/board`: list, detail, regist, modify, remove)와 `UserController`(`/user`: join, checkId, login, logout).
- 작성 대상 25곳: 컨트롤러 9(`board-dispatch`, `board-list`, `board-detail`, `board-regist`, `board-modify`, `board-remove`, `user-join`, `user-login`, `user-logout`), 서비스 2(`svc-board`, `svc-user`), DAO 8(목록 SQL과 페이징, 전체 글 수, 상세, 등록, 수정, 삭제, 로그인, 회원 등록), JSP 5(머리글, 로그인, 목록, 글쓰기, 상세), `web.xml` 오류 페이지 1.
- 제공 파일: `SessionFilter`, `LoggingFilter`, DTO, `SearchCondition`(페이지 계산), `DuplicateUserException`, 조회수 증가 DAO와 `isFirstRead`, `keepQuery`, `checkId`, `modify.jsp`, `join.jsp`, 오류 JSP.
- 시험 주제: 목록 검색은 `like`와 `limit offset` 바인딩 번호, 상세는 세션에 읽은 글 번호를 기록해 조회수 중복을 막는 방법, 수정과 삭제는 작성자 확인(403)과 POST만 허용(405)을 평가한다.
- 점검 항목: 기존 `crd-*`를 `board-*`로 바꾸고 `user-join`, `input-invalid`를 추가하며 `auth-filter` 항목은 제공 파일 확인용으로 작성 대상 없이 둔다.

## 6. 구현 때 바꿀 파일

| 구분 | 파일 | 내용 |
| --- | --- | --- |
| 마스터 | `source/backend/projects/_master/files/**`, `targets.json`, `structure.json`, `docs/*` | 새 소재와 작성 대상에 맞게 다시 쓴다 |
| 생성기 | `scripts/author_backend_projects.py` | `DOMAINS`의 이름, DB 이름, 도메인 치환 목록, `web-02` 시작 데이터 파일 |
| 검증기 | `scripts/validate_backend_projects.py` | 도식 뼈대 검사가 새 이름에서도 통과하는지 확인 |
| 생성물 | `source/backend/projects/web-01`, `web-02`, `data/backend-projects*` | `author_backend_projects.py`와 `build_data.py`로 다시 만들고 `revision`을 올린다 |
| 테스트 | `tests/content/test_backend_projects.py`, `tests/unit/project-*.test.js`, `tests/e2e/backend-project.spec.js` | `GearController`, `/gear`, `code` 같은 이름과 상자 id(`gearctl`, `service`, `dao`)를 새 이름으로 바꾼다 |
| 문서 | [backend-monthtest.md](backend-monthtest.md), [README.md](../../README.md), `docs/QUESTION_AUTHORING.md` | 소재와 작성 대상 수, 시험 환경 설명 |

## 7. 검증 계획

1. `python scripts/author_backend_projects.py --check`, `python scripts/validate_backend_projects.py`로 원고와 생성물의 일치를 확인한다.
2. `javac --release 21`(Servlet API 6.0.0)로 모범답안(`reference/`)을 컴파일하고 Jasper JspC로 JSP를 번역한다. 2026-11-06 기준 기존 두 프로젝트는 이 두 항목을 통과로 기록했다.
3. 실행 검증(MySQL, Tomcat)은 사용자가 STS에서 `verification.md` 절차로 한다. 사용자가 확인하기 전까지 `review.json`의 실행 항목은 미검증이다.
4. `build_data.py`, `validate_questions.py`, `audit_bias.py --strict`, 콘텐츠 테스트, `npm test`, 전체 E2E를 통과해야 한다.

## 8. 위험과 대응

- 기존 응시 기록: 응시 시작 때의 문제 스냅샷이 저장되므로 원고를 바꿔도 이전 기록은 열리지만, 파일 구성이 크게 바뀌면 `revision` 변경을 화면에 알린다.
- 정답 유출: 도식의 뼈대에 모범답안 줄이 들어가지 않도록 검증기가 막는다. 새 소재에서도 같은 검사를 통과해야 한다.
- 분량: 작성 대상이 25곳이면 1단계(빈칸)는 가능하지만 3단계(처음부터)는 시간이 부족할 수 있다. 3단계는 일부 영역만 비워 두는 방안을 함께 검토한다.
- 저작권: 완성본의 코드, 문구, 데이터를 옮기지 않는다. 구조와 기능 범위만 참고하고 변수 이름과 문구는 새로 쓴다.

## 9. 다음 작업

- [ ] 3절의 "확인 필요" 두 항목(구조의 뜻, 소재)을 사용자가 정한다.
- [ ] 후보(A, B, C)와 작성 대상 범위를 확정하고 이 문서의 3절과 4절을 갱신한다.
- [ ] 새 자료 ID 등록 여부를 사용자가 승인한다.
- [ ] 구현 전에 `origin/main`과 비교하고 최신 상태에서 브랜치를 만든다.
- [ ] 6절의 순서대로 마스터, 생성기, 테스트를 고친 뒤 7절의 검증을 모두 통과시킨다.
