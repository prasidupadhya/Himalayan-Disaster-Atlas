import { expect, test } from '@playwright/test';

test('location explorer keeps proximity spatial-only and preserves source dates', async ({ page, baseURL }) => {
  test.setTimeout(60_000);
  const external: string[] = [];
  page.on('request', request => {
    if (new URL(request.url()).origin !== new URL(baseURL!).origin && !request.url().startsWith('blob:')) external.push(request.url());
  });
  await page.goto('/atlas/');
  const explorer = page.getByRole('region', { name: 'Location Explorer' });
  await explorer.getByLabel('Load location context datasets').check();
  await expect(explorer).toHaveAttribute('data-location-explorer-state', 'ready', { timeout: 45_000 });
  await explorer.getByLabel('Longitude').fill('85.324');
  await explorer.getByLabel('Latitude').fill('27.7172');
  await explorer.getByRole('button', { name: 'Inspect location' }).click();
  await expect(explorer.getByText(/Different dataset dates are preserved above/i)).toBeVisible();
  await expect(explorer.getByText(/Nearby.*distance only/i)).toBeVisible();
  await expect(explorer.getByText(/UNAVAILABLE numeric point lookup/i)).toBeVisible();
  await expect(explorer.getByText('District', { exact: true })).toBeVisible();
  expect(external).toEqual([]);
});
