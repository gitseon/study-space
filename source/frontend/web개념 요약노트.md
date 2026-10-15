# Web 개념 요약 노트

프론트엔드 범위(`source/frontend.md`)의 7개 주제를 개념 중심으로 정리한 노트이다. 각 주제는 핵심 표, 짧은 코드, 자주 틀리는 포인트, 복습 질문 순서로 구성한다.

## Part 1. HTML 기본과 시맨틱 웹

### 1. 블록 요소와 인라인 요소

| 구분 | 대표 요소 | 특징 |
|---|---|---|
| 블록(block) | `div` `p` `h1`~`h6` `ul` `li` `section` `form` | 새 줄에서 시작하고 부모 폭을 채움. `width`와 `height`, 세로 `margin`이 적용됨 |
| 인라인(inline) | `span` `a` `strong` `em` | 줄 안에서 이어짐. 내용 크기만큼만 차지하고 `width`와 `height`가 무시됨 |
| 인라인 블록(inline-block) | `button` `input` 처럼 `display: inline-block`인 요소 | 줄 안에 놓이면서 `width`와 `height`가 적용됨 |

- 기본 `display` 값이 요소마다 다를 뿐이므로 CSS의 `display`로 바꿀 수 있다.
- 인라인 요소 안에는 블록 요소를 넣지 않는 것이 원칙이다.
- `div`와 `span`은 의미가 없는 컨테이너이다. 의미가 드러나는 태그가 있으면 그것을 우선한다.

### 2. input 타입별 특성

| type | 동작 | 폼 전송 값 |
|---|---|---|
| `text` `password` `email` `number` | 한 줄 입력 | 입력한 문자열 (`number`의 `value`도 문자열) |
| `radio` | **같은 `name`끼리 하나만 선택** | 선택된 항목의 `value` |
| `checkbox` | 항목마다 독립적으로 켜고 끔 (다중 선택) | **체크된 항목만** 전송됨 |
| `submit` `button` `reset` | 전송 / 동작 없음 / 초기화 | `button`은 값 없음 |
| `file` `date` `range` `color` | 파일 선택 / 날짜 / 범위 / 색 | 각각 파일, `yyyy-mm-dd`, 숫자, `#rrggbb` |
| `hidden` | 화면에 보이지 않음 | 지정한 `value` |

```html
<input type="radio"
  name="lang" value="js">
<input type="radio"
  name="lang" value="py">
<input type="checkbox"
  name="hobby" value="game">
<input type="checkbox"
  name="hobby" value="book">
```

- 단일 선택은 `radio`에 같은 `name`, 다중 선택은 `checkbox`이다.
- 체크하지 않은 `checkbox`는 `name`과 `value` 쌍이 전송 데이터에서 빠진다.

### 3. 시맨틱 태그의 역할

| 태그 | 역할 | 비고 |
|---|---|---|
| `header` | 소개 영역 (로고, 제목, 메뉴) | 문서와 각 구획마다 둘 수 있음 |
| `nav` | 주요 이동 링크 묶음 | 보통 `ul/li/a`로 작성 |
| `main` | 문서의 핵심 콘텐츠 | **화면에 보이는 것은 문서에 하나** |
| `section` | 주제별 구획 (제목 포함) | 독립 배포가 어려우면 `section` |
| `article` | 따로 떼어 배포해도 말이 되는 콘텐츠 | 블로그 글, 뉴스 기사 |
| `aside` | 본문과 간접적인 부가 정보 | 사이드바, 광고 |
| `footer` | 마무리 정보 | 저작권, 약관 링크 |

- 시맨틱 태그는 검색엔진과 스크린리더가 문서 구조를 이해하는 단서가 된다.
- `figure`는 그림과 도표를 묶고 `figcaption`이 그 설명이다.

### 자주 틀리는 포인트

1. `main`을 여러 개 쓰거나 `header`를 문서에 하나만 쓸 수 있다고 생각한다.
2. `section`과 `article`의 기준을 외형이 아니라 독립성으로 판단하지 않는다.
3. 체크하지 않은 `checkbox`가 `false`로 전송된다고 생각한다.
4. 인라인 요소에 `width`를 지정하고 적용되지 않는 이유를 모른다.

### 복습 질문

