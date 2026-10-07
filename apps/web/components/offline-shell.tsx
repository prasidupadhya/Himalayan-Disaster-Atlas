'use client';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import offline from '../../../packages/contracts/offline-shell-policy.json';

const subscribe = (update: () => void) => { window.addEventListener('online', update); window.addEventListener('offline', update); return () => { window.removeEventListener('online', update); window.removeEventListener('offline', update); }; };

/** Registers the offline shell, announces offline state and offers an explicit reload when an update is ready. */
export function OfflineShell() {
  const online = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);
  const requested = useRef(false);
  useEffect(() => {
    if (!('serviceWorker' in navigator) || !window.isSecureContext) return;
    const container = navigator.serviceWorker;
    const reload = () => { if (requested.current) window.location.reload(); };
    container.addEventListener('controllerchange', reload);
    let cancelled = false;
    container.register('/sw.js', { scope: '/', updateViaCache: 'none' }).then(registration => {
      const offer = (worker: ServiceWorker | null) => { if (!cancelled && worker && container.controller) setWaiting(worker); };
      offer(registration.waiting);
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        worker?.addEventListener('statechange', () => { if (worker.state === 'installed') offer(worker); });
      });
    }).catch(() => undefined);
    return () => { cancelled = true; container.removeEventListener('controllerchange', reload); };
  }, []);
  return <>
    {!online && <div className="offline-banner" role="status" aria-live="polite" data-offline="true">
      <p lang="en"><strong><span aria-hidden="true">{offline.last_known.glyph}</span> Offline.</strong> {offline.copy.en.offline_banner.replace(/^You are offline\. /, '')}</p>
      <p lang="ne">{offline.copy.ne.offline_banner}</p>
    </div>}
    {waiting && <div className="update-banner" role="status" aria-live="polite">
      <p>{offline.copy.en.update_ready}</p>
      <button type="button" onClick={() => { requested.current = true; waiting.postMessage({ type: 'ATLAS_SKIP_WAITING' }); }}>{offline.copy.en.update_action}</button>
    </div>}
  </>;
}
