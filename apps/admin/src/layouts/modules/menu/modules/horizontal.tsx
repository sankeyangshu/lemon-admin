import { Menu, type MenuSelectInfo } from '@/components/custom/menu';
import { useAdminMenus } from '@/core/menu';
import { GLOBAL_HEADER_MENU_SELECTOR } from '@/layouts/constant';
import { useAppStore } from '@/stores/app';

import MenuPortal from '../components/menu-portal';
import { renderMenuItems } from '../components/menu-renderer';

/**
 * 顶部菜单模式。
 * 顶部菜单布局，菜单在顶部，内容在下方。
 */
const HorizontalMenu = () => {
  const { menus, routerPushByKey, selectedKey } = useAdminMenus();
  const headerHeight = useAppStore((state) => state.system.header.height);

  const items = renderMenuItems(menus, { mode: 'horizontal' });

  function handleSelect(info: MenuSelectInfo) {
    routerPushByKey(info.key);
  }

  return (
    <MenuPortal to={GLOBAL_HEADER_MENU_SELECTOR}>
      <Menu
        className="flex h-full min-w-0 items-center overflow-x-auto"
        items={items}
        mode="horizontal"
        selectedKeys={selectedKey}
        style={{ lineHeight: `${headerHeight}px` }}
        onSelect={handleSelect}
      />
    </MenuPortal>
  );
};

export default HorizontalMenu;
