import Link from 'next/link';
import catalogJson from '../../public/data/atlas-provenance/1.0.0/manifest.json';
import { buildSourceDirectory, currentProductionRecords, parseProvenanceCatalog, type ProvenanceRecord } from '../../../../packages/contracts/provenance';

export const metadata = { title: 'Sources' };

const SECTIONS = [
  ['administrative', 'Administrative boundaries'], ['terrain', 'Terrain'], ['mountains', 'Mountains and peaks'], ['rivers', 'Rivers and hydrology'],
  ['glaciers', 'Glaciers'], ['glacial-lakes', 'Glacial lakes'], ['population', 'Population'], ['satellite', 'Satellite and water imagery'],
  ['climate', 'Climate'], ['infrastructure', 'Infrastructure and hydropower'], ['hazards', 'Hazards and reported events'], ['analysis', 'Atlas-derived analysis and models'], ['derived', 'Discovery and evidence products'],
] as const;

function accessDates(values: string[]) {
  if (!values.length) return 'UNKNOWN / not applicable';
  if (values.length === 1) return values[0];
  return `${values[0]} → ${values.at(-1)} (${values.length} represented access dates)`;
}

function sectionRecords(records: ProvenanceRecord[], anchor: string) {
  return records.filter(record => record.source_href === `/sources/#${anchor}`);
}

export default function SourcesPage() {
  const catalog = parseProvenanceCatalog(catalogJson);
  const records = currentProductionRecords(catalog);
  const directory = buildSourceDirectory(catalog.records);
  const byKey = new Map(records.map(record => [record.key, record]));
  return <div className="page sources-page">
    <p className="eyebrow">Sources</p><h1>Trace every production layer to its source.</h1>
    <p className="intro">Official providers, acquisition endpoints, access dates, licences, attribution requirements and known limitations are derived from the same release metadata used by the Data Catalog.</p>
    <nav className="source-toc" aria-label="Source categories">{SECTIONS.map(([anchor, label]) => <a key={anchor} href={`#${anchor}`}>{label}</a>)}</nav>
    <p className="muted">Atlas-derived analysis is listed separately from originating evidence. A derived product does not become an independent external source simply because it has its own release artifact.</p>
    {SECTIONS.map(([anchor, label]) => {
      const keys = new Set(sectionRecords(records, anchor).map(record => record.key));
      const entries = directory.filter(entry => entry.datasets.some(dataset => keys.has(`${dataset.id}@${dataset.version}`)));
      if (!entries.length) return null;
      return <section id={anchor} className="source-section" key={anchor}>
        <h2>{label}</h2>
        {entries.map(entry => {
          const datasets = entry.datasets.filter(dataset => keys.has(`${dataset.id}@${dataset.version}`));
          const external = entry.url?.startsWith('http://') || entry.url?.startsWith('https://');
          return <article className="source-entry" key={`${anchor}:${entry.key}`}>
            <h3>{external && entry.url ? <a href={entry.url}>{entry.name}</a> : entry.name}</h3>
            <dl>
              <dt>Source link</dt><dd>{entry.url ? <a href={entry.url}>{external ? 'Official/acquisition source' : 'Atlas methodology for this derived product'}</a> : 'UNKNOWN — no public source URL is declared in the release metadata'}</dd>
              <dt>Access dates</dt><dd>{accessDates(entry.access_dates)}</dd>
              <dt>Licence</dt><dd>{entry.license_url ? <a href={entry.license_url}>{entry.license}</a> : entry.license}</dd>
              <dt>Attribution</dt><dd>{entry.attributions.join(' ')}</dd>
            </dl>
            <h4>Used by</h4><ul>{datasets.map(dataset => {
              const record = byKey.get(`${dataset.id}@${dataset.version}`)!;
              return <li key={`${dataset.id}@${dataset.version}`}><Link href={dataset.catalog_href}>{dataset.title} · {dataset.id}@{dataset.version}</Link>{record.map_href ? <> · <Link href={record.map_href}>Atlas</Link></> : null}</li>;
            })}</ul>
            <details><summary>Known source/product limitations</summary><ul>{entry.limitations.map(item => <li key={item}>{item}</li>)}</ul></details>
          </article>;
        })}
      </section>;
    })}
    <section className="source-section"><h2>Attribution and licence discipline</h2><p>The Atlas preserves the licence/attribution text supplied by each release rather than substituting one project-wide licence for upstream data. Where a derived product combines multiple parents, its catalog lineage remains the authoritative path to each parent licence.</p><p>Source links are not credentials. Private account secrets, OAuth tokens, API keys and local acquisition configuration are not published in this directory.</p></section>
  </div>;
}
