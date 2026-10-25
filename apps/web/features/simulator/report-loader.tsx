'use client';
import dynamic from 'next/dynamic';
import { useLanguage } from '../../lib/i18n';
import { REPORT } from './copy';
import { ReportNotice } from './report-notice';

/** The report's frame while it loads: its label and scenario notice (painted at once), then a status line. */
function ReportLoading() {
  const [lang] = useLanguage();
  const r = REPORT[lang];
  return <article className="report-page" lang={lang}><header className="report-header"><div className="report-top"><p className="eyebrow">{r.eyebrow}</p></div><ReportNotice lang={lang} /></header><p role="status">{r.loadingReport}</p></article>;
}

export const ReportLoader = dynamic(() => import('./report').then(m => m.ScenarioReport), { ssr: false, loading: ReportLoading });
