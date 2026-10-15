# Web 복습 노트 (HTML5 · CSS)

## Part 1. HTML5 구조

- 1~12번: `front_ws_01_3` (BookCafe 메인화면) 작성 시 사용한 태그와 개념
- 13번: `front_hw_01_2` (영화관리 메인화면) 구조 정리

## 1. 문서 기본 뼈대

```html
<!DOCTYPE html>
<html lang="ko">
  <head>  <!-- 화면에 안 보이는 문서 정보 -->
    <meta charset="UTF-8" />
    <title>SSAFY BOOK CAFE</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="shortcut icon" href="img/favicon.ico" />
  </head>
  <body> <!-- 화면에 보이는 내용 --> </body>
</html>
```

| 태그/속성 | 의미 |
|---|---|
| `<!DOCTYPE html>` | HTML5 문서 선언 (없으면 quirks 모드) |
| `lang="ko"` | 문서 언어 → 스크린리더·번역·검색엔진이 사용 |
| `meta charset="UTF-8"` | 문자 인코딩 (한글 깨짐 방지) |
| `meta viewport` | 모바일 화면 너비 대응 |
| `link rel="shortcut icon"` | 탭에 표시되는 파비콘 |

## 2. 시맨틱(의미론적) 구조 태그 ★

`<div>`만 쓰지 않고 **역할이 드러나는 태그**를 쓰는 것이 핵심.

| 태그 | 역할 | 이번 페이지 적용 |
|---|---|---|
| `<header>` | 머리말(로고, 메뉴) | 사이트 이름 + 회원 메뉴 |
| `<nav>` | 주요 링크 모음 | 로그인/회원가입 메뉴, 푸터 메뉴 |
| `<main>` | 문서의 핵심 내용 (**문서당 1개**) | 설문, 도서, 게시판 |
| `<section>` | 주제별 묶음 (보통 제목 `h2` 포함) | 설문 / 프로그래밍 언어 / 에세이 / 게시판 |
| `<article>` | 독립적으로 의미 있는 콘텐츠 | 인기글, 최신글 |
| `<aside>` | 부가 정보 | 전국 매장 안내 |
| `<footer>` | 꼬리말 | 약관 링크, 저작권 |

- `section` vs `article`: 따로 떼어내 배포해도 말이 되면 `article`.
- `aria-label` / `aria-labelledby`: 같은 태그가 여러 개일 때 스크린리더용 이름 부여.

## 3. 제목과 텍스트

- `<h1>`~`<h6>`: 제목 계층. **h1은 한 페이지에 하나**, 단계를 건너뛰지 않기(h1→h2→h3).
- `<p>` 문단, `<hr />` 주제 구분선, `<small>` 저작권 등 부가 문구.
- `<time datetime="2021-03-01">`: 날짜/시간을 기계가 읽을 수 있게 표시.
- `<data value="18800">18,800원</data>`: 화면 표시값과 기계용 값을 함께 제공.
- `hidden` 속성: 화면에서는 숨기고 구조(제목, caption)만 유지.
- `&copy;` : 특수문자(엔티티) → ©

## 4. 목록

```html
<ul>            <!-- 순서 없는 목록 -->
  <li>서울
    <ul><li>역삼점</li></ul>   <!-- 중첩 목록: li 안에 ul -->
  </li>
</ul>
```

- `<ul>` 순서 없음, `<ol>` 순서 있음, `<li>` 항목.
- 중첩 시 **`ul`은 `li` 안에** 넣는다 (`ul` 바로 아래 `ul` 금지).
- 메뉴(nav)도 의미상 목록이므로 `ul/li`로 작성한다.

## 5. 이미지와 캡션

```html
<figure>
  <img src="img/book/p_book01.png" alt="Do it! 점프 투 파이썬 표지" width="120" />
  <figcaption>Do it! 점프 투 파이썬 (18,800원)</figcaption>
</figure>
```

- `<img>`: `src`(경로), **`alt`(대체 텍스트, 필수)**, `width/height`.
- `<figure>` + `<figcaption>`: 이미지·도표와 그 설명을 한 묶음으로.
- 경로: 상대경로 `img/...` (index.html 기준). `../`는 상위 폴더.

## 6. 링크

- `<a href="...">`: `#id`는 같은 페이지 내 이동, `index.html`은 파일 이동.
- 아직 없는 페이지는 `#이름`으로 자리만 잡아둔다.

## 7. 접기/펼치기 – `<details>` / `<summary>`

```html
<details open>
  <summary>전국매장 펼치기 / 접기</summary>
  ...내용...
</details>
```

- JavaScript 없이 토글 가능. `open` 속성이 있으면 처음부터 펼침.

## 8. 폼(투표)

```html
<form action="#" method="post">
  <fieldset>
    <legend>공부하고 싶은 분야를 골라 주세요!!!</legend>
    <input type="radio" id="poll-python" name="language" value="python" />
    <label for="poll-python">Python</label>
  </fieldset>
  <button type="submit">투표하기</button>
  <button type="button">결과보기</button>
</form>
```

| 요소 | 핵심 |
|---|---|
| `form` | `action`(전송 대상), `method`(get/post) |
| `fieldset` / `legend` | 관련 입력을 묶고 제목 부여 |
| `input type="radio"` | **같은 `name`끼리 하나만 선택**, 서버로 가는 값은 `value` |
| `label for="id"` | `input`의 `id`와 연결 → 글자/이미지 클릭해도 선택됨 |
| `button type="submit"` | 폼 전송, `type="button"`은 전송 안 함 |

- `id`는 문서에서 **고유**, `name`은 그룹 지정용으로 **동일하게**.

## 9. 표(게시판)

```html
<table>
  <caption>인기글 목록</caption>
  <thead><tr><th scope="col">제목</th>...</tr></thead>
  <tbody><tr><td>...</td>...</tr></tbody>
</table>
```

- `table > thead/tbody > tr > th/td` 구조.
- `th scope="col"`: 열 제목임을 명시 (접근성). 행 제목이면 `scope="row"`.
- 표는 **데이터 표현용**, 레이아웃용으로 쓰지 않는다.

## 10. 접근성·품질 체크리스트

- [ ] 모든 `img`에 의미 있는 `alt`
- [ ] `h1`은 1개, 제목 단계 건너뛰지 않기
- [ ] `main`은 1개
- [ ] `input`마다 `label` 연결
- [ ] `html lang` 지정
- [ ] 태그는 닫고, 중첩 순서 지키기

## 11. 이번 페이지 문서 구조 한눈에 보기

```
html
├─ head (meta, title, favicon)
└─ body
   ├─ header   : h1(사이트명) / 공지 / nav(회원 메뉴) / figure(프로필)
   ├─ aside    : details(전국 매장 중첩 목록)
   ├─ main
   │   ├─ section 설문       : form > fieldset > radio ×4 + button ×2
   │   ├─ section 프로그래밍 : ul > li > figure ×5
   │   ├─ section 에세이     : ul > li > figure ×5
   │   └─ section 게시판     : article(인기글 table) + article(최신글 table)
   └─ footer   : nav(카페소개 등) / small(©)
```

## 12. 복습 질문

1. `section`과 `article`의 차이는?
2. radio 버튼을 하나만 선택되게 하려면 무엇을 같게 해야 하나?
3. `label`의 `for`와 `input`의 `id`는 왜 맞춰야 하나?
4. `figure`/`figcaption`은 언제 쓰는가?
5. `alt`가 필요한 이유 두 가지는?
6. `ul` 중첩 시 올바른 위치는?

## 13. 영화관리 메인화면 구조 (`front_hw_01_2`)

**목적**: 영화 목록·찜리스트·검색을 갖춘 메인화면의 **HTML 뼈대**를 만든다. (스타일은 Part 2에서 입힘)

