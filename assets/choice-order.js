export function validSequence(seq) {
  const n=seq.length;
  if(n>=12){
    const lo=n===21?4:Math.floor(n/4)-1, hi=n===21?7:Math.ceil(n/4)+1;
    if([0,1,2,3].some(i=>{const count=seq.filter(v=>v===i).length;return count<lo||count>hi;})) return false;
  }
  if(seq.some((v,i)=>i>=2&&v===seq[i-1]&&v===seq[i-2])) return false;
  for(const [size,repeats] of [[2,3],[3,2],[4,2]]) for(let i=0;i<=n-size*repeats;i++){
    if(Array.from({length:size*repeats},(_,k)=>seq[i+k]===seq[i+k%size]).every(Boolean)) return false;
  }
  return true;
}
export function planChoiceOrder(questions, seed=Date.now()) {
  let state=seed>>>0;
  const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
  const shuffled=items=>{const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
  for(let attempt=0;attempt<1000;attempt++){
    const order={},seq=[];
    for(const q of questions.filter(q=>q.type==='mc')){
      order[q.id]=q.orderLocked?q.choices.map(c=>c.id):shuffled(q.choices.map(c=>c.id));
      seq.push(order[q.id].indexOf(q.correctChoiceId));
    }
    if(validSequence(seq))return {questionOrder:questions.map(q=>q.id),choiceOrders:order};
  }
  return null;
}
