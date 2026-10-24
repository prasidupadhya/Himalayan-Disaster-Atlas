import { isPublicRelease, isReleaseIncluded } from '../../lib/public-release';
import Link from 'next/link';
import { T } from '../../lib/i18n';
import ledger from '../../../../licensing/datasets.json';
import catalog from '../../public/data/atlas-provenance/1.8.0/manifest.json';
export const metadata = { title: 'Licences and attribution' };
const STATUS_NE: Record<string, string> = { PERMITTED: 'अनुमति प्राप्त (PERMITTED)', REVIEW_REQUIRED: 'समीक्षा आवश्यक (REVIEW REQUIRED)' };
export default function LicensesPage() {
  const reviews = new Map(Object.entries(ledger.reviews));
  const blocked = (key: string, seen = new Set<string>()): boolean => {
    const review = reviews.get(key);
    if (!review || seen.has(key)) return true;
    return review.status !== 'PERMITTED' || review.parents.some(parent => blocked(parent, new Set([...seen, key])));
  };
  return <div className="page">
    <p className="eyebrow"><T en="Licences and attribution" ne="इजाजतपत्र र श्रेय" /></p><h1><T en="Rights stay with each source." ne="अधिकार हरेक स्रोतमै रहन्छ।" /></h1>
    <p><T en={<>Original Atlas software and documentation use the <a href="/legal/LICENSE.txt">MIT licence</a>. Data, imagery, third-party code and source excerpts retain their own terms. The Atlas does not imply endorsement by any provider.</>} ne={<>एटलसका मौलिक सफ्टवेयर र कागजातहरूले <a href="/legal/LICENSE.txt">MIT इजाजतपत्र</a> प्रयोग गर्छन्। डाटा, चित्र, तेस्रो पक्षको कोड र स्रोतका उद्धरणहरूमा तिनका आफ्नै सर्तहरू लागू रहन्छन्। एटलसले कुनै पनि प्रदायकको समर्थन (endorsement) जनाउँदैन।</>} /></p>
    <p><a href="/legal/THIRD_PARTY_NOTICES.txt"><T en="Third-party software notices" ne="तेस्रो पक्ष सफ्टवेयर सूचनाहरू" /></a> · <a href="/legal/software-inventory.json"><T en="Locked software inventory" ne="निश्चित (locked) सफ्टवेयर सूची" /></a> · <Link href="/sources/"><T en="Source directory" ne="स्रोत निर्देशिका" /></Link> · <Link href="/data-catalog/"><T en="Data downloads and processing history" ne="डाटा डाउनलोड र प्रशोधन इतिहास" /></Link></p>
    <h2><T en="Dataset redistribution review" ne="डाटासेट पुनर्वितरण समीक्षा" /></h2>
    <p><T en="Reviewed 9 September 2026. PERMITTED is subject to the listed obligations. REVIEW REQUIRED means public redistribution has not been cleared; it does not mean the data is prohibited. Derived products also inherit unresolved parent rights. Public exports exclude unresolved releases and their dependent features; the complete research export cannot be deployed. Local research availability is not permission to republish." ne="समीक्षा मिति: 9 September 2026। अनुमति प्राप्त (PERMITTED) भन्नाले सूचीकृत दायित्वहरूको अधीनमा रहेर भन्ने बुझिन्छ। समीक्षा आवश्यक (REVIEW REQUIRED) भन्नाले सार्वजनिक पुनर्वितरणको स्वीकृति भइसकेको छैन भन्ने हो; यसको अर्थ डाटा निषेधित छ भन्ने होइन। व्युत्पन्न उत्पादनहरूले मूल (parent) स्रोतका नटुंगिएका अधिकार पनि विरासतमा पाउँछन्। सार्वजनिक निर्यातबाट नटुंगिएका रिलिज र तिनमा निर्भर फिचरहरू हटाइन्छन्; पूर्ण अनुसन्धान निर्यात तैनाथ (deploy) गर्न सकिँदैन। स्थानीय अनुसन्धानका लागि उपलब्ध हुनु पुनःप्रकाशनको अनुमति होइन।" /></p>
    {Object.entries(ledger.reviews).map(([key, review]) => {
      const record = catalog.records.find(record => record.key === key);
      const notice = ['asia-terrain-context', 'nepal-terrain', 'nepal-population', 'nepal-sentinel-observations', 'phewa-water-change', 'nepal-power-climate'].includes(key.split('@')[0]) ? `${review.manifest_path.slice(0, -'manifest.json'.length)}LICENSE.txt` : null;
      return <section className="source-entry" key={key} id={key.replace('@', '-')}>
        <h3>{key}</h3><p><strong>{review.status === 'PERMITTED' && blocked(key) ? <T en="BLOCKED BY PARENT RIGHTS" ne="मूल स्रोतको अधिकारले रोकिएको (BLOCKED BY PARENT RIGHTS)" /> : <T en={review.status.replaceAll('_', ' ')} ne={STATUS_NE[review.status] ?? review.status.replaceAll('_', ' ')} />}</strong> · {record?.license ?? <T en="Original Atlas metadata" ne="एटलसको मौलिक मेटाडाटा" />}</p>
        <p>{review.reason}</p><p>{review.obligations}</p>
        {isPublicRelease && !isReleaseIncluded(key) ? <p><T en={<><strong>Excluded from this public export.</strong> No download is published.</>} ne={<><strong>यस सार्वजनिक निर्यातबाट हटाइएको।</strong> कुनै डाउनलोड प्रकाशित गरिएको छैन।</>} /></p> : null}
        {record && isReleaseIncluded(key) ? <p>{record.attribution} <a href={`/data/${encodeURIComponent(record.id)}/${encodeURIComponent(record.version)}/manifest.json`}><T en="Release manifest" ne="रिलिज म्यानिफेस्ट" /></a></p> : null}
        {notice && isReleaseIncluded(key) ? <p><a href={notice}><T en="Complete source notice" ne="स्रोतको पूर्ण सूचना" /></a></p> : null}
        <ul>{review.evidence_urls.map(url => <li key={url}><a href={url}>{url}</a></li>)}</ul>
        {review.parents.length ? <p><T en="Parent reviews:" ne="मूल स्रोत समीक्षाहरू:" /> {review.parents.map((parent, i) => <span key={parent}>{i ? ', ' : ''}<a href={`#${parent.replace('@', '-')}`}>{parent}</a></span>)}</p> : null}
      </section>;
    })}
  </div>;
}
