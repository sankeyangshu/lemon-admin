import HorizontalMenu from './modules/horizontal';
import TopHybridHeaderFirstMenu from './modules/top-hybrid-header-first';
import TopHybridSidebarFirstMenu from './modules/top-hybrid-sidebar-first';
import VerticalMenu from './modules/vertical';
import VerticalHybridHeaderFirstMenu from './modules/vertical-hybrid-header-first';
import VerticalMixMenu from './modules/vertical-mix';

const MenuComponents: Record<App.Config.LayoutMode, React.ComponentType> = {
  vertical: VerticalMenu,
  'vertical-mix': VerticalMixMenu,
  'vertical-hybrid-header-first': VerticalHybridHeaderFirstMenu,
  horizontal: HorizontalMenu,
  'top-hybrid-sidebar-first': TopHybridSidebarFirstMenu,
  'top-hybrid-header-first': TopHybridHeaderFirstMenu,
};

interface MenuProps {
  /** 当前布局模式，决定渲染哪一套菜单 */
  layoutMode: App.Config.LayoutMode;
}

const Menu = (props: MenuProps) => {
  const { layoutMode } = props;

  const ActiveMenu = MenuComponents[layoutMode];

  return <ActiveMenu />;
};

export default Menu;
