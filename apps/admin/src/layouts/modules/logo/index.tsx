import { useTranslation } from '@workspace/web-i18n';
import { cn } from '@workspace/web-ui/lib/utils';

import SvgIcon from '@/components/custom/svg-icon';

interface LogoProps extends React.ComponentProps<'div'> {
  /** 是否显示标题文字 */
  showTitle?: boolean;
}

const Logo = (props: LogoProps) => {
  const { showTitle = true, className, ...rest } = props;

  const { t } = useTranslation();

  return (
    <div
      className={cn(
        'flex w-full items-center justify-center overflow-hidden whitespace-nowrap',
        className
      )}
      {...rest}
    >
      <SvgIcon localIcon="icon-logo" className="size-8!" />
      {showTitle ? (
        <h2 className="text-primary pl-2 text-base font-bold transition duration-300 ease-in-out">
          {t('system.title')}
        </h2>
      ) : null}
    </div>
  );
};

export default Logo;
