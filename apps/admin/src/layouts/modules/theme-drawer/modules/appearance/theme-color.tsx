import { useTranslation } from '@workspace/web-i18n';
import { cn } from '@workspace/web-ui/lib/utils';

import { Divider } from '@/components/custom/divider';
import SvgIcon from '@/components/custom/svg-icon';
import { isThemeColor, THEME_COLOR_PRESETS } from '@/core/theme';
import { useAppStore } from '@/stores/app';

const ThemeColor = () => {
  const { t } = useTranslation();

  const themeColor = useAppStore((state) => state.system.theme.color);
  const setTheme = useAppStore((state) => state.setTheme);

  return (
    <>
      <Divider titlePlacement="center">{t('theme.drawer.appearance.themeColor')}</Divider>
      <div className="flex flex-wrap gap-1">
        {Object.entries(THEME_COLOR_PRESETS).map(([preset, color]) => {
          if (!isThemeColor(preset)) return null;

          return (
            <div
              key={preset}
              className={cn(
                `relative flex h-13 w-5 cursor-pointer items-center justify-center rounded-sm p-1 transition-all duration-300 ease-in-out`,
                themeColor === preset && 'w-13'
              )}
              style={{ backgroundColor: color }}
              onClick={() => setTheme('color', preset)}
            >
              <div
                className={cn(
                  `flex size-full items-center justify-center rounded-sm transition-all duration-300 ease-in-out hover:bg-white/30`,
                  themeColor === preset && 'bg-white/30'
                )}
              >
                {themeColor === preset && (
                  <SvgIcon icon="mdi:check" className="size-6 text-white" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ThemeColor;
