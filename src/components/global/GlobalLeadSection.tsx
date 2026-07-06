import { Phone, Check } from 'lucide-react';
import { useI18n } from '../../i18n';
import { LeadForm } from './LeadForm';
import { SITE } from '../../lib/site';

interface GlobalLeadSectionProps {
  sourcePage: string;
  defaultService?: 'darshanPlan' | 'hotel' | 'cab' | 'tour' | 'simhastha' | 'transport';
}

export function GlobalLeadSection({ sourcePage, defaultService = 'tour' }: GlobalLeadSectionProps) {
  const { locale } = useI18n();
  const isHi = locale === 'hi';

  const benefits = isHi
    ? ['पूजा बुकिंग', 'कैब बुकिंग', 'होटल बुकिंग', 'अनुभवी पंडित जी']
    : ['Puja Booking', 'Cab Booking', 'Hotel Booking', 'Experienced Pandit Ji'];

  return (
    <section
      id="lead"
      className="relative overflow-hidden py-16 sm:py-20 border-t-4 border-gold"
      style={{ background: 'linear-gradient(135deg, #8B1A1A 0%, #5E1010 55%, #3E0F0A 100%)' }}
    >
      {/* subtle radial glow */}
      <div className="pointer-events-none absolute inset-0 opacity-60"
        style={{ background: 'radial-gradient(ellipse at 78% 30%, rgba(212,175,55,0.14), transparent 60%)' }} />

      <div className="container-page relative z-10">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16 max-w-6xl mx-auto">

          {/* ── Value side ── */}
          <div className="text-center lg:text-left">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold/80 mb-3">
              {isHi ? 'नि:शुल्क यात्रा परामर्श' : 'Free Travel Consultation'}
            </p>
            <h2
              className={`font-bold text-white leading-tight ${isHi ? 'font-sanskrit' : 'font-serif'}`}
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
            >
              {isHi ? 'एक ही जगह — पूरी यात्रा व्यवस्था' : 'One Place — Your Entire Yatra Sorted'}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-cream/80 max-w-md mx-auto lg:mx-0">
              {isHi
                ? 'फ़ॉर्म भरें या सीधे कॉल करें — हमारी टीम पूजा, ठहराव एवं यात्रा की पूरी योजना बना देगी।'
                : 'Fill the form or call directly — our team plans your puja, stay and travel end-to-end.'}
            </p>

            {/* Benefits */}
            <ul className="mt-7 grid grid-cols-2 gap-x-6 gap-y-3 max-w-sm mx-auto lg:mx-0 text-left">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-2.5 text-white/95 font-medium">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gold/20">
                    <Check className="h-3 w-3 text-gold" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>

            {/* Phone CTA */}
            <a
              href={SITE.phoneTel}
              className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-gold/40
                bg-gold/10 px-6 py-3 font-bold text-gold backdrop-blur-sm
                transition-all duration-200 hover:bg-gold hover:text-maroon-900"
            >
              <Phone className="h-4 w-4" />
              {isHi ? `सीधे कॉल करें · ${SITE.phone}` : `Call directly · ${SITE.phone}`}
            </a>

            {/* Trust line */}
            <p className="mt-5 text-xs text-cream/55">
              {isHi
                ? 'DPIIT पंजीकृत स्टार्टअप · Startup India EIR · 12+ वर्षों का अनुभव'
                : 'DPIIT-Registered Startup · Startup India EIR · 12+ Years of Experience'}
            </p>
          </div>

          {/* ── Form side ── */}
          <div className="w-full max-w-md mx-auto lg:max-w-full lg:mx-0 shadow-2xl">
            <LeadForm variant="card" defaultService={defaultService} sourcePage={sourcePage} />
          </div>

        </div>
      </div>
    </section>
  );
}
