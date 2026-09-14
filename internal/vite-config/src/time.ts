import { TZDate } from '@date-fns/tz';
import { format } from 'date-fns';

export interface GetLastBuildTimeOptions {
  /** date-fns format 字符串. */
  format?: string;

  /** 渲染构建时间使用的时区. */
  timezone?: string;
}

/**
 * 获取最后编译时间
 */
export function getLastBuildTime(options: GetLastBuildTimeOptions = {}) {
  const { format: dateFormat = 'yyyy-MM-dd HH:mm:ss', timezone = 'Asia/Shanghai' } = options;

  return format(new TZDate(Date.now(), timezone), dateFormat);
}
