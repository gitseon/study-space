import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';

const load = async (name) => {
  assert.ok(existsSync(new URL('../../assets/' + name + '.js', import.meta.url)), name + ' is not implemented');
  return import('../../assets/' + name + '.js');
};

const mc = (id) => ({id, type: 'mc', correctChoiceId: 'b', choices: 'abcd'.split('').map((c) => ({id: c, text: c}))});
const short = {id: 's1', type: 'short', acceptedAnswers: ['x'], normalization: 'trim', choices: []};
const exam = {id: 'e', contentVersion: 'v', questions: [mc('q1'), mc('q2'), short], defaultChoiceOrders: {q1: ['a', 'b', 'c', 'd'], q2: ['a', 'b', 'c', 'd']}};
const attemptOf = (extra = {}) => ({
  attemptId: 'a1', examId: 'e', contentVersion: 'v', mode: 'exam', startedAt: 1, questionOrder: ['q1', 'q2', 's1'],
  choiceOrders: exam.defaultChoiceOrders, answers: {}, revealed: [], submittedAt: null, snapshot: structuredClone(exam), ...extra,
});
const memoryStorage = () => {
  const memory = new Map();
  return {getItem: (k) => memory.get(k) ?? null, setItem: (k, v) => memory.set(k, v)};
};

test('a new attempt starts with an empty list and the eraser on unless the saved preference says otherwise', async () => {
  const {createAttempt} = await load('attempt');
  const fresh = createAttempt(exam, {now: 5});
  assert.deepEqual(fresh.eliminatedChoices, {});
  assert.equal(fresh.eraserEnabled, true);
  assert.equal(createAttempt(exam, {now: 5, eraserEnabled: false}).eraserEnabled, false);
});

test('toggling erases and restores a choice by its ID and never touches the answer', async () => {
  const {toggleElimination} = await load('choice-eraser');
  const a = attemptOf();
  assert.equal(toggleElimination(a, 'q1', 'c'), true);
  assert.deepEqual(a.eliminatedChoices, {q1: ['c']});
  assert.equal(toggleElimination(a, 'q1', 'a'), true);
  assert.deepEqual(a.eliminatedChoices.q1, ['c', 'a']);
  assert.equal(toggleElimination(a, 'q1', 'c'), true);
  assert.deepEqual(a.eliminatedChoices, {q1: ['a']});
  assert.equal(toggleElimination(a, 'q1', 'a'), true);
  assert.deepEqual(a.eliminatedChoices, {});
  assert.deepEqual(a.answers, {});
});

test('erasing the chosen choice withdraws the answer and restoring it leaves the answer alone', async () => {
  const {toggleElimination} = await load('choice-eraser');
  const chosen = attemptOf({answers: {q1: 'b', q2: 'a'}});
  assert.equal(toggleElimination(chosen, 'q1', 'b'), true);
  assert.deepEqual(chosen.eliminatedChoices, {q1: ['b']});
  assert.deepEqual(chosen.answers, {q2: 'a'});
  chosen.answers.q1 = 'c';
  assert.equal(toggleElimination(chosen, 'q1', 'b'), true);
  assert.deepEqual(chosen.eliminatedChoices, {});
  assert.equal(chosen.answers.q1, 'c');
});

test('revealed questions, submitted attempts and non-choice questions cannot be erased and keep their answers', async () => {
  const {toggleElimination} = await load('choice-eraser');
  const revealed = attemptOf({answers: {q1: 'b'}, revealed: ['q1']});
  assert.equal(toggleElimination(revealed, 'q1', 'b'), false);
  assert.equal(revealed.answers.q1, 'b');
  const submitted = attemptOf({answers: {q1: 'b'}, submittedAt: 9});
  assert.equal(toggleElimination(submitted, 'q1', 'b'), false);
  assert.equal(submitted.answers.q1, 'b');
  const a = attemptOf({answers: {s1: 'x'}});
  assert.equal(toggleElimination(a, 's1', 'a'), false);
  assert.equal(a.answers.s1, 'x');
  assert.equal(toggleElimination(a, 'missing', 'a'), false);
  assert.equal(toggleElimination(a, 'q1', 'zzz'), false);
  assert.equal(toggleElimination(a, '__proto__', 'a'), false);
  assert.deepEqual(a.eliminatedChoices ?? {}, {});
});

test('choosing an erased choice clears the mark first', async () => {
  const {toggleElimination, clearElimination} = await load('choice-eraser');
  const a = attemptOf();
  toggleElimination(a, 'q1', 'c');
  toggleElimination(a, 'q1', 'd');
  clearElimination(a, 'q1', 'c');
  assert.deepEqual(a.eliminatedChoices, {q1: ['d']});
  clearElimination(a, 'q1', 'd');
  clearElimination(a, 'q1', 'd');
  assert.deepEqual(a.eliminatedChoices, {});
});

