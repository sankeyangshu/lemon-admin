import type { ProxyOptions } from 'vite';

export type ProxyList = [prefix: string, target: string][];

const HTTPS_RE = /^https:\/\//;

/**
 * 转义正则元字符，避免前缀里的 `+` `.` 等把 `rewrite` 写坏。
 * @param value - 代理 path 前缀
 */
function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 创建代理，用于解析 .env.* 代理配置
 * @param list - 代理地址列表
 */
export function createProxy(list: ProxyList = []) {
  if (!list.length) return undefined;

  const proxy: Record<string, ProxyOptions> = {};

  for (const [prefix, target] of list) {
    proxy[prefix] = {
      target,
      changeOrigin: true,
      rewrite: (path) => path.replace(new RegExp(`^${escapeRegExp(prefix)}`), ''),
      // https is require secure=false
      // 如果您secure="true"只允许来自 HTTPS 的请求，则secure="false"意味着允许来自 HTTP 和 HTTPS 的请求。
      ...(HTTPS_RE.test(target) ? { secure: false } : {}),
    };
  }

  return proxy;
}
