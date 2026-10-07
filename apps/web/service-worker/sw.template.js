/* Himalayan Disaster Atlas offline shell (Feature 47). Original MIT code.
 * The build replaces the configuration literal with a checksum-pinned shell manifest. */
'use strict';
const CONFIG = /*@atlas-config*/ { version: 'unbuilt', shell: [], liveRetentionSeconds: 604800, networkTimeoutMs: 8000, staticEntries: 160, dataEntries: 120 } /*@end*/;

const PREFIX = 'atlas-';
const SHELL_CACHE = `${PREFIX}shell-${CONFIG.version}`;
const STATIC_CACHE = `${PREFIX}static-v1`;
const LIVE_CACHE = `${PREFIX}live-v1`;
const DATA_CACHE = `${PREFIX}data-v1`;
const CURRENT = new Set([SHELL_CACHE, STATIC_CACHE, LIVE_CACHE, DATA_CACHE]);
const LIVE_INDEX = '/live/latest.json';
const LIVE_ARTIFACT = /^\/data\/live-[a-z0-9-]+\/\d+\.\d+\.\d+\/(?:snapshot|manifest)\.json$/;
const LIVE_HISTORY = /^\/live\/history\/\d+\.\d+\.\d+\/index\.json$/;
const STATIC_ASSET = /^\/(?:_next\/static|vendor)\//;
// Versioned release paths are immutable (a changed release gets a new version), so they are safe to keep.
// Raster terrain tiles are large, numerous and outside the offline promise, so they never displace release data.
const IMMUTABLE_DATA = /^\/data\/[a-z0-9-]+\/[0-9]+\.[0-9]+\.[0-9]+\/(?!.*\.png$)/;
const LIMITS = { index: 65536, artifact: 524288 };
const DELIVERY = 'x-atlas-delivery';
const CACHED_AT = 'x-atlas-cached-at';
const SHA256 = 'x-atlas-sha256';

const hex = buffer => Array.from(new Uint8Array(buffer), byte => byte.toString(16).padStart(2, '0')).join('');
const sha256 = async buffer => hex(await crypto.subtle.digest('SHA-256', buffer));
const now = () => Date.now();

function withTimeout(promise, milliseconds) {
  let timer;
  return Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Network timeout')), milliseconds); })]).finally(() => clearTimeout(timer));
}
function fetchCurrent(request) {
  return withTimeout(fetch(request, { cache: 'no-store', credentials: 'omit', redirect: 'error' }), CONFIG.networkTimeoutMs);
}
function shellPath(pathname) {
  if (pathname.endsWith('/index.html')) return pathname.slice(0, -'index.html'.length);
  return pathname.endsWith('/') || /\.[a-z0-9]+$/i.test(pathname) ? pathname : `${pathname}/`;
}

/** Install: every shell file must match its build-time byte size and SHA-256 before anything is cached. */
async function installShell() {
  const verified = [];
  for (const entry of CONFIG.shell) {
    const response = await fetch(new Request(entry.url, { cache: 'reload', credentials: 'omit', redirect: 'error' }));
    if (!response.ok) throw new Error(`Shell file unavailable: ${entry.url}`);
    const bytes = await response.arrayBuffer();
    if (bytes.byteLength !== entry.bytes || await sha256(bytes) !== entry.sha256) throw new Error(`Shell checksum mismatch: ${entry.url}`);
    verified.push([entry.url, new Response(bytes, { status: 200, headers: { 'content-type': response.headers.get('content-type') || entry.type, [SHA256]: entry.sha256 } })]);
  }
  // Only a completely verified shell is stored; a failed install keeps the previous version active.
  const cache = await caches.open(SHELL_CACHE);
  await Promise.all(verified.map(([url, response]) => cache.put(url, response)));
}

async function removeOldCaches() {
  for (const name of await caches.keys()) if (name.startsWith(PREFIX) && !CURRENT.has(name)) await caches.delete(name);
}

async function boundedBytes(response, limit) {
  const bytes = await response.arrayBuffer();
  if (bytes.byteLength === 0 || bytes.byteLength > limit) throw new Error('Live response outside its byte budget');
  return bytes;
}
function liveResponse(bytes, hash, cachedAt) {
  return new Response(bytes, { status: 200, headers: { 'content-type': 'application/json', [SHA256]: hash, [CACHED_AT]: cachedAt } });
}
async function cachedIndex(cache) {
  const response = await cache.match(LIVE_INDEX);
  if (!response) return null;
  try { return JSON.parse(new TextDecoder().decode(await response.arrayBuffer())); } catch { return null; }
}
function referenceFor(index, pathname) {
  for (const feed of index?.feeds ?? []) {
    const ref = feed && feed.snapshot;
    if (!ref || typeof ref.path !== 'string') continue;
    if (ref.path === pathname) return { path: ref.path, sha256: ref.sha256, byte_size: ref.byte_size };
    if (ref.path.replace('/snapshot.json', '/manifest.json') === pathname) return { path: pathname, sha256: null, byte_size: null };
  }
  return null;
}

