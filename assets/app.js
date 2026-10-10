import {store} from './storage.js';
import {escapeHtml as e, download, typeNames, gradingNames} from './render.js';
import {summarize} from './grading.js';

const root = document.querySelector('#app');
const PREF_KEY = 'mock-exam:grading-mode';
let manifest;
let kind = 'all';
let track = 'algorithm';
const TRACK_KEY = 'mock-exam:track';

function rememberTrack() {
  history.replaceState(null, '', '?track=' + encodeURIComponent(track));
  try {
    localStorage.setItem(TRACK_KEY, track);
  } catch {
    // The choice still applies to this visit when storage is blocked.
  }
}

function initialTrack() {
  let saved = null;
  try {
    saved = localStorage.getItem(TRACK_KEY);
  } catch {
    saved = null;
  }
  const wanted = new URLSearchParams(location.search).get('track') || saved;
  return manifest.tracks?.[wanted] ? wanted : 'algorithm';
}

function readPreference() {
  try {
    const value = localStorage.getItem(PREF_KEY);
    return value in gradingNames ? value : 'exam';
  } catch {
    return 'exam';
  }
}

function writePreference(value) {
  try {
    localStorage.setItem(PREF_KEY, value);
  } catch {
    // The choice still applies to this start even when storage is blocked.
  }
}

const trackExams = () => manifest.exams.filter((x) => (x.track || 'algorithm') === track);
const trackTopics = () => manifest.tracks?.[track]?.topics || manifest.topics;

const kindNames = {subject: '과목평가', monthly: '월말평가'};
const kindDescriptions = {
  subject: '개념부터 코드 추적까지 차근차근 점검합니다.',
  monthly: '직접 구현하고 풀이 과정을 설명합니다.',
};

// Only the notes of the selected track are offered. A note without a file is a placeholder until its link exists.
function noteButtons() {
  const links = (manifest.notes || [])
    .filter((n) => n.track === track)
    .map((n) => (n.file
      ? '<a class="note-button" href="concepts.html?note=' + e(n.id) + '">' + e(n.title) + ' <span aria-hidden="true">↗</span></a>'
      : '<button class="note-button" type="button" disabled title="준비 중입니다">' + e(n.title) + ' <small>준비 중</small></button>'))
    .join('');
  return links ? '<div class="note-buttons">' + links + '</div>' : '';
}

function heroSection() {
  const mine = manifest.exams.filter((x) => (x.track || 'algorithm') === track);
  const questionCount = mine.reduce((n, x) => n + Object.values(x.counts).reduce((a, b) => a + b, 0), 0);
  return '<section class="hero">'
    + '<div class="eyebrow"><span class="dot"></span> 모의고사 연습실</div>'
    + '<h1>이해한 만큼, 풀어보기</h1>'
    + '<p class="hero-copy">개념을 확인하고 직접 풀어보세요.<br class="desktop-break">틀린 문제는 다시 살펴보며 내 것으로 만듭니다.</p>'
    + '<div class="hero-stats">'
    + '<span><strong>' + questionCount + '</strong>문항</span>'
    + '<span><strong>' + mine.length + '</strong>회차</span>'
    + '<span><strong>' + Object.keys(trackTopics()).length + '</strong>핵심 주제</span>'
    + '</div>'
    + '<div class="hero-art" aria-hidden="true"><div class="art-label">THINK. TRACE. SOLVE.</div>'
    + '<div class="nodes"><span>01</span><i></i><span>02</span><i></i><span>03</span></div>'
    + '<div class="code-note">while (curiosity) {<br><b>　practice();</b><br>}</div></div>'
    + '</section>';
}

