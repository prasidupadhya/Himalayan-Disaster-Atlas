import type { LiveEvidence } from '../../../../packages/contracts/live';
import type { Lang } from '../../lib/live-conditions';

/** Full names shown beside each authority's acronym; the acronyms themselves stay as published. */
export const AUTHORITY_NAMES: Record<Lang, Record<string, string>> = {
  en: { DHM: 'Department of Hydrology and Meteorology', NDRRMA: 'National Disaster Risk Reduction and Management Authority', BIPAD: 'BIPAD disaster information portal' },
  ne: { DHM: 'जल तथा मौसम विज्ञान विभाग', NDRRMA: 'राष्ट्रिय विपद् जोखिम न्यूनीकरण तथा व्यवस्थापन प्राधिकरण', BIPAD: 'BIPAD विपद् सूचना पोर्टल' },
};

/** Project-authored Nepali evidence labels; the English code is kept alongside. */
export const EVIDENCE_LABELS_NE: Record<LiveEvidence, string> = {
  observed: 'अवलोकित (OBSERVED)', reported: 'प्रतिवेदित (REPORTED)', derived: 'व्युत्पन्न (DERIVED)',
  modelled: 'मोडेल गरिएको (MODELLED)', hypothetical: 'काल्पनिक (HYPOTHETICAL)', unknown: 'अज्ञात (UNKNOWN)',
};

/** Nepali for the fixed air-quality status string; any other status is shown as published. */
export const AIR_QUALITY_STATUS_NE: Record<string, string> = {
  'DISABLED — provider licence review required': 'निष्क्रिय (DISABLED) — प्रदायकको इजाजतपत्र समीक्षा आवश्यक',
};
