## 변경 내용

## 검증 결과

- [ ] `python scripts/build_data.py` 후 `data/` 변경분을 함께 커밋했다
- [ ] `python scripts/validate_questions.py` 오류 0건
- [ ] `python scripts/audit_bias.py --strict` 미검토 경고 0건
- [ ] `python scripts/verify_code_answers.py` 전체 통과
- [ ] `python -m unittest discover -s tests/content`와 `npm test` 통과
- [ ] `npm run test:e2e` 통과

## 콘텐츠 변경 시 필수 기록

콘텐츠를 바꾸지 않았다면 이 절을 지운다.

- 범위와 문항 수:
- 회차별 정답 분포와 전체 분포 (reports/bias.json의 counts):
- 최대 연속 정답 길이:
- 길이 편향 검토 (경고 문항 ID와 처리 방법):
- 정답·해설 검수 방법 (직접 재풀이, 실행 결과 등):
- 수정한 문항 ID와 revision:
