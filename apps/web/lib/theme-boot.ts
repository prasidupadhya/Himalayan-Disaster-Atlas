/** Shared by the theme control (lib/theme.tsx) and the root layout, which inlines THEME_BOOT in <head>. Not a client
 * module, so the server layout receives the string itself. */
export const THEME_KEY = 'atlas-theme';
// Browser chrome colour per resolved theme; the same values as --surface in app/styles/tokens.css.
export const CHROME = { light: '#ffffff', dark: '#14232b' } as const;

/** Runs before first paint, so a remembered dark choice never flashes light. Must match applyTheme in lib/theme.tsx. */
export const THEME_BOOT = `(function(){try{var c=localStorage.getItem('${THEME_KEY}');var r=document.documentElement;if(c==='light'||c==='dark')r.setAttribute('data-theme',c);var d=c==='dark'||(c!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',d?'${CHROME.dark}':'${CHROME.light}')}catch(e){}})()`;
