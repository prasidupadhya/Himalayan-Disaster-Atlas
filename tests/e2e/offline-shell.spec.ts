import { expect, test, type BrowserContext, type Page } from '@playwright/test';
import { conditionsFixture, GFS_PATH, NORMAL_NOW, STALE_NOW, USGS_PATH } from '../helpers/live-conditions';

// This suite exercises the real service worker; every other suite blocks workers so page.route stays authoritative.
test.use({ serviceWorkers: 'allow' });
test.describe.configure({ timeout: 90_000 });

const card = (page: Page, name: string) => page.getByRole('article', { name: `${name} status`, exact: true });
const USGS = 'USGS earthquake summaries', GFS = 'NOAA GFS precipitation forecast';

/** Context-level routes reach the service worker's own fetches. `network.up` simulates connectivity for them. */
async function serve(context: BrowserContext) {
  const f = conditionsFixture();
  const network = { up: true };
  const reply = (body: string) => (route: Parameters<Parameters<BrowserContext['route']>[1]>[0]) => network.up ? route.fulfill({ contentType: 'application/json', body }) : route.abort('internetdisconnected');
  await context.route('**/live/latest.json', reply(JSON.stringify(f.index)));
  await context.route(`**${USGS_PATH}`, reply(f.usgsRaw));
  await context.route(`**${GFS_PATH}`, reply(f.gfsRaw));
  return network;
}
async function controlledLivePage(page: Page) {
  await page.clock.install({ time: new Date(NORMAL_NOW) });
  await page.goto('/live/');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller), { timeout: 30_000 }).toBe(true);
  // Reload under the worker's control so the live responses pass through it and are stored.
  await page.reload();
  await expect(card(page, USGS)).toHaveAttribute('data-freshness', 'FRESH');
  await expect(card(page, GFS)).toHaveAttribute('data-freshness', 'FRESH');
  await expect.poll(() => page.evaluate(async () => (await (await caches.open('atlas-live-v1')).keys()).length)).toBe(3);
}
async function goOffline(context: BrowserContext, network: { up: boolean }) { network.up = false; await context.setOffline(true); }
async function goOnline(context: BrowserContext, network: { up: boolean }) { network.up = true; await context.setOffline(false); }

test('offline reload serves the shell and labels stored live data LAST KNOWN, never FRESH; reconnecting rechecks', async ({ page, context }) => {
  const network = await serve(context);
  await controlledLivePage(page);
  await expect(page.locator('.live-health')).toHaveAttribute('data-delivery', 'network');

  await goOffline(context, network);
  await expect(page.locator('.offline-banner')).toBeVisible();
  await expect(card(page, USGS)).toHaveAttribute('data-freshness', 'LAST_KNOWN');

  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Periodically updated conditions');
  await expect(page.locator('.offline-banner')).toContainText('nothing has been rechecked');
  for (const name of [USGS, GFS]) {
    await expect(card(page, name)).toHaveAttribute('data-delivery', 'last-known');
    await expect(card(page, name)).toHaveAttribute('data-freshness', 'LAST_KNOWN');
    await expect(card(page, name)).toContainText('not rechecked');
  }
  await expect(page.locator('.live-health')).toHaveAttribute('data-delivery', 'last-known');
  await expect(page.locator('.live-health')).toContainText('LAST KNOWN');
  await expect(page.locator('[data-section="earthquakes"]')).toContainText('LAST KNOWN copy saved');
  await expect(page.locator('[data-freshness="FRESH"]')).toHaveCount(0);
  await expect(page.locator('main')).not.toContainText(/✓ FRESH/);
  await expect(page.getByRole('region', { name: 'Earthquake summaries table' }).getByRole('row')).toHaveCount(2);

  await goOnline(context, network);
  await expect(card(page, USGS)).toHaveAttribute('data-freshness', 'FRESH');
  await expect(card(page, USGS)).toHaveAttribute('data-delivery', 'network');
  await expect(page.locator('.offline-banner')).toHaveCount(0);
});

test('a last-known copy past its source deadline is LAST KNOWN · STALE', async ({ page, context }) => {
  const network = await serve(context);
  await controlledLivePage(page);
  await goOffline(context, network);
  await page.reload();
  await expect(card(page, GFS)).toHaveAttribute('data-freshness', 'LAST_KNOWN');
  await page.clock.setSystemTime(new Date(STALE_NOW));
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  await expect(card(page, GFS)).toHaveAttribute('data-freshness', 'STALE');
  await expect(card(page, GFS).locator('.live-freshness')).toHaveText(/LAST KNOWN · STALE/);
  await expect(page.locator('[data-section="forecast"]')).toContainText('STALE — last verified snapshot.');
});

test('a corrupted stored snapshot is purged instead of served offline', async ({ page, context }) => {
  const network = await serve(context);
  await controlledLivePage(page);
  await page.evaluate(async path => {
    const cache = await caches.open('atlas-live-v1');
    const stored = (await cache.match(path))!;
    await cache.put(path, new Response('{"tampered":true}', { headers: stored.headers }));
  }, GFS_PATH);
  await goOffline(context, network);
  await page.reload();
  await expect(card(page, USGS)).toHaveAttribute('data-freshness', 'LAST_KNOWN');
  await expect(card(page, GFS)).toHaveAttribute('data-feed-state', 'error');
  await expect(page.getByRole('region', { name: 'Model precipitation grid table' })).toHaveCount(0);
  expect(await page.evaluate(async path => !!(await (await caches.open('atlas-live-v1')).match(path)), GFS_PATH)).toBe(false);
});

