## question: frontend-02-q01
### solution
정답 근거: label의 `for` 속성값을 input의 `id`와 같게 쓰면 두 요소가 연결된다. 풀이: id가 py인 input에 label의 for를 py로 맞추면 Python 글자를 눌러도 라디오 버튼이 선택된다. 흔한 실수: name 값으로 연결된다고 보는 것이다. name은 같은 그룹을 묶는 용도다.
### choice-explanation: c
form 속성은 입력 요소가 속할 폼의 id를 지정하는 속성이다.
### choice-explanation: d
target은 링크나 폼이 열릴 위치를 정하는 속성이며 label에서 연결 역할을 하지 않는다.
### choice-explanation: b
label의 for 값이 input의 id와 같으면 두 요소가 연결되어 글자를 눌러도 선택된다.
### choice-explanation: a
label은 링크가 아니라서 href로 요소를 연결하지 않는다.

## question: frontend-02-q02
### solution
정답 근거: 체크박스는 체크된 경우에만 폼 데이터에 포함된다. 풀이: 체크되지 않으면 agree라는 이름 자체가 전송되지 않으므로 서버는 값이 없는 것으로 판단한다. 흔한 실수: 체크하지 않으면 false나 빈 값이 전송된다고 보는 것이다.
### choice-explanation: d
빈 문자열로 전송되는 것은 체크된 값이 비어 있는 경우다.
### choice-explanation: c
체크되지 않은 체크박스는 name과 값의 쌍이 폼 데이터에서 빠진다.
### choice-explanation: a
off라는 값은 자동으로 만들어지지 않는다.
### choice-explanation: b
불리언 값으로 바뀌어 전송되지 않는다.

## question: frontend-02-q03
### solution
정답 근거: `details`는 summary를 눌러 내용을 접고 펼치는 요소이며 `open`은 처음에 펼쳐진 상태로 시작하게 한다. 풀이: open이 있어도 토글 기능은 그대로라서 summary를 누르면 접힌다. 흔한 실수: open을 붙이면 항상 펼쳐진 상태로 고정된다고 보는 것이다.
### choice-explanation: b
open이 있어도 summary를 누르면 접힌다.
### choice-explanation: c
open은 처음 상태만 펼침으로 정하며 이후에는 summary로 접고 펼 수 있다.
### choice-explanation: d
이것은 open 속성이 없을 때의 기본 동작이다.
### choice-explanation: a
자바스크립트 없이도 summary로 토글할 수 있다.

## question: frontend-02-q04
### solution
정답 근거: 공백 없이 이어 쓴 `p.note`는 한 요소가 p이면서 note 클래스를 갖는다는 뜻이다. 풀이: A는 둘 다 만족하고 B는 span이라 제외된다. 흔한 실수: 공백이 있는 후손 선택자와 같은 것으로 읽는 것이다.
### choice-explanation: a
B는 p가 아니라 span이라서 선택되지 않는다.
### choice-explanation: b
p 안의 note를 고르려면 공백이 있는 `p .note`를 써야 한다.
### choice-explanation: c
A가 두 조건에 모두 일치하므로 적용된다.
### choice-explanation: d
`p.note`는 공백이 없어서 note 클래스를 가진 p 요소 하나를 가리킨다.

## question: frontend-02-q05
### solution
정답 근거: 명시도는 id 개수와 클래스 개수와 태그 개수의 순서로 비교한다. 풀이: `#x`는 id가 1개이고 `.a.b.c.d`는 id가 없이 클래스만 4개라서 앞자리인 id가 있는 쪽이 이긴다. 흔한 실수: 선택자 구성 요소를 모두 더한 점수로 비교하는 것이다.
### choice-explanation: d
클래스는 몇 개를 합쳐도 id 한 개를 넘지 못한다.
### choice-explanation: a
나중에 선언되었어도 명시도가 가장 낮아 적용되지 않는다.
### choice-explanation: c
id 선택자 하나가 클래스 선택자 네 개보다 높은 단계라서 이긴다.
### choice-explanation: b
세 규칙 모두 요소와 일치하므로 기본값이 쓰이지 않는다.

