// Tiny syntax colouring for the frontend snippets. Every piece of source text is escaped before it is wrapped in a span.
const escape = (s) => s.replace(/[&<>"']/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

const JS_KEYWORDS = 'async await break case catch class const continue default else export finally for function if import in let new of return switch this throw try typeof var while yield';
const JS_LITERALS = 'true false null undefined NaN Infinity';

const rules = {
  js: [
    ['c', /\/\/[^\n]*|\/\*[\s\S]*?\*\//y],
    ['s', /`(?:\\[\s\S]|[^`\\])*`|'(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"/y],
    ['n', /\b\d+(?:\.\d+)?n?\b/y],
    ['w', /[A-Za-z_$][\w$]*/y],
  ],
  css: [
    ['c', /\/\*[\s\S]*?\*\//y],
    ['s', /'(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"/y],
    ['k', /@[\w-]+/y],
    ['p', /-?[a-z][\w-]*(?=\s*:)/y],
    ['n', /#[0-9a-fA-F]{3,8}\b|-?\d*\.?\d+(?:px|em|rem|%|vh|vw|fr|s|ms|deg)?/y],
  ],
  html: [
    ['c', /<!--[\s\S]*?-->/y],
    ['t', /<\/?[A-Za-z][\w-]*|\/?>|<!DOCTYPE/y],
    ['s', /"[^"\n]*"|'[^'\n]*'/y],
    ['a', /[A-Za-z-]+(?==)/y],
  ],
};

export const languageNames = {js: 'JavaScript', css: 'CSS', html: 'HTML'};

export function highlight(lang, source) {
  const list = rules[lang];
  if (!list) {
    return escape(source);
  }
  const keywords = new Set(JS_KEYWORDS.split(' '));
  const literals = new Set(JS_LITERALS.split(' '));
  let out = '';
  let plain = '';
  let i = 0;
  const flush = () => {
    out += escape(plain);
    plain = '';
  };
  while (i < source.length) {
    let hit = null;
    for (const [kind, re] of list) {
      re.lastIndex = i;
      const m = re.exec(source);
      if (m && m[0]) {
        hit = [kind, m[0]];
        break;
      }
    }
    if (!hit) {
      plain += source[i++];
      continue;
    }
    let [kind, text] = hit;
    if (kind === 'w') {
      kind = keywords.has(text) ? 'k' : literals.has(text) ? 'n' : null;
    }
    i += text.length;
    if (!kind) {
      plain += text;
      continue;
    }
    flush();
    out += '<span class="tok-' + kind + '">' + escape(text) + '</span>';
  }
  flush();
  return out;
}
