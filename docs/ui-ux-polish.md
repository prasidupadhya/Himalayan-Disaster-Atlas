# UI/UX polish

## Design rationale

The final interface uses a restrained cartographic identity built around deep Himalayan slate, glacier off-white, cool stone, alpine teal and a mineral ochre reserved for caution and modelled research states. The map remains the darkest and highest-contrast working surface; document pages are intentionally quiet so evidence and scientific content lead instead of decoration.

Typography is editorial at the page level and utilitarian inside tools. Display headings use a system-safe book serif stack, while navigation, controls and data use a clean system sans stack. IDs, hashes, coordinates and other machine-oriented strings retain a monospaced treatment. No remote font dependency was added.

Spacing follows an 8 px rhythm with 4 px micro-spacing for labels, badges and control internals. Surfaces use square-to-small radii, hairline rules and low-elevation shadows only where a panel genuinely sits above another surface. Motion is limited to control feedback and state changes, and is disabled under `prefers-reduced-motion`.

Evidence remains semantic before it is decorative. Observed, historical, derived, estimated, modelled, simulated and unknown states retain their existing textual labels and semantic colors, with an additional symbol/border treatment so the distinction never depends on color alone. Modelled scenario panels use a separate mineral treatment and keep the existing research-not-forecast warnings prominent.

Explorer and scientific depth use the same visual grammar rather than separate themes. Primary exploration controls stay flat and close to the map; provenance, method, uncertainty and source material use consistent ruled disclosures and dossier-style details. No new mode switch was invented, so the existing information architecture and keyboard path remain unchanged.

## Major screens: before and after

- **Home:** The previous landing page read primarily as an administrative-boundary feature page. The revised home introduces the complete atlas, a restrained terrain-workspace motif, source-safe administrative coverage statistics, the Observe-to-Evidence research loop and a direct **Explore Nepal** action.
- **Atlas:** The previous desktop composition let a very long control rail dominate the document flow while the map quickly gave way to empty space. The revised desktop workspace gives the map a stable viewport-scale center of gravity and makes the scientific control rail independently scrollable; on mobile, the textual record area visually behaves like a sheet below the bounded map while preserving the existing semantic order and accessible non-map path.
- **Event page:** Event content previously inherited the same generic panel treatment as other tools, and the public unavailable state was mostly empty page space. Event records now read like evidence-led case studies with editorial hierarchy, timeline structure and source callouts; the public unavailable state is an explicit, honest release-boundary notice.
- **Simulation UI:** The simulator previously relied primarily on an orange bordered warning and the surrounding generic control styling. The revised hierarchy makes modelled work visually distinct through a dedicated mineral surface, explicit modelled symbol, stronger warning edge, separated parameter/assumption stages and a clearly differentiated result surface while preserving every warning and assumption.
- **Data Catalog:** The previous catalog presented nearly every release as an equal outlined card. The revised catalog behaves more like a scientific ledger: flatter release rows, stronger category rhythm, an explicit selected-record marker and a dossier-style sticky detail pane for lineage, licensing, limitations and checksums.

## Scientific and engineering boundary

This branch is presentation and interaction polish only. It does not change geospatial algorithms, CRS/projection definitions, source datasets or values, hazard classifications, event mechanisms, exposure calculations, scenario mathematics or assumptions, provenance/evidence semantics, attribution/licensing text, uncertainty calculations, or wording that would change scientific meaning. Existing public-release redistribution boundaries also remain intact.

Map layer data colors and scientific classifications are not reinterpreted. Where the surrounding UI palette changes, evidence and scenario states retain explicit labels and non-color cues. `UNKNOWN` remains distinct from zero, and modelled/simulated output remains visually and textually distinct from observed or historical evidence.
