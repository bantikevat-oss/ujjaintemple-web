import { useI18n } from '../../i18n';
import { Users, MapPin, Headphones, Sparkles } from 'lucide-react';

const REASONS = [
  {
    Icon: Users,
    color: '#1a3a5c',
    bg: 'rgba(26,58,92,0.08)',
    titleHi: 'अनुभवी वैदिक पंडित',
    titleEn: 'Experienced Vedic Pandits',
    descHi: 'अनुभवी वैदिक पंडित जी द्वारा शास्त्रसम्मत विधि से सम्पूर्ण पूजा।',
    descEn: 'Complete shastra-compliant pujas by experienced Vedic pandits.',
  },
  {
    Icon: MapPin,
    color: '#c2410c',
    bg: 'rgba(194,65,12,0.08)',
    titleHi: 'सम्पूर्ण यात्रा मार्गदर्शन',
    titleEn: 'Complete Travel Guide',
    descHi: 'कैब · होटल · टूर पैकेज · परिवहन — एक ही जगह से पूरी व्यवस्था।',
    descEn: 'Cab · Hotels · Tour packages · Transport — everything arranged from one place.',
  },
  {
    Icon: Headphones,
    color: '#9C411B',
    bg: 'rgba(156,65,27,0.08)',
    titleHi: '24×7 यात्रा सहायता',
    titleEn: '24×7 Travel Support',
    descHi: 'फ़ोन एवं व्हाट्सऐप पर कभी भी सहायता — योजना से दर्शन तक साथ।',
    descEn: 'Help anytime on phone & WhatsApp — with you from planning to darshan.',
    stat: '24×7',
    statLabel: 'Support',
  },
  {
    Icon: Sparkles,
    color: '#c2410c',
    bg: 'rgba(194,65,12,0.08)',
    titleHi: 'व्यक्तिगत यात्रा योजना',
    titleEn: 'Personalised Yatra Plan',
    descHi: 'आपकी सुविधा अनुसार पूजा, कैब, होटल एवं टूर की कस्टम योजना।',
    descEn: 'Custom puja, cab, hotel and tour plan tailored to your convenience.',
    stat: '1-on-1',
    statLabel: 'Planning',
  },
];

export function WhyUjjainTemple() {
  const { locale } = useI18n();
  const isHi = locale === 'hi';

  return (
    <section className="bg-cream">
      <div className="container-page py-16 sm:py-20">
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-saffron-700 mb-3">
            {isHi ? 'हम क्यों?' : 'Why Us'}
          </p>
          <h2
            className={`font-bold text-maroon ${isHi ? 'font-sanskrit' : 'font-serif'}`}
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.4rem)' }}
          >
            {isHi
              ? 'UjjainTemple.com — आपकी यात्रा का विश्वसनीय साथी'
              : 'UjjainTemple.com — your trusted sacred guide'}
          </h2>
          <div className="mt-3 mx-auto w-14 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>

        {/* Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2 max-w-3xl mx-auto">
          {REASONS.map((r, i) => (
            <div
              key={i}
              className="group relative flex flex-col rounded-2xl bg-white border border-gold/20
                p-7 hover:border-gold/50 hover:shadow-lg transition-all duration-300
                hover:-translate-y-0.5"
            >
              {/* Top accent */}
              <div
                className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl opacity-0
                  group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, transparent, ${r.color}, transparent)` }}
              />

              {/* Icon circle */}
              <div
                className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl
                  group-hover:scale-110 transition-transform duration-300 shadow-sm"
                style={{ background: r.bg, border: `1.5px solid ${r.color}25` }}
              >
                <r.Icon className="h-5 w-5" style={{ color: r.color }} />
              </div>

              {/* Stat (optional) */}
              {r.stat && (
                <div className="mb-3 flex items-baseline gap-1.5">
                  <span
                    className="font-serif font-bold leading-none"
                    style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', color: r.color }}
                  >
                    {r.stat}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink-mute">
                    {r.statLabel}
                  </span>
                </div>
              )}

              <h3
                className={`font-bold text-maroon mb-2 ${isHi ? 'font-sanskrit text-[15px]' : 'font-serif text-[14px]'}`}
              >
                {isHi ? r.titleHi : r.titleEn}
              </h3>
              <p className="text-[12px] leading-[1.75] text-ink-soft">
                {isHi ? r.descHi : r.descEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
