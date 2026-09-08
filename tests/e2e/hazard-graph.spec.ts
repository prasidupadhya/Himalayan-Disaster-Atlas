import { expect, test } from '@playwright/test';
test('graph exposes derived and conditional modelled links with source evidence', async ({ page }) => {
  await page.goto('/atlas/');
  const graph = page.getByRole('region', { name: 'Hazard Graph', exact: true });
  await graph.getByLabel('Load relationship graph').check();
  await expect(graph).toHaveAttribute('data-hazard-graph-state', 'ready');
  await expect(graph).toContainText('18,620 relationships');
  await expect(graph.getByRole('combobox', { name: 'Graph node' })).toHaveValue('river:40669746');
  await expect(graph).toContainText('DERIVED');
  await expect(graph).toContainText('Confidence: UNKNOWN');
  await expect(graph.getByRole('img')).toBeVisible();
  await graph.getByLabel('Find graph node').fill('scenario:exposure-trace-40669746-250m');
  await graph.getByRole('combobox', { name: 'Graph node' }).selectOption('scenario:exposure-trace-40669746-250m');
  await expect(graph.locator('[data-graph-evidence="modelled"]')).toContainText('hypothetical corridor');
  await graph.getByLabel('Load relationship graph').uncheck();
  await expect(graph.getByRole('img')).toHaveCount(0);
});
test('corrupt graphs fail closed and retry', async ({ page }) => {
  await page.route('**/nepal-hazard-graph/1.0.0/graph.json.gz', r => r.fulfill({ body: 'corrupt' }));
  await page.goto('/atlas/');
  const graph = page.getByRole('region', { name: 'Hazard Graph', exact: true });
  await graph.getByLabel('Load relationship graph').check();
  await expect(graph).toHaveAttribute('data-hazard-graph-state', 'error');
  await expect(graph.getByRole('img')).toHaveCount(0);
  await page.unroute('**/nepal-hazard-graph/1.0.0/graph.json.gz');
  await graph.getByRole('button', { name: 'Try again' }).click();
  await expect(graph).toHaveAttribute('data-hazard-graph-state', 'ready');
});
