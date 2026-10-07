import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { afterEach, describe, expect, it, vi } from 'vitest';
import cases from '../fixtures/live-contract-cases.json';
import { assertLivePublicationAllowed, EVIDENCE_LABELS, LIVE_UNITS, liveFreshness, parseLiveIndex, parseLiveSnapshot, validateLivePair, workflowHealth, type LiveIndex, type LiveSnapshot } from '../../packages/contracts/live';
import { loadLiveFeed } from '../../apps/web/lib/live';

const base = 'data/releases/atlas-live-contracts/1.0.0/';
const read = (id: string) => JSON.parse(readFileSync(`${base}${id}.json`, 'utf8'));
function observed() {
  const snapshot = read('snapshot-ready') as LiveSnapshot;
  snapshot.product_type = 'observation'; snapshot.evidence_type = 'observed';
  snapshot.records[0].evidence_type = 'observed'; snapshot.records[0].observed_at = snapshot.source_issued_at;
  snapshot.records[0].measurements = [{ variable: 'temperature', value: 0, unit: 'degC', qualifier: null, evidence_type: 'observed' }];
  return snapshot;
}
function warning() {
  const snapshot = read('snapshot-ready') as LiveSnapshot;
  snapshot.is_fixture = false; snapshot.feed_id = 'dhm'; snapshot.dataset_id = 'live-dhm';
  snapshot.source.is_official = true; snapshot.source.raw_sha256 = '0'.repeat(64);
  snapshot.product_type = 'official_warning'; snapshot.evidence_type = 'reported';
  snapshot.records[0].evidence_type = 'reported';
  snapshot.records[0].valid_from = snapshot.source_issued_at;
  snapshot.records[0].valid_until = '2026-10-06T12:02:00Z';
  const index = read('index-ready') as LiveIndex;
  index.is_fixture = false; index.feeds[0].feed_id = 'dhm';
  index.feeds[0].snapshot!.dataset_id = 'live-dhm';
  index.feeds[0].snapshot!.path = '/data/live-dhm/1.0.0/snapshot-ready.json';
  return { index: parseLiveIndex(index), snapshot: parseLiveSnapshot(snapshot) };
}
function caseValue(item: typeof cases[number]) {
  const value = item.target === 'observed' ? observed() : read(({ snapshot: 'snapshot-ready', index: 'index-ready', 'empty-index': 'index-empty', 'failed-index': 'index-failed', 'unavailable-index': 'index-unavailable' } as Record<string, string>)[item.target]);
  for (const edit of item.edits) {
    let parent = value;
    for (const key of edit.path.slice(0, -1)) parent = parent[key];
    parent[edit.path.at(-1)!] = edit.value;
  }
  return value;
}
afterEach(() => vi.unstubAllGlobals());

