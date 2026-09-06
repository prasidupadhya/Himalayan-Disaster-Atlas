import { test, expect } from '@playwright/test';
import metadata from '../../data/releases/foundation-sample/1.0.0/manifest.json';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const manifestURL = '**/data/foundation-sample/1.0.0/manifest.json';
const raw = readFileSync('data/releases/foundation-sample/1.0.0/features.geojson', 'utf8');

test('static navigation, real WebGL, layer controls and accessible selection', async ({ page }) => {
  const errors: string[] = [];
  const external: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('request', request => { if (!request.url().startsWith('http://127.0.0.1:4173') && !request.url().startsWith('blob:')) external.push(request.url()); });
  await page.goto('/');
  await page.getByRole('link', { name: /Explore the sample atlas/ }).click();
  const map = page.getByRole('region', { name: 'Interactive synthetic sample map' });
  await expect(map).toHaveAttribute('data-map-ready', 'true');
  await expect(page.locator('canvas')).toBeVisible();
  // Independently project fixture A into the fitted Mercator viewport.
  const box = (await map.boundingBox())!;
  const radians = Math.PI / 180;
  const mercator = (lat: number) => Math.log(Math.tan(Math.PI / 4 + lat * radians / 2));
  const scale = Math.min((box.width - 120) / radians, (box.height - 120) / (mercator(28.5) - mercator(27.5)));
  const pointA = { x: box.width / 2 - .2 * radians * scale, y: box.height / 2 - (mercator(28.1) - (mercator(28.5) + mercator(27.5)) / 2) * scale };
  await map.click({ position: pointA });
  await expect(page.getByRole('heading', { name: 'Synthetic point A' })).toBeVisible();
  await page.getByRole('checkbox', { name: 'Synthetic points' }).uncheck();
  await expect(page.getByRole('checkbox', { name: 'Synthetic points' })).not.toBeChecked();
  await page.getByRole('button', { name: 'Synthetic point B' }).click();
  await map.click({ position: pointA });
  await expect(page.getByRole('heading', { name: 'Synthetic point B' })).toBeVisible();
  await page.getByRole('checkbox', { name: 'Synthetic points' }).check();
  await map.click({ position: pointA });
  await expect(page.getByRole('heading', { name: 'Synthetic point A' })).toBeVisible();
  await page.getByRole('button', { name: 'Synthetic point A' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Synthetic point A' })).toBeVisible();
  await expect(page.getByText('Measurement: UNKNOWN')).toBeVisible();
  await page.getByRole('button', { name: 'Reset view' }).click();
  await page.screenshot({ path: 'test-results/atlas-desktop.png', fullPage: true });
  for (const [name, path] of [['Data catalog', '/data-catalog/'], ['Methodology', '/methodology/'], ['Sources', '/sources/']]) {
    await page.getByRole('navigation').getByRole('link', { name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.locator('main h1')).toBeVisible();
  }
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test('mobile map and controls fit the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/atlas/');
  await expect(page.getByRole('region', { name: 'Interactive synthetic sample map' })).toHaveAttribute('data-map-ready', 'true');
  await page.getByRole('button', { name: 'Synthetic point B' }).click();
  await expect(page.getByText('Measurement: UNKNOWN')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const reset = page.getByRole('button', { name: 'Reset view' });
  await reset.scrollIntoViewIfNeeded();
  const resetBox = (await reset.boundingBox())!;
  const attributionBox = (await page.locator('.maplibregl-ctrl-attrib').boundingBox())!;
  expect(resetBox.y + resetBox.height).toBeLessThanOrEqual(attributionBox.y);
  await reset.click();
  await page.screenshot({ path: 'test-results/atlas-mobile.png', fullPage: true });
});

test('unavailable data can be retried', async ({ page }) => {
  let fail = true;
  await page.route(manifestURL, route => fail ? route.fulfill({ status: 404, body: '' }) : route.continue());
  await page.goto('/atlas/');
  await expect(page.getByText('The dataset is currently unavailable.', { exact: true })).toBeVisible();
  fail = false;
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByRole('button', { name: 'Synthetic point A' })).toBeVisible();
});

test('corrupt data is rejected before presentation', async ({ page }) => {
  await page.route('**/features.geojson', route => route.fulfill({ body: raw.replace('point A', 'point X'), contentType: 'application/json' }));
  await page.goto('/atlas/');
  await expect(page.getByRole('alert').filter({ hasText: 'The dataset could not be validated.' })).toContainText('checksum failed');
  await expect(page.getByRole('button', { name: 'Synthetic point X' })).toHaveCount(0);
});

test('empty and stale states are explicit', async ({ page }) => {
  const content = JSON.stringify({ type: 'FeatureCollection', features: [] });
  const manifest = structuredClone(metadata);
  manifest.artifact.sha256 = createHash('sha256').update(content).digest('hex');
  manifest.artifact.byte_size = Buffer.byteLength(content);
  await page.route(manifestURL, route => route.fulfill({ json: manifest }));
  await page.route('**/features.geojson', route => route.fulfill({ body: content, contentType: 'application/json' }));
  await page.goto('/atlas/');
  await expect(page.getByText('No features are available in this dataset.')).toBeVisible();
  await page.unroute('**/features.geojson');
  await page.unroute(manifestURL);
  await page.clock.install({ time: new Date('2026-09-08T00:00:00Z') });
  await page.route(manifestURL, route => route.fulfill({ json: { ...metadata, update_frequency: 'periodic', stale_after: '2026-09-07T00:00:00Z' } }));
  await page.reload();
  await expect(page.getByText(/passed its update deadline/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Synthetic point A' })).toBeVisible();
});

test('WebGL unavailable preserves accessible records', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, kind: string, ...args: unknown[]) {
      if (kind.includes('webgl')) return null;
      return Reflect.apply(original, this, [kind, ...args]);
    } as typeof original;
  });
  await page.goto('/atlas/');
  await expect(page.getByText(/Interactive mapping is unavailable/)).toBeVisible();
  await page.getByRole('button', { name: 'Synthetic point C' }).click();
  await expect(page.getByText('Measurement: UNKNOWN')).toBeVisible();
});
