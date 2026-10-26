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
 * PLAY_URL set 2026-09-30 — the Play listing went live (verified: id com.ujjaintemple.guide
 * returns 200 as "Ujjain Guide: Mandir & Yatra" by ByteFlow Technologies Pvt Ltd).
 *
 * Inline card, not a popup or sticky bar: StickyCallBar already owns the bottom of the
 * screen, and nothing here may push the call/WhatsApp CTA out of the way.
 * GA4: `app_promo_click` with the placement, so installs can be traced to pages.
 */
export const PLAY_URL = 'https://play.google.com/store/apps/details?id=com.ujjaintemple.guide';

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

  // The main button is the Play Store listing for everyone (Aman, 2026-10-26) — it used to
  // open the in-browser app screens on desktop and iPhone, so the Play link never showed.
  // The browser version stays as a secondary link for people without Android.
  const track = (target: 'play' | 'app') => () =>
    window.gtag?.('event', 'app_promo_click', { placement, target });

  return (
    <section className={`container-page ${className}`} aria-label={hi ? 'उज्जैन गाइड ऐप' : 'Ujjain Guide app'}>
      <div className="mx-auto flex max-w-4xl flex-col gap-5 rounded-2xl border border-gold/40 bg-gradient-to-br from-maroon-800 via-maroon to-maroon-700 p-5 text-white shadow-lg sm:flex-row sm:items-center sm:p-6">
        <img src="/images/app/icon-192.png" alt="" width={72} height={72} loading="lazy"
          className="h-16 w-16 shrink-0 rounded-2xl shadow-md sm:h-[72px] sm:w-[72px]" />
        <div className="min-w-0 flex-1">
          {/* No "free" / "निःशुल्क" — cheap-word rule. No tracking on the Hindi label (splits conjuncts). */}
          <p className={`text-[11px] font-semibold text-gold-light ${hi ? '' : 'uppercase tracking-[0.2em]'}`}>
            {hi ? 'Android ऐप · Google Play पर' : 'Android app · on Google Play'}
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
        <div className="flex shrink-0 flex-col items-center gap-2">
          <a
            href={PLAY_URL}
            target="_blank"
            rel="noopener"
            onClick={track('play')}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-gold px-5 py-3 font-bold text-maroon-900 shadow-md transition-transform hover:bg-gold-light active:scale-95"
          >
            {hi ? 'Google Play से डाउनलोड करें' : 'Get it on Google Play'}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
          <a href={appHref} onClick={track('app')} className="text-xs text-white/75 underline underline-offset-2 hover:text-white">
            {hi ? 'या ब्राउज़र में खोलें' : 'or open in your browser'}
          </a>
        </div>
      </div>
    </section>
  );
}
