# Synthesis plan

## Core thesis (1-2 sentences)
The Atlas improves most by being honest before it is bigger: its current defaults understate hazard (rock-site Vs30 everywhere, one ground-motion model, flood speeds slower than any measured Himalayan outburst, origins limited to an official list, single numbers instead of ranges), so the first gains are realistic defaults, ranges and a fixed "hypothetical, not a warning" frame. Its role is pre-event preparedness beside official warnings (place-specific arrival windows, printable bilingual cards, fail-loud data freshness), with expansions shipped only alongside their safeguards and a validation the project can run itself.

## The strongest argumentative beats
1. **Too-slow defaults are the worst error for a public tool** (A, C): 8.7 m/s measured front vs 2/4/6 m/s; at 10 km, ~19 min vs 28/42/83 min.
2. **Real floods outrun a daily copy, but not along the whole river** (B): near field belongs to sirens, neighbours and natural cues; downstream there were hours and what failed was alert content (generic, Nepali-only, no place or time). The Atlas fills that with pre-computed per-place windows.
3. **Peak attenuation cuts both ways** (A): clear-water outbursts attenuate (Cook: 1,500-2,100 to 700-900 m3/s; crossover 45-55 km), cascades grow (Melamchi sediment, 2026 deaths >100 km downstream).
4. **One ground-motion model understates uncertainty in the Himalaya** (A, B, C): preprint ranking; rock default is the bigger defect; Kathmandu risk is long-period, not PGA.
5. **Expansion and framing ship together** (A, C): tiered lake origins with labels; the shared untested assumption is that people won't read scenarios as forecasts.
6. **Language and reach are safety, not courtesy** (B, C): ITU 48.4% individual use; Nepali-first; English for tourist corridors; print as a channel; Devanagari glyph trap in MapLibre.
7. **Grade every recommendation and pair it with a validation** (C).

## Section structure
The ten required H2 headings, verbatim, in order, then ## Sources.

## Per-section commitments
### 1. Where the Atlas Stands Today
- What works; the common pattern (defaults understate, single values hide spread); thesis. Engage Tension 2 (fix defaults not engines) as the organising idea. Include an evidence-grade key (C's A-D scheme).
### 2. Official Data Feeds
- Flood deaths fell 166 to 27 where official warnings worked, so do not compete; failures are last-mile (Sept 2024, 2026). Daily copy boundary condition; fail-loud health, data age, last-good. Use agency levels, not invented ones (orphan tension: thresholds vs probabilistic). CAP: consume, do not emit (Conflict 3). BIPAD licence unknown: ask. Cadence per Conflict 5. Engage Tension 4.
### 3. The Map and Place Search
- Search as a language problem (OSM name/name:ne conventions, transliteration variants per Survey Department). MapLibre Devanagari glyph issue. PMTiles basemap with page-weight budget; test range requests on the actual host. Lines read as rulings (Haughton & White). Global forecast layers only as labelled context (B), weak for rare events.
### 4. Flood and GLOF Scenarios
- Speed bracket and windows (Conflict 2); two-branch peak; breach-size range (Tsho Rolpa 3x); tiered origins with CC BY open inventory and ICIMOD list as separate attributed layer; not-modelled list; hindcasts (2016 Bhote Koshi, Melamchi). Engage Tensions 1 and 5; source tensions 2 and 3.
### 5. Earthquake Scenarios
- Per-cell Vs30 first (bake into population cells, near-zero download cost); Gorkha hindcast then ensemble (Conflict 4); basin long-period caveat (3-5 s resonance, bedrock-depth site term); lowest band not "light" (stone masonry fragility); why scenarios exist (preparedness). Source tension 1.
### 6. Serving Nepali Users
- Who can open it (MICS vs ITU reconciled as units); page budget ~1 MB, 3D opt-in; modest PWA cache; Nepali-first parallel writing; English as safety language; WCAG, text/table equivalents; teach the natural cue. Engage Tension 3.
### 7. Printable Reports, Trust and Risk Communication
- Misreading is the risk (tsunami map studies: 47% confused hazard with evacuation maps; 1 in 4 missed need to evacuate). Fixed bilingual frame; ranges as headline; soft bands, no safe/unsafe words; arrival card per place; provenance; print from accessible HTML. Avoid rival authority (orphan tension Haughton & White). Bands vs gradients settled by test.
### 8. Missing Hazards and Capabilities
- Landslides as context from incident records, not forecasts; cascades as a hazard class; impact-based information; earthquake early warning is out of scope; transboundary catchments.
### 9. Impact, Partnerships and Sustainability
- OpenDRI: no self-sustaining revenue, data goes stale; GeoNode sustained by software community (self-reported); zero running cost; partner with KLL/ICIMOD/DHM; written data-use confirmation; measure use (simple privacy-respecting analytics) to replace assumptions about reach.
### 10. Prioritised Roadmap
- Near-term and medium-term tables with evidence grade, cost, validation; validation tasks with decision rules; what not to do; what would change the ordering; forward-looking paragraph.

## Where drafts disagreed
- See synthesis-conflicts.md: commit to C on CAP and cadence; to A's band (C's 3/6/9 implementation) on speed; order Gorkha test then ensemble.
- Draft B's near-real-time ambition: adopt its "content of alerts failed, not detection" insight and its per-place arrival card; reject publishing alerts or promising sub-hourly cadence.

## Length target
- response_format: argumentative (5000-10000 words)
- Pass 1 target: ~8,500 words
- Pass 2 final target: ~7,500 words (hard ceiling 9,000)
