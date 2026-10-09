## question: frontend-03-q01
### solution
정답 근거: inline-block은 배치는 인라인이고 크기 규칙은 블록과 같다. 풀이: 같은 줄에 나란히 놓을 수 있으면서 width와 height를 지정할 수 있다. 흔한 실수: inline-block을 inline이나 block 중 한쪽과 같다고 보는 것이다.
### choice-explanation: a
인라인처럼 같은 줄에 배치되고 블록처럼 크기를 지정할 수 있다.
### choice-explanation: c
새 줄을 차지하는 것은 block 요소의 동작이다.
### choice-explanation: d
크기가 무시되는 것은 inline 요소의 동작이다.
### choice-explanation: b
inline-block도 다른 요소를 자식으로 가질 수 있다.

## question: frontend-03-q02
### solution
정답 근거: input의 value는 type이 number여도 항상 문자열이다. 풀이: 문자열 5에 숫자 1을 더하면 이어붙이기가 되어 51이 된다. 흔한 실수: number 입력의 value가 숫자라고 보는 것이다.
### choice-explanation: b
value가 숫자로 자동 변환된다고 본 값이다.
### choice-explanation: d
value는 숫자 입력에서도 문자열이라 더하기가 문자열 이어붙이기가 된다.
### choice-explanation: c
문자열과 숫자를 더하면 NaN이 된다고 본 값이다.
### choice-explanation: a
더하기가 무시된다고 본 값이다.

## question: frontend-03-q03
### solution
정답 근거: 로고와 메뉴는 header이고 핵심 내용은 main이며 저작권 안내는 footer가 의미에 맞는다. 풀이: 각 영역의 역할을 먼저 정하고 그에 맞는 태그를 고른다. 흔한 실수: 위치가 아니라 모양만 보고 태그를 고르는 것이다.
### choice-explanation: c
로고와 메뉴는 핵심 콘텐츠가 아니라 소개 영역이다.
### choice-explanation: a
저작권 안내는 부가 정보 영역이 아니라 하단 정보다.
### choice-explanation: d
상단과 하단 태그의 위치가 서로 바뀌었다.
### choice-explanation: b
상단 소개 영역과 핵심 콘텐츠와 하단 정보에 각각 알맞은 태그다.

## question: frontend-03-q04
### solution
정답 근거: 자식 결합자는 바로 아래 자식만 선택한다. 풀이: box의 직계 자식 p는 1과 3이며 2는 span의 자식이라 제외된다. 흔한 실수: `>`와 공백을 같은 후손 선택으로 보는 것이다.
### choice-explanation: d
모든 후손을 고르는 것은 공백으로 쓰는 후손 선택자다.
### choice-explanation: c
span 안의 문단은 box의 직계 자식이 아니다.
### choice-explanation: b
`>`는 직계 자식만 고르므로 span 안의 문단은 제외된다.
### choice-explanation: a
첫 번째 자식만이 아니라 조건에 맞는 모든 자식이 선택된다.

## question: frontend-03-q05
### solution
정답 근거: `!important` 선언은 중요도가 일반 선언보다 높다. 풀이: 인라인 red는 일반 선언이고 스타일시트 blue는 중요 선언이라 blue가 적용된다. 흔한 실수: 인라인 스타일이 어떤 경우에도 가장 강하다고 보는 것이다.
### choice-explanation: b
인라인 스타일은 일반 선언끼리만 가장 강하다.
### choice-explanation: a
스타일시트의 `!important`는 인라인의 일반 선언보다 앞선다.
### choice-explanation: d
두 선언이 모두 요소와 일치하므로 기본색이 쓰이지 않는다.
### choice-explanation: c
색은 섞이지 않고 하나만 선택된다.

