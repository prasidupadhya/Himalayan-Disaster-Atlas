import { isPublicRelease } from '../lib/public-release';
import type { Metadata } from 'next';
import Link from 'next/link';
import 'maplibre-gl/dist/maplibre-gl.css';
import './globals.css';
export const metadata: Metadata = { title: { default: 'Himalayan Disaster Atlas', template: '%s | Himalayan Disaster Atlas' }, description: 'An evidence-traceable, Nepal-focused geospatial atlas with administrative boundary exploration.' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body suppressHydrationWarning>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><Link className="brand" href="/"><span aria-hidden="true">△</span> Himalayan Disaster Atlas</Link><nav aria-label="Primary navigation"><Link href="/atlas/">Atlas</Link><Link href="/events/">Events</Link><Link href="/analyst/">AI Analyst</Link><Link href="/data-catalog/">Data catalog</Link><Link href="/methodology/">Methodology</Link><Link href="/sources/">Sources</Link></nav></header>
    <main id="main" tabIndex={-1}>{isPublicRelease ? <aside className="page" aria-label="Public release availability"><p><strong>Public release: reviewed datasets only.</strong> BIPAD records, population, exposure, hazard graph, time machine, search, comparison, location summaries and evidence-based analyst features are unavailable pending redistribution review. Boundaries, terrain, rivers, glaciers, imagery, climate, OSM infrastructure, earthquakes and river-only scenarios remain available. <Link href="/licenses/">Availability and source terms</Link>.</p></aside> : null}{children}</main>
    <footer>Public read-only atlas · Sources and limitations are linked with every dataset · No warnings or forecasts · <Link href="/licenses/">Licences and attribution</Link></footer>
  </body></html>;
}
