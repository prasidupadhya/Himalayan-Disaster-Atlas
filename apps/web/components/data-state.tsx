import type { Resource } from '../lib/resource';
export function DataState({ state, retry }: { state: Resource<unknown>; retry?: () => void }) {
  if (state.status === 'ready') return null;
  const messages = {
    loading: 'Loading and validating dataset…',
    empty: 'No features are available in this dataset.',
    stale: 'This dataset has passed its update deadline. The archived data remains available.',
    error: 'The dataset could not be validated.',
    unavailable: 'The dataset is currently unavailable.',
  };
  return <div className={`data-state ${state.status}`} role={state.status === 'error' ? 'alert' : 'status'} aria-live={state.status === 'error' ? 'assertive' : 'polite'} aria-atomic="true">
    <p>{messages[state.status]}</p>
    {'message' in state && <p>{state.message}</p>}
    {retry && (state.status === 'error' || state.status === 'unavailable') && <button onClick={retry}>Try again</button>}
  </div>;
}
