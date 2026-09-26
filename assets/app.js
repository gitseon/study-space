import {store} from './storage.js';
import {escapeHtml as e,download} from './render.js';
const root=document.querySelector('#app');
let manifest,kind='all';
function render(){
  const attempts=store.listAttempts();
  root.innerHTML='<section class="hero"><div class="eyebrow"><span class="dot"></span> 모의고사 연습실</div><h1>이해한 만큼, 풀어보기</h1><p class="hero-copy">개념을 확인하고 직접 풀어보세요.<br class="desktop-break">틀린 문제는 다시 살펴보며 내 것으로 만듭니다.</p><div class="hero-stats"><span><strong>108</strong>문항</span><span><strong>6</strong>회차</span><span><strong>15</strong>핵심 주제</span></div><div class="hero-art" aria-hidden="true"><div class="art-label">THINK. TRACE. SOLVE.</div><div class="nodes"><span>01</span><i></i><span>02</span><i></i><span>03</span></div><div class="code-note">while (curiosity) {<br><b>　practice();</b><br>}</div></div></section>'
  +'<section class="library"><div class="section-heading"><div><span class="eyebrow">내 속도로 준비하기</span><h2>오늘의 문제집</h2></div><div class="tabs" role="group" aria-label="평가 유형">'+[['all','전체'],['subject','과평'],['monthly','월평']].map(([id,label])=>'<button data-kind="'+id+'" aria-pressed="'+(id===kind)+'" class="'+(id===kind?'active':'')+'">'+label+'</button>').join('')+'</div></div><div class="exam-grid">'
  +manifest.exams.filter(x=>kind==='all'||x.kind===kind).sort((a,b)=>a.id.localeCompare(b.id)*-1).sort((a,b)=>a.kind===b.kind?a.id.localeCompare(b.id):a.kind==='subject'?-1:1).map(exam=>{
    const index=Number(exam.id.slice(-2)),isSubject=exam.kind==='subject',resume=attempts.find(a=>a.examId===exam.id&&!a.submittedAt);
    return '<article class="exam-card '+(isSubject?'subject':'monthly')+'"><div class="card-top"><span class="pill">'+(isSubject?'과목평가':'월말평가')+'</span><span class="card-number">0'+index+'</span></div><h3>'+e(exam.subtitle)+'</h3><p class="card-description">'+(isSubject?'개념부터 코드 추적까지 차근차근 점검합니다.':'직접 구현하고 풀이 과정을 설명합니다.')+'</p><div class="card-types">'+(isSubject?'<span>객관식 <b>21</b></span><span>단답형 <b>9</b></span><span>서술형 <b>2</b></span>':'<span>구현형 <b>3</b></span><span>서술형 <b>1</b></span>')+'</div><label class="time-setting">연습 시간 <select id="time-'+exam.id+'"><option value="'+exam.practiceMinutes+'">'+exam.practiceMinutes+'분</option><option value="30">30분</option><option value="90">90분</option><option value="0">시간 제한 없음</option></select></label><div class="card-actions"><button class="primary" data-start="'+exam.id+'" aria-label="'+index+'회 시험 시작">시험 시작 <span aria-hidden="true">↗</span></button><a class="study-link" href="quiz.html?exam='+exam.id+'&mode=study">바로 학습</a></div>'+(resume?'<a class="resume" href="quiz.html?attempt='+e(resume.attemptId)+'">이어서 풀기 →</a>':'')+'</article>';
  }).join('')+'</div></section>'
  +'<section class="practice-strip"><div><span class="eyebrow">필요한 부분부터</span><h2>주제별로 연습하기</h2><p>과평 세 회차에서 같은 주제를 모아 풀어보세요.</p></div><div class="topic-links">'+Object.entries(manifest.topics).map(([id,label])=>'<a href="quiz.html?exam=subject-01&mode=study&topic='+id+'">'+e(label)+'</a>').join('')+'</div></section>'
  +'<section class="records"><div class="section-heading"><h2>나의 학습 기록</h2><div class="backup-actions"><button class="quiet" id="export">내려받기</button><label class="file-button">가져오기<input id="import" type="file" accept=".json,application/json"></label></div></div><p class="muted">풀이 기록은 이 브라우저에 저장됩니다. 다른 기기로 옮길 때는 파일로 내려받아 주세요.</p><p id="notice" role="status">'+(store.readFailure?'기존 저장 기록을 읽지 못했습니다. 백업 파일이 있다면 가져와 주세요.':'')+'</p><div class="history">'+(attempts.length?attempts.slice(0,12).map(a=>'<a href="'+(a.submittedAt?'review':'quiz')+'.html?attempt='+e(a.attemptId)+'"><span><b>'+e(a.snapshot.title)+'</b><small>'+new Date(a.startedAt).toLocaleString('ko-KR')+'</small></span><span class="pill neutral">'+(a.submittedAt?'결과 보기':'진행 중')+'</span></a>').join(''):'<div class="empty">아직 풀이 기록이 없어요. 첫 문제집을 시작해 보세요.</div>')+'</div></section>';
  root.querySelectorAll('[data-kind]').forEach(b=>b.onclick=()=>{kind=b.dataset.kind;render();});
  root.querySelectorAll('[data-start]').forEach(b=>b.onclick=()=>{location.href='quiz.html?exam='+b.dataset.start+'&mode=exam&minutes='+document.getElementById('time-'+b.dataset.start).value;});
  document.querySelector('#export').onclick=()=>download('algonote-backup.json',JSON.stringify(store.exportProgress(),null,2));
  document.querySelector('#import').onchange=async ev=>{
    const file=ev.target.files[0];if(!file)return;
    try{
      if(file.size>20*1024*1024)throw Error('백업 파일은 20MB 이하만 지원합니다');
      const data=JSON.parse(await file.text());if(!store.validateImport(data).valid)throw Error('이 사이트에서 내려받은 백업 파일인지 확인해 주세요');
      if(!confirm('현재 기록을 보존하며 백업을 합칠까요?'))return;
      const conflict=data.attempts.some(a=>attempts.some(b=>b.attemptId===a.attemptId));
      const replace=conflict&&confirm('같은 응시 기록이 있습니다. 확인을 누르면 백업 내용으로 교체하고 취소하면 현재 기록을 유지합니다.');
      const result=store.importProgress(data,replace);render();document.querySelector('#notice').textContent=result.saved?'백업 기록을 가져왔습니다':result.reason;
    }catch(err){document.querySelector('#notice').textContent=err.message;}
  };
}
try{const res=await fetch('data/manifest.json');if(!res.ok)throw Error();manifest=await res.json();render();}
catch{root.innerHTML='<div class="empty"><h1>문제집을 불러오지 못했습니다</h1><p>연결을 확인하고 다시 시도해 주세요.</p><button onclick="location.reload()">다시 시도</button></div>';}
