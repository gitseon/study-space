## question: frontend-02-q01
```json
{
  "title": "label과 input의 연결",
  "topics": [
    "html"
  ],
  "tags": [
    "form-label"
  ],
  "group": "html",
  "type": "mc",
  "id": "frontend-02-q01",
  "revision": 2,
  "sourceRefs": [
    "source/frontend.txt 1. HTML 기본 및 시맨틱 웹",
    "source/Web_복습노트.md 8. 폼(투표)"
  ],
  "difficulty": 1,
  "correctChoiceId": "b"
}
```
### stem
`Python` 글자를 눌렀을 때 라디오 버튼이 선택되도록 `label`에 추가해야 하는 속성은?
```html
<input type="radio" id="py"
  name="lang" value="python">
<label>Python</label>
```
### choice: c
`form="py"`
### choice: d
`target="py"`
### choice: b
`for="py"`
### choice: a
`href="#py"`

## question: frontend-02-q02
```json
{
  "title": "체크하지 않은 체크박스의 전송",
  "topics": [
    "html"
  ],
  "tags": [
    "input-types"
  ],
  "group": "html",
  "type": "mc",
  "id": "frontend-02-q02",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 1. HTML 기본 및 시맨틱 웹"
  ],
  "difficulty": 1,
  "correctChoiceId": "c"
}
```
### stem
체크박스를 체크하지 않은 채 폼을 전송했을 때 `agree`의 전송 결과는?
```html
<form>
  <input type="checkbox"
    name="agree" value="yes">
</form>
```
### choice: d
빈 값으로 포함되어 전송된다
### choice: c
전송 데이터에 포함되지 않는다
### choice: a
off 값으로 포함되어 전송된다
### choice: b
false 값으로 포함되어 전송된다

## question: frontend-02-q03
```json
{
  "title": "details의 open 속성",
  "topics": [
    "html"
  ],
  "tags": [
    "table-details"
  ],
  "group": "html",
  "type": "mc",
  "id": "frontend-02-q03",
  "revision": 2,
  "sourceRefs": [
    "source/frontend.txt 1. HTML 기본 및 시맨틱 웹",
    "source/Web_복습노트.md 7. 접기/펼치기"
  ],
  "difficulty": 2,
  "correctChoiceId": "c"
}
```
### stem
다음 코드에서 `open` 속성의 효과는?
```html
<details open>
  <summary>전국 매장</summary>
  서울 역삼점
</details>
```
### choice: b
처음부터 펼쳐져 있고 다시 접을 수 없다
### choice: c
처음에는 펼쳐져 있고 summary를 누르면 접힌다
### choice: d
처음에는 접혀 있고 summary를 누르면 펼쳐진다
### choice: a
스크립트로만 접고 펼 수 있게 된다

## question: frontend-02-q04
```json
{
  "title": "복합 선택자와 후손 선택자의 구분",
  "topics": [
    "css"
  ],
  "tags": [
    "selectors"
  ],
  "group": "css",
  "type": "mc",
  "id": "frontend-02-q04",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 2. CSS 레이아웃 및 선택자"
  ],
  "difficulty": 2,
  "correctChoiceId": "d"
}
```
### stem
다음 규칙이 적용되는 글자는?
```html
<p class="note">A</p>
<p>
  <span class="note">B</span>
</p>
```
```css
p.note {
  color: red;
}
```
### choice: a
B만 빨간색이다
### choice: b
A와 B가 함께 빨간색이다
### choice: c
빨간색인 글자가 없다
### choice: d
A만 빨간색이다

## question: frontend-02-q05
```json
{
  "title": "클래스 개수와 id의 명시도 비교",
  "topics": [
    "css"
  ],
  "tags": [
    "specificity"
  ],
  "group": "css",
  "type": "mc",
  "id": "frontend-02-q05",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 2. CSS 레이아웃 및 선택자"
  ],
  "difficulty": 3,
  "correctChoiceId": "c"
}
```
### stem
다음 요소의 글자색은?
```html
<p id="x" class="a b c d">T</p>
```
```css
.a.b.c.d {
  color: red;
}
#x {
  color: blue;
}
.a {
  color: green;
}
```
### choice: d
`red`
### choice: a
`green`
### choice: c
`blue`
### choice: b
`black`

