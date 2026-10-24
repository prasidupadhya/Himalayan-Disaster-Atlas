import { describe, expect, it } from 'vitest';
import { circle, floodPlaybackSeconds, haversineKm, headingAt, lineCoordinates, measure, pointAt, pulseAt, slice, type LonLat } from '../../apps/web/features/simulator/scene-3d';

// SYNTHETIC line: due east along the equator, about 111.2 km per degree.
const line = measure([[0, 0], [1, 0], [2, 0]]);

describe('3D scenario geometry', () => {
  it('measures and walks a line in great-circle km', () => {
    expect(line.length).toBeCloseTo(222.39, 1);
    expect(pointAt(line, line.length / 4)[0]).toBeCloseTo(0.5, 5);
    expect(pointAt(line, -5)).toEqual([0, 0]);
    expect(pointAt(line, 1e6)).toEqual([2, 0]);
  });

  it('slices a stretch with both cut points and keeps interior vertices', () => {
    const part = slice(line, 55.6, 166.8);
    expect(part).toHaveLength(3);
    expect(part[0][0]).toBeCloseTo(0.5, 3);
    expect(part[1]).toEqual([1, 0]);
    expect(part[2][0]).toBeCloseTo(1.5, 3);
    expect(slice(line, 30, 30)).toEqual([]);
  });

  it('points the camera along the direction of travel', () => {
    expect(headingAt(line, 100)).toBeCloseTo(90, 0);
    expect(headingAt(measure([[0, 0], [0, 1]]), 10)).toBeCloseTo(0, 0);
  });

  it('draws a circle at the requested radius', () => {
    const ring = circle([85, 28], 50);
    expect(ring[0]).toEqual(ring.at(-1));
    for (const p of ring.slice(0, -1)) expect(haversineKm([85, 28], p as LonLat)).toBeCloseTo(50, 3);
  });

  it('places the declared pulse by celerity and duration, clamped to the path', () => {
    expect(pulseAt(3600, 4, 3 * 3600, 306)).toEqual({ head: 14.4, tail: 0 });
    expect(pulseAt(5 * 3600, 4, 3 * 3600, 306)).toEqual({ head: 72, tail: 28.8 });
    expect(pulseAt(1e6, 4, 3600, 306)).toEqual({ head: 306, tail: 306 });
    expect(floodPlaybackSeconds([2, 4, 6], 3600, 306)).toBe(306 * 500 + 3600);
  });

  it('reads LineString and MultiLineString paths', () => {
    expect(lineCoordinates({ type: 'MultiLineString', coordinates: [[[0, 0], [1, 1]], [[1, 1], [2, 2]]] })).toHaveLength(4);
    expect(lineCoordinates({ type: 'Point', coordinates: [0, 0] })).toEqual([]);
  });
});