```html
<header>
  <a href="index.html"><h1>영화관리</h1></a>
  <form action="#" method="get">
    <input type="text" name="q" placeholder="영화 제목을 검색하세요" />
    <button type="submit">검색</button>
  </form>
  <nav> <a href="#">로그인</a> ... </nav>
</header>
<main>
  <section>
    <h2>영화목록</h2>
    <ul>
      <li>
        <img src="img/eternals.jpg" alt="이터널스" width="150" />
        <h3>이터널스</h3>
        <p>장르 : 액션</p> <p>감독 : ...</p> <p>상영시간 : 155분</p>
        <button type="button">찜</button>
      </li> ...
    </ul>
  </section>
  <aside><h2>찜리스트</h2><ul><li>아직 찜한 영화가 없습니다.</li></ul></aside>
</main>
<footer> <a>이용약관</a> | ... <p>&copy; SSAFY ...</p> </footer>
```

| 요소 | 용도·목적 |
|---|---|
| `header > a > h1` | 로고 겸 홈 링크 (`index.html`로 이동) |
| `form` + `input[type=text]` + `button[type=submit]` | 영화 제목 **검색**. `name="q"`가 서버로 가는 파라미터 이름, `placeholder`는 입력 안내 문구 |
| `nav` > `a` | 로그인/회원가입 등 주요 메뉴 링크 |
| `section` | 메인 콘텐츠(영화목록) |
| `aside` | 본문과 별개의 부가 정보(찜리스트) |
| `ul > li` | 영화 **반복 항목**. 카드 1개 = `li` 1개 |
| `img` (`alt`, `width`) | 포스터. `alt`는 대체 텍스트 |
| `button type="button"` | 찜. **전송하지 않는** 일반 버튼 (JS 동작용) |
| `footer` | 약관 링크 + 저작권(`&copy;`) |

- `data/movie.txt`의 영화 데이터(img, title, genre, director, runningTime)를 그대로 `li` 카드로 옮긴 것 → **데이터 1건 = 카드 1개** 구조.
- `button`: `submit`(폼 전송)과 `button`(전송 없음)의 차이를 구분.

---

## Part 2. CSS 스타일링 (`front_hw_02_2` 영화관리 메인화면)

HTML(구조)에 CSS(표현)를 입혀 꾸민 실습. 파일: `index.html` + `css/main.css`

### 1. CSS 적용 방법 3가지 (용도별)

| 방법 | 형태 | 용도 |
|---|---|---|
| 인라인 | `<p style="color:red">` | 특정 요소 하나만 임시로 (우선순위 최고, 유지보수 나쁨) |
| 내부 참조 | `<style>...</style>` | 한 페이지 전용 스타일 |
| **외부 참조** ★ | `<link rel="stylesheet" href="css/main.css" />` | 여러 페이지 공통 스타일, 실무 기본 (이번 실습 사용) |

- `<link>`는 `<head>` 안에 작성, 경로는 index.html 기준 상대경로.
- 폴더 구성: `css/main.css`로 구조(HTML)와 표현(CSS) 분리.

### 2. 기본 스타일 초기화 (Reset)

브라우저가 태그마다 넣는 기본 여백·스타일을 제거해 **브라우저 간 차이를 없애고 직접 제어**하기 위함.

```css
* { margin: 0; padding: 0; box-sizing: border-box; }
a  { text-decoration: none; color: inherit; }   /* 밑줄·파란색 제거 */
ul { list-style: none; }                         /* 목록 점 제거 */
```

- `*` 전체 선택자: 모든 요소에 적용.
- `box-sizing: border-box`: width에 **padding·border 포함** → 크기 계산이 직관적.
- `color: inherit`: 부모 글자색을 그대로 상속.

### 3. CSS Selector (요소 선택)

| 선택자 | 예 | 의미 |
|---|---|---|
| 태그 | `header` | 해당 태그 전체 |
| 전체 | `*` | 모든 요소 |
| 자손 | `main section li` | main 안의 section 안의 모든 li |
| 쉼표 | `h1, h2` | 여러 대상에 같은 스타일 |

- 자손 선택자로 `main section ul`과 `main aside ul`처럼 **같은 태그도 위치별로 다르게** 스타일링.
- 우선순위: 인라인 > id > class > 태그. 같으면 **나중에 쓴 것**이 적용.

### 4. Flexbox – 가로 배치·정렬 ★

부모에 `display: flex` → 자식(flex item)이 **가로로 한 줄 배치**.

| 속성 | 역할 | 사용처 |
|---|---|---|
| `justify-content` | 주축(가로) 정렬: `space-between`, `center` | header 3영역 양끝 분산, footer 가운데 |
| `align-items` | 교차축(세로) 정렬: `center` | header/footer 세로 가운데 |
| `gap` | 아이템 사이 간격 | 메뉴, 영화 카드 간격 |
| `flex-wrap: wrap` | 공간 부족 시 줄바꿈 | **반응형 영화 목록** |
| `flex: 3` / `flex: 1` | 남는 공간 비율 | section : aside = 3 : 1 |

적용 요약:
- **header**: 로고 / 검색 / 로그인 메뉴 3영역 → `justify-content: space-between`
- **main**: `section`(영화목록)과 `aside`(찜리스트) 가로 배치 → `display: flex`
- **영화 목록 `ul`**: `flex-wrap: wrap` → 창 너비에 따라 한 줄 개수가 변하는 반응형
- **footer**: 링크·저작권 가로 나열, 가운데 정렬

### 5. position – 위치 지정

| 값 | 동작 | 사용처 |
|---|---|---|
| `static` | 기본값, 문서 흐름대로 | - |
| `relative` | 원래 자리 기준, **자식 absolute의 기준점** | 영화 카드 `li` |
| `absolute` | 가장 가까운 relative 부모 기준 배치 | 카드 우하단 **찜 버튼** (`right:0; bottom:15px`) |
| `fixed` | 브라우저 화면 기준 고정 | 항상 보이는 요소 |
| `sticky` | 스크롤 중 지정 위치(`top`)에 달라붙음 | **찜리스트 aside** (`top:15px`) |

- 요구사항 "스크롤해도 항상 고정된 위치" → `position: sticky; top: 15px; align-self: flex-start;`
- sticky는 flex 레이아웃 안에서 쓸 때 `align-self: flex-start`가 필요(안 하면 높이가 늘어나 고정되지 않음).
- 완전 붙박이는 `fixed`, 부모 영역 안에서만 따라다니려면 `sticky`.

### 6. 색상·글꼴·크기 (자유로운 스타일링)

- 검정 배경 / 흰 글씨: `background-color: #000; color: #fff;`
- 글꼴: `font-family: "Malgun Gothic", sans-serif;` (없으면 다음 후보)
- `font-size`, `font-weight: normal`(h 태그 기본 굵기 제거)
- 이미지: `display: block; width: 100%` → 카드 너비에 맞춰 늘리고, 이미지 아래 빈 공백(inline 간격) 제거.

### 7. 영역별 구현 요약

```
header : 검정 배경 + flex(space-between)  → 로고 | 검색폼 | nav
main   : flex                               → section(3) | aside(1, sticky)
  section ul : flex + wrap + gap            → 영화 카드(li, relative)
  li button  : absolute                     → 카드 우하단 찜 버튼
footer : 검정 배경 + flex(center)           → 링크 + 저작권
```

### 8. 체크리스트

- [ ] `<link>`가 `<head>`에 있고 경로가 맞는가 (`css/main.css`)
- [ ] 초기화(`*`) 후 필요한 여백만 다시 지정했는가
- [ ] Flex 부모에 `display: flex`를 줬는가 (자식이 아닌 **부모**)
- [ ] absolute 사용 시 부모에 `position: relative`가 있는가
- [ ] sticky에 `top` 값과 `align-self: flex-start`가 있는가

### 9. 복습 질문

1. 인라인 / 내부 / 외부 참조의 차이와 외부 참조를 쓰는 이유는?
2. 스타일 초기화를 하는 이유와 `box-sizing: border-box`의 의미는?
3. `justify-content`와 `align-items`는 각각 어느 축을 정렬하나?
4. 영화 목록을 반응형으로 만들려면 어떤 속성이 필요한가?
5. `absolute`와 `sticky`의 차이, absolute가 relative 부모를 필요로 하는 이유는?
6. 자손 선택자 `main section li`와 `li`의 차이는?

---

