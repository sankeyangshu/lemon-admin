import { useMediaQuery } from '@reactuses/core';
import { createContext, use, type ReactNode } from 'react';

/** 对齐 Tailwind `--breakpoint-md: 48rem`（浏览器默认字号 16px 时为 768px） */
const MOBILE_MEDIA_QUERY = '(width < 48rem)';

interface AdminLayoutContextValue {
  /** 是否为移动端 */
  isMobile: boolean;
}

interface AdminLayoutProviderProps {
  /** 子组件 */
  children: ReactNode;
}

const AdminLayoutContext = createContext<AdminLayoutContextValue | null>(null);

export const AdminLayoutProvider = (props: AdminLayoutProviderProps) => {
  const { children } = props;

  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  return <AdminLayoutContext value={{ isMobile }}>{children}</AdminLayoutContext>;
};

// oxlint-disable-next-line react/only-export-components
export function useAdminLayoutContext() {
  const context = use(AdminLayoutContext);

  if (!context) {
    throw new Error('useAdminLayoutContext must be used within AdminLayoutProvider');
  }

  return context;
}
