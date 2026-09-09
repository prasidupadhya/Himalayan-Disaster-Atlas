import { expect, test } from '@playwright/test';

test('desktop initial map stays bounded and optional datasets mount and dispose on demand', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', r => requests.push(new URL(r.url()).pathname));
  await page.goto('/atlas/');
  await expect(page.locator('.map')).toHaveAttribute('data-map-ready', 'true', { timeout: 15000 });
  expect(requests.filter(p => /\/data\/nepal-(mountains|glaciers-|transboundary-glacial-lakes|region-earthquakes|reported-)/.test(p))).toEqual([]);
  expect(await page.evaluate(() => performance.now())).toBeLessThan(15000);
  await page.getByRole('button', { name: 'Load additional map datasets' }).click();
  await expect(page.getByRole('region', { name: 'Mountains', exact: true })).toHaveAttribute('data-mountains-state', /ready|stale/);
  await page.getByRole('button', { name: 'Unload additional map datasets' }).click();
  await expect(page.getByRole('region', { name: 'Mountains', exact: true })).toHaveCount(0);
  await expect(page.locator('.map')).toHaveAttribute('data-map-ready', 'true');
  await page.getByRole('button', { name: 'Reset view', exact: true }).click();
});

test('repeated elevation samples reuse verified raster bytes and preserve measurements', async ({ page }) => {
  const tiles: string[] = [];
  page.on('request', r => { if (/\/nepal-terrain\/1.0.0\/9\//.test(r.url())) tiles.push(r.url()); });
  await page.goto('/atlas/');
  const terrain = page.getByRole('region', { name: 'Terrain', exact: true });
  await expect(terrain).toHaveAttribute('data-terrain-state', 'ready');
  await terrain.getByRole('button', { name: 'Inspect elevation' }).click();
  await expect(terrain).toContainText('m above EGM2008');
  const count = tiles.length;
  await terrain.getByRole('button', { name: 'Inspect elevation' }).click();
  await expect(terrain).toContainText('m above EGM2008');
  expect(tiles.length).toBe(count); expect(count).toBeGreaterThan(0);
});
