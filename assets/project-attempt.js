// 월말평가 Web 프로젝트 응시 상태. 모든 함수는 입력을 바꾸지 않고 새 객체를 돌려줍니다.
export const SCHEMA_VERSION = 1;
export const DURATION_OPTIONS = [90, 120, 0];
export const DEFAULT_MINUTES = 120;
export const CHECK_STATES = ['unchecked', 'confirmed', 'needs-work'];
export const STATUSES = ['in-progress', 'time-ended', 'review'];

const clone = (value) => structuredClone(value);
const isPlainObject = (v) => !!v && typeof v === 'object' && !Array.isArray(v);

export function safePath(path) {
  return typeof path === 'string' && path.length > 0 && !path.startsWith('/') && !path.includes('\\')
    && !path.includes(':') && path.split('/').every((part) => part !== '' && part !== '.' && part !== '..');
}

// 주소의 시간 값을 허용 목록으로 검증합니다. 값이 없으면 기본값이고 잘못된 값이면 기본값과 fallback을 알립니다.
export function parseMinutes(raw) {
  if (raw === null || raw === undefined || raw === '') return {minutes: DEFAULT_MINUTES, fallback: false};
  const number = Number(raw);
  if (String(raw).trim() !== '' && Number.isInteger(number) && DURATION_OPTIONS.includes(number)) return {minutes: number, fallback: false};
  return {minutes: DEFAULT_MINUTES, fallback: true};
}