/** Keep a verified copy of what the network just served. Unverifiable responses are never stored. */
async function remember(pathname, response) {
  const cache = await caches.open(LIVE_CACHE);
  const stamp = new Date(now()).toISOString();
  if (pathname === LIVE_INDEX) {
    const bytes = await boundedBytes(response, LIMITS.index);
    const index = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
    if (!index || index.kind !== 'live-index' || !Array.isArray(index.feeds)) return;
    await cache.put(LIVE_INDEX, liveResponse(bytes, await sha256(bytes), stamp));
    // Drop artifacts the current index no longer references.
    for (const request of await cache.keys()) {
      const path = new URL(request.url).pathname;
      if (path !== LIVE_INDEX && !referenceFor(index, path)) await cache.delete(request);
    }
    return;
  }
  if (!LIVE_ARTIFACT.test(pathname)) return;
  const reference = referenceFor(await cachedIndex(cache), pathname);
  if (!reference) return;
  const bytes = await boundedBytes(response, LIMITS.artifact);
  const hash = await sha256(bytes);
  if (reference.sha256 !== null && (hash !== reference.sha256 || bytes.byteLength !== reference.byte_size)) return;
  await cache.put(pathname, liveResponse(bytes, hash, stamp));
}

/** Serve a stored copy only if it is intact, still referenced and inside the retention window. */
async function recall(pathname) {
  const cache = await caches.open(LIVE_CACHE);
  const response = await cache.match(pathname);
  if (!response) return null;
  const cachedAt = response.headers.get(CACHED_AT);
  const age = cachedAt === null ? Infinity : now() - Date.parse(cachedAt);
  if (!(age >= 0 && age <= CONFIG.liveRetentionSeconds * 1000)) {
    // Expired: never served, as current or otherwise. An expired index removes the whole live cache.
    if (pathname === LIVE_INDEX) await caches.delete(LIVE_CACHE); else await cache.delete(pathname);
    return null;
  }
  const bytes = await response.arrayBuffer();
  const hash = await sha256(bytes);
  const reference = pathname === LIVE_INDEX ? null : referenceFor(await cachedIndex(cache), pathname);
  const intact = hash === response.headers.get(SHA256) && (pathname === LIVE_INDEX || (reference !== null && (reference.sha256 === null || (reference.sha256 === hash && reference.byte_size === bytes.byteLength))));
  if (!intact) { await cache.delete(pathname); return null; }
  return new Response(bytes, { status: 200, headers: { 'content-type': 'application/json', 'cache-control': 'no-store', [DELIVERY]: 'last-known', [CACHED_AT]: cachedAt } });
}

/** Network first: any HTTP answer is the server's current truth; only a network failure falls back. */
async function liveNetworkFirst(request) {
  const { pathname } = new URL(request.url);
  let response;
  try { response = await fetchCurrent(request); }
  catch {
    return (await recall(pathname)) ?? new Response('Live data is unavailable offline and no intact last-known copy is stored.', { status: 503, headers: { 'content-type': 'text/plain', [DELIVERY]: 'unavailable' } });
  }
  if (response.ok) { try { await remember(pathname, response.clone()); } catch { /* not stored; the page still verifies what it receives */ } }
  return response;
}

// Pages fall back only on a network failure, never a timeout: a slow but working connection must not
// be shown the offline page. Live data uses the timeout because its fallback is labelled LAST KNOWN.
async function navigate(request) {
  try { return await fetch(request); }
  catch {
    const cache = await caches.open(SHELL_CACHE);
    return (await cache.match(shellPath(new URL(request.url).pathname))) ?? (await cache.match('/offline/')) ?? Response.error();
  }
}
async function pageData(request) {
  try { return await fetch(request); }
  catch { return (await (await caches.open(SHELL_CACHE)).match(new URL(request.url).pathname, { ignoreSearch: true })) ?? Response.error(); }
}
async function cacheFirst(request, name = STATIC_CACHE, limit = CONFIG.staticEntries) {
  const { pathname } = new URL(request.url);
  const shell = await (await caches.open(SHELL_CACHE)).match(pathname);
  if (shell) return shell;
  const cache = await caches.open(name);
  // A reload is the page's retry after a checksum failure: it must not be answered from the same bad copy.
  const cached = request.cache === 'reload' ? undefined : await cache.match(pathname);
  if (cached) {
    // Re-inserting on use makes the oldest-first eviction below behave as least-recently-used.
    await cache.delete(pathname);
    await cache.put(pathname, cached.clone());
    return cached;
  }
  const response = await fetch(request);
  if (response.ok && response.type === 'basic') {
    await cache.put(pathname, response.clone());
    const keys = await cache.keys();
    for (const old of keys.slice(0, Math.max(0, keys.length - limit))) await cache.delete(old);
  }
  return response;
}

self.addEventListener('install', event => {
  event.waitUntil(installShell().then(() => { if (!self.registration.active) return self.skipWaiting(); }));
});
self.addEventListener('activate', event => {
  event.waitUntil(removeOldCaches().then(() => self.clients.claim()));
});
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'ATLAS_SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname === LIVE_INDEX || LIVE_ARTIFACT.test(url.pathname) || LIVE_HISTORY.test(url.pathname)) { event.respondWith(liveNetworkFirst(request)); return; }
  if (request.mode === 'navigate') { event.respondWith(navigate(request)); return; }
  if (STATIC_ASSET.test(url.pathname)) { event.respondWith(cacheFirst(request)); return; }
  if (IMMUTABLE_DATA.test(url.pathname)) { event.respondWith(cacheFirst(request, DATA_CACHE, CONFIG.dataEntries)); return; }
  if (url.searchParams.has('_rsc') || /\/(?:index|__next\.[A-Za-z0-9_.-]+)\.txt$/.test(url.pathname)) { event.respondWith(pageData(request)); return; }
  // Other files pass through to the network untouched.
});
