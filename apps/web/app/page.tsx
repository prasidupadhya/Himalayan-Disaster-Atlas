import Link from 'next/link';
import { NepalOverview } from '../components/nepal-overview';
import { TodayStrip } from '../components/today-strip';
import { T } from '../lib/i18n';

type Text = { en: string; ne: string };
const HAZARDS: Array<{ id: string; title: Text; text: Text; links: Array<[string, Text]> }> = [
  { id: 'floods', title: { en: 'Floods', ne: 'बाढी' },
    text: { en: 'River levels and rainfall from DHM stations, flood bulletins and alerts, copied every morning. Then run a hypothetical flood down a real river.', ne: 'DHM केन्द्रहरूको नदी सतह र वर्षा, बाढी बुलेटिन र सतर्कता, हरेक बिहान प्रतिलिपि गरिन्छ। त्यसपछि वास्तविक नदीमा काल्पनिक बाढी चलाउनुहोस्।' },
    links: [['/hazards/#floods', { en: 'Today’s river and rain readings', ne: 'आजको नदी र वर्षा मापन' }], ['/simulate/', { en: 'Run a flood scenario', ne: 'बाढी परिदृश्य चलाउनुहोस्' }]] },
  { id: 'glacial-lakes', title: { en: 'Glacial lakes', ne: 'हिमताल' },
    text: { en: 'Thousands of glacial lakes sit above Nepal’s valleys. Pick one on the map and follow where its water would go, river by river.', ne: 'नेपालका उपत्यकामाथि हजारौँ हिमताल छन्। नक्सामा एउटा छानेर त्यसको पानी नदी-नदी हुँदै कहाँ जान्छ पछ्याउनुहोस्।' },
    links: [['/atlas/#lake-controls', { en: 'Find a lake on the map', ne: 'नक्सामा ताल खोज्नुहोस्' }], ['/simulate/', { en: 'Run an outburst scenario', ne: 'विस्फोट परिदृश्य चलाउनुहोस्' }]] },
  { id: 'earthquakes', title: { en: 'Earthquakes', ne: 'भूकम्प' },
    text: { en: 'The latest earthquakes recorded by the national seismology centre, shown on a map of Nepal, and shaking scenarios including a Gorkha 2015 replay.', ne: 'राष्ट्रिय भूकम्प केन्द्रले दर्ता गरेका पछिल्ला भूकम्पहरू नेपालको नक्सामा, र गोरखा २०१५ को पुनरावृत्तिसहित कम्पन परिदृश्यहरू।' },
    links: [['/hazards/#earthquakes', { en: 'Latest recorded earthquakes', ne: 'पछिल्ला दर्ता भूकम्पहरू' }], ['/simulate/?tab=earthquake', { en: 'Run a shaking scenario', ne: 'कम्पन परिदृश्य चलाउनुहोस्' }]] },
];

export default function Home() {
  return <div className="home">
    <section className="home-hero page" aria-labelledby="home-title">
      <div className="home-copy">
        <h1 id="home-title"><span>Himalayan</span><span>Disaster Atlas</span></h1>
        <p className="intro"><T en="Floods, glacial-lake outbursts and earthquakes in Nepal: today’s official readings, an interactive map, and scenarios you can run yourself." ne="नेपालमा बाढी, हिमताल विस्फोट र भूकम्प: आजका आधिकारिक मापन, अन्तरक्रियात्मक नक्सा, र आफैँ चलाउन सकिने परिदृश्यहरू।" /></p>
        <div className="home-actions"><Link className="primary-action" href="/atlas/"><T en="Explore Nepal" ne="नेपाल हेर्नुहोस्" /></Link><Link className="text-action" href="/hazards/"><T en="See today" ne="आज हेर्नुहोस्" /></Link></div>
      </div>
      <NepalOverview />
    </section>
    <section className="home-today page" aria-label="Today"><TodayStrip /></section>
    <section className="home-hazards page" aria-labelledby="hazards-title">
      <h2 id="hazards-title"><T en="Three hazards, one map." ne="तीन प्रकोप, एउटै नक्सा।" /></h2>
      <ul className="hazard-cards">{HAZARDS.map(h => <li key={h.id} className={`hazard-card hazard-${h.id}`}>
        <h3><T {...h.title} /></h3>
        <p><T {...h.text} /></p>
        <p className="hazard-links">{h.links.map(([href, label]) => <Link key={href + label.en} href={href}><T {...label} /></Link>)}</p>
      </li>)}</ul>
      <p className="home-note muted"><T en={<>Every figure is copied from official sources or labelled as a hypothetical scenario. This is not a warning service; for warnings use <a href="https://www.dhm.gov.np/" rel="noopener">DHM</a> and <a href="https://bipadportal.gov.np/" rel="noopener">BIPAD</a>. <Link href="/methodology/">How it works</Link></>} ne={<>हरेक अङ्क आधिकारिक स्रोतबाट प्रतिलिपि गरिएको वा काल्पनिक परिदृश्य भनी चिन्ह लगाइएको हुन्छ। यो चेतावनी सेवा होइन; चेतावनीका लागि <a href="https://www.dhm.gov.np/" rel="noopener">DHM</a> र <a href="https://bipadportal.gov.np/" rel="noopener">BIPAD</a> हेर्नुहोस्। <Link href="/methodology/">यो कसरी काम गर्छ</Link></>} /></p>
    </section>
  </div>;
}
