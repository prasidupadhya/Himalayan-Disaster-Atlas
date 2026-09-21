import { expect, test } from '@playwright/test';

test('home presents the atlas with source-backed geography and a direct exploration path', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Himalayan Disaster Atlas' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Explore Nepal' })).toHaveAttribute('href', '/atlas/');

  const overview = page.getByRole('img', { name: 'Nepal’s seven provinces' });
  await expect(overview).toBeVisible();
  await expect(overview).toContainText('orientation, not measurement');
  await expect(page.getByRole('link', { name: 'COD-AB v02 · source & limitations' })).toHaveAttribute('href', '/methodology/#administrative-method');
  await expect(page.getByText('753', { exact: true })).toBeVisible();
});

test('desktop atlas keeps the map dominant while the scientific rail remains independently usable', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/atlas/');
  const map = page.locator('.map-shell');
  const rail = page.locator('.atlas-panel');
  await expect(map).toBeVisible();
  await expect(rail).toBeVisible();

  const mapBox = await map.boundingBox();
  const railBox = await rail.boundingBox();
  expect(mapBox).not.toBeNull();
  expect(railBox).not.toBeNull();
  expect(mapBox!.width).toBeGreaterThan(railBox!.width * 1.6);
  expect(mapBox!.height).toBeGreaterThanOrEqual(600);
  expect(await rail.evaluate(element => getComputedStyle(element).overflowY)).toBe('auto');
});

test('evidence and scenario states retain explicit non-color cues', async ({ page }) => {
  await page.goto('/data-catalog/');
  const badge = page.locator('.evidence-label').first();
  await expect(badge).toBeVisible();
  const marker = await badge.evaluate(element => getComputedStyle(element, '::before').content);
  expect(marker).not.toBe('none');
  expect(marker).not.toBe('normal');

  await page.goto('/atlas/');
  const warning = page.locator('.simulation-warning').first();
  await expect(warning).toContainText('MODELLED SCENARIO — NOT AN OFFICIAL FORECAST');
  expect(Number.parseFloat(await warning.evaluate(element => getComputedStyle(element).borderLeftWidth))).toBeGreaterThanOrEqual(4);
  const warningMarker = await warning.locator('strong').evaluate(element => getComputedStyle(element, '::before').content);
  expect(warningMarker).not.toBe('none');
  expect(warningMarker).not.toBe('normal');
});

test('mobile menu exposes every primary destination without horizontal page overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/atlas/');
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  for (const label of ['Atlas', 'Events', 'Analyst', 'Data catalog', 'Methodology', 'Sources']) {
    await expect(page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: label, exact: true })).toBeVisible();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

  const skip = page.getByRole('link', { name: 'Skip interactive map to boundary records' });
  await expect(skip).toHaveCSS('opacity', '0');
  await skip.focus();
  await expect(skip).toHaveCSS('opacity', '1');
});
