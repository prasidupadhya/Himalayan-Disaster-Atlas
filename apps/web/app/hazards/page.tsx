import 'maplibre-gl/dist/maplibre-gl.css';
import './hazards.css';
import { HazardsLoader } from '../../features/hazards/loader';
export const metadata = { title: 'Hazard context', description: 'Rainfall, snow, drought, heat and terrain context for Nepal from verified releases, with links to educational scenarios. Context only — not a forecast or warning.' };
export default function HazardsPage() { return <HazardsLoader />; }
