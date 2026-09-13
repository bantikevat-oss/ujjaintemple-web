import type { FC } from 'react';
import { I18nProvider, type Locale } from '../i18n';
import type { AppTab } from './lib';
import { AppHome } from './pages/AppHome';
import { AppNews } from './pages/AppNews';
import { AppCalendar } from './pages/AppCalendar';
import { AppMandirs } from './pages/AppMandirs';
import { AppMahadev84 } from './pages/AppMahadev84';
import { AppPlan } from './pages/AppPlan';

const SCREENS: Record<AppTab, FC> = {
  '': AppHome,
  'news/': AppNews,
  'calendar/': AppCalendar,
  'mandirs/': AppMandirs,
  '84-mahadev/': AppMahadev84,
  'plan/': AppPlan,
};

/** One stable component per (locale, tab), so the router never remounts a screen for nothing. */
function build(locale: Locale): Record<AppTab, FC> {
  const out = {} as Record<AppTab, FC>;
  for (const tab of Object.keys(SCREENS) as AppTab[]) {
    const Screen = SCREENS[tab];
    const Localised: FC = () => (
      <I18nProvider locale={locale}>
        <Screen />
      </I18nProvider>
    );
    out[tab] = Localised;
  }
  return out;
}

export const APP_SCREENS: Record<Locale, Record<AppTab, FC>> = { hi: build('hi'), en: build('en') };
