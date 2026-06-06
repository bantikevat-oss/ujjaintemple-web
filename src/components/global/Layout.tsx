import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { StickyCallBar } from './StickyCallBar';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main id="main" className="min-h-[60vh]">{children}</main>
      <Footer />
      <StickyCallBar />
    </>
  );
}
