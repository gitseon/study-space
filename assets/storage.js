const APP='algorithm-notes', KEY='algorithm-notes:v1';
function validAttempt(a){
  return !!a&&typeof a.attemptId==='string'&&typeof a.examId==='string'&&typeof a.contentVersion==='string'
    &&['exam','study'].includes(a.mode)&&Number.isFinite(a.startedAt)&&Array.isArray(a.questionOrder)
    &&a.answers&&typeof a.answers==='object'&&!Array.isArray(a.answers)
    &&a.choiceOrders&&typeof a.choiceOrders==='object'&&a.snapshot&&Array.isArray(a.snapshot.questions);
}
export function createStore(storage){
  let memory={app:APP,version:1,attempts:[],marks:{}},readFailure=false;
  try{const raw=storage?.getItem(KEY);if(raw){const parsed=JSON.parse(raw);if(validateImport(parsed).valid)memory=parsed;else readFailure=true;}}catch{readFailure=true;}
  function validateImport(v){return {valid:!!v&&v.app===APP&&v.version===1&&Array.isArray(v.attempts)&&v.attempts.length<=2000&&v.attempts.every(validAttempt)&&v.marks&&typeof v.marks==='object'&&!Array.isArray(v.marks),errors:['이 사이트에서 내보낸 올바른 백업 파일인지 확인해 주세요']};}
  function persist(){try{storage.setItem(KEY,JSON.stringify(memory));return {saved:true};}catch{return {saved:false,reason:'브라우저에 저장하지 못했습니다. 기록을 파일로 내려받아 주세요'};}}
  return {
    readFailure,validateImport,
    saveAttempt(a){memory.attempts=memory.attempts.filter(v=>v.attemptId!==a.attemptId);memory.attempts.push(structuredClone(a));return persist();},
    loadAttempt(id,version){const a=memory.attempts.find(v=>v.attemptId===id);return {attempt:a?structuredClone(a):null,status:!a?'missing':version&&a.contentVersion!==version?'version-mismatch':'ok'};},
    listAttempts(){return structuredClone(memory.attempts).sort((a,b)=>b.startedAt-a.startedAt);},
    exportProgress(){return {...structuredClone(memory),exportedAt:new Date().toISOString()};},
    importProgress(value,replace=false){if(!validateImport(value).valid)return {saved:false,reason:'잘못된 백업 파일입니다'};const map=new Map(memory.attempts.map(a=>[a.attemptId,a]));for(const a of value.attempts)if(replace||!map.has(a.attemptId))map.set(a.attemptId,a);memory.attempts=[...map.values()];memory.marks=replace?{...memory.marks,...value.marks}:{...value.marks,...memory.marks};return persist();},
    toggleMark(id){if(memory.marks[id])delete memory.marks[id];else memory.marks[id]=true;return persist();},
    isMarked(id){return !!memory.marks[id];}
  };
}
let storage;try{storage=globalThis.localStorage;}catch{}
export const store=createStore(storage);
