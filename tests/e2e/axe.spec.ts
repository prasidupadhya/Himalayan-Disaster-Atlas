import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

// Every route passes axe (WCAG 2.2 AA and best practice) in English on a phone in the light theme, and in Nepali on a
// wide screen in the dark theme, so both languages and both themes are checked.
const AXE = readFileSync('node_modules/axe-core/axe.min.js', 'utf8');
const ROUTES = ['/', '/atlas/', '/hazards/', '/simulate/', '/simulate/report/', '/live/', '/official/', '/methodology/', '/sources/', '/licenses/', '/offline/'];
const PASSES = [
  { lang: 'en', theme: 'light', viewport: { width: 390, height: 844 } },
  { lang: 'ne', theme: 'dark', viewport: { width: 1440, height: 900 } },
] as const;

async function settle(page: Page, route: string) {
  if (route === '/atlas/') await expect(page.locator('[data-map-ready="true"]')).toHaveCount(1, { timeout: 60_000 });
  else if (route === '/simulate/') await expect(page.locator('.sim-map[data-map-state]')).toHaveCount(1, { timeout: 60_000 });
  else await page.waitForLoadState('networkidle');
}

for (const pass of PASSES) for (const route of ROUTES) {
  test(`axe: ${route} in ${pass.lang}, ${pass.theme}, ${pass.viewport.width}px`, async ({ page }) => {
    test.setTimeout(90_000);
    await page.setViewportSize(pass.viewport);
    await page.addInitScript(([lang, theme]) => { localStorage.setItem('atlas-lang', lang); localStorage.setItem('atlas-theme', theme); }, [pass.lang, pass.theme]);
    await page.goto(route);
    await settle(page, route);
    await expect(page.locator('html')).toHaveAttribute('data-theme', pass.theme);
    await page.addScriptTag({ content: AXE });
    const violations = await page.evaluate(async () => {
      const axe = (window as unknown as { axe: { run: (context: Document, options: object) => Promise<{ violations: Array<{ id: string; nodes: Array<{ target: string[] }> }> }> } }).axe;
      const result = await axe.run(document, { resultTypes: ['violations'], runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } });
      return result.violations.map(v => `${v.id}: ${v.nodes.slice(0, 3).map(n => n.target.join(' ')).join(', ')}`);
    });
    expect(violations).toEqual([]);
  });
}
