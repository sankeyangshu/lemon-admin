import type { ProxyOptions } from 'vite';

type ProxyTargetList = Record<string, ProxyOptions>;

const httpsRE = /^https:\/\//;

/**
 * 创建代理，用于解析 .env.development 代理配置
 * @param list 代理地址列表
 */
export function createProxy(list: Env.ImportMeta['VITE_PROXY'] = []) {
  const ret: ProxyTargetList = {};

  if (!Array.isArray(list) || !list.length)
    return undefined;

  for (const [prefix, target] of list) {
    const isHttps = httpsRE.test(target);

    // https://github.com/http-party/node-http-proxy#options
    ret[prefix] = {
      target,
      changeOrigin: true,
      rewrite: (path) => path.replace(new RegExp(`^${prefix}`), ''),
      // https is require secure=false
      // 如果您secure="true"只允许来自 HTTPS 的请求，则secure="false"意味着允许来自 HTTP 和 HTTPS 的请求。
      ...(isHttps ? { secure: false } : {}),
    };
  }

  return ret;
}
