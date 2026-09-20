/**
 * 主题模式
 */
export type ThemeMode = 'dark' | 'light' | 'system';

/**
 * 主题切换圆形扩散的点击坐标
 */
export type ThemeTransitionPoint = Pick<MouseEvent, 'clientX' | 'clientY'>;

/**
 * 可选主题模式
 */
export const THEME_MODES: ThemeMode[] = ['light', 'dark', 'system'];

/**
 * 主题模式持久化 key
 */
export const THEME_STORAGE_KEY = `${import.meta.env.VITE_STORAGE_PREFIX}-themeMode`;

/**
 * 默认主题模式
 */
export const DEFAULT_THEME_MODE: ThemeMode = 'system';
