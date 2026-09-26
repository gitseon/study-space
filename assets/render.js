export const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function markdown(text){
  const parts=String(text||'').split(/(\x60\x60\x60[\s\S]*?\x60\x60\x60)/g);
  return parts.map(part=>{
    if(part.startsWith('\x60\x60\x60')){
      const body=part.replace(/^\x60\x60\x60[^\n]*\n?/,'').replace(/\x60\x60\x60$/,'');
      return '<pre tabindex="0"><code>'+escapeHtml(body.trimEnd())+'</code></pre>';
    }
    return part.trim().split(/\n\s*\n/).filter(Boolean).map(p=>'<p>'+escapeHtml(p).replace(/\x60([^\x60]+)\x60/g,'<code>$1</code>').replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,' ')+'</p>').join('');
  }).join('');
}
export async function loadExam(id){
  if(!/^(subject|monthly)-0[1-3]$/.test(id||''))throw Error('선택한 회차를 찾지 못했습니다');
  const res=await fetch('data/'+id+'.json');
  if(!res.ok)throw Error('문제 데이터를 불러오지 못했습니다');
  return res.json();
}
export function download(name,content,type='application/json'){
  const url=URL.createObjectURL(new Blob([content],{type:type+';charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export const typeNames={mc:'객관식',short:'단답형',essay:'서술형',code:'구현형'};
