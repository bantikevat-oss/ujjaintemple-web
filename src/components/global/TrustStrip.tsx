import { useI18n } from '../../i18n';
import { ShieldCheck, Sparkles, Building2 } from 'lucide-react';

/**
 * TrustStrip — thin signal strip used in header / above hero.
 * DPIIT registered · Startup India EIR · 12+ years experience.
 * All three are real, on-record. No unverified stats.
 */
export function TrustStrip({ variant = 'thin' }: { variant?: 'thin' | 'block' }) {
  const { locale } = useI18n();
  const items =
    locale === 'hi'
      ? [
          { Icon: ShieldCheck, text: 'DPIIT पंजीकृत स्टार्टअप', sub: 'भारत सरकार मान्यता' },
          { Icon: Sparkles, text: 'Startup India EIR', sub: 'भारत सरकार से प्रथम अनुदान' },
          { Icon: Building2, text: '12+ वर्षों का अनुभव', sub: 'तीर्थ यात्रा सेवा' },
        ]
      : [
          { Icon: ShieldCheck, text: 'DPIIT-Registered Startup', sub: 'Recognised by Govt of India' },
          { Icon: Sparkles, text: 'Startup India EIR', sub: 'First grant under EIR scheme — Govt of India' },
          { Icon: Building2, text: '12+ Years of Experience', sub: 'Pilgrimage Services' },
        ];

  if (variant === 'thin') {
    return (
      <div className="border-b border-gold/30 bg-cream-dark/40">
        <div className="container-page flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-2.5 text-xs sm:text-[13px]">
          {items.map(({ Icon, text }, i) => (
            <span key={i} className="flex items-center gap-1.5 text-ink-soft">
              <Icon className="h-3.5 w-3.5 text-gold" />
              <span className="font-semibold text-maroon">{text}</span>
            </span>
          ))}
        </div>
      </div>
    );
  }

  // Block variant — used on About + Home credentials section
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map(({ Icon, text, sub }, i) => (
        <div key={i} className="flex items-start gap-3 rounded-lg border border-gold/30 bg-white p-4">
          <Icon className="mt-0.5 h-6 w-6 flex-shrink-0 text-gold" />
          <div>
            <p className={`font-bold text-maroon ${locale === 'hi' ? 'font-sanskrit text-base' : 'font-serif text-sm'}`}>
              {text}
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
