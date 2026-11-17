# Spring 콘텐츠 생성 전 리팩토링 검토안

작성일: 2026-11-17. 대상: 현재 저장소의 폴더·빌드·사이트·정보 공개 경계. [Spring 구현 계획](spring.md)의 선행 작업이며 **코드 수정 완료 보고가 아니다**.

## 1. 결론과 선택지

**권장: 공개 경계와 확장에 필요한 부분을 먼저 고치고, 시범 콘텐츠를 만든 뒤 나머지를 정리한다.** 전체 구조 개편을 기다리거나 모든 콘텐츠를 만든 뒤 한꺼번에 바꾸는 것보다 재작업 범위가 작다.

| 선택지 | 순서 | 장점 | 비용·위험 | 적합한 경우 |
| --- | --- | --- | --- | --- |
| A. 필수 정리 → 시범 → 확장 | 공개 경계·coverage → 노트/과평 시범 → 월말 공통화/프로젝트 시범 → 나머지 콘텐츠 | 노출·중복 구현 예방, 실제 사례로 공통화 확인 | 시범 시작 전 작은 기반 작업 필요 | **권장** |
| B. 비공개 콘텐츠 초안 → 필수 정리 → 연결 | 노트·출제표·비공개 문항 초안을 먼저 작성, 공개/사이트 연결 전에 R1~R4 | 학습 원고를 빨리 볼 수 있음 | 범위·버전·파일 계약 변경 시 문항과 프로젝트 재작성 | 당장 학습할 초안이 우선일 때 |
| C. 넓은 구조 정리 → 콘텐츠 | 트랙 등록 방식·프로젝트 엔진·화면 모듈·폴더 규칙을 일괄 정비 | 이후 과목 추가가 일관됨 | 기존 응시·URL·data 회귀 범위가 가장 큼, 첫 콘텐츠 지연 | 여러 과목을 연속 확장할 별도 일정이 있을 때 |

B안도 출처 대응과 실행 버전 확인을 생략하지 않는다. 특히 프로젝트 원고를 현재 backend 계약으로 대량 복제한 다음 Spring으로 바꾸는 방식은 권장하지 않는다. 완성 후 리팩토링하면 원고·생성기·JSON·ZIP·화면·검수 hash를 함께 다시 바꿔야 한다.

이번 요청에서는 위 선택지를 제안하고 실행은 하지 않는다. 사용자 선택 전 A안을 확정 결정으로 취급하지 않는다.

## 2. 현재 코드에서 확인한 사항

