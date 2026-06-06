import { Link } from 'react-router-dom';
import { MapPin, Clock, ArrowUpRight } from 'lucide-react';
import { useI18n } from '../../i18n';
import type { Mandir } from '../../lib/types';

interface Props { mandir: Mandir; featured?: boolean; index?: number; }

const TEMPLE_TYPE_HI: Record<string, string> = {
  Jyotirlinga: 'ज्योतिर्लिंग',
  'Shakti Peeth': 'शक्ति पीठ',
  Shakti: 'शक्ति',
  Bhairav: 'भैरव',
  Ganesh: 'गणेश',
  Navagraha: 'नवग्रह',
  Shiva: 'शिव',
  Krishna: 'कृष्ण',
  Ram: 'राम',
  Historical: 'ऐतिहासिक',
  Jain: 'जैन',
  'Multi-deity': 'बहु-देवता',
};
const AREA_HI: Record<string, string> = {
  'Mahakal Area': 'महाकाल क्षेत्र',
  'Mahakal Vana': 'महाकाल वन',
  Bhairavgarh: 'भैरवगढ़',
  Rudrasagar: 'रुद्र सागर',
  Jawasiya: 'जवासिया',
  Freeganj: 'फ्रीगंज',
  Nanakheda: 'नानाखेड़ा',
  'Shipra Bank': 'शिप्रा तट',
  'Ankpat Road': 'अंकपात मार्ग',
  'Sandipani Area': 'सांदीपनि क्षेत्र',
  'City Center': 'मध्य उज्जैन',
};

/**
 * Premium MandirCard — gold-std editorial card.
 * Large photo (3:2 ratio · 60% of card real-estate)
 * Gold verified seal · 2-line title (sacred + roman) · location + timing chips
 * Hover: subtle lift + image zoom + gold border glow
 */
const PLACEHOLDER = '/images/mandir-placeholder.svg';

export function MandirCard({ mandir, featured = false, index = 0 }: Props) {
  const { locale } = useI18n();
  const prefix = locale === 'hi' ? '' : '/en';
  const href = `${prefix}/mandirs/${mandir.slug}/`;
  const rawPhoto = mandir.photos[0];
  // If no photo set, or it's the legacy placeholder, fall back to our SVG
  const photoJpg = !rawPhoto || rawPhoto.includes('placeholder') ? PLACEHOLDER : rawPhoto;
  const tType = locale === 'hi' ? (TEMPLE_TYPE_HI[mandir.templeType] || mandir.templeType) : mandir.templeType;
  const area = locale === 'hi' ? (AREA_HI[mandir.locationArea] || mandir.locationArea) : mandir.locationArea;
  const altName = locale === 'hi' ? mandir.name.en : mandir.name.hi;
  // Above-fold first 3 cards: eager load
  const loading = index < 3 ? 'eager' : 'lazy';

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_rgba(139,26,26,0.06)] ring-1 ring-cream-dark transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(139,26,26,0.18)] hover:ring-gold/60 ${featured ? 'ring-gold/70' : ''}`}
    >
      <Link to={href} className="block" aria-label={`${mandir.name[locale]} — ${locale === 'hi' ? 'विस्तृत जानकारी' : 'view details'}`}>
        {/* PHOTO — 3:2 ratio, image zoom on hover */}
        <div className="relative aspect-[3/2] overflow-hidden bg-maroon-900">
          <img
            src={photoJpg}
            alt={`${mandir.name[locale]} — ${altName} | Ujjain Mandir`}
            loading={loading}
            decoding="async"
            width={600}
            height={400}
            onError={(e) => {
              const img = e.currentTarget;
              if (!img.src.endsWith(PLACEHOLDER)) img.src = PLACEHOLDER;
            }}
            className="h-full w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.05]"
          />
          {/* Subtle dark bottom gradient — title legibility if overlaid in future */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-maroon-900/30 to-transparent" />
        </div>

        {/* BODY */}
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div>
            <h3 className={`font-bold text-maroon leading-tight line-clamp-2 ${locale === 'hi' ? 'font-sanskrit text-xl' : 'font-serif text-lg'}`}>
              {mandir.name[locale]}
            </h3>
            <p className="mt-1 text-[12px] uppercase tracking-wider text-saffron-700 line-clamp-1">
              {mandir.deity[locale]} · {tType}
            </p>
          </div>

          {/* Short intro — 2 lines */}
          <p className="text-[13px] leading-relaxed text-ink-soft line-clamp-2">
            {mandir.shortIntro[locale]}
          </p>

          {/* Quick info chips */}
          <div className="flex flex-wrap gap-2 text-[12px]">
            <span className="inline-flex items-center gap-1 rounded-md bg-cream-dark/60 px-2 py-1 text-ink-soft">
              <MapPin className="h-3 w-3 text-maroon" />
              {area}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-cream-dark/60 px-2 py-1 text-ink-soft">
              <Clock className="h-3 w-3 text-maroon" />
              {mandir.darshanTimingSummary[locale]}
            </span>
          </div>

          {/* Footer */}
          <div className="mt-auto flex items-center justify-between border-t border-cream-dark pt-3">
            <span className="text-[11px] text-ink-mute">
              {locale === 'hi' ? 'अद्यतन' : 'Updated'} · {mandir.lastVerified || '2026-05-27'}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-maroon px-3 py-1 text-[12px] font-semibold text-cream transition-colors group-hover:bg-saffron-600">
              {locale === 'hi' ? 'जानें' : 'Explore'}
              <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
