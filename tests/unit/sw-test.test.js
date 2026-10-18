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
  assert.match(colored, /<span class="tok-k">true<\/span>/);
  assert.match(highlight('java', '/** doc */ @Override int a;'), /<span class="tok-d">\/\*\* doc \*\/<\/span> <span class="tok-a">@Override<\/span>/);
  assert.match(colored, /<span class="tok-c">\/\/ note<\/span>/);
  assert.match(colored, /&lt;/);
  for (const variant of sw.problems.flatMap((p) => p.variants)) {
    assert.equal(unescape(highlight('java', variant.code)), variant.code, variant.id);
  }
});

test('the published problem list keeps the prediction order and complete notes', () => {
  assert.deepEqual(sw.problems.map((p) => p.rank), sw.problems.map((_, i) => i + 1));
  assert.deepEqual(sw.problems.map((p) => p.id), [
    'tree-height', 'mountain-robot', 'hunter', 'prerequisite', 'processor', 'district-split',
    'height-order', 'hiking-trail', 'apple-game', 'balloon-shooting', 'island-bridges',
  ]);
  for (const problem of sw.problems) {
    assert.ok(problem.variants.length >= 1, problem.id);
    for (const variant of problem.variants) {
      const {toc} = renderNote(variant.idea + '\n## 코드\n', {java: 'Java'});
      assert.deepEqual(toc.filter((t) => t.level === 2).map((t) => t.text), ['문제 요약', '발상', '놓치기 쉬운 점', '복잡도와 검증', '코드'], problem.id + '/' + variant.id);
      assert.match(variant.code, /public class /, problem.id);
      assert.doesNotMatch(variant.code, /FastScanner|InputStream input/, problem.id);
    }
  }
});

test('height order offers the BFS and Floyd-Warshall solutions and other links avoid the closed judge site', () => {
  const order = sw.problems.find((p) => p.id === 'height-order');
  assert.deepEqual(order.variants.map((v) => v.id), ['bfs', 'floyd']);
  assert.match(order.variants[1].code, /for \(int via = 1; via <= N; via\+\+\)/);
  const urls = sw.problems.flatMap((p) => p.links.map((l) => l.url));
  assert.ok(urls.every((url) => url.startsWith('https://') && !url.includes('acmicpc.net')));
});
