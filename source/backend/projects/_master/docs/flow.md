# 월말평가 구현 흐름

## 전체 흐름

1. JSP의 form이나 링크가 URL, `action`, 입력 값을 보냅니다.
2. 컨트롤러가 `action`으로 처리할 메서드를 고르고 입력을 읽어 서비스를 호출합니다.
3. 서비스가 DAO를 호출합니다. DAO는 Connection, PreparedStatement, ResultSet으로 DB를 처리합니다.
4. 조회 결과는 request 속성에 담아 JSP로 forward합니다.
5. 등록이 성공하면 redirect로 새 GET 요청을 보내 목록을 다시 읽습니다.
6. JSP는 EL과 JSTL로 결과와 로그인 상태를 표시합니다.

## 기능별 흐름

### 목록

`/gear` → GearController.process → list → GearService.selectAll → GearDao.selectAll → request 속성 `list` → forward `/gear/list.jsp`

### 등록

- 화면: `/gear?action=regist` (GET) → forward `/gear/regist.jsp`
- 저장: form POST `/gear` (`action=regist`) → GearService.insert → GearDao.insert → redirect `/gear?action=list`

form의 `name` 속성과 `getParameter`의 이름이 같아야 값이 전달됩니다. 가격이 숫자가 아니거나 코드가 중복되면 `alertMsg`를 담아 등록 화면으로 forward합니다.

### 상세

링크 `/gear?action=detail&code=...` → GearService.detail → 없으면 404 / 있으면 request 속성 `gear` → forward `/gear/detail.jsp`

### 로그인과 로그아웃

- 화면: `/gear?action=login` (GET) → forward `/login-form.jsp`
- 로그인: form POST `/gear` (`action=login`) → GearService.login → 실패하면 `alertMsg`와 함께 로그인 화면 / 성공하면 세션 속성 `user` 저장 → redirect `/`
- 로그아웃: `/gear?action=logout` → 세션 무효화 → redirect `/`

## 짝으로 기억할 것

| 보내는 쪽 | 받는 쪽 |
| --- | --- |
| form의 `name` | `request.getParameter` 이름 |
| `request.setAttribute` 이름 | JSP의 EL 이름 |
| SQL의 열 이름 | DTO의 필드와 `rs.getXxx` 이름 |
| `session.setAttribute("user")` | JSP의 `sessionScope.user` |
