import { useState } from 'react';
import { Layout } from '../components/global/Layout';
import { SEOHead } from '../components/global/SEOHead';
import { GlobalLeadSection } from '../components/global/GlobalLeadSection';
import { Breadcrumb } from '../components/global/Breadcrumb';
import { useI18n } from '../i18n';
import { SITE } from '../lib/site';
import { breadcrumbSchema, faqSchema } from '../lib/schemas';
import { PhoneCall, ArrowRight, Train, Bus, Car, Plane, MapPin, Clock, ChevronDown } from 'lucide-react';

// ─── SEO: Top 20 target keywords naturally embedded in content ───
// 1. उज्जैन कैसे पहुंचें  2. Ujjain transport guide  3. Indore to Ujjain cab
// 4. इंदौर से उज्जैन      5. Ujjain cab booking      6. Bhopal to Ujjain
// 7. भोपाल से उज्जैन      8. Delhi to Ujjain train   9. उज्जैन ट्रेन
// 10. Ujjain local transport 11. Mahakal temple cab   12. महाकाल कैब बुकिंग
// 13. उज्जैन बस             14. Simhastha 2028 transport 15. Ujjain airport
// 16. Indore to Ujjain distance 17. Ujjain taxi service   18. उज्जैन यातायात
// 19. उज्जैन दर्शन कैब      20. उज्जैन ऑटो रिक्शा

// ─── Data ─────────────────────────────────────────────────────────
const ROUTES = [
  { fromHi: 'इंदौर', fromEn: 'Indore', km: 55, timeHi: '1.5 घंटे', timeEn: '1.5 hrs', byHi: 'कैब / बस', byEn: 'Cab / Bus', color: '#D4621A' },
  { fromHi: 'भोपाल', fromEn: 'Bhopal', km: 195, timeHi: '3.5–4 घंटे', timeEn: '3.5–4 hrs', byHi: 'ट्रेन / बस', byEn: 'Train / Bus', color: '#8B1A1A' },
  { fromHi: 'दिल्ली', fromEn: 'Delhi', km: 785, timeHi: '10–12 घंटे (ट्रेन)', timeEn: '10–12 hrs (train)', byHi: 'ट्रेन / फ्लाइट', byEn: 'Train / Flight', color: '#C9A84C' },
  { fromHi: 'मुम्बई', fromEn: 'Mumbai', km: 615, timeHi: '8–9 घंटे (ट्रेन)', timeEn: '8–9 hrs (train)', byHi: 'ट्रेन / बस', byEn: 'Train / Bus', color: '#7E682A' },
  { fromHi: 'अहमदाबाद', fromEn: 'Ahmedabad', km: 400, timeHi: '6–7 घंटे', timeEn: '6–7 hrs', byHi: 'ट्रेन / बस', byEn: 'Train / Bus', color: '#B8501A' },
  { fromHi: 'जयपुर', fromEn: 'Jaipur', km: 485, timeHi: '8–9 घंटे', timeEn: '8–9 hrs', byHi: 'ट्रेन / बस', byEn: 'Train / Bus', color: '#5E1010' },
];

