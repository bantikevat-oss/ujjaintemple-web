import { Phone, MessageCircle, Share2 } from 'lucide-react';
import { useI18n } from '../../i18n';
import { SITE } from '../../lib/site';

/**
 * Mobile-only premium sticky bottom bar — primary conversion surface.
 * Call · WhatsApp · Share — never lose intent.
 * Gold-std visual: gold-trim top edge, deep maroon-900 fill, balanced typography.
 */
export function StickyCallBar() {
  const { locale } = useI18n();

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'UjjainTemple — उज्जैन मंदिर, सिंहस्थ 2028, यात्रा गाइड',
          text: locale === 'hi' ? 'उज्जैन के मन्दिर एवं सिंहस्थ 2028 की प्रामाणिक गाइड' : 'Authoritative guide to Ujjain temples & Simhastha 2028',
          url: typeof window !== 'undefined' ? window.location.href : SITE.url,
        });
      } catch {
        /* user cancelled */
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(typeof window !== 'undefined' ? window.location.href : SITE.url);
      } catch {
        /* ignore */
      }
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/60 bg-maroon-900 px-3 py-2 shadow-[0_-8px_24px_rgba(0,0,0,0.18)] lg:hidden">
      {/* gold top hairline */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/80 to-transparent" />
      <div className="flex items-center gap-2">
        <a
          href={SITE.phoneTel}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-gold py-2.5 text-sm font-bold text-maroon-900 shadow-md transition-transform active:scale-95"
          aria-label={locale === 'hi' ? 'कॉल करें' : 'Call now'}
        >
          <Phone className="h-4 w-4" />
          <span>{locale === 'hi' ? 'कॉल करें' : 'Call'}</span>
        </a>
        <a
          href={SITE.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-cream py-2.5 text-sm font-bold text-maroon-900 shadow-md transition-transform active:scale-95"
          aria-label="WhatsApp"
        >
          <MessageCircle className="h-4 w-4" />
          <span>WhatsApp</span>
        </a>
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-1.5 rounded-md border border-cream/40 bg-maroon-800 px-4 py-2.5 text-sm font-bold text-cream transition-transform active:scale-95"
          aria-label={locale === 'hi' ? 'साझा करें' : 'Share'}
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