## question: frontend-03-q06
### solution
정답 근거: content-box에서 퍼센트 width는 콘텐츠 폭에 적용되고 padding은 바깥에 더해진다. 풀이: 400의 50%인 200px에 좌우 padding 40px을 더해 240px이다. 흔한 실수: 퍼센트 폭에 padding이 포함된다고 보는 것이다.
### choice-explanation: a
콘텐츠 폭 200px에 좌우 padding 40px을 더한다.
### choice-explanation: d
padding을 더하지 않은 값이다.
### choice-explanation: c
padding을 한쪽만 더한 값이다.
### choice-explanation: b
padding을 부모 폭에 더한 뒤 퍼센트를 적용한 값이다.

## question: frontend-03-q07
### solution
정답 근거: 부모의 위쪽에 padding과 border가 없으면 부모와 첫 자식의 위쪽 마진이 병합된다. 풀이: 자식의 20px이 부모의 바깥 마진처럼 작용해 부모 상자 전체가 내려간다. 흔한 실수: 자식의 마진이 항상 부모 안쪽 간격이 된다고 보는 것이다.
### choice-explanation: c
부모와 첫 자식의 위쪽 마진이 병합되어 부모 바깥으로 전달된다.
### choice-explanation: b
병합이 일어나면 부모 안쪽 간격이 생기지 않는다.
### choice-explanation: a
마진은 사라지지 않고 부모 바깥 간격이 된다.
### choice-explanation: d
병합된 마진은 부모 높이에 포함되지 않는다.

## question: frontend-03-q08
### solution
정답 근거: var로 선언한 i는 반복마다 새로 만들어지지 않는다. 풀이: 반복이 끝나면 i는 3이고 세 함수가 같은 변수를 읽으므로 모두 3을 반환한다. 흔한 실수: 반복마다 i가 따로 저장된다고 보는 것이다.
### choice-explanation: d
let처럼 반복마다 새 변수가 생길 때의 결과다.
### choice-explanation: a
var는 함수 범위의 변수 하나라서 모든 함수가 반복이 끝난 뒤의 3을 읽는다.
### choice-explanation: b
증가된 값을 하나씩 읽는다고 본 값이다.
### choice-explanation: c
반복문이 마지막으로 실행된 때의 i를 읽는다고 본 값이다.

## question: frontend-03-q09
### solution
정답 근거: `||`는 첫 참 값을 반환하고 `&&`는 첫 거짓 값을 반환한다. 풀이: a는 0이 거짓이라 x가 되고 b는 q가 참이라 뒤의 0이 되며 c는 빈 문자열이 거짓이라 null이 된다. 흔한 실수: 논리 연산자가 항상 true나 false를 반환한다고 보는 것이다.
### choice-explanation: d
`&&`는 앞이 참이면 뒤의 값을 반환한다.
### choice-explanation: c
`||`는 앞이 거짓이면 뒤의 값을 반환한다.
### choice-explanation: a
논리 연산자의 결과가 불리언이 되지는 않는다.
### choice-explanation: b
논리 연산자는 불리언이 아니라 결정에 쓰인 피연산자 값을 반환한다.

## question: frontend-03-q10
### solution
정답 근거: 스프레드는 바깥 배열만 새로 만들고 안쪽 배열은 같은 참조를 복사한다. 풀이: b.push는 b만 바꿔 a의 길이는 2로 남고 b[0].push는 공유된 안쪽 배열을 바꿔 a[0]의 길이가 2가 된다. 흔한 실수: 복사본의 모든 변경이 원본과 분리된다고 보는 것이다.
### choice-explanation: c
b에 요소를 추가한 것이 a의 길이에도 반영된다고 본 값이다.
### choice-explanation: d
바깥 배열은 따로 복사되어 길이가 같고 안쪽 배열은 공유되어 길이가 늘어난다.
### choice-explanation: b
안쪽 배열까지 새로 복사된다고 본 값이다.
### choice-explanation: a
바깥 배열은 공유되고 안쪽은 복사된다고 반대로 본 값이다.

