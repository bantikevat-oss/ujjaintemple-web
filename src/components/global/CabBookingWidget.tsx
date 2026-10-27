import { useMemo, useState } from 'react';
import { ArrowRight, Calendar, Car, Check, Clock, MapPin, Phone } from 'lucide-react';
import type { Locale } from '../../i18n';
import { SITE } from '../../lib/site';
import { openWhatsAppGate } from './WhatsAppGate';
import {
  CAB_ROUTES, FARE_INCLUDES, PICKUPS, PLACES, TRIP_TYPES, VEHICLES, VEHICLE_ORDER,
  dropsFor, inr, routeFor, tripTypesFor,
  type PlaceId, type TripType, type VehicleId,
} from '../../data/rates';

/*
 * Ola/Uber-style cab booking (Aman, 2026-10-27): pick pickup → drop → trip type → date and
 * time, see one fixed fare per car, pick a car, book. Replaces the card grid on the cab pages.
 * Fares come only from data/rates.ts; only priced combinations appear in the dropdowns.
 * "Book" opens the WhatsApp gate with the full trip (route, type, car, fare, date, time) in
 * the chat and the lead. When Razorpay is live this button becomes "Pay ₹X advance".
 */

type Preset = { from: PlaceId; to: PlaceId; type: TripType };

const todayIso = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

