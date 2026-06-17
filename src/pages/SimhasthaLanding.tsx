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
const SIMHASTHA_START = new Date('2028-04-09T00:00:00');

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
  { numHi: '30 दिन',     numEn: '30 Days',     labelHi: 'महापर्व अवधि',         labelEn: 'Festival Duration' },
  { numHi: '3',           numEn: '3',            labelHi: 'शाही स्नान',            labelEn: 'Shahi Snans' },
  { numHi: '13',          numEn: '13',           labelHi: 'अखाड़े',               labelEn: 'Akhadas' },
  { numHi: '30 करोड़+',  numEn: '30 Crore+',   labelHi: 'श्रद्धालु (अनुमानित)', labelEn: 'Expected Pilgrims' },
];

// Official data — Ujjain Police Simhastha 2028 presentation
const SHAHI_SNANS = [
  {
    num: 1,
    dateHi: '27 मार्च 2028 (सोमवार)',   dateEn: '27 Mar 2028 (Monday)',
    nameHi: 'प्रथम पेशवाई',   nameEn: 'First Peshwai',
    noteHi: 'अखाड़ों का भव्य प्रवेश — सिंहस्थ की औपचारिक शुरुआत', noteEn: 'Grand entry of Akhadas — official commencement',
    highlight: false,
  },
  {
    num: 2,
    dateHi: '09 अप्रैल 2028 (रविवार)',   dateEn: '09 Apr 2028 (Sunday)',
    nameHi: 'प्रथम शाही स्नान — चैत्र पूर्णिमा',   nameEn: 'First Shahi Snan — Chaitra Purnima',
    noteHi: 'पहला शाही स्नान — सिंहस्थ की शुरुआत', noteEn: 'First Shahi Snan — Simhastha Opens',
    highlight: true,
  },
  {
    num: 3,
    dateHi: '19–24 अप्रैल 2028 (6 दिन)',   dateEn: '19–24 Apr 2028 (6 days)',
    nameHi: 'पंचकोशी यात्रा',   nameEn: 'Panchkoshi Yatra',
    noteHi: '6 दिन की पवित्र परिक्रमा — उज्जैन के बाहरी क्षेत्र की पैदल यात्रा', noteEn: '6-day sacred circumambulation of greater Ujjain',
    highlight: false,
  },
  {
    num: 4,
    dateHi: '24 अप्रैल 2028 (सोमवार)',   dateEn: '24 Apr 2028 (Monday)',
    nameHi: 'सोमवती अमावस्या — वैशाख कृष्ण',   nameEn: 'Somvati Amavasya — Vaisakh Krishna',
    noteHi: 'पितृ तर्पण और स्नान का खास दिन', noteEn: 'Special day for ancestral offerings and snan',
    highlight: false,
  },
  {
    num: 5,
    dateHi: '27 अप्रैल 2028 (गुरुवार)',  dateEn: '27 Apr 2028 (Thursday)',
    nameHi: 'द्वितीय शाही स्नान — अक्षय तृतीया',  nameEn: 'Second Shahi Snan — Akshaya Tritiya',
    noteHi: 'दूसरा शाही स्नान — अक्षय पुण्य का दिन', noteEn: 'Second Shahi Snan — Akshaya Merit',
    highlight: true,
  },
  {
    num: 6,
    dateHi: '08 मई 2028 (सोमवार)',       dateEn: '08 May 2028 (Monday)',
    nameHi: 'तृतीय शाही स्नान — वैशाख पूर्णिमा',  nameEn: 'Third Shahi Snan — Vaisakh Purnima',
    noteHi: 'तीसरा और आखिरी शाही स्नान — सिंहस्थ का समापन', noteEn: 'Third & Final Shahi Snan — Simhastha Closes',
    highlight: true,
  },
];

