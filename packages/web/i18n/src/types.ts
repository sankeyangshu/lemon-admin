import type { InitOptions, ResourceLanguage } from 'i18next';
import type { DetectorOptions } from 'i18next-browser-languagedetector';

/** 应用端传入的 i18n 初始化参数 */
export interface SetupI18nOptions<TLang extends string = string> {
  /** 词条缺失时回退的语言，必须是 `resources` 的 key */
  fallbackLng?: NoInfer<TLang>;

  /** 额外的 i18next init 选项 */
  i18nextOptions?: Omit<InitOptions, 'detection' | 'fallbackLng' | 'lng' | 'resources'>;

  /** 是否在缺失翻译 key 时打印警告 */
  missingWarn?: boolean;

  /** 应用端的 语言文件资源 */
  resources?: Record<TLang, ResourceLanguage>;

  /** 覆盖默认的语言探测 / 缓存配置。 */
  detection?: DetectorOptions;
}