## question: frontend-02-q06
```json
{
  "title": "absolute 위치의 기준",
  "topics": [
    "css"
  ],
  "tags": [
    "position"
  ],
  "group": "css",
  "type": "mc",
  "id": "frontend-02-q06",
  "revision": 2,
  "sourceRefs": [
    "source/frontend.txt 2. CSS 레이아웃 및 선택자",
    "source/Web_복습노트.md Part 2 5. position"
  ],
  "difficulty": 2,
  "correctChoiceId": "b"
}
```
### stem
다음 버튼은 어디에 놓이는가? 어떤 조상 요소에도 `position`을 지정하지 않았다.
```html
<div class="card">
  <button>찜</button>
</div>
```
```css
.card {
  width: 200px;
  height: 100px;
}
button {
  position: absolute;
  right: 0;
  bottom: 0;
}
```
### choice: b
화면의 오른쪽 아래 모서리
### choice: c
카드 안쪽의 오른쪽 아래
### choice: a
카드 바깥의 오른쪽 옆
### choice: d
문서 흐름 속 원래 자리

## question: frontend-02-q07
```json
{
  "title": "flex 컨테이너 안의 마진",
  "topics": [
    "css"
  ],
  "tags": [
    "margin-collapse"
  ],
  "group": "css",
  "type": "mc",
  "id": "frontend-02-q07",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 2. CSS 레이아웃 및 선택자"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
세로 방향 flex 컨테이너 안에서 두 항목 사이의 간격은? 항목 사이에 padding과 border는 없다.
```css
.row {
  display: flex;
  flex-direction: column;
}
.a {
  margin-bottom: 30px;
}
.b {
  margin-top: 20px;
}
```
### choice: b
30px
### choice: d
20px
### choice: a
50px
### choice: c
10px

## question: frontend-02-q08
```json
{
  "title": "const 객체의 속성 변경과 재할당",
  "topics": [
    "js"
  ],
  "tags": [
    "declarations"
  ],
  "group": "js",
  "type": "mc",
  "id": "frontend-02-q08",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 3. JavaScript 핵심 문법 및 데이터 타입"
  ],
  "difficulty": 1,
  "correctChoiceId": "b"
}
```
### stem
다음 코드를 실행했을 때 일어나는 일은?
```js
const user = { name: 'A' };
user.name = 'B';
console.log(user.name);
user = { name: 'C' };
```
### choice: d
속성을 바꾸는 줄에서 TypeError가 발생한다
### choice: c
B를 출력하고 마지막 줄까지 정상 실행된다
### choice: a
A를 출력한 뒤 TypeError가 발생한다
### choice: b
B를 출력한 뒤 TypeError가 발생한다

## question: frontend-02-q09
```json
{
  "title": "거짓 값처럼 보이는 문자열의 평가",
  "topics": [
    "js"
  ],
  "tags": [
    "truthy-falsy"
  ],
  "group": "js",
  "type": "mc",
  "id": "frontend-02-q09",
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
const a = [];
const b = '0';
const c = null;
console.log(
  [a, b, c].filter(Boolean).length
);
```
### choice: d
`0`
### choice: b
`2`
### choice: a
`1`
### choice: c
`3`

## question: frontend-02-q10
```json
{
  "title": "스프레드 뒤의 속성 덮어쓰기",
  "topics": [
    "js"
  ],
  "tags": [
    "spread-copy"
  ],
  "group": "js",
  "type": "mc",
  "id": "frontend-02-q10",
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
const base = { a: 1, b: 2 };
const next = { ...base, b: 3, c: 4 };
console.log(
  Object.keys(next).join(), next.b
);
```
### choice: d
`a,b,c 2`
### choice: c
`a,b 3`
### choice: b
`a,b,c 3`
### choice: a
`a,c,b 3`

## question: frontend-02-q11
```json
{
  "title": "slice와 splice의 차이",
  "topics": [
    "js"
  ],
  "tags": [
    "array-methods"
  ],
  "group": "js",
  "type": "mc",
  "id": "frontend-02-q11",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 3. JavaScript 핵심 문법 및 데이터 타입"
  ],
  "difficulty": 2,
  "correctChoiceId": "c"
}
```
### stem
다음 코드의 출력은?
```js
const arr = [1, 2, 3, 4];
const part = arr.slice(1, 3);
arr.splice(0, 1);
console.log(part.join(), arr.join());
```
### choice: b
`2,3,4 2,3,4`
### choice: a
`2,3 1,4`
### choice: c
`2,3 2,3,4`
### choice: d
`2,3 1,2,3`

## question: frontend-02-q12
```json
{
  "title": "메서드 안 화살표 콜백의 this",
  "topics": [
    "this"
  ],
  "tags": [
    "this-binding"
  ],
  "group": "this",
  "type": "mc",
  "id": "frontend-02-q12",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 4. JavaScript의 함수와 this 바인딩"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
다음 코드의 출력은?
```js
const team = {
  name: 'T',
  members: ['a', 'b'],
  list() {
    return this.members.map(
      (m) => this.name + m
    );
  },
};
console.log(team.list().join());
```
### choice: c
결과는 `a,b`
### choice: d
결과는 `T,T`
### choice: b
결과는 `TaTb`
### choice: a
결과는 `Ta,Tb`

## question: frontend-02-q13
```json
{
  "title": "XHR 콜백에서 this",
  "topics": [
    "this"
  ],
  "tags": [
    "this-binding"
  ],
  "group": "this",
  "type": "mc",
  "id": "frontend-02-q13",
  "revision": 2,
  "sourceRefs": [
    "source/frontend.txt 4. JavaScript의 함수와 this 바인딩",
    "source/Web_복습노트.md Part 3 13. 공통 AJAX 함수"
  ],
  "difficulty": 3,
  "correctChoiceId": "d"
}
```
### stem
다음 코드에서 요청이 끝났을 때의 출력은?
```js
const xhr = new XMLHttpRequest();
xhr.open('GET', '/data.json');
xhr.onload = () => {
  console.log(this === xhr);
};
xhr.send();
```
### choice: c
출력은 `true`
### choice: d
출력은 `false`
### choice: b
출력은 `undefined`
### choice: a
출력은 `TypeError`

## question: frontend-02-q14
```json
{
  "title": "append와 after로 만든 텍스트 순서",
  "topics": [
    "dom"
  ],
  "tags": [
    "insert-methods"
  ],
  "group": "dom",
  "type": "mc",
  "id": "frontend-02-q14",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 5. DOM 및 BOM 제어"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
다음 코드 실행 후 `#u`의 `textContent`는?
```html
<ul id="u"><li>1</li><li>2</li></ul>
```
```js
const u =
  document.querySelector('#u');
u.append('x');
u.firstElementChild.after('y');
console.log(u.textContent);
```
### choice: a
`1y2x`
### choice: b
`y12x`
### choice: d
`1x2y`
### choice: c
`xy12`

## question: frontend-02-q15
```json
{
  "title": "중복 클래스가 있을 때 remove",
  "topics": [
    "dom"
  ],
  "tags": [
    "classlist"
  ],
  "group": "dom",
  "type": "mc",
  "id": "frontend-02-q15",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 5. DOM 및 BOM 제어"
  ],
  "difficulty": 3,
  "correctChoiceId": "c"
}
```
### stem
다음 코드의 출력은?
```js
const el = document.body;
el.className = 'a b a';
el.classList.remove('a');
console.log(el.className);
```
### choice: c
결과는 `b`
### choice: b
결과는 `b a`
### choice: d
결과는 `a b`
### choice: a
결과는 `a b a`

## question: frontend-02-q16
```json
{
  "title": "부모에 등록한 클릭 리스너",
  "topics": [
    "dom"
  ],
  "tags": [
    "event-delegation"
  ],
  "group": "dom",
  "type": "mc",
  "id": "frontend-02-q16",
  "revision": 2,
  "sourceRefs": [
    "source/frontend.txt 5. DOM 및 BOM 제어",
    "source/Web_복습노트.md Part 3 12. AJAX와 이벤트 위임"
  ],
  "difficulty": 3,
  "correctChoiceId": "c"
}
```
### stem
다음 코드의 출력은?
```js
const ul =
  document.querySelector('ul');
ul.addEventListener('click', (e) => {
  if (e.target.matches('button')) {
    console.log('찜');
  }
});
ul.innerHTML =
  '<button><i>♥</i></button>';
ul.querySelector('i').click();
ul.querySelector('button').click();
```
### choice: a
찜이 두 번 출력된다
### choice: b
아무것도 출력되지 않는다
### choice: c
찜이 한 번 출력된다
### choice: d
TypeError가 발생한다

## question: frontend-02-q17
```json
{
  "title": "Promise 실행기의 동기 실행",
  "topics": [
    "async"
  ],
  "tags": [
    "promise-state"
  ],
  "group": "async",
  "type": "mc",
  "id": "frontend-02-q17",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 6. 비동기 통신과 Promise"
  ],
  "difficulty": 3,
  "correctChoiceId": "b"
}
```
### stem
다음 코드의 출력 순서는?
```js
const p = new Promise((resolve) => {
  console.log('A');
  resolve('B');
});
console.log('C');
p.then(console.log);
console.log('D');
```
### choice: d
A B C D
### choice: b
A C D B
### choice: c
C A D B
### choice: a
A C B D

## question: frontend-02-q18
```json
{
  "title": "XHR의 비동기 실행 순서",
  "topics": [
    "async"
  ],
  "tags": [
    "xhr"
  ],
  "group": "async",
  "type": "mc",
  "id": "frontend-02-q18",
  "revision": 2,
  "sourceRefs": [
    "source/frontend.txt 6. 비동기 통신과 Promise",
    "source/Web_복습노트.md Part 3 12. AJAX와 이벤트 위임"
  ],
  "difficulty": 2,
  "correctChoiceId": "d"
}
```
### stem
다음 코드의 출력 순서는?
```js
const xhr = new XMLHttpRequest();
xhr.open('GET', '/data.json');
xhr.onload = () => {
  console.log('load');
};
xhr.send();
console.log('sent');
```
### choice: d
sent load
### choice: a
load sent
### choice: c
sent만 출력
### choice: b
load만 출력

## question: frontend-02-q19
```json
{
  "title": "await 뒤의 실행 순서",
  "topics": [
    "async"
  ],
  "tags": [
    "async-await"
  ],
  "group": "async",
  "type": "mc",
  "id": "frontend-02-q19",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 6. 비동기 통신과 Promise"
  ],
  "difficulty": 3,
  "correctChoiceId": "c"
}
```
### stem
다음 코드의 출력 순서는?
```js
async function f() {
  console.log(1);
  await null;
  console.log(2);
}
f();
console.log(3);
```
### choice: b
1 2 3
### choice: c
1 3 2
### choice: d
3 1 2
### choice: a
2 1 3

## question: frontend-02-q20
```json
{
  "title": "작은따옴표 문자열의 JSON 파싱",
  "topics": [
    "storage"
  ],
  "tags": [
    "json-serialize"
  ],
  "group": "storage",
  "type": "mc",
  "id": "frontend-02-q20",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 7. 웹 스토리지 및 네트워크 데이터 전송"
  ],
  "difficulty": 2,
  "correctChoiceId": "c"
}
```
### stem
다음 코드의 출력은?
```js
const text = "{'a': 1}";
try {
  JSON.parse(text);
} catch (e) {
  console.log(e.name);
}
```
### choice: c
`SyntaxError`
### choice: d
`TypeError`
### choice: b
`RangeError`
### choice: a
`ReferenceError`

## question: frontend-02-q21
```json
{
  "title": "숫자를 저장한 localStorage 값의 타입",
  "topics": [
    "storage"
  ],
  "tags": [
    "web-storage"
  ],
  "group": "storage",
  "type": "mc",
  "id": "frontend-02-q21",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 7. 웹 스토리지 및 네트워크 데이터 전송"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
다음 코드의 출력은?
```js
localStorage.setItem('n', 5);
const v = localStorage.getItem('n');
console.log(typeof v, v + 1);
```
### choice: c
`number 6`
### choice: d
`string 6`
### choice: b
`number 51`
### choice: a
`string 51`

## question: frontend-02-q22
```json
{
  "title": "그림과 설명을 묶는 태그의 캡션",
  "topics": [
    "html"
  ],
  "tags": [
    "semantic-tags"
  ],
  "group": "html",
  "type": "short",
  "id": "frontend-02-q22",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 1. HTML 기본 및 시맨틱 웹"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "figcaption",
    "<figcaption>"
  ],
  "normalization": "caseFold"
}
```
### stem
`figure` 안에서 그림의 설명 글을 나타내는 태그의 이름을 쓰시오. 꺾쇠 괄호는 있어도 없어도 된다.

## question: frontend-02-q23
```json
{
  "title": "세로 flex에서 justify-content의 방향",
  "topics": [
    "css"
  ],
  "tags": [
    "flex-main-axis"
  ],
  "group": "css",
  "type": "short",
  "id": "frontend-02-q23",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 2. CSS 레이아웃 및 선택자"
  ],
  "difficulty": 2,
  "acceptedAnswers": [
    "세로",
    "세로 방향",
    "수직"
  ],
  "normalization": "trim"
}
```
### stem
`flex-direction: column`인 컨테이너에서 `justify-content`가 항목을 정렬하는 방향은 가로와 세로 중 어느 쪽인지 쓰시오.

## question: frontend-02-q24
```json
{
  "title": "sticky 요소가 붙는 위치",
  "topics": [
    "css"
  ],
  "tags": [
    "sticky"
  ],
  "group": "css",
  "type": "short",
  "id": "frontend-02-q24",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 2. CSS 레이아웃 및 선택자"
  ],
  "difficulty": 2,
  "acceptedAnswers": [
    "10",
    "10px"
  ],
  "normalization": "trim"
}
```
### stem
충분히 스크롤한 뒤 다음 요소의 위쪽 가장자리는 화면 위에서 몇 px 떨어진 곳에 붙는지 숫자만 쓰시오.
```css
.bar {
  position: sticky;
  top: 10px;
}
```

## question: frontend-02-q25
```json
{
  "title": "원시 타입 검사",
  "topics": [
    "js"
  ],
  "tags": [
    "declarations"
  ],
  "group": "js",
  "type": "short",
  "id": "frontend-02-q25",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 3. JavaScript 핵심 문법 및 데이터 타입"
  ],
  "difficulty": 2,
  "acceptedAnswers": [
    "object undefined"
  ],
  "normalization": "trim"
}
```
### stem
다음 코드의 출력을 그대로 쓰시오.
```js
console.log(
  typeof null, typeof undefined
);
```

## question: frontend-02-q26
```json
{
  "title": "기본값이 앞 변수를 참조하는 구조 분해",
  "topics": [
    "js"
  ],
  "tags": [
    "destructuring"
  ],
  "group": "js",
  "type": "short",
  "id": "frontend-02-q26",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 3. JavaScript 핵심 문법 및 데이터 타입"
  ],
  "difficulty": 3,
  "acceptedAnswers": [
    "33"
  ],
  "normalization": "trim"
}
```
### stem
다음 코드의 출력을 숫자로 쓰시오.
```js
const [a, b = a + 1, c = b + 1] =
  [10];
