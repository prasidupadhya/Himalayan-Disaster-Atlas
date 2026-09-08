import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import schema from '../../schemas/event-page.schema.json';
import type { Dataset } from './index';

export type EventImpactKind = 'deaths' | 'injured' | 'missing' | 'affected' | 'estimated_loss';

export interface EventPage {
  schema_version: '1.0.0';
  event_id: string;
  dataset_id: string;
  dataset_version: string;
  title: string;
  date: string;
  location: { label: string | null; longitude: number; latitude: number; relationship: 'reported incident point'; source_path: string };
  hazard: { value: string; source_path: string };
  description: { value: string | null; source_path: string };
  impacts: Array<{ kind: EventImpactKind; value: number | null; unit: 'person' | 'NPR'; source_path: string }>;
  timeline: Array<{ label: 'Incident time' | 'Reported time'; time: string; source_path: string }>;
  sources: Array<{ label: string; dataset_id: string; dataset_version: string; manifest_path: string; source_url: string | null }>;
  uncertainty: string[];
  related_datasets: Array<{ label: string; href: string; relationship: 'context only — not asserted as causally related' }>;
  verification: { verified: boolean; approved: boolean };
}

const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);
const validate = ajv.compile<EventPage>(schema);

export function parseEventPage(input: unknown): EventPage {
  if (!validate(input)) throw new Error(`Invalid event page: ${ajv.errorsText(validate.errors)}`);
  const page = input as EventPage;
  const kinds = page.impacts.map(item => item.kind);
  if (new Set(kinds).size !== 5 || !['deaths', 'injured', 'missing', 'affected', 'estimated_loss'].every(kind => kinds.includes(kind as EventImpactKind))) {
    throw new Error('Event page impact inventory is incomplete');
  }
  if (page.timeline[0]?.label !== 'Incident time' || page.timeline[0]?.time !== page.date) throw new Error('Event page incident timeline is inconsistent');
  return page;
}

export function eventSourcePath(dataset: Dataset, featureId: string) {
  return `${dataset.metadata.artifact.path}#feature:${encodeURIComponent(featureId)}`;
}

export function buildEventPage(dataset: Dataset, featureId: string): EventPage {
  const feature = dataset.collection.features.find(item => String(item.id) === featureId);
  if (!feature || feature.properties.entity_type !== 'disaster_event' || feature.geometry.type !== 'Point') throw new Error('Event page requires a disaster-event point');
  const properties = feature.properties;
  const sourcePath = eventSourcePath(dataset, featureId);
  const timeline: EventPage['timeline'] = [{ label: 'Incident time', time: properties.event_time!, source_path: sourcePath }];
  if (properties.reported_time) timeline.push({ label: 'Reported time', time: properties.reported_time, source_path: sourcePath });
  const page: EventPage = {
    schema_version: '1.0.0',
    event_id: featureId,
    dataset_id: dataset.metadata.dataset_id,
    dataset_version: dataset.metadata.dataset_version,
    title: properties.name,
    date: properties.event_time!,
    location: {
      label: properties.street_address ?? null,
      longitude: feature.geometry.coordinates[0],
      latitude: feature.geometry.coordinates[1],
      relationship: 'reported incident point',
      source_path: sourcePath,
    },
    hazard: { value: properties.hazard_name!, source_path: sourcePath },
    description: { value: properties.event_description ?? null, source_path: sourcePath },
    impacts: [
      { kind: 'deaths', value: properties.reported_deaths ?? null, unit: 'person', source_path: sourcePath },
      { kind: 'injured', value: properties.reported_injured ?? null, unit: 'person', source_path: sourcePath },
      { kind: 'missing', value: properties.reported_missing ?? null, unit: 'person', source_path: sourcePath },
      { kind: 'affected', value: properties.reported_affected ?? null, unit: 'person', source_path: sourcePath },
      { kind: 'estimated_loss', value: properties.estimated_loss_npr ?? null, unit: 'NPR', source_path: sourcePath },
    ],
    timeline,
    sources: [{
      label: properties.source_label ?? properties.data_source_name ?? dataset.metadata.source,
      dataset_id: dataset.metadata.dataset_id,
      dataset_version: dataset.metadata.dataset_version,
      manifest_path: `/data/${dataset.metadata.dataset_id}/${dataset.metadata.dataset_version}/manifest.json`,
      source_url: dataset.metadata.source_url,
    }],
    uncertainty: [
      'The source geometry is a reported incident point, not an affected-area or hazard footprint.',
      ...dataset.metadata.limitations,
    ],
    related_datasets: [
      { label: 'Atlas map', href: `/atlas/?lon=${feature.geometry.coordinates[0]}&lat=${feature.geometry.coordinates[1]}`, relationship: 'context only — not asserted as causally related' },
      { label: 'Data catalog', href: '/data-catalog/', relationship: 'context only — not asserted as causally related' },
      { label: 'Sources', href: '/sources/', relationship: 'context only — not asserted as causally related' },
    ],
    verification: { verified: properties.verified!, approved: properties.approved! },
  };
  return parseEventPage(page);
}
