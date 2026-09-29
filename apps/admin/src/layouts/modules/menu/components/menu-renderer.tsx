import { Translation } from '@workspace/web-i18n';
import type { ReactNode } from 'react';

import { type ItemType } from '@/components/custom/menu';
import SvgIcon from '@/components/custom/svg-icon';
import type { GeneratedMenu } from '@/core/menu';

import MenuBadge from './menu-badge';
import OverflowText from './overflow-text';

interface RenderMenuItemsOptions {
  /** inline 侧栏、horizontal 顶栏。决定 extra 跟标题怎么排 */
  mode?: 'inline' | 'horizontal' | 'vertical';
}

/**
 * 把生成好的菜单树转成 Menu 的 items。
 * 含国际化标题、图标、角标，以及超长文案提示。
 * @param menus 要渲染的菜单，含分组和分割线
 * @param options 布局模式。horizontal 的第一层把 extra 跟标题排在一行
 */
export function renderMenuItems(
  menus: GeneratedMenu[],
  options: RenderMenuItemsOptions = {}
): ItemType[] {
  return renderMenuLevel(menus, options, 0);
}

function renderMenuLevel(menus: GeneratedMenu[], options: RenderMenuItemsOptions, level: number) {
  return menus.map((menu) => renderMenuItem(menu, options, level));
}

function renderMenuItem(
  menu: GeneratedMenu,
  options: RenderMenuItemsOptions,
  level: number
): ItemType {
  if (menu.type === 'divider') {
    return { type: 'divider' };
  }

  const label = createMenuLabel(menu);
  const extra = createMenuExtra(menu);
  const isHorizontalRoot = options.mode === 'horizontal' && level === 0;

  if (menu.type === 'group') {
    return {
      type: 'group',
      label: extra ? createSubMenuLabel(label, extra) : label,
      children: renderMenuLevel(menu.children ?? [], options, level + 1),
    };
  }

  const item = {
    key: menu.key,
    label,
    title: menu.title ?? undefined,
    icon: renderMenuIcon(menu),
    disabled: Boolean(menu.disabled),
  };

  if (menu.children?.length) {
    return {
      ...item,
      label: createMenuItemLabel(label, extra, isHorizontalRoot),
      children: renderMenuLevel(menu.children, options, level + 1),
    };
  }

  if (extra && isHorizontalRoot) {
    return {
      ...item,
      label: createHorizontalMenuLabel(label, extra),
    };
  }

  return {
    ...item,
    extra,
  };
}

function createMenuLabel(menu: GeneratedMenu) {
  const title = (
    <Translation>
      {(t) =>
        menu.i18nKey ? t(menu.i18nKey, { defaultValue: menu.title ?? '' }) : (menu.title ?? '')
      }
    </Translation>
  );

  return <OverflowText>{title}</OverflowText>;
}

function renderMenuIcon(menu: GeneratedMenu) {
  if (!menu.icon && !menu.localIcon) {
    return undefined;
  }

  return <SvgIcon icon={menu.icon ?? undefined} localIcon={menu.localIcon ?? undefined} />;
}

function createMenuExtra(menu: GeneratedMenu) {
  if (!menu.badge) {
    return undefined;
  }

  return <MenuBadge badge={menu.badge} />;
}

function createSubMenuLabel(label: ReactNode, extra: ReactNode) {
  return (
    <span
      className="flex w-full min-w-0 items-center justify-between gap-2"
      data-menu-submenu-label="with-extra"
    >
      <span className="min-w-0 flex-1 overflow-hidden">{label}</span>
      <span className="inline-flex shrink-0 items-center">{extra}</span>
    </span>
  );
}

function createHorizontalMenuLabel(label: ReactNode, extra: ReactNode) {
  return (
    <span
      className="inline-flex max-w-full min-w-0 items-center gap-1.5"
      data-menu-horizontal-label="with-extra"
    >
      <span className="min-w-0 overflow-hidden">{label}</span>
      <span className="inline-flex shrink-0 items-center">{extra}</span>
    </span>
  );
}

function createMenuItemLabel(
  label: ReactNode,
  extra: ReactNode | undefined,
  isHorizontalRoot: boolean
) {
  if (!extra) {
    return label;
  }

  if (isHorizontalRoot) {
    return createHorizontalMenuLabel(label, extra);
  }

  return createSubMenuLabel(label, extra);
}