| 영역 | 확인한 코드·상태 | 판단과 필요한 시점 |
| --- | --- | --- |
| 원고 폴더 | `source/`에 트랙별 원고가 이미 정리됨. Spring은 현재 제외된 PDF만 있음 | 전체 재배치 불필요. `source/Spring`을 유지하고 새 공개 원고만 등록 |
| 대소문자 | Windows 작업 폴더가 `source/Spring` | `source/spring`을 별개로 만들지 않음. Linux CI에서도 같은 경로 사용 |
| 기본 시험/노트 등록 | `scripts/build_data.py`의 `TRACKS`, `NOTES`, scope 기반 `studyLinks` | Spring 항목 추가로 재사용 가능. 범용 플러그인 시스템은 불필요 |
| coverage | `validate_questions.py`의 `backend_note_texts()`, `validate_coverage()`와 호출이 backend 고정 | 두 번째 사용처인 Spring 추가 전에 track 인자로 일반화 |
| 월말 원고 검사 | `validate_backend_projects.py`가 track·scope·원고 루트를 backend로 고정 | Spring 월말 작성 전에 공통 검사 분리 |
| 월말 빌드 | `build_backend_projects.py`의 index·출력 경로·track 고정. `build_data.py`도 backend만 호출 | 트랙별 프로젝트 빌드 등록 필요 |
| 월말 화면 | `app.js`의 `projectTabAvailable()`은 backend 조건. `project.js`는 단일 `manifest.webProjects` 로드 | 트랙별 catalog, 직접 URL·복구·이어하기 계약 필요 |
| 고정 안내·도식 | `project-notices.js`는 backend JDK/Tomcat/DB 문자열. `project.js`의 단계 설명은 JSP 기준. `project-structure.js`에 고정 주요 계층·파일 확장자 있음 | 프로젝트 metadata를 읽도록 변경. Spring에 기존 환경·구조를 잘못 표시하지 않음 |
| 공개 출처 | `source-publication.md`에 `source/provenance.json`, `check_public_sources.py` 계획이 있으나 실제 파일은 없음 | **신규 Spring 원고 생성 전에 구현**. 계획을 완료된 기능으로 가정하지 않음 |
| Git 제외 | 현재 `.gitignore`는 `private/`, `*.pdf` 등. 원본 디렉터리의 추출 Markdown·이미지에는 포괄 보호가 없음 | 추출물을 private로 제한하고 알려진 원본 위치 제외 규칙을 확인 |
| 배포 | `build_site.py`는 HTML 허용 목록과 assets/data만 복사하지만 data는 통째로 복사 | 기본 경계는 있음. 남은 파일·임의 파일을 배포할 수 있는 틈 보완 |
| 최신성 검사 | fresh 산출물의 최상위 JSON/MD는 비교하나 data의 추가 파일을 전부 거부하지 않음. 프로젝트는 backend 하위만 전체 비교 | fresh 파일 집합을 배포 기준으로 삼고 모든 프로젝트 루트 검사 |
| 로컬 서버 | `scripts/serve.mjs` 기본 root가 `.`. 127.0.0.1에만 바인딩 | Pages가 source를 배포하는 것은 아님. 로컬 동일 사용자/전달된 연결에서 원본·private에 접근할 여지 있어 dist 기본값 권장 |
| 정답 노출 | 시험 JSON에 정답·해설, 프로젝트 산출물에 `reference.json` 포함 | 정적 학습 자료의 의도된 공개. 버튼 숨김을 접근 통제로 설명하지 않음 |
| Python 의존성 | 사용자 삭제는 `requirements-dev.txt` 1건. README와 현재 check workflow는 이 파일을 설치하지 않음 | 복원 불필요. 과거 handoff의 언급은 당시 기록으로 구분 |
| CI 범위 | check.yml은 Python 3.12·Node 24·Java 17. README의 backend 정답 실행 명령은 check.yml에는 없음 | Spring 실행 검증을 기존 CI가 자동 제공한다고 가정하지 않음. 별도 고정 환경 job 필요 |

`app.js` 약 22KB, `project.js` 약 45KB로 화면 책임이 커져 있으나 크기만을 이유로 전면 분리하지 않는다. 우선 트랙 선택·catalog·안내 metadata의 중복을 없애고 시범 후 분리 범위를 정한다.

## 3. 정보 공개 경계

| 정보 | GitHub 저장소·Pages 처리 | 검사 |
| --- | --- | --- |
| 강의 PDF, 원본 이미지·전사·추출 텍스트 | Git 제외, 배포 금지 | 추적 파일·ignore·배포 파일 집합 |
| 원본 파일명·로컬 경로·해시 대응표 | `private/spring/source-index.json`에만 저장 | 로컬 private-index 검사, 공개 로그에 값 재출력 금지 |
| 직접 작성한 문항·노트·예제 코드 | 검수 후 공개 | sourceRefs와 공개 자료 ID, 버전·정답 검증 |
| 정답·해설·모범답안 | 학습 자료로 공개됨 | 실전 화면의 우발 노출과 콘텐츠 비공개를 구별 |
| DB 계정·JWT 키·개인 서버 주소·실제 사용자 데이터 | 공개 금지 | 새 예제는 가짜 데이터와 환경 변수, ZIP 내부까지 검사 |
| 사용자의 답안·작성 코드·진행 기록 | 기존 localStorage/IndexedDB에 저장 | 전송 기능 추가 없음, 백업 파일은 사용자가 내려받아 관리 |
| 보고서·로그·CI artifact | 사이트 제외만으로 비공개가 보장되지 않음 | 공개 가능한 ID·검사명·성공 여부만 출력, 원본명·비밀 값 제거 |

