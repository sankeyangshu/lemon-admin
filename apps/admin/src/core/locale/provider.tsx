import { getCurrentLang, setCurrentLang } from '@workspace/web-i18n';
import { useState } from 'react';

import { LOCALE_OPTIONS, LocaleProviderContext } from './hook';

export interface LocaleProviderProps {
  /** 子组件 */
  children: React.ReactNode;
}

export const LocaleProvider = (props: LocaleProviderProps) => {
  const { children } = props;

  const [locale, setLocale] = useState<App.I18n.LangType>(
    () => getCurrentLang() as App.I18n.LangType
  );

  return (
    <LocaleProviderContext
      value={{
        locale,
        localeOptions: LOCALE_OPTIONS,
        setLocale: (lang) => {
          setCurrentLang(lang);
          setLocale(lang);
        },
      }}
    >
      {children}
    </LocaleProviderContext>
  );
};
