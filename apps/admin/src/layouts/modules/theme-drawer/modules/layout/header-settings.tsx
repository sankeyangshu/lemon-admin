import { useTranslation } from '@workspace/web-i18n';
import { Input } from '@workspace/web-ui/components/input';
import { Switch } from '@workspace/web-ui/components/switch';
import { useShallow } from 'zustand/react/shallow';

import { Divider } from '@/components/custom/divider';
import { useAppStore } from '@/stores/app';

import SettingItem from '../../components/setting-item';

const HeaderSettings = () => {
  const { t } = useTranslation();

  const { height, breadcrumbVisible, breadcrumbShowIcon, setHeader } = useAppStore(
    useShallow((state) => ({
      height: state.system.header.height,
      breadcrumbVisible: state.system.header.breadcrumbVisible,
      breadcrumbShowIcon: state.system.header.breadcrumbShowIcon,
      setHeader: state.setHeader,
    }))
  );

  return (
    <>
      <Divider titlePlacement="center">{t('theme.drawer.layout.header.title')}</Divider>
      <SettingItem label={t('theme.drawer.layout.header.height')}>
        <Input
          type="number"
          value={height}
          onChange={(e) => setHeader('height', Number(e.target.value))}
          className="w-full max-w-30"
        />
      </SettingItem>
      <SettingItem label={t('theme.drawer.layout.header.breadcrumb.visible')}>
        <Switch
          checked={breadcrumbVisible}
          onCheckedChange={(checked) => setHeader('breadcrumbVisible', checked)}
        />
      </SettingItem>
      {breadcrumbVisible && (
        <SettingItem label={t('theme.drawer.layout.header.breadcrumb.showIcon')}>
          <Switch
            checked={breadcrumbShowIcon}
            onCheckedChange={(checked) => setHeader('breadcrumbShowIcon', checked)}
          />
        </SettingItem>
      )}
    </>
  );
};

export default HeaderSettings;
