import { EnquireButton } from '../components/global/EnquireButton';
import { Link } from 'react-router-dom';
import { Layout } from '../components/global/Layout';
import { SEOHead } from '../components/global/SEOHead';
import { LeadForm } from '../components/global/LeadForm';

/**
 * Group packages must capture a GROUP lead, not a generic tour one — a samiti booking
 * and a family day-trip are different sales. lead.php scores 'group' as HOT and marks
 * the mail subject [GROUP] so it is obvious in the inbox. (Aman, 2026-09-30.)
 */
const GROUP_SLUGS = new Set(['ujjain-group-tour-package']);
import { Breadcrumb } from '../components/global/Breadcrumb';
import { GlobalLeadSection } from '../components/global/GlobalLeadSection';
import { useI18n } from '../i18n';
import { articleListByCategory as articlesByCategory, articlePath } from '../data/articles-index';
import { getPackageBySlug } from '../data/packages';
import { PACKAGE_SALES } from '../data/package-sales';
import { SITE } from '../lib/site';
import { breadcrumbSchema, faqSchema, touristTripSchema } from '../lib/schemas';
import { PackageBookingGuide, PACKAGE_FAQS } from '../components/global/PackageBookingGuide';
import { PhoneCall, Clock, BedDouble, Car, Users, MapPin, Hotel, MessageCircle } from 'lucide-react';
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
  const sales = PACKAGE_SALES[slug];
  const isHi = locale === 'hi';
  const seoTitle = sales?.seoTitle ? sales.seoTitle[locale] : `${title} | Ujjain Tour Packages`;
  const metaDescription = sales?.metaDescription ? sales.metaDescription[locale] : descriptionText;
  const packageFaqs = sales?.faqs ?? [];
  const glance = sales
    ? [
        { icon: Clock, label: isHi ? 'अवधि' : 'Duration', value: sales.duration[locale] },
        { icon: BedDouble, label: isHi ? 'ठहरना' : 'Stay', value: sales.stay[locale] },
        { icon: Car, label: isHi ? 'गाड़ी' : 'Travel', value: isHi ? 'ड्राइवर सहित निजी AC गाड़ी — लोगों के हिसाब से सेडान, SUV या टेम्पो ट्रैवलर' : 'Private AC car with driver — sedan, SUV or tempo traveller by group size' },
        { icon: Users, label: isHi ? 'किसके लिए' : 'Ideal for', value: sales.idealFor[locale] },
      ]
    : [];

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={metaDescription}
        path={path}
        locale={locale}
        schemas={[breadcrumbSchema({
          items: [
            { name: locale === 'hi' ? 'होम' : 'Home', url: SITE.url },
            { name: locale === 'hi' ? 'टूर पैकेज' : 'Tour Packages', url: `${SITE.url}/tour-and-travel-ujjain/` },
            { name: title, url: `${SITE.url}${path}` },
          ]
        }), faqSchema([...packageFaqs, ...PACKAGE_FAQS].map((f) => ({ q: f.q[locale], a: f.a[locale] }))),
        touristTripSchema({
          name: title,
          description: metaDescription,
          url: `${SITE.url}${isHi ? '/hi' : ''}${path}`,
          image: pkg.heroImage,
          touristType: sales ? sales.idealFor[locale] : (isHi ? 'तीर्थयात्री' : 'Pilgrims'),
          days: pkg.itinerary.map((d) => d.dayTitle[locale]),
        })]}
      />
      <Layout>
        {/* ── TOP MAROON BANNER (plain, left-aligned — matches temple/puja hero) ── */}
        <section className="relative overflow-hidden border-b-[8px] border-saffron bg-maroon-900">
          <div className="container-page relative z-10 py-14 sm:py-20">
            <div className="max-w-3xl">
              <span className="inline-block bg-gold text-maroon-900 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest shadow mb-4">
                {locale === 'hi' ? 'टूर पैकेज' : 'Tour Package'}
              </span>
              <h1 className={`font-bold text-white leading-tight ${locale === 'hi' ? 'font-sanskrit text-4xl sm:text-5xl md:text-6xl' : 'font-serif text-3xl sm:text-5xl md:text-6xl'}`}>
                {title}
              </h1>
              <p className={`mt-4 text-cream/85 leading-relaxed max-w-2xl ${locale === 'hi' ? 'text-lg' : 'text-base sm:text-lg'}`}>
                {descriptionText}
              </p>
            </div>
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

              {/* At a glance — the facts a package searcher compares on (replaced a card that
                  repeated the hero description word for word, 2026-11-03). */}
              {sales && (
                <div className="rounded-2xl border border-cream bg-white p-6 shadow-sm sm:p-8">
                  <h2 className={`font-bold text-maroon ${isHi ? 'font-sanskrit text-2xl sm:text-3xl' : 'font-serif text-2xl sm:text-3xl'}`}>
                    {isHi ? 'एक नज़र में' : 'At a glance'}
                  </h2>
                  <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                    {glance.map((g) => (
                      <div key={g.label} className="flex gap-3 rounded-xl bg-cream-dark/40 p-4">
                        <g.icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-maroon" />
                        <div>
                          <dt className={`text-xs font-bold text-ink-label ${isHi ? '' : 'uppercase tracking-wider'}`}>{g.label}</dt>
                          <dd className="mt-0.5 text-ink">{g.value}</dd>
                        </div>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-4 flex gap-2 text-sm text-ink-soft">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-maroon" />
                    <span>{sales.places[locale]}</span>
                  </p>
                </div>
              )}

              {/* Hotel class — the question a package buyer has before the price (rates stay on the call). */}
              {sales && (
                <div className="rounded-2xl border-2 border-gold bg-cream p-6 sm:p-8">
                  <p className="flex items-center gap-2 font-semibold text-maroon">
                    <Hotel className="h-5 w-5" /> {isHi ? 'एक ही यात्रा, हर होटल श्रेणी का रेट' : 'One trip, a rate for every hotel class'}
                  </p>
                  <p className="mt-2 text-ink-soft">
                    {isHi
                      ? 'फ़ॉर्म में तारीख, लोग और पसंद की होटल श्रेणी बताएँ। हम यही योजना स्टैंडर्ड, डीलक्स और प्रीमियम होटल के साथ अलग-अलग रेट में भेजते हैं — गाड़ी और होटल एक ही रेट में, ताकि आप ठहरना देखकर चुनें।'
                      : 'Tell us your dates, group size and the hotel class you have in mind. We send this same plan priced with a standard, deluxe and premium hotel side by side — car and hotel in one figure, so you choose the stay knowing the cost.'}
                  </p>
                </div>
              )}

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
                      <p className="mt-6 text-saffron-700 font-bold italic bg-saffron/10 p-4 rounded-lg border border-saffron/20">
                        {day.note[locale]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <PackageBookingGuide locale={locale} extraFaqs={packageFaqs} />

              {/* Need Help Banner */}
              <div className="bg-maroon rounded-2xl p-8 sm:p-12 shadow-xl border border-maroon-800 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
                <h3 className="font-serif text-3xl font-bold text-white relative z-10 text-center sm:text-left drop-shadow-md">
                  {locale === 'hi' ? 'कोई सहायता चाहिए? हमें पूछताछ भेजें' : 'Need Help? Send Us an Enquiry'}
                </h3>
                <EnquireButton purpose="tour" className="btn-primary bg-saffron hover:bg-white hover:text-maroon border-2 border-saffron hover:border-white shadow-lg text-lg flex items-center gap-2 relative z-10 flex-shrink-0">
                  <MessageCircle className="w-5 h-5" />
                  {locale === 'hi' ? 'पूछताछ भेजें' : 'Send Enquiry'}
                </EnquireButton>
              </div>

            </div>

            {/* RIGHT COLUMN: BOOKING FORM */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-cream-dark p-6 sm:p-8">
                <h3 className="font-serif text-2xl font-bold text-maroon mb-6 text-center border-b-2 border-saffron pb-4 inline-block w-full">
                  {isHi ? 'इस पैकेज का रेट मँगाएँ' : 'Get this package priced'}
                </h3>
                <LeadForm variant="card" defaultService={GROUP_SLUGS.has(slug) ? 'group' : 'tour'} sourcePage={slug} askStay />
              </div>
            </div>

          </div>
        </section>

        {/* ── REQUEST A CALL BACK (FULL WIDTH BOTTOM) ── */}
        <GlobalLeadSection sourcePage={`${slug}-bottom`} defaultService={GROUP_SLUGS.has(slug) ? 'group' : 'tour'} />

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

