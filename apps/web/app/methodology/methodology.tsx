'use client';
import { useLanguage } from '../../lib/i18n';
import { MethodologyEn } from './article-en';
import { MethodologyNe } from './article-ne';

/** One article per language, chosen by the site switch. A client module, so the text ships once in a script instead
 * of being repeated in the page's flight data and prefetch files (which the offline shell pins). */
export function Methodology() {
  const [lang] = useLanguage();
  return lang === 'ne' ? <MethodologyNe /> : <MethodologyEn />;
}
