// 월말평가 프로젝트의 구조 도식. 상자(클래스, 서블릿, JSP)와 화살표(호출, forward, redirect)를 누르면 설명과 뼈대 코드가 나옵니다.
// 뼈대에는 작성 대상의 본문이 없으며, 같은 데이터를 홈의 흐름 요약과 프로젝트 화면이 함께 씁니다.
import {codeWindow} from './highlight.js';

const escapeHtml = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

export const KIND_LABELS = {request: '요청', call: '호출', sql: 'SQL', forward: 'forward', redirect: 'redirect', include: 'include', error: '오류 응답'};
const LANGUAGES = {'.java': 'java', '.jsp': 'jsp', '.xml': 'xml', '.sql': 'sql'};

const layerIndex = (structure) => Object.fromEntries(structure.layers.map((l, i) => [l.id, i]));
const nodeById = (structure, id) => structure.nodes.find((n) => n.id === id);
const edgeById = (structure, id) => structure.edges.find((e) => e.id === id);

export function featureForTab(structure, label) {
  return structure.flowTabs?.[label] ?? null;
}

// 선택한 기능에 속한 화살표와 상자. 전체 흐름은 모든 상자를 포함합니다.
export function flowMembers(structure, flowId) {
  const flow = structure.flows[flowId] || structure.flows.overview;
  const edges = new Set(flow.edges);
  const nodes = new Set();
  for (const id of edges) {
    const edge = edgeById(structure, id);
    nodes.add(edge.from);
    nodes.add(edge.to);
  }
  if (flowId === 'overview' || !structure.flows[flowId]) structure.nodes.forEach((n) => nodes.add(n.id));
  return {edges, nodes};
}

// 아래 계층으로 가는 화살표는 출발 계층 밑에, 위로 돌아가거나 같은 계층 안의 화살표는 따로 모읍니다.
export function edgeGroups(structure) {
  const order = layerIndex(structure);
  const down = {};
  const back = [];
  for (const edge of structure.edges) {
    const from = nodeById(structure, edge.from);
    const to = nodeById(structure, edge.to);
    if (order[to.layer] > order[from.layer]) (down[from.layer] ||= []).push(edge);
    else back.push(edge);
  }
  return {down, back};
}

export function languageOf(node) {
  const dot = node.path ? node.path.lastIndexOf('.') : -1;
  return dot === -1 ? 'text' : LANGUAGES[node.path.slice(dot)] || 'text';
}

// 작성 대상이 있는 상자만 직접 구현해야 하고, 나머지는 제공 파일이다.
export const isWriteNode = (node) => node.targets.length > 0;

function nodeButton(node, members, selected) {
  const active = members.nodes.has(node.id);
  const isSelected = selected?.type === 'node' && selected.id === node.id;
  const write = isWriteNode(node);
  return `<button type="button" class="st-node" data-node="${escapeHtml(node.id)}" data-kind="${escapeHtml(node.kind)}" data-write="${write}" data-dim="${!active}" aria-pressed="${isSelected}">`
    + `<span class="st-name">${escapeHtml(node.label)}</span><span class="st-kind">${escapeHtml(node.kind)}</span>`
    + (write ? '<span class="st-write">✎ 구현 필요</span>' : '') + '</button>';
}

function edgeButton(structure, edge, members, selected) {
  const active = members.edges.has(edge.id);
  const isSelected = selected?.type === 'edge' && selected.id === edge.id;
  const from = nodeById(structure, edge.from);
  const to = nodeById(structure, edge.to);
  return `<button type="button" class="st-edge" data-edge="${escapeHtml(edge.id)}" data-kind="${escapeHtml(edge.kind)}" data-dim="${!active}" aria-pressed="${isSelected}">`
    + `<span class="st-arrow" aria-hidden="true">${edge.kind === 'forward' || edge.kind === 'redirect' || edge.kind === 'include' || edge.kind === 'error' ? '↩' : '↓'}</span>`
    + `<span>${escapeHtml(from.label)} → ${escapeHtml(to.label)}</span><span class="st-label">${escapeHtml(edge.label)}</span></button>`;
}

// 한눈에 보는 구조 그림. 요청이 지나는 길(브라우저 → 필터 → 컨트롤러 → 서비스 → DAO → DB)을 세로로 잇고,
// 화면(JSP)은 옆에, 함께 쓰는 파일은 아래에 둔다. 상자와 화살표는 아래 목록형 도식과 같은 선택 상태를 쓴다.
const ARCH_MAIN = ['client', 'filter', 'controller', 'service', 'dao', 'db'];
const ARCH_SIDE = ['view'];

