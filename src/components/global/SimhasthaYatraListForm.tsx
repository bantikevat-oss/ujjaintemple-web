import { useState, FormEvent } from 'react';
import { Send } from 'lucide-react';
import { useI18n } from '../../i18n';
import { SHAHI_SNANS } from '../../data/simhastha-dates';

/**
 * Simhastha 2028 Yatra List — the pre-registration list (2026-11-18, ₹5 Cr plan P3).
 *
 * Different job from SimhasthaEnquiry: the enquiry asks "what do you need now", this list
 * collects who is coming, from where, when, how many, what stay and what budget — so stay
 * and transport partners can be lined up against real numbers, and the people on it get
 * Simhastha travel updates. Target 5K by Mar 2027, 25K by Dec 2027.
 *
 * Posts to the same api/lead.php (no server change): leads.csv + owner mail + routing as
 * today. 🔴 Never add CSV columns (LANDMINES) — city, stay, budget, email and consent all go
 * into `message`. `service = simhastha-list` is how the list is counted:
 *   grep -c ',simhastha-list,' api/leads.csv
 *
 * 🔴 Compliance: not the official mela registration — the page and this form say so. No
 * pass, darshan, snan-access or "reserved place" language. Consent is required and the
 * privacy policy names it (WhatsApp / SMS travel updates, STOP any time).
 */

const GROUPS = [
  { id: '1-2', hi: '1–2 लोग', en: '1–2 people' },
  { id: '3-5', hi: '3–5 लोग', en: '3–5 people' },
  { id: '6-9', hi: '6–9 लोग', en: '6–9 people' },
  { id: '10+', hi: '10 या अधिक (समूह)', en: '10 or more (group)' },
];

const STAYS = [
  { id: 'hotel',       hi: 'होटल',              en: 'Hotel' },
  { id: 'dharamshala', hi: 'धर्मशाला',           en: 'Dharamshala' },
  { id: 'homestay',    hi: 'होम स्टे',           en: 'Homestay' },
  { id: 'tent',        hi: 'टेंट सिटी',          en: 'Tent city' },
  { id: 'unsure',      hi: 'अभी तय नहीं',        en: 'Not sure yet' },
];

const BUDGETS = [
  { id: 'lt1500',    hi: '₹1,500 से कम',        en: 'Under ₹1,500' },
  { id: '1500-3000', hi: '₹1,500 – ₹3,000',     en: '₹1,500 – ₹3,000' },
  { id: '3000-6000', hi: '₹3,000 – ₹6,000',     en: '₹3,000 – ₹6,000' },
  { id: 'gt6000',    hi: '₹6,000 से अधिक',       en: 'Above ₹6,000' },
  { id: 'unsure',    hi: 'अभी तय नहीं',          en: 'Not sure yet' },
];

declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}

