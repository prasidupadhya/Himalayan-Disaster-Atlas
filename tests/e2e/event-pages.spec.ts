import { expect, test } from '@playwright/test';

test('event pages expose source-backed facts without inventing unsupported details', async ({ page }) => {
  const external: string[] = [];
  page.on('request', request => { if (!request.url().startsWith('http://127.0.0.1:4173')) external.push(request.url()); });
  await page.goto('/events/');
  const root = page.locator('[data-event-pages-state]');
  await expect(root).toHaveAttribute('data-event-pages-state', 'ready');
  const picker = page.getByLabel('Verified event');
  await picker.selectOption({ index: 1 });
  await expect(page.getByRole('heading', { level: 3, name: 'Source-reported impacts' })).toBeVisible();
  await expect(page.getByText('Source record:', { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/This page uses the source-reported incident point only/i)).toBeVisible();
  await expect(page.getByRole('link', { name: /Open this reported point in the Atlas/i })).toBeVisible();
  expect(external).toEqual([]);
});
