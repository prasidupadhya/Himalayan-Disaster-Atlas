import { checkLicenses } from './check-licenses.mjs';
import { checkSecurity } from './check-security.mjs';
import { checkStaticExport } from './check-static-export.mjs';
checkSecurity();
checkStaticExport();
checkLicenses({ publication: true });
