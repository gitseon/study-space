// Renders small tree and graph diagrams written as text in the manuscript.
//
// ```tree              ```graph
// indexed              direction: up      (optional, draws edge targets above sources)
// A B C D E - - F      A -> C             (directed) or A - B (undirected)
// ```                  ```
//
// A tree lists nodes in level order from index 1 and uses "-" for an empty slot.

const RADIUS = 18;
let markerSeq = 0;

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

export function parseTree(source) {
  const lines = source.trim().split('\n').map((l) => l.trim()).filter(Boolean);
  const indexed = lines[0] === 'indexed';
  const tokens = (indexed ? lines.slice(1) : lines).join(' ').split(/\s+/).filter(Boolean);
  if (!tokens.length || tokens[0] === '-') {
    throw Error('tree needs a root');
  }
  const nodes = [];
  tokens.forEach((label, i) => {
    const index = i + 1;
    if (label === '-') {
      return;
    }
    if (index > 1 && tokens[Math.floor(index / 2) - 1] === '-') {
      throw Error('tree node ' + label + ' has no parent');
    }
    nodes.push({index, label});
  });
  return {indexed, size: tokens.length, nodes};
}

function describeTree(tree) {
  const byIndex = new Map(tree.nodes.map((n) => [n.index, n.label]));
  const parts = ['루트 ' + byIndex.get(1)];
  for (const n of tree.nodes) {
    for (const [side, child] of [['왼쪽', n.index * 2], ['오른쪽', n.index * 2 + 1]]) {
      if (byIndex.has(child)) {
        parts.push(n.label + '의 ' + side + ' 자식 ' + byIndex.get(child));
      }
    }
  }
  return '이진 트리. ' + parts.join(', ');
}

export function treeSvg(source) {
  const tree = parseTree(source);
  const maxDepth = Math.floor(Math.log2(tree.size));
  const width = Math.max(160, 2 ** maxDepth * 58);
  const gap = 66;
  const top = 26;
  const height = top + maxDepth * gap + RADIUS + (tree.indexed ? 30 : 12);
  const pos = (index) => {
    const depth = Math.floor(Math.log2(index));
    const slots = 2 ** depth;
    return {x: ((index - slots) + 0.5) * (width / slots), y: top + depth * gap};
  };
  const present = new Set(tree.nodes.map((n) => n.index));
  const edges = tree.nodes
    .filter((n) => n.index > 1 && present.has(Math.floor(n.index / 2)))
    .map((n) => {
      const a = pos(Math.floor(n.index / 2));
      const b = pos(n.index);
      return '<line x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '"/>';
    })
    .join('');
  const nodes = tree.nodes
    .map((n) => {
      const p = pos(n.index);
      return '<g class="node"><circle cx="' + p.x + '" cy="' + p.y + '" r="' + RADIUS + '"/>'
        + '<text x="' + p.x + '" y="' + p.y + '">' + esc(n.label) + '</text>'
        + (tree.indexed ? '<text class="index" x="' + p.x + '" y="' + (p.y + RADIUS + 12) + '">' + n.index + '</text>' : '')
        + '</g>';
    })
    .join('');
  return {
    label: describeTree(tree),
    svg: '<svg viewBox="0 0 ' + width + ' ' + height + '" width="' + width + '" height="' + height + '" aria-hidden="true">' + edges + nodes + '</svg>',
  };
}

export function parseGraph(source) {
  const lines = source.trim().split('\n').map((l) => l.trim()).filter(Boolean);
  const up = lines[0] === 'direction: up';
  const nodes = [];
  const edges = [];
  const add = (v) => {
    if (!nodes.includes(v)) {
      nodes.push(v);
    }
  };
  let kind = null;
  for (const line of up ? lines.slice(1) : lines) {
    const m = line.match(/^(\S+)\s*(->|-)\s*(\S+)$/);
    if (!m) {
      if (/^\S+$/.test(line)) {
        add(line);
        continue;
      }
      throw Error('invalid graph line: ' + line);
    }
    const lineKind = m[2] === '->' ? 'directed' : 'undirected';
    if (kind && kind !== lineKind) {
      throw Error('graph mixes directed and undirected edges');
    }
    kind = lineKind;
    add(m[1]);
    add(m[3]);
    edges.push([m[1], m[3]]);
  }
  if (!nodes.length) {
    throw Error('graph is empty');
  }
  return {directed: kind === 'directed', up, nodes, edges};
}