const MODES = [
  {
    icon: Train,
    titleHi: 'ट्रेन से उज्जैन',
    titleEn: 'By Train',
    stationHi: 'उज्जैन जंक्शन (UJN)',
    stationEn: 'Ujjain Junction (UJN)',
    pointsHi: [
      'दिल्ली, मुम्बई, अहमदाबाद, चेन्नई से सीधी ट्रेनें',
      'प्रमुख ट्रेनें: मालवा एक्सप्रेस, इंदौर-पटना एक्सप्रेस, अवंतिका एक्सप्रेस',
      'स्टेशन से महाकालेश्वर: 2 किमी (ऑटो / कैब)',
      'सिंहस्थ 2028: अतिरिक्त विशेष ट्रेनें चलेंगी',
    ],
    pointsEn: [
      'Direct trains from Delhi, Mumbai, Ahmedabad, Chennai',
      'Key trains: Malwa Express, Indore-Patna Express, Avantika Express',
      'Station to Mahakaleshwar: 2 km (auto / cab)',
      'Simhastha 2028: extra special trains will run',
    ],
    color: '#8B1A1A',
  },
  {
    icon: Bus,
    titleHi: 'बस से उज्जैन',
    titleEn: 'By Bus',
    stationHi: 'देवास नाका बस स्टैंड',
    stationEn: 'Dewas Naka Bus Stand',
    pointsHi: [
      'इंदौर से हर 20 मिनट में AC / Non-AC बस',
      'भोपाल: MPSRTC वोल्वो, 4 घंटे',
      'अहमदाबाद, जयपुर से रात्रि बसें उपलब्ध',
      'बस स्टैंड से महाकाल: 4 किमी (ऑटो)',
    ],
    pointsEn: [
      'Indore: AC / Non-AC bus every 20 minutes',
      'Bhopal: MPSRTC Volvo, 4 hours',
      'Overnight buses from Ahmedabad, Jaipur',
      'Bus stand to Mahakal: 4 km (auto)',
    ],
    color: '#D4621A',
  },
  {
    icon: Car,
    titleHi: 'कैब / कार से उज्जैन',
    titleEn: 'By Cab / Car',
    stationHi: 'NH 52 (इंदौर–उज्जैन 4-लेन)',
    stationEn: 'NH 52 (Indore–Ujjain 4-lane)',
    pointsHi: [
      'इंदौर से 55 किमी — सिर्फ 1.5 घंटे, टोल ₹75',
      'भोपाल से 195 किमी — 3.5–4 घंटे',
      'इंदौर एयरपोर्ट से सीधे उज्जैन कैब उपलब्ध',
      'उज्जैन टेम्पल कैब बुकिंग: +91 74007 24456',
    ],
    pointsEn: [
      'Indore: 55 km — just 1.5 hrs, toll ₹75',
      'Bhopal: 195 km — 3.5–4 hours',
      'Direct cab from Indore airport to Ujjain',
      'UjjainTemple cab booking: +91 74007 24456',
    ],
    color: '#C9A84C',
  },
  {
    icon: Plane,
    titleHi: 'हवाई जहाज से',
    titleEn: 'By Air',
    stationHi: 'इंदौर अंतर्राष्ट्रीय हवाई अड्डा (IDR)',
    stationEn: 'Indore International Airport (IDR)',
    pointsHi: [
      'इंदौर हवाई अड्डे से उज्जैन: 55 किमी',
      'दिल्ली, मुम्बई, हैदराबाद, बंगलोर से फ्लाइट',
      'हवाई अड्डे से उज्जैन कैब: ₹800–1,200',
      'सिंहस्थ 2028: चार्टर फ्लाइट्स की सम्भावना',
    ],
    pointsEn: [
      'Indore airport to Ujjain: 55 km',
      'Flights from Delhi, Mumbai, Hyderabad, Bangalore',
      'Airport cab to Ujjain: ₹800–1,200',
      'Simhastha 2028: charter flights expected',
    ],
    color: '#480C0C',
  },
];

const LOCAL = [
  { emojiHi: '🛺', titleHi: 'ऑटो रिक्शा', titleEn: 'Auto Rickshaw', descHi: 'मंदिरों के बीच सबसे लोकप्रिय। शेयर ऑटो ₹10–15, प्राइवेट ₹50–150।', descEn: 'Most popular for inter-temple travel. Shared auto ₹10–15, private ₹50–150.' },
  { emojiHi: '⚡', titleHi: 'ई-रिक्शा', titleEn: 'E-Rickshaw', descHi: 'शहर के अंदर सस्ता, पर्यावरण-अनुकूल। महाकाल क्षेत्र में भरपूर।', descEn: 'Cheap, eco-friendly for inner city. Abundant near Mahakal area.' },
  { emojiHi: '🚕', titleHi: 'लोकल कैब', titleEn: 'Local Cab', descHi: 'Ola / Uber + लोकल कैब। मंदिर दर्शन पैकेज ₹600–1,200 / दिन।', descEn: 'Ola / Uber + local cabs. Temple darshan package ₹600–1,200 / day.' },
  { emojiHi: '🚌', titleHi: 'सिटी बस', titleEn: 'City Bus', descHi: 'MPSRTC सिटी बस — प्रमुख रूटों पर। किराया ₹5–15 प्रति यात्रा।', descEn: 'MPSRTC city buses — on major routes. Fare ₹5–15 per trip.' },
];

