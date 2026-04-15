import type { PluginOption } from 'vite';
import path from 'node:path';
import process from 'node:process';
import createSvgIconsPlugin from 'unplugin-svg-component/vite';

const PRESERVE_COLOR_RE = /.*\.svg$/;
const SVG_EXT_RE = /\.svg$/;

/**
 * 配置unplugin-svg-component vite 插件
 * @param viteEnv - 环境变量配置文件
 * @see {@link https://github.com/Jevon617/unplugin-svg-component}
 */
export function setupUnPluginSvgIconConfig(viteEnv: Env.ImportMeta) {
  const { VITE_ICON_PREFIX } = viteEnv;

  const plugins: PluginOption = createSvgIconsPlugin({
    projectType: 'react',
    iconDir: path.join(process.cwd(), 'src/assets/svg-icon'),
    dts: true,
    dtsDir: path.join(process.cwd(), 'src/types'),
    prefix: VITE_ICON_PREFIX,
    componentName: 'LocalSvgIcon',
    treeShaking: false,
    preserveColor: PRESERVE_COLOR_RE, // 保留多色图标的原始颜色
    symbolIdFormatter: (svgName: string, prefix: string): string => {
      const nameArr = svgName.split('/');
      if (prefix)
        nameArr.unshift(prefix);
      return nameArr.join('-').replace(SVG_EXT_RE, '');
    },
  });

  return plugins;
}
