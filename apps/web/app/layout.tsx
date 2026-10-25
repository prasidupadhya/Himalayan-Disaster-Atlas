import { SiteNavigation } from '../components/site-navigation';
import { OfflineMark, OfflineShell } from '../components/offline-shell';
import { TableLabels } from '../components/table-labels';
import { LanguageProvider, SiteLanguage } from '../lib/i18n';
import { bilingual } from '../lib/copy';
import { SHELL } from '../components/copy';
import { ThemeMenu } from '../lib/theme';
import { THEME_BOOT } from '../lib/theme-boot';
import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import '@fontsource-variable/archivo/wdth.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/layout.css';
import './styles/utilities.css';
import './home.css';
// Phones: draw under the notch and home indicator (safe-area insets are padded in CSS) and tint the browser chrome.
// The theme colour follows the light or dark theme (set before paint by THEME_BOOT); both schemes are supported.
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#ffffff', colorScheme: 'light dark' };
export const metadata: Metadata = { title: { default: 'Himalayan Disaster Atlas', template: '%s | Himalayan Disaster Atlas' }, description: 'An evidence-traceable, Nepal-focused geospatial atlas connecting mountains, water, hazards, infrastructure, communities and labelled research scenarios.',
  appleWebApp: { capable: true, title: 'Disaster Atlas', statusBarStyle: 'default' }, formatDetection: { telephone: false } };
const t = bilingual(SHELL);
export default function RootLayout({ children }: { children: React.ReactNode }) {
  // The theme attribute is set before hydration by THEME_BOOT, so <html> may differ from the server markup.
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} /></head><body suppressHydrationWarning><LanguageProvider>
    <a className="skip-link" href="#main">{t('skip')}</a>
    <header className="site-header"><div className="site-header-inner">
      <Link className="brand" href="/" aria-label="Himalayan Disaster Atlas home">
        <svg className="brand-mark" viewBox="0 0 40 40" aria-hidden="true"><path d="M4 31 16.7 9.5 22 18l4.2-6.7L36 31H4Z" /><path d="m12.7 31 7.4-12 3.1 5 3-4.8L33 31" /></svg>
        <span className="brand-copy"><strong>Himalayan Disaster Atlas</strong><small>{t('tagline')}</small></span>
      </Link>
      <SiteNavigation />
      <div className="site-header-tools"><OfflineMark /><SiteLanguage /><ThemeMenu /></div>
    </div></header>
    <OfflineShell />
    <TableLabels />
    <main id="main" tabIndex={-1}>{children}</main>
    <footer className="site-footer"><div className="site-footer-inner">
      <div className="footer-statement"><span className="footer-mark" aria-hidden="true">△</span><p><strong>Himalayan Disaster Atlas</strong><br />{t('statement')}</p></div>
      <nav aria-label="Atlas links"><strong>{t('explore')}</strong><Link href="/atlas/">{t('map')}</Link><Link href="/hazards/">{t('today')}</Link><Link href="/simulate/">{t('scenarios')}</Link><Link href="/official/">{t('allOfficial')}</Link><Link href="/live/">{t('feeds')}</Link></nav>
      <nav aria-label="About links"><strong>{t('about')}</strong><Link href="/methodology/">{t('methodology')}</Link><Link href="/sources/">{t('sources')}</Link><Link href="/licenses/">{t('licences')}</Link></nav>
      <p className="footer-evidence">{t('evidence')}</p>
    </div></footer>
  </LanguageProvider></body></html>;
}
