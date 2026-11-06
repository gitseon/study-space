export const T0 = Date.UTC(2026, 10, 6, 9, 0, 0);

export function fixtureProject() {
  const stage = (id, body) => ({
    schemaVersion: 1, projectId: 'web-01', revision: 3, hash: 'abc123', stage: {id, label: `단계 ${id}`},
    files: [
      {path: 'pom.xml', language: 'xml', editable: false, text: '<project/>'},
      {path: 'src/A.java', language: 'java', editable: true, text: `// study-target:t-a:start\n${body}\n// study-target:t-a:end\n`},
      {path: 'src/b.jsp', language: 'jsp', editable: true, text: '<%-- start --%>'},
    ],
    targets: [{id: 't-a', path: 'src/A.java', title: 'A', topicIds: [], requirementId: 'R-A', checklistIds: ['c-1']}],
    hints: {'t-a': ['힌트 하나']},
  });
  return {
    id: 'web-01', title: '캠핑 용품 관리', revision: 3, hash: 'abc123', durationOptions: [90, 120, 0], defaultMinutes: 120,
    requirements: '# 요구사항', flow: '# 흐름',
    checklist: [{id: 'c-1', title: '목록', steps: ['열기'], expected: '보임', targetIds: ['t-a']}, {id: 'c-2', title: '삭제', steps: [], expected: '', targetIds: []}],
    stages: [stage(1, 'int a = ____;'), stage(2, '// TODO'), stage(3, '// 작성')],
    reference: {files: [{path: 'src/A.java', text: 'SECRET-REFERENCE'}]},
  };
}
