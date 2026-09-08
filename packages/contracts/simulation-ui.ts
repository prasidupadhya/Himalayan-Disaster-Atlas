import registry from './scenario-registry.json';
import type { ScenarioResult } from './scenario';

export type SimulationUiLevel = 1 | 2;
export type SimulationUiModel = 'network-path' | 'constant-celerity-pulse';

export interface SimulationParameterSpec {
  key: 'celerity' | 'release_volume' | 'release_duration';
  label: string;
  unit: 'm/s' | 'm3' | 's';
  minimum: number;
  maximum: number;
  step: number;
  defaultValue: number;
  explanation: string;
}

export const SIMULATION_PARAMETER_SPECS: readonly SimulationParameterSpec[] = [
  {
    key: 'celerity',
    label: 'Assumed signal celerity',
    unit: 'm/s',
    minimum: 0.1,
    maximum: 10,
    step: 0.1,
    defaultValue: 2,
    explanation: 'Controls translation speed along the source river network. This is an assumed signal speed, not measured water velocity.',
  },
  {
    key: 'release_volume',
    label: 'Hypothetical release volume',
    unit: 'm3',
    minimum: 0,
    maximum: 10_000_000,
    step: 1_000,
    defaultValue: 100_000,
    explanation: 'Defines the rectangular signal volume at each cross-section by assumption. It is not summed across reaches.',
  },
  {
    key: 'release_duration',
    label: 'Release duration',
    unit: 's',
    minimum: 60,
    maximum: 86_400,
    step: 60,
    defaultValue: 3_600,
    explanation: 'Defines how long the hypothetical rectangular release remains active. It is not a forecast duration.',
  },
] as const;

export interface SimulationUiParameters {
  celerity: number;
  release_volume: number;
  release_duration: number;
}

export interface SimulationUiControls {
  simulation_level: SimulationUiLevel;
  model: SimulationUiModel;
  parameters: SimulationUiParameters | null;
}

export interface SimulationUiValidation {
  valid: boolean;
  errors: Partial<Record<keyof SimulationUiParameters | 'model', string>>;
}

export interface InteractiveSimulationPathRow {
  reach_id: string;
  length_km: number;
  cumulative_length_km: number;
  entry_delay_s: number | null;
  exit_delay_s: number | null;
  pulse_end_at_exit_s: number | null;
}

export interface InteractiveSimulationRun {
  kind: 'interactive-simulation-run';
  evidence_type: 'modelled';
  label: 'MODELLED SCENARIO — NOT AN OFFICIAL FORECAST';
  simulation_level: SimulationUiLevel;
  model: { id: SimulationUiModel; version: '1.0.0' };
  model_class: 'network_approximation';
  calculation_basis: 'browser deterministic adapter over checksum-verified published source pathway';
  source_reach_id: string;
  basis_run_sha256: string;
  input_datasets: ScenarioResult['definition']['inputs'];
  assumptions: Array<{ id: string; version: '1.0.0'; statement: string }>;
  parameters: SimulationUiParameters | null;
  status: ScenarioResult['status'];
  termination: ScenarioResult['termination'];
  next_reach_id: string | null;
  path: InteractiveSimulationPathRow[];
  total_length_km: number;
  pulse_discharge_m3_s: number | null;
  volume_per_section_m3: number | null;
  footprint: null;
  depth_m: null;
  velocity_m_s: null;
  confidence_interval: null;
  exposure_status: 'unavailable_no_validated_footprint';
  validation: ScenarioResult['validation'];
  limitations: string[];
}

export interface SimulationComparisonRow {
  label: string;
  unit: string;
  a: number | null;
  b: number | null;
}

export interface SimulationComparison {
  compatible: boolean;
  reason: string | null;
  rows: SimulationComparisonRow[];
}

export function controlsForLevel(level: SimulationUiLevel, parameters?: Partial<SimulationUiParameters>): SimulationUiControls {
  if (level === 1) return { simulation_level: 1, model: 'network-path', parameters: null };
  const defaults = Object.fromEntries(SIMULATION_PARAMETER_SPECS.map(spec => [spec.key, spec.defaultValue])) as unknown as SimulationUiParameters;
  return { simulation_level: 2, model: 'constant-celerity-pulse', parameters: { ...defaults, ...parameters } };
}

