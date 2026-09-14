import tailwindcss from '@tailwindcss/vite';

export type TailwindPluginOptions = NonNullable<Parameters<typeof tailwindcss>[0]>;

/**
 * 配置 tailwindcss vite 插件
 * @param options - 配置选项
 */
export function setupTailwindPluginConfig(options: TailwindPluginOptions = {}) {
  return tailwindcss(options);
}
