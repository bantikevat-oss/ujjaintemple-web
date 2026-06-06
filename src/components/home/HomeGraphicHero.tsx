import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '../../i18n';

/* ─── Side lotus (same Prokerala style as puja pages, larger) ────────────── */
function SideLotus({ flip = false }: { flip?: boolean }) {
  const id = flip ? 'R' : 'L';
  return (
    <svg viewBox="0 0 130 560" fill="none" className="h-full w-auto"
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}>
      <defs>
        <radialGradient id={`hLG${id}`} cx="20%" cy="50%">
          <stop offset="0%" stopColor="#FF8C00" />
          <stop offset="50%" stopColor="#CC2200" />
          <stop offset="100%" stopColor="#6B0000" />
        </radialGradient>
        <radialGradient id={`hIG${id}`} cx="50%" cy="50%">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.2" />
        </radialGradient>
      </defs>
      {/* Main petals */}
      {Array.from({ length: 16 }, (_, i) => ({
        angle: i * (190 / 15) - 95,
        ry: 85 + (i % 3) * 14,
        rx: 20 + (i % 2) * 6,
        op: 0.6 + (i % 5) * 0.07,
      })).map((p, i) => (
        <ellipse key={i} cx="0" cy="280" rx={p.rx} ry={p.ry}
          fill={`url(#hLG${id})`} opacity={p.op}
          transform={`rotate(${p.angle} 0 280)`} />
      ))}
      {/* Inner petals */}
      {Array.from({ length: 10 }, (_, i) => ({
        angle: i * (180 / 9) - 90,
        ry: 52 + (i % 2) * 10,
      })).map((p, i) => (
        <ellipse key={`s${i}`} cx="0" cy="280" rx="12" ry={p.ry}
          fill="#FF6B00" opacity="0.38"
          transform={`rotate(${p.angle} 0 280)`} />
      ))}
      {/* Golden center */}
      <circle cx="0" cy="280" r="34" fill={`url(#hIG${id})`} opacity="0.55" />
      <circle cx="0" cy="280" r="20" fill="#D4AF37" opacity="0.45" />
      <circle cx="0" cy="280" r="10" fill="#FFD700" opacity="0.65" />
      {/* Decorative dots */}
      {Array.from({ length: 10 }, (_, i) => (
        <g key={`d${i}`}>
          <circle cx="15" cy={80 + i * 42} r="3.5" fill="#D4AF37" opacity="0.5" />
          <circle cx="7" cy={80 + i * 42} r="1.8" fill="#FF8C00" opacity="0.4" />
        </g>
      ))}
      {/* Dashed border line */}
      <line x1="28" y1="30" x2="28" y2="530" stroke="#D4AF37"
        strokeWidth="0.8" opacity="0.3" strokeDasharray="4 10" />
    </svg>
  );
}

