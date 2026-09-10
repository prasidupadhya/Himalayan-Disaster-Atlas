import ledger from '../../../licensing/datasets.json';
// A boolean literal supplied by webpack, never a browser environment lookup.
declare const __ATLAS_PUBLIC_RELEASE__: boolean;
export const isPublicRelease = __ATLAS_PUBLIC_RELEASE__;
const reviews = new Map(Object.entries(ledger.reviews));
export function isReleaseIncluded(key: string, seen = new Set<string>()): boolean {
  if (!isPublicRelease) return true;
  const review = reviews.get(key);
  if (!review || seen.has(key)) return false;
  return review.status === 'PERMITTED' && review.parents.every(parent => isReleaseIncluded(parent, new Set([...seen, key])));
}