자료 ID 검사는 출처 추적을 위한 규칙이지 재배포 허가를 생성하는 기능이 아니다. PDF가 ignore되어 있어도 그 내용을 통째로 추출한 Markdown이나 이미지가 공개되면 원본 보호가 되지 않는다. Git 이력의 과거 원본 노출 여부는 이번 조사로 전체 감사한 것이 아니며 이력 삭제·재작성은 수행하지 않는다.

실전 중 노트/해설 링크를 숨기고 모범답안을 사용자가 눌러 보게 하는 기능은 학습 흐름을 돕는다. 직접 URL, 개발자 도구, 새 탭 접근을 막지는 못한다. 정답을 실제로 비공개 처리해야 한다면 인증 서버와 응답 권한 설계를 별도 과제로 잡아야 하며 이번 정적 사이트 확장에 섞지 않는다.

## 4. 선행 작업과 검증 계약

### R1. 공개 출처와 비공개 자료 검사 — 콘텐츠 생성 전

신규: `source/provenance.json`, `scripts/check_public_sources.py`, `tests/content/test_public_sources.py`. 변경: `.gitignore`, `docs/plans/source-publication.md`, AGENTS.md, 출제 지침, CI.

- [ ] 공개 등록 항목은 `{id, description, allowedSections}`로 정한다. Spring ID 22개와 인용 가능한 절을 등록하고 실제 파일명·해시는 넣지 않는다.
- [ ] 신규 Spring의 `sourceRefs`는 자료 ID와 절·PDF 페이지로 작성한다. 공개 원고 경로와 공식 URL도 허용한다. 기존 트랙의 출처를 일괄 삭제하거나 검증 없이 바꾸지 않는다.
- [ ] `--public-only`는 Spring의 미등록 ID·허용되지 않은 절, 공개 산출물의 비공개 경로·절대 로컬 경로를 검사한다. 일반적인 설명 문맥의 `private/` 언급까지 오류로 만들지 않고 실제 sourceRefs·링크·데이터 값과 구분한다.
- [ ] `--private-index private/spring/source-index.json`은 로컬 원본 존재·SHA-256과 실제 원본명 누출까지 확인한다. CI는 이 파일 없이도 공개 ID 검사를 할 수 있어야 한다.
- [ ] 기존 공개 자료의 파일명 출처는 명시적 legacy 범위로 관리하고 새 Spring 출처에는 허용하지 않는다. 기존 민감 경로 발견 시 파일 위치와 공개 가능한 분류만 보고하고 별도 수정한다. 검사를 녹색으로 만들기 위한 포괄 제외는 금지한다.
- [ ] 프로젝트 JSON·ZIP 내부 설정, `reports/`의 업로드 대상에도 공개 검사를 적용한다. 민감 값을 보고서에 복사하지 않는다.

인터페이스: 두 CLI 모드는 성공 0, 위반 1. 검사는 읽기 전용이다. 의도된 공개 자료 ID와 공식 링크는 통과하고, 미등록 ID·원본 이미지 링크·자리표시자가 아닌 개인 설정은 실패하는 fixture를 둔다. 비밀 문자열 탐지만으로 모든 노출을 탐지한다고 주장하지 않는다.

검증: `python -m unittest discover -s tests/content -p test_public_sources.py`, `python scripts/check_public_sources.py --public-only`, 로컬 private-index 검사. 실제 구현 후 README/CI 명령에 추가한다.

### R2. 배포 파일과 로컬 서버 경계 — 사이트 연결 전

변경: `scripts/build_site.py`, `scripts/serve.mjs`, `README.md`. 신규 검사: `tests/content/test_public_build.py`, `tests/unit/serve.test.js`, 기존 `tests/e2e/base-path.spec.js` 보완.

