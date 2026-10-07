'use client';
import dynamic from 'next/dynamic';
// Client-only: every panel verifies its release in the browser before rendering.
export const HazardsLoader = dynamic(() => import('./hazards').then(m => m.Hazards), {
  ssr: false,
  loading: () => <div className="hz-page"><p className="eyebrow">Hazards</p><h1>Hazard context for Nepal</h1><p role="status">Loading and verifying releases…</p><p className="hz-notice">Context and educational scenarios only — not a forecast or warning.</p></div>,
});
