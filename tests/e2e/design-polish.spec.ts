import { expect, test } from '@playwright/test';

test('phone navigation shows all four destinations and marks the current one', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Primary navigation' });
  await expect(nav).toBeVisible();
  await expect(nav.getByRole('link')).toHaveText(['Map', 'Today', 'Scenarios', 'About']);
  await nav.getByRole('link', { name: 'Today', exact: true }).click();
  await expect(page).toHaveURL(/\/hazards\/$/);
  await expect(nav.getByRole('link', { name: 'Today', exact: true })).toHaveAttribute('aria-current', 'page');
});

test('source-backed overview and page chrome reflow without horizontal overflow', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('img', { name: 'Nepal’s seven provinces' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'COD-AB v02 · source & limitations' })).toHaveAttribute('href', '/methodology/#administrative-method');
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `overflow at ${width}px`).toBe(true);
    await expect(page.getByRole('link', { name: 'Explore Nepal', exact: true })).toBeInViewport();
  }
  expect(errors).toEqual([]);
});

test('map shortcuts focus the requested controls without recreating the map', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/atlas/');
  const map = page.locator('[data-map-ready="true"]');
  await expect(map).toBeVisible();
  const controls = page.getByRole('navigation', { name: 'Atlas controls' });
  const terrain = controls.getByRole('link', { name: 'Terrain', exact: true });
  await terrain.focus(); await page.keyboard.press('Enter');
  await expect(page.locator('#terrain-controls')).toBeFocused();
  await expect(page.locator('#terrain-controls').getByRole('heading', { name: 'Terrain', exact: true })).toBeInViewport();
  await controls.getByRole('link', { name: 'Rivers', exact: true }).click();
  await expect(page.locator('#river-controls')).toBeFocused();
  await expect(page.locator('#river-controls').getByRole('heading', { name: 'Rivers', exact: true })).toBeInViewport();
  await expect(map).toHaveCount(1);
});

test('homepage content renders before JavaScript is available', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('#home-title')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Explore Nepal', exact: true })).toBeVisible();
  await expect(page.getByText('Loading the atlas…')).toHaveCount(0);
  await context.close();
});
