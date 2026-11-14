// Offline: pages and code are cached on install; everything is fetched fresh when online and served from cache when not.
const CACHE = 'atlas-v1';
const SHELL = ['/', '/map/', '/scenarios/', '/about/', '/app.css', '/app.js', '/copy.js', '/models.js', '/basemap.js', '/today.js', '/map.js', '/scenarios.js', '/about.js',
  '/icon.svg', '/data/gov/latest.json', '/vendor/maplibre-gl/maplibre-gl.mjs', '/vendor/maplibre-gl/maplibre-gl-shared.mjs', '/vendor/maplibre-gl/maplibre-gl-worker.mjs', '/vendor/maplibre-gl/maplibre-gl.css'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return r;
  }).catch(() => caches.match(e.request).then(r => r ?? (e.request.mode === 'navigate' ? caches.match('/') : Response.error()))));
});
