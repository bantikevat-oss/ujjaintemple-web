import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Clock, ExternalLink, IndianRupee, ListChecks, MapPin, Navigation, Search, X } from 'lucide-react';
import { useI18n } from '../../i18n';
import type { Bilingual } from '../../lib/types';
import appMandirs from '../../generated/app-mandirs.json';
import { AppShell } from '../AppShell';
import { MAPS_DIR, appPath } from '../lib';

type AppMandir = {
  slug: string;
  name: Bilingual;
  deity: Bilingual;
  templeType: string;
  locationArea: string;
  isFeatured: boolean;
  darshanTimingSummary: Bilingual;
  aartiTiming?: Bilingual;
  entryFee?: Bilingual;
  address?: Bilingual;
  geo?: { lat: number; lng: number };
  thumb: string | null;
};

// Bundled into this lazy screen's chunk (not fetched), so once the chunk is cached the
// whole guide works with no signal — which is exactly when a pilgrim needs it.
const MANDIRS = appMandirs as AppMandir[];

const pick = (b: Bilingual | undefined, hi: boolean) => (b ? (hi ? b.hi || b.en : b.en || b.hi) : '') ?? '';

export function AppMandirs() {
  const { locale } = useI18n();
  const hi = locale === 'hi';
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const openSlug = params.get('m');
  const open = openSlug ? MANDIRS.find((m) => m.slug === openSlug) ?? null : null;

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MANDIRS;
    return MANDIRS.filter((m) =>
      [m.name.hi, m.name.en, m.deity?.hi, m.deity?.en, m.locationArea].some((s) => s?.toLowerCase().includes(q)),
    );
  }, [query]);

  // Close the sheet with the phone's back button: opening pushes ?m=, back pops it.
  const openMandir = (slug: string) => setParams({ m: slug });
  const close = () => setParams({}, { replace: false });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && window.history.back();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <AppShell tab="mandirs/" title={hi ? 'मंदिर गाइड' : 'Temple guide'}>
      <h1 className="font-serif text-2xl font-bold text-maroon">{hi ? 'उज्जैन मंदिर गाइड' : 'Ujjain temple guide'}</h1>
      <p className="mt-1 text-sm text-ink-soft">
        {hi ? `${MANDIRS.length} मंदिर — एक बार खोलने के बाद बिना इंटरनेट भी चलता है।` : `${MANDIRS.length} temples — works without internet once opened.`}
      </p>

      <Link
        to={appPath(locale, '84-mahadev/')}
        className="mt-4 flex items-center gap-3 rounded-xl border border-saffron/50 bg-saffron-50 p-3 hover:border-saffron"
      >
        <ListChecks className="h-6 w-6 shrink-0 text-saffron-600" aria-hidden />
        <span className="min-w-0">
          <span className="block font-semibold text-maroon">{hi ? '84 महादेव यात्रा चेकलिस्ट' : '84 Mahadev yatra checklist'}</span>
          <span className="block text-xs text-ink-soft">{hi ? 'हर दर्शन पर निशान लगाएँ' : 'Tick off each darshan'}</span>
        </span>
      </Link>

      <label className="relative mt-4 block">
        <span className="sr-only">{hi ? 'मंदिर खोजें' : 'Search temples'}</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value.slice(0, 60))}
          placeholder={hi ? 'नाम, देवता या क्षेत्र से खोजें' : 'Search by name, deity or area'}
          className="w-full rounded-xl border border-cream-dark bg-white py-3 pl-9 pr-3 text-sm focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon"
        />
      </label>

      <ul className="mt-4 space-y-2">
        {list.map((m) => (
          <li key={m.slug}>
            <button
              type="button"
              onClick={() => openMandir(m.slug)}
              className="flex w-full items-center gap-3 rounded-xl border border-gold/40 bg-white p-2.5 text-left hover:border-saffron"
            >
              {m.thumb ? (
                <img src={m.thumb} alt="" loading="lazy" width={64} height={48}
                  className="h-12 w-16 shrink-0 rounded-md bg-cream-dark object-cover"
                  onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }} />
              ) : (
                <span className="h-12 w-16 shrink-0 rounded-md bg-cream-dark" aria-hidden />
              )}
              <span className="min-w-0">
                <span className="block truncate font-semibold text-maroon">{pick(m.name, hi)}</span>
                <span className="block truncate text-xs text-ink-soft">{pick(m.darshanTimingSummary, hi)}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      {list.length === 0 && (
        <p className="mt-4 rounded-xl bg-white p-4 text-sm text-ink-soft">{hi ? 'कोई मंदिर नहीं मिला।' : 'No temple matches.'}</p>
      )}

      {open && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40" onClick={close} role="presentation">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="mandir-sheet-title"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-cream p-5 shadow-2xl"
            style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 id="mandir-sheet-title" className="font-serif text-2xl font-bold leading-tight text-maroon">{pick(open.name, hi)}</h2>
                <p className="mt-1 text-sm text-ink-soft">{pick(open.deity, hi)}</p>
              </div>
              <button type="button" onClick={close} aria-label={hi ? 'बंद करें' : 'Close'}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-maroon">
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-saffron-600" aria-hidden />
                <div>
                  <dt className="font-semibold text-ink">{hi ? 'दर्शन समय' : 'Darshan timings'}</dt>
                  <dd className="text-ink-soft">{pick(open.darshanTimingSummary, hi)}</dd>
                  {open.aartiTiming && <dd className="mt-0.5 text-ink-soft">{pick(open.aartiTiming, hi)}</dd>}
                </div>
              </div>
              {open.entryFee && (
                <div className="flex gap-3">
                  <IndianRupee className="mt-0.5 h-4 w-4 shrink-0 text-saffron-600" aria-hidden />
                  <div>
                    <dt className="font-semibold text-ink">{hi ? 'प्रवेश' : 'Entry'}</dt>
                    <dd className="text-ink-soft">{pick(open.entryFee, hi)}</dd>
                  </div>
                </div>
              )}
              {open.address && (
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-saffron-600" aria-hidden />
                  <div>
                    <dt className="font-semibold text-ink">{hi ? 'पता' : 'Address'}</dt>
                    <dd className="text-ink-soft">{pick(open.address, hi)}</dd>
                  </div>
                </div>
              )}
            </dl>

            <p className="mt-4 rounded-lg bg-white p-3 text-xs text-ink-mute">
              {hi
                ? 'समय लगभग है और पर्व-त्योहार पर बदल सकता है। पक्की जानकारी के लिए मंदिर की आधिकारिक वेबसाइट या प्रबंधन से पुष्टि करें।'
                : 'Timings are approximate and change on festival days. Confirm with the temple’s official website or management.'}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {open.geo && (
                <a href={MAPS_DIR(open.geo.lat, open.geo.lng)} target="_blank" rel="noopener noreferrer"
                  className="btn-call justify-center text-sm">
                  <Navigation className="h-4 w-4" aria-hidden /> {hi ? 'रास्ता देखें' : 'Directions'}
                </a>
              )}
              <a href={`${hi ? '/hi' : ''}/mandirs/${open.slug}/`}
                className="btn-secondary justify-center text-sm">
                <ExternalLink className="h-4 w-4" aria-hidden /> {hi ? 'पूरी जानकारी' : 'Full details'}
              </a>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
