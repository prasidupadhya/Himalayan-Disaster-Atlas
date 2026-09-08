import { expect, test } from '@playwright/test';

test('evidence browser retrieves exact citations, filters metadata and qualifies absent support', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/sources/');
  await page.getByRole('link', { name: 'evidence browser' }).click();
  await expect(page.getByRole('heading', { name: 'Inspect the evidence.' })).toBeVisible();
  await expect(page.getByText('8 approved project documents')).toBeVisible();
  await page.getByLabel('Evidence keywords').fill('NEXT_DOWN');
  await page.getByLabel('Dataset', { exact: true }).selectOption('nepal-rivers-primary');
  await page.getByRole('button', { name: 'Retrieve evidence' }).click();
  await expect(page.getByRole('status')).toContainText('not an answer');
  const first = page.locator('.evidence-citation').first();
  await expect(first).toContainText('NEXT_DOWN');
  await first.getByText('Source, dates and dataset versions').click();
  await expect(first).toContainText('SHA-256');
  await expect(first).toContainText('UNKNOWN');
  const snapshot = await first.getByRole('link', { name: 'Open exact document snapshot' }).getAttribute('href');
  const response = await page.request.get(snapshot!);
  expect(response.ok()).toBe(true);
  expect(await response.text()).toContain(await first.locator('blockquote p').innerText());
  await page.getByLabel('From (UTC)').fill('2020-01-01');
  await page.getByRole('button', { name: 'Retrieve evidence' }).click();
  await expect(page.getByRole('status')).toContainText('Insufficient evidence');
  await page.getByLabel('Date basis').selectOption('accessed_at');
  await page.getByRole('button', { name: 'Retrieve evidence' }).click();
  await expect(page.locator('.evidence-citation').first()).toBeVisible();
  await page.getByLabel('Evidence keywords').fill('zzzzunknownmeasurement');
  await page.getByRole('button', { name: 'Retrieve evidence' }).click();
  await expect(page.getByRole('status')).toContainText('does not establish geographic absence');
  expect(errors).toEqual([]);
});

test('evidence loading fails closed and supports retry', async ({ page }) => {
  await page.route('**/atlas-evidence/1.0.0/corpus.json.gz', route => route.fulfill({ status: 200, body: 'corrupted' }));
  await page.goto('/evidence/');
  await expect(page.getByRole('main').getByRole('alert')).toContainText('checksum mismatch');
  await expect(page.getByRole('button', { name: 'Retrieve evidence' })).toHaveCount(0);
  await page.unroute('**/atlas-evidence/1.0.0/corpus.json.gz');
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByRole('button', { name: 'Retrieve evidence' })).toBeVisible();
});

test('evidence citations fit a mobile screen with keyboard submission', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/evidence/');
  await page.getByLabel('Evidence keywords').fill('scenario limitations');
  await page.getByLabel('Evidence keywords').press('Enter');
  await expect(page.locator('.evidence-citation').first()).toBeVisible();
  await page.locator('.evidence-citation').first().getByText('Source, dates and dataset versions').click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/rag-mobile.png' });
});
