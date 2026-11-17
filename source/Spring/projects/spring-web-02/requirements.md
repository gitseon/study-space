# 요구사항

이 프로젝트는 장비 대여를 JSON API로 처리하는 Spring Boot REST, MyBatis, Spring Security(form 로그인과 세션) 프로젝트입니다. 제공 파일은 수정하지 않고 작성 대상 파일의 표시된 영역만 채웁니다. 이 예제는 연습을 위한 제안이며 공식 평가의 과제 범위가 아닙니다.

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
