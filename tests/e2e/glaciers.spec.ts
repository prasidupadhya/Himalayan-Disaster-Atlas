import { test, expect } from '@playwright/test';

test('RGI glacier inventory loads, searches and exposes dated provenance', async ({ page }) => {
  const external: string[] = [];
  page.on('request', request => {
    if (!request.url().startsWith('http://127.0.0.1:4173') && !request.url().startsWith('blob:')) external.push(request.url());
  });
  await page.goto('/atlas/');
  const glaciers = page.getByRole('region', { name: 'Glaciers', exact: true });
  await expect(glaciers).toHaveAttribute('data-glaciers-state', 'ready');
  await glaciers.getByRole('searchbox').fill('Imja/Lhotse');
  await expect(glaciers.getByRole('option', { name: /Imja\/Lhotse Shar Gl\./ })).toHaveCount(1);
  await glaciers.getByRole('combobox').selectOption('rgi2000-v7-0-g-15-06763');
  await expect(glaciers.getByRole('heading', { name: 'Imja/Lhotse Shar Gl.' })).toBeVisible();
  await expect(glaciers.getByText('RGI2000-v7.0-G-15-06763', { exact: true })).toBeVisible();
  await expect(glaciers.getByText('17.486 km²', { exact: true })).toBeVisible();
  await expect(glaciers.getByText(/These are RGI inventory outlines, not 2026 glacier margins/)).toBeVisible();
  await glaciers.getByRole('checkbox', { name: 'Show glacier inventory' }).uncheck();
  await expect(glaciers.getByRole('checkbox', { name: 'Show glacier inventory' })).not.toBeChecked();
  expect(external).toEqual([]);
});
