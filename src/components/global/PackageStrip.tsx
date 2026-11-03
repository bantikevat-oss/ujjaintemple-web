import { Link } from 'react-router-dom';
import { ArrowRight, Hotel } from 'lucide-react';
import { useI18n } from '../../i18n';

/*
 * One line that turns a cab or travel-guide reader into a package reader (2026-11-03).
 *
 * GSC 90 days to 11-01: /hi/transport-in-ujjain/ujjain-to-omkareshwar-cab/ alone had 101k
 * impressions and 1,165 clicks, the tour guides (best places, Mahakal darshan guide, travel
 * guide) another ~50k impressions — while every package page together had a few hundred. So
 * the people planning a whole trip are already here, reading cab and guide pages, and the
 * only lead those pages could produce was a cab fare. Behaviour playbook #5: many cab visitors
 * want the whole trip (cab + hotel). The full TripNextStep block still sits after the body;
 * this is the short version, high enough on the page to be seen.
 */

type B = { hi: string; en: string };
type Strip = { to: string; lead: B; text: B };

const TO_HUB: Strip = {
  to: '/tour-and-travel-ujjain/',
  lead: { hi: '2–3 दिन रुकना है?', en: 'Staying 2–3 days?' },
  text: { hi: 'उज्जैन टूर पैकेज देखें — होटल और गाड़ी एक ही रेट में', en: 'See Ujjain tour packages — hotel and car in one quote' },
};

const BY_SOURCE: Record<string, Strip | null> = {
  'transport/ujjain-to-omkareshwar-cab': {
    to: '/tour-and-travel-ujjain/ujjain-omkareshwar-package/',
    lead: { hi: 'रात रुकना है?', en: 'Staying the night?' },
    text: { hi: 'उज्जैन ओंकारेश्वर टूर पैकेज (2 दिन) — होटल और गाड़ी एक ही रेट में', en: 'Ujjain Omkareshwar tour package (2 days) — hotel and car in one quote' },
  },
  // Someone leaving Ujjain for Indore is done with the trip.
  'transport/ujjain-to-indore-taxi': null,
};

export function PackageStrip({ source }: { source: string }) {
  const { locale } = useI18n();
  const isHi = locale === 'hi';
  const strip = source in BY_SOURCE ? BY_SOURCE[source] : TO_HUB;
  if (!strip) return null;

  return (
    <Link
      to={`${isHi ? '/hi' : ''}${strip.to}`}
      onClick={() => window.gtag?.('event', 'package_strip_click', { source, to: strip.to })}
      className="not-prose my-6 flex items-center gap-3 rounded-xl border border-gold bg-cream px-4 py-3 text-ink no-underline shadow-sm transition hover:border-maroon hover:shadow-md"
    >
      <Hotel className="h-5 w-5 flex-shrink-0 text-maroon" />
      <span className="flex-1 text-sm sm:text-base">
        <strong className="text-maroon">{strip.lead[locale]}</strong> {strip.text[locale]}
      </span>
      <ArrowRight className="h-4 w-4 flex-shrink-0 text-maroon" />
    </Link>
  );
}
