import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { useI18n } from '../i18n';

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> };

declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}

/**
 * "Install on your phone" for visitors who reach /app/ from a browser (the website's
 * app promo card sends them here). Chrome fires `beforeinstallprompt` only when the
 * page is installable and the app is not installed yet, so the button appears only
 * when a tap can actually install something — inside the Android app, or once
 * installed, it never shows.
 *
 * GA4: `app_install_prompt` (shown/accepted/dismissed) and `app_install` on success.
 */
export function InstallPrompt() {
  const { locale } = useI18n();
  const hi = locale === 'hi';
  const [evt, setEvt] = useState<InstallEvent | null>(null);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvt(e as InstallEvent);
      window.gtag?.('event', 'app_install_prompt', { state: 'shown' });
    };
    const onInstalled = () => {
      setEvt(null);
      window.gtag?.('event', 'app_install', { via: 'pwa' });
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (!evt) return null;

  const install = async () => {
    await evt.prompt();
    const { outcome } = await evt.userChoice;
    window.gtag?.('event', 'app_install_prompt', { state: outcome });
    setEvt(null);
  };

  return (
    <button
      type="button"
      onClick={install}
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-4 py-3 font-bold text-maroon-900 shadow-md hover:bg-gold-light"
    >
      <Download className="h-5 w-5" aria-hidden />
      {hi ? 'फ़ोन में ऐप इंस्टॉल करें' : 'Install the app on your phone'}
    </button>
  );
}
