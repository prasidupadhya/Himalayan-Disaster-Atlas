import { gunzipSync } from 'node:zlib';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseScenarioResult, type ScenarioResult } from '../../packages/contracts/scenario';
import {
  compareInteractiveSimulations,
  controlsForLevel,
  runInteractiveSimulation,
  SIMULATION_PARAMETER_SPECS,
  validateSimulationControls,
} from '../../packages/contracts/simulation-ui';

const load = (id: string): ScenarioResult => parseScenarioResult(JSON.parse(gunzipSync(readFileSync(`data/releases/${id}/1.0.0/result.json.gz`)).toString()));
const network = load('scenario-network-40669746');
const publishedPulse = load('scenario-pulse-40669746');

describe('simulation UI semantics', () => {
  it('publishes explicit parameter units/ranges and rejects invalid values before execution', () => {
    expect(SIMULATION_PARAMETER_SPECS.map(spec => [spec.key, spec.unit, spec.minimum, spec.maximum])).toEqual([
      ['celerity', 'm/s', 0.1, 10],
      ['release_volume', 'm3', 0, 10_000_000],
      ['release_duration', 's', 60, 86_400],
    ]);
    expect(validateSimulationControls(controlsForLevel(2, { celerity: 0 })).valid).toBe(false);
    expect(validateSimulationControls(controlsForLevel(2, { release_volume: -1 })).valid).toBe(false);
    expect(validateSimulationControls(controlsForLevel(2, { release_duration: 86_401 })).valid).toBe(false);
    expect(validateSimulationControls(controlsForLevel(2, { celerity: 10, release_volume: 0, release_duration: 60 })).valid).toBe(true);
  });

  it('reproduces the published Level 2 equations without inventing a footprint or exposure', () => {
    const run = runInteractiveSimulation(network, controlsForLevel(2));
    expect(run.path).toHaveLength(publishedPulse.path.length);
    expect(run.path.at(-1)?.exit_delay_s).toBeCloseTo(publishedPulse.path.at(-1)!.exit_delay_s!, 8);
    expect(run.pulse_discharge_m3_s).toBeCloseTo(publishedPulse.pulse_discharge_m3_s!, 12);
    expect(run.footprint).toBeNull();
    expect(run.depth_m).toBeNull();
    expect(run.exposure_status).toBe('unavailable_no_validated_footprint');
    expect(run.label).toBe('MODELLED SCENARIO — NOT AN OFFICIAL FORECAST');
  });

  it('preserves a real zero release as a model input rather than relabelling it zero hazard', () => {
    const run = runInteractiveSimulation(network, controlsForLevel(2, { release_volume: 0 }));
    expect(run.pulse_discharge_m3_s).toBe(0);
    expect(run.volume_per_section_m3).toBe(0);
    expect(run.limitations.join(' ')).toMatch(/Zero hypothetical release is not evidence of zero hazard/i);
  });

  it('compares only runs with the same model/version and source pathway', () => {
    const a = runInteractiveSimulation(network, controlsForLevel(2, { celerity: 2 }));
    const b = runInteractiveSimulation(network, controlsForLevel(2, { celerity: 4 }));
    const comparison = compareInteractiveSimulations(a, b);
    expect(comparison.compatible).toBe(true);
    expect(comparison.rows.find(row => row.label === 'Assumed signal celerity')).toMatchObject({ a: 2, b: 4, unit: 'm/s' });
    expect(compareInteractiveSimulations(a, runInteractiveSimulation(network, controlsForLevel(1))).compatible).toBe(false);
  });
});
