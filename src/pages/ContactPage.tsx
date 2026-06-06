import { Phone, Mail, MapPin, MessageCircle, Clock, ArrowRight } from 'lucide-react';
import { Layout } from '../components/global/Layout';
import { SEOHead } from '../components/global/SEOHead';
import { TrustStrip } from '../components/global/TrustStrip';
import { LeadForm } from '../components/global/LeadForm';
import { useI18n } from '../i18n';
import { SITE } from '../lib/site';

const COPY = {
  hi: {
    title: 'संपर्क करें — UjjainTemple.com | पूजा बुकिंग · उज्जैन',
    desc: 'UjjainTemple.com से संपर्क करें। पूजा बुकिंग, मंदिर जानकारी, टूर पैकेज और कैब बुकिंग के लिए व्हाट्सऐप, फोन या ईमेल पर संपर्क करें।',
    eyebrow: 'हमसे बात करें',
    h1: 'संपर्क करें',
    sub: 'पूजा बुकिंग · मंदिर जानकारी · टूर पैकेज · कैब',
    waTitle: 'व्हाट्सऐप पर संपर्क करें',
    waDesc: 'सबसे तेज़ जवाब व्हाट्सऐप पर मिलता है। पूजा बुकिंग के लिए यही सबसे आसान तरीका है।',
    waCta: 'व्हाट्सऐप पर लिखें',
    phoneTitle: 'फोन करें',
    phoneDesc: 'सोमवार से शनिवार, सुबह 8 बजे से रात 9 बजे तक।',
    emailTitle: 'ईमेल भेजें',
    emailDesc: 'विस्तृत प्रश्नों और दस्तावेज़ों के लिए ईमेल करें। 24 घंटे में जवाब मिलेगा।',
    addressTitle: 'पता',
    addressLine: 'उज्जैन, मध्य प्रदेश — 456001',
    hoursTitle: 'सेवा समय',
    hours: [
      { day: 'सोमवार – शनिवार', time: 'सुबह 8:00 – रात 9:00' },
      { day: 'रविवार', time: 'सुबह 9:00 – शाम 6:00' },
      { day: 'पूजा बुकिंग व्हाट्सऐप', time: 'सातों दिन 24×7' },
    ],
    faqTitle: 'अक्सर पूछे जाने वाले प्रश्न',
    faqs: [
      { q: 'पूजा बुकिंग कितने दिन पहले करनी चाहिए?', a: 'सामान्य दिनों में 3-5 दिन, श्रावण और महाशिवरात्रि के लिए 2-3 सप्ताह पहले बुकिंग करें।' },
      { q: 'क्या ऑनलाइन पेमेंट होता है?', a: 'हाँ — UPI, नेट बैंकिंग और कार्ड से भुगतान स्वीकार होता है। WhatsApp पर details मिलेंगे।' },
      { q: 'टूर पैकेज में क्या-क्या शामिल है?', a: 'होटल, कैब, गाइड, मंदिर दर्शन और भोजन — सभी विकल्प हमारे टूर पेज पर देखें।' },
    ],
  },
  en: {
    title: 'Contact Us — UjjainTemple.com | Puja Booking · Ujjain',
    desc: 'Contact UjjainTemple.com for puja booking, temple information, tour packages and cab booking. Reach us on WhatsApp, phone or email.',
    eyebrow: 'Talk to us',
    h1: 'Contact Us',
    sub: 'Puja Booking · Temple Info · Tour Packages · Cab',
    waTitle: 'WhatsApp Us',
    waDesc: 'Fastest response on WhatsApp. The easiest way to book a puja or plan your visit.',
    waCta: 'Message on WhatsApp',
    phoneTitle: 'Call Us',
    phoneDesc: 'Monday to Saturday, 8 AM to 9 PM IST.',
    emailTitle: 'Email Us',
    emailDesc: 'For detailed queries and documents. Response within 24 hours.',
    addressTitle: 'Address',
    addressLine: 'Ujjain, Madhya Pradesh — 456001',
    hoursTitle: 'Service Hours',
    hours: [
      { day: 'Monday – Saturday', time: '8:00 AM – 9:00 PM' },
      { day: 'Sunday', time: '9:00 AM – 6:00 PM' },
      { day: 'Puja Booking WhatsApp', time: '24×7 all days' },
    ],
    faqTitle: 'Frequently Asked Questions',
    faqs: [
      { q: 'How far in advance should I book a puja?', a: 'For regular days, 3-5 days in advance. For Shravan month and Mahashivratri, book 2-3 weeks ahead.' },
      { q: 'Is online payment accepted?', a: 'Yes — UPI, net banking and cards are accepted. Details will be shared on WhatsApp.' },
      { q: 'What is included in tour packages?', a: 'Hotel, cab, guide, temple visits and meals — all options are available on our Tours page.' },
    ],
  },
};

