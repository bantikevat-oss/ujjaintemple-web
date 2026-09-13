import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarPlus, Landmark, ListChecks, Newspaper, Route, ScrollText } from 'lucide-react';
import { useI18n } from '../../i18n';
import { SITE } from '../../lib/site';
import { SHAHI_SNANS, SNAN_SOURCE_EN, SNAN_SOURCE_HI } from '../../data/simhastha-dates';
import { UJJAIN_PARV } from '../../data/ujjain-parv';
import { AppShell, SectionTitle } from '../AppShell';
import { NotifyToggle } from '../NotifyToggle';
import { InstallPrompt } from '../InstallPrompt';
import {
  NEWS_SECTION, appPath, daysUntil, fetchNews, formatDate, googleCalendarLink, istToday, readStore, type NewsItem,
} from '../lib';

export function AppHome() {
  const { locale } = useI18n();
  const hi = locale === 'hi';
  const navigate = useNavigate();
  const { search } = useLocation();
  const [today, setToday] = useState<string | null>(null);
  const [news, setNews] = useState<NewsItem[] | null>(null);

  useEffect(() => {
    setToday(istToday());
    // The installed app always launches into /hi/app/; honour a saved English choice.
    if (hi && new URLSearchParams(search).has('source') && readStore<string>('ujt-app-lang', 'hi') === 'en') {
      navigate('/app/', { replace: true });
    }
    fetchNews(3).then(setNews).catch(() => setNews([]));
  }, []);

  const nextSnan = today ? SHAHI_SNANS.find((s) => s.iso >= today) : SHAHI_SNANS[0];
  const days = today && nextSnan ? daysUntil(nextSnan.iso, today) : null;

  const nextParv = useMemo(
    () => (today ? UJJAIN_PARV.filter((p) => p.date >= today && p.kind === 'parv').slice(0, 3) : []),
    [today],
  );

  return (
    <AppShell tab="" title={hi ? 'होम' : 'Home'}>
      {/* Countdown */}
      <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-maroon-800 via-maroon to-maroon-600 p-5 text-white shadow-lg">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-light">
          {hi ? 'सिंहस्थ 2028 · उज्जैन' : 'Simhastha 2028 · Ujjain'}
        </p>
        {nextSnan ? (
          <>
            <p className="mt-3 text-sm text-white/80">{hi ? nextSnan.nameHi : nextSnan.nameEn}</p>
            <p className="mt-1 flex items-baseline gap-2">
              <span className="font-serif text-5xl font-bold leading-none" aria-live="polite">
                {days === null ? '—' : days}
              </span>
              <span className="text-lg font-semibold">
                {days === 0 ? (hi ? 'आज' : 'today') : hi ? 'दिन शेष' : days === 1 ? 'day to go' : 'days to go'}
              </span>
            </p>
            <p className="mt-1 text-sm text-white/80">{hi ? nextSnan.dateHi : nextSnan.dateEn}</p>
          </>
        ) : (
          <p className="mt-3 font-serif text-2xl font-bold">{hi ? 'सिंहस्थ 2028 के शाही स्नान सम्पन्न' : 'The Simhastha 2028 Shahi Snans are complete'}</p>
        )}
      </section>
      <InstallPrompt />

      {/* Shahi Snan dates + reminders */}
      <SectionTitle>{hi ? 'शाही स्नान की तिथियाँ' : 'Shahi Snan dates'}</SectionTitle>
      <ul className="space-y-2">
        {SHAHI_SNANS.map((s) => (
          <li key={s.iso} className="flex items-center justify-between gap-3 rounded-xl border border-gold/40 bg-white p-3">
            <div className="min-w-0">
              <p className="font-semibold text-ink">{hi ? s.nameHi : s.nameEn}</p>
              <p className="text-sm text-ink-soft">{hi ? s.dateHi : s.dateEn}</p>
            </div>
            <a
              href={googleCalendarLink(
                hi ? `${s.nameHi} — सिंहस्थ 2028, उज्जैन` : `${s.nameEn} — Simhastha 2028, Ujjain`,
                s.iso,
                hi ? `तिथि का स्रोत: ${SNAN_SOURCE_HI}। यात्रा से पहले आधिकारिक घोषणा देख लें।`
                  : `Date source: ${SNAN_SOURCE_EN}. Check the official announcement before you travel.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-maroon/30 px-3 py-2 text-xs font-semibold text-maroon hover:bg-maroon-50"
            >
              <CalendarPlus className="h-4 w-4" aria-hidden />
              {hi ? 'रिमाइंडर' : 'Remind me'}
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-ink-mute">
        {hi
          ? `स्रोत: ${SNAN_SOURCE_HI}। तिथियों की आधिकारिक अधिसूचना मेला प्रशासन जारी करेगा।`
          : `Source: ${SNAN_SOURCE_EN}. The official notification will come from the mela administration.`}
      </p>

      {/* Quick tiles */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        {[
          { to: appPath(locale, '84-mahadev/'), Icon: ListChecks, hi: '84 महादेव यात्रा', en: '84 Mahadev yatra', subHi: 'दर्शन पर निशान लगाएँ', subEn: 'Tick off each darshan' },
          { to: appPath(locale, 'mandirs/'), Icon: Landmark, hi: 'मंदिर गाइड', en: 'Temple guide', subHi: '183 मंदिर · ऑफ़लाइन', subEn: '183 temples · offline' },
          { to: appPath(locale, 'calendar/'), Icon: ScrollText, hi: 'पर्व कैलेंडर', en: 'Festival calendar', subHi: 'एकादशी, पूर्णिमा, पर्व', subEn: 'Ekadashi, Purnima, parv' },
          { to: appPath(locale, 'plan/'), Icon: Route, hi: 'यात्रा योजना', en: 'Plan a trip', subHi: 'कैब · होटल · टूर', subEn: 'Cab · hotel · tour' },
        ].map((t) => (
          <Link key={t.to} to={t.to} className="rounded-xl border border-gold/40 bg-white p-3 transition-colors hover:border-saffron">
            <t.Icon className="h-6 w-6 text-saffron-600" aria-hidden />
            <p className="mt-2 font-semibold leading-tight text-maroon">{hi ? t.hi : t.en}</p>
            <p className="mt-0.5 text-xs text-ink-mute">{hi ? t.subHi : t.subEn}</p>
          </Link>
        ))}
      </div>

      {/* Next festivals */}
      {nextParv.length > 0 && (
        <>
          <SectionTitle action={<Link to={appPath(locale, 'calendar/')} className="text-sm font-semibold text-maroon">{hi ? 'सभी' : 'All'}</Link>}>
            {hi ? 'आने वाले पर्व' : 'Coming up'}
          </SectionTitle>
          <ul className="divide-y divide-cream-dark rounded-xl border border-gold/40 bg-white">
            {nextParv.map((p) => (
              <li key={p.date + p.en} className="flex items-center gap-3 p-3">
                <span className="w-24 shrink-0 text-sm font-semibold text-saffron-700">
                  {formatDate(p.date, locale, { day: 'numeric', month: 'short' })}
                </span>
                <span className="text-sm text-ink">{hi ? p.hi : p.en}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Latest news */}
      <SectionTitle action={<Link to={appPath(locale, 'news/')} className="text-sm font-semibold text-maroon">{hi ? 'सभी' : 'All'}</Link>}>
        {hi ? 'ताज़ा समाचार' : 'Latest news'}
      </SectionTitle>
      {news === null ? (
        <p className="text-sm text-ink-mute">{hi ? 'लोड हो रहा है…' : 'Loading…'}</p>
      ) : news.length === 0 ? (
        <p className="rounded-xl bg-white p-3 text-sm text-ink-soft">
          {hi ? 'समाचार अभी नहीं खुल पाए — इंटरनेट जुड़ने पर दिखेंगे।' : 'News could not load — it will show once you are online.'}
        </p>
      ) : (
        <ul className="space-y-2">
          {news.map((n) => (
            <li key={n.link}>
              {/* Plain <a>: articles are server-rendered PHP, not React routes. */}
              <a href={n.link} className="flex items-start gap-3 rounded-xl border border-gold/40 bg-white p-3 hover:border-saffron">
                <Newspaper className="mt-0.5 h-5 w-5 shrink-0 text-saffron-600" aria-hidden />
                <span className="min-w-0">
                  <span className="block font-hindi font-semibold leading-snug text-maroon">{n.title}</span>
                  {n.iso && <span className="mt-1 block text-xs text-ink-mute">{formatDate(n.iso, locale)}</span>}
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-3">
        <NotifyToggle />
      </div>
      {!hi && <p className="mt-2 text-xs text-ink-mute">News articles are published in Hindi.</p>}

      {/* About + disclaimer */}
      <section className="mt-8 rounded-xl border border-cream-dark bg-white/70 p-4 text-xs leading-relaxed text-ink-soft">
        <p className="font-semibold text-ink">{hi ? 'इस ऐप के बारे में' : 'About this app'}</p>
        <p className="mt-1">
          {hi
            ? 'यह UjjainTemple.com का निजी सूचना ऐप है। यह सरकारी ऐप नहीं है और सिंहस्थ मेला प्रशासन, मंदिर समिति या किसी सरकारी विभाग से सम्बद्ध नहीं है। हम दर्शन, भस्म आरती या पूजा की बुकिंग नहीं करते — वह व्यवस्था मंदिर समिति के अधीन है।'
            : 'This is an independent information app by UjjainTemple.com. It is not a government app and is not affiliated with the Simhastha mela administration, any temple committee or government department. We do not book darshan, Bhasma Aarti or puja — those are managed by the temple committees.'}
        </p>
        <p className="mt-2">
          <a href={NEWS_SECTION} className="text-link underline">{hi ? 'समाचार' : 'News'}</a>
          {' · '}
          <a href={`${hi ? '/hi' : ''}/simhastha-2028/`} className="text-link underline">{hi ? 'सिंहस्थ 2028 जानकारी' : 'Simhastha 2028 guide'}</a>
          {' · '}
          <a href={`${hi ? '/hi' : ''}/privacy-policy/`} className="text-link underline">{hi ? 'गोपनीयता नीति' : 'Privacy policy'}</a>
          {' · '}
          <a href={SITE.phoneTel} className="text-link underline">{SITE.phone}</a>
        </p>
        <p className="mt-2">
          {hi ? 'निर्माण: ' : 'Built by '}
          <a href="https://byteflowtech.in/" className="font-semibold text-maroon underline">ByteFlow Technologies Pvt Ltd</a>
          <ArrowRight className="ml-1 inline h-3 w-3" aria-hidden />
        </p>
      </section>
    </AppShell>
  );
}
