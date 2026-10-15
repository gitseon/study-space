## question: frontend-01-q01
```json
{
  "title": "기본 display가 inline인 요소",
  "topics": [
    "html"
  ],
  "tags": [
    "block-inline"
  ],
  "group": "html",
  "type": "mc",
  "id": "frontend-01-q01",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.md 1. HTML 기본 및 시맨틱 웹"
  ],
  "difficulty": 1,
  "correctChoiceId": "a"
}
```
### stem
브라우저의 기본 스타일에서 `display` 값이 `inline`인 요소는?
### choice: d
`<div>`
### choice: c
`<form>`
### choice: b
`<ul>`
### choice: a
`<span>`

## question: frontend-01-q02
```json
{
  "title": "같은 name의 단일 선택 입력",
  "topics": [
    "html"
  ],
  "tags": [
    "input-types"
  ],
  "group": "html",
  "type": "mc",
  "id": "frontend-01-q02",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.md 1. HTML 기본 및 시맨틱 웹"
  ],
  "difficulty": 1,
  "correctChoiceId": "a"
}
```
### stem
같은 `name` 값을 가진 입력 요소 중 하나를 선택하면 나머지 선택이 해제되는 `input`의 `type`은?
### choice: c
`checkbox`
### choice: a
`radio`
### choice: b
`text`
### choice: d
`submit`

## question: frontend-01-q03
```json
{
  "title": "문서의 핵심 콘텐츠 태그",
  "topics": [
    "html"
  ],
  "tags": [
    "semantic-tags"
  ],
  "group": "html",
  "type": "mc",
  "id": "frontend-01-q03",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.md 1. HTML 기본 및 시맨틱 웹"
  ],
  "difficulty": 1,
  "correctChoiceId": "a"
}
```
### stem
문서의 핵심 콘텐츠를 담고 한 문서에 하나만 두는 것이 적절한 시맨틱 태그는?
### choice: a
`<main>`
### choice: d
`<header>`
### choice: c
`<aside>`
### choice: b
`<footer>`

## question: frontend-01-q04
```json
{
  "title": "인접 형제 선택자의 대상",
  "topics": [
    "css"
  ],
  "tags": [
    "selectors"
  ],
  "group": "css",
  "type": "mc",
  "id": "frontend-01-q04",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.md 2. CSS 레이아웃 및 선택자"
  ],
  "difficulty": 1,
  "correctChoiceId": "b"
}
```
### stem
다음 HTML에서 선택자 `h1 + p`가 선택하는 요소는?
```html
<h1>제목</h1>
<p>첫 문단</p>
<p>둘째 문단</p>
```
### choice: a
h1 뒤에 이어진 형제 p들
### choice: d
h1 안쪽에 들어 있는 모든 p
### choice: b
h1 바로 뒤의 형제 p 하나
### choice: c
h1의 직계 자식인 첫 번째 p

