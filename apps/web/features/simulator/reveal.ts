/** After a run, bring the full-width result into view and move focus to its heading (keyboard and screen-reader users). */
export function revealResult(id: string) {
  window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
    const heading = document.getElementById(id);
    if (!heading) return;
    heading.setAttribute('tabindex', '-1');
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    heading.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    heading.focus({ preventScroll: true });
  }));
}
