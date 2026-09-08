/** Resolved immutable bytes only: aborted/failed requests never enter the LRU. */
export class ArtifactCache {
  private entries = new Map<string, Uint8Array<ArrayBuffer>>();
  private used = 0;
  constructor(readonly budget = 16 * 1024 * 1024) {}
  get(key: string) {
    const value = this.entries.get(key);
    if (!value) return undefined;
    this.entries.delete(key); this.entries.set(key, value);
    return value.slice();
  }
  set(key: string, bytes: Uint8Array<ArrayBuffer>) {
    const previous = this.entries.get(key);
    if (previous) { this.used -= previous.byteLength; this.entries.delete(key); }
    if (bytes.byteLength > this.budget) return;
    while (this.used + bytes.byteLength > this.budget) {
      const oldest = this.entries.keys().next().value;
      if (oldest === undefined) break;
      this.used -= this.entries.get(oldest)!.byteLength; this.entries.delete(oldest);
    }
    this.entries.set(key, bytes.slice()); this.used += bytes.byteLength;
  }
  get byteSize() { return this.used; }
}
export const temporalCache = new ArtifactCache();
