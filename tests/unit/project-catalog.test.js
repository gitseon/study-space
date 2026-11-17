import test from 'node:test';
import assert from 'node:assert/strict';
import {
  attemptTrack, createCatalogLoader, latestGuard, presentationOf, projectCatalogFor, projectHref, projectTrackIds, resolveProject,
} from '../../assets/project-catalog.js';
import {createProjectAttempt, validateProjectAttempt} from '../../assets/project-attempt.js';
import {validateProjectAttempts} from '../../assets/project-backup.js';
import {EDITOR_NOTICE, ENV_NOTICE} from '../../assets/project-notices.js';
import {T0, fixtureProject} from './helpers/project-fixture.js';

const backendEntry = {file: 'backend-projects.json', count: 2, track: 'backend'};
const springEntry = {file: 'spring-projects.json', count: 1, track: 'spring'};
const both = {webProjects: backendEntry, projectTracks: {backend: backendEntry, spring: springEntry}};
const indexes = {
  'backend-projects.json': {track: 'backend', projects: [{id: 'web-01', title: '캠핑'}, {id: 'web-02', title: '도서'}]},
  'spring-projects.json': {track: 'spring', projects: [{id: 'spring-web-01', title: '스터디실'}]},
};
const loaderFor = (calls = []) => createCatalogLoader(async (file) => { calls.push(file); return indexes[file]; });

test('the catalog of a track comes from projectTracks and only backend falls back to webProjects', () => {
  assert.equal(projectCatalogFor(both, 'spring'), springEntry);
  assert.equal(projectCatalogFor(both, 'backend'), backendEntry);
  assert.equal(projectCatalogFor({webProjects: backendEntry}, 'backend'), backendEntry);
  assert.equal(projectCatalogFor({webProjects: backendEntry}, 'spring'), null);
  assert.equal(projectCatalogFor(both, 'frontend'), null);
  assert.equal(projectCatalogFor({}, 'backend'), null);
  assert.equal(projectCatalogFor(both, '__proto__'), null);
  assert.deepEqual(projectTrackIds(both), ['backend', 'spring']);
  assert.deepEqual(projectTrackIds({webProjects: backendEntry}), ['backend']);
  assert.deepEqual(projectTrackIds({}), []);
});

test('each track index is fetched once and a failed fetch is not cached', async () => {
  const calls = [];
  const loader = loaderFor(calls);
  const [a, b, c] = await Promise.all([loader.load(both, 'spring'), loader.load(both, 'spring'), loader.load(both, 'backend')]);
  assert.equal(a, b);
  assert.equal(a.projects[0].id, 'spring-web-01');
  assert.equal(c.projects.length, 2);
  assert.deepEqual(calls.sort(), ['backend-projects.json', 'spring-projects.json']);
  assert.equal(await loader.load(both, 'frontend'), null);
  let fail = true;
  const flaky = createCatalogLoader(async () => { if (fail) throw new Error('offline'); return indexes['spring-projects.json']; });
  await assert.rejects(flaky.load(both, 'spring'), /offline/);
  fail = false;
  assert.equal((await flaky.load(both, 'spring')).projects.length, 1);
});

test('a late answer for the previous track is recognised as stale', async () => {
  const guard = latestGuard();
  const backend = guard.next();
  const spring = guard.next();
  assert.equal(guard.isCurrent(backend), false);
  assert.equal(guard.isCurrent(spring), true);
});

test('a link with a track opens that track and a matching project', async () => {
  const route = await resolveProject({manifest: both, loader: loaderFor(), track: 'spring', projectId: 'spring-web-01'});
  assert.equal(route.track, 'spring');
  assert.equal(route.entry.id, 'spring-web-01');
  const first = await resolveProject({manifest: both, loader: loaderFor(), track: 'spring', projectId: null});
  assert.equal(first.entry.id, 'spring-web-01');
});

test('an old link without a track finds the project by its ID, backend first', async () => {
  const old = await resolveProject({manifest: both, loader: loaderFor(), track: null, projectId: 'web-02'});
  assert.deepEqual([old.track, old.entry.id], ['backend', 'web-02']);
  const spring = await resolveProject({manifest: both, loader: loaderFor(), track: null, projectId: 'spring-web-01'});
  assert.deepEqual([spring.track, spring.entry.id], ['spring', 'spring-web-01']);
  const bare = await resolveProject({manifest: both, loader: loaderFor(), track: null, projectId: null});
  assert.deepEqual([bare.track, bare.entry.id], ['backend', 'web-01']);
  const legacy = await resolveProject({manifest: {webProjects: backendEntry}, loader: loaderFor(), track: null, projectId: 'web-01'});
  assert.equal(legacy.track, 'backend');
});

