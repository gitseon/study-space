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

function nodeButton(node, members, selected) {
  const active = members.nodes.has(node.id);
  const isSelected = selected?.type === 'node' && selected.id === node.id;
  return `<button type="button" class="st-node" data-node="${escapeHtml(node.id)}" data-kind="${escapeHtml(node.kind)}" data-dim="${!active}" aria-pressed="${isSelected}">`
    + `<span class="st-name">${escapeHtml(node.label)}</span><span class="st-kind">${escapeHtml(node.kind)}</span></button>`;
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

export function structureHtml(structure, {flow = 'overview', selected = null, showFlows = true} = {}) {
  const members = flowMembers(structure, flow);
  const groups = edgeGroups(structure);
  const flows = showFlows
    ? '<div class="st-flows" role="group" aria-label="기능 선택">'
      + Object.entries(structure.flows).map(([id, f]) => `<button type="button" data-flow="${escapeHtml(id)}" aria-pressed="${id === flow}">${escapeHtml(f.label)}</button>`).join('') + '</div>'
    : '';
  const rows = structure.layers.map((layer) => {
    const nodes = structure.nodes.filter((n) => n.layer === layer.id);
    if (!nodes.length) return '';
    const downs = (groups.down[layer.id] || []).map((e) => edgeButton(structure, e, members, selected)).join('');
    return `<section class="st-layer" data-layer="${escapeHtml(layer.id)}"><h4>${escapeHtml(layer.label)}</h4>`
      + `<div class="st-nodes">${nodes.map((n) => nodeButton(n, members, selected)).join('')}</div>`
      + (downs ? `<div class="st-edges" role="group" aria-label="${escapeHtml(layer.label)}에서 다음 단계로">${downs}</div>` : '') + '</section>';
  }).join('');
  const back = groups.back.length
    ? `<section class="st-layer st-back"><h4>응답과 같은 계층 안의 연결</h4><div class="st-edges" role="group" aria-label="응답 방식">${groups.back.map((e) => edgeButton(structure, e, members, selected)).join('')}</div></section>`
    : '';
  return `<div class="st" data-active-flow="${escapeHtml(flow)}">${flows}<div class="st-diagram">${rows}${back}</div><div class="st-detail" aria-live="polite">${detailHtml(structure, selected)}</div></div>`;
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
export function mountStructure(container, structure, {flow = 'overview', selected = null, showFlows = true, onOpenFile = null, canOpenFile = () => true, targetTitles = {}, onChange = () => {}} = {}) {
  const state = {flow, selected};
  const controller = new AbortController();

  function paint() {
    container.innerHTML = structureHtml(structure, {flow: state.flow, selected: state.selected, showFlows});
    const detail = container.querySelector('.st-detail');
    const path = state.selected?.type === 'node' ? nodeById(structure, state.selected.id)?.path : null;
    detail.innerHTML = detailHtml(structure, state.selected, {canOpen: !!onOpenFile && !!path && canOpenFile(path), targetTitles});
  }

  container.addEventListener('click', (event) => {
    const open = event.target.closest('[data-open]');
    const node = event.target.closest('[data-node]');
    const edge = event.target.closest('[data-edge]');
    const flowButton = event.target.closest("button[data-flow]");
    if (open && onOpenFile) { onOpenFile(open.dataset.open); return; }
    if (flowButton) { state.flow = flowButton.dataset.flow; paint(); onChange({...state}); return; }
    if (node) state.selected = {type: 'node', id: node.dataset.node};
    else if (edge) state.selected = {type: 'edge', id: edge.dataset.edge};
    else return;
    paint();
    onChange({...state});
    // 눌렀던 상자에 포커스를 돌려 키보드 사용자가 위치를 잃지 않게 한다.
    const key = state.selected.type === 'node' ? `[data-node="${state.selected.id}"].st-node` : `[data-edge="${state.selected.id}"]`;
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
