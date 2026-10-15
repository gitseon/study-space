## question: ai-written-01-q001
### solution
정답 근거: AI는 주어진 환경에서 판단해 목표를 이루는 시스템 전체이고, ML은 그중 데이터로 규칙을 학습하는 방법이다. 풀이: 각 선택지가 데이터에서 규칙을 학습하는지 확인하면 규칙을 사람이 직접 쓴 검사 프로그램만 학습 과정이 없다. 흔한 실수: 자동으로 판정한다는 점만 보고 모두 ML이라고 생각하기 쉽다. 학습 여부가 기준이다.
### choice-explanation: b
판매 데이터에서 관계를 학습하는 ML이다.
### choice-explanation: a
규칙은 사람이 정했고 데이터로 학습하지 않으므로 ML이 아닌 AI의 예다.
### choice-explanation: c
합성곱 신경망은 데이터로 학습하는 DL이며 ML에 속한다.
### choice-explanation: d
시청 기록에서 패턴을 학습하는 ML이다.

## question: ai-written-01-q002
### solution
정답 근거: 포함관계는 AI ⊃ ML ⊃ DL이다. 풀이: DL은 신경망을 깊게 쌓아 학습하는 ML 방법이고 ML은 AI의 한 방법이므로 가장 안쪽이 DL이다. 흔한 실수: ML이 AI보다 크다고 뒤집어 생각하는 경우가 많다.
### choice-explanation: b
포함 방향이 뒤집혔고 DL도 ML에 속한다.
### choice-explanation: c
DL은 데이터로 학습하는 신경망 방법이다.
### choice-explanation: d
DL은 ML의 부분집합이므로 ML에 속한다.
### choice-explanation: a
가장 바깥이 AI이고 안쪽으로 ML, DL 순서이다.

## question: ai-written-01-q003
### solution
정답 근거: Label은 모델이 맞혀야 하는 정답이다. 풀이: 입력으로 쓰는 단어 빈도와 발신 정보는 Feature이고 예측 대상인 스팸 여부가 Label이다. 흔한 실수: 입력으로 쓰는 값과 맞혀야 하는 값을 바꿔 부르기 쉽다.
### choice-explanation: c
입력 정보이므로 Feature이다.
### choice-explanation: a
예측해야 하는 대상이므로 Label이다.
### choice-explanation: b
예측에 쓰는 입력이므로 Feature이다.
### choice-explanation: d
학습의 결과로 얻는 파라미터이다.

## question: ai-written-01-q004
### solution
정답 근거: $f$는 입력과 출력의 참 관계이고 $\epsilon$은 줄일 수 없는 오차이다. 풀이: 아무리 좋은 모델이라도 데이터에 섞인 측정 오차까지 없앨 수는 없으므로 성능 기대치에 한계가 있다. 흔한 실수: 학습을 잘하면 오차를 모두 없앨 수 있다고 오해하기 쉽다.
### choice-explanation: a
참 관계로 설명되지 않는 잡음이므로 줄일 수 없다.
### choice-explanation: d
손실 값은 모델과 정답의 차이로 따로 계산한다.
### choice-explanation: b
학습으로 줄일 수 있는 것은 모델 오차이지 이 항이 아니다.
### choice-explanation: c
상관 정도와는 관계없는 오차 항이다.

## question: ai-written-01-q005
### solution
정답 근거: 회귀는 연속된 수치를 예측하는 문제이다. 풀이: 출력이 숫자인지 범주인지로 구분하면 수율 값 예측만 연속값이다. 흔한 실수: 숫자가 들어 있으면 회귀라고 판단하기 쉽지만 출력의 형태가 기준이다.
### choice-explanation: a
수율은 연속된 수치라서 회귀이다.
### choice-explanation: c
등급은 범주이므로 분류이다.
### choice-explanation: b
불량 여부는 범주이므로 분류이다.
### choice-explanation: d
스팸 여부는 범주이므로 분류이다.

## question: ai-written-01-q006
### solution
정답 근거: $R^2 = 1 - \mathrm{RSS}/\mathrm{TSS}$이다. 풀이: 평균 예측의 오차 제곱합 대비 모델의 오차 제곱합 비율을 1에서 빼므로 평균보다 못하면 음수가 된다. 흔한 실수: 0과 1 사이라고만 외우는 경우가 많다.
### choice-explanation: c
오차 제곱의 평균은 MSE이다.
### choice-explanation: d
클수록 설명력이 크다는 뜻이다.
### choice-explanation: a
RSS가 TSS보다 크면 음수가 되므로 범위에 제한이 없다.
### choice-explanation: b
평균보다 못하면 음수가 되므로 하한이 0이 아니다.

## question: ai-written-01-q007
### solution
정답 근거: $\mathrm{MSE} = \frac{1}{n}\sum (y_i - \hat{y}_i)^2$이다. 풀이: 오차는 $1, 0, -2$이고 제곱합이 5이므로 $5/3 \approx 1.67$이다. 흔한 실수: 제곱합 5를 그대로 답하거나 제곱근을 취한 값(RMSE 약 1.29)과 혼동한다.
### choice-explanation: b
이 값은 MSE의 제곱근인 RMSE이다.
### choice-explanation: a
제곱합 5를 개수 3으로 나눈 값이다.
### choice-explanation: d
이 값은 평균하지 않은 제곱합이다.
### choice-explanation: c
이 값은 오차 절댓값의 평균(MAE)이다.

## question: ai-written-01-q008
### solution
정답 근거: 재현율은 진짜 양성 중 찾아낸 비율 $TP/(TP+FN)$이다. 풀이: $40 / (40 + 20) = 0.667$이다. 흔한 실수: 정밀도 $40/50 = 0.80$이나 정확도 $170/200 = 0.85$와 혼동한다.
### choice-explanation: d
이 값은 놓친 비율(FN 비율)이다.
### choice-explanation: c
이 값은 정확도이다.
### choice-explanation: a
진짜 양성 60개 중 40개를 찾았다.
### choice-explanation: b
이 값은 정밀도이다.

## question: ai-written-01-q009
### solution
정답 근거: 불균형 자료에서는 정확도만으로 성능을 판단할 수 없다. 풀이: 불량을 하나도 양성으로 예측하지 않았으므로 $TP = 0$이고 재현율 $TP/(TP+FN)$이 0이다. 흔한 실수: 정확도가 높으면 쓸 만한 모델이라고 판단하는 실수가 흔하다.
### choice-explanation: c
양성 예측이 없으므로 정밀도는 정의되지 않는다.
### choice-explanation: b
정확도는 다수 클래스를 맞힌 비율이 대부분이다.
### choice-explanation: a
놓치면 안 되는 불량을 전부 놓치므로 재현율을 함께 봐야 한다.
### choice-explanation: d
교차 엔트로피는 학습 중 줄이는 손실이지 퍼센트 평가가 아니다.

## question: ai-written-01-q010
### solution
정답 근거: ROC 곡선은 임계값에 따른 FPR과 TPR의 관계이다. 풀이: 임계값을 0에서 1까지 움직이며 점을 찍으면 곡선이 되고 아래 면적 AUC가 1에 가까울수록 좋다. 흔한 실수: AUC 0.5를 최고 점수로 착각하는 경우가 있다. 0.5는 무작위 수준이다.
### choice-explanation: c
손실 곡선은 학습 곡선이다.
### choice-explanation: b
정밀도와 재현율의 곡선은 PR 곡선이다.
### choice-explanation: d
AUC 0.5는 무작위 추측 수준이다.
### choice-explanation: a
가로축은 FPR, 세로축은 TPR이다.

## question: ai-written-01-q011
### solution
정답 근거: 학습 오차는 낮고 검증 오차만 높으면 과적합이다. 풀이: 학습 자료의 잡음까지 외워 일반화가 나쁜 상태이므로 데이터 추가, 정규화, 조기 종료로 대응한다. 흔한 실수: 학습 오차가 낮다는 이유로 좋은 모델이라고 판단한다.
### choice-explanation: c
검증 오차가 높으면 일반화가 나쁘다.
### choice-explanation: a
과적합에는 일반화를 돕는 대응이 알맞다.
### choice-explanation: d
에폭을 늘리면 과적합이 더 심해질 수 있다.
### choice-explanation: b
과소적합은 학습 오차와 검증 오차가 둘 다 높은 경우이다.

## question: ai-written-01-q012
### solution
정답 근거: 학습과 검증이 좋았는데 운영에서만 떨어졌다면 분포 변화를 의심한다. 풀이: 센서가 바뀌어 입력 분포가 달라졌으므로 모델 구조보다 데이터와 적응이 문제의 핵심이다. 흔한 실수: 성능이 떨어지면 무조건 과적합이라고 판단하는 실수가 있다.
### choice-explanation: b
층을 늘리면 오히려 더 불리하며 원인과 맞지 않는다.
### choice-explanation: d
입력이 바뀐 것이 원인이다.
### choice-explanation: c
학습과 검증 성능이 좋았으므로 과소적합이 아니다.
### choice-explanation: a
과적합이 아니어도 분포가 달라지면 성능이 떨어진다.

