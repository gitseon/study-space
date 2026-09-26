export function gradeAnswer(q,answer){
  const maxPoints=q.rubric?.reduce((n,r)=>n+r.points,0)||1;
  if(answer===undefined||answer===null||String(answer).trim()==='')return {status:'unanswered',points:0,maxPoints,gradingMethod:'auto'};
  if(q.type==='essay'||q.type==='code')return {status:'pending-review',points:0,maxPoints,gradingMethod:'self'};
  const normalize=v=>q.normalization==='caseFold'?String(v).trim().toLocaleLowerCase('en'):q.normalization==='trim'?String(v).trim():String(v);
  const correct=q.type==='mc'?answer===q.correctChoiceId:q.acceptedAnswers.some(v=>normalize(v)===normalize(answer));
  return {status:correct?'correct':'incorrect',points:correct?1:0,maxPoints:1,gradingMethod:'auto'};
}
export function resultFor(q,attempt){
  const result=gradeAnswer(q,attempt.answers[q.id]);
  if(q.type==='essay'||q.type==='code'){
    const value=attempt.selfGrades[q.id];
    if(value){const points=q.rubric.reduce((n,r)=>n+(value.includes(r.id)?r.points:0),0);return {...result,status:points===result.maxPoints?'correct':points?'partial':'incorrect',points,gradingMethod:'self'};}
    return {...result,status:'pending-review',gradingMethod:'self'};
  }
  if(q.type==='short'&&attempt.overrides?.[q.id]!==undefined)return {...result,status:attempt.overrides[q.id]?'correct':'incorrect',points:attempt.overrides[q.id]?1:0,gradingMethod:'self'};
  return result;
}
