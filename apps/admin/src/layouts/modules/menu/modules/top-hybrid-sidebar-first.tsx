import { useTranslation } from '@workspace/web-i18n';
import { ScrollArea } from '@workspace/web-ui/components/scroll-area';
import { cn } from '@workspace/web-ui/lib/utils';
import type { MouseEvent } from 'react';

import { Menu, type MenuSelectInfo } from '@/components/custom/menu';
import MenuToggler from '@/components/custom/menu-toggler';
import SvgIcon from '@/components/custom/svg-icon';
import { useAdminMenus, type GeneratedMenu } from '@/core/menu';
import { GLOBAL_HEADER_MENU_SELECTOR, GLOBAL_SIDEBAR_MENU_SELECTOR } from '@/layouts/constant';
import { useAppStore } from '@/stores/app';

import MenuPortal from '../components/menu-portal';
import { renderMenuItems } from '../components/menu-renderer';
import OverflowText from '../components/overflow-text';

/**
 * 顶部混合-侧边优先。
 * 顶部混合布局，一级菜单在左侧，二级菜单在顶部。
 */
const TopHybridSidebarFirstMenu = () => {
  const {
    activeFirstLevelMenuKey,
    changeActiveFirstLevelMenuKey,
    menus,
    routerPushByKey,
    secondLevelMenus,
    selectedKey,
  } = useAdminMenus();
  const { t } = useTranslation();
  const sidebarCollapse = useAppStore((state) => state.system.settings.sidebarCollapse);
  const headerHeight = useAppStore((state) => state.system.header.height);

  const headerItems = renderMenuItems(secondLevelMenus, { mode: 'horizontal' });

  function handleSelectFirst(event: MouseEvent<HTMLButtonElement>) {
    const key = event.currentTarget.dataset.menuKey;

    if (!key) return;

    changeActiveFirstLevelMenuKey(key);

    const menu = findMenuByKey(menus, key);

    if (!menu?.children?.length) {
      routerPushByKey(key);
    }
  }

  function handleSelectChild(info: MenuSelectInfo) {
    routerPushByKey(info.key);
  }

  return (
    <>
      <MenuPortal to={GLOBAL_HEADER_MENU_SELECTOR}>
        <Menu
          className="flex h-full min-w-0 items-center overflow-x-auto"
          items={headerItems}
          mode="horizontal"
          selectedKeys={selectedKey}
          style={{ lineHeight: `${headerHeight}px` }}
          onSelect={handleSelectChild}
        />
      </MenuPortal>

      <MenuPortal to={GLOBAL_SIDEBAR_MENU_SELECTOR}>
        <div className="flex h-full flex-col">
          <div className="h-2 shrink-0" />

          <ScrollArea className="min-h-0 flex-1">
            <div className="flex flex-col gap-1 p-1">
              {menus.map((menu) => {
                if (menu.type === 'group') return null;

                if (menu.type === 'divider') {
                  return <div key={menu.key} className="bg-sidebar-border mx-2 my-1 h-px" />;
                }

                const active = menu.key === activeFirstLevelMenuKey;

                return (
                  <button
                    key={menu.key}
                    type="button"
                    data-menu-key={menu.key}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex w-full cursor-pointer flex-col items-center rounded-lg px-1 py-2 transition-colors',
                      'focus-visible:ring-sidebar-ring focus-visible:ring-2 focus-visible:outline-none',
                      active
                        ? 'bg-primary/15 text-primary'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    )}
                    onClick={handleSelectFirst}
                  >
                    <SvgIcon
                      icon={menu.icon ?? undefined}
                      localIcon={menu.localIcon ?? undefined}
                      className={sidebarCollapse ? 'size-4!' : 'size-5!'}
                    />
                    <span
                      className={cn(
                        'w-full text-center text-xs',
                        sidebarCollapse ? 'h-0 overflow-hidden' : 'mt-1 h-5'
                      )}
                    >
                      <OverflowText>{getMenuTitle(menu, t)}</OverflowText>
                    </span>
                  </button>
                );
              })}
            </div>
          </ScrollArea>

          <div className="flex shrink-0 justify-center py-2">
            <MenuToggler />
          </div>
        </div>
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

function getMenuTitle(menu: GeneratedMenu, t: ReturnType<typeof useTranslation>['t']) {
  if (menu.i18nKey) {
    return t(menu.i18nKey, { defaultValue: menu.title ?? '' });
  }

  return menu.title ?? '';
}

export default TopHybridSidebarFirstMenu;