## question: ai-written-01-q013
### solution
정답 근거: 층화 분할은 클래스 비율을 유지하는 분할이다. 풀이: 무작위로만 나누면 소수 클래스가 한쪽에 몰릴 수 있으므로 비율을 맞춰 나누면 검증 결과가 안정된다. 흔한 실수: 층화가 데이터를 늘리거나 균형을 맞추는 기능이라고 오해한다.
### choice-explanation: d
검증 자료로 학습하면 평가가 왜곡된다.
### choice-explanation: a
비율만 유지하며 개수를 늘리지는 않는다.
### choice-explanation: c
층화는 순서 보존과 관계없다.
### choice-explanation: b
복제는 오버샘플링이며 층화와 다르다.

## question: ai-written-01-q014
### solution
정답 근거: 전처리 통계는 학습 자료에서만 구하고 같은 값을 재사용한다. 풀이: 검증 자료의 정보를 쓰면 평가가 낙관적으로 나오고, 검증과 운영 입력은 학습 때와 같은 기준으로 변환해야 한다. 흔한 실수: 검증 자료에 `fit`을 다시 호출하는 실수가 흔하다.
### choice-explanation: c
생략하면 입력 기준이 달라져 성능이 떨어진다.
### choice-explanation: d
검증 정보가 섞여 누수가 생긴다.
### choice-explanation: a
학습 자료의 통계를 그대로 쓰므로 누수가 없다.
### choice-explanation: b
기준이 달라져 학습 때와 같은 변환이 되지 않는다.

## question: ai-written-01-q015
### solution
정답 근거: 다중회귀의 계수는 다른 변수를 고정한 평균 변화량이다. 풀이: 계수는 단위 변화당 평균 변화이며 인과를 뜻하지 않고 오차 항 때문에 개별 값은 어긋난다. 흔한 실수: 계수를 퍼센트 변화나 인과로 읽는 실수가 많다.
### choice-explanation: d
오차가 있어 평균 변화일 뿐 매번 같지 않다.
### choice-explanation: c
계수가 유의해도 원인이라고 단정할 수 없다.
### choice-explanation: a
다른 변수를 고정한다는 조건과 평균이라는 표현이 모두 맞다.
### choice-explanation: b
단위 변화 기준이지 퍼센트 기준이 아니다.

## question: ai-written-01-q016
### solution
정답 근거: p-value가 크면 계수가 0이라는 가설을 기각하기 어렵다. 풀이: 0.86은 0.05보다 훨씬 크므로 신문 계수는 0과 구분되지 않고, 변수를 빼도 설명력은 거의 변하지 않는다. 흔한 실수: 계수의 부호나 크기만 보고 효과가 있다고 말하는 실수가 있다.
### choice-explanation: a
신문의 추가 설명력이 통계적으로 확인되지 않는다.
### choice-explanation: c
p-value가 작을수록 유의하다.
### choice-explanation: d
유의하지 않은 변수를 빼도 $R^2$는 거의 그대로이다.
### choice-explanation: b
효과가 없다는 것이지 음의 효과라는 뜻이 아니다.

## question: ai-written-01-q017
### solution
정답 근거: 로지스틱 회귀는 선형식에 시그모이드를 씌운 모델이다. 풀이: 로그 오즈 $\log\frac{p}{1-p}$가 입력에 선형이므로 확률은 시그모이드 곡선을 따라 비선형으로 변하고, 계수는 최대우도로 구한다. 흔한 실수: 계수를 선형회귀처럼 확률의 선형 변화로 읽는다.
### choice-explanation: a
선형인 것은 확률이 아니라 로그 오즈이다.
### choice-explanation: c
최대우도로 구하며 출력은 0과 1 사이이다.
### choice-explanation: d
계수 부호와 확률의 절대 수준은 별개이다.
### choice-explanation: b
확률은 시그모이드를 따라 비선형으로 변한다.

## question: ai-written-01-q018
### solution
정답 근거: 임계값은 양성으로 판정하는 확률의 기준선이다. 풀이: 기준선이 낮아지면 양성 판정이 늘어 놓치는 양성은 줄지만 오탐이 늘어 정밀도가 떨어지는 경향이 있다. 흔한 실수: 임계값을 낮추면 양성 판정이 줄어든다고 거꾸로 생각한다.
### choice-explanation: c
방향이 반대로 서술되었다.
### choice-explanation: a
재현율과 정밀도는 보통 서로 맞바뀌는 관계이다.
### choice-explanation: d
임계값은 판정 결과에 직접 영향을 준다.
### choice-explanation: b
임계값을 낮추면 양성 판정이 늘어난다.

## question: ai-written-01-q019
### solution
정답 근거: 선형 함수를 합성한 결과는 다시 선형 함수이다. 풀이: $W_2(W_1x) = (W_2W_1)x$이므로 층을 쌓아도 하나의 행렬로 합쳐지고 비선형 활성화가 있어야 표현력이 늘어난다. 흔한 실수: 층을 쌓으면 저절로 복잡한 함수를 표현한다고 믿는 실수가 있다.
### choice-explanation: c
선형층만으로는 XOR을 풀 수 없다.
### choice-explanation: d
마지막 층만으로는 선형 결과를 바꾸지 못한다.
### choice-explanation: b
활성화가 없으면 깊어져도 선형이다.
### choice-explanation: a
비선형 활성화가 표현력의 핵심이다.

## question: ai-written-01-q020
### solution
정답 근거: SGD는 미니배치로 기울기를 근사한다. 풀이: 한 번의 갱신 비용이 작아 큰 자료에 쓰기 좋고, 기울기에 섞인 잡음이 지역 최솟값과 안장점 탈출에 도움이 된다. 흔한 실수: 더 빨리 수렴하고 전역 최솟값을 찾는다고 과장해서 기억한다.
### choice-explanation: b
에폭 수가 항상 적다는 보장은 없다.
### choice-explanation: d
갱신식에는 학습률이 곱해진다.
### choice-explanation: c
비볼록 손실에서는 전역 최솟값이 보장되지 않는다.
### choice-explanation: a
속도 이점은 갱신 비용에서 나오며 잡음이 부수 효과이다.

## question: ai-written-01-q021
### solution
정답 근거: 갱신식은 $\phi \leftarrow \phi - \alpha \frac{\partial L}{\partial \phi}$이다. 풀이: 기울기는 $2\phi = 4$이므로 $2 - 0.1 \times 4 = 1.6$이다. 흔한 실수: 기울기를 빼지 않고 더하면 2.4가 나온다.
### choice-explanation: a
기울기 반대 방향으로 0.4만큼 이동한다.
### choice-explanation: c
이 값은 이동량 $\alpha \times 4$이지 갱신된 $\phi$가 아니다.
### choice-explanation: d
기울기 $2\phi$ 대신 $\phi$를 사용한 값이다.
### choice-explanation: b
기울기를 빼지 않고 더한 값이다.

## question: ai-written-01-q022
### solution
정답 근거: 기울기는 역전파로 구한 뒤 갱신에 쓰이고, 다음 배치 전에 비워야 누적되지 않는다. 풀이: `zero_grad`, 예측과 손실, `backward`, `step` 순서이며 `backward`가 기울기를 만들고 `step`이 그 값을 사용한다. 흔한 실수: `backward`를 호출하기 전에 `step`을 호출하는 순서 오류가 흔하다.
### choice-explanation: a
기울기를 만든 뒤에 갱신해야 한다.
### choice-explanation: c
손실이 없는 상태에서 역전파를 할 수 없다.
### choice-explanation: d
갱신 전에 기울기를 계산하지 않았다.
### choice-explanation: b
갱신이 기울기 계산보다 앞서 있다.

## question: ai-written-01-q023
### solution
정답 근거: 역전파는 연쇄법칙으로 각 파라미터의 기울기를 구하는 방법이다. 풀이: 출력의 손실에서 시작해 뒤쪽 층의 기울기를 구하고 앞쪽 층으로 전파하며, 순전파에서 저장한 값을 재사용해 계산을 줄인다. 흔한 실수: 기울기 계산과 가중치 갱신을 같은 단계로 혼동한다.
### choice-explanation: b
입력부터 다시 계산하면 비효율적이며 역전파가 아니다.
### choice-explanation: d
갱신은 옵티마이저의 단계이다.
### choice-explanation: a
기울기를 구하는 방향은 출력에서 입력이다.
### choice-explanation: c
학습률은 사람이 정하는 하이퍼파라미터이다.

## question: ai-written-01-q024
### solution
정답 근거: 거리 기반 방법은 단위에 민감하고 K-means는 초기값에 따라 결과가 달라진다. 풀이: 단위가 큰 특성이 거리를 지배하지 않도록 표준화하고, 지역 최솟값을 피하려고 초기 중심을 바꿔 반복한다. 흔한 실수: K-means가 항상 같은 결과를 낸다고 생각한다.
### choice-explanation: d
PCA는 라벨 없이 분산이 큰 방향을 찾는 비지도 기법이다.
### choice-explanation: c
군집 수는 사람이 해석과 함께 정한다.
### choice-explanation: b
초기값에 따라 결과가 달라진다.
### choice-explanation: a
표준화와 반복 실행이 안정적인 결과를 위한 기본 절차이다.

