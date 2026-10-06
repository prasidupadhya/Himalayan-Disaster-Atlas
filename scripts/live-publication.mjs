import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import live from '../packages/contracts/generated/live-runtime.cjs';
import validateRelease from '../packages/contracts/generated/live-release.cjs';
const root = fileURLToPath(new URL('..', import.meta.url));
const policyBytes = readFileSync(resolve(root, 'licensing/live-sources.json'));
const policy = JSON.parse(policyBytes);
const hash = raw => createHash('sha256').update(raw).digest('hex');
const requireValue = (condition, message) => { if (!condition) throw new Error(message); };
export const isLivePath = path => /^data\/live-(usgs|noaa-gfs)\/\d+\.\d+\.\d+\/(snapshot|manifest)\.json$/.test(path) || /^live\/(latest\.json|history\/\d+\.\d+\.\d+\/index\.json)$/.test(path);
function bounded(read, name, limit) { const raw = read(name); requireValue(raw.length > 0 && raw.length <= limit, 'Live publication byte budget exceeded'); return raw; }
export function verifyLiveFiles(read, names) {
  requireValue(names.length <= 64 && names.every(isLivePath), 'Unregistered live publication files');
  const used = new Set();
  const indexes = names.filter(name => name === 'live/latest.json' || name.startsWith('live/history/'));
  requireValue(indexes.includes('live/latest.json') && indexes.length <= 9, 'Live index/history budget exceeded');
  for (const name of indexes) {
    used.add(name);
    const index = live.parseLiveIndex(JSON.parse(bounded(read, name, live.LIVE_INDEX_BYTES)));
    live.assertLivePublicationAllowed(index);
    for (const feed of index.feeds) {
      requireValue(Object.hasOwn(policy.sources, feed.feed_id), 'Unreviewed live feed');
      if (!feed.snapshot) continue;
      const ref = feed.snapshot, path = ref.path.slice(1), manifestPath = path.replace('/snapshot.json', '/manifest.json');
      used.add(path); used.add(manifestPath);
      const raw = bounded(read, path, live.LIVE_SNAPSHOT_BYTES);
      requireValue(raw.length === ref.byte_size && hash(raw) === ref.sha256, 'Live artifact checksum mismatch');
      const snapshot = live.parseLiveSnapshot(JSON.parse(raw));
      live.validateLivePair(index, feed, snapshot); live.assertLivePublicationAllowed(index, snapshot);
      const manifest = JSON.parse(bounded(read, manifestPath, 65536));
      requireValue(validateRelease(manifest), 'Invalid live release manifest');
      requireValue(Object.keys(ref).every(key => manifest.snapshot[key] === ref[key]), 'Live release identity differs');
      requireValue(manifest.source_terms_policy_sha256 === hash(policyBytes), 'Live source review is stale');
      const review = policy.sources[feed.feed_id];
      for (const key of ['name', 'url', 'license', 'license_url', 'attribution', 'license_review', 'is_official']) requireValue(snapshot.source[key] === review[key], 'Unreviewed live source');
      const expected = { status: 'PERMITTED', reviewed_on: policy.reviewed_on, evidence_urls: review.evidence_urls, obligations: review.obligations };
      for (const [key, value] of Object.entries(expected)) requireValue(JSON.stringify(manifest.licence_review[key]) === JSON.stringify(value), 'Unreviewed live release licence');
      const url = new URL(manifest.source_request_url);
      requireValue(url.protocol === 'https:' && !url.username && !url.password && url.hostname === review.request_host && url.pathname === review.request_path, 'Unreviewed live interface');
      requireValue(snapshot.source.version !== null, 'Live source revision is UNKNOWN');
      if (feed.feed_id === 'usgs') requireValue(snapshot.product_type === 'reported_event' && snapshot.records.every(r => r.source_network === 'us'), 'Unreviewed USGS contributor');
      if (feed.feed_id === 'noaa-gfs') requireValue(snapshot.product_type === 'forecast' && snapshot.records.length === 777 && snapshot.records.every(r => r.measurements.length === 1 && r.measurements[0].variable === 'precipitation_accumulation' && Date.parse(r.valid_until) - Date.parse(r.valid_from) === 21600000), 'Unreviewed GFS product');
    }
  }
  requireValue(names.every(name => used.has(name)), 'Unreferenced live publication artifact');
  return live.parseLiveIndex(JSON.parse(read('live/latest.json')));
}
export function liveNames(directory) {
  const names = [];
  function walk(path) {
    if (!existsSync(path)) return;
    for (const entry of readdirSync(path, { withFileTypes: true })) {
      const full = resolve(path, entry.name);
      requireValue(!entry.isSymbolicLink(), 'Live publication symlink');
      if (entry.isDirectory()) walk(full); else names.push(relative(directory, full));
    }
  }
  walk(resolve(directory, 'live'));
  for (const id of ['live-usgs', 'live-noaa-gfs']) walk(resolve(directory, 'data', id));
  return names.sort();
}
export function verifyLiveExport(output) {
  const names = liveNames(output);
  if (!names.length) throw new Error('Missing live publication index');
  return verifyLiveFiles(name => readFileSync(resolve(output, name)), names);
}
export function prepareLiveExport(output) {
  const commit = process.env.ATLAS_LIVE_DATA_COMMIT;
  if (!commit) {
    // No fetch is fabricated. The checked-in unavailable index is the default.
    verifyLiveExport(output);
    return;
  }
  requireValue(/^[a-f0-9]{40}$/.test(commit), 'ATLAS_LIVE_DATA_COMMIT must be a full reviewed commit SHA');
  // Only acquisition-branch bytes are imported. Never execute scripts from that branch.
  execFileSync('git', ['fetch', '--no-tags', '--filter=blob:none', 'origin', 'live-data'], { cwd: root, stdio: 'pipe', timeout: 60000 });
  execFileSync('git', ['merge-base', '--is-ancestor', commit, 'FETCH_HEAD'], { cwd: root, stdio: 'pipe' });
  const all = execFileSync('git', ['ls-tree', '-r', '--name-only', commit], { cwd: root, encoding: 'utf8', maxBuffer: 1048576 }).trim().split('\n');
  requireValue(all.length <= 10000 && all.every(isLivePath), 'Live data commit must contain only the bounded data archive');
  const read = name => execFileSync('git', ['show', `${commit}:${name}`], { cwd: root, maxBuffer: 524289, timeout: 10000 });
  // Bound history in the static export; the acquisition branch retains immutable evidence.
  const histories = all.filter(n => /^live\/history\/\d+\.\d+\.\d+\/index\.json$/.test(n)).sort((a, b) => Number(b.split('/')[2].split('.')[2]) - Number(a.split('/')[2].split('.')[2])).slice(0, 8);
  const names = new Set(['live/latest.json', ...histories]);
  for (const name of [...names]) {
    const index = live.parseLiveIndex(JSON.parse(bounded(read, name, live.LIVE_INDEX_BYTES)));
    for (const feed of index.feeds) if (feed.snapshot) { names.add(feed.snapshot.path.slice(1)); names.add(feed.snapshot.path.slice(1).replace('/snapshot.json', '/manifest.json')); }
  }
  const inventory = [...names].sort();
  const content = new Map(inventory.map(name => [name, bounded(read, name, name.endsWith('snapshot.json') ? live.LIVE_SNAPSHOT_BYTES : live.LIVE_INDEX_BYTES)]));
  verifyLiveFiles(name => content.get(name), inventory);
  for (const [name, raw] of content) { const path = resolve(output, name); mkdirSync(resolve(path, '..'), { recursive: true }); writeFileSync(path, raw); }
  verifyLiveExport(output);
  console.log(`Imported verified live publication at ${commit}; ${inventory.length} files. No browser acquisition.`);
}
