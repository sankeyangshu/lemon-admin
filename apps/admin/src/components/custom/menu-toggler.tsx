import { useTranslation } from '@workspace/web-i18n';
import { Button } from '@workspace/web-ui/components/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/web-ui/components/tooltip';
import { useState } from 'react';

import { useAppStore } from '@/stores/app';

import SvgIcon from './svg-icon';

const MenuToggler = () => {
  const { t } = useTranslation();

  const [animationKey, setAnimationKey] = useState(0);
  const sidebarCollapse = useAppStore((state) => state.system.settings.sidebarCollapse);
  const setSettings = useAppStore((state) => state.setSettings);

  function handleToggle() {
    setSettings('sidebarCollapse', !sidebarCollapse);
    setAnimationKey((prev) => prev + 1);
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button variant="ghost" onClick={handleToggle}>
            <div className="flex size-5 items-center justify-center">
              <SvgIcon
                key={`${sidebarCollapse ? 'right' : 'left'}-${animationKey}`}
                icon={sidebarCollapse ? 'line-md:menu-fold-right' : 'line-md:menu-fold-left'}
                className="size-5!"
              />
            </div>
          </Button>
        }
      />
      <TooltipContent>
        <p>
          {sidebarCollapse
            ? t('theme.header.menuToggler.expand')
            : t('theme.header.menuToggler.collapse')}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

export default MenuToggler;