## question: frontend-03-q11
### solution
정답 근거: 비교 함수가 없으면 sort는 요소를 문자열로 바꿔 사전순으로 정렬한다. 풀이: 문자열 1과 10과 9를 사전순으로 놓으면 1, 10, 9다. 흔한 실수: 숫자 배열이 숫자 크기로 정렬된다고 보는 것이다.
### choice-explanation: d
숫자 크기로 비교할 때의 결과다.
### choice-explanation: c
정렬되지 않고 원래 순서가 유지된다고 본 값이다.
### choice-explanation: b
문자열 길이를 기준으로 비교한다고 본 값이다.
### choice-explanation: a
기본 sort는 요소를 문자열로 바꿔 사전순으로 비교한다.

## question: frontend-03-q12
### solution
정답 근거: 이벤트 핸들러로 등록한 일반 함수의 this는 핸들러가 붙은 요소다. 풀이: 첫 핸들러는 this가 body이므로 true이고 화살표 함수는 바깥 스코프의 this를 써서 body와 다르므로 false다. 흔한 실수: 화살표 함수 핸들러에서도 this가 요소라고 보는 것이다.
### choice-explanation: c
화살표 함수도 요소를 this로 받는다고 본 값이다.
### choice-explanation: d
일반 함수 핸들러의 this는 이벤트를 받은 요소이고 화살표 함수는 바깥의 this를 쓴다.
### choice-explanation: a
일반 함수와 화살표 함수의 규칙이 반대라고 본 값이다.
### choice-explanation: b
일반 함수 핸들러에서도 this가 요소가 아니라고 본 값이다.

## question: frontend-03-q13
### solution
정답 근거: 화살표 함수의 this는 정의 위치의 바깥 스코프에서 정해진다. 풀이: 객체 리터럴은 스코프를 만들지 않아 메서드 안의 this가 객체가 아니라 바깥의 this를 가리킨다. 흔한 실수: 객체의 속성이면 항상 그 객체가 this가 된다고 보는 것이다.
### choice-explanation: d
화살표 함수도 속성 값으로 쓸 수 있다.
### choice-explanation: b
화살표 함수도 인자를 받을 수 있다.
### choice-explanation: a
화살표 함수는 호출한 객체를 this로 받지 않는다.
### choice-explanation: c
함수는 호출마다 새로 만들어지지 않는다.

## question: frontend-03-q14
### solution
정답 근거: DOM 삽입 메서드는 이미 문서에 있는 노드를 복사하지 않고 옮긴다. 풀이: after로 i는 p 뒤에 오지만 이미 그 자리였고 before로 다시 p 앞으로 이동해 BA가 된다. 흔한 실수: 삽입할 때마다 노드가 복제된다고 보는 것이다.
### choice-explanation: a
after만 적용되고 before는 효과가 없다고 본 값이다.
### choice-explanation: c
삽입이 복사로 일어난다고 본 값이다.
### choice-explanation: d
before가 복사본을 앞에 만든다고 본 값이다.
### choice-explanation: b
이미 있는 노드를 삽입하면 복사가 아니라 이동이므로 마지막 before로 B가 p 앞에 온다.

## question: frontend-03-q15
### solution
정답 근거: toggle의 두 번째 인자 force는 클래스를 있게 할지 없게 할지를 강제한다. 풀이: a는 제거되어 false를 반환하고 b는 추가되어 true를 반환하며 className은 b가 된다. 흔한 실수: force가 있으면 토글하지 않는다고 보는 것이다.
### choice-explanation: d
force가 false면 제거하고 true면 추가하며 결과 상태를 반환한다.
### choice-explanation: a
a는 force false로 제거되므로 반환값이 false다.
### choice-explanation: b
b는 force true로 추가되므로 반환값이 true다.
### choice-explanation: c
두 반환값이 모두 반대로 본 값이다.

## question: frontend-03-q16
### solution
정답 근거: removeEventListener는 같은 이벤트와 같은 함수 참조를 요구한다. 풀이: 두 화살표 함수는 모양이 같아도 서로 다른 객체이므로 제거되지 않고 클릭에서 A가 한 번 출력된다. 흔한 실수: 코드가 같은 함수면 제거된다고 보는 것이다.
### choice-explanation: b
제거에는 등록한 것과 같은 함수 객체가 필요하며 다른 익명 함수는 제거되지 않는다.
### choice-explanation: c
내용이 같은 함수라도 다른 객체라서 리스너가 남아 있다.
### choice-explanation: a
리스너가 하나만 등록되었으므로 한 번만 실행된다.
### choice-explanation: d
제거 대상이 없어도 오류 없이 무시된다.

