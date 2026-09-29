import { create } from 'zustand';

import {
  generate,
  hasRoutePermission,
  normalizePath,
  type GeneratedMenu,
  type MenuBadgeValue,
  type MenusByPath,
  type MenuUser,
} from '@/core/menu';
import { routeTree } from '@/routeTree.gen';

/** 首页路由 key */
const DEFAULT_HOME = import.meta.env.VITE_ROUTE_HOME;

/** 权限路由模式：static 静态路由，dynamic 动态路由 */
const ROUTE_MODE = import.meta.env.VITE_AUTH_ROUTE_MODE;

interface MenuState {
  /** 首页路由 key */
  home: string;
  /** 全局菜单 */
  menus: GeneratedMenu[];
  /** 路径菜单索引 */
  menusByPath: MenusByPath;
  /** 混合布局中一级菜单 */
  activeFirstLevelMenuKey: string;
  /** 混合布局中二级菜单 */
  activeSecondLevelMenuKey: string;
  /** 移动端菜单抽屉 */
  drawerVisible: boolean;
  /** valueKey → 角标动态值 */
  badgeValues: Record<string, MenuBadgeValue | undefined>;
}

interface MenuActions {
  /**
   * 初始化菜单
   * @param userInfo 用户信息
   */
  initMenus: (userInfo?: MenuUser | null) => Promise<void>;
  /** 清空菜单 */
  clearMenus: () => void;

  /** 设置混合布局中一级菜单 */
  setActiveFirstLevelMenuKey: (key: string) => void;
  /** 设置混合布局中二级菜单 */
  setActiveSecondLevelMenuKey: (key: string) => void;
  /** 设置移动端菜单抽屉显示 */
  setDrawerVisible: (visible: boolean) => void;
  /** 清除选中的菜单项和抽屉 */
  clearActiveKeys: () => void;

  /**
   * 设置一个角标动态值
   * @description 不传或 null 时回退到菜单上的静态 value
   * @param key 菜单 badge.valueKey
   * @param value 角标动态值
   */
  setBadgeValue: (key: string, value: MenuBadgeValue | undefined) => void;
  /**
   * 设置多个角标动态值
   * @description 已有 key 被覆盖
   * @param values valueKey → 角标动态值
   */
  setBadgeValues: (values: Record<string, MenuBadgeValue | undefined>) => void;
  /**
   * 清除多个角标动态值
   * @description 不传则清空全部
   * @param keys 角标 key 列表
   */
  clearBadgeValues: (keys?: string[]) => void;
}

export const useMenuStore = create<MenuState & MenuActions>((set) => ({
  home: DEFAULT_HOME,
  menus: [],
  menusByPath: new Map(),
  activeFirstLevelMenuKey: '',
  activeSecondLevelMenuKey: '',
  drawerVisible: false,
  badgeValues: {},

  initMenus: async (userInfo) => {
    if (ROUTE_MODE === 'dynamic') {
      // const routeData = await loadBackendRoutes();
      // const { menus, index, home } = generate({
      //   mode: 'dynamic',
      //   backendRoutes: routeData.routes,
      //   home: routeData.home,
      //   userInfo,
      //   routeTree,
      // });
      // set({ menus, index, homeRouteKey: home ?? DEFAULT_HOME });
      return;
    }

    const { home, menus, menusByPath } = generate({
      mode: 'static',
      routeTree,
      userInfo,
      defaultHome: DEFAULT_HOME,
    });

    set({ home, menus, menusByPath });
  },

  clearMenus: () => {
    set({ home: DEFAULT_HOME, menus: [], menusByPath: new Map(), badgeValues: {} });
  },

  setActiveFirstLevelMenuKey: (key) => {
    set({ activeFirstLevelMenuKey: key });
  },

  setActiveSecondLevelMenuKey: (key) => {
    set({ activeSecondLevelMenuKey: key });
  },

  setDrawerVisible: (visible) => {
    set({ drawerVisible: visible });
  },

  clearActiveKeys: () => {
    set({
      activeFirstLevelMenuKey: '',
      activeSecondLevelMenuKey: '',
      drawerVisible: false,
    });
  },

  setBadgeValue: (key, value) => {
    set((state) => ({ badgeValues: { ...state.badgeValues, [key]: value } }));
  },

  setBadgeValues: (values) => {
    set((state) => ({ badgeValues: { ...state.badgeValues, ...values } }));
  },

  clearBadgeValues: (keys) => {
    if (!keys) {
      set({ badgeValues: {} });
      return;
    }

    set((state) => {
      const badgeValues = { ...state.badgeValues };

      for (const key of keys) {
        delete badgeValues[key];
      }

      return { badgeValues };
    });
  },
}));

/**
 * 读取当前首页路由
 */
export function getHomeRoute() {
  return useMenuStore.getState().home;
}

/**
 * 按路径取菜单节点
 * @param path 原始路径，内部会先规范化
 * @returns 命中的节点；未初始化或没有该路径时为 null
 */
export function getMenuByPath(path: string) {
  return useMenuStore.getState().menusByPath.get(normalizePath(path)) ?? null;
}

/**
 * 判断路径在当前路由模式下是否可访问
 * static 模式不拦；dynamic 模式要求路径在菜单索引里且角色满足 permissions。
 * @param path 要检查的路径
 * @param userInfo 当前用户，不传则只放行没写 permissions 的节点
 */
export function hasAuthorizedRoutePath(path: string, userInfo?: MenuUser | null) {
  if (ROUTE_MODE !== 'dynamic') return true;

  const menu = getMenuByPath(path);
  return Boolean(menu && hasRoutePermission(menu, userInfo));
}
