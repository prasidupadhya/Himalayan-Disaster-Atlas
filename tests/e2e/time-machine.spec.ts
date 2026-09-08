import { expect, test } from '@playwright/test';
import index from '../../data/releases/atlas-time-index/1.0.0/index.json';

test.use({ timezoneId: 'Asia/Kathmandu' });
test('UTC timeline synchronizes imagery, gaps, climate months and event days', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/atlas/');
  const timeline = page.getByRole('region', { name: 'Time Machine', exact: true });
  const water = page.getByRole('region', { name: 'Water Change', exact: true });
  const satellite = page.getByRole('region', { name: 'Satellite', exact: true });
  const climate = page.getByRole('region', { name: 'Climate', exact: true });
  const events = page.getByRole('region', { name: 'Disaster Events', exact: true });
  await expect(timeline).toHaveAttribute('data-time-machine-state', 'ready');
  await timeline.getByLabel('Synchronize observation date').check();
  await expect(water.getByLabel('Later water observation')).toHaveValue('2025-04-01');
  await expect(water.getByRole('img', { name: 'Phewa true colour acquired 2024-04-19' })).toBeVisible();
  await expect(water.getByRole('img', { name: 'Phewa true colour acquired 2025-04-01' })).toBeVisible();
  await expect(satellite).toContainText('UNAVAILABLE');
  await expect(climate).toContainText('UNAVAILABLE');
  await expect(events).toHaveAttribute('data-disaster-events-state', /ready|stale/);
  await expect(events.getByLabel('From', { exact: true })).toHaveValue('2025-04-01');
  const eventDay = index.products.find(p => p.id === 'events')!.observations.find(o => o.id === '2025-04-01')!;
  await expect(timeline.locator('[data-temporal-product="events"]')).toContainText(`${eventDay.count} reported events`);
  await expect(events.getByRole('combobox', { name: 'Incident', exact: true }).locator('option').nth(1)).toContainText('2025-04-01');
  await timeline.getByLabel('Observation date (UTC)', { exact: true }).fill('2025-04-02');
  await expect(water).toContainText('UNAVAILABLE — no water observation');
  await expect(water.getByRole('img')).toHaveCount(0);
  await timeline.getByLabel('Observation date (UTC)', { exact: true }).fill('2000-02-29');
  await expect(climate).toContainText('whole month 2000-02');
  await expect(climate.getByRole('combobox', { name: 'Period', exact: true })).toHaveValue('2000');
  await expect(climate.getByLabel('Focus month')).toHaveValue('2');
  await expect(climate.getByRole('img')).toBeVisible();
  await expect(events).toContainText('outside this archive');
  await timeline.getByLabel('Observation date (UTC)', { exact: true }).fill('2026-04-06');
  await expect(satellite).toContainText('2026-04-06T05:11:27');
  await expect(satellite.getByLabel('Show true-colour preview')).toBeChecked();
  await expect(climate.getByRole('img')).toHaveCount(0);
  await timeline.getByLabel('Observation date (UTC)', { exact: true }).fill('2026-04-07');
  await expect(satellite).toContainText('UNAVAILABLE');
  await expect(satellite.getByLabel('Show true-colour preview')).not.toBeChecked();
  await timeline.getByLabel('Synchronize observation date').uncheck();
  await expect(climate.getByRole('combobox', { name: 'Period', exact: true })).toHaveValue('normal');
  await expect(water.getByLabel('Later water observation')).toBeEnabled();
  expect(errors).toEqual([]);
});

test('date browsing is explicit and invalid comparisons remain unavailable', async ({ page }) => {
  await page.goto('/atlas/');
  const timeline = page.getByRole('region', { name: 'Time Machine', exact: true });
  const water = page.getByRole('region', { name: 'Water Change', exact: true });
  await expect(timeline).toHaveAttribute('data-time-machine-state', 'ready');
  await timeline.getByLabel('Synchronize observation date').check();
  await timeline.getByRole('button', { name: 'Next available' }).click();
  await expect(timeline.getByLabel('Observation date (UTC)', { exact: true })).toHaveValue('2026-04-26');
  await expect(water).toContainText('Comparison unavailable:');
  await timeline.getByLabel('Compare water with earlier date (UTC)').fill('2026-04-26');
  await expect(water).toContainText('Choose two different dates in chronological order');
  await expect(water.getByRole('region', { name: 'Water before and after imagery' })).toHaveCount(0);
  await timeline.getByLabel('Browse available dates for').selectOption('climate');
  await expect(timeline.getByLabel('Observation date (UTC)', { exact: true })).toHaveValue('2026-04-26');
  await timeline.getByRole('combobox', { name: 'Available observations', exact: true }).selectOption('2020-12-01');
  await expect(page.getByRole('region', { name: 'Climate', exact: true })).toContainText('whole month 2020-12');
});

test('a corrupt temporal index is not cached and can be retried', async ({ page }) => {
  await page.route('**/atlas-time-index/1.0.0/index.json', route => route.fulfill({ body: '{}' }));
  await page.goto('/atlas/');
  const timeline = page.getByRole('region', { name: 'Time Machine', exact: true });
  await expect(timeline).toHaveAttribute('data-time-machine-state', 'error');
  await expect(timeline.getByLabel('Synchronize observation date')).toBeDisabled();
  await page.unroute('**/atlas-time-index/1.0.0/index.json');
  await timeline.getByRole('button', { name: 'Try again' }).click();
  await expect(timeline).toHaveAttribute('data-time-machine-state', 'ready');
});

test('late imagery cannot restore an obsolete date after a gap is selected', async ({ page }) => {
  await page.route('**/phewa-water-change/1.0.0/2026-04-26-rgb.png', async route => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    await route.continue().catch(() => {});
  });
  await page.goto('/atlas/');
  const timeline = page.getByRole('region', { name: 'Time Machine', exact: true });
  const water = page.getByRole('region', { name: 'Water Change', exact: true });
  await expect(timeline).toHaveAttribute('data-time-machine-state', 'ready');
  await timeline.getByLabel('Synchronize observation date').check();
  await timeline.getByLabel('Observation date (UTC)', { exact: true }).fill('2026-04-26');
  await water.getByLabel('Water display').selectOption('true_colour');
  await timeline.getByLabel('Observation date (UTC)', { exact: true }).fill('2026-04-27');
  await expect(water).toContainText('UNAVAILABLE');
  await page.waitForTimeout(1500);
  await expect(water.getByRole('img')).toHaveCount(0);
});
