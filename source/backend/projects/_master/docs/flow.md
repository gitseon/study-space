# 월말평가 구현 흐름

## 전체 흐름

1. JSP의 form이나 링크가 URL, `action`, 입력 값을 보냅니다.
2. `SessionFilter`가 `/gear` 요청의 로그인 여부를 확인하고 허용된 요청만 넘깁니다.
3. 컨트롤러가 입력을 읽고 검증한 뒤 서비스를 호출합니다.
4. 서비스가 DAO를 호출합니다. DAO는 Connection, PreparedStatement, ResultSet으로 DB를 처리합니다.
5. 조회 결과는 request 속성에 담아 JSP로 forward합니다.
6. 등록과 삭제가 성공하면 redirect로 새 GET 요청을 보내 목록을 다시 읽습니다.
7. JSP는 EL과 JSTL로 결과와 로그인 상태를 표시합니다.

## 기능별 흐름

### 목록

`/gear` → SessionFilter → GearController.process → list → GearService.selectAll → GearDao.selectAll → request 속성 `list` → forward `/gear/list.jsp`

### 등록

- 화면: `/gear?action=regist` (GET) → forward `/gear/regist.jsp`
- 저장: form POST `/gear` (`action=regist`) → 입력 검증 → GearService.insert → GearDao.insert → redirect `/gear?action=list`

form의 `name` 속성과 `getParameter`의 이름이 같아야 값이 전달됩니다.

### 상세

링크 `/gear?action=detail&code=...` → GearService.detail → 없으면 404 / 있으면 request 속성 `gear` → forward `/gear/detail.jsp`

### 삭제

상세 화면의 form POST `/gear` (`action=delete`, `code`) → GearService.delete → 삭제된 행이 없으면 404 / 있으면 redirect `/gear?action=list`

### 로그인과 로그아웃

- 로그인: form POST `/user` (`action=login`) → GearService.login → 세션 속성 `user` 저장, 쿠키 `email` 저장 또는 삭제 → redirect `/gear?action=list`
- 로그아웃: `/user?action=logout` → 세션 무효화 → redirect `/`

### 필터와 오류 처리

- 로그인하지 않은 `/gear` 요청은 필터가 `/user?action=login`으로 redirect합니다.
- 없는 항목과 알 수 없는 action은 404, 예상하지 못한 서버 오류는 500입니다. web.xml이 두 코드를 오류 JSP에 연결합니다.

## 짝으로 기억할 것

| 보내는 쪽 | 받는 쪽 |
| --- | --- |
| form의 `name` | `request.getParameter` 이름 |
| `request.setAttribute` 이름 | JSP의 EL 이름 |
| SQL의 열 이름 | DTO의 필드와 `rs.getXxx` 이름 |
| `session.setAttribute("user")` | `sessionScope.user`와 필터의 `getAttribute("user")` |
| 쿠키 저장 path | 쿠키 삭제 path |
