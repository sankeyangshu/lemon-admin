import enUS from './modules/en-us';
import zhCN from './modules/zh-cn';

const resources: Record<App.I18n.LangType, { translation: App.I18n.I18nScheme }> = {
  'en-US': { translation: enUS },
  'zh-CN': { translation: zhCN },
};

export default resources;