1. `span`에 `width: 100px`을 지정하면 어떻게 되는가?
2. 단일 선택과 다중 선택에 쓰는 `input` 타입은 무엇인가?
3. `main`은 왜 문서에 하나만 두는가?

## Part 2. CSS 레이아웃과 선택자

### 1. 선택자 문법

| 선택자 | 예 | 의미 |
|---|---|---|
| 태그 | `p` | 모든 `p` |
| 클래스 | `.note` | `class="note"`인 요소 |
| 아이디 | `#main` | `id="main"`인 요소 (문서에서 고유) |
| 복합 | `p.note` | `p`이면서 `note` 클래스 (**공백 없음**) |
| 자손 | `div p` | `div` 안의 모든 `p` (공백) |
| 자식 | `div > p` | `div`의 **직계 자식** `p`만 |
| 인접 형제 | `h1 + p` | `h1` 바로 다음의 형제 `p` **하나** |
| 일반 형제 | `h1 ~ p` | `h1` 뒤에 오는 모든 형제 `p` |
| 그룹 | `h1, h2` | 두 대상에 같은 스타일 |

- `p.note`와 `p .note`는 다르다. 공백이 있으면 `p` 안쪽의 `.note`를 뜻한다.

### 2. 우선순위 (명시도)

| 단계 | 선택자 | 값 |
|---|---|---|
| 1 | 인라인 `style` | 가장 높음 |
| 2 | `#id` | (1, 0, 0) |
| 3 | `.class` `[attr]` `:hover` | (0, 1, 0) |
| 4 | 태그 `p` | (0, 0, 1) |

- id 개수, 클래스 개수, 태그 개수를 **앞자리부터** 비교한다. 클래스를 몇 개 합쳐도 id 하나를 넘지 못한다.
- 명시도가 같으면 **나중에 선언된 규칙**이 이긴다.
- `!important`는 일반 선언보다 우선한다. 둘 다 `!important`이면 다시 명시도로 비교한다. 스타일시트의 `!important`는 인라인의 일반 선언도 이긴다.

```css
#a { color: blue; }
.b { color: green !important; }
p.b { color: red; }
/* id a와 class b이면 green */
```

### 3. 박스 모델

안쪽부터 **content → padding → border → margin** 순서이다.

| `box-sizing` | `width`가 뜻하는 범위 | 예: width 100, padding 10, border 5 |
|---|---|---|
| `content-box` (기본값) | content만 | 보이는 폭 = 130px |
| `border-box` | content + padding + border | 보이는 폭 = 100px, content는 70px |

- `margin`은 박스 바깥 여백이라 `width`에 포함되지 않는다. 레이아웃 점유 폭은 margin까지 더한다.
- 퍼센트 `width`는 부모의 content 폭을 기준으로 계산한다.

### 4. 마진 병합 (Margin Collapsing)

- 일반 흐름에서 위아래로 인접한 블록의 **세로 마진은 합쳐져 큰 값 하나**가 된다. 30px과 20px이면 50px이 아니라 30px이다.
- 부모에 `padding`과 `border`가 없으면 부모와 첫 자식의 위쪽 마진도 병합되어 부모 전체가 내려간다.
- 병합이 일어나지 않는 경우는 가로 마진, `flex` 항목, `grid` 항목, `float`와 `absolute` 요소이다.

### 5. Flexbox 주축 정렬

| 속성 | 방향 | 값 |
|---|---|---|
| `flex-direction` | 주축을 정함 | `row`(기본) `column` |
| `justify-content` | **주축** 정렬 | `flex-start` `center` `flex-end` `space-between` `space-around` |
| `align-items` | **교차축** 정렬 | `stretch` `center` `flex-start` |

- `display: flex`는 항목이 아니라 **부모**에 건다.
- `flex-direction: column`이면 주축이 세로가 되어 `justify-content`가 세로 정렬을 한다.
- 폭 300px에 항목 3개(각 50px)를 `space-between`으로 놓으면 두 번째 항목은 125px에서 시작한다.

### 6. position: sticky

- 기준값(`top` 등)을 **반드시 함께 지정**해야 동작한다.
- 임계 위치에 닿기 전에는 `relative`처럼 원래 자리에 있다가 스크롤 중 지정 위치에 달라붙는다.
- 부모 영역 안에서만 따라다니며 조상의 `overflow`가 `visible`이 아니면 기대한 대로 동작하지 않을 수 있다.

