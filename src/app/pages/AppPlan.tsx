import { useEffect, useState, type FormEvent } from 'react';
import { Car, Hotel, MapPinned, MessageCircle, Phone, Send } from 'lucide-react';
import { useI18n } from '../../i18n';
import { SITE } from '../../lib/site';
import { AppShell } from '../AppShell';
import { istToday } from '../lib';

type Service = 'transport' | 'hotel' | 'tour';

const SERVICES: { id: Service; hi: string; en: string; Icon: typeof Car }[] = [
  { id: 'transport', hi: 'कैब / टैक्सी', en: 'Cab / taxi', Icon: Car },
  { id: 'hotel', hi: 'होटल', en: 'Hotel', Icon: Hotel },
  { id: 'tour', hi: 'टूर पैकेज', en: 'Tour package', Icon: MapPinned },
];

type Errors = Partial<Record<'name' | 'phone' | 'date' | 'people' | 'from', string>>;

export function AppPlan() {
  const { locale } = useI18n();
  const hi = locale === 'hi';
  const [today, setToday] = useState('');
  const [service, setService] = useState<Service>('transport');
  const [form, setForm] = useState({ name: '', phone: '', date: '', people: '2', from: '', note: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  useEffect(() => setToday(istToday()), []);

  const set = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const serviceLabel = SERVICES.find((s) => s.id === service)!;

  const summary = () =>
    [
      `${hi ? 'सेवा' : 'Service'}: ${hi ? serviceLabel.hi : serviceLabel.en}`,
      form.date && `${hi ? 'यात्रा तिथि' : 'Travel date'}: ${form.date}`,
      `${hi ? 'यात्री' : 'Travellers'}: ${form.people}`,
      form.from && `${hi ? 'कहाँ से' : 'From'}: ${form.from}`,
      form.note && `${hi ? 'विवरण' : 'Notes'}: ${form.note}`,
    ].filter(Boolean).join(' | ');

  const validate = (): Errors => {
    const e: Errors = {};
    if (form.name.trim().length < 2) e.name = hi ? 'कृपया नाम लिखें' : 'Please enter your name';
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = hi ? '10 अंकों का सही मोबाइल नंबर लिखें' : 'Enter a valid 10-digit mobile number';
    if (form.date && today && form.date < today) e.date = hi ? 'आज या आगे की तिथि चुनें' : 'Choose today or a later date';
    const p = Number(form.people);
    if (!Number.isInteger(p) || p < 1 || p > 50) e.people = hi ? '1 से 50 के बीच' : 'Between 1 and 50';
    if (form.from && !/^[\p{L}\s.,-]{2,40}$/u.test(form.from.trim())) e.from = hi ? 'शहर का नाम ठीक से लिखें' : 'Enter a city name';
    return e;
  };

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setStatus('sending');
    const data = new FormData();
    data.append('name', form.name.trim());
    data.append('phone', form.phone);
    data.append('service', service);
    data.append('message', `[App] ${summary()}`);
    data.append('sourcePage', `${hi ? '/hi' : ''}/app/plan/`);
    data.append('locale', locale);
    try {
      const res = await fetch('/api/lead.php', { method: 'POST', body: data });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  const whatsappHref = `${SITE.whatsapp}?text=${encodeURIComponent(
    `${hi ? 'नमस्ते, उज्जैन यात्रा के लिए सहायता चाहिए।' : 'Hello, I need help planning an Ujjain trip.'} ${summary()}`,
  )}`;

  const field = 'w-full rounded-xl border bg-white px-3 py-3 text-sm focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon';
  const err = (k: keyof Errors) => errors[k] && <p className="mt-1 text-xs font-semibold text-maroon" role="alert">{errors[k]}</p>;
  const border = (k: keyof Errors) => (errors[k] ? 'border-maroon' : 'border-cream-dark');

  return (
    <AppShell tab="plan/" title={hi ? 'यात्रा योजना' : 'Plan a trip'}>
      <h1 className="font-serif text-2xl font-bold text-maroon">{hi ? 'उज्जैन यात्रा योजना' : 'Plan your Ujjain trip'}</h1>
      <p className="mt-1 text-sm text-ink-soft">
        {hi ? 'कैब, होटल या टूर — विवरण भेजें, हमारी टीम कॉल करके विकल्प बताएगी।' : 'Cab, hotel or tour — send the details and our team will call you with options.'}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <a href={SITE.phoneTel} className="btn-call justify-center text-sm"><Phone className="h-4 w-4" aria-hidden /> {hi ? 'कॉल करें' : 'Call'}</a>
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#25D366] px-5 py-3 text-sm font-bold text-white shadow-md">
          <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
        </a>
      </div>

      {status === 'done' ? (
        <div className="mt-6 rounded-2xl border border-gold/40 bg-white p-5 text-center">
          <p className="font-serif text-xl font-bold text-maroon">{hi ? 'धन्यवाद, विवरण मिल गया' : 'Thank you — we have your details'}</p>
          <p className="mt-2 text-sm text-ink-soft">
            {hi ? `हमारी टीम ${form.phone} पर संपर्क करेगी। जल्दी हो तो WhatsApp पर भी लिख सकते हैं।` : `Our team will call ${form.phone}. In a hurry? Message us on WhatsApp too.`}
          </p>
          <button type="button" onClick={() => { setStatus('idle'); setForm((f) => ({ ...f, note: '' })); }}
            className="mt-4 text-sm font-semibold text-maroon underline">
            {hi ? 'नया अनुरोध' : 'New request'}
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-ink">{hi ? 'क्या चाहिए?' : 'What do you need?'}</legend>
            <div className="grid grid-cols-3 gap-2">
              {SERVICES.map((s) => (
                <button key={s.id} type="button" onClick={() => setService(s.id)} aria-pressed={service === s.id}
                  className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-xs font-semibold ${
                    service === s.id ? 'border-maroon bg-maroon text-white' : 'border-cream-dark bg-white text-maroon'
                  }`}>
                  <s.Icon className="h-5 w-5" aria-hidden />
                  {hi ? s.hi : s.en}
                </button>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="p-name" className="mb-1 block text-sm font-semibold text-ink">{hi ? 'नाम' : 'Name'} *</label>
            <input id="p-name" autoComplete="name" value={form.name} maxLength={60}
              onChange={(e) => set('name', e.target.value.replace(/[0-9]/g, ''))}
              className={`${field} ${border('name')}`} aria-invalid={!!errors.name} />
            {err('name')}
          </div>

          <div>
            <label htmlFor="p-phone" className="mb-1 block text-sm font-semibold text-ink">{hi ? 'मोबाइल नंबर' : 'Mobile number'} *</label>
            <input id="p-phone" type="tel" inputMode="numeric" autoComplete="tel-national" value={form.phone} maxLength={10}
              onChange={(e) => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="10 digit" className={`${field} ${border('phone')}`} aria-invalid={!!errors.phone} />
            {err('phone')}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="p-date" className="mb-1 block text-sm font-semibold text-ink">{hi ? 'यात्रा तिथि' : 'Travel date'}</label>
              <input id="p-date" type="date" min={today || undefined} value={form.date}
                onChange={(e) => set('date', e.target.value)} className={`${field} ${border('date')}`} aria-invalid={!!errors.date} />
              {err('date')}
            </div>
            <div>
              <label htmlFor="p-people" className="mb-1 block text-sm font-semibold text-ink">{hi ? 'कितने लोग' : 'Travellers'}</label>
              <input id="p-people" type="number" inputMode="numeric" min={1} max={50} value={form.people}
                onChange={(e) => set('people', e.target.value.replace(/\D/g, '').slice(0, 2))}
                className={`${field} ${border('people')}`} aria-invalid={!!errors.people} />
              {err('people')}
            </div>
          </div>

          <div>
            <label htmlFor="p-from" className="mb-1 block text-sm font-semibold text-ink">{hi ? 'कहाँ से आ रहे हैं' : 'Travelling from'}</label>
            <input id="p-from" autoComplete="address-level2" value={form.from} maxLength={40}
              onChange={(e) => set('from', e.target.value)} placeholder={hi ? 'जैसे इंदौर, भोपाल' : 'e.g. Indore, Bhopal'}
              className={`${field} ${border('from')}`} aria-invalid={!!errors.from} />
            {err('from')}
          </div>

          <div>
            <label htmlFor="p-note" className="mb-1 block text-sm font-semibold text-ink">{hi ? 'और कुछ' : 'Anything else'}</label>
            <textarea id="p-note" rows={3} maxLength={300} value={form.note} onChange={(e) => set('note', e.target.value)}
              placeholder={hi ? 'जैसे कितने दिन, कौन से मंदिर' : 'e.g. number of days, which temples'}
              className={`${field} border-cream-dark`} />
          </div>

          <button type="submit" disabled={status === 'sending'} className="btn-call w-full">
            <Send className="h-4 w-4" aria-hidden />
            {status === 'sending' ? (hi ? 'भेज रहे हैं…' : 'Sending…') : hi ? 'विवरण भेजें' : 'Send details'}
          </button>
          {status === 'error' && (
            <p className="text-center text-sm font-semibold text-maroon" role="alert">
              {hi ? 'अभी नहीं भेज पाए। कृपया कॉल या WhatsApp करें।' : 'Could not send just now. Please call or WhatsApp us.'}
            </p>
          )}
        </form>
      )}

      <p className="mt-6 rounded-lg bg-white/70 p-3 text-xs leading-relaxed text-ink-mute">
        {hi
          ? 'हम दर्शन, भस्म आरती या शीघ्र दर्शन की बुकिंग नहीं करते — वह व्यवस्था मंदिर समिति के अधीन है। आपका नंबर सिर्फ़ इस अनुरोध के लिए उपयोग होता है।'
          : 'We do not book darshan, Bhasma Aarti or fast-track darshan — those are managed by the temple committees. Your number is used only for this request.'}
      </p>
    </AppShell>
  );
}
