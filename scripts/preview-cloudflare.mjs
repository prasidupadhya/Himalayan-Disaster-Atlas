import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
const root = fileURLToPath(new URL('..', import.meta.url));
const config = JSON.parse(readFileSync(resolve(root, 'wrangler.jsonc'), 'utf8'));
// Local research preview only; no upload path, credentials, tunnels or remote bindings.
delete config.build; delete config.$schema;
config.assets.directory = resolve(root, config.assets.directory);
mkdirSync(resolve(root, '.wrangler'), { recursive: true });
const path = resolve(root, '.wrangler/local-preview.json');
writeFileSync(path, JSON.stringify(config));
const env = Object.fromEntries(['PATH', 'HOME', 'TMPDIR', 'TEMP', 'TMP', 'SYSTEMROOT'].flatMap(key => process.env[key] ? [[key, process.env[key]]] : []));
env.WRANGLER_SEND_METRICS = 'false';
const child = spawn(resolve(root, 'node_modules/.bin/wrangler'), ['dev', '--local', '--ip', '127.0.0.1', '--port', '4174', '--config', path], { stdio: 'inherit', env });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('exit', code => process.exit(code ?? 1));
