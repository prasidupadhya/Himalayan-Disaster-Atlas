'use client';
import { useEffect } from 'react';

/** Copies each column heading onto its cells (data-label) for every `table.stack-mobile`, so on a phone each row can
 * be shown as a card with labelled values. Labels follow the headings when the language changes. */
export function TableLabels() {
  useEffect(() => {
    const label = () => {
      for (const table of document.querySelectorAll<HTMLTableElement>('table.stack-mobile')) {
        const headings = [...table.querySelectorAll('thead tr:last-child > th')].map(th => th.textContent?.trim() ?? '');
        if (!headings.length) continue;
        for (const row of table.querySelectorAll('tbody > tr')) {
          [...row.children].forEach((cell, i) => {
            const text = headings[i];
            if (!text || (cell.hasAttribute('data-label') && !cell.hasAttribute('data-label-auto'))) return;
            if (cell.getAttribute('data-label') !== text) { cell.setAttribute('data-label', text); cell.setAttribute('data-label-auto', ''); }
          });
        }
      }
    };
    label();
    let queued = false;
    const observer = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; label(); });
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, []);
  return null;
}