## question: frontend-02-q06
### solution
정답 근거: absolute는 position 값이 static이 아닌 가장 가까운 조상을 기준으로 배치한다. 풀이: 카드는 position이 기본값이라 기준이 되지 못하고 조상 중에도 없으므로 화면의 오른쪽 아래에 붙는다. 흔한 실수: 부모이기만 하면 기준이 된다고 보는 것이다. 카드에 `position: relative`를 주면 의도한 위치가 된다.
### choice-explanation: b
position이 지정된 조상이 없으면 화면(초기 포함 블록)이 기준이 된다.
### choice-explanation: c
카드가 기준이 되려면 카드에 position: relative가 필요하다.
### choice-explanation: a
right: 0은 기준 상자의 오른쪽 끝에 맞추며 바깥으로 밀어내지 않는다.
### choice-explanation: d
absolute는 문서 흐름에서 빠져 원래 자리에 남지 않는다.

## question: frontend-02-q07
### solution
정답 근거: 마진 병합은 일반 블록 흐름에서만 일어나고 flex 항목에서는 일어나지 않는다. 풀이: 30px과 20px이 그대로 더해져 50px이다. 흔한 실수: 인접한 마진은 어디서나 병합된다고 보는 것이다.
### choice-explanation: b
일반 블록 흐름에서 병합될 때의 값이다.
### choice-explanation: d
나중 요소의 마진만 쓰인다고 본 값이다.
### choice-explanation: a
flex 항목의 마진은 병합되지 않고 더해진다.
### choice-explanation: c
두 마진의 차이로 본 값이다.

## question: frontend-02-q08
### solution
정답 근거: const는 변수 바인딩의 재대입만 막고 객체 내부 변경은 막지 않는다. 풀이: 세 번째 줄은 B를 출력하고 네 번째 줄의 재대입이 TypeError를 낸다. 흔한 실수: const 객체는 속성도 바꿀 수 없다고 보는 것이다.
### choice-explanation: d
const 객체의 속성은 바꿀 수 있어서 이 줄은 오류가 아니다.
### choice-explanation: c
마지막 줄은 const 변수를 다시 대입하므로 오류다.
### choice-explanation: a
속성 변경이 먼저 성공하므로 출력은 B다.
### choice-explanation: b
const는 속성 변경은 허용하지만 변수에 다시 대입하면 오류가 난다.

## question: frontend-02-q09
### solution
정답 근거: 객체는 모두 참이고 비어 있지 않은 문자열도 참이다. 풀이: 빈 배열과 문자열 '0'이 통과하고 null만 걸러져 길이는 2다. 흔한 실수: 문자열 '0'을 숫자 0처럼 거짓으로 보는 것이다.
### choice-explanation: d
세 값을 모두 거짓으로 본 값이다.
### choice-explanation: b
빈 배열과 문자열 '0'은 참이고 null만 거짓이라 두 개가 남는다.
### choice-explanation: a
빈 배열이나 문자열 '0' 중 하나를 거짓으로 본 값이다.
### choice-explanation: c
null도 참으로 본 값이다.

## question: frontend-02-q10
### solution
정답 근거: 객체 리터럴은 앞에서 뒤로 속성을 만들며 같은 키는 값만 바뀐다. 풀이: base의 a와 b가 먼저 복사되고 b가 3으로 덮어쓰이며 c가 추가된다. 흔한 실수: 덮어쓴 키가 새로 만들어져 맨 뒤로 간다고 보는 것이다.
### choice-explanation: d
스프레드가 뒤에 쓴 속성을 덮어쓴다고 본 값이다.
### choice-explanation: c
새로 추가한 c가 빠진 값이다.
### choice-explanation: b
나중에 쓴 b가 값을 덮어쓰며 키의 원래 위치는 유지된다.
### choice-explanation: a
덮어쓴 키가 맨 뒤로 이동한다고 본 값이다.

