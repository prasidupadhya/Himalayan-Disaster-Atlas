'use client';
import { useCopy, useLanguage } from '../lib/i18n';
import { DATA_STATE } from './copy';
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
  const [lang] = useLanguage();
  const c = useCopy(DATA_STATE);
  if (state.status === 'ready') return null;
  return <div className={`data-state ${state.status}`} role={state.status === 'error' ? 'alert' : 'status'} aria-live={state.status === 'error' ? 'assertive' : 'polite'} aria-atomic="true">
    <p>{c[state.status]}</p>
    {'message' in state && <p>{lang === 'ne' ? KNOWN_MESSAGES_NE[state.message] ?? state.message : state.message}</p>}
    {retry && (state.status === 'error' || state.status === 'unavailable') && <button onClick={retry}>{c.retry}</button>}
  </div>;
}
