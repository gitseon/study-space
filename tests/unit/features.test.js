import test from 'node:test';
import assert from 'node:assert/strict';
import {readdirSync, readFileSync} from 'node:fs';
import katex from 'katex';

globalThis.katex = katex;
const {summarize, needsReview} = await import('../../assets/grading.js');
const {createAttempt} = await import('../../assets/attempt.js');
const {inline, markdown} = await import('../../assets/render.js');

const mc = (id) => ({id, type: 'mc', correctChoiceId: 'b', choices: ['a', 'b', 'c', 'd'].map((c) => ({id: c, text: c}))});

test('summarize separates correct, wrong, unanswered and pending questions', () => {
  const questions = [mc('q1'), mc('q2'), mc('q3'), {id: 'e1', type: 'essay', rubric: [{id: 'r', points: 2}]}];
  const attempt = {answers: {q1: 'b', q2: 'a', e1: '설명'}, selfGrades: {}, overrides: {}};
  assert.deepEqual(summarize(questions, attempt), {total: 4, correct: 1, incorrect: 1, unanswered: 1, pending: 1, points: 1, maxPoints: 5});
  assert.equal(summarize(questions, {...attempt, answers: {q1: 'b'}}).unanswered, 3);
  attempt.selfGrades.e1 = [];
  assert.equal(summarize(questions, attempt).incorrect, 2);
  assert.equal(needsReview('unanswered'), true);
  assert.equal(needsReview('pending-review'), false);
});

test('both grading modes honour the chosen time limit', () => {
  const exam = {id: 'x', contentVersion: 'v', questions: [mc('q1')], defaultChoiceOrders: {}};
  assert.equal(createAttempt(exam, {mode: 'study', now: 0, durationMinutes: 2}).deadlineAt, 120000);
  assert.equal(createAttempt(exam, {mode: 'exam', now: 0, durationMinutes: 0}).deadlineAt, null);
});

test('inline renderer typesets math, keeps code literal and escapes HTML', () => {
  const html = inline('<b>$\\Theta(N^2)$</b> `a $x$ b`');
  assert.match(html, /class="katex"/);
  assert.match(html, /&lt;b&gt;/);
  assert.match(html, /<code>a \$x\$ b<\/code>/);
  assert.doesNotMatch(markdown('```java\nint $a = 1;\n```'), /katex/);
});

