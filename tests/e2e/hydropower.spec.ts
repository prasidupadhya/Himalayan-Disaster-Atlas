import { test, expect } from '@playwright/test';
import { openAtlasTab } from './atlas-tabs';

test('hydropower inventory exposes capacity and rejects proximity-as-risk semantics', async ({ page }) => {
  await page.goto('/atlas/'); await openAtlasTab(page, 'Infrastructure'); await page.getByRole('button', { name: 'Load infrastructure context' }).click();
  const section = page.getByRole('region', { name: 'Hydropower', exact: true });
  await expect(section).toHaveAttribute('data-hydropower-state', /ready|stale/, { timeout: 15_000 });
  await expect(section.getByText(/45 mapped plants/i)).toBeVisible();
  await expect(section.getByText(/proximity does not establish damage, vulnerability or risk/i)).toBeVisible();
  await expect(section.getByText(/OpenStreetMap/i).first()).toBeVisible();
});
