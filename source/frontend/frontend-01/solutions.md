## question: frontend-01-q01
### solution
정답 근거: 기본 스타일에서 인라인인 요소는 `span`이다. 풀이: 나머지 세 요소는 기본 `display`가 `block`이라 이전 요소 뒤에서 줄이 바뀌고 부모 폭을 채운다. 흔한 실수: 의미가 없는 컨테이너라는 이유로 `div`와 `span`을 같은 종류로 묶는 것이다.
### choice-explanation: d
한 줄 전체를 차지하는 블록 요소다.
### choice-explanation: c
입력 요소를 묶는 블록 요소다.
### choice-explanation: b
목록 항목을 묶는 블록 요소다.
### choice-explanation: a
내용 크기만큼만 폭을 차지하고 앞뒤에서 줄이 바뀌지 않는 인라인 요소다.

## question: frontend-01-q02
### solution
정답 근거: 같은 name을 공유하며 단일 선택으로 동작하는 type은 `radio`다. 풀이: 같은 name의 두 입력을 차례로 눌렀을 때 첫 입력의 checked가 해제되는 것은 radio뿐이다. 흔한 실수: 선택 상자 모양만 보고 checkbox도 하나만 선택된다고 생각하는 것이다.
### choice-explanation: c
같은 name이어도 항목마다 독립적으로 켜고 끌 수 있어 여러 개를 선택한다.
### choice-explanation: a
같은 name끼리 하나의 그룹이 되어 한 번에 하나만 선택된다.
### choice-explanation: b
한 줄 문자열을 입력받는 필드라서 선택 상태가 없다.
### choice-explanation: d
폼을 전송하는 버튼이라서 선택 상태가 없다.

## question: frontend-01-q03
### solution
정답 근거: 한 문서의 핵심 콘텐츠를 나타내는 태그는 `main`이다. 풀이: header와 footer는 구획마다 둘 수 있고 aside는 부가 정보 영역이라 핵심 콘텐츠와 역할이 다르다. 흔한 실수: 페이지 위쪽에 있다는 이유로 header를 핵심 콘텐츠로 보는 것이다.
### choice-explanation: a
문서의 주된 콘텐츠 영역이며 화면에 보이는 것은 문서에 하나만 둔다.
### choice-explanation: d
소개나 탐색 영역을 나타내며 문서와 각 구획마다 둘 수 있다.
### choice-explanation: c
본문과 간접적으로 관련된 부가 정보를 담는다.
### choice-explanation: b
문서나 구획의 마무리 정보를 담으며 여러 개 쓸 수 있다.

## question: frontend-01-q04
### solution
정답 근거: `+`는 인접 형제 결합자로 바로 뒤의 형제 하나만 고른다. 풀이: h1 바로 뒤의 첫 문단만 일치하고 둘째 문단은 h1 바로 뒤가 아니라서 제외된다. 흔한 실수: `+`와 `~`를 같은 뜻으로 쓰는 것이다.
### choice-explanation: a
뒤따르는 형제를 모두 고르는 것은 일반 형제 결합자 `~`의 동작이다.
### choice-explanation: d
안쪽 요소를 고르는 것은 공백으로 쓰는 후손 선택자의 동작이다.
### choice-explanation: b
`+`는 바로 다음에 오는 형제 하나만 선택하므로 첫 문단 하나가 선택된다.
### choice-explanation: c
자식을 고르는 것은 `>` 결합자의 동작이며 이 문서의 p는 h1 안에 없다.

## question: frontend-01-q05
### solution
정답 근거: `!important` 선언이 일반 선언보다 우선한다. 풀이: 일반 선언끼리는 id가 가장 강해 blue지만 `.b`의 green은 `!important`라서 그보다 앞선다. 흔한 실수: `!important`를 무시하고 명시도만 비교하는 것이다.
### choice-explanation: d
id 선택자는 일반 선언 중에서만 가장 강하며 `!important`를 이기지 못한다.
### choice-explanation: c
`p.b`는 태그와 클래스 선택자라서 id보다 약하고 `!important`도 없다.
### choice-explanation: b
세 규칙이 모두 이 요소에 일치하므로 기본 글자색은 적용되지 않는다.
### choice-explanation: a
`!important`가 붙은 선언은 일반 선언보다 먼저 적용되므로 `.b`의 값이 이긴다.

