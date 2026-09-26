import test from 'node:test';
import assert from 'node:assert/strict';
import {readdirSync, readFileSync} from 'node:fs';
import katex from 'katex';

globalThis.katex = katex;
const {summarize, needsReview} = await import('../../assets/grading.js');
const {createAttempt} = await import('../../assets/attempt.js');
const {inline, markdown} = await import('../../assets/render.js');

const mc = (id) => ({id, type: 'mc', correctChoiceId: 'b', choices: ['a', 'b', 'c', 'd'].map((c) => ({id: c, text: c}))});

test('summarize separates correct, wrong, unanswered and pending questions', () => {
  const questions = [mc('q1'), mc('q2'), mc('q3'), {id: 'e1', type: 'essay', rubric: [{id: 'r', points: 2}]}];
  const attempt = {answers: {q1: 'b', q2: 'a', e1: '설명'}, selfGrades: {}, overrides: {}};
  assert.deepEqual(summarize(questions, attempt), {total: 4, correct: 1, incorrect: 1, unanswered: 1, pending: 1, points: 1, maxPoints: 5});
  assert.equal(summarize(questions, {...attempt, answers: {q1: 'b'}}).unanswered, 3);
  attempt.selfGrades.e1 = [];
  assert.equal(summarize(questions, attempt).incorrect, 2);
  assert.equal(needsReview('unanswered'), true);
  assert.equal(needsReview('pending-review'), false);
});

test('both grading modes honour the chosen time limit', () => {
  const exam = {id: 'x', contentVersion: 'v', questions: [mc('q1')], defaultChoiceOrders: {}};
  assert.equal(createAttempt(exam, {mode: 'study', now: 0, durationMinutes: 2}).deadlineAt, 120000);
  assert.equal(createAttempt(exam, {mode: 'exam', now: 0, durationMinutes: 0}).deadlineAt, null);
});

test('inline renderer typesets math, keeps code literal and escapes HTML', () => {
  const html = inline('<b>$\\Theta(N^2)$</b> `a $x$ b`');
  assert.match(html, /class="katex"/);
  assert.match(html, /&lt;b&gt;/);
  assert.match(html, /<code>a \$x\$ b<\/code>/);
  assert.doesNotMatch(markdown('```java\nint $a = 1;\n```'), /katex/);
});

test('every formula in the published data renders without KaTeX errors', () => {
  const files = readdirSync(new URL('../../data/', import.meta.url)).filter((f) => f !== 'manifest.json');
  let count = 0;
  const visit = (value) => {
    if (typeof value === 'string') {
      const prose = value.replace(/```[\s\S]*?```/g, '').replace(/`[^`]*`/g, '');
      for (const [, tex] of prose.matchAll(/\$([^$]+)\$/g)) {
        assert.doesNotThrow(() => katex.renderToString(tex, {throwOnError: true, strict: 'error'}), tex);
        count++;
      }
    } else if (value && typeof value === 'object') {
      Object.values(value).forEach(visit);
    }
  };
  for (const file of files) {
    visit(JSON.parse(readFileSync(new URL('../../data/' + file, import.meta.url), 'utf8')));
  }
  assert.ok(count > 50, 'expected formulas in the question bank, found ' + count);
});
