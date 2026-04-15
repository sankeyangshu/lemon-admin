import process from 'node:process';
import { red } from 'ansis';

const NEWLINE_RE = /\\n/g;

/**
 * 读取并处理所有环境变量配置文件
 * @param envConf - 环境变量配置文件
 */
export function wrapperEnv(envConf: Record<string, string>): Env.ImportMeta {
  const ret: Record<string, any> = {};

  for (const envName of Object.keys(envConf)) {
    const envValue = envConf[envName];

    if (!envValue) {
      continue;
    }

    // 去除空格并处理换行
    let realName: string | number | boolean | [string, string][] = envValue.replace(NEWLINE_RE, '\n');

    // 转换布尔值
    if (realName === 'true') {
      realName = true;
    } else if (realName === 'false') {
      realName = false;
    }

    // 转换端口号
    if (envName === 'VITE_PORT' && typeof realName === 'string') {
      realName = Number(realName);
    }

    // 转换 JSON 配置
    if (envName === 'VITE_PROXY' && typeof realName === 'string') {
      try {
        realName = JSON.parse(realName) as [string, string][];
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        // eslint-disable-next-line no-console
        console.log(red(`wrapper vite env error:\n${errorMessage}`));
      }
    }

    ret[envName] = realName;

    // 只有字符串和数字类型的值才能设置到 process.env
    if (typeof realName === 'string' || typeof realName === 'number') {
      process.env[envName] = String(realName);
    }
  }

  return ret as Env.ImportMeta;
}
