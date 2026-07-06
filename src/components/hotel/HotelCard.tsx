import { Link } from 'react-router-dom';
import { MapPin, Phone } from 'lucide-react';
import { useI18n } from '../../i18n';
import { SITE } from '../../lib/site';
import type { Hotel } from '../../lib/types';

interface Props { hotel: Hotel; }

export function HotelCard({ hotel }: Props) {
  const { locale } = useI18n();
  const prefix = locale === 'en' ? '' : '/hi';
  const href = `${prefix}/hotels/${hotel.slug}/`;
  const photo = hotel.photos[0] || '/images/hotels/placeholder.webp';

  const tierLabels = {
    budget: { hi: 'बजट', en: 'Budget' },
    mid: { hi: 'मध्यम', en: 'Mid-range' },
    luxury: { hi: 'लक्ज़री', en: 'Luxury' },
  };

  return (
    <article className="group overflow-hidden rounded-lg border border-cream-dark bg-white shadow-sm transition-all hover:shadow-md">
      <Link to={href} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-cream-dark">
          <img
            src={photo}
            alt={`${hotel.name[locale]} ${hotel.area} Ujjain`}
            loading="lazy"
            decoding="async"
            width={400}
            height={300}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          <span className="absolute left-2 top-2 rounded-full bg-saffron px-2 py-0.5 text-xs font-bold text-white">
            {tierLabels[hotel.category][locale]}
          </span>
        </div>
        <div className="p-4">
          <h3 className="font-serif text-lg font-bold text-maroon line-clamp-1">{hotel.name[locale]}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-ink-soft">
            <MapPin className="h-3.5 w-3.5 text-maroon" /> {hotel.area} · {hotel.distanceFromMahakal}
          </p>
          <div className="mt-3 flex flex-wrap gap-1">
            {hotel.amenities.slice(0, 4).map((a) => (
              <span key={a} className="rounded bg-cream-dark/40 px-2 py-0.5 text-xs text-ink-mute">{a}</span>
            ))}
          </div>
        </div>
      </Link>
      <a href={SITE.phoneTel} className="block bg-maroon py-2.5 text-center text-sm font-bold text-white hover:bg-maroon-600">
        <Phone className="mr-1 inline h-4 w-4" />
        {locale === 'hi' ? 'बुक करने के लिए कॉल करें' : 'Call to Book'}
      </a>
    </article>
  );
}
