import { useTranslation } from '@workspace/web-i18n';
import { Button } from '@workspace/web-ui/components/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/web-ui/components/tooltip';

import SvgIcon from './svg-icon';

interface FullScreenProps {
  /** 当前是否处于全屏 */
  fullscreen: boolean;
  /** 切换全屏状态 */
  onToggle: () => void;
}

const FullScreen = (props: FullScreenProps) => {
  const { fullscreen, onToggle } = props;

  const { t } = useTranslation();

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button variant="ghost" className="group cursor-pointer" onClick={onToggle}>
            <SvgIcon
              icon={fullscreen ? 'mdi:fullscreen-exit' : 'mdi:fullscreen'}
              className="size-6"
            />
          </Button>
        }
      />
      <TooltipContent>
        <p>{fullscreen ? t('theme.header.fullScreen.exit') : t('theme.header.fullScreen.enter')}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default FullScreen;
