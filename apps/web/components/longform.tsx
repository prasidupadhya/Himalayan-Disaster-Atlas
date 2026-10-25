'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useCopy } from '../lib/i18n';
import { LONGFORM } from './copy';

/**
 * The contents of a long page. Wide screens: a sticky column beside the text, always open. Phones: a folded bar at the
 * top of the article. It starts folded in the HTML; opening it on wide screens after load moves nothing, because there
 * it sits outside the text column.
 */
export function PageToc({ label, className = '', children }: { label: string; className?: string; children: ReactNode }) {
  const c = useCopy(LONGFORM);
  const details = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1100px)');
    const sync = () => { if (details.current) details.current.open = wide.matches; };
    sync();
    wide.addEventListener('change', sync);
    return () => wide.removeEventListener('change', sync);
  }, []);
  return <nav className={`page-toc ${className}`.trim()} aria-label={label}>
    <details ref={details}><summary>{c.onThisPage}</summary><div className="page-toc-links">{children}</div></details>
  </nav>;
}

/** A link back to the top once the reader is a few screens down; it moves focus to the main content, not just scroll. */
export function BackToTop() {
  const c = useCopy(LONGFORM);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    let frame = 0;
    const update = () => { frame = 0; setShown(window.scrollY > window.innerHeight * 1.5); };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); if (frame) window.cancelAnimationFrame(frame); };
  }, []);
  return <a className="back-to-top" href="#main" data-shown={shown ? 'true' : undefined} tabIndex={shown ? 0 : -1} aria-hidden={shown ? undefined : true}
    onClick={event => {
      event.preventDefault();
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      document.getElementById('main')?.focus({ preventScroll: true });
    }}><span aria-hidden="true">↑</span> {c.backToTop}</a>;
}