## question: ai-written-01-q025
### solution
정답 근거: 원-핫 벡터는 어휘 크기만큼 길고 하나만 1인 희소 벡터이다. 풀이: 서로 다른 단어는 1의 위치가 달라 내적이 0이므로 비슷한 단어끼리 가깝다는 정보가 없다. 흔한 실수: 원-핫 내적으로 단어 유사도를 잴 수 있다고 오해한다.
### choice-explanation: a
희소하고 길며 의미 정보가 없는 것이 핵심 한계이다.
### choice-explanation: d
원-핫 자체는 학습 파라미터가 아니다.
### choice-explanation: b
원-핫은 어휘 수만큼 차원이 커서 크다.
### choice-explanation: c
단어마다 다른 위치에 1이 있어 서로 구별된다.

## question: ai-written-01-q026
### solution
정답 근거: 워드 임베딩은 분포 가설에 따라 주변 단어가 비슷한 단어를 가까이 놓는다. 풀이: 밀집 벡터 사이의 거리나 코사인 유사도로 의미 유사성을 계산할 수 있다. 흔한 실수: 원-핫이나 정수 번호도 유사도를 줄 것이라고 생각한다.
### choice-explanation: d
글자 수는 의미를 나타내지 못한다.
### choice-explanation: a
학습된 밀집 벡터가 의미 유사도를 반영한다.
### choice-explanation: c
정수 번호의 크기는 의미와 관계없다.
### choice-explanation: b
서로 다른 원-핫 벡터의 내적은 0이라 구분력이 없다.

## question: ai-written-01-q027
### solution
정답 근거: Skip-gram은 희귀 단어에 강하고 CBOW는 학습이 빠르다. 풀이: Skip-gram은 한 중심 단어가 여러 주변 단어 예측에 쓰여 적은 자료에서도 단어 표현이 잘 학습된다. 흔한 실수: 예측 방향을 서로 바꿔 기억하는 경우가 많다.
### choice-explanation: d
평균을 쓰는 쪽은 CBOW이다.
### choice-explanation: a
예측 방향이 중심에서 주변이다.
### choice-explanation: c
속도 이점이 있지만 희귀 단어 표현은 약하다.
### choice-explanation: b
CBOW는 주변에서 중심을 예측하며 희귀 단어에 약하다.

## question: ai-written-01-q028
### solution
정답 근거: 윈도우 크기 2는 중심 단어의 앞뒤 2개씩을 주변 단어로 본다. 풀이: `brown`의 앞은 `the`, `quick`, 뒤는 `fox`, `runs`이므로 쌍은 4개이다. 흔한 실수: 중심 단어를 포함하거나 한쪽 방향만 세는 실수가 있다.
### choice-explanation: d
중심 단어 자신까지 주변에 포함한 값이다.
### choice-explanation: b
앞뒤 중 한쪽 방향만 센 값이다.
### choice-explanation: a
앞쪽 2개와 뒤쪽 2개이다.
### choice-explanation: c
경계에 걸리는 단어가 있다고 잘못 계산한 값이다.

## question: ai-written-01-q029
### solution
정답 근거: 순차 데이터는 순서와 장기 의존성과 가변 길이가 특징이다. 풀이: '나는 너를 사랑해'와 '너는 나를 사랑해'처럼 순서가 달라지면 의미가 달라진다. 흔한 실수: 단어를 순서 없이 모아 봐도 같다고 생각하기 쉽다.
### choice-explanation: a
세 가지 특징이 모두 맞게 서술되었다.
### choice-explanation: b
순서를 바꾸면 의미가 달라진다.
### choice-explanation: c
길이가 문장마다 다르다.
### choice-explanation: d
과거 정보가 현재 의미를 정한다.

## question: ai-written-01-q030
### solution
정답 근거: `batch_first=True`이면 입력과 `out`은 (배치, 길이, 특성) 순서이다. 풀이: 임베딩 출력은 `(8, 20, 64)`이고 LSTM은 마지막 차원을 은닉 크기 128로 바꾸므로 `out`은 `(8, 20, 128)`이다. 흔한 실수: 마지막 시점의 은닉 상태 `h`의 모양과 `out`을 혼동한다.
### choice-explanation: d
마지막 차원은 입력이 아닌 은닉 크기이다.
### choice-explanation: c
`batch_first=True`이므로 배치가 먼저이다.
### choice-explanation: a
모든 시점의 은닉 상태가 담겨 길이 20이 유지된다.
### choice-explanation: b
시점 차원이 없는 값은 마지막 은닉 상태 쪽 모양이다.

## question: ai-written-01-q031
### solution
정답 근거: BPTT에서는 같은 가중치가 시점 수만큼 곱해진다. 풀이: 곱해지는 값의 크기가 1보다 작으면 거듭제곱으로 0에 가까워지고 1보다 크면 폭발한다. 흔한 실수: 기울기 클리핑이 소실도 해결해 준다고 오해한다. 클리핑은 폭발만 막는다.
### choice-explanation: a
반복 곱셈이 소실의 구조적 원인이다.
### choice-explanation: b
RNN의 기본 활성화는 tanh이며 핵심 원인이 아니다.
### choice-explanation: d
배치 크기는 시간축 곱셈과 관계가 없다.
### choice-explanation: c
발산은 소실이 아니라 폭발 쪽 현상이다.

## question: ai-written-01-q032
### solution
정답 근거: LSTM은 셀 상태와 망각, 입력, 출력 게이트로 장기 정보를 보존한다. 풀이: $c_t = f \odot c_{t-1} + i \odot g$처럼 덧셈 경로가 있어 기울기가 오래 전달되며, 그래도 한계는 남는다. 흔한 실수: LSTM이 문제를 완전히 해결했다고 믿는 경우가 많다.
### choice-explanation: b
문제를 완화하지만 완전히 없애지는 못한다.
### choice-explanation: d
시점을 순서대로 계산해야 해서 병렬화가 어렵다.
### choice-explanation: a
덧셈 경로와 게이트가 핵심이고 한계도 함께 서술했다.
### choice-explanation: c
셀 상태가 LSTM의 핵심 구성이다.

## question: ai-written-01-q033
### solution
정답 근거: 고정 길이 벡터가 병목이 된다. 풀이: 입력이 길수록 한 벡터에 담아야 할 정보가 많아져 앞부분 정보가 손실되며, 어텐션이 이를 보완한다. 흔한 실수: 디코더의 생성 방식 때문이라고 오해한다.
### choice-explanation: d
원-핫은 차원이 작지 않고 크다.
### choice-explanation: c
출력 길이를 모르는 것은 병목과 관계없다.
### choice-explanation: a
병목이 되는 벡터가 핵심 원인이다.
### choice-explanation: b
한 단어씩 생성하는 것은 문제의 원인이 아니다.

## question: ai-written-01-q034
### solution
정답 근거: 어텐션은 필요한 입력 위치에 가중치를 주어 가중합을 만든다. 풀이: 각 시점마다 가중치를 새로 계산하므로 긴 입력에서도 필요한 정보를 직접 참조하고 가중치를 시각화해 근거를 확인할 수 있다. 흔한 실수: 어텐션이 성능만 올리고 해석에는 도움이 안 된다고 생각한다.
### choice-explanation: d
순서 보존이 목적이 아니라 참조 위치 선택이 목적이다.
### choice-explanation: a
매 시점 가중치를 계산해 전체 상태를 참조한다.
### choice-explanation: b
마지막 상태 하나만 쓰는 것이 기존 방식의 병목이다.
### choice-explanation: c
가중치는 입력에 따라 달라지고 학습된다.

## question: ai-written-01-q035
### solution
정답 근거: 차원 $d_k$가 크면 내적의 분산이 커진다. 풀이: 내적이 크면 softmax 출력이 거의 원-핫이 되어 기울기가 매우 작아지므로 $\sqrt{d_k}$로 나누어 크기를 맞춘다. 흔한 실수: 스케일링을 계산량 감소와 혼동한다.
### choice-explanation: d
부호를 바꾸는 연산이 아니다.
### choice-explanation: c
차원은 그대로이고 계산량도 거의 같다.
### choice-explanation: a
softmax 포화를 막아 학습을 안정시킨다.
### choice-explanation: b
나누기는 값을 키우지 않고 내적의 크기를 줄인다.

## question: ai-written-01-q036
### solution
정답 근거: 쿼리는 찾는 대상, 키는 특징, 값은 가져올 정보이다. 풀이: $QK^\top$으로 위치 사이 유사도를 구하고 softmax로 확률 분포로 바꾼 뒤 $V$를 곱해 합친다. 흔한 실수: 쿼리와 키와 값의 역할을 서로 바꿔 기억한다.
### choice-explanation: a
유사도는 쿼리와 키로, 합치는 대상은 값이다.
### choice-explanation: d
키와 값은 어텐션의 핵심 입력이다.
### choice-explanation: c
softmax로 가중치를 만든 뒤 가중합한다.
### choice-explanation: b
유사도를 만드는 쌍은 쿼리와 키이다.

