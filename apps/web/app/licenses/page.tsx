import { isPublicRelease, isReleaseIncluded } from '../../lib/public-release';
import Link from 'next/link';
import ledger from '../../../../licensing/datasets.json';
import catalog from '../../public/data/atlas-provenance/1.0.0/manifest.json';
export const metadata = { title: 'Licences and attribution' };
export default function LicensesPage() {
  const reviews = new Map(Object.entries(ledger.reviews));
  const blocked = (key: string, seen = new Set<string>()): boolean => {
    const review = reviews.get(key);
    if (!review || seen.has(key)) return true;
    return review.status !== 'PERMITTED' || review.parents.some(parent => blocked(parent, new Set([...seen, key])));
  };
  return <div className="page">
    <p className="eyebrow">Licences and attribution</p><h1>Rights stay with each source.</h1>
    <p>Original Atlas software and documentation use the <a href="/legal/LICENSE.txt">MIT licence</a>. Data, imagery, third-party code and source excerpts retain their own terms. The Atlas does not imply endorsement by any provider.</p>
    <p><a href="/legal/THIRD_PARTY_NOTICES.txt">Third-party software notices</a> · <a href="/legal/software-inventory.json">Locked software inventory</a> · <Link href="/sources/">Source directory</Link> · <Link href="/data-catalog/">Data downloads and processing history</Link></p>
    <h2>Dataset redistribution review</h2>
    <p>Reviewed 9 September 2026. PERMITTED is subject to the listed obligations. REVIEW REQUIRED means public redistribution has not been cleared; it does not mean the data is prohibited. Derived products also inherit unresolved parent rights. Public exports exclude unresolved releases and their dependent features; the complete research export cannot be deployed. Local research availability is not permission to republish.</p>
    {Object.entries(ledger.reviews).map(([key, review]) => {
      const record = catalog.records.find(record => record.key === key);
      const notice = ['asia-terrain-context', 'nepal-terrain', 'nepal-population', 'nepal-sentinel-observations', 'phewa-water-change', 'nepal-power-climate'].includes(key.split('@')[0]) ? `${review.manifest_path.slice(0, -'manifest.json'.length)}LICENSE.txt` : null;
      return <section className="source-entry" key={key} id={key.replace('@', '-')}>
        <h3>{key}</h3><p><strong>{review.status === 'PERMITTED' && blocked(key) ? 'BLOCKED BY PARENT RIGHTS' : review.status.replaceAll('_', ' ')}</strong> · {record?.license ?? 'Original Atlas metadata'}</p>
        <p>{review.reason}</p><p>{review.obligations}</p>
        {isPublicRelease && !isReleaseIncluded(key) ? <p><strong>Excluded from this public export.</strong> No download is published.</p> : null}
        {record && isReleaseIncluded(key) ? <p>{record.attribution} <Link href={`/data-catalog/?dataset=${encodeURIComponent(record.id)}&version=${encodeURIComponent(record.version)}`}>Catalog and processing details</Link></p> : null}
        {notice && isReleaseIncluded(key) ? <p><a href={notice}>Complete source notice</a></p> : null}
        <ul>{review.evidence_urls.map(url => <li key={url}><a href={url}>{url}</a></li>)}</ul>
        {review.parents.length ? <p>Parent reviews: {review.parents.map((parent, i) => <span key={parent}>{i ? ', ' : ''}<a href={`#${parent.replace('@', '-')}`}>{parent}</a></span>)}</p> : null}
      </section>;
    })}
  </div>;
}
