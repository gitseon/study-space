// 기존 학습 기록 백업(localStorage)에 프로젝트 응시(IndexedDB)를 선택 필드 projectAttempts로 합칩니다.
// 기존 앱은 이 필드를 모르는 채로 같은 파일을 가져올 수 있고, 이 모듈은 필드가 없는 옛 백업도 받습니다.
import {validateProjectAttempt} from './project-attempt.js';
import {sameAttempt} from './project-store.js';

export const BACKUP_LIMIT_BYTES = 20 * 1024 * 1024;
export const MAX_PROJECT_ATTEMPTS_PER_FILE = 200;

export const serializeBackup = (backup) => JSON.stringify(backup, null, 2);
const sizeOf = (backup) => new TextEncoder().encode(serializeBackup(backup)).length;

// base: store.exportProgress() 결과. 한 응시는 여러 파일에 나누지 않습니다.
// 첫 파일은 기존 기록을 담고, 한도를 넘으면 기존 필드가 비어 있는 파일로 이어서 나눕니다.
export function buildBackups(base, projectAttempts, maxBytes = BACKUP_LIMIT_BYTES) {
  if (!projectAttempts.length) return [{...base}];
  const shell = () => ({app: base.app, version: base.version, attempts: [], marks: {}, exportedAt: base.exportedAt});
  const files = [];
  let current = {...base, projectAttempts: []};
  for (const attempt of projectAttempts) {
    const trial = {...current, projectAttempts: [...current.projectAttempts, attempt]};
    if (sizeOf(trial) <= maxBytes) {
      current = trial;
      continue;
    }
    if (current.projectAttempts.length) {
      files.push(current);
    } else {
      const {projectAttempts: _unused, ...baseOnly} = current;
      files.push(baseOnly);
    }
    current = {...shell(), projectAttempts: [attempt]};
    if (sizeOf(current) > maxBytes) throw new Error('응시 하나가 백업 파일 한도를 넘습니다');
  }
  files.push(current);
  return files;
}

export function validateProjectAttempts(list) {
  if (list === undefined) return {valid: true, errors: []};
  if (!Array.isArray(list) || list.length > MAX_PROJECT_ATTEMPTS_PER_FILE) return {valid: false, errors: ['projectAttempts']};
  const ids = new Set();
  for (const attempt of list) {
    const check = validateProjectAttempt(attempt);
    if (!check.valid || ids.has(attempt.attemptId)) return {valid: false, errors: check.errors.length ? check.errors : ['duplicate']};
    ids.add(attempt.attemptId);
  }
  return {valid: true, errors: []};
}

export async function exportBackups({store, projects, maxBytes = BACKUP_LIMIT_BYTES}) {
  let projectAttempts = [];
  try {
    projectAttempts = (await projects.list()).sort((a, b) => a.startedAt - b.startedAt);
  } catch { /* 저장소를 열 수 없으면 기존 기록만 내보냅니다 */ }
  return buildBackups(store.exportProgress(), projectAttempts, maxBytes);
}

// 두 저장소 중 하나라도 실패하면 먼저 바꾼 localStorage를 이전 상태로 되돌립니다.
export async function importBackup(value, {store, projects, replace = false, overwriteProject = false}) {
  if (!store.validateImport(value).valid) return {saved: false, reason: '잘못된 백업 파일입니다'};
  if (!validateProjectAttempts(value.projectAttempts).valid) return {saved: false, reason: '프로젝트 응시 기록이 올바르지 않은 백업 파일입니다'};
  const incoming = value.projectAttempts ?? [];
  const previousLocal = store.exportProgress();
  let previousProjects = [];
  if (incoming.length) {
    try {
      previousProjects = await projects.list();
    } catch {
      return {saved: false, reason: '프로젝트 응시 기록을 읽지 못해 가져오지 않았습니다'};
    }
    const conflicts = incoming
      .filter((a) => previousProjects.some((p) => p.attemptId === a.attemptId && !sameAttempt(p, a)))
      .map((a) => a.attemptId);
    if (conflicts.length && !overwriteProject) return {saved: false, conflicts, reason: '같은 프로젝트 응시 기록이 있고 내용이 다릅니다'};
  }
  const local = store.importProgress(value, replace);
  if (!local.saved) {
    store.restoreSnapshot(previousLocal);
    return local;
  }
  if (incoming.length) {
    const result = await projects.importValidated(incoming, {overwrite: overwriteProject});
    if (!result.saved) {
      store.restoreSnapshot(previousLocal);
      return {...result, reason: result.reason || '프로젝트 응시 기록을 저장하지 못했습니다'};
    }
    return {saved: true, imported: result.imported, skipped: result.skipped};
  }
  return {saved: true, imported: 0, skipped: 0};
}
