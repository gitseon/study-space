import test from 'node:test';
import assert from 'node:assert/strict';
import {createProjectAttempt, editProjectFile, setProjectNote} from '../../assets/project-attempt.js';
import {LIMITS, createProjectStore} from '../../assets/project-store.js';
import {buildBackups, exportBackups, importBackup, serializeBackup} from '../../assets/project-backup.js';
import {createStore} from '../../assets/storage.js';
import {createFakeIndexedDB} from './helpers/fake-idb.js';
import {T0, fixtureProject} from './helpers/project-fixture.js';

const project = fixtureProject();
const attemptAt = (n, minutes = 0) => createProjectAttempt(project, 1, minutes, T0 + n, `attempt-${n}`);

function memoryStorage({failSet = false} = {}) {
  const map = new Map();
  return {
    map, failSet,
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem(k, v) { if (this.failSet) throw new Error('QuotaExceededError'); map.set(k, v); },
  };
}

function setup() {
  const idb = createFakeIndexedDB();
  const storage = memoryStorage();
  return {idb, storage, store: createStore(storage), projects: createProjectStore(idb)};
}

test('save and load round trip with a version that grows on every save', async () => {
  const {projects} = setup();
  const first = await projects.save(attemptAt(1), {expectedVersion: 0});
  assert.deepEqual(first, {saved: true, saveVersion: 1});
  const loaded = await projects.load('attempt-1');
  assert.equal(loaded.saveVersion, 1);
  assert.equal(loaded.files['src/A.java'].includes('____'), true);
  const second = await projects.save({...loaded}, {expectedVersion: 1});
  assert.deepEqual(second, {saved: true, saveVersion: 2});
  assert.equal(await projects.load('missing'), null);
});

test('two tabs: the second writer sees a conflict and the first write survives', async () => {
  const idb = createFakeIndexedDB();
  const tabA = createProjectStore(idb);
  const tabB = createProjectStore(idb);
  const base = attemptAt(1);
  assert.equal((await tabA.save(base, {expectedVersion: 0})).saved, true);
  const edited = editProjectFile(base, 'src/A.java', 'TAB-B', T0 + 5).attempt;
  const result = await tabB.save(edited, {expectedVersion: 0});
  assert.equal(result.saved, false);
  assert.equal(result.conflict, true);
  assert.equal(result.latest.saveVersion, 1);
  assert.equal((await tabB.load('attempt-1')).files['src/A.java'].includes('TAB-B'), false);
});

test('size limits keep the memory copy usable and never truncate silently', async () => {
  const {projects} = setup();
  const big = editProjectFile(attemptAt(1), 'src/A.java', 'x'.repeat(LIMITS.fileBytes + 1), T0 + 1).attempt;
  const fileResult = await projects.save(big, {expectedVersion: 0});
  assert.deepEqual([fileResult.saved, fileResult.reason, fileResult.path], [false, 'file-too-large', 'src/A.java']);
  const korean = editProjectFile(attemptAt(2), 'src/A.java', '가'.repeat(Math.ceil(LIMITS.fileBytes / 3) + 1), T0 + 1).attempt;
  assert.equal((await projects.save(korean, {expectedVersion: 0})).reason, 'file-too-large', 'limit counts UTF-8 bytes');
  const heavy = setProjectNote(attemptAt(3), 'c-1', 'n'.repeat(LIMITS.attemptBytes));
  assert.equal((await projects.save(heavy, {expectedVersion: 0})).reason, 'too-large');
  assert.equal(await projects.load('attempt-1'), null);
});

test('at most twenty attempts, but an existing one can still be updated', async () => {
  const {projects} = setup();
  for (let i = 1; i <= LIMITS.attempts; i += 1) assert.equal((await projects.save(attemptAt(i), {expectedVersion: 0})).saved, true);
  assert.equal((await projects.save(attemptAt(99), {expectedVersion: 0})).reason, 'too-many');
  assert.equal((await projects.save(attemptAt(1), {expectedVersion: 1})).saved, true);
  assert.equal((await projects.list()).length, LIMITS.attempts);
});

