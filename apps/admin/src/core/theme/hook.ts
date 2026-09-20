import { createContext, use } from 'react';

import type { ThemeMode, ThemeTransitionPoint } from './types';

export interface ThemeProviderState {
  /** 当前主题模式 */
  theme: ThemeMode;
  /** 是否为暗色模式 */
  darkMode: boolean;
  /** 切换主题模式；传入点击坐标时播圆形扩散动画 */
  setTheme: (theme: ThemeMode, event?: ThemeTransitionPoint) => void;
}

export const ThemeProviderContext = createContext<ThemeProviderState | null>(null);

export function useTheme() {
  const context = use(ThemeProviderContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
