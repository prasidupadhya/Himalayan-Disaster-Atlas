# Synthesis conflicts

## Conflict 1: BSSA14 bias in the Himalaya
- Draft A says BSSA14's mean normalised residual is +1.14 at 0.01 s in the western/central Himalaya [arxiv241005918v1-physicsgeo-ph-8-oct-2024].
- Source check: the extracted tables list BSSA14 "Mean Z" first-column values of 1.14 in one regional table and 1.05 in the other; extraction does not cleanly label which table is which region. Both show positive residuals near +1 at the shortest periods (recorded shaking above the model median), rank D at short periods. ZHAO06/KAN06 are closer to zero at short periods.
- **Verdict:** keep the claim but phrase it as "about +1 standard deviation at the shortest periods" and attribute to a preprint; do not convert to "a factor of two" as a sourced number (label it an approximation if kept).

## Conflict 2: near-source flood speed
- Draft A: mid-reach 5-9 m/s band anchored on Cook 2018 (8.7 m/s), derives a rough 15-20 m/s near-source from official 2026 timeline, flags fragility.
- Draft B: 52 m/s near-source decaying to 6.4-7.2 m/s (2026 preprint), 12.8 / 38.8 min timings.
- Draft C: 3/6/9 m/s bracket.
- Source check: Cook 2018 (peer-reviewed) 8.7 m/s front, 5 m/s second pulse; 2026 figures from two non-independent preprints of an ice-rock avalanche mass flow, not a moraine GLOF; official accounts give trigger 08:40, rise ~09:00, no alert time.
- **Verdict:** default bracket about 3-9 m/s (C's 3/6/9 is a clean implementation of A's band), shown as one arrival window per place; a separately labelled mass-flow cascade case with higher near-source speed, numbers marked as preprint-derived. Quote 12.8/38.8 only as preprint figures, never as official.

## Conflict 3: should the Atlas publish CAP?
- Draft B: build a CAP reader now and publish a bilingual CAP mirror.
- Draft C: consume CAP only; an unofficial CAP feed risks aggregators treating it as official.
- Source check: CAP carries urgency/severity/certainty fields designed for alerting authorities (OASIS spec, WMO register of alerting authorities); DHM lacks legal authority to order evacuation; no live DHM CAP feed found.
- **Verdict:** commit to Draft C. Build a CAP reader so the Atlas can show DHM alerts the day the feed exists; offer pre-written bilingual message templates to DHM/NDRRMA rather than publishing CAP itself.

## Conflict 4: when to switch the ground-motion model
- Drafts A and B: adopt a small ensemble (BSSA14, ASK14, ZHAO06/KAN06) and show spread.
- Draft C: gate the ensemble behind a Gorkha 2015 hindcast.
- **Verdict:** do both in order: the Gorkha station/ShakeMap comparison is cheap and comes first; switch to the ensemble if BSSA14's bias is confirmed (expected). Vs30 per cell ships before either.

## Conflict 5: refresh cadence for live data
- Draft B: sub-hourly mirror (15-30 min).
- Draft C: daily until health signals are stable for 60 days, then hourly for the two confirmed BIPAD JSON endpoints.
- **Verdict:** Draft C's sequencing; B's point that scheduled CI runs can be delayed becomes a reason to show data age prominently, not to promise cadence. Cadence numbers are judgement calls, labelled as such.

## Conflict 6: 2026 Bhotekoshi casualties
- Sources differ by date (469 bodies by police count at one date, 359 recovered and 977 missing in NDRRMA SitRep 6 at 27 Aug 10 PM).
- **Verdict:** quote dated figures with their source and date, or avoid totals.