// 13 अखाड़े — Official list from Ujjain Police
const AKHADAS = {
  shaiv: {
    titleHi: 'शैव सम्प्रदाय — 7 अखाड़े',
    titleEn: 'Shaiv Sampradaya — 7 Akhadas',
    areaHi: 'दत्त भखाड़ा होलकर, बहरमपुर रोड',
    areaEn: 'Datt Bakhada Holkar, Bahrampur Road',
    list: [
      { hi: 'जूना अखाड़ा', en: 'Juna Akhada' },
      { hi: 'आव्हान अखाड़ा', en: 'Avahan Akhada' },
      { hi: 'अग्नि अखाड़ा', en: 'Agni Akhada' },
      { hi: 'महानिर्वाणी अखाड़ा', en: 'Mahanirvani Akhada' },
      { hi: 'अटल अखाड़ा', en: 'Atal Akhada' },
      { hi: 'निरंजनी अखाड़ा', en: 'Niranjani Akhada' },
      { hi: 'आनंद अखाड़ा', en: 'Anand Akhada' },
    ],
    color: '#1e3a5c',
  },
  vaishnav: {
    titleHi: 'वैष्णव सम्प्रदाय — 3 अखाड़े',
    titleEn: 'Vaishnav Sampradaya — 3 Akhadas',
    areaHi: 'मरकाला (चिंतामणि) क्षेत्र',
    areaEn: 'Markala (Chintamani) area',
    list: [
      { hi: 'निर्वाणी अखाड़ा', en: 'Nirvani Akhada' },
      { hi: 'श्री दिगम्बर अखाड़ा', en: 'Shri Digambar Akhada' },
      { hi: 'निर्मोही अखाड़ा', en: 'Nirmohi Akhada' },
    ],
    color: '#c66d1f',
  },
  udasin: {
    titleHi: 'उदासीन एवं निर्मल — 3 अखाड़े',
    titleEn: 'Udasin & Nirmal — 3 Akhadas',
    areaHi: 'सम्भायती एवं बहरमपुर रोड',
    areaEn: 'Sambhayati & Bahrampur Road',
    list: [
      { hi: 'पंचायती बड़ा उदासीन', en: 'Panchayati Bada Udasin' },
      { hi: 'नया उदासीन अखाड़ा', en: 'Naya Udasin Akhada' },
      { hi: 'निर्मल अखाड़ा', en: 'Nirmal Akhada' },
    ],
    color: '#2d5a3d',
  },
} as const;

