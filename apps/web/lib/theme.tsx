'use client';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useCopy } from './i18n';
import { THEME } from '../components/copy';
import { CHROME, THEME_KEY as KEY } from './theme-boot';

/** Colour theme: follow the device, or a fixed light or dark choice remembered on this device. */
export type ThemeChoice = 'system' | 'light' | 'dark';
const listeners = new Set<() => void>();

function read(): ThemeChoice {
  try { const value = window.localStorage.getItem(KEY); return value === 'light' || value === 'dark' ? value : 'system'; } catch { return 'system'; }
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  const storage = (event: StorageEvent) => { if (event.key === KEY) listener(); };
  window.addEventListener('storage', storage);
  return () => { listeners.delete(listener); window.removeEventListener('storage', storage); };
}
const dark = () => typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;

/** Applies a choice to the document: `data-theme` for a fixed choice, nothing for "system", and the browser chrome colour. */
export function applyTheme(choice: ThemeChoice) {
  const root = document.documentElement;
  if (choice === 'system') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', choice);
  const resolved = choice === 'system' ? (dark() ? 'dark' : 'light') : choice;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', CHROME[resolved]);
}

export function useTheme(): [ThemeChoice, (choice: ThemeChoice) => void] {
  const choice = useSyncExternalStore(subscribe, read, () => 'system' as ThemeChoice);
  const set = useCallback((next: ThemeChoice) => {
    try { if (next === 'system') window.localStorage.removeItem(KEY); else window.localStorage.setItem(KEY, next); } catch { /* per-device convenience only */ }
    applyTheme(next);
    listeners.forEach(listener => listener());
  }, []);
  return [choice, set];
}

const ICONS = {
  system: <><rect x="3.5" y="4.5" width="17" height="12" rx="2" /><path d="M9 20h6M12 16.5V20" /></>,
  light: <><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" /></>,
  dark: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />,
} as const;

/** The theme control in the top bar: a small menu of three choices. */
export function ThemeMenu() {
  const [choice, setChoice] = useTheme();
  const c = useCopy(THEME);
  const menu = useRef<HTMLDetailsElement>(null);
  const [open, setOpen] = useState(false);
  // Follow the device while "system" is chosen, so the browser chrome colour keeps up with a live switch.
  useEffect(() => {
    applyTheme(choice);
    if (choice !== 'system') return;
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => applyTheme('system');
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, [choice]);
  // Closes on Escape or a click elsewhere, like any menu.
  useEffect(() => {
    const close = (event: Event) => {
      const el = menu.current;
      if (!el?.open) return;
      if (event instanceof KeyboardEvent ? event.key === 'Escape' : !el.contains(event.target as Node)) { el.open = false; if (event instanceof KeyboardEvent) el.querySelector('summary')?.focus(); }
    };
    document.addEventListener('keydown', close); document.addEventListener('pointerdown', close);
    return () => { document.removeEventListener('keydown', close); document.removeEventListener('pointerdown', close); };
  }, []);
  const label = { system: c.system, light: c.light, dark: c.dark };
  return <details ref={menu} className="theme-menu" onToggle={event => setOpen(event.currentTarget.open)}>
    <summary aria-label={c.current(label[choice])} title={c.title}>
      <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">{ICONS[choice]}</svg>
    </summary>
    {open && <fieldset className="theme-options">
      <legend>{c.title}</legend>
      {(['system', 'light', 'dark'] as const).map(value => <label key={value}>
        <input type="radio" name="atlas-theme" value={value} checked={choice === value} onChange={() => { setChoice(value); if (menu.current) menu.current.open = false; }} />
        <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">{ICONS[value]}</svg>
        {label[value]}
      </label>)}
    </fieldset>}
  </details>;
}
