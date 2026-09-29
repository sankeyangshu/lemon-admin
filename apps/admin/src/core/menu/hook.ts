import { useMatches, useNavigate } from '@tanstack/react-router';
import { omit } from 'es-toolkit/object';
import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/shallow';

import { useMenuStore } from '@/stores/menu';

import { normalizePath } from './generate';
import type { GeneratedMenu, MenusByPath } from './types';

/** 菜单还没初始化时用的空列表，避免每次渲染都新建数组 */
const EMPTY_MENUS: GeneratedMenu[] = [];

/**
 * 获取当前路由信息
 * @description 供菜单高亮和跳转使用。页面里的路径、参数、search 仍直接用 TanStack 的 hook
 */
function useCurrentRoute() {
  return useMatches({
    select: (matches) => {
      const match = matches.at(-1);
      if (!match) {
        throw new Error('No active route match');
      }

      return {
        routeId: match.routeId,
        params: match.params,
        pathname: match.pathname,
        staticData: match.staticData,
        originPath: normalizePath(match.fullPath),
      };
    },
    structuralSharing: false,
  });
}

/**
 * 计算菜单高亮
 * @description 隐藏页如果写了 activeMenu，高亮那个菜单，而不是隐藏页自己
 * @param menusByPath 路径到菜单节点的索引
 * @param originPath 当前路由规范化后的 path
 * @returns 当前节点、高亮 key、要展开的祖先 key
 */
function selectMenu(menusByPath: MenusByPath, originPath: string) {
  const currentMenu = menusByPath.get(originPath);
  const { activeMenu, hide } = currentMenu?.menu ?? {};
  const selectedRouteKey = (hide ? activeMenu : currentMenu?.key) || currentMenu?.key || '';
  const activeMenuInfo = activeMenu ? menusByPath.get(activeMenu) : currentMenu;

  return {
    activeMenu,
    currentMenu,
    openKeys: activeMenuInfo?.parentKeys ?? [],
    selectedRouteKey,
  };
}

/**
 * 转换菜单 query
 * @description 没有有效项时返回 undefined，调用处就不传 search
 * @param query 菜单上配置的 query，形如 `{ key, value }[]`
 * @returns `{ [key]: value }`，或 undefined
 */
function createRouteSearch(query: { key: string; value: string }[] | null | undefined) {
  const search: Record<string, string> = {};

  query?.forEach((item) => {
    const key = item.key.trim();

    if (key) {
      search[key] = item.value;
    }
  });

  return Object.keys(search).length ? search : undefined;
}

/**
 * 菜单运行时状态
 * @description 混合布局的选中项、侧栏层级、以及按 key 跳转都从这里拿
 * @returns 菜单数据和操作函数
 */
