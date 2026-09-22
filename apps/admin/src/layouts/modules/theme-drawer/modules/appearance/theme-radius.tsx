import { useTranslation } from '@workspace/web-i18n';
import { Input } from '@workspace/web-ui/components/input';

import { Divider } from '@/components/custom/divider';
import { useAppStore } from '@/stores/app';

import SettingItem from '../../components/setting-item';

const ThemeRadius = () => {
  const { t } = useTranslation();

  const themeRadius = useAppStore((state) => state.system.theme.radius);
  const setTheme = useAppStore((state) => state.setTheme);

  return (
    <>
      <Divider titlePlacement="center">{t('theme.drawer.appearance.themeRadius')}</Divider>
      <SettingItem label={t('theme.drawer.appearance.themeRadius')}>
        <Input
          type="number"
          value={themeRadius}
          onChange={(e) => setTheme('radius', Number(e.target.value))}
          className="w-full max-w-30"
        />
      </SettingItem>
    </>
  );
};

export default ThemeRadius;