export function ContactPage() {
  const { locale } = useI18n();
  const t = COPY[locale];
  const isHi = locale === 'hi';

  return (
    <>
      <SEOHead
        title={t.title}
        description={t.desc}
        path="/contact/"
        locale={locale}
      />
      <Layout>
        <TrustStrip variant="thin" />

        {/* Hero */}
        <section
          className="relative"
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
            <p className="mt-3 text-sm text-white/60">{t.sub}</p>
            <div className="mt-4 mx-auto w-14 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        </section>

        {/* Contact cards */}
        <section className="bg-cream">
          <div className="container-page py-16 sm:py-20">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {/* WhatsApp — primary */}
              <div className="lg:col-span-2 group relative flex flex-col rounded-2xl border-2 border-[#25D366]/40
                bg-white p-8 hover:border-[#25D366]/70 hover:shadow-lg transition-all duration-300">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl
                  bg-[#25D366]/10 border border-[#25D366]/20">
                  <MessageCircle className="h-6 w-6 text-[#25D366]" />
                </div>
                <h2 className={`font-bold text-maroon mb-2 ${isHi ? 'font-sanskrit text-lg' : 'font-serif text-[17px]'}`}>
                  {t.waTitle}
                </h2>
                <p className="text-sm text-ink-soft mb-6 leading-relaxed flex-1">{t.waDesc}</p>
                <a
                  href={`${SITE.whatsapp}?text=${encodeURIComponent(isHi ? 'नमस्ते! मुझे उज्जैन पूजा/यात्रा के बारे में जानकारी चाहिए।' : 'Hello! I need information about Ujjain puja/travel.')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-xl bg-[#25D366] px-6 py-3.5
                    font-bold text-white text-sm w-fit
                    shadow-[0_4px_20px_rgba(37,211,102,0.35)]
                    hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(37,211,102,0.5)]
                    transition-all duration-200"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {t.waCta}
                </a>
              </div>

              {/* Phone */}
              <div className="group relative flex flex-col rounded-2xl border border-gold/20
                bg-white p-7 hover:border-gold/40 hover:shadow-md transition-all duration-300">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl
                  bg-maroon/8 border border-maroon/15">
                  <Phone className="h-5 w-5 text-maroon" />
                </div>
                <h2 className={`font-bold text-maroon mb-2 ${isHi ? 'font-sanskrit text-base' : 'font-serif text-[15px]'}`}>
                  {t.phoneTitle}
                </h2>
                <p className="text-xs text-ink-mute mb-4">{t.phoneDesc}</p>
                <a href={SITE.phoneTel}
                  className="inline-flex items-center gap-1.5 font-bold text-maroon text-sm
                    hover:text-maroon-700 transition-colors mt-auto">
                  {SITE.phone}
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* Email */}
              <div className="group relative flex flex-col rounded-2xl border border-gold/20
                bg-white p-7 hover:border-gold/40 hover:shadow-md transition-all duration-300">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl
                  bg-maroon/8 border border-maroon/15">
                  <Mail className="h-5 w-5 text-maroon" />
                </div>
                <h2 className={`font-bold text-maroon mb-2 ${isHi ? 'font-sanskrit text-base' : 'font-serif text-[15px]'}`}>
                  {t.emailTitle}
                </h2>
                <p className="text-xs text-ink-mute mb-4">{t.emailDesc}</p>
                <a href={`mailto:${SITE.email}`}
                  className="inline-flex items-center gap-1.5 font-bold text-maroon text-sm
                    hover:text-maroon-700 transition-colors mt-auto break-all">
                  {SITE.email}
                  <ArrowRight className="h-3.5 w-3.5 flex-shrink-0" />
                </a>
              </div>
            </div>

            {/* Address + Hours row */}
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="flex items-start gap-4 rounded-2xl border border-gold/20 bg-white p-7">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-maroon/8">
                  <MapPin className="h-5 w-5 text-maroon" />
                </div>
                <div>
                  <h3 className={`font-bold text-maroon mb-1 ${isHi ? 'font-sanskrit' : 'font-serif'}`}>
                    {t.addressTitle}
                  </h3>
                  <p className="text-sm text-ink-soft">{t.addressLine}</p>
                  <p className="text-xs text-ink-mute mt-0.5">ByteFlow Technologies Pvt Ltd · DPIIT Registered</p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-2xl border border-gold/20 bg-white p-7">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-maroon/8">
                  <Clock className="h-5 w-5 text-maroon" />
                </div>
                <div>
                  <h3 className={`font-bold text-maroon mb-2 ${isHi ? 'font-sanskrit' : 'font-serif'}`}>
                    {t.hoursTitle}
                  </h3>
                  <ul className="space-y-1">
                    {t.hours.map((h, i) => (
                      <li key={i} className="flex items-center justify-between gap-4 text-xs">
                        <span className="text-ink-soft">{h.day}</span>
                        <span className="font-semibold text-maroon whitespace-nowrap">{h.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Lead Form */}
        <section className="bg-cream-dark/30 border-y border-cream-dark">
          <div className="container-page py-12 sm:py-16">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-700 mb-2">
                  {isHi ? 'यात्रा सहायता' : 'Trip Assistance'}
                </p>
                <h2 className={`font-bold text-maroon leading-tight ${isHi ? 'font-sanskrit text-3xl sm:text-4xl' : 'font-serif text-2xl sm:text-3xl'}`}>
                  {isHi ? 'अपनी यात्रा की\nजानकारी भेजें' : 'Send Your\nTrip Details'}
                </h2>
                <p className="mt-3 text-base text-ink-soft leading-relaxed">
                  {isHi
                    ? 'होटल, कैब, पूजा बुकिंग, टूर पैकेज — सब कुछ एक फ़ॉर्म में भरें। हमारी टीम 2 घंटे में संपर्क करेगी।'
                    : 'Hotel, cab, puja booking, tour packages — fill one form for everything. Our team will contact you within 2 hours.'}
                </p>
                <ul className="mt-5 space-y-2">
                  {(isHi
                    ? ['₹0 बुकिंग शुल्क — पूरी तरह मुफ्त', 'सत्यापित होटल व पंडित', '12+ वर्षों का अनुभव']
                    : ['₹0 booking fee — completely free', 'Verified hotels & pandits', '12+ years of experience']
                  ).map((pt, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-ink-soft">
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gold/20 text-xs font-bold text-gold-700">✓</span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <LeadForm defaultService="darshanPlan" sourcePage="contact" />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white">
          <div className="container-page py-16 sm:py-20 max-w-3xl">
            <h2 className={`font-bold text-maroon mb-8 ${isHi ? 'font-sanskrit text-2xl' : 'font-serif text-2xl'}`}>
              {t.faqTitle}
            </h2>
            <div className="space-y-4">
              {t.faqs.map((faq, i) => (
                <div key={i} className="rounded-2xl border border-gold/20 bg-cream p-6">
                  <h3 className={`font-bold text-maroon mb-2 ${isHi ? 'font-sanskrit text-base' : 'font-serif text-[15px]'}`}>
                    {faq.q}
                  </h3>
                  <p className="text-sm leading-relaxed text-ink-soft">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
