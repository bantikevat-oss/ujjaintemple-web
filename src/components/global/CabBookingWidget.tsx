import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowLeftRight, ArrowRight, BadgeIndianRupee, Calendar, Car, Check, Clock, MapPin, Navigation, Phone, ShieldCheck, Users } from 'lucide-react';
import type { Locale } from '../../i18n';
import { SITE } from '../../lib/site';
import { openWhatsAppGate } from './WhatsAppGate';
import {
  CAB_ROUTES, PICKUPS, PLACES, TRIP_TYPES, VEHICLES, VEHICLE_ORDER,
  dropsFor, inr, routeFor, tripTypesFor,
  type PlaceId, type TripType, type VehicleId,
} from '../../data/rates';

/*
 * Ola / oneway.cab-style cab booking (Aman, 2026-10-27), in two short steps so neither needs
 * scrolling: (1) trip type tiles → pickup → drop → date → time → "See fares";
 * (2) one fixed fare per car → Book. Fares come only from data/rates.ts; only priced
 * combinations appear. "Book" opens the WhatsApp gate with the whole trip in the chat and
 * the lead. When Razorpay is wired this button becomes "Pay ₹X advance".
 * Trust lines say only what is true today.
 */

type Preset = { from: PlaceId; to: PlaceId; type: TripType };

const isoOf = (d: Date) => {
  const x = new Date(d);
  x.setMinutes(x.getMinutes() - x.getTimezoneOffset());
  return x.toISOString().slice(0, 10);
};

/** 04:00 → 22:00, every 30 minutes. */
const SLOTS = Array.from({ length: 37 }, (_, i) => {
  const mins = 4 * 60 + i * 30;
  const h = Math.floor(mins / 60), m = mins % 60;
  const value = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  return { value, label: `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}` };
});

const SEAT_HINT: Record<VehicleId, { hi: string; en: string }> = {
  dzire:  { hi: '1–4 लोग', en: '1–4 people' },
  ertiga: { hi: 'परिवार · 6 तक', en: 'Family · up to 6' },
  innova: { hi: 'आरामदायक · 7 तक', en: 'Comfort · up to 7' },
};

/* Tabs, Savaari-style. Airport is its own tab (it is a one-way rate row of its own), so the
   One way tab lists only the non-airport one-way trips. */
type Tab = 'oneway' | 'round' | 'local' | 'airport';
const TAB_ORDER: Tab[] = ['oneway', 'round', 'local', 'airport'];
const TAB_LABEL: Record<Tab, { hi: string; en: string }> = {
  oneway:  { hi: 'वन-वे', en: 'One way' },
  round:   { hi: 'राउंड ट्रिप', en: 'Round trip' },
  local:   { hi: 'लोकल', en: 'Local' },
  airport: { hi: 'एयरपोर्ट', en: 'Airport' },
};
const typeOf = (tab: Tab): TripType => (tab === 'airport' ? 'oneway' : tab);
const fits = (tab: Tab, from: PlaceId, to: PlaceId) => {
  const r = routeFor(from, to, typeOf(tab));
  if (!r) return false;
  if (tab === 'airport') return r === 'indore-airport';
  if (tab === 'oneway') return r !== 'indore-airport';
  return true;
};
const pickupsFor = (tab: Tab) => PICKUPS.filter((p) => dropsFor(p).some((d) => fits(tab, p, d)));
const dropsForTab = (from: PlaceId, tab: Tab) => dropsFor(from).filter((d) => fits(tab, from, d));
const tabOf = (p: Preset): Tab => (routeFor(p.from, p.to, p.type) === 'indore-airport' ? 'airport' : p.type);

