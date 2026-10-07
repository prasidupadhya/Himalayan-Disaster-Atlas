# Scenario sharing and reports — Feature 57

- **Share link:** after a run the URL carries `?s=<base64url JSON>` with only the scenario parameters (≤ 2,048 characters, schema-checked on decode, unknown keys dropped). Nothing is stored on a server and no account exists.
- **Download scenario JSON:** the same parameters plus the scenario notice.
- **Printable report** (`/simulate/report/?s=…`): recomputes the scenario in the browser from the checksum-verified releases, lists every input release with the SHA-256 of its manifest, the scenario JSON, results, all release limitations and the UNKNOWN list, and links DHM, NDRRMA and BIPAD as the authorities. "Print / save as PDF" uses the browser's print dialog with a print stylesheet; "Download report JSON" exports the same content.
- The report's generated time is the viewer's clock and is labelled as such.
- Every report and export carries "Scenario / educational estimate, not a forecast or warning".
