# Accessibility contract — feature 37

Accessibility is part of the Atlas correctness contract. A scientific label, limitation, result or source that is available only through color, precise pointer interaction or WebGL is not considered fully delivered.

## Landmarks and navigation

- The application has one root `<main>` landmark per page.
- A keyboard-visible skip link targets that main landmark.
- Primary navigation has an accessible name.
- The interactive map has a separate keyboard skip link to the equivalent administrative boundary selector and textual record details.
- Data Catalog and Sources are content inside the root main landmark rather than nested `main` landmarks.

## Forms, states and dynamic focus

Inputs/selects/textareas use native labels or explicit accessible names. Loading/unavailable/error components expose status/alert semantics with atomic announcements. Search selection, Data Catalog detail, Compare results, Analyst answers and Simulation results move focus to the newly requested content so keyboard/screen-reader users do not have to rediscover it manually.

Focus movement is reserved for user-triggered changes; background data loading must not steal focus.

## Maps, charts and tables

The map is a visual navigation surface, not the only information path. Administrative records have a labelled non-map selector and text detail. The map carries a text alternative explaining that relationship.

Climate charts use an SVG title and full 12-month textual description. Scientific comparison tables retain captions and row/column headers. Mobile overflow preserves the semantic table instead of replacing it with visually arranged divs.

Images use meaningful alt text when they carry information. Decorative visual keys use `aria-hidden` only when the same meaning is already stated in adjacent text.

## Evidence/status communication

Observed, historical, derived, estimated, modelled/simulated, unavailable and unknown meanings are written as text. Color can reinforce those distinctions but cannot be the sole signal. `prefers-contrast: more` strengthens borders/text variables, and `forced-colors` mode adds system-color borders to evidence/status containers.

## Automated checks

Playwright performs a structural audit over the core public routes for:

- exactly one main landmark;
- at least one level-one page heading;
- labels on visible form controls;
- names on visible buttons and links;
- `alt` on images;
- captions on tables.

Keyboard E2E additionally verifies the global skip link, map skip link, Search result focus, Data Catalog detail focus and Simulation-result focus. A forced-colors check verifies evidence remains text-labelled with visible borders.

`tests/e2e/axe.spec.ts` runs axe-core (WCAG 2.0/2.1/2.2 A and AA plus best practice) on every route twice: in English, light theme, at phone width, and in Nepali, dark theme, at desktop width. Every run must report no violations. The redesign fixed the two the October 2026 audit found (contrast of the Atlas map caption; a Live map canvas whose name duplicated its section) and three it introduced along the way (the attribution button partly covered by the Reset button and by the sheet edge; scrolling table wrappers on Official that no longer need to scroll).

## Themes, motion and focus after an action

- Light, dark or the device setting, chosen from the theme menu in the header and remembered. Dark is its own palette, checked by axe, and applies to screens only: print always uses the light tokens.
- Status words carry a glyph as well as a colour (▲ danger, △ warning, ● normal, ○ none, ◇ modelled, ⓘ information).
- After Run or Trace on a phone, focus moves to the status line on the map, not to a heading that is off screen; the start of playback is announced in a polite live region. Reduced motion switches the reveal to an instant jump and leaves playback paused at its end state.
- Atlas tabs follow the ARIA tabs pattern (arrow keys, Home, End). Links to an old panel anchor such as `/atlas/#lake-controls` open the right tab and focus it.

These automated checks complement manual screen-reader, zoom/reflow, contrast and keyboard review; they are not a claim of universal WCAG conformance.