## Part 2-B. BookCafe CSS 스타일링 (`front_ws_02_3`)

**목적**: Part 1의 BookCafe HTML(`front_ws_01_3`)에 **외부 CSS(`css/main.css`)만으로** 시안 화면을 만든다. (HTML에 `<style>`·inline 스타일을 쓰지 않는다)

### 1. HTML 구조 변경 (CSS를 입히기 위한 재구성)

| 변경 | 이유 |
|---|---|
| `<head>`에 `<link rel="stylesheet" href="css/main.css">` | 외부 참조 방식 적용 |
| 회원 메뉴 `li`를 `nav > ul`로 감쌈 | `li`는 `ul` 안에 있어야 올바른 구조, Flex로 가로 배치하기 위함 |
| 프로필 이미지·전국매장·설문을 `.side`로 묶음 | 시안의 **왼쪽 컬럼**을 만들기 위해 |
| `main`과 `.side`를 `.container`로 감쌈 | 부모에 `display:flex` 걸어 2단 레이아웃 |
| 펼치기/접기 JS 버튼 → `<details>/<summary>` | **JS 없이** 토글, CSS만으로 버튼 모양 |
| `<hr>` 제거 | 구분은 CSS 여백(`margin`)으로 처리 |
| `section`에 `class` 부여 (`poll`, `book-list`, `board`) | 같은 태그를 **영역별로 다르게** 스타일링 |

### 2. 영역별 CSS 용도

| 영역 | 핵심 CSS | 목적 |
|---|---|---|
| 전체 레이아웃 | `.container{display:flex; gap; width:900px; margin:15px auto 0}` | 왼쪽(`.side` 200px 고정) + 오른쪽(`main{flex:1}`) 2단, 가운데 정렬 |
| 고정폭 컬럼 | `.side{width:200px; flex-shrink:0}` | 화면이 좁아져도 왼쪽 폭 유지 |
| header | `display:flex; justify-content:space-between; align-items:center` | 로고·공지(왼쪽) / 회원 메뉴(오른쪽) 양끝 분산 |
| 회원 메뉴 | `.user-menu{display:flex; gap:20px}` | `ul/li`를 가로 한 줄 메뉴로 |
| 프로필 | `flex-direction:column; align-items:center` | 이미지 세로 나열·가운데 정렬 |
| 전국매장 | `details`, `summary{background; cursor:pointer; list-style:none}` | 접기/펼치기 버튼 꾸미기, 기본 ▶ 마커 제거 |
| 중첩 목록 | `.store > ul > li`, `.store li li` | **자식(`>`)·자손** 선택자로 지역/지점 단계별 스타일 |
| 설문 | `.poll label{display:flex; align-items:center}` | 라디오 + 로고 + 글자 한 줄 정렬 |
| 도서 카드 | `ul{display:flex; flex-wrap:wrap; gap}`, `li{width:125px; border; box-shadow}` | 카드가 줄바꿈되며 나열 |
| 도서 이미지 | `width:100%; height:150px; object-fit:contain` | 크기가 다른 표지를 **비율 유지**하며 같은 칸에 맞춤 |
| 게시판 | `.board{display:flex; gap}`, `article{flex:1}` | 인기글/최신글 **같은 너비로 가로 배치** |
| 표 | `border-collapse:collapse`, `th/td border-bottom` | 표 테두리 겹침 제거, 가로줄 스타일 |
| footer | `nav ul{display:flex; gap}` | 링크 가로 나열 |

### 3. 새로 나온 개념

- **`>` 자식 선택자** vs 공백 자손 선택자: `.store > ul > li`는 바로 아래 자식만.
- **`class` 선택자 `.name`**: 같은 태그를 구분해 적용, 여러 요소 재사용 가능.
- **속성 선택자** `button[type="submit"]`: 같은 태그 중 속성이 맞는 것만.
- **`flex-direction: column`**: 주축을 세로로 → 세로 쌓기 + `align-items`로 가로 정렬.
- **`flex-shrink: 0`**: 공간이 부족해도 줄어들지 않게 고정.
- **`margin: 0 auto` + `width`**: 블록 요소 **가운데 정렬**.
- **`object-fit: contain`**: 이미지 비율 유지하며 박스 안에 맞춤.
- **`box-shadow`**, **`border-collapse`**.
- **`display:block` on `img`**: 이미지 아래 공백 제거.

### 4. 체크리스트

- [ ] `<style>`/inline 없이 `main.css`에만 스타일을 작성했는가
- [ ] 2단 레이아웃의 **부모**에 `display:flex`를 걸었는가
- [ ] 가운데 정렬은 `width` + `margin:0 auto`인가
- [ ] 이미지 크기가 달라도 `object-fit`으로 맞췄는가

### 5. 복습 질문

1. `<details>`를 쓰면 JS 버튼 대비 어떤 점이 좋은가?
2. `.store > ul > li`와 `.store li`의 차이는?
3. 크기가 제각각인 도서 표지를 같은 칸에 맞추려면?
4. 인기글/최신글을 같은 너비로 나란히 놓는 CSS는?
5. 블록 요소를 가운데 정렬하는 방법은?

---

## Part 3. JavaScript · AJAX · Bootstrap (`front_hw_03_2`, `front_ws_03_3`, `front_hw_04_2`, `front_ws_04_3`, `front_hw_05_2`, `front_ws_05_3`, `front_hw_06_2`, `front_ws_06_3`)

**목적**: HTML(구조)·CSS(표현)에 **JavaScript(동작)** 를 더해 클릭 같은 사용자 이벤트에 반응하게 한다. 파일 연결은 `</body>` 직전의 `<script src="js/main.js"></script>`.

### 1. 실습별 용도·목적

| 실습 | 폴더 | 목적 | 핵심 |
|---|---|---|---|
| 3-2 영화관리 | `front_hw_03_2` | 찜 버튼 클릭 시 해당 영화 정보를 `console.log`로 출력 | `querySelectorAll`, `forEach`, `addEventListener`, `event.target` |
| 3-3 BookCafe | `front_ws_03_3` | 로그인, 메뉴/프로필 전환, 지역 펼치기/접기, 팝업창 | `prompt`/`alert`, `classList.toggle`, `nextElementSibling`, `window.open`, DOM 생성·삭제 |
| 4-2 영화관리 | `front_hw_04_2` | 찜한 영화를 **localStorage에 저장**하고 새로고침해도 유지 | `localStorage`, `JSON.stringify`/`parse`, 객체 배열 |
| 4-3 BookCafe | `front_ws_04_3` | **투표 생성(팝업) → localStorage 저장 → 메인 화면에 투표 출력** | `localStorage`, JSON 객체, `storage` 이벤트, 템플릿 리터럴, 유효성 검사 |
| 5-2 영화목록 | `front_hw_05_2` | **AJAX(XMLHttpRequest)** 로 `movie.json`을 받아 목록을 동적으로 생성 | `XMLHttpRequest`, `JSON.parse`, 동적 DOM 생성, **이벤트 위임** |
| 5-3 BookCafe 도서목록 | `front_ws_05_3` | 공통 요청 함수(`sendRequest`)로 **XML·JSON 두 형식**을 받아 도서 목록 출력 | `readyState`/`status`, `responseXML`, `responseText`+`JSON.parse`, 콜백 함수 |
| 6-2 영화관리 | `front_hw_06_2` | **Bootstrap5**로 반응형 화면 구성 (CSS 직접 작성 X) | CDN, navbar, grid, card, Icons |
| 6-3 BookCafe | `front_ws_06_3` | 기존 기능을 유지한 채 **Bootstrap5로 전체 화면 재구성**, 새 창 → **모달** | navbar, dropdown, collapse, modal, card, table, form-check |

### 2. 요소 선택

| 메서드 | 반환 | 용도 |
|---|---|---|
| `document.querySelector("css선택자")` | 첫 번째 요소 1개 | id/단일 요소 (`#menu-login`) |
| `document.querySelectorAll("css선택자")` | **NodeList**(여러 개) | 같은 종류 여러 요소 (`main section li button`) |

