import {store} from './storage.js';
import {createAttempt, remainingSeconds} from './attempt.js';
import {resultFor, summarize, needsReview} from './grading.js';
import {escapeHtml as e, inline, markdown, loadExam, download, typeNames, gradingNames} from './render.js';

const root = document.querySelector('#app');
const params = new URLSearchParams(location.search);
const reviewPage = !!document.body.dataset.review;
const FILTERS = {all: '전체 문제', wrong: '틀린 문제만', pending: '채점 대기', marks: '북마크'};

let attempt;
let exam;
let filter = FILTERS[params.get('filter')] ? params.get('filter') : 'all';
let typeFilter = 'all';
let saveMessage = '';
let versionNotice = false;

document.querySelector('#export').onclick = () => download('mock-exam-backup.json', JSON.stringify(store.exportProgress(), null, 2));

function save() {
  const result = store.saveAttempt(attempt);
  saveMessage = result.saved ? '자동 저장됨' : result.reason;
  const el = document.querySelector('#save-status');
  if (el) {
    el.textContent = saveMessage;
  }
}

const isViewing = () => reviewPage || !!attempt.submittedAt;
const perQuestion = () => attempt.mode === 'study';
const isRevealed = (q) => isViewing() || attempt.revealed.includes(q.id);
const hasAnswer = (q) => String(attempt.answers[q.id] ?? '').trim() !== '';
const attemptQuestions = () => attempt.questionOrder.map((id) => exam.questions.find((q) => q.id === id)).filter(Boolean);

function visibleQuestions() {
  return attemptQuestions().filter((q) => {
    if (typeFilter !== 'all' && q.type !== typeFilter) {
      return false;
    }
    if (filter === 'marks') {
      return store.isMarked(q.id);
    }
    const status = resultFor(q, attempt).status;
    if (filter === 'wrong') {
      return needsReview(status);
    }
    if (filter === 'pending') {
      return status === 'pending-review';
    }
    return true;
  });
}

// Status colours are shown only once a question's answer is allowed to be seen.
function navStatus(q) {
  if (!isRevealed(q)) {
    return hasAnswer(q) ? 'answered' : '';
  }
  const status = resultFor(q, attempt).status;
  if (status === 'correct') {
    return 'is-correct';
  }
  if (status === 'pending-review') {
    return 'is-pending';
  }
  return 'is-wrong';
}

function submit(automatic = false) {
  if (attempt.submittedAt) {
    return;
  }
  if (!automatic) {
    const unanswered = attemptQuestions().filter((q) => !hasAnswer(q)).length;
    const message = (unanswered ? '아직 풀지 않은 문제가 ' + unanswered + '개 있습니다. ' : '') + '제출하고 채점 결과를 확인할까요?';
    if (!confirm(message)) {
      return;
    }
  }
  attempt.submittedAt = Date.now();
  save();
  if (saveMessage !== '자동 저장됨') {
    render();
    return;
  }
  location.href = 'review.html?attempt=' + encodeURIComponent(attempt.attemptId);
}

function countCard(label, value, extra = '') {
  return '<div class="count ' + extra + '"><small>' + label + '</small><strong>' + value + '</strong></div>';
}

function resultSummary() {
  const s = summarize(attemptQuestions(), attempt);
  const wrong = s.incorrect + s.unanswered;
  const filters = Object.entries(FILTERS)
    .map(([id, label]) => {
      const badge = id === 'wrong' ? ' ' + wrong : id === 'pending' ? ' ' + s.pending : '';
      return '<button data-filter="' + id + '" aria-pressed="' + (filter === id) + '" class="' + (filter === id ? 'active' : '') + '">' + label + badge + '</button>';
    })
    .join('');
  return '<section class="result-summary" aria-label="채점 결과">'
    + '<div class="counts">'
    + countCard('정답', s.correct + '<span> / ' + s.total + '</span>', 'good')
    + countCard('오답', s.incorrect, 'bad')
    + countCard('미응답', s.unanswered)
    + countCard('채점 대기', s.pending)
    + '</div>'
    + '<div class="review-filters"><span class="muted">복습 모드</span><div class="tabs" role="group" aria-label="복습 범위">' + filters + '</div></div>'
    + '<p class="muted">틀린 문제만 보기에는 답하지 않은 문제도 포함됩니다. 서술형과 구현형은 직접 채점을 저장하면 결과에 반영됩니다.</p>'
    + '</section>';
}

