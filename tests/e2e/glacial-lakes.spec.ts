import { test, expect } from '@playwright/test';

test('GLO glacial lakes render as non-hazard inventory records with traceable change statistics', async ({ page, baseURL }) => {
  const external: string[] = [];
  page.on('request', request => {
    if (new URL(request.url()).origin !== new URL(baseURL!).origin && !request.url().startsWith('blob:')) external.push(request.url());
  });
  await page.goto('/atlas/'); await page.getByRole('button', { name: 'Load additional map datasets' }).click();
  const lakes = page.getByRole('region', { name: 'Glacial lakes', exact: true });
  await expect(lakes).toHaveAttribute('data-glacial-lakes-state', 'ready');
  await expect(lakes.getByText(/Nepal 2,347 · China 1,745 · India 58/)).toBeVisible();
  await lakes.getByRole('searchbox').fill('GLO_87.08864_27.79792');
  await expect(lakes.getByRole('option', { name: /GLO_87\.08864_27\.79792/ })).toHaveCount(1);
  await lakes.getByRole('combobox').selectOption('glo-87-08864-27-79792');
  await expect(lakes.getByRole('heading', { name: 'GLO_87.08864_27.79792' })).toBeVisible();
  await expect(lakes.getByText('Nepal', { exact: true })).toBeVisible();
  await expect(lakes.getByText('Koshi', { exact: true })).toBeVisible();
  await expect(lakes.getByText('Glacier-fed', { exact: true })).toBeVisible();
  await expect(lakes.getByText('0.082 ± 0.0132 km²/year', { exact: true })).toBeVisible();
  await expect(lakes.getByText(/NOT ASSESSED/)).toBeVisible();
  await expect(lakes.getByText(/Specific glacier/)).toBeVisible();
  await lakes.getByRole('checkbox', { name: 'Show GLO unique lakes' }).uncheck();
  await expect(lakes.getByRole('checkbox', { name: 'Show GLO unique lakes' })).not.toBeChecked();
  expect(external).toEqual([]);
});
