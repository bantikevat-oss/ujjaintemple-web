import { Navigation } from 'lucide-react';
import { useI18n } from '../../i18n';

interface Props {
  lat: number;
  lng: number;
  name: string;
  zoom?: number;
}

export function MapEmbed({ lat, lng, name, zoom = 16 }: Props) {
  const { locale } = useI18n();
  // OSM embed — no API key, no quota. Replace with Google Maps embed once API key available.
  const osmSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.005},${lat - 0.003},${lng + 0.005},${lat + 0.003}&layer=mapnik&marker=${lat},${lng}`;
  const dirUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;

  return (
    <div className="space-y-2">
      <div className="aspect-[16/9] overflow-hidden rounded-lg border border-cream-dark">
        <iframe
          src={osmSrc}
          title={`Map of ${name}`}
          loading="lazy"
          className="h-full w-full"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <a href={dirUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm">
        <Navigation className="h-4 w-4" />
        {locale === 'hi' ? 'रास्ता पाएँ' : 'Get Directions'}
      </a>
    </div>
  );
}
