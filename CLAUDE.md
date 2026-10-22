# STUDY SPACE

@AGENTS.md

위 AGENTS.md가 이 저장소의 작업 지침 원본이다. 이 파일에는 Claude Code에만 필요한 내용을 둔다. 지침이 겹칠 때는 AGENTS.md를 따르고 같은 내용을 여기에 다시 쓰지 않는다.

## 참고 문서

- 실행과 검증 명령, 새 트랙과 회차 추가법: [README.md](README.md)
- 문제 품질 기준(편향 수치, 표시 기준)의 단일 원본: [docs/QUESTION_AUTHORING.md](docs/QUESTION_AUTHORING.md)
- 트랙별 구현 계획: `docs/plans/frontend.md`, `docs/plans/ai-competency.md`

## 작업 환경

- Windows이며 셸은 PowerShell과 Git Bash를 쓴다. 줄바꿈은 `.gitattributes`가 LF로 고정한다.
- 문제와 해설은 `source/`의 원고만 고치고 `python scripts/build_data.py`로 `data/`를 다시 만든다. `data/`는 직접 수정하지 않는다.
- Python 3.12 이상, Node.js 24, Java 17 이상이 필요하다. 의존성 설치와 검증 명령은 README를 따른다.
- `private/`와 강의 원본 폴더는 `.gitignore` 대상이다. 내용을 읽더라도 커밋하거나 문서에 옮기지 않는다.

## Git 동작

- 새 세션에서는 AGENTS.md의 "새 세션의 첫 작업"대로 `origin/main`과 먼저 비교하고 결과를 보고한다.
- 작업을 끝내면 검증 결과와 바뀐 파일을 보고하고 사용자의 확인을 기다린다. 사용자가 요청하기 전에는 커밋하지 않는다.
- 커밋을 요청받으면 AGENTS.md의 Git 규칙대로 파일을 지정해 스테이징하고 작업과 무관한 미커밋 파일은 건드리지 않는다.
- 커밋 메시지 끝에는 Claude Code가 안내하는 공동 작성자 줄을 붙인다.
- push와 PR 생성도 사용자가 요청할 때만 한다.