test('a failing write reports an error and leaves the stored attempt untouched', async () => {
  const {projects, idb} = setup();
  await projects.save(attemptAt(1), {expectedVersion: 0});
  idb.control.failWrites = () => true;
  const edited = editProjectFile(attemptAt(1), 'src/A.java', 'LOST', T0 + 5).attempt;
  const failed = await projects.save(edited, {expectedVersion: 1});
  assert.deepEqual([failed.saved, failed.reason], [false, 'storage-error']);
  idb.control.failWrites = null;
  const stored = await projects.load('attempt-1');
  assert.equal(stored.saveVersion, 1);
  assert.equal(stored.files['src/A.java'].includes('LOST'), false);
});

test('an unavailable database fails reads and reports unavailable on saves', async () => {
  const idb = createFakeIndexedDB();
  idb.control.openError = true;
  const projects = createProjectStore(idb);
  assert.equal((await projects.save(attemptAt(1), {expectedVersion: 0})).reason, 'unavailable');
  await assert.rejects(projects.list());
  assert.equal((await createProjectStore(undefined).save(attemptAt(1), {expectedVersion: 0})).reason, 'unavailable');
});

test('importValidated is all or nothing and reports differing duplicates before overwriting', async () => {
  const {projects, idb} = setup();
  await projects.save(attemptAt(1), {expectedVersion: 0});
  const differing = editProjectFile(attemptAt(1), 'src/A.java', 'BACKUP', T0 + 9).attempt;
  const incoming = [differing, attemptAt(2)];

  const refused = await projects.importValidated(incoming, {overwrite: false});
  assert.deepEqual([refused.saved, refused.conflicts], [false, ['attempt-1']]);
  assert.equal((await projects.list()).length, 1);

  idb.control.failWrites = (() => { let n = 0; return () => (n += 1) === 2; })();
  const failed = await projects.importValidated(incoming, {overwrite: true});
  assert.equal(failed.saved, false);
  idb.control.failWrites = null;
  assert.equal((await projects.list()).length, 1);
  assert.equal((await projects.load('attempt-1')).files['src/A.java'].includes('BACKUP'), false);

  const done = await projects.importValidated(incoming, {overwrite: true});
  assert.deepEqual([done.saved, done.imported], [true, 2]);
  assert.equal((await projects.load('attempt-1')).files['src/A.java'].includes('BACKUP'), true);
  assert.equal((await projects.load('attempt-1')).saveVersion > 1, true, 'overwrite bumps the version so open tabs notice');

  const same = await projects.importValidated([await projects.load('attempt-2')], {overwrite: false});
  assert.deepEqual([same.saved, same.imported, same.skipped], [true, 0, 1]);
});

test('buildBackups keeps one file when it fits and keeps the old backup fields', () => {
  const base = createStore(memoryStorage()).exportProgress();
  const files = buildBackups(base, [attemptAt(1), attemptAt(2)]);
  assert.equal(files.length, 1);
  assert.equal(files[0].app, 'algorithm-notes');
  assert.equal(files[0].version, 1);
  assert.deepEqual(files[0].attempts, []);
  assert.equal(files[0].projectAttempts.length, 2);
  assert.equal('projectAttempts' in buildBackups(base, [])[0], false);
});