test('unknown projects, unknown tracks and mismatched pairs are errors and never fall back to backend', async () => {
  await assert.rejects(resolveProject({manifest: both, loader: loaderFor(), track: null, projectId: 'nope'}), /프로젝트를 찾을 수 없습니다/);
  await assert.rejects(resolveProject({manifest: both, loader: loaderFor(), track: 'frontend', projectId: null}), /월말평가 프로젝트가 없습니다/);
  await assert.rejects(resolveProject({manifest: both, loader: loaderFor(), track: 'spring', projectId: 'web-01'}), /맞지 않습니다/);
  await assert.rejects(resolveProject({manifest: both, loader: loaderFor(), track: 'backend', projectId: 'spring-web-01'}), /맞지 않습니다/);
  await assert.rejects(resolveProject({manifest: {}, loader: loaderFor(), track: null, projectId: null}), /월말평가 프로젝트 데이터가 없습니다/);
});

test('new attempts record their track and old attempts count as backend', () => {
  const spring = createProjectAttempt({...fixtureProject(), id: 'spring-web-01', track: 'spring'}, 1, 120, T0, 'a-1');
  assert.equal(spring.track, 'spring');
  assert.equal(spring.projectSnapshot.track, 'spring');
  assert.equal(attemptTrack(spring), 'spring');
  const backend = createProjectAttempt(fixtureProject(), 1, 120, T0, 'a-2');
  assert.equal(backend.track, 'backend');
  const old = structuredClone(backend);
  delete old.track;
  delete old.projectSnapshot.track;
  assert.equal(attemptTrack(old), 'backend');
  assert.equal(validateProjectAttempt(old).valid, true);
  assert.equal(validateProjectAttempt(spring).valid, true);
  assert.equal(validateProjectAttempt({...spring, track: 7}).valid, false);
  assert.equal(validateProjectAttempts([old, spring]).valid, true);
});

test('a snapshot keeps the presentation it started with', () => {
  const presentation = {lead: 'Spring 안내', envNotice: '실행 환경: Spring Boot', editorNotice: 'STS 권장', stageInfo: {1: 'a', 2: 'b', 3: 'c'}};
  const attempt = createProjectAttempt({...fixtureProject(), track: 'spring', presentation, verification: {label: '자동 검증 완료 · STS 미검증'}}, 1, 120, T0, 'a-3');
  assert.deepEqual(attempt.projectSnapshot.presentation, presentation);
  assert.equal(attempt.projectSnapshot.verification.label, '자동 검증 완료 · STS 미검증');
  assert.equal('presentation' in createProjectAttempt(fixtureProject(), 1, 120, T0, 'a-4').projectSnapshot, false);
});

test('texts come from project metadata and a project without metadata reads exactly like backend did', () => {
  const plain = presentationOf({});
  assert.equal(plain.envNotice, ENV_NOTICE);
  assert.equal(plain.editorNotice, EDITOR_NOTICE);
  assert.match(plain.lead, /MVC 템플릿/);
  assert.match(plain.stageInfo[2], /JSP의 정적 틀/);
  assert.equal(plain.verificationLabel, '');
  const spring = presentationOf({presentation: {lead: 'Spring 안내', envNotice: '실행 환경: Spring Boot 4.1.2', editorNotice: 'STS 권장', stageInfo: {1: 'a', 2: 'b', 3: 'c'}}, verification: {label: '자동 검증 완료 · STS 미검증'}});
  assert.equal(spring.lead, 'Spring 안내');
  assert.equal(spring.envNotice, '실행 환경: Spring Boot 4.1.2');
  assert.equal(spring.stageInfo[3], 'c');
  assert.equal(spring.verificationLabel, '자동 검증 완료 · STS 미검증');
  assert.doesNotMatch(JSON.stringify(spring), /tomcat-11|Servlet|Dynamic web module/);
});

test('project links name the track except for the old backend form', () => {
  assert.equal(projectHref({track: 'backend', project: 'web-01', stage: 2, minutes: 90}), 'pages/project.html?project=web-01&stage=2&minutes=90');
  assert.equal(projectHref({track: 'spring', project: 'spring-web-01', stage: 1, minutes: 0}), 'pages/project.html?track=spring&project=spring-web-01&stage=1&minutes=0');
});
