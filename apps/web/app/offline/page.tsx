import '../prose.css';
import Link from 'next/link';
import { T } from '../../lib/i18n';
import { bilingual } from '../../lib/copy';
import { OFFLINE } from './copy';
import { LIVE_AUTHORITIES } from '../../../../packages/contracts/live';
import offline from '../../../../packages/contracts/offline-shell-policy.json';
export const metadata = { title: 'Offline', robots: { index: false } };
const PAGES: Record<string, [string, string]> = { '/': ['Home', 'गृहपृष्ठ'], '/live/': ['Live conditions (last known copy)', 'प्रत्यक्ष अवस्था (पछिल्लो ज्ञात प्रति)'], '/methodology/': ['Methodology', 'विधि'], '/sources/': ['Sources', 'स्रोतहरू'] };
const t = bilingual(OFFLINE);
export default function OfflinePage() {
  return <div className="page prose offline-page">
    <p className="eyebrow">{t('offline')}</p>
    <h1>{t('pageNotSavedDevice')}</h1>
    <p className="intro">{t('youAppearOfflinePage')}</p>
    {t('alsoNepali')}
    <h2>{t('savedPages')}</h2>
    <ul>{offline.shell_pages.filter(path => path !== '/offline/').map(path => <li key={path}><Link href={path}>{PAGES[path] ? <T en={PAGES[path][0]} ne={PAGES[path][1]} /> : path}</Link></li>)}</ul>
    <p>{t('lastKnown')}</p>
    <p>{t('officialForecastsWarningsFollow')} {LIVE_AUTHORITIES.map((authority, index) => <span key={authority.name}>{index > 0 && (index === LIVE_AUTHORITIES.length - 1 ? t('and') : ', ')}<a href={authority.url}>{authority.name}</a></span>)} {t('whenYouBackOnline')}</p>
  </div>;
}
