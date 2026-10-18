import { SiteNavigation } from '../components/site-navigation';
import { OfflineShell } from '../components/offline-shell';
import { SiteLanguage, T } from '../lib/i18n';
import type { Metadata } from 'next';
import Link from 'next/link';
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource-variable/noto-sans-devanagari';
import './globals.css';
import './home.css';
export const metadata: Metadata = { title: { default: 'Himalayan Disaster Atlas', template: '%s | Himalayan Disaster Atlas' }, description: 'An evidence-traceable, Nepal-focused geospatial atlas connecting mountains, water, hazards, infrastructure, communities and labelled research scenarios.' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body suppressHydrationWarning>
    <a className="skip-link" href="#main"><T en="Skip to content" ne="सामग्रीमा जानुहोस्" /></a>
    <header className="site-header"><div className="site-header-inner">
      <Link className="brand" href="/" aria-label="Himalayan Disaster Atlas home">
        <svg className="brand-mark" viewBox="0 0 40 40" aria-hidden="true"><path d="M4 31 16.7 9.5 22 18l4.2-6.7L36 31H4Z" /><path d="m12.7 31 7.4-12 3.1 5 3-4.8L33 31" /></svg>
        <span className="brand-copy"><strong>Himalayan Disaster Atlas</strong><small><T en="Nepal · floods, glacial lakes & earthquakes" ne="नेपाल · बाढी, हिमताल र भूकम्प" /></small></span>
      </Link>
      <div className="site-header-tools"><SiteNavigation /><SiteLanguage /></div>
    </div></header>
    <OfflineShell />
    <main id="main" tabIndex={-1}>{children}</main>
    <footer className="site-footer"><div className="site-footer-inner">
      <div className="footer-statement"><span className="footer-mark" aria-hidden="true">△</span><p><strong>Himalayan Disaster Atlas</strong><br /><T en="Public, read-only and evidence-traceable. Not an official warning service." ne="सार्वजनिक, पढ्न मात्र मिल्ने र प्रमाणसँग जोडिएको। आधिकारिक चेतावनी सेवा होइन।" /></p></div>
      <nav aria-label="Atlas links"><strong><T en="Explore" ne="हेर्नुहोस्" /></strong><Link href="/atlas/"><T en="Map" ne="नक्सा" /></Link><Link href="/hazards/"><T en="Today" ne="आज" /></Link><Link href="/simulate/"><T en="Scenarios" ne="परिदृश्य" /></Link><Link href="/official/"><T en="All official sources" ne="सबै आधिकारिक स्रोत" /></Link><Link href="/live/"><T en="Earthquake and forecast feeds" ne="भूकम्प र पूर्वानुमान फिड" /></Link></nav>
      <nav aria-label="About links"><strong><T en="About" ne="बारेमा" /></strong><Link href="/methodology/"><T en="Methodology" ne="विधि" /></Link><Link href="/sources/"><T en="Sources" ne="स्रोतहरू" /></Link><Link href="/licenses/"><T en="Licences & attribution" ne="इजाजतपत्र र श्रेय" /></Link></nav>
      <p className="footer-evidence"><T en="Sources and limitations remain linked with every dataset. UNKNOWN remains distinct from zero." ne="हरेक डेटासेटसँग स्रोत र सीमाहरू जोडिएका छन्। अज्ञात (UNKNOWN) शून्यभन्दा फरक हो।" /></p>
    </div></footer>
  </body></html>;
}