function progressTally() {
  const checked = attemptQuestions().filter((q) => attempt.revealed.includes(q.id));
  const s = summarize(checked, attempt);
  return '<div class="tally" aria-live="polite">'
    + '<span class="good">정답 <b>' + s.correct + '</b></span>'
    + '<span class="bad">오답 <b>' + (s.incorrect + s.unanswered) + '</b></span>'
    + '<span>확인 전 <b>' + (attempt.questionOrder.length - checked.length) + '</b></span>'
    + '</div>';
}

function sidebar(qs) {
  const viewing = isViewing();
  const answered = attemptQuestions().filter(hasAnswer).length;
  const typeOptions = [['all', '모든 유형'], ...Object.entries(typeNames)]
    .map(([id, name]) => '<option value="' + id + '"' + (typeFilter === id ? ' selected' : '') + '>' + name + '</option>')
    .join('');
  const nav = qs
    .map((item, i) => {
      const current = i === attempt.currentIndex;
      return '<button data-nav="' + i + '" class="' + (current ? 'current ' : '') + navStatus(item) + '" aria-label="' + (i + 1) + '번 문항"'
        + (current ? ' aria-current="step"' : '') + '>' + (i + 1) + '</button>';
    })
    .join('');
  let html = '<aside class="quiz-sidebar">'
    + '<div class="sidebar-heading">문항 목록 <span>' + answered + '/' + attempt.questionOrder.length + '</span></div>';
  if (perQuestion() && !viewing) {
    html += progressTally();
  }
  if (perQuestion() || viewing) {
    html += '<label class="filter-label">문항 유형<select id="type-filter">' + typeOptions + '</select></label>';
  }
  html += '<nav class="question-nav" aria-label="문항 이동">' + nav + '</nav>'
    + '<p class="sidebar-help">' + (viewing ? '초록은 정답, 주황은 오답이나 미응답입니다.' : '번호를 눌러 원하는 문항으로 이동할 수 있어요.') + '</p>';
  if (!viewing) {
    html += '<button class="primary full" id="submit">' + (perQuestion() ? '풀이 마치고 결과 보기' : '제출하고 채점하기') + '</button>';
  } else {
    html += '<a class="quiet full retry" href="quiz.html?exam=' + e(attempt.examId) + '&mode=' + e(attempt.mode) + '&shuffle=1&new=1">선지를 섞어 다시 풀기</a>';
  }
  return html + '</aside>';
}

function renderExamples(examples, title) {
  if (!examples?.length) {
    return '';
  }
  const rows = examples
    .map((item) => '<div class="example-grid"><div><small>입력</small><pre>' + e(item.input) + '</pre></div><div><small>출력</small><pre>' + e(item.output) + '</pre></div></div>')
    .join('');
  return '<details class="examples"' + (title === '입출력 예시' ? ' open' : '') + '><summary>' + title + '</summary>' + rows + '</details>';
}

function choiceOrder(q) {
  return attempt.choiceOrders[q.id] || q.choices.map((c) => c.id);
}

function renderAnswer(q) {
  const locked = isViewing() || (perQuestion() && attempt.revealed.includes(q.id));
  if (q.type === 'mc') {
    const revealed = isRevealed(q);
    const choices = choiceOrder(q)
      .map((id, i) => {
        const choice = q.choices.find((c) => c.id === id);
        const classes = ['choice'];
        if (revealed && id === q.correctChoiceId) {
          classes.push('correct-choice');
        } else if (revealed && attempt.answers[q.id] === id) {
          classes.push('wrong-choice');
        }
        return '<label class="' + classes.join(' ') + '"><input name="choice" type="radio" value="' + e(id) + '"'
          + (attempt.answers[q.id] === id ? ' checked' : '') + (locked ? ' disabled' : '') + '>'
          + '<span class="choice-num">' + (i + 1) + '</span><span>' + inline(choice.text) + '</span></label>';
      })
      .join('');
    return '<fieldset class="choices"><legend class="sr-only">정답 선택</legend>' + choices + '</fieldset>';
  }
  const label = q.type === 'code' ? 'Java 답안' : q.type === 'essay' ? '나의 설명' : '나의 답';
  let html = '<label class="answer-label" for="answer">' + label + '</label>';
  if (q.type === 'short') {
    html += '<input id="answer" autocomplete="off" value="' + e(attempt.answers[q.id] || '') + '"' + (locked ? ' readonly' : '') + '>';
  } else {
    html += '<textarea id="answer" class="' + (q.type === 'code' ? 'code-editor' : '') + '" rows="' + (q.type === 'code' ? 12 : 6) + '" spellcheck="false"'
      + (locked ? ' readonly' : '') + '>' + e(attempt.answers[q.id] || '') + '</textarea>';
  }
  if (q.type === 'code') {
    html += '<div class="editor-footer"><span>코드를 작성한 뒤 풀이와 비교해 보세요</span><button class="quiet" id="code-download">Java 파일 저장</button></div>';
  }
  return html;
}

