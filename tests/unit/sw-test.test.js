import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import katex from 'katex';

globalThis.katex = katex;
const {renderNote} = await import('../../assets/note-render.js');
const {highlight} = await import('../../assets/highlight.js');

const sw = JSON.parse(readFileSync(new URL('../../data/sw-test.json', import.meta.url), 'utf8'));
const unescape = (html) => html.replace(/<[^>]+>/g, '')
  .replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&amp;', '&');

test('Java stays plain in notes unless a page asks for it', () => {
  const source = '## 코드\n\n```java\nint a = 1;\n```\n';
  assert.doesNotMatch(renderNote(source).html, /snippet/);
  assert.match(renderNote(source, {java: 'Java'}).html, /<figure class="snippet" data-lang="java"><figcaption>Java<\/figcaption>/);
});

test('Java highlighting colours the syntax and never changes the visible code', () => {
  const colored = highlight('java', 'public static void main() { int x = 10L; // note\n  String s = "a<b"; boolean t = true; }');
  assert.match(colored, /<span class="tok-k">public<\/span>/);
  assert.match(colored, /<span class="tok-n">10L<\/span>/);
  assert.match(colored, /<span class="tok-n">true<\/span>/);
  assert.match(colored, /<span class="tok-c">\/\/ note<\/span>/);
  assert.match(colored, /&lt;/);
  for (const problem of sw.problems) {
    assert.equal(unescape(highlight('java', problem.code)), problem.code, problem.id);
  }
});

test('the published problem list keeps the prediction order and complete notes', () => {
  assert.deepEqual(sw.problems.map((p) => p.rank), sw.problems.map((_, i) => i + 1));
  assert.deepEqual(sw.problems.map((p) => p.id), [
    'tree-height', 'mountain-robot', 'hunter', 'prerequisite', 'processor', 'district-split',
    'height-order', 'hiking-trail', 'apple-game', 'balloon-shooting', 'island-bridges',
  ]);
  for (const problem of sw.problems) {
    const {toc} = renderNote(problem.idea + '\n## 코드\n', {java: 'Java'});
    assert.deepEqual(toc.filter((t) => t.level === 2).map((t) => t.text), ['문제 요약', '발상', '놓치기 쉬운 점', '복잡도와 검증', '코드'], problem.id);
    assert.match(problem.code, /public class /, problem.id);
  }
});
