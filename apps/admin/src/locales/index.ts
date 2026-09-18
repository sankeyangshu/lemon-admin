import { setupI18n as setupI18nCore, type SetupI18nOptions } from '@workspace/web-i18n';

import localeResources from './locale';

/**
 * 初始化国际化
 */
export async function setupI18n(options: SetupI18nOptions<App.I18n.LangType> = {}) {
  await setupI18nCore({
    fallbackLng: 'zh-CN',
    resources: localeResources,
    missingWarn: import.meta.env.DEV,
    ...options,
    detection: {
      lookupLocalStorage: `${import.meta.env.VITE_STORAGE_PREFIX}-language`,
      ...options.detection,
    },
  });
}
