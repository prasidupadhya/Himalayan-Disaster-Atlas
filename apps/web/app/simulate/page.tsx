import 'maplibre-gl/dist/maplibre-gl.css';
import './simulate.css';
import { SimulatorLoader } from '../../features/simulator/loader';
export const metadata = { title: 'Scenario simulator', description: 'Educational flood, GLOF and earthquake scenarios for Nepal with assumptions shown before each run. Scenario / educational estimate, not a forecast or warning.' };
export default function SimulatePage() { return <SimulatorLoader />; }
