import { expect, test, type Page } from '@playwright/test';

// The mobile contract: a bottom tab bar within thumb reach, 48 px touch targets 8 px apart, no sideways scroll,
// tables as labelled cards, and the right on-screen keyboard for each field.
test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

/** Visible controls and stand-alone links smaller than 48 × 48 px (links inside running text are exempt). */
async function smallTargets(page: Page) {
  return page.evaluate(() => {
    const visible = (el: Element) => { const b = el.getBoundingClientRect(); const s = getComputedStyle(el); return b.width > 0 && b.height > 0 && s.visibility !== 'hidden' && s.opacity !== '0' && !el.closest('[aria-hidden="true"], .sr-only'); };
    const inText = (el: Element) => el.tagName === 'A' && !!el.closest('p, li, dd, td, th, figcaption, caption, h1, h2, h3, h4, .maplibregl-ctrl-attrib, .map-attribution-note')
      && !el.closest('.hz-actions, .hz-card-links, .hazard-links, .home-actions, .site-footer nav, .methodology-toc, .hz-documents');
    return [...document.querySelectorAll('a[href], button, input:not([type=hidden]), select, summary, [role=tab]')].filter(visible).filter(el => !inText(el)).flatMap(el => {
      const target = (el.matches('input[type=checkbox], input[type=radio]') ? el.closest('label') ?? el : el).getBoundingClientRect();
      return target.height < 47.5 || (target.width < 47.5 && !el.matches('input[type=range]')) ? [`${el.tagName} "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30)}" ${Math.round(target.width)}×${Math.round(target.height)}`] : [];
    });
  });
}

test('phones get an app shell: bottom tab bar, safe areas, theme colour and an installable manifest', async ({ page }) => {
  await page.goto('/hazards/');
  const nav = page.getByRole('navigation', { name: 'Primary navigation' });
  const box = await nav.boundingBox();
  expect(await nav.evaluate(el => getComputedStyle(el).position)).toBe('fixed');
  expect(Math.round(box!.y + box!.height)).toBe(844);
  await expect(nav.getByRole('link')).toHaveText(['Map', 'Today', 'Scenarios', 'About']);
  await expect(nav.getByRole('link', { name: 'Today' })).toHaveAttribute('aria-current', 'page');
  for (const link of await nav.getByRole('link').all()) {
    const b = (await link.boundingBox())!;
    expect(b.height).toBeGreaterThanOrEqual(56);
    expect(b.width).toBeGreaterThanOrEqual(80);
  }
  // The last of the page's content is never hidden behind the bar.
  expect(await page.evaluate(() => Number.parseFloat(getComputedStyle(document.body).paddingBottom))).toBeGreaterThanOrEqual(64);
  await expect(page.locator('meta[name="viewport"]')).toHaveAttribute('content', /viewport-fit=cover/);
  await expect(page.locator('meta[name="theme-color"]')).toHaveCount(1);
  const manifest = await page.locator('link[rel="manifest"]').getAttribute('href');
  const body = await (await page.request.get(manifest!)).json();
  expect(body).toMatchObject({ display: 'standalone', start_url: '/' });
  // Tapping a tab navigates and moves the active marker.
  await nav.getByRole('link', { name: 'Scenarios' }).tap();
  await expect(page).toHaveURL(/\/simulate\/$/);
  await expect(nav.getByRole('link', { name: 'Scenarios' })).toHaveAttribute('aria-current', 'page');
});

test('every page keeps touch targets at least 48 px and never scrolls sideways', async ({ page }) => {
  for (const path of ['/', '/hazards/', '/atlas/', '/simulate/', '/official/', '/live/', '/methodology/', '/sources/', '/licenses/']) {
    await page.goto(path);
    if (path === '/atlas/') await expect(page.locator('.map')).toHaveAttribute('data-map-ready', 'true', { timeout: 20_000 });
    else await page.waitForLoadState('networkidle');
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), path).toBeLessThanOrEqual(0);
    expect(await smallTargets(page), path).toEqual([]);
    // Double-tap zoom delay is off and the tap flash is suppressed.
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).touchAction), path).toBe('manipulation');
  }
});

test('data tables become labelled cards on a phone', async ({ page }) => {
  await page.goto('/official/');
  const table = page.locator('table.stack-mobile:visible').first();
  await expect(table).toBeVisible();
  expect(await table.locator('thead').evaluate(el => el.getBoundingClientRect().height)).toBeLessThanOrEqual(1);
  const firstRow = table.locator('tbody tr').first();
  expect(await firstRow.evaluate(el => getComputedStyle(el).display)).toBe('block');
  const cells = firstRow.locator('td, th');
  const headings = await table.locator('thead th').allTextContents();
  for (let i = 0; i < await cells.count(); i++) await expect(cells.nth(i)).toHaveAttribute('data-label', headings[i].trim());
  // Labels follow the language switch.
  await page.getByRole('button', { name: 'नेपाली' }).click();
  // The switch renders at low priority; read the heading once it has changed.
  await expect(table.locator('thead th').first()).not.toHaveText(headings[0]);
  await expect(cells.first()).toHaveAttribute('data-label', (await table.locator('thead th').first().textContent())!.trim());
});

test('fields bring up the right keyboard and are not auto-corrected', async ({ page }) => {
  await page.goto('/atlas/');
  await expect(page.locator('.map')).toHaveAttribute('data-map-ready', 'true', { timeout: 20_000 });
  for (const search of await page.locator('input[type="search"]').all()) {
    await expect(search).toHaveAttribute('autocapitalize', 'none');
    await expect(search).toHaveAttribute('autocorrect', 'off');
    await expect(search).toHaveAttribute('spellcheck', 'false');
    await expect(search).toHaveAttribute('enterkeyhint', 'search');
  }
  for (const name of ['Longitude', 'Latitude']) await expect(page.getByLabel(name, { exact: true })).toHaveAttribute('inputmode', 'decimal');
  await page.goto('/simulate/');
  const numbers = page.locator('#panel-flood input[type="number"]');
  await expect(numbers.first()).toBeVisible({ timeout: 20_000 });
  for (const field of await numbers.all()) await expect(field).toHaveAttribute('inputmode', 'decimal');
  expect(await numbers.first().evaluate(el => Number.parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(16);
});

test('the hazard cards on the home page are a snapping carousel', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('.hazard-cards');
  expect(await cards.evaluate(el => getComputedStyle(el).scrollSnapType)).toContain('x');
  expect(await cards.evaluate(el => el.scrollWidth > el.clientWidth)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
});