test('every formula in the published data renders without KaTeX errors', () => {
  const files = readdirSync(new URL('../../data/', import.meta.url)).filter((f) => f !== 'manifest.json' && f.endsWith('.json'));
  let count = 0;
  const visit = (value) => {
    if (typeof value === 'string') {
      const prose = value.replace(/```[\s\S]*?```/g, '').replace(/`[^`]*`/g, '');
      for (const [, tex] of prose.matchAll(/\$([^$]+)\$/g)) {
        assert.doesNotThrow(() => katex.renderToString(tex, {throwOnError: true, strict: 'error'}), tex);
        count++;
      }
    } else if (value && typeof value === 'object') {
      Object.values(value).forEach(visit);
    }
  };
  for (const file of files) {
    visit(JSON.parse(readFileSync(new URL('../../data/' + file, import.meta.url), 'utf8')));
  }
  assert.ok(count > 50, 'expected formulas in the question bank, found ' + count);
});

test('frontend snippets get a language label and escaped, coloured tokens', () => {
  const html = markdown('```html\n<p class="a">x</p>\n```');
  assert.match(html, /<figure class="snippet" data-lang="html"><figcaption>HTML<\/figcaption>/);
  assert.match(html, /&lt;p/);
  assert.doesNotMatch(html, /<p class="a">/);

  const js = markdown('```js\nconst a = \'<b>\'; // note\n```');
  assert.match(js, /<span class="tok-k">const<\/span>/);
  assert.match(js, /<span class="tok-s">&#39;&lt;b&gt;&#39;<\/span>/);
  assert.match(js, /<span class="tok-c">\/\/ note<\/span>/);

  assert.doesNotMatch(markdown('```java\nint a = 1;\n```'), /snippet/);
});

test('highlighting never changes the visible code text', () => {
  const sources = {
    js: 'async function f() {\n  await x?.y ?? `t${1}`;\n}',
    css: '.a > b:hover { color: #fff; margin: 0 -2px; }',
    html: '<input type="text" value=\'a\'><!-- c -->',
  };
  for (const [lang, source] of Object.entries(sources)) {
    const text = markdown('```' + lang + '\n' + source + '\n```')
      .replace(/<[^>]+>/g, '')
      .replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&amp;', '&');
    assert.equal(text.replace(/^(JavaScript|CSS|HTML)/, ''), source);
  }
});

test('every frontend question in the published data stays inside the snippet rules', () => {
  const files = readdirSync(new URL('../../data/', import.meta.url)).filter((f) => /^frontend-\d+\.json$/.test(f));
  assert.equal(files.length, 3);
  for (const file of files) {
    const exam = JSON.parse(readFileSync(new URL('../../data/' + file, import.meta.url), 'utf8'));
    assert.deepEqual(exam.counts, {mc: 21, short: 9, essay: 2, code: 0});
    for (const q of exam.questions) {
      assert.equal(q.type === 'mc' ? q.choices.length : 0, q.type === 'mc' ? 4 : 0, q.id);
      for (const [, lang, body] of [q.stem, q.solution, ...q.choices.map((c) => c.text)].join('\n').matchAll(/```(\w*)\n([\s\S]*?)```/g)) {
        if (['html', 'css', 'js'].includes(lang)) {
          assert.ok(body.split('\n').every((l) => l.length <= 38), q.id + ' has a line over 38 characters');
        }
      }
    }
  }
});

const {renderNote} = await import('../../assets/note-render.js');

test('concept notes render headings, tables, lists, task items and code without raw HTML', () => {
  const md = [
    '# 제목', '', '## 부분 <1>', '', '| 구분 | 설명 |', '|---|---|', '| `a` | **굵게** <b>x</b> |', '',
    '- 항목', '- [ ] 확인', '', '1. 하나', '2. 둘', '', '```js', "const a = '<i>';", '```', '', '문단 `코드` 입니다.',
  ].join('\n');
  const {title, toc, html} = renderNote(md);
  assert.equal(title, '제목');
  assert.deepEqual(toc, [{id: 'n0', level: 2, text: '부분 <1>'}]);
  assert.match(html, /<h2 id="n0">부분 &lt;1&gt;<\/h2>/);
  assert.match(html, /<div class="note-table"><table><thead><tr><th scope="col">구분<\/th>/);
  assert.match(html, /<td><code>a<\/code><\/td><td><strong>굵게<\/strong> &lt;b&gt;x&lt;\/b&gt;<\/td>/);
  assert.match(html, /<li class="task"><input type="checkbox" disabled>/);
  assert.match(html, /<ol><li>하나<\/li><li>둘<\/li><\/ol>/);
  assert.match(html, /<figure class="snippet" data-lang="js">/);
  assert.doesNotMatch(html, /<b>|<i>/);
  assert.match(html, /<p>문단 <code>코드<\/code> 입니다.<\/p>/);
});

test('the published web concept note renders every section and table', () => {
  const md = readFileSync(new URL('../../data/web-concepts.md', import.meta.url), 'utf8');
  const {title, toc, html} = renderNote(md);
  assert.match(title, /^Web 개념/);
  assert.equal(toc.filter((t) => t.level === 2).length, 8);
  assert.ok((html.match(/<table>/g) || []).length >= 15);
  assert.doesNotMatch(html, /\|---|\ufffd/);
  assert.equal((html.match(/<pre/g) || []).length, (md.match(/^```\w*$/gm) || []).length / 2);
});
