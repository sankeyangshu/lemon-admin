import { useTranslation } from '@workspace/web-i18n';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/web-ui/components/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/web-ui/components/tooltip';
import { useShallow } from 'zustand/react/shallow';

import { Divider } from '@/components/custom/divider';
import SvgIcon from '@/components/custom/svg-icon';
import { useAppStore } from '@/stores/app';

import SettingItem from '../../components/setting-item';

const ContentSettings = () => {
  const { t } = useTranslation();

  const { scrollMode, setLayout } = useAppStore(
    useShallow((state) => ({
      scrollMode: state.system.layout.scrollMode,
      setLayout: state.setLayout,
    }))
  );

  const modeOptions = [
    { label: t('theme.drawer.layout.content.scrollMode.wrapper'), value: 'wrapper' },
    { label: t('theme.drawer.layout.content.scrollMode.content'), value: 'content' },
  ];

  return (
    <>
      <Divider titlePlacement="center">{t('theme.drawer.layout.content.title')}</Divider>
      <SettingItem
        label={t('theme.drawer.layout.content.scrollMode.title')}
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
              <p>{t('theme.drawer.layout.content.scrollMode.tip')}</p>
            </TooltipContent>
          </Tooltip>
        }
      >
        <Select
          items={modeOptions}
          value={scrollMode}
          onValueChange={(value) =>
            setLayout('scrollMode', value as App.Config.System['layout']['scrollMode'])
          }
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
    </>
  );
};

export default ContentSettings;
