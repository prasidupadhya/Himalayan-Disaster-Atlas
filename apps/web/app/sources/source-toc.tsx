'use client';
import { useLanguage } from '../../lib/i18n';

const TOC_LABEL = { en: 'Source categories', ne: 'स्रोत वर्गहरू' };

/** Source-category table of contents; a client component so its aria-label follows the site language. */
export function SourceToc({ sections }: { sections: readonly (readonly [string, string, string])[] }) {
  const [lang] = useLanguage();
  return <nav className="source-toc" aria-label={lang === 'ne' ? TOC_LABEL.ne : TOC_LABEL.en}>{sections.map(([anchor, label, labelNe]) => <a key={anchor} href={`#${anchor}`}>{lang === 'ne' ? labelNe : label}</a>)}</nav>;
}
