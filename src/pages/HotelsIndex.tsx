import { useState } from 'react';
import { Layout } from '../components/global/Layout';
import { SEOHead } from '../components/global/SEOHead';
import { GlobalLeadSection } from '../components/global/GlobalLeadSection';
import { Breadcrumb } from '../components/global/Breadcrumb';
import { useI18n } from '../i18n';
import { SITE } from '../lib/site';
import { breadcrumbSchema } from '../lib/schemas';
import { Phone, MapPin, CheckCircle2, PhoneCall, Star, ArrowRight, ShieldCheck } from 'lucide-react';

// ─── Data ─────────────────────────────────────────────────────────
const TIERS = [
  {
    id: 'budget',
    labelHi: 'बजट',
    labelEn: 'Budget',
    range: '₹800 – ₹1,800',
    tagHi: 'तीर्थयात्री पसंद',
    tagEn: 'Pilgrim Favourite',
    stars: 2,
    featuresHi: ['साफ़ AC / Non-AC कमरे', 'गर्म पानी 24×7', 'रूम सर्विस उपलब्ध', 'मंदिर से पैदल दूरी', 'प्रातः भोजन (कुछ होटलों में)'],
    featuresEn: ['Clean AC / Non-AC rooms', 'Hot water 24×7', 'Room service available', 'Walking distance to temple', 'Breakfast included (select hotels)'],
    bestForHi: 'एकल यात्री, बैकपैकर, छोटी यात्रा',
    bestForEn: 'Solo travellers, backpackers, short stays',
    color: '#D4621A',
    bg: '#FDF4EC',
  },
  {
    id: 'mid',
    labelHi: 'मध्यम',
    labelEn: 'Mid-range',
    range: '₹1,800 – ₹4,500',
    tagHi: 'परिवार के लिए आदर्श',
    tagEn: 'Ideal for Families',
    stars: 3,
    featuresHi: ['AC सुइट + बाल्कनी विकल्प', 'ऑन-साइट रेस्तरां', 'पार्किंग + लिफ्ट', 'परिवार-अनुकूल कमरे', 'बफे नाश्ता शामिल'],
    featuresEn: ['AC suites + balcony options', 'On-site restaurant', 'Parking + lift', 'Family rooms available', 'Buffet breakfast included'],
    bestForHi: 'परिवार, 2–3 दिन की यात्रा, युगल',
    bestForEn: 'Families, 2–3 day stays, couples',
    color: '#8B1A1A',
    bg: '#FAEEEE',
  },
  {
    id: 'luxury',
    labelHi: 'लक्ज़री',
    labelEn: 'Luxury',
    range: '₹5,000+',
    tagHi: 'प्रीमियम अनुभव',
    tagEn: 'Premium Experience',
    stars: 5,
    featuresHi: ['प्रीमियम सुइट्स + शहर दृश्य', 'स्विमिंग पूल + स्पा', 'फाइन डाइनिंग', 'कंसियर्ज & दर्शन सहायता', '24×7 बटलर सर्विस'],
    featuresEn: ['Premium suites + city views', 'Swimming pool + spa', 'Fine dining restaurant', 'Concierge & darshan help', '24×7 butler service'],
    bestForHi: 'विशेष अवसर, परिवार, हनीमून',
    bestForEn: 'Special occasions, family, honeymoon',
    color: '#C9A84C',
    bg: '#FBF7EC',
  },
] as const;

type TierId = 'budget' | 'mid' | 'luxury';

const AREAS = [
  { hi: 'महाकाल क्षेत्र', en: 'Mahakal Area', distHi: '0–500 मीटर', distEn: '0–500 m from Mahakal', icon: '🛕' },
  { hi: 'फ्रीगंज', en: 'Freeganj', distHi: '2–3 किमी', distEn: '2–3 km from Mahakal', icon: '🏙️' },
  { hi: 'देवास गेट', en: 'Dewas Gate', distHi: '1.5–2 किमी', distEn: '1.5–2 km from Mahakal', icon: '🚗' },
  { hi: 'नानाखेड़ा', en: 'Nanakheda', distHi: '4–5 किमी', distEn: '4–5 km from Mahakal', icon: '🌙' },
];

