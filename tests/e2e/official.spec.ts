import { expect, test } from '@playwright/test';

// SYNTHETIC digest: every value below is a test fixture, not a real reading.
const digest = {
  format: 'atlas-gov-digest@1', generated_at: '2026-10-17T00:17:00Z', generated_at_nepal: '2026-10-17 06:02 NPT', notice: 'test',
  summary: { sources_fetched: 1, sources_last_known: 1, sources_unavailable: 0, rivers_above_danger: 1, rivers_above_warning: 0, rain_stations_above_warning: null, new_links: 1 },
  sources: [
    { id: 'bipad-river', agency: 'SYNTHETIC agency', title: 'River water levels', category: 'rivers', kind: 'bipad-river', url: 'https://example.test/river', status: 'fetched', http_status: 200, checked_at: '2026-10-17T00:17:00Z', fetched_at: '2026-10-17T00:17:00Z',
      content: { station_count: 2, status_counts: { 'ABOVE DANGER LEVEL': 1, 'BELOW WARNING LEVEL': 1 }, alert_stations: [{ id: '2', name: 'SYNTHETIC Station B', basin: 'Gandaki', status: 'ABOVE DANGER LEVEL', water_level_m: 7.2, warning_level_m: 5.5, danger_level_m: null, observed_at: '2026-10-17T00:00:00Z' }] }, changes: {} },
    { id: 'dhm-forecast', agency: 'SYNTHETIC forecast office', title: 'Weather forecast', category: 'weather', kind: 'html', url: 'https://example.test/mfd', status: 'unreachable', http_status: 503, checked_at: '2026-10-17T00:17:00Z', fetched_at: '2026-10-16T00:17:00Z', last_known: true,
      content: { title: 'SYNTHETIC', headings: ['SYNTHETIC forecast heading'], tables: [], links: [{ text: 'SYNTHETIC bulletin', href: 'https://example.test/b.pdf', document: true }], paragraphs: ['SYNTHETIC paragraph that is long enough to be kept by the extractor.'], dates_mentioned: [] }, changes: {} },
  ],
};

test('official sources show organised copies, last-known status and UNKNOWN for missing values', async ({ page }) => {
  await page.route('**/gov/latest.json', route => route.fulfill({ contentType: 'application/json', body: JSON.stringify(digest) }));
  await page.goto('/official/');
  await expect(page.locator('[data-official-state]')).toHaveAttribute('data-official-state', 'ready');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Official sources today');
  const river = page.getByRole('article', { name: 'River water levels' });
  await expect(river.getByRole('row', { name: /SYNTHETIC Station B/ })).toContainText('UNKNOWN');
  const forecast = page.getByRole('article', { name: 'Weather forecast' });
  await expect(forecast).toHaveAttribute('data-source-status', 'last-known');
  await expect(forecast).toContainText('HTTP 503');
  await expect(forecast).toContainText('SYNTHETIC forecast heading');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
});

test('official sources say when no copy exists yet', async ({ page }) => {
  await page.route('**/gov/latest.json', route => route.fulfill({ status: 404, body: 'missing' }));
  await page.goto('/official/');
  await expect(page.getByRole('status')).toContainText('first daily copy has not been published yet');
});
