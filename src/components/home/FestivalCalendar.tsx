import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '../../i18n';
import { UJJAIN_PARV, type Parv } from '../../data/ujjain-parv';

/**
 * Homepage "upcoming parv" block — the next few major festivals in Ujjain.
 *
 * Dates come only from data/ujjain-parv.ts (hand-curated from Drik Panchang for Ujjain,
 * guarded by scripts/check-parv.mjs). The previous version hardcoded four 2026 dates and
 * went stale, which is why it was pulled from the homepage in d8069d9.
 *
 * SSG: the list is rendered for the build day (__BUILD_DATE_IST__, injected in
 * vite.config.ts) on both server and first client render, then an effect moves it to the
 * visitor's real IST today — so an old build never shows a festival that has passed.
 */
declare const __BUILD_DATE_IST__: string;

const SHOW = 4;
// The original badge palette — no green.
const BADGE_COLORS = ['#8B0000', '#b34500', '#5c3a00', '#1a3a5c'];

/** Today's date in Ujjain (YYYY-MM-DD), whatever the device timezone is. */
function istToday(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(now);
}

function upcomingParv(today: string): Parv[] {
  return UJJAIN_PARV.filter((p) => (p.kind === 'parv' || p.kind === 'sankranti') && p.date >= today).slice(0, SHOW);
}

function daysUntil(iso: string, today: string): number {
  return Math.round((Date.parse(`${iso}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86400000);
}

/** Calendar dates are plain days, so format in UTC to avoid a shift across midnight. */
function fmt(iso: string, isHi: boolean, opts: Intl.DateTimeFormatOptions): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(isHi ? 'hi-IN' : 'en-IN', { ...opts, timeZone: 'UTC' });
}

function whenLabel(days: number, isHi: boolean): string {
  if (days === 0) return isHi ? 'आज' : 'Today';
  if (days === 1) return isHi ? 'कल' : 'Tomorrow';
  return isHi ? `${days} दिन बाद` : `In ${days} days`;
}

export function FestivalCalendar() {
  const { locale } = useI18n();
  const isHi = locale === 'hi';
  const prefix = locale === 'en' ? '' : '/hi';

  const [today, setToday] = useState<string>(__BUILD_DATE_IST__);
  useEffect(() => {
    setToday(istToday());
  }, []);

  const list = upcomingParv(today);
  if (list.length === 0) return null;

  return (
    <section className="bg-white">
      <div className="container-page py-16 sm:py-20">
        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-saffron-700 mb-2">
              {isHi ? 'पर्व · त्यौहार · उत्सव' : 'Festivals & Sacred Events'}
            </p>
            <h2
              className={`font-bold text-maroon ${isHi ? 'font-sanskrit' : 'font-serif'}`}
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.4rem)' }}
            >
              {isHi ? 'उज्जैन में आने वाले प्रमुख पर्व कब हैं?' : 'When are the next major festivals in Ujjain?'}
            </h2>
          </div>
          <Link
            to={`${prefix}/simhastha-2028/`}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold
              text-maroon underline-offset-4 hover:underline"
          >
            {isHi ? 'सिंहस्थ 2028 कैलेंडर देखें' : 'View Simhastha 2028 Calendar'}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Festival list */}
        <ul className="space-y-4">
          {list.map((p, i) => {
            const color = BADGE_COLORS[i % BADGE_COLORS.length];
            const note = isHi ? p.noteHi : p.noteEn;
            return (
              <li
                key={`${p.date}-${p.en}`}
                className="group flex items-start gap-4 sm:gap-6 rounded-2xl border border-gold/20
                  bg-cream/50 p-5 sm:p-6 hover:border-gold/40 hover:bg-cream
                  transition-all duration-200 hover:shadow-sm"
              >
                {/* Date badge */}
                <div
                  className="flex-shrink-0 flex flex-col items-center justify-center
                    w-14 h-14 rounded-xl text-white shadow-sm"
                  style={{ background: color }}
                  aria-hidden="true"
                >
                  <span className="text-[9px] font-bold uppercase tracking-wider leading-none mb-0.5">
                    {/* en-IN abbreviates September as "Sept"; the badge uses three letters. */}
                    {isHi ? fmt(p.date, true, { month: 'short' }) : fmt(p.date, false, { month: 'short' }).slice(0, 3)}
                  </span>
                  <span className="text-xl font-bold leading-none">{fmt(p.date, false, { day: 'numeric' })}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap">
                    <h3 className={`font-bold text-maroon ${isHi ? 'font-sanskrit text-base' : 'font-serif text-[15px]'}`}>
                      {isHi ? p.hi : p.en}
                    </h3>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                      style={{ background: `${color}15`, color }}
                    >
                      {whenLabel(daysUntil(p.date, today), isHi)}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium mt-0.5" style={{ color }}>
                    <time dateTime={p.date}>
                      {fmt(p.date, isHi, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </time>
                  </p>
                  {note && <p className="text-sm text-ink-soft leading-relaxed mt-2">{note}</p>}
                </div>
              </li>
            );
          })}
        </ul>

        <p className="mt-5 text-[11px] text-ink-soft">
          {isHi
            ? 'तिथियाँ द्रिक पंचांग (उज्जैन) के अनुसार। स्थानीय परंपरा में एक दिन का अंतर संभव है।'
            : 'Dates as per Drik Panchang for Ujjain. Local observance may differ by a day.'}
        </p>

        {/* Mobile CTA */}
        <div className="mt-8 sm:hidden text-center">
          <Link to={`${prefix}/simhastha-2028/`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-maroon">
            {isHi ? 'सिंहस्थ 2028 कैलेंडर' : 'View Simhastha 2028 Calendar'}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
