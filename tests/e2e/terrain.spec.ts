import { test, expect } from '@playwright/test';

test('terrain renders locally, toggles and inspects elevation independently of exaggeration', async ({ page }) => {
  const errors: string[] = [];
  const tiles: string[] = [];
  const external: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => {
    if (request.url().includes('/nepal-terrain/') && request.url().endsWith('.png')) tiles.push(request.url());
    if (!request.url().startsWith('http://127.0.0.1:4173') && !request.url().startsWith('blob:')) external.push(request.url());
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
  await page.screenshot({ path: 'test-results/terrain-desktop.png', fullPage: true });
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
