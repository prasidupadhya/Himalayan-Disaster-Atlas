import { expect, test } from '@playwright/test';

test('satellite exposes dated verified observation windows without change claims', async ({ page, baseURL }) => {
  const external: string[] = []; page.on('request', request => { if (new URL(request.url()).origin !== new URL(baseURL!).origin && !request.url().startsWith('blob:')) external.push(request.url()); });
  await page.goto('/atlas/'); await page.getByRole('button', { name: 'Load additional map datasets' }).click(); const section = page.getByRole('region', { name: 'Satellite', exact: true });
  await expect(section).toHaveAttribute('data-satellite-state', 'ready'); await expect(section).toContainText('Sentinel-2 L2A'); await expect(section).toContainText('Observation only');
  await section.getByLabel('Show true-colour preview').check(); await section.getByLabel('Observation window').selectOption('east');
  await expect(section).toContainText('S2C_T45RVM_20260411T045901_L2A'); await expect(section).toContainText('SCL cloud'); expect(external).toEqual([]);
});
