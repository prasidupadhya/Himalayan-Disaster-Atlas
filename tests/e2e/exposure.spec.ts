import { expect, test } from '@playwright/test';

test('exposure results distinguish partial estimates and unavailable inventories, and switch map footprints', async ({ page }) => {
  const errors: string[] = [], external: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (!request.url().startsWith('http://127.0.0.1:4173') && !request.url().startsWith('blob:')) external.push(request.url()); });
  await page.goto('/atlas/');
  const exposure = page.getByRole('region', { name: 'Exposure engine', exact: true });
  await exposure.getByLabel('Exposure scenario').selectOption({ index: 1 });
  await expect(exposure.locator('[data-exposure-state]')).toHaveAttribute('data-exposure-state', 'ready');
  await expect(exposure.getByText('18,826 people (partial subtotal)', { exact: true })).toBeVisible();
  await expect(exposure.getByText('UNKNOWN — NoData or uncovered area remains', { exact: true })).toBeVisible();
  await expect(exposure.getByText('UNKNOWN — inventory unavailable', { exact: true })).toHaveCount(2);
  await exposure.getByRole('button', { name: 'Fit exposure footprint' }).click();
  await expect(exposure.locator('[data-exposure-map-ready]')).toHaveAttribute('data-exposure-map-ready', 'true');
  await page.locator('.map-shell').screenshot({ path: 'test-results/exposure-map.png' });
  await exposure.getByRole('checkbox', { name: 'Show exposure footprint and matched assets' }).uncheck();
  await exposure.getByRole('checkbox', { name: 'Show exposure footprint and matched assets' }).check();
  await exposure.getByLabel('Exposure scenario').selectOption({ index: 2 });
  await expect(exposure.locator('[data-exposure-state]')).toHaveAttribute('data-exposure-state', 'ready');
  await expect(exposure.getByText('83,914 people (partial subtotal)', { exact: true })).toBeVisible();
  await expect(exposure.getByRole('link', { name: 'Download footprint request' })).toHaveAttribute('href', /1000m/);
  await exposure.getByLabel('Exposure scenario').selectOption('');
  await expect(exposure.locator('[data-exposure-state]')).toHaveCount(0);
  expect(errors).toEqual([]); expect(external).toEqual([]);
});

test('exposure rejects corrupt spatial results and can retry missing ones', async ({ page }) => {
  const path = '**/exposure-trace-40669746-250m/1.0.0/spatial.geojson.gz';
  await page.route(path, route => route.fulfill({ status: 503, body: '' }), { times: 1 });
  await page.goto('/atlas/');
  const exposure = page.getByRole('region', { name: 'Exposure engine', exact: true });
  await exposure.getByLabel('Exposure scenario').selectOption({ index: 1 });
  await expect(exposure.locator('[data-exposure-state]')).toHaveAttribute('data-exposure-state', 'unavailable');
  await page.route(path, route => route.fulfill({ status: 200, body: 'broken' }), { times: 1 });
  await exposure.getByRole('button', { name: 'Try again' }).click();
  await expect(exposure.locator('[data-exposure-state]')).toHaveAttribute('data-exposure-state', 'error');
  await exposure.getByRole('button', { name: 'Try again' }).click();
  await expect(exposure.locator('[data-exposure-state]')).toHaveAttribute('data-exposure-state', 'ready');
});

test('exposure remains usable on mobile and without WebGL', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.addInitScript(() => { HTMLCanvasElement.prototype.getContext = (() => null) as typeof HTMLCanvasElement.prototype.getContext; });
  await page.goto('/atlas/');
  const exposure = page.getByRole('region', { name: 'Exposure engine', exact: true });
  await exposure.getByLabel('Exposure scenario').selectOption({ index: 1 });
  await expect(exposure.locator('[data-exposure-state]')).toHaveAttribute('data-exposure-state', 'ready');
  await expect(exposure.getByRole('button', { name: 'Fit exposure footprint' })).toBeDisabled();
  await exposure.getByText('Administrative summaries', { exact: false }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await exposure.screenshot({ path: 'test-results/exposure-mobile.png' });
});