export function CabBookingWidget({ locale, source, preset }: { locale: Locale; source: string; preset?: Preset }) {
  const hi = locale === 'hi';
  const start: Preset = preset ?? { from: 'ujjain', to: 'omkareshwar', type: 'round' };

  const [from, setFrom] = useState<PlaceId>(start.from);
  const [to, setTo] = useState<PlaceId>(start.to);
  const [type, setType] = useState<TripType>(start.type);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [vehicle, setVehicle] = useState<VehicleId>('dzire');
  const [error, setError] = useState('');

  const drops = dropsFor(from);
  const types = tripTypesFor(from, to);
  const routeId = routeFor(from, to, type);
  const route = routeId ? CAB_ROUTES[routeId] : null;
  const fare = route ? route.fares[vehicle] : null;

  const onFrom = (v: PlaceId) => {
    setFrom(v);
    const nextTo = dropsFor(v).includes(to) ? to : dropsFor(v)[0];
    setTo(nextTo);
    const t = tripTypesFor(v, nextTo);
    if (!t.includes(type)) setType(t[0]);
  };
  const onTo = (v: PlaceId) => {
    setTo(v);
    const t = tripTypesFor(from, v);
    if (!t.includes(type)) setType(t[0]);
  };

  const whenLabel = useMemo(() => {
    if (!date) return '';
    const d = new Date(`${date}T${time || '00:00'}`);
    const day = d.toLocaleDateString(hi ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    return time ? `${day}, ${time}` : day;
  }, [date, time, hi]);

  const book = () => {
    if (!route) return;
    if (!date) { setError(hi ? 'यात्रा की तारीख़ चुनें' : 'Choose the travel date'); return; }
    if (date < todayIso()) { setError(hi ? 'आज या आगे की तारीख़ चुनें' : 'Choose today or a later date'); return; }
    if (!time) { setError(hi ? 'पिकअप का समय चुनें' : 'Choose the pickup time'); return; }
    if (fare === null) return;
    setError('');
    const note = `${PLACES[from][locale]} → ${PLACES[to][locale]} · ${TRIP_TYPES[type][locale]} · ${VEHICLES[vehicle].name} · ${inr(fare)} · ${whenLabel}`;
    window.gtag?.('event', 'fare_book_click', { route: routeId, vehicle, fare, source });
    openWhatsAppGate({ service: 'transport', purpose: 'cab', sourcePage: `booking:${source}`, note });
  };

  const label = 'block text-xs font-semibold text-ink-mute mb-1';
  const field = 'w-full rounded-md border border-cream-dark bg-white px-3 py-2.5 text-ink focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon';

  return (
    <section className="not-prose my-10 overflow-hidden rounded-2xl border-2 border-gold/50 bg-white shadow-md" aria-label={hi ? 'कैब बुकिंग' : 'Cab booking'}>
      <div className="bg-maroon px-5 py-4 text-white sm:px-6">
        <h2 className={`text-xl font-bold sm:text-2xl ${hi ? 'font-sanskrit' : 'font-serif'}`}>
          {hi ? 'कैब बुक करें — तय किराया' : 'Book a cab — fixed fare'}
        </h2>
        <p className="mt-1 flex items-start gap-2 text-sm text-cream/90">
          <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {FARE_INCLUDES[locale]}
        </p>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        {/* 1 — where */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className={label} htmlFor={`${source}-from`}><MapPin className="mr-1 inline h-3.5 w-3.5" aria-hidden />{hi ? 'कहाँ से' : 'Pickup'}</label>
            <select id={`${source}-from`} className={field} value={from} onChange={(e) => onFrom(e.target.value as PlaceId)}>
              {PICKUPS.map((p) => <option key={p} value={p}>{PLACES[p][locale]}</option>)}
            </select>
          </div>
          <div>
            <label className={label} htmlFor={`${source}-to`}><MapPin className="mr-1 inline h-3.5 w-3.5" aria-hidden />{hi ? 'कहाँ तक' : 'Drop'}</label>
            <select id={`${source}-to`} className={field} value={to} onChange={(e) => onTo(e.target.value as PlaceId)}>
              {drops.map((p) => <option key={p} value={p}>{PLACES[p][locale]}</option>)}
            </select>
          </div>
          <div>
            <label className={label} htmlFor={`${source}-type`}><ArrowRight className="mr-1 inline h-3.5 w-3.5" aria-hidden />{hi ? 'यात्रा का प्रकार' : 'Trip type'}</label>
            <select id={`${source}-type`} className={field} value={type} onChange={(e) => setType(e.target.value as TripType)}>
              {types.map((t) => <option key={t} value={t}>{TRIP_TYPES[t][locale]}</option>)}
            </select>
          </div>
        </div>

        {/* 2 — when */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label} htmlFor={`${source}-date`}><Calendar className="mr-1 inline h-3.5 w-3.5" aria-hidden />{hi ? 'तारीख़' : 'Date'}</label>
            <input id={`${source}-date`} type="date" min={todayIso()} className={field} value={date}
              onChange={(e) => { setDate(e.target.value); setError(''); }} />
          </div>
          <div>
            <label className={label} htmlFor={`${source}-time`}><Clock className="mr-1 inline h-3.5 w-3.5" aria-hidden />{hi ? 'पिकअप समय' : 'Pickup time'}</label>
            <input id={`${source}-time`} type="time" className={field} value={time}
              onChange={(e) => { setTime(e.target.value); setError(''); }} />
          </div>
        </div>

        {/* 3 — car */}
        {route && (
          <div>
            <p className={label}><Car className="mr-1 inline h-3.5 w-3.5" aria-hidden />{hi ? 'गाड़ी चुनें' : 'Choose your car'}</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3" role="radiogroup" aria-label={hi ? 'गाड़ी' : 'Car'}>
              {VEHICLE_ORDER.map((v) => {
                const f = route.fares[v];
                const sel = v === vehicle;
                return (
                  <button
                    key={v}
                    type="button"
                    role="radio"
                    aria-checked={sel}
                    onClick={() => setVehicle(v)}
                    className={`flex items-center justify-between rounded-xl border-2 px-4 py-3 text-left transition-colors ${sel ? 'border-maroon bg-maroon/5' : 'border-cream-dark hover:border-maroon/40'}`}
                  >
                    <span>
                      <span className="block font-semibold text-ink">{VEHICLES[v].name}</span>
                      <span className="block text-xs text-ink-mute">{VEHICLES[v].kind[locale]} · {VEHICLES[v].seats} {hi ? 'सीट' : 'seats'}</span>
                    </span>
                    <span className={`text-lg font-bold ${f === null ? 'text-sm text-ink-soft' : 'text-maroon'}`}>
                      {f === null ? (hi ? 'कॉल पर' : 'On call') : inr(f)}
                    </span>
                  </button>
                );
              })}
            </div>
            {route.extra && (
              <p className="mt-2 text-xs text-ink-mute">
                {hi
                  ? `80 किमी / 8 घंटे से ज़्यादा: ₹${route.extra[vehicle].km}/किमी · ₹${route.extra[vehicle].hour}/घंटा`
                  : `Beyond 80 km / 8 hours: ₹${route.extra[vehicle].km}/km · ₹${route.extra[vehicle].hour}/hour`}
              </p>
            )}
          </div>
        )}

        {/* 4 — book */}
        <div className="flex flex-col gap-3 border-t border-cream-dark pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs text-ink-mute">{hi ? 'कुल किराया' : 'Total fare'}</p>
            <p className="text-2xl font-bold text-maroon">{fare !== null ? inr(fare) : (hi ? 'कॉल पर बताया जाएगा' : 'Shared on call')}</p>
          </div>
          {fare !== null ? (
            <button type="button" onClick={book}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-maroon px-6 py-3 font-bold text-white shadow-md hover:bg-maroon/90 active:scale-95">
              {hi ? `${VEHICLES[vehicle].name} बुक करें` : `Book ${VEHICLES[vehicle].name}`}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          ) : (
            <a href={SITE.phoneTel}
              className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-maroon px-6 py-3 font-bold text-maroon hover:bg-maroon/5">
              <Phone className="h-4 w-4" aria-hidden /> {hi ? 'कॉल करें' : 'Call'}
            </a>
          )}
        </div>
        {error && <p className="text-sm font-semibold text-red-700" role="alert">{error}</p>}

        <p className="text-xs text-ink-mute">
          {hi
            ? <>रद्द करने और रिफ़ंड की शर्तें: <a className="underline" href="/hi/cancellation-refund-policy/">रद्दीकरण और रिफ़ंड नीति</a> · <a className="underline" href="/hi/pricing/">सभी किराए</a></>
            : <>Cancellation and refunds: <a className="underline" href="/cancellation-refund-policy/">Cancellation &amp; Refund Policy</a> · <a className="underline" href="/pricing/">All fares</a></>}
        </p>
      </div>
    </section>
  );
}