## question: ai-written-01-q037
### solution
정답 근거: 셀프 어텐션은 토큰 집합에 대한 연산이라 순서를 알지 못한다. 풀이: 위치 정보를 임베딩에 더해야 같은 단어도 위치에 따라 다른 표현을 갖는다. 흔한 실수: 어텐션이 순서를 안다고 오해한다.
### choice-explanation: d
기울기 문제는 잔차 연결과 층 정규화가 담당한다.
### choice-explanation: b
위치 인코딩은 차원을 줄이지 않는다.
### choice-explanation: c
미래 토큰을 가리는 것은 마스크이다.
### choice-explanation: a
순서 정보를 보충하는 것이 목적이다.

## question: ai-written-01-q038
### solution
정답 근거: 인코더 계열은 이해에, 디코더 계열은 생성에 강하다. 풀이: BERT는 양방향 문맥으로 분류나 개체명 인식에 강하고 GPT는 다음 토큰을 예측해 글을 생성한다. 흔한 실수: BERT가 생성에도 가장 적합하다고 오해한다.
### choice-explanation: b
두 계열의 강점이 서로 뒤바뀌어 있다.
### choice-explanation: c
BERT는 생성에 약하다.
### choice-explanation: d
Word2Vec은 문맥을 반영하는 모델이 아니다.
### choice-explanation: a
과제 성격에 따라 계열을 나누어 선택했다.

## question: ai-written-01-q039
### solution
정답 근거: 디코더 계열은 다음 토큰 예측으로 사전학습한다. 풀이: 미래 토큰을 보면 정답을 훔쳐보게 되므로 마스크로 가리고 왼쪽 문맥만 쓴다. 흔한 실수: BERT의 가린 단어 맞히기와 혼동한다.
### choice-explanation: b
이는 인코더 계열(BERT)의 방식이다.
### choice-explanation: a
다음 토큰 예측과 마스크가 디코더 계열의 특징이다.
### choice-explanation: d
사전학습 목표는 다음 토큰 예측이다.
### choice-explanation: c
이는 인코더-디코더 계열(T5)의 방식이다.

## question: ai-written-01-q040
### solution
정답 근거: In-Context Learning은 추론 때 프롬프트만으로 과제를 알려 주는 방식이다. 풀이: 가중치는 그대로이고 예시 수가 늘면 입력이 길어져 컨텍스트 길이와 비용이 늘어난다. 흔한 실수: 예시를 주면 모델이 재학습된다고 생각한다.
### choice-explanation: c
예시가 늘면 입력 길이와 비용이 늘어난다.
### choice-explanation: b
가중치 갱신은 파인튜닝의 특징이다.
### choice-explanation: d
그 방식은 예시가 없는 Zero-shot CoT이다.
### choice-explanation: a
가중치 갱신 없이 프롬프트로만 수행한다.

## question: ai-written-01-q041
### solution
정답 근거: CNN은 지역성과 가중치 공유를 가진다. 풀이: 같은 필터가 이미지를 훑으며 같은 특징을 찾으므로 파라미터가 적고 위치가 바뀌어도 같은 특징을 잡는다. 흔한 실수: 이미지를 펼쳐 넣는 방식은 CNN이 아니라 FCN이라는 점을 놓친다.
### choice-explanation: d
CNN은 위치 변화에 비교적 강하다.
### choice-explanation: b
펼쳐 넣는 것은 FCN이며 공간 구조가 사라진다.
### choice-explanation: c
모든 픽셀을 연결하면 파라미터가 매우 많아진다.
### choice-explanation: a
가중치 공유와 공간 구조 보존이 핵심 장점이다.

## question: ai-written-01-q042
### solution
정답 근거: 파라미터 수는 $K^2 C_{in} C_{out} + C_{out}$이다. 풀이: $5 \times 5 \times 3 \times 16 = 1{,}200$에 편향 16개를 더해 1,216이다. 흔한 실수: 편향을 빼먹어 1,200으로 답하기 쉽다.
### choice-explanation: a
필터 가중치 1,200개와 편향 16개를 합한 값이다.
### choice-explanation: c
입력 채널 수를 곱하지 않은 값이다.
### choice-explanation: b
편향 16개를 포함하지 않았다.
### choice-explanation: d
커널 크기를 곱하지 않은 값이다.

## question: ai-written-01-q043
### solution
정답 근거: 출력 크기는 $\lfloor (W - K + 2P)/S \rfloor + 1$이다. 풀이: $(224 - 7 + 6)/2 = 111.5$의 내림 111에 1을 더해 112이다. 흔한 실수: 내림 후 1을 더하는 것을 잊거나 나눗셈을 올림하면 111이나 113이 나온다.
### choice-explanation: c
패딩을 잘못 적용한 값이다.
### choice-explanation: b
+1을 하지 않은 값이다.
### choice-explanation: a
식에 대입하면 내림한 111에 1을 더한 112이다.
### choice-explanation: d
나눗셈을 올림한 뒤 1을 더한 값이다.

## question: ai-written-01-q044
### solution
정답 근거: 곱셈 횟수는 출력 원소 수에 원소 하나당 곱셈 수를 곱한 값이다. 풀이: 출력 위치 $55 \times 55$마다 $3 \times 11 \times 11 \times 96$번 곱하므로 약 1.05억 회이다. 흔한 실수: 파라미터 수 34,944나 출력 메모리 바이트 수와 혼동한다.
### choice-explanation: c
이 값은 출력 메모리의 바이트 수에 가깝다.
### choice-explanation: a
위치별 곱셈 수에 출력 위치 수를 곱했다.
### choice-explanation: d
위치 수나 필터 수를 한 번 더 곱한 값이다.
### choice-explanation: b
이 값은 파라미터 수에 가깝다.

## question: ai-written-01-q045
### solution
정답 근거: 맥스 풀링은 구역의 최댓값만 남기는 연산이다. 풀이: 가중치가 없어 파라미터가 늘지 않고 해상도가 줄어 연산량이 감소하며 위치 변화에 둔감해진다. 흔한 실수: 풀링에도 학습 가중치가 있다고 오해한다.
### choice-explanation: a
파라미터 없이 크기를 줄이는 연산이다.
### choice-explanation: b
풀링은 채널 수를 바꾸지 않는다.
### choice-explanation: d
평균은 평균 풀링이며 맥스는 최댓값을 남긴다.
### choice-explanation: c
펼치는 것은 Flatten이다.

## question: ai-written-01-q046
### solution
정답 근거: AlexNet은 ILSVRC 2012에서 우승한 8층 CNN이다. 풀이: ReLU, 드롭아웃, GPU 학습이 딥러닝 확산의 계기가 되었다. 흔한 실수: 잔차 연결(ResNet)이나 깊이별 합성곱(MobileNet)과 시기를 혼동한다.
### choice-explanation: b
이는 ResNet의 특징이다.
### choice-explanation: a
AlexNet의 구조와 기법을 정확히 서술했다.
### choice-explanation: c
3x3 반복은 VGG이며 파라미터도 매우 많다.
### choice-explanation: d
이는 MobileNet의 특징이다.

## question: ai-written-01-q047
### solution
정답 근거: 3x3 두 층의 수용영역은 5x5와 같다. 풀이: 채널 수를 $C$로 두면 파라미터는 $18C^2$ 대 $25C^2$로 적고 층이 둘이라 ReLU가 한 번 더 쓰인다. 흔한 실수: 작은 필터를 쌓으면 수용영역이 줄어든다고 생각한다.
### choice-explanation: b
수용영역은 같은 크기이다.
### choice-explanation: a
수용영역은 같고 파라미터는 적다.
### choice-explanation: c
두 층 사이에 활성화가 들어간다.
### choice-explanation: d
파라미터가 오히려 줄어든다.

## question: ai-written-01-q048
### solution
정답 근거: 20층보다 56층 망의 학습 오차가 더 높은 degradation 문제가 있었다. 풀이: 잔차 연결로 항등 경로를 만들면 깊어져도 최소한 얕은 망 수준을 유지하기 쉽다. 흔한 실수: 과적합 해결용이라고 오해한다. 학습 오차 자체가 나빠지는 문제이다.
### choice-explanation: a
학습 오차가 깊이에 따라 커지는 것이 문제였다.
### choice-explanation: d
포화는 Sigmoid와 Tanh의 문제이다.
### choice-explanation: b
과적합은 학습 오차가 낮아지는 경우이다.
### choice-explanation: c
경량화는 MobileNet의 목적이다.

## question: ai-written-01-q049
### solution
정답 근거: 입력을 그대로 더하는 지름길이 있다. 풀이: 필요 없는 층은 $F(x) = 0$으로 학습하면 입력이 그대로 전달되므로 깊이를 늘려도 성능이 떨어지지 않기 쉽다. 흔한 실수: $F(x)$가 입력과 같아야 한다고 헷갈린다. 0에 가깝게 만들면 된다.
### choice-explanation: a
항등 매핑에서 출발하므로 최적화가 쉬워진다.
### choice-explanation: b
입력과 같게 만드는 것은 $F$가 아니라 지름길이 한다.
### choice-explanation: c
파라미터를 줄이는 구조가 아니다.
### choice-explanation: d
여전히 역전파로 학습한다.

