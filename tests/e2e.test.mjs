// Browser tests on a phone and a laptop: every page, both languages, both themes, accessibility and the main flows.
// Run: npm run e2e (set CHROME_PATH to use an already installed Chromium).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';
import { serve } from './serve.mjs';

const AXE = readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');
const PAGES = ['/', '/map/', '/scenarios/', '/about/'];
const DEVICES = { phone: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }, laptop: { viewport: { width: 1366, height: 820 } } };
const QUAKE = { type: 'FeatureCollection', features: [{ type: 'Feature', geometry: { type: 'Point', coordinates: [85.3, 27.7, 10] }, properties: { mag: 4.6, place: 'Test event', time: Date.now() } }] };
let server, browser;
const base = 'http://127.0.0.1:4174';

before(async () => {
  server = await serve(4174);
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
});
after(async () => { await browser?.close(); server?.close(); });

/** A page with the USGS feed answered locally and every console error recorded. */
async function open(device, path, { lang = 'en', theme = 'light' } = {}) {
  const ctx = await browser.newContext(DEVICES[device]);
  await ctx.route('https://earthquake.usgs.gov/**', r => r.fulfill({ json: QUAKE, headers: { 'access-control-allow-origin': '*' } }));
  await ctx.route('https://fonts.*/**', r => r.abort());
  // Only the first load is preset, so a switch made during the test survives a reload.
  await ctx.addInitScript(([l, t]) => { if (!localStorage.getItem('lang')) { localStorage.setItem('lang', l); localStorage.setItem('theme', t); } }, [lang, theme]);
  const page = await ctx.newPage(), errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => m.type() === 'error' && !/fonts\.|ERR_FAILED/.test(m.text()) && errors.push(m.text()));
  await page.goto(base + path);
  if (path === '/map/' || path.startsWith('/scenarios/')) await page.waitForSelector('#map[data-ready=true]', { timeout: 30000 });
  else await page.waitForLoadState('networkidle');
  return { page, errors, close: () => ctx.close() };
}

for (const device of Object.keys(DEVICES)) for (const [lang, theme] of [['en', 'light'], ['ne', 'dark']]) for (const path of PAGES) {
  test(`${device} ${lang} ${theme} ${path}: loads cleanly, fits the screen, passes axe`, async () => {
    const { page, errors, close } = await open(device, path, { lang, theme });
    assert.equal(await page.getAttribute('html', 'lang'), lang);
    assert.equal(await page.getAttribute('html', 'data-theme'), theme);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'no sideways scrolling');
    await page.addScriptTag({ content: AXE });
    const violations = await page.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] })).violations
      .filter(v => ['serious', 'critical'].includes(v.impact)).map(v => `${v.id}: ${v.nodes.slice(0, 3).map(n => n.target.join(' ')).join(', ')}`));
    assert.deepEqual(violations, []);
    if (device === 'phone') {
      const small = await page.evaluate(() => [...document.querySelectorAll('.nav a, .tools button, .actions .button, .actions button')]
        .map(e => e.getBoundingClientRect()).filter(r => r.width && (r.width < 44 || r.height < 44)).length);
      assert.equal(small, 0, 'touch targets are at least 44 px');
    }
    assert.deepEqual(errors, []);
    await close();
  });
}

test('Today shows the four headline tiles and the source of each section', async () => {
  const { page, close } = await open('phone', '/');
  assert.equal(await page.locator('.tile').count(), 4);
  assert.ok(await page.locator('.src').count() >= 4);
  await close();
});

test('the language and theme switches change the page and are remembered', async () => {
  const { page, close } = await open('laptop', '/about/');
  await page.click('#theme');
  assert.equal(await page.getAttribute('html', 'data-theme'), 'dark');
  await page.click('#lang');
  await page.waitForLoadState('networkidle');
  assert.equal(await page.getAttribute('html', 'lang'), 'ne');
  assert.equal(await page.getAttribute('html', 'data-theme'), 'dark');
  await page.waitForSelector('#sources table');
  await close();
});

test('the map loads its layers, including the live USGS feed', async () => {
  const { page, close } = await open('laptop', '/map/');
  assert.equal(await page.locator('#layers input[type=checkbox]').count(), 12);
  await page.check('[data-id=glaciers]');
  await page.waitForTimeout(500);
  assert.equal(await page.locator('.note.warn').count(), 0, 'USGS feed loaded');
  await close();
});

test('flood scenario: results for every checkpoint, refuses bad input, keeps inputs in the link', async () => {
  const { page, close } = await open('phone', '/scenarios/#flood=glof-40746560');
  await page.waitForSelector('#result table');
  const origin = JSON.parse(gunzipSync(readFileSync(new URL('../site/data/atlas-flood-corridors/1.0.0/catalogue.json.gz', import.meta.url)))).origins.find(o => o.id === 'glof-40746560');
  assert.equal(await page.locator('#result tbody tr').count(), origin.checkpoints.length);
  await page.fill('[name=v]', '5');
  await page.click('#form button.primary');
  await page.waitForSelector('#result [role=alert]');
  assert.equal(await page.getAttribute('[name=v]', 'aria-invalid'), 'true');
  await page.fill('[name=v]', '2000000');
  await page.click('#form button.primary');
  await page.waitForSelector('#result table');
  assert.match(page.url(), /v=2000000/);
  await close();
});

test('earthquake scenario: Gorkha preset runs and a tap on the map moves the epicentre', async () => {
  const { page, close } = await open('laptop', '/scenarios/#quake');
  await page.waitForSelector('#result table');
  assert.match(await page.inputValue('[name=m]'), /^7\.8$/);
  await page.locator('#map canvas').click({ position: { x: 300, y: 300 } });
  await page.waitForFunction(() => location.hash.includes('lon='));
  await page.waitForSelector('#result table');
  await close();
});
