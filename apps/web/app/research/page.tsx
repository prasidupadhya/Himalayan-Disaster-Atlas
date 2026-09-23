import 'maplibre-gl/dist/maplibre-gl.css';
import { Atlas } from '../../features/atlas/atlas';
export const metadata = { title: 'Research atlas' };
export default function ResearchPage() { return <Atlas research />; }
