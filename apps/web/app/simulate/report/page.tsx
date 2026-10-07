import '../simulate.css';
import './report.css';
import { ReportLoader } from '../../../features/simulator/report-loader';
export const metadata = { title: 'Scenario report', description: 'Printable and JSON report for an educational scenario: inputs, assumptions, ranges, data versions, hashes and limitations. Not a forecast or warning.', robots: { index: false } };
export default function ReportPage() { return <ReportLoader />; }
