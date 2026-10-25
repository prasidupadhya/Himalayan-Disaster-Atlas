'use client';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';

const subscribe = (update: () => void) => { window.addEventListener('online', update); window.addEventListener('offline', update); return () => { window.removeEventListener('online', update); window.removeEventListener('offline', update); }; };
/** True while the device reports a network connection. */
export function useOnline() { return useSyncExternalStore(subscribe, () => navigator.onLine, () => true); }

/** A compact mark for the top bar while offline: everything shown is a saved copy. */
export function OfflineBadge({ label }: { label: ReactNode }) {
  const online = useOnline();
  return online ? null : <span className="offline-badge" role="status"><span aria-hidden="true">↺</span>{label}</span>;
}

/** A short confirmation that a quick action worked ("Link copied"), announced politely and dismissed after a moment. */
export function useToast(duration = 2600) {
  const [message, setMessage] = useState<ReactNode | null>(null);
  const timer = useRef(0);
  const show = useCallback((next: ReactNode) => { window.clearTimeout(timer.current); setMessage(next); timer.current = window.setTimeout(() => setMessage(null), duration); }, [duration]);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const toast = <div aria-live="polite" aria-atomic="true">{message !== null && <div className="toast" role="status">{message}</div>}</div>;
  return [toast, show] as const;
}
