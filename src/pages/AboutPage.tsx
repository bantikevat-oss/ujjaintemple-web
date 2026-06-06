import { Link } from 'react-router-dom';
import { Shield, BookOpen, Users, ArrowRight } from 'lucide-react';
import { Layout } from '../components/global/Layout';
import { SEOHead } from '../components/global/SEOHead';
import { TrustStrip } from '../components/global/TrustStrip';
import { useI18n } from '../i18n';
import { SITE } from '../lib/site';

const COPY = {
  hi: {
    title: 'हमारे बारे में — UjjainTemple.com | ByteFlow Technologies',
    desc: 'UjjainTemple.com के बारे में जानें — उज्जैन का प्रामाणिक द्विभाषी गाइड। ByteFlow Technologies, DPIIT पंजीकृत, Startup India EIR अनुदान प्राप्त।',
    eyebrow: 'परिचय',
    h1: 'UjjainTemple.com के बारे में',
    missionEye: 'हमारा उद्देश्य',
    missionTitle: 'उज्जैन की यात्रा — सरल, प्रामाणिक, द्विभाषी',
    missionP1: 'UjjainTemple.com भारत के सबसे पवित्र नगरों में से एक — उज्जैन — के लिए एक प्रामाणिक, द्विभाषी डिजिटल गाइड है। हमारा लक्ष्य है कि प्रत्येक श्रद्धालु — चाहे वह हिंदी में पढ़े या अंग्रेज़ी में — उज्जैन के मंदिरों, पूजाओं, घाटों और सिंहस्थ महाकुम्भ की प्रामाणिक जानकारी एक ही जगह पाए।',
    missionP2: '182 से अधिक मंदिर, 56 तीर्थ स्थल, 6 पूजाएँ, टूर पैकेज और कैब बुकिंग — यह सब स्थानीय स्रोतों से सत्यापित और नियमित रूप से अद्यतन किया जाता है।',
    govEye: 'सरकारी मान्यता',
    govTitle: 'Startup India EIR — भारत सरकार का प्रथम अनुदान',
    govP: 'ByteFlow Technologies Pvt Ltd — UjjainTemple.com की संचालक कम्पनी — को DPIIT (भारत सरकार) द्वारा Startup India EIR योजना के अंतर्गत प्रथम अनुदान प्राप्त हुआ। यह मान्यता हमारी प्रामाणिकता और डिजिटल धरोहर संरक्षण की प्रतिबद्धता का प्रमाण है।',
    valuesEye: 'हमारे मूल्य',
    values: [
      { title: 'प्रामाणिकता', desc: 'प्रत्येक जानकारी स्थानीय पंडितों, मंदिर प्रशासन और प्राथमिक स्रोतों से सत्यापित।', Icon: Shield },
      { title: 'द्विभाषिता', desc: 'हिंदी और अंग्रेज़ी — दोनों भाषाओं में समान गुणवत्ता की जानकारी। कोई अनुवाद नहीं, मूल लेखन।', Icon: BookOpen },
      { title: 'सेवाभाव', desc: 'श्रद्धालुओं की यात्रा को सुगम बनाना — पूजा बुकिंग से लेकर होटल तक — यही हमारी प्रेरणा।', Icon: Users },
    ],
    teamEye: 'टीम',
    teamTitle: 'ByteFlow Technologies Pvt Ltd',
    teamP: 'हम उज्जैन और मध्य प्रदेश से जुड़े तकनीकी और सांस्कृतिक विशेषज्ञों की एक छोटी टीम हैं। हमारा मानना है कि भारत की आध्यात्मिक विरासत को डिजिटल रूप में संरक्षित करना और उसे सभी तक पहुँचाना इस समय की सबसे आवश्यक ज़िम्मेदारियों में से एक है।',
    ctaEye: 'संपर्क',
    ctaTitle: 'पूजा बुकिंग या यात्रा योजना के लिए',
    ctaWa: 'व्हाट्सऐप पर संपर्क करें',
    ctaContact: 'संपर्क पेज देखें',
  },
  en: {
    title: 'About Us — UjjainTemple.com | ByteFlow Technologies',
    desc: 'Learn about UjjainTemple.com — the authoritative bilingual guide to Ujjain. ByteFlow Technologies, DPIIT registered, Startup India EIR grant recipient.',
    eyebrow: 'About',
    h1: 'About UjjainTemple.com',
    missionEye: 'Our Mission',
    missionTitle: 'Ujjain pilgrimage — simple, authentic, bilingual',
    missionP1: 'UjjainTemple.com is an authoritative, bilingual digital guide to one of India\'s most sacred cities — Ujjain. Our goal: every devotee, whether they read Hindi or English, should find authentic information about Ujjain\'s temples, pujas, ghats and the Simhastha Mahakumbh in one place.',
    missionP2: 'More than 182 temples, 56 tirtha sites, 6 pujas, tour packages and cab booking — all verified from local sources and regularly updated.',
    govEye: 'Government Recognition',
    govTitle: 'Startup India EIR — first grant from Govt of India',
    govP: 'ByteFlow Technologies Pvt Ltd — the entity that operates UjjainTemple.com — received its first grant under the Startup India EIR scheme from DPIIT, Govt of India. This recognition validates our commitment to authenticity and digital heritage preservation.',
    valuesEye: 'Our Values',
    values: [
      { title: 'Authenticity', desc: 'Every piece of information verified from local pandits, temple administration and primary sources.', Icon: Shield },
      { title: 'Bilingualism', desc: 'Hindi and English — equal quality content in both languages. Original writing, not translations.', Icon: BookOpen },
      { title: 'Service', desc: 'Making every pilgrimage smoother — from puja booking to hotels — that is our motivation.', Icon: Users },
    ],
    teamEye: 'Team',
    teamTitle: 'ByteFlow Technologies Pvt Ltd',
    teamP: 'We are a small team of technology and cultural experts connected to Ujjain and Madhya Pradesh. We believe that digitally preserving and making accessible India\'s spiritual heritage is one of the most essential responsibilities of our time.',
    ctaEye: 'Contact',
    ctaTitle: 'For puja booking or travel planning',
    ctaWa: 'Message on WhatsApp',
    ctaContact: 'View Contact Page',
  },
};

