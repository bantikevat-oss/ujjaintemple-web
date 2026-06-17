import { Link } from 'react-router-dom';
import { MapPin, Phone, Building2, Clock, ShieldCheck, BadgeCheck } from 'lucide-react';
import { useI18n } from '../../i18n';

/* ─── Trishul SVG ─────────────────────────────────────────────────────────── */
function Trishul() {
  return (
    <svg width="30" height="50" viewBox="0 0 30 50" fill="none" aria-hidden>
      <defs>
        <linearGradient id="trg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#FFF5B0" />
          <stop offset="35%"  stopColor="#FFD700" />
          <stop offset="65%"  stopColor="#C8970A" />
          <stop offset="100%" stopColor="#8B6914" />
        </linearGradient>
      </defs>
      {/* Center prong */}
      <path d="M15 0C15 0 12 7 12 12C12 16 13.2 18 15 20C16.8 18 18 16 18 12C18 7 15 0 15 0Z"
        fill="url(#trg)" />
      {/* Left prong */}
      <path d="M7 5C7 5 5 9.5 5 12.5C5 15.5 6 17 7.5 18L9 16.5C9.5 15 10 13.5 10 12C10 9 7 5 7 5Z"
        fill="url(#trg)" />
      {/* Right prong */}
      <path d="M23 5C23 5 20 9 20 12C20 13.5 20.5 15 21 16.5L22.5 18C24 17 25 15.5 25 12.5C25 9.5 23 5 23 5Z"
        fill="url(#trg)" />
      {/* Cross bar */}
      <rect x="4" y="19" width="22" height="2.5" rx="1.2" fill="url(#trg)" />
      {/* Staff */}
      <rect x="13.8" y="21" width="2.4" height="22" rx="1" fill="url(#trg)" />
      {/* Base knob */}
      <ellipse cx="15" cy="44" rx="4.5" ry="3" fill="url(#trg)" opacity="0.85" />
      <ellipse cx="15" cy="47" rx="2.5" ry="1.5" fill="url(#trg)" opacity="0.6" />
    </svg>
  );
}