- [ ] fresh 원고 빌드가 만든 **전체 상대 경로 집합**을 기준으로 data의 누락·변경·추가 파일을 검사한다. backend와 Spring의 JSON·ZIP까지 재귀 비교한다.
- [ ] dist에는 검증한 fresh 데이터만 복사한다. `data/`에 우연히 남은 PDF·오래된 회차·개인 메모는 실패 처리하고 조용히 포함하지 않는다.
- [ ] assets와 HTML은 현재 공개 역할을 유지하되 금지 파일·개인 설정이 포함되는지 공개 검사를 적용한다. 출력 경로 삭제는 저장소의 의도된 dist 안인지 확인한다.
- [ ] 로컬 서버 기본 root를 dist로 바꾸고 없으면 빌드 명령을 안내한다. `SITE_DIR` override를 사용하는 경우에도 source/private/.git 같은 비공개 경로를 거부한다. 외부 심볼릭 링크·junction으로 root를 벗어나는 접근도 검사한다.
- [ ] 기존 `/study-space/` 하위 경로, assets/data, 직접 페이지 URL은 유지한다. 서버는 127.0.0.1 바인딩을 유지한다.

검증: 추가 파일이 있는 임시 data는 빌드 실패, 정상 fresh 빌드는 통과. `/private/...`, `/source/...`, `/.git/config`, 인코딩된 경로 이동과 root 밖 링크는 404이며 정상 페이지·JSON·ZIP은 200인지 검사한다. 테스트는 임시 폴더에서 수행하여 실제 원본·data에 위험한 fixture를 쓰지 않는다.

### R3. 트랙별 노트 coverage — Spring 노트·문항 연결 전

변경: `scripts/validate_questions.py`, `scripts/build_data.py`, `tests/content/test_backend_coverage.py`, `tests/content/test_pipeline.py`. 신규: `tests/content/test_spring.py`.

- [ ] `note_texts_for_track(source_root, track)`과 `validate_coverage(coverage, exams, note_texts, track='backend')` 계약을 도입한다. 기존 backend 기본 동작을 보존한다.
- [ ] TRACKS의 선택적 `coverage` 파일을 읽어 같은 검사를 적용한다. Spring 파일은 `coverage-spring.json`이며 다른 트랙 문항 ID·없는 노트 절·중복 항목은 실패한다.
- [ ] 노트 단독 트랙도 scope와 노트 연결은 검사한다. 시험 원고가 없는 Spring을 허용하도록 트랙 등록 테스트를 보완하되 기존 6개 시험 트랙의 회차 존재 검사는 유지한다. 비공개 시범은 private/임시 source root에 두며 자동 수집되는 공개 트랙 폴더에 미리 넣지 않는다.
- [ ] `coverageProfile: pilot/full`은 기존 개념-문항 연결 수준을 나타낸다. 별도의 scope 태그 coverage 검사를 생략하는 스위치로 사용하지 않는다.
- [ ] 프로젝트 target 연결은 공통 프로젝트 검사기가 확인한다. 노트 전용 심화 항목은 명시적으로 구별하되 기본 출제 태그 누락을 숨기는 데 사용하지 않는다.

검증: 기존 backend coverage fixture 그대로 통과, Spring 연결 정상 통과, Spring에서 backend 문항을 참조한 경우 실패. 공통 노트 `studyLinks`는 기존처럼 다른 트랙 노트 참조를 허용한다. 문항의 소속 검사와 복습 노트의 재사용을 혼동하지 않는다.

### R4. 월말 프로젝트 다중 트랙 지원 — Spring 프로젝트 생성 전

신규: `scripts/project_catalog.py`, `scripts/build_projects.py`, `scripts/validate_projects.py`, `assets/project-catalog.js`, `tests/unit/project-catalog.test.js`. 변경: 기존 backend 빌드·검사 wrapper, `build_data.py`, `build_site.py`, `app.js`, `project.js`, `project-attempt.js`, `project-notices.js`, `project-structure.js`, 프로젝트 관련 검사·E2E.

#### 데이터·API 계약

