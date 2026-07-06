import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/global/Layout';
import { SEOHead } from '../components/global/SEOHead';
import { GlobalLeadSection } from '../components/global/GlobalLeadSection';
import { Breadcrumb } from '../components/global/Breadcrumb';
import { useI18n } from '../i18n';
import { articlesByCategory, articlePath } from '../data/articles';
import { SITE } from '../lib/site';
import { breadcrumbSchema, faqSchema, pujaServiceSchema } from '../lib/schemas';
import { PhoneCall, ArrowRight, CheckCircle2, ChevronDown, Star } from 'lucide-react';

// ─── Data ─────────────────────────────────────────────────────────
const TRUST_STATS = [
  { numHi: '15+', numEn: '15+', labelHi: 'वर्ष अनुभव', labelEn: 'Years Experience' },
  { numHi: '10,000+', numEn: '10,000+', labelHi: 'पूजा सम्पन्न', labelEn: 'Pujas Performed' },
  { numHi: '100%', numEn: '100%', labelHi: 'वैदिक विधि', labelEn: 'Vedic Vidhi' },
  { numHi: '₹3,100', numEn: '₹3,100', labelHi: 'से शुरू', labelEn: 'Starting' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    titleHi: 'कॉल / मैसेज करें',
    titleEn: 'Call or Message',
    descHi: 'अपनी पूजा आवश्यकता, तारीख और बजट बताएं। हमारे पंडित आपसे बात करेंगे।',
    descEn: 'Tell us your puja requirement, preferred date and budget. Our pandit will speak with you.',
  },
  {
    step: '02',
    titleHi: 'पूजा योजना बनाएँ',
    titleEn: 'Plan the Puja',
    descHi: 'विशेषज्ञ पंडित आपकी कुंडली / आवश्यकता के अनुसार सही विधि, सामग्री और मुहूर्त तय करेंगे।',
    descEn: 'Expert pandit determines the correct vidhi, samagri and muhurta per your kundli or requirement.',
  },
  {
    step: '03',
    titleHi: 'पूजा संपन्न',
    titleEn: 'Puja Performed',
    descHi: 'उज्जैन के पवित्र मंदिर में विधिवत वैदिक पूजा। आप उपस्थित रहें या ऑनलाइन देखें।',
    descEn: 'Proper Vedic puja at a sacred Ujjain temple. Attend in person or watch online.',
  },
];

const WHY_POINTS = [
  { hi: 'मंगलनाथ — मंगल ग्रह की जन्मभूमि', en: 'Mangalnath — birthplace of planet Mars' },
  { hi: 'महाकालेश्वर — काल के स्वामी', en: 'Mahakaleshwar — Lord of Time itself' },
  { hi: 'सिद्धवट — पितृ तर्पण का पवित्रतम स्थान', en: 'Siddha Vat — most sacred for Pitru Tarpan' },
  { hi: 'त्र्यम्बकेश्वर — काल सर्प शांति', en: 'Tryambakeshwar — Kaal Sarp Shanti' },
  { hi: '12 ज्योतिर्लिंगों में शामिल', en: 'One of 12 sacred Jyotirlingas' },
  { hi: 'हर पूजा का फल यहाँ कई गुना अधिक', en: 'Every puja\'s fruit is multiplied here' },
];

const TESTIMONIALS = [
  {
    nameHi: 'राजेश शर्मा', nameEn: 'Rajesh Sharma',
    cityHi: 'दिल्ली', cityEn: 'Delhi',
    pujaHi: 'काल सर्प दोष निवारण', pujaEn: 'Kaal Sarp Dosh Nivaran',
    textHi: 'पूजा के बाद जीवन में सकारात्मक बदलाव आया। पंडित जी ने बहुत विधिवत और श्रद्धा से पूजा कराई। उज्जैन टेम्पल की सेवा उत्तम है।',
    textEn: 'There were positive changes in life after the puja. The panditji performed it very methodically and devoutly. UjjainTemple service is excellent.',
    stars: 5,
  },
  {
    nameHi: 'सुनीता देवी', nameEn: 'Sunita Devi',
    cityHi: 'मुम्बई', cityEn: 'Mumbai',
    pujaHi: 'मंगल दोष निवारण', pujaEn: 'Mangal Dosh Nivaran',
    textHi: 'पुत्री के विवाह में बाधा थी। मंगलनाथ पर विधिवत पूजा के बाद योग बने। टीम ने हर कदम पर मार्गदर्शन किया।',
    textEn: 'There were obstacles in my daughter\'s marriage. The right yoga formed after the proper puja at Mangalnath. The team guided us at every step.',
    stars: 5,
  },
  {
    nameHi: 'अमित वर्मा', nameEn: 'Amit Verma',
    cityHi: 'भोपाल', cityEn: 'Bhopal',
    pujaHi: 'नवग्रह शांति', pujaEn: 'Navgrah Shanti',
    textHi: 'साढ़े साती बहुत कठिन थी। नवग्रह शांति पूजा के बाद धीरे-धीरे समस्याएं हल होने लगीं। पंडित जी बहुत अनुभवी हैं।',
    textEn: 'Sade Sati was very difficult. After the Navgrah Shanti puja, the problems gradually started resolving. The panditji is very experienced.',
    stars: 5,
  },
];

