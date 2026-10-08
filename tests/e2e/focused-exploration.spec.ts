import { test, expect } from '@playwright/test';
test('focused exploration loads lakes and names without historical or unrelated datasets', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', r => requests.push(r.url()));
  await page.goto('/atlas/');
  await expect(page.getByRole('heading', { name: 'Explore Nepal’s lakes & rivers' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Glacial lakes', exact: true })).toHaveAttribute('data-glacial-lakes-state', /ready|stale/, { timeout: 15_000 });
  await expect(page.getByRole('region', { name: 'GLOF modelling availability' })).toContainText('UNAVAILABLE');
  await expect(page.getByRole('region', { name: 'Earthquakes', exact: true })).toHaveCount(0);
  expect(requests.filter(url => /\/data\/nepal-(region-earthquakes|disaster-events|reported-|population|rainfall|hydrology|mountains|glaciers-)/.test(url))).toEqual([]);
  await page.getByLabel('Find a river or reach').fill('Trishuli');
  const names = page.getByLabel('River or reach', { exact: true });
  await expect(names).toContainText('Trishuli');
  await names.selectOption('name:geonames-1282639');
  await expect(page.locator('.river-name-label')).toContainText('named location');
  await expect(page.getByRole('region', { name: 'Rivers', exact: true })).toContainText('candidate for tracing, not a verified identity');
  await page.getByLabel('Find a district or municipality').fill('Manang Ngisyang');
  await page.getByRole('combobox', { name: 'Boundary record', exact: true }).selectOption('np0438401');
  await expect(page.getByRole('heading', { name: 'Manang Ngisyang', exact: true })).toBeVisible();
  await expect(page.getByText('Source spelling: Ngisyang.', { exact: false })).toBeVisible();
});
test('physical model remains unavailable for a selected inventory lake', async ({ page }) => {
  await page.goto('/atlas/');
  const lakes = page.getByRole('region', { name: 'Glacial lakes', exact: true });
  await expect(lakes).toHaveAttribute('data-glacial-lakes-state', /ready|stale/, { timeout: 15_000 });
  const select = lakes.getByLabel('Lake record');
  const value = await select.locator('option').nth(1).getAttribute('value');
  await select.selectOption(value!);
  const modelling = page.getByRole('region', { name: 'GLOF modelling availability' });
  await expect(modelling).toContainText('Selected lake: GLO_');
  await expect(modelling).toContainText('Physical model inputs required');
  await expect(modelling).toContainText('UNAVAILABLE');
  await expect(page.getByRole('region', { name: 'Simulation UI', exact: true })).toHaveCount(0);
});

test('focused mobile view fits and infrastructure remains opt-in', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/atlas/');
  await expect(page.locator('.map')).toHaveAttribute('data-map-ready', 'true');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/focused-mobile.png' });
  await expect(page.getByRole('region', { name: 'Hydropower', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Load infrastructure context', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Hydropower', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Unload infrastructure context', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Hydropower', exact: true })).toHaveCount(0);
  await expect(page.locator('.map')).toHaveAttribute('data-map-ready', 'true');
});
