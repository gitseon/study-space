import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {archHtml, detailHtml, tipHtml, edgeGroups, featureForTab, flowMembers, isWriteNode, languageOf, structureHtml} from '../../assets/project-structure.js';

const structure = JSON.parse(readFileSync(new URL('../../source/backend/projects/web-01/project.json', import.meta.url), 'utf8')).structure;
const book = JSON.parse(readFileSync(new URL('../../source/backend/projects/web-02/project.json', import.meta.url), 'utf8')).structure;

test('the list flow reaches the browser, filter, controller, service, DAO, database and the list page', () => {
  const {nodes, edges} = flowMembers(structure, 'list');
  for (const id of ['browser', 'logging', 'gearctl', 'service', 'dao', 'db', 'list', 'header']) assert.ok(nodes.has(id), id);
  assert.ok(!nodes.has('login'));
  assert.ok(edges.has('e-forward-list'));
  assert.ok(!edges.has('e-logout'));
});

test('the overview contains every box and every arrow', () => {
  const {nodes, edges} = flowMembers(structure, 'overview');
  assert.equal(nodes.size, structure.nodes.length);
  assert.equal(edges.size, structure.edges.length);
});

test('every flow only uses arrows and boxes that exist', () => {
  for (const flowId of Object.keys(structure.flows)) {
    const {nodes, edges} = flowMembers(structure, flowId);
    assert.ok(edges.size > 0 && nodes.size > 1, flowId);
  }
});

test('arrows that go down hang under their layer and the rest are collected as the way back', () => {
  const groups = edgeGroups(structure);
  assert.ok(groups.down.client.some((e) => e.id === 'e-request'));
  assert.ok(groups.down.dao.some((e) => e.id === 'e-dao-db'));
  const back = groups.back.map((e) => e.id);
  for (const id of ['e-forward-list', 'e-redirect-list', 'e-error', 'e-include', 'e-logout']) assert.ok(back.includes(id), id);
  assert.ok(!back.includes('e-request'));
});

test('flow tabs map to diagram flows and unknown tabs map to nothing', () => {
  assert.equal(featureForTab(structure, '등록'), 'regist');
  assert.equal(featureForTab(structure, '로그인과 로그아웃'), 'auth');
  assert.equal(featureForTab(structure, '짝으로 기억할 것'), null);
});

test('the html lists every box once, dims boxes outside the chosen flow and marks the selection', () => {
  const html = structureHtml(structure, {flow: 'list', selected: {type: 'node', id: 'gearctl'}});
  for (const node of structure.nodes) assert.equal(html.split(`data-node="${node.id}"`).length - 1 >= 1, true, node.id);
  assert.match(html, /data-node="login"[^>]*data-dim="true"/);
  assert.match(html, /data-node="gearctl"[^>]*data-dim="false"[^>]*aria-pressed="true"/);
  assert.match(html, /GearController/);
});

test('node details show the role, the values passed and a skeleton without method bodies', () => {
  const html = detailHtml(structure, {type: 'node', id: 'gearctl'}, {canOpen: true, targetTitles: {'ctrl-list': '목록 조회 처리'}});
  assert.match(html, /GearController/);
  assert.match(html, /받는 값/);
  assert.match(html, /보내는 값/);
  assert.match(html, /목록 조회 처리/);
  assert.match(html, /data-open="src\/main\/java\/com\/ssafy\/sample\/controller\/GearController\.java"/);
  assert.match(html, /작성 대상/);
  assert.doesNotMatch(html, /service\.selectAll/);
  assert.doesNotMatch(html, /request\.setAttribute/);
  assert.doesNotMatch(detailHtml(structure, {type: 'node', id: 'gearctl'}), /data-open/);
});

test('provided files are described as not to be edited', () => {
  assert.match(detailHtml(structure, {type: 'node', id: 'dbutil'}), /제공 파일입니다/);
});

test('arrow details explain the data and link to both ends', () => {
  const html = detailHtml(structure, {type: 'edge', id: 'e-redirect-list'});
  assert.match(html, /redirect/);
  assert.match(html, /새로고침해도 다시 등록되지 않습니다/);
  assert.match(html, /data-node="gearctl"/);
  assert.match(html, /data-node="list"/);
  assert.match(detailHtml(structure, null), /눌러/);
});

test('text from the data is escaped', () => {
  const evil = structuredClone(structure);
  evil.nodes[0].label = '<img src=x onerror=alert(1)>';
  evil.nodes[0].skeleton = ['<script>alert(1)</script>'];
  const html = structureHtml(evil, {selected: {type: 'node', id: evil.nodes[0].id}});
  assert.doesNotMatch(html, /<img src=x/);
  assert.doesNotMatch(html, /<script>alert/);
});

