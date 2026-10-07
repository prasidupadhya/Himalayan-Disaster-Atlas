import { afterEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import * as runtime from '../../packages/contracts/generated/live-runtime.cjs';
import { parseLiveIndex, parseLiveSnapshot } from '../../packages/contracts/live';
import { loadLivePublication, type LivePublication } from '../../apps/web/lib/live';
import { buildBulletin, copy, earthquakeRows, feedView, forecastSummary, formatTime, formatValue, gridCellPolygon, LIVE_CONDITIONS_POLICY as policy, localDigits, nextDeadline, type Lang } from '../../apps/web/lib/live-conditions';
import { conditionsFixture, GFS_PATH, NORMAL_NOW, STALE_NOW, type FeedCase } from '../helpers/live-conditions';

afterEach(() => vi.unstubAllGlobals());
const IMMEDIACY = /real[\s-]?time|वास्तविक\s*समय|तत्काल|live\s+feed/i;

async function publication(usgs: FeedCase = 'normal', gfs: FeedCase = 'normal', corrupt = false): Promise<LivePublication> {
  const f = conditionsFixture(usgs, gfs);
  vi.stubGlobal('fetch', vi.fn(async (path: string) => new Response(path === '/live/latest.json' ? JSON.stringify(f.index) : path === GFS_PATH ? (corrupt ? '{}' : f.gfsRaw) : f.usgsRaw)));
  return loadLivePublication();
}
const views = (data: LivePublication, now = NORMAL_NOW) => data.deliveries.map(delivery => feedView(data, delivery, Date.parse(now)));
const text = (bulletin: ReturnType<typeof buildBulletin>) => [bulletin.title, bulletin.notice, bulletin.authorities, bulletin.publication, ...bulletin.sections.flatMap(section => [section.heading, section.status, ...section.sentences])].join('\n');

describe('live conditions fixture', () => {
  it('is accepted identically by TypeScript, the Node runtime and Python', () => {
    const f = conditionsFixture();
    expect(parseLiveIndex(f.index)).toEqual(runtime.parseLiveIndex(f.index));
    expect(parseLiveSnapshot(f.gfs)).toEqual(runtime.parseLiveSnapshot(f.gfs));
    const r = spawnSync('.venv/bin/python', ['-c', 'import json,sys\nfrom pipelines.atlas_pipeline.live_contracts import parse_live_index,parse_live_snapshot\nd=json.load(sys.stdin)\nparse_live_index(d["index"])\nparse_live_snapshot(d["gfs"])\nparse_live_snapshot(d["usgs"])'], { input: JSON.stringify(f), encoding: 'utf8' });
    expect(r.status, r.stderr).toBe(0);
  }, 60_000);
});

describe('static /live/ route beside the live data index', () => {
  it('exempts only the route page files from the live publication inventory', async () => {
    const { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, rmSync } = await import('node:fs');
    const { tmpdir } = await import('node:os');
    const { isLivePagePath, verifyLiveExport } = await import('../../scripts/live-publication.mjs');
    for (const name of ['live/index.html', 'live/index.txt', 'live/__next._tree.txt', 'live/__next.live.__PAGE__.txt']) expect(isLivePagePath(name)).toBe(true);
    for (const name of ['live/latest.json', 'live/history/1.0.0/index.json', 'live/index.json', 'live/other.html', 'live/x/index.html']) expect(isLivePagePath(name)).toBe(false);
    const directory = mkdtempSync(`${tmpdir()}/atlas-live-route-`);
    try {
      mkdirSync(`${directory}/live`);
      copyFileSync('apps/web/public/live/latest.json', `${directory}/live/latest.json`);
      for (const name of ['index.html', 'index.txt', '__next._full.txt']) writeFileSync(`${directory}/live/${name}`, 'page');
      expect(verifyLiveExport(directory).workflow.status).toBe('not_configured');
      writeFileSync(`${directory}/live/unexpected.json`, '{}');
      expect(() => verifyLiveExport(directory)).toThrow('Unregistered');
    } finally { rmSync(directory, { recursive: true, force: true }); }
  });
});

describe('freshness states and non-colour labels', () => {
  it('keeps purpose and freshness labels textually distinct with their own glyphs', () => {
    const purposes = Object.values(policy.purposes), freshness = Object.values(policy.freshness);
    for (const group of [purposes, freshness]) for (const lang of ['en', 'ne'] as const) {
      expect(new Set(group.map(item => item[lang])).size).toBe(group.length);
    }
    expect(new Set(purposes.map(item => item.glyph)).size).toBe(purposes.length);
    expect(new Set(freshness.map(item => item.glyph)).size).toBe(freshness.length);
  });
  for (const [usgs, expected, state] of [['normal', 'FRESH', 'ready'], ['empty', 'FRESH', 'empty'], ['failed', 'STALE', 'stale'], ['unavailable', 'UNAVAILABLE', 'unavailable']] as const) {
    it(`maps ${usgs} USGS delivery to ${expected}`, async () => {
      const [view] = views(await publication(usgs));
      expect(view.freshness).toBe(expected); expect(view.state).toBe(state);
    });
  }
  it('expires both feeds at their deadlines without a new fetch', async () => {
    const data = await publication();
    expect(views(data).map(view => view.freshness)).toEqual(['FRESH', 'FRESH']);
    expect(views(data, STALE_NOW).map(view => view.freshness)).toEqual(['STALE', 'STALE']);
    expect(nextDeadline(data, views(data), Date.parse(NORMAL_NOW))).toBe('2026-10-06T18:00:00.000Z');
    expect(nextDeadline(data, views(data, STALE_NOW), Date.parse(STALE_NOW))).toBeNull();
  });
  it('withholds corrupted forecast content as UNAVAILABLE while the earthquake feed stays usable', async () => {
    const [usgs, gfs] = views(await publication('normal', 'normal', true));
    expect(gfs).toMatchObject({ freshness: 'UNAVAILABLE', state: 'error', snapshot: null });
    expect(gfs.reason).toContain('checksum');
    expect(usgs.freshness).toBe('FRESH');
  });
});

describe('bilingual bulletin', () => {
  it('uses identical copy keys and placeholders in English and Nepali', () => {
    const en = policy.copy.en, ne = policy.copy.ne;
    expect(Object.keys(ne).sort()).toEqual(Object.keys(en).sort());
    for (const key of Object.keys(en) as Array<keyof typeof en>) expect((ne[key].match(/\{\w+\}/g) ?? []).sort()).toEqual((en[key].match(/\{\w+\}/g) ?? []).sort());
    for (const group of [policy.purposes, policy.freshness, policy.health]) for (const item of Object.values(group)) expect(item.ne).toMatch(/[ऀ-ॿ]/);
  });
  for (const lang of ['en', 'ne'] as Lang[]) it(`never claims immediacy and keeps warnings, impacts and air quality explicit (${lang})`, async () => {
    const data = await publication();
    const bulletin = buildBulletin(data, views(data), lang);
    const all = text(bulletin);
    expect(all).not.toMatch(IMMEDIACY);
    expect(JSON.stringify(policy)).not.toMatch(/real[\s-]?time/i);
    expect(bulletin.sections.map(section => section.id)).toEqual(['earthquakes', 'forecast', 'air-quality', 'warnings', 'impacts']);
    expect(bulletin.sections.find(section => section.id === 'warnings')!.sentences.join(' ')).toContain(lang === 'en' ? 'does not mean there are no warnings' : 'चेतावनी छैन भन्ने होइन');
    expect(bulletin.sections.find(section => section.id === 'impacts')!.sentences.join(' ')).toContain('UNKNOWN');
    expect(bulletin.sections.find(section => section.id === 'air-quality')!.sentences.join(' ')).toContain('AQI');
    if (lang === 'en') expect(bulletin.title).toBe('Periodically updated conditions');
    else { expect(all).toMatch(/आवधिक रूपमा अद्यावधिक/); expect(all).not.toMatch(/[0-9]{2}:[0-9]{2}/); expect(all).toMatch(/[०-९]{2}:[०-९]{2}/); }
  });
  it('states that a valid empty response is not an all-clear, distinctly from a failed fetch', async () => {
    const empty = await publication('empty', 'empty');
    const emptyText = text(buildBulletin(empty, views(empty), 'en'));
    expect(emptyText).toContain('This is not an all-clear');
    expect(emptyText).toContain('not a forecast of no precipitation');
    expect(emptyText).not.toContain('STALE');
    const failed = await publication('failed', 'normal');
    const failedText = buildBulletin(failed, views(failed), 'en').sections[0].sentences;
    expect(failedText[0]).toBe(copy('en', 'stale_prefix'));
    expect(failedText.join(' ')).toContain('TEST ONLY synthetic earthquake');
  });
  it('shows no reading for unavailable or corrupted feeds', async () => {
    const data = await publication('unavailable', 'normal', true);
    const [eq, fc] = buildBulletin(data, views(data), 'en').sections;
    expect(eq.sentences).toEqual([copy('en', 'unavailable')]);
    expect(fc.sentences).toEqual([copy('en', 'error')]);
    const missing = buildBulletin(null, [], 'ne');
    expect(missing.publication).toBe(copy('ne', 'publication_unavailable'));
    expect(missing.sections[0].sentences).toEqual([copy('ne', 'unavailable')]);
  });
  it('keeps the unconfigured default deployment free of implied readings', () => {
    const index = parseLiveIndex(JSON.parse(readFileSync('apps/web/public/live/latest.json', 'utf8')));
    const data: LivePublication = { index, deliveries: index.feeds.map(feed => ({ feed, snapshot: null, error: null })) };
    const bulletin = buildBulletin(data, views(data), 'en');
    expect(bulletin.publication).toBe(copy('en', 'not_configured'));
    expect(views(data).every(view => view.freshness === 'UNAVAILABLE')).toBe(true);
  });
});

describe('values, units and times', () => {
  it('preserves source zero, keeps null UNKNOWN and summarises model cells without interpolation', async () => {
    const data = await publication();
    const summary = forecastSummary(data.deliveries[1].snapshot!);
    expect(summary).toMatchObject({ total: 6, known: 5, unknown: 1, min: 0, max: 30, issuedAt: '2026-10-06T06:00:00Z', validFrom: '2026-10-07T00:00:00Z', validUntil: '2026-10-07T06:00:00Z' });
    expect(formatValue(0)).toBe('0'); expect(formatValue(null)).toBe('UNKNOWN'); expect(formatValue(null, 'ne')).toBe('अज्ञात (UNKNOWN)');
    const [row] = earthquakeRows(data.deliveries[0].snapshot!);
    expect(row).toMatchObject({ magnitude: 0, depth: null, magnitudeType: 'TEST ONLY magnitude type' });
    expect(gridCellPolygon([84, 28])[0]).toEqual([[83.875, 27.875], [84.125, 27.875], [84.125, 28.125], [83.875, 28.125], [83.875, 27.875]]);
  });
  it('formats UTC with Nepal Time (UTC+05:45) and never substitutes a missing time', () => {
    expect(formatTime('2026-10-06T12:00:00Z')).toBe('2026-10-06 12:00 UTC (17:45 NPT)');
    expect(formatTime('2026-10-06T20:30:00Z')).toBe('2026-10-06 20:30 UTC (2026-10-07 02:15 NPT)');
    expect(formatTime('2026-10-06T12:00:00Z', 'ne')).toBe('२०२६-१०-०६ १२:०० UTC (१७:४५ नेपाली समय)');
    expect(formatTime(null)).toBe('UNKNOWN');
    expect(localDigits('M 4.5', 'ne')).toBe('M ४.५');
  });
});