export function validateSimulationControls(controls: SimulationUiControls): SimulationUiValidation {
  const expectedModel: SimulationUiModel = controls.simulation_level === 1 ? 'network-path' : 'constant-celerity-pulse';
  const errors: SimulationUiValidation['errors'] = {};
  if (controls.model !== expectedModel) errors.model = `Level ${controls.simulation_level} requires ${expectedModel}@1.0.0.`;
  if (controls.simulation_level === 1) {
    if (controls.parameters !== null) errors.model = 'Level 1 connectivity does not accept physical parameters.';
    return { valid: Object.keys(errors).length === 0, errors };
  }
  if (!controls.parameters) return { valid: false, errors: { model: 'Level 2 requires all three explicit parameters.' } };
  for (const spec of SIMULATION_PARAMETER_SPECS) {
    const value = controls.parameters[spec.key];
    if (!Number.isFinite(value)) errors[spec.key] = `${spec.label} must be a finite number.`;
    else if (value < spec.minimum || value > spec.maximum) errors[spec.key] = `${spec.label} must be between ${spec.minimum.toLocaleString('en-US')} and ${spec.maximum.toLocaleString('en-US')} ${spec.unit}.`;
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

function assumptionRows(model: SimulationUiModel) {
  const ids = registry.models[model] as string[];
  return ids.map(id => ({ id, version: '1.0.0' as const, statement: registry.assumptions[id as keyof typeof registry.assumptions] }));
}

function samePath(a: InteractiveSimulationRun, b: InteractiveSimulationRun) {
  return a.path.length === b.path.length && a.path.every((row, index) => row.reach_id === b.path[index].reach_id && Math.abs(row.length_km - b.path[index].length_km) <= 1e-9);
}

export function runInteractiveSimulation(basis: ScenarioResult, controls: SimulationUiControls): InteractiveSimulationRun {
  const validation = validateSimulationControls(controls);
  if (!validation.valid) throw new Error(Object.values(validation.errors)[0] ?? 'Invalid simulation controls.');
  if (!basis.path.length) throw new Error('Verified simulation basis has no pathway.');
  if (basis.footprint !== null || basis.evidence_type !== 'modelled') throw new Error('Simulation basis semantics are incompatible with the Feature 29 network workbench.');

  const pulse = controls.simulation_level === 2;
  const speed = controls.parameters?.celerity ?? null;
  const duration = controls.parameters?.release_duration ?? null;
  const volume = controls.parameters?.release_volume ?? null;
  let previousDistanceKm = 0;
  const path = basis.path.map(row => {
    if (!Number.isFinite(row.length_km) || row.length_km < 0 || !Number.isFinite(row.cumulative_length_km)) throw new Error('Simulation basis contains an invalid source reach length.');
    const entry = pulse ? previousDistanceKm * 1_000 / speed! : null;
    const exit = pulse ? row.cumulative_length_km * 1_000 / speed! : null;
    const pulseEnd = pulse ? exit! + duration! : null;
    previousDistanceKm = row.cumulative_length_km;
    if ([entry, exit, pulseEnd].some(value => value !== null && !Number.isFinite(value))) throw new Error('Simulation produced a nonfinite timing value.');
    return {
      reach_id: row.reach_id,
      length_km: row.length_km,
      cumulative_length_km: row.cumulative_length_km,
      entry_delay_s: entry,
      exit_delay_s: exit,
      pulse_end_at_exit_s: pulseEnd,
    };
  });
  const discharge = pulse ? volume! / duration! : null;
  if (discharge !== null && !Number.isFinite(discharge)) throw new Error('Simulation produced a nonfinite discharge.');
  return {
    kind: 'interactive-simulation-run',
    evidence_type: 'modelled',
    label: 'MODELLED SCENARIO — NOT AN OFFICIAL FORECAST',
    simulation_level: controls.simulation_level,
    model: { id: controls.model, version: '1.0.0' },
    model_class: 'network_approximation',
    calculation_basis: 'browser deterministic adapter over checksum-verified published source pathway',
    source_reach_id: basis.definition.source_reach_id,
    basis_run_sha256: basis.run_sha256,
    input_datasets: structuredClone(basis.definition.inputs),
    assumptions: assumptionRows(controls.model),
    parameters: controls.parameters ? { ...controls.parameters } : null,
    status: basis.status,
    termination: basis.termination,
    next_reach_id: basis.next_reach_id,
    path,
    total_length_km: basis.total_length_km,
    pulse_discharge_m3_s: discharge,
    volume_per_section_m3: pulse ? volume : null,
    footprint: null,
    depth_m: null,
    velocity_m_s: null,
    confidence_interval: null,
    exposure_status: 'unavailable_no_validated_footprint',
    validation: structuredClone(basis.validation),
    limitations: [...basis.limitations],
  };
}

export function compareInteractiveSimulations(a: InteractiveSimulationRun, b: InteractiveSimulationRun): SimulationComparison {
  if (a.model.id !== b.model.id || a.model.version !== b.model.version || a.simulation_level !== b.simulation_level) return { compatible: false, reason: 'Only runs from the same simulation level and model/version are comparable.', rows: [] };
  if (a.source_reach_id !== b.source_reach_id || a.basis_run_sha256 !== b.basis_run_sha256 || !samePath(a, b)) return { compatible: false, reason: 'Runs use a different source pathway or verified basis.', rows: [] };
  if (a.simulation_level === 1) return {
    compatible: true,
    reason: null,
    rows: [{ label: 'Source pathway length', unit: 'km', a: a.total_length_km, b: b.total_length_km }],
  };
  return {
    compatible: true,
    reason: null,
    rows: [
      { label: 'Assumed signal celerity', unit: 'm/s', a: a.parameters!.celerity, b: b.parameters!.celerity },
      { label: 'Hypothetical release volume', unit: 'm3', a: a.parameters!.release_volume, b: b.parameters!.release_volume },
      { label: 'Release duration', unit: 's', a: a.parameters!.release_duration, b: b.parameters!.release_duration },
      { label: 'Rectangular signal discharge', unit: 'm3/s', a: a.pulse_discharge_m3_s, b: b.pulse_discharge_m3_s },
      { label: 'Last retained reach exit delay', unit: 's', a: a.path.at(-1)?.exit_delay_s ?? null, b: b.path.at(-1)?.exit_delay_s ?? null },
      { label: 'Source pathway length', unit: 'km', a: a.total_length_km, b: b.total_length_km },
    ],
  };
}

export function simulationAssumptions(level: SimulationUiLevel) {
  return assumptionRows(level === 1 ? 'network-path' : 'constant-celerity-pulse');
}