export function useAdminMenus() {
  const navigate = useNavigate();

  // 订阅菜单用到的 store 字段
  const {
    home,
    menus,
    menusByPath,
    activeFirstLevelMenuKey,
    activeSecondLevelMenuKey,
    drawerVisible,
    setActiveFirstLevelMenuKey,
    setActiveSecondLevelMenuKey,
    setDrawerVisible,
    clearActiveKeys,
  } = useMenuStore(
    useShallow((state) => ({
      home: state.home,
      menus: state.menus,
      menusByPath: state.menusByPath,
      activeFirstLevelMenuKey: state.activeFirstLevelMenuKey,
      activeSecondLevelMenuKey: state.activeSecondLevelMenuKey,
      drawerVisible: state.drawerVisible,
      setActiveFirstLevelMenuKey: state.setActiveFirstLevelMenuKey,
      setActiveSecondLevelMenuKey: state.setActiveSecondLevelMenuKey,
      setDrawerVisible: state.setDrawerVisible,
      clearActiveKeys: state.clearActiveKeys,
    }))
  );

  const route = useCurrentRoute();

  // 当前页对应的高亮和要展开的祖先
  const { activeMenu, currentMenu, openKeys, selectedRouteKey } = selectMenu(
    menusByPath,
    route.originPath
  );
  // Menu 组件的 selectedKeys 是数组，这里只有一个当前项
  const selectedKey = [selectedRouteKey];
  // 没手动点过混合菜单时，用路由祖先当一级、二级。openKeys[0] 是一级，[1] 是二级
  const routeFirstLevelMenuKey = openKeys[0] || selectedRouteKey;
  const routeSecondLevelMenuKey = openKeys[1] || selectedRouteKey;
  // 手动点过的 key 优先，这样切到别的目录时侧栏先跟着点选，而不是立刻跟路由走
  const derivedActiveFirstLevelMenuKey = activeFirstLevelMenuKey || routeFirstLevelMenuKey;
  const derivedActiveSecondLevelMenuKey = activeSecondLevelMenuKey || routeSecondLevelMenuKey;

  // 初始化完成前 menus 是空数组，用模块级常量，避免下游把「还没加载」和「新的空数组」看成两次变化
  const menuList = menus.length ? menus : EMPTY_MENUS;
  // 混合布局顶栏只要一级，去掉 children，避免把整棵子树渲染进顶栏
  const firstLevelMenus = menuList.map((menu) => omit(menu, ['children']));
  const secondLevelMenus =
    menuList.find((item) => item.key === derivedActiveFirstLevelMenuKey)?.children ?? EMPTY_MENUS;
  const childLevelMenus =
    secondLevelMenus.find((item) => item.key === derivedActiveSecondLevelMenuKey)?.children ??
    EMPTY_MENUS;
  // 没选出一级或二级时不算「有子菜单」，避免空 key 配上空 children 被当成可展开
  const isActiveFirstLevelMenuHasChildren = derivedActiveFirstLevelMenuKey
    ? Boolean(secondLevelMenus.length)
    : false;
  const isActiveSecondLevelMenuHasChildren = derivedActiveSecondLevelMenuKey
    ? Boolean(childLevelMenus.length)
    : false;

  // 记下上一次高亮 key。路由没变时不要清掉用户手动点的混合菜单
  const selectedRouteKeyRef = useRef(selectedRouteKey);

  /**
   * 按菜单 key 跳转
   * @description 外链开新窗口，站内走 navigate，并带上 meta.query
   * @param key 菜单 key，等于规范化后的 path
   */
  function routerPushByKey(key: string) {
    const item = menusByPath.get(key);

    if (!item) return;

    if (item.href) {
      window.open(item.href, '_blank', 'noopener,noreferrer');
      return;
    }

    const search = createRouteSearch(item.query);

    if (search) {
      void navigate({ search, to: item.path });
      return;
    }

    void navigate({ to: item.path });
  }

  /**
   * 设置一级菜单
   * @description 不传则清空，之后回退到路由推出来的一级
   * @param key 一级菜单 key
   */
  function changeActiveFirstLevelMenuKey(key?: string) {
    setActiveFirstLevelMenuKey(key ?? '');
  }

  /**
   * 设置二级菜单
   * @description 不传则清空，之后回退到路由推出来的二级
   * @param key 二级菜单 key
   */
  function changeActiveSecondLevelMenuKey(key?: string) {
    setActiveSecondLevelMenuKey(key ?? '');
  }

  /**
   * 按路径取菜单节点
   * @param path 原始路径
   * @returns 命中的节点，没有则为 null
   */
  function getMenuInfoByPath(path: string) {
    return menusByPath.get(normalizePath(path)) ?? null;
  }

  // 高亮的路由变了，说明用户已经离开刚才点的目录，清掉手动选中和抽屉
  useEffect(() => {
    if (selectedRouteKeyRef.current === selectedRouteKey) return;

    selectedRouteKeyRef.current = selectedRouteKey;
    clearActiveKeys();
  }, [clearActiveKeys, selectedRouteKey]);

  return {
    home,
    menus: menuList,
    menusByPath,
    activeFirstLevelMenuKey: derivedActiveFirstLevelMenuKey,
    activeSecondLevelMenuKey: derivedActiveSecondLevelMenuKey,
    drawerVisible,
    changeActiveFirstLevelMenuKey,
    changeActiveSecondLevelMenuKey,
    setDrawerVisible,
    firstLevelMenus,
    secondLevelMenus,
    childLevelMenus,
    isActiveFirstLevelMenuHasChildren,
    isActiveSecondLevelMenuHasChildren,
    activeMenu,
    currentMenu,
    openKeys,
    selectedKey,
    route,
    getMenuInfoByPath,
    routerPushByKey,
  };
}
