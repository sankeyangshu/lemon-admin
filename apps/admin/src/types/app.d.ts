/**
 * 应用全局类型
 */
declare namespace App {
  /**
   * 国际化命名空间
   */
  namespace I18n {
    /**
     * 语言类型
     */
    type LangType = 'en-US' | 'zh-CN';

    /**
     * 语言选项
     */
    interface LangOption {
      value: LangType;
      text: string;
    }

    /**
     * i18n key
     */
    interface I18nScheme {
      system: {
        checkUrl: string;
        errorFallback: string;
        forbidden: string;
        goHome: string;
        loading: string;
        notFound: string;
        refreshAgain: string;
        serverError: string;
        title: string;
        updateCancel: string;
        updateConfirm: string;
        updateContent: string;
        updateTitle: string;
        themeMode: string;
        systemTheme: string;
        confirm: string;
        cancel: string;
        noMore: string;
      };
      api: {
        errMsg400: string;
        errMsg401: string;
        errMsg403: string;
        errMsg404: string;
        errMsg405: string;
        errMsg408: string;
        errMsg500: string;
        errMsg501: string;
        errMsg502: string;
        errMsg503: string;
        errMsg504: string;
        errMsg505: string;
        errMsgDefault: string;
        requestCancelled: string;
        networkError: string;
        requestConfigError: string;
      };
      theme: {
        header: {
          menuToggler: {
            expand: string;
            collapse: string;
          };
          fullScreen: {
            enter: string;
            exit: string;
          };
          globalSearch: {
            title: string;
            placeholder: string;
            history: string;
            selectKeyDown: string;
            switchKeyDown: string;
            exitKeyDown: string;
          };
          themeMode: string;
          locale: string;
          notice: {
            title: string;
            info: string;
            todo: string;
            not: string;
            all: string;
          };
          user: {
            userCenter: string;
            docs: string;
            github: string;
            lockScreen: string;
          };
        };
        drawer: {
          title: string;
          tabs: {
            appearance: string;
            layout: string;
            general: string;
          };
          appearance: {
            themeSchema: {
              title: string;
              light: string;
              dark: string;
              auto: string;
            };
            greyMode: string;
            weakMode: string;
            themeColor: string;
            themeRadius: string;
          };
          layout: {
            layoutMode: {
              title: string;
            } & Record<Config.LayoutMode, string> & {
                [K in `${Config.LayoutMode}_detail`]: string;
              };
            tab: {
              title: string;
              visible: string;
              cache: string;
              height: string;
              mode: { title: string } & Record<Config.TabMode, string>;
              closeByMiddleClick: string;
              closeByMiddleClickTip: string;
            };
            header: {
              title: string;
              height: string;
              breadcrumb: {
                visible: string;
                showIcon: string;
              };
            };
            sidebar: {
              title: string;
              inverted: string;
              width: string;
              collapsedWidth: string;
              mixWidth: string;
              mixCollapsedWidth: string;
              mixChildMenuWidth: string;
              autoSelectFirstMenu: string;
              autoSelectFirstMenuTip: string;
              pinChildMenu: string;
              unpinChildMenu: string;
            };
            footer: {
              title: string;
              visible: string;
              fixed: string;
              height: string;
              right: string;
            };
            content: {
              title: string;
              scrollMode: {
                title: string;
                tip: string;
                wrapper: string;
                content: string;
              };
            };
          };
          footer: {
            copyConfig: string;
            resetConfig: string;
          };
        };
      };
      login: {
        title: string;
        subTitle: string;
        form: {
          userName: string;
          password: string;
        };
        placeholder: {
          username: string;
          password: string;
        };
        rememberPwd: string;
        forgetPwd: string;
        btnText: string;
        otherSignIn: string;
        noAccount: string;
        register: string;
        logout: string;
      };
    }

    type GetI18nKey<
      T extends Record<string, unknown>,
      K extends keyof T = keyof T,
    > = K extends string
      ? T[K] extends Record<string, unknown>
        ? `${K}.${GetI18nKey<T[K]>}`
        : K
      : never;