describe('live contract parity and scientific meaning', () => {
  for (const item of cases) it(item.name, () => {
    const parse = item.target.includes('index') ? parseLiveIndex : parseLiveSnapshot;
    if (item.valid) expect(() => parse(caseValue(item))).not.toThrow();
    else expect(() => parse(caseValue(item))).toThrow();
  });
  it('compares the same fixtures against Python, including freshness boundary decisions', () => {
    const samples = cases.map(item => ({ name: item.name, target: item.target.includes('index') ? 'index' : 'snapshot', value: caseValue(item) }));
    const clocks = ['2026-10-06T12:01:00Z', '2026-10-06T17:59:59.999Z', '2026-10-06T18:00:00Z'];
    const pairs = ['ready', 'empty', 'failed', 'unavailable', 'unknown'].flatMap(id => clocks.map(now => {
      const index = parseLiveIndex(read(`index-${id}`));
      const ref = index.feeds[0].snapshot;
      const snapshot = ref ? parseLiveSnapshot(read(ref.id)) : null;
      return { index, snapshot, now };
    }));
    const official = warning();
    pairs.push(...clocks.map(now => ({ ...official, now })));
    const unknownValidity = structuredClone(official);
    unknownValidity.snapshot.records[0].valid_from = null; unknownValidity.snapshot.records[0].valid_until = null;
    pairs.push(...clocks.map(now => ({ ...unknownValidity, now })));
    const code = 'import json,sys\nfrom pipelines.atlas_pipeline.live_contracts import parse_live_index,parse_live_snapshot,live_freshness,workflow_health,time\nd=json.load(sys.stdin)\naccepted=[]\nfor row in d["samples"]:\n try:\n  (parse_live_index if row["target"]=="index" else parse_live_snapshot)(row["value"])\n  accepted.append(True)\n except (ValueError,Exception):\n  accepted.append(False)\nprint(json.dumps({"accepted":accepted,"freshness":[live_freshness(p["index"],p["index"]["feeds"][0],p["snapshot"],time(p["now"])) for p in d["pairs"]],"health":[workflow_health(p["index"],time(p["now"])) for p in d["pairs"]]}))';
    const result = spawnSync('.venv/bin/python', ['-c', code], { input: JSON.stringify({ samples, pairs }), encoding: 'utf8' });
    expect(result.status, result.stderr).toBe(0);
    const python = JSON.parse(result.stdout);
    expect(python.accepted).toEqual(cases.map(item => item.valid));
    expect(python.freshness).toEqual(pairs.map(p => liveFreshness(p.index, p.index.feeds[0], p.snapshot, Date.parse(p.now))));
    expect(python.health).toEqual(pairs.map(p => workflowHealth(p.index, Date.parse(p.now))));
  }, 60_000);
  it('preserves zero, null and non-colour evidence labels', () => {
    const snapshot = parseLiveSnapshot(observed());
    expect(snapshot.records[0].measurements[0].value).toBe(0);
    snapshot.records[0].measurements[0].value = null;
    expect(parseLiveSnapshot(snapshot).records[0].measurements[0].value).toBeNull();
    expect(Object.values(EVIDENCE_LABELS)).toEqual(['OBSERVED', 'REPORTED', 'DERIVED', 'MODELLED', 'HYPOTHETICAL', 'UNKNOWN']);
  });
  it('expires at the deadline, retains failed snapshots and never makes empty mean all-clear', () => {
    for (const [id, expected] of [['ready', 'ready'], ['empty', 'empty'], ['failed', 'stale'], ['unavailable', 'unavailable'], ['unknown', 'stale']] as const) {
      const index = parseLiveIndex(read(`index-${id}`));
      const snapshot = index.feeds[0].snapshot ? parseLiveSnapshot(read(index.feeds[0].snapshot!.id)) : null;
      expect(liveFreshness(index, index.feeds[0], snapshot, Date.parse('2026-10-06T12:01:00Z')).status).toBe(expected);
      if (snapshot) expect(liveFreshness(index, index.feeds[0], snapshot, Date.parse('2026-10-06T18:00:00Z')).status).toBe('stale');
    }
  });
  it('uses the oldest observation and never a future forecast valid time for freshness', () => {
    const snapshot = observed(); snapshot.freshness.basis = 'observation';
    const old = structuredClone(snapshot.records[0]); old.id = 'older'; old.observed_at = '2026-10-06T08:00:00Z';
    snapshot.records.push(old); snapshot.freshness.as_of = old.observed_at;
    expect(parseLiveSnapshot(snapshot).freshness.as_of).toBe(old.observed_at);
    snapshot.freshness.as_of = snapshot.fetched_at;
    expect(() => parseLiveSnapshot(snapshot)).toThrow('source time');
    const forecast = observed(); forecast.product_type = 'forecast'; forecast.evidence_type = 'modelled';
    const record = forecast.records[0]; record.evidence_type = 'modelled'; record.measurements[0].evidence_type = 'modelled';
    record.issued_at = forecast.source_issued_at; record.valid_from = '2026-10-07T00:00:00Z'; record.valid_until = '2026-10-07T01:00:00Z';
    expect(parseLiveSnapshot(forecast).freshness.as_of).toBe(forecast.source_issued_at);
  });
  it('never treats expired or unknown warning validity as fresh, and still blocks DHM publication', () => {
    const { index, snapshot } = warning();
    expect(liveFreshness(index, index.feeds[0], snapshot, Date.parse('2026-10-06T12:01:00Z')).status).toBe('ready');
    expect(liveFreshness(index, index.feeds[0], snapshot, Date.parse('2026-10-06T12:02:00Z')).status).toBe('stale');
    snapshot.records[0].valid_from = null; snapshot.records[0].valid_until = null;
    expect(liveFreshness(index, index.feeds[0], snapshot, Date.parse('2026-10-06T12:01:00Z')).reason).toBe('Official warning validity is UNKNOWN.');
    expect(() => assertLivePublicationAllowed(index, snapshot)).toThrow('disabled');
  });
  it('rejects duplicate IDs, nonfinite values and unknown measurement units', () => {
    const snapshot = observed(); snapshot.records.push(structuredClone(snapshot.records[0]));
    expect(() => parseLiveSnapshot(snapshot)).toThrow('Duplicate');
    for (const value of [NaN, Infinity, -Infinity]) {
      const invalid = observed(); invalid.records[0].measurements[0].value = value;
      expect(() => parseLiveSnapshot(invalid)).toThrow();
    }
    expect(LIVE_UNITS.water_level).toBe('m');
  });
  it('rejects JSON integers beyond the finite browser range, matching Python', () => {
    const raw = JSON.stringify(observed()).replace('"value":0', `"value":1${'0'.repeat(400)}`);
    expect(() => parseLiveSnapshot(JSON.parse(raw))).toThrow();
  });
  it('rejects mismatched snapshot identity and false fetch timestamps', () => {
    const index = parseLiveIndex(read('index-ready')), snapshot = parseLiveSnapshot(read('snapshot-ready'));
    snapshot.version = '9.0.0'; expect(() => validateLivePair(index, index.feeds[0], snapshot)).toThrow('identity');
    snapshot.version = '1.0.0'; snapshot.fetched_at = '2026-10-06T11:00:00Z';
    expect(() => validateLivePair(index, index.feeds[0], snapshot)).toThrow('fetch time');
  });
  it('enforces source flags independently of claims in a downloaded index', () => {
    const index = read('index-ready') as LiveIndex;
    expect(() => assertLivePublicationAllowed(index)).toThrow('fixtures');
    for (const id of ['dhm', 'bipad', 'openaq', 'open-meteo', 'imerg'] as const) {
      const candidate = structuredClone(index); candidate.is_fixture = false; candidate.feeds[0].feed_id = id;
      expect(() => assertLivePublicationAllowed(candidate)).toThrow('disabled');
    }
    const snapshot = read('snapshot-ready') as LiveSnapshot; snapshot.source.license_review = 'REVIEW_REQUIRED';
    expect(() => assertLivePublicationAllowed(index, snapshot, true)).toThrow('redistribution');
  });
});

