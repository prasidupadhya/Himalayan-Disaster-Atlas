import Ajv from 'ajv';
import ts from 'typescript';
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
    if (name !== 'live-runtime.cjs' && !Object.hasOwn(sources, name.replace(/\.cjs$/, ''))) throw new Error(`Unregistered generated validator: ${name}`);
  }
  for (const [name, entry] of Object.entries(sources)) {
    const ajv = new Ajv({ strict: true, allErrors: true, code: { source: true, lines: true } });
    if (entry.formats) addFormats(ajv);
    if (entry.common_schema) ajv.addSchema(JSON.parse(readFileSync(resolve(root, 'schemas/dataset.schema.json'), 'utf8')));
    for (const reference of entry.references ?? []) ajv.addSchema(JSON.parse(readFileSync(resolve(root, 'schemas', reference), 'utf8')));
    const schema = JSON.parse(readFileSync(resolve(root, 'schemas', entry.schema), 'utf8'));
    const code = `// Generated from ${entry.schema}; run npm run contracts:generate. Do not edit.\n${standalone(ajv, ajv.compile(schema))}\n`;
    const path = resolve(output, `${name}.cjs`);
    if (check) {
      if (!existsSync(path) || readFileSync(path, 'utf8') !== code) throw new Error(`Stale validator: ${name}; run npm run contracts:generate and review the generated diff`);
    } else writeFileSync(path, code);
  }
  // Node release checks execute the exact TypeScript semantics, compiled offline, with no runtime AJV compiler.
  const helpers = readFileSync(resolve(root, 'packages/contracts/validation-errors.ts'), 'utf8');
  const live = readFileSync(resolve(root, 'packages/contracts/live.ts'), 'utf8')
    .replace(/import \{ compiledValidator, validationErrors \} from '.\/validation-errors';\n/, '')
    .replace("'../../licensing/live-sources.json'", "'../../../licensing/live-sources.json'")
    .replaceAll("'./generated/", "'./").replace("'./live-policy.json'", "'../live-policy.json'");
  const runtime = '// Generated from live.ts and validation-errors.ts; do not edit.\n' + ts.transpileModule(helpers + '\n' + live, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
  const runtimePath = resolve(output, 'live-runtime.cjs');
  if (check) {
    if (!existsSync(runtimePath) || readFileSync(runtimePath, 'utf8') !== runtime) throw new Error('Stale Node live runtime; run npm run contracts:generate');
  } else writeFileSync(runtimePath, runtime);
  console.log(`${check ? 'Verified' : 'Generated'} ${Object.keys(sources).length} standalone validators; runtime compilation is not required.`);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) compileValidators({ check: process.argv.includes('--check') });
