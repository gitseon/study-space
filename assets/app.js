import {store} from './storage.js';
import {escapeHtml as e, download, typeNames, gradingNames} from './render.js';
import {summarize} from './grading.js';
import {effectiveMinutes} from './practice-time.js';
import {studyLinksFor} from './study-links.js';
import {renderNote} from './note-render.js';
import {splitFlow} from './project-flow.js';
import {featureForTab, mountStructure} from './project-structure.js';
import {EDITOR_NOTICE, ENV_NOTICE} from './project-notices.js';
import {projectStore} from './project-store.js';

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

const kindNames = {subject: '과목평가', monthly: '월말평가', written: '필기 검정', practical: '실기 검정'};
// Exams whose multiple choice questions feed the topic practice sets, and the order of the kind tabs.
const CHOICE_KINDS = ['subject', 'written'];
const KIND_ORDER = ['subject', 'written', 'monthly', 'practical'];
const kindDescriptions = {
  subject: '개념부터 코드 추적까지 차근차근 점검.',
  monthly: '직접 구현하고 풀이 과정을 설명.',
  written: '강의 개념을 연결해 객관식으로 점검.',
  practical: '코드를 직접 작성하고 기준에 맞춰 자기채점.',
};

// Only the notes of the selected track are offered. A note without a file is a placeholder until its link exists.
function noteButtons() {
  const links = (manifest.notes || [])
    .filter((n) => n.track === track)
    .map((n) => (n.file
      ? '<a class="note-button" href="pages/concepts.html?note=' + e(n.id) + '">' + e(n.title) + ' <span aria-hidden="true">↗</span></a>'
      : '<button class="note-button" type="button" disabled title="준비 중입니다">' + e(n.title) + ' <small>준비 중</small></button>'))
    .join('');
  return links ? '<div class="note-buttons">' + links + '</div>' : '';
}

function heroSection() {
  const mine = manifest.exams.filter((x) => (x.track || 'algorithm') === track);
  const questionCount = mine.reduce((n, x) => n + Object.values(x.counts).reduce((a, b) => a + b, 0), 0);
  return '<section class="hero">'
    + '<div class="eyebrow"><span class="dot"></span> 학습 내용 복습실</div>'
    + '<h1>이해한 만큼, 복습하기</h1>'
    + '<p class="hero-copy">학습 내용을 점검하고 복습하세요.<br class="desktop-break">틀린 문제와 헷갈리는 개념은 해설과 함께 다시 살펴보며 내 것으로 만드세요.</p>'
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
  // Shortest limit first and "no limit" (0) last. The exam's own length stays the preselected choice.
  // An exam may list its own choices in timeOptions (minutes, 0 for no limit); the other exams keep the common list.
  const choices = exam.timeOptions || [exam.practiceMinutes, 30, 90, 0];
  const times = [...new Set(choices)].map((value) => [value, value ? value + '분' : '시간 제한 없음'])
    .filter(([value], i, list) => list.findIndex(([v]) => v === value) === i)
    .sort(([a], [b]) => (a || Infinity) - (b || Infinity))
    .map(([value, label]) => '<option value="' + value + '"' + (value === exam.practiceMinutes ? ' selected' : '') + '>' + label + '</option>')
    .join('');
  const modes = Object.entries(gradingNames)
    .map(([value, label]) => '<option value="' + value + '"' + (value === preference ? ' selected' : '') + '>' + label + '</option>')
    .join('');
  return '<article class="exam-card ' + e(exam.kind) + '">'
    + '<div class="card-top"><span class="pill">' + e(kindNames[exam.kind] || exam.kind) + '</span>' + (exam.draft ? '<span class="pill draft">초안</span>' : '') + '<span class="card-number">' + String(index).padStart(2, '0') + '</span></div>'
    + '<h3>' + e(exam.subtitle) + '</h3>'
    + '<p class="card-description">' + e(kindDescriptions[exam.kind] || '') + '</p>'
    + (exam.examNotes?.length ? '<ul class="exam-notes">' + exam.examNotes.map((n) => '<li>' + e(n) + '</li>').join('') + '</ul>' : '')
    + (exam.draft ? '<p class="draft-note">정답을 해당 DBMS에서 아직 검증하지 못한 초안입니다. 정답과 해설이 틀릴 수 있습니다.</p>' : '')
    + '<div class="card-types">' + types + '</div>'
    + '<label class="card-setting">채점 방식 <select id="mode-' + e(exam.id) + '">' + modes + '</select></label>'
    + '<label class="card-setting">제한 시간 <select id="time-' + e(exam.id) + '">' + times + '</select></label>'
    + '<div class="card-actions"><button class="primary" data-start="' + e(exam.id) + '" aria-label="' + e(exam.title) + ' 시작">풀기 시작 <span aria-hidden="true">↗</span></button></div>'
    + (resume ? '<a class="resume" href="pages/quiz.html?attempt=' + e(resume.attemptId) + '">이어서 풀기 →</a>' : '')
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
  // SW역량테스트 is a page of notes rather than an exam track, so it opens as a link beside the track buttons.
  const sw = manifest.swTest;
  const swLink = sw
    ? '<a class="track-button sw-link" href="pages/sw-test.html"><strong>' + e(sw.title) + '</strong>'
      + '<span>예측 순서대로 ' + sw.count + '문제의 발상과 코드 ↗</span></a>'
    : '';
  // A note whose track has no exams yet opens the same way, until its mock exams give it a track button.
  const noteLinks = (manifest.notes || [])
    .filter((n) => n.file && !manifest.tracks?.[n.track])
    .map((n) => '<a class="track-button sw-link" href="pages/concepts.html?note=' + e(n.id) + '"><strong>' + e(n.title) + '</strong>'
      + '<span>개념 요약 노트 ↗</span></a>')
    .join('');
  return '<section class="track-picker"><span class="eyebrow">주제</span>'
    + '<div class="track-buttons" role="group" aria-label="과목">' + buttons + swLink + noteLinks + '</div>'
    + noteButtons() + '</section>';
}

