import '../prose.css';
import { isReleaseIncluded } from '../../lib/public-release';
import Link from 'next/link';
import { T } from '../../lib/i18n';
import { bilingual } from '../../lib/copy';
import { SOURCES } from './copy';
import { SourceToc } from './source-toc';
import catalogJson from '../../public/data/atlas-provenance/1.8.0/manifest.json';
import { LIVE_AUTHORITIES } from '../../../../packages/contracts/live';
import { buildSourceDirectory, currentProductionRecords, parseProvenanceCatalog, type ProvenanceRecord } from '../../../../packages/contracts/provenance';

export const metadata = { title: 'Sources' };

const SECTIONS = [
  ['administrative', 'Administrative boundaries', 'प्रशासनिक सीमाहरू'], ['terrain', 'Terrain', 'भू-धरातल'], ['mountains', 'Mountains and peaks', 'हिमाल र चुचुराहरू'], ['rivers', 'Rivers and hydrology', 'नदी र जलविज्ञान'],
  ['glaciers', 'Glaciers', 'हिमनदीहरू'], ['glacial-lakes', 'Glacial lakes', 'हिमतालहरू'], ['population', 'Population', 'जनसंख्या'], ['satellite', 'Satellite and water imagery', 'भू-उपग्रह र जल चित्रहरू'],
  ['hrsl-population', 'Population for public exposure (HRSL)', 'सार्वजनिक जोखिम-सम्पर्क (exposure) का लागि जनसंख्या (HRSL)'],
  ['flood-corridors', 'Flood and GLOF corridor scenarios', 'बाढी र हिमताल विस्फोट (GLOF) करिडोर परिदृश्यहरू'],
  ['earthquake-shaking', 'Earthquake ground-motion model', 'भूकम्पीय भू-कम्पन (ground-motion) मोडेल'],
  ['climate-context', 'Rainfall, snow, drought and heat context', 'वर्षा, हिउँ, खडेरी र गर्मीको सन्दर्भ'],
  ['terrain-steepness', 'Terrain steepness', 'भू-धरातलको भिरालोपन'],
  ['public-evidence', 'Public evidence corpus', 'सार्वजनिक प्रमाण संग्रह'],
  ['live-conditions', 'Live conditions page presentation policy', 'प्रत्यक्ष अवस्था पृष्ठ प्रस्तुति नीति'],
  ['live-offline-shell', 'Offline shell cache policy', 'अफलाइन शेल क्यास (cache) नीति'],
  ['live-air-quality', 'Air quality provider review policy', 'वायु गुणस्तर प्रदायक समीक्षा नीति'],
  ['live-open-feeds', 'Live open-feed publication policy', 'प्रत्यक्ष खुला फिड (open-feed) प्रकाशन नीति'],
  ['climate', 'Climate', 'जलवायु'], ['infrastructure', 'Infrastructure and hydropower', 'पूर्वाधार र जलविद्युत्'], ['hazards', 'Hazards and reported events', 'प्रकोप र प्रतिवेदित घटनाहरू'], ['analysis', 'Atlas-derived analysis and models', 'एटलसबाट व्युत्पन्न विश्लेषण र मोडेलहरू'], ['derived', 'Discovery and evidence products', 'खोज र प्रमाण उत्पादनहरू'],
] as const;

function accessDates(values: string[]) {
  if (!values.length) return t('unknownNotApplicable');
  if (values.length === 1) return values[0];
  return <>{values[0]} → {values.at(-1)} (<T en={SOURCES.en.accessDateCount(values.length)} ne={SOURCES.ne.accessDateCount(values.length)} />)</>;
}

function sectionRecords(records: ProvenanceRecord[], anchor: string) {
  return records.filter(record => record.source_href === `/sources/#${anchor}`);
}

const t = bilingual(SOURCES);
export default function SourcesPage() {
  const catalog = parseProvenanceCatalog(catalogJson);
  const records = currentProductionRecords(catalog).filter(record => isReleaseIncluded(record.key));
  const directory = buildSourceDirectory(catalog.records.filter(record => isReleaseIncluded(record.key)));
  const byKey = new Map(records.map(record => [record.key, record]));
  return <div className="page sources-page">
    <p className="eyebrow">{t('sources')}</p><h1>{t('traceEveryProductionLayer')}</h1>
    <p className="intro">{t('officialProvidersAcquisitionEndpoints')}</p>
   
    <SourceToc sections={SECTIONS} />
    <p className="muted">{t('atlasDerivedAnalysisListed')}</p>
    <section id="live-contracts" className="source-section">
      <h2>{t('periodicallyUpdatedConditionsContract')}</h2>
      <p>{t('feature42ContainsOriginal')}</p>
      <p>{t('feature42AcquiresNo')}</p>
      <p>{t('officialWarningAuthorities')} {LIVE_AUTHORITIES.map((authority, i) => <span key={authority.name}>{i > 0 && ' · '}<a href={authority.url}>{authority.name}</a></span>)}.</p>
    </section>
    <section id="live-source-review"><h2>{t('usgsNoaaLiveSources')}</h2><p>{t('usgsPreferredUsgsNetwork')}</p></section>
    {SECTIONS.map(([anchor, label, labelNe]) => {
      const keys = new Set(sectionRecords(records, anchor).map(record => record.key));
      const entries = directory.filter(entry => entry.datasets.some(dataset => keys.has(`${dataset.id}@${dataset.version}`)));
      if (!entries.length) return null;
      return <section id={anchor} className="source-section" key={anchor}>
        <h2><T en={label} ne={labelNe} /></h2>
        {entries.map(entry => {
          const datasets = entry.datasets.filter(dataset => keys.has(`${dataset.id}@${dataset.version}`));
          const external = entry.url?.startsWith('http://') || entry.url?.startsWith('https://');
          return <article className="source-entry" key={`${anchor}:${entry.key}`}>
            <h3>{external && entry.url ? <a href={entry.url}>{entry.name}</a> : entry.name}</h3>
            <dl>
              <dt>{t('sourceLink')}</dt><dd>{entry.url ? <a href={entry.url}>{external ? t('officialAcquisitionSource') : t('atlasMethodologyDerivedProduct')}</a> : t('unknownNoPublicSource')}</dd>
              <dt>{t('accessDates')}</dt><dd>{accessDates(entry.access_dates)}</dd>
              <dt>{t('licence')}</dt><dd>{entry.license_url ? <a href={entry.license_url}>{entry.license}</a> : entry.license}</dd>
              <dt>{t('attribution')}</dt><dd>{entry.attributions.join(' ')}</dd>
            </dl>
            <h4>{t('used')}</h4><ul>{datasets.map(dataset => {
              const record = byKey.get(`${dataset.id}@${dataset.version}`)!;
              return <li key={`${dataset.id}@${dataset.version}`}><Link href={dataset.catalog_href}>{dataset.title} · {dataset.id}@{dataset.version}</Link>{record.map_href ? <> · <Link href={record.map_href}>{t('atlas')}</Link></> : null}</li>;
            })}</ul>
            <details><summary>{t('knownSourceProductLimitations')}</summary><ul>{entry.limitations.map(item => <li key={item}>{item}</li>)}</ul></details>
          </article>;
        })}
      </section>;
    })}
    <section className="source-section"><h2>{t('attributionLicenceDiscipline')}</h2><p>{t('datasetRedistributionReviewSoftware')}</p><p>{t('atlasPreservesLicenceAttribution')}</p><p>{t('sourceLinksNotCredentials')}</p></section>
  </div>;
}
