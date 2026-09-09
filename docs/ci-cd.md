# Quality and release preparation

Feature 39 runs `Atlas quality / Quality and static browser tests` for every pull request and main push. The job uses read-only repository permissions, no acquisition or deployment secrets, SHA-pinned Actions, pinned Node/Python versions, `npm ci`, and the complete Python lockfile. Fork code runs with `pull_request`, never `pull_request_target`. Caches store dependency downloads, not unverified application output.

`npm run check` validates immutable releases (including practical geometry/topology checks), runs Python/frontend tests, TypeScript and both linters, scans source/output for credentials, and invokes the root production build. The complete Chromium suite then exercises that export, including WebGL failure, data corruption, accessibility, mobile and performance smoke budgets. Only a passing job uploads the static artifact, named by commit SHA. It expires after seven days; failed browser traces have the same retention.

The static build requires no environment variables or private API. Deployment credentials must only exist in a deployment environment, never a public variable or build input. Missing deployment configuration must fail before uploading and must never print values. Dataset reacquisition is outside this workflow.

Repository administrator setup: require this exact quality check in the main branch ruleset, require pull-request review, and prevent bypass/direct pushes. Workflow YAML cannot enable those repository settings itself. Disable independent automatic production deployments that bypass this gate; the production workflow/configuration is described in [deployment](deployment.md). A failed or cancelled quality job must not publish its output. A retry uses the same commit and lockfiles; a changed dependency or dataset requires a new reviewed commit. Never work around a failing schema/security/licensing check by invoking Next directly.

To reproduce locally, follow the root README installation commands, then run `npm run check` and `npm run test:e2e`. The static export uses only checked-in presentation data; national source acquisition is unnecessary. Runner hardware/browser software rendering can differ from the reference profiling machine; see [performance](performance.md).

References: [GitHub workflow permissions and events](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax), [workflow artifacts](https://docs.github.com/en/actions/tutorials/store-and-share-data).
