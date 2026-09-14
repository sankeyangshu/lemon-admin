import UnpluginSvgComponent from 'unplugin-svg-component/vite';

export type UnPluginIconOptions = NonNullable<Parameters<typeof UnpluginSvgComponent>[0]>;

/**
 * 配置 unplugin-svg-component vite 插件
 * @param options - 配置选项
 * @see {@link https://github.com/Jevon617/unplugin-svg-component}
 */
export function setupUnPluginSvgIconConfig(options: Partial<UnPluginIconOptions> = {}) {
  return UnpluginSvgComponent({
    projectType: 'react',
    iconDir: './src/assets/svg-icon',
    dts: true,
    dtsDir: './src/types',
    componentName: 'LocalSvgIcon',
    preserveColor: /.*\.svg$/, // 保留多色图标的原始颜色
    symbolIdFormatter: (svgName: string, prefix: string): string => {
      const nameArr = svgName.split('/');
      if (prefix) nameArr.unshift(prefix);
      return nameArr.join('-').replace(/\.svg$/, '');
    },
    ...options,
  });
}
