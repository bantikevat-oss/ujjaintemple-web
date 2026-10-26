import { Layout } from '../components/global/Layout';
import { SEOHead } from '../components/global/SEOHead';
import { TrustStrip } from '../components/global/TrustStrip';
import { useI18n } from '../i18n';
import { SITE } from '../lib/site';

const SECTIONS_HI = [
  {
    title: 'स्वीकृति',
    body: `UjjainTemple.com का उपयोग करके आप इन उपयोग की शर्तों से सहमत होते हैं। यदि आप इनसे सहमत नहीं हैं, तो कृपया वेबसाइट का उपयोग न करें।`,
  },
  {
    title: 'सेवाओं का विवरण',
    body: `UjjainTemple.com उज्जैन के मंदिरों, पूजाओं, टूर पैकेज, होटल और यातायात की जानकारी प्रदान करती है। इसी वेबसाइट के माध्यम से ByteFlow Technologies Pvt Ltd कैब और टैक्सी बुकिंग, टूर पैकेज, होटल बुकिंग सहायता और अनुभवी पंडितों द्वारा पूजा की व्यवस्था भी करती है। बुकिंग की पुष्टि WhatsApp, फ़ोन या ईमेल से होती है, और भुगतान ऑनलाइन या हमारे द्वारा भेजे गए पेमेंट लिंक से किया जा सकता है। बुकिंग रद्द करने और रिफ़ंड पर हमारी रद्दीकरण और रिफ़ंड नीति लागू होती है।`,
  },
  {
    title: 'जानकारी की सटीकता',
    body: `हम सभी जानकारी स्थानीय स्रोतों से सत्यापित करके प्रकाशित करते हैं। फिर भी मंदिर समय, पूजा शुल्क और त्यौहार की तारीखें बदल सकती हैं — कृपया यात्रा से पहले पुष्टि करें। हम किसी भी अशुद्धि के लिए उत्तरदायी नहीं हैं।`,
  },
  {
    title: 'बौद्धिक संपदा',
    body: `इस वेबसाइट की सभी सामग्री — लेख, चित्र, डिज़ाइन — ByteFlow Technologies Pvt Ltd की बौद्धिक संपदा है। बिना लिखित अनुमति के इसका पुनः प्रकाशन या व्यावसायिक उपयोग प्रतिबंधित है।`,
  },
  {
    title: 'बाहरी लिंक और पार्टनर',
    body: `कुछ पेज दूसरी वेबसाइटों से जुड़ते हैं — जैसे हमारे नेटवर्क की अन्य पूजा वेबसाइटें, और Google Maps तथा WhatsApp जैसी सेवाएँ। किसी दूसरी वेबसाइट से बुकिंग करने पर उसी वेबसाइट की शर्तें और नीतियाँ लागू होती हैं।`,
  },
  {
    title: 'दायित्व की सीमा',
    body: `UjjainTemple.com किसी भी प्रत्यक्ष, अप्रत्यक्ष या आनुषंगिक क्षति के लिए उत्तरदायी नहीं होगी जो इस वेबसाइट के उपयोग से उत्पन्न हो।`,
  },
  {
    title: 'लागू कानून',
    body: `इन शर्तों पर भारत के कानून लागू होंगे। किसी भी विवाद का निपटान उज्जैन, मध्य प्रदेश की न्यायालयों के अधिकार क्षेत्र में होगा।`,
  },
  {
    title: 'शर्तों में परिवर्तन',
    body: `हम इन शर्तों को बिना पूर्व सूचना के बदल सकते हैं। नवीनतम संस्करण सदैव इसी पेज पर उपलब्ध रहेगा।`,
  },
];

