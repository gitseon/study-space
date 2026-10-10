# 모의고사

여러 주제의 모의고사를 풀고 복습하는 정적 사이트입니다. 공개 범위 목록을 바탕으로 직접 만든 연습 문제이며 실제 시험의 출제나 배점을 보장하지 않습니다.

- 주소: <a href="https://gitseon.github.io/study-space/" target="_blank" rel="noopener noreferrer">https://gitseon.github.io/study-space/</a>
- 답안과 진행 기록은 사용하는 브라우저에만 저장됩니다.

## 수록 주제

| 주제 | 구성 |
| --- | --- |
| 자료구조와 알고리즘 | 과목평가 3회(회차마다 객관식 21, 단답형 9, 서술형 2)와 월말평가 3회(회차마다 구현형 3, 서술형 1) |
| 프론트엔드 | 과목평가 3회(회차마다 객관식 21, 단답형 9, 서술형 2). HTML, CSS, JavaScript, DOM, 비동기, 웹 스토리지를 7개 주제로 나눠 연습 |

새 주제를 추가하면 이 표에 한 줄을 더합니다.

## 로컬 실행

Python 3.12 이상, Node.js 24, Java 17 이상이 필요합니다.

```text
npm ci
npx playwright install chromium
python scripts/build_data.py
npm run serve
```

브라우저에서 `http://127.0.0.1:4173/study-space/`을 엽니다. GitHub Pages와 같은 하위 경로로 동작을 확인하기 위해서입니다.

## 검증 명령

배포 전에 모두 통과해야 합니다. CI도 같은 순서로 실행합니다.

```text
python scripts/build_data.py
python scripts/validate_questions.py
python scripts/audit_bias.py --strict --report reports/bias.json
python scripts/verify_code_answers.py
node scripts/verify_frontend_answers.mjs
python -m unittest discover -s tests/content
npm test
python scripts/build_site.py
SITE_DIR=dist npm run test:e2e
```

`verify_code_answers.py`는 월평 구현형의 Java 모범답안을 컴파일한 뒤 예제와 검수 케이스로 실행합니다. 결과는 `reports/code-verification.json`에 남습니다.

`verify_frontend_answers.mjs`는 프론트엔드 문항에 나온 코드를 실제로 실행해 정답과 비교합니다. JavaScript는 Node로, DOM과 CSS는 Chromium으로 실행합니다. 실행할 수 없는 개념 문항은 `source/frontend-reviews.json`의 재풀이 기록으로 대신하며 문항 revision이 바뀌면 기록이 만료됩니다. 결과는 `reports/frontend-verification.json`에 남습니다.

## 문제 작성과 수정

문제를 추가하거나 고치기 전에 [AGENTS.md](AGENTS.md)와 [QUESTION_AUTHORING.md](QUESTION_AUTHORING.md)를 읽습니다. 편향 기준의 단일 원본은 QUESTION_AUTHORING.md입니다.

- 원고는 `source/<회차 ID>/`의 `exam.json`, `questions.md`, `solutions.md`입니다.
- `data/`는 생성물입니다. 직접 고치지 않고 원고를 수정한 뒤 `python scripts/build_data.py`로 다시 만듭니다.
- 문항을 고치면 해당 문항 메타데이터의 `revision`을 올립니다. 기존 응시 기록은 당시 스냅샷으로 복습되며 새 답으로 다시 해석되지 않습니다.
- 정답과 해설은 `choiceId`로 연결합니다. 선택지 순서를 바꿔도 해설에 번호가 남지 않게 합니다.
- 수식은 `$...$` 안에 LaTeX로 씁니다. 화면에서는 저장소에 포함된 KaTeX(`assets/vendor/katex`)로 렌더링하며 `npm test`가 모든 수식을 엄격 모드로 검사합니다.
- 코드 블록은 4칸 들여쓰기와 중괄호를 갖춘 표준 Java 형식으로 씁니다.
- 트리와 그래프 도식은 ` ```tree `와 ` ```graph ` 블록으로 씁니다. 형식은 QUESTION_AUTHORING.md 6절에 있으며 잘못된 도식은 `validate_questions.py`가 오류로 잡습니다.
- 개념 문항의 제목은 풀이 중에는 숨겨지고 해설에서 "주제"로 표시됩니다.
- 길이 편향 경고를 수식 구조 등의 이유로 유지할 때는 `source/authoring-reviews.json`에 문항 ID, revision, 검사 코드, contentHash, 이유, 검토자, 검토일을 기록합니다. 문항이 바뀌면 기록이 만료되어 다시 검토해야 합니다.

