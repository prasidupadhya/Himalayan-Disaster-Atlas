import { expect, test } from '@playwright/test';

test('compare mode shows compatible mountain metrics and blocks cross-type comparisons', async ({ page, baseURL }) => {
  test.setTimeout(90_000);
  const external: string[] = [];
  page.on('request', request => { if (new URL(request.url()).origin !== new URL(baseURL!).origin && !request.url().startsWith('blob:')) external.push(request.url()); });
  await page.goto('/atlas/');
  const compare = page.getByRole('region', { name: 'Compare Mode' });

  await compare.getByRole('searchbox', { name: 'Search A' }).fill('Everest');
  await compare.getByRole('button', { name: 'Find A' }).click();
  await expect(compare.locator('fieldset').first()).toHaveAttribute('data-compare-picker-state', 'ready');
  const everest = await compare.getByLabel('Entity A').locator('option').filter({ hasText: 'Mount Everest' }).first().getAttribute('value');
  expect(everest).toBeTruthy();
  await compare.getByLabel('Entity A').selectOption(everest!);

  await compare.getByRole('searchbox', { name: 'Search B' }).fill('Manaslu');
  await compare.getByRole('button', { name: 'Find B' }).click();
  await expect(compare.locator('fieldset').nth(1)).toHaveAttribute('data-compare-picker-state', 'ready');
  const manaslu = await compare.getByLabel('Entity B').locator('option').filter({ hasText: 'Manāslu' }).first().getAttribute('value');
  expect(manaslu).toBeTruthy();
  await compare.getByLabel('Entity B').selectOption(manaslu!);

  await compare.getByRole('button', { name: 'Compare selected' }).click();
  await expect(compare).toHaveAttribute('data-compare-state', 'ready');
  await expect(compare.getByRole('table', { name: 'Scientifically compatible metrics' })).toContainText('Source summit elevation');
  await expect(compare.getByRole('table', { name: 'Source, date, version and resolution' })).toContainText('GeoNames');
  await expect(compare).toContainText('No better/worse ranking');

  await compare.getByRole('searchbox', { name: 'Search B' }).fill('Hindun');
  await compare.getByRole('button', { name: 'Find B' }).click();
  const hindun = await compare.getByLabel('Entity B').locator('option').filter({ hasText: 'Hindun' }).first().getAttribute('value');
  expect(hindun).toBeTruthy();
  await compare.getByLabel('Entity B').selectOption(hindun!);
  await compare.getByRole('button', { name: 'Compare selected' }).click();
  await expect(compare).toHaveAttribute('data-compare-state', 'blocked');
  await expect(compare).toContainText('Cross-type comparison is unsupported');
  expect(external).toEqual([]);
});