## question: frontend-01-q05
```json
{
  "title": "충돌하는 선언의 최종 글자색",
  "topics": [
    "css"
  ],
  "tags": [
    "specificity"
  ],
  "group": "css",
  "type": "mc",
  "id": "frontend-01-q05",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.md 2. CSS 레이아웃 및 선택자"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
다음 코드에서 문단의 글자색으로 적용되는 것은?
```html
<p id="a" class="b">안녕</p>
```
```css
#a {
  color: blue;
}
.b {
  color: green !important;
}
p.b {
  color: red;
}
```
### choice: d
`blue`
### choice: c
`red`
### choice: b
`black`
### choice: a
`green`

## question: frontend-01-q06
```json
{
  "title": "박스 모델의 가로 점유 크기",
  "topics": [
    "css"
  ],
  "tags": [
    "box-model"
  ],
  "group": "css",
  "type": "mc",
  "id": "frontend-01-q06",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.md 2. CSS 레이아웃 및 선택자"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
`box-sizing`이 기본값인 `content-box`일 때 다음 요소가 margin까지 포함해 가로로 차지하는 공간은?
```css
.box {
  width: 100px;
  padding: 10px;
  border: 5px solid;
  margin: 20px;
}
```
### choice: d
130px
### choice: c
160px
### choice: b
150px
### choice: a
170px

## question: frontend-01-q07
```json
{
  "title": "인접 블록 마진 병합",
  "topics": [
    "css"
  ],
  "tags": [
    "margin-collapse"
  ],
  "group": "css",
  "type": "mc",
  "id": "frontend-01-q07",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.md 2. CSS 레이아웃 및 선택자"
  ],
  "difficulty": 2,
  "correctChoiceId": "d"
}
```
### stem
일반 흐름에서 위아래로 이어진 두 블록 요소 사이의 세로 간격은? 두 요소 사이에 padding과 border는 없다.
```css
.a {
  margin-bottom: 30px;
}
.b {
  margin-top: 20px;
}
```
### choice: b
50px
### choice: d
30px
### choice: c
20px
### choice: a
10px

## question: frontend-01-q08
```json
{
  "title": "var와 let의 선언 전 접근",
  "topics": [
    "js"
  ],
  "tags": [
    "declarations"
  ],
  "group": "js",
  "type": "mc",
  "id": "frontend-01-q08",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.md 3. JavaScript 핵심 문법 및 데이터 타입"
  ],
  "difficulty": 2,
  "correctChoiceId": "d"
}
```
### stem
다음 코드를 실행했을 때 일어나는 일은?
```js
console.log(a);
var a = 1;
console.log(b);
let b = 2;
```
### choice: d
undefined 출력 후 ReferenceError
### choice: c
첫 줄에서 곧바로 ReferenceError
### choice: a
undefined를 두 번 연속으로 출력
### choice: b
undefined 다음에 값 2를 출력

## question: frontend-01-q09
```json
{
  "title": "조건식에서 참으로 평가되는 값",
  "topics": [
    "js"
  ],
  "tags": [
    "truthy-falsy"
  ],
  "group": "js",
  "type": "mc",
  "id": "frontend-01-q09",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.md 3. JavaScript 핵심 문법 및 데이터 타입"
  ],
  "difficulty": 2,
  "correctChoiceId": "d"
}
```
### stem
조건식에서 `true`로 평가되는 값은?
### choice: a
`0n`
### choice: b
`NaN`
### choice: d
`[]`
### choice: c
`""`

## question: frontend-01-q10
```json
{
  "title": "스프레드 얕은 복사 후 변경",
  "topics": [
    "js"
  ],
  "tags": [
    "spread-copy"
  ],
  "group": "js",
  "type": "mc",
  "id": "frontend-01-q10",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.md 3. JavaScript 핵심 문법 및 데이터 타입"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
다음 코드의 출력은?
```js
const a = { n: 1, list: [1, 2] };
const b = { ...a };
b.n = 2;
b.list.push(3);
console.log(a.n, a.list.length);
```
### choice: d
`2 3`
### choice: b
`1 2`
### choice: c
`2 2`
### choice: a
`1 3`

## question: frontend-01-q11
```json
{
  "title": "splice의 삭제와 삽입",
  "topics": [
    "js"
  ],
  "tags": [
    "array-methods"
  ],
  "group": "js",
  "type": "mc",
  "id": "frontend-01-q11",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.md 3. JavaScript 핵심 문법 및 데이터 타입"
  ],
  "difficulty": 2,
  "correctChoiceId": "b"
}
```
### stem
다음 코드의 출력은?
```js
const arr = [1, 2, 3, 4, 5];
arr.splice(1, 2, 'a');
console.log(arr.join('-'));
```
### choice: b
`1-a-4-5`
### choice: d
`1-a-3-4-5`
### choice: c
`1-a-2-3-4-5`
### choice: a
`1-2-a-5`

## question: frontend-01-q12
```json
{
  "title": "엄격 모드의 콜백 this",
  "topics": [
    "this"
  ],
  "tags": [
    "this-binding"
  ],
  "group": "this",
  "type": "mc",
  "id": "frontend-01-q12",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.md 4. JavaScript의 함수와 this 바인딩"
  ],
  "difficulty": 3,
  "correctChoiceId": "b"
}
```
### stem
다음 코드를 실행하면 `user.show()`에서 일어나는 일은?
```js
'use strict';
const user = {
  name: 'Kim',
  show() {
    return [1].map(function () {
      return this.name;
    });
  },
};
user.show();
```
### choice: b
TypeError가 발생한다
### choice: c
ReferenceError가 발생한다
### choice: d
`['Kim']`을 반환한다
### choice: a
`[undefined]`를 반환한다

## question: frontend-01-q13
```json
{
  "title": "화살표 함수의 this",
  "topics": [
    "this"
  ],
  "tags": [
    "this-binding"
  ],
  "group": "this",
  "type": "mc",
  "id": "frontend-01-q13",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.md 4. JavaScript의 함수와 this 바인딩"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
화살표 함수의 `this`에 대한 설명으로 옳은 것은?
### choice: b
호출한 객체에 따라 매번 달라진다
### choice: d
call의 첫 번째 인자가 this가 된다
### choice: c
전역 객체로 고정되어 있다
### choice: a
바깥 스코프의 this를 그대로 쓴다

## question: frontend-01-q14
```json
{
  "title": "before와 after와 prepend 위치",
  "topics": [
    "dom"
  ],
  "tags": [
    "insert-methods"
  ],
  "group": "dom",
  "type": "mc",
  "id": "frontend-01-q14",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.md 5. DOM 및 BOM 제어"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
다음 코드 실행 후 `#box`의 `textContent`는?
```html
<div id="box"><p>P</p></div>
```
```js
const p = document.querySelector('p');
p.before('1');
p.after('2');
p.prepend('3');
console.log(box.textContent);
```
### choice: c
`31P2`
### choice: a
`13P2`
### choice: d
`1P32`
### choice: b
`P123`

## question: frontend-01-q15
```json
{
  "title": "classList.toggle의 반환값",
  "topics": [
    "dom"
  ],
  "tags": [
    "classlist"
  ],
  "group": "dom",
  "type": "mc",
  "id": "frontend-01-q15",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.md 5. DOM 및 BOM 제어"
  ],
  "difficulty": 2,
  "correctChoiceId": "c"
}
```
### stem
다음 코드의 출력은?
```js
const el = document.body;
el.className = 'a b';
const r1 = el.classList.toggle('a');
const r2 = el.classList.toggle('c');
console.log(r1, r2, el.className);
```
### choice: c
`false true b c`
### choice: d
`true true a b c`
### choice: b
`false false b`
### choice: a
`true false a b`

## question: frontend-01-q16
```json
{
  "title": "setInterval과 setTimeout의 차이",
  "topics": [
    "dom"
  ],
  "tags": [
    "timers"
  ],
  "group": "dom",
  "type": "mc",
  "id": "frontend-01-q16",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.md 5. DOM 및 BOM 제어"
  ],
  "difficulty": 1,
  "correctChoiceId": "b"
}
```
### stem
`setInterval`과 `setTimeout`의 차이로 옳은 것은?
### choice: c
setInterval은 한 번 실행되고 setTimeout은 반복된다
### choice: b
setInterval은 반복되고 setTimeout은 한 번 실행된다
### choice: a
둘 다 clear 함수를 부르기 전까지 반복된다
### choice: d
둘 다 지연 후 한 번 실행되는 함수다

## question: frontend-01-q17
```json
{
  "title": "Promise 상태는 한 번만 바뀐다",
  "topics": [
    "async"
  ],
  "tags": [
    "promise-state"
  ],
  "group": "async",
  "type": "mc",
  "id": "frontend-01-q17",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.md 6. 비동기 통신과 Promise"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
다음 코드의 출력은?
```js
new Promise((resolve, reject) => {
  resolve('A');
  reject('B');
  resolve('C');
}).then(
  (v) => console.log(v),
  () => console.log('err'),
);
```
### choice: b
출력은 `B`
### choice: d
출력은 `C`
### choice: c
출력은 `err`
### choice: a
출력은 `A`

## question: frontend-01-q18
```json
{
  "title": "catch 이후의 체인 흐름",
  "topics": [
    "async"
  ],
  "tags": [
    "promise-chain"
  ],
  "group": "async",
  "type": "mc",
  "id": "frontend-01-q18",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.md 6. 비동기 통신과 Promise"
  ],
  "difficulty": 3,
  "correctChoiceId": "c"
}
```
### stem
다음 코드의 출력은?
```js
Promise.resolve('start')
  .then(() => {
    throw new Error('boom');
  })
  .catch(() => 'fixed')
  .then((v) => console.log(v));
