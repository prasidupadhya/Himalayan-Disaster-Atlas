import { expect, test, type Page } from '@playwright/test';

async function open(page: Page, { noWebGL = false, external, now }: { noWebGL?: boolean; external?: string[]; now?: string } = {}) {
  if (noWebGL) await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, kind: string, ...args: unknown[]) { return /webgl/i.test(kind) ? null : original.call(this, kind as '2d', ...args); } as typeof original;
  });
  if (now) await page.clock.install({ time: new Date(now) });
  if (external) page.on('request', request => { const url = new URL(request.url()); if (url.hostname !== '127.0.0.1' && !['blob:', 'data:'].includes(url.protocol)) external.push(request.url()); });
  await page.goto('/hazards/');
}
const section = (page: Page, id: string) => page.locator(`section#${id}`);

test('hub shows verified context with evidence labels, authorities, tables and provenance', async ({ page }) => {
  const external: string[] = [];
  await open(page, { external, now: '2026-10-07T12:00:00Z' });
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hazard context for Nepal');
  await expect(page.locator('.hz-notice')).toContainText('not a forecast or warning');
  for (const name of ['DHM', 'NDRRMA', 'BIPAD']) await expect(page.locator('.hz-notice').getByRole('link', { name })).toBeVisible();
  const climate = section(page, 'climate');
  await expect(climate.getByText('CURRENT SNAPSHOT')).toBeVisible({ timeout: 20_000 });
  await expect(climate.locator('.hz-legend li')).toHaveCount(8);
  await climate.getByText(/All cells for the selected month/).click();
  await expect(climate.getByRole('region', { name: 'All cells for the selected month' }).locator('tbody tr')).toHaveCount(66);
  await climate.getByRole('combobox', { name: 'Month' }).selectOption({ label: 'Oct 2025' });
  await climate.getByRole('radio', { name: 'Precipitation, % of 1991–2020 normal' }).check();
  await expect(climate.locator('.hz-view-note')).toContainText('UNKNOWN where the normal is below 0.1 mm/day');
  await expect(climate.locator('.hz-map')).toHaveAttribute('data-map-state', 'ready', { timeout: 20_000 });
  const terrain = section(page, 'terrain');
  await expect(terrain).toContainText('susceptibility, probability and hazard are UNKNOWN');
  await expect(terrain.locator('.hz-bars li')).toHaveCount(10);
  await terrain.getByRole('button', { name: 'Darchula' }).first().click();
  await expect(terrain.locator('.hz-detail')).toContainText('Darchula');
  await expect(section(page, 'gated').locator('.hz-gated li')).toHaveCount(3);
  await expect(section(page, 'gated')).toContainText('GATED · F52');
  for (const id of ['climate', 'terrain', 'evidence']) await expect(section(page, id).locator('.hz-provenance a').first()).toHaveAttribute('href', /\/data\/.+\/manifest\.json$/);
  const body = await page.locator('main').innerText();
  expect(body).not.toMatch(/real[\s-]?time|susceptibility (is|=) (high|low)|heatwave warning/i);
  expect(external).toEqual([]);
});

test('evidence analyst quotes cited passages and reports insufficient evidence honestly', async ({ page }) => {
  await open(page);
  const evidence = section(page, 'evidence');
  await evidence.getByRole('button', { name: 'Why is flood depth UNKNOWN?' }).click();
  await expect(evidence.locator('.hz-passages blockquote').first()).toBeVisible({ timeout: 20_000 });
  await expect(evidence.locator('.hz-cite').first()).toContainText(/Source:/);
  await evidence.getByLabel(/Your question/).fill('zzzxqv');
  await evidence.getByLabel(/Your question/).press('Enter');
  await expect(evidence.locator('.hz-answer-status')).toContainText('does not mean safe, absent or zero');
  await expect(evidence.locator('.hz-passages li')).toHaveCount(0);
});

test('an expired snapshot is labelled STALE without any new request', async ({ page }) => {
  await open(page, { now: '2026-12-01T00:00:00Z' });
  await expect(section(page, 'climate').locator('.hz-badge-stale')).toHaveText('STALE', { timeout: 20_000 });
  await expect(section(page, 'climate')).toContainText('refresh the release');
});

test('a corrupted artifact hides only its own panel; an unavailable release can be retried', async ({ page }) => {
  await page.route('**/data/nepal-power-gridded-context/1.0.0/context.json.gz', route => route.fulfill({ contentType: 'application/gzip', body: Buffer.from('tampered') }));
  await page.route('**/data/nepal-terrain-steepness/1.0.0/manifest.json', route => route.fulfill({ status: 503, body: '' }));
  await open(page);
  await expect(section(page, 'climate').getByRole('alert')).toContainText('could not be verified', { timeout: 20_000 });
  await expect(section(page, 'climate').locator('.hz-map')).toHaveCount(0);
  await expect(section(page, 'terrain').getByRole('alert')).toBeVisible();
  await expect(section(page, 'evidence').getByRole('button', { name: 'What is SPI-3?' })).toBeVisible();
  await page.unroute('**/data/nepal-terrain-steepness/1.0.0/manifest.json');
  await section(page, 'terrain').getByRole('button', { name: 'Try again' }).click();
  await expect(section(page, 'terrain').locator('.hz-bars li')).toHaveCount(10, { timeout: 20_000 });
});

test('without WebGL every value remains available in tables', async ({ page }) => {
  await open(page, { noWebGL: true });
  await expect(section(page, 'climate').locator('.hz-map')).toHaveAttribute('data-map-state', 'unavailable', { timeout: 20_000 });
  await expect(section(page, 'climate').locator('.hz-map')).toContainText('WebGL');
  await section(page, 'terrain').getByText('All 77 districts').click();
  await expect(section(page, 'terrain').getByRole('region', { name: 'All 77 districts' }).locator('tbody tr')).toHaveCount(77);
});

test('keyboard users can change the view and select a cell from the table', async ({ page }) => {
  await open(page);
  const climate = section(page, 'climate');
  const spi = climate.getByRole('radio', { name: 'Drought / wetness (SPI-3)' });
  await expect(spi).toBeChecked({ timeout: 20_000 });
  await spi.focus();
  await page.keyboard.press('ArrowRight');
  await expect(climate.getByRole('radio', { name: 'Precipitation, % of 1991–2020 normal' })).toBeChecked();
  await climate.getByText(/All cells for the selected month/).click();
  const first = climate.getByRole('region', { name: 'All cells for the selected month' }).getByRole('button').first();
  await first.focus();
  await page.keyboard.press('Enter');
  await expect(climate.locator('.hz-detail h3')).toContainText('Selected cell');
});

test('Nepali interface switches copy and digits and persists', async ({ page }) => {
  await open(page);
  await page.getByRole('button', { name: 'नेपाली' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('नेपालका लागि जोखिम सन्दर्भ');
  await expect(section(page, 'terrain').locator('.hz-bars li').first()).toContainText(/[०-९]/, { timeout: 20_000 });
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('नेपालका लागि जोखिम सन्दर्भ');
});

for (const width of [320, 390]) test(`mobile ${width}px has no sideways scroll`, async ({ page }) => {
  await page.setViewportSize({ width, height: 800 });
  await open(page);
  await expect(section(page, 'terrain').locator('.hz-bars li')).toHaveCount(10, { timeout: 20_000 });
  await section(page, 'climate').getByText(/All cells for the selected month/).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
});
