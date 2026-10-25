/**
 * Brings a map into view before something plays on it.
 *
 * On a phone (or any layout where the map is not beside the controls) pressing Run or Trace used to scroll to the
 * results, below the map, so the animation played off screen. This helper scrolls the map into view instead, clear of
 * the sticky header and the bottom tab bar, waits until it is really visible, and only then calls `play`. When the map
 * is already on screen (wide layouts, with the map beside the controls) nothing scrolls and `play` runs at once.
 * Reduced motion: an instant jump, never a smooth scroll.
 */
export function revealMapThenPlay(target: HTMLElement | null, play: () => void, { visible = 0.6, timeoutMs = 1200 } = {}) {
  if (!target || typeof window === 'undefined') { play(); return () => undefined; }
  let done = false, observer: IntersectionObserver | null = null, timer = 0;
  const finish = () => {
    if (done) return;
    done = true; observer?.disconnect(); window.clearTimeout(timer); window.removeEventListener('scrollend', onScrollEnd);
    play();
  };
  const onScrollEnd = () => { if (shownFraction(target) >= visible) finish(); };
  if (shownFraction(target) >= visible) { finish(); return () => undefined; }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const { top: header, bottom: tabbar } = obstructions();
  const rect = target.getBoundingClientRect();
  // For a map taller than the free viewport, "visible" is measured against the space it can actually fill.
  const threshold = Math.min(visible, Math.max(0.05, ((window.innerHeight - header - tabbar) / Math.max(1, rect.height)) * visible));
  // Align the map's top just under the sticky header; a map taller than the space left is fine, its top part shows.
  const y = window.scrollY + rect.top - header - 8;
  window.scrollTo({ top: Math.max(0, y), behavior: reduce ? 'auto' : 'smooth' });
  if (reduce) { finish(); return () => undefined; }
  observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.intersectionRatio >= threshold)) finish(); }, { threshold: [threshold] });
  observer.observe(target);
  window.addEventListener('scrollend', onScrollEnd);
  // Never wait forever: if the page cannot scroll far enough (a short page, a keyboard open), play anyway.
  timer = window.setTimeout(finish, timeoutMs);
  return () => { done = true; observer?.disconnect(); window.clearTimeout(timer); window.removeEventListener('scrollend', onScrollEnd); };
}

/** Heights covered by the sticky top bar and the phone tab bar. */
function obstructions() {
  const header = document.querySelector('.site-header')?.getBoundingClientRect();
  const tabbar = document.querySelector('.site-navigation');
  const fixed = tabbar && getComputedStyle(tabbar).position === 'fixed' ? tabbar.getBoundingClientRect().height : 0;
  return { top: header && header.top <= 0 ? header.bottom : header?.height ?? 0, bottom: fixed };
}

/** The fraction of an element inside the part of the viewport not covered by the header or the tab bar. */
export function shownFraction(element: HTMLElement) {
  const { top, bottom } = obstructions();
  const rect = element.getBoundingClientRect();
  const visibleTop = Math.max(rect.top, top), visibleBottom = Math.min(rect.bottom, window.innerHeight - bottom);
  const height = Math.min(rect.height, window.innerHeight - top - bottom);
  return height > 0 ? Math.max(0, visibleBottom - visibleTop) / height : 0;
}
