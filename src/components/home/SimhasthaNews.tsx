import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '../../i18n';

/**
 * Latest Simhastha 2028 news on the homepage.
 *
 * The news section is PHP-SSR off a MySQL table, while this page is static SSG —
 * so the headlines cannot be baked in at build time without going stale the moment
 * the next article publishes. The split is deliberate:
 *
 *   - the heading and the link into /hi/simhastha-2028-news/ are rendered by SSG,
 *     so they are in the HTML a crawler sees and the section is never orphaned
 *     (an unlinked cluster is inert — the 2026-07-06 lesson);
 *   - the three headlines are filled in on the client from the section's own RSS
 *     feed, same-origin, so they are always current and cost the build nothing.
 *
 * Hindi only: the section has no English tree yet, and a heading that leads
 * nowhere is worse than no heading.
 */

type NewsItem = { title: string; link: string; date: string };

const FEED = '/hi/simhastha-2028-news/feed.xml';
const SECTION = '/hi/simhastha-2028-news/';

export function SimhasthaNews() {
  const { locale } = useI18n();
  const [items, setItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    if (locale !== 'hi' || typeof window === 'undefined') return;
    let alive = true;

    (async () => {
      try {
        const res = await fetch(FEED, { headers: { Accept: 'application/rss+xml' } });
        if (!res.ok) return;
        const xml = new DOMParser().parseFromString(await res.text(), 'application/xml');
        // A parse failure yields a <parsererror> document rather than throwing.
        if (xml.querySelector('parsererror')) return;

        const parsed = Array.from(xml.querySelectorAll('item'))
          .slice(0, 3)
          .map((it) => {
            const raw = it.querySelector('pubDate')?.textContent ?? '';
            const d = raw ? new Date(raw) : null;
            return {
              title: it.querySelector('title')?.textContent?.trim() ?? '',
              link: it.querySelector('link')?.textContent?.trim() ?? '',
              date:
                d && !Number.isNaN(d.getTime())
                  ? d.toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                  : '',
            };
          })
          .filter((x) => x.title && x.link);

        if (alive) setItems(parsed);
      } catch {
        /* Feed unreachable — the heading and the section link still stand. */
      }
    })();

    return () => {
      alive = false;
    };
  }, [locale]);

  if (locale !== 'hi') return null;

  return (
    <section id="simhastha-news" className="bg-cream border-t border-cream-dark">
      <div className="container-page py-14 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-700">
              ताज़ा अपडेट
            </p>
            <h2 className="mt-2 font-sanskrit text-3xl font-bold leading-tight text-maroon sm:text-4xl">
              सिंहस्थ 2028 समाचार
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base">
              तैयारी, स्नान, यात्रा और दर्शन से जुड़ी ताज़ा जानकारी — श्रद्धालु के नज़रिए से।
            </p>
          </div>
          <a
            href={SECTION}
            className="inline-flex items-center gap-2 rounded-md border border-maroon/30 px-5 py-3 text-sm font-semibold text-maroon transition-colors hover:border-maroon hover:bg-maroon hover:text-white"
          >
            सभी समाचार
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {items.length > 0 && (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((n) => (
              <a
                key={n.link}
                href={n.link}
                className="group flex flex-col rounded-xl border border-gold/30 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-saffron/60 hover:shadow-md"
              >
                {n.date && (
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-saffron-700">
                    {n.date}
                  </span>
                )}
                <h3 className="mt-2 font-sanskrit text-lg font-bold leading-snug text-maroon">
                  {n.title}
                </h3>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-maroon group-hover:text-saffron-700">
                  पढ़ें
                  <ArrowRight className="h-4 w-4" />
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
