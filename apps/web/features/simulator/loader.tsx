'use client';
import dynamic from 'next/dynamic';
// Client-only: scenario state is read from the URL and nothing is prerendered as a result.
export const SimulatorLoader = dynamic(() => import('./simulator').then(m => m.Simulator), {
  ssr: false,
  loading: () => <div className="sim-page"><p className="eyebrow">Simulate</p><h1>Scenario simulator</h1><p role="status">Loading the simulator…</p><p className="sim-notice">Scenario / educational estimate, not a forecast or warning.</p></div>,
});