export function CabBookingWidget({ locale, source, preset, showTitle = true }: {
  locale: Locale; source: string; preset?: Preset; showTitle?: boolean;
}) {
  const hi = locale === 'hi';
  const start: Preset = preset ?? { from: 'ujjain', to: 'omkareshwar', type: 'round' };

  const [tab, setTab] = useState<Tab>(tabOf(start));
  const type = typeOf(tab);
  const [from, setFrom] = useState<PlaceId>(start.from);
  const [to, setTo] = useState<PlaceId>(start.to);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [vehicle, setVehicle] = useState<VehicleId>('dzire');
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState('');

  // Date options are built after mount: the page is pre-rendered at build time, and "Today"
  // must mean the visitor's today, not the build day.
  const [days, setDays] = useState<{ iso: string; label: string }[]>([]);
  useEffect(() => {
    const out: { iso: string; label: string }[] = [];
    for (let i = 0; i < 60; i++) {
      const d = new Date(); d.setDate(d.getDate() + i);
      const dm = d.toLocaleDateString(hi ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'short' });
      const wd = d.toLocaleDateString(hi ? 'hi-IN' : 'en-IN', { weekday: 'short' });
      const lead = i === 0 ? (hi ? 'आज' : 'Today') : i === 1 ? (hi ? 'कल' : 'Tomorrow') : wd;
      out.push({ iso: isoOf(d), label: `${lead} · ${dm}` });
    }
    setDays(out);
  }, [hi]);

  const routeId = routeFor(from, to, type);
  const route = routeId ? CAB_ROUTES[routeId] : null;
  const fare = route ? route.fares[vehicle] : null;

  const pickTab = (t: Tab) => {
    setTab(t);
    const f = pickupsFor(t).includes(from) ? from : pickupsFor(t)[0];
    setFrom(f);
    const ds = dropsForTab(f, t);
    setTo(ds.includes(to) ? to : ds[0]);
  };
  const pickFrom = (f: PlaceId) => {
    setFrom(f);
    const ds = dropsForTab(f, tab);
    setTo(ds.includes(to) ? to : ds[0]);
  };
  const canSwap = tab !== 'local' && fits(tab, to, from);
  const swap = () => { if (canSwap) { setFrom(to); setTo(from); } };

  const dayLabel = days.find((d) => d.iso === date)?.label ?? '';
  const slotLabel = SLOTS.find((s) => s.value === time)?.label ?? '';
  const tripLine = type === 'local'
    ? `${PLACES[from][locale]} · ${TRIP_TYPES.local[locale]}`
    : `${PLACES[from][locale]} → ${PLACES[to][locale]} · ${TRIP_TYPES[type][locale]}`;

  const seeFares = () => {
    if (!date) { setError(hi ? 'यात्रा की तारीख़ चुनें' : 'Choose the travel date'); return; }
    if (!time) { setError(hi ? 'पिकअप का समय चुनें' : 'Choose the pickup time'); return; }
    setError('');
    setStep(2);
  };

  const book = () => {
    if (!route || fare === null) return;
    const note = `${tripLine} · ${VEHICLES[vehicle].name} · ${inr(fare)} · ${dayLabel}, ${slotLabel}`;
    window.gtag?.('event', 'fare_book_click', { route: routeId, vehicle, fare, source });
    openWhatsAppGate({ service: 'transport', purpose: 'cab', sourcePage: `booking:${source}`, note });
  };

  const box = 'flex items-center gap-2.5 rounded-xl border border-cream-dark bg-white px-3 focus-within:border-maroon focus-within:ring-1 focus-within:ring-maroon';
  const sel = 'w-full appearance-none bg-transparent py-2.5 text-[15px] font-semibold text-ink focus:outline-none';
  const cap = 'mb-1 block text-[11px] font-bold text-ink-mute';

  const trust = useMemo(() => ([
    { Icon: BadgeIndianRupee, t: hi ? 'बुक करने के लिए अभी भुगतान नहीं' : 'No payment to book' },
    { Icon: Check, t: hi ? 'टोल, पार्किंग, ड्राइवर शामिल' : 'Toll, parking, driver included' },
    { Icon: ShieldCheck, t: hi ? '48 घंटे पहले रद्द — पूरा रिफ़ंड' : 'Cancel 48 h ahead — full refund' },
  ]), [hi]);

  return (
    <section className="not-prose overflow-hidden rounded-3xl border border-gold/40 bg-white shadow-2xl" aria-label={hi ? 'कैब बुकिंग' : 'Cab booking'}>
      {showTitle && (
        <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-maroon-800 to-maroon px-5 py-3 text-white">
          <h2 className={`text-lg font-bold sm:text-xl ${hi ? 'font-sanskrit' : 'font-serif'}`}>
            {hi ? 'कैब बुक करें — तय किराया' : 'Book a cab — fixed fare'}
          </h2>
          <span className="text-xs text-cream/80">{hi ? `चरण ${step}/2` : `Step ${step}/2`}</span>
        </div>
      )}

      <div className="p-4 sm:p-6">
        {step === 1 ? (
          <div className="space-y-4">
            {/* Tabs — one segmented row */}
            <div role="radiogroup" aria-label={hi ? 'यात्रा का प्रकार' : 'Trip type'}
              className="mx-auto grid max-w-xl grid-cols-4 overflow-hidden rounded-xl border border-maroon/30">
              {TAB_ORDER.map((t) => {
                const on = t === tab;
                return (
                  <button key={t} type="button" role="radio" aria-checked={on} onClick={() => pickTab(t)}
                    className={`border-r border-maroon/20 py-2.5 text-sm font-bold last:border-r-0 transition-colors ${on ? 'bg-maroon text-white' : 'bg-white text-ink hover:bg-cream-light'}`}>
                    {TAB_LABEL[t][locale]}
                  </button>
                );
              })}
            </div>

            {/* From ⇄ To · Date · Time — one row on desktop */}
            <div className="grid grid-cols-2 items-end gap-3 lg:grid-cols-[1fr_auto_1fr_1fr_1fr]">
              <div className="col-span-2 lg:col-span-1">
                <label className={cap} htmlFor={`${source}-from`}>{hi ? 'कहाँ से' : 'FROM'}</label>
                <div className={box}>
                  <MapPin className="h-4 w-4 shrink-0 text-maroon" aria-hidden />
                  <select id={`${source}-from`} className={sel} value={from} onChange={(e) => pickFrom(e.target.value as PlaceId)}>
                    {pickupsFor(tab).map((p) => <option key={p} value={p}>{PLACES[p][locale]}</option>)}
                  </select>
                </div>
              </div>
              <button type="button" onClick={swap} disabled={!canSwap} aria-label={hi ? 'कहाँ से और कहाँ तक बदलें' : 'Swap pickup and drop'}
                className="hidden h-10 w-10 items-center justify-center self-end rounded-full bg-cream-light text-maroon hover:bg-maroon hover:text-white disabled:opacity-30 disabled:hover:bg-cream-light disabled:hover:text-maroon lg:mb-0.5 lg:flex">
                <ArrowLeftRight className="h-4 w-4" aria-hidden />
              </button>
              {tab === 'local' ? (
                <div className="col-span-2 lg:col-span-1">
                  <span className={cap}>{hi ? 'पैकेज' : 'PACKAGE'}</span>
                  <div className={`${box} py-2.5 text-[15px] font-semibold text-ink`}>
                    <Clock className="h-4 w-4 shrink-0 text-maroon" aria-hidden />
                    {hi ? '8 घंटे / 80 किमी' : '8 hr / 80 km'}
                  </div>
                </div>
              ) : (
                <div className="col-span-2 lg:col-span-1">
                  <label className={cap} htmlFor={`${source}-to`}>{hi ? 'कहाँ तक' : 'TO'}</label>
                  <div className={box}>
                    <Navigation className="h-4 w-4 shrink-0 text-saffron" aria-hidden />
                    <select id={`${source}-to`} className={sel} value={to} onChange={(e) => setTo(e.target.value as PlaceId)}>
                      {dropsForTab(from, tab).map((p) => <option key={p} value={p}>{PLACES[p][locale]}</option>)}
                    </select>
                  </div>
                </div>
              )}
              <div>
                <label className={cap} htmlFor={`${source}-date`}>{hi ? 'पिकअप तारीख़' : 'PICKUP DATE'}</label>
                <div className={box}>
                  <Calendar className="h-4 w-4 shrink-0 text-maroon" aria-hidden />
                  <select id={`${source}-date`} className={sel} value={date} onChange={(e) => { setDate(e.target.value); setError(''); }}>
                    <option value="">{hi ? 'चुनें' : 'Select'}</option>
                    {days.map((d) => <option key={d.iso} value={d.iso}>{d.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={cap} htmlFor={`${source}-time`}>{hi ? 'पिकअप समय' : 'PICKUP TIME'}</label>
                <div className={box}>
                  <Clock className="h-4 w-4 shrink-0 text-maroon" aria-hidden />
                  <select id={`${source}-time`} className={sel} value={time} onChange={(e) => { setTime(e.target.value); setError(''); }}>
                    <option value="">{hi ? 'चुनें' : 'Select'}</option>
                    {SLOTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <button type="button" onClick={seeFares}
              className={`mx-auto flex w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-saffron py-3.5 text-base font-extrabold text-white shadow-lg hover:brightness-95 active:scale-[0.99] ${hi ? '' : 'uppercase tracking-wide'}`}>
              {hi ? 'किराया देखें' : 'See cab fares'} <ArrowRight className="h-5 w-5" aria-hidden />
            </button>
            {error && <p className="text-center text-sm font-semibold text-red-700" role="alert">{error}</p>}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Trip summary */}
            <div className="flex items-center justify-between gap-3 rounded-xl bg-cream-light/80 px-4 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-ink">{tripLine}</p>
                <p className="text-xs text-ink-mute">{dayLabel}, {slotLabel}</p>
              </div>
              <button type="button" onClick={() => setStep(1)} className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-maroon hover:underline">
                <ArrowLeft className="h-4 w-4" aria-hidden /> {hi ? 'बदलें' : 'Change'}
              </button>
            </div>

            {/* Cars */}
            {route && (
              <div role="radiogroup" aria-label={hi ? 'गाड़ी चुनें' : 'Choose your car'} className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
                {VEHICLE_ORDER.map((v) => {
                  const f = route.fares[v];
                  const on = v === vehicle;
                  return (
                    <button key={v} type="button" role="radio" aria-checked={on} onClick={() => setVehicle(v)}
                      className={`relative flex items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-all sm:flex-col sm:items-start ${on ? 'border-maroon bg-maroon/[0.04] shadow-md' : 'border-cream-dark hover:border-maroon/40'}`}>
                      {on && <Check className="absolute right-2.5 top-2.5 hidden h-5 w-5 rounded-full bg-maroon p-0.5 text-white sm:block" aria-hidden />}
                      <span className="flex items-center gap-2.5">
                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${on ? 'bg-maroon text-white' : 'bg-cream-light text-maroon'}`}><Car className="h-4.5 w-4.5" aria-hidden /></span>
                        <span>
                          <span className="block font-bold text-ink">{VEHICLES[v].name}</span>
                          <span className="flex items-center gap-1 text-xs text-ink-mute"><Users className="h-3 w-3" aria-hidden />{SEAT_HINT[v][locale]}</span>
                        </span>
                      </span>
                      <span className={`font-bold ${f === null ? 'text-sm text-ink-soft' : 'text-xl text-maroon sm:text-2xl'}`}>
                        {f === null ? (hi ? 'कॉल पर' : 'On call') : inr(f)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
            {route?.extra && (
              <p className="text-xs text-ink-mute">
                {hi
                  ? `80 किमी / 8 घंटे से ज़्यादा: ₹${route.extra[vehicle].km}/किमी · ₹${route.extra[vehicle].hour}/घंटा`
                  : `Beyond 80 km / 8 hours: ₹${route.extra[vehicle].km}/km · ₹${route.extra[vehicle].hour}/hour`}
              </p>
            )}

            {fare !== null ? (
              <button type="button" onClick={book}
                className="mx-auto flex w-full max-w-sm items-center justify-center gap-3 rounded-xl bg-saffron py-3.5 text-lg font-bold text-white shadow-lg hover:brightness-95 active:scale-[0.99]">
                {hi ? `${VEHICLES[vehicle].name} बुक करें` : `Book ${VEHICLES[vehicle].name}`}
                <span className="rounded-md bg-white/15 px-2 py-0.5">{inr(fare)}</span>
                <ArrowRight className="h-5 w-5" aria-hidden />
              </button>
            ) : (
              <a href={SITE.phoneTel} className="mx-auto flex w-full max-w-sm items-center justify-center gap-2 rounded-xl border-2 border-maroon py-3.5 text-lg font-bold text-maroon hover:bg-maroon/5">
                <Phone className="h-5 w-5" aria-hidden /> {hi ? 'कॉल करें' : 'Call'}
              </a>
            )}
          </div>
        )}

        {/* Trust — one line */}
        <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-ink-soft">
          {trust.map(({ Icon, t }) => (
            <li key={t} className="flex items-center gap-1.5"><Icon className="h-3.5 w-3.5 text-maroon" aria-hidden />{t}</li>
          ))}
          <li>
            <a className="underline" href={hi ? '/hi/pricing/' : '/pricing/'}>{hi ? 'सभी किराए' : 'All fares'}</a>
            {' · '}
            <a className="underline" href={hi ? '/hi/cancellation-refund-policy/' : '/cancellation-refund-policy/'}>{hi ? 'रिफ़ंड नीति' : 'Refund policy'}</a>
          </li>
        </ul>
      </div>
    </section>
  );
}
