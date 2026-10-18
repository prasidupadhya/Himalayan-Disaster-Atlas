'use client';
import { useEffect, useRef, type ReactNode } from 'react';

/** Opens the fold holding the element a fragment link points to, so the browser can scroll to and focus it. */
export function openFoldFor(id: string) {
  const fold = document.getElementById(id)?.closest('details.atlas-fold');
  if (fold instanceof HTMLDetailsElement) fold.open = true;
}

/** Secondary map controls: open on wide screens, closed on a phone until asked for. */
export function Fold({ title, children }: { title: ReactNode; children: ReactNode }) {
  const details = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    if (details.current && window.matchMedia('(max-width: 800px)').matches) details.current.open = false;
    const reveal = () => { if (location.hash.length > 1) openFoldFor(decodeURIComponent(location.hash.slice(1))); };
    reveal();
    window.addEventListener('hashchange', reveal);
    return () => window.removeEventListener('hashchange', reveal);
  }, []);
  return <details ref={details} className="atlas-fold" open><summary>{title}</summary>{children}</details>;
}
