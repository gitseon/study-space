## question: ai-practical-01-q01
```json
{
  "title": "품종 비율을 유지하는 분할",
  "topics": [
    "ml"
  ],
  "tags": [
    "data-split"
  ],
  "group": "ml",
  "type": "code",
  "language": "python",
  "id": "ai-practical-01-q01",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/AI 역량 평가_실기검정_Questions_sample.md 1번의 형식을 참고하고 1-1 학습과 검증 자료의 분할 개념을 쓴다"
  ],
  "difficulty": 1,
  "rubric": [
    {
      "id": "r0",
      "criterion": "클래스별 개수를 0, 1 순서로 정렬해 Series로 저장한다",
      "points": 4
    },
    {
      "id": "r1",
      "criterion": "`train_test_split`에 `test_size=0.25`와 `random_state=23`을 쓴다",
      "points": 4
    },
    {
      "id": "r2",
      "criterion": "`stratify`에 `label` 열을 전달한다",
      "points": 2
    },
    {
      "id": "r3",
      "criterion": "모든 열과 기존 행 인덱스를 유지한다",
      "points": 2
    }
  ],
  "checks": [
    "assert counts.index.tolist() == [0, 1]",
    "assert int(counts.sum()) == 569",
    "assert len(train_df) + len(valid_df) == 569",
    "assert list(train_df.columns) == list(dev.columns)",
    "assert set(train_df.index).isdisjoint(valid_df.index)",
    "assert abs(train_df['label'].mean() - dev['label'].mean()) < 0.01",
    "assert len(valid_df) == 143"
  ],
  "modelAnswer": "`value_counts()`는 빈도순으로 정렬되므로 `sort_index()`로 클래스 번호 순서를 맞춘다. 분할은 `train_test_split(dev, test_size=0.25, random_state=23, stratify=dev['label'])`로 하며 이 함수는 열과 행 인덱스를 그대로 유지한다.\n\n```python\ncounts = dev['label'].value_counts()\ncounts = counts.sort_index()\n\ntrain_df, valid_df = train_test_split(\n    dev,\n    test_size=0.25,\n    random_state=23,\n    stratify=dev['label'],\n)\n```"
}
```
### stem
**1. 품종 비율을 유지하는 분할 (12점)**

유방암 조직 검사 자료로 종양이 양성(1)인지 악성(0)인지 분류하는 실습이다. 특성은 수치 30개이며 정답 열은 `label`이다. 이 문항은 다른 문항의 답안을 사용하지 않는다. 정확도가 특정 값에 도달하는 것은 정답 조건이 아니며 요구한 처리를 수행했는지로 채점한다.

`dev`는 569개 시료가 담긴 pandas DataFrame이다. 한 행이 시료 하나이다. 클래스별 개수를 확인하고 전체의 75%를 학습용, 25%를 검증용으로 나눈다. 두 자료에 클래스가 비슷한 비율로 들어가야 한다.

(a) [4점] `dev`에서 클래스별 시료 수를 세어 `counts`에 저장한다. 클래스 0, 1 순서로 정렬된 pandas Series여야 한다.

(b) [8점] `train_test_split`으로 `dev`를 나누어 `train_df`와 `valid_df`에 저장한다. `test_size=0.25`와 `random_state=23`을 쓰고 `stratify`에는 클래스 정답을 전달한다. 모든 열과 기존 행 인덱스를 유지한다.

준비 코드 (실행만 하세요)

```python
import pandas as pd
from sklearn.datasets import (
    load_breast_cancer,
)

data = load_breast_cancer(
    as_frame=True)
dev = data.frame.rename(
    columns={'target': 'label'})
from sklearn.model_selection import (
    train_test_split,
)

print('dev:', dev.shape)
```

답안 작성

```python
# (a) 클래스별 개수
counts = None

# (b) 학습용과 검증용 분할
train_df = None
valid_df = None
```

