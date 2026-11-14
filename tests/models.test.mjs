import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import * as m from '../site/models.js';

const site = p => new URL(`../site/${p.replace(/^\//, '')}`, import.meta.url);
const json = p => JSON.parse(readFileSync(site(p), 'utf8'));
const gz = p => JSON.parse(gunzipSync(readFileSync(site(p))).toString('utf8'));
const model = json('data/atlas-gmpe-bssa14/1.0.0/model.json');
const gorkha = { longitude: 84.731, latitude: 28.231, magnitude: 7.8, mechanism: 'reverse', vs30: 760 };

test('BSSA14 matches every pygmm 0.8.0 reference case', () => {
  const { cases } = JSON.parse(readFileSync(new URL('gmpe-bssa14-reference.json', import.meta.url), 'utf8'));
  assert.ok(cases.length > 1000);
  for (const c of cases) {
    const g = m.groundMotion(model, c.imt, c.magnitude, c.rjb_km, c.vs30, c.mechanism);
    assert.ok(Math.abs(g.lnMedian - Math.log(c.median)) < 1e-9, JSON.stringify(c));
    assert.ok(Math.abs(g.sigma - c.sigma) < 1e-9, JSON.stringify(c));
  }
});

test('earthquake scenarios outside the published domain are refused, not extrapolated', () => {
  assert.deepEqual(m.validateQuake(model, gorkha), []);
  assert.deepEqual(m.validateQuake(model, { ...gorkha, magnitude: 8.6 }), ['magnitude']);
  assert.deepEqual(m.validateQuake(model, { ...gorkha, mechanism: 'normal', magnitude: 7.2 }), ['magnitude']);
  assert.deepEqual(m.validateQuake(model, { ...gorkha, vs30: 100 }), ['vs30']);
  assert.deepEqual(m.validateQuake(model, { ...gorkha, longitude: 100 }), ['epicentre']);
  assert.deepEqual(m.validateQuake(model, { ...gorkha, length_km: 500, strike_deg: 290 }), ['rupture']);
  assert.equal(m.pgaAt(model, gorkha, 95, 28.231), null, 'beyond 400 km is UNKNOWN');
});

test('a line rupture is zero distance along its trace and never farther than the epicentre', () => {
  const s = { ...gorkha, length_km: 150, strike_deg: 290 };
  for (const [lon, lat] of m.ruptureLine(s)) assert.ok(m.rjb(s, lon, lat) < 0.01);
  for (const [lon, lat] of [[85.3, 27.7], [83.9, 28.2], [87, 27]]) assert.ok(m.rjb(s, lon, lat) <= m.rjb(gorkha, lon, lat) + 1e-9);
});

test('shaking bands: -1σ never puts more people in high bands than the median, and totals are conserved', () => {
  const cells = [[85.3, 27.7, 1000], [84.7, 28.2, 500], [82, 29, 200], [92, 27, 50]];
  const r = m.peopleByBand(model, gorkha, cells);
  const sum = a => a.reduce((x, y) => x + y, 0);
  for (const k of ['low', 'median', 'high']) assert.equal(sum(r[k]) + r.beyond, 1750);
  assert.equal(r.beyond, 50);
  const atLeast = (a, i) => sum(a.slice(i));
  for (let i = 1; i < m.PGA_BANDS.length; i++) assert.ok(atLeast(r.low, i) <= atLeast(r.median, i) && atLeast(r.median, i) <= atLeast(r.high, i));
});

test('population grid decodes to the published cell count and total', () => {
  const man = json('data/nepal-hrsl-population/1.0.0/manifest.json');
  const cells = m.populationCells(gz('data/nepal-hrsl-population/1.0.0/grid.json.gz'));
  assert.equal(cells.length, man.summary.browser_grid.nepal_cells);
  assert.ok(Math.abs(cells.reduce((t, c) => t + c[2], 0) - man.summary.browser_grid_total) < 0.011);
});

test('flood hydrographs conserve volume and arrivals follow the declared celerities', () => {
  const s = { shape: 'triangular', volume_m3: 1e7, duration_s: 10800, peak_fraction: 0.25, celerity_m_s: [2, 4, 6] };
  assert.deepEqual(m.validateFlood(s), []);
  for (const shape of ['triangular', 'rectangular']) assert.ok(Math.abs(m.volumeOf(m.hydrograph({ ...s, shape }).points) - 1e7) < 1e-6);
  const a = m.arrivals(s, 36);
  assert.deepEqual(a.front, [6000, 9000, 18000]);
  assert.deepEqual(a.peak, [8700, 11700, 20700]);
  assert.deepEqual(a.end, [16800, 19800, 28800]);
  assert.deepEqual(m.validateFlood({ ...s, celerity_m_s: [5, 4, 6] }), ['celerity']);
  assert.deepEqual(m.validateFlood({ ...s, volume_m3: 1 }), ['volume']);
});

test('corridor exposure keeps UNKNOWN population as null', () => {
  const row = w => ({ population_known: null, population_total: null, unknown_area_km2: w, unique_assets: w });
  assert.deepEqual(m.exposureRange({ 250: row(1), 500: row(2) }), { population: null, partial: true, assets: [1, 2] });
  const cat = gz('data/atlas-flood-corridors/1.0.0/catalogue.json.gz');
  assert.equal(cat.origins.length, 18);
  for (const o of cat.origins) for (const c of o.checkpoints) assert.ok(c.prefix_km <= o.path_length_km + 1e-6);
});

test('every published file matches its manifest checksum', () => {
  const sha = p => createHash('sha256').update(readFileSync(site(p))).digest('hex');
  let checked = 0;
  for (const id of readdirSync(site('data'))) for (const v of readdirSync(site(`data/${id}`))) {
    const path = `data/${id}/${v}/manifest.json`;
    if (!existsSync(site(path))) continue;
    const man = json(path), files = man.artifact ? [man.artifact] : Object.values(man.artifacts ?? {});
    for (const f of files) { assert.equal(sha(f.path), f.sha256, f.path); checked++; }
    if (id === 'nepal-terrain') for (const [tile, f] of Object.entries(json(`data/${id}/${v}/tiles.json`))) { assert.equal(sha(`data/${id}/${v}/${tile}`), f.sha256, tile); checked++; }
  }
  assert.ok(checked > 300);
});

test('the official copy is the expected format', () => {
  const g = json('data/gov/latest.json');
  assert.equal(g.format, 'atlas-gov-digest@1');
  assert.ok(g.sources.every(s => s.id && s.url && s.status));
});
