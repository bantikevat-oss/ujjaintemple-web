import { ArrowRight, CalendarDays, Landmark, ListChecks, WifiOff } from 'lucide-react';
import { useI18n } from '../../i18n';

/**
 * "Ujjain Guide" app promo card for website pages (2026-09-13, Aman: option A).
 *
 * Play Store search will not bring installs 18 months before the mela — the official
 * MP govt Simhastha app itself had 100+ installs — so the site's own visitors are the
 * install channel. This card sends them to the app screens (/hi/app/), where Chrome
 * offers "install" and the Android app will be linked once its Play listing is live.
 *
 * To point Android visitors at Play later: set PLAY_URL below. One line, no layout change.
 *
 * Inline card, not a popup or sticky bar: StickyCallBar already owns the bottom of the
 * screen, and nothing here may push the call/WhatsApp CTA out of the way.
 * GA4: `app_promo_click` with the placement, so installs can be traced to pages.
 */
export const PLAY_URL = '';

const FEATURES = [
  { Icon: WifiOff, hi: '183 मंदिर — बिना इंटरनेट', en: '183 temples — offline' },
  { Icon: CalendarDays, hi: 'उज्जैन पर्व कैलेंडर', en: 'Ujjain festival calendar' },
  { Icon: ListChecks, hi: '84 महादेव चेकलिस्ट', en: '84 Mahadev checklist' },
  { Icon: Landmark, hi: 'सिंहस्थ 2028 समाचार', en: 'Simhastha 2028 news' },
];

declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}

export function AppPromo({ placement, className = '' }: { placement: string; className?: string }) {
  const { locale } = useI18n();
  const hi = locale === 'hi';
  const appHref = `${hi ? '/hi' : ''}/app/?source=promo-${placement}`;

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    window.gtag?.('event', 'app_promo_click', { placement, target: PLAY_URL ? 'play' : 'app' });
    // Android visitors go to Play once the listing exists; everyone else opens the app screens.
    if (PLAY_URL && /Android/i.test(navigator.userAgent)) {
      e.preventDefault();
      window.location.href = PLAY_URL;
    }
  };

  return (
    <section className={`container-page ${className}`} aria-label={hi ? 'उज्जैन गाइड ऐप' : 'Ujjain Guide app'}>
      <div className="mx-auto flex max-w-4xl flex-col gap-5 rounded-2xl border border-gold/40 bg-gradient-to-br from-maroon-800 via-maroon to-maroon-700 p-5 text-white shadow-lg sm:flex-row sm:items-center sm:p-6">
        <img src="/images/app/icon-192.png" alt="" width={72} height={72} loading="lazy"
          className="h-16 w-16 shrink-0 rounded-2xl shadow-md sm:h-[72px] sm:w-[72px]" />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-light">
            {hi ? 'निःशुल्क ऐप' : 'Free app'}
          </p>
          <h2 className={`mt-1 text-xl font-bold leading-snug sm:text-2xl ${hi ? 'font-sanskrit' : 'font-serif'}`}>
            {hi ? 'उज्जैन गाइड — यात्रा में जेब में' : 'Ujjain Guide — in your pocket'}
          </h2>
          <ul className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1.5 text-sm text-white/90 sm:grid-cols-2">
            {FEATURES.map(({ Icon, hi: fHi, en: fEn }) => (
              <li key={fEn} className="flex items-center gap-2">
                <Icon className="h-4 w-4 shrink-0 text-gold-light" aria-hidden />
                {hi ? fHi : fEn}
              </li>
            ))}
          </ul>
        </div>
        <a
          href={appHref}
          onClick={onClick}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-gold px-5 py-3 font-bold text-maroon-900 shadow-md transition-transform hover:bg-gold-light active:scale-95"
        >
          {hi ? 'ऐप खोलें' : 'Open the app'}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </a>
      </div>
    </section>
  );
}
