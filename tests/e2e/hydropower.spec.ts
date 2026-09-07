import { test, expect } from '@playwright/test';

test('hydropower inventory exposes capacity and rejects proximity-as-risk semantics', async ({ page }) => {
  await page.goto('/atlas/');
  const section = page.getByRole('region', { name: 'Hydropower', exact: true });
  await expect(section).toHaveAttribute('data-hydropower-state', /ready|stale/);
  await expect(section.getByText(/45 mapped plants/i)).toBeVisible();
  await expect(section.getByText(/proximity does not establish damage, vulnerability or risk/i)).toBeVisible();
  await expect(section.getByText(/OpenStreetMap/i).first()).toBeVisible();
});
