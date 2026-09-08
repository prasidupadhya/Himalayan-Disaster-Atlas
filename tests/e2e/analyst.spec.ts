import { expect, test } from '@playwright/test';

test('analyst answers methodology with exact source citations and refuses unsupported follow-ups', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'AI Analyst', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Ask the Atlas.' })).toBeVisible();
  await page.getByLabel('Your question').fill('Explain water change');
  await page.getByRole('button', { name: 'Ask analyst' }).click();
  await expect(page.getByRole('status')).toContainText('QUALIFIED');
  await expect(page.locator('.analyst-claim').first()).toContainText('SOURCE STATEMENT');
  const source = page.locator('.analyst-source').first();
  const href = await source.getByRole('link').getAttribute('href');
  const snapshot = await page.request.get(href!);
  expect(await snapshot.text()).toContain(await page.locator('.analyst-claim .evidence-excerpt').first().innerText());
  await source.getByText('Source, dates, version and processing').click();
  await expect(source).toContainText('UNKNOWN');
  await page.getByLabel('Your question').fill('Is it safe there tomorrow?');
  await page.getByRole('button', { name: 'Ask analyst' }).click();
  await expect(page.getByRole('status')).toContainText('UNSUPPORTED');
  await expect(page.locator('.analyst-claim')).toHaveCount(0);
});

test('analyst computes an exact downstream chain and exports provenance', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('/analyst/');
  await page.getByLabel('Your question').fill('Trace downstream from HYRIV 40669746');
  await page.getByRole('button', { name: 'Ask analyst' }).click();
  await expect(page.getByRole('status')).toContainText('517.970 km', { timeout: 30000 });
  await expect(page.getByRole('status')).toContainText('180 reaches');
  await expect(page.getByLabel('Analyst answer')).toContainText('40768704');
  await expect(page.getByLabel('Answer limitations')).toContainText('not inundation');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download answer and provenance' }).click();
  const result = await download; const stream = await result.createReadStream();
  const chunks = []; for await (const chunk of stream!) chunks.push(chunk);
  const answer = JSON.parse(Buffer.concat(chunks).toString());
  expect(answer.trace.start_reach_id).toBe('40669746'); expect(answer.trace.reach_ids).toHaveLength(180);
  expect(answer.sources.some((s: { id: string }) => s.id === 'nepal-rivers-primary@1.0.0')).toBe(true);
  await page.getByLabel('Your question').fill('Trace downstream from HYRIV 999999999999');
  await page.getByRole('button', { name: 'Ask analyst' }).click();
  await expect(page.getByRole('status')).toContainText('No similarly named or nearby reach was substituted', { timeout: 30000 });
});

test('analyst scenario stays modelled and fits mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/analyst/');
  await page.getByLabel('Your question').fill('Summarize scenario scenario-pulse-40669746');
  await page.getByRole('button', { name: 'Ask analyst' }).click();
  await expect(page.getByRole('status')).toContainText('not a forecast');
  await expect(page.locator('.analyst-claim').filter({ hasText: 'Physical flood depth' })).toContainText('UNKNOWN');
  await page.locator('.analyst-source').last().getByText('Source, dates, version and processing').click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/analyst-mobile.png' });
});

test('analyst fails closed on unavailable evidence, retries and cancels pending work', async ({ page }) => {
  await page.route('**/atlas-evidence/1.0.0/corpus.json.gz', route => route.fulfill({ status: 404 }));
  await page.goto('/analyst/');
  await page.getByRole('button', { name: 'Ask analyst' }).click();
  await expect(page.getByRole('main').getByRole('status')).toContainText('unavailable');
  await page.unroute('**/atlas-evidence/1.0.0/corpus.json.gz');
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByRole('status')).toContainText('QUALIFIED');
  let release!: () => void;
  const waiting = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/atlas-evidence/1.0.0/corpus.json.gz', async route => { await waiting; await route.abort().catch(() => {}); });
  await page.getByRole('button', { name: 'Ask analyst' }).click();
  await page.getByRole('button', { name: 'Cancel request' }).click();
  release();
  await expect(page.getByRole('status')).toHaveCount(0);
  await expect(page.locator('.analyst-claim')).toHaveCount(0);
});
