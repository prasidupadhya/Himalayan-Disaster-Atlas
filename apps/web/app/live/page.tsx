import 'maplibre-gl/dist/maplibre-gl.css';
import './live.css';
import { LiveConditions } from '../../features/live-conditions/live-conditions';
export const metadata = { title: 'Live conditions', description: 'Periodically updated USGS earthquake summaries and NOAA GFS model forecasts from verified static snapshots, with a bilingual Nepali/English bulletin. Not a warning service; follow DHM and NDRRMA/BIPAD.' };
export default function LivePage() { return <LiveConditions />; }
