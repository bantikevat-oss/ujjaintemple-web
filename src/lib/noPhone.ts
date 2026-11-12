import { useLocation } from 'react-router-dom';

/**
 * 🔴 No phone number AND no WhatsApp on INFORMATIONAL pages (Aman, 2026-11-12: "make sure
 * informational call nahi aaye … without impacting SEO and other leads"; later the same day,
 * on 84 Mahadev: "in pages pe whatsapp bhi hta do … call now bhi na dikhe").
 *
 * Why: temple pages are ~2,100 of the site's GSC clicks a month (Kal Bhairav alone ~580).
 * People landing there for darshan timings saw our number and called it as if it were the
 * temple — 10-15 calls a day asking about the mandir, none of them a booking. GA4 (30 days to
 * 11-12): temple pages gave 59 of ~139 call taps but only 4 form leads.
 *
 * On these pages the number is not shown, not linked (tel:) and not put in any schema, and
 * there is no WhatsApp button (footer strip, mobile sticky bar, editor's notes). The only
 * contact path is the enquiry form, so every request arrives as a written lead. The number
 * and WhatsApp stay everywhere a caller is a buyer: cab/taxi pages, tour packages (incl. the
 * 84 Mahadev parikrama package), hotels, cab booking, puja pages (puja leads), the Simhastha
 * hub/stay/transport/budget guides, home, contact.
 *
 * Slugs are written out instead of imported from the data files because this runs in the
 * global header and footer. Add a slug here when a new informational page is added.
 * The PHP news section (/hi/simhastha-2028-news/) has no number either — see
 * public/news/templates/*.php.
 */
const INFO_EXACT = new Set([
  // Deity-group list pages (data/deity-lists.ts)
  '/navgrah-mandir-ujjain/',
  '/bhairav-mandir-ujjain/',
  '/ganesh-mandir-ujjain/',
  // 84 Mahadev list (its parikrama package page keeps the number — it sells)
  '/84-mahadev-ujjain/',
  // Guides with no product of their own
  '/things-to-do-in-ujjain/',
  '/tour-and-travel-ujjain/best-places-to-visit-ujjain/',
  '/tour-and-travel-ujjain/mahakaleshwar-darshan-guide/',
  '/tour-and-travel-ujjain/ujjain-travel-guide/',
  // Simhastha history / culture / news-style articles (not the stay, transport, budget,
  // tour-package or from-Indore/Bhopal guides — those sell)
  '/simhastha-2028/simhastha-ujjain-me-kyun/',
  '/simhastha-2028/peshwai-chhavni-pravesh/',
  '/simhastha-2028/snan-ghats-ujjain/',
  '/simhastha-2028/simhastha-aur-kumbh-antar/',
  '/simhastha-2028/kalpvas-guide/',
  '/simhastha-2028/sadhus-naga-babas-simhastha/',
  '/simhastha-2028/akhada-traditions-ujjain/',
  '/simhastha-2028/history-of-simhastha-ujjain/',
  '/simhastha-2028/simhastha-2028-preparations/',
]);

export function isTempleInfoPath(pathname: string): boolean {
  let p = pathname.split('?')[0].split('#')[0].replace(/^\/hi(?=\/|$)/, '') || '/';
  if (!p.endsWith('/')) p += '/';
  if (p.startsWith('/mandirs/')) return true;
  return INFO_EXACT.has(p);
}

/** true on informational pages — callers hide the phone number, tel: links and WhatsApp. */
export function useNoPhone(): boolean {
  const { pathname } = useLocation();
  return isTempleInfoPath(pathname);
}
