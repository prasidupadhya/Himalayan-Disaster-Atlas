import { expect, test, type Page } from '@playwright/test';

const NOTICE = 'Scenario / educational estimate, not a forecast or warning';
const b64 = (value: unknown) => Buffer.from(JSON.stringify(value)).toString('base64url');
const GORKHA = { kind: 'earthquake', version: 1, preset: 'us20002926', longitude: 84.7314, latitude: 28.2305, magnitude: 7.8, mechanism: 'unspecified', rupture: { type: 'point' }, vs30: 760 };

async function open(page: Page, { path = '/simulate/', noWebGL = false, external }: { path?: string; noWebGL?: boolean; external?: string[] } = {}) {
  if (noWebGL) await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, kind: string, ...args: unknown[]) { return /webgl/i.test(kind) ? null : original.call(this, kind as '2d', ...args); } as typeof original;
  });
  if (external) page.on('request', request => { const url = new URL(request.url()); if (url.hostname !== '127.0.0.1' && !['blob:', 'data:'].includes(url.protocol)) external.push(request.url()); });
  await page.goto(path);
}
const flood = (page: Page) => page.locator('#panel-flood');
const quake = (page: Page) => page.locator('#panel-earthquake');
async function runFlood(page: Page) {
  const run = flood(page).getByRole('button', { name: 'Run scenario' });
  await expect(run).toBeDisabled();
  await flood(page).getByRole('checkbox').check();
  await run.click();
  return page.locator('[data-sim-result="flood"]');
}
async function runQuake(page: Page) {
  await page.getByRole('tab', { name: /Earthquake shaking/ }).click();
  await expect(quake(page).getByRole('heading', { name: /Choose an earthquake/ })).toBeVisible({ timeout: 20_000 });
  await quake(page).getByRole('checkbox').check();
  await quake(page).getByRole('button', { name: 'Run scenario' }).click();
  return page.locator('[data-sim-result="earthquake"]');
}

test('flood corridor run shows assumptions first, labelled ranges, UNKNOWN impacts and a shareable link', async ({ page }) => {
  const external: string[] = [];
  await open(page, { external });
  await expect(page.getByRole('note').first()).toContainText(NOTICE);
  for (const name of ['DHM', 'NDRRMA', 'BIPAD']) await expect(page.locator('.sim-notice').getByRole('link', { name })).toBeVisible();
  await expect(flood(page).getByRole('heading', { name: 'Assumptions shown before running' })).toBeVisible({ timeout: 20_000 });
  await expect(flood(page).locator('.sim-assumptions')).toContainText('not flood extents');
  const result = await runFlood(page);
  await expect(result).toBeVisible();
  await expect(result).toContainText('MODELLED · HYPOTHETICAL');
  await expect(result).toContainText(NOTICE);
  await expect(result.locator('.sim-unknown')).toContainText('UNKNOWN');
  const rows = result.getByRole('region', { name: 'Arrival and exposure by distance' }).locator('tbody tr');
  expect(await rows.count()).toBeGreaterThanOrEqual(2);
  await expect(result.getByRole('figure').first()).toContainText('Peak');
  await expect(page).toHaveURL(/\?s=/);
  await expect(page.getByRole('link', { name: /Open printable report/ })).toHaveAttribute('href', /\/simulate\/report\/\?s=/);
  await expect(page.locator('.sim-map')).toHaveAttribute('data-map-state', 'ready', { timeout: 20_000 });
  const body = await page.locator('main').innerText();
  expect(body).not.toMatch(/real[\s-]?time|will flood|deaths?:\s*\d/i);
  expect(external).toEqual([]);
});

test('invalid declarations are refused before any run', async ({ page }) => {
  await open(page);
  const volume = flood(page).getByLabel(/Hypothetical release volume/);
  await expect(volume).toBeVisible({ timeout: 20_000 });
  await volume.fill('5');
  await expect(flood(page).getByRole('alert')).toContainText('Release volume must be');
  await flood(page).getByRole('checkbox').check();
  await expect(flood(page).getByRole('button', { name: 'Run scenario' })).toBeDisabled();
});

test('earthquake replay of Gorkha 2015 keeps recorded motion and damage UNKNOWN', async ({ page }) => {
  await open(page);
  const result = await runQuake(page);
  await expect(result).toBeVisible({ timeout: 30_000 });
  await expect(result.locator('.sim-bands li')).toHaveCount(6);
  await expect(result.locator('.sim-compare')).toContainText('Recorded ground motion: UNKNOWN');
  await expect(result.locator('.sim-unknown')).toContainText('UNKNOWN');
  await expect(result.getByRole('region', { name: 'District reference points' }).locator('tbody tr')).toHaveCount(12);
  await expect(page).toHaveURL(/\?s=/);
});

