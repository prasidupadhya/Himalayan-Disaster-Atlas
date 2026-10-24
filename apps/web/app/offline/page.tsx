import Link from 'next/link';
import { T } from '../../lib/i18n';
import { LIVE_AUTHORITIES } from '../../../../packages/contracts/live';
import offline from '../../../../packages/contracts/offline-shell-policy.json';
export const metadata = { title: 'Offline', robots: { index: false } };
const PAGES: Record<string, [string, string]> = { '/': ['Home', 'गृहपृष्ठ'], '/live/': ['Live conditions (last known copy)', 'प्रत्यक्ष अवस्था (पछिल्लो ज्ञात प्रति)'], '/methodology/': ['Methodology', 'विधि'], '/sources/': ['Sources', 'स्रोतहरू'] };
const neDigits = (value: number) => String(value).replace(/[0-9]/g, d => '०१२३४५६७८९'[Number(d)]);
export default function OfflinePage() {
  return <div className="page prose offline-page">
    <p className="eyebrow"><T en="Offline" ne="अफलाइन" /></p>
    <h1><T en="This page is not saved on this device." ne="यो पृष्ठ यस उपकरणमा सुरक्षित गरिएको छैन।" /></h1>
    <p className="intro"><T en="You appear to be offline, and this page was not part of the saved offline shell. Reconnect to load it." ne="तपाईं अफलाइन हुनुहुन्छ जस्तो देखिन्छ, र यो पृष्ठ सुरक्षित अफलाइन शेलमा समावेश थिएन। यसलाई लोड गर्न पुनः जडान गर्नुहोस्।" /></p>
    <T en={<p lang="ne">तपाईं अफलाइन हुनुहुन्छ र यो पृष्ठ यस उपकरणमा सुरक्षित छैन। लोड गर्न इन्टरनेटमा पुनः जडान गर्नुहोस्।</p>} ne={null} />
    <h2><T en="Saved pages" ne="सुरक्षित पृष्ठहरू" /></h2>
    <ul>{offline.shell_pages.filter(path => path !== '/offline/').map(path => <li key={path}><Link href={path}>{PAGES[path] ? <T en={PAGES[path][0]} ne={PAGES[path][1]} /> : path}</Link></li>)}</ul>
    <p><T en={<>Live conditions shown offline are <strong>LAST KNOWN</strong> copies saved on this device, with the time they were saved. They are not rechecked and are never shown as current. Copies older than {offline.live_retention_seconds / 86400} days are deleted.</>} ne={<>अफलाइन देखाइने प्रत्यक्ष अवस्थाहरू यस उपकरणमा सुरक्षित गरिएका <strong>{offline.last_known.ne} (LAST KNOWN)</strong> प्रतिहरू हुन्, जसमा सुरक्षित गरिएको समय देखाइन्छ। तिनलाई पुनः जाँच गरिँदैन र कहिल्यै हालको रूपमा देखाइँदैन। {neDigits(offline.live_retention_seconds / 86400)} दिनभन्दा पुराना प्रतिहरू मेटाइन्छन्।</>} /></p>
    <p><T en="For official forecasts and warnings, follow" ne="आधिकारिक पूर्वानुमान र चेतावनीका लागि, पुनः अनलाइन भएपछि" /> {LIVE_AUTHORITIES.map((authority, index) => <span key={authority.name}>{index > 0 && (index === LIVE_AUTHORITIES.length - 1 ? <T en=" and " ne=" र " /> : ', ')}<a href={authority.url}>{authority.name}</a></span>)} <T en="when you are back online." ne="लाई पछ्याउनुहोस्।" /></p>
  </div>;
}