- CSS 선택자를 그대로 쓴다 (`#id`, `.class`, `부모 자식`).
- NodeList는 `forEach`로 순회할 수 있다. (배열 메서드 `map`/`filter`는 `[...nodeList]`로 변환 후)

### 3. 이벤트 처리 (addEventListener) ★

```js
const handler = (event) => {
    console.log(event.target.parentElement.innerText);
};
document.querySelectorAll("main section li button").forEach((button) => {
    button.addEventListener("click", handler);
});
```

| 개념 | 설명 |
|---|---|
| `요소.addEventListener("click", 함수)` | 이벤트가 발생했을 때 호출할 함수 등록. **함수 이름만** 넘긴다 (`handler` O, `handler()` X → 즉시 실행됨) |
| `event.target` | 실제로 클릭된 요소 (여기서는 찜 버튼) |
| `parentElement` | 부모 요소 (버튼 → `li`). 영화 한 건의 정보가 `li` 안에 있음 |
| `innerText` | 요소 안의 **화면에 보이는 텍스트** |
| `event.preventDefault()` | `<a href="#">` 같은 기본 동작(페이지 이동) 막기 |

- 같은 handler를 **여러 버튼에 등록** → `target`으로 어느 버튼인지 구분.
- 요소마다 `onclick` 속성을 쓰는 방식보다 `addEventListener`가 HTML과 JS를 분리해 유지보수가 쉽다.

### 4. 화면 표시/숨김 – `classList`

```css
.hidden { display: none; }   /* CSS에 숨김 클래스 정의 */
```
```js
el.classList.toggle("hidden");          // 있으면 제거, 없으면 추가
el.classList.toggle("hidden", isLogin); // 두 번째 인자 true=추가, false=제거
```

- 스타일을 JS가 직접 바꾸지 않고 **클래스만 토글** → 모양은 CSS, 동작은 JS로 역할 분리.
- `add` / `remove` / `contains`도 함께 알아둔다.

### 5. BookCafe 기능별 구현 포인트 (`front_ws_03_3`)

| 기능 | 구현 | 사용 개념 |
|---|---|---|
| 로그인 | `prompt`로 아이디 → 비밀번호 입력, `ssafy`/`1234`이면 `alert("로그인 성공")` | `prompt`(취소 시 `null`), `alert`, `if` |
| 로그인 후 메뉴 변경 | 로그인·회원가입 숨기고 로그아웃·마이페이지·관리자 표시 | `classList.toggle(.., isLogin)` |
| 프로필 이미지 변경 | 기본 이미지 숨기고 사용자 이미지 표시 | 위와 동일 |
| 전체 펼치기/접기 | 버튼 2개를 번갈아 표시, 모든 지역 목록을 한 번에 처리 | `forEach` + `toggle` |
| 지역별 펼치기/접기 | 지역명 클릭 시 **그 지역만** 토글 | `area.nextElementSibling` (바로 다음 형제 요소) |
| 관리자 → 팝업창 | `window.open("pollmake.html", "이름", "width=450,height=500")` | 새 창은 **별도 HTML 파일을 로드** |
| 답변 항목 추가 | `createElement`로 `li`/`input`/`button` 생성 후 `appendChild` | DOM 생성 |
| 답변 항목 삭제 | 삭제 버튼 클릭 시 `li.remove()` | 클로저(해당 줄 `li` 참조), DOM 삭제 |

- 팝업 화면이 별도 파일(`pollmake.html`)이어야 팝업 주소가 `.../pollmake.html`로 표시된다. 파일을 합치면 경로가 달라진다.
- 팝업 페이지의 JS(`pollmake.js`)는 메인 페이지 요소가 없으므로 `cafe.js`와 **분리**한다.

### 6. DOM 탐색·조작 정리

| 하고 싶은 일 | 사용 |
|---|---|
| 부모 / 다음 형제 | `parentElement` / `nextElementSibling` |
| 요소 생성 → 붙이기 | `createElement` → `append` / `appendChild` |
| 요소 삭제 | `el.remove()` |
| 텍스트 설정 / 읽기 | `textContent` / `innerText` |
| 입력값 읽기 | `input.value` (`.trim()`으로 공백 제거) |
| 창 열기 / 닫기 | `window.open(...)` / `window.close()` |

### 7. 자주 틀리는 포인트

1. `addEventListener("click", handler())` – 괄호를 붙이면 **등록 시점에 즉시 실행**된다.
2. `<script>`를 `</body>` 앞에 둬야 요소가 만들어진 뒤에 선택할 수 있다. (`<head>`에 두면 요소가 `null`)
3. `querySelectorAll`은 NodeList → 요소 하나처럼 `.addEventListener`를 바로 쓰면 오류, **`forEach`로 순회**해야 한다.
4. `prompt`는 취소하면 `null` → `null` 체크 없이 `.trim()` 등을 쓰면 오류.
5. 링크(`<a href="#">`) 클릭 시 주소 끝에 `#`이 붙고 스크롤이 이동 → `event.preventDefault()`.
6. `const`로 선언한 요소 변수는 **이름 중복 선언 불가**, 스크립트마다 범위를 분리.
7. 한 파일에 서로 다른 페이지의 요소 선택을 섞으면 `null` 오류.

### 8. 체크리스트

- [ ] 선택자(`querySelector(All)`)가 실제 HTML의 id/class와 일치하는가
- [ ] `handler`를 함수 **이름만** 넘겼는가
- [ ] `<script src>` 경로(`js/…`)와 위치(`</body>` 앞)가 맞는가
- [ ] 숨김은 `.hidden` 클래스를 CSS에 정의했는가
- [ ] Chrome 개발자도구 **Console** 탭에서 오류가 없는가

### 9. 복습 질문

1. `querySelector`와 `querySelectorAll`의 차이는? 반환값을 어떻게 순회하나?
2. `addEventListener`에 `handler()`가 아니라 `handler`를 넘기는 이유는?
3. 같은 handler를 여러 버튼에 등록했을 때 어떤 버튼이 눌렸는지 어떻게 알 수 있나?
4. `classList.toggle("hidden", true)`는 어떻게 동작하나?
5. 지역명을 클릭했을 때 그 지역의 매장 목록만 토글하려면?
6. 팝업 창을 별도 HTML 파일로 만든 이유는?
7. `prompt`에서 취소를 누르면 어떤 값이 반환되는가?

### 10. Web Storage · JSON (`front_hw_04_2`)

**목적**: 페이지를 새로고침하거나 브라우저를 닫아도 **찜한 영화 목록이 남도록** 브라우저에 데이터를 저장한다.

| 구분 | localStorage | sessionStorage | 쿠키 |
|---|---|---|---|
| 유지 기간 | **브라우저를 닫아도 유지** | 탭/창을 닫으면 삭제 | 만료일까지 |
| 사용 방식 | 키/값 쌍, 직관적 API | 〃 | 문자열 파싱 필요, 서버로 매 요청마다 전송 |

```js
localStorage.setItem("movies", JSON.stringify(movies)); // 저장 (객체 → JSON 문자열)
const movies = JSON.parse(localStorage.getItem("movies")) || []; // 읽기 (문자열 → 객체)
localStorage.removeItem("movies"); localStorage.clear();
```

- **저장소에는 문자열만** 들어간다 → 배열/객체는 `JSON.stringify`로 변환해 저장, 읽을 때 `JSON.parse`로 복원.
- 없는 key를 `getItem`하면 `null` → `null` 체크(`|| []`) 후 사용.
- 흐름: **페이지 로딩 시 읽어서 화면에 출력 → 버튼 클릭 시 객체 생성 → 기존 배열에 추가 → 다시 저장 → 화면 갱신**.
- 확인: 크롬 개발자도구 **Application → Local Storage**에서 key/value 확인.

| 메서드 | 역할 |
|---|---|
| `JSON.stringify(obj)` | JS 객체/배열 → JSON 문자열 |
| `JSON.parse(str)` | JSON 문자열 → JS 객체/배열 |
| `setItem(key, value)` / `getItem(key)` | 저장 / 조회 |
| `removeItem(key)` / `clear()` | 항목 삭제 / 전체 삭제 |

