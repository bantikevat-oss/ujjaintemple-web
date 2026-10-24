import { useState, FormEvent } from 'react';
import { Phone, Send } from 'lucide-react';
import { useI18n } from '../../i18n';
import { SITE } from '../../lib/site';
import { TripShapeFields } from './TripShapeFields';

interface Props {
  defaultService?: 'darshanPlan' | 'hotel' | 'transport' | 'tour' | 'group' | 'simhastha' | 'cab';
  variant?: 'card' | 'inline';
  sourcePage?: string;
}

export function LeadForm({ defaultService = 'hotel', variant = 'card', sourcePage = '' }: Props) {
  const { t, locale } = useI18n();
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const data = new FormData(e.currentTarget);
    data.append('sourcePage', sourcePage);
    data.append('locale', locale);
    try {
      const res = await fetch('/api/lead.php', { method: 'POST', body: data });
      if (!res.ok) throw new Error('submit failed');
      setStatus('success');
      (e.target as HTMLFormElement).reset();
      // Form submits were invisible to GA4 until 2026-10-16 (only tel:/wa.me clicks counted).
      window.gtag?.('event', 'generate_lead', {
        form_id: 'lead_form',
        trip_shape: String(data.get('tripShape') || 'none'),
        group_size: String(data.get('travellers') || 'unknown'),
      });
    } catch {
      setStatus('error');
    }
  }

  const wrapperCls = variant === 'card'
    ? 'rounded-xl border-2 border-gold bg-white p-5 sm:p-6 shadow-md'
    : 'bg-cream-dark/40 rounded-lg p-4';

  return (
    <div className={wrapperCls}>
      <div className="mb-4">
        <h3 className="font-serif text-xl font-bold text-maroon sm:text-2xl">
          {locale === 'hi' ? 'उज्जैन यात्रा सहायता' : 'Ujjain Trip Assistance'}
        </h3>
        <p className="mt-1 text-sm text-ink-soft">
          {locale === 'hi' ? 'होटल, कैब, टूर — फ़ॉर्म भरें अथवा सीधे सम्पर्क करें' : 'Hotel, cab, tour — fill the form or call us directly'}
        </p>
        <a href={SITE.phoneTel} className="mt-3 inline-flex items-center gap-2 font-bold text-maroon hover:text-saffron-700">
          <Phone className="h-4 w-4" /> {SITE.phone}
        </a>
      </div>

      {status === 'success' ? (
        <div className="rounded-md bg-cream p-4 text-center text-maroon font-semibold">
          {t('form.success')}
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3">
          {/* Honeypot — matches the `website` check in api/lead.php. */}
          <input
            type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
          />
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1" htmlFor="lf-name">{t('form.name')} *</label>
            <input id="lf-name" name="name" required type="text" autoComplete="name"
              onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[0-9]/g, ''); }}
              className="w-full rounded-md border border-cream-dark px-3 py-2 focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon"
              placeholder={locale === 'hi' ? 'आपका नाम' : 'Your name'} />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1" htmlFor="lf-phone">{t('form.phone')} *</label>
            {/* A visitor abroad types +1 / +44 / +971 — until 2026-10-24 this field kept digits only and
                cut at 10, so a foreign number could not be entered at all. lead.php accepts the same shape. */}
            <input id="lf-phone" name="phone" required type="tel" autoComplete="tel" inputMode="tel"
              pattern="(\+[0-9][0-9 \-]{8,16})|([0-9]{10})" maxLength={18}
              onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9+\- ]/g, '').slice(0, 18); }}
              className="w-full rounded-md border border-cream-dark px-3 py-2 focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon"
              placeholder={locale === 'hi' ? '10 अंकों का मोबाइल नंबर' : '10-digit mobile, or +country code'} />
            <p className="mt-1 text-[11px] text-ink-mute">
              {locale === 'hi' ? 'विदेश से? नंबर +देश कोड के साथ लिखें (जैसे +1, +44, +971)।' : 'Outside India? Add your country code (e.g. +1, +44, +971).'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1" htmlFor="lf-date">{t('form.travelDate')}</label>
            <input id="lf-date" name="travelDate" type="date"
              className="w-full rounded-md border border-cream-dark px-3 py-2 focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon" />
          </div>
          <TripShapeFields idPrefix="lf" />
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1" htmlFor="lf-service">{t('form.service')}</label>
            <select id="lf-service" name="service" defaultValue={defaultService}
              className="w-full rounded-md border border-cream-dark px-3 py-2 focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon">
              <option value="hotel">{t('form.service.hotel')}</option>
              <option value="transport">{t('form.service.transport')}</option>
              <option value="tour">{t('form.service.tour')}</option>
              <option value="group">{t('form.service.group')}</option>
              <option value="simhastha">{t('form.service.simhastha')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1" htmlFor="lf-message">{t('form.message')}</label>
            <textarea id="lf-message" name="message" rows={2}
              className="w-full rounded-md border border-cream-dark px-3 py-2 focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon"
              placeholder={locale === 'hi' ? 'कितने लोग, कब, क्या चाहिए' : 'Travelers count, dates, requirements'} />
          </div>
          <button type="submit" disabled={status === 'sending'} className="btn-call w-full">
            <Send className="h-4 w-4" />
            {status === 'sending' ? '...' : t('form.submit')}
          </button>
          {status === 'error' && <p className="text-sm text-maroon text-center">{t('form.error')}</p>}
        </form>
      )}
    </div>
  );
}