describe('bounded same-origin live delivery', () => {
  const manifest = read('manifest');
  it('verifies pinned index and snapshot bytes before returning data', async () => {
    const fetch = vi.fn(async (path: string) => new Response(readFileSync(`apps/web/public${path}`)));
    vi.stubGlobal('fetch', fetch);
    const data = await loadLiveFeed(manifest.artifacts['index-ready'], 'contract-fixture', undefined, true);
    expect(data.snapshot?.records).toHaveLength(1);
    expect(fetch.mock.calls).toHaveLength(2);
  });
  it('rejects corrupted index and snapshot bytes, incorrect size and oversize streams', async () => {
    for (const corrupt of ['index', 'snapshot', 'size', 'oversize']) {
      const ref = structuredClone(manifest.artifacts['index-ready']);
      if (corrupt === 'size') ref.byte_size += 1;
      vi.stubGlobal('fetch', vi.fn(async (path: string) => new Response(corrupt === 'oversize' ? ' '.repeat(65537) : (corrupt === 'index' || path.includes('snapshot')) && corrupt !== 'size' ? '{}' : readFileSync(`apps/web/public${path}`))));
      await expect(loadLiveFeed(ref, 'contract-fixture', undefined, true)).rejects.toThrow();
    }
  });
  it('rejects semantically invalid data even when its checksum matches', async () => {
    const index = read('index-ready'); index.workflow.status = 'failed';
    const bytes = Buffer.from(JSON.stringify(index));
    const ref = { ...manifest.artifacts['index-ready'], sha256: createHash('sha256').update(bytes).digest('hex'), byte_size: bytes.length };
    vi.stubGlobal('fetch', vi.fn(async () => new Response(bytes)));
    await expect(loadLiveFeed(ref, 'contract-fixture', undefined, true)).rejects.toThrow('workflow');
  });
  it('separates absent files from valid empty data and never requests disabled feeds', async () => {
    const fetch = vi.fn(async (path: string) => new Response(readFileSync(`apps/web/public${path}`)));
    vi.stubGlobal('fetch', fetch);
    const unavailable = await loadLiveFeed(manifest.artifacts['index-unavailable'], 'contract-fixture', undefined, true);
    expect(unavailable.snapshot).toBeNull(); expect(fetch.mock.calls).toHaveLength(1);
    const empty = await loadLiveFeed(manifest.artifacts['index-empty'], 'contract-fixture', undefined, true);
    expect(empty.snapshot?.records).toEqual([]);
    vi.stubGlobal('fetch', vi.fn(async () => new Response('Not found', { status: 404 })));
    await expect(loadLiveFeed(manifest.artifacts['index-ready'], 'contract-fixture', undefined, true)).rejects.toThrow('unavailable');
  });
  it('rejects arbitrary URLs before fetch and passes cancellation to both local reads', async () => {
    const controller = new AbortController();
    const fetch = vi.fn(async (path: string, init: RequestInit) => { expect(init.signal).toBe(controller.signal); expect(init.redirect).toBe('error'); return new Response(readFileSync(`apps/web/public${path}`)); });
    vi.stubGlobal('fetch', fetch);
    await expect(loadLiveFeed({ ...manifest.artifacts['index-ready'], path: 'https://example.invalid/latest.json' }, 'contract-fixture', controller.signal, true)).rejects.toThrow('local');
    expect(fetch).not.toHaveBeenCalled();
    await loadLiveFeed(manifest.artifacts['index-ready'], 'contract-fixture', controller.signal, true);
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