/* ─── Mahakaleshwar temple silhouette SVG ────────────────────────────────── */
function TempleSVG() {
  return (
    <svg viewBox="0 0 220 380" fill="none" className="w-full h-full drop-shadow-[0_0_40px_rgba(212,175,55,0.3)]">
      <defs>
        <linearGradient id="tgV" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFE566" />
          <stop offset="40%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#8B6914" />
        </linearGradient>
        <linearGradient id="tgH" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B6914" />
          <stop offset="50%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#8B6914" />
        </linearGradient>
        <radialGradient id="tgGlow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Glow halo behind temple */}
      <ellipse cx="110" cy="190" rx="95" ry="140" fill="url(#tgGlow)" />

      {/* ── KALASHA (top finial) ── */}
      <circle cx="110" cy="10" r="8" fill="url(#tgV)" />
      <rect x="106" y="18" width="8" height="16" fill="url(#tgV)" />
      {/* Decorative rings on kalasha */}
      {[22, 27, 32].map((y) => (
        <ellipse key={y} cx="110" cy={y} rx="7" ry="2.5" fill="url(#tgH)" opacity="0.7" />
      ))}

      {/* ── AMALAKA (ribbed disc) ── */}
      <ellipse cx="110" cy="42" rx="26" ry="11" fill="url(#tgH)" />
      {/* Amalaka ribs */}
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * 45 * Math.PI) / 180;
        return (
          <path key={i}
            d={`M${110 + 3 * Math.cos(a)} ${42 + 3 * Math.sin(a * 0.4)}
               Q${110 + 20 * Math.cos(a)} ${42 + 8 * Math.sin(a * 0.4)}
               ${110 + 26 * Math.cos(a)} ${42 + 11 * Math.sin(a * 0.4)}`}
            stroke="#8B6914" strokeWidth="1" fill="none" opacity="0.5" />
        );
      })}

      {/* ── MAIN SHIKHARA (curvilinear tower) ── */}
      <path d="M84 53 Q77 78 70 110 Q63 142 60 178 L160 178 Q157 142 150 110 Q143 78 136 53 Z"
        fill="url(#tgV)" opacity="0.92" />

      {/* Shikhara vertical niches */}
      <path d="M98 53 Q95 80 93 115 Q91 148 90 178 L96 178 Q97 148 98 115 Q99 80 98 53Z"
        fill="#1a0202" opacity="0.12" />
      <path d="M110 53 Q110 80 110 115 Q110 148 110 178 L116 178 Q116 148 116 115 Q116 80 116 53Z"
        fill="#1a0202" opacity="0.08" />
      <path d="M122 53 Q125 80 127 115 Q129 148 130 178 L124 178 Q123 148 121 115 Q119 80 122 53Z"
        fill="#1a0202" opacity="0.12" />

      {/* Shikhara ratha bands (horizontal projections) */}
      {[80, 116, 150].map((y) => (
        <rect key={y} x={y === 80 ? 78 : y === 116 ? 70 : 63}
          y={y} width={y === 80 ? 64 : y === 116 ? 80 : 94}
          height="6" fill="url(#tgH)" opacity="0.85" rx="1" />
      ))}

      {/* ── LEFT ANGA SHIKHARA (subsidiary tower) ── */}
      <circle cx="52" cy="96" r="4" fill="url(#tgV)" opacity="0.8" />
      <ellipse cx="52" cy="104" rx="13" ry="5" fill="url(#tgH)" opacity="0.75" />
      <path d="M39 109 Q36 126 34 152 L70 152 Q68 126 65 109 Z"
        fill="url(#tgV)" opacity="0.75" />
      <rect x="37" y="130" width="30" height="4" fill="url(#tgH)" opacity="0.65" />
      {/* Small kalasha on anga */}
      <circle cx="52" cy="89" r="4.5" fill="url(#tgV)" opacity="0.8" />

      {/* ── RIGHT ANGA SHIKHARA ── */}
      <circle cx="168" cy="96" r="4" fill="url(#tgV)" opacity="0.8" />
      <ellipse cx="168" cy="104" rx="13" ry="5" fill="url(#tgH)" opacity="0.75" />
      <path d="M155 109 Q152 126 150 152 L186 152 Q184 126 181 109 Z"
        fill="url(#tgV)" opacity="0.75" />
      <rect x="153" y="130" width="30" height="4" fill="url(#tgH)" opacity="0.65" />
      <circle cx="168" cy="89" r="4.5" fill="url(#tgV)" opacity="0.8" />

      {/* ── ANTARALA (vestibule) ── */}
      <rect x="78" y="178" width="64" height="28" fill="url(#tgV)" opacity="0.85" />
      <path d="M78 183 Q110 172 142 183" stroke="url(#tgH)" strokeWidth="2" fill="none" opacity="0.6" />

      {/* ── MANDAPA (pillared hall) ── */}
      <rect x="36" y="206" width="148" height="70" fill="url(#tgV)" opacity="0.78" />
      {/* Decorative arch on mandapa */}
      <path d="M36 215 Q110 194 184 215" stroke="url(#tgH)" strokeWidth="2.5" fill="none" opacity="0.6" />
      {/* Pillars */}
      {[52, 70, 88, 110, 132, 150, 168].map((x) => (
        <rect key={x} x={x - 3.5} y="208" width="7" height="66"
          fill="#1a0202" opacity="0.18" rx="1" />
      ))}
      {/* Pillar bases and capitals */}
      {[52, 70, 88, 110, 132, 150, 168].map((x) => (
        <g key={`pc${x}`}>
          <rect x={x - 5} y="208" width="10" height="5" fill="url(#tgH)" opacity="0.7" rx="1" />
          <rect x={x - 5} y="269" width="10" height="5" fill="url(#tgH)" opacity="0.7" rx="1" />
        </g>
      ))}

      {/* ── STEPS / ADHISHTHANA ── */}
      {[{ x: 28, w: 164, y: 276, op: 0.88 },
        { x: 18, w: 184, y: 292, op: 0.72 },
        { x: 8, w: 204, y: 308, op: 0.56 },
      ].map((s, i) => (
        <rect key={i} x={s.x} y={s.y} width={s.w} height="16"
          fill="url(#tgH)" opacity={s.op} rx="1" />
      ))}

      {/* ── DECORATIVE DOTS / GHUNGROO on shikhara ── */}
      {[
        [95, 65], [110, 62], [125, 65],
        [88, 95], [110, 90], [132, 95],
        [82, 128], [110, 122], [138, 128],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill="#FFD700" opacity="0.6" />
      ))}

      {/* ── FLAG / DHWAJA on top ── */}
      <rect x="108" y="1" width="2" height="9" fill="#D4AF37" opacity="0.7" />

      {/* Base reflection */}
      <ellipse cx="110" cy="326" rx="88" ry="7" fill="#D4AF37" opacity="0.12" />
    </svg>
  );
}

