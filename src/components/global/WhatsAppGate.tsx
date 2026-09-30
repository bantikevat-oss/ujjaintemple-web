import { useEffect, useRef, useState, FormEvent } from 'react';
import { X, MessageCircle, Phone } from 'lucide-react';
import { useI18n } from '../../i18n';
import { SITE } from '../../lib/site';

/**
 * WhatsApp capture gate (Aman, 2026-09-30 — option A).
 *
 * WhatsApp was 65 of 124 lead events in 17 days (52%) but the enquiries arrive with no
 * name and no number, so they could not be called back. Sending people straight to a
 * dialer instead would have thrown away that half of the funnel. So the tap now opens a
 * three-field gate first: we capture name + phone + intent, mail it to Aman, and THEN
 * open WhatsApp with the message pre-filled. The channel survives, the lead is callable.
 *
 * `purpose` is the raw-lead filter. Mandir pages generate call/WhatsApp taps from people
 * who want the TEMPLE's number, not ours (shankaracharya-math alone was 6 in 17 days);
 * making them pick a purpose sorts those out before they reach the phone, and the value
 * rides along into the mail subject so a group enquiry is obvious at a glance.
 *
 * Mounted once in Layout. Any CTA anywhere opens it via openWhatsAppGate().
 */

export interface GateOpts {
  service?: string;
  sourcePage?: string;
}

const EVT = 'ujt:whatsapp-gate';

export function openWhatsAppGate(opts: GateOpts = {}) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<GateOpts>(EVT, { detail: opts }));
}

const PURPOSES = [
  { value: 'cab',      hi: 'कैब / टैक्सी बुकिंग',           en: 'Cab / taxi booking' },
  { value: 'tour',     hi: 'दर्शन या टूर पैकेज',            en: 'Darshan or tour package' },
  { value: 'group',    hi: 'समूह यात्रा (10+ लोग)',         en: 'Group yatra (10+ people)' },
  { value: 'hotel',    hi: 'होटल / ठहरने की व्यवस्था',      en: 'Hotel / stay' },
  { value: 'puja',     hi: 'पूजा सम्बन्धी जानकारी',         en: 'Puja enquiry' },
  { value: 'info',     hi: 'केवल जानकारी चाहिए',            en: 'Only need information' },
];

