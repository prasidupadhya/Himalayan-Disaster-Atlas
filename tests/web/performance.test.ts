import Ajv from 'ajv';
import { readFileSync } from 'node:fs';
import { gunzipSync, gzipSync } from 'node:zlib';
import { describe, expect, it, vi } from 'vitest';
import { lazyValidator } from '../../packages/contracts/lazy-validator';
import { VerifiedByteCache } from '../../apps/web/lib/verified-byte-cache';
import { parseDataset } from '../../packages/contracts';
import { buildRiverNetwork, traceDownstream } from '../../packages/contracts/downstream';
import { decodeDataset } from '../../apps/web/lib/decode-dataset';

describe('performance without weakened validation', () => {
  it('keeps decoded-size and geographic safety checks in the worker decoder', async () => {
    const metadata = JSON.parse(readFileSync('data/releases/nepal-admin-country/2.0.1/manifest.json', 'utf8'));
    const raw = gunzipSync(readFileSync('data/releases/nepal-admin-country/2.0.1/features.geojson.gz'));
    const input = JSON.parse(raw.toString());
    const bytes = Uint8Array.from(raw).buffer;
    expect((await decodeDataset(metadata, bytes)).collection).toEqual(input);
    const bomb = Uint8Array.from(gzipSync(' '.repeat(8_388_609))).buffer;
    await expect(decodeDataset(metadata, bomb, true)).rejects.toThrow('decoded budget');
    input.features[0].geometry = { type: 'Polygon', coordinates: [[[0, 0], [1, 0], [1, 1], [0, 0]]] };
    await expect(decodeDataset(metadata, new TextEncoder().encode(JSON.stringify(input)).buffer)).rejects.toThrow('outside coverage');
  });
  it('compiles a schema once on demand and retains validation errors', () => {
    const compile = vi.fn(() => new Ajv().compile<{ value: number }>({ type: 'object', required: ['value'], properties: { value: { type: 'number' } }, additionalProperties: false }));
    const validate = lazyValidator(compile);
    expect(compile).not.toHaveBeenCalled();
    expect(validate({ value: 'invented' })).toBe(false); expect(validate.errors?.length).toBeGreaterThan(0);
    expect(validate({ value: 0 })).toBe(true); expect(validate.errors).toBeNull(); expect(compile).toHaveBeenCalledTimes(1);
  });
  it('deduplicates verified bytes, returns independent copies and evicts by bytes', async () => {
    const cache = new VerifiedByteCache(4);
    const load = vi.fn(async () => new Uint8Array([1, 2, 3, 4]));
    const [a, b] = await Promise.all([cache.get('hash-A', load), cache.get('hash-A', load)]);
    expect(load).toHaveBeenCalledTimes(1); a[0] = 99; expect(b[0]).toBe(1);
    expect((await cache.get('hash-A', load))[0]).toBe(1);
    await cache.get('hash-B', load); expect(cache.byteSize).toBe(4);
    await cache.get('hash-A', load); expect(load).toHaveBeenCalledTimes(3);
  });
  it('one aborted subscriber cannot cancel another, and failures never populate cache', async () => {
    const cache = new VerifiedByteCache(16), controller = new AbortController();
    let resolve!: (v: Uint8Array<ArrayBuffer>) => void;
    const load = vi.fn(() => new Promise<Uint8Array<ArrayBuffer>>(r => { resolve = r; }));
    const a = cache.get('shared', load, controller.signal), b = cache.get('shared', load);
    const rejected = expect(a).rejects.toThrow('Aborted');
    await Promise.resolve(); controller.abort(); resolve(new Uint8Array([1]));
    await rejected; expect(await b).toEqual(new Uint8Array([1]));
    const fail = vi.fn(async (): Promise<Uint8Array<ArrayBuffer>> => { throw new Error('Checksum failed'); });
    await expect(cache.get('bad', fail)).rejects.toThrow('Checksum');
    await expect(cache.get('bad', fail)).rejects.toThrow('Checksum'); expect(fail).toHaveBeenCalledTimes(2);
    expect(cache.byteSize).toBe(1);
  });
  it('cancels unobserved work without caching it, and permits a fresh retry', async () => {
    const cache = new VerifiedByteCache(16), controller = new AbortController();
    let shared!: AbortSignal; let resolve!: (v: Uint8Array<ArrayBuffer>) => void;
    const pending = cache.get('key', signal => { shared = signal; return new Promise(r => { resolve = r; }); }, controller.signal);
    const rejected = expect(pending).rejects.toThrow('Aborted');
    await Promise.resolve(); controller.abort(); await rejected; expect(shared.aborted).toBe(true);
    resolve(new Uint8Array([8])); await Promise.resolve(); await Promise.resolve(); expect(cache.byteSize).toBe(0);
    expect(await cache.get('key', async () => new Uint8Array([9]))).toEqual(new Uint8Array([9]));
  });
  it('validates the complete Nepal network without changing scientific values and profiles repeated tracing', () => {
    const start = performance.now();
    const raw = ['nepal-rivers-primary', 'nepal-rivers-headwaters'].map(id => ({
      metadata: JSON.parse(readFileSync(`data/releases/${id}/1.0.0/manifest.json`, 'utf8')),
      collection: JSON.parse(gunzipSync(readFileSync(`data/releases/${id}/1.0.0/features.geojson.gz`)).toString()),
    }));
    const snapshot = JSON.stringify(raw);
    const graph = buildRiverNetwork(raw.map(parseDataset));
    expect(JSON.stringify(raw)).toBe(snapshot); expect(graph.reaches.size).toBe(18299);
    const ready = performance.now();
    for (let i = 0; i < 100; i++) {
      const result = traceDownstream(graph, '40669746');
      expect(result.reach_ids).toHaveLength(180); expect(result.total_length_km).toBe(517.97); expect(result.next_reach_id).toBe('40768704');
    }
    console.info(JSON.stringify({ workload: 'Nepal full network', prepare_ms: ready - start, hundred_traces_ms: performance.now() - ready }));
  });
});