console.log(a + b + c);
```

## question: frontend-02-q27
```json
{
  "title": "클래스 필드 화살표 콜백의 this",
  "topics": [
    "this"
  ],
  "tags": [
    "this-binding"
  ],
  "group": "this",
  "type": "short",
  "id": "frontend-02-q27",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 4. JavaScript의 함수와 this 바인딩"
  ],
  "difficulty": 2,
  "acceptedAnswers": [
    "2"
  ],
  "normalization": "trim"
}
```
### stem
다음 코드를 실행해 출력되는 값을 쓰시오.
```js
class A {
  n = 1;
  start() {
    setTimeout(() => {
      console.log(++this.n);
    }, 0);
  }
}
new A().start();
```

## question: frontend-02-q28
```json
{
  "title": "현재 항목을 교체하는 이동 메서드",
  "topics": [
    "dom"
  ],
  "tags": [
    "location"
  ],
  "group": "dom",
  "type": "short",
  "id": "frontend-02-q28",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 5. DOM 및 BOM 제어"
  ],
  "difficulty": 2,
  "acceptedAnswers": [
    "replace",
    "replace()",
    "location.replace",
    "location.replace()"
  ],
  "normalization": "caseFold"
}
```
### stem
`location` 객체의 메서드 중 현재 페이지를 새 주소로 바꾸되 방문 기록에 현재 항목을 남기지 않고 교체하는 메서드의 이름을 쓰시오.

## question: frontend-02-q29
```json
{
  "title": "fetch에서 메서드를 지정하는 옵션",
  "topics": [
    "async"
  ],
  "tags": [
    "fetch-options"
  ],
  "group": "async",
  "type": "short",
  "id": "frontend-02-q29",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 6. 비동기 통신과 Promise"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "method"
  ],
  "normalization": "caseFold"
}
```
### stem
`fetch(url, options)`에서 HTTP 메서드를 지정하는 options 객체의 속성 이름을 쓰시오.

## question: frontend-02-q30
```json
{
  "title": "POST가 데이터를 담는 위치",
  "topics": [
    "storage"
  ],
  "tags": [
    "get-post"
  ],
  "group": "storage",
  "type": "short",
  "id": "frontend-02-q30",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 7. 웹 스토리지 및 네트워크 데이터 전송"
  ],
  "difficulty": 1,
  "acceptedAnswers": [
    "본문",
    "요청 본문",
    "바디",
    "body"
  ],
  "normalization": "caseFold"
}
```
### stem
POST 방식에서 폼 데이터가 담겨 전송되는 요청의 부분을 한 단어로 쓰시오.

## question: frontend-02-q31
```json
{
  "title": "일반 함수와 화살표 함수의 this 차이",
  "topics": [
    "this"
  ],
  "tags": [
    "this-binding"
  ],
  "group": "this",
  "type": "essay",
  "id": "frontend-02-q31",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 4. JavaScript의 함수와 this 바인딩"
  ],
  "difficulty": 3,
  "rubric": [
    {
      "id": "r0",
      "criterion": "화살표 함수는 자기 this가 없고 정의된 위치의 this를 쓴다고 설명한다",
      "points": 1
    },
    {
      "id": "r1",
      "criterion": "printLater의 this가 user이므로 콜백이 Kim을 출력한다고 설명한다",
      "points": 1
    },
    {
      "id": "r2",
      "criterion": "일반 함수는 호출 방식으로 this가 정해진다고 설명한다",
      "points": 1
    },
    {
      "id": "r3",
      "criterion": "일반 함수 콜백은 setTimeout이 단독 호출하므로 user가 아니라 Kim을 읽지 못한다고 설명한다",
      "points": 1
    }
  ],
  "modelAnswer": "화살표 함수는 this를 새로 만들지 않고 정의된 위치의 바깥 this를 그대로 사용한다. 콜백이 printLater 안에서 정의되었고 printLater는 user.printLater()로 호출되었으므로 this는 user이며 Kim이 출력된다. 일반 함수는 호출되는 방식으로 this가 정해진다. 콜백을 일반 함수로 바꾸면 setTimeout이 함수를 단독으로 호출하므로 this가 user가 아니게 되어 Kim을 읽지 못한다."
}
```
### stem
다음 코드에서 `printLater`가 출력하는 값이 바뀌는 이유를 일반 함수와 화살표 함수의 this 차이로 설명하시오. 콜백을 일반 함수로 바꾸면 어떻게 달라지는지도 포함하시오.
```js
const user = {
  name: 'Kim',
  printLater() {
    setTimeout(() => {
      console.log(this.name);
    }, 0);
  },
};
user.printLater();
```

## question: frontend-02-q32
```json
{
  "title": "GET과 POST의 차이",
  "topics": [
    "storage"
  ],
  "tags": [
    "get-post"
  ],
  "group": "storage",
  "type": "essay",
  "id": "frontend-02-q32",
  "revision": 1,
  "sourceRefs": [
    "source/frontend.txt 7. 웹 스토리지 및 네트워크 데이터 전송"
  ],
  "difficulty": 3,
  "rubric": [
    {
      "id": "r0",
      "criterion": "GET은 파라미터를 URL의 쿼리 문자열로 보내고 POST는 요청 본문으로 보낸다고 설명한다",
      "points": 1
    },
    {
      "id": "r1",
      "criterion": "GET은 주소창과 방문 기록에 값이 남고 POST는 URL에 드러나지 않는다고 설명한다",
      "points": 1
    },
    {
      "id": "r2",
      "criterion": "GET은 조회와 검색 같은 데이터를 읽는 용도이고 POST는 생성과 변경 같은 용도라고 설명한다",
      "points": 1
    },
    {
      "id": "r3",
      "criterion": "로그인 폼에는 비밀번호가 URL에 남지 않도록 POST가 적합하다고 쓰고 POST만으로 암호화되지는 않는다고 덧붙인다",
      "points": 1
    }
  ],
  "modelAnswer": "GET은 파라미터를 URL 뒤의 쿼리 문자열에 붙여 보내고 POST는 요청 본문에 담아 보낸다. GET의 값은 주소창과 방문 기록과 서버 로그에 남기 쉽고 북마크와 공유가 가능하다. POST는 값이 URL에 드러나지 않는다. 그래서 GET은 조회와 검색에 쓰고 POST는 회원가입이나 수정처럼 서버의 상태를 바꾸는 요청에 쓴다. 로그인 폼은 비밀번호가 URL에 남지 않도록 POST가 적합하다. 다만 POST 자체가 암호화를 뜻하지는 않아서 HTTPS가 함께 필요하다."
}
```
### stem
폼 데이터를 서버로 보낼 때 GET과 POST를 비교하시오. 파라미터가 전달되는 위치와 노출 정도와 주된 용도를 포함하고 로그인 폼에 어느 쪽이 적합한지 이유와 함께 쓰시오.
