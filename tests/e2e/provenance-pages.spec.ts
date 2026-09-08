import { expect, test } from '@playwright/test';

test('provenance flows from atlas evidence into catalog, methodology and sources', async ({ page }) => {
  const external: string[] = [];
  page.on('request', request => {
    const url = new URL(request.url());
    if (['http:', 'https:'].includes(url.protocol) && url.hostname !== '127.0.0.1') external.push(request.url());
  });

  await page.goto('/atlas/');
  await expect(page.locator('.map')).toHaveAttribute('data-map-ready', 'true');
  const boundary = page.locator('.record-picker select');
  const firstValue = await boundary.locator('option').nth(1).getAttribute('value');
  await boundary.selectOption(firstValue!);
  const evidence = page.locator('.atlas-panel > .evidence');
  await expect(evidence).toContainText('Access date');
  await expect(evidence).toContainText('Processing version');
  await expect(evidence).toContainText('Evidence type');
  const catalogHref = await evidence.getByRole('link', { name: 'Catalog record' }).getAttribute('href');
  expect(catalogHref).toContain('/data-catalog/?dataset=');

  await page.goto('/data-catalog/?dataset=nepal-mountains&version=1.0.0');
  const detail = page.locator('#catalog-detail');
  await expect(detail).toContainText('Nepal mountains and peaks');
  await expect(detail).toContainText('GeoNames');
  await expect(detail).toContainText('Manifest SHA-256');
  await expect(detail).toContainText('Processing and transformation');
  await expect(detail).toContainText('Uncertainty and limitations');
  expect(await detail.getByRole('link', { name: 'Methodology' }).getAttribute('href')).toContain('#mountains-method');
  expect(await detail.getByRole('link', { name: 'Source directory' }).getAttribute('href')).toContain('#mountains');

  await page.getByLabel('Include superseded releases and development fixtures').check();
  await page.getByLabel('Search datasets').fill('nepal-admin-country');
  await expect(page.locator('.catalog-results')).toContainText('SUPERSEDED');
  await expect(page.locator('.catalog-results')).toContainText('2.0.0');
  await expect(page.locator('.catalog-results')).toContainText('2.0.1');

  await page.goto('/methodology/#mountains-method');
  await expect(page.locator('#mountains-method')).toBeVisible();
  await expect(page.locator('article')).toContainText('OGC:CRS84');
  await expect(page.locator('article')).toContainText('EPSG:6933');

  await page.goto('/sources/#mountains');
  const source = page.locator('#mountains');
  await expect(source).toContainText('GeoNames');
  await expect(source).toContainText('Access dates');
  await expect(source).toContainText('Licence');
  await expect(source).toContainText('Used by');
  await expect(source.getByRole('link', { name: /Nepal mountains and peaks/ })).toBeVisible();
  expect(external).toEqual([]);
});

test('catalog filters current releases by category and source without exposing secrets', async ({ page }) => {
  await page.goto('/data-catalog/');
  await page.getByLabel('Category').selectOption('Cryosphere');
  await page.getByLabel('Search datasets').fill('glacier');
  await expect(page.locator('.catalog-results')).toContainText('Glacier');
  await expect(page.locator('.catalog-results')).not.toContainText('Synthetic fixture');
  const record = page.locator('.catalog-record').first();
  await record.click();
  await expect(page.locator('#catalog-detail')).not.toContainText(/api[_ -]?key|client secret|oauth token/i);
  await expect(page.locator('#catalog-detail')).toContainText('No acquisition credentials, tokens or private source configuration');
});
