import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowLeftRight, ArrowRight, BadgeIndianRupee, Building2, Calendar, Car, Check, CheckCircle2, Clock, Download, KeyRound, Loader2, Lock, MapPin, MessageCircle, Navigation, Phone, PhoneCall, ShieldCheck, User, Users, Wallet } from 'lucide-react';
import type { Locale } from '../../i18n';
import { SITE } from '../../lib/site';
import { CONTACT_EVT, readContact, saveContact } from '../../lib/cabContact';
import {
  CAB_ROUTES, PICKUPS, PLACES, TRIP_TYPES, VEHICLES, VEHICLE_ORDER,
  dropsFor, inr, routeFor, tripTypesFor,
  type PlaceId, type TripType, type VehicleId,
} from '../../data/rates';

/*
 * Ola / oneway.cab-style cab booking (Aman, 2026-10-27), in three short steps so none needs
 * scrolling: (1) trip type tiles → pickup → drop → date → time → "See fares";
 * (2) name + mobile, verified by SMS OTP (Aman, 2026-10-28: fares only after the number —
 * every fare look becomes a lead); (3) one fixed fare per car → pickup point → pay ₹500.
 * Fares come only from data/rates.ts; only priced combinations appear. A verified contact is
 * remembered for 30 days, so the next search goes straight to fares. /pricing/ stays public:
 * Razorpay reads it before approving the merchant account.
 * Trust lines say only what is true today.
 */

/**
 * Booking link with the trip filled in (2026-10-28): /cab-booking/?from=&to=&type=&date=&time=&v=.
 * The team sends it from the lead mail ("fare dekha, pay nahi kiya"); the widget reads it on load.
 */
const readPrefill = () => {
  if (typeof window === 'undefined') return null;
  const q = new URLSearchParams(window.location.search);
  const from = q.get('from') as PlaceId | null, to = q.get('to') as PlaceId | null, type = q.get('type') as TripType | null;
  if (!from || !to || !type || !(from in PLACES) || !(to in PLACES) || !['oneway', 'round', 'local'].includes(type)) return null;
  if (!routeFor(from, to, type)) return null;
  const v = q.get('v');
  return {
    from, to, type,
    date: /^\d{4}-\d{2}-\d{2}$/.test(q.get('date') || '') ? (q.get('date') as string) : '',
    time: /^([01]\d|2[0-3]):[0-5]\d$/.test(q.get('time') || '') ? (q.get('time') as string) : '',
    vehicle: v && v in VEHICLES ? (v as VehicleId) : null,
  };
};

