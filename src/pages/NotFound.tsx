import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Home } from 'lucide-react';
import { Layout } from '../components/global/Layout';
import { SEOHead } from '../components/global/SEOHead';
import { useI18n } from '../i18n';
import { SITE } from '../lib/site';
import { isServerRoute } from '../lib/serverRoutes';

export function NotFound() {
  const { locale } = useI18n();
  const location = useLocation();
  const prefix = locale === 'en' ? '' : '/hi';

  /**
   * Safety net for the PHP-SSR news section.
   *
   * Those paths have no React route, so a `<Link>` anywhere on the site lands the
   * user here even though the server serves the page perfectly on a reload — the
   * "first click 404s, refresh works" bug. Links are fixed at the source (see
   * lib/serverRoutes.ts), but any link we miss now self-corrects with one real
   * navigation instead of showing a dead end. `replace` keeps Back working.
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isServerRoute(location.pathname)) {
      window.location.replace(location.pathname + location.search + location.hash);
    }
  }, [location.pathname, location.search, location.hash]);
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