const clip = (text, max = 60) => (String(text).length > max ? String(text).slice(0, max - 1) + '…' : String(text));

// 마우스를 올리거나 포커스를 두었을 때 뜨는 요약. 자세한 내용과 뼈대 코드는 아래 설명 상자에 있다.
export function tipHtml(structure, type, id) {
  if (type === 'edge') {
    const edge = edgeById(structure, id);
    if (!edge) return '';
    const from = nodeById(structure, edge.from);
    const to = nodeById(structure, edge.to);
    return `<strong>${escapeHtml(from.label)} → ${escapeHtml(to.label)}</strong><span>${escapeHtml(KIND_LABELS[edge.kind] || edge.kind)}</span><p>${escapeHtml(clip(edge.data, 120))}</p>`;
  }
  const node = nodeById(structure, id);
  if (!node) return '';
  const list = (title, items) => (items.length ? `<p><b>${title}</b> ${escapeHtml(clip(items.slice(0, 3).join(' · '), 90))}</p>` : '');
  return `<strong>${escapeHtml(node.label)}</strong><span>${isWriteNode(node) ? '구현 필요' : '제공 파일'}</span>`
    + `<p>${escapeHtml(clip(node.role, 110))}</p>${list('받는 값', node.receives)}${list('보내는 값', node.sends)}<em>누르면 아래 설명으로 이동합니다</em>`;
}

function archBox(node, members, selected) {
  const write = isWriteNode(node);
  const isSelected = selected?.type === 'node' && selected.id === node.id;
  return `<button type="button" class="ar-box" data-arch-node="${escapeHtml(node.id)}" data-kind="${escapeHtml(node.kind)}" data-write="${write}" data-dim="${!members.nodes.has(node.id)}" aria-pressed="${isSelected}">`
    + `<span class="ar-name">${escapeHtml(node.label)}</span><span class="ar-kind">${escapeHtml(node.kind)}</span>${write ? '<span class="st-write">✎ 구현 필요</span>' : ''}</button>`;
}

export function archHtml(structure, {flow = 'overview', selected = null, writeOnly = false} = {}) {
  const members = flowMembers(structure, flow);
  const shown = (node) => !writeOnly || isWriteNode(node);
  const rowsOf = (ids) => ids.map((id) => ({layer: structure.layers.find((l) => l.id === id), nodes: structure.nodes.filter((n) => n.layer === id && shown(n))})).filter((r) => r.layer && r.nodes.length);
  const main = rowsOf(ARCH_MAIN);
  const side = rowsOf(ARCH_SIDE);
  const known = new Set([...ARCH_MAIN, ...ARCH_SIDE]);
  const foot = rowsOf(structure.layers.map((l) => l.id).filter((id) => !known.has(id)));
  const row = (r) => `<div class="ar-row" data-layer="${escapeHtml(r.layer.id)}"><span class="ar-cap">${escapeHtml(r.layer.label)}</span><div class="ar-boxes">${r.nodes.map((n) => archBox(n, members, selected)).join('')}</div></div>`;
  const link = (a, b) => {
    const ids = new Set(a.nodes.map((n) => n.id));
    const to = new Set(b.nodes.map((n) => n.id));
    const edge = structure.edges.find((e) => ids.has(e.from) && to.has(e.to));
    if (!edge) return '<div class="ar-gap" aria-hidden="true"></div>';
    const isSelected = selected?.type === 'edge' && selected.id === edge.id;
    return `<button type="button" class="ar-link" data-arch-edge="${escapeHtml(edge.id)}" data-dim="${!members.edges.has(edge.id)}" aria-pressed="${isSelected}">`
      + `<span class="ar-arrow" aria-hidden="true">↓</span><span class="ar-label">${escapeHtml(edge.label)}</span></button>`;
  };
  const chain = main.map((r, i) => (i ? link(main[i - 1], r) : '') + row(r)).join('');
  const kinds = [...new Set(structure.edges.filter((e) => ['forward', 'redirect', 'error'].includes(e.kind)).map((e) => KIND_LABELS[e.kind]))];
  const sideHtml = side.length
    ? `<div class="ar-side">${side.map(row).join('')}<p class="ar-note">컨트롤러가 ${escapeHtml(kinds.join(' · '))}으로 보내는 화면</p></div>` : '';
  const footHtml = foot.length ? `<div class="ar-foot">${foot.map(row).join('')}</div>` : '';
  return `<div class="ar" role="group" aria-label="한눈에 보는 구조"><h4 class="ar-title">한눈에 보는 구조</h4>`
    + '<p class="ar-help">상자에 커서를 올리면 요약이 보이고, 누르면 아래 설명으로 이동합니다. 터치 화면에서는 한 번 누르면 요약, 한 번 더 누르면 이동합니다.</p>'
    + `<div class="ar-grid"><div class="ar-chain">${chain}</div>${sideHtml}</div>${footHtml}<div class="ar-tip" id="ar-tip" role="tooltip" hidden></div></div>`
    + '<h4 class="st-sub">계층별로 자세히 보기</h4>';
}

