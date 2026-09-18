import type { LayoutCssVars, LayoutCssVarsProps, LayoutProps } from './type';

/**
 * 自定义滚动元素 ID
 * @default '__SCROLL_EL_ID__'
 */
export const LAYOUT_SCROLL_EL_ID = '__SCROLL_EL_ID__';

/**
 * 布局的最大 z-index
 * @default 50
 */
export const LAYOUT_MAX_Z_INDEX = 50;

/**
 * 创建布局 CSS 变量
 * @param props - 布局 CSS 变量 Props
 */
function createLayoutCssVarsByCssVarsProps(props: LayoutCssVarsProps) {
  const cssVars: LayoutCssVars = {
    '--lemon-header-height': `${props.headerHeight}px`,
    '--lemon-header-z-index': props.headerZIndex,
    '--lemon-tab-height': `${props.tabHeight}px`,
    '--lemon-tab-z-index': props.tabZIndex,
    '--lemon-sidebar-width': `${props.sidebarWidth}px`,
    '--lemon-sidebar-collapsed-width': `${props.sidebarCollapsedWidth}px`,
    '--lemon-sidebar-z-index': props.sidebarZIndex,
    '--lemon-mobile-sidebar-z-index': props.mobileSidebarZIndex,
    '--lemon-footer-height': `${props.footerHeight}px`,
    '--lemon-footer-z-index': props.footerZIndex,
  };

  return cssVars;
}

/**
 * 创建布局 CSS 变量
 * @param props - 布局 Props
 */
export function createLayoutCssVars(props: LayoutProps) {
  const {
    mode,
    isMobile,
    maxZIndex = LAYOUT_MAX_Z_INDEX,
    headerHeight,
    tabHeight,
    sidebarWidth,
    sidebarCollapsedWidth,
    footerHeight,
  } = props;

  const headerZIndex = maxZIndex - 3;
  const tabZIndex = maxZIndex - 5;
  const sidebarZIndex = mode === 'vertical' || isMobile ? maxZIndex - 1 : maxZIndex - 4;
  const mobileSidebarZIndex = isMobile ? maxZIndex - 2 : 0;
  const footerZIndex = maxZIndex - 5;

  const cssVarsProps: LayoutCssVarsProps = {
    headerHeight,
    headerZIndex,
    tabHeight,
    tabZIndex,
    sidebarWidth,
    sidebarZIndex,
    mobileSidebarZIndex,
    sidebarCollapsedWidth,
    footerHeight,
    footerZIndex,
  };

  return createLayoutCssVarsByCssVarsProps(cssVarsProps);
}
