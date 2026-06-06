import { ArrowRight, ArrowDown } from 'lucide-react';
import type { Article } from '../../lib/types';

/* ─── Puja-specific SVG symbols ──────────────────────────────────────────── */

function SnakeSymbol() {
  return (
    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
      <circle cx="50" cy="50" r="44" stroke="#D4AF37" strokeWidth="1" opacity="0.4" />
      {/* Snake body - coiled */}
      <path
        d="M50 14 C66 14 78 26 78 42 C78 58 66 66 54 62 C42 58 38 46 46 38 C54 30 64 36 60 46 C56 56 46 54 48 46"
        stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" fill="none"
      />
      {/* Snake tail */}
      <path d="M48 46 C46 42 50 38 50 14" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
      {/* Hood */}
      <path d="M40 18 Q50 10 60 18" stroke="#D4AF37" strokeWidth="2" fill="none" />
      {/* Eyes */}
      <circle cx="46" cy="16" r="1.8" fill="#D4AF37" />
      <circle cx="54" cy="16" r="1.8" fill="#D4AF37" />
      {/* Tongue */}
      <path d="M50 20 L50 24 M48 24 L50 22 L52 24" stroke="#FF6B6B" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function TrishulSymbol() {
  return (
    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
      <circle cx="50" cy="50" r="44" stroke="#D4AF37" strokeWidth="1" opacity="0.4" />
      {/* Main staff */}
      <line x1="50" y1="20" x2="50" y2="80" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" />
      {/* Center prong */}
      <path d="M50 20 L44 36 L50 30 L56 36 Z" fill="#D4AF37" />
      {/* Left prong */}
      <path d="M38 28 L34 40 L38 34 L42 40 Z" fill="#D4AF37" opacity="0.85" />
      {/* Right prong */}
      <path d="M62 28 L58 40 L62 34 L66 40 Z" fill="#D4AF37" opacity="0.85" />
      {/* Cross piece */}
      <line x1="34" y1="42" x2="66" y2="42" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
      {/* Damaru */}
      <ellipse cx="50" cy="60" rx="8" ry="6" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
      <line x1="42" y1="57" x2="58" y2="63" stroke="#D4AF37" strokeWidth="1.5" />
      <line x1="42" y1="63" x2="58" y2="57" stroke="#D4AF37" strokeWidth="1.5" />
    </svg>
  );
}

function MarsSymbol() {
  return (
    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
      <circle cx="50" cy="50" r="44" stroke="#D4AF37" strokeWidth="1" opacity="0.4" />
      {/* 8-pointed star (Mars yantra) */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <polygon
          key={angle}
          points="50,20 54,44 50,50 46,44"
          fill="#D4AF37"
          opacity="0.85"
          transform={`rotate(${angle} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="10" fill="#D4AF37" opacity="0.3" />
      <circle cx="50" cy="50" r="5" fill="#D4AF37" />
    </svg>
  );
}

function NavagrahaSymbol() {
  const planets = Array.from({ length: 9 }, (_, i) => {
    const angle = (i * 360) / 9 - 90;
    const r = i === 8 ? 0 : 32;
    const rad = (angle * Math.PI) / 180;
    return { x: 50 + r * Math.cos(rad), y: 50 + r * Math.sin(rad) };
  });
  return (
    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
      <circle cx="50" cy="50" r="44" stroke="#D4AF37" strokeWidth="1" opacity="0.4" />
      <circle cx="50" cy="50" r="34" stroke="#D4AF37" strokeWidth="0.5" opacity="0.3" />
      {planets.map((p, i) => (
        <g key={i}>
          {i < 8 && <line x1="50" y1="50" x2={p.x} y2={p.y} stroke="#D4AF37" strokeWidth="0.5" opacity="0.3" />}
          <circle cx={p.x} cy={p.y} r={i === 8 ? 7 : 5} fill="#D4AF37" opacity={i === 8 ? 0.9 : 0.7} />
        </g>
      ))}
    </svg>
  );
}

function DiyaSymbol() {
  return (
    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
      <circle cx="50" cy="50" r="44" stroke="#D4AF37" strokeWidth="1" opacity="0.4" />
      {/* Flame */}
      <path d="M50 20 C46 28 42 35 44 42 C46 48 54 48 56 42 C58 35 54 28 50 20Z" fill="#D4AF37" opacity="0.9" />
      <path d="M50 26 C48 31 47 36 48 40 C49 44 51 44 52 40 C53 36 52 31 50 26Z" fill="#FFF8E7" opacity="0.7" />
      {/* Diya body */}
      <path d="M34 60 Q36 52 50 52 Q64 52 66 60 Q68 68 50 72 Q32 68 34 60Z" fill="#D4AF37" opacity="0.8" />
      <path d="M40 60 Q42 56 50 56 Q58 56 60 60" stroke="#B8860B" strokeWidth="1" fill="none" opacity="0.6" />
      {/* Wick */}
      <line x1="50" y1="52" x2="50" y2="48" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" />
      {/* Glow rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <line
          key={a}
          x1={50 + 18 * Math.cos((a * Math.PI) / 180)}
          y1={34 + 18 * Math.sin((a * Math.PI) / 180)}
          x2={50 + 26 * Math.cos((a * Math.PI) / 180)}
          y2={34 + 26 * Math.sin((a * Math.PI) / 180)}
          stroke="#D4AF37"
          strokeWidth="1.2"
          opacity="0.5"
        />
      ))}
    </svg>
  );
}

const SYMBOLS: Record<string, () => JSX.Element> = {
  'kaal-sarp-dosh-nivaran': SnakeSymbol,
  'mahamrityunjaya-puja': TrishulSymbol,
  'mangal-dosh-nivaran': MarsSymbol,
  'navgrah-shanti': NavagrahaSymbol,
  'pitru-dosh-nivaran': DiyaSymbol,
};

/* ─── Decorative side lotus (like Prokerala style) ───────────────────────── */

function SideLotus({ flip = false }: { flip?: boolean }) {
  const petals = Array.from({ length: 14 }, (_, i) => ({
    angle: i * (180 / 13) - 90,
    ry: 75 + (i % 3) * 12,
    rx: 18 + (i % 2) * 5,
    opacity: 0.65 + (i % 4) * 0.08,
  }));
  return (
    <svg
      viewBox="0 0 120 480"
      fill="none"
      className="h-full w-auto"
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
      <defs>
        <radialGradient id={`lotusGrad${flip ? 'R' : 'L'}`} cx="30%" cy="50%">
          <stop offset="0%" stopColor="#FF8C00" />
          <stop offset="55%" stopColor="#CC2200" />
          <stop offset="100%" stopColor="#7B0000" />
        </radialGradient>
        <radialGradient id={`innerGrad${flip ? 'R' : 'L'}`} cx="50%" cy="50%">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.3" />
        </radialGradient>
      </defs>

      {/* Main petals radiating from left edge center */}
      {petals.map((p, i) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = 0 + p.ry * Math.cos(rad);
        const ty = 240 + p.ry * Math.sin(rad);
        return (
          <ellipse
            key={i}
            cx="0"
            cy="240"
            rx={p.rx}
            ry={p.ry}
            fill={`url(#lotusGrad${flip ? 'R' : 'L'})`}
            opacity={p.opacity}
            transform={`rotate(${p.angle} 0 240)`}
          />
        );
      })}

      {/* Secondary smaller petals */}
      {Array.from({ length: 10 }, (_, i) => ({
        angle: i * (180 / 9) - 90,
        ry: 45 + (i % 2) * 8,
      })).map((p, i) => (
        <ellipse
          key={`s${i}`}
          cx="0"
          cy="240"
          rx="10"
          ry={p.ry}
          fill="#FF6B00"
          opacity="0.4"
          transform={`rotate(${p.angle} 0 240)`}
        />
      ))}

      {/* Center golden circle */}
      <circle cx="0" cy="240" r="28" fill={`url(#innerGrad${flip ? 'R' : 'L'})`} opacity="0.6" />
      <circle cx="0" cy="240" r="18" fill="#D4AF37" opacity="0.5" />
      <circle cx="0" cy="240" r="10" fill="#FFD700" opacity="0.7" />

      {/* Decorative dots along edges */}
      {Array.from({ length: 8 }, (_, i) => {
        const y = 80 + i * 45;
        return (
          <g key={`d${i}`}>
            <circle cx="12" cy={y} r="3" fill="#D4AF37" opacity="0.5" />
            <circle cx="6" cy={y} r="1.5" fill="#FF8C00" opacity="0.4" />
          </g>
        );
      })}

      {/* Decorative border line */}
      <line x1="22" y1="40" x2="22" y2="440" stroke="#D4AF37" strokeWidth="0.8" opacity="0.35" strokeDasharray="4 8" />
    </svg>
  );
}

/* ─── Decorative Om SVG ──────────────────────────────────────────────────── */

function OmSVG() {
  return (
    <svg viewBox="0 0 60 60" className="w-10 h-10 sm:w-12 sm:h-12" fill="none">
      <text
        x="50%"
        y="54%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="40"
        fontFamily="serif"
        fill="#D4AF37"
        opacity="0.95"
      >
        ॐ
      </text>
    </svg>
  );
}

/* ─── Background mandala tessellation ───────────────────────────────────── */

function BgPattern() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.035]" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="bgMandala" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          <circle cx="60" cy="60" r="55" stroke="#D4AF37" strokeWidth="0.8" fill="none" />
          <circle cx="60" cy="60" r="40" stroke="#D4AF37" strokeWidth="0.5" fill="none" />
          <circle cx="60" cy="60" r="25" stroke="#D4AF37" strokeWidth="0.8" fill="none" />
          {Array.from({ length: 8 }, (_, i) => {
            const a = i * 45;
            const rad = (a * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={60 + 5 * Math.cos(rad)} y1={60 + 5 * Math.sin(rad)}
                x2={60 + 55 * Math.cos(rad)} y2={60 + 55 * Math.sin(rad)}
                stroke="#D4AF37" strokeWidth="0.4"
              />
            );
          })}
          <circle cx="60" cy="60" r="4" fill="#D4AF37" opacity="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bgMandala)" />
    </svg>
  );
}

