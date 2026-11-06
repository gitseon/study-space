import test from 'node:test';
import assert from 'node:assert/strict';
import {checkProjectDraft, describeFinding} from '../../assets/project-checks.js';

const start = (body) => `class A {\n    // study-target:t-a:start\n${body}\n    // study-target:t-a:end\n}\n`;
const jspStart = (body) => `<p>\n<%-- study-target:t-j:start --%>\n${body}\n<%-- study-target:t-j:end --%>\n</p>\n`;

function project({stage1Body = '    int a = ____;', jspBody = '<%-- TODO --%>'} = {}) {
  return {
    targets: [
      {id: 't-a', path: 'src/A.java', title: '계산'},
      {id: 't-j', path: 'src/list.jsp', title: '목록'},
    ],
    files: [
      {path: 'src/A.java', language: 'java', editable: true, text: start(stage1Body)},
      {path: 'src/list.jsp', language: 'jsp', editable: true, text: jspStart(jspBody)},
      {path: 'pom.xml', language: 'xml', editable: false, text: '<project/>'},
    ],
  };
}

const filesOf = (p, overrides = {}) => ({...Object.fromEntries(p.files.filter((f) => f.editable).map((f) => [f.path, f.text])), ...overrides});
const kinds = (findings) => findings.map((f) => `${f.targetId}:${f.kind}`);

test('untouched regions are reported as possibly missing and never as wrong', () => {
  const p = project();
  const findings = checkProjectDraft(p, 1, filesOf(p));
  assert.deepEqual(kinds(findings), ['t-a:unchanged', 't-j:unchanged']);
  assert.ok(findings.every((f) => f.path && f.targetId && f.message.includes('가능성')));
  assert.ok(findings.every((f) => !('correct' in f) && !('passed' in f)));
});

test('a completed region produces no finding, even when it differs from any reference', () => {
  const p = project();
  const files = filesOf(p, {
    'src/A.java': start('    int a = 40 + 2; // 다른 올바른 구현'),
    'src/list.jsp': jspStart('<c:forEach var="x" items="${list}">${x}</c:forEach>'),
  });
  assert.deepEqual(checkProjectDraft(p, 1, files), []);
});

test('leftover blanks matter in stage 1 while a plain TODO comment next to real code does not', () => {
  const p = project();
  const half = filesOf(p, {'src/A.java': start('    int a = ____;\n    int b = 2;'), 'src/list.jsp': jspStart('<c:out value="x"/>')});
  assert.deepEqual(kinds(checkProjectDraft(p, 1, half)), ['t-a:blank-left']);
  const todo = filesOf(p, {'src/A.java': start('    // TODO later\n    int a = 1;'), 'src/list.jsp': jspStart('<c:out value="x"/>')});
  assert.deepEqual(checkProjectDraft(p, 2, todo), []);
  assert.deepEqual(kinds(checkProjectDraft(p, 3, half)), [], 'blank tokens are only a stage 1 concept');
});

test('empty regions, lost markers and missing files are told apart', () => {
  const p = project();
  assert.deepEqual(kinds(checkProjectDraft(p, 2, filesOf(p, {'src/A.java': start('   \n  '), 'src/list.jsp': jspStart('x')}))), ['t-a:empty']);
  assert.deepEqual(kinds(checkProjectDraft(p, 2, filesOf(p, {'src/A.java': 'class A {}\n', 'src/list.jsp': jspStart('x')}))), ['t-a:marker-lost']);
  const missing = filesOf(p);
  delete missing['src/list.jsp'];
  assert.deepEqual(kinds(checkProjectDraft(p, 2, {...missing, 'src/A.java': start('int a;')})), ['t-j:file-missing']);
  const lost = checkProjectDraft(p, 2, filesOf(p, {'src/A.java': 'class A {}\n', 'src/list.jsp': jspStart('x')}))[0];
  assert.match(lost.message, /직접 확인/);
});

test('an unfinished form action or method is flagged', () => {
  const p = project();
  const files = (body) => filesOf(p, {'src/A.java': start('int a;'), 'src/list.jsp': jspStart(body)});
  assert.deepEqual(kinds(checkProjectDraft(p, 2, files('<form>\n<input name="a">\n</form>'))), ['t-j:form-incomplete']);
  assert.deepEqual(kinds(checkProjectDraft(p, 2, files('<form action="${root}/x">\n</form>'))), ['t-j:form-incomplete']);
  assert.deepEqual(checkProjectDraft(p, 2, files('<form action="${root}/x" method="post">\n</form>')), []);
  assert.deepEqual(checkProjectDraft(p, 2, files('<c:out value="x"/>')), []);
});

test('describeFinding gives a short Korean line per kind', () => {
  for (const kind of ['unchanged', 'empty', 'blank-left', 'marker-lost', 'file-missing', 'form-incomplete']) {
    assert.match(describeFinding({kind, title: '계산'}), /계산/);
  }
});