test('skeleton languages follow the file type and the book project uses its own names', () => {
  assert.equal(languageOf({path: 'a/B.java'}), 'java');
  assert.equal(languageOf({path: 'a/b.jsp'}), 'jsp');
  assert.equal(languageOf({path: null}), 'text');
  const names = book.nodes.map((n) => n.label).join(' ');
  assert.match(names, /BookController/);
  assert.doesNotMatch(JSON.stringify(book), /Gear|gear|용품/);
});

test('the detail box sits directly under the group of the chosen button', () => {
  const node = structure.nodes.find((n) => n.id === 'gearctl');
  const nodeHtml = structureHtml(structure, {selected: {type: 'node', id: node.id}});
  assert.equal(nodeHtml.split('class="st-detail"').length - 1, 1);
  const layer = nodeHtml.split('<section class="st-layer"').find((s) => s.startsWith(` data-layer="${node.layer}"`));
  assert.match(layer, /<\/div><div class="st-detail"/);
  const edge = Object.values(edgeGroups(structure).down).flat()[0];
  const edgeHtml = structureHtml(structure, {selected: {type: 'edge', id: edge.id}});
  assert.equal(edgeHtml.split('class="st-detail"').length - 1, 1);
  assert.match(edgeHtml, /class="st-edges"[^]*?<\/div><div class="st-detail"/);
  const none = structureHtml(structure, {});
  assert.match(none, /<\/section><\/div><div class="st-detail"/);
});

test('boxes with targets are marked as write boxes and the others as provided files', () => {
  const html = structureHtml(structure, {});
  assert.match(html, /data-node="gearctl"[^>]*data-write="true"/);
  assert.match(html, /data-node="dbutil"[^>]*data-write="false"/);
  for (const node of structure.nodes) assert.equal(isWriteNode(node), node.targets.length > 0, node.id);
  assert.equal(html.split('✎ 구현 필요</span><').length - 1 >= structure.nodes.filter(isWriteNode).length, true);
});

test('write-only view keeps only boxes with targets and edges between them', () => {
  const html = structureHtml(structure, {writeOnly: true});
  assert.match(html, /data-write-only="true"/);
  assert.match(html, /data-writeonly[^>]*aria-pressed="true"/);
  for (const node of structure.nodes) {
    assert.equal(html.includes(`data-node="${node.id}" data-kind`), isWriteNode(node), node.id);
  }
  assert.doesNotMatch(html, /data-edge="e-request"/);
  assert.match(html, /data-edge="e-gear-svc"/);
  assert.match(html, /data-edge="e-forward-list"/);
  assert.doesNotMatch(html, /data-edge="e-dao-db"/);
  assert.equal(structureHtml(structure, {}).includes('data-edge="e-request"'), true);
});

test('the architecture picture lists the request path in order with a link per step', () => {
  const html = archHtml(structure, {});
  const order = ['browser', 'logging', 'gearctl', 'service', 'dao', 'db'].map((id) => html.indexOf(`data-arch-node="${id}"`));
  assert.ok(order.every((i) => i >= 0));
  assert.deepEqual([...order].sort((a, b) => a - b), order);
  for (const id of ['e-request', 'e-log', 'e-gear-svc', 'e-svc-dao', 'e-dao-db']) assert.ok(html.includes(`data-arch-edge="${id}"`), id);
  for (const node of structure.nodes) assert.ok(html.includes(`data-arch-node="${node.id}"`), node.id);
  assert.match(html, /data-arch-node="gearctl"[^>]*data-write="true"/);
  assert.match(html, /data-arch-node="dbutil"[^>]*data-write="false"/);
  assert.match(html, /role="tooltip"/);
});

test('the architecture picture follows the write-only view and the selection', () => {
  const html = archHtml(structure, {writeOnly: true, selected: {type: 'node', id: 'service'}});
  for (const node of structure.nodes) assert.equal(html.includes(`data-arch-node="${node.id}"`), isWriteNode(node), node.id);
  assert.match(html, /data-arch-node="service"[^>]*aria-pressed="true"/);
  assert.doesNotMatch(html, /data-arch-edge="e-request"/);
  assert.match(html, /data-arch-edge="e-svc-dao"/);
  assert.match(structureHtml(structure, {}), /class="ar"[^]*class="st-sub"[^]*class="st-diagram"/);
});

test('the hover summary is short, marks the write boxes and escapes the data', () => {
  const html = tipHtml(structure, 'node', 'gearctl');
  assert.match(html, /GearController/);
  assert.match(html, /구현 필요/);
  assert.match(tipHtml(structure, 'node', 'dbutil'), /제공 파일/);
  assert.match(tipHtml(structure, 'edge', 'e-gear-svc'), /GearController → GearService/);
  assert.equal(tipHtml(structure, 'node', 'nope'), '');
  const evil = structuredClone(structure);
  evil.nodes[0].role = '<img src=x onerror=alert(1)>';
  assert.doesNotMatch(tipHtml(evil, 'node', evil.nodes[0].id), /<img/);
});
