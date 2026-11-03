# SQLD 개념 노트와 모의고사 구현 계획

> 실행 지침: 구현 시 `superpowers:executing-plans`로 단계별 진행한다. 이 문서는 설계 산출물이며 새 노트·문항·기능의 구현 완료를 뜻하지 않는다. 커밋은 사용자 요청이 있을 때만 한다.

**목표:** 수업 DB 학습을 SQLD 대비와 연결하면서 각 시험의 범위·방언·채점을 분리한다.

**구조:** 수업은 `backend`, SQLD는 `sqld` 트랙이다. 공통 개념의 복습 링크를 공유하되 시험 문제와 기록은 별도 ID로 관리한다. 기존 정적 사이트와 브라우저 저장 구조를 사용한다.

**기술:** Python 원고 빌드·검증, JavaScript와 기존 노트 렌더러, Node·Playwright, SQL 방언별 별도 실행 검증.

**설계 명세:** [백엔드·DB 계획](backend-db.md)의 통합 과평과 노트 정책, 이 문서 1~5절. 출처는 [공개 방안](source-publication.md)을 따른다.

작성일: 2026-11-03. 아래 과목 구성은 공식 안내 확인값이며 세부 주제별 배분과 3회 제작은 사용자가 현재 계획대로 진행하도록 확정한 학습용 구성이다.

## 1. 공식 시험 형식과 트랙 분리

