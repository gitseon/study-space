// 백엔드 · DB 월말평가 구현 연습 화면. 코드는 이 브라우저(IndexedDB)에만 저장하고 서버로 보내지 않습니다.
import {escapeHtml as e} from './render.js';
import {renderNote} from './note-render.js';
import {codeWindow} from './highlight.js';
import {
  CHECK_STATES, DURATION_OPTIONS, continueProjectAttempt, createProjectAttempt, editProjectFile, finishProjectAttempt,
  markHintViewed, markReferenceViewed, parseMinutes, remainingMs, setActivePath, setProjectCheck, setProjectNote,
  syncProjectAttempt,
} from './project-attempt.js';
import {projectStore} from './project-store.js';
import {store} from './storage.js';
import {buildBackups, serializeBackup} from './project-backup.js';
import {checkProjectDraft} from './project-checks.js';
import {buildProjectZip, exportRoot} from './project-export.js';
import {EDITOR_NOTICE, ENV_NOTICE} from './project-notices.js';
import {mountStructure} from './project-structure.js';
import {buildTree, layoutFor, mountProjectEditor, targetStates, findRegion} from './project-editor.js';

const root = document.querySelector('#app');
const params = new URLSearchParams(location.search);
const dataUrl = (path) => new URL('../data/' + path, import.meta.url);
const STAGE_INFO = {
  1: '전체 코드가 주어지고 비어 있는 부분만 채웁니다.',
  2: '메서드 시그니처와 JSP의 정적 틀이 주어지고 본문과 동적 블록을 작성합니다.',
  3: '작성 대상 파일을 처음부터 구현합니다. 설정, DTO, DB 연결은 제공됩니다.',
};
const CHECK_LABELS = {unchecked: '미확인', confirmed: '확인함', 'needs-work': '수정 필요'};
const TARGET_LABELS = {changed: '바뀜', unchanged: '시작 그대로', 'marker-lost': '위치를 찾을 수 없음', missing: '파일 없음'};
const SIDE_TABS = [['req', '요구사항'], ['flow', '흐름'], ['structure', '구조'], ['targets', '작성 대상'], ['check', '점검'], ['ref', '모범답안']];
const SAVE_MESSAGES = {
  'file-too-large': (r) => `${r.path} 파일이 256KB를 넘어 저장하지 못했습니다. 코드는 화면에 남아 있으니 내려받아 보관하세요`,
  'too-large': () => '응시 전체가 2MB를 넘어 저장하지 못했습니다. 코드는 화면에 남아 있으니 내려받아 보관하세요',
  'too-many': () => '프로젝트 응시는 20개까지 저장합니다. 시작 화면에서 이전 응시를 삭제해 주세요',
  unavailable: () => '이 브라우저에서는 저장소를 쓸 수 없습니다. 코드를 내려받아 보관하세요',
  'storage-error': () => '브라우저에 저장하지 못했습니다. 코드를 내려받아 보관하세요',
};

async function getJson(path) {
  const response = await fetch(dataUrl(path));
  if (!response.ok) throw new Error(`${path}를 불러오지 못했습니다`);
  return response.json();
}

const S = {
  index: null, entry: null, attempt: null, view: null, browse: false, editor: null, side: 'req', panel: 'code', mode: 'write',
  dirty: false, chain: Promise.resolve(), saveTimer: null, tickTimer: null, ref: null, hintsOpen: new Set(), conflict: false,
};

const fmt = (ms) => {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return h ? `${h}:${m}:${s}` : `${m}:${s}`;
};

function showError(error) {
  root.innerHTML = `<div class="pj-start"><div class="empty"><h1>월말평가 연습을 열지 못했습니다</h1><p>${e(error.message)}</p><a href="../index.html">문제집으로 돌아가기</a></div></div>`;
}

async function boot() {
  try {
    const manifest = await getJson('manifest.json');
    if (!manifest.webProjects) throw new Error('월말평가 프로젝트 데이터가 없습니다');
    S.index = await getJson(manifest.webProjects.file);
    const attemptId = params.get('attempt');
    if (attemptId) await openAttempt(attemptId);
    else renderStart();
  } catch (error) {
    showError(error);
  }
}

// ---------------------------------------------------------------- 시작 화면

