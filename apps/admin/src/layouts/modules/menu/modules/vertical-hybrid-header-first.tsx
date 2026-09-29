import { useUpdateEffect } from '@reactuses/core';
import { useTranslation } from '@workspace/web-i18n';
import { Button } from '@workspace/web-ui/components/button';
import { ScrollArea } from '@workspace/web-ui/components/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/web-ui/components/tooltip';
import { cn } from '@workspace/web-ui/lib/utils';
import { useState, type MouseEvent } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { Menu, type MenuSelectInfo } from '@/components/custom/menu';
import MenuToggler from '@/components/custom/menu-toggler';
import SvgIcon from '@/components/custom/svg-icon';
import { useAdminMenus, type GeneratedMenu } from '@/core/menu';
import { useTheme } from '@/core/theme';
import { GLOBAL_HEADER_MENU_SELECTOR, GLOBAL_SIDEBAR_MENU_SELECTOR } from '@/layouts/constant';
import Logo from '@/layouts/modules/logo';
import { useAppStore } from '@/stores/app';

import MenuPortal from '../components/menu-portal';
import { renderMenuItems } from '../components/menu-renderer';
import OverflowText from '../components/overflow-text';

/**
 * 左侧混合-顶部优先。
 * 左侧混合布局，一级菜单在顶部，二级菜单在左侧深色区域，三级菜单在左侧浅色区域。
 */
