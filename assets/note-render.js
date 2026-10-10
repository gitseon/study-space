import {escapeHtml, inline} from './render.js';
import {highlight, languageNames} from './highlight.js';

// Renders the small Markdown subset used by the concept notes: headings, paragraphs, tables, flat
// lists with checkboxes, code fences and inline code, bold and math through render.js. Nothing is
// passed through as HTML.

// Bold may wrap inline code, so the markers are tracked across the code and math segments.
function rich(text) {
  let bold = false;
  return String(text ?? '')
    .split(/(`[^`]+`|\$[^$]+\$)/g)
    .map((part) => {
      if (part.startsWith('`') || (part.startsWith('$') && part.length > 1)) {
        return inline(part);
      }
      return part.split('**').map((piece, i) => {
        if (i > 0) {
          bold = !bold;
        }
        return (i > 0 ? (bold ? '<strong>' : '</strong>') : '') + escapeHtml(piece);
      }).join('');
    })
    .join('') + (bold ? '</strong>' : '');
}

const splitRow = (line) => line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());
const isDivider = (line) => /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?$/.test(line.trim());

function table(lines) {
  const head = splitRow(lines[0]);
  const rows = lines.slice(2).map(splitRow);
  return '<div class="note-table"><table><thead><tr>' + head.map((c) => '<th scope="col">' + rich(c) + '</th>').join('')
    + '</tr></thead><tbody>' + rows.map((r) => '<tr>' + head.map((_, i) => '<td>' + rich(r[i] ?? '') + '</td>').join('') + '</tr>').join('')
    + '</tbody></table></div>';
}

function list(lines) {
  const ordered = /^\d+\.\s/.test(lines[0]);
  const items = lines.map((line) => {
    const text = line.replace(/^(?:[-*]|\d+\.)\s+/, '');
    const box = text.match(/^\[( |x)\]\s+(.*)$/i);
    if (box) {
      return '<li class="task"><input type="checkbox" disabled' + (box[1] !== ' ' ? ' checked' : '') + '> <span>' + rich(box[2]) + '</span></li>';
    }
    return '<li>' + rich(text) + '</li>';
  });
  const tag = ordered ? 'ol' : 'ul';
  return '<' + tag + '>' + items.join('') + '</' + tag + '>';
}

function code(lang, body) {
  const text = body.replace(/\n$/, '');
  if (languageNames[lang]) {
    return '<figure class="snippet" data-lang="' + lang + '"><figcaption>' + languageNames[lang] + '</figcaption><pre tabindex="0"><code>'
      + highlight(lang, text) + '</code></pre></figure>';
  }
  return '<pre tabindex="0"><code>' + escapeHtml(text) + '</code></pre>';
}

export function renderNote(source) {
  const lines = String(source).replace(/\r\n?/g, '\n').split('\n');
  const html = [];
  const toc = [];
  let title = '';
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
    } else if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const body = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        body.push(lines[i++]);
      }
      i++;
      html.push(code(lang, body.join('\n')));
    } else if (/^#{1,3}\s/.test(line)) {
      const level = line.match(/^#+/)[0].length;
      const text = line.replace(/^#+\s+/, '');
      if (level === 1) {
        title = text;
        html.push('<h1>' + rich(text) + '</h1>');
      } else {
        const id = 'n' + toc.length;
        toc.push({id, level, text});
        html.push('<h' + level + ' id="' + id + '">' + rich(text) + '</h' + level + '>');
      }
      i++;
    } else if (line.trim().startsWith('|') && i + 1 < lines.length && isDivider(lines[i + 1])) {
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(lines[i++]);
      }
      html.push(table(rows));
    } else if (/^(?:[-*]|\d+\.)\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^(?:[-*]|\d+\.)\s/.test(lines[i])) {
        items.push(lines[i++]);
      }
      html.push(list(items));
    } else {
      const paragraph = [];
      while (i < lines.length && lines[i].trim() && !/^(```|#{1,3}\s|\||(?:[-*]|\d+\.)\s)/.test(lines[i])) {
        paragraph.push(lines[i++]);
      }
      html.push('<p>' + rich(paragraph.join(' ')) + '</p>');
    }
  }
  return {title, toc, html: html.join('\n')};
}