function renderStart(message = '') {
  const first = S.index.projects[0];
  const picked = S.index.projects.find((p) => p.id === params.get('project')) || first;
  const stageParam = Number(params.get('stage'));
  const choice = {
    project: picked.id,
    stage: [1, 2, 3].includes(stageParam) ? stageParam : 1,
    ...parseMinutes(params.get('minutes')),
  };
  const timeNote = choice.fallback ? '<p class="pj-notice" role="status">주소의 시간 값이 올바르지 않아 120분으로 안내합니다.</p>' : '';
  root.innerHTML = '<div class="pj-start"><h1>월말평가 구현 연습</h1>'
    + '<p class="pj-lead">제공된 MVC 템플릿의 비어 있는 부분을 직접 채워 목록, 등록, 상세와 로그인, 로그아웃을 연결합니다. 사이트는 코드를 실행하거나 점수를 매기지 않습니다. 내려받은 프로젝트를 로컬에서 실행해 확인하세요.</p>'
    + `<div class="pj-env" id="pj-env"><p>${e(ENV_NOTICE)}</p><p>${e(EDITOR_NOTICE)}</p></div>`
    + (message ? `<p class="pj-notice" role="status">${e(message)}</p>` : '') + timeNote
    + '<fieldset class="pj-fieldset"><legend>프로젝트</legend><div class="pj-options">'
    + S.index.projects.map((p) => `<label class="pj-option"><input type="radio" name="project" value="${e(p.id)}"${p.id === choice.project ? ' checked' : ''}><span><strong>${e(p.title)}</strong><span>작성 대상 ${p.targetCount}곳 · 3단계</span></span></label>`).join('')
    + '</div></fieldset>'
    + '<fieldset class="pj-fieldset"><legend>단계</legend><div class="pj-options">'
    + picked.stages.map((s) => `<label class="pj-option"><input type="radio" name="stage" value="${s.id}"${s.id === choice.stage ? ' checked' : ''}><span><strong>${s.id}단계 ${e(s.label)}</strong><span>${e(STAGE_INFO[s.id])}</span></span></label>`).join('')
    + '</div></fieldset>'
    + '<fieldset class="pj-fieldset"><legend>제한 시간</legend><div class="pj-options">'
    + DURATION_OPTIONS.map((m) => `<label class="pj-option"><input type="radio" name="minutes" value="${m}"${m === choice.minutes ? ' checked' : ''}><span><strong>${m === 0 ? '시간 제한 없음' : `${m}분`}</strong><span>${m === 120 ? '기본값입니다.' : m === 0 ? '경과 시간만 표시합니다.' : '시작 버튼을 누르면 시간이 흐릅니다.'}</span></span></label>`).join('')
    + '</div></fieldset>'
    + '<div class="pj-actions"><button type="button" class="primary" id="pj-begin">시작하기</button><button type="button" id="pj-browse">템플릿 둘러보기</button></div>'
    + '<p class="pj-lead">둘러보기는 시간과 기록을 만들지 않습니다.</p>'
    + '<section><h2>이어서 하기</h2><div id="pj-attempts"><p class="pj-lead">저장된 응시를 확인하고 있습니다</p></div></section></div>';

  const current = () => ({
    project: root.querySelector('input[name="project"]:checked').value,
    stage: Number(root.querySelector('input[name="stage"]:checked').value),
    minutes: Number(root.querySelector('input[name="minutes"]:checked').value),
  });
  root.querySelector('.pj-start').addEventListener('change', (event) => {
    const c = current();
    params.set('project', c.project);
    params.set('stage', String(c.stage));
    params.set('minutes', String(c.minutes));
    history.replaceState(null, '', `?${params}`);
    if (event.target.name === 'project') renderStart();
  });
  root.querySelector('#pj-begin').onclick = () => begin(current());
  root.querySelector('#pj-browse').onclick = () => openBrowse(current());
  listAttempts();
}

async function listAttempts() {
  const box = root.querySelector('#pj-attempts');
  if (!box) return;
  try {
    const attempts = await projectStore.list();
    if (!attempts.length) {
      box.innerHTML = '<p class="pj-lead">저장된 응시가 없습니다.</p>';
      return;
    }
    const names = {'in-progress': '진행 중', 'time-ended': '시간 종료', review: '작성 마침'};
    box.innerHTML = '<ul class="pj-list">' + attempts.map((a) => {
      const title = e(a.projectSnapshot?.title || a.projectId);
      const when = new Date(a.updatedAt).toLocaleString('ko-KR');
      return `<li><span class="grow"><strong>${title}</strong> ${a.stageId}단계 · ${a.minutes ? `${a.minutes}분` : '시간 제한 없음'} · ${names[a.status]}<br><small>${e(when)}</small></span>`
        + `<a class="pj-btn primary small" href="?attempt=${encodeURIComponent(a.attemptId)}">열기</a><button type="button" class="pj-btn small" data-remove="${e(a.attemptId)}">삭제</button></li>`;
    }).join('') + '</ul>';
    box.onclick = async (event) => {
      const id = event.target.dataset?.remove;
      if (!id || !confirm('이 응시와 작성한 코드를 삭제할까요? 되돌릴 수 없습니다.')) return;
      await projectStore.remove(id);
      listAttempts();
    };
  } catch {
    box.innerHTML = '<p class="pj-notice error">이 브라우저의 저장소를 열 수 없어 이전 응시를 불러오지 못했습니다. 새로 시작할 수는 있지만 저장되지 않을 수 있습니다.</p>';
  }
}

async function loadStage(choice) {
  const entry = S.index.projects.find((p) => p.id === choice.project);
  const stageMeta = entry.stages.find((s) => s.id === choice.stage);
  const [projectJson, stageJson] = await Promise.all([getJson(entry.project), getJson(stageMeta.file)]);
  return {entry, project: {...projectJson, stages: [stageJson]}, stageJson};
}

async function begin(choice) {
  try {
    const {entry, project} = await loadStage(choice);
    S.entry = entry;
    S.browse = false;
    S.attempt = createProjectAttempt(project, choice.stage, choice.minutes, Date.now());
    history.replaceState(null, '', `?attempt=${encodeURIComponent(S.attempt.attemptId)}`);
    renderRun();
    markDirty();
    saveNow();
  } catch (error) {
    showError(error);
  }
}