찜 영화 한 건의 데이터 형태: `{ title, genre, director, runningTime }` → 객체 배열로 `movies` key에 저장.

- 자주 틀리는 점: ① `stringify` 없이 객체를 바로 `setItem`하면 `[object Object]`로 저장됨 ② 기존 목록을 읽지 않고 새 배열로 덮어쓰면 **이전 찜이 사라짐** ③ 같은 영화를 여러 번 누르면 중복 저장됨(필요 시 `some`/`find`로 확인).
- 복습 질문: (1) localStorage와 sessionStorage의 차이? (2) 객체를 저장할 때 `JSON.stringify`가 필요한 이유? (3) 기존 찜 목록에 새 영화를 추가하려면? (4) 저장된 데이터가 없을 때 `getItem`의 반환값은?

### 11. 투표 기능 – 팝업과 메인 화면 연동 (`front_ws_04_3`)

**목적**: 팝업(`pollmake.html`)에서 만든 투표를 `localStorage`에 JSON으로 저장하고, 메인 화면이 그 데이터를 읽어 투표 영역을 그린다. **두 페이지가 localStorage를 공유 저장소로** 쓴다.

```js
// 저장 형식 (key: "poll")
{ "start_date":"2021-08-01", "end_date":"2021-08-31",
  "question":"현재 공부하고 있는 지역은?", "answers":["서울","대전","구미","광주"] }
```

| 단계 | 구현 | 개념 |
|---|---|---|
| 1. 투표 없음 | `loadPoll()`이 `null`이면 "진행중인 투표가 없습니다." 출력 | `getItem` → `null` 체크 |
| 2. 투표 생성 | 입력값을 객체로 만들고 **유효성 검사** 후 `setItem("poll", JSON.stringify(poll))` | 날짜 `input type="date"`, 검증 |
| 3. 메인 출력 | `JSON.parse` 후 질문·라디오·투표기간을 `innerHTML`로 렌더링 | `map` + `join`, 템플릿 리터럴 |
| 4. 자동 갱신 | 메인에서 `window.addEventListener("storage", …)` | **다른 창**에서 바뀐 storage 감지 |

- `storage` 이벤트는 **같은 출처의 다른 탭/창**에서 값이 바뀔 때만 발생한다 (바꾼 창 자신에는 발생하지 않음) → 팝업에서 저장하면 메인 창이 감지.
- 유효성 검사 항목: 시작·종료일 입력 여부, **종료일 ≥ 시작일**(`yyyy-mm-dd` 문자열은 사전순 비교 가능), 질문 입력, 답변 2개 이상(빈 값 제외).
- `input type="date"`의 `value`는 `yyyy-mm-dd` 문자열.
- 사용자 입력을 `innerHTML`에 넣을 때는 `<`, `>` 등을 변환(escape)해야 태그로 해석되는 문제(XSS)를 막는다. 안전하게 하려면 `textContent`를 쓴다.
- 배열 → HTML: `answers.map(a => `<li>${a}</li>`).join("")`.
- 확인: 개발자도구 **Application → Local Storage → `poll`** 에서 JSON 확인.
- 복습 질문: (1) 팝업에서 저장한 데이터를 메인 창이 알아채는 방법은? (2) `storage` 이벤트가 발생하는 조건은? (3) 날짜 문자열을 그대로 비교해도 되는 이유는? (4) 투표 데이터가 없을 때 화면은 어떻게 처리했나? (5) `innerHTML`에 사용자 입력을 그대로 넣으면 왜 위험한가?

### 12. AJAX와 이벤트 위임 (`front_hw_05_2`)

**목적**: 영화 목록을 HTML에 직접 쓰지 않고, **서버(JSON 파일)에서 비동기로 받아** 화면을 갱신한다. 페이지 전체를 새로고침하지 않고 DOM 일부만 바꾼다.

```js
const xhr = new XMLHttpRequest();
xhr.open("GET", "data/movie.json");        // 요청 설정
xhr.onload = () => {                        // 응답 도착 시 실행 (비동기)
    if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);   // 문자열 → 객체
        data.movies.forEach(addMovieItem);           // 반복문으로 item 생성
    }
};
xhr.send();                                 // 요청 전송
```

| 개념 | 설명 |
|---|---|
| AJAX | 페이지 이동 없이 비동기로 서버와 데이터를 주고받는 방식 (Asynchronous JavaScript And XML) |
| `XMLHttpRequest` | 브라우저 내장 HTTP 요청 객체. XML뿐 아니라 JSON·텍스트도 받을 수 있다 |
| `open(method, url)` → `send()` | 요청 설정 후 전송 |
| `onload` / `onerror` | 응답 도착 / 네트워크 오류 시 콜백 |
| `status` | HTTP 상태 코드 (200 성공, 404 없음) |
| `responseText` | 응답 본문(문자열) → JSON이면 `JSON.parse` |

- **비동기**: `send()` 뒤 코드는 응답을 기다리지 않고 바로 실행된다. 응답 처리는 콜백(`onload`) 안에서 해야 한다.
- 영화 한 건 = JSON 객체 → `createElement("li")` + 템플릿 리터럴로 카드 생성 → `appendChild`.
- JSON은 **키를 큰따옴표**로 감싸야 하고 주석·마지막 쉼표가 허용되지 않는다.
- `file://`로 열면 브라우저가 XHR을 막는다 → **Live Server 등 로컬 서버**로 열어야 한다.

**왜 기존 방식(버튼에 직접 리스너 등록)이 동작하지 않나?**
- `querySelectorAll`은 **실행 시점에 이미 존재하는** 요소만 선택한다. 영화 카드는 AJAX 응답 후에 만들어지므로, 그 전에 등록하면 버튼이 아직 없어 리스너가 달리지 않는다.

**해결 방법 두 가지**

| 방법 | 방식 | 특징 |
|---|---|---|
| 이벤트 위임 ★ | **부모(`ul`)에 한 번만** `addEventListener`, `event.target.matches("button")`로 버튼 클릭만 처리 | 나중에 추가된 요소에도 자동 적용, 리스너 1개 |
| 생성 시 이벤트 달기 | 카드를 만들 때 그 버튼에 직접 `addEventListener` | 요소마다 리스너 필요 |

- 이벤트 위임이 가능한 이유: 클릭 이벤트는 자식에서 부모로 **버블링**된다.
- `event.target`은 실제 클릭된 요소 → `closest("li")`로 해당 카드 찾기.
- 자주 틀리는 점: ① `onload` 밖에서 데이터를 쓰려 함(아직 비어 있음) ② 리스너를 목록 생성 **전에** 자식에 등록 ③ `JSON.parse` 없이 문자열을 객체처럼 사용 ④ 파일 경로를 HTML 기준으로 쓰지 않음(`data/movie.json`).
- 복습 질문: (1) AJAX를 쓰면 좋은 점은? (2) 동적으로 만든 버튼에 리스너가 안 달리는 이유는? (3) 이벤트 위임이 동작하는 원리(버블링)는? (4) `xhr.onload`와 `send()` 뒤 코드의 실행 순서는? (5) `file://`로 열면 왜 실패하는가?

### 13. 공통 AJAX 함수와 XML·JSON 파싱 (`front_ws_05_3`, `front_hw_06_2`)

**목적**: 메인 화면이 로딩되는 순간 `programming.xml`(프로그래밍)과 `essay.json`(에세이)을 AJAX로 가져와 도서 카드를 만든다. **데이터 파일만 고치면 화면이 바뀐다** (HTML 수정 불필요).

```js
// js/httpRequest.js (제공) – 요청 코드를 함수로 묶어 재사용
sendRequest(url, params, callback, method);

sendRequest("data/programming.xml", null, programmingCallback, "GET");
sendRequest("data/essay.json",      null, essayCallback,       "GET");
```