## question: frontend-03-q17
### solution
정답 근거: Promise의 상태는 한 번 정해지면 바뀌지 않는다. 풀이: resolve가 먼저 이행 상태를 만들었으므로 이후의 throw는 무시되고 첫 핸들러가 ok를 출력한다. 흔한 실수: 예외가 나면 항상 거절된다고 보는 것이다.
### choice-explanation: b
예외가 나도 먼저 정해진 이행 상태가 유지된다.
### choice-explanation: c
오류 메시지는 어느 핸들러에도 전달되지 않는다.
### choice-explanation: d
이미 이행된 뒤에 던진 예외는 상태를 바꾸지 못하고 무시된다.
### choice-explanation: a
이행된 Promise의 then 핸들러는 실행된다.

## question: frontend-03-q18
### solution
정답 근거: catch에서 던진 예외는 다음 catch가 처리하고 그 반환값은 이행된 값이 된다. 풀이: 첫 catch가 e1+를 던지고 두 번째 catch가 e1+!를 반환하므로 then이 이를 출력한다. 흔한 실수: catch 안에서 던진 예외가 체인을 끝낸다고 보는 것이다.
### choice-explanation: d
첫 catch에서 더한 문자가 사라진 값이다.
### choice-explanation: c
두 번째 catch의 반환값이 반영되지 않은 값이다.
### choice-explanation: a
catch가 값을 반환하므로 undefined가 아니다.
### choice-explanation: b
첫 catch가 다시 던진 값이 두 번째 catch로 전달되고 그 반환값이 then으로 넘어간다.

## question: frontend-03-q19
### solution
정답 근거: await가 던진 거절은 try 안에서 catch로 잡히고 finally는 그 뒤에 항상 실행된다. 풀이: catch가 cx를 반환하기 전에 finally가 f를 출력하고 이후 반환값이 then에서 출력된다. 흔한 실수: return 이후에는 finally가 실행되지 않는다고 보는 것이다.
### choice-explanation: b
finally는 반환값이 전달되기 전에 실행된다.
### choice-explanation: c
finally도 항상 실행되어 f가 출력된다.
### choice-explanation: d
finally가 반환 전에 실행되어 f가 먼저 출력되고 반환값이 then으로 전달된다.
### choice-explanation: a
then의 콜백이 반환값 cx를 출력한다.

## question: frontend-03-q20
### solution
정답 근거: JSON에는 문자열과 숫자와 객체 같은 기본 구조만 있어서 Date와 Map이 그대로 복원되지 않는다. 풀이: Date는 ISO 문자열이 되어 string이고 Map은 속성이 없는 빈 객체가 되어 object다. 흔한 실수: 파싱하면 원래 타입이 복원된다고 보는 것이다.
### choice-explanation: d
Date는 문자열로 직렬화되고 Map은 빈 객체로 직렬화된다.
### choice-explanation: c
Date가 복원되어 Date 객체가 된다고 본 값이다.
### choice-explanation: b
Map도 문자열로 직렬화된다고 본 값이다.
### choice-explanation: a
Map이 생략된다고 본 값이다.

## question: frontend-03-q21
### solution
정답 근거: POST는 서버의 상태를 바꾸는 요청에 쓰고 GET은 읽기 전용 조회에 쓴다. 풀이: 가입 제출은 새 데이터를 만드는 요청이라 POST가 적절하고 나머지는 주소로 다시 열거나 공유하는 조회라 GET이 어울린다. 흔한 실수: 값이 URL에 보이는 것이 싫다는 이유만으로 모든 요청에 POST를 쓰는 것이다.
### choice-explanation: b
다시 열 수 있어야 하는 조회는 URL에 값이 남는 GET이 맞다.
### choice-explanation: c
링크로 공유하는 필터는 URL에 담기는 GET이 맞다.
### choice-explanation: a
읽기만 하는 조회는 GET이 맞다.
### choice-explanation: d
서버의 데이터를 만들거나 바꾸는 요청에는 POST를 쓴다.

