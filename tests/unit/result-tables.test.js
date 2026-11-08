import test from 'node:test';
import assert from 'node:assert/strict';
import {resultTablesHtml} from '../../assets/render.js';

const table = (extra = {}) => ({title: '쿼리 A', columns: ['name', 'status'], rows: [['모아', 'PAID'], ['보라', 'NULL']], ...extra});

test('no tables give no markup', () => {
  assert.equal(resultTablesHtml(undefined), '');
  assert.equal(resultTablesHtml([]), '');
});

test('a table shows the title, row count, column heads and every cell', () => {
  const html = resultTablesHtml([table()]);
  assert.match(html, /<figcaption>쿼리 A<span>2행<\/span><\/figcaption>/);
  assert.match(html, /<th scope="col">name<\/th><th scope="col">status<\/th>/);
  assert.match(html, /<td>모아<\/td><td>PAID<\/td>/);
  assert.equal(html.split('<figure').length - 1, 1);
});

test('NULL cells and number cells get their own classes', () => {
  const html = resultTablesHtml([table({columns: ['n', 'v'], rows: [['10', '1.5'], ['NULL', '가나다']]})]);
  assert.match(html, /<td class="rt-num">10<\/td><td class="rt-num">1\.5<\/td>/);
  assert.match(html, /<td class="rt-null">NULL<\/td><td>가나다<\/td>/);
});

test('an empty result says so and spans all columns', () => {
  const html = resultTablesHtml([table({rows: []})]);
  assert.match(html, /<span>0행<\/span>/);
  assert.match(html, /<td class="rt-empty" colspan="2">결과 없음<\/td>/);
});

test('a note is shown under the table and several tables stay in order', () => {
  const html = resultTablesHtml([table({title: '쿼리 A'}), table({title: '쿼리 B', note: '행 순서는 달라질 수 있습니다.'})]);
  assert.ok(html.indexOf('쿼리 A') < html.indexOf('쿼리 B'));
  assert.match(html, /<p class="rt-note">행 순서는 달라질 수 있습니다\.<\/p>/);
  assert.equal(html.split('rt-note').length - 1, 1);
});

test('text from the data is escaped', () => {
  const html = resultTablesHtml([table({title: '<img src=x onerror=alert(1)>', columns: ['<b>'], rows: [['<script>alert(1)</script>']], note: '<i>x</i>'})]);
  assert.doesNotMatch(html, /<img src=x/);
  assert.doesNotMatch(html, /<script>alert/);
  assert.doesNotMatch(html, /<b>/);
  assert.doesNotMatch(html, /<i>x/);
});
