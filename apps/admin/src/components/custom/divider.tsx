import { cn } from '@workspace/web-ui/lib/utils';
import { isNil } from 'es-toolkit/predicate';

export interface DividerProps {
  /**
   * 嵌套的标题
   */
  children?: React.ReactNode;
  /**
   * 分割线样式类
   */
  className?: string;
  /**
   * 是否虚线
   * @default false
   */
  dashed?: boolean;
  /**
   * 水平或垂直类型
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * 文字是否显示为普通正文样式
   * @default false
   */
  plain?: boolean;
  /**
   * 分割线样式对象
   */
  style?: React.CSSProperties;
  /**
   * 间距大小，仅对水平布局有效
   * @default undefined
   */
  size?: 'small' | 'middle' | 'large';
  /**
   * 分割线标题的位置
   * @default 'center'
   */
  titlePlacement?: 'start' | 'center' | 'end';
  /**
   * 分割线是虚线、点线还是实线
   * @default 'solid'
   */
  variant?: 'solid' | 'dashed' | 'dotted';
  /**
   * 是否垂直
   * @default false
   */
  vertical?: boolean;
}

export const Divider = (props: DividerProps) => {
  const {
    children,
    className,
    dashed = false,
    orientation = 'horizontal',
    plain = false,
    style,
    size,
    titlePlacement = 'center',
    variant = 'solid',
    vertical = false,
  } = props;

  // 处理方向：vertical prop 优先级低于 orientation
  const finalOrientation = vertical ? 'vertical' : orientation;

  // 处理变体：dashed prop 优先级高于 variant
  const finalVariant = dashed ? 'dashed' : variant;

  // 垂直分割线
  if (finalOrientation === 'vertical') {
    return (
      <div
        className={cn(
          'inline-block h-[0.9em] w-px align-middle',
          'mx-2',
          'bg-border',
          finalVariant === 'dashed' && 'border-l border-dashed bg-transparent',
          finalVariant === 'dotted' && 'border-l border-dotted bg-transparent',
          className
        )}
        style={style}
        role="separator"
        aria-orientation="vertical"
      />
    );
  }

  // 水平分割线 - 无文字
  if (isNil(children)) {
    return (
      <div
        className={cn(
          'flex items-center',
          size === 'small' && 'my-2',
          size === 'middle' && 'my-4',
          size === 'large' && 'my-6',
          !size && 'my-6',
          className
        )}
        style={style}
        role="separator"
        aria-orientation="horizontal"
      >
        <div
          className={cn(
            'h-px w-full',
            'bg-border',
            finalVariant === 'dashed' && 'border-t border-dashed bg-transparent',
            finalVariant === 'dotted' && 'border-t border-dotted bg-transparent'
          )}
        />
      </div>
    );
  }

  // 水平分割线 - 带文字
  return (
    <div
      className={cn(
        'flex items-center',
        size === 'small' && 'my-2',
        size === 'middle' && 'my-4',
        size === 'large' && 'my-6',
        !size && 'my-6',
        className
      )}
      style={style}
      role="separator"
      aria-orientation="horizontal"
    >
      {/* 左侧分割线 */}
      {titlePlacement !== 'start' && (
        <div
          className={cn(
            'h-px',
            titlePlacement === 'center' ? 'flex-1' : 'w-full',
            'bg-border',
            finalVariant === 'dashed' && 'border-t border-dashed bg-transparent',
            finalVariant === 'dotted' && 'border-t border-dotted bg-transparent'
          )}
        />
      )}

      {/* 文字内容 */}
      <div
        className={cn(
          'shrink-0 px-4',
          plain ? 'text-sm text-muted-foreground' : 'text-base font-medium text-foreground'
        )}
      >
        {children}
      </div>

      {/* 右侧分割线 */}
      {titlePlacement !== 'end' && (
        <div
          className={cn(
            'h-px',
            titlePlacement === 'center' ? 'flex-1' : 'w-full',
            'bg-border',
            finalVariant === 'dashed' && 'border-t border-dashed bg-transparent',
            finalVariant === 'dotted' && 'border-t border-dotted bg-transparent'
          )}
        />
      )}
    </div>
  );
};
