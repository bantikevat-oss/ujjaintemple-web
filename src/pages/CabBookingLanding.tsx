import { useState } from 'react';
import { Layout } from '../components/global/Layout';
import { SEOHead } from '../components/global/SEOHead';
import { GlobalLeadSection } from '../components/global/GlobalLeadSection';
import { Breadcrumb } from '../components/global/Breadcrumb';
import { useI18n } from '../i18n';
import { SITE } from '../lib/site';
import { breadcrumbSchema } from '../lib/schemas';
import { PhoneCall, ChevronDown, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { articlesByCategory, articlePath } from '../data/articles';

export function CabBookingLanding() {
  const { locale } = useI18n();
  const prefix = locale === 'hi' ? '' : '/en';
  const articles = articlesByCategory('blog').slice(0, 3);

  const title = locale === 'hi'
    ? 'उज्जैन में टैक्सी — महाकाल, ओंकारेश्वर, इंदौर, भोपाल कैब बुकिंग | UjjainTemple'
    : 'Taxi in Ujjain — Cab Booking for Mahakal, Omkareshwar, Indore, Bhopal | UjjainTemple';
  const description = locale === 'hi'
    ? 'उज्जैन में टैक्सी सेवा — महाकालेश्वर, ओंकारेश्वर, इंदौर एयरपोर्ट, भोपाल व लोकल दर्शन के लिए कैब बुकिंग। 24/7 उपलब्ध: +91 74007 24456।'
    : 'Taxi in Ujjain — book cabs for Mahakaleshwar darshan, Omkareshwar, Indore airport, Bhopal & local sightseeing. 24/7 service: +91 74007 24456.';
  const path = '/cab-booking/';

  const [openFaq, setOpenFaq] = useState<number>(0);

  const faqs = [
    {
      q: locale === 'hi' ? 'इंदौर एयरपोर्ट से उज्जैन का टैक्सी/कैब किराया कितना है?' : 'How much is taxi/cab fare from Indore Airport to Ujjain?',
      a: locale === 'hi'
        ? 'इंदौर एयरपोर्ट से उज्जैन का कैब किराया सेडान के लिए ₹1500 और SUV के लिए ₹2000 से शुरू होता है। यह एयरपोर्ट पिकअप/ड्रॉप के लिए एक निश्चित कीमत है।'
        : 'The taxi/cab fare from Indore Airport to Ujjain starts from ₹1500 for a sedan cab & ₹2000 for an SUV cab. It is a fixed price for airport pickup/drop.'
    },
    {
      q: locale === 'hi' ? 'उज्जैन लोकल टैक्सी बुकिंग/कैंसिलेशन पॉलिसी क्या है?' : 'What is the Ujjain local taxi booking/cancellation policy?',
      a: locale === 'hi'
        ? 'हम सुविधाजनक कैंसिलेशन पॉलिसी प्रदान करते हैं। आप यात्रा से पहले आसानी से अपनी बुकिंग बदल या कैंसल कर सकते हैं।'
        : 'We offer a flexible cancellation policy. You can easily modify or cancel your booking prior to your journey.'
    },
    {
      q: locale === 'hi' ? 'क्या मैं आउटस्टेशन के लिए उज्जैन से टैक्सी बुक कर सकता हूँ?' : 'Can I book a taxi from Ujjain for outstation?',
      a: locale === 'hi'
        ? 'हां, हम ओंकारेश्वर, महेश्वर, मांडू, इंदौर आदि स्थानों के लिए आउटस्टेशन टैक्सी सेवा प्रदान करते हैं।'
        : 'Yes, we provide outstation taxi services to places like Omkareshwar, Maheshwar, Mandu, Indore, etc.'
    },
    {
      q: locale === 'hi' ? 'भुगतान के कौन-कौन से तरीके उपलब्ध हैं?' : 'What are the modes of payment available?',
      a: locale === 'hi'
        ? 'हम नकद, यूपीआई (UPI), और कार्ड सहित सभी प्रमुख भुगतान विधियां स्वीकार करते हैं।'
        : 'We accept all major payment methods including cash, UPI, and cards.'
    },
    {
      q: locale === 'hi' ? 'क्या आपके पास उज्जैन से ओंकारेश्वर के लिए कोई कैब/टैक्सी है?' : 'Do you have any cab/taxi from Ujjain to Omkareshwar?',
      a: locale === 'hi'
        ? 'हां, हम उज्जैन से ओंकारेश्वर के लिए विशेष टूर पैकेज और वन-वे या राउंड ट्रिप कैब प्रदान करते हैं।'
        : 'Yes, we provide special tour packages and one-way or round-trip cabs from Ujjain to Omkareshwar.'
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
            { name: locale === 'hi' ? 'कैब बुकिंग' : 'Cab Booking', url: `${SITE.url}/cab-booking/` },
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
            <img src="/images/services/ujjain_taxi_4k.webp" alt="Ujjain Cab Booking" className="h-full w-full object-cover opacity-60 mix-blend-luminosity" />
            <div className="absolute inset-0 bg-gradient-to-b from-maroon-900/90 via-maroon-900/60 to-maroon-900/95" />
          </div>

          <div className="relative z-10 text-center px-4 flex flex-col items-center max-w-5xl mx-auto">
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-wider uppercase text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] mb-6 leading-tight">
              {title}
            </h1>
            
            <p className="text-cream text-lg sm:text-2xl font-serif italic max-w-3xl leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {locale === 'hi' 
                ? 'उज्जैन और आसपास के दर्शन के लिए सुरक्षित, आरामदायक और किफायती कैब सेवा।'
                : 'Safe, comfortable, and affordable cab service for Ujjain and outstation sightseeing.'}
            </p>
          </div>
        </section>

        <div className="bg-cream-light py-4 border-b border-cream">
          <div className="container-page">
            <Breadcrumb items={[
              { label: locale === 'hi' ? 'कैब बुकिंग' : 'Cab Booking', url: '/cab-booking/' },
              { label: title }
            ]} />
          </div>
        </div>

        {/* ── TAXI SERVICE SECTION ── */}
        <section className="container-page py-16 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="animate-fade-in">
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-maroon mb-6 relative pb-4 inline-block uppercase">
                {locale === 'hi' ? 'उज्जैन में टैक्सी सेवा' : 'Taxi Service in Ujjain'}
                <div className="absolute bottom-0 left-0 w-1/2 h-1.5 bg-saffron rounded-full" />
              </h2>
              <div className="space-y-6 text-ink-soft leading-relaxed text-lg font-serif">
                <p>
                  {locale === 'hi'
                    ? 'हम उज्जैन में टैक्सी सेवा प्रदान कर रहे हैं। हमारी उज्जैन टैक्सी सेवा शहर में सर्वश्रेष्ठ है। उज्जैन लोकल साइटसीइंग, ओंकारेश्वर, महेश्वर, मांडू, इंदौर आदि के लिए हमारे पास विभिन्न प्रकार की कैब उपलब्ध हैं। हम उज्जैन से इंदौर एयरपोर्ट ड्रॉप और पिकअप के लिए नियमित कैब सेवा प्रदान करते हैं। आपके लिए उज्जैन टैक्सी सेवा सबसे अच्छा विकल्प है।'
                    : 'We are providing Taxi service in Ujjain. Our Ujjain Taxi service is the best in the city. We have a variety of cabs available for Ujjain local sightseeing, Omkareshwar, Maheshwar, Mandu, Indore, etc. We offer regular cab service for Ujjain to Indore airport drop & pickup. The Ujjain taxi service is the best choice for you.'}
                </p>
                <h3 className="font-bold text-maroon text-2xl mt-8">
                  {locale === 'hi' ? 'उज्जैन में टैक्सी कैसे प्राप्त करें?' : 'How to reach Taxi in Ujjain?'}
                </h3>
                <p>
                  {locale === 'hi'
                    ? 'उज्जैन सड़क, रेल और हवाई मार्ग से अच्छी तरह जुड़ा हुआ है। निकटतम हवाई अड्डा इंदौर में देवी अहिल्या बाई होलकर हवाई अड्डा है। उज्जैन रेलवे स्टेशन भारत के प्रमुख शहरों से जुड़ा हुआ है। यदि आप आउटस्टेशन से आ रहे हैं, तो आप इंदौर से उज्जैन के लिए कैब या टैक्सी बुक कर सकते हैं। आप हमारे साथ अग्रिम रूप से कैब/टैक्सी बुक कर सकते हैं, बस हमारे संपर्क नंबर पर हमें कॉल करें।'
                    : 'Ujjain is well connected by road, rail & air. The nearest airport is Devi Ahilya Bai Holkar airport in Indore. Ujjain railway station is connected to major cities in India. If you are coming from out of station, you can book a cab or taxi from Indore to Ujjain. You can book cab/taxi in advance with us, just call us on our contact number.'}
                </p>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-cream">
              <img src="/images/services/ujjain_taxi_4k.webp" alt="Ujjain Taxi Service" className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </div>
        </section>

        {/* ── OUR SERVICES CIRCULAR SECTION ── */}
        <section className="bg-cream-dark/10 py-16">
          <div className="container-page max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl border-8 border-white flex-shrink-0 relative group">
              <img src="/images/services/ujjain_tirthyatra_services_4k.webp" alt="TirthYatra Services" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-maroon/20 group-hover:bg-transparent transition-colors duration-500" />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon mb-8 uppercase">
                {locale === 'hi' ? 'आपकी तीर्थयात्रा के लिए हमारी सेवाएं' : 'Our Services for Your TirthYatra'}
              </h2>
              <div className="grid grid-cols-2 gap-6 text-lg sm:text-xl font-medium text-ink-soft mb-8">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-saffron" />
                  {locale === 'hi' ? 'सर्वश्रेष्ठ आवास' : 'Best Accommodation'}
                </div>
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-saffron" />
                  {locale === 'hi' ? 'ट्रांसपोर्ट / कैब' : 'Transport Cabs'}
                </div>
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-saffron" />
                  {locale === 'hi' ? 'पूजा बुकिंग' : 'Puja Booking'}
                </div>
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-saffron" />
                  {locale === 'hi' ? 'कस्टमाइज्ड पैकेज' : 'Customized Packages'}
                </div>
              </div>
              <a href={SITE.phoneTel} className="btn-primary bg-white text-maroon hover:bg-maroon hover:text-white border-2 border-maroon shadow-md text-lg px-8 py-3 rounded-full inline-flex items-center transition-colors">
                {locale === 'hi' ? 'अभी बुक करें →' : 'Book Now →'}
              </a>
            </div>
          </div>
        </section>

        {/* ── CAB OPTIONS & ROUTES ── */}
        <section className="container-page py-16 sm:py-24 space-y-16">
          
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-maroon mb-6">
              {locale === 'hi' ? 'उज्जैन में कैब विकल्प –' : 'Cab options in Ujjain –'}
            </h2>
            <p className="text-ink-soft text-lg leading-relaxed font-serif mb-4">
              {locale === 'hi'
                ? 'हमारे पास उज्जैन लोकल में सभी प्रकार की कैब उपलब्ध हैं। हमारे बेड़े में Swift Dzire, Innova, Innova Crysta, Tavera, Ertiga, Tempo Traveller आदि शामिल हैं।'
                : 'We have all types of cab available in Ujjain local. Our fleet includes Swift Dzire, Innova, Innova Crysta, Tavera, Ertiga, Tempo Traveller, etc.'}
            </p>
            <p className="text-ink-soft text-lg leading-relaxed font-serif">
              {locale === 'hi'
                ? 'हम उज्जैन लोकल साइटसीइंग, ओंकारेश्वर, महेश्वर, मांडू, इंदौर आदि के लिए टैक्सी सेवा प्रदान करते हैं। आपकी आवश्यकता के अनुसार, हम ड्राइवर के साथ कैब प्रदान करते हैं।'
                : 'We provide taxi service for Ujjain local sightseeing, Omkareshwar, Maheshwar, Mandu, Indore, etc. According to your requirement, we provide a cab with a driver.'}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-maroon mb-6">
              {locale === 'hi' ? 'ओंकारेश्वर मंदिर तक पहुंचने का सबसे अच्छा मार्ग' : 'The Best Route to Reach Omkareshwar Mandir'}
            </h2>
            <ul className="space-y-4 text-ink-soft text-lg font-serif list-disc pl-6">
              <li>
                {locale === 'hi' 
                  ? 'उज्जैन से ओंकारेश्वर पहुंचने का सबसे आसान और अच्छा मार्ग इंदौर होकर जाता है। कुल दूरी लगभग 140 KM है, और इसमें लगभग 3.5 घंटे लगेंगे। मार्ग है उज्जैन -> इंदौर -> ओंकारेश्वर।'
                  : 'The easiest & best route to reach Omkareshwar from Ujjain is via Indore. The total distance is around 140 KM, & it will take approx 3.5 hrs. The route is Ujjain -> Indore -> Omkareshwar.'}
              </li>
              <li>
                {locale === 'hi'
                  ? 'निकटतम हवाई अड्डा इंदौर हवाई अड्डा है। आप इंदौर हवाई अड्डे से ओंकारेश्वर के लिए कैब बुक कर सकते हैं। कुल दूरी 80 KM है, और इसमें लगभग 2.5 घंटे लगेंगे। इंदौर रेलवे स्टेशन से, आप ओंकारेश्वर के लिए कैब बुक कर सकते हैं। दूरी 75 KM है, और इसमें लगभग 2.5 घंटे लगेंगे।'
                  : 'The nearest airport is Indore Airport. You can book a cab from Indore airport to Omkareshwar. The total distance is 80 KM, & it will take approx 2.5 hrs. From Indore railway station, you can book a cab for Omkareshwar. The distance is 75 KM, & it will take approx 2.5 hrs.'}
              </li>
            </ul>
          </div>

          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-maroon mb-6">
              {locale === 'hi' ? 'टैक्सी/कैब सेवाओं की मूल्य निर्धारण योजनाएं' : 'Pricing schemes of the taxi/cab services'}
            </h2>
            <p className="text-ink-soft text-lg leading-relaxed font-serif mb-4">
              {locale === 'hi'
                ? 'उज्जैन टैक्सी सेवा उज्जैन में अन्य टैक्सी सेवा प्रदाताओं की तुलना में बहुत कम और सस्ती है। हम प्रति किलोमीटर आधार या पैकेज आधार पर कैब/टैक्सी प्रदान करते हैं। उज्जैन में टैक्सी की लागत आपके द्वारा बुक किए गए कैब के प्रकार पर निर्भर करती है। उज्जैन में कैब की शुरुआती कीमत सेडान के लिए 10/किमी और SUV के लिए 14/किमी है।'
                : 'Ujjain taxi service is very low & affordable compared to other taxi service providers in Ujjain. We provide cab/taxi on a per km basis or package basis. The cost of taxi in Ujjain depends on the type of cab you book. The starting price of cab in Ujjain is 10/km for Sedan & 14/km for SUV.'}
            </p>
            <p className="text-ink-soft text-lg leading-relaxed font-serif">
              {locale === 'hi'
                ? 'हमारे पास उज्जैन, ओंकारेश्वर, महेश्वर, मांडू के लिए विशेष टूर पैकेज हैं। हम उज्जैन में लोकल साइटसीइंग, उज्जैन से ओंकारेश्वर टैक्सी, उज्जैन से इंदौर एयरपोर्ट टैक्सी के लिए कैब/टैक्सी प्रदान करते हैं।'
                : 'We have special tour packages for Ujjain, Omkareshwar, Maheshwar, Mandu. We provide cab/taxi for local sightseeing in Ujjain, Ujjain to Omkareshwar taxi, Ujjain to Indore airport taxi.'}
            </p>
          </div>

        </section>

        {/* ── FAQs ── */}
        <section className="bg-cream-light py-20 border-t border-cream">
          <div className="container-page max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon mb-12 text-center">
              {locale === 'hi' ? 'सामान्य प्रश्न (FAQs)' : 'Frequently asked Questions (FAQs)'}
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="rounded-xl overflow-hidden border border-cream shadow-sm bg-white hover:shadow-md transition-shadow">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                    className={`w-full text-left px-6 sm:px-8 py-5 flex justify-between items-center transition-colors ${openFaq === idx ? 'bg-maroon text-white' : 'bg-cream-dark/10 text-maroon'}`}
                  >
                    <span className="font-serif font-bold text-lg sm:text-xl pr-4">{faq.q}</span>
                    <ChevronDown className={`w-6 h-6 flex-shrink-0 transform transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-white' : 'text-saffron'}`} />
                  </button>
                  {openFaq === idx && (
                    <div className="px-6 sm:px-8 py-5 bg-white text-ink-soft border-t border-cream animate-fade-in leading-relaxed text-base sm:text-lg font-serif">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section className="relative py-12 sm:py-16 bg-maroon-900 overflow-hidden shadow-inner border-y-4 border-maroon">
          {/* Subtle pattern over maroon */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }} />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 px-4 text-center">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white drop-shadow-md">
              {locale === 'hi' ? 'मदद चाहिए, अभी कॉल करें!' : 'Need Help, Call Us Now!'}
            </h2>
            <a href={SITE.phoneTel} className="btn-primary bg-white/20 hover:bg-white/30 border-2 border-white/50 text-white shadow-[0_0_15px_rgba(255,255,255,0.2)] text-xl px-8 py-3 rounded-full backdrop-blur-sm transition-all flex items-center gap-3">
              <PhoneCall className="w-5 h-5" />
              {SITE.phoneDisplay}
            </a>
          </div>
        </section>

        {/* ── REQUEST A CALL BACK ── */}
        <GlobalLeadSection sourcePage="cab-booking" defaultService="transport" />

        {/* ── NEWS FEED ── */}
        {articles.length > 0 && (
          <section className="bg-cream py-20">
            <div className="container-page">
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-maroon text-center mb-12 relative pb-4 inline-block w-full">
                {locale === 'hi' ? 'न्यूज़ फ़ीड' : 'News Feed'}
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

