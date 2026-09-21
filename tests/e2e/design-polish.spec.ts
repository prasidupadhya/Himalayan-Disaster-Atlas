import { expect, test } from '@playwright/test';

test('mobile navigation exposes the current route and returns focus on Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Menu', exact: true });
  const nav = page.getByRole('navigation', { name: 'Primary navigation' });
  await expect(nav).toBeHidden();
  await menu.click();
  await expect(nav).toBeVisible();
  await nav.getByRole('link', { name: 'Data catalog', exact: true }).focus();
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await expect(nav).toBeHidden();
  await menu.click();
  await nav.getByRole('link', { name: 'Data catalog', exact: true }).click();
  await expect(page).toHaveURL(/\/data-catalog\/$/);
  await expect(nav).toBeHidden();
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await expect(nav.getByRole('link', { name: 'Data catalog', exact: true })).toHaveAttribute('aria-current', 'page');
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
  const availability = page.getByLabel('Public release availability');
  if (await availability.count()) {
    const disclosure = availability.locator('details');
    await expect(disclosure).not.toHaveAttribute('open');
    await disclosure.locator('summary').click();
    await expect(availability.getByRole('link', { name: 'Availability and source terms' })).toBeVisible();
    await disclosure.locator('summary').click();
    await expect(disclosure).not.toHaveAttribute('open');
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