## question: ai-practical-01-q02
```json
{
  "title": "클래스별 측정값의 평균과 분포",
  "topics": [
    "ml"
  ],
  "tags": [
    "feature-label"
  ],
  "group": "ml",
  "type": "code",
  "language": "python",
  "id": "ai-practical-01-q02",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/AI 역량 평가_실기검정_Questions_sample.md 2번의 형식을 참고하고 1-1 데이터 구성요소 개념을 쓴다"
  ],
  "difficulty": 1,
  "rubric": [
    {
      "id": "r0",
      "criterion": "`groupby('label')`로 클래스별 평균을 구한다",
      "points": 2
    },
    {
      "id": "r1",
      "criterion": "열을 두 개로 지정하고 순서를 지킨다",
      "points": 3
    },
    {
      "id": "r2",
      "criterion": "`ax.scatter`로 가로축 `mean radius`와 세로축 `mean texture`를 그린다",
      "points": 3
    },
    {
      "id": "r3",
      "criterion": "점의 색을 `label`로 지정한다",
      "points": 2
    }
  ],
  "checks": [
    "assert group_mean.index.tolist() == [0, 1]",
    "assert list(group_mean.columns) == ['mean radius', 'mean texture']",
    "assert abs(group_mean.loc[0, 'mean radius'] - stats_df[stats_df['label'] == 0]['mean radius'].mean()) < 1e-9",
    "assert len(ax.collections) >= 1",
    "assert ax.collections[0].get_array() is not None",
    "assert list(ax.collections[0].get_array()) == list(stats_df['label'])"
  ],
  "modelAnswer": "`groupby('label')` 뒤에 열 목록 `['mean radius', 'mean texture']`를 지정하고 `mean()`을 호출한다. 산점도는 `ax.scatter(x, y, c=label)`로 그리며 `c`에 클래스 번호를 넘기면 색이 클래스별로 달라진다.\n\n```python\ngroup_mean = stats_df.groupby('label')[\n    ['mean radius', 'mean texture']\n].mean()\n\nfig, ax = plt.subplots(\n    figsize=(5, 3.5))\nax.scatter(\n    stats_df['mean radius'],\n    stats_df['mean texture'],\n    c=stats_df['label'],\n)\nax.set_xlabel('Mean radius')\nax.set_ylabel('Mean texture')\nplt.show()\n```"
}
```
### stem
**2. 클래스별 측정값의 평균과 분포 (10점)**

유방암 조직 검사 자료로 종양이 양성(1)인지 악성(0)인지 분류하는 실습이다. 특성은 수치 30개이며 정답 열은 `label`이다. 이 문항은 다른 문항의 답안을 사용하지 않는다. 정확도가 특정 값에 도달하는 것은 정답 조건이 아니며 요구한 처리를 수행했는지로 채점한다.

`stats_df`는 별도로 제공하는 시료 300개의 측정값이다. `mean radius`와 `mean texture`가 클래스에 따라 어떻게 다른지 확인한다.

(a) [5점] 클래스별로 `mean radius`와 `mean texture`의 평균을 계산해 `group_mean`에 저장한다. 행 인덱스는 클래스 0, 1 순서이고 두 열은 위에 적힌 순서로 둔다.

(b) [5점] 제공된 좌표축 `ax`에 산점도를 그린다. 가로축은 `mean radius`, 세로축은 `mean texture`이며 점의 색은 `label`에 따라 달라야 한다. 클래스 번호를 수치 측정값에 합치거나 평균으로 바꾸지 않는다.

준비 코드 (실행만 하세요)

```python
import pandas as pd
from sklearn.datasets import (
    load_breast_cancer,
)

data = load_breast_cancer(
    as_frame=True)
dev = data.frame.rename(
    columns={'target': 'label'})
import matplotlib.pyplot as plt

stats_df = dev.iloc[:300]
print('시료 수:', len(stats_df))
```

답안 작성

```python
# (a) 클래스별 두 측정값의 평균
group_mean = None

# (b) 산점도
fig, ax = plt.subplots(
    figsize=(5, 3.5))
# 산점도를 그리는 코드를 작성한다.
ax.set_xlabel('Mean radius')
ax.set_ylabel('Mean texture')
plt.show()
```

