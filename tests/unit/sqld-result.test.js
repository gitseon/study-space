import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';

const load = async () => {
  assert.ok(existsSync(new URL('../../assets/sqld-result.js', import.meta.url)), 'sqld-result is not implemented');
  return import('../../assets/sqld-result.js');
};

const subjects = {'1과목': ['model'], '2과목': ['sql']};
const questions = [
  ...Array.from({length: 10}, (_, i) => ({id: 'm' + i, type: 'mc', group: 'model', correctChoiceId: 'a', choices: [{id: 'a'}, {id: 'b'}]})),
  ...Array.from({length: 40}, (_, i) => ({id: 's' + i, type: 'mc', group: 'sql', correctChoiceId: 'a', choices: [{id: 'a'}, {id: 'b'}]})),
];
const attemptWith = (model, sql, extra = {}) => {
  const answers = {};
  questions.forEach((q) => {
    const index = Number(q.id.slice(1));
    const right = q.group === 'model' ? index < model : index < sql;
    answers[q.id] = right ? 'a' : 'b';
  });
  return {answers, selfGrades: {}, overrides: {}, submittedAt: 1, mode: 'exam', ...extra};
};

test('4 + 26 correct is exactly 60 points and passes', async () => {
  const {summarizeSqld} = await load();
  const r = summarizeSqld(questions, attemptWith(4, 26), subjects);
  assert.equal(r.score, 60);
  assert.equal(r.pass, true);
  assert.deepEqual(r.failedSubjects, []);
});

test('3 + 27 correct reaches 60 points but fails the first subject', async () => {
  const {summarizeSqld} = await load();
  const r = summarizeSqld(questions, attemptWith(3, 27), subjects);
  assert.equal(r.score, 60);
  assert.equal(r.pass, false);
  assert.deepEqual(r.failedSubjects, ['1과목']);
});

test('10 + 19 correct is 58 points and fails on the total', async () => {
  const {summarizeSqld} = await load();
  const r = summarizeSqld(questions, attemptWith(10, 19), subjects);
  assert.equal(r.score, 58);
  assert.equal(r.pass, false);
  assert.deepEqual(r.failedSubjects, []);
});

test('10 + 15 correct fails the second subject even with a perfect first subject', async () => {
  const {summarizeSqld} = await load();
  const r = summarizeSqld(questions, attemptWith(10, 15), subjects);
  assert.deepEqual(r.failedSubjects, ['2과목']);
  assert.equal(r.pass, false);
  assert.equal(r.perSubject.find((s) => s.name === '2과목').minCorrect, 16);
});

test('unanswered questions score zero and no pass is shown before submitting', async () => {
  const {summarizeSqld} = await load();
  const blank = summarizeSqld(questions, {answers: {}, selfGrades: {}, overrides: {}, submittedAt: 1, mode: 'exam'}, subjects);
  assert.equal(blank.score, 0);
  assert.equal(blank.pass, false);
  const open = summarizeSqld(questions, attemptWith(10, 40, {submittedAt: null}), subjects);
  assert.equal(open.score, 100);
  assert.equal(open.pass, null);
});

test('topic practice and partial sets report accuracy only', async () => {
  const {summarizeSqld} = await load();
  const part = summarizeSqld(questions.slice(0, 20), attemptWith(10, 10), subjects);
  assert.equal(part.pass, null);
  assert.equal(part.complete, false);
  assert.equal(part.correct, 20);
});

test('a submitted 50-question run is judged in exam mode and in study mode with or without a time limit', async () => {
  const {summarizeSqld} = await load();
  for (const extra of [{mode: 'exam'}, {mode: 'study'}, {mode: 'exam', deadlineAt: null}, {mode: 'study', deadlineAt: 99}]) {
    assert.equal(summarizeSqld(questions, attemptWith(10, 40, extra), subjects).pass, true, JSON.stringify(extra));
    assert.equal(summarizeSqld(questions, attemptWith(3, 27, extra), subjects).pass, false, JSON.stringify(extra));
    assert.equal(summarizeSqld(questions, attemptWith(10, 40, {...extra, submittedAt: null}), subjects).pass, null, JSON.stringify(extra));
  }
});

test('erasing choices changes nothing and 2 points are counted per correct answer', async () => {
  const {summarizeSqld} = await load();
  const attempt = attemptWith(5, 20, {eliminatedChoices: {m0: ['b'], s0: ['b']}});
  const r = summarizeSqld(questions, attempt, subjects);
  assert.equal(r.correct, 25);
  assert.equal(r.score, 50);
});

test('each subject reports its points, maximum points and the cut-off score', async () => {
  const {summarizeSqld} = await load();
  const r = summarizeSqld(questions, attemptWith(7, 18), subjects);
  const [first, second] = r.perSubject;
  assert.deepEqual([first.points, first.maxPoints, first.minScore], [14, 20, 8]);
  assert.deepEqual([second.points, second.maxPoints, second.minScore], [36, 80, 32]);
  assert.equal(r.score, 50);
});
