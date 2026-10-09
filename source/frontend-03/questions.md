## question: frontend-03-q01
```json
{
  "title": "inline-block 요소의 특징",
  "topics": [
    "html"
  ],
  "tags": [
    "block-inline"
  ],
  "group": "html",
  "type": "mc",
  "id": "frontend-03-q01",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 1. HTML 기본 및 시맨틱 웹"
  ],
  "difficulty": 1,
  "correctChoiceId": "a"
}
```
### stem
`display: inline-block`인 요소의 특징으로 옳은 것은?
### choice: a
같은 줄에 놓이고 크기를 지정할 수 있다
### choice: c
새 줄에서 시작해 부모 폭을 채운다
### choice: d
width와 height가 무시된다
### choice: b
내부에 다른 요소를 둘 수 없다

## question: frontend-03-q02
```json
{
  "title": "number 입력의 value 타입",
  "topics": [
    "html"
  ],
  "tags": [
    "input-types"
  ],
  "group": "html",
  "type": "mc",
  "id": "frontend-03-q02",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 1. HTML 기본 및 시맨틱 웹"
  ],
  "difficulty": 2,
  "correctChoiceId": "d"
}
```
### stem
다음 코드의 출력은?
```html
<input id="n" type="number"
  value="5">
```
```js
const n =
  document.querySelector('#n');
console.log(n.value + 1);
```
### choice: b
출력은 `6`
### choice: d
출력은 `51`
### choice: c
출력은 `NaN`
### choice: a
출력은 `5`

## question: frontend-03-q03
```json
{
  "title": "div를 의미에 맞는 태그로 바꾸기",
  "topics": [
    "html"
  ],
  "tags": [
    "semantic-tags"
  ],
  "group": "html",
  "type": "mc",
  "id": "frontend-03-q03",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 1. HTML 기본 및 시맨틱 웹"
  ],
  "difficulty": 1,
  "correctChoiceId": "b"
}
```
### stem
다음 세 `div`를 의미에 맞는 시맨틱 태그로 바꿀 때 위에서부터 알맞은 순서는?
```html
<body>
  <div>로고와 메뉴</div>
  <div>핵심 내용</div>
  <div>저작권 안내</div>
</body>
```
### choice: c
main과 header와 footer
### choice: a
nav와 article과 aside
### choice: d
footer와 main과 header
### choice: b
header와 main과 footer

## question: frontend-03-q04
```json
{
  "title": "자식 결합자의 선택 범위",
  "topics": [
    "css"
  ],
  "tags": [
    "selectors"
  ],
  "group": "css",
  "type": "mc",
  "id": "frontend-03-q04",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 2. CSS 레이아웃 및 선택자"
  ],
  "difficulty": 1,
  "correctChoiceId": "b"
}
```
### stem
선택자 `.box > p`가 선택하는 문단은?
```html
<div class="box">
  <p>1</p>
  <span><p>2</p></span>
  <p>3</p>
</div>
```
### choice: d
1번과 2번과 3번
### choice: c
2번 문단만
### choice: b
1번과 3번만
### choice: a
1번 문단만

