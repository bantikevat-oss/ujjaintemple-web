import { useLocation } from 'react-router-dom';
import { I18nProvider, type Locale } from '../../i18n';
import type { Article } from '../../lib/types';
import { ArticleDetail } from './Detail';

/**
 * Lazy route entry for every article page (simhastha / transport / tour / puja-info).
 *
 * `Detail.tsx` is the only consumer of `data/articles`, whose eager glob carries all
 * 25 FULL articles — 478 KB, 71% of it `body` and 16% `faqs`. While routes.tsx
 * imported it statically that JSON sat in the entry graph, so Vite shipped a
 * 119 KB-gzipped chunk on EVERY page even though each page's prose is already baked
 * into its SSG HTML. Behind `lazy`, only article pages fetch it.
 *
 * Category and slug come from the URL because react-router's `lazy` returns a
 * Component, not props. Each article route is registered with a literal path, and
 * the category is recoverable from the section prefix — the same mapping
 * `articlePath()` writes, read backwards.
 */
const PREFIX_TO_CATEGORY: Record<string, Article['category']> = {
  'simhastha-2028': 'simhastha',
  'transport-in-ujjain': 'transport',
  'tour-and-travel-ujjain': 'tour',
  'puja-in-ujjain': 'puja-info',
  blog: 'blog',
};

function parsePath(pathname: string): { category: Article['category']; slug: string } {
  const parts = pathname.replace(/^\/+|\/+$/g, '').split('/');
  if (parts[0] === 'hi' || parts[0] === 'en') parts.shift();
  const [section, slug] = parts;
  return { category: PREFIX_TO_CATEGORY[section] ?? 'blog', slug: slug ?? '' };
}

function LocalisedArticle({ locale }: { locale: Locale }) {
  const { pathname } = useLocation();
  const { category, slug } = parsePath(pathname);
  return (
    <I18nProvider locale={locale}>
      <ArticleDetail category={category} slug={slug} />
    </I18nProvider>
  );
}

export function ArticleDetailEn() {
  return <LocalisedArticle locale="en" />;
}

export function ArticleDetailHi() {
  return <LocalisedArticle locale="hi" />;
}
