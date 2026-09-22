import { useTranslation } from '@workspace/web-i18n';
import { Button } from '@workspace/web-ui/components/button';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@workspace/web-ui/components/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/web-ui/components/tabs';
import { useShallow } from 'zustand/react/shallow';

import { useAppStore } from '@/stores/app';

import Appearance from './modules/appearance';
import General from './modules/general';
import Layout from './modules/layout';

const ThemeDrawer = () => {
  const { t } = useTranslation();

  const { showThemeDrawer, toggleThemeDrawer } = useAppStore(
    useShallow((state) => ({
      showThemeDrawer: state.system.settings.showThemeDrawer,
      toggleThemeDrawer: state.toggleThemeDrawer,
    }))
  );

  return (
    <Sheet open={showThemeDrawer} onOpenChange={toggleThemeDrawer}>
      <SheetContent side="right" className="z-100" aria-describedby={undefined}>
        <SheetHeader>
          <SheetTitle>{t('theme.drawer.title')}</SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="appearance" className="w-full flex-1 flex-col overflow-hidden">
          <div className="px-4">
            <TabsList className="w-full group-data-horizontal/tabs:h-10">
              <TabsTrigger value="appearance">{t('theme.drawer.tabs.appearance')}</TabsTrigger>
              <TabsTrigger value="layout">{t('theme.drawer.tabs.layout')}</TabsTrigger>
              <TabsTrigger value="general">{t('theme.drawer.tabs.general')}</TabsTrigger>
            </TabsList>
          </div>
          <div className="no-scrollbar flex-1 overflow-y-auto px-4">
            <TabsContent value="appearance">
              <Appearance />
            </TabsContent>
            <TabsContent value="layout">
              <Layout />
            </TabsContent>
            <TabsContent value="general">
              <General />
            </TabsContent>
          </div>
        </Tabs>

        <SheetFooter className="flex-row gap-2">
          <Button className="flex-1">{t('theme.drawer.footer.copyConfig')}</Button>
          <Button variant="outline" className="flex-1">
            {t('theme.drawer.footer.resetConfig')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ThemeDrawer;
