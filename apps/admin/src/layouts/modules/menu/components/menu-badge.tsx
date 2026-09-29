import { Badge } from '@workspace/web-ui/components/badge';
import { cn } from '@workspace/web-ui/lib/utils';

import type { MenuBadgeValue } from '@/core/menu';
import { useMenuStore } from '@/stores/menu';

interface MenuBadgeProps {
  /** 路由菜单上的角标配置 */
  badge: App.Router.MenuBadge;
}

/**
 * 菜单角标
 */
const MenuBadge = (props: MenuBadgeProps) => {
  const { badge } = props;

  const badgeValues = useMenuStore((state) => state.badgeValues);
  const { showZero = false, type = 'normal', variant = 'default' } = badge;
  const colorClassName = getBadgeClassName(variant);

  if (type === 'dot') {
    return (
      <span
        className={cn('bg-primary size-2 shrink-0 rounded-full', colorClassName)}
        data-menu-badge="dot"
      />
    );
  }

  const value = getBadgeValue(badge, badgeValues);

  if (!shouldRenderValue(value, showZero)) {
    return null;
  }

  return (
    <Badge className={cn('h-4 min-w-4 px-1', colorClassName)} data-menu-badge="normal">
      {value}
    </Badge>
  );
};

/**
 * 取角标要显示的值。
 * 有 valueKey 且 store 里写过这个 key 时用动态值，否则用路由上的静态 value。
 * @param badge 路由菜单上的角标配置
 * @param badgeValues valueKey 到动态值的映射
 */
function getBadgeValue(
  badge: App.Router.MenuBadge,
  badgeValues: Record<string, MenuBadgeValue | undefined>
) {
  if (!badge.valueKey) {
    return badge.value;
  }

  if (Object.hasOwn(badgeValues, badge.valueKey)) {
    return badgeValues[badge.valueKey];
  }

  return badge.value;
}

/**
 * 判断数字或文案角标是否渲染。
 * 0 只在 showZero 时显示，空字符串、null、undefined 不显示。
 * @param value 最终要显示的值
 * @param showZero 值为 0 时是否仍然显示
 */
function shouldRenderValue(value: MenuBadgeValue | undefined, showZero: boolean) {
  if (value === 0) {
    return showZero;
  }

  return value !== undefined && value !== null && value !== '';
}

/**
 * 按角标颜色取 class。
 * 未识别的 variant 不附加颜色，沿用 Badge 默认样式。
 * @param variant 路由上的 badge.variant
 */
function getBadgeClassName(variant: string) {
  switch (variant) {
    case 'error':
      return 'bg-destructive text-white';
    case 'info':
    case 'primary':
      return 'bg-primary text-primary-foreground';
    case 'success':
      return 'bg-emerald-600 text-white';
    case 'warning':
      return 'bg-amber-500 text-white';
    default:
      return undefined;
  }
}

export default MenuBadge;