```css
.bar {
  position: sticky;
  top: 0;
}
```

### 자주 틀리는 포인트

1. 인접 형제 `+`와 일반 형제 `~`를 같은 뜻으로 쓴다.
2. 선택자 구성 요소를 모두 더한 점수로 우선순위를 비교한다.
3. `border-box`에서 `width`가 content 폭이라고 생각한다.
4. `flex` 항목 사이의 마진도 병합된다고 생각한다.
5. `sticky`에 `top`을 주지 않는다.

### 복습 질문

1. `p.note`와 `p .note`의 차이는?
2. `!important`가 있는 선언과 id 선택자가 충돌하면?
3. 30px과 20px의 마진이 만나면 간격은 얼마인가?
4. `flex-direction: column`일 때 `justify-content`는 어느 방향을 정렬하는가?

## Part 3. JavaScript 핵심 문법과 데이터 타입

### 1. var, let, const

| 구분 | 범위 | 선언 전 접근 | 재선언 | 재할당 |
|---|---|---|---|---|
| `var` | 함수 | `undefined` (호이스팅) | 가능 | 가능 |
| `let` | 블록 | `ReferenceError` (TDZ) | 불가 | 가능 |
| `const` | 블록 | `ReferenceError` | 불가 | **불가** (초기값 필수) |

- `const` 객체의 속성은 바꿀 수 있다. 막는 것은 변수에 다시 대입하는 것이다.
- `var`로 만든 반복 변수는 하나뿐이라 콜백이 모두 반복이 끝난 값을 읽는다.
- 원시 타입은 `string` `number` `bigint` `boolean` `undefined` `null` `symbol`이다. `typeof null`은 `'object'`이다.

### 2. Truthy와 Falsy

- Falsy는 `false` `0` `-0` `0n` `''` `null` `undefined` `NaN`의 **8가지**이다.
- 나머지는 모두 Truthy이다. `[]` `{}` `'0'` `'false'` 함수도 참이다.
- `||`는 첫 참 값을 `&&`는 첫 거짓 값을 반환하며 `true`나 `false`가 아니라 **피연산자 값**을 돌려준다.

```js
const a = 0 || 'x';   // 'x'
const b = 'q' && 0;   // 0
```

### 3. 템플릿 리터럴

- 문자열을 백틱 문자로 감싸고 `${식}` 안에서 계산한다. 줄바꿈도 그대로 유지된다.

```js
const n = 3;
console.log(`${n} + ${n * 2}`);
// 3 + 6
```

### 4. 스프레드와 얕은 복사

- `{ ...obj }`와 `[...arr]`는 **한 단계만 복사**하는 얕은 복사이다.
- 원시 값은 값이 복사되고 중첩 객체는 같은 참조를 공유한다.
- 뒤에 쓴 속성이 앞의 같은 키를 덮어쓴다. 키의 원래 위치는 유지된다.
- 중첩까지 분리하려면 `structuredClone`을 쓴다.

```js
const a = { n: 1, list: [1, 2] };
const b = { ...a };
b.n = 2;
// a.n은 그대로 1
b.list.push(3);
// a.list도 [1, 2, 3]
```

### 5. 배열 메서드

| 메서드 | 원본 변경 | 동작 |
|---|---|---|
| `splice(start, deleteCount, ...items)` | **변경** | start부터 deleteCount개를 지우고 items를 삽입. 지운 요소의 배열을 반환 |
| `slice(start, end)` | 변경 안 함 | start부터 **end 앞까지** 복사한 새 배열 |
| `push` `pop` `shift` `unshift` | 변경 | 끝과 앞에서 추가와 제거 |
| `map` `filter` | 변경 안 함 | 새 배열 반환 |
| `sort()` | 변경 | 비교 함수가 없으면 **문자열 사전순** (`[10, 9, 1]` → `[1, 10, 9]`) |

### 6. 배열 구조 분해

```js
const [x, , y = 10, ...rest] =
  [1, 2, undefined, 4, 5];
// x = 1, rest = [4, 5]
// y = 10 (undefined라 기본값)
[a, b] = [b, a];
// 값 교환
```

