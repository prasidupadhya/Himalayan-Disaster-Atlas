import { expect, test } from '@playwright/test';

// Layout-stability and weight budgets on a phone. Measured against the static build; network throttling is left to the
// recorded audit in docs/performance.md, so these stay deterministic in CI.
const CLS_BUDGET = 0.1;
// Page HTML (with its inline flight data) per route, in kB. The largest is Licences, which carries the full software
// notice list (234 kB, as before the redesign); every other route is well under. The budget stops any page growing past it.
const HTML_BUDGET_KB = 240;
const ROUTES = ['/', '/atlas/', '/hazards/', '/simulate/', '/simulate/report/', '/live/', '/official/', '/methodology/', '/sources/', '/licenses/', '/offline/'];

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

for (const route of ROUTES) {
  test(`budget: ${route} stays within CLS ${CLS_BUDGET} and ${HTML_BUDGET_KB} kB of HTML`, async ({ page }) => {
    test.setTimeout(90_000);
    await page.addInitScript(() => {
      const w = window as unknown as { __cls: number };
      w.__cls = 0;
      new PerformanceObserver(list => { for (const entry of list.getEntries() as Array<PerformanceEntry & { value: number; hadRecentInput: boolean }>) if (!entry.hadRecentInput) w.__cls += entry.value; })
        .observe({ type: 'layout-shift', buffered: true });
    });
    const response = await page.goto(route);
    const html = (await response!.body()).byteLength / 1024;
    expect(html, 'page HTML kB').toBeLessThanOrEqual(HTML_BUDGET_KB);
    if (route === '/atlas/') await expect(page.locator('[data-map-ready="true"]')).toHaveCount(1, { timeout: 60_000 });
    else if (route === '/simulate/') await expect(page.locator('.sim-map[data-map-state]')).toHaveCount(1, { timeout: 60_000 });
    else await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
    expect(cls, 'cumulative layout shift').toBeLessThanOrEqual(CLS_BUDGET);
  });
}
