# 자료구조·알고리즘 모의고사 사이트 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. 실행 방식은 구현 착수 시 사용자의 선택과 세션 지침에 따른다.

**Goal:** 노션의 출제 주제에 맞춘 과평·월평 모의고사 3회씩을 제공하는 정적 사이트를 새 저장소에 만들고 GitHub Pages에 배포한다.

**Architecture:** 원본 Markdown/메타데이터를 Python으로 검사·변환하고 브라우저는 생성 JSON을 읽는다. JavaScript 모듈이 응시 상태·채점·선지 배치·브라우저 저장을 담당한다. 월평 구현형은 답안 작성·저장·자기채점 방식이다.

**Tech Stack:** HTML, CSS, JavaScript ES modules, Python 3.12+, Java 17 예제, Node.js 24 개발 도구, Node test runner, Playwright, GitHub Actions/Pages. 프런트 프레임워크·실행 서버는 1차에 필요하지 않다. 패키지는 구현 시 버전을 확정하고 lockfile에 고정한다.

**Spec:** [설계안](../specs/2026-09-26-algorithm-mock-exam-design.md). 이 계획은 검토용이며 제품 구현과 원격 저장소 생성은 아직 시작하지 않았다.

## Global Constraints

- 별도 저장소 이름 제안: `gitseon/study-space`. 현재 AI Challenge 저장소의 제품 코드를 변경하지 않는다.
- 과평 1회는 객관식 21·단답 9·서술 2. 월평 1회는 구현 3·서술 1.
- 최초 공개는 각각 3회, 총 108문항. 첫 검증 단위는 각각 1회, 총 36문항.
- 4지선다 정답은 회차별 번호당 4~7개, 전체 63개에서는 번호당 14~18개. 동일 정답 연속 최대 2개.
- 모든 나머지 편향·작성 규칙은 [QUESTION_AUTHORING.md](../../QUESTION_AUTHORING.md)를 그대로 적용한다.
- 새 레포 첫 커밋에 [AGENTS.md](../../AGENTS.md)와 QUESTION_AUTHORING.md를 루트에 배치한다.
- 원고가 단일 원본이며 생성 데이터는 직접 편집하지 않는다. 정답·답안·해설 연결은 안정적인 ID를 사용한다.
- 시험 모드 해설은 제출 후 공개한다. 서술·구현의 답안 열람은 채점 완료를 의미하지 않는다.
- 실제 시험 시간·배점·문항을 보장하지 않는다. 초기 시간은 과평 60분/월평 120분의 변경 가능한 연습값이다.

## Review Focus

- 선지 섞기 후 답안·해설·새로고침 복원이 일치해야 한다 → Task 3·4의 choiceId 검증.
- 객관식·단답을 푼 직후 시험 모드의 상태색/접근성 텍스트에 정오답이 새지 않아야 한다 → Task 4 E2E.
- 저장 차단·손상 파일·내용 개정으로 입력이 사라지거나 다른 답으로 채점되지 않아야 한다 → Task 3·4의 저장/버전 테스트.
- 동률 선지 길이·코드 블록·작은 표본으로 편향 지표가 잘못 계산되지 않아야 한다 → Task 2 fixture.
- GitHub Pages 하위 경로, 타이머의 백그라운드 정지, 모바일 코드 폭이 정상이어야 한다 → Task 4·6 E2E.

## Task 1: 독립 저장소와 검증 가능한 원고 규격

**Files:** 루트 AGENTS.md, QUESTION_AUTHORING.md, README.md, `.gitignore`, `package.json`, `package-lock.json`, `requirements-dev.txt`; `schemas/question.schema.json`, `schemas/exam.schema.json`; `source/scope.json`; `scripts/build_data.py`; `tests/content/test_build_data.py`; `tests/content/fixtures/`.

**Interfaces:**