export function AboutPage() {
  const { locale } = useI18n();
  const t = COPY[locale];
  const isHi = locale === 'hi';
  const prefix = locale === 'hi' ? '' : '/en';

  return (
    <>
      <SEOHead
        title={t.title}
        description={t.desc}
        path="/about/"
        locale={locale}
      />
      <Layout>
        <TrustStrip variant="thin" />

        {/* Hero */}
        <section
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #4a0606 0%, #1a0202 100%)' }}
        >
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent" />
          <div className="container-page py-16 sm:py-20 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold/70 mb-3">
              {t.eyebrow}
            </p>
            <h1
              className={`font-bold text-white ${isHi ? 'font-sanskrit' : 'font-serif'}`}
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
            >
              {t.h1}
            </h1>
            <div className="mt-4 mx-auto w-14 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />
          </div>
        </section>

        {/* Mission */}
        <section className="bg-white">
          <div className="container-page py-16 sm:py-20">
            <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16 items-start">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-saffron-700 mb-2">
                  {t.missionEye}
                </p>
                <h2 className={`font-bold text-maroon ${isHi ? 'font-sanskrit' : 'font-serif'} text-2xl sm:text-3xl leading-tight`}>
                  {t.missionTitle}
                </h2>
              </div>
              <div className="space-y-5 text-base leading-[1.8] text-ink-soft">
                <p>{t.missionP1}</p>
                <p>{t.missionP2}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-cream">
          <div className="container-page py-16 sm:py-20">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-saffron-700 mb-2">
              {t.valuesEye}
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {t.values.map((v, i) => (
                <div key={i}
                  className="group relative flex flex-col rounded-2xl bg-white border border-gold/20
                    p-7 hover:border-gold/40 hover:shadow-md transition-all duration-300">
                  <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl opacity-0
                    group-hover:opacity-100 transition-opacity duration-300
                    bg-gradient-to-r from-transparent via-maroon/50 to-transparent" />
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-maroon/8 border border-maroon/12">
                    <v.Icon className="h-5 w-5 text-maroon" />
                  </div>
                  <h3 className={`font-bold text-maroon mb-2 ${isHi ? 'font-sanskrit text-base' : 'font-serif text-[15px]'}`}>
                    {v.title}
                  </h3>
                  <p className="text-[13px] leading-[1.75] text-ink-soft">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Govt Recognition */}
        <section className="bg-white">
          <div className="container-page py-16 sm:py-20">
            <div className="grid items-center gap-8 sm:grid-cols-[auto_1fr] sm:gap-12">
              <a href="/images/trust/eir-startup-india.jpg" target="_blank" rel="noopener noreferrer"
                className="block overflow-hidden rounded-xl border border-gold/40 shadow-md
                  transition-transform hover:scale-[1.02] flex-shrink-0">
                <img
                  src="/images/trust/eir-startup-india.jpg"
                  alt="Startup India EIR — ByteFlow Technologies"
                  className="h-auto w-full max-w-[260px]"
                  loading="lazy"
                />
              </a>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-saffron-700 mb-2">
                  {t.govEye}
                </p>
                <h2 className={`font-bold text-maroon mb-4 ${isHi ? 'font-sanskrit text-2xl sm:text-3xl' : 'font-serif text-xl sm:text-2xl'}`}>
                  {t.govTitle}
                </h2>
                <p className="text-sm leading-[1.8] text-ink-soft max-w-xl">{t.govP}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="bg-cream">
          <div className="container-page py-14 sm:py-16 max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-saffron-700 mb-2">
              {t.teamEye}
            </p>
            <h2 className={`font-bold text-maroon mt-1 mb-5 ${isHi ? 'font-sanskrit text-2xl' : 'font-serif text-xl'}`}>
              {t.teamTitle}
            </h2>
            <p className="text-base leading-[1.8] text-ink-soft">{t.teamP}</p>
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: 'radial-gradient(ellipse at 50% 100%, #3a0404 0%, #1a0202 70%)' }}>
          <div className="container-page py-14 sm:py-16 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold/60 mb-3">
              {t.ctaEye}
            </p>
            <h2 className={`font-bold text-white mb-8 ${isHi ? 'font-sanskrit text-2xl sm:text-3xl' : 'font-serif text-xl sm:text-2xl'}`}>
              {t.ctaTitle}
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={`${SITE.whatsapp}?text=${encodeURIComponent(isHi ? 'नमस्ते! मुझे उज्जैन यात्रा में सहायता चाहिए।' : 'Hello! I need help planning my Ujjain trip.')}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-xl bg-[#25D366] px-7 py-3.5
                  font-bold text-white shadow-[0_4px_20px_rgba(37,211,102,0.4)]
                  hover:-translate-y-0.5 transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {t.ctaWa}
              </a>
              <Link to={`${prefix}/contact/`}
                className="inline-flex items-center gap-2 rounded-xl border border-white/25
                  bg-white/10 px-7 py-3.5 font-semibold text-white
                  hover:bg-white/18 hover:-translate-y-0.5 transition-all duration-200">
                {t.ctaContact} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
