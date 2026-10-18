'use client';
import Link from 'next/link';
import type { DataStatus, EvidenceType, Metadata } from '../../../packages/contracts';
import { useLanguage, type Lang } from '../lib/i18n';

/** Nepali names for the controlled status and evidence codes; the code itself stays visible in brackets. */
const STATUS_NE: Record<DataStatus, string> = {
  VERIFIED_SOURCE: 'प्रमाणित स्रोत (VERIFIED_SOURCE)', SATELLITE_DERIVED: 'भू-उपग्रहबाट प्राप्त (SATELLITE_DERIVED)',
  ATLAS_DERIVED: 'एटलसद्वारा व्युत्पन्न (ATLAS_DERIVED)', ESTIMATED: 'अनुमानित (ESTIMATED)', MODELLED: 'मोडेल गरिएको (MODELLED)',
  HISTORICAL: 'ऐतिहासिक (HISTORICAL)', UNKNOWN: 'अज्ञात (UNKNOWN)',
};
const EVIDENCE_NE: Record<EvidenceType, string> = {
  observed: 'अवलोकन गरिएको (observed)', derived: 'व्युत्पन्न (derived)', estimated: 'अनुमानित (estimated)',
  modelled: 'मोडेल गरिएको (modelled)', historical: 'ऐतिहासिक (historical)', unknown: 'अज्ञात (unknown)',
};

function resolution(m: Omit<Metadata, 'schema_version' | 'artifact'>, lang: Lang) {
  if (m.spatial_resolution.value === null) return lang === 'ne' ? 'अज्ञात (UNKNOWN) / स्रोत अनुसार फरक' : 'UNKNOWN / source-specific';
  return `${m.spatial_resolution.value.toLocaleString('en-US')} ${m.spatial_resolution.unit}`;
}

function temporalCoverage(m: Omit<Metadata, 'schema_version' | 'artifact'>, lang: Lang) {
  if (m.temporal_coverage.start) return `${m.temporal_coverage.start} → ${m.temporal_coverage.end}`;
  return lang === 'ne' ? 'अज्ञात (UNKNOWN) / लागू हुँदैन' : 'UNKNOWN / not applicable';
}

export function Evidence({ metadata: m }: { metadata: Omit<Metadata, 'schema_version' | 'artifact'> }) {
  const [lang] = useLanguage();
  const ne = lang === 'ne';
  const t = (en: string, np: string) => ne ? np : en;
  const unknown = t('UNKNOWN', 'अज्ञात (UNKNOWN)');
  const status = ne ? STATUS_NE[m.status] ?? m.status : m.status;
  const evidenceType = ne ? EVIDENCE_NE[m.evidence_type] ?? m.evidence_type : m.evidence_type;
  return <section className="evidence" aria-label={t('Dataset evidence', 'डेटासेटको प्रमाण')}>
    <div className="badges">{m.is_fixture && <span className="badge fixture">{t('Synthetic fixture', 'कृत्रिम नमुना (synthetic fixture)')}</span>}<span className="badge">{status}</span><span className={`badge evidence-label evidence-${m.evidence_type}`}>{t('Evidence', 'प्रमाण')}: {evidenceType}</span></div>
    <h3>{t('Evidence & provenance', 'प्रमाण र उत्पत्ति')}</h3>
    <dl>
      <dt>{t('Dataset', 'डेटासेट')}</dt><dd>{m.dataset_name}</dd>
      <dt>{t('Source', 'स्रोत')}</dt><dd>{m.source_url ? <a href={m.source_url}>{m.source}</a> : m.source}</dd>
      <dt>{t('Dataset version', 'डेटासेट संस्करण')}</dt><dd>{m.dataset_version}</dd>
      <dt>{t('Observation date', 'अवलोकन मिति')}</dt><dd>{m.observation_date ?? unknown}</dd>
      <dt>{t('Publication date', 'प्रकाशन मिति')}</dt><dd>{m.publication_date ?? unknown}</dd>
      <dt>{t('Access date', 'प्राप्त गरेको मिति')}</dt><dd>{m.retrieval_date}</dd>
      <dt>{t('Processing date', 'प्रशोधन मिति')}</dt><dd>{m.processing_date}</dd>
      <dt>{t('Processing version', 'प्रशोधन संस्करण')}</dt><dd>{m.processing_version}</dd>
      <dt>{t('Resolution', 'रिजोल्युसन (resolution)')}</dt><dd>{resolution(m, lang)}</dd>
      <dt>{t('Spatial coverage', 'भौगोलिक दायरा')}</dt><dd>{m.spatial_coverage.description}</dd>
      <dt>{t('Temporal coverage', 'समय दायरा')}</dt><dd>{temporalCoverage(m, lang)}</dd>
      <dt>{t('Evidence type', 'प्रमाणको प्रकार')}</dt><dd>{evidenceType} — {status}</dd>
      <dt>{t('License', 'इजाजतपत्र (licence)')}</dt><dd>{m.license_url ? <a href={m.license_url}>{m.license}</a> : m.license}</dd>
    </dl>
    <details><summary>{t('Transformation, uncertainty & limitations', 'रूपान्तरण, अनिश्चितता र सीमाहरू')}</summary><p><strong>{t('Processing method:', 'प्रशोधन विधि:')}</strong> {m.method}</p><p><strong>{t('Uncertainty:', 'अनिश्चितता:')}</strong> {m.uncertainty}</p><ul>{m.limitations.map(item => <li key={item}>{item}</li>)}</ul><p><strong>{t('Attribution:', 'श्रेय (attribution):')}</strong> {m.attribution}</p></details>
    <p className="evidence-links"><a href={`/data/${encodeURIComponent(m.dataset_id)}/${encodeURIComponent(m.dataset_version)}/manifest.json`}>{t('Release manifest', 'रिलिज म्यानिफेस्ट (manifest)')}</a> · <Link href="/sources/">{t('Source directory', 'स्रोत निर्देशिका')}</Link> · <Link href="/methodology/">{t('Methodology', 'विधि')}</Link></p>
  </section>;
}
