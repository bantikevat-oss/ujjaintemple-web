import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Layout } from '../components/global/Layout';
import { SEOHead } from '../components/global/SEOHead';
import { MandalaDivider } from '../components/global/MandalaDivider';
import { HomeGraphicHero } from '../components/home/HomeGraphicHero';
import { WhyUjjainTemple } from '../components/home/WhyUjjainTemple';
import { GlobalLeadSection } from '../components/global/GlobalLeadSection';
import { MandirCard } from '../components/mandir/MandirCard';
import { useI18n } from '../i18n';
import { featuredMandirs } from '../data/mandirs';
import { organizationSchema, websiteSchema, simhastha2028EventSchema } from '../lib/schemas';

const COPY = {
  hi: {
    eyebrow: 'उज्जैन गाइड',
    h1Line1: 'महाकाल की नगरी —',
    h1Line2: 'उज्जैन के मंदिर, घाट और कथाएँ',
    intro:
      'बारह ज्योतिर्लिंगों में तीसरा महाकालेश्वर। शिप्रा के तट पर बसे पैंतीस से अधिक प्राचीन मंदिर। सन् 2028 के सिंहस्थ महाकुम्भ की तैयारी का एक प्रामाणिक, द्विभाषी संग्रह।',
    ctaPrimary: 'मंदिर सूची',
    ctaSecondary: 'सिंहस्थ 2028 गाइड',
    section2Eyebrow: 'अवंतिका',
    section2Title: 'विक्रमादित्य की राजधानी, काल के स्वामी की भूमि',
    section2P1:
      'उज्जैन — प्राचीन भारत की सात मोक्षदायिनी पुरियों में से एक। महाभारत और स्कंद पुराण की कथाओं में अंकित यह नगर मध्य प्रदेश के पश्चिमी छोर पर शिप्रा नदी के तट पर स्थित है।',
    section2P2:
      'यहाँ का महाकालेश्वर ज्योतिर्लिंग पृथ्वी पर एकमात्र दक्षिणमुखी ज्योतिर्लिंग है। नगरी में फैले छप्पन से अधिक तीर्थ — काल भैरव, मंगलनाथ, हरसिद्धि, चिंतामण गणेश, सांदीपनि आश्रम — प्रत्येक की अपनी सहस्राब्दियों पुरानी कथा है।',
    section2P3:
      'प्रत्येक बारह वर्ष में जब बृहस्पति सिंह राशि में प्रवेश करता है, उज्जैन में सिंहस्थ कुम्भ का आयोजन होता है। आगामी सिंहस्थ — सन् 2028 — के लिए यह संग्रह क्रमश: निर्मित हो रहा है।',
    featuredEyebrow: 'दर्शन',
    featuredTitle: 'उज्जैन के प्रमुख मंदिर',
    featuredCta: 'पूरी मंदिर सूची',
    simhasthaEyebrow: 'महाकुम्भ',
    simhasthaTitle: 'सिंहस्थ 2028',
    simhasthaDates: '09 अप्रैल — 08 मई 2028 · 30 दिवस',
    simhasthaP:
      'बारह साल में एक बार। तीन शाही स्नान। 13 अखाड़े। पूरे 30 दिन का आयोजन। 3000 हेक्टेयर का मेला क्षेत्र। सिंहस्थ 2028 की पूरी गाइड — कल्पवास, घाट, अखाड़े, ट्रांसपोर्ट।',
    simhasthaCta: 'गाइड पढ़ें',
    exploreEyebrow: 'विषय',
    exploreTitle: 'इस संग्रह में',
    exploreItems: [
      { label: 'मंदिर', desc: 'महाकाल · काल भैरव · मंगलनाथ · हरसिद्धि और अन्य', href: '/mandirs/' },
      { label: 'सिंहस्थ 2028', desc: 'कल्पवास · घाट · शाही स्नान · अखाड़े', href: '/simhastha-2028/' },
      { label: 'होटल', desc: 'महाकाल के निकट ठहरने की व्यवस्था', href: '/hotels/' },
      { label: 'यातायात', desc: 'इंदौर, भोपाल, दिल्ली से उज्जैन', href: '/transport-in-ujjain/' },
      { label: 'टूर पैकेज', desc: 'एक से सात दिन की यात्रा योजना', href: '/tour-and-travel-ujjain/' },
      { label: 'पूजा जानकारी', desc: 'मंगल दोष · काल सर्प · नवग्रह शांति', href: '/puja-in-ujjain/' },
    ],
    footnote: 'समस्त मंदिर समय एवं संपर्क सूचना स्थानीय स्रोतों से सत्यापित एवं नियमित पुनरीक्षित।',
  },
  en: {
    eyebrow: 'Ujjain Guide',
    h1Line1: 'City of Mahakal —',
    h1Line2: 'temples, ghats, and stories of Ujjain',
    intro:
      'Third among the twelve Jyotirlingas — Mahakaleshwar. Thirty-five ancient temples on the banks of the Shipra. An authoritative, bilingual record being prepared for the 2028 Simhastha Mahakumbh.',
    ctaPrimary: 'Browse temples',
    ctaSecondary: 'Simhastha 2028 guide',
    section2Eyebrow: 'Avantika',
    section2Title: 'Capital of Vikramaditya, abode of the lord of time',
    section2P1:
      'Ujjain — one of the seven liberation-granting cities of ancient India. Mentioned across the Mahabharata and Skanda Purana, it lies on the western edge of Madhya Pradesh on the banks of the Shipra.',
    section2P2:
      'The Mahakaleshwar Jyotirlinga here is the only south-facing Jyotirlinga on earth. Across the city stand more than fifty-six tirthas — Kal Bhairav, Mangalnath, Harsiddhi, Chintaman Ganesh, Sandipani Ashram — each carrying a millennium-old account of its own.',
    section2P3:
      'Once in twelve years, when Jupiter enters the sign of Leo, Ujjain hosts the Simhastha Kumbh. This collection is being readied for the next one — the Simhastha of 2028.',
    featuredEyebrow: 'Darshan',
    featuredTitle: 'Principal temples of Ujjain',
    featuredCta: 'See full temple list',
    simhasthaEyebrow: 'Mahakumbh',
    simhasthaTitle: 'Simhastha 2028',
    simhasthaDates: '09 April — 08 May 2028 · 30 days',
    simhasthaP:
      'Once in twelve years. Five royal baths. Three akhada traditions. A month of kalpvas. An evolving guide to Simhastha 2028 — kalpvas conduct, ghats, royal-bath calendar, akhada introductions, transit arrangements.',
    simhasthaCta: 'Read the guide',
    exploreEyebrow: 'Sections',
    exploreTitle: 'In this collection',
    exploreItems: [
      { label: 'Temples', desc: 'Mahakal · Kal Bhairav · Mangalnath · Harsiddhi and others', href: '/mandirs/' },
      { label: 'Simhastha 2028', desc: 'Kalpvas · ghats · royal bath · akhadas', href: '/simhastha-2028/' },
      { label: 'Hotels', desc: 'Where to stay near Mahakaleshwar', href: '/hotels/' },
      { label: 'Transport', desc: 'Reaching Ujjain from Indore, Bhopal, Delhi', href: '/transport-in-ujjain/' },
      { label: 'Tour packages', desc: 'One- to seven-day itineraries', href: '/tour-and-travel-ujjain/' },
      { label: 'Puja information', desc: 'Mangal Dosh · Kaal Sarp · Navgrah Shanti', href: '/puja-in-ujjain/' },
    ],
    footnote: 'All temple timings and contact details verified through local sources. Last-verified date noted on each page.',
  },
};

