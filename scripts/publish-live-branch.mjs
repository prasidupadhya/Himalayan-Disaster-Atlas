// Manual workflow only: publish the already validated transaction to live-data, never main.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, cpSync, existsSync, appendFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
const git = (...args) => execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
if (process.env.GITHUB_EVENT_NAME !== 'workflow_dispatch' || process.env.GITHUB_REF !== 'refs/heads/main') throw new Error('Live publication is manual and only executes reviewed main code');
const output = resolve('data/live-publication');
if (!existsSync(resolve(output, 'live/latest.json'))) throw new Error('No validated publication');
const temp = mkdtempSync(resolve(tmpdir(), 'atlas-live-publish-'));
try {
  git('worktree', 'add', '--detach', temp, 'HEAD');
  const run = (...args) => execFileSync('git', ['-C', temp, ...args], { encoding: 'utf8' }).trim();
  const remote = git('ls-remote', '--heads', 'origin', 'live-data');
  if (remote) { git('fetch', '--no-tags', 'origin', 'live-data'); run('checkout', '-B', 'live-data', 'FETCH_HEAD'); }
  else { run('checkout', '--orphan', 'live-data'); run('rm', '-rf', '.'); }
  // Data branch is data-only; no source code is copied into its tree.
  cpSync(resolve(output, 'live'), resolve(temp, 'live'), { recursive: true });
  if (existsSync(resolve(output, 'data'))) cpSync(resolve(output, 'data'), resolve(temp, 'data'), { recursive: true });
  run('config', 'user.name', 'Atlas manual live publisher'); run('config', 'user.email', 'atlas-live@users.noreply.github.com');
  run('add', 'live', ...(existsSync(resolve(temp, 'data')) ? ['data'] : []));
  if (run('status', '--porcelain')) { run('commit', '-m', 'data: publish validated live transaction'); run('push', 'origin', 'HEAD:refs/heads/live-data'); }
  const sha = run('rev-parse', 'HEAD');
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `Published live-data commit: ${sha}\n\nPin ATLAS_LIVE_DATA_COMMIT=${sha} in the next static build. No main commit or automatic deployment occurred.\n`);
} finally { try { git('worktree', 'remove', '--force', temp); } finally { rmSync(temp, { recursive: true, force: true }); } }
