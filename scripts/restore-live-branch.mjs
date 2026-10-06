import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const run = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 1048576 }).trim();
if (run('ls-remote', '--heads', 'origin', 'live-data')) {
  run('fetch', '--no-tags', 'origin', 'live-data');
  const names = run('ls-tree', '-r', '--name-only', 'FETCH_HEAD').split('\n');
  if (names.length > 10000) throw new Error('Live branch archive budget exceeded; archive before further publication');
  for (const name of names) {
    if (!/^(?:live\/(?:latest\.json|history\/\d+\.\d+\.\d+\/index\.json)|data\/live-(?:usgs|noaa-gfs)\/\d+\.\d+\.\d+\/(?:snapshot|manifest)\.json)$/.test(name)) throw new Error('Unregistered live branch file');
    const raw = execFileSync('git', ['show', `FETCH_HEAD:${name}`], { maxBuffer: 524289 });
    const target = resolve('data/live-publication', name); mkdirSync(resolve(target, '..'), { recursive: true }); writeFileSync(target, raw);
  }
}