// Concept titles name the topic and would hint at the answer, so they appear only with the explanation.
// Implementation problems keep their title because it names the task rather than the technique.
const showsTitleWhileSolving = (q) => q.type === 'code';

function feedbackHeading(q, result) {
  if (result.gradingMethod !== 'auto' && q.type !== 'short') {
    return '<div class="explanation-heading">모범답안과 비교해 직접 채점해 보세요</div>';
  }
  if (result.status === 'correct') {
    return '<div class="explanation-heading good">정답입니다</div>';
  }
  if (result.status === 'unanswered') {
    return '<div class="explanation-heading bad">답을 입력하지 않았습니다</div>';
  }
  return '<div class="explanation-heading bad">오답입니다</div>';
}

function explanation(q) {
  const result = resultFor(q, attempt);
  let html = '<section class="explanation">' + feedbackHeading(q, result);
  if (!showsTitleWhileSolving(q)) {
    html += '<p class="topic-line"><span>주제</span>' + e(q.title) + '</p>';
  }
  if (q.type === 'mc') {
    const order = choiceOrder(q);
    const mine = order.indexOf(attempt.answers[q.id]);
    html += '<p class="answer-line">정답 <b>' + (order.indexOf(q.correctChoiceId) + 1) + '번</b>'
      + (mine >= 0 ? '<span>내 답 <b>' + (mine + 1) + '번</b></span>' : '') + '</p>';
  }
  if (q.type === 'short') {
    html += '<p class="answer-line">모범답안 <b>' + e(q.acceptedAnswers[0]) + '</b>'
      + (hasAnswer(q) ? '<span>내 답 <b>' + e(attempt.answers[q.id]) + '</b></span>' : '') + '</p>';
  }
  html += '<div class="prose">' + markdown(q.solution) + '</div>';
  if (q.type === 'mc') {
    html += '<div class="choice-reasons">' + choiceOrder(q)
      .map((id, i) => '<div><b>' + (i + 1) + (id === q.correctChoiceId ? ' 정답' : '') + '</b><p>' + inline(q.choiceExplanations[id]) + '</p></div>')
      .join('') + '</div>';
  }
  if (q.type === 'short' && result.status !== 'correct' && hasAnswer(q)) {
    html += '<button id="override" class="quiet">표기만 다른 정답이면 직접 정답 처리</button>';
  }
  if (q.type === 'code' || q.type === 'essay') {
    const selected = attempt.selfGrades[q.id];
    html += '<details class="model"><summary>모범답안 보기</summary><div class="prose">' + markdown(q.modelAnswer) + '</div></details>'
      + (q.complexity ? '<p class="complexity">' + inline(q.complexity) + '</p>' : '')
      + renderExamples(q.reviewCases, '확인할 경계 사례')
      + '<fieldset class="rubric"><legend>직접 채점하기</legend><p class="muted">답안에 포함한 항목을 체크하세요. 일부만 충족해도 기록할 수 있습니다.</p>'
      + q.rubric.map((r) => '<label><input type="checkbox" value="' + e(r.id) + '"' + (selected?.includes(r.id) ? ' checked' : '') + '>' + inline(r.criterion) + '</label>').join('')
      + '<button id="save-grade" class="quiet">자기채점 저장</button><span id="grade-status" role="status">' + (selected ? '채점 기록이 있습니다' : '아직 채점하지 않았습니다') + '</span></fieldset>';
  }
  return html + '</section>';
}

function checkButton(q) {
  if (isViewing() || !perQuestion() || attempt.revealed.includes(q.id)) {
    return '';
  }
  const auto = q.type === 'mc' || q.type === 'short';
  return '<button id="reveal" class="primary reveal"' + (auto && !hasAnswer(q) ? ' disabled' : '') + '>' + (auto ? '정답 확인' : '해설 보기') + '</button>'
    + (auto ? '<p class="muted reveal-help">정답을 확인하면 이 문제의 답은 더 이상 바꿀 수 없습니다.</p>' : '');
}

