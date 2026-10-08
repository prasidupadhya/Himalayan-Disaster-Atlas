import { describe, expect, it } from 'vitest';
import { nearestReach } from '../../apps/web/lib/river-snap';

const reach = (id: string, coordinates: [number, number][]): GeoJSON.Feature => ({ type: 'Feature', id, properties: {}, geometry: { type: 'LineString', coordinates } });

describe('nearest reach', () => {
  const reaches = [reach('a', [[84, 28], [85, 28]]), reach('b', [[84.5, 28.5], [84.5, 29.5]])];
  it('snaps a named point to the closest segment and reports its distance', () => {
    const hit = nearestReach(reaches, 84.5, 28.1)!;
    expect(hit.id).toBe('a');
    expect(hit.metres).toBeGreaterThan(10_900);
    expect(hit.metres).toBeLessThan(11_300);
  });
  it('projects onto the segment interior rather than an endpoint', () => {
    expect(nearestReach(reaches, 84.5, 28.5)!.metres).toBeLessThan(1);
  });
  it('handles multi-line reaches and empty input', () => {
    const multi: GeoJSON.Feature = { type: 'Feature', id: 'm', properties: {}, geometry: { type: 'MultiLineString', coordinates: [[[80, 29], [80.1, 29]], [[86, 27], [86.1, 27]]] } };
    expect(nearestReach([multi], 86.05, 27.001)!.id).toBe('m');
    expect(nearestReach([], 84, 28)).toBeNull();
  });
});
