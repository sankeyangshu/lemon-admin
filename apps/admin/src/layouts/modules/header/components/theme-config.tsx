import { useTranslation } from '@workspace/web-i18n';
import { Button } from '@workspace/web-ui/components/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/web-ui/components/tooltip';

import SvgIcon from '@/components/custom/svg-icon';
import { useAppStore } from '@/stores/app';

const ThemeConfig = () => {
  const { t } = useTranslation();
  const toggleThemeDrawer = useAppStore((state) => state.toggleThemeDrawer);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    toggleThemeDrawer();
    e.currentTarget.blur();
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button variant="ghost" className="group cursor-pointer" onClick={handleClick}>
            <SvgIcon
              icon="line-md:cog"
              className="size-5! transition-transform duration-500 group-hover:rotate-180"
            />
          </Button>
        }
      />
      <TooltipContent>
        <p>{t('theme.drawer.title')}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ThemeConfig;
