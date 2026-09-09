import { expect, test } from '@playwright/test';

test('global search finds typed source-backed entities and preserves ambiguity', async ({ page, baseURL }) => {
  const external: string[] = [];
  page.on('request', request => { if (new URL(request.url()).origin !== new URL(baseURL!).origin && !request.url().startsWith('blob:')) external.push(request.url()); });
  await page.goto('/atlas/');
  const search = page.getByRole('region', { name: 'Global Search' });
  await search.getByRole('searchbox', { name: 'Search the atlas' }).fill('Everest');
  await search.getByRole('button', { name: 'Search atlas' }).click();
  await expect(search).toHaveAttribute('data-search-state', 'ready');
  await expect(search.getByText('Mount Everest', { exact: true }).first()).toBeVisible();
  await expect(search).toContainText('mountain');

  await search.getByRole('searchbox', { name: 'Search the atlas' }).fill('Bagmati');
  await search.getByRole('button', { name: 'Search atlas' }).click();
  await expect(search.getByRole('region', { name: 'Administrative units' })).toBeVisible();
  const bagmatiButtons = search.getByRole('button', { name: /Bagmati/ });
  expect(await bagmatiButtons.count()).toBeGreaterThan(1);
  await bagmatiButtons.first().click();
  await expect(search).toContainText('Ambiguous name');
  expect(external).toEqual([]);
});
