# 요구사항

장비 대여를 조회하고 등록·취소하는 JSON API를 완성하는 Maven 프로젝트입니다. 제공된 스키마와 매퍼 인터페이스, JUnit 테스트를 읽고 표시된 작성 영역을 채웁니다. 이 문제는 학습용입니다.

## 단계별 구현

### STEP 1. DTO

`Rental.java`에 다음 필드 다섯 개를 표 순서로 선언합니다. Lombok으로 기본 생성자와 전체 인자 생성자, Getter와 Setter, 빌더를 제공합니다. 요청의 `RentalRequest`와 응답의 `RentalResponse`는 제공됩니다.

| 필드 | 타입 | 가져오는 값 |
| --- | --- | --- |
| `rentalId` | `Integer` | 대여 번호. 등록하기 전에는 비어 있습니다 |
| `equipmentId` | `Integer` | 장비 번호 |
| `equipmentName` | `String` | 장비를 조인해 얻는 이름 |
| `loginId` | `String` | 로그인으로 식별한 대여자 |
| `days` | `int` | 대여 일수 |

### STEP 2. MyBatis 매퍼

제공된 `RentalMapper` 인터페이스를 기준으로 XML의 `findByLoginId`, `findById`, `insert`를 작성합니다. 조회는 장비 이름을 포함하고 제공된 `resultMap`으로 매핑합니다. 내 대여 목록은 대여 번호 오름차순입니다. 등록은 장비 번호, 대여자 아이디, 일수만 넣고 생성된 번호를 같은 객체의 `rentalId`에 채웁니다.

### STEP 3. 서비스

`RentalService.mine`에 읽기 전용 트랜잭션을 선언하고 로그인 아이디로 조회합니다. `rent`는 변경 트랜잭션에서 장비 존재와 대여 가능 여부를 확인해 저장한 뒤 발급된 번호를 반환합니다. 상세 조회에서는 존재 여부와 소유자 또는 관리자 권한을 검사합니다.

### STEP 4. 컨트롤러와 보안

`RentalApiController`에서 JSON을 검증하고 로그인 사용자 정보로 서비스를 호출합니다. 예외 처리기에서 없는 자원을 404 JSON으로 바꾸고, `SecurityConfig`와 `DbUserDetailsService`를 완성하여 아래 인증·인가 계약을 만족합니다.

| 동작 | 요청 | 기대 결과 |
| --- | --- | --- |
| 내 목록 | `GET /api/rentals` | 200과 내 대여 목록 JSON |
| 등록 | `POST /api/rentals` | 201과 Location 헤더, 등록된 대여 JSON |
| 잘못된 입력 | `POST /api/rentals` | 400과 `VALIDATION_FAILED` |
| 취소 | `DELETE /api/rentals/{id}` | 204와 빈 본문 |

## 로컬 확인

제공된 `src/test`의 파일은 수정하지 않습니다. 빈칸을 채우기 전에는 필요한 DTO 접근자나 메서드가 없어 컴파일이 실패할 수 있습니다. 작성이 끝나면 연습 전용 MySQL 스키마를 연결해 `mvn test`를 실행합니다. DB와 HTTP 테스트는 대여 행을 지우고 시작 데이터를 다시 넣습니다. 브라우저나 HTTP 클라이언트로 확인할 때는 로그인 세션의 쿠키와 변경 요청의 CSRF 토큰을 함께 사용합니다.

## 공통 약속

| 항목 | 값 |
| --- | --- |
| 기본 주소 | `/api` (컨트롤러 `RentalApiController`) |
| 로그인 | form 로그인 `POST /login`(`username`, `password`). 성공은 200, 실패는 401 |
| 로그아웃 | `POST /logout`은 204 |
| 인증 방식 | 세션 쿠키. 변경 요청(POST, DELETE)은 CSRF 토큰이 필요합니다 |
| 오류 본문 | `{"code": "...", "message": "..."}` 형식의 JSON(`ErrorResponse`) |
| 사용자 | `mina`, `jun`(USER), `root`(ADMIN). 비밀번호는 모두 `study1234` |
| DB | 환경 변수 `DB_URL`, `DB_USER`, `DB_PASSWORD`로 접속합니다 |

## R-SECURITY 인증과 인가

- `GET /api/equipments`와 `/login`은 누구나 접근합니다.
- `/api/admin/**`은 `ADMIN` 역할만 접근합니다. 그 밖의 `/api/**`는 로그인한 사용자만 접근합니다.
- 로그인하지 않은 요청은 로그인 화면으로 보내지 않고 401로 응답합니다. 로그인했지만 권한이 없으면 403입니다.
- 비밀번호는 해시로 저장하며 `UserDetailsService`는 DB에서 사용자를 조회합니다. 없는 사용자는 `UsernameNotFoundException`입니다.

## R-RENT 대여

- `POST /api/rentals`는 `{"equipmentId": 1, "days": 3}`를 받아 로그인한 사용자의 대여를 저장합니다.
- 성공하면 201과 `Location: /api/rentals/{번호}`, 본문에 만들어진 대여를 응답합니다.
- `days`는 1 이상 14 이하입니다. 검증에 실패하면 저장하지 않고 400과 `VALIDATION_FAILED` 오류를 응답합니다.
- 없는 장비는 404, 이미 대여 중인 장비는 409입니다. 저장은 트랜잭션 하나로 처리합니다.

## R-ACCESS 조회

- `GET /api/rentals`는 로그인한 사용자 본인의 대여만 번호 순서로 돌려줍니다.
- `GET /api/rentals/{id}`는 본인의 대여만 볼 수 있고 관리자는 모두 볼 수 있습니다. 남의 대여는 403, 없는 번호는 404입니다.
- `GET /api/admin/rentals`는 모든 대여를 돌려줍니다.

## R-CANCEL 취소

- `DELETE /api/rentals/{id}`는 본인의 대여(관리자는 모두)를 지우고 204로 응답합니다. 본문은 없습니다.
- 없는 번호는 404, 남의 대여는 403입니다.

## R-ERROR 오류 응답

- 없는 대여와 없는 장비는 404와 `NOT_FOUND` 코드입니다. 오류 본문에 스택 트레이스나 SQL 같은 내부 정보를 담지 않습니다.

## 이 연습의 범위 밖

- JWT, OAuth, 파일 업로드, 화면(JSP)은 다루지 않습니다.
- 사이트는 코드를 실행하거나 점수를 매기지 않습니다. 내려받은 프로젝트를 로컬에서 실행해 확인합니다.
