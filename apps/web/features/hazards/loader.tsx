'use client';
import dynamic from 'next/dynamic';
import { useLanguage } from '../../lib/i18n';
import { hz } from './copy';

function HazardsLoading() {
  const [lang] = useLanguage();
  const c = hz(lang);
  // The same heading and intro as the page, so they paint at once and the page's own copy does not repaint them later.
  return <div className="hz-page" lang={lang} data-today-state="loading"><header className="hz-hero"><div className="hz-hero-top"><p className="eyebrow">{c.eyebrow}</p></div><h1>{c.title}</h1><p className="intro">{c.intro}</p></header><p role="status" className="hz-loading">{c.loading}</p></div>;
}

// Client-only: the page reads today's official copy in the browser.
export const HazardsLoader = dynamic(() => import('./hazards').then(m => m.Hazards), { ssr: false, loading: HazardsLoading });

/**
 * The home page's province overview, loaded beside Today's earthquake map: its outline then ships in the same lazily
 * loaded chunk the offline shell already pins for Today, and stays out of every other page's first load. It is still
 * rendered on the server, so the outline is in the home page's HTML from the first paint.
 */
export const NepalOverviewLoader = dynamic(() => import('../../components/nepal-overview').then(m => m.NepalOverview), {
  loading: () => <div className="nepal-overview-placeholder" aria-hidden="true" />,
});
