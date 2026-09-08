import { expect, test } from '@playwright/test';

test('simulation UI validates parameters, runs modelled scenarios and compares compatible runs', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/atlas/');
  const section = page.getByRole('region', { name: 'Simulation UI', exact: true });
  await expect(section).toContainText('MODELLED SCENARIO — NOT AN OFFICIAL FORECAST');
  await section.getByLabel('Open simulation workbench').check();
  await expect(section).toHaveAttribute('data-simulation-state', 'ready');
  await expect(section).toContainText('Level 1');
  await expect(section).toContainText('network-path@1.0.0');
  await expect(section).toContainText('source-topology@1.0.0');

  await section.getByLabel(/Level 2 — constant-celerity pulse/).check();
  const celerity = section.getByLabel('Assumed signal celerity (m/s)');
  const volume = section.getByLabel('Hypothetical release volume (m3)');
  const duration = section.getByLabel('Release duration (s)');
  await expect(celerity).toHaveAttribute('min', '0.1');
  await expect(celerity).toHaveAttribute('max', '10');
  await expect(volume).toHaveAttribute('max', '10000000');
  await expect(duration).toHaveAttribute('min', '60');
  await expect(section).toContainText('fixed-celerity@1.0.0');

  await celerity.fill('0');
  await expect(celerity).toHaveAttribute('aria-invalid', 'true');
  await expect(section.getByRole('button', { name: 'Run Level 2 simulation' })).toBeDisabled();
  await expect(section).toContainText('must be between 0.1 and 10 m/s');

  await celerity.fill('2');
  await section.getByRole('button', { name: 'Run Level 2 simulation' }).click();
  await expect(section).toContainText('Default Level 2 parameters reproduce the published Feature 28 reference result.');
  await expect(section).toContainText('27.778 m³/s');
  await expect(section).toContainText('258,985 s relative to hypothetical release');
  await expect(section).toContainText('UNAVAILABLE — no validated Polygon/MultiPolygon simulation footprint');
  await expect(section).toContainText('SOURCE-DERIVED:');
  await expect(section).toContainText('MODELLED:');
  await section.getByRole('button', { name: 'Set current run as comparison A' }).click();

  await celerity.fill('4');
  await volume.fill('300000');
  await duration.fill('7200');
  await section.getByRole('button', { name: 'Run Level 2 simulation' }).click();
  await expect(section).toContainText('41.667 m³/s');
  await expect(section).toContainText('129,492.5 s relative to hypothetical release');
  const comparison = section.getByRole('table', { name: /Comparison A versus current run B/ });
  await expect(comparison).toContainText('2 m/s');
  await expect(comparison).toContainText('4 m/s');
  await expect(comparison).toContainText('no better/worse ranking');

  await section.getByLabel('Show modelled pathway on map').check();
  await section.getByRole('button', { name: 'Use 3D perspective' }).click();
  await expect(section.getByRole('button', { name: 'Return to 2D view' })).toHaveAttribute('aria-pressed', 'true');
  await expect(section).toContainText('2D and 3D perspective use the exact same simulation output');
  expect(errors).toEqual([]);
});

test('simulation UI fails closed when the verified scenario basis is corrupt and supports retry', async ({ page }) => {
  await page.route('**/scenario-network-40669746/1.0.0/result.json.gz', route => route.fulfill({ body: 'corrupt' }));
  await page.goto('/atlas/');
  const section = page.getByRole('region', { name: 'Simulation UI', exact: true });
  await section.getByLabel('Open simulation workbench').check();
  await expect(section).toHaveAttribute('data-simulation-state', 'error');
  await expect(section.getByRole('button', { name: /Run Level/ })).toHaveCount(0);
  await page.unroute('**/scenario-network-40669746/1.0.0/result.json.gz');
  await section.getByRole('button', { name: 'Try again' }).click();
  await expect(section).toHaveAttribute('data-simulation-state', 'ready');
});