| 개념 | 설명 |
|---|---|
| `sendRequest(url, params, callback, method)` | XHR 생성·`open`·`onreadystatechange` 등록·`send`를 묶은 **공통 함수**. GET이면 params를 쿼리스트링으로 붙임 |
| `onreadystatechange` | `readyState`가 바뀔 때마다 호출 → 완료 여부를 직접 확인해야 함 |
| `readyState === 4` | 응답 수신 **완료** (0 초기 → 1 open → 2 헤더 수신 → 3 수신중 → 4 완료) |
| `status === 200` | 성공 (404는 파일 없음) |
| `this` (콜백 안) | 콜백이 XHR 객체의 메서드처럼 호출되므로 `this`가 XHR → **`function`으로 작성** (화살표 함수는 `this`가 달라짐) |

**XML vs JSON 파싱**

| | XML (`programming.xml`) | JSON (`essay.json`) |
|---|---|---|
| 응답 속성 | `xhr.responseXML` (이미 DOM 객체) | `xhr.responseText` (문자열) |
| 파싱 | `getElementsByTagName("book")`, `textContent` | `JSON.parse(responseText)` |
| 데이터 접근 | 태그 이름으로 탐색 | `book.title` 처럼 속성으로 접근 |
| 특징 | 태그가 길어 용량 큼, 구조·속성 표현 풍부 | 가볍고 JS 객체와 1:1 대응 |

- `getElementsByTagName`은 HTMLCollection → `[...]`로 배열 변환 후 `forEach`.
- 카드 생성: 도서 1권 → `createElement("li")` + 템플릿 리터럴 → `appendChild`. 이미지는 `isbn`을 파일명으로 사용(`img/book/${isbn}.png`).
- 가격 포맷: `Number(price).toLocaleString()` → `18,800`.
- 자주 틀리는 점: ① `readyState` 확인 없이 콜백 안에서 바로 사용(응답 전 호출됨) ② 콜백을 화살표 함수로 써서 `this`가 XHR이 아님 ③ XML 값을 `.value`로 읽음(`textContent` 사용) ④ `file://`로 열어 요청 차단(Live Server 필요) ⑤ `<script>` 순서 – `httpRequest.js`를 `cafe.js`보다 **먼저** 로드해야 `sendRequest`를 쓸 수 있음.
- 복습 질문: (1) 공통 요청 함수로 묶으면 좋은 점은? (2) `readyState`가 4일 때와 `status`가 200일 때의 의미는? (3) XML과 JSON 응답을 각각 어떻게 파싱하나? (4) 콜백에서 `this`로 XHR 객체를 쓰려면 어떤 함수 형태여야 하나? (5) 데이터 파일을 수정하면 화면이 바뀌는 이유는?

### 14. Bootstrap 5 (`front_hw_06_2`)

**목적**: CSS를 직접 작성하는 대신 **Bootstrap이 미리 만든 클래스·컴포넌트**를 조합해 반응형 화면을 빠르게 만든다. (`css/main.css` 없이 HTML 클래스만으로 스타일링)

**CDN 연결**

```html
<head>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
</head>
<body> ...
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
```

- CSS는 `<head>`, JS(bundle)는 `</body>` 앞. **navbar 햄버거 토글 같은 동작은 JS가 있어야** 한다 (bundle에 Popper 포함).
- CDN이므로 **인터넷 연결이 필요**하다.

**Grid system (12칸)**

| 클래스 | 의미 |
|---|---|
| `container` / `container-fluid` | 고정 너비(중앙 정렬) / 화면 전체 너비 |
| `row` | 가로 한 줄 (그 안에 `col`을 둔다) |
| `col-12 col-md-9` | 작은 화면은 12칸(전체), **md(768px) 이상**은 9칸 |
| `col-md-3` | md 이상에서 3칸 → 9 + 3 = **12칸**을 채움 |
| `row-cols-1 row-cols-sm-2 row-cols-lg-4` | 한 줄에 **1개 → 2개 → 4개**씩 자동 배치 |
| `g-3` | 칸 사이 간격(gutter) |

- breakpoint: `sm`(≥576) `md`(≥768) `lg`(≥992) `xl`(≥1200) `xxl`(≥1400). **접두어 없는 값이 기본(모바일 우선)**, 접두어 값은 "그 크기 이상"에서 적용.
- 영화목록 / 찜리스트를 `col-md-9` / `col-md-3`로 나누고, 영화 카드는 `row-cols-*`로 반응형 개수 조절.

**컴포넌트·유틸리티**

| 요소 | 사용 클래스 | 용도 |
|---|---|---|
| navbar | `navbar navbar-expand-lg navbar-dark bg-dark`, `navbar-brand`, `navbar-toggler`, `collapse navbar-collapse`, `nav-link` | 상단 메뉴. lg 미만에서는 햄버거 버튼으로 접힘 (`data-bs-toggle="collapse"`, `data-bs-target="#id"`) |
| card | `card`, `card-img-top`, `card-body`, `card-title`, `card-text` | 영화 정보 카드 |
| list-group | `list-group`, `list-group-item` | 찜리스트 목록 |
| 버튼 | `btn btn-outline-danger btn-sm` | 찜 버튼 (빨간 테두리) |
| 폼 | `form-control` | 검색 입력창 |
| 아이콘 | `<i class="bi bi-heart-fill">` | Bootstrap Icons 하트 |
| 유틸리티 | `d-flex`, `justify-content-between`, `mx-auto`, `my-4`, `py-3`, `text-center`, `bg-dark`, `text-light`, `h-100`, `min-vh-100` | 배치·여백·색상을 클래스로 지정 |

- 유틸리티 약어: `m`(margin) `p`(padding) + `t/b/s/e/x/y` + 0~5 → `mb-3`, `py-3`, `mx-auto`. 접두어를 붙여 `ms-lg-auto`처럼 breakpoint별로도 지정.
- 푸터를 바닥에 붙이기: `body.d-flex.flex-column.min-vh-100` + `main.flex-grow-1`.
- **동적으로 만든 카드의 아이콘 버튼**: 버튼 안의 `<i>`를 눌러도 이벤트 위임이 동작하도록 `event.target.closest("button")`을 사용한다. (`event.target.matches("button")`만 쓰면 아이콘 클릭이 무시됨)

**일반 CSS와 비교**

| | 직접 CSS 작성 | Bootstrap |
|---|---|---|
| 방식 | 선택자 + 속성 | HTML에 클래스 조합 |
| 장점 | 자유로운 디자인 | 빠른 개발, 반응형·일관된 디자인 기본 제공 |
| 단점 | 반응형 직접 구현 | 클래스가 길어지고 비슷한 모양이 되기 쉬움 |

- 자주 틀리는 점: ① `col`을 `row` 밖에 둠 ② 한 `row`의 col 합이 12를 넘으면 다음 줄로 넘어감(의도치 않은 줄바꿈) ③ bundle JS 누락으로 햄버거 메뉴가 안 열림 ④ `data-bs-target`의 id와 `collapse` 요소의 id 불일치 ⑤ `col-md-*`만 쓰고 기본 `col-12`를 안 줘서 작은 화면 배치가 의도와 다름.
- 복습 질문: (1) Bootstrap grid가 몇 칸이고 `col-12 col-md-9`는 어떻게 동작하나? (2) 브라우저 크기별로 1/2/4개씩 카드를 보여주는 클래스는? (3) navbar가 작은 화면에서 접히려면 필요한 클래스·속성은? (4) CDN으로 CSS와 JS를 각각 어디에 넣나? (5) 아이콘 버튼 클릭에 이벤트 위임이 안 될 때 해결 방법은?

### 15. Bootstrap으로 기존 기능 재구성 – 모달·드롭다운·Collapse (`front_ws_06_3`)

**목적**: 기존 BookCafe의 **모든 기능은 그대로** 두고, 화면(HTML/CSS)만 Bootstrap 컴포넌트로 교체한다. 직접 만든 CSS 파일 없이 클래스로 스타일링하고, **새 창(`window.open`)이던 투표 만들기를 모달로** 바꾼다.

