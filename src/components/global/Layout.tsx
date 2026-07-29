import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { StickyCallBar } from './StickyCallBar';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname, hash } = useLocation();
  // New route → open from top; skip when navigating to an in-page anchor (e.g. #puja-booking)
  useEffect(() => {
    if (typeof window !== 'undefined' && !hash) window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <>
      <Header />
      <main id="main" className="min-h-[60vh]">{children}</main>
      <Footer />
      <StickyCallBar />
    </>
  );
}
