import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CHECK_STATES, DURATION_OPTIONS, continueProjectAttempt, createProjectAttempt, editProjectFile, finishProjectAttempt,
  isExpired, markHintViewed, markReferenceViewed, parseMinutes, remainingMs, setActivePath, setProjectCheck,
  setProjectNote, syncProjectAttempt, validateProjectAttempt,
} from '../../assets/project-attempt.js';
import {T0, fixtureProject} from './helpers/project-fixture.js';

test('deadlines follow the selected duration', () => {
  const project = fixtureProject();
  assert.deepEqual(DURATION_OPTIONS, [90, 120, 0]);
  assert.equal(createProjectAttempt(project, 1, 90, T0).deadlineAt - T0, 5_400_000);
  assert.equal(createProjectAttempt(project, 1, 120, T0).deadlineAt - T0, 7_200_000);
  const open = createProjectAttempt(project, 1, 0, T0);
  assert.equal(open.deadlineAt, null);
  assert.equal(open.minutes, 0);
  assert.equal(remainingMs(open, T0 + 10 ** 12), null);
  assert.throws(() => createProjectAttempt(project, 1, 45, T0), /시간/);
  assert.throws(() => createProjectAttempt(project, 9, 90, T0), /단계/);
});

test('parseMinutes only allows the listed durations and reports a fallback', () => {
  assert.deepEqual(parseMinutes('90'), {minutes: 90, fallback: false});
  assert.deepEqual(parseMinutes('0'), {minutes: 0, fallback: false});
  assert.deepEqual(parseMinutes('45'), {minutes: 120, fallback: true});
  assert.deepEqual(parseMinutes('abc'), {minutes: 120, fallback: true});
  assert.deepEqual(parseMinutes(null), {minutes: 120, fallback: false});
});

test('a new attempt snapshots only the chosen stage and never the reference', () => {
  const project = fixtureProject();
  const attempt = createProjectAttempt(project, 2, 120, T0, 'attempt-1');
  assert.equal(attempt.attemptId, 'attempt-1');
  assert.equal(attempt.projectId, 'web-01');
  assert.equal(attempt.revision, 3);
  assert.equal(attempt.stageId, 2);
  assert.equal(attempt.schemaVersion, 1);
  assert.equal(attempt.status, 'in-progress');
  assert.equal(attempt.saveVersion, 0);
  assert.deepEqual(Object.keys(attempt.files).sort(), ['src/A.java', 'src/b.jsp']);
  assert.equal(attempt.files['src/A.java'].includes('TODO'), true);
  assert.equal(attempt.projectSnapshot.hash, 'abc123');
  assert.equal(attempt.projectSnapshot.files.length, 3);
  assert.deepEqual(attempt.checks, {'c-1': 'unchecked', 'c-2': 'unchecked'});
  const text = JSON.stringify(attempt);
  assert.equal(text.includes('SECRET-REFERENCE'), false);
  assert.equal(text.includes('int a = ____'), false);
  assert.equal(validateProjectAttempt(attempt).valid, true);
});

test('the structure diagram data is kept in the snapshot when the project has it', () => {
  const structure = {layers: [], nodes: [], edges: [], flows: {overview: {label: '전체', edges: []}}};
  const withStructure = createProjectAttempt({...fixtureProject(), structure}, 1, 0, T0, 'a');
  assert.deepEqual(withStructure.projectSnapshot.structure, structure);
  assert.equal('structure' in createProjectAttempt(fixtureProject(), 1, 0, T0, 'b').projectSnapshot, false);
  assert.equal(validateProjectAttempt(withStructure).valid, true);
});

test('edits are accepted while running and refused after the deadline or on locked files', () => {
  const project = fixtureProject();
  const attempt = createProjectAttempt(project, 1, 90, T0, 'a');
  const edited = editProjectFile(attempt, 'src/A.java', 'int a = 1;', T0 + 1000);
  assert.equal(edited.accepted, true);
  assert.equal(edited.attempt.files['src/A.java'], 'int a = 1;');
  assert.equal(edited.attempt.updatedAt, T0 + 1000);
  assert.equal(attempt.files['src/A.java'].includes('____'), true, 'input attempt is not mutated');

  const locked = editProjectFile(attempt, 'pom.xml', 'x', T0);
  assert.deepEqual([locked.accepted, locked.reason], [false, 'read-only']);
  const unknown = editProjectFile(attempt, 'nope.java', 'x', T0);
  assert.deepEqual([unknown.accepted, unknown.reason], [false, 'unknown-file']);

  const late = editProjectFile(edited.attempt, 'src/A.java', 'int a = 2;', attempt.deadlineAt);
  assert.deepEqual([late.accepted, late.reason], [false, 'expired']);
  assert.equal(late.attempt.files['src/A.java'], 'int a = 1;');

  const open = createProjectAttempt(project, 1, 0, T0, 'b');
  assert.equal(editProjectFile(open, 'src/A.java', 'later', T0 + 10 ** 11).accepted, true);
});