const FAQS = {
  hi: [
    { q: 'उज्जैन में पूजा बुकिंग कैसे करें?', a: '+91 74007 24456 पर कॉल या WhatsApp करें। पूजा का प्रकार, तारीख, और आपकी आवश्यकता बताएं। हमारे विशेषज्ञ पंडित आपको पूरी जानकारी देंगे और बुकिंग कन्फर्म करेंगे।' },
    { q: 'क्या मैं उज्जैन आए बिना पूजा करा सकता हूँ?', a: 'हाँ — ऑनलाइन पूजा की सुविधा है। पंडित जी पूजा करते हैं, आप WhatsApp Video Call पर लाइव देख सकते हैं। परन्तु स्वयं उपस्थित रहने का फल अधिक होता है।' },
    { q: 'पूजा की फीस कितनी है?', a: 'पूजा के प्रकार और विधि पर निर्भर: साधारण पूजा ₹3,100 से, मध्यम ₹7,100-15,000, और विशेष हवन-यज्ञ ₹21,000-51,000 तक। कॉल करने पर सटीक जानकारी दी जाएगी।' },
    { q: 'पूजा के लिए कौन से दस्तावेज चाहिए?', a: 'जन्म कुंडली (यदि ग्रह दोष संबंधी पूजा है), जन्म तिथि, नाम, और गोत्र। यदि कुंडली नहीं है तो भी पूजा होती है — केवल नाम-गोत्र पर्याप्त है।' },
    { q: 'क्या उज्जैन टेम्पल के पंडित प्रामाणिक हैं?', a: 'हाँ — हमारे सभी पंडित उज्जैन के मूल निवासी, 15+ वर्ष के अनुभव वाले, वैदिक परम्परा में प्रशिक्षित हैं। कोई कमीशन नहीं — सीधा पंडित-यजमान सम्बन्ध।' },
  ],
  en: [
    { q: 'How to book a puja in Ujjain?', a: 'Call or WhatsApp +91 74007 24456. Share the puja type, preferred date and your requirement. Our expert pandits will provide complete guidance and confirm the booking.' },
    { q: 'Can I get a puja done without coming to Ujjain?', a: 'Yes — online puja is available. The pandit performs the puja and you can watch live on WhatsApp Video Call. However, being personally present gives greater results.' },
    { q: 'What is the puja fee?', a: 'Depends on puja type and vidhi: basic puja from ₹3,100, medium ₹7,100-15,000, and special havan-yajna ₹21,000-51,000. Exact details given on call.' },
    { q: 'What documents are needed for the puja?', a: 'Birth horoscope (kundli) for planet-related pujas, birth date, name and gotra. If no kundli is available, the puja still proceeds — name and gotra suffice.' },
    { q: 'Are UjjainTemple pandits authentic?', a: 'Yes — all our pandits are Ujjain natives, with 15+ years experience, trained in the Vedic tradition. No middlemen — direct pandit-yajaman relationship.' },
  ],
};