async function openBrowse(choice) {
  try {
    const {entry, project, stageJson} = await loadStage(choice);
    S.entry = entry;
    S.browse = true;
    S.attempt = null;
    S.view = {
      title: project.title, stageLabel: stageJson.stage.label, stageId: choice.stage, requirements: project.requirements, flow: project.flow,
      checklist: project.checklist, targets: stageJson.targets, hints: stageJson.hints, files: stageJson.files, minutes: choice.minutes, structure: project.structure,
    };
    renderRun();
  } catch (error) {
    showError(error);
  }
}

async function openAttempt(id) {
  let attempt;
  try {
    attempt = await projectStore.load(id);
  } catch {
    renderStart('이 브라우저의 저장소를 열 수 없어 응시를 불러오지 못했습니다.');
    return;
  }
  if (!attempt) {
    renderStart('해당 응시를 찾을 수 없습니다. 삭제되었거나 다른 브라우저에서 만든 기록일 수 있습니다.');
    return;
  }
  S.entry = S.index.projects.find((p) => p.id === attempt.projectId) || null;
  S.browse = false;
  const synced = syncProjectAttempt(attempt, Date.now());
  S.attempt = synced;
  renderRun();
  if (synced !== attempt) markDirty();
}

// ---------------------------------------------------------------- 실행 화면

function viewModel() {
  if (S.view && S.browse) return S.view;
  const snap = S.attempt.projectSnapshot;
  return {
    title: snap.title, stageLabel: snap.stageLabel, stageId: snap.stageId, requirements: snap.requirements, flow: snap.flow,
    checklist: snap.checklist, targets: snap.targets, hints: snap.hints, files: snap.files, minutes: S.attempt.minutes, structure: snap.structure,
  };
}

const locked = () => S.browse || S.attempt.status !== 'in-progress';
const currentFiles = () => {
  const view = viewModel();
  if (S.browse) return Object.fromEntries(view.files.map((f) => [f.path, f.text]));
  return Object.fromEntries(view.files.map((f) => [f.path, f.editable && f.path in S.attempt.files ? S.attempt.files[f.path] : f.text]));
};

function treeHtml(nodes, view) {
  return '<ul>' + nodes.map((n) => {
    if (n.type === 'dir') return `<li class="dir"><button type="button" data-dir="${e(n.path)}">${e(n.name)}</button>${treeHtml(n.children, view)}</li>`;
    const file = view.files.find((f) => f.path === n.path);
    return `<li class="file ${file.editable ? 'editable' : 'provided'}"><button type="button" data-file="${e(n.path)}">${e(n.name)}<span class="tag">${file.editable ? '작성' : '제공'}</span></button></li>`;
  }).join('') + '</ul>';
}

function renderRun() {
  const view = viewModel();
  const editableCount = view.files.filter((f) => f.editable).length;
  const layout = layoutFor(window.innerWidth);
  S.mode = layout === 'mobile' || locked() ? 'read' : 'write';
  const needsSave = !S.browse;
  root.innerHTML = `<div class="pj" id="pj" data-layout="${layout}" data-panel="code" data-files="open" data-side="${layout === 'tablet' ? 'closed' : 'open'}">`
    + '<div class="pj-top"><h1>' + e(view.title) + `</h1><span class="meta">${view.stageId}단계 ${e(view.stageLabel)}</span><span class="spacer"></span>`
    + (S.browse ? '<span class="pj-timer" id="pj-timer">둘러보기 · 시간 기록 없음</span>' : '<span class="pj-timer" id="pj-timer" role="timer"></span>')
    + (needsSave ? '<span class="pj-save" id="pj-save" role="status" data-state="saved"></span>' : '')
    + '<button type="button" class="pj-btn small" id="pj-zip">프로젝트 내려받기(ZIP)</button>'
    + (needsSave ? '<button type="button" class="pj-btn small" id="pj-record">기록 백업(JSON)</button>' : '')
    + '<span class="pj-collapse"><button type="button" class="pj-btn small" id="pj-toggle-files" aria-pressed="false">파일 접기</button><button type="button" class="pj-btn small" id="pj-toggle-side">요구사항 접기</button></span>'
    + '</div><div id="pj-banners"></div>'
    + '<div class="pj-segment" role="group" aria-label="화면 전환"><button type="button" data-panel="files">파일</button><button type="button" data-panel="code" aria-pressed="true">코드</button><button type="button" data-panel="side">요구사항과 점검</button></div>'
    + '<div class="pj-grid">'
    + `<aside class="pj-panel pj-files" aria-label="파일 목록"><header><span>제공 ${view.files.length - editableCount}개 · 작성 ${editableCount}개</span></header><div class="pj-files-body"><div class="pj-tree" id="pj-tree">${treeHtml(buildTree(view.files.map((f) => f.path)), view)}</div></div></aside>`
    + '<section class="pj-panel pj-code" aria-label="코드">'
    + '<div class="pj-toolbar">'
    + '<div class="group" role="group" aria-label="코드 모드"><button type="button" id="pj-mode-read">코드 보기</button><button type="button" id="pj-mode-write">코드 작성</button></div>'
    + '<div class="group"><button type="button" id="pj-font-down" aria-label="글자 작게">A-</button><button type="button" id="pj-font-up" aria-label="글자 크게">A+</button><button type="button" id="pj-wrap" aria-pressed="false">줄바꿈</button></div>'
    + '<div class="group"><input type="search" id="pj-search" placeholder="파일 안 검색" aria-label="파일 안 검색" autocomplete="off"><button type="button" id="pj-find">찾기</button></div>'
    + '<div class="group"><button type="button" id="pj-outdent" aria-label="내어쓰기">⇤</button><button type="button" id="pj-indent" aria-label="들여쓰기">⇥</button></div>'
    + '<div class="group"><button type="button" id="pj-copy">복사</button><button type="button" id="pj-reset">현재 파일 초기화</button></div>'
    + (S.browse ? '' : '<div class="group"><button type="button" id="pj-finish" class="primary">작성 마치기</button></div>')
    + '</div><div class="pj-editor" id="pj-editor"></div></section>'
    + '<aside class="pj-panel pj-side" aria-label="요구사항과 점검"><header><span>요구사항 · 점검</span></header><div class="pj-side-body"><div class="pj-sidetabs" role="tablist" id="pj-sidetabs"></div><div id="pj-sidebody"></div></div></aside>'
    + '</div></div>';

  const files = view.files.map((f) => ({path: f.path, language: f.language, editable: f.editable, text: currentFiles()[f.path]}));
  const active = S.attempt?.activePath || view.targets[0]?.path || files[0].path;
  S.editor = mountProjectEditor(root.querySelector('#pj-editor'), {
    files, activePath: active, readOnly: locked(), mode: S.mode,
    onChange: handleEdit,
    onSelect: handleSelect,
  });
  wireRun();
  if (window.visualViewport) document.documentElement.style.setProperty('--vvh', `${window.visualViewport.height}px`);
  paintTree();
  paintToolbar();
  renderSide();
  renderTimer();
  paintSave();
  paintBanners();
  startTick();
}