- 위치로 매칭하고 쉼표로 건너뛴다. `undefined`일 때만 기본값을 쓰며 `null`에는 쓰지 않는다.

### 자주 틀리는 포인트

1. `let`도 호이스팅되지 않는다고 외워서 `undefined`가 나온다고 답한다.
2. 빈 배열과 빈 객체를 거짓으로 본다. 문자열 `'0'`도 참이다.
3. 스프레드가 중첩 객체까지 복사한다고 생각한다.
4. `slice`의 끝 인덱스를 포함시키거나 `splice`와 같다고 본다.

### 복습 질문

1. `const` 객체의 속성을 바꾸면 오류가 나는가?
2. `[]`와 `'0'`은 조건식에서 참인가 거짓인가?
3. 스프레드로 복사한 객체의 중첩 배열을 바꾸면 원본은?
4. `arr.splice(1, 2, 'a')`는 무엇을 하는가?

## Part 4. 함수와 this 바인딩

### 1. 일반 함수와 화살표 함수

| 구분 | this가 정해지는 시점 | 기준 |
|---|---|---|
| 일반 함수 | **호출할 때** | 호출 방식 |
| 화살표 함수 | **정의할 때** | 바깥 스코프의 this |

| 호출 방식 | 일반 함수의 this |
|---|---|
| `obj.method()` | `obj` |
| 단독 호출 `f()` | 엄격 모드는 `undefined`, 비엄격 모드는 전역 객체 |
| `f.call(x)` `apply` `bind` | 지정한 `x` |
| `new F()` | 새 인스턴스 |
| 이벤트 핸들러 (일반 함수) | 이벤트를 받은 요소 |

- 화살표 함수는 `call`과 `bind`로 this를 바꿀 수 없다.
- 클래스 본문은 엄격 모드이다. 메서드를 변수에 꺼내 단독 호출하면 this가 `undefined`이다.

### 2. 콜백 안의 this

```js
const team = {
  name: 'T',
  members: ['a', 'b'],
  list() {
    return this.members.map(
      (m) => this.name + m
    );
    // 화살표라서 list의 this를 사용
  },
};
```

- 콜백을 일반 함수로 쓰면 `map`이 단독 호출하므로 this가 team이 아니다.
- 객체 메서드를 화살표 함수로 정의하면 this가 객체가 아니라 바깥 스코프의 this가 되어 문제가 된다.
- `XMLHttpRequest`의 `onload`에 일반 함수를 쓰면 this가 요청 객체이다. 화살표 함수는 그렇지 않다.

### 자주 틀리는 포인트

1. 콜백의 this가 바깥 메서드의 this와 같다고 생각한다. 일반 함수 콜백은 다르다.
2. 화살표 함수를 객체 메서드로 쓰면 그 객체가 this가 된다고 생각한다.
3. 이벤트 핸들러에 화살표 함수를 쓰고 this가 요소이기를 기대한다.

### 복습 질문

1. 일반 함수의 this는 무엇으로 정해지는가?
2. 화살표 함수의 this는 call로 바꿀 수 있는가?
3. 엄격 모드에서 메서드를 꺼내 단독 호출하면 this는?

## Part 5. DOM과 BOM 제어

### 1. 요소 삽입 메서드

| 메서드 | 위치 |
|---|---|
| `el.before(x)` | `el` 바로 **앞** 형제 위치 |
| `el.after(x)` | `el` 바로 **뒤** 형제 위치 |
| `el.prepend(x)` | `el`의 **첫 자식** 위치 |
| `el.append(x)` | `el`의 **마지막 자식** 위치 |
| `el.remove()` | 문서에서 제거 |

- 문자열과 노드를 모두 받을 수 있다. 이미 문서에 있는 노드를 넘기면 복사가 아니라 **이동**한다.
- `appendChild`는 노드 하나만 받는다.

### 2. classList

| 메서드 | 동작 | 반환 |
|---|---|---|
| `add('a')` | 추가 | 없음 |
| `remove('a')` | 제거 (중복된 `a`도 모두 제거) | 없음 |
| `toggle('a')` | 있으면 제거 없으면 추가 | **토글 후 존재하면 true** |
| `toggle('a', force)` | `force`가 true면 추가 false면 제거 | 결과 상태 |
| `contains('a')` | 포함 여부 | 불리언 |

