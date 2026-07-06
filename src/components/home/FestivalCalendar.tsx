import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n';
import { ArrowRight } from 'lucide-react';

const FESTIVALS = [
  {
    nameHi: 'महाशिवरात्रि',
    nameEn: 'Mahashivratri',
    dateHi: '26 फरवरी 2026',
    dateEn: '26 Feb 2026',
    monthShort: 'FEB',
    day: '26',
    tithiHi: 'फाल्गुन कृष्ण चतुर्दशी',
    tithiEn: 'Phalgun Krishna Chaturdashi',
    descHi: 'महाकालेश्वर का सबसे बड़ा उत्सव — रात्रि जागरण, भस्म आरती और चार पहर पूजा',
    descEn: 'The grandest festival at Mahakaleshwar — overnight vigil, Bhasma Aarti and four-prahar puja',
    color: '#8B0000',
    major: true,
  },
  {
    nameHi: 'रंगपंचमी',
    nameEn: 'Rang Panchami',
    dateHi: '13 मार्च 2026',
    dateEn: '13 Mar 2026',
    monthShort: 'MAR',
    day: '13',
    tithiHi: 'फाल्गुन कृष्ण पंचमी',
    tithiEn: 'Phalgun Krishna Panchami',
    descHi: 'उज्जैन की विशेष होली परम्परा — पूरा शहर गुलाल और रंगों में नहाता है',
    descEn: "Ujjain's unique Holi tradition — the entire city bathes in gulal and colours",
    color: '#b34500',
    major: false,
  },
  {
    nameHi: 'नवरात्रि (चैत्र)',
    nameEn: 'Chaitra Navratri',
    dateHi: '19 मार्च 2026',
    dateEn: '19 Mar 2026',
    monthShort: 'MAR',
    day: '19',
    tithiHi: 'चैत्र शुक्ल प्रतिपदा',
    tithiEn: 'Chaitra Shukla Pratipada',
    descHi: 'हरसिद्धि माता और गढ़कालिका मंदिर में नौ दिन का महाउत्सव — विशेष अखंड ज्योत',
    descEn: 'Nine-day grand festival at Harsiddhi Mata and Gadh Kalika temple — special Akhand Jyot',
    color: '#5c3a00',
    major: false,
  },
  {
    nameHi: 'श्रावण माह',
    nameEn: 'Shravan Month',
    dateHi: '17 जुलाई – 19 अगस्त 2026',
    dateEn: '17 Jul – 19 Aug 2026',
    monthShort: 'JUL',
    day: '17',
    tithiHi: 'भगवान महाकाल का प्रिय माह',
    tithiEn: "Lord Mahakal's most beloved month",
    descHi: 'प्रतिदिन भस्म आरती में लाखों श्रद्धालु — प्रत्येक सोमवार विशेष दर्शन',
    descEn: 'Lakhs of devotees at Bhasma Aarti daily — special Monday darshan each week',
    color: '#1a3a5c',
    major: true,
  },
];

export function FestivalCalendar() {
  const { locale } = useI18n();
  const isHi = locale === 'hi';
  const prefix = locale === 'en' ? '' : '/hi';

  return (
    <section className="bg-white">
      <div className="container-page py-16 sm:py-20">
        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-saffron-700 mb-2">
              {isHi ? 'पर्व · त्यौहार · उत्सव' : 'Festivals & Sacred Events'}
            </p>
            <h2
              className={`font-bold text-maroon ${isHi ? 'font-sanskrit' : 'font-serif'}`}
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.4rem)' }}
            >
              {isHi ? 'उज्जैन पर्व कैलेंडर 2026' : 'Ujjain Festival Calendar 2026'}
            </h2>
          </div>
          <Link
            to={`${prefix}/simhastha-2028/`}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold
              text-maroon underline-offset-4 hover:underline"
          >
            {isHi ? 'सिंहस्थ 2028 कैलेंडर देखें' : 'View Simhastha 2028 Calendar'}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Festival list */}
        <div className="space-y-4">
          {FESTIVALS.map((f, i) => (
            <div
              key={i}
              className="group flex items-start gap-4 sm:gap-6 rounded-2xl border border-gold/20
                bg-cream/50 p-5 sm:p-6 hover:border-gold/40 hover:bg-cream
                transition-all duration-200 hover:shadow-sm"
            >
              {/* Date badge */}
              <div
                className="flex-shrink-0 flex flex-col items-center justify-center
                  w-14 h-14 rounded-xl text-white shadow-sm"
                style={{ background: f.color }}
              >
                <span className="text-[9px] font-bold uppercase tracking-wider opacity-80 leading-none mb-0.5">
                  {f.monthShort}
                </span>
                <span className="text-xl font-bold leading-none">{f.day}</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 flex-wrap">
                  <h3
                    className={`font-bold text-maroon ${isHi ? 'font-sanskrit text-base' : 'font-serif text-[15px]'}`}
                  >
                    {isHi ? f.nameHi : f.nameEn}
                  </h3>
                  {f.major && (
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-bold
                        uppercase tracking-wider"
                      style={{ background: `${f.color}15`, color: f.color }}
                    >
                      {isHi ? 'मुख्य पर्व' : 'MAJOR'}
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-medium mt-0.5 mb-2" style={{ color: `${f.color}cc` }}>
                  {isHi ? f.tithiHi : f.tithiEn} · {isHi ? f.dateHi : f.dateEn}
                </p>
                <p className="text-sm text-ink-soft leading-relaxed">
                  {isHi ? f.descHi : f.descEn}
                </p>
              </div>

              {/* Arrow */}
              <ArrowRight
                className="flex-shrink-0 mt-1 h-4 w-4 text-gold/30
                  group-hover:text-gold/60 group-hover:translate-x-0.5
                  transition-all duration-200 hidden sm:block"
              />
            </div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 sm:hidden text-center">
          <Link
            to={`${prefix}/simhastha-2028/`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-maroon"
          >
            {isHi ? 'सिंहस्थ 2028 कैलेंडर' : 'View Simhastha 2028 Calendar'}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
