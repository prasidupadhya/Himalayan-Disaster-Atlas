import { expect, test } from '@playwright/test';

for (const target of ['body', 'h1'] as const) {
  test(`extension attributes on ${target}: ${target === 'body' ? 'tolerated' : 'diagnostics retained'}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('pageerror', error => errors.push(error.message));
    // Simulate an extension content script before React starts hydrating.
    await page.addInitScript(target => {
      const observer = new MutationObserver(inject);
      function inject() {
        const element = document.querySelector(target);
        if (!element) return;
        if (target === 'body') {
          element.setAttribute('data-new-gr-c-s-check-loaded', '8.937.0');
          element.setAttribute('data-gr-ext-installed', '');
        } else {
          element.setAttribute('data-test-extension', 'changed-before-hydration');
        }
        observer.disconnect();
      }
      observer.observe(document, { childList: true, subtree: true });
      inject();
    }, target);
    await page.goto('/atlas/');
    await expect(page.locator('[data-map-ready="true"]')).toBeVisible();
    await page.getByRole('button', { name: 'Synthetic point A' }).click();
    await expect(page.getByText('Measurement: UNKNOWN')).toBeVisible();
    const hydrationErrors = errors.filter(message => /hydrated|hydration|didn't match/i.test(message));
    if (target === 'body') {
      await expect(page.locator('body')).toHaveAttribute('data-gr-ext-installed', '');
      expect(errors).toEqual([]);
    } else {
      expect(hydrationErrors).toHaveLength(1);
    }
  });
}
