// 테스트 전용 IndexedDB 대역입니다. 프로젝트 저장소가 쓰는 부분집합만 구현합니다.
// 트랜잭션은 요청 콜백 안에서 이어지는 요청이 있는 동안 살아 있고, 중단하면 쓰기를 되돌립니다.
export function createFakeIndexedDB() {
  const databases = new Map();
  const control = {failWrites: null, openError: false};

  function request() {
    return {result: undefined, error: null, onsuccess: null, onerror: null};
  }

  function openDatabase(record) {
    return {
      objectStoreNames: {contains: (name) => record.stores.has(name)},
      createObjectStore(name, options) {
        record.stores.set(name, {keyPath: options.keyPath, data: new Map()});
      },
      close() {},
      transaction(names, mode) {
        const list = Array.isArray(names) ? names : [names];
        const backup = new Map();
        const tx = {
          mode, error: null, oncomplete: null, onerror: null, onabort: null,
          pending: 0, finished: false, aborted: false,
          objectStore(name) {
            const store = record.stores.get(name);
            if (!store) throw new Error('NotFoundError');
            return storeApi(tx, name, store, backup);
          },
          abort() {
            if (tx.finished) return;
            rollback();
            tx.aborted = true;
            tx.finished = true;
            setTimeout(() => tx.onabort?.({target: tx}), 0);
          },
        };
        function rollback() {
          for (const [name, saved] of backup) record.stores.get(name).data = saved;
        }
        tx.rollback = rollback;
        tx.list = list;
        const schedule = () => setTimeout(() => {
          if (!tx.finished && tx.pending === 0) {
            tx.finished = true;
            tx.oncomplete?.({target: tx});
          }
        }, 0);
        tx.schedule = schedule;
        schedule();
        return tx;
      },
    };
  }

  function storeApi(tx, name, store, backup) {
    function run(action, write) {
      const req = request();
      tx.pending += 1;
      setTimeout(() => {
        if (tx.finished) return;
        try {
          if (write) {
            if (tx.mode !== 'readwrite') throw new Error('ReadOnlyError');
            if (!backup.has(name)) backup.set(name, new Map(store.data));
            if (control.failWrites?.(name)) {
              const failure = new Error('QuotaExceededError');
              failure.name = 'QuotaExceededError';
              throw failure;
            }
          }
          req.result = action();
          req.onsuccess?.({target: req});
        } catch (error) {
          req.error = error;
          tx.error = error;
          tx.rollback();
          tx.finished = true;
          tx.aborted = true;
          req.onerror?.({target: req});
          setTimeout(() => tx.onabort?.({target: tx}), 0);
          return;
        }
        tx.pending -= 1;
        if (tx.pending === 0) tx.schedule();
      }, 0);
      return req;
    }
    return {
      get: (key) => run(() => (store.data.has(key) ? structuredClone(store.data.get(key)) : undefined), false),
      getAll: () => run(() => [...store.data.values()].map((v) => structuredClone(v)), false),
      count: () => run(() => store.data.size, false),
      put: (value) => run(() => { store.data.set(value[store.keyPath], structuredClone(value)); return value[store.keyPath]; }, true),
      delete: (key) => run(() => { store.data.delete(key); }, true),
      clear: () => run(() => { store.data.clear(); }, true),
    };
  }

  return {
    control,
    open(name, version) {
      const req = {...request(), onupgradeneeded: null, onblocked: null};
      setTimeout(() => {
        if (control.openError) {
          req.error = new Error('open failed');
          req.onerror?.({target: req});
          return;
        }
        let record = databases.get(name);
        if (!record) {
          record = {version: 0, stores: new Map()};
          databases.set(name, record);
        }
        req.result = openDatabase(record);
        if (record.version < version) {
          record.version = version;
          req.onupgradeneeded?.({target: req});
        }
        req.onsuccess?.({target: req});
      }, 0);
      return req;
    },
  };
}
