import { expect, test } from '@playwright/test';
import { excludedReleases, releaseDirectory } from '../../scripts/public-release-policy.mjs';
const prefixes = excludedReleases().map(releaseDirectory);
test('excluded datasets cannot be downloaded and retained data stays available', async ({ request }) => {
  for (const prefix of prefixes) {
    expect((await request.get(`${prefix}manifest.json`)).status()).toBe(404);
  }
  expect((await request.get('/data/nepal-hydrology-stations/1.0.0/features.geojson.gz')).status()).toBe(404);
  const inventory = await (await request.get('/release-inventory.json')).json();
  expect(inventory.profile).toBe('public');
  expect(inventory.excluded).toEqual(excludedReleases());
  expect(Object.keys(inventory.files).some(path => prefixes.some(prefix => `/${path}`.startsWith(prefix)))).toBe(false);
});
test('public pages explain omissions without requesting excluded artifacts', async ({ page }) => {
  const errors: string[] = []; const requests: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => requests.push(new URL(request.url()).pathname));
  await page.goto('/atlas/');
  await expect(page.locator('[data-map-ready="true"]')).toBeVisible();
  await expect(page.getByLabel('Public release availability')).toContainText('reviewed datasets only');
  await expect(page.getByRole('region', { name: 'Scenario Engine', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Load additional map datasets' }).click();
  await expect(page.getByRole('region', { name: 'Mountains', exact: true })).toHaveAttribute('data-mountains-state', /ready|stale/);
  for (const name of ['Hydrology', 'Rainfall', 'Population', 'Exposure Engine', 'Hazard Graph', 'Global Search']) {
    await expect(page.getByRole('region', { name, exact: true })).toHaveCount(0);
  }
  for (const path of ['/events/', '/evidence/', '/analyst/']) {
    await page.goto(path);
    await expect(page.getByText('This feature is unavailable in this public release', { exact: false })).toBeVisible();
  }
  for (const path of ['/data-catalog/', '/sources/', '/licenses/', '/methodology/']) {
    await page.goto(path);
    const links = await page.locator('a[href^="/data/"]').evaluateAll(anchors => anchors.map(a => a.getAttribute('href')!));
    expect(links.filter(href => prefixes.some(prefix => href.startsWith(prefix)))).toEqual([]);
  }
  expect(requests.filter(path => prefixes.some(prefix => path.startsWith(prefix)))).toEqual([]);
  expect(errors).toEqual([]);
});
test('public availability and map controls fit mobile and preserve keyboard access', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ['/atlas/', '/events/', '/analyst/', '/data-catalog/', '/sources/', '/licenses/']) {
    await page.goto(path);
    await expect(page.getByRole('main')).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    if (path === '/atlas/') {
      await expect(page.locator('[data-map-ready="true"]')).toBeVisible();
      await page.getByRole('link', { name: 'Skip to content', exact: true }).focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('#main')).toBeFocused();
      await page.getByRole('button', { name: 'Reset view', exact: true }).click();
    }
  }
});
