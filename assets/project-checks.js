// 작성 누락 가능성 점검. 코드가 맞는지는 판정하지 않고, 다른 올바른 구현도 그대로 통과시킵니다.
// 모범답안과 비교하지 않으므로 이 모듈은 모범답안을 입력으로 받지 않습니다.
import {regionBody} from './project-editor.js';

export const FINDING_KINDS = ['unchanged', 'empty', 'blank-left', 'marker-lost', 'file-missing', 'form-incomplete'];

const BLANK = /____/;
const FORM_TAG = /<form\b[^>]*>/gi;

export function describeFinding({kind, title}) {
  switch (kind) {
    case 'unchanged': return `${title}: 시작 상태 그대로입니다. 작성이 누락됐을 가능성이 있습니다`;
    case 'empty': return `${title}: 작성 영역이 비어 있습니다. 구현이 누락됐을 가능성이 있습니다`;
    case 'blank-left': return `${title}: 빈칸 표시(____)가 남아 있습니다. 채우지 않은 곳이 있을 가능성이 있습니다`;
    case 'marker-lost': return `${title}: 작성 위치 표시를 찾을 수 없어 직접 확인이 필요합니다`;
    case 'file-missing': return `${title}: 대상 파일을 찾을 수 없어 직접 확인이 필요합니다`;
    case 'form-incomplete': return `${title}: form에 action이나 method가 빠졌을 가능성이 있습니다`;
    default: return `${title}: 확인이 필요합니다`;
  }
}

// project: {targets: [{id, path, title}], files: [{path, text}]}(시작 파일). files: 경로별 현재 텍스트.
export function checkProjectDraft(project, stageId, files) {
  const findings = [];
  for (const target of project.targets) {
    const make = (kind) => findings.push({targetId: target.id, path: target.path, kind, title: target.title, message: describeFinding({kind, title: target.title})});
    const text = files[target.path];
    if (typeof text !== 'string') { make('file-missing'); continue; }
    const body = regionBody(text, target.id);
    if (body === null) { make('marker-lost'); continue; }
    const startText = project.files.find((f) => f.path === target.path)?.text;
    const startBody = typeof startText === 'string' ? regionBody(startText, target.id) : null;
    if (body.trim() === '') { make('empty'); continue; }
    if (body === startBody) { make('unchanged'); continue; }
    if (stageId === 1 && BLANK.test(body)) { make('blank-left'); continue; }
    const forms = body.match(FORM_TAG) || [];
    if (forms.some((tag) => !/\baction\s*=/i.test(tag) || !/\bmethod\s*=/i.test(tag))) make('form-incomplete');
  }
  return findings;
}
