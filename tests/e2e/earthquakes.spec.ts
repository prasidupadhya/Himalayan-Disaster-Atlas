import { test, expect } from '@playwright/test';

test('earthquake catalogue exposes magnitude filters and epicenter semantics', async ({ page }) => {
  await page.goto('/atlas/'); await page.getByRole('button', { name: 'Load additional map datasets' }).click();
  const section = page.getByRole('region', { name: 'Earthquakes', exact: true });
  await expect(section).toHaveAttribute('data-earthquakes-state', /ready|stale/);
  await expect(section.getByText(/not a shaking or damage footprint/i)).toBeVisible();
  await section.getByLabel('Minimum magnitude').fill('7');
  await expect(section.getByRole('option', { name: /M7\.8/ }).first()).toBeAttached();
});