    /**
     * I18n key
     */
    type I18nKey = GetI18nKey<I18nScheme>;
  }

  /**
   * 全局配置命名空间
   */
  namespace Config {
    /**
     * 主题颜色
     */
    type ThemeColor =
      | 'teal'
      | 'beige'
      | 'oceanBlue'
      | 'emeraldGreen'
      | 'hotPink'
      | 'coralRed'
      | 'salmonPink'
      | 'orange'
      | 'violet';

    /**
     * 布局模式
     * - vertical: 左侧菜单模式
     * - horizontal: 顶部菜单模式
     * - vertical-mix: 左侧菜单混合模式
     * - top-hybrid-sidebar-first: 顶部混合-侧边优先
     * - top-hybrid-header-first: 顶部混合-顶部优先
     */
    type LayoutMode =
      | 'vertical'
      | 'horizontal'
      | 'vertical-mix'
      | 'vertical-hybrid-header-first'
      | 'top-hybrid-sidebar-first'
      | 'top-hybrid-header-first';

    /**
     * 标签风格
     * - button: 按钮风格
     * - chrome: 谷歌风格
     * - slider: 滑块风格
     */
    type TabMode = 'button' | 'chrome' | 'slider';

    /**
     * 系统配置
     */
    interface System {
      /**
       * 主题配置
       */
      theme: {
        /**
         * 主题颜色
         * @default 'teal'
         */
        color: ThemeColor;
        /**
         * 灰度模式
         * @default false
         */
        greyMode: boolean;
        /**
         * 色弱模式
         * @default false
         */
        weakMode: boolean;
        /**
         * 圆角值
         * @default 6
         */
        radius: number;
      };

      /**
       * 布局配置
       */
      layout: {
        /**
         * 主题布局模式
         * @default 'vertical'
         * @see {@link LayoutMode}
         */
        mode: LayoutMode;
        /**
         * 滚动模式
         * @default 'content'
         */
        scrollMode: 'wrapper' | 'content';
      };

      /**
       * 头部配置
       */
      header: {
        /**
         * 头部高度
         * @default 56
         */
        height: number;
        /**
         * 显示面包屑
         * @default true
         */
        breadcrumbVisible: boolean;
        /**
         * 显示面包屑图标
         * @default true
         */
        breadcrumbShowIcon: boolean;
      };

      /**
       * 标签页配置
       */
      tab: {
        /**
         * 显示标签
         * @default true
         */
        visible: boolean;
        /**
         * 是否缓存标签
         * @default true
         */
        cache: boolean;
        /**
         * 标签高度
         * @default 44
         */
        height: number;
        /**
         * 标签风格
         * @default 'chrome'
         * @see {@link TabMode}
         */
        mode: TabMode;
        /**
         * 鼠标中键关闭标签页
         * @default false
         */
        closeTabByMiddleClick: boolean;
      };

      /**
       * 侧边栏配置
       */
      sidebar: {
        /**
         * 侧边栏反转色
         * @default false
         */
        inverted: boolean;
        /**
         * 侧边栏宽度
         * @default 220
         */
        width: number;
        /**
         * 侧边栏折叠宽度
         * @default 64
         */
        collapsedWidth: number;
        /**
         * 侧边栏混合子菜单宽度
         * @default 200
         */
        mixChildMenuWidth: number;
        /**
         * 侧边栏混合折叠宽度
         * @default 64
         */
        mixCollapsedWidth: number;
        /**
         * 侧边栏混合宽度
         * @default 90
         */
        mixWidth: number;
        /**
         * 侧边栏自动选择第一个子菜单
         * @default false
         */
        autoSelectFirstMenu: boolean;
      };

