import { useI18n } from '../../i18n';
import { Users, MapPin, Headphones, Route } from 'lucide-react';

const REASONS = [
  {
    Icon: Users,
    titleHi: 'अनुभवी वैदिक पंडित',
    titleEn: 'Experienced Vedic Pandits',
    descHi: 'अनुभवी वैदिक पंडित जी द्वारा शास्त्रसम्मत विधि से सम्पूर्ण पूजा।',
    descEn: 'Complete shastra-compliant pujas by experienced Vedic pandits.',
  },
  {
    Icon: MapPin,
    titleHi: 'सम्पूर्ण यात्रा मार्गदर्शन',
    titleEn: 'Complete Travel Guide',
    descHi: 'कैब · होटल · टूर पैकेज · परिवहन — एक ही जगह से पूरी व्यवस्था।',
    descEn: 'Cab · Hotels · Tour packages · Transport — everything arranged from one place.',
  },
  {
    Icon: Headphones,
    titleHi: 'फ़ोन व WhatsApp पर सहायता',
    titleEn: 'Help on phone & WhatsApp',
    descHi: 'योजना से दर्शन तक — कॉल या WhatsApp पर सीधे हमसे बात करें।',
    descEn: 'From planning to darshan — talk to us directly on call or WhatsApp.',
  },
  {
    Icon: Route,
    titleHi: 'व्यक्तिगत यात्रा योजना',
    titleEn: 'Personalised Yatra Plan',
    descHi: 'आपकी सुविधा अनुसार पूजा, कैब, होटल एवं टूर की कस्टम योजना।',
    descEn: 'Custom puja, cab, hotel and tour plan tailored to your convenience.',
  },
];

/* Same card + type system as the homepage service tiles (redesign option 1, 2026-10-28).
   Colours are the UT lane only — the old navy icon was ByteFlow corporate, never this site. */
export function WhyUjjainTemple() {
  const { locale } = useI18n();
  const isHi = locale === 'hi';

  return (
    <section className="bg-cream">
      <div className="container-page py-12 sm:py-16">
        <div className="mb-8 text-center">
          <p className={isHi ? 'text-sm font-semibold text-ink-label' : 'text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-label'}>
            {isHi ? 'हम क्यों?' : 'Why us'}
          </p>
          <h2 className={`mt-2 text-maroon text-3xl sm:text-4xl ${isHi ? 'font-sanskrit font-normal' : 'font-serif font-bold'}`}>
            {isHi
              ? 'UjjainTemple.com पर भरोसा क्यों करें?'
              : 'Why trust UjjainTemple.com for your Ujjain visit?'}
          </h2>
        </div>

        <ul className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2 sm:gap-4">
          {REASONS.map(({ Icon, titleHi, titleEn, descHi, descEn }) => (
            <li key={titleEn} className="flex items-start gap-4 rounded-2xl border border-gold/40 bg-white p-5 shadow-sm">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cream-light text-maroon ring-1 ring-gold/40">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <span>
                <h3 className={`text-lg text-maroon ${isHi ? 'font-hindi font-semibold' : 'font-serif font-bold'}`}>
                  {isHi ? titleHi : titleEn}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{isHi ? descHi : descEn}</p>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
