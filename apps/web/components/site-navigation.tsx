'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';
const links = [['/atlas/', 'Atlas'], ['/live/', 'Live'], ['/events/', 'Events'], ['/analyst/', 'Analyst'], ['/data-catalog/', 'Data catalog'], ['/methodology/', 'Methodology'], ['/sources/', 'Sources']] as const;
export function SiteNavigation() {
  const pathname = usePathname().replace(/\/$/, '');
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  return <div className="site-navigation" onKeyDown={event => {
    if (event.key === 'Escape' && open) { setOpen(false); toggle.current?.focus(); }
  }}>
    <button ref={toggle} type="button" className="navigation-toggle" aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button>
    <nav id="primary-navigation" aria-label="Primary navigation" data-open={open}>
      {links.map(([href, label]) => <Link key={href} href={href} aria-current={pathname === href.replace(/\/$/, '') ? 'page' : undefined} onClick={() => setOpen(false)}>{label}</Link>)}
    </nav>
  </div>;
}