function wireRun() {
  const $ = (sel) => root.querySelector(sel);
  const pj = $('#pj');
  $('#pj-tree').addEventListener('click', (event) => {
    const dir = event.target.closest('[data-dir]');
    if (dir) dir.parentElement.classList.toggle('closed');
    const file = event.target.closest('[data-file]');
    if (file) {
      S.editor.select(file.dataset.file);
      if (pj.dataset.layout === 'mobile') setPanel('code');
    }
  });
  pj.querySelectorAll('.pj-segment [data-panel]').forEach((button) => button.addEventListener('click', () => setPanel(button.dataset.panel)));
  $('#pj-toggle-files').onclick = () => {
    const collapsed = pj.dataset.files === 'collapsed';
    pj.dataset.files = collapsed ? 'open' : 'collapsed';
    $('#pj-toggle-files').textContent = collapsed ? '파일 접기' : '파일 펼치기';
  };
  $('#pj-toggle-side').onclick = () => {
    const tablet = pj.dataset.layout === 'tablet';
    const open = pj.dataset.side === 'open';
    pj.dataset.side = open ? (tablet ? 'closed' : 'collapsed') : 'open';
    $('#pj-toggle-side').textContent = open ? '요구사항 펼치기' : '요구사항 접기';
  };
  $('#pj-mode-read').onclick = () => setMode('read');
  $('#pj-mode-write').onclick = () => setMode('write');
  $('#pj-font-down').onclick = () => S.editor.setFontSize(S.editor.fontSize() - 1);
  $('#pj-font-up').onclick = () => S.editor.setFontSize(S.editor.fontSize() + 1);
  $('#pj-wrap').onclick = () => {
    S.editor.setWrap(!S.editor.wrap());
    $('#pj-wrap').setAttribute('aria-pressed', String(S.editor.wrap()));
  };
  const find = () => {
    const query = $('#pj-search').value;
    if (!query) return;
    if (!S.editor.find(query)) notify('찾는 글자가 이 파일에 없습니다');
  };
  $('#pj-find').onclick = find;
  $('#pj-search').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { event.preventDefault(); find(); }
  });
  $('#pj-indent').onclick = () => S.editor.indent(false);
  $('#pj-outdent').onclick = () => S.editor.indent(true);
  $('#pj-copy').onclick = async () => {
    const text = S.editor.getText(S.editor.currentPath()) || '';
    try {
      await navigator.clipboard.writeText(text);
      notify('현재 파일을 복사했습니다');
    } catch {
      notify('복사하지 못했습니다. 코드 창에서 직접 선택해 복사해 주세요');
    }
  };
  $('#pj-reset').onclick = resetCurrentFile;
  $('#pj-zip').onclick = downloadZip;
  const record = $('#pj-record');
  if (record) record.onclick = backupCurrent;
  const finish = $('#pj-finish');
  if (finish) finish.onclick = finishNow;
  $('#pj-sidetabs').addEventListener('click', (event) => {
    const tab = event.target.closest('[data-side]');
    if (tab) { S.side = tab.dataset.side; renderSide(); }
  });
  $('#pj-sidebody').addEventListener('click', onSideClick);
  $('#pj-sidebody').addEventListener('change', onSideChange);
  window.addEventListener('resize', applyLayout);
  window.visualViewport?.addEventListener('resize', () => document.documentElement.style.setProperty('--vvh', `${window.visualViewport.height}px`));
  document.addEventListener('visibilitychange', () => { if (document.hidden) saveNow(); });
  window.addEventListener('pagehide', () => saveNow());
  window.addEventListener('beforeunload', (event) => {
    S.editor?.flush();
    if (S.dirty) { event.preventDefault(); event.returnValue = ''; }
  });
  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') { event.preventDefault(); saveNow(); }
  });
}

