import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useI18n } from '../../i18n';

/**
 * "Plan your darshan" money links on informational pages (temple detail, temple index,
 * 84 Mahadev list). Was inline in mandirs/Detail.tsx with two cards (taxi service hub +
 * tour packages).
 *
 * 2026-11-13 (Aman: "money keyword ko top me lau"): GSC 28 d showed the route taxi pages
 * barely rank — /transport-in-ujjain/ujjain-to-omkareshwar-taxi/ at ~57, and "ujjain darshan
 * taxi" at ~10 — while the temple pages carry most of the site's traffic (Kal Bhairav
 * EN+HI ~700 clicks/28 d, /hi/mandirs/ 360). So two more cards now link those pages with
 * the words people search ("Ujjain darshan taxi", "Ujjain to Omkareshwar taxi"), and the
 * block also goes on the temple index and the 84 Mahadev list, which had no money links.
 * Additive only: no title, H1 or existing link was changed.
 *
 * Copy rules: no number, no "call" (calls are off — lib/noPhone.ts), no free/offer words,
 * pure English or pure Hindi.
 */
const CARDS = [
  {
    path: '/transport-in-ujjain/ujjain-local-sightseeing-cab/',
    icon: '🚖',
    t: { hi: 'उज्जैन दर्शन टैक्सी', en: 'Ujjain Darshan Taxi' },
    d: {
      hi: 'महाकालेश्वर, काल भैरव, हरसिद्धि, मंगलनाथ सहित सभी प्रमुख मंदिर एक दिन में — 8 घंटे / 80 किमी।',
      en: 'Mahakaleshwar, Kal Bhairav, Harsiddhi, Mangalnath and the other main temples in one day — 8 hours / 80 km.',
    },
  },
  {
    path: '/transport-in-ujjain/ujjain-to-omkareshwar-taxi/',
    icon: '🛣️',
    t: { hi: 'उज्जैन से ओंकारेश्वर टैक्सी', en: 'Ujjain to Omkareshwar Taxi' },
    d: {
      hi: 'दूसरे ज्योतिर्लिंग के लिए राउंड ट्रिप या वन-वे कैब — टोल व पार्किंग शामिल।',
      en: 'Round-trip or one-way cab to the second Jyotirlinga — toll and parking included.',
    },
  },
  {
    path: '/cab-booking/',
    icon: '🚕',
    t: { hi: 'उज्जैन टैक्सी सेवा', en: 'Taxi Service in Ujjain' },
    d: {
      hi: 'लोकल दर्शन, ओंकारेश्वर व इंदौर एयरपोर्ट के लिए कैब बुकिंग — तय किराया।',
      en: 'Cab booking for local darshan, Omkareshwar and Indore airport — fixed fares.',
    },
  },
  {
    path: '/tour-and-travel-ujjain/',
    icon: '🛕',
    t: { hi: 'उज्जैन टूर पैकेज', en: 'Ujjain Tour Packages' },
    d: {
      hi: 'उज्जैन दर्शन पैकेज — मंदिर दर्शन, ठहरने व यात्रा की पूरी व्यवस्था एक जगह।',
      en: 'Ujjain darshan packages — temple visits, stay and travel arranged end-to-end.',
    },
  },
] as const;

export function DarshanTripLinks({ heading, className = '' }: { heading: { hi: string; en: string }; className?: string }) {
  const { locale } = useI18n();
  const hi = locale === 'hi';
  const prefix = hi ? '/hi' : '';
  return (
    <section className={`container-page pt-4 pb-7 ${className}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-label">{hi ? 'यात्रा योजना' : 'Plan Your Darshan'}</p>
      <h2 className={`mt-2 mb-5 font-bold text-maroon ${hi ? 'font-sanskrit text-2xl sm:text-3xl' : 'font-serif text-xl sm:text-2xl'}`}>
        {hi ? heading.hi : heading.en}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {CARDS.map((c) => (
          <Link
            key={c.path}
            to={`${prefix}${c.path}`}
            className="group flex items-start gap-3 rounded-2xl border border-gold/40 bg-gradient-to-br from-gold-50/60 to-cream p-5 transition-colors hover:border-maroon/40 hover:bg-cream-dark"
          >
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-maroon-900 text-gold">{c.icon}</span>
            <div className="flex-1">
              <h3 className={`flex items-center gap-1 font-bold text-maroon ${hi ? 'font-sanskrit text-lg' : 'font-serif text-base'}`}>
                {hi ? c.t.hi : c.t.en}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{hi ? c.d.hi : c.d.en}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
