# 요구사항

이 프로젝트는 스터디실 예약을 목록, 검색, 상세로 조회하고 등록과 취소를 처리하는 Spring Boot MVC, JSP, MyBatis, MySQL 프로젝트입니다. 제공 파일은 수정하지 않고 작성 대상 파일의 표시된 영역만 채웁니다. 기본 CRUD는 이 연습을 위한 제안이며 공식 평가의 과제 범위가 아닙니다.

## 공통 약속

| 항목 | 값 |
| --- | --- |
| 기본 주소 | `/reservations` (컨트롤러 `ReservationController`) |
| 뷰 | `/WEB-INF/views/` 아래 JSP. 뷰 이름 `reservation/list`는 `reservation/list.jsp` |
| 모델 이름 | `reservations`(목록), `rooms`(방 목록), `reservation`(한 건), `form`(입력 객체), `message`(flash 안내) |
| DB | 환경 변수 `DB_URL`, `DB_USER`, `DB_PASSWORD`로 접속. 비밀번호는 파일에 쓰지 않습니다 |
| 시작 데이터 | 방 3개(소회의실 A 정원 6, 소회의실 B 정원 4, 세미나실 정원 10), 예약 3건 |

## R-LIST 목록과 검색

- `GET /reservations`는 예약을 번호 순서로 모두 보여 줍니다. 시작 데이터에서는 3행이고 열은 번호, 방, 예약자, 인원입니다.
- `roomId`와 `keyword`는 선택 파라미터입니다. 값이 있으면 그 조건으로만 찾습니다. 이름은 부분 일치입니다.
- 결과가 없으면 표 대신 "예약이 없습니다." 행을 보여 줍니다. 출력하는 모든 값은 `c:out`으로 감쌉니다.

## R-DETAIL 상세

- `GET /reservations/{reservationId}`는 예약 한 건(번호, 방, 예약자, 인원)을 보여 줍니다.
- 번호가 숫자가 아니면 400입니다. 해당 예약이 없으면 404 오류 화면입니다. 빈 상세 화면을 보여 주지 않습니다.

## R-REGIST 등록

- `GET /reservations/new`는 입력 화면입니다. `POST /reservations`는 `roomId`, `memberName`, `people`을 읽어 저장합니다.
- 입력 검증에 실패하면 저장하지 않고 오류 메시지와 함께 입력 화면을 다시 보여 줍니다. 입력한 값은 유지됩니다.
- 남은 자리(정원에서 이미 예약된 인원을 뺀 값)보다 많이 예약하면 저장하지 않고 409 화면을 보여 줍니다.
- 저장에 성공하면 만들어진 번호의 상세 화면으로 redirect합니다. 새로 고침해도 같은 예약이 다시 등록되지 않습니다.

## R-CANCEL 취소

- `POST /reservations/{reservationId}/delete`는 예약을 지우고 목록으로 redirect하며 "예약을 취소했습니다" 안내를 보여 줍니다.
- 지울 예약이 없으면 404 오류 화면입니다.

## 이 연습의 범위 밖

- 수정, 로그인, 파일 업로드, REST API는 다루지 않습니다.
- 사이트는 코드를 실행하거나 점수를 매기지 않습니다. 내려받은 프로젝트를 로컬에서 실행해 확인합니다.
