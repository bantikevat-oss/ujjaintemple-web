import { useI18n } from '../../i18n';

/**
 * Trip-shape questions shared by LeadForm and the WhatsApp gate (premium-lead plan,
 * Aman 2026-10-16: most UT leads only wanted a car, often already on the way).
 *
 * Every field is OPTIONAL. api/lead.php whitelists the values and uses them to tag a lead
 * PREMIUM (6+ people, 2+ days, cab + hotel, full plan) or QUICK (cab only, travelling
 * within 2 days). A visitor who skips them is still a lead — the WhatsApp path carries
 * about half of all enquiries, and a required field there would cost leads, not filter them.
 *
 * Field names must match lead.php: tripShape · travellers · tripDays · fromCity.
 */

export const TRIP_SHAPES = [
  { value: 'cab',       hi: 'सिर्फ़ कैब',            en: 'Cab only' },
  { value: 'cab_hotel', hi: 'कैब + होटल',            en: 'Cab + hotel' },
  { value: 'full_plan', hi: '2–3 दिन का पूरा प्लान', en: 'Full 2–3 day plan' },
] as const;

export const TRAVELLERS = [
  { value: '1-2', hi: '1–2 लोग',            en: '1–2 people' },
  { value: '3-5', hi: '3–5 लोग',            en: '3–5 people' },
  { value: '6-9', hi: '6–9 लोग',            en: '6–9 people' },
  { value: '10+', hi: '10 या अधिक (समूह)', en: '10 or more (group)' },
] as const;

const DAYS = [
  { value: '1',  hi: '1 दिन',        en: '1 day' },
  { value: '2',  hi: '2 दिन',        en: '2 days' },
  { value: '3+', hi: '3 या अधिक दिन', en: '3 days or more' },
] as const;

interface Props {
  /** id prefix, so two instances on one page never share ids. */
  idPrefix: string;
  /** compact = shape + people only (the WhatsApp gate, where every extra field costs). */
  compact?: boolean;
}

export function TripShapeFields({ idPrefix, compact = false }: Props) {
  const { locale } = useI18n();
  const isHi = locale === 'hi';
  const label = 'mb-1 block text-sm font-medium text-ink-soft';
  const field =
    'w-full rounded-md border border-cream-dark bg-white px-3 py-2 focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon';
  const optional = <span className="font-normal text-ink-mute">({isHi ? 'वैकल्पिक' : 'optional'})</span>;

  return (
    <>
      <fieldset>
        <legend className={label}>
          {isHi ? 'किस तरह की यात्रा?' : 'What kind of trip?'} {optional}
        </legend>
        <div className={compact ? 'grid grid-cols-3 gap-1.5' : 'grid grid-cols-1 gap-2 sm:grid-cols-3'}>
          {TRIP_SHAPES.map((s) => (
            <label
              key={s.value}
              className={`flex min-h-[44px] cursor-pointer items-center rounded-md border border-cream-dark bg-white text-ink has-[:checked]:border-maroon has-[:checked]:bg-cream ${
                compact ? 'justify-center gap-1.5 px-1.5 py-1.5 text-center text-xs leading-tight' : 'gap-2 px-3 py-2 text-sm'
              }`}
            >
              <input type="radio" name="tripShape" value={s.value} className="h-4 w-4 shrink-0 accent-maroon" />
              {isHi ? s.hi : s.en}
            </label>
          ))}
        </div>
      </fieldset>

      <div className={compact ? '' : 'grid gap-3 sm:grid-cols-2'}>
        <div>
          <label className={label} htmlFor={`${idPrefix}-people`}>
            {isHi ? 'कितने लोग?' : 'How many people?'} {optional}
          </label>
          <select id={`${idPrefix}-people`} name="travellers" defaultValue="" className={field}>
            <option value="">{isHi ? 'चुनें' : 'Select'}</option>
            {TRAVELLERS.map((t) => (
              <option key={t.value} value={t.value}>{isHi ? t.hi : t.en}</option>
            ))}
          </select>
        </div>

        {!compact && (
          <div>
            <label className={label} htmlFor={`${idPrefix}-days`}>
              {isHi ? 'कितने दिन रुकेंगे?' : 'How many days?'} {optional}
            </label>
            <select id={`${idPrefix}-days`} name="tripDays" defaultValue="" className={field}>
              <option value="">{isHi ? 'चुनें' : 'Select'}</option>
              {DAYS.map((d) => (
                <option key={d.value} value={d.value}>{isHi ? d.hi : d.en}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {!compact && (
        <div>
          <label className={label} htmlFor={`${idPrefix}-from`}>
            {isHi ? 'कहाँ से आ रहे हैं?' : 'Where are you coming from?'} {optional}
          </label>
          <input
            id={`${idPrefix}-from`} name="fromCity" type="text" maxLength={40} autoComplete="address-level2"
            onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[0-9]/g, ''); }}
            className={field} placeholder={isHi ? 'जैसे — पुणे' : 'e.g. Pune'}
          />
        </div>
      )}
    </>
  );
}
