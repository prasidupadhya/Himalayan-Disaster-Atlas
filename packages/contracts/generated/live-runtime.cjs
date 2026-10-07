// Generated from live.ts and validation-errors.ts; do not edit.
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LIVE_UNITS = exports.PRODUCT_LABELS = exports.EVIDENCE_LABELS = exports.LIVE_AUTHORITIES = exports.SCENARIO_NOTICE = exports.LIVE_NOTICE = exports.LIVE_SNAPSHOT_BYTES = exports.LIVE_INDEX_BYTES = void 0;
exports.validationErrors = validationErrors;
exports.compiledValidator = compiledValidator;
exports.parseLiveSnapshot = parseLiveSnapshot;
exports.parseLiveIndex = parseLiveIndex;
exports.validateLivePair = validateLivePair;
exports.workflowHealth = workflowHealth;
exports.liveFreshness = liveFreshness;
exports.assertLivePublicationAllowed = assertLivePublicationAllowed;
exports.assertReviewedLiveSource = assertReviewedLiveSource;
/** AJV's default error text, without importing its runtime compiler. */
function validationErrors(errors) {
    if (!errors?.length)
        return 'No errors';
    return errors.map(error => `data${error.instancePath} ${error.message}`).join(', ');
}
/** Attach the schema's TypeScript type to AJV's generated boolean validator. */
function compiledValidator(source) {
    const validate = (value) => {
        const valid = source(value);
        validate.errors = source.errors;
        return valid;
    };
    return validate;
}
const live_index_cjs_1 = __importDefault(require("./live-index.cjs"));
const live_snapshot_cjs_1 = __importDefault(require("./live-snapshot.cjs"));
const live_policy_json_1 = __importDefault(require("../live-policy.json"));
const live_sources_json_1 = __importDefault(require("../../../licensing/live-sources.json"));
exports.LIVE_INDEX_BYTES = 65_536;
exports.LIVE_SNAPSHOT_BYTES = 524_288;
exports.LIVE_NOTICE = 'Periodically updated conditions; not a real-time warning service.';
exports.SCENARIO_NOTICE = 'Scenario / educational estimate, not a forecast or warning';
exports.LIVE_AUTHORITIES = live_policy_json_1.default.authorities;
exports.EVIDENCE_LABELS = { observed: 'OBSERVED', reported: 'REPORTED', derived: 'DERIVED', modelled: 'MODELLED', hypothetical: 'HYPOTHETICAL', unknown: 'UNKNOWN' };
exports.PRODUCT_LABELS = { observation: 'Observation', reported_event: 'Reported event', forecast: 'Model forecast', official_warning: 'Official warning', scenario: 'Hypothetical scenario', unknown: 'UNKNOWN' };
exports.LIVE_UNITS = { magnitude: 'magnitude', depth: 'km', precipitation_accumulation: 'mm', precipitation_rate: 'mm/h', temperature: 'degC', water_level: 'm', discharge: 'm3/s', pm25: 'ug/m3', aqi: 'dimensionless' };
const validateIndex = compiledValidator(live_index_cjs_1.default);
const validateSnapshot = compiledValidator(live_snapshot_cjs_1.default);
const time = (value) => value === null ? null : Date.parse(value);
const sameTime = (a, b) => time(a) === time(b);
function requireCondition(condition, message) { if (!condition)
    throw new Error(message); }
