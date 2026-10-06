import { expect, test, type Page } from '@playwright/test';

const fixture = '/data/atlas-live-contracts/1.0.0/';
const result = (page: Page) => page.getByRole('region', { name: 'Synthetic live contract result' });
async function open(page: Page) {
  await page.goto('/data-catalog/#live-contract-checks');
  await page.getByText('Inspect synthetic contract cases', { exact: true }).click();
}
async function verify(page: Page, selected = 'ready') {
  await page.getByLabel('Contract case', { exact: true }).selectOption(selected);
  await page.getByRole('button', { name: 'Verify synthetic contract', exact: true }).click();
}
test.beforeEach(async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-06T12:01:00Z') });
});

test('verified synthetic artifacts keep evidence, unknown outputs and authority links visible', async ({ page }) => {
  const external: string[] = [];
  page.on('request', request => { if (new URL(request.url()).hostname !== '127.0.0.1') external.push(request.url()); });
  await open(page);
  await verify(page);
  await expect(result(page)).toHaveAttribute('data-live-contract-state', 'ready');
  await expect(page.getByText('SYNTHETIC FIXTURE — not current conditions.', { exact: true })).toBeVisible();
  await expect(result(page)).toContainText('HEALTHY');
  await expect(result(page)).toContainText('2026-10-06T12:00:00Z');
  await expect(result(page).locator('dd').filter({ hasText: /^UNKNOWN$/ })).toHaveCount(8);
  await expect(page.getByText('Scenario / educational estimate, not a forecast or warning', { exact: true })).toBeVisible();
  for (const name of ['DHM', 'NDRRMA', 'BIPAD']) await expect(page.getByRole('region', { name: 'Live contract verification' }).getByRole('link', { name, exact: true })).toHaveAttribute('href', /^https:\/\//);
  expect(external).toEqual([]);
});

test('a displayed snapshot expires without a new fetch and stays stale after tab resume', async ({ page }) => {
  await open(page); await verify(page);
  await expect(result(page)).toHaveAttribute('data-live-contract-state', 'ready');
  const snapshotReads: string[] = [];
  page.on('request', request => { if (request.url().includes('snapshot-')) snapshotReads.push(request.url()); });
  await page.clock.fastForward(6 * 60 * 60 * 1000);
  await expect(result(page)).toHaveAttribute('data-live-contract-state', 'stale');
  await expect(result(page)).toContainText('2026-10-06T12:00:00Z');
  await page.evaluate(() => { window.dispatchEvent(new Event('pageshow')); document.dispatchEvent(new Event('visibilitychange')); });
  await expect(result(page)).toHaveAttribute('data-live-contract-state', 'stale');
  expect(snapshotReads).toEqual([]);
});

test('valid empty, failed fetch, unconfigured feed and unknown freshness stay distinct', async ({ page }) => {
  await open(page);
  for (const [selected, state, message] of [
    ['empty', 'empty', 'not a failed fetch or an all-clear'],
    ['failed', 'stale', 'Latest fetch failed'],
    ['unavailable', 'unavailable', 'No verified snapshot'],
    ['unknown', 'stale', 'Source freshness is UNKNOWN'],
  ]) {
    await verify(page, selected);
    await expect(result(page)).toHaveAttribute('data-live-contract-state', state);
    await expect(result(page)).toContainText(message);
    if (selected === 'failed') await expect(result(page)).toContainText('FAILED');
    if (selected === 'empty') await expect(result(page)).toContainText('HEALTHY');
  }
});

test('absent data is unavailable and retry can recover to a verified empty snapshot', async ({ page }) => {
  await page.route(`**${fixture}index-empty.json`, route => route.fulfill({ status: 404, body: 'Missing' }));
  await open(page); await verify(page, 'empty');
  await expect(result(page)).toHaveAttribute('data-live-contract-state', 'unavailable');
  await page.unroute(`**${fixture}index-empty.json`);
  await verify(page, 'empty');
  await expect(result(page)).toHaveAttribute('data-live-contract-state', 'empty');
});

for (const file of ['index-ready.json', 'snapshot-ready.json']) test(`corrupted ${file} fails closed without rendering its content`, async ({ page }) => {
  await page.route(`**${fixture}${file}`, route => route.fulfill({ contentType: 'application/json', body: '{"label":"UNVERIFIED INJECTED DATA"}' }));
  await open(page); await verify(page);
  await expect(result(page)).toHaveAttribute('data-live-contract-state', 'error');
  await expect(result(page)).toContainText('checksum mismatch');
  await expect(result(page)).not.toContainText('UNVERIFIED INJECTED DATA');
  await page.unroute(`**${fixture}${file}`);
  await verify(page);
  await expect(result(page)).toHaveAttribute('data-live-contract-state', 'ready');
});

test('contract records remain usable when WebGL is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, kind: string, ...args: unknown[]) {
      if (/webgl/i.test(kind)) return null;
      return original.call(this, kind as '2d', ...args);
    } as typeof original;
  });
  await open(page); await verify(page, 'failed');
  await expect(result(page)).toHaveAttribute('data-live-contract-state', 'stale');
  await expect(result(page)).toContainText('UNKNOWN');
});

for (const width of [320, 390]) test(`contract checks fit a ${width}px mobile viewport`, async ({ page }) => {
  await page.setViewportSize({ width, height: 844 });
  await open(page); await verify(page);
  await expect(result(page)).toHaveAttribute('data-live-contract-state', 'ready');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
  await expect(page.getByLabel('Contract case', { exact: true })).toBeVisible();
});

test('keyboard-only users can expand, choose and verify a case with an announced result', async ({ page }) => {
  await page.goto('/data-catalog/#live-contract-checks');
  const summary = page.getByText('Inspect synthetic contract cases', { exact: true });
  for (let i = 0; i < 220 && !(await summary.evaluate(element => element === document.activeElement)); i++) await page.keyboard.press('Tab');
  await expect(summary).toBeFocused();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Contract case', { exact: true })).toBeFocused();
  await page.keyboard.press('u');
  await expect(page.getByLabel('Contract case', { exact: true })).toHaveValue('unknown');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Verify synthetic contract', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(result(page)).toHaveAttribute('data-live-contract-state', 'stale');
  await expect(result(page).getByRole('status')).toHaveText('Contract resource: STALE');
});

test('fixtures are opt-in catalog records with traceable methodology and source links', async ({ page }) => {
  await page.goto('/data-catalog/');
  await page.getByLabel('Search datasets', { exact: true }).fill('atlas-live-contracts');
  await expect(page.locator('.catalog-results')).not.toContainText('Live contract verification fixtures');
  await page.getByLabel('Include superseded releases and development fixtures').check();
  await page.locator('.catalog-record').first().click();
  await expect(page.locator('#catalog-detail')).toContainText('SYNTHETIC_FIXTURE');
  await expect(page.locator('#catalog-detail')).toContainText('MIT');
  await expect(page.locator('#catalog-detail').getByRole('link', { name: 'Methodology', exact: true })).toHaveAttribute('href', '/methodology/#live-contracts-method');
  await page.goto('/methodology/#live-contracts-method');
  await expect(page.locator('#live-contracts-method')).toBeVisible();
  await page.goto('/sources/#live-contracts');
  await expect(page.locator('#live-contracts')).toBeVisible();
});
