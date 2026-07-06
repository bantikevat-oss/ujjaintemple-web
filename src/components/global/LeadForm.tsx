import { useState, FormEvent } from 'react';
import { Phone, Send } from 'lucide-react';
import { useI18n } from '../../i18n';
import { SITE } from '../../lib/site';

interface Props {
  defaultService?: 'darshanPlan' | 'hotel' | 'transport' | 'tour' | 'simhastha' | 'cab';
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
        <a href={SITE.phoneTel} className="mt-3 inline-flex items-center gap-2 font-bold text-maroon hover:text-saffron">
          <Phone className="h-4 w-4" /> {SITE.phone}
        </a>
      </div>

      {status === 'success' ? (
        <div className="rounded-md bg-cream p-4 text-center text-maroon font-semibold">
          {t('form.success')}
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1" htmlFor="lf-name">{t('form.name')} *</label>
            <input id="lf-name" name="name" required type="text" autoComplete="name"
              className="w-full rounded-md border border-cream-dark px-3 py-2 focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon"
              placeholder={locale === 'hi' ? 'आपका नाम' : 'Your name'} />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1" htmlFor="lf-phone">{t('form.phone')} *</label>
            <input id="lf-phone" name="phone" required type="tel" autoComplete="tel" pattern="[0-9]{10}"
              className="w-full rounded-md border border-cream-dark px-3 py-2 focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon"
              placeholder="10 digit mobile number" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1" htmlFor="lf-service">{t('form.service')}</label>
            <select id="lf-service" name="service" defaultValue={defaultService}
              className="w-full rounded-md border border-cream-dark px-3 py-2 focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon">
              <option value="hotel">{t('form.service.hotel')}</option>
              <option value="transport">{t('form.service.transport')}</option>
              <option value="tour">{t('form.service.tour')}</option>
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
