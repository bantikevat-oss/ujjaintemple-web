import { Layout } from '../components/global/Layout';
import { SEOHead } from '../components/global/SEOHead';
import { TrustStrip } from '../components/global/TrustStrip';
import { useI18n } from '../i18n';
import { SITE } from '../lib/site';

/**
 * Cancellation & Refund policy — one of the six pages Razorpay reviews before a site can take
 * payments (see pages/LegalRoute.tsx). The windows and timelines below are business terms, not
 * copy: change them only on Aman's word, and keep the Hindi and English versions saying the same.
 */
const SECTIONS_HI = [
  {
    title: 'यह नीति किन बुकिंग पर लागू है',
    body: `यह नीति उन सभी बुकिंग पर लागू है जिनका भुगतान UjjainTemple.com पर या हमारे द्वारा भेजे गए पेमेंट लिंक से ByteFlow Technologies Pvt Ltd को किया गया है — कैब और टैक्सी, टूर पैकेज, होटल बुकिंग सहायता और पूजा व्यवस्था।`,
  },
  {
    title: 'कैब, टैक्सी और टूर पैकेज',
    body: `यात्रा शुरू होने के 48 घंटे या उससे पहले रद्द करने पर पूरी राशि वापस की जाएगी। 24 से 48 घंटे पहले रद्द करने पर 50% राशि वापस की जाएगी। 24 घंटे से कम समय में रद्द करने पर, या तय समय पर न पहुँचने पर, राशि वापस नहीं की जाएगी।`,
  },
  {
    title: 'होटल बुकिंग',
    body: `होटल की रद्दीकरण शर्तें हर होटल की अपनी होती हैं। भुगतान से पहले हम उस होटल की शर्तें आपको बता देते हैं। रद्द करने पर होटल जितनी राशि लौटाता है, वह पूरी राशि हम आपको वापस कर देते हैं।`,
  },
  {
    title: 'पूजा व्यवस्था',
    body: `पूजा की तय तारीख से 72 घंटे या उससे पहले रद्द करने पर पूरी राशि वापस की जाएगी। 72 घंटे से कम समय में रद्द करने पर 50% राशि वापस की जाएगी, क्योंकि तब तक सामग्री और पंडित जी की व्यवस्था हो चुकी होती है। पूजा संपन्न होने के बाद राशि वापस नहीं की जाती। पूजा से 24 घंटे पहले तक एक बार तारीख बदली जा सकती है, इसके लिए कोई राशि नहीं काटी जाती।`,
  },
  {
    title: 'जब हम सेवा न दे पाएँ',
    body: `यदि किसी कारण से हम बुक की गई सेवा नहीं दे पाते — जैसे वाहन ख़राब होना, ख़राब मौसम, या प्रशासन द्वारा रास्ते या क्षेत्र बंद करना — तो आप पूरी राशि वापस ले सकते हैं या बिना अतिरिक्त शुल्क के नई तारीख चुन सकते हैं।`,
  },
  {
    title: 'रद्द कैसे करें',
    body: `अपना नाम, बुकिंग की तारीख और भुगतान का विवरण WhatsApp, फ़ोन या ईमेल से भेजें। रद्दीकरण का समय वही माना जाएगा जब आपका संदेश हमें प्राप्त होगा।`,
  },
  {
    title: 'राशि कब तक वापस आएगी',
    body: `स्वीकृत रिफ़ंड 2 कार्य दिवस के भीतर शुरू कर दिया जाता है और उसी माध्यम में वापस जाता है जिससे भुगतान किया गया था। आपके बैंक के अनुसार राशि खाते में आने में 5 से 7 कार्य दिवस लग सकते हैं।`,
  },
  {
    title: 'सेवा कैसे दी जाती है',
    body: `हम कोई सामान डाक या कूरियर से नहीं भेजते। सभी सेवाएँ उज्जैन और आसपास, तय तारीख पर दी जाती हैं। बुकिंग की पुष्टि WhatsApp या ईमेल पर भेजी जाती है।`,
  },
];