## question: ai-written-01-q050
### solution
정답 근거: 일반 합성곱은 $9C^2HW$, 분리 합성곱은 $9CHW + C^2HW$이다. 풀이: 비율은 $\frac{9C^2}{9C + C^2} = \frac{9C}{9 + C}$이고 $C = 72$면 $648/81 = 8$이다. 흔한 실수: 채널이 매우 클 때의 극한값 9를 그대로 답하기 쉽다.
### choice-explanation: d
분리의 효과를 지나치게 작게 본 값이다.
### choice-explanation: a
식에 $C = 72$를 대입하면 정확히 8이다.
### choice-explanation: b
9는 $C$가 무한히 클 때의 극한값이다.
### choice-explanation: c
채널 수 자체를 비율로 착각한 값이다.

## question: ai-written-01-q051
### solution
정답 근거: 패치 수는 가로 패치 수와 세로 패치 수의 곱이다. 풀이: $224/16 = 14$이므로 $14 \times 14 = 196$개이다. 흔한 실수: 한 변의 패치 수 14만 답하거나 224를 그대로 쓴다.
### choice-explanation: d
한 변의 패치 수일 뿐 전체 수가 아니다.
### choice-explanation: b
이미지의 한 변 길이를 그대로 쓴 값이다.
### choice-explanation: a
가로 14개와 세로 14개를 곱했다.
### choice-explanation: c
$16 \times 16$과 혼동한 값이다.

## question: ai-written-01-q052
### solution
정답 근거: 학습 가능한 인코딩은 위치마다 벡터를 학습한다. 풀이: 패치 수가 달라지면 학습한 위치 벡터의 개수가 맞지 않아 새로 학습하거나 보간해야 한다. 흔한 실수: 사인파 인코딩이나 상대 위치 인코딩의 장단점과 섞어 기억한다.
### choice-explanation: a
최적화되는 대신 해상도 변화에 약하다.
### choice-explanation: d
상대 위치 방식의 특징이다.
### choice-explanation: c
고정 함수는 사인파 방식이다.
### choice-explanation: b
해상도 변화에 강한 쪽은 사인파나 상대 방식이다.

## question: ai-written-01-q053
### solution
정답 근거: ViT는 대규모 사전학습에서 강하지만 자료가 적으면 CNN보다 불리하다. 풀이: CNN은 지역성이 내장되어 적은 자료에도 잘 학습하고, ViT는 사전학습이나 DeiT 같은 증류로 보완한다. 흔한 실수: ViT가 항상 CNN보다 좋다고 일반화한다.
### choice-explanation: b
자료가 적으면 ViT가 CNN보다 못할 수 있다.
### choice-explanation: c
귀납 편향이 약해 자료가 적을수록 불리하다.
### choice-explanation: a
소규모 자료에서는 전이 학습이나 CNN이 안전하다.
### choice-explanation: d
자료 규모가 성능 차이를 만든다.

## question: ai-written-01-q054
### solution
정답 근거: Sigmoid는 입력이 매우 크거나 작으면 기울기가 거의 0이다. 풀이: 기울기 소실과 0 중심이 아닌 출력, 지수 계산 비용이 단점이며 은닉층 기본값으로는 ReLU가 쓰인다. 흔한 실수: Sigmoid와 ReLU의 문제를 서로 바꿔 기억한다.
### choice-explanation: d
계산이 단순한 것은 ReLU이다.
### choice-explanation: c
−1과 1 사이는 Tanh이며 Sigmoid는 0과 1 사이이다.
### choice-explanation: a
포화로 인한 기울기 소실이 가장 큰 문제이다.
### choice-explanation: b
음수를 0으로 만드는 것은 ReLU이다.

## question: ai-written-01-q055
### solution
정답 근거: ReLU는 음수 입력에서 출력과 기울기가 모두 0이다. 풀이: Leaky ReLU는 $\max(0.01x, x)$로 음수 구간에도 작은 기울기를 주어 뉴런이 완전히 죽지 않게 한다. 흔한 실수: Leaky ReLU가 항상 ReLU보다 낫다고 단정한다.
### choice-explanation: d
Leaky ReLU도 계산은 단순하며 목적이 다르다.
### choice-explanation: b
지수를 쓰는 쪽은 ELU이다.
### choice-explanation: c
양수 구간 기울기 1은 ReLU의 장점이다.
### choice-explanation: a
음수 구간의 작은 기울기가 핵심이다.

## question: ai-written-01-q056
### solution
정답 근거: 전처리는 학습과 검증과 운영에서 동일해야 한다. 풀이: 채널 순서가 바뀌면 색 정보가 뒤섞여 입력 분포가 달라지므로 같은 변환을 적용해야 한다. 흔한 실수: 원인이 모델이 아니라 입력 형식이라는 점을 놓친다.
### choice-explanation: b
초기화는 원인과 관계가 없고 성능을 더 떨어뜨린다.
### choice-explanation: a
전처리를 한 곳에서 관리하면 불일치를 막는다.
### choice-explanation: d
운영 입력을 평가에 반영하지 않은 보고이다.
### choice-explanation: c
해상도는 채널 순서 문제와 관계없다.

## question: ai-written-01-q057
### solution
정답 근거: 대칭성이 깨지지 않으면 뉴런들이 똑같이 갱신된다. 풀이: 같은 입력에 같은 출력과 기울기를 가지므로 층의 뉴런이 모두 같은 값으로 변하고 하나처럼 동작한다. 흔한 실수: 공정하게 시작하는 값이라 문제가 없다고 생각한다.
### choice-explanation: d
0 초기화는 오히려 결과가 항상 같다.
### choice-explanation: a
대칭성 때문에 학습이 되지 않는다.
### choice-explanation: b
0이면 활성값이 커지지 않는다.
### choice-explanation: c
학습률은 초기화와 무관하다.

## question: ai-written-01-q058
### solution
정답 근거: ReLU는 음수 입력을 0으로 만들어 출력 분산이 줄어든다. 풀이: Xavier($1/\sqrt{D_{in}}$)는 대칭 활성화에 맞추었고 ReLU에서는 분산을 2배로 보정한 He가 층을 거쳐도 활성 분포를 유지한다. 흔한 실수: Xavier와 He의 사용 대상을 바꿔 기억한다.
### choice-explanation: c
tanh에는 Xavier가 알맞다.
### choice-explanation: d
가중치를 매우 작게 하면 활성이 사라진다.
### choice-explanation: a
분산 보정의 방향과 크기가 모두 맞다.
### choice-explanation: b
ReLU는 분산을 줄이므로 보정은 키우는 방향이다.

## question: ai-written-01-q059
### solution
정답 근거: L1은 $\sum |w|$, L2는 $\sum w^2$을 벌점으로 쓴다. 풀이: 절댓값 벌점은 작은 가중치를 0으로 밀어내고 제곱 벌점은 모두를 비례해서 작게 만든다. 흔한 실수: L1과 L2의 이름과 효과를 서로 바꿔 기억한다.
### choice-explanation: a
L1은 희소한 해를, L2는 고른 감쇠를 만든다.
### choice-explanation: b
0으로 만드는 쪽은 L1이다.
### choice-explanation: c
두 벌점 식이 서로 바뀌어 있다.
### choice-explanation: d
벌점은 원래 손실에 더해 함께 줄인다.

## question: ai-written-01-q060
### solution
정답 근거: 드롭아웃은 학습 중에만 무작위로 뉴런을 끈다. 풀이: `eval()`은 드롭아웃과 배치 정규화를 평가 동작으로 바꾸므로 부르지 않으면 평가 중에도 뉴런이 무작위로 꺼진다. 흔한 실수: `no_grad()`가 평가 모드를 켜 준다고 오해한다. 둘은 역할이 다르다.
### choice-explanation: d
평가 모드에서는 보정 없이 그대로 사용한다.
### choice-explanation: b
`no_grad()`는 기울기 기록만 끄며 드롭아웃과 무관하다.
### choice-explanation: c
$p = 0$이면 아무 뉴런도 꺼지지 않는다.
### choice-explanation: a
평가 모드를 설정하지 않은 것이 원인이다.

## question: ai-written-01-q061
### solution
정답 근거: $\cos(\pi/2) = 0$이다. 풀이: $t = 50$이면 $\frac{\pi t}{T} = \frac{\pi}{2}$이므로 $\eta = 0.05 \times (1 + 0) = 0.05$이다. 흔한 실수: 코사인 값을 0.5로 잘못 계산해 0.075를 답하는 실수가 있다. 식에 대입해야 한다.
### choice-explanation: c
코사인 값을 −0.5로 잘못 계산한 값이다.
### choice-explanation: b
코사인 값을 0.5로 잘못 계산한 값이다.
### choice-explanation: d
학습률의 10분의 1로 잘못 줄인 값이다.
### choice-explanation: a
코사인이 0이 되는 지점이라 초기 학습률의 절반이다.

## question: ai-written-01-q062
### solution
정답 근거: 클래스가 $C$개이고 무작위 예측이면 손실은 약 $\ln C$이다. 풀이: $\ln 10 \approx 2.3$이므로 학습 전 손실이 크게 다르면 데이터나 손실 구현에 문제가 있는지 점검한다. 흔한 실수: 학습 전 손실이 0에 가까우면 좋다고 착각한다.
### choice-explanation: d
확률 $0.1$이 아니라 그 로그의 음수가 손실이다.
### choice-explanation: c
클래스 수와 같은 값이 아니다.
### choice-explanation: a
균등 확률 예측의 교차 엔트로피가 $\ln 10$이다.
### choice-explanation: b
학습 전에는 정답을 거의 못 맞히므로 0일 수 없다.

