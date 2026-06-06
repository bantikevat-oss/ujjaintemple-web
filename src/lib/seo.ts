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
  if (locale === 'hi') return `${SITE.url}/${cleanPath}${cleanPath ? '/' : ''}`;
  return `${SITE.url}/en/${cleanPath}${cleanPath ? '/' : ''}`;
}

export function buildHreflang(path: string): Array<{ hreflang: string; href: string }> {
  const cleanPath = path.replace(/^\/+|\/+$/g, '').replace(/^en\//, '');
  return [
    { hreflang: 'hi-IN', href: `${SITE.url}/${cleanPath}${cleanPath ? '/' : ''}` },
    { hreflang: 'en-IN', href: `${SITE.url}/en/${cleanPath}${cleanPath ? '/' : ''}` },
    { hreflang: 'x-default', href: `${SITE.url}/${cleanPath}${cleanPath ? '/' : ''}` },
  ];
}
