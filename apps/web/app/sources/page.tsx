import { isReleaseIncluded } from '../../lib/public-release';
import Link from 'next/link';
import catalogJson from '../../public/data/atlas-provenance/1.4.0/manifest.json';
import { LIVE_AUTHORITIES } from '../../../../packages/contracts/live';
import { buildSourceDirectory, currentProductionRecords, parseProvenanceCatalog, type ProvenanceRecord } from '../../../../packages/contracts/provenance';

export const metadata = { title: 'Sources' };

const SECTIONS = [
  ['administrative', 'Administrative boundaries'], ['terrain', 'Terrain'], ['mountains', 'Mountains and peaks'], ['rivers', 'Rivers and hydrology'],
  ['glaciers', 'Glaciers'], ['glacial-lakes', 'Glacial lakes'], ['population', 'Population'], ['satellite', 'Satellite and water imagery'],
  ['live-air-quality', 'Air quality provider review policy'],
  ['live-open-feeds', 'Live open-feed publication policy'],
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
  const records = currentProductionRecords(catalog).filter(record => isReleaseIncluded(record.key));
  const directory = buildSourceDirectory(catalog.records.filter(record => isReleaseIncluded(record.key)));
  const byKey = new Map(records.map(record => [record.key, record]));
  return <div className="page sources-page">
    <p className="eyebrow">Sources</p><h1>Trace every production layer to its source.</h1>
    <p className="intro">Official providers, acquisition endpoints, access dates, licences, attribution requirements and known limitations are derived from the same release metadata used by the Data Catalog.</p>
    <p>For exact project-document excerpts and dataset-version citations, open the <Link href="/evidence/">evidence browser</Link>.</p>
    <nav className="source-toc" aria-label="Source categories">{SECTIONS.map(([anchor, label]) => <a key={anchor} href={`#${anchor}`}>{label}</a>)}</nav>
    <p className="muted">Atlas-derived analysis is listed separately from originating evidence. A derived product does not become an independent external source simply because it has its own release artifact.</p>
    <section id="live-contracts" className="source-section">
      <h2>Periodically updated conditions: contract fixtures</h2>
      <p>Feature 42 contains original Atlas test cases under MIT, with no source readings or geographic locations. Fixed timestamps and workflow states are synthetic; they do not report current conditions. <Link href="/data-catalog/#live-contract-checks">Inspect the checksum-verified cases</Link> and <Link href="/methodology/#live-contracts-method">their validation method</Link>.</p>
      <p>Feature 42 acquires no sources. Feature 43 adds manual USGS/NOAA acquisition. DHM is reference-only, and BIPAD/NDRRMA ingestion remains excluded from the public build. OpenAQ, Open-Meteo and IMERG remain disabled pending separate reviews. The fixture licence grants no rights to upstream datasets.</p>
      <p>Official warning authorities: {LIVE_AUTHORITIES.map((authority, i) => <span key={authority.name}>{i > 0 && ' · '}<a href={authority.url}>{authority.name}</a></span>)}.</p>
    </section>
    <section id="live-source-review"><h2>USGS and NOAA live sources</h2><p>USGS preferred USGS-network earthquake summaries: <a href="https://www.usgs.gov/data-management/data-licensing">public-domain guidance</a>. NOAA/NCEP GFS 0.25° APCP: <a href="https://www.weather.gov/disclaimer">NWS data terms</a>. Every imported snapshot has an exact-byte licence review, source hash, request and processing version. No warning or third-party contributor licence is inferred.</p></section>
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
    <section className="source-section"><h2>Attribution and licence discipline</h2><p><Link href="/licenses/">Dataset redistribution review and software notices</Link> identify permitted uses and unresolved publication rights.</p><p>The Atlas preserves the licence/attribution text supplied by each release rather than substituting one project-wide licence for upstream data. Where a derived product combines multiple parents, its catalog lineage remains the authoritative path to each parent licence.</p><p>Source links are not credentials. Private account secrets, OAuth tokens, API keys and local acquisition configuration are not published in this directory.</p></section>
  </div>;
}