// Security & infrastructure — Ujjain Police official data
const POLICE_FACTS = [
  { numHi: '62,950', numEn: '62,950', labelHi: 'सुरक्षा बल', labelEn: 'Security Force' },
  { numHi: '3,500',  numEn: '3,500',  labelHi: 'AI CCTV कैमरे', labelEn: 'AI CCTV Cameras' },
  { numHi: '3,000',  numEn: '3,000',  labelHi: 'हेक्टेयर मेला क्षेत्र', labelEn: 'Hectares Mela Area' },
  { numHi: '10',     numEn: '10',     labelHi: 'जोन', labelEn: 'Zones' },
  { numHi: '40',     numEn: '40',     labelHi: 'सेक्टर', labelEn: 'Sectors' },
  { numHi: '80',     numEn: '80',     labelHi: 'थाने', labelEn: 'Police Stations' },
  { numHi: '500+',   numEn: '500+',   labelHi: 'राजपत्रित अधिकारी', labelEn: 'Gazetted Officers' },
  { numHi: '100+',   numEn: '100+',   labelHi: 'पार्किंग स्थल', labelEn: 'Parking Spots' },
  { numHi: '2.20 लाख', numEn: '2.20 Lakh', labelHi: 'वाहन क्षमता', labelEn: 'Vehicle Capacity' },
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
    ? 'सिंहस्थ महाकुम्भ 2028 (09 अप्रैल — 08 मई · 30 दिन) — 3 शाही स्नान, 13 अखाड़े, कल्पवास, होटल, ट्रांसपोर्ट की पूरी जानकारी। 30 करोड़+ श्रद्धालुओं का महापर्व। मदद: +91 74007 24456'
    : 'Simhastha Mahakumbh 2028 (09 April – 08 May · 30 days) — 3 Shahi Snans, 13 Akhadas, Kalpvas, hotels, transport. Guide for 30 crore+ pilgrims.';

  const ESSENTIALS = [
    {
      icon: '🛕',
      titleHi: 'होटल बुकिंग',
      titleEn: 'Accommodation',
      descHi: 'सिंहस्थ नगर की कुटिया, होटल, धर्मशाला — शाही स्नान वाले दिनों में जगह बहुत कम मिलती है। 6–8 महीने पहले बुकिंग करवा लें।',
      descEn: 'MP Tourism kutiyas, hotels, dharmshalas — extremely limited on Shahi Snan dates. Book 6–8 months in advance.',
      href: SITE.phoneTel,
      isExternal: true,
      ctaHi: 'बुकिंग में मदद लें',
      ctaEn: 'Booking Help',
    },
    {
      icon: '🚂',
      titleHi: 'कैसे पहुँचें',
      titleEn: 'Travel Planning',
      descHi: 'दिल्ली, मुम्बई, अहमदाबाद से सीधी ट्रेन आती है। इंदौर एयरपोर्ट से 55 किमी दूर है। सिंहस्थ के समय खास ट्रेनें भी चलती हैं।',
      descEn: 'Direct trains from Delhi, Mumbai, Ahmedabad. 55 km from Indore airport. Special trains run during Simhastha.',
      href: `${prefix}/transport-in-ujjain/`,
      isExternal: false,
      ctaHi: 'ट्रांसपोर्ट गाइड',
      ctaEn: 'Transport Guide',
    },
    {
      icon: '📅',
      titleHi: 'कब जाएँ',
      titleEn: 'When to Go',
      descHi: 'कल्पवास: पूरे 30 दिन चलता है। शाही स्नान: 3 हैं (09 अप्रैल, 27 अप्रैल, 08 मई)। परिवार के साथ जाना है तो वैशाख पूर्णिमा (08 मई 2028) सबसे अच्छा दिन है।',
      descEn: 'Kalpvas: all 30 days. 3 Shahi Snans (09 Apr, 27 Apr, 08 May). For families, target Vaisakh Purnima (08 May 2028).',
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
                  ? '09 अप्रैल — 08 मई  ·  शिप्रा तट, उज्जैन'
                  : '09 April — 08 May  ·  Shipra Ghat, Ujjain'}
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

              {/* Horizontal connecting line — desktop only (6 cards on one row) */}
              <div className="hidden lg:block absolute top-6 left-[6%] right-[6%] h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)' }} />

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {SHAHI_SNANS.map((snan, idx) => (
                  <div key={idx} className="relative flex flex-col items-center text-center group">

                    {/* Node circle */}
                    <div
                      className="relative z-10 w-12 h-12 lg:w-12 lg:h-12 rounded-full flex items-center justify-center font-serif font-extrabold text-base transition-all duration-300 group-hover:scale-110"
                      style={snan.highlight ? {
                        background: 'linear-gradient(135deg, #E0C374, #C9A84C)',
                        color: '#1a0404',
                        boxShadow: '0 0 0 3px rgba(201,168,76,0.2), 0 0 20px rgba(201,168,76,0.4)',
                        border: '2px solid rgba(201,168,76,0.8)',
                      } : {
                        background: '#2f0707',
                        color: '#E0C374',
                        border: '2px solid rgba(201,168,76,0.45)',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                      }}
                    >
                      {snan.num}
                    </div>

                    {/* Card */}
                    <div
                      className="mt-3 p-3 rounded-xl w-full transition-all duration-300 group-hover:shadow-md"
                      style={snan.highlight ? {
                        background: '#2f0707',
                        border: '1.5px solid rgba(201,168,76,0.45)',
                        boxShadow: '0 0 16px rgba(201,168,76,0.12)',
                      } : {
                        background: '#fff',
                        border: '1.5px solid #F0E6D3',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                      }}
                    >
                      <p className="font-serif font-bold text-[10px] sm:text-[11px] tracking-wide mb-1 leading-tight" style={{ color: snan.highlight ? '#C9A84C' : '#B8501A' }}>
                        {locale === 'hi' ? snan.nameHi : snan.nameEn}
                      </p>
                      <p className="font-bold text-[11px] sm:text-xs leading-tight" style={{ color: snan.highlight ? '#E0C374' : '#8B1A1A' }}>
                        {locale === 'hi' ? snan.dateHi : snan.dateEn}
                      </p>
                      <p className="text-[10px] sm:text-[11px] mt-2 leading-snug" style={{ color: snan.highlight ? 'rgba(251,245,236,0.60)' : '#6B6B6B' }}>
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
                ? '* सटीक तिथियाँ सरकारी सूचना के बाद घोषित होंगी। पंचांग के अनुसार थोड़ा-बहुत बदलाव हो सकता है।'
                : '* Exact dates will be confirmed via government notification. Minor variations possible per the panchang.'}
            </p>
            <p className="text-center text-[11px] text-ink-mute/70 font-serif italic mt-2 max-w-2xl mx-auto">
              {locale === 'hi' ? 'स्रोत: उज्जैन पुलिस — सिंहस्थ महाकुम्भ 2028 आधिकारिक प्रस्तुति' : 'Source: Ujjain Police — Simhastha Mahakumbh 2028 official presentation'}
            </p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 3B — 13 AKHADAS (Official Ujjain Police data)
        ═══════════════════════════════════════════════════════════ */}
        <section id="akhadas" className="bg-cream py-20 sm:py-24 border-b border-cream-dark">
          <div className="container-page max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-saffron-700 font-serif text-sm tracking-[0.35em] uppercase mb-3">
                {locale === 'hi' ? '— 13 अखाड़े —' : '— 13 Akhadas —'}
              </p>
              <h2 className="font-serif text-4xl sm:text-5xl font-extrabold text-maroon">
                {locale === 'hi' ? 'अखाड़ों का परिचय' : 'The 13 Akhadas'}
              </h2>
              <div className="w-20 h-1 mx-auto mt-5 rounded-full" style={{ background: 'linear-gradient(90deg, #D4621A, #C9A84C)' }} />
              <p className="mt-5 text-ink-soft text-base max-w-2xl mx-auto">
                {locale === 'hi'
                  ? 'सिंहस्थ 2028 में तीन परम्पराओं के कुल 13 अखाड़े हिस्सा लेंगे — शैव, वैष्णव और उदासीन-निर्मल।'
                  : 'Three traditions, 13 Akhadas participating in Simhastha 2028 — Shaiv, Vaishnav and Udasin-Nirmal.'}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {Object.values(AKHADAS).map((group, gi) => (
                <div key={gi} className="rounded-2xl overflow-hidden border border-cream-dark bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="px-5 py-4 text-white" style={{ background: group.color }}>
                    <p className="font-bold text-sm">
                      {locale === 'hi' ? group.titleHi : group.titleEn}
                    </p>
                    <p className="text-[11px] opacity-80 mt-1">
                      {locale === 'hi' ? group.areaHi : group.areaEn}
                    </p>
                  </div>
                  <ul className="divide-y divide-cream-dark">
                    {group.list.map((item, ii) => (
                      <li key={ii} className="px-5 py-3 text-sm text-ink-soft flex items-center gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold" style={{ background: `${group.color}15`, color: group.color }}>
                          {ii + 1}
                        </span>
                        {locale === 'hi' ? item.hi : item.en}
                      </li>
                    ))}
                  </ul>
                  <div className="px-5 py-3 text-center text-xs font-bold text-white" style={{ background: group.color }}>
                    {locale === 'hi' ? `कुल: ${group.list.length} अखाड़े` : `Total: ${group.list.length} Akhadas`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 3C — Security & Infrastructure (Police data)
        ═══════════════════════════════════════════════════════════ */}
        <section className="bg-gradient-to-br from-maroon-950 to-maroon py-20 sm:py-24 border-b border-cream-dark">
          <div className="container-page max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-gold font-serif text-sm tracking-[0.35em] uppercase mb-3">
                {locale === 'hi' ? '— सुरक्षा एवं व्यवस्था —' : '— Security & Infrastructure —'}
              </p>
              <h2 className="font-serif text-4xl sm:text-5xl font-extrabold text-cream">
                {locale === 'hi' ? 'सिंहस्थ 2028 का प्रबंध' : 'Simhastha 2028 Management'}
              </h2>
              <div className="w-20 h-1 mx-auto mt-5 rounded-full" style={{ background: 'linear-gradient(90deg, #D4621A, #C9A84C)' }} />
              <p className="mt-5 text-cream/70 text-base max-w-2xl mx-auto">
                {locale === 'hi'
                  ? 'उज्जैन पुलिस की आधिकारिक तैयारी — आधुनिक तकनीक के साथ श्रद्धालुओं की सुरक्षा।'
                  : 'Official preparation by Ujjain Police — modern tech for devotee safety.'}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
              {POLICE_FACTS.map((fact, idx) => (
                <div key={idx} className="rounded-xl border border-gold/30 bg-maroon-900/50 backdrop-blur p-5 text-center hover:border-gold/60 transition-colors">
                  <p className="font-serif text-2xl sm:text-3xl font-extrabold text-gold">
                    {locale === 'hi' ? fact.numHi : fact.numEn}
                  </p>
                  <p className="text-[11px] sm:text-xs text-cream/80 mt-2 leading-tight">
                    {locale === 'hi' ? fact.labelHi : fact.labelEn}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-center text-[11px] text-cream/50 font-serif italic mt-8">
              {locale === 'hi' ? 'स्रोत: उज्जैन पुलिस — सिंहस्थ महाकुम्भ 2028 आधिकारिक प्रस्तुति' : 'Source: Ujjain Police — Simhastha Mahakumbh 2028 official presentation'}
            </p>
            <p className="text-center text-xs text-cream/70 mt-3">
              {locale === 'hi' ? 'AI-CCTV · ड्रोन (UAV) · ICCC अत्याधुनिक निगरानी प्रणाली' : 'AI-CCTV · Drones (UAV) · ICCC advanced surveillance system'}
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
                  ? '⚠ सिंहस्थ 2028 के समय होटल और ट्रेन-कैब की बुकिंग बहुत जल्दी फुल हो जाती है — अभी से प्लानिंग शुरू कर दें।'
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