function examCard(exam, attempts, preference) {
  const index = Number(exam.id.slice(-2));
  const resume = attempts.find((a) => a.examId === exam.id && !a.submittedAt);
  const types = Object.entries(exam.counts)
    .filter(([, n]) => n > 0)
    .map(([type, n]) => '<span>' + typeNames[type] + ' <b>' + n + '</b></span>')
    .join('');
  const times = [[exam.practiceMinutes, exam.practiceMinutes + '분'], [30, '30분'], [90, '90분'], [0, '시간 제한 없음']]
    .filter(([value], i, list) => list.findIndex(([v]) => v === value) === i)
    .map(([value, label]) => '<option value="' + value + '">' + label + '</option>')
    .join('');
  const modes = Object.entries(gradingNames)
    .map(([value, label]) => '<option value="' + value + '"' + (value === preference ? ' selected' : '') + '>' + label + '</option>')
    .join('');
  return '<article class="exam-card ' + e(exam.kind) + '">'
    + '<div class="card-top"><span class="pill">' + e(kindNames[exam.kind] || exam.kind) + '</span><span class="card-number">' + String(index).padStart(2, '0') + '</span></div>'
    + '<h3>' + e(exam.subtitle) + '</h3>'
    + '<p class="card-description">' + e(kindDescriptions[exam.kind] || '') + '</p>'
    + '<div class="card-types">' + types + '</div>'
    + '<label class="card-setting">채점 방식 <select id="mode-' + e(exam.id) + '">' + modes + '</select></label>'
    + '<label class="card-setting">제한 시간 <select id="time-' + e(exam.id) + '">' + times + '</select></label>'
    + '<div class="card-actions"><button class="primary" data-start="' + e(exam.id) + '" aria-label="' + e(exam.title) + ' 시작">풀기 시작 <span aria-hidden="true">↗</span></button></div>'
    + (resume ? '<a class="resume" href="quiz.html?attempt=' + e(resume.attemptId) + '">이어서 풀기 →</a>' : '')
    + '</article>';
}

function trackSection() {
  const entries = Object.entries(manifest.tracks || {});
  if (entries.length < 2) {
    return '';
  }
  const buttons = entries
    .map(([id, info]) => {
      const mine = manifest.exams.filter((x) => (x.track || 'algorithm') === id);
      const questions = mine.reduce((n, x) => n + Object.values(x.counts).reduce((a, b) => a + b, 0), 0);
      return '<button class="track-button' + (id === track ? ' active' : '') + '" data-track="' + e(id) + '" aria-pressed="' + (id === track) + '">'
        + '<strong>' + e(info.label) + '</strong>'
        + '<span>' + mine.length + '회차 ' + questions + '문항</span></button>';
    })
    .join('');
  return '<section class="track-picker"><span class="eyebrow">무엇을 풀어볼까요</span>'
    + '<div class="track-buttons" role="group" aria-label="과목">' + buttons + '</div>'
    + noteButtons() + '</section>';
}

function librarySection(attempts) {
  const preference = readPreference();
  const kinds = [['all', '전체'], ...Object.entries(kindNames).filter(([id]) => trackExams().some((x) => x.kind === id))];
  const tabs = kinds
    .map(([id, label]) => '<button data-kind="' + id + '" aria-pressed="' + (id === kind) + '" class="' + (id === kind ? 'active' : '') + '">' + label + '</button>')
    .join('');
  const cards = trackExams()
    .filter((x) => kind === 'all' || x.kind === kind)
    .sort((a, b) => (a.kind === b.kind ? a.id.localeCompare(b.id) : a.kind === 'subject' ? -1 : 1))
    .map((exam) => examCard(exam, attempts, preference))
    .join('');
  return '<section class="library">'
    + '<div class="section-heading"><div><span class="eyebrow">내 속도로 준비하기</span><h2>오늘의 문제집</h2></div>'
    + '<div class="tabs" role="group" aria-label="평가 유형">' + tabs + '</div></div>'
    + '<div class="exam-grid">' + cards + '</div>'
    + '</section>';
}

function practiceSection() {
  const first = trackExams().filter((x) => x.kind === 'subject').sort((a, b) => a.id.localeCompare(b.id))[0];
  const counts = manifest.tracks?.[track]?.topicCounts || {};
  const links = Object.entries(trackTopics())
    .map(([id, label]) => '<a href="quiz.html?exam=' + e(first.id) + '&mode=study&topic=' + e(id) + '">' + e(label)
      + (counts[id] ? ' <small>' + counts[id] + '</small>' : '') + '</a>')
    .join('');
  return '<section class="practice-strip">'
    + '<div><span class="eyebrow">필요한 부분부터</span><h2>주제별로 연습하기</h2><p>과목평가 회차에서 같은 주제를 모아 한 문제씩 정답을 확인하며 풀어보세요.</p></div>'
    + '<div class="topic-links">' + links + '</div>'
    + '</section>';
}