const VerticalHybridHeaderFirstMenu = () => {
  const {
    activeFirstLevelMenuKey,
    activeSecondLevelMenuKey,
    changeActiveFirstLevelMenuKey,
    changeActiveSecondLevelMenuKey,
    childLevelMenus,
    drawerVisible,
    firstLevelMenus,
    menus,
    openKeys,
    routerPushByKey,
    secondLevelMenus,
    selectedKey,
    setDrawerVisible,
  } = useAdminMenus();
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const {
    autoSelectFirstMenu,
    headerHeight,
    mixChildMenuWidth,
    mixSidebarFixed,
    setSettings,
    sidebarCollapse,
    sidebarInverted,
  } = useAppStore(
    useShallow((state) => ({
      autoSelectFirstMenu: state.system.sidebar.autoSelectFirstMenu,
      headerHeight: state.system.header.height,
      mixChildMenuWidth: state.system.sidebar.mixChildMenuWidth,
      mixSidebarFixed: state.system.settings.mixSidebarFixed,
      setSettings: state.setSettings,
      sidebarCollapse: state.system.settings.sidebarCollapse,
      sidebarInverted: state.system.sidebar.inverted,
    }))
  );

  const inverted = !darkMode && sidebarInverted;
  const routeOpenKey = openKeys.join('\0');
  const currentSelectedKey = selectedKey[0] ?? '';
  const [menuOpenKeys, setMenuOpenKeys] = useState(openKeys);

  const headerSelectedKeys = activeFirstLevelMenuKey ? [activeFirstLevelMenuKey] : [];
  const headerItems = renderMenuItems(firstLevelMenus, { mode: 'horizontal' });

  const hasMenus = childLevelMenus.length > 0;
  const showChild = hasMenus && (drawerVisible || mixSidebarFixed);
  const flowWidth = hasMenus && mixSidebarFixed ? mixChildMenuWidth : 0;
  const panelWidth = showChild ? mixChildMenuWidth : 0;
  const activeMenu = findMenuByKey(secondLevelMenus, activeSecondLevelMenuKey);
  const activeLabel = activeMenu ? getMenuTitle(activeMenu, t) : '';
  const childItems = renderMenuItems(childLevelMenus, { mode: 'inline' });

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

  function handleSelectSecond(event: MouseEvent<HTMLButtonElement>) {
    const key = event.currentTarget.dataset.menuKey;

    if (!key) return;

    changeActiveSecondLevelMenuKey(key);

    const menu = findMenuByKey(secondLevelMenus, key);

    if (!menu?.children?.length) {
      routerPushByKey(key);
      return;
    }

    setDrawerVisible(true);
  }

  function handleSelectChild(info: MenuSelectInfo) {
    routerPushByKey(info.key);
  }

  function handleOpenChange(keys: string[]) {
    setMenuOpenKeys(keys);
  }

  function handleTogglePin() {
    setSettings('mixSidebarFixed', !mixSidebarFixed);
  }

  function handleMouseLeave() {
    setDrawerVisible(false);
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
        <div className="flex h-full" onMouseLeave={handleMouseLeave}>
          <div className={cn('flex h-full min-w-0 flex-1 flex-col', inverted && 'text-white')}>
            <Logo showTitle={false} className="shrink-0" style={{ height: headerHeight }} />

            <ScrollArea className="min-h-0 flex-1">
              <div className="flex flex-col gap-1 p-1">
                {secondLevelMenus.map((menu) => {
                  if (menu.type === 'group') return null;

                  if (menu.type === 'divider') {
                    return (
                      <div
                        key={menu.key}
                        className={cn(
                          'mx-2 my-1 h-px',
                          inverted ? 'bg-white/20' : 'bg-sidebar-border'
                        )}
                      />
                    );
                  }

                  const active = menu.key === activeSecondLevelMenuKey;

                  return (
                    <button
                      key={menu.key}
                      type="button"
                      data-menu-key={menu.key}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'flex w-full cursor-pointer flex-col items-center rounded-lg px-1 py-2 transition-colors',
                        'focus-visible:ring-sidebar-ring focus-visible:ring-2 focus-visible:outline-none',
                        getIconItemClassName(active, inverted)
                      )}
                      onClick={handleSelectSecond}
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

            <div
              className={cn(
                'flex shrink-0 justify-center py-2',
                inverted && '[&_button]:text-white'
              )}
            >
              <MenuToggler />
            </div>
          </div>

          <div
            className="relative h-full shrink-0 transition-[width] duration-300"
            style={{ width: flowWidth }}
          >
            <div
              className={cn(
                'bg-sidebar text-sidebar-foreground absolute inset-y-0 left-0 z-10 flex flex-col overflow-hidden border-l transition-[width] duration-300',
                panelWidth > 0 && !mixSidebarFixed && 'shadow-md'
              )}
              style={{ width: panelWidth }}
            >
              <header
                className="flex shrink-0 items-center justify-between gap-2 px-3"
                style={{ height: headerHeight }}
              >
                <h2 className="text-primary min-w-0 truncate text-base font-bold">{activeLabel}</h2>
                <MixPinButton pinned={mixSidebarFixed} onToggle={handleTogglePin} />
              </header>

              {panelWidth > 0 ? (
                <ScrollArea className="min-h-0 flex-1">
                  <Menu
                    items={childItems}
                    mode="inline"
                    openKeys={menuOpenKeys}
                    selectedKeys={selectedKey}
                    onOpenChange={handleOpenChange}
                    onSelect={handleSelectChild}
                  />
                </ScrollArea>
              ) : null}
            </div>
          </div>
        </div>
      </MenuPortal>
    </>
  );
};

interface MixPinButtonProps {
  /** 子栏是否已经钉住 */
  pinned: boolean;
  /** 切换钉住 */
  onToggle: () => void;
}

const MixPinButton = (props: MixPinButtonProps) => {
  const { onToggle, pinned } = props;

  const { t } = useTranslation();

  const label = pinned
    ? t('theme.drawer.layout.sidebar.unpinChildMenu')
    : t('theme.drawer.layout.sidebar.pinChildMenu');

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-pressed={pinned}
            aria-label={label}
            onClick={onToggle}
          >
            <SvgIcon icon={pinned ? 'lucide:pin-off' : 'lucide:pin'} className="size-4!" />
          </Button>
        }
      />
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
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

function getMenuTitle(menu: GeneratedMenu, t: ReturnType<typeof useTranslation>['t']) {
  if (menu.i18nKey) {
    return t(menu.i18nKey, { defaultValue: menu.title ?? '' });
  }

  return menu.title ?? '';
}

function getIconItemClassName(active: boolean, inverted: boolean) {
  if (inverted) {
    return active ? 'bg-primary text-white' : 'text-white/70 hover:bg-white/10 hover:text-white';
  }

  return active
    ? 'bg-primary/15 text-primary'
    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground';
}

export default VerticalHybridHeaderFirstMenu;