const FAQS_HI = [
  {
    q: 'इंदौर से उज्जैन कैसे पहुंचें?',
    a: 'इंदौर से उज्जैन की दूरी 55 किमी है जो NH 52 पर 1.5 घंटे में तय होती है। कैब (₹600–800), बस (हर 20 मिनट, ₹60–120), ट्रेन (40 मिनट, ₹25 से) — तीनों विकल्प उपलब्ध हैं। इंदौर हवाई अड्डे से सीधे उज्जैन कैब बुकिंग के लिए +91 74007 24456 पर कॉल करें।',
  },
  {
    q: 'भोपाल से उज्जैन कैसे जाएं?',
    a: 'भोपाल से उज्जैन 195 किमी है। सबसे अच्छा विकल्प ट्रेन (अवंतिका एक्सप्रेस, 3.5 घंटे, ₹100–400) या MPSRTC वोल्वो बस (4 घंटे, ₹180–250) है। कैब से 3.5 घंटे लगते हैं।',
  },
  {
    q: 'उज्जैन में मंदिर दर्शन के लिए कौन सा लोकल ट्रांसपोर्ट सबसे अच्छा है?',
    a: 'उज्जैन दर्शन के लिए प्राइवेट कैब पैकेज (₹600–1,200 / दिन) सबसे सुविधाजनक है। इसमें महाकालेश्वर, काल भैरव, हरसिद्धि, मंगलनाथ — सब मंदिर कवर होते हैं। ऑटो रिक्शा भी ₹50–150 प्रति स्थान उपलब्ध है। बुकिंग के लिए +91 74007 24456।',
  },
  {
    q: 'दिल्ली से उज्जैन कैसे पहुंचें?',
    a: 'दिल्ली से उज्जैन 785 किमी है। ट्रेन सबसे आरामदायक — मालवा एक्सप्रेस (12 घंटे) या अवंतिका एक्सप्रेस सुबह उज्जैन पहुंचाती है। फ्लाइट से इंदौर (1.5 घंटे) फिर कैब से 55 किमी।',
  },
  {
    q: 'सिंहस्थ 2028 के दौरान उज्जैन कैसे पहुंचें?',
    a: 'सिंहस्थ 2028 (09 अप्रैल–08 मई 2028) में 30 करोड़+ श्रद्धालु आएंगे। विशेष ट्रेनें और बसें चलेंगी। शाही स्नान दिवसों पर ट्रांसपोर्ट बहुत सीमित होगा। 3–4 माह पहले बुकिंग करें। सहायता: +91 74007 24456।',
  },
  {
    q: 'उज्जैन जंक्शन से महाकालेश्वर कितनी दूर है?',
    a: 'उज्जैन जंक्शन (UJN) से महाकालेश्वर मंदिर 2 किमी है — ऑटो से 10 मिनट (₹30–50) या पैदल 20–25 मिनट। कैब भी आसानी से मिलती है।',
  },
];

