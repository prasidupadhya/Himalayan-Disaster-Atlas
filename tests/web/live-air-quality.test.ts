import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import cases from '../fixtures/air-quality-cases.json';
import { assertAirQualityPublicDisabled, parseAirQualityRelease } from '../../packages/contracts/live-air-quality';
const r=spawnSync('.venv/bin/python',['-c','import json\nfrom tests.python.test_live_air_quality import fixture\nprint(json.dumps(fixture()))'],{encoding:'utf8'});
if(r.status!==0)throw new Error(r.stderr);
const original=JSON.parse(r.stdout);
for(const item of cases)it(`air quality parity: ${item.name}`,()=>{
  const value=structuredClone(original);let parent=value;for(const key of item.path.slice(0,-1))parent=parent[key];parent[item.path.at(-1)!]=item.value;
  if(item.valid)expect(()=>parseAirQualityRelease(value)).not.toThrow();else expect(()=>parseAirQualityRelease(value)).toThrow();
});
it('source zero stays zero and AQI stays UNKNOWN with all six loss outputs null',()=>{
  const value=parseAirQualityRelease(original);expect(value.snapshot.records[0].measurements[0].value).toBe(0);expect(value.aqi.value).toBeNull();expect(Object.values(value.snapshot.unsupported_outputs).every(v=>v===null)).toBe(true);
});
it('public policy has no enable switch, empty provider allowlist and manual actions secret only',()=>{
  expect(()=>assertAirQualityPublicDisabled()).not.toThrow();const workflow=readFileSync('.github/workflows/live-air-quality.yml','utf8');expect(workflow).toContain('secrets.OPENAQ_API_KEY');expect(workflow).not.toMatch(/\bschedule:|\bcron:|pull_request_target|contents: write/);
});
