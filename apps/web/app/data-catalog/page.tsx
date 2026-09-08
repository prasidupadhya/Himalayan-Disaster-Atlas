import catalogJson from '../../public/data/atlas-provenance/1.0.0/manifest.json';
import { parseProvenanceCatalog } from '../../../../packages/contracts/provenance';
import { DataCatalog } from '../../features/data-catalog/data-catalog';

export const metadata = { title: 'Data catalog' };

export default function CatalogPage() {
  const catalog = parseProvenanceCatalog(catalogJson);
  return <div className="page catalog-page">
    <p className="eyebrow">Data catalog</p>
    <h1>Know exactly what powers the atlas.</h1>
    <p className="intro">Search the versioned release inventory, inspect lineage and limitations, and follow each record to its map, methodology and originating source.</p>
    <DataCatalog records={catalog.records} />
  </div>;
}
