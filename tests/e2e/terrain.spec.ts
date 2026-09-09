import { test, expect } from '@playwright/test';

test('terrain renders locally, toggles and inspects elevation independently of exaggeration', async ({ page, baseURL }) => {
  const errors: string[] = [];
  const tiles: string[] = [];
  const external: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => {
    if (request.url().includes('/nepal-terrain/') && request.url().endsWith('.png')) tiles.push(request.url());
    if (new URL(request.url()).origin !== new URL(baseURL!).origin && !request.url().startsWith('blob:')) external.push(request.url());
  });
  await page.goto('/atlas/');
  const terrain = page.getByRole('region', { name: 'Terrain', exact: true });
  await expect(terrain).toHaveAttribute('data-terrain-state', 'ready');
  await expect.poll(() => tiles.length).toBeGreaterThan(0);
  expect(tiles.length).toBeLessThan(30);
  await terrain.getByRole('button', { name: 'Inspect elevation' }).click();
  await expect(terrain.getByText(/Elevation: approximately/)).toBeVisible();
  const sample = await terrain.getByText(/Elevation: approximately/).textContent();
  const value = Number(sample?.match(/approximately ([\d,]+)/)?.[1].replaceAll(',', ''));
  expect(value).toBeGreaterThan(1100); expect(value).toBeLessThan(1600);
  await terrain.getByRole('checkbox', { name: '3D terrain' }).check();
  await terrain.getByRole('slider').fill('2');
  await terrain.getByRole('button', { name: 'Inspect elevation' }).click();
  await expect(terrain.getByText(sample!, { exact: true })).toBeVisible();
  await terrain.getByRole('checkbox', { name: '3D terrain' }).uncheck();
  await terrain.getByRole('checkbox', { name: 'Hillshade' }).uncheck();
  await terrain.getByRole('checkbox', { name: 'Hillshade' }).check();
  await terrain.getByLabel('Longitude', { exact: true }).fill('0');
  await terrain.getByRole('button', { name: 'Inspect elevation' }).click();
  await expect(terrain.getByText('Elevation: UNKNOWN — outside terrain coverage.')).toBeVisible();
  await page.locator('.map-shell').screenshot({ path: 'test-results/terrain-desktop.png' });
  await page.getByRole('navigation').getByRole('link', { name: 'Sources', exact: true }).click();
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test('missing terrain can retry without disabling boundary records', async ({ page }) => {
  let fail = true;
  await page.route('**/data/nepal-terrain/1.0.0/manifest.json', route => fail ? route.fulfill({ status: 404 }) : route.continue());
  await page.goto('/atlas/');
  const terrain = page.getByRole('region', { name: 'Terrain', exact: true });
  await expect(terrain).toHaveAttribute('data-terrain-state', 'unavailable');
  await expect(page.locator('.record-picker select')).toBeEnabled();
  fail = false;
  await terrain.getByRole('button', { name: 'Try again' }).click();
  await expect(terrain).toHaveAttribute('data-terrain-state', 'ready');
});

test('corrupt terrain tiles are rejected', async ({ page }) => {
  await page.route('**/data/nepal-terrain/1.0.0/**/*.png', route => route.fulfill({ body: 'corrupt', contentType: 'image/png' }));
  await page.goto('/atlas/');
  const terrain = page.getByRole('region', { name: 'Terrain', exact: true });
  await expect(terrain).toHaveAttribute('data-terrain-state', 'error');
  await expect(terrain.getByRole('checkbox', { name: '3D terrain' })).toBeDisabled();
  await expect(page.locator('.record-picker select')).toBeEnabled();
});

test('Asia zoom-out stays bounded with terrain throughout the viewport', async ({ page }) => {
  const failedTiles: string[] = [];
  page.on('response', response => {
    if (response.url().includes('terrain') && response.url().endsWith('.png') && !response.ok()) failedTiles.push(response.url());
  });
  await page.goto('/atlas/');
  await expect(page.locator('[data-terrain-state]')).toHaveAttribute('data-terrain-state', 'ready');
  const zoomOut = page.getByRole('button', { name: 'Zoom out', exact: true });
  for (let i = 0; i < 10; i++) {
    if (await zoomOut.isDisabled()) break;
    await zoomOut.click();
  }
  await expect(zoomOut).toBeDisabled();
  await expect(page.locator('[data-terrain-state]')).toHaveAttribute('data-terrain-state', 'ready');
  await page.locator('.map-shell').screenshot({ path: 'test-results/terrain-asia.png' });
  expect(failedTiles).toEqual([]);
  await page.getByRole('button', { name: 'Reset view' }).click();
  await expect(zoomOut).toBeEnabled();
});
