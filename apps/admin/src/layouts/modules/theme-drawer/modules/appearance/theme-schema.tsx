import { useTranslation } from '@workspace/web-i18n';
import { Switch } from '@workspace/web-ui/components/switch';
import { cn } from '@workspace/web-ui/lib/utils';
import { useShallow } from 'zustand/react/shallow';

import darkImg from '@/assets/images/dark.png';
import lightImg from '@/assets/images/light.png';
import systemImg from '@/assets/images/system.png';
import { Divider } from '@/components/custom/divider';
import { useTheme, type ThemeMode } from '@/core/theme';
import { useAppStore } from '@/stores/app';

import SettingItem from '../../components/setting-item';

interface ThemeItem {
  /** 选项展示文案 */
  label: string;
  /** 对应的主题模式 */
  value: ThemeMode;
  /** 预览图 */
  img: string;
}

const ThemeSchema = () => {
  const { t } = useTranslation();
  const { theme, darkMode, setTheme } = useTheme();

  const { layoutMode, inverted, greyMode, weakMode, setThemeConfig, setSidebar } = useAppStore(
    useShallow((state) => ({
      layoutMode: state.system.layout.mode,
      inverted: state.system.sidebar.inverted,
      greyMode: state.system.theme.greyMode,
      weakMode: state.system.theme.weakMode,
      setThemeConfig: state.setTheme,
      setSidebar: state.setSidebar,
    }))
  );

  const settingThemeList: ThemeItem[] = [
    {
      label: t('theme.drawer.appearance.themeSchema.light'),
      value: 'light',
      img: lightImg,
    },
    {
      label: t('theme.drawer.appearance.themeSchema.dark'),
      value: 'dark',
      img: darkImg,
    },
    {
      label: t('theme.drawer.appearance.themeSchema.auto'),
      value: 'system',
      img: systemImg,
    },
  ];
  const showSidebarInverted = !darkMode && layoutMode.includes('vertical');

  return (
    <>
      <Divider titlePlacement="center">{t('theme.drawer.appearance.themeSchema.title')}</Divider>
      <div className="flex flex-col items-stretch gap-4">
        <div className="flex w-full flex-wrap items-center gap-4">
          {settingThemeList.map((item) => (
            <div key={item.value} className="flex w-3/10 flex-col items-center justify-center">
              <div
                className={cn(
                  `box-border flex h-13 cursor-pointer overflow-hidden rounded-lg border-2 transition-all duration-100`,
                  theme === item.value ? 'border-primary' : `border-border hover:border-primary/50`
                )}
                onClick={() => setTheme(item.value)}
              >
                <img
                  src={item.img}
                  alt={item.label}
                  className="pointer-events-none size-full object-cover"
                />
              </div>
              <div className="mt-1.5 text-sm">{item.label}</div>
            </div>
          ))}
        </div>

        <div
          className={cn(
            'grid overflow-hidden transition-all duration-300',
            showSidebarInverted
              ? 'translate-x-0 grid-rows-[1fr] opacity-100'
              : 'translate-x-5 grid-rows-[0fr] opacity-0'
          )}
        >
          <SettingItem
            label={t('theme.drawer.layout.sidebar.inverted')}
            className="overflow-hidden"
          >
            <Switch
              checked={inverted}
              onCheckedChange={(checked) => setSidebar('inverted', checked)}
            />
          </SettingItem>
        </div>

        <SettingItem label={t('theme.drawer.appearance.greyMode')}>
          <Switch
            checked={greyMode}
            onCheckedChange={(checked) => setThemeConfig('greyMode', checked)}
          />
        </SettingItem>
        <SettingItem label={t('theme.drawer.appearance.weakMode')}>
          <Switch
            checked={weakMode}
            onCheckedChange={(checked) => setThemeConfig('weakMode', checked)}
          />
        </SettingItem>
      </div>
    </>
  );
};

export default ThemeSchema;
