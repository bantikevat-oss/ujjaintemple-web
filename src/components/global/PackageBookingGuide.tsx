import { ClipboardList, PhoneCall, MapPinned, Check, Minus } from 'lucide-react';
import type { Locale } from '../../i18n';

/*
 * The package pages showed a day plan and a form, and nothing about what happens after the
 * form — the question a first-time buyer has before giving a number. This answers it, and the
 * FAQ goes into FAQPage schema from TourPackageDetail.
 * 🔴 No price (rates are confirmed on the call), no darshan arrangement of any kind (that is
 * the temple's, never ours), no response-time promise we cannot measure.
 */

type B = { hi: string; en: string };

export const PACKAGE_FAQS: Array<{ q: B; a: B }> = [
  {
    q: { hi: 'इस पैकेज का खर्च कितना है?', en: 'How much does this package cost?' },
    a: {
      hi: 'खर्च लोगों की संख्या, गाड़ी (सेडान, SUV या टेम्पो ट्रैवलर), होटल की श्रेणी और यात्रा की तारीख पर निर्भर है, इसलिए एक तय दाम नहीं लिखा है। फ़ॉर्म में ये जानकारी भरें — आपकी यात्रा के हिसाब से दाम कॉल पर बताया जाता है।',
      en: 'It depends on the number of travellers, the vehicle (sedan, SUV or tempo traveller), the hotel category and your dates, so there is no single printed price. Fill these in the form and the rate for your trip is shared on the call.',
    },
  },
  {
    q: { hi: 'क्या दिन-वार योजना बदली जा सकती है?', en: 'Can the day-wise plan be changed?' },
    a: {
      hi: 'हाँ। ऊपर दी गई योजना एक नमूना है — मंदिर, दिनों की संख्या और रुकने की जगह आपकी ज़रूरत के हिसाब से तय की जाती है।',
      en: 'Yes. The plan above is a template — the temples, the number of days and where you stay are set around what you need.',
    },
  },
  {
    q: { hi: 'क्या पैकेज में मंदिर दर्शन की बुकिंग शामिल है?', en: 'Does the package include temple darshan bookings?' },
    a: {
      hi: 'नहीं। मंदिर के अंदर की दर्शन व्यवस्था मंदिर प्रबंधन की है — उसके नियम और समय मंदिर की आधिकारिक वेबसाइट पर देखें। हम गाड़ी, ठहरने और दिन की योजना में मदद करते हैं।',
      en: "No. Darshan inside the temple is arranged by the temple administration — check its rules and timings on the temple's official website. We help with the vehicle, the stay and the day plan.",
    },
  },
  {
    q: { hi: 'विदेश से आ रहे हैं तो कैसे बुक करें?', en: 'How do I book if I am coming from abroad?' },
    a: {
      hi: 'फ़ॉर्म में अपना नंबर देश कोड के साथ लिखें (जैसे +1, +44, +971)। सबसे नज़दीकी हवाई अड्डा इंदौर (IDR) है, उज्जैन से लगभग 55 किमी — वहाँ से कैब की व्यवस्था की जा सकती है।',
      en: 'Enter your number with the country code in the form (e.g. +1, +44, +971). The nearest airport is Indore (IDR), about 55 km from Ujjain, and a cab from there can be arranged.',
    },
  },
];

const STEPS: Array<{ icon: typeof ClipboardList; t: B; d: B }> = [
  { icon: ClipboardList, t: { hi: 'फ़ॉर्म भरें', en: 'Send the form' }, d: { hi: 'तारीख, कितने लोग और कितने दिन — बस इतना।', en: 'Dates, how many people and how many days — that is all.' } },
  { icon: PhoneCall, t: { hi: 'कॉल पर योजना व दाम', en: 'Plan and rate on a call' }, d: { hi: 'आपकी यात्रा के हिसाब से गाड़ी, ठहरना और दाम तय होते हैं।', en: 'The vehicle, the stay and the rate are set for your trip.' } },
  { icon: MapPinned, t: { hi: 'यात्रा', en: 'Travel' }, d: { hi: 'तय योजना के साथ उज्जैन और आसपास के दर्शन।', en: 'Ujjain and the nearby temples, on the agreed plan.' } },
];

const INCLUDED: B[] = [
  { hi: 'ड्राइवर सहित गाड़ी — सेडान, SUV या टेम्पो ट्रैवलर', en: 'Vehicle with driver — sedan, SUV or tempo traveller' },
  { hi: 'होटल या धर्मशाला ढूँढने में मदद', en: 'Help finding a hotel or dharamshala' },
  { hi: 'दिन-वार योजना — कौन सा मंदिर कब', en: 'A day-wise plan — which temple when' },
  { hi: 'ओंकारेश्वर, महेश्वर, मांडू तक का रूट', en: 'Routes on to Omkareshwar, Maheshwar, Mandu' },
];
const NOT_INCLUDED: B[] = [
  { hi: 'मंदिर के अंदर की दर्शन व्यवस्था (मंदिर प्रबंधन की)', en: 'Darshan arrangements inside temples (the temple administration’s)' },
  { hi: 'पूजा-सामग्री और दान', en: 'Puja items and offerings' },
];

export function PackageBookingGuide({ locale }: { locale: Locale }) {
  const isHi = locale === 'hi';
  const h2 = `font-bold text-maroon ${isHi ? 'font-sanskrit text-2xl sm:text-3xl' : 'font-serif text-2xl'}`;
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-cream bg-white p-6 shadow-sm sm:p-8">
        <h2 className={h2}>{isHi ? 'बुकिंग कैसे होती है' : 'How booking works'}</h2>
        <ol className="mt-5 grid gap-4 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={i} className="rounded-xl bg-cream-dark/40 p-4">
              <s.icon className="h-6 w-6 text-maroon" />
              <p className="mt-2 font-semibold text-ink">{i + 1}. {s.t[locale]}</p>
              <p className="mt-1 text-sm text-ink-soft">{s.d[locale]}</p>
            </li>
          ))}
        </ol>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <p className={`text-xs font-bold text-ink-label ${isHi ? '' : 'uppercase tracking-wider'}`}>{isHi ? 'क्या शामिल हो सकता है' : 'What can be included'}</p>
            <ul className="mt-2 space-y-1.5">
              {INCLUDED.map((x, i) => (
                <li key={i} className="flex gap-2 text-sm text-ink-soft"><Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-maroon" />{x[locale]}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className={`text-xs font-bold text-ink-label ${isHi ? '' : 'uppercase tracking-wider'}`}>{isHi ? 'क्या शामिल नहीं' : 'Not included'}</p>
            <ul className="mt-2 space-y-1.5">
              {NOT_INCLUDED.map((x, i) => (
                <li key={i} className="flex gap-2 text-sm text-ink-soft"><Minus className="mt-0.5 h-4 w-4 flex-shrink-0 text-ink-mute" />{x[locale]}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-cream bg-white p-6 shadow-sm sm:p-8">
        <h2 className={h2}>{isHi ? 'अक्सर पूछे जाने वाले सवाल' : 'Frequently asked questions'}</h2>
        <div className="mt-4 divide-y divide-cream-dark">
          {PACKAGE_FAQS.map((f, i) => (
            <details key={i} className="group py-3" open={i === 0}>
              <summary className="cursor-pointer list-none font-semibold text-ink marker:hidden">{f.q[locale]}</summary>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.a[locale]}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