const SECTIONS_EN = [
  {
    title: 'Acceptance',
    body: `By using UjjainTemple.com you agree to these Terms of Use. If you do not agree, please do not use the website.`,
  },
  {
    title: 'Description of services',
    body: `UjjainTemple.com provides information on Ujjain temples, pujas, tour packages, hotels and transport. Through this website, ByteFlow Technologies Pvt Ltd also arranges cab and taxi bookings, tour packages, hotel booking assistance and puja arrangements with experienced pandits. Bookings are confirmed by WhatsApp, phone or email, and payment can be made online or through a payment link we send. Cancellations and refunds follow our Cancellation & Refund Policy.`,
  },
  {
    title: 'Accuracy of information',
    body: `We verify all content from local sources before publishing. However temple timings, puja fees and festival dates may change — please confirm before your visit. We are not liable for any inaccuracies.`,
  },
  {
    title: 'Intellectual property',
    body: `All content on this website — articles, images, design — is the intellectual property of ByteFlow Technologies Pvt Ltd. Reproduction or commercial use without written permission is prohibited.`,
  },
  {
    title: 'External links and partners',
    body: `Some pages link to other websites — including other puja websites in our network, and services such as Google Maps and WhatsApp. When you book through another website, that website's own terms and policies apply.`,
  },
  {
    title: 'Limitation of liability',
    body: `UjjainTemple.com shall not be liable for any direct, indirect or incidental damages arising from the use of this website.`,
  },
  {
    title: 'Governing law',
    body: `These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Ujjain, Madhya Pradesh.`,
  },
  {
    title: 'Changes to terms',
    body: `We may update these terms without prior notice. The latest version will always be available on this page.`,
  },
];

export function TermsPage() {
  const { locale } = useI18n();
  const isHi = locale === 'hi';
  const sections = isHi ? SECTIONS_HI : SECTIONS_EN;

  return (
    <>
      <SEOHead
        title={isHi ? 'उपयोग की शर्तें — UjjainTemple.com' : 'Terms of Use — UjjainTemple.com'}
        description={isHi
          ? 'UjjainTemple.com की उपयोग की शर्तें — ByteFlow Technologies Pvt Ltd। सेवाएँ, दायित्व और कानूनी प्रावधान।'
          : 'Terms of Use for UjjainTemple.com — ByteFlow Technologies Pvt Ltd. Services, liability and legal provisions.'}
        path="/terms/"
        locale={locale}
      />
      <Layout>
        <TrustStrip variant="thin" />

        {/* Hero */}
        <section style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #3a0404 0%, #1a0202 100%)' }}>
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent" />
          <div className="container-page py-14 sm:py-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold/60 mb-3">
              {isHi ? 'कानूनी · शर्तें' : 'Legal · Terms'}
            </p>
            <h1 className={`font-bold text-white ${isHi ? 'font-sanskrit' : 'font-serif'}`}
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
              {isHi ? 'उपयोग की शर्तें' : 'Terms of Use'}
            </h1>
            <p className="mt-2 text-sm text-cream/50">
              ByteFlow Technologies Pvt Ltd · UjjainTemple.com
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="bg-cream">
          <div className="container-page py-14 sm:py-20 max-w-3xl">
            <div className="space-y-6">
              {sections.map((s, i) => (
                <div key={i} className="rounded-2xl bg-white border border-gold/25 p-7">
                  <h2 className={`font-bold text-maroon mb-3 flex items-start gap-2.5
                    ${isHi ? 'font-sanskrit text-base sm:text-lg' : 'font-serif text-base sm:text-lg'}`}>
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full
                      bg-maroon text-white text-[11px] font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {s.title}
                  </h2>
                  <p className="text-sm leading-[1.9] text-ink-soft pl-8">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>

            {/* Contact CTA */}
            <div className="mt-10 rounded-2xl border border-gold/40 p-7 text-center"
              style={{ background: 'linear-gradient(135deg, #fff 0%, #fdf8f0 100%)' }}>
              <p className={`font-bold text-maroon mb-2 ${isHi ? 'font-sanskrit text-base' : 'font-serif text-base'}`}>
                {isHi ? 'कोई प्रश्न है?' : 'Have a question?'}
              </p>
              <p className="text-sm text-ink-soft mb-4">
                {isHi ? 'हमसे सीधे संपर्क करें' : 'Contact us directly'}
              </p>
              <a href={`mailto:${SITE.email}`}
                className="inline-flex items-center gap-2 rounded-xl bg-maroon
                  px-6 py-3 font-semibold text-white text-sm
                  hover:bg-maroon/90 transition-colors">
                {SITE.email}
              </a>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
