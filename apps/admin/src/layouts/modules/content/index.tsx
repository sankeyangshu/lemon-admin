import { Outlet } from '@tanstack/react-router';
import { cn } from '@workspace/web-ui/lib/utils';

interface Props {
  /** 是否关闭内边距 */
  closePadding?: boolean;
}

function Content({ closePadding = false }: Props) {
  return (
    <div className={cn('bg-background h-full grow', !closePadding && 'p-4')}>
      <Outlet />
    </div>
  );
}

export default Content;
