'use client';
import Link from 'next/link';
import type { DataStatus, EvidenceType, Metadata } from '../../../packages/contracts';
import { useCopy, useLanguage, type Lang } from '../lib/i18n';
import { EVIDENCE } from './copy';

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
  if (m.spatial_resolution.value === null) return EVIDENCE[lang].resolutionUnknown;
  return `${m.spatial_resolution.value.toLocaleString('en-US')} ${m.spatial_resolution.unit}`;
}

function temporalCoverage(m: Omit<Metadata, 'schema_version' | 'artifact'>, lang: Lang) {
  if (m.temporal_coverage.start) return `${m.temporal_coverage.start} → ${m.temporal_coverage.end}`;
  return EVIDENCE[lang].temporalUnknown;
}

export function Evidence({ metadata: m }: { metadata: Omit<Metadata, 'schema_version' | 'artifact'> }) {
  const [lang] = useLanguage();
  const ne = lang === 'ne';
  const c = useCopy(EVIDENCE);
  const unknown = c.unknown;
  const status = ne ? STATUS_NE[m.status] ?? m.status : m.status;
  const evidenceType = ne ? EVIDENCE_NE[m.evidence_type] ?? m.evidence_type : m.evidence_type;
  return <section className="evidence" aria-label={c.region}>
    <div className="badges">{m.is_fixture && <span className="badge fixture">{c.fixture}</span>}<span className="badge">{status}</span><span className={`badge evidence-label evidence-${m.evidence_type}`}>{c.evidence}: {evidenceType}</span></div>
    <h3>{c.title}</h3>
    <dl>
      <dt>{c.dataset}</dt><dd>{m.dataset_name}</dd>
      <dt>{c.source}</dt><dd>{m.source_url ? <a href={m.source_url}>{m.source}</a> : m.source}</dd>
      <dt>{c.version}</dt><dd>{m.dataset_version}</dd>
      <dt>{c.observation}</dt><dd>{m.observation_date ?? unknown}</dd>
      <dt>{c.publication}</dt><dd>{m.publication_date ?? unknown}</dd>
      <dt>{c.access}</dt><dd>{m.retrieval_date}</dd>
      <dt>{c.processingDate}</dt><dd>{m.processing_date}</dd>
      <dt>{c.processingVersion}</dt><dd>{m.processing_version}</dd>
      <dt>{c.resolution}</dt><dd>{resolution(m, lang)}</dd>
      <dt>{c.spatial}</dt><dd>{m.spatial_coverage.description}</dd>
      <dt>{c.temporal}</dt><dd>{temporalCoverage(m, lang)}</dd>
      <dt>{c.evidenceType}</dt><dd>{evidenceType} — {status}</dd>
      <dt>{c.licence}</dt><dd>{m.license_url ? <a href={m.license_url}>{m.license}</a> : m.license}</dd>
    </dl>
    <details><summary>{c.transformation}</summary><p><strong>{c.method}</strong> {m.method}</p><p><strong>{c.uncertainty}</strong> {m.uncertainty}</p><ul>{m.limitations.map(item => <li key={item}>{item}</li>)}</ul><p><strong>{c.attribution}</strong> {m.attribution}</p></details>
    <p className="evidence-links"><a href={`/data/${encodeURIComponent(m.dataset_id)}/${encodeURIComponent(m.dataset_version)}/manifest.json`}>{c.manifest}</a> · <Link href="/sources/">{c.directory}</Link> · <Link href="/methodology/">{c.methodology}</Link></p>
  </section>;
}
