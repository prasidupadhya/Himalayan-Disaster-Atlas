# Design system

The atlas has one visual language across every page.
- **Live reference:** `/design/`. It is not linked from the site, is not indexed, and is not part of the offline shell.
- **Styles:** `apps/web/app/styles/`.
- **React primitives:** `apps/web/components/ui/`.

## Principles

1. **The map is the stage.** Every interactive map sits on the same dark plate (`--stage`) in both themes, with the same control cluster. Pages around it are quiet, so that the map, and the hazard colours on it, carry the attention.
2. **Meaning is never colour alone.**
   - Status is a glyph, a word and a colour: ▲ above danger, △ above warning, ● below warning, ○ no reading, ◇ modelled, ↺ last known.
   - Map layers differ by shape (line, dot, area) as well as colour.
3. **Science is frozen.** Visual changes never alter a number, range, unit, label of certainty, attribution or limitation. UNKNOWN is a word, not a blank and not a zero.
4. **Both languages are first class.**
   - Every string lives in a typed `{ en, ne }` copy module.
   - Nepali headings get their own leading and tracking (`:lang(ne)`).
   - Numbers use Devanagari digits wherever the page already did.
5. **Phones first.**
   - Touch targets are at least 48 × 48 px with 8 px gaps (enforced in the last cascade layer).
   - There is no sideways scroll.
   - Safe areas are respected.
   - The four destinations sit in a bottom tab bar.

## Cascade layers

```
@layer reset, tokens, vendor, base, components, layout, pages, utilities;
```

Every stylesheet starts with that order statement and puts its rules in one layer.

| Layer | What goes in it |
|---|---|
| `reset` | Box sizing, margins, form inheritance |
| `tokens` | Every design token, light and dark (`app/styles/tokens.css`) |
| `vendor` | MapLibre's stylesheet, wrapped by `scripts/prepare-map-worker.mjs` into `apps/web/generated/maplibre.css` |
| `base` | Elements: type, links, tables, forms, details |
| `components` | Primitives: buttons, segmented, tabs, cards, stats, badges, notices, states, sheet, scrubber, legend, steps, map chrome, evidence |
| `layout` | The app shell: top bar, navigation and tab bar, banners, footer, page frames |
| `pages` | One file per route (`app/<route>/<route>.css`, `app/home.css`, `app/prose.css`) |
| `utilities` | `.sr-only`, phone touch targets, reduced motion, print |

**`!important`** is used in one place: the reduced-motion override in `utilities`, which must beat inline and third-party animation. MapLibre's own stylesheet contains `!important` declarations; they stay inside `vendor`.

## Tokens

### Colour roles

These are the only colours in the site's CSS. Map styles in `lib/map-layers.ts`, the terrain tint, the scenario stage's cartographic palette (`--map-*` in `simulate.css`) and `--map-quake` in `live.css` encode data, so they stay identical in both themes.

| Role | Tokens | Use |
|---|---|---|
| Surfaces | `--bg`, `--surface`, `--surface-2`, `--surface-3` | Page, raised cards, sunken groups, tracks |
| Ink | `--ink`, `--ink-2`, `--ink-3` | Text, secondary text, notes |
| Lines | `--line`, `--line-2` | Hairlines, control borders |
| Accent | `--accent`, `--accent-ink`, `--accent-soft`, `--on-accent` | River blue: primary actions, links, selection |
| Focus | `--focus` | A 3 px focus ring, always visible on keyboard focus |
| Stage | `--stage`, `--stage-2`, `--stage-line`, `--on-stage`, `--on-stage-2` | Map plates, the playback dock, map chips |
| Hazards | `--hz-flood`, `--hz-glof`, `--hz-quake` | Identity of the three hazards (cards, tabs). Never status |
| Status | `--danger`, `--warning`, `--normal`, `--none`, plus their `-soft` backgrounds | Station and source status, always with a glyph and a word |
| Modelled | `--model`, `--model-soft` | Hypothetical scenario output, always with ◇ and a written label |

**Dark theme.** It is chosen, not inverted. The page sinks to the stage's slate, so maps sit *in* the page, and accents lift to keep AA contrast.

**Theme choice.** The reader picks the theme in the top bar: match the device, light, or dark. The choice is stored per device (`atlas-theme`) and applied before first paint by an inline script (`lib/theme-boot.ts`), so a dark choice never flashes light. The browser chrome colour follows the resolved theme.

### Other tokens

