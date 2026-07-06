import { createContext, useContext, ReactNode, useMemo } from 'react';
import hiCommon from './locales/hi/common.json';
import enCommon from './locales/en/common.json';

export type Locale = 'hi' | 'en';

type Dict = Record<string, string>;
const dictionaries: Record<Locale, Dict> = {
  hi: hiCommon as Dict,
  en: enCommon as Dict,
};

interface I18nValue {
  locale: Locale;
  t: (key: string) => string;
  altLocale: Locale;
  hreflangPath: (currentPath: string) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const value = useMemo<I18nValue>(() => ({
    locale,
    t: (key) => dictionaries[locale][key] ?? key,
    altLocale: locale === 'hi' ? 'en' : 'hi',
    hreflangPath: (p) => locale === 'en' ? `/hi${p}` : p.replace(/^\/hi/, '') || '/',
  }), [locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}

export function tFor(locale: Locale, key: string): string {
  return dictionaries[locale][key] ?? key;
}
