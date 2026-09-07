import { test, expect } from '@playwright/test';
import { createHash } from 'node:crypto';
import { gzipSync, gunzipSync } from 'node:zlib';
import { readFileSync } from 'node:fs';
import provinceManifest from '../../data/releases/nepal-admin-provinces/2.0.1/manifest.json';

const provinceManifestURL = '**/data/nepal-admin-provinces/2.0.1/manifest.json';
const provinceArtifactURL = '**/data/nepal-admin-provinces/2.0.1/features.geojson.gz';
const provinceBytes = readFileSync('data/releases/nepal-admin-provinces/2.0.1/features.geojson.gz');

test('static navigation, WebGL, boundary controls and accessible identification', async ({ page }) => {
  const errors: string[] = [];
  const external: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (!request.url().startsWith('http://127.0.0.1:4173') && !request.url().startsWith('blob:')) external.push(request.url()); });
  await page.goto('/');
  await page.getByRole('link', { name: /Explore Nepal’s boundaries/ }).click();
  const map = page.getByRole('region', { name: 'Interactive Nepal administrative boundary map' });
  await expect(map).toHaveAttribute('data-map-ready', 'true');
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.locator('.admin-map-label')).toHaveCount(7);
  const attribution = page.locator('.maplibregl-ctrl-attrib');
  await expect(attribution).not.toHaveClass(/maplibregl-compact-show/);
  await expect(attribution.locator('.maplibregl-ctrl-attrib-inner')).toBeHidden();
  await attribution.locator('.maplibregl-ctrl-attrib-button').click();
  await expect(attribution).toHaveClass(/maplibregl-compact-show/);
  await expect(attribution.locator('.maplibregl-ctrl-attrib-inner')).toBeVisible();

  await page.locator('.record-picker select').selectOption('np01');
  await expect(page.getByRole('heading', { name: 'Koshi' })).toBeVisible();
  await expect(page.getByText('NP01', { exact: true })).toBeVisible();
  await page.getByRole('checkbox', { name: 'Provinces' }).uncheck();
  await expect(page.getByRole('checkbox', { name: 'Provinces' })).not.toBeChecked();
  await page.getByRole('checkbox', { name: 'Provinces' }).check();

  await map.click({ position: { x: (await map.boundingBox())!.width / 2, y: (await map.boundingBox())!.height / 2 } });
  await expect(page.locator('.record-picker select')).toHaveValue(/^np/);
  await page.getByRole('button', { name: 'Reset view' }).click();
  await page.locator('.map-shell').screenshot({ path: 'test-results/admin-boundaries-desktop.png' });

  for (const [name, path] of [['Data catalog', '/data-catalog/'], ['Methodology', '/methodology/'], ['Sources', '/sources/']]) {
    await page.getByRole('navigation').getByRole('link', { name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.locator('main h1')).toBeVisible();
  }
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test('mobile boundary map and records fit the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/atlas/');
  await expect(page.getByRole('region', { name: 'Interactive Nepal administrative boundary map' })).toHaveAttribute('data-map-ready', 'true');
  await page.locator('.record-picker select').selectOption('np0101301');
  await expect(page.getByRole('heading', { name: 'Phungling' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator('.map-shell').screenshot({ path: 'test-results/admin-boundaries-mobile.png' });
});

test('unavailable boundary data can be retried', async ({ page }) => {
  let fail = true;
  await page.route(provinceManifestURL, route => fail ? route.fulfill({ status: 404, body: '' }) : route.continue());
  await page.goto('/atlas/');
  await expect(page.getByText('The dataset is currently unavailable.', { exact: true })).toBeVisible();
  fail = false;
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.locator('.record-picker select')).toBeEnabled();
});

test('corrupt compressed boundary data is rejected before presentation', async ({ page }) => {
  const corrupt = Buffer.from(provinceBytes);
  corrupt[100] ^= 1;
  await page.route(provinceArtifactURL, route => route.fulfill({ body: corrupt, contentType: 'application/gzip' }));
  await page.goto('/atlas/');
  await expect(page.getByRole('alert').filter({ hasText: 'The dataset could not be validated.' })).toContainText('checksum failed');
  await expect(page.getByRole('option', { name: /Koshi/ })).toHaveCount(0);
});

test('empty and stale boundary states are explicit', async ({ page }) => {
  const emptyArtifact = gzipSync(JSON.stringify({ type: 'FeatureCollection', features: [] }));
  const emptyManifest = structuredClone(provinceManifest);
  emptyManifest.artifact.sha256 = createHash('sha256').update(emptyArtifact).digest('hex');
  emptyManifest.artifact.byte_size = emptyArtifact.byteLength;
  await page.route(provinceManifestURL, route => route.fulfill({ json: emptyManifest }));
  await page.route(provinceArtifactURL, route => route.fulfill({ body: emptyArtifact, contentType: 'application/gzip' }));
  await page.goto('/atlas/');
  await expect(page.getByText('No features are available in this dataset.')).toBeVisible();

  await page.unroute(provinceArtifactURL);
  await page.unroute(provinceManifestURL);
  await page.clock.install({ time: new Date('2026-11-01T00:00:00Z') });
  await page.reload();
  await expect(page.getByText(/passed its update deadline/)).toBeVisible();
  await expect(page.locator('option[value="np01"]')).toHaveCount(1);
});

test('WebGL unavailable preserves accessible boundary records', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, kind: string, ...args: unknown[]) {
      if (kind.includes('webgl')) return null;
      return Reflect.apply(original, this, [kind, ...args]);
    } as typeof original;
  });
  await page.goto('/atlas/');
  await expect(page.getByText(/Interactive mapping is unavailable/)).toBeVisible();
  await page.locator('.record-picker select').selectOption('np04');
  await expect(page.getByRole('heading', { name: 'Gandaki' })).toBeVisible();
});

test('checked-in province artifact is valid gzip', () => {
  expect(JSON.parse(gunzipSync(provinceBytes).toString()).features).toHaveLength(7);
});