## question: ai-practical-01-q03
```json
{
  "title": "로지스틱 회귀 학습과 확률 예측",
  "topics": [
    "ml"
  ],
  "tags": [
    "logistic-regression"
  ],
  "group": "ml",
  "type": "code",
  "language": "python",
  "id": "ai-practical-01-q03",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/AI 역량 평가_실기검정_Questions_sample.md 3번의 형식을 참고하고 1-2 로지스틱 회귀 개념을 쓴다"
  ],
  "difficulty": 2,
  "rubric": [
    {
      "id": "r0",
      "criterion": "`LogisticRegression(max_iter=1000)`으로 모델을 만든다",
      "points": 2
    },
    {
      "id": "r1",
      "criterion": "`fit`을 `X_train`과 `y_train`으로만 호출한다",
      "points": 4
    },
    {
      "id": "r2",
      "criterion": "`predict_proba`를 사용한다",
      "points": 3
    },
    {
      "id": "r3",
      "criterion": "클래스 1의 열(`[:, 1]`)을 골라 1차원 배열로 저장한다",
      "points": 3
    }
  ],
  "checks": [
    "assert clf.max_iter == 1000",
    "assert clf.classes_.tolist() == [0, 1]",
    "assert proba.shape == (143,)",
    "assert 0 <= proba.min() <= proba.max() <= 1",
    "assert ((proba >= 0.5).astype(int) == clf.predict(X_valid)).all()",
    "assert hasattr(clf, 'coef_')"
  ],
  "modelAnswer": "`clf = LogisticRegression(max_iter=1000)` 후 `clf.fit(X_train, y_train)`을 호출한다. `predict_proba`는 클래스 0과 1의 확률을 열로 가진 (143, 2) 배열을 돌려주므로 클래스 1의 열인 `[:, 1]`을 고른다.\n\n```python\nclf = LogisticRegression(max_iter=1000)\nclf.fit(X_train, y_train)\n\nproba = clf.predict_proba(X_valid)[:, 1]\n```"
}
```
### stem
**3. 로지스틱 회귀 학습과 확률 예측 (12점)**

유방암 조직 검사 자료로 종양이 양성(1)인지 악성(0)인지 분류하는 실습이다. 특성은 수치 30개이며 정답 열은 `label`이다. 이 문항은 다른 문항의 답안을 사용하지 않는다. 정확도가 특정 값에 도달하는 것은 정답 조건이 아니며 요구한 처리를 수행했는지로 채점한다.

표준화된 입력 `X_train`(426행)과 `X_valid`(143행), 정답 `y_train`과 `y_valid`가 준비되어 있다. 로지스틱 회귀로 양성(1)일 확률을 예측한다. 이전 문항의 답안은 필요하지 않다.

(a) [6점] `LogisticRegression`으로 `max_iter=1000`인 모델 `clf`를 만들어 `X_train`과 `y_train`으로 학습한다.

(b) [6점] 학습한 모델로 `X_valid`가 양성(클래스 1)일 확률을 구해 `proba`에 저장한다. `proba`는 길이 143의 1차원 배열이다. 검증 정답으로 모델을 추가 학습하지 않는다.

준비 코드 (실행만 하세요)

```python
import pandas as pd
from sklearn.datasets import (
    load_breast_cancer,
)

data = load_breast_cancer(
    as_frame=True)
dev = data.frame.rename(
    columns={'target': 'label'})
from sklearn.model_selection import (
    train_test_split,
)
from sklearn.preprocessing import (
    StandardScaler,
)

cols = [c for c in dev.columns
        if c != 'label']
tr, va = train_test_split(
    dev, test_size=0.25,
    random_state=23,
    stratify=dev['label'])
sc = StandardScaler().fit(tr[cols])
X_train = sc.transform(tr[cols])
X_valid = sc.transform(va[cols])
y_train = tr['label'].to_numpy()
y_valid = va['label'].to_numpy()
from sklearn.linear_model import (
    LogisticRegression,
)

print(X_train.shape, X_valid.shape)
```

답안 작성

```python
# (a) 모델 생성과 학습
clf = None

# (b) 검증 시료의 양성 확률
proba = None
```

