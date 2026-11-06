import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildTree, findNext, findRegion, languageOptions, layoutFor, lineCount, regionBody, targetStates, withLineNumbers,
} from '../../assets/project-editor.js';
import {editKey} from '../../assets/code-editor.js';

const JAVA = [
  'class A {',
  '    // study-target:t-a:start',
  '    int a = ____;',
  '    // study-target:t-a:end',
  '    // study-target:t-b:start',
  '    // TODO',
  '    // study-target:t-b:end',
  '}',
  '',
].join('\n');

test('file tree lists folders before files in name order and keeps full paths', () => {
  const tree = buildTree(['src/main/java/A.java', 'pom.xml', 'src/main/webapp/index.jsp', 'src/main/java/B.java', 'README.txt']);
  assert.deepEqual(tree.map((n) => n.name), ['src', 'pom.xml', 'README.txt']);
  const java = tree[0].children[0].children[0];
  assert.equal(java.name, 'java');
  assert.deepEqual(java.children.map((n) => [n.type, n.name, n.path]), [['file', 'A.java', 'src/main/java/A.java'], ['file', 'B.java', 'src/main/java/B.java']]);
  assert.equal(tree[0].path, 'src');
  assert.deepEqual(buildTree([]), []);
});

test('findRegion locates a marked region and reports unusable markers', () => {
  const region = findRegion(JAVA, 't-a');
  assert.equal(region.status, 'ok');
  assert.equal(region.startLine, 2);
  assert.equal(region.endLine, 4);
  assert.equal(regionBody(JAVA, 't-a'), '    int a = ____;\n');
  assert.equal(findRegion(JAVA, 'ghost').status, 'missing');
  assert.equal(findRegion(JAVA.replace('study-target:t-a:end', 'removed'), 't-a').status, 'missing');
  const doubled = JAVA + JAVA;
  assert.equal(findRegion(doubled, 't-a').status, 'duplicate');
  const swapped = '// study-target:t-a:end\nx\n// study-target:t-a:start\n';
  assert.equal(findRegion(swapped, 't-a').status, 'missing');
  assert.equal(regionBody(JAVA, 'ghost'), null);
});

test('targetStates compares each region with the starting text without calling it right or wrong', () => {
  const start = {'src/A.java': JAVA};
  const edited = JAVA.replace('int a = ____;', 'int a = 1;');
  const states = targetStates(
    {'src/A.java': edited},
    start,
    [{id: 't-a', path: 'src/A.java'}, {id: 't-b', path: 'src/A.java'}, {id: 't-c', path: 'src/Gone.java'}],
  );
  assert.deepEqual(states, {'t-a': 'changed', 't-b': 'unchanged', 't-c': 'missing'});
  const broken = targetStates({'src/A.java': edited.replace('study-target:t-b:start', 'oops')}, start, [{id: 't-b', path: 'src/A.java'}]);
  assert.equal(broken['t-b'], 'marker-lost');
  const dup = targetStates({'src/A.java': edited + edited}, start, [{id: 't-a', path: 'src/A.java'}]);
  assert.equal(dup['t-a'], 'marker-lost');
});

test('layout follows the usable width, not the device name', () => {
  assert.equal(layoutFor(1440), 'desktop');
  assert.equal(layoutFor(1200), 'desktop');
  assert.equal(layoutFor(1199), 'tablet');
  assert.equal(layoutFor(768), 'tablet');
  assert.equal(layoutFor(767), 'mobile');
  assert.equal(layoutFor(360), 'mobile');
});

test('only Java closes braces automatically', () => {
  assert.equal(languageOptions('java').braces, true);
  for (const language of ['jsp', 'xml', 'sql', 'text']) assert.equal(languageOptions(language).braces, false);
  const state = {value: 'x', start: 1, end: 1};
  assert.equal(editKey(state, '{', false, {braces: true}).value, 'x{}');
  assert.equal(editKey(state, '{', false, {braces: false}), null);
  assert.equal(editKey(state, '{').value, 'x{}', 'the default keeps the old behaviour');
  assert.equal(editKey({value: 'a}', start: 1, end: 1}, '}', false, {braces: false}), null);
  assert.deepEqual(editKey({value: 'ab', start: 0, end: 0}, 'Tab', false, {braces: false}), {value: '    ab', start: 4, end: 4});
  assert.equal(editKey({value: '<a>', start: 3, end: 3}, 'Enter', false, {braces: false}).value, '<a>\n');
});

test('find wraps around, ignores case and handles empty queries', () => {
  const text = 'Alpha beta ALPHA';
  assert.equal(findNext(text, 'alpha', 0), 0);
  assert.equal(findNext(text, 'alpha', 1), 11);
  assert.equal(findNext(text, 'alpha', 12), 0);
  assert.equal(findNext(text, 'zzz', 0), -1);
  assert.equal(findNext(text, '', 0), -1);
});

test('line numbers and counts follow the text', () => {
  assert.equal(lineCount(''), 1);
  assert.equal(lineCount('a\nb'), 2);
  assert.equal(lineCount('a\nb\n'), 3);
  assert.equal(withLineNumbers(3), '1\n2\n3');
});