| 기존 구현 | Bootstrap 구현 |
|---|---|
| 상단 헤더 `float` 레이아웃 | `navbar navbar-expand-md` (좁으면 햄버거) |
| 관리자 메뉴 → `window.open` 팝업 | `dropdown`의 "투표 만들기" 항목 → **modal** |
| 지역별 펼치기/접기(`.hidden` 토글) | `collapse` + `data-bs-toggle="collapse"` |
| 직접 만든 `.hidden` 클래스 | `d-none` (Bootstrap 유틸리티) |
| 도서 카드 `float` 목록 | `row row-cols-2 row-cols-lg-4` + `card` |
| 인기글/최신글 표 직접 스타일 | `table table-striped` / `table table-bordered table-hover` + `thead.table-dark` |
| 투표 라디오 | `form-check`, `form-check-input`, `form-check-label` |
| 좌우 `float` 레이아웃 | grid `col-md-3` / `col-md-9` |

**모달 (Modal)**

```html
<!-- 열기: 버튼/링크에 data 속성 -->
<a data-bs-toggle="modal" data-bs-target="#pollModal">투표 만들기</a>

<div class="modal fade" id="pollModal" tabindex="-1">
  <div class="modal-dialog"><div class="modal-content">
    <div class="modal-header"> <h5 class="modal-title">…</h5> <button class="btn-close" data-bs-dismiss="modal"></button> </div>
    <div class="modal-body"> … </div>
    <div class="modal-footer"> <button class="btn btn-danger" data-bs-dismiss="modal">Close</button> </div>
  </div></div>
</div>
```

| 개념 | 설명 |
|---|---|
| `data-bs-toggle="modal"` + `data-bs-target="#id"` | 클릭하면 해당 id의 모달을 연다 (JS 없이) |
| `data-bs-dismiss="modal"` | 모달 닫기 버튼 |
| `bootstrap.Modal.getOrCreateInstance(el).hide()` | **JS로 모달 닫기** (투표 생성 후 자동으로 닫을 때) |
| `show.bs.modal` 이벤트 | 모달이 열리기 직전 → 입력 폼 초기화에 사용 |
| 새 창 vs 모달 | 새 창은 별도 HTML 파일 + 팝업 차단 가능성. 모달은 **같은 페이지 안**이라 데이터를 바로 공유 |

- 새 창이 아니므로 `storage` 이벤트가 필요 없다 → 투표 생성 후 같은 페이지에서 **`renderPoll()`을 직접 호출**해 화면을 갱신한다.
- `bootstrap` 전역 객체는 `bootstrap.bundle.min.js`를 로드해야 쓸 수 있다 (스크립트 순서: bundle → 내 JS).

**Collapse / Dropdown**

- `collapse`: 대상 요소에 `class="collapse"`, 버튼에 `data-bs-toggle="collapse" data-bs-target="#id"`. 전체 펼치기는 `bootstrap.Collapse.getOrCreateInstance(el, { toggle: false })`의 `show()/hide()`.
- `dropdown`: `dropdown` > `dropdown-toggle`(`data-bs-toggle="dropdown"`) + `dropdown-menu` > `dropdown-item`. 오른쪽 정렬은 `dropdown-menu-end`.

**기능은 그대로** (기존 로직 유지)

- 로그인(`prompt`/`alert`) → 메뉴·프로필 전환(`classList.toggle("d-none", …)`)
- 도서 목록: `sendRequest`로 XML/JSON AJAX → card 생성
- 투표: 입력값 검증 → JSON을 `localStorage("poll")`에 저장 → 메인 투표 영역 출력

**자주 틀리는 점**: ① `bootstrap` 객체를 쓰는데 bundle JS를 먼저 로드하지 않음 ② 모달의 `data-bs-target` id와 모달 요소 id 불일치 ③ `.hidden` 같은 직접 만든 클래스를 지우고도 JS에서 계속 사용 → `d-none`으로 통일 ④ `collapse` 대상에 `collapse` 클래스를 빼먹음 ⑤ 모달 안 입력값이 이전 입력으로 남음(열 때 초기화 필요).

**복습 질문**: (1) 새 창 대신 모달을 쓰면 데이터 공유가 어떻게 달라지나? (2) 모달을 JS로 닫는 코드는? (3) `d-none`과 직접 만든 `.hidden`의 차이는? (4) `collapse` 전체 펼치기를 구현하는 방법은? (5) 모달이 열릴 때마다 폼을 초기화하려면 어떤 이벤트를 쓰나?

---

## Part 4. 시험 대비 총정리

### 1. 실습별 용도·목적 한눈에 보기

| 실습 | 폴더 | 목적 | 핵심 개념 |
|---|---|---|---|
| 1-3 BookCafe | `front_ws_01_3` | HTML5 **시맨틱 구조·폼·표** 익히기 | header/nav/main/section/article/aside/footer, details, form, table, figure |
| 1-2 영화관리 | `front_hw_01_2` | 메인화면 **HTML 뼈대** 작성 | ul/li 반복 구조, 검색 form, button type, img alt |
| 2-2 영화관리 CSS | `front_hw_02_2` | 같은 화면에 **CSS 스타일링** | 외부 CSS 연결, reset, Flexbox, position(absolute/sticky) |
| 2-3 BookCafe CSS | `front_ws_02_3` | BookCafe에 **CSS 레이아웃** 적용 | 2단 Flex 레이아웃, class·자식 선택자, details, object-fit, margin auto |
| 3-2 영화관리 JS | `front_hw_03_2` | 찜 버튼 **클릭 이벤트** 처리 | querySelectorAll, forEach, addEventListener, event.target |
| 3-3 BookCafe JS | `front_ws_03_3` | 로그인·메뉴 전환·펼치기/접기·팝업 | prompt/alert, classList.toggle, window.open, DOM 생성/삭제 |
| 4-2 영화관리 Storage | `front_hw_04_2` | 찜 목록을 브라우저에 **저장·복원** | localStorage, JSON.stringify/parse |
| 4-3 BookCafe 투표 | `front_ws_04_3` | 팝업에서 만든 투표를 저장해 메인에 출력 | localStorage 공유, storage 이벤트, 유효성 검사 |
| 5-2 영화목록 AJAX | `front_hw_05_2` | JSON을 비동기로 받아 목록 생성, 동적 요소에 이벤트 | XMLHttpRequest, 이벤트 위임, 버블링 |
| 5-3 BookCafe 도서목록 | `front_ws_05_3` | 공통 AJAX 함수로 XML·JSON 데이터를 받아 목록 생성 | readyState/status, responseXML, JSON.parse |
| 6-2 영화관리 Bootstrap | `front_hw_06_2` | CSS를 직접 쓰지 않고 **Bootstrap5 컴포넌트·그리드**로 반응형 화면 구성 | CDN, navbar, grid(`col-*`, `row-cols-*`), card, Icons, utility 클래스 |
| 6-3 BookCafe Bootstrap | `front_ws_06_3` | 로그인·투표·AJAX 기능은 유지하며 UI만 Bootstrap으로 교체 | modal, collapse, dropdown, d-none 토글 |

흐름: **구조(HTML) → 표현(CSS) → (다음) 동작(JavaScript)**

### 2. "이럴 땐 이 태그/속성" 빠른 찾기

