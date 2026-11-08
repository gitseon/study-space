# STS 검증 절차: {{title}}

이 문서는 모범답안(`reference/`)이 실제 환경에서 동작하는지 Spring Tools for Eclipse(STS)에서 확인하는 절차입니다. 구현 코드는 `reference/` 폴더에 따로 있고, 단계별 연습 시작 파일은 `starter/`와 `stages/`에 있습니다. 이 문서는 학습자에게 공개하는 자료가 아닙니다.

검증 대상 환경은 OpenJDK25U-jdk hotspot 25.0.3_9, Apache tomcat-11.0.27, Dynamic web module version 6.0, mysql 8.4.11입니다. 이 문서를 만든 시점에는 `javac` 컴파일(Java 21 릴리스, Servlet API 6.0.0)과 Jasper JSP 번역과 컴파일까지 확인했고 Tomcat 기동과 DB 연결은 확인하지 않았습니다. 아래 결과표를 채워 알려 주세요.

## 1. 준비

1. MySQL에서 `reference/src/main/resources/{{sqlFile}}`을 실행합니다. 데이터베이스 `{{db}}`가 만들어지고 같은 이름의 기존 데이터베이스는 초기화됩니다. 다른 이름의 데이터베이스는 건드리지 않습니다.
2. MySQL 계정은 `src/main/java/com/ssafy/sample/util/DBUtil.java`의 `ssafy` / `ssafy`입니다. 다르면 이 파일의 USER와 PASSWORD를 로컬에 맞게 바꿉니다.
3. STS에서 `File > Import > Maven > Existing Maven Projects`로 `reference/` 폴더를 선택합니다.
4. 프로젝트의 Java Compiler 준수 수준이 21 이상인지, `Project Facets`의 Dynamic Web Module이 6.0인지 확인합니다. Maven 가져오기에서 facet이 6.0으로 잡히지 않으면 `Properties > Project Facets`에서 6.0으로 맞추고 Runtimes에서 Tomcat 11.0.27을 선택합니다.
5. `Servers` 탭에서 Tomcat v11.0 서버를 만들고 이 프로젝트를 추가한 뒤 시작합니다. 접속 주소는 `http://localhost:8080/<컨텍스트 이름>/`입니다. 컨텍스트가 `/`가 아닌 경우의 기대 동작도 같습니다.

가져오기에서 `mysql-connector-j`, JSTL 의존성 오류가 나면 `Maven > Update Project`로 다시 받습니다.

## 2. 점검 항목

각 항목을 순서대로 실행하고 결과표에 `통과`, `실패`, `해당 없음` 중 하나와 메모를 적습니다. 항목 번호는 사이트의 체크리스트 ID와 같습니다.

{{checklistSections}}

## 3. 추가 확인

| 확인 | 방법 | 기대 결과 |
| --- | --- | --- |
| 한글 POST | 한글 이름과 한글 브랜드로 등록 | 목록에서 글자가 깨지지 않음 |
| 문자 가격 | 개발자 도구로 `price` 값을 `abc`로 바꿔 등록 | 500 오류 없이 안내 문구와 등록 화면, DB 변경 없음 |
| 콘솔 로그 | 로그인 시 서버 콘솔 확인 | 비밀번호 값이 `****`로 가려짐 |
| 쿠키 속성 | 아이디 기억하기를 체크해 로그인한 뒤 개발자 도구 Application > Cookies 확인 | `email` 쿠키의 Path가 컨텍스트 경로(루트 컨텍스트는 `/`)이고 만료가 약 1년 뒤. 체크하지 않고 로그인하면 쿠키가 사라짐 |

## 4. 결과표

| 항목 ID | 결과 | 메모 |
| --- | --- | --- |
{{resultRows}}

## 5. 알려 줄 내용

- 실행한 STS, JDK, Tomcat, MySQL 버전
- 실패한 항목의 번호와 증상(화면 문구, 콘솔 오류 앞뒤 몇 줄)
- 코드를 고쳤다면 고친 파일과 내용

모든 항목이 통과하고 실행 환경이 기록되기 전까지 `review.json`의 실행 항목은 미검증으로 남습니다.