## question: frontend-03-q22
### solution
모범답안: checkbox. 허용 표기: 대소문자는 구분하지 않는다. 근거: checkbox는 항목마다 독립적으로 선택할 수 있고 radio는 같은 name 중 하나만 선택된다.

## question: frontend-03-q23
### solution
모범답안: 125. 허용 표기: 125와 125px이다. 풀이: 항목 폭의 합이 150px이므로 남는 150px을 항목 사이 두 곳에 75px씩 나눈다. 두 번째 항목은 50 + 75 = 125px에서 시작한다.

## question: frontend-03-q24
### solution
모범답안: relative. 허용 표기: 대소문자는 구분하지 않는다. 근거: sticky는 임계 위치 전까지 상대 위치처럼 일반 흐름 안에 있다가 스크롤 중에 고정된 것처럼 동작한다.

## question: frontend-03-q25
### solution
모범답안: 2 3. 허용 표기: 두 숫자 사이를 공백 하나로 쓴다. 풀이: 오른쪽 배열이 먼저 [2, 3]으로 계산된 뒤 a와 b에 대입된다. a는 2가 되고 b는 3이 된다.

## question: frontend-03-q26
### solution
모범답안: 7 is odd. 허용 표기: 앞뒤 공백은 무시한다. 풀이: 7 % 2는 1이라 참으로 평가되어 odd가 선택된다.

## question: frontend-03-q27
### solution
모범답안: TypeError. 허용 표기: 대소문자는 구분하지 않는다. 풀이: 클래스 본문은 엄격 모드라서 단독 호출한 g의 this가 undefined다. undefined의 n을 읽으려다 TypeError가 발생한다.

## question: frontend-03-q28
### solution
모범답안: clearInterval. 허용 표기: 소괄호를 붙인 clearInterval()도 허용하며 대소문자는 구분하지 않는다. 근거: setInterval의 반환값을 clearInterval에 전달하면 반복이 멈춘다.

## question: frontend-03-q29
### solution
모범답안: json. 허용 표기: json과 json()과 res.json()과 response.json()이며 대소문자는 구분하지 않는다. 근거: await res.json()처럼 호출하면 본문이 파싱된 값을 얻는다.

## question: frontend-03-q30
### solution
모범답안: setItem. 허용 표기: setItem과 setItem()과 localStorage.setItem이며 대소문자는 구분하지 않는다. 근거: setItem(key, value)로 저장하고 getItem(key)로 읽는다.

## question: frontend-03-q31
### solution
출력은 1과 3이다. 스프레드 연산자는 객체의 최상위 속성만 복사하는 얕은 복사다. n처럼 원시 값은 값이 복사되어 b.n의 변경이 a에 영향을 주지 않는다. list처럼 객체인 값은 같은 참조가 복사되어 b.list와 a.list가 하나의 배열을 가리키므로 push가 원본에도 보인다. 원본을 보호하려면 list도 새 배열로 복사해야 한다. 예를 들어 b의 list를 스프레드로 다시 복사하거나 structuredClone으로 전체를 복제한다.

## question: frontend-03-q32
### solution
async function create() { const res = await fetch('/api/items', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'pen' }) }); if (!res.ok) { throw new Error('요청 실패'); } return res.json(); } method로 POST를 지정하고 headers의 Content-Type으로 본문이 JSON임을 알리며 body에는 객체를 JSON.stringify한 문자열을 넣는다. await로 응답을 기다린 뒤 res.ok로 성공 여부를 확인하고 res.json()으로 본문을 읽는다. 호출하는 쪽에서는 try와 catch로 실패를 처리한다.
