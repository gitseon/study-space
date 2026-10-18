// Indentation rules for the practice code box on the SW역량테스트 page. editKey() is pure so it can be tested without a browser.
// It takes the text and the selection and returns the new text and selection, or null when the key keeps its normal behaviour.
export const INDENT = '    ';

const lineStart = (text, index) => text.lastIndexOf('\n', index - 1) + 1;

// Tab indents by four spaces. Shift+Tab, or Tab over several lines, shifts every touched line.
function shiftLines({value, start, end}, outdent) {
  const first = lineStart(value, start);
  const lastIndex = end > start && value[end - 1] === '\n' ? end - 1 : end;
  const nl = value.indexOf('\n', lastIndex);
  const last = nl === -1 ? value.length : nl;
  let firstDelta = 0;
  let total = 0;
  const lines = value.slice(first, last).split('\n').map((line, i) => {
    const change = outdent ? -Math.min(INDENT.length, line.match(/^ */)[0].length) : INDENT.length;
    const next = outdent ? line.slice(-change) : INDENT + line;
    if (i === 0) {
      firstDelta = change;
    }
    total += change;
    return next;
  });
  return {
    value: value.slice(0, first) + lines.join('\n') + value.slice(last),
    start: Math.max(first, start + firstDelta),
    end: Math.max(first, end + total),
  };
}

function enter({value, start, end}) {
  const ls = lineStart(value, start);
  const head = value.slice(ls, start);
  const base = head.match(/^ */)[0];
  const opens = head.trimEnd().endsWith('{');
  const closes = value.slice(end).match(/^ *}/);
  if (opens && closes) {
    const caret = start + 1 + base.length + INDENT.length;
    return {value: value.slice(0, start) + '\n' + base + INDENT + '\n' + base + value.slice(end), start: caret, end: caret};
  }
  const add = base + (opens ? INDENT : '');
  const caret = start + 1 + add.length;
  return {value: value.slice(0, start) + '\n' + add + value.slice(end), start: caret, end: caret};
}

// A closing brace typed on an otherwise blank line steps back one level.
function closeBrace({value, start, end}) {
  const ls = lineStart(value, start);
  const head = value.slice(ls, start);
  if (start !== end || head.length < INDENT.length || head.trim() !== '') {
    return null;
  }
  const kept = head.slice(INDENT.length);
  const caret = ls + kept.length + 1;
  return {value: value.slice(0, ls) + kept + '}' + value.slice(end), start: caret, end: caret};
}

export function editKey(state, key, shift = false) {
  const {value, start, end} = state;
  if (key === 'Tab') {
    if (shift || value.slice(start, end).includes('\n')) {
      return shiftLines(state, shift);
    }
    const caret = start + INDENT.length;
    return {value: value.slice(0, start) + INDENT + value.slice(end), start: caret, end: caret};
  }
  if (key === 'Enter') {
    return enter(state);
  }
  if (key === '}') {
    return closeBrace(state);
  }
  return null;
}

// Wires the rules to a textarea. onChange runs after every edit the rules make, so the caller can save the text.
export function attachEditor(area, onChange = () => {}) {
  area.addEventListener('keydown', (ev) => {
    if (ev.isComposing || ev.ctrlKey || ev.metaKey || ev.altKey) {
      return;
    }
    const result = editKey({value: area.value, start: area.selectionStart, end: area.selectionEnd}, ev.key, ev.shiftKey);
    if (!result) {
      return;
    }
    ev.preventDefault();
    area.value = result.value;
    area.setSelectionRange(result.start, result.end);
    onChange();
  });
  area.addEventListener('input', onChange);
}
