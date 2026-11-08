# 요구사항

이 프로젝트는 용품 정보를 등록하고 목록과 상세로 조회하며 로그인과 로그아웃을 처리하는 Servlet, JSP, MySQL 웹 프로젝트입니다. 모든 요청은 컨트롤러 하나(`GearController`)가 받습니다. 제공 파일은 수정하지 않고 작성 대상 파일의 표시된 영역만 채웁니다. 실행 환경은 OpenJDK25U-jdk hotspot 25.0.3_9, Apache tomcat-11.0.27, Dynamic web module version 6.0, mysql 8.4.11입니다.

## 공통 약속

| 항목 | 값 |
| --- | --- |
| URL | `/gear` (컨트롤러 `GearController`) |
| 요청 구분 | 파라미터 `action`. 값이 없으면 `list` |
| 세션 속성 | `user`(로그인한 `Member`) |
| 요청 속성 | `list`(용품 목록), `gear`(용품 한 건), `alertMsg`(화면에 보일 안내) |
| 시작 데이터 | 용품 4건, 회원 2명(`manager@study.test`, `learner@study.test`, 비밀번호 `1234`) |

## R-LAYER 계층 연결

- `GearController`의 `doGet`과 `doPost`는 같은 `process`로 모입니다. `process`는 `action`에 따라 `list`, `regist`, `detail`, `login`, `logout`을 호출합니다. 정의되지 않은 값은 404입니다.
- `GearServiceImpl`은 DAO를 호출합니다. `SQLException`은 원인을 보존해 `IllegalStateException`으로 바꿉니다. 코드 중복(`SQLIntegrityConstraintViolationException`)은 저장하지 못한 것이므로 `insert`가 0을 반환합니다.

## R-LIST 목록

- `/gear` 또는 `/gear?action=list`는 용품을 코드 순서로 모두 보여줍니다. 시작 데이터에서는 4행이고 열은 코드, 용품명, 가격, 색상입니다.
- 데이터가 없으면 표 대신 "등록된 용품이 없습니다." 행을 보여줍니다.
- 코드는 상세 화면으로 가는 링크입니다. 출력하는 모든 값은 `c:out`으로 감쌉니다.

## R-REGIST 등록

- `GET /gear?action=regist`는 등록 화면을 보여줍니다.
- `POST /gear`(`action=regist`)는 `code`, `name`, `price`, `brand`, `color`를 읽어 저장합니다.
- 가격이 숫자가 아니거나 코드가 중복되어 저장하지 못하면 `alertMsg`를 담아 등록 화면으로 forward합니다.
- 저장에 성공하면 목록으로 redirect합니다. 새로고침해도 같은 항목이 다시 등록되지 않습니다.

## R-DETAIL 상세

- `GET /gear?action=detail&code=코드`는 용품 한 건(코드, 용품명, 가격, 브랜드, 색상)을 보여줍니다.
- 코드가 없거나 해당 용품이 없으면 404 오류 화면입니다. 빈 상세 화면을 보여주지 않습니다.

## R-LOGIN 로그인

- `GET /gear?action=login`은 로그인 화면입니다. `POST /gear`(`action=login`, `email`, `pass`)로 로그인합니다.
- 실패하면 `alertMsg`를 담아 로그인 화면으로 forward합니다. 성공하면 세션 속성 `user`에 회원을 저장하고 메인(`/`)으로 redirect합니다.
- 머리글은 로그인 전에는 로그인 링크를, 로그인 후에는 사용자 이름과 로그아웃 링크를 보여줍니다.

## R-LOGOUT 로그아웃

- `GET /gear?action=logout`은 세션이 있으면 무효화하고 메인으로 redirect합니다. 세션을 새로 만들지 않습니다.

## 이 연습의 범위 밖

- 삭제와 수정은 다루지 않습니다.
- 로그인하지 않아도 모든 화면을 볼 수 있습니다. 로그인 여부는 머리글의 메뉴만 바꿉니다.
