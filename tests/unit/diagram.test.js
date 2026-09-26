import test from 'node:test';
import assert from 'node:assert/strict';
import {readdirSync, readFileSync} from 'node:fs';
import {parseTree, parseGraph, treeSvg, graphSvg, diagram} from '../../assets/diagram.js';
import {markdown} from '../../assets/render.js';

test('tree arrays map index i to children 2i and 2i+1', () => {
  const tree = parseTree('indexed\nA B C D E - - F');
  assert.deepEqual(tree.nodes.map((n) => n.index), [1, 2, 3, 4, 5, 8]);
  const {label, svg} = treeSvg('indexed\nA B C D E - - F');
  assert.match(label, /D의 왼쪽 자식 F/);
  assert.equal((svg.match(/<circle/g) || []).length, 6);
  assert.equal((svg.match(/<line/g) || []).length, 5);
  assert.match(svg, /class="index"[^>]*>8</);
  assert.throws(() => parseTree('A - C D'), /no parent/);
  assert.throws(() => parseTree('- A'), /root/);
});

test('graphs are layered, directed edges get arrows and cycles are rejected', () => {
  const g = parseGraph('A - B\nA - C\nB - D\nC - E');
  assert.equal(g.directed, false);
  const undirected = graphSvg('A - B\nA - C\nB - D\nC - E').svg;
  assert.doesNotMatch(undirected, /marker/);
  const directed = graphSvg('A -> C\nB -> C\nC -> D');
  assert.match(directed.svg, /marker-end/);
  assert.match(directed.label, /A에서 C로/);
  assert.throws(() => parseGraph('A -> B\nB - C'), /mixes/);
  assert.throws(() => graphSvg('A -> B\nB -> A'), /acyclic/);
});

test('markdown turns diagram fences into labelled figures and escapes labels', () => {
  const html = markdown('앞 문장\n\n```graph\n<x> - B\n```');
  assert.match(html, /<figure class="diagram" role="img" aria-label="무방향 그래프/);
  assert.match(html, /&lt;x&gt;/);
  assert.doesNotMatch(html, /<x>/);
  assert.match(markdown('```tree\n- A\n```'), /<pre/);
  assert.match(diagram('tree', 'R L M'), /루트 R/);
});

test('every diagram in the published data renders', () => {
  const files = readdirSync(new URL('../../data/', import.meta.url)).filter((f) => f !== 'manifest.json');
  let count = 0;
  for (const file of files) {
    const text = readFileSync(new URL('../../data/' + file, import.meta.url), 'utf8');
    for (const q of JSON.parse(text).questions) {
      for (const [, kind, body] of q.stem.matchAll(/```(tree|graph)\n([\s\S]*?)```/g)) {
        assert.doesNotThrow(() => diagram(kind, body), q.id);
        count++;
      }
    }
  }
  assert.ok(count >= 10, 'expected at least 10 diagrams, found ' + count);
});
