import { TZDate } from '@date-fns/tz';
import { format } from 'date-fns';

/**
 * 获取最后编译时间
 */
export function getLastBuildTime() {
  const now = new TZDate(Date.now(), 'Asia/Shanghai');
  const buildTime = format(now, 'yyyy-MM-dd HH:mm:ss');

  return buildTime;
}