function questionPanel(q, qs) {
  if (!q) {
    const message = filter === 'wrong' ? '틀린 문제가 없습니다. 모두 맞혔어요.' : '이 조건에 해당하는 문제가 없습니다.';
    return '<section class="question-panel"><div class="empty">' + message + '</div></section>';
  }
  const last = attempt.currentIndex === qs.length - 1;
  const nextLabel = !last ? '다음 →' : isViewing() ? '처음으로' : perQuestion() ? '결과 보기' : '제출하고 채점하기';
  return '<section class="question-panel">'
    + '<div class="question-heading"><span class="question-index">QUESTION ' + String(attempt.currentIndex + 1).padStart(2, '0') + '</span>'
    + '<div><span class="pill neutral">' + typeNames[q.type] + '</span><button class="bookmark" id="mark" aria-pressed="' + store.isMarked(q.id) + '" aria-label="북마크">'
    + (store.isMarked(q.id) ? '★' : '☆') + '</button></div></div>'
    + (showsTitleWhileSolving(q) ? '<h2 id="question-title">' + e(q.title) + '</h2>' : '<h2 id="question-title" class="sr-only">' + (attempt.currentIndex + 1) + '번 문제</h2>')
    + '<div class="prose">' + markdown(q.stem) + '</div>'
    + renderExamples(q.examples, '입출력 예시')
    + renderAnswer(q)
    + checkButton(q)
    + (isRevealed(q) ? explanation(q) : '')
    + '<div class="question-actions"><button class="quiet" id="prev"' + (attempt.currentIndex === 0 ? ' disabled' : '') + '>← 이전</button>'
    + '<span>' + (attempt.currentIndex + 1) + ' / ' + qs.length + '</span><button class="primary" id="next">' + nextLabel + '</button></div>'
    + '</section>';
}

function render() {
  const viewing = isViewing();
  const qs = visibleQuestions();
  attempt.currentIndex = Math.min(attempt.currentIndex || 0, Math.max(0, qs.length - 1));
  const q = qs[attempt.currentIndex];
  const badge = viewing ? '결과와 복습' : gradingNames[attempt.mode];

  root.innerHTML = '<div class="quiz-top"><a class="back" href="index.html">← 문제집으로</a><span class="pill">' + badge + '</span><span id="timer" class="timer"></span></div>'
    + '<div class="quiz-title"><div><span class="eyebrow">' + e(exam.subtitle || '주제별 연습') + '</span><h1>' + e(exam.title) + '</h1></div>'
    + '<p id="save-status" class="muted" role="status">' + e(saveMessage || '답안은 자동으로 저장됩니다') + '</p></div>'
    + (versionNotice ? '<p class="notice">개정 전 응시 기록입니다. 당시 문제와 답안으로 복습합니다.</p>' : '')
    + (viewing ? resultSummary() : '')
    + '<div class="quiz-layout">' + sidebar(qs) + questionPanel(q, qs) + '</div>';

  bindEvents(q, qs);
  tick();
}

function go(index) {
  attempt.currentIndex = index;
  save();
  render();
  document.querySelector('#question-title')?.scrollIntoView({block: 'start'});
}

