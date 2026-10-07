import { expect, test, type Page } from '@playwright/test';
import { conditionsFixture, GFS_PATH, NORMAL_NOW, STALE_NOW, USGS_PATH, type FeedCase } from '../helpers/live-conditions';

interface Setup { usgs?: FeedCase; gfs?: FeedCase; now?: string; corruptGfs?: boolean; noWebGL?: boolean; external?: string[] }
async function setup(page: Page, { usgs = 'normal', gfs = 'normal', now = NORMAL_NOW, corruptGfs = false, noWebGL = false, external }: Setup = {}) {
  const f = conditionsFixture(usgs, gfs);
  if (noWebGL) await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, kind: string, ...args: unknown[]) { return /webgl/i.test(kind) ? null : original.call(this, kind as '2d', ...args); } as typeof original;
  });
  if (external) page.on('request', request => { const url = new URL(request.url()); if (url.hostname !== '127.0.0.1' && url.protocol !== 'blob:' && url.protocol !== 'data:') external.push(request.url()); });
  await page.clock.install({ time: new Date(now) });
  await page.route('**/live/latest.json', route => route.fulfill({ json: f.index }));
  await page.route(`**${USGS_PATH}`, route => route.fulfill({ contentType: 'application/json', body: f.usgsRaw }));
  await page.route(`**${GFS_PATH}`, route => route.fulfill({ contentType: 'application/json', body: corruptGfs ? '{"tampered":true}' : f.gfsRaw }));
  await page.goto('/live/');
  return f;
}
const card = (page: Page, name: string) => page.getByRole('article', { name: `${name} status`, exact: true });
const bulletin = (page: Page) => page.getByRole('region', { name: /Conditions bulletin|अवस्था बुलेटिन/ });
const section = (page: Page, id: string) => page.locator(`[data-section="${id}"]`);

test('normal publication shows verified records with source, times, freshness and authority links', async ({ page }) => {
  const external: string[] = [];
  await setup(page, { external });
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Periodically updated conditions');
  await expect(page.locator('[data-workflow-health]')).toHaveText('HEALTHY');
  await expect(card(page, 'USGS earthquake summaries')).toHaveAttribute('data-freshness', 'FRESH');
  await expect(card(page, 'NOAA GFS precipitation forecast')).toHaveAttribute('data-freshness', 'FRESH');
  await expect(section(page, 'earthquakes')).toContainText('REPORTED EVENT');
  await expect(section(page, 'forecast')).toContainText('MODEL FORECAST');
  await expect(section(page, 'warnings')).toContainText('OFFICIAL WARNING');
  await expect(section(page, 'warnings')).toContainText('does not mean there are no warnings');
  await expect(section(page, 'forecast')).toContainText('range from 0 to 30 mm. Cells with a value: 5 of 6. UNKNOWN cells: 1.');
  await expect(section(page, 'impacts')).toContainText('Damage, loss, inundation and casualties: UNKNOWN');
  const quakes = page.getByRole('region', { name: 'Earthquake summaries table' });
  await expect(quakes.getByRole('row')).toHaveCount(2);
  await expect(quakes.getByRole('row').nth(1)).toContainText('TEST ONLY synthetic earthquake');
  await expect(quakes.getByRole('row').nth(1)).toContainText('2026-10-06 11:00 UTC (16:45 NPT)');
  await expect(quakes.getByRole('row').nth(1)).toContainText('2026-10-06 12:00 UTC');
  await expect(quakes.getByRole('row').nth(1)).toContainText('USGS');
  await expect(quakes.getByRole('row').nth(1)).toContainText('FRESH');
  const grid = page.getByRole('region', { name: 'Model precipitation grid table' });
  await expect(grid.getByRole('row')).toHaveCount(7);
  await expect(grid.getByRole('row').nth(2)).toContainText('UNKNOWN');
  for (const name of ['DHM', 'NDRRMA', 'BIPAD']) await expect(page.getByRole('complementary', { name: 'Official warning authorities' }).getByRole('link', { name: new RegExp(`^${name}`) })).toBeVisible();
  await expect(page.locator('.live-map-shell')).toHaveAttribute('data-map-state', 'ready', { timeout: 20_000 });
  const body = await page.locator('main').innerText();
  expect(body).not.toMatch(/real[\s-]?time/i);
  expect(body).toContain('Periodically updated conditions');
  expect(external).toEqual([]);
});

