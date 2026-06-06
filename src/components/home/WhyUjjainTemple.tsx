import { useI18n } from '../../i18n';
import { Shield, BookOpen, Users, MapPin } from 'lucide-react';

const REASONS = [
  {
    Icon: Shield,
    color: '#8B0000',
    bg: 'rgba(139,0,0,0.08)',
    titleHi: 'सरकार-मान्यता प्राप्त',
    titleEn: 'Government Recognised',
    descHi: 'Startup India EIR योजना के अंतर्गत भारत सरकार द्वारा प्रमाणित। DPIIT पंजीकृत।',
    descEn: 'Recognised under Startup India EIR — Govt of India. DPIIT registered.',
    stat: 'DPIIT',
    statLabel: 'Registered',
  },
  {
    Icon: BookOpen,
    color: '#5c3a00',
    bg: 'rgba(92,58,0,0.08)',
    titleHi: 'द्विभाषी प्रामाणिक जानकारी',
    titleEn: 'Bilingual Authoritative Content',
    descHi: '182+ मंदिर · 56+ तीर्थ — हिंदी और अंग्रेज़ी में स्थानीय स्रोतों से सत्यापित।',
    descEn: '182+ temples · 56+ tirthas — verified from local sources in Hindi & English.',
    stat: '182+',
    statLabel: 'Temples',
  },
  {
    Icon: Users,
    color: '#1a3a5c',
    bg: 'rgba(26,58,92,0.08)',
    titleHi: 'अनुभवी पंडित',
    titleEn: 'Expert Pandits',
    descHi: 'महाकालेश्वर मंदिर के पंजीकृत पंडित। सभी पूजाएँ शास्त्रसम्मत विधि से।',
    descEn: 'Registered pandits of Mahakaleshwar temple. All pujas as per Shastra.',
    stat: '6+',
    statLabel: 'Pujas',
  },
  {
    Icon: MapPin,
    color: '#2d5a1e',
    bg: 'rgba(45,90,30,0.08)',
    titleHi: 'सम्पूर्ण यात्रा मार्गदर्शन',
    titleEn: 'Complete Travel Guide',
    descHi: 'कैब · होटल · टूर पैकेज · परिवहन — एक ही जगह, बिना किसी छुपे शुल्क के।',
    descEn: 'Cab · Hotels · Tour packages · Transport — one place, no hidden charges.',
    stat: '2028',
    statLabel: 'Simhastha',
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
              ? 'UjjainTemple.com — आपकी पूजा यात्रा का विश्वसनीय साथी'
              : 'UjjainTemple.com — your trusted sacred guide'}
          </h2>
          <div className="mt-3 mx-auto w-14 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>

        {/* Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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

              {/* Stat */}
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
