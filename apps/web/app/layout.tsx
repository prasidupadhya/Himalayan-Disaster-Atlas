import { isPublicRelease } from '../lib/public-release';
import type { Metadata } from 'next';
import Link from 'next/link';
import 'maplibre-gl/dist/maplibre-gl.css';
import './globals.css';
export const metadata: Metadata = { title: { default: 'Himalayan Disaster Atlas', template: '%s | Himalayan Disaster Atlas' }, description: 'An evidence-traceable, Nepal-focused geospatial atlas connecting mountains, water, hazards, infrastructure, communities and labelled research scenarios.' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body suppressHydrationWarning>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><div className="site-header-inner">
      <Link className="brand" href="/" aria-label="Himalayan Disaster Atlas home">
        <svg className="brand-mark" viewBox="0 0 40 40" aria-hidden="true"><path d="M4 31 16.7 9.5 22 18l4.2-6.7L36 31H4Z" /><path d="m12.7 31 7.4-12 3.1 5 3-4.8L33 31" /></svg>
        <span className="brand-copy"><strong>Himalayan Disaster Atlas</strong><small>Nepal · evidence-traceable research atlas</small></span>
      </Link>
      <nav aria-label="Primary navigation"><Link href="/atlas/">Atlas</Link><Link href="/events/">Events</Link><Link href="/analyst/">Analyst</Link><Link href="/data-catalog/">Data catalog</Link><Link href="/methodology/">Methodology</Link><Link href="/sources/">Sources</Link></nav>
    </div></header>
    <main id="main" tabIndex={-1}>{isPublicRelease ? <aside className="release-banner" aria-label="Public release availability"><div className="release-banner-inner"><span className="release-kicker">Public release</span><p><strong>Reviewed datasets only.</strong> BIPAD records, population, exposure, hazard graph, time machine, search, comparison, location summaries and evidence-based analyst features are unavailable pending redistribution review. Boundaries, terrain, rivers, glaciers, imagery, climate, OSM infrastructure, earthquakes and river-only scenarios remain available. <Link href="/licenses/">Availability and source terms</Link>.</p></div></aside> : null}{children}</main>
    <footer className="site-footer"><div className="site-footer-inner">
      <div className="footer-statement"><span className="footer-mark" aria-hidden="true">△</span><p><strong>Himalayan Disaster Atlas</strong><br />Public, read-only and evidence-traceable. No warnings or forecasts.</p></div>
      <nav aria-label="Atlas links"><strong>Explore</strong><Link href="/atlas/">Atlas</Link><Link href="/events/">Events</Link><Link href="/analyst/">Analyst</Link></nav>
      <nav aria-label="Research links"><strong>Research</strong><Link href="/data-catalog/">Data catalog</Link><Link href="/methodology/">Methodology</Link><Link href="/sources/">Sources</Link><Link href="/licenses/">Licences & attribution</Link></nav>
      <p className="footer-evidence">Sources and limitations remain linked with every dataset. UNKNOWN remains distinct from zero.</p>
    </div></footer>
  </body></html>;
}
