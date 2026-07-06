import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ChevronDown, ChevronRight } from 'lucide-react';
import { useI18n } from '../../i18n';
import { SITE } from '../../lib/site';

interface NavItem {
  key?: string;
  labelHi?: string;
  labelEn?: string;
  href?: string;
  children?: NavItem[];
}

const navTree: NavItem[] = [
  { key: 'nav.home', href: '/' },
  {
    key: 'nav.mandirs',
    href: '/mandirs/',
    children: [
      { labelHi: 'उज्जैन दर्शन सूची (10 मंदिर)', labelEn: 'Ujjain Darshan List (10 Temples)', href: '/mandirs/' },
      { labelHi: '84 महादेव — चौरासी परिक्रमा', labelEn: '84 Mahadev — Chaurasi Parikrama', href: '/84-mahadev-ujjain/' },
      { labelHi: 'महाकालेश्वर ज्योतिर्लिंग', labelEn: 'Mahakaleshwar Jyotirlinga', href: '/mandirs/mahakaleshwar/' },
      { labelHi: 'श्री महाकाल लोक', labelEn: 'Shri Mahakal Lok', href: '/mandirs/mahakal-lok/' },
      { labelHi: 'काल भैरव मंदिर', labelEn: 'Kal Bhairav Temple', href: '/mandirs/kal-bhairav-ujjain/' },
      { labelHi: 'हरसिद्धि शक्तिपीठ', labelEn: 'Harsiddhi Shaktipeeth', href: '/mandirs/harsiddhi-mata/' },
      { labelHi: 'मंगलनाथ मंदिर', labelEn: 'Mangalnath Temple', href: '/mandirs/mangalnath/' },
      { labelHi: 'घूमने की जगह', labelEn: 'Things to Do', href: '/things-to-do-in-ujjain/' },
    ],
  },
  {
    key: 'nav.tours',
    href: '/tour-and-travel-ujjain/',
    children: [
      { labelHi: 'सभी टूर पैकेज', labelEn: 'All Tour Packages', href: '/tour-and-travel-ujjain/' },
      { labelHi: 'उज्जैन-ओंकारेश्वर दर्शन (2 दिन)', labelEn: 'Ujjain-Omkareshwar Darshan (2 Days)', href: '/tour-and-travel-ujjain/ujjain-omkareshwar-package/' },
      { labelHi: 'उज्जैन लोकल दर्शन (1 दिन)', labelEn: 'Ujjain Local Darshan (1 Day)', href: '/tour-and-travel-ujjain/ujjain-darshan-package/' },
      { labelHi: 'ओंकारेश्वर-महेश्वर-मांडू (4 दिन)', labelEn: 'Omkareshwar-Maheshwar-Mandu (4 Days)', href: '/tour-and-travel-ujjain/ujjain-omkareshwar-maheshwar-mandu-4-days/' },
      { labelHi: 'पंच ज्योतिर्लिंग (5 दिन)', labelEn: 'Panch Jyotirlinga (5 Days)', href: '/tour-and-travel-ujjain/panch-jyotirlinga-5-days/' },
      { labelHi: 'माँ बगलामुखी दर्शन (2 दिन)', labelEn: 'Maa Baglamukhi Darshan (2 Days)', href: '/tour-and-travel-ujjain/ujjain-baglamukhi-2-days/' },
    ],
  },
  {
    key: 'nav.puja',
    href: '/puja-in-ujjain/',
    children: [
      { labelHi: 'सभी पूजाएँ', labelEn: 'All Pujas', href: '/puja-in-ujjain/' },
      { labelHi: 'काल सर्प दोष निवारण', labelEn: 'Kaal Sarp Dosh Nivaran', href: '/puja-in-ujjain/kaal-sarp-dosh-nivaran/' },
      { labelHi: 'मंगल दोष निवारण', labelEn: 'Mangal Dosh Nivaran', href: '/puja-in-ujjain/mangal-dosh-nivaran/' },
      { labelHi: 'पितृ दोष निवारण', labelEn: 'Pitru Dosh Nivaran', href: '/puja-in-ujjain/pitru-dosh-nivaran/' },
      { labelHi: 'नवग्रह शांति', labelEn: 'Navgrah Shanti', href: '/puja-in-ujjain/navgrah-shanti/' },
      { labelHi: 'महामृत्युंजय पूजा', labelEn: 'Mahamrityunjaya Puja', href: '/puja-in-ujjain/mahamrityunjaya-puja/' },
      { labelHi: 'रुद्राभिषेक', labelEn: 'Rudrabhishek', href: '/puja-in-ujjain/rudrabhishek-ujjain/' },
    ],
  },
  {
    key: 'nav.cabBooking',
    href: '/cab-booking/',
    children: [
      { labelHi: 'उज्जैन में टैक्सी बुक करें', labelEn: 'Book Taxi in Ujjain', href: '/cab-booking/' },
      { labelHi: 'उज्जैन से ओंकारेश्वर कैब', labelEn: 'Ujjain to Omkareshwar Cab', href: '/transport-in-ujjain/ujjain-to-omkareshwar-cab/' },
      { labelHi: 'यातायात गाइड', labelEn: 'Transport Guide', href: '/transport-in-ujjain/' },
    ],
  },
  { key: 'nav.simhastha', href: '/simhastha-2028/' },
  { key: 'nav.hotels', href: '/hotels/' },
  { key: 'nav.contact', href: '/contact/' },
];

