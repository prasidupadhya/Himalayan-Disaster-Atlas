'use client';
import Link from 'next/link';
import { findEntry, recentQuakes, useGovDigest, type ListContent } from '../lib/gov-digest';
import { formatNumber, useLanguage } from '../lib/i18n';


/** Today's headline figures from the daily official copy, as published; the full picture is on /hazards/. */
export function TodayStrip() {
  const [state] = useGovDigest();
  const [lang] = useLanguage();
  const t = <V,>(en: V, ne: V) => lang === 'ne' ? ne : en;
  const count = (value: number | null | undefined) => formatNumber(value ?? null, lang);
  if (state.status !== 'ready') {
    return <aside className="today-strip" aria-label={t('Today from official sources', 'आधिकारिक स्रोतबाट आज')} data-today-state={state.status}>
      <p className="today-strip-note">{state.status === 'loading' ? t('Loading today’s official figures…', 'आजका आधिकारिक अङ्क लोड हुँदैछन्…') : t('Today’s official figures are not available right now.', 'आजका आधिकारिक अङ्क अहिले उपलब्ध छैनन्।')} <Link href="/hazards/">{t('Open Today', 'आज खोल्नुहोस्')}</Link></p>
    </aside>;
  }
  const { digest } = state;
  const s = digest.summary;
  const incidents = findEntry(digest, 'bipad-incidents')?.content as ListContent | undefined;
  const latest = recentQuakes(digest, 1)?.[0];
  const riverAlerts = s.rivers_above_danger === null || s.rivers_above_warning === null ? null : s.rivers_above_danger + s.rivers_above_warning;
  return <aside className="today-strip" aria-label={t('Today from official sources', 'आधिकारिक स्रोतबाट आज')} data-today-state="ready">
    <dl>
      <div><dt>{t('Rivers above warning or danger', 'चेतावनी वा खतरा तहमाथि नदी')}</dt><dd>{count(riverAlerts)}</dd><dd className="today-strip-sub">{count(s.rivers_current)} {t('stations reported in 24 h', 'केन्द्रले २४ घण्टामा प्रतिवेदन गरे')}</dd></div>
      <div><dt>{t('Rain stations above warning', 'चेतावनी तहमाथि वर्षा केन्द्र')}</dt><dd>{count(s.rain_stations_above_warning)}</dd><dd className="today-strip-sub">{count(s.rain_current)} {t('stations reported in 24 h', 'केन्द्रले २४ घण्टामा प्रतिवेदन गरे')}</dd></div>
      <div><dt>{t('Incidents in the last 7 days', 'पछिल्लो ७ दिनका घटना')}</dt><dd>{incidents ? `${count(incidents.record_count)}${incidents.complete === false ? '+' : ''}` : count(null)}</dd><dd className="today-strip-sub">{t('BIPAD, all types', 'BIPAD, सबै प्रकार')}</dd></div>
      <div><dt>{t('Latest earthquake', 'पछिल्लो भूकम्प')}</dt><dd>{latest?.magnitude ?? count(null)}</dd><dd className="today-strip-sub">{latest ? [latest.epicentre ?? 'UNKNOWN', latest.date].filter(Boolean).join(', ') : 'NEMRC'}</dd></div>
    </dl>
    <p className="today-strip-note">{t(`Official copy of ${digest.generated_at_nepal}, as published. Not a warning.`, `${digest.generated_at_nepal} को आधिकारिक प्रतिलिपि, प्रकाशित रूपमै। चेतावनी होइन।`)} <Link href="/hazards/">{t('See today in full', 'आज पूरा हेर्नुहोस्')}</Link></p>
  </aside>;
}
