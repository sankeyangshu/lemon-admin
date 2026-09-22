import { cn } from '@workspace/web-ui/lib/utils';

interface SettingItemProps {
  /** 覆盖默认横排布局的样式 */
  className?: string;
  /** 左侧标题 */
  label: React.ReactNode;
  /** 标题旁的辅助内容，例如说明图标 */
  suffix?: React.ReactNode;
  /** 右侧设置控件 */
  children?: React.ReactNode;
}

const SettingItem = (props: SettingItemProps) => {
  const { className, label, suffix, children } = props;

  return (
    <div className={cn('flex w-full items-center justify-between', className)}>
      <div className="flex items-center gap-2">
        <span className="text-sm">{label}</span>
        {suffix}
      </div>
      {children}
    </div>
  );
};

export default SettingItem;