function librarySection(attempts) {
  const preference = readPreference();
  const kinds = [['all', '전체'], ...Object.entries(kindNames).filter(([id]) => trackExams().some((x) => x.kind === id))];
  const projectMode = projectTabAvailable() && kind === 'project';
  if (projectTabAvailable()) {
    kinds.push([PROJECT_KIND, '월말평가']);
  }
  const tabs = kinds
    .map(([id, label]) => '<button data-kind="' + id + '" aria-pressed="' + (id === kind) + '" class="' + (id === kind ? 'active' : '') + '">' + label + '</button>')
    .join('');
  const cards = trackExams()
    .filter((x) => kind === 'all' || x.kind === kind)
    .sort((a, b) => (a.kind === b.kind ? a.id.localeCompare(b.id) : KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind)))
    .map((exam) => examCard(exam, attempts, preference))
    .join('');
  return '<section class="library">'
    + '<div class="section-heading"><div><span class="eyebrow">내 속도로 준비하기</span><h2>오늘의 문제집</h2></div>'
    + '<div class="tabs" role="group" aria-label="평가 유형">' + tabs + '</div></div>'
    + (projectMode
      ? '<div class="project-env" id="project-env"><p>' + e(ENV_NOTICE) + '</p><p>' + e(EDITOR_NOTICE) + '</p></div><div id="project-area"><p class="loading">월말평가 프로젝트를 불러오고 있습니다</p></div>'
      : '<div class="exam-grid">' + cards + '</div>')
    + '</section>';
}

// 백엔드 · DB의 월말평가는 문항이 아니라 직접 구현하는 Web 프로젝트라서 탭 하나로 따로 둡니다.
const PROJECT_KIND = 'project';
const projectTabAvailable = () => track === 'backend' && !!manifest.webProjects;
let projectIndexPromise = null;

async function fetchData(path) {
  const res = await fetch(new URL('../data/' + path, import.meta.url));
  if (!res.ok) {
    throw Error(path);
  }
  return res.json();
}

function projectCard(project, number) {
  const stages = project.stages.map((s) => '<option value="' + s.id + '">' + s.id + '단계 ' + e(s.label) + '</option>').join('');
  const times = project.durationOptions
    .map((m) => '<option value="' + m + '"' + (m === project.defaultMinutes ? ' selected' : '') + '>' + (m ? m + '분' : '시간 제한 없음') + '</option>').join('');
  return '<article class="exam-card project-card" data-project="' + e(project.id) + '">'
    + '<div class="card-top"><span class="pill">월말평가 프로젝트</span><span class="card-number">' + String(number).padStart(2, '0') + '</span></div>'
    + '<h3>' + e(project.title) + '</h3>'
    + '<p class="card-description">제공된 MVC 템플릿의 비어 있는 부분을 직접 채워 목록, 등록, 상세와 로그인, 로그아웃을 연결합니다. 사이트가 코드를 실행하거나 점수를 매기지는 않습니다.</p>'
    + '<div class="card-types"><span>작성 대상 <b>' + project.targetCount + '</b></span><span>단계 <b>' + project.stages.length + '</b></span></div>'
    + '<label class="card-setting">단계 <select id="pstage-' + e(project.id) + '">' + stages + '</select></label>'
    + '<label class="card-setting">제한 시간 <select id="ptime-' + e(project.id) + '">' + times + '</select></label>'
    + '<div class="card-actions"><button class="primary" data-project-start="' + e(project.id) + '" aria-label="' + e(project.title) + ' 구현 시작">구현 시작 <span aria-hidden="true">↗</span></button></div>'
    + '<div class="resume-list" id="presume-' + e(project.id) + '"></div>'
    + '</article>';
}

