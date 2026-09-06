import type { Metadata } from '../../../packages/contracts';
export function Evidence({ metadata: m }: { metadata: Metadata }) {
  return <section className="evidence" aria-label="Dataset evidence">
    <div className="badges">{m.is_fixture && <span className="badge fixture">Synthetic fixture</span>}<span className="badge">{m.status}</span></div>
    <h3>Evidence & provenance</h3>
    <dl>
      <dt>Source</dt><dd>{m.source_url ? <a href={m.source_url}>{m.source}</a> : m.source}</dd>
      <dt>Version</dt><dd>{m.dataset_version}</dd>
      <dt>Observation</dt><dd>{m.observation_date ?? 'UNKNOWN'}</dd>
      <dt>Evidence type</dt><dd>{m.evidence_type}</dd>
      <dt>License</dt><dd>{m.license_url ? <a href={m.license_url}>{m.license}</a> : m.license}</dd>
    </dl>
    <details><summary>Method, uncertainty & limitations</summary><p>{m.method}</p><p>{m.uncertainty}</p><ul>{m.limitations.map(item => <li key={item}>{item}</li>)}</ul><p>{m.attribution}</p></details>
  </section>;
}