test('normalizing drops unknown, duplicate and answered entries without editing the attempt', async () => {
  const {normalizeEliminations} = await load('choice-eraser');
  const a = attemptOf({answers: {q1: 'b'}, eliminatedChoices: {q1: ['a', 'a', 'b', 'zz'], s1: ['a'], gone: ['a'], q2: []}});
  const before = structuredClone(a);
  assert.deepEqual(normalizeEliminations(a), {q1: ['a']});
  assert.deepEqual(a, before);
  assert.deepEqual(normalizeEliminations(attemptOf()), {});
});

test('malformed eraser fields are reported before anything is stored', async () => {
  const {eraserFieldsValid} = await load('choice-eraser');
  assert.equal(eraserFieldsValid(attemptOf()), true);
  assert.equal(eraserFieldsValid(attemptOf({eraserEnabled: false, eliminatedChoices: {q1: ['a']}})), true);
  assert.equal(eraserFieldsValid(attemptOf({eraserEnabled: 'yes'})), false);
  assert.equal(eraserFieldsValid(attemptOf({eliminatedChoices: []})), false);
  assert.equal(eraserFieldsValid(attemptOf({eliminatedChoices: null})), false);
  assert.equal(eraserFieldsValid(attemptOf({eliminatedChoices: {q1: 'a'}})), false);
  assert.equal(eraserFieldsValid(attemptOf({eliminatedChoices: {q1: [1]}})), false);
  assert.equal(eraserFieldsValid(attemptOf({eliminatedChoices: {q1: ['a', 'b', 'c', 'd', 'a']}})), false);
  const tooManyQuestions = Object.fromEntries(['k0', 'k1'].map((k) => [k, ['a']]));
  assert.equal(eraserFieldsValid(attemptOf({eliminatedChoices: tooManyQuestions, snapshot: {questions: [mc('q1')]}})), false);
  for (const key of ['__proto__', 'constructor', 'prototype']) {
    assert.equal(eraserFieldsValid(attemptOf({eliminatedChoices: JSON.parse('{"' + key + '":["a"]}')})), false, key);
  }
});

test('the eraser setting follows the attempt, then the saved preference, then defaults to on', async () => {
  const {isEraserEnabled, readEraserPreference, writeEraserPreference} = await load('choice-eraser');
  assert.equal(isEraserEnabled({eraserEnabled: false}, true), false);
  assert.equal(isEraserEnabled({}, false), false);
  assert.equal(isEraserEnabled({}, null), true);
  const storage = memoryStorage();
  assert.equal(readEraserPreference(storage), null);
  writeEraserPreference(storage, false);
  assert.equal(readEraserPreference(storage), false);
  writeEraserPreference(storage, true);
  assert.equal(readEraserPreference(storage), true);
  assert.equal(readEraserPreference({getItem() { throw Error('denied'); }}), null);
  assert.doesNotThrow(() => writeEraserPreference({setItem() { throw Error('full'); }}, true));
});

test('storage keeps the marks across a backup round trip and rejects a corrupted field', async () => {
  const {createStore} = await load('storage');
  const store = createStore(memoryStorage());
  const a = attemptOf({eraserEnabled: false, eliminatedChoices: {q1: ['a', 'a', 'c'], gone: ['a']}});
  assert.equal(store.saveAttempt(a).saved, true);
  const loaded = store.loadAttempt('a1').attempt;
  assert.deepEqual(loaded.eliminatedChoices, {q1: ['a', 'c']});
  assert.equal(loaded.eraserEnabled, false);
  const backup = JSON.parse(JSON.stringify(store.exportProgress()));
  const other = createStore(memoryStorage());
  assert.equal(other.importProgress(backup).saved, true);
  assert.deepEqual(other.loadAttempt('a1').attempt.eliminatedChoices, {q1: ['a', 'c']});
  const broken = structuredClone(backup);
  broken.attempts[0].eliminatedChoices = {q1: 'a'};
  const untouched = createStore(memoryStorage());
  assert.equal(untouched.importProgress(broken).saved, false);
  assert.deepEqual(untouched.listAttempts(), []);
});

test('an old attempt without the fields loads with an empty list and no explicit setting', async () => {
  const {createStore} = await load('storage');
  const store = createStore(memoryStorage());
  store.saveAttempt(attemptOf());
  const loaded = store.loadAttempt('a1').attempt;
  assert.deepEqual(loaded.eliminatedChoices, {});
  assert.equal('eraserEnabled' in loaded, false);
});

test('erasing choices changes neither the result nor the summary', async () => {
  const {resultFor, summarize} = await load('grading');
  const {toggleElimination} = await load('choice-eraser');
  const a = attemptOf({answers: {q1: 'b', q2: 'a'}, selfGrades: {}, overrides: {}});
  const before = exam.questions.map((q) => resultFor(q, a));
  const summaryBefore = JSON.stringify(summarize(exam.questions, a));
  toggleElimination(a, 'q1', 'c');
  toggleElimination(a, 'q2', 'b');
  assert.deepEqual(exam.questions.map((q) => resultFor(q, a)), before);
  assert.equal(JSON.stringify(summarize(exam.questions, a)), summaryBefore);
});
