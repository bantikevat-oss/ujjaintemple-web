import { Phone, MessageCircle, Check } from 'lucide-react';
import type { Locale } from '../../i18n';
import { SITE } from '../../lib/site';
import { openWhatsAppGate } from './WhatsAppGate';
import { CAB_ROUTES, FARE_INCLUDES, VEHICLES, VEHICLE_ORDER, inr, type RouteId, type VehicleId } from '../../data/rates';

/*
 * Fixed cab fares, one price per vehicle (Aman, 2026-10-26: "advance lena hai to rate ek dum
 * confirm dikhna padega, range nahi"). 54 of 55 leads never became a booking and many asked
 * "kiraya kitna lagega" — a range invited the question; a fixed fare answers it.
 * Numbers come only from data/rates.ts. "Book" opens the WhatsApp gate with the exact route,
 * car and fare, so the lead and the chat both say what was picked.
 */
export function CabFareTable({ routes, locale, source }: { routes: RouteId[]; locale: Locale; source: string }) {
  const hi = locale === 'hi';

  const book = (routeId: RouteId, v: VehicleId, fare: number) => {
    const r = CAB_ROUTES[routeId];
    const note = `${r.title[locale]} · ${VEHICLES[v].name} · ${inr(fare)}`;
    window.gtag?.('event', 'fare_book_click', { route: routeId, vehicle: v, fare, source });
    openWhatsAppGate({ service: 'transport', purpose: 'cab', sourcePage: `fare:${source}`, note });
  };

  return (
    <section className="not-prose my-10 rounded-2xl border-2 border-gold/50 bg-white p-5 shadow-sm sm:p-6" aria-label={hi ? 'कैब किराया' : 'Cab fares'}>
      <p className={`text-xs font-bold text-saffron ${hi ? '' : 'uppercase tracking-[0.2em]'}`}>
        {hi ? 'तय किराया' : 'Fixed fares'}
      </p>
      <h2 className={`mt-1 text-2xl font-bold text-maroon ${hi ? 'font-sanskrit' : 'font-serif'}`}>
        {hi ? 'कैब किराया — एक गाड़ी, एक दाम' : 'Cab fares — one car, one price'}
      </h2>
      <p className="mt-2 flex items-start gap-2 text-sm text-ink-soft">
        <Check className="mt-0.5 h-4 w-4 shrink-0 text-maroon" aria-hidden />
        {FARE_INCLUDES[locale]}
      </p>

      <div className="mt-5 space-y-6">
        {routes.map((id) => {
          const r = CAB_ROUTES[id];
          return (
            <div key={id}>
              <h3 className={`text-lg font-bold text-ink ${hi ? 'font-sanskrit' : 'font-serif'}`}>{r.title[locale]}</h3>
              <p className="text-sm text-ink-mute">{r.detail[locale]}</p>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {VEHICLE_ORDER.map((v) => {
                  const fare = r.fares[v];
                  const veh = VEHICLES[v];
                  return (
                    <div key={v} className="flex flex-col rounded-xl border border-cream-dark bg-cream-light/60 p-4">
                      <p className="font-semibold text-ink">{veh.name} <span className="text-sm font-normal text-ink-mute">· {veh.kind[locale]} · {veh.seats} {hi ? 'सीट' : 'seats'}</span></p>
                      {fare !== null ? (
                        <>
                          <p className="mt-1 text-2xl font-bold text-maroon">{inr(fare)}</p>
                          {r.extra && (
                            <p className="text-xs text-ink-mute">
                              {hi
                                ? `अतिरिक्त: ₹${r.extra[v].km}/किमी · ₹${r.extra[v].hour}/घंटा`
                                : `Extra: ₹${r.extra[v].km}/km · ₹${r.extra[v].hour}/hour`}
                            </p>
                          )}
                          <button
                            type="button"
                            onClick={() => book(id, v, fare)}
                            className="mt-3 inline-flex items-center justify-center gap-2 rounded-md bg-maroon px-4 py-2 text-sm font-semibold text-white hover:bg-maroon/90"
                          >
                            <MessageCircle className="h-4 w-4" aria-hidden />
                            {hi ? 'यह गाड़ी बुक करें' : 'Book this car'}
                          </button>
                        </>
                      ) : (
                        <>
                          <p className="mt-1 text-lg font-semibold text-ink-soft">{hi ? 'कॉल पर दाम' : 'Price on call'}</p>
                          <a href={SITE.phoneTel} className="mt-3 inline-flex items-center justify-center gap-2 rounded-md border border-maroon px-4 py-2 text-sm font-semibold text-maroon hover:bg-maroon/5">
                            <Phone className="h-4 w-4" aria-hidden />
                            {hi ? 'कॉल करें' : 'Call'}
                          </a>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-xs text-ink-mute">
        {hi
          ? <>बुकिंग रद्द करने और रिफ़ंड की शर्तें: <a className="underline" href="/hi/cancellation-refund-policy/">रद्दीकरण और रिफ़ंड नीति</a>।</>
          : <>Cancellation and refund terms: <a className="underline" href="/cancellation-refund-policy/">Cancellation &amp; Refund Policy</a>.</>}
      </p>
    </section>
  );
}
