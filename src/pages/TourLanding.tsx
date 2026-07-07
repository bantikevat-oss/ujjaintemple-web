import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/global/Layout';
import { SEOHead } from '../components/global/SEOHead';
import { GlobalLeadSection } from '../components/global/GlobalLeadSection';
import { Breadcrumb } from '../components/global/Breadcrumb';
import { useI18n } from '../i18n';
import { articlesByCategory, articlePath } from '../data/articles';
import { SITE } from '../lib/site';
import { breadcrumbSchema } from '../lib/schemas';
import { PhoneCall, ChevronDown, CheckCircle2 } from 'lucide-react';
import { packagesData } from '../data/packages';

export function TourLanding() {
  const { locale } = useI18n();
  const prefix = locale === 'en' ? '' : '/hi';
  const articles = articlesByCategory('blog').slice(0, 3); // For News Feed

  const title = locale === 'hi' ? 'उज्जैन टूर पैकेज — उज्जैन दर्शन पैकेज, टूर एंड ट्रैवल ऑपरेटर' : 'Ujjain Tour Packages — Darshan Packages, Tour and Travel in Ujjain';
  const description = locale === 'hi'
    ? 'उज्जैन टूर पैकेज — उज्जैन दर्शन पैकेज (1/2/3 दिन), महाकाल दर्शन, ओंकारेश्वर व सिंहस्थ 2028 यात्रा। भरोसेमंद उज्जैन टूर एंड ट्रैवल ऑपरेटर। बुकिंग: +91 74007 24456'
    : 'Ujjain tour packages — Ujjain darshan packages (1/2/3 day), Mahakal darshan, Omkareshwar & Simhastha 2028 trips. Trusted tour and travel operator in Ujjain. Book: +91 74007 24456';
  const path = '/tour-and-travel-ujjain/';

  const [openFaq, setOpenFaq] = useState<number>(0);

  const faqs = [
    {
      q: locale === 'hi' ? 'उज्जैन घूमने के लिए कितने दिन पर्याप्त हैं?' : 'How many days are enough for Ujjain?',
      a: locale === 'hi'
        ? 'उज्जैन के प्रमुख आकर्षणों (महाकालेश्वर, काल भैरव, हरसिद्धि मंदिर आदि) के दर्शन के लिए 1 से 2 दिन पर्याप्त हैं। यदि आप ओंकारेश्वर या मांडू भी जाना चाहते हैं, तो 3-4 दिन लग सकते हैं।'
        : 'Typically, 1 to 2 days are sufficient to visit the major attractions in Ujjain, including the Mahakaleshwar Temple, Kal Bhairav Temple, Harsiddhi Temple, and Ram Ghat. However, if you want to explore the city at a leisurely pace and also visit nearby places like Omkareshwar or Mandu, you might need 3 to 4 days.'
    },
    {
      q: locale === 'hi' ? 'उज्जैन घूमने का सबसे अच्छा समय कौन सा है?' : 'What is the best time to visit Ujjain?',
      a: locale === 'hi'
        ? 'अक्टूबर से मार्च तक का समय उज्जैन घूमने के लिए सबसे अच्छा है जब मौसम सुहावना होता है। गर्मियां (अप्रैल-जून) बहुत गर्म हो सकती हैं।'
        : 'The best time to visit Ujjain is from October to March when the weather is pleasant and cool, making it ideal for sightseeing and temple visits. Summers (April to June) can be extremely hot, while the monsoon season (July to September) brings moderate to heavy rainfall.'
    },
    {
      q: locale === 'hi' ? 'उज्जैन कैसे पहुंचें?' : 'How to reach Ujjain?',
      a: locale === 'hi'
        ? 'निकटतम हवाई अड्डा इंदौर (55 किमी) है। उज्जैन रेलवे जंक्शन देश भर से अच्छी तरह जुड़ा हुआ है। इसके अलावा आस-पास के शहरों से बस सेवाएं भी उपलब्ध हैं।'
        : 'Ujjain is well-connected by road, rail, and air. The nearest airport is Devi Ahilya Bai Holkar Airport in Indore, which is about 55 km away. Ujjain Junction is a major railway station connected to various cities across India. Regular buses also operate from nearby cities like Indore, Bhopal, and Ahmedabad.'
    },
    {
      q: locale === 'hi' ? 'उज्जैन में स्थानीय परिवहन के साधन क्या हैं?' : 'What are the local modes of transport in Ujjain?',
      a: locale === 'hi'
        ? 'स्थानीय यात्रा के लिए ऑटो-रिक्शा, ई-रिक्शा और टैक्सी आसानी से उपलब्ध हैं। मंदिरों के दर्शन के लिए ऑटो-रिक्शा सबसे सुविधाजनक साधन हैं।'
        : 'Local transport in Ujjain includes auto-rickshaws, cycle rickshaws, e-rickshaws, and local buses. Taxis and cabs are also available for hire. Auto-rickshaws are the most convenient and popular mode of transport for short distances and temple hopping.'
    }
  ];

  const attractions = [
    { 
      title: locale === 'hi' ? 'श्री महाकालेश्वर मंदिर' : 'Shree Mahakaleshwar Temple', 
      desc: locale === 'hi' ? 'यह भगवान शिव के 12 ज्योतिर्लिंगों में से एक है। भगवान का आशीर्वाद लेने के लिए वर्ष भर लाखों भक्त यहां आते हैं।' : 'Ujjain is home to one of the 12 Jyotirlingas of Lord Shiva. Millions of devotees visit this temple throughout the year to seek the blessings of the Lord.' 
    },
    { 
      title: locale === 'hi' ? 'काल भैरव मंदिर' : 'Kal Bhairav Temple', 
      desc: locale === 'hi' ? 'यह क्षिप्रा नदी के तट पर स्थित है। यहाँ भगवान को प्रसाद के रूप में मदिरा चढ़ाई जाती है, जो एक अनूठी परंपरा है।' : 'It is dedicated to Kal Bhairav, the fierce manifestation of Lord Shiva, and is located on the banks of the Shipra River. Devotees offer liquor to the deity here as a prasad, which is a unique ritual.' 
    },
    { 
      title: locale === 'hi' ? 'हरसिद्धि मंदिर' : 'Harsiddhi Temple', 
      desc: locale === 'hi' ? 'यह 51 शक्तिपीठों में से एक है। यह मंदिर दीपकों से सजे अपने दो ऊंचे स्तंभों के लिए प्रसिद्ध है, जो नवरात्रि के दौरान जगमगाते हैं।' : 'It is one of the 51 Shaktipeeths and is dedicated to Goddess Annapurna. The temple is known for its two tall pillars adorned with lamps that are lit during the Navratri festival, creating a spectacular sight.' 
    },
    { 
      title: locale === 'hi' ? 'चिंतामण गणेश मंदिर' : 'Chintaman Ganesh Temple', 
      desc: locale === 'hi' ? 'भगवान गणेश को समर्पित यह प्राचीन मंदिर माना जाता है कि भगवान राम द्वारा स्थापित किया गया था।' : 'This ancient temple is dedicated to Lord Ganesha and is believed to have been established by Lord Rama himself. Devotees visit here to seek the blessings of Lord Ganesha for peace and prosperity.' 
    },
    { 
      title: locale === 'hi' ? 'संदीपनि आश्रम' : 'Sandipani Ashram', 
      desc: locale === 'hi' ? 'यह एक प्राचीन आश्रम है जहाँ भगवान कृष्ण, बलराम और सुदामा ने गुरु संदीपनि से शिक्षा प्राप्त की थी।' : 'It is an ancient ashram where Lord Krishna, along with his brother Balarama and friend Sudama, received their education from Guru Sandipani. The ashram has a temple dedicated to Lord Shiva and a holy tank called Gomti Kund.' 
    },
    { 
      title: locale === 'hi' ? 'जंतर मंतर' : 'Vedh Shala (Jantar Mantar)', 
      desc: locale === 'hi' ? 'यह महाराजा जय सिंह द्वारा बनाई गई एक प्राचीन वेधशाला है, जिसमें समय और ग्रहों को मापने के यंत्र हैं।' : 'It is an astronomical observatory built by Maharaja Jai Singh II of Jaipur in the 17th century. It features various astronomical instruments used for measuring time, observing planetary positions, and predicting eclipses.' 
    },
  ];

  const festivals = [
    {
      title: locale === 'hi' ? 'कुंभ मेला (सिंहस्थ):' : 'Kumbh Mela (Simhastha):',
      desc: locale === 'hi' ? 'उज्जैन में हर 12 साल में सिंहस्थ कुंभ मेला लगता है, जिसमें दुनिया भर से लाखों श्रद्धालु क्षिप्रा नदी में पवित्र स्नान करने आते हैं।' : 'Ujjain hosts the Kumbh Mela once every 12 years, attracting millions of pilgrims from all over the world who gather to take a holy dip in the Shipra River.'
    },
    {
      title: locale === 'hi' ? 'महाशिवरात्रि:' : 'Mahashivratri:',
      desc: locale === 'hi' ? 'इसे उज्जैन में बड़े हर्षोल्लास के साथ मनाया जाता है। विशेष रूप से महाकालेश्वर मंदिर में भव्य आयोजन होते हैं।' : 'It is celebrated with great fervour in Ujjain, especially at the Mahakaleshwar Temple. Devotees offer prayers, perform pujas, and participate in grand processions to honor Lord Shiva.'
    },
    {
      title: locale === 'hi' ? 'नवरात्रि:' : 'Navratri:',
      desc: locale === 'hi' ? 'नवरात्रि का पर्व हरसिद्धि माता मंदिर और शहर के अन्य देवी मंदिरों में बहुत श्रद्धा और उत्साह के साथ मनाया जाता है।' : 'The festival of Navratri is celebrated with devotion and enthusiasm, particularly at the Harsiddhi Temple and other Devi temples in the city.'
    }
  ];

  return (
    <>
      <SEOHead
        title={`${title} | UjjainTemple — ${SITE.phone}`}
        description={description}
        path={path}
        locale={locale}
        schemas={[breadcrumbSchema({
          items: [
            { name: locale === 'hi' ? 'होम' : 'Home', url: SITE.url },
            { name: title, url: `${SITE.url}${path}` },
          ]
        })]}
      />
      <Layout>
        {/* ── LUXURY HERO SECTION ── */}
        <section className="relative flex flex-col items-center justify-center overflow-hidden bg-maroon-900 py-16 sm:py-24 lg:py-32 border-b-[8px] border-gold">
          {/* SVG Pattern Background */}
          <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23e8b923\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
          
          {/* Main Image with refined gradient overlay */}
          <div className="absolute inset-0 z-0">
            <img src="/images/tours/tour-landing-hero.png" alt="Ujjain Ghat Background" className="h-full w-full object-cover opacity-60 mix-blend-luminosity" />
            <div className="absolute inset-0 bg-gradient-to-b from-maroon-900/90 via-maroon-900/60 to-maroon-900/95" />
          </div>

          <div className="relative z-10 text-center px-4 flex flex-col items-center max-w-5xl mx-auto">
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-wider uppercase text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] mb-6 leading-tight">
              {title}
            </h1>
            
            <p className="text-cream text-lg sm:text-2xl font-serif italic max-w-3xl leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {locale === 'hi' 
                ? 'अध्यात्म, संस्कृति और ऐतिहासिक भव्यता की एक अविस्मरणीय यात्रा पर निकलें।'
                : 'Embark on an unforgettable journey of spirituality, culture, and historical grandeur.'}
            </p>
          </div>
        </section>

        <div className="bg-cream-light py-4 border-b border-cream">
          <div className="container-page">
            <Breadcrumb items={[{ label: title }]} />
          </div>
        </div>

        {/* ── UJJAIN TRAVEL PACKAGE ── */}
        <section className="container-page py-16 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="animate-fade-in order-2 lg:order-1">
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-maroon mb-8 relative pb-4 inline-block">
                {locale === 'hi' ? 'उज्जैन यात्रा पैकेज' : 'Ujjain Travel Package'}
                <div className="absolute bottom-0 left-0 w-1/2 h-1.5 bg-saffron rounded-full" />
              </h2>
              <div className="space-y-6 text-ink-soft leading-relaxed text-lg sm:text-xl font-serif">
                <p>
                  {locale === 'hi'
                    ? 'उज्जैन भारत के सबसे प्राचीन शहरों में से एक है और मध्य प्रदेश के मालवा क्षेत्र में स्थित है। यह एक ऐसा शहर है जो भारत के प्राचीन आकर्षण को प्रदर्शित करता है और अत्यधिक धार्मिक महत्व रखता है। हर साल हजारों पर्यटक और भक्त उज्जैन आते हैं।'
                    : 'Ujjain is one of the ancient cities of India and is situated in the Malwa region of Madhya Pradesh. It is a city that showcases the ancient charm of India and holds immense religious significance. Every year thousands of tourists and devotees visit Ujjain.'}
                </p>
                <p>
                  {locale === 'hi'
                    ? 'अपनी यात्रा को यादगार बनाने के लिए सर्वोत्तम कीमतों पर उज्जैन टूर पैकेज ऑनलाइन बुक करें। सबसे विश्वसनीय उज्जैन टूर ऑपरेटरों के साथ अपनी उज्जैन यात्रा का आनंद लें और सर्वोत्तम छूट के साथ 100% अनुकूलित टूर पैकेज प्राप्त करें।'
                    : 'Book online Ujjain tour packages from Omkareshwar with the best prices to make your trip memorable. Enjoy your Ujjain trip with the most trusted Ujjain tour operators and get 100% customized Ujjain trip packages with best discounts and offers.'}
                </p>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl group border-4 border-cream order-1 lg:order-2">
              <img src="/images/tours/ujjain-travel-package.webp" alt="Mahakaleshwar Temple at Sunset" className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon-900/80 to-transparent opacity-60 mix-blend-multiply" />
            </div>
          </div>
        </section>

        {/* ── TOUR PACKAGES CARDS ── */}
        <section className="bg-cream-dark/20 py-20 border-y border-cream">
          <div className="container-page">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-maroon inline-block relative pb-4">
                {locale === 'hi' ? 'हमारे प्रमुख पैकेज' : 'Our Top Packages'}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-saffron rounded-full" />
              </h2>
            </div>
            
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {packagesData.filter(p => !['ujjain-baglamukhi-2-days', 'panch-jyotirlinga-5-days'].includes(p.slug)).slice(0, 3).map((pkg) => (
                <div key={pkg.slug} className="bg-white rounded-2xl overflow-hidden shadow-xl border border-cream hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col">
                  <div className="relative h-56 overflow-hidden">
                    <img src={pkg.heroImage} alt={pkg.title[locale]} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="p-6 sm:p-8 flex-1 flex flex-col">
                    <h3 className="font-serif text-2xl font-bold text-maroon mb-4 line-clamp-2">{pkg.title[locale]}</h3>
                    <p className="text-ink-soft mb-8 text-sm sm:text-base line-clamp-3 flex-1">
                      {pkg.description[locale]}
                    </p>
                    <Link to={`${prefix}/tour-and-travel-ujjain/${pkg.slug}/`} className="btn-primary w-full justify-center bg-maroon-800 hover:bg-maroon hover:text-gold shadow-md text-lg py-3">
                      {locale === 'hi' ? 'पैकेज देखें' : 'View Details'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-ink-soft text-lg mb-6 font-serif italic">
                {locale === 'hi' ? 'क्या आपको अपनी सुविधानुसार पैकेज चाहिए?' : 'Looking for a customized experience?'}
              </p>
              <a href={SITE.phoneTel} className="btn-call shadow-xl text-lg px-8 py-4 inline-flex items-center gap-3 transition-transform hover:-translate-y-1">
                <PhoneCall className="w-5 h-5" />
                {locale === 'hi' ? 'विशेषज्ञ से बात करें' : 'Talk to our Expert'}
              </a>
            </div>
          </div>
        </section>

        {/* ── MAJOR TOURIST ATTRACTIONS ── */}
        <section className="container-page py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-maroon mb-12 text-center relative pb-4">
              {locale === 'hi' ? 'उज्जैन के प्रमुख आकर्षण' : 'Major Tourist Attractions'}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-saffron rounded-full" />
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {attractions.map((item, idx) => (
                <div key={idx} className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-cream relative overflow-hidden group hover:border-saffron/50 transition-colors">
                  <div className="absolute top-0 left-0 w-2 h-full bg-saffron" />
                  <div className="flex items-start gap-4">
                    <div className="bg-cream-light p-3 rounded-full mt-1">
                      <CheckCircle2 className="w-6 h-6 text-saffron" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-maroon font-serif mb-2">{item.title}</h3>
                      <p className="text-ink-soft text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FESTIVALS IN UJJAIN ── */}
        <section className="bg-maroon text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
          <div className="container-page relative z-10 max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-5xl font-bold mb-12 text-center text-gold drop-shadow-md">
              {locale === 'hi' ? 'उज्जैन के प्रमुख पर्व' : 'Festivals in Ujjain'}
            </h2>
            <div className="space-y-6">
              {festivals.map((fest, idx) => (
                <div key={idx} className="bg-maroon-800/80 p-6 sm:p-8 rounded-2xl border border-gold/20 shadow-xl flex items-start gap-4">
                  <div className="w-3 h-3 bg-gold rounded-full mt-2.5 flex-shrink-0 shadow-[0_0_10px_rgba(232,185,35,0.5)]" />
                  <div>
                    <h3 className="text-2xl font-bold font-serif text-gold-light mb-2">{fest.title}</h3>
                    <p className="text-cream text-lg font-serif italic leading-relaxed opacity-90">{fest.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQs ── */}
        <section className="bg-cream-light py-20">
          <div className="container-page max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-maroon mb-12 text-center relative pb-4 inline-block w-full">
              {locale === 'hi' ? 'सामान्य प्रश्न (FAQs)' : 'Frequently Asked Questions (FAQs)'}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-saffron rounded-full" />
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="rounded-xl overflow-hidden border border-cream shadow-md bg-white">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                    className="w-full text-left px-6 sm:px-8 py-5 sm:py-6 bg-white text-maroon hover:bg-cream/30 flex justify-between items-center transition-colors"
                  >
                    <span className="font-serif font-bold text-lg sm:text-xl pr-4">{faq.q}</span>
                    <ChevronDown className={`w-6 h-6 text-saffron flex-shrink-0 transform transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === idx && (
                    <div className="px-6 sm:px-8 py-5 sm:py-6 bg-cream-light/30 text-ink-soft border-t border-cream animate-fade-in leading-relaxed text-base sm:text-lg font-serif">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── REQUEST A CALL BACK ── */}
        <GlobalLeadSection sourcePage="tour-landing" defaultService="tour" />

        {/* ── NEWS FEED ── */}
        {articles.length > 0 && (
          <section className="bg-cream py-20">
            <div className="container-page">
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-maroon text-center mb-12 relative pb-4 inline-block w-full">
                {locale === 'hi' ? 'न्यूज़ फ़ीड और लेख' : 'News Feed & Articles'}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-saffron rounded-full" />
              </h2>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                {articles.map((a) => (
                  <Link key={a.slug} to={`${prefix}${articlePath(a)}`} className="block rounded-2xl overflow-hidden bg-white shadow-lg border border-cream hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                    <div className="relative h-56 overflow-hidden">
                      <img src={a.heroImage} alt={a.title[locale]} className="w-full h-full object-cover" />
                      <div className="absolute top-4 right-4 bg-saffron text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                        {locale === 'hi' ? 'ब्लॉग' : 'Blog'}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-serif text-xl font-bold text-maroon line-clamp-2 mb-3">{a.title[locale]}</h3>
                      <p className="text-sm text-ink-soft line-clamp-3 leading-relaxed">{a.shortIntro[locale]}</p>
                      <p className="mt-5 text-xs font-bold text-ink-mute uppercase tracking-wider">
                        {a.publishDate}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </Layout>
    </>
  );
}

