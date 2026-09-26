# 자료구조·알고리즘 모의고사 사이트 설계안

작성일: 2026-09-26. 상태: 계획 검토용. 새 저장소 생성·제품 구현·배포는 아직 수행하지 않았다.

## 1. 목적과 확정된 요구

노션 「과평 월평 소스」 범위로 반복 학습할 수 있는 한국어 모의고사 사이트를 별도 GitHub 저장소에 만든다. 참고 저장소처럼 문제·해설 원고와 화면 코드를 분리하고 정적 사이트로 배포한다.

- 과평: 객관식 21 + 단답형 9 + 서술형 2 = 회차당 32문항.
- 월평: 구현형 3 + 서술형 1 = 회차당 4문항.
- 사용자가 선택한 월평 구현형 방식: **답안 작성·저장 + 해설·체크리스트 자기채점**.
- 정답 번호 쏠림·긴 연속 정답·선지 길이와 표현에 따른 정답 단서를 지속적으로 검사한다.
- 실제 시험 출제와 배점이 확정된 것으로 표현하지 않는다. 노션의 주제를 바탕으로 만든 연습 문제임을 표시한다.

계획의 제안값: 저장소 이름 `study-space`, 객관식 4지선다, Java 17 기준 예제, 최초 공개 과평 3회·월평 3회. 구현 시 이 값을 기본으로 사용하되 사용자 수정이 우선한다.

## 2. 참고 자료에서 확인한 내용

