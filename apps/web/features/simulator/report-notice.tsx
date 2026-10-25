import { LIVE_AUTHORITIES } from '../../../../packages/contracts/live';
import { UI, type Lang } from '../../lib/i18n';
import { REPORT } from './copy';

/** The scenario notice at the top of every report, also shown while the report recomputes so it is never missing. */
export function ReportNotice({ lang }: { lang: Lang }) {
  return <p className="report-notice"><strong>{UI[lang].scenarioNotice}.</strong> {REPORT[lang].official} {LIVE_AUTHORITIES.map((a, i) => <span key={a.name}>{i > 0 && ' · '}<a href={a.url}>{a.name}</a> ({a.url})</span>)}.</p>;
}
