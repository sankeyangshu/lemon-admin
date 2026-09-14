import react from '@vitejs/plugin-react';

export type ReactPluginOptions = NonNullable<Parameters<typeof react>[0]>;

/**
 * 配置 react vite 插件
 * @param options - 配置选项
 */
export function setupReactPluginConfig(options: ReactPluginOptions = {}) {
  return react(options);
}
