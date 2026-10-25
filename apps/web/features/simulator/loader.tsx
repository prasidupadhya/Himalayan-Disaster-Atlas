'use client';
import dynamic from 'next/dynamic';
import { UI, useLanguage } from '../../lib/i18n';
import { simCopy } from './copy';

/** Shown while the simulator loads; it holds a screen's height so the footer does not flash up and jump away. */
function SimulatorLoading() {
  const [lang] = useLanguage();
  const t = UI[lang], c = simCopy(lang);
  return <div className="sim-page sim-page-loading" lang={lang}>
    <header className="sim-hero"><p className="eyebrow">{c.eyebrow}</p><h1>{t.simTitle}</h1><p role="status">{c.loadingSimulator}</p></header>
    <p className="sim-notice notice notice-model"><span aria-hidden="true">◇</span> {t.scenarioNotice}.</p>
  </div>;
}

// Client-only: scenario state is read from the URL and nothing is prerendered as a result.
export const SimulatorLoader = dynamic(() => import('./simulator').then(m => m.Simulator), { ssr: false, loading: SimulatorLoading });
