import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import { parseScenarioDefinition, parseScenarioResult } from '../../packages/contracts/scenario';
const result = JSON.parse(gunzipSync(readFileSync('data/releases/scenario-pulse-40669746/1.0.0/result.json.gz')).toString());
describe('scenario contracts', () => {
  it('retains hypothetical evidence, complete provenance and partial coverage', () => {
    const r = parseScenarioResult(result);
    expect(r.path).toHaveLength(180); expect(r.status).toBe('partial_coverage');
    expect(r.next_reach_id).toBe('40768704'); expect(r.depth_m).toBeNull();
    expect(r.definition.inputs).toHaveLength(2); expect(r.assumptions).toHaveLength(5);
  });
  it('rejects impossible units, missing assumptions, unsupported adapters and invented depths', () => {
    for (const change of ['units', 'zero-speed', 'missing', 'adapter', 'depth', 'label', 'timing', 'duplicate']) {
      const bad = structuredClone(result);
      if (change === 'units') bad.definition.parameters.celerity.unit = 'km/h';
      if (change === 'zero-speed') bad.definition.parameters.celerity.value = 0;
      if (change === 'missing') bad.definition.assumptions = [];
      if (change === 'adapter') bad.definition.model.id = 'hydraulic-flood';
      if (change === 'depth') bad.depth_m = 2;
      if (change === 'label') bad.evidence_type = 'observed';
      if (change === 'timing') bad.path[0].exit_delay_s += 1;
      if (change === 'duplicate') bad.path[1].reach_id = bad.path[0].reach_id;
      expect(() => parseScenarioResult(bad)).toThrow();
    }
    const noParameters = structuredClone(result.definition); noParameters.parameters = {};
    expect(() => parseScenarioDefinition(noParameters)).toThrow();
  });
});
