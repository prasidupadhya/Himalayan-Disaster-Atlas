import { expect, test, type Page } from '@playwright/test';

async function structuralAudit(page: Page) {
  return page.evaluate(() => {
    const visible = (element: Element) => {
      const html = element as HTMLElement;
      const style = getComputedStyle(html);
      return style.display !== 'none' && style.visibility !== 'hidden' && html.getClientRects().length > 0;
    };
    const unlabeledControls = [...document.querySelectorAll('input:not([type="hidden"]), select, textarea')]
      .filter(visible)
      .filter(element => {
        const control = element as HTMLInputElement;
        return !(control.labels?.length || element.getAttribute('aria-label') || element.getAttribute('aria-labelledby') || element.getAttribute('title'));
      })
      .map(element => element.outerHTML.slice(0, 180));
    const unnamedButtons = [...document.querySelectorAll('button')]
      .filter(visible)
      .filter(element => !((element.textContent ?? '').trim() || element.getAttribute('aria-label') || element.getAttribute('aria-labelledby') || element.getAttribute('title')))
      .map(element => element.outerHTML.slice(0, 180));
    const unnamedLinks = [...document.querySelectorAll('a[href]')]
      .filter(visible)
      .filter(element => !((element.textContent ?? '').trim() || element.getAttribute('aria-label') || element.getAttribute('aria-labelledby') || element.querySelector('img[alt]')))
      .map(element => element.outerHTML.slice(0, 180));
    const imagesWithoutAlt = [...document.querySelectorAll('img')]
      .filter(element => !element.hasAttribute('alt'))
      .map(element => element.outerHTML.slice(0, 180));
    const tablesWithoutCaptions = [...document.querySelectorAll('table')]
      .filter(table => !table.querySelector(':scope > caption'))
      .map(element => element.outerHTML.slice(0, 180));
    return {
      mainCount: document.querySelectorAll('main').length,
      h1Count: document.querySelectorAll('h1').length,
      unlabeledControls,
      unnamedButtons,
      unnamedLinks,
      imagesWithoutAlt,
      tablesWithoutCaptions,
    };
  });
}

test('core public pages pass structural semantic audit', async ({ page }) => {
  for (const path of ['/atlas/', '/events/', '/analyst/', '/evidence/', '/data-catalog/', '/methodology/', '/sources/']) {
    await page.goto(path);
    if (path === '/atlas/') await expect(page.locator('.map')).toHaveAttribute('data-map-ready', 'true');
    const audit = await structuralAudit(page);
    expect(audit.mainCount, `${path} main landmarks`).toBe(1);
    expect(audit.h1Count, `${path} level-one headings`).toBeGreaterThanOrEqual(1);
    expect(audit.unlabeledControls, `${path} unlabeled controls`).toEqual([]);
    expect(audit.unnamedButtons, `${path} unnamed buttons`).toEqual([]);
    expect(audit.unnamedLinks, `${path} unnamed links`).toEqual([]);
    expect(audit.imagesWithoutAlt, `${path} images without alt`).toEqual([]);
    expect(audit.tablesWithoutCaptions, `${path} tables without captions`).toEqual([]);
  }
});

test('keyboard users can skip map, search and reach dynamic results', async ({ page }) => {
  await page.goto('/atlas/');
  await expect(page.locator('.map')).toHaveAttribute('data-map-ready', 'true');

  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();

  const mapSkip = page.getByRole('link', { name: 'Skip interactive map to boundary records' });
  await mapSkip.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#accessible-boundary-records')).toBeFocused();

  const search = page.getByLabel('Search the atlas');
  await search.focus();
  await search.fill('Everest');
  await page.keyboard.press('Enter');
  const globalSearch = page.getByRole('region', { name: 'Global Search' });
  await expect(globalSearch).toHaveAttribute('data-search-state', 'ready');
  const everest = globalSearch.getByRole('button', { name: /Mount Everest/ }).first();
  await everest.focus();
  await page.keyboard.press('Enter');
  await expect(globalSearch.locator('.selection')).toBeFocused();
  await expect(globalSearch.locator('.selection')).toContainText('Stable ID');
});

test('catalog and simulation move focus to newly requested detail/results', async ({ page }) => {
  await page.goto('/data-catalog/');
  await expect(page.locator('.catalog-browser')).toHaveAttribute('data-catalog-interactive', 'ready');
  const firstCatalogRecord = page.locator('.catalog-record').first();
  await firstCatalogRecord.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#catalog-detail')).toBeFocused();
  await expect(page.locator('#catalog-detail')).toContainText('Stable identity');

  await page.goto('/atlas/');
  await expect(page.locator('.map')).toHaveAttribute('data-map-ready', 'true');
  const simulation = page.getByRole('region', { name: 'Simulation UI' });
  const open = simulation.getByLabel('Open simulation workbench');
  await open.focus();
  await page.keyboard.press('Space');
  await expect(simulation).toHaveAttribute('data-simulation-state', 'ready');
  const run = simulation.getByRole('button', { name: 'Run Level 1 simulation' });
  await run.focus();
  await page.keyboard.press('Enter');
  await expect(simulation.locator('[aria-label="Simulation result"]')).toBeFocused();
  await expect(simulation.locator('[aria-label="Simulation result"]')).toContainText('MODELLED SCENARIO');
});

test('map and climate have non-visual alternatives and high-contrast UI keeps explicit borders', async ({ page }) => {
  await page.goto('/atlas/');
  await expect(page.locator('.map')).toHaveAttribute('data-map-ready', 'true');
  await expect(page.locator('#atlas-map-alternative')).toContainText('textual details');
  await page.getByRole('button', { name: 'Load additional map datasets' }).click();
  await expect(page.locator('[aria-label="Climate"]')).toHaveAttribute('data-climate-state', 'ready');
  const description = await page.locator('.climate-chart desc').textContent();
  expect(description).toContain('Jan');
  expect(description).toContain('Dec');

  await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/data-catalog/');
  await page.locator('.catalog-record').first().click();
  const badge = page.locator('#catalog-detail .evidence-label').first();
  await expect(badge).toContainText('Evidence:');
  expect(await badge.evaluate(element => getComputedStyle(element).borderTopStyle)).not.toBe('none');
});
