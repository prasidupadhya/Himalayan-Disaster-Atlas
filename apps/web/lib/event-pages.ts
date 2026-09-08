import type { Dataset } from '../../../packages/contracts';
import { buildEventPage, type EventPage } from '../../../packages/contracts/event-page';
import { DISASTER_EVENT_MANIFESTS, loadDataset } from './datasets';

export const EVENT_YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015] as const;

function manifestForYear(year: number) {
  const path = DISASTER_EVENT_MANIFESTS.find(item => {
    const match = item.match(/events-(\d{4})(?:-(\d{4}))?\//);
    if (!match) return false;
    const start = Number(match[1]);
    const end = Number(match[2] ?? match[1]);
    return year >= start && year <= end;
  });
  if (!path) throw new Error('Unsupported event year');
  return path;
}

export async function loadEventYear(year: number, signal?: AbortSignal): Promise<Dataset> {
  return loadDataset(manifestForYear(year), signal);
}

export function verifiedEventPages(dataset: Dataset, year: number, query = ''): EventPage[] {
  const needle = query.trim().toLocaleLowerCase('en-US');
  return dataset.collection.features
    .filter(feature => feature.properties.entity_type === 'disaster_event' && feature.properties.event_year === year && feature.properties.verified && feature.properties.approved)
    .filter(feature => !needle || feature.properties.search_terms?.some(term => term.toLocaleLowerCase('en-US').includes(needle)))
    .slice()
    .sort((a, b) => (b.properties.event_time ?? '').localeCompare(a.properties.event_time ?? '') || String(a.id).localeCompare(String(b.id)))
    .slice(0, 200)
    .map(feature => buildEventPage(dataset, String(feature.id)));
}
