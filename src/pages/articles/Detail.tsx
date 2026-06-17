import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../../components/global/Layout';
import { SEOHead } from '../../components/global/SEOHead';
import { LeadForm } from '../../components/global/LeadForm';
import { Breadcrumb } from '../../components/global/Breadcrumb';
import { PujaBookingForm } from '../../components/puja/PujaBookingForm';
import { PujaGraphicHero } from '../../components/puja/PujaGraphicHero';
import { ShareButtons } from '../../components/shared/ShareButtons';
import { useI18n } from '../../i18n';
import { articleBySlug, getRelatedArticles, articlePath } from '../../data/articles';
import { SITE } from '../../lib/site';
import { articleSchema, breadcrumbSchema, faqSchema } from '../../lib/schemas';
import type { Article } from '../../lib/types';

const categoryMeta: Record<Article['category'], { hi: string; en: string; href: string }> = {
  simhastha: { hi: 'सिंहस्थ 2028', en: 'Simhastha 2028', href: '/simhastha-2028/' },
  transport: { hi: 'यातायात', en: 'Transport', href: '/transport-in-ujjain/' },
  tour: { hi: 'टूर पैकेज', en: 'Tour & Travel', href: '/tour-and-travel-ujjain/' },
  'puja-info': { hi: 'पूजा जानकारी', en: 'Puja Info', href: '/puja-in-ujjain/' },
  blog: { hi: 'ब्लॉग', en: 'Blog', href: '/blog/' },
};

/* ── KEY STATS STRIP ─────────────────────────────────────────────────── */
type StatItem = { value: string; label: string };
const ARTICLE_STATS: Record<string, StatItem[]> = {
  'simhastha/akhada-traditions-ujjain': [
    { value: '13', label: 'मान्यता प्राप्त अखाड़े' },
    { value: '7', label: 'शैव अखाड़े' },
    { value: '3', label: 'वैष्णव (अनी)' },
    { value: '8वीं सदी', label: 'शंकराचार्य स्थापना' },
  ],
  'simhastha/sadhus-naga-babas-simhastha': [
    { value: '5L+', label: 'नागा साधु 2028 में' },
    { value: '4', label: 'शाही स्नान तिथियाँ' },
    { value: '13', label: 'अखाड़े' },
    { value: '2028', label: 'सिंहस्थ वर्ष' },
  ],
  'simhastha/history-of-simhastha-ujjain': [
    { value: '12 वर्ष', label: 'महाकुम्भ अन्तराल' },
    { value: '5', label: 'शाही स्नान 2028' },
    { value: '1 करोड़+', label: 'तीर्थयात्री प्रतिदिन' },
    { value: '2028', label: 'अगला सिंहस्थ' },
  ],
};
const ARTICLE_STATS_EN: Record<string, StatItem[]> = {
  'simhastha/akhada-traditions-ujjain': [
    { value: '13', label: 'Recognised Akhadas' },
    { value: '7', label: 'Shaiva Akhadas' },
    { value: '3', label: 'Vaishnava (Ani)' },
    { value: '8th C', label: 'Founded by Shankaracharya' },
  ],
  'simhastha/sadhus-naga-babas-simhastha': [
    { value: '5L+', label: 'Naga Sadhus in 2028' },
    { value: '4', label: 'Shahi Snan Dates' },
    { value: '13', label: 'Akhadas' },
    { value: '2028', label: 'Simhastha Year' },
  ],
  'simhastha/history-of-simhastha-ujjain': [
    { value: '12 yrs', label: 'Maha Kumbh Interval' },
    { value: '5', label: 'Shahi Snans 2028' },
    { value: '1 Cr+', label: 'Pilgrims per Day' },
    { value: '2028', label: 'Next Simhastha' },
  ],
};

