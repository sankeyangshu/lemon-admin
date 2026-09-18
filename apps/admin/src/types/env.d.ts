/**
 * Namespace Env
 * 声明 import.meta 对象的类型
 */
declare namespace Env {
  /**
   * 声明 import.meta 对象的类型
   */
  interface ImportMeta extends ImportMetaEnv {
    /**
     * 应用标题
     */
    readonly VITE_APP_TITLE: string;
    /**
     * 开发或生产时，服务的基础公共路径
     */
    readonly VITE_BASE_URL: string;
    /**
     * 是否删除 console
     */
    readonly VITE_DROP_CONSOLE: boolean;
    /**
     * 是否自动打开应用
     */
    readonly VITE_OPEN: boolean;
    /**
     * 打包应用输出目录
     */
    readonly VITE_OUTPUT_DIR: string;
    /**
     * 应用端口
     */
    readonly VITE_PORT: number;
    /**
     * 跨域代理配置
     */
    readonly VITE_PROXY: [string, string][];
    /**
     * 是否生成包预览文件
     */
    readonly VITE_REPORT: boolean;
    /**
     * 后端服务基础 URL
     */
    readonly VITE_SERVICE_BASE_URL: string;
    /**
     * 权限路由模式
     * - Static: 静态权限路由，在客户端生成
     * - Dynamic: 动态权限路由，在服务端生成，通过接口获取权限路由
     */
    readonly VITE_AUTH_ROUTE_MODE: 'static' | 'dynamic';
    /**
     * 首页路由 key
     * 当权限路由模式为静态时，首页路由 key 才有效，如果权限路由模式为动态，首页路由 key 在后台定义
     */
    readonly VITE_ROUTE_HOME: App.Global.RouteId;
    /**
     * 用于区分不同域的存储
     */
    readonly VITE_STORAGE_PREFIX?: string;
    /**
     * 是否自动检测应用更新
     */
    readonly VITE_AUTOMATICALLY_DETECT_UPDATE: boolean;
  }
}

interface ImportMeta {
  readonly env: Env.ImportMeta;
}
