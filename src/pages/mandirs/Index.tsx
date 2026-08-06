import { Sparkles, ArrowUpRight } from 'lucide-react';
import { Layout } from '../../components/global/Layout';
import { SEOHead } from '../../components/global/SEOHead';
import { LeadForm } from '../../components/global/LeadForm';
import { MandirCard } from '../../components/mandir/MandirCard';
import { MandirRow } from '../../components/mandir/MandirRow';
import { Breadcrumb } from '../../components/global/Breadcrumb';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n';
import { mandirs } from '../../data/mandirs';
import { breadcrumbSchema, itemListSchema } from '../../lib/schemas';
import { SITE } from '../../lib/site';

// ── Category grouping ───────────────────────────────────────────────────────
// 183 temples is too long to scan as one flat grid, and a flat grid gives Google
// no crawlable structure. Grouping by deity yields keyword-bearing H2s
// ("Shiva Temples in Ujjain", "Shakti Peeth & Devi Temples in Ujjain") that match
// how people actually search, plus jump-links for humans.
const CATEGORY_ORDER = [
  'Jyotirlinga',
  'Corridor / Heritage Walk',
  'Shiva',
  'Shakti',
  'Bhairav',
  'Ganesh',
  'Krishna',
  'Ram',
  'Navagraha',
  'Jain',
  'Historical',
  'Multi-deity',
] as const;

const CATEGORY_LABEL: Record<string, { en: string; hi: string }> = {
  'Jyotirlinga': { en: 'Jyotirlinga Temple in Ujjain', hi: 'उज्जैन का ज्योतिर्लिंग मंदिर' },
  'Corridor / Heritage Walk': { en: 'Heritage Corridor', hi: 'हेरिटेज कॉरिडोर' },
  'Shiva': { en: 'Shiva Temples in Ujjain', hi: 'उज्जैन के शिव मंदिर' },
  'Shakti': { en: 'Shakti Peeth & Devi Temples in Ujjain', hi: 'उज्जैन के शक्तिपीठ व देवी मंदिर' },
  'Bhairav': { en: 'Bhairav Temples in Ujjain', hi: 'उज्जैन के भैरव मंदिर' },
  'Ganesh': { en: 'Ganesh Temples in Ujjain', hi: 'उज्जैन के गणेश मंदिर' },
  'Krishna': { en: 'Krishna Temples in Ujjain', hi: 'उज्जैन के कृष्ण मंदिर' },
  'Ram': { en: 'Ram & Hanuman Temples in Ujjain', hi: 'उज्जैन के राम व हनुमान मंदिर' },
  'Navagraha': { en: 'Navagraha & Planetary Temples in Ujjain', hi: 'उज्जैन के नवग्रह मंदिर' },
  'Jain': { en: 'Jain Temples in Ujjain', hi: 'उज्जैन के जैन मंदिर' },
  'Historical': { en: 'Historical Temples in Ujjain', hi: 'उज्जैन के ऐतिहासिक मंदिर' },
  'Multi-deity': { en: 'Multi-deity Temples in Ujjain', hi: 'उज्जैन के बहु-देव मंदिर' },
};

// 'Shakti Peeth' is a one-off legacy value — fold it into 'Shakti'.
const normaliseType = (t: string | undefined) => (t === 'Shakti Peeth' ? 'Shakti' : t ?? 'Historical');

const CARDS_PER_CATEGORY = 3;

