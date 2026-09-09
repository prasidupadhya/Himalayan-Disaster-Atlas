import { ArtifactCache } from './temporal-cache';

/** The loader must verify bytes before resolving. Identity includes path, hash and size.
 * Only bytes are shared; consumers always receive independent transferable copies. */
export class VerifiedByteCache {
  private cache: ArtifactCache;
  private pending = new Map<string, { controller: AbortController; promise: Promise<Uint8Array<ArrayBuffer>>; users: number }>();
  constructor(budget: number) { this.cache = new ArtifactCache(budget); }
  get byteSize() { return this.cache.byteSize; }
  async get(key: string, load: (signal: AbortSignal) => Promise<Uint8Array<ArrayBuffer>>, signal?: AbortSignal): Promise<Uint8Array<ArrayBuffer>> {
    signal?.throwIfAborted();
    const cached = this.cache.get(key);
    if (cached) return cached;
    let entry = this.pending.get(key);
    if (!entry) {
      const controller = new AbortController();
      const promise = Promise.resolve().then(() => load(controller.signal)).then(bytes => {
        controller.signal.throwIfAborted();
        this.cache.set(key, bytes);
        return bytes;
      });
      entry = { controller, promise, users: 0 };
      this.pending.set(key, entry);
    }
    const active = entry; active.users++;
    return new Promise((resolve, reject) => {
      let settled = false;
      const finish = () => {
        if (settled) return false;
        settled = true; signal?.removeEventListener('abort', abort); active.users--;
        if (!active.users) {
          active.controller.abort();
          if (this.pending.get(key) === active) this.pending.delete(key);
        }
        return true;
      };
      const abort = () => { if (finish()) reject(new DOMException('Aborted', 'AbortError')); };
      signal?.addEventListener('abort', abort, { once: true });
      active.promise.then(bytes => { if (finish()) resolve(bytes.slice()); }, error => { if (finish()) reject(error); });
    });
  }
}
