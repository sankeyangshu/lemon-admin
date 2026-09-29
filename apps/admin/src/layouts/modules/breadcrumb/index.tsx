import { Link } from '@tanstack/react-router';
import { useTranslation } from '@workspace/web-i18n';
import {
  Breadcrumb as BreadcrumbNav,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@workspace/web-ui/components/breadcrumb';
import { Fragment } from 'react';
import { useShallow } from 'zustand/react/shallow';

import SvgIcon from '@/components/custom/svg-icon';
import { useAdminMenus, type PathMenu } from '@/core/menu';
import { useAppStore } from '@/stores/app';

const Breadcrumb = () => {
  const { t } = useTranslation();

  const { activeMenu, currentMenu, getMenuInfoByPath, home, openKeys, selectedKey } =
    useAdminMenus();

  const { breadcrumbShowIcon, breadcrumbVisible } = useAppStore(
    useShallow((state) => ({
      breadcrumbShowIcon: state.system.header.breadcrumbShowIcon,
      breadcrumbVisible: state.system.header.breadcrumbVisible,
    }))
  );

  const isHome = selectedKey[0] === home;
  const allBreadcrumb = [
    isHome ? null : home,
    ...openKeys,
    ...selectedKey,
    activeMenu ? currentMenu?.key : null,
  ];
  const items = allBreadcrumb.flatMap((key) => {
    if (!key) return [];

    const menuInfo = getMenuInfoByPath(key);

    return menuInfo ? [menuInfo] : [];
  });

  function getTitle(menu: PathMenu) {
    if (menu.i18nKey) {
      return t(menu.i18nKey, { defaultValue: menu.title ?? '' });
    }

    return menu.title ?? '';
  }

  if (!breadcrumbVisible || items.length === 0) {
    return null;
  }

  return (
    <BreadcrumbNav className="ml-3">
      <BreadcrumbList className="flex-nowrap">
        {items.map((menu, index) => {
          const isLast = index === items.length - 1;
          const icon = menu.menu?.icon ?? undefined;
          const localIcon = menu.menu?.localIcon ?? undefined;
          const title = (
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              {breadcrumbShowIcon && (Boolean(icon) || Boolean(localIcon)) ? (
                <SvgIcon className="size-3.5" icon={icon} localIcon={localIcon} />
              ) : null}
              <span>{getTitle(menu)}</span>
            </span>
          );

          return (
            <Fragment key={menu.key}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink render={<Link to={menu.path} />}>{title}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {isLast ? null : <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </BreadcrumbNav>
  );
};

export default Breadcrumb;
