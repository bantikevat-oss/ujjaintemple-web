import { Link } from 'react-router-dom';
import { Phone, MapPin, Mail, ArrowRight } from 'lucide-react';
import { useI18n } from '../../i18n';
import { SITE } from '../../lib/site';

/* ─── Gold ornament divider ──────────────────────────────────────────────── */
function GoldDivider() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/40" />
      <div className="flex items-center gap-1">
        <div className="w-1 h-1 rotate-45 bg-gold/40" />
        <svg width="18" height="18" viewBox="0 0 60 60" className="opacity-60">
          <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle"
            fontSize="44" fontFamily="serif" fill="#D4AF37">ॐ</text>
        </svg>
        <div className="w-1 h-1 rotate-45 bg-gold/40" />
      </div>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/40" />
    </div>
  );
}

/* ─── Social icon button ─────────────────────────────────────────────────── */
function SocialBtn({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full
        border border-gold/20 text-cream/50 transition-all duration-200
        hover:border-gold/60 hover:text-gold hover:bg-gold/10">
      {children}
    </a>
  );
}

/* ─── Footer link ────────────────────────────────────────────────────────── */
function FLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link to={to}
        className="group flex items-center gap-1.5 text-[13px] text-cream/55
          transition-colors duration-150 hover:text-gold leading-relaxed">
        <span className="w-0 overflow-hidden group-hover:w-2 transition-all duration-200
          text-gold text-[8px]">›</span>
        {children}
      </Link>
    </li>
  );
}

/* ─── Column heading ─────────────────────────────────────────────────────── */
function ColHead({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-gold/80
      flex items-center gap-2">
      <span className="h-px w-4 bg-gold/40 flex-shrink-0" />
      {children}
    </h4>
  );
}