test('an expired stored publication is deleted and the page shows no readings', async ({ page, context }) => {
  const network = await serve(context);
  await controlledLivePage(page);
  await page.evaluate(async () => {
    const cache = await caches.open('atlas-live-v1');
    const stored = (await cache.match('/live/latest.json'))!;
    const headers = new Headers(stored.headers);
    headers.set('x-atlas-cached-at', new Date(Date.now() - 30 * 86_400_000).toISOString());
    await cache.put('/live/latest.json', new Response(await stored.arrayBuffer(), { headers }));
  });
  await goOffline(context, network);
  await page.reload();
  await expect(page.locator('.live-problem')).toContainText('is unavailable');
  await expect(page.locator('[data-section="earthquakes"]')).toContainText('UNAVAILABLE');
  await expect(page.getByText('TEST ONLY synthetic earthquake')).toHaveCount(0);
  expect(await page.evaluate(async () => (await caches.keys()).includes('atlas-live-v1'))).toBe(false);
});

test('pages outside the shell show the offline page; mobile and no-WebGL stay usable offline', async ({ page, context }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, kind: string, ...args: unknown[]) { return /webgl/i.test(kind) ? null : original.call(this, kind as '2d', ...args); } as typeof original;
  });
  const network = await serve(context);
  await controlledLivePage(page);
  await goOffline(context, network);
  await page.setViewportSize({ width: 320, height: 760 });
  await page.goto('/atlas/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('This page is not saved on this device.');
  await expect(page.getByRole('link', { name: 'Live conditions (last known copy)' })).toBeVisible();
  await page.getByRole('link', { name: 'Live conditions (last known copy)' }).click();
  await expect(card(page, USGS)).toHaveAttribute('data-freshness', 'LAST_KNOWN');
  await expect(page.locator('.live-map-shell')).toHaveAttribute('data-map-state', 'unavailable');
  await expect(page.getByRole('region', { name: 'Model precipitation grid table' }).getByRole('row')).toHaveCount(7);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});

test('keyboard users can reach the offline bulletin in Nepali with last-known wording', async ({ page, context }) => {
  const network = await serve(context);
  await controlledLivePage(page);
  await goOffline(context, network);
  await page.reload();
  const nepali = page.getByRole('button', { name: 'नेपाली' });
  for (let i = 0; i < 80 && !(await nepali.evaluate(element => element === document.activeElement)); i++) await page.keyboard.press('Tab');
  await expect(nepali).toBeFocused();
  await page.keyboard.press('Enter');
  const body = page.locator('.live-bulletin-body[lang="ne"]');
  await expect(body).toContainText('पछिल्लो ज्ञात');
  await expect(body).toContainText('पुनः जाँच गरिएको छैन');
  await expect(body).not.toContainText('ताजा');
});

test('the worker script is served uncached with the shell manifest pinned', async ({ request }) => {
  const response = await request.get('/sw.js');
  expect(response.ok()).toBe(true);
  // The Cloudflare host applies _headers; a plain static server (research profile) does not, so verify the shipped rule itself there.
  const header = response.headers()['cache-control'];
  if (header !== undefined) expect(header).toContain('no-cache');
  else expect((await (await request.get('/_headers')).text())).toMatch(/^\/sw\.js\n {2}Cache-Control: no-cache, no-transform$/m);
  const source = await response.text();
  const config = JSON.parse(source.match(/\/\*@atlas-config\*\/([\s\S]*?)\/\*@end\*\//)![1]);
  expect(config.shell.map((entry: { url: string }) => entry.url)).toEqual(expect.arrayContaining(['/', '/live/', '/offline/']));
  for (const entry of config.shell.slice(0, 5)) expect((await request.get(entry.url)).ok()).toBe(true);
});

test('hazards and the simulator work offline after one online visit, from verified cached releases', async ({ page, context }) => {
  const network = await serve(context);
  await page.goto('/hazards/');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller), { timeout: 30_000 }).toBe(true);
  await page.reload();
  await expect(page.locator('section#terrain .hz-bars li')).toHaveCount(10, { timeout: 30_000 });
  await expect(page.locator('section#climate .hz-legend')).toBeVisible();
  await page.goto('/simulate/');
  await expect(page.locator('#panel-flood').getByRole('checkbox')).toBeVisible({ timeout: 30_000 });
  await expect.poll(() => page.evaluate(async () => (await (await caches.open('atlas-data-v1')).keys()).length)).toBeGreaterThan(5);

  await goOffline(context, network);
  await page.goto('/hazards/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hazard context for Nepal');
  await expect(page.locator('section#terrain .hz-bars li')).toHaveCount(10, { timeout: 30_000 });
  await expect(page.locator('section#climate').getByRole('alert')).toHaveCount(0);
  await page.goto('/simulate/');
  await page.locator('#panel-flood').getByRole('checkbox').check();
  await page.locator('#panel-flood').getByRole('button', { name: 'Run scenario' }).click();
  await expect(page.locator('[data-sim-result="flood"]')).toContainText('MODELLED · HYPOTHETICAL');
  await goOnline(context, network);
});
