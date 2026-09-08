# Historical event pages

Feature 23 turns validated BIPAD disaster-event records into readable source-backed views at `/events/`.

## Evidence model

The reader derives its fields directly from one already validated event feature. It does not generate a narrative or add inferred mechanism, affected area, hazard footprint, casualty, damage, or financial values. Every displayed factual group exposes the normalized release feature path that supplied it. Source zeros remain zero; absent values render as `UNKNOWN`.

Incident time and reported time remain distinct. The BIPAD point is described only as a reported incident point and must not be interpreted as the geographic extent of the event. Dataset limitations and source metadata remain visible through the same Evidence component used by the Atlas.

## Static delivery

The site does not pre-render tens of thousands of event routes. `/events/` is one static route that loads one immutable, checksum-verified year partition at a time. A `year` + stable event `id` query pair creates a shareable view without a runtime API, user account, or server database.

## Scope

Only records marked `verified` and `approved` by the normalized source fields are offered as event pages. The page can link to the Atlas, Data Catalog, Sources and Methodology, but those are context links rather than asserted causal relationships.
