# Redefine — weakness audit

Baseline: `main` at `edb768e` (25 October 2026), built with the root build and served gzip-compressed, as a CDN would.

**Phone metrics** were measured at 390 × 844 with Lighthouse's slow-4G profile: 150 ms latency, 1.6 Mbps down, and 4× CPU slowdown. Service workers were blocked, so these are first visits. INP is the slowest event during one representative tap: the language switch.

**Accessibility** was checked with axe-core 4.13 (WCAG 2.0 / 2.1 / 2.2 A and AA, plus best practice) on every route, in English and Nepali, at 390 and 1440 px.

Raw data:
- `audit-before.json` (the baseline below)
- [`screens/before/`](screens/before)
- After the redesign: `audit-after.json`, `audit-main-rerun.json` (`main` re-measured back to back, as the fair comparison) and [`screens/after/`](screens/after), every route in English and Nepali, light and dark, at 390 and 1440 px

The script is reproducible (the redesign keeps it in `scripts/ui-audit.mjs`).

Findings are ranked by user impact. Each one has a **Plan**, written before the redesign. The final section records what was actually done.

## Measured baseline

| Route | LCP ms | CLS | INP ms | Map usable ms | Transfer KB (JS) |
|---|---:|---:|---:|---:|---:|
| `/` | 1656 | 0 | 552 | — | 480 (253) |
| `/atlas/` | 1324 | 0.181 | 736 | 17 050 | 685 (511) |
| `/hazards/` | 1904 | **0.418** | 672 | — | 462 (319) |
| `/simulate/` | 3188 | **0.392** | 712 | 8 073 | 717 (576) |
| `/simulate/report/` | 2812 | **0.807** | 256 | — | 443 (311) |
| `/live/` | 900 | 0.033 | 744 | — | 687 (556) |
| `/official/` | 704 | 0.186 | 768 | — | 399 (262) |
| `/methodology/` | 956 | 0 | **848** | — | 432 (253) |
| `/sources/` | 880 | 0 | 640 | — | 412 (256) |
| `/licenses/` | 924 | 0 | 672 | — | 402 (256) |
| `/offline/` | 752 | 0 | 272 | — | 437 (303) |

- **axe:** 2 distinct violations.
  - `color-contrast` (serious) on `/atlas/` at desktop: the map caption chip.
  - `landmark-unique` (moderate) on `/live/` in English.
- **Heading outline:** one `h1` per page and no skipped levels on any route.
- **Offline shell:** 4 194 201 of 4 194 304 bytes, which leaves 103 bytes of headroom.
  - `/`: 685 KB
  - `/methodology/`: 678 KB
  - `/sources/`: 546 KB
  - JS/CSS: 2.06 MB

## Findings

### 1. Phones: Run (Scenarios) and Trace (Map) leave the animation off screen — critical

**Confirmed.**
- `features/simulator/reveal.ts:8` scrolls to the result heading, which on phones sits *below* the map, and moves focus there.
- `features/simulator/player.tsx` starts playback only when an `IntersectionObserver` sees 50% of the map (threshold 0.5). After the reveal scroll the map is above the viewport, so on a phone playback either never starts or the reader must scroll back up.
- In the atlas, `features/atlas/atlas.tsx` `onTrace` calls `document.getElementById('downstream-trace')?.scrollIntoView({ block: 'nearest' })`, which targets the panel, not the map.
- `features/downstream-trace/downstream-trace.tsx` starts its `requestAnimationFrame` loop immediately (4 s), so it is mostly over before the map is visible.

**Plan:**
- One helper, `lib/reveal.ts` → `revealMapThenPlay()`, is shared by both features.
- When the map is not beside the controls, it scrolls the map into view, offset for the sticky header and the tab bar.
- It waits until the map is at least 60% visible (or the scroll has settled), then frames the path, and only then starts the animation.
- Focus moves to a live status line on the map. Results get a "See results" link and never take the scroll position during playback.
- Reduced motion: an instant jump, the final state shown, and a replay button.
- Tests: `redefine › reveal` at 390 × 844.

### 2. Layout shift on Today, Scenarios and the Report — high

**Confirmed** (CLS 0.418, 0.392, 0.807).
- The Today hero grows when the digest arrives.
- The simulator's loader renders a different, shorter shell than the loaded page.
- The report replaces a one-line status with full tables.

