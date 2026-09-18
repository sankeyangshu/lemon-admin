import { Outlet } from '@tanstack/react-router';
import { cn } from '@workspace/web-ui/lib/utils';

interface ContentProps {
  /** 是否关闭内边距 */
  closePadding?: boolean;
}

const Content = (props: ContentProps) => {
  const { closePadding = false } = props;

  return (
    <div className={cn('bg-background h-full grow', !closePadding && 'p-4')}>
      <Outlet />
    </div>
  );
};

export default Content;
