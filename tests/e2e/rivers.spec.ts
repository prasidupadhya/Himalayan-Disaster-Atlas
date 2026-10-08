import { test, expect } from '@playwright/test';

test('river network loads both partitions and exposes downstream topology', async ({ page, baseURL }) => {
  const external: string[] = [];
  page.on('request', request => { if (new URL(request.url()).origin !== new URL(baseURL!).origin && !request.url().startsWith('blob:')) external.push(request.url()); });
  await page.goto('/atlas/');
  const rivers = page.getByRole('region', { name: 'Rivers', exact: true });
  await expect(rivers).toHaveAttribute('data-rivers-state', 'ready', { timeout: 15_000 });
  await rivers.getByLabel('Find a river or reach').fill('40669746');
  await rivers.getByLabel('River or reach', { exact: true }).selectOption('hyriv-40669746');
  await expect(rivers.getByRole('heading', { name: 'HYRIV 40669746' })).toBeVisible();
  await expect(rivers.getByText('HYRIV 40670088', { exact: true })).toBeVisible();
  await expect(rivers.getByText('UNKNOWN', { exact: true }).first()).toBeVisible();
  await rivers.getByRole('checkbox', { name: 'Show river network' }).uncheck();
  await expect(rivers.getByRole('checkbox', { name: 'Show river network' })).not.toBeChecked();
  expect(external).toEqual([]);
});

test('a river line clicked on the map selects its reach, which can then be traced downstream', async ({ page }) => {
  await page.goto('/atlas/');
  const rivers = page.getByRole('region', { name: 'Rivers', exact: true });
  const trace = page.getByRole('region', { name: 'Downstream trace', exact: true });
  await expect(rivers).toHaveAttribute('data-rivers-state', 'ready', { timeout: 15_000 });
  await rivers.getByLabel('Find a river or reach').fill('40669746');
  await rivers.getByLabel('River or reach', { exact: true }).selectOption('hyriv-40669746');
  await rivers.getByLabel('River or reach', { exact: true }).selectOption('');
  const box = await page.locator('.map-shell canvas').first().boundingBox();
  await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await expect(rivers.locator('.selection h3')).toHaveText(/^HYRIV \d+$/);
  await expect(trace.getByRole('button', { name: 'Trace downstream', exact: true })).toBeEnabled();
});
