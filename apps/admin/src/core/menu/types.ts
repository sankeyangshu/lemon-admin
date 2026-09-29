import type { AnyRoute } from '@tanstack/react-router';

/**
 * 用户信息
 */
export interface MenuUser {
  /** 角色列表，用来对 staticData.permissions / 后端 roles 进行权限裁剪 */
  roles?: string[];
}

/**
 * 生成菜单选项
 */
export interface GenerateMenuOptions {
  /**
   * 路由模式
   * - static: 静态模式
   * - dynamic: 动态模式
   */
  mode: 'dynamic' | 'static';
  /**
   * 静态模式要扫描的 layout route id
   * @default `/_authenticated`
   */
  layoutId?: string;
  /**
   * 默认首页。
   * @description 静态模式下为静态首页，动态模式下为动态 home 为空时的回退。对应 store 里的 DEFAULT_HOME
   */
  defaultHome?: string;
  /**
   * 动态首页。
   * @description static模式下不读，除非没传 defaultHome
   */
  home?: string | null;
  /**
   * 动态路由，由后端传递，static 模式不读取
   */
  // backendRoutes?: BackendRoute[];
  /**
   * TanStack 生成的路由树
   */
  routeTree: AnyRoute;
  /**
   * 超级角色权限，命中则跳过权限检查
   */
  superRole?: string;
  /**
   * 用户信息，用来进行权限检查，不传则只保留没写 permissions 的节点
   */
  userInfo?: MenuUser | null;
}

/**
 * 生成的菜单节点
 */
export interface GeneratedMenu extends Omit<App.Router.MenuMeta, 'activeMenu' | 'hide'> {
  /** 标题 */
  title?: string | null;
  /**  路由 key */
  key: string;
  /** 菜单路径 */
  path: string;
  /**  国际化 key */
  i18nKey?: App.I18n.I18nKey | null;
  /** 外链。有值时点击开新窗口，不走 navigate */
  href?: string | null;
  /** 内嵌 iframe 地址，不是 href 外链 */
  url?: string | null;
  /** 子菜单。没有表示叶子。 */
  children?: GeneratedMenu[];
}

/**
 * 路径菜单
 */
export interface PathMenu extends App.Router.RouteMeta {
  /** 路由 id 或后端节点 id */
  id: string;
  /** 路径 key，等于 path */
  key: string;
  /** 祖先 path */
  parentKeys: string[];
  /** 路由路径 */
  path: string;
  /** 深度 */
  depth: number;
}

/** 规范化 path → PathMenu。用 path 反查节点 */
export type MenusByPath = Map<string, PathMenu>;

/** 角标动态值。0 要配合菜单上的 showZero 才会显示 */
export type MenuBadgeValue = number | string | null;

/**
 * 静态菜单遍历时整棵树共用的数据
 */
export interface StaticMenuContext {
  /** 规范化 path → PathMenu。用 path 反查节点 */
  menusByPath: MenusByPath;
  /** 超级角色权限，命中则跳过权限检查 */
  superRole?: string;
  /** 用户信息，用来进行权限检查，不传则只保留没写 permissions 的节点 */
  userInfo?: MenuUser | null;
}

/**
 * 当前正在转换的静态路由在树上的位置
 */
export interface StaticMenuNode {
  /** 深度 */
  depth: number;
  /** 祖先 path */
  parentKeys: string[];
  /** 当前路由 */
  route: AnyRoute;
}
