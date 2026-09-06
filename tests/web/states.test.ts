import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import { DataState } from '../../apps/web/components/data-state';
it('communicates all non-ready resource states', () => {
  for (const status of ['loading', 'empty', 'stale', 'error', 'unavailable'] as const) {
    const state = status === 'error' || status === 'unavailable' ? { status, message: 'Unavailable source' } : { status, data: null };
    const html = renderToStaticMarkup(createElement(DataState, { state }));
    expect(html).toMatch(/role="(status|alert)"/);
    expect(html).not.toContain('undefined');
  }
  expect(renderToStaticMarkup(createElement(DataState, { state: { status: 'ready', data: null } }))).toBe('');
});
