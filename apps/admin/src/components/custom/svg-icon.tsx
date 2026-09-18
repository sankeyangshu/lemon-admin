import type { IconifyIcon } from '@iconify/react';
import { Icon } from '@iconify/react';
import { isNotNil } from 'es-toolkit';
import type { CSSProperties } from 'react';
import type { SvgName } from '~virtual/svg-component';
import LocalSvgIcon from '~virtual/svg-component';

interface SvgIconProps {
  /** 自定义类名 */
  className?: string;

  /** Iconify 图标名称 */
  icon?: string | IconifyIcon;

  /** 本地 SVG 图标名称 */
  localIcon?: SvgName;

  /** 样式 */
  style?: CSSProperties;
}

const SvgIcon = (props: SvgIconProps) => {
  const { icon, localIcon, className, style } = props;

  if (isNotNil(localIcon)) {
    return <LocalSvgIcon name={localIcon} className={className} style={style} />;
  }

  if (isNotNil(icon)) {
    return <Icon icon={icon} className={className} style={style} />;
  }

  return null;
};

export default SvgIcon;
