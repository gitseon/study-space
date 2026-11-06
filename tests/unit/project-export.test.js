import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {strFromU8, unzipSync} from '../../assets/vendor/fflate/fflate.browser.js';
import {buildProjectZip, exportRoot, isExportable, planExport, safeZipPath} from '../../assets/project-export.js';

const project = {
  id: 'web-01',
  stageId: 2,
  files: [
    {path: 'pom.xml', language: 'xml', editable: false, text: '<project>한글</project>', requiredInExport: true},
    {path: 'src/main/java/A.java', language: 'java', editable: true, text: 'start', requiredInExport: true},
    {path: 'src/main/webapp/list.jsp', language: 'jsp', editable: true, text: '<%-- start --%>'},
  ],
};

async function entries(blob) {
  return unzipSync(new Uint8Array(await blob.arrayBuffer()));
}

test('the zip holds the provided files and the current text of the editable ones under one root folder', async () => {
  const blob = await buildProjectZip(project, {'src/main/java/A.java': '완성한 코드 ✓', 'pom.xml': 'tampered'});
  assert.equal(blob.type, 'application/zip');
  const zip = await entries(blob);
  const root = exportRoot(project);
  assert.equal(root, 'web-01-stage-2');
  assert.deepEqual(Object.keys(zip).sort(), [
    `${root}/pom.xml`, `${root}/src/main/java/A.java`, `${root}/src/main/webapp/list.jsp`,
  ]);
  assert.equal(strFromU8(zip[`${root}/src/main/java/A.java`]), '완성한 코드 ✓');
  assert.equal(strFromU8(zip[`${root}/pom.xml`]), '<project>한글</project>', 'provided files cannot be replaced');
  assert.equal(strFromU8(zip[`${root}/src/main/webapp/list.jsp`]), '<%-- start --%>', 'untouched editable files keep the start text');
});

test('the same input gives the same bytes', async () => {
  const a = new Uint8Array(await (await buildProjectZip(project, {})).arrayBuffer());
  const b = new Uint8Array(await (await buildProjectZip(project, {})).arrayBuffer());
  assert.deepEqual(a, b);
});

test('build output, IDE files, answers and progress data never enter the zip', async () => {
  const noisy = {
    ...project,
    files: [
      ...project.files,
      ...['target/classes/A.class', 'build/x.txt', '.git/config', '.settings/a.prefs', '.classpath', '.project', 'reference/src/A.java',
        'review.json', 'verification.md', 'src/main/java/A.class', 'stages/1/src/A.java', 'progress.json'].map((path) => ({path, language: 'text', editable: false, text: 'x', requiredInExport: true})),
    ],
  };
  const names = Object.keys(await entries(await buildProjectZip(noisy, {})));
  assert.equal(names.length, 3);
  assert.equal(isExportable('src/main/java/A.java'), true);
  for (const path of ['target/a.txt', 'a/target/b.txt', 'build/a.txt', '.git/HEAD', 'x/.settings/y', 'a.class', 'reference/a', 'review.json', 'progress.json']) {
    assert.equal(isExportable(path), false, path);
  }
});

test('unsafe paths are rejected before anything is zipped', async () => {
  for (const bad of ['../x.txt', '/abs.txt', 'C:/x.txt', 'c:\\x.txt', 'a\\b.txt', 'a//b.txt', './a.txt', 'a/./b.txt', 'a/../b.txt', '', 'a/']) {
    assert.equal(safeZipPath(bad), false, JSON.stringify(bad));
    await assert.rejects(buildProjectZip({...project, files: [{path: bad, language: 'text', editable: false, text: 'x'}]}, {}), /경로/);
  }
  assert.equal(safeZipPath('src/main/webapp/WEB-INF/web.xml'), true);
});

test('a missing requiredInExport flag means the file is exported', () => {
  const planned = planExport({...project, files: [{path: 'a.txt', language: 'text', editable: false, text: 'x'}, {path: 'b.txt', language: 'text', editable: false, text: 'y', requiredInExport: false}]}, {});
  assert.deepEqual(planned.map((p) => p.path), ['a.txt']);
});

test('the zip written by the site build can be read with the same library', () => {
  const bytes = readFileSync(new URL('../../data/backend-projects/web-01/stage-2.zip', import.meta.url));
  const zip = unzipSync(new Uint8Array(bytes));
  const names = Object.keys(zip);
  assert.ok(names.length > 10);
  assert.ok(names.every((n) => n.startsWith('web-01-stage-2/')));
  assert.ok(names.includes('web-01-stage-2/pom.xml'));
});
