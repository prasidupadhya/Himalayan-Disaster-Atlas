# Mobile interaction and data-loading contract — feature 36

The mobile Atlas preserves the same scientific meanings, evidence labels and provenance as desktop. Responsive presentation must not hide limitations, convert UNKNOWN to zero, or remove “modelled / not forecast” labels merely to save space.

## Touch and layout (native-app contract, `apps/web/app/styles/`)

Base layout is designed at 375–430 px and scales up; the rules below apply at 800 px and narrower unless noted. `tests/e2e/mobile-app.spec.ts` enforces them on every page.

- **Bottom tab bar.** Map, Today, Scenarios and About sit in a fixed bottom bar (64 px plus the home-indicator inset) with an icon and a text label each; the current page is marked with `aria-current` and a top indicator. The top bar keeps only the brand and the English/नेपाली switch. The body is padded so content never ends under the bar. Landscape phones get a 52 px bar.
- **Safe areas and app chrome.** `viewport-fit=cover` with `env(safe-area-inset-*)` padding, a theme colour, and a web app manifest (`app/manifest.ts`, `display: standalone`) so the atlas can be added to the home screen.
- **Touch targets.** Buttons, fields, selects, disclosures, tabs, map controls and stand-alone links are at least 48 × 48 px, with at least 8 px between neighbours. Checkboxes and radios are 24 px with their whole label row (48 px) as the target. Links inside running text keep text size, as WCAG 2.5.8 allows. The phone minimums live in the `utilities` cascade layer, which outranks page and component styles without `!important`.
- **No sideways scroll.** `overflow-x: clip` (falling back to `hidden`) on `html` and `body`, so sticky elements keep working.
- **Snappy taps.** `touch-action: manipulation` removes the double-tap zoom delay; the grey tap flash is suppressed. Map canvases keep their own gesture handling.
- **Carousels.** The home page's three hazard cards are a horizontal carousel that snaps card by card (`scroll-snap-type: x mandatory`); the district strip in the 3D playback snaps too.
- **Tables as cards.** Data tables with the `stack-mobile` class (official sources, live records, Today's earthquakes, scenario reports, river-simulation comparison) become one card per row. `components/table-labels.tsx` copies each column heading onto its cells (`data-label`), so every value is labelled, in the current language. The table stays a semantic table for screen readers.
- **Keyboards.** Number fields use `inputmode="decimal"` and `enterkeyhint="done"`; search fields use `autocapitalize="none"`, `autocorrect="off"`, `spellcheck="false"` and `enterkeyhint="search"` (IDs like `GLO_87.08…` are never "corrected"); fields use 16 px text so iOS does not zoom.
- **Layout stability.** Space is reserved for content that arrives after load (Today's at-a-glance block, the home strip, loading panels); maps have fixed heights; `main` is at least a screen tall so the footer never flashes up and jumps away; the scenario playback dock keeps a fixed layout while it plays. `tests/e2e/budgets.spec.ts` holds every route to CLS ≤ 0.1 on a phone.
- **Fonts.** Body text uses the device's own fonts for instant rendering (system UI fonts, with Kohinoor/Noto Devanagari for Nepali); only headings use the self-hosted Archivo, swapped in when it arrives.
- **Atlas bottom sheet.** On screens up to 1000 px the map fills the space above a bottom sheet holding the map controls, grouped in five tabs. The sheet has three heights (peek 38%, half 60%, full): drag or tap its handle, or use the arrow keys on it. The map always keeps the space above the sheet, so it is never covered. On short landscape phones the sheet becomes a side panel and the map keeps the full height above the tab bar.
- **Run and Trace bring the map into view first.** On a phone, pressing Run (Scenarios) or Trace downstream (Atlas) scrolls the map under the header (at least 60% visible), and only then starts the animation; focus moves to a status line on the map, which says what is playing. Scenarios adds a "See results" link that moves on to the result heading. With reduced motion the jump is instant and nothing animates. `lib/reveal.ts` (`revealMapThenPlay`) is shared by both; `tests/e2e/redefine.spec.ts` checks it at 390 × 844.
- Simulation, Sources and Methodology collapse to one column without dropping scientific content.

## Mobile bandwidth

The administrative map, Search, Compare, Time Machine, Simulation/Scenario controls, Hazard Graph controls, Location Explorer, Water Change, Terrain, Rivers/downstream tracing and Exposure remain immediately available. On viewports at or below 800 px, larger secondary thematic datasets are deferred behind **Load additional map datasets**. This prevents a phone from fetching mountains, glaciers, glacial lakes, stations, hazard archives, hydropower, population, satellite and climate payloads before the user requests them while preserving the core analytical workflows.

Feature 38 extends the same opt-in gate to desktop and adds an unload action that disposes secondary layers and resets their selections. Once a mobile visitor opts in, the same components, artifacts, checksums, dates, evidence labels and limitations are loaded as on desktop; this is a delivery optimization, not a reduced scientific mode.

## Map interaction

The map retains native MapLibre touch pan/pinch behavior and its controls are enlarged on mobile. A complete administrative identification path remains available below the map through the labelled boundary selector and textual record details, so touch precision is never the only way to inspect a boundary.
