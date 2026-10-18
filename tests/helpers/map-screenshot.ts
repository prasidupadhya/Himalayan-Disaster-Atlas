import type { Page } from '@playwright/test';

/**
 * Diagnostic map screenshot. An element screenshot waits for the WebGL map to report a stable box,
 * which can time out on slow CI runners; a clipped page screenshot records the same pixels without waiting.
 */
export async function screenshotMap(page: Page, path: string) {
  const box = await page.locator('.map-shell').boundingBox();
  await page.screenshot({ path, ...(box ? { clip: box } : {}) });
}
