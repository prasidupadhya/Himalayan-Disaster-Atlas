import { expect, test, type Locator, type Page } from '@playwright/test';
import { openAtlasTab } from './atlas-tabs';

// Phones: Run (Scenarios) and Trace (Atlas) bring the map into view before the animation plays, then focus the
// status line on the map. Also covers the Atlas bottom sheet and the colour theme.
const PHONE = { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true };

/** Share of the element's height inside the viewport. */
async function shown(target: Locator) {
  return target.evaluate(element => {
    const box = element.getBoundingClientRect();
    return Math.max(0, Math.min(box.bottom, innerHeight) - Math.max(box.top, 0)) / Math.max(1, box.height);
  });
}

async function runFlood(page: Page) {
  await page.goto('/simulate/');
  const panel = page.locator('#panel-flood');
  await panel.getByRole('checkbox').check();
  const run = panel.getByRole('button', { name: 'Run scenario' });
  await run.scrollIntoViewIfNeeded();
  // The stage sits above the steps on a phone, so pressing Run starts with the map off screen.
  expect(await shown(page.locator('.sim-stage'))).toBeLessThan(0.6);
  await run.tap();
}

test.describe('phones', () => {
  test.use(PHONE);

  test('Run scrolls the 3D stage into view, then plays and focuses its status line', async ({ page }) => {
    await runFlood(page);
    const status = page.locator('.sim-player-status');
    await expect(status).toBeFocused({ timeout: 10_000 });
    await expect(page.locator('.sim-stage p.sr-only[role="status"]')).toHaveText(/^Playing: the declared pulse/);
    expect(await shown(page.locator('.sim-stage'))).toBeGreaterThanOrEqual(0.6);
    await expect.poll(async () => Number(await status.getAttribute('data-player-time')), { timeout: 20_000 }).toBeGreaterThan(0);
  });

  test('with reduced motion, Run jumps to the stage without animating', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await runFlood(page);
    await expect(page.locator('.sim-player-status')).toBeFocused({ timeout: 10_000 });
    expect(await shown(page.locator('.sim-stage'))).toBeGreaterThanOrEqual(0.6);
    // Reduced motion shows the end state; nothing starts animating on its own.
    await expect(page.locator('.sim-player-play')).not.toContainText('Pause');
    // "See results" is on screen with the stage and moves on to the result heading. (Checked here: under the software
    // renderer used in CI an animating 3D stage starves the page, as the simulator spec notes.)
    const results = page.getByRole('link', { name: 'See results' });
    expect(await shown(results)).toBe(1);
    await results.tap();
    await expect(page.locator('#flood-result')).toBeFocused();
  });

  test('Trace lowers the sheet, shows the map and focuses the trace status on it', async ({ page }) => {
    await page.goto('/atlas/');
    await expect(page.locator('.map')).toHaveAttribute('data-map-ready', 'true');
    await openAtlasTab(page, 'Rivers');
    const sheet = page.locator('#atlas-controls');
    await expect(sheet).toHaveAttribute('data-snap', 'half');
    const rivers = page.getByRole('region', { name: 'Rivers', exact: true });
    await expect(rivers).toHaveAttribute('data-rivers-state', 'ready', { timeout: 15_000 });
    await rivers.getByLabel('Find a river or reach').fill('40669746');
    await rivers.getByLabel('River or reach', { exact: true }).selectOption('hyriv-40669746');
    await page.getByRole('button', { name: 'Trace downstream', exact: true }).tap();
    await expect(sheet).toHaveAttribute('data-snap', 'peek');
    await expect(page.locator('#trace-map-status')).toBeFocused({ timeout: 10_000 });
    expect(await shown(page.locator('#atlas-map'))).toBeGreaterThanOrEqual(0.6);
    await expect(page.locator('#trace-map-status')).toBeInViewport();
  });

  test('the controls sheet steps through peek, half and full and never covers the whole map at half', async ({ page }) => {
    await page.goto('/atlas/');
    const sheet = page.locator('#atlas-controls'), handle = sheet.locator('.sheet-handle');
    await expect(sheet).toHaveAttribute('data-snap', 'peek');
    await expect(handle).toHaveAttribute('aria-expanded', 'false');
    await handle.focus();
    await page.keyboard.press('ArrowUp');
    await expect(sheet).toHaveAttribute('data-snap', 'half');
    const map = await page.locator('#atlas-map').boundingBox();
    expect(map!.height).toBeGreaterThanOrEqual(150);
    await page.keyboard.press('ArrowUp');
    await expect(sheet).toHaveAttribute('data-snap', 'full');
    await expect(handle).toHaveAttribute('aria-label', 'Show more of the map');
    await page.keyboard.press('ArrowDown'); await page.keyboard.press('ArrowDown');
    await expect(sheet).toHaveAttribute('data-snap', 'peek');
  });
});

test('the colour theme can be chosen, persists and keeps a single theme-color', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel(/^Colour theme:/).click();
  await page.getByRole('radio', { name: 'Dark' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const surface = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(surface);
  await expect(page.locator('meta[name="theme-color"]')).toHaveCount(1);
  await page.getByLabel(/^Colour theme:/).click();
  await page.getByRole('radio', { name: 'Light' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});
