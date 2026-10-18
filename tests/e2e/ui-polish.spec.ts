import { expect, test } from '@playwright/test';

test('home leads with the three hazards, today’s official figures and a direct path to the map', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Himalayan Disaster Atlas' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Explore Nepal' })).toHaveAttribute('href', '/atlas/');
  await expect(page.getByRole('link', { name: 'See today', exact: true })).toHaveAttribute('href', '/hazards/');
  const overview = page.getByRole('img', { name: 'Nepal’s seven provinces' });
  await expect(overview).toBeVisible();
  await expect(overview).toContainText('orientation, not measurement');
  await expect(page.locator('.hazard-card h3')).toHaveText(['Floods', 'Glacial lakes', 'Earthquakes']);
  await expect(page.getByRole('complementary', { name: 'Today from official sources' })).toBeVisible();
});

test('desktop map stays dominant while the side panel remains independently usable', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/atlas/');
  const map = page.locator('.map-shell');
  const rail = page.locator('.atlas-panel');
  await expect(map).toBeVisible();
  await expect(rail).toBeVisible();
  const mapBox = await map.boundingBox();
  const railBox = await rail.boundingBox();
  expect(mapBox!.width).toBeGreaterThan(railBox!.width * 1.6);
  expect(mapBox!.height).toBeGreaterThanOrEqual(600);
  expect(await rail.evaluate(element => getComputedStyle(element).overflowY)).toBe('auto');
});

test('evidence and scenario states retain explicit non-color cues', async ({ page }) => {
  await page.goto('/atlas/');
  const badge = page.locator('.evidence-label').first();
  await expect(badge).toBeVisible();
  const marker = await badge.evaluate(element => getComputedStyle(element, '::before').content);
  expect(marker).not.toBe('none');
  expect(marker).not.toBe('normal');
  await page.getByText('Educational river simulation').click();
  const warning = page.locator('.simulation-warning').first();
  await expect(warning).toContainText('MODELLED SCENARIO — NOT AN OFFICIAL FORECAST');
  expect(Number.parseFloat(await warning.evaluate(element => getComputedStyle(element).borderLeftWidth))).toBeGreaterThanOrEqual(4);
});

test('the map skip link stays hidden until focused on phones', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/atlas/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const skip = page.getByRole('link', { name: 'Skip interactive map to boundary records' });
  await expect(skip).toHaveCSS('opacity', '0');
  await skip.focus();
  await expect(skip).toHaveCSS('opacity', '1');
});
