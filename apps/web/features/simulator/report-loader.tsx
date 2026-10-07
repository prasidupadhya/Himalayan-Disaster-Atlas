'use client';
import dynamic from 'next/dynamic';
export const ReportLoader = dynamic(() => import('./report').then(m => m.ScenarioReport), { ssr: false, loading: () => <p role="status">Loading report…</p> });