## question: frontend-01-q06
### solution
정답 근거: content-box에서 width는 콘텐츠 폭만 뜻하므로 나머지를 더해야 한다. 풀이: 100 + 20 + 10 + 40 = 170이다. 흔한 실수: width가 border까지 포함한 폭이라고 보는 것이다.
### choice-explanation: d
margin 40px을 빼먹고 border 박스 크기만 구한 값이다.
### choice-explanation: c
좌우 border 10px을 빼먹은 값이다.
### choice-explanation: b
margin을 한쪽 20px만 더한 값이다.
### choice-explanation: a
콘텐츠 100px에 좌우 padding 20px과 border 10px과 margin 40px을 더한다.

## question: frontend-01-q07
### solution
정답 근거: 인접한 블록의 위아래 마진은 병합되어 큰 값이 간격이 된다. 풀이: 30px과 20px 중 큰 30px만 남는다. 흔한 실수: 마진을 항상 더한다고 생각하는 것이다.
### choice-explanation: b
두 마진을 더한 값인데 병합이 일어나면 더하지 않는다.
### choice-explanation: d
맞닿은 두 마진은 합쳐지지 않고 더 큰 값 하나로 병합된다.
### choice-explanation: c
나중에 오는 요소의 마진이 적용된다고 가정한 값이다.
### choice-explanation: a
두 마진의 차이로 계산한 값이다.

## question: frontend-01-q08
### solution
정답 근거: `var`는 호이스팅되며 undefined로 초기화되고 `let`은 선언 전까지 접근할 수 없다. 풀이: 첫 console.log는 undefined를 찍고 세 번째 줄에서 b를 읽는 순간 ReferenceError로 중단된다. 흔한 실수: let은 호이스팅되지 않는다고 외워서 undefined가 나온다고 답하는 것이다.
### choice-explanation: d
`var`는 선언이 끌어올려져 undefined를 읽고 `let`은 선언 전 접근이 오류다.
### choice-explanation: c
`var a`는 끌어올려져 있어서 첫 줄은 오류가 아니다.
### choice-explanation: a
`let b`는 선언 줄 전에 읽으면 undefined가 아니라 오류가 난다.
### choice-explanation: b
선언 줄에 도달하기 전에는 `b`에 값이 들어 있지 않다.

## question: frontend-01-q09
### solution
정답 근거: 빈 배열은 객체라서 내용과 관계없이 참이다. 풀이: 거짓 값은 명세상 여덟 가지이며 `0n`과 `NaN`도 거짓이다. 배열을 포함한 객체는 모두 참이다. 흔한 실수: 비어 있는 배열과 객체를 거짓으로 보는 것이다.
### choice-explanation: a
BigInt 0은 숫자 0과 같이 거짓으로 평가된다.
### choice-explanation: b
숫자가 아닌 값을 나타내는 NaN은 거짓으로 평가된다.
### choice-explanation: d
빈 배열도 객체이므로 항상 참으로 평가된다.
### choice-explanation: c
빈 문자열은 거짓으로 평가된다.

## question: frontend-01-q10
### solution
정답 근거: 스프레드는 한 단계만 복사하는 얕은 복사다. 풀이: n은 값 복사라 a.n이 1로 남고 list는 참조를 복사해서 push가 a에도 보인다. 흔한 실수: 스프레드가 중첩 객체까지 새로 만든다고 생각하는 것이다.
### choice-explanation: d
n은 값이 복사되므로 b의 변경이 a에 전달되지 않는다.
### choice-explanation: b
list는 새 배열로 복사되지 않고 같은 배열을 가리킨다.
### choice-explanation: c
n과 list가 반대로 동작한다고 가정한 값이다.
### choice-explanation: a
원시 값 n은 복사되어 a가 그대로고 list는 같은 배열이라 길이가 3이다.

