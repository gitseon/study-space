import {diagram} from './diagram.js';
import {codeWindow} from './highlight.js';

export const escapeHtml = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

export function renderMath(tex, displayMode = false) {
  const katex = globalThis.katex;
  if (!katex) {
    return '<span class="math-fallback">' + escapeHtml(tex) + '</span>';
  }
  return katex.renderToString(tex, {displayMode, throwOnError: false, strict: 'ignore', output: 'htmlAndMathml'});
}

// Inline Markdown subset: `code`, $math$ and **bold**. Everything else is escaped text.
export function inline(text) {
  return String(text ?? '')
    .split(/(`[^`]+`|\$[^$]+\$)/g)
    .map((part) => {
      if (part.startsWith('`') && part.endsWith('`') && part.length > 1) {
        // Short code stays in one piece; long code may wrap so a phone screen never scrolls sideways.
        return '<code' + (part.length > 30 ? ' class="long"' : '') + '>' + escapeHtml(part.slice(1, -1)) + '</code>';
      }
      if (part.startsWith('$') && part.endsWith('$') && part.length > 1) {
        return renderMath(part.slice(1, -1));
      }
      return escapeHtml(part).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    })
    .join('');
}

export function markdown(text) {
  return String(text || '')
    .split(/(```[\s\S]*?```)/g)
    .map((part) => {
      if (part.startsWith('```')) {
        const lang = part.match(/^```(\w*)/)[1];
        const body = part.replace(/^```[^\n]*\n?/, '').replace(/```$/, '');
        if (lang === 'tree' || lang === 'graph') {
          try {
            return diagram(lang, body);
          } catch {
            // An invalid diagram still shows its text form; the build validator reports it.
          }
        }
        return codeWindow(lang, body.trimEnd());
      }
      return part
        .trim()
        .split(/\n\s*\n/)
        .filter(Boolean)
        .map((paragraph) => '<p>' + inline(paragraph).replace(/\n/g, ' ') + '</p>')
        .join('');
    })
    .join('');
}

// 쿼리 실행 결과 표. NULL 셀은 회색 이탤릭으로, 숫자 셀은 오른쪽 정렬로 보이고, 행이 없으면 빈 결과라고 알려 준다.
const NUMBER_CELL = /^-?\d+(\.\d+)?$/;
export function resultTablesHtml(tables) {
  if (!Array.isArray(tables) || !tables.length) {
    return '';
  }
  const cell = (value) => (value === 'NULL'
    ? '<td class="rt-null">NULL</td>'
    : '<td' + (NUMBER_CELL.test(value) ? ' class="rt-num"' : '') + '>' + escapeHtml(value) + '</td>');
  return '<div class="result-tables" role="group" aria-label="쿼리 실행 결과">' + tables.map((table) => {
    const head = table.columns.map((c) => '<th scope="col">' + escapeHtml(c) + '</th>').join('');
    const body = table.rows.length
      ? table.rows.map((row) => '<tr>' + row.map(cell).join('') + '</tr>').join('')
      : '<tr><td class="rt-empty" colspan="' + table.columns.length + '">결과 없음</td></tr>';
    return '<figure class="rt"><figcaption>' + escapeHtml(table.title) + '<span>' + table.rows.length + '행</span></figcaption>'
      + '<div class="rt-scroll"><table><thead><tr>' + head + '</tr></thead><tbody>' + body + '</tbody></table></div>'
      + (table.note ? '<p class="rt-note">' + escapeHtml(table.note) + '</p>' : '') + '</figure>';
  }).join('') + '</div>';
}

// Solutions are written as one paragraph with labels such as "정답 근거:" and "풀이:". Each label starts its own bold line.
const SOLUTION_LABELS = '정답 근거|흔한 실수|허용 표기|모범답안|풀이|근거|정답|접근|비교';
export function solutionMarkdown(text) {
  const label = new RegExp('(^|[.!?]\\s+)(' + SOLUTION_LABELS + '):\\s*', 'g');
  return String(text || '')
    .split(/(```[\s\S]*?```)/g)
    .map((part) => (part.startsWith('```') ? part : part.replace(label, (_, lead, name) => (lead ? lead.trimEnd() + '\n\n' : '') + '**' + name + ':** ')))
    .join('');
}

export async function loadExam(id) {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id || '')) {
    throw Error('선택한 회차를 찾지 못했습니다');
  }
  const res = await fetch(new URL('../data/' + id + '.json', import.meta.url));
  if (!res.ok) {
    throw Error('선택한 회차를 찾지 못했습니다');
  }
  return res.json();
}

export function download(name, content, type = 'application/json') {
  const url = URL.createObjectURL(new Blob([content], {type: type + ';charset=utf-8'}));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const typeNames = {mc: '객관식', short: '단답형', essay: '서술형', code: '구현형'};

export const gradingNames = {exam: '모두 풀고 한 번에 채점', study: '한 문제씩 정답 확인'};
