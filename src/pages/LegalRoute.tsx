import { I18nProvider, type Locale } from '../i18n';
import { AboutPage } from './AboutPage';
import { ContactPage } from './ContactPage';
import { PrivacyPage } from './PrivacyPage';
import { TermsPage } from './TermsPage';

/**
 * Lazy route entry for the four standing pages — About, Contact, Privacy, Terms.
 *
 * Grouped into ONE chunk on purpose. Individually they are small, but together they were
 * ~60 KB of source sitting in the `app` entry chunk and being downloaded by every visitor
 * to a temple or transport page, none of whom are reading the privacy policy. They are
 * also the pages a single visitor is most likely to open in sequence (About → Contact),
 * so one shared chunk costs one request instead of two.
 *
 * These four matter beyond their traffic: they are four of the six policy pages Razorpay
 * requires before a site can be added to a merchant account (the two still missing are
 * Pricing details and Cancellation/Refund). Keep them cheap to extend — when those two are
 * written they belong in this chunk too.
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