## question: frontend-02-q11
### solution
정답 근거: slice는 끝 인덱스 앞까지 복사한 새 배열을 만들고 splice는 원본을 직접 바꾼다. 풀이: part는 인덱스 1과 2의 값인 2,3이고 원본은 첫 요소가 지워져 2,3,4다. 흔한 실수: slice의 끝 인덱스를 포함하거나 원본이 바뀐다고 보는 것이다.
### choice-explanation: b
slice의 끝 인덱스를 포함시킨 값이다.
### choice-explanation: a
slice가 원본에서 요소를 지운다고 본 값이다.
### choice-explanation: c
slice는 원본을 바꾸지 않고 splice는 원본을 바꾼다.
### choice-explanation: d
splice가 앞이 아니라 뒤에서 지운다고 본 값이다.

## question: frontend-02-q12
### solution
정답 근거: 화살표 함수는 정의된 위치의 this를 사용한다. 풀이: list를 team.list()로 호출했으므로 메서드의 this는 team이고 콜백도 같은 this로 name을 읽어 Ta와 Tb를 만든다. 흔한 실수: 콜백의 this가 호출마다 달라진다고 보는 것이다.
### choice-explanation: c
this.name이 빈 값이 아니라 T이므로 접두사가 붙는다.
### choice-explanation: d
각 요소 m이 문자열에 더해진다.
### choice-explanation: b
join()은 구분자를 생략하면 쉼표로 이어 붙인다.
### choice-explanation: a
화살표 함수가 list의 this인 team을 그대로 쓰므로 name이 T로 읽힌다.

## question: frontend-02-q13
### solution
정답 근거: 화살표 함수는 자기 this가 없고 정의된 위치의 this를 사용한다. 풀이: onload를 일반 함수로 쓰면 this가 xhr이지만 화살표 함수는 바깥의 this를 써서 xhr과 같지 않다. 흔한 실수: 콜백이 어떤 객체의 속성에 달렸으면 항상 그 객체가 this라고 보는 것이다.
### choice-explanation: c
일반 함수로 썼다면 this가 xhr이라 참이 되지만 화살표 함수는 다르다.
### choice-explanation: d
화살표 함수는 xhr이 아니라 정의된 위치의 this를 쓰므로 비교 결과가 거짓이다.
### choice-explanation: b
비교 연산의 결과는 불리언이라서 undefined가 아니다.
### choice-explanation: a
this를 비교만 하므로 오류가 나지 않는다.

## question: frontend-02-q14
### solution
정답 근거: append는 자식 목록의 끝에 넣고 after는 대상의 바로 뒤 형제 위치에 넣는다. 풀이: 처음 1과 2 뒤에 x가 붙고 첫 li 뒤에 y가 들어가 1y2x가 된다. 흔한 실수: append와 prepend를 혼동하는 것이다.
### choice-explanation: a
append는 u의 맨 끝에 넣고 after는 첫 li 바로 뒤에 넣는다.
### choice-explanation: b
after를 첫 li 앞에 넣는 메서드로 본 값이다.
### choice-explanation: d
append와 after의 위치를 서로 바꿔 본 값이다.
### choice-explanation: c
append를 맨 앞에 넣는 메서드로 본 값이다.

## question: frontend-02-q15
### solution
정답 근거: classList는 클래스 문자열을 중복 없는 토큰 집합으로 다룬다. 풀이: a와 b 두 토큰에서 a를 지우면 b만 남아 className이 b가 된다. 흔한 실수: 문자열에서 첫 번째 일치만 지운다고 보는 것이다.
### choice-explanation: c
classList는 중복을 한 번만 세는 집합으로 다루므로 a가 모두 지워진다.
### choice-explanation: b
첫 번째 a만 지워진다고 본 값이다.
### choice-explanation: d
remove가 중복된 클래스에는 동작하지 않는다고 본 값이다.
### choice-explanation: a
remove가 아무 일도 하지 않는다고 본 값이다.

