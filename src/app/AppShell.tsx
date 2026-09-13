import { useEffect, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Head } from 'vite-react-ssg';
import { CalendarDays, Home, Landmark, Newspaper, Route } from 'lucide-react';
import { useI18n } from '../i18n';
import { appPath, writeStore, type AppTab } from './lib';
import { registerAppSW } from './pwa';

// Ujjain first, Simhastha second (Aman, 2026-09-13): a Simhastha-only app has little
// reason to be installed 18 months out; temples, vrat dates and the 84 Mahadev yatra
// are useful today. "Guide" also keeps it from reading as the official mela app.
export const APP_NAME = { hi: 'उज्जैन गाइड', en: 'Ujjain Guide' };

const TABS: { tab: AppTab; hi: string; en: string; Icon: typeof Home }[] = [
  { tab: '', hi: 'होम', en: 'Home', Icon: Home },
  { tab: 'news/', hi: 'समाचार', en: 'News', Icon: Newspaper },
  { tab: 'calendar/', hi: 'पर्व', en: 'Calendar', Icon: CalendarDays },
  { tab: 'mandirs/', hi: 'मंदिर', en: 'Temples', Icon: Landmark },
  { tab: 'plan/', hi: 'यात्रा', en: 'Plan', Icon: Route },
];

/**
 * App chrome: top bar, bottom tabs, and the head tags every app screen shares.
 *
 * App screens are noindex — they repeat what the website's indexed pages already
 * carry, and a thin app page competing with /simhastha-2028/ would only split its
 * ranking. They are also kept out of sitemap.xml and the pagefind index.
 */
export function AppShell({ tab, title, children }: { tab: AppTab; title: string; children: ReactNode }) {
  const { locale } = useI18n();
  const hi = locale === 'hi';
  const { pathname, search } = useLocation();
  const otherLocalePath = hi ? pathname.replace(/^\/hi/, '') : `/hi${pathname}`;
  // 84 Mahadev lives under the Temples tab.
  const activeTab: AppTab = tab === '84-mahadev/' ? 'mandirs/' : tab;

  useEffect(() => {
    registerAppSW();
    writeStore('ujt-app-lang', locale);
  }, [locale]);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <html lang={hi ? 'hi-IN' : 'en-IN'} />
        <title>{`${title} · ${APP_NAME[locale]}`}</title>
        <meta name="description" content={hi
          ? 'सिंहस्थ 2028 उज्जैन — ताज़ा समाचार, शाही स्नान की तिथियाँ, पर्व कैलेंडर, मंदिर गाइड और 84 महादेव यात्रा।'
          : 'Simhastha 2028 Ujjain — latest news, Shahi Snan dates, festival calendar, temple guide and the 84 Mahadev yatra.'} />
        <meta name="robots" content="noindex, follow" />
        <meta name="theme-color" content="#8B1A1A" />
        <link rel="manifest" href="/app.webmanifest" />
      </Head>

      <div data-pagefind-ignore="all" className="min-h-screen bg-cream">
        <header
          className="sticky top-0 z-30 bg-maroon text-white shadow-md"
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
          <div className="mx-auto flex h-14 max-w-xl items-center justify-between gap-3 px-4">
            <Link to={appPath(locale)} className="flex min-w-0 items-center gap-2">
              <img src="/favicon.svg" alt="" width={28} height={28} className="h-7 w-7 shrink-0 rounded-md" />
              <span className={`truncate font-bold ${hi ? 'font-hindi text-lg' : 'text-base'}`}>{APP_NAME[locale]}</span>
            </Link>
            <Link
              to={`${otherLocalePath}${search}`}
              onClick={() => writeStore('ujt-app-lang', hi ? 'en' : 'hi')}
              className="shrink-0 rounded-full border border-white/50 px-3 py-1 text-xs font-semibold hover:bg-white/10"
              aria-label={hi ? 'Switch to English' : 'हिन्दी में देखें'}
            >
              {hi ? 'English' : 'हिन्दी'}
            </Link>
          </div>
        </header>

        <main id="main" className="mx-auto max-w-xl px-4 pb-28 pt-4">
          {children}
        </main>

        <nav
          aria-label={hi ? 'ऐप नेविगेशन' : 'App navigation'}
          className="fixed inset-x-0 bottom-0 z-30 border-t border-gold/30 bg-white/95 backdrop-blur"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <ul className="mx-auto grid max-w-xl grid-cols-5">
            {TABS.map(({ tab: t, hi: labelHi, en: labelEn, Icon }) => {
              const active = t === activeTab;
              return (
                <li key={t || 'home'}>
                  <Link
                    to={appPath(locale, t)}
                    aria-current={active ? 'page' : undefined}
                    className={`flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors ${
                      active ? 'text-maroon' : 'text-ink-mute hover:text-maroon'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${active ? 'stroke-[2.5]' : ''}`} aria-hidden />
                    {hi ? labelHi : labelEn}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 mt-6 flex items-end justify-between gap-3 first:mt-0">
      <h2 className="font-serif text-xl font-bold text-maroon">{children}</h2>
      {action}
    </div>
  );
}