**Plan:**
- Loaders render the final frame with skeletons of the final size.
- The report reserves its sections.
- The scenario stage has a fixed aspect from the first paint.

### 3. Slow taps (INP 552–848 ms on a throttled phone) — high

**Confirmed.**
- Switching language re-renders every bilingual string through context-free hooks, and on `/methodology/` it re-renders 130 `<T>` islands.
- Every map page re-renders its whole panel on each language change.

**Plan:**
- Long-form pages render each language once as a static block and swap visibility, so they no longer re-render 130 islands.
- Feature copy is read from typed objects, with no inline closures created per render.
- The language and theme switches update in a `startTransition`, so the tap paints at once.

### 4. The offline shell has no headroom — high

**Confirmed** (103 bytes free).
- `/` carries the 120 KB province outline four times: once in the HTML, again in the inline flight data, and in each of 3 prefetch files.
- `/methodology/` carries both languages' text in three RSC files.

**Plan:** fix without changing the published policy.
- The overview map became a client component, so its geometry ships once, in the JS chunk already shared with Today's earthquake map.
- The long-form article bodies moved into client content modules, rendered to HTML once.
- The shell shrinks (numbers in `docs/performance.md`), and `atlas-live-offline-shell@1.1.0` is unchanged.

### 5. No styling system — high (maintainability, consistency and dark mode)

**Confirmed.**
- 119 KB of CSS in 8 sheets, 152 distinct hex colours and 38 custom properties.
- 47 `!important`, mostly because `mobile.css` must beat page sheets that load later.
- About 45 selectors are dead: Analyst, Data Catalog, Compare, Event pages, Search, Location explorer, Climate, Water, Temporal, Population and others removed in the October refocus.
- There is no dark theme.

**Plan:**
- One token file (`app/styles/tokens.css`) with fewer than 40 colour roles, and a chosen dark theme.
- Cascade layers: `reset, tokens, vendor, base, components, layout, pages, utilities`.
- MapLibre's own CSS is wrapped in the `vendor` layer.
- `!important` remains only in the reduced-motion override, which is documented.
- Dead CSS was removed.

### 6. Copy is handled two ways — medium

**Confirmed.**
- Inline `t('…', '…')` in 27 files and `<T>` islands in 9 files, while `copy.ts` modules exist for only 4 features.
- `atlas.tsx` lines exceed 1 000 characters, mixing layout, copy and logic.

**Plan:**
- Every feature reads typed `{ en, ne }` copy from its own `copy.ts(x)`.
- Long-form pages have one content module per language.

### 7. The atlas is a long scrolling panel — high on phones, medium on desktop

**Confirmed.**
- On a phone the map is followed by about 9 screens of controls, with the boundary records after them.
- Choosing a lake and pressing Trace scrolls the page away from the map.
- On desktop the floating panel is one long column, the Reset button and the caption chip collide with it, and the caption fails contrast (axe, finding 12).

**Plan:**
- Desktop: a left panel with five tabs (Lakes, Rivers, Terrain, Boundaries, Infrastructure) that keep their old anchors.
- Phone: a bottom sheet with peek, half and full heights over a full-height map.
- Reset view joined the map control cluster.
- The legend opens from the cluster.

### 8. Scenario flow and duplication — medium

**Confirmed.**
- The flood and earthquake panels duplicate their step shell, assumptions box, acknowledgement and run button.
- "Watch in 3D" is a scroll shortcut.
- On a phone the hero, notice and tabs push the map below the fold.

**Plan:**
- A shared `ScenarioSteps` shell with a progress indicator (choose → set → watch and read).
- A compact notice.
- On phones the map stage comes first and the steps follow.
- "Watch in 3D" was replaced by reveal-map-then-play.

### 9. Map labels are DOM markers culled by hand — low

**Evaluated, partly refuted.**
- Moving names to MapLibre symbol layers would need glyph PBFs that the static site does not ship.
- More importantly, MapLibre GL JS 6.7 has no complex-script shaping for Devanagari: conjuncts and vowel signs would render incorrectly, so the Nepali names would be wrong. That is a correctness failure.
- DOM labels are screen-aligned HTML text, so they are not soft at high pitch.

**Plan:** keep DOM labels and cut the collision cost.
- Boxes are measured once per frame batch from projected positions; there is no `getComputedStyle` per label.
- Labels are hidden during fast camera moves and re-solved at rest.

