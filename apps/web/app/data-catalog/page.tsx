import country from '../../public/data/nepal-admin-country/2.0.0/manifest.json';
import provinces from '../../public/data/nepal-admin-provinces/2.0.0/manifest.json';
import districts from '../../public/data/nepal-admin-districts/2.0.0/manifest.json';
import localLevels from '../../public/data/nepal-admin-local-levels/2.0.0/manifest.json';
import { parseDataset } from '../../../../packages/contracts';
import { Evidence } from '../../components/evidence';

export const metadata = { title: 'Data catalog' };
const manifests = [country, provinces, districts, localLevels];
const counts = [1, 7, 77, 775];

export default function CatalogPage() {
  return <div className="page prose"><p className="eyebrow">Data catalog</p><h1>Know what you’re exploring.</h1><p>COD-AB v02 is published as four immutable, checksum-verified presentation datasets. Level 3 contains 753 local-government units and 22 protected or special-area pieces.</p>
    {manifests.map((manifest, index) => {
      const dataset = parseDataset({ metadata: manifest, collection: { type: 'FeatureCollection', features: [] } });
      return <section className="catalog-entry" key={manifest.dataset_id}><h2>{manifest.dataset_name}</h2><p>{counts[index].toLocaleString('en-US')} boundary {counts[index] === 1 ? 'record' : 'records'} · OGC:CRS84 · topology-preserving display geometry</p><p><a href={`/data/${manifest.dataset_id}/2.0.0/manifest.json`}>Download manifest</a> · <a href={manifest.artifact.path}>Download compressed GeoJSON</a></p><Evidence metadata={dataset.metadata} /></section>;
    })}
  </div>;
}
