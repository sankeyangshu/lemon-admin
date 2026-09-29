import { useFullscreen } from '@reactuses/core';
import { useTranslation } from '@workspace/web-i18n';
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/web-ui/components/tooltip';

import FullScreen from '@/components/custom/full-screen';
import LocalePicker from '@/components/custom/locale-picker';
import MenuToggler from '@/components/custom/menu-toggler';
import SwitchDark from '@/components/custom/switch-dark';
import { useAdminMenus } from '@/core/menu';
import { GLOBAL_HEADER_MENU_ID } from '@/layouts/constant';

import Breadcrumb from '../breadcrumb';
import Logo from '../logo';
import GlobalSearch from './components/global-search';
import Notice from './components/notice';
import ThemeConfig from './components/theme-config';
import UserAvatar from './components/user-avatar';

interface HeaderProps {
  /** 布局模式 */
  layoutMode: App.Config.LayoutMode;
  /** 是否为移动端 */
  isMobile: boolean;
  /** 侧边栏宽度 */
  sidebarWidth: number;
}

interface HeaderModeConfig {
  /** 是否显示 logo */
  showLogo: boolean;
  /** 是否显示顶栏菜单 */
  showMenu: boolean;
  /** 是否显示菜单折叠按钮 */
  showMenuToggler: boolean;
}

function getHeaderModeConfig(
  layoutMode: App.Config.LayoutMode,
  isActiveFirstLevelMenuHasChildren: boolean
): HeaderModeConfig {
  const config: Record<App.Config.LayoutMode, HeaderModeConfig> = {
    vertical: {
      showLogo: false,
      showMenu: false,
      showMenuToggler: true,
    },
    'vertical-mix': {
      showLogo: false,
      showMenu: false,
      showMenuToggler: false,
    },
    'vertical-hybrid-header-first': {
      showLogo: !isActiveFirstLevelMenuHasChildren,
      showMenu: true,
      showMenuToggler: false,
    },
    horizontal: {
      showLogo: true,
      showMenu: true,
      showMenuToggler: false,
    },
    'top-hybrid-sidebar-first': {
      showLogo: true,
      showMenu: true,
      showMenuToggler: false,
    },
    'top-hybrid-header-first': {
      showLogo: true,
      showMenu: true,
      showMenuToggler: isActiveFirstLevelMenuHasChildren,
    },
  };

  return config[layoutMode];
}

const Header = (props: HeaderProps) => {
  const { layoutMode, isMobile, sidebarWidth } = props;

  const { t } = useTranslation();
  const [isFullscreen, { toggleFullscreen }] = useFullscreen(document.body);
  const { isActiveFirstLevelMenuHasChildren } = useAdminMenus();

  const { showLogo, showMenu, showMenuToggler } = getHeaderModeConfig(
    layoutMode,
    isActiveFirstLevelMenuHasChildren
  );

  return (
    <div className="bg-sidebar flex h-full items-center px-3">
      {showLogo && <Logo className="h-full" style={{ width: `${sidebarWidth}px` }} />}

      {showMenuToggler && <MenuToggler />}

      <div
        id={GLOBAL_HEADER_MENU_ID}
        className="flex h-full min-w-0 flex-1 items-center overflow-hidden"
      >
        {!isMobile && !showMenu && <Breadcrumb />}
      </div>

      <div className="flex h-full items-center justify-end gap-2">
        {/* 全局搜索 */}
        <GlobalSearch />

        {/* 全屏 */}
        {!isMobile && <FullScreen fullscreen={isFullscreen} onToggle={toggleFullscreen} />}

        {/* 语言切换 */}
        <Tooltip>
          <TooltipTrigger
            render={(triggerProps) => (
              <div {...triggerProps}>
                <LocalePicker className="size-5!" />
              </div>
            )}
          />
          <TooltipContent side="left">
            <p>{t('theme.header.locale')}</p>
          </TooltipContent>
        </Tooltip>

        {/* 通知 */}
        <Tooltip>
          <TooltipTrigger
            render={(triggerProps) => (
              <div {...triggerProps}>
                <Notice className="size-5!" />
              </div>
            )}
          />
          <TooltipContent side="left">
            <p>{t('theme.header.notice.title')}</p>
          </TooltipContent>
        </Tooltip>

        {/* 主题模式 */}
        <Tooltip>
          <TooltipTrigger
            render={(triggerProps) => (
              <div {...triggerProps}>
                <SwitchDark className="size-5!" />
              </div>
            )}
          />
          <TooltipContent>
            <p>{t('theme.header.themeMode')}</p>
          </TooltipContent>
        </Tooltip>

        {/* 主题配置 */}
        <ThemeConfig />

        {/* 用户信息 */}
        <UserAvatar />
      </div>
    </div>
  );
};

export default Header;