## question: ai-written-01-q063
### solution
정답 근거: 학습과 검증의 격차가 커지면 과적합 신호이다. 풀이: 학습 자료에는 점점 더 맞지만 일반화가 나빠지므로 일반화를 돕는 방법이 필요하다. 흔한 실수: 정확도가 아직 더 오를 수 있다고 학습을 계속한다.
### choice-explanation: c
0 초기화는 학습을 못 하게 만든다.
### choice-explanation: a
격차의 확대는 과적합이므로 규제가 알맞다.
### choice-explanation: d
학습률을 올려도 격차는 줄지 않는다.
### choice-explanation: b
큰 모델은 과적합을 더 키울 수 있다.

## question: ai-written-01-q064
### solution
정답 근거: 선형 프로빙은 학습 파라미터가 적고 과적합 위험이 낮다. 풀이: 백본의 표현을 그대로 쓰고 새 분류층만 학습하므로 빠르고 자료가 적어도 안정적이다. 흔한 실수: 자료가 적을수록 전체 파인튜닝이 유리하다고 생각한다.
### choice-explanation: b
전체 파인튜닝은 자원이 많이 들고 과적합 위험이 크다.
### choice-explanation: c
처음부터 학습하면 자료가 부족해 불리하다.
### choice-explanation: d
새 분류층은 학습이 필요하다.
### choice-explanation: a
자원과 자료가 적을 때 비용 대비 효과가 좋다.

## question: ai-written-01-q065
### solution
정답 근거: 사전학습은 방대한 텍스트로 다음 토큰을 예측하며 언어와 지식을 배우는 단계이다. 풀이: 사후학습은 지시를 따르고 안전하게 대화하도록 Instruction-tuning, RLHF, DPO 같은 방법으로 조정한다. 흔한 실수: 사전학습만 해도 지시를 잘 따른다고 생각한다.
### choice-explanation: b
사전학습은 라벨 없는 대규모 텍스트를 쓴다.
### choice-explanation: d
사후학습은 크기를 줄이는 단계가 아니다.
### choice-explanation: a
사람이 원하는 방식으로 답하도록 조정하는 것이 사후학습의 목적이다.
### choice-explanation: c
다음 토큰 예측이 사전학습의 목표이다.

## question: ai-written-01-q066
### solution
정답 근거: Instruction-tuning은 (지시문, 응답) 쌍을 쓰는 지도 파인튜닝이다. 풀이: 다양한 과제의 지시와 정답 응답으로 학습하면 새 지시에도 일반화한다. 흔한 실수: 자기지도 학습이라고 혼동한다. 정답 응답이 필요한 지도학습이다.
### choice-explanation: b
라벨 없는 텍스트는 사전학습 자료이다.
### choice-explanation: c
보상 모델은 RLHF의 단계이다.
### choice-explanation: a
지시와 응답 쌍의 지도학습이 핵심이다.
### choice-explanation: d
프롬프트만 바꾸는 것은 In-Context Learning이다.

## question: ai-written-01-q067
### solution
정답 근거: 지도학습 방식이라 정답 데이터의 품질과 양이 한계이다. 풀이: 사소한 오류와 치명적 오류를 같은 손실로 다루고, 사람이 쓴 정답이 최선이라는 보장도 없다. 흔한 실수: 새 과제 일반화가 안 된다고 오해한다. 일반화가 오히려 장점이다.
### choice-explanation: c
정답 데이터가 필요하고 비용이 든다.
### choice-explanation: d
보상 해킹은 RLHF의 문제이다.
### choice-explanation: b
새 과제로 일반화되는 것이 장점이다.
### choice-explanation: a
비용과 정답 수집 비용과 정답이 하나가 아닌 과제와 토큰 단위 손실이 대표 한계이다.

## question: ai-written-01-q068
### solution
정답 근거: 절대 점수는 사람마다 기준이 달라 노이즈가 크다. 풀이: 비교 자료로 보상 모델을 학습하고 그 점수를 높이는 방향으로 PPO로 모델을 최적화한다. 흔한 실수: 비교 자료가 보상 모델을 건너뛴다고 오해한다.
### choice-explanation: c
RLHF는 보상 모델을 학습한 뒤 강화학습을 쓴다.
### choice-explanation: b
순위도 사람이 정한다.
### choice-explanation: d
선호는 사람마다 다를 수 있다.
### choice-explanation: a
상대 비교가 더 일관된 선호 신호를 준다.

## question: ai-written-01-q069
### solution
정답 근거: RLHF의 한계는 보상 해킹, 환각, 보상 모델 과최적화이다. 풀이: 보상 점수만 올리는 편법을 학습하거나 도움이 되어 보이는 답을 만들다 사실이 아닌 내용을 말할 수 있다. 흔한 실수: RLHF를 하면 환각이 사라진다고 믿는다.
### choice-explanation: b
RLHF 후에도 환각은 남는다.
### choice-explanation: a
한계를 인정하고 검증을 요구하는 설명이다.
### choice-explanation: d
사람의 선호는 일관되지 않을 수 있다.
### choice-explanation: c
어느 시점부터는 실제 선호가 떨어질 수 있다.

## question: ai-written-01-q070
### solution
정답 근거: DPO는 RLHF의 보상 모델과 RL 단계를 없앤 방법이다. 풀이: 비교 자료의 선호 응답 확률을 높이는 손실로 직접 학습하므로 단순하고 안정적이다. 흔한 실수: RLVR과 DPO를 혼동한다. 자동 검증은 RLVR이다.
### choice-explanation: c
DPO는 선호 비교 자료가 필요하다.
### choice-explanation: a
보상 모델과 RL 없이 선호 자료로 직접 최적화한다.
### choice-explanation: d
DPO는 보상 모델을 따로 두지 않는다.
### choice-explanation: b
정답을 자동 검증하는 방식은 RLVR이다.

## question: ai-written-01-q071
### solution
정답 근거: RLVR은 정답을 코드나 규칙으로 검증할 수 있는 문제에서 쓴다. 풀이: 맞으면 1, 틀리면 0의 보상을 자동으로 주므로 사람 피드백이 필요 없다. 흔한 실수: 주관적 선호 과제에도 그대로 적용할 수 있다고 생각한다.
### choice-explanation: a
자동 검증이 가능한 과제가 적용 조건이다.
### choice-explanation: c
취향은 정답이 없는 주관적 선호이다.
### choice-explanation: b
문체의 자연스러움은 자동 검증이 어렵다.
### choice-explanation: d
친절함은 사람의 판단이 필요하다.

## question: ai-written-01-q072
### solution
정답 근거: RAG는 추론 때 외부 저장소에서 문서를 검색해 답을 생성한다. 풀이: 지식 갱신이 저장소 업데이트로 끝나고 출처를 보여 줄 수 있어 자주 바뀌는 지식에 알맞다. 흔한 실수: RAG가 가중치를 업데이트한다고 오해한다.
### choice-explanation: b
가중치 학습은 파인튜닝의 방식이다.
### choice-explanation: a
갱신이 쉽고 출처를 제공할 수 있다는 두 이점이 정확하다.
### choice-explanation: c
RAG는 오히려 검색 단계를 추가한다.
### choice-explanation: d
지식을 파라미터에 담지 않고 저장소에서 가져온다.

## question: ai-written-01-q073
### solution
정답 근거: 원인이 검색 단계이면 생성 모델을 바꿔도 해결되지 않는다. 풀이: 무관하거나 낡은 문서가 컨텍스트에 섞이면 환각이 늘므로 검색 대상과 필터를 바로잡아야 한다. 흔한 실수: 답이 틀리면 생성 모델 탓이라고 생각해 모델부터 바꾼다.
### choice-explanation: c
차원을 줄이면 오히려 의미 구분이 약해진다.
### choice-explanation: d
근거 문서를 빼면 환각이 늘어난다.
### choice-explanation: a
원인과 같은 층위인 검색 단계를 고친다.
### choice-explanation: b
검색 문제를 더 큰 생성 모델로 해결하려는 층위 착오이다.

## question: ai-written-01-q074
### solution
정답 근거: Sparse는 용어 일치에, Dense는 의미 유사도에 강하다. 풀이: 정확한 코드나 고유명사는 임베딩 공간에서 다른 문서와 섞일 수 있어 단어 일치 기반 검색이 안정적이다. 흔한 실수: Dense가 모든 면에서 Sparse보다 낫다고 생각한다.
### choice-explanation: b
정확 일치가 약해 누락이 생길 수 있다.
### choice-explanation: d
동의어에 강한 쪽은 Dense이다.
### choice-explanation: c
정확한 키워드 매칭은 Sparse의 강점이다.
### choice-explanation: a
정확 일치에는 Sparse를, 의미 검색에는 Dense를 쓰고 섞기도 한다.

