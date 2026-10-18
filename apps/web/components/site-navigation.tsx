'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const links = [['/atlas/', 'Map'], ['/hazards/', 'Today'], ['/simulate/', 'Scenarios'], ['/methodology/', 'About']] as const;
export function SiteNavigation() {
  const pathname = usePathname().replace(/\/$/, '');
  return <nav id="primary-navigation" className="site-navigation" aria-label="Primary navigation">
    {links.map(([href, label]) => <Link key={href} href={href} aria-current={pathname === href.replace(/\/$/, '') ? 'page' : undefined}>{label}</Link>)}
  </nav>;
}
