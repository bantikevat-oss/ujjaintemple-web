import { useState, FormEvent } from 'react';
import { Send, Phone } from 'lucide-react';
import { useI18n } from '../../i18n';
import { SITE } from '../../lib/site';
import { SHAHI_SNANS } from '../../data/simhastha-dates';

/**
 * Simhastha 2028 trip enquiry — date, group size and needs in one short form.
 *
 * Posts to the same api/lead.php as LeadForm, so the lead lands in leads.csv, the owner
 * mail and the CRM with no server change. The structured answers go into `message` and
 * `travelDate`, which lead.php already carries end to end.
 *
 * 🔴 Compliance: this is a travel enquiry, not a booking. No darshan, queue, pass or
 * "reserved place" language (not even as a denial) — snan, ghats and temple access belong to the mela
 * administration and the temple committees, and the note under the button says so.
 * No guide/sahayak option either (rejected 2026-10-16: low revenue, ground-level claim risk).
 */

type Need = 'hotel' | 'cab' | 'tour' | 'puja';

const NEEDS: { id: Need; hi: string; en: string }[] = [
  { id: 'hotel', hi: 'होटल / धर्मशाला',      en: 'Hotel / dharamshala' },
  { id: 'cab',   hi: 'कैब / ट्रांसपोर्ट',      en: 'Cab / transport' },
  { id: 'tour',  hi: 'पूरी यात्रा की योजना',   en: 'Full trip plan' },
  { id: 'puja',  hi: 'पूजा (पंडित जी)',        en: 'Puja (Pandit Ji)' },
];

const GROUPS = [
  { id: '1-2',  hi: '1–2 लोग',               en: '1–2 people' },
  { id: '3-5',  hi: '3–5 लोग',               en: '3–5 people' },
  { id: '6-9',  hi: '6–9 लोग',               en: '6–9 people' },
  { id: '10+',  hi: '10 या अधिक (समूह)',     en: '10 or more (group)' },
];

/** lead.php scores on `purpose`; a group always wins, otherwise the first concrete need. */
function purposeFor(group: string, needs: Need[]): string {
  if (group === '10+') return 'group';
  if (needs.includes('hotel')) return 'hotel';
  if (needs.includes('cab')) return 'cab';
  if (needs.includes('puja')) return 'puja';
  return 'tour';
}

declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}