function flowSummary(tabs) {
  const buttons = tabs.map((t, i) => '<button type="button" role="tab" data-flow="' + i + '" aria-selected="' + (i === 0) + '" class="' + (i === 0 ? 'active' : '') + '">' + e(t.label) + '</button>').join('');
  return '<section class="project-flow" aria-label="월말평가 구현 흐름"><h3>월말평가 구현 흐름</h3>'
    + '<div class="tabs" role="tablist" aria-label="흐름 보기">' + buttons + '</div>'
    + '<div class="project-flow-body" id="project-flow-body">' + renderNote(tabs[0].md).html + '</div>'
    + '<h4 class="project-structure-title">프로젝트 구조</h4><p class="project-structure-help">상자나 화살표를 누르면 역할과 뼈대 코드가 나옵니다.</p><div id="project-structure"></div></section>';
}

async function fillProjectArea() {
  const area = document.querySelector('#project-area');
  if (!area) {
    return;
  }
  try {
    projectIndexPromise ||= fetchData(manifest.webProjects.file);
    const index = await projectIndexPromise;
    // 구현 흐름의 도식은 구현해야 하는 파일의 모범답안도 보여 준다. 모범답안을 받지 못해도 도식은 그대로 쓴다.
    const first = index.projects[0];
    const [detail, answerFile] = await Promise.all([
      fetchData(first.project),
      first.referenceFile ? fetchData(first.referenceFile).catch(() => null) : null,
    ]);
    const reference = answerFile?.files ? Object.fromEntries(answerFile.files.map((f) => [f.path, {language: f.language, text: f.text}])) : null;
    if (!area.isConnected) {
      return;
    }
    const tabs = splitFlow(detail.flow);
    area.innerHTML = flowSummary(tabs) + '<div class="exam-grid">' + index.projects.map((p, i) => projectCard(p, i + 1)).join('') + '</div>';
    const diagram = detail.structure
      ? mountStructure(area.querySelector('#project-structure'), detail.structure, {showFlows: false, reference, targetTitles: Object.fromEntries(detail.targets.map((x) => [x.id, x.title]))})
      : null;
    area.querySelectorAll('[data-flow]').forEach((b) => {
      b.onclick = () => {
        const tab = tabs[Number(b.dataset.flow)];
        const feature = diagram && featureForTab(detail.structure, tab.label);
        if (feature) {
          diagram.setFlow(feature);
        }
        area.querySelectorAll('[data-flow]').forEach((x) => {
          x.classList.toggle('active', x === b);
          x.setAttribute('aria-selected', String(x === b));
        });
        area.querySelector('#project-flow-body').innerHTML = renderNote(tab.md).html;
      };
    });
    area.querySelectorAll('[data-project-start]').forEach((b) => {
      b.onclick = () => {
        const id = b.dataset.projectStart;
        location.href = 'pages/project.html?project=' + encodeURIComponent(id)
          + '&stage=' + document.getElementById('pstage-' + id).value + '&minutes=' + document.getElementById('ptime-' + id).value;
      };
    });
    try {
      const names = {'in-progress': '진행 중', 'time-ended': '시간 종료', review: '작성 마침'};
      for (const a of await projectStore.list()) {
        const box = document.getElementById('presume-' + a.projectId);
        if (box) {
          box.insertAdjacentHTML('beforeend', '<a href="pages/project.html?attempt=' + encodeURIComponent(a.attemptId) + '">' + a.stageId + '단계 ' + names[a.status] + ' · 이어서 보기 →</a>');
        }
      }
    } catch {
      // 저장소를 열 수 없으면 이어서 하기 목록만 비웁니다.
    }
  } catch {
    if (area.isConnected) {
      area.innerHTML = '<div class="empty">월말평가 프로젝트를 불러오지 못했습니다. 연결을 확인하고 다시 시도해 주세요.</div>';
    }
  }
}

