import { expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import type { Map } from 'maplibre-gl';
import { gunzipSync } from 'node:zlib';
import { escapeAttribution, mountAdministrativeDataset, mountDataset } from '../../apps/web/lib/map-layers';
import { parseDataset } from '../../packages/contracts';
import metadata from '../../data/releases/foundation-sample/1.0.0/manifest.json';
import provinceMetadata from '../../data/releases/nepal-admin-provinces/2.0.1/manifest.json';
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

it('mounts administrative levels with visibility and stable selection state', () => {
  const sources = new Set<string>(); const layers = new Set<string>();
  const map = {
    getSource: (id: string) => sources.has(id), addSource: (id: string) => sources.add(id),
    addLayer: ({ id }: { id: string }) => layers.add(id), getLayer: (id: string) => layers.has(id),
    removeLayer: (id: string) => layers.delete(id), removeSource: (id: string) => sources.delete(id),
    setLayoutProperty: vi.fn(), setFeatureState: vi.fn(),
  };
  const collection = JSON.parse(gunzipSync(readFileSync('data/releases/nepal-admin-provinces/2.0.1/features.geojson.gz')).toString());
  const dataset = parseDataset({ metadata: provinceMetadata, collection });
  const mounted = mountAdministrativeDataset(map as unknown as Map, dataset);
  expect(mounted.level).toBe(1);
  mounted.setVisible(false);
  mounted.setSelected('np01');
  expect(map.setLayoutProperty).toHaveBeenCalledTimes(2);
  expect(map.setFeatureState).toHaveBeenCalledWith({ source: mounted.source, id: 'np01' }, { selected: true });
  mounted.dispose();
  expect(sources.size).toBe(0);
});
