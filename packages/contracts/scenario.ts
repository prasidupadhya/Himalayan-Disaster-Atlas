import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import requestSchema from '../../schemas/scenario-request.schema.json';
import resultSchema from '../../schemas/scenario-result.schema.json';
import registry from './scenario-registry.json';
export type ScenarioModel = 'network-path' | 'constant-celerity-pulse';
export interface ScenarioDefinition {
  schema_version: '1.0.0'; kind: 'scenario-definition'; id: string; version: '1.0.0'; is_fixture: boolean;
  model: { id: ScenarioModel; version: '1.0.0' }; simulation_level: 1 | 2; source_reach_id: string;
  inputs: { dataset_id: string; dataset_version: string; sha256: string; processing_version: string; source: string; license: string; observation_date: string | null }[];
  assumptions: string[]; parameters: Record<string, { value: number; unit: string }>;
}
export interface ScenarioResult {
  schema_version: '1.0.0'; kind: 'scenario-result'; id: string; version: '1.0.0'; status: 'complete' | 'partial_coverage';
  evidence_type: 'modelled'; label: 'HYPOTHETICAL MODELLED SCENARIO — NOT A FORECAST'; simulation_level: 1 | 2; model_class: 'network_approximation'; model: ScenarioDefinition['model'];
  is_fixture: boolean; run_sha256: string; calculated_at: string; processing_version: 'scenario-runner/1.0.0'; runtime: { python: string }; definition: ScenarioDefinition;
  assumptions: { id: string; version: '1.0.0'; statement: string }[]; crs: 'OGC:CRS84'; vertical_datum: null;
  spatial_resolution: string; time_basis: string;
  path: { reach_id: string; length_km: number; cumulative_length_km: number; entry_delay_s: number | null; exit_delay_s: number | null; pulse_end_at_exit_s: number | null }[];
  termination: 'source_outlet' | 'coverage_boundary'; next_reach_id: string | null; total_length_km: number;
  pulse_discharge_m3_s: number | null; volume_per_section_m3: number | null; footprint: null; depth_m: null; velocity_m_s: null; confidence_interval: null;
  validation: { status: 'synthetic_analytic_cases_only'; real_event_validation: false }; limitations: string[];
}
const ajv = new Ajv({ allErrors: true, strict: true }); addFormats(ajv);
const requestValidator = ajv.compile<ScenarioDefinition>(requestSchema);
const resultValidator = ajv.compile<ScenarioResult>(resultSchema);
export function parseScenarioDefinition(value: unknown): ScenarioDefinition {
  if (!requestValidator(value)) throw new Error(`Invalid scenario definition: ${ajv.errorsText(requestValidator.errors)}`);
  const model = value.model.id;
  if (value.simulation_level !== (model === 'network-path' ? 1 : 2) || JSON.stringify(value.assumptions) !== JSON.stringify(registry.models[model])) throw new Error('Model/level or assumption registry mismatch');
  const parameters = Object.keys(value.parameters).sort().join(',');
  if (parameters !== (model === 'network-path' ? '' : 'celerity,release_duration,release_volume')) throw new Error('Unsupported/missing scenario parameters');
  if (new Set(value.inputs.map(i => `${i.dataset_id}@${i.dataset_version}`)).size !== value.inputs.length) throw new Error('Duplicate scenario inputs');
  return value;
}
export function parseScenarioResult(value: unknown): ScenarioResult {
  if (!resultValidator(value)) throw new Error(`Invalid scenario result: ${ajv.errorsText(resultValidator.errors)}`);
  const d = parseScenarioDefinition(value.definition);
  if (value.id !== d.id || value.version !== d.version || value.is_fixture !== d.is_fixture || value.simulation_level !== d.simulation_level || JSON.stringify(value.model) !== JSON.stringify(d.model)) throw new Error('Scenario definition/result identity mismatch');
  if (value.path[0].reach_id !== d.source_reach_id || new Set(value.path.map(p => p.reach_id)).size !== value.path.length) throw new Error('Scenario path start or duplicate reach mismatch');
  if (value.assumptions.length !== d.assumptions.length || value.assumptions.some((a, i) => a.id !== d.assumptions[i] || a.statement !== registry.assumptions[a.id as keyof typeof registry.assumptions])) throw new Error('Scenario assumption statements differ from registry');
  const partial = value.next_reach_id !== null;
  if (value.status !== (partial ? 'partial_coverage' : 'complete') || value.termination !== (partial ? 'coverage_boundary' : 'source_outlet')) throw new Error('Scenario coverage semantics mismatch');
  let distance = 0;
  const near = (a: number | null, b: number | null) => a === null || b === null ? a === b : Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b));
  for (const row of value.path) {
    const before = distance; distance += row.length_km;
    if (!near(row.cumulative_length_km, distance)) throw new Error('Scenario cumulative distance mismatch');
    const pulse = d.model.id === 'constant-celerity-pulse', speed = d.parameters.celerity?.value, duration = d.parameters.release_duration?.value;
    if (!near(row.entry_delay_s, pulse ? before * 1000 / speed : null) || !near(row.exit_delay_s, pulse ? distance * 1000 / speed : null) || !near(row.pulse_end_at_exit_s, pulse ? distance * 1000 / speed + duration : null)) throw new Error('Scenario translation does not reproduce from parameters');
  }
  if (!near(value.total_length_km, distance) || !near(value.volume_per_section_m3, d.simulation_level === 2 ? d.parameters.release_volume.value : null) || !near(value.pulse_discharge_m3_s, d.simulation_level === 2 ? d.parameters.release_volume.value / d.parameters.release_duration.value : null)) throw new Error('Scenario distance/discharge/volume mismatch');
  return value;
}