const FAQS_EN = [
  {
    q: 'How to reach Ujjain from Indore?',
    a: 'Indore to Ujjain is 55 km via NH 52, taking 1.5 hours. Options: cab (₹600–800), bus (every 20 minutes, ₹60–120), train (40 minutes, from ₹25). For direct cab from Indore airport to Ujjain, call +91 74007 24456.',
  },
  {
    q: 'How to reach Ujjain from Bhopal?',
    a: 'Bhopal to Ujjain is 195 km. Best options: train (Avantika Express, 3.5 hours, ₹100–400) or MPSRTC Volvo bus (4 hours, ₹180–250). Cab takes 3.5 hours.',
  },
  {
    q: 'Which local transport is best for temple darshan in Ujjain?',
    a: 'A private cab package (₹600–1,200 / day) is the most convenient for Ujjain darshan. It covers Mahakaleshwar, Kal Bhairav, Harsiddhi, Mangalnath and more. Auto rickshaws are also available at ₹50–150 per spot. For booking call +91 74007 24456.',
  },
  {
    q: 'How to reach Ujjain from Delhi?',
    a: 'Delhi to Ujjain is 785 km. Train is most comfortable — Malwa Express (12 hours) or Avantika Express arrives in the morning. By flight: Indore (1.5 hours) then 55 km by cab.',
  },
  {
    q: 'How to reach Ujjain during Simhastha 2028?',
    a: 'Simhastha 2028 (09 April–08 May 2028) expects 12 crore+ pilgrims. Special trains and buses will run. Transport on Shahi Snan days will be very limited. Book 3–4 months ahead. Help: +91 74007 24456.',
  },
  {
    q: 'How far is Mahakaleshwar from Ujjain Junction?',
    a: 'Ujjain Junction (UJN) to Mahakaleshwar temple is 2 km — 10 minutes by auto (₹30–50) or 20–25 minutes on foot. Cabs are also easily available.',
  },
];

