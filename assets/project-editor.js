// 월말평가 Web 프로젝트의 다중 파일 편집기. 위쪽은 DOM 없이 시험할 수 있는 순수 함수이고 아래쪽이 화면을 붙이는 mountProjectEditor입니다.
import {attachEditor, editKey} from './code-editor.js';
import {highlight, windowLabel} from './highlight.js';

// ---------------------------------------------------------------- 순수 함수

export function buildTree(paths) {
  const root = {children: []};
  for (const path of paths) {
    const parts = path.split('/');
    let node = root;
    parts.forEach((name, index) => {
      const full = parts.slice(0, index + 1).join('/');
      const isFile = index === parts.length - 1;
      let next = node.children.find((c) => c.name === name && c.type === (isFile ? 'file' : 'dir'));
      if (!next) {
        next = isFile ? {type: 'file', name, path: full} : {type: 'dir', name, path: full, children: []};
        node.children.push(next);
      }
      node = next;
    });
  }
  const sort = (nodes) => {
    nodes.sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name, 'en', {sensitivity: 'base'}) : a.type === 'dir' ? -1 : 1));
    nodes.forEach((n) => n.children && sort(n.children));
  };
  sort(root.children);
  return root.children;
}

export function layoutFor(width) {
  if (width >= 1200) return 'desktop';
  if (width >= 768) return 'tablet';
  return 'mobile';
}

export const languageOptions = (language) => ({braces: language === 'java'});

export function lineCount(text) {
  return text.split('\n').length;
}

export const withLineNumbers = (count) => Array.from({length: count}, (_, i) => i + 1).join('\n');

// 현재 텍스트에서 target 표식 한 쌍을 찾습니다. 표식은 사용자가 지우거나 겹칠 수 있어서 상태를 함께 알립니다.
export function findRegion(text, targetId) {
  const lines = text.split('\n');
  const starts = [];
  const ends = [];
  lines.forEach((line, index) => {
    if (line.includes(`study-target:${targetId}:start`)) starts.push(index);
    if (line.includes(`study-target:${targetId}:end`)) ends.push(index);
  });
  if (starts.length > 1 || ends.length > 1) return {status: 'duplicate'};
  if (starts.length !== 1 || ends.length !== 1 || ends[0] <= starts[0]) return {status: 'missing'};
  return {status: 'ok', startLine: starts[0] + 1, endLine: ends[0] + 1, startIndex: starts[0], endIndex: ends[0]};
}

export function regionBody(text, targetId) {
  const region = findRegion(text, targetId);
  if (region.status !== 'ok') return null;
  const lines = text.split('\n');
  return lines.slice(region.startIndex + 1, region.endIndex).map((l) => `${l}\n`).join('');
}

// 시작 텍스트와 비교한 영역 상태. 맞고 틀림을 판정하지 않고 '바뀜' 여부만 알립니다.
export function targetStates(currentFiles, startFiles, targets) {
  const states = {};
  for (const target of targets) {
    const current = currentFiles[target.path];
    if (typeof current !== 'string') {
      states[target.id] = 'missing';
      continue;
    }
    const body = regionBody(current, target.id);
    if (body === null) {
      states[target.id] = 'marker-lost';
      continue;
    }
    const startBody = typeof startFiles[target.path] === 'string' ? regionBody(startFiles[target.path], target.id) : null;
    states[target.id] = body === startBody ? 'unchanged' : 'changed';
  }
  return states;
}

export function findNext(text, query, from = 0) {
  if (!query) return -1;
  const haystack = text.toLowerCase();
  const needle = query.toLowerCase();
  const index = haystack.indexOf(needle, from);
  return index !== -1 ? index : haystack.indexOf(needle);
}

// ---------------------------------------------------------------- 화면

const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