/* ─── Mandala background pattern ─────────────────────────────────────────── */
function BgMandala() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.03]"
      preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <pattern id="hBg" x="0" y="0" width="140" height="140" patternUnits="userSpaceOnUse">
          {[60, 46, 32, 18].map((r) => (
            <circle key={r} cx="70" cy="70" r={r} stroke="#D4AF37" strokeWidth="0.7" fill="none" />
          ))}
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * 45 * Math.PI) / 180;
            return <line key={i}
              x1={70 + 8 * Math.cos(a)} y1={70 + 8 * Math.sin(a)}
              x2={70 + 60 * Math.cos(a)} y2={70 + 60 * Math.sin(a)}
              stroke="#D4AF37" strokeWidth="0.4" />;
          })}
          <circle cx="70" cy="70" r="5" fill="#D4AF37" opacity="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hBg)" />
    </svg>
  );
}

/* ─── Gold ornament divider ──────────────────────────────────────────────── */
function OrnamentLine({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/65" />
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rotate-45 bg-gold/60" />
        <div className="w-3 h-3 rotate-45 bg-gold" />
        <div className="w-1.5 h-1.5 rotate-45 bg-gold/60" />
      </div>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/65" />
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export function HomeGraphicHero() {
  const { locale } = useI18n();
  const prefix = locale === 'hi' ? '' : '/en';

  const t = {
    hi: {
      eye: 'उज्जैन गाइड · उज्जैन · मध्य प्रदेश',
      h1: 'उज्जैन',
      sub: 'महाकाल की नगरी',
      tagline: 'बारह ज्योतिर्लिंगों में तीसरा · एकमात्र दक्षिणमुखी · सात मोक्षदायिनी पुरियों में एक',
      ctaA: 'पूजा बुक करें',
      ctaB: 'मंदिर देखें',
      photoCaption: 'महाकालेश्वर मंदिर, उज्जैन',
      s: [
        { n: '182+', l: 'प्राचीन मंदिर' },
        { n: '5', l: 'पवित्र पूजाएँ' },
        { n: '56+', l: 'तीर्थ स्थल' },
        { n: '2028', l: 'सिंहस्थ' },
      ],
    },
    en: {
      eye: 'Ujjain Guide · Ujjain · Madhya Pradesh',
      h1: 'Ujjain',
      sub: 'City of Mahakal',
      tagline: 'Third Jyotirlinga · Only south-facing · One of seven Moksha cities',
      ctaA: 'Book a Puja',
      ctaB: 'Explore Temples',
      photoCaption: 'Mahakaleshwar Temple, Ujjain',
      s: [
        { n: '182+', l: 'Ancient Temples' },
        { n: '5', l: 'Sacred Pujas' },
        { n: '56+', l: 'Tirtha Sites' },
        { n: '2028', l: 'Simhastha' },
      ],
    },
  }[locale];

  return (
    <section
      className="relative overflow-hidden flex flex-col lg:flex-row"
      style={{
        minHeight: 'clamp(680px, 100svh, 1000px)',
        background: 'radial-gradient(ellipse 100% 100% at 30% 50%, #6B0000 0%, #3a0404 45%, #1a0202 100%)',
      }}
    >
      {/* Gold top bar */}
      <div className="absolute inset-x-0 top-0 z-30 h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent" />

      {/* Background mandala tessellation */}
      <BgMandala />

      {/* Mobile: subtle photo background */}
      <div className="lg:hidden absolute inset-0 z-0">
        <img
          src="/images/hero/mahakaleshwar-hero.webp"
          alt=""
          aria-hidden
          className="h-full w-full object-cover object-center opacity-[0.18] mix-blend-luminosity"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>

      {/* Radial glow — left-centered on desktop */}
      <div className="absolute inset-0 pointer-events-none z-10" aria-hidden style={{
        background: 'radial-gradient(ellipse 55% 60% at 32% 50%, rgba(212,175,55,0.09) 0%, transparent 65%)',
      }} />

      {/* ── LEFT LOTUS ── */}
      <div
        className="absolute left-0 top-0 h-full flex items-center pointer-events-none select-none z-10"
        style={{ width: 'clamp(70px, 10vw, 140px)' }}
        aria-hidden
      >
        <SideLotus />
      </div>

      {/* ══════════════════════════════════════
          LEFT — text content (full width mobile, 56% desktop)
      ══════════════════════════════════════ */}
      <div
        className="relative z-20 flex flex-col items-center lg:items-start
          justify-center text-center lg:text-left
          px-5 sm:px-12 lg:pl-20 lg:pr-8
          py-16 sm:py-20 lg:py-0
          w-full lg:w-[56%]"
        style={{ minHeight: 'inherit' }}
      >
        {/* Eyebrow pill */}
        <span className="mb-5 rounded-full border border-gold/45 bg-black/30 px-5 py-1.5
          text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] text-gold backdrop-blur-sm">
          {t.eye}
        </span>

        {/* OM + ornament */}
        <div className="mb-4 flex items-center gap-4 w-full max-w-xs sm:max-w-sm lg:max-w-none lg:w-auto">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/50" />
          <svg width="44" height="44" viewBox="0 0 60 60">
            <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle"
              fontSize="42" fontFamily="serif" fill="#D4AF37">ॐ</text>
          </svg>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/50" />
        </div>

        {/* H1 */}
        <h1
          className="font-sanskrit font-bold text-white leading-none tracking-tight"
          style={{
            fontSize: 'clamp(3.5rem, 9vw, 8rem)',
            textShadow: '0 4px 40px rgba(0,0,0,0.6)',
            letterSpacing: '-0.01em',
          }}
        >
          {t.h1}
        </h1>

        {/* Subtitle */}
        <p
          className="font-serif font-semibold mt-1"
          style={{
            fontSize: 'clamp(1.2rem, 3vw, 2.4rem)',
            color: '#D4AF37',
            textShadow: '0 2px 20px rgba(0,0,0,0.4)',
          }}
        >
          {t.sub}
        </p>

        {/* Gold ornament */}
        <OrnamentLine className="w-full max-w-xs sm:max-w-sm lg:max-w-md my-4" />

        {/* Tagline */}
        <p
          className="font-serif italic text-cream/70 leading-relaxed max-w-lg"
          style={{ fontSize: 'clamp(0.75rem, 1.5vw, 1.05rem)' }}
        >
          {t.tagline}
        </p>

        {/* Stats pills */}
        <div className="mt-7 flex flex-wrap justify-center lg:justify-start gap-2.5">
          {t.s.map((s) => (
            <div
              key={s.l}
              className="flex items-center gap-2.5 rounded-lg border border-gold/30
                bg-black/40 px-4 py-2.5 backdrop-blur-sm"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
            >
              <p className="font-serif font-bold text-gold leading-none"
                style={{ fontSize: 'clamp(1rem, 1.8vw, 1.4rem)' }}>{s.n}</p>
              <p className="text-white/55 text-[9px] sm:text-[10px] uppercase tracking-[0.18em]">{s.l}</p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4">
          <Link
            to={`${prefix}/puja-in-ujjain/`}
            className="inline-flex items-center gap-2.5 rounded-md bg-gold
              px-7 py-3.5 sm:py-4 font-bold text-maroon-900
              shadow-[0_8px_32px_rgba(0,0,0,0.5)]
              transition-all duration-200 hover:bg-gold-light hover:-translate-y-0.5
              hover:shadow-[0_12px_40px_rgba(212,175,55,0.4)]"
            style={{ fontSize: 'clamp(0.82rem, 1.4vw, 1rem)' }}
          >
            {t.ctaA} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to={`${prefix}/mandirs/`}
            className="inline-flex items-center gap-2 rounded-md border border-white/25
              bg-white/10 px-7 py-3.5 sm:py-4 font-semibold text-white backdrop-blur-sm
              transition-all duration-200 hover:bg-white/18 hover:-translate-y-0.5"
            style={{ fontSize: 'clamp(0.82rem, 1.4vw, 1rem)' }}
          >
            {t.ctaB} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Trust row */}
        <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-2
          border-t border-white/10 pt-6 text-[11px] sm:text-[12px] text-white/40 font-medium">
          {['DPIIT Registered', 'Startup India EIR', '12+ Years Experience',
            locale === 'hi' ? 'बाइटफ़्लो टेक्नोलॉजीज़' : 'ByteFlow Technologies'].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-gold/40" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          RIGHT — Mahakaleshwar photo (desktop only)
      ══════════════════════════════════════ */}
      <div className="hidden lg:block lg:w-[44%] relative overflow-hidden flex-shrink-0">
        <img
          src="/images/hero/mahakaleshwar-hero.webp"
          alt={t.photoCaption}
          className="absolute inset-0 h-full w-full object-cover object-center"
          style={{ opacity: 0.9 }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        {/* Left gradient — blends photo into dark left side */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to right, #1a0202 0%, rgba(26,2,2,0.7) 22%, rgba(26,2,2,0.15) 55%, transparent 100%)',
        }} />
        {/* Top/bottom vignette */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(26,2,2,0.55) 0%, transparent 20%, transparent 80%, rgba(26,2,2,0.55) 100%)',
        }} />
        {/* Photo caption */}
        <div className="absolute bottom-10 right-6 z-10">
          <span className="rounded-full border border-gold/30 bg-black/50 px-3 py-1
            text-[10px] font-medium tracking-widest text-gold/70 backdrop-blur-sm">
            {t.photoCaption}
          </span>
        </div>
        {/* Decorative right lotus (behind photo) */}
        <div className="absolute right-0 top-0 h-full flex items-center pointer-events-none select-none opacity-20"
          style={{ width: 'clamp(70px, 8vw, 120px)' }} aria-hidden>
          <SideLotus flip />
        </div>
      </div>

      {/* Gold bottom bar */}
      <div className="absolute inset-x-0 bottom-0 z-30 h-[3px] bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
    </section>
  );
}
