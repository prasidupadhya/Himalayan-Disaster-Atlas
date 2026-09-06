import { mkdirSync, copyFileSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Preserve module-worker relative imports and notices outside the Next bundler. */
export function prepareMapWorker() {
  const packageRoot = dirname(fileURLToPath(import.meta.resolve('maplibre-gl/package.json')));
  const { version } = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8'));
  const root = fileURLToPath(new URL('..', import.meta.url));
  const output = join(root, 'apps/web/public/vendor/maplibre-gl', version);
  mkdirSync(output, { recursive: true });
  for (const name of ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs']) copyFileSync(join(packageRoot, 'dist', name), join(output, name));
  copyFileSync(join(packageRoot, 'LICENSE.txt'), join(output, 'LICENSE.txt'));
  console.log(`Prepared local MapLibre ${version} worker and license.`);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) prepareMapWorker();