[DataQ SQL 개발자 안내](https://www.dataq.or.kr/www/sub/a_04.do)의 시험주요내용·출제문항 및 배점·합격기준을 직접 조회했다. 웹 검색 도구의 접근 오류 후 일반 HTTP로 본문을 확인했으며 로컬 검수 기록에 보관했다.

| 항목 | SQLD | 수업 백엔드·DB |
| --- | --- | --- |
| 유형 | 객관식 50문항 | 객관식 21·단답 9·서술 2 |
| 시험 시간 | 90분 | 과평 60분, Web 월말 120분 |
| 영역 | 데이터 모델링의 이해 10, SQL 기본 및 활용 40 | Servlet/JSP와 상태 관리, MySQL과 JDBC |
| 배점 | 문항당 2점, 총 100점 | 학습용 rubric과 공식 평가 배점을 구분 |
| 합격 연습 기준 | 총점 60점 이상, 각 과목 40% 이상 | SQLD 합격 규칙을 적용하지 않음 |

SQLD는 1과목 4개 이상, 2과목 16개 이상 정답이 필요하며 전체 30개 이상 정답 조건도 함께 충족해야 한다. 과목평가 형식을 재사용해 SQLD에 단답형을 넣지 않는다. 구판에 있는 단답형 안내와 예전 성능·최적화 목차는 현재 출제기준을 대체하지 않는다. 일정·응시료 등 이 작업과 무관한 정보는 저장하지 않는다.

## 2. 제공 자료의 채택·보정

`SQLD-A`는 개정형 목차와 관리 구문, PIVOT과 정규식을 포함한다. `SQLD-B`는 모델링을 자세히 설명하지만 성능 모델링과 분산 DB 외에도 최적화와 절차형 SQL 등 구판 항목이 함께 있다. 공식 범위가 최우선이며 두 자료는 개념과 학습 예시의 참고로 사용한다.

| 공식 주요항목 | 노트와 문제에 포함할 내용 | 보완할 점 |
| --- | --- | --- |
| 모델링의 이해 | 데이터 모델과 엔터티, 속성과 관계, 식별자 | 개념/논리/물리 모델, 관계 차수와 선택성 및 식별 관계 |
| 데이터 모델과 SQL | 정규화, 관계와 조인, 모델이 표현하는 트랜잭션, NULL, 본질/인조 식별자 | 제공 요약에서 짧게 다루거나 빠진 관계·조인 및 트랜잭션 모델을 별도 사례로 보강 |
| SQL 기본 | 관계형 DB와 SELECT, 함수와 WHERE, 그룹과 정렬 및 조인 | NULL과 집계, OUTER JOIN 필터 위치와 중복 및 정렬 동률 |
| SQL 활용 | 서브쿼리와 집합, 그룹과 윈도우, Top N과 계층 질의, PIVOT/UNPIVOT과 정규식 | 원문 오류를 보정하고 지원 DBMS와 버전을 명시 |
| 관리 구문 | DML과 TCL, DDL과 DCL | 커밋과 롤백 및 제약과 권한의 방언 차이 |

파티셔닝과 분산 DB, 상세 옵티마이저와 물리 조인 알고리즘, 절차형 프로시저/트리거는 이번 SQLD 기본 모의고사에 배정하지 않는다. 수업 범위의 Full Table Scan과 InnoDB 인덱스는 DB 노트와 backend 문항에 유지한다. 확장 개념이 핵심 범위처럼 보이지 않도록 표시한다.

### 그림 16개 확인 결과

| 자료 ID | 확인한 그림 | 반영 방법 |
| --- | --- | --- |
| `SQLD-A-F01~02` | 식별/비식별 관계, 복합키에서 대리키로 전환 | FK가 자식 PK에 포함되는지로 설명. 두 번째 그림의 왼쪽 도식과 비식별 표제는 서로 맞지 않아 그대로 쓰지 않음 |
| `SQLD-B-F01~04` | 3단계 스키마, 개념·인스턴스 대응, 참여자, 엔터티·인스턴스 | 새 도식과 사례로 재작성. 인스턴스를 반드시 별도 테이블로 만드는 것으로 오해하지 않게 설명 |
| `SQLD-B-F05~10` | 관계명, 1:1/1:M/M:M, 선택성 | 새 업무에서 PK/FK와 최소·최대 참여를 직접 지정. M:M의 관계 엔터티 도출 질문 |
| `SQLD-B-F11` | 계층 질의 구문과 방향 | 암기식 방향 이름 대신 PRIOR가 이전 단계의 부모 행 값을 읽는 의미를 추적 |
| `SQLD-B-F12~13` | PL/SQL 블록, 프로시저·트리거 비교 | 현재 핵심 출제 범위에서 제외. DECLARE 필수 등 단정적 표를 노트로 옮기지 않음 |
| `SQLD-B-F14` | 전체 스캔과 인덱스 스캔 | 수업 DB의 구조 비교 참고. 인덱스가 항상 빠르다는 결론 금지 |

원본 도표는 공개 파일에 복사하지 않는다. 새 ERD는 소규모 관계표 또는 기존 렌더러가 지원하는 표·도식으로 만들고, 이미지가 필요하면 직접 작성한 SVG와 설명을 별도 공개 자산으로 둔다. 원본 이미지 경로를 링크하지 않는다.

### 출제 전 보정 목록

| 원문에서 발견한 문제 | 새 원고의 기준·검증 |
| --- | --- |
| NULL 비교를 UNKNOWN이라고 하면서 `NULL = NULL`을 FALSE라고 표기 | 일반 `=` 비교 결과는 UNKNOWN. WHERE가 TRUE만 남기는 현상과 분리. [Oracle NULL](https://docs.oracle.com/en/database/oracle/oracle-database/26/sqlrf/Nulls.html) |
| NULL이 포함된 문자열 연결은 항상 NULL이라고 표기 | Oracle 연결 연산과 MySQL CONCAT, SQL Server 연산/함수를 구분. Oracle 빈 문자열 처리도 명시 |
| SQL Server가 ROWS/RANGE·LAG·LEAD를 지원하지 않는다고 표기 | 지원 여부와 함수별 frame 제약을 구분. [OVER](https://learn.microsoft.com/en-us/sql/t-sql/queries/select-over-clause-transact-sql), [LAG](https://learn.microsoft.com/en-us/sql/t-sql/functions/lag-transact-sql), [LEAD](https://learn.microsoft.com/en-us/sql/t-sql/functions/lead-transact-sql) |
| MIN/MAX는 윈도우 ORDER BY의 영향을 받지 않는다고 표기 | 정렬과 frame이 대상 행을 바꾸는 사례로 검증. 기본 frame·동률·LAST_VALUE를 함께 확인 |
| 비율 함수의 결과를 항상 양수·1 이하라고 표기 | 입력의 부호와 NULL 및 합계 조건을 먼저 명시. RATIO_TO_REPORT, CUME_DIST, PERCENT_RANK를 구분하고 단일 행과 동률을 검증 |
| 계층 방향을 부모/자식 컬럼 이름으로 단정 | 실제 PK/FK 데이터와 `PRIOR employee_id = manager_id`를 행 단위 추적. [Oracle 계층 질의](https://docs.oracle.com/en/database/oracle/oracle-database/19/sqlrf/Hierarchical-Queries.html) |
| DDL·TRUNCATE 롤백, INSERT 다중 행, 열 삭제 등을 DBMS 구분 없이 단정 | 방언과 버전·트랜잭션 조건을 고정하고 해당 엔진에서 실행한 뒤 출제 |
| FK RESTRICT, CTAS의 NOT NULL, 권한 재부여/회수 설명이 지나치게 단정적 | 제약 이름·참조 행·DDL 실제 결과와 권한 부여 경로를 명시. 공식 DBMS 문서와 실행 근거를 확보하기 전 문제화하지 않음 |

위 표는 원본 파일을 고쳐쓴 기록이 아니라 새 노트·문항의 검수 목록이다. 아직 실행하지 않은 SQL 결과를 검증 완료라고 기록하지 않는다.

## 3. 노트 구성과 50문항 배분

새 원고는 `source/sqld/SQLD개념 요약노트.md`이다. 기존 DB 노트는 MySQL·JDBC 수업용으로 유지한다. SQLD 노트는 공통 개념을 짧게 복습하고 자격시험에 필요한 모델 해석과 Oracle·SQL Server 차이를 집중 보강한다. 원문 요약집을 문장 단위로 재구성하지 않고 새 설명과 데이터로 작성한다.

| 노트 Part / 대주제 ID | 범위 | 과목 | 회차별 객관식 |
| --- | --- | --- | ---: |
| 1 / `model-basics` | 모델과 엔터티, 속성과 관계, 식별자 | 1 | 5 |
| 2 / `model-sql` | 정규화와 관계·조인, 트랜잭션과 NULL, 본질/인조 식별자 | 1 | 5 |
| 3 / `sql-basics` | SELECT와 함수, WHERE와 그룹·정렬, NULL | 2 | 8 |
| 4 / `join` | 조인·표준 조인·OUTER JOIN | 2 | 5 |
| 5 / `subquery-set` | 서브쿼리·집합 연산 | 2 | 6 |
| 6 / `group-window` | ROLLUP과 CUBE, GROUPING SETS와 윈도우 | 2 | 7 |
| 7 / `top-hierarchy` | Top N·계층 질의·셀프 조인 | 2 | 5 |
| 8 / `pivot-regex` | PIVOT·UNPIVOT·정규 표현식 | 2 | 3 |
| 9 / `management` | DML과 TCL, DDL과 DCL | 2 | 6 |
| 10 / 시험 직전 점검 | 방언 비교·오개념·시간 배분 | 복습 | 0 |
| 합계 | 사용자 확정 학습용 배분 | 10 + 40 | 50 |

시범 1회 50문항을 검증한 뒤 총 3회 150문항으로 확장한다. 1회는 기본 개념과 작은 결과표를 다룬다. 2회는 NULL과 동률, 다중 행과 frame 경계를 다룬다. 3회는 모델을 읽고 SQL을 비교하는 통합형이다. 각 회차에 5대 주요항목이 포함되고 3회 전체로 공식 세부항목이 모두 최소 한 번 등장해야 한다. PIVOT/UNPIVOT과 정규식도 빠지지 않게 태그별 coverage를 검사한다.

`scope-sqld.json`은 `composition.subject = {mc:50, short:0, essay:0, code:0}`과 위 `groups`를 갖는다. `subjects`에는 1과목의 두 group과 2과목의 일곱 group을 둔다. 세부 범위는 `tags`, 공개 자료 ID는 `sources`에 둔다. `subjectComposition`은 과목별 `{mc:10}`과 `{mc:40}`으로 두고 검증기에서 검사한다. `exam.json`은 `track:sqld`와 `kind:subject`를 쓰고 기존 필드인 `practiceMinutes:90`을 지정한다. 회차 ID는 `sqld-01` 형식이며 문항 ID와 choiceId는 backend와 공유하지 않는다.

## 4. 트랙과 노트 연결

홈에 `백엔드 · DB`와 `SQLD` 트랙을 별도로 둔다. 기본 소유 노트는 backend에 Backend·DB, sqld에 SQLD다. 공통 DB 노트를 복사해서 두 개의 진도와 서로 다른 설명을 만들지 않는다.

현재 `NOTES`와 홈은 노트당 `track` 하나를 사용하므로 소유 트랙은 유지한다. scope에 선택 필드 `studyLinks: {groupId: [{noteId, section}]}`를 추가하고 `manifest.tracks[track].studyLinks`로 출력한다. SQLD 주제에는 SQLD 해당 Part를 첫 링크로, 관련 DB Part를 보충 링크로 연결한다. 모델링은 DB Part 9를 사용한다. 기본 조회는 Part 2와 Part 3, 조인과 서브쿼리는 Part 4와 Part 5를 사용한다. 관리 구문은 Part 6과 Part 7을 연결한다. JDBC와 인덱스는 SQLD 필수 진입 링크에서 제외한다.

`section`은 노트의 정확한 `##` 제목이다. 링크는 `pages/concepts.html?note=<ID>&section=<URL 인코딩된 제목>` 형태로 만들고 `assets/note.js`가 렌더링된 toc의 동일 제목을 찾아 이동한다. 기존 `#n숫자` 앵커와 노트 ID는 유지한다. 위치 번호를 저장하지 않으며 없는 제목·중복 제목은 빌드 검증 오류로 처리한다. `assets/study-links.js`의 `studyLinksFor(manifest, track, group) -> Array<{label, href}>`를 홈과 퀴즈가 함께 사용한다. 노트 본문에 상대경로 링크를 억지로 넣기보다 UI에서 제공한다.

주제 선택 화면과 학습 모드, 제출 후 복습에서 링크를 보여준다. 과평·SQLD 실전 응시 중에는 숨긴다. 기존 AI의 트랙 내부 노트 버튼과 backend의 자동 전환을 유지하면서 주제별 연결을 추가한다. 다른 트랙의 문항을 같은 이름의 주제라는 이유로 섞지 않는다.

## 5. 채점·방언·검수 계약

- `assets/sqld-result.js`의 `summarizeSqld(questions, attempt, subjects)`는 기존 `resultFor()`로 과목별 정답 수를 계산하고 2점 환산 점수와 과락 및 전체 합격 연습 결과를 반환한다. 기존 다른 트랙의 점수 의미를 바꾸지 않는다. 완전한 50문항 실전 회차에만 합격 판정을 표시하고 학습이나 주제별 연습은 정답률만 보여준다.
- 1과목 4개 + 2과목 26개는 60점 합격, 3+27은 60점이지만 1과목 과락, 10+19는 58점 불합격, 10+15는 2과목 과락이다. 미응답은 0점이며 제출 전 최종 합격 표시를 하지 않는다. 지우개 상태는 점수에 영향을 주지 않는다.
- SQL 문항에는 `sqlDialect`를 `common`, `oracle`, `sqlserver`, `mysql` 중 하나로 지정한다. SQLD 회차에서 MySQL 전용은 금지하고 common도 실제 검증 엔진을 기록한다. 문항 지문에 DBMS와 결과에 영향을 주는 버전·전제를 표시한다. Oracle 19c와 SQL Server 2022를 검증 기준으로 제안하며, 환경 확보 시 실제 패치 버전까지 고정한다. 설치되어 있다고 가정하지 않는다.
- `source/sqld/sqld-checks.json`에 문항 ID와 revision을 기록한다. fixture와 질의, 기대 열/행과 순서 보장 여부, DBMS와 버전도 저장한다. `scripts/verify_sqld_answers.py`는 필요한 엔진 미접속과 실행 실패 또는 기대 결과 불일치를 종료 코드 1로 처리한다. SQLite/MySQL의 실행 성공으로 Oracle 전용 결과를 통과시키지 않는다.
- 모델링 문항은 새 업무 제약과 함수 종속·키 선택 근거를 `source/sqld/sqld-reviews.json`에 기록한다. 복수 정답 가능성을 답을 가리고 재풀이한다. 작성자의 재검토를 독립 검수자 기록으로 쓰지 않는다.
- 객관식 50개의 정답 번호별 수는 일반 N 규칙으로 11~14개, 150개는 36~39개다. 동일 번호 3연속·반복 블록을 금지하고 `docs/QUESTION_AUTHORING.md`의 길이 편향 기준과 choiceId별 오답 근거를 그대로 적용한다. 정답 번호만 바꿔 경고를 해소했다고 판단하지 않는다.
- `source/sqld/authoring-reviews.json`은 revision과 콘텐츠 해시에 맞춘 실제 검토만 기록한다. 원고와 revision, 생성 data, 필요한 검수 기록은 향후 사용자 요청 커밋에 함께 포함한다.

## 6. 구현 작업과 완료 조건

### S1. 범위와 노트, 공통 주제 링크

파일: 신규 `source/sqld/scope-sqld.json`과 `source/sqld/SQLD개념 요약노트.md`, `assets/study-links.js`. 수정 대상은 `scripts/build_data.py`와 `scripts/validate_questions.py`다. 화면은 `assets/app.js`와 `assets/quiz.js` 및 `assets/note.js`를 수정한다. 출제 지침과 README 및 AGENTS.md도 갱신한다. 관련 DB/Backend 노트 보강은 [기존 계획 12절](backend-db.md#12-범위표--요약노트--문항-연결)을 따른다.

- [x] `tests/content/test_sqld.py`에 문항 수 50과 과목 배분 10/40 및 주제·태그 검사를 먼저 추가한다. `tests/unit/study-links.test.js`에는 소유/보충 노트와 잘못된 절 검사를 추가한다.
- [ ] scope의 공식 세부항목과 두 참고 자료·그림의 채택 범위를 매핑하고 노트 10개 Part를 작성한다. 보정 목록을 모두 검토한다.
- [x] TRACKS에 sqld, NOTES에 `sqld-concepts`를 등록한다. `studyLinks`와 note section 조회를 구현한다. 공통 DB 노트는 `db-concepts` 하나만 생성한다.
- [x] 360px/데스크톱에서 표와 SQL 및 새 도식을 확인한다. 없는 링크와 중복 절이 실패하고 기존 노트 URL과 AI 버튼이 유지되는지 검사한다.
- [x] `python -m unittest discover -s tests/content`, `npm test` 통과. `npx playwright test tests/e2e/study-links.spec.js`로 주제 진입·실전 숨김·복습 복원을 검사한다.

### S2. 시범 모의고사와 SQLD 결과

파일: 신규 `source/sqld/sqld-01/{exam.json,questions.md,solutions.md}`, `assets/sqld-result.js`, `tests/unit/sqld-result.test.js`, `tests/e2e/sqld.spec.js`. 수정 `assets/app.js`, `assets/quiz.js`.

- [ ] 위 합격·과락 경계 네 사례를 먼저 검사한다. 미응답과 미제출, 주제 연습의 결과 표시 테스트도 작성한다.
- [ ] 50문항과 선택지별 해설을 새로 작성한다. 문항당 2점과 과목별 집계는 SQLD 결과 모듈에서 환산한다.
- [ ] 실전 모드의 90분 고정, 최종 제출 잠금, 새 응시 기록 분리와 주제 연습을 연결한다. 중도 모드 변경으로 실전 조건을 우회하면 학습 응시로 표시한다.
- [ ] 원고 빌드·스키마 검증과 `npm test`, SQLD E2E를 통과한다. 정답 검수 미완료 회차는 공개하지 않는다.

### S3. SQL 검증과 총 3회 확장

파일: 신규 `scripts/verify_sqld_answers.py`, `source/sqld/{sqld-checks.json,sqld-reviews.json,authoring-reviews.json}`, 2·3회 원고. 수정 `.github/workflows/`의 실제 원고 검증 워크플로.

- [ ] 정상 기대값 통과와 틀린 기대값·revision 불일치·엔진 부재 실패 검사를 작성한다.
- [ ] Oracle과 SQL Server의 격리된 검증 스키마를 사용한다. NULL과 동률 및 빈 결과를 검증한다. 서브쿼리 다중 행과 frame 외에도 ROLLUP과 계층 질의를 확인한다. PIVOT과 정규식 및 DDL/TCL을 검증하고 모델링 재풀이 기록과 오답 근거를 남긴다.
- [ ] 시범 1회 통과 후 2·3회를 작성하고 150문항과 공식 세부항목 coverage, 주제별 문제집을 재검사한다.
- [ ] `python scripts/build_data.py`와 `python scripts/validate_questions.py`로 빌드와 스키마를 확인한다. `python scripts/verify_sqld_answers.py` 및 `python scripts/audit_bias.py --strict --report reports/bias.json`을 통과한다. `npm test`와 `npm run test:e2e` 후 `python scripts/build_site.py`도 통과한다. 엔진 검증을 생략한 성공을 허용하지 않는다.
- [ ] 배포 산출물의 원본과 경로 누출 및 노트 링크를 검사하고 변경 내용과 검증 결과를 보고한다. 커밋과 push 외에 PR과 배포도 별도 요청을 따른다.

## 7. 검토 중점과 구현 순서

1. 수업 MySQL 규칙을 SQLD에 잘못 적용하는 입력은 S1의 방언 표, S3의 실제 엔진 검증으로 확인한다.
2. 60점 이상이지만 과락인 결과는 S2 경계 테스트에서 확인한다.
3. 노트에 절을 추가해도 주제 링크가 다른 절로 이동하지 않는지 S1에서 확인한다.
4. 중복 group 이름과 오래된 응시는 트랙·문항 ID·revision을 기준으로 유지하며 S2 E2E에서 확인한다.
5. 원본 그림과 파일명뿐 아니라 해시와 외부 로컬 경로도 빌드에 섞이지 않는지 S3 공개 검사를 적용한다.

우선순위는 공개 자료 정리 → 수업 범위 노트 보강 및 통합 과평 1회 → SQLD 노트와 1회 → 공통 지우개 → 검증 후 각 3회 확장이다. 월말 프로젝트는 별도 후속 구현 요청에 맞춰 진행한다. SQLD도 지우개를 공통으로 사용하며 해당 명세는 [백엔드·DB 계획 6절](backend-db.md#6-선택지-지우개-동작-명세)을 따른다.