- Python 등록부는 `backend`와 `spring`에 대해 원고 루트, scope 경로, index 파일명, 산출물 디렉터리를 제공한다. track을 검사 없이 경로에 붙이지 않는다.
- 공통 `build_projects(source_root, output_root, track='backend')`와 `collect(source_root, track='backend')`를 사용한다. backend wrapper의 함수·CLI는 그대로 유지한다.
- `validate_projects.py --track spring --release`는 Spring의 compile·unit·DB·HTTP와 해당하는 JSP 검증 상태 및 reference/environment hash를 검사한다. 누락·실패·만료는 종료 코드 1이다. `build_site.py`와 CI의 배포 전 단계도 같은 함수를 호출한다. STS만 미검증인 상태는 별도 표시하며 공개할 수 있다는 [공개 조건 제안](spring.md)을 따른다. 기존 backend의 정적 검사 정책은 변경하지 않는다.
- backend index는 `backend-projects.json`, 기존 산출물 경로도 그대로다. Spring은 `spring-projects.json`과 `spring-projects/<projectId>/...`를 사용한다.
- manifest에 `projectTracks: {backend: {file, count, track}, spring: {file, count, track}}`를 추가한다. 기존 `webProjects`는 같은 backend 항목의 호환 alias로 유지한다. 삭제 시점은 이번 범위에서 정하지 않는다.
- `projectCatalogFor(manifest, track)`는 `projectTracks[track]`을 우선 반환하고, backend만 기존 `webProjects`로 fallback한다. 없는 track은 null이며 backend로 조용히 바꾸지 않는다.
- 프로젝트 ID는 전체 catalog에서 고유하게 검사한다. 기존 `web-01`, `web-02`는 유지하고 신규는 `spring-web-01`, `spring-web-02`다.

#### 화면·저장·기존 링크

- [ ] 홈 월말 탭과 catalog promise cache를 track별로 관리한다. backend → Spring 전환 도중 늦게 도착한 이전 fetch 결과가 현재 화면을 덮지 않게 한다.
- [ ] `?track=spring&project=...`를 지원하고 track 없는 옛 `?project=web-01`은 catalog ID로 backend를 찾는다. 존재하지 않는 프로젝트·서로 맞지 않는 track/project는 오류를 표시한다.
- [ ] `?attempt=...`는 저장 응시를 먼저 읽고 그 프로젝트 ID로 소속을 판단한다. 신규 응시/snapshot에는 track을 저장하고 옛 응시에는 backend fallback을 적용한다. catalog에서 삭제된 프로젝트라도 기존 snapshot은 열람·백업할 수 있게 한다.
- [ ] IndexedDB 저장소 이름·기존 key·응시 ID는 바꾸지 않는다. 구버전 백업의 track 누락을 읽고 두 트랙의 새 백업도 가져올 수 있게 검증한다. 기존 데이터를 일괄 재작성하지 않는다.
- [ ] 환경 안내, 단계 설명, 구조 도식의 주요 계층·언어는 프로젝트 metadata에서 읽는다. 기존 metadata가 없으면 backend 표시와 동작이 같아야 한다.
- [ ] 공개 JSON에는 원본 경로나 로그 없이 검증 단계별 상태·검증 환경을 전달하여 STS 미검증 표시가 실제 review 기록과 일치하도록 한다. 기존 backend 산출물에는 새 필드를 강제하지 않는다.
- [ ] 처음 Spring 템플릿은 Maven·Java·JSP·XML·SQL·properties로 구성하여 현재 편집/ZIP 형식을 최대한 재사용한다. YAML·HTML 등 추가 확장자가 필요해지면 언어 처리·경로 검사·백업·ZIP 검사를 함께 보완한다.
- [ ] 모범답안은 사용자가 열었을 때 표시하고 열람 사실만 기록한다. 제공 구조 설명이나 공통 흐름 도식에 완성 구현이 미리 들어가지 않게 검사한다.

검증: backend 산출물 경로·본문·ZIP 바이트와 기존 contentVersion을 보존한다. manifest의 새 필드는 의도된 차이로 검토한다. `tests/unit/project-*.test.js`, `tests/content/test_backend_projects.py`, `test_author_backend_projects.py`, backend/Spring 프로젝트 E2E에 정상 전환, 늦은 fetch, 옛 URL, 구버전 백업, 삭제된 catalog, 두 트랙 이어하기를 포함한다. snapshot·choiceOrders를 이용하는 기존 과평 응시에도 회귀가 없어야 한다.

