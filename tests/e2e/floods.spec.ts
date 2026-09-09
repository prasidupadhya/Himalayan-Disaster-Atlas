import { test, expect } from '@playwright/test';

test('flood layer is visibly reported and never presented as an inundation footprint', async ({ page }) => {
  await page.goto('/atlas/'); await page.getByRole('button', { name: 'Load additional map datasets' }).click();
  const section = page.getByRole('region', { name: 'Floods', exact: true });
  await expect(section).toHaveAttribute('data-floods-state', /ready|stale/);
  await expect(section.getByText(/Evidence: REPORTED/i)).toBeVisible();
  await expect(section.getByText(/never inundation footprints/i)).toBeVisible();
});
