'use client';
import { useEffect, useRef, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';

export type Snap = 'peek' | 'half' | 'full';
const ORDER: Snap[] = ['peek', 'half', 'full'];

/**
 * Controls that sit over the lower part of a map on phones and beside it on wide screens.
 * Phones: three heights (peek, half, full). Drag the handle, tap it to step up, or use the arrow keys on it; the map
 * above stays visible and interactive at peek and half. Wide screens: a plain scrolling side panel (CSS only).
 * The snap state is owned by the caller so other actions (choosing a tab, tracing a river) can open or lower it.
 */
export function Sheet({ label, snap, onSnap, header, children, labels, className = '', id }: {
  label: string; snap: Snap; onSnap: (snap: Snap) => void; header?: ReactNode; children: ReactNode;
  labels: { expand: string; collapse: string }; className?: string; id?: string;
}) {
  const sheet = useRef<HTMLElement>(null);
  const drag = useRef<{ startY: number; startHeight: number; lastY: number; lastT: number; velocity: number; moved: boolean } | null>(null);

  // While dragging, the height follows the finger; on release it settles on the nearest snap, biased by a flick.
  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    const el = sheet.current;
    if (!el || event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { startY: event.clientY, startHeight: el.getBoundingClientRect().height, lastY: event.clientY, lastT: performance.now(), velocity: 0, moved: false };
  };
  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current, el = sheet.current;
    if (!d || !el) return;
    const dy = event.clientY - d.startY;
    if (Math.abs(dy) > 4) d.moved = true;
    if (!d.moved) return;
    const now = performance.now();
    d.velocity = (event.clientY - d.lastY) / Math.max(1, now - d.lastT);
    d.lastY = event.clientY; d.lastT = now;
    const max = el.parentElement?.getBoundingClientRect().height ?? window.innerHeight;
    el.style.setProperty('--sheet-drag', `${Math.max(96, Math.min(max - 24, d.startHeight - dy))}px`);
    el.dataset.dragging = 'true';
  };
  const onPointerUp = () => {
    const d = drag.current, el = sheet.current;
    drag.current = null;
    if (!d || !el) return;
    delete el.dataset.dragging;
    if (!d.moved) { onSnap(snap === 'full' ? 'half' : ORDER[ORDER.indexOf(snap) + 1]); return; }
    const height = el.getBoundingClientRect().height;
    el.style.removeProperty('--sheet-drag');
    const max = el.parentElement?.getBoundingClientRect().height ?? window.innerHeight;
    const fraction = height / max;
    // A flick (faster than 0.6 px/ms) moves one step in its direction; otherwise the nearest height wins.
    if (Math.abs(d.velocity) > 0.6) { const i = ORDER.indexOf(snap) + (d.velocity < 0 ? 1 : -1); onSnap(ORDER[Math.max(0, Math.min(2, i))]); return; }
    onSnap(fraction > 0.72 ? 'full' : fraction > 0.34 ? 'half' : 'peek');
  };
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const i = ORDER.indexOf(snap);
    if (event.key === 'ArrowUp' && i < 2) { event.preventDefault(); onSnap(ORDER[i + 1]); }
    if (event.key === 'ArrowDown' && i > 0) { event.preventDefault(); onSnap(ORDER[i - 1]); }
  };
  // Moving up from peek scrolls the content back to the top, so a lowered sheet always shows its header.
  useEffect(() => { if (snap === 'peek') sheet.current?.querySelector('.sheet-body')?.scrollTo({ top: 0 }); }, [snap]);

  return <section ref={sheet} id={id} className={`sheet ${className}`.trim()} data-snap={snap} aria-label={label}>
    <button type="button" className="sheet-handle" aria-label={snap === 'full' ? labels.collapse : labels.expand} aria-expanded={snap !== 'peek'}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onKeyDown={onKeyDown}
      onClick={event => { if (event.detail === 0) onSnap(snap === 'full' ? 'peek' : ORDER[ORDER.indexOf(snap) + 1]); }}>
      <span aria-hidden="true" />
    </button>
    {header && <div className="sheet-header">{header}</div>}
    <div className="sheet-body">{children}</div>
  </section>;
}
