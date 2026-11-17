# 월말평가 구현 흐름

## 전체 흐름

1. 브라우저가 URL과 form 값을 보내면 `DispatcherServlet`이 받아 `ReservationController`의 메서드를 찾습니다.
2. 컨트롤러가 요청 파라미터를 바인딩하고 서비스를 호출합니다.
3. 서비스가 업무 규칙을 확인하고 `ReservationMapper`를 호출합니다. 변경 메서드는 트랜잭션 하나로 묶입니다.
4. mapper의 SQL은 `ReservationMapper.xml`의 같은 `id` 구문으로 실행되어 MySQL을 읽고 씁니다.
5. 조회 결과는 모델에 담아 뷰 이름을 반환하고 ViewResolver가 JSP를 찾아 화면을 만듭니다.
6. 등록과 취소가 끝나면 redirect로 새 GET 요청을 보내 같은 요청이 반복되지 않게 합니다.
7. 예외는 `GlobalExceptionHandler`가 상태 코드와 오류 화면으로 바꿉니다.

## 기능별 흐름

### 목록

`GET /reservations` → ReservationController.list → ReservationService.search → ReservationMapper.search → 모델 `reservations`, `rooms` → `reservation/list.jsp`

### 상세

`GET /reservations/{id}` → ReservationController.detail → ReservationService.detail → ReservationMapper.findById → 없으면 ReservationNotFoundException → `GlobalExceptionHandler` → 404 `error/not-found.jsp` / 있으면 모델 `reservation` → `reservation/detail.jsp`

### 등록

- 화면: `GET /reservations/new` → `reservation/form.jsp`
- 저장: `POST /reservations` → `@Valid` 검증 → 오류가 있으면 입력 화면 / 없으면 ReservationService.reserve(트랜잭션) → ReservationMapper.insert → redirect `/reservations/{id}`

남은 자리를 넘으면 RoomFullException이 던져져 저장은 취소되고 409 화면이 나옵니다. 같은 요청이 PRG 덕분에 새로 고침으로 반복되지 않습니다.

### 취소

`POST /reservations/{id}/delete` → ReservationController.cancel → ReservationService.cancel(트랜잭션) → ReservationMapper.delete → 0행이면 404 / 아니면 flash 메시지와 redirect `/reservations`

## 짝으로 기억할 것

| 보내는 쪽 | 받는 쪽 |
| --- | --- |
| 컨트롤러가 반환하는 뷰 이름 | `prefix` + 뷰 이름 + `suffix`의 JSP |
| 모델에 담은 이름 | JSP의 EL 이름 |
| mapper 메서드 이름 | XML 구문의 `id` |
| mapper 인터페이스의 전체 이름 | XML의 `namespace` |