## question: ai-practical-01-q04
```json
{
  "title": "정밀도와 재현율과 AUC 계산",
  "topics": [
    "ml"
  ],
  "tags": [
    "classification-metrics",
    "roc-auc"
  ],
  "group": "ml",
  "type": "code",
  "language": "python",
  "id": "ai-practical-01-q04",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/AI 역량 평가_실기검정_Questions_sample.md 4번의 형식을 참고하고 1-2 모델 평가 개념을 쓴다"
  ],
  "difficulty": 2,
  "rubric": [
    {
      "id": "r0",
      "criterion": "0.5 기준 비교로 0과 1의 정수 예측을 만든다",
      "points": 4
    },
    {
      "id": "r1",
      "criterion": "`precision_score`로 정밀도를 구한다",
      "points": 2
    },
    {
      "id": "r2",
      "criterion": "`recall_score`로 재현율을 구한다",
      "points": 2
    },
    {
      "id": "r3",
      "criterion": "`roc_auc_score`를 쓴다",
      "points": 3
    },
    {
      "id": "r4",
      "criterion": "AUC에 예측 클래스가 아니라 확률 `proba`를 넣는다",
      "points": 3
    }
  ],
  "checks": [
    "assert set(np.unique(pred)) <= {0, 1}",
    "assert pred.dtype.kind == 'i'",
    "assert (pred == (proba >= 0.5)).all()",
    "tp = ((pred == 1) & (y_true == 1)).sum()",
    "assert abs(precision - tp / pred.sum()) < 1e-9",
    "assert abs(recall - tp / (y_true == 1).sum()) < 1e-9",
    "assert 0.5 < auc <= 1",
    "assert abs(auc - roc_auc_score(y_true, proba)) < 1e-12",
    "assert abs(auc - roc_auc_score(y_true, pred)) > 1e-6"
  ],
  "modelAnswer": "비교 결과인 불리언 배열을 `astype(int)`로 바꿔 `pred`를 만든다. `precision_score`와 `recall_score`는 기본으로 클래스 1을 양성으로 본다. `roc_auc_score`에는 임계값을 적용하기 전의 확률을 넣어야 임계값에 따른 곡선 전체를 반영한다.\n\n```python\npred = (proba >= 0.5).astype(int)\n\nprecision = precision_score(y_true, pred)\nrecall = recall_score(y_true, pred)\n\nauc = roc_auc_score(y_true, proba)\n```"
}
```
### stem
**4. 정밀도와 재현율과 AUC 계산 (14점)**

유방암 조직 검사 자료로 종양이 양성(1)인지 악성(0)인지 분류하는 실습이다. 특성은 수치 30개이며 정답 열은 `label`이다. 이 문항은 다른 문항의 답안을 사용하지 않는다. 정확도가 특정 값에 도달하는 것은 정답 조건이 아니며 요구한 처리를 수행했는지로 채점한다.

한 분류기의 검증 결과를 따로 제공한다. `y_true`는 실제 클래스(0 또는 1), `proba`는 양성일 확률이며 길이는 60이다. 이전 문항의 답안은 필요하지 않다.

(a) [4점] 확률이 0.5 이상이면 1, 아니면 0인 예측 `pred`를 만든다. 정수 배열이어야 한다.

(b) [4점] `pred`로 정밀도 `precision`과 재현율 `recall`을 구한다. 양성은 클래스 1이다.

(c) [6점] `y_true`와 `proba`로 ROC 곡선 아래 면적 `auc`를 구한다. 예측 클래스가 아니라 확률을 사용한다.

준비 코드 (실행만 하세요)

```python
import numpy as np
from sklearn.metrics import (
    precision_score,
    recall_score,
    roc_auc_score,
)

rng = np.random.RandomState(7)
y_true = rng.randint(0, 2, 60)
proba = np.clip(
    0.5 * y_true
    + rng.uniform(0, 0.55, 60),
    0, 1)
print('시료 수:', len(y_true))
```

답안 작성

```python
# (a) 0.5 기준 예측
pred = None

# (b) 정밀도와 재현율
precision = None
recall = None

# (c) ROC AUC
auc = None
```

## question: ai-practical-01-q05
```json
{
  "title": "이진 분류 신경망 구성",
  "topics": [
    "ml"
  ],
  "tags": [
    "nn-expressivity"
  ],
  "group": "ml",
  "type": "code",
  "language": "python",
  "id": "ai-practical-01-q05",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/AI 역량 평가_실기검정_Questions_sample.md 5번의 형식을 참고하고 1-2 MLP 구현 실습 개념을 쓴다"
  ],
  "difficulty": 2,
  "rubric": [
    {
      "id": "r0",
      "criterion": "`nn.Sequential`에 Linear(30, 16), ReLU, Linear(16, 1)을 순서대로 둔다",
      "points": 4
    },
    {
      "id": "r1",
      "criterion": "모델 끝에 Sigmoid를 넣지 않는다",
      "points": 2
    },
    {
      "id": "r2",
      "criterion": "`nn.BCEWithLogitsLoss()`를 쓴다",
      "points": 4
    },
    {
      "id": "r3",
      "criterion": "`Adam`에 `net.parameters()`를 전달한다",
      "points": 2
    },
    {
      "id": "r4",
      "criterion": "학습률을 0.001로 지정한다",
      "points": 2
    }
  ],
  "checks": [
    "out = net(xb)",
    "assert tuple(out.shape) == (8, 1)",
    "assert sum(p.numel() for p in net.parameters()) == 30 * 16 + 16 + 16 + 1",
    "assert isinstance(net[1], nn.ReLU)",
    "assert not any(isinstance(m, nn.Sigmoid) for m in net)",
    "assert isinstance(loss_fn, nn.BCEWithLogitsLoss)",
    "assert loss_fn(out, yb).ndim == 0",
    "assert isinstance(optimizer, torch.optim.Adam)",
    "assert abs(optimizer.param_groups[0]['lr'] - 0.001) < 1e-12",
    "assert len(optimizer.param_groups[0]['params']) == len(list(net.parameters()))"
  ],
  "modelAnswer": "층의 순서와 크기는 문제에 적힌 대로이다. `BCEWithLogitsLoss`가 내부에서 시그모이드를 계산하므로 모델 끝에는 Linear만 둔다. 옵티마이저에는 `net.parameters()`를 넘겨 모든 가중치가 갱신되게 한다.\n\n```python\nnet = nn.Sequential(\n    nn.Linear(30, 16),\n    nn.ReLU(),\n    nn.Linear(16, 1),\n)\n\nloss_fn = nn.BCEWithLogitsLoss()\n\noptimizer = torch.optim.Adam(\n    net.parameters(), lr=0.001)\n```"
}
```
### stem
**5. 이진 분류 신경망 구성 (14점)**

