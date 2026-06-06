import type { Article } from '../lib/types';

const allModules = import.meta.glob<{ default: Article }>(
  '../content/{simhastha,transport,tours,puja-info,blog}/*.json',
  { eager: true }
);

export const articles: Article[] = Object.values(allModules).map((m) => m.default);

export const articleBySlug = new Map(articles.map((a) => [`${a.category}/${a.slug}`, a]));

export const articlesByCategory = (cat: Article['category']) =>
  articles.filter((a) => a.category === cat);

export const articlePath = (a: Article): string => {
  const map: Record<Article['category'], string> = {
    simhastha: '/simhastha-2028',
    transport: '/transport-in-ujjain',
    tour: '/tour-and-travel-ujjain',
    'puja-info': '/puja-in-ujjain',
    blog: '/blog',
  };
  return `${map[a.category]}/${a.slug}/`;
};

export function getRelatedArticles(article: Article, limit = 3): Article[] {
  if (!article.relatedSlugs?.length) {
    return articles.filter((a) => a.category === article.category && a.slug !== article.slug).slice(0, limit);
  }
  return article.relatedSlugs
    .map((slug) => articles.find((a) => a.slug === slug))
    .filter((a): a is Article => Boolean(a))
    .slice(0, limit);
}