function ArticleStatsStrip({ stats }: { stats: StatItem[] }) {
  return (
    <div className="not-prose my-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-2xl bg-maroon-900 border border-gold/30 px-5 py-6 text-center shadow-lg group hover:border-gold/60 transition-all duration-300"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent" />
          <p className="font-serif text-3xl sm:text-4xl font-extrabold text-gold leading-none mb-2 drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]">
            {s.value}
          </p>
          <p className="text-xs sm:text-sm font-semibold text-cream/80 uppercase tracking-wide leading-snug">
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ── PULL QUOTE ──────────────────────────────────────────────────────── */
function PullQuote({ text }: { text: string }) {
  return (
    <blockquote className="not-prose relative my-10 px-8 py-7 rounded-2xl border-l-[5px] border-gold bg-gradient-to-r from-cream to-white shadow-lg overflow-hidden">
      <div className="absolute top-3 left-4 text-6xl font-serif text-gold/20 leading-none select-none">"</div>
      <div className="absolute bottom-3 right-4 text-6xl font-serif text-gold/20 leading-none select-none rotate-180">"</div>
      <p className="relative font-serif text-lg sm:text-xl text-maroon-900 italic leading-relaxed font-medium">
        {text}
      </p>
    </blockquote>
  );
}

/* ── FAQ ACCORDION ───────────────────────────────────────────────────── */
type FaqItem = { q: { hi: string; en: string }; a: { hi: string; en: string } };

function FaqAccordion({ faqs, locale }: { faqs: FaqItem[]; locale: 'hi' | 'en' }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="not-prose mt-14 mb-8">
      {/* Section header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-saffron-700 mb-1">
            {locale === 'hi' ? 'सामान्य प्रश्न' : 'Frequently Asked'}
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-maroon">
            {locale === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Questions & Answers'}
          </h2>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-gold via-transparent to-transparent" />
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = open === i;
          const question = faq.q[locale];
          const answer = faq.a[locale];
          return (
            <div
              key={i}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen
                  ? 'border-gold bg-white shadow-xl shadow-gold/10'
                  : 'border-cream bg-white shadow-sm hover:shadow-md hover:border-gold/50'
              }`}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
              >
                <div className="flex items-start gap-4">
                  <span className={`mt-0.5 flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    isOpen ? 'bg-gold text-maroon-900' : 'bg-cream text-saffron-700 group-hover:bg-gold/30'
                  }`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={`font-serif font-bold text-base sm:text-lg leading-snug transition-colors ${
                    isOpen ? 'text-gold' : 'text-maroon group-hover:text-gold'
                  }`}>
                    {question}
                  </span>
                </div>
                <span className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  isOpen
                    ? 'bg-maroon border-maroon text-white rotate-180'
                    : 'border-cream text-ink-mute group-hover:border-gold'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-0">
                  <div className="ml-11 pl-0 border-l-2 border-gold/30 pl-4">
                    <p className="text-ink-soft text-base leading-relaxed">{answer}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ── MAIN COMPONENT ──────────────────────────────────────────────────── */
interface Props { category: Article['category']; slug: string; }

export function ArticleDetail({ category, slug }: Props) {
  const article = articleBySlug.get(`${category}/${slug}`);
  const { locale } = useI18n();
  const prefix = locale === 'hi' ? '' : '/en';

  if (!article) return null;

  const path = articlePath(article);
  const canonical = locale === 'hi' ? `${SITE.url}${path}` : `${SITE.url}/en${path}`;
  const cat = categoryMeta[article.category];

  const statsKey = `${category}/${slug}`;
  const statsData = locale === 'hi' ? ARTICLE_STATS[statsKey] : ARTICLE_STATS_EN[statsKey];

  const renderBody = (md: string) => {
    return md.split(/\n\n+/).map((block, i) => {
      if (block.startsWith('## ')) return <h2 key={i}>{block.replace('## ', '')}</h2>;
      if (block.startsWith('### ')) return <h3 key={i}>{block.replace('### ', '')}</h3>;
      if (block.startsWith('> ')) {
        return (
          <div key={i} className="not-prose my-8 px-6 py-5 rounded-xl border-l-4 border-saffron bg-saffron/5 text-maroon font-serif italic text-lg leading-relaxed">
            {block.replace(/^> /gm, '')}
          </div>
        );
      }
      if (block.startsWith('- ') || block.startsWith('* ')) {
        return (
          <ul key={i}>
            {block.split('\n').map((li, j) => (
              <li key={j} dangerouslySetInnerHTML={{ __html: renderInline(li.replace(/^[-*]\s+/, '')) }} />
            ))}
          </ul>
        );
      }
      if (/^\d+\.\s/.test(block)) {
        return (
          <ol key={i} className="ml-6 list-decimal mb-4">
            {block.split('\n').map((li, j) => (
              <li key={j} dangerouslySetInnerHTML={{ __html: renderInline(li.replace(/^\d+\.\s+/, '')) }} />
            ))}
          </ol>
        );
      }
      if (block.startsWith('| ')) {
        const lines = block.split('\n').filter((l) => l.startsWith('|'));
        const header = lines[0].split('|').slice(1, -1).map((c) => c.trim());
        const rows = lines.slice(2).map((r) => r.split('|').slice(1, -1).map((c) => c.trim()));
        return (
          <div key={i} className="overflow-x-auto my-8">
            <table>
              <thead><tr>{header.map((h, k) => <th key={k}>{h}</th>)}</tr></thead>
              <tbody>
                {rows.map((r, k) => <tr key={k}>{r.map((c, l) => <td key={l} dangerouslySetInnerHTML={{ __html: renderInline(c) }} />)}</tr>)}
              </tbody>
            </table>
          </div>
        );
      }
      return <p key={i} dangerouslySetInnerHTML={{ __html: renderInline(block) }} />;
    });
  };

  const renderInline = (s: string) =>
    s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');

  const related = getRelatedArticles(article);

  const schemas = [
    articleSchema({
      url: canonical,
      headline: article.title[locale],
      description: article.metaDescription[locale],
      image: `${SITE.url}${article.heroImage}`,
      datePublished: article.publishDate,
      dateModified: article.lastUpdated,
    }),
    breadcrumbSchema({ items: [
      { name: locale === 'hi' ? 'होम' : 'Home', url: SITE.url },
      { name: cat[locale], url: `${SITE.url}${cat.href}` },
      { name: article.title[locale], url: canonical },
    ]}),
    ...(article.faqs ? [faqSchema(article.faqs.map((f) => ({ q: (f.question || f.q)![locale], a: (f.answer || f.a)![locale] })))] : []),
  ];

  return (
    <>
      <SEOHead
        title={`${article.title[locale]} | UjjainTemple`}
        description={article.metaDescription[locale]}
        path={path}
        locale={locale}
        image={article.heroImage}
        type="article"
        publishedTime={article.publishDate}
        modifiedTime={article.lastUpdated}
        schemas={schemas}
      />
      <Layout>

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        {article.category === 'puja-info' ? (

          /* ── PUJA HERO — designed graphic banner, no photo dependency ── */
          <PujaGraphicHero
            article={article}
            locale={locale}
            catLabel={cat[locale]}
          />

        ) : article.heroImage ? (

          /* NON-PUJA centered overlay hero */
          <header className="relative flex flex-col items-center justify-center overflow-hidden bg-maroon-900 pt-20 pb-16 sm:py-32 border-b-[6px] border-gold min-h-[50vh]">
            <div className="absolute inset-0 z-0">
              <img src={article.heroImage} alt={article.title[locale]} className="h-full w-full object-cover opacity-60 mix-blend-luminosity" />
              <div className="absolute inset-0 bg-gradient-to-b from-maroon-900/90 via-maroon-900/60 to-maroon-900/95" />
            </div>
            <div className="relative z-10 text-center px-4 flex flex-col items-center max-w-5xl mx-auto">
              <p className="text-sm sm:text-base font-bold uppercase tracking-widest text-gold mb-4">{cat[locale]}</p>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] mb-6 leading-tight">
                {article.title[locale]}
              </h1>
              <p className="text-cream text-lg sm:text-xl md:text-2xl font-serif italic max-w-3xl leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-8">
                {article.shortIntro[locale]}
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-cream/70 font-medium">
                <span>{locale === 'hi' ? 'प्रकाशित:' : 'Published:'} {article.publishDate}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                <span>{locale === 'hi' ? 'अद्यतन:' : 'Updated:'} {article.lastUpdated}</span>
              </div>
            </div>
          </header>

        ) : (

          /* No-image fallback hero */
          <header className="container-page py-12 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-saffron-700 mb-4">{cat[locale]}</p>
            <h1 className="font-serif text-4xl font-extrabold text-maroon sm:text-5xl md:text-6xl leading-tight mb-6">{article.title[locale]}</h1>
            <p className="text-lg text-ink-soft sm:text-xl font-serif italic mb-6 max-w-2xl mx-auto leading-relaxed">{article.shortIntro[locale]}</p>
            <div className="flex items-center justify-center gap-4 text-sm text-ink-mute font-medium">
              <span>{locale === 'hi' ? 'प्रकाशित:' : 'Published:'} {article.publishDate}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
              <span>{locale === 'hi' ? 'अद्यतन:' : 'Updated:'} {article.lastUpdated}</span>
            </div>
          </header>
        )}

        {/* Breadcrumb */}
        <div className="bg-cream-light py-4 border-b border-cream">
          <div className="container-page">
            <Breadcrumb items={[
              { label: cat[locale], href: `${prefix}${cat.href}` },
              { label: article.title[locale] },
            ]} />
          </div>
        </div>

        {/* Article body */}
        <article className="container-page py-12" id="puja-content">

          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="prose-temple max-w-prose">

              {/* ── PULL QUOTE (shortIntro as luxury callout) ── */}
              {article.category !== 'puja-info' && (
                <PullQuote text={article.shortIntro[locale]} />
              )}

              {/* ── KEY STATS STRIP ── */}
              {statsData && <ArticleStatsStrip stats={statsData} />}

              {/* ── ARTICLE BODY ── */}
              {renderBody(article.body[locale])}

              {/* PUJA PHOTO GALLERY */}
              {article.photos && article.photos.length > 0 && (
                <section className="not-prose mt-12 border-t-2 border-cream-dark pt-10">
                  <div className="mb-6 flex items-center gap-3">
                    <span className="text-gold font-serif text-2xl leading-none" aria-hidden>ॐ</span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-saffron-700 mb-1">
                        {locale === 'hi' ? 'पूजा अनुष्ठान' : 'Puja Ceremonies'}
                      </p>
                      <h2 className="font-sanskrit text-2xl font-bold text-maroon leading-none">
                        {locale === 'hi' ? 'झलकियाँ — पूजा अनुष्ठान' : 'Gallery — Puja Ceremonies'}
                      </h2>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {article.photos.map((photo, i) => (
                      <div
                        key={i}
                        className="group relative aspect-square overflow-hidden rounded-xl border border-cream-dark bg-cream-dark shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                      >
                        <img
                          src={photo}
                          alt={`${article.title[locale]} — ${locale === 'hi' ? 'पूजा झलकी' : 'puja ceremony'} ${i + 1}`}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-maroon-900/0 group-hover:bg-maroon-900/25 transition-colors duration-300" />
                        <div className="pointer-events-none absolute top-2 left-2 h-5 w-5 border-t-2 border-l-2 border-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="pointer-events-none absolute bottom-2 right-2 h-5 w-5 border-b-2 border-r-2 border-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-[11px] text-ink-mute">
                    {locale === 'hi'
                      ? 'उज्जैन में सम्पन्न पूजा अनुष्ठानों की झलकियाँ — मंगलनाथ मंदिर परिसर'
                      : 'Puja ceremonies performed in Ujjain — Mangalnath Mandir premises'}
                  </p>
                </section>
              )}

              {article.forwardCta && (
                <PujaBookingForm
                  pujaName={{
                    hi: article.title.hi.split('—')[0].trim(),
                    en: article.title.en.split('—')[0].trim(),
                  }}
                />
              )}

              {/* ── FAQ ACCORDION ── */}
              {article.faqs && article.faqs.length > 0 && (
                <FaqAccordion faqs={article.faqs as FaqItem[]} locale={locale} />
              )}

              <div className="mt-8">
                <ShareButtons url={canonical} title={article.title[locale]} />
              </div>
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <LeadForm
                sourcePage={`${article.category}/${article.slug}`}
                defaultService={article.category === 'transport' ? 'transport' : article.category === 'tour' ? 'tour' : article.category === 'simhastha' ? 'simhastha' : 'darshanPlan'}
              />
            </aside>
          </div>

          {related.length > 0 && (
            <section className="mt-16 border-t-[3px] border-cream pt-12">
              <div className="text-center mb-10">
                <h2 className="font-serif text-3xl font-bold text-maroon inline-block relative pb-3">
                  {locale === 'hi' ? 'सम्बंधित लेख' : 'Related Articles'}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-saffron rounded-full" />
                </h2>
              </div>

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r) => (
                  <Link key={r.slug} to={`${prefix}${articlePath(r)}`} className="group block rounded-2xl overflow-hidden bg-white shadow-xl border border-cream hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
                    {r.heroImage ? (
                      <div className="relative h-48 overflow-hidden bg-cream-dark">
                        <img src={r.heroImage} alt={r.title[locale]} loading="lazy" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-maroon-900/80 to-transparent" />
                        <div className="absolute top-4 left-4">
                          <span className="bg-gold text-maroon-900 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                            {categoryMeta[r.category][locale]}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-cream-dark p-4 flex items-center justify-between border-b border-cream">
                        <span className="text-xs font-bold uppercase text-saffron-700">{categoryMeta[r.category][locale]}</span>
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-serif text-xl font-bold text-maroon line-clamp-2 group-hover:text-gold transition-colors">{r.title[locale]}</h3>
                        <p className="mt-3 text-sm text-ink-soft line-clamp-2 leading-relaxed">{r.shortIntro[locale]}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </Layout>
    </>
  );
}