export function WhatsAppGateHost() {
  const { locale } = useI18n();
  const isHi = locale === 'hi';
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<GateOpts>({});
  const [sending, setSending] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onOpen = (e: Event) => {
      setOpts((e as CustomEvent<GateOpts>).detail || {});
      setOpen(true);
    };
    window.addEventListener(EVT, onOpen);
    return () => window.removeEventListener(EVT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => nameRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  /*
   * Always hand the visitor over to WhatsApp, even if our own capture fails — a broken
   * mail server must never cost us the conversation.
   *
   * 🔴 This MUST be called synchronously from the submit handler, never after an `await`.
   * window.open() is only permitted while the user activation from the tap is still live
   * (Chrome gives a few seconds of transient activation; Safari is stricter and wants the
   * same call stack). Awaiting the capture POST first meant that on a slow mobile network
   * the popup was blocked and the visitor got nothing — silently, on the path that carries
   * ~52% of this site's leads. If the popup is blocked anyway, fall back to navigating.
   */
  function handover(name: string, purpose: string) {
    const label = PURPOSES.find((p) => p.value === purpose);
    const intent = label ? (isHi ? label.hi : label.en) : '';
    const text = isHi
      ? `नमस्ते! मैं ${name} हूँ। मुझे ${intent} के बारे में जानकारी चाहिए।`
      : `Hello! I am ${name}. I need information about: ${intent}.`;
    const url = `${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win) window.location.href = url;   // popup blocked → navigate instead
    setOpen(false);
    setSending(false);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const purpose = String(data.get('purpose') || '');

    data.append('sourcePage', opts.sourcePage || (typeof window !== 'undefined' ? window.location.pathname : ''));
    data.append('locale', locale);
    data.append('channel', 'whatsapp');
    if (opts.service) data.append('service', opts.service);

    window.gtag?.('event', 'whatsapp_gate_submit', { purpose });

    // Fire-and-forget: `keepalive` lets this request outlive the navigation, so the lead
    // is still captured while the visitor goes straight to WhatsApp. Awaiting it here is
    // what broke the popup (see handover above).
    fetch('/api/lead.php', { method: 'POST', body: data, keepalive: true }).catch(() => {
      /* capture is best-effort — the handover still happens */
    });

    form.reset();
    handover(name, purpose);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/60 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wag-title"
      onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
    >
      <div className="w-full max-w-md rounded-t-2xl border-2 border-gold bg-white p-5 shadow-xl sm:rounded-2xl">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 id="wag-title" className="font-serif text-xl font-bold text-maroon">
              {isHi ? 'व्हाट्सएप पर बात करें' : 'Talk to us on WhatsApp'}
            </h3>
            <p className="mt-1 text-sm text-ink-soft">
              {isHi
                ? 'नाम और नंबर बता दें — यदि चैट छूट जाए तो हम स्वयं कॉल कर लेंगे।'
                : 'Leave your name and number — if the chat drops, we will call you back.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={isHi ? 'बंद करें' : 'Close'}
            className="rounded-md p-1 text-ink-soft transition-colors hover:bg-cream hover:text-maroon"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          {/* Honeypot — matches the `website` check in api/lead.php. Off-screen rather than
              display:none, which some bots skip; tabIndex/autoComplete keep humans out of it. */}
          <input
            type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
          />
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-soft" htmlFor="wag-name">
              {isHi ? 'नाम' : 'Name'} *
            </label>
            <input
              ref={nameRef} id="wag-name" name="name" required type="text" autoComplete="name"
              onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[0-9]/g, ''); }}
              className="w-full rounded-md border border-cream-dark px-3 py-2 focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-soft" htmlFor="wag-phone">
              {isHi ? 'मोबाइल नंबर' : 'Mobile number'} *
            </label>
            <input
              id="wag-phone" name="phone" required type="tel" inputMode="numeric" autoComplete="tel"
              pattern="[0-9+\- ]{10,15}" maxLength={15}
              className="w-full rounded-md border border-cream-dark px-3 py-2 focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-soft" htmlFor="wag-purpose">
              {isHi ? 'किस लिए?' : 'What for?'} *
            </label>
            <select
              id="wag-purpose" name="purpose" required defaultValue=""
              className="w-full rounded-md border border-cream-dark bg-white px-3 py-2 focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon"
            >
              <option value="" disabled>{isHi ? 'चुनें' : 'Select'}</option>
              {PURPOSES.map((p) => (
                <option key={p.value} value={p.value}>{isHi ? p.hi : p.en}</option>
              ))}
            </select>
          </div>

          {/* Optional on purpose. This is the highest-volume lead path (~52% of lead
              events); making the date required would buy better leads by losing leads.
              Whoever fills it gets called first — lead.php puts "in N days" in the mail. */}
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-soft" htmlFor="wag-date">
              {isHi ? 'यात्रा की तारीख' : 'Travel date'}{' '}
              <span className="font-normal text-ink-mute">({isHi ? 'वैकल्पिक' : 'optional'})</span>
            </label>
            <input
              id="wag-date" name="travelDate" type="date"
              className="w-full rounded-md border border-cream-dark bg-white px-3 py-2 focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon"
            />
          </div>

          <button
            type="submit" disabled={sending}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-maroon py-3 text-base font-bold text-cream shadow-md transition-transform active:scale-95 disabled:opacity-70"
          >
            <MessageCircle className="h-5 w-5" />
            {sending
              ? (isHi ? 'खोल रहे हैं…' : 'Opening…')
              : (isHi ? 'व्हाट्सएप खोलें' : 'Open WhatsApp')}
          </button>
        </form>

        <a href={SITE.phoneTel} className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-maroon hover:text-saffron">
          <Phone className="h-4 w-4" />
          {isHi ? 'या सीधे कॉल करें' : 'Or call directly'} — {SITE.phone}
        </a>
      </div>
    </div>
  );
}
