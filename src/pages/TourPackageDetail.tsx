import { Link } from 'react-router-dom';
import { Layout } from '../components/global/Layout';
import { SEOHead } from '../components/global/SEOHead';
import { LeadForm } from '../components/global/LeadForm';
import { Breadcrumb } from '../components/global/Breadcrumb';
import { GlobalLeadSection } from '../components/global/GlobalLeadSection';
import { useI18n } from '../i18n';
import { articlesByCategory, articlePath } from '../data/articles';
import { getPackageBySlug } from '../data/packages';
import { SITE } from '../lib/site';
import { breadcrumbSchema } from '../lib/schemas';
import { Phone, PhoneCall } from 'lucide-react';
import { NotFound } from './NotFound';

export function TourPackageDetail({ slug }: { slug: string }) {
  const { locale } = useI18n();
  const prefix = locale === 'en' ? '' : '/hi';
  const pkg = getPackageBySlug(slug);

  if (!pkg) {
    return <NotFound />;
  }

  const articles = articlesByCategory('blog').slice(0, 3); // For News Feed

  const title = pkg.title[locale];
  const descriptionText = pkg.description[locale];
  const path = `/tour-and-travel-ujjain/${slug}/`;

  return (
    <>
      <SEOHead
        title={`${title} | Ujjain Tour Packages`}
        description={descriptionText}
        path={path}
        locale={locale}
        schemas={[breadcrumbSchema({
          items: [
            { name: locale === 'hi' ? 'होम' : 'Home', url: SITE.url },
            { name: locale === 'hi' ? 'टूर पैकेज' : 'Tour Packages', url: `${SITE.url}/tour-and-travel-ujjain/` },
            { name: title, url: `${SITE.url}${path}` },
          ]
        })]}
      />
      <Layout>
        {/* ── TOP MAROON BANNER ── */}
        <section className="relative bg-maroon-900 py-16 sm:py-24 overflow-hidden border-b-[8px] border-saffron">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-maroon-900/80" />
          <div className="container-page relative z-10 text-center">
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-white drop-shadow-xl tracking-wide uppercase">
              {title}
            </h1>
          </div>
        </section>

        <div className="bg-cream-light py-4 border-b border-cream">
          <div className="container-page">
            <Breadcrumb items={[
              { label: locale === 'hi' ? 'टूर पैकेज' : 'Tour Packages', href: '/tour-and-travel-ujjain/' },
              { label: title }
            ]} />
          </div>
        </div>

        {/* ── TWO COLUMN LAYOUT ── */}
        <section className="container-page py-12">
          <div className="grid lg:grid-cols-3 gap-10">
            
            {/* LEFT COLUMN: PACKAGE DETAILS */}
            <div className="lg:col-span-2 space-y-10">
              
              {/* Hero Image */}
              <div className="rounded-2xl overflow-hidden shadow-xl border border-cream border-b-4 border-b-saffron relative h-[300px] sm:h-[450px]">
                <img src={pkg.heroImage} alt={title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-maroon-900/60 to-transparent" />
              </div>

              {/* Description */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-cream">
                <h2 className="font-serif text-3xl font-bold text-maroon mb-6 border-b-2 border-saffron inline-block pb-2">
                  {locale === 'hi' ? 'विवरण' : 'Description'}
                </h2>
                <p className="text-lg text-ink-soft leading-relaxed font-serif italic">
                  {descriptionText}
                </p>
              </div>

              {/* Itinerary */}
              <div className="space-y-8">
                {pkg.itinerary.map((day, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-cream-dark relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-saffron" />
                    <h3 className="font-serif text-2xl font-bold text-maroon mb-4">
                      {day.dayTitle[locale]}
                    </h3>
                    <p className="text-ink-soft text-lg mb-4">
                      {day.content[locale]}
                    </p>
                    {day.list && (
                      <ol className="list-decimal ml-6 space-y-3 text-ink-soft mt-6">
                        {day.list.map((item, i) => (
                          <li key={i} className="pl-2">
                            <span dangerouslySetInnerHTML={{ __html: item[locale].replace(/^([^:]+:)/, '<strong class="text-ink">$1</strong>') }} />
                          </li>
                        ))}
                      </ol>
                    )}
                    {day.note && (
                      <p className="mt-6 text-saffron font-bold italic bg-saffron/10 p-4 rounded-lg border border-saffron/20">
                        {day.note[locale]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Need Help Banner */}
              <div className="bg-maroon rounded-2xl p-8 sm:p-12 shadow-xl border border-maroon-800 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
                <h3 className="font-serif text-3xl font-bold text-white relative z-10 text-center sm:text-left drop-shadow-md">
                  {locale === 'hi' ? 'कोई सहायता चाहिए, हमें कॉल करें!' : 'Need Help, Call Us Now!'}
                </h3>
                <a href={SITE.phoneTel} className="btn-primary bg-saffron hover:bg-white hover:text-maroon border-2 border-saffron hover:border-white shadow-lg text-lg flex items-center gap-2 relative z-10 flex-shrink-0">
                  <PhoneCall className="w-5 h-5" />
                  {SITE.phone}
                </a>
              </div>

            </div>

            {/* RIGHT COLUMN: BOOKING FORM */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-cream-dark p-6 sm:p-8">
                <h3 className="font-serif text-2xl font-bold text-maroon mb-6 text-center border-b-2 border-saffron pb-4 inline-block w-full">
                  {locale === 'hi' ? 'पैकेज बुक करें' : 'Request a Call Back'}
                </h3>
                <LeadForm variant="card" defaultService="tour" sourcePage={slug} />
              </div>
            </div>

          </div>
        </section>

        {/* ── REQUEST A CALL BACK (FULL WIDTH BOTTOM) ── */}
        <GlobalLeadSection sourcePage={`${slug}-bottom`} defaultService="tour" />

        {/* ── NEWS FEED ── */}
        {articles.length > 0 && (
          <section className="bg-cream py-16">
            <div className="container-page">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon text-center mb-10">
                {locale === 'hi' ? 'न्यूज़ फ़ीड' : 'News Feed'}
              </h2>
              <div className="grid gap-6 sm:grid-cols-3 max-w-6xl mx-auto">
                {articles.map((a) => (
                  <Link key={a.slug} to={`${prefix}${articlePath(a)}`} className="block rounded-xl overflow-hidden bg-white shadow-md border border-cream-dark hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="relative h-48 overflow-hidden">
                      <img src={a.heroImage} alt={a.title[locale]} className="w-full h-full object-cover" />
                      <div className="absolute top-3 right-3 bg-saffron text-white text-xs font-bold px-2 py-1 rounded">
                        {locale === 'hi' ? 'ब्लॉग' : 'Blog'}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif text-xl font-bold text-maroon line-clamp-2">{a.title[locale]}</h3>
                      <p className="mt-2 text-sm text-ink-soft line-clamp-3">{a.shortIntro[locale]}</p>
                      <p className="mt-4 text-xs font-medium text-ink-mute">
                        {a.publishDate}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </Layout>
    </>
  );
}

