import validateRequestGenerated from './generated/analyst-request.cjs';
import { compiledValidator } from './validation-errors';
import { buildRiverNetwork, traceDownstream, type DownstreamResult } from './downstream';
import { assessEvidenceClaim, retrieveEvidence, type Citation, type EvidenceCorpus } from './rag';
import { parseScenarioResult, type ScenarioResult } from './scenario';
import type { Dataset } from './index';

export const ANALYST_VERSION = 'atlas-analyst/1.0.0';
export const ANALYST_TOPICS = {
  rivers: { title: 'Rivers', query: 'NEXT_DOWN source limitations', aliases: ['rivers', 'river network', 'downstream trace'] },
  'glacial-lakes': { title: 'Glacial lakes', query: 'lake hazard limitations', aliases: ['glacial lakes', 'glacial lake inventory'] },
  'exposure-engine': { title: 'Exposure Engine', query: 'exposure assumptions limitations', aliases: ['exposure', 'exposure engine', 'exposure calculations'] },
  'water-change': { title: 'Water Change', query: 'water change limitations', aliases: ['water change'] },
  'time-machine': { title: 'Time Machine', query: 'time observations limitations', aliases: ['time machine'] },
  'hazard-graph': { title: 'Hazard Graph', query: 'relationship limitations', aliases: ['hazard graph'] },
  'scenario-engine': { title: 'Scenario Engine', query: 'scenario assumptions limitations', aliases: ['scenario engine', 'scenarios'] },
  'simulation-ui': { title: 'Simulation UI', query: 'simulation limitations', aliases: ['simulation ui', 'simulation workbench'] },
} as const;
export const ANALYST_SCENARIOS = ['scenario-network-40669746', 'scenario-pulse-40669746'] as const;
export const ANALYST_EXAMPLES = ['Explain water change.', 'What are the limitations of glacial lakes?', 'Trace downstream from HYRIV 40669746.', 'Summarize scenario scenario-pulse-40669746.'];
export interface AnalystRequest { schema_version: '1.0.0'; question: string; as_of: string }
export type AnalystPlan = { kind: 'methodology'; topic: keyof typeof ANALYST_TOPICS } | { kind: 'downstream'; reach_id: string } | { kind: 'scenario'; scenario_id: string } | { kind: 'unsupported'; reason: string };
const validateRequest = compiledValidator<AnalystRequest>(validateRequestGenerated);
export function parseAnalystRequest(value: unknown): AnalystRequest {
  if (!validateRequest(value) || !value.question.trim()) throw new Error('Provide one question of 1–500 characters and an explicit ISO as-of date.');
  return value;
}
export function planAnalystQuestion(question: string): AnalystPlan {
  const q = question.trim().toLowerCase().replace(/[.!?]+$/, '').replace(/\s+/g, ' ');
  // Entire-question matching prevents an extra instruction or second entity being ignored.
  const river = q.match(/^(?:trace downstream from|what lies downstream of) (?:hyriv )?([1-9]\d{0,11})$/);
  if (river) return { kind: 'downstream', reach_id: river[1] };
  const scenario = q.match(/^(?:summarize|summarise|explain) (?:the )?scenario (scenario-(?:network|pulse)-40669746)$/);
  if (scenario) return { kind: 'scenario', scenario_id: scenario[1] };
  const method = q.match(/^(?:explain|describe) (?:the )?(.+)$/) ?? q.match(/^how does (?:the )?(.+) work$/) ?? q.match(/^what (?:are|is) the (?:limitations|assumptions|method) (?:of|behind) (.+)$/);
  if (method) for (const [topic, definition] of Object.entries(ANALYST_TOPICS)) {
    if ((definition.aliases as readonly string[]).includes(method[1])) return { kind: 'methodology', topic: topic as keyof typeof ANALYST_TOPICS };
  }
  return { kind: 'unsupported', reason: 'This analyst supports the listed methodology questions, downstream traces from one exact HYRIV ID, and the two registered scenarios. It cannot establish local safety, forecast impacts, infer lake outlets, resolve river names, or answer an unsupported measurement. Use a complete supported question; no prior entity is assumed.' };
}
export interface AnalystSource {
  id: string; title: string; href: string; source: string; version: string; sha256: string;
  observation_date: string | null; publication_date: string | null; accessed_at: string | null;
  evidence: string; license: string | null; details: string[];
}
export interface AnalystClaim {
  kind: 'source_statement' | 'calculation' | 'modelled' | 'interpretation';
  text: string; value: number | string | null; unit: string | null; citation_ids: string[];
}
export interface AnalystAnswer {
  schema_version: '1.0.0'; engine: typeof ANALYST_VERSION; mode: 'deterministic-evidence'; request: AnalystRequest;
  status: 'answered' | 'qualified' | 'unsupported'; plan: AnalystPlan;
  summary: string; claims: AnalystClaim[]; sources: AnalystSource[]; limitations: string[];
  trace: DownstreamResult | null;
}
export interface AnalystInputs { corpus: EvidenceCorpus; rivers?: Dataset[]; scenario?: ScenarioResult }
function documentSource(c: Citation): AnalystSource {
  const d = c.document;
  return { id: c.id, title: `${d.title} — ${c.chunk.section}, lines ${c.chunk.start_line}–${c.chunk.end_line}`, href: d.snapshot_path,
    source: d.source_id, version: d.version, sha256: d.version, observation_date: null, publication_date: d.publication_date,
    accessed_at: d.accessed_at, evidence: 'Project documentation; source attribution is not independent verification', license: d.license,
    details: [`Document version date: ${d.version_date ?? 'UNKNOWN'}`, `Freshness: ${c.freshness}`, ...d.inputs.map(i => `${i.dataset_id}@${i.dataset_version}; manifest SHA-256 ${i.sha256}`)] };
}

