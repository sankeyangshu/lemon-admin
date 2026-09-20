import { THEME_MODES, type ThemeMode, type ThemeTransitionPoint } from './types';

/**
 * 主题色会同步到的 CSS 变量
 */
const THEME_COLOR_VARS = ['--primary', '--ring', '--sidebar-primary', '--sidebar-ring'] as const;

/**
 * 主题色前景会同步到的 CSS 变量
 */
const THEME_FOREGROUND_VARS = ['--primary-foreground', '--sidebar-primary-foreground'] as const;

/**
 * 主题颜色预设
 */
export const THEME_COLOR_PRESETS: Record<App.Config.ThemeColor, string> = {
  teal: '#009688',
  beige: '#daa96e',
  oceanBlue: '#0c819f',
  emeraldGreen: '#27ae60',
  hotPink: '#ff5c93',
  coralRed: '#e74c3c',
  salmonPink: '#fd726d',
  orange: '#f39c12',
  violet: '#9b59b6',
};

/**
 * 判断是否为合法主题模式
 * @param value - 待校验值
 */
export function isThemeMode(value: unknown): value is ThemeMode {
  return typeof value === 'string' && THEME_MODES.includes(value as ThemeMode);
}

/**
 * 根据背景色亮度计算可读前景色
 * @param hex - 十六进制颜色
 */
function getContrastForeground(hex: string) {
  const value = hex.replace('#', '');
  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

  return luminance > 0.55 ? 'oklch(0.205 0 0)' : 'oklch(0.985 0 0)';
}

/**
 * 把主题色写入 html CSS 变量，供 Tailwind `@theme inline` 映射
 * @param preset - 主题色预设名
 */
export function applyThemeColor(preset: App.Config.ThemeColor) {
  const color = THEME_COLOR_PRESETS[preset];
  const foreground = getContrastForeground(color);
  const root = document.documentElement;

  root.dataset.themeColor = preset;

  for (const name of THEME_COLOR_VARS) {
    root.style.setProperty(name, color);
  }

  for (const name of THEME_FOREGROUND_VARS) {
    root.style.setProperty(name, foreground);
  }
}

/**
 * 同步 html 的 light/dark class 和 color-scheme
 * @param isDark - 是否暗色
 */
export function applyColorScheme(isDark: boolean) {
  const root = document.documentElement;
  const nextMode = isDark ? 'dark' : 'light';

  root.classList.remove('light', 'dark');
  root.classList.add(nextMode);
  root.style.colorScheme = nextMode;
}

/**
 * 当前环境是否可以播主题切换 View Transition
 */
export function canStartThemeTransition() {
  return (
    typeof document.startViewTransition === 'function' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * 把点击点写成圆形扩散动画的 CSS 变量
 * @param point - 点击坐标
 */
export function setThemeTransitionOrigin(point: ThemeTransitionPoint) {
  const { clientX, clientY } = point;
  const maxRadius = Math.hypot(
    Math.max(clientX, window.innerWidth - clientX),
    Math.max(clientY, window.innerHeight - clientY)
  );
  const root = document.documentElement;

  root.style.setProperty('--lemon-dark-x', `${clientX}px`);
  root.style.setProperty('--lemon-dark-y', `${clientY}px`);
  root.style.setProperty('--lemon-dark-r', `${maxRadius}px`);
}

/**
 * 用 View Transition 包一层 DOM 更新；不支持或无坐标时直接执行
 * @param update - 同步更新主题 DOM / state
 * @param point - 扩散圆心，不传则无动画
 */
export function startThemeTransition(update: () => void, point?: ThemeTransitionPoint) {
  if (!point || !canStartThemeTransition()) {
    update();
    return;
  }

  setThemeTransitionOrigin(point);
  document.startViewTransition(update);
}