test('a share link restores the scenario and the report recomputes it with input hashes', async ({ page }) => {
  await open(page, { path: `/simulate/?s=${b64({ ...GORKHA, magnitude: 7.1 })}` });
  await expect(page.getByRole('tab', { name: /Earthquake shaking/ })).toHaveAttribute('aria-selected', 'true');
  await expect(quake(page).getByLabel(/Moment magnitude/)).toHaveValue('7.1', { timeout: 20_000 });
  await page.goto(`/simulate/report/?s=${b64(GORKHA)}`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Educational earthquake shaking scenario');
  await expect(page.locator('.report-notice')).toContainText(NOTICE);
  await expect(page.locator('.report-hash').first()).toHaveText(/^[0-9a-f]{64}$/, { timeout: 30_000 });
  await expect(page.getByRole('button', { name: 'Print / save as PDF' })).toBeEnabled();
  await expect(page.getByText('Not estimated (UNKNOWN)')).toBeVisible();
  await page.goto('/simulate/report/?s=bm90LWpzb24');
  await expect(page.locator('main').getByRole('alert')).toContainText('No valid scenario');
});

test('a corrupted artifact is never used', async ({ page }) => {
  await page.route('**/data/atlas-flood-corridors/1.0.0/catalogue.json.gz', route => route.fulfill({ contentType: 'application/gzip', body: Buffer.from('tampered') }));
  await open(page);
  await expect(flood(page).getByRole('alert')).toContainText('Model inputs could not be verified', { timeout: 20_000 });
  await expect(page.locator('[data-sim-result]')).toHaveCount(0);
});

test('an unavailable release shows no result and recovers on retry', async ({ page }) => {
  await page.route('**/data/atlas-gmpe-bssa14/1.0.0/manifest.json', route => route.fulfill({ status: 503, body: '' }));
  await open(page);
  await page.getByRole('tab', { name: /Earthquake shaking/ }).click();
  await expect(quake(page).getByRole('alert')).toContainText('Model inputs could not be verified', { timeout: 20_000 });
  await page.unroute('**/data/atlas-gmpe-bssa14/1.0.0/manifest.json');
  await quake(page).getByRole('button', { name: 'Try again' }).click();
  await expect(quake(page).getByRole('heading', { name: /Choose an earthquake/ })).toBeVisible({ timeout: 20_000 });
});

test('without WebGL the map says so and every result remains in the tables', async ({ page }) => {
  await open(page, { noWebGL: true });
  await expect(page.locator('.sim-map')).toHaveAttribute('data-map-state', 'unavailable', { timeout: 20_000 });
  await expect(page.locator('.sim-map')).toContainText('WebGL');
  const result = await runFlood(page);
  await expect(result.locator('tbody tr').first()).toBeVisible();
});

test('keyboard-only run moves focus to the result heading', async ({ page }) => {
  await open(page);
  const ack = flood(page).getByRole('checkbox');
  await expect(ack).toBeVisible({ timeout: 20_000 });
  await ack.focus();
  await page.keyboard.press('Space');
  await expect(ack).toBeChecked();
  await page.keyboard.press('Tab');
  await expect(flood(page).getByRole('button', { name: 'Run scenario' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#flood-result')).toBeFocused();
  await page.getByRole('tab', { name: /Flood/ }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: /Earthquake shaking/ })).toBeFocused();
  await expect(page.getByRole('tab', { name: /Earthquake shaking/ })).toHaveAttribute('aria-selected', 'true');
});

test('Nepali interface covers the run, keeps numbers in Devanagari and the notice visible', async ({ page }) => {
  await open(page);
  await page.getByRole('button', { name: 'नेपाली' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('परिदृश्य सिमुलेटर');
  await expect(page.locator('.sim-notice')).toContainText('पूर्वानुमान वा चेतावनी होइन');
  await flood(page).getByRole('checkbox').check();
  await flood(page).getByRole('button', { name: 'परिदृश्य चलाउनुहोस्' }).click();
  const result = page.locator('[data-sim-result="flood"]');
  await expect(result).toContainText('मोडेल गरिएको · काल्पनिक');
  await expect(result.locator('.sim-headline')).toContainText(/[०-९]/);
  await expect(result.locator('.sim-unknown')).toContainText('अज्ञात (UNKNOWN)');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('परिदृश्य सिमुलेटर');
});

for (const width of [320, 390]) test(`mobile ${width}px has no sideways scroll before or after a run`, async ({ page }) => {
  await page.setViewportSize({ width, height: 800 });
  await open(page);
  await expect(flood(page).getByRole('checkbox')).toBeVisible({ timeout: 20_000 });
  const overflow = () => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(await overflow()).toBeLessThanOrEqual(0);
  const result = await runFlood(page);
  await expect(result).toBeVisible();
  expect(await overflow()).toBeLessThanOrEqual(0);
  await expect(result.locator('tbody td').first()).toBeVisible();
});
