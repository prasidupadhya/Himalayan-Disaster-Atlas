import type { ReactNode } from 'react';
import offline from '../../../../packages/contracts/offline-shell-policy.json';

const neDigits = (value: number) => String(value).replace(/[0-9]/g, d => '०१२३४५६७८९'[Number(d)]);

/** Offline page copy. Nepali is project-authored and needs native-speaker review before operational reliance. */
const en = {
  offline: 'Offline',
  pageNotSavedDevice: 'This page is not saved on this device.',
  youAppearOfflinePage: 'You appear to be offline, and this page was not part of the saved offline shell. Reconnect to load it.',
  savedPages: 'Saved pages',
  officialForecastsWarningsFollow: 'For official forecasts and warnings, follow',
  and: ' and ',
  whenYouBackOnline: 'when you are back online.',
  alsoNepali: (<p lang="ne">तपाईं अफलाइन हुनुहुन्छ र यो पृष्ठ यस उपकरणमा सुरक्षित छैन। लोड गर्न इन्टरनेटमा पुनः जडान गर्नुहोस्।</p>) as ReactNode,
  lastKnown: <>Live conditions shown offline are <strong>LAST KNOWN</strong> copies saved on this device, with the time they were saved. They are not rechecked and are never shown as current. Copies older than {offline.live_retention_seconds / 86400} days are deleted.</>,
};
export const OFFLINE: { en: typeof en; ne: typeof en } = {
  en,
  ne: {
    offline: 'अफलाइन',
    pageNotSavedDevice: 'यो पृष्ठ यस उपकरणमा सुरक्षित गरिएको छैन।',
    youAppearOfflinePage: 'तपाईं अफलाइन हुनुहुन्छ जस्तो देखिन्छ, र यो पृष्ठ सुरक्षित अफलाइन शेलमा समावेश थिएन। यसलाई लोड गर्न पुनः जडान गर्नुहोस्।',
    savedPages: 'सुरक्षित पृष्ठहरू',
    officialForecastsWarningsFollow: 'आधिकारिक पूर्वानुमान र चेतावनीका लागि, पुनः अनलाइन भएपछि',
    and: ' र ',
    whenYouBackOnline: 'लाई पछ्याउनुहोस्।',
    alsoNepali: null,
    lastKnown: <>अफलाइन देखाइने प्रत्यक्ष अवस्थाहरू यस उपकरणमा सुरक्षित गरिएका <strong>{offline.last_known.ne} (LAST KNOWN)</strong> प्रतिहरू हुन्, जसमा सुरक्षित गरिएको समय देखाइन्छ। तिनलाई पुनः जाँच गरिँदैन र कहिल्यै हालको रूपमा देखाइँदैन। {neDigits(offline.live_retention_seconds / 86400)} दिनभन्दा पुराना प्रतिहरू मेटाइन्छन्।</>,
  },
};
