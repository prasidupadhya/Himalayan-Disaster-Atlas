'use client';
import { useT } from '../lib/i18n';
import type { Resource } from '../lib/resource';

/** Nepali for the fixed status messages that loaders and map layers report; any other diagnostic stays as written. */
const KNOWN_MESSAGES_NE: Record<string, string> = {
  'This dataset is currently unavailable.': 'यो डेटासेट हाल उपलब्ध छैन।',
  'Dataset checksum failed.': 'डेटासेटको चेकसम (checksum) मिलेन।',
  'Dataset response has no content.': 'डेटासेटको प्रतिक्रियामा कुनै सामग्री छैन।',
  'Unable to load data.': 'डेटा लोड गर्न सकिएन।',
  'Glacial lake inventory unavailable': 'हिमताल अभिलेख उपलब्ध छैन',
  'River network unavailable': 'नदी सञ्जाल उपलब्ध छैन',
  'Terrain unavailable': 'भू-आकृति उपलब्ध छैन',
  'Terrain tiles could not be verified. Retry to reload this layer.': 'भू-आकृति टाइलहरू प्रमाणित गर्न सकिएन। यो तह फेरि लोड गर्न पुनः प्रयास गर्नुहोस्।',
  'Glacier inventory unavailable': 'हिमनदी अभिलेख उपलब्ध छैन',
  'Hydropower inventory unavailable': 'जलविद्युत् अभिलेख उपलब्ध छैन',
  'Infrastructure inventory unavailable': 'पूर्वाधार अभिलेख उपलब्ध छैन',
  'Simulation basis unavailable.': 'सिमुलेसनको आधार उपलब्ध छैन।',
};

export function DataState({ state, retry }: { state: Resource<unknown>; retry?: () => void }) {
  const t = useT();
  if (state.status === 'ready') return null;
  const messages = {
    loading: t('Loading and validating dataset…', 'डेटासेट लोड र प्रमाणीकरण गर्दै…'),
    empty: t('No features are available in this dataset.', 'यस डेटासेटमा कुनै विशेषता (feature) उपलब्ध छैन।'),
    stale: t('This dataset has passed its update deadline. The archived data remains available.', 'यो डेटासेट अद्यावधिक गर्ने समयसीमा नाघिसकेको छ। संग्रहित डेटा भने उपलब्ध छ।'),
    error: t('The dataset could not be validated.', 'डेटासेट प्रमाणित गर्न सकिएन।'),
    unavailable: t('The dataset is currently unavailable.', 'डेटासेट हाल उपलब्ध छैन।'),
  };
  return <div className={`data-state ${state.status}`} role={state.status === 'error' ? 'alert' : 'status'} aria-live={state.status === 'error' ? 'assertive' : 'polite'} aria-atomic="true">
    <p>{messages[state.status]}</p>
    {'message' in state && <p>{t(state.message, KNOWN_MESSAGES_NE[state.message] ?? state.message)}</p>}
    {retry && (state.status === 'error' || state.status === 'unavailable') && <button onClick={retry}>{t('Try again', 'फेरि प्रयास गर्नुहोस्')}</button>}
  </div>;
}
