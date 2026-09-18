import { cn } from '@workspace/web-ui/lib/utils';

import { layoutClasses } from './classes';
import type { LayoutProps } from './type';
import { createLayoutCssVars, LAYOUT_MAX_Z_INDEX, LAYOUT_SCROLL_EL_ID } from './utils';

interface BaseLayoutProps extends LayoutProps {
  /** 内容区域 */
  children?: React.ReactNode;
  /** 头部 */
  header?: React.ReactNode;
  /** 标签页 */
  tab?: React.ReactNode;
  /** 侧边栏 */
  sidebar?: React.ReactNode;
  /** 底部 */
  footer?: React.ReactNode;
  /** 更新侧边栏折叠状态 */
  onUpdateSidebarCollapse?: (collapse: boolean) => void;
}

const BaseLayout = (props: BaseLayoutProps) => {
  const {
    mode = 'vertical',
    scrollMode = 'content',
    scrollElId = LAYOUT_SCROLL_EL_ID,
    commonClass = 'transition-all duration-300',
    fixedTop = true,
    maxZIndex = LAYOUT_MAX_Z_INDEX,
    isMobile,
    scrollElClass,
    scrollWrapperClass,

    children,
    contentClass = '',
    fullContent = false,

    header,
    headerVisible = true,
    headerHeight = 56,

    tab,
    tabVisible = true,
    tabHeight = 48,
    tabClass = '',

    sidebar,
    sidebarVisible = true,
    sidebarCollapse = false,
    sidebarWidth = 220,
    sidebarCollapsedWidth = 64,
    sidebarClass = '',
    mobileSidebarClass = '',

    footer,
    footerVisible = true,
    footerHeight = 48,
    footerRight = false,
    footerFixed = true,
    footerClass = '',

    onUpdateSidebarCollapse,
  } = props;

  // css 变量
  const cssVars = createLayoutCssVars({
    mode,
    isMobile,
    maxZIndex,
    headerHeight,
    tabHeight,
    sidebarWidth,
    sidebarCollapsedWidth,
    footerHeight,
  });

  // 是否显示布局区域
  const showHeader = Boolean(header) && headerVisible;
  const showTab = Boolean(tab) && tabVisible;
  const showSidebar = !isMobile && Boolean(sidebar) && sidebarVisible;
  const showMobileSidebar = isMobile && Boolean(sidebar) && sidebarVisible;
  const showFooter = Boolean(footer) && footerVisible;

  // 滚动模式
  const isWrapperScroll = scrollMode === 'wrapper';
  const isContentScroll = scrollMode === 'content';

  // 布局方向
  const isVertical = mode === 'vertical';
  const isHorizontal = mode === 'horizontal';

  // 是否固定头部和标签
  const fixedHeaderAndTab = fixedTop || (isHorizontal && isWrapperScroll);

  // 样式类
  const leftGapClass =
    !fullContent && showSidebar
      ? sidebarCollapse
        ? layoutClasses.leftGapCollapsed
        : layoutClasses.leftGap
      : '';

  const headerLeftGapClass = isVertical ? leftGapClass : '';

  const footerLeftGapClass =
    isVertical || (isHorizontal && isWrapperScroll && !footerFixed) || (isHorizontal && footerRight)
      ? leftGapClass
      : '';

  // 侧边栏内边距
  const sidebarPaddingClass = cn(
    showHeader && !headerLeftGapClass && layoutClasses.sidebarPaddingTop,
    showFooter && !footerLeftGapClass && layoutClasses.sidebarPaddingBottom
  );

  function handleClickMask() {
    onUpdateSidebarCollapse?.(true);
  }

  return (
    <div className={cn('relative h-full', commonClass)} style={cssVars}>
      <div
        id={isWrapperScroll ? scrollElId : undefined}
        className={cn(
          'flex h-full flex-col',
          commonClass,
          scrollWrapperClass,
          isWrapperScroll && scrollElClass,
          isWrapperScroll && 'overflow-y-auto'
        )}
      >
        {/* Header */}
        {showHeader && (
          <>
            <header
              className={cn(
                'shrink-0',
                layoutClasses.header,
                commonClass,
                headerLeftGapClass,
                fixedHeaderAndTab && 'absolute top-0 left-0 w-full'
              )}
              style={{ display: fullContent ? 'none' : undefined }}
            >
              {header}
            </header>
            <div
              className={cn('shrink-0 overflow-hidden', layoutClasses.headerPlacement)}
              style={{ display: !fullContent && fixedHeaderAndTab ? undefined : 'none' }}
            />
          </>
        )}

        {/* Tab */}
        {showTab && (
          <>
            <div
              className={cn(
                'shrink-0',
                layoutClasses.tab,
                commonClass,
                tabClass,
                (fullContent || !showHeader) && 'top-0!',
                leftGapClass,
                fixedHeaderAndTab && 'absolute left-0 w-full'
              )}
            >
              {tab}
            </div>
            <div
              className={cn('shrink-0 overflow-hidden', layoutClasses.tabPlacement)}
              style={{ display: fullContent || fixedHeaderAndTab ? undefined : 'none' }}
            />
          </>
        )}

        {/* Sidebar */}
        {showSidebar && (
          <aside
            className={cn(
              'absolute top-0 left-0 h-full',
              commonClass,
              sidebarClass,
              sidebarPaddingClass,
              sidebarCollapse ? layoutClasses.sidebarCollapsed : layoutClasses.sidebar
            )}
            style={{ display: fullContent ? 'none' : undefined }}
          >
            {sidebar}
          </aside>
        )}

        {/* Mobile Sidebar */}
        {showMobileSidebar && (
          <>
            <aside
              className={cn(
                'absolute top-0 left-0 h-full bg-white',
                commonClass,
                mobileSidebarClass,
                layoutClasses.mobileSidebar,
                sidebarCollapse ? 'w-0 overflow-hidden' : layoutClasses.sidebar
              )}
            >
              {sidebar}
            </aside>
            <div
              className={cn(
                'absolute top-0 left-0 size-full bg-black/20',
                layoutClasses.mobileSidebarMask
              )}
              style={{ display: sidebarCollapse ? 'none' : undefined }}
              onClick={handleClickMask}
            />
          </>
        )}

        {/* Main Content */}
        <main
          id={isContentScroll ? scrollElId : undefined}
          className={cn(
            'flex grow flex-col',
            commonClass,
            contentClass,
            leftGapClass,
            isContentScroll && scrollElClass,
            isContentScroll && 'overflow-y-auto'
          )}
        >
          {children}
        </main>

        {/* Footer */}
        {showFooter && (
          <>
            <footer
              className={cn(
                'shrink-0',
                layoutClasses.footer,
                commonClass,
                footerClass,
                footerLeftGapClass,
                footerFixed && 'absolute bottom-0 left-0 w-full'
              )}
              style={{ display: fullContent ? 'none' : undefined }}
            >
              {footer}
            </footer>
            <div
              className={cn('shrink-0 overflow-hidden', layoutClasses.footerPlacement)}
              style={{ display: !fullContent && footerFixed ? undefined : 'none' }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default BaseLayout;
