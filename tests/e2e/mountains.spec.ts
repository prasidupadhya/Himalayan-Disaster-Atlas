import { test, expect } from '@playwright/test';

test('mountain catalogue renders, searches and exposes provenance without runtime APIs', async ({ page, baseURL }) => {
  const external: string[] = [];
  page.on('request', request => { if (new URL(request.url()).origin !== new URL(baseURL!).origin && !request.url().startsWith('blob:')) external.push(request.url()); });
  await page.goto('/atlas/'); await page.getByRole('button', { name: 'Load additional map datasets' }).click();
  const mountains = page.getByRole('region', { name: 'Mountains', exact: true });
  await expect(mountains).toHaveAttribute('data-mountains-state', 'ready');
  await mountains.getByLabel('Search peaks').fill('Everest');
  await mountains.getByLabel('Mountain record').selectOption('geonames-1283416');
  await expect(mountains.getByRole('heading', { name: 'Mount Everest' })).toBeVisible();
  await expect(mountains.getByText('8,848 m', { exact: true })).toBeVisible();
  await mountains.getByRole('checkbox', { name: 'Show mountains' }).uncheck();
  await expect(mountains.getByRole('checkbox', { name: 'Show mountains' })).not.toBeChecked();
  expect(external).toEqual([]);
});
