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
  for (const path of ['/', '/atlas/', '/hazards/', '/simulate/', '/official/', '/live/', '/methodology/', '/sources/', '/licenses/']) {
    await page.goto(path);
    if (path === '/atlas/') await expect(page.locator('.map')).toHaveAttribute('data-map-ready', 'true', { timeout: 20_000 });
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

test('keyboard users can skip to content and past the map', async ({ page }) => {
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
});

test('the map has a non-visual alternative and its key does not rely on colour alone', async ({ page }) => {
  await page.goto('/atlas/');
  await expect(page.locator('.map')).toHaveAttribute('data-map-ready', 'true');
  await expect(page.locator('#atlas-map-alternative')).toContainText('textual details');
  const key = page.getByRole('region', { name: 'Map key' });
  await expect(key.getByText('River reach')).toBeVisible();
  // Lines, dots and areas use different shapes, so the key does not depend on colour alone.
  for (const shape of ['line', 'dot', 'area']) await expect(key.locator(`.map-key-${shape}`).first()).toBeAttached();
  await expect(key.getByText(/Earthquake/)).toHaveCount(0);
});
