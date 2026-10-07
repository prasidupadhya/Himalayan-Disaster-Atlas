import { afterEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { parseCorridorCatalogue, parseModelRelease, parsePopulationGrid, cellCentre, type ModelRelease } from '../../packages/contracts/model-release';
import { bandOf, computeShaking, greatCircleKm, groundMotion, joynerBoore, PGA_BANDS, ruptureLine, validateScenario, type GmpeModel, type QuakeScenario } from '../../apps/web/lib/earthquake';
import { arrivals, decodeScenario, defaultFlood, encodeScenario, exposureRange, FLOOD_LIMITS, hydrograph, hydrographVolume, shortDuration, validateFlood, type FloodScenario } from '../../apps/web/lib/flood-scenario';
import { formatNumber } from '../../apps/web/lib/i18n';
import { loadModelArtifact, loadModelRelease, MODEL_RELEASES } from '../../apps/web/lib/model-release';

afterEach(() => vi.unstubAllGlobals());
const PUBLIC = 'apps/web/public';
const read = (path: string) => readFileSync(`${PUBLIC}${path}`);
const manifest = (key: keyof typeof MODEL_RELEASES) => JSON.parse(read(`/data/${MODEL_RELEASES[key].id}/${MODEL_RELEASES[key].version}/manifest.json`).toString()) as ModelRelease;
const artifact = <T>(release: ModelRelease, name: string): T => {
  const raw = read(release.artifacts[name].path);
  return JSON.parse((release.artifacts[name].media_type === 'application/json+gzip' ? gunzipSync(raw) : raw).toString()) as T;
};
const gmpeRelease = manifest('gmpe');
const model = artifact<GmpeModel>(gmpeRelease, 'model');
const populationRelease = manifest('population');
const population = parsePopulationGrid(artifact(populationRelease, 'grid'), populationRelease.summary as never);
const corridorRelease = manifest('corridors');
const catalogue = parseCorridorCatalogue(artifact(corridorRelease, 'catalogue'), Number(corridorRelease.summary.origins));
const gorkha: QuakeScenario = { kind: 'earthquake', version: 1, preset: 'us20002926', longitude: 84.7314, latitude: 28.2305, magnitude: 7.8, mechanism: 'unspecified', rupture: { type: 'point' }, vs30: 760 };

describe('model release contracts', () => {
  it('parses every published release and rejects identity or path drift', () => {
    for (const key of Object.keys(MODEL_RELEASES) as Array<keyof typeof MODEL_RELEASES>) expect(parseModelRelease(manifest(key), MODEL_RELEASES[key]).kind).toBe('model-release');
    expect(() => parseModelRelease(gmpeRelease, MODEL_RELEASES.population)).toThrow(/identity/);
    const moved = structuredClone(gmpeRelease); moved.artifacts.model.path = '/data/other/1.0.0/model.json';
    expect(() => parseModelRelease(moved)).toThrow(/outside release/);
    expect(() => parseModelRelease({ ...gmpeRelease, kind: 'dataset' })).toThrow(/Invalid model release/);
  });
  it('keeps cells outside Nepal absent (UNKNOWN), not zero, and preserves the published total', () => {
    expect(population.count).toBe((populationRelease.summary as { browser_grid: { nepal_cells: number } }).browser_grid.nepal_cells);
    expect(Math.abs(population.total - Number(populationRelease.summary.browser_grid_total))).toBeLessThan(0.011);
    expect([...population.index.values()].every(v => v >= 0)).toBe(true);
    const [lon, lat] = cellCentre(population.grid, population.index.keys().next().value!);
    expect(lon).toBeGreaterThan(79.9); expect(lat).toBeLessThan(30.5);
  });
  it('rejects a tampered population grid or corridor catalogue', () => {
    const grid = structuredClone(artifact<{ cells: Array<[number, Array<[number, number[]]>]> }>(populationRelease, 'grid'));
    grid.cells[0][1][0][1][0] += 100;
    expect(() => parsePopulationGrid(grid, populationRelease.summary as never)).toThrow(/total/);
    grid.cells[0][1][0][1][0] = -1;
    expect(() => parsePopulationGrid(grid, populationRelease.summary as never)).toThrow(/nonnegative/);
    const bad = structuredClone(catalogue);
    const row = bad.origins.flatMap(o => o.checkpoints).flatMap(c => Object.values(c.by_width)).find(e => e.unknown_area_km2 > 0)!;
    row.population_total = 1;
    expect(() => parseCorridorCatalogue(bad, bad.origins.length)).toThrow(/unknown area/);
    expect(() => parseCorridorCatalogue(catalogue, catalogue.origins.length + 1)).toThrow(/Unsupported/);
  });
  it('loads artifacts only after their size and SHA-256 match', async () => {
    vi.stubGlobal('fetch', vi.fn(async (path: string) => new Response(read(path))));
    const release = await loadModelRelease(MODEL_RELEASES.gmpe);
    expect((await loadModelArtifact<GmpeModel>(release, 'model')).doi).toBe(model.doi);
    const tampered = new Uint8Array(read(release.artifacts.model.path)); tampered[10] ^= 1;
    vi.stubGlobal('fetch', vi.fn(async () => new Response(tampered)));
    await expect(loadModelArtifact(release, 'model')).rejects.toThrow(/Checksum mismatch/);
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 503 })));
    await expect(loadModelRelease(MODEL_RELEASES.gmpe)).rejects.toThrow();
  });
});

