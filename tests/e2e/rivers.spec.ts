import { test, expect } from '@playwright/test';

test('river network loads both partitions and exposes downstream topology', async ({ page }) => {
  const external: string[] = [];
  page.on('request', request => { if (!request.url().startsWith('http://127.0.0.1:4173') && !request.url().startsWith('blob:')) external.push(request.url()); });
  await page.goto('/atlas/');
  const rivers = page.getByRole('region', { name: 'Rivers', exact: true });
  await expect(rivers).toHaveAttribute('data-rivers-state', 'ready');
  await rivers.getByLabel('Find a reach').fill('40669746');
  await rivers.getByLabel('River reach').selectOption('hyriv-40669746');
  await expect(rivers.getByRole('heading', { name: 'HYRIV 40669746' })).toBeVisible();
  await expect(rivers.getByText('HYRIV 40670088', { exact: true })).toBeVisible();
  await expect(rivers.getByText('UNKNOWN', { exact: true }).first()).toBeVisible();
  await rivers.getByRole('checkbox', { name: 'Show river network' }).uncheck();
  await expect(rivers.getByRole('checkbox', { name: 'Show river network' })).not.toBeChecked();
  expect(external).toEqual([]);
});
