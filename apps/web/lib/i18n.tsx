'use client';
import { useCallback, useSyncExternalStore } from 'react';

/** Interface language shared by /live/, /simulate/ and /hazards/. Scientific source text stays in its source language. */
export type Lang = 'en' | 'ne';
const KEY = 'atlas-lang';
const listeners = new Set<() => void>();
function read(): Lang {
  try { return window.localStorage.getItem(KEY) === 'ne' ? 'ne' : 'en'; } catch { return 'en'; }
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  const storage = (event: StorageEvent) => { if (event.key === KEY) listener(); };
  window.addEventListener('storage', storage);
  return () => { listeners.delete(listener); window.removeEventListener('storage', storage); };
}
export function useLanguage(): [Lang, (lang: Lang) => void] {
  const lang = useSyncExternalStore(subscribe, read, () => 'en' as Lang);
  const set = useCallback((next: Lang) => {
    try { window.localStorage.setItem(KEY, next); } catch { /* per-device convenience only */ }
    listeners.forEach(listener => listener());
  }, []);
  return [lang, set];
}

const NE_DIGITS = '०१२३४५६७८९';
export const digits = (text: string, lang: Lang) => lang === 'ne' ? text.replace(/[0-9]/g, d => NE_DIGITS[Number(d)]) : text;
export function formatNumber(value: number | null, lang: Lang, fraction = 0) {
  if (value === null || !Number.isFinite(value)) return lang === 'ne' ? 'अज्ञात (UNKNOWN)' : 'UNKNOWN';
  return digits(value.toLocaleString('en-US', { maximumFractionDigits: fraction, minimumFractionDigits: fraction }), lang);
}

export function LanguageSwitch({ lang, onChange, label = 'Language / भाषा' }: { lang: Lang; onChange: (lang: Lang) => void; label?: string }) {
  return <div className="language-switch" role="group" aria-label={label}>
    <button type="button" lang="en" aria-pressed={lang === 'en'} onClick={() => onChange('en')}>English</button>
    <button type="button" lang="ne" aria-pressed={lang === 'ne'} onClick={() => onChange('ne')}>नेपाली</button>
  </div>;
}

/** Project-authored Nepali interface copy; requires native-speaker review before operational reliance. */
export const UI = {
  en: {
    scenarioNotice: 'Scenario / educational estimate, not a forecast or warning',
    authoritiesLead: 'Official forecasts and warnings come only from',
    simTitle: 'Scenario simulator',
    simIntro: 'Run clearly labelled educational scenarios and see which mapped assets and populations a hypothetical hazard corridor or shaking field could intersect — as ranges, with every assumption shown before you run.',
    tabFlood: 'Flood & GLOF corridor', tabQuake: 'Earthquake shaking',
    step1: 'Choose a release point', step2: 'Declare assumptions', step3: 'Results',
    run: 'Run scenario', running: 'Running…', acknowledge: 'I understand this is a hypothetical educational scenario, not a forecast or warning, and that its assumptions are shown above.',
    share: 'Copy share link', copied: 'Link copied', download: 'Download scenario JSON', report: 'Open printable report',
    unknownPhysical: 'Not modelled — UNKNOWN', assumptions: 'Assumptions shown before running', limitations: 'Limitations',
    glofGroup: 'Glacial lakes (GLOF release points)', riverGroup: 'Rivers entering the mapped network (flood release points)',
    loading: 'Loading and verifying model inputs…', failed: 'Model inputs could not be verified. No result is shown.', retry: 'Try again',
    population: 'Population', assets: 'Mapped assets', distance: 'Distance along path', arrival: 'Front arrival', peak: 'Peak passes', end: 'Pulse ends',
    damage: 'Inundation depth, flood extent, building damage, casualties and losses', notModelled: 'UNKNOWN — not modelled by this scenario. See Feature 50/52 unlock conditions.',
  },
  ne: {
    scenarioNotice: 'परिदृश्य / शैक्षिक अनुमान — पूर्वानुमान वा चेतावनी होइन',
    authoritiesLead: 'आधिकारिक पूर्वानुमान र चेतावनी यिनबाट मात्र आउँछन्:',
    simTitle: 'परिदृश्य सिमुलेटर',
    simIntro: 'स्पष्ट रूपमा चिनाइएका शैक्षिक परिदृश्य चलाउनुहोस् र काल्पनिक जोखिम करिडोर वा कम्पन क्षेत्रले कुन नक्सांकित संरचना र जनसंख्यालाई छुन सक्छ भन्ने दायराका रूपमा हेर्नुहोस्। चलाउनुअघि हरेक मान्यता देखाइन्छ।',
    tabFlood: 'बाढी र हिमताल विस्फोट करिडोर', tabQuake: 'भूकम्पीय कम्पन',
    step1: 'सुरुवात बिन्दु छान्नुहोस्', step2: 'मान्यताहरू घोषणा गर्नुहोस्', step3: 'नतिजा',
    run: 'परिदृश्य चलाउनुहोस्', running: 'चल्दैछ…', acknowledge: 'यो काल्पनिक शैक्षिक परिदृश्य हो, पूर्वानुमान वा चेतावनी होइन, र यसका मान्यताहरू माथि देखाइएका छन् भन्ने मैले बुझेँ।',
    share: 'साझा लिङ्क प्रतिलिपि', copied: 'लिङ्क प्रतिलिपि भयो', download: 'परिदृश्य JSON डाउनलोड', report: 'छाप्न मिल्ने प्रतिवेदन खोल्नुहोस्',
    unknownPhysical: 'मोडेल गरिएको छैन — अज्ञात (UNKNOWN)', assumptions: 'चलाउनुअघि देखाइएका मान्यताहरू', limitations: 'सीमाहरू',
    glofGroup: 'हिमतालहरू (हिमताल विस्फोट सुरुवात बिन्दु)', riverGroup: 'नक्सांकित सञ्जालमा प्रवेश गर्ने नदीहरू (बाढी सुरुवात बिन्दु)',
    loading: 'मोडेल इनपुट लोड र प्रमाणित गर्दै…', failed: 'मोडेल इनपुट प्रमाणित गर्न सकिएन। कुनै नतिजा देखाइएको छैन।', retry: 'फेरि प्रयास गर्नुहोस्',
    population: 'जनसंख्या', assets: 'नक्सांकित संरचना', distance: 'मार्गको दूरी', arrival: 'अग्रभाग आइपुग्ने', peak: 'शिखर पार हुने', end: 'प्रवाह सकिने',
    damage: 'डुबानको गहिराइ, बाढीको क्षेत्र, भवन क्षति, हताहत र नोक्सानी', notModelled: 'अज्ञात (UNKNOWN) — यस परिदृश्यले मोडेल गर्दैन। सुविधा ५०/५२ खुल्ने सर्तहरू हेर्नुहोस्।',
  },
} as const;
export type UIKey = keyof typeof UI.en;
