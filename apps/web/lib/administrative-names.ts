import type { Dataset } from '../../../packages/contracts';
type Properties = Dataset['collection']['features'][number]['properties'];
const reviewed: Record<string, { name: string; source: string }> = {
  NP0438401: { name: 'Manang Ngisyang', source: 'https://visit.manangngisyangmun.gov.np/' },
  NP0552: { name: 'Eastern Rukum', source: 'https://en.wikipedia.org/wiki/List_of_districts_of_Nepal#List_of_districts' },
  NP0652: { name: 'Western Rukum', source: 'https://en.wikipedia.org/wiki/List_of_districts_of_Nepal#List_of_districts' },
};
/** Reviewed display names; immutable source names/identifiers remain available. */
export function administrativeName(properties: Properties) {
  return reviewed[properties.pcode ?? '']?.name ?? properties.name;
}
export function administrativeNameReview(properties: Properties) {
  return reviewed[properties.pcode ?? '']?.source;
}
