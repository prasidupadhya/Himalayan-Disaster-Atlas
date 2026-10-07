import { afterEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import * as runtime from '../../packages/contracts/generated/live-runtime.cjs';
import { assertReviewedLiveSource, liveFreshness, parseLiveIndex, parseLiveSnapshot } from '../../packages/contracts/live';
import { loadLivePublication } from '../../apps/web/lib/live';
import { deliveryFixture } from '../helpers/live-publication';
// Spawned Python runs the complete acquisition path; shared CI runners exceed Vitest's 5-second default.
const PYTHON_TIMEOUT_MS = 60_000;
afterEach(() => vi.unstubAllGlobals());
describe('open feed delivery and exact source review', () => {
  for (const state of ['normal', 'empty', 'failed', 'unavailable', 'stale'] as const) it(`keeps ${state} distinct with Node/TS semantic parity`, async () => {
    const f = deliveryFixture(state);
    vi.stubGlobal('fetch', vi.fn(async (path: string) => new Response(path === '/live/latest.json' ? JSON.stringify(f.index) : f.raw)));
    const result = await loadLivePublication();
    const now = Date.parse(state === 'stale' ? '2026-10-06T18:00:00Z' : '2026-10-06T12:01:00Z');
    const expected = { normal: 'ready', empty: 'empty', failed: 'stale', unavailable: 'unavailable', stale: 'stale' }[state];
    const value = liveFreshness(result.index, result.deliveries[0].feed, result.deliveries[0].snapshot, now);
    expect(value.status).toBe(expected);
    expect(runtime.liveFreshness(runtime.parseLiveIndex(f.index), f.index.feeds[0], state === 'unavailable' ? null : runtime.parseLiveSnapshot(f.snapshot), now)).toEqual(value);
    expect(result.deliveries[1].snapshot).toBeNull();
    expect(result.deliveries[0].snapshot?.records[0]?.measurements[0].value ?? null).toBe(state === 'normal' || state === 'failed' || state === 'stale' ? 0 : null);
  });
  it('rejects altered source licences and unreviewed contributors independently of PERMITTED claims', () => {
    for (const field of ['license', 'name', 'url', 'attribution'] as const) {
      const f = deliveryFixture(); f.snapshot.source[field] += ' changed';
      expect(() => assertReviewedLiveSource(f.snapshot)).toThrow('reviewed');
    }
    const f = deliveryFixture(); f.snapshot.records[0].source_network = 'other';
    expect(() => assertReviewedLiveSource(f.snapshot)).toThrow('contributor');
  });
  it('fails corrupt bytes without rendering them while preserving other feed states', async () => {
    const f = deliveryFixture(); vi.stubGlobal('fetch', vi.fn(async (path: string) => new Response(path === '/live/latest.json' ? JSON.stringify(f.index) : '{}')));
    const result = await loadLivePublication(); expect(result.deliveries[0].error).toContain('checksum'); expect(result.deliveries[0].snapshot).toBeNull();
  });
  it('missing or malformed index is unavailable/error, never a valid empty feed', async () => {
    for (const response of [new Response('missing', { status: 404 }), new Response('{}'), new Response(' '.repeat(65537))]) {
      vi.stubGlobal('fetch', vi.fn(async () => response)); await expect(loadLivePublication()).rejects.toThrow();
    }
  });
  it('rejects future revision timestamps in both semantic implementations', () => {
    const f = deliveryFixture(); f.snapshot.records[0].source_revision_at = '2026-10-07T12:00:00Z';
    expect(() => parseLiveSnapshot(f.snapshot)).toThrow('Revision'); expect(() => runtime.parseLiveSnapshot(f.snapshot)).toThrow('Revision');
    expect(parseLiveIndex(f.index)).toEqual(runtime.parseLiveIndex(f.index));
  });
  it('ships dispatch only, no cron/main publisher, and default unconfigured source index', () => {
    const workflow = readFileSync('.github/workflows/live-feeds.yml', 'utf8'); expect(workflow).toContain('workflow_dispatch:'); expect(workflow).not.toMatch(/\bschedule:|\bcron:/);
    expect(readFileSync('scripts/publish-live-branch.mjs', 'utf8')).toContain('HEAD:refs/heads/live-data');
    const index = parseLiveIndex(JSON.parse(readFileSync('apps/web/public/live/latest.json', 'utf8'))); expect(index.workflow.last_successful_fetch_at).toBeNull();
  });
  it('acquisition never introduces a Python/TS contract disagreement', () => {
    const f = deliveryFixture(); const r = spawnSync('.venv/bin/python', ['-c', 'import json,sys\nfrom pipelines.atlas_pipeline.live_contracts import parse_live_index,parse_live_snapshot\nd=json.load(sys.stdin)\nparse_live_index(d["index"])\nparse_live_snapshot(d["snapshot"])'], { input: JSON.stringify(f), encoding: 'utf8' }); expect(r.status, r.stderr).toBe(0);
  }, PYTHON_TIMEOUT_MS);
});

it('Node publication gate rejects altered manifests, unreferenced files and bytes', async () => {
  const { mkdtempSync, rmSync, readdirSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const directory = mkdtempSync(`${tmpdir()}/atlas-live-gate-`);
  try {
    const code = 'from pathlib import Path\nfrom tests.python.test_live_open_feeds import fetch,NOW\nfrom pipelines.atlas_pipeline.live_open_feeds import run\nimport sys\nrun(Path(sys.argv[1]),fetch,NOW)';
    const r = spawnSync('.venv/bin/python', ['-c', code, directory], { encoding: 'utf8' }); expect(r.status, r.stderr).toBe(0);
    const { liveNames, verifyLiveFiles } = await import('../../scripts/live-publication.mjs');
    const names = liveNames(directory), files = new Map(names.map(name => [name, readFileSync(`${directory}/${name}`)]));
    expect(verifyLiveFiles((name: string) => files.get(name)!, names).workflow.status).toBe('success');
    const snapshot = names.find(n => n.startsWith('data/live-usgs') && n.endsWith('/snapshot.json'))!;
    const original = files.get(snapshot)!; files.set(snapshot, Buffer.from('{}'));
    expect(() => verifyLiveFiles((name: string) => files.get(name)!, names)).toThrow('checksum'); files.set(snapshot, original);
    const manifest = snapshot.replace('/snapshot.json','/manifest.json');
    const value = JSON.parse(files.get(manifest)!.toString()); value.licence_review.status = 'REVIEW_REQUIRED'; files.set(manifest, Buffer.from(JSON.stringify(value)));
    expect(() => verifyLiveFiles((name: string) => files.get(name)!, names)).toThrow('manifest');
    expect(() => verifyLiveFiles((name: string) => files.get(name)!, [...names, 'data/live-dhm/1.0.1/snapshot.json'])).toThrow('Unregistered');
    expect(readdirSync(directory)).toContain('live');
  } finally { rmSync(directory, { recursive: true, force: true }); }
}, PYTHON_TIMEOUT_MS);
