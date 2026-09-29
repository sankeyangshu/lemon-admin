import { useUpdateEffect } from '@reactuses/core';
import { ScrollArea } from '@workspace/web-ui/components/scroll-area';
import { useState } from 'react';

import { Menu, type MenuSelectInfo } from '@/components/custom/menu';
import { useAdminMenus } from '@/core/menu';
import { GLOBAL_SIDEBAR_MENU_SELECTOR } from '@/layouts/constant';
import { useAppStore } from '@/stores/app';

import MenuPortal from '../components/menu-portal';
import { renderMenuItems } from '../components/menu-renderer';

/**
 * 左侧菜单模式。
 * 左侧菜单布局，菜单在左，内容在右。
 */
const VerticalMenu = () => {
  const { menus, openKeys, routerPushByKey, selectedKey } = useAdminMenus();
  const sidebarCollapse = useAppStore((state) => state.system.settings.sidebarCollapse);

  const currentSelectedKey = selectedKey[0] ?? '';
  // 祖先 key 的内容签名。openKeys 在没有父级时每次都是新数组，不能直接当依赖
  const routeOpenKey = openKeys.join('\0');
  const items = renderMenuItems(menus, { mode: 'inline' });
  const [menuOpenKeys, setMenuOpenKeys] = useState(openKeys);

  function handleSelect(info: MenuSelectInfo) {
    routerPushByKey(info.key);
  }

  function handleOpenChange(keys: string[]) {
    setMenuOpenKeys(keys);
  }

  // 路由变了才回到路由上的展开项。折叠时的 popup 由 Menu 自己关掉
  useUpdateEffect(() => {
    setMenuOpenKeys(openKeys);
  }, [currentSelectedKey, routeOpenKey]);

  return (
    <MenuPortal to={GLOBAL_SIDEBAR_MENU_SELECTOR}>
      <ScrollArea className="h-full">
        <Menu
          inlineCollapsed={sidebarCollapse}
          items={items}
          mode="inline"
          openKeys={menuOpenKeys}
          selectedKeys={selectedKey}
          onOpenChange={handleOpenChange}
          onSelect={handleSelect}
        />
      </ScrollArea>
    </MenuPortal>
  );
};

export default VerticalMenu;