/* ─── Simhastha countdown hook ──────────────────────────────────────────── */
function useSimhasthaCountdown() {
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => {
    const target = new Date('2028-04-09T00:00:00+05:30').getTime();
    const calc = () => Math.max(0, Math.floor((target - Date.now()) / 86400000));
    setDays(calc());
    const id = setInterval(() => setDays(calc()), 60000);
    return () => clearInterval(id);
  }, []);
  return days;
}

export function Home() {
  const { locale } = useI18n();
  const t = COPY[locale];
  const prefix = locale === 'en' ? '' : '/hi';
  const daysLeft = useSimhasthaCountdown();

  const title = locale === 'hi'
    ? 'उज्जैन के मंदिर — सिंहस्थ 2028, होटल, टैक्सी व दर्शन पैकेज | UjjainTemple'
    : 'Ujjain Temple Guide — Simhastha 2028, Hotels, Taxi & Darshan Packages | UjjainTemple';
  const description = locale === 'hi'
    ? 'उज्जैन के 182+ मंदिर, सिंहस्थ 2028 गाइड, उज्जैन दर्शन पैकेज, उज्जैन में होटल व टैक्सी, काल सर्प / मंगल दोष / नाग बलि पूजा। वैदिक पंडित जी उपलब्ध। कॉल: +91 74007 24456।'
    : 'Ujjain temples directory, Simhastha 2028 guide, Ujjain darshan packages, Hotel in Ujjain, Taxi in Ujjain, Kaal Sarp / Mangal Dosh / Nag Bali puja. Authentic pandits. Call +91 74007 24456.';

  return (
    <>
      <SEOHead
        title={title}
        description={description}
        path="/"
        locale={locale}
        schemas={[organizationSchema(), websiteSchema(), simhastha2028EventSchema()]}
      />
      <Layout>
        {/* HERO — premium graphic, no photo dependency */}
        <HomeGraphicHero />

        {/* ── SERVICE QUICK BAR ─────────────────────────────────────────── */}
        <section id="services" className="bg-white border-b border-cream-dark">
          <div className="container-page py-0">
            <div className="grid grid-cols-3 divide-x divide-gold/25">
              {[
                {
                  emoji: '🙏',
                  hi: 'पूजा अनुष्ठान', en: 'Puja Booking',
                  desc_hi: 'काल सर्प · मंगल दोष · महामृत्युंजय',
                  desc_en: 'Kaal Sarp · Mangal Dosh · Mahamrityunjaya',
                  href: `${prefix}/puja-in-ujjain/`,
                  color: '#8B0000',
                },
                {
                  emoji: '🗺️',
                  hi: 'टूर पैकेज', en: 'Tour Packages',
                  desc_hi: '1 से 7 दिन · महाकाल · शिप्रा घाट',
                  desc_en: '1–7 Days · Mahakal · Shipra Ghat',
                  href: `${prefix}/tour-and-travel-ujjain/`,
                  color: '#5c3a00',
                },
                {
                  emoji: '🚗',
                  hi: 'कैब बुकिंग', en: 'Cab Booking',
                  desc_hi: 'इंदौर · भोपाल · दिल्ली से',
                  desc_en: 'Indore · Bhopal · Delhi',
                  href: `${prefix}/cab-booking/`,
                  color: '#1a3a5c',
                },
              ].map((s) => (
                <Link key={s.href} to={s.href}
                  className="group flex flex-col items-center text-center py-7 px-3 sm:px-6
                    hover:bg-cream transition-colors duration-200">
                  <span className="text-2xl sm:text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
                    {s.emoji}
                  </span>
                  <p className={`font-bold text-maroon text-sm sm:text-base ${locale === 'hi' ? 'font-sanskrit' : 'font-serif'}`}>
                    {locale === 'hi' ? s.hi : s.en}
                  </p>
                  <div className="mt-2 h-[2px] w-0 group-hover:w-8 bg-gold transition-all duration-300 rounded-full" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY UJJAINTEMPLE ─────────────────────────────────────────── */}
        <WhyUjjainTemple />

        {/* SIMHASTHA 2028 — flagship event, high up */}
        <section id="simhastha-2028" className="bg-white">
          <div className="container-page py-16 sm:py-20">
            <div className="rounded-2xl border border-gold/40 bg-gradient-to-br from-cream to-cream-dark/40 p-8 sm:p-12 lg:p-16">
              <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end lg:gap-16">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-700">
                    {t.simhasthaEyebrow} · {t.simhasthaDates}
                  </p>
                  <h2 className={`mt-3 font-bold text-maroon ${locale === 'hi' ? 'font-sanskrit' : 'font-serif'} text-4xl sm:text-5xl md:text-6xl leading-[1.05]`}>
                    {t.simhasthaTitle}
                  </h2>
                  <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
                    {t.simhasthaP}
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  {daysLeft !== null && (
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif font-bold text-maroon leading-none"
                        style={{ fontSize: 'clamp(3rem, 6vw, 5rem)' }}>
                        {daysLeft.toLocaleString('en-IN')}
                      </span>
                      <span className="text-sm font-bold uppercase tracking-widest text-saffron-700">
                        {locale === 'hi' ? 'दिन शेष' : 'days left'}
                      </span>
                    </div>
                  )}
                  <Link
                    to={`${prefix}/simhastha-2028/`}
                    className="inline-flex w-fit items-center gap-2 self-start rounded-md bg-maroon px-6 py-3.5 font-semibold text-white shadow-sm transition-colors hover:bg-maroon-700"
                  >
                    {t.simhasthaCta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PUJA CARDS ────────────────────────────────────────────────── */}
        <section id="pujas" style={{ background: 'linear-gradient(to bottom, #FCEFD8 0%, #FBF5EC 100%)' }}>
          <div className="container-page py-16 sm:py-20">
            <div className="text-center mb-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-saffron-700 mb-2">
                {locale === 'hi' ? 'महाकालेश्वर उज्जैन में अनुष्ठान' : 'Rituals at Mahakaleshwar Ujjain'}
              </p>
              <h2 className={`font-bold text-maroon ${locale === 'hi' ? 'font-sanskrit' : 'font-serif'}`}
                style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)' }}>
                {locale === 'hi' ? 'पवित्र पूजाएँ' : 'Sacred Pujas'}
              </h2>
              <div className="mt-3 mx-auto w-14 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {[
                { slug: 'kaal-sarp-dosh-nivaran', hi: 'काल सर्प दोष निवारण', en: 'Kaal Sarp Dosh Nivaran', symbol: '🐍', mantra: 'ॐ नमः शिवाय' },
                { slug: 'mahamrityunjaya-puja', hi: 'महामृत्युंजय पूजा', en: 'Mahamrityunjaya Puja', symbol: '🔱', mantra: 'ॐ त्र्यम्बकं यजामहे' },
                { slug: 'mangal-dosh-nivaran', hi: 'मंगल दोष निवारण', en: 'Mangal Dosh Nivaran', symbol: '⭐', mantra: 'ॐ अं अंगारकाय नमः' },
                { slug: 'navgrah-shanti', hi: 'नवग्रह शांति', en: 'Navgrah Shanti', symbol: '🌐', mantra: 'ॐ नवग्रहाय नमः' },
                { slug: 'pitru-dosh-nivaran', hi: 'पितृ दोष निवारण', en: 'Pitru Dosh Nivaran', symbol: '🪔', mantra: 'ॐ पितृभ्यो नमः' },
              ].map((p) => (
                <Link key={p.slug} to={`${prefix}/puja-in-ujjain/${p.slug}/`}
                  className="group relative flex flex-col rounded-xl overflow-hidden bg-white border border-gold/30
                    shadow-sm hover:border-gold/60 transition-all duration-300 hover:-translate-y-1
                    hover:shadow-[0_14px_40px_rgba(139,26,26,0.12)]">
                  <div className="h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent" />
                  <div className="p-6 flex flex-col items-center text-center flex-1">
                    <span className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{p.symbol}</span>
                    <h3 className="font-sanskrit font-bold text-maroon leading-snug mb-1"
                      style={{ fontSize: 'clamp(0.95rem, 2vw, 1.2rem)' }}>
                      {locale === 'hi' ? p.hi : p.en}
                    </h3>
                    <p className="text-saffron-700 text-[11px] italic mb-5">{p.mantra}</p>
                    <div className="h-px w-10 bg-gold/40 mb-5" />
                    <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-maroon/50 group-hover:text-maroon transition-colors">
                      {locale === 'hi' ? 'जानकारी देखें' : 'View Details'}
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link to={`${prefix}/puja-in-ujjain/`}
                className="inline-flex items-center gap-2 rounded-full border border-maroon/30 px-6 py-2.5 text-sm font-semibold text-maroon hover:border-maroon hover:bg-maroon hover:text-white transition-all">
                {locale === 'hi' ? 'सभी पूजाएँ देखें' : 'View all pujas'}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* FEATURED MANDIRS */}
        <section id="mandirs" className="bg-cream">
          <div className="container-page py-16 sm:py-20">
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-700">
                  {t.featuredEyebrow}
                </p>
                <h2 className={`mt-2 font-bold text-maroon ${locale === 'hi' ? 'font-sanskrit' : 'font-serif'} text-3xl sm:text-4xl`}>
                  {t.featuredTitle}
                </h2>
              </div>
              <Link
                to={`${prefix}/mandirs/`}
                className="hidden text-sm font-semibold text-maroon underline-offset-4 hover:underline sm:inline-flex sm:items-center sm:gap-1"
              >
                {t.featuredCta} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredMandirs.slice(0, 6).map((m) => (
                <MandirCard key={m.slug} mandir={m} />
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link to={`${prefix}/mandirs/`} className="inline-flex items-center gap-1 text-sm font-semibold text-maroon">
                {t.featuredCta} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── LEAD FORM — main enquiry CTA ─────────────────────────────── */}
        <GlobalLeadSection sourcePage="home" defaultService="darshanPlan" />

        {/* ── EDITORIAL ABOUT UJJAIN — SEO-rich content ────────────────── */}
        <section id="about-ujjain" className="bg-white">
          <div className="container-page py-16 sm:py-20">
            <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-700">
                  {t.section2Eyebrow}
                </p>
                <h2 className={`mt-3 font-bold text-maroon ${locale === 'hi' ? 'font-sanskrit' : 'font-serif'} text-3xl sm:text-4xl leading-tight`}>
                  {t.section2Title}
                </h2>
              </div>
              <div className="space-y-5 text-base leading-[1.75] text-ink-soft sm:text-lg">
                <p>{t.section2P1}</p>
                <p>{t.section2P2}</p>
                <p>{t.section2P3}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── STARTUP INDIA EIR — deep trust signal ────────────────────── */}
        <section id="trust" className="bg-cream-dark/50">
          <div className="container-page py-10 sm:py-14">
            <div className="grid items-center gap-6 sm:grid-cols-[auto_1fr] sm:gap-10">
              <a
                href="/images/trust/eir-startup-india.jpg"
                className="block overflow-hidden rounded-lg border border-gold/40 shadow-md transition-transform hover:scale-[1.02]"
                aria-label={locale === 'hi' ? 'Startup India EIR योजना के अंतर्गत भारत सरकार से प्रथम अनुदान' : 'First grant under Startup India EIR scheme from Govt of India'}
              >
                <img
                  src="/images/trust/eir-startup-india.jpg"
                  alt={locale === 'hi' ? 'Startup India EIR योजना के अंतर्गत भारत सरकार से प्रथम अनुदान — बाइटफ़्लो टेक्नोलॉजीज़' : 'First grant under Startup India EIR scheme — ByteFlow Technologies'}
                  className="h-auto w-full max-w-[280px] sm:max-w-[320px]"
                  loading="lazy"
                />
              </a>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-700">
                  {locale === 'hi' ? 'मान्यता एवं सम्मान' : 'Recognition & Honours'}
                </p>
                <h2 className={`mt-2 font-bold text-maroon ${locale === 'hi' ? 'font-sanskrit text-2xl sm:text-3xl' : 'font-serif text-xl sm:text-2xl'}`}>
                  {locale === 'hi'
                    ? <>राज्य स्तरीय <span className="text-saffron-700">MSME Conclave</span> में सम्मानित</>
                    : <>Recognised at the State-level <span className="italic text-saffron-700">MSME Conclave</span></>}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-base">
                  {locale === 'hi'
                    ? 'हमारी संस्थापक प्रियंका शिवहरे को राज्य स्तरीय MSME Conclave, भोपाल में वैदिक सेवाओं में डिजिटल नवाचार के लिए सम्मानित किया गया — दोष निवारण पूजाएँ देश-विदेश के श्रद्धालुओं तक पहुँचाने के लिए।'
                    : "Our founder Priyanka Shivhare was recognised at the State-level MSME Conclave, Bhopal for digital innovation in Vedic services — bringing dosh nivaran pujas to devotees across India and Indians living abroad."}
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 max-w-2xl">
                  <div className="rounded-lg border border-gold/30 bg-white px-4 py-3">
                    <p className="text-[13px] font-bold text-maroon">
                      {locale === 'hi' ? 'DPIIT पंजीकृत स्टार्टअप' : 'DPIIT-Registered Startup'}
                    </p>
                    <p className="text-[11px] text-ink-mute mt-1">
                      {locale === 'hi' ? 'भारत सरकार · Startup India पहल' : 'Government of India · Startup India initiative'}
                    </p>
                  </div>
                  <div className="rounded-lg border border-gold/30 bg-white px-4 py-3">
                    <p className="text-[13px] font-bold text-maroon">
                      {locale === 'hi' ? 'राष्ट्रीय प्रेस में प्रकाशित' : 'Featured in National Press'}
                    </p>
                    <p className="text-[11px] text-ink-mute mt-1">
                      Dainik Bhaskar · Patrika · Shivhare Vaani
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MANDALA DIVIDER */}
        <MandalaDivider />

        {/* ── CALL FLOATING BUTTON ──────────────────────────────────────── */}
        <a href="tel:+917400724456"
          aria-label={locale === 'hi' ? 'अभी कॉल करें' : 'Call Now'}
          className="fixed bottom-6 right-5 z-50 flex items-center gap-2.5 rounded-full
            bg-gold py-3.5 pl-4 pr-5 text-maroon-900 font-bold
            shadow-[0_6px_28px_rgba(201,162,39,0.50)]
            transition-all duration-200 hover:-translate-y-1
            hover:shadow-[0_10px_36px_rgba(201,162,39,0.65)]">
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-maroon-900 flex-shrink-0">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
          <span className="text-sm hidden sm:block">
            {locale === 'hi' ? 'अभी कॉल करें' : 'Call Now'}
          </span>
        </a>
      </Layout>
    </>
  );
}
