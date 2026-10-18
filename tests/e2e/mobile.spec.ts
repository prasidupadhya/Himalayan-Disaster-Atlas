import { expect, test } from '@playwright/test';

// Loaded only on request: glacier outlines (~1.3 MB) and OSM infrastructure/hydropower.
const DEFERRED = /\/data\/(nepal-glaciers-|nepal-osm-)/;

test('phone map loads lakes, defers heavy layers and keeps touch workflows usable', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  const deferred: string[] = [];
  page.on('request', request => { if (DEFERRED.test(request.url())) deferred.push(request.url()); });
  await page.goto('/atlas/');
  await expect(page.locator('.map')).toHaveAttribute('data-map-ready', 'true');
  expect(deferred).toEqual([]);

  const mapBox = await page.locator('.map-shell').boundingBox();
  expect(mapBox).not.toBeNull();
  expect(mapBox!.height).toBeLessThan(500);
  const zoom = page.locator('.maplibregl-ctrl-zoom-in');
  const zoomBox = await zoom.boundingBox();
  expect(zoomBox?.width).toBeGreaterThanOrEqual(44);
  expect(zoomBox?.height).toBeGreaterThanOrEqual(44);
  await zoom.tap();

  const lakeSearch = page.getByLabel('Search lakes');
  await lakeSearch.scrollIntoViewIfNeeded();
  await lakeSearch.tap();
  expect(await lakeSearch.evaluate(element => Number.parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(16);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);

  // The hazard controls come straight after the map; secondary layers open from their shortcut.
  const panelTop = await page.locator('.atlas-panel').boundingBox(), recordsTop = await page.locator('#accessible-boundary-records').boundingBox();
  expect(panelTop!.y).toBeLessThan(recordsTop!.y);
  await expect(page.locator('#terrain-controls')).toBeHidden();
  await page.getByRole('navigation', { name: 'Atlas controls' }).getByRole('link', { name: 'Terrain', exact: true }).tap();
  await expect(page.locator('#terrain-controls')).toBeVisible();
  await expect(page.locator('#terrain-controls')).toBeFocused();

  await page.getByRole('button', { name: 'Show glacier outlines' }).tap();
  await expect.poll(() => deferred.length).toBeGreaterThan(0);
  await context.close();
});

test('every page fits portrait and short landscape phone viewports', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  for (const path of ['/', '/hazards/', '/simulate/', '/official/', '/live/', '/methodology/', '/sources/', '/licenses/']) {
    await page.goto(path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), path).toBe(true);
    const nav = page.getByRole('navigation', { name: 'Primary navigation' });
    await expect(nav.getByRole('link')).toHaveCount(4);
    for (const box of await nav.getByRole('link').evaluateAll(links => links.map(link => link.getBoundingClientRect().height))) expect(box, path).toBeGreaterThanOrEqual(44);
  }
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto('/atlas/');
  await expect(page.locator('.map')).toHaveAttribute('data-map-ready', 'true');
  const mapBox = await page.locator('.map-shell').boundingBox();
  expect(mapBox!.height).toBeLessThanOrEqual(390 * .7);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  await context.close();
});
