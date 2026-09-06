import { expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import type { Map } from 'maplibre-gl';
import { escapeAttribution, mountDataset } from '../../apps/web/lib/map-layers';
import { parseDataset } from '../../packages/contracts';
import metadata from '../../data/releases/foundation-sample/1.0.0/manifest.json';
it('isolates dataset sources and removes layers before their source', () => {
  const source = new Set<string>(); const layers = new Set<string>(); const removed: string[] = [];
  const map = {
    getSource: (id: string) => source.has(id), addSource: (id: string) => source.add(id),
    addLayer: ({ id }: { id: string }) => layers.add(id), getLayer: (id: string) => layers.has(id),
    removeLayer: (id: string) => { layers.delete(id); removed.push(id); },
    removeSource: (id: string) => { expect(layers.size).toBe(0); source.delete(id); removed.push('source'); },
    setLayoutProperty: vi.fn(),
  };
  const dataset = parseDataset({ metadata, collection: JSON.parse(readFileSync('data/releases/foundation-sample/1.0.0/features.geojson', 'utf8')) });
  const mounted = mountDataset(map as unknown as Map, dataset);
  expect(() => mountDataset(map as unknown as Map, dataset)).toThrow(/already mounted/);
  mounted.setVisible(false);
  expect(map.setLayoutProperty.mock.calls.every(call => call[2] === 'none')).toBe(true);
  mounted.dispose(); mounted.dispose();
  expect(removed.at(-1)).toBe('source'); expect(source.size).toBe(0);
});

it('escapes untrusted attribution before passing it to the map HTML control', () => {
  expect(escapeAttribution('<img src=x onerror=alert(1)> & source')).toBe('&lt;img src=x onerror=alert(1)&gt; &amp; source');
});
