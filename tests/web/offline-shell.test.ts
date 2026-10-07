import { describe, expect, it, vi } from 'vitest';
import { createHash, webcrypto } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import vm from 'node:vm';
import { prepareServiceWorker, shellUrls, verifyServiceWorker } from '../../scripts/prepare-service-worker.mjs';
import { lastKnownDelivery, loadLivePublication } from '../../apps/web/lib/live';
import { buildBulletin, feedView, freshnessText } from '../../apps/web/lib/live-conditions';
import policy from '../../packages/contracts/offline-shell-policy.json';
import { conditionsFixture, GFS_PATH, NORMAL_NOW, STALE_NOW, USGS_PATH } from '../helpers/live-conditions';

const ORIGIN = 'https://atlas.test';
const TEMPLATE = readFileSync('apps/web/service-worker/sw.template.js', 'utf8');
const sha = (raw: string | Buffer) => createHash('sha256').update(raw).digest('hex');
type Init = { status: number; headers: [string, string][] };

class MemoryCache {
  entries = new Map<string, { body: ArrayBuffer; init: Init }>();
  key(request: Request | string) { const url = new URL(typeof request === 'string' ? request : request.url, ORIGIN); return url.pathname + url.search; }
  async match(request: Request | string, options?: { ignoreSearch?: boolean }) {
    const key = this.key(request);
    const hit = options?.ignoreSearch ? [...this.entries].find(([name]) => name.split('?')[0] === key.split('?')[0])?.[1] : this.entries.get(key);
    return hit ? new Response(hit.body.slice(0), hit.init) : undefined;
  }
  async put(request: Request | string, response: Response) { this.entries.set(this.key(request), { body: await response.arrayBuffer(), init: { status: response.status, headers: [...response.headers] } }); }
  async delete(request: Request | string) { return this.entries.delete(this.key(request)); }
  async keys() { return [...this.entries.keys()].map(key => new Request(ORIGIN + key)); }
}
class MemoryStorage {
  caches = new Map<string, MemoryCache>();
  async open(name: string) { if (!this.caches.has(name)) this.caches.set(name, new MemoryCache()); return this.caches.get(name)!; }
  async keys() { return [...this.caches.keys()]; }
  async delete(name: string) { return this.caches.delete(name); }
}