### 10. Information hierarchy — medium

**Tab names:** Map, Today, Scenarios and About stay. They tested clear in the earlier review.

**Plan:**
- *Today* and *Official* now share the same stat cards, badges and freshness lines.
- Every page head has a one-line purpose and one primary action.

### 11. States — medium

- Loading, empty, error, offline and stale exist, but each page styles them differently.
- Map loading is a bare text chip.

**Plan:**
- One `DataState` look.
- Skeletons sized to their content.
- An `OfflineBadge` in the top bar while offline.

### 12. Contrast and colour — medium

**Confirmed:** the axe `color-contrast` failure on the atlas caption chip.

**Plan:** Both themes were re-checked with axe on every route, in both languages (test `redefine › axe`).

### 13. Nepali typography — low

- Headings used English tracking (`letter-spacing: -.05em`) and condensed width, which crowds Devanagari.
- Line height was too tight for matras.

**Plan:** with `:lang(ne)` heading rules: no negative tracking, 1.3 leading and normal width.

### 14. Print — low

- The report printed the app chrome in some states.
- Other pages printed the tab bar.

**Plan:** A `utilities` print layer hides chrome everywhere, and the report has a print-first layout.

### 15. Standalone (installed app) — low

- The theme colour was fixed to white even in dark mode.
- There was no safe-area padding at the top of the sticky header.

**Plan:**
- The theme colour follows the resolved theme.
- The top bar pads for `safe-area-inset-top`.

### 16. Bundle and initial work — medium

**Confirmed.**
- Map routes ship 511–576 KB of JS (compressed) before the map library loads.
- The live page ships the bulletin, the map and all tables at once.

**Plan:**
- No route bundle grows (budget test).
- The theme and UI primitives are small and shared.
- **Deferred:** splitting MapLibre further, because its worker and main bundle are already separate, and the remaining weight is the library itself.

## What was done

Each finding, as delivered on `feat/redefine`. Where the work differs from its plan, the difference is stated. Measurements are in the next section.

