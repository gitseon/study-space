// 현재 코드와 제공 파일을 합쳐 실행용 프로젝트 ZIP을 만듭니다. 학습 기록 백업(JSON)과는 별개입니다.
import {strToU8, zipSync} from './vendor/fflate/fflate.browser.js';

const EXCLUDED_DIRS = new Set(['target', 'build', '.git', '.settings', '.idea', '.vscode', 'node_modules', 'reference', 'stages', 'starter']);
const EXCLUDED_NAMES = new Set(['.classpath', '.project', 'review.json', 'verification.md', 'progress.json', 'project.json', 'stages.json', 'checklist.json']);
const FIXED_TIME = new Date(2026, 0, 1, 0, 0, 0);

export function safeZipPath(path) {
  if (typeof path !== 'string' || !path || path.length > 240) return false;
  if (/[\u0000-\u001f\\:]/.test(path) || path.startsWith('/') || path.endsWith('/')) return false;
  return path.split('/').every((part) => part !== '' && part !== '.' && part !== '..');
}

// 빌드 산출물, IDE 개인 설정, 모범답안, 다른 단계 코드와 진행 데이터는 프로젝트 ZIP에 넣지 않습니다.
export function isExportable(path) {
  const parts = path.split('/');
  const name = parts[parts.length - 1];
  if (parts.slice(0, -1).some((dir) => EXCLUDED_DIRS.has(dir))) return false;
  if (EXCLUDED_NAMES.has(name)) return false;
  return !name.endsWith('.class');
}

export const exportRoot = (project) => `${project.id}-stage-${project.stageId}`;

// project: {id, stageId, files: [{path, editable, text, requiredInExport?}]}, files: 편집한 파일의 현재 텍스트.
export function planExport(project, files) {
  const seen = new Set();
  const planned = [];
  for (const file of project.files) {
    if (!safeZipPath(file.path)) throw new Error(`허용하지 않는 경로입니다: ${file.path}`);
    if (file.requiredInExport === false || !isExportable(file.path)) continue;
    const key = file.path.toLowerCase();
    if (seen.has(key)) throw new Error(`중복된 경로입니다: ${file.path}`);
    seen.add(key);
    // 제공 파일은 바꿀 수 없고 작성 파일만 현재 텍스트로 바뀝니다.
    const text = file.editable && typeof files[file.path] === 'string' ? files[file.path] : file.text;
    planned.push({path: file.path, text});
  }
  return planned.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
}

export async function buildProjectZip(project, files) {
  const root = exportRoot(project);
  const data = {};
  for (const entry of planExport(project, files)) data[`${root}/${entry.path}`] = strToU8(entry.text);
  const bytes = zipSync(data, {level: 6, mtime: FIXED_TIME});
  return new Blob([bytes], {type: 'application/zip'});
}
