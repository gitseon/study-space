// 월말평가 프로젝트를 트랙별로 찾는 규칙. 홈과 프로젝트 화면이 같은 규칙을 씁니다.
// 기존 backend 링크(?project=web-01)와 track이 없는 옛 응시·백업은 backend로 읽습니다. 그 밖의 경우에 backend로 조용히 바꾸지 않습니다.
import {EDITOR_NOTICE, ENV_NOTICE} from './project-notices.js';

const DEFAULT_TRACK = 'backend';
const own = (object, key) => (object && Object.prototype.hasOwnProperty.call(object, key) ? object[key] : undefined);

// 메타데이터가 없는 프로젝트(backend)는 지금까지의 문구를 그대로 씁니다.
const BACKEND_TEXT = {
  lead: '제공된 MVC 템플릿의 비어 있는 부분을 직접 채워 목록, 등록, 상세와 로그인, 로그아웃을 연결합니다.',
  stageInfo: {
    1: '전체 코드가 주어지고 비어 있는 부분만 채웁니다.',
    2: '메서드 시그니처와 JSP의 정적 틀이 주어지고 본문과 동적 블록을 작성합니다.',
    3: '작성 대상 파일을 처음부터 구현합니다. 설정, DTO, DB 연결은 제공됩니다.',
  },
};

export function projectCatalogFor(manifest, track) {
  const listed = own(manifest?.projectTracks, track);
  if (listed) return listed;
  return track === DEFAULT_TRACK && manifest?.webProjects ? manifest.webProjects : null;
}

export function projectTrackIds(manifest) {
  const ids = Object.keys(manifest?.projectTracks || {});
  if (!ids.includes(DEFAULT_TRACK) && manifest?.webProjects) ids.unshift(DEFAULT_TRACK);
  return ids.sort((a, b) => (a === DEFAULT_TRACK ? -1 : b === DEFAULT_TRACK ? 1 : a.localeCompare(b)));
}

// 트랙마다 목록을 한 번만 받습니다. 실패한 요청은 기억하지 않아 다시 시도할 수 있습니다.
export function createCatalogLoader(fetchJson) {
  const cache = new Map();
  return {
    load(manifest, track) {
      const catalog = projectCatalogFor(manifest, track);
      if (!catalog) return Promise.resolve(null);
      if (!cache.has(track)) {
        const pending = Promise.resolve().then(() => fetchJson(catalog.file));
        pending.catch(() => cache.delete(track));
        cache.set(track, pending);
      }
      return cache.get(track);
    },
  };
}

// 트랙을 바꾼 뒤 늦게 도착한 이전 요청의 결과가 현재 화면을 덮지 않게 순번으로 가립니다.
export function latestGuard() {
  let current = 0;
  return {
    next() { current += 1; return current; },
    isCurrent(token) { return token === current; },
  };
}

export async function resolveProject({manifest, loader, track, projectId}) {
  const tracks = projectTrackIds(manifest);
  if (!tracks.length) throw new Error('월말평가 프로젝트 데이터가 없습니다');
  if (track) {
    const index = await loader.load(manifest, track);
    if (!index) throw new Error('이 과목에는 월말평가 프로젝트가 없습니다');
    const entry = projectId ? index.projects.find((p) => p.id === projectId) : index.projects[0];
    if (!entry) throw new Error('주소의 과목과 프로젝트가 서로 맞지 않습니다');
    return {track, index, entry};
  }
  if (!projectId) {
    const index = await loader.load(manifest, tracks[0]);
    return {track: tracks[0], index, entry: index.projects[0]};
  }
  for (const id of tracks) {
    const index = await loader.load(manifest, id);
    const entry = index?.projects.find((p) => p.id === projectId);
    if (entry) return {track: id, index, entry};
  }
  throw new Error('주소의 프로젝트를 찾을 수 없습니다');
}

export function attemptTrack(attempt) {
  return attempt?.track || attempt?.projectSnapshot?.track || DEFAULT_TRACK;
}

// source: 목록 항목, 프로젝트 JSON, 응시 스냅샷 중 하나.
export function presentationOf(source) {
  const p = source?.presentation || {};
  return {
    lead: p.lead || BACKEND_TEXT.lead,
    stageInfo: {...BACKEND_TEXT.stageInfo, ...(p.stageInfo || {})},
    envNotice: p.envNotice || ENV_NOTICE,
    editorNotice: p.editorNotice || EDITOR_NOTICE,
    verificationLabel: source?.verification?.label || '',
  };
}

export function projectHref({track, project, stage, minutes}) {
  const query = new URLSearchParams();
  if (track && track !== DEFAULT_TRACK) query.set('track', track);
  query.set('project', project);
  query.set('stage', String(stage));
  query.set('minutes', String(minutes));
  return 'pages/project.html?' + query;
}
