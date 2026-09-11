import { MapPin, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/global/Layout';
import { SEOHead } from '../components/global/SEOHead';
import { LeadForm } from '../components/global/LeadForm';
import { Breadcrumb } from '../components/global/Breadcrumb';
import { useI18n } from '../i18n';
import { mandirList } from '../data/mandirs-index';
import { getDeityList } from '../data/deity-lists';
import { breadcrumbSchema, faqSchema, itemListSchema } from '../lib/schemas';
import { SITE } from '../lib/site';

/**
 * Deity-group list page — /navgrah-mandir-ujjain/, /bhairav-mandir-ujjain/,
 * /ganesh-mandir-ujjain/.
 *
 * Built because the one page on this site with a healthy click-through rate at
 * volume is /84-mahadev-ujjain/ (2.70% on 3,228 impressions, against a site-wide
 * 0.7%), and every high-CTR query in GSC has the same shape: a LIST the searcher
 * wants, not a fact Google can answer in the SERP itself. Distance and timing
 * queries on this site convert at ~0.1% precisely because Google answers them
 * inline; "which temples are there" needs the page.
 *
 * 🪤 Reads `mandirList` (the slim generated index), never `data/mandirs` — the
 * full records are 1.4 MB and importing them from a non-lazy route drags the lot
 * into a chunk preloaded on every page. Everything rendered here (name, area,
 * timing, intro, photo) is already in LIST_FIELDS; if something new is needed,
 * add it there and remember it costs bytes site-wide.
 *
 * 🔴 A temple slug in deity-lists.ts that no longer exists is skipped silently
 * rather than crashing the build — but the page then quietly gets shorter, so the
 * count is rendered from what actually resolved, never from the configured length.
 */
export function DeityListPage({ slug }: { slug: string }) {
  const { locale } = useI18n();
  const group = getDeityList(slug);
  if (!group) return null;

  const prefix = locale === 'en' ? '' : '/hi';
  const path = `/${group.slug}/`;
  const canonical = `${SITE.url}${prefix}${path}`;

  const temples = group.temples
    .map((s) => mandirList.find((m) => m.slug === s))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  const faqs = group.faqs.map((f) => ({ q: f.q[locale], a: f.a[locale] }));

  const schemas = [
    breadcrumbSchema({
      items: [
        { name: locale === 'hi' ? 'होम' : 'Home', url: `${SITE.url}${prefix}/` },
        { name: locale === 'hi' ? 'उज्जैन के मंदिर' : 'Temples in Ujjain', url: `${SITE.url}${prefix}/mandirs/` },
        { name: group.h1[locale], url: canonical },
      ],
    }),
    itemListSchema(
      temples.map((m) => ({
        name: m.name[locale],
        url: `${SITE.url}${prefix}/mandirs/${m.slug}/`,
        description: m.shortIntro[locale].slice(0, 180),
      })),
    ),
    faqSchema(faqs),
  ];

  return (
    <>
      <SEOHead
        title={group.title[locale]}
        description={group.description[locale]}
        path={path}
        locale={locale}
        schemas={schemas}
      />
      <Layout>
        <Breadcrumb
          items={[
            { label: locale === 'hi' ? 'उज्जैन के मंदिर' : 'Temples in Ujjain', href: `${prefix}/mandirs/` },
            { label: group.h1[locale] },
          ]}
        />

        <section className="container-page pb-4 pt-2">
          <h1 className="font-sanskrit text-3xl font-bold leading-tight text-maroon sm:text-4xl">
            {group.h1[locale]}
          </h1>

          {/* Answer-first block. Kept directly under the H1 and self-contained so an
              answer engine can lift it whole — same pattern as the Simhastha landing. */}
          <p className="mt-4 max-w-3xl rounded-xl border-l-4 border-saffron bg-white p-4 text-[15px] leading-relaxed text-ink sm:text-base">
            {group.lede[locale]}
          </p>

          <p className="mt-3 text-sm text-ink-soft">
            {locale === 'hi'
              ? `इस सूची में ${temples.length} मंदिर हैं। दर्शन समय लगभग हैं — त्योहार और विशेष तिथियों पर बदल सकते हैं।`
              : `${temples.length} temples on this list. Timings are approximate and change on festival days.`}
          </p>
        </section>

        {/* ── The list ───────────────────────────────────────────────────────── */}
        <section className="container-page pb-8">
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {temples.map((m, i) => (
              <li key={m.slug} className="flex">
                <Link
                  to={`${prefix}/mandirs/${m.slug}/`}
                  className="group flex w-full flex-col rounded-xl border border-gold/30 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-saffron/60 hover:shadow-md"
                >
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-saffron-700">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 className="mt-1 font-sanskrit text-lg font-bold leading-snug text-maroon group-hover:text-saffron-700">
                    {m.name[locale]}
                  </h2>
                  <p className="mt-2 line-clamp-3 flex-1 text-[13px] leading-relaxed text-ink-soft">
                    {m.shortIntro[locale]}
                  </p>
                  <span className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-mute">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" aria-hidden />
                      {m.locationArea}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" aria-hidden />
                      {m.darshanTimingSummary[locale]}
                    </span>
                  </span>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-maroon group-hover:text-saffron-700">
                    {locale === 'hi' ? 'पूरी जानकारी' : 'Full details'}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        {/* ── The hand-written section that earns the click ───────────────────── */}
        <section className="container-page pb-8">
          <div className="max-w-3xl">
            <h2 className="font-sanskrit text-2xl font-bold text-maroon">{group.note.heading[locale]}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{group.note.body[locale]}</p>
          </div>
        </section>

        {/* ── FAQ (mirrored into FAQPage schema above) ────────────────────────── */}
        <section className="container-page pb-10">
          <div className="max-w-3xl">
            <h2 className="font-sanskrit text-2xl font-bold text-maroon">
              {locale === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Frequently Asked Questions'}
            </h2>
            <dl className="mt-4 space-y-4">
              {faqs.map((f) => (
                <div key={f.q} className="rounded-xl border border-cream-dark bg-white p-4">
                  <dt className="font-semibold text-maroon">{f.q}</dt>
                  <dd className="mt-2 text-[15px] leading-relaxed text-ink-soft">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── Internal links. A list page that links nowhere is a dead end, and the
               hub links back into these — see mandirs/Index.tsx. ──────────────── */}
        <section className="container-page pb-10">
          <div className="flex flex-wrap gap-3">
            <Link to={`${prefix}/mandirs/`} className="btn-secondary">
              {locale === 'hi' ? 'उज्जैन के सभी मंदिर' : 'All temples in Ujjain'}
            </Link>
            <Link to={`${prefix}/84-mahadev-ujjain/`} className="btn-secondary">
              {locale === 'hi' ? '84 महादेव सूची' : '84 Mahadev list'}
            </Link>
            {group.pujaSlug && (
              <Link to={`${prefix}/puja-in-ujjain/${group.pujaSlug}/`} className="btn-secondary">
                {locale === 'hi' ? 'नवग्रह शांति पूजा' : 'Navgrah Shanti Puja'}
              </Link>
            )}
            <Link to={`${prefix}/transport-in-ujjain/ujjain-local-sightseeing-cab/`} className="btn-secondary">
              {locale === 'hi' ? 'स्थानीय दर्शन कैब' : 'Local darshan cab'}
            </Link>
          </div>
        </section>

        <section className="container-page pb-14">
          <LeadForm sourcePage={group.slug} />
        </section>
      </Layout>
    </>
  );
}