## question: frontend-03-q05
```json
{
  "title": "인라인 스타일과 important의 우선순위",
  "topics": [
    "css"
  ],
  "tags": [
    "specificity"
  ],
  "group": "css",
  "type": "mc",
  "id": "frontend-03-q05",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 2. CSS 레이아웃 및 선택자"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
다음 요소의 글자색은?
```html
<p id="a" style="color: red">T</p>
```
```css
#a {
  color: blue !important;
}
```
### choice: b
`red`
### choice: a
`blue`
### choice: d
`black`
### choice: c
`purple`

## question: frontend-03-q06
```json
{
  "title": "퍼센트 width와 padding의 합",
  "topics": [
    "css"
  ],
  "tags": [
    "box-model"
  ],
  "group": "css",
  "type": "mc",
  "id": "frontend-03-q06",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 2. CSS 레이아웃 및 선택자"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
부모의 콘텐츠 폭이 400px일 때 다음 요소의 border 박스 가로 크기는? `box-sizing`은 기본값이다.
```css
.c {
  width: 50%;
  padding: 0 20px;
}
```
### choice: a
240px
### choice: d
200px
### choice: c
220px
### choice: b
280px

## question: frontend-03-q07
```json
{
  "title": "부모와 첫 자식의 마진 병합",
  "topics": [
    "css"
  ],
  "tags": [
    "margin-collapse"
  ],
  "group": "css",
  "type": "mc",
  "id": "frontend-03-q07",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 2. CSS 레이아웃 및 선택자"
  ],
  "difficulty": 3,
  "correctChoiceId": "c"
}
```
### stem
부모에 padding과 border가 없을 때 첫 자식의 `margin-top: 20px`가 만드는 결과는?
```html
<div class="parent">
  <div class="child">C</div>
</div>
```
```css
.child {
  margin-top: 20px;
}
```
### choice: c
부모 상자 전체가 아래로 20px 밀린다
### choice: b
자식은 부모 안에서 20px 내려가고 부모는 그대로다
### choice: a
마진이 무시되어 위치가 바뀌지 않는다
### choice: d
부모 높이가 20px 늘어난다

## question: frontend-03-q08
```json
{
  "title": "var 반복문과 클로저",
  "topics": [
    "js"
  ],
  "tags": [
    "declarations"
  ],
  "group": "js",
  "type": "mc",
  "id": "frontend-03-q08",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 3. JavaScript 핵심 문법 및 데이터 타입"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
다음 코드의 출력은?
```js
const fns = [];
for (var i = 0; i < 3; i++) {
  fns.push(() => i);
}
console.log(
  fns.map((f) => f()).join()
);
```
### choice: d
`0,1,2`
### choice: a
`3,3,3`
### choice: b
`1,2,3`
### choice: c
`2,2,2`

## question: frontend-03-q09
```json
{
  "title": "논리 연산자가 반환하는 값",
  "topics": [
    "js"
  ],
  "tags": [
    "truthy-falsy"
  ],
  "group": "js",
  "type": "mc",
  "id": "frontend-03-q09",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 3. JavaScript 핵심 문법 및 데이터 타입"
  ],
  "difficulty": 2,
  "correctChoiceId": "b"
}
```
### stem
다음 코드의 출력은?
```js
const a = 0 || 'x';
const b = 'q' && 0;
const c = '' || null;
console.log(a, b, c);
```
### choice: d
`x q null`
### choice: c
`0 0 null`
### choice: a
`true 0 false`
### choice: b
`x 0 null`

## question: frontend-03-q10
```json
{
  "title": "얕은 복사한 배열의 요소 공유",
  "topics": [
    "js"
  ],
  "tags": [
    "spread-copy"
  ],
  "group": "js",
  "type": "mc",
  "id": "frontend-03-q10",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 3. JavaScript 핵심 문법 및 데이터 타입"
  ],
  "difficulty": 2,
  "correctChoiceId": "d"
}
```
### stem
다음 코드의 출력은?
```js
const a = [[1], [2]];
const b = [...a];
b[0].push(9);
b.push([3]);
console.log(a.length, a[0].length);
```
### choice: c
`3 2`
### choice: d
`2 2`
### choice: b
`2 1`
### choice: a
`3 1`

## question: frontend-03-q11
```json
{
  "title": "sort 기본 정렬의 비교 기준",
  "topics": [
    "js"
  ],
  "tags": [
    "array-methods"
  ],
  "group": "js",
  "type": "mc",
  "id": "frontend-03-q11",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 3. JavaScript 핵심 문법 및 데이터 타입"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
다음 코드의 출력은?
```js
const nums = [10, 9, 1];
nums.sort();
console.log(nums.join());
```
### choice: d
`1,9,10`
### choice: c
`10,9,1`
### choice: b
`9,10,1`
### choice: a
`1,10,9`

## question: frontend-03-q12
```json
{
  "title": "이벤트 핸들러에서 this 비교",
  "topics": [
    "this"
  ],
  "tags": [
    "this-binding"
  ],
  "group": "this",
  "type": "mc",
  "id": "frontend-03-q12",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 4. JavaScript의 함수와 this 바인딩"
  ],
  "difficulty": 3,
  "correctChoiceId": "d"
}
```
### stem
다음 코드의 출력은?
```js
const b = document.body;
b.onclick = function () {
  console.log(this === b);
};
b.click();
b.onclick = () => {
  console.log(this === b);
};
b.click();
```
### choice: c
`true true`
### choice: d
`true false`
### choice: a
`false true`
### choice: b
`false false`

## question: frontend-03-q13
```json
{
  "title": "객체 메서드를 화살표 함수로 쓰면 곤란한 이유",
  "topics": [
    "this"
  ],
  "tags": [
    "this-binding"
  ],
  "group": "this",
  "type": "mc",
  "id": "frontend-03-q13",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 4. JavaScript의 함수와 this 바인딩"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
객체의 메서드를 화살표 함수로 정의했을 때 문제가 되는 이유는?
### choice: d
화살표 함수는 속성 값으로 쓸 수 없기 때문이다
### choice: b
화살표 함수는 인자를 받을 수 없기 때문이다
### choice: a
this가 객체가 아니라 바깥 스코프의 this가 되기 때문이다
### choice: c
메서드는 호출할 때마다 새 함수로 바뀌기 때문이다

## question: frontend-03-q14
```json
{
  "title": "이미 있는 노드를 after와 before로 옮기기",
  "topics": [
    "dom"
  ],
  "tags": [
    "insert-methods"
  ],
  "group": "dom",
  "type": "mc",
  "id": "frontend-03-q14",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 5. DOM 및 BOM 제어"
  ],
  "difficulty": 2,
  "correctChoiceId": "b"
}
```
### stem
다음 코드 실행 후 `body`의 `textContent`는?
```html
<p>A</p><i>B</i>
```
```js
const p = document.querySelector('p');
const i = document.querySelector('i');
p.after(i);
p.before(i);
const t = document.body.textContent;
console.log(t);
```
### choice: a
`AB`
### choice: c
`ABB`
### choice: d
`BAB`
### choice: b
`BA`

## question: frontend-03-q15
```json
{
  "title": "toggle의 force 인자",
  "topics": [
    "dom"
  ],
  "tags": [
    "classlist"
  ],
  "group": "dom",
  "type": "mc",
  "id": "frontend-03-q15",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 5. DOM 및 BOM 제어"
  ],
  "difficulty": 2,
  "correctChoiceId": "d"
}
```
### stem
다음 코드의 출력은?
```js
const el = document.body;
const c = el.classList;
el.className = 'a';
const r1 = c.toggle('a', false);
const r2 = c.toggle('b', true);
console.log(r1, r2, el.className);
```
### choice: d
`false true b`
### choice: a
`true true a b`
### choice: b
`false false a`
### choice: c
`true false b`

## question: frontend-03-q16
```json
{
  "title": "익명 함수로 리스너 제거 시도",
  "topics": [
    "dom"
  ],
  "tags": [
    "event-listener"
  ],
  "group": "dom",
  "type": "mc",
  "id": "frontend-03-q16",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 5. DOM 및 BOM 제어"
  ],
  "difficulty": 3,
  "correctChoiceId": "b"
}
```
### stem
다음 코드의 출력은?
```js
const b = document.body;
b.addEventListener(
  'click', () => console.log('A')
);
b.removeEventListener(
  'click', () => console.log('A')
);
b.click();
```
### choice: b
A가 한 번 출력된다
### choice: c
아무것도 출력되지 않는다
### choice: a
A가 두 번 출력된다
### choice: d
TypeError가 발생한다

## question: frontend-03-q17
```json
{
  "title": "resolve 이후에 던진 예외",
  "topics": [
    "async"
  ],
  "tags": [
    "promise-state"
  ],
  "group": "async",
  "type": "mc",
  "id": "frontend-03-q17",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 6. 비동기 통신과 Promise"
  ],
  "difficulty": 2,
  "correctChoiceId": "d"
}
```
### stem
다음 코드의 출력은?
```js
new Promise((resolve) => {
  resolve('ok');
  throw new Error('late');
}).then(
  (v) => console.log(v),
  () => console.log('err'),
);
```
### choice: b
출력은 `err`
### choice: c
출력은 `late`
### choice: d
출력은 `ok`
### choice: a
출력이 없다

## question: frontend-03-q18
```json
{
  "title": "catch에서 다시 던진 값의 흐름",
  "topics": [
    "async"
  ],
  "tags": [
    "promise-chain"
  ],
  "group": "async",
  "type": "mc",
  "id": "frontend-03-q18",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 6. 비동기 통신과 Promise"
  ],
  "difficulty": 2,
  "correctChoiceId": "b"
}
```
### stem
다음 코드의 출력은?
```js
Promise.reject('e1')
  .catch((e) => {
    throw e + '+';
  })
  .catch((e) => e + '!')
  .then(console.log);
