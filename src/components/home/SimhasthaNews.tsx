import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useI18n } from '../../i18n';

/**
 * Latest Simhastha 2028 news on the homepage, as a slider.
 *
 * The news section is PHP-SSR off a MySQL table while this page is static SSG, so
 * the headlines cannot be baked in at build time without going stale the moment the
 * next article publishes. The split is deliberate:
 *
 *   - the heading and the link into /hi/simhastha-2028-news/ are rendered by SSG,
 *     so they are in the HTML a crawler sees and the section is never orphaned;
 *   - the slides are filled in on the client from the section's own RSS feed,
 *     same-origin, so they are always current and cost the build nothing.
 *
 * The track is a scroll-snap strip rather than a transform carousel: it stays
 * swipeable on touch, keyboard-scrollable, and degrades to a plain scroller if the
 * script never runs. Auto-advance respects prefers-reduced-motion — Aman's own Mac
 * has it on, and an animation-driven ticker simply freezes there.
 *
 * Hindi only: the section has no English tree yet, and a heading that leads
 * nowhere is worse than no heading.
 */

type NewsItem = { title: string; link: string; date: string; summary: string };

const FEED = '/hi/simhastha-2028-news/feed.xml';
const SECTION = '/hi/simhastha-2028-news/';
const AUTO_MS = 6000;

export function SimhasthaNews() {
  const { locale } = useI18n();
  const [items, setItems] = useState<NewsItem[]>([]);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const paused = useRef(false);

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
          .slice(0, 9)
          .map((it) => {
            const raw = it.querySelector('pubDate')?.textContent ?? '';
            const d = raw ? new Date(raw) : null;
            return {
              title: it.querySelector('title')?.textContent?.trim() ?? '',
              link: it.querySelector('link')?.textContent?.trim() ?? '',
              summary: (it.querySelector('description')?.textContent ?? '').trim(),
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

  /**
   * Slide by one visible page.
   *
   * The end position is set unconditionally; the animation is only an enhancement.
   * That ordering is deliberate — it is the difference between "the arrow always
   * works" and "the arrow works where frames happen to be rendered".
   *
   * 🪤 Three separate things bite here:
   *   - Tailwind's `scroll-smooth` (CSS `scroll-behavior: smooth`) on a snapping
   *     strip pins it to its snap point and scrollTo() moves NOTHING. That class is
   *     off the track for exactly this reason.
   *   - The snap type must be `proximity`, not `mandatory`: mandatory re-snaps on
   *     every scroll write, dragging an in-flight animation back to the first card.
   *     Proximity still snaps a touch swipe, which is the part worth keeping.
   *   - `behavior: 'smooth'` is frame-driven, so it does nothing in a background tab
   *     or for a reduced-motion user (Aman's Mac). Hence the settle below rather
   *     than trusting the animation to land, and hence syncing the arrow states from
   *     here instead of waiting for a scroll event that may never arrive.
   */
  const nudge = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;

    const max = el.scrollWidth - el.clientWidth;
    if (max <= 0) return;
    const step = el.clientWidth * 0.9;
    // Wrap at both ends rather than greying an arrow out. A disabled button
    // swallows the click, so an arrow whose state lags the scroll by one tick is
    // an arrow that silently does nothing — worse than one that always moves.
    let to = el.scrollLeft + dir * step;
    if (dir === 1 && el.scrollLeft >= max - 8) to = 0;
    else if (dir === -1 && el.scrollLeft <= 8) to = max;
    to = Math.max(0, Math.min(max, to));

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      el.scrollLeft = to;
      return;
    }

    el.scrollTo({ left: to, behavior: 'smooth' });
    // Settle past the animation: a no-op when it landed, a correction when it never ran.
    window.setTimeout(() => {
      if (Math.abs(el.scrollLeft - to) > 2) el.scrollLeft = to;
    }, 420);
  };

  useEffect(() => {
    if (items.length < 2) return;
    const id = window.setInterval(() => {
      if (!paused.current) nudge(1);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [items.length]);

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

          <div className="flex items-center gap-2">
            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => nudge(-1)}
                  aria-label="पिछला समाचार"
                  className="grid h-10 w-10 place-items-center rounded-full border border-maroon/30 text-maroon transition-colors hover:border-maroon hover:bg-maroon hover:text-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => nudge(1)}
                  aria-label="अगला समाचार"
                  className="grid h-10 w-10 place-items-center rounded-full border border-maroon/30 text-maroon transition-colors hover:border-maroon hover:bg-maroon hover:text-white"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
            <a
              href={SECTION}
              className="inline-flex items-center gap-2 rounded-md border border-maroon/30 px-5 py-3 text-sm font-semibold text-maroon transition-colors hover:border-maroon hover:bg-maroon hover:text-white"
            >
              सभी समाचार
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        {items.length > 0 && (
          <div
            ref={trackRef}
            onMouseEnter={() => { paused.current = true; }}
            onMouseLeave={() => { paused.current = false; }}
            onFocusCapture={() => { paused.current = true; }}
            onBlurCapture={() => { paused.current = false; }}
            className="mt-8 flex snap-x snap-proximity gap-5 overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {items.map((n) => (
              <a
                key={n.link}
                href={n.link}
                className="group flex w-[85%] shrink-0 snap-start flex-col rounded-xl border border-gold/30 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-saffron/60 hover:shadow-md sm:w-[46%] lg:w-[31.5%]"
              >
                {n.date && (
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-saffron-700">
                    {n.date}
                  </span>
                )}
                <h3 className="mt-2 font-sanskrit text-lg font-bold leading-snug text-maroon">
                  {n.title}
                </h3>
                {n.summary && (
                  <p className="mt-2 line-clamp-3 flex-1 text-[13px] leading-relaxed text-ink-soft">
                    {n.summary}
                  </p>
                )}
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
