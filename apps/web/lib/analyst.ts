import { answerAnalyst, parseAnalystRequest, planAnalystQuestion, type AnalystAnswer, type AnalystInputs } from '../../../packages/contracts/analyst';
import { loadEvidence } from './rag';
import { loadDataset, RIVER_MANIFESTS } from './datasets';
import { loadScenario } from './scenario';
import primary from '../public/data/nepal-rivers-primary/1.0.0/manifest.json';
import headwaters from '../public/data/nepal-rivers-headwaters/1.0.0/manifest.json';

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value !== null && typeof value === 'object') return `{${Object.entries(value).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`).join(',')}}`;
  return JSON.stringify(value);
}
/** Explicit allowlist: never use a question or retrieved text as a URL or executable command. */
export async function askAnalyst(question: string, signal?: AbortSignal): Promise<AnalystAnswer> {
  const request = parseAnalystRequest({ schema_version: '1.0.0', question, as_of: new Date().toISOString() });
  const plan = planAnalystQuestion(question);
  // Unsupported requests do not download the corpus or geographic inventories.
  if (plan.kind === 'unsupported') return answerAnalyst(request, { corpus: { schema_version: '1.0.0', kind: 'evidence-corpus', version: '1.0.0', documents: [], chunks: [] } });
  const inputs: AnalystInputs = { corpus: await loadEvidence(signal) };
  if (plan.kind === 'downstream') {
    inputs.rivers = await Promise.all(RIVER_MANIFESTS.map(path => loadDataset(path, signal)));
    for (const [i, dataset] of inputs.rivers.entries()) {
      if (canonical(dataset.metadata) !== canonical([primary, headwaters][i])) throw new Error('Analyst river manifest differs from the approved release.');
    }
  } else if (plan.kind === 'scenario') {
    inputs.scenario = (await loadScenario(plan.scenario_id, signal)).result;
  }
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
  return answerAnalyst(request, inputs);
}
