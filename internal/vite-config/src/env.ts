import type { ProxyList } from './proxy';

/**
 * 把 `VITE_PROXY` 字符串解析成 `[prefix, target][]`
 * @param value - `.env` 里的 JSON 数组字符串
 */
function parseProxyList(value: string) {
  let parsed: unknown;

  try {
    parsed = JSON.parse(value);
  } catch (error) {
    throw new Error('VITE_PROXY is not valid JSON', { cause: error });
  }

  if (!Array.isArray(parsed)) {
    throw new TypeError('VITE_PROXY must be an array of [prefix, target] pairs');
  }

  for (const item of parsed) {
    if (!Array.isArray(item) || typeof item[0] !== 'string' || typeof item[1] !== 'string') {
      throw new TypeError('VITE_PROXY items must be [prefix, target] string pairs');
    }
  }

  return parsed as ProxyList;
}

/**
 * 读取并处理所有环境变量配置文件
 *
 * - `"true"` / `"false"` → boolean
 * - 以 `_PORT` 结尾的数字字符串 → number
 * - `VITE_PROXY` → `[prefix, target][]`，空字符串 → `[]`，非法 JSON 直接 throw
 * - 其它空字符串原样保留
 *
 * 具体字段以泛型为准，类型源在项目的 `Env.ImportMeta`，不在本包写死。
 *
 * @example
 *   ```ts
 *   const viteEnv = wrapperEnv<Env.ImportMeta>(loadEnv(mode, root));
 *   ```;
 *
 * @param envConf - `loadEnv(mode, root)` 的原始字符串表
 * @returns 断言为 `T` 的转换结果
 * @throws `VITE_PROXY` 不是合法 JSON 或条目不是 `[prefix, target]` 时抛错
 */
export function wrapperEnv<T extends object>(envConf: Record<string, string>): T {
  const result: Record<string, unknown> = {};

  for (const [key, raw] of Object.entries(envConf)) {
    // 去除空格并处理换行
    const value = raw.replace(/\\n/g, '\n');

    if (value === 'true') {
      result[key] = true;
    } else if (value === 'false') {
      result[key] = false;
    } else if (key.endsWith('_PORT') && /^\d+$/.test(value)) {
      // 转换端口号
      result[key] = Number(value);
    } else if (key === 'VITE_PROXY') {
      result[key] = value ? parseProxyList(value) : [];
    } else {
      result[key] = value;
    }
  }

  return result as T;
}
