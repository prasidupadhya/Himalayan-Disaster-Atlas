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

test('river flags from old readings are listed apart and not counted as current', async ({ page }) => {
  const river = { ...digest.sources[0], content: {
    station_count: 3, fresh_hours: 24, current_station_count: 2, status_counts: { 'ABOVE DANGER LEVEL': 1, 'BELOW WARNING LEVEL': 2 }, current_status_counts: { 'BELOW WARNING LEVEL': 2 }, alert_stations: [],
    stale_alert_stations: [{ id: '9', name: 'SYNTHETIC Old Station', basin: 'Koshi', status: 'ABOVE DANGER LEVEL', water_level_m: 9, warning_level_m: 5, danger_level_m: 6, observed_at: '2024-11-12T17:25:00Z', current: false }] } };
  const body = { ...digest, summary: { ...digest.summary, rivers_above_danger: 0, rivers_above_warning: 0 }, sources: [river] };
  await page.route('**/gov/latest.json', route => route.fulfill({ contentType: 'application/json', body: JSON.stringify(body) }));
  await page.goto('/official/');
  const article = page.getByRole('article', { name: 'River water levels' });
  await expect(article).toContainText('2 of 3 stations reported in the 24 hours before this copy');
  await expect(article).toContainText('No recent reading is above warning level.');
  await article.getByText('1 station still shows a warning or danger flag from an older reading').click();
  await expect(article.getByRole('row', { name: /SYNTHETIC Old Station/ })).toContainText('12 Nov 2024');
});

test('incident lists say their window, flag a possibly cut-off window and format dates', async ({ page }) => {
  const incidents = { id: 'bipad-incidents', agency: 'SYNTHETIC agency', title: 'Disaster incidents, last 7 days', category: 'disasters', kind: 'json-list', url: 'https://example.test/incidents', status: 'fetched', http_status: 200, checked_at: '2026-10-17T00:17:00Z', fetched_at: '2026-10-17T00:17:00Z',
    content: { record_count: 2, complete: false, within_days: 7, columns: ['id', 'title', 'titleNe', 'incidentOn', 'verified'], records: [{ id: 1, title: 'SYNTHETIC landslide', titleNe: 'SYNTHETIC', incidentOn: '2026-10-16T18:15:00Z', verified: true }, { id: 2, title: 'SYNTHETIC fire', titleNe: null, incidentOn: null, verified: false }] }, changes: {} };
  await page.route('**/gov/latest.json', route => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ ...digest, sources: [incidents] }) }));
  await page.goto('/official/');
  const table = page.getByRole('article', { name: 'Disaster incidents, last 7 days' }).getByRole('table');
  await expect(table.locator('caption')).toHaveText('2 or more records in the last 7 days; newest 2 shown as published');
  await expect(table.getByRole('columnheader')).toHaveText(['Title', 'Date', 'Verified']);
  await expect(table.getByRole('row', { name: /SYNTHETIC landslide/ })).toContainText('17 Oct 2026, 00:00 NPT');
  await expect(table.getByRole('row', { name: /SYNTHETIC fire/ })).toContainText('UNKNOWN');
});