export function SimhasthaEnquiry({ sourcePage }: { sourcePage: string }) {
  const { locale } = useI18n();
  const isHi = locale === 'hi';
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const raw = new FormData(form);

    const when = String(raw.get('when') || '');
    const group = String(raw.get('group') || '');
    const needs = raw.getAll('need').map(String) as Need[];
    const note = String(raw.get('note') || '').trim();

    const snan = SHAHI_SNANS.find((s) => s.iso === when);
    const whenLabel = snan ? `${snan.nameEn} (${snan.dateEn})` : when === 'other' ? 'Another mela day' : 'Not decided yet';
    const needLabel = needs.length ? needs.map((n) => NEEDS.find((x) => x.id === n)?.en).join(', ') : '—';
    const groupLabel = GROUPS.find((g) => g.id === group)?.en ?? '—';

    const data = new FormData();
    data.append('name', String(raw.get('name') || ''));
    data.append('phone', String(raw.get('phone') || ''));
    data.append('website', String(raw.get('website') || ''));
    data.append('service', 'simhastha');
    data.append('purpose', purposeFor(group, needs));
    data.append('channel', 'form');
    data.append('sourcePage', sourcePage);
    data.append('locale', locale);
    if (snan) data.append('travelDate', snan.iso);
    // Same fields LeadForm sends, so lead.php tiers this lead the same way (10+ / 6–9 / cab + hotel → PREMIUM).
    if (group) data.append('travellers', group);
    const shape = needs.includes('tour') ? 'full_plan'
      : needs.includes('hotel') && needs.includes('cab') ? 'cab_hotel'
      : needs.length === 1 && needs[0] === 'cab' ? 'cab' : '';
    if (shape) data.append('tripShape', shape);
    data.append(
      'message',
      [`Simhastha 2028`, `When: ${whenLabel}`, `People: ${groupLabel}`, `Needs: ${needLabel}`, note && `Note: ${note}`]
        .filter(Boolean)
        .join('\n'),
    );

    setStatus('sending');
    try {
      const res = await fetch('/api/lead.php', { method: 'POST', body: data });
      if (!res.ok) throw new Error('submit failed');
      setStatus('success');
      form.reset();
      window.gtag?.('event', 'generate_lead', { form_id: 'simhastha_enquiry', group_size: group || 'unknown' });
    } catch {
      setStatus('error');
    }
  }

  const field =
    'w-full rounded-md border border-cream-dark bg-white px-3 py-2.5 text-ink focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon';
  const label = 'block text-sm font-medium text-ink-soft mb-1';

  return (
    <section id="enquiry" className="bg-cream py-16 sm:py-20 border-b border-gold/25">
      <div className="container-page max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-ink-label font-serif text-sm tracking-[0.3em] uppercase mb-3">
            {isHi ? '— सिंहस्थ 2028 यात्रा —' : '— Simhastha 2028 Trip —'}
          </p>
          <h2 className={`font-bold text-maroon leading-tight ${isHi ? 'font-sanskrit text-3xl sm:text-4xl' : 'font-serif text-3xl sm:text-4xl'}`}>
            {isHi ? 'अपनी सिंहस्थ यात्रा की योजना अभी से बनाएँ' : 'Start planning your Simhastha trip now'}
          </h2>
          <p className="mt-4 text-ink-soft leading-relaxed">
            {isHi
              ? 'तारीख, लोगों की संख्या और ज़रूरत बताइए। होटल, कैब और पूजा की व्यवस्था के लिए हमारी टीम कॉल या WhatsApp पर संपर्क करेगी।'
              : 'Tell us your dates, group size and what you need. Our team will call or WhatsApp you about stay, transport and puja arrangements.'}
          </p>
        </div>

        <div className="rounded-xl border-2 border-gold bg-white p-5 sm:p-7 shadow-md">
          {status === 'success' ? (
            <div className="rounded-md bg-cream p-5 text-center" role="status">
              <p className="font-semibold text-maroon">
                {isHi ? 'धन्यवाद! आपकी जानकारी हमें मिल गई है।' : 'Thank you — we have your details.'}
              </p>
              <p className="mt-2 text-sm text-ink-soft">
                {isHi
                  ? 'हमारी टीम जल्द ही कॉल या WhatsApp पर संपर्क करेगी। अभी कोई भुगतान नहीं लिया जाता।'
                  : 'Our team will call or WhatsApp you shortly. Nothing is charged at this stage.'}
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4" noValidate={false}>
              {/* Honeypot — matches the `website` check in api/lead.php. */}
              <input
                type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={label} htmlFor="se-name">{isHi ? 'नाम' : 'Name'} *</label>
                  <input
                    id="se-name" name="name" required type="text" autoComplete="name" minLength={2} maxLength={60}
                    onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[0-9]/g, ''); }}
                    className={field} placeholder={isHi ? 'आपका नाम' : 'Your name'}
                  />
                </div>
                <div>
                  <label className={label} htmlFor="se-phone">{isHi ? 'मोबाइल नंबर' : 'Mobile number'} *</label>
                  <input
                    id="se-phone" name="phone" required type="tel" autoComplete="tel" inputMode="numeric"
                    pattern="[6-9][0-9]{9}" maxLength={10}
                    title={isHi ? '10 अंकों का मोबाइल नंबर' : '10-digit mobile number'}
                    onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '').slice(0, 10); }}
                    className={field} placeholder={isHi ? '10 अंकों का नंबर' : '10-digit number'}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={label} htmlFor="se-when">{isHi ? 'कब आना है?' : 'When will you come?'}</label>
                  <select id="se-when" name="when" defaultValue="" className={field}>
                    <option value="">{isHi ? 'अभी तय नहीं' : 'Not decided yet'}</option>
                    {SHAHI_SNANS.map((s) => (
                      <option key={s.iso} value={s.iso}>
                        {isHi ? `${s.nameHi} — ${s.dateHi}` : `${s.nameEn} — ${s.dateEn}`}
                      </option>
                    ))}
                    <option value="other">{isHi ? 'मेले का कोई और दिन (27 मार्च – 27 मई)' : 'Another mela day (27 Mar – 27 May)'}</option>
                  </select>
                </div>
                <div>
                  <label className={label} htmlFor="se-group">{isHi ? 'कितने लोग?' : 'How many people?'}</label>
                  <select id="se-group" name="group" defaultValue="" className={field}>
                    <option value="">{isHi ? 'चुनें' : 'Select'}</option>
                    {GROUPS.map((g) => (
                      <option key={g.id} value={g.id}>{isHi ? g.hi : g.en}</option>
                    ))}
                  </select>
                </div>
              </div>

              <fieldset>
                <legend className={label}>{isHi ? 'क्या चाहिए?' : 'What do you need?'}</legend>
                <div className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {NEEDS.map((n) => (
                    <label
                      key={n.id}
                      className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-md border border-cream-dark px-3 py-2 text-sm text-ink has-[:checked]:border-maroon has-[:checked]:bg-cream"
                    >
                      <input type="checkbox" name="need" value={n.id} className="h-4 w-4 accent-maroon" />
                      {isHi ? n.hi : n.en}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div>
                <label className={label} htmlFor="se-note">{isHi ? 'कुछ और बताना हो (वैकल्पिक)' : 'Anything else (optional)'}</label>
                <textarea
                  id="se-note" name="note" rows={2} maxLength={300} className={field}
                  placeholder={isHi ? 'जैसे — बुज़ुर्ग साथ हैं, किस शहर से आ रहे हैं' : 'e.g. elderly family members, which city you are coming from'}
                />
              </div>

              <button type="submit" disabled={status === 'sending'} className="btn-call w-full">
                <Send className="h-4 w-4" />
                {status === 'sending' ? '...' : isHi ? 'जानकारी भेजें' : 'Send details'}
              </button>

              {status === 'error' && (
                <p className="text-center text-sm text-maroon" role="alert">
                  {isHi ? 'कुछ गड़बड़ हुई — कृपया कॉल करें ' : 'Something went wrong — please call '}
                  <a href={SITE.phoneTel} className="font-bold underline">{SITE.phone}</a>
                </p>
              )}

              <p className="text-center text-xs text-ink-soft leading-relaxed">
                {isHi
                  ? 'अभी कोई भुगतान नहीं लिया जाता। यह यात्रा की जानकारी का फ़ॉर्म है — स्नान, घाट और मंदिर की व्यवस्था मेला प्रशासन और मंदिर समितियों की है।'
                  : 'Nothing is charged now. This is a travel enquiry form — snan, ghat and temple arrangements are run by the mela administration and the temple committees.'}
              </p>
            </form>
          )}

          <div className="mt-5 border-t border-cream-dark pt-4 text-center">
            <a href={SITE.phoneTel} className="inline-flex items-center gap-2 font-bold text-maroon hover:text-saffron-700">
              <Phone className="h-4 w-4" />
              {isHi ? `या सीधे कॉल करें: ${SITE.phone}` : `Or call directly: ${SITE.phone}`}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
