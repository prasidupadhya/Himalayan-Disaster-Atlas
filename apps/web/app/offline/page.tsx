import Link from 'next/link';
import { LIVE_AUTHORITIES } from '../../../../packages/contracts/live';
import offline from '../../../../packages/contracts/offline-shell-policy.json';
export const metadata = { title: 'Offline', robots: { index: false } };
const PAGES: Record<string, string> = { '/': 'Home', '/live/': 'Live conditions (last known copy)', '/methodology/': 'Methodology', '/sources/': 'Sources' };
export default function OfflinePage() {
  return <div className="page prose offline-page">
    <p className="eyebrow">Offline</p>
    <h1>This page is not saved on this device.</h1>
    <p className="intro">You appear to be offline, and this page was not part of the saved offline shell. Reconnect to load it.</p>
    <p lang="ne">तपाईं अफलाइन हुनुहुन्छ र यो पृष्ठ यस उपकरणमा सुरक्षित छैन। लोड गर्न इन्टरनेटमा पुनः जडान गर्नुहोस्।</p>
    <h2>Saved pages</h2>
    <ul>{offline.shell_pages.filter(path => path !== '/offline/').map(path => <li key={path}><Link href={path}>{PAGES[path] ?? path}</Link></li>)}</ul>
    <p>Live conditions shown offline are <strong>LAST KNOWN</strong> copies saved on this device, with the time they were saved. They are not rechecked and are never shown as current. Copies older than {offline.live_retention_seconds / 86400} days are deleted.</p>
    <p>For official forecasts and warnings, follow {LIVE_AUTHORITIES.map((authority, index) => <span key={authority.name}>{index > 0 && (index === LIVE_AUTHORITIES.length - 1 ? ' and ' : ', ')}<a href={authority.url}>{authority.name}</a></span>)} when you are back online.</p>
  </div>;
}
