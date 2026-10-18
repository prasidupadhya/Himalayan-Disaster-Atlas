import { SiteNavigation } from '../components/site-navigation';
import { OfflineShell } from '../components/offline-shell';
import type { Metadata } from 'next';
import Link from 'next/link';
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource-variable/noto-sans-devanagari';
import './globals.css';
import './home.css';
export const metadata: Metadata = { title: { default: 'Himalayan Disaster Atlas', template: '%s | Himalayan Disaster Atlas' }, description: 'An evidence-traceable, Nepal-focused geospatial atlas connecting mountains, water, hazards, infrastructure, communities and labelled research scenarios.' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body suppressHydrationWarning>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><div className="site-header-inner">
      <Link className="brand" href="/" aria-label="Himalayan Disaster Atlas home">
        <svg className="brand-mark" viewBox="0 0 40 40" aria-hidden="true"><path d="M4 31 16.7 9.5 22 18l4.2-6.7L36 31H4Z" /><path d="m12.7 31 7.4-12 3.1 5 3-4.8L33 31" /></svg>
        <span className="brand-copy"><strong>Himalayan Disaster Atlas</strong><small>Nepal · floods, glacial lakes & earthquakes</small></span>
      </Link>
      <SiteNavigation />
    </div></header>
    <OfflineShell />
    <main id="main" tabIndex={-1}>{children}</main>
    <footer className="site-footer"><div className="site-footer-inner">
      <div className="footer-statement"><span className="footer-mark" aria-hidden="true">△</span><p><strong>Himalayan Disaster Atlas</strong><br />Public, read-only and evidence-traceable. Not an official warning service.</p></div>
      <nav aria-label="Atlas links"><strong>Explore</strong><Link href="/atlas/">Map</Link><Link href="/hazards/">Today</Link><Link href="/simulate/">Scenarios</Link><Link href="/official/">All official sources</Link><Link href="/live/">Earthquake and forecast feeds</Link></nav>
      <nav aria-label="About links"><strong>About</strong><Link href="/methodology/">Methodology</Link><Link href="/sources/">Sources</Link><Link href="/licenses/">Licences & attribution</Link></nav>
      <p className="footer-evidence">Sources and limitations remain linked with every dataset. UNKNOWN remains distinct from zero.</p>
    </div></footer>
  </body></html>;
}