- 스타일을 JS가 직접 바꾸지 않고 **클래스만 토글**하면 모양은 CSS, 동작은 JS로 나뉜다.

### 3. 이벤트 리스너 등록

```js
// 함수 이름만 넘긴다
el.addEventListener('click', handler);
// 같은 함수 참조여야 제거됨
el.removeEventListener(
  'click', handler
);
```

- 같은 이벤트에 핸들러를 **여러 개** 등록할 수 있다. `onclick = ...`은 마지막 대입 하나만 남는다.
- `handler()`처럼 괄호를 붙이면 등록 시점에 즉시 실행된다.
- 익명 함수는 `removeEventListener`로 지울 수 없다. 서로 다른 함수 객체이기 때문이다.
- 클릭은 자식에서 부모로 **버블링**된다. 부모 하나에 리스너를 등록하고 `event.target`으로 구분하는 것이 이벤트 위임이다.

### 4. 타이머

| 메서드 | 동작 | 중지 |
|---|---|---|
| `setTimeout(fn, ms)` | 지연 후 **한 번** 실행 | `clearTimeout(id)` |
| `setInterval(fn, ms)` | 주기마다 **반복** 실행 | `clearInterval(id)` |

- 지연이 0이어도 콜백은 현재 동기 코드가 모두 끝난 뒤에 실행된다.

```js
console.log('A');
setTimeout(() => console.log('B'), 0);
console.log('C');   // A C B
```

### 5. window.location

| 항목 | 설명 |
|---|---|
| `location.href` | 전체 주소. 대입하면 이동 |
| `location.assign(url)` | 이동하며 방문 기록에 **추가** |
| `location.replace(url)` | 이동하며 현재 기록을 **교체** (뒤로 가기로 돌아올 수 없음) |
| `location.reload()` | 새로고침 |
| `pathname` `search` `hash` `origin` | 주소의 각 부분 |

### 자주 틀리는 포인트

1. `prepend`가 대상 앞에 붙는다고 생각한다. 대상의 첫 자식이다.
2. `toggle`의 반환값을 토글 전 상태로 생각한다.
3. `setTimeout(fn, 0)`이 즉시 실행된다고 생각한다.
4. 같은 내용의 익명 함수로 리스너를 지울 수 있다고 생각한다.

### 복습 질문

1. `before`와 `prepend`의 차이는?
2. `classList.toggle('a', false)`는 무엇을 하는가?
3. `setInterval`을 멈추려면 무엇이 필요한가?
4. `assign`과 `replace`의 차이는?

## Part 6. 비동기 통신과 Promise

### 1. Promise의 상태

- 상태는 `pending`에서 `fulfilled` 또는 `rejected`로 **한 번만** 바뀐다. 한 번 정해지면(settled) 바뀌지 않는다.
- 실행기(executor) 함수는 생성 즉시 **동기**로 실행된다. `then`의 콜백은 비동기로 실행된다.
- `resolve` 뒤의 `reject`나 `throw`는 무시된다.

```js
new Promise((resolve, reject) => {
  resolve('A');
  reject('B');   // 무시됨
}).then(console.log);   // A
```

### 2. 체이닝과 catch

- `then`은 **새 Promise**를 반환한다. 콜백의 반환값이 다음 `then`의 인자가 되고 반환이 없으면 `undefined`이다.
- 콜백에서 예외를 던지면 그 Promise는 rejected가 되고 거절 핸들러가 없는 `then`은 건너뛴다.
- `catch`는 오류를 처리하고 값을 반환하면 새 Promise가 fulfilled가 되어 **뒤의 `then`이 실행**된다.
- `catch` 안에서 다시 던지면 다음 `catch`로 넘어간다. `finally`는 성공과 실패에 관계없이 실행된다.

```js
Promise.resolve(1)
  .then(() => {
    throw new Error('x');
  })
  .catch(() => 2)
  .then((v) => console.log(v));   // 2
```

### 3. async와 await

- `async` 함수는 반환값을 항상 **Promise로 감싸** 돌려준다. `return 1`은 값이 1인 fulfilled Promise이다.
- `await`는 Promise가 settled될 때까지 그 함수의 실행을 멈추고 제어를 호출자에게 돌려준다. 첫 `await` 전까지는 동기로 실행된다.
- 거절된 Promise를 `await`하면 예외가 던져지므로 `try/catch`로 처리한다.

