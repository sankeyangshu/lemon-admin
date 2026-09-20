import { useLocalStorage, usePreferredDark } from '@reactuses/core';
import { useEffect } from 'react';
import { flushSync } from 'react-dom';
import { useShallow } from 'zustand/react/shallow';

import { useAppStore } from '@/stores/app';

import { ThemeProviderContext } from './hook';
import {
  DEFAULT_THEME_MODE,
  THEME_STORAGE_KEY,
  type ThemeMode,
  type ThemeTransitionPoint,
} from './types';
import {
  applyColorScheme,
  applyThemeColor,
  canStartThemeTransition,
  isThemeMode,
  startThemeTransition,
} from './utils';

import './view-transition.css';

export interface ThemeProviderProps {
  /** 子组件 */
  children: React.ReactNode;
  /** 默认主题模式 */
  defaultTheme?: ThemeMode;
  /** 主题模式 localStorage key */
  storageKey?: string;
}

export const ThemeProvider = (props: ThemeProviderProps) => {
  const { children, defaultTheme = DEFAULT_THEME_MODE, storageKey = THEME_STORAGE_KEY } = props;

  const [theme, setTheme] = useLocalStorage<ThemeMode>(storageKey, defaultTheme);
  const prefersDark = usePreferredDark();

  // 订阅灰色、色弱模式和主题颜色
  const { greyMode, weakMode, themeColor } = useAppStore(
    useShallow((state) => ({
      greyMode: state.system.theme.greyMode,
      weakMode: state.system.theme.weakMode,
      themeColor: state.system.theme.color,
    }))
  );

  const currentTheme = isThemeMode(theme) ? theme : defaultTheme;
  const darkMode = currentTheme === 'dark' || (currentTheme === 'system' && prefersDark);

  function handleSetTheme(nextTheme: ThemeMode, event?: ThemeTransitionPoint) {
    const nextDark = nextTheme === 'dark' || (nextTheme === 'system' && prefersDark);

    function commit() {
      setTheme(nextTheme);
      applyColorScheme(nextDark);
    }

    if (event && canStartThemeTransition()) {
      startThemeTransition(() => {
        flushSync(commit);
      }, event);
      return;
    }

    commit();
  }

  // 暗黑/明亮模式切换
  useEffect(() => {
    applyColorScheme(darkMode);
  }, [darkMode]);

  // 灰色和色弱模式
  useEffect(() => {
    document.documentElement.style.filter = [
      greyMode ? 'grayscale(100%)' : '',
      weakMode ? 'invert(80%)' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }, [greyMode, weakMode]);

  // 添加主题颜色变量到全局
  useEffect(() => {
    applyThemeColor(themeColor);
  }, [themeColor]);

  return (
    <ThemeProviderContext
      value={{
        theme: currentTheme,
        darkMode,
        setTheme: handleSetTheme,
      }}
    >
      {children}
    </ThemeProviderContext>
  );
};
