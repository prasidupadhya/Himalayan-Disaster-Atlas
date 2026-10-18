import './hazards.css';
import { HazardsLoader } from '../../features/hazards/loader';
export const metadata = { title: 'Today', description: 'Today’s official river levels, rainfall, flood bulletins, alerts, earthquakes and incidents for Nepal, copied daily from government sources. Not a warning service.' };
export default function HazardsPage() { return <HazardsLoader />; }
