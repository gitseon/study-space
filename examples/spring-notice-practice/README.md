# Spring 공지사항 API 구현 연습

커뮤니티 공간의 운영 공지를 조회하고 등록하는 Maven 프로젝트다. 준비된 DAO 인터페이스와 스키마, JUnit 테스트를 읽고 `starter/`의 TODO 네 곳을 구현한다. [Spring 개념 노트](https://gitseon.github.io/study-space/pages/concepts.html?note=spring-concepts)

## 환경 준비

- Java 21 이상과 STS 또는 Maven, MySQL 8이 필요하다. 프로젝트는 Spring Boot 4.1.0, MyBatis starter 4.1.0, Springdoc 3.0.3을 사용한다.
- STS의 **Import → Maven → Existing Maven Projects**에서 [starter/pom.xml](starter/pom.xml)이 있는 폴더를 선택한다.
- 연습 DB를 만든다. 앱이 시작되면 테이블과 초기 공지 네 건을 준비한다. 다시 시작해도 사용자가 등록한 공지는 유지된다.

```sql
CREATE DATABASE spring_notice_practice CHARACTER SET utf8mb4;
```

- 실행 구성의 **Environment**에 `PRACTICE_DB_USER`와 `PRACTICE_DB_PASSWORD`를 지정한다. JUnit 실행 구성에도 같은 환경 변수를 설정한다. 기본 JDBC 주소는 `jdbc:mysql://127.0.0.1:3306/spring_notice_practice`이며 `PRACTICE_DB_URL`로 바꿀 수 있다.
- 명령줄에서 확인하려면 `starter` 폴더에서 `mvn test`를 실행한다. 구현 전에는 테스트가 참조하는 DTO 접근자와 빌더가 없어 테스트 소스 컴파일이 실패한다.

## 구현 요구사항

### 1. Notice DTO

`Notice.java`에 다음 아홉 필드를 추가한다. Lombok으로 인자 없는 생성자, 전체 필드 생성자, Getter와 Setter, 빌더를 제공한다. 상태의 기본값은 `ACTIVE`다.

| 타입 | 필드 |
| --- | --- |
| `int` | `noticeId`, `categoryId`, `authorId`, `viewCount` |
| `boolean` | `pinned` |
| `String` | `title`, `content`, `status`, `createdAt` |

### 2. MyBatis 매퍼

`NoticeMapper.xml`에 조회와 등록 구문을 작성한다. 조회는 식별 번호 오름차순이고 DB의 `is_pinned`를 DTO의 `pinned`로 읽는다. 등록할 때는 카테고리 번호, 작성자 번호, 제목, 본문만 넘긴다. MySQL이 생성한 식별 번호를 전달받았던 DTO의 `noticeId`에 넣는다.

### 3. 서비스

`NoticeServiceImpl.java`를 서비스 빈으로 등록하고 DAO를 연결한다. 목록은 읽기 전용 트랜잭션에서 조회한다. 등록은 트랜잭션으로 묶고 제목이 없거나 공백뿐이면 INSERT 전에 `InvalidNoticeException`을 던진다. 오류 메시지는 `제목을 입력하세요.`다. 정상 등록 후 식별 번호가 채워진 DTO를 반환한다.

### 4. REST 컨트롤러

`NoticeController.java`에서 아래 계약을 구현한다. 제목 오류 응답은 제공된 `NoticeErrorHandler`가 처리한다.

| 요청 | 결과 |
| --- | --- |
| `GET /practice/notices` | `200 OK`와 공지 목록 JSON 배열 |
| `POST /practice/notices` | 공지 객체를 JSON으로 받아 `201 Created`와 문자열 `Notice Created` 반환 |
| 제목 누락 또는 공백으로 POST | `400 Bad Request`와 오류 상세 |

등록 JSON에는 기본형 필드의 값도 적는다. INSERT에서는 카테고리 번호, 작성자 번호, 제목, 본문만 사용한다.

```json
{
  "noticeId": 0,
  "categoryId": 1,
  "authorId": 2,
  "title": "공용 책상 점검 안내",
  "content": "금요일 오전에 책상과 콘센트를 점검합니다.",
  "viewCount": 0,
  "pinned": false
}
```

## 확인 및 풀이 비교

1. JUnit 8건으로 DTO, 목록 순서와 고정 여부, 자동 채번, 읽기 전용 조회, 제목 오류, INSERT 직후 예외가 날 때의 롤백, GET과 POST 응답을 확인한다.
2. `NoticePracticeApplication`을 실행하고 `http://localhost:8080/swagger-ui/index.html`에서 GET과 POST를 호출한다.
3. 풀이가 끝나면 [solution](solution/)의 네 파일과 비교한다. 비교용 사본에서 해답을 실행하려면 `solution/src/main` 아래의 네 파일을 `starter/src/main`의 같은 상대 경로에 복사하고 `mvn test`를 실행한다.