| 자료 | 확인 내용 | 계획에 반영할 부분 |
| --- | --- | --- |
| [참고 저장소](https://github.com/gitseon/hunnit-P.github.io) | `source/`의 문제·해설 Markdown → Python 빌드 → `data/` JSON → `index.html`, `quiz.html`; 즉시 해설, 브라우저 저장, 복습 필터, 선지 높이 맞춤 | 원고와 배포 데이터 분리, 정적 호스팅, 단순한 파일 구성 |
| [참고 사이트](https://cs-study-platform.vercel.app/ssafy/ssafyalgo) | 공개 앱 자산에서 과평 21/9/2의 2회분, 회차·주제 연습, 단답 자동채점, 서술 자기채점, 오답·북마크·백업 기능 확인 | 시험/학습 모드 구분, 단답 표기 처리, 채점 기준 공개, 복습 흐름 |
| [노션 범위](https://app.notion.com/p/3e6db04aea0e80fab638fd097767ffa2) | 과평 15개 주제, 월평 서술 3개 주제, 카드게임·배틀필드·원자 소멸 링크 | 최우선 출제 범위와 구현형 학습 유형 |

참고 저장소 확인 커밋: `0c83d6ccc8790ef29f1b16e77f3c6a89aaa9eb1a`. GitHub API에서 해당 포크의 Pages는 비활성 상태였다. 새 저장소에서는 별도로 설정한다. 참고 사이트는 HTML과 배포 JavaScript를 읽었으며 실제 화면 조작 검증은 수행하지 않았다.

다른 사이트의 문제·해설은 출제 형식과 학습 흐름을 참고한다. 새 문제는 직접 작성하고 참고 출처를 기록한다. 참고 저장소에는 확인 시점에 명시적 라이선스가 없으므로 구조를 참고해 새 코드를 작성하는 것을 기본으로 한다.

## 3. 기술 방향과 선택 이유

| 접근 | 장점 | 추가 비용 | 판단 |
| --- | --- | --- | --- |
| HTML/CSS/JavaScript 모듈 + Python 원고 빌드 + GitHub Pages | 참고 저장소와 유사하고 서버 없이 운영 가능 | 시험 상태·렌더러를 명확히 분리해야 함 | **1차 권장** |
| React/Vite + 정적 배포 | 화면 확장과 컴포넌트 재사용에 편리 | 프런트 빌드와 의존성 관리 증가 | 화면·기능이 크게 늘 때 재검토 |
| 웹앱 + 코드 실행 서버 | Java 자동채점 가능 | 실행 격리·자원 제한·운영 필요 | 사용자가 선택한 1차 범위 밖 |

브라우저는 정적 JSON을 읽고 풀이를 로컬에 저장한다. Python은 작성·검증·빌드 시에만 사용한다. 정적 페이지의 정답 데이터는 공개될 수 있으므로 시험 모드는 개인 연습용이며, 공인 시험의 답안 보안 기능을 제공하지 않는다.

## 4. 첫 공개 콘텐츠와 출제표

전체 108문항을 목표로 한다: 과평 96문항 + 월평 12문항. 먼저 과평 1회·월평 1회 36문항으로 화면과 검증기를 확인하고, 통과 후 3회분으로 확장한다. 숫자만 바꾼 중복 문제로 회차를 채우지 않는다.

과평 각 회차의 기본 배분:

| 주제군 | 객관식 | 단답형 |
| --- | ---: | ---: |
| 시간 복잡도·분할 정복 | 3 | 1 |
| 큐 메서드·트리 용어/순회·힙 | 4 | 2 |
| 재귀·완전탐색·순열/조합/부분집합·next_permutation | 3 | 2 |
| 그래프 표현·차수·BFS/DFS | 4 | 1 |
| 비트마스킹·Union-Find·경로 압축 | 3 | 1 |
| 위상정렬·백트래킹/가지치기·탐욕 | 2 | 1 |
| 이진 탐색·투 포인터 | 2 | 1 |
| 합계 | **21** | **9** |

서술형 2문항은 비트마스킹의 상태 관리/장점과 경로 압축의 필요성/효과를 중심으로 회차별 사례를 바꾼다. 출제표에는 15개 개별 주제 태그를 따로 기록해 주제군 합계만 맞고 세부 주제가 빠지는 일을 검사한다.

회차별 성격: 1회 개념·기본 추적, 2회 경계 조건·오류 분석, 3회 응용·복합 판단. 난이도 제안은 과평 32문항 기준 쉬움 10·보통 16·어려움 6이다. 공식 시험 난이도를 재현한다는 의미는 아니다.

월평 각 회차:

1. 순열 완전탐색: 「규영이와 인영이의 카드게임」의 순서 생성·점수 집계 개념을 활용한 새 문제.
2. 격자 시뮬레이션: 「상호의 배틀필드」의 방향 변경·이동·장애물 처리 개념을 활용한 새 문제.
3. 기본 알고리즘/시뮬레이션: 원자 소멸의 동시 갱신·충돌 처리 학습을 포함한다. 단순 이동·충돌 집계에서 반 단위 시간 처리로 난도를 조절한다.
4. 서술형 1문항, 소문항 3개: BFS/DFS 진행·핵심 자료구조, 인접 행렬/리스트 탐색 시간과 이유, 위상정렬의 구조적 조건.

원자 소멸 원문을 기본 난도의 확정 출제 문제로 취급하지 않는다. 원문 풀이 링크는 심화 복습에 두고, 모의고사에는 제한과 요구를 명확히 정한 새 문제를 제공한다.

## 5. 사용자 화면과 풀이 흐름

- 홈: 과평/월평, 회차, 유형별 문항 수, 난이도, 저장된 진행 상태.
- 시험 모드: 시작 시 선택한 제한 시간, 답안 수정, 문항 이동, 미응답 표시, 제출 후 채점·해설. 진행 중 정오답 색상·정답 설명이 보이지 않아야 한다.
- 학습 모드: 주제·유형 필터, 답 제출 후 즉시 해설, 정답과 각 오답의 이유.
- 결과/복습: 객관식·단답 자동채점 결과와 서술·구현 자기채점 결과를 구분하고, 오답·보류·북마크로 다시 풀기.
- 월평 구현형: 설명·제약·입출력 예시, Java 답안 입력, 자동 저장, `.java` 내려받기, 기준 풀이·복잡도·반례·체크리스트 공개.
- 기록: JSON 내보내기/가져오기. 같은 브라우저에 저장된다는 안내. 브라우저 저장 실패 시 입력은 유지하고 파일 저장 수단 제공.
- 모바일: 360px 폭에서 본문·조작 버튼 사용 가능. 코드는 별도 가로 스크롤. 키보드 탐색·명확한 포커스·라디오 그룹 제공.

제한 시간은 노션에서 확인되지 않았다. 과평 60분은 참고 사이트 기반의 **연습 기본값**, 월평 120분은 계획상의 **연습 제안값**으로 표시하고 시작 전 변경/무제한을 허용한다.

단답형은 문항별 허용 답 목록과 정규화 규칙으로만 자동채점한다. 공백·대소문자를 모든 문항에 일괄 제거하지 않는다. 일치하지 않으면 모범답안으로 자기 검토하고 사용자의 재채점 표시를 기록한다. 서술·구현은 답안 공개만으로 정답 처리하지 않으며, 미채점/부분 충족/충족 상태와 기준별 점수를 저장한다. 총점을 표시한다면 연습용 배점임을 명시한다.

## 6. 데이터와 상태 설계

원본은 `source/{examId}/questions.md`, `solutions.md`, `exam.json`이다. 질문과 해설은 안정적인 `questionId`로 연결한다. 객관식 선택지는 `choiceId`로 연결하며 정답은 `correctChoiceId`이다. 번호는 화면에 표시할 때 계산한다.

Markdown 문항 블록의 규격은 `## question: {id}`, 메타데이터 JSON 코드 블록, `### stem`, `### choice: {choiceId}`로 고정한다. 해설 파일은 같은 문항 ID 아래 `### solution`, `### choice-explanation: {choiceId}`, `### rubric`을 사용한다. 코드 블록 내부의 유사 헤더는 문항 구분자로 인식하지 않는다. 작성 예시는 문항 제작 전에 문서와 테스트 fixture로 확정한다.

Question 공통 필드: `id`, `revision`, `type`(mc/short/essay/code), `topics[]`, `difficulty`, `stem`, `sourceRefs[]`, `solution`. 유형별 필드:

- mc: `choices[{id,text}]`, `correctChoiceId`, `choiceExplanations`, `orderLocked`(기본값 false).
- short: `acceptedAnswers[]`, `normalization`(none/trim/caseFold 중 문항별 명시).
- essay/code: `rubric[{id,criterion,points}]`, `modelAnswer`; code는 `constraints`, `examples`, `reviewCases`, `language`, `complexity` 추가.
- Exam: `id`, `revision`, `questionIds[]`, `counts`, `practiceMinutes`, `defaultChoiceOrders`, `sourceScopeVersion`.

Attempt는 `attemptId`, `examId`, `contentVersion`, `mode`, `startedAt`, `deadlineAt`, `questionOrder`, `choiceOrders`, `answers`, `selfGrades`, `submittedAt`을 저장한다. 선택 답은 화면 번호가 아닌 choiceId이다. 새로고침·복습·결과 화면에서도 같은 문항/선지 배치를 복원한다. 내용 버전이 달라진 기록은 조용히 재채점하지 않고 이전 버전 표시와 새 응시를 제공한다.

기본 회차는 검수한 고정 배치로 제공한다. 다시 풀기에서 섞기를 선택하면 정답 배치 규칙을 만족하는 새로운 배치를 만들고 즉시 저장한다. 매 렌더링에서 다시 섞지 않는다. 해설은 “③이 정답” 같은 고정 번호를 직접 저장하지 않는다.

## 7. 지속적인 문제 품질 관리

새 레포 루트에 [AGENTS.md 초안](../../AGENTS.md)과 [QUESTION_AUTHORING.md](../../QUESTION_AUTHORING.md)를 그대로 옮긴다. 기준의 단일 원본은 QUESTION_AUTHORING.md이며 AGENTS.md·README·PR 템플릿에서 연결한다.

4지선다 21문항의 정답 배치는 번호별 4~7개, 같은 번호 연속 최대 2회로 제한한다. 전체 3회 63문항의 기본 배치는 번호별 14~18개로 제한한다. 반복 순환 패턴도 검사한다. 섞기 기능에도 회차의 동일 규칙을 적용한다.

번호를 섞어도 정답 선지 길이 편향은 해결되지 않는다. 길이·코드 줄 수·유일한 조건 설명·용어 일치 등을 별도로 검사한다. 자동 지표는 의미 검토의 신호이며 정답의 정확성을 희생해서 숫자를 맞추지 않는다. 기준, 동률 처리, 작은 표본 처리, 검토 기록 방식은 별도 작성 지침에 정의한다.

CI는 원고 구조 → 정답·해설 연결 → 범위·구성 → 편향 검사 → 기능 테스트 → 정적 빌드 순서로 실행한다. 필수 오류나 미검토 경고가 있으면 배포하지 않는다.

## 8. 새 저장소의 구조

```text
AGENTS.md
QUESTION_AUTHORING.md
README.md
index.html
quiz.html
review.html
assets/
  style.css
  app.js                 # 목록/필터
  quiz.js                # 응시 화면 조립
  render.js              # 안전한 Markdown/코드 표시
  attempt.js             # 응시·제출 상태
  grading.js             # 유형별 채점
  choice-order.js         # 검증된 선지 배치
  storage.js             # 버전별 저장·백업
source/
  scope.json
  authoring-reviews.json
  subject-01/{exam.json,questions.md,solutions.md}
  monthly-01/{exam.json,questions.md,solutions.md}
  ...                    # subject/monthly 02, 03
schemas/
  question.schema.json
  exam.schema.json
scripts/
  build_data.py
  validate_questions.py
  audit_bias.py
  build_site.py
tests/{content,unit,e2e}/
data/                    # 빌드 생성물, 직접 수정하지 않음
reports/                 # 검사 보고서, CI artifact
dist/                    # 공개할 정적 파일만 포함
.github/
  pull_request_template.md
  workflows/{check.yml,deploy.yml}
```

## 9. 배포와 완료 기준

새 독립 저장소 `gitseon/study-space`을 제안한다. GitHub Pages의 프로젝트 사이트 주소는 `https://gitseon.github.io/study-space/`이며, 실제 URL은 배포 결과로 확인한다.

PR에서 검증하고 main의 동일 검증 통과 후 dist만 Pages artifact로 배포한다. 모든 자산/데이터 URL은 프로젝트 하위 경로를 지원해야 한다. 저장소 설정에서 Pages Source를 GitHub Actions로 지정한다. 배포 job은 검증/빌드 job에 의존하고 `github-pages` 환경, `pages: write`, `id-token: write`를 사용한다. [공식 배포 지침](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)을 구현 시 다시 확인한다.

완료 조건:

- 과평 3회·월평 3회의 108문항이 원고/해설/배포 데이터와 일치하고 검수를 통과한다.
- 번호·연속·길이 편향 보고서에 미해결 오류/미검토 경고가 없다.
- 문제 풀이 → 새로고침 복구 → 제출 → 자기채점 → 오답 재풀이 → 백업 복원이 동작한다.
- 시험 중 정답 표시가 없고, 섞은 선택지와 해설/채점의 연결이 정확하다.
- 공개 URL에서 홈·회차·새로고침·모바일 접근을 확인한다.

이번 작업의 산출물은 설계, 실행 계획, 새 레포로 가져갈 작성 지침이다. 현재 작업 폴더는 AI Challenge 프로젝트이므로 실행 시 새 저장소를 별도 경로에 준비한다.