### 4. Fetch API 요청 옵션

```js
const res = await fetch('/api', {
  method: 'POST',
  headers: {
    'Content-Type':
      'application/json',
  },
  body: JSON.stringify({
    name: 'pen',
  }),
});
if (!res.ok) {
  throw new Error('요청 실패');
}
const data = await res.json();
```

| 항목 | 설명 |
|---|---|
| `method` | HTTP 메서드. 생략하면 `GET` |
| `headers` | 요청 헤더. JSON 본문은 `Content-Type: application/json` |
| `body` | 문자열이나 `FormData`. JSON은 `JSON.stringify`로 직렬화 |
| `res.ok` | 상태 코드 200번대인지. **404도 reject되지 않으므로** 직접 확인 |
| `res.json()` | 본문을 파싱하는 **Promise** |

### 5. XMLHttpRequest와 비동기 순서

- `xhr.send()` 뒤의 코드는 응답을 기다리지 않고 먼저 실행된다. 응답 처리는 `onload` 안에서 한다.
- `readyState`는 0에서 4까지 변하며 **4가 응답 수신 완료**이다. 성공 여부는 `status === 200`으로 따로 확인한다.

### 자주 틀리는 포인트

1. 마지막 `resolve`의 값이 쓰인다고 생각한다. 처음 호출이 상태를 정한다.
2. `catch` 뒤의 `then`이 실행되지 않는다고 생각한다.
3. `async` 함수가 값을 그대로 반환한다고 생각한다.
4. `fetch`가 404에서 reject된다고 생각한다.
5. `then` 콜백에서 값을 `return`하지 않고 다음 `then`에서 쓴다.

### 복습 질문

1. `resolve('A'); reject('B');`의 결과는?
2. `catch`가 값을 반환하면 이어지는 `then`은?
3. `async function f() { return 1; }`의 `f()`는 무엇인가?
4. JSON을 POST로 보낼 때 필요한 옵션 세 가지는?

## Part 7. 웹 스토리지와 네트워크 데이터 전송

### 1. JSON 직렬화와 역직렬화

| 메서드 | 방향 | 주의 |
|---|---|---|
| `JSON.stringify(v)` | 값 → 문자열 | 객체의 `undefined`와 함수와 `symbol` 속성은 **생략**, 배열 요소는 `null`. `Date`는 ISO 문자열 |
| `JSON.parse(s)` | 문자열 → 값 | 키와 문자열은 **큰따옴표**만 허용. 문법 오류는 `SyntaxError` |

- `Map`과 `Set`은 빈 객체가 되고 `Date`는 문자열이므로 파싱해도 원래 타입으로 돌아오지 않는다.

```js
const v = { a: 1, b: undefined };
v.c = [undefined];
JSON.stringify(v);
// '{"a":1,"c":[null]}'
```

### 2. localStorage와 sessionStorage

| 구분 | localStorage | sessionStorage |
|---|---|---|
| 보관 기간 | 지울 때까지 (브라우저를 닫아도 유지) | **탭을 닫으면 삭제** |
| 공유 범위 | 같은 출처의 모든 탭 | **탭마다 따로** |
| 서버 전송 | 안 함 | 안 함 |
| 저장 형식 | **문자열만** | 문자열만 |

- 객체를 그대로 `setItem`하면 `[object Object]`로 저장된다. `JSON.stringify`로 바꿔 저장하고 읽을 때 `JSON.parse`로 복원한다.
- 숫자를 저장해도 읽으면 문자열이다. 없는 키는 `getItem`이 `null`이다.
- `storage` 이벤트는 같은 출처의 **다른 창**에서 값이 바뀔 때만 발생한다. 값을 바꾼 창에는 발생하지 않는다.
- 쿠키와 달리 요청마다 서버로 자동 전송되지 않는다.

### 3. GET과 POST

| 구분 | GET | POST |
|---|---|---|
| 데이터 위치 | URL 뒤 **쿼리 문자열** | 요청 **본문** |
| 노출 | 주소창과 방문 기록에 남음 | URL에 드러나지 않음 |
| 북마크와 공유 | 가능 | 어려움 |
| 주된 용도 | 조회와 검색 | 생성과 변경 (가입, 로그인) |

