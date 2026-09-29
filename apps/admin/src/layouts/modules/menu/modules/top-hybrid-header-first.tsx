import { useUpdateEffect } from '@reactuses/core';
import { ScrollArea } from '@workspace/web-ui/components/scroll-area';
import { useState } from 'react';

import { Menu, type MenuSelectInfo } from '@/components/custom/menu';
import { useAdminMenus, type GeneratedMenu } from '@/core/menu';
import { GLOBAL_HEADER_MENU_SELECTOR, GLOBAL_SIDEBAR_MENU_SELECTOR } from '@/layouts/constant';
import { useAppStore } from '@/stores/app';

import MenuPortal from '../components/menu-portal';
import { renderMenuItems } from '../components/menu-renderer';

/**
 * 顶部混合-顶部优先。
 * 顶部混合布局，一级菜单在顶部，二级菜单在左侧。
 */
const TopHybridHeaderFirstMenu = () => {
  const {
    activeFirstLevelMenuKey,
    changeActiveFirstLevelMenuKey,
    changeActiveSecondLevelMenuKey,
    firstLevelMenus,
    menus,
    openKeys,
    routerPushByKey,
    secondLevelMenus,
    selectedKey,
    setDrawerVisible,
  } = useAdminMenus();
  const sidebarCollapse = useAppStore((state) => state.system.settings.sidebarCollapse);
  const autoSelectFirstMenu = useAppStore((state) => state.system.sidebar.autoSelectFirstMenu);
  const headerHeight = useAppStore((state) => state.system.header.height);

  const routeOpenKey = openKeys.join('\0');
  const currentSelectedKey = selectedKey[0] ?? '';
  const [menuOpenKeys, setMenuOpenKeys] = useState(openKeys);

  const headerSelectedKeys = activeFirstLevelMenuKey ? [activeFirstLevelMenuKey] : [];
  const headerItems = renderMenuItems(firstLevelMenus, { mode: 'horizontal' });
  const items = renderMenuItems(secondLevelMenus, { mode: 'inline' });

  function handleSelectFirst(info: MenuSelectInfo) {
    changeActiveFirstLevelMenuKey(info.key);

    const menu = findMenuByKey(menus, info.key);
    const children = menu?.children ?? [];

    if (!children.length) {
      routerPushByKey(info.key);
      return;
    }

    if (autoSelectFirstMenu) {
      const deepest = findDeepestMenuKey(children[0]);

      if (deepest) routerPushByKey(deepest);

      return;
    }

    const second = children[0];

    if (!second?.children?.length) return;

    changeActiveSecondLevelMenuKey(second.key);
    setDrawerVisible(true);
  }

  function handleSelectChild(info: MenuSelectInfo) {
    routerPushByKey(info.key);
  }

  function handleOpenChange(keys: string[]) {
    setMenuOpenKeys(keys);
  }

  useUpdateEffect(() => {
    setMenuOpenKeys(openKeys);
  }, [currentSelectedKey, routeOpenKey]);

  return (
    <>
      <MenuPortal to={GLOBAL_HEADER_MENU_SELECTOR}>
        <Menu
          className="flex h-full min-w-0 items-center overflow-x-auto"
          items={headerItems}
          mode="horizontal"
          selectedKeys={headerSelectedKeys}
          style={{ lineHeight: `${headerHeight}px` }}
          onSelect={handleSelectFirst}
        />
      </MenuPortal>

      <MenuPortal to={GLOBAL_SIDEBAR_MENU_SELECTOR}>
        <ScrollArea className="h-full">
          <Menu
            inlineCollapsed={sidebarCollapse}
            items={items}
            mode="inline"
            openKeys={menuOpenKeys}
            selectedKeys={selectedKey}
            onOpenChange={handleOpenChange}
            onSelect={handleSelectChild}
          />
        </ScrollArea>
      </MenuPortal>
    </>
  );
};

function findMenuByKey(menus: readonly GeneratedMenu[], key: string) {
  for (const menu of menus) {
    if (menu.key === key) return menu;
  }

  return undefined;
}

function findDeepestMenuKey(menu: GeneratedMenu | undefined) {
  let current = menu;

  while (current?.children?.length) {
    current = current.children[0];
  }

  return current?.key;
}

export default TopHybridHeaderFirstMenu;
