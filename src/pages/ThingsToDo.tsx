import { Link } from 'react-router-dom';
import { Layout } from '../components/global/Layout';
import { SEOHead } from '../components/global/SEOHead';
import { GlobalLeadSection } from '../components/global/GlobalLeadSection';
import { Breadcrumb } from '../components/global/Breadcrumb';
import { MandirCard } from '../components/mandir/MandirCard';
import { useI18n } from '../i18n';
import { featuredMandirs } from '../data/mandirs';
import { packagesData } from '../data/packages';
import { SITE } from '../lib/site';
import { breadcrumbSchema, faqSchema } from '../lib/schemas';
import { Landmark, MapPinned, BedDouble, Car, CalendarDays, Flame, ArrowRight } from 'lucide-react';

// Top-funnel pillar page — targets "things to do in ujjain / ujjain tourism / ujjain darshan /
// places to visit in ujjain" and funnels authority DOWN to every money hub (mandirs, tours,
// hotels, cab, simhastha, puja). Internal-link hub, not a thin page.
export function ThingsToDo() {
  const { locale } = useI18n();
  const prefix = locale === 'hi' ? '' : '/en';
  const path = '/things-to-do-in-ujjain/';
  const topMandirs = featuredMandirs.slice(0, 6);

  const title = locale === 'hi'
    ? 'उज्जैन में घूमने की जगह — प्रमुख दर्शन स्थल, टूर व यात्रा गाइड 2026'
    : 'Things to Do in Ujjain — Top Places to Visit, Darshan & Travel Guide 2026';
  const description = locale === 'hi'
    ? 'उज्जैन में घूमने की जगह — महाकालेश्वर, काल भैरव, हरसिद्धि सहित प्रमुख मंदिर, टूर पैकेज, होटल, कैब व सिंहस्थ 2028 की पूरी यात्रा गाइड। यात्रा सहायता: +91 74007 24456'
    : 'Things to do in Ujjain — top temples like Mahakaleshwar, Kal Bhairav, Harsiddhi, plus tour packages, hotels, cabs & Simhastha 2028. Complete Ujjain travel guide. Help: +91 74007 24456';

  const hubs = [
    { icon: Landmark, to: `${prefix}/mandirs/`, hi: 'उज्जैन के मंदिर', en: 'Temples in Ujjain', dh: '182+ प्रमुख एवं प्राचीन मंदिर — दर्शन समय, इतिहास व कैसे पहुँचें।', de: '182+ ancient temples — darshan timings, history & how to reach.' },
    { icon: MapPinned, to: `${prefix}/tour-and-travel-ujjain/`, hi: 'टूर एंड ट्रैवल', en: 'Tour & Travel', dh: 'उज्जैन दर्शन पैकेज (1/2/3 दिन), ओंकारेश्वर व ज्योतिर्लिंग यात्रा।', de: 'Ujjain darshan packages (1/2/3 day), Omkareshwar & Jyotirlinga tours.' },
    { icon: BedDouble, to: `${prefix}/hotels/`, hi: 'उज्जैन में होटल', en: 'Hotels in Ujjain', dh: 'महाकाल मंदिर के पास बजट, फ़ैमिली व लक्ज़री होटल।', de: 'Budget, family & luxury hotels near Mahakal Temple.' },
    { icon: Car, to: `${prefix}/cab-booking/`, hi: 'टैक्सी व कैब', en: 'Taxi & Cab', dh: 'लोकल दर्शन, इंदौर, भोपाल व ओंकारेश्वर के लिए कैब बुकिंग।', de: 'Cab booking for local darshan, Indore, Bhopal & Omkareshwar.' },
    { icon: CalendarDays, to: `${prefix}/simhastha-2028/`, hi: 'सिंहस्थ 2028', en: 'Simhastha 2028', dh: 'शाही स्नान तिथियाँ, अखाड़े, कल्पवास व यात्रा योजना।', de: 'Shahi Snan dates, akhadas, kalpvas & trip planning.' },
    { icon: Flame, to: `${prefix}/puja-in-ujjain/`, hi: 'पूजा एवं अनुष्ठान', en: 'Puja & Anushthan', dh: 'रुद्राभिषेक, काल सर्प, नवग्रह शांति — प्रामाणिक वैदिक विधि।', de: 'Rudrabhishek, Kaal Sarp, Navgrah Shanti — authentic Vedic vidhi.' },
  ];

  const faqs = [
    {
      q: locale === 'hi' ? 'उज्जैन में घूमने की प्रमुख जगहें कौन सी हैं?' : 'What are the top places to visit in Ujjain?',
      a: locale === 'hi'
        ? 'महाकालेश्वर ज्योतिर्लिंग, काल भैरव मंदिर, हरसिद्धि शक्तिपीठ, मंगलनाथ मंदिर, चिंतामण गणेश, संदीपनि आश्रम, राम घाट एवं महाकाल लोक कॉरिडोर — उज्जैन के सर्वाधिक दर्शनीय स्थल हैं।'
        : 'Mahakaleshwar Jyotirlinga, Kal Bhairav Temple, Harsiddhi Shaktipeeth, Mangalnath Temple, Chintaman Ganesh, Sandipani Ashram, Ram Ghat and the Mahakal Lok Corridor are the most visited places in Ujjain.'
    },
    {
      q: locale === 'hi' ? 'उज्जैन घूमने के लिए कितने दिन चाहिए?' : 'How many days are needed for Ujjain?',
      a: locale === 'hi'
        ? 'प्रमुख मंदिरों के दर्शन के लिए 1 से 2 दिन पर्याप्त हैं। ओंकारेश्वर, महेश्वर या मांडू भी जोड़ना हो तो 3-4 दिन रखें।'
        : '1 to 2 days are enough for the main temples. Add 3-4 days if you also want to cover Omkareshwar, Maheshwar or Mandu.'
    },
    {
      q: locale === 'hi' ? 'उज्जैन घूमने का सबसे अच्छा समय कौन सा है?' : 'What is the best time to visit Ujjain?',
      a: locale === 'hi'
        ? 'अक्टूबर से मार्च तक मौसम सुहावना रहता है — दर्शन के लिए सर्वोत्तम। महाशिवरात्रि एवं सिंहस्थ के समय भीड़ अधिक रहती है।'
        : 'October to March offers pleasant weather — ideal for darshan. Expect large crowds during Mahashivratri and Simhastha.'
    },
    {
      q: locale === 'hi' ? 'क्या एक ही दिन में उज्जैन दर्शन हो सकता है?' : 'Can Ujjain darshan be done in one day?',
      a: locale === 'hi'
        ? 'हाँ, एक दिवसीय उज्जैन दर्शन पैकेज में कैब द्वारा महाकालेश्वर, काल भैरव, हरसिद्धि, मंगलनाथ व अन्य प्रमुख मंदिरों के दर्शन संभव हैं।'
        : 'Yes, a one-day Ujjain darshan package by cab covers Mahakaleshwar, Kal Bhairav, Harsiddhi, Mangalnath and other major temples.'
    },
  ];

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
            { name: locale === 'hi' ? 'उज्जैन में घूमने की जगह' : 'Things to Do in Ujjain', url: `${SITE.url}${path}` },
          ]}),
          faqSchema(faqs.map((f) => ({ q: f.q, a: f.a }))),
        ]}
      />
      <Layout>
        {/* ── HERO ── */}
        <section className="relative flex flex-col justify-center overflow-hidden bg-maroon-900 py-16 sm:py-24 border-b-[6px] border-gold">
          <div className="absolute inset-0 z-0">
            <img src="/images/tours/tour-landing-hero.png" alt="Ujjain" className="h-full w-full object-cover opacity-40 mix-blend-luminosity" />
            <div className="absolute inset-0 bg-gradient-to-b from-maroon-900/90 via-maroon-900/70 to-maroon-900/95" />
          </div>
          <div className="relative z-10 container-page text-center">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">{locale === 'hi' ? 'उज्जैन यात्रा गाइड' : 'Ujjain Travel Guide'}</p>
            <h1 className={`mx-auto max-w-4xl font-extrabold leading-tight text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.8)] ${locale === 'hi' ? 'font-sanskrit text-4xl sm:text-5xl md:text-6xl' : 'font-serif text-3xl sm:text-5xl md:text-6xl'}`}>
              {locale === 'hi' ? 'उज्जैन में घूमने की जगह' : 'Things to Do in Ujjain'}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-cream/90 sm:text-lg">
              {locale === 'hi'
                ? 'प्राचीन मंदिर, ज्योतिर्लिंग, पवित्र घाट एवं सिंहस्थ की नगरी — उज्जैन दर्शन, टूर, होटल व कैब की पूरी यात्रा गाइड एक जगह।'
                : "Ancient temples, Jyotirlinga, holy ghats and the city of Simhastha — your complete guide to Ujjain darshan, tours, hotels and cabs in one place."}
            </p>
            <a href={SITE.phoneTel} className="btn-call mt-7 inline-flex">{locale === 'hi' ? 'यात्रा सहायता लें' : 'Get Trip Help'}</a>
          </div>
        </section>

        <div className="border-b border-cream bg-cream-light py-3">
          <div className="container-page"><Breadcrumb items={[{ label: locale === 'hi' ? 'उज्जैन में घूमने की जगह' : 'Things to Do in Ujjain' }]} /></div>
        </div>

        {/* ── INTRO ── */}
        <section className="container-page py-10 sm:py-14">
          <div className="mx-auto max-w-3xl">
            <p className={`leading-[1.9] text-ink first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-serif first-letter:text-5xl first-letter:font-bold first-letter:leading-none first-letter:text-maroon ${locale === 'hi' ? 'text-lg' : 'text-base sm:text-lg'}`}>
              {locale === 'hi'
                ? 'उज्जैन — मालवा की पवित्र नगरी, भगवान महाकाल की भूमि एवं सप्त-पुरियों में से एक। यहाँ 12 ज्योतिर्लिंगों में से महाकालेश्वर, 51 शक्तिपीठों में से हरसिद्धि, मंगल ग्रह की जन्मस्थली मंगलनाथ, तथा शिप्रा तट के अनेक प्राचीन मंदिर हैं। हर बारहवें वर्ष यहाँ सिंहस्थ महाकुम्भ लगता है। नीचे उज्जैन में घूमने की प्रमुख जगहें, दर्शन योजना एवं यात्रा के सभी साधन दिए गए हैं।'
                : 'Ujjain — the sacred city of Malwa, the land of Lord Mahakal and one of the seven holy Puris. It is home to Mahakaleshwar (one of 12 Jyotirlingas), Harsiddhi (one of 51 Shaktipeeths), Mangalnath (the birthplace of Mars) and many ancient temples along the Shipra river. Every twelfth year the city hosts the Simhastha Mahakumbh. Below are the top places to visit in Ujjain, a darshan plan, and every way to travel.'}
            </p>
          </div>
        </section>

        {/* ── EXPLORE HUBS (the internal-link funnel) ── */}
        <section className="bg-cream-dark/25 py-12 sm:py-16 border-y border-cream">
          <div className="container-page">
            <div className="mb-8 text-center">
              <h2 className={`inline-block font-bold text-maroon ${locale === 'hi' ? 'font-sanskrit text-3xl sm:text-4xl' : 'font-serif text-2xl sm:text-3xl'}`}>
                {locale === 'hi' ? 'श्रेणी अनुसार उज्जैन खोजें' : 'Explore Ujjain by Category'}
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {hubs.map((h) => (
                <Link key={h.to} to={h.to} className="group flex items-start gap-4 rounded-2xl border border-cream bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-saffron/50 hover:shadow-xl">
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-maroon-900 text-gold">
                    <h.icon className="h-6 w-6" />
                  </span>
                  <div className="flex-1">
                    <h3 className={`flex items-center gap-1 font-bold text-maroon ${locale === 'hi' ? 'font-sanskrit text-xl' : 'font-serif text-lg'}`}>
                      {locale === 'hi' ? h.hi : h.en}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{locale === 'hi' ? h.dh : h.de}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── TOP TEMPLES ── */}
        <section className="container-page py-12 sm:py-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-700">{locale === 'hi' ? 'सबसे लोकप्रिय' : 'Most Popular'}</p>
              <h2 className={`mt-1 font-bold text-maroon ${locale === 'hi' ? 'font-sanskrit text-3xl sm:text-4xl' : 'font-serif text-2xl sm:text-3xl'}`}>
                {locale === 'hi' ? 'उज्जैन के प्रमुख मंदिर' : 'Top Temples in Ujjain'}
              </h2>
            </div>
            <Link to={`${prefix}/mandirs/`} className="inline-flex items-center gap-1 text-sm font-bold text-maroon hover:text-saffron-700">
              {locale === 'hi' ? 'सभी मंदिर देखें' : 'View all temples'} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topMandirs.map((m) => <MandirCard key={m.slug} mandir={m} />)}
          </div>
        </section>

        {/* ── TOUR PACKAGES ── */}
        <section className="bg-cream-dark/25 py-12 sm:py-16 border-y border-cream">
          <div className="container-page">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-700">{locale === 'hi' ? 'दर्शन योजना' : 'Plan Your Darshan'}</p>
                <h2 className={`mt-1 font-bold text-maroon ${locale === 'hi' ? 'font-sanskrit text-3xl sm:text-4xl' : 'font-serif text-2xl sm:text-3xl'}`}>
                  {locale === 'hi' ? 'उज्जैन दर्शन टूर पैकेज' : 'Ujjain Darshan Tour Packages'}
                </h2>
              </div>
              <Link to={`${prefix}/tour-and-travel-ujjain/`} className="inline-flex items-center gap-1 text-sm font-bold text-maroon hover:text-saffron-700">
                {locale === 'hi' ? 'सभी पैकेज' : 'All packages'} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {packagesData.slice(0, 3).map((pkg) => (
                <Link key={pkg.slug} to={`${prefix}/tour-and-travel-ujjain/${pkg.slug}/`} className="group flex flex-col overflow-hidden rounded-2xl border border-cream bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative h-48 overflow-hidden">
                    <img src={pkg.heroImage} alt={pkg.title[locale]} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-maroon-900/70 to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-serif text-lg font-bold text-maroon line-clamp-2">{pkg.title[locale]}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft line-clamp-3">{pkg.description[locale]}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-saffron-700">{locale === 'hi' ? 'पैकेज देखें' : 'View details'} <ArrowRight className="h-4 w-4" /></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQs ── */}
        <section className="container-page py-12 sm:py-16">
          <h2 className={`font-bold text-maroon ${locale === 'hi' ? 'font-sanskrit text-3xl sm:text-4xl' : 'font-serif text-2xl sm:text-3xl'}`}>
            {locale === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Frequently Asked Questions'}
          </h2>
          <div className="mt-5 max-w-3xl divide-y divide-gold/25 border-y border-gold/25">
            {faqs.map((f, i) => (
              <details key={i} className="group py-4">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                  <span className={`font-bold text-maroon ${locale === 'hi' ? 'font-sanskrit text-lg' : 'font-serif text-base'}`}>{f.q}</span>
                  <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold-600 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 pr-10 text-base leading-relaxed text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── LEAD ── */}
        <GlobalLeadSection sourcePage="things-to-do" defaultService="tour" />
      </Layout>
    </>
  );
}
