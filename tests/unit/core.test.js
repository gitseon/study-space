import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
const load = async name => {
  assert.ok(existsSync(new URL('../../assets/'+name+'.js', import.meta.url)), name+' is not implemented');
  return import('../../assets/'+name+'.js');
};
const questions=Array.from({length:21},(_,i)=>({id:'q'+i,type:'mc',correctChoiceId:'b',choices:'abcd'.split('').map(id=>({id,text:id})),orderLocked:false}));
test('shuffle keeps answer identities and obeys constraints across 1000 seeds',async()=>{
  const {planChoiceOrder,validSequence}=await load('choice-order');
  for(let seed=1;seed<=1000;seed++){
    const plan=planChoiceOrder(questions,seed);
    assert.ok(plan);
    const seq=questions.map(q=>plan.choiceOrders[q.id].indexOf('b'));
    assert.ok(validSequence(seq));
    assert.deepEqual([...plan.choiceOrders.q0].sort(),['a','b','c','d']);
  }
  assert.equal(validSequence([0,0,0]),false);
  assert.equal(validSequence([0,1,2,0,1,2]),false);
  assert.equal(planChoiceOrder(questions.map(q=>({...q,orderLocked:true})),1),null);
});
test('grading uses choice IDs and conservative per-question text normalization',async()=>{
  const {gradeAnswer}=await load('grading');
  assert.equal(gradeAnswer(questions[0],'b').status,'correct');
  assert.equal(gradeAnswer(questions[0],'a').status,'incorrect');
  assert.equal(gradeAnswer({type:'short',acceptedAnswers:['peek()'],normalization:'trim'},' peek() ').status,'correct');
  assert.equal(gradeAnswer({type:'short',acceptedAnswers:['peek()'],normalization:'trim'},'PEEK()').status,'incorrect');
  assert.equal(gradeAnswer({type:'essay',rubric:[{points:1}]},'written').status,'pending-review');
});
test('deadline is based on wall clock and reload preserves order',async()=>{
  const {createAttempt,remainingSeconds}=await load('attempt');
  const a=createAttempt({id:'s',contentVersion:'v',questions,defaultChoiceOrders:{}},{mode:'exam',now:1000,durationMinutes:1,shuffle:true});
  assert.equal(remainingSeconds(a,31000),30);
  assert.equal(remainingSeconds(a,90000),0);
  assert.deepEqual(JSON.parse(JSON.stringify(a)).choiceOrders,a.choiceOrders);
});
test('storage survives denial and rejects corrupted and foreign backups',async()=>{
  const {createStore}=await load('storage');
  const denied={getItem(){throw Error('denied')},setItem(){throw Error('full')}};
  const store=createStore(denied);
  const a={attemptId:'a',examId:'x',contentVersion:'v',answers:{q:'b'},choiceOrders:{q:['b','a']},questionOrder:['q'],mode:'exam',startedAt:1,snapshot:{questions:[]}};
  assert.equal(store.saveAttempt(a).saved,false);
  assert.equal(store.loadAttempt('a','v').attempt.answers.q,'b');
  assert.equal(store.loadAttempt('a','next').status,'version-mismatch');
  assert.equal(store.validateImport({app:'else'}).valid,false);
  assert.equal(store.validateImport({app:'algorithm-notes',version:1,attempts:[{}],marks:{}}).valid,false);
});