## question: frontend-02-q16
### solution
정답 근거: 클릭은 자식에서 부모로 버블링되므로 부모에 한 번 등록한 리스너가 나중에 추가된 자식에도 동작한다. 풀이: 아이콘을 누르면 target이 i라서 matches에 걸리지 않고 버튼을 직접 누르면 target이 button이라 한 번 출력된다. 흔한 실수: 아이콘 클릭도 버튼으로 처리된다고 보는 것이다. 이때는 `closest('button')`을 쓴다.
### choice-explanation: a
아이콘 클릭의 target은 button이 아니라 i라서 matches가 거짓이다.
### choice-explanation: b
버블링으로 부모의 리스너가 실행되므로 버튼 클릭은 처리된다.
### choice-explanation: c
부모의 리스너가 나중에 만든 버튼에도 적용되지만 아이콘 클릭은 target이 i라서 조건을 통과하지 못한다.
### choice-explanation: d
나중에 만든 요소를 찾는 코드는 모두 생성 뒤에 실행되어 오류가 없다.

## question: frontend-02-q17
### solution
정답 근거: Promise 실행기는 생성 즉시 동기로 실행되고 then 콜백은 비동기로 실행된다. 풀이: A가 먼저 찍히고 이어서 C와 D가 찍힌 뒤 마지막으로 B가 출력된다. 흔한 실수: 실행기 함수도 비동기로 실행된다고 보는 것이다.
### choice-explanation: d
then 콜백도 등록 즉시 실행된다고 본 순서다.
### choice-explanation: b
실행기 함수는 즉시 실행되고 then의 콜백은 동기 코드가 끝난 뒤 실행된다.
### choice-explanation: c
실행기 함수가 나중에 실행된다고 본 순서다.
### choice-explanation: a
then 콜백이 다음 동기 코드보다 먼저 실행된다고 본 순서다.

## question: frontend-02-q18
### solution
정답 근거: XMLHttpRequest의 기본 요청은 비동기다. 풀이: send 뒤의 console.log가 바로 실행되어 sent가 먼저 찍히고 응답이 도착하면 onload 콜백이 실행되어 load가 찍힌다. 흔한 실수: 응답 처리 코드를 send 바로 아래에 써서 데이터가 아직 없는 상태로 쓰는 것이다.
### choice-explanation: d
send는 응답을 기다리지 않으므로 뒤의 코드가 먼저 실행되고 응답이 오면 onload가 실행된다.
### choice-explanation: a
send가 응답이 올 때까지 코드를 멈춘다고 본 순서다.
### choice-explanation: c
응답이 도착하면 onload도 실행되어 load가 출력된다.
### choice-explanation: b
send 다음 줄은 응답과 관계없이 실행되어 sent가 출력된다.

## question: frontend-02-q19
### solution
정답 근거: async 함수는 첫 await를 만나기 전까지 동기로 실행된다. 풀이: 1이 출력된 뒤 await에서 제어가 호출자에게 돌아가 3이 출력되고 마지막으로 2가 출력된다. 흔한 실수: async 함수 전체가 비동기로 시작된다고 보는 것이다.
### choice-explanation: b
await가 기다리지 않고 바로 이어진다고 본 순서다.
### choice-explanation: c
await 앞은 동기로 실행되고 뒤는 호출한 쪽의 코드가 끝난 뒤 이어진다.
### choice-explanation: d
async 함수 전체가 나중에 실행된다고 본 순서다.
### choice-explanation: a
await 뒤가 먼저 실행된다고 본 순서다.

## question: frontend-02-q20
### solution
정답 근거: JSON.parse는 JSON 문법을 어기면 SyntaxError를 던진다. 풀이: 키에 작은따옴표를 쓴 문자열은 JSON이 아니므로 파싱 단계에서 오류가 난다. 흔한 실수: 자바스크립트 객체 리터럴 문법을 JSON으로 쓰는 것이다.
### choice-explanation: c
JSON은 문자열을 큰따옴표로만 쓸 수 있어 작은따옴표는 문법 오류다.
### choice-explanation: d
값의 타입이 아니라 문자열의 문법이 문제다.
### choice-explanation: b
숫자 범위와 관련된 오류가 아니다.
### choice-explanation: a
정의되지 않은 변수를 쓴 것이 아니다.

