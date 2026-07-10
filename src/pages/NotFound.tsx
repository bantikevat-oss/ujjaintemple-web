import { Link } from 'react-router-dom';
import { Phone, Home } from 'lucide-react';
import { Layout } from '../components/global/Layout';
import { SEOHead } from '../components/global/SEOHead';
import { useI18n } from '../i18n';
import { SITE } from '../lib/site';

export function NotFound() {
  const { locale } = useI18n();
  const prefix = locale === 'en' ? '' : '/hi';
  return (
    <>
      <SEOHead
        title={locale === 'hi' ? 'पेज नहीं मिला (404) | Ujjain Temple' : 'Page Not Found (404) | Ujjain Temple'}
        description={locale === 'hi' ? 'यह पेज उपलब्ध नहीं है। मुख्य पेज पर जाएँ या कॉल करें।' : 'This page is not available. Go to homepage or call us.'}
        path="/404/"
        locale={locale}
      />
      <Layout>
        <section className="container-page py-16 text-center sm:py-24">
          <p className="text-7xl font-bold text-maroon/40">404</p>
          <h1 className="mt-4 font-serif text-2xl font-bold text-maroon sm:text-4xl">
            {locale === 'hi' ? 'यह पेज नहीं मिला' : 'This page could not be found'}
          </h1>
          <p className="mt-3 text-base text-ink-soft">
            {locale === 'hi'
              ? 'जो आप ढूंढ रहे हैं वह यहाँ नहीं है — मुख्य पेज पर जाएँ या सीधे हमें कॉल करें।'
              : "What you're looking for isn't here — go to the homepage or call us directly."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to={`${prefix}/`} className="btn-secondary"><Home className="h-4 w-4" /> {locale === 'hi' ? 'होम' : 'Home'}</Link>
            <a href={SITE.phoneTel} className="btn-call"><Phone className="h-4 w-4" /> {SITE.phone}</a>
          </div>
        </section>
      </Layout>
    </>
  );
}
