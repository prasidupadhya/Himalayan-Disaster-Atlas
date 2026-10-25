// UI audit: throttled phone metrics, axe, heading outline and screenshots for every route of a static build.
// usage: node scripts/ui-audit.mjs <label> <outDir> [--root apps/web/out] [--runs 3] [--no-axe] [--shots] [--themes]
// With --runs N each route is measured N times and the median of each metric is recorded (single throttled runs vary).
// Set CHROMIUM_PATH to use a browser other than the one Playwright installed (e.g. a preinstalled Chromium).
// The build is served gzip-compressed by a small built-in server, as a CDN would serve it. Results feed
// docs/redefine/audit.md and docs/performance.md; they are development measurements, not field data.
import { chromium } from 'playwright';
import fs from 'node:fs';
import http from 'node:http';
import { createRequire } from 'node:module';
import path from 'node:path';
import zlib from 'node:zlib';

const [label, outDir] = process.argv.slice(2);
const SHOTS = process.argv.includes('--shots');
const THEMES = process.argv.includes('--themes');
const AXE_RUNS = !process.argv.includes('--no-axe');
const runsFlag = process.argv.indexOf('--runs');
const RUNS = runsFlag > 0 ? Number(process.argv[runsFlag + 1]) : 1;
const median = values => { const v = values.filter(x => x !== null).sort((a, b) => a - b); return v.length ? v[Math.floor((v.length - 1) / 2)] : null; };
const rootFlag = process.argv.indexOf('--root');
const ROOT = path.resolve(rootFlag > 0 ? process.argv[rootFlag + 1] : 'apps/web/out');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.gz': 'application/gzip', '.webp': 'image/webp', '.pbf': 'application/x-protobuf' };
let BASE = '';
const ROUTES = ['/', '/atlas/', '/hazards/', '/simulate/', '/simulate/report/', '/live/', '/official/', '/methodology/', '/sources/', '/licenses/', '/offline/'];
const AXE = fs.readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');
const ARGS = ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'];

/** Serves the static build; text responses are gzip-compressed, already-compressed files are sent as they are. */
function serve() {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file = path.join(ROOT, url);
    if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
    const type = TYPES[path.extname(file)] ?? 'application/octet-stream';
    const body = fs.readFileSync(file);
    const text = /^(text|application\/(json|manifest)|image\/svg)/.test(type) || type === 'text/javascript';
    if (text && /gzip/.test(req.headers['accept-encoding'] ?? '')) res.writeHead(200, { 'content-type': type, 'content-encoding': 'gzip' }).end(zlib.gzipSync(body));
    else res.writeHead(200, { 'content-type': type }).end(body);
  });
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => { BASE = `http://127.0.0.1:${server.address().port}`; resolve(server); }));
}

const ready = async (page, route) => {
  if (route === '/atlas/') await page.locator('[data-map-ready="true"]').waitFor({ timeout: 60000 }).catch(() => {});
  else if (route === '/simulate/') await page.locator('.sim-map[data-map-state="ready"], .sim-map[data-map-state="unavailable"]').first().waitFor({ timeout: 60000 }).catch(() => {});
  else await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(600);
};