export function SimhasthaYatraListForm({ sourcePage }: { sourcePage: string }) {
  const { locale } = useI18n();
  const isHi = locale === 'hi';
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const raw = new FormData(form);

    const city = String(raw.get('city') || '').trim();
    const when = String(raw.get('when') || '');
    const group = String(raw.get('group') || '');
    const stay = String(raw.get('stay') || '');
    const budget = String(raw.get('budget') || '');
    const email = String(raw.get('email') || '').trim();

    const snan = SHAHI_SNANS.find((s) => s.iso === when);
    const whenLabel = snan ? `${snan.nameEn} (${snan.dateEn})` : when === 'other' ? 'Another mela day' : 'Not decided yet';
    const groupLabel = GROUPS.find((g) => g.id === group)?.en ?? '—';
    const stayLabel = STAYS.find((s) => s.id === stay)?.en ?? '—';
    const budgetLabel = BUDGETS.find((b) => b.id === budget)?.en ?? '—';

    const data = new FormData();
    data.append('name', String(raw.get('name') || ''));
    data.append('phone', String(raw.get('phone') || ''));
    data.append('website', String(raw.get('website') || ''));
    data.append('service', 'simhastha-list');
    // lead.php tiers on purpose: a group is PREMIUM, a chosen stay is a hotel lead, the rest a trip.
    data.append('purpose', group === '10+' ? 'group' : stay && stay !== 'unsure' ? 'hotel' : 'tour');
    data.append('channel', 'form');
    data.append('sourcePage', sourcePage);
    data.append('locale', locale);
    if (snan) data.append('travelDate', snan.iso);
    if (group) data.append('travellers', group);
    data.append(
      'message',
      [
        'Simhastha 2028 — Yatra List',
        `City: ${city}`,
        `When: ${whenLabel}`,
        `People: ${groupLabel}`,
        `Stay: ${stayLabel}`,
        `Budget per room per night: ${budgetLabel}`,
        email && `Email: ${email}`,
        'Consent: Simhastha 2028 travel updates on WhatsApp / SMS — yes',
      ]
        .filter(Boolean)
        .join('\n'),
    );

    setStatus('sending');
    try {
      const res = await fetch('/api/lead.php', { method: 'POST', body: data });
      if (!res.ok) throw new Error('submit failed');
      setStatus('success');
      form.reset();
      window.gtag?.('event', 'generate_lead', { form_id: 'simhastha_yatra_list', group_size: group || 'unknown' });
    } catch {
      setStatus('error');
    }
  }

  const field =
    'w-full rounded-md border border-cream-dark bg-white px-3 py-2.5 text-ink focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon';
  const label = 'block text-sm font-medium text-ink-soft mb-1';

  if (status === 'success') {
    return (
      <div className="rounded-xl border-2 border-gold bg-white p-6 text-center shadow-md" role="status">
        <p className="font-semibold text-maroon">
          {isHi ? 'धन्यवाद! आपका नाम सिंहस्थ 2028 यात्रा सूची में जुड़ गया है।' : 'Thank you — you are on the Simhastha 2028 Yatra List.'}
        </p>
        <p className="mt-2 text-sm text-ink-soft">
          {isHi
            ? 'सिंहस्थ की यात्रा से जुड़ी जानकारी WhatsApp या SMS पर मिलेगी। बंद करनी हो तो STOP लिखकर भेजें।'
            : 'Simhastha travel updates will reach you on WhatsApp or SMS. Reply STOP at any time to stop them.'}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 border-gold bg-white p-5 sm:p-7 shadow-md">
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Honeypot — matches the `website` check in api/lead.php. */}
        <input
          type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
          className="absolute left-[-9999px] h-0 w-0 opacity-0"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="yl-name">{isHi ? 'नाम' : 'Name'} *</label>
            <input
              id="yl-name" name="name" required type="text" autoComplete="name" minLength={2} maxLength={60}
              onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[0-9]/g, ''); }}
              className={field} placeholder={isHi ? 'आपका नाम' : 'Your name'}
            />
          </div>
          <div>
            <label className={label} htmlFor="yl-phone">{isHi ? 'मोबाइल नंबर (WhatsApp)' : 'Mobile number (WhatsApp)'} *</label>
            <input
              id="yl-phone" name="phone" required type="tel" autoComplete="tel" inputMode="tel"
              pattern="(\+[0-9][0-9 \-]{8,16})|([6-9][0-9]{9})" maxLength={18}
              title={isHi ? '10 अंकों का मोबाइल नंबर, या विदेश का नंबर +देश कोड के साथ' : '10-digit mobile number, or a foreign number with +country code'}
              onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9+\- ]/g, '').slice(0, 18); }}
              className={field} placeholder={isHi ? '10 अंकों का नंबर / +देश कोड' : '10-digit number or +country code'}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="yl-city">{isHi ? 'किस शहर से आएँगे?' : 'Which city are you coming from?'} *</label>
            <input
              id="yl-city" name="city" required type="text" autoComplete="address-level2" minLength={2} maxLength={60}
              onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[0-9<>]/g, ''); }}
              className={field} placeholder={isHi ? 'जैसे — अहमदाबाद, पुणे, दिल्ली' : 'e.g. Ahmedabad, Pune, Delhi'}
            />
          </div>
          <div>
            <label className={label} htmlFor="yl-when">{isHi ? 'कब आना है?' : 'When will you come?'}</label>
            <select id="yl-when" name="when" defaultValue="" className={field}>
              <option value="">{isHi ? 'अभी तय नहीं' : 'Not decided yet'}</option>
              {SHAHI_SNANS.map((s) => (
                <option key={s.iso} value={s.iso}>
                  {isHi ? `${s.nameHi} — ${s.dateHi}` : `${s.nameEn} — ${s.dateEn}`}
                </option>
              ))}
              <option value="other">{isHi ? 'मेले का कोई और दिन' : 'Another mela day'}</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={label} htmlFor="yl-group">{isHi ? 'कितने लोग?' : 'How many people?'}</label>
            <select id="yl-group" name="group" defaultValue="" className={field}>
              <option value="">{isHi ? 'चुनें' : 'Select'}</option>
              {GROUPS.map((g) => <option key={g.id} value={g.id}>{isHi ? g.hi : g.en}</option>)}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="yl-stay">{isHi ? 'कहाँ ठहरना चाहेंगे?' : 'Preferred stay'}</label>
            <select id="yl-stay" name="stay" defaultValue="" className={field}>
              <option value="">{isHi ? 'चुनें' : 'Select'}</option>
              {STAYS.map((s) => <option key={s.id} value={s.id}>{isHi ? s.hi : s.en}</option>)}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="yl-budget">{isHi ? 'प्रति कमरा प्रति रात बजट' : 'Budget per room per night'}</label>
            <select id="yl-budget" name="budget" defaultValue="" className={field}>
              <option value="">{isHi ? 'चुनें' : 'Select'}</option>
              {BUDGETS.map((b) => <option key={b.id} value={b.id}>{isHi ? b.hi : b.en}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={label} htmlFor="yl-email">{isHi ? 'ईमेल (वैकल्पिक)' : 'Email (optional)'}</label>
          <input id="yl-email" name="email" type="email" autoComplete="email" maxLength={80} className={field} placeholder="name@example.com" />
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-md border border-cream-dark px-3 py-3 text-sm text-ink has-[:checked]:border-maroon has-[:checked]:bg-cream">
          <input type="checkbox" name="consent" value="yes" required className="mt-0.5 h-4 w-4 flex-shrink-0 accent-maroon" />
          <span>
            {isHi
              ? 'मुझे सिंहस्थ 2028 की यात्रा से जुड़ी जानकारी WhatsApp या SMS पर भेजें। STOP लिखकर मैं इसे कभी भी बंद कर सकता/सकती हूँ।'
              : 'Send me Simhastha 2028 travel updates on WhatsApp or SMS. I can stop them any time by replying STOP.'}
            {' *'}
          </span>
        </label>

        <button type="submit" disabled={status === 'sending'} className="btn-call w-full">
          <Send className="h-4 w-4" />
          {status === 'sending' ? '...' : isHi ? 'सूची में नाम जोड़ें' : 'Join the Yatra List'}
        </button>

        {status === 'error' && (
          <p className="text-center text-sm text-maroon" role="alert">
            {isHi ? 'कुछ गड़बड़ हुई — कृपया थोड़ी देर बाद दोबारा भेजें।' : 'Something went wrong — please try again in a moment.'}
          </p>
        )}

        <p className="text-center text-xs text-ink-soft leading-relaxed">
          {isHi
            ? 'यह मेले का आधिकारिक पंजीकरण नहीं है और इसके लिए कोई शुल्क नहीं लिया जाता। स्नान, घाट और मंदिर की व्यवस्था मेला प्रशासन और मंदिर समितियों की है।'
            : 'This is not the official mela registration, and nothing is charged to join. Snan, ghat and temple arrangements are run by the mela administration and the temple committees.'}
        </p>
      </form>
    </div>
  );
}