function bindEvents(q, qs) {
  root.querySelectorAll('[data-nav]').forEach((b) => {
    b.onclick = () => go(Number(b.dataset.nav));
  });
  root.querySelectorAll('[data-filter]').forEach((b) => {
    b.onclick = () => {
      filter = b.dataset.filter;
      attempt.currentIndex = 0;
      const url = new URL(location.href);
      url.searchParams.set('filter', filter);
      history.replaceState(null, '', url);
      render();
    };
  });
  const type = document.querySelector('#type-filter');
  if (type) {
    type.onchange = () => {
      typeFilter = type.value;
      attempt.currentIndex = 0;
      render();
    };
  }
  document.querySelector('#submit')?.addEventListener('click', () => submit());
  if (!q) {
    return;
  }
  document.querySelector('#mark').onclick = () => {
    const r = store.toggleMark(q.id);
    if (!r.saved) {
      saveMessage = r.reason;
    }
    render();
  };
  root.querySelectorAll('input[name=choice]').forEach((input) => {
    input.onchange = () => {
      attempt.answers[q.id] = input.value;
      save();
      render();
      document.querySelector('input[value="' + input.value + '"]')?.focus();
    };
  });
  const field = document.querySelector('#answer');
  if (field) {
    field.oninput = () => {
      attempt.answers[q.id] = field.value;
      save();
      const reveal = document.querySelector('#reveal');
      if (reveal && q.type === 'short') {
        reveal.disabled = !hasAnswer(q);
      }
    };
  }
  document.querySelector('#code-download')?.addEventListener('click', () => download('Main.java', attempt.answers[q.id] || '', 'text/plain'));
  document.querySelector('#reveal')?.addEventListener('click', () => {
    attempt.revealed = [...new Set([...attempt.revealed, q.id])];
    save();
    render();
  });
  document.querySelector('#override')?.addEventListener('click', () => {
    if (confirm('핵심 의미가 모범답안과 같아 정답으로 기록할까요?')) {
      attempt.overrides[q.id] = true;
      save();
      render();
    }
  });
  document.querySelector('#save-grade')?.addEventListener('click', () => {
    attempt.selfGrades[q.id] = [...root.querySelectorAll('.rubric input:checked')].map((x) => x.value);
    save();
    render();
  });
  document.querySelector('#prev').onclick = () => go(attempt.currentIndex - 1);
  document.querySelector('#next').onclick = () => {
    if (attempt.currentIndex < qs.length - 1) {
      go(attempt.currentIndex + 1);
    } else if (isViewing()) {
      go(0);
    } else {
      submit();
    }
  };
}

function tick() {
  const timer = document.querySelector('#timer');
  if (!timer || !attempt) {
    return;
  }
  const remaining = remainingSeconds(attempt);
  if (attempt.submittedAt) {
    timer.textContent = '제출 완료';
  } else if (remaining === null) {
    timer.textContent = '시간 제한 없음';
  } else {
    timer.textContent = Math.floor(remaining / 60) + ':' + String(remaining % 60).padStart(2, '0');
  }
  if (remaining === 0 && !attempt.submittedAt) {
    submit(true);
  }
}

async function topicExam(base, topic) {
  const all = await Promise.all([1, 2, 3].map((i) => loadExam('subject-0' + i)));
  const questions = all.flatMap((x) => x.questions).filter((q) => q.topics.includes(topic));
  if (!questions.length) {
    throw Error('해당 주제의 문제가 없습니다');
  }
  return {
    ...base,
    title: '주제별 연습',
    questions,
    defaultChoiceOrders: Object.assign({}, ...all.map((x) => x.defaultChoiceOrders)),
    contentVersion: all.map((x) => x.contentVersion).join('-'),
  };
}

async function start() {
  const id = params.get('attempt');
  if (id) {
    const saved = store.loadAttempt(id);
    if (!saved.attempt) {
      throw Error('저장된 응시 기록이 없습니다');
    }
    attempt = saved.attempt;
    exam = attempt.snapshot;
    try {
      versionNotice = (await loadExam(attempt.examId)).contentVersion !== attempt.contentVersion;
    } catch {
      // Topic practice has no single published exam to compare with.
    }
  } else {
    exam = await loadExam(params.get('exam'));
    const mode = params.get('mode') === 'study' ? 'study' : 'exam';
    const topic = params.get('topic');
    if (topic) {
      exam = await topicExam(exam, topic);
    }
    const existing = !params.has('new') && !topic && store.listAttempts()
      .find((a) => a.examId === exam.id && a.mode === mode && !a.submittedAt && a.contentVersion === exam.contentVersion && !a.topic);
    let minutes = Number(params.get('minutes') ?? (mode === 'study' ? 0 : exam.practiceMinutes));
    if (!Number.isFinite(minutes) || minutes < 0 || minutes > 600) {
      minutes = exam.practiceMinutes;
    }
    attempt = existing || createAttempt(exam, {mode, durationMinutes: minutes, shuffle: params.has('shuffle')});
    attempt.topic = topic || null;
    save();
    history.replaceState(null, '', 'quiz.html?attempt=' + encodeURIComponent(attempt.attemptId));
  }
  attempt.selfGrades ??= {};
  attempt.overrides ??= {};
  attempt.revealed ??= [];
  render();
  setInterval(tick, 1000);
}

try {
  await start();
} catch (err) {
  root.innerHTML = '<div class="empty"><h1>문제를 열지 못했습니다</h1><p>' + e(err.message) + '</p><a href="index.html">문제집으로 돌아가기</a></div>';
}
