import { Sparkles, ArrowUpRight } from 'lucide-react';
import { Layout } from '../../components/global/Layout';
import { SEOHead } from '../../components/global/SEOHead';
import { LeadForm } from '../../components/global/LeadForm';
import { MandirCard } from '../../components/mandir/MandirCard';
import { MandirRow } from '../../components/mandir/MandirRow';
import { Breadcrumb } from '../../components/global/Breadcrumb';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n';
import { mandirList as mandirs } from '../../data/mandirs-index';
import { breadcrumbSchema, itemListSchema, faqSchema } from '../../lib/schemas';
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

  // GSC splits this page's queries cleanly in two. The head terms it was rebuilt for
  // ("temples in ujjain", "ujjain temples list") sit at pos 45–92 against travel
  // aggregators — not a copy problem. But the *count* cluster already ranks top-10
  // ("how many temples are there in ujjain" pos 6.0 and this page's only real click,
  // "total temples in ujjain" pos 6.2, "list of temples in ujjain" pos 8.0) while the
  // page never states the answer in one place. Same gap the Simhastha date block
  // closed: rank without an answer earns impressions, not clicks.
  const countOf = (cat: string) => grouped.find((g) => g.cat === cat)?.items.length ?? 0;
  const breakdown = (
    [
      ['Jyotirlinga', 'ज्योतिर्लिंग', 'Jyotirlinga'],
      ['Shiva', 'शिव मंदिर', 'Shiva temples'],
      ['Shakti', 'शक्तिपीठ व देवी मंदिर', 'Shakti Peeth & Devi temples'],
      ['Krishna', 'कृष्ण मंदिर', 'Krishna temples'],
      ['Navagraha', 'नवग्रह मंदिर', 'Navagraha temples'],
      ['Ram', 'राम व हनुमान मंदिर', 'Ram & Hanuman temples'],
      ['Jain', 'जैन मंदिर', 'Jain temples'],
      ['Ganesh', 'गणेश मंदिर', 'Ganesh temples'],
      ['Bhairav', 'भैरव मंदिर', 'Bhairav temples'],
    ] as const
  )
    .map(([cat, hi, en]) => ({ n: countOf(cat), label: locale === 'hi' ? hi : en }))
    .filter((x) => x.n > 0);

  const FAQS = [
    {
      q: { hi: 'उज्जैन में कितने मंदिर हैं?', en: 'How many temples are there in Ujjain?' },
      a: {
        hi: `उज्जैन में मंदिरों की कोई एक आधिकारिक गिनती नहीं है — यह सैकड़ों छोटे-बड़े देवालयों का नगर है। इस पृष्ठ पर ${mandirs.length} प्रमुख दर्शनीय मंदिर देवता के अनुसार सूचीबद्ध हैं, जिनमें महाकालेश्वर ज्योतिर्लिंग और चौरासी महादेव की पारंपरिक परिक्रमा के मंदिर शामिल हैं।`,
        en: `There is no single official count — Ujjain is a city of hundreds of shrines. This page lists ${mandirs.length} major darshan temples grouped by deity, including the Mahakaleshwar Jyotirlinga and the temples of the traditional 84 Mahadev parikrama.`,
      },
    },
    {
      q: { hi: 'उज्जैन के सबसे प्रसिद्ध मंदिर कौन से हैं?', en: 'Which are the most famous temples in Ujjain?' },
      a: {
        hi: 'महाकालेश्वर ज्योतिर्लिंग उज्जैन का प्रमुख मंदिर है। इसके अतिरिक्त श्री महाकाल लोक, काल भैरव मंदिर, हरसिद्धि शक्तिपीठ, मंगलनाथ मंदिर, चिंतामण गणेश, गढ़कालिका माता, सांदीपनि आश्रम और गोपाल मंदिर सबसे अधिक दर्शन किए जाने वाले स्थान हैं।',
        en: 'The Mahakaleshwar Jyotirlinga is the principal temple of Ujjain. Alongside it, Shri Mahakal Lok, Kal Bhairav Temple, Harsiddhi Shaktipeeth, Mangalnath Temple, Chintaman Ganesh, Gadkalika Mata, Sandipani Ashram and Gopal Mandir are the most visited.',
      },
    },
    {
      q: { hi: 'उज्जैन का ज्योतिर्लिंग कौन सा मंदिर है?', en: 'Which temple in Ujjain is a Jyotirlinga?' },
      a: {
        hi: 'महाकालेश्वर मंदिर बारह ज्योतिर्लिंगों में से एक है और उज्जैन का एकमात्र ज्योतिर्लिंग है। यह शिप्रा नदी के निकट महाकाल क्षेत्र में स्थित है, और इसके साथ ही श्री महाकाल लोक कॉरिडोर भी दर्शनीय है।',
        en: 'The Mahakaleshwar Temple is one of the twelve Jyotirlingas and the only Jyotirlinga in Ujjain. It stands in the Mahakal area near the Shipra river, with the Shri Mahakal Lok corridor adjoining it.',
      },
    },
    {
      q: { hi: 'चौरासी (84) महादेव क्या हैं?', en: 'What are the 84 Mahadev of Ujjain?' },
      a: {
        hi: 'चौरासी महादेव उज्जैन के 84 प्राचीन शिव मंदिरों की एक पारंपरिक परिक्रमा है, जो पूरे नगर में फैले हुए हैं। श्रद्धालु इन्हें एक निर्धारित क्रम में दर्शन करते हैं; पूरी सूची और क्रम अलग पृष्ठ पर दिया गया है।',
        en: 'The 84 Mahadev (Chaurasi Mahadev) are a traditional parikrama of 84 ancient Shiva temples spread across Ujjain. Devotees visit them in a set order; the complete list and order is given on a separate page.',
      },
    },
    {
      q: { hi: 'उज्जैन के मुख्य मंदिर देखने में कितने दिन लगते हैं?', en: 'How many days are needed to see the main temples of Ujjain?' },
      a: {
        hi: 'मुख्य मंदिर — महाकालेश्वर, महाकाल लोक, काल भैरव, हरसिद्धि, मंगलनाथ और चिंतामण गणेश — एक पूरे दिन में देखे जा सकते हैं। सांदीपनि आश्रम, गढ़कालिका और चौरासी महादेव जोड़ने पर दो दिन आराम से लगते हैं। यात्रा नियोजन में सहायता हेतु +91 74007 24456 पर संपर्क करें।',
        en: 'The main temples — Mahakaleshwar, Mahakal Lok, Kal Bhairav, Harsiddhi, Mangalnath and Chintaman Ganesh — fit into one full day. Adding Sandipani Ashram, Gadkalika and the 84 Mahadev makes it a comfortable two days. For help planning a route, call +91 74007 24456.',
      },
    },
  ] as const;

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
          faqSchema(FAQS.map((f) => ({ q: f.q[locale], a: f.a[locale] }))),
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

            {/* Direct answer for the count cluster this page already ranks top-10 on.
                Kept short and stated once, high on the page, so it can be lifted as a
                featured snippet. The number is honest about what it counts: Ujjain has
                no official temple total, and claiming one would be a fabricated figure. */}
            <section id="how-many" className="mt-8 scroll-mt-24 rounded-xl border border-gold/30 bg-cream-dark/30 p-5 sm:p-6">
              <h2 className={`font-bold text-maroon ${locale === 'hi' ? 'font-sanskrit text-2xl sm:text-3xl' : 'font-serif text-xl sm:text-2xl'}`}>
                {locale === 'hi' ? 'उज्जैन में कितने मंदिर हैं?' : 'How many temples are there in Ujjain?'}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink sm:text-base">
                {locale === 'hi'
                  ? `उज्जैन में मंदिरों की कोई एक आधिकारिक गिनती नहीं है — यह सैकड़ों देवालयों का नगर है। इस पृष्ठ पर ${mandirs.length} प्रमुख दर्शनीय मंदिर देवता के अनुसार सूचीबद्ध हैं, जिनमें महाकालेश्वर ज्योतिर्लिंग और चौरासी महादेव परिक्रमा के मंदिर शामिल हैं।`
                  : `There is no single official count — Ujjain is a city of hundreds of shrines. This page lists ${mandirs.length} major darshan temples grouped by deity, including the Mahakaleshwar Jyotirlinga and the temples of the 84 Mahadev parikrama.`}
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-soft">
                {breakdown.map((b) => (
                  <li key={b.label}>
                    <span className="font-bold text-maroon">{b.n}</span> {b.label}
                  </li>
                ))}
              </ul>
            </section>

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

          {/* FAQ — feeds FAQPage schema and covers the "famous temples" / "which
              Jyotirlinga" / "how many days" intents that land on this hub. */}
          <section id="faq" className="mt-12 scroll-mt-24 mx-auto max-w-3xl">
            <h2 className={`mb-5 border-b border-gold/30 pb-2 font-bold text-maroon ${locale === 'hi' ? 'font-sanskrit text-2xl sm:text-3xl' : 'font-serif text-2xl sm:text-3xl'}`}>
              {locale === 'hi' ? 'उज्जैन के मंदिर — अक्सर पूछे जाने वाले प्रश्न' : 'Temples in Ujjain — Frequently Asked Questions'}
            </h2>
            <dl className="space-y-5">
              {FAQS.map((f) => (
                <div key={f.q.en} className="rounded-xl border border-cream-dark bg-white p-5 shadow-sm">
                  <dt className={`font-bold text-maroon ${locale === 'hi' ? 'text-lg' : 'text-base sm:text-lg'}`}>
                    {f.q[locale]}
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed text-ink-soft sm:text-base">
                    {f.a[locale]}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

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