### R5. 시범 후 선택 정리 — 생성 후 가능

- `app.js`에서 월말 카드/흐름 렌더링을 분리하고 `project.js`의 시작·편집·저장 화면 책임을 나누는 작업은 실제 중복과 테스트 경계를 보고 결정한다.
- 프로젝트별 `_master` 생성 규칙의 공통화는 Spring 첫 프로젝트가 완성된 뒤 비교한다. 처음부터 backend 저작 생성기를 추상화하여 새 원고 제작을 막지 않는다.
- 모든 `source/` 폴더 소문자 통일, 전 트랙 출처 메타데이터 이관, 홈 메뉴 전면 재설계, 프레임워크 교체는 별도 작업이다.
- 이미 공개된 원본명이나 민감정보가 실제로 발견되면 해당 파일을 특정해 처리하되 이력 재작성·기존 ID 변경을 이번 리팩토링의 자동 단계로 넣지 않는다.

## 5. 착수·회귀·완료 기준

1. 구현 세션에서도 원격 비교를 먼저 한다. 기존 사용자 변경인 `requirements-dev.txt` 삭제를 복원·스테이징하지 않는다.
2. 리팩토링 전 현재 data의 상대 경로·바이트 hash와 기존 응시/백업 fixture를 확보한다. 기존 문항 내용은 변경하지 않고 비교한다.
3. 공개 경계와 프로젝트 API 등 동작 변경은 실패 fixture를 먼저 확인한 뒤 고치고 관련 검사를 실행한다. 문서만 바꾼 이번 작업에는 제품 회귀 테스트를 새로 작성하지 않는다.
4. R1/R2, R3, R4는 각각 독립적으로 검증 가능한 변경으로 나눈다. 커밋은 자동으로 하지 않고 사용자 요청 시 해당 작업 파일만 하나씩 지정한다.
5. 전체 콘텐츠 빌드·스키마·편향·기존 정답 검증·단위·E2E와 신규 Spring 검증을 완료한 후 배포 후보로 판단한다. 원본 제외와 공개 산출물 검사도 필수다.

문제 생성 전 반드시 끝낼 부분은 **출처·버전 기준**, 사이트 연결 전에는 **공개 배포 경계와 coverage**, 월말 대량 제작 전에는 **프로젝트 다중 트랙 계약**이다. 화면 파일의 추가 분리와 전체 폴더 정리는 시범 제작 뒤로 미뤄도 된다.

## 6. 이번 조사에서 실행한 확인

- `git fetch origin` 후 status와 양방향 log 비교: 시작 당시 로컬 main과 origin/main의 차이는 0커밋. 미커밋은 `requirements-dev.txt` 삭제 1건이었다.
- `git ls-files` 확인: 현재 Spring PDF와 private 파일은 추적되지 않는다. `git check-ignore`로 PDF·private 대응표 제외를 확인했다.
- 로컬 PDF 조사 도구로 22개/1,078쪽을 집계하고 표본 254쪽을 OCR 확인했다. 조사 도구·추출물은 `private/spring/`에만 있으며 프로젝트 package 파일을 변경하지 않았다.
- 빌드·검증·화면 파일을 읽어 위 고정 경로와 배포 복사를 확인했다. 로컬 서버 접근 및 배포 추가 파일 문제를 실제 공격/배포로 재현한 것은 아니며 R2에서 임시 fixture로 검증한다.
- 현재 셸에서 사용 가능한 Python을 찾지 못했고 발견한 기존 가상환경 launcher도 원래 Python 경로가 없어 실행되지 않았다. 이번 문서 작업에서는 Python 빌드·콘텐츠 검사를 실행했다고 주장하지 않는다. 후속 구현은 Python 3.12 이상을 먼저 준비한다.

문서 검증 결과와 최종 변경 파일은 작업 보고에 별도로 남긴다. 원본 자료, 문제은행, 사이트 코드, 기존 검증 기준은 이번 계획 작성에서 수정하지 않는다.
