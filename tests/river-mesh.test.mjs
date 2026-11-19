import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { flatKm } from '../site/places.js';

const binary = readFileSync(new URL('../site/river/river-mesh.wasm', import.meta.url));

test('the mesh follows the source bend and scales distances to the release length', async () => {
  const { instance } = await WebAssembly.instantiate(binary);
  const m = instance.exports;
  const line = [[84, 28], [84.1, 28.01], [84.1, 28.01], [84.12, 28.09]];
  const input = m.input(line.length);
  new Float64Array(m.memory.buffer, input, line.length * 2).set(line.flat());
  const length = 23, count = m.prepare(length);
  assert.ok(count > line.length);
  const stations = new Float64Array(m.memory.buffer, m.stations(), 3 * count);
  assert.deepEqual([...stations.slice(0, 3)], [84, 28, 0]);
  assert.deepEqual([...stations.slice(-3, -1)], line.at(-1));
  assert.ok(Math.abs(stations.at(-1) - length) < 1e-10);
  const bendDistance = length * flatKm(line[0], line[1]) / (flatKm(line[0], line[1]) + flatKm(line[2], line[3]));
  const vertices = new Float32Array(m.memory.buffer, m.vertices(), count * 10);
  let foundBend = false;
  for (let i = 0; i < count; i++) {
    const [lon, lat, km] = stations.subarray(i * 3, i * 3 + 3);
    if (lon === line[1][0] && lat === line[1][1]) foundBend = Math.abs(km - bendDistance) < 1e-8;
    if (i) assert.ok(km > stations[(i - 1) * 3 + 2]);
    const banks = vertices.subarray(i * 10, i * 10 + 10);
    assert.ok(banks.every(Number.isFinite));
    assert.deepEqual([banks[4], banks[9]], [-1, 1]);
    assert.ok(Math.abs(Math.hypot(banks[0] - banks[5], banks[1] - banks[6]) / banks[2] - 230) < .01);
  }
  assert.ok(foundBend);
  assert.equal(m.prepare(NaN), 0);
  const duplicate = m.input(2);
  new Float64Array(m.memory.buffer, duplicate, 4).set([84, 28, 84, 28]);
  assert.equal(m.prepare(10), 0);
});
