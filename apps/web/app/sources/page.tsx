import { isReleaseIncluded } from '../../lib/public-release';
import Link from 'next/link';
import { T } from '../../lib/i18n';
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
  if (!values.length) return <T en="UNKNOWN / not applicable" ne="अज्ञात (UNKNOWN) / लागू नहुने" />;
  if (values.length === 1) return values[0];
  return <>{values[0]} → {values.at(-1)} (<T en={`${values.length} represented access dates`} ne={`${values.length} वटा प्रतिनिधित्व गरिएका पहुँच मितिहरू`} />)</>;
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
    <p className="eyebrow"><T en="Sources" ne="स्रोतहरू" /></p><h1><T en="Trace every production layer to its source." ne="हरेक उत्पादन तहलाई यसको स्रोतसम्म पहिल्याउनुहोस्।" /></h1>
    <p className="intro"><T en="Official providers, acquisition endpoints, access dates, licences, attribution requirements and known limitations are derived from the same release metadata used by the Data Catalog." ne="आधिकारिक प्रदायकहरू, प्राप्ति अन्तिम बिन्दु (endpoint) हरू, पहुँच मितिहरू, इजाजतपत्रहरू, श्रेय (attribution) आवश्यकताहरू र ज्ञात सीमाहरू डाटा क्याटलगले प्रयोग गर्ने उही रिलिज मेटाडाटाबाट लिइएका हुन्।" /></p>
   
    <SourceToc sections={SECTIONS} />
    <p className="muted"><T en="Atlas-derived analysis is listed separately from originating evidence. A derived product does not become an independent external source simply because it has its own release artifact." ne="एटलसबाट व्युत्पन्न विश्लेषणलाई मूल प्रमाणभन्दा छुट्टै सूचीकृत गरिएको छ। कुनै व्युत्पन्न उत्पादनको आफ्नै रिलिज आर्टिफ्याक्ट (artifact) छ भन्दैमा त्यो स्वतन्त्र बाह्य स्रोत बन्दैन।" /></p>
    <section id="live-contracts" className="source-section">
      <h2><T en="Periodically updated conditions: contract fixtures" ne="आवधिक रूपमा अद्यावधिक हुने अवस्था: सम्झौता परीक्षण नमुना (contract fixtures)" /></h2>
      <p><T en={<>Feature 42 contains original Atlas test cases under MIT, with no source readings or geographic locations. Fixed timestamps and workflow states are synthetic; they do not report current conditions. <Link href="/data-catalog/#live-contract-checks">Inspect the checksum-verified cases</Link> and <Link href="/methodology/#live-contracts-method">their validation method</Link>.</>} ne={<>फिचर ४२ मा MIT अन्तर्गतका एटलसका मौलिक परीक्षण केसहरू छन्, जसमा कुनै स्रोत मापन वा भौगोलिक स्थान छैन। निश्चित समयचिह्न (timestamp) र कार्यप्रवाह अवस्थाहरू कृत्रिम (synthetic) हुन्; तिनले हालको अवस्था जनाउँदैनन्। <Link href="/data-catalog/#live-contract-checks">चेकसम-प्रमाणित केसहरू हेर्नुहोस्</Link> र <Link href="/methodology/#live-contracts-method">तिनको प्रमाणीकरण विधि</Link> हेर्नुहोस्।</>} /></p>
      <p><T en="Feature 42 acquires no sources. Feature 43 adds manual USGS/NOAA acquisition. DHM is reference-only, and BIPAD/NDRRMA ingestion remains excluded from the public build. OpenAQ, Open-Meteo and IMERG remain disabled pending separate reviews. The fixture licence grants no rights to upstream datasets." ne="फिचर ४२ ले कुनै स्रोत प्राप्त गर्दैन। फिचर ४३ ले USGS/NOAA को म्यानुअल प्राप्ति थप्छ। DHM सन्दर्भका लागि मात्र हो, र BIPAD/NDRRMA ग्रहण (ingestion) सार्वजनिक बिल्डबाट बाहिरै छ। OpenAQ, Open-Meteo र IMERG छुट्टै समीक्षा नभएसम्म निष्क्रिय रहन्छन्। परीक्षण नमुनाको इजाजतपत्रले माथिल्लो स्रोत (upstream) डाटासेटहरूमा कुनै अधिकार दिँदैन।" /></p>
      <p><T en="Official warning authorities:" ne="आधिकारिक चेतावनी निकायहरू:" /> {LIVE_AUTHORITIES.map((authority, i) => <span key={authority.name}>{i > 0 && ' · '}<a href={authority.url}>{authority.name}</a></span>)}.</p>
    </section>
    <section id="live-source-review"><h2><T en="USGS and NOAA live sources" ne="USGS र NOAA प्रत्यक्ष स्रोतहरू" /></h2><p><T en={<>USGS preferred USGS-network earthquake summaries: <a href="https://www.usgs.gov/data-management/data-licensing">public-domain guidance</a>. NOAA/NCEP GFS 0.25° APCP: <a href="https://www.weather.gov/disclaimer">NWS data terms</a>. Every imported snapshot has an exact-byte licence review, source hash, request and processing version. No warning or third-party contributor licence is inferred.</>} ne={<>USGS ले प्राथमिकता दिएका USGS-सञ्जाल भूकम्प सारांशहरू: <a href="https://www.usgs.gov/data-management/data-licensing">सार्वजनिक क्षेत्र (public-domain) सम्बन्धी निर्देशन</a>। NOAA/NCEP GFS 0.25° APCP: <a href="https://www.weather.gov/disclaimer">NWS डाटा सर्तहरू</a>। आयात गरिएको हरेक स्न्यापसटको ठ्याक्कै बाइट (exact-byte) इजाजतपत्र समीक्षा, स्रोत ह्यास (hash), अनुरोध र प्रशोधन संस्करण हुन्छ। कुनै चेतावनी वा तेस्रो पक्ष योगदानकर्ताको इजाजतपत्र अनुमान गरिँदैन।</>} /></p></section>
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
              <dt><T en="Source link" ne="स्रोत लिङ्क" /></dt><dd>{entry.url ? <a href={entry.url}>{external ? <T en="Official/acquisition source" ne="आधिकारिक/प्राप्ति स्रोत" /> : <T en="Atlas methodology for this derived product" ne="यस व्युत्पन्न उत्पादनका लागि एटलस विधि" />}</a> : <T en="UNKNOWN — no public source URL is declared in the release metadata" ne="अज्ञात (UNKNOWN) — रिलिज मेटाडाटामा कुनै सार्वजनिक स्रोत URL घोषणा गरिएको छैन" />}</dd>
              <dt><T en="Access dates" ne="पहुँच मितिहरू" /></dt><dd>{accessDates(entry.access_dates)}</dd>
              <dt><T en="Licence" ne="इजाजतपत्र" /></dt><dd>{entry.license_url ? <a href={entry.license_url}>{entry.license}</a> : entry.license}</dd>
              <dt><T en="Attribution" ne="श्रेय (Attribution)" /></dt><dd>{entry.attributions.join(' ')}</dd>
            </dl>
            <h4><T en="Used by" ne="प्रयोग गर्ने" /></h4><ul>{datasets.map(dataset => {
              const record = byKey.get(`${dataset.id}@${dataset.version}`)!;
              return <li key={`${dataset.id}@${dataset.version}`}><Link href={dataset.catalog_href}>{dataset.title} · {dataset.id}@{dataset.version}</Link>{record.map_href ? <> · <Link href={record.map_href}><T en="Atlas" ne="एटलस" /></Link></> : null}</li>;
            })}</ul>
            <details><summary><T en="Known source/product limitations" ne="स्रोत/उत्पादनका ज्ञात सीमाहरू" /></summary><ul>{entry.limitations.map(item => <li key={item}>{item}</li>)}</ul></details>
          </article>;
        })}
      </section>;
    })}
    <section className="source-section"><h2><T en="Attribution and licence discipline" ne="श्रेय र इजाजतपत्र अनुशासन" /></h2><p><T en={<><Link href="/licenses/">Dataset redistribution review and software notices</Link> identify permitted uses and unresolved publication rights.</>} ne={<><Link href="/licenses/">डाटासेट पुनर्वितरण समीक्षा र सफ्टवेयर सूचनाहरू</Link> ले अनुमति प्राप्त प्रयोग र नटुंगिएका प्रकाशन अधिकारहरू पहिचान गर्छन्।</>} /></p><p><T en="The Atlas preserves the licence/attribution text supplied by each release rather than substituting one project-wide licence for upstream data. Where a derived product combines multiple parents, its catalog lineage remains the authoritative path to each parent licence." ne="एटलसले माथिल्लो स्रोत (upstream) डाटाका लागि एउटै परियोजना-व्यापी इजाजतपत्र राख्नुको सट्टा हरेक रिलिजले दिएको इजाजतपत्र/श्रेय पाठ जस्ताको तस्तै राख्छ। कुनै व्युत्पन्न उत्पादनले धेरै मूल (parent) स्रोत मिलाउँदा, त्यसको क्याटलग वंशावली (lineage) नै हरेक मूल इजाजतपत्रसम्म पुग्ने आधिकारिक मार्ग हो।" /></p><p><T en="Source links are not credentials. Private account secrets, OAuth tokens, API keys and local acquisition configuration are not published in this directory." ne="स्रोत लिङ्कहरू प्रमाणपत्र (credentials) होइनन्। निजी खाताका गोप्य विवरण, OAuth टोकन, API कुञ्जी र स्थानीय प्राप्ति कन्फिगरेसन यस निर्देशिकामा प्रकाशित गरिँदैनन्।" /></p></section>
  </div>;
}