- POST는 URL에 값이 남지 않을 뿐 **암호화가 아니다**. 보안에는 HTTPS가 필요하다.
- 폼에서는 `method`와 `action` 속성으로 정한다.

### 자주 틀리는 포인트

1. `JSON.stringify` 없이 객체를 저장한다.
2. 저장한 숫자가 숫자 타입으로 돌아온다고 생각한다.
3. 같은 창에서 저장해도 `storage` 이벤트가 발생한다고 생각한다.
4. POST면 안전하다고 생각한다.

### 복습 질문

1. `localStorage`와 `sessionStorage`의 차이는?
2. 객체를 저장할 때 왜 `JSON.stringify`가 필요한가?
3. GET과 POST는 데이터를 어디에 담는가?
4. 로그인 폼에 POST를 쓰는 이유는?

## Part 8. 시험 대비 총정리

### 1. 이럴 땐 이것

| 하고 싶은 일 | 사용 |
|---|---|
| 단일 선택과 다중 선택 | `radio`(같은 `name`)와 `checkbox` |
| 바로 아래 자식만 선택 | `부모 > 자식` |
| 바로 다음 형제 하나 | `h1 + p` |
| 가로 배치와 주축 정렬 | 부모 `display: flex` + `justify-content` |
| 스크롤 중 따라다님 | `position: sticky` + `top` |
| 얕은 복사 | `{ ...obj }` `[...arr]` |
| 배열 중간 삭제와 삽입 | `splice(start, deleteCount, ...items)` |
| 콜백에서 바깥 this 유지 | 화살표 함수 |
| 첫 자식으로 삽입 | `prepend` |
| 클래스 토글 | `classList.toggle` |
| 나중에 생긴 요소에 이벤트 | 부모에 위임 + `event.target` |
| 기록을 남기지 않는 이동 | `location.replace` |
| 오류 처리 후 흐름 계속 | `catch` 뒤의 `then` |
| JSON 요청 | `method` + `Content-Type` + `JSON.stringify` |
| 새로고침해도 유지 | `localStorage` + `JSON` |

### 2. 시험 직전 체크

- [ ] 인라인과 블록 요소의 차이를 말할 수 있는가
- [ ] `radio`와 `checkbox`의 전송 규칙을 설명할 수 있는가
- [ ] `main` `article` `section` `nav` `aside`의 역할을 구분하는가
- [ ] 명시도 비교 순서와 `!important`의 영향을 설명할 수 있는가
- [ ] `content-box`와 `border-box`의 폭 계산을 할 수 있는가
- [ ] 마진 병합이 일어나는 경우와 아닌 경우를 구분하는가
- [ ] `justify-content`와 `align-items`의 축을 구분하는가
- [ ] `sticky`가 동작하는 조건을 설명할 수 있는가
- [ ] `var` `let` `const`의 범위와 호이스팅 차이를 설명할 수 있는가
- [ ] Falsy 8가지를 말하고 `[]`와 `'0'`이 참임을 아는가
- [ ] 스프레드가 얕은 복사임을 설명할 수 있는가
- [ ] `splice`와 `slice`의 차이를 설명할 수 있는가
- [ ] 일반 함수와 화살표 함수의 `this` 차이를 설명할 수 있는가
- [ ] `before` `after` `prepend` `append`의 위치를 구분하는가
- [ ] `toggle`의 반환값과 `force` 인자를 설명할 수 있는가
- [ ] `setTimeout`과 `setInterval`의 차이와 실행 순서를 설명할 수 있는가
- [ ] `assign`과 `replace`의 차이를 설명할 수 있는가
- [ ] Promise의 상태 전이와 `catch` 이후의 흐름을 설명할 수 있는가
- [ ] `async` 함수의 반환 타입과 `await`의 실행 순서를 설명할 수 있는가
- [ ] `fetch`의 JSON POST 옵션을 쓸 수 있는가
- [ ] `JSON.stringify`와 `JSON.parse`의 규칙을 설명할 수 있는가
- [ ] `localStorage`와 `sessionStorage`의 차이를 설명할 수 있는가
- [ ] GET과 POST의 차이와 용도를 설명할 수 있는가
