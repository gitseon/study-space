import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';

const load = async () => {
  assert.ok(existsSync(new URL('../../assets/study-links.js', import.meta.url)), 'study-links is not implemented');
  return import('../../assets/study-links.js');
};

const manifest = {
  notes: [{id: 'db-concepts', title: 'DB 개념', track: 'backend', file: 'db-concepts.md'}, {id: 'ghost', title: '준비 중', track: 'backend', file: null}],
  tracks: {backend: {studyLinks: {
    'sql-select': [{noteId: 'db-concepts', section: 'Part 2. SELECT, 조건, NULL과 정렬'}, {noteId: 'db-concepts', section: 'Part 3. 함수'}],
    jdbc: [{noteId: 'ghost', section: 'Part 1'}, {noteId: 'missing', section: 'Part 1'}],
  }}},
};

test('a group gets one link per note section with the note title and an encoded section', async () => {
  const {studyLinksFor} = await load();
  const links = studyLinksFor(manifest, 'backend', 'sql-select');
  assert.equal(links.length, 2);
  assert.equal(links[0].label, 'DB 개념 · Part 2. SELECT, 조건, NULL과 정렬');
  assert.equal(links[0].short, 'Part 2');
  assert.equal(links[0].href, 'pages/concepts.html?note=db-concepts&section=' + encodeURIComponent('Part 2. SELECT, 조건, NULL과 정렬'));
  assert.equal(new URL('http://x/' + links[0].href).searchParams.get('section'), 'Part 2. SELECT, 조건, NULL과 정렬');
});

test('the link prefix follows the page that shows it', async () => {
  const {studyLinksFor} = await load();
  assert.ok(studyLinksFor(manifest, 'backend', 'sql-select', '').every((l) => l.href.startsWith('concepts.html?note=')));
});

test('unknown tracks and groups and notes without a file give no links', async () => {
  const {studyLinksFor} = await load();
  assert.deepEqual(studyLinksFor(manifest, 'algorithm', 'sql-select'), []);
  assert.deepEqual(studyLinksFor(manifest, 'backend', 'nope'), []);
  assert.deepEqual(studyLinksFor(manifest, 'backend', 'jdbc'), []);
  assert.deepEqual(studyLinksFor({}, 'backend', 'jdbc'), []);
});

test('a section is found by its exact heading text', async () => {
  const {findSectionId} = await load();
  const toc = [{id: 'n1', level: 2, text: 'Part 1. 기본'}, {id: 'n2', level: 2, text: 'Part 2. 심화'}, {id: 'n3', level: 3, text: '세부'}];
  assert.equal(findSectionId(toc, 'Part 2. 심화'), 'n2');
  assert.equal(findSectionId(toc, 'Part 2'), null);
  assert.equal(findSectionId(toc, null), null);
  assert.equal(findSectionId(toc, '세부'), 'n3');
});
