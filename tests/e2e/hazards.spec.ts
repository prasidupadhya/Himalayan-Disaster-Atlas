import { expect, test, type Page } from '@playwright/test';

// SYNTHETIC digest: every value below is a test fixture, not a real reading.
const digest = {
  format: 'atlas-gov-digest@1', generated_at: '2026-10-17T00:17:00Z', generated_at_nepal: '2026-10-17 06:02 NPT', notice: 'test',
  summary: { sources_fetched: 3, sources_last_known: 1, sources_unavailable: 0, rivers_above_danger: 1, rivers_above_warning: null, rain_stations_above_warning: null, rivers_current: 2, rain_current: null, new_links: 0 },
  sources: [
    { id: 'bipad-river', agency: 'SYNTHETIC agency', title: 'River water levels', category: 'rivers', kind: 'bipad-river', url: 'https://example.test/river', status: 'fetched', http_status: 200, checked_at: '2026-10-17T00:17:00Z', fetched_at: '2026-10-17T00:17:00Z',
      content: { station_count: 3, current_station_count: 2, status_counts: { 'ABOVE DANGER LEVEL': 1 }, alert_stations: [{ id: '2', name: 'SYNTHETIC Station B', basin: 'Gandaki', status: 'ABOVE DANGER LEVEL', water_level_m: 7.2, warning_level_m: 5.5, danger_level_m: null, observed_at: null }] }, changes: {} },
    { id: 'seismo-earthquakes', agency: 'SYNTHETIC seismology centre', title: 'Recent earthquakes', category: 'earthquakes', kind: 'html', url: 'https://example.test/eq', status: 'error', http_status: null, checked_at: '2026-10-17T00:17:00Z', fetched_at: '2026-10-16T00:17:00Z', last_known: true,
      content: { title: null, headings: [], links: [], paragraphs: [], dates_mentioned: [], tables: [{ caption: null, header: ['Date', 'Magnitude (ML)', 'Epicenter'], rows: [['AD: 2026-10-07', '4.1 ML', 'SYNTHETIC Place']] }] }, changes: {} },
    { id: 'bipad-incidents', agency: 'SYNTHETIC agency', title: 'Disaster incidents, last 7 days', category: 'disasters', kind: 'json-list', url: 'https://example.test/incidents', status: 'fetched', http_status: 200, checked_at: '2026-10-17T00:17:00Z', fetched_at: '2026-10-17T00:17:00Z',
      content: { record_count: 2, complete: true, within_days: 7, columns: ['id', 'title', 'titleNe'], records: [{ id: 1, title: 'SYNTHETIC landslide', titleNe: 'SYNTHETIC पहिरो' }, { id: 2, title: 'SYNTHETIC fire', titleNe: null }] }, changes: {} },
  ],
};
const serve = (page: Page) => page.route('**/gov/latest.json', route => route.fulfill({ contentType: 'application/json', body: JSON.stringify(digest) }));
const section = (page: Page, id: string) => page.locator(`section#${id}`);

test('today is arranged around floods, glacial lakes and earthquakes with status and UNKNOWN for missing figures', async ({ page }) => {
  await serve(page);
  await page.goto('/hazards/');
  await expect(page.locator('[data-today-state]')).toHaveAttribute('data-today-state', 'ready');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Floods, glacial lakes and earthquakes today');
  await expect(page.getByRole('navigation', { name: 'On this page' }).getByRole('link')).toHaveText(['Floods', 'Glacial lakes', 'Earthquakes', 'Reported incidents']);
  await expect(page.getByText('Copied 2026-10-17 06:02 NPT')).toBeVisible();

  const rivers = section(page, 'floods').locator('[data-source="bipad-river"]');
  await expect(rivers).toContainText('1 stations above danger level');
  await expect(rivers).toContainText('UNKNOWN above warning level');
  await expect(rivers).toContainText('2 / 3 stations reported in the last 24 h');
  await expect(rivers).toContainText('SYNTHETIC Station B (Gandaki): above danger level');
  await expect(section(page, 'floods').getByRole('listitem').filter({ hasText: 'Alerts' })).toContainText('Not available in today’s copy');

  await expect(section(page, 'glacial-lakes')).toContainText('No agency publishes a daily status for glacial lakes');
  await expect(section(page, 'glacial-lakes').getByRole('link', { name: 'Find a glacial lake on the map' })).toHaveAttribute('href', '/atlas/#lake-controls');

  const quake = section(page, 'earthquakes').locator('[data-source="seismo-earthquakes"]');
  await expect(quake).toHaveAttribute('data-source-status', 'last-known');
  const row = quake.getByRole('row').nth(1);
  await expect(quake.getByRole('columnheader')).toHaveText(['Date (AD)', 'Magnitude', 'Epicentre']);
  await expect(row.getByRole('cell')).toHaveText(['2026-10-0710 days before this copy', '4.1 ML', 'SYNTHETIC Place']);

  const glance = page.getByRole('list', { name: 'At a glance' });
  await expect(glance.getByRole('link')).toHaveCount(4);
  await expect(glance).toContainText('Rivers: 1 above danger, UNKNOWN above warning. Rain: UNKNOWN stations above warning.');
  await expect(glance).toContainText('Latest recorded: 4.1 ML, SYNTHETIC Place, 2026-10-07.');
  await expect(glance).toContainText('2 recorded by BIPAD in the last 7 days.');
  await expect(section(page, 'earthquakes').getByRole('link', { name: 'Run an earthquake shaking scenario' })).toHaveAttribute('href', '/simulate/?tab=earthquake');

  await expect(section(page, 'incidents')).toContainText('2 incidents recorded by BIPAD');
  await expect(section(page, 'incidents')).toContainText('SYNTHETIC landslide');
});

test('today switches to Nepali, including incident titles where BIPAD publishes them', async ({ page }) => {
  await serve(page);
  await page.goto('/hazards/');
  await page.getByRole('button', { name: 'नेपाली' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('आज बाढी, हिमताल र भूकम्प');
  await expect(section(page, 'incidents')).toContainText('SYNTHETIC पहिरो');
  await expect(section(page, 'incidents')).toContainText('SYNTHETIC fire');
});

test('today says when no copy exists yet, and still links to the map and scenarios', async ({ page }) => {
  await page.route('**/gov/latest.json', route => route.fulfill({ status: 404, body: 'missing' }));
  await page.goto('/hazards/');
  await expect(page.getByRole('status')).toContainText('first daily copy has not been published yet');
  await expect(section(page, 'floods').getByRole('link', { name: 'Run a flood or outburst scenario' })).toHaveAttribute('href', '/simulate/');
});

for (const width of [320, 390]) {
  test(`today at ${width}px has no sideways scroll`, async ({ page }) => {
    await serve(page);
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/hazards/');
    await expect(page.locator('[data-today-state]')).toHaveAttribute('data-today-state', 'ready');
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
  });
}
