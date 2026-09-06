import manifest from '../../public/data/foundation-sample/1.0.0/manifest.json';
import { parseDataset } from '../../../../packages/contracts';
import { Evidence } from '../../components/evidence';
export const metadata = { title: 'Data catalog' };
export default function CatalogPage() {
  const dataset = parseDataset({ metadata: manifest, collection: { type: 'FeatureCollection', features: [] } });
  return <div className="page prose"><p className="eyebrow">Data catalog</p><h1>Know what you’re exploring.</h1><p>The foundation contains one development fixture. No production geographic datasets have been published.</p><h2>{manifest.dataset_name}</h2><Evidence metadata={dataset.metadata} /><p><a href="/data/foundation-sample/1.0.0/manifest.json">Download manifest</a> · <a href={manifest.artifact.path}>Download sample GeoJSON</a></p></div>;
}
