import Link from 'next/link';
import { NepalOverview } from '../components/nepal-overview';
import { TodayStrip } from '../components/today-strip';
import { bilingual } from '../lib/copy';
import { HOME } from './copy';

const t = bilingual(HOME);
// The three hazards, each with its identity colour, a line icon and two ways in: today's official copy and a scenario.
const HAZARDS = [
  { id: 'floods', title: 'floods', text: 'floodsText', icon: <path d="M3 15c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 3 2M3 19c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 3 2M12 3c2.6 3.3 4 5.6 4 7.2a4 4 0 0 1-8 0C8 8.6 9.4 6.3 12 3Z" />,
    links: [['/hazards/#floods', 'floodsToday'], ['/simulate/', 'floodsRun']] },
  { id: 'glacial-lakes', title: 'lakes', text: 'lakesText', icon: <path d="m3 17 5.5-9 3 4.5L14 9l7 8M7 20c1.6-1.2 3.3-1.2 5 0s3.4 1.2 5 0" />,
    links: [['/atlas/#lake-controls', 'lakesFind'], ['/simulate/', 'lakesRun']] },
  { id: 'earthquakes', title: 'quakes', text: 'quakesText', icon: <path d="M2 12h4l2-5 3 10 3-12 3 9 2-2h3" />,
    links: [['/hazards/#earthquakes', 'quakesLatest'], ['/simulate/?tab=earthquake', 'quakesRun']] },
] as const;

export default function Home() {
  return <div className="home">
    <section className="home-hero" aria-labelledby="home-title">
      <div className="home-hero-inner">
        <div className="home-copy">
          <h1 id="home-title"><span>Himalayan</span><span>Disaster Atlas</span></h1>
          <p className="intro">{t('intro')}</p>
          <div className="home-actions"><Link className="primary-action" href="/atlas/">{t('explore')}</Link><Link className="text-action" href="/hazards/">{t('today')}</Link></div>
        </div>
        <div className="home-map"><NepalOverview /></div>
      </div>
      <div className="home-today"><TodayStrip /></div>
    </section>
    <section className="home-hazards page" aria-labelledby="hazards-title">
      <h2 id="hazards-title">{t('hazardsTitle')}</h2>
      <ul className="hazard-cards">{HAZARDS.map(h => <li key={h.id} className={`hazard-card hazard-${h.id}`}>
        <svg className="hazard-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">{h.icon}</svg>
        <h3>{t(h.title)}</h3>
        <p>{t(h.text)}</p>
        <p className="hazard-links">{h.links.map(([href, label]) => <Link key={href + label} href={href}>{t(label)}</Link>)}</p>
      </li>)}</ul>
      <p className="home-note muted">{t('note')}</p>
    </section>
  </div>;
}
