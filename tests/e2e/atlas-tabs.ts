import type { Page } from '@playwright/test';

export type AtlasTab = 'Lakes' | 'Rivers' | 'Terrain' | 'Boundaries' | 'Infrastructure';

/** The atlas groups its controls in tabs; a test opens the one it needs, as a reader would. */
export async function openAtlasTab(page: Page, name: AtlasTab) {
  await page.getByRole('tablist', { name: 'Atlas controls' }).getByRole('tab', { name, exact: true }).click();
}
