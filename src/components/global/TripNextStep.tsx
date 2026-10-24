import { Link } from 'react-router-dom';
import { CalendarDays, Plane, ArrowRight } from 'lucide-react';
import { useI18n } from '../../i18n';
import { SITE } from '../../lib/site';

/*
 * "What next?" for a visitor who has the answer they came for (a timing, a distance) and is
 * about to leave. GA4 (28d to 2026-10-23): Harsiddhi 204 sessions / 0 leads, Best places 89 / 0,
 * Mahakal Lok 42 / 0 — those pages answer the question and offer nothing after it. The one
 * place that did offer the trip (ujjain-to-omkareshwar-cab, a7f7872) converts at 2.6%.
 *
 * The block asks the question the visitor is already asking next ("how many days?") and lets
 * them pick one of three trip lengths — a small yes that leads to a package page with its form.
 * No price: rates are confirmed on the call (Aman, 2026-10-16), so none is printed here.
 */

type Option = { days: { hi: string; en: string }; title: { hi: string; en: string }; covers: { hi: string; en: string }; slug: string; mark?: { hi: string; en: string } };

const OPTIONS: Option[] = [
  {
    days: { hi: '1 दिन', en: '1 day' },
    title: { hi: 'उज्जैन दर्शन', en: 'Ujjain darshan' },
    covers: { hi: 'महाकालेश्वर, काल भैरव, हरसिद्धि, मंगलनाथ, संदीपनि आश्रम, राम घाट', en: 'Mahakaleshwar, Kal Bhairav, Harsiddhi, Mangalnath, Sandipani Ashram, Ram Ghat' },
    slug: 'ujjain-darshan-package',
  },
  {
    days: { hi: '2 दिन', en: '2 days' },
    title: { hi: 'उज्जैन + ओंकारेश्वर', en: 'Ujjain + Omkareshwar' },
    covers: { hi: 'दो ज्योतिर्लिंग एक यात्रा में — ओंकारेश्वर उज्जैन से लगभग 140 किमी', en: 'Two Jyotirlingas in one trip — Omkareshwar is about 140 km from Ujjain' },
    slug: 'ujjain-omkareshwar-package',
    mark: { hi: 'दो ज्योतिर्लिंग', en: 'Two Jyotirlingas' },
  },
  {
    days: { hi: '3–4 दिन', en: '3–4 days' },
    title: { hi: '+ महेश्वर, मांडू', en: '+ Maheshwar, Mandu' },
    covers: { hi: 'नर्मदा तट का महेश्वर और मांडू का किला — परिवार व समूह के लिए', en: 'Maheshwar on the Narmada and the Mandu fort — for families and groups' },
    slug: 'ujjain-omkareshwar-maheshwar-mandu-4-days',
  },
];

export function TripNextStep({ source, className = '', inline = false }: { source: string; className?: string; inline?: boolean }) {
  const { locale } = useI18n();
  const isHi = locale === 'hi';
  const prefix = isHi ? '/hi' : '';
  const track = (option: string) => window.gtag?.('event', 'trip_plan_click', { option, source });

  return (
    <section className={`${inline ? 'not-prose my-10' : 'container-page py-8'} ${className}`} aria-labelledby={`tns-${source}`}>
      <div className="rounded-2xl border border-gold/50 bg-cream-dark/40 p-5 sm:p-7">
        <p className={`flex items-center gap-2 font-semibold text-ink-label ${isHi ? 'text-xs' : 'text-[11px] uppercase tracking-[0.22em]'}`}>
          <CalendarDays className="h-4 w-4 text-maroon" /> {isHi ? 'यात्रा की योजना' : 'Plan the trip'}
        </p>
        <h2 id={`tns-${source}`} className={`mt-2 font-bold text-maroon ${isHi ? 'font-sanskrit text-2xl sm:text-3xl' : 'font-serif text-xl sm:text-2xl'}`}>
          {isHi ? 'उज्जैन के लिए कितने दिन चाहिए?' : 'How many days do you need for Ujjain?'}
        </h2>
        <p className="mt-2 text-sm text-ink-soft sm:text-base">
          {isHi
            ? 'शहर के मुख्य मंदिर एक दिन में देखे जा सकते हैं। ओंकारेश्वर जोड़ना हो तो दूसरा दिन रखें। अपनी यात्रा चुनें — दिन-वार योजना और बुकिंग फ़ॉर्म अगले पेज पर है।'
            : 'The main temples of the city fit in one day. Add a second day for Omkareshwar. Pick your trip — the day-wise plan and the booking form are on the next page.'}
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {OPTIONS.map((o) => (
            <Link
              key={o.slug}
              to={`${prefix}/tour-and-travel-ujjain/${o.slug}/`}
              onClick={() => track(o.slug)}
              className={`group relative flex flex-col rounded-xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${o.mark ? 'border-maroon' : 'border-cream-dark'}`}
            >
              {o.mark && (
                <span className="absolute -top-2.5 left-4 rounded-full bg-maroon px-2 py-0.5 text-[10px] font-bold text-cream">
                  {o.mark[locale]}
                </span>
              )}
              <span className={`text-xs font-bold text-saffron-700 ${isHi ? '' : 'uppercase tracking-wider'}`}>{o.days[locale]}</span>
              <span className="mt-1 font-serif text-lg font-bold text-maroon">{o.title[locale]}</span>
              <span className="mt-1 flex-1 text-sm leading-snug text-ink-soft">{o.covers[locale]}</span>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-maroon group-hover:text-saffron-700">
                {isHi ? 'दिन-वार योजना देखें' : 'See the day-wise plan'} <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
        <p className="mt-4 flex items-start gap-2 text-sm text-ink-soft">
          <Plane className="mt-0.5 h-4 w-4 flex-shrink-0 text-maroon" />
          <span>
            {isHi
              ? 'विदेश से आ रहे हैं? सबसे नज़दीकी हवाई अड्डा इंदौर (IDR) है, उज्जैन से लगभग 55 किमी। वहाँ से कैब की व्यवस्था हो सकती है — फ़ॉर्म में नंबर +देश कोड के साथ लिखें या '
              : 'Coming from abroad? The nearest airport is Indore (IDR), about 55 km from Ujjain, and a cab from there can be arranged — enter your number with the country code in the form, or '}
            <a href={SITE.phoneTel} onClick={() => track('call')} className="font-semibold text-maroon underline">
              {isHi ? `कॉल करें ${SITE.phone}` : `call ${SITE.phone}`}
            </a>
            {isHi ? '।' : '.'}
          </span>
        </p>
      </div>
    </section>
  );
}
