# 월말평가 구현 흐름

## 구현 순서

| 단계 | 파일 | 확인할 결과 |
| --- | --- | --- |
| STEP 1 DTO | `Rental.java` | 조회 행과 생성된 대여 번호를 같은 타입으로 받을 수 있습니다 |
| STEP 2 매퍼 | `RentalMapper.xml` | 로그인 아이디로 조회하고 등록한 객체에 번호를 채웁니다 |
| STEP 3 서비스 | `RentalService.java` | 조회는 읽기 전용으로 실행하고 대여할 수 없는 장비는 저장하지 않습니다 |
| STEP 4 컨트롤러와 보안 | `RentalApiController.java`, 보안·예외 처리 파일 | JSON 응답의 상태와 헤더를 확인하고 권한에 따라 요청을 제한합니다 |
| 검증 | `src/test` | JUnit으로 DTO와 트랜잭션, DB, MockMvc 요청을 확인합니다 |

## 전체 흐름

1. 요청은 서블릿 컨테이너의 필터를 지나 `SecurityFilterChain`을 가장 먼저 만납니다. 인증과 인가가 여기서 정해집니다.
2. 통과한 요청만 `DispatcherServlet`을 거쳐 `RentalApiController`의 메서드로 갑니다.
3. 컨트롤러가 JSON 본문을 바인딩하고 검증한 뒤 서비스를 호출합니다. 로그인 사용자는 인증 주체에서 꺼냅니다.
4. 서비스가 업무 규칙(없는 장비, 이미 대여 중, 소유자)을 확인하고 `RentalMapper`를 호출합니다. 변경 메서드는 트랜잭션 하나로 묶입니다.
5. 응답은 `ResponseEntity`로 상태 코드와 헤더와 본문을 정합니다.
6. 예외는 `ApiExceptionHandler`가 상태 코드와 `ErrorResponse` JSON으로 바꿉니다. 권한이 없는 접근은 보안 계층이 403으로 응답합니다.

## 기능별 흐름

### 로그인

`POST /login` → 보안 필터(UsernamePasswordAuthenticationFilter) → DbUserDetailsService.loadUserByUsername → PasswordEncoder.matches → 성공 200(세션 쿠키) / 실패 401

### 대여

`POST /api/rentals` → 보안 필터(인증, CSRF) → RentalApiController.rent(`@Valid`) → RentalService.rent(트랜잭션) → RentalMapper.insert → 201과 Location

검증 실패는 400, 없는 장비는 404, 이미 대여 중이면 409입니다.

### 조회

`GET /api/rentals/{id}` → 보안 필터(인증) → RentalApiController.get → RentalService.get(소유자 확인) → RentalMapper.findById → 200 / 남의 대여 403 / 없으면 404

### 취소

`DELETE /api/rentals/{id}` → 보안 필터(인증, CSRF) → RentalApiController.cancel → RentalService.cancel → RentalMapper.delete → 204

### 관리자

`GET /api/admin/rentals` → 보안 필터(ADMIN 역할 확인) → RentalApiController.all → RentalService.all → 200 / 일반 사용자 403 / 익명 401

## 짝으로 기억할 것

| 상황 | 응답 |
| --- | --- |
| 로그인하지 않았다 | 401 |
| 로그인했지만 권한이 없다 | 403 |
| 변경 요청에 CSRF 토큰이 없다 | 403 |
| 요청 본문이 검증을 통과하지 못했다 | 400 |
| 없는 자원 | 404 |
| 현재 상태와 충돌한다 | 409 |
