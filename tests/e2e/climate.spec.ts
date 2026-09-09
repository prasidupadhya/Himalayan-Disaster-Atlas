import { expect, test } from '@playwright/test';

test('climate keeps reanalysis type, units and monthly precision visible', async ({ page }) => {
  const external: string[] = [];
  page.on('request', request => { if (!request.url().startsWith('http://127.0.0.1:4173') && !request.url().startsWith('blob:')) external.push(request.url()); });
  await page.goto('/atlas/'); await page.getByRole('button', { name: 'Load additional map datasets' }).click();
  const section = page.getByRole('region', { name: 'Climate', exact: true });
  await expect(section).toHaveAttribute('data-climate-state', 'ready');
  await expect(section).toContainText('MERRA-2 reanalysis-derived');
  await expect(section).toContainText('not station observations');
  await expect(section).toContainText('1991–2020 normal');
  await section.getByLabel('Period').selectOption('2005');
  await section.getByLabel('Variable').selectOption('precipitation');
  await section.getByLabel('Focus month').selectOption('8');
  await expect(section).toContainText('2005-08');
  await expect(section).toContainText('mm/day');
  await expect(section.getByRole('img', { name: /monthly precipitation chart/i })).toBeVisible();
  expect(external).toEqual([]);
});
