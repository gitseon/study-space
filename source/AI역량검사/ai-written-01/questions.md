## question: ai-written-01-q001
```json
{
  "title": "AI이지만 ML은 아닌 시스템",
  "topics": [
    "ml"
  ],
  "tags": [
    "ai-ml-dl"
  ],
  "group": "ml",
  "type": "mc",
  "id": "ai-written-01-q001",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/1-1_AI기계학습기초.md AI, ML, DL의 정의"
  ],
  "difficulty": 1,
  "correctChoiceId": "a"
}
```
### stem
다음 중 AI에 속하지만 기계학습(ML)에는 속하지 않는 시스템은?
### choice: b
과거 판매 기록으로 수요를 예측하는 회귀 모델
### choice: a
사람이 작성한 규칙으로 불량을 판정하는 검사 프로그램
### choice: c
이미지 자료로 학습한 합성곱 신경망 분류기
### choice: d
시청 기록으로 영상을 추천하도록 학습한 모델

## question: ai-written-01-q002
```json
{
  "title": "AI와 ML과 DL의 포함관계",
  "topics": [
    "ml"
  ],
  "tags": [
    "ai-ml-dl"
  ],
  "group": "ml",
  "type": "mc",
  "id": "ai-written-01-q002",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/1-1_AI기계학습기초.md AI, ML, DL의 정의"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
AI, ML, DL의 관계를 바르게 설명한 것은?
### choice: b
ML은 AI의 상위 개념이며 DL은 ML과 별개의 분야이다
### choice: c
DL은 규칙 기반 AI의 한 종류라서 데이터 학습이 필요 없다
### choice: d
AI는 ML을 포함하지만 DL은 ML에 속하지 않는다
### choice: a
DL은 신경망을 쓰는 ML이고 ML은 AI에 포함된다

## question: ai-written-01-q003
```json
{
  "title": "스팸 분류에서 Label",
  "topics": [
    "ml"
  ],
  "tags": [
    "feature-label"
  ],
  "group": "ml",
  "type": "mc",
  "id": "ai-written-01-q003",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/1-1_AI기계학습기초.md 데이터 구성요소"
  ],
  "difficulty": 1,
  "correctChoiceId": "a"
}
```
### stem
메일 제목의 단어 빈도로 스팸 여부를 예측하는 모델에서 Label에 해당하는 것은?
### choice: c
메일을 보낸 사람의 주소 정보
### choice: a
스팸인지 아닌지를 나타내는 값
### choice: b
메일 제목에 나타난 단어의 빈도
### choice: d
학습 후에 얻어진 가중치 값

## question: ai-written-01-q004
```json
{
  "title": "측정 오차 항의 의미",
  "topics": [
    "ml"
  ],
  "tags": [
    "feature-label"
  ],
  "group": "ml",
  "type": "mc",
  "id": "ai-written-01-q004",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/1-1_AI기계학습기초.md 데이터 구성요소"
  ],
  "difficulty": 1,
  "correctChoiceId": "a"
}
```
### stem
데이터를 $y = f(X) + \epsilon$로 볼 때 $\epsilon$에 대한 설명으로 옳은 것은?
### choice: a
측정 오차처럼 학습으로도 줄일 수 없는 오차이다
### choice: d
모델이 선택한 손실 함수의 값을 나타낸다
### choice: b
학습을 오래 하면 0까지 줄일 수 있는 오차이다
### choice: c
입력 변수들 사이의 상관 정도를 나타낸다

## question: ai-written-01-q005
```json
{
  "title": "회귀 문제의 판별",
  "topics": [
    "ml"
  ],
  "tags": [
    "regression-classification"
  ],
  "group": "ml",
  "type": "mc",
  "id": "ai-written-01-q005",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/1-1_AI기계학습기초.md 회귀와 분류"
  ],
  "difficulty": 1,
  "correctChoiceId": "a"
}
```
### stem
다음 중 회귀 문제에 해당하는 것은?
### choice: a
다음 달 웨이퍼 수율을 퍼센트 값으로 예측한다
### choice: c
고객을 세 개의 등급 중 하나로 분류한다
### choice: b
웨이퍼가 불량인지 정상인지 판정한다
### choice: d
메일이 스팸인지 아닌지 판정한다

## question: ai-written-01-q006
```json
{
  "title": "R제곱의 의미",
  "topics": [
    "ml"
  ],
  "tags": [
    "regression-metrics"
  ],
  "group": "ml",
  "type": "mc",
  "id": "ai-written-01-q006",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/1-2_AI기계학습방법론.md 모델 평가"
  ],
  "difficulty": 1,
  "correctChoiceId": "a"
}
```
### stem
회귀 평가지표 $R^2$에 대한 설명으로 옳은 것은?
### choice: c
예측 오차를 제곱해 평균한 값이며 원래 자료와 같은 단위를 가진다
### choice: d
값이 클수록 모델이 평균 예측보다 오차가 크다는 뜻이다
### choice: a
평균으로만 예측할 때보다 얼마나 잘 설명하는지를 나타내며 음수도 가능하다
### choice: b
항상 0과 1 사이이며 평균보다 못한 모델도 0이 된다

## question: ai-written-01-q007
```json
{
  "title": "MSE 계산",
  "topics": [
    "ml"
  ],
  "tags": [
    "regression-metrics"
  ],
  "group": "ml",
  "type": "mc",
  "id": "ai-written-01-q007",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/1-2_AI기계학습방법론.md 모델 평가"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
실제값 $[3, 5, 7]$과 예측값 $[2, 5, 9]$의 MSE는?
### choice: b
약 1.29
### choice: a
약 1.67
### choice: d
5.00
### choice: c
1.00

## question: ai-written-01-q008
```json
{
  "title": "재현율 계산",
  "topics": [
    "ml"
  ],
  "tags": [
    "classification-metrics"
  ],
  "group": "ml",
  "type": "mc",
  "id": "ai-written-01-q008",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/1-2_AI기계학습방법론.md 모델 평가"
  ],
  "difficulty": 1,
  "correctChoiceId": "a"
}
```
### stem
혼동행렬에서 TP=40, FP=10, FN=20, TN=130일 때 양성 기준 재현율은?
### choice: d
약 0.33
### choice: c
0.85
### choice: a
약 0.67
### choice: b
0.80

## question: ai-written-01-q009
```json
{
  "title": "불균형 자료에서의 정확도",
  "topics": [
    "ml"
  ],
  "tags": [
    "classification-metrics"
  ],
  "group": "ml",
  "type": "mc",
  "id": "ai-written-01-q009",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/1-2_AI기계학습방법론.md 모델 평가"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
불량률이 1%인 공정에서 모든 제품을 정상으로 예측하는 모델의 정확도가 99%이다. 이 모델에 대한 평가로 옳은 것은?
### choice: c
정밀도가 1이므로 불량 판정은 모두 맞다
### choice: b
정확도가 높으므로 불량 탐지 성능도 높다
### choice: a
재현율이 0이어서 불량을 하나도 찾지 못한다
### choice: d
교차 엔트로피가 99%이므로 우수한 모델이다

## question: ai-written-01-q010
```json
{
  "title": "ROC 곡선과 AUC",
  "topics": [
    "ml"
  ],
  "tags": [
    "roc-auc"
  ],
  "group": "ml",
  "type": "mc",
  "id": "ai-written-01-q010",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/1-2_AI기계학습방법론.md 모델 평가"
  ],
  "difficulty": 1,
  "correctChoiceId": "a"
}
```
### stem
ROC 곡선과 AUC에 대한 설명으로 옳은 것은?
### choice: c
학습 에폭에 따른 손실의 변화를 그린 곡선이며 AUC는 손실의 평균이다
### choice: b
가로축이 정밀도, 세로축이 재현율인 곡선이며 AUC가 클수록 좋다
### choice: d
AUC가 0.5이면 완벽하게 분류하며 1이면 무작위 수준이라는 뜻이다
### choice: a
임계값을 바꾸며 FPR과 TPR을 그린 곡선이고 AUC가 클수록 좋다

## question: ai-written-01-q011
```json
{
  "title": "과적합의 신호",
  "topics": [
    "ml"
  ],
  "tags": [
    "overfitting"
  ],
  "group": "ml",
  "type": "mc",
  "id": "ai-written-01-q011",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/1-1_AI기계학습기초.md 과적합"
  ],
  "difficulty": 1,
  "correctChoiceId": "a"
}
```
### stem
학습 오차는 매우 낮은데 검증 오차는 높게 나타나는 상태와 대응으로 알맞은 것은?
### choice: c
정상 상태이므로 검증 오차와 무관하게 그대로 배포한다
### choice: a
과적합이므로 데이터 추가나 정규화나 조기 종료를 쓴다
### choice: d
학습률이 너무 작은 것이므로 에폭만 더 늘려 학습한다
### choice: b
과소적합이므로 층을 줄이고 더 단순한 모델로 바꾼다

## question: ai-written-01-q012
```json
{
  "title": "분포 변화와 과적합의 구분",
  "topics": [
    "ml"
  ],
  "tags": [
    "overfitting"
  ],
  "group": "ml",
  "type": "mc",
  "id": "ai-written-01-q012",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/1-1_AI기계학습기초.md 과적합"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
센서를 교체한 뒤 검사 모델의 정확도가 떨어졌다. 교체 전 학습과 검증 성능은 모두 좋았다. 가장 알맞은 해석은?
### choice: b
모델이 과적합되었으므로 층을 더 쌓아 표현력을 키워야 한다
### choice: d
검증 성능이 좋았으므로 원인은 입력 데이터와 무관하다고 본다
### choice: c
과소적합이므로 학습 에폭만 늘리면 해결된다고 해석한다
### choice: a
분포가 달라졌으므로 새 데이터를 모으거나 적응시켜야 한다

## question: ai-written-01-q013
```json
{
  "title": "층화 분할의 효과",
  "topics": [
    "ml"
  ],
  "tags": [
    "data-split"
  ],
  "group": "ml",
  "type": "mc",
  "id": "ai-written-01-q013",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/1-1_AI기계학습기초.md 학습과 검증 자료의 분할"
  ],
  "difficulty": 1,
  "correctChoiceId": "a"
}
```
### stem
클래스 비율이 9 대 1인 자료를 학습용과 검증용으로 나눌 때 층화(stratify)를 쓰면 얻는 효과는?
### choice: d
검증 자료로도 모델을 학습해 데이터 낭비가 줄어든다
### choice: a
두 자료의 클래스 비율이 원본과 비슷하게 유지된다
### choice: c
행의 원래 순서가 보존되어 시간 순서를 지킨다
### choice: b
소수 클래스를 복제해 두 클래스의 개수가 같아진다

## question: ai-written-01-q014
```json
{
  "title": "표준화 시 데이터 누수",
  "topics": [
    "ml"
  ],
  "tags": [
    "data-split"
  ],
  "group": "ml",
  "type": "mc",
  "id": "ai-written-01-q014",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/1-1_AI기계학습기초.md 학습과 검증 자료의 분할"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
표준화를 적용하는 올바른 절차는?
### choice: c
표준화는 학습에만 쓰고 검증과 예측에서는 생략한다
### choice: d
학습 자료와 검증 자료를 합쳐 평균과 표준편차를 구한다
### choice: a
학습 자료로 평균과 표준편차를 구하고 검증 자료에도 그 값을 적용한다
### choice: b
검증 자료의 평균과 표준편차를 따로 구해 검증 자료에 적용한다

## question: ai-written-01-q015
```json
{
  "title": "다중회귀 계수의 해석",
  "topics": [
    "ml"
  ],
  "tags": [
    "linear-regression"
  ],
  "group": "ml",
  "type": "mc",
  "id": "ai-written-01-q015",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/1-2_AI기계학습방법론.md 선형회귀"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
다중선형회귀에서 $\beta_1 = 0.05$일 때 해석으로 옳은 것은?
### choice: d
$X_1$이 1 늘면 $Y$는 측정 오차와 상관없이 언제나 정확히 0.05 늘어난다
### choice: c
다른 변수와 관계없이 $X_1$이 $Y$의 원인이라고 해석한다
### choice: a
다른 변수를 고정하면 $X_1$이 1 늘 때 $Y$의 평균이 0.05 늘어난다
### choice: b
$X_1$이 1퍼센트 늘면 $Y$가 5퍼센트 늘어난다고 해석한다

## question: ai-written-01-q016
```json
{
  "title": "유의하지 않은 변수의 해석",
  "topics": [
    "ml"
  ],
  "tags": [
    "linear-regression"
  ],
  "group": "ml",
  "type": "mc",
  "id": "ai-written-01-q016",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/1-2_AI기계학습방법론.md 선형회귀"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
광고비 회귀에서 TV와 라디오는 유의하고 신문은 p-value가 0.86이었다. 해석으로 알맞은 것은?
### choice: a
신문은 매출 설명에 유의한 기여가 없다
### choice: c
p-value가 클수록 계수가 더 중요한 변수라고 해석한다
### choice: d
신문을 빼면 $R^2$가 반드시 크게 떨어진다고 해석한다
### choice: b
신문 광고가 매출을 낮추는 효과가 있다고 해석한다

## question: ai-written-01-q017
```json
{
  "title": "로지스틱 회귀의 계수",
  "topics": [
    "ml"
  ],
  "tags": [
    "logistic-regression"
  ],
  "group": "ml",
  "type": "mc",
  "id": "ai-written-01-q017",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/1-2_AI기계학습방법론.md 로지스틱 회귀"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
로지스틱 회귀의 계수에 대한 설명으로 옳은 것은?
### choice: a
입력이 1 늘 때 로그 오즈가 계수만큼 늘며 확률의 증가량은 일정하지 않다
### choice: c
계수는 최소제곱법으로 구하며 출력은 0과 1 밖의 값도 가질 수 있다
### choice: d
계수가 양수이면 확률이 항상 0.5보다 크다
### choice: b
입력이 1 늘 때 확률이 계수만큼 선형으로 늘어난다

## question: ai-written-01-q018
```json
{
  "title": "임계값 조정의 효과",
  "topics": [
    "ml"
  ],
  "tags": [
    "logistic-regression"
  ],
  "group": "ml",
  "type": "mc",
  "id": "ai-written-01-q018",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/1-2_AI기계학습방법론.md 로지스틱 회귀"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
이진 분류에서 양성 판정 임계값을 0.5에서 0.3으로 낮출 때 일반적인 변화는?
### choice: c
양성 판정이 늘어나 정밀도는 오르고 재현율은 내려간다
### choice: a
양성 판정이 늘어 재현율은 오르고 정밀도는 대개 내려간다
### choice: d
판정 기준만 바뀔 뿐 두 지표는 모두 그대로 유지된다
### choice: b
양성 판정이 줄어들어 재현율은 오르고 정밀도도 함께 오른다

## question: ai-written-01-q019
```json
{
  "title": "활성화 함수가 없는 신경망",
  "topics": [
    "ml"
  ],
  "tags": [
    "nn-expressivity"
  ],
  "group": "ml",
  "type": "mc",
  "id": "ai-written-01-q019",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/1-2_AI기계학습방법론.md 신경망의 표현력"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
활성화 함수 없이 선형층만 여러 겹 쌓은 신경망에 대한 설명으로 옳은 것은?
### choice: c
은닉층 수만큼 표현력이 커져 XOR도 풀 수 있다
### choice: d
마지막 층에서만 비선형이 생겨 곡선 경계가 가능하다
### choice: b
층이 깊어질수록 자동으로 비선형 경계가 만들어진다
### choice: a
전체가 하나의 선형 함수와 같아서 비선형 경계를 표현하지 못한다

## question: ai-written-01-q020
```json
{
  "title": "SGD의 특징",
  "topics": [
    "ml"
  ],
  "tags": [
    "gradient-descent"
  ],
  "group": "ml",
  "type": "mc",
  "id": "ai-written-01-q020",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/1-2_AI기계학습방법론.md 확률적 경사 하강법"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
미니배치를 사용하는 SGD에 대한 설명으로 옳은 것은?
### choice: b
전체 배치 경사하강법보다 항상 더 적은 에폭 만에 수렴한다
### choice: d
학습률 없이 기울기만으로 파라미터를 곧바로 갱신한다
### choice: c
비볼록 손실에서도 항상 전역 최솟값에 도달함이 보장된다
### choice: a
갱신이 싸고 잡음이 안장점 탈출을 돕는다

## question: ai-written-01-q021
```json
{
  "title": "경사하강법 한 번의 갱신",
  "topics": [
    "ml"
  ],
  "tags": [
    "gradient-descent"
  ],
  "group": "ml",
  "type": "mc",
  "id": "ai-written-01-q021",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/1-2_AI기계학습방법론.md 경사하강법"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
손실 $L(\phi) = \phi^2$에서 $\phi = 2$, 학습률 $\alpha = 0.1$일 때 경사하강법으로 한 번 갱신한 $\phi$는?
### choice: a
1.6
### choice: c
0.4
### choice: d
1.8
### choice: b
2.4

## question: ai-written-01-q022
```json
{
  "title": "학습 루프의 순서",
  "topics": [
    "ml"
  ],
  "tags": [
    "backprop-loop"
  ],
  "group": "ml",
  "type": "mc",
  "id": "ai-written-01-q022",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/1-2_AI기계학습방법론.md MLP 구현 실습"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
PyTorch의 한 배치 학습 순서로 알맞은 것은?
### choice: a
기울기 초기화, 순전파로 손실 계산, 역전파, 가중치 갱신
### choice: c
역전파, 순전파로 손실 계산, 가중치 갱신, 기울기 초기화
### choice: d
손실 계산, 가중치 갱신, 기울기 초기화, 역전파
### choice: b
순전파, 가중치 갱신, 역전파, 기울기 초기화

## question: ai-written-01-q023
```json
{
  "title": "역전파의 동작",
  "topics": [
    "ml"
  ],
  "tags": [
    "backprop-loop"
  ],
  "group": "ml",
  "type": "mc",
  "id": "ai-written-01-q023",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/1-2_AI기계학습방법론.md 역전파"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
역전파에 대한 설명으로 옳은 것은?
### choice: b
입력 쪽부터 차례로 모든 편미분을 처음부터 다시 계산해 기울기를 구한다
### choice: d
가중치를 갱신하는 단계 자체를 역전파라고 부르며 기울기는 구하지 않는다
### choice: a
저장한 중간값으로 출력에서 입력 쪽으로 연쇄법칙을 적용해 기울기를 구한다
### choice: c
학습률을 데이터에 맞게 자동으로 정해 주는 알고리즘으로 가중치를 갱신한다

## question: ai-written-01-q024
```json
{
  "title": "군집화와 차원 축소의 사용",
  "topics": [
    "ml"
  ],
  "tags": [
    "unsupervised"
  ],
  "group": "ml",
  "type": "mc",
  "id": "ai-written-01-q024",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/1-1_AI기계학습기초.md 비지도 학습"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
K-means 군집화와 PCA를 사용할 때 알맞은 방법은?
### choice: d
PCA가 라벨을 이용해 분류 경계를 학습하게 한다
### choice: c
군집 수는 데이터가 정답을 정해 주므로 고르지 않는다
### choice: b
초기 중심과 관계없이 결과가 같으므로 한 번만 실행한다
### choice: a
특성의 단위가 다르면 표준화하고 초기 중심을 바꿔 여러 번 실행한다

## question: ai-written-01-q025
```json
{
  "title": "원-핫 인코딩의 한계",
  "topics": [
    "nlp"
  ],
  "tags": [
    "onehot-embedding"
  ],
  "group": "nlp",
  "type": "mc",
  "id": "ai-written-01-q025",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/2-1_자연어처리기본.md 원-핫 인코딩"
  ],
  "difficulty": 1,
  "correctChoiceId": "a"
}
```
### stem
원-핫 인코딩으로 단어를 표현할 때의 한계로 옳은 것은?
### choice: a
차원이 어휘 크기만큼 커지고 서로 다른 단어의 내적이 0이라 의미 유사도가 없다
### choice: d
학습해야 할 파라미터가 너무 많아 과적합이 반드시 일어난다
### choice: b
차원이 작아 단어 사이의 미세한 의미 차이를 표현하지 못한다
### choice: c
모든 단어가 같은 벡터로 바뀌어 단어를 구별할 수 없게 된다

## question: ai-written-01-q026
```json
{
  "title": "의미가 비슷한 단어의 검색",
  "topics": [
    "nlp"
  ],
  "tags": [
    "onehot-embedding"
  ],
  "group": "nlp",
  "type": "mc",
  "id": "ai-written-01-q026",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/2-1_자연어처리기본.md 워드 임베딩"
  ],
  "difficulty": 1,
  "correctChoiceId": "a"
}
```
### stem
검색 시스템에서 '핸드폰'과 '스마트폰'을 비슷한 단어로 처리하고 싶다. 알맞은 방법은?
### choice: d
두 단어의 글자 수가 같을 때만 같은 의미로 처리한다
### choice: a
의미가 비슷한 단어를 가까운 벡터로 두는 워드 임베딩을 사용한다
### choice: c
단어를 정수 번호 하나로 바꿔 번호가 가까운 단어를 찾는다
### choice: b
단어마다 어휘 크기의 원-핫 벡터를 만들어 내적이 큰 단어를 찾는다

## question: ai-written-01-q027
```json
{
  "title": "Word2Vec 방식의 선택",
  "topics": [
    "nlp"
  ],
  "tags": [
    "word2vec"
  ],
  "group": "nlp",
  "type": "mc",
  "id": "ai-written-01-q027",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/2-1_자연어처리기본.md 워드 임베딩"
  ],
  "difficulty": 1,
  "correctChoiceId": "a"
}
```
### stem
학습 자료가 적고 희귀 단어의 표현이 중요할 때 알맞은 Word2Vec 방식은?
### choice: d
Skip-gram은 주변 단어의 평균만 쓰므로 희귀 단어에 불리하다
### choice: a
Skip-gram으로 중심 단어에서 주변 단어를 예측한다
### choice: c
CBOW로 빠르게 학습하면 희귀 단어 표현이 가장 정확하다
### choice: b
CBOW로 주변 단어에서 중심 단어를 예측한다

## question: ai-written-01-q028
```json
{
  "title": "Skip-gram 학습 쌍의 개수",
  "topics": [
    "nlp"
  ],
  "tags": [
    "word2vec"
  ],
  "group": "nlp",
  "type": "mc",
  "id": "ai-written-01-q028",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/2-1_자연어처리기본.md Word2Vec"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
문장 `the quick brown fox runs`에서 윈도우 크기 2일 때 중심 단어가 `brown`이면 Skip-gram이 만드는 (중심, 주변) 쌍은 몇 개인가?
### choice: d
5개
### choice: b
2개
### choice: a
4개
### choice: c
3개

## question: ai-written-01-q029
```json
{
  "title": "순차 데이터의 특징",
  "topics": [
    "nlp"
  ],
  "tags": [
    "sequential-rnn"
  ],
  "group": "nlp",
  "type": "mc",
  "id": "ai-written-01-q029",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/2-1_자연어처리기본.md 순차적 데이터"
  ],
  "difficulty": 1,
  "correctChoiceId": "a"
}
```
### stem
순차 데이터의 특징을 바르게 설명한 것은?
### choice: a
순서가 의미를 바꾸고 먼 정보도 영향을 주며 길이가 가변이다
### choice: b
각 요소가 서로 독립이라 순서를 바꿔도 전체 의미가 같다
### choice: c
길이가 항상 같아서 고정 크기 입력으로만 처리해야 한다
### choice: d
과거 정보는 현재 예측에 전혀 영향을 주지 않는 구조이다

## question: ai-written-01-q030
```json
{
  "title": "LSTM 출력의 텐서 모양",
  "topics": [
    "nlp"
  ],
  "tags": [
    "sequential-rnn"
  ],
  "group": "nlp",
  "type": "mc",
  "id": "ai-written-01-q030",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/2-1_자연어처리기본.md 순환 신경망"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
정수 텐서 `x`의 크기가 (8, 20)이다. 다음 코드에서 `out`의 크기는?

```python
emb = nn.Embedding(5000, 64)
lstm = nn.LSTM(
    64, 128, batch_first=True)
out, (h, c) = lstm(emb(x))
```
### choice: d
(8, 20, 64)
### choice: c
(20, 8, 128)
### choice: a
(8, 20, 128)
### choice: b
(8, 128)

## question: ai-written-01-q031
```json
{
  "title": "RNN의 기울기 소실 원인",
  "topics": [
    "nlp"
  ],
  "tags": [
    "gradient-lstm"
  ],
  "group": "nlp",
  "type": "mc",
  "id": "ai-written-01-q031",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/2-1_자연어처리기본.md 단순 RNN의 한계"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
RNN이 긴 시퀀스에서 앞쪽 정보를 학습하기 어려운 가장 직접적인 원인은?
### choice: a
같은 가중치가 반복해 곱해져 기울기가 0에 가까워진다
### choice: b
ReLU 때문에 음수 입력이 모두 0이 되어 정보가 사라진다
### choice: d
배치 크기가 작아 기울기 추정이 불안정해져 정보가 사라진다
### choice: c
학습률이 너무 커서 손실이 발산하면서 기울기가 사라진다

## question: ai-written-01-q032
```json
{
  "title": "LSTM의 장기 의존성 처리",
  "topics": [
    "nlp"
  ],
  "tags": [
    "gradient-lstm"
  ],
  "group": "nlp",
  "type": "mc",
  "id": "ai-written-01-q032",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/2-1_자연어처리기본.md LSTM"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
LSTM에 대한 설명으로 옳은 것은?
### choice: b
게이트 덕분에 기울기 소실 문제가 모든 길이에서 완전히 사라진다
### choice: d
병렬 계산이 쉬워서 RNN보다 학습 속도가 훨씬 빠르다는 장점이 있다
### choice: a
셀 상태가 덧셈으로 이어지고 게이트가 정보를 조절한다
### choice: c
셀 상태를 쓰지 않고 은닉 상태만 곱해 정보를 전달하는 구조이다

## question: ai-written-01-q033
```json
{
  "title": "고정 길이 벡터의 병목",
  "topics": [
    "nlp"
  ],
  "tags": [
    "seq2seq-attention"
  ],
  "group": "nlp",
  "type": "mc",
  "id": "ai-written-01-q033",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/2-1_자연어처리기본.md Seq2Seq와 어텐션"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
인코더-디코더 구조의 번역 모델에서 문장이 길어질수록 품질이 크게 떨어지는 주된 원인은?
### choice: d
원-핫 인코딩을 사용해 벡터의 차원이 너무 작기 때문이다
### choice: c
인코더가 출력 문장의 길이를 미리 알 수 없기 때문이다
### choice: a
입력이 벡터 하나로 압축되며 정보가 손실되기 때문이다
### choice: b
디코더가 단어를 한 번에 하나씩만 생성해야 하기 때문이다

## question: ai-written-01-q034
```json
{
  "title": "어텐션의 동작",
  "topics": [
    "nlp"
  ],
  "tags": [
    "seq2seq-attention"
  ],
  "group": "nlp",
  "type": "mc",
  "id": "ai-written-01-q034",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/2-1_자연어처리기본.md 어텐션"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
어텐션 메커니즘에 대한 설명으로 옳은 것은?
### choice: d
입력 순서 정보를 보존하려고만 쓰이며 성능과는 관계가 없는 방식이다
### choice: a
디코더가 매 시점 인코더 전체 상태에 가중치를 주어 합치며 참고 위치를 볼 수 있다
### choice: b
인코더의 마지막 상태 하나만 복사해 디코더에 한 번 전달해 사용하는 방식이다
### choice: c
가중치가 학습과 무관하게 고정되어 모든 입력 위치를 똑같이 보는 방식이다

## question: ai-written-01-q035
```json
{
  "title": "스케일링의 이유",
  "topics": [
    "nlp"
  ],
  "tags": [
    "self-attention"
  ],
  "group": "nlp",
  "type": "mc",
  "id": "ai-written-01-q035",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/2-1_자연어처리기본.md Transformer"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
어텐션 식 $\mathrm{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}\right)V$에서 $\sqrt{d_k}$로 나누는 이유는?
### choice: d
음수 내적을 양수로 바꿔 계산을 안정시키기 위해서이다
### choice: c
쿼리와 키의 차원을 줄여 계산량을 줄이기 위해서이다
### choice: a
softmax가 한쪽으로 쏠리지 않게 하려는 것이다
### choice: b
값 $V$의 크기를 키워 출력의 분산을 늘리기 위해서이다

## question: ai-written-01-q036
```json
{
  "title": "셀프 어텐션의 계산 과정",
  "topics": [
    "nlp"
  ],
  "tags": [
    "self-attention"
  ],
  "group": "nlp",
  "type": "mc",
  "id": "ai-written-01-q036",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/2-1_자연어처리기본.md Self-Attention"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
셀프 어텐션의 계산 순서로 알맞은 것은?
### choice: a
쿼리와 키의 내적을 softmax해 값을 가중합한다
### choice: d
쿼리를 그대로 출력에 더하며 키와 값은 계산에 쓰지 않는다
### choice: c
값끼리 곱해 유사도를 만든 뒤 softmax 없이 단순히 평균한다
### choice: b
키와 값의 내적으로 가중치를 구한 뒤 쿼리를 가중합한다

## question: ai-written-01-q037
```json
{
  "title": "위치 인코딩의 필요성",
  "topics": [
    "nlp"
  ],
  "tags": [
    "transformer-parts"
  ],
  "group": "nlp",
  "type": "mc",
  "id": "ai-written-01-q037",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/2-1_자연어처리기본.md Transformer 구성요소"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
Transformer에 위치 인코딩을 더하는 이유는?
### choice: d
기울기 소실을 막기 위해 잔차 연결을 대신하려는 것이다
### choice: b
단어 임베딩의 차원을 줄여 어텐션 계산을 빠르게 하려는 것이다
### choice: c
미래 토큰을 보지 못하게 가려 정답 누설을 막으려는 것이다
### choice: a
어텐션은 순서를 구분하지 못해 위치 정보가 필요하다

## question: ai-written-01-q038
```json
{
  "title": "과제에 맞는 모델 계열",
  "topics": [
    "nlp"
  ],
  "tags": [
    "pretrained-families"
  ],
  "group": "nlp",
  "type": "mc",
  "id": "ai-written-01-q038",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/2-1_자연어처리기본.md 사전학습 언어 모델"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
문서 분류와 보고서 생성에 각각 알맞은 모델 계열은?
### choice: b
문서 분류는 디코더 계열(GPT), 보고서 생성은 인코더 계열(BERT)이다
### choice: c
두 과제 모두 인코더 계열(BERT)이 가장 알맞다
### choice: d
두 과제 모두 단어 임베딩(Word2Vec)만으로 해결한다
### choice: a
문서 분류는 인코더 계열(BERT), 보고서 생성은 디코더 계열(GPT)이다

## question: ai-written-01-q039
```json
{
  "title": "디코더 계열의 학습 방식",
  "topics": [
    "nlp"
  ],
  "tags": [
    "pretrained-families"
  ],
  "group": "nlp",
  "type": "mc",
  "id": "ai-written-01-q039",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/2-1_자연어처리기본.md 사전학습 언어 모델"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
GPT 같은 디코더 계열 언어 모델의 사전학습 방식으로 옳은 것은?
### choice: b
가린 단어를 양방향 문맥으로 맞히도록 학습한다
### choice: a
왼쪽 문맥만 보고 다음 토큰을 예측하도록 마스크드 셀프 어텐션으로 학습한다
### choice: d
문장 쌍의 유사도를 맞히는 분류 과제만 학습한다
### choice: c
모든 과제를 텍스트를 입력받아 텍스트를 내는 형식으로 바꿔 학습한다

## question: ai-written-01-q040
```json
{
  "title": "Few-shot 프롬프트",
  "topics": [
    "nlp"
  ],
  "tags": [
    "in-context-cot"
  ],
  "group": "nlp",
  "type": "mc",
  "id": "ai-written-01-q040",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/2-1_자연어처리기본.md In-Context Learning"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
In-Context Learning의 Few-shot 프롬프트에 대한 설명으로 옳은 것은?
### choice: c
예시를 많이 넣을수록 성능이 계속 오르고 비용은 변하지 않는다
### choice: b
예시로 모델을 다시 학습시켜 가중치를 갱신한다
### choice: d
예시 없이 '단계별로 생각해 보자'만 덧붙이는 방식이다
### choice: a
가중치를 바꾸지 않고 프롬프트에 넣은 설명과 예시만으로 과제를 수행하게 한다

## question: ai-written-01-q041
```json
{
  "title": "CNN이 이미지에 유리한 이유",
  "topics": [
    "vision"
  ],
  "tags": [
    "cnn-vs-fcn"
  ],
  "group": "vision",
  "type": "mc",
  "id": "ai-written-01-q041",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/3-1_딥러닝&영상모델-1.md CNN과 FCN"
  ],
  "difficulty": 1,
  "correctChoiceId": "a"
}
```
### stem
이미지 처리에서 CNN이 완전연결망(FCN)보다 유리한 이유로 옳은 것은?
### choice: d
위치가 조금만 바뀌어도 완전히 다른 특징으로 인식해 구별한다
### choice: b
이미지를 1차원 벡터로 펼쳐 입력하므로 구조가 단순하고 계산이 쉽다
### choice: c
층마다 모든 픽셀을 서로 다른 가중치로 연결해 표현력이 가장 크다
### choice: a
필터를 재사용해 파라미터가 적고 공간 구조를 보존한다

## question: ai-written-01-q042
```json
{
  "title": "합성곱층의 파라미터 수",
  "topics": [
    "vision"
  ],
  "tags": [
    "conv-calc"
  ],
  "group": "vision",
  "type": "mc",
  "id": "ai-written-01-q042",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/3-1_딥러닝&영상모델-1.md 합성곱 연산"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
입력이 $3 \times 32 \times 32$일 때 `Conv2d(3, 16, kernel_size=5, stride=1, padding=0)`의 학습 파라미터 수는?
### choice: a
1,216개
### choice: c
400개
### choice: b
1,200개
### choice: d
48개

## question: ai-written-01-q043
```json
{
  "title": "합성곱 출력 크기",
  "topics": [
    "vision"
  ],
  "tags": [
    "conv-calc"
  ],
  "group": "vision",
  "type": "mc",
  "id": "ai-written-01-q043",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/3-1_딥러닝&영상모델-1.md 합성곱 연산"
  ],
  "difficulty": 1,
  "correctChoiceId": "a"
}
```
### stem
입력 $224 \times 224$에 커널 7, 스트라이드 2, 패딩 3의 합성곱을 적용한 출력 크기는?
### choice: c
$110 \times 110$
### choice: b
$111 \times 111$
### choice: a
$112 \times 112$
### choice: d
$113 \times 113$

## question: ai-written-01-q044
```json
{
  "title": "합성곱의 곱셈 횟수",
  "topics": [
    "vision"
  ],
  "tags": [
    "conv-calc"
  ],
  "group": "vision",
  "type": "mc",
  "id": "ai-written-01-q044",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/3-1_딥러닝&영상모델-1.md AlexNet 연산 비용"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
입력 $3 \times 227 \times 227$에 $11 \times 11$ 필터 96개를 스트라이드 4, 패딩 0으로 적용한다. 출력은 $96 \times 55 \times 55$이다. 곱셈 횟수는 대략 얼마인가?
### choice: c
약 1.16백만 회
### choice: a
약 1.05억 회
### choice: d
약 3.5억 회
### choice: b
약 3.5만 회

## question: ai-written-01-q045
```json
{
  "title": "맥스 풀링의 특징",
  "topics": [
    "vision"
  ],
  "tags": [
    "pooling-receptive"
  ],
  "group": "vision",
  "type": "mc",
  "id": "ai-written-01-q045",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/3-1_딥러닝&영상모델-1.md 풀링"
  ],
  "difficulty": 1,
  "correctChoiceId": "a"
}
```
### stem
맥스 풀링에 대한 설명으로 옳은 것은?
### choice: a
파라미터 없이 크기를 줄이며 작은 위치 변화에 강해진다
### choice: b
학습 가능한 가중치로 채널 수를 늘려 표현력을 키운다
### choice: d
구역의 값을 더해 평균하며 최댓값은 버리고 크기를 줄인다
### choice: c
이미지를 1차원으로 펼쳐 완전연결층의 입력으로 넣는다

## question: ai-written-01-q046
```json
{
  "title": "AlexNet의 특징",
  "topics": [
    "vision"
  ],
  "tags": [
    "classic-cnn"
  ],
  "group": "vision",
  "type": "mc",
  "id": "ai-written-01-q046",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/3-1_딥러닝&영상모델-1.md AlexNet"
  ],
  "difficulty": 1,
  "correctChoiceId": "a"
}
```
### stem
AlexNet(2012)의 특징으로 옳은 것은?
### choice: b
잔차 연결로 100층 이상을 안정적으로 학습해 우승한 모델이다
### choice: a
ReLU와 드롭아웃을 쓰고 GPU로 학습한 8층 CNN 모델이다
### choice: c
3x3 합성곱만 반복하며 파라미터가 수백만 개로 매우 작은 모델이다
### choice: d
깊이별 합성곱으로 모바일 환경에 맞춰 설계한 경량 모델이다

## question: ai-written-01-q047
```json
{
  "title": "VGG의 3x3 합성곱",
  "topics": [
    "vision"
  ],
  "tags": [
    "classic-cnn"
  ],
  "group": "vision",
  "type": "mc",
  "id": "ai-written-01-q047",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/3-1_딥러닝&영상모델-1.md VGGNet"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
VGG에서 3x3 합성곱 두 층을 쌓는 것이 5x5 합성곱 한 층보다 유리한 점은?
### choice: b
수용영역이 더 넓어지고 파라미터 수는 서로 같다
### choice: a
수용영역이 같고 파라미터가 더 적다
### choice: c
층 사이 활성화 함수가 없어 계산이 훨씬 빨라진다
### choice: d
파라미터가 늘어나지만 정확도는 언제나 서로 같다

## question: ai-written-01-q048
```json
{
  "title": "ResNet이 해결한 문제",
  "topics": [
    "vision"
  ],
  "tags": [
    "resnet"
  ],
  "group": "vision",
  "type": "mc",
  "id": "ai-written-01-q048",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/3-1_딥러닝&영상모델-1.md ResNet"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
ResNet이 잔차 연결로 해결하려 한 문제는?
### choice: a
층이 깊어질수록 학습 오차까지 커지는 성능 저하 문제이다
### choice: d
활성화 함수가 포화되는 문제이다
### choice: b
깊은 모델이 학습 자료를 외우는 과적합 문제이다
### choice: c
모바일 기기에서 연산량이 너무 많은 문제이다

## question: ai-written-01-q049
```json
{
  "title": "잔차 블록의 원리",
  "topics": [
    "vision"
  ],
  "tags": [
    "resnet"
  ],
  "group": "vision",
  "type": "mc",
  "id": "ai-written-01-q049",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/3-1_딥러닝&영상모델-1.md ResNet"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
잔차 블록 $F(x) + x$가 깊은 망의 학습을 쉽게 만드는 이유는?
### choice: a
최적이 항등에 가까우면 $F(x)$를 0으로 만들면 되기 때문이다
### choice: b
$F(x)$를 항상 입력과 같게 만들어야 하므로 학습이 단순해지기 때문이다
### choice: c
파라미터 수를 크게 줄여 과적합을 자동으로 막아 주기 때문이다
### choice: d
지름길 덕분에 역전파 없이도 가중치를 갱신할 수 있기 때문이다

## question: ai-written-01-q050
```json
{
  "title": "MobileNet의 연산 절감",
  "topics": [
    "vision"
  ],
  "tags": [
    "mobilenet"
  ],
  "group": "vision",
  "type": "mc",
  "id": "ai-written-01-q050",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/3-1_딥러닝&영상모델-1.md MobileNet"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
채널 수 $C = 72$일 때 깊이별 합성곱과 1x1 합성곱으로 나눈 MobileNet의 연산량은 일반 3x3 합성곱의 몇 분의 1인가? (비율 $9C/(9+C)$을 사용)
### choice: d
약 3분의 1
### choice: a
약 8분의 1
### choice: b
약 9분의 1
### choice: c
약 72분의 1

## question: ai-written-01-q051
```json
{
  "title": "ViT의 패치 수",
  "topics": [
    "vision"
  ],
  "tags": [
    "vit-structure"
  ],
  "group": "vision",
  "type": "mc",
  "id": "ai-written-01-q051",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/3-1_딥러닝&영상모델-2.md ViT"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
$224 \times 224$ 이미지를 $16 \times 16$ 패치로 나누어 ViT에 넣을 때 패치 토큰은 몇 개인가? (분류용 토큰 제외)
### choice: d
14개
### choice: b
224개
### choice: a
196개
### choice: c
256개

## question: ai-written-01-q052
```json
{
  "title": "위치 인코딩 방식",
  "topics": [
    "vision"
  ],
  "tags": [
    "vit-position"
  ],
  "group": "vision",
  "type": "mc",
  "id": "ai-written-01-q052",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/3-1_딥러닝&영상모델-2.md ViT 위치 인코딩"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
ViT의 학습 가능한 위치 인코딩에 대한 설명으로 옳은 것은?
### choice: a
데이터에 맞게 최적화되지만 입력 해상도가 바뀌면 다시 학습해야 한다
### choice: d
상대적인 거리만 반영하고 절대 위치는 반영하지 못한다
### choice: c
학습하지 않는 고정 함수로 만들어진다
### choice: b
해상도가 바뀌어도 그대로 쓸 수 있어 가장 유연하다

## question: ai-written-01-q053
```json
{
  "title": "소규모 자료에서의 ViT",
  "topics": [
    "vision"
  ],
  "tags": [
    "vit-training"
  ],
  "group": "vision",
  "type": "mc",
  "id": "ai-written-01-q053",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/3-1_딥러닝&영상모델-2.md ViT 학습 시 유의점"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
사내 불량 이미지 수백 장으로 모델을 만들려 한다. 알맞은 판단은?
### choice: b
ViT는 항상 CNN보다 정확하므로 처음부터 학습해도 된다
### choice: c
자료가 적을수록 귀납 편향이 약한 ViT가 더 유리하다
### choice: a
ViT는 불리하므로 전이 학습이나 CNN을 쓴다
### choice: d
자료 양과 관계없이 두 구조는 항상 같은 성능을 낸다

## question: ai-written-01-q054
```json
{
  "title": "Sigmoid의 문제",
  "topics": [
    "vision"
  ],
  "tags": [
    "activation"
  ],
  "group": "vision",
  "type": "mc",
  "id": "ai-written-01-q054",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/3-1_딥러닝&영상모델-2.md 활성화 함수"
  ],
  "difficulty": 1,
  "correctChoiceId": "a"
}
```
### stem
깊은 신경망의 은닉층에서 Sigmoid를 기본 활성화로 쓰기 어려운 이유는?
### choice: d
계산이 지나치게 단순해 학습이 너무 빨라져 불안정하다
### choice: c
출력 범위가 −1과 1 사이라서 확률로 해석할 수 없다
### choice: a
포화 시 기울기가 0에 가깝고 출력이 항상 양수이다
### choice: b
음수 입력을 모두 0으로 만들어 뉴런이 죽는 문제가 생긴다

## question: ai-written-01-q055
```json
{
  "title": "죽은 ReLU 문제",
  "topics": [
    "vision"
  ],
  "tags": [
    "activation"
  ],
  "group": "vision",
  "type": "mc",
  "id": "ai-written-01-q055",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/3-1_딥러닝&영상모델-2.md 활성화 함수"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
Leaky ReLU가 완화하려는 ReLU의 문제와 방법은?
### choice: d
계산 비용이 커서 학습이 느린 문제를 완화하는 방법이다
### choice: b
출력이 항상 양수인 문제를 지수 함수로 바꿔 완화하는 방법이다
### choice: c
양수 구간의 기울기가 1이어서 생기는 기울기 폭발을 막는 방법이다
### choice: a
죽은 뉴런 문제를 음수 구간의 작은 기울기로 완화한다

## question: ai-written-01-q056
```json
{
  "title": "학습과 운영의 전처리 불일치",
  "topics": [
    "vision"
  ],
  "tags": [
    "preprocessing"
  ],
  "group": "vision",
  "type": "mc",
  "id": "ai-written-01-q056",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/3-1_딥러닝&영상모델-2.md 데이터 전처리"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
학습은 RGB 이미지로 했는데 운영 카메라가 BGR 이미지를 준다. 정확도가 급락했다. 알맞은 조치는?
### choice: b
운영 모델의 가중치를 다시 무작위로 초기화해 처음부터 새로 시작한다
### choice: a
전처리 코드를 학습과 운영에서 공유해 채널 순서와 정규화를 맞춘다
### choice: d
검증 자료만 RGB로 바꿔 평가해 성능이 정상이라고 보고한다
### choice: c
카메라 해상도를 높이면 해결된다고 보고 해상도만 바꾼다

## question: ai-written-01-q057
```json
{
  "title": "0 초기화의 문제",
  "topics": [
    "vision"
  ],
  "tags": [
    "init"
  ],
  "group": "vision",
  "type": "mc",
  "id": "ai-written-01-q057",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/3-1_딥러닝&영상모델-2.md 모델 상수 초기화"
  ],
  "difficulty": 1,
  "correctChoiceId": "a"
}
```
### stem
신경망의 모든 가중치와 편향을 0으로 초기화하면 생기는 문제는?
### choice: d
초기 출력이 무작위로 정해져 매번 결과가 달라진다
### choice: a
모든 뉴런이 같은 기울기를 가져 똑같이 학습된다
### choice: b
활성값이 폭발적으로 커져 손실이 곧바로 무한대가 된다
### choice: c
학습률이 자동으로 점점 커져 학습이 발산하게 된다

## question: ai-written-01-q058
```json
{
  "title": "He 초기화",
  "topics": [
    "vision"
  ],
  "tags": [
    "init"
  ],
  "group": "vision",
  "type": "mc",
  "id": "ai-written-01-q058",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/3-1_딥러닝&영상모델-2.md 모델 상수 초기화"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
ReLU를 쓰는 깊은 신경망에서 He 초기화(표준편차 $\sqrt{2/D_{in}}$)가 알맞은 이유는?
### choice: c
tanh의 대칭성을 활용해 분산을 더 작게 만들기 위해서이다
### choice: d
모든 가중치를 0에 가깝게 하여 기울기 소실을 없애기 위해서이다
### choice: a
ReLU가 출력의 절반을 0으로 만들어 줄어드는 분산을 2배 보정하기 때문이다
### choice: b
ReLU가 출력을 두 배로 키우기 때문에 분산을 절반으로 줄이기 위해서이다

## question: ai-written-01-q059
```json
{
  "title": "L1과 L2 정규화",
  "topics": [
    "vision"
  ],
  "tags": [
    "regularization"
  ],
  "group": "vision",
  "type": "mc",
  "id": "ai-written-01-q059",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/3-1_딥러닝&영상모델-2.md 모델 정규화"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
L1 정규화와 L2 정규화의 차이로 옳은 것은?
### choice: a
L1은 가중치를 0으로 만들고 L2는 고르게 줄인다
### choice: b
L2는 가중치를 정확히 0으로 만들어 특성 선택 효과가 크다
### choice: c
L1은 가중치 제곱합을, L2는 절댓값 합을 벌점으로 쓴다
### choice: d
두 방식 모두 원래 손실은 빼고 벌점만 최소화하도록 학습한다

## question: ai-written-01-q060
```json
{
  "title": "평가 때 드롭아웃",
  "topics": [
    "vision"
  ],
  "tags": [
    "regularization"
  ],
  "group": "vision",
  "type": "mc",
  "id": "ai-written-01-q060",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/3-1_딥러닝&영상모델-2.md 모델 정규화"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
학습할 때는 괜찮았는데 평가에서 같은 입력의 출력이 실행할 때마다 달라진다. 가장 가능성 높은 원인은?
### choice: d
역 드롭아웃 때문에 출력이 항상 $1/(1-p)$배가 된다
### choice: b
`torch.no_grad()`를 사용해서 기울기 기록이 꺼진 상태로 평가를 진행했다
### choice: c
드롭아웃 비율 $p$가 0이어서 뉴런이 모두 꺼졌다
### choice: a
`model.eval()`을 부르지 않아 평가 중에도 드롭아웃이 켜져 있다

## question: ai-written-01-q061
```json
{
  "title": "코사인 학습률 스케줄",
  "topics": [
    "vision"
  ],
  "tags": [
    "lr-schedule"
  ],
  "group": "vision",
  "type": "mc",
  "id": "ai-written-01-q061",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/3-1_딥러닝&영상모델-2.md 학습률 조정"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
코사인 스케줄 $\eta_t = \frac{\eta_0}{2}\left(1 + \cos\frac{\pi t}{T}\right)$에서 $\eta_0 = 0.1$, $T = 100$일 때 $t = 50$의 학습률은?
### choice: c
0.025
### choice: b
0.075
### choice: d
0.01
### choice: a
0.05

## question: ai-written-01-q062
```json
{
  "title": "학습 전 초기 손실 점검",
  "topics": [
    "vision"
  ],
  "tags": [
    "hyperparam-diagnosis"
  ],
  "group": "vision",
  "type": "mc",
  "id": "ai-written-01-q062",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/3-1_딥러닝&영상모델-2.md 하이퍼파라미터 선정"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
10개 클래스를 분류하는 신경망을 학습하기 전 교차 엔트로피 손실의 정상 범위는?
### choice: d
약 0.1에 가까워야 한다
### choice: c
약 10에 가까워야 한다
### choice: a
약 2.3에 가까워야 한다
### choice: b
0에 가까워야 한다

## question: ai-written-01-q063
```json
{
  "title": "학습 곡선의 해석",
  "topics": [
    "vision"
  ],
  "tags": [
    "hyperparam-diagnosis"
  ],
  "group": "vision",
  "type": "mc",
  "id": "ai-written-01-q063",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/3-1_딥러닝&영상모델-2.md 체크리스트"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
학습 정확도는 계속 오르는데 검증 정확도는 일정 시점부터 정체하거나 떨어지고 둘의 격차가 커진다. 알맞은 대응은?
### choice: c
초기화 문제이므로 가중치를 0으로 다시 초기화한다
### choice: a
과적합이므로 정규화나 데이터 추가를 쓴다
### choice: d
학습률을 크게 올려 학습 속도를 최대한 가속한다
### choice: b
모델이 약하므로 더 큰 모델로 훨씬 오래 학습시킨다

## question: ai-written-01-q064
```json
{
  "title": "선형 프로빙과 파인튜닝",
  "topics": [
    "vision"
  ],
  "tags": [
    "transfer-learning"
  ],
  "group": "vision",
  "type": "mc",
  "id": "ai-written-01-q064",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/3-1_딥러닝&영상모델-2.md 전이 학습 실습"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
자료와 계산 자원이 모두 적을 때 알맞은 전이 학습 방법은?
### choice: b
모든 층을 학습하는 전체 파인튜닝이다
### choice: c
백본을 새로 초기화한 뒤 처음부터 학습한다
### choice: d
학습 없이 사전학습 모델의 분류층 구조만 바꿔 쓴다
### choice: a
백본을 고정하고 마지막 분류층만 학습하는 선형 프로빙이다

## question: ai-written-01-q065
```json
{
  "title": "사전학습과 사후학습",
  "topics": [
    "llm-agent"
  ],
  "tags": [
    "posttraining"
  ],
  "group": "llm-agent",
  "type": "mc",
  "id": "ai-written-01-q065",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/ai-4-1_LangChain.md Pre-training vs Post-training"
  ],
  "difficulty": 1,
  "correctChoiceId": "a"
}
```
### stem
사전학습만 마친 대규모 언어모델을 챗봇으로 쓰려면 사후학습이 필요한 이유는?
### choice: b
사전학습은 라벨이 있는 소량의 자료만 써서 지식이 부족하기 때문이다
### choice: d
사후학습은 모델의 파라미터 수를 줄여 크기를 작게 만들기 때문이다
### choice: a
사람의 지시에 답하기보다 문장을 이어 쓰는 경향이 있어 조정이 필요하다
### choice: c
사전학습 모델은 다음 토큰을 예측하는 능력이 아예 없는 상태이기 때문이다

## question: ai-written-01-q066
```json
{
  "title": "Instruction-tuning의 학습 방식",
  "topics": [
    "llm-agent"
  ],
  "tags": [
    "instruction-tuning"
  ],
  "group": "llm-agent",
  "type": "mc",
  "id": "ai-written-01-q066",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/ai-4-1_LangChain.md Instruction-tuning"
  ],
  "difficulty": 1,
  "correctChoiceId": "a"
}
```
### stem
Instruction-tuning에 대한 설명으로 옳은 것은?
### choice: b
라벨 없는 대규모 텍스트로 다음 토큰을 예측하는 자기지도 학습이다
### choice: c
사람의 선호 비교 자료로 보상 모델을 먼저 학습하는 방식이다
### choice: a
지시문과 응답 쌍으로 지도학습해 새 과제에도 지시를 따르게 한다
### choice: d
추론 단계에서 가중치를 바꾸지 않고 프롬프트만 조정하는 방식이다

## question: ai-written-01-q067
```json
{
  "title": "Instruction-tuning의 한계",
  "topics": [
    "llm-agent"
  ],
  "tags": [
    "instruction-tuning"
  ],
  "group": "llm-agent",
  "type": "mc",
  "id": "ai-written-01-q067",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/ai-4-1_LangChain.md Instruction-tuning"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
Instruction-tuning의 한계로 옳은 것은?
### choice: c
정답 데이터가 필요 없어 비용이 거의 들지 않고 품질 관리도 쉽다
### choice: d
사람의 선호를 직접 최적화하므로 보상 해킹이 가장 큰 한계이다
### choice: b
새로운 과제에는 일반화가 전혀 되지 않아 지시를 따르지 못하게 된다
### choice: a
정답 수집 비용이 크고 창작 과제에는 맞지 않으며 토큰 오류를 같은 무게로 본다

## question: ai-written-01-q068
```json
{
  "title": "RLHF가 비교를 쓰는 이유",
  "topics": [
    "llm-agent"
  ],
  "tags": [
    "rlhf"
  ],
  "group": "llm-agent",
  "type": "mc",
  "id": "ai-written-01-q068",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/ai-4-1_LangChain.md RLHF"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
RLHF에서 사람이 응답에 점수를 매기는 대신 여러 응답을 비교해 순위를 정하는 이유는?
### choice: c
비교 자료는 보상 모델 없이도 바로 강화학습에 쓸 수 있기 때문이다
### choice: b
점수는 기계가 계산할 수 없지만 순위는 자동으로 구할 수 있기 때문이다
### choice: d
순위는 항상 정답이 하나로 정해져 있어 사람의 판단이 필요 없기 때문이다
### choice: a
점수는 사람마다 기준이 달라 일관성이 낮지만 비교는 더 일관되게 판단하기 때문이다

## question: ai-written-01-q069
```json
{
  "title": "RLHF 이후에도 남는 문제",
  "topics": [
    "llm-agent"
  ],
  "tags": [
    "rlhf"
  ],
  "group": "llm-agent",
  "type": "mc",
  "id": "ai-written-01-q069",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/ai-4-1_LangChain.md RLHF"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
RLHF를 거친 모델에 대한 설명으로 옳은 것은?
### choice: b
사람의 선호를 학습했으므로 환각은 더 이상 발생하지 않는다
### choice: a
보상 해킹과 환각이 남을 수 있어 출력의 사실 검증이 필요하다
### choice: d
사람 피드백이 항상 일관되므로 보상 모델 과최적화는 전혀 생기지 않는다
### choice: c
보상 모델의 점수가 오르면 실제 선호도 언제나 함께 오른다

## question: ai-written-01-q070
```json
{
  "title": "DPO의 특징",
  "topics": [
    "llm-agent"
  ],
  "tags": [
    "dpo-rlvr"
  ],
  "group": "llm-agent",
  "type": "mc",
  "id": "ai-written-01-q070",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/ai-4-1_LangChain.md DPO"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
DPO(Direct Preference Optimization)의 특징으로 옳은 것은?
### choice: c
선호 자료 없이 지시와 응답 쌍만으로 학습하는 방식이다
### choice: a
보상 모델과 강화학습 없이 선호 자료로 모델을 직접 최적화한다
### choice: d
보상 모델을 먼저 학습한 뒤 강화학습으로 정책을 최적화하는 방식이다
### choice: b
정답 여부를 자동으로 검증해 보상을 계산하는 방식이다

## question: ai-written-01-q071
```json
{
  "title": "RLVR의 적용 조건",
  "topics": [
    "llm-agent"
  ],
  "tags": [
    "dpo-rlvr"
  ],
  "group": "llm-agent",
  "type": "mc",
  "id": "ai-written-01-q071",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/ai-4-1_LangChain.md RLVR"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
RLVR(Verifiable Reward 강화학습)을 쓰기에 가장 알맞은 과제는?
### choice: a
정답 여부를 자동으로 확인할 수 있는 수학 문제 풀이이다
### choice: c
사용자의 취향에 맞는 영화 추천이다
### choice: b
문체가 얼마나 자연스러운지 평가하는 글쓰기이다
### choice: d
두 설명 중 더 친절한 쪽을 고르는 대화이다

## question: ai-written-01-q072
```json
{
  "title": "RAG가 필요한 이유",
  "topics": [
    "llm-agent"
  ],
  "tags": [
    "rag-need"
  ],
  "group": "llm-agent",
  "type": "mc",
  "id": "ai-written-01-q072",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/ai-4-1_LangChain.md Retrieval-augmented LM"
  ],
  "difficulty": 1,
  "correctChoiceId": "a"
}
```
### stem
매주 규정이 바뀌는 사내 규정 질의응답 챗봇에 파인튜닝보다 RAG가 알맞은 이유는?
### choice: b
문서가 바뀔 때마다 모델의 가중치 전체를 새로 학습해 지식을 반영하기 때문이다
### choice: a
문서만 갱신하면 최신 지식이 반영되고 근거 문서를 제시할 수 있기 때문이다
### choice: c
검색 단계를 없애 응답 속도를 높이고 구조를 단순화하기 때문이다
### choice: d
모델이 사내 문서를 모두 외우게 만들어 항상 정답을 내기 때문이다

## question: ai-written-01-q073
```json
{
  "title": "RAG의 실패 상황",
  "topics": [
    "llm-agent"
  ],
  "tags": [
    "rag-need"
  ],
  "group": "llm-agent",
  "type": "mc",
  "id": "ai-written-01-q073",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/ai-4-1_LangChain.md Retrieval-augmented LM"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
구버전과 최신 규정 문서가 함께 검색되어 챗봇이 두 내용을 섞어 답했다. 근본 원인과 개선 방안으로 알맞은 것은?
### choice: c
임베딩 차원이 낮은 것이 원인이므로 차원만 줄여 다시 만든다
### choice: d
프롬프트가 길어서 문제이므로 검색한 근거 문서를 모두 빼고 답하게 한다
### choice: a
검색이 문서 버전을 구분하지 못한 것이므로 최신본만 검색하게 한다
### choice: b
생성 모델이 작은 것이 원인이므로 더 큰 모델로 교체한다

## question: ai-written-01-q074
```json
{
  "title": "Sparse와 Dense 검색",
  "topics": [
    "llm-agent"
  ],
  "tags": [
    "sparse-dense"
  ],
  "group": "llm-agent",
  "type": "mc",
  "id": "ai-written-01-q074",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/ai-4-1_LangChain.md Information Retrieval"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
부품 코드 `HBM3E-12H`처럼 정확한 문자열 일치가 중요한 검색에서 알맞은 방식은?
### choice: b
의미 유사도에 강한 Dense 검색만 쓰면 항상 가장 좋은 검색 결과가 나온다
### choice: d
Sparse 검색은 동의어를 잘 잡아 코드 검색에 부적합하다
### choice: c
정확한 키워드 매칭에도 Dense 검색이 가장 강한 방식이다
### choice: a
단어 일치에 강한 Sparse 검색이나 Dense와 섞은 하이브리드 검색이다

## question: ai-written-01-q075
```json
{
  "title": "TF-IDF 가중치",
  "topics": [
    "llm-agent"
  ],
  "tags": [
    "sparse-dense"
  ],
  "group": "llm-agent",
  "type": "mc",
  "id": "ai-written-01-q075",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/ai-4-1_LangChain.md Sparse Retriever"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
TF-IDF에서 거의 모든 문서에 등장하는 단어(예: the, is)의 가중치가 작은 이유는?
### choice: c
문서 수 $N$이 커질수록 가중치가 반드시 커지기 때문이다
### choice: a
역문서 빈도 $\log(N/df)$가 0에 가까워 가중치가 작아지기 때문이다
### choice: d
문서에서 처음 나온 단어에만 가중치가 부여되기 때문이다
### choice: b
단어 빈도(TF)가 항상 0이라서 곱으로 구한 가중치도 0이 되기 때문이다

## question: ai-written-01-q076
```json
{
  "title": "Bi-encoder와 Cross-encoder",
  "topics": [
    "llm-agent"
  ],
  "tags": [
    "bi-cross-encoder"
  ],
  "group": "llm-agent",
  "type": "mc",
  "id": "ai-written-01-q076",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/ai-4-1_LangChain.md Dense Retriever"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
대규모 문서에서 후보를 빠르게 찾은 뒤 상위 후보만 정밀하게 재순위하는 구성으로 알맞은 것은?
### choice: b
Cross-encoder로 모든 문서를 1차 검색한 뒤 Bi-encoder로 재순위한다
### choice: d
Bi-encoder는 쌍마다 계산해야 하므로 대규모 검색에 부적합하다
### choice: c
두 방식 모두 쿼리와 문서를 한 번에 입력해 점수를 낸다
### choice: a
Bi-encoder로 1차 검색하고 Cross-encoder로 재순위한다

## question: ai-written-01-q077
```json
{
  "title": "Bi-encoder의 학습",
  "topics": [
    "llm-agent"
  ],
  "tags": [
    "bi-cross-encoder"
  ],
  "group": "llm-agent",
  "type": "mc",
  "id": "ai-written-01-q077",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/ai-4-1_LangChain.md Dense Retriever"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
Bi-encoder retriever를 대조 학습으로 학습하는 방식으로 옳은 것은?
### choice: d
쿼리와 문서를 하나의 문장으로 이어 붙여 점수를 내도록 학습한다
### choice: c
관련 문서와 무관한 문서를 구분하지 않고 둘 사이의 거리만 줄이도록 학습한다
### choice: b
쿼리와 모든 문서의 벡터를 서로 같게 만들도록 학습한다
### choice: a
쿼리와 관련 문서의 벡터는 가깝게, 무관한 문서의 벡터는 멀게 학습한다

## question: ai-written-01-q078
```json
{
  "title": "에이전트의 판별",
  "topics": [
    "llm-agent"
  ],
  "tags": [
    "agent-concept"
  ],
  "group": "llm-agent",
  "type": "mc",
  "id": "ai-written-01-q078",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/ai-4-1_LangChain.md Agent"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
다음 중 LLM 에이전트로 보기에 가장 알맞은 시스템은?
### choice: a
웹을 탐색하며 관찰 결과를 반영해 다음 행동을 정하는 LLM 시스템이다
### choice: c
외부와 상호작용 없이 긴 추론만 하는 추론 모델이다
### choice: b
질문을 한 번 검색한 뒤 답을 한 번 생성하는 챗봇이다
### choice: d
정해진 규칙으로 문서를 분류하는 프로그램이다

## question: ai-written-01-q079
```json
{
  "title": "에이전트 구성요소의 역할",
  "topics": [
    "llm-agent"
  ],
  "tags": [
    "agent-concept"
  ],
  "group": "llm-agent",
  "type": "mc",
  "id": "ai-written-01-q079",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/ai-4-1_LangChain.md LLM Agent 프레임워크"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
LLM 에이전트의 Controller, Tool Set, Perceiver의 역할을 바르게 연결한 것은?
### choice: a
Controller는 계획을 세우고 Tool Set은 도구 모음이며 Perceiver는 피드백을 요약한다
### choice: b
Controller는 도구를 실행하고 Tool Set은 계획을 세우며 Perceiver는 결과를 저장한다
### choice: c
Controller는 환경이고 Tool Set은 피드백을 요약하며 Perceiver는 계획을 세운다
### choice: d
세 구성요소는 모두 같은 역할을 하며 부르는 이름만 서로 다르다

## question: ai-written-01-q080
```json
{
  "title": "도구 호출의 실행 주체",
  "topics": [
    "llm-agent"
  ],
  "tags": [
    "tool-use"
  ],
  "group": "llm-agent",
  "type": "mc",
  "id": "ai-written-01-q080",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/ai-4-1_LangChain.md Tool Usage"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
LLM의 도구 사용에 대한 설명으로 옳은 것은?
### choice: b
LLM이 도구의 코드를 직접 실행해 곧바로 결과를 얻는다
### choice: d
도구 호출 결과는 LLM에 전달되지 않고 사용자 화면에만 그대로 보여 주는 방식이다
### choice: c
도구를 쓰려면 반드시 모델 전체를 처음부터 재학습해야 한다
### choice: a
LLM이 함수 이름과 인자를 만들고 외부 프로그램이 실행해 결과를 돌려준다

## question: ai-written-01-q081
```json
{
  "title": "MCP의 계층",
  "topics": [
    "llm-agent"
  ],
  "tags": [
    "mcp"
  ],
  "group": "llm-agent",
  "type": "mc",
  "id": "ai-written-01-q081",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/ai-4-1_LangChain.md Model Context Protocol"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
MCP의 Data Layer와 Transport Layer의 역할로 옳은 것은?
### choice: b
Data Layer는 stdio와 HTTP 통신을, Transport Layer는 메시지 형식을 맡는다
### choice: d
Data Layer는 인증과 연결을, Transport Layer는 프롬프트 설계를 맡는다
### choice: a
Data Layer는 JSON-RPC 메시지와 도구 정의를, Transport Layer는 통신 채널과 인증을 맡는다
### choice: c
두 계층 모두 도구의 코드를 직접 실행하는 역할을 하며 서버가 필요 없다

## question: ai-written-01-q082
```json
{
  "title": "MCP의 구성과 장점",
  "topics": [
    "llm-agent"
  ],
  "tags": [
    "mcp"
  ],
  "group": "llm-agent",
  "type": "mc",
  "id": "ai-written-01-q082",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/ai-4-1_LangChain.md Model Context Protocol"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
MCP Host, Client, Server에 대한 설명으로 옳은 것은?
### choice: b
Client가 도구와 리소스를 제공하고 Server가 Host를 관리하는 구조이다
### choice: d
MCP는 모델마다 도구를 서로 다르게 정의하도록 요구하는 프로토콜이다
### choice: a
Host가 여러 Client를 관리하고 Client가 Server 하나와 1:1로 연결된다
### choice: c
Host는 Server 하나와만 직접 연결되며 Client는 필요 없는 구조이다

## question: ai-written-01-q083
```json
{
  "title": "계획 전략의 선택",
  "topics": [
    "llm-agent"
  ],
  "tags": [
    "planning"
  ],
  "group": "llm-agent",
  "type": "mc",
  "id": "ai-written-01-q083",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/ai-4-1_LangChain.md 추론과 계획"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
웹 환경이 자주 바뀌어 매 단계 관찰 결과에 따라 행동을 정해야 하는 작업에 알맞은 계획 방식은?
### choice: a
생각, 행동, 관찰을 번갈아 하는 국소 계획 방식인 ReAct이다
### choice: d
실패한 기록을 반성하지 않고 같은 행동만 반복한다
### choice: b
처음에 전체 계획을 세워 끝까지 그대로 실행하는 Plan-and-Solve이다
### choice: c
실패 없이 한 번에 끝나므로 계획이 필요 없다

## question: ai-written-01-q084
```json
{
  "title": "RAG 파이프라인의 순서",
  "topics": [
    "llm-agent"
  ],
  "tags": [
    "langchain-rag"
  ],
  "group": "llm-agent",
  "type": "mc",
  "id": "ai-written-01-q084",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/ai-4-1_LangChain.md LangChain과 RAG 실습"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
LangChain으로 RAG를 구성하는 순서로 알맞은 것은?
### choice: d
벡터 저장소 저장 → 청킹 → 문서 불러오기 → 검색 → 임베딩 → 프롬프트 생성
### choice: c
문서 불러오기 → 프롬프트 생성 → 청킹 → 검색 → 임베딩 → 벡터 저장소 저장
### choice: a
문서 불러오기 → 청킹 → 임베딩 → 벡터 저장소 저장 → 검색 → 프롬프트 생성
### choice: b
임베딩 → 문서 불러오기 → 청킹 → 벡터 저장소 저장 → 검색 → 프롬프트 생성

## question: ai-written-01-q085
```json
{
  "title": "이진수와 십육진수의 변환",
  "topics": [
    "efficiency"
  ],
  "tags": [
    "number-systems"
  ],
  "group": "efficiency",
  "type": "mc",
  "id": "ai-written-01-q085",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/ai-5-1_리소스_효율적_학습법.md 수 체계"
  ],
  "difficulty": 1,
  "correctChoiceId": "a"
}
```
### stem
십진수 47을 이진수로 바꾼 값은?
### choice: c
$110111_2$
### choice: b
$101011_2$
### choice: d
$100111_2$
### choice: a
$101111_2$

## question: ai-written-01-q086
```json
{
  "title": "십육진수를 십진수로",
  "topics": [
    "efficiency"
  ],
  "tags": [
    "number-systems"
  ],
  "group": "efficiency",
  "type": "mc",
  "id": "ai-written-01-q086",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/ai-5-1_리소스_효율적_학습법.md 수 체계"
  ],
  "difficulty": 1,
  "correctChoiceId": "a"
}
```
### stem
십육진수 `4AF`를 십진수로 바꾼 값은?
### choice: b
1198
### choice: a
1199
### choice: c
1175
### choice: d
1759

## question: ai-written-01-q087
```json
{
  "title": "2의 보수 범위",
  "topics": [
    "efficiency"
  ],
  "tags": [
    "twos-complement"
  ],
  "group": "efficiency",
  "type": "mc",
  "id": "ai-written-01-q087",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/ai-5-1_리소스_효율적_학습법.md 부호 있는 수 체계"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
N비트 2의 보수로 표현할 수 있는 정수의 범위는?
### choice: d
$-2^{N}$ 이상 $2^{N}-1$ 이하
### choice: b
$-(2^{N-1}-1)$ 이상 $2^{N-1}-1$ 이하
### choice: c
$0$ 이상 $2^N-1$ 이하
### choice: a
$-2^{N-1}$ 이상 $2^{N-1}-1$ 이하

## question: ai-written-01-q088
```json
{
  "title": "2의 보수 덧셈의 오버플로",
  "topics": [
    "efficiency"
  ],
  "tags": [
    "twos-complement"
  ],
  "group": "efficiency",
  "type": "mc",
  "id": "ai-written-01-q088",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/ai-5-1_리소스_효율적_학습법.md 고정소수점 수 체계의 연산"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
4비트 2의 보수에서 $0110_2 + 0011_2$를 계산한 결과와 해석은?
### choice: d
$1111_2$이며 $-1$로 읽히는 정상적인 덧셈 결과이다
### choice: c
$0001_2$이며 올림이 버려져 부호가 유지된 정상 결과이다
### choice: b
$1001_2$이며 $+9$를 정확히 나타내는 정상 결과이다
### choice: a
$1001_2$이며 $-7$로 읽히는 오버플로이다

## question: ai-written-01-q089
```json
{
  "title": "IEEE 754 단정밀도 구성",
  "topics": [
    "efficiency"
  ],
  "tags": [
    "ieee754"
  ],
  "group": "efficiency",
  "type": "mc",
  "id": "ai-written-01-q089",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/ai-5-1_리소스_효율적_학습법.md IEEE 754"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
IEEE 754 단정밀도(FP32)의 부호, 지수, 가수 비트 수와 바이어스는?
### choice: b
1비트, 11비트, 52비트이며 바이어스는 1023이다
### choice: d
1비트, 8비트, 7비트이며 바이어스는 127이다
### choice: a
1비트, 8비트, 23비트이며 바이어스는 127이다
### choice: c
1비트, 5비트, 10비트이며 바이어스는 15이다

## question: ai-written-01-q090
```json
{
  "title": "FP32 비트열 해석",
  "topics": [
    "efficiency"
  ],
  "tags": [
    "ieee754"
  ],
  "group": "efficiency",
  "type": "mc",
  "id": "ai-written-01-q090",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/ai-5-1_리소스_효율적_학습법.md IEEE 754"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
FP32 비트열 `0 10000000 10000000000000000000000`이 나타내는 값은?
### choice: a
3.0
### choice: d
6.0
### choice: c
1.5
### choice: b
2.0

## question: ai-written-01-q091
```json
{
  "title": "BF16과 FP16",
  "topics": [
    "efficiency"
  ],
  "tags": [
    "ai-formats"
  ],
  "group": "efficiency",
  "type": "mc",
  "id": "ai-written-01-q091",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/ai-5-1_리소스_효율적_학습법.md 수 표현과 정밀도"
  ],
  "difficulty": 1,
  "correctChoiceId": "a"
}
```
### stem
BF16과 FP16의 비교로 옳은 것은?
### choice: a
BF16은 FP32와 같은 지수 범위를 쓰고 정밀도는 FP16보다 낮다
### choice: c
두 형식은 지수 비트 수가 서로 같고 가수 비트 수만 다르다
### choice: b
BF16은 FP16보다 표현 범위가 좁은 대신 정밀도가 훨씬 더 높은 형식이다
### choice: d
BF16은 정수 형식이라서 양자화 과정에서만 사용된다

## question: ai-written-01-q092
```json
{
  "title": "양자화의 목적과 방법",
  "topics": [
    "efficiency"
  ],
  "tags": [
    "quantization"
  ],
  "group": "efficiency",
  "type": "mc",
  "id": "ai-written-01-q092",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/ai-5-1_리소스_효율적_학습법.md 양자화"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
모델 양자화에 대한 설명으로 옳은 것은?
### choice: b
가중치 중 크기가 작은 값을 0으로 만들어 모델 구조를 줄이는 기법이다
### choice: a
높은 정밀도의 값을 적은 비트의 정수로 대응시켜 메모리와 연산을 줄인다
### choice: d
원래 가중치를 고정하고 저랭크 행렬 두 개만 학습시킨다
### choice: c
큰 모델의 출력을 작은 모델이 그대로 따라 하게 학습시킨다

## question: ai-written-01-q093
```json
{
  "title": "대칭 INT8 양자화 계산",
  "topics": [
    "efficiency"
  ],
  "tags": [
    "quantization"
  ],
  "group": "efficiency",
  "type": "mc",
  "id": "ai-written-01-q093",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/ai-5-1_리소스_효율적_학습법.md 양자화"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
가중치의 절댓값 최댓값이 2.54일 때 대칭 INT8 양자화의 스케일 $s = \max|x| / 127$을 쓰면 값 1.0은 정수 몇으로 변환되는가?
### choice: b
127
### choice: a
50
### choice: c
100
### choice: d
25

## question: ai-written-01-q094
```json
{
  "title": "PTQ와 QAT",
  "topics": [
    "efficiency"
  ],
  "tags": [
    "ptq-qat"
  ],
  "group": "efficiency",
  "type": "mc",
  "id": "ai-written-01-q094",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/ai-5-1_리소스_효율적_학습법.md 양자화"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
대규모 언어모델을 재학습 없이 빠르게 줄이려 한다. 먼저 시도할 방법과 이유는?
### choice: b
QAT이다. 학습 중 양자화를 흉내 내므로 추가 학습 비용이 들지 않는다
### choice: d
PTQ이다. 전체 모델을 처음부터 다시 학습해야 정확도가 유지된다
### choice: c
QAT이다. 학습 없이 적용할 수 있고 PTQ보다 항상 간단하다
### choice: a
PTQ이다. 학습이 끝난 모델을 보정 자료로 바로 양자화하므로 재학습이 필요 없다

## question: ai-written-01-q095
```json
{
  "title": "비구조적 가지치기와 GPU",
  "topics": [
    "efficiency"
  ],
  "tags": [
    "pruning"
  ],
  "group": "efficiency",
  "type": "mc",
  "id": "ai-written-01-q095",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/ai-5-1_리소스_효율적_학습법.md 가지치기"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
비구조적 가지치기로 가중치를 80% 제거했는데 GPU 속도가 거의 빨라지지 않았다. 이유로 알맞은 것은?
### choice: b
가지치기는 비트 수를 줄이는 기법이라 속도와 관계가 없기 때문이다
### choice: c
GPU는 희소 행렬을 항상 밀집 행렬보다 빠르게 처리하기 때문이다
### choice: d
가지치기를 하면 파라미터 수와 모델 크기가 오히려 더 늘어나 메모리 사용량도 커지기 때문이다
### choice: a
제거 위치가 불규칙한 희소 행렬이라 GPU에서 이득을 얻기 어렵기 때문이다

## question: ai-written-01-q096
```json
{
  "title": "구조적 가지치기",
  "topics": [
    "efficiency"
  ],
  "tags": [
    "pruning"
  ],
  "group": "efficiency",
  "type": "mc",
  "id": "ai-written-01-q096",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/ai-5-1_리소스_효율적_학습법.md 가지치기"
  ],
  "difficulty": 3,
  "correctChoiceId": "a"
}
```
### stem
구조적 가지치기에 대한 설명으로 옳은 것은?
### choice: a
채널이나 필터를 단위로 제거해 GPU에서도 빨라지지만 제거 비율이 낮다
### choice: d
남은 가중치를 더 낮은 비트 수로 바꿔 저장하는 방식이다
### choice: b
개별 가중치 단위로 제거하므로 매우 높은 비율로 제거해도 정확도가 유지된다
### choice: c
제거한 뒤에도 정확도 회복을 위한 재학습이 전혀 필요 없다

## question: ai-written-01-q097
```json
{
  "title": "지식 증류의 손실",
  "topics": [
    "efficiency"
  ],
  "tags": [
    "distillation"
  ],
  "group": "efficiency",
  "type": "mc",
  "id": "ai-written-01-q097",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/ai-5-1_리소스_효율적_학습법.md 지식 증류"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
지식 증류에서 학생 모델의 전체 손실로 알맞은 것은?
### choice: a
정답 손실에 선생님의 부드러운 출력을 따르는 증류 손실을 더한 값이다
### choice: c
증류 손실만 사용하고 정답 라벨과의 손실은 쓰지 않는 값이다
### choice: b
선생님 모델의 가중치를 학생에게 그대로 복사한 뒤 얻은 값이다
### choice: d
선생님이 클수록 학생 정확도가 항상 더 높아진다는 가정에 따라 정한 값이다

## question: ai-written-01-q098
```json
{
  "title": "PEFT 방법의 비교",
  "topics": [
    "efficiency"
  ],
  "tags": [
    "peft-overview"
  ],
  "group": "efficiency",
  "type": "mc",
  "id": "ai-written-01-q098",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/ai-5-1_리소스_효율적_학습법.md 파인튜닝"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
전체 파인튜닝과 PEFT에 대한 설명으로 옳은 것은?
### choice: b
전체 파인튜닝은 가중치를 고정하고 프롬프트만 바꾸는 방식이다
### choice: d
PEFT는 전체 파인튜닝보다 언제나 정확도가 높고 비용도 큰 방식이다
### choice: a
전체 파인튜닝은 모든 가중치를 갱신하고 PEFT는 일부만 학습한다
### choice: c
PEFT는 모든 가중치를 학습하되 비트 수만 줄이는 방식이다

## question: ai-written-01-q099
```json
{
  "title": "LoRA의 파라미터 수",
  "topics": [
    "efficiency"
  ],
  "tags": [
    "lora"
  ],
  "group": "efficiency",
  "type": "mc",
  "id": "ai-written-01-q099",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/ai-5-1_리소스_효율적_학습법.md LoRA"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
$4096 \times 4096$ 가중치에 랭크 $r = 16$인 LoRA를 붙일 때 학습 파라미터 수는? ($B \in \mathbb{R}^{d \times r}$, $A \in \mathbb{R}^{r \times k}$)
### choice: b
16,777,216개
### choice: d
262,144개
### choice: a
131,072개
### choice: c
65,536개

## question: ai-written-01-q100
```json
{
  "title": "QLoRA와 설정",
  "topics": [
    "efficiency"
  ],
  "tags": [
    "qlora-config"
  ],
  "group": "efficiency",
  "type": "mc",
  "id": "ai-written-01-q100",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/md/ai-5-1_리소스_효율적_학습법.md PEFT 실습"
  ],
  "difficulty": 2,
  "correctChoiceId": "a"
}
```
### stem
QLoRA와 LoRA 설정에 대한 설명으로 옳은 것은?
### choice: b
베이스 모델을 FP32로 되돌려 학습하며 어댑터는 마지막 출력층에만 붙인다
### choice: a
베이스 모델을 4비트로 양자화하고 어텐션 층에 붙인 어댑터만 학습한다
### choice: d
`r`이 작을수록 어댑터의 표현력과 파라미터 수가 모두 늘어난다
### choice: c
어댑터를 학습하지 않고 4비트 모델을 그대로 추론에만 사용한다
