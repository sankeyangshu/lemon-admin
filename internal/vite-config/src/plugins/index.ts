import type { PluginOption } from 'vite';

import { setupBabelPluginConfig, type BabelPluginOptions } from './babel';
import { setupHtmlPluginConfig, type HtmlPluginOptions } from './html';
import { setupReactPluginConfig, type ReactPluginOptions } from './react';
import { setupRouterPluginConfig, type RouterPluginOptions } from './router';
import { setupTailwindPluginConfig, type TailwindPluginOptions } from './tailwind';
import { setupUnPluginSvgIconConfig, type UnPluginIconOptions } from './unplugin-icon';

/** `false` 关闭该插件；对象为选项；省略则用默认并开启 */
type MaybePluginConfig<T> = false | T;

export * from './react';
export * from './babel';
export * from './router';
export * from './tailwind';
export * from './unplugin-icon';
export * from './html';

/** 内置插件开关、选项，以及自定义插件插入位置 */
interface VitePluginsConfig {
  /** 插入到内置预设之前的插件 */
  prependPlugins?: PluginOption[];

  /** React 插件配置 */
  react?: MaybePluginConfig<ReactPluginOptions>;

  /** Babel 插件配置 */
  babel?: MaybePluginConfig<BabelPluginOptions>;

  /** Router 插件配置 */
  router?: MaybePluginConfig<RouterPluginOptions>;

  /** Tailwind 插件配置 */
  tailwind?: MaybePluginConfig<TailwindPluginOptions>;

  /** SVG Icon 插件配置 */
  unpluginIcon?: MaybePluginConfig<Partial<UnPluginIconOptions>>;

  /** Html 插件配置 */
  html?: MaybePluginConfig<Omit<HtmlPluginOptions, 'lastBuildTime'>>;

  /** 插入到内置预设之后的插件 */
  appendPlugins?: PluginOption[];
}

/**
 * 组装 Vite 内置插件预设。 构建时间和插件开关分开传，避免揉进一个 options 袋。
 * @param lastBuildTime - 注入 html meta 的构建时间
 * @param pluginConfig - 内置插件开关 / 选项，以及 prepend / append
 */
export function setupVitePlugins(lastBuildTime: string, pluginConfig: VitePluginsConfig = {}) {
  const {
    prependPlugins = [],
    router,
    react: reactOptions,
    babel,
    tailwind,
    unpluginIcon,
    html,
    appendPlugins = [],
  } = pluginConfig;

  /** 是否启用 React 插件，默认开启 */
  const enableReact = reactOptions !== false;
  const plugins: PluginOption[] = [...prependPlugins];

  if (router !== false) {
    plugins.push(setupRouterPluginConfig(router));
  }

  if (reactOptions !== false) {
    plugins.push(setupReactPluginConfig(reactOptions));
  }

  if (babel !== false && (enableReact || babel !== undefined)) {
    plugins.push(setupBabelPluginConfig(babel));
  }

  if (tailwind !== false) {
    plugins.push(setupTailwindPluginConfig(tailwind));
  }

  if (unpluginIcon !== false) {
    plugins.push(setupUnPluginSvgIconConfig(unpluginIcon));
  }

  if (html !== false) {
    plugins.push(
      setupHtmlPluginConfig({
        ...html,
        lastBuildTime,
      })
    );
  }

  plugins.push(...appendPlugins);

  return plugins;
}
