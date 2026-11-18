import { I18nProvider } from '../i18n';
import { SimhasthaYatraList } from './SimhasthaYatraList';

/** Lazy route entry for /simhastha-2028/simhastha-2028-yatra-list/ (own chunk, same pattern as SimhasthaRoute). */
export function YatraListEn() {
  return (
    <I18nProvider locale="en">
      <SimhasthaYatraList />
    </I18nProvider>
  );
}

export function YatraListHi() {
  return (
    <I18nProvider locale="hi">
      <SimhasthaYatraList />
    </I18nProvider>
  );
}