function layers(graph) {
  const layer = new Map();
  if (graph.directed) {
    // Longest path from sources keeps every edge pointing to a lower layer.
    const indegree = new Map(graph.nodes.map((v) => [v, 0]));
    graph.edges.forEach(([, b]) => indegree.set(b, indegree.get(b) + 1));
    const queue = graph.nodes.filter((v) => indegree.get(v) === 0);
    queue.forEach((v) => layer.set(v, 0));
    while (queue.length) {
      const v = queue.shift();
      for (const [a, b] of graph.edges) {
        if (a !== v) {
          continue;
        }
        layer.set(b, Math.max(layer.get(b) ?? 0, layer.get(v) + 1));
        indegree.set(b, indegree.get(b) - 1);
        if (indegree.get(b) === 0) {
          queue.push(b);
        }
      }
    }
    if (layer.size !== graph.nodes.length) {
      throw Error('directed graph diagrams must be acyclic');
    }
  } else {
    for (const start of graph.nodes) {
      if (layer.has(start)) {
        continue;
      }
      layer.set(start, 0);
      const queue = [start];
      while (queue.length) {
        const v = queue.shift();
        for (const [a, b] of graph.edges) {
          const next = a === v ? b : b === v ? a : null;
          if (next !== null && !layer.has(next)) {
            layer.set(next, layer.get(v) + 1);
            queue.push(next);
          }
        }
      }
    }
  }
  const depth = Math.max(...layer.values());
  if (graph.up) {
    layer.forEach((d, v) => layer.set(v, depth - d));
  }
  const rows = Array.from({length: depth + 1}, () => []);
  graph.nodes.forEach((v) => rows[layer.get(v)].push(v));
  // Order each row by the mean position of its neighbours in the row above to limit crossings.
  for (let r = 1; r < rows.length; r++) {
    const above = rows[r - 1];
    const score = (v) => {
      const ns = graph.edges.flatMap(([a, b]) => (a === v ? [b] : b === v ? [a] : [])).filter((n) => above.includes(n));
      return ns.length ? ns.reduce((s, n) => s + above.indexOf(n), 0) / ns.length : Infinity;
    };
    rows[r] = rows[r].map((v, i) => [v, score(v), i]).sort((x, y) => x[1] - y[1] || x[2] - y[2]).map(([v]) => v);
  }
  return rows;
}

export function graphSvg(source) {
  const graph = parseGraph(source);
  const rows = layers(graph);
  const spacing = 76;
  const gap = 72;
  const top = 28;
  const width = Math.max(160, Math.max(...rows.map((r) => r.length)) * spacing + 20);
  const height = top + (rows.length - 1) * gap + RADIUS + 12;
  const pos = new Map();
  rows.forEach((row, r) => {
    row.forEach((v, i) => pos.set(v, {x: width / 2 + (i - (row.length - 1) / 2) * spacing, y: top + r * gap}));
  });
  const marker = 'arrow-' + (++markerSeq);
  const edges = graph.edges
    .map(([a, b]) => {
      const p = pos.get(a);
      const q = pos.get(b);
      const len = Math.hypot(q.x - p.x, q.y - p.y) || 1;
      const trim = graph.directed ? RADIUS + 3 : 0;
      const x2 = q.x - ((q.x - p.x) / len) * trim;
      const y2 = q.y - ((q.y - p.y) / len) * trim;
      return '<line x1="' + p.x + '" y1="' + p.y + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '"'
        + (graph.directed ? ' marker-end="url(#' + marker + ')"' : '') + '/>';
    })
    .join('');
  const defs = graph.directed
    ? '<defs><marker id="' + marker + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
      + '<path class="arrowhead" d="M0 0L10 5L0 10z"/></marker></defs>'
    : '';
  const nodes = graph.nodes
    .map((v) => {
      const p = pos.get(v);
      return '<g class="node"><circle cx="' + p.x + '" cy="' + p.y + '" r="' + RADIUS + '"/><text x="' + p.x + '" y="' + p.y + '">' + esc(v) + '</text></g>';
    })
    .join('');
  const label = (graph.directed ? '방향 그래프. 간선 ' : '무방향 그래프. 간선 ')
    + graph.edges.map(([a, b]) => a + (graph.directed ? '에서 ' + b + '로' : '와 ' + b)).join(', ');
  return {label, svg: '<svg viewBox="0 0 ' + width + ' ' + height + '" width="' + width + '" height="' + height + '" aria-hidden="true">' + defs + edges + nodes + '</svg>'};
}

export function diagram(kind, source) {
  const {label, svg} = kind === 'tree' ? treeSvg(source) : graphSvg(source);
  return '<figure class="diagram" role="img" aria-label="' + esc(label) + '">' + svg + '</figure>';
}
