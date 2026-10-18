'use client';
import dynamic from 'next/dynamic';
// Client-only: the page reads today's official copy in the browser.
export const HazardsLoader = dynamic(() => import('./hazards').then(m => m.Hazards), {
  ssr: false,
  loading: () => <div className="hz-page"><p className="eyebrow">Today in Nepal</p><h1>Floods, glacial lakes and earthquakes today</h1><p role="status">Loading today’s copy…</p></div>,
});
