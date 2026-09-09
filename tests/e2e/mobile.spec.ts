import { expect, test } from '@playwright/test';

const HEAVY = /\/data\/(nepal-mountains|nepal-glaciers-|nepal-transboundary-glacial-lakes|nepal-hydrology|nepal-rainfall|nepal-region-earthquakes|nepal-reported-|nepal-osm-hydropower|nepal-population|nepal-sentinel|nepal-power-climate)\//;

test('phone layout defers large thematic data and keeps core touch workflows usable', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  const heavyRequests: string[] = [];
  page.on('request', request => { if (HEAVY.test(request.url())) heavyRequests.push(request.url()); });
  await page.goto('/atlas/');
  await expect(page.locator('.map')).toHaveAttribute('data-map-ready', 'true');
  const gate = page.getByRole('region', { name: 'Additional data loading' });
  await expect(gate).toHaveAttribute('data-mobile-data', 'deferred');
  expect(heavyRequests).toEqual([]);

  const mapBox = await page.locator('.map-shell').boundingBox();
  expect(mapBox).not.toBeNull();
  expect(mapBox!.height).toBeLessThan(500);
  const zoom = page.locator('.maplibregl-ctrl-zoom-in');
  const zoomBox = await zoom.boundingBox();
  expect(zoomBox?.width).toBeGreaterThanOrEqual(44);
  expect(zoomBox?.height).toBeGreaterThanOrEqual(44);
  await zoom.tap();

  const search = page.getByLabel('Search the atlas');
  await search.scrollIntoViewIfNeeded();
  await search.tap();
  await search.fill('Everest');
  await page.getByRole('button', { name: 'Search atlas' }).tap();
  await expect(page.getByRole('region', { name: 'Global Search' })).toHaveAttribute('data-search-state', 'ready');
  await expect(page.getByRole('region', { name: 'Global Search' })).toContainText('Mount Everest');
  expect(await search.evaluate(element => Number.parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(16);

  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  await gate.getByRole('button', { name: 'Load additional map datasets' }).tap();
  await expect(page.locator('[data-mountains-state]')).toBeVisible();
  await expect.poll(() => heavyRequests.length).toBeGreaterThan(0);
  await context.close();
});

test('public scientific pages fit portrait and short landscape mobile viewports', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  for (const path of ['/data-catalog/', '/methodology/', '/sources/', '/events/', '/analyst/']) {
    await page.goto(path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), path).toBe(true);
  }
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto('/atlas/');
  await expect(page.locator('.map')).toHaveAttribute('data-map-ready', 'true');
  const mapBox = await page.locator('.map-shell').boundingBox();
  expect(mapBox!.height).toBeLessThanOrEqual(390 * .7);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  await context.close();
});
