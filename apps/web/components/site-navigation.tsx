'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useT } from '../lib/i18n';
const links = [['/atlas/', 'Map', 'नक्सा'], ['/hazards/', 'Today', 'आज'], ['/simulate/', 'Scenarios', 'परिदृश्य'], ['/methodology/', 'About', 'बारेमा']] as const;
export function SiteNavigation() {
  const pathname = usePathname().replace(/\/$/, '');
  const t = useT();
  return <nav id="primary-navigation" className="site-navigation" aria-label="Primary navigation">
    {links.map(([href, en, ne]) => <Link key={href} href={href} aria-current={pathname === href.replace(/\/$/, '') ? 'page' : undefined}>{t(en, ne)}</Link>)}
  </nav>;
}