export function structureHtml(structure, {flow = 'overview', selected = null, showFlows = true, writeOnly = false} = {}) {
  const members = flowMembers(structure, flow);
  const groups = edgeGroups(structure);
  const flows = showFlows
    ? '<div class="st-flows" role="group" aria-label="기능 선택">'
      + Object.entries(structure.flows).map(([id, f]) => `<button type="button" data-flow="${escapeHtml(id)}" aria-pressed="${id === flow}">${escapeHtml(f.label)}</button>`).join('') + '</div>'
    : '';
  const toggle = `<div class="st-tools"><button type="button" class="st-writeonly" data-writeonly aria-pressed="${writeOnly}">✎ 구현해야 하는 부분만 보기</button>`
    + '<span class="st-legend"><span class="st-write">✎ 구현 필요</span> 직접 구현해야 하는 파일 · 점선 상자는 제공 파일(수정하지 않음)</span></div>';
  const shown = (node) => !writeOnly || isWriteNode(node);
  const shownEdge = (edge) => shown(nodeById(structure, edge.from)) && shown(nodeById(structure, edge.to));
  // 설명 상자는 하나만 두고, 누른 버튼이 속한 묶음 바로 아래에 둔다. 선택이 없으면 도식 맨 아래에 안내 문구로 둔다.
  const detail = `<div class="st-detail" aria-live="polite">${detailHtml(structure, selected)}</div>`;
  const selNode = selected?.type === 'node' ? nodeById(structure, selected.id) : null;
  const selEdge = selected?.type === 'edge' ? edgeById(structure, selected.id) : null;
  let placed = false;
  const slot = (here) => { if (here && !placed) { placed = true; return detail; } return ''; };
  const rows = structure.layers.map((layer) => {
    const nodes = structure.nodes.filter((n) => n.layer === layer.id && shown(n));
    if (!nodes.length) return '';
    const downEdges = (groups.down[layer.id] || []).filter(shownEdge);
    const downs = downEdges.map((e) => edgeButton(structure, e, members, selected)).join('');
    return `<section class="st-layer" data-layer="${escapeHtml(layer.id)}"><h4>${escapeHtml(layer.label)}</h4>`
      + `<div class="st-nodes">${nodes.map((n) => nodeButton(n, members, selected)).join('')}</div>`
      + slot(selNode?.layer === layer.id)
      + (downs ? `<div class="st-edges" role="group" aria-label="${escapeHtml(layer.label)}에서 다음 단계로">${downs}</div>` : '')
      + slot(selEdge && downEdges.some((e) => e.id === selEdge.id)) + '</section>';
  }).join('');
  const backEdges = groups.back.filter(shownEdge);
  const back = backEdges.length
    ? `<section class="st-layer st-back"><h4>응답과 같은 계층 안의 연결</h4><div class="st-edges" role="group" aria-label="응답 방식">${backEdges.map((e) => edgeButton(structure, e, members, selected)).join('')}</div>${slot(selEdge && backEdges.some((e) => e.id === selEdge.id))}</section>`
    : '';
  return `<div class="st" data-active-flow="${escapeHtml(flow)}" data-write-only="${writeOnly}">${flows}${toggle}${archHtml(structure, {flow, selected, writeOnly})}<div class="st-diagram">${rows}${back}</div>${placed ? '' : detail}</div>`;
}

