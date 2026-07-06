import { SITE } from './site';
import type { Locale } from '../i18n';

export interface SeoMeta {
  title: string;
  description: string;
  path: string;
  locale: Locale;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
}

export function buildCanonical(path: string, locale: Locale): string {
  const cleanPath = path.replace(/^\/+|\/+$/g, '');
  if (locale === 'en') return `${SITE.url}/${cleanPath}${cleanPath ? '/' : ''}`;
  return `${SITE.url}/hi/${cleanPath}${cleanPath ? '/' : ''}`;
}

export function buildHreflang(path: string): Array<{ hreflang: string; href: string }> {
  const cleanPath = path.replace(/^\/+|\/+$/g, '').replace(/^hi\//, '');
  return [
    { hreflang: 'en-IN', href: `${SITE.url}/${cleanPath}${cleanPath ? '/' : ''}` },
    { hreflang: 'hi-IN', href: `${SITE.url}/hi/${cleanPath}${cleanPath ? '/' : ''}` },
    { hreflang: 'x-default', href: `${SITE.url}/${cleanPath}${cleanPath ? '/' : ''}` },
  ];
}
