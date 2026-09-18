/**
 * 头部配置
 */
interface LayoutHeaderConfig {
  /**
   * 是否显示头部
   * @default true
   */
  headerVisible?: boolean;
  /**
   * 头部高度
   * @default '56px'
   */
  headerHeight?: number;
}

/**
 * 标签配置
 */
interface LayoutTabConfig {
  /**
   * 是否显示标签
   * @default true
   */
  tabVisible?: boolean;
  /**
   * 自定义标签类
   * @default ''
   */
  tabClass?: string;
  /**
   * 标签高度
   * @default '48px'
   */
  tabHeight?: number;
}

/**
 * 侧边栏配置
 */
interface LayoutSidebarConfig {
  /**
   * 是否显示侧边栏
   * @default true
   */
  sidebarVisible?: boolean;
  /**
   * 自定义侧边栏类
   * @default ''
   */
  sidebarClass?: string;
  /**
   * 移动端侧边栏类
   * @default ''
   */
  mobileSidebarClass?: string;
  /**
   * 侧边栏折叠状态
   * @default false
   */
  sidebarCollapse?: boolean;
  /**
   * 侧边栏展开宽度
   * @default '220px'
   */
  sidebarWidth?: number;
  /**
   * 侧边栏折叠宽度
   * @default '64px'
   */
  sidebarCollapsedWidth?: number;
}

/**
 * 内容区域配置
 */
interface LayoutContentConfig {
  /**
   * 自定义内容类
   * @default ''
   */
  contentClass?: string;
  /**
   * 是否内容全屏，如果为 true，其他元素将通过 `display: none` 隐藏
   * @default false
   */
  fullContent?: boolean;
}

/**
 * 底部配置
 */
interface LayoutFooterConfig {
  /**
   * 是否显示底部
   * @default true
   */
  footerVisible?: boolean;
  /**
   * 是否固定底部
   * @default true
   */
  footerFixed?: boolean;
  /**
   * 自定义底部类
   * @default ''
   */
  footerClass?: string;
  /**
   * 底部高度
   * @default '48px'
   */
  footerHeight?: number;
  /**
   * 是否在右侧
   * 当布局为垂直时，底部在右侧
   */
  footerRight?: boolean;
}

/**
 * 布局模式
 * - Horizontal 水平
 * - Vertical 垂直
 */
export type LayoutMode = Extract<App.Config.LayoutMode, 'horizontal' | 'vertical'>;

/**
 * 内容溢出时滚动模式
 * @default 'content'
 */
export type LayoutScrollMode = App.Config.System['layout']['scrollMode'];

/**
 * 布局 Props
 */
export interface LayoutProps extends LayoutHeaderConfig, LayoutTabConfig, LayoutSidebarConfig, LayoutContentConfig, LayoutFooterConfig {
  /**
   * 布局模式
   * @see {@link LayoutMode}
   */
  mode?: LayoutMode;
  /**
   * 内容溢出时滚动模式
   * @see {@link LayoutScrollMode}
   */
  scrollMode?: LayoutScrollMode;
  /**
   * 自定义滚动元素 ID
   */
  scrollElId?: string;
  /**
   * 自定义滚动元素类
   */
  scrollElClass?: string;
  /**
   * 自定义滚动包裹元素类
   */
  scrollWrapperClass?: string;
  /**
   * 布局通用类 - 可以用于配置过渡动画
   * @default 'transition-all duration-300'
   */
  commonClass?: string;
  /**
   * 是否为移动端
   * @default false
   */
  isMobile?: boolean;
  /**
   * 是否固定顶部
   * @default true
   */
  fixedTop?: boolean;
  /**
   * 布局的最大 z-index
   */
  maxZIndex?: number;
}

/**
 * 布局 CSS 变量 Props
 */
export type LayoutCssVarsProps = Pick<LayoutProps, 'headerHeight' | 'tabHeight' | 'sidebarWidth' | 'sidebarCollapsedWidth' | 'footerHeight'> & {
  headerZIndex?: number;
  tabZIndex?: number;
  sidebarZIndex?: number;
  mobileSidebarZIndex?: number;
  footerZIndex?: number;
};

/**
 * 前缀
 */
type Prefix = '--lemon-';

type Kebab<S extends string> = S extends Uncapitalize<S> ? S : `-${Uncapitalize<S>}`;

type KebabCase<S extends string> = S extends `${infer Start}${infer End}`
  ? `${Uncapitalize<Start>}${KebabCase<Kebab<End>>}`
  : S;

/**
 * 布局 CSS 变量
 */
export type LayoutCssVars = {
  [K in keyof LayoutCssVarsProps as `${Prefix}${KebabCase<K>}`]: string | number;
} & React.CSSProperties;
