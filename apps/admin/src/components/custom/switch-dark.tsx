import { Button } from '@workspace/web-ui/components/button';
import { cn } from '@workspace/web-ui/lib/utils';
import { useState, type MouseEvent } from 'react';

import { useTheme } from '@/core/theme';

import SvgIcon from './svg-icon';

interface SwitchDarkProps {
  /** 图标类名 */
  className?: string;
}

const SwitchDark = (props: SwitchDarkProps) => {
  const { className } = props;

  const [animationKey, setAnimationKey] = useState(0);
  const { darkMode, setTheme } = useTheme();

  function handleToggle(event: MouseEvent<HTMLButtonElement>) {
    setTheme(darkMode ? 'light' : 'dark', event);
    // 通过改变 key 来强制重新渲染图标，从而重新触发动画
    setAnimationKey((prev) => prev + 1);
  }

  return (
    <Button variant="ghost" className="cursor-pointer" onClick={handleToggle}>
      <div className="flex size-6 items-center justify-center">
        <SvgIcon
          key={`${darkMode ? 'dark' : 'light'}-${animationKey}`}
          icon={
            darkMode
              ? 'line-md:sunny-outline-to-moon-transition'
              : 'line-md:moon-to-sunny-outline-transition'
          }
          className={cn('size-6 text-gray-700 dark:text-gray-300', className)}
        />
      </div>
    </Button>
  );
};

export default SwitchDark;