// ─── Component ────────────────────────────────────────────────────
export function TransportLanding() {
  const { locale } = useI18n();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = locale === 'hi' ? FAQS_HI : FAQS_EN;
  const title = locale === 'hi'
    ? 'उज्जैन कैसे पहुंचें — ट्रेन, बस, कैब, फ्लाइट पूरी गाइड'
    : 'How to Reach Ujjain — Train, Bus, Cab, Flight Complete Guide';
  const description = locale === 'hi'
    ? 'उज्जैन यातायात गाइड — इंदौर से 55 किमी, भोपाल 195 किमी, दिल्ली से ट्रेन, बस टाइमिंग, कैब बुकिंग, लोकल ऑटो। महाकाल दर्शन + सिंहस्थ 2028 ट्रांसपोर्ट। सहायता: +91 74007 24456'
    : 'Ujjain transport guide — 55 km from Indore, 195 km Bhopal, Delhi train, bus timings, cab booking, local auto. Mahakal darshan + Simhastha 2028 transport. Help: +91 74007 24456';

  const pageSchemas = [
    breadcrumbSchema({ items: [
      { name: locale === 'hi' ? 'होम' : 'Home', url: SITE.url },
      { name: locale === 'hi' ? 'उज्जैन यातायात' : 'Ujjain Transport', url: `${SITE.url}/transport-in-ujjain/` },
    ] }),
    faqSchema(faqs.map((f) => ({ q: f.q, a: f.a }))),
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description,
      url: `${SITE.url}/transport-in-ujjain/`,
      mainEntity: {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    },
  ];

  return (
    <>
      <SEOHead
        title={`${title} | UjjainTemple — ${SITE.phone}`}
        description={description}
        path="/transport-in-ujjain/"
        locale={locale}
        schemas={pageSchemas}
      />
      <Layout>

        {/* ═══════════════════════════════════
            HERO
        ═══════════════════════════════════ */}
        <section
          className="relative overflow-hidden border-b-[6px] border-gold py-20 sm:py-28"
          style={{ background: 'linear-gradient(160deg, #1a0404 0%, #2f0707 45%, #200505 100%)' }}
        >
          <div className="absolute inset-0 opacity-[0.06]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A84C' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 70%)' }} />

          <div className="relative z-10 container-page max-w-4xl mx-auto text-center flex flex-col items-center gap-6 px-4">
            <div className="inline-flex items-center gap-2 border border-gold/30 rounded-full px-5 py-2" style={{ background: 'rgba(201,168,76,0.08)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-gold-light" />
              <span className="text-gold-light font-serif tracking-[0.25em] uppercase text-xs sm:text-sm">
                {locale === 'hi' ? 'पूरी यातायात मार्गदर्शिका' : 'Complete Transport Guide'}
              </span>
            </div>

            <h1 className="font-serif font-extrabold text-white leading-tight" style={{ fontSize: 'clamp(2.2rem, 6vw, 4.5rem)' }}>
              {locale === 'hi'
                ? 'उज्जैन कैसे पहुंचें?'
                : 'How to Reach Ujjain?'}
            </h1>

            <p className="text-cream/70 font-serif italic text-base sm:text-xl max-w-3xl leading-relaxed">
              {locale === 'hi'
                ? 'इंदौर · भोपाल · दिल्ली · मुम्बई · अहमदाबाद — ट्रेन, बस, कैब, फ्लाइट — हर रूट की पूरी जानकारी'
                : 'Indore · Bhopal · Delhi · Mumbai · Ahmedabad — train, bus, cab, flight — every route covered'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a href={SITE.phoneTel}
                className="inline-flex items-center justify-center gap-3 font-bold px-7 py-4 rounded-full text-base transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg,#E0C374,#C9A84C)', color: '#1a0404', boxShadow: '0 0 35px rgba(201,168,76,0.30)' }}>
                <PhoneCall className="w-5 h-5" />
                {locale === 'hi' ? 'कैब बुकिंग — कॉल करें' : 'Book Cab — Call Now'}
              </a>
              <a href="#routes"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-base font-semibold transition-all"
                style={{ border: '1.5px solid rgba(201,168,76,0.40)', color: '#E0C374', background: 'rgba(201,168,76,0.06)' }}>
                {locale === 'hi' ? 'रूट देखें' : 'View Routes'}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Breadcrumb */}
        <div className="bg-cream-light py-4 border-b border-cream">
          <div className="container-page">
            <Breadcrumb items={[{ label: locale === 'hi' ? 'उज्जैन यातायात' : 'Ujjain Transport' }]} />
          </div>
        </div>

        {/* ═══════════════════════════════════
            QUICK DISTANCE TABLE (dark bar)
        ═══════════════════════════════════ */}
        <section id="routes" style={{ background: '#200505', borderBottom: '1px solid rgba(201,168,76,0.18)' }}>
          <div className="container-page py-10 sm:py-12">
            <p className="text-center text-gold/60 text-xs tracking-[0.3em] uppercase mb-8">
              {locale === 'hi' ? '— प्रमुख शहरों से दूरी और समय —' : '— Distance & Time from Major Cities —'}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {ROUTES.map((r) => (
                <div key={r.fromEn}
                  className="flex flex-col items-center text-center p-4 rounded-xl border"
                  style={{ background: 'rgba(48,7,7,0.7)', borderColor: `${r.color}35` }}>
                  <span className="font-serif font-extrabold text-xl mb-1" style={{ color: r.color }}>
                    {locale === 'hi' ? r.fromHi : r.fromEn}
                  </span>
                  <span className="text-gold-light font-bold text-2xl">{r.km} <span className="text-sm font-normal text-cream/50">km</span></span>
                  <span className="text-cream/55 text-xs mt-1">{locale === 'hi' ? r.timeHi : r.timeEn}</span>
                  <span className="text-xs mt-1 px-2 py-0.5 rounded-full" style={{ background: `${r.color}25`, color: r.color }}>
                    {locale === 'hi' ? r.byHi : r.byEn}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════
            TRANSPORT MODES — 4 cards
        ═══════════════════════════════════ */}
        <section className="bg-cream-light py-16 sm:py-24 border-b border-cream-dark">
          <div className="container-page max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-saffron-700 font-serif text-sm tracking-[0.3em] uppercase mb-3">
                {locale === 'hi' ? '— कैसे पहुंचें —' : '— How to Get Here —'}
              </p>
              <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-maroon">
                {locale === 'hi' ? 'यातायात के साधन' : 'Transport Options'}
              </h2>
              <div className="w-20 h-1 mx-auto mt-4 rounded-full" style={{ background: 'linear-gradient(90deg,#D4621A,#C9A84C)' }} />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {MODES.map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.titleEn}
                    className="bg-white rounded-2xl overflow-hidden border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    style={{ borderColor: `${m.color}30` }}>
                    {/* Card header */}
                    <div className="px-7 py-5 flex items-center gap-4" style={{ background: `${m.color}12` }}>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: m.color }}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl font-extrabold" style={{ color: m.color }}>
                          {locale === 'hi' ? m.titleHi : m.titleEn}
                        </h3>
                        <p className="text-xs text-ink-mute flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {locale === 'hi' ? m.stationHi : m.stationEn}
                        </p>
                      </div>
                    </div>
                    {/* Points */}
                    <ul className="px-7 py-5 space-y-3">
                      {(locale === 'hi' ? m.pointsHi : m.pointsEn).map((pt, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2" style={{ background: m.color }} />
                          <span className="text-ink-soft text-sm sm:text-base leading-snug">{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════
            LOCAL TRANSPORT IN UJJAIN
        ═══════════════════════════════════ */}
        <section className="bg-white py-16 sm:py-24 border-b border-cream">
          <div className="container-page max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-saffron-700 font-serif text-sm tracking-[0.3em] uppercase mb-3">
                {locale === 'hi' ? '— शहर के अंदर —' : '— Within the City —'}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-maroon">
                {locale === 'hi' ? 'उज्जैन में लोकल यातायात' : 'Local Transport in Ujjain'}
              </h2>
              <div className="w-20 h-1 mx-auto mt-4 rounded-full" style={{ background: 'linear-gradient(90deg,#D4621A,#C9A84C)' }} />
              <p className="text-ink-soft font-serif italic text-base mt-5 max-w-2xl mx-auto">
                {locale === 'hi'
                  ? 'महाकालेश्वर, काल भैरव, हरसिद्धि — सभी मंदिर दर्शन के लिए'
                  : 'For darshan at Mahakaleshwar, Kal Bhairav, Harsiddhi and all temples'}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {LOCAL.map((l) => (
                <div key={l.titleEn}
                  className="bg-cream-light border border-cream rounded-2xl p-6 text-center hover:border-saffron/40 hover:shadow-md transition-all duration-300 group">
                  <div className="text-4xl mb-4">{l.emojiHi}</div>
                  <h3 className="font-serif font-bold text-maroon text-lg mb-2 group-hover:text-saffron-700 transition-colors">
                    {locale === 'hi' ? l.titleHi : l.titleEn}
                  </h3>
                  <p className="text-ink-soft text-sm leading-relaxed">
                    {locale === 'hi' ? l.descHi : l.descEn}
                  </p>
                </div>
              ))}
            </div>

            {/* Darshan package CTA */}
            <div className="mt-12 rounded-2xl p-7 sm:p-9 flex flex-col sm:flex-row items-center justify-between gap-6"
              style={{ background: 'linear-gradient(135deg,#2f0707,#1a0404)', border: '1.5px solid rgba(201,168,76,0.35)' }}>
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold mb-2" style={{ color: '#E0C374' }}>
                  {locale === 'hi' ? 'उज्जैन दर्शन कैब पैकेज' : 'Ujjain Darshan Cab Package'}
                </h3>
                <p className="text-cream/65 text-sm sm:text-base">
                  {locale === 'hi'
                    ? 'सभी प्रमुख मंदिर एक ही दिन — ₹600 से शुरू। एसी कार, अनुभवी ड्राइवर, मंदिर क्रम सहित।'
                    : 'All major temples in one day — from ₹600. AC car, experienced driver, temple sequence included.'}
                </p>
              </div>
              <a href={SITE.phoneTel}
                className="inline-flex items-center gap-3 font-bold px-7 py-4 rounded-full text-base whitespace-nowrap transition-all hover:scale-105 flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#E0C374,#C9A84C)', color: '#1a0404', boxShadow: '0 0 25px rgba(201,168,76,0.25)' }}>
                <PhoneCall className="w-5 h-5" />
                {locale === 'hi' ? 'कैब बुक करें' : 'Book Cab'}
              </a>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════
            SIMHASTHA 2028 TRANSPORT ALERT
        ═══════════════════════════════════ */}
        <section style={{ background: 'linear-gradient(135deg,#2f0707,#200505)', borderTop: '1px solid rgba(201,168,76,0.20)', borderBottom: '1px solid rgba(201,168,76,0.20)' }}>
          <div className="container-page max-w-4xl mx-auto py-12 sm:py-16 text-center flex flex-col items-center gap-6">
            <div className="inline-flex items-center gap-2 border border-gold/40 rounded-full px-5 py-2" style={{ background: 'rgba(201,168,76,0.08)' }}>
              <span className="text-gold animate-pulse">⚠</span>
              <span className="text-gold-light text-sm font-serif tracking-[0.2em] uppercase">Simhastha 2028</span>
            </div>
            <h2 className="font-serif font-extrabold leading-tight" style={{ fontSize: 'clamp(1.6rem,4vw,2.8rem)', color: '#E0C374' }}>
              {locale === 'hi'
                ? 'सिंहस्थ 2028 यातायात — अभी से तैयारी करें'
                : 'Simhastha 2028 Transport — Plan Right Now'}
            </h2>
            <p className="text-cream/70 font-serif italic text-base sm:text-lg max-w-2xl leading-relaxed">
              {locale === 'hi'
                ? '09 अप्रैल — 08 मई 2028 को 30 करोड़+ श्रद्धालु उज्जैन आएंगे। शाही स्नान के दिनों में ट्रेन, बस, कैब — सब बुक हो जाएंगे। अभी से बुकिंग करें।'
                : '12 crore+ pilgrims will visit Ujjain from 09 April – 08 May 2028. On Shahi Snan dates, trains, buses, cabs — all will be booked. Reserve now.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={SITE.phoneTel}
                className="inline-flex items-center justify-center gap-3 font-bold px-8 py-4 rounded-full text-base transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg,#E0C374,#C9A84C)', color: '#1a0404', boxShadow: '0 0 35px rgba(201,168,76,0.30)' }}>
                <PhoneCall className="w-5 h-5" /> {locale === 'hi' ? 'सिंहस्थ ट्रांसपोर्ट बुकिंग' : 'Simhastha Transport Booking'}
              </a>
              <a href="/simhastha-2028/"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-all"
                style={{ border: '1.5px solid rgba(201,168,76,0.40)', color: '#E0C374', background: 'rgba(201,168,76,0.06)' }}>
                {locale === 'hi' ? 'सिंहस्थ गाइड देखें' : 'View Simhastha Guide'}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════
            FAQ — SEO Rich Snippets
        ═══════════════════════════════════ */}
        <section className="bg-cream-light py-16 sm:py-24 border-b border-cream-dark">
          <div className="container-page max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-saffron-700 font-serif text-sm tracking-[0.3em] uppercase mb-3">
                {locale === 'hi' ? '— अक्सर पूछे जाने वाले प्रश्न —' : '— Frequently Asked Questions —'}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-maroon">
                {locale === 'hi' ? 'यात्रा के सामान्य प्रश्न' : 'Travel FAQs'}
              </h2>
              <div className="w-20 h-1 mx-auto mt-4 rounded-full" style={{ background: 'linear-gradient(90deg,#D4621A,#C9A84C)' }} />
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="rounded-xl overflow-hidden border border-cream shadow-sm bg-white">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full text-left px-6 py-5 flex justify-between items-center gap-4 hover:bg-cream/30 transition-colors"
                  >
                    <span className="font-serif font-bold text-base sm:text-lg text-maroon leading-snug">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-saffron flex-shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === idx && (
                    <div className="px-6 pb-6 pt-2 text-ink-soft text-sm sm:text-base leading-relaxed font-serif border-t border-cream animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════
            LEAD CTA
        ═══════════════════════════════════ */}
        <GlobalLeadSection sourcePage="transport-landing" defaultService="transport" />

      </Layout>
    </>
  );
}

