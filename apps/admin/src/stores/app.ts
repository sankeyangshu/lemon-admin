import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface AppState {
  /** 系统配置 */
  system: App.Config.System;
}

interface AppAction {
  /** 更新主题配置 */
  setTheme: <K extends keyof App.Config.System['theme']>(
    key: K,
    value: App.Config.System['theme'][K]
  ) => void;

  /** 更新布局配置 */
  setLayout: <K extends keyof App.Config.System['layout']>(
    key: K,
    value: App.Config.System['layout'][K]
  ) => void;

  /** 更新头部配置 */
  setHeader: <K extends keyof App.Config.System['header']>(
    key: K,
    value: App.Config.System['header'][K]
  ) => void;

  /** 更新标签页配置 */
  setTab: <K extends keyof App.Config.System['tab']>(
    key: K,
    value: App.Config.System['tab'][K]
  ) => void;

  /** 更新侧边栏配置 */
  setSidebar: <K extends keyof App.Config.System['sidebar']>(
    key: K,
    value: App.Config.System['sidebar'][K]
  ) => void;

  /** 更新底部配置 */
  setFooter: <K extends keyof App.Config.System['footer']>(
    key: K,
    value: App.Config.System['footer'][K]
  ) => void;

  /** 更新设置配置 */
  setSettings: <K extends keyof App.Config.System['settings']>(
    key: K,
    value: App.Config.System['settings'][K]
  ) => void;

  /** 切换主题设置抽屉 */
  toggleThemeDrawer: () => void;
}

const defaultSystem: App.Config.System = {
  theme: {
    color: 'teal',
    greyMode: false,
    weakMode: false,
    radius: 6,
  },
  layout: {
    mode: 'vertical',
    scrollMode: 'content',
  },
  header: {
    height: 56,
    breadcrumbVisible: true,
    breadcrumbShowIcon: true,
  },
  tab: {
    visible: true,
    cache: true,
    height: 44,
    mode: 'chrome',
    closeTabByMiddleClick: false,
  },
  sidebar: {
    inverted: false,
    width: 220,
    collapsedWidth: 64,
    mixWidth: 90,
    mixCollapsedWidth: 64,
    mixChildMenuWidth: 200,
    autoSelectFirstMenu: false,
  },
  footer: {
    visible: true,
    fixed: false,
    height: 48,
    right: true,
  },
  settings: {
    showThemeDrawer: false,
    contentXScrollable: false,
    fullContent: false,
    mixSidebarFixed: false,
    reloadFlag: false,
    sidebarCollapse: false,
    fixedHeaderAndTab: true,
  },
};

export const useAppStore = create<AppState & AppAction>()(
  persist(
    immer((set) => ({
      system: defaultSystem,

      setTheme: (key, value) =>
        set((state) => {
          state.system.theme[key] = value;
        }),

      setLayout: (key, value) =>
        set((state) => {
          state.system.layout[key] = value;
        }),

      setHeader: (key, value) =>
        set((state) => {
          state.system.header[key] = value;
        }),

      setTab: (key, value) =>
        set((state) => {
          state.system.tab[key] = value;
        }),

      setSidebar: (key, value) =>
        set((state) => {
          state.system.sidebar[key] = value;
        }),

      setFooter: (key, value) =>
        set((state) => {
          state.system.footer[key] = value;
        }),

      setSettings: (key, value) =>
        set((state) => {
          state.system.settings[key] = value;
        }),

      toggleThemeDrawer: () =>
        set((state) => {
          state.system.settings.showThemeDrawer = !state.system.settings.showThemeDrawer;
        }),
    })),
    {
      name: `${import.meta.env.VITE_STORAGE_PREFIX}-appStore`,
    }
  )
);
