import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useI18n } from '../../i18n';
import { AppShell } from '../AppShell';
import { NotifyToggle } from '../NotifyToggle';
import { NEWS_SECTION, fetchNews, formatDate, type NewsItem } from '../lib';

export function AppNews() {
  const { locale } = useI18n();
  const hi = locale === 'hi';
  const [items, setItems] = useState<NewsItem[] | null>(null);
  const [failed, setFailed] = useState(false);

  const load = () => {
    setFailed(false);
    setItems(null);
    fetchNews(40)
      .then(setItems)
      .catch(() => {
        setItems([]);
        setFailed(true);
      });
  };

  useEffect(load, []);

  return (
    <AppShell tab="news/" title={hi ? 'समाचार' : 'News'}>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-maroon">{hi ? 'सिंहस्थ 2028 समाचार' : 'Simhastha 2028 news'}</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {hi ? 'तैयारी, स्नान, यात्रा — श्रद्धालु के नज़रिए से।' : 'Preparations, snan and travel — articles in Hindi.'}
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          aria-label={hi ? 'फिर से लोड करें' : 'Reload'}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-maroon/30 text-maroon hover:bg-maroon-50"
        >
          <RefreshCw className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <div className="mt-4">
        <NotifyToggle />
      </div>

      <div className="mt-4">
        {items === null ? (
          <p className="text-sm text-ink-mute">{hi ? 'लोड हो रहा है…' : 'Loading…'}</p>
        ) : failed ? (
          <p className="rounded-xl bg-white p-4 text-sm text-ink-soft">
            {hi ? 'समाचार अभी नहीं खुल पाए। इंटरनेट जाँचें और ऊपर का बटन दबाएँ।' : 'News could not load. Check your connection and tap reload.'}
          </p>
        ) : items.length === 0 ? (
          <p className="rounded-xl bg-white p-4 text-sm text-ink-soft">{hi ? 'अभी कोई लेख नहीं है।' : 'No articles yet.'}</p>
        ) : (
          <ul className="space-y-3">
            {items.map((n) => (
              <li key={n.link}>
                <a href={n.link} className="block rounded-xl border border-gold/40 bg-white p-4 transition-colors hover:border-saffron">
                  {n.iso && (
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-saffron-700">{formatDate(n.iso, locale)}</span>
                  )}
                  <span className="mt-1 block font-hindi text-lg font-bold leading-snug text-maroon">{n.title}</span>
                  {n.summary && <span className="mt-1.5 line-clamp-3 block text-sm leading-relaxed text-ink-soft">{n.summary}</span>}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-6 text-center">
        <a href={NEWS_SECTION} className="text-sm font-semibold text-maroon underline">
          {hi ? 'पूरा समाचार अनुभाग खोलें' : 'Open the full news section'}
        </a>
      </p>
    </AppShell>
  );
}