### 새 트랙과 회차 추가

1. 트랙의 범위 파일을 확인합니다. 자료구조와 알고리즘은 `source/scope.json`이고 프론트엔드는 `source/scope-frontend.json`입니다.
2. 기존 회차 폴더를 참고해 `source/subject-04/`나 `source/frontend-04/` 같은 새 폴더를 만듭니다. 프론트엔드 회차는 `exam.json`에 `"track": "frontend"`를 씁니다. 숫자만 바꾼 문제로 회차를 채우지 않습니다.
3. 위의 검증 명령을 실행하고 PR 템플릿의 콘텐츠 기록 항목을 채웁니다.

## 개념 노트

홈 화면의 `Web 개념` 버튼은 개념 요약 노트(`concepts.html`)를 엽니다. 원고는 `source/web개념 요약노트.md`이고 `python scripts/build_data.py`가 `data/web-concepts.md`로 복사합니다. 노트 목록은 `scripts/build_data.py`의 `NOTES`에 있으며 새 노트는 한 줄을 더하면 홈에 버튼이 생깁니다. 제목과 구획 수와 깨진 글자와 코드 형식은 `validate_questions.py`가 검사합니다.

## 풀이 방식

- 회차 카드에서 채점 방식과 제한 시간을 고른 뒤 시작합니다. 채점 방식은 풀이 화면 위쪽에서 언제든 바꿀 수 있으며 답은 그대로 유지됩니다. 이미 정답을 확인한 문제는 방식을 바꿔도 공개된 채로 잠겨 있습니다.
- **모두 풀고 한 번에 채점**: 제출 전에는 정답과 해설이 보이지 않습니다.
- **한 문제씩 정답 확인**: 답을 고르고 `정답 확인`을 누르면 바로 채점됩니다. 확인한 문제의 답은 바꿀 수 없고 진행 중 정답과 오답 수가 표시됩니다.
- 결과 화면에서 정답, 오답, 미응답, 채점 대기 수를 보여 줍니다. `틀린 문제만` 필터로 오답과 미응답 문제만 복습할 수 있고, 홈의 기록에서도 바로 열 수 있습니다.

## 학습 기록 백업

답안과 진행 기록은 사용하는 브라우저에만 저장됩니다. 홈 화면의 `내려받기`로 JSON 백업을 받고 다른 브라우저에서 `가져오기`로 복원합니다. 가져오기 전에 파일 형식을 검사하며 잘못된 파일은 기존 기록을 바꾸지 않습니다.

## 풀 리퀘스트 만들기

이 저장소는 push로 워크플로 실행이 만들어지지 않습니다. GitHub의 Actions 탭에서 `open-pr`을 고르고 `Run workflow`로 브랜치를 선택해 실행합니다. 전체 검사를 돌린 뒤 보고서의 수치로 PR 본문을 만들어 PR을 엽니다. 이미 열린 PR이 있으면 본문만 갱신합니다. 저장소 설정의 Actions 권한에서 `Allow GitHub Actions to create and approve pull requests`를 켜 두어야 합니다. `check`도 같은 방식으로 단독 실행할 수 있습니다.

## 배포와 되돌리기

`deploy` 워크플로는 `check`를 먼저 실행하고, 같은 커밋에서 검증된 `dist/`만 GitHub Pages에 올립니다. 저장소 설정의 Pages 소스는 GitHub Actions로 둡니다. 배포는 세 경로로 시작됩니다.

- `npm run deploy`: `main`을 push하고 바로 배포 워크플로를 실행합니다. 평소에는 이 명령을 씁니다.
- `main` push: push 트리거입니다. 이 저장소에서는 아직 push로 실행이 생성되지 않아 확인 중입니다.
- 정기 실행: 매시 17분과 47분에 `main`의 최신 커밋이 배포된 커밋과 다르면 배포합니다. 같으면 검사 없이 끝납니다.

이전 정상 버전으로 되돌릴 때는 문제 커밋을 `git revert`해 `main`에 push합니다. 급한 경우 Actions 탭에서 이전 정상 커밋의 `deploy` 실행을 골라 다시 실행할 수 있습니다.