- `parse_exam(source_dir: Path) -> dict`: 설계안의 Question/Exam 스키마로 반환. 유형 오류·문항 ID 중복·해설 누락은 `ContentError`와 파일/문항 ID를 포함한다.
- `build_data(source_root: Path, output_root: Path) -> list[dict]`: 회차 JSON과 manifest를 생성한다. 출력은 같은 원고에서 재현 가능하다.
- scope.json은 15개 주제 ID, 7개 주제군의 21/9 배분, 월평 3/1을 정의한다.

- [ ] 구현 승인이 나면 현재 작업 폴더와 분리된 경로에 새 Git 저장소를 준비한다. 원격 이름 충돌을 확인한다. 가져갈 두 지침의 첫 문단을 새 레포의 실제 적용 상태로 수정한다.
- [ ] 설계안의 Markdown 문항 블록과 예제 원고를 README에 명시하고, 4유형을 포함하는 최소 fixture를 작성한다.
- [ ] `test_parse_four_types`, `test_duplicate_id_rejected`, `test_missing_solution_rejected`, `test_heading_inside_code_preserved`를 먼저 작성하고 실패를 확인한다. 핵심 assertion은 `types == {'mc','short','essay','code'}`와 코드 블록의 `## question:` 문자열 보존이다.
- [ ] 파서·스키마·CLI를 구현한다. ID와 선택지 해설의 누락을 빈 문자열로 채워 넘어가지 않는다. Node ESM과 `node --test` 명령을 설정한다.
- [ ] `python -m unittest discover -s tests/content`를 실행한다. fixture의 변환 결과와 manifest 개수 일치를 확인하고 커밋한다.

## Task 2: 콘텐츠 검증과 편향 검사

**Files:** `scripts/validate_questions.py`, `scripts/audit_bias.py`, `source/authoring-reviews.json`, `tests/content/test_validation.py`, `tests/content/test_bias.py`, `.github/pull_request_template.md`.

**Interfaces:**

- `validate_bank(exams: list[dict], scope: dict) -> list[Issue]`.
- `audit_bias(exams: list[dict], reviews: list[dict]) -> Report`.
- Issue: `code`, `severity`, `examId`, `questionId?`, `message`, `contentHash`. Report: `metrics`, `issues`, `unresolvedCount`.
- strict CLI는 필수 오류 또는 검토되지 않은 경고가 하나라도 있으면 종료 코드 1, 없으면 0. 보고서는 `reports/bias.json`.

- [ ] 먼저 정답 수 21, 전체 63, 주제 배분, 정답/해설 참조의 정상·오류 fixture를 작성한다.
- [ ] 다음 편향 assertion을 테스트한다: `[1,1,1]`은 연속 오류, `[1,2,1,2,1,2]`는 반복 오류, `[1,2,3,1,2,3]`는 반복 오류, 21개 중 한 번호 8개는 분포 오류.
- [ ] 동일 길이 4개 선지는 가중 최장값 `0.25`, 유일한 최장 정답은 `1.0`, 19문항 표본의 집계 비율은 판정 대신 정보만 출력하도록 테스트한다. revision 또는 contentHash가 바뀌면 기존 경고 검토가 무효인지 확인한다.
- [ ] 문서의 수치와 길이 정의대로 검증기·보고서를 구현한다. 코드 선지 줄 수와 ID별 수정 대상도 출력한다.
- [ ] PR 템플릿에 정답 분포/연속/길이·표현/해설 검수 결과를 추가한다. `python -m unittest discover -s tests/content` 통과 후 커밋한다.

## Task 3: 응시 상태·선지 배치·채점·저장

**Files:** `assets/attempt.js`, `assets/choice-order.js`, `assets/grading.js`, `assets/storage.js`; `tests/unit/attempt.test.js`, `choice-order.test.js`, `grading.test.js`, `storage.test.js`.

**Interfaces:**

