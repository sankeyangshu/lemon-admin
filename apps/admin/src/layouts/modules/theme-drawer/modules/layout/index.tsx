import ContentSettings from './content-settings';
import FooterSettings from './footer-settings';
import HeaderSettings from './header-settings';
import LayoutMode from './layout-mode';
import SidebarSettings from './sidebar-settings';
import TabSettings from './tab-settings';

const Layout = () => {
  return (
    <div className="flex flex-col items-stretch gap-4">
      <LayoutMode />
      <HeaderSettings />
      <TabSettings />
      <SidebarSettings />
      <FooterSettings />
      <ContentSettings />
    </div>
  );
};

export default Layout;
