import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import standalone from 'ajv/dist/standalone/index.js';
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const root = fileURLToPath(new URL('..', import.meta.url));
export function compileValidators({ check = false } = {}) {
  const sources = JSON.parse(readFileSync(resolve(root, 'packages/contracts/validator-sources.json'), 'utf8'));
  const output = resolve(root, 'packages/contracts/generated'); mkdirSync(output, { recursive: true });
  for (const name of readdirSync(output)) {
    if (!Object.hasOwn(sources, name.replace(/\.cjs$/, ''))) throw new Error(`Unregistered generated validator: ${name}`);
  }
  for (const [name, entry] of Object.entries(sources)) {
    const ajv = new Ajv({ strict: true, allErrors: true, code: { source: true, lines: true } });
    if (entry.formats) addFormats(ajv);
    if (entry.common_schema) ajv.addSchema(JSON.parse(readFileSync(resolve(root, 'schemas/dataset.schema.json'), 'utf8')));
    const schema = JSON.parse(readFileSync(resolve(root, 'schemas', entry.schema), 'utf8'));
    const code = `// Generated from ${entry.schema}; run npm run contracts:generate. Do not edit.\n${standalone(ajv, ajv.compile(schema))}\n`;
    const path = resolve(output, `${name}.cjs`);
    if (check) {
      if (!existsSync(path) || readFileSync(path, 'utf8') !== code) throw new Error(`Stale validator: ${name}; run npm run contracts:generate and review the generated diff`);
    } else writeFileSync(path, code);
  }
  console.log(`${check ? 'Verified' : 'Generated'} ${Object.keys(sources).length} standalone validators; runtime compilation is not required.`);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) compileValidators({ check: process.argv.includes('--check') });
