import type { ReactNode } from 'react';

import Teleport from '@/components/custom/teleport';
import { useAdminLayoutContext } from '@/layouts/context';

interface MenuPortalProps {
  /** 跟随布局容器重新挂载的菜单内容。 */
  children: ReactNode;
  /** 菜单内容需要挂载到的布局容器。 */
  to: string | HTMLElement | null;
}

const MenuPortal = (props: MenuPortalProps) => {
  const { children, to } = props;

  const { isMobile } = useAdminLayoutContext();

  const targetKey = getTargetKey(to);

  return (
    <Teleport to={to} key={`${isMobile ? 'mobile' : 'desktop'}:${targetKey}`}>
      {children}
    </Teleport>
  );
};

function getTargetKey(to: MenuPortalProps['to']) {
  if (typeof to === 'string') {
    return to;
  }

  if (to instanceof HTMLElement) {
    return to.id.length > 0 ? to.id : 'element';
  }

  return 'none';
}

export default MenuPortal;
