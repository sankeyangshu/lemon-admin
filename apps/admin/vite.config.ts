import process from 'node:process';

import { createProxy, getLastBuildTime, setupVitePlugins, wrapperEnv } from '@lemon/vite-config';
import { devtools as tanstackDevtools } from '@tanstack/devtools-vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
  const root = process.cwd();
  const viteEnv = wrapperEnv<Env.ImportMeta>(loadEnv(mode, root));
  const lastBuildTime = getLastBuildTime();
  const isServe = command === 'serve';

  return {
    base: viteEnv.VITE_BASE_URL || '/',
    root,

    // 加载插件
    plugins: setupVitePlugins(lastBuildTime, {
      appendPlugins: [tanstackDevtools()],
    }),

    resolve: {
      tsconfigPaths: true, // 开启 TS 路径别名
      dedupe: [
        'react',
        'react-dom',
        'react/jsx-dev-runtime',
        'react/jsx-runtime',
        '@tanstack/react-query',
        '@tanstack/react-router',
      ],
    },

    // 跨域代理
    server: {
      host: true,
      open: viteEnv.VITE_OPEN,
      port: viteEnv.VITE_PORT,
      forwardConsole: true, // 把浏览器 console 转发到终端
      proxy: createProxy(viteEnv.VITE_PROXY),
      warmup: {
        clientFiles: ['./index.html'],
      },
    },

    // 定义全局常量替换方式
    define: {
      __DEV__: JSON.stringify(isServe),
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
          minify: viteEnv.VITE_DROP_CONSOLE ? { compress: { dropConsole: true } } : undefined,
        },
      },
    },
  };
});