async function metrics(browser, route) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, serviceWorkers: 'block' });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  let bytes = 0, js = 0, css = 0;
  const types = new Map();
  cdp.on('Network.responseReceived', e => types.set(e.requestId, e.type));
  cdp.on('Network.loadingFinished', e => { bytes += e.encodedDataLength; const t = types.get(e.requestId); if (t === 'Script') js += e.encodedDataLength; if (t === 'Stylesheet') css += e.encodedDataLength; });
  await page.addInitScript(() => {
    window.__m = { lcp: 0, cls: 0, fcp: 0, inp: 0 };
    new PerformanceObserver(l => { for (const e of l.getEntries()) window.__m.lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__m.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver(l => { for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') window.__m.fcp = e.startTime; }).observe({ type: 'paint', buffered: true });
    new PerformanceObserver(l => { for (const e of l.getEntries()) window.__m.inp = Math.max(window.__m.inp, e.duration); }).observe({ type: 'event', buffered: true, durationThreshold: 16 });
  });
  const start = Date.now();
  await page.goto(BASE + route, { waitUntil: 'load', timeout: 120000 });
  let mapMs = null;
  if (route === '/atlas/' || route === '/simulate/') {
    const sel = route === '/atlas/' ? '[data-map-ready="true"]' : '.sim-map[data-map-state="ready"]';
    await page.locator(sel).first().waitFor({ timeout: 120000 }).then(() => { mapMs = Date.now() - start; }).catch(() => {});
  }
  await page.waitForLoadState('networkidle', { timeout: 120000 }).catch(() => {});
  // A representative interaction for INP: the language switch.
  await page.getByRole('button', { name: 'नेपाली' }).first().tap().catch(() => {});
  await page.waitForTimeout(800);
  const m = await page.evaluate(() => window.__m);
  await context.close();
  return { route, lcp: Math.round(m.lcp), fcp: Math.round(m.fcp), cls: Number(m.cls.toFixed(3)), inp: Math.round(m.inp), mapMs, kb: Math.round(bytes / 1024), jsKb: Math.round(js / 1024), cssKb: Math.round(css / 1024) };
}

async function audit(browser, route, lang, theme, viewport) {
  const context = await browser.newContext({ viewport, serviceWorkers: 'block', colorScheme: theme === 'dark' ? 'dark' : 'light' });
  await context.addInitScript(([l, th]) => { try { localStorage.setItem('atlas-lang', l); if (th) localStorage.setItem('atlas-theme', th); } catch {} }, [lang, THEMES ? theme : null]);
  const page = await context.newPage();
  await page.goto(BASE + route, { waitUntil: 'load', timeout: 120000 });
  await ready(page, route);
  await page.addScriptTag({ content: AXE });
  const result = await page.evaluate(async () => {
    const r = await window.axe.run(document, { resultTypes: ['violations'], runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } });
    return r.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, sample: v.nodes.slice(0, 3).map(n => n.target.join(' ')) }));
  });
  const outline = await page.evaluate(() => [...document.querySelectorAll('main h1, main h2, main h3')].filter(h => h.offsetParent).slice(0, 40).map(h => `${h.tagName} ${h.textContent.trim().slice(0, 60)}`));
  let shot = null;
  if (SHOTS) {
    const dir = path.join(outDir, 'screens');
    fs.mkdirSync(dir, { recursive: true });
    const name = `${route === '/' ? 'home' : route.replace(/^\/|\/$/g, '').replace(/\//g, '-')}-${viewport.width}-${lang}-${theme}.jpg`;
    await page.screenshot({ path: path.join(dir, name), type: 'jpeg', quality: 55 });
    shot = name;
  }
  await context.close();
  return { route, lang, theme, width: viewport.width, violations: result, outline: lang === 'en' && theme === 'light' ? outline : undefined, shot };
}

(async () => {
  const server = await serve();
  const browser = await chromium.launch({ args: ARGS, executablePath: process.env.CHROMIUM_PATH || undefined });
  const out = { label, at: new Date().toISOString(), metrics: [], audits: [] };
  for (const route of ROUTES) {
    const runs = [];
    for (let i = 0; i < RUNS; i++) runs.push(await metrics(browser, route));
    const m = { route, runs: RUNS };
    for (const key of ['lcp', 'fcp', 'cls', 'inp', 'mapMs', 'kb', 'jsKb', 'cssKb']) m[key] = median(runs.map(r => r[key]));
    out.metrics.push(m);
    console.log('metrics', JSON.stringify(m));
  }
  const themes = THEMES ? ['light', 'dark'] : ['light'];
  if (AXE_RUNS) for (const route of ROUTES) for (const lang of ['en', 'ne']) for (const theme of themes) for (const width of [390, 1440]) {
    const viewport = width === 390 ? { width: 390, height: 844 } : { width: 1440, height: 900 };
    const a = await audit(browser, route, lang, theme, viewport);
    out.audits.push(a);
    console.log('axe', route, lang, theme, width, a.violations.map(v => `${v.id}:${v.impact}:${v.nodes}`).join(' '));
  }
  await browser.close();
  server.close();
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, `${label}.json`), JSON.stringify(out, null, 2));
})();