test('over-limit backups split by attempt, stay valid and round trip without loss', async () => {
  const source = setup();
  const attempts = [1, 2, 3, 4, 5].map((n) => setProjectNote(attemptAt(n), 'c-1', `노트 ${n} ${'가'.repeat(900)}`));
  const one = serializeBackup({...source.store.exportProgress(), projectAttempts: [attempts[0]]}).length;
  const limit = Math.ceil(one * 2.4);
  const files = buildBackups(source.store.exportProgress(), attempts, limit);
  assert.ok(files.length >= 2);
  const encoder = new TextEncoder();
  const seen = [];
  for (const file of files) {
    assert.ok(encoder.encode(serializeBackup(file)).length <= limit);
    assert.deepEqual([file.app, file.version, Array.isArray(file.attempts), typeof file.marks], ['algorithm-notes', 1, true, 'object']);
    seen.push(...file.projectAttempts.map((a) => a.attemptId));
  }
  assert.deepEqual(seen.sort(), attempts.map((a) => a.attemptId).sort());
  assert.throws(() => buildBackups(source.store.exportProgress(), attempts, 200), /한도/);

  const target = setup();
  for (const file of files) {
    const result = await importBackup(JSON.parse(serializeBackup(file)), target);
    assert.equal(result.saved, true);
  }
  const restored = await target.projects.list();
  assert.deepEqual(restored.map((a) => a.attemptId).sort(), attempts.map((a) => a.attemptId).sort());
  assert.equal(restored.find((a) => a.attemptId === 'attempt-3').notes['c-1'], attempts[2].notes['c-1']);
});

test('exportBackups combines both stores and old backups import without touching project attempts', async () => {
  const {store, projects, storage} = setup();
  await projects.save(attemptAt(1), {expectedVersion: 0});
  const files = await exportBackups({store, projects});
  assert.equal(files.length, 1);
  assert.equal(files[0].projectAttempts[0].attemptId, 'attempt-1');

  const legacy = createStore(memoryStorage()).exportProgress();
  const result = await importBackup(legacy, {store, projects});
  assert.equal(result.saved, true);
  assert.equal((await projects.list()).length, 1);
  assert.equal(storage.map.size >= 0, true);
});

test('an invalid backup changes neither store', async () => {
  const {store, projects} = setup();
  await projects.save(attemptAt(1), {expectedVersion: 0});
  const before = JSON.stringify(store.exportProgress().attempts);
  const bad = {...store.exportProgress(), projectAttempts: [{...attemptAt(2), schemaVersion: 9}]};
  const result = await importBackup(bad, {store, projects});
  assert.equal(result.saved, false);
  assert.equal((await projects.list()).length, 1);
  assert.equal(JSON.stringify(store.exportProgress().attempts), before);
  assert.equal((await importBackup({app: 'other'}, {store, projects})).saved, false);
});

test('a differing duplicate asks before overwriting and leaves both stores unchanged', async () => {
  const {store, projects} = setup();
  await projects.save(attemptAt(1), {expectedVersion: 0});
  const backup = {...store.exportProgress(), projectAttempts: [editProjectFile(attemptAt(1), 'src/A.java', 'DIFF', T0 + 9).attempt]};
  const result = await importBackup(backup, {store, projects});
  assert.deepEqual([result.saved, result.conflicts], [false, ['attempt-1']]);
  assert.equal((await projects.load('attempt-1')).files['src/A.java'].includes('DIFF'), false);
  const forced = await importBackup(backup, {store, projects, overwriteProject: true});
  assert.equal(forced.saved, true);
  assert.equal((await projects.load('attempt-1')).files['src/A.java'].includes('DIFF'), true);
});

test('when the second store fails the first is rolled back', async () => {
  const {store, projects, idb} = setup();
  const exam = createStore(memoryStorage());
  const sourceBackup = {...exam.exportProgress(), marks: {q1: true}, projectAttempts: [attemptAt(1)]};
  idb.control.failWrites = () => true;
  const result = await importBackup(sourceBackup, {store, projects});
  assert.equal(result.saved, false);
  assert.deepEqual(store.exportProgress().marks, {});
  idb.control.failWrites = null;
  assert.equal((await projects.list()).length, 0);
});

test('when localStorage fails nothing reaches IndexedDB and the old records stay', async () => {
  const {store, projects, storage} = setup();
  await projects.save(attemptAt(1), {expectedVersion: 0});
  storage.failSet = true;
  const backup = {...store.exportProgress(), marks: {q9: true}, projectAttempts: [attemptAt(2)]};
  const result = await importBackup(backup, {store, projects});
  assert.equal(result.saved, false);
  assert.deepEqual(store.exportProgress().marks, {});
  assert.deepEqual((await projects.list()).map((a) => a.attemptId), ['attempt-1']);
});
