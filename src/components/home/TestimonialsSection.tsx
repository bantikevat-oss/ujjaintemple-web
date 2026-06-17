import { useI18n } from '../../i18n';

const TESTIMONIALS = [
  {
    nameHi: 'राजेश शर्मा',
    nameEn: 'Rajesh Sharma',
    cityHi: 'दिल्ली',
    cityEn: 'Delhi',
    dateHi: 'मार्च 2025',
    dateEn: 'Mar 2025',
    textHi: 'काल सर्प दोष पूजा के बाद जीवन में सकारात्मक बदलाव आया। यहाँ के पंडित जी अत्यंत अनुभवी और विनम्र हैं। UjjainTemple.com के माध्यम से पूजा बुकिंग बहुत आसान रही।',
    textEn: 'After the Kaal Sarp Dosh puja, there was a noticeable positive change in my life. The pandits here are highly experienced. Booking through UjjainTemple.com was very convenient.',
    initials: 'RS',
    color: '#8B0000',
  },
  {
    nameHi: 'प्रिया पटेल',
    nameEn: 'Priya Patel',
    cityHi: 'मुम्बई',
    cityEn: 'Mumbai',
    dateHi: 'जनवरी 2025',
    dateEn: 'Jan 2025',
    textHi: 'महाकालेश्वर में मंगल दोष निवारण पूजा करवाई। पूरी व्यवस्था अद्भुत थी। वेबसाइट पर मिली जानकारी एकदम सटीक — मंदिर का समय, पूजा सामग्री, सब कुछ।',
    textEn: 'Got Mangal Dosh Nivaran puja done at Mahakaleshwar. All information on the website was accurate — temple timings, puja samagri, everything matched reality.',
    initials: 'PP',
    color: '#5c3a00',
  },
  {
    nameHi: 'अमित गुप्ता',
    nameEn: 'Amit Gupta',
    cityHi: 'पुणे',
    cityEn: 'Pune',
    dateHi: 'फरवरी 2025',
    dateEn: 'Feb 2025',
    textHi: 'परिवार के साथ उज्जैन दर्शन के लिए आए। 56 तीर्थ स्थलों की जानकारी एक जगह मिली। महामृत्युंजय पूजा भी करवाई — बेहद भावपूर्ण अनुभव।',
    textEn: 'Came to Ujjain with family for darshan. Found info on all 56 tirthas in one place. Also got Mahamrityunjaya puja done — deeply moving experience.',
    initials: 'AG',
    color: '#1a3a5c',
  },
  {
    nameHi: 'सुनीता वर्मा',
    nameEn: 'Sunita Verma',
    cityHi: 'इंदौर',
    cityEn: 'Indore',
    dateHi: 'अप्रैल 2025',
    dateEn: 'Apr 2025',
    textHi: 'नवग्रह शांति पूजा बुक की। पंडित जी ने पूरी पूजा विधि समझाई। सिंहस्थ 2028 की जानकारी भी इस साइट पर सबसे विस्तृत मिली।',
    textEn: 'Booked Navgrah Shanti puja. The pandit explained the entire vidhi. Also found the most detailed Simhastha 2028 information on this site.',
    initials: 'SV',
    color: '#2d5a1e',
  },
  {
    nameHi: 'विकास सिंह',
    nameEn: 'Vikas Singh',
    cityHi: 'भोपाल',
    cityEn: 'Bhopal',
    dateHi: 'दिसम्बर 2024',
    dateEn: 'Dec 2024',
    textHi: 'पितृ दोष निवारण के लिए उज्जैन आए। UjjainTemple.com पर शोध करके आए थे। जो जानकारी साइट पर थी, वही ज़मीन पर भी मिली — इससे बड़ा भरोसा क्या होगा।',
    textEn: 'Came for Pitru Dosh Nivaran. Researched on UjjainTemple.com beforehand. Everything on the site matched ground reality — no greater trust than that.',
    initials: 'VS',
    color: '#4a3500',
  },
  {
    nameHi: 'मीना त्रिपाठी',
    nameEn: 'Meena Tripathi',
    cityHi: 'लखनऊ',
    cityEn: 'Lucknow',
    dateHi: 'मई 2025',
    dateEn: 'May 2025',
    textHi: 'हिंदी में इतनी विस्तृत और प्रामाणिक जानकारी मिलना दुर्लभ है। उज्जैन जाने से पहले इस वेबसाइट को ज़रूर पढ़ें — यात्रा बहुत सुगम हो जाती है।',
    textEn: 'Detailed and authentic information in Hindi is rare. Must read this website before visiting Ujjain — it makes the journey so much smoother.',
    initials: 'MT',
    color: '#6B0000',
  },
];

function StarRow() {
  return (
    <div className="flex gap-0.5" aria-label="5 stars">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-gold text-gold">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const { locale } = useI18n();
  const isHi = locale === 'hi';

  return (
    <section style={{ background: 'linear-gradient(to bottom, #fff 0%, #fdf8f0 100%)' }}>
      <div className="container-page py-16 sm:py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-saffron-700 mb-3">
            {isHi ? 'श्रद्धालुओं की राय' : 'Pilgrim Testimonials'}
          </p>
          <h2
            className={`font-bold text-maroon ${isHi ? 'font-sanskrit' : 'font-serif'}`}
            style={{ fontSize: 'clamp(1.6rem, 3vw, 2.6rem)' }}
          >
            {isHi ? 'जिन्होंने अनुभव किया, वे बोलते हैं' : 'Those who experienced it, speak'}
          </h2>
          <div className="mt-3 mx-auto w-14 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>

        {/* Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="group relative flex flex-col rounded-2xl border border-gold/20
                bg-white p-7 shadow-sm hover:shadow-lg hover:border-gold/40
                transition-all duration-300 hover:-translate-y-0.5"
            >
              {/* Gold top line */}
              <div
                className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl opacity-40
                  group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, transparent, ${t.color}, transparent)` }}
              />

              {/* Big quote mark */}
              <div
                className="mb-3 font-serif leading-none select-none"
                style={{ fontSize: '4rem', color: t.color, opacity: 0.12 }}
              >
                "
              </div>

              {/* Text */}
              <p
                className={`flex-1 leading-[1.85] text-ink-soft mb-6
                  ${isHi ? 'font-sanskrit text-[13px]' : 'text-sm'}`}
              >
                {isHi ? t.textHi : t.textEn}
              </p>

              {/* Stars */}
              <StarRow />

              {/* Author */}
              <div className="mt-4 flex items-center gap-3">
                <div
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center
                    rounded-full text-[11px] font-bold text-white shadow-sm"
                  style={{ background: t.color }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className={`text-sm font-bold text-ink ${isHi ? 'font-sanskrit' : 'font-serif'}`}>
                    {isHi ? t.nameHi : t.nameEn}
                  </p>
                  <p className="text-[11px] text-ink-mute">
                    {isHi ? t.cityHi : t.cityEn}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="mt-10 text-center text-[11px] text-ink-mute/60 italic max-w-xl mx-auto leading-relaxed">
          {isHi
            ? 'ये अनुभव श्रद्धालुजनों ने स्वेच्छा से share किए हैं। परिणाम व्यक्तिगत रूप से अलग हो सकते हैं।'
            : 'These experiences have been voluntarily shared by devotees. Individual results may vary.'}
        </p>
      </div>
    </section>
  );
}

