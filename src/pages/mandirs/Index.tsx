import { Sparkles, ArrowUpRight } from 'lucide-react';
import { Layout } from '../../components/global/Layout';
import { SEOHead } from '../../components/global/SEOHead';
import { LeadForm } from '../../components/global/LeadForm';
import { MandirCard } from '../../components/mandir/MandirCard';
import { Breadcrumb } from '../../components/global/Breadcrumb';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n';
import { mandirs } from '../../data/mandirs';
import { breadcrumbSchema } from '../../lib/schemas';
import { SITE } from '../../lib/site';

export function MandirIndex() {
  const { locale } = useI18n();
  const prefix = locale === 'en' ? '' : '/hi';

  const title = locale === 'hi'
    ? `उज्जैन दर्शन सूची — ${mandirs.length} प्रमुख मंदिर, सत्यापित दर्शन समय, इतिहास व फ़ोटो`
    : `Ujjain Darshan List — ${mandirs.length} Major Temples, Verified Timings, History & Photos`;
  const description = locale === 'hi'
    ? `उज्जैन के प्रमुख दर्शनीय मंदिरों की क्यूरेटेड सूची — महाकालेश्वर, महाकाल लोक, काल भैरव, मंगलनाथ, चिंतामण गणेश, हरसिद्धि माता व अन्य। सत्यापित दर्शन समय, इतिहास, फ़ोटो। यात्रा सहायता: ${SITE.phone}`
    : `Curated list of Ujjain's major darshan temples — Mahakaleshwar, Mahakal Lok, Kal Bhairav, Mangalnath, Chintaman Ganesh, Harsiddhi Mata & more. Verified darshan timings, history, photos. Plan: ${SITE.phone}`;

  return (
    <>
      <SEOHead
        title={title}
        description={description}
        path="/mandirs/"
        locale={locale}
        schemas={[breadcrumbSchema({ items: [
          { name: locale === 'hi' ? 'होम' : 'Home', url: SITE.url },
          { name: locale === 'hi' ? 'मन्दिर' : 'Temples', url: `${SITE.url}/mandirs/` },
        ]})]}
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
                {locale === 'hi' ? 'उज्जैन के प्रमुख मंदिर' : 'Major Temples of Ujjain'}
              </h1>
              <p className="mt-5 text-base leading-relaxed text-cream/80 sm:text-lg">
                {locale === 'hi'
                  ? 'महाकालेश्वर से मंगलनाथ तक — उज्जैन के दर्शनीय मंदिरों की क्यूरेटेड सूची। दर्शन समय · इतिहास · फ़ोटो · मार्गदर्शन।'
                  : 'From Mahakaleshwar to Mangalnath — a curated list of Ujjain\'s must-visit temples. Darshan timings · history · photos · directions.'}
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

        {/* GRID — curated */}
        <section className="container-page py-10 sm:py-14">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {mandirs.map((m, idx) => (
              <MandirCard key={m.slug} mandir={m} featured={m.isFeatured} index={idx} />
            ))}
          </div>

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