test('stale feeds and workflow are labelled STALE after their deadlines without a new fetch', async ({ page }) => {
  await setup(page);
  await expect(card(page, 'USGS earthquake summaries')).toHaveAttribute('data-freshness', 'FRESH');
  await page.clock.setSystemTime(new Date(STALE_NOW));
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  await expect(card(page, 'USGS earthquake summaries')).toHaveAttribute('data-freshness', 'STALE');
  await expect(card(page, 'NOAA GFS precipitation forecast')).toHaveAttribute('data-freshness', 'STALE');
  await expect(page.locator('[data-workflow-health]')).toHaveText('STALE');
  await expect(section(page, 'earthquakes')).toContainText('STALE — last verified snapshot.');
});

test('valid empty and failed fetches stay distinct', async ({ page }) => {
  await setup(page, { usgs: 'empty', gfs: 'failed' });
  await expect(card(page, 'USGS earthquake summaries')).toHaveAttribute('data-feed-state', 'empty');
  await expect(section(page, 'earthquakes')).toContainText('This is not an all-clear');
  await expect(section(page, 'earthquakes')).not.toContainText('STALE');
  await expect(page.locator('.live-table-section[data-feed-state="empty"]')).toContainText('not a failed fetch or an all-clear');
  await expect(card(page, 'NOAA GFS precipitation forecast')).toHaveAttribute('data-freshness', 'STALE');
  await expect(card(page, 'NOAA GFS precipitation forecast')).toContainText('Latest fetch failed');
  await expect(card(page, 'NOAA GFS precipitation forecast')).toContainText('FAILED (timeout)');
  await expect(page.locator('[data-workflow-health]')).toHaveText('PARTIAL');
});

test('unavailable feed shows no readings and no implied values', async ({ page }) => {
  await setup(page, { usgs: 'unavailable' });
  await expect(card(page, 'USGS earthquake summaries')).toHaveAttribute('data-freshness', 'UNAVAILABLE');
  await expect(section(page, 'earthquakes')).toContainText('UNAVAILABLE — no verified snapshot.');
  await expect(page.getByText('TEST ONLY synthetic earthquake')).toHaveCount(0);
  await expect(card(page, 'NOAA GFS precipitation forecast')).toHaveAttribute('data-freshness', 'FRESH');
});

test('corrupted snapshot is withheld, the other feed stays usable and retry recovers', async ({ page }) => {
  const f = await setup(page, { corruptGfs: true });
  await expect(card(page, 'NOAA GFS precipitation forecast')).toHaveAttribute('data-feed-state', 'error');
  await expect(card(page, 'NOAA GFS precipitation forecast')).toContainText('checksum');
  await expect(section(page, 'forecast')).toContainText('verification failed; content withheld');
  await expect(page.getByRole('region', { name: 'Model precipitation grid table' })).toHaveCount(0);
  await expect(card(page, 'USGS earthquake summaries')).toHaveAttribute('data-freshness', 'FRESH');
  await page.unroute(`**${GFS_PATH}`);
  await page.route(`**${GFS_PATH}`, route => route.fulfill({ contentType: 'application/json', body: f.gfsRaw }));
  await page.getByRole('button', { name: 'Check for a newer publication' }).click();
  await expect(card(page, 'NOAA GFS precipitation forecast')).toHaveAttribute('data-freshness', 'FRESH');
});

