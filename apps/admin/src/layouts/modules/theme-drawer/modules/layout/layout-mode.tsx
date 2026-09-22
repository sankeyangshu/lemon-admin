import { useMediaQuery } from '@reactuses/core';
import { useTranslation } from '@workspace/web-i18n';
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/web-ui/components/tooltip';
import { cn } from '@workspace/web-ui/lib/utils';

import { Divider } from '@/components/custom/divider';
import { useAppStore } from '@/stores/app';

/** 各布局模式的缩略预览，与实例无关 */
const LAYOUT_PREVIEWS: Record<App.Config.LayoutMode, React.ReactNode> = {
  vertical: (
    <>
      <div className="bg-primary h-full w-4.5 rounded-sm" />
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="bg-primary/60 h-4 rounded-sm" />
        <div className="bg-primary/60 flex-1 rounded-sm" />
      </div>
    </>
  ),
  'vertical-mix': (
    <>
      <div className="bg-primary h-full w-2 rounded-sm" />
      <div className="bg-primary/80 h-full w-4 rounded-sm" />
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="bg-primary/60 h-4 rounded-sm" />
        <div className="bg-primary/60 flex-1 rounded-sm" />
      </div>
    </>
  ),
  'vertical-hybrid-header-first': (
    <>
      <div className="bg-primary h-full w-2 rounded-sm" />
      <div className="bg-primary/80 h-full w-4 rounded-sm" />
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="bg-primary h-4 rounded-sm" />
        <div className="bg-primary/60 flex-1 rounded-sm" />
      </div>
    </>
  ),
  horizontal: (
    <>
      <div className="bg-primary h-4 rounded-sm" />
      <div className="flex flex-1 gap-1.5">
        <div className="bg-primary/60 flex-1 rounded-sm" />
      </div>
    </>
  ),
  'top-hybrid-sidebar-first': (
    <>
      <div className="bg-primary h-4 rounded-sm" />
      <div className="flex flex-1 gap-1.5">
        <div className="bg-primary w-4.5 rounded-sm" />
        <div className="bg-primary/60 flex-1 rounded-sm" />
      </div>
    </>
  ),
  'top-hybrid-header-first': (
    <>
      <div className="bg-primary h-4 rounded-sm" />
      <div className="flex flex-1 gap-1.5">
        <div className="bg-primary w-4.5 rounded-sm" />
        <div className="bg-primary/60 flex-1 rounded-sm" />
      </div>
    </>
  ),
};

/**
 * 布局卡片配置项
 */
type LayoutConfig = Record<
  App.Config.LayoutMode,
  {
    /** 卡片下方的模式名称 */
    title: string;
    /** Tooltip 弹出方向 */
    placement: React.ComponentProps<typeof TooltipContent>['side'];
  }
>;

interface LayoutModeCardProps {
  /** 当前选中的布局模式 */
  mode: App.Config.LayoutMode;
  /** 视口小于 md 时禁止切换布局 */
  disabled?: boolean;
  /** 各布局模式的缩略预览 */
  previews: Record<App.Config.LayoutMode, React.ReactNode>;
}

const LayoutModeCard = (props: LayoutModeCardProps) => {
  const { mode, disabled = false, previews } = props;

  const { t } = useTranslation();

  const setLayout = useAppStore((state) => state.setLayout);

  const layoutConfig: LayoutConfig = {
    vertical: {
      title: t('theme.drawer.layout.layoutMode.vertical'),
      placement: 'bottom',
    },
    'vertical-mix': {
      title: t('theme.drawer.layout.layoutMode.vertical-mix'),
      placement: 'bottom',
    },
    'vertical-hybrid-header-first': {
      title: t('theme.drawer.layout.layoutMode.vertical-hybrid-header-first'),
      placement: 'bottom',
    },
    horizontal: {
      title: t('theme.drawer.layout.layoutMode.horizontal'),
      placement: 'bottom',
    },
    'top-hybrid-sidebar-first': {
      title: t('theme.drawer.layout.layoutMode.top-hybrid-sidebar-first'),
      placement: 'bottom',
    },
    'top-hybrid-header-first': {
      title: t('theme.drawer.layout.layoutMode.top-hybrid-header-first'),
      placement: 'bottom',
    },
  };

  function handleChangeMode(nextMode: App.Config.LayoutMode) {
    if (disabled) return;

    setLayout('mode', nextMode);
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-3">
      {Object.entries(layoutConfig).map(([key, item]) => (
        <div
          key={key}
          className="flex cursor-pointer flex-col items-center justify-center"
          onClick={() => handleChangeMode(key as App.Config.LayoutMode)}
        >
          <Tooltip>
            <TooltipTrigger
              render={(triggerProps) => (
                <div
                  {...triggerProps}
                  className={cn(
                    `hover:ring-primary h-16 w-24 gap-1.5 rounded-sm p-1.5 ring-2 ring-transparent transition-all`,
                    mode === key && 'ring-primary!'
                  )}
                >
                  <div
                    className={cn(
                      'size-full gap-1',
                      key.includes('vertical') ? 'flex' : `flex flex-col`
                    )}
                  >
                    {previews[key as App.Config.LayoutMode]}
                  </div>
                </div>
              )}
            />
            <TooltipContent side={item.placement}>
              <p>{t(`theme.drawer.layout.layoutMode.${key}_detail`)}</p>
            </TooltipContent>
          </Tooltip>
          <p className="mt-2 text-xs">{item.title}</p>
        </div>
      ))}
    </div>
  );
};

const LayoutMode = () => {
  const { t } = useTranslation();

  const layoutMode = useAppStore((state) => state.system.layout.mode);
  // 对齐 Tailwind `--breakpoint-md: 48rem`（浏览器默认字号 16px 时为 768px）
  const isMobile = useMediaQuery('(width < 48rem)');

  return (
    <>
      <Divider titlePlacement="center">{t('theme.drawer.layout.layoutMode.title')}</Divider>
      <LayoutModeCard mode={layoutMode} disabled={isMobile} previews={LAYOUT_PREVIEWS} />
    </>
  );
};

export default LayoutMode;
