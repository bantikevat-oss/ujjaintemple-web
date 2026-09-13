import { Layout } from '../components/global/Layout';
import { SEOHead } from '../components/global/SEOHead';
import { TrustStrip } from '../components/global/TrustStrip';
import { useI18n } from '../i18n';
import { SITE } from '../lib/site';

// 2026-09-13: the old first section said the site collects no cookies or tracking
// data — untrue since GA4 went live on 2026-09-11 — and nothing covered the
// Ujjain Guide app. Play's Data safety form is checked against this page, so the
// two must say the same thing (ujjaintemple-app/PLAY_LISTING.md).
const SECTIONS_HI = [
  {
    title: 'हम कौन सी जानकारी एकत्रित करते हैं?',
    body: `जब आप हमसे व्हाट्सऐप, फोन, ईमेल या यात्रा फ़ॉर्म द्वारा संपर्क करते हैं, तो हम आपका नाम, फोन नंबर और पूजा/यात्रा संबंधी विवरण एकत्रित करते हैं।\nवेबसाइट और ऐप के उपयोग को समझने के लिए हम Google Analytics का उपयोग करते हैं, जो कुकी के माध्यम से पेज-व्यू जैसी सामान्य जानकारी दर्ज करता है। इससे आपकी व्यक्तिगत पहचान हमें नहीं मिलती।`,
  },
  {
    title: 'उज्जैन गाइड ऐप और सूचनाएँ',
    body: `उज्जैन गाइड (Android ऐप और /app/ पेज) में खाता बनाने की ज़रूरत नहीं है।\n• सूचनाएँ: यदि आप "सूचना चालू करें" दबाते हैं, तो आपके फ़ोन या ब्राउज़र का एक पुश-टोकन हमारे सर्वर पर सहेजा जाता है, केवल नए समाचार की सूचना भेजने के लिए। सूचनाएँ Google Firebase Cloud Messaging या आपके ब्राउज़र की पुश सेवा के माध्यम से जाती हैं। "बंद करें" दबाते ही टोकन हटा दिया जाता है।\n• 84 महादेव चेकलिस्ट और भाषा की पसंद केवल आपके फ़ोन में सहेजी जाती है, हमारे सर्वर पर नहीं।\n• ऐप आपकी लोकेशन, संपर्क, फ़ोटो, कैमरा या माइक्रोफ़ोन का उपयोग नहीं करता।`,
  },
  {
    title: 'आपकी जानकारी का उपयोग कैसे होता है?',
    body: `एकत्रित जानकारी केवल आपकी यात्रा, टूर पैकेज या अन्य सेवा अनुरोध का उत्तर देने के लिए उपयोग की जाती है। हम आपकी व्यक्तिगत जानकारी किसी तृतीय पक्ष को विक्रय या साझा नहीं करते।`,
  },
  {
    title: 'जानकारी की सुरक्षा',
    body: `आपकी जानकारी सुरक्षित रखना हमारी प्राथमिकता है। वेबसाइट और ऐप का सारा डेटा HTTPS (एन्क्रिप्टेड कनेक्शन) पर जाता है और हम उद्योग-मानक सुरक्षा उपायों का पालन करते हैं।`,
  },
  {
    title: 'बाहरी लिंक',
    body: `हमारी वेबसाइट और ऐप में कुछ बाहरी लिंक हो सकते हैं (जैसे Google Maps, Google Calendar, WhatsApp)। इन सेवाओं की गोपनीयता नीति अलग हो सकती है — कृपया उन्हें स्वयं पढ़ें।`,
  },
  {
    title: 'आपके अधिकार',
    body: `आप किसी भी समय अपनी व्यक्तिगत जानकारी को देखने, सुधारने या हटाने का अनुरोध कर सकते हैं। इसके लिए info@ujjaintemple.com पर संपर्क करें।`,
  },
  {
    title: 'नीति में परिवर्तन',
    body: `हम समय-समय पर इस गोपनीयता नीति को अद्यतन कर सकते हैं। महत्त्वपूर्ण परिवर्तनों की सूचना वेबसाइट पर दी जाएगी।`,
  },
  {
    title: 'संपर्क',
    body: `गोपनीयता संबंधी किसी भी प्रश्न के लिए:\nईमेल: info@ujjaintemple.com\nफोन: +91 74007 24456\nपता: ByteFlow Technologies Pvt Ltd, उज्जैन, मध्य प्रदेश — 456001`,
  },
];