const TRUST = [
  { numHi: '12+', numEn: '12+', labelHi: 'वर्ष अनुभव', labelEn: 'Years Experience' },
  { numHi: '500+', numEn: '500+', labelHi: 'परिवार प्रतिमाह', labelEn: 'Families/Month' },
  { numHi: '100%', numEn: '100%', labelHi: 'सत्यापित होटल', labelEn: 'Verified Hotels' },
  { numHi: '₹0', numEn: '₹0', labelHi: 'बुकिंग शुल्क', labelEn: 'Booking Fee' },
];

// ─── Component ────────────────────────────────────────────────────
export function HotelsIndex() {
  const { locale } = useI18n();
  const [activeTier, setActiveTier] = useState<TierId>('mid');
  const tier = TIERS.find((t) => t.id === activeTier)!;

  const title = locale === 'hi'
    ? 'उज्जैन में होटल — महाकाल के पास, बजट से लक्ज़री, परिवार-अनुकूल | UjjainTemple'
    : 'Hotel in Ujjain — Near Mahakal, Budget to Luxury, Family-Friendly | UjjainTemple';
  const description = locale === 'hi'
    ? 'उज्जैन में होटल बुकिंग — महाकालेश्वर के निकट, बजट से लक्ज़री, परिवार-अनुकूल। सत्यापित दूरी, सुविधाएँ, रेट। एक कॉल पर सहायता: +91 74007 24456।'
    : 'Hotel in Ujjain — booking near Mahakaleshwar, budget to luxury, family-friendly. Verified distances, amenities, pricing. Call: +91 74007 24456.';

  return (
    <>
      <SEOHead
        title={title}
        description={description}
        path="/hotels/"
        locale={locale}
        schemas={[breadcrumbSchema({ items: [
          { name: locale === 'hi' ? 'होम' : 'Home', url: SITE.url },
          { name: locale === 'hi' ? 'होटल' : 'Hotels', url: `${SITE.url}/hotels/` },
        ] })]}
      />
      <Layout>

        {/* ═══════════════════════════════════
            HERO
        ═══════════════════════════════════ */}
        <section
          className="relative flex flex-col items-center justify-center overflow-hidden border-b-[6px] border-gold py-20 sm:py-28 lg:py-36"
          style={{ background: 'linear-gradient(160deg, #1a0404 0%, #2f0707 50%, #200505 100%)' }}
        >
          <div className="absolute inset-0 opacity-[0.07]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A84C' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 70%)' }} />

          <div className="absolute inset-0 z-0">
            <img src="/images/hotels/ujjain_hotels_4k.png" alt="" aria-hidden="true"
              className="h-full w-full object-cover opacity-20 mix-blend-luminosity"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <div className="absolute inset-0 bg-gradient-to-b from-maroon-900/80 via-maroon-900/50 to-maroon-900/90" />
          </div>

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center gap-6">
            <div className="inline-flex items-center gap-2 border border-gold/30 rounded-full px-5 py-2" style={{ background: 'rgba(201,168,76,0.08)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-gold-light" />
              <span className="text-gold-light font-serif tracking-[0.25em] uppercase text-xs sm:text-sm">
                {locale === 'hi' ? 'उज्जैन का नम्बर 1 होटल सहायक' : 'Ujjain\'s Trusted Hotel Concierge'}
              </span>
            </div>

            <h1 className="font-serif font-extrabold text-white leading-tight" style={{ fontSize: 'clamp(2.4rem, 7vw, 5rem)' }}>
              {locale === 'hi' ? 'उज्जैन के बेहतरीन\nहोटल' : 'Best Hotels\nin Ujjain'}
            </h1>

            <p className="text-cream/75 font-serif italic text-base sm:text-xl max-w-2xl leading-relaxed">
              {locale === 'hi'
                ? 'महाकालेश्वर के पास · बजट से लक्ज़री · परिवार-अनुकूल · सत्यापित & सुरक्षित'
                : 'Near Mahakaleshwar · Budget to Luxury · Family-friendly · Verified & Safe'}
            </p>

            <a href={SITE.phoneTel}
              className="inline-flex items-center gap-3 font-bold px-8 py-4 rounded-full text-base sm:text-lg transition-all duration-300 hover:scale-105 mt-2"
              style={{
                background: 'linear-gradient(135deg, #E0C374, #C9A84C)',
                color: '#1a0404',
                boxShadow: '0 0 35px rgba(201,168,76,0.35)',
              }}>
              <PhoneCall className="w-5 h-5" />
              {locale === 'hi' ? 'होटल बुकिंग सहायता — कॉल करें' : 'Get Hotel Booking Help — Call Now'}
            </a>
          </div>
        </section>

        {/* Breadcrumb */}
        <div className="bg-cream-light py-4 border-b border-cream">
          <div className="container-page">
            <Breadcrumb items={[{ label: locale === 'hi' ? 'होटल' : 'Hotels' }]} />
          </div>
        </div>

        {/* ═══════════════════════════════════
            TRUST STATS
        ═══════════════════════════════════ */}
        <section style={{ background: '#200505', borderBottom: '1px solid rgba(201,168,76,0.18)' }}>
          <div className="container-page">
            <div className="grid grid-cols-2 lg:grid-cols-4">
              {TRUST.map((s, i) => (
                <div key={i} className="flex flex-col items-center justify-center py-7 px-4 text-center gap-1"
                  style={{ borderRight: i < 3 ? '1px solid rgba(201,168,76,0.12)' : 'none', borderBottom: i < 2 ? '1px solid rgba(201,168,76,0.12)' : 'none' }}>
                  <span className="font-serif font-extrabold" style={{
                    fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', lineHeight: 1,
                    background: 'linear-gradient(180deg, #E0C374 0%, #C9A84C 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
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
            INTERACTIVE TIER SELECTOR
        ═══════════════════════════════════ */}
        <section className="bg-cream-light py-16 sm:py-24 border-b border-cream-dark">
          <div className="container-page max-w-5xl mx-auto">

            {/* Section header */}
            <div className="text-center mb-12">
              <p className="text-saffron-700 font-serif text-sm tracking-[0.3em] uppercase mb-3">
                {locale === 'hi' ? '— अपना बजट चुनें —' : '— Choose Your Budget —'}
              </p>
              <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-maroon">
                {locale === 'hi' ? 'बजट के अनुसार होटल' : 'Hotels By Budget'}
              </h2>
              <div className="w-20 h-1 mx-auto mt-4 rounded-full" style={{ background: 'linear-gradient(90deg,#D4621A,#C9A84C)' }} />
            </div>

            {/* Tier tab buttons */}
            <div className="flex gap-3 justify-center mb-10 flex-wrap">
              {TIERS.map((t) => {
                const isActive = activeTier === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTier(t.id)}
                    className="relative flex flex-col items-center px-6 sm:px-8 py-4 rounded-2xl font-serif font-bold text-sm sm:text-base transition-all duration-300 border-2 cursor-pointer"
                    style={{
                      background: isActive ? t.color : '#fff',
                      color: isActive ? '#fff' : t.color,
                      borderColor: isActive ? t.color : `${t.color}55`,
                      boxShadow: isActive ? `0 4px 24px ${t.color}44` : '0 2px 8px rgba(0,0,0,0.06)',
                      transform: isActive ? 'scale(1.05)' : 'scale(1)',
                    }}
                  >
                    {/* Stars */}
                    <span className="flex gap-0.5 mb-1">
                      {Array.from({ length: t.stars }).map((_, si) => (
                        <Star key={si} className="w-3 h-3" fill={isActive ? '#fff' : t.color} stroke="none" />
                      ))}
                    </span>
                    <span>{locale === 'hi' ? t.labelHi : t.labelEn}</span>
                    {isActive && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs font-bold px-2.5 py-0.5 rounded-full shadow" style={{ background: '#fff', color: t.color }}>
                        ✓ {locale === 'hi' ? 'चुना' : 'Selected'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active tier detail card */}
            <div
              key={activeTier}
              className="rounded-2xl overflow-hidden shadow-2xl border-2 animate-fade-in"
              style={{ borderColor: `${tier.color}60`, background: tier.bg }}
            >
              {/* Card header */}
              <div className="px-8 sm:px-10 py-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                style={{ background: tier.color }}>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="flex gap-1">
                      {Array.from({ length: tier.stars }).map((_, si) => (
                        <Star key={si} className="w-4 h-4" fill="#fff" stroke="none" />
                      ))}
                    </span>
                    <span className="text-white/80 text-xs font-bold tracking-widest uppercase border border-white/40 rounded-full px-2.5 py-0.5">
                      {locale === 'hi' ? tier.tagHi : tier.tagEn}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-white mt-2">
                    {locale === 'hi' ? tier.labelHi : tier.labelEn}
                  </h3>
                </div>
                <a href={SITE.phoneTel}
                  className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-full text-sm transition-all hover:scale-105 flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.45)' }}>
                  <Phone className="w-4 h-4" />
                  {locale === 'hi' ? 'बुकिंग पूछें' : 'Enquire Now'}
                </a>
              </div>

              {/* Features + Best For */}
              <div className="px-8 sm:px-10 py-8 grid sm:grid-cols-2 gap-8">
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: tier.color }}>
                    {locale === 'hi' ? 'सुविधाएँ' : 'Amenities'}
                  </p>
                  <ul className="space-y-3">
                    {(locale === 'hi' ? tier.featuresHi : tier.featuresEn).map((f, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: tier.color }} />
                        <span className="text-ink-soft text-sm sm:text-base leading-snug">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-6">
                  <div>
                    <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: tier.color }}>
                      {locale === 'hi' ? 'किसके लिए आदर्श' : 'Best For'}
                    </p>
                    <p className="text-ink-soft text-sm sm:text-base font-serif italic leading-relaxed">
                      {locale === 'hi' ? tier.bestForHi : tier.bestForEn}
                    </p>
                  </div>

                  {/* Call to action big */}
                  <div className="mt-auto rounded-xl p-6 text-center" style={{ background: `${tier.color}15`, border: `1.5px solid ${tier.color}35` }}>
                    <p className="font-serif text-base font-bold mb-1" style={{ color: tier.color }}>
                      {locale === 'hi' ? 'सटीक कीमत जानने के लिए कॉल करें' : 'Call for exact pricing & availability'}
                    </p>
                    <p className="text-xs text-ink-mute mb-4">
                      {locale === 'hi' ? 'तारीखें बताएं — हम 3 सत्यापित होटल सुझाएंगे' : 'Share your dates — we\'ll suggest 3 verified hotels'}
                    </p>
                    <a href={SITE.phoneTel}
                      className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-full text-sm transition-all hover:scale-105"
                      style={{ background: tier.color, color: '#fff', boxShadow: `0 4px 16px ${tier.color}44` }}>
                      <PhoneCall className="w-4 h-4" /> {SITE.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════
            AREAS + EXPERT PANEL
        ═══════════════════════════════════ */}
        <section className="bg-white py-16 sm:py-24 border-b border-cream">
          <div className="container-page max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            {/* Areas */}
            <div>
              <p className="text-saffron-700 font-serif text-sm tracking-[0.3em] uppercase mb-3">
                {locale === 'hi' ? '— क्षेत्र के अनुसार —' : '— By Location —'}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-maroon mb-8 relative pb-4 inline-block">
                {locale === 'hi' ? 'उज्जैन में कहाँ रुकें?' : 'Where to Stay in Ujjain?'}
                <div className="absolute bottom-0 left-0 h-1 w-2/3 rounded-full" style={{ background: 'linear-gradient(90deg,#D4621A,#C9A84C)' }} />
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {AREAS.map((a) => (
                  <div key={a.en}
                    className="flex items-center gap-4 bg-cream-light p-5 rounded-xl border border-cream hover:border-saffron/50 hover:shadow-md transition-all duration-300 group cursor-default">
                    <div className="text-3xl flex-shrink-0">{a.icon}</div>
                    <div>
                      <p className="font-serif font-bold text-maroon text-base group-hover:text-saffron-700 transition-colors">
                        {locale === 'hi' ? a.hi : a.en}
                      </p>
                      <p className="text-xs text-ink-mute flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {locale === 'hi' ? a.distHi : a.distEn}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-saffron-700 opacity-0 group-hover:opacity-100 ml-auto transition-opacity" />
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm text-ink-mute font-serif italic leading-relaxed">
                {locale === 'hi'
                  ? '* महाकाल क्षेत्र में होटल सबसे जल्दी भरते हैं। सिंहस्थ 2028 के दौरान 6 माह पहले बुकिंग करें।'
                  : '* Hotels near Mahakal fill the fastest. Book 6 months ahead for Simhastha 2028.'}
              </p>
            </div>

            {/* Expert call-to-action panel */}
            <div className="relative overflow-hidden rounded-2xl shadow-2xl text-white"
              style={{ background: 'linear-gradient(145deg, #2f0707, #1a0404)', border: '2px solid rgba(201,168,76,0.40)' }}>
              <div className="absolute inset-0 opacity-[0.06]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A84C' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }} />

              <div className="relative z-10 p-8 sm:p-10">
                <div className="flex items-center gap-3 mb-5">
                  <ShieldCheck className="w-7 h-7 text-gold" />
                  <span className="text-gold font-serif font-bold text-lg">
                    {locale === 'hi' ? 'हमारा वादा' : 'Our Promise'}
                  </span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-extrabold leading-snug mb-5" style={{ color: '#E0C374' }}>
                  {locale === 'hi'
                    ? 'हम हर होटल क्यों नहीं दिखाते?'
                    : 'Why we don\'t list every hotel?'}
                </h3>
                <p className="text-cream/75 font-serif italic text-base leading-relaxed mb-6">
                  {locale === 'hi'
                    ? 'हर यात्री की ज़रूरत अलग — बजट, परिवार, तारीख़ सब अलग। फेक रेटिंग से बचें। एक कॉल करें, हमारी टीम आपकी तारीखों के लिए सबसे अच्छे 3 सत्यापित होटल, कीमत के साथ बताएगी।'
                    : 'Every traveller is different — budget, family size, dates all vary. Avoid fake ratings. Make one call and our team will suggest the 3 best verified hotels for your dates, with pricing.'}
                </p>

                <ul className="space-y-3 mb-8">
                  {(locale === 'hi'
                    ? ['फ्री सलाह — कोई कमीशन नहीं', 'हम स्वयं जगह देखते हैं', 'तारीख़ पर उपलब्धता जाँचते हैं', 'मंदिर दर्शन सहायता भी देते हैं']
                    : ['Free advice — zero commission', 'We inspect properties ourselves', 'Check availability for your dates', 'Temple darshan guidance included']
                  ).map((pt, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <span className="w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: 'rgba(201,168,76,0.20)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.35)' }}>
                        ✓
                      </span>
                      <span className="text-sm text-cream/80">{pt}</span>
                    </li>
                  ))}
                </ul>

                <a href={SITE.phoneTel}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 font-bold px-8 py-4 rounded-full text-base transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg,#E0C374,#C9A84C)',
                    color: '#1a0404',
                    boxShadow: '0 0 30px rgba(201,168,76,0.30)',
                  }}>
                  <Phone className="w-5 h-5" />
                  {locale === 'hi' ? 'विशेषज्ञ से बात करें' : 'Talk to an Expert'}
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════
            LEAD CTA
        ═══════════════════════════════════ */}
        <GlobalLeadSection sourcePage="hotels-index" defaultService="hotel" />

      </Layout>
    </>
  );
}

