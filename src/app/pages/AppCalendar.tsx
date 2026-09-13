import { useEffect, useMemo, useState } from 'react';
import { CalendarPlus } from 'lucide-react';
import { useI18n } from '../../i18n';
import { UJJAIN_PARV, type ParvKind } from '../../data/ujjain-parv';
import { SHAHI_SNANS, SNAN_SOURCE_EN, SNAN_SOURCE_HI } from '../../data/simhastha-dates';
import { AppShell } from '../AppShell';
import { formatDate, googleCalendarLink, istToday } from '../lib';

type Row = {
  date: string;
  hi: string;
  en: string;
  kind: ParvKind | 'simhastha';
  vaishnavaNext?: true;
  noteHi?: string;
  noteEn?: string;
};

type Filter = 'all' | 'parv' | 'ekadashi' | 'moon';

const FILTERS: { id: Filter; hi: string; en: string }[] = [
  { id: 'all', hi: 'सभी', en: 'All' },
  { id: 'parv', hi: 'प्रमुख पर्व', en: 'Festivals' },
  { id: 'ekadashi', hi: 'एकादशी', en: 'Ekadashi' },
  { id: 'moon', hi: 'पूर्णिमा · अमावस्या', en: 'Purnima · Amavasya' },
];

const matches = (r: Row, f: Filter) =>
  f === 'all' ||
  (f === 'parv' && (r.kind === 'parv' || r.kind === 'sankranti' || r.kind === 'simhastha')) ||
  (f === 'ekadashi' && r.kind === 'ekadashi') ||
  (f === 'moon' && (r.kind === 'purnima' || r.kind === 'amavasya'));

const ROWS: Row[] = [
  ...UJJAIN_PARV,
  ...SHAHI_SNANS.map((s) => ({
    date: s.iso,
    hi: `${s.nameHi} · सिंहस्थ 2028`,
    en: `${s.nameEn} · Simhastha 2028`,
    kind: 'simhastha' as const,
    noteHi: `तिथि का स्रोत: ${SNAN_SOURCE_HI}।`,
    noteEn: `Date source: ${SNAN_SOURCE_EN}.`,
  })),
].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

export function AppCalendar() {
  const { locale } = useI18n();
  const hi = locale === 'hi';
  const [today, setToday] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => setToday(istToday()), []);

  const months = useMemo(() => {
    const groups = new Map<string, Row[]>();
    for (const r of ROWS) {
      if (today && r.date < today) continue;
      if (!matches(r, filter)) continue;
      const key = r.date.slice(0, 7);
      groups.set(key, [...(groups.get(key) ?? []), r]);
    }
    return [...groups.entries()];
  }, [today, filter]);

  return (
    <AppShell tab="calendar/" title={hi ? 'पर्व कैलेंडर' : 'Festival calendar'}>
      <h1 className="font-serif text-2xl font-bold text-maroon">{hi ? 'उज्जैन पर्व कैलेंडर' : 'Ujjain festival calendar'}</h1>
      <p className="mt-1 text-sm text-ink-soft">
        {hi ? 'व्रत, एकादशी, पूर्णिमा और सिंहस्थ 2028 के शाही स्नान — जून 2028 तक।' : 'Vrat, Ekadashi, Purnima and the Simhastha 2028 Shahi Snans — through June 2028.'}
      </p>

      <div className="sticky top-14 z-20 -mx-4 mt-4 flex gap-2 overflow-x-auto bg-cream px-4 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            aria-pressed={filter === f.id}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              filter === f.id ? 'bg-maroon text-white' : 'border border-maroon/25 bg-white text-maroon'
            }`}
          >
            {hi ? f.hi : f.en}
          </button>
        ))}
      </div>

      {months.map(([month, rows]) => (
        <section key={month} className="mt-5">
          <h2 className="mb-2 font-serif text-lg font-bold text-maroon">
            {formatDate(`${month}-01`, locale, { month: 'long', year: 'numeric' })}
          </h2>
          <ul className="divide-y divide-cream-dark overflow-hidden rounded-xl border border-gold/40 bg-white">
            {rows.map((r) => {
              const special = r.kind === 'simhastha';
              return (
                <li key={r.date + r.en} className={`flex gap-3 p-3 ${special ? 'bg-gold-50' : ''}`}>
                  <div className="w-12 shrink-0 text-center">
                    <p className="font-serif text-2xl font-bold leading-none text-maroon">{Number(r.date.slice(8))}</p>
                    <p className="mt-1 text-[11px] text-ink-mute">{formatDate(r.date, locale, { weekday: 'short' })}</p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`font-semibold leading-snug ${special ? 'text-maroon' : 'text-ink'}`}>{hi ? r.hi : r.en}</p>
                    {(hi ? r.noteHi : r.noteEn) && <p className="mt-0.5 text-xs text-ink-soft">{hi ? r.noteHi : r.noteEn}</p>}
                    {r.vaishnavaNext && (
                      <p className="mt-0.5 text-xs text-ink-mute">
                        {hi ? 'वैष्णव परंपरा में व्रत अगले दिन।' : 'Vaishnava tradition keeps the fast the next day.'}
                      </p>
                    )}
                  </div>
                  <a
                    href={googleCalendarLink(hi ? r.hi : r.en, r.date, hi ? 'UjjainTemple.com पर्व कैलेंडर' : 'UjjainTemple.com festival calendar')}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={hi ? `${r.hi} — कैलेंडर में जोड़ें` : `${r.en} — add to calendar`}
                    className="grid h-10 w-10 shrink-0 place-items-center self-center rounded-full text-maroon hover:bg-maroon-50"
                  >
                    <CalendarPlus className="h-5 w-5" aria-hidden />
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      {months.length === 0 && today && (
        <p className="mt-6 rounded-xl bg-white p-4 text-sm text-ink-soft">
          {hi ? 'इस श्रेणी में आगे कोई तिथि नहीं है।' : 'No upcoming dates in this filter.'}
        </p>
      )}

      <p className="mt-6 text-xs leading-relaxed text-ink-mute">
        {hi
          ? 'तिथियाँ उज्जैन के लिए प्रकाशित पंचांग (Drik Panchang) से मिलाई गई हैं। व्रत, मुहूर्त और पूजा का समय अपने पंडित जी या स्थानीय पंचांग से अवश्य पुष्टि करें।'
          : 'Dates are matched against the published panchang for Ujjain (Drik Panchang). Confirm vrat, muhurat and puja timings with your pandit or a local panchang.'}
      </p>
    </AppShell>
  );
}