```
### choice: d
출력은 `e1!`
### choice: c
출력은 `e1+`
### choice: a
출력은 `undefined`
### choice: b
출력은 `e1+!`

## question: frontend-03-q19
```json
{
  "title": "try와 finally가 있는 async 함수",
  "topics": [
    "async"
  ],
  "tags": [
    "async-await"
  ],
  "group": "async",
  "type": "mc",
  "id": "frontend-03-q19",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 6. 비동기 통신과 Promise"
  ],
  "difficulty": 3,
  "correctChoiceId": "d"
}
```
### stem
다음 코드의 출력 순서는?
```js
async function f() {
  try {
    await Promise.reject('x');
  } catch (e) {
    return 'c' + e;
  } finally {
    console.log('f');
  }
}
f().then(console.log);
```
### choice: b
cx 다음 f
### choice: c
cx 하나를 출력
### choice: d
f 다음 cx
### choice: a
f 하나를 출력

## question: frontend-03-q20
```json
{
  "title": "직렬화와 역직렬화 뒤의 타입",
  "topics": [
    "storage"
  ],
  "tags": [
    "json-serialize"
  ],
  "group": "storage",
  "type": "mc",
  "id": "frontend-03-q20",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 7. 웹 스토리지 및 네트워크 데이터 전송"
  ],
  "difficulty": 2,
  "correctChoiceId": "d"
}
```
### stem
다음 코드의 출력은?
```js
const d = {
  t: new Date(0),
  m: new Map(),
};
const text = JSON.stringify(d);
const back = JSON.parse(text);
console.log(
  typeof back.t, typeof back.m
);
```
### choice: d
`string object`
### choice: c
`object object`
### choice: b
`string string`
### choice: a
`object undefined`

## question: frontend-03-q21
```json
{
  "title": "POST를 쓰는 것이 적절한 요청",
  "topics": [
    "storage"
  ],
  "tags": [
    "get-post"
  ],
  "group": "storage",
  "type": "mc",
  "id": "frontend-03-q21",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 7. 웹 스토리지 및 네트워크 데이터 전송"
  ],
  "difficulty": 1,
  "correctChoiceId": "d"
}
```
### stem
GET 대신 POST로 보내는 것이 적절한 요청은?
### choice: b
주소를 북마크해 다시 열 검색어 조회
### choice: c
공유 링크로 열리는 상품 목록 필터
### choice: a
캐시해도 되는 게시글 목록 조회
### choice: d
서버에 새 회원 정보를 저장하는 가입 제출

## question: frontend-03-q22
```json
{
  "title": "여러 개를 선택하는 입력 타입",
  "topics": [
    "html"
  ],
  "tags": [
    "input-types"
  ],
  "group": "html",
  "type": "short",
  "id": "frontend-03-q22",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 1. HTML 기본 및 시맨틱 웹"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "checkbox"
  ],
  "normalization": "caseFold"
}
```
### stem
여러 항목을 동시에 선택할 수 있도록 하는 `input`의 `type` 값을 쓰시오.

## question: frontend-03-q23
```json
{
  "title": "space-between의 항목 위치",
  "topics": [
    "css"
  ],
  "tags": [
    "flex-main-axis"
  ],
  "group": "css",
  "type": "short",
  "id": "frontend-03-q23",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 2. CSS 레이아웃 및 선택자"
  ],
  "difficulty": 3,
  "acceptedAnswers": [
    "125",
    "125px"
  ],
  "normalization": "trim"
}
```
### stem
컨테이너 안 두 번째 항목의 왼쪽 가장자리는 컨테이너 왼쪽에서 몇 px 떨어져 있는지 숫자만 쓰시오. 항목은 3개이고 HTML은 `div` 3개다.
```css
.row {
  display: flex;
  width: 300px;
  justify-content: space-between;
}
.row div {
  width: 50px;
}
```

## question: frontend-03-q24
```json
{
  "title": "sticky의 스크롤 전 배치",
  "topics": [
    "css"
  ],
  "tags": [
    "sticky"
  ],
  "group": "css",
  "type": "short",
  "id": "frontend-03-q24",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 2. CSS 레이아웃 및 선택자"
  ],
  "difficulty": 2,
  "acceptedAnswers": [
    "relative"
  ],
  "normalization": "caseFold"
}
```
### stem
`position: sticky` 요소는 달라붙는 임계 위치에 도달하기 전에 어떤 `position` 값과 비슷하게 배치되는지 쓰시오.

## question: frontend-03-q25
```json
{
  "title": "구조 분해로 값 교환",
  "topics": [
    "js"
  ],
  "tags": [
    "destructuring"
  ],
  "group": "js",
  "type": "short",
  "id": "frontend-03-q25",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 3. JavaScript 핵심 문법 및 데이터 타입"
  ],
  "difficulty": 2,
  "acceptedAnswers": [
    "2 3"
  ],
  "normalization": "trim"
}
```
### stem
다음 코드의 출력을 그대로 쓰시오.
```js
let a = 1;
let b = 2;
[a, b] = [b, a + b];
console.log(a, b);
```

## question: frontend-03-q26
```json
{
  "title": "템플릿 리터럴 안의 삼항 연산",
  "topics": [
    "js"
  ],
  "tags": [
    "template-literal"
  ],
  "group": "js",
  "type": "short",
  "id": "frontend-03-q26",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 3. JavaScript 핵심 문법 및 데이터 타입"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "7 is odd"
  ],
  "normalization": "trim"
}
```
### stem
다음 코드의 출력을 그대로 쓰시오.
```js
const n = 7;
console.log(
  `${n} is ${n % 2 ? 'odd' : 'even'}`
);
```

## question: frontend-03-q27
```json
{
  "title": "메서드를 꺼낸 뒤 호출한 오류",
  "topics": [
    "this"
  ],
  "tags": [
    "this-binding"
  ],
  "group": "this",
  "type": "short",
  "id": "frontend-03-q27",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 4. JavaScript의 함수와 this 바인딩"
  ],
  "difficulty": 2,
  "acceptedAnswers": [
    "TypeError"
  ],
  "normalization": "caseFold"
}
```
### stem
다음 코드의 출력을 쓰시오.
```js
class C {
  n = 3;
  get() {
    return this.n;
  }
}
const g = new C().get;
try {
  g();
} catch (e) {
  console.log(e.name);
}
```

## question: frontend-03-q28
```json
{
  "title": "타이머를 중지하는 메서드",
  "topics": [
    "dom"
  ],
  "tags": [
    "timers"
  ],
  "group": "dom",
  "type": "short",
  "id": "frontend-03-q28",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 5. DOM 및 BOM 제어"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "clearInterval",
    "clearInterval()"
  ],
  "normalization": "caseFold"
}
```
### stem
`setInterval`이 반환한 ID로 반복 타이머를 중지하는 메서드의 이름을 쓰시오. 소괄호는 있어도 없어도 된다.

## question: frontend-03-q29
```json
{
  "title": "응답 본문을 JSON으로 읽는 메서드",
  "topics": [
    "async"
  ],
  "tags": [
    "fetch-options"
  ],
  "group": "async",
  "type": "short",
  "id": "frontend-03-q29",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 6. 비동기 통신과 Promise"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "json",
    "json()",
    "res.json()",
    "response.json()"
  ],
  "normalization": "caseFold"
}
```
### stem
fetch의 응답 `Response` 객체에서 본문을 JSON으로 파싱해 Promise로 돌려주는 메서드의 이름을 쓰시오.

## question: frontend-03-q30
```json
{
  "title": "localStorage에 값을 저장하는 메서드",
  "topics": [
    "storage"
  ],
  "tags": [
    "web-storage"
  ],
  "group": "storage",
  "type": "short",
  "id": "frontend-03-q30",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 7. 웹 스토리지 및 네트워크 데이터 전송"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "setItem",
    "setItem()",
    "localStorage.setItem"
  ],
  "normalization": "caseFold"
}
```
### stem
`localStorage`에 키와 값을 저장하는 메서드의 이름을 쓰시오. 소괄호는 있어도 없어도 된다.

## question: frontend-03-q31
```json
{
  "title": "얕은 복사와 중첩 객체",
  "topics": [
    "js"
  ],
  "tags": [
    "spread-copy"
  ],
  "group": "js",
  "type": "essay",
  "id": "frontend-03-q31",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 3. JavaScript 핵심 문법 및 데이터 타입"
  ],
  "difficulty": 3,
  "rubric": [
    {
      "id": "r0",
      "criterion": "출력이 1과 3이라고 쓴다",
      "points": 1
    },
    {
      "id": "r1",
      "criterion": "스프레드는 한 단계만 복사하는 얕은 복사라고 설명한다",
      "points": 1
    },
    {
      "id": "r2",
      "criterion": "원시 값은 값이 복사되고 중첩 객체는 같은 참조를 공유한다고 설명한다",
      "points": 1
    },
    {
      "id": "r3",
      "criterion": "중첩 객체도 새로 복사해야 원본이 보호된다고 쓴다",
      "points": 1
    }
  ],
  "modelAnswer": "출력은 1과 3이다. 스프레드 연산자는 객체의 최상위 속성만 복사하는 얕은 복사다. n처럼 원시 값은 값이 복사되어 b.n의 변경이 a에 영향을 주지 않는다. list처럼 객체인 값은 같은 참조가 복사되어 b.list와 a.list가 하나의 배열을 가리키므로 push가 원본에도 보인다. 원본을 보호하려면 list도 새 배열로 복사해야 한다. 예를 들어 b의 list를 스프레드로 다시 복사하거나 structuredClone으로 전체를 복제한다."
}
```
### stem
다음 코드의 출력을 쓰고 스프레드 연산자로 복사한 객체가 원본과 어떤 부분을 공유하는지 설명하시오. 원본을 건드리지 않으려면 어떻게 해야 하는지도 쓰시오.
```js
const a = { n: 1, list: [1, 2] };
const b = { ...a };
b.n = 2;
b.list.push(3);
console.log(a.n, a.list.length);
```

## question: frontend-03-q32
```json
{
  "title": "JSON 전송 요청의 구성",
  "topics": [
    "async"
  ],
  "tags": [
    "fetch-options",
    "async-await"
  ],
  "group": "async",
  "type": "essay",
  "id": "frontend-03-q32",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 6. 비동기 통신과 Promise"
  ],
  "difficulty": 3,
  "rubric": [
    {
      "id": "r0",
      "criterion": "fetch의 옵션에 method를 POST로 지정한다",
      "points": 1
    },
    {
      "id": "r1",
      "criterion": "headers에 Content-Type을 application/json으로 지정한다고 쓴다",
      "points": 1
    },
    {
      "id": "r2",
      "criterion": "body에 JSON.stringify로 직렬화한 문자열을 넣는다고 쓴다",
      "points": 1
    },
    {
      "id": "r3",
      "criterion": "await로 기다려 res.json()으로 읽고 res.ok 확인이나 try와 catch로 실패를 처리한다고 쓴다",
      "points": 1
    }
  ],
  "modelAnswer": "async function create() { const res = await fetch('/api/items', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'pen' }) }); if (!res.ok) { throw new Error('요청 실패'); } return res.json(); } method로 POST를 지정하고 headers의 Content-Type으로 본문이 JSON임을 알리며 body에는 객체를 JSON.stringify한 문자열을 넣는다. await로 응답을 기다린 뒤 res.ok로 성공 여부를 확인하고 res.json()으로 본문을 읽는다. 호출하는 쪽에서는 try와 catch로 실패를 처리한다."
}
```
### stem
`/api/items`에 `{ name: 'pen' }`을 JSON으로 POST하고 응답 JSON을 읽어 오는 async 함수를 작성하고 각 부분의 역할을 설명하시오. 실패한 응답을 어떻게 처리할지도 포함하시오.
