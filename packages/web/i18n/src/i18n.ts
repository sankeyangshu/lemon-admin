import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import type { SetupI18nOptions } from './types';

// oxlint-disable-next-line import/no-named-as-default-member
export const i18n = i18next.use(LanguageDetector).use(initReactI18next);

export const $t = i18n.t.bind(i18n);

/**
 * 同步当前语言到 `<html lang="...">` 属性
 * @param lng - 语言代码
 */
function syncHtmlLang(lng: string) {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = lng;
}

/**
 * 设置国际化
 * @param options - 国际化配置
 */
export async function setupI18n<TLang extends string>(options: SetupI18nOptions<TLang> = {}) {
  if (i18n.isInitialized) {
    syncHtmlLang(i18n.language);
    return;
  }

  const { fallbackLng, missingWarn, resources = {}, i18nextOptions, detection } = options;

  // 必须在 init 之前订阅：init 过程会触发 languageChanged，挂晚了会丢第一次
  i18n.on('languageChanged', syncHtmlLang);

  await i18n.init({
    fallbackLng,
    ignoreJSONStructure: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    resources, // 语言资源
    supportedLngs: Object.keys(resources),
    saveMissing: missingWarn, // 缺 key 时把 key 交给 missingKeyHandler；DEV 下配合上面的 warn
    missingKeyHandler(currentLng, _namespace, key) {
      if (missingWarn && key.includes('.')) {
        console.warn(`[i18next] Not found '${key}' key in '${currentLng}' locale messages.`);
      }
    },
    detection: {
      order: ['localStorage', 'navigator'], // 检测顺序
      caches: ['localStorage'], // 缓存到 localStorage
      lookupLocalStorage: 'language', // LocalStorage 键名
      convertDetectedLanguage: (lng: string) => lng.replace(/_/g, '-'), // 将 zh_CN 转换为 zh-CN
      ...detection,
    },
    ...i18nextOptions,
  });
}

/**
 * 设置当前语言
 * @param lng - 语言代码
 */
export async function setLng(lng: string) {
  await i18n.changeLanguage(lng);
}

/**
 * 获取当前语言
 */
export function getCurrentLang() {
  return i18n.language;
}