- `createAttempt(exam, {mode, now, durationMinutes, shuffle}) -> Attempt`.
- `planChoiceOrder(questions, seed, policy) -> {questionOrder, choiceOrders} | null`: 최대 1,000회 시도 뒤 실패하면 null. orderLocked를 보존한다.
- `gradeAnswer(question, answer) -> {status, points, maxPoints, gradingMethod}`. 상태는 correct/incorrect/unanswered/pending-review. 자동 채점과 자기채점 결과를 구분한다.
- `remainingSeconds(attempt, now) -> number`: deadlineAt와 현재 시각 차이를 0 이상 정수로 반환한다.
- `saveAttempt(attempt) -> {saved, reason?}`, `loadAttempt(id, contentVersion) -> {attempt?, status}`, `exportProgress() -> object`, `validateImport(value) -> {valid, errors}`.

- [ ] 선택지 순서를 바꿔도 같은 choiceId는 동일하게 채점되고, 저장 후 읽으면 choiceOrders가 같다는 테스트를 먼저 작성한다.
- [ ] 고정 seed 1,000개로 21문항 배치가 분포/연속/반복 조건을 지키는지 검증한다. 가능한 배치를 찾지 못하면 기본 검수 배치로 돌아가는 동작을 별도 테스트한다.
- [ ] 단답형의 문항별 normalization, 미응답, 정답 보기만 한 essay/code의 pending-review 상태를 검증한다. 맞춤법이 다른 자유서술을 임의로 자동 정답 처리하지 않는다.
- [ ] 저장 용량/차단, 깨진 JSON, 버전 불일치, 다른 사이트의 백업 파일을 테스트한다. 가져오기는 검증 후 사용자에게 충돌 기록의 보존/교체를 선택하게 하며 취소하면 기존 기록을 유지한다.
- [ ] 저장·채점·시간 계산 모듈을 구현하고 `npm test` 통과 후 커밋한다. 새 콘텐츠 버전의 답으로 이전 기록을 자동 재해석하지 않는다.

## Task 4: 학습·시험·자기채점 화면

**Files:** `index.html`, `quiz.html`, `review.html`, `assets/app.js`, `assets/quiz.js`, `assets/render.js`, `assets/style.css`; `tests/e2e/exam.spec.js`, `monthly.spec.js`, `storage.spec.js`; `playwright.config.js`.

**Interfaces:**

- URL: `quiz.html?exam=subject-01&mode=exam`, `review.html?attempt={id}`. 유효하지 않은 exam/attempt는 안내와 목록 링크를 표시한다.
- 화면 이벤트는 Task 3의 Attempt를 업데이트한다. 보기 숫자로 답을 저장하지 않는다.
- Markdown/코드는 검증된 렌더러와 HTML sanitization을 사용한다. 답안 텍스트를 HTML로 삽입하지 않는다.

- [ ] 네 유형의 fixture로 홈→응시→새로고침→제출→검토 E2E를 먼저 작성한다. 제출 전 `.correct-choice`와 정답 해설이 없어야 한다.
- [ ] 답안 수정·문항 이동·미응답 표시, 제출 확인, deadlineAt 기준 타이머를 구현한다. 만료 시 한 번만 자동 제출하며 새로고침이 시간을 초기화하지 않는다.
- [ ] 학습 모드 즉시 해설과 시험 모드 제출 후 해설을 구현한다. 모든 선지 해설을 현재 표시 번호와 올바른 choiceId로 보여준다.
- [ ] 코드 답안 입력/자동 저장/파일 내려받기와 기준별 자기채점을 구현한다. 자동채점 결과와 자기채점 점수를 분리한다.
- [ ] 오답·보류·북마크·JSON 백업/가져오기를 구현한다. storage 실패 후에도 입력 영역과 내보내기 기능이 유지되어야 한다.
- [ ] 360px 화면과 키보드만으로 응시 가능한지 확인한다. 1차 fixture에서 `npm test`와 `npm run test:e2e` 통과 후 커밋한다.

## Task 5: 과평·월평 3회분 작성과 해설 검수

