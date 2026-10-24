'use client';
import { useT } from '../../lib/i18n';

/** Source-category table of contents; a client component so its aria-label follows the site language. */
export function SourceToc({ sections }: { sections: readonly (readonly [string, string, string])[] }) {
  const t = useT();
  return <nav className="source-toc" aria-label={t('Source categories', 'स्रोत वर्गहरू')}>{sections.map(([anchor, label, labelNe]) => <a key={anchor} href={`#${anchor}`}>{t(label, labelNe)}</a>)}</nav>;
}
