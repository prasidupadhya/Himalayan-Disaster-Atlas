import { expect, test } from '@playwright/test';

test('hydrology snapshot exposes observation freshness and source station status', async ({ page }) => {
  await page.goto('/atlas/'); await page.getByRole('button', { name: 'Load additional map datasets' }).click();
  const section = page.getByRole('region', { name: 'Hydrology', exact: true });
  await expect(section).toHaveAttribute('data-hydrology-state', /ready|stale/);
  await section.getByRole('searchbox').fill('Kali Gandaki');
  const select = section.getByRole('combobox');
  const option = select.locator('option').filter({ hasText: 'Kali Gandaki' }).first();
  await expect(option).toHaveCount(1);
  await select.selectOption(await option.getAttribute('value') ?? '');
  await expect(section.getByText('Observed', { exact: true })).toBeVisible();
  await expect(section.getByText('Provider', { exact: true })).toBeVisible();
  await expect(section.getByText(/cached snapshot is not a live warning service/i)).toBeVisible();
});
