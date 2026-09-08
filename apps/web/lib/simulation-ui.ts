import type { ScenarioResult } from '../../../packages/contracts/scenario';
import {
  runInteractiveSimulation,
  type InteractiveSimulationRun,
  type SimulationUiControls,
} from '../../../packages/contracts/simulation-ui';
import { loadScenario, type ScenarioSpatial } from './scenario';

export interface SimulationBasis {
  network: Awaited<ReturnType<typeof loadScenario>>;
  referencePulse: Awaited<ReturnType<typeof loadScenario>>;
}

function near(a: number | null, b: number | null) {
  if (a === null || b === null) return a === b;
  return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b));
}

function sameInputs(a: ScenarioResult, b: ScenarioResult) {
  return a.definition.inputs.length === b.definition.inputs.length && a.definition.inputs.every((input, index) => {
    const other = b.definition.inputs[index];
    return other && input.dataset_id === other.dataset_id && input.dataset_version === other.dataset_version && input.sha256 === other.sha256 && input.processing_version === other.processing_version;
  });
}

export async function loadSimulationBasis(signal?: AbortSignal): Promise<SimulationBasis> {
  const [network, referencePulse] = await Promise.all([
    loadScenario('scenario-network-40669746', signal),
    loadScenario('scenario-pulse-40669746', signal),
  ]);
  if (network.result.simulation_level !== 1 || referencePulse.result.simulation_level !== 2) throw new Error('Registered simulation levels are inconsistent.');
  if (network.result.definition.source_reach_id !== referencePulse.result.definition.source_reach_id || !sameInputs(network.result, referencePulse.result)) throw new Error('Registered simulation examples do not share the same verified source basis.');
  if (network.result.path.length !== referencePulse.result.path.length || network.result.path.some((row, index) => row.reach_id !== referencePulse.result.path[index].reach_id || !near(row.length_km, referencePulse.result.path[index].length_km) || !near(row.cumulative_length_km, referencePulse.result.path[index].cumulative_length_km))) throw new Error('Registered simulation pathways differ.');
  return { network, referencePulse };
}

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value !== null && typeof value === 'object') return `{${Object.entries(value).sort(([a], [b]) => a.localeCompare(b, 'en')).map(([key, entry]) => `${JSON.stringify(key)}:${canonical(entry)}`).join(',')}}`;
  return JSON.stringify(value);
}

async function sha256(value: unknown) {
  const bytes = new TextEncoder().encode(canonical(value));
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('');
}

export interface BrowserSimulationRun extends InteractiveSimulationRun {
  run_sha256: string;
  reference_reproduction: 'matched_published_level_2' | 'not_reference_parameters';
}

function matchesReference(run: InteractiveSimulationRun, reference: ScenarioResult) {
  if (run.simulation_level !== 2 || !run.parameters) return false;
  const params = reference.definition.parameters;
  if (run.parameters.celerity !== params.celerity?.value || run.parameters.release_volume !== params.release_volume?.value || run.parameters.release_duration !== params.release_duration?.value) return false;
  return run.path.length === reference.path.length && run.path.every((row, index) => {
    const expected = reference.path[index];
    return row.reach_id === expected.reach_id && near(row.entry_delay_s, expected.entry_delay_s) && near(row.exit_delay_s, expected.exit_delay_s) && near(row.pulse_end_at_exit_s, expected.pulse_end_at_exit_s);
  }) && near(run.pulse_discharge_m3_s, reference.pulse_discharge_m3_s);
}

export async function runBrowserSimulation(basis: SimulationBasis, controls: SimulationUiControls): Promise<BrowserSimulationRun> {
  const core = runInteractiveSimulation(basis.network.result, controls);
  const run_sha256 = await sha256({
    simulation_level: core.simulation_level,
    model: core.model,
    source_reach_id: core.source_reach_id,
    basis_run_sha256: core.basis_run_sha256,
    parameters: core.parameters,
    path: core.path,
  });
  return { ...core, run_sha256, reference_reproduction: matchesReference(core, basis.referencePulse.result) ? 'matched_published_level_2' : 'not_reference_parameters' };
}

export function simulationSpatial(basis: SimulationBasis): ScenarioSpatial {
  return basis.network.spatial;
}