function practiceSection() {
  const first = trackExams().filter((x) => CHOICE_KINDS.includes(x.kind)).sort((a, b) => a.id.localeCompare(b.id))[0];
  const counts = manifest.tracks?.[track]?.topicCounts || {};
  const links = Object.entries(trackTopics())
    .map(([id, label]) => '<a href="pages/quiz.html?exam=' + e(first.id) + '&mode=study&topic=' + e(id) + '">' + e(label)
      + (counts[id] ? ' <small>' + counts[id] + '</small>' : '') + '</a>')
    .join('');
  // Topics that have concept-note sections get a second row, so reading can come before the questions.
  const study = Object.entries(trackTopics())
    .map(([id, label]) => [label, studyLinksFor(manifest, track, id)])
    .filter(([, list]) => list.length)
    .map(([label, list]) => '<li><span>' + e(label) + '</span>'
      + list.map((l) => '<a href="' + e(l.href) + '" title="' + e(l.label) + '">' + e(l.short) + ' <small aria-hidden="true">↗</small></a>').join('') + '</li>')
    .join('');
  return '<section class="practice-strip">'
    + '<div><span class="eyebrow">필요한 부분부터</span><h2>주제별로 복습하기</h2><p>객관식 회차에서 같은 주제를 모아 한 문제씩 정답을 확인하며 복습.</p></div>'
    + '<div class="topic-links">' + links + '</div>'
    + (study ? '<details class="topic-study"><summary>주제별 개념 노트 읽기</summary><ul>' + study + '</ul></details>' : '')
    + '</section>';
}

function historyItem(a) {
  const title = '<span><b>' + e(a.snapshot.title) + '</b><small>' + new Date(a.startedAt).toLocaleString('ko-KR') + '<span>' + gradingNames[a.mode] + '</span></small></span>';
  if (!a.submittedAt) {
    return '<div class="history-item"><a href="pages/quiz.html?attempt=' + e(a.attemptId) + '">' + title + '<span class="pill neutral">진행 중</span></a></div>';
  }
  const questions = a.snapshot.questions.filter((q) => a.questionOrder.includes(q.id));
  const s = summarize(questions, a);
  const wrong = s.incorrect + s.unanswered;
  return '<div class="history-item"><a href="pages/review.html?attempt=' + e(a.attemptId) + '">' + title
    + '<span class="history-score">정답 <b>' + s.correct + '</b> / ' + s.total + '</span></a>'
    + (wrong ? '<a class="history-wrong" href="pages/review.html?attempt=' + e(a.attemptId) + '&filter=wrong">틀린 문제 ' + wrong + '개 보기</a>' : '')
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
      const minutes = effectiveMinutes(manifest.exams.find((x) => x.id === id), mode, document.getElementById('time-' + id).value);
      writePreference(mode);
      location.href = 'pages/quiz.html?exam=' + encodeURIComponent(id) + '&mode=' + mode + '&minutes=' + minutes + '&new=1';
    };
  });
  // A fixed-length exam shows its real limit and locks the time choice while the grading mode is exam.
  manifest.exams.filter((x) => x.fixedPracticeMinutes).forEach((x) => {
    const mode = document.getElementById('mode-' + x.id);
    const time = document.getElementById('time-' + x.id);
    if (!mode || !time) {
      return;
    }
    const sync = () => {
      const fixed = mode.value === 'exam';
      time.disabled = fixed;
      if (fixed) {
        time.value = String(x.practiceMinutes);
      }
    };
    mode.addEventListener('change', sync);
    sync();
  });
  if (kind === PROJECT_KIND) {
    fillProjectArea();
  }
  document.querySelector('#export').onclick = () => download('mock-exam-backup.json', JSON.stringify(store.exportProgress(), null, 2));
  document.querySelector('#import').onchange = (ev) => importBackup(ev, attempts);
}

try {
  const res = await fetch(new URL('../data/manifest.json', import.meta.url));
  if (!res.ok) {
    throw Error();
  }
  manifest = await res.json();
  track = initialTrack();
  render();
} catch {
  root.innerHTML = '<div class="empty"><h1>문제집을 불러오지 못했습니다</h1><p>연결을 확인하고 다시 시도해 주세요.</p><button onclick="location.reload()">다시 시도</button></div>';
}
