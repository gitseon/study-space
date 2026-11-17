# 장비 대여 API 실행 검증 기록

이 문서는 모범답안(`reference/`)을 사람이 직접 확인하는 절차입니다. 자동 검증(컴파일, 단위, DB 통합, HTTP)은 `scripts/verify_spring_projects.py`가 실행해 `review.json`에 기록합니다. 화면(JSP)이 없는 프로젝트라 JSP 렌더링은 해당하지 않습니다. STS에서의 수동 실행은 사용자가 직접 확인하기 전까지 미검증으로 둡니다.

## 확인 절차

### run-build. 로컬 프로젝트 빌드와 기동

1. 내려받은 ZIP을 새 폴더에 풀고 STS에서 Maven 프로젝트로 가져옵니다.
2. 환경 변수 DB_URL, DB_USER, DB_PASSWORD를 설정하고 스터디용 스키마를 만듭니다.
3. RentalApplication을 실행하고 GET http://localhost:8080/api/equipments 를 호출합니다.

기대 결과: 컴파일 오류 없이 시작되고 장비 3건이 JSON으로 응답됩니다.

### sec-anonymous. 익명 요청의 응답

1. 로그인하지 않고 GET /api/equipments 를 호출합니다.
2. 로그인하지 않고 GET /api/rentals 를 호출합니다.

기대 결과: 장비 목록은 200이고 대여 목록은 로그인 화면이 아니라 401입니다.

### sec-login. 로그인과 로그아웃

1. mina와 study1234로 POST /login 합니다(CSRF 토큰 포함).
2. 틀린 비밀번호와 없는 아이디로 다시 로그인합니다.
3. POST /logout 을 호출합니다.

기대 결과: 성공은 200과 세션 쿠키, 실패는 401, 로그아웃은 204입니다.

### sec-roles. 역할별 접근

1. mina로 로그인해 GET /api/admin/rentals 를 호출합니다.
2. root로 로그인해 같은 주소를 호출합니다.

기대 결과: 일반 사용자는 403이고 관리자는 200입니다.

### api-rent. 대여 등록

1. mina로 로그인해 POST /api/rentals 에 {"equipmentId": 1, "days": 3}을 보냅니다.
2. 응답의 상태, Location 헤더, 본문을 확인합니다.
3. GET /api/rentals 로 목록에 보이는지 확인합니다.

기대 결과: 201과 Location, 만들어진 대여 본문이 응답되고 내 목록에 보입니다.

### api-invalid. 검증 실패

1. days에 0을 넣어 대여를 요청합니다.
2. equipmentId를 빼고 요청합니다.

기대 결과: 400과 VALIDATION_FAILED 오류가 응답되고 저장되지 않습니다.

### api-conflict. 이미 대여 중인 장비

1. jun으로 로그인해 mina가 대여 중인 장비를 대여합니다.
2. 없는 장비 번호로 대여합니다.

기대 결과: 이미 대여 중이면 409, 없는 장비는 404이고 둘 다 저장되지 않습니다.

### api-get. 대여 한 건 조회

1. mina로 로그인해 자신의 대여를 GET /api/rentals/{id} 로 조회합니다.

기대 결과: 200과 대여 본문(장비 이름 포함)이 응답됩니다.

### api-owner. 남의 대여와 관리자

1. jun으로 로그인해 mina의 대여를 조회합니다.
2. root로 로그인해 같은 대여를 조회합니다.

기대 결과: 남의 대여는 403이고 관리자는 200입니다.

### api-notfound. 없는 대여

1. 존재하지 않는 번호로 GET /api/rentals/{id} 를 호출합니다.

기대 결과: 404와 code가 NOT_FOUND인 JSON 본문이 응답됩니다.

### api-mine. 내 대여 목록

1. mina와 jun이 각각 대여한 뒤 mina로 GET /api/rentals 를 호출합니다.

기대 결과: mina의 대여만 번호 순서로 응답됩니다.

### api-admin. 관리자 전체 목록

1. root로 로그인해 GET /api/admin/rentals 를 호출합니다.

기대 결과: 모든 사용자의 대여가 번호 순서로 응답됩니다.

### api-cancel. 대여 취소

1. mina로 로그인해 자신의 대여를 DELETE 합니다(CSRF 토큰 포함).
2. 같은 번호를 다시 DELETE 합니다.
3. CSRF 토큰 없이 DELETE 합니다.

기대 결과: 처음은 204(본문 없음), 다시 하면 404, 토큰이 없으면 403입니다.

## 결과 기록

| 항목 | 결과 | 비고 |
| --- | --- | --- |
