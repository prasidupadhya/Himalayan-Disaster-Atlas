import { COPY } from './copy.js';

const store = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };
export const lang = store.get('lang') === 'ne' ? 'ne' : 'en';
export const c = COPY[lang];
const locale = lang === 'ne' ? 'ne-NP' : 'en-GB';

export const esc = v => String(v ?? '').replace(/[&<>"']/g, ch => `&#${ch.charCodeAt(0)};`);
export const num = (v, digits = 0) => v === null || v === undefined || !Number.isFinite(+v) ? c.unknown
  : new Intl.NumberFormat(locale, { maximumFractionDigits: digits, minimumFractionDigits: 0 }).format(v);
export const when = (iso, opts = { dateStyle: 'medium', timeStyle: 'short' }) => {
  const d = new Date(iso);
  return isNaN(d) ? c.unknown : new Intl.DateTimeFormat(locale, { ...opts, timeZone: 'Asia/Kathmandu' }).format(d);
};
export const duration = s => {
  const m = Math.round(s / 60), h = Math.floor(m / 60);
  if (lang === 'ne') return h ? `${num(h)} घण्टा ${num(m % 60)} मिनेट` : `${num(m)} मिनेट`;
  return h ? `${h} h ${String(m % 60).padStart(2, '0')} min` : `${m} min`;
};

/** Fetch JSON; gzipped release files are decompressed in the browser. */
export async function load(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return url.endsWith('.gz') ? new Response(r.body.pipeThrough(new DecompressionStream('gzip'))).json() : r.json();
}

/** Shows a retryable error in place of content that failed to load. */
export function failed(box, retry) {
  box.innerHTML = `<p class="note bad" role="alert">${esc(c.failed)} <button type="button" class="link">${esc(c.retry)}</button></p>`;
  box.querySelector('button').onclick = retry;
}

// ---------- Shell ----------
const PAGES = [['/', 'navToday', 'M3 12h4l3-8 4 16 3-8h4'], ['/map/', 'navMap', 'M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zm0 0v14m6-12v14'],
  ['/scenarios/', 'navScenarios', 'M4 19V5m0 14h16M8 15l3-4 3 2 5-6'], ['/about/', 'navAbout', 'M12 8h.01M11 12h1v5h1M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z']];
const icon = d => `<svg viewBox="0 0 24 24" aria-hidden="true" width="22" height="22"><path d="${d}"/></svg>`;
const here = location.pathname.replace(/index\.html$/, '');

document.documentElement.lang = lang;
document.title = `${c[PAGES.find(p => p[0] === here)?.[1] ?? 'navToday']} · ${c.site}`;
document.querySelectorAll('[data-t]').forEach(n => { n.textContent = c[n.dataset.t]; });

const nav = PAGES.map(([href, key, d]) => `<a href="${href}"${href === here ? ' aria-current="page"' : ''}>${icon(d)}<span>${esc(c[key])}</span></a>`).join('');
document.body.insertAdjacentHTML('afterbegin', `<a class="skip" href="#main">${esc(c.skip)}</a>
<header class="top"><a class="brand" href="/"><svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true"><path d="M2 26 12 9l5 8 4-5 9 14z" fill="var(--accent)"/><path d="m12 9 2.6 4.4-2.6-1.4-2.4 1.6z" fill="var(--bg)"/></svg><span>${esc(c.site)}</span></a>
<nav class="nav" aria-label="${esc(c.site)}">${nav}</nav>
<div class="tools"><button type="button" id="lang" lang="${lang === 'en' ? 'ne' : 'en'}" aria-label="${esc(c.langLabel)}">${esc(c.langSwitch)}</button>
<button type="button" id="theme" aria-label="${esc(c.themeLabel)}">${icon('M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9z')}</button></div></header>`);
document.body.insertAdjacentHTML('beforeend', `<footer class="foot"><p>${esc(c.notWarning)} <a href="https://www.dhm.gov.np/" rel="noopener">DHM</a> ${esc(c.and)} <a href="https://bipadportal.gov.np/" rel="noopener">BIPAD (NDRRMA)</a>.</p></footer>`);

document.getElementById('lang').onclick = () => { store.set('lang', lang === 'en' ? 'ne' : 'en'); location.reload(); };
document.getElementById('theme').onclick = () => {
  const dark = matchMedia('(prefers-color-scheme: dark)').matches, now = document.documentElement.dataset.theme || (dark ? 'dark' : 'light');
  const next = now === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next; store.set('theme', next);
  dispatchEvent(new Event('themechange'));
};
if (!navigator.onLine) document.querySelector('main')?.insertAdjacentHTML('afterbegin', `<p class="note">${esc(c.offline)}</p>`);
if ('serviceWorker' in navigator && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') navigator.serviceWorker.register('/sw.js');