```
### choice: b
출력은 `start`
### choice: c
출력은 `fixed`
### choice: d
출력은 `undefined`
### choice: a
출력은 `boom`

## question: frontend-01-q19
```json
{
  "title": "async 함수의 반환 타입",
  "topics": [
    "async"
  ],
  "tags": [
    "async-await"
  ],
  "group": "async",
  "type": "mc",
  "id": "frontend-01-q19",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.md 6. 비동기 통신과 Promise"
  ],
  "difficulty": 1,
  "correctChoiceId": "d"
}
```
### stem
다음 코드의 출력은?
```js
async function f() {
  return 1;
}
console.log(typeof f());
```
### choice: c
`number`
### choice: a
`function`
### choice: d
`object`
### choice: b
`undefined`

## question: frontend-01-q20
```json
{
  "title": "JSON.stringify의 직렬화 규칙",
  "topics": [
    "storage"
  ],
  "tags": [
    "json-serialize"
  ],
  "group": "storage",
  "type": "mc",
  "id": "frontend-01-q20",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.md 7. 웹 스토리지 및 네트워크 데이터 전송"
  ],
  "difficulty": 3,
  "correctChoiceId": "c"
}
```
### stem
다음 코드의 출력은?
```js
const data = {
  a: 1,
  b: undefined,
  c: [1, undefined],
  d: () => 1,
};
console.log(JSON.stringify(data));
```
### choice: a
`{"a":1,"b":null,"c":[1,null]}`
### choice: b
`{"a":1,"c":[1,null],"d":null}`
### choice: d
`{"a":1,"c":[1]}`
### choice: c
`{"a":1,"c":[1,null]}`

## question: frontend-01-q21
```json
{
  "title": "localStorage와 sessionStorage 비교",
  "topics": [
    "storage"
  ],
  "tags": [
    "web-storage"
  ],
  "group": "storage",
  "type": "mc",
  "id": "frontend-01-q21",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.md 7. 웹 스토리지 및 네트워크 데이터 전송"
  ],
  "difficulty": 1,
  "correctChoiceId": "c"
}
```
### stem
`localStorage`와 `sessionStorage`에 대한 설명으로 옳은 것은?
### choice: b
sessionStorage는 같은 출처의 모든 탭과 창이 값을 공유한다
### choice: a
localStorage는 저장할 때 만료 시간을 지정해야 한다
### choice: c
localStorage는 남고 sessionStorage는 탭을 닫으면 사라진다
### choice: d
두 저장소의 값은 요청할 때마다 서버로 자동 전송된다

## question: frontend-01-q22
```json
{
  "title": "독립적인 콘텐츠를 나타내는 태그",
  "topics": [
    "html"
  ],
  "tags": [
    "semantic-tags"
  ],
  "group": "html",
  "type": "short",
  "id": "frontend-01-q22",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.md 1. HTML 기본 및 시맨틱 웹"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "article",
    "<article>"
  ],
  "normalization": "caseFold"
}
```
### stem
자체로 완결되어 따로 떼어 배포해도 의미가 통하는 블로그 글이나 뉴스 기사 하나에 쓰는 시맨틱 태그의 이름을 쓰시오. 꺾쇠 괄호는 있어도 없어도 된다.

## question: frontend-01-q23
```json
{
  "title": "주축 방향 정렬 속성",
  "topics": [
    "css"
  ],
  "tags": [
    "flex-main-axis"
  ],
  "group": "css",
  "type": "short",
  "id": "frontend-01-q23",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.md 2. CSS 레이아웃 및 선택자"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "justify-content"
  ],
  "normalization": "caseFold"
}
```
### stem
Flexbox에서 주축(main axis) 방향으로 항목을 정렬하는 CSS 속성의 이름을 쓰시오.

## question: frontend-01-q24
```json
{
  "title": "sticky가 달라붙는 위쪽 오프셋",
  "topics": [
    "css"
  ],
  "tags": [
    "sticky"
  ],
  "group": "css",
  "type": "short",
  "id": "frontend-01-q24",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.md 2. CSS 레이아웃 및 선택자"
  ],
  "difficulty": 2,
  "acceptedAnswers": [
    "top"
  ],
  "normalization": "caseFold"
}
```
### stem
`position: sticky` 요소가 스크롤할 때 화면 위쪽에 달라붙으려면 함께 지정해야 하는 오프셋 속성 중 위쪽 기준 속성의 이름을 쓰시오.

## question: frontend-01-q25
```json
{
  "title": "배열 구조 분해의 기본값과 나머지",
  "topics": [
    "js"
  ],
  "tags": [
    "destructuring"
  ],
  "group": "js",
  "type": "short",
  "id": "frontend-01-q25",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.md 3. JavaScript 핵심 문법 및 데이터 타입"
  ],
  "difficulty": 2,
  "acceptedAnswers": [
    "13"
  ],
  "normalization": "trim"
}
```
### stem
다음 코드의 출력을 숫자로 쓰시오.
```js
const [x, , y = 10, ...rest] =
  [1, 2, undefined, 4, 5];