유방암 조직 검사 자료로 종양이 양성(1)인지 악성(0)인지 분류하는 실습이다. 특성은 수치 30개이며 정답 열은 `label`이다. 이 문항은 다른 문항의 답안을 사용하지 않는다. 정확도가 특정 값에 도달하는 것은 정답 조건이 아니며 요구한 처리를 수행했는지로 채점한다.

입력 30개를 받아 양성일 점수 하나를 출력하는 작은 신경망을 만든다. 구조는 입력 30개, Linear(출력 16개), ReLU, Linear(출력 1개)이다. 시료 B개를 넣으면 출력은 (B, 1)이다.

출력은 아직 확률이 아닌 점수(logit)이다. 이어서 쓸 `BCEWithLogitsLoss`는 점수와 0 또는 1의 실수 정답을 바로 받는다. 모델 마지막에 Sigmoid를 추가하지 않는다. 이전 문항의 답안은 필요하지 않다.

(a) [6점] `nn.Sequential`로 위 구조의 신경망을 만들어 `net`에 저장한다.

(b) [4점] 이진 분류 손실 함수 `nn.BCEWithLogitsLoss`를 만들어 `loss_fn`에 저장한다.

(c) [4점] `net`의 전체 가중치를 갱신하는 `torch.optim.Adam`을 만들어 `optimizer`에 저장한다. 학습률은 0.001이다.

준비 코드 (실행만 하세요)

```python
import torch
from torch import nn

torch.manual_seed(23)

xb = torch.randn(8, 30)
yb = torch.randint(0, 2, (8, 1))
yb = yb.float()
print(xb.shape, yb.shape)
```

답안 작성

```python
# (a) 분류 신경망
net = None

# (b) 손실 함수
loss_fn = None

# (c) 가중치 갱신 방법
optimizer = None
```

## question: ai-practical-01-q06
```json
{
  "title": "반복 학습과 조기 종료 기록",
  "topics": [
    "ml"
  ],
  "tags": [
    "backprop-loop"
  ],
  "group": "ml",
  "type": "code",
  "language": "python",
  "id": "ai-practical-01-q06",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/AI 역량 평가_실기검정_Questions_sample.md 6번의 형식을 참고하고 1-2 역전파와 학습 루프 개념을 쓴다"
  ],
  "difficulty": 3,
  "rubric": [
    {
      "id": "r0",
      "criterion": "`range(1, 101)`로 1부터 시작하는 epoch 반복문을 만든다",
      "points": 3
    },
    {
      "id": "r1",
      "criterion": "학습 함수를 호출한 뒤 검증 손실을 구한다",
      "points": 3
    },
    {
      "id": "r2",
      "criterion": "세 키를 가진 딕셔너리를 `history`에 추가한다",
      "points": 4
    },
    {
      "id": "r3",
      "criterion": "검증 손실이 가장 낮은 epoch를 `best_epoch`에 저장한다",
      "points": 3
    },
    {
      "id": "r4",
      "criterion": "5 epoch 연속 개선이 없으면 `break`하고 `stopped_epoch`에 저장한다",
      "points": 3
    }
  ],
  "checks": [
    "assert len(history) == stopped_epoch",
    "assert [h['epoch'] for h in history] == list(range(1, stopped_epoch + 1))",
    "assert all(set(h) == {'epoch', 'train_loss', 'valid_loss'} for h in history)",
    "vl = [h['valid_loss'] for h in history]",
    "assert best_epoch == vl.index(min(vl)) + 1",
    "assert stopped_epoch == 100 or stopped_epoch - best_epoch == 5",
    "assert stopped_epoch <= 100"
  ],
  "modelAnswer": "반복마다 학습 손실과 검증 손실을 순서대로 구해 딕셔너리로 기록한다. 검증 손실이 지금까지의 최솟값보다 작으면 최솟값과 `best_epoch`를 갱신하고 대기 횟수를 0으로 되돌리며, 그렇지 않으면 대기 횟수를 1 늘린다. 대기 횟수가 5가 되는 epoch에서 `stopped_epoch`를 저장하고 `break`한다.\n\n```python\nhistory = []\nbest, best_epoch, wait = float('inf'), 0, 0\nstopped_epoch = 100\nfor epoch in range(1, 101):\n    tr_loss = train_one_epoch(\n        net, loader, crit, opt)\n    va_loss = validation_loss(\n        net, xv, yv, crit)\n    history.append({\n        'epoch': epoch,\n        'train_loss': tr_loss,\n        'valid_loss': va_loss,\n    })\n    if va_loss < best:\n        best, best_epoch, wait = (\n            va_loss, epoch, 0)\n    else:\n        wait += 1\n        if wait >= 5:\n            stopped_epoch = epoch\n            break\n```"
}
```
### stem
**6. 반복 학습과 조기 종료 기록 (16점)**

