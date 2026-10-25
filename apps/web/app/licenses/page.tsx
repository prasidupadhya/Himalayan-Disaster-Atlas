import '../prose.css';
import { isPublicRelease, isReleaseIncluded } from '../../lib/public-release';
import Link from 'next/link';
import { T } from '../../lib/i18n';
import { bilingual } from '../../lib/copy';
import { LICENCES } from './copy';
import ledger from '../../../../licensing/datasets.json';
import catalog from '../../public/data/atlas-provenance/1.8.0/manifest.json';
export const metadata = { title: 'Licences and attribution' };
const STATUS_NE: Record<string, string> = { PERMITTED: 'अनुमति प्राप्त (PERMITTED)', REVIEW_REQUIRED: 'समीक्षा आवश्यक (REVIEW REQUIRED)' };
const t = bilingual(LICENCES);
export default function LicensesPage() {
  const reviews = new Map(Object.entries(ledger.reviews));
  const blocked = (key: string, seen = new Set<string>()): boolean => {
    const review = reviews.get(key);
    if (!review || seen.has(key)) return true;
    return review.status !== 'PERMITTED' || review.parents.some(parent => blocked(parent, new Set([...seen, key])));
  };
  return <div className="page">
    <p className="eyebrow">{t('licencesAttribution')}</p><h1>{t('rightsStayEachSource')}</h1>
    <p>{t('originalAtlasSoftwareDocumentation')}</p>
    <p><a href="/legal/THIRD_PARTY_NOTICES.txt">{t('thirdPartySoftwareNotices')}</a> · <a href="/legal/software-inventory.json">{t('lockedSoftwareInventory')}</a> · <Link href="/sources/">{t('sourceDirectory')}</Link> · <Link href="/data-catalog/">{t('dataDownloadsProcessingHistory')}</Link></p>
    <h2>{t('datasetRedistributionReview')}</h2>
    <p>{t('reviewed9September2026')}</p>
    {Object.entries(ledger.reviews).map(([key, review]) => {
      const record = catalog.records.find(record => record.key === key);
      const notice = ['asia-terrain-context', 'nepal-terrain', 'nepal-population', 'nepal-sentinel-observations', 'phewa-water-change', 'nepal-power-climate'].includes(key.split('@')[0]) ? `${review.manifest_path.slice(0, -'manifest.json'.length)}LICENSE.txt` : null;
      return <section className="source-entry" key={key} id={key.replace('@', '-')}>
        <h3>{key}</h3><p><strong>{review.status === 'PERMITTED' && blocked(key) ? t('blockedParentRights') : <T en={review.status.replaceAll('_', ' ')} ne={STATUS_NE[review.status] ?? review.status.replaceAll('_', ' ')} />}</strong> · {record?.license ?? t('originalAtlasMetadata')}</p>
        <p>{review.reason}</p><p>{review.obligations}</p>
        {isPublicRelease && !isReleaseIncluded(key) ? <p>{t('excludedFromPublicExport')}</p> : null}
        {record && isReleaseIncluded(key) ? <p>{record.attribution} <a href={`/data/${encodeURIComponent(record.id)}/${encodeURIComponent(record.version)}/manifest.json`}>{t('releaseManifest')}</a></p> : null}
        {notice && isReleaseIncluded(key) ? <p><a href={notice}>{t('completeSourceNotice')}</a></p> : null}
        <ul>{review.evidence_urls.map(url => <li key={url}><a href={url}>{url}</a></li>)}</ul>
        {review.parents.length ? <p>{t('parentReviews')} {review.parents.map((parent, i) => <span key={parent}>{i ? ', ' : ''}<a href={`#${parent.replace('@', '-')}`}>{parent}</a></span>)}</p> : null}
      </section>;
    })}
  </div>;
}
