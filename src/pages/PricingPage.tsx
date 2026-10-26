import { Layout } from '../components/global/Layout';
import { SEOHead } from '../components/global/SEOHead';
import { TrustStrip } from '../components/global/TrustStrip';
import { CabFareTable } from '../components/global/CabFareTable';
import { useI18n } from '../i18n';
import { SITE } from '../lib/site';

/**
 * Pricing — the sixth of the six policy pages Razorpay reviews (see pages/LegalRoute.tsx).
 * Cab fares come only from data/rates.ts via CabFareTable. Packages and puja have no fixed
 * card yet (Aman, 2026-10-26), so they are described as quoted-in-writing-before-payment.
 */
const NOTES = {
  hi: [
    {
      title: 'टूर पैकेज और पूजा व्यवस्था',
      body: 'कई दिन के टूर पैकेज और पूजा व्यवस्था का किराया तारीख़, लोगों की संख्या और गाड़ी पर निर्भर करता है। हर बुकिंग का पूरा दाम — क्या शामिल है और क्या नहीं — भुगतान से पहले WhatsApp या ईमेल पर लिखकर भेजा जाता है।',
    },
    {
      title: 'भुगतान',
      body: 'भुगतान हमारे द्वारा भेजे गए पेमेंट लिंक से ऑनलाइन, या बुकिंग के समय तय तरीके से UPI या नकद किया जा सकता है। सभी दाम भारतीय रुपये (₹) में हैं।',
    },
    {
      title: 'रद्द करना और रिफ़ंड',
      body: 'बुकिंग रद्द करने और रिफ़ंड की शर्तें रद्दीकरण और रिफ़ंड नीति पेज पर दी गई हैं।',
    },
  ],
  en: [
    {
      title: 'Tour packages and puja arrangements',
      body: 'Multi-day tour packages and puja arrangements are priced by date, number of travellers and vehicle. The full price for each booking — what is included and what is not — is sent in writing on WhatsApp or email before any payment.',
    },
    {
      title: 'Payment',
      body: 'Payment can be made online through the payment link we send, or by UPI or cash as agreed at booking. All prices are in Indian Rupees (₹).',
    },
    {
      title: 'Cancellation and refunds',
      body: 'Cancellation and refund terms are set out on the Cancellation & Refund Policy page.',
    },
  ],
};

export function PricingPage() {
  const { locale } = useI18n();
  const isHi = locale === 'hi';

  return (
    <>
      <SEOHead
        title={isHi ? 'किराया और दाम — UjjainTemple.com' : 'Pricing — UjjainTemple.com'}
        description={isHi
          ? 'UjjainTemple.com के तय कैब किराए — ओंकारेश्वर, उज्जैन लोकल दर्शन और इंदौर एयरपोर्ट। टोल, पार्किंग और ड्राइवर शामिल।'
          : 'Fixed cab fares on UjjainTemple.com — Omkareshwar, Ujjain local darshan and Indore Airport. Toll, parking and driver included.'}
        path="/pricing/"
        locale={locale}
      />
      <Layout>
        <TrustStrip variant="thin" />

        <section style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #3a0404 0%, #1a0202 100%)' }}>
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent" />
          <div className="container-page py-14 sm:py-16">
            <p className={`font-bold text-gold/60 mb-3 ${isHi ? 'text-xs' : 'text-[10px] uppercase tracking-[0.3em]'}`}>
              {isHi ? 'किराया · दाम' : 'Pricing · Fares'}
            </p>
            <h1 className={`font-bold text-white ${isHi ? 'font-sanskrit' : 'font-serif'}`}
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
              {isHi ? 'किराया और दाम' : 'Pricing'}
            </h1>
            <p className="mt-2 text-sm text-cream/50">
              ByteFlow Technologies Pvt Ltd · UjjainTemple.com
            </p>
          </div>
        </section>

        <section className="bg-cream">
          <div className="container-page py-10 sm:py-14 max-w-4xl">
            <CabFareTable routes={['omkareshwar-round', 'omkareshwar-oneway', 'ujjain-local', 'indore-airport']} locale={locale} source="pricing" />

            <div className="space-y-6">
              {NOTES[locale].map((s) => (
                <div key={s.title} className="rounded-2xl bg-white border border-gold/25 p-7">
                  <h2 className={`font-bold text-maroon mb-3 text-base sm:text-lg ${isHi ? 'font-sanskrit' : 'font-serif'}`}>{s.title}</h2>
                  <p className="text-sm leading-[1.9] text-ink-soft">{s.body}</p>
                </div>
              ))}
            </div>

            <p className="mt-8 text-center text-sm text-ink-soft">
              {isHi ? 'सवाल हो तो कॉल करें: ' : 'Questions? Call '}
              <a className="font-semibold text-maroon" href={SITE.phoneTel}>{SITE.phone}</a>
              {' · '}
              <a className="font-semibold text-maroon" href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </p>
          </div>
        </section>
      </Layout>
    </>
  );
}
