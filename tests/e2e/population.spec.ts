import { expect, test } from '@playwright/test';

test('population renders as a modelled display derivative with native analysis preserved', async ({ page }) => {
  await page.goto('/atlas');
  const section = page.getByRole('region', { name: 'Population', exact: true });
  await expect(section).toHaveAttribute('data-population-state', 'ready', { timeout: 10_000 });
  await expect(section).toContainText('WorldPop R2025A v1');
  await expect(section).toContainText('Not a 2025 census');
  await expect(section).toContainText('3 arc-seconds');
  await expect(section).toContainText('485 display-only tiles');
  await expect(section.getByLabel('Show population intensity')).not.toBeChecked();
  await section.getByLabel('Show population intensity').check();
  await expect(section.getByLabel('Show population intensity')).toBeChecked();
});
