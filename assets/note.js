import {escapeHtml as e} from './render.js';
import {renderNote} from './note-render.js';

const root = document.querySelector('#app');
const params = new URLSearchParams(location.search);

function tocHtml(toc) {
  const items = toc
    .map((item) => '<li class="level-' + item.level + '"><a href="#' + item.id + '">' + e(item.text) + '</a></li>')
    .join('');
  return '<nav class="note-toc" aria-label="목차"><details open><summary>목차</summary><ul>' + items + '</ul></details></nav>';
}

async function start() {
  const manifest = await (await fetch('data/manifest.json')).json();
  const notes = manifest.notes || [];
  const note = notes.find((n) => n.id === params.get('note')) || notes[0];
  if (!note) {
    throw Error('볼 수 있는 개념 노트가 없습니다');
  }
  const res = await fetch('data/' + note.file);
  if (!res.ok) {
    throw Error('개념 노트를 불러오지 못했습니다');
  }
  const {title, toc, html} = renderNote(await res.text());
  document.title = (note.title || title) + ' | 모의고사';
  root.innerHTML = '<div class="note-layout">' + tocHtml(toc) + '<article class="note">' + html + '</article></div>';
  if (location.hash) {
    document.getElementById(location.hash.slice(1))?.scrollIntoView();
  }
}

try {
  await start();
} catch (err) {
  root.innerHTML = '<div class="empty"><h1>개념 노트를 열지 못했습니다</h1><p>' + e(err.message) + '</p><a href="index.html">문제집으로 돌아가기</a></div>';
}
