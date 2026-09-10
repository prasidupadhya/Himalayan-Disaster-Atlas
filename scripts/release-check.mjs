import { verifyPublicExport } from './public-export.mjs';
import { checkLicenses } from './check-licenses.mjs';
import { checkSecurity } from './check-security.mjs';
import { checkStaticExport } from './check-static-export.mjs';
checkSecurity();
const excludedReleases = verifyPublicExport();
checkStaticExport(undefined, { excludedReleases });
checkLicenses({ publication: true, excludedReleases });
console.log(`Publication check passed: ${excludedReleases.length} unresolved releases are absent from the verified public export.`);