describe('BSSA14 browser implementation', () => {
  it('matches every independent reference case (pygmm 0.8.0) used by the Python verifier', () => {
    const reference = JSON.parse(readFileSync('tests/fixtures/gmpe-bssa14-reference.json', 'utf8')) as { cases: Array<{ imt: 'pga' | 'pgv'; magnitude: number; rjb_km: number; vs30: number; mechanism: QuakeScenario['mechanism']; median: number; sigma: number }> };
    expect(reference.cases.length).toBeGreaterThan(1000);
    for (const c of reference.cases) {
      const g = groundMotion(model, c.imt, c.magnitude, c.rjb_km, c.vs30, c.mechanism);
      expect(Math.abs(g.lnMedian - Math.log(c.median))).toBeLessThan(1e-9);
      expect(Math.abs(g.sigma - c.sigma)).toBeLessThan(1e-9);
    }
  });
  it('refuses scenarios outside the published domain instead of extrapolating', () => {
    expect(validateScenario(model, gorkha)).toEqual([]);
    expect(validateScenario(model, { ...gorkha, magnitude: 8.6 }).join()).toMatch(/Magnitude/);
    expect(validateScenario(model, { ...gorkha, mechanism: 'normal', magnitude: 7.2 }).join()).toMatch(/Magnitude/);
    expect(validateScenario(model, { ...gorkha, vs30: 100 }).join()).toMatch(/V_S30/);
    expect(validateScenario(model, { ...gorkha, longitude: 100 }).join()).toMatch(/Epicentre/);
    expect(validateScenario(model, { ...gorkha, rupture: { type: 'line', length_km: 0, strike_deg: 10 } }).join()).toMatch(/Line rupture/);
    expect(() => computeShaking(model, { ...gorkha, magnitude: 9 }, population, [])).toThrow();
  });
  it('measures Joyner-Boore distance to a declared line, not just the epicentre', () => {
    const line: QuakeScenario = { ...gorkha, rupture: { type: 'line', length_km: 100, strike_deg: 90 } };
    const [west, east] = ruptureLine(line);
    expect(joynerBoore(line, ...east)).toBeLessThan(1e-6);
    expect(joynerBoore(line, ...west)).toBeLessThan(1e-6);
    expect(joynerBoore(gorkha, ...east)).toBeCloseTo(50, 0);
  });
  it('conserves population across bands and keeps beyond-domain people unbanded', () => {
    const result = computeShaking(model, gorkha, population, [{ id: 'a', category: 'school', name: null, coordinates: [85.32, 27.7] }], [{ label: 'Far', longitude: 89.9, latitude: 26.5 }, { label: 'Near', longitude: 84.75, latitude: 28.25 }]);
    for (const series of [result.population.low, result.population.central, result.population.high]) {
      expect(series.reduce((a, b) => a + b, 0) + result.population.beyond).toBeCloseTo(population.total, 3);
    }
    expect(result.cellKeys.length).toBe(population.count);
    expect(result.assets.school.central.reduce((a, b) => a + b, 0)).toBe(1);
    const far = result.sites.find(s => s.label === 'Far')!;
    expect(far.rjb).toBeGreaterThan(400); expect(far.median).toBeNull();
    expect(result.sites.find(s => s.label === 'Near')!.median!).toBeGreaterThan(0.2);
    // The +1σ field never moves people into weaker bands than the median.
    const cumulative = (xs: number[]) => xs.map((_, i) => xs.slice(i).reduce((a, b) => a + b, 0));
    cumulative(result.population.high).forEach((v, i) => expect(v + 1e-6).toBeGreaterThanOrEqual(cumulative(result.population.central)[i]));
  });
  it('bands are ordered, contiguous and unique in colour', () => {
    PGA_BANDS.forEach((b, i) => { if (i) expect(b.min).toBe(PGA_BANDS[i - 1].max); });
    expect(new Set(PGA_BANDS.map(b => b.color)).size).toBe(PGA_BANDS.length);
    expect(bandOf(0)).toBe(0); expect(bandOf(5)).toBe(PGA_BANDS.length - 1);
  });
});