export function detailHtml(structure, selected, {canOpen = false, targetTitles = {}} = {}) {
  if (!selected) return '<p class="st-hint">상자나 화살표를 눌러 역할과 뼈대 코드를 확인하세요.</p>';
  if (selected.type === 'edge') {
    const edge = edgeById(structure, selected.id);
    if (!edge) return '';
    const from = nodeById(structure, edge.from);
    const to = nodeById(structure, edge.to);
    return `<h3>${escapeHtml(from.label)} → ${escapeHtml(to.label)} <span class="st-badge">${escapeHtml(KIND_LABELS[edge.kind] || edge.kind)}</span></h3>`
      + `<p>${escapeHtml(edge.data)}</p>`
      + `<p><button type="button" class="st-link" data-node="${escapeHtml(from.id)}">${escapeHtml(from.label)} 보기</button> <button type="button" class="st-link" data-node="${escapeHtml(to.id)}">${escapeHtml(to.label)} 보기</button></p>`;
  }
  const node = nodeById(structure, selected.id);
  if (!node) return '';
  const list = (items) => (items.length ? `<ul>${items.map((i) => `<li>${escapeHtml(i)}</li>`).join('')}</ul>` : '<p class="st-none">없음</p>');
  const targets = node.targets.length
    ? `<p class="st-targets">작성 대상: ${node.targets.map((t) => `<span class="st-chip">${escapeHtml(targetTitles[t] || t)}</span>`).join('')}</p>`
    : '<p class="st-targets">제공 파일입니다. 수정하지 않습니다.</p>';
  return `<h3>${escapeHtml(node.label)} <span class="st-badge">${escapeHtml(node.kind)}</span></h3>`
    + `<p>${escapeHtml(node.role)}</p>`
    + (node.path ? `<p class="st-path">${escapeHtml(node.path)}${canOpen ? ` <button type="button" class="st-link" data-open="${escapeHtml(node.path)}">이 파일 열기</button>` : ''}</p>` : '')
    + targets
    + `<div class="st-io"><div><h4>받는 값</h4>${list(node.receives)}</div><div><h4>보내는 값</h4>${list(node.sends)}</div></div>`
    + `<h4>뼈대</h4>${codeWindow(languageOf(node), node.skeleton.join('\n'))}`;
}

