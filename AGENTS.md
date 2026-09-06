# Working in Himalayan Disaster Atlas

Read `README.md`, `docs/architecture/README.md`, and the relevant feature specification before editing. The user-supplied master brief remains the product authority; do not copy its credential-bearing attachment into this repository.

- One feature branch and one AI owner per feature. Foundation: `feat/foundation`, Astra. Keep unrelated feature work separate. No automatic merge or direct push to main.
- Keep the website static-first, public and read-only. Credentials and acquisition jobs belong outside the browser. Use the root build command and preserve its security checks.
- Use the central schema, validators, units, CRS conventions, layer lifecycle and resource states. Version immutable artifacts; never silently overwrite a published version.
- Unknown is null in data and UNKNOWN in presentation. Synthetic fixtures must be explicit. Never invent geographic facts, causal relationships, hazard levels or measurements.
- Document source/version/license, processing, assumptions and limitations before publishing real data. Simulations are hypothetical modelled outputs, not forecasts.
- Run `npm run check` and relevant `npm run test:e2e` coverage. Update architecture/data/methodology/source documentation alongside changes.
- Final visual polish is a separate assigned feature. Do not let visual changes alter scientific meaning.
