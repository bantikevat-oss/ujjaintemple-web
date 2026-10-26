import { I18nProvider, type Locale } from '../i18n';
import { AboutPage } from './AboutPage';
import { ContactPage } from './ContactPage';
import { PricingPage } from './PricingPage';
import { PrivacyPage } from './PrivacyPage';
import { RefundPage } from './RefundPage';
import { TermsPage } from './TermsPage';

/**
 * Lazy route entry for the standing pages — About, Contact, Privacy, Terms, Cancellation & Refund, Pricing.
 *
 * Grouped into ONE chunk on purpose. Individually they are small, but together they were
 * ~60 KB of source sitting in the `app` entry chunk and being downloaded by every visitor
 * to a temple or transport page, none of whom are reading the privacy policy. They are
 * also the pages a single visitor is most likely to open in sequence (About → Contact),
 * so one shared chunk costs one request instead of two.
 *
 * These matter beyond their traffic: with Pricing they are the six policy pages Razorpay
 * requires before a site can be added to a merchant account.
 *
 * As in `pages/mandirs/DetailRoute.tsx`, locale is bound at module scope because
 * react-router's `lazy` returns a Component, not props.
 */
const wrap = (locale: Locale, Page: React.FC) => () => (
  <I18nProvider locale={locale}>
    <Page />
  </I18nProvider>
);

export const AboutEn = wrap('en', AboutPage);
export const AboutHi = wrap('hi', AboutPage);
export const ContactEn = wrap('en', ContactPage);
export const ContactHi = wrap('hi', ContactPage);
export const PrivacyEn = wrap('en', PrivacyPage);
export const PrivacyHi = wrap('hi', PrivacyPage);
export const TermsEn = wrap('en', TermsPage);
export const TermsHi = wrap('hi', TermsPage);
export const RefundEn = wrap('en', RefundPage);
export const RefundHi = wrap('hi', RefundPage);
export const PricingEn = wrap('en', PricingPage);
export const PricingHi = wrap('hi', PricingPage);