/* ─── Horizontal ornament line ───────────────────────────────────────────── */

function OrnamentLine() {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/60" />
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-gold/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-gold" />
        <div className="w-1.5 h-1.5 rounded-full bg-gold/60" />
      </div>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/60" />
    </div>
  );
}

/* ─── Main PujaGraphicHero component ────────────────────────────────────── */

interface Props {
  article: Article;
  locale: 'hi' | 'en';
  catLabel: string;
  onBookPuja?: () => void;
}

export function PujaGraphicHero({ article, locale, catLabel }: Props) {
  const SymbolComponent = SYMBOLS[article.slug] ?? TrishulSymbol;
  const [titleMain, titleSub] = article.title[locale].split(' — ');

  return (
    <header
      className="relative overflow-hidden flex flex-col items-center justify-center"
      style={{
        minHeight: 'clamp(560px, 88vh, 900px)',
        background: 'radial-gradient(ellipse at 60% 40%, #5c0a0a 0%, #3a0505 45%, #1a0202 100%)',
      }}
    >
      {/* Gold top accent */}
      <div className="absolute inset-x-0 top-0 z-20 h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent" />

      {/* Background pattern */}
      <BgPattern />

      {/* Radial light glow — center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 50% 45%, rgba(180,50,0,0.22) 0%, transparent 70%)',
        }}
      />

      {/* Left lotus decoration */}
      <div
        className="absolute left-0 top-0 h-full flex items-center pointer-events-none select-none z-10"
        style={{ width: 'clamp(80px, 14vw, 180px)' }}
        aria-hidden
      >
        <SideLotus />
      </div>

      {/* Right lotus decoration */}
      <div
        className="absolute right-0 top-0 h-full flex items-center pointer-events-none select-none z-10"
        style={{ width: 'clamp(80px, 14vw, 180px)' }}
        aria-hidden
      >
        <SideLotus flip />
      </div>

      {/* ── CONTENT ────────────────────────────────────────────────────── */}
      <div
        className="relative z-20 flex flex-col items-center text-center px-6 sm:px-16 lg:px-24"
        style={{ maxWidth: 900, width: '100%' }}
      >
        {/* Category pill */}
        <div className="mb-6 flex items-center gap-3">
          <OmSVG />
          <span className="rounded-full border border-gold/55 bg-black/35 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-gold backdrop-blur-sm">
            {catLabel} · {locale === 'hi' ? 'महाकालेश्वर उज्जैन' : 'Mahakaleshwar Ujjain'}
          </span>
        </div>

        {/* Center symbol medallion */}
        <div
          className="relative mb-6 flex items-center justify-center rounded-full"
          style={{
            width: 'clamp(88px, 13vw, 130px)',
            height: 'clamp(88px, 13vw, 130px)',
            background: 'radial-gradient(circle, rgba(180,80,0,0.35) 0%, rgba(90,10,0,0.6) 100%)',
            boxShadow: '0 0 0 1.5px rgba(212,175,55,0.4), 0 0 40px rgba(212,175,55,0.15), 0 0 80px rgba(180,50,0,0.2)',
          }}
        >
          {/* Spinning dashed ring */}
          <svg
            className="absolute inset-0 w-full h-full animate-[spin_20s_linear_infinite]"
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="48" stroke="#D4AF37" strokeWidth="1" strokeDasharray="4 8" fill="none" opacity="0.5" />
          </svg>
          {/* Inner static ring */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" stroke="#D4AF37" strokeWidth="0.5" fill="none" opacity="0.4" />
          </svg>
          {/* Symbol */}
          <div style={{ width: '65%', height: '65%' }}>
            <SymbolComponent />
          </div>
        </div>

        {/* Title */}
        <h1
          className="font-sanskrit font-bold text-white leading-[1.08] tracking-tight"
          style={{ fontSize: 'clamp(2rem, 5.5vw, 4.5rem)' }}
        >
          {titleMain}
        </h1>

        {/* Subtitle */}
        {titleSub && (
          <p
            className="mt-2 font-serif italic text-gold/90"
            style={{ fontSize: 'clamp(1.1rem, 2.2vw, 2rem)' }}
          >
            {titleSub}
          </p>
        )}

        {/* Ornament line */}
        <div className="w-full max-w-md">
          <OrnamentLine />
        </div>

        {/* Stats pills */}
        {article.pujaDetails && (
          <div className="flex flex-wrap justify-center gap-2.5 mb-7">
            {[
              { icon: '⏱', val: article.pujaDetails.duration[locale], lbl: locale === 'hi' ? 'अवधि' : 'Duration' },
              ...(article.pujaDetails.benefitCount
                ? [{ icon: '✦', val: `${article.pujaDetails.benefitCount}+`, lbl: locale === 'hi' ? 'लाभ' : 'Benefits' }]
                : []),
            ].map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 rounded-lg border border-gold/35 bg-black/45 px-4 py-2.5 backdrop-blur-sm"
              >
                <span className="text-gold text-sm">{s.icon}</span>
                <div>
                  <p className="text-white font-bold text-xs leading-none">{s.val}</p>
                  <p className="mt-0.5 text-white/45 text-[9px] uppercase tracking-wide">{s.lbl}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA buttons */}
        <div className="flex flex-wrap justify-center items-center gap-4">
          {article.forwardCta && (
            <a
              href={article.forwardCta.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-md bg-gold px-7 py-4 text-sm font-bold text-maroon-900 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-200 hover:bg-gold-light hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(212,175,55,0.4)]"
            >
              {locale === 'hi' ? 'पूजा बुक करें' : 'Book Puja'}
              <ArrowRight className="h-4 w-4" />
            </a>
          )}
          <a
            href="#puja-content"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/65 transition-colors hover:text-gold"
          >
            {locale === 'hi' ? 'पूरी जानकारी पढ़ें' : 'Read Full Details'}
            <ArrowDown className="h-4 w-4" />
          </a>
        </div>

        {/* Timestamps */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 border-t border-white/10 pt-5 text-[11px] text-white/30">
          <span>{locale === 'hi' ? 'प्रकाशित:' : 'Published:'} {article.publishDate}</span>
          <span className="text-white/15">·</span>
          <span>{locale === 'hi' ? 'अद्यतन:' : 'Updated:'} {article.lastUpdated}</span>
        </div>
      </div>

      {/* Gold bottom accent */}
      <div className="absolute inset-x-0 bottom-0 z-20 h-[3px] bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
    </header>
  );
}
