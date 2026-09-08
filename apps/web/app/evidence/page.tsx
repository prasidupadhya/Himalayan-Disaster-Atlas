import { EvidenceBrowser } from '../../features/evidence/evidence';
export const metadata = { title: 'Evidence retrieval' };
export default function EvidencePage() {
  return <article className="page prose"><p className="eyebrow">Evidence-grounded retrieval</p><h1>Inspect the evidence.</h1>
    <p>Search pinned Atlas methodology and data descriptions. Excerpts retain their original wording, source versions and limitations. This corpus does not contain a comprehensive disaster-report archive or individual geographic records.</p>
    <p>Retrieval uses keyword matching, not AI-generated answers. Unknown evidence stays UNKNOWN; proximity, connectivity and hypothetical scenarios do not establish hazard or a forecast.</p>
    <EvidenceBrowser />
  </article>;
}