- **Type.**
  - Text uses the device's own fonts, which render instantly and include Devanagari.
  - Headings use self-hosted Archivo Variable with its width axis (`font-stretch` 100–118%).
  - The scale is 1.25 from 16 px: `--step--2` … `--step-5`.
  - Leading is 1.6 for text and 1.12 for headings.
  - The measure is 68ch.
  - Figures are tabular wherever they are compared.
- **Space.** A 4 px base: `--s-1` (4) to `--s-9` (96); `--gutter` is fluid from 16 to 48 px.
- **Radii.**
  - `--r-1`: 6 px, for controls.
  - `--r-2`: 10 px, for panels.
  - `--r-3`: 16 px, for cards and sheets.
  - `--r-pill`.
- **Elevation.** `--elev-1` to `--elev-3`.
- **Motion.**
  - Easing curves: `--ease-out` and `--ease-in-out`.
  - Durations: `--t-fast` (120 ms, feedback), `--t-med` (220 ms, panels), `--t-slow` (420 ms, the sheet and the one camera move).
  - Reduced motion removes them all.
- **Layers.** `--z-map-ui`, `--z-sticky`, `--z-sheet`, `--z-tabbar`, `--z-toast`, `--z-stage-full`.
- **Shell metrics.** `--header-h` and `--tabbar-h` (phone values set at ≤ 800 px; slimmer in short landscape), and `--safe-*` insets.

## Primitives

All primitives are in `components/ui`, exported from `components/ui/index.ts`.

| Primitive | Notes |
|---|---|
| `Button` | `primary` (one per screen), `secondary` (the look of a bare `<button>`), `quiet`; `block`, `sm` |
| `IconButton` | The label is required and becomes the accessible name and the tooltip |
| `Icon` | 24 px line icon, decorative (`aria-hidden`) |
| `Segmented` | Pressed buttons in a group: language, theme, 2D/3D |
| `Tabs` / `TabPanel` | ARIA tabs with Arrow, Home and End keys; panels stay mounted, so form state survives switching |
| `Sheet` | Side panel on wide screens; on phones a bottom sheet with `peek`, `half` and `full` heights. Drag or tap the handle, or use ArrowUp and ArrowDown on it. The caller owns the snap state |
| `Card` | Raised or `quiet` |
| `Stat` / `Stats` | Figure, label and note in a `<dl>` |
| `Badge` | `danger`, `warning`, `normal`, `none`, `model`, `info`, each with its glyph |
| `Notice` | Boxed message for scenario, problem, last-known or info |
| `DataTable` | Semantic table with a caption. On phones each row becomes a labelled card (`components/table-labels.tsx` copies the headings) |
| `Disclosure` | `<details>` with a large summary and a chevron |
| `Skeleton` | Space reserved at its final size, so nothing jumps when content arrives |
| `EmptyState` / `ErrorState` | What happened and what to do next (retry) |
| `OfflineBadge` / `useOnline` | ↺ in the top bar while offline |
| `useToast` | A short, politely announced confirmation |
| `Legend` | Shape, colour and text for every entry |
| `ProgressSteps` | A real sequence with the current step marked (used by Scenarios) |
| `Scrubber` | Range input with labelled ends and a spoken value |

**Resource states** keep their established names and classes (`DataState`: loading, empty, stale, error, unavailable), restyled as `.data-state`.

## Copy

- Each feature has a `copy.ts` or `copy.tsx` file.
- Client components read the current language with `useCopy(MODULE)`. Server components use `bilingual(MODULE)` from `lib/copy.tsx`.
- Values may be strings, functions for interpolated text, or JSX when a sentence contains links or emphasis.
- Data tables that carry their own translations (province names, station statuses, evidence codes, policy text) remain lookups beside their data.
- The methodology is long-form, so it is one article per language (`app/methodology/article-en.tsx`, `article-ne.tsx`) with identical section ids.

**Language switching is deferred.** The switch updates at once; the page text follows in a low-priority render (`LanguageProvider` with `useDeferredValue`), so a tap never waits on re-rendering a long page.

## Maps

- One stage, one control cluster (zoom and compass, reset, legend), and one message chip style.
- Labels on the scenario stage remain HTML markers, not MapLibre symbol layers.
  - MapLibre GL JS 6.7 cannot shape Devanagari (conjuncts and vowel signs would be wrong).
  - The static site ships no glyph files.
  - Collision culling keeps them readable.

## Adding to the system

1. Add or reuse a token. Never write a raw colour in page CSS.
2. Put rules in the right layer. A page style that needs `!important` is in the wrong layer.
3. Add the copy to the feature's copy module in both languages.
4. Show any new primitive on `/design/`.
