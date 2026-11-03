// Tiny syntax colouring for the frontend snippets. Every piece of source text is escaped before it is wrapped in a span.
const escape = (s) => s.replace(/[&<>"']/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

const JS_KEYWORDS = 'async await break case catch class const continue default else export finally for function if import in let new of return switch this throw try typeof var while yield';
const JS_LITERALS = 'true false null undefined NaN Infinity';
const PY_KEYWORDS = 'and as assert break class continue def del elif else except finally for from global if import in is lambda not or pass raise return try while with yield';
const PY_LITERALS = 'True False None';
const JAVA_KEYWORDS = 'abstract boolean break byte case catch char class continue default do double else enum extends final finally float for if implements import instanceof int interface long new package private protected public return short static super switch this throw throws try void while';
const JAVA_LITERALS = 'true false null';

const SQL_KEYWORDS = ('SELECT FROM WHERE GROUP BY HAVING ORDER LIMIT OFFSET INSERT INTO VALUES UPDATE SET DELETE CREATE TABLE ALTER DROP TRUNCATE '
  + 'JOIN LEFT RIGHT INNER OUTER FULL CROSS ON AS AND OR NOT IN EXISTS ANY ALL UNION INTERSECT EXCEPT DISTINCT START TRANSACTION BEGIN ROLLBACK COMMIT '
  + 'SAVEPOINT TO PRIMARY KEY FOREIGN REFERENCES VIEW WITH CHECK OPTION ADD COLUMN INDEX UNIQUE DEFAULT IS LIKE BETWEEN ASC DESC CASE WHEN THEN ELSE END '
  + 'FOR CONSTRAINT CASCADE RESTRICT DATABASE USE SHOW DESCRIBE ENGINE AUTO_INCREMENT').replace(/\s+/g, ' ');
const SQL_LITERALS = 'NULL TRUE FALSE';

const rules = {
  // Java is coloured only where a caller asks for it by name. languageNames stays unchanged on purpose.
  java: [
    ['d', /\/\*\*[\s\S]*?\*\//y],
    ['c', /\/\/[^\n]*|\/\*[\s\S]*?\*\//y],
    ['s', /'(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"/y],
    ['a', /@[A-Za-z_]\w*/y],
    ['n', /\b\d+(?:\.\d+)?[LlFfDd]?\b/y],
    ['w', /[A-Za-z_$][\w$]*/y],
  ],
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
  python: [
    ['c', /#[^\n]*/y],
    ['s', /'(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"/y],
    ['n', /\b\d+(?:\.\d+)?(?:e-?\d+)?\b/y],
    ['w', /[A-Za-z_]\w*/y],
  ],
  sql: [
    ['c', /--[^\n]*|#[^\n]*|\/\*[\s\S]*?\*\//y],
    ['s', /'(?:''|\\.|[^'\\])*'|"(?:\\.|[^"\\])*"/y],
    ['n', /\b\d+(?:\.\d+)?\b/y],
    ['w', /[A-Za-z_]\w*/y],
  ],
  jsp: [
    ['c', /<%--[\s\S]*?--%>|<!--[\s\S]*?-->/y],
    ['k', /<%[@=!]?|%>/y],
    ['t', /<\/?[A-Za-z][\w:-]*|\/?>|<!DOCTYPE/y],
    ['s', /"[^"\n]*"|'[^'\n]*'/y],
    ['a', /[A-Za-z-]+(?==)/y],
  ],
  html: [
    ['c', /<!--[\s\S]*?-->/y],
    ['t', /<\/?[A-Za-z][\w-]*|\/?>|<!DOCTYPE/y],
    ['s', /"[^"\n]*"|'[^'\n]*'/y],
    ['a', /[A-Za-z-]+(?==)/y],
  ],
};

rules.xml = rules.html;

export const languageNames = {js: 'JavaScript', css: 'CSS', html: 'HTML', python: 'Python'};

// Code windows label every block, including languages that carry no colouring such as plain text tables.
const WINDOW_LABELS = {...languageNames, java: 'Java', sql: 'SQL', xml: 'XML', jsp: 'JSP', text: 'TEXT'};
export const windowLabel = (lang) => WINDOW_LABELS[lang] || (lang ? lang.toUpperCase() : 'CODE');

export function codeWindow(lang, source) {
  return '<figure class="snippet window" data-lang="' + escape(lang) + '"><figcaption>' + escape(windowLabel(lang)) + '</figcaption>'
    + '<pre tabindex="0"><code>' + highlight(lang, source) + '</code></pre></figure>';
}

export function highlight(lang, source) {
  const list = rules[lang];
  if (!list) {
    return escape(source);
  }
  const [keywordList, literalList] = {python: [PY_KEYWORDS, PY_LITERALS], java: [JAVA_KEYWORDS, JAVA_LITERALS], sql: [SQL_KEYWORDS, SQL_LITERALS]}[lang] || [JS_KEYWORDS, JS_LITERALS];
  const keywords = new Set(keywordList.split(' '));
  const literals = new Set(literalList.split(' '));
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
      // Java reads true, false and null as keywords, as Eclipse does.
      const word = lang === 'sql' ? text.toUpperCase() : text;
      kind = keywords.has(word) ? 'k' : literals.has(word) ? (lang === 'java' ? 'k' : 'n') : null;
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