export function mountProjectEditor(container, {files, activePath, readOnly = false, mode = 'write', fontSize = 14, wrap = false, onChange = () => {}, onSelect = () => {}}) {
  const meta = new Map(files.map((f) => [f.path, {language: f.language, editable: f.editable}]));
  const texts = new Map(files.map((f) => [f.path, f.text]));
  const state = {path: activePath && meta.has(activePath) ? activePath : files[0]?.path, readOnly, mode, fontSize, wrap, open: []};
  if (state.path) state.open.push(state.path);

  container.innerHTML = '<div class="pe" data-testid="project-editor">'
    + '<div class="pe-tabs" role="tablist" aria-label="열린 파일"></div>'
    + '<div class="pe-pathbar"><span class="pe-path-text"></span><span class="pe-badge"></span></div>'
    + '<p class="pe-keyhint" id="pe-keyhint">입력 칸에서 Esc를 누른 뒤 Tab을 누르면 입력 칸을 벗어납니다. Tab만 누르면 들여쓰기입니다.</p>'
    + '<div class="pe-body"><pre class="pe-gutter" aria-hidden="true"></pre>'
    + '<div class="pe-stack"><pre class="pe-hl" aria-hidden="true"><code></code></pre><textarea class="pe-input code-editor" wrap="off" spellcheck="false" autocomplete="off" autocapitalize="off" autocorrect="off" aria-label="코드 입력" aria-describedby="pe-keyhint"></textarea></div>'
    + '<pre class="pe-view" tabindex="0" aria-label="코드 읽기"><code></code></pre></div></div>';
  const root = container.firstElementChild;
  const tabs = root.querySelector('.pe-tabs');
  const pathText = root.querySelector('.pe-path-text');
  const badge = root.querySelector('.pe-badge');
  const gutter = root.querySelector('.pe-gutter');
  const input = root.querySelector('.pe-input');
  const view = root.querySelector('.pe-view');
  const stack = root.querySelector('.pe-stack');
  const hlCode = root.querySelector('.pe-hl code');
  const hl = root.querySelector('.pe-hl');
  const viewCode = view.querySelector('code');

  const isEditing = () => !!state.path && meta.get(state.path)?.editable && !state.readOnly && state.mode === 'write';
  let detach = () => {};
  let lastFind = 0;

  function paintGutter(text) {
    gutter.textContent = withLineNumbers(lineCount(text));
  }

  // 작성 모드의 색: 글자는 투명한 textarea가 입력을 받고, 같은 글자를 색 입힌 채로 바로 아래 층(.pe-hl)이 보여 준다.
  function syncHl() {
    hl.scrollTop = input.scrollTop;
    hl.scrollLeft = input.scrollLeft;
  }

  // textarea에 스크롤바가 생기면 글자 영역이 좁아지므로 같은 만큼 색 층의 여백을 늘려 줄바꿈과 위치를 맞춘다.
  function fitHl() {
    if (input.hidden) return;
    hl.style.paddingRight = `${12 + (input.offsetWidth - input.clientWidth)}px`;
    hl.style.paddingBottom = `${12 + (input.offsetHeight - input.clientHeight)}px`;
  }

  function paintHl(language) {
    hlCode.innerHTML = highlight(language, input.value) + '\n';
    fitHl();
    syncHl();
  }

  function paintTabs() {
    tabs.innerHTML = state.open.map((path) => {
      const name = path.split('/').pop();
      const selected = path === state.path;
      return `<span class="pe-tab${selected ? ' active' : ''}"><button type="button" role="tab" class="pe-tab-main" aria-selected="${selected}" data-path="${escapeHtml(path)}" title="${escapeHtml(path)}">${escapeHtml(name)}</button>`
        + (state.open.length > 1 ? `<button type="button" class="pe-tab-close" data-close="${escapeHtml(path)}" aria-label="${escapeHtml(name)} 닫기">×</button>` : '') + '</span>';
    }).join('');
  }

  function render() {
    root.dataset.mode = isEditing() ? 'write' : 'read';
    root.dataset.wrap = state.wrap ? 'on' : 'off';
    root.style.setProperty('--pe-font', `${state.fontSize}px`);
    paintTabs();
    if (!state.path) {
      pathText.textContent = '';
      badge.textContent = '';
      return;
    }
    const info = meta.get(state.path);
    const text = texts.get(state.path);
    root.dataset.lang = info.language;
    pathText.textContent = `${state.path} · ${windowLabel(info.language)}`;
    badge.textContent = info.editable ? (state.readOnly ? '잠김' : '작성 파일') : '제공 파일 · 읽기 전용';
    badge.dataset.kind = info.editable ? (state.readOnly ? 'locked' : 'editable') : 'provided';
    paintGutter(text);
    gutter.hidden = state.wrap;
    const editing = isEditing();
    input.hidden = !editing;
    stack.hidden = !editing;
    view.hidden = editing;
    if (editing) {
      if (input.value !== text) input.value = text;
      input.wrap = state.wrap ? 'soft' : 'off';
      paintHl(info.language);
    } else {
      viewCode.innerHTML = highlight(info.language, text);
    }
    detach();
    detach = editing ? bind(info.language) : () => {};
  }

  function bind(language) {
    const handler = () => {
      const text = input.value;
      if (texts.get(state.path) === text) return;
      texts.set(state.path, text);
      paintGutter(text);
      onChange({path: state.path, text});
    };
    // attachEditor가 붙인 리스너를 떼기 위해 매 렌더마다 textarea를 복제하지 않고, 같은 핸들러를 한 번만 붙이는 래퍼를 쓴다.
    const controller = new AbortController();
    // Esc를 누른 뒤 Tab을 누르면 들여쓰기가 아니라 포커스 이동으로 처리해 키보드 사용자가 편집 칸을 벗어날 수 있게 한다.
    let escaped = false;
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') { escaped = true; return; }
      if (event.key === 'Tab' && escaped) { escaped = false; event.stopImmediatePropagation(); return; }
      if (event.key !== 'Shift') escaped = false;
    }, {signal: controller.signal});
    const proxy = {
      addEventListener: (type, fn) => input.addEventListener(type, fn, {signal: controller.signal}),
      get value() { return input.value; },
      set value(v) { input.value = v; },
      get selectionStart() { return input.selectionStart; },
      get selectionEnd() { return input.selectionEnd; },
      setSelectionRange: (a, b) => input.setSelectionRange(a, b),
    };
    attachEditor(proxy, handler, languageOptions(language));
    input.addEventListener('scroll', () => { gutter.scrollTop = input.scrollTop; syncHl(); }, {signal: controller.signal});
    input.addEventListener('input', () => paintHl(language), {signal: controller.signal});
    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(() => { fitHl(); syncHl(); });
      observer.observe(input);
      controller.signal.addEventListener('abort', () => observer.disconnect());
    }
    return () => controller.abort();
  }

  view.addEventListener('scroll', () => { gutter.scrollTop = view.scrollTop; });

  function flush() {
    if (state.path && isEditing() && texts.get(state.path) !== input.value) {
      texts.set(state.path, input.value);
      onChange({path: state.path, text: input.value});
    }
  }

  function select(path) {
    if (!meta.has(path)) return;
    flush();
    state.path = path;
    if (!state.open.includes(path)) state.open.push(path);
    render();
    onSelect(path);
  }

  tabs.addEventListener('click', (event) => {
    const main = event.target.closest('[data-path]');
    const close = event.target.closest('[data-close]');
    if (main) select(main.dataset.path);
    if (close && state.open.length > 1) {
      flush();
      const path = close.dataset.close;
      state.open = state.open.filter((p) => p !== path);
      if (state.path === path) state.path = state.open[state.open.length - 1];
      render();
      onSelect(state.path);
    }
  });

  function lineHeight() {
    const el = isEditing() ? input : view;
    const value = parseFloat(getComputedStyle(el).lineHeight);
    return Number.isFinite(value) ? value : state.fontSize * 1.6;
  }

  function goto(line) {
    const text = texts.get(state.path) || '';
    const lines = text.split('\n');
    const index = Math.max(0, Math.min(line - 1, lines.length - 1));
    const top = Math.max(0, index * lineHeight() - lineHeight() * 3);
    if (isEditing()) {
      const offset = lines.slice(0, index).reduce((n, l) => n + l.length + 1, 0);
      input.setSelectionRange(offset, offset + lines[index].length);
      input.scrollTop = top;
    } else {
      view.scrollTop = top;
    }
    gutter.scrollTop = top;
  }

  render();
  return {
    flush,
    select,
    goto,
    currentPath: () => state.path,
    getText: (path) => texts.get(path),
    setText(path, text) {
      texts.set(path, text);
      if (path === state.path) render();
    },
    setReadOnly(value) { flush(); state.readOnly = !!value; render(); },
    setMode(value) { flush(); state.mode = value; render(); },
    setFontSize(value) { state.fontSize = Math.max(11, Math.min(24, value)); render(); },
    setWrap(value) { state.wrap = !!value; render(); },
    fontSize: () => state.fontSize,
    wrap: () => state.wrap,
    isEditing,
    indent(outdent = false) {
      if (!isEditing()) return;
      const result = editKey({value: input.value, start: input.selectionStart, end: input.selectionEnd}, 'Tab', outdent, languageOptions(meta.get(state.path).language));
      if (!result) return;
      input.value = result.value;
      input.setSelectionRange(result.start, result.end);
      input.dispatchEvent(new Event('input', {bubbles: true}));
    },
    find(query, advance = true) {
      const text = texts.get(state.path) || '';
      const from = advance ? (isEditing() ? input.selectionEnd : lastFind) : 0;
      const index = findNext(text, query, from);
      if (index === -1) return false;
      lastFind = index + query.length;
      const line = text.slice(0, index).split('\n').length;
      if (isEditing()) {
        input.setSelectionRange(index, index + query.length);
      }
      goto(line);
      if (isEditing()) input.setSelectionRange(index, index + query.length);
      return true;
    },
    destroy() {
      detach();
      container.innerHTML = '';
    },
  };
}

// 패널 너비를 min과 max 사이로 맞춘다. max가 min보다 작으면 min을 쓴다.
export function clampPanelWidth(width, min, max) {
  return Math.round(Math.min(Math.max(width, min), Math.max(min, max)));
}