// ─── Component ────────────────────────────────────────────────────
export function PujaLanding() {
  const { locale } = useI18n();
  const prefix = locale === 'en' ? '' : '/hi';
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const pujas = articlesByCategory('puja-info');
  const faqs = locale === 'hi' ? FAQS.hi : FAQS.en;

  const title = locale === 'hi'
    ? 'उज्जैन में पूजा — मंगल दोष, काल सर्प, नवग्रह शांति, पितृ दोष'
    : 'Puja in Ujjain — Mangal Dosh, Kaal Sarp, Navgrah Shanti, Pitru Dosh';
  const description = locale === 'hi'
    ? 'उज्जैन में पूजा — मंगल दोष निवारण, काल सर्प शांति, नवग्रह शांति, पितृ दोष, महामृत्युंजय। 15+ वर्ष, 10,000+ पूजा। प्रामाणिक वैदिक विधि। बुकिंग: +91 74007 24456'
    : 'Puja in Ujjain — Mangal Dosh Nivaran, Kaal Sarp Shanti, Navgrah Shanti, Pitru Dosh, Mahamrityunjaya. 15+ years, 10,000+ pujas. Authentic Vedic vidhi. Booking: +91 74007 24456';

  const schemas = [
    breadcrumbSchema({ items: [
      { name: locale === 'hi' ? 'होम' : 'Home', url: SITE.url },
      { name: locale === 'hi' ? 'उज्जैन में पूजा' : 'Puja in Ujjain', url: `${SITE.url}/puja-in-ujjain/` },
    ] }),
    faqSchema(faqs.map((f) => ({ q: f.q, a: f.a }))),
    pujaServiceSchema(),
  ];

  return (
    <>
      <SEOHead
        title={`${title} | UjjainTemple — ${SITE.phone}`}
        description={description}
        path="/puja-in-ujjain/"
        locale={locale}
        schemas={schemas}
      />
      <Layout>

        {/* ═══════════════════════════════════
            HERO
        ═══════════════════════════════════ */}
        <section
          className="relative overflow-hidden border-b-[6px] border-gold"
          style={{ background: 'linear-gradient(160deg, #1a0404 0%, #2f0707 45%, #200505 100%)', minHeight: '75vh', display: 'flex', alignItems: 'center' }}
        >
          {/* Pattern */}
          <div className="absolute inset-0 opacity-[0.06]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A84C' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 70%)' }} />

          {/* OM watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
            <span className="font-serif text-gold/[0.04]" style={{ fontSize: 'clamp(14rem,35vw,28rem)', lineHeight: 1 }}>ॐ</span>
          </div>

          <div className="relative z-10 container-page max-w-5xl mx-auto text-center py-20 sm:py-28 px-4 flex flex-col items-center gap-7">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-gold/30 rounded-full px-5 py-2" style={{ background: 'rgba(201,168,76,0.08)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-gold-light" />
              <span className="text-gold-light font-serif tracking-[0.25em] uppercase text-xs sm:text-sm">
                {locale === 'hi' ? 'उज्जैन — पूजा की पावन भूमि' : 'Ujjain — Sacred Land of Puja'}
              </span>
            </div>

            <h1 className="font-serif font-extrabold text-white leading-tight" style={{ fontSize: 'clamp(2.4rem,7vw,5rem)' }}>
              {locale === 'hi' ? 'उज्जैन में पूजा\nकराएँ — प्रामाणिक, वैदिक' : 'Authentic Vedic\nPuja in Ujjain'}
            </h1>

            <p className="text-cream/70 font-serif italic text-base sm:text-xl max-w-3xl leading-relaxed">
              {locale === 'hi'
                ? 'मंगल दोष · काल सर्प · नवग्रह शांति · पितृ दोष · महामृत्युंजय — हर दोष का निवारण, उज्जैन के विशेषज्ञ पंडितों द्वारा'
                : 'Mangal Dosh · Kaal Sarp · Navgrah Shanti · Pitru Dosh · Mahamrityunjaya — remedy for every dosh, by specialist Ujjain pandits'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a href={SITE.phoneTel}
                className="inline-flex items-center justify-center gap-3 font-bold px-8 py-4 rounded-full text-base sm:text-lg transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg,#E0C374,#C9A84C)', color: '#1a0404', boxShadow: '0 0 35px rgba(201,168,76,0.35)' }}>
                <PhoneCall className="w-5 h-5" />
                {locale === 'hi' ? 'पूजा बुकिंग — कॉल करें' : 'Book Puja — Call Now'}
              </a>
              <a href="#pujas"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-all"
                style={{ border: '1.5px solid rgba(201,168,76,0.40)', color: '#E0C374', background: 'rgba(201,168,76,0.06)' }}>
                {locale === 'hi' ? 'सभी पूजाएँ देखें' : 'View All Pujas'}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Inline trust strip */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 pt-4">
              {[
                locale === 'hi' ? '✓ 15+ वर्ष अनुभव' : '✓ 15+ Years Experience',
                locale === 'hi' ? '✓ 10,000+ पूजा सम्पन्न' : '✓ 10,000+ Pujas Done',
                locale === 'hi' ? '✓ ₹0 छुपी फीस' : '✓ ₹0 Hidden Charges',
                locale === 'hi' ? '✓ ऑनलाइन उपलब्ध' : '✓ Online Available',
              ].map((t, i) => (
                <span key={i} className="text-gold/60 text-xs sm:text-sm font-serif">{t}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Breadcrumb */}
        <div className="bg-cream-light py-4 border-b border-cream">
          <div className="container-page">
            <Breadcrumb items={[{ label: locale === 'hi' ? 'उज्जैन में पूजा' : 'Puja in Ujjain' }]} />
          </div>
        </div>

        {/* ═══════════════════════════════════
            TRUST STATS (dark)
        ═══════════════════════════════════ */}
        <section style={{ background: '#200505', borderBottom: '1px solid rgba(201,168,76,0.18)' }}>
          <div className="container-page">
            <div className="grid grid-cols-2 lg:grid-cols-4">
              {TRUST_STATS.map((s, i) => (
                <div key={i} className="flex flex-col items-center justify-center py-7 px-4 text-center gap-1"
                  style={{ borderRight: i < 3 ? '1px solid rgba(201,168,76,0.12)' : 'none', borderBottom: i < 2 ? '1px solid rgba(201,168,76,0.12)' : 'none' }}>
                  <span className="font-serif font-extrabold" style={{
                    fontSize: 'clamp(1.5rem,4vw,2.4rem)', lineHeight: 1,
                    background: 'linear-gradient(180deg,#E0C374,#C9A84C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  }}>
                    {locale === 'hi' ? s.numHi : s.numEn}
                  </span>
                  <span className="text-xs tracking-widest uppercase" style={{ color: 'rgba(251,245,236,0.45)' }}>
                    {locale === 'hi' ? s.labelHi : s.labelEn}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════
            ALL PUJAS GRID
        ═══════════════════════════════════ */}
        <section id="pujas" className="bg-cream-light py-16 sm:py-24 border-b border-cream-dark">
          <div className="container-page max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-saffron-700 font-serif text-sm tracking-[0.3em] uppercase mb-3">
                {locale === 'hi' ? '— दोष निवारण सेवाएँ —' : '— Dosh Nivaran Services —'}
              </p>
              <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-maroon">
                {locale === 'hi' ? 'सभी पूजाएँ' : 'All Pujas'}
              </h2>
              <div className="w-20 h-1 mx-auto mt-4 rounded-full" style={{ background: 'linear-gradient(90deg,#D4621A,#C9A84C)' }} />
              <p className="text-ink-soft font-serif italic text-base mt-5 max-w-2xl mx-auto">
                {locale === 'hi'
                  ? 'हर पूजा की विस्तृत जानकारी, विधि, लाभ और बुकिंग — नीचे अपनी पूजा चुनें'
                  : 'Detailed information, vidhi, benefits and booking for every puja — choose yours below'}
              </p>
            </div>

            {pujas.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl font-serif text-ink-soft mb-6">
                  {locale === 'hi' ? 'जल्द ही पूजाएँ जोड़ी जाएँगी।' : 'Pujas coming soon.'}
                </p>
                <a href={SITE.phoneTel} className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-lg">
                  <PhoneCall className="w-5 h-5" /> {SITE.phone}
                </a>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                {pujas.map((puja) => (
                  <Link key={puja.slug} to={`${prefix}${articlePath(puja)}`}
                    className="group flex bg-white rounded-2xl overflow-hidden border border-cream shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">

                    {/* Image pane */}
                    <div className="relative w-36 sm:w-48 flex-shrink-0 overflow-hidden bg-maroon-900">
                      {puja.heroImage ? (
                        <img src={puja.heroImage} alt={puja.title[locale]} loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gold/30 font-serif text-6xl">ॐ</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-maroon-900/40" />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between">
                      <div>
                        <span className="text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                          style={{ background: 'rgba(201,168,76,0.15)', color: '#A48838' }}>
                          {locale === 'hi' ? 'पूजा जानकारी' : 'Puja Info'}
                        </span>
                        <h3 className="font-serif text-lg sm:text-xl font-bold text-maroon group-hover:text-saffron-700 transition-colors mt-3 leading-snug line-clamp-2">
                          {puja.title[locale]}
                        </h3>
                        <p className="text-ink-mute text-sm mt-2 line-clamp-2 leading-relaxed">
                          {puja.shortIntro[locale].replace(/\*\*(.+?)\*\*/g, '$1')}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-saffron-700 group-hover:text-maroon font-bold text-sm transition-colors">
                        {locale === 'hi' ? 'पूरी जानकारी' : 'Read Full Guide'}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Call CTA below grid */}
            <div className="mt-12 text-center">
              <p className="text-ink-mute font-serif italic text-sm mb-4">
                {locale === 'hi' ? 'कौन सी पूजा सही है — यह पता नहीं? हमसे पूछें।' : 'Not sure which puja is right for you? Just ask us.'}
              </p>
              <a href={SITE.phoneTel}
                className="inline-flex items-center gap-3 font-bold px-8 py-4 rounded-full text-base transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg,#E0C374,#C9A84C)', color: '#1a0404', boxShadow: '0 0 30px rgba(201,168,76,0.25)' }}>
                <PhoneCall className="w-5 h-5" />
                {locale === 'hi' ? 'निःशुल्क परामर्श — कॉल करें' : 'Free Consultation — Call'}
              </a>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════
            HOW IT WORKS
        ═══════════════════════════════════ */}
        <section className="bg-white py-16 sm:py-24 border-b border-cream">
          <div className="container-page max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-saffron-700 font-serif text-sm tracking-[0.3em] uppercase mb-3">
                {locale === 'hi' ? '— सरल प्रक्रिया —' : '— Simple Process —'}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-maroon">
                {locale === 'hi' ? 'पूजा कैसे बुक करें?' : 'How to Book a Puja?'}
              </h2>
              <div className="w-20 h-1 mx-auto mt-4 rounded-full" style={{ background: 'linear-gradient(90deg,#D4621A,#C9A84C)' }} />
            </div>

            <div className="grid sm:grid-cols-3 gap-8 relative">
              {/* Connecting line desktop */}
              <div className="hidden sm:block absolute top-10 left-[20%] right-[20%] h-px" style={{ background: 'linear-gradient(90deg,rgba(201,168,76,0.4),rgba(201,168,76,0.4))' }} />

              {HOW_IT_WORKS.map((s, idx) => (
                <div key={idx} className="flex flex-col items-center text-center group">
                  <div className="relative z-10 w-20 h-20 rounded-full flex flex-col items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: 'linear-gradient(135deg,#E0C374,#C9A84C)', boxShadow: '0 0 30px rgba(201,168,76,0.30)' }}>
                    <span className="font-serif font-extrabold text-maroon-900 text-xl leading-none">{s.step}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-maroon mb-3">
                    {locale === 'hi' ? s.titleHi : s.titleEn}
                  </h3>
                  <p className="text-ink-soft text-sm leading-relaxed">
                    {locale === 'hi' ? s.descHi : s.descEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════
            WHY UJJAIN + WHY US
        ═══════════════════════════════════ */}
        <section className="py-16 sm:py-24 border-b border-gold/15" style={{ background: 'linear-gradient(160deg,#200505,#2f0707,#1a0404)' }}>
          <div className="container-page max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            {/* Why Ujjain */}
            <div>
              <p className="text-gold/60 font-serif text-sm tracking-[0.3em] uppercase mb-3">
                {locale === 'hi' ? '— क्यों उज्जैन? —' : '— Why Ujjain? —'}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold mb-7" style={{ color: '#E0C374' }}>
                {locale === 'hi' ? 'उज्जैन — पूजा की सर्वोच्च भूमि' : 'Ujjain — Supreme Land of Puja'}
              </h2>
              <ul className="space-y-4">
                {WHY_POINTS.map((p, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-gold" />
                    <span className="text-cream/75 text-sm sm:text-base leading-snug">
                      {locale === 'hi' ? p.hi : p.en}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Why UjjainTemple */}
            <div className="rounded-2xl p-7 sm:p-9" style={{ background: 'rgba(48,7,7,0.7)', border: '1.5px solid rgba(201,168,76,0.35)' }}>
              <p className="text-gold/60 font-serif text-sm tracking-[0.3em] uppercase mb-3">
                {locale === 'hi' ? '— हमें क्यों चुनें? —' : '— Why Choose Us? —'}
              </p>
              <h3 className="font-serif text-2xl sm:text-3xl font-extrabold mb-7" style={{ color: '#E0C374' }}>
                {locale === 'hi' ? 'उज्जैन टेम्पल का वादा' : 'UjjainTemple Promise'}
              </h3>
              <ul className="space-y-5">
                {(locale === 'hi' ? [
                  ['शास्त्रोक्त विधि', '15+ वर्ष अनुभवी पंडित, कोई समझौता नहीं'],
                  ['पारदर्शी मूल्य', 'पहले से तय फीस — पूजा के बाद कोई अतिरिक्त माँग नहीं'],
                  ['वन-स्टॉप', 'पूजा + मंदिर दर्शन + आवास + कैब — सब एक कॉल पर'],
                  ['ऑनलाइन विकल्प', 'घर बैठे WhatsApp पर लाइव देखें'],
                ] : [
                  ['Shastriya Vidhi', '15+ year experienced pandits — no compromises'],
                  ['Transparent Pricing', 'Fee fixed upfront — no extra demands after puja'],
                  ['One-Stop', 'Puja + darshan + hotel + cab — all in one call'],
                  ['Online Option', 'Watch live on WhatsApp from home'],
                ]).map(([title, desc], i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-serif font-bold text-sm"
                      style={{ background: 'rgba(201,168,76,0.20)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.35)' }}>
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: '#E0C374' }}>{title}</p>
                      <p className="text-cream/60 text-sm mt-0.5 leading-snug">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <a href={SITE.phoneTel}
                className="mt-8 w-full inline-flex items-center justify-center gap-3 font-bold px-7 py-4 rounded-full text-base transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg,#E0C374,#C9A84C)', color: '#1a0404', boxShadow: '0 0 25px rgba(201,168,76,0.25)' }}>
                <PhoneCall className="w-5 h-5" />
                {locale === 'hi' ? `${SITE.phone}` : `${SITE.phone}`}
              </a>
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════
            TESTIMONIALS
        ═══════════════════════════════════ */}
        <section className="bg-cream-light py-16 sm:py-24 border-b border-cream-dark">
          <div className="container-page max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-saffron-700 font-serif text-sm tracking-[0.3em] uppercase mb-3">
                {locale === 'hi' ? '— श्रद्धालुओं के अनुभव —' : '— Devotee Experiences —'}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-maroon">
                {locale === 'hi' ? 'वे जो आए, उन्होंने क्या कहा' : 'What They Said'}
              </h2>
              <div className="w-20 h-1 mx-auto mt-4 rounded-full" style={{ background: 'linear-gradient(90deg,#D4621A,#C9A84C)' }} />
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 sm:p-7 border border-cream shadow-md flex flex-col gap-4 hover:shadow-lg transition-shadow">
                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.stars }).map((_, si) => (
                      <Star key={si} className="w-4 h-4 text-gold-500" fill="#C9A84C" stroke="none" />
                    ))}
                  </div>
                  {/* Text */}
                  <p className="text-ink-soft text-sm leading-relaxed font-serif italic flex-1">
                    "{locale === 'hi' ? t.textHi : t.textEn}"
                  </p>
                  {/* Author */}
                  <div className="border-t border-cream pt-4">
                    <p className="font-serif font-bold text-maroon text-base">
                      {locale === 'hi' ? t.nameHi : t.nameEn}
                    </p>
                    <p className="text-xs text-ink-mute mt-0.5">
                      {locale === 'hi' ? t.cityHi : t.cityEn} &nbsp;·&nbsp;
                      <span className="text-saffron-700">{locale === 'hi' ? t.pujaHi : t.pujaEn}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════
            FAQ
        ═══════════════════════════════════ */}
        <section className="bg-white py-16 sm:py-24 border-b border-cream">
          <div className="container-page max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-saffron-700 font-serif text-sm tracking-[0.3em] uppercase mb-3">
                {locale === 'hi' ? '— सामान्य प्रश्न —' : '— FAQs —'}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-maroon">
                {locale === 'hi' ? 'पूजा के बारे में प्रश्न' : 'Puja FAQ'}
              </h2>
              <div className="w-20 h-1 mx-auto mt-4 rounded-full" style={{ background: 'linear-gradient(90deg,#D4621A,#C9A84C)' }} />
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="rounded-xl overflow-hidden border border-cream shadow-sm bg-cream-light">
                  <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full text-left px-6 py-5 flex justify-between items-center gap-4 hover:bg-cream/60 transition-colors">
                    <span className="font-serif font-bold text-base sm:text-lg text-maroon leading-snug">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-saffron flex-shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === idx && (
                    <div className="px-6 pb-6 pt-2 text-ink-soft text-sm sm:text-base leading-relaxed font-serif border-t border-cream animate-fade-in bg-white">
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
        <GlobalLeadSection sourcePage="puja-landing" defaultService="tour" />

      </Layout>
    </>
  );
}


