# 요구사항

스터디실 예약을 조회하고 등록·취소하는 Maven 프로젝트입니다. 제공된 스키마와 매퍼 인터페이스, JUnit 테스트를 읽고 표시된 작성 영역을 채웁니다. 이 문제는 학습용입니다.

## 단계별 구현

### STEP 1. DTO

`Reservation.java`에 다음 필드 다섯 개를 표 순서로 선언합니다. Lombok으로 기본 생성자와 전체 인자 생성자, Getter와 Setter, 빌더를 제공합니다. 폼 입력은 별도로 제공된 `ReservationForm`을 사용합니다.

| 필드 | 타입 | 가져오는 값 |
| --- | --- | --- |
| `reservationId` | `Integer` | 예약 번호. 등록하기 전에는 비어 있습니다 |
| `roomId` | `Integer` | 방 번호 |
| `roomName` | `String` | 방을 조인해 얻는 이름 |
| `memberName` | `String` | 예약자 이름 |
| `people` | `int` | 예약 인원 |

### STEP 2. MyBatis 매퍼

제공된 `ReservationMapper` 인터페이스를 기준으로 XML의 `search`, `findById`, `insert`를 작성합니다. 조회한 행을 `Reservation`으로 매핑할 때 제공된 `resultMap`을 사용하고, 목록은 예약 번호 오름차순으로 정렬합니다. 등록은 방 번호, 예약자 이름, 인원만 넣고 DB에서 생성한 번호를 같은 객체의 `reservationId`에 채웁니다.

### STEP 3. 서비스

`ReservationService.search`에 읽기 전용 트랜잭션을 선언하고 두 검색 인자를 그대로 매퍼에 전달합니다. 상세 조회에서는 없는 번호를 예외로 처리합니다. 등록과 취소에는 각각 트랜잭션을 적용합니다. 등록 전에 방과 남은 자리를 검사하고 저장한 경우 받은 번호를 반환합니다.

### STEP 4. 컨트롤러와 JSP

`ReservationController`에서 요청을 바인딩하고 아래 기능별 계약을 만족하도록 모델과 뷰를 연결합니다. 목록과 상세 JSP를 완성하고, 예외 처리기에서 없는 예약을 404 화면으로 연결합니다.

| 동작 | 요청 | 기대 결과 |
| --- | --- | --- |
| 목록과 검색 | `GET /reservations` | 200과 예약 목록 JSP |
| 상세 | `GET /reservations/{reservationId}` | 200과 상세 JSP, 없는 번호는 404 |
| 등록 | `POST /reservations` | 성공하면 생성된 번호의 상세로 이동, 입력 오류면 등록 폼 |
| 취소 | `POST /reservations/{reservationId}/delete` | 취소 후 목록으로 이동 |

## 로컬 확인

제공된 `src/test`의 파일은 수정하지 않습니다. 빈칸을 채우기 전에는 필요한 DTO 접근자나 메서드가 없어 컴파일이 실패할 수 있습니다. 작성이 끝나면 연습 전용 MySQL 스키마를 연결해 `mvn test`를 실행합니다. DB와 HTTP, JSP 테스트는 예약 행을 지우고 시작 데이터를 다시 넣습니다. 테스트 후 스터디실 목록을 열어 번호 순서와 상세 이동을 직접 확인합니다.

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
