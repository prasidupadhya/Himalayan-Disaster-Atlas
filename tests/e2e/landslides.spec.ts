import { test, expect } from '@playwright/test';

test('landslide layer exposes reported evidence and unknown confidence', async ({ page }) => {
  await page.goto('/atlas/');
  const section = page.getByRole('region', { name: 'Landslides', exact: true });
  await expect(section).toHaveAttribute('data-landslides-state', /ready|stale/);
  await expect(section.getByText(/Evidence: REPORTED/i)).toBeVisible();
  await expect(section.getByText(/not landslide polygons, susceptibility scores/i)).toBeVisible();
});
