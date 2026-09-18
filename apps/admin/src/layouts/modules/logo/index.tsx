import { useTranslation } from '@workspace/web-i18n';
import { cn } from '@workspace/web-ui/lib/utils';

import SvgIcon from '@/components/custom/svg-icon';

function Logo({
  showTitle = true,
  className,
  ...props
}: {
  showTitle?: boolean;
  className?: string;
} & React.ComponentProps<'div'>) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        'flex w-full items-center justify-center overflow-hidden whitespace-nowrap',
        className
      )}
      {...props}
    >
      <SvgIcon localIcon="icon-logo" className="size-8" />
      {showTitle && (
        <h2 className="text-primary pl-2 text-base font-bold transition duration-300 ease-in-out">
          {t('system.title')}
        </h2>
      )}
    </div>
  );
}

export default Logo;
