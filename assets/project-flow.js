// flow.md를 홈의 흐름 요약 탭으로 나눕니다. 전체 흐름, 기능별 흐름(### 제목마다 하나), 짝으로 기억할 것 순서입니다.
export function splitFlow(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const tabs = [];
  let current = null;
  let inFeatures = false;
  const open = (label, kind) => {
    current = {id: `${kind}-${tabs.length}`, label, kind, lines: []};
    tabs.push(current);
  };
  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+?)\s*$/);
    const h3 = line.match(/^###\s+(.+?)\s*$/);
    if (h2 && !line.startsWith('###')) {
      inFeatures = /기능별/.test(h2[1]);
      if (inFeatures) { current = null; continue; }
      open(h2[1], 'section');
      continue;
    }
    if (h3 && inFeatures) {
      open(h3[1], 'feature');
      continue;
    }
    if (/^#\s/.test(line)) continue;
    if (current) current.lines.push(line);
    else if (!inFeatures && line.trim()) { open('전체 흐름', 'section'); current.lines.push(line); }
  }
  const result = tabs.map(({id, label, kind, lines: body}) => ({id, label, kind, md: body.join('\n').trim() + '\n'})).filter((t) => t.md.trim());
  return result.length ? result : [{id: 'section-0', label: '전체 흐름', kind: 'section', md: markdown}];
}
