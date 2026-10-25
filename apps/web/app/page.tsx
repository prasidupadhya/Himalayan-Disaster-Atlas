import Link from 'next/link';
import { NepalOverview } from '../components/nepal-overview';
import { TodayStrip } from '../components/today-strip';
import { bilingual } from '../lib/copy';
import { HOME } from './copy';

const t = bilingual(HOME);
const HAZARDS = [
  { id: 'floods', title: 'floods', text: 'floodsText', links: [['/hazards/#floods', 'floodsToday'], ['/simulate/', 'floodsRun']] },
  { id: 'glacial-lakes', title: 'lakes', text: 'lakesText', links: [['/atlas/#lake-controls', 'lakesFind'], ['/simulate/', 'lakesRun']] },
  { id: 'earthquakes', title: 'quakes', text: 'quakesText', links: [['/hazards/#earthquakes', 'quakesLatest'], ['/simulate/?tab=earthquake', 'quakesRun']] },
] as const;

export default function Home() {
  return <div className="home">
    <section className="home-hero page" aria-labelledby="home-title">
      <div className="home-copy">
        <h1 id="home-title"><span>Himalayan</span><span>Disaster Atlas</span></h1>
        <p className="intro">{t('intro')}</p>
        <div className="home-actions"><Link className="primary-action" href="/atlas/">{t('explore')}</Link><Link className="text-action" href="/hazards/">{t('today')}</Link></div>
      </div>
      <NepalOverview />
    </section>
    <section className="home-today page" aria-label="Today"><TodayStrip /></section>
    <section className="home-hazards page" aria-labelledby="hazards-title">
      <h2 id="hazards-title">{t('hazardsTitle')}</h2>
      <ul className="hazard-cards">{HAZARDS.map(h => <li key={h.id} className={`hazard-card hazard-${h.id}`}>
        <h3>{t(h.title)}</h3>
        <p>{t(h.text)}</p>
        <p className="hazard-links">{h.links.map(([href, label]) => <Link key={href + label} href={href}>{t(label)}</Link>)}</p>
      </li>)}</ul>
      <p className="home-note muted">{t('note')}</p>
    </section>
  </div>;
}