function fixtureIdentity(feed, fixture) {
    requireCondition((feed === 'contract-fixture') === fixture, 'Live fixture identity mismatch');
}
function safeSource(url) {
    const parsed = new URL(url);
    requireCondition(parsed.protocol === 'https:' && !parsed.username && !parsed.password, 'Live source URL must be credential-free HTTPS');
}
function chronological(earlier, later, message) {
    requireCondition(earlier === null || (later !== null && time(earlier) <= time(later)), message);
}
function parseLiveSnapshot(input) {
    if (!validateSnapshot(input))
        throw new Error(`Invalid live snapshot: ${validationErrors(validateSnapshot.errors)}`);
    const snapshot = input;
    fixtureIdentity(snapshot.feed_id, snapshot.is_fixture);
    requireCondition(snapshot.dataset_id === (snapshot.is_fixture ? 'atlas-live-contracts' : `live-${snapshot.feed_id}`), 'Live dataset identity mismatch');
    safeSource(snapshot.source.url);
    if (snapshot.source.license_url)
        safeSource(snapshot.source.license_url);
    requireCondition(snapshot.is_fixture || snapshot.source.raw_sha256 !== null, 'Live source bytes require a checksum');
    chronological(snapshot.source_issued_at, snapshot.fetched_at, 'Live issue time follows fetch');
    chronological(snapshot.freshness.as_of, snapshot.fetched_at, 'Live freshness time follows fetch');
    const { product_type: product, evidence_type: evidence } = snapshot;
    requireCondition(product !== 'forecast' || evidence === 'modelled', 'Forecast must remain modelled');
    requireCondition(product !== 'reported_event' || evidence === 'reported', 'Event must remain reported');
    requireCondition(product !== 'observation' || ['observed', 'derived'].includes(evidence), 'Observation evidence mismatch');
    requireCondition(product !== 'official_warning' || (evidence === 'reported' && snapshot.source.is_official && snapshot.feed_id === 'dhm'), 'Official warning authority mismatch');
    requireCondition(product !== 'scenario' || (evidence === 'hypothetical' && snapshot.assumptions.length > 0), 'Scenario needs hypothetical evidence and assumptions');
    requireCondition(product !== 'unknown' || evidence === 'unknown', 'Unknown product evidence mismatch');
    requireCondition(new Set(snapshot.records.map(record => record.id)).size === snapshot.records.length, 'Duplicate live record');
    for (const record of snapshot.records) {
        if (record.source_url)
            safeSource(record.source_url);
        chronological(record.source_revision_at ?? null, snapshot.fetched_at, 'Revision follows fetch');
        requireCondition(record.evidence_type === evidence, 'Live record evidence mismatch');
        chronological(record.observed_at, snapshot.fetched_at, 'Observation follows fetch');
        chronological(record.issued_at, snapshot.fetched_at, 'Record issue follows fetch');
        requireCondition((record.valid_from === null) === (record.valid_until === null), 'Live validity interval is incomplete');
        chronological(record.valid_from, record.valid_until, 'Live validity interval is reversed');
        requireCondition(record.valid_from === null || time(record.valid_from) < time(record.valid_until), 'Live validity interval must have duration');
        if (product === 'forecast')
            requireCondition(sameTime(record.issued_at, snapshot.source_issued_at) && record.issued_at !== null && record.valid_from !== null, 'Forecast needs issue and validity times');
        const variables = new Set();
        for (const measurement of record.measurements) {
            requireCondition(!variables.has(measurement.variable), 'Duplicate live measurement');
            variables.add(measurement.variable);
            requireCondition(measurement.unit === exports.LIVE_UNITS[measurement.variable], 'Live measurement unit mismatch');
            requireCondition(measurement.value === null || Number.isFinite(measurement.value), 'Live measurement must be finite');
            requireCondition(measurement.evidence_type !== 'unknown' || measurement.value === null, 'UNKNOWN measurement cannot have a value');
            requireCondition(evidence !== 'unknown' || measurement.value === null, 'UNKNOWN record cannot have a value');
            requireCondition(product !== 'forecast' || measurement.evidence_type === 'modelled', 'Forecast measurement must remain modelled');
            if (['precipitation_accumulation', 'precipitation_rate', 'discharge', 'pm25', 'aqi'].includes(measurement.variable))
                requireCondition(measurement.value === null || measurement.value >= 0, 'Live nonnegative measurement is negative');
            if (['magnitude', 'water_level', 'precipitation_accumulation', 'aqi'].includes(measurement.variable))
                requireCondition(measurement.value === null || measurement.qualifier !== null, 'Live measurement requires type, datum, interval or AQI standard');
        }
    }
    const expected = snapshot.freshness.basis === 'source_issue' ? time(snapshot.source_issued_at)
        : snapshot.records.length && snapshot.records.every(record => record.observed_at !== null) ? Math.min(...snapshot.records.map(record => time(record.observed_at))) : null;
    requireCondition(time(snapshot.freshness.as_of) === expected, 'Live freshness must use source time, not fetch time');
    return snapshot;
}
function parseLiveIndex(input) {
    if (!validateIndex(input))
        throw new Error(`Invalid live index: ${validationErrors(validateIndex.errors)}`);
    const index = input;
    requireCondition(new Set(index.feeds.map(feed => feed.feed_id)).size === index.feeds.length, 'Duplicate live feed');
    const enabled = index.feeds.filter(feed => feed.enabled);
    for (const feed of index.feeds) {
        fixtureIdentity(feed.feed_id, index.is_fixture);
        chronological(feed.last_successful_fetch_at, feed.last_attempt_at, 'Live success follows attempt');
        chronological(feed.last_attempt_at, index.generated_at, 'Live attempt follows publication');
        if (feed.attempt_status === 'success')
            requireCondition(feed.enabled && feed.snapshot !== null && feed.error_code === null && feed.last_attempt_at !== null && sameTime(feed.last_attempt_at, feed.last_successful_fetch_at), 'Live success requires a snapshot and successful fetch time');
        if (feed.attempt_status === 'failed')
            requireCondition(feed.enabled && feed.last_attempt_at !== null && feed.error_code !== null && !['disabled', 'license_unresolved'].includes(feed.error_code), 'Live failure requires a failed attempt');
        if (feed.attempt_status === 'not_configured')
            requireCondition(!feed.enabled && feed.snapshot === null && feed.last_attempt_at === null && feed.last_successful_fetch_at === null && (feed.error_code === null || ['disabled', 'license_unresolved'].includes(feed.error_code)), 'Disabled feed cannot carry observations');
        requireCondition((feed.snapshot !== null) === (feed.last_successful_fetch_at !== null), 'Live snapshot/success mismatch');
        if (feed.snapshot) {
            const ref = feed.snapshot;
            requireCondition(ref.dataset_id === (index.is_fixture ? 'atlas-live-contracts' : `live-${feed.feed_id}`) && ref.path === `/data/${ref.dataset_id}/${ref.version}/${ref.id}.json`, 'Live reference identity mismatch');
        }
    }
    const successes = enabled.filter(feed => feed.attempt_status === 'success').length;
    const expectedStatus = !enabled.length ? 'not_configured' : successes === enabled.length ? 'success' : successes ? 'partial' : 'failed';
    requireCondition(index.workflow.status === expectedStatus, 'Live workflow status differs from feeds');
    for (const [key, values] of [
        ['last_attempt_at', index.feeds.map(feed => time(feed.last_attempt_at))],
        ['last_successful_fetch_at', index.feeds.map(feed => time(feed.last_successful_fetch_at))],
    ]) {
        const known = values.filter((value) => value !== null);
        requireCondition(time(index.workflow[key]) === (known.length ? Math.max(...known) : null), 'Live workflow timestamps differ from feeds');
    }
    return index;
}
function validateLivePair(index, feed, snapshot) {
    const ref = feed.snapshot;
    requireCondition(ref !== null && ref.dataset_id === snapshot.dataset_id && ref.version === snapshot.version && ref.id === snapshot.id && feed.feed_id === snapshot.feed_id && index.is_fixture === snapshot.is_fixture, 'Live index/snapshot identity mismatch');
    requireCondition(sameTime(feed.last_successful_fetch_at, snapshot.fetched_at), 'Live index/snapshot fetch time mismatch');
    chronological(snapshot.fetched_at, index.generated_at, 'Live snapshot follows publication');
}
function workflowHealth(index, now) {
    if (!Number.isFinite(now) || index.workflow.last_attempt_at === null || now < Date.parse(index.generated_at))
        return 'UNAVAILABLE';
    if (now >= Date.parse(index.workflow.last_attempt_at) + index.workflow.stale_after_seconds * 1000)
        return 'STALE';
    return { success: 'HEALTHY', failed: 'FAILED', partial: 'PARTIAL', not_configured: 'UNAVAILABLE' }[index.workflow.status];
}
function liveFreshness(index, feed, snapshot, now) {
    if (!feed.enabled || !snapshot)
        return { status: 'unavailable', reason: 'No verified snapshot is available.', deadline: null };
    validateLivePair(index, feed, snapshot);
    if (!Number.isFinite(now) || now < Date.parse(index.generated_at))
        return { status: 'unavailable', reason: 'Clock or publication time cannot be verified.', deadline: null };
    const asOf = time(snapshot.freshness.as_of);
    const expiry = time(snapshot.freshness.expires_at);
    const recordExpiries = snapshot.records.map(record => time(record.valid_until)).filter((value) => value !== null);
    const deadline = asOf === null ? null : Math.min(asOf + snapshot.freshness.stale_after_seconds * 1000, expiry ?? Infinity, ...(snapshot.product_type === 'official_warning' ? recordExpiries : []));
    const resultDeadline = deadline === null ? null : new Date(deadline).toISOString();
    if (feed.attempt_status === 'failed')
        return { status: 'stale', reason: 'Latest fetch failed; this is the last verified snapshot.', deadline: resultDeadline };
    if (asOf === null)
        return { status: 'stale', reason: 'Source freshness is UNKNOWN.', deadline: null };
    if (snapshot.product_type === 'official_warning' && snapshot.records.some(record => record.valid_until === null))
        return { status: 'stale', reason: 'Official warning validity is UNKNOWN.', deadline: resultDeadline };
    if (now >= deadline)
        return { status: 'stale', reason: 'Source freshness deadline or validity has expired.', deadline: resultDeadline };
    if (['STALE', 'UNAVAILABLE'].includes(workflowHealth(index, now)))
        return { status: 'stale', reason: 'Workflow freshness cannot be confirmed.', deadline: resultDeadline };
    return { status: snapshot.records.length ? 'ready' : 'empty', reason: snapshot.records.length ? 'Verified snapshot within its declared freshness policy.' : 'Valid empty snapshot; this is not a failed fetch or an all-clear.', deadline: resultDeadline };
}
function assertLivePublicationAllowed(index, snapshot, allowFixture = false) {
    requireCondition(!index.is_fixture || allowFixture, 'Synthetic live fixtures are not conditions');
    for (const feed of index.feeds.filter(feed => feed.enabled))
        requireCondition(feed.feed_id === 'contract-fixture' ? allowFixture : live_policy_json_1.default.sources[feed.feed_id].enabled_by_default, 'Live source is disabled pending review');
    if (snapshot)
        requireCondition(snapshot.source.license_review === 'PERMITTED', 'Live source redistribution is unresolved');
}
/** Exact reviewed product identity is trusted code policy, never a downloaded PERMITTED claim. */
function assertReviewedLiveSource(snapshot) {
    requireCondition(!snapshot.is_fixture && (snapshot.feed_id === 'usgs' || snapshot.feed_id === 'noaa-gfs'), 'Source product has no public review');
    const review = live_sources_json_1.default.sources[snapshot.feed_id];
    for (const key of ['name', 'url', 'license', 'license_url', 'attribution', 'license_review', 'is_official'])
        requireCondition(snapshot.source[key] === review[key], 'Source differs from reviewed live product');
    if (snapshot.feed_id === 'usgs')
        requireCondition(snapshot.product_type === 'reported_event' && snapshot.records.every(record => record.source_network === 'us'), 'Unreviewed USGS contributor');
    if (snapshot.feed_id === 'noaa-gfs')
        requireCondition(snapshot.product_type === 'forecast', 'Unreviewed NOAA product');
}
