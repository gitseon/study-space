# 알고노트: 자료구조와 알고리즘 모의고사

과목평가(과평)와 월말평가(월평)를 연습하는 정적 모의고사 사이트입니다. 공개 범위 목록을 바탕으로 직접 만든 연습 문제이며 실제 시험의 출제나 배점을 보장하지 않습니다.

- 과평 3회: 회차마다 객관식 21문항, 단답형 9문항, 서술형 2문항
- 월평 3회: 회차마다 구현형 3문항, 서술형 1문항
- 배포 주소: https://gitseon.github.io/study-space/ (Pages 설정 후 활성화)

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
python -m unittest discover -s tests/content
npm test
python scripts/build_site.py
SITE_DIR=dist npm run test:e2e
```

`verify_code_answers.py`는 월평 구현형의 Java 모범답안을 컴파일한 뒤 예제와 검수 케이스로 실행합니다. 결과는 `reports/code-verification.json`에 남습니다.

## 문제 작성과 수정

문제를 추가하거나 고치기 전에 [AGENTS.md](AGENTS.md)와 [QUESTION_AUTHORING.md](QUESTION_AUTHORING.md)를 읽습니다. 편향 기준의 단일 원본은 QUESTION_AUTHORING.md입니다.

- 원고는 `source/<회차 ID>/`의 `exam.json`, `questions.md`, `solutions.md`입니다.
- `data/`는 생성물입니다. 직접 고치지 않고 원고를 수정한 뒤 `python scripts/build_data.py`로 다시 만듭니다.
- 문항을 고치면 해당 문항 메타데이터의 `revision`을 올립니다. 기존 응시 기록은 당시 스냅샷으로 복습되며 새 답으로 다시 해석되지 않습니다.
- 정답과 해설은 `choiceId`로 연결합니다. 선택지 순서를 바꿔도 해설에 번호가 남지 않게 합니다.
- 길이 편향 경고를 수식 구조 등의 이유로 유지할 때는 `source/authoring-reviews.json`에 문항 ID, revision, 검사 코드, contentHash, 이유, 검토자, 검토일을 기록합니다. 문항이 바뀌면 기록이 만료되어 다시 검토해야 합니다.

### 새 회차 추가

1. `source/scope.json`의 주제 배분을 확인합니다.
2. 기존 회차 폴더를 참고해 `source/subject-04/` 같은 새 폴더를 만듭니다. 숫자만 바꾼 문제로 회차를 채우지 않습니다.
3. 위의 검증 명령을 실행하고 PR 템플릿의 콘텐츠 기록 항목을 채웁니다.

## 학습 기록 백업

답안과 진행 기록은 사용하는 브라우저에만 저장됩니다. 홈 화면의 `내려받기`로 JSON 백업을 받고 다른 브라우저에서 `가져오기`로 복원합니다. 가져오기 전에 파일 형식을 검사하며 잘못된 파일은 기존 기록을 바꾸지 않습니다.

## 배포와 되돌리기

`main`에 push하면 `deploy` 워크플로가 `check`를 먼저 실행하고, 같은 커밋에서 검증된 `dist/`만 GitHub Pages에 올립니다. 저장소 설정의 Pages 소스는 GitHub Actions로 둡니다.

이전 정상 버전으로 되돌릴 때는 문제 커밋을 `git revert`해 `main`에 push합니다. 급한 경우 Actions 탭에서 이전 정상 커밋의 `deploy` 실행을 골라 다시 실행할 수 있습니다.