type OtpReply = { success?: boolean; skip?: boolean; reason?: string; error?: string; wait?: number; left?: number };
const callOtp = async (fields: Record<string, string>): Promise<OtpReply | null> => {
  const fd = new FormData();
  Object.entries(fields).forEach(([k, v]) => fd.append(k, v));
  try {
    const res = await fetch('/api/otp.php', { method: 'POST', body: fd });
    return await res.json() as OtpReply;
  } catch { return null; }   // endpoint unreachable — the caller lets the visitor through unverified
};

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
  const [known, setKnown] = useState(false);            // contact already given (this visit or a recent one)
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [busy, setBusy] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    const load = () => {
      const c = readContact();
      if (c) { setName(c.name); setPhone(c.phone); setKnown(true); }
    };
    load();
    window.addEventListener(CONTACT_EVT, load);
    return () => window.removeEventListener(CONTACT_EVT, load);
  }, []);
  // A booking link from the lead mail fills the trip in (date only if it is still bookable).
  const [prefillDate, setPrefillDate] = useState('');
  useEffect(() => {
    const p = readPrefill();
    if (!p) return;
    setTab(tabOf(p)); setFrom(p.from); setTo(p.to);
    if (p.time) setTime(p.time);
    if (p.vehicle) setVehicle(p.vehicle);
    if (p.date) setPrefillDate(p.date);
    window.gtag?.('event', 'booking_link_open', { source });
  }, []);   // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (resendIn <= 0) return undefined;
    const t = window.setTimeout(() => setResendIn(resendIn - 1), 1000);
    return () => window.clearTimeout(t);
  }, [resendIn]);

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
  useEffect(() => {
    if (prefillDate && days.some((d) => d.iso === prefillDate)) { setDate(prefillDate); setPrefillDate(''); }
  }, [days, prefillDate]);

  const routeId = routeFor(from, to, type);
  const route = routeId ? CAB_ROUTES[routeId] : null;

  /* Date-wise fares set in /panel/rates.php (festival days etc.). The static rate card is the
     default; the server answers which fares differ on the chosen date. Until it answers, fares
     wait — never show one price and charge another. A failed call falls back to the card, and
     booking-order.php re-checks the fare anyway (409 fare_changed). */
  const [ov, setOv] = useState<{ date: string; fares: Record<string, Record<string, number>> } | null>(null);
  useEffect(() => {
    if (!date) return undefined;
    let live = true;
    fetch(`/api/fares.php?date=${date}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j: { overrides?: Record<string, Record<string, number>> }) => { if (live) setOv({ date, fares: j.overrides ?? {} }); })
      .catch(() => { if (live) setOv({ date, fares: {} }); });
    return () => { live = false; };
  }, [date]);
  const ovReady = ov?.date === date;
  const dayFares = (routeId && ovReady && ov?.fares[routeId]) || {};
  const fareOf = (v: VehicleId): number | null => dayFares[v] ?? (route ? route.fares[v] : null);
  const fare = fareOf(vehicle);
  const dateFare = Object.keys(dayFares).length > 0;

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
    ? `${PLACES[from][locale]} · ${TRIP_TYPES.local[locale]} · ${PLACES[to][locale]}`
    : `${PLACES[from][locale]} → ${PLACES[to][locale]} · ${TRIP_TYPES[type][locale]}`;

  const seeFares = () => {
    if (!date) { setError(hi ? 'यात्रा की तारीख़ चुनें' : 'Choose the travel date'); return; }
    if (!time) { setError(hi ? 'पिकअप का समय चुनें' : 'Choose the pickup time'); return; }
    setError('');
    setStep(known ? 3 : 2);
  };

  /* ── Step 2: name + mobile → OTP → fares ── */
  const phoneDigits = phone.replace(/[^0-9]/g, '');
  const checkContact = () => {
    if (name.trim().length < 2) { setError(hi ? 'अपना नाम लिखें' : 'Enter your name'); return false; }
    if (phoneDigits.length < 10 || phoneDigits.length > 15) { setError(hi ? 'सही मोबाइल नंबर लिखें (विदेश से हों तो +देश कोड के साथ)' : 'Enter a valid mobile number (add the +country code if abroad)'); return false; }
    return true;
  };
  /** The lead is saved the moment fares open — whether or not the visitor books. */
  const openFares = (verified: string) => {
    const fd = new FormData();
    Object.entries({
      name: name.trim(), phone: phone.trim(), service: 'transport', purpose: 'cab', channel: 'form',
      sourcePage: `booking:${source}`, locale, travelDate: date,
      message: `Cab fare enquiry: ${tripLine} · ${dayLabel}, ${slotLabel} · Mobile ${verified}`,
      // The mail builds a one-tap "send the booking link" from these (lead.php).
      bkFrom: from, bkTo: to, bkType: type, bkTime: time, bkTrip: tripLine,
      bkFares: VEHICLE_ORDER.map((v) => { const f = fareOf(v); return f !== null ? `${VEHICLES[v].name} ${inr(f)}` : ''; }).filter(Boolean).join(' · '),
    }).forEach(([k, v]) => fd.append(k, v));
    fetch('/api/lead.php', { method: 'POST', body: fd, keepalive: true }).catch(() => { /* fares still open */ });
    window.gtag?.('event', 'generate_lead', { form_id: 'cab_fare_gate', route: routeId, verified: verified.startsWith('OTP verified') });
    saveContact({ name: name.trim(), phone: phone.trim(), at: Date.now() });
    setKnown(true); setOtpSent(false); setOtp(''); setError('');
    setStep(3);
  };
  const otpError = (r: OtpReply) => {
    if (r.error === 'wait') return hi ? `${r.wait ?? 30} सेकंड बाद दोबारा भेजें` : `Try again in ${r.wait ?? 30} seconds`;
    if (r.error === 'limit') return hi ? `बहुत बार कोशिश हो गई — कॉल करें ${SITE.phone}` : `Too many attempts — call ${SITE.phone}`;
    if (r.error === 'expired') return hi ? 'OTP की समय-सीमा ख़त्म — नया OTP भेजें' : 'The OTP has expired — send a new one';
    if (r.error === 'tries') return hi ? 'ग़लत OTP कई बार — नया OTP भेजें' : 'Too many wrong tries — send a new OTP';
    if (r.error === 'wrong') return hi ? `OTP ग़लत है${r.left ? ` (${r.left} कोशिश बाकी)` : ''}` : `Wrong OTP${r.left ? ` (${r.left} tries left)` : ''}`;
    return hi ? 'जानकारी जाँचें और दोबारा कोशिश करें' : 'Check the details and try again';
  };
  const sendOtp = async () => {
    if (busy || !checkContact()) return;
    setError(''); setBusy(true);
    const r = await callOtp({ action: 'send', phone: phone.trim() });
    setBusy(false);
    if (!r) { openFares('not verified (OTP service unreachable)'); return; }
    if (r.success && r.skip) {
      openFares(r.reason === 'intl' ? 'not verified (number outside India)' : r.reason === 'sms_failed' ? 'not verified (SMS failed)' : 'not verified (OTP off)');
      return;
    }
    if (!r.success) { setError(otpError(r)); return; }
    setOtpSent(true); setOtp(''); setResendIn(30);
    window.gtag?.('event', 'otp_sent', { source });
  };
  const verifyOtp = async () => {
    if (busy) return;
    if (otp.length !== 4) { setError(hi ? '4 अंकों का OTP लिखें' : 'Enter the 4-digit OTP'); return; }
    setError(''); setBusy(true);
    const r = await callOtp({ action: 'verify', phone: phone.trim(), otp });
    setBusy(false);
    if (!r) { openFares('not verified (OTP service unreachable)'); return; }
    if (!r.success) { setError(otpError(r)); return; }
    openFares('OTP verified');
  };
  const forgetContact = () => {
    saveContact(null);
    setKnown(false); setOtpSent(false); setOtp(''); setError('');
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

  const pay = async () => {
    if (paying || !routeId || fare === null) return;
    if (!checkContact()) { setStep(2); return; }
    window.gtag?.('event', 'fare_book_click', { route: routeId, vehicle, fare, source });
    setError('');
    setPaying(true);

    const fd = new FormData();
    Object.entries({ route: routeId, vehicle, fare: String(fare), name: name.trim(), phone: phone.trim(), date, time, trip: `${tripLine} · ${VEHICLES[vehicle].name}`, pickupNote, locale, source, from, to, type })
      .forEach(([k, v]) => fd.append(k, v));
    let order: { success?: boolean; fallback?: boolean; error?: string; fare?: number; booking_id?: string; order_id?: string; key_id?: string; amount?: number } = {};
    try {
      const res = await fetch('/api/booking-order.php', { method: 'POST', body: fd });
      order = await res.json();
    } catch { order = { success: false, fallback: true }; }

    // Gateway not available → never lose the booking: hand it to WhatsApp with the trip filled in.
    if (!order.success || !order.order_id) {
      setPaying(false);
      if (order.error === 'fare_changed' && order.fare && routeId) {
        const newFare = order.fare;
        setOv((o) => ({ date, fares: { ...(o?.date === date ? o.fares : {}), [routeId]: { ...(o?.date === date ? o.fares[routeId] : {}), [vehicle]: newFare } } }));
        setError(hi ? `इस तारीख़ का किराया अब ${inr(newFare)} है — देखकर दोबारा बुक करें` : `The fare for this date is now ${inr(newFare)} — please review and book again`);
        return;
      }
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

  /* Receipt PDF — same browser-side method as the quote page (/q/): html2canvas + jsPDF from
     /vendor/, loaded only on click (no Chrome on Hostinger; PHP PDF libs break Devanagari). */
  const [receiptBusy, setReceiptBusy] = useState(false);
  const downloadReceipt = async () => {
    const el = document.getElementById(`${source}-receipt`);
    if (!el || receiptBusy) return;
    setReceiptBusy(true);
    const load = (src: string) => new Promise<void>((ok, no) => {
      const sc = document.createElement('script'); sc.src = src; sc.onload = () => ok(); sc.onerror = () => no(); document.head.appendChild(sc);
    });
    try {
      const w = window as unknown as { html2canvas?: (e: HTMLElement, o: object) => Promise<HTMLCanvasElement>; jspdf?: { jsPDF: new (o: object) => { addImage: (...a: unknown[]) => void; save: (n: string) => void } } };
      if (!w.html2canvas) await load('/vendor/html2canvas-1.4.1.min.js');
      if (!w.jspdf) await load('/vendor/jspdf-2.5.2.umd.min.js');
      if (document.fonts) await document.fonts.ready;
      const canvas = await w.html2canvas!(el, { scale: 2, backgroundColor: '#ffffff', logging: false });
      const pdf = new w.jspdf!.jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
      const W = 150, h = (canvas.height * W) / canvas.width;
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 30, 15, W, Math.min(h, 265));
      pdf.save(`UjjainTemple-${bookingId || 'booking'}.pdf`);
      window.gtag?.('event', 'receipt_download', { source });
    } catch { window.print(); }
    setReceiptBusy(false);
  };

  const box = 'flex items-center gap-2.5 rounded-xl border border-cream-dark bg-white px-3 focus-within:border-maroon focus-within:ring-1 focus-within:ring-maroon';
  const sel = 'w-full appearance-none bg-transparent py-2.5 text-[15px] font-semibold text-ink focus:outline-none';
  const cap = 'mb-1 block text-[11px] font-bold text-ink-mute';

  /* Why book with us (Aman, 2026-10-28). Only what is true today: "no extra charge" is NOT
     said flat — local packages bill extra km/hours, at the rate shown before booking. No
     "free" (cheap-words rule), no "verified drivers" until we actually verify them. */
  const why = useMemo(() => ([
    { Icon: BadgeIndianRupee, t: hi ? 'तय किराया, कोई छिपा चार्ज नहीं' : 'Fixed fare, no hidden charges',
      d: hi ? 'टोल, पार्किंग, ड्राइवर शामिल। ज़्यादा किमी/घंटे का रेट बुकिंग से पहले दिखता है।' : 'Toll, parking and driver included. Extra km/hours only at the rate shown before you book.' },
    { Icon: Wallet, t: hi ? `सिर्फ़ ₹${ADVANCE} में बुकिंग` : `Book with just ₹${ADVANCE}`,
      d: hi ? 'बाकी किराया ड्राइवर को नकद या UPI में।' : 'The rest goes to the driver in cash or UPI.' },
    { Icon: ShieldCheck, t: hi ? 'रद्द करने पर पूरा रिफ़ंड' : 'Full refund on cancellation',
      d: hi ? 'यात्रा से 48 घंटे पहले तक।' : 'Up to 48 hours before the trip.' },
    { Icon: Car, t: hi ? 'साफ़-सुथरी गाड़ी, अनुभवी ड्राइवर' : 'Clean cars, experienced drivers',
      d: hi ? 'Dzire, Ertiga और Innova — परिवार के हिसाब से।' : 'Dzire, Ertiga or Innova — sized to your group.' },
    { Icon: Building2, t: hi ? 'रजिस्टर्ड कंपनी' : 'A registered company',
      d: hi ? 'ByteFlow Technologies Pvt Ltd · DPIIT पंजीकृत स्टार्टअप' : 'ByteFlow Technologies Pvt Ltd · DPIIT-Registered Startup' },
    { Icon: PhoneCall, t: hi ? 'सीधे हमसे बात करें' : 'Talk to us directly',
      d: hi ? `यात्रा से पहले और दौरान — ${SITE.phone}` : `Before and during your trip — ${SITE.phone}` },
  ]), [hi]);

  const tripBar = (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-cream-light/80 px-4 py-2.5">
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-ink">{tripLine}</p>
        <p className="text-xs text-ink-mute">{dayLabel}, {slotLabel}</p>
      </div>
      <button type="button" onClick={() => { setStep(1); setError(''); }} className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-maroon hover:underline">
        <ArrowLeft className="h-4 w-4" aria-hidden /> {hi ? 'बदलें' : 'Change'}
      </button>
    </div>
  );

  return (
    <section data-cab-widget className="not-prose scroll-mt-24 overflow-hidden rounded-3xl border border-gold/40 bg-white shadow-2xl" aria-label={hi ? 'कैब बुकिंग' : 'Cab booking'}>
      {showTitle && (
        <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-maroon-800 to-maroon px-5 py-3 text-white">
          <h2 className={`text-lg font-bold sm:text-xl ${hi ? 'font-sanskrit !font-normal' : 'font-serif'}`}>
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
                  <label className={cap} htmlFor={`${source}-pkg`}>{hi ? 'पैकेज' : 'PACKAGE'}</label>
                  <div className={box}>
                    <Clock className="h-4 w-4 shrink-0 text-maroon" aria-hidden />
                    <select id={`${source}-pkg`} className={sel} value={to} onChange={(e) => setTo(e.target.value as PlaceId)}>
                      {dropsForTab(from, tab).map((p) => <option key={p} value={p}>{PLACES[p][locale]}</option>)}
                    </select>
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
            {tripBar}
            <p className="text-center text-sm text-ink-soft">
              {hi
                ? 'किराया देखने के लिए अपना नाम और मोबाइल नंबर दें — इसी नंबर पर बुकिंग की जानकारी भेजी जाएगी।'
                : 'Share your name and mobile number to see the fares — booking details are sent to this number.'}
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={cap} htmlFor={`${source}-name`}>{hi ? 'आपका नाम' : 'YOUR NAME'}</label>
                <div className={box}>
                  <User className="h-4 w-4 shrink-0 text-maroon" aria-hidden />
                  <input id={`${source}-name`} className={sel} autoComplete="name" value={name} maxLength={60} disabled={otpSent}
                    onChange={(e) => { setName(e.target.value); setError(''); }} placeholder={hi ? 'जैसे राहुल शर्मा' : 'e.g. Rahul Sharma'} />
                </div>
              </div>
              <div>
                <label className={cap} htmlFor={`${source}-phone`}>{hi ? 'मोबाइल नंबर' : 'MOBILE NUMBER'}</label>
                <div className={box}>
                  <Phone className="h-4 w-4 shrink-0 text-maroon" aria-hidden />
                  <input id={`${source}-phone`} className={sel} type="tel" inputMode="tel" autoComplete="tel" value={phone} maxLength={18} disabled={otpSent}
                    onChange={(e) => { setPhone(e.target.value.replace(/[^0-9+ ]/g, '')); setError(''); }} placeholder={hi ? '10 अंक, या +देश कोड' : '10 digits, or +country code'} />
                </div>
              </div>
            </div>

            {otpSent ? (
              <div className="mx-auto max-w-sm space-y-3">
                <div>
                  <label className={cap} htmlFor={`${source}-otp`}>
                    {hi ? `${phone.trim()} पर भेजा गया OTP` : `OTP SENT TO ${phone.trim()}`}
                  </label>
                  <div className={box}>
                    <KeyRound className="h-4 w-4 shrink-0 text-maroon" aria-hidden />
                    <input id={`${source}-otp`} className={`${sel} tracking-[0.4em]`} inputMode="numeric" autoComplete="one-time-code" value={otp} maxLength={4} autoFocus
                      onChange={(e) => { setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 4)); setError(''); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') verifyOtp(); }} placeholder="• • • •" />
                  </div>
                </div>
                <button type="button" onClick={verifyOtp} disabled={busy}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-saffron py-3.5 text-base font-bold text-white shadow-lg hover:brightness-95 active:scale-[0.99] disabled:opacity-70">
                  {busy ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <ShieldCheck className="h-5 w-5" aria-hidden />}
                  {hi ? 'OTP जाँचें और किराया देखें' : 'Verify & see fares'}
                </button>
                <div className="flex items-center justify-between text-xs">
                  <button type="button" onClick={() => { setOtpSent(false); setOtp(''); setError(''); }} className="font-semibold text-maroon hover:underline">
                    {hi ? 'नंबर बदलें' : 'Change number'}
                  </button>
                  {resendIn > 0
                    ? <span className="text-ink-mute">{hi ? `${resendIn} सेकंड में दोबारा भेजें` : `Resend in ${resendIn}s`}</span>
                    : <button type="button" onClick={sendOtp} disabled={busy} className="font-semibold text-maroon hover:underline">{hi ? 'OTP दोबारा भेजें' : 'Resend OTP'}</button>}
                </div>
              </div>
            ) : (
              <button type="button" onClick={sendOtp} disabled={busy}
                className={`mx-auto flex w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-saffron py-3.5 text-base font-extrabold text-white shadow-lg hover:brightness-95 active:scale-[0.99] disabled:opacity-70 ${hi ? '' : 'uppercase tracking-wide'}`}>
                {busy ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : null}
                {hi ? 'OTP भेजें' : 'Send OTP'} <ArrowRight className="h-5 w-5" aria-hidden />
              </button>
            )}
            {error && <p className="text-center text-sm font-semibold text-red-700" role="alert">{error}</p>}
            <p className="text-center text-xs text-ink-mute">
              {hi ? 'नंबर सिर्फ़ इस यात्रा के लिए — कोई प्रमोशनल कॉल या SMS नहीं।' : 'Your number is used only for this trip — no promotional calls or SMS.'}
            </p>
          </div>
        ) : step === 3 ? (
          <div className="space-y-4">
            {tripBar}

            {!ovReady && (
              <p className="flex items-center justify-center gap-2 py-6 text-sm text-ink-mute"><Loader2 className="h-4 w-4 animate-spin" aria-hidden />{hi ? 'इस तारीख़ का किराया देखा जा रहा है…' : 'Checking fares for this date…'}</p>
            )}
            {ovReady && dateFare && (
              <p className="rounded-lg bg-cream-light px-3 py-2 text-center text-xs font-semibold text-maroon">{hi ? 'इस तारीख़ के लिए विशेष किराया लागू है' : 'A special fare applies on this date'}</p>
            )}
            {/* Cars */}
            {route && ovReady && (
              <div role="radiogroup" aria-label={hi ? 'गाड़ी चुनें' : 'Choose your car'} className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
                {VEHICLE_ORDER.map((v) => {
                  const f = fareOf(v);
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
                  ? `पैकेज से ज़्यादा: ₹${route.extra[vehicle].km}/किमी · ₹${route.extra[vehicle].hour}/घंटा`
                  : `Beyond the package: ₹${route.extra[vehicle].km}/km · ₹${route.extra[vehicle].hour}/hour`}
              </p>
            )}

            {!ovReady ? null : fare !== null ? (
              <>
                <div className="mx-auto max-w-xl">
                  <label className={cap} htmlFor={`${source}-note`}>{hi ? 'पिकअप की जगह (वैकल्पिक)' : 'PICKUP POINT (OPTIONAL)'}</label>
                  <div className={box}>
                    <MapPin className="h-4 w-4 shrink-0 text-maroon" aria-hidden />
                    <input id={`${source}-note`} className={sel} value={pickupNote} maxLength={160}
                      onChange={(e) => setPickupNote(e.target.value)} placeholder={hi ? 'होटल का नाम, स्टेशन या फ़्लाइट नंबर' : 'Hotel name, station or flight number'} />
                  </div>
                </div>
                <button type="button" onClick={pay} disabled={paying}
                  className="mx-auto flex w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-saffron py-3.5 text-lg font-bold text-white shadow-lg hover:brightness-95 active:scale-[0.99] disabled:opacity-70">
                  {paying ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <Lock className="h-5 w-5" aria-hidden />}
                  {hi ? `₹${ADVANCE} देकर ${VEHICLES[vehicle].name} पक्की करें` : `Pay ₹${ADVANCE} · book ${VEHICLES[vehicle].name}`}
                </button>
                <p className="text-center text-xs text-ink-mute">
                  {hi
                    ? `बाकी ${inr(fare - ADVANCE)} ड्राइवर को नकद या UPI में · Razorpay से सुरक्षित भुगतान (UPI, कार्ड, नेटबैंकिंग)`
                    : `Balance ${inr(fare - ADVANCE)} to the driver in cash or UPI · Secure payment by Razorpay (UPI, card, netbanking)`}
                </p>
              </>
            ) : (
              <a href={SITE.phoneTel} className="mx-auto flex w-full max-w-sm items-center justify-center gap-2 rounded-xl border-2 border-maroon py-3.5 text-lg font-bold text-maroon hover:bg-maroon/5">
                <Phone className="h-5 w-5" aria-hidden /> {hi ? 'कॉल करें' : 'Call'}
              </a>
            )}
            {error && <p className="text-center text-sm font-semibold text-red-700" role="alert">{error}</p>}
            <p className="text-center text-xs text-ink-mute">
              {hi ? `${name.trim()} · ${phone.trim()} के नाम से — ` : `Booking as ${name.trim()} · ${phone.trim()} — `}
              <button type="button" onClick={forgetContact} className="font-semibold text-maroon hover:underline">{hi ? 'बदलें' : 'change'}</button>
            </p>
          </div>
        ) : requested ? (
          <div className="space-y-4 py-2 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-maroon" aria-hidden />
            <h3 className={`text-2xl font-bold text-maroon ${hi ? 'font-sanskrit !font-normal' : 'font-serif'}`}>{hi ? 'बुकिंग की रिक्वेस्ट मिल गई' : 'Booking request received'}</h3>
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
          <div className="space-y-4 py-1">
            {/* Receipt (2026-10-28): the customer should leave with a booking they can show, not a
                one-line "booked". Same card becomes the PDF. */}
            <div id={`${source}-receipt`} className="overflow-hidden rounded-2xl border border-gold/50 bg-white text-left">
              <div className="flex items-center justify-between gap-3 bg-maroon px-4 py-3 text-white">
                <div className="flex items-center gap-2">
                  <img src="/favicon-192.png" alt="" width={34} height={34} className="h-8 w-8 rounded-full bg-white p-0.5" />
                  <div>
                    <p className="font-serif text-lg font-bold leading-none">UjjainTemple.com</p>
                    <p className="mt-0.5 text-[11px] text-cream/80">{SITE.phone}</p>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-white">✓ {hi ? 'बुकिंग पक्की' : 'CONFIRMED'}</span>{/* plain text: html2canvas drops text inside a padded pill */}
              </div>
              <div className="space-y-3 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-8 w-8 shrink-0 text-maroon" aria-hidden />
                  <div>
                    <h3 className={`text-xl font-bold text-maroon ${hi ? 'font-sanskrit !font-normal' : 'font-serif'}`}>{hi ? 'आपकी कैब बुक हो गई' : 'Your cab is booked'}</h3>
                    <p className="text-sm text-ink-soft">{hi ? 'बुकिंग ID' : 'Booking ID'}: <b className="text-ink">{bookingId}</b></p>
                  </div>
                </div>
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 rounded-xl bg-cream-light/70 p-3 text-sm">
                  <dt className="text-ink-mute">{hi ? 'यात्रा' : 'Trip'}</dt><dd className="font-semibold text-ink">{tripLine}</dd>
                  <dt className="text-ink-mute">{hi ? 'तारीख़ व समय' : 'Date & time'}</dt><dd className="font-semibold text-ink">{dayLabel}, {slotLabel}</dd>
                  <dt className="text-ink-mute">{hi ? 'गाड़ी' : 'Car'}</dt><dd className="font-semibold text-ink">{VEHICLES[vehicle].name}</dd>
                  {pickupNote.trim() && (<><dt className="text-ink-mute">{hi ? 'पिकअप' : 'Pickup'}</dt><dd className="font-semibold text-ink">{pickupNote.trim()}</dd></>)}
                  <dt className="text-ink-mute">{hi ? 'यात्री' : 'Name'}</dt><dd className="font-semibold text-ink">{name.trim()} · {phone.trim()}</dd>
                </dl>
                <div className="divide-y divide-cream-dark rounded-xl border border-cream-dark text-sm">
                  <div className="flex justify-between px-3 py-2"><span>{hi ? 'कुल किराया' : 'Total fare'}</span><b>{fare !== null ? inr(fare) : ''}</b></div>
                  <div className="flex justify-between bg-maroon/5 px-3 py-2 font-bold text-maroon"><span>{hi ? 'एडवांस मिला' : 'Advance paid'}</span><span>{inr(ADVANCE)} ✓</span></div>
                  <div className="flex justify-between px-3 py-2"><span>{hi ? 'बाकी — ड्राइवर को नकद या UPI' : 'Balance — to the driver, cash or UPI'}</span><b>{fare !== null ? inr(fare - ADVANCE) : ''}</b></div>
                </div>
                <div>
                  <p className="mb-1 text-xs font-bold text-ink-mute">{hi ? 'आगे क्या होगा' : 'What happens next'}</p>
                  <ol className="space-y-1 text-sm text-ink-soft">
                    <li>1. {hi ? 'यात्रा से पहले गाड़ी का नंबर और ड्राइवर का नाम-मोबाइल WhatsApp पर आएगा।' : 'Before the trip, the car number and the driver’s name and mobile come on WhatsApp.'}</li>
                    <li>2. {hi ? 'तय समय पर ड्राइवर पिकअप पर होगा — बाकी किराया उन्हें दें।' : 'The driver reaches the pickup on time — pay the balance to the driver.'}</li>
                    <li>3. {hi ? 'यात्रा से 48 घंटे पहले तक रद्द करने पर पूरा एडवांस वापस।' : 'Cancel up to 48 hours before the trip for a full refund of the advance.'}</li>
                  </ol>
                </div>
                <p className="text-[11px] text-ink-mute">UjjainTemple.com · ByteFlow Technologies Pvt Ltd · {hi ? 'कॉल / WhatsApp' : 'Call / WhatsApp'} {SITE.phone}</p>
              </div>
            </div>
            <button type="button" onClick={downloadReceipt} disabled={receiptBusy}
              className="mx-auto flex w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-maroon py-3 font-bold text-white hover:bg-maroon/90 disabled:opacity-70">
              <Download className="h-5 w-5" aria-hidden /> {receiptBusy ? (hi ? 'रसीद बन रही है…' : 'Preparing…') : (hi ? 'रसीद PDF डाउनलोड करें' : 'Download receipt (PDF)')}
            </button>
            <a href={`${SITE.whatsapp}?text=${encodeURIComponent((hi ? 'नमस्ते, मेरी बुकिंग ID ' : 'Hello, my booking ID is ') + bookingId)}`}
              target="_blank" rel="noopener"
              className="mx-auto flex w-full max-w-sm items-center justify-center gap-2 rounded-xl border-2 border-maroon py-3 font-bold text-maroon hover:bg-maroon/5">
              <MessageCircle className="h-5 w-5" aria-hidden /> {hi ? 'WhatsApp पर बुकिंग ID भेजें' : 'Send booking ID on WhatsApp'}
            </a>
          </div>
        )}

      </div>

      {/* Why book with us */}
      <div className="border-t border-gold/30 bg-cream-light/60 px-4 py-5 sm:px-6">
        <h3 className={`mb-4 text-center text-base font-bold text-maroon sm:text-lg ${hi ? 'font-sanskrit !font-normal' : 'font-serif'}`}>
          {hi ? 'हमसे ही क्यों बुक करें' : 'Why book with us'}
        </h3>
        <ul className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {why.map(({ Icon, t, d }) => (
            <li key={t} className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-maroon ring-1 ring-gold/40">
                <Icon className="h-4.5 w-4.5" aria-hidden />
              </span>
              <span>
                <span className="block text-sm font-bold text-ink">{t}</span>
                <span className="block text-xs leading-relaxed text-ink-soft">{d}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-center text-xs text-ink-soft">
          <a className="underline" href={hi ? '/hi/cancellation-refund-policy/' : '/cancellation-refund-policy/'}>{hi ? 'रिफ़ंड नीति' : 'Refund policy'}</a>
        </p>
      </div>
    </section>
  );
}
