import Link from 'next/link';
import type { Metadata } from '../../../packages/contracts';

function resolution(m: Omit<Metadata, 'schema_version' | 'artifact'>) {
  return m.spatial_resolution.value === null ? 'UNKNOWN / source-specific' : `${m.spatial_resolution.value.toLocaleString('en-US')} ${m.spatial_resolution.unit}`;
}

function temporalCoverage(m: Omit<Metadata, 'schema_version' | 'artifact'>) {
  return m.temporal_coverage.start ? `${m.temporal_coverage.start} → ${m.temporal_coverage.end}` : 'UNKNOWN / not applicable';
}

export function Evidence({ metadata: m }: { metadata: Omit<Metadata, 'schema_version' | 'artifact'> }) {
  return <section className="evidence" aria-label="Dataset evidence">
    <div className="badges">{m.is_fixture && <span className="badge fixture">Synthetic fixture</span>}<span className="badge">{m.status}</span><span className={`badge evidence-label evidence-${m.evidence_type}`}>Evidence: {m.evidence_type}</span></div>
    <h3>Evidence & provenance</h3>
    <dl>
      <dt>Dataset</dt><dd>{m.dataset_name}</dd>
      <dt>Source</dt><dd>{m.source_url ? <a href={m.source_url}>{m.source}</a> : m.source}</dd>
      <dt>Dataset version</dt><dd>{m.dataset_version}</dd>
      <dt>Observation date</dt><dd>{m.observation_date ?? 'UNKNOWN'}</dd>
      <dt>Publication date</dt><dd>{m.publication_date ?? 'UNKNOWN'}</dd>
      <dt>Access date</dt><dd>{m.retrieval_date}</dd>
      <dt>Processing date</dt><dd>{m.processing_date}</dd>
      <dt>Processing version</dt><dd>{m.processing_version}</dd>
      <dt>Resolution</dt><dd>{resolution(m)}</dd>
      <dt>Spatial coverage</dt><dd>{m.spatial_coverage.description}</dd>
      <dt>Temporal coverage</dt><dd>{temporalCoverage(m)}</dd>
      <dt>Evidence type</dt><dd>{m.evidence_type} — {m.status}</dd>
      <dt>License</dt><dd>{m.license_url ? <a href={m.license_url}>{m.license}</a> : m.license}</dd>
    </dl>
    <details><summary>Transformation, uncertainty & limitations</summary><p><strong>Processing method:</strong> {m.method}</p><p><strong>Uncertainty:</strong> {m.uncertainty}</p><ul>{m.limitations.map(item => <li key={item}>{item}</li>)}</ul><p><strong>Attribution:</strong> {m.attribution}</p></details>
    <p className="evidence-links"><Link href={`/data-catalog/?dataset=${encodeURIComponent(m.dataset_id)}&version=${encodeURIComponent(m.dataset_version)}`}>Catalog record</Link> · <Link href="/sources/">Source directory</Link> · <Link href="/methodology/">Methodology</Link></p>
  </section>;
}
