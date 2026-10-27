import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowLeftRight, ArrowRight, BadgeIndianRupee, Calendar, Car, Check, CheckCircle2, Clock, Loader2, Lock, MapPin, MessageCircle, Navigation, Phone, ShieldCheck, User, Users } from 'lucide-react';
import type { Locale } from '../../i18n';
import { SITE } from '../../lib/site';
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

export const ADVANCE = 500;   // ₹500 flat advance (Aman, 2026-10-27) — the server sets the real amount

/* Razorpay Checkout, loaded only when someone actually pays. */
type RzpResponse = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
type RzpInstance = { open: () => void; on: (ev: string, cb: (r: { error?: { description?: string } }) => void) => void };
declare global { interface Window { Razorpay?: new (opts: Record<string, unknown>) => RzpInstance } }
let rzpLoader: Promise<boolean> | null = null;
const loadRazorpay = () => {
  if (window.Razorpay) return Promise.resolve(true);
  rzpLoader = rzpLoader ?? new Promise<boolean>((resolve) => {
    const sc = document.createElement('script');
    sc.src = 'https://checkout.razorpay.com/v1/checkout.js';
    sc.onload = () => resolve(true);
    sc.onerror = () => { rzpLoader = null; resolve(false); };
    document.body.appendChild(sc);
  });
  return rzpLoader;
};

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
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pickupNote, setPickupNote] = useState('');
  const [paying, setPaying] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [requested, setRequested] = useState(false);   // step 4 without payment (gateway off)
  const [error, setError] = useState('');

  // Date options are built after mount: the page is pre-rendered at build time, and "Today"
  // must mean the visitor's today, not the build day.
  const [days, setDays] = useState<{ iso: string; label: string }[]>([]);
  useEffect(() => {
    const out: { iso: string; label: string }[] = [];
    // No same-day bookings (Aman, 2026-10-27): the list starts tomorrow; today's trips go to a call.
    for (let i = 1; i <= 60; i++) {
      const d = new Date(); d.setDate(d.getDate() + i);
      const dm = d.toLocaleDateString(hi ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'short' });
      const wd = d.toLocaleDateString(hi ? 'hi-IN' : 'en-IN', { weekday: 'short' });
      const lead = i === 1 ? (hi ? 'कल' : 'Tomorrow') : wd;
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

  const tripNote = fare !== null ? `${tripLine} · ${VEHICLES[vehicle].name} · ${inr(fare)} · ${dayLabel}, ${slotLabel}` : '';
  /* Gateway off or failed AFTER the visitor already gave name + mobile (Aman, 2026-10-27: the
     WhatsApp gate asked for them a second time). Save the lead directly, open WhatsApp with the
     whole trip, and show "request received" — never "booked", because nothing was paid. */
  const requestWithoutPayment = () => {
    const fd = new FormData();
    Object.entries({
      name: name.trim(), phone: phone.trim(), service: 'transport', purpose: 'cab', channel: 'whatsapp',
      sourcePage: `booking:${source}`, locale, travelDate: date,
      message: `Booking request (no advance): ${tripNote}${pickupNote ? ` · Pickup: ${pickupNote}` : ''}`,
    }).forEach(([k, v]) => fd.append(k, v));
    fetch('/api/lead.php', { method: 'POST', body: fd, keepalive: true }).catch(() => { /* WhatsApp still opens */ });
    window.gtag?.('event', 'generate_lead', { form_id: 'cab_booking', route: routeId, vehicle });
    const text = hi
      ? `नमस्ते! मैं ${name.trim()} हूँ। मुझे ये कैब बुक करनी है: ${tripNote}${pickupNote ? ` · पिकअप: ${pickupNote}` : ''}`
      : `Hello! I am ${name.trim()}. I want to book this cab: ${tripNote}${pickupNote ? ` · Pickup: ${pickupNote}` : ''}`;
    const url = `${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win) window.location.href = url;
    setRequested(true);
    setStep(4);
  };

  const book = () => {
    if (!route || fare === null) return;
    window.gtag?.('event', 'fare_book_click', { route: routeId, vehicle, fare, source });
    setError('');
    setStep(3);
  };

  const pay = async () => {
    if (paying || !routeId || fare === null) return;
    const digits = phone.replace(/[^0-9]/g, '');
    if (name.trim().length < 2) { setError(hi ? 'अपना नाम लिखें' : 'Enter your name'); return; }
    if (digits.length < 10 || digits.length > 15) { setError(hi ? 'सही मोबाइल नंबर लिखें (विदेश से हों तो +देश कोड के साथ)' : 'Enter a valid mobile number (add the +country code if abroad)'); return; }
    setError('');
    setPaying(true);

    const fd = new FormData();
    Object.entries({ route: routeId, vehicle, name: name.trim(), phone: phone.trim(), date, time, trip: `${tripLine} · ${VEHICLES[vehicle].name}`, pickupNote, locale, source })
      .forEach(([k, v]) => fd.append(k, v));
    let order: { success?: boolean; fallback?: boolean; booking_id?: string; order_id?: string; key_id?: string; amount?: number } = {};
    try {
      const res = await fetch('/api/booking-order.php', { method: 'POST', body: fd });
      order = await res.json();
    } catch { order = { success: false, fallback: true }; }

    // Gateway not available → never lose the booking: hand it to WhatsApp with the trip filled in.
    if (!order.success || !order.order_id) {
      setPaying(false);
      if (order.fallback !== false) { requestWithoutPayment(); return; }
      setError(hi ? 'जानकारी जाँचें और दोबारा कोशिश करें' : 'Check the details and try again');
      return;
    }
    if (!(await loadRazorpay()) || !window.Razorpay) { setPaying(false); requestWithoutPayment(); return; }

    const rzp = new window.Razorpay({
      key: order.key_id,
      order_id: order.order_id,
      amount: order.amount,
      currency: 'INR',
      name: 'UjjainTemple.com',
      description: hi ? `कैब बुकिंग एडवांस · ${order.booking_id}` : `Cab booking advance · ${order.booking_id}`,
      prefill: { name: name.trim(), contact: phone.trim() },
      notes: { booking_id: order.booking_id },
      theme: { color: '#8B1A1A' },
      modal: { ondismiss: () => { setPaying(false); setError(hi ? 'पेमेंट पूरा नहीं हुआ — दोबारा कोशिश करें' : 'Payment not completed — please try again'); } },
      handler: async (r: RzpResponse) => {
        const v = new FormData();
        Object.entries(r).forEach(([k, val]) => v.append(k, val));
        try {
          const res = await fetch('/api/booking-verify.php', { method: 'POST', body: v });
          const out = await res.json();
          if (out.success) {
            window.gtag?.('event', 'purchase', { transaction_id: order.booking_id, value: ADVANCE, currency: 'INR', items: [{ item_name: `${routeId}:${vehicle}` }] });
            setBookingId(order.booking_id || '');
            setStep(4);
          } else {
            setError(hi ? `पेमेंट की पुष्टि नहीं हो सकी — बुकिंग ID ${order.booking_id} के साथ हमें कॉल करें` : `Could not confirm the payment — call us with booking ID ${order.booking_id}`);
          }
        } catch {
          setError(hi ? `पेमेंट हो गया हो तो बुकिंग ID ${order.booking_id} के साथ हमें कॉल करें` : `If you were charged, call us with booking ID ${order.booking_id}`);
        }
        setPaying(false);
      },
    });
    rzp.on('payment.failed', (e) => { setPaying(false); setError(e.error?.description || (hi ? 'पेमेंट फेल हुआ — दोबारा कोशिश करें' : 'Payment failed — please try again')); });
    rzp.open();
  };

  const box = 'flex items-center gap-2.5 rounded-xl border border-cream-dark bg-white px-3 focus-within:border-maroon focus-within:ring-1 focus-within:ring-maroon';
  const sel = 'w-full appearance-none bg-transparent py-2.5 text-[15px] font-semibold text-ink focus:outline-none';
  const cap = 'mb-1 block text-[11px] font-bold text-ink-mute';

  const trust = useMemo(() => ([
    { Icon: BadgeIndianRupee, t: hi ? `सिर्फ़ ₹${ADVANCE} एडवांस — बाकी ड्राइवर को` : `Only ₹${ADVANCE} advance — rest to the driver` },
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
          <span className="text-xs text-cream/80">{step < 4 ? (hi ? `चरण ${step}/3` : `Step ${step}/3`) : ''}</span>
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
            <p className="text-center text-xs text-ink-mute">
              {hi ? 'आज ही यात्रा है? ' : 'Travelling today? '}
              <a href={SITE.phoneTel} className="font-semibold text-maroon underline">{hi ? `कॉल करें ${SITE.phone}` : `Call ${SITE.phone}`}</a>
            </p>
          </div>
        ) : step === 2 ? (
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
        ) : step === 3 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 rounded-xl bg-cream-light/80 px-4 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-ink">{tripLine} · {VEHICLES[vehicle].name}</p>
                <p className="text-xs text-ink-mute">{dayLabel}, {slotLabel} · {hi ? 'कुल' : 'Total'} {fare !== null ? inr(fare) : ''}</p>
              </div>
              <button type="button" onClick={() => { setStep(2); setError(''); }} className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-maroon hover:underline">
                <ArrowLeft className="h-4 w-4" aria-hidden /> {hi ? 'बदलें' : 'Change'}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={cap} htmlFor={`${source}-name`}>{hi ? 'आपका नाम' : 'YOUR NAME'}</label>
                <div className={box}>
                  <User className="h-4 w-4 shrink-0 text-maroon" aria-hidden />
                  <input id={`${source}-name`} className={sel} autoComplete="name" value={name} maxLength={60}
                    onChange={(e) => { setName(e.target.value); setError(''); }} placeholder={hi ? 'जैसे राहुल शर्मा' : 'e.g. Rahul Sharma'} />
                </div>
              </div>
              <div>
                <label className={cap} htmlFor={`${source}-phone`}>{hi ? 'मोबाइल नंबर' : 'MOBILE NUMBER'}</label>
                <div className={box}>
                  <Phone className="h-4 w-4 shrink-0 text-maroon" aria-hidden />
                  <input id={`${source}-phone`} className={sel} type="tel" inputMode="tel" autoComplete="tel" value={phone} maxLength={18}
                    onChange={(e) => { setPhone(e.target.value.replace(/[^0-9+ ]/g, '')); setError(''); }} placeholder={hi ? '10 अंक, या +देश कोड' : '10 digits, or +country code'} />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className={cap} htmlFor={`${source}-note`}>{hi ? 'पिकअप की जगह (वैकल्पिक)' : 'PICKUP POINT (OPTIONAL)'}</label>
                <div className={box}>
                  <MapPin className="h-4 w-4 shrink-0 text-maroon" aria-hidden />
                  <input id={`${source}-note`} className={sel} value={pickupNote} maxLength={160}
                    onChange={(e) => setPickupNote(e.target.value)} placeholder={hi ? 'होटल का नाम, स्टेशन या फ़्लाइट नंबर' : 'Hotel name, station or flight number'} />
                </div>
              </div>
            </div>

            <button type="button" onClick={pay} disabled={paying}
              className="mx-auto flex w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-saffron py-3.5 text-lg font-bold text-white shadow-lg hover:brightness-95 active:scale-[0.99] disabled:opacity-70">
              {paying ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <Lock className="h-5 w-5" aria-hidden />}
              {hi ? `₹${ADVANCE} एडवांस देकर पक्का करें` : `Pay ₹${ADVANCE} advance to confirm`}
            </button>
            <p className="text-center text-xs text-ink-mute">
              {hi
                ? `बाकी ${fare !== null ? inr(fare - ADVANCE) : ''} ड्राइवर को नकद या UPI में · Razorpay से सुरक्षित भुगतान (UPI, कार्ड, नेटबैंकिंग)`
                : `Balance ${fare !== null ? inr(fare - ADVANCE) : ''} to the driver in cash or UPI · Secure payment by Razorpay (UPI, card, netbanking)`}
            </p>
            {error && <p className="text-center text-sm font-semibold text-red-700" role="alert">{error}</p>}
          </div>
        ) : requested ? (
          <div className="space-y-4 py-2 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-maroon" aria-hidden />
            <h3 className={`text-2xl font-bold text-maroon ${hi ? 'font-sanskrit' : 'font-serif'}`}>{hi ? 'बुकिंग की रिक्वेस्ट मिल गई' : 'Booking request received'}</h3>
            <p className="text-sm text-ink">{tripLine} · {VEHICLES[vehicle].name} · {fare !== null ? inr(fare) : ''} · {dayLabel}, {slotLabel}</p>
            <p className="text-sm text-ink-soft">
              {hi
                ? 'WhatsApp पर आपकी यात्रा की पूरी जानकारी के साथ चैट खुल गई है — मैसेज भेज दें। हमारी टीम कॉल करके बुकिंग पक्की करेगी।'
                : 'WhatsApp has opened with your trip details — send the message. Our team will call you to confirm the booking.'}
            </p>
            <a href={SITE.phoneTel}
              className="mx-auto flex w-full max-w-sm items-center justify-center gap-2 rounded-xl border-2 border-maroon py-3 font-bold text-maroon hover:bg-maroon/5">
              <Phone className="h-5 w-5" aria-hidden /> {hi ? `अभी कॉल करें ${SITE.phone}` : `Call now ${SITE.phone}`}
            </a>
          </div>
        ) : (
          <div className="space-y-4 py-2 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-maroon" aria-hidden />
            <h3 className={`text-2xl font-bold text-maroon ${hi ? 'font-sanskrit' : 'font-serif'}`}>{hi ? 'बुकिंग पक्की हो गई' : 'Your cab is booked'}</h3>
            <p className="text-sm text-ink-soft">{hi ? 'बुकिंग ID' : 'Booking ID'}: <b className="text-ink">{bookingId}</b></p>
            <p className="text-sm text-ink">{tripLine} · {VEHICLES[vehicle].name} · {dayLabel}, {slotLabel}</p>
            <p className="text-sm text-ink-soft">
              {hi
                ? `₹${ADVANCE} एडवांस मिल गया। बाकी ${fare !== null ? inr(fare - ADVANCE) : ''} ड्राइवर को नकद या UPI में। गाड़ी और ड्राइवर की जानकारी यात्रा से पहले WhatsApp पर भेजी जाएगी।`
                : `₹${ADVANCE} advance received. Balance ${fare !== null ? inr(fare - ADVANCE) : ''} to the driver in cash or UPI. Car and driver details will be sent on WhatsApp before your trip.`}
            </p>
            <a href={`${SITE.whatsapp}?text=${encodeURIComponent((hi ? 'नमस्ते, मेरी बुकिंग ID ' : 'Hello, my booking ID is ') + bookingId)}`}
              target="_blank" rel="noopener"
              className="mx-auto flex w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-maroon py-3 font-bold text-white hover:bg-maroon/90">
              <MessageCircle className="h-5 w-5" aria-hidden /> {hi ? 'WhatsApp पर बुकिंग ID भेजें' : 'Send booking ID on WhatsApp'}
            </a>
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
