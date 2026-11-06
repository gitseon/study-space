import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {splitFlow} from '../../assets/project-flow.js';
import {EDITOR_NOTICE, ENV_NOTICE} from '../../assets/project-notices.js';

const SAMPLE = `# 월말평가 구현 흐름

## 전체 흐름

1. 첫째
2. 둘째

## 기능별 흐름

### 목록

\`/gear\` → list

### 등록

- 화면
- 저장

## 짝으로 기억할 것

| a | b |
| --- | --- |
| x | y |
`;

test('the flow note is split into an overview, one tab per feature and a pairs tab', () => {
  const tabs = splitFlow(SAMPLE);
  assert.deepEqual(tabs.map((t) => t.label), ['전체 흐름', '목록', '등록', '짝으로 기억할 것']);
  assert.match(tabs[0].md, /1\. 첫째/);
  assert.doesNotMatch(tabs[0].md, /기능별/);
  assert.match(tabs[1].md, /list/);
  assert.doesNotMatch(tabs[1].md, /화면/);
  assert.match(tabs[3].md, /\| x \| y \|/);
  assert.deepEqual(new Set(tabs.map((t) => t.id)).size, 4);
});

test('a flow without the expected headings still yields one overview tab', () => {
  const tabs = splitFlow('그냥 본문입니다.');
  assert.equal(tabs.length, 1);
  assert.equal(tabs[0].md.trim(), '그냥 본문입니다.');
});

test('the real flow note has every feature tab', () => {
  const source = readFileSync(new URL('../../source/backend/projects/web-01/flow.md', import.meta.url), 'utf8');
  const labels = splitFlow(source).map((t) => t.label);
  assert.deepEqual(labels, ['전체 흐름', '목록', '등록', '상세', '삭제', '로그인과 로그아웃', '필터와 오류 처리', '짝으로 기억할 것']);
});

test('the two notices keep their fixed wording', () => {
  assert.equal(ENV_NOTICE, '실행 환경: OpenJDK25U-jdk hotspot 25.0.3_9, Apache tomcat-11.0.27, Dynamic web module version 6.0, mysql 8.4.11');
  assert.equal(EDITOR_NOTICE, '자동완성 기능을 제공하지 않으니 Spring Tools for Eclipse 사용을 권장합니다.');
});
