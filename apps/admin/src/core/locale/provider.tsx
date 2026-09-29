import { getCurrentLang, setCurrentLang } from '@workspace/web-i18n';
import { useState } from 'react';

import { LOCALE_OPTIONS, LocaleProviderContext } from './hook';

const DEFAULT_LOCALE = LOCALE_OPTIONS[0].value;

function isLangType(value: string): value is App.I18n.LangType {
  return LOCALE_OPTIONS.some((option) => option.value === value);
}

export interface LocaleProviderProps {
  /** 子组件 */
  children: React.ReactNode;
}

export const LocaleProvider = (props: LocaleProviderProps) => {
  const { children } = props;

  const [locale, setLocale] = useState<App.I18n.LangType>(() => {
    const current = getCurrentLang();
    if (isLangType(current)) return current;
    return DEFAULT_LOCALE;
  });

  return (
    <LocaleProviderContext
      value={{
        locale,
        localeOptions: LOCALE_OPTIONS,
        setLocale: (lang) => {
          void setCurrentLang(lang);
          setLocale(lang);
        },
      }}
    >
      {children}
    </LocaleProviderContext>
  );
};
