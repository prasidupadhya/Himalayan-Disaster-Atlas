import { spawnSync } from 'node:child_process';
import { checkSecurity } from './check-security.mjs';
import { prepareMapWorker } from './prepare-map-worker.mjs';
prepareMapWorker();
checkSecurity();
// Do not pass acquisition credentials to the static rendering/build process.
const env = Object.fromEntries(['PATH', 'HOME', 'TMPDIR', 'TEMP', 'TMP', 'SYSTEMROOT'].flatMap(key => process.env[key] ? [[key, process.env[key]]] : []));
env.NEXT_TELEMETRY_DISABLED = '1';
env.NODE_ENV = 'production';
const result = spawnSync('npm', ['run', 'build', '--workspace', '@atlas/web'], { env, stdio: 'inherit' });
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
checkSecurity();
