import { createContext, use } from 'react';

export const LOCALE_OPTIONS: App.I18n.LangOption[] = [
  {
    value: 'zh-CN',
    text: '简体中文',
  },
  {
    value: 'en-US',
    text: 'English',
  },
];

export interface LocaleProviderState {
  /** 当前语言 */
  locale: App.I18n.LangType;
  /** 可选语言列表 */
  localeOptions: App.I18n.LangOption[];
  /** 切换语言 */
  setLocale: (locale: App.I18n.LangType) => void;
}

export const LocaleProviderContext = createContext<LocaleProviderState | null>(null);

export function useLocale() {
  const context = use(LocaleProviderContext);

  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }

  return context;
}
