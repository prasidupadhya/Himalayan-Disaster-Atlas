import './official.css';
import { OfficialSources } from '../../features/official/official';
export const metadata = { title: 'Official sources today', description: 'A daily, organised copy of public Nepal government pages: DHM weather forecasts and notices, river and rainfall readings via BIPAD, earthquakes and NDRRMA notices. The agency websites remain authoritative.' };
export default function OfficialPage() { return <OfficialSources />; }
