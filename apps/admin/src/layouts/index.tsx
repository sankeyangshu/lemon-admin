import { useUpdateEffect } from '@reactuses/core';
import { useShallow } from 'zustand/react/shallow';

import { useAdminMenus } from '@/core/menu';
import { useAppStore } from '@/stores/app';

import { AdminLayoutProvider, useAdminLayoutContext } from './context';
import { BaseLayout, LAYOUT_SCROLL_EL_ID } from './modules/base';
import Content from './modules/content';
import Footer from './modules/footer';
import Header from './modules/header';
import Menu from './modules/menu';
import Sidebar from './modules/sidebar';
// TODO: 待实现添加tab模块 import Tab from './modules/tab';
import ThemeDrawer from './modules/theme-drawer';

const AdminLayoutContent = () => {
  const {
    layoutMode,
    scrollMode,
    fullContent,
    fixedHeaderAndTab,
    contentXScrollable,
    headerHeight,
    tabVisible,
    tabHeight,
    sidebarInverted,
    sidebarCollapse,
    sidebarWidth,
    sidebarCollapsedWidth,
    mixWidth,
    mixCollapsedWidth,
    mixChildMenuWidth,
    mixSidebarFixed,
    footerVisible,
    footerFixed,
    footerHeight,
    footerRight,
  } = useAppStore(
    useShallow((state) => ({
      layoutMode: state.system.layout.mode,
      scrollMode: state.system.layout.scrollMode,
      fullContent: state.system.settings.fullContent,
      fixedHeaderAndTab: state.system.settings.fixedHeaderAndTab,
      contentXScrollable: state.system.settings.contentXScrollable,
      headerHeight: state.system.header.height,
      tabVisible: state.system.tab.visible,
      tabHeight: state.system.tab.height,
      sidebarInverted: state.system.sidebar.inverted,
      sidebarCollapse: state.system.settings.sidebarCollapse,
      sidebarWidth: state.system.sidebar.width,
      sidebarCollapsedWidth: state.system.sidebar.collapsedWidth,
      mixWidth: state.system.sidebar.mixWidth,
      mixCollapsedWidth: state.system.sidebar.mixCollapsedWidth,
      mixChildMenuWidth: state.system.sidebar.mixChildMenuWidth,
      mixSidebarFixed: state.system.settings.mixSidebarFixed,
      footerVisible: state.system.footer.visible,
      footerFixed: state.system.footer.fixed,
      footerHeight: state.system.footer.height,
      footerRight: state.system.footer.right,
    }))
  );

  const { isMobile } = useAdminLayoutContext();
  const { childLevelMenus, isActiveFirstLevelMenuHasChildren, secondLevelMenus, setDrawerVisible } =
    useAdminMenus();

  const mode = layoutMode.includes('vertical') ? 'vertical' : 'horizontal';

  const isTopHybridHeaderFirst = layoutMode === 'top-hybrid-header-first';
  const isVerticalHybridHeaderFirst = layoutMode === 'vertical-hybrid-header-first';
  const isTopHybridSidebarFirst = layoutMode === 'top-hybrid-sidebar-first';
  const isVerticalMix = layoutMode === 'vertical-mix';

  const sidebarVisible = layoutMode !== 'horizontal';

  const expandedSidebarWidth = getSidebarAndCollapsedWidth(false);
  const collapsedSidebarWidth = getSidebarAndCollapsedWidth(true);
  const sidebarHidden = expandedSidebarWidth === 0;

  function getSidebarAndCollapsedWidth(collapsed: boolean) {
    const width = collapsed ? sidebarCollapsedWidth : sidebarWidth;
    const mixBandWidth = collapsed ? mixCollapsedWidth : mixWidth;

    if (isTopHybridHeaderFirst) {
      return isActiveFirstLevelMenuHasChildren ? width : 0;
    }

    if (isVerticalHybridHeaderFirst && !isActiveFirstLevelMenuHasChildren) {
      return 0;
    }

    const isMixMode = isVerticalMix || isTopHybridSidebarFirst || isVerticalHybridHeaderFirst;
    let finalWidth = isMixMode ? mixBandWidth : width;

    if (isVerticalMix && mixSidebarFixed && secondLevelMenus.length) {
      finalWidth += mixChildMenuWidth;
    }

    if (isVerticalHybridHeaderFirst && mixSidebarFixed && childLevelMenus.length) {
      finalWidth += mixChildMenuWidth;
    }

    return finalWidth;
  }

  useUpdateEffect(() => {
    setDrawerVisible(false);
  }, [layoutMode, setDrawerVisible]);

  return (
    <BaseLayout
      mode={mode}
      isMobile={isMobile}
      scrollElId={LAYOUT_SCROLL_EL_ID}
      scrollMode={scrollMode}
      fullContent={fullContent}
      fixedTop={fixedHeaderAndTab}
      headerHeight={headerHeight}
      tabVisible={tabVisible}
      tabHeight={tabHeight}
      contentClass={contentXScrollable ? 'overflow-x-hidden' : ''}
      sidebarVisible={sidebarVisible}
      sidebarCollapse={sidebarHidden || sidebarCollapse}
      sidebarWidth={expandedSidebarWidth}
      sidebarCollapsedWidth={collapsedSidebarWidth}
      footerVisible={footerVisible}
      footerFixed={footerFixed}
      footerHeight={footerHeight}
      footerRight={footerRight}
      header={<Header layoutMode={layoutMode} isMobile={isMobile} sidebarWidth={sidebarWidth} />}
      sidebar={
        <Sidebar
          layoutMode={layoutMode}
          inverted={sidebarInverted}
          sidebarCollapse={sidebarCollapse}
          headerHeight={headerHeight}
        />
      }
      tab={null}
      footer={<Footer />}
    >
      <Menu layoutMode={layoutMode} />

      <Content />

      <ThemeDrawer />
    </BaseLayout>
  );
};

const AdminLayout = () => {
  return (
    <AdminLayoutProvider>
      <AdminLayoutContent />
    </AdminLayoutProvider>
  );
};

export default AdminLayout;
