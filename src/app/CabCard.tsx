import { ArrowRight, Car } from 'lucide-react';
import { useI18n } from '../i18n';
import { CAB_ROUTES, fromFare, inr, type RouteId } from '../data/rates';
import { ADVANCE } from '../components/global/CabBookingWidget';

const SHOWN: RouteId[] = ['omkareshwar-round', 'ujjain-local', 'indore-airport'];

/**
 * Fixed-fare cab booking, from the app screens. A plain <a>, not a router Link: the Android
 * shell has to see a real page load to open /cab-booking/ in a Chrome Custom Tab, where the
 * Razorpay advance works (UPI apps, card OTP). In a browser it is an ordinary link.
 */
export function CabCard() {
  const { locale } = useI18n();
  const hi = locale === 'hi';

  return (
    <section className="mt-4 overflow-hidden rounded-2xl border border-gold/40 bg-white shadow-sm">
      <div className="flex items-center gap-2 bg-maroon px-4 py-2.5 text-white">
        <Car className="h-5 w-5 text-gold-light" aria-hidden />
        <h2 className={`text-base font-bold ${hi ? 'font-hindi' : 'font-serif'}`}>
          {hi ? 'तय किराये पर कैब बुक करें' : 'Book a cab at a fixed fare'}
        </h2>
      </div>
      <ul className="divide-y divide-cream-dark px-4">
        {SHOWN.map((id) => (
          <li key={id} className="flex items-center justify-between gap-3 py-2 text-sm">
            <span className="text-ink">{hi ? CAB_ROUTES[id].title.hi : CAB_ROUTES[id].title.en}</span>
            <span className="shrink-0 font-semibold text-maroon">
              {inr(fromFare(id))}{hi ? ' से' : ' onwards'}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between gap-3 border-t border-cream-dark bg-cream/60 px-4 py-3">
        <p className="text-xs leading-snug text-ink-soft">
          {hi
            ? `₹${ADVANCE} एडवांस से बुकिंग पक्की · बाकी ड्राइवर को · टोल-पार्किंग शामिल`
            : `₹${ADVANCE} advance confirms it · rest to the driver · toll & parking included`}
        </p>
        <a
          href={`${hi ? '/hi' : ''}/cab-booking/`}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-maroon px-4 py-2 text-sm font-bold text-white"
        >
          {hi ? 'बुक करें' : 'Book'}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </a>
      </div>
    </section>
  );
}