## question: frontend-01-q11
### solution
정답 근거: `splice(start, deleteCount, ...items)`는 start부터 deleteCount개를 지우고 items를 넣는다. 풀이: 2와 3이 지워지고 a가 들어가 1, a, 4, 5가 남는다. 흔한 실수: slice처럼 두 번째 인자를 끝 인덱스로 보는 것이다.
### choice-explanation: b
인덱스 1부터 2개를 지우고 그 자리에 'a'를 넣는다.
### choice-explanation: d
두 번째 인자를 끝 인덱스로 읽어서 하나만 지운 값이다.
### choice-explanation: c
아무것도 지우지 않고 삽입만 한 값이다.
### choice-explanation: a
삭제 시작을 인덱스 2로 잘못 읽은 값이다.

## question: frontend-01-q12
### solution
정답 근거: 일반 함수의 this는 호출 방식으로 정해진다. 풀이: map이 콜백을 단독 함수로 호출하고 엄격 모드이므로 this는 undefined이며 속성 읽기에서 TypeError가 난다. 흔한 실수: 콜백 안의 this가 바깥 메서드의 this와 같다고 보는 것이다.
### choice-explanation: b
콜백은 단독 호출이라 엄격 모드에서 this가 undefined이고 undefined의 name을 읽을 수 없다.
### choice-explanation: c
name은 변수로 읽는 것이 아니라 속성 접근이라서 ReferenceError가 아니다.
### choice-explanation: d
일반 함수 콜백은 바깥 메서드의 this를 물려받지 않는다.
### choice-explanation: a
엄격 모드에서는 this가 전역 객체로 바뀌지 않아 속성을 읽는 시점에 오류가 난다.

## question: frontend-01-q13
### solution
정답 근거: 화살표 함수의 this는 만들어진 시점의 바깥 스코프에서 정해진다. 풀이: 메서드 안의 콜백으로 쓰면 메서드의 this를 그대로 쓸 수 있다. 흔한 실수: 화살표 함수를 객체 메서드로 쓰면 그 객체가 this가 된다고 보는 것이다.
### choice-explanation: b
호출 객체로 정해지는 것은 일반 함수의 규칙이다.
### choice-explanation: d
화살표 함수는 call과 bind로 this를 바꿀 수 없다.
### choice-explanation: c
바깥 스코프의 this를 따를 뿐 전역 객체로 고정되지 않는다.
### choice-explanation: a
화살표 함수는 자기 this를 만들지 않고 감싸는 스코프의 this를 따른다.

## question: frontend-01-q14
### solution
정답 근거: before와 after는 대상의 앞뒤 형제 위치에 넣고 prepend는 대상의 첫 자식으로 넣는다. 풀이: p 안은 3P가 되고 앞뒤에 1과 2가 붙어 box의 텍스트는 13P2다. 흔한 실수: prepend가 대상 앞에 붙는다고 생각하는 것이다.
### choice-explanation: c
prepend를 부모 box의 맨 앞에 넣는 메서드로 본 값이다.
### choice-explanation: a
before는 p 앞과 after는 p 뒤에 넣고 prepend는 p 안의 맨 앞에 넣는다.
### choice-explanation: d
prepend를 p 뒤에 붙이는 메서드로 본 값이다.
### choice-explanation: b
세 메서드를 모두 p 뒤에 이어 붙인 값이다.

## question: frontend-01-q15
### solution
정답 근거: `toggle`은 토글 후 클래스가 존재하면 true를 반환한다. 풀이: a는 제거되어 false이고 c는 추가되어 true이며 className은 b c가 된다. 흔한 실수: 반환값이 토글 전 상태라고 보는 것이다.
### choice-explanation: c
toggle은 클래스가 있었으면 지우고 false를 없었으면 추가하고 true를 반환한다.
### choice-explanation: d
a는 이미 있었으므로 제거되고 false가 반환된다.
### choice-explanation: b
c는 없었으므로 추가되고 true가 반환된다.
### choice-explanation: a
반환값이 반대이며 a도 제거된다.

