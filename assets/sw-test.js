import {escapeHtml as e} from './render.js';
import {renderNote} from './note-render.js';

// SW역량테스트: a table of contents of solved problems in prediction order. Choosing one opens its idea note and Java code.
const root = document.querySelector('#app');
const params = new URLSearchParams(location.search);
const PAGE = 'sw-test.html';
const href = (id) => PAGE + '?p=' + encodeURIComponent(id);

const tierGroups = (data) => data.tiers
  .map((tier) => ({tier, items: data.problems.filter((p) => p.tier === tier.id)}))
  .filter((group) => group.items.length);

function navHtml(data, current) {
  const groups = tierGroups(data).map(({tier, items}) => {
    const rows = items.map((p) => {
      const active = current && p.id === current.id;
      return '<li><a href="' + href(p.id) + '"' + (active ? ' class="active" aria-current="page"' : '') + '>'
        + '<span class="sw-rank">' + p.rank + '</span>' + e(p.title) + '</a></li>';
    }).join('');
    return '<li><span class="sw-group-label">' + e(tier.label) + '</span><ol>' + rows + '</ol></li>';
  }).join('');
  return '<nav class="note-toc sw-nav" aria-label="문제 목차"><details open><summary>문제 목차</summary>'
    + '<a class="sw-home" href="' + PAGE + '">전체 목차 보기</a><ul class="sw-groups">' + groups + '</ul></details></nav>';
}

function cardHtml(p) {
  return '<li><a class="sw-card" href="' + href(p.id) + '"><span class="sw-rank">' + p.rank + '</span>'
    + '<span class="sw-card-body"><strong>' + e(p.title) + (p.alias ? ' <small>' + e(p.alias) + '</small>' : '') + '</strong>'
    + '<span class="sw-card-type">' + e(p.type) + '</span><span class="sw-card-summary">' + e(p.summary) + '</span></span>'
    + '<span class="sw-go" aria-hidden="true">→</span></a></li>';
}

function landingHtml(data) {
  const tiers = tierGroups(data)
    .map(({tier, items}) => '<section class="sw-tier"><h2>' + e(tier.label) + '</h2><ol class="sw-cards">' + items.map(cardHtml).join('') + '</ol></section>')
    .join('');
  return '<div class="sw-landing"><section class="sw-intro"><span class="eyebrow">A형 대비</span><h1>' + e(data.title) + '</h1>'
    + '<p class="sw-lead">' + e(data.description) + ' 문제를 고르면 발상과 코드 열람.</p>'
    + '<p class="sw-disclaimer" role="note">' + e(data.disclaimer) + '</p></section>' + tiers + '</div>';
}

const safeLinks = (links) => links
  .filter((l) => /^https:\/\//.test(l.url))
  .map((l) => '<a href="' + e(l.url) + '" target="_blank" rel="noopener noreferrer">' + e(l.label) + ' ↗</a>')
  .join('');

// One solution's idea note followed by its Java code.
function solutionHtml(variant) {
  const source = variant.idea.trimEnd() + '\n\n## 코드\n\n```java\n' + variant.code.trimEnd() + '\n```\n';
  return renderNote(source, {java: 'Java'}).html;
}

// Problems with more than one solution get a toggle. The choice is kept in the address as ?v= so a reload shows it again.
function toggleHtml(problem, current) {
  if (problem.variants.length < 2) {
    return '';
  }
  return '<div class="tabs sw-toggle" role="group" aria-label="풀이 선택">' + problem.variants
    .map((v) => '<button type="button" data-variant="' + e(v.id) + '" aria-pressed="' + (v.id === current.id) + '"'
      + (v.id === current.id ? ' class="active"' : '') + '>' + e(v.label) + '</button>')
    .join('') + '</div>';
}

function bindToggle(problem) {
  root.querySelectorAll('[data-variant]').forEach((button) => {
    button.onclick = () => {
      const variant = problem.variants.find((v) => v.id === button.dataset.variant);
      root.querySelector('.sw-solution').innerHTML = solutionHtml(variant);
      root.querySelectorAll('[data-variant]').forEach((b) => {
        const on = b === button;
        b.classList.toggle('active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      history.replaceState(null, '', href(problem.id) + '&v=' + encodeURIComponent(variant.id));
    };
  });
}

function problemView(data, problem) {
  const index = data.problems.indexOf(problem);
  const tier = data.tiers.find((t) => t.id === problem.tier);
  const variant = problem.variants.find((v) => v.id === params.get('v')) || problem.variants[0];
  const html = toggleHtml(problem, variant) + '<div class="sw-solution">' + solutionHtml(variant) + '</div>';
  const link = (p, label, rel) => '<a rel="' + rel + '" href="' + href(p.id) + '">' + label + '</a>';
  const prev = data.problems[index - 1];
  const next = data.problems[index + 1];
  const links = safeLinks(problem.links || []);
  const article = '<article class="note sw-problem"><header class="sw-head">'
    + '<p class="sw-crumb"><a href="' + PAGE + '">← 전체 목차</a></p>'
    + '<h1>' + e(problem.title) + (problem.alias ? '<small>' + e(problem.alias) + '</small>' : '') + '</h1>'
    + '<p class="sw-meta"><span class="sw-chip rank">예측 ' + problem.rank + '순위</span><span class="sw-chip">' + e(tier.label) + '</span><span class="sw-chip">' + e(problem.type) + '</span></p>'
    + '<p class="sw-basis"><strong>예측 근거</strong> ' + e(problem.basis) + '</p>'
    + (links ? '<p class="sw-links">출처' + links + '</p>' : '')
    + '</header>' + html
    + '<nav class="sw-pager" aria-label="이전 문제와 다음 문제">'
    + (prev ? link(prev, '← ' + prev.rank + '. ' + e(prev.title), 'prev') : '<span></span>')
    + (next ? link(next, next.rank + '. ' + e(next.title) + ' →', 'next') : '<span></span>')
    + '</nav></article>';
  return {html: '<div class="note-layout">' + navHtml(data, problem) + article + '</div>', title: problem.title};
}

async function start() {
  const manifestRes = await fetch(new URL('../data/manifest.json', import.meta.url));
  if (!manifestRes.ok) {
    throw Error('목차를 불러오지 못했습니다');
  }
  const manifest = await manifestRes.json();
  if (!manifest.swTest) {
    throw Error('볼 수 있는 문제 정리가 없습니다');
  }
  const res = await fetch(new URL('../data/' + manifest.swTest.file, import.meta.url));
  if (!res.ok) {
    throw Error('문제 정리를 불러오지 못했습니다');
  }
  const data = await res.json();
  const problem = data.problems.find((p) => p.id === params.get('p'));
  if (problem) {
    const view = problemView(data, problem);
    document.title = view.title + ' | ' + data.title + ' | STUDY SPACE';
    root.innerHTML = view.html;
    bindToggle(problem);
    // On a narrow screen the contents list would push the problem off the first screen, so it starts folded.
    if (matchMedia('(max-width: 900px)').matches) {
      root.querySelector('.sw-nav details')?.removeAttribute('open');
    }
  } else {
    document.title = data.title + ' | STUDY SPACE';
    root.innerHTML = landingHtml(data);
  }
  if (location.hash) {
    document.getElementById(location.hash.slice(1))?.scrollIntoView();
  }
}

try {
  await start();
} catch (err) {
  root.innerHTML = '<div class="empty"><h1>SW역량테스트를 열지 못했습니다</h1><p>' + e(err.message) + '</p><a href="../index.html">문제집으로 돌아가기</a></div>';
}
