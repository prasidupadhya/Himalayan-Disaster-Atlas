import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
export function excludedReleases() {
  const { reviews } = JSON.parse(readFileSync(fileURLToPath(new URL('../licensing/datasets.json', import.meta.url)), 'utf8'));
  const blocked = (key, chain = new Set()) => {
    if (!reviews[key] || chain.has(key)) throw new Error(`Invalid release lineage: ${key}`);
    return reviews[key].status !== 'PERMITTED' || reviews[key].parents.some(parent => blocked(parent, new Set([...chain, key])));
  };
  return Object.keys(reviews).filter(key => blocked(key)).sort();
}
export const releaseDirectory = key => `/data/${key.replace('@', '/')}/`;
// These controls require an excluded release, directly or through discovery/evidence.
export const unavailableFeatures = [
  'hydrology/hydrology', 'rainfall/rainfall', 'disaster-events/disaster-events',
  'floods/floods', 'landslides/landslides', 'population/population',
  'exposure-engine/exposure-engine', 'hazard-graph/hazard-graph',
  'time-machine/time-machine', 'search/search', 'compare-mode/compare-mode',
  'location-explorer/location-explorer', 'event-pages/event-pages',
  'evidence/evidence', 'ai-analyst/analyst',
];
