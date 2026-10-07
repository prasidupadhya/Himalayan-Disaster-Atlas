// Builds /sw.js from the original template with a checksum-pinned app-shell manifest.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('..', import.meta.url));
const CONFIG = /\/\*@atlas-config\*\/([\s\S]*?)\/\*@end\*\//;
const TYPES = { html: 'text/html; charset=utf-8', txt: 'text/plain; charset=utf-8', js: 'application/javascript', mjs: 'application/javascript', css: 'text/css', svg: 'image/svg+xml', json: 'application/json' };
const hash = raw => createHash('sha256').update(raw).digest('hex');
export const offlinePolicy = () => JSON.parse(readFileSync(resolve(root, 'packages/contracts/offline-shell-policy.json'), 'utf8'));

/** Maps a shell URL to its exported file; page URLs end in a slash and resolve to index.html. */
export function shellFile(output, url) {
  if (!url.startsWith('/') || url.includes('..') || url.includes('?')) throw new Error(`Invalid shell URL: ${url}`);
  return resolve(output, url.endsWith('/') ? `.${url}index.html` : `.${url}`);
}

/** @param {string} output @param {ReturnType<typeof offlinePolicy>} [policy] @param {Record<string, { files: string[] }> | null} [loadable] */
export function shellUrls(output, policy = offlinePolicy(), loadable = null) {
  const urls = new Set();
  for (const page of policy.shell_pages) {
    const html = shellFile(output, page);
    if (!existsSync(html)) throw new Error(`Missing offline shell page: ${page}`);
    urls.add(page);
    for (const match of readFileSync(html, 'utf8').matchAll(/\/_next\/static\/[A-Za-z0-9_\-./]+\.(?:js|css)/g)) urls.add(match[0]);
    const directory = resolve(html, '..');
    for (const name of readdirSync(directory)) if (/^(?:index|__next\.[A-Za-z0-9_.-]+)\.txt$/.test(name)) urls.add(`${page}${name}`);
  }
  const manifest = loadable ?? JSON.parse(readFileSync(resolve(root, 'apps/web/.next/react-loadable-manifest.json'), 'utf8'));
  for (const [key, value] of Object.entries(manifest)) {
    if (policy.dynamic_imports.some(prefix => key.startsWith(prefix))) for (const file of value.files) urls.add(`/_next/${file}`);
  }
  for (const directory of policy.vendor_directories) {
    const walk = (path, prefix) => {
      if (!existsSync(path)) throw new Error(`Missing offline vendor directory: ${prefix}`);
      for (const entry of readdirSync(path, { withFileTypes: true })) {
        if (entry.isDirectory()) walk(resolve(path, entry.name), `${prefix}/${entry.name}`);
        else if (/\.m?js$/.test(entry.name)) urls.add(`/${prefix}/${entry.name}`);
      }
    };
    walk(resolve(output, directory), directory);
  }
  for (const file of policy.extra_files) urls.add(file);
  return [...urls].sort();
}

export function shellEntries(output, urls, policy = offlinePolicy()) {
  let total = 0;
  const entries = urls.map(url => {
    const path = shellFile(output, url);
    if (!existsSync(path) || !statSync(path).isFile()) throw new Error(`Missing offline shell file: ${url}`);
    const raw = readFileSync(path); total += raw.length;
    const extension = url.endsWith('/') ? 'html' : url.split('.').pop();
    return { url, bytes: raw.length, sha256: hash(raw), type: TYPES[extension] ?? 'application/octet-stream' };
  });
  if (total > policy.shell_budget_bytes) throw new Error(`Offline shell exceeds its ${policy.shell_budget_bytes}-byte budget (${total})`);
  return entries;
}

/** @param {string} [output] @param {{ loadable?: Record<string, { files: string[] }> | null }} [options] */
export function prepareServiceWorker(output = resolve(root, 'apps/web/out'), { loadable = null } = {}) {
  const policy = offlinePolicy();
  const template = readFileSync(resolve(root, 'apps/web/service-worker/sw.template.js'), 'utf8');
  if (!CONFIG.test(template)) throw new Error('Service worker template has no configuration marker');
  const shell = shellEntries(output, shellUrls(output, policy, loadable), policy);
  // A changed shell byte, policy or template yields a new cache version and an explicit upgrade.
  const version = hash(JSON.stringify({ shell, policy, template })).slice(0, 16);
  const config = { version, shell, liveRetentionSeconds: policy.live_retention_seconds, networkTimeoutMs: policy.network_timeout_ms, staticEntries: policy.static_entries, dataEntries: policy.data_entries };
  writeFileSync(resolve(output, 'sw.js'), template.replace(CONFIG, `/*@atlas-config*/ ${JSON.stringify(config)} /*@end*/`));
  console.log(`Offline shell ${version}: ${shell.length} checksum-pinned files, ${(shell.reduce((sum, item) => sum + item.bytes, 0) / 1048576).toFixed(2)} MiB.`);
  return config;
}

/** Release gate: sw.js must describe exactly the exported bytes it will precache. */
export function verifyServiceWorker(output) {
  const path = resolve(output, 'sw.js');
  if (!existsSync(path)) throw new Error('Missing offline service worker');
  const match = readFileSync(path, 'utf8').match(CONFIG);
  if (!match) throw new Error('Service worker configuration marker missing');
  const config = JSON.parse(match[1]);
  const policy = offlinePolicy();
  if (config.liveRetentionSeconds !== policy.live_retention_seconds || config.networkTimeoutMs !== policy.network_timeout_ms) throw new Error('Service worker differs from offline policy');
  for (const page of policy.shell_pages) if (!config.shell.some(entry => entry.url === page)) throw new Error(`Offline shell page not pinned: ${page}`);
  const actual = shellEntries(output, config.shell.map(entry => entry.url), policy);
  if (JSON.stringify(actual) !== JSON.stringify(config.shell)) throw new Error('Offline shell checksums differ from the exported files');
  return config;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) prepareServiceWorker();
