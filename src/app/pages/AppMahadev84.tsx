import { useEffect, useMemo, useState } from 'react';
import { Check, MapPin, RotateCcw, Search } from 'lucide-react';
import { useI18n } from '../../i18n';
import { mahadev84 } from '../../data/mahadev84';
import { AppShell } from '../AppShell';
import { MAPS_SEARCH, readStore, writeStore } from '../lib';

const STORE_KEY = 'ujt-app-84-mahadev-v1';

export function AppMahadev84() {
  const { locale } = useI18n();
  const hi = locale === 'hi';
  const [done, setDone] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    const saved = readStore<unknown>(STORE_KEY, []);
    setDone(Array.isArray(saved) ? saved.filter((n): n is number => Number.isInteger(n) && n >= 1 && n <= 84) : []);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) writeStore(STORE_KEY, done);
  }, [done, loaded]);

  // The reset confirmation expires, so a stray second tap minutes later can't wipe the list.
  useEffect(() => {
    if (!confirmReset) return;
    const id = window.setTimeout(() => setConfirmReset(false), 4000);
    return () => window.clearTimeout(id);
  }, [confirmReset]);

  const toggle = (n: number) => setDone((d) => (d.includes(n) ? d.filter((x) => x !== n) : [...d, n]));

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mahadev84;
    return mahadev84.filter((m) =>
      [m.hi, m.en, m.areaHi, m.areaEn].some((s) => s.toLowerCase().includes(q)) || String(m.n) === q,
    );
  }, [query]);

  const count = done.length;
  const pct = Math.round((count / 84) * 100);

  return (
    <AppShell tab="84-mahadev/" title={hi ? '84 महादेव' : '84 Mahadev'}>
      <h1 className="font-serif text-2xl font-bold text-maroon">{hi ? '84 महादेव यात्रा' : '84 Mahadev yatra'}</h1>
      <p className="mt-1 text-sm text-ink-soft">
        {hi ? 'जिस महादेव के दर्शन हो गए, उस पर निशान लगाएँ।' : 'Tick each Mahadev once you have had darshan.'}
      </p>

      <section className="mt-4 rounded-2xl border border-gold/40 bg-white p-4">
        <div className="flex items-baseline justify-between">
          <p className="font-serif text-3xl font-bold text-maroon" aria-live="polite">
            {count}<span className="text-lg text-ink-mute"> / 84</span>
          </p>
          <p className="text-sm font-semibold text-saffron-700">{pct}%</p>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-cream-dark" role="progressbar" aria-valuemin={0} aria-valuemax={84} aria-valuenow={count}>
          <div className="h-full rounded-full bg-gradient-to-r from-saffron to-maroon transition-all" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs text-ink-mute">{hi ? 'यह सूची सिर्फ़ इसी फ़ोन में सहेजी जाती है।' : 'Saved on this phone only.'}</p>
          {count > 0 && (
            <button
              type="button"
              onClick={() => (confirmReset ? (setDone([]), setConfirmReset(false)) : setConfirmReset(true))}
              className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${
                confirmReset ? 'bg-maroon text-white' : 'border border-maroon/30 text-maroon'
              }`}
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden />
              {confirmReset ? (hi ? 'पक्का? फिर दबाएँ' : 'Sure? Tap again') : hi ? 'फिर से शुरू' : 'Start over'}
            </button>
          )}
        </div>
      </section>

      <label className="relative mt-4 block">
        <span className="sr-only">{hi ? 'खोजें' : 'Search'}</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value.slice(0, 60))}
          placeholder={hi ? 'नाम, क्रमांक या स्थान' : 'Name, number or area'}
          className="w-full rounded-xl border border-cream-dark bg-white py-3 pl-9 pr-3 text-sm focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon"
        />
      </label>

      <ul className="mt-4 space-y-2">
        {list.map((m) => {
          const checked = done.includes(m.n);
          return (
            <li key={m.n} className={`flex items-center gap-2 rounded-xl border bg-white p-2 ${checked ? 'border-saffron/60' : 'border-gold/40'}`}>
              <button
                type="button"
                role="checkbox"
                aria-checked={checked}
                onClick={() => toggle(m.n)}
                className="flex min-w-0 flex-1 items-center gap-3 rounded-lg p-1 text-left"
              >
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 text-sm font-bold ${
                  checked ? 'border-maroon bg-maroon text-white' : 'border-maroon/30 text-maroon'
                }`}>
                  {checked ? <Check className="h-4 w-4" aria-hidden /> : m.n}
                </span>
                <span className="min-w-0">
                  <span className={`block font-semibold leading-snug ${checked ? 'text-ink-mute line-through decoration-maroon/40' : 'text-maroon'}`}>
                    {hi ? m.hi : m.en}
                  </span>
                  <span className="block truncate text-xs text-ink-soft">{hi ? m.areaHi : m.areaEn}</span>
                </span>
              </button>
              <a
                href={MAPS_SEARCH(`${m.en}, Ujjain`)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={hi ? `${m.hi} — नक्शे में खोजें` : `${m.en} — find on map`}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-maroon hover:bg-maroon-50"
              >
                <MapPin className="h-5 w-5" aria-hidden />
              </a>
            </li>
          );
        })}
      </ul>

      <p className="mt-6 text-xs leading-relaxed text-ink-mute">
        {hi
          ? 'स्थान सांकेतिक हैं; नक्शे का परिणाम स्थानीय लोगों से पुष्टि कर लें।'
          : 'Locations are indicative; confirm the map result locally.'}
      </p>
    </AppShell>
  );
}
