import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/global/Layout';
import { SEOHead } from '../components/global/SEOHead';
import { GlobalLeadSection } from '../components/global/GlobalLeadSection';
import { Breadcrumb } from '../components/global/Breadcrumb';
import { useI18n } from '../i18n';
import { articlesByCategory, articlePath } from '../data/articles';
import { SITE } from '../lib/site';
import { breadcrumbSchema, itemListSchema } from '../lib/schemas';
import { PhoneCall, ArrowRight } from 'lucide-react';

// ─── Countdown ───────────────────────────────────────────────────
const SIMHASTHA_START = new Date('2028-04-29T00:00:00');

type Countdown = { d: number; h: number; m: number; s: number; ready: boolean };

function useCountdown(): Countdown {
  const [t, setT] = useState<Countdown>({ d: 0, h: 0, m: 0, s: 0, ready: false });
  useEffect(() => {
    const tick = () => {
      const diff = SIMHASTHA_START.getTime() - Date.now();
      if (diff <= 0) { setT({ d: 0, h: 0, m: 0, s: 0, ready: true }); return; }
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
        ready: true,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

// ─── Data ─────────────────────────────────────────────────────────
const STATS = [
  { numHi: '29 दिन',     numEn: '29 Days',     labelHi: 'महापर्व अवधि',         labelEn: 'Festival Duration' },
  { numHi: '5',           numEn: '5',            labelHi: 'शाही स्नान',            labelEn: 'Shahi Snans' },
  { numHi: '13',          numEn: '13',           labelHi: 'अखाड़े',               labelEn: 'Akhadas' },
  { numHi: '12 करोड़+',  numEn: '12 Crore+',   labelHi: 'श्रद्धालु (अनुमानित)', labelEn: 'Expected Pilgrims' },
];

const SHAHI_SNANS = [
  {
    num: 1,
    dateHi: '29 अप्रैल 2028',   dateEn: '29 Apr 2028',
    nameHi: 'चैत्र पूर्णिमा',   nameEn: 'Chaitra Purnima',
    noteHi: 'प्रथम शाही स्नान — सिंहस्थ प्रारम्भ', noteEn: 'First Shahi Snan — Simhastha Opens',
    highlight: false,
  },
  {
    num: 2,
    dateHi: '13 मई 2028',       dateEn: '13 May 2028',
    nameHi: 'वैशाख कृष्ण अमावस्या', nameEn: 'Vaisakh Krishna Amavasya',
    noteHi: 'द्वितीय शाही स्नान — पितृ तर्पण विशेष', noteEn: 'Second Shahi Snan — Pitru Tarpan',
    highlight: false,
  },
  {
    num: 3,
    dateHi: '15 मई 2028',       dateEn: '15 May 2028',
    nameHi: 'अक्षय तृतीया',     nameEn: 'Akshaya Tritiya',
    noteHi: 'तृतीय शाही स्नान — अक्षय पुण्य', noteEn: 'Third Shahi Snan — Akshaya Merit',
    highlight: true,
  },
  {
    num: 4,
    dateHi: '23 मई 2028',       dateEn: '23 May 2028',
    nameHi: 'वैशाख शुक्ल एकादशी', nameEn: 'Vaisakh Shukla Ekadashi',
    noteHi: 'चतुर्थ शाही स्नान — मोहिनी एकादशी', noteEn: 'Fourth Shahi Snan — Mohini Ekadashi',
    highlight: false,
  },
  {
    num: 5,
    dateHi: '27 मई 2028',       dateEn: '27 May 2028',
    nameHi: 'वैशाख पूर्णिमा',  nameEn: 'Vaisakh Purnima',
    noteHi: 'पंचम व मुख्य स्नान — सिंहस्थ समापन', noteEn: 'Fifth & Grand Final Snan — Simhastha Closes',
    highlight: true,
  },
];

// ─── Component ────────────────────────────────────────────────────
export function SimhasthaLanding() {
  const { locale } = useI18n();
  const prefix = locale === 'hi' ? '' : '/en';
  const list = articlesByCategory('simhastha');
  const countdown = useCountdown();

  const title = locale === 'hi'
    ? 'सिंहस्थ 2028 उज्जैन — सम्पूर्ण गाइड'
    : 'Simhastha 2028 Ujjain — Complete Guide';
  const description = locale === 'hi'
    ? 'सिंहस्थ महाकुम्भ 2028 (29 अप्रैल — 27 मई) — शाही स्नान, कल्पवास, अखाड़े, आवास, यातायात, बजट। 12 करोड़+ श्रद्धालुओं का महापर्व। सहायता: +91 74007 24456'
    : 'Simhastha Mahakumbh 2028 (29 April – 27 May) — Shahi Snan, Kalpvas, Akhadas, accommodation, transport, budget. Guide for 12 crore+ pilgrims.';

  const ESSENTIALS = [
    {
      icon: '🛕',
      titleHi: 'आवास बुकिंग',
      titleEn: 'Accommodation',
      descHi: 'सिंहस्थ नगर कुटिया, होटल, धर्मशाला — शाही स्नान तिथियों पर स्थान अत्यंत सीमित। 6–8 माह पूर्व बुकिंग आवश्यक।',
      descEn: 'MP Tourism kutiyas, hotels, dharmshalas — extremely limited on Shahi Snan dates. Book 6–8 months in advance.',
      href: SITE.phoneTel,
      isExternal: true,
      ctaHi: 'बुकिंग सहायता',
      ctaEn: 'Booking Help',
    },
    {
      icon: '🚂',
      titleHi: 'यातायात योजना',
      titleEn: 'Travel Planning',
      descHi: 'दिल्ली, मुम्बई, अहमदाबाद से सीधी ट्रेन। इंदौर हवाई अड्डे से 55 किमी। सिंहस्थ अवधि में विशेष ट्रेनें।',
      descEn: 'Direct trains from Delhi, Mumbai, Ahmedabad. 55 km from Indore airport. Special trains run during Simhastha.',
      href: `${prefix}/transport-in-ujjain/`,
      isExternal: false,
      ctaHi: 'ट्रांसपोर्ट गाइड',
      ctaEn: 'Transport Guide',
    },
    {
      icon: '📅',
      titleHi: 'यात्रा दिनांक',
      titleEn: 'When to Go',
      descHi: 'कल्पवास: पूरे 29 दिन। शाही स्नान: किसी एक तिथि। परिवार यात्रा के लिए वैशाख पूर्णिमा (27 मई 2028) सर्वोत्तम।',
      descEn: 'Kalpvas: all 29 days. Shahi Snan: any one date. For families, target Vaisakh Purnima (27 May 2028).',
      href: `${prefix}/simhastha-2028/simhastha-2028-complete-guide/`,
      isExternal: false,
      ctaHi: 'पूरी गाइड पढ़ें',
      ctaEn: 'Read Full Guide',
    },
  ] as const;

  return (
    <>
      <SEOHead
        title={`${title} | UjjainTemple — ${SITE.phone}`}
        description={description}
        path="/simhastha-2028/"
        locale={locale}
        schemas={[
          breadcrumbSchema({
            items: [
              { name: locale === 'hi' ? 'होम' : 'Home', url: SITE.url },
              { name: title, url: `${SITE.url}/simhastha-2028/` },
            ],
          }),
          itemListSchema(list.map((a) => ({
            name: a.title[locale],
            url: `${SITE.url}${prefix}${articlePath(a)}`,
            description: a.shortIntro[locale],
            image: a.heroImage ? `${SITE.url}${a.heroImage}` : undefined,
          }))),
        ]}
      />
      <Layout>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 1 — EPIC HERO
        ═══════════════════════════════════════════════════════════ */}
        <section className="relative min-h-[88vh] flex flex-col items-center justify-center overflow-hidden border-b-[6px] border-gold" style={{ background: 'linear-gradient(170deg, #1a0404 0%, #2f0707 40%, #200505 100%)' }}>

          {/* Simhastha hero photo background */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/simhastha/simhastha-hero.webp"
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover object-center"
              style={{ opacity: 0.32, mixBlendMode: 'luminosity' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(to bottom, rgba(26,4,4,0.75) 0%, rgba(47,7,7,0.55) 40%, rgba(32,5,5,0.75) 100%)',
            }} />
          </div>

          {/* Sacred diamond pattern */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon fill='%23C9A84C' points='40,2 78,40 40,78 2,40'/%3E%3Cpolygon fill='none' stroke='%23C9A84C' stroke-width='1' points='40,12 68,40 40,68 12,40'/%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px',
          }} />

          {/* Radial gold glow */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,168,76,0.10) 0%, transparent 70%)' }} />

          {/* Vertical gold lines - left & right */}
          <div className="absolute left-6 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent hidden lg:block" />
          <div className="absolute right-6 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent hidden lg:block" />

          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center gap-8 py-20 sm:py-24">

            {/* Sanskrit OM watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none" aria-hidden="true">
              <span className="text-gold/[0.04] font-serif" style={{ fontSize: 'clamp(16rem, 40vw, 32rem)', lineHeight: 1 }}>ॐ</span>
            </div>

            {/* Badge pill */}
            <div className="relative inline-flex items-center gap-3 border border-gold/40 rounded-full px-5 py-2 backdrop-blur-sm" style={{ background: 'rgba(201,168,76,0.08)' }}>
              <span className="w-2 h-2 rounded-full bg-gold-light animate-pulse" />
              <span className="text-gold-light font-serif tracking-[0.25em] uppercase text-xs sm:text-sm">
                {locale === 'hi' ? 'महाकुम्भ  ·  उज्जैन  ·  2028' : 'Mahakumbh  ·  Ujjain  ·  2028'}
              </span>
            </div>

            {/* Title block */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-gold/60 font-serif tracking-[0.4em] uppercase text-base sm:text-xl" style={{ fontVariantNumeric: 'oldstyle-nums' }}>
                {locale === 'hi' ? '— सिंहस्थ —' : '— Simhastha —'}
              </span>
              <h1
                className="font-serif font-extrabold leading-none"
                style={{
                  fontSize: 'clamp(5rem, 16vw, 11rem)',
                  background: 'linear-gradient(180deg, #F5E8B0 0%, #C9A84C 45%, #7E682A 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 6px 32px rgba(201,168,76,0.25))',
                }}
              >
                2028
              </h1>
              <p className="text-cream/70 font-serif text-base sm:text-xl tracking-wide">
                {locale === 'hi'
                  ? '29 अप्रैल — 27 मई  ·  शिप्रा तट, उज्जैन'
                  : '29 April — 27 May  ·  Shipra Ghat, Ujjain'}
              </p>
            </div>

            {/* Countdown */}
            {countdown.ready && (
              <div className="w-full max-w-sm sm:max-w-md">
                <p className="text-gold/50 text-xs tracking-[0.3em] uppercase text-center mb-3">
                  {locale === 'hi' ? '— प्रारम्भ में शेष —' : '— Countdown to Opening —'}
                </p>
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {[
                    { val: countdown.d, hi: 'दिन',   en: 'Days' },
                    { val: countdown.h, hi: 'घंटे',  en: 'Hours' },
                    { val: countdown.m, hi: 'मिनट',  en: 'Mins' },
                    { val: countdown.s, hi: 'सेकंड', en: 'Secs' },
                  ].map(({ val, hi, en }) => (
                    <div
                      key={en}
                      className="flex flex-col items-center rounded-xl sm:rounded-2xl py-3 sm:py-5 px-2"
                      style={{
                        background: 'rgba(48, 7, 7, 0.8)',
                        border: '1px solid rgba(201,168,76,0.30)',
                        boxShadow: '0 0 20px rgba(201,168,76,0.08), inset 0 1px 0 rgba(201,168,76,0.1)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <span
                        className="font-serif font-extrabold tabular-nums"
                        style={{
                          fontSize: 'clamp(1.6rem, 5vw, 2.6rem)',
                          lineHeight: 1,
                          background: 'linear-gradient(180deg, #E0C374 0%, #C9A84C 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}
                      >
                        {String(val).padStart(2, '0')}
                      </span>
                      <span className="text-cream/50 text-[10px] sm:text-xs mt-1.5 tracking-widest uppercase">
                        {locale === 'hi' ? hi : en}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA row */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href={SITE.phoneTel}
                className="inline-flex items-center justify-center gap-3 font-bold px-8 py-4 rounded-full text-base sm:text-lg transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #E0C374 0%, #C9A84C 100%)',
                  color: '#1a0404',
                  boxShadow: '0 0 40px rgba(201,168,76,0.35), 0 4px 16px rgba(0,0,0,0.4)',
                }}
              >
                <PhoneCall className="w-5 h-5 flex-shrink-0" />
                {locale === 'hi' ? 'यात्रा योजना बनाएँ' : 'Plan Your Trip'}
              </a>
              <a
                href="#guides"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base sm:text-lg transition-all duration-300 font-semibold"
                style={{
                  border: '1.5px solid rgba(201,168,76,0.40)',
                  color: '#E0C374',
                  background: 'rgba(201,168,76,0.06)',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(201,168,76,0.8)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(201,168,76,0.40)'; }}
              >
                {locale === 'hi' ? 'गाइड पढ़ें' : 'Read Guides'}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
        </section>

        {/* ─── Breadcrumb ─── */}
        <div className="bg-cream-light py-4 border-b border-cream">
          <div className="container-page">
            <Breadcrumb items={[{ label: locale === 'hi' ? 'सिंहस्थ 2028' : 'Simhastha 2028' }]} />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 2 — SACRED STATS BAR
        ═══════════════════════════════════════════════════════════ */}
        <section style={{ background: '#200505', borderBottom: '1px solid rgba(201,168,76,0.20)' }}>
          <div className="container-page">
            <div className="grid grid-cols-2 lg:grid-cols-4">
              {STATS.map((s, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center py-8 sm:py-10 px-4 text-center gap-1.5"
                  style={{ borderRight: i < 3 ? '1px solid rgba(201,168,76,0.15)' : 'none', borderBottom: i < 2 ? '1px solid rgba(201,168,76,0.15)' : 'none' }}
                >
                  <span
                    className="font-serif font-extrabold"
                    style={{
                      fontSize: 'clamp(1.8rem, 4.5vw, 3rem)',
                      lineHeight: 1,
                      background: 'linear-gradient(180deg, #E0C374 0%, #C9A84C 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {locale === 'hi' ? s.numHi : s.numEn}
                  </span>
                  <span className="text-xs sm:text-sm tracking-widest uppercase" style={{ color: 'rgba(251,245,236,0.50)' }}>
                    {locale === 'hi' ? s.labelHi : s.labelEn}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 3 — SHAHI SNAN TIMELINE
        ═══════════════════════════════════════════════════════════ */}
        <section className="bg-cream-light py-20 sm:py-28 border-b border-cream-dark">
          <div className="container-page max-w-5xl mx-auto">

            <div className="text-center mb-16">
              <p className="text-saffron-700 font-serif text-sm tracking-[0.35em] uppercase mb-3">
                {locale === 'hi' ? '— पाँच पवित्र तिथियाँ —' : '— Five Sacred Dates —'}
              </p>
              <h2 className="font-serif text-4xl sm:text-5xl font-extrabold text-maroon leading-tight">
                {locale === 'hi' ? 'शाही स्नान 2028' : 'Shahi Snan 2028'}
              </h2>
              <div className="w-20 h-1 mx-auto mt-5 rounded-full" style={{ background: 'linear-gradient(90deg, #D4621A, #C9A84C)' }} />
              <p className="text-ink-soft text-base sm:text-lg font-serif italic mt-6 max-w-2xl mx-auto leading-relaxed">
                {locale === 'hi'
                  ? 'तेरह अखाड़ों के संत‑महंत शोभायात्रा के साथ शिप्रा में स्नान करते हैं — ये हैं वे पाँच मुख्य तिथियाँ'
                  : 'Saints of the thirteen akhadas process to the Shipra for the royal bath — these are the five key dates'}
              </p>
            </div>

            {/* Desktop: horizontal. Mobile: vertical */}
            <div className="relative">

              {/* Connecting line — desktop only */}
              <div className="hidden lg:block absolute top-8 left-[8%] right-[8%] h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)' }} />

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 sm:gap-3 lg:gap-4">
                {SHAHI_SNANS.map((snan, idx) => (
                  <div key={idx} className="relative flex flex-col items-center text-center group">

                    {/* Mobile vertical connector */}
                    {idx < SHAHI_SNANS.length - 1 && (
                      <div className="sm:hidden absolute left-8 top-16 h-full w-px" style={{ background: 'linear-gradient(180deg, rgba(201,168,76,0.5), transparent)' }} />
                    )}

                    {/* Node circle */}
                    <div
                      className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center font-serif font-extrabold text-xl transition-all duration-300 group-hover:scale-110"
                      style={snan.highlight ? {
                        background: 'linear-gradient(135deg, #E0C374, #C9A84C)',
                        color: '#1a0404',
                        boxShadow: '0 0 0 4px rgba(201,168,76,0.2), 0 0 30px rgba(201,168,76,0.45)',
                        border: '2px solid rgba(201,168,76,0.8)',
                      } : {
                        background: '#2f0707',
                        color: '#E0C374',
                        border: '2px solid rgba(201,168,76,0.45)',
                        boxShadow: '0 2px 16px rgba(0,0,0,0.3)',
                      }}
                    >
                      {snan.num}
                    </div>

                    {/* Card */}
                    <div
                      className="mt-4 p-4 sm:p-5 rounded-xl w-full max-w-[220px] sm:max-w-none transition-all duration-300 group-hover:shadow-md"
                      style={snan.highlight ? {
                        background: '#2f0707',
                        border: '1.5px solid rgba(201,168,76,0.45)',
                        boxShadow: '0 0 20px rgba(201,168,76,0.12)',
                      } : {
                        background: '#fff',
                        border: '1.5px solid #F0E6D3',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                      }}
                    >
                      <p className="font-serif font-bold text-xs tracking-wide mb-1" style={{ color: snan.highlight ? '#C9A84C' : '#B8501A' }}>
                        {locale === 'hi' ? snan.nameHi : snan.nameEn}
                      </p>
                      <p className="font-bold text-sm" style={{ color: snan.highlight ? '#E0C374' : '#8B1A1A' }}>
                        {locale === 'hi' ? snan.dateHi : snan.dateEn}
                      </p>
                      <p className="text-xs mt-2 leading-relaxed" style={{ color: snan.highlight ? 'rgba(251,245,236,0.60)' : '#6B6B6B' }}>
                        {locale === 'hi' ? snan.noteHi : snan.noteEn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Note */}
            <p className="text-center text-xs text-ink-mute font-serif italic mt-10 max-w-2xl mx-auto">
              {locale === 'hi'
                ? '* सटीक तिथियाँ शासकीय अधिसूचना के बाद घोषित होंगी। पंचांग के अनुसार मामूली परिवर्तन संभव।'
                : '* Exact dates will be confirmed via government notification. Minor variations possible per the panchang.'}
            </p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 4 — COMPLETE GUIDE ARTICLES
        ═══════════════════════════════════════════════════════════ */}
        <section id="guides" className="bg-white py-20 sm:py-28 border-b border-cream">
          <div className="container-page max-w-6xl mx-auto">

            <div className="text-center mb-16">
              <p className="text-saffron-700 font-serif text-sm tracking-[0.35em] uppercase mb-3">
                {locale === 'hi' ? '— प्रामाणिक जानकारी —' : '— Authentic Information —'}
              </p>
              <h2 className="font-serif text-4xl sm:text-5xl font-extrabold text-maroon">
                {locale === 'hi' ? 'सम्पूर्ण मार्गदर्शिका' : 'Complete Guides'}
              </h2>
              <div className="w-20 h-1 mx-auto mt-5 rounded-full" style={{ background: 'linear-gradient(90deg, #D4621A, #C9A84C)' }} />
            </div>

            {list.length === 0 ? (
              <div className="text-center py-16 max-w-xl mx-auto">
                <p className="text-5xl mb-6">ॐ</p>
                <p className="text-xl font-serif text-ink-soft mb-8">
                  {locale === 'hi' ? 'गाइड जल्द उपलब्ध होंगी। अभी सहायता के लिए:' : 'Guides coming soon. For immediate help:'}
                </p>
                <a href={SITE.phoneTel} className="btn-primary shadow-lg text-lg px-8 py-4 inline-flex items-center gap-3">
                  <PhoneCall className="w-5 h-5" /> {SITE.phone}
                </a>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((a) => (
                  <Link
                    key={a.slug}
                    to={`${prefix}${articlePath(a)}`}
                    className="group flex flex-col rounded-2xl overflow-hidden border border-cream shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-white"
                  >
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden bg-maroon-900">
                      {a.heroImage ? (
                        <img
                          src={a.heroImage}
                          alt={a.title[locale]}
                          loading="lazy"
                          width="400"
                          height="210"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gold/30 font-serif text-7xl">ॐ</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-maroon-900/75 via-maroon-900/15 to-transparent" />
                      {/* Badge */}
                      <div className="absolute top-4 left-4">
                        <span
                          className="text-xs font-bold px-3 py-1 rounded-full tracking-wider uppercase shadow-md"
                          style={{ background: 'rgba(201,168,76,0.90)', color: '#1a0404' }}
                        >
                          {locale === 'hi' ? 'सिंहस्थ गाइड' : 'Simhastha Guide'}
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="flex flex-col flex-1 p-6 sm:p-7">
                      <h3 className="font-serif text-xl font-bold text-maroon group-hover:text-saffron-700 transition-colors line-clamp-2 mb-3 leading-snug">
                        {a.title[locale]}
                      </h3>
                      <p className="text-ink-soft text-sm leading-relaxed line-clamp-3 flex-1">
                        {a.shortIntro[locale]}
                      </p>
                      <div className="mt-6 flex items-center gap-2 text-saffron-700 group-hover:text-maroon font-bold text-sm uppercase tracking-wide transition-colors">
                        {locale === 'hi' ? 'पूरा पढ़ें' : 'Read Full Guide'}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 5 — PLANNING ESSENTIALS (dark)
        ═══════════════════════════════════════════════════════════ */}
        <section className="py-20 sm:py-28 border-b border-gold/15" style={{ background: 'linear-gradient(160deg, #200505 0%, #2f0707 50%, #1a0404 100%)' }}>
          <div className="container-page max-w-5xl mx-auto">

            <div className="text-center mb-14">
              <p className="text-gold/60 font-serif text-sm tracking-[0.35em] uppercase mb-3">
                {locale === 'hi' ? '— यात्रा की तीन आवश्यकताएँ —' : '— Three Essentials —'}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold" style={{ color: '#E0C374' }}>
                {locale === 'hi' ? 'अभी से योजना बनाएँ' : 'Plan Early, Travel Easy'}
              </h2>
              <div className="w-16 h-px mx-auto mt-5" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)' }} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
              {ESSENTIALS.map((card, i) => (
                <div
                  key={i}
                  className="flex flex-col p-7 rounded-2xl transition-all duration-300"
                  style={{
                    background: 'rgba(48, 7, 7, 0.7)',
                    border: '1.5px solid rgba(201,168,76,0.18)',
                    backdropFilter: 'blur(4px)',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,168,76,0.50)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,168,76,0.18)'; }}
                >
                  <div className="text-4xl mb-5 select-none">{card.icon}</div>
                  <h3 className="font-serif text-xl font-bold mb-3" style={{ color: '#E0C374' }}>
                    {locale === 'hi' ? card.titleHi : card.titleEn}
                  </h3>
                  <p className="text-sm leading-relaxed flex-1" style={{ color: 'rgba(251,245,236,0.65)' }}>
                    {locale === 'hi' ? card.descHi : card.descEn}
                  </p>
                  {card.isExternal ? (
                    <a
                      href={card.href}
                      className="mt-6 inline-flex items-center gap-2 font-bold text-sm transition-colors"
                      style={{ color: '#C9A84C' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#E0C374'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#C9A84C'; }}
                    >
                      {locale === 'hi' ? card.ctaHi : card.ctaEn}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  ) : (
                    <Link
                      to={card.href}
                      className="mt-6 inline-flex items-center gap-2 font-bold text-sm transition-colors"
                      style={{ color: '#C9A84C' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#E0C374'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#C9A84C'; }}
                    >
                      {locale === 'hi' ? card.ctaHi : card.ctaEn}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Urgency note */}
            <div className="mt-12 text-center">
              <p className="font-serif text-base italic" style={{ color: 'rgba(201,168,76,0.65)' }}>
                {locale === 'hi'
                  ? '⚠ सिंहस्थ 2028 के दौरान आवास और यातायात बुकिंग बहुत जल्दी भर जाती है — अभी योजना बनाएँ।'
                  : '⚠ Accommodation and transport for Simhastha 2028 will fill months in advance — start planning now.'}
              </p>
              <a
                href={SITE.phoneTel}
                className="mt-6 inline-flex items-center gap-3 font-bold px-8 py-4 rounded-full text-base transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #E0C374 0%, #C9A84C 100%)',
                  color: '#1a0404',
                  boxShadow: '0 0 30px rgba(201,168,76,0.30)',
                }}
              >
                <PhoneCall className="w-5 h-5" />
                {locale === 'hi' ? `${SITE.phone} — अभी कॉल करें` : `Call ${SITE.phone} Now`}
              </a>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 6 — GLOBAL LEAD CTA
        ═══════════════════════════════════════════════════════════ */}
        <GlobalLeadSection sourcePage="simhastha-landing" defaultService="simhastha" />

      </Layout>
    </>
  );
}

