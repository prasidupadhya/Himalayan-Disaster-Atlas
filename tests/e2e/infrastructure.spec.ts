import { expect, test } from '@playwright/test';

test('infrastructure loads on demand with independent evidence-traceable classes', async ({ page }) => {
  await page.goto('/atlas/'); await page.getByRole('button', { name: 'Load additional map datasets' }).click();
  const section = page.getByRole('region', { name: 'Infrastructure', exact: true });
  await expect(section).toHaveAttribute('data-infrastructure-state', 'idle');
  await section.getByLabel('Load infrastructure inventory').check();
  await expect(section).toHaveAttribute('data-infrastructure-state', /ready|stale/, { timeout: 30_000 });
  await expect(section.getByLabel(/Major roads \(5,311\)/)).toBeChecked();
  await expect(section.getByLabel(/Major bridges \(3,004\)/)).toBeChecked();
  await expect(section.getByLabel(/Schools \(25,674\)/)).toBeChecked();
  await expect(section.getByLabel(/Health facilities \(4,654\)/)).toBeChecked();
  await expect(section.getByLabel(/Emergency facilities \(923\)/)).toBeChecked();
  await expect(section.getByLabel(/Settlements \(4,045\)/)).toBeChecked();
  await expect(section).toContainText('absence');
  await expect(section).toContainText('not an exposure, vulnerability, damage, or risk result');
  await section.getByLabel(/Major roads \(5,311\)/).uncheck();
  await expect(section.getByLabel(/Major roads \(5,311\)/)).not.toBeChecked();
});