// container에 도식을 그리고 눌림을 처리합니다. onOpenFile이 있으면 상자의 파일을 열 수 있습니다.
export function mountStructure(container, structure, {flow = 'overview', selected = null, writeOnly = false, showFlows = true, onOpenFile = null, canOpenFile = () => true, targetTitles = {}, onChange = () => {}} = {}) {
  const state = {flow, selected, writeOnly};
  const controller = new AbortController();

  function paint() {
    tipFor = null;
    container.innerHTML = structureHtml(structure, {flow: state.flow, selected: state.selected, showFlows, writeOnly: state.writeOnly});
    const detail = container.querySelector('.st-detail');
    const path = state.selected?.type === 'node' ? nodeById(structure, state.selected.id)?.path : null;
    detail.innerHTML = detailHtml(structure, state.selected, {canOpen: !!onOpenFile && !!path && canOpenFile(path), targetTitles});
  }

  // 마우스를 올리거나 키보드 포커스가 오면 요약 말풍선을 띄운다.
  let tipFor = null;
  let lastPointer = 'mouse';
  const archTarget = (el) => el?.closest?.('[data-arch-node],[data-arch-edge]');
  const archKey = (el) => (el.dataset.archNode ? 'node:' + el.dataset.archNode : 'edge:' + el.dataset.archEdge);
  function hideTip() {
    const tip = container.querySelector('.ar-tip');
    container.querySelectorAll('[aria-describedby="ar-tip"]').forEach((el) => el.removeAttribute('aria-describedby'));
    if (tip) tip.hidden = true;
    tipFor = null;
  }
  function showTip(el) {
    const tip = container.querySelector('.ar-tip');
    const ar = container.querySelector('.ar');
    if (!tip || !ar) return;
    hideTip();
    tip.innerHTML = el.dataset.archNode ? tipHtml(structure, 'node', el.dataset.archNode) : tipHtml(structure, 'edge', el.dataset.archEdge);
    tip.hidden = false;
    el.setAttribute('aria-describedby', 'ar-tip');
    const a = ar.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const left = Math.max(8, Math.min(r.left - a.left + r.width / 2 - tip.offsetWidth / 2, a.width - tip.offsetWidth - 8));
    tip.style.left = left + 'px';
    tip.style.top = (r.bottom - a.top + 6) + 'px';
    tipFor = archKey(el);
  }
  const touchLike = (event) => event.detail !== 0 && (lastPointer === 'touch' || lastPointer === 'pen' || !!globalThis.matchMedia?.('(hover: none)').matches);
  container.addEventListener('pointerdown', (event) => { lastPointer = event.pointerType || 'mouse'; }, {signal: controller.signal});
  container.addEventListener('pointermove', (event) => { if (event.pointerType === 'mouse') lastPointer = 'mouse'; }, {signal: controller.signal});
  const touching = () => lastPointer === 'touch' || lastPointer === 'pen';
  container.addEventListener('pointerover', (event) => { if (event.pointerType === 'mouse' && !touching() && archTarget(event.target)) showTip(archTarget(event.target)); }, {signal: controller.signal});
  container.addEventListener('pointerout', (event) => { if (event.pointerType === 'mouse' && archTarget(event.target) && !archTarget(event.relatedTarget)) hideTip(); }, {signal: controller.signal});
  container.addEventListener('focusin', (event) => { if (!touching() && archTarget(event.target)) showTip(archTarget(event.target)); }, {signal: controller.signal});
  container.addEventListener('focusout', (event) => { if (archTarget(event.target) && !archTarget(event.relatedTarget)) hideTip(); }, {signal: controller.signal});
  container.addEventListener('keydown', (event) => { lastPointer = 'key'; if (event.key === 'Escape') hideTip(); }, {signal: controller.signal});

  // 그림의 상자를 누르면 그 상자를 선택하고 아래 설명 상자로 이동한다.
  function goToDetail() {
    const detail = container.querySelector('.st-detail');
    if (!detail) return;
    detail.tabIndex = -1;
    const calm = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    detail.scrollIntoView({behavior: calm ? 'auto' : 'smooth', block: 'start'});
    detail.focus({preventScroll: true});
  }

  container.addEventListener('click', (event) => {
    const arch = archTarget(event.target);
    if (arch) {
      if (touchLike(event) && tipFor !== archKey(arch)) { showTip(arch); return; }
      state.selected = arch.dataset.archNode ? {type: 'node', id: arch.dataset.archNode} : {type: 'edge', id: arch.dataset.archEdge};
      paint();
      onChange({...state});
      goToDetail();
      return;
    }
    const open = event.target.closest('[data-open]');
    const node = event.target.closest('[data-node]');
    const edge = event.target.closest('[data-edge]');
    const flowButton = event.target.closest("button[data-flow]");
    if (open && onOpenFile) { onOpenFile(open.dataset.open); return; }
    if (event.target.closest('[data-writeonly]')) {
      state.writeOnly = !state.writeOnly;
      // 숨겨진 상자나 화살표의 설명이 남지 않게 선택을 푼다.
      const hidden = (id) => state.writeOnly && !isWriteNode(nodeById(structure, id));
      const sel = state.selected;
      if (sel?.type === 'node' && hidden(sel.id)) state.selected = null;
      if (sel?.type === 'edge') { const e = edgeById(structure, sel.id); if (!e || hidden(e.from) || hidden(e.to)) state.selected = null; }
      paint(); onChange({...state});
      container.querySelector('[data-writeonly]')?.focus();
      return;
    }
    if (flowButton) { state.flow = flowButton.dataset.flow; paint(); onChange({...state}); return; }
    let target;
    if (node) target = {type: 'node', id: node.dataset.node};
    else if (edge) target = {type: 'edge', id: edge.dataset.edge};
    else return;
    // 이미 선택된 상자나 화살표를 도식에서 다시 누르면 선택을 풀어 설명을 접는다. 설명 안의 "보기" 링크는 접지 않는다.
    const fold = state.selected?.type === target.type && state.selected.id === target.id && !!event.target.closest('.st-node, .st-edge');
    state.selected = fold ? null : target;
    paint();
    onChange({...state});
    // 눌렀던 상자에 포커스를 돌려 키보드 사용자가 위치를 잃지 않게 한다.
    const key = target.type === 'node' ? `[data-node="${target.id}"].st-node` : `[data-edge="${target.id}"]`;
    container.querySelector(key)?.focus();
  }, {signal: controller.signal});

  paint();
  return {
    setFlow(id) { if (structure.flows[id]) { state.flow = id; paint(); } },
    select(selection) { state.selected = selection; paint(); },
    selected: () => state.selected,
    destroy() { controller.abort(); container.innerHTML = ''; },
  };
}
