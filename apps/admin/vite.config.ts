import type { ConfigEnv, UserConfig } from 'vite';
import process from 'node:process';
import { defineConfig, loadEnv } from 'vite';
import { createProxy, getLastBuildTime, wrapperEnv } from './build/config';
import { createVitePlugins } from './build/plugins';

// https://vite.dev/config/
export default defineConfig((config: ConfigEnv): UserConfig => {
  const root = process.cwd();
  const { mode } = config;

  const viteEnv = wrapperEnv(loadEnv(mode, root));

  const lastBuildTime = getLastBuildTime();

  return {
    base: viteEnv.VITE_BASE_URL || '/',
    root,

    // 加载插件
    plugins: createVitePlugins(viteEnv, lastBuildTime),

    resolve: {
      tsconfigPaths: true, // 开启 TS 路径别名
    },

    // 跨域代理
    server: {
      host: true,
      open: viteEnv.VITE_OPEN,
      port: viteEnv.VITE_PORT,
      forwardConsole: true, // 把浏览器 console 转发到终端
      proxy: createProxy(viteEnv.VITE_PROXY),
    },

    // 定义全局常量替换方式
    define: {
      BUILD_TIME: JSON.stringify(lastBuildTime),
    },

    build: {
      outDir: viteEnv.VITE_OUTPUT_DIR || 'dist',
      reportCompressedSize: false,
      chunkSizeWarningLimit: 2000,
      rolldownOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
          entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
          assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
          minify: viteEnv.VITE_DROP_CONSOLE
            ? { compress: { dropConsole: true } }
            : undefined,
        },
      },
    },
  };
});
