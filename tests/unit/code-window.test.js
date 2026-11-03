import test from 'node:test';
import assert from 'node:assert/strict';
import {markdown, solutionMarkdown} from '../../assets/render.js';
import {highlight, windowLabel} from '../../assets/highlight.js';
import {renderNote} from '../../assets/note-render.js';

test('every fenced block in a question becomes a labelled code window', () => {
  const sql = markdown('```sql\nSELECT 1;\n```');
  assert.match(sql, /<figure class="snippet window" data-lang="sql"><figcaption>SQL<\/figcaption>/);
  assert.match(markdown('```java\nint a;\n```'), /<figcaption>Java<\/figcaption>/);
  assert.match(markdown('```text\na | b\n```'), /<figcaption>TEXT<\/figcaption>/);
  assert.match(markdown('```\nplain\n```'), /<figcaption>CODE<\/figcaption>/);
  assert.equal(windowLabel('jsp'), 'JSP');
});

test('SQL keywords, numbers, strings, comments and NULL are coloured while names stay plain', () => {
  const html = highlight('sql', "-- (가)\nselect SUBSTR(DNAME, 1, 3) from DEPT where x = 'a' and y is null;");
  assert.match(html, /<span class="tok-c">-- \(가\)<\/span>/);
  assert.match(html, /<span class="tok-k">select<\/span> SUBSTR\(DNAME, <span class="tok-n">1<\/span>, <span class="tok-n">3<\/span>\)/);
  assert.match(html, /<span class="tok-k">from<\/span> DEPT <span class="tok-k">where<\/span>/);
  assert.match(html, /<span class="tok-s">&#39;a&#39;<\/span>/);
  assert.match(html, /<span class="tok-k">is<\/span> <span class="tok-n">null<\/span>/);
  assert.doesNotMatch(html, /tok-k">DNAME|tok-k">SUBSTR/);
});

test('highlighting escapes markup and keeps the visible text of SQL and JSP', () => {
  for (const [lang, source] of [['sql', "SELECT '<b>' FROM t; -- <i>"], ['jsp', '<%-- c --%>\n<c:if test="${a}">x</c:if>\n<%= n %>']]) {
    const html = highlight(lang, source);
    assert.equal(html.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&'), source);
    assert.doesNotMatch(html, /<b>|<i>/);
  }
});

test('notes render code windows only when asked and the SW test colouring stays as it was', () => {
  const source = '# t\n\n## a\n\n```sql\nSELECT 1;\n```\n\n```java\nint a;\n```\n';
  const plain = renderNote(source, {java: 'Java'}).html;
  assert.doesNotMatch(plain, /snippet window/);
  assert.match(plain, /<figure class="snippet" data-lang="java">/);
  const windowed = renderNote(source, {}, {window: true}).html;
  assert.equal((windowed.match(/snippet window/g) || []).length, 2);
});

test('solution labels each start their own bold line', () => {
  assert.equal(solutionMarkdown('정답 근거: A다. 풀이: B이다. 흔한 실수: C이다.'), '**정답 근거:** A다.\n\n**풀이:** B이다.\n\n**흔한 실수:** C이다.');
  assert.equal(solutionMarkdown('정답: 3. 허용 표기: 3번. 근거: x이다.'), '**정답:** 3.\n\n**허용 표기:** 3번.\n\n**근거:** x이다.');
  const html = markdown(solutionMarkdown('정답 근거: A다. 풀이: B이다.'));
  assert.equal((html.match(/<p>/g) || []).length, 2);
  assert.match(html, /<p><strong>정답 근거:<\/strong> A다\.<\/p>/);
});

test('labels inside code fences or in the middle of a sentence are left alone', () => {
  const text = '풀이: 먼저 본다.\n```java\n// 풀이: 코드 안\nint a; 풀이: x\n```\n근거를 살핀다: 값이다.';
  const out = solutionMarkdown(text);
  assert.match(out, /^\*\*풀이:\*\* 먼저 본다\./);
  assert.ok(out.includes('// 풀이: 코드 안\nint a; 풀이: x'));
  assert.ok(out.endsWith('근거를 살핀다: 값이다.'));
  assert.equal(solutionMarkdown(''), '');
  assert.equal(solutionMarkdown(undefined), '');
});
