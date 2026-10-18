import { expect, test } from '@playwright/test';

test('one header switch sets English or Nepali for every page and is remembered', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Primary navigation' });
  await expect(nav.getByRole('link')).toHaveText(['Map', 'Today', 'Scenarios', 'About']);
  await expect(page.getByRole('button', { name: 'नेपाली' })).toHaveCount(1);
  await page.getByRole('button', { name: 'नेपाली' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ne');
  await expect(nav.getByRole('link')).toHaveText(['नक्सा', 'आज', 'परिदृश्य', 'बारेमा']);
  await expect(page.locator('.home-hero .intro')).toContainText('नेपालमा बाढी, हिमताल विस्फोट र भूकम्प');
  await expect(page.locator('footer')).toContainText('आधिकारिक चेतावनी सेवा होइन');

  for (const path of ['/atlas/', '/hazards/', '/simulate/', '/methodology/', '/live/', '/official/', '/sources/', '/licenses/']) {
    await page.goto(path);
    await expect(page.locator('html'), path).toHaveAttribute('lang', 'ne');
    await expect(page.getByRole('button', { name: 'नेपाली' }), path).toHaveAttribute('aria-pressed', 'true');
    // The page's main heading switches too, not only the header.
    await expect(page.getByRole('heading', { level: 1 }), path).toContainText(/[ऀ-ॿ]/);
  }

  await page.getByRole('button', { name: 'English' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(nav.getByRole('link')).toHaveText(['Map', 'Today', 'Scenarios', 'About']);
});