## question: frontend-01-q16
### solution
정답 근거: setInterval은 반복 타이머이고 setTimeout은 일회성 타이머다. 풀이: 같은 지연 시간으로 두 타이머를 만들면 interval만 여러 번 실행된다. 흔한 실수: 시간 값이 같으면 동작도 같다고 보는 것이다.
### choice-explanation: c
반복 실행은 setInterval의 동작이고 setTimeout은 한 번만 실행된다.
### choice-explanation: b
interval은 clearInterval로 멈출 때까지 계속 실행되고 timeout은 한 번 뒤에 끝난다.
### choice-explanation: a
setTimeout은 지연 후 한 번만 실행되고 반복되지 않는다.
### choice-explanation: d
setInterval은 반복 실행이라 동작이 다르다.

## question: frontend-01-q17
### solution
정답 근거: Promise는 pending에서 fulfilled나 rejected로 한 번 바뀌면 그대로 유지된다. 풀이: 첫 resolve('A')가 상태를 정하고 나머지 호출은 무시되어 then의 성공 핸들러가 A를 출력한다. 흔한 실수: 마지막 호출의 값이 쓰인다고 보는 것이다.
### choice-explanation: b
reject가 resolve 뒤에 실행되어도 이미 정해진 상태는 바뀌지 않는다.
### choice-explanation: d
마지막 호출이 아니라 처음 호출이 상태를 정한다.
### choice-explanation: c
Promise가 fulfilled이므로 거절 핸들러는 실행되지 않는다.
### choice-explanation: a
처음 호출한 resolve로 상태가 정해지고 이후 호출은 무시된다.

## question: frontend-01-q18
### solution
정답 근거: catch의 반환값은 새 Promise를 이행시킨다. 풀이: 예외로 거절된 Promise를 catch가 처리하고 fixed를 반환하므로 마지막 then이 fixed를 받는다. 흔한 실수: catch 뒤의 then은 실행되지 않는다고 보는 것이다.
### choice-explanation: b
then에서 예외가 났으므로 처음 값 start는 전달되지 않는다.
### choice-explanation: c
catch가 오류를 처리하고 fixed를 반환하면 다음 then은 그 값을 받는다.
### choice-explanation: d
catch가 값을 반환했으므로 undefined가 아니다.
### choice-explanation: a
catch는 오류 객체 대신 반환값을 넘기므로 오류 메시지는 전달되지 않는다.

## question: frontend-01-q19
### solution
정답 근거: async 함수는 항상 Promise를 반환한다. 풀이: return 1은 값이 1인 이행된 Promise가 되고 Promise는 객체이므로 typeof가 object다. 흔한 실수: async 함수가 반환값을 그대로 돌려준다고 보는 것이다.
### choice-explanation: c
return 1은 숫자를 직접 돌려주지 않고 Promise에 담는다.
### choice-explanation: a
함수 자체가 아니라 호출 결과의 타입을 묻고 있다.
### choice-explanation: d
async 함수는 반환값을 Promise 객체로 감싸 돌려주므로 typeof가 object다.
### choice-explanation: b
반환문이 있으므로 호출 결과가 undefined가 아니다.

## question: frontend-01-q20
### solution
정답 근거: JSON.stringify는 객체 속성값이 undefined나 함수면 그 속성을 생략하고 배열 요소면 null로 바꾼다. 풀이: b와 d가 빠지고 c의 두 번째 요소가 null이 된다. 흔한 실수: 객체와 배열에서 같은 규칙이 적용된다고 보는 것이다.
### choice-explanation: a
객체 속성의 undefined는 null이 아니라 통째로 생략된다.
### choice-explanation: b
함수 속성은 null이 되지 않고 생략된다.
### choice-explanation: d
배열 안의 undefined는 생략되지 않고 null로 남는다.
### choice-explanation: c
객체의 undefined와 함수 속성은 빠지고 배열 안의 undefined는 null이 된다.

