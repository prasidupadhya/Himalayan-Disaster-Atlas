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
async function open(device, path, { lang = 'en', theme = 'light', reducedMotion, viewport, noWebGL = false } = {}) {
  const ctx = await browser.newContext({ ...DEVICES[device], reducedMotion, viewport: viewport ?? DEVICES[device].viewport });
  await ctx.route('https://earthquake.usgs.gov/**', r => r.fulfill({ json: QUAKE, headers: { 'access-control-allow-origin': '*' } }));
  await ctx.route('https://fonts.*/**', r => r.abort());
  // Only the first load is preset, so a switch made during the test survives a reload.
  await ctx.addInitScript(([l, t]) => { if (!localStorage.getItem('lang')) { localStorage.setItem('lang', l); localStorage.setItem('theme', t); } }, [lang, theme]);
  if (noWebGL) await ctx.addInitScript(() => {
    const get = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return type.includes('webgl') ? null : get.call(this, type, ...args);
    };
  });
  const page = await ctx.newPage(), errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('response', r => { if (r.status() >= 400) errors.push(`HTTP ${r.status()} ${r.url()} from ${r.request().headers().referer}`); });
  page.on('console', m => m.type() === 'error' && !/fonts\.|ERR_FAILED/.test(m.text()) && errors.push(`${m.text()} ${m.location().url}`));
  await page.goto(base + path);
  if (path === '/map/' || /^\/scenarios\/(#|$)/.test(path)) await page.waitForSelector('#map[data-ready=true]', { timeout: 30000 });
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

test('Today shows the four headline readings and the source of each section', async () => {
  const { page, close } = await open('phone', '/');
  assert.equal(await page.locator('.reading').count(), 4);
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

test('the map offers exactly its six layers and loads glaciers on request', async () => {
  const { page, close } = await open('laptop', '/map/');
  assert.equal(await page.locator('#layers input[type=checkbox]').count(), 6);
  await page.check('[data-id=glaciers]');
  await page.waitForTimeout(500);
  assert.equal(await page.locator('.note.warn').count(), 0, 'glaciers loaded');
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

test('flood playback: the timeline scrubs, and at the end every checkpoint is reached', async () => {
  const { page, errors, close } = await open('laptop', '/scenarios/#flood=glof-40746560');
  await page.waitForSelector('#scrub');
  await page.click('#play');
  await page.locator('#scrub').fill('0');
  assert.equal(await page.locator('#result tr.reached').count(), 0);
  await page.locator('#scrub').fill('1000');
  assert.equal(await page.locator('#result tr.reached').count(), await page.locator('#result tr[data-km]').count());
  assert.match(await page.textContent('#clock'), /km/);
  assert.deepEqual(errors, []);
  await close();
});

test('river trace: tapping a river and tracing it draws the downstream path', async () => {
  const { page, errors, close } = await open('laptop', '/map/');
  const box = await page.locator('#map canvas').boundingBox();
  // Rivers are dense across the middle of Nepal: tap along a line until a river popup offers the trace.
  for (let x = 0.3; x < 0.9 && !(await page.locator('[data-trace]').count()); x += 0.02) { await page.mouse.click(box.x + box.width * x, box.y + box.height * 0.6); await page.waitForTimeout(150); }
  await page.click('[data-trace]');
  await page.waitForSelector('#clear');
  assert.match(await page.textContent('#info'), /km/);
  await page.waitForTimeout(500);
  await page.click('#clear');
  assert.equal(await page.locator('#clear').count(), 0);
  assert.deepEqual(errors, []);
  await close();
});

test('flood scenario names its places: districts in order, towns near the path, and the place the front is in', async () => {
  const { page, errors, close } = await open('laptop', '/scenarios/#flood=glof-40746560');
  await page.waitForSelector('.route-list li');
  assert.match(await page.textContent('.route-list li:first-child'), /Manang/);
  assert.match(await page.textContent('.route'), /Lamjung/);
  assert.match(await page.textContent('.route'), /Besisahar/);
  assert.match(await page.textContent('.summary'), /Manang/);
  await page.click('#play');
  await page.locator('#scrub').fill('300');
  assert.match(await page.textContent('#clock'), / in [A-Z]/);
  assert.ok(await page.locator('.map-label.on').count() > 0, 'places are labelled on the map');
  assert.deepEqual(errors, []);
  await close();
});

test('earthquake scenario names the epicentre district and the most shaken cities', async () => {
  const { page, errors, close } = await open('laptop', '/scenarios/#quake');
  await page.waitForSelector('#sweep');
  assert.match(await page.textContent('.summary'), /Gorkha district, Gandaki/);
  assert.equal(await page.locator('#result table').first().locator('tbody tr').count(), 10);
  await page.waitForFunction(() => document.querySelectorAll('.map-label.on').length > 0);
  await page.click('#sweep');
  assert.deepEqual(errors, []);
  await close();
});

test('river trace lists where the river goes', async () => {
  const { page, errors, close } = await open('phone', '/map/');
  const box = await page.locator('#map canvas').boundingBox();
  // Nepal is a narrow band on a phone: tap across it at several heights until a river popup offers the trace.
  const found = () => page.locator('[data-trace]').count();
  for (const y of [0.45, 0.5, 0.55, 0.4, 0.6]) for (let x = 0.15; x < 0.9 && !(await found()); x += 0.03) {
    await page.touchscreen.tap(box.x + box.width * x, box.y + box.height * y); await page.waitForTimeout(200);
    if (!(await found())) await page.locator('.maplibregl-popup-close-button').click({ timeout: 300 }).catch(() => {});   // a lake popup would cover the next tap
  }
  await page.click('[data-trace]');
  await page.waitForSelector('.route-list li');
  assert.ok(await page.locator('.route-list li').count() >= 1);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  assert.deepEqual(errors, []);
  await close();
});

test('a river point outside Nepal is described as outside, and only real place names are shown', async () => {
  const { page, errors, close } = await open('phone', '/scenarios/#flood=river-40679245');
  await page.waitForSelector('.route-list li');
  assert.match(await page.textContent('.summary'), /starting outside Nepal/);
  assert.doesNotMatch(await page.textContent('.summary'), /in outside/);
  assert.ok(await page.locator('.map-note.phone-only').isVisible(), 'the map note is shown on phones');
  await page.goto(base + '/scenarios/#flood=river-40811723');
  await page.waitForFunction(() => /Kathmandu|Bhaktapur|Lalitpur/.test(document.querySelector('.route-list')?.textContent ?? ''));
  assert.doesNotMatch(await page.textContent('#result'), /OSM settlement/);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  assert.deepEqual(errors, []);
  await close();
});

// Observe the actual renderer through the first terrain change; no production test hook.
async function inspectTerrain(page) {
  await page.evaluate(async () => {
    const { Map } = await import('/vendor/maplibre-gl/maplibre-gl.mjs');
    const setTerrain = Map.prototype.setTerrain;
    Map.prototype.setTerrain = function (...args) {
      Map.prototype.setTerrain = setTerrain;
      window.scenarioMap = this;
      return setTerrain.apply(this, args);
    };
  });
}
const finiteFault = '#quake&lon=84.73&lat=28.23&m=7.8&mech=unspecified&vs30=760&len=80&strike=110';
for (const scenario of ['flood', 'quake']) {
  test(`${scenario}: toggle terrain by keyboard, change its scale and return to flat at 360 px`, async () => {
    const { page, errors, close } = await open('phone', '/scenarios/' + (scenario === 'quake' ? finiteFault : '#flood=glof-40746560'),
      { reducedMotion: 'reduce', viewport: { width: 360, height: 780 } });
    try {
      await inspectTerrain(page);
      const button = page.locator('#terrain-toggle'), scale = page.locator('#terrain-scale');
      assert.equal(await button.getAttribute('aria-pressed'), 'false');
      if (scenario === 'flood') {
        assert.equal(await page.locator('#follow').isChecked(), false);
        assert.equal(await page.locator('#scrub').inputValue(), '1000');
        await page.locator('#scrub').fill('280');
      }
      await button.focus(); await button.press('Space');
      assert.equal(await button.getAttribute('aria-pressed'), 'true');
      assert.equal(await page.locator('#terrain-note').isVisible(), true);
      assert.match(await page.locator('#terrain-note').innerText(), /Hypothetical/);
      assert.equal(await scale.inputValue(), '1');
      await scale.selectOption('1.5');
      assert.equal(await page.evaluate(() => scenarioMap.getTerrain().exaggeration), 1.5);
      await scale.selectOption('1');
      assert.equal(await page.evaluate(() => scenarioMap.getTerrain().exaggeration), 1);
      assert.ok(await page.evaluate(() => scenarioMap.getPitch() > 0));
      assert.equal(await page.evaluate(() => Object.values(scenarioMap.getStyle().sources).filter(s => s.type === 'raster-dem').length), 1);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      if (scenario === 'flood') {
        const heights = await page.evaluate(async () => (await scenarioMap.getSource('flood-ribbon').getData()).features.map(f => f.properties.height));
        assert.ok(heights.length > 1 && Math.max(...heights) > Math.min(...heights));
        const pose = () => page.evaluate(() => [scenarioMap.getPitch(), scenarioMap.getBearing()]);
        const locked = await pose();
        await page.locator('#follow').check(); await page.locator('#play').click();
        await page.waitForFunction(() => Number(document.querySelector('#scrub').value) > 280);
        assert.deepEqual(await pose(), locked);
        await page.locator('#scrub').fill('1000');
        assert.equal(await page.evaluate(async () => (await scenarioMap.getSource('flood-ribbon').getData()).features.length), 0);
      } else {
        assert.ok(await page.evaluate(() => !!scenarioMap.getLayer('rupture-casing')));
        assert.equal(await page.evaluate(() => scenarioMap.getPaintProperty('shaking', 'raster-opacity')), 0.6);
        assert.equal(await page.evaluate(async () => (await scenarioMap.getSource('rupture').getData()).features[0].geometry.type), 'LineString');
      }
      await button.press('Enter');
      assert.equal(await button.getAttribute('aria-pressed'), 'false');
      assert.equal(await scale.isVisible(), false);
      assert.deepEqual(await page.evaluate(() => [scenarioMap.getTerrain(), scenarioMap.getPitch(), !!scenarioMap.getLayer('flood-ribbon'), !!scenarioMap.getSource('flood-ribbon'), !!scenarioMap.getLayer('rupture-casing')]), [null, 0, false, false, false]);
      assert.deepEqual(errors, []);
    } finally { await close(); }
  });
}

test('without WebGL both scenarios draw a flat overview and accept input', async () => {
  const { page, errors, close } = await open('phone', '/scenarios/', { noWebGL: true, reducedMotion: 'reduce' });
  try {
    assert.match(await page.locator('#flat-note').innerText(), /WebGL.*2D/);
    assert.ok(await page.locator('#terrain-toggle').isDisabled());
    const pixels = () => page.locator('.scenario-flat').evaluate(c => c.toDataURL());
    const before = await pixels();
    await page.locator('#scrub').fill('200');
    assert.ok(await pixels() !== before, 'scrubbing moves the flat flood front');
    await page.locator('#tab-quake').click();
    await page.waitForSelector('#sweep');
    const quake = await pixels();
    assert.ok(quake !== before, 'the shaking grid replaces the flood path');
    const previousSweep = await page.locator('#sweep').elementHandle();
    await page.locator('[name=len]').fill('80');
    await page.locator('#form button.primary').click();
    await page.waitForFunction(() => location.hash.includes('len=80') && document.querySelector('#sweep'));
    await page.waitForFunction(button => !button.isConnected, previousSweep);
    await page.waitForSelector('#sweep');
    assert.ok(await pixels() !== quake, 'a finite rupture changes the grid');
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

test('switching scenarios in 3D clears the old overlay and respects point ruptures', async () => {
  const { page, errors, close } = await open('laptop', '/scenarios/', { reducedMotion: 'reduce', lang: 'ne' });
  try {
    await inspectTerrain(page);
    await page.locator('#terrain-toggle').click();
    await page.locator('#terrain-scale').selectOption('1.5');
    await page.locator('#tab-quake').click();
    await page.waitForSelector('#sweep');
    assert.equal(await page.evaluate(() => !!scenarioMap.getLayer('flood-ribbon')), false);
    assert.equal(await page.evaluate(async () => (await scenarioMap.getSource('rupture').getData()).features.length), 0);
    assert.equal(await page.evaluate(() => scenarioMap.getTerrain().exaggeration), 1.5);
    await page.locator('[name=len]').fill('80');
    await page.locator('[name=strike]').fill('');
    await page.locator('#form button.primary').click();
    await page.waitForSelector('#result [role=alert]');
    assert.match(await page.locator('[name=strike]').getAttribute('placeholder'), /UNKNOWN/);
    await page.locator('#tab-flood').click();
    await page.waitForSelector('#scrub');
    assert.ok(await page.evaluate(() => !!scenarioMap.getLayer('flood-ribbon')));
    assert.equal(await page.evaluate(() => !!scenarioMap.getLayer('rupture-casing')), false);
    assert.equal(await page.evaluate(() => scenarioMap.getLayoutProperty('shaking', 'visibility')), 'none');
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

test('the scenario report reruns the linked scenario and lays out for A4 in both languages', async () => {
  const { page, errors, close } = await open('laptop', '/scenarios/');
  await page.waitForSelector('#result .summary');
  // The Report link carries the scenario's link.
  await page.selectOption('#form [name=origin]', { index: 2 });
  await page.waitForFunction(() => location.hash.includes('flood='));
  await page.waitForFunction(() => document.getElementById('report')?.getAttribute('href').endsWith(location.hash));
  const summary = await page.textContent('#result .summary');
  await page.click('#report');
  await page.waitForSelector('#report[data-ready=true]', { timeout: 30000 });
  assert.equal(await page.textContent('#report .summary'), summary, 'same numbers as the page');
  assert.match(await page.textContent('#link'), /\/scenarios\/#flood=/);
  assert.ok(await page.locator('#report-map canvas').count() === 1);
  await page.emulateMedia({ media: 'print' });
  assert.equal(await page.locator('.top').isVisible(), false);
  assert.equal(await page.locator('#print').isVisible(), false);
  const pdf = await page.pdf({ format: 'A4' });
  assert.ok(pdf.length > 10000);
  assert.deepEqual(errors, []);
  await close();

  const ne = await open('phone', '/scenarios/report/#quake', { lang: 'ne', theme: 'dark' });
  await ne.page.waitForSelector('#report[data-ready=true]', { timeout: 30000 });
  assert.equal(await ne.page.title(), 'परिदृश्य प्रतिवेदन, हिमालय विपद् एटलस');
  assert.ok(await ne.page.locator('#report table').count() >= 3);
  assert.equal(await ne.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await ne.page.addScriptTag({ content: AXE });
  const violations = await ne.page.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa'] })).violations.filter(v => ['serious', 'critical'].includes(v.impact)).map(v => v.id));
  assert.deepEqual(violations, []);
  assert.deepEqual(ne.errors, []);
  await ne.close();
});

test('place search works by keyboard on the map, in English and Nepali, and picks a lake on Scenarios', async () => {
  const { page, errors, close } = await open('laptop', '/map/');
  const q = page.locator('#search-q');
  await q.focus(); await page.keyboard.type('pokhara');
  await page.waitForSelector('#search-list [role=option]');
  assert.equal(await q.getAttribute('aria-expanded'), 'true');
  await page.keyboard.press('ArrowDown');
  assert.equal(await q.getAttribute('aria-activedescendant'), 'search-o0');
  assert.equal(await page.getAttribute('#search-o0', 'aria-selected'), 'true');
  assert.match(await page.textContent('#search-o0'), /Pokhara.*City.*Kaski/);
  await page.keyboard.press('Enter');
  await page.waitForSelector('.maplibregl-popup');
  assert.match(await page.textContent('.maplibregl-popup'), /Pokhara/);
  assert.equal(await q.getAttribute('aria-expanded'), 'false');
  // Escape closes the list, then clears the field.
  await q.fill('zzzq'); await page.waitForSelector('#search-list .none');
  await page.keyboard.press('Escape'); assert.equal(await q.getAttribute('aria-expanded'), 'false');
  await page.keyboard.press('Escape'); assert.equal(await q.inputValue(), '');
  assert.deepEqual(errors, []);
  await close();

  const ne = await open('phone', '/map/', { lang: 'ne', theme: 'dark' });
  await ne.page.fill('#search-q', 'काठमाडौं');
  await ne.page.waitForSelector('#search-list [role=option]');
  assert.match(await ne.page.textContent('#search-o0'), /काठमाडौं.*सहर/);
  await ne.page.click('#search-o0');
  await ne.page.waitForSelector('.maplibregl-popup');
  assert.equal(await ne.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  assert.deepEqual(ne.errors, []);
  await ne.close();

  const s = await open('phone', '/scenarios/');
  await s.page.waitForSelector('#result .summary');
  const first = await s.page.inputValue('#form [name=origin]');
  await s.page.fill('#search-q', 'lake');
  await s.page.waitForSelector('#search-list [role=option]');
  const options = await s.page.locator('#search-list [role=option]').count();
  assert.ok(options >= 2);
  await s.page.locator('#search-q').press('ArrowDown'); await s.page.locator('#search-q').press('ArrowDown'); await s.page.locator('#search-q').press('Enter');
  await s.page.waitForFunction(f => document.querySelector('#form [name=origin]')?.value !== f && location.hash.includes('flood='), first);
  assert.equal(await s.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  assert.deepEqual(s.errors, []);
  await s.close();
});

test('Today shows 30-day trends where a day without a reading is a gap, not zero', async () => {
  const { page, errors, close } = await open('phone', '/');
  await page.waitForSelector('#trends .trend');
  assert.equal(await page.locator('#trends .trend').count(), 3);
  for (const fig of await page.locator('#trends .trend svg').all()) assert.equal(await fig.locator('g').count(), 30);
  const history = await page.evaluate(() => fetch('/data/gov/history.json').then(r => r.json()));
  const unread = history.days.filter(d => d.rivers_current == null).length;
  assert.ok(await page.locator('#trends .trend').nth(2).locator('rect.gap').count() >= unread, 'unread days are drawn as gaps');
  assert.doesNotMatch(await page.textContent('#trends'), /top /);
  await page.click('#trends details summary');
  assert.ok(await page.locator('#trends tbody tr').count() >= 1);
  assert.match(await page.textContent('#trends .lead'), /River stations above warning/);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  assert.deepEqual(errors, []);
  await close();
});