type Network = (url: string) => Promise<Response>;
function boot({ shell = [] as Array<{ url: string; bytes: number; sha256: string; type: string }>, network, now = Date.parse(NORMAL_NOW), active = false, timeout = 200 }: { shell?: Array<{ url: string; bytes: number; sha256: string; type: string }>; network: Network; now?: number; active?: boolean; timeout?: number }) {
  const handlers: Record<string, (event: unknown) => void> = {};
  const storage = new MemoryStorage();
  const clock = { now };
  class FakeDate extends Date { static now() { return clock.now; } }
  const self = { addEventListener: (type: string, handler: (event: unknown) => void) => { handlers[type] = handler; }, location: { origin: ORIGIN }, registration: { active: active ? {} : null }, skipWaiting: vi.fn(async () => undefined), clients: { claim: vi.fn(async () => undefined) } };
  const state = { network };
  const fetch = vi.fn((input: Request | { url: string }) => { const url = new URL(input.url, ORIGIN); return state.network(url.pathname + url.search); });
  // Inside a worker, relative URLs resolve against its origin; Node needs that base explicitly.
  class WorkerRequest extends Request { constructor(input: RequestInfo | URL, init?: RequestInit) { super(typeof input === 'string' ? new URL(input, ORIGIN) : input, init); } }
  const config = { version: 'test-1', shell, liveRetentionSeconds: policy.live_retention_seconds, networkTimeoutMs: timeout, staticEntries: 2 };
  const source = TEMPLATE.replace(/\/\*@atlas-config\*\/[\s\S]*?\/\*@end\*\//, `/*@atlas-config*/ ${JSON.stringify(config)} /*@end*/`);
  vm.runInContext(source, vm.createContext({ self, caches: storage, fetch, crypto: webcrypto, Request: WorkerRequest, Response, Headers, URL, TextDecoder, setTimeout, clearTimeout, Date: FakeDate }));
  const waitUntil = async (type: string, event: object = {}) => { let pending: Promise<unknown> | undefined; handlers[type]({ ...event, waitUntil: (promise: Promise<unknown>) => { pending = promise; } }); await pending; };
  const request = async (path: string, mode = 'cors') => {
    let pending: Promise<Response> | undefined;
    handlers.fetch({ request: { url: ORIGIN + path, method: 'GET', mode }, respondWith: (promise: Promise<Response>) => { pending = promise; } });
    return pending ? await pending : undefined;
  };
  return { self, storage, clock, fetch, setNetwork: (next: Network) => { state.network = next; }, install: () => waitUntil('install'), activate: () => waitUntil('activate'), request, message: (data: unknown) => handlers.message({ data }) };
}
const offline: Network = async () => { throw new TypeError('Failed to fetch'); };
function liveNetwork(f = conditionsFixture()): Network {
  return async path => new Response(path === '/live/latest.json' ? JSON.stringify(f.index) : path === USGS_PATH ? f.usgsRaw : path === GFS_PATH ? f.gfsRaw : path === USGS_PATH.replace('snapshot', 'manifest') ? '{"manifest":true}' : 'missing', { status: [USGS_PATH, GFS_PATH, '/live/latest.json', USGS_PATH.replace('snapshot', 'manifest')].includes(path) ? 200 : 404 });
}
async function primed(sw: ReturnType<typeof boot>) {
  for (const path of ['/live/latest.json', USGS_PATH, GFS_PATH]) expect((await sw.request(path))!.status).toBe(200);
}

describe('service worker install, versioning and upgrade', () => {
  const page = '<html>shell</html>';
  const shell = [{ url: '/live/', bytes: page.length, sha256: sha(page), type: 'text/html' }];
  it('installs only a checksum-verified shell and activates immediately on first install', async () => {
    const sw = boot({ shell, network: async () => new Response(page) });
    await sw.install();
    expect(await (await sw.storage.open('atlas-shell-test-1')).match('/live/')).toBeDefined();
    expect(sw.self.skipWaiting).toHaveBeenCalledTimes(1);
  });
  it('rejects a shell whose bytes differ and stores nothing', async () => {
    const sw = boot({ shell, network: async () => new Response('<html>tampered</html>') });
    await expect(sw.install()).rejects.toThrow('Shell');
    expect(sw.storage.caches.get('atlas-shell-test-1')?.entries.size ?? 0).toBe(0);
  });
  it('waits for an explicit reload request before replacing an active version', async () => {
    const sw = boot({ shell, network: async () => new Response(page), active: true });
    await sw.install();
    expect(sw.self.skipWaiting).not.toHaveBeenCalled();
    sw.message({ type: 'ATLAS_SKIP_WAITING' });
    expect(sw.self.skipWaiting).toHaveBeenCalledTimes(1);
  });
  it('removes superseded atlas caches on activation and leaves other caches alone', async () => {
    const sw = boot({ network: offline });
    for (const name of ['atlas-shell-old', 'atlas-live-v0', 'atlas-static-v1', 'atlas-live-v1', 'other-app']) await sw.storage.open(name);
    await sw.activate();
    expect((await sw.storage.keys()).sort()).toEqual(['atlas-live-v1', 'atlas-static-v1', 'other-app']);
    expect(sw.self.clients.claim).toHaveBeenCalled();
  });
});

describe('network-first live data with last-known fallback', () => {
  it('passes network responses through unchanged and stores verified copies', async () => {
    const sw = boot({ network: liveNetwork() });
    const response = (await sw.request('/live/latest.json'))!;
    expect(response.headers.get('x-atlas-delivery')).toBeNull();
    await sw.request(USGS_PATH); await sw.request(GFS_PATH);
    expect([...(await sw.storage.open('atlas-live-v1')).entries.keys()].sort()).toEqual([USGS_PATH, GFS_PATH, '/live/latest.json'].sort());
  });
  it('serves stored copies offline marked last-known with the time they were saved', async () => {
    const sw = boot({ network: liveNetwork() });
    await primed(sw);
    sw.clock.now += 3_600_000;
    sw.setNetwork(offline);
    for (const path of ['/live/latest.json', USGS_PATH, GFS_PATH]) {
      const response = (await sw.request(path))!;
      expect(response.status).toBe(200);
      expect(response.headers.get('x-atlas-delivery')).toBe('last-known');
      expect(response.headers.get('x-atlas-cached-at')).toBe(new Date(Date.parse(NORMAL_NOW)).toISOString());
    }
  });
  it('treats any HTTP answer as current and never substitutes a stored copy for it', async () => {
    const sw = boot({ network: liveNetwork() });
    await primed(sw);
    sw.setNetwork(async () => new Response('gone', { status: 404 }));
    const response = (await sw.request('/live/latest.json'))!;
    expect(response.status).toBe(404);
    expect(response.headers.get('x-atlas-delivery')).toBeNull();
  });
  it('falls back after the network timeout', async () => {
    const sw = boot({ network: liveNetwork(), timeout: 20 });
    await primed(sw);
    sw.setNetwork(() => new Promise<Response>(() => undefined));
    expect((await sw.request('/live/latest.json'))!.headers.get('x-atlas-delivery')).toBe('last-known');
  });
  it('never stores a snapshot that differs from its index reference', async () => {
    const f = conditionsFixture();
    const sw = boot({ network: async path => path === GFS_PATH ? new Response('{"tampered":true}') : liveNetwork(f)(path) });
    await sw.request('/live/latest.json');
    expect((await sw.request(GFS_PATH))!.status).toBe(200);
    expect((await sw.storage.open('atlas-live-v1')).entries.has(GFS_PATH)).toBe(false);
  });
  it('purges a corrupted stored copy instead of serving it', async () => {
    const sw = boot({ network: liveNetwork() });
    await primed(sw);
    const cache = await sw.storage.open('atlas-live-v1');
    const entry = cache.entries.get(USGS_PATH)!;
    cache.entries.set(USGS_PATH, { ...entry, body: new TextEncoder().encode('{"corrupt":true}').buffer as ArrayBuffer });
    sw.setNetwork(offline);
    expect((await sw.request(USGS_PATH))!.status).toBe(503);
    expect(cache.entries.has(USGS_PATH)).toBe(false);
  });
  it('deletes expired copies and never serves them, as current or otherwise', async () => {
    const sw = boot({ network: liveNetwork() });
    await primed(sw);
    sw.setNetwork(offline);
    sw.clock.now += (policy.live_retention_seconds + 1) * 1000;
    const response = (await sw.request('/live/latest.json'))!;
    expect(response.status).toBe(503);
    expect(response.headers.get('x-atlas-delivery')).toBe('unavailable');
    expect(sw.storage.caches.has('atlas-live-v1')).toBe(false);
  });
  it('drops snapshots the new index no longer references', async () => {
    const sw = boot({ network: liveNetwork() });
    await primed(sw);
    sw.setNetwork(liveNetwork(conditionsFixture('normal', 'unavailable')));
    await sw.request('/live/latest.json');
    expect((await sw.storage.open('atlas-live-v1')).entries.has(GFS_PATH)).toBe(false);
  });
});

describe('navigation and static assets', () => {
  const pages = { '/live/': '<html>live</html>', '/offline/': '<html>offline</html>' };
  const shell = Object.entries(pages).map(([url, body]) => ({ url, bytes: body.length, sha256: sha(body), type: 'text/html' }));
  it('serves saved shell pages offline and the offline page for anything else', async () => {
    const sw = boot({ shell, network: async path => new Response(pages[path as keyof typeof pages] ?? 'x') });
    await sw.install();
    sw.setNetwork(offline);
    expect(await (await sw.request('/live/', 'navigate'))!.text()).toBe('<html>live</html>');
    expect(await (await sw.request('/live/index.html', 'navigate'))!.text()).toBe('<html>live</html>');
    expect(await (await sw.request('/atlas/', 'navigate'))!.text()).toBe('<html>offline</html>');
  });
  it('does not replace a slow page load with the offline page', async () => {
    const sw = boot({ shell, network: async path => new Response(pages[path as keyof typeof pages] ?? 'x'), timeout: 10 });
    await sw.install();
    sw.setNetwork(path => new Promise(resolve => setTimeout(() => resolve(new Response(`slow ${path}`)), 50)));
    expect(await (await sw.request('/atlas/', 'navigate'))!.text()).toBe('slow /atlas/');
  });
  it('bounds the runtime static cache', async () => {
    const sw = boot({ network: async () => Object.defineProperty(new Response('js'), 'type', { value: 'basic' }) });
    for (const name of ['a', 'b', 'c']) await sw.request(`/_next/static/chunks/${name}.js`);
    expect([...(await sw.storage.open('atlas-static-v1')).entries.keys()]).toEqual(['/_next/static/chunks/b.js', '/_next/static/chunks/c.js']);
  });
  it('caches immutable versioned data releases on use, bounded, and serves them offline', async () => {
    const sw = boot({ network: async path => Object.defineProperty(new Response(`bytes ${path}`), 'type', { value: 'basic' }) });
    const path = '/data/nepal-admin-country/2.0.1/manifest.json';
    expect(await (await sw.request(path))!.text()).toBe(`bytes ${path}`);
    sw.setNetwork(offline);
    expect(await (await sw.request(path))!.text()).toBe(`bytes ${path}`);
    expect([...(await sw.storage.open('atlas-data-v1')).entries.keys()]).toEqual([path]);
  });
  it('leaves unversioned data paths and other origins to the network', async () => {
    const sw = boot({ network: offline });
    expect(await sw.request('/data/README.txt')).toBeUndefined();
    expect(await sw.request('/data/nepal-admin-country/latest/manifest.json')).toBeUndefined();
  });
});

describe('build-time shell pinning', () => {
  function exportDir() {
    const out = mkdtempSync(`${tmpdir()}/atlas-sw-`);
    for (const page of policy.shell_pages) {
      const dir = `${out}${page}`; mkdirSync(dir, { recursive: true });
      writeFileSync(`${dir}index.html`, `<script src="/_next/static/chunks/app${page.replace(/\//g, '-')}.js"></script><link href="/_next/static/css/site.css">`);
      writeFileSync(`${dir}index.txt`, 'rsc');
    }
    mkdirSync(`${out}/_next/static/chunks`, { recursive: true }); mkdirSync(`${out}/_next/static/css`, { recursive: true });
    for (const page of policy.shell_pages) writeFileSync(`${out}/_next/static/chunks/app${page.replace(/\//g, '-')}.js`, 'js');
    writeFileSync(`${out}/_next/static/css/site.css`, 'css'); writeFileSync(`${out}/_next/static/chunks/827.map.js`, 'map chunk');
    mkdirSync(`${out}/vendor/maplibre-gl/6.7.0`, { recursive: true }); writeFileSync(`${out}/vendor/maplibre-gl/6.7.0/maplibre-gl-worker.mjs`, 'worker');
    writeFileSync(`${out}/icon.svg`, '<svg/>');
    return out;
  }
  const loadable = { 'features/live-conditions/live-conditions.tsx -> ./live-map': { files: ['static/chunks/827.map.js'] }, 'features/atlas/atlas.tsx -> ./x': { files: ['static/chunks/unrelated.js'] } };
  it('pins pages, page data and referenced assets; map code is opt-in by policy', () => {
    const out = exportDir();
    try {
      const urls = shellUrls(out, policy, loadable);
      expect(urls).toContain('/live/'); expect(urls).toContain('/live/index.txt'); expect(urls).toContain('/_next/static/css/site.css');
      // The checked-in policy keeps the large map library out of the first offline download.
      expect(urls).not.toContain('/_next/static/chunks/827.map.js'); expect(urls).not.toContain('/vendor/maplibre-gl/6.7.0/maplibre-gl-worker.mjs');
      const withMap = shellUrls(out, { ...policy, dynamic_imports: ['features/live-conditions/'], vendor_directories: ['vendor/maplibre-gl'] }, loadable);
      expect(withMap).toContain('/_next/static/chunks/827.map.js'); expect(withMap).toContain('/vendor/maplibre-gl/6.7.0/maplibre-gl-worker.mjs');
      expect(withMap).not.toContain('/_next/static/chunks/unrelated.js');
      const first = prepareServiceWorker(out, { loadable });
      expect(verifyServiceWorker(out).version).toBe(first.version);
      writeFileSync(`${out}/live/index.html`, readFileSync(`${out}/live/index.html`, 'utf8') + ' ');
      expect(() => verifyServiceWorker(out)).toThrow('checksums differ');
      expect(prepareServiceWorker(out, { loadable }).version).not.toBe(first.version);
    } finally { rmSync(out, { recursive: true, force: true }); }
  });
  it('fails the build when a shell page is missing', () => {
    const out = exportDir();
    try { rmSync(`${out}/offline`, { recursive: true }); expect(() => prepareServiceWorker(out, { loadable })).toThrow('Missing offline shell page'); }
    finally { rmSync(out, { recursive: true, force: true }); }
  });
});

describe('page labels for last-known delivery', () => {
  it('reads last-known delivery headers and never labels such a copy FRESH', async () => {
    const f = conditionsFixture();
    const headers = { 'x-atlas-delivery': 'last-known', 'x-atlas-cached-at': '2026-10-06T12:30:00.000Z' };
    expect(lastKnownDelivery(new Response('', { headers }))).toEqual({ savedAt: '2026-10-06T12:30:00.000Z' });
    expect(lastKnownDelivery(new Response(''))).toBeNull();
    vi.stubGlobal('fetch', vi.fn(async (path: string) => new Response(path === '/live/latest.json' ? JSON.stringify(f.index) : path === GFS_PATH ? f.gfsRaw : f.usgsRaw, { headers })));
    const data = await loadLivePublication();
    vi.unstubAllGlobals();
    const fresh = data.deliveries.map(delivery => feedView(data, delivery, Date.parse(NORMAL_NOW)));
    expect(fresh.map(view => freshnessText(view))).toEqual(['LAST KNOWN', 'LAST KNOWN']);
    expect(fresh.map(view => freshnessText(view, 'ne'))).toEqual(['पछिल्लो ज्ञात', 'पछिल्लो ज्ञात']);
    const stale = data.deliveries.map(delivery => feedView(data, delivery, Date.parse(STALE_NOW)));
    expect(stale.map(view => freshnessText(view))).toEqual(['LAST KNOWN · STALE', 'LAST KNOWN · STALE']);
    const bulletin = buildBulletin(data, fresh, 'en', data.lastKnown);
    const text = [bulletin.publication, ...bulletin.sections.flatMap(section => section.sentences)].join(' ');
    expect(text).toContain('LAST KNOWN — saved on this device 2026-10-06 12:30 UTC');
    expect(text).toContain('not rechecked');
    expect(bulletin.sections.filter(section => section.lastKnown).map(section => section.id)).toEqual(['earthquakes', 'forecast']);
  });
  it('labels network data as last known once the device is offline', async () => {
    const f = conditionsFixture();
    vi.stubGlobal('fetch', vi.fn(async (path: string) => new Response(path === '/live/latest.json' ? JSON.stringify(f.index) : path === GFS_PATH ? f.gfsRaw : f.usgsRaw)));
    const data = await loadLivePublication();
    vi.unstubAllGlobals();
    expect(data.lastKnown).toBeNull();
    const online = data.deliveries.map(delivery => feedView(data, delivery, Date.parse(NORMAL_NOW)));
    expect(online.map(view => freshnessText(view))).toEqual(['FRESH', 'FRESH']);
    const offlineViews = data.deliveries.map(delivery => feedView(data, delivery, Date.parse(NORMAL_NOW), { savedAt: NORMAL_NOW }));
    expect(offlineViews.map(view => freshnessText(view))).toEqual(['LAST KNOWN', 'LAST KNOWN']);
  });
  it('keeps policy copy bilingual with matching placeholders', () => {
    expect(Object.keys(policy.copy.ne).sort()).toEqual(Object.keys(policy.copy.en).sort());
    for (const key of Object.keys(policy.copy.en) as Array<keyof typeof policy.copy.en>) expect((policy.copy.ne[key].match(/\{\w+\}/g) ?? []).sort()).toEqual((policy.copy.en[key].match(/\{\w+\}/g) ?? []).sort());
    expect(JSON.stringify(policy)).not.toMatch(/real[\s-]?time|वास्तविक समय/i);
  });
});
