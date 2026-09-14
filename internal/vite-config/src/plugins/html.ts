import type { Plugin } from 'vite';

export interface HtmlPluginOptions {
  /** 最后编译时间. */
  lastBuildTime: string;

  /** 注入的 meta 标签名称. */
  metaName?: string;
}

/**
 * 配置html vite 插件
 * @param options - 配置选项
 */
export function setupHtmlPluginConfig(options: HtmlPluginOptions) {
  const { lastBuildTime, metaName = 'buildTime' } = options;

  const plugin: Plugin = {
    name: 'vite-plugin-html',
    apply: 'build',
    transformIndexHtml() {
      return [
        {
          tag: 'meta',
          attrs: { name: metaName, content: lastBuildTime },
          injectTo: 'head-prepend' as const,
        },
      ];
    },
  };

  return plugin;
}
