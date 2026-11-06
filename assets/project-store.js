// 월말평가 Web 프로젝트 응시 기록을 IndexedDB에 저장합니다.
// 여러 파일의 코드가 매 입력마다 오가므로 localStorage 대신 쓰고, 기존 'algorithm-notes:v1'과 저장소를 나눕니다.
import {validateProjectAttempt} from './project-attempt.js';

export const DB_NAME = 'study-space:project-attempts:v1';
export const STORE = 'attempts';
export const LIMITS = {fileBytes: 256 * 1024, attemptBytes: 2 * 1024 * 1024, attempts: 20};

const byteLength = (text) => new TextEncoder().encode(text).length;

// 한도를 넘으면 이유를 돌려줍니다. 호출한 쪽은 메모리의 코드를 그대로 두고 사용자에게 알려야 합니다.
export function checkLimits(attempt) {
  for (const [path, text] of Object.entries(attempt.files || {})) {
    if (byteLength(text) > LIMITS.fileBytes) return {reason: 'file-too-large', path};
  }
  if (byteLength(JSON.stringify(attempt)) > LIMITS.attemptBytes) return {reason: 'too-large'};
  return null;
}

// 저장 버전을 뺀 내용이 같으면 같은 응시입니다.
export function sameAttempt(a, b) {
  return JSON.stringify(canonical(a, true)) === JSON.stringify(canonical(b, true));
}

function canonical(value, top = false) {
  if (Array.isArray(value)) return value.map((v) => canonical(v));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).filter((k) => !(top && k === 'saveVersion')).sort().map((k) => [k, canonical(value[k])]));
  }
  return value;
}

export function createProjectStore(indexedDB) {
  let opening = null;

  function open() {
    if (!indexedDB) return Promise.reject(new Error('unavailable'));
    if (!opening) {
      opening = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, {keyPath: 'attemptId'});
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error('open failed'));
        request.onblocked = () => reject(new Error('blocked'));
      });
      opening.catch(() => { opening = null; });
    }
    return opening;
  }

  // work(objectStore, finish)로 요청을 이어 보내고 finish(값)을 부르면 트랜잭션이 끝난 뒤 그 값을 돌려줍니다.
  async function run(mode, work) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, mode);
      let outcome;
      tx.oncomplete = () => resolve(outcome);
      tx.onerror = () => reject(tx.error || new Error('transaction failed'));
      tx.onabort = () => reject(tx.error || new Error('transaction aborted'));
      work(tx.objectStore(STORE), (value) => { outcome = value; });
    });
  }

  const read = (mode, makeRequest) => run(mode, (os, finish) => {
    const request = makeRequest(os);
    request.onsuccess = () => finish(request.result);
  });

  async function save(attempt, {expectedVersion}) {
    const limit = checkLimits(attempt);
    if (limit) return {saved: false, ...limit};
    try {
      await open();
    } catch {
      return {saved: false, reason: 'unavailable'};
    }
    try {
      return await run('readwrite', (os, finish) => {
        const found = os.get(attempt.attemptId);
        found.onsuccess = () => {
          const existing = found.result;
          if (existing) {
            if (existing.saveVersion !== expectedVersion) return finish({saved: false, conflict: true, latest: existing});
            os.put({...attempt, saveVersion: expectedVersion + 1});
            return finish({saved: true, saveVersion: expectedVersion + 1});
          }
          if (expectedVersion !== 0) return finish({saved: false, conflict: true, latest: null});
          const counted = os.count();
          counted.onsuccess = () => {
            if (counted.result >= LIMITS.attempts) return finish({saved: false, reason: 'too-many'});
            os.put({...attempt, saveVersion: 1});
            return finish({saved: true, saveVersion: 1});
          };
        };
      });
    } catch {
      return {saved: false, reason: 'storage-error'};
    }
  }

  async function list() {
    const all = await read('readonly', (os) => os.getAll());
    return all.sort((a, b) => b.startedAt - a.startedAt);
  }

  async function importValidated(attempts, {overwrite = false} = {}) {
    for (const attempt of attempts) {
      if (!validateProjectAttempt(attempt).valid) return {saved: false, reason: 'invalid'};
      const limit = checkLimits(attempt);
      if (limit) return {saved: false, ...limit};
    }
    try {
      await open();
    } catch {
      return {saved: false, reason: 'unavailable'};
    }
    try {
      return await run('readwrite', (os, finish) => {
        const all = os.getAll();
        all.onsuccess = () => {
          const existing = new Map(all.result.map((a) => [a.attemptId, a]));
          const conflicts = attempts.filter((a) => existing.has(a.attemptId) && !sameAttempt(existing.get(a.attemptId), a)).map((a) => a.attemptId);
          if (conflicts.length && !overwrite) return finish({saved: false, conflicts});
          const total = new Set([...existing.keys(), ...attempts.map((a) => a.attemptId)]).size;
          if (total > LIMITS.attempts) return finish({saved: false, reason: 'too-many'});
          let imported = 0;
          let skipped = 0;
          for (const attempt of attempts) {
            const current = existing.get(attempt.attemptId);
            if (current && sameAttempt(current, attempt)) { skipped += 1; continue; }
            os.put({...attempt, saveVersion: current ? current.saveVersion + 1 : Math.max(1, attempt.saveVersion)});
            imported += 1;
          }
          return finish({saved: true, imported, skipped});
        };
      });
    } catch {
      return {saved: false, reason: 'storage-error'};
    }
  }

  return {
    available: !!indexedDB,
    list,
    exportAll: list,
    load: async (id) => (await read('readonly', (os) => os.get(id))) ?? null,
    remove: (id) => run('readwrite', (os) => { os.delete(id); }),
    save,
    importValidated,
  };
}

let database;
try {
  database = globalThis.indexedDB;
} catch { /* 개인정보 보호 모드 등에서는 접근이 막힐 수 있습니다 */ }
export const projectStore = createProjectStore(database);
