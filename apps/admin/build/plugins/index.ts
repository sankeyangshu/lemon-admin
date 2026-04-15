import type { PluginOption } from 'vite';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import viteRestart from 'vite-plugin-restart';
import { setupHtmlPluginConfig } from './html';
import { setupUnPluginSvgIconConfig } from './unplugin';

/**
 * 配置 vite 插件
 * @param viteEnv vite 环境变量配置文件键值对 object
 * @param lastBuildTime 最后编译时间
 */
export function createVitePlugins(viteEnv: Env.ImportMeta, lastBuildTime: string) {
  const vitePlugins: PluginOption = [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routesDirectory: './src/pages',
    }),

    react(),

    babel({ presets: [reactCompilerPreset()] }),

    tailwindcss(),

    setupUnPluginSvgIconConfig(viteEnv),

    // 通过这个插件，再修改vite.config.ts文件则不需要重新运行也生效配置
    viteRestart({
      restart: ['vite.config.ts'],
    }),

    setupHtmlPluginConfig(lastBuildTime),
  ];

  return vitePlugins;
}