1. **Run and Trace on phones — fixed.** `lib/reveal.ts` (`revealMapThenPlay`) is shared by both. It scrolls the map under the header (offset for the header and the tab bar) until at least 60% is visible, then plays. It waits for an `IntersectionObserver` threshold, `scrollend`, or a 1.2 s timeout. Scenarios focus the playback status line on the stage, announce the start, and offer **See results**. The Atlas lowers its sheet to peek, then focuses a trace status line drawn on the map. Reduced motion: the jump is instant and Scenarios stay at their end state with Play available. Differences from plan: the path is not re-framed before playing, because the player already frames it when the scene loads. Scenarios also keep their old autoplay-when-visible, so behaviour on a wide screen is unchanged. Tests: `redefine › phones › *`.
2. **Layout shift — fixed.** Today 0.418 → 0, Report 0.807 → 0, Scenarios 0.383 → 0, Official 0.186 → 0, Atlas 0.181 → 0.039. Loaders hold their final size: the report shows skeletons, Today and Official reserve their summaries, the scenario loading screen holds a screen's height, and `main` is at least a screen tall, so the footer never flashes up and jumps away. The Atlas map key now starts folded, and the attribution text stays hidden until it is asked for. Test: `budgets › *` holds every route to CLS ≤ 0.1 on a phone.
3. **Slow taps — fixed.** INP 216–864 ms → 40–136 ms on the throttled phone (median of three runs; the Atlas measured between 64 and 312 ms across runs). The language switch renders at low priority (`useDeferredValue`) while the pressed state updates at once. Copy is read from typed modules. Difference from plan: long-form pages ship one client article per language instead of swapping visibility, which also shrank the offline shell.
4. **Offline shell headroom — fixed without a new policy.** 4.00 MiB → 3.21 MiB of the 4 MiB budget. The Nepal overview and the methodology text moved into client modules, so they ship once in a script instead of being repeated in HTML, inline flight data and prefetch files. `atlas-live-offline-shell@1.1.0` is unchanged.
5. **Styling system — done.** `app/styles/tokens.css` defines the colour roles, including a chosen dark theme and a high-contrast variant (see `design-system.md`). Cascade layers: `reset, tokens, vendor, base, components, layout, pages, utilities`. MapLibre's CSS is generated into the `vendor` layer. There is one `!important`, the documented reduced-motion override. `globals.css` and `mobile.css` are gone, and with them the dead selectors.
6. **Copy — done.** Every feature reads typed `{ en, ne }` copy from its own module (`useCopy` in client components, `bilingual` in server ones). Official sources, which still had about 30 inline language ternaries, moved to `features/official/copy.tsx` word for word. The Live map's skip link and the Nepali methodology's contents label were English-only, and are now translated.
7. **Atlas panel — done.** Five tabs (Lakes, Rivers, Terrain, Boundaries, Infrastructure) keep their old anchors, so `/atlas/#lake-controls` opens the Lakes tab. Desktop has a side panel. Phones get a bottom sheet with peek, half and full heights under a map that always keeps the rest of the screen. Short landscape phones get a side panel. Reset joined the map control cluster. Difference from plan: the map key is a chip on the map rather than opening from the cluster; it holds the same entries and text.
8. **Scenario flow — done.** Shared `Step`, `Assumptions` and `RunControls` pieces and a three-step progress indicator (choose → set and confirm → watch and read). The notice is compact. On phones the stage comes first with its dock underneath, and the dock keeps a fixed layout while it plays. "Watch in 3D" is gone; Run brings the stage into view.
9. **Map labels — kept as DOM, collision made cheaper.** The collision pass now reads every label box, then writes only the flags that changed: one layout pass instead of one per label. Difference from plan: labels are still measured with `getBoundingClientRect` (once each) and are not hidden during fast camera moves. The batched pass already re-solves at most seven times a second, so hiding them would only make them flicker.
10. **Hierarchy — done.** Today, Official and Live share stat tiles and status badges with a glyph. Official's summary is five tiles; a raised figure takes the tone of its word. Tab names are unchanged.
11. **States — done.** One `DataState` look, skeletons sized to their content (Report, Official, Today), and an offline badge in the top bar.
12. **Contrast — done.** axe reports no violations on any route, in English with the light theme at 390 px and in Nepali with the dark theme at 1440 px (`axe › *`, 22 runs). The audit script also runs all four language and theme combinations at both widths.
13. **Nepali typography — done** with `:lang(ne)` heading rules.
14. **Print — done.** Report: A4 with the notice kept together, links spelled out, header rows repeated, and rows never split. Dark tokens apply to screens only, so paper always gets light ink.
15. **Standalone — done.** The boot script owns the one `theme-color` meta and sets it from the resolved theme before paint (React had been duplicating the server-rendered meta). The header pads for `safe-area-inset-top`.
16. **Bundle — met, with one trade-off.** Total transfer is level with `main`, and initial JS is about 10 kB (gzip) above it (theme menu and UI primitives). Next prefetches the methodology text, which now ships as a script, so measured JS is about 90–130 kB higher while flight data shrank by the same amount. Along the way, the 40 kB province outline had slipped into a chunk every page loaded; it now loads only on Home and Today. Loading screens show each page's heading and intro, so largest paint came down: Today 1.73 → 0.51 s, Scenarios 2.82 → 0.59 s, Report 2.47 → 0.53 s. Home was 1.22 → 1.42 s in the final back-to-back run and 0.62 s in the run before, within its spread. Page HTML is held to 240 kB per route (`budgets › *`). Deferred, as planned: splitting MapLibre further.

Also found and fixed during the work:
- The scenario dock's height changed as the status text changed, so "See results" moved under the reader's finger.
- The phone header's `backdrop-filter` stopped the tab bar from staying fixed.
- MapLibre's attribution button was partly covered by Reset and by the sheet edge.
- MapLibre's canvas name duplicated the Live map section's name.
- Hazard-relief shading was deliberately left unchanged, because re-tuning it would change how steepness reads.

## Measured after

Median of three throttled phone runs, `main` and `feat/redefine` measured back to back. The full table, and what moved each number, is in [`docs/performance.md`](../performance.md#october-2026-redesign-featredefine).

- **axe:** no violations in 88 runs (every route; English and Nepali; light and dark; 390 and 1440 px). Before: `color-contrast` on the Atlas and `landmark-unique` on Live.
- **CLS:** at most 0.039 on any route, against up to 0.807 before.
- **INP:** 40–136 ms, with one Atlas run at 312 ms, against 216–864 ms.
- **Offline shell:** 3.21 MiB, against 4.00 MiB.