const slugifyCategory = (c: string) => c.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function MandirIndex() {
  const { locale } = useI18n();
  const prefix = locale === 'en' ? '' : '/hi';

  // MandirCard eager-loads its image when index < 3. That index must be page-global,
  // not per-category — otherwise every category eager-loads its first 3 and we ship
  // ~30 eager images, wrecking LCP. Precompute a running index across all groups.
  let running = 0;
  const grouped = CATEGORY_ORDER
    .map((cat) => ({ cat, items: mandirs.filter((m) => normaliseType(m.templeType) === cat) }))
    .filter((g) => g.items.length > 0)
    .map((g) => ({ ...g, items: g.items.map((m) => ({ mandir: m, globalIndex: running++ })) }));

  const title = locale === 'hi'
    ? `उज्जैन के मंदिर — ${mandirs.length} प्रसिद्ध मंदिरों की सूची, दर्शन समय व इतिहास`
    : `Temples in Ujjain — List of ${mandirs.length} Famous Ujjain Temples, Timings & History`;
  const description = locale === 'hi'
    ? `उज्जैन के ${mandirs.length} मंदिरों की पूरी सूची — महाकालेश्वर ज्योतिर्लिंग, महाकाल लोक, काल भैरव, मंगलनाथ, चिंतामण गणेश, हरसिद्धि शक्तिपीठ, गोपाल मंदिर, चित्रगुप्त मंदिर व अन्य। शिव, शक्ति, गणेश, नवग्रह व जैन मंदिर श्रेणीवार। सत्यापित दर्शन समय, इतिहास, फ़ोटो व मार्गदर्शन।`
    : `Complete list of ${mandirs.length} temples in Ujjain — Mahakaleshwar Jyotirlinga, Mahakal Lok, Kal Bhairav, Mangalnath, Chintaman Ganesh, Harsiddhi Shakti Peeth, Gopal Mandir, Chitragupta Mandir and more. Shiva, Shakti, Ganesh, Navagraha and Jain temples grouped by deity, with verified darshan timings, history, photos and directions.`;

  return (
    <>
      <SEOHead
        title={title}
        description={description}
        path="/mandirs/"
        locale={locale}
        schemas={[
          breadcrumbSchema({ items: [
            { name: locale === 'hi' ? 'होम' : 'Home', url: SITE.url },
            { name: locale === 'hi' ? 'मन्दिर' : 'Temples', url: `${SITE.url}/mandirs/` },
          ]}),
          // Descriptions trimmed — the full intro for 183 entries added ~90 KB of
          // JSON-LD to the page for no extra rich-result benefit.
          itemListSchema(mandirs.map((m) => ({
            name: m.name[locale],
            url: `${SITE.url}${prefix}/mandirs/${m.slug}/`,
            description: m.shortIntro[locale].slice(0, 110),
            image: m.photos[0] ? `${SITE.url}${m.photos[0]}` : undefined,
          }))),
        ]}
      />
      <Layout>
        <Breadcrumb items={[{ label: locale === 'hi' ? 'दर्शन सूची' : 'Darshan List' }]} />

        {/* HERO — rich maroon gradient */}
        <section className="relative overflow-hidden bg-gradient-to-b from-maroon-900 via-maroon-800 to-maroon-700 py-14 sm:py-20">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/4 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
            <div className="absolute right-1/4 bottom-0 h-64 w-64 translate-x-1/2 rounded-full bg-saffron/10 blur-3xl" />
          </div>
          <div className="container-page relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
                <Sparkles className="h-3.5 w-3.5" /> {locale === 'hi' ? '॥ उज्जैन दर्शन सूची ॥' : '✦ Ujjain Darshan List ✦'}
              </p>
              <h1 className={`mt-4 font-bold text-cream leading-tight ${locale === 'hi' ? 'font-sanskrit text-4xl sm:text-5xl md:text-6xl' : 'font-serif text-4xl sm:text-5xl md:text-6xl'}`}>
                {locale === 'hi' ? 'उज्जैन के मंदिर' : 'Temples in Ujjain'}
              </h1>
              <p className="mt-5 text-base leading-relaxed text-cream/80 sm:text-lg">
                {locale === 'hi'
                  ? `महाकालेश्वर ज्योतिर्लिंग से मंगलनाथ तक — उज्जैन के ${mandirs.length} मंदिरों की सूची, देवता के अनुसार श्रेणीबद्ध। दर्शन समय · इतिहास · फ़ोटो · मार्गदर्शन।`
                  : `From the Mahakaleshwar Jyotirlinga to Mangalnath — a list of ${mandirs.length} temples in Ujjain, grouped by deity. Darshan timings · history · photos · directions.`}
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs text-gold/80">
                <span>{locale === 'hi' ? 'स्थानीय स्रोतों से सत्यापित' : 'Verified from local sources'}</span>
                <span>·</span>
                <span>{mandirs.length} {locale === 'hi' ? 'प्रमुख दर्शनीय मंदिर' : 'major darshan temples'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 84 MAHADEV cross-link banner */}
        <section className="border-b border-cream-dark/60 bg-cream-dark/30">
          <div className="container-page py-4">
            <Link
              to={`${prefix}/84-mahadev-ujjain/`}
              className="group flex flex-col items-start justify-between gap-2 rounded-xl border border-gold/30 bg-white px-5 py-4 shadow-sm transition-all hover:border-saffron/50 hover:shadow-md sm:flex-row sm:items-center"
            >
              <span className="flex items-center gap-2 text-sm text-ink-soft">
                <Sparkles className="h-4 w-4 text-saffron-700" />
                {locale === 'hi'
                  ? 'उज्जैन के 84 महादेव (चौरासी महादेव) की पूरी सूची भी देखें'
                  : 'Also see the complete list of the 84 Mahadev (Chaurasi Mahadev) of Ujjain'}
              </span>
              <span className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-maroon group-hover:text-saffron-700">
                {locale === 'hi' ? '84 महादेव देखें' : 'View 84 Mahadev'}
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </section>

        {/* INTRO — topical context for the "temples in Ujjain" query */}
        <section className="container-page pt-10 sm:pt-14">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm leading-relaxed text-ink-soft sm:text-base">
              {locale === 'hi'
                ? `उज्जैन को मंदिरों का नगर कहा जाता है। शिप्रा के तट पर बसे इस प्राचीन शहर में महाकालेश्वर ज्योतिर्लिंग के अलावा सैकड़ों छोटे-बड़े मंदिर हैं — शिव, शक्ति, गणेश, भैरव, कृष्ण, नवग्रह और जैन। नीचे उज्जैन के ${mandirs.length} मंदिरों की सूची देवता के अनुसार श्रेणीबद्ध है, ताकि आप अपनी यात्रा उसी क्रम में बना सकें।`
                : `Ujjain is known as a city of temples. Beyond the Mahakaleshwar Jyotirlinga, this ancient city on the banks of the Shipra holds hundreds of shrines — Shiva, Shakti, Ganesh, Bhairav, Krishna, Navagraha and Jain. Below, ${mandirs.length} temples in Ujjain are grouped by deity so you can plan a darshan route in the same order.`}
            </p>

            {/* Jump links — crawlable internal anchors + human navigation */}
            <nav aria-label={locale === 'hi' ? 'श्रेणी' : 'Categories'} className="mt-5 flex flex-wrap gap-2">
              {grouped.map(({ cat, items }) => (
                <a
                  key={cat}
                  href={`#${slugifyCategory(cat)}`}
                  className="rounded-full border border-gold/40 bg-cream-dark/40 px-3 py-1.5 text-xs font-semibold text-maroon transition-colors hover:border-saffron hover:bg-saffron/10"
                >
                  {CATEGORY_LABEL[cat][locale]} ({items.length})
                </a>
              ))}
            </nav>
          </div>
        </section>

        {/* GRID — grouped by deity */}
        <section className="container-page py-10 sm:py-14">
          {grouped.map(({ cat, items }) => (
            <div key={cat} className="mb-12 scroll-mt-24 last:mb-0" id={slugifyCategory(cat)}>
              <h2 className={`mb-5 border-b border-gold/30 pb-2 font-bold text-maroon ${locale === 'hi' ? 'font-sanskrit text-2xl sm:text-3xl' : 'font-serif text-2xl sm:text-3xl'}`}>
                {CATEGORY_LABEL[cat][locale]}
                <span className="ml-2 align-middle text-sm font-normal text-ink-soft">({items.length})</span>
              </h2>
              {/* First 3 of each category as photo cards; the long tail as compact rows.
                  Every temple stays a crawlable link either way — see MandirRow. */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.slice(0, CARDS_PER_CATEGORY).map(({ mandir: m, globalIndex }) => (
                  <MandirCard key={m.slug} mandir={m} featured={m.isFeatured} index={globalIndex} />
                ))}
              </div>
              {items.length > CARDS_PER_CATEGORY && (
                <div className="mt-5 overflow-hidden rounded-lg border border-cream-dark bg-white sm:columns-2 lg:columns-3">
                  {items.slice(CARDS_PER_CATEGORY).map(({ mandir: m }) => (
                    <MandirRow key={m.slug} mandir={m} />
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Editor's note — institutional human voice */}
          <aside className="mt-12 rounded-xl border-l-4 border-gold bg-cream-dark/40 p-5 sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-saffron-700">
              {locale === 'hi' ? 'सम्पादक की टिप्पणी' : "Editor’s Note"}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft sm:text-base">
              {locale === 'hi'
                ? 'यहाँ सूचीबद्ध प्रत्येक मन्दिर का दर्शन समय एवं संपर्क जानकारी मन्दिर ट्रस्ट से सीधे अथवा अधिकृत स्रोतों से सत्यापित। यदि कोई जानकारी पुरानी प्रतीत हो — कृपया व्हाट्सऐप पर सूचित करें: '
                : 'Each temple’s darshan timing and contact info has been verified directly with the temple trust or via authoritative sources. If any information appears outdated, please flag it on WhatsApp: '}
              <a href={SITE.whatsapp} className="font-bold text-maroon hover:underline" target="_blank" rel="noopener noreferrer">
                {SITE.phone}
              </a>
            </p>
          </aside>

          <div className="mt-12 mx-auto max-w-2xl">
            <LeadForm sourcePage="mandirs-index" defaultService="darshanPlan" />
          </div>
        </section>
      </Layout>
    </>
  );
}
