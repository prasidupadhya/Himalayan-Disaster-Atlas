import { describe, expect, it } from 'vitest';
import { buildRoute, contains, districtSequence, pointIndex, toArea, whereAt, type Area } from '../../apps/web/features/simulator/route';
import { measure } from '../../apps/web/features/simulator/scene-3d';

// SYNTHETIC geography: two square "districts" side by side inside one "province" and one "country".
const square = (name: string, pcode: string, w: number, e: number, parent = 'SYNTHETIC Province'): Area =>
  toArea({ type: 'Feature', properties: { name, pcode, parent_name: parent }, geometry: { type: 'Polygon', coordinates: [[[w, 0], [e, 0], [e, 1], [w, 1], [w, 0]]] } })!;
const country = square('SYNTHETIC Country', 'C', 0, 2);
const province = square('SYNTHETIC Province', 'P1', 0, 2);
const west = square('SYNTHETIC West', 'D1', 0, 1), east = square('SYNTHETIC East', 'D2', 1, 2);

describe('scenario route lookups', () => {
  it('tests points against polygons with holes', () => {
    const holed = toArea({ type: 'Feature', properties: { name: 'H' }, geometry: { type: 'Polygon', coordinates: [[[0, 0], [4, 0], [4, 4], [0, 4], [0, 0]], [[1, 1], [3, 1], [3, 3], [1, 3], [1, 1]]] } })!;
    expect(contains(holed, [0.5, 0.5])).toBe(true);
    expect(contains(holed, [2, 2])).toBe(false);
    expect(contains(holed, [5, 5])).toBe(false);
  });

  it('finds the nearest named point within a distance', () => {
    const nearest = pointIndex([{ name: 'A', coordinates: [85, 28] }, { name: 'B', coordinates: [85.1, 28] }]);
    expect(nearest([85.01, 28], 5)?.point.name).toBe('A');
    expect(nearest([86, 28], 5)).toBeNull();
  });

  it('keeps a path that follows a district boundary together instead of flickering between the two districts', () => {
    const unit = (district: string) => ({ province: 'P', provinceCode: 'P1', district, local: null, inNepal: true });
    const stretches = [[0, 40, 'A'], [40, 41, 'B'], [41, 43, 'A'], [43, 44, 'B'], [44, 46, 'A'], [46, 90, 'C']].map(([f, t, d]) => ({ fromKm: f as number, toKm: t as number, unit: unit(d as string) }));
    const seq = districtSequence({ stretches, rivers: [], places: [], start: stretches[0].unit, end: stretches.at(-1)!.unit, leavesNepalKm: null, pathKm: 90 });
    expect(seq.map(d => [d.district, d.boundary])).toEqual([['A / B', true], ['C', false]]);
    expect(seq[0].toKm).toBe(46);
  });

  it('walks a path through districts, names a river once it holds, lists nearby places and where it leaves the country', () => {
    // East along latitude 0.5 from inside the west district, across the east one, and out of the country.
    const line = measure([[0.2, 0.5], [2.4, 0.5]]);
    const rivers = Array.from({ length: 30 }, (_, i) => ({ name: 'SYNTHETIC Khola', coordinates: [0.25 + i * 0.03, 0.505] as [number, number] }));
    const places = [{ name: 'SYNTHETIC Town', coordinates: [1.5, 0.52] as [number, number], kind: 'town' }, { name: 'SYNTHETIC Far Village', coordinates: [1.5, 0.6] as [number, number], kind: 'village' }];
    const route = buildRoute(line, 245, { country: [country], provinces: [province], districts: [west, east], locals: [], rivers, places });
    expect(route.start).toMatchObject({ district: 'SYNTHETIC West', province: 'SYNTHETIC Province', inNepal: true });
    expect(route.end).toMatchObject({ district: null, inNepal: false });
    expect(districtSequence(route).map(d => d.district)).toEqual(['SYNTHETIC West', 'SYNTHETIC East', null]);
    expect(route.leavesNepalKm).toBeGreaterThan(195);
    expect(route.leavesNepalKm).toBeLessThan(205);
    expect(route.rivers.map(r => r.name)).toEqual(['SYNTHETIC Khola']);
    expect(route.places.map(p => p.name)).toEqual(['SYNTHETIC Town']);
    expect(whereAt(route, 150).stretch?.unit.district).toBe('SYNTHETIC East');
    expect(whereAt(route, 145).place?.name).toBe('SYNTHETIC Town');
  });
});
