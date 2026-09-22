import { useTranslation } from '@workspace/web-i18n';
import { Input } from '@workspace/web-ui/components/input';
import { Switch } from '@workspace/web-ui/components/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/web-ui/components/tooltip';
import { useShallow } from 'zustand/react/shallow';

import { Divider } from '@/components/custom/divider';
import SvgIcon from '@/components/custom/svg-icon';
import { useAppStore } from '@/stores/app';

import SettingItem from '../../components/setting-item';

const SidebarSettings = () => {
  const { t } = useTranslation();

  const {
    layoutMode,
    width,
    collapsedWidth,
    mixWidth,
    mixCollapsedWidth,
    mixChildMenuWidth,
    autoSelectFirstMenu,
    setSidebar,
  } = useAppStore(
    useShallow((state) => ({
      layoutMode: state.system.layout.mode,
      width: state.system.sidebar.width,
      collapsedWidth: state.system.sidebar.collapsedWidth,
      mixWidth: state.system.sidebar.mixWidth,
      mixCollapsedWidth: state.system.sidebar.mixCollapsedWidth,
      mixChildMenuWidth: state.system.sidebar.mixChildMenuWidth,
      autoSelectFirstMenu: state.system.sidebar.autoSelectFirstMenu,
      setSidebar: state.setSidebar,
    }))
  );

  const isMixLayoutMode = layoutMode.includes('mix') || layoutMode.includes('hybrid');
  const isHybridLayoutMode = layoutMode.includes('hybrid');

  if (layoutMode === 'horizontal') return null;

  return (
    <>
      <Divider titlePlacement="center">{t('theme.drawer.layout.sidebar.title')}</Divider>
      {layoutMode === 'vertical' ? (
        <>
          <SettingItem label={t('theme.drawer.layout.sidebar.width')}>
            <Input
              type="number"
              value={width}
              onChange={(e) => setSidebar('width', Number(e.target.value))}
              className="w-full max-w-30"
            />
          </SettingItem>
          <SettingItem label={t('theme.drawer.layout.sidebar.collapsedWidth')}>
            <Input
              type="number"
              value={collapsedWidth}
              onChange={(e) => setSidebar('collapsedWidth', Number(e.target.value))}
              className="w-full max-w-30"
            />
          </SettingItem>
        </>
      ) : null}
      {isMixLayoutMode ? (
        <>
          <SettingItem label={t('theme.drawer.layout.sidebar.mixWidth')}>
            <Input
              type="number"
              value={mixWidth}
              onChange={(e) => setSidebar('mixWidth', Number(e.target.value))}
              className="w-full max-w-30"
            />
          </SettingItem>
          <SettingItem label={t('theme.drawer.layout.sidebar.mixCollapsedWidth')}>
            <Input
              type="number"
              value={mixCollapsedWidth}
              onChange={(e) => setSidebar('mixCollapsedWidth', Number(e.target.value))}
              className="w-full max-w-30"
            />
          </SettingItem>
        </>
      ) : null}
      {layoutMode === 'vertical-mix' ? (
        <SettingItem label={t('theme.drawer.layout.sidebar.mixChildMenuWidth')}>
          <Input
            type="number"
            value={mixChildMenuWidth}
            onChange={(e) => setSidebar('mixChildMenuWidth', Number(e.target.value))}
            className="w-full max-w-30"
          />
        </SettingItem>
      ) : null}
      {isHybridLayoutMode ? (
        <SettingItem
          label={t('theme.drawer.layout.sidebar.autoSelectFirstMenu')}
          suffix={
            <Tooltip>
              <TooltipTrigger
                render={(triggerProps) => (
                  <div {...triggerProps}>
                    <SvgIcon icon="mdi:help-circle" className="size-4!" />
                  </div>
                )}
              />
              <TooltipContent>
                <p>{t('theme.drawer.layout.sidebar.autoSelectFirstMenuTip')}</p>
              </TooltipContent>
            </Tooltip>
          }
        >
          <Switch
            checked={autoSelectFirstMenu}
            onCheckedChange={(checked) => setSidebar('autoSelectFirstMenu', checked)}
          />
        </SettingItem>
      ) : null}
    </>
  );
};

export default SidebarSettings;