test('expiry is idempotent, fixes the code at the deadline and uses deadlineAt rather than a counter', () => {
  const project = fixtureProject();
  let attempt = createProjectAttempt(project, 1, 90, T0, 'a');
  attempt = editProjectFile(attempt, 'src/A.java', 'before deadline', T0 + 60_000).attempt;
  assert.equal(isExpired(attempt, attempt.deadlineAt - 1), false);
  assert.equal(syncProjectAttempt(attempt, attempt.deadlineAt - 1), attempt);
  assert.equal(remainingMs(attempt, T0 + 60_000), 5_400_000 - 60_000);

  const ended = syncProjectAttempt(attempt, attempt.deadlineAt + 5_000_000);
  assert.equal(ended.status, 'time-ended');
  assert.equal(ended.endedAt, attempt.deadlineAt);
  assert.equal(ended.endedFiles['src/A.java'], 'before deadline');
  assert.equal(remainingMs(ended, ended.deadlineAt + 5), 0);
  assert.deepEqual(syncProjectAttempt(ended, ended.deadlineAt + 9_999_999), ended);

  const locked = editProjectFile(ended, 'src/A.java', 'after deadline', ended.deadlineAt + 1);
  assert.equal(locked.accepted, false);
  assert.equal(locked.attempt.endedFiles['src/A.java'], 'before deadline');
});

test('finishing manually locks the code, is idempotent and keeps checklist edits separate', () => {
  const project = fixtureProject();
  let attempt = createProjectAttempt(project, 3, 120, T0, 'a');
  attempt = editProjectFile(attempt, 'src/A.java', 'final code', T0 + 1000).attempt;
  const done = finishProjectAttempt(attempt, T0 + 2000, 'manual');
  assert.equal(done.status, 'review');
  assert.equal(done.endedAt, T0 + 2000);
  assert.equal(done.endedFiles['src/A.java'], 'final code');
  assert.deepEqual(finishProjectAttempt(done, T0 + 9999, 'manual'), done);
  assert.deepEqual(finishProjectAttempt(done, T0 + 9999, 'timeout'), done);
  assert.equal(editProjectFile(done, 'src/A.java', 'x', T0 + 3000).accepted, false);

  const checked = setProjectCheck(done, 'c-1', 'confirmed');
  assert.equal(checked.checks['c-1'], 'confirmed');
  assert.equal(checked.checks['c-2'], 'unchecked');
  assert.deepEqual(checked.endedFiles, done.endedFiles);
  assert.equal(done.checks['c-1'], 'unchecked');
});

test('continuing copies the ended code into a new unlimited attempt and leaves the original alone', () => {
  const project = fixtureProject();
  let attempt = createProjectAttempt(project, 1, 90, T0, 'a');
  attempt = editProjectFile(attempt, 'src/A.java', 'mine', T0 + 1000).attempt;
  attempt = setProjectCheck(attempt, 'c-1', 'needs-work');
  const ended = syncProjectAttempt(attempt, attempt.deadlineAt + 1);
  const before = structuredClone(ended);
  const next = continueProjectAttempt(ended, T0 + 10 ** 7, 'b');
  assert.deepEqual(ended, before);
  assert.equal(next.attemptId, 'b');
  assert.equal(next.continuedFrom, 'a');
  assert.equal(next.minutes, 0);
  assert.equal(next.deadlineAt, null);
  assert.equal(next.status, 'in-progress');
  assert.equal(next.startedAt, T0 + 10 ** 7);
  assert.equal(next.files['src/A.java'], 'mine');
  assert.equal(next.saveVersion, 0);
  assert.equal(next.endedFiles, null);
  assert.deepEqual(next.checks, {'c-1': 'unchecked', 'c-2': 'unchecked'});
  assert.equal(editProjectFile(next, 'src/A.java', 'more', T0 + 10 ** 7 + 1).accepted, true);
  assert.throws(() => continueProjectAttempt(createProjectAttempt(project, 1, 90, T0, 'c'), T0, 'd'), /종료/);
});

test('checks accept three states only and only known criteria', () => {
  assert.deepEqual(CHECK_STATES, ['unchecked', 'confirmed', 'needs-work']);
  const attempt = createProjectAttempt(fixtureProject(), 1, 0, T0, 'a');
  assert.throws(() => setProjectCheck(attempt, 'c-1', 'done'), /상태/);
  assert.throws(() => setProjectCheck(attempt, 'ghost', 'confirmed'), /항목/);
  const noted = setProjectNote(attempt, 'c-1', '메모');
  assert.equal(noted.notes['c-1'], '메모');
});

test('hints and reference views are recorded without touching the checklist', () => {
  const attempt = createProjectAttempt(fixtureProject(), 1, 0, T0, 'a');
  const hinted = markHintViewed(markHintViewed(attempt, 't-a'), 't-a');
  assert.deepEqual(hinted.viewedHints, ['t-a']);
  const viewed = markReferenceViewed(hinted);
  assert.equal(viewed.viewedReference, true);
  assert.deepEqual(viewed.checks, attempt.checks);
  assert.equal(setActivePath(viewed, 'src/b.jsp').activePath, 'src/b.jsp');
  assert.throws(() => setActivePath(viewed, 'x/y.java'), /파일/);
});

test('validateProjectAttempt rejects malformed records', () => {
  const good = createProjectAttempt(fixtureProject(), 1, 90, T0, 'a');
  assert.equal(validateProjectAttempt(good).valid, true);
  for (const mutate of [
    (a) => { delete a.attemptId; },
    (a) => { a.schemaVersion = 2; },
    (a) => { a.minutes = 45; },
    (a) => { a.status = 'weird'; },
    (a) => { a.files = []; },
    (a) => { a.files['src/A.java'] = 5; },
    (a) => { a.checks['c-1'] = 'maybe'; },
    (a) => { a.saveVersion = -1; },
    (a) => { a.projectSnapshot = null; },
    (a) => { a.files['../evil.java'] = 'x'; },
  ]) {
    const copy = structuredClone(good);
    mutate(copy);
    assert.equal(validateProjectAttempt(copy).valid, false);
  }
});
