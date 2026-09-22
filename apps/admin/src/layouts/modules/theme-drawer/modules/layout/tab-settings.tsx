import { useTranslation } from '@workspace/web-i18n';
import { Input } from '@workspace/web-ui/components/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/web-ui/components/select';
import { Switch } from '@workspace/web-ui/components/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/web-ui/components/tooltip';
import { useShallow } from 'zustand/react/shallow';

import { Divider } from '@/components/custom/divider';
import SvgIcon from '@/components/custom/svg-icon';
import { useAppStore } from '@/stores/app';

import SettingItem from '../../components/setting-item';

const TabSettings = () => {
  const { t } = useTranslation();

  const { visible, cache, height, mode, closeTabByMiddleClick, setTab } = useAppStore(
    useShallow((state) => ({
      visible: state.system.tab.visible,
      cache: state.system.tab.cache,
      height: state.system.tab.height,
      mode: state.system.tab.mode,
      closeTabByMiddleClick: state.system.tab.closeTabByMiddleClick,
      setTab: state.setTab,
    }))
  );

  const modeOptions = [
    { label: t('theme.drawer.layout.tab.mode.chrome'), value: 'chrome' },
    { label: t('theme.drawer.layout.tab.mode.button'), value: 'button' },
    { label: t('theme.drawer.layout.tab.mode.slider'), value: 'slider' },
  ];

  return (
    <>
      <Divider titlePlacement="center">{t('theme.drawer.layout.tab.title')}</Divider>
      <div className="flex flex-col items-stretch gap-4">
        <SettingItem label={t('theme.drawer.layout.tab.visible')}>
          <Switch checked={visible} onCheckedChange={(checked) => setTab('visible', checked)} />
        </SettingItem>
        <SettingItem label={t('theme.drawer.layout.tab.cache')}>
          <Switch checked={cache} onCheckedChange={(checked) => setTab('cache', checked)} />
        </SettingItem>
        {visible && (
          <>
            <SettingItem label={t('theme.drawer.layout.tab.height')}>
              <Input
                type="number"
                value={height}
                onChange={(e) => setTab('height', Number(e.target.value))}
                className="w-full max-w-30"
              />
            </SettingItem>

            <SettingItem label={t('theme.drawer.layout.tab.mode.title')}>
              <Select
                items={modeOptions}
                value={mode}
                onValueChange={(value) => setTab('mode', value as App.Config.TabMode)}
              >
                <SelectTrigger className="w-full max-w-30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {modeOptions.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </SettingItem>

            <SettingItem
              label={t('theme.drawer.layout.tab.closeByMiddleClick')}
              suffix={
                <Tooltip>
                  <TooltipTrigger
                    render={(props) => (
                      <div {...props}>
                        <SvgIcon icon="mdi:help-circle" className="size-4!" />
                      </div>
                    )}
                  />
                  <TooltipContent>
                    <p>{t('theme.drawer.layout.tab.closeByMiddleClickTip')}</p>
                  </TooltipContent>
                </Tooltip>
              }
            >
              <Switch
                checked={closeTabByMiddleClick}
                onCheckedChange={(checked) => setTab('closeTabByMiddleClick', checked)}
              />
            </SettingItem>
          </>
        )}
      </div>
    </>
  );
};

export default TabSettings;