test('corrupted index fails closed with retry', async ({ page }) => {
  await page.route('**/live/latest.json', route => route.fulfill({ body: '{"kind":"live-index"}' }));
  await page.goto('/live/');
  await expect(page.locator('.live-problem[role="alert"]')).toContainText('could not be verified');
  await expect(section(page, 'earthquakes')).toContainText('UNAVAILABLE');
  await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();
});

test('the shipped unconfigured index is explicit and implies no readings', async ({ page }) => {
  await page.goto('/live/');
  await expect(page.getByText('No live publication is pinned to this deployment.').first()).toBeVisible();
  await expect(card(page, 'USGS earthquake summaries')).toHaveAttribute('data-freshness', 'UNAVAILABLE');
  await expect(page.locator('[data-workflow-health]')).toHaveText('UNAVAILABLE');
});

test('air quality stays disabled and is never requested', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => { if (/openaq|air-quality/i.test(request.url())) requests.push(request.url()); });
  await setup(page);
  const aq = page.getByRole('article', { name: 'Air quality availability' });
  await expect(aq).toContainText('OFF in the public build');
  await expect(aq).toContainText('AQI: UNKNOWN');
  await expect(section(page, 'air-quality')).toContainText('OFF');
  expect(requests).toEqual([]);
});

test('records remain usable without WebGL on a 320px screen', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 760 });
  await setup(page, { noWebGL: true });
  await expect(page.locator('.live-map-shell')).toHaveAttribute('data-map-state', 'unavailable');
  await expect(page.locator('.live-map-shell')).toContainText('Every verified record remains listed in the tables below');
  await expect(page.getByRole('region', { name: 'Earthquake summaries table' }).getByRole('row')).toHaveCount(2);
  await expect(page.getByRole('region', { name: 'Model precipitation grid table' }).getByRole('row')).toHaveCount(7);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});

test('mobile 390px layout fits and keeps the bulletin before the map', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await setup(page);
  await expect(card(page, 'USGS earthquake summaries')).toHaveAttribute('data-freshness', 'FRESH');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  const bulletinTop = await bulletin(page).evaluate(element => element.getBoundingClientRect().top);
  const mapTop = await page.locator('.live-map-section').evaluate(element => element.getBoundingClientRect().top);
  expect(bulletinTop).toBeLessThan(mapTop);
});

test('keyboard-only users can switch the bulletin to Nepali and reach the records', async ({ page }) => {
  await setup(page);
  await expect(card(page, 'USGS earthquake summaries')).toHaveAttribute('data-freshness', 'FRESH');
  const nepali = page.getByRole('button', { name: 'नेपाली' });
  for (let i = 0; i < 80 && !(await nepali.evaluate(element => element === document.activeElement)); i++) await page.keyboard.press('Tab');
  await expect(nepali).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(nepali).toHaveAttribute('aria-pressed', 'true');
  const body = bulletin(page).locator('.live-bulletin-body[lang="ne"]');
  await expect(body).toContainText('आवधिक रूपमा अद्यावधिक गरिएको अवस्था');
  await expect(body).toContainText('११:०० UTC (१६:४५ नेपाली समय)');
  await expect(body.locator('[data-section="warnings"]')).toContainText('आधिकारिक चेतावनी');
  expect(await body.innerText()).not.toMatch(/real[\s-]?time|वास्तविक समय/i);
  const skip = page.getByRole('link', { name: 'Skip map to record tables' });
  for (let i = 0; i < 20 && !(await skip.evaluate(element => element === document.activeElement)); i++) await page.keyboard.press('Tab');
  await expect(skip).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#live-records')).toBeInViewport();
});

test('layer toggles are keyboard operable and announce status in text', async ({ page }) => {
  await setup(page);
  const toggle = page.getByRole('checkbox', { name: /Reported earthquake epicentres/ });
  await toggle.focus(); await page.keyboard.press('Space');
  await expect(toggle).not.toBeChecked();
  await expect(page.getByRole('status').filter({ hasText: 'Workflow health HEALTHY' })).toBeVisible();
});