유방암 조직 검사 자료로 종양이 양성(1)인지 악성(0)인지 분류하는 실습이다. 특성은 수치 30개이며 정답 열은 `label`이다. 이 문항은 다른 문항의 답안을 사용하지 않는다. 정확도가 특정 값에 도달하는 것은 정답 조건이 아니며 요구한 처리를 수행했는지로 채점한다.

작은 신경망 `net`과 학습 자료 `loader`, 검증 입력 `xv`와 정답 `yv`가 준비되어 있다. 준비 셀의 두 함수는 완성되어 있으므로 수정하지 않는다.

- `train_one_epoch(model, data, crit, opt)`: 1 epoch 학습하고 평균 학습 손실을 실수로 반환한다.
- `validation_loss(model, x, y, crit)`: 검증 손실을 실수로 반환하며 가중치는 바꾸지 않는다.

(a) [10점] `for` 반복문으로 최대 100 epoch를 학습한다. 매 epoch마다 학습 함수를 먼저 호출하고 그다음 검증 손실을 구한다. 두 손실을 `tr_loss`와 `va_loss`에 저장한 뒤 `epoch`, `train_loss`, `valid_loss` 세 키를 가진 딕셔너리를 `history`에 추가한다. `epoch`는 1부터 시작한다.

(b) [6점] 조기 종료를 적용한다. 검증 손실이 가장 낮았던 epoch를 `best_epoch`에 저장하고, 그 뒤로 5 epoch 연속 개선되지 않으면 반복을 멈춘다. 멈춘 epoch 번호를 `stopped_epoch`에 저장한다. 100 epoch까지 멈추지 않았다면 100이다.

준비 코드 (실행만 하세요)

```python
import torch
from torch import nn

torch.manual_seed(23)
from torch.utils.data import (
    DataLoader, TensorDataset,
)

X = torch.randn(200, 30)
y = (X[:, 0] > 0).float()[:, None]
loader = DataLoader(
    TensorDataset(X[:160], y[:160]),
    batch_size=16, shuffle=True,
    generator=torch.Generator()
    .manual_seed(23))
xv, yv = X[160:], y[160:]
net = nn.Sequential(
    nn.Linear(30, 8), nn.ReLU(),
    nn.Linear(8, 1))
crit = nn.BCEWithLogitsLoss()
opt = torch.optim.Adam(
    net.parameters(), lr=0.01)


def train_one_epoch(
        model, data, crit, opt):
    model.train()
    total, count = 0.0, 0
    for bx, by in data:
        opt.zero_grad()
        loss = crit(model(bx), by)
        loss.backward()
        opt.step()
        total += loss.item() * len(by)
        count += len(by)
    return total / count


def validation_loss(
        model, x, y, crit):
    model.eval()
    with torch.no_grad():
        out = model(x)
        return crit(out, y).item()
```

답안 작성

```python
# (a) 반복 학습과 기록
history = []
# 반복문과 기록 코드를 작성한다.

# (b) 조기 종료
best_epoch = None
stopped_epoch = None
```

