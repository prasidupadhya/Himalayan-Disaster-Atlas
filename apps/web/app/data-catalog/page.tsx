import contextTerrain from '../../public/data/asia-terrain-context/1.0.0/manifest.json';
import terrain from '../../public/data/nepal-terrain/1.0.0/manifest.json';
import { parseTerrainManifest } from '../../../../packages/contracts/terrain';
import country from '../../public/data/nepal-admin-country/2.0.1/manifest.json';
import provinces from '../../public/data/nepal-admin-provinces/2.0.1/manifest.json';
import districts from '../../public/data/nepal-admin-districts/2.0.1/manifest.json';
import localLevels from '../../public/data/nepal-admin-local-levels/2.0.1/manifest.json';
import { parseDataset } from '../../../../packages/contracts';
import { Evidence } from '../../components/evidence';
import mountains from '../../public/data/nepal-mountains/1.0.0/manifest.json';
import glaciers from '../../public/data/nepal-glaciers-east/1.0.0/manifest.json';
import rivers from '../../public/data/nepal-rivers-primary/1.0.0/manifest.json';
import glacialLakes from '../../public/data/nepal-transboundary-glacial-lakes/1.0.0/manifest.json';

export const metadata = { title: 'Data catalog' };
const manifests = [country, provinces, districts, localLevels];
const counts = [1, 7, 77, 775];

export default function CatalogPage() {
  return <div className="page prose"><p className="eyebrow">Data catalog</p><h1>Know what you’re exploring.</h1><p>COD-AB v02 is published as four immutable, checksum-verified presentation datasets. Level 3 contains 753 local-government units and 22 protected or special-area pieces.</p>
    <section className="catalog-entry"><h2>Nepal mountains and peaks</h2><p>747 GeoNames PK and MT records from the pinned 2026-09-07 Nepal dump. Source elevations are retained when present; missing elevations remain UNKNOWN.</p><p><a href="/data/nepal-mountains/1.0.0/manifest.json">Mountain manifest</a> · <a href="/data/nepal-mountains/1.0.0/features.geojson.gz">Compressed GeoJSON</a></p><Evidence metadata={parseDataset({ metadata: mountains, collection: { type: 'FeatureCollection', features: [] } }).metadata} /></section>
    <section className="catalog-entry"><h2>Nepal glaciers</h2><p>4,593 Nepal-intersecting RGI 7.0 glacier outlines are delivered in three geographic browser partitions. Each record retains its stable RGI/GLIMS ID, source area and individual outline date; these are inventory outlines rather than current 2026 margins.</p><p><a href="/data/nepal-glaciers-west/1.0.0/manifest.json">West manifest</a> · <a href="/data/nepal-glaciers-central/1.0.0/manifest.json">Central manifest</a> · <a href="/data/nepal-glaciers-east/1.0.0/manifest.json">East manifest</a></p><Evidence metadata={parseDataset({ metadata: glaciers, collection: { type: 'FeatureCollection', features: [] } }).metadata} /></section>
    <section className="catalog-entry"><h2>Nepal river network</h2><p>18,299 FAO Rivers 2026 / HydroRIVERS reaches preserve stable HYRIV_ID and NEXT_DOWN connectivity. Two browser partitions keep the display within GeoJSON safety budgets without breaking the logical network.</p><p><a href="/data/nepal-rivers-primary/1.0.0/manifest.json">Primary manifest</a> · <a href="/data/nepal-rivers-headwaters/1.0.0/manifest.json">Headwaters manifest</a></p><Evidence metadata={parseDataset({ metadata: rivers, collection: { type: 'FeatureCollection', features: [] } }).metadata} /></section>
    <section className="catalog-entry"><h2>Glacial Lake Observatory</h2><p>4,150 GLO v1.02 unique-lake records cover Nepal and transboundary catchments using published EPSG:4326 centroids and source 2017–2024 mapped extent/change attributes. The layer does not infer a specific glacier, river, or hazard status.</p><p><a href="/data/nepal-transboundary-glacial-lakes/1.0.0/manifest.json">Glacial-lake manifest</a> · <a href="/data/nepal-transboundary-glacial-lakes/1.0.0/features.geojson.gz">Compressed GeoJSON</a></p><Evidence metadata={parseDataset({ metadata: glacialLakes, collection: { type: 'FeatureCollection', features: [] } }).metadata} /></section>
    <section className="catalog-entry"><h2>Copernicus GLO-90 terrain</h2><p>Native 3 arc-second surface elevations retained offline. Web tiles use EPSG:3857 with EGM2008 heights in metres; hillshade and 3D are derived display products.</p><p><a href="/data/nepal-terrain/1.0.0/manifest.json">Terrain manifest</a> · <a href="/data/nepal-terrain/1.0.0/sources.json">Source inventory</a> · <a href="/data/nepal-terrain/1.0.0/qa.json">Validation report</a> · <a href="/data/nepal-terrain/1.0.0/LICENSE.txt">Licence notices</a></p><Evidence metadata={parseTerrainManifest(terrain).metadata} /></section>
    <section className="catalog-entry"><h2>Asia terrain overview</h2><p>A pinned Mapzen terrain snapshot fills the surrounding map. Context heights are display-only and are not used by the elevation inspector.</p><p><a href="/data/asia-terrain-context/1.0.0/manifest.json">Context manifest</a> · <a href="/data/asia-terrain-context/1.0.0/sources.json">Source inventory</a> · <a href="/data/asia-terrain-context/1.0.0/LICENSE.txt">Source licence notices</a></p><Evidence metadata={parseTerrainManifest(contextTerrain).metadata} /></section>
    <section className="catalog-entry"><h2>Downstream trace results</h2><p>Computed in your browser from both river partitions, with method version, ordered reach IDs, summed source length, termination reason and input hashes available as JSON. No new geographic dataset is published. <a href="/methodology/#downstream-method">Method and limits</a>.</p></section>
    {manifests.map((manifest, index) => {
      const dataset = parseDataset({ metadata: manifest, collection: { type: 'FeatureCollection', features: [] } });
      return <section className="catalog-entry" key={manifest.dataset_id}><h2>{manifest.dataset_name}</h2><p>{counts[index].toLocaleString('en-US')} boundary {counts[index] === 1 ? 'record' : 'records'} · OGC:CRS84 · topology-preserving display geometry</p><p><a href={`/data/${manifest.dataset_id}/2.0.1/manifest.json`}>Download manifest</a> · <a href={manifest.artifact.path}>Download compressed GeoJSON</a></p><Evidence metadata={dataset.metadata} /></section>;
    })}
  </div>;
}
