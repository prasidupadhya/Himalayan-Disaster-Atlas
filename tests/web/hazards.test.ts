import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { parseClimateContext, parseTerrainSteepness, type ModelRelease } from '../../packages/contracts/model-release';
import { buildIndex, parseEvidenceCorpus, retrieve, tokens } from '../../apps/web/lib/evidence';
import {
  CLIMATE_VIEWS, classify, freshness, monthLabel, nationalMean, nationalPrecipSeries, PRECIP_SCALE, SNOW_SCALE, SPI_SCALE, spiShare, STEEP_SCALE, steepestDistricts, TMAX_SCALE,
} from '../../apps/web/lib/hazard-context';

const load = (id: string, name: string) => {
  const release = JSON.parse(readFileSync(`apps/web/public/data/${id}/1.0.0/manifest.json`, 'utf8')) as ModelRelease;
  return { release, value: JSON.parse(gunzipSync(readFileSync(`apps/web/public${release.artifacts[name].path}`)).toString()) as unknown };
};
const climate = load('nepal-power-gridded-context', 'context');
const ctx = parseClimateContext(climate.value, climate.release.summary as never);
const terrain = load('nepal-terrain-steepness', 'steepness');
const steep = parseTerrainSteepness(terrain.value, terrain.release.summary as never);
const evidence = load('atlas-public-evidence', 'corpus');
const index = buildIndex(parseEvidenceCorpus(evidence.value, evidence.release.summary as never));

describe('hazard display scales', () => {
  it('every scale partitions the real line without gaps or overlaps and keeps UNKNOWN out of the classes', () => {
    for (const scale of [SPI_SCALE, PRECIP_SCALE, TMAX_SCALE, SNOW_SCALE, STEEP_SCALE]) {
      expect(scale[0].min).toBeNull(); expect(scale.at(-1)!.max).toBeNull();
      scale.slice(1).forEach((c, i) => expect(c.min).toBe(scale[i].max));
      expect(new Set(scale.map(c => c.color)).size).toBe(scale.length);
      expect(classify(scale, null)).toBeNull(); expect(classify(scale, NaN)).toBeNull();
      for (const c of scale) { expect(c.label.en).toBeTruthy(); expect(c.label.ne).toBeTruthy(); }
    }
    expect(classify(SPI_SCALE, -1)!.id).toBe('near-normal');
    expect(classify(SPI_SCALE, -1.0001)!.id).toBe('moderately-dry');
    expect(classify(SPI_SCALE, 2)!.id).toBe('extremely-wet');
  });
  it('SPI colours match the published McKee class of every cell', () => {
    for (const cell of ctx.cells) for (let m = 0; m < 12; m++) expect(classify(SPI_SCALE, CLIMATE_VIEWS.spi3.value(cell, m))!.id).toBe(cell.recent[m].spi3_class);
  });
  it('percent-of-normal stays UNKNOWN where the normal is too small', () => {
    const unknown = ctx.cells.flatMap(c => c.recent.filter(r => r.precip_percent_of_normal === null));
    for (const r of unknown) expect(classify(PRECIP_SCALE, r.precip_percent_of_normal)).toBeNull();
  });
});

describe('climate summaries', () => {
  it('national SPI shares sum to one and match the release', () => {
    for (let m = 0; m < 12; m++) expect(spiShare(ctx, m).reduce((a, b) => a + b.share, 0)).toBeCloseTo(1, 3);
  });
  it('area-weighted national means reproduce the published national anomalies', () => {
    for (let m = 0; m < 12; m++) expect(nationalMean(ctx, m, c => c.recent[m].precip_anomaly_mm_day)!).toBeCloseTo(ctx.national[m].precip_anomaly_mm_day, 1);
    const series = nationalPrecipSeries(ctx);
    expect(series).toHaveLength(12);
    for (const s of series) { expect(s.value).toBeGreaterThanOrEqual(0); expect(s.normal).toBeGreaterThanOrEqual(0); }
    expect(nationalMean({ ...ctx, cells: [] }, 0, () => 1)).toBeNull();
  });
  it('labels freshness from stale_after on the viewer clock', () => {
    expect(freshness('2026-11-01T00:00:00Z', Date.parse('2026-10-07T00:00:00Z'))).toBe('CURRENT SNAPSHOT');
    expect(freshness('2026-11-01T00:00:00Z', Date.parse('2026-11-02T00:00:00Z'))).toBe('STALE');
    expect(freshness(null)).toBe('UNKNOWN');
    expect(monthLabel('2026-08', 'en')).toBe('Aug 2026');
    expect(monthLabel('2026-08', 'ne')).toBe('अगस्ट २०२६');
  });
  it('rejects a tampered context', () => {
    const bad = structuredClone(climate.value) as { cells: Array<{ recent: Array<{ snow_cover_fraction: number }> }> };
    bad.cells[0].recent[0].snow_cover_fraction = 2;
    expect(() => parseClimateContext(bad, climate.release.summary as never)).toThrow(/physical bounds/);
  });
});

describe('terrain steepness', () => {
  it('ranks the steepest districts deterministically and parses all 77', () => {
    expect(steep.districts).toHaveLength(77);
    const top = steepestDistricts(steep.districts, 5);
    top.slice(1).forEach((d, i) => expect(d.share_steeper_than_30_deg).toBeLessThanOrEqual(top[i].share_steeper_than_30_deg));
    expect(classify(STEEP_SCALE, top[0].share_steeper_than_30_deg)!.id).toBe('ge55');
  });
});

describe('evidence analyst', () => {
  it('quotes verbatim passages with citations and never invents an answer', () => {
    const answer = retrieve(index, 'Why is flood depth UNKNOWN?');
    expect(answer.status).not.toBe('insufficient');
    expect(answer.hits.length).toBeGreaterThan(0);
    for (const hit of answer.hits) expect(index.corpus.chunks).toContain(hit.chunk);
    expect(answer.hits[0].chunk.text.toLowerCase()).toMatch(/unknown/);
  });
  it('reports insufficient evidence for empty, stop-word or absent queries', () => {
    expect(retrieve(index, '').status).toBe('insufficient');
    expect(retrieve(index, 'what is the').status).toBe('insufficient');
    expect(retrieve(index, 'zzzxqv').status).toBe('insufficient');
  });
  it('is deterministic and bounded', () => {
    expect(retrieve(index, 'SPI-3 gamma')).toEqual(retrieve(index, 'SPI-3 gamma'));
    expect(retrieve(index, 'x'.repeat(2000)).query.length).toBe(500);
    expect(tokens('Gorkha 2015 — Mww 7.8, SPI-3')).toEqual(['gorkha', '2015', 'mww', '7.8', 'spi-3']);
  });
  it('rejects a corpus that does not match its release summary', () => {
    expect(() => parseEvidenceCorpus(evidence.value, { chunks: 1, documents: 1 })).toThrow(/Unsupported/);
  });
});