/* ─── Temple silhouette icon ──────────────────────────────────────────────── */
function TempleIcon({ v = 0 }: { v?: number }) {
  const configs = [
    { ry1: 11, ry2: 16 }, // tall
    { ry1: 9,  ry2: 13 }, // shorter
    { ry1: 13, ry2: 18 }, // tallest
    { ry1: 10, ry2: 14 }, // medium
    { ry1: 8,  ry2: 12 }, // shortest
  ];
  const { ry1, ry2 } = configs[v % 5];
  return (
    <svg width="20" height="28" viewBox="0 0 20 28" fill="none" aria-hidden>
      <defs>
        <linearGradient id={`tig${v}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#FFE566" />
          <stop offset="100%" stopColor="#C8970A" />
        </linearGradient>
      </defs>
      <circle cx="10" cy="2" r="2" fill={`url(#tig${v})`} />
      <rect x="9" y="3" width="2" height="3" fill={`url(#tig${v})`} />
      <ellipse cx="10" cy="8" rx="5.5" ry="2.2" fill={`url(#tig${v})`} opacity="0.8" />
      <path d={`M10 ${ry1-4} Q7 ${ry1} 5 ${ry2} L15 ${ry2} Q13 ${ry1} 10 ${ry1-4}Z`}
        fill={`url(#tig${v})`} opacity="0.85" />
      <rect x="3" y={ry2} width="14" height="2.5" rx="0.5" fill={`url(#tig${v})`} opacity="0.75" />
      <rect x="1" y={ry2+2.5} width="18" height="2" rx="0.5" fill={`url(#tig${v})`} opacity="0.55" />
    </svg>
  );
}

/* ─── Stat icon circle ────────────────────────────────────────────────────── */
function StatCircle({ icon }: { icon: string }) {
  const cls = 'w-3.5 h-3.5 text-gold';
  const el = {
    building: <Building2 className={cls} />,
    clock:    <Clock className={cls} />,
    shield:   <ShieldCheck className={cls} />,
    check:    <BadgeCheck className={cls} />,
  }[icon] ?? <BadgeCheck className={cls} />;
  return (
    <div className="w-8 h-8 rounded-full border border-gold/40 flex items-center justify-center flex-shrink-0"
      style={{ background: 'rgba(212,175,55,0.08)' }}>
      {el}
    </div>
  );
}

/* ─── Main hero ──────────────────────────────────────────────────────────── */
export function HomeGraphicHero() {
  const { locale } = useI18n();
  const prefix = locale === 'hi' ? '' : '/en';

  const t = {
    hi: {
      om:      '|| ॐ नमः शिवाय ||',
      h1:      'उज्जैन',
      sub:     'महाकाल की नगरी',
      tagline: 'आस्था, अध्यात्म और चमत्कारों की पावन भूमि',
      ctaA:    'मंदिर दर्शन करें',
      ctaB:    'अभी कॉल करें',
      caption: 'महाकालेश्वर मंदिर, उज्जैन',
      temples: [
        { name: 'महाकालेश्वर', type: 'ज्योतिर्लिंग' },
        { name: 'काल भैरव',    type: 'भगवान' },
        { name: 'हरसिद्धि माता', type: 'शक्ति पीठ' },
        { name: 'मंगलनाथ',    type: 'मंदिर' },
        { name: 'रामघाट',     type: 'पवित्र स्थल' },
      ],
      stats: [
        { icon: 'building', val: '100+',   label: 'प्रमुख मंदिर' },
        { icon: 'clock',    val: '24/7',   label: 'दर्शन सुविधा' },
        { icon: 'shield',   val: 'सुरक्षित', label: 'श्रेष्ठ अनुभव' },
        { icon: 'check',    val: 'आसान',   label: 'बुकिंग' },
      ],
    },
    en: {
      om:      '|| Om Namah Shivay ||',
      h1:      'Ujjain',
      sub:     'City of Mahakal',
      tagline: 'Sacred land of faith, spirituality and miracles',
      ctaA:    'Visit Temples',
      ctaB:    'Call Now',
      caption: 'Mahakaleshwar Temple, Ujjain',
      temples: [
        { name: 'Mahakaleshwar', type: 'Jyotirlinga' },
        { name: 'Kal Bhairav',   type: 'Deity' },
        { name: 'Harsiddhi Mata', type: 'Shakti Peeth' },
        { name: 'Mangalnath',    type: 'Temple' },
        { name: 'Ramghat',       type: 'Sacred Site' },
      ],
      stats: [
        { icon: 'building', val: '100+',  label: 'Major Temples' },
        { icon: 'clock',    val: '24/7',  label: 'Darshan Access' },
        { icon: 'shield',   val: 'Safe',  label: 'Best Experience' },
        { icon: 'check',    val: 'Easy',  label: 'Booking' },
      ],
    },
  }[locale];

  return (
    <section
      className="relative overflow-hidden flex flex-col lg:flex-row"
      style={{ minHeight: 'clamp(640px, 100svh, 980px)' }}
    >
      {/* ── CSS animations ── */}
      <style>{`
        @keyframes heroKB {
          from { transform: scale(1.06); }
          to   { transform: scale(1.0); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .hf1 { animation: fadeUp .8s ease-out .05s both; }
        .hf2 { animation: fadeUp .8s ease-out .18s both; }
        .hf3 { animation: fadeUp .8s ease-out .30s both; }
        .hf4 { animation: fadeUp .8s ease-out .42s both; }
        .hf5 { animation: fadeUp .8s ease-out .54s both; }
        .hf6 { animation: fadeUp .8s ease-out .66s both; }
        .hf7 { animation: fadeUp .8s ease-out .78s both; }
        .hero-photo { animation: heroKB 9s ease-out forwards; }
      `}</style>

      {/* ── Full-bleed image — entire section background ── */}
      <img
        src="/images/hero/hero.png"
        alt={t.caption}
        className="hero-photo absolute inset-0 w-full h-full object-cover object-right z-0"
        style={{ filter: 'brightness(0.88) saturate(0.92) contrast(1.04)' }}
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />

      {/* Minimal left-side text readability overlay — very light */}
      <div className="absolute inset-0 z-[1] pointer-events-none" style={{
        background: 'linear-gradient(to right, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.12) 35%, transparent 65%)',
      }} />
      {/* Top vignette */}
      <div className="absolute inset-x-0 top-0 z-[1] pointer-events-none" style={{
        height: '22%',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 100%)',
      }} />
      {/* Bottom vignette */}
      <div className="absolute inset-x-0 bottom-0 z-[1] pointer-events-none" style={{
        height: '22%',
        background: 'linear-gradient(to top, rgba(0,0,0,0.60) 0%, transparent 100%)',
      }} />

      {/* Caption badge */}
      <div className="hidden lg:block absolute bottom-8 right-8 z-20">
        <span className="rounded-full border border-gold/30 bg-black/50 px-3 py-1.5
          text-[10px] font-medium tracking-widest backdrop-blur-sm"
          style={{ color: 'rgba(212,175,55,0.75)' }}>
          {t.caption}
        </span>
      </div>

      {/* ════════════════════════════════════════════
          TEXT CONTENT — floats over image, no background
      ════════════════════════════════════════════ */}
      <div
        className="relative z-10 flex flex-col items-center lg:items-start justify-center
          w-full lg:w-[52%] flex-shrink-0
          px-6 sm:px-10 lg:pl-14 xl:pl-20 lg:pr-6
          py-14 sm:py-16 lg:py-12"
        style={{ minHeight: 'clamp(640px, 100svh, 980px)' }}
      >
        {/* no background — image already dark on left */}

        {/* || ॐ नमः शिवाय || */}
        <p className="hf1 relative font-serif italic tracking-[0.22em] mb-3"
          style={{ fontSize: 'clamp(0.7rem, 1.2vw, 0.88rem)', color: 'rgba(212,175,55,0.72)' }}>
          {t.om}
        </p>

        {/* Trishul + ornament lines */}
        <div className="hf2 relative flex items-center gap-3 w-full max-w-xs lg:max-w-sm mb-4">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.55))' }} />
          <Trishul />
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(212,175,55,0.55))' }} />
        </div>

        {/* H1 — gold metallic text */}
        <h1
          className="hf3 relative font-sanskrit font-black tracking-tight"
          style={{ fontSize: 'clamp(4.5rem, 12vw, 10.5rem)' }}
        >
          <span style={{
            display: 'inline-block',
            lineHeight: 1.35,
            padding: '0.42em 0.1em 0.22em 0',
            background: 'linear-gradient(to bottom, #FFF9C4 0%, #FFE566 12%, #D4AF37 32%, #A07828 52%, #D4AF37 70%, #FFE566 86%, #FFF9C4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.85))',
          }}>
            {t.h1}
          </span>
        </h1>

        {/* Subtitle */}
        <h2
          className="hf4 relative font-serif font-bold text-white mt-1"
          style={{
            fontSize: 'clamp(1.4rem, 3.5vw, 2.9rem)',
            textShadow: '0 2px 16px rgba(0,0,0,0.7)',
            letterSpacing: '0.02em',
          }}
        >
          {t.sub}
        </h2>

        {/* Tagline */}
        <p
          className="hf4 relative font-serif mt-2 max-w-md"
          style={{
            fontSize: 'clamp(0.78rem, 1.4vw, 1rem)',
            color: 'rgba(255,245,220,0.68)',
          }}
        >
          {t.tagline}
        </p>

        {/* ── 5 temple badges ── */}
        <div className="hf5 relative mt-7 flex items-stretch">
          {t.temples.map((tm, i) => (
            <div
              key={tm.name}
              className="flex flex-col items-center gap-1 px-3 first:pl-0"
              style={{ borderRight: i < t.temples.length - 1 ? '1px solid rgba(212,175,55,0.22)' : 'none' }}
            >
              <TempleIcon v={i} />
              <p className="text-white font-semibold text-center leading-tight"
                style={{ fontSize: 'clamp(0.6rem, 1vw, 0.75rem)' }}>{tm.name}</p>
              <p className="text-center leading-tight"
                style={{ fontSize: 'clamp(0.52rem, 0.85vw, 0.65rem)', color: 'rgba(212,175,55,0.65)' }}>{tm.type}</p>
            </div>
          ))}
        </div>

        {/* ── CTA buttons ── */}
        <div className="hf6 relative mt-7 flex flex-wrap justify-center lg:justify-start gap-3">
          <Link
            to={`${prefix}/mandirs/`}
            className="inline-flex items-center gap-2.5 font-bold rounded-md
              transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #C8970A 100%)',
              color: '#1a0500',
              padding: 'clamp(10px,1.5vw,14px) clamp(18px,2.5vw,28px)',
              fontSize: 'clamp(0.78rem, 1.3vw, 0.92rem)',
              boxShadow: '0 6px 28px rgba(0,0,0,0.55), 0 0 0 1px rgba(212,175,55,0.35)',
            }}
          >
            <MapPin className="w-4 h-4 flex-shrink-0" />
            {t.ctaA}
          </Link>
          <a
            href="tel:+917400724456"
            className="inline-flex items-center gap-2.5 font-semibold rounded-md backdrop-blur-sm
              transition-all duration-200 hover:-translate-y-0.5"
            style={{
              border: '1px solid rgba(212,175,55,0.45)',
              color: 'rgba(255,245,210,0.92)',
              background: 'rgba(212,175,55,0.08)',
              padding: 'clamp(10px,1.5vw,14px) clamp(18px,2.5vw,28px)',
              fontSize: 'clamp(0.78rem, 1.3vw, 0.92rem)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}
          >
            <Phone className="w-4 h-4 flex-shrink-0" />
            {t.ctaB}
          </a>
        </div>

      </div>


      {/* Gold top bar */}
      <div className="absolute inset-x-0 top-0 z-30 h-[3px]
        bg-gradient-to-r from-transparent via-gold to-transparent" />

      {/* Gold bottom bar */}
      <div className="absolute inset-x-0 bottom-0 z-30 h-[3px]
        bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
    </section>
  );
}
