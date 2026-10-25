'use client';
import { useLanguage } from '../../lib/i18n';
import { PageToc } from '../../components/longform';

const TOC_LABEL = { en: 'Source categories', ne: 'स्रोत वर्गहरू' };

/** Source-category table of contents; a client component so its labels follow the site language. */
export function SourceToc({ sections }: { sections: readonly (readonly [string, string, string])[] }) {
  const [lang] = useLanguage();
  return <PageToc className="source-toc" label={TOC_LABEL[lang]}>{sections.map(([anchor, label, labelNe]) => <a key={anchor} href={`#${anchor}`}>{lang === 'ne' ? labelNe : label}</a>)}</PageToc>;
}