const SECTIONS_EN = [
  {
    title: 'What information do we collect?',
    body: `When you contact us via WhatsApp, phone, email or the trip form, we collect your name, phone number and details related to your puja/travel request.\nTo understand how the website and app are used, we use Google Analytics, which records general information such as page views using cookies. It does not give us your personal identity.`,
  },
  {
    title: 'The Ujjain Guide app and notifications',
    body: `The Ujjain Guide app (Android app and the /app/ pages) needs no account.\n• Notifications: if you tap "Turn on", a push token for your phone or browser is stored on our server, only to send you new-article notifications. They are delivered through Google Firebase Cloud Messaging or your browser's push service. Tapping "Turn off" deletes the token.\n• Your 84 Mahadev checklist and language choice are saved on your phone only, never on our server.\n• The app does not use your location, contacts, photos, camera or microphone.`,
  },
  {
    title: 'How is your information used?',
    body: `Collected information is used solely to respond to your travel, tour package or other service request. We do not sell or share your personal information with any third party.`,
  },
  {
    title: 'Data security',
    body: `Keeping your information secure is our priority. All website and app traffic uses HTTPS (encrypted connections), and we follow industry-standard security practices.`,
  },
  {
    title: 'External links',
    body: `Our website and app contain links to external services (such as Google Maps, Google Calendar and WhatsApp). Those services have their own privacy policies — please read them independently.`,
  },
  {
    title: 'Your rights',
    body: `You may request to view, correct or delete your personal information at any time. Contact us at info@ujjaintemple.com.`,
  },
  {
    title: 'Policy updates',
    body: `We may update this privacy policy from time to time. Notice of significant changes will be posted on the website.`,
  },
  {
    title: 'Contact',
    body: `For any privacy-related questions:\nEmail: info@ujjaintemple.com\nPhone: +91 74007 24456\nAddress: ByteFlow Technologies Pvt Ltd, Ujjain, Madhya Pradesh — 456001`,
  },
];

export function PrivacyPage() {
  const { locale } = useI18n();
  const isHi = locale === 'hi';
  const sections = isHi ? SECTIONS_HI : SECTIONS_EN;

  return (
    <>
      <SEOHead
        title={isHi ? 'गोपनीयता नीति — UjjainTemple.com' : 'Privacy Policy — UjjainTemple.com'}
        description={isHi
          ? 'UjjainTemple.com और उज्जैन गाइड ऐप की गोपनीयता नीति — आपकी जानकारी का उपयोग, सूचनाएँ, सुरक्षा और आपके अधिकार।'
          : 'Privacy Policy of UjjainTemple.com and the Ujjain Guide app — how we use and protect your information, notifications and your rights.'}
        path="/privacy-policy/"
        locale={locale}
      />
      <Layout>
        <TrustStrip variant="thin" />

        {/* Hero */}
        <section style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #3a0404 0%, #1a0202 100%)' }}>
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent" />
          <div className="container-page py-14 sm:py-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold/60 mb-3">
              {isHi ? 'कानूनी · नीति' : 'Legal · Policy'}
            </p>
            <h1 className={`font-bold text-white ${isHi ? 'font-sanskrit' : 'font-serif'}`}
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
              {isHi ? 'गोपनीयता नीति' : 'Privacy Policy'}
            </h1>
            <p className="mt-2 text-sm text-cream/50">
              {isHi ? 'ByteFlow Technologies Pvt Ltd · UjjainTemple.com' : 'ByteFlow Technologies Pvt Ltd · UjjainTemple.com'}
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="bg-cream">
          <div className="container-page py-14 sm:py-20 max-w-3xl">
            <div className="space-y-8">
              {sections.map((s, i) => (
                <div key={i} className="rounded-2xl bg-white border border-gold/15 p-7">
                  <h2 className={`font-bold text-maroon mb-3 ${isHi ? 'font-sanskrit text-base sm:text-lg' : 'font-serif text-base sm:text-lg'}`}>
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full
                      bg-maroon text-white text-[11px] font-bold mr-2.5 flex-shrink-0">
                      {i + 1}
                    </span>
                    {s.title}
                  </h2>
                  <p className="text-sm leading-[1.9] text-ink-soft whitespace-pre-line pl-8">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>

            {/* Contact CTA */}
            <div className="mt-10 rounded-2xl border border-gold/30 bg-white p-7 text-center"
              style={{ background: 'linear-gradient(135deg, #fff 0%, #fdf8f0 100%)' }}>
              <p className={`font-bold text-maroon mb-2 ${isHi ? 'font-sanskrit text-base' : 'font-serif text-base'}`}>
                {isHi ? 'कोई प्रश्न है?' : 'Have a question?'}
              </p>
              <p className="text-sm text-ink-soft mb-4">
                {isHi ? 'हम तुरंत जवाब देते हैं' : 'We respond promptly'}
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
