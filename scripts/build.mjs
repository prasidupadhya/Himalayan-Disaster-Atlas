import { rmSync } from 'node:fs';
import { preparePublicExport } from './public-export.mjs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { checkSecurity } from './check-security.mjs';
import { compileValidators } from './compile-validators.mjs';
import { prepareHosting } from './prepare-hosting.mjs';
import { checkStaticExport } from './check-static-export.mjs';
import { checkLicenses } from './check-licenses.mjs';
import { prepareSoftwareNotices } from './prepare-software-notices.mjs';
import { prepareMapWorker } from './prepare-map-worker.mjs';
// Hosted builds may invoke the web workspace script from apps/web.
process.chdir(fileURLToPath(new URL('..', import.meta.url)));
compileValidators({ check: true });
checkLicenses();
prepareSoftwareNotices();
prepareMapWorker();
checkSecurity();
// Do not pass acquisition credentials to the static rendering/build process.
const env = Object.fromEntries(['PATH', 'HOME', 'TMPDIR', 'TEMP', 'TMP', 'SYSTEMROOT'].flatMap(key => process.env[key] ? [[key, process.env[key]]] : []));
env.NEXT_TELEMETRY_DISABLED = '1';
env.NODE_ENV = 'production';
const research = process.argv.includes('--research');
env.NEXT_PUBLIC_ATLAS_RELEASE = research ? 'research' : 'public';
// Never retain chunks or prerenders from a different release profile.
rmSync('apps/web/.next', { recursive: true, force: true });
rmSync('apps/web/out', { recursive: true, force: true });
const result = spawnSync('npm', ['run', 'build:static', '--workspace', '@atlas/web'], { env, stdio: 'inherit' });
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
prepareHosting();
const excluded = research ? [] : preparePublicExport();
checkStaticExport(undefined, { excludedReleases: excluded });
checkSecurity();
