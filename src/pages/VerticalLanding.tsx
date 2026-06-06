import { Link } from 'react-router-dom';
import { Layout } from '../components/global/Layout';
import { SEOHead } from '../components/global/SEOHead';
import { GlobalLeadSection } from '../components/global/GlobalLeadSection';
import { Breadcrumb } from '../components/global/Breadcrumb';
import { useI18n } from '../i18n';
import { articlesByCategory, articlePath } from '../data/articles';
import { SITE } from '../lib/site';
import { breadcrumbSchema, itemListSchema } from '../lib/schemas';
import { ArrowRight } from 'lucide-react';
import type { Article } from '../lib/types';

interface Props {
  category: Article['category'];
  titleHi: string;
  titleEn: string;
  introHi: string;
  introEn: string;
  metaHi: string;
  metaEn: string;
  path: string;
  defaultService: 'hotel' | 'transport' | 'tour' | 'simhastha';
}

export function VerticalLanding({ category, titleHi, titleEn, introHi, introEn, metaHi, metaEn, path, defaultService }: Props) {
  const { locale } = useI18n();
  const prefix = locale === 'hi' ? '' : '/en';
  const list = articlesByCategory(category);
  const title = locale === 'hi' ? titleHi : titleEn;
  const intro = locale === 'hi' ? introHi : introEn;
  const description = locale === 'hi' ? metaHi : metaEn;

  return (
    <>
      <SEOHead
        title={`${title} | UjjainTemple — ${SITE.phone}`}
        description={description}
        path={path}
        locale={locale}
        schemas={[
          breadcrumbSchema({ items: [
            { name: locale === 'hi' ? 'होम' : 'Home', url: SITE.url },
            { name: title, url: `${SITE.url}${path}` },
          ]}),
          itemListSchema(list.map(a => ({
            name: a.title[locale],
            url: `${SITE.url}${prefix}${articlePath(a)}`,
            description: a.shortIntro[locale],
            image: a.heroImage ? `${SITE.url}${a.heroImage}` : undefined
          })))
        ]}
      />
      <Layout>
        {/* ── CLEAN LUXURY HEADER ── */}
        <section className="bg-maroon-900 relative py-16 sm:py-24 border-b-[6px] border-gold overflow-hidden">
          {/* Subtle Pattern Background */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23e8b923\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
          
          <div className="container-page relative z-10 max-w-4xl mx-auto text-center px-4">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-extrabold text-white drop-shadow-sm mb-6 leading-tight">
              {title}
            </h1>
            
            <div className="w-24 h-1.5 bg-saffron rounded-full mx-auto mb-6" />
            
            <p className="text-cream text-lg sm:text-2xl font-serif italic max-w-3xl mx-auto leading-relaxed drop-shadow-sm">
              {intro}
            </p>
          </div>
        </section>

        <div className="bg-cream-light py-4 border-b border-cream">
          <div className="container-page">
            <Breadcrumb items={[{ label: title }]} />
          </div>
        </div>

        {/* ── CONTENT SECTION ── */}
        <section className="container-page py-16 sm:py-24 bg-white/50">
          <div className="max-w-6xl mx-auto">
            {list.length === 0 ? (
              <div className="rounded-2xl border-4 border-dashed border-cream-dark bg-cream p-12 text-center max-w-2xl mx-auto shadow-sm">
                <p className="text-xl font-serif text-ink-soft mb-6">
                  {locale === 'hi'
                    ? 'जल्द ही और लेख जोड़े जाएँगे। फ़िलहाल सहायता के लिए कॉल करें:'
                    : 'More articles coming soon. For help right now, call:'}
                </p>
                <a href={SITE.phoneTel} className="btn-primary shadow-lg text-xl px-8 py-4 inline-flex items-center gap-3 transition-transform hover:scale-105">
                  {SITE.phone}
                </a>
              </div>
            ) : (
              <main className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3" role="list">
                {list.map((a) => (
                  <article key={a.slug} className="h-full">
                    <Link 
                      to={`${prefix}${articlePath(a)}`} 
                      className="group block rounded-2xl overflow-hidden bg-white shadow-xl border border-cream hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full"
                      title={a.title[locale]}
                      role="listitem"
                    >
                      {a.heroImage && (
                        <div className="relative h-48 overflow-hidden">
                          <img src={a.heroImage} alt={a.title[locale]} loading="lazy" width="400" height="200" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-maroon-900/80 to-transparent" />
                        </div>
                      )}
                      <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                        <div>
                          <h2 className="font-serif text-2xl font-bold text-maroon line-clamp-2 group-hover:text-gold transition-colors">{a.title[locale]}</h2>
                          <p className="mt-4 text-base text-ink-soft line-clamp-3 leading-relaxed">{a.shortIntro[locale]}</p>
                        </div>
                        <div className="mt-8 flex items-center text-sm font-bold text-saffron-700 uppercase tracking-wide group-hover:text-maroon transition-colors" aria-hidden="true">
                          {locale === 'hi' ? 'पूरा पढ़ें' : 'Read Full Guide'}
                          <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </main>
            )}
          </div>
        </section>

        {/* ── FULL WIDTH CTA ── */}
        <GlobalLeadSection sourcePage={`vertical-${category}`} defaultService={defaultService} />

      </Layout>
    </>
  );
}