describe('flood corridor scenario', () => {
  const base: FloodScenario = defaultFlood(catalogue.origins[0]);
  it('conserves the declared volume exactly for both hydrograph shapes', () => {
    for (const shape of ['triangular', 'rectangular'] as const) for (const volume of [1e3, 1e7, 5e8]) for (const fraction of [0.05, 0.5, 0.95]) {
      const h = hydrograph({ ...base, shape, volume_m3: volume, peak_fraction: fraction });
      expect(Math.abs(hydrographVolume(h.points) - volume) / volume).toBeLessThan(1e-12);
    }
    expect(hydrograph(base).peak_m3_s).toBeCloseTo(2 * 1e7 / 10800, 9);
  });
  it('orders arrivals by the declared celerity ensemble', () => {
    const a = arrivals(base, 100);
    expect(a.front_s).toEqual([100000 / 6, 25000, 50000]);
    expect(a.end_s[1] - a.front_s[1]).toBe(base.duration_s);
    expect(a.peak_s[1] - a.front_s[1]).toBeCloseTo(base.peak_fraction * base.duration_s, 9);
  });
  it('validates every declared bound and unknown origins', () => {
    expect(validateFlood(base, catalogue)).toEqual([]);
    expect(validateFlood({ ...base, volume_m3: FLOOD_LIMITS.volume_m3[1] * 2 }).join()).toMatch(/volume/);
    expect(validateFlood({ ...base, duration_s: 60 }).join()).toMatch(/duration/);
    expect(validateFlood({ ...base, peak_fraction: 1 }).join()).toMatch(/peak/);
    expect(validateFlood({ ...base, celerity_m_s: [5, 4, 6] }).join()).toMatch(/ordered/);
    expect(validateFlood({ ...base, celerity_m_s: [NaN, 4, 6] }).join()).toMatch(/celerity/);
    expect(validateFlood({ ...base, origin: 'invented' }, catalogue).join()).toMatch(/not in the verified/);
  });
  it('reports exposure as a width-sensitivity range and never totals unknown area', () => {
    for (const origin of catalogue.origins) for (const row of origin.checkpoints) {
      const r = exposureRange(row.by_width, catalogue.widths_m);
      expect(r.assets.min).toBeLessThanOrEqual(r.assets.central); expect(r.assets.central).toBeLessThanOrEqual(r.assets.max);
      if (r.population.min !== null) expect(r.population.min).toBeLessThanOrEqual(r.population.max!);
      expect(r.population.partial).toBe(Object.values(row.by_width).some(e => e.population_total === null));
    }
  });
  it('round-trips share links and rejects malformed or oversized ones', () => {
    for (const s of [base, gorkha, { ...gorkha, rupture: { type: 'line' as const, length_km: 120, strike_deg: 290 } }]) expect(decodeScenario(encodeScenario(s))).toEqual(s);
    expect(decodeScenario('not-base64!')).toBeNull();
    expect(decodeScenario(encodeScenario({ ...base, version: 2 } as never))).toBeNull();
    expect(decodeScenario(encodeScenario({ ...base, volume_m3: 'x' } as never))).toBeNull();
    expect(decodeScenario('a'.repeat(2049))).toBeNull();
    const extra = decodeScenario(encodeScenario({ ...base, injected: '<script>' } as never));
    expect(extra && 'injected' in extra).toBe(false);
  });
  it('refuses prototype-chain mechanisms and unoffered site classes instead of zeroing every band', () => {
    for (const mechanism of ['constructor', 'toString', '__proto__', 'hasOwnProperty']) {
      expect(decodeScenario(encodeScenario({ ...gorkha, mechanism } as never))).toBeNull();
      expect(validateScenario(model, { ...gorkha, mechanism } as never)).toContain('Unknown mechanism.');
    }
    expect(decodeScenario(encodeScenario({ ...gorkha, vs30: 500 }))).toBeNull();
    for (const mechanism of ['unspecified', 'strike-slip', 'normal', 'reverse'] as const) {
      const r = computeShaking(model, { ...gorkha, magnitude: 7, mechanism }, population, []);
      expect(r.population.central.reduce((a, b) => a + b, 0) + r.population.beyond).toBeCloseTo(r.population.total, 6);
    }
  });
  it('rejects an out-of-range peak fraction for either hydrograph shape', () => {
    expect(validateFlood({ ...base, shape: 'rectangular', peak_fraction: 1e9 })).toContain('Time to peak must be 5–95% of the duration.');
  });
  it('judges the 400 km domain on great-circle distance', () => {
    const point = { longitude: 80, latitude: 29, rupture: { type: 'point' as const } };
    expect(Math.abs(joynerBoore(point, 83.85, 27.35) - greatCircleKm(80, 29, 83.85, 27.35))).toBeLessThan(1e-9);
    expect(greatCircleKm(80, 29, 83.85, 27.35)).toBeGreaterThan(419);
  });
  it('never renders a small positive value as zero', () => {
    expect(formatNumber(0.000457, 'en', 2)).toBe('<0.01');
    expect(formatNumber(0.0058, 'en', 1)).toBe('<0.1');
    expect(formatNumber(0, 'en', 1)).toBe('0.0');
    expect(formatNumber(0.06, 'en', 1)).toBe('0.1');
  });
  it('formats compact durations without inventing precision', () => {
    expect(shortDuration(24 * 60)).toBe('24m');
    expect(shortDuration(69 * 60)).toBe('1h09');
    expect(shortDuration(51 * 3600)).toBe('2d 03h');
    expect(shortDuration(NaN)).toBe('UNKNOWN');
  });
});