## question: ai-practical-01-q07
```json
{
  "title": "드롭아웃 모델과 평가 모드 예측",
  "topics": [
    "vision"
  ],
  "tags": [
    "regularization"
  ],
  "group": "vision",
  "type": "code",
  "language": "python",
  "id": "ai-practical-01-q07",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/AI 역량 평가_실기검정_Questions_sample.md 7번의 형식을 참고하고 3-1 모델 정규화 개념을 쓴다"
  ],
  "difficulty": 2,
  "rubric": [
    {
      "id": "r0",
      "criterion": "`Linear(30, 24)`, `ReLU`, `Dropout`, `Linear(24, 1)`을 순서대로 둔다",
      "points": 4
    },
    {
      "id": "r1",
      "criterion": "`nn.Dropout(p=0.2)`를 ReLU 바로 뒤에 둔다",
      "points": 2
    },
    {
      "id": "r2",
      "criterion": "`model.eval()`로 평가 모드를 켠다",
      "points": 2
    },
    {
      "id": "r3",
      "criterion": "`torch.no_grad()` 안에서 예측한다",
      "points": 2
    }
  ],
  "checks": [
    "assert isinstance(drop_net[1], nn.ReLU)",
    "assert isinstance(drop_net[2], nn.Dropout)",
    "assert abs(drop_net[2].p - 0.2) < 1e-12",
    "o1 = predict_scores(drop_net, sample_x)",
    "o2 = predict_scores(drop_net, sample_x)",
    "assert tuple(o1.shape) == (4, 1)",
    "assert torch.allclose(o1, o2)",
    "assert not o1.requires_grad",
    "assert not drop_net.training"
  ],
  "modelAnswer": "Dropout은 ReLU 바로 뒤에 `nn.Dropout(p=0.2)`로 둔다. 예측 함수에서는 `model.eval()`로 드롭아웃을 끄고 `torch.no_grad()` 안에서 `model(x)`를 계산한다. 둘은 역할이 다르므로 모두 필요하다.\n\n```python\ndrop_net = nn.Sequential(\n    nn.Linear(30, 24),\n    nn.ReLU(),\n    nn.Dropout(p=0.2),\n    nn.Linear(24, 1),\n)\n\n\ndef predict_scores(model, x):\n    model.eval()\n    with torch.no_grad():\n        out = model(x)\n    return out\n```"
}
```
### stem
**7. 드롭아웃 모델과 평가 모드 예측 (10점)**

유방암 조직 검사 자료로 종양이 양성(1)인지 악성(0)인지 분류하는 실습이다. 특성은 수치 30개이며 정답 열은 `label`이다. 이 문항은 다른 문항의 답안을 사용하지 않는다. 정확도가 특정 값에 도달하는 것은 정답 조건이 아니며 요구한 처리를 수행했는지로 채점한다.

학습 자료에 지나치게 맞추는 현상을 줄이려고 드롭아웃을 쓴다. 새 모델은 입력 30개를 받아 출력 24개인 Linear, ReLU, Dropout, 출력 1개인 Linear 순서이다. `sample_x`는 형태가 (4, 30)인 입력 텐서이다. 성능 비교나 추가 학습은 하지 않는다.

(a) [6점] `nn.Sequential`로 위 구조의 모델을 만들어 `drop_net`에 저장한다. 드롭아웃 확률 `p`는 0.2이고 ReLU 바로 뒤에 둔다.

(b) [4점] 함수 `predict_scores(model, x)`를 완성한다. 전달받은 모델을 평가 모드로 바꾸고 기울기 계산 기록을 하지 않는 범위에서 `x`에 대한 점수를 구해 `out`에 저장한다. 제공된 `return out`으로 반환한다. 확률로 바꾸거나 가중치를 갱신하지 않는다.

준비 코드 (실행만 하세요)

```python
import torch
from torch import nn

torch.manual_seed(23)

sample_x = torch.randn(4, 30)
print(tuple(sample_x.shape))
```

답안 작성

```python
# (a) 드롭아웃이 있는 신경망
drop_net = None


# (b) 평가 전용 예측 함수
def predict_scores(model, x):
    out = None
    # 평가 모드 설정과 예측 코드
    return out
```