## question: ai-written-01-q075
### solution
정답 근거: $w = tf \times \log(N/df)$이다. 풀이: 모든 문서에 나오면 $df \approx N$이어서 $\log 1 = 0$에 가까워지고 곱한 가중치가 작다. 흔한 실수: TF만 보고 많이 나오면 중요하다고 판단한다.
### choice-explanation: c
$N$이 커지면 희귀한 단어의 IDF가 커진다.
### choice-explanation: a
IDF가 흔한 단어를 걸러 내는 역할을 한다.
### choice-explanation: d
위치가 아닌 빈도와 문서 분포가 기준이다.
### choice-explanation: b
흔한 단어도 TF는 크다. 작은 쪽은 IDF이다.

## question: ai-written-01-q076
### solution
정답 근거: Bi-encoder는 문서 벡터를 미리 계산해 빠르다. 풀이: Cross-encoder는 쿼리와 문서를 함께 입력해 정확하지만 쌍마다 계산해 느리므로 소수 후보에 쓴다. 흔한 실수: Cross-encoder를 대규모 1차 검색에 쓰는 실수가 흔하다.
### choice-explanation: b
수백만 문서를 Cross-encoder로 훑으면 너무 느리다.
### choice-explanation: d
Bi-encoder는 문서 벡터를 미리 계산해 대규모에 적합하다.
### choice-explanation: c
한 번에 함께 입력하는 쪽은 Cross-encoder뿐이다.
### choice-explanation: a
속도는 Bi, 정확도는 Cross라는 분업이다.

## question: ai-written-01-q077
### solution
정답 근거: 대조 학습은 정답 쌍을 가깝게, 오답 쌍을 멀게 한다. 풀이: 정답 문서와 쿼리의 거리는 줄이고 부정 예시와의 거리는 키워 검색 공간을 만든다. 흔한 실수: 문서를 이어 붙여 점수를 내는 Cross-encoder 방식과 혼동한다.
### choice-explanation: d
이어 붙여 점수를 내는 방식은 Cross-encoder이다.
### choice-explanation: c
멀게 하는 부정 예시가 빠졌다.
### choice-explanation: b
모두 같게 만들면 구분이 불가능하다.
### choice-explanation: a
가깝게와 멀게의 두 방향이 모두 서술되었다.

## question: ai-written-01-q078
### solution
정답 근거: 에이전트는 환경을 관찰하고 행동하고 결과를 반영하는 반복 루프를 가진다. 풀이: 점진적인 상호작용이 있어야 하므로 단발성 검색과 생성은 대체로 에이전트로 보지 않는다. 흔한 실수: 추론을 잘하면 에이전트라고 생각한다. 환경과의 상호작용이 기준이다.
### choice-explanation: a
관찰과 행동의 반복이 에이전트의 특징이다.
### choice-explanation: c
외부 환경과의 상호작용이 없다.
### choice-explanation: b
단발성 RAG는 반복 상호작용이 없다.
### choice-explanation: d
LLM 에이전트의 특징인 추론과 행동 반복이 없다.

## question: ai-written-01-q079
### solution
정답 근거: Controller는 두뇌, Tool Set은 도구 모음, Perceiver는 환경 요약기이다. 풀이: Perceiver가 환경 피드백을 요약해 Controller에 전달하면 Controller가 다음 계획을 정한다. 흔한 실수: 구성요소의 역할을 서로 바꿔 기억한다.
### choice-explanation: a
세 구성요소의 역할이 모두 정확하다.
### choice-explanation: b
계획은 Controller가 세우고 실행은 환경에서 이루어진다.
### choice-explanation: c
환경은 Environment이며 역할이 뒤섞였다.
### choice-explanation: d
각 구성요소의 역할은 다르다.

## question: ai-written-01-q080
### solution
정답 근거: 도구는 LLM 외부 프로그램에 연결된 함수 인터페이스이다. 풀이: 텍스트 생성 모드에서 호출을 만들고 실행 모드에서 도구가 동작한 뒤 결과 텍스트가 다시 LLM에 들어간다. 흔한 실수: LLM이 도구를 직접 실행한다고 오해한다.
### choice-explanation: b
LLM은 호출을 생성할 뿐이다.
### choice-explanation: d
결과가 입력으로 돌아와야 답을 이어 간다.
### choice-explanation: c
프롬프트로도 도구 사용을 유도할 수 있다.
### choice-explanation: a
호출 생성과 실행 주체의 분리가 정확하다.

## question: ai-written-01-q081
### solution
정답 근거: MCP는 내부 데이터 계층과 외부 전송 계층으로 나뉜다. 풀이: 메시지 내용과 형식은 Data Layer, 실제 연결과 전달은 Transport Layer의 몫이다. 흔한 실수: 두 계층의 역할을 바꿔 말하는 선지가 자주 나온다.
### choice-explanation: b
통신 채널은 Transport Layer의 역할이다.
### choice-explanation: d
인증은 Transport Layer이며 프롬프트 설계는 해당 없다.
### choice-explanation: a
역할 구분이 정확하다.
### choice-explanation: c
실행은 서버가 하며 계층의 역할이 아니다.

## question: ai-written-01-q082
### solution
정답 근거: MCP는 도구 연결을 표준화한 프로토콜이다. 풀이: 표준 규약 덕분에 같은 도구를 여러 모델과 플랫폼에서 다시 정의하지 않고 재사용할 수 있다. 흔한 실수: Client와 Server의 역할을 서로 바꿔 기억한다.
### choice-explanation: b
도구를 제공하는 쪽은 Server이다.
### choice-explanation: d
MCP는 호환성을 높이려는 표준화 프로토콜이다.
### choice-explanation: a
세 구성의 관계와 제공 주체가 정확하다.
### choice-explanation: c
Host는 여러 Client를 관리한다.

## question: ai-written-01-q083
### solution
정답 근거: ReAct는 매 단계 관찰에 맞춰 도구 하나를 고르는 국소 계획이다. 풀이: 환경이 변하면 처음 세운 전체 계획이 어긋나므로 단계마다 상황에 적응하는 방식이 유리하다. 흔한 실수: 전역 계획이 항상 더 좋다고 일반화한다.
### choice-explanation: a
상황 적응이 필요한 환경에는 국소 계획이 알맞다.
### choice-explanation: d
실패에서 배우는 방식은 Reflexion이다.
### choice-explanation: b
환경이 바뀌면 전체 계획이 실패할 수 있다.
### choice-explanation: c
환경이 불확실하면 계획이 오히려 중요하다.

## question: ai-written-01-q084
### solution
정답 근거: 문서를 조각내고 벡터로 바꿔 저장한 뒤 질문 때 검색해 생성한다. 풀이: 청킹은 컨텍스트 창에 맞는 조각으로 나누는 단계이고 조각을 벡터로 바꿔야 유사도 검색이 가능하다. 흔한 실수: 임베딩을 하기 전에 저장하거나 생성 후에 검색하는 순서 오류가 있다.
### choice-explanation: d
저장은 불러오기와 임베딩 이후에 한다.
### choice-explanation: c
검색 결과 없이 생성부터 할 수 없다.
### choice-explanation: a
각 단계가 의존 순서대로 놓여 있다.
### choice-explanation: b
문서가 없는 상태에서 임베딩할 수 없다.

## question: ai-written-01-q085
### solution
정답 근거: 십진수를 2로 나눈 나머지를 거꾸로 읽거나 2의 거듭제곱의 합으로 쓴다. 풀이: $47 = 32 + 8 + 4 + 2 + 1$이므로 $101111_2$이다. 흔한 실수: 한 자리를 빼먹거나 자리 가중치를 틀리게 더하는 실수가 있다.
### choice-explanation: c
$32 + 16 + 4 + 2 + 1 = 55$이다.
### choice-explanation: b
$32 + 8 + 2 + 1 = 43$이다.
### choice-explanation: d
$32 + 4 + 2 + 1 = 39$이다.
### choice-explanation: a
$32 + 8 + 4 + 2 + 1 = 47$이다.

## question: ai-written-01-q086
### solution
정답 근거: 각 자리는 16의 거듭제곱 가중치를 가진다. 풀이: $4 \times 256 + 10 \times 16 + 15 = 1024 + 160 + 15 = 1199$이다. 흔한 실수: `A`를 11로 읽거나 마지막 자리를 15가 아닌 14로 읽는 실수가 있다.
### choice-explanation: b
마지막 자리를 15가 아닌 14로 계산한 값이다.
### choice-explanation: a
A는 10이고 F는 15이다.
### choice-explanation: c
A를 11이 아니라 다른 값으로 잘못 계산해 구한 값이다.
### choice-explanation: d
자리 가중치를 잘못 곱한 값이다.

## question: ai-written-01-q087
### solution
정답 근거: 2의 보수는 0이 하나이고 음수가 하나 더 많다. 풀이: 최상위 비트를 부호로 쓰고 나머지로 크기를 나타내며 4비트는 $-8$에서 $7$까지이다. 흔한 실수: 부호-크기 방식의 대칭 범위와 혼동한다.
### choice-explanation: d
비트 수가 한 개 더 필요한 범위이다.
### choice-explanation: b
부호-크기 방식의 범위이며 0이 두 개이다.
### choice-explanation: c
부호 없는 정수의 범위이다.
### choice-explanation: a
0이 하나라 음수 쪽이 하나 더 표현된다.

