import type { ReactNode } from 'react';
import { T } from './i18n';

/** A copy module: the same keys in English and project-authored Nepali (needs native-speaker review before operational
 * reliance). Client components read one language with `useCopy(module)`; server components use `bilingual(module)`. */
export type Copy<C> = { en: C; ne: C };

/** For server components: renders one key of a copy module as text that follows the site language switch. */
export function bilingual<C extends object>(copy: Copy<C>) {
  type TextKey = { [K in keyof C]: C[K] extends ReactNode ? K : never }[keyof C];
  return function Bilingual(key: TextKey) { return <T en={copy.en[key] as ReactNode} ne={copy.ne[key] as ReactNode} />; };
}
