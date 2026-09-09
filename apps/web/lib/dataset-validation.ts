import type { Dataset } from '../../../packages/contracts';
import { decodeDataset } from './decode-dataset';

interface Job {
  metadata: unknown; bytes?: ArrayBuffer; compressed: boolean; signal?: AbortSignal;
  resolve: (value: Dataset) => void; reject: (reason: Error) => void; abort: () => void;
}
/** One decode at a time bounds transient decoded geometry; no parsed national-data cache.
 * The worker exits after idle/unmount cancellation. A no-Worker browser retains validation. */
class DatasetValidationQueue {
  private worker: Worker | null = null;
  private queue: Job[] = [];
  private active: Job | null = null;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private timeout: ReturnType<typeof setTimeout> | undefined;
  run(metadata: unknown, bytes: ArrayBuffer | undefined, compressed: boolean, signal?: AbortSignal): Promise<Dataset> {
    signal?.throwIfAborted();
    if (typeof Worker === 'undefined') return decodeDataset(metadata, bytes, compressed).then(data => { signal?.throwIfAborted(); return data; });
    if (this.queue.length >= 64 || this.queue.reduce((n, job) => n + (job.bytes?.byteLength ?? 0), bytes?.byteLength ?? 0) > 16_777_216) return Promise.reject(new Error('Dataset validation queue is full. Retry after current layers finish.'));
    return new Promise((resolve, reject) => {
      const job: Job = { metadata, bytes, compressed, signal, resolve, reject, abort: () => {} };
      job.abort = () => {
        if (this.active === job) {
          this.stop(); this.active = null;
        } else this.queue = this.queue.filter(item => item !== job);
        signal?.removeEventListener('abort', job.abort);
        reject(new DOMException('Aborted', 'AbortError')); this.next();
      };
      signal?.addEventListener('abort', job.abort, { once: true }); this.queue.push(job); this.next();
    });
  }
  private stop() {
    clearTimeout(this.timer); clearTimeout(this.timeout);
    this.worker?.terminate(); this.worker = null;
  }
  private complete(data?: Dataset, error?: Error) {
    const job = this.active; if (!job) return;
    clearTimeout(this.timeout); this.active = null;
    job.signal?.removeEventListener('abort', job.abort);
    if (error) job.reject(error); else job.resolve(data!);
    this.next();
  }
  private next() {
    clearTimeout(this.timer);
    if (this.active) return;
    const job = this.queue.shift();
    if (!job) { this.timer = setTimeout(() => this.stop(), 5000); return; }
    this.active = job;
    try {
      if (!this.worker) {
        const worker = new Worker(new URL('./dataset.worker.ts', import.meta.url), { type: 'module' });
        this.worker = worker;
        worker.onmessage = event => { if (this.worker === worker) this.complete(event.data.data, event.data.error ? new Error(event.data.error) : undefined); };
        worker.onerror = () => { if (this.worker === worker) { this.stop(); this.complete(undefined, new Error('Dataset validation worker failed. Retry this dataset.')); } };
      }
      this.timeout = setTimeout(() => { this.stop(); this.complete(undefined, new Error('Dataset validation timed out. Retry this dataset.')); }, 60000);
      this.worker.postMessage({ metadata: job.metadata, bytes: job.bytes, compressed: job.compressed }, job.bytes ? [job.bytes] : []);
      job.bytes = undefined;
    } catch (error) { this.stop(); this.complete(undefined, error instanceof Error ? error : new Error('Validation worker unavailable')); }
  }
}
export const datasetValidation = new DatasetValidationQueue();
