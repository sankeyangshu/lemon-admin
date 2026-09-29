import type { AnyRoute } from '@tanstack/react-router';

import type {
  GeneratedMenu,
  GenerateMenuOptions,
  MenusByPath,
  MenuUser,
  PathMenu,
  StaticMenuContext,
  StaticMenuNode,
} from './types';

/** 默认 layout route id */
const DEFAULT_LAYOUT_ID = '/_authenticated';

/**
 * 生成菜单
 * @param options 菜单选项
 */
export function generate(options: GenerateMenuOptions) {
  // TODO: 动态路由模式，由后端传递菜单数据
  // if (options.mode === 'dynamic') {
  //   return generateDynamicMenus(options);
  // }

  // 静态路由模式，由前端静态定义
  return generateStaticMenus(options);
}

/**
 * 生成静态菜单
 * @param options 菜单选项
 */
function generateStaticMenus(options: GenerateMenuOptions) {
  const {
    defaultHome,
    home,
    layoutId = DEFAULT_LAYOUT_ID,
    routeTree,
    superRole,
    userInfo,
  } = options;
  const menusByPath: MenusByPath = new Map();
  const ctx: StaticMenuContext = { menusByPath, superRole, userInfo };
  const layout = findLayoutRoute(routeTree, layoutId);

  const menus = sortMenus(
    childRoutes(layout).flatMap((route) => {
      const menu = transformStaticRouteToMenu(ctx, { route, parentKeys: [], depth: 0 });
      return menu ? [menu] : [];
    })
  );

  return {
    menus,
    menusByPath,
    home: defaultHome || home || '/',
  };
}

/**
 * 菜单 key 和 URL path 对齐。根路径 `/` 保留，其余去掉尾部 `/`。
 * @param path 原始路径
 * @returns 规范化后的路径
 */
export function normalizePath(path: string) {
  // 只去掉非根路径的尾部斜杠，避免 /home/ 和 /home 变成两个 key。
  return path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
}

/**
 * 判断路由是否有权限
 * @param routeMeta 路由元数据
 * @param userInfo 用户信息
 * @param superRole 超级角色
 */
export function hasRoutePermission(
  routeMeta: Pick<App.Router.RouteMeta, 'permissions'> | undefined,
  userInfo?: MenuUser | null,
  superRole?: string
) {
  const permissions = routeMeta?.permissions;

  // 1：没写权限要求，不拦截。
  if (!permissions?.length) {
    return true;
  }

  const roles = userInfo?.roles ?? [];

  // 2：超级角色直接过。
  if (superRole && roles.includes(superRole)) {
    return true;
  }

  return permissions.some((permission) => roles.includes(permission));
}

/**
 * 排序菜单
 * @param menus 同级菜单
 * @returns 按 order 升序的新数组，缺省当 0
 */
function sortMenus(menus: GeneratedMenu[]) {
  return menus.toSorted((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/**
 * 获取布局路由
 * @param routeTree 路由树
 * @param layoutId 布局路由 id
 * @returns 匹配的 layout，没有则为 undefined
 */
function findLayoutRoute(routeTree: AnyRoute, layoutId: string) {
  // 菜单只挂在这一层 layout 上，页面路由在它的 children 里。
  return childRoutes(routeTree).find((route) => route.id === layoutId);
}

/**
 * 判断值是否为路由
 * @param value 值
 */
function isRoute(value: unknown): value is AnyRoute {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return 'id' in value && 'fullPath' in value && 'options' in value;
}

/**
 * 取出路由的子路由
 * @param route 当前路由，没有则返回空数组
 * @returns 子路由列表
 */
function childRoutes(route?: AnyRoute) {
  const children: unknown = route?.children;

  if (!children || typeof children !== 'object') {
    return [];
  }

  const values = Array.isArray(children) ? children : Object.values(children);
  return values.filter(isRoute);
}

/**
 * 单个静态路由 → 菜单节点
 * @param ctx 整棵树共用的遍历上下文
 * @param node 当前路由在树上的位置
 * @returns 可见菜单节点，隐藏或无权限时为 null
 */
function transformStaticRouteToMenu(ctx: StaticMenuContext, node: StaticMenuNode) {
  const { menusByPath, superRole, userInfo } = ctx;
  const { depth, parentKeys, route } = node;
  const meta: App.Router.RouteMeta | undefined = route.options.staticData;

  // 1：没声明 meta，或角色不够。子孙也不递归
  if (!meta || !hasRoutePermission(meta, userInfo, superRole)) {
    return null;
  }

  // 2：path 规范化，同时当菜单 key 和 menusByPath 的 key
  const path = normalizePath(route.fullPath);
  const record: PathMenu = {
    ...meta,
    id: route.id,
    key: path,
    path,
    parentKeys,
    depth,
  };

  // 3：先写入 menusByPath。hide 页还要给高亮和守卫用
  menusByPath.set(path, record);

  // 4：排除隐藏页
  if (meta.menu?.hide) {
    return null;
  }

  // 5：拼侧边栏节点。icon 只取路由自己写的，没写就空着；order、type 用兜底值
  const menuMeta = meta.menu;
  const menu: GeneratedMenu = {
    badge: menuMeta?.badge,
    extra: menuMeta?.extra,
    href: meta.href,
    i18nKey: meta.i18nKey,
    icon: menuMeta?.icon,
    key: path,
    localIcon: menuMeta?.localIcon,
    order: menuMeta?.order ?? 0,
    path,
    title: meta.title,
    type: menuMeta?.type ?? 'item',
    url: meta.url,
  };

  // 6：递归子路由，parentKeys 带上当前 path
  // 把一条静态路由的子路由转成子菜单，并按 order 排序。
  const children = sortMenus(
    childRoutes(route).flatMap((child) => {
      const childMenu = transformStaticRouteToMenu(ctx, {
        route: child,
        parentKeys: [...parentKeys, path],
        depth: depth + 1,
      });
      return childMenu ? [childMenu] : [];
    })
  );

  if (children.length > 0) {
    menu.children = children;
  }

  return menu;
}