function historyItem(a) {
  const title = '<span><b>' + e(a.snapshot.title) + '</b><small>' + new Date(a.startedAt).toLocaleString('ko-KR') + '<span>' + gradingNames[a.mode] + '</span></small></span>';
  if (!a.submittedAt) {
    return '<div class="history-item"><a href="quiz.html?attempt=' + e(a.attemptId) + '">' + title + '<span class="pill neutral">진행 중</span></a></div>';
  }
  const questions = a.snapshot.questions.filter((q) => a.questionOrder.includes(q.id));
  const s = summarize(questions, a);
  const wrong = s.incorrect + s.unanswered;
  return '<div class="history-item"><a href="review.html?attempt=' + e(a.attemptId) + '">' + title
    + '<span class="history-score">정답 <b>' + s.correct + '</b> / ' + s.total + '</span></a>'
    + (wrong ? '<a class="history-wrong" href="review.html?attempt=' + e(a.attemptId) + '&filter=wrong">틀린 문제 ' + wrong + '개 보기</a>' : '')
    + '</div>';
}

function recordsSection(attempts) {
  const list = attempts.length
    ? attempts.slice(0, 12).map(historyItem).join('')
    : '<div class="empty">아직 풀이 기록이 없어요. 첫 문제집을 시작해 보세요.</div>';
  return '<section class="records">'
    + '<div class="section-heading"><h2>나의 학습 기록</h2><div class="backup-actions"><button class="quiet" id="export">내려받기</button>'
    + '<label class="file-button">가져오기<input id="import" type="file" accept=".json,application/json"></label></div></div>'
    + '<p class="muted">풀이 기록은 이 브라우저에 저장됩니다. 다른 기기로 옮길 때는 파일로 내려받아 주세요.</p>'
    + '<p id="notice" role="status">' + (store.readFailure ? '기존 저장 기록을 읽지 못했습니다. 백업 파일이 있다면 가져와 주세요.' : '') + '</p>'
    + '<div class="history">' + list + '</div>'
    + '</section>';
}

async function importBackup(ev, attempts) {
  const file = ev.target.files[0];
  if (!file) {
    return;
  }
  const notice = () => document.querySelector('#notice');
  try {
    if (file.size > 20 * 1024 * 1024) {
      throw Error('백업 파일은 20MB 이하만 지원합니다');
    }
    const data = JSON.parse(await file.text());
    if (!store.validateImport(data).valid) {
      throw Error('이 사이트에서 내려받은 백업 파일인지 확인해 주세요');
    }
    if (!confirm('현재 기록을 보존하며 백업을 합칠까요?')) {
      return;
    }
    const conflict = data.attempts.some((a) => attempts.some((b) => b.attemptId === a.attemptId));
    const replace = conflict && confirm('같은 응시 기록이 있습니다. 확인을 누르면 백업 내용으로 교체하고 취소하면 현재 기록을 유지합니다.');
    const result = store.importProgress(data, replace);
    render();
    notice().textContent = result.saved ? '백업 기록을 가져왔습니다' : result.reason;
  } catch (err) {
    notice().textContent = err.message;
  }
}

function render() {
  const attempts = store.listAttempts();
  root.innerHTML = heroSection() + trackSection() + librarySection(attempts) + practiceSection() + recordsSection(attempts);

  root.querySelectorAll('[data-track]').forEach((b) => {
    b.onclick = () => {
      track = b.dataset.track;
      kind = 'all';
      rememberTrack();
      render();
    };
  });
  root.querySelectorAll('[data-kind]').forEach((b) => {
    b.onclick = () => {
      kind = b.dataset.kind;
      render();
    };
  });
  root.querySelectorAll('[data-start]').forEach((b) => {
    b.onclick = () => {
      const id = b.dataset.start;
      const mode = document.getElementById('mode-' + id).value;
      const minutes = document.getElementById('time-' + id).value;
      writePreference(mode);
      location.href = 'quiz.html?exam=' + encodeURIComponent(id) + '&mode=' + mode + '&minutes=' + minutes + '&new=1';
    };
  });
  document.querySelector('#export').onclick = () => download('mock-exam-backup.json', JSON.stringify(store.exportProgress(), null, 2));
  document.querySelector('#import').onchange = (ev) => importBackup(ev, attempts);
}

try {
  const res = await fetch('data/manifest.json');
  if (!res.ok) {
    throw Error();
  }
  manifest = await res.json();
  track = initialTrack();
  render();
} catch {
  root.innerHTML = '<div class="empty"><h1>문제집을 불러오지 못했습니다</h1><p>연결을 확인하고 다시 시도해 주세요.</p><button onclick="location.reload()">다시 시도</button></div>';
}
