import type { Plugin } from 'vite';

/**
 * 配置html vite 插件
 * @param lastBuildTime - 最后编译时间
 */
export function setupHtmlPluginConfig(lastBuildTime: string) {
  const plugin: Plugin = {
    name: 'vite-plugin-html',
    apply: 'build',
    transformIndexHtml(html: string) {
      return html.replace('<head>', `<head>\n    <meta name="buildTime" content="${lastBuildTime}">`);
    },
  };

  return plugin;
}