## question: frontend-01-q21
### solution
정답 근거: 두 저장소는 보관 주기와 공유 범위가 다르다. 풀이: localStorage는 같은 출처의 모든 탭이 공유하고 브라우저를 닫아도 남으며 sessionStorage는 탭 단위로 분리되어 탭이 닫히면 사라진다. 흔한 실수: 쿠키처럼 서버로 자동 전송된다고 보는 것이다.
### choice-explanation: b
sessionStorage는 탭마다 따로 가지며 다른 탭과 공유되지 않는다.
### choice-explanation: a
localStorage에는 만료 시간 옵션이 없다.
### choice-explanation: c
localStorage는 직접 지우기 전까지 유지되고 sessionStorage는 탭 세션 동안만 유지된다.
### choice-explanation: d
웹 스토리지는 브라우저 안에만 저장되며 자동 전송되지 않는다.

## question: frontend-01-q22
### solution
모범답안: article. 허용 표기: article과 꺾쇠를 붙인 <article>이며 대소문자는 구분하지 않는다. 근거: article은 독립적으로 배포하거나 재사용할 수 있는 콘텐츠 단위를 나타낸다.

## question: frontend-01-q23
### solution
모범답안: justify-content. 허용 표기: 대소문자는 구분하지 않는다. 근거: justify-content는 주축 방향의 정렬을 정하고 교차축 방향 정렬은 align-items가 맡는다.

## question: frontend-01-q24
### solution
모범답안: top. 허용 표기: 대소문자는 구분하지 않는다. 근거: sticky는 top, bottom, left, right 중 하나의 오프셋이 있어야 기준 위치에 달라붙는다. 오프셋이 없으면 일반 흐름 그대로 스크롤된다.

## question: frontend-01-q25
### solution
모범답안: 13. 허용 표기: 앞뒤 공백은 무시한다. 풀이: x는 1이고 둘째 요소는 건너뛰며 y는 undefined라서 기본값 10이 쓰인다. rest는 [4, 5]이므로 길이가 2다. 1 + 10 + 2 = 13이다.

## question: frontend-01-q26
### solution
모범답안: 3 + 6 = 9. 허용 표기: 공백이 있는 3 + 6 = 9와 공백이 없는 3+6=9이며 앞뒤 공백은 무시한다. 풀이: 템플릿 리터럴 안의 식이 계산되어 3, 6, 9가 들어간다.

## question: frontend-01-q27
### solution
모범답안: 1. 허용 표기: 앞뒤 공백은 무시한다. 풀이: 화살표 함수는 Counter 안의 this를 그대로 쓰므로 new로 만든 인스턴스의 n이 0에서 1로 증가한다.

## question: frontend-01-q28
### solution
모범답안: addEventListener. 허용 표기: 소괄호를 붙인 addEventListener()도 허용하며 대소문자는 구분하지 않는다. 근거: 같은 이벤트에 핸들러를 여러 개 등록할 수 있는 표준 방식이다.

## question: frontend-01-q29
### solution
모범답안: application/json. 허용 표기: charset을 덧붙인 application/json; charset=utf-8도 허용하며 대소문자는 구분하지 않는다. 근거: 서버가 본문을 JSON으로 해석하도록 알려 주는 미디어 타입이다.

## question: frontend-01-q30
### solution
모범답안: GET. 허용 표기: 대소문자는 구분하지 않는다. 근거: GET은 파라미터를 URL에 붙여 보내 주소창에 노출되고 POST는 요청 본문에 담는다.

## question: frontend-01-q31
### solution
충돌하는 선언은 먼저 `!important` 여부로 나뉘고 중요한 선언이 일반 선언보다 앞선다. 같은 구분 안에서는 명시도를 비교하며 인라인 스타일이 가장 강하고 id 선택자와 클래스 선택자와 태그 선택자 순으로 약해진다. 명시도는 id 개수와 클래스 개수와 태그 개수를 앞자리부터 비교하므로 클래스를 많이 써도 id 하나를 넘지 못한다. 명시도가 같으면 나중에 선언된 규칙이 이긴다. `!important`끼리 충돌하면 다시 같은 순서로 비교한다.

## question: frontend-01-q32
### solution
출력은 B, C의 순서다. 세 번째 then의 예외로 그 then이 돌려준 Promise는 rejected가 된다. 이어지는 then은 이행 핸들러만 있어서 건너뛰고 거절 상태가 그대로 전달된다. catch가 이를 처리하고 값을 반환하면 새 Promise는 fulfilled가 되어 마지막 then이 실행된다.
