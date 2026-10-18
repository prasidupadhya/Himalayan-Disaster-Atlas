import Link from 'next/link';
import { NepalOverview } from '../components/nepal-overview';
import { TodayStrip } from '../components/today-strip';

const HAZARDS = [
  { id: 'floods', title: 'Floods', text: 'River levels and rainfall from DHM stations, flood bulletins and alerts, copied every morning. Then run a hypothetical flood down a real river.',
    links: [['/hazards/#floods', 'Today’s river and rain readings'], ['/simulate/', 'Run a flood scenario']] },
  { id: 'glacial-lakes', title: 'Glacial lakes', text: 'Thousands of glacial lakes sit above Nepal’s valleys. Pick one on the map and follow where its water would go, river by river.',
    links: [['/atlas/#lake-controls', 'Find a lake on the map'], ['/simulate/', 'Run an outburst scenario']] },
  { id: 'earthquakes', title: 'Earthquakes', text: 'The latest recorded earthquakes, the historical record around Nepal on the map, and shaking scenarios including a Gorkha 2015 replay.',
    links: [['/hazards/#earthquakes', 'Latest recorded earthquakes'], ['/simulate/?tab=earthquake', 'Run a shaking scenario']] },
] as const;

export default function Home() {
  return <div className="home">
    <section className="home-hero page" aria-labelledby="home-title">
      <div className="home-copy">
        <h1 id="home-title"><span>Himalayan</span><span>Disaster Atlas</span></h1>
        <p className="intro">Floods, glacial-lake outbursts and earthquakes in Nepal: today’s official readings, an interactive map, and scenarios you can run yourself.</p>
        <div className="home-actions"><Link className="primary-action" href="/atlas/">Explore Nepal</Link><Link className="text-action" href="/hazards/">See today</Link></div>
      </div>
      <NepalOverview />
    </section>
    <section className="home-today page" aria-label="Today"><TodayStrip /></section>
    <section className="home-hazards page" aria-labelledby="hazards-title">
      <h2 id="hazards-title">Three hazards, one map.</h2>
      <ul className="hazard-cards">{HAZARDS.map(h => <li key={h.id} className={`hazard-card hazard-${h.id}`}>
        <h3>{h.title}</h3>
        <p>{h.text}</p>
        <p className="hazard-links">{h.links.map(([href, label]) => <Link key={href + label} href={href}>{label}</Link>)}</p>
      </li>)}</ul>
      <p className="home-note muted">Every figure is copied from official sources or labelled as a hypothetical scenario. This is not a warning service; for warnings use <a href="https://www.dhm.gov.np/" rel="noopener">DHM</a> and <a href="https://bipadportal.gov.np/" rel="noopener">BIPAD</a>. <Link href="/methodology/">How it works</Link></p>
    </section>
  </div>;
}
