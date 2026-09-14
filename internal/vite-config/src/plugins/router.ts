import { tanstackRouter, type Config } from '@tanstack/router-plugin/vite';

export type RouterPluginOptions = Partial<Config>;

/**
 * 配置 tanstack router vite 插件
 * @param options - 配置选项
 */
export function setupRouterPluginConfig(options: RouterPluginOptions = {}) {
  return tanstackRouter({
    target: 'react',
    autoCodeSplitting: true,
    routesDirectory: './src/pages',
    ...options,
  });
}