function setPanel(name) {
  const pj = root.querySelector('#pj');
  pj.dataset.panel = name;
  pj.querySelectorAll('.pj-segment [data-panel]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.panel === name)));
}

function applyLayout() {
  const pj = root.querySelector('#pj');
  if (!pj) return;
  const layout = layoutFor(window.innerWidth);
  if (pj.dataset.layout === layout) return;
  pj.dataset.layout = layout;
  if (layout === 'tablet' && pj.dataset.side === 'collapsed') pj.dataset.side = 'closed';
  if (layout === 'desktop' && pj.dataset.side === 'closed') pj.dataset.side = 'open';
}

function setMode(mode) {
  if (mode === 'write' && locked()) return;
  S.mode = mode;
  S.editor.setMode(mode);
  paintToolbar();
}

function paintToolbar() {
  const $ = (sel) => root.querySelector(sel);
  const canWrite = !locked();
  $('#pj-mode-read').setAttribute('aria-pressed', String(S.mode === 'read'));
  $('#pj-mode-write').setAttribute('aria-pressed', String(S.mode === 'write'));
  $('#pj-mode-write').disabled = !canWrite;
  const editing = S.editor.isEditing();
  $('#pj-indent').disabled = !editing;
  $('#pj-outdent').disabled = !editing;
  const path = S.editor.currentPath();
  const file = viewModel().files.find((f) => f.path === path);
  $('#pj-reset').disabled = !canWrite || !file?.editable;
}

function paintTree() {
  const path = S.editor.currentPath();
  root.querySelectorAll('#pj-tree [data-file]').forEach((b) => {
    if (b.dataset.file === path) b.setAttribute('aria-current', 'true');
    else b.removeAttribute('aria-current');
  });
}

function notify(text) {
  const box = root.querySelector('#pj-banners');
  if (!box) return;
  let note = box.querySelector('.pj-banner.note');
  if (!note) {
    note = document.createElement('div');
    note.className = 'pj-banner note';
    note.setAttribute('role', 'status');
    box.appendChild(note);
  }
  note.textContent = text;
  clearTimeout(S.noteTimer);
  S.noteTimer = setTimeout(() => note.remove(), 4000);
}

// ---------------------------------------------------------------- 편집과 저장

function handleSelect(path) {
  paintTree();
  paintToolbar();
  if (S.attempt && !S.browse) {
    S.attempt = setActivePath(S.attempt, path);
    markDirty();
  }
}

function handleEdit({path, text}) {
  if (S.browse || !S.attempt) return;
  const result = editProjectFile(S.attempt, path, text, Date.now());
  if (!result.accepted) {
    S.editor.setText(path, S.attempt.files[path] ?? text);
    tick();
    return;
  }
  S.attempt = result.attempt;
  markDirty();
  scheduleTargetRefresh();
}

function resetCurrentFile() {
  const path = S.editor.currentPath();
  const start = viewModel().files.find((f) => f.path === path);
  if (!start?.editable || locked()) return;
  if (!confirm(`${path} 파일을 시작 상태로 되돌릴까요? 이 파일에 작성한 내용이 사라집니다.`)) return;
  S.editor.setText(path, start.text);
  handleEdit({path, text: start.text});
}

function markDirty() {
  if (S.browse) return;
  S.dirty = true;
  setSave('unsaved');
  clearTimeout(S.saveTimer);
  S.saveTimer = setTimeout(saveNow, 500);
}

function saveNow() {
  clearTimeout(S.saveTimer);
  S.editor?.flush();
  S.chain = S.chain.then(doSave).catch(() => {});
  return S.chain;
}

async function doSave() {
  if (!S.attempt || S.browse || !S.dirty) return;
  const snapshot = S.attempt;
  S.dirty = false;
  setSave('saving');
  const result = await projectStore.save(snapshot, {expectedVersion: snapshot.saveVersion});
  if (result.saved) {
    S.attempt = {...S.attempt, saveVersion: result.saveVersion};
    S.conflict = false;
    setSave(S.dirty ? 'unsaved' : 'saved');
    return;
  }
  S.dirty = true;
  if (result.conflict) {
    S.conflict = true;
    setSave('conflict', '다른 탭이나 창에서 이 응시가 바뀌었습니다. 이 화면의 코드는 저장되지 않았습니다.');
    paintBanners();
    return;
  }
  const message = (SAVE_MESSAGES[result.reason] || SAVE_MESSAGES['storage-error'])(result);
  setSave('error', message);
  paintBanners();
}

function setSave(state, message = '') {
  S.saveState = state;
  S.saveMessage = message;
  paintSave();
  const key = `${state === 'error'}|${S.conflict}`;
  if (key !== S.bannerKey) {
    S.bannerKey = key;
    paintBanners();
  }
}

function paintSave() {
  const el = root.querySelector('#pj-save');
  if (!el) return;
  const labels = {saved: '저장됨', saving: '저장 중', unsaved: '저장 대기', error: '저장되지 않음', conflict: '저장되지 않음 · 충돌'};
  el.dataset.state = S.saveState || 'saved';
  el.textContent = labels[S.saveState || 'saved'] + (S.saveState === 'error' || S.saveState === 'conflict' ? ` — ${S.saveMessage}` : '');
}

function downloadText(name, text) {
  const url = URL.createObjectURL(new Blob([text], {type: 'application/json'}));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function downloadBlob(name, blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function downloadZip() {
  S.editor?.flush();
  const view = viewModel();
  const project = {id: S.attempt ? S.attempt.projectId : S.entry.id, stageId: view.stageId, files: view.files};
  try {
    const blob = await buildProjectZip(project, S.attempt ? S.attempt.files : {});
    downloadBlob(`${exportRoot(project)}.zip`, blob);
    notify('프로젝트를 내려받았습니다. 새 폴더에 풀어 STS에서 가져오세요');
  } catch (error) {
    notify(`프로젝트를 만들지 못했습니다: ${error.message}`);
  }
}

function backupCurrent() {
  S.editor?.flush();
  const files = buildBackups(store.exportProgress(), [S.attempt]);
  downloadText(`project-attempt-${S.attempt.attemptId.slice(0, 8)}.json`, serializeBackup(files[0]));
}

// ---------------------------------------------------------------- 시간과 상태 배너

function renderTimer() {
  const el = root.querySelector('#pj-timer');
  if (!el || S.browse) return;
  const now = Date.now();
  if (S.attempt.status !== 'in-progress') {
    el.textContent = S.attempt.status === 'time-ended' ? '시간 종료' : '작성 마침';
    el.className = 'pj-timer over';
    return;
  }
  const remain = remainingMs(S.attempt, now);
  if (remain === null) {
    el.textContent = `경과 ${fmt(now - S.attempt.startedAt)}`;
    el.className = 'pj-timer';
  } else {
    el.textContent = `남은 시간 ${fmt(remain)}`;
    el.className = 'pj-timer' + (remain <= 5 * 60000 ? ' low' : '');
  }
}

function tick() {
  if (!S.attempt || S.browse) return;
  const synced = syncProjectAttempt(S.attempt, Date.now());
  if (synced !== S.attempt) {
    S.editor.flush();
    S.attempt = synced;
    lockUi();
    markDirty();
  }
  renderTimer();
}

function startTick() {
  clearInterval(S.tickTimer);
  S.tickTimer = setInterval(tick, 1000);
}

function lockUi() {
  S.editor.setReadOnly(true);
  S.mode = 'read';
  S.editor.setMode('read');
  paintToolbar();
  paintBanners();
  renderSide();
}

function finishNow() {
  if (locked()) return;
  if (!confirm('작성을 마치면 코드가 잠기고 점검 단계로 넘어갑니다. 계속할까요?')) return;
  S.editor.flush();
  S.attempt = finishProjectAttempt(S.attempt, Date.now(), 'manual');
  lockUi();
  markDirty();
  renderTimer();
  setSide('check');
}

function setSide(name) {
  S.side = name;
  renderSide();
}

async function continueAttempt() {
  const next = continueProjectAttempt(S.attempt, Date.now());
  const result = await projectStore.save(next, {expectedVersion: 0});
  if (!result.saved) {
    alert((SAVE_MESSAGES[result.reason] || SAVE_MESSAGES['storage-error'])(result));
    return;
  }
  location.href = `?attempt=${encodeURIComponent(next.attemptId)}`;
}

function paintBanners() {
  const box = root.querySelector('#pj-banners');
  if (!box) return;
  const keep = box.querySelector('.pj-banner.note');
  const parts = [];
  if (S.browse) {
    parts.push('<div class="pj-banner">템플릿을 둘러보는 중입니다. 시간과 기록이 없고 코드는 읽기 전용입니다. <a class="pj-btn primary small" href="?" id="pj-start-link">시작 화면으로</a></div>');
  } else if (S.attempt.status === 'time-ended') {
    parts.push('<div class="pj-banner warn">시간이 종료되었습니다. 작성한 코드는 그대로 보존됩니다. 이어서 연습하면 이 코드로 시간 제한 없는 새 응시가 만들어지고 이 응시는 바뀌지 않습니다. <button type="button" class="pj-btn small primary" id="pj-continue">계속 연습</button></div>');
  } else if (S.attempt.status === 'review') {
    parts.push('<div class="pj-banner">작성을 마쳤습니다. 점검 탭에서 로컬 실행 결과를 확인하세요. <button type="button" class="pj-btn small" id="pj-continue">계속 연습</button></div>');
  }
  if (S.saveState === 'error') {
    parts.push('<div class="pj-banner warn" role="alert">저장하지 못했지만 코드는 이 화면에 남아 있습니다. <button type="button" class="pj-btn small" id="pj-backup">코드 백업 내려받기</button> <button type="button" class="pj-btn small" id="pj-retry">다시 저장</button></div>');
  }
  if (S.conflict) {
    parts.push('<div class="pj-banner warn" role="alert">다른 곳에서 이 응시가 먼저 저장되었습니다. <button type="button" class="pj-btn small" id="pj-latest">최신본 열기</button> <button type="button" class="pj-btn small" id="pj-fork">내 코드를 새 응시로 복제</button> <button type="button" class="pj-btn small" id="pj-backup">코드 백업 내려받기</button></div>');
  }
  box.innerHTML = parts.join('');
  if (keep) box.appendChild(keep);
  const on = (id, fn) => { const el = box.querySelector(id); if (el) el.onclick = fn; };
  on('#pj-continue', continueAttempt);
  on('#pj-backup', backupCurrent);
  on('#pj-retry', () => { S.dirty = true; saveNow(); });
  on('#pj-latest', () => location.reload());
  on('#pj-fork', async () => {
    S.editor.flush();
    const forked = continueProjectAttempt(finishProjectAttempt(S.attempt, Date.now(), 'manual'), Date.now());
    const result = await projectStore.save(forked, {expectedVersion: 0});
    if (result.saved) location.href = `?attempt=${encodeURIComponent(forked.attemptId)}`;
    else alert((SAVE_MESSAGES[result.reason] || SAVE_MESSAGES['storage-error'])(result));
  });
  const link = box.querySelector('#pj-start-link');
  if (link) link.href = location.pathname;
}

// ---------------------------------------------------------------- 오른쪽 패널

function renderSide() {
  const tabs = root.querySelector('#pj-sidetabs');
  tabs.innerHTML = SIDE_TABS.map(([id, label]) => `<button type="button" role="tab" data-side="${id}" aria-selected="${S.side === id}">${label}</button>`).join('');
  const body = root.querySelector('#pj-sidebody');
  const view = viewModel();
  if (S.side === 'req') body.innerHTML = `<div class="pj-doc">${renderNote(view.requirements).html}</div>`;
  else if (S.side === 'flow') body.innerHTML = `<div class="pj-doc">${renderNote(view.flow).html}</div>`;
  else if (S.side === 'structure') mountStructurePanel(body, view);
  else if (S.side === 'targets') body.innerHTML = targetsHtml(view);
  else if (S.side === 'check') body.innerHTML = checkHtml(view);
  else body.innerHTML = refHtml();
}

function mountStructurePanel(body, view) {
  if (!view.structure) {
    body.innerHTML = '<p class="pj-progress">이 응시를 시작할 때는 구조 도식이 없었습니다. 새 응시에서 볼 수 있습니다.</p>';
    return;
  }
  const targetTitles = Object.fromEntries(view.targets.map((t) => [t.id, t.title]));
  S.structureState ||= {flow: 'overview', selected: null};
  mountStructure(body, view.structure, {
    ...S.structureState,
    targetTitles,
    canOpenFile: (path) => view.files.some((f) => f.path === path),
    onOpenFile: (path) => {
      S.editor.select(path);
      if (root.querySelector('#pj').dataset.layout === 'mobile') setPanel('code');
      notify(`${path.split('/').pop()}을 열었습니다`);
    },
    onChange: (state) => { S.structureState = state; },
  });
}

function currentStates() {
  const view = viewModel();
  const start = Object.fromEntries(view.files.map((f) => [f.path, f.text]));
  return targetStates(currentFiles(), start, view.targets);
}

function targetsHtml(view) {
  const states = currentStates();
  const files = currentFiles();
  return '<p class="pj-progress">영역이 바뀌었는지만 보여줍니다. 코드가 맞는지는 판정하지 않습니다.</p>' + view.targets.map((t) => {
    const hints = view.hints?.[t.id] || [];
    const open = S.hintsOpen.has(t.id);
    const lost = states[t.id] === 'marker-lost';
    return `<div class="pj-target"><h3>${e(t.title)} <span class="pj-state" data-state="${states[t.id]}">${TARGET_LABELS[states[t.id]]}</span></h3>`
      + `<p>${e(t.path)} · ${e(t.requirementId)}</p>`
      + (lost ? '<p>위치를 찾을 수 없어 직접 확인이 필요합니다.</p>' : '')
      + `<p><button type="button" class="pj-btn small" data-act="goto" data-target="${e(t.id)}"${files[t.path] === undefined ? ' disabled' : ''}>이동</button> `
      + `<button type="button" class="pj-btn small" data-act="hint" data-target="${e(t.id)}"${hints.length ? '' : ' disabled'}>${open ? '힌트 접기' : '힌트 보기'}</button></p>`
      + (open ? `<ol class="pj-hints">${hints.map((h) => `<li>${e(h)}</li>`).join('')}</ol>` : '') + '</div>';
  }).join('');
}

function checkHtml(view) {
  const checks = S.attempt?.checks || {};
  const confirmed = Object.values(checks).filter((v) => v === 'confirmed').length;
  const disabled = S.browse ? ' disabled' : '';
  const help = S.attempt?.viewedHints?.length || S.attempt?.viewedReference
    ? `<p class="pj-progress">도움 사용: ${S.attempt.viewedHints.length ? `힌트 ${S.attempt.viewedHints.length}곳` : ''}${S.attempt.viewedHints.length && S.attempt.viewedReference ? ', ' : ''}${S.attempt.viewedReference ? '모범답안' : ''}</p>` : '';
  return draftCheckHtml(view) + `<p class="pj-progress" id="pj-progress">확인함 ${confirmed}/${view.checklist.length} · 점수나 합격 판정은 없습니다</p>${help}`
    + (S.browse ? '<p class="pj-progress">응시를 시작하면 점검 상태를 기록할 수 있습니다.</p>' : '')
    + view.checklist.map((c) => {
      const state = checks[c.id] || 'unchecked';
      return `<div class="pj-check" data-check="${e(c.id)}"><h3>${e(c.title)}</h3>`
        + `<div class="pj-states" role="group" aria-label="${e(c.title)} 점검 상태">${CHECK_STATES.map((s) => `<button type="button" data-act="check" data-id="${e(c.id)}" data-state="${s}" aria-pressed="${state === s}"${disabled}>${CHECK_LABELS[s]}</button>`).join('')}</div>`
        + `<details><summary>실행 순서와 기대 결과</summary><ol>${c.steps.map((s) => `<li>${e(s)}</li>`).join('')}</ol><p>기대 결과: ${e(c.expected)}</p></details>`
        + `<textarea data-note="${e(c.id)}" placeholder="메모" aria-label="${e(c.title)} 메모"${disabled}>${e(S.attempt?.notes?.[c.id] || '')}</textarea></div>`;
    }).join('');
}

function draftCheckHtml(view) {
  const findings = S.findings;
  let result = '';
  if (findings) {
    result = findings.length
      ? `<ul class="pj-hints" id="pj-findings">${findings.map((f) => `<li>${e(f.message)} <button type="button" class="pj-btn small" data-act="goto" data-target="${e(f.targetId)}">이동</button></li>`).join('')}</ul>`
      : '<p class="pj-progress" id="pj-findings">작성 영역에서 누락된 흔적을 찾지 못했습니다. 실행해 보지 않았으므로 동작은 아래 점검 항목으로 확인하세요.</p>';
  }
  return `<div class="pj-target"><h3>작성 점검</h3><p>작성하지 않은 영역이 있을 가능성만 알려줍니다. 컴파일이나 실행 결과가 아니며 점검 상태를 바꾸지 않습니다.</p><p><button type="button" class="pj-btn small" data-act="draft-check">작성 점검 실행</button></p>${result}</div>`;
}

function refHtml() {
  if (S.browse) return '<p class="pj-progress">응시를 시작한 뒤 열 수 있습니다.</p>';
  if (!S.entry) return '<p class="pj-progress">원고가 바뀌어 모범답안을 찾을 수 없습니다.</p>';
  if (S.entry.hash !== S.attempt.projectSnapshot.hash) {
    return '<p class="pj-progress">이 응시를 시작한 뒤 원고가 바뀌어 지금의 모범답안과 맞지 않을 수 있어 열 수 없습니다. 시작 당시의 파일은 그대로 복원됩니다.</p>';
  }
  if (!S.ref) {
    return '<p class="pj-progress">모범답안은 정답 판정이 아니라 비교용입니다. 열람하면 기록에 도움 사용으로 표시되고 점검 상태는 바뀌지 않습니다. 다른 구현도 올바를 수 있습니다.</p>'
      + '<button type="button" class="pj-btn" data-act="open-ref">모범답안 열기</button>';
  }
  const path = S.refPath || S.ref.files[0].path;
  const file = S.ref.files.find((f) => f.path === path) || S.ref.files[0];
  const mine = currentFiles()[file.path] ?? '';
  return `<div class="pj-ref"><label>파일 <select data-act="ref-file">${S.ref.files.map((f) => `<option value="${e(f.path)}"${f.path === file.path ? ' selected' : ''}>${e(f.path)}</option>`).join('')}</select></label>`
    + `<h3>모범답안</h3>${codeWindow(file.language, file.text)}<h3>내 코드</h3>${codeWindow(file.language, mine)}</div>`;
}

let targetRefreshTimer = null;
function scheduleTargetRefresh() {
  if (S.side !== 'targets' && S.side !== 'req') return;
  clearTimeout(targetRefreshTimer);
  targetRefreshTimer = setTimeout(() => { if (S.side === 'targets') renderSide(); }, 400);
}

async function onSideClick(event) {
  const button = event.target.closest('[data-act]');
  if (!button) return;
  const act = button.dataset.act;
  const view = viewModel();
  if (act === 'goto') {
    const target = view.targets.find((t) => t.id === button.dataset.target);
    S.editor.select(target.path);
    const region = findRegion(S.editor.getText(target.path) || '', target.id);
    if (region.status === 'ok') S.editor.goto(region.startLine);
    else notify('위치를 찾을 수 없어 직접 확인이 필요합니다');
    if (root.querySelector('#pj').dataset.layout === 'mobile') setPanel('code');
  } else if (act === 'hint') {
    const id = button.dataset.target;
    if (S.hintsOpen.has(id)) S.hintsOpen.delete(id);
    else {
      S.hintsOpen.add(id);
      if (S.attempt) { S.attempt = markHintViewed(S.attempt, id); markDirty(); }
    }
    renderSide();
  } else if (act === 'draft-check') {
    S.editor.flush();
    S.findings = checkProjectDraft({targets: view.targets, files: view.files}, view.stageId, currentFiles());
    renderSide();
  } else if (act === 'check' && S.attempt) {
    S.attempt = setProjectCheck(S.attempt, button.dataset.id, button.dataset.state);
    markDirty();
    renderSide();
  } else if (act === 'open-ref') {
    if (!confirm('모범답안을 열면 기록에 도움 사용으로 표시됩니다. 열까요?')) return;
    try {
      S.ref = await getJson(S.entry.referenceFile);
      S.attempt = markReferenceViewed(S.attempt);
      markDirty();
      renderSide();
    } catch (error) {
      notify(error.message);
    }
  }
}

function onSideChange(event) {
  const target = event.target;
  if (target.dataset.act === 'ref-file') {
    S.refPath = target.value;
    renderSide();
  } else if (target.dataset.note && S.attempt) {
    S.attempt = setProjectNote(S.attempt, target.dataset.note, target.value);
    markDirty();
  }
}

boot();
