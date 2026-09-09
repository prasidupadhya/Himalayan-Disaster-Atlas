import { createHash } from 'node:crypto';
import { expect, test } from '@playwright/test';
import country from '../../apps/web/public/data/nepal-admin-country/2.0.1/manifest.json';

test('Cloudflare routes, cache policy and compressed data preserve integrity', async ({ request }) => {
  const redirect = await request.get('/atlas', { maxRedirects: 0 });
  expect(redirect.status()).toBe(307);
  expect(redirect.headers().location).toMatch(/\/atlas\/$/);
  const missing = await request.get('/no-such-atlas-route/');
  expect(missing.status()).toBe(404);
  expect(await missing.text()).not.toContain('Interactive Nepal administrative boundary map');
  const data = await request.get(country.artifact.path);
  expect(data.ok()).toBeTruthy();
  expect(data.headers()['content-type']).toContain('application/gzip');
  expect(data.headers()['cache-control']).toContain('immutable');
  expect(data.headers()['content-encoding']).not.toBe('gzip');
  expect(createHash('sha256').update(await data.body()).digest('hex')).toBe(country.artifact.sha256);
  const page = await request.get('/atlas/');
  expect(page.headers()['x-content-type-options']).toBe('nosniff');
  expect(page.headers()['content-security-policy']).toContain("connect-src 'self'");
  expect(page.headers()['content-security-policy']).not.toContain("'unsafe-eval'");
  expect(page.headers()['cache-control'] ?? '').not.toContain('immutable');
});

test('licence notices are accessible without third-party runtime requests', async ({ page }) => {
  const remote: string[] = [];
  page.on('request', request => { if (new URL(request.url()).hostname !== '127.0.0.1') remote.push(request.url()); });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/licenses/');
  await expect(page.getByRole('main')).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  await expect(page.getByRole('heading', { level: 1, name: 'Rights stay with each source.' })).toBeVisible();
  await expect(page.getByText('REVIEW REQUIRED', { exact: true }).first()).toBeVisible();
  const license = await page.request.get('/legal/LICENSE.txt');
  expect(await license.text()).toContain('MIT License');
  const notices = await page.request.get('/legal/THIRD_PARTY_NOTICES.txt');
  expect(await notices.text()).toContain('maplibre');
  await page.getByRole('link', { name: 'Source directory', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Trace every production layer');
  expect(remote).toEqual([]);
});
