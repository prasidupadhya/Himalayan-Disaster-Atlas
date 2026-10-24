'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useT } from '../lib/i18n';

// Line icons drawn for the tab bar; the text label is always shown, so an icon is never the only cue.
const ICONS = {
  map: <path d="M9 4 3 6.5v13L9 17l6 2.5 6-2.5v-13L15 6.5 9 4Zm0 0v13m6-10.5v13" />,
  today: <><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17M8 3v4m8-4v4M7.5 14h3v3h-3z" /></>,
  scenarios: <path d="M3 15c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 3 2M3 19c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 3 2M12 3l3.5 6h-7L12 3Z" />,
  about: <><circle cx="12" cy="12" r="8.5" /><path d="M12 11v6m0-9.5v.5" /></>,
} as const;
const links = [['/atlas/', 'Map', 'नक्सा', 'map'], ['/hazards/', 'Today', 'आज', 'today'], ['/simulate/', 'Scenarios', 'परिदृश्य', 'scenarios'], ['/methodology/', 'About', 'बारेमा', 'about']] as const;

/** The four destinations: a row in the header on wide screens, a bottom tab bar within thumb reach on phones. */
export function SiteNavigation() {
  const pathname = usePathname().replace(/\/$/, '');
  const t = useT();
  return <nav id="primary-navigation" className="site-navigation" aria-label="Primary navigation">
    {links.map(([href, en, ne, icon]) => <Link key={href} href={href} aria-current={pathname === href.replace(/\/$/, '') ? 'page' : undefined}>
      <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">{ICONS[icon]}</svg>
      <span className="nav-label">{t(en, ne)}</span>
    </Link>)}
  </nav>;
}
