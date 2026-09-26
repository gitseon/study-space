import {planChoiceOrder} from './choice-order.js';
export function createAttempt(exam,{mode='exam',now=Date.now(),durationMinutes=0,shuffle=false}={}){
  const plan=shuffle?planChoiceOrder(exam.questions,now):null;
  const order=exam.defaultChoiceOrders||{};
  return {attemptId:crypto.randomUUID(),examId:exam.id,contentVersion:exam.contentVersion,mode,startedAt:now,
    deadlineAt:mode==='exam'&&durationMinutes>0?now+durationMinutes*60000:null,
    questionOrder:plan?.questionOrder||exam.questions.map(q=>q.id),choiceOrders:plan?.choiceOrders||order,
    answers:{},selfGrades:{},overrides:{},revealed:[],submittedAt:null,currentIndex:0,snapshot:structuredClone(exam)};
}
export const remainingSeconds=(a,now=Date.now())=>a.deadlineAt===null?null:Math.max(0,Math.ceil((a.deadlineAt-now)/1000));