/* ─── Main footer ────────────────────────────────────────────────────────── */
export function Footer() {
  const { t, locale } = useI18n();
  const prefix = locale === 'hi' ? '' : '/en';
  const year = new Date().getFullYear();
  const isHi = locale === 'hi';

  return (
    <footer
      className="relative mt-16 overflow-hidden pb-20 md:pb-0"
      style={{ background: 'linear-gradient(to bottom, #1a0202 0%, #0f0101 100%)' }}
    >
      {/* Gold top accent */}
      <div className="h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent" />

      {/* Subtle background mandala */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.025]" aria-hidden>
        <svg className="absolute right-0 top-0 w-[600px] h-[600px] translate-x-1/3 -translate-y-1/4">
          {[80, 120, 160, 200, 240, 280].map((r) => (
            <circle key={r} cx="300" cy="300" r={r} stroke="#D4AF37" strokeWidth="0.8" fill="none" />
          ))}
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i * 30 * Math.PI) / 180;
            return <line key={i} x1={300 + 20 * Math.cos(a)} y1={300 + 20 * Math.sin(a)}
              x2={300 + 280 * Math.cos(a)} y2={300 + 280 * Math.sin(a)}
              stroke="#D4AF37" strokeWidth="0.4" />;
          })}
          <circle cx="300" cy="300" r="12" fill="#D4AF37" opacity="0.4" />
        </svg>
      </div>

      {/* ── PRE-FOOTER WhatsApp CTA STRIP ────────────────────────────────── */}
      <div
        className="relative border-b"
        style={{ borderColor: 'rgba(212,175,55,0.12)', background: 'rgba(212,175,55,0.04)' }}
      >
        <div className="container-page py-7 flex flex-col sm:flex-row items-center
          justify-between gap-4">
          <div>
            <p className={`font-bold text-white ${isHi ? 'font-sanskrit text-base sm:text-lg' : 'font-serif text-base sm:text-lg'}`}>
              {isHi ? 'पूजा बुकिंग या यात्रा योजना?' : 'Planning a puja or Ujjain visit?'}
            </p>
            <p className="text-[12px] text-cream/50 mt-0.5">
              {isHi ? 'सबसे तेज़ जवाब व्हाट्सऐप पर मिलता है' : 'Fastest response on WhatsApp'}
            </p>
          </div>
          <a
            href={`${SITE.whatsapp}?text=${encodeURIComponent(isHi
              ? 'नमस्ते! मुझे उज्जैन पूजा/यात्रा के बारे में जानकारी चाहिए।'
              : 'Hello! I need information about Ujjain puja/travel.')}`}
            target="_blank" rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-2.5 rounded-xl
              bg-[#25D366] px-6 py-3 font-bold text-white text-sm
              shadow-[0_4px_20px_rgba(37,211,102,0.3)]
              hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(37,211,102,0.45)]
              transition-all duration-200"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white flex-shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {isHi ? 'व्हाट्सऐप पर पूछें' : 'Ask on WhatsApp'}
          </a>
        </div>
      </div>

      {/* ── MAIN FOOTER GRID ──────────────────────────────────────────────── */}
      <div className="container-page py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">

        {/* Brand column */}
        <div className="space-y-5">
          {/* Logo + OM */}
          <div className="flex items-center gap-3">
            <svg width="32" height="32" viewBox="0 0 60 60" className="flex-shrink-0 opacity-90">
              <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle"
                fontSize="46" fontFamily="serif" fill="#D4AF37">ॐ</text>
            </svg>
            <div>
              <p className="font-serif text-xl font-bold text-white leading-tight">
                {t('site.name')}
              </p>
              <p className="text-[10px] text-gold/60 uppercase tracking-widest">
                Ujjain · Madhya Pradesh
              </p>
            </div>
          </div>

          <p className="text-[13px] leading-[1.8] text-cream/55 max-w-xs">
            {t('site.tagline')}
          </p>

          {/* Contact quick links */}
          <div className="space-y-2.5">
            <a href={SITE.phoneTel}
              className="flex items-center gap-2.5 text-[13px] text-cream/60 hover:text-gold transition-colors group">
              <Phone className="h-3.5 w-3.5 text-gold/50 flex-shrink-0 group-hover:text-gold" />
              {SITE.phone}
            </a>
            <a href={`mailto:${SITE.email}`}
              className="flex items-center gap-2.5 text-[13px] text-cream/60 hover:text-gold transition-colors group">
              <Mail className="h-3.5 w-3.5 text-gold/50 flex-shrink-0 group-hover:text-gold" />
              {SITE.email}
            </a>
            <div className="flex items-center gap-2.5 text-[13px] text-cream/45">
              <MapPin className="h-3.5 w-3.5 text-gold/40 flex-shrink-0" />
              {SITE.address.locality}, {SITE.address.region}
            </div>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-2 pt-1">
            <SocialBtn href={SITE.social.facebook} label="Facebook">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
                <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.26h3.32l-.53 3.5h-2.79V24C19.61 23.1 24 18.1 24 12.07z"/>
              </svg>
            </SocialBtn>
            <SocialBtn href={SITE.social.instagram} label="Instagram">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </SocialBtn>
            <SocialBtn href={SITE.social.youtube} label="YouTube">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
                <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
              </svg>
            </SocialBtn>
          </div>
        </div>

        {/* Temples column */}
        <div>
          <ColHead>{isHi ? 'प्रमुख मंदिर' : 'Key Temples'}</ColHead>
          <ul className="space-y-2">
            <FLink to={`${prefix}/mandirs/mahakaleshwar/`}>
              {isHi ? 'महाकालेश्वर' : 'Mahakaleshwar'}
            </FLink>
            <FLink to={`${prefix}/mandirs/kal-bhairav-ujjain/`}>
              {isHi ? 'काल भैरव' : 'Kal Bhairav'}
            </FLink>
            <FLink to={`${prefix}/mandirs/mangalnath/`}>
              {isHi ? 'मंगलनाथ' : 'Mangalnath'}
            </FLink>
            <FLink to={`${prefix}/mandirs/harsiddhi-mandir/`}>
              {isHi ? 'हरसिद्धि माता' : 'Harsiddhi Mata'}
            </FLink>
            <FLink to={`${prefix}/mandirs/chintaman-ganesh/`}>
              {isHi ? 'चिंतामण गणेश' : 'Chintaman Ganesh'}
            </FLink>
            <li className="pt-1">
              <Link to={`${prefix}/mandirs/`}
                className="inline-flex items-center gap-1 text-[12px] font-semibold
                  text-gold/70 hover:text-gold transition-colors">
                {isHi ? 'सभी 182+ मंदिर' : 'All 182+ temples'}
                <ArrowRight className="h-3 w-3" />
              </Link>
            </li>
          </ul>
        </div>

        {/* Services column */}
        <div>
          <ColHead>{isHi ? 'सेवाएँ' : 'Services'}</ColHead>
          <ul className="space-y-2">
            <FLink to={`${prefix}/puja-in-ujjain/`}>
              {isHi ? 'पूजा बुकिंग' : 'Puja Booking'}
            </FLink>
            <FLink to={`${prefix}/tour-and-travel-ujjain/`}>
              {isHi ? 'टूर पैकेज' : 'Tour Packages'}
            </FLink>
            <FLink to={`${prefix}/cab-booking/`}>
              {isHi ? 'कैब बुकिंग' : 'Cab Booking'}
            </FLink>
            <FLink to={`${prefix}/hotels/`}>
              {isHi ? 'होटल' : 'Hotels'}
            </FLink>
            <FLink to={`${prefix}/transport-in-ujjain/`}>
              {isHi ? 'यातायात गाइड' : 'Transport Guide'}
            </FLink>
            <FLink to={`${prefix}/simhastha-2028/`}>
              {isHi ? 'सिंहस्थ 2028' : 'Simhastha 2028'}
            </FLink>
          </ul>
        </div>

        {/* Company column */}
        <div>
          <ColHead>{isHi ? 'कम्पनी' : 'Company'}</ColHead>
          <ul className="space-y-2">
            <FLink to={`${prefix}/about/`}>
              {isHi ? 'हमारे बारे में' : 'About Us'}
            </FLink>
            <FLink to={`${prefix}/contact/`}>
              {isHi ? 'संपर्क करें' : 'Contact'}
            </FLink>
            <FLink to={`${prefix}/privacy-policy/`}>
              {isHi ? 'गोपनीयता नीति' : 'Privacy Policy'}
            </FLink>
            <FLink to={`${prefix}/terms/`}>
              {isHi ? 'उपयोग की शर्तें' : 'Terms of Use'}
            </FLink>
          </ul>

          {/* DPIIT badge */}
          <div className="mt-6 rounded-xl border border-gold/15 bg-gold/5 p-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gold/60 mb-1">
              {isHi ? 'सरकार से अप्रूव्ड' : 'Govt Recognised'}
            </p>
            <p className="text-[11px] font-bold text-cream/70 leading-snug">
              Startup India EIR
            </p>
            <p className="text-[10px] text-cream/40 mt-0.5">DPIIT · Govt of India</p>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ────────────────────────────────────────────────────── */}
      <div className="container-page pb-10 md:pb-8">
        <GoldDivider />
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between
          gap-3 text-[11px] text-cream/35">
          <p className="text-center sm:text-left leading-relaxed">
            {t('footer.disclaimer')}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 flex-shrink-0">
            <span>© {year} {t('site.name')}</span>
            <span className="hidden sm:block text-cream/20">·</span>
            <Link to={`${prefix}/privacy-policy/`} className="hover:text-gold transition-colors">
              {isHi ? 'गोपनीयता' : 'Privacy'}
            </Link>
            <Link to={`${prefix}/terms/`} className="hover:text-gold transition-colors">
              {isHi ? 'शर्तें' : 'Terms'}
            </Link>
            <Link to={`${prefix}/about/`} className="hover:text-gold transition-colors">
              ByteFlow Technologies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
