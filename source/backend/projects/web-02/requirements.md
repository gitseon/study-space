# 요구사항

이 프로젝트는 도서 정보를 등록, 조회, 삭제하고 로그인한 사용자만 도서 기능을 쓰게 하는 Servlet, JSP, MySQL 웹 프로젝트입니다. 제공 파일은 수정하지 않고 작성 대상 파일의 표시된 영역만 채웁니다. 실행 환경은 OpenJDK25U-jdk hotspot 25.0.3_9, Apache tomcat-11.0.27, Dynamic web module version 6.0, mysql 8.4.11입니다.

## 공통 약속

| 항목 | 값 |
| --- | --- |
| 도서 URL | `/book` (컨트롤러 `BookController`) |
| 회원 URL | `/user` (컨트롤러 `MemberController`) |
| 요청 구분 | 파라미터 `action`. 값이 없으면 `list` |
| 세션 속성 | `user`(로그인한 `Member`) |
| 요청 속성 | `list`(도서 목록), `book`(도서 한 건), `alertMsg`(화면에 보일 안내) |
| 아이디 기억 쿠키 | 이름 `email`, 체크박스 이름 `remember-me`, 값 `on` |
| 시작 데이터 | 도서 4건, 회원 2명(`manager@study.test`, `learner@study.test`, 비밀번호 `1234`) |

## R-LAYER 계층 연결

- `BookController`의 `doGet`과 `doPost`는 같은 `process`로 모입니다. `process`는 `action`에 따라 `list`, `regist`, `detail`, `delete`를 호출합니다. 정의되지 않은 값은 404입니다.
- `BookServiceImpl`은 DAO를 호출합니다. `SQLException`은 원인을 보존해 `IllegalStateException`으로 바꿉니다. 코드 중복(`SQLIntegrityConstraintViolationException`)은 `DuplicateCodeException`으로 바꿉니다.

## R-LIST 목록

- `/book` 또는 `/book?action=list`는 도서를 코드 순서로 모두 보여줍니다. 시작 데이터에서는 4행입니다.
- 데이터가 없으면 표 대신 "등록된 도서가 없습니다." 행을 보여줍니다.
- 코드는 상세 화면으로 가는 링크입니다. 출력하는 모든 값은 `c:out`으로 감쌉니다.

## R-REGIST 등록

- `GET /book?action=regist`는 등록 화면을 보여줍니다.
- `POST /book`(`action=regist`)는 `code`, `name`, `price`, `author`, `category`를 읽습니다. 모든 값이 있고 길이 제한(코드 30, 이름 50, 저자 30, 분류 30)을 지키며 가격이 0 이상의 정수일 때만 저장합니다.
- 검증에 실패하거나 코드가 중복되면 `alertMsg`를 담아 등록 화면으로 forward합니다. 저장하지 않습니다.
- 저장에 성공하면 목록으로 redirect합니다. 새로고침해도 같은 항목이 다시 등록되지 않습니다.

## R-DETAIL 상세

- `GET /book?action=detail&code=코드`는 도서 한 건을 보여줍니다.
- 코드가 없거나 해당 도서가 없으면 404 오류 화면입니다. 빈 상세 화면을 보여주지 않습니다.

## R-DELETE 삭제

- 상세 화면의 삭제 버튼은 `POST /book`(`action=delete`, `code`)입니다.
- 삭제에 성공하면 목록으로 redirect합니다. 없는 코드는 404, `GET`으로 삭제를 요청하면 405이며 어느 경우에도 데이터는 바뀌지 않습니다.

## R-LOGIN 로그인

- `GET /user?action=login`은 로그인 화면입니다. `POST /user`(`action=login`, `email`, `pass`, `remember-me`)로 로그인합니다.
- 실패하면 `alertMsg`를 담아 로그인 화면으로 forward합니다. 성공하면 세션 ID를 바꾼 뒤 세션 속성 `user`에 회원을 저장하고 목록으로 redirect합니다.
- `remember-me`가 `on`이면 `email` 쿠키를 30일 동안 저장합니다. 아니면 같은 이름과 path로 쿠키를 삭제합니다. 로그인 화면은 쿠키가 있으면 이메일을 채우고 체크박스를 선택해 둡니다.
- 머리글은 로그인 전에는 로그인 링크를, 로그인 후에는 사용자 이름과 로그아웃 링크를 보여줍니다.

## R-LOGOUT 로그아웃

- `/user?action=logout`은 세션이 있으면 무효화하고 메인으로 redirect합니다. 세션을 새로 만들지 않습니다.

## R-FILTER 로그인 필요 요청 차단

- `SessionFilter`는 `/book`에만 적용됩니다. 세션에 `user`가 있으면 요청을 넘기고, 없으면 `/user?action=login`으로 redirect합니다.
- `/user`는 필터 대상이 아니므로 로그인 요청이 필터에 걸리지 않습니다. JSP 파일 주소를 직접 여는 요청을 막는 일은 이 연습의 범위 밖입니다. 해결하려면 JSP를 `WEB-INF` 아래로 옮기고 컨트롤러로만 접근하게 합니다.

## R-ERROR 오류 화면

- 404는 `/error/404.jsp`, 500은 `/error/500.jsp`로 연결합니다. 화면에 내부 예외 정보를 보여주지 않습니다.
