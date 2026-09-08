# AI Analyst — feature 31

`/analyst/` provides a public, read-only question interface connected to feature 30 evidence retrieval and existing verified geospatial outputs. Its **local evidence mode** is an explicit, deterministic assistant. It does not pretend to be a connected language model. No model provider, account, backend, API key, external request, analytics, persisted conversation or runtime database is required; it works with the static Cloudflare/Vercel export.

## Supported questions

The question planner accepts complete English forms, ignoring case, repeated whitespace and final punctuation:

| Category | Supported forms | Evidence / operation |
| --- | --- | --- |
| Methodology | `Explain water change`, `Describe rivers`, `How does the scenario engine work?`, `What are the limitations of glacial lakes?` | Exact excerpts from the selected approved project document |
| Downstream | `Trace downstream from HYRIV 40669746`, `What lies downstream of 40669746?` | Both verified river partitions, existing NEXT_DOWN topology validation and trace algorithm |
| Prepared scenario | `Summarize scenario scenario-pulse-40669746`, `Explain scenario scenario-network-40669746` | Exact registered scenario request/result/path, existing schema and equation validation |

Methodology topics are Rivers (including the downstream-trace alias), Glacial Lakes, Exposure Engine, Water Change, Time Machine, Hazard Graph, Scenario Engine and Simulation UI. See `ANALYST_TOPICS` for the explicit aliases and retrieval queries. “Method”, “assumptions” and “limitations” question forms are supported; answers are qualified excerpts, not a claim to comprehensively answer each aspect.

The planner matches the whole question. It never ignores a second ID or trailing instruction, follows an arbitrary URL, executes retrieved instructions, picks a similarly named object or snaps to a nearby river. River names cannot be resolved by the source inventory and require an exact HYRIV ID. An unknown ID stays absent from the retained release rather than becoming a different entity. Each question is independent: “it”, “there”, implicit prior locations, mixed operations and unsupported free-form questions are refused with scope guidance.

Local safety, forecasts, travel-time estimates from river geometry, event comparisons, arbitrary exposure measurements and glacier/lake outlet inference are outside this assistant's supported operations. The Atlas still exposes other features directly. Empty retrieval never establishes absence, safety or zero impact.

## Evidence and calculations

`schemas/analyst-request.schema.json` and `packages/contracts/analyst.ts` validate the bounded 1–500-character question and explicit as-of timestamp. `apps/web/lib/analyst.ts` is the only orchestration adapter. It does not interpolate question text into data paths. Unsupported questions need no data download. Supported questions first verify the existing RAG corpus, then load only the relevant registered data. River manifests must exactly match the two build-pinned manifests in addition to the normal schema/artifact checks. The scenario loader already pins and verifies every request, result and pathway artifact.

Methodology retrieval uses an exact document filter before ranking. This small extension to the RAG contract prevents top-k results from related documents being mistaken for the intended topic; it does not change the immutable corpus. At most two complete source paragraphs are selected, preserving source identity, SHA-256, section, line spans, version date, publication/access dates and dataset input hashes. `assessEvidenceClaim` requires exact attributed source text. The answer remains qualified because retrieval cannot prove completeness or independently establish truth.

Downstream answers call the existing `buildRiverNetwork` and `traceDownstream`. The count includes the selected reach; length sums whole source LENGTH_KM values and preserves the existing 0.001 km display precision. Termination distinguishes a missing retained NEXT_DOWN target from a null source pointer. The fixture-free published regression starts at HYRIV 40669746, retains 180 reaches, sums 517.970 km and stops before HYRIV 40768704. These are derived network quantities, not a flood footprint, travel time or affected-asset inventory. The downloadable answer includes every ordered reach ID, method, CRS, input versions/hashes and limitations. The UI bounds its inline reach list to 200 records.

Scenario answers summarize only the requested registered run after validating identity and equations. Pathway length and pulse discharge remain MODELLED with the original model version, input versions, request fingerprint, processing date, assumptions and validation status. Missing depth stays null/UNKNOWN. The assistant cannot turn a Level 1 network result into a Level 2 pulse, infer hydraulic outputs or substitute one run for another. All hypothetical and partial-coverage limitations remain visible.

Claims explicitly distinguish source statements, calculations, modelled quantities and interpretations. Unsupported interpretations such as safety/confirmed damage have null values displayed as UNKNOWN. Unknowns remain distinct from real zero. Citations link each claim to its exact document snapshot or versioned source manifest; source panels expose dates, licence/UNKNOWN, hashes, methods and limitations. Document attribution does not relabel project documentation as an observation.

## Grounding and failure rules

The final answer is constructed only by the trusted deterministic composer. `verifyAnalystAnswer` can independently rebuild it from the original trusted request and verified inputs, rejecting any changed measurement, unit, question, entity, citation, prose or omitted limitation. It deliberately does not accept a rewritten answer merely because citations exist. This is an exact output-integrity check, not a semantic entailment model; callers must never let untrusted output supply its own trusted request or data.

Reviewed conflicting assertion groups are inherited from RAG. A relevant disagreement produces a qualified response quoting every alternative, without computing or choosing a preferred conclusion. Outdated document versions and passed source deadlines prevent supported answers; unknown freshness is labelled and never called current. Arbitrary prose contradictions remain beyond the lexical conflict detector, as documented for RAG. Tests use explicitly synthetic disagreement annotations; no invented geographic assertions are published.

Downloads and decompression retain the existing bounded loaders. The page shows loading, unavailable and validation-error states with retry. Cancel, clear, replacement requests and unmount abort work; late results from a replaced question cannot overwrite the current answer. Only one answer remains in page memory. Download is an explicit user action, with the answer, submitted question/as-of instant, evidence, ordered trace and provenance. No saved server-side history exists.

The assistant renders question/source text as escaped text, without Markdown/HTML execution or model-driven tools. In a later deployment with an actual language model, provider credentials and calls must live in a separately secured server/worker, outside this static browser build. That integration must preserve the exact-identity, validated-tool and evidence constraints; model-generated interpretations must not bypass them. This release is usable without that optional service and clearly discloses its deterministic scope.

## Verification and preview

Run `npm run check` and `npm run test:e2e -- tests/e2e/analyst.spec.ts tests/e2e/rag.spec.ts`. Tests cover all topic routes, exact citations, hallucinated numbers, citation/request substitution, wrong/missing entities, absent/stale/conflicting evidence, scenario identity and null depth, unsupported URLs, download provenance, failed-load retry, cancellation and mobile layout.

`npm run dev` serves the analyst at `http://127.0.0.1:3000/analyst/`. The same route is available in the root production static export. No new upstream dataset or redistribution licence is introduced.