function MobileNavItem({ item, prefix, locale, t, depth = 0, closeMenu }: { item: NavItem, prefix: string, locale: 'hi' | 'en', t: (k: string) => string, depth?: number, closeMenu: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const label = item.key ? t(item.key) : (locale === 'hi' ? item.labelHi : item.labelEn) || '';
  const href = item.href ? `${prefix}${item.href}` : '#';

  return (
    <div className={`border-b border-cream-dark/50 ${depth > 0 ? 'ml-4 border-l-2 border-saffron/30 pl-2' : ''}`}>
      <div className="flex items-center justify-between">
        <Link to={href} className="block py-3 flex-1 font-medium text-ink hover:text-maroon" onClick={closeMenu}>
          {label}
        </Link>
        {hasChildren && (
          <button onClick={() => setIsOpen(!isOpen)} className="p-3 text-maroon hover:bg-cream-light rounded-md">
            <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>
      {hasChildren && isOpen && (
        <div className="flex flex-col">
          {item.children!.map((child, idx) => (
            <MobileNavItem key={idx} item={child} prefix={prefix} locale={locale} t={t} depth={depth + 1} closeMenu={closeMenu} />
          ))}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const { t, locale, altLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const prefix = locale === 'en' ? '' : '/hi';
  const altPrefix = altLocale === 'en' ? '' : '/hi';

  // Desktop recursive renderer
  const renderDesktopNav = (items: NavItem[], depth = 0) => {
    return items.map((item, idx) => {
      const hasChildren = item.children && item.children.length > 0;
      const label = item.key ? t(item.key) : (locale === 'hi' ? item.labelHi : item.labelEn) || '';
      const href = item.href ? `${prefix}${item.href}` : '#';
      const isActive = location.pathname === href;

      if (!hasChildren) {
        return (
          <li key={idx} className={`${depth > 0 ? 'block' : 'relative group'}`}>
            <Link 
              to={href} 
              className={`${depth === 0 ? 'flex items-center h-16 font-medium px-2' : 'block px-4 py-2.5 text-sm hover:bg-cream-light hover:text-maroon'} ${isActive ? 'text-maroon font-semibold' : 'text-ink'}`}
            >
              {label}
            </Link>
          </li>
        );
      }

      // Dropdown Item
      return (
        <li key={idx} className="relative group cursor-pointer">
          <Link 
            to={href} 
            className={`${depth === 0 ? 'flex items-center h-16 font-medium px-2' : 'flex items-center justify-between px-4 py-2.5 text-sm hover:bg-cream-light hover:text-maroon'} ${isActive ? 'text-maroon font-semibold' : 'text-ink'}`}
          >
            {label}
            {depth === 0 ? <ChevronDown className="w-4 h-4 ml-1 opacity-70" /> : <ChevronRight className="w-4 h-4 ml-1 opacity-70" />}
          </Link>
          
          <ul className={`
            absolute left-0 top-full bg-white shadow-xl rounded-b-md rounded-tr-md min-w-[280px] py-2 border-t-[3px] border-saffron
            opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100]
            ${depth > 0 ? 'left-full top-0 -mt-2 ml-1 rounded-tl-md' : ''}
          `}>
            {renderDesktopNav(item.children!, depth + 1)}
          </ul>
        </li>
      );
    });
  };

  return (
    <header className="sticky top-0 z-[100] bg-white shadow-md">
      {/* Top utility bar */}
      <div className="bg-maroon text-white">
        <div className="container-page flex items-center justify-between gap-3 py-1.5 text-xs sm:text-sm">
          <span className="hidden opacity-90 sm:inline">
            {locale === 'hi' ? 'उज्जैन मंदिर · सिंहस्थ 2028 · होटल · टैक्सी · दर्शन पैकेज' : 'Ujjain Temple · Simhastha 2028 · Hotel · Taxi · Darshan Package'}
          </span>
          <span className="text-xs opacity-90 sm:hidden">
            {locale === 'hi' ? '24×7 दर्शन सहायता' : '24×7 darshan help'}
          </span>
          <a href={SITE.phoneTel} className="flex items-center gap-1.5 whitespace-nowrap font-bold hover:opacity-90" aria-label={t('cta.call')}>
            <Phone className="h-3.5 w-3.5" /> {locale === 'hi' ? 'कॉल करें' : 'Call Now'}
          </a>
        </div>
      </div>

      {/* Main nav */}
      <nav className="container-page flex items-center justify-between">
        <Link to={`${prefix}/`} className="flex items-center gap-2 py-3" aria-label="UjjainTemple home">
          <span className="font-serif text-xl font-bold text-maroon sm:text-2xl">UjjainTemple</span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-3 text-sm">
          {renderDesktopNav(navTree)}
          <li className="ml-2">
            <a href={`${SITE.phoneTel}`} className="btn-call !py-2 !px-4 text-sm flex items-center gap-2">
              <Phone className="h-4 w-4" /> {locale === 'hi' ? 'कॉल करें' : 'Call Now'}
            </a>
          </li>
          <li className="ml-2">
            <Link to={`${altPrefix}/`} className="text-xs font-semibold text-link hover:underline bg-cream-light px-2 py-1 rounded" aria-label="Switch language">
              {t('lang.switchTo')}
            </Link>
          </li>
        </ul>

        <button
          onClick={() => setOpen(!open)}
          className="rounded-md p-2 text-maroon lg:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Nav */}
      {open && (
        <div className="border-t border-cream-dark bg-white px-4 pb-4 lg:hidden max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col">
            {navTree.map((item, idx) => (
              <MobileNavItem key={idx} item={item} prefix={prefix} locale={locale as 'hi' | 'en'} t={t} closeMenu={() => setOpen(false)} />
            ))}
            <div className="pt-4 mt-2 border-t border-cream-dark flex justify-between items-center">
              <a href={`${SITE.phoneTel}`} className="btn-call !py-2 !px-4 text-sm inline-flex items-center gap-2">
                <Phone className="h-4 w-4" /> {locale === 'hi' ? 'कॉल करें' : 'Call Now'}
              </a>
              <Link to={`${altPrefix}/`} className="text-sm font-bold text-link underline" onClick={() => setOpen(false)}>
                {t('lang.switchTo')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
