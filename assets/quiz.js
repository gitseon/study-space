import {store} from './storage.js';
import {createAttempt,remainingSeconds} from './attempt.js';
import {resultFor} from './grading.js';
import {escapeHtml as e,markdown,loadExam,download,typeNames} from './render.js';
const root=document.querySelector('#app'),params=new URLSearchParams(location.search),review=!!document.body.dataset.review;
let attempt,exam,filter='all',typeFilter='all',saveMessage='',versionNotice=false;
const exportAll=()=>download('algonote-backup.json',JSON.stringify(store.exportProgress(),null,2));
document.querySelector('#export').onclick=exportAll;
function save(){const result=store.saveAttempt(attempt);saveMessage=result.saved?'자동 저장됨':result.reason;const el=document.querySelector('#save-status');if(el)el.textContent=saveMessage;}
function eligible(){
  return attempt.questionOrder.map(id=>exam.questions.find(q=>q.id===id)).filter(Boolean).filter(q=>{
    if(typeFilter!=='all'&&q.type!==typeFilter)return false;
    if(filter==='marks')return store.isMarked(q.id);
    const r=resultFor(q,attempt);
    return filter==='wrong'?['incorrect','partial','unanswered'].includes(r.status):filter==='pending'?r.status==='pending-review':true;
  });
}
function submit(automatic=false){
  if(attempt.submittedAt)return;
  if(!automatic&&!confirm('답안을 제출하고 해설을 확인할까요?'))return;
  attempt.submittedAt=Date.now();save();
  if(saveMessage!=='자동 저장됨'){render(true);return;}
  location.href='review.html?attempt='+encodeURIComponent(attempt.attemptId);
}
function summary(){
  const rs=exam.questions.filter(q=>attempt.questionOrder.includes(q.id)).map(q=>resultFor(q,attempt));
  const auto=rs.filter(r=>r.gradingMethod==='auto'),self=rs.filter(r=>r.gradingMethod==='self');
  return '<div class="result-summary"><div><small>자동채점</small><strong>'+auto.filter(r=>r.status==='correct').length+' <span>/ '+auto.length+'</span></strong></div><div><small>자기채점 완료</small><strong>'+self.filter(r=>r.status!=='pending-review').length+' <span>/ '+self.length+'</span></strong></div><div><small>다시 살펴볼 문제</small><strong>'+rs.filter(r=>['incorrect','partial','unanswered'].includes(r.status)).length+'</strong></div></div>';
}
function render(forceReview=false){
  const viewing=review||!!attempt.submittedAt||forceReview, qs=eligible();
  attempt.currentIndex=Math.min(attempt.currentIndex||0,Math.max(0,qs.length-1));
  const q=qs[attempt.currentIndex],revealed=!!q&&(viewing||attempt.revealed.includes(q.id)),result=q?resultFor(q,attempt):null;
  root.innerHTML='<div class="quiz-top"><a class="back" href="index.html">← 문제집으로</a><span class="pill">'+(viewing?'결과와 복습':attempt.mode==='exam'?'시험 모드':'학습 모드')+'</span><span id="timer" class="timer"></span></div><div class="quiz-title"><div><span class="eyebrow">'+e(exam.subtitle||'주제별 연습')+'</span><h1>'+e(exam.title)+'</h1></div><p id="save-status" class="muted" role="status">'+e(saveMessage||'답안은 자동으로 저장됩니다')+'</p></div>'+(versionNotice?'<p class="notice">개정 전 응시 기록입니다. 당시 문제와 답안으로 복습합니다.</p>':'')+(viewing?summary():'')
  +'<div class="quiz-layout"><aside class="quiz-sidebar"><div class="sidebar-heading">문항 목록 <span>'+attempt.questionOrder.filter(id=>String(attempt.answers[id]||'').trim()).length+'/'+attempt.questionOrder.length+'</span></div>'+((attempt.mode==='study'||viewing)?'<label class="filter-label">문항 유형<select id="type-filter">'+[['all','모든 유형'],...Object.entries(typeNames)].map(([id,name])=>'<option value="'+id+'" '+(typeFilter===id?'selected':'')+'>'+name+'</option>').join('')+'</select></label>':'')+(viewing?'<label class="filter-label">복습 범위<select id="review-filter">'+[['all','전체 문제'],['wrong','오답과 미응답'],['pending','자기채점 대기'],['marks','북마크']].map(([id,name])=>'<option value="'+id+'" '+(filter===id?'selected':'')+'>'+name+'</option>').join('')+'</select></label>':'')+'<nav class="question-nav" aria-label="문항 이동">'+qs.map((item,i)=>'<button data-nav="'+i+'" class="'+(i===attempt.currentIndex?'current ':'')+(String(attempt.answers[item.id]||'').trim()?'answered':'')+'" aria-label="'+(i+1)+'번 문항" '+(i===attempt.currentIndex?'aria-current="step"':'')+'>'+(i+1)+'</button>').join('')+'</nav><p class="sidebar-help">'+(viewing?'해설을 확인한 뒤 채점 기준에 맞춰 검토해 보세요.':'번호를 눌러 원하는 문항으로 이동할 수 있어요.')+'</p>'+(attempt.mode==='exam'&&!viewing?'<button class="primary full" id="submit">제출하기</button>':'')+(viewing?'<a class="quiet full retry" href="quiz.html?exam='+e(attempt.examId)+'&mode=study&shuffle=1&new=1">선지를 섞어 다시 풀기</a>':'')+'</aside>'
  +'<section class="question-panel">'+(!q?'<div class="empty">이 조건에 해당하는 문제가 없습니다.</div>':'<div class="question-heading"><span class="question-index">QUESTION '+String(attempt.currentIndex+1).padStart(2,'0')+'</span><div><span class="pill neutral">'+typeNames[q.type]+'</span><button class="bookmark" id="mark" aria-pressed="'+store.isMarked(q.id)+'" aria-label="북마크">'+(store.isMarked(q.id)?'★':'☆')+'</button></div></div><h2 id="question-title">'+e(q.title)+'</h2><div class="prose">'+markdown(q.stem)+'</div>'+renderExamples(q.examples,'입출력 예시')
  +renderAnswer(q,viewing,revealed)
  +(!viewing&&attempt.mode==='study'?'<button id="reveal" class="primary reveal">'+(revealed?'해설 닫기':q.type==='mc'||q.type==='short'?'답안 확인':'해설 보기')+'</button>':'')
  +(revealed?'<section class="explanation"><div class="explanation-heading">'+(result.gradingMethod==='auto'?(result.status==='correct'?'정답입니다':result.status==='unanswered'?'아직 답을 입력하지 않았어요':'다시 살펴보세요'):'풀이를 비교해 보세요')+'</div><div class="prose">'+markdown(q.solution)+'</div>'+(q.type==='mc'?'<div class="choice-reasons">'+(attempt.choiceOrders[q.id]||q.choices.map(c=>c.id)).map((id,i)=>'<div><b>'+(i+1)+(id===q.correctChoiceId?' 정답':'')+'</b><p>'+e(q.choiceExplanations[id])+'</p></div>').join(''):'')+(q.type==='short'?'<p class="model-short"><b>모범답안</b> '+e(q.acceptedAnswers[0])+'</p><button id="override" class="quiet">표기가 다른 답 직접 재채점</button>':'')+(q.type==='code'||q.type==='essay'?'<details class="model"><summary>모범답안 보기</summary><div class="prose">'+markdown(q.modelAnswer)+'</div></details>'+(q.complexity?'<p class="complexity">'+e(q.complexity)+'</p>':'')+renderExamples(q.reviewCases,'확인할 경계 사례')+'<fieldset class="rubric"><legend>직접 채점하기</legend><p class="muted">답안에 포함한 항목을 체크하세요. 일부만 충족해도 기록할 수 있습니다.</p>'+q.rubric.map(r=>'<label><input type="checkbox" value="'+e(r.id)+'" '+(attempt.selfGrades[q.id]?.includes(r.id)?'checked':'')+'>'+e(r.criterion)+'</label>').join('')+'<button id="save-grade" class="quiet">자기채점 저장</button><span id="grade-status" role="status">'+(attempt.selfGrades[q.id]?'채점 기록이 있습니다':'아직 채점하지 않았습니다')+'</span></fieldset>':'')+'</section>':'')
  +'<div class="question-actions"><button class="quiet" id="prev" '+(attempt.currentIndex===0?'disabled':'')+'>← 이전</button><span>'+(attempt.currentIndex+1)+' / '+qs.length+'</span><button class="primary" id="next">'+(attempt.currentIndex===qs.length-1?(viewing?'처음으로':'학습 마치기'):'다음 →')+'</button></div>')+'</section></div>';
  root.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>{attempt.currentIndex=Number(b.dataset.nav);save();render();});
  const type=document.querySelector('#type-filter');if(type)type.onchange=()=>{typeFilter=type.value;attempt.currentIndex=0;render();};
  const range=document.querySelector('#review-filter');if(range)range.onchange=()=>{filter=range.value;attempt.currentIndex=0;render();};
  document.querySelector('#submit')?.addEventListener('click',()=>submit());
  if(!q)return;
  document.querySelector('#mark').onclick=()=>{const r=store.toggleMark(q.id);if(!r.saved)saveMessage=r.reason;render();};
  root.querySelectorAll('input[name=choice]').forEach(input=>input.onchange=()=>{attempt.answers[q.id]=input.value;save();render();document.querySelector('input[value="'+input.value+'"]')?.focus();});
  const field=document.querySelector('#answer');if(field)field.oninput=()=>{attempt.answers[q.id]=field.value;save();};
  document.querySelector('#code-download')?.addEventListener('click',()=>download('Main.java',attempt.answers[q.id]||'','text/plain'));
  document.querySelector('#reveal')?.addEventListener('click',()=>{attempt.revealed=revealed?attempt.revealed.filter(id=>id!==q.id):[...attempt.revealed,q.id];save();render();});
  document.querySelector('#override')?.addEventListener('click',()=>{attempt.overrides[q.id]=confirm('핵심 의미가 모범답안과 같아 정답으로 기록할까요? 취소하면 오답으로 기록합니다.');save();render();});
  document.querySelector('#save-grade')?.addEventListener('click',()=>{attempt.selfGrades[q.id]=[...root.querySelectorAll('.rubric input:checked')].map(x=>x.value);save();render();});
  document.querySelector('#prev').onclick=()=>{attempt.currentIndex--;save();render();document.querySelector('#question-title')?.scrollIntoView({block:'start'});};
  document.querySelector('#next').onclick=()=>{if(attempt.currentIndex<qs.length-1){attempt.currentIndex++;save();render();}else if(viewing){attempt.currentIndex=0;render();}else submit();};
  tick();
}
function renderExamples(examples,title){return examples?.length?'<details class="examples" '+(title==='입출력 예시'?'open':'')+'><summary>'+title+'</summary>'+examples.map(item=>'<div class="example-grid"><div><small>입력</small><pre>'+e(item.input)+'</pre></div><div><small>출력</small><pre>'+e(item.output)+'</pre></div></div>').join('')+'</details>':'';}
function renderAnswer(q,viewing,revealed){
  if(q.type==='mc')return '<fieldset class="choices"><legend class="sr-only">정답 선택</legend>'+(attempt.choiceOrders[q.id]||q.choices.map(c=>c.id)).map((id,i)=>{const choice=q.choices.find(c=>c.id===id);return '<label class="choice '+(revealed&&id===q.correctChoiceId?'correct-choice':'')+'"><input name="choice" type="radio" value="'+e(id)+'" '+(attempt.answers[q.id]===id?'checked':'')+' '+(viewing?'disabled':'')+'><span class="choice-num">'+(i+1)+'</span><span>'+e(choice.text)+'</span></label>';}).join('')+'</fieldset>';
  return '<label class="answer-label" for="answer">'+(q.type==='code'?'Java 답안':q.type==='essay'?'나의 설명':'나의 답')+'</label>'+(q.type==='short'?'<input id="answer" autocomplete="off" value="'+e(attempt.answers[q.id]||'')+'" '+(viewing?'readonly':'')+'>':'<textarea id="answer" class="'+(q.type==='code'?'code-editor':'')+'" rows="'+(q.type==='code'?12:6)+'" spellcheck="false" '+(viewing?'readonly':'')+'>'+e(attempt.answers[q.id]||'')+'</textarea>')+(q.type==='code'?'<div class="editor-footer"><span>코드를 작성한 뒤 풀이와 비교해 보세요</span><button class="quiet" id="code-download">Java 파일 저장</button></div>':'');
}
function tick(){
  const timer=document.querySelector('#timer');if(!timer||!attempt)return;
  const remaining=remainingSeconds(attempt);
  timer.textContent=attempt.submittedAt?'제출 완료':remaining===null?'시간 제한 없음':Math.floor(remaining/60)+':'+String(remaining%60).padStart(2,'0');
  if(remaining===0&&!attempt.submittedAt)submit(true);
}
try{
  const id=params.get('attempt');
  if(id){
    const saved=store.loadAttempt(id);if(!saved.attempt)throw Error('저장된 응시 기록이 없습니다');
    attempt=saved.attempt;exam=attempt.snapshot;
    try{versionNotice=(await loadExam(attempt.examId)).contentVersion!==attempt.contentVersion;}catch{}
  }else{
    exam=await loadExam(params.get('exam'));const mode=params.get('mode')==='study'?'study':'exam',topic=params.get('topic');
    if(topic&&mode==='study'){
      const all=await Promise.all([1,2,3].map(i=>loadExam('subject-0'+i)));
      exam={...exam,title:'주제별 연습',questions:all.flatMap(x=>x.questions).filter(q=>q.topics.includes(topic)),defaultChoiceOrders:Object.assign({},...all.map(x=>x.defaultChoiceOrders)),contentVersion:all.map(x=>x.contentVersion).join('-')};
      if(!exam.questions.length)throw Error('해당 주제의 문제가 없습니다');
    }
    const existing=!params.has('new')&&!topic&&store.listAttempts().find(a=>a.examId===exam.id&&a.mode===mode&&!a.submittedAt&&a.contentVersion===exam.contentVersion&&!a.topic);
    let minutes=Number(params.get('minutes')??exam.practiceMinutes);if(!Number.isFinite(minutes)||minutes<0||minutes>600)minutes=exam.practiceMinutes;
    attempt=existing||createAttempt(exam,{mode,durationMinutes:minutes,shuffle:params.has('shuffle')});attempt.topic=topic||null;
    save();history.replaceState(null,'','quiz.html?attempt='+encodeURIComponent(attempt.attemptId));
  }
  attempt.selfGrades??={};attempt.overrides??={};attempt.revealed??=[];
  render();setInterval(tick,1000);
}catch(err){root.innerHTML='<div class="empty"><h1>문제를 열지 못했습니다</h1><p>'+e(err.message)+'</p><a href="index.html">문제집으로 돌아가기</a></div>';}