function newId() {
  return globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `attempt-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function emptyChecks(checklist) {
  return Object.fromEntries(checklist.map((item) => [item.id, 'unchecked']));
}

export function createProjectAttempt(project, stageId, minutes, now = Date.now(), id = newId()) {
  if (!DURATION_OPTIONS.includes(minutes)) throw new Error('허용하지 않는 시간입니다');
  const stage = (project.stages || []).find((s) => s.stage?.id === stageId);
  if (!stage) throw new Error('알 수 없는 단계입니다');
  const files = Object.fromEntries(stage.files.filter((f) => f.editable).map((f) => [f.path, f.text]));
  const first = stage.targets?.[0]?.path ?? Object.keys(files)[0] ?? null;
  return {
    attemptId: id,
    projectId: project.id,
    revision: project.revision,
    stageId,
    schemaVersion: SCHEMA_VERSION,
    minutes,
    startedAt: now,
    deadlineAt: minutes > 0 ? now + minutes * 60000 : null,
    endedAt: null,
    status: 'in-progress',
    projectSnapshot: clone({
      projectId: project.id, title: project.title, revision: project.revision, hash: project.hash,
      stageId, stageLabel: stage.stage.label, requirements: project.requirements, flow: project.flow,
      checklist: project.checklist, targets: stage.targets, hints: stage.hints, files: stage.files,
      ...(project.structure ? {structure: project.structure} : {}),
    }),
    files,
    activePath: first,
    checks: emptyChecks(project.checklist),
    notes: {},
    viewedHints: [],
    viewedReference: false,
    updatedAt: now,
    saveVersion: 0,
    continuedFrom: null,
    endedFiles: null,
  };
}

export function remainingMs(attempt, now = Date.now()) {
  return attempt.deadlineAt === null ? null : Math.max(0, attempt.deadlineAt - now);
}

export function isExpired(attempt, now = Date.now()) {
  return attempt.deadlineAt !== null && now >= attempt.deadlineAt;
}

export function finishProjectAttempt(attempt, now = Date.now(), reason = 'manual') {
  if (attempt.status !== 'in-progress') return attempt;
  const timeout = reason === 'timeout';
  const endedAt = timeout ? (attempt.deadlineAt ?? now) : now;
  return {...clone(attempt), status: timeout ? 'time-ended' : 'review', endedAt, endedFiles: clone(attempt.files), updatedAt: now};
}

// 새로고침이나 백그라운드 뒤에도 deadlineAt을 기준으로 만료를 반영합니다.
export function syncProjectAttempt(attempt, now = Date.now()) {
  if (attempt.status === 'in-progress' && isExpired(attempt, now)) return finishProjectAttempt(attempt, now, 'timeout');
  return attempt;
}

export function editProjectFile(attempt, path, text, now = Date.now()) {
  if (attempt.status !== 'in-progress') return {attempt, accepted: false, reason: 'ended'};
  if (isExpired(attempt, now)) return {attempt, accepted: false, reason: 'expired'};
  const snapshotFile = attempt.projectSnapshot.files.find((f) => f.path === path);
  if (!snapshotFile) return {attempt, accepted: false, reason: 'unknown-file'};
  if (!snapshotFile.editable) return {attempt, accepted: false, reason: 'read-only'};
  if (typeof text !== 'string') return {attempt, accepted: false, reason: 'invalid-text'};
  return {attempt: {...clone(attempt), files: {...attempt.files, [path]: text}, updatedAt: now}, accepted: true};
}

export function setActivePath(attempt, path) {
  if (!attempt.projectSnapshot.files.some((f) => f.path === path)) throw new Error('프로젝트에 없는 파일입니다');
  return {...clone(attempt), activePath: path};
}

export function setProjectCheck(attempt, criterionId, state) {
  if (!CHECK_STATES.includes(state)) throw new Error('알 수 없는 점검 상태입니다');
  if (!(criterionId in attempt.checks)) throw new Error('알 수 없는 점검 항목입니다');
  return {...clone(attempt), checks: {...attempt.checks, [criterionId]: state}};
}

export function setProjectNote(attempt, criterionId, text) {
  if (!(criterionId in attempt.checks)) throw new Error('알 수 없는 점검 항목입니다');
  return {...clone(attempt), notes: {...attempt.notes, [criterionId]: String(text)}};
}

export function markHintViewed(attempt, targetId) {
  if (attempt.viewedHints.includes(targetId)) return attempt;
  return {...clone(attempt), viewedHints: [...attempt.viewedHints, targetId]};
}

export function markReferenceViewed(attempt) {
  return attempt.viewedReference ? attempt : {...clone(attempt), viewedReference: true};
}

// 종료된 응시의 코드를 새 무제한 응시로 복제합니다. 원래 응시는 바꾸지 않고 점검 상태는 새로 시작합니다.
export function continueProjectAttempt(attempt, now = Date.now(), id = newId()) {
  if (attempt.status === 'in-progress') throw new Error('종료된 응시만 이어서 연습할 수 있습니다');
  const source = attempt.endedFiles ?? attempt.files;
  return {
    ...clone(attempt),
    attemptId: id,
    minutes: 0,
    startedAt: now,
    deadlineAt: null,
    endedAt: null,
    status: 'in-progress',
    files: clone(source),
    checks: emptyChecks(attempt.projectSnapshot.checklist),
    notes: {},
    viewedHints: [],
    viewedReference: false,
    updatedAt: now,
    saveVersion: 0,
    continuedFrom: attempt.attemptId,
    endedFiles: null,
  };
}

export function validateProjectAttempt(a) {
  const errors = [];
  const fail = (message) => errors.push(message);
  if (!isPlainObject(a)) return {valid: false, errors: ['응시 기록이 객체가 아닙니다']};
  if (typeof a.attemptId !== 'string' || !a.attemptId) fail('attemptId');
  if (typeof a.projectId !== 'string' || !a.projectId) fail('projectId');
  if (!Number.isInteger(a.revision) || a.revision < 1) fail('revision');
  if (!Number.isInteger(a.stageId)) fail('stageId');
  if (a.schemaVersion !== SCHEMA_VERSION) fail('schemaVersion');
  if (!DURATION_OPTIONS.includes(a.minutes)) fail('minutes');
  if (!Number.isFinite(a.startedAt)) fail('startedAt');
  if (!(a.deadlineAt === null || Number.isFinite(a.deadlineAt)) || (a.minutes === 0) !== (a.deadlineAt === null)) fail('deadlineAt');
  if (!STATUSES.includes(a.status)) fail('status');
  if (!(a.endedAt === null || Number.isFinite(a.endedAt))) fail('endedAt');
  if (!Number.isFinite(a.updatedAt)) fail('updatedAt');
  if (!Number.isInteger(a.saveVersion) || a.saveVersion < 0) fail('saveVersion');
  const snapshot = a.projectSnapshot;
  if (!isPlainObject(snapshot) || !Array.isArray(snapshot.files) || !Array.isArray(snapshot.checklist)) {
    fail('projectSnapshot');
    return {valid: false, errors};
  }
  const editable = new Set(snapshot.files.filter((f) => f.editable).map((f) => f.path));
  const checkFiles = (files, label) => {
    if (!isPlainObject(files)) return fail(label);
    for (const [path, text] of Object.entries(files)) {
      if (!safePath(path) || !editable.has(path) || typeof text !== 'string') fail(`${label}:${path}`);
    }
  };
  checkFiles(a.files, 'files');
  if (a.endedFiles !== null) checkFiles(a.endedFiles, 'endedFiles');
  if (!isPlainObject(a.checks)) fail('checks');
  else {
    const ids = new Set(snapshot.checklist.map((c) => c.id));
    for (const [id, state] of Object.entries(a.checks)) if (!ids.has(id) || !CHECK_STATES.includes(state)) fail(`checks:${id}`);
  }
  if (!isPlainObject(a.notes)) fail('notes');
  if (!Array.isArray(a.viewedHints) || !a.viewedHints.every((v) => typeof v === 'string')) fail('viewedHints');
  if (typeof a.viewedReference !== 'boolean') fail('viewedReference');
  if (!(a.activePath === null || typeof a.activePath === 'string')) fail('activePath');
  if (!(a.continuedFrom === null || typeof a.continuedFrom === 'string')) fail('continuedFrom');
  return {valid: errors.length === 0, errors};
}