| 하고 싶은 일 | 사용 |
|---|---|
| 페이지 머리/꼬리/핵심/부가/주제묶음 | `header` / `footer` / `main` / `aside` / `section` |
| 독립 콘텐츠(게시글 등) | `article` |
| 링크 모음(메뉴) | `nav` + `ul/li/a` |
| 이미지 + 설명 | `figure` + `figcaption` |
| 접기/펼치기 | `details` + `summary` |
| 같은 종류 반복 항목 | `ul/li` (순서 필요 시 `ol`) |
| 라디오 그룹 하나만 선택 | 같은 `name` |
| 라벨 클릭으로 입력 선택 | `label for` = `input id` |
| 폼 전송 / 전송 안 함 | `button type="submit"` / `type="button"` |
| 데이터 표 | `table > thead/tbody > tr > th/td` |
| CSS 파일 연결 | `<link rel="stylesheet" href="...">` (head) |
| 가로 배치 | 부모 `display: flex` |
| 양끝/가운데 정렬 | `justify-content: space-between` / `center` |
| 줄바꿈되는 반응형 목록 | `flex-wrap: wrap` |
| 스크롤해도 따라다님 | `position: sticky` / `fixed` |
| 2단(사이드+본문) 레이아웃 | 부모 `flex`, 사이드 `width` 고정 + `flex-shrink:0`, 본문 `flex:1` |
| 블록 가운데 정렬 | `width` + `margin: 0 auto` |
| 크기 다른 이미지 비율 맞춤 | `object-fit: contain` |
| 바로 아래 자식만 선택 | `부모 > 자식` |
| 같은 종류 요소 여러 개에 이벤트 | `querySelectorAll` + `forEach` + `addEventListener` |
| 요소 보이기/숨기기 | CSS `.hidden{display:none}` + `classList.toggle` |
| 클릭된 요소 / 그 부모 | `event.target` / `parentElement` |
| 링크 기본 이동 막기 | `event.preventDefault()` |
| 팝업 창 열기 | `window.open(url, 이름, 옵션)` |
| 사용자 입력 받기 / 알림 | `prompt()` / `alert()` |
| 새로고침해도 데이터 유지 | `localStorage.setItem/getItem` |
| 객체/배열 저장·복원 | `JSON.stringify` / `JSON.parse` |
| 다른 창에서 바뀐 storage 감지 | `window.addEventListener("storage", …)` |
| 배열을 HTML 목록으로 | `map` + 템플릿 리터럴 + `join("")` |
| 서버/파일에서 데이터 비동기로 가져오기 | `XMLHttpRequest` (`open` → `send` → `onload`) |
| 나중에 생성될 요소에 이벤트 | 부모에 위임 + `event.target.matches(...)` |
| XML 응답 / JSON 응답 파싱 | `responseXML` + `getElementsByTagName` / `JSON.parse(responseText)` |
| 반응형 레이아웃을 CSS 없이 | Bootstrap grid: `container > row > col-12 col-md-9` |
| 화면 크기별 N개씩 카드 | `row row-cols-1 row-cols-sm-2 row-cols-lg-4` |
| 반응형 상단 메뉴(햄버거) | `navbar navbar-expand-lg` + `navbar-toggler` + `collapse` |
| 아이콘 사용 | Bootstrap Icons CDN + `<i class="bi bi-heart-fill">` |
| 새 창 대신 팝업 UI | Bootstrap modal: `data-bs-toggle="modal" data-bs-target="#id"` |
| 접기/펼치기 | `collapse` + `data-bs-toggle="collapse" data-bs-target="#id"` |
| Bootstrap에서 요소 숨기기/보이기 | `d-none` 클래스 + `classList.toggle` |
| JS로 모달/Collapse 제어 | `bootstrap.Modal.getOrCreateInstance(el).hide()` |
| 응답 완료·성공 확인 | `readyState === 4 && status === 200` |
| 사용자 입력을 안전하게 출력 | `textContent` 또는 escape 후 `innerHTML` |
| 부모 안 특정 모서리에 배치 | 부모 `relative` + 자식 `absolute` |

### 3. 자주 틀리는 포인트

1. `display: flex`는 **자식이 아니라 부모**에 건다.
2. `justify-content`는 **주축(기본 가로)**, `align-items`는 **교차축(세로)**.
3. `absolute`는 가장 가까운 `position`이 있는 **조상** 기준 → 없으면 화면 기준이 되어 위치가 틀어짐.
4. `sticky`는 `top` 같은 기준값이 없으면 동작하지 않는다.
5. `box-sizing: border-box`면 width에 padding/border가 **포함**된다.
6. `h1`은 페이지당 1개, `main`도 1개.
7. `ul` 중첩은 `ul` 바로 아래가 아니라 **`li` 안에**.
8. `id`는 문서 내 **고유**, `class`는 **여러 요소 공유** 가능.
9. 스타일 우선순위: 인라인 > id > class > 태그, 동점이면 **나중에 쓴 규칙**.
10. 이미지 경로는 **HTML 파일 기준 상대경로** (CSS 안 `url()`은 CSS 파일 기준).

### 4. 예상 문제 (정답 포함)

**OX**
1. `<section>`은 독립 배포가 가능한 콘텐츠에 쓴다. → **X** (`article`)
2. `button type="button"`은 폼을 전송한다. → **X**
3. `*{margin:0;padding:0}`은 모든 요소에 적용된다. → **O**
4. `position: sticky`는 스크롤 시 지정 위치에 고정되어 따라온다. → **O**
5. `flex-wrap`을 주면 공간 부족 시 아이템이 다음 줄로 넘어간다. → **O**

**단답**
1. CSS 적용 3가지 방법 → 인라인, 내부 참조(`<style>`), 외부 참조(`<link>`)
2. 검색창 안내 문구를 넣는 속성 → `placeholder`
3. 이미지가 안 보일 때 대체로 표시되는 텍스트 속성 → `alt`
4. 요소를 가로로 배치하려는 부모에 쓰는 속성 → `display: flex`
5. 라디오 버튼을 한 그룹으로 묶는 속성 → `name`

**서술**
1. 외부 참조 방식의 장점은? → 여러 페이지가 한 파일을 공유해 유지보수가 쉽고, 구조(HTML)와 스타일(CSS)이 분리된다.
2. 스타일 초기화를 하는 이유는? → 브라우저마다 다른 기본 여백·스타일을 없애 의도한 대로 일관되게 디자인하기 위해.
3. 찜 버튼을 카드 우측 하단에 두는 방법은? → `li{position:relative}` + `button{position:absolute; right:0; bottom:..}`.
4. 찜리스트를 스크롤해도 화면에 남기려면? → `aside{position:sticky; top:값; align-self:flex-start}`.
5. 여러 개의 찜 버튼에 클릭 이벤트를 다는 순서는? → `querySelectorAll`로 선택 → `forEach`로 순회 → 각 버튼에 `addEventListener("click", handler)`.
6. 로그인 성공 시 메뉴·프로필을 바꾸는 방법은? → 바꿀 요소에 `.hidden` 클래스를 두고 `classList.toggle`로 표시/숨김 전환.

### 5. 시험 직전 체크

- [ ] 시맨틱 태그 7종 역할 말할 수 있는가
- [ ] label/input, radio name 규칙을 설명할 수 있는가
- [ ] Flex 핵심 5속성(`display`, `justify-content`, `align-items`, `gap`, `flex-wrap`)을 쓸 수 있는가
- [ ] position 5값의 차이를 구분하는가
- [ ] reset 코드 3줄(`*`, `a`, `ul`)을 외웠는가
- [ ] 자식(`>`)/자손(공백) 선택자와 class 선택자를 구분하는가
- [ ] 2단 레이아웃(`flex` + 고정폭 + `flex:1`)을 직접 짤 수 있는가
- [ ] `querySelectorAll` → `forEach` → `addEventListener` 흐름을 직접 쓸 수 있는가
- [ ] `handler`와 `handler()`의 차이를 설명할 수 있는가
- [ ] `classList.toggle`로 표시/숨김을 구현할 수 있는가
- [ ] `localStorage`와 `sessionStorage`의 차이, `JSON.stringify/parse`가 필요한 이유를 설명할 수 있는가
- [ ] `storage` 이벤트로 창 사이에 데이터를 동기화하는 흐름을 설명할 수 있는가
- [ ] 입력값 유효성 검사(필수값, 날짜 순서, 최소 개수)를 코드로 쓸 수 있는가
- [ ] `XMLHttpRequest`로 JSON을 받아 화면에 그리는 흐름과 비동기 순서를 설명할 수 있는가
- [ ] 동적 요소에 이벤트가 안 걸리는 이유와 이벤트 위임(버블링)을 설명할 수 있는가
- [ ] XML과 JSON 응답의 파싱 방법 차이, `readyState 4`/`status 200`의 의미를 설명할 수 있는가
- [ ] Bootstrap CDN(CSS/JS) 연결, grid의 12칸 규칙과 breakpoint(`sm/md/lg`)를 설명할 수 있는가
- [ ] 새 창(window.open)을 Bootstrap modal로 바꾸는 방법과 모달 이벤트(`show.bs.modal`)를 설명할 수 있는가