## question: ai-practical-01-q08
```json
{
  "title": "재현율 목표에 맞는 임계값 선택",
  "topics": [
    "ml"
  ],
  "tags": [
    "classification-metrics"
  ],
  "group": "ml",
  "type": "code",
  "language": "python",
  "id": "ai-practical-01-q08",
  "revision": 1,
  "sourceRefs": [
    "source/AI역량검사/AI 역량 평가_실기검정_Questions_sample.md 8번의 형식을 참고하고 1-2 모델 평가와 로지스틱 회귀 개념을 쓴다"
  ],
  "difficulty": 3,
  "rubric": [
    {
      "id": "r0",
      "criterion": "임계값마다 확률을 비교해 예측을 만들고 재현율을 구한다",
      "points": 4
    },
    {
      "id": "r1",
      "criterion": "격자에서 재현율 0.9 이상인 값만 모아 가장 큰 값을 고른다",
      "points": 4
    },
    {
      "id": "r2",
      "criterion": "임계값을 낮추면 재현율이 오른다고 설명한다",
      "points": 2
    },
    {
      "id": "r3",
      "criterion": "정밀도는 대개 내려간다고 설명한다",
      "points": 2
    }
  ],
  "checks": [
    "def _r(t):\n    return recall_score(y_true, (proba >= t).astype(int))",
    "assert abs(recall_03 - _r(0.3)) < 1e-9",
    "assert abs(recall_05 - _r(0.5)) < 1e-9",
    "assert recall_03 >= recall_05",
    "_ok = [t for t in grid if _r(t) >= 0.9]",
    "assert abs(best_thr - max(_ok)) < 1e-9",
    "assert isinstance(explanation, str) and len(explanation) >= 20"
  ],
  "modelAnswer": "임계값을 받아 재현율을 돌려주는 함수를 만들어 0.3과 0.5에 적용한다. 격자 값마다 재현율을 구해 0.9 이상인 값만 남기고 그중 최댓값을 고른다. 임계값이 낮으면 양성 판정이 늘어 놓치는 양성이 줄지만 오탐이 늘어 정밀도가 내려가는 경향이 있다.\n\n```python\ndef recall_at(thr):\n    pred = (proba >= thr).astype(int)\n    return recall_score(y_true, pred)\n\n\nrecall_03 = recall_at(0.3)\nrecall_05 = recall_at(0.5)\n\nok = [t for t in grid\n      if recall_at(t) >= 0.9]\nbest_thr = max(ok)\n\nexplanation = (\n    '임계값을 낮추면 양성 판정이 늘어 '\n    '재현율은 오르고 오탐이 늘어 '\n    '정밀도는 대개 내려간다.')\n```"
}
```
### stem
**8. 재현율 목표에 맞는 임계값 선택 (12점)**

유방암 조직 검사 자료로 종양이 양성(1)인지 악성(0)인지 분류하는 실습이다. 특성은 수치 30개이며 정답 열은 `label`이다. 이 문항은 다른 문항의 답안을 사용하지 않는다. 정확도가 특정 값에 도달하는 것은 정답 조건이 아니며 요구한 처리를 수행했는지로 채점한다.

한 분류기가 검증 시료 60개에 대해 계산한 양성 확률 `proba`와 실제 클래스 `y_true`를 제공한다. 놓친 양성이 없도록 재현율을 우선하는 임계값을 고르려 한다. 확률이 임계값 이상이면 양성으로 판정한다. 이전 문항의 답안은 필요하지 않다.

(a) [4점] 임계값 0.3과 0.5에서 각각 재현율을 구해 `recall_03`과 `recall_05`에 저장한다.

(b) [4점] 후보 임계값 `grid`(0.05부터 0.95까지 0.05 간격) 중 재현율이 0.9 이상인 임계값 가운데 가장 큰 값을 `best_thr`에 저장한다.

(c) [4점] 임계값을 0.5에서 `best_thr`로 바꿀 때 정밀도와 재현율이 어떻게 달라지는 경향이 있는지 한두 문장으로 `explanation`에 문자열로 저장한다.

준비 코드 (실행만 하세요)

```python
import numpy as np
from sklearn.metrics import (
    precision_score,
    recall_score,
    roc_auc_score,
)

rng = np.random.RandomState(7)
y_true = rng.randint(0, 2, 60)
proba = np.clip(
    0.5 * y_true
    + rng.uniform(0, 0.55, 60),
    0, 1)

grid = np.round(
    np.arange(0.05, 0.96, 0.05), 2)
print(len(grid), grid[:3])
```

답안 작성

```python
# (a) 임계값별 재현율
recall_03 = None
recall_05 = None

# (b) 재현율 0.9 이상 중 가장 큰 임계값
best_thr = None

# (c) 해석
explanation = ''
```
