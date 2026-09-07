import { afterEach, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { loadDataset, SAMPLE_MANIFEST, UnavailableError, MAX_GEOJSON_BYTES } from '../../apps/web/lib/datasets';
import metadata from '../../data/releases/foundation-sample/1.0.0/manifest.json';
import provinceMetadata from '../../data/releases/nepal-admin-provinces/2.0.1/manifest.json';
const raw = readFileSync('data/releases/foundation-sample/1.0.0/features.geojson', 'utf8');
afterEach(() => vi.unstubAllGlobals());
function mock(manifest: unknown = metadata, artifact: BodyInit = raw) {
  const fetcher = vi.fn().mockResolvedValueOnce(new Response(JSON.stringify(manifest))).mockResolvedValueOnce(new Response(artifact));
  vi.stubGlobal('fetch', fetcher);
  return fetcher;
}
it('loads only local pinned data and checks its checksum', async () => {
  const fetcher = mock();
  expect((await loadDataset(SAMPLE_MANIFEST)).collection.features).toHaveLength(3);
  expect(fetcher.mock.calls[1][0]).toBe(metadata.artifact.path);
});
it('verifies and decompresses a bounded administrative release', async () => {
  const compressed = readFileSync('data/releases/nepal-admin-provinces/2.0.1/features.geojson.gz');
  const fetcher = mock(provinceMetadata, compressed);
  const dataset = await loadDataset('/data/nepal-admin-provinces/2.0.1/manifest.json');
  expect(dataset.collection.features).toHaveLength(7);
  expect(dataset.collection.features.find(feature => feature.id === 'np01')?.properties.name).toBe('Koshi');
  expect(fetcher.mock.calls[1][0]).toBe(provinceMetadata.artifact.path);
});
it('rejects tampering even if the size matches', async () => {
  mock(metadata, raw.replace('point A', 'point X'));
  await expect(loadDataset(SAMPLE_MANIFEST)).rejects.toThrow(/checksum/);
});
it('never fetches an artifact from an unvalidated manifest', async () => {
  const manifest = structuredClone(metadata); manifest.artifact.path = 'https://example.com/private';
  const fetcher = mock(manifest);
  await expect(loadDataset(SAMPLE_MANIFEST)).rejects.toThrow();
  expect(fetcher).toHaveBeenCalledTimes(1);
});
it('enforces the streaming GeoJSON budget', async () => {
  const large = ' '.repeat(MAX_GEOJSON_BYTES + 1);
  const manifest = structuredClone(metadata);
  manifest.artifact.byte_size = large.length;
  manifest.artifact.sha256 = createHash('sha256').update(large).digest('hex');
  mock(manifest, large);
  await expect(loadDataset(SAMPLE_MANIFEST)).rejects.toThrow(/budget/);
});
it('distinguishes unavailable responses from corrupt datasets', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 404 })));
  await expect(loadDataset(SAMPLE_MANIFEST)).rejects.toBeInstanceOf(UnavailableError);
});
it('propagates cancellation to fetch', async () => {
  const controller = new AbortController(); controller.abort();
  const fetcher = vi.fn((_url, options) => Promise.reject(options.signal.reason));
  vi.stubGlobal('fetch', fetcher);
  await expect(loadDataset(SAMPLE_MANIFEST, controller.signal)).rejects.toThrow();
  expect(fetcher.mock.calls[0][1].signal).toBe(controller.signal);
});