console.log(x + y + rest.length);
```

## question: frontend-01-q26
```json
{
  "title": "템플릿 리터럴의 식 평가",
  "topics": [
    "js"
  ],
  "tags": [
    "template-literal"
  ],
  "group": "js",
  "type": "short",
  "id": "frontend-01-q26",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.md 3. JavaScript 핵심 문법 및 데이터 타입"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "3 + 6 = 9",
    "3+6=9"
  ],
  "normalization": "trim"
}
```
### stem
다음 코드의 출력을 그대로 쓰시오.
```js
const n = 3;
console.log(
  `${n} + ${n * 2} = ${n + n * 2}`
);
```

## question: frontend-01-q27
```json
{
  "title": "화살표 함수 콜백의 this",
  "topics": [
    "this"
  ],
  "tags": [
    "this-binding"
  ],
  "group": "this",
  "type": "short",
  "id": "frontend-01-q27",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.md 4. JavaScript의 함수와 this 바인딩"
  ],
  "difficulty": 2,
  "acceptedAnswers": [
    "1"
  ],
  "normalization": "trim"
}
```
### stem
다음 코드를 실행해 출력되는 값을 쓰시오.
```js
function Counter() {
  this.n = 0;
  setTimeout(() => {
    this.n++;
    console.log(this.n);
  }, 0);
}
new Counter();
```

## question: frontend-01-q28
```json
{
  "title": "이벤트 핸들러 등록 메서드",
  "topics": [
    "dom"
  ],
  "tags": [
    "event-listener"
  ],
  "group": "dom",
  "type": "short",
  "id": "frontend-01-q28",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.md 5. DOM 및 BOM 제어"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "addEventListener",
    "addEventListener()"
  ],
  "normalization": "caseFold"
}
```
### stem
DOM 요소에 이벤트 핸들러를 등록하는 표준 메서드의 이름을 쓰시오. 소괄호는 있어도 없어도 된다.

## question: frontend-01-q29
```json
{
  "title": "JSON 본문 전송의 Content-Type",
  "topics": [
    "async"
  ],
  "tags": [
    "fetch-options"
  ],
  "group": "async",
  "type": "short",
  "id": "frontend-01-q29",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.md 6. 비동기 통신과 Promise"
  ],
  "difficulty": 2,
  "acceptedAnswers": [
    "application/json",
    "application/json; charset=utf-8"
  ],
  "normalization": "caseFold"
}
```
### stem
fetch로 `JSON.stringify`한 문자열을 body에 담아 보낼 때 headers에 지정하는 `Content-Type` 값을 쓰시오.

## question: frontend-01-q30
```json
{
  "title": "쿼리 문자열로 전송되는 폼 방식",
  "topics": [
    "storage"
  ],
  "tags": [
    "get-post"
  ],
  "group": "storage",
  "type": "short",
  "id": "frontend-01-q30",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.md 7. 웹 스토리지 및 네트워크 데이터 전송"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "GET"
  ],
  "normalization": "caseFold"
}
```
### stem
폼 데이터가 URL 뒤의 쿼리 문자열로 붙어 전송되는 HTTP 메서드의 이름을 쓰시오.

## question: frontend-01-q31
```json
{
  "title": "CSS 선언 충돌 해결 규칙",
  "topics": [
    "css"
  ],
  "tags": [
    "specificity"
  ],
  "group": "css",
  "type": "essay",
  "id": "frontend-01-q31",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.md 2. CSS 레이아웃 및 선택자"
  ],
  "difficulty": 3,
  "rubric": [
    {
      "id": "r0",
      "criterion": "인라인과 id와 클래스와 태그 순으로 명시도가 높다고 설명한다",
      "points": 1
    },
    {
      "id": "r1",
      "criterion": "명시도가 같으면 나중에 선언된 규칙이 적용된다고 설명한다",
      "points": 1
    },
    {
      "id": "r2",
      "criterion": "`!important`가 일반 선언보다 우선하고 둘 다 있으면 다시 명시도를 비교한다고 설명한다",
      "points": 1
    },
    {
      "id": "r3",
      "criterion": "명시도는 id와 클래스와 태그의 개수를 자리별로 비교하며 합산하지 않는다고 설명한다",
      "points": 1
    }
  ],
  "modelAnswer": "충돌하는 선언은 먼저 `!important` 여부로 나뉘고 중요한 선언이 일반 선언보다 앞선다. 같은 구분 안에서는 명시도를 비교하며 인라인 스타일이 가장 강하고 id 선택자와 클래스 선택자와 태그 선택자 순으로 약해진다. 명시도는 id 개수와 클래스 개수와 태그 개수를 앞자리부터 비교하므로 클래스를 많이 써도 id 하나를 넘지 못한다. 명시도가 같으면 나중에 선언된 규칙이 이긴다. `!important`끼리 충돌하면 다시 같은 순서로 비교한다."
}
```
### stem
같은 요소에 서로 다른 CSS 규칙이 같은 속성을 지정했을 때 브라우저가 적용할 값을 정하는 과정을 설명하시오. 선택자 종류에 따른 우선순위와 우선순위가 같을 때의 기준과 `!important`의 영향을 포함하시오.

## question: frontend-01-q32
```json
{
  "title": "Promise 체인에서 예외 이후의 흐름",
  "topics": [
    "async"
  ],
  "tags": [
    "promise-chain",
    "promise-state"
  ],
  "group": "async",
  "type": "essay",
  "id": "frontend-01-q32",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.md 6. 비동기 통신과 Promise"
  ],
  "difficulty": 3,
  "rubric": [
    {
      "id": "r0",
      "criterion": "출력이 B와 C의 순서이고 A는 출력되지 않는다고 쓴다",
      "points": 1
    },
    {
      "id": "r1",
      "criterion": "세 번째 then에서 던진 예외로 그 then이 돌려준 Promise가 rejected가 된다고 설명한다",
      "points": 1
    },
    {
      "id": "r2",
      "criterion": "거절 핸들러가 없는 then은 실행되지 않고 거절 상태를 그대로 다음으로 넘긴다고 설명한다",
      "points": 1
    },
    {
      "id": "r3",
      "criterion": "catch가 오류를 처리하면 새 Promise가 fulfilled가 되어 뒤의 then이 실행된다고 설명한다",
      "points": 1
    }
  ],
  "modelAnswer": "출력은 B, C의 순서다. 세 번째 then의 예외로 그 then이 돌려준 Promise는 rejected가 된다. 이어지는 then은 이행 핸들러만 있어서 건너뛰고 거절 상태가 그대로 전달된다. catch가 이를 처리하고 값을 반환하면 새 Promise는 fulfilled가 되어 마지막 then이 실행된다."
}
```
### stem
다음 코드의 출력 순서를 쓰고 그렇게 되는 이유를 Promise의 상태 변화로 설명하시오.
```js
const fetchUser = () =>
  Promise.resolve({ id: 1 });
fetchUser()
  .then((user) => user.id)
  .then((id) => {
    throw new Error('fail');
  })
  .then(() => console.log('A'))
  .catch(() => console.log('B'))
  .then(() => console.log('C'));
```