## question: ai-written-01-q088
### solution
정답 근거: 부호가 같은 두 수를 더했는데 결과 부호가 바뀌면 오버플로이다. 풀이: $6 + 3 = 9$는 4비트 범위(−8~7)를 벗어나 $1001_2 = -7$이 되므로 오버플로이다. 흔한 실수: 비트열만 보고 9로 읽는 실수가 있다.
### choice-explanation: d
실제 합의 비트열은 $1001_2$이다.
### choice-explanation: c
올림을 버려도 합의 비트는 $1001_2$이며 정상이 아니다.
### choice-explanation: b
4비트로는 +9를 표현할 수 없어 부호 비트가 바뀐다.
### choice-explanation: a
표현 범위를 넘어 부호 비트가 바뀌었다.

## question: ai-written-01-q089
### solution
정답 근거: FP32는 32비트를 1, 8, 23으로 나눈다. 풀이: 지수는 바이어스를 더해 저장하며 FP32의 바이어스는 $2^{7} - 1 = 127$이다. 흔한 실수: FP64나 BF16과 비트 구성을 섞어 기억한다.
### choice-explanation: b
FP64의 구성이다.
### choice-explanation: d
BF16의 구성이다.
### choice-explanation: a
FP32의 구성과 바이어스가 모두 맞다.
### choice-explanation: c
FP16의 구성이다.

## question: ai-written-01-q090
### solution
정답 근거: 값은 $(-1)^S \times 1.f \times 2^{E-127}$이다. 풀이: 지수 `10000000`은 128이므로 $E - 127 = 1$이고 가수 $1.1_2 = 1.5$이므로 $1.5 \times 2 = 3.0$이다. 흔한 실수: 숨은 비트 1을 빼먹거나 바이어스를 빼지 않는 실수가 있다.
### choice-explanation: a
$1.5 \times 2^1 = 3$이다.
### choice-explanation: d
바이어스를 한 번 덜 뺀 값이다.
### choice-explanation: c
지수를 적용하지 않은 가수 값이다.
### choice-explanation: b
숨은 비트를 더하지 않고 계산한 값이다.

## question: ai-written-01-q091
### solution
정답 근거: BF16은 1/8/7, FP16은 1/5/10 비트 구성이다. 풀이: 지수 8비트라 FP32와 범위가 같아 넘침이 적고 가수 7비트라 정밀도는 FP16의 10비트보다 낮다. 흔한 실수: BF16이 FP16의 정밀도를 높인 형식이라고 오해한다.
### choice-explanation: a
범위는 넓고 정밀도는 낮다는 특징이 정확하다.
### choice-explanation: c
지수는 8비트와 5비트로 다르다.
### choice-explanation: b
범위가 넓고 정밀도가 낮다는 점이 반대로 서술되었다.
### choice-explanation: d
BF16은 부동소수점 형식이다.

## question: ai-written-01-q092
### solution
정답 근거: 양자화는 값의 표현 정밀도를 낮추는 기법이다. 풀이: $q = \mathrm{round}(x/s) + z$로 변환하고 $\hat{x} = s(q - z)$로 복원하며 오차가 생긴다. 흔한 실수: 가지치기나 증류, LoRA와 개념을 섞는다.
### choice-explanation: b
작은 가중치를 제거하는 것은 가지치기이다.
### choice-explanation: a
비트 수를 줄이는 것이 양자화의 정의이다.
### choice-explanation: d
저랭크 행렬 학습은 LoRA이다.
### choice-explanation: c
출력을 모방하는 것은 지식 증류이다.

## question: ai-written-01-q093
### solution
정답 근거: 대칭 양자화는 영점이 0이고 $q = \mathrm{round}(x/s)$이다. 풀이: $s = 2.54/127 = 0.02$이므로 $1.0 / 0.02 = 50$이다. 흔한 실수: 스케일을 곱하거나 최댓값 자체와 혼동한다.
### choice-explanation: b
127은 최댓값 2.54가 변환되는 값이다.
### choice-explanation: a
스케일로 나눈 값을 반올림한 결과이다.
### choice-explanation: c
스케일을 잘못 계산해 2배로 얻은 값이다.
### choice-explanation: d
스케일을 잘못 계산해 절반으로 얻은 값이다.

## question: ai-written-01-q094
### solution
정답 근거: PTQ는 학습 후 양자화, QAT는 양자화 인식 학습이다. 풀이: 큰 모델에서는 재학습 비용이 크므로 PTQ가 현실적이고, 정확도 손실이 크면 QAT를 검토한다. 흔한 실수: PTQ도 전체 재학습이 필요하다고 생각한다.
### choice-explanation: b
QAT는 학습 자료와 비용이 필요하다.
### choice-explanation: d
PTQ는 재학습이 필요 없다.
### choice-explanation: c
QAT는 학습 자료와 비용이 필요하다.
### choice-explanation: a
재학습이 필요 없다는 PTQ의 특징이 정확하다.

## question: ai-written-01-q095
### solution
정답 근거: 비구조적 가지치기는 개별 가중치를 제거한다. 풀이: 구조가 불규칙하면 밀집 행렬곱을 그대로 쓰므로 속도가 줄지 않고 전용 하드웨어나 희소 형식이 필요하다. 흔한 실수: 비율만 높으면 무조건 빨라진다고 생각한다.
### choice-explanation: b
비트 수를 줄이는 것은 양자화이다.
### choice-explanation: c
희소 행렬은 GPU에서 밀집보다 빠르지 않은 경우가 많다.
### choice-explanation: d
가지치기는 가중치를 줄이는 기법이다.
### choice-explanation: a
불규칙한 희소성이 GPU에서 이득이 작은 이유이다.

## question: ai-written-01-q096
### solution
정답 근거: 구조적 가지치기는 채널, 필터, 블록을 단위로 한다. 풀이: 남은 구조가 규칙적이라 밀집 연산을 그대로 쓸 수 있지만 단위가 크므로 정확도 손실이 커 비율을 낮게 잡는다. 흔한 실수: 구조적과 비구조적의 장단점을 바꿔 기억한다.
### choice-explanation: a
규칙적인 구조와 낮은 제거 비율이라는 장단점이 정확하다.
### choice-explanation: d
비트 수 감소는 양자화이다.
### choice-explanation: b
개별 가중치 단위는 비구조적 방식이다.
### choice-explanation: c
보통 정확도 회복을 위해 재학습한다.

## question: ai-written-01-q097
### solution
정답 근거: 학생은 정답과 선생님의 출력을 함께 배운다. 풀이: 온도를 넣은 소프트맥스로 부드러운 확률을 만들어 정답 외 클래스 사이의 유사도 정보까지 전달한다. 흔한 실수: 선생님이 클수록 무조건 좋다고 생각한다. 격차가 크면 조교 모델이 필요하다.
### choice-explanation: a
정답 손실과 증류 손실의 합이다.
### choice-explanation: c
일반적으로 정답 손실도 함께 쓴다.
### choice-explanation: b
가중치 복사가 아니라 출력을 모방한다.
### choice-explanation: d
격차가 너무 크면 학생 성능이 떨어질 수 있다.

## question: ai-written-01-q098
### solution
정답 근거: PEFT는 일부 파라미터만 학습하는 방법이다. 풀이: Adapter, Prompt tuning, LoRA가 대표적이며 학습 파라미터가 적어 메모리와 저장 비용이 작다. 흔한 실수: 전체 파인튜닝이 기존 지식을 그대로 유지한다고 생각한다.
### choice-explanation: b
가중치를 고정하고 프롬프트만 쓰는 것은 In-Context 학습이다.
### choice-explanation: d
항상 더 정확하다는 보장은 없다.
### choice-explanation: a
전체 파인튜닝의 부담과 PEFT의 방식을 정확히 구분했다.
### choice-explanation: c
PEFT는 일부만 학습한다.

## question: ai-written-01-q099
### solution
정답 근거: LoRA의 학습 파라미터는 $r(d + k)$이다. 풀이: $16 \times (4096 + 4096) = 131{,}072$이다. 흔한 실수: 원래 가중치 수 $d \times k$를 그대로 답하거나 $d + k$ 대신 한 변만 쓰는 실수가 있다.
### choice-explanation: b
원래 가중치 전체 수 $4096^2$이다.
### choice-explanation: d
$r \times (d + k)$를 두 배로 계산한 값이다.
### choice-explanation: a
두 행렬의 원소 수 $dr + rk$를 합했다.
### choice-explanation: c
한 행렬 $r \times 4096$만 센 값이다.

## question: ai-written-01-q100
### solution
정답 근거: QLoRA는 양자화된 베이스 모델에 LoRA를 더한 방식이다. 풀이: 베이스 메모리를 줄여 단일 GPU로도 큰 모델을 튜닝하고 `target_modules`로 어댑터 위치를, `r`로 표현력을 정한다. 흔한 실수: `r`이 클수록 파라미터가 줄어든다고 거꾸로 생각한다.
### choice-explanation: b
QLoRA는 베이스를 양자화한다.
### choice-explanation: a
베이스 모델의 양자화와 어댑터 학습이 QLoRA의 핵심이다.
### choice-explanation: d
`r`이 커지면 표현력과 파라미터가 늘어난다.
### choice-explanation: c
어댑터를 학습하는 것이 핵심이다.
