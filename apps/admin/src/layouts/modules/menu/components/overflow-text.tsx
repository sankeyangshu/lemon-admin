import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/web-ui/components/tooltip';
import { useRef, useState, type ReactNode } from 'react';

interface OverflowTextProps {
  /** 显示的文案 */
  children: ReactNode;
}

/**
 * 菜单标题。
 * 只有文字实际超出容器宽度时才弹出 tooltip。
 */
const OverflowText = (props: OverflowTextProps) => {
  const { children } = props;

  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLSpanElement>(null);

  function handleMouseEnter() {
    const element = contentRef.current;

    if (!element) {
      return;
    }

    setOpen(element.scrollWidth > element.clientWidth);
  }

  function handleMouseLeave() {
    setOpen(false);
  }

  return (
    <Tooltip open={open}>
      <TooltipTrigger
        delay={0}
        render={
          <span
            ref={contentRef}
            className="block min-w-0 truncate"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {children}
          </span>
        }
      />
      <TooltipContent>{children}</TooltipContent>
    </Tooltip>
  );
};

export default OverflowText;