      /**
       * 底部配置
       */
      footer: {
        /**
         * 底部显示
         * @default true
         */
        visible: boolean;
        /**
         * 底部高度
         * @default 48
         */
        height: number;
        /**
         * 底部固定
         * @default false
         */
        fixed: boolean;
        /**
         * 底部居于右侧
         * @default true
         */
        right: boolean;
      };

      /**
       * 设置配置
       */
      settings: {
        /**
         * 显示主题设置
         */
        showThemeDrawer: boolean;
        /**
         * 内容水平滚动
         */
        contentXScrollable: boolean;
        /**
         * 内容全屏
         */
        fullContent: boolean;
        /**
         * 混合侧边栏固定
         */
        mixSidebarFixed: boolean;
        /**
         * 重新加载标志
         */
        reloadFlag: boolean;
        /**
         * 侧边栏折叠
         */
        sidebarCollapse: boolean;
        /**
         * 固定头部和标签栏
         * @default true
         */
        fixedHeaderAndTab: boolean;
      };
    }
  }

  /**
   * 路由命名空间
   */
  namespace Router {
    type RouteId = keyof import('@/routeTree.gen').FileRoutesById;
    type RoutePath = keyof import('@/routeTree.gen').FileRoutesByTo;
    type IconifyIcon = import('@iconify/react').IconifyIcon;
    type LocalSvgName = (typeof import('~virtual/svg-component').svgNames)[number];

    /**
     * 路由元数据
     * @description 路由和菜单共用的 meta。静态来自 staticData，动态来自适配后的后端节点
     */
    interface RouteMeta {
      /**
       * 路由标题，菜单和面包屑的兜底文案
       */
      title?: string | null;
      /**
       * 国际化 key
       */
      i18nKey?: I18n.I18nKey | null;
      /**
       * 是否缓存页面
       */
      keepAlive?: boolean | null;
      /**
       * 外链。有值时点击开新窗口，不走 navigate
       */
      href?: string | null;
      /**
       * 内嵌 iframe 地址，不是 href 外链
       */
      url?: string | null;
      /**
       * 菜单配置
       */
      menu?: MenuMeta | null;
      /**
       * 用户权限。空数组或没写表示不限制
       */
      permissions?: string[] | null;
      /**
       * 从菜单点进来时附带的 search
       */
      query?: { key: string; value: string }[] | null;
      /**
       * 标签页
       */
      tab?: {
        /**
         * 固定标签的序号
         */
        fixedIndex?: number | null;
        /**
         * 同一 path 不同 query 是否各开一个页签
         */
        multi?: boolean | null;
      } | null;
    }

    /**
     * 菜单元数据
     */
    interface MenuMeta {
      /**
       * 图标, Iconify 图标名
       */
      icon?: string | IconifyIcon | null;
      /**
       * 本地图标
       */
      localIcon?: LocalSvgName | null;
      /**
       * 高亮菜单 path
       */
      activeMenu?: string | null;
      /**
       * 角标配置
       */
      badge?: MenuBadge | null;
      /**
       * 自定义右侧扩展的注册 key
       */
      extra?: string | null;
      /**
       * 隐藏菜单
       */
      hide?: boolean | null;
      /**
       * 排序值，越小越靠前，同级排序
       */
      order?: number | null;
      /**
       * 是否禁用
       */
      disabled?: boolean | null;
      /**
       * 菜单类型
       * - divider: 分隔线
       * - group: 分组
       * - item: 可点
       */
      type?: 'divider' | 'group' | 'item' | null;
    }

    /**
     * 角标配置
     */
    interface MenuBadge {
      /**
       * 值为 0 时是否仍然显示
       */
      showZero?: boolean;
      /**
       * 角标类型
       * - dot: 点
       * - normal: 数字或文案
       */
      type?: 'dot' | 'normal';
      /**
       * 静态文案，有 valueKey 时以动态值为准
       */
      value?: number | string | null;
      /**
       * 从菜单 store 的 badgeValues 里取动态值的 key
       */
      valueKey?: string;
      /**
       * 颜色
       */
      variant?: string;
    }
  }
}
