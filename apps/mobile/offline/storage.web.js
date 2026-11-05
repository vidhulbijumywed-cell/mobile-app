// IndexedDB is used for the browser development target; native builds use SQLite.
let connection;
function db() {
  if (!connection) connection = new Promise((resolve,reject) => {
    const request = indexedDB.open('fitpilot-development',1);
    request.onupgradeneeded = () => request.result.createObjectStore('state');
    request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
  }); return connection;
}
export async function read(key) {
  const d = await db(); return new Promise((resolve,reject) => {
    const tx = d.transaction('state','readonly'); const request = tx.objectStore('state').get(key);
    request.onsuccess = () => resolve(request.result ?? null); request.onerror = () => reject(request.error);
  });
}
export async function mutate(key, update) {
  const d = await db(); return new Promise((resolve,reject) => {
    const tx = d.transaction('state','readwrite'); const store = tx.objectStore('state'); let result;
    const request = store.get(key);
    request.onsuccess = () => { try { result = update(request.result ?? null); store.put(result,key); } catch (e) { tx.abort(); reject(e); } };
    tx.oncomplete = () => resolve(result); tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error || new Error('Local save aborted'));
  });
}
