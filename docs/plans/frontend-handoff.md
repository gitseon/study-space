# 프론트엔드 문제은행 인수인계

작성일: 2026-10-10. 구현 계획과 결과는 [frontend.md](frontend.md)에 있다. 이 문서는 이어서 작업할 때 확인할 일만 모았다.

## 현재 상태

- 브랜치 `feat/mock-exam`에 프론트엔드 3회(96문항)와 트랙 구조, 화면, 검증 도구가 들어 있다.
- 복습 노트(`source/Web_복습노트.md`)를 반영해 문항 12개를 교체했다. 교체한 문항은 revision이 2다.
  - frontend-02: q01 label과 input 연결, q03 details의 open, q06 absolute 기준, q13 XHR 콜백의 this, q16 이벤트 위임, q18 XHR 비동기 순서
  - frontend-03: q07 Bootstrap 그리드, q15 prompt 취소, q21 storage 이벤트, q22 button 타입, q28 NodeList, q29 readyState
- 새 세부 주제 9개를 `source/scope-frontend.json`에 추가했다: form-label, table-details, position, bootstrap-grid, event-delegation, dialogs, node-list, xhr, storage-event.
- 검증 명령은 모두 통과했다. 프론트엔드 답안은 96문항 중 89문항을 코드 실행으로 확인한다. 나머지 7문항은 재풀이 기록이다.
- Bootstrap 5.3.3을 devDependency로 추가했다. 그리드 문항은 이 CSS로 실제 렌더링해 확인한다.

## 확인이 필요한 사항

1. **PR 만들기**: GitHub Actions 탭에서 `open-pr`을 실행한다. 순서는 아래와 같다.
   1. 저장소 Settings > Actions > General에서 `Allow GitHub Actions to create and approve pull requests`를 켠다.
   2. Actions 탭의 `open-pr`에서 `Run workflow`를 누르고 브랜치 `feat/mock-exam`과 base `main`을 고른다.
   3. 검사가 통과하면 보고서 수치로 만든 본문으로 PR이 열린다. 이 저장소는 push 트리거 실행이 만들어지지 않아 자동으로 시작되지 않는다.
   - 이 워크플로는 아직 한 번도 실행하지 않았다. 첫 실행에서 권한이나 단계 오류가 나면 로그를 보고 고친다.
2. **재풀이 7문항 검토**: 코드로 확인할 수 없는 문항이다. 목록은 `source/frontend-reviews.json`이다(frontend-01-q03, q22, q29, q31, frontend-02-q22, q32, frontend-03-q03). 다른 사람이 한 번 검토한 뒤 배포한다.
3. **복습 노트 커밋 여부**: `source/Web_복습노트.md`는 이번 커밋에 포함했고 문항의 sourceRefs가 이 파일을 가리킨다. 개인 노트를 공개 저장소에 두지 않으려면 파일을 빼고 sourceRefs의 노트 참조도 함께 정리한다.
4. **수정한 기존 문항**: `subject-01-q18`과 `subject-01-q20`의 선지 순서를 바꾸고 revision을 올렸다. 내용은 그대로다.
5. **커밋하지 않은 파일**(이번에는 판단을 보류): `A형대비/`, `source/sw advanced.txt`, `requirements-dev.txt` 삭제.
6. **노트에서 아직 다루지 않은 내용**: 복습 노트에는 Bootstrap 컴포넌트(navbar, modal, collapse), 표 접근성(`scope`), reset 스타일, 외부 CSS 연결, `window.open`, 투표 기능의 유효성 검사, XML 파싱이 있다. 3회 구성(21/9/2)은 그대로 두었기 때문에 반영하지 않았다. 더 넣으려면 회차를 늘리거나 기존 문항을 더 교체해야 한다. 이 확장은 보류 상태다.
7. **실기기 확인**: 코드 상자는 Playwright의 360px 화면에서만 검사했다. 실제 휴대폰에서 줄바꿈과 글자 크기를 본다.

## PR 기록용 수치

`open-pr` 워크플로가 보고서로 같은 표를 만든다. 수동으로 쓸 때는 `python scripts/pr_body.py`를 실행한다(`scripts/` 안에서 실행, 먼저 검증 명령으로 보고서를 만들어 둔다).

| 회차 | 정답 번호 분포 (1~4) | 최대 연속 |
| --- | --- | --- |
| 프론트엔드 1회 | 5, 5, 4, 7 | 2 |
| 프론트엔드 2회 | 5, 6, 6, 4 | 2 |
| 프론트엔드 3회 | 6, 6, 4, 5 | 2 |

- 정답 검증: 실행 89문항, 재풀이 7문항. 보고서는 `reports/frontend-verification.json`에 생긴다.

## 이어서 할 만한 작업

- 문항을 고치면 해당 문항의 revision을 올리고 `scripts/frontend_checks*.mjs`의 revision과 `choice` 문구도 같이 맞춘다. 맞지 않으면 검증이 실패한다.
- 4회 이상을 추가할 때는 `source/frontend-04/`를 만들고 `tests/e2e/frontend.spec.js`의 회차 목록과 `features.test.js`의 `assert.equal(files.length, 3)`를 고친다.
- 주제별 연습 세트는 회차 순서대로 정답 순서를 검사한다. 회차를 추가하면 세트가 길어지므로 `audit_bias.py` 결과를 다시 본다.

## 실행 방법

Node는 PATH에 없다. PowerShell에서 `$env:Path="E:\GISEON\Programs\node;C:\jdk\bin;"+$env:Path`를 먼저 실행한다. 전체 순서는 README의 검증 명령을 따른다. e2e는 `python scripts/build_site.py` 후 `SITE_DIR=dist`로 실행한다.