const SECTIONS_EN = [
  {
    title: 'What this policy covers',
    body: `This policy applies to every booking paid to ByteFlow Technologies Pvt Ltd on UjjainTemple.com or through a payment link we send you — cab and taxi, tour packages, hotel booking assistance and puja arrangements.`,
  },
  {
    title: 'Cabs, taxis and tour packages',
    body: `Cancel 48 hours or more before the trip starts for a full refund. Cancel between 24 and 48 hours before for a 50% refund. Cancellations less than 24 hours before the trip, and no-shows, are not refunded.`,
  },
  {
    title: 'Hotel bookings',
    body: `Each hotel sets its own cancellation terms, and we share them with you before you pay. If you cancel, we refund you the full amount the hotel returns to us.`,
  },
  {
    title: 'Puja arrangements',
    body: `Cancel 72 hours or more before the puja date for a full refund. Cancellations less than 72 hours before receive a 50% refund, because the samagri and the pandit have been arranged by then. No refund is made once the puja has been performed. You may change the date once, with no deduction, up to 24 hours before the puja.`,
  },
  {
    title: 'If we cannot provide the service',
    body: `If we are unable to provide a booked service — for example a vehicle breakdown, bad weather, or roads or areas closed by the administration — you may choose a full refund or a new date at no extra cost.`,
  },
  {
    title: 'How to cancel',
    body: `Send your name, booking date and payment details by WhatsApp, phone or email. The cancellation time is the time we receive your message.`,
  },
  {
    title: 'Refund timeline',
    body: `Approved refunds are initiated within 2 working days and returned to the original payment method. Depending on your bank, the amount can take 5 to 7 working days to reach your account.`,
  },
  {
    title: 'Service delivery',
    body: `We do not ship any goods. All services are delivered in and around Ujjain on the confirmed date, and booking confirmations are sent by WhatsApp or email.`,
  },
];

export function RefundPage() {
  const { locale } = useI18n();
  const isHi = locale === 'hi';
  const sections = isHi ? SECTIONS_HI : SECTIONS_EN;

  return (
    <>
      <SEOHead
        title={isHi ? 'रद्दीकरण और रिफ़ंड नीति — UjjainTemple.com' : 'Cancellation & Refund Policy — UjjainTemple.com'}
        description={isHi
          ? 'UjjainTemple.com की रद्दीकरण और रिफ़ंड नीति — कैब, टूर पैकेज, होटल और पूजा बुकिंग रद्द करने की शर्तें और रिफ़ंड का समय।'
          : 'Cancellation and refund policy for UjjainTemple.com — terms for cancelling cab, tour package, hotel and puja bookings, and refund timelines.'}
        path="/cancellation-refund-policy/"
        locale={locale}
      />
      <Layout>
        <TrustStrip variant="thin" />

        {/* Hero */}
        <section style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #3a0404 0%, #1a0202 100%)' }}>
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent" />
          <div className="container-page py-14 sm:py-16">
            {/* No tracking/uppercase on the Hindi label — it splits Devanagari conjuncts (LANDMINES). */}
            <p className={`font-bold text-gold/60 mb-3 ${isHi ? 'text-xs' : 'text-[10px] uppercase tracking-[0.3em]'}`}>
              {isHi ? 'कानूनी · रिफ़ंड' : 'Legal · Refunds'}
            </p>
            <h1 className={`font-bold text-white ${isHi ? 'font-sanskrit' : 'font-serif'}`}
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
              {isHi ? 'रद्दीकरण और रिफ़ंड नीति' : 'Cancellation & Refund Policy'}
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

            {/* Contact for cancellations */}
            <div className="mt-10 rounded-2xl border border-gold/40 p-7 text-center"
              style={{ background: 'linear-gradient(135deg, #fff 0%, #fdf8f0 100%)' }}>
              <p className={`font-bold text-maroon mb-2 ${isHi ? 'font-sanskrit text-base' : 'font-serif text-base'}`}>
                {isHi ? 'बुकिंग रद्द करनी है?' : 'Need to cancel a booking?'}
              </p>
              <p className="text-sm text-ink-soft mb-4">
                {isHi ? `फ़ोन: ${SITE.phone} · ईमेल: ${SITE.email}` : `Phone: ${SITE.phone} · Email: ${SITE.email}`}
              </p>
              <a href={SITE.whatsapp} target="_blank" rel="noopener"
                className="inline-flex items-center gap-2 rounded-xl bg-maroon
                  px-6 py-3 font-semibold text-white text-sm
                  hover:bg-maroon/90 transition-colors">
                {isHi ? 'WhatsApp पर संदेश भेजें' : 'Message us on WhatsApp'}
              </a>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