/** Only verified inputs may cross this boundary. Every numerical response is computed here,
 * never extracted from model prose or from matching documentation keywords. */
export function answerAnalyst(value: unknown, inputs: AnalystInputs): AnalystAnswer {
  const request = parseAnalystRequest(value), plan = planAnalystQuestion(request.question);
  const answer: AnalystAnswer = { schema_version: '1.0.0', engine: ANALYST_VERSION, mode: 'deterministic-evidence', request, plan,
    status: 'unsupported', summary: '', claims: [], sources: [], limitations: [], trace: null };
  if (plan.kind === 'unsupported') { answer.summary = plan.reason; return answer; }
  const topic = plan.kind === 'methodology' ? plan.topic : plan.kind === 'downstream' ? 'rivers' : 'scenario-engine';
  const retrieval = retrieveEvidence(inputs.corpus, ANALYST_TOPICS[topic].query, { asOf: request.as_of, limit: 12, filters: { document: topic } });
  // Filter to the intended document before selecting excerpts; unrelated topic overlap is not evidence.
  const candidates = retrieval.citations.filter(c => c.document.id === topic && !/^#+[^\n]+$/.test(c.chunk.text));
  if (!candidates.length) {
    answer.summary = 'The approved corpus has no eligible evidence for this operation. Missing or outdated evidence is not replaced with model memory.';
    return answer;
  }
  const conflicts = retrieval.conflicts.filter(g => g.citations.some(c => c.document.id === topic));
  if (conflicts.length) {
    answer.status = 'qualified'; answer.summary = 'Reviewed source statements conflict. No single conclusion or calculation is presented; inspect all alternatives.';
    const alternatives = [...new Map(conflicts.flatMap(g => g.citations).map(c => [c.id, c])).values()];
    answer.sources = alternatives.map(documentSource);
    answer.claims = alternatives.map(c => ({ kind: 'source_statement', text: c.chunk.text, value: null, unit: null, citation_ids: [c.id] }));
    answer.limitations = ['Conflicting statements are quoted for review, not endorsed as a resolved fact.'];
    return answer;
  }
  const selected = candidates.filter(c => assessEvidenceClaim(retrieval, { kind: 'source_statement', text: c.chunk.text, citation_ids: [c.id] }).status === 'source_statement').slice(0, plan.kind === 'methodology' ? 2 : 1);
  if (!selected.length) { answer.summary = 'Evidence failed the grounding gate. No supported answer is available.'; return answer; }
  answer.sources = selected.map(documentSource);
  answer.limitations = ['Documentation freshness may be UNKNOWN. Lexical retrieval cannot detect every contradiction in prose.', 'Interpretation of local hazard, safety or future impact is UNKNOWN.'];
  if (plan.kind === 'methodology') {
    answer.status = 'qualified'; answer.summary = `The Atlas documentation explains ${ANALYST_TOPICS[topic].title} as follows. These exact excerpts may not cover every aspect of the question.`;
    answer.claims = selected.map(c => ({ kind: 'source_statement', text: c.chunk.text, value: null, unit: null, citation_ids: [c.id] }));
    return answer;
  }
  if (plan.kind === 'downstream') {
    if (!inputs.rivers) throw new Error('Verified river partitions are required.');
    const network = buildRiverNetwork(inputs.rivers);
    if (!network.reaches.has(plan.reach_id)) { answer.summary = `HYRIV ${plan.reach_id} is not in the retained network. No similarly named or nearby reach was substituted.`; return answer; }
    if (inputs.rivers.some(d => d.metadata.stale_after && Date.parse(d.metadata.stale_after) <= Date.parse(request.as_of))) {
      answer.summary = 'The river inputs have passed their review deadline. A current analytical answer is unavailable.'; return answer;
    }
    const trace = traceDownstream(network, plan.reach_id);
    answer.trace = trace; answer.status = 'answered';
    const ids = inputs.rivers.map(d => {
      const m = d.metadata, id = `${m.dataset_id}@${m.dataset_version}`;
      answer.sources.push({ id, title: m.dataset_name, href: `/data/${m.dataset_id}/${m.dataset_version}/manifest.json`, source: m.source,
        version: m.dataset_version, sha256: m.artifact.sha256, observation_date: m.observation_date, publication_date: m.publication_date,
        accessed_at: m.retrieval_date, license: m.license, evidence: 'Source-derived hydrographic network, not a current-flow observation',
        details: [m.attribution, m.uncertainty, `Method: ${trace.method}; CRS: ${trace.crs}`, ...m.limitations] });
      return id;
    });
    answer.summary = `From HYRIV ${plan.reach_id}, the retained downstream chain contains ${trace.reach_ids.length} reaches and totals ${trace.total_length_km.toFixed(3)} km of source reach length.`;
    answer.claims = [
      { kind: 'calculation', text: 'Retained reach count (including the selected reach)', value: trace.reach_ids.length, unit: 'reaches', citation_ids: ids },
      { kind: 'calculation', text: 'Sum of complete source LENGTH_KM values', value: trace.total_length_km, unit: 'km', citation_ids: ids },
      { kind: 'calculation', text: trace.termination === 'coverage_boundary' ? 'First downstream reach outside this release' : 'No downstream pointer in the source; not necessarily an ocean mouth', value: trace.next_reach_id, unit: null, citation_ids: ids },
      { kind: 'interpretation', text: 'Flood footprint, travel time and affected assets', value: null, unit: null, citation_ids: ids },
    ];
    answer.limitations.push(...trace.limitations);
    return answer;
  }
  if (!inputs.scenario) throw new Error('A verified scenario result is required.');
  const result = parseScenarioResult(inputs.scenario);
  if (result.id !== plan.scenario_id) throw new Error('Scenario identity mismatch; no alternative run may be substituted.');
  const id = `${result.id}@${result.version}`;
  answer.sources.push({ id, title: `${result.id} — ${result.model.id}@${result.model.version}`, href: `/data/${result.id}/${result.version}/manifest.json`,
    source: 'Atlas Scenario Engine', version: result.version, sha256: result.run_sha256, observation_date: null, publication_date: null,
    accessed_at: null, license: null, evidence: result.label,
    details: [`SHA-256 identifies the exact request bytes; model ${result.model.id}@${result.model.version}`, `Calculated: ${result.calculated_at}`, `Validation: ${result.validation.status}`, ...result.definition.inputs.map(i => `${i.dataset_id}@${i.dataset_version}; SHA-256 ${i.sha256}; ${i.source}; ${i.license}`), ...result.assumptions.map(a => `${a.id}@${a.version}: ${a.statement}`)] });
  answer.status = 'qualified'; answer.summary = `${result.id} is a Level ${result.simulation_level} hypothetical network approximation. Its ${result.path.length} retained reaches total ${result.total_length_km.toFixed(3)} km. This is not a forecast.`;
  answer.claims = [
    { kind: 'modelled', text: 'Model pathway length (not a flood extent)', value: result.total_length_km, unit: 'km', citation_ids: [id] },
    { kind: 'modelled', text: 'Assumed pulse discharge (not a gauge measurement)', value: result.pulse_discharge_m3_s, unit: 'm³/s', citation_ids: [id] },
    { kind: 'modelled', text: 'Physical flood depth', value: result.depth_m, unit: 'm', citation_ids: [id] },
    { kind: 'interpretation', text: 'Local safety or confirmed damage', value: null, unit: null, citation_ids: [id] },
  ];
  answer.limitations.push(...result.limitations, ...result.assumptions.map(a => a.statement));
  if (result.next_reach_id) answer.limitations.push(`Partial coverage: the pathway stops before source reach ${result.next_reach_id}.`);
  return answer;
}

/** Fail closed on any altered prose, measurement, entity, citation, unit or omitted limitation.
 * The independent trusted request is essential: untrusted output cannot choose its own question. */
export function verifyAnalystAnswer(value: unknown, request: AnalystRequest, inputs: AnalystInputs): AnalystAnswer {
  const expected = answerAnalyst(request, inputs);
  if (JSON.stringify(value) !== JSON.stringify(expected)) throw new Error('Analyst answer differs from verified evidence and calculation output.');
  return expected;
}