**Files:** `source/subject-01/`~`subject-03/`, `source/monthly-01/`~`monthly-03/`의 exam.json/questions.md/solutions.md; `source/authoring-reviews.json`; `tests/content/reference-cases/`.

**Interfaces:** Task 1의 스키마와 Task 2의 출제표/편향 검사기를 사용한다. 회차는 안정적인 questionId와 revision을 갖는다. 모든 구현형은 Java 기준 풀이와 reviewCases를 제공한다.

- [ ] 각 회차 15개 세부 주제 태그·유형별 수·난이도·비슷한 문항 여부를 출제표에서 확인한다.
- [ ] 먼저 과평 1회 32문항·월평 1회 4문항을 작성한다. 선택지 위치를 정하기 전에 정답·오답의 의미와 해설을 검토한다.
- [ ] Java 추적 문제와 구현형 기준 풀이를 예제·경계·반례로 실행한다. 원자 충돌 유형에는 반 단위 충돌과 3개 이상 동시 충돌을 포함한다.
- [ ] 파서→스키마→편향 보고서를 실행하고 오류를 수정한다. 길이 경고는 문장 개선 또는 근거가 있는 검토 기록으로 처리한다.
- [ ] 1회분으로 실제 풀이 흐름을 확인한 뒤 2·3회분을 추가한다. 같은 문제의 숫자 변경만으로 회차를 구성하지 않는다.
- [ ] 기본 선지 배치를 전체 63개 정답 기준까지 검사한다. 총 108개, 과평 96개/월평 12개, 정답·해설·입출력 예시 일치를 확인하고 커밋한다.

## Task 6: CI·GitHub Pages 배포와 인수인계

**Files:** `scripts/build_site.py`, `.github/workflows/check.yml`, `.github/workflows/deploy.yml`, README.md; `tests/e2e/base-path.spec.js`.

**Interfaces:** `build_site(output_dir: Path) -> None`은 검증된 html/assets/data만 dist에 복사한다. Pages는 검증된 동일 커밋의 dist artifact를 배포한다.

- [ ] 로컬 서버를 `/study-space/` 하위 경로로 열어 홈·회차 JSON·리뷰 화면·새로고침을 테스트한다. `/assets/...` 같은 루트 절대경로 의존을 제거한다.
- [ ] check workflow에 `build_data`, `validate_questions`, `audit_bias --strict`, Python/Node 테스트, Playwright, `build_site`를 연결한다. 오류가 있는 시험 fixture로 검증 실패를 확인한다.
- [ ] main 통과 이후에만 실행되는 deploy workflow를 만든다. 공식 Pages 문서를 기준으로 action 버전을 확인하고 검증/배포 의존성·환경·권한을 설정한다.
- [ ] 구현과 로컬 검증 완료 후 새 GitHub 저장소 생성/push 및 Pages 설정을 수행한다. 실행 세션에서 원격 생성·공개 배포 권한을 확인하고 필요한 플랫폼 승인을 처리한다.
- [ ] 배포 완료 URL에서 과평 1회와 월평 1회의 전체 흐름, 360px 화면, 답안 복구·자기채점을 확인한다. URL을 예측한 것만으로 배포 성공을 선언하지 않는다.
- [ ] README에 접속 주소, 실행법, 새 회차 추가법, 두 작성 지침, 백업 방법, 검증 명령, 이전 정상 커밋 재배포 방법을 기록한다.

## 계획의 검토 결과

요구사항은 Task 1~6에 연결되어 있다. 사용자가 선택한 월평 자기채점 방식을 반영했다. 선지 편향 기준은 레포 지침·검증기·회차 작성·CI에 모두 연결했다. 서버 자동채점, 계정/클라우드 동기화, 대규모 문제은행은 후속 확장 항목이다.

구현 전 확인할 제안값은 저장소 이름, 첫 공개 3회분, 연습 제한 시간이다. 현재 문서는 이 값의 기본안을 제공하므로 상세 구현 계획을 다시 처음부터 만들 필요는 없다.