## question: frontend-02-q21
### solution
정답 근거: 웹 스토리지는 값을 문자열로만 저장한다. 풀이: 5가 문자열 5로 저장되고 읽은 값은 문자열이라 v + 1은 51이다. 흔한 실수: 저장한 숫자가 숫자 타입으로 돌아온다고 보는 것이다.
### choice-explanation: c
저장한 숫자 타입이 그대로 복원된다고 본 값이다.
### choice-explanation: d
문자열이어도 더하기가 숫자 덧셈이 된다고 본 값이다.
### choice-explanation: b
숫자이면서 이어붙이기가 된다는 모순된 값이다.
### choice-explanation: a
저장소는 값을 문자열로 보관하므로 읽은 값에 1을 더하면 이어붙이기가 된다.

## question: frontend-02-q22
### solution
모범답안: figcaption. 허용 표기: figcaption과 꺾쇠를 붙인 <figcaption>이며 대소문자는 구분하지 않는다. 근거: figcaption은 figure 안의 그림이나 도표에 대한 설명을 나타낸다.

## question: frontend-02-q23
### solution
모범답안: 세로. 허용 표기: 세로와 세로 방향과 수직이다. 근거: justify-content는 주축 방향 정렬이고 column에서는 주축이 세로 방향이 된다.

## question: frontend-02-q24
### solution
모범답안: 10. 허용 표기: 10과 10px이다. 풀이: sticky 요소는 스크롤 영역의 위쪽에서 top 값만큼 떨어진 위치에서 멈춘다. 부모 영역을 벗어나지 않는 범위에서 그렇다.

## question: frontend-02-q25
### solution
모범답안: object undefined. 허용 표기: 두 단어 사이를 공백 하나로 쓴다. 풀이: typeof null은 역사적인 이유로 object이고 typeof undefined는 undefined다.

## question: frontend-02-q26
### solution
모범답안: 33. 허용 표기: 앞뒤 공백은 무시한다. 풀이: a는 10이고 b는 값이 없어 a + 1인 11이며 c는 b + 1인 12다. 10 + 11 + 12 = 33이다.

## question: frontend-02-q27
### solution
모범답안: 2. 허용 표기: 앞뒤 공백은 무시한다. 풀이: 화살표 함수가 start의 this인 인스턴스를 쓰므로 n이 1에서 2로 증가해 출력된다.

## question: frontend-02-q28
### solution
모범답안: replace. 허용 표기: replace와 replace()와 location.replace와 location.replace()이며 대소문자는 구분하지 않는다. 근거: assign은 기록에 항목을 추가하고 replace는 현재 항목을 교체해서 뒤로 가기로 돌아올 수 없다.

## question: frontend-02-q29
### solution
모범답안: method. 허용 표기: 대소문자는 구분하지 않는다. 근거: method: 'POST'처럼 지정하며 생략하면 GET으로 요청한다.

## question: frontend-02-q30
### solution
모범답안: 본문. 허용 표기: 본문과 요청 본문과 바디와 body이며 영문 대소문자는 구분하지 않는다. 근거: POST는 데이터를 요청 본문에 담아 URL에 노출하지 않는다.

## question: frontend-02-q31
### solution
화살표 함수는 this를 새로 만들지 않고 정의된 위치의 바깥 this를 그대로 사용한다. 콜백이 printLater 안에서 정의되었고 printLater는 user.printLater()로 호출되었으므로 this는 user이며 Kim이 출력된다. 일반 함수는 호출되는 방식으로 this가 정해진다. 콜백을 일반 함수로 바꾸면 setTimeout이 함수를 단독으로 호출하므로 this가 user가 아니게 되어 Kim을 읽지 못한다.

## question: frontend-02-q32
### solution
GET은 파라미터를 URL 뒤의 쿼리 문자열에 붙여 보내고 POST는 요청 본문에 담아 보낸다. GET의 값은 주소창과 방문 기록과 서버 로그에 남기 쉽고 북마크와 공유가 가능하다. POST는 값이 URL에 드러나지 않는다. 그래서 GET은 조회와 검색에 쓰고 POST는 회원가입이나 수정처럼 서버의 상태를 바꾸는 요청에 쓴다. 로그인 폼은 비밀번호가 URL에 남지 않도록 POST가 적합하다. 다만 POST 자체가 암호화를 뜻하지는 않아서 HTTPS가 함께 필요하다.
