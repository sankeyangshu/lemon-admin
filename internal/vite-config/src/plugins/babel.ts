import babel from '@rolldown/plugin-babel';
import { reactCompilerPreset } from '@vitejs/plugin-react';

type BaseBabelPluginOptions = NonNullable<Parameters<typeof babel>[0]>;
type ReactCompilerPresetOptions = NonNullable<Parameters<typeof reactCompilerPreset>[0]>;

export interface BabelPluginOptions extends Omit<BaseBabelPluginOptions, 'presets'> {
  /** 额外的 Babel 预设，执行在 React Compiler 预设之后. */
  presets?: BaseBabelPluginOptions['presets'];

  /** React Compiler 预设选项，或 false 禁用内置的编译器预设. */
  reactCompiler?: false | ReactCompilerPresetOptions;
}

/**
 * 配置 babel vite 插件
 * @param options - 配置选项
 */
export function setupBabelPluginConfig(options: BabelPluginOptions = {}) {
  const { presets = [], reactCompiler, ...restOptions } = options;

  return babel({
    ...restOptions,
    presets: [...presets, ...(reactCompiler === false ? [] : [reactCompilerPreset(reactCompiler)])],
  });
}
